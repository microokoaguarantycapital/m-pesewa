// Loan Calculator for M-Pesewa

class LoanCalculator {
    constructor() {
        this.interestRate = 10; // 10% per week
        this.penaltyRate = 5; // 5% daily after 7 days
        this.maxDuration = 7; // 7 days maximum
        this.minAmount = 5; // Minimum loan amount
        this.tierLimits = {
            'basic': 1500,
            'premium': 5000,
            'super': 20000,
            'lender-of-lenders': 50000
        };
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadCalculatorOnPages();
    }

    setupEventListeners() {
        // Amount input change
        document.addEventListener('input', (e) => {
            if (e.target.matches('.loan-amount-input')) {
                this.updateCalculation();
            }
        });

        // Tier selection change
        document.addEventListener('change', (e) => {
            if (e.target.matches('.tier-select')) {
                this.updateTierLimits();
                this.updateCalculation();
            }
        });

        // Duration change
        document.addEventListener('change', (e) => {
            if (e.target.matches('.loan-duration-input')) {
                this.updateCalculation();
            }
        });
    }

    loadCalculatorOnPages() {
        // Check if calculator container exists on page
        const calculatorContainer = document.getElementById('loanCalculator');
        if (calculatorContainer) {
            this.renderCalculator();
        }

        // Check for embedded calculators
        const embeddedCalculators = document.querySelectorAll('.embedded-calculator');
        embeddedCalculators.forEach(container => {
            this.renderEmbeddedCalculator(container);
        });
    }

    renderCalculator() {
        const container = document.getElementById('loanCalculator');
        if (!container) return;

        container.innerHTML = `
            <div class="calculator-card">
                <div class="calculator-header">
                    <h3>Loan Calculator</h3>
                    <p>Calculate your loan repayment details</p>
                </div>
                
                <div class="calculator-body">
                    <div class="form-group">
                        <label for="calcAmount">Loan Amount</label>
                        <div class="input-group">
                            <span class="input-group-text currency-symbol">KSh</span>
                            <input type="number" 
                                   id="calcAmount" 
                                   class="form-control loan-amount-input" 
                                   min="5" 
                                   max="50000" 
                                   value="1000"
                                   step="100">
                        </div>
                        <div class="amount-slider">
                            <input type="range" 
                                   id="calcAmountSlider" 
                                   min="5" 
                                   max="50000" 
                                   value="1000" 
                                   step="100"
                                   class="form-range">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="calcTier">Subscription Tier</label>
                        <select id="calcTier" class="form-control tier-select">
                            <option value="basic">Basic (≤ 1,500/week)</option>
                            <option value="premium">Premium (≤ 5,000/week)</option>
                            <option value="super">Super (≤ 20,000/week)</option>
                            <option value="lender-of-lenders">Lender of Lenders (≤ 50,000)</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="calcDuration">Loan Duration (Days)</label>
                        <select id="calcDuration" class="form-control loan-duration-input">
                            ${Array.from({length: 7}, (_, i) => i + 1)
                                .map(days => `<option value="${days}" ${days === 7 ? 'selected' : ''}>${days} day${days > 1 ? 's' : ''}</option>`)
                                .join('')}
                        </select>
                    </div>
                    
                    <div class="calculation-results">
                        <div class="result-row">
                            <span>Principal Amount:</span>
                            <span id="resultPrincipal" class="result-value">KSh 1,000.00</span>
                        </div>
                        <div class="result-row">
                            <span>Interest (10%):</span>
                            <span id="resultInterest" class="result-value">KSh 100.00</span>
                        </div>
                        <div class="result-row total">
                            <span>Total Repayment:</span>
                            <span id="resultTotal" class="result-value">KSh 1,100.00</span>
                        </div>
                        <div class="result-row">
                            <span>Daily Repayment:</span>
                            <span id="resultDaily" class="result-value">KSh 157.14</span>
                        </div>
                        <div class="result-row">
                            <span>Due Date:</span>
                            <span id="resultDueDate" class="result-value">${this.getDueDate(7)}</span>
                        </div>
                    </div>
                    
                    <div class="penalty-warning">
                        <small>⚠️ After 7 days: 5% daily penalty on outstanding balance</small>
                    </div>
                </div>
                
                <div class="calculator-footer">
                    <button class="btn btn-primary btn-block" id="applyLoanBtn">Apply for Loan</button>
                </div>
            </div>
        `;

        // Sync slider with input
        const amountInput = document.getElementById('calcAmount');
        const amountSlider = document.getElementById('calcAmountSlider');
        
        amountInput.addEventListener('input', () => {
            amountSlider.value = amountInput.value;
            this.updateCalculation();
        });
        
        amountSlider.addEventListener('input', () => {
            amountInput.value = amountSlider.value;
            this.updateCalculation();
        });

        // Apply button
        const applyBtn = document.getElementById('applyLoanBtn');
        if (applyBtn) {
            applyBtn.addEventListener('click', () => this.applyForLoan());
        }

        // Initial calculation
        this.updateCalculation();
    }

    renderEmbeddedCalculator(container) {
        const amount = container.dataset.amount || 1000;
        const tier = container.dataset.tier || 'basic';
        const duration = container.dataset.duration || 7;

        container.innerHTML = `
            <div class="embedded-calculator-content">
                <h4>Quick Calculation</h4>
                <div class="embedded-results">
                    <div class="result-item">
                        <span>Amount:</span>
                        <span class="amount">KSh ${this.formatNumber(amount)}</span>
                    </div>
                    <div class="result-item">
                        <span>Interest:</span>
                        <span class="interest">KSh ${this.calculateInterest(amount)}</span>
                    </div>
                    <div class="result-item total">
                        <span>Total:</span>
                        <span class="total">KSh ${this.calculateTotal(amount)}</span>
                    </div>
                </div>
            </div>
        `;
    }

    updateCalculation() {
        const amount = parseFloat(document.getElementById('calcAmount')?.value) || 0;
        const tier = document.getElementById('calcTier')?.value || 'basic';
        const duration = parseInt(document.getElementById('calcDuration')?.value) || 7;

        // Validate amount against tier limit
        const tierLimit = this.tierLimits[tier] || 1500;
        if (amount > tierLimit) {
            this.showError(`Amount exceeds ${tier} tier limit of ${this.formatCurrency(tierLimit)}`);
            return;
        }

        // Calculate results
        const interest = this.calculateInterest(amount);
        const total = amount + interest;
        const daily = total / Math.max(duration, 1);

        // Update display
        this.updateResult('resultPrincipal', amount);
        this.updateResult('resultInterest', interest);
        this.updateResult('resultTotal', total);
        this.updateResult('resultDaily', daily);
        
        // Update due date
        const dueDate = this.getDueDate(duration);
        const dueDateElement = document.getElementById('resultDueDate');
        if (dueDateElement) {
            dueDateElement.textContent = dueDate;
        }
    }

    updateTierLimits() {
        const tier = document.getElementById('calcTier')?.value || 'basic';
        const tierLimit = this.tierLimits[tier] || 1500;
        
        const amountInput = document.getElementById('calcAmount');
        const amountSlider = document.getElementById('calcAmountSlider');
        
        if (amountInput) {
            amountInput.max = tierLimit;
            if (parseFloat(amountInput.value) > tierLimit) {
                amountInput.value = tierLimit;
            }
        }
        
        if (amountSlider) {
            amountSlider.max = tierLimit;
            if (parseFloat(amountSlider.value) > tierLimit) {
                amountSlider.value = tierLimit;
            }
        }
    }

    calculateInterest(amount, rate = this.interestRate) {
        return (amount * rate) / 100;
    }

    calculateTotal(amount, rate = this.interestRate) {
        return amount + this.calculateInterest(amount, rate);
    }

    calculatePenalty(amount, overdueDays, rate = this.penaltyRate) {
        const dailyPenalty = (amount * rate) / 100;
        return dailyPenalty * overdueDays;
    }

    calculateDailyRepayment(amount, days = 7, rate = this.interestRate) {
        const total = this.calculateTotal(amount, rate);
        return total / Math.max(days, 1);
    }

    getDueDate(days) {
        const date = new Date();
        date.setDate(date.getDate() + days);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }

    updateResult(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = this.formatCurrency(value);
        }
    }

    formatCurrency(amount) {
        return `KSh ${this.formatNumber(amount.toFixed(2))}`;
    }

    formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    showError(message) {
        // Show error using app's toast system or alert
        if (window.app && window.app.showToast) {
            window.app.showToast(message, 'danger');
        } else {
            alert(message);
        }
    }

    applyForLoan() {
        const amount = parseFloat(document.getElementById('calcAmount')?.value) || 0;
        const tier = document.getElementById('calcTier')?.value || 'basic';
        const duration = parseInt(document.getElementById('calcDuration')?.value) || 7;

        // Check if user is logged in
        if (!window.auth || !window.auth.isLoggedIn()) {
            window.app?.showModal('loginModal');
            return;
        }

        // Check if user is borrower
        if (window.auth.getRole() !== 'borrower') {
            this.showError('Please switch to borrower role to apply for loans');
            return;
        }

        // Check tier limit
        const tierLimit = this.tierLimits[tier];
        if (amount > tierLimit) {
            this.showError(`Amount exceeds ${tier} tier limit of ${this.formatCurrency(tierLimit)}`);
            return;
        }

        // Store loan application data
        const loanData = {
            id: window.utils?.generateId('loan_') || `loan_${Date.now()}`,
            amount: amount,
            tier: tier,
            duration: duration,
            interest: this.calculateInterest(amount),
            total: this.calculateTotal(amount),
            dailyRepayment: this.calculateDailyRepayment(amount, duration),
            appliedAt: new Date().toISOString(),
            status: 'pending'
        };

        // Save to localStorage for demo
        const applications = JSON.parse(localStorage.getItem('mpesewa_loan_applications') || '[]');
        applications.push(loanData);
        localStorage.setItem('mpesewa_loan_applications', JSON.stringify(applications));

        // Show success and redirect
        this.showSuccess('Loan application submitted successfully!');
        setTimeout(() => {
            window.location.href = 'pages/borrowing.html';
        }, 1500);
    }

    showSuccess(message) {
        if (window.app && window.app.showToast) {
            window.app.showToast(message, 'success');
        } else {
            alert(message);
        }
    }

    // API Methods
    getLoanSchedule(amount, duration = 7, startDate = new Date()) {
        const total = this.calculateTotal(amount);
        const daily = total / duration;
        const schedule = [];
        
        for (let i = 1; i <= duration; i++) {
            const date = new Date(startDate);
            date.setDate(date.getDate() + i);
            
            schedule.push({
                day: i,
                date: date.toISOString().split('T')[0],
                amount: daily,
                cumulative: daily * i,
                remaining: total - (daily * i)
            });
        }
        
        return schedule;
    }

    calculateEarlyRepayment(amount, daysRemaining, rate = this.interestRate) {
        // Calculate interest for actual days used
        const dailyInterestRate = rate / (7 * 100); // Daily interest rate
        const interest = amount * dailyInterestRate * (7 - daysRemaining);
        return amount + interest;
    }

    validateLoanApplication(amount, tier, userData) {
        const errors = [];
        
        // Check tier limit
        const tierLimit = this.tierLimits[tier];
        if (amount > tierLimit) {
            errors.push(`Amount exceeds ${tier} tier limit of ${this.formatCurrency(tierLimit)}`);
        }
        
        // Check minimum amount
        if (amount < this.minAmount) {
            errors.push(`Minimum loan amount is ${this.formatCurrency(this.minAmount)}`);
        }
        
        // Check user subscription if lender
        if (userData?.role === 'lender' && userData?.subscription?.tier !== tier) {
            errors.push(`Your subscription tier (${userData.subscription.tier}) doesn't match selected tier (${tier})`);
        }
        
        // Check if user is blacklisted
        if (userData?.blacklisted) {
            errors.push('Your account is blacklisted. Cannot apply for loans.');
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    // Static calculator for quick use
    static quickCalculate(amount, duration = 7) {
        const calculator = new LoanCalculator();
        return {
            principal: amount,
            interest: calculator.calculateInterest(amount),
            total: calculator.calculateTotal(amount),
            daily: calculator.calculateDailyRepayment(amount, duration),
            dueDate: calculator.getDueDate(duration)
        };
    }
}

// Initialize calculator
document.addEventListener('DOMContentLoaded', () => {
    window.calculator = new LoanCalculator();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LoanCalculator;
}