/**
 * M-Pesewa Lender Module Index
 * Main entry point for lender module functionality
 * Implements strict hierarchy and lending rules
 */

import { LenderStateMachine } from './lender.state-machine.js';
import { LenderRules } from './lender.rules.js';
import { LenderPermissions } from './lender.permissions.js';
import { LenderAudit } from './lender.audit.js';

class LenderModule {
    constructor() {
        this.stateMachine = new LenderStateMachine();
        this.rules = new LenderRules();
        this.permissions = new LenderPermissions();
        this.audit = new LenderAudit();
        
        this.currentUser = null;
        this.currentCountry = null;
        this.currentGroup = null;
        this.subscription = null;
        
        this.initialize();
    }
    
    /**
     * Initialize lender module
     */
    async initialize() {
        try {
            // Check authentication
            await this.checkAuthentication();
            
            // Load user data
            await this.loadUserData();
            
            // Check subscription status
            await this.checkSubscription();
            
            // Initialize state machine
            await this.initializeStateMachine();
            
            // Set up event listeners
            this.setupEventListeners();
            
            console.log('Lender module initialized successfully');
            
        } catch (error) {
            console.error('Failed to initialize lender module:', error);
            this.handleInitializationError(error);
        }
    }
    
    /**
     * Check if user is authenticated and is a lender
     */
    async checkAuthentication() {
        const token = localStorage.getItem('mpesewa_auth_token');
        const userRole = localStorage.getItem('mpesewa_user_role');
        
        if (!token) {
            throw new Error('Not authenticated. Please log in.');
        }
        
        if (userRole !== 'lender') {
            throw new Error('Access denied. User is not a lender.');
        }
        
        // Verify token with backend (simulated)
        const isValid = await this.verifyAuthToken(token);
        if (!isValid) {
            throw new Error('Invalid authentication token.');
        }
        
        return true;
    }
    
    /**
     * Load user data from localStorage
     */
    async loadUserData() {
        this.currentUser = JSON.parse(localStorage.getItem('mpesewa_user') || '{}');
        this.currentCountry = localStorage.getItem('mpesewa_country');
        this.currentGroup = localStorage.getItem('mpesewa_group');
        this.subscription = JSON.parse(localStorage.getItem('mpesewa_subscription') || '{}');
        
        if (!this.currentUser.id) {
            throw new Error('User data not found.');
        }
        
        if (!this.currentCountry) {
            throw new Error('Country not selected. Please select a country.');
        }
        
        console.log('User data loaded:', {
            user: this.currentUser.username,
            country: this.currentCountry,
            group: this.currentGroup,
            subscription: this.subscription.level
        });
    }
    
    /**
     * Check subscription status and enforce rules
     */
    async checkSubscription() {
        if (!this.subscription || !this.subscription.level) {
            throw new Error('No active subscription found.');
        }
        
        const today = new Date();
        const expiryDate = new Date(this.subscription.expiryDate);
        
        // Check if subscription expired (28th rule)
        if (today > expiryDate) {
            this.stateMachine.transitionTo('EXPIRED');
            this.permissions.blockLending();
            
            this.audit.log({
                action: 'SUBSCRIPTION_EXPIRED',
                userId: this.currentUser.id,
                details: {
                    level: this.subscription.level,
                    expiryDate: this.subscription.expiryDate
                }
            });
            
            throw new Error('Subscription expired. Please renew to continue lending.');
        }
        
        // Check if subscription is about to expire (warning 3 days before)
        const daysToExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
        if (daysToExpiry <= 3) {
            this.showWarning(`Your subscription expires in ${daysToExpiry} days (on the 28th).`);
        }
        
        // Set permissions based on subscription level
        this.permissions.setSubscriptionLevel(this.subscription.level);
        this.stateMachine.transitionTo('ACTIVE');
    }
    
    /**
     * Initialize state machine with current state
     */
    async initializeStateMachine() {
        const initialState = this.subscription.active ? 'ACTIVE' : 'NEW';
        this.stateMachine.initialize(initialState);
        
        // Add state change listener
        this.stateMachine.onStateChange((oldState, newState) => {
            console.log(`Lender state changed: ${oldState} → ${newState}`);
            this.audit.log({
                action: 'STATE_CHANGE',
                userId: this.currentUser.id,
                details: { oldState, newState }
            });
            
            // Update UI based on state
            this.updateUIForState(newState);
        });
    }
    
    /**
     * Update UI based on lender state
     */
    updateUIForState(state) {
        const stateElements = document.querySelectorAll('[data-lender-state]');
        stateElements.forEach(element => {
            const showForStates = element.dataset.lenderState.split(',');
            if (showForStates.includes(state)) {
                element.style.display = '';
            } else {
                element.style.display = 'none';
            }
        });
        
        // Update state indicator
        const stateIndicator = document.getElementById('lender-state-indicator');
        if (stateIndicator) {
            stateIndicator.textContent = `Status: ${state}`;
            stateIndicator.className = `state-${state.toLowerCase()}`;
        }
    }
    
    /**
     * Handle loan request approval
     */
    async approveLoanRequest(requestData) {
        try {
            // Check permissions
            if (!this.permissions.canApproveLoan()) {
                throw new Error('Permission denied. Cannot approve loans in current state.');
            }
            
            // Validate request against rules
            const validation = this.rules.validateLoanRequest(requestData, {
                lender: this.currentUser,
                subscription: this.subscription,
                group: this.currentGroup,
                country: this.currentCountry
            });
            
            if (!validation.valid) {
                throw new Error(`Loan request validation failed: ${validation.error}`);
            }
            
            // Check group isolation
            if (requestData.groupId !== this.currentGroup) {
                throw new Error('Group isolation violation: Cannot lend outside your group.');
            }
            
            // Check country isolation
            if (requestData.country !== this.currentCountry) {
                throw new Error('Country isolation violation: Cannot lend across countries.');
            }
            
            // Check subscription limits
            const amount = parseFloat(requestData.amount);
            if (!this.permissions.isWithinLimits(amount)) {
                throw new Error(`Amount exceeds subscription limit for ${this.subscription.level} tier.`);
            }
            
            // Create ledger entry
            const ledgerId = await this.createLedger(requestData);
            
            // Update lender statistics
            await this.updateLenderStats(amount);
            
            // Log audit trail
            this.audit.log({
                action: 'LOAN_APPROVED',
                userId: this.currentUser.id,
                details: {
                    requestId: requestData.id,
                    borrowerId: requestData.borrowerId,
                    amount: amount,
                    ledgerId: ledgerId,
                    category: requestData.category
                }
            });
            
            // Send notification to borrower
            await this.notifyBorrower(requestData.borrowerId, 'LOAN_APPROVED', {
                amount: amount,
                lender: this.currentUser.username,
                ledgerId: ledgerId
            });
            
            return {
                success: true,
                ledgerId: ledgerId,
                message: 'Loan approved successfully. Ledger created.'
            };
            
        } catch (error) {
            console.error('Loan approval failed:', error);
            
            this.audit.log({
                action: 'LOAN_APPROVAL_FAILED',
                userId: this.currentUser.id,
                details: {
                    requestId: requestData.id,
                    error: error.message
                }
            });
            
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    /**
     * Create ledger entry for approved loan
     */
    async createLedger(loanData) {
        const ledgerId = `LEDGER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        const ledgerEntry = {
            id: ledgerId,
            lenderId: this.currentUser.id,
            borrowerId: loanData.borrowerId,
            borrowerName: loanData.borrowerName,
            borrowerContact: loanData.borrowerContact,
            borrowerLocation: loanData.borrowerLocation,
            guarantors: loanData.guarantors || [],
            category: loanData.category,
            amount: parseFloat(loanData.amount),
            interestRate: 0.10, // 10%
            penaltyRate: 0.05, // 5% daily after 7 days
            dateBorrowed: new Date().toISOString(),
            expectedRepaymentDate: this.calculateDueDate(7), // 7 days
            status: 'ACTIVE',
            transactions: [],
            created: new Date().toISOString(),
            updated: new Date().toISOString()
        };
        
        // Save to localStorage (in real implementation, this would be a backend API call)
        const ledgers = JSON.parse(localStorage.getItem('mpesewa_ledgers') || '[]');
        ledgers.push(ledgerEntry);
        localStorage.setItem('mpesewa_ledgers', JSON.stringify(ledgers));
        
        // Update lender's ledger count
        this.currentUser.ledgerCount = (this.currentUser.ledgerCount || 0) + 1;
        localStorage.setItem('mpesewa_user', JSON.stringify(this.currentUser));
        
        return ledgerId;
    }
    
    /**
     * Update lender statistics
     */
    async updateLenderStats(amount) {
        // Update total lent
        this.currentUser.totalLent = (this.currentUser.totalLent || 0) + amount;
        
        // Update active loans count
        this.currentUser.activeLoans = (this.currentUser.activeLoans || 0) + 1;
        
        // Save updated user data
        localStorage.setItem('mpesewa_user', JSON.stringify(this.currentUser));
        
        // Update dashboard display
        this.updateDashboardStats();
    }
    
    /**
     * Update dashboard statistics display
     */
    updateDashboardStats() {
        const stats = {
            totalLent: this.currentUser.totalLent || 0,
            activeLoans: this.currentUser.activeLoans || 0,
            ledgerCount: this.currentUser.ledgerCount || 0,
            defaultRate: this.calculateDefaultRate(),
            expectedInterest: this.calculateExpectedInterest()
        };
        
        // Update DOM elements
        Object.keys(stats).forEach(statKey => {
            const element = document.getElementById(`stat-${statKey}`);
            if (element) {
                element.textContent = this.formatCurrency(stats[statKey], statKey);
            }
        });
    }
    
    /**
     * Calculate due date based on loan duration
     */
    calculateDueDate(days = 7) {
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + days);
        return dueDate.toISOString();
    }
    
    /**
     * Calculate default rate
     */
    calculateDefaultRate() {
        const totalLoans = this.currentUser.totalLoans || 0;
        const defaults = this.currentUser.defaults || 0;
        
        if (totalLoans === 0) return 0;
        return ((defaults / totalLoans) * 100).toFixed(1);
    }
    
    /**
     * Calculate expected interest
     */
    calculateExpectedInterest() {
        const activeLoans = this.currentUser.activeLoans || 0;
        const avgLoanAmount = (this.currentUser.totalLent || 0) / (this.currentUser.ledgerCount || 1);
        
        return activeLoans * avgLoanAmount * 0.10; // 10% interest
    }
    
    /**
     * Format currency based on country
     */
    formatCurrency(amount, type = 'amount') {
        const currencySymbols = {
            'Kenya': 'KSh',
            'Uganda': 'UGX',
            'Tanzania': 'TZS',
            'Rwanda': 'RWF',
            'Burundi': 'BIF',
            'DRC': 'CDF',
            'Nigeria': 'NGN',
            'Ghana': 'GHS',
            'South Africa': 'ZAR',
            'South Sudan': 'SSP',
            'Somalia': 'SOS',
            'Ethiopia': 'ETB'
        };
        
        const symbol = currencySymbols[this.currentCountry] || '';
        
        if (type === 'percentage') {
            return `${amount}%`;
        }
        
        return `${symbol} ${parseFloat(amount).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    }
    
    /**
     * Show warning message
     */
    showWarning(message) {
        const warningDiv = document.createElement('div');
        warningDiv.className = 'warning-banner';
        warningDiv.innerHTML = `
            <div style="background: #fff3cd; color: #856404; padding: 15px; border-radius: 8px; border: 1px solid #ffc107; display: flex; align-items: center; justify-content: space-between;">
                <span>⚠️ ${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" style="background: transparent; border: none; color: #856404; cursor: pointer; font-size: 18px;">
                    ×
                </button>
            </div>
        `;
        
        const container = document.querySelector('.warning-container') || document.body;
        container.prepend(warningDiv);
    }
    
    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Loan approval buttons
        document.addEventListener('click', (event) => {
            if (event.target.matches('[data-action="approve-loan"]')) {
                const requestId = event.target.dataset.requestId;
                this.handleLoanApproval(requestId);
            }
        });
        
        // Repayment update buttons
        document.addEventListener('click', (event) => {
            if (event.target.matches('[data-action="update-repayment"]')) {
                const ledgerId = event.target.dataset.ledgerId;
                this.handleRepaymentUpdate(ledgerId);
            }
        });
        
        // Blacklist buttons
        document.addEventListener('click', (event) => {
            if (event.target.matches('[data-action="blacklist-borrower"]')) {
                const borrowerId = event.target.dataset.borrowerId;
                this.handleBlacklistRequest(borrowerId);
            }
        });
        
        // Subscription renewal
        document.addEventListener('click', (event) => {
            if (event.target.matches('[data-action="renew-subscription"]')) {
                this.handleSubscriptionRenewal();
            }
        });
    }
    
    /**
     * Handle loan approval from UI
     */
    async handleLoanApproval(requestId) {
        // Fetch request data (simulated)
        const requestData = this.getRequestData(requestId);
        
        if (!requestData) {
            alert('Loan request not found.');
            return;
        }
        
        const confirmation = confirm(`Approve loan of ${this.formatCurrency(requestData.amount)} to ${requestData.borrowerName}?`);
        
        if (confirmation) {
            const result = await this.approveLoanRequest(requestData);
            
            if (result.success) {
                alert(`Loan approved! Ledger created: ${result.ledgerId}`);
                
                // Remove request from UI
                const requestElement = document.querySelector(`[data-request-id="${requestId}"]`);
                if (requestElement) {
                    requestElement.remove();
                }
                
                // Update UI
                this.updateDashboardStats();
            } else {
                alert(`Failed to approve loan: ${result.error}`);
            }
        }
    }
    
    /**
     * Handle repayment update
     */
    async handleRepaymentUpdate(ledgerId) {
        const amount = prompt('Enter repayment amount:');
        
        if (amount && !isNaN(parseFloat(amount))) {
            // Update ledger (simulated)
            this.updateLedgerRepayment(ledgerId, parseFloat(amount));
            alert(`Repayment of ${this.formatCurrency(amount)} recorded.`);
            
            // Update UI
            this.updateDashboardStats();
        }
    }
    
    /**
     * Handle blacklist request
     */
    async handleBlacklistRequest(borrowerId) {
        const reason = prompt('Enter reason for blacklisting:');
        
        if (reason) {
            const confirmed = confirm(`Blacklist this borrower? This action is irreversible without admin approval.`);
            
            if (confirmed) {
                // Initiate blacklist (simulated)
                this.initiateBlacklist(borrowerId, reason);
                alert('Blacklist request submitted. Admin will review.');
            }
        }
    }
    
    /**
     * Handle subscription renewal
     */
    async handleSubscriptionRenewal() {
        window.location.href = '../subscription/subscribe.html';
    }
    
    /**
     * Get request data (simulated)
     */
    getRequestData(requestId) {
        // In real implementation, this would fetch from backend
        const requests = JSON.parse(localStorage.getItem('mpesewa_loan_requests') || '[]');
        return requests.find(req => req.id === requestId);
    }
    
    /**
     * Update ledger repayment (simulated)
     */
    updateLedgerRepayment(ledgerId, amount) {
        const ledgers = JSON.parse(localStorage.getItem('mpesewa_ledgers') || '[]');
        const ledgerIndex = ledgers.findIndex(ledger => ledger.id === ledgerId);
        
        if (ledgerIndex !== -1) {
            ledgers[ledgerIndex].transactions.push({
                type: 'REPAYMENT',
                amount: amount,
                date: new Date().toISOString()
            });
            
            // Update ledger balance
            const totalRepaid = ledgers[ledgerIndex].transactions
                .filter(t => t.type === 'REPAYMENT')
                .reduce((sum, t) => sum + t.amount, 0);
            
            if (totalRepaid >= ledgers[ledgerIndex].amount) {
                ledgers[ledgerIndex].status = 'CLEARED';
            }
            
            localStorage.setItem('mpesewa_ledgers', JSON.stringify(ledgers));
        }
    }
    
    /**
     * Initiate blacklist (simulated)
     */
    initiateBlacklist(borrowerId, reason) {
        const blacklistEntry = {
            borrowerId: borrowerId,
            lenderId: this.currentUser.id,
            reason: reason,
            date: new Date().toISOString(),
            status: 'PENDING'
        };
        
        const blacklist = JSON.parse(localStorage.getItem('mpesewa_blacklist') || '[]');
        blacklist.push(blacklistEntry);
        localStorage.setItem('mpesewa_blacklist', JSON.stringify(blacklist));
        
        this.audit.log({
            action: 'BLACKLIST_REQUESTED',
            userId: this.currentUser.id,
            details: { borrowerId, reason }
        });
    }
    
    /**
     * Verify auth token (simulated)
     */
    async verifyAuthToken(token) {
        // In real implementation, this would call backend API
        return token === localStorage.getItem('mpesewa_auth_token');
    }
    
    /**
     * Notify borrower (simulated)
     */
    async notifyBorrower(borrowerId, type, data) {
        // In real implementation, this would send push notification or email
        console.log(`Notification to ${borrowerId}: ${type}`, data);
        
        const notifications = JSON.parse(localStorage.getItem('mpesewa_notifications') || '[]');
        notifications.push({
            userId: borrowerId,
            type: type,
            data: data,
            timestamp: new Date().toISOString(),
            read: false
        });
        
        localStorage.setItem('mpesewa_notifications', JSON.stringify(notifications));
    }
    
    /**
     * Handle initialization error
     */
    handleInitializationError(error) {
        console.error('Lender module initialization error:', error);
        
        // Redirect to login if not authenticated
        if (error.message.includes('authenticated') || error.message.includes('token')) {
            window.location.href = '../auth/login.html?redirect=lender';
            return;
        }
        
        // Redirect to country selection if no country
        if (error.message.includes('country')) {
            window.location.href = '../global-pages/countries.html';
            return;
        }
        
        // Show subscription expired message
        if (error.message.includes('Subscription expired')) {
            this.showWarning(error.message);
            
            // Disable lending actions
            document.querySelectorAll('[data-lender-action]').forEach(element => {
                element.disabled = true;
                element.style.opacity = '0.5';
                element.style.cursor = 'not-allowed';
            });
            
            // Show renewal button
            const renewalButton = document.createElement('button');
            renewalButton.textContent = 'Renew Subscription';
            renewalButton.className = 'btn-renewal';
            renewalButton.onclick = () => this.handleSubscriptionRenewal();
            
            const container = document.querySelector('.error-container') || document.body;
            container.appendChild(renewalButton);
        }
    }
}

// Export the LenderModule class
export default LenderModule;

// Initialize lender module when DOM is loaded
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        // Only initialize on lender pages
        if (window.location.pathname.includes('/lender/')) {
            const lenderModule = new LenderModule();
            window.MPesewaLender = lenderModule; // Make available globally
        }
    });
}

// Utility functions for global access
window.MPesewaUtils = {
    formatCurrency: (amount, country) => {
        const currencySymbols = {
            'Kenya': 'KSh',
            'Uganda': 'UGX',
            'Tanzania': 'TZS',
            'Rwanda': 'RWF',
            'Burundi': 'BIF',
            'DRC': 'CDF',
            'Nigeria': 'NGN',
            'Ghana': 'GHS',
            'South Africa': 'ZAR',
            'South Sudan': 'SSP',
            'Somalia': 'SOS',
            'Ethiopia': 'ETB'
        };
        
        const symbol = currencySymbols[country] || '';
        return `${symbol} ${parseFloat(amount).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    },
    
    calculateInterest: (principal, days = 7) => {
        const interestRate = 0.10; // 10%
        return principal * interestRate;
    },
    
    calculatePenalty: (principal, overdueDays) => {
        const penaltyRate = 0.05; // 5% daily
        return principal * penaltyRate * overdueDays;
    },
    
    checkSubscriptionExpiry: (expiryDate) => {
        const today = new Date();
        const expiry = new Date(expiryDate);
        const daysToExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
        
        if (daysToExpiry < 0) return { expired: true, days: 0 };
        return { expired: false, days: daysToExpiry };
    }
};