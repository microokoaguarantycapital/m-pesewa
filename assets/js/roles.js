// assets/js/roles.js - Role management for M-Pesewa PWA

// M-Pesewa Role Management Module
const MpesewaRoles = {
    // Available roles in the system
    ROLES: {
        BORROWER: 'borrower',
        LENDER: 'lender',
        ADMIN: 'admin',
        GROUP_ADMIN: 'group_admin'
    },
    
    // Role permissions configuration
    PERMISSIONS: {
        // Borrower permissions
        borrower: {
            canBorrow: true,
            canRequestLoan: true,
            canViewGroups: true,
            canJoinGroups: true,
            canViewLedger: true,
            canViewBlacklist: false,
            canLend: false,
            canManageSubscriptions: false,
            canOverrideLedger: false,
            canManageBlacklist: false,
            canAccessAdmin: false,
            maxGroups: 4,
            requiresSubscription: false
        },
        
        // Lender permissions
        lender: {
            canBorrow: true,
            canRequestLoan: true,
            canViewGroups: true,
            canJoinGroups: true,
            canViewLedger: true,
            canViewBlacklist: true,
            canLend: true,
            canManageSubscriptions: true,
            canOverrideLedger: false,
            canManageBlacklist: false,
            canAccessAdmin: false,
            maxGroups: 4,
            requiresSubscription: true
        },
        
        // Group admin permissions
        group_admin: {
            canBorrow: true,
            canRequestLoan: true,
            canViewGroups: true,
            canJoinGroups: true,
            canViewLedger: true,
            canViewBlacklist: true,
            canLend: true,
            canManageSubscriptions: true,
            canOverrideLedger: false,
            canManageBlacklist: false,
            canAccessAdmin: false,
            maxGroups: 4,
            requiresSubscription: true,
            canManageGroup: true,
            canInviteMembers: true,
            canRemoveMembers: true,
            canModerateGroup: true
        },
        
        // System admin permissions
        admin: {
            canBorrow: false,
            canRequestLoan: false,
            canViewGroups: true,
            canJoinGroups: false,
            canViewLedger: true,
            canViewBlacklist: true,
            canLend: false,
            canManageSubscriptions: true,
            canOverrideLedger: true,
            canManageBlacklist: true,
            canAccessAdmin: true,
            maxGroups: 0,
            requiresSubscription: false,
            canManageUsers: true,
            canManageAllGroups: true,
            canOverrideAll: true,
            canValidateCollectors: true
        }
    },
    
    // Subscription tiers configuration
    SUBSCRIPTION_TIERS: {
        basic: {
            name: 'Basic',
            weeklyLimit: 1500,
            monthlyFee: 50,
            biAnnualFee: 250,
            annualFee: 500,
            crbCheck: false,
            maxLedgers: 1500,
            color: 'blue'
        },
        premium: {
            name: 'Premium',
            weeklyLimit: 5000,
            monthlyFee: 250,
            biAnnualFee: 1500,
            annualFee: 2500,
            crbCheck: false,
            maxLedgers: 10000,
            color: 'green'
        },
        super: {
            name: 'Super',
            weeklyLimit: 20000,
            monthlyFee: 1000,
            biAnnualFee: 5000,
            annualFee: 8500,
            crbCheck: true,
            maxLedgers: 20000,
            color: 'purple'
        },
        lol: {
            name: 'Lender of Lenders',
            weeklyLimit: 50000,
            monthlyFee: 500,
            biAnnualFee: 3500,
            annualFee: 6500,
            crbCheck: true,
            maxLedgers: 50000,
            color: 'gold',
            customInterest: true,
            minRepaymentPeriod: 30
        }
    },
    
    // Current user role state
    currentUser: null,
    currentRole: null,
    currentPermissions: null,
    currentSubscription: null,
    
    // Initialize role management
    init() {
        this.loadCurrentUser();
        this.loadUserRole();
        this.loadUserSubscription();
        this.setupEventListeners();
        this.updateRoleUI();
        
        console.log('Role management initialized');
    },
    
    // Load current user from auth system
    loadCurrentUser() {
        if (window.MpesewaAuth && MpesewaAuth.currentUser) {
            this.currentUser = MpesewaAuth.currentUser;
        } else {
            // Fallback to localStorage
            const userData = localStorage.getItem('mPesewaCurrentUser');
            if (userData) {
                this.currentUser = JSON.parse(userData);
            }
        }
    },
    
    // Load user's role
    loadUserRole() {
        if (window.MpesewaAuth && MpesewaAuth.currentRole) {
            this.currentRole = MpesewaAuth.currentRole;
        } else {
            // Fallback to localStorage
            this.currentRole = localStorage.getItem('mPesewaCurrentRole') || this.ROLES.BORROWER;
        }
        
        // Load permissions for current role
        this.currentPermissions = this.PERMISSIONS[this.currentRole] || this.PERMISSIONS.borrower;
    },
    
    // Load user's subscription
    loadUserSubscription() {
        if (!this.currentUser) return;
        
        if (this.currentUser.subscriptionTier) {
            this.currentSubscription = {
                tier: this.currentUser.subscriptionTier,
                status: this.currentUser.subscriptionStatus || 'inactive',
                expiry: this.currentUser.subscriptionExpiry,
                isActive: this.currentUser.isActive || false
            };
        } else {
            this.currentSubscription = null;
        }
    },
    
    // Setup event listeners for role management
    setupEventListeners() {
        // Role switch buttons
        document.addEventListener('click', (e) => {
            const roleSwitchBtn = e.target.closest('.switch-role-btn');
            if (roleSwitchBtn) {
                e.preventDefault();
                const targetRole = roleSwitchBtn.dataset.role;
                this.handleRoleSwitch(targetRole);
            }
        });
        
        // Subscription upgrade buttons
        document.addEventListener('click', (e) => {
            const upgradeBtn = e.target.closest('.upgrade-subscription-btn');
            if (upgradeBtn) {
                e.preventDefault();
                const tier = upgradeBtn.dataset.tier;
                this.handleSubscriptionUpgrade(tier);
            }
        });
        
        // Dual role registration
        const dualRoleCheckbox = document.getElementById('dualRoleCheckbox');
        if (dualRoleCheckbox) {
            dualRoleCheckbox.addEventListener('change', (e) => {
                this.handleDualRoleRegistration(e.target.checked);
            });
        }
        
        // Role-specific form toggles
        this.setupRoleFormToggles();
    },
    
    // Setup role-specific form toggles
    setupRoleFormToggles() {
        // Toggle lender-specific fields when role changes
        const roleSelect = document.getElementById('registrationRole');
        if (roleSelect) {
            roleSelect.addEventListener('change', (e) => {
                this.toggleRoleSpecificFields(e.target.value);
            });
        }
        
        // Initial toggle based on current selection
        if (roleSelect) {
            this.toggleRoleSpecificFields(roleSelect.value);
        }
    },
    
    // Toggle role-specific form fields
    toggleRoleSpecificFields(role) {
        const lenderFields = document.querySelectorAll('.lender-field, .subscription-field');
        const borrowerFields = document.querySelectorAll('.borrower-field');
        
        if (role === 'lender') {
            lenderFields.forEach(field => field.style.display = 'block');
            borrowerFields.forEach(field => field.style.display = 'none');
        } else {
            lenderFields.forEach(field => field.style.display = 'none');
            borrowerFields.forEach(field => field.style.display = 'block');
        }
    },
    
    // Handle role switching
    async handleRoleSwitch(targetRole) {
        // Check if user is logged in
        if (!this.currentUser) {
            this.showToast('Please log in to switch roles', 'warning');
            return;
        }
        
        // Check if already in the target role
        if (this.currentRole === targetRole) {
            this.showToast(`You are already in ${targetRole} role`, 'info');
            return;
        }
        
        // Validate role switch
        if (!this.validateRoleSwitch(targetRole)) {
            return;
        }
        
        // Show confirmation for switching to lender (requires subscription)
        if (targetRole === this.ROLES.LENDER) {
            if (!await this.confirmLenderSwitch()) {
                return;
            }
        }
        
        // Switch role
        this.switchToRole(targetRole);
    },
    
    // Validate if user can switch to target role
    validateRoleSwitch(targetRole) {
        // Basic validation
        if (!Object.values(this.ROLES).includes(targetRole)) {
            this.showToast('Invalid role', 'error');
            return false;
        }
        
        // Check if user can access the target role
        switch (targetRole) {
            case this.ROLES.LENDER:
                return this.validateLenderAccess();
                
            case this.ROLES.ADMIN:
                return this.validateAdminAccess();
                
            case this.ROLES.GROUP_ADMIN:
                return this.validateGroupAdminAccess();
                
            case this.ROLES.BORROWER:
                return true; // Anyone can be a borrower
                
            default:
                return false;
        }
    },
    
    // Validate lender access
    validateLenderAccess() {
        // Check if user has lender profile
        if (!this.currentUser.lenderProfile) {
            this.showToast('You need to register as a lender first', 'warning');
            return false;
        }
        
        // Check subscription status
        if (this.currentSubscription?.status !== 'active') {
            this.showToast('You need an active subscription to access lender features', 'warning');
            return false;
        }
        
        return true;
    },
    
    // Validate admin access
    validateAdminAccess() {
        // Only system admins can access admin role
        if (!this.currentUser.isSystemAdmin) {
            this.showToast('Admin access denied', 'error');
            return false;
        }
        
        return true;
    },
    
    // Validate group admin access
    validateGroupAdminAccess() {
        // Check if user is admin of any group
        const groups = JSON.parse(localStorage.getItem('mPesewaGroups') || '[]');
        const userGroups = groups.filter(group => 
            group.adminId === this.currentUser.id || 
            group.moderators?.includes(this.currentUser.id)
        );
        
        if (userGroups.length === 0) {
            this.showToast('You are not a group admin', 'warning');
            return false;
        }
        
        return true;
    },
    
    // Confirm lender role switch (subscription required)
    async confirmLenderSwitch() {
        return new Promise((resolve) => {
            // Check if already has active subscription
            if (this.currentSubscription?.status === 'active') {
                resolve(true);
                return;
            }
            
            // Show subscription modal
            const modal = document.getElementById('subscriptionModal');
            if (modal) {
                modal.classList.add('show');
                
                // Handle subscription selection
                const subscribeBtn = modal.querySelector('.subscribe-btn');
                const cancelBtn = modal.querySelector('.cancel-btn');
                
                const handleSubscribe = () => {
                    modal.classList.remove('show');
                    this.handleSubscriptionSelection();
                    resolve(true);
                };
                
                const handleCancel = () => {
                    modal.classList.remove('show');
                    resolve(false);
                };
                
                subscribeBtn?.addEventListener('click', handleSubscribe, { once: true });
                cancelBtn?.addEventListener('click', handleCancel, { once: true });
                
                // Close on backdrop click
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        handleCancel();
                    }
                });
            } else {
                // Fallback to confirmation
                resolve(confirm('Switching to lender requires a subscription. Continue to subscription?'));
            }
        });
    },
    
    // Handle subscription selection
    handleSubscriptionSelection() {
        // Show subscription tiers
        this.showSubscriptionTiers();
    },
    
    // Show subscription tiers for selection
    showSubscriptionTiers() {
        const tiersContainer = document.getElementById('subscriptionTiersContainer');
        if (!tiersContainer) return;
        
        tiersContainer.innerHTML = '';
        
        Object.entries(this.SUBSCRIPTION_TIERS).forEach(([key, tier]) => {
            const tierCard = this.createTierCard(key, tier);
            tiersContainer.appendChild(tierCard);
        });
        
        tiersContainer.style.display = 'block';
    },
    
    // Create subscription tier card
    createTierCard(key, tier) {
        const card = document.createElement('div');
        card.className = `subscription-tier-card tier-${key}`;
        card.innerHTML = `
            <div class="tier-header">
                <h3 class="tier-name">${tier.name}</h3>
                <div class="tier-badge" style="background-color: var(--${tier.color})">${key.toUpperCase()}</div>
            </div>
            <div class="tier-body">
                <div class="tier-limit">
                    <span class="limit-label">Weekly Limit:</span>
                    <span class="limit-value">${Utils.Format.formatCurrency(tier.weeklyLimit, 'KES')}</span>
                </div>
                <div class="tier-fees">
                    <div class="fee-option">
                        <span class="fee-period">Monthly:</span>
                        <span class="fee-amount">${Utils.Format.formatCurrency(tier.monthlyFee, 'KES')}</span>
                    </div>
                    <div class="fee-option">
                        <span class="fee-period">Bi-Annual:</span>
                        <span class="fee-amount">${Utils.Format.formatCurrency(tier.biAnnualFee, 'KES')}</span>
                    </div>
                    <div class="fee-option">
                        <span class="fee-period">Annual:</span>
                        <span class="fee-amount">${Utils.Format.formatCurrency(tier.annualFee, 'KES')}</span>
                    </div>
                </div>
                <div class="tier-features">
                    <div class="feature">
                        <span class="feature-icon">${tier.crbCheck ? '✅' : '❌'}</span>
                        <span class="feature-text">CRB Check</span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">📊</span>
                        <span class="feature-text">Max Ledgers: ${tier.maxLedgers.toLocaleString()}</span>
                    </div>
                    ${tier.customInterest ? `
                    <div class="feature">
                        <span class="feature-icon">⚙️</span>
                        <span class="feature-text">Custom Interest Rates</span>
                    </div>
                    ` : ''}
                </div>
            </div>
            <div class="tier-footer">
                <button class="btn btn-primary select-tier-btn" data-tier="${key}">
                    Select ${tier.name}
                </button>
            </div>
        `;
        
        // Add event listener for tier selection
        const selectBtn = card.querySelector('.select-tier-btn');
        selectBtn.addEventListener('click', () => {
            this.handleTierSelection(key);
        });
        
        return card;
    },
    
    // Handle tier selection
    handleTierSelection(tierKey) {
        if (!this.currentUser) {
            this.showToast('Please log in to select a subscription', 'warning');
            return;
        }
        
        // Update user's subscription
        this.updateUserSubscription(tierKey);
        
        // Show payment redirect
        this.showPaymentRedirect(tierKey);
    },
    
    // Update user's subscription in storage
    updateUserSubscription(tierKey) {
        if (!this.currentUser) return;
        
        // Update user data
        const users = JSON.parse(localStorage.getItem('mPesewaUsers') || '[]');
        const userIndex = users.findIndex(u => u.id === this.currentUser.id);
        
        if (userIndex !== -1) {
            users[userIndex].subscriptionTier = tierKey;
            users[userIndex].subscriptionStatus = 'pending';
            users[userIndex].updatedAt = new Date().toISOString();
            
            localStorage.setItem('mPesewaUsers', JSON.stringify(users));
            
            // Update current user
            this.currentUser = users[userIndex];
            this.loadUserSubscription();
            
            // Update auth if available
            if (window.MpesewaAuth) {
                MpesewaAuth.currentUser = this.currentUser;
                MpesewaAuth.saveSession();
            }
        }
    },
    
    // Show payment redirect
    showPaymentRedirect(tierKey) {
        const tier = this.SUBSCRIPTION_TIERS[tierKey];
        const amount = tier.monthlyFee;
        
        // Show payment modal
        const paymentModal = document.getElementById('paymentModal');
        if (paymentModal) {
            paymentModal.classList.add('show');
            
            // Update payment details
            const amountElement = paymentModal.querySelector('.payment-amount');
            const tierElement = paymentModal.querySelector('.payment-tier');
            
            if (amountElement) amountElement.textContent = Utils.Format.formatCurrency(amount, 'KES');
            if (tierElement) tierElement.textContent = tier.name;
            
            // Handle payment confirmation
            const payBtn = paymentModal.querySelector('.confirm-payment-btn');
            const cancelBtn = paymentModal.querySelector('.cancel-payment-btn');
            
            const handlePayment = () => {
                this.completePayment(tierKey);
                paymentModal.classList.remove('show');
            };
            
            const handleCancel = () => {
                paymentModal.classList.remove('show');
                this.showToast('Payment cancelled', 'info');
            };
            
            payBtn?.addEventListener('click', handlePayment, { once: true });
            cancelBtn?.addEventListener('click', handleCancel, { once: true });
        } else {
            // Fallback - simulate payment
            this.completePayment(tierKey);
        }
    },
    
    // Complete payment process (simulated)
    completePayment(tierKey) {
        // Simulate payment processing
        this.showToast('Processing payment...', 'info');
        
        setTimeout(() => {
            // Update subscription status
            const users = JSON.parse(localStorage.getItem('mPesewaUsers') || '[]');
            const userIndex = users.findIndex(u => u.id === this.currentUser.id);
            
            if (userIndex !== -1) {
                users[userIndex].subscriptionStatus = 'active';
                users[userIndex].subscriptionExpiry = this.calculateSubscriptionExpiry();
                users[userIndex].isActive = true;
                users[userIndex].role = this.ROLES.LENDER; // Switch to lender role
                
                localStorage.setItem('mPesewaUsers', JSON.stringify(users));
                
                // Update current user
                this.currentUser = users[userIndex];
                this.loadUserSubscription();
                
                // Switch to lender role
                this.switchToRole(this.ROLES.LENDER);
                
                this.showToast('Payment successful! Lender account activated.', 'success');
            }
        }, 2000);
    },
    
    // Calculate subscription expiry (28th of next month)
    calculateSubscriptionExpiry() {
        const now = new Date();
        let year = now.getFullYear();
        let month = now.getMonth() + 2; // Next month
        
        if (month > 12) {
            month = month - 12;
            year++;
        }
        
        // Always expire on 28th
        return new Date(year, month - 1, 28).toISOString();
    },
    
    // Handle subscription upgrade
    handleSubscriptionUpgrade(tier) {
        if (!this.currentUser) {
            this.showToast('Please log in to upgrade subscription', 'warning');
            return;
        }
        
        if (this.currentRole !== this.ROLES.LENDER) {
            this.showToast('Only lenders can upgrade subscriptions', 'warning');
            return;
        }
        
        // Check if already at this tier
        if (this.currentSubscription?.tier === tier) {
            this.showToast(`You are already on ${this.SUBSCRIPTION_TIERS[tier].name} tier`, 'info');
            return;
        }
        
        // Show upgrade confirmation
        const currentTier = this.SUBSCRIPTION_TIERS[this.currentSubscription?.tier];
        const newTier = this.SUBSCRIPTION_TIERS[tier];
        
        if (confirm(`Upgrade from ${currentTier?.name || 'No'} to ${newTier.name} for ${Utils.Format.formatCurrency(newTier.monthlyFee, 'KES')}/month?`)) {
            this.updateUserSubscription(tier);
            this.showPaymentRedirect(tier);
        }
    },
    
    // Handle dual role registration
    handleDualRoleRegistration(enable) {
        const lenderFields = document.querySelectorAll('.lender-field');
        const subscriptionNote = document.getElementById('subscriptionNote');
        
        if (enable) {
            // Show lender fields
            lenderFields.forEach(field => field.style.display = 'block');
            if (subscriptionNote) subscriptionNote.style.display = 'block';
            
            // Update form validation
            this.enableLenderValidation();
        } else {
            // Hide lender fields
            lenderFields.forEach(field => field.style.display = 'none');
            if (subscriptionNote) subscriptionNote.style.display = 'none';
            
            // Disable lender validation
            this.disableLenderValidation();
        }
    },
    
    // Enable lender-specific validation
    enableLenderValidation() {
        const lenderFields = ['subscriptionTier', 'lenderCategory'];
        lenderFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.required = true;
            }
        });
    },
    
    // Disable lender-specific validation
    disableLenderValidation() {
        const lenderFields = ['subscriptionTier', 'lenderCategory'];
        lenderFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.required = false;
            }
        });
    },
    
    // Switch to a new role
    switchToRole(newRole) {
        // Update current role
        this.currentRole = newRole;
        this.currentPermissions = this.PERMISSIONS[newRole] || this.PERMISSIONS.borrower;
        
        // Save to localStorage
        localStorage.setItem('mPesewaCurrentRole', newRole);
        
        // Update auth system if available
        if (window.MpesewaAuth) {
            MpesewaAuth.currentRole = newRole;
            MpesewaAuth.saveSession();
        }
        
        // Update UI
        this.updateRoleUI();
        
        // Show success message
        this.showToast(`Switched to ${newRole} role`, 'success');
        
        // Refresh page to apply role-specific changes
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    },
    
    // Update UI based on current role
    updateRoleUI() {
        // Update role indicator
        const roleIndicator = document.getElementById('roleIndicator');
        if (roleIndicator) {
            roleIndicator.textContent = this.currentRole === this.ROLES.LENDER ? 'Lender' : 'Borrower';
            roleIndicator.className = `role-badge ${this.currentRole}`;
        }
        
        // Show/hide role-specific elements
        this.toggleRoleElements();
        
        // Update navigation based on permissions
        this.updateNavigation();
        
        // Update dashboard based on role
        this.updateDashboard();
        
        // Update subscription status display
        this.updateSubscriptionDisplay();
    },
    
    // Toggle role-specific UI elements
    toggleRoleElements() {
        // Borrower-only elements
        const borrowerElements = document.querySelectorAll('.borrower-only');
        borrowerElements.forEach(el => {
            el.style.display = this.currentRole === this.ROLES.BORROWER ? '' : 'none';
        });
        
        // Lender-only elements
        const lenderElements = document.querySelectorAll('.lender-only');
        lenderElements.forEach(el => {
            el.style.display = this.currentRole === this.ROLES.LENDER ? '' : 'none';
        });
        
        // Admin-only elements
        const adminElements = document.querySelectorAll('.admin-only');
        adminElements.forEach(el => {
            el.style.display = this.currentRole === this.ROLES.ADMIN ? '' : 'none';
        });
        
        // Group admin elements
        const groupAdminElements = document.querySelectorAll('.group-admin-only');
        groupAdminElements.forEach(el => {
            el.style.display = this.currentRole === this.ROLES.GROUP_ADMIN ? '' : 'none';
        });
    },
    
    // Update navigation based on permissions
    updateNavigation() {
        const navLinks = {
            lending: this.currentPermissions.canLend,
            borrowing: this.currentPermissions.canBorrow,
            ledger: this.currentPermissions.canViewLedger,
            subscriptions: this.currentPermissions.canManageSubscriptions,
            blacklist: this.currentPermissions.canViewBlacklist,
            admin: this.currentPermissions.canAccessAdmin
        };
        
        Object.entries(navLinks).forEach(([page, visible]) => {
            const link = document.querySelector(`[href*="${page}"]`);
            if (link) {
                link.style.display = visible ? '' : 'none';
            }
        });
    },
    
    // Update dashboard based on role
    updateDashboard() {
        const dashboard = document.querySelector('.dashboard');
        if (!dashboard) return;
        
        // Remove existing role classes
        dashboard.classList.remove('borrower-dashboard', 'lender-dashboard', 'admin-dashboard');
        
        // Add current role class
        dashboard.classList.add(`${this.currentRole}-dashboard`);
        
        // Update dashboard title
        const dashboardTitle = document.querySelector('.dashboard-title');
        if (dashboardTitle) {
            const roleName = this.currentRole.charAt(0).toUpperCase() + this.currentRole.slice(1);
            dashboardTitle.textContent = `${roleName} Dashboard`;
        }
    },
    
    // Update subscription status display
    updateSubscriptionDisplay() {
        const subscriptionStatus = document.getElementById('subscriptionStatus');
        const subscriptionTier = document.getElementById('subscriptionTier');
        const subscriptionExpiry = document.getElementById('subscriptionExpiry');
        const upgradeButtons = document.querySelectorAll('.upgrade-subscription-btn');
        
        if (this.currentSubscription) {
            const tier = this.SUBSCRIPTION_TIERS[this.currentSubscription.tier];
            
            // Update status display
            if (subscriptionStatus) {
                subscriptionStatus.textContent = this.currentSubscription.status;
                subscriptionStatus.className = `subscription-status ${this.currentSubscription.status}`;
            }
            
            // Update tier display
            if (subscriptionTier) {
                subscriptionTier.textContent = tier.name;
            }
            
            // Update expiry display
            if (subscriptionExpiry && this.currentSubscription.expiry) {
                const expiryDate = new Date(this.currentSubscription.expiry);
                const daysLeft = Math.ceil((expiryDate - new Date()) / (1000 * 60 * 60 * 24));
                subscriptionExpiry.textContent = `${Utils.Format.formatDate(expiryDate)} (${daysLeft} days left)`;
            }
            
            // Show upgrade buttons for lower tiers
            if (upgradeButtons.length > 0) {
                const currentTierIndex = Object.keys(this.SUBSCRIPTION_TIERS).indexOf(this.currentSubscription.tier);
                
                upgradeButtons.forEach(btn => {
                    const targetTier = btn.dataset.tier;
                    const targetTierIndex = Object.keys(this.SUBSCRIPTION_TIERS).indexOf(targetTier);
                    
                    btn.style.display = targetTierIndex > currentTierIndex ? 'block' : 'none';
                });
            }
        } else {
            // No subscription
            if (subscriptionStatus) subscriptionStatus.textContent = 'No Subscription';
            if (subscriptionTier) subscriptionTier.textContent = 'Not Subscribed';
            if (subscriptionExpiry) subscriptionExpiry.textContent = 'N/A';
            
            // Show all upgrade buttons
            upgradeButtons.forEach(btn => btn.style.display = 'block');
        }
    },
    
    // Check if user has permission
    hasPermission(permission) {
        return this.currentPermissions[permission] === true;
    },
    
    // Check if user can perform an action
    can(action, resource = null) {
        // Check basic permission
        if (!this.hasPermission(action)) {
            return false;
        }
        
        // Additional checks based on action
        switch (action) {
            case 'canLend':
                return this.canLend(resource);
                
            case 'canJoinGroups':
                return this.canJoinMoreGroups();
                
            case 'canRequestLoan':
                return this.canRequestLoan(resource);
                
            default:
                return true;
        }
    },
    
    // Check if user can lend
    canLend(loanAmount = 0) {
        if (!this.hasPermission('canLend')) return false;
        
        // Check subscription status
        if (!this.currentSubscription || this.currentSubscription.status !== 'active') {
            return false;
        }
        
        // Check subscription tier limit
        if (loanAmount > 0) {
            const tier = this.SUBSCRIPTION_TIERS[this.currentSubscription.tier];
            if (loanAmount > tier.weeklyLimit) {
                return false;
            }
        }
        
        return true;
    },
    
    // Check if user can join more groups
    canJoinMoreGroups() {
        if (!this.hasPermission('canJoinGroups')) return false;
        
        // Get user's current groups
        const userGroups = this.getUserGroups();
        const maxGroups = this.currentPermissions.maxGroups || 4;
        
        return userGroups.length < maxGroups;
    },
    
    // Check if user can request a loan
    canRequestLoan(groupId = null) {
        if (!this.hasPermission('canRequestLoan')) return false;
        
        // Check if blacklisted
        if (this.isBlacklisted()) {
            return false;
        }
        
        // Check if already has active loan in the same group
        if (groupId) {
            const activeLoans = this.getUserActiveLoans();
            if (activeLoans.some(loan => loan.groupId === groupId)) {
                return false;
            }
        }
        
        return true;
    },
    
    // Get user's groups
    getUserGroups() {
        if (!this.currentUser) return [];
        
        const groups = JSON.parse(localStorage.getItem('mPesewaGroups') || '[]');
        return groups.filter(group => 
            group.members?.some(member => member.id === this.currentUser.id)
        );
    },
    
    // Get user's active loans
    getUserActiveLoans() {
        if (!this.currentUser) return [];
        
        const ledgers = JSON.parse(localStorage.getItem('mPesewaLedgers') || '[]');
        return ledgers.filter(ledger => 
            ledger.borrowerId === this.currentUser.id && 
            ledger.status === 'active'
        );
    },
    
    // Check if user is blacklisted
    isBlacklisted() {
        if (!this.currentUser) return false;
        
        const blacklist = JSON.parse(localStorage.getItem('mPesewaBlacklist') || '[]');
        return blacklist.some(entry => entry.userId === this.currentUser.id);
    },
    
    // Get current subscription tier info
    getCurrentTier() {
        if (!this.currentSubscription) return null;
        return this.SUBSCRIPTION_TIERS[this.currentSubscription.tier];
    },
    
    // Show toast notification
    showToast(message, type = 'info') {
        if (window.showToast) {
            window.showToast(message, type);
        } else if (window.Utils && Utils.Error) {
            Utils.Error.showError({ message }, message);
        } else {
            alert(message);
        }
    },
    
    // Get role display name
    getRoleDisplayName(role) {
        const names = {
            [this.ROLES.BORROWER]: 'Borrower',
            [this.ROLES.LENDER]: 'Lender',
            [this.ROLES.ADMIN]: 'Administrator',
            [this.ROLES.GROUP_ADMIN]: 'Group Admin'
        };
        
        return names[role] || role;
    }
};

// Initialize role management when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    MpesewaRoles.init();
});

// Make available globally
window.MpesewaRoles = MpesewaRoles;