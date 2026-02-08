'use strict';

// Loan calculator for M-Pesewa
class LoanCalculator {
    constructor() {
        this.currentCountry = null;
        this.currentTier = null;
        this.categories = [];
        this.init();
    }

    async init() {
        await this.loadCategories();
        this.setupEventListeners();
        this.initializeCalculator();
        this.setCountryFromUser();
        this.setTierFromUser();
        this.updateCalculator();
    }

    async loadCategories() {
        try {
            const response = await fetch('../data/categories.json');
            this.categories = await response.json();
        } catch (error) {
            console.error('Failed to load categories:', error);
            this.categories = this.getDefaultCategories();
        }
    }

    getDefaultCategories() {
        return [
            {
                id: 'fare',
                name: 'M-pesewa Fare',
                icon: '🚌',
                description: 'Move on, don\'t stall—borrow for your journey.',
                minAmount: 50,
                maxAmount: 50000,
                defaultAmount: 1000
            },
            {
                id: 'data',
                name: 'M-pesewa Data',
                icon: '📱',
                description: 'Stay connected, stay informed—borrow when your bundle runs out.',
                minAmount: 100,
                maxAmount: 5000,
                defaultAmount: 500
            },
            {
                id: 'cooking-gas',
                name: 'M-pesewa Cooking Gas',
                icon: '🔥',
                description: 'Cook with confidence—borrow when your gas is low.',
                minAmount: 500,
                maxAmount: 10000,
                defaultAmount: 2000
            },
            {
                id: 'food',
                name: 'M-pesewa Food',
                icon: '🍲',
                description: 'Don\'t sleep hungry when paycheck is delayed—borrow and eat today.',
                minAmount: 200,
                maxAmount: 10000,
                defaultAmount: 1000
            },
            {
                id: 'credo',
                name: 'M-pesewa Credo',
                icon: '🛠️',
                description: 'Fix it fast—borrow for urgent repairs or tools.',
                minAmount: 500,
                maxAmount: 50000,
                defaultAmount: 5000
            },
            {
                id: 'water-bill',
                name: 'M-pesewa Water Bill',
                icon: '💧',
                description: 'Stay hydrated—borrow for water needs or bills.',
                minAmount: 300,
                maxAmount: 20000,
                defaultAmount: 1500
            },
            {
                id: 'fuel',
                name: 'M-pesewa Bike Car Tuktuk Fuel',
                icon: '⛽',
                description: 'Keep moving—borrow for fuel, no matter your ride.',
                minAmount: 200,
                maxAmount: 10000,
                defaultAmount: 1000
            },
            {
                id: 'repair',
                name: 'M-pesewa Bike Car Tuktuk Repair',
                icon: '🔧',
                description: 'Fix it quick—borrow for minor repairs and keep going.',
                minAmount: 500,
                maxAmount: 50000,
                defaultAmount: 5000
            },
            {
                id: 'medicine',
                name: 'M-pesewa Medicine',
                icon: '💊',
                description: 'Health first—borrow for urgent medicines.',
                minAmount: 300,
                maxAmount: 20000,
                defaultAmount: 2000
            },
            {
                id: 'electricity',
                name: 'M-pesewa Electricity Tokens',
                icon: '💡',
                description: 'Stay lit, stay powered—borrow tokens when you need it.',
                minAmount: 100,
                maxAmount: 10000,
                defaultAmount: 1000
            },
            {
                id: 'school-fees',
                name: 'M-pesewa School Fees',
                icon: '🎓',
                description: 'Education comes first—borrow for school fees.',
                minAmount: 1000,
                maxAmount: 100000,
                defaultAmount: 5000
            },
            {
                id: 'tv-subscription',
                name: 'M-pesewa TV Subscription',
                icon: '📺',
                description: 'Stay informed and entertained—borrow for TV subscriptions.',
                minAmount: 200,
                maxAmount: 10000,
                defaultAmount: 1000
            },
            {
                id: 'wifi',
                name: 'M-pesewa Wifi',
                icon: '🌐',
                description: 'Stay connected with high-speed internet.',
                minAmount: 500,
                maxAmount: 15000,
                defaultAmount: 3000
            },
            {
                id: 'advance',
                name: 'M-pesewa Advance',
                icon: '💸',
                description: 'Bridge the gap until your next paycheck.',
                minAmount: 1000,
                maxAmount: 50000,
                defaultAmount: 5000
            },
            {
                id: 'daily-sales',
                name: 'M-Pesa Daily Sales Advance',
                icon: '💰',
                description: 'Small loan advance for everyday business.',
                minAmount: 500,
                maxAmount: 20000,
                defaultAmount: 3000
            },
            {
                id: 'working-capital',
                name: 'M-Pesa Working Capital Advance',
                icon: '🏦',
                description: 'Working capital when your business needs it.',
                minAmount: 5000,
                maxAmount: 100000,
                defaultAmount: 20000
            }
        ];
    }

    setCountryFromUser() {
        // Get country from URL, localStorage, or use default
        const urlParams = new URLSearchParams(window.location.search);
        let countryCode = urlParams.get('country');
        
        if (!countryCode) {
            countryCode = localStorage.getItem('userCountry') || 'KE';
        }
        
        // In a real app, we would fetch country data
        // For now, use a simple mapping
        const countries = {
            'KE': { code: 'KE', currency: 'KSh', name: 'Kenya' },
            'UG': { code: 'UG', currency: 'UGX', name: 'Uganda' },
            'TZ': { code: 'TZ', currency: 'TZS', name: 'Tanzania' },
            'RW': { code: 'RW', currency: 'RWF', name: 'Rwanda' },
            'BI': { code: 'BI', currency: 'BIF', name: 'Burundi' },
            'SO': { code: 'SO', currency: 'SOS', name: 'Somalia' },
            'SS': { code: 'SS', currency: 'SSP', name: 'South Sudan' },
            'ET': { code: 'ET', currency: 'ETB', name: 'Ethiopia' },
            'CD': { code: 'CD', currency: 'CDF', name: 'DRC' },
            'NG': { code: 'NG', currency: 'NGN', name: 'Nigeria' },
            'ZA': { code: 'ZA', currency: 'ZAR', name: 'South Africa' },
            'GH': { code: 'GH', currency: 'GHS', name: 'Ghana' }
        };
        
        this.currentCountry = countries[countryCode] || countries['KE'];
        
        // Update country selector if exists
        const countrySelect = document.getElementById('calculator-country');
        if (countrySelect) {
            countrySelect.value = this.currentCountry.code;
        }
    }

    setTierFromUser() {
        // Get tier from user subscription or default to basic
        const userRole = localStorage.getItem('userRole');
        let tier = 'basic';
        
        if (userRole === 'lender') {
            const subscription = localStorage.getItem('userSubscription');
            if (subscription) {
                const subData = JSON.parse(subscription);
                tier = subData.tier || 'basic';
            }
        }
        
        this.currentTier = tier;
        
        // Update tier selector if exists
        const tierSelect = document.getElementById('calculator-tier');
        if (tierSelect) {
            tierSelect.value = this.currentTier;
        }
    }

    initializeCalculator() {
        // Populate category selector
        const categorySelect = document.getElementById('calculator-category');
        if (categorySelect) {
            let html = '<option value="">Select Loan Category</option>';
            
            this.categories.forEach(category => {
                html += `<option value="${category.id}">${category.icon} ${category.name}</option>`;
            });
            
            categorySelect.innerHTML = html;
            
            // Set default category if in URL
            const urlParams = new URLSearchParams(window.location.search);
            const categoryId = urlParams.get('category');
            if (categoryId) {
                categorySelect.value = categoryId;
            }
        }
        
        // Set up amount slider
        this.setupAmountSlider();
    }

    setupAmountSlider() {
        const amountSlider = document.getElementById('loan-amount-slider');
        const amountInput = document.getElementById('loan-amount-input');
        const amountDisplay = document.getElementById('loan-amount-display');
        
        if (!amountSlider || !amountInput || !amountDisplay) return;
        
        const updateAmount = (value) => {
            const amount = parseInt(value);
            amountSlider.value = amount;
            amountInput.value = amount;
            amountDisplay.textContent = this.formatCurrency(amount);
            this.updateCalculator();
        };
        
        amountSlider.addEventListener('input', (e) => {
            updateAmount(e.target.value);
        });
        
        amountInput.addEventListener('input', (e) => {
            let value = parseInt(e.target.value) || 0;
            const min = parseInt(amountSlider.min);
            const max = parseInt(amountSlider.max);
            
            if (value < min) value = min;
            if (value > max) value = max;
            
            updateAmount(value);
        });
        
        // Set initial values based on selected category
        this.updateAmountRange();
    }

    updateAmountRange() {
        const categorySelect = document.getElementById('calculator-category');
        const amountSlider = document.getElementById('loan-amount-slider');
        const amountInput = document.getElementById('loan-amount-input');
        const minAmountDisplay = document.getElementById('min-amount');
        const maxAmountDisplay = document.getElementById('max-amount');
        
        if (!categorySelect || !amountSlider || !amountInput) return;
        
        const categoryId = categorySelect.value;
        const category = this.categories.find(c => c.id === categoryId);
        
        if (category) {
            amountSlider.min = category.minAmount;
            amountSlider.max = category.maxAmount;
            amountSlider.value = category.defaultAmount;
            
            amountInput.min = category.minAmount;
            amountInput.max = category.maxAmount;
            amountInput.value = category.defaultAmount;
            
            if (minAmountDisplay) {
                minAmountDisplay.textContent = this.formatCurrency(category.minAmount);
            }
            if (maxAmountDisplay) {
                maxAmountDisplay.textContent = this.formatCurrency(category.maxAmount);
            }
        } else {
            // Default ranges
            amountSlider.min = 50;
            amountSlider.max = 50000;
            amountSlider.value = 1000;
            
            amountInput.min = 50;
            amountInput.max = 50000;
            amountInput.value = 1000;
            
            if (minAmountDisplay) minAmountDisplay.textContent = this.formatCurrency(50);
            if (maxAmountDisplay) maxAmountDisplay.textContent = this.formatCurrency(50000);
        }
        
        this.updateCalculator();
    }

    setupEventListeners() {
        // Category change
        const categorySelect = document.getElementById('calculator-category');
        if (categorySelect) {
            categorySelect.addEventListener('change', () => {
                this.updateAmountRange();
            });
        }
        
        // Country change
        const countrySelect = document.getElementById('calculator-country');
        if (countrySelect) {
            countrySelect.addEventListener('change', (e) => {
                this.currentCountry = this.getCountryByCode(e.target.value);
                this.updateCalculator();
            });
        }
        
        // Tier change
        const tierSelect = document.getElementById('calculator-tier');
        if (tierSelect) {
            tierSelect.addEventListener('change', (e) => {
                this.currentTier = e.target.value;
                this.updateCalculator();
            });
        }
        
        // Repayment period change
        const periodSelect = document.getElementById('repayment-period');
        if (periodSelect) {
            periodSelect.addEventListener('change', () => {
                this.updateCalculator();
            });
        }
        
        // Partial payments toggle
        const partialToggle = document.getElementById('partial-payments');
        if (partialToggle) {
            partialToggle.addEventListener('change', () => {
                this.updateCalculator();
            });
        }
        
        // Calculate button
        const calculateBtn = document.getElementById('calculate-loan');
        if (calculateBtn) {
            calculateBtn.addEventListener('click', () => {
                this.updateCalculator();
            });
        }
        
        // Reset button
        const resetBtn = document.getElementById('reset-calculator');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetCalculator();
            });
        }
    }

    updateCalculator() {
        const amount = this.getLoanAmount();
        const period = this.getRepaymentPeriod();
        const allowPartial = this.getPartialPayments();
        
        // Calculate results
        const results = this.calculateLoan(amount, period, allowPartial);
        
        // Update display
        this.updateResultsDisplay(results);
        
        // Update tier limits
        this.updateTierLimits();
        
        // Update category info
        this.updateCategoryInfo();
    }

    getLoanAmount() {
        const amountInput = document.getElementById('loan-amount-input');
        return amountInput ? parseInt(amountInput.value) || 0 : 0;
    }

    getRepaymentPeriod() {
        const periodSelect = document.getElementById('repayment-period');
        return periodSelect ? parseInt(periodSelect.value) || 7 : 7;
    }

    getPartialPayments() {
        const partialToggle = document.getElementById('partial-payments');
        return partialToggle ? partialToggle.checked : false;
    }

    calculateLoan(amount, periodDays, allowPartial) {
        const interestRate = 0.10; // 10% per week
        const penaltyRate = 0.05; // 5% daily after 7 days
        
        // Calculate interest for the period
        const weeks = periodDays / 7;
        const interest = amount * interestRate * weeks;
        
        // Total to repay
        const totalRepayment = amount + interest;
        
        // Daily repayment if partial payments allowed
        const dailyRepayment = allowPartial ? totalRepayment / periodDays : null;
        
        // Penalty calculation (after 7 days)
        const penaltyStartDay = 8;
        let penalty = 0;
        if (periodDays > 7) {
            const penaltyDays = periodDays - 7;
            penalty = amount * penaltyRate * penaltyDays;
        }
        
        // Total with penalty
        const totalWithPenalty = totalRepayment + penalty;
        
        return {
            principal: amount,
            interest: interest,
            totalRepayment: totalRepayment,
            penalty: penalty,
            totalWithPenalty: totalWithPenalty,
            periodDays: periodDays,
            dailyRepayment: dailyRepayment,
            interestRate: interestRate,
            penaltyRate: penaltyRate,
            breakdown: this.getBreakdown(amount, interest, penalty, periodDays)
        };
    }

    getBreakdown(principal, interest, penalty, periodDays) {
        const breakdown = [];
        
        // Principal
        breakdown.push({
            label: 'Loan Amount',
            value: principal,
            type: 'principal'
        });
        
        // Interest
        breakdown.push({
            label: `Interest (10% for ${periodDays} days)`,
            value: interest,
            type: 'interest'
        });
        
        // Penalty if any
        if (penalty > 0) {
            breakdown.push({
                label: 'Late Payment Penalty',
                value: penalty,
                type: 'penalty'
            });
        }
        
        // Total
        breakdown.push({
            label: 'Total Amount to Repay',
            value: principal + interest + penalty,
            type: 'total',
            isTotal: true
        });
        
        return breakdown;
    }

    updateResultsDisplay(results) {
        // Update main results
        const elements = {
            'principal-amount': this.formatCurrency(results.principal),
            'interest-amount': this.formatCurrency(results.interest),
            'total-repayment': this.formatCurrency(results.totalRepayment),
            'penalty-amount': results.penalty > 0 ? this.formatCurrency(results.penalty) : 'None',
            'total-with-penalty': this.formatCurrency(results.totalWithPenalty),
            'repayment-period': `${results.periodDays} days`,
            'daily-repayment': results.dailyRepayment ? this.formatCurrency(results.dailyRepayment) : 'Not applicable',
            'interest-rate': '10% per week',
            'penalty-rate': '5% daily after 7 days'
        };
        
        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        });
        
        // Update breakdown table
        this.updateBreakdownTable(results.breakdown);
        
        // Update repayment schedule
        this.updateRepaymentSchedule(results);
        
        // Update warnings if any
        this.updateWarnings(results);
    }

    updateBreakdownTable(breakdown) {
        const container = document.getElementById('breakdown-table');
        if (!container) return;
        
        let html = `
            <div class="overflow-x-auto">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th class="text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        breakdown.forEach(item => {
            const rowClass = item.isTotal ? 'font-bold border-t' : '';
            html += `
                <tr class="${rowClass}">
                    <td>${item.label}</td>
                    <td class="text-right ${item.type === 'penalty' ? 'text-danger' : item.type === 'interest' ? 'text-warning' : ''}">
                        ${this.formatCurrency(item.value)}
                    </td>
                </tr>
            `;
        });
        
        html += `
                    </tbody>
                </table>
            </div>
        `;
        
        container.innerHTML = html;
    }

    updateRepaymentSchedule(results) {
        const container = document.getElementById('repayment-schedule');
        if (!container) return;
        
        if (!results.dailyRepayment) {
            container.innerHTML = `
                <div class="alert alert-info">
                    <div class="alert-icon">ℹ️</div>
                    <div class="alert-content">
                        <div class="alert-title">Lump Sum Payment</div>
                        <p>Repay the total amount of ${this.formatCurrency(results.totalRepayment)} in ${results.periodDays} days.</p>
                    </div>
                </div>
            `;
            return;
        }
        
        let html = `
            <div class="overflow-x-auto">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Day</th>
                            <th>Amount Due</th>
                            <th>Cumulative</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        let cumulative = 0;
        for (let day = 1; day <= results.periodDays; day++) {
            cumulative += results.dailyRepayment;
            const isPenaltyDay = day > 7;
            
            html += `
                <tr class="${isPenaltyDay ? 'bg-soft-rose' : ''}">
                    <td>Day ${day}${isPenaltyDay ? ' ⚠️' : ''}</td>
                    <td class="font-semibold">${this.formatCurrency(results.dailyRepayment)}</td>
                    <td>${this.formatCurrency(cumulative)}</td>
                    <td>
                        <span class="badge ${isPenaltyDay ? 'badge-warning' : 'badge-success'}">
                            ${isPenaltyDay ? 'With Penalty' : 'Normal'}
                        </span>
                    </td>
                </tr>
            `;
        }
        
        html += `
                </tbody>
            </table>
        </div>
        `;
        
        container.innerHTML = html;
    }

    updateWarnings(results) {
        const container = document.getElementById('calculator-warnings');
        if (!container) return;
        
        const warnings = [];
        
        // Check if amount exceeds tier limit
        const tierLimit = this.getTierLimit();
        if (tierLimit && results.principal > tierLimit) {
            warnings.push({
                type: 'danger',
                message: `Amount exceeds your tier limit of ${this.formatCurrency(tierLimit)}. Consider upgrading your subscription.`
            });
        }
        
        // Check if period exceeds 7 days (penalty warning)
        if (results.periodDays > 7) {
            warnings.push({
                type: 'warning',
                message: `Repayment period exceeds 7 days. A daily penalty of 5% will apply after day 7.`
            });
        }
        
        // Check if amount is below minimum for category
        const category = this.getSelectedCategory();
        if (category && results.principal < category.minAmount) {
            warnings.push({
                type: 'warning',
                message: `Amount is below minimum for ${category.name} (${this.formatCurrency(category.minAmount)}).`
            });
        }
        
        if (warnings.length === 0) {
            container.innerHTML = `
                <div class="alert alert-success">
                    <div class="alert-icon">✓</div>
                    <div class="alert-content">
                        <div class="alert-title">Loan Terms Valid</div>
                        <p>All loan terms are within acceptable limits.</p>
                    </div>
                </div>
            `;
            return;
        }
        
        let html = '';
        warnings.forEach(warning => {
            html += `
                <div class="alert alert-${warning.type}">
                    <div class="alert-icon">${warning.type === 'danger' ? '⚠️' : 'ℹ️'}</div>
                    <div class="alert-content">
                        <div class="alert-title">${warning.type === 'danger' ? 'Warning' : 'Notice'}</div>
                        <p>${warning.message}</p>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
    }

    updateTierLimits() {
        const container = document.getElementById('tier-limits');
        if (!container) return;
        
        const tier = this.currentTier;
        const limits = this.getTierLimits(tier);
        
        if (!limits) {
            container.innerHTML = '';
            return;
        }
        
        const currentAmount = this.getLoanAmount();
        const isWithinLimit = currentAmount <= limits.max;
        
        container.innerHTML = `
            <div class="bg-light rounded-lg p-4">
                <h4 class="font-semibold mb-2">${tier.toUpperCase()} Tier Limits</h4>
                <div class="space-y-2">
                    <div class="flex justify-between">
                        <span class="text-muted">Maximum per loan:</span>
                        <span class="font-semibold">${this.formatCurrency(limits.max)}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-muted">Maximum per week:</span>
                        <span class="font-semibold">${this.formatCurrency(limits.weekly)}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-muted">Your loan amount:</span>
                        <span class="font-semibold ${isWithinLimit ? 'text-success' : 'text-danger'}">
                            ${this.formatCurrency(currentAmount)}
                            ${isWithinLimit ? '✓' : '✗'}
                        </span>
                    </div>
                </div>
            </div>
        `;
    }

    updateCategoryInfo() {
        const container = document.getElementById('category-info');
        if (!container) return;
        
        const category = this.getSelectedCategory();
        if (!category) {
            container.innerHTML = '';
            return;
        }
        
        container.innerHTML = `
            <div class="bg-soft-blue rounded-lg p-4">
                <div class="flex items-center gap-3 mb-3">
                    <div class="text-2xl">${category.icon}</div>
                    <div>
                        <h4 class="font-semibold">${category.name}</h4>
                        <p class="text-sm text-muted">${category.description}</p>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-2">
                    <div>
                        <div class="text-xs text-muted">Minimum</div>
                        <div class="font-semibold">${this.formatCurrency(category.minAmount)}</div>
                    </div>
                    <div>
                        <div class="text-xs text-muted">Maximum</div>
                        <div class="font-semibold">${this.formatCurrency(category.maxAmount)}</div>
                    </div>
                </div>
            </div>
        `;
    }

    getSelectedCategory() {
        const categorySelect = document.getElementById('calculator-category');
        if (!categorySelect) return null;
        
        const categoryId = categorySelect.value;
        return this.categories.find(c => c.id === categoryId);
    }

    getTierLimits(tier) {
        const limits = {
            'basic': { max: 1500, weekly: 1500 },
            'premium': { max: 10000, weekly: 5000 },
            'super': { max: 20000, weekly: 20000 },
            'lender-of-lenders': { max: 50000, weekly: 50000 }
        };
        
        return limits[tier] || limits.basic;
    }

    getTierLimit() {
        const limits = this.getTierLimits(this.currentTier);
        return limits ? limits.max : null;
    }

    getCountryByCode(code) {
        const countries = {
            'KE': { code: 'KE', currency: 'KSh', name: 'Kenya' },
            'UG': { code: 'UG', currency: 'UGX', name: 'Uganda' },
            'TZ': { code: 'TZ', currency: 'TZS', name: 'Tanzania' },
            'RW': { code: 'RW', currency: 'RWF', name: 'Rwanda' },
            'BI': { code: 'BI', currency: 'BIF', name: 'Burundi' },
            'SO': { code: 'SO', currency: 'SOS', name: 'Somalia' },
            'SS': { code: 'SS', currency: 'SSP', name: 'South Sudan' },
            'ET': { code: 'ET', currency: 'ETB', name: 'Ethiopia' },
            'CD': { code: 'CD', currency: 'CDF', name: 'DRC' },
            'NG': { code: 'NG', currency: 'NGN', name: 'Nigeria' },
            'ZA': { code: 'ZA', currency: 'ZAR', name: 'South Africa' },
            'GH': { code: 'GH', currency: 'GHS', name: 'Ghana' }
        };
        
        return countries[code] || countries['KE'];
    }

    formatCurrency(amount) {
        if (!this.currentCountry) {
            return `KSh ${amount.toLocaleString()}`;
        }
        
        // Simple formatting - in a real app, use Intl.NumberFormat
        return `${this.currentCountry.currency} ${amount.toLocaleString()}`;
    }

    resetCalculator() {
        // Reset category
        const categorySelect = document.getElementById('calculator-category');
        if (categorySelect) {
            categorySelect.value = '';
        }
        
        // Reset amount
        const amountInput = document.getElementById('loan-amount-input');
        const amountSlider = document.getElementById('loan-amount-slider');
        if (amountInput && amountSlider) {
            amountInput.value = 1000;
            amountSlider.value = 1000;
        }
        
        // Reset period
        const periodSelect = document.getElementById('repayment-period');
        if (periodSelect) {
            periodSelect.value = 7;
        }
        
        // Reset partial payments
        const partialToggle = document.getElementById('partial-payments');
        if (partialToggle) {
            partialToggle.checked = false;
        }
        
        // Update calculator
        this.updateAmountRange();
        this.updateCalculator();
        
        this.showNotification('Calculator reset to default values.', 'info');
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

    // Method to get calculated loan details for form submission
    getLoanDetails() {
        const amount = this.getLoanAmount();
        const period = this.getRepaymentPeriod();
        const category = this.getSelectedCategory();
        
        if (!category) {
            throw new Error('Please select a loan category');
        }
        
        if (amount <= 0) {
            throw new Error('Please enter a valid loan amount');
        }
        
        const results = this.calculateLoan(amount, period, false);
        
        return {
            amount: amount,
            period: period,
            category: category,
            currency: this.currentCountry.currency,
            interest: results.interest,
            totalRepayment: results.totalRepayment,
            breakdown: results.breakdown
        };
    }
}

// Initialize calculator
const loanCalculator = new LoanCalculator();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = loanCalculator;
}