/**
 * M-PESEWA - Subscription Management Module
 * Handles subscription plans, payments, and expiration logic
 */

class SubscriptionManager {
    constructor() {
        this.subscriptionPlans = {
            basic: {
                id: 'basic',
                name: 'Basic',
                weeklyLimit: 1500,
                monthlyPrice: 50,
                biAnnualPrice: 250,
                annualPrice: 500,
                crbRequired: false,
                ledgerLimit: 1500,
                maxActiveLoans: 5,
                color: '#6B7280',
                features: ['Up to KES 1,500 per week', 'Max 5 active ledgers', 'No CRB check']
            },
            premium: {
                id: 'premium',
                name: 'Premium',
                weeklyLimit: 5000,
                monthlyPrice: 250,
                biAnnualPrice: 1500,
                annualPrice: 2500,
                crbRequired: false,
                ledgerLimit: 10000,
                maxActiveLoans: 20,
                color: '#3B82F6',
                features: ['Up to KES 5,000 per week', 'Max 20 active ledgers', 'Priority support']
            },
            super: {
                id: 'super',
                name: 'Super',
                weeklyLimit: 20000,
                monthlyPrice: 1000,
                biAnnualPrice: 5000,
                annualPrice: 8500,
                crbRequired: true,
                ledgerLimit: 20000,
                maxActiveLoans: 50,
                color: '#F59E0B',
                features: ['Up to KES 20,000 per week', 'Max 50 active ledgers', 'CRB check included']
            },
            lol: {
                id: 'lol',
                name: 'Lender of Lenders',
                weeklyLimit: 50000,
                monthlyPrice: 500,
                biAnnualPrice: 3500,
                annualPrice: 6500,
                crbRequired: true,
                ledgerLimit: null, // Unlimited
                maxActiveLoans: null, // Unlimited
                color: '#2B1D4F',
                features: ['Up to KES 50,000 per week', 'Unlimited ledgers', 'Custom interest rates', 'Min 30-day tenure']
            }
        };

        this.currentSubscription = null;
        this.init();
    }

    init() {
        this.loadSubscriptionFromStorage();
        this.renderSubscriptionPlans();
        this.setupEventListeners();
        this.checkSubscriptionStatus();
    }

    loadSubscriptionFromStorage() {
        try {
            const saved = localStorage.getItem('mpesewa_subscription');
            if (saved) {
                this.currentSubscription = JSON.parse(saved);
                this.updateUIWithCurrentSubscription();
            }
        } catch (error) {
            console.error('Failed to load subscription:', error);
        }
    }

    saveSubscriptionToStorage() {
        try {
            localStorage.setItem('mpesewa_subscription', JSON.stringify(this.currentSubscription));
        } catch (error) {
            console.error('Failed to save subscription:', error);
        }
    }

    renderSubscriptionPlans() {
        const container = document.getElementById('subscriptionPlans');
        if (!container) return;

        Object.values(this.subscriptionPlans).forEach(plan => {
            const planCard = this.createPlanCard(plan);
            container.appendChild(planCard);
        });
    }

    createPlanCard(plan) {
        const card = document.createElement('div');
        card.className = `pricing-card ${plan.id === 'premium' ? 'popular' : ''}`;
        
        const isPopular = plan.id === 'premium';
        const isCurrent = this.currentSubscription && this.currentSubscription.planId === plan.id;
        
        card.innerHTML = `
            ${isPopular ? '<div class="popular-badge">Most Popular</div>' : ''}
            ${isCurrent ? '<div class="current-badge">Current Plan</div>' : ''}
            <div class="pricing-header">
                <h3>${plan.name}</h3>
                <div class="pricing-amount">KES ${plan.monthlyPrice}<span>/month</span></div>
            </div>
            <div class="pricing-features">
                <p><strong>Weekly Limit:</strong> ≤ KES ${plan.weeklyLimit.toLocaleString()}</p>
                <p><strong>Ledger Limit:</strong> ${plan.ledgerLimit ? 'KES ' + plan.ledgerLimit.toLocaleString() : 'Unlimited'}</p>
                <p><strong>CRB Check:</strong> ${plan.crbRequired ? 'Required' : 'No'}</p>
                <p><strong>Max Active Loans:</strong> ${plan.maxActiveLoans || 'Unlimited'}</p>
                <div class="plan-features">
                    ${plan.features.map(feature => `<p class="feature-item">✓ ${feature}</p>`).join('')}
                </div>
            </div>
            <div class="pricing-actions">
                ${isCurrent ? 
                    `<button class="btn outline disabled" disabled>Current Plan</button>` :
                    `<button class="btn ${isPopular ? 'primary' : 'outline'}" data-plan="${plan.id}">
                        Choose ${plan.name}
                    </button>`
                }
            </div>
        `;

        if (!isCurrent) {
            const button = card.querySelector('button');
            button.addEventListener('click', () => this.selectPlan(plan));
        }

        return card;
    }

    selectPlan(plan) {
        if (!this.confirmPlanSelection(plan)) {
            return;
        }

        this.showPaymentModal(plan);
    }

    confirmPlanSelection(plan) {
        return confirm(`You are about to subscribe to ${plan.name} plan for KES ${plan.monthlyPrice}/month.\n\nFeatures:\n${plan.features.join('\n')}\n\nContinue to payment?`);
    }

    showPaymentModal(plan) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = 'paymentModal';
        
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Complete Your Subscription</h3>
                    <button class="modal-close" onclick="document.getElementById('paymentModal').remove()">×</button>
                </div>
                <div class="modal-body">
                    <div class="payment-summary">
                        <h4>${plan.name} Plan</h4>
                        <p class="payment-amount">KES ${plan.monthlyPrice} / month</p>
                        <div class="payment-features">
                            ${plan.features.map(f => `<p>✓ ${f}</p>`).join('')}
                        </div>
                    </div>
                    
                    <form id="paymentForm" class="payment-form">
                        <div class="form-group">
                            <label for="paymentMethod">Payment Method</label>
                            <select id="paymentMethod" class="form-control" required>
                                <option value="">Select payment method</option>
                                <option value="mpesa">M-Pesa</option>
                                <option value="card">Credit/Debit Card</option>
                                <option value="bank">Bank Transfer</option>
                            </select>
                        </div>
                        
                        <div id="mpesaDetails" class="payment-method-details" style="display: none;">
                            <div class="form-group">
                                <label for="phoneNumber">M-Pesa Phone Number</label>
                                <input type="tel" id="phoneNumber" class="form-control" placeholder="07XXXXXXXX">
                            </div>
                            <p class="help-text">You will receive a prompt on your phone to complete payment</p>
                        </div>
                        
                        <div id="cardDetails" class="payment-method-details" style="display: none;">
                            <div class="form-group">
                                <label for="cardNumber">Card Number</label>
                                <input type="text" id="cardNumber" class="form-control" placeholder="1234 5678 9012 3456">
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="expiryDate">Expiry Date</label>
                                    <input type="text" id="expiryDate" class="form-control" placeholder="MM/YY">
                                </div>
                                <div class="form-group">
                                    <label for="cvv">CVV</label>
                                    <input type="text" id="cvv" class="form-control" placeholder="123">
                                </div>
                            </div>
                        </div>
                        
                        <div id="bankDetails" class="payment-method-details" style="display: none;">
                            <div class="form-group">
                                <label>Bank Account Details</label>
                                <p class="bank-info">
                                    Bank: M-PESEWA Trust Bank<br>
                                    Account: 1234567890<br>
                                    Branch: 123<br>
                                    Reference: SUB-${plan.id.toUpperCase()}-${Date.now()}
                                </p>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="billingCycle">Billing Cycle</label>
                            <select id="billingCycle" class="form-control" required>
                                <option value="monthly">Monthly - KES ${plan.monthlyPrice}</option>
                                <option value="biannual">Bi-Annual - KES ${plan.biAnnualPrice} (Save ${Math.round((1 - (plan.biAnnualPrice/(plan.monthlyPrice * 6))) * 100)}%)</option>
                                <option value="annual">Annual - KES ${plan.annualPrice} (Save ${Math.round((1 - (plan.annualPrice/(plan.monthlyPrice * 12))) * 100)}%)</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label class="checkbox-item">
                                <input type="checkbox" id="autoRenew" checked>
                                <span>Enable auto-renewal</span>
                            </label>
                            <p class="help-text">Your subscription will automatically renew on the 28th of each month</p>
                        </div>
                        
                        <div class="form-actions">
                            <button type="button" class="btn secondary" onclick="document.getElementById('paymentModal').remove()">Cancel</button>
                            <button type="submit" class="btn primary">Complete Payment</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        modal.style.display = 'block';

        // Setup payment method toggle
        document.getElementById('paymentMethod').addEventListener('change', (e) => {
            this.togglePaymentMethodDetails(e.target.value);
        });

        // Handle form submission
        document.getElementById('paymentForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.processPayment(plan);
        });
    }

    togglePaymentMethodDetails(method) {
        ['mpesaDetails', 'cardDetails', 'bankDetails'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.style.display = id.startsWith(method) ? 'block' : 'none';
            }
        });
    }

    processPayment(plan) {
        // In a real app, this would integrate with a payment gateway
        // For demo purposes, we'll simulate a successful payment
        
        const paymentMethod = document.getElementById('paymentMethod').value;
        const billingCycle = document.getElementById('billingCycle').value;
        const autoRenew = document.getElementById('autoRenew').checked;

        if (!paymentMethod) {
            alert('Please select a payment method');
            return;
        }

        // Show loading state
        const submitBtn = document.querySelector('#paymentForm button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Processing...';
        submitBtn.disabled = true;

        // Simulate payment processing
        setTimeout(() => {
            this.activateSubscription(plan, {
                billingCycle,
                autoRenew,
                paymentMethod
            });
            
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
            document.getElementById('paymentModal').remove();
            this.showSuccessMessage(plan);
        }, 2000);
    }

    activateSubscription(plan, paymentDetails) {
        const startDate = new Date();
        const expiryDate = this.calculateExpiryDate(startDate, paymentDetails.billingCycle);
        
        this.currentSubscription = {
            planId: plan.id,
            planName: plan.name,
            startDate: startDate.toISOString(),
            expiryDate: expiryDate.toISOString(),
            billingCycle: paymentDetails.billingCycle,
            autoRenew: paymentDetails.autoRenew,
            paymentMethod: paymentDetails.paymentMethod,
            status: 'active',
            weeklyLimit: plan.weeklyLimit,
            ledgerLimit: plan.ledgerLimit,
            maxActiveLoans: plan.maxActiveLoans
        };

        this.saveSubscriptionToStorage();
        this.updateUIWithCurrentSubscription();
        
        // Dispatch event for other modules to react
        document.dispatchEvent(new CustomEvent('subscriptionChanged', {
            detail: this.currentSubscription
        }));
    }

    calculateExpiryDate(startDate, billingCycle) {
        const expiry = new Date(startDate);
        
        switch (billingCycle) {
            case 'monthly':
                expiry.setMonth(expiry.getMonth() + 1);
                // Set to 28th of next month
                expiry.setDate(28);
                break;
            case 'biannual':
                expiry.setMonth(expiry.getMonth() + 6);
                expiry.setDate(28);
                break;
            case 'annual':
                expiry.setFullYear(expiry.getFullYear() + 1);
                expiry.setDate(28);
                break;
            default:
                expiry.setMonth(expiry.getMonth() + 1);
                expiry.setDate(28);
        }
        
        return expiry;
    }

    showSuccessMessage(plan) {
        alert(`🎉 Congratulations! Your ${plan.name} subscription has been activated.\n\nYou can now start lending to borrowers in your groups.\n\nSubscription expires on the 28th of ${new Date(this.currentSubscription.expiryDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}.`);
    }

    updateUIWithCurrentSubscription() {
        if (!this.currentSubscription) return;

        // Update subscription status display
        const statusElement = document.getElementById('subscriptionStatus');
        if (statusElement) {
            const expiryDate = new Date(this.currentSubscription.expiryDate);
            const daysRemaining = Math.ceil((expiryDate - new Date()) / (1000 * 60 * 60 * 24));
            
            statusElement.innerHTML = `
                <div class="subscription-status-card">
                    <h4>Current Subscription: ${this.currentSubscription.planName}</h4>
                    <p><strong>Status:</strong> <span class="status-active">Active</span></p>
                    <p><strong>Weekly Limit:</strong> KES ${this.currentSubscription.weeklyLimit.toLocaleString()}</p>
                    <p><strong>Expires:</strong> ${expiryDate.toLocaleDateString()} (${daysRemaining} days remaining)</p>
                    <p><strong>Auto-renewal:</strong> ${this.currentSubscription.autoRenew ? 'Enabled' : 'Disabled'}</p>
                </div>
            `;
        }

        // Update any buttons or UI elements that depend on subscription
        document.querySelectorAll('.lending-action').forEach(button => {
            button.disabled = false;
        });
    }

    checkSubscriptionStatus() {
        if (!this.currentSubscription) return;

        const expiryDate = new Date(this.currentSubscription.expiryDate);
        const now = new Date();
        const daysUntilExpiry = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));

        if (daysUntilExpiry <= 0) {
            this.handleSubscriptionExpired();
        } else if (daysUntilExpiry <= 7) {
            this.showExpiryWarning(daysUntilExpiry);
        }
    }

    handleSubscriptionExpired() {
        this.currentSubscription.status = 'expired';
        this.saveSubscriptionToStorage();
        
        // Disable lending actions
        document.querySelectorAll('.lending-action').forEach(button => {
            button.disabled = true;
        });

        // Show expiry notification
        this.showNotification('Your subscription has expired. Please renew to continue lending.', 'error');
    }

    showExpiryWarning(daysRemaining) {
        this.showNotification(`Your subscription expires in ${daysRemaining} day${daysRemaining === 1 ? '' : 's'}. Renew now to avoid interruption.`, 'warning');
    }

    showNotification(message, type = 'info') {
        // Check if notification system exists
        if (window.showNotification) {
            window.showNotification(message, type);
        } else {
            // Fallback to alert
            alert(`${type.toUpperCase()}: ${message}`);
        }
    }

    setupEventListeners() {
        // Listen for subscription changes from other modules
        document.addEventListener('lendingAttempt', (e) => {
            if (this.currentSubscription && this.currentSubscription.status === 'expired') {
                e.preventDefault();
                this.showNotification('Your subscription has expired. Please renew to lend.', 'error');
            }
        });
    }

    // Public API methods
    getCurrentSubscription() {
        return this.currentSubscription;
    }

    canLend(amount) {
        if (!this.currentSubscription || this.currentSubscription.status !== 'active') {
            return { canLend: false, reason: 'No active subscription' };
        }

        const expiryDate = new Date(this.currentSubscription.expiryDate);
        if (expiryDate < new Date()) {
            return { canLend: false, reason: 'Subscription expired' };
        }

        if (amount > this.currentSubscription.weeklyLimit) {
            return { 
                canLend: false, 
                reason: `Amount exceeds weekly limit of KES ${this.currentSubscription.weeklyLimit.toLocaleString()}` 
            };
        }

        return { canLend: true };
    }

    getRemainingDays() {
        if (!this.currentSubscription) return 0;
        
        const expiryDate = new Date(this.currentSubscription.expiryDate);
        const now = new Date();
        return Math.max(0, Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24)));
    }
}

// Initialize subscription manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.subscriptionManager = new SubscriptionManager();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SubscriptionManager;
}