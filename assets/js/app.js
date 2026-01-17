/* M-PESEWA APP.JS */
/* Main application bootstrap, routing, and core functionality */

// ===== APP INITIALIZATION =====
class MpesewaApp {
    constructor() {
        this.currentUser = null;
        this.currentCountry = null;
        this.currentRole = null;
        this.currentGroup = null;
        this.isOnline = navigator.onLine;
        
        this.init();
    }
    
    // Initialize the application
    async init() {
        // Check authentication status
        await this.checkAuth();
        
        // Initialize event listeners
        this.initEventListeners();
        
        // Initialize service worker for PWA
        this.initServiceWorker();
        
        // Initialize offline detection
        this.initOfflineDetection();
        
        // Update UI based on auth state
        this.updateUI();
        
        // Load any saved state from localStorage
        this.loadSavedState();
        
        console.log('M-Pesewa App initialized');
    }
    
    // ===== AUTHENTICATION =====
    async checkAuth() {
        try {
            const userData = localStorage.getItem('mpesewa_user');
            const countryData = localStorage.getItem('mpesewa_country');
            const roleData = localStorage.getItem('mpesewa_role');
            const groupData = localStorage.getItem('mpesewa_group');
            
            if (userData) {
                this.currentUser = JSON.parse(userData);
            }
            
            if (countryData) {
                this.currentCountry = JSON.parse(countryData);
            }
            
            if (roleData) {
                this.currentRole = roleData;
            }
            
            if (groupData) {
                this.currentGroup = JSON.parse(groupData);
            }
            
            return this.currentUser !== null;
        } catch (error) {
            console.error('Auth check failed:', error);
            return false;
        }
    }
    
    async login(username, password, country) {
        try {
            // Simulate API call with static data
            const users = await this.loadDemoUsers();
            const user = users.find(u => u.username === username || u.email === username);
            
            if (!user) {
                throw new Error('User not found');
            }
            
            // In a real app, this would be a proper password check
            if (user.password !== password) {
                throw new Error('Invalid password');
            }
            
            // Check if user is in the selected country
            if (user.country !== country) {
                throw new Error('User not registered in selected country');
            }
            
            this.currentUser = user;
            this.currentCountry = await this.getCountryData(country);
            this.currentRole = user.role;
            
            // Save to localStorage
            localStorage.setItem('mpesewa_user', JSON.stringify(this.currentUser));
            localStorage.setItem('mpesewa_country', JSON.stringify(this.currentCountry));
            localStorage.setItem('mpesewa_role', this.currentRole);
            
            // Update UI
            this.updateUI();
            
            // Show success message
            this.showNotification('Successfully logged in!', 'success');
            
            // Redirect to appropriate dashboard
            setTimeout(() => {
                if (this.currentRole === 'lender') {
                    window.location.href = 'pages/dashboard/lender-dashboard.html';
                } else {
                    window.location.href = 'pages/dashboard/borrower-dashboard.html';
                }
            }, 1000);
            
            return true;
        } catch (error) {
            this.showNotification(error.message, 'error');
            return false;
        }
    }
    
    async register(userData) {
        try {
            // Validate required fields
            const required = ['fullName', 'phone', 'country', 'nationalId', 'role'];
            for (const field of required) {
                if (!userData[field]) {
                    throw new Error(`${field} is required`);
                }
            }
            
            // Check if username is available
            const users = await this.loadDemoUsers();
            if (users.some(u => u.username === userData.username)) {
                throw new Error('Username already taken');
            }
            
            // Generate user ID
            const userId = 'user_' + Date.now() + Math.random().toString(36).substr(2, 9);
            
            // Create user object
            const newUser = {
                id: userId,
                ...userData,
                createdAt: new Date().toISOString(),
                rating: 5,
                isActive: true,
                subscription: userData.role === 'lender' ? userData.subscriptionTier : null,
                subscriptionExpiry: userData.role === 'lender' ? this.calculateSubscriptionExpiry() : null,
                groups: [],
                loans: [],
                ledgers: []
            };
            
            // Save to localStorage (in real app, this would be API call)
            const existingUsers = JSON.parse(localStorage.getItem('mpesewa_demo_users') || '[]');
            existingUsers.push(newUser);
            localStorage.setItem('mpesewa_demo_users', JSON.stringify(existingUsers));
            
            // Auto-login
            this.currentUser = newUser;
            this.currentCountry = await this.getCountryData(userData.country);
            this.currentRole = userData.role;
            
            localStorage.setItem('mpesewa_user', JSON.stringify(this.currentUser));
            localStorage.setItem('mpesewa_country', JSON.stringify(this.currentCountry));
            localStorage.setItem('mpesewa_role', this.currentRole);
            
            // Update UI
            this.updateUI();
            
            this.showNotification('Registration successful!', 'success');
            
            // Redirect
            setTimeout(() => {
                if (this.currentRole === 'lender') {
                    window.location.href = 'pages/dashboard/lender-dashboard.html';
                } else {
                    window.location.href = 'pages/dashboard/borrower-dashboard.html';
                }
            }, 1500);
            
            return true;
        } catch (error) {
            this.showNotification(error.message, 'error');
            return false;
        }
    }
    
    logout() {
        this.currentUser = null;
        this.currentCountry = null;
        this.currentRole = null;
        this.currentGroup = null;
        
        localStorage.removeItem('mpesewa_user');
        localStorage.removeItem('mpesewa_country');
        localStorage.removeItem('mpesewa_role');
        localStorage.removeItem('mpesewa_group');
        
        this.updateUI();
        this.showNotification('Logged out successfully', 'success');
        
        // Redirect to home
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }
    
    // ===== COUNTRY MANAGEMENT =====
    async getCountryData(countryCode) {
        try {
            const response = await fetch('data/countries.json');
            const countries = await response.json();
            return countries.find(c => c.code === countryCode);
        } catch (error) {
            console.error('Error loading country data:', error);
            return null;
        }
    }
    
    async getAllCountries() {
        try {
            const response = await fetch('data/countries.json');
            return await response.json();
        } catch (error) {
            console.error('Error loading countries:', error);
            return [];
        }
    }
    
    // ===== GROUP MANAGEMENT =====
    async joinGroup(groupId) {
        try {
            const groups = await this.loadDemoGroups();
            const group = groups.find(g => g.id === groupId);
            
            if (!group) {
                throw new Error('Group not found');
            }
            
            // Check if user is already in the group
            if (group.members.some(m => m.userId === this.currentUser.id)) {
                throw new Error('Already a member of this group');
            }
            
            // Check borrower group limit (max 4 groups)
            if (this.currentRole === 'borrower') {
                const userGroups = groups.filter(g => 
                    g.members.some(m => m.userId === this.currentUser.id)
                );
                
                if (userGroups.length >= 4) {
                    throw new Error('Borrowers can join maximum 4 groups');
                }
            }
            
            // Add user to group
            group.members.push({
                userId: this.currentUser.id,
                role: this.currentRole,
                joinedAt: new Date().toISOString()
            });
            
            // Update localStorage
            localStorage.setItem('mpesewa_demo_groups', JSON.stringify(groups));
            
            // Set current group
            this.currentGroup = group;
            localStorage.setItem('mpesewa_group', JSON.stringify(group));
            
            this.showNotification(`Joined ${group.name} successfully!`, 'success');
            return true;
        } catch (error) {
            this.showNotification(error.message, 'error');
            return false;
        }
    }
    
    async createGroup(groupData) {
        try {
            // Validate
            if (!groupData.name || !groupData.type) {
                throw new Error('Group name and type are required');
            }
            
            // Generate group ID
            const groupId = 'group_' + Date.now() + Math.random().toString(36).substr(2, 9);
            
            // Create group object
            const newGroup = {
                id: groupId,
                ...groupData,
                country: this.currentCountry.code,
                createdAt: new Date().toISOString(),
                founderId: this.currentUser.id,
                members: [{
                    userId: this.currentUser.id,
                    role: this.currentRole,
                    joinedAt: new Date().toISOString(),
                    isAdmin: true
                }],
                loanRequests: [],
                totalLent: 0,
                repaymentRate: 100,
                isActive: true
            };
            
            // Save to localStorage
            const groups = await this.loadDemoGroups();
            groups.push(newGroup);
            localStorage.setItem('mpesewa_demo_groups', JSON.stringify(groups));
            
            // Set as current group
            this.currentGroup = newGroup;
            localStorage.setItem('mpesewa_group', JSON.stringify(newGroup));
            
            this.showNotification(`Group "${groupData.name}" created successfully!`, 'success');
            return true;
        } catch (error) {
            this.showNotification(error.message, 'error');
            return false;
        }
    }
    
    // ===== LOAN MANAGEMENT =====
    async requestLoan(loanData) {
        try {
            // Validate
            if (!this.currentGroup) {
                throw new Error('You must be in a group to request a loan');
            }
            
            if (!loanData.category || !loanData.amount || !loanData.purpose) {
                throw new Error('All loan details are required');
            }
            
            // Check if borrower already has an active loan in this group
            const groups = await this.loadDemoGroups();
            const currentGroup = groups.find(g => g.id === this.currentGroup.id);
            
            if (currentGroup.loanRequests.some(lr => 
                lr.borrowerId === this.currentUser.id && 
                lr.status === 'pending'
            )) {
                throw new Error('You already have an active loan request in this group');
            }
            
            // Create loan request
            const loanRequest = {
                id: 'loan_' + Date.now() + Math.random().toString(36).substr(2, 9),
                ...loanData,
                borrowerId: this.currentUser.id,
                groupId: this.currentGroup.id,
                requestedAt: new Date().toISOString(),
                status: 'pending',
                fundedAmount: 0,
                lenders: [],
                repaymentDue: this.calculateRepaymentDate(loanData.tenure || 7)
            };
            
            // Add to group
            currentGroup.loanRequests.push(loanRequest);
            
            // Update localStorage
            localStorage.setItem('mpesewa_demo_groups', JSON.stringify(groups));
            
            // Update current group
            this.currentGroup = currentGroup;
            localStorage.setItem('mpesewa_group', JSON.stringify(currentGroup));
            
            this.showNotification('Loan request submitted!', 'success');
            return true;
        } catch (error) {
            this.showNotification(error.message, 'error');
            return false;
        }
    }
    
    async lendToLoan(loanId, amount) {
        try {
            // Check if user is a lender
            if (this.currentRole !== 'lender') {
                throw new Error('Only lenders can lend');
            }
            
            // Check subscription status
            if (!this.currentUser.subscription || !this.currentUser.subscriptionExpiry) {
                throw new Error('Active subscription required for lending');
            }
            
            if (new Date(this.currentUser.subscriptionExpiry) < new Date()) {
                throw new Error('Subscription expired. Please renew to continue lending');
            }
            
            // Check subscription tier limits
            const tierLimit = this.getTierLimit(this.currentUser.subscription);
            if (amount > tierLimit) {
                throw new Error(`Amount exceeds your subscription limit of ${tierLimit}`);
            }
            
            // Find loan request
            const groups = await this.loadDemoGroups();
            let loanRequest = null;
            let group = null;
            
            for (const g of groups) {
                loanRequest = g.loanRequests.find(lr => lr.id === loanId);
                if (loanRequest) {
                    group = g;
                    break;
                }
            }
            
            if (!loanRequest) {
                throw new Error('Loan request not found');
            }
            
            // Check if already funded
            if (loanRequest.status === 'funded') {
                throw new Error('Loan already fully funded');
            }
            
            // Update loan request
            loanRequest.fundedAmount += amount;
            loanRequest.lenders.push({
                lenderId: this.currentUser.id,
                amount: amount,
                lentAt: new Date().toISOString()
            });
            
            // Check if fully funded
            if (loanRequest.fundedAmount >= loanRequest.amount) {
                loanRequest.status = 'funded';
                
                // Create ledger entry
                await this.createLedger(loanRequest);
            }
            
            // Update group total
            group.totalLent += amount;
            
            // Update localStorage
            localStorage.setItem('mpesewa_demo_groups', JSON.stringify(groups));
            
            // Update current group if applicable
            if (this.currentGroup && this.currentGroup.id === group.id) {
                this.currentGroup = group;
                localStorage.setItem('mpesewa_group', JSON.stringify(group));
            }
            
            this.showNotification(`Successfully lent ${amount} to loan request!`, 'success');
            return true;
        } catch (error) {
            this.showNotification(error.message, 'error');
            return false;
        }
    }
    
    async createLedger(loanRequest) {
        try {
            const ledger = {
                id: 'ledger_' + Date.now() + Math.random().toString(36).substr(2, 9),
                loanId: loanRequest.id,
                borrowerId: loanRequest.borrowerId,
                groupId: loanRequest.groupId,
                category: loanRequest.category,
                amount: loanRequest.amount,
                interestRate: 10,
                disbursedAt: new Date().toISOString(),
                dueDate: loanRequest.repaymentDue,
                status: 'active',
                principalRepaid: 0,
                interestRepaid: 0,
                penalties: 0,
                lenders: loanRequest.lenders
            };
            
            // Save to localStorage
            const ledgers = await this.loadDemoLedgers();
            ledgers.push(ledger);
            localStorage.setItem('mpesewa_demo_ledgers', JSON.stringify(ledgers));
            
            return ledger;
        } catch (error) {
            console.error('Error creating ledger:', error);
            throw error;
        }
    }
    
    // ===== UTILITY FUNCTIONS =====
    calculateSubscriptionExpiry() {
        const now = new Date();
        const expiry = new Date(now.getFullYear(), now.getMonth() + 1, 28);
        return expiry.toISOString();
    }
    
    calculateRepaymentDate(days) {
        const date = new Date();
        date.setDate(date.getDate() + days);
        return date.toISOString();
    }
    
    getTierLimit(tier) {
        const limits = {
            'basic': 1500,
            'premium': 5000,
            'super': 20000,
            'lender-of-lenders': 50000
        };
        return limits[tier] || 0;
    }
    
    formatCurrency(amount, currencyCode) {
        const currencies = {
            'KES': 'KSh',
            'UGX': 'UGX',
            'TZS': 'TZS',
            'RWF': 'RWF',
            'NGN': '₦',
            'GHS': 'GH₵',
            'ZAR': 'R',
            'USD': '$'
        };
        
        const symbol = currencies[currencyCode] || currencyCode;
        return `${symbol} ${amount.toLocaleString()}`;
    }
    
    calculateLoanInterest(amount, days = 7) {
        const interestRate = 10; // 10% per week
        const interest = (amount * interestRate * days) / (100 * 7);
        return Math.round(interest * 100) / 100;
    }
    
    calculatePenalty(amount, overdueDays) {
        const penaltyRate = 5; // 5% daily after 7 days
        const penalty = (amount * penaltyRate * overdueDays) / 100;
        return Math.round(penalty * 100) / 100;
    }
    
    // ===== DATA LOADING =====
    async loadDemoUsers() {
        try {
            const response = await fetch('data/demo-users.json');
            return await response.json();
        } catch (error) {
            console.error('Error loading demo users:', error);
            return [];
        }
    }
    
    async loadDemoGroups() {
        try {
            const response = await fetch('data/demo-groups.json');
            return await response.json();
        } catch (error) {
            console.error('Error loading demo groups:', error);
            return [];
        }
    }
    
    async loadDemoLedgers() {
        try {
            const response = await fetch('data/demo-ledgers.json');
            return await response.json();
        } catch (error) {
            console.error('Error loading demo ledgers:', error);
            return [];
        }
    }
    
    async loadCategories() {
        try {
            const response = await fetch('data/categories.json');
            return await response.json();
        } catch (error) {
            console.error('Error loading categories:', error);
            return [];
        }
    }
    
    async loadSubscriptions() {
        try {
            const response = await fetch('data/subscriptions.json');
            return await response.json();
        } catch (error) {
            console.error('Error loading subscriptions:', error);
            return [];
        }
    }
    
    async loadCollectors() {
        try {
            const response = await fetch('data/collectors.json');
            return await response.json();
        } catch (error) {
            console.error('Error loading collectors:', error);
            return [];
        }
    }
    
    // ===== UI UPDATES =====
    updateUI() {
        // Update navigation based on auth state
        const loginBtn = document.getElementById('login-btn');
        const signupBtn = document.getElementById('signup-btn');
        const logoutBtn = document.getElementById('logout-btn');
        const userMenu = document.getElementById('user-menu');
        
        if (this.currentUser) {
            if (loginBtn) loginBtn.style.display = 'none';
            if (signupBtn) signupBtn.style.display = 'none';
            if (logoutBtn) logoutBtn.style.display = 'inline-block';
            
            // Update user menu if exists
            if (userMenu) {
                const userName = userMenu.querySelector('.user-name');
                const userRole = userMenu.querySelector('.user-role');
                
                if (userName) userName.textContent = this.currentUser.fullName;
                if (userRole) userRole.textContent = this.currentRole;
            }
        } else {
            if (loginBtn) loginBtn.style.display = 'inline-block';
            if (signupBtn) signupBtn.style.display = 'inline-block';
            if (logoutBtn) logoutBtn.style.display = 'none';
        }
        
        // Update page-specific UI
        this.updatePageUI();
    }
    
    updatePageUI() {
        const page = document.body.dataset.page;
        
        switch (page) {
            case 'dashboard':
                this.updateDashboardUI();
                break;
            case 'borrowing':
                this.updateBorrowingUI();
                break;
            case 'lending':
                this.updateLendingUI();
                break;
            case 'groups':
                this.updateGroupsUI();
                break;
            case 'ledger':
                this.updateLedgerUI();
                break;
        }
    }
    
    updateDashboardUI() {
        if (!this.currentUser) return;
        
        // Update stats
        this.updateDashboardStats();
        
        // Update recent activity
        this.updateRecentActivity();
        
        // Update subscription status for lenders
        if (this.currentRole === 'lender') {
            this.updateSubscriptionStatus();
        }
    }
    
    async updateDashboardStats() {
        try {
            const groups = await this.loadDemoGroups();
            const ledgers = await this.loadDemoLedgers();
            
            // Calculate stats
            const userGroups = groups.filter(g => 
                g.members.some(m => m.userId === this.currentUser.id)
            );
            
            const userLoans = ledgers.filter(l => 
                l.borrowerId === this.currentUser.id || 
                l.lenders.some(lender => lender.lenderId === this.currentUser.id)
            );
            
            const activeLoans = userLoans.filter(l => l.status === 'active');
            const overdueLoans = userLoans.filter(l => {
                if (l.status === 'active') {
                    const dueDate = new Date(l.dueDate);
                    return dueDate < new Date();
                }
                return false;
            });
            
            // Update DOM elements
            const stats = {
                'total-groups': userGroups.length,
                'active-loans': activeLoans.length,
                'overdue-loans': overdueLoans.length,
                'total-lent': userLoans
                    .filter(l => l.lenders.some(lender => lender.lenderId === this.currentUser.id))
                    .reduce((sum, l) => sum + l.amount, 0),
                'total-borrowed': userLoans
                    .filter(l => l.borrowerId === this.currentUser.id)
                    .reduce((sum, l) => sum + l.amount, 0)
            };
            
            for (const [id, value] of Object.entries(stats)) {
                const element = document.getElementById(id);
                if (element) {
                    element.textContent = value;
                }
            }
        } catch (error) {
            console.error('Error updating dashboard stats:', error);
        }
    }
    
    // ===== NOTIFICATIONS =====
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${this.getNotificationIcon(type)}</span>
                <span class="notification-message">${message}</span>
            </div>
            <button class="notification-close">&times;</button>
        `;
        
        // Add to page
        const container = document.getElementById('notifications') || document.body;
        container.appendChild(notification);
        
        // Add close handler
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        });
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.classList.add('fade-out');
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }
    
    getNotificationIcon(type) {
        const icons = {
            'success': '✓',
            'error': '✗',
            'warning': '⚠',
            'info': 'ℹ'
        };
        return icons[type] || 'ℹ';
    }
    
    // ===== EVENT LISTENERS =====
    initEventListeners() {
        // Navigation toggle for mobile
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                navToggle.classList.toggle('active');
            });
        }
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navMenu && navMenu.classList.contains('active') && 
                !navMenu.contains(e.target) && 
                !navToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
        
        // Logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }
        
        // Install PWA button
        const installBtn = document.getElementById('install-btn');
        if (installBtn) {
            installBtn.addEventListener('click', () => {
                this.promptPWAInstall();
            });
        }
        
        // Emergency category cards
        document.querySelectorAll('.category-card').forEach(card => {
            card.addEventListener('click', () => {
                const category = card.dataset.category;
                this.handleCategoryClick(category);
            });
        });
        
        // Form submissions
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', (e) => {
                this.handleFormSubmit(e);
            });
        });
    }
    
    handleCategoryClick(category) {
        // If user is logged in, redirect to borrowing page with category preselected
        if (this.currentUser) {
            sessionStorage.setItem('selected_category', category);
            window.location.href = 'pages/borrowing.html';
        } else {
            // Show signup modal with category preselected
            const signupModal = document.getElementById('signup-modal');
            if (signupModal) {
                signupModal.classList.add('active');
                // Preselect borrower role and category
                const borrowerRadio = document.querySelector('input[name="role"][value="borrower"]');
                if (borrowerRadio) {
                    borrowerRadio.checked = true;
                }
                sessionStorage.setItem('selected_category', category);
            }
        }
    }
    
    async handleFormSubmit(event) {
        event.preventDefault();
        
        const form = event.target;
        const formId = form.id;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        switch (formId) {
            case 'login-form':
                await this.login(data.username, data.password, data.country);
                break;
                
            case 'signup-form':
                await this.register(data);
                break;
                
            case 'loan-request-form':
                await this.requestLoan(data);
                break;
                
            case 'lend-form':
                await this.lendToLoan(data.loanId, parseFloat(data.amount));
                break;
                
            case 'group-form':
                await this.createGroup(data);
                break;
                
            default:
                console.log('Form submitted:', formId, data);
                this.showNotification('Form submitted successfully!', 'success');
                break;
        }
        
        // Close modal if this was a modal form
        const modal = form.closest('.modal');
        if (modal) {
            modal.classList.remove('active');
        }
    }
    
    // ===== PWA FUNCTIONALITY =====
    async initServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('service-worker.js');
                console.log('ServiceWorker registration successful:', registration);
                
                // Check for updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    console.log('ServiceWorker update found:', newWorker);
                });
            } catch (error) {
                console.error('ServiceWorker registration failed:', error);
            }
        }
    }
    
    promptPWAInstall() {
        // This would be triggered by a beforeinstallprompt event
        // For now, just show a message
        this.showNotification('Install feature available in supported browsers', 'info');
    }
    
    // ===== OFFLINE DETECTION =====
    initOfflineDetection() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.showNotification('You are back online', 'success');
        });
        
        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.showNotification('You are offline. Some features may be limited.', 'warning');
        });
    }
    
    // ===== STATE MANAGEMENT =====
    loadSavedState() {
        // Load any additional saved state
        const selectedCategory = sessionStorage.getItem('selected_category');
        if (selectedCategory) {
            // Can be used to pre-select category in forms
            console.log('Selected category:', selectedCategory);
        }
    }
    
    // ===== PAGE-SPECIFIC UPDATES =====
    async updateBorrowingUI() {
        if (!this.currentUser || this.currentRole !== 'borrower') return;
        
        // Load and display available loan requests
        const groups = await this.loadDemoGroups();
        const userGroups = groups.filter(g => 
            g.members.some(m => m.userId === this.currentUser.id)
        );
        
        // Update group selector if exists
        const groupSelect = document.getElementById('group-select');
        if (groupSelect && userGroups.length > 0) {
            groupSelect.innerHTML = userGroups.map(group => 
                `<option value="${group.id}">${group.name}</option>`
            ).join('');
        }
    }
    
    async updateLendingUI() {
        if (!this.currentUser || this.currentRole !== 'lender') return;
        
        // Update subscription status
        this.updateSubscriptionStatus();
        
        // Load and display available loan requests
        const groups = await this.loadDemoGroups();
        const loanRequests = [];
        
        for (const group of groups) {
            if (group.members.some(m => m.userId === this.currentUser.id)) {
                loanRequests.push(...group.loanRequests.filter(lr => lr.status === 'pending'));
            }
        }
        
        // Update loan requests list if exists
        const requestsContainer = document.getElementById('loan-requests-container');
        if (requestsContainer && loanRequests.length > 0) {
            requestsContainer.innerHTML = loanRequests.map(request => `
                <div class="loan-request-card" data-id="${request.id}">
                    <h4>${request.category} - ${this.formatCurrency(request.amount, this.currentCountry.currency)}</h4>
                    <p>${request.purpose}</p>
                    <button class="btn btn-primary lend-btn" data-id="${request.id}">
                        Lend Now
                    </button>
                </div>
            `).join('');
            
            // Add event listeners to lend buttons
            document.querySelectorAll('.lend-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const loanId = e.target.dataset.id;
                    this.showLendModal(loanId);
                });
            });
        }
    }
    
    async updateGroupsUI() {
        const groups = await this.loadDemoGroups();
        const userGroups = groups.filter(g => 
            this.currentUser && g.members.some(m => m.userId === this.currentUser.id)
        );
        
        // Update groups list if exists
        const groupsContainer = document.getElementById('groups-container');
        if (groupsContainer) {
            if (userGroups.length > 0) {
                groupsContainer.innerHTML = userGroups.map(group => `
                    <div class="group-card">
                        <h3>${group.name}</h3>
                        <p>${group.type} • ${group.members.length} members</p>
                        <p>Total Lent: ${this.formatCurrency(group.totalLent, this.currentCountry?.currency || 'KES')}</p>
                    </div>
                `).join('');
            } else {
                groupsContainer.innerHTML = `
                    <div class="empty-state">
                        <p>You haven't joined any groups yet.</p>
                        <button class="btn btn-primary" id="join-group-btn">Join a Group</button>
                    </div>
                `;
            }
        }
    }
    
    async updateLedgerUI() {
        if (!this.currentUser) return;
        
        const ledgers = await this.loadDemoLedgers();
        const userLedgers = ledgers.filter(l => 
            l.borrowerId === this.currentUser.id || 
            l.lenders.some(lender => lender.lenderId === this.currentUser.id)
        );
        
        // Update ledger table if exists
        const ledgerTable = document.getElementById('ledger-table');
        if (ledgerTable && userLedgers.length > 0) {
            const tbody = ledgerTable.querySelector('tbody');
            if (tbody) {
                tbody.innerHTML = userLedgers.map(ledger => `
                    <tr class="${ledger.status} ${new Date(ledger.dueDate) < new Date() ? 'overdue' : ''}">
                        <td>${ledger.category}</td>
                        <td>${this.formatCurrency(ledger.amount, this.currentCountry?.currency || 'KES')}</td>
                        <td>${new Date(ledger.dueDate).toLocaleDateString()}</td>
                        <td><span class="status-badge ${ledger.status}">${ledger.status}</span></td>
                    </tr>
                `).join('');
            }
        }
    }
    
    updateSubscriptionStatus() {
        if (!this.currentUser || !this.currentUser.subscriptionExpiry) return;
        
        const expiry = new Date(this.currentUser.subscriptionExpiry);
        const now = new Date();
        const daysRemaining = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
        
        // Update subscription status display if exists
        const statusElement = document.getElementById('subscription-status');
        if (statusElement) {
            if (daysRemaining > 0) {
                statusElement.innerHTML = `
                    <span class="status-active">Active (${daysRemaining} days remaining)</span>
                `;
            } else {
                statusElement.innerHTML = `
                    <span class="status-expired">Expired</span>
                    <button class="btn btn-warning btn-sm">Renew Now</button>
                `;
            }
        }
    }
    
    // ===== MODAL MANAGEMENT =====
    showLendModal(loanId) {
        // Create or show lend modal
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <button class="modal-close">&times;</button>
                <h2>Lend to Loan Request</h2>
                <form id="lend-form">
                    <input type="hidden" name="loanId" value="${loanId}">
                    <div class="form-group">
                        <label for="lend-amount">Amount to Lend</label>
                        <input type="number" id="lend-amount" name="amount" required min="1">
                    </div>
                    <button type="submit" class="btn btn-primary">Confirm Lend</button>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add close handler
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => modal.remove());
        
        // Close when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
}

// ===== GLOBAL APP INSTANCE =====
window.mpesewa = new MpesewaApp();

// Make app available globally
window.app = window.mpesewa;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Additional initialization if needed
    console.log('M-Pesewa DOM loaded');
});