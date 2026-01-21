// assets/js/app.js - App bootstrap & routing

class M_PesewaApp {
    constructor() {
        this.currentPage = window.location.pathname;
        this.userRole = this.getUserRole();
        this.country = this.getUserCountry();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkAuthState();
        this.loadPageData();
        this.updateUIForRole();
        this.setupNavigation();
        this.setupOfflineDetection();
    }

    // User state management
    getUserRole() {
        // In production, this would come from backend/auth system
        return localStorage.getItem('userRole') || null;
    }

    getUserCountry() {
        return localStorage.getItem('userCountry') || null;
    }

    setUserRole(role) {
        localStorage.setItem('userRole', role);
        this.userRole = role;
        this.updateUIForRole();
    }

    setUserCountry(country) {
        localStorage.setItem('userCountry', country);
        this.country = country;
        this.updateUIForCountry();
    }

    // Navigation and routing
    setupNavigation() {
        // Handle internal navigation for SPA-like experience
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[data-internal]');
            if (link && link.href) {
                e.preventDefault();
                this.navigateTo(link.href);
            }
        });

        // Handle back/forward navigation
        window.addEventListener('popstate', () => {
            this.handleNavigation();
        });
    }

    navigateTo(url) {
        history.pushState({}, '', url);
        this.handleNavigation();
    }

    handleNavigation() {
        this.currentPage = window.location.pathname;
        
        // Update active nav item
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === this.currentPage) {
                link.classList.add('active');
            }
        });
        
        // Load page-specific content if needed
        this.loadPageContent();
    }

    // Page loading and data management
    loadPageData() {
        // Load necessary data based on current page
        const pageDataMap = {
            '/pages/lending.html': 'loadLendingData',
            '/pages/borrowing.html': 'loadBorrowingData',
            '/pages/ledger.html': 'loadLedgerData',
            '/pages/groups.html': 'loadGroupsData',
            '/pages/subscriptions.html': 'loadSubscriptionsData',
            '/pages/blacklist.html': 'loadBlacklistData',
            '/pages/debt-collectors.html': 'loadCollectorsData'
        };

        const loadMethod = pageDataMap[this.currentPage];
        if (loadMethod && this[loadMethod]) {
            this[loadMethod]();
        }
    }

    loadPageContent() {
        // For SPA-like transitions, we could load content dynamically
        // For now, we'll just update the active state and load data
        this.loadPageData();
        
        // Add page transition effect
        const mainContent = document.querySelector('.dashboard-main') || document.querySelector('.container');
        if (mainContent) {
            mainContent.classList.add('page-load');
            setTimeout(() => {
                mainContent.classList.remove('page-load');
            }, 600);
        }
    }

    // Data loading methods
    async loadLendingData() {
        try {
            const response = await fetch('/data/demo-groups.json');
            const data = await response.json();
            this.renderLendingOpportunities(data);
        } catch (error) {
            console.error('Error loading lending data:', error);
            this.showNotification('Failed to load lending data', 'error');
        }
    }

    async loadBorrowingData() {
        try {
            const response = await fetch('/data/demo-users.json');
            const data = await response.json();
            this.renderBorrowingRequests(data);
        } catch (error) {
            console.error('Error loading borrowing data:', error);
            this.showNotification('Failed to load borrowing data', 'error');
        }
    }

    async loadLedgerData() {
        try {
            const response = await fetch('/data/demo-ledgers.json');
            const data = await response.json();
            this.renderLedgerTable(data);
        } catch (error) {
            console.error('Error loading ledger data:', error);
            this.showNotification('Failed to load ledger data', 'error');
        }
    }

    async loadGroupsData() {
        try {
            const response = await fetch('/data/demo-groups.json');
            const data = await response.json();
            this.renderGroups(data);
        } catch (error) {
            console.error('Error loading groups data:', error);
            this.showNotification('Failed to load groups data', 'error');
        }
    }

    async loadSubscriptionsData() {
        try {
            const response = await fetch('/data/subscriptions.json');
            const data = await response.json();
            this.renderSubscriptions(data);
        } catch (error) {
            console.error('Error loading subscriptions data:', error);
            this.showNotification('Failed to load subscriptions data', 'error');
        }
    }

    async loadBlacklistData() {
        try {
            const response = await fetch('/data/demo-users.json');
            const data = await response.json();
            const blacklisted = data.filter(user => user.blacklisted);
            this.renderBlacklist(blacklisted);
        } catch (error) {
            console.error('Error loading blacklist data:', error);
            this.showNotification('Failed to load blacklist data', 'error');
        }
    }

    async loadCollectorsData() {
        try {
            const response = await fetch('/data/collectors.json');
            const data = await response.json();
            this.renderCollectors(data);
        } catch (error) {
            console.error('Error loading collectors data:', error);
            this.showNotification('Failed to load collectors data', 'error');
        }
    }

    // Rendering methods
    renderLendingOpportunities(data) {
        const container = document.getElementById('lending-opportunities');
        if (!container) return;

        // Filter data based on user's country and groups
        const filteredData = data.filter(item => 
            item.country === this.country && 
            item.status === 'available'
        );

        container.innerHTML = filteredData.map(item => `
            <div class="card lending-opportunity" data-id="${item.id}">
                <div class="card-header">
                    <h4 class="card-title">${item.category}</h4>
                    <span class="badge badge-${item.riskLevel}">${item.riskLevel}</span>
                </div>
                <div class="card-body">
                    <div class="borrower-info">
                        <div class="avatar">${item.borrowerName.charAt(0)}</div>
                        <div>
                            <h5>${item.borrowerName}</h5>
                            <p>Group: ${item.groupName}</p>
                        </div>
                    </div>
                    <div class="loan-details">
                        <p><strong>Amount:</strong> ${this.formatCurrency(item.amount, this.country)}</p>
                        <p><strong>Term:</strong> ${item.term} days</p>
                        <p><strong>Interest:</strong> ${item.interest}%</p>
                        <p><strong>Rating:</strong> ${this.renderRating(item.rating)}</p>
                    </div>
                </div>
                <div class="card-footer">
                    <button class="btn btn-primary" onclick="app.fundLoan('${item.id}')">
                        Fund Loan
                    </button>
                    <button class="btn btn-outline" onclick="app.viewDetails('${item.id}')">
                        View Details
                    </button>
                </div>
            </div>
        `).join('');
    }

    renderBorrowingRequests(data) {
        const container = document.getElementById('borrowing-requests');
        if (!container) return;

        // Filter active requests for current user
        const userRequests = data.filter(item => 
            item.userId === localStorage.getItem('userId')
        );

        container.innerHTML = userRequests.map(item => `
            <div class="card borrowing-request" data-id="${item.id}">
                <div class="card-header">
                    <h4 class="card-title">${item.category}</h4>
                    <span class="status-indicator status-${item.status}">
                        <span class="status-dot"></span>
                        ${item.status}
                    </span>
                </div>
                <div class="card-body">
                    <div class="request-details">
                        <p><strong>Amount:</strong> ${this.formatCurrency(item.amount, this.country)}</p>
                        <p><strong>Group:</strong> ${item.groupName}</p>
                        <p><strong>Date Requested:</strong> ${this.formatDate(item.requestedDate)}</p>
                        <p><strong>Status:</strong> ${item.status}</p>
                    </div>
                </div>
                <div class="card-footer">
                    ${item.status === 'draft' ? `
                        <button class="btn btn-primary" onclick="app.submitRequest('${item.id}')">
                            Submit Request
                        </button>
                        <button class="btn btn-secondary" onclick="app.editRequest('${item.id}')">
                            Edit
                        </button>
                    ` : ''}
                    ${item.status === 'pending' ? `
                        <button class="btn btn-warning" onclick="app.cancelRequest('${item.id}')">
                            Cancel Request
                        </button>
                    ` : ''}
                </div>
            </div>
        `).join('');
    }

    renderLedgerTable(data) {
        const container = document.getElementById('ledger-table');
        if (!container) return;

        // Filter ledgers for current user
        const userLedgers = data.filter(item => 
            item.lenderId === localStorage.getItem('userId')
        );

        container.innerHTML = `
            <table class="data-table ledger-table">
                <thead>
                    <tr>
                        <th>Borrower</th>
                        <th>Amount</th>
                        <th>Interest</th>
                        <th>Due Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${userLedgers.map(item => `
                        <tr class="ledger-row ${item.status}">
                            <td>
                                <div class="table-avatar">
                                    <div class="avatar-fallback">${item.borrowerName.charAt(0)}</div>
                                    <div class="avatar-info">
                                        <span class="avatar-name">${item.borrowerName}</span>
                                        <span class="avatar-detail">${item.groupName}</span>
                                    </div>
                                </div>
                            </td>
                            <td class="table-cell-number">${this.formatCurrency(item.amount, this.country)}</td>
                            <td class="table-cell-number">${item.interest}%</td>
                            <td>${this.formatDate(item.dueDate)}</td>
                            <td>
                                <span class="table-status status-${item.status}">
                                    ${item.status}
                                </span>
                            </td>
                            <td class="table-cell-actions">
                                <div class="table-actions">
                                    <button class="action-btn view" title="View Details" onclick="app.viewLedger('${item.id}')">
                                        👁️
                                    </button>
                                    ${item.status === 'active' ? `
                                        <button class="action-btn edit" title="Update Payment" onclick="app.updatePayment('${item.id}')">
                                            💰
                                        </button>
                                    ` : ''}
                                    ${item.status === 'overdue' ? `
                                        <button class="action-btn delete" title="Report Default" onclick="app.reportDefault('${item.id}')">
                                            🚨
                                        </button>
                                    ` : ''}
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    renderGroups(data) {
        const container = document.getElementById('groups-container');
        if (!container) return;

        // Filter groups for current country
        const countryGroups = data.filter(item => 
            item.country === this.country
        );

        container.innerHTML = countryGroups.map(item => `
            <div class="group-card">
                <div class="group-header">
                    <h3 class="group-name">${item.name}</h3>
                    <span class="group-type">${item.type}</span>
                </div>
                <div class="group-description">
                    <p>${item.description || 'A trusted lending group'}</p>
                </div>
                <div class="group-stats">
                    <div class="group-stat">
                        <span class="group-stat-value">${item.members}</span>
                        <span class="group-stat-label">Members</span>
                    </div>
                    <div class="group-stat">
                        <span class="group-stat-value">${item.activeLoans}</span>
                        <span class="group-stat-label">Active Loans</span>
                    </div>
                    <div class="group-stat">
                        <span class="group-stat-value">${item.repaymentRate}%</span>
                        <span class="group-stat-label">Repayment Rate</span>
                    </div>
                </div>
                <div class="group-footer">
                    <div class="group-country">
                        <span>${this.getFlagEmoji(item.country)}</span>
                        <span>${item.country}</span>
                    </div>
                    <button class="btn btn-primary" onclick="app.joinGroup('${item.id}')">
                        ${item.isMember ? 'Enter Group' : 'Request Invite'}
                    </button>
                </div>
            </div>
        `).join('');
    }

    renderSubscriptions(data) {
        const container = document.getElementById('subscriptions-container');
        if (!container) return;

        const userSubscription = localStorage.getItem('userSubscription') || 'basic';

        container.innerHTML = data.map(tier => `
            <div class="pricing-card ${tier.name === userSubscription ? 'popular' : ''}">
                ${tier.name === userSubscription ? '<div class="popular-badge">Current Plan</div>' : ''}
                <div class="pricing-header">
                    <h3>${tier.name}</h3>
                    <div class="pricing-amount">
                        ${this.formatCurrency(tier.price, this.country)}<span>/month</span>
                    </div>
                </div>
                <div class="pricing-features">
                    <p><strong>Weekly Limit:</strong> ≤ ${this.formatCurrency(tier.weeklyLimit, this.country)}</p>
                    <p><strong>Ledger Limit:</strong> ${this.formatCurrency(tier.ledgerLimit, this.country)}</p>
                    <p><strong>CRB Check:</strong> ${tier.crbRequired ? 'Required' : 'No'}</p>
                    <p><strong>Max Active Ledgers:</strong> ${tier.maxLedgers || 'Unlimited'}</p>
                </div>
                <div class="pricing-actions">
                    ${tier.name === userSubscription ? `
                        <button class="btn btn-primary" disabled>Current Plan</button>
                    ` : `
                        <button class="btn ${tier.name === 'premium' ? 'btn-primary' : 'btn-outline'}" 
                                onclick="app.upgradeSubscription('${tier.name}')">
                            ${tier.name === userSubscription ? 'Current Plan' : 'Upgrade'}
                        </button>
                    `}
                </div>
            </div>
        `).join('');
    }

    renderBlacklist(data) {
        const container = document.getElementById('blacklist-table');
        if (!container) return;

        container.innerHTML = `
            <table class="data-table blacklist-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Country</th>
                        <th>Group</th>
                        <th>Amount Defaulted</th>
                        <th>Days Overdue</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.map(item => `
                        <tr class="blacklist-row">
                            <td>
                                <div class="table-avatar">
                                    <div class="avatar-fallback">${item.name.charAt(0)}</div>
                                    <div class="avatar-info">
                                        <span class="avatar-name">${item.name}</span>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="table-badge badge-country">
                                    ${this.getFlagEmoji(item.country)} ${item.country}
                                </span>
                            </td>
                            <td>${item.group}</td>
                            <td class="table-cell-number">${this.formatCurrency(item.amountDefaulted, item.country)}</td>
                            <td class="table-cell-number">${item.daysOverdue}</td>
                            <td>
                                <span class="table-status status-blacklisted">
                                    BLACKLISTED
                                </span>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    renderCollectors(data) {
        const container = document.getElementById('collectors-table');
        if (!container) return;

        container.innerHTML = `
            <table class="data-table collectors-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Country</th>
                        <th>City</th>
                        <th>Phone</th>
                        <th>Specialization</th>
                        <th>Contact</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.map(item => `
                        <tr>
                            <td>
                                <div class="table-avatar">
                                    <div class="avatar-fallback">${item.name.charAt(0)}</div>
                                    <div class="avatar-info">
                                        <span class="avatar-name">${item.name}</span>
                                        <span class="avatar-detail">${item.company}</span>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="table-badge badge-country">
                                    ${this.getFlagEmoji(item.country)} ${item.country}
                                </span>
                            </td>
                            <td>${item.city}</td>
                            <td>
                                <div class="collector-contact">
                                    <span>${item.phone}</span>
                                    <a href="tel:${item.phone}" class="contact-btn">📞 Call</a>
                                </div>
                            </td>
                            <td>
                                <span class="table-badge badge-category">
                                    ${item.specialization}
                                </span>
                            </td>
                            <td>
                                <div class="table-actions">
                                    <button class="action-btn view" title="View Details" onclick="app.viewCollector('${item.id}')">
                                        👁️
                                    </button>
                                    <a href="tel:${item.phone}" class="action-btn edit" title="Call">
                                        📞
                                    </a>
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    // Business logic methods
    fundLoan(loanId) {
        if (!this.userRole) {
            this.showNotification('Please login to fund loans', 'error');
            return;
        }

        if (this.userRole !== 'lender') {
            this.showNotification('Only lenders can fund loans', 'error');
            return;
        }

        // Check subscription status
        const subscription = localStorage.getItem('userSubscription');
        const subscriptionExpiry = localStorage.getItem('subscriptionExpiry');
        
        if (!subscription || !subscriptionExpiry) {
            this.showNotification('Active subscription required to fund loans', 'error');
            return;
        }

        if (new Date(subscriptionExpiry) < new Date()) {
            this.showNotification('Your subscription has expired', 'error');
            return;
        }

        // Show funding modal
        this.showFundingModal(loanId);
    }

    submitRequest(requestId) {
        // Submit borrowing request logic
        this.showNotification('Loan request submitted successfully', 'success');
        
        // Update UI
        const requestCard = document.querySelector(`.borrowing-request[data-id="${requestId}"]`);
        if (requestCard) {
            const statusElement = requestCard.querySelector('.status-indicator');
            statusElement.className = 'status-indicator status-pending';
            statusElement.innerHTML = '<span class="status-dot"></span>Pending';
            
            const footer = requestCard.querySelector('.card-footer');
            footer.innerHTML = `
                <button class="btn btn-warning" onclick="app.cancelRequest('${requestId}')">
                    Cancel Request
                </button>
            `;
        }
    }

    viewLedger(ledgerId) {
        // Show ledger details modal
        this.showModal('ledger-details', { ledgerId });
    }

    updatePayment(ledgerId) {
        // Show payment update modal
        this.showModal('update-payment', { ledgerId });
    }

    joinGroup(groupId) {
        if (!this.userRole) {
            this.showNotification('Please login to join groups', 'error');
            return;
        }

        // Check if user is already in 4 groups (borrower limit)
        if (this.userRole === 'borrower') {
            const userGroups = JSON.parse(localStorage.getItem('userGroups') || '[]');
            if (userGroups.length >= 4) {
                this.showNotification('Borrowers can join maximum 4 groups', 'error');
                return;
            }
        }

        this.showModal('join-group', { groupId });
    }

    upgradeSubscription(tier) {
        // Show subscription upgrade modal
        this.showModal('upgrade-subscription', { tier });
    }

    // UI update methods
    updateUIForRole() {
        const role = this.userRole;
        
        // Update dashboard link
        const dashboardLink = document.querySelector('a[href*="dashboard"]');
        if (dashboardLink && role) {
            dashboardLink.href = `/pages/dashboard/${role}-dashboard.html`;
        }

        // Show/hide role-specific elements
        document.querySelectorAll('[data-role]').forEach(element => {
            const allowedRoles = element.getAttribute('data-role').split(' ');
            if (role && allowedRoles.includes(role)) {
                element.style.display = '';
            } else {
                element.style.display = 'none';
            }
        });

        // Update welcome message
        const welcomeElement = document.getElementById('welcome-message');
        if (welcomeElement && role) {
            welcomeElement.textContent = `Welcome, ${role.charAt(0).toUpperCase() + role.slice(1)}`;
        }
    }

    updateUIForCountry() {
        const country = this.country;
        if (!country) return;

        // Update country flag in header
        const countryFlag = document.getElementById('country-flag');
        if (countryFlag) {
            countryFlag.textContent = this.getFlagEmoji(country);
        }

        // Update currency displays
        document.querySelectorAll('[data-currency]').forEach(element => {
            const amount = element.getAttribute('data-currency');
            if (amount) {
                element.textContent = this.formatCurrency(parseFloat(amount), country);
            }
        });
    }

    // Event listeners
    setupEventListeners() {
        // Mobile menu toggle
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', () => {
                const mainNav = document.querySelector('.main-nav');
                mainNav.classList.toggle('active');
                mobileMenuBtn.classList.toggle('active');
            });
        }

        // Modal close buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-close') || 
                e.target.classList.contains('modal') && e.target.id) {
                this.closeModal(e.target.closest('.modal').id);
            }
        });

        // Form submissions
        document.addEventListener('submit', (e) => {
            const form = e.target;
            if (form.id === 'loginForm') {
                e.preventDefault();
                this.handleLogin(form);
            }
            if (form.id === 'loanRequestForm') {
                e.preventDefault();
                this.handleLoanRequest(form);
            }
        });

        // Install prompt
        const installBtn = document.getElementById('installBtn');
        if (installBtn) {
            installBtn.addEventListener('click', () => {
                this.installPWA();
            });
        }

        const dismissInstall = document.getElementById('dismissInstall');
        if (dismissInstall) {
            dismissInstall.addEventListener('click', () => {
                this.dismissInstallPrompt();
            });
        }
    }

    // Auth state management
    checkAuthState() {
        const token = localStorage.getItem('authToken');
        const expiry = localStorage.getItem('tokenExpiry');
        
        if (token && expiry && new Date(expiry) > new Date()) {
            this.showAuthUI(true);
        } else {
            this.showAuthUI(false);
            // Clear expired token
            localStorage.removeItem('authToken');
            localStorage.removeItem('tokenExpiry');
        }
    }

    showAuthUI(isAuthenticated) {
        const loginBtn = document.querySelector('.btn.secondary');
        const logoutBtn = document.getElementById('logoutBtn');
        
        if (loginBtn) {
            loginBtn.style.display = isAuthenticated ? 'none' : 'inline-flex';
        }
        
        if (logoutBtn) {
            logoutBtn.style.display = isAuthenticated ? 'inline-flex' : 'none';
        }

        // Update dashboard accessibility
        const dashboardLinks = document.querySelectorAll('a[href*="dashboard"]');
        dashboardLinks.forEach(link => {
            if (isAuthenticated) {
                link.removeAttribute('disabled');
            } else {
                link.setAttribute('disabled', 'true');
                link.onclick = (e) => {
                    e.preventDefault();
                    this.showNotification('Please login to access dashboard', 'warning');
                };
            }
        });
    }

    handleLogin(form) {
        const formData = new FormData(form);
        const email = formData.get('email');
        const password = formData.get('password');
        
        // Mock authentication - in production, this would call an API
        if (email && password) {
            // Simulate API call
            setTimeout(() => {
                const token = 'mock-jwt-token-' + Date.now();
                const expiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
                
                localStorage.setItem('authToken', token);
                localStorage.setItem('tokenExpiry', expiry.toISOString());
                localStorage.setItem('userEmail', email);
                
                // Determine role from email (mock logic)
                const role = email.includes('lender') ? 'lender' : 
                            email.includes('borrower') ? 'borrower' : 'user';
                this.setUserRole(role);
                
                this.showNotification('Login successful', 'success');
                this.closeModal('loginModal');
                this.checkAuthState();
                
                // Redirect to appropriate dashboard
                if (this.currentPage === '/' || this.currentPage.includes('index')) {
                    this.navigateTo(`/pages/dashboard/${role}-dashboard.html`);
                }
            }, 1000);
        } else {
            this.showNotification('Please fill in all fields', 'error');
        }
    }

    handleLoanRequest(form) {
        const formData = new FormData(form);
        const amount = formData.get('amount');
        const category = formData.get('category');
        const group = formData.get('group');
        
        // Validate
        if (!amount || !category || !group) {
            this.showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        // Mock submission
        setTimeout(() => {
            this.showNotification('Loan request submitted successfully', 'success');
            this.closeModal('loanRequestModal');
            
            // Refresh borrowing requests
            if (this.currentPage.includes('borrowing')) {
                this.loadBorrowingData();
            }
        }, 1000);
    }

    // Utility methods
    formatCurrency(amount, country) {
        const currencies = {
            'Kenya': 'KES',
            'Uganda': 'UGX',
            'Tanzania': 'TZS',
            'Rwanda': 'RWF',
            'Nigeria': 'NGN',
            'Ghana': 'GHS',
            'South Africa': 'ZAR',
            'Egypt': 'EGP',
            'Ethiopia': 'ETB',
            'Senegal': 'XOF'
        };
        
        const currency = currencies[country] || 'USD';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    renderRating(rating) {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
        
        return '★'.repeat(fullStars) + (halfStar ? '½' : '') + '☆'.repeat(emptyStars);
    }

    getFlagEmoji(country) {
        const flagEmojis = {
            'Kenya': '🇰🇪',
            'Uganda': '🇺🇬',
            'Tanzania': '🇹🇿',
            'Rwanda': '🇷🇼',
            'Nigeria': '🇳🇬',
            'Ghana': '🇬🇭',
            'South Africa': '🇿🇦',
            'Egypt': '🇪🇬',
            'Ethiopia': '🇪🇹',
            'Senegal': '🇸🇳'
        };
        return flagEmojis[country] || '🏳️';
    }

    // Modal management
    showModal(modalId, data = {}) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Populate modal with data
        Object.keys(data).forEach(key => {
            const element = modal.querySelector(`[data-${key}]`);
            if (element) {
                element.textContent = data[key];
            }
        });
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // Notification system
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-icon">
                ${this.getNotificationIcon(type)}
            </div>
            <div class="notification-content">
                <p>${message}</p>
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()">×</button>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    getNotificationIcon(type) {
        const icons = {
            'success': '✅',
            'error': '❌',
            'warning': '⚠️',
            'info': 'ℹ️'
        };
        return icons[type] || 'ℹ️';
    }

    // PWA methods
    setupOfflineDetection() {
        window.addEventListener('online', () => {
            this.showNotification('You are back online', 'success');
        });
        
        window.addEventListener('offline', () => {
            this.showNotification('You are offline. Some features may be limited.', 'warning');
        });
    }

    installPWA() {
        if (window.deferredPrompt) {
            window.deferredPrompt.prompt();
            window.deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    this.showNotification('App installed successfully!', 'success');
                }
                window.deferredPrompt = null;
            });
        }
    }

    dismissInstallPrompt() {
        const prompt = document.getElementById('installPrompt');
        if (prompt) {
            prompt.style.display = 'none';
            localStorage.setItem('installPromptDismissed', 'true');
        }
    }

    // Logout
    logout() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('tokenExpiry');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userId');
        
        this.userRole = null;
        this.showAuthUI(false);
        this.showNotification('Logged out successfully', 'success');
        
        // Redirect to home page
        if (!this.currentPage.includes('index')) {
            this.navigateTo('/');
        }
    }
}

// Initialize app
const app = new M_PesewaApp();

// Make app available globally for onclick handlers
window.app = app;

// Expose logout function globally
window.logout = () => app.logout();

// Service Worker registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('ServiceWorker registered:', registration);
            })
            .catch(error => {
                console.log('ServiceWorker registration failed:', error);
            });
    });
}