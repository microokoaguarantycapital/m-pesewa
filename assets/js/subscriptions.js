'use strict';

// Subscription system for M-Pesewa
class SubscriptionSystem {
    constructor() {
        this.subscriptions = [];
        this.tiers = [];
        this.currentUserSubscription = null;
        this.init();
    }

    async init() {
        await this.loadTiers();
        await this.loadSubscriptions();
        this.renderTiers();
        this.setupEventListeners();
        this.updateUserSubscription();
    }

    async loadTiers() {
        try {
            const response = await fetch('../data/subscriptions.json');
            this.tiers = await response.json();
        } catch (error) {
            console.error('Failed to load subscription tiers:', error);
            this.tiers = this.getDefaultTiers();
        }
    }

    getDefaultTiers() {
        return [
            {
                id: 'basic',
                name: 'Basic',
                description: 'For starting lenders',
                weeklyLimit: 1500,
                limits: {
                    perLoan: 1500,
                    perWeek: 1500,
                    perMonth: 6000
                },
                pricing: {
                    monthly: 50,
                    biAnnual: 250,
                    annual: 500
                },
                features: [
                    'Up to KSh 1,500 per loan',
                    'Basic lender dashboard',
                    'Email support',
                    'No CRB check required'
                ],
                color: 'primary',
                icon: '💰',
                crbRequired: false,
                borrowerSubscription: false
            },
            {
                id: 'premium',
                name: 'Premium',
                description: 'For growing lenders',
                weeklyLimit: 5000,
                limits: {
                    perLoan: 10000,
                    perWeek: 5000,
                    perMonth: 20000
                },
                pricing: {
                    monthly: 250,
                    biAnnual: 1500,
                    annual: 2500
                },
                features: [
                    'Up to KSh 5,000 per week',
                    'Advanced analytics',
                    'Priority support',
                    'Group management tools',
                    'No CRB check required'
                ],
                color: 'success',
                icon: '💎',
                crbRequired: false,
                borrowerSubscription: true
            },
            {
                id: 'super',
                name: 'Super',
                description: 'For professional lenders',
                weeklyLimit: 20000,
                limits: {
                    perLoan: 20000,
                    perWeek: 20000,
                    perMonth: 80000
                },
                pricing: {
                    monthly: 1000,
                    biAnnual: 5000,
                    annual: 8500
                },
                features: [
                    'Up to KSh 20,000 per week',
                    'CRB check included',
                    'Dedicated account manager',
                    'Advanced risk assessment',
                    'Custom reporting'
                ],
                color: 'warning',
                icon: '🚀',
                crbRequired: true,
                borrowerSubscription: true
            },
            {
                id: 'lender-of-lenders',
                name: 'Lender of Lenders',
                description: 'For institutional lenders',
                weeklyLimit: 50000,
                limits: {
                    perLoan: 50000,
                    perWeek: 50000,
                    perMonth: 200000
                },
                pricing: {
                    monthly: 3500,
                    biAnnual: 6500,
                    annual: 8500
                },
                features: [
                    'Up to KSh 50,000 per week',
                    'Lend to other lenders',
                    'Custom interest rates',
                    'Monthly repayment terms',
                    'Enterprise features'
                ],
                color: 'danger',
                icon: '🏦',
                crbRequired: true,
                borrowerSubscription: true,
                isLenderOfLenders: true
            }
        ];
    }

    async loadSubscriptions() {
        try {
            const response = await fetch('../data/demo-users.json');
            const users = await response.json();
            this.subscriptions = users
                .filter(user => user.role === 'lender' && user.subscription)
                .map(user => user.subscription);
        } catch (error) {
            console.error('Failed to load subscriptions:', error);
            this.subscriptions = this.generateDemoSubscriptions();
        }
    }

    generateDemoSubscriptions() {
        const today = new Date();
        const subscriptions = [];
        
        for (let i = 0; i < 50; i++) {
            const tier = this.tiers[Math.floor(Math.random() * this.tiers.length)];
            const startDate = new Date();
            startDate.setMonth(startDate.getMonth() - Math.floor(Math.random() * 12));
            
            const expiryDate = new Date(startDate);
            const period = ['monthly', 'biAnnual', 'annual'][Math.floor(Math.random() * 3)];
            
            switch (period) {
                case 'monthly':
                    expiryDate.setMonth(expiryDate.getMonth() + 1);
                    break;
                case 'biAnnual':
                    expiryDate.setMonth(expiryDate.getMonth() + 6);
                    break;
                case 'annual':
                    expiryDate.setFullYear(expiryDate.getFullYear() + 1);
                    break;
            }
            
            // Set expiry to 28th of the month
            expiryDate.setDate(28);
            
            subscriptions.push({
                id: `SUB${1000 + i}`,
                userId: `L${100 + i}`,
                userName: `Lender ${i + 1}`,
                tier: tier.id,
                tierName: tier.name,
                period: period,
                amount: tier.pricing[period],
                startDate: startDate.toISOString().split('T')[0],
                expiryDate: expiryDate.toISOString().split('T')[0],
                status: expiryDate > today ? 'active' : 'expired',
                autoRenew: Math.random() > 0.5,
                paymentMethod: 'M-Pesa',
                transactionId: `MP${Date.now()}${i}`
            });
        }
        
        return subscriptions;
    }

    renderTiers() {
        const container = document.getElementById('subscription-tiers');
        if (!container) return;

        let html = '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">';
        
        this.tiers.forEach(tier => {
            const savings = this.calculateSavings(tier);
            
            html += `
                <div class="card subscription-tier ${this.currentUserSubscription?.tier === tier.id ? 'border-primary border-2' : ''}" data-tier="${tier.id}">
                    <div class="card-header">
                        <div class="flex items-center gap-3">
                            <div class="text-2xl">${tier.icon}</div>
                            <div>
                                <h3 class="card-title">${tier.name}</h3>
                                <p class="card-subtitle">${tier.description}</p>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="text-center mb-6">
                            <div class="text-4xl font-bold text-${tier.color} mb-2">KSh ${tier.weeklyLimit.toLocaleString()}</div>
                            <div class="text-sm text-muted">Maximum per week</div>
                        </div>
                        
                        <ul class="space-y-2 mb-6">
                            ${tier.features.map(feature => `
                                <li class="flex items-center gap-2">
                                    <span class="text-success">✓</span>
                                    <span>${feature}</span>
                                </li>
                            `).join('')}
                        </ul>
                        
                        <div class="bg-light rounded-lg p-4 mb-4">
                            <h4 class="font-semibold mb-2">Pricing</h4>
                            <div class="space-y-1">
                                <div class="flex justify-between">
                                    <span>Monthly:</span>
                                    <span class="font-semibold">KSh ${tier.pricing.monthly}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span>Bi-Annual:</span>
                                    <span class="font-semibold">KSh ${tier.pricing.biAnnual}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span>Annual:</span>
                                    <span class="font-semibold">KSh ${tier.pricing.annual}</span>
                                </div>
                            </div>
                            ${savings > 0 ? `
                                <div class="mt-2 text-sm text-success">
                                    Save ${savings}% with annual plan
                                </div>
                            ` : ''}
                        </div>
                    </div>
                    <div class="card-footer">
                        ${this.getSubscriptionButton(tier)}
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        container.innerHTML = html;
    }

    calculateSavings(tier) {
        const monthlyCost = tier.pricing.monthly * 12;
        const annualCost = tier.pricing.annual;
        if (monthlyCost > annualCost) {
            return Math.round(((monthlyCost - annualCost) / monthlyCost) * 100);
        }
        return 0;
    }

    getSubscriptionButton(tier) {
        const userRole = localStorage.getItem('userRole');
        
        if (userRole === 'lender') {
            if (this.currentUserSubscription?.tier === tier.id) {
                return `
                    <button class="btn btn-primary w-full" disabled>
                        Current Plan
                    </button>
                `;
            }
            
            return `
                <button class="btn btn-outline w-full" onclick="subscriptionSystem.selectTier('${tier.id}')">
                    Select Plan
                </button>
            `;
        }
        
        return `
            <button class="btn btn-outline w-full" onclick="subscriptionSystem.promptRegistration('${tier.id}')">
                Become a Lender
            </button>
        `;
    }

    selectTier(tierId) {
        const tier = this.tiers.find(t => t.id === tierId);
        if (!tier) return;

        this.showPaymentModal(tier);
    }

    showPaymentModal(tier) {
        const modalHtml = `
            <div class="modal-overlay" id="subscription-modal">
                <div class="modal-dialog">
                    <div class="modal-header">
                        <h3 class="modal-title">Subscribe to ${tier.name}</h3>
                        <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-6">
                            <div class="text-center">
                                <div class="text-3xl font-bold mb-2">${tier.icon}</div>
                                <h4 class="text-xl font-semibold">${tier.name} Tier</h4>
                                <p class="text-muted">${tier.description}</p>
                            </div>
                        </div>
                        
                        <div class="mb-6">
                            <h4 class="font-semibold mb-3">Select Billing Period</h4>
                            <div class="grid grid-cols-3 gap-3" id="period-options">
                                <label class="period-option">
                                    <input type="radio" name="period" value="monthly" class="hidden" checked>
                                    <div class="period-label text-center cursor-pointer">
                                        <div class="period-price">KSh ${tier.pricing.monthly}</div>
                                        <div class="period-name">Monthly</div>
                                        <div class="period-savings"></div>
                                    </div>
                                </label>
                                <label class="period-option">
                                    <input type="radio" name="period" value="biAnnual" class="hidden">
                                    <div class="period-label text-center cursor-pointer">
                                        <div class="period-price">KSh ${tier.pricing.biAnnual}</div>
                                        <div class="period-name">Bi-Annual</div>
                                        <div class="period-savings">Save ${Math.round((tier.pricing.monthly * 6 - tier.pricing.biAnnual) / (tier.pricing.monthly * 6) * 100)}%</div>
                                    </div>
                                </label>
                                <label class="period-option">
                                    <input type="radio" name="period" value="annual" class="hidden">
                                    <div class="period-label text-center cursor-pointer">
                                        <div class="period-price">KSh ${tier.pricing.annual}</div>
                                        <div class="period-name">Annual</div>
                                        <div class="period-savings">Save ${this.calculateSavings(tier)}%</div>
                                    </div>
                                </label>
                            </div>
                        </div>
                        
                        <div class="mb-6">
                            <h4 class="font-semibold mb-3">Features Included</h4>
                            <ul class="space-y-2">
                                ${tier.features.slice(0, 3).map(feature => `
                                    <li class="flex items-center gap-2">
                                        <span class="text-success">✓</span>
                                        <span>${feature}</span>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                        
                        <div class="alert alert-info">
                            <div class="alert-icon">ℹ️</div>
                            <div class="alert-content">
                                <div class="alert-title">Important</div>
                                <p>Subscription expires on the 28th of each month. You will receive reminders before expiry.</p>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-outline" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
                        <button class="btn btn-primary" onclick="subscriptionSystem.processPayment('${tier.id}')">
                            Pay with M-Pesa
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHtml);
        
        // Add selection styles
        const periodOptions = document.querySelectorAll('.period-option');
        periodOptions.forEach(option => {
            const input = option.querySelector('input');
            const label = option.querySelector('.period-label');
            
            input.addEventListener('change', () => {
                periodOptions.forEach(opt => {
                    opt.querySelector('.period-label').classList.remove('border-primary', 'bg-soft-blue');
                });
                label.classList.add('border-primary', 'bg-soft-blue');
            });
            
            if (input.checked) {
                label.classList.add('border-primary', 'bg-soft-blue');
            }
        });
    }

    processPayment(tierId) {
        const tier = this.tiers.find(t => t.id === tierId);
        if (!tier) return;

        const period = document.querySelector('input[name="period"]:checked').value;
        const amount = tier.pricing[period];
        
        // Simulate M-Pesa payment
        this.simulateMpesaPayment(tier, period, amount);
    }

    simulateMpesaPayment(tier, period, amount) {
        const modal = document.getElementById('subscription-modal');
        if (modal) modal.remove();

        const paymentModal = `
            <div class="modal-overlay" id="payment-modal">
                <div class="modal-dialog">
                    <div class="modal-header">
                        <h3 class="modal-title">M-Pesa Payment</h3>
                    </div>
                    <div class="modal-body">
                        <div class="text-center mb-6">
                            <div class="text-4xl mb-4">📱</div>
                            <h4 class="text-xl font-semibold mb-2">Complete Payment via M-Pesa</h4>
                            <p class="text-muted">Follow these steps to complete your payment</p>
                        </div>
                        
                        <div class="mb-6">
                            <div class="bg-light rounded-lg p-4 mb-4">
                                <div class="text-center">
                                    <div class="text-2xl font-bold mb-2">KSh ${amount}</div>
                                    <div class="text-sm text-muted">${tier.name} - ${period}</div>
                                </div>
                            </div>
                            
                            <div class="space-y-3">
                                <div class="flex items-center gap-3">
                                    <div class="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">1</div>
                                    <div>
                                        <div class="font-semibold">Go to M-Pesa</div>
                                        <div class="text-sm text-muted">Select "Lipa Na M-Pesa"</div>
                                    </div>
                                </div>
                                <div class="flex items-center gap-3">
                                    <div class="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">2</div>
                                    <div>
                                        <div class="font-semibold">Enter Till Number</div>
                                        <div class="text-sm text-muted">Use: <strong>123456</strong></div>
                                    </div>
                                </div>
                                <div class="flex items-center gap-3">
                                    <div class="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">3</div>
                                    <div>
                                        <div class="font-semibold">Enter Amount</div>
                                        <div class="text-sm text-muted">KSh ${amount}</div>
                                    </div>
                                </div>
                                <div class="flex items-center gap-3">
                                    <div class="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">4</div>
                                    <div>
                                        <div class="font-semibold">Enter PIN</div>
                                        <div class="text-sm text-muted">Complete transaction</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="alert alert-warning">
                            <div class="alert-icon">⚠️</div>
                            <div class="alert-content">
                                <div class="alert-title">Payment Confirmation</div>
                                <p>You will receive an SMS confirmation. The system will automatically activate your subscription.</p>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-outline" onclick="subscriptionSystem.cancelPayment()">Cancel</button>
                        <button class="btn btn-success" onclick="subscriptionSystem.confirmPayment('${tier.id}', '${period}', ${amount})">
                            I have completed payment
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', paymentModal);
    }

    cancelPayment() {
        const modal = document.getElementById('payment-modal');
        if (modal) modal.remove();
    }

    confirmPayment(tierId, period, amount) {
        // Simulate successful payment
        const tier = this.tiers.find(t => t.id === tierId);
        const today = new Date();
        const expiryDate = new Date(today);
        
        switch (period) {
            case 'monthly':
                expiryDate.setMonth(expiryDate.getMonth() + 1);
                break;
            case 'biAnnual':
                expiryDate.setMonth(expiryDate.getMonth() + 6);
                break;
            case 'annual':
                expiryDate.setFullYear(expiryDate.getFullYear() + 1);
                break;
        }
        
        // Set expiry to 28th of the month
        expiryDate.setDate(28);
        
        // Update user subscription
        this.currentUserSubscription = {
            tier: tierId,
            tierName: tier.name,
            period: period,
            amount: amount,
            startDate: today.toISOString().split('T')[0],
            expiryDate: expiryDate.toISOString().split('T')[0],
            status: 'active',
            transactionId: `MP${Date.now()}`
        };
        
        // Save to localStorage
        localStorage.setItem('userSubscription', JSON.stringify(this.currentUserSubscription));
        
        // Close modal
        const modal = document.getElementById('payment-modal');
        if (modal) modal.remove();
        
        // Update UI
        this.updateUserSubscription();
        this.renderTiers();
        
        // Show success message
        this.showNotification(`Successfully subscribed to ${tier.name} tier!`, 'success');
        
        // Redirect to lender dashboard
        setTimeout(() => {
            window.location.href = '../pages/dashboard/lender-dashboard.html';
        }, 2000);
    }

    promptRegistration(tierId) {
        if (confirm('To subscribe as a lender, you need to register as a lender first. Would you like to register now?')) {
            localStorage.setItem('selectedTier', tierId);
            window.location.href = '../pages/registration.html?role=lender';
        }
    }

    updateUserSubscription() {
        const userRole = localStorage.getItem('userRole');
        if (userRole !== 'lender') return;

        const savedSubscription = localStorage.getItem('userSubscription');
        if (savedSubscription) {
            this.currentUserSubscription = JSON.parse(savedSubscription);
            this.checkExpiry();
        }
        
        this.renderSubscriptionStatus();
    }

    checkExpiry() {
        if (!this.currentUserSubscription) return;
        
        const today = new Date();
        const expiryDate = new Date(this.currentUserSubscription.expiryDate);
        
        if (expiryDate < today) {
            this.currentUserSubscription.status = 'expired';
            localStorage.setItem('userSubscription', JSON.stringify(this.currentUserSubscription));
            
            // Show expiry warning
            if (this.shouldShowExpiryWarning()) {
                this.showNotification('Your subscription has expired. Please renew to continue lending.', 'danger');
            }
        } else if ((expiryDate - today) / (1000 * 60 * 60 * 24) <= 7) {
            // Show renewal reminder if expiry within 7 days
            this.showNotification(`Your subscription expires in ${Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24))} days.`, 'warning');
        }
    }

    shouldShowExpiryWarning() {
        const lastWarning = localStorage.getItem('lastExpiryWarning');
        if (!lastWarning) return true;
        
        const lastWarningDate = new Date(lastWarning);
        const today = new Date();
        return (today - lastWarningDate) / (1000 * 60 * 60 * 24) >= 1; // Show once per day
    }

    renderSubscriptionStatus() {
        const statusElement = document.getElementById('subscription-status');
        const detailsElement = document.getElementById('subscription-details');
        
        if (!statusElement || !detailsElement || !this.currentUserSubscription) return;
        
        const tier = this.tiers.find(t => t.id === this.currentUserSubscription.tier);
        if (!tier) return;
        
        const expiryDate = new Date(this.currentUserSubscription.expiryDate);
        const today = new Date();
        const daysRemaining = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
        
        statusElement.innerHTML = `
            <div class="subscription-status ${this.currentUserSubscription.status === 'active' ? 'active' : 'expired'}">
                ${this.currentUserSubscription.status === 'active' ? '✓' : '⚠'} 
                ${this.currentUserSubscription.status === 'active' ? 'Active' : 'Expired'} - ${tier.name}
            </div>
        `;
        
        detailsElement.innerHTML = `
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <div class="text-sm text-muted">Current Tier</div>
                    <div class="font-semibold">${tier.name}</div>
                </div>
                <div>
                    <div class="text-sm text-muted">Weekly Limit</div>
                    <div class="font-semibold">KSh ${tier.weeklyLimit.toLocaleString()}</div>
                </div>
                <div>
                    <div class="text-sm text-muted">Billing Period</div>
                    <div class="font-semibold">${this.currentUserSubscription.period}</div>
                </div>
                <div>
                    <div class="text-sm text-muted">Expiry Date</div>
                    <div class="font-semibold ${daysRemaining <= 7 ? 'text-warning' : ''}">
                        ${expiryDate.toLocaleDateString()}
                        ${daysRemaining > 0 ? `(${daysRemaining} days)` : '(Expired)'}
                    </div>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        // Handle subscription management
        document.addEventListener('click', (e) => {
            if (e.target.matches('.upgrade-subscription')) {
                e.preventDefault();
                this.showUpgradeOptions();
            }
            
            if (e.target.matches('.renew-subscription')) {
                e.preventDefault();
                this.renewSubscription();
            }
            
            if (e.target.matches('.cancel-subscription')) {
                e.preventDefault();
                this.cancelSubscription();
            }
        });
    }

    showUpgradeOptions() {
        const availableTiers = this.tiers.filter(tier => {
            if (!this.currentUserSubscription) return true;
            const currentTierIndex = this.tiers.findIndex(t => t.id === this.currentUserSubscription.tier);
            const newTierIndex = this.tiers.findIndex(t => t.id === tier.id);
            return newTierIndex > currentTierIndex;
        });
        
        if (availableTiers.length === 0) {
            this.showNotification('You are already on the highest tier.', 'info');
            return;
        }
        
        // Show upgrade modal
        const modalHtml = `
            <div class="modal-overlay">
                <div class="modal-dialog">
                    <div class="modal-header">
                        <h3 class="modal-title">Upgrade Subscription</h3>
                        <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">&times;</button>
                    </div>
                    <div class="modal-body">
                        <p class="mb-4">Choose a higher tier to unlock more features and higher lending limits:</p>
                        <div class="space-y-3">
                            ${availableTiers.map(tier => `
                                <div class="border rounded-lg p-4">
                                    <div class="flex justify-between items-center">
                                        <div>
                                            <h4 class="font-semibold">${tier.name}</h4>
                                            <p class="text-sm text-muted">Up to KSh ${tier.weeklyLimit.toLocaleString()}/week</p>
                                        </div>
                                        <button class="btn btn-primary btn-sm" onclick="subscriptionSystem.selectTier('${tier.id}'); this.closest('.modal-overlay').remove()">
                                            Upgrade
                                        </button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }

    renewSubscription() {
        if (!this.currentUserSubscription) return;
        
        const tier = this.tiers.find(t => t.id === this.currentUserSubscription.tier);
        if (!tier) return;
        
        this.showPaymentModal(tier);
    }

    cancelSubscription() {
        if (confirm('Are you sure you want to cancel your subscription? You will lose access to lender features.')) {
            this.currentUserSubscription.status = 'cancelled';
            localStorage.setItem('userSubscription', JSON.stringify(this.currentUserSubscription));
            this.updateUserSubscription();
            this.showNotification('Subscription cancelled successfully.', 'success');
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-header">
                <span class="notification-title">${type.charAt(0).toUpperCase() + type.slice(1)}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
            </div>
            <div class="notification-content">${message}</div>
        `;
        
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 5000);
    }

    // Method to check if lender can lend based on subscription
    canLend(amount) {
        if (!this.currentUserSubscription || this.currentUserSubscription.status !== 'active') {
            return { canLend: false, reason: 'No active subscription' };
        }
        
        const tier = this.tiers.find(t => t.id === this.currentUserSubscription.tier);
        if (!tier) {
            return { canLend: false, reason: 'Invalid subscription tier' };
        }
        
        if (amount > tier.limits.perLoan) {
            return { 
                canLend: false, 
                reason: `Amount exceeds per-loan limit of KSh ${tier.limits.perLoan}` 
            };
        }
        
        // Check weekly limit (simplified - in real app would track weekly totals)
        return { canLend: true };
    }

    // Method to get subscription info for display
    getSubscriptionInfo() {
        return this.currentUserSubscription;
    }

    // Method to get tier by ID
    getTier(tierId) {
        return this.tiers.find(t => t.id === tierId);
    }
}

// Initialize subscription system
const subscriptionSystem = new SubscriptionSystem();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = subscriptionSystem;
}