/**
 * M-PESEWA - Loan Calculator Module
 * Calculates loan amounts, interest, penalties, and repayment schedules
 */

class LoanCalculator {
    constructor() {
        this.defaultSettings = {
            interestRate: 0.10, // 10%
            penaltyRate: 0.05, // 5% daily after due date
            maxLoanTenure: 7, // days
            gracePeriod: 3, // days after due date before penalty
            defaultPeriod: 60, // days before blacklist
            processingFee: 0, // No processing fee for M-PESEWA
            insuranceFee: 0 // No insurance fee
        };

        this.currentSettings = { ...this.defaultSettings };
        this.calculationHistory = [];
        this.init();
    }

    init() {
        this.loadSettings();
        this.setupEventListeners();
        this.renderCalculator();
        this.setupCountryIntegration();
    }

    loadSettings() {
        try {
            const savedSettings = localStorage.getItem('mpesewa_calculator_settings');
            if (savedSettings) {
                this.currentSettings = { ...this.defaultSettings, ...JSON.parse(savedSettings) };
            }
        } catch (error) {
            console.error('Failed to load calculator settings:', error);
        }
    }

    saveSettings() {
        try {
            localStorage.setItem('mpesewa_calculator_settings', JSON.stringify(this.currentSettings));
        } catch (error) {
            console.error('Failed to save calculator settings:', error);
        }
    }

    setupEventListeners() {
        // Calculate button
        document.addEventListener('click', (e) => {
            if (e.target.matches('.calculate-btn') || e.target.closest('.calculate-btn')) {
                e.preventDefault();
                this.calculateLoan();
            }
        });

        // Input changes for auto-calculation
        document.addEventListener('input', (e) => {
            if (e.target.matches('#loanAmount, #loanTenure, #interestRate')) {
                if (e.target.value) {
                    this.calculateLoan();
                }
            }
        });

        // Reset button
        document.addEventListener('click', (e) => {
            if (e.target.matches('.reset-calculator-btn') || e.target.closest('.reset-calculator-btn')) {
                e.preventDefault();
                this.resetCalculator();
            }
        });

        // Save calculation
        document.addEventListener('click', (e) => {
            if (e.target.matches('.save-calculation-btn') || e.target.closest('.save-calculation-btn')) {
                e.preventDefault();
                this.saveCalculation();
            }
        });

        // Export calculations
        document.addEventListener('click', (e) => {
            if (e.target.matches('.export-calculations-btn') || e.target.closest('.export-calculations-btn')) {
                e.preventDefault();
                this.exportCalculations();
            }
        });
    }

    setupCountryIntegration() {
        // Listen for country changes to update currency
        document.addEventListener('countryChanged', (e) => {
            if (e.detail && e.detail.currency) {
                this.updateCurrencyDisplay(e.detail.currencySymbol);
                
                // Update country-specific rules if available
                if (e.detail.rules) {
                    this.currentSettings = {
                        ...this.currentSettings,
                        interestRate: e.detail.rules.interestRate,
                        penaltyRate: e.detail.rules.penaltyRate,
                        maxLoanTenure: e.detail.rules.maxLoanTenure
                    };
                    this.updateSettingsDisplay();
                }
            }
        });
    }

    updateCurrencyDisplay(currencySymbol) {
        document.querySelectorAll('.currency-symbol').forEach(element => {
            element.textContent = currencySymbol;
        });
    }

    updateSettingsDisplay() {
        const interestInput = document.getElementById('interestRate');
        if (interestInput) {
            interestInput.value = (this.currentSettings.interestRate * 100).toFixed(1);
        }
        
        const tenureInput = document.getElementById('loanTenure');
        if (tenureInput) {
            tenureInput.max = this.currentSettings.maxLoanTenure;
            tenureInput.value = Math.min(parseInt(tenureInput.value) || 7, this.currentSettings.maxLoanTenure);
        }
    }

    renderCalculator() {
        const calculatorContainer = document.getElementById('loanCalculator');
        if (!calculatorContainer) return;

        calculatorContainer.innerHTML = `
            <div class="calculator-form">
                <div class="calculator-header">
                    <h3>Loan Calculator</h3>
                    <p>Calculate your loan amount, interest, and repayment schedule</p>
                </div>
                
                <div class="calculator-inputs">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="loanAmount">Loan Amount (<span class="currency-symbol">KSh</span>)</label>
                            <div class="input-with-slider">
                                <input type="number" id="loanAmount" class="form-control" 
                                       min="100" max="50000" step="100" value="5000" 
                                       placeholder="Enter amount">
                                <div class="amount-slider">
                                    <input type="range" id="amountSlider" min="100" max="50000" 
                                           step="100" value="5000" class="range-slider">
                                    <div class="range-labels">
                                        <span>100</span>
                                        <span>25,000</span>
                                        <span>50,000</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="loanTenure">Loan Tenure (Days)</label>
                            <div class="input-with-slider">
                                <input type="number" id="loanTenure" class="form-control" 
                                       min="1" max="${this.currentSettings.maxLoanTenure}" 
                                       step="1" value="7" placeholder="Enter days">
                                <div class="tenure-slider">
                                    <input type="range" id="tenureSlider" min="1" 
                                           max="${this.currentSettings.maxLoanTenure}" step="1" 
                                           value="7" class="range-slider">
                                    <div class="range-labels">
                                        <span>1</span>
                                        <span>${Math.floor(this.currentSettings.maxLoanTenure / 2)}</span>
                                        <span>${this.currentSettings.maxLoanTenure}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="interestRate">Interest Rate (%)</label>
                            <div class="input-with-slider">
                                <input type="number" id="interestRate" class="form-control" 
                                       min="0" max="50" step="0.1" 
                                       value="${(this.currentSettings.interestRate * 100).toFixed(1)}" 
                                       placeholder="Enter interest rate">
                                <div class="interest-slider">
                                    <input type="range" id="interestSlider" min="0" max="50" 
                                           step="0.1" value="${(this.currentSettings.interestRate * 100).toFixed(1)}" 
                                           class="range-slider">
                                    <div class="range-labels">
                                        <span>0%</span>
                                        <span>25%</span>
                                        <span>50%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="penaltyRate">Daily Penalty Rate (%)</label>
                            <input type="number" id="penaltyRate" class="form-control" 
                                   value="${(this.currentSettings.penaltyRate * 100).toFixed(1)}" 
                                   readonly disabled>
                            <small class="help-text">Applies ${this.currentSettings.gracePeriod} days after due date</small>
                        </div>
                    </div>
                    
                    <div class="calculator-actions">
                        <button type="button" class="btn primary calculate-btn">
                            📊 Calculate Loan
                        </button>
                        <button type="button" class="btn secondary reset-calculator-btn">
                            🔄 Reset
                        </button>
                    </div>
                </div>
                
                <div class="calculator-result" id="calculationResult" style="display: none;">
                    <div class="result-header">
                        <h4>Calculation Results</h4>
                        <button class="btn small save-calculation-btn">💾 Save</button>
                    </div>
                    
                    <div class="result-summary">
                        <div class="summary-amount" id="totalDueAmount">
                            <span class="currency-symbol">KSh</span> 0
                        </div>
                        <p class="summary-label">Total Amount Due</p>
                    </div>
                    
                    <div class="result-breakdown" id="calculationBreakdown">
                        <!-- Breakdown will be populated here -->
                    </div>
                    
                    <div class="result-schedule" id="repaymentSchedule">
                        <!-- Repayment schedule will be populated here -->
                    </div>
                    
                    <div class="result-warnings" id="calculationWarnings">
                        <!-- Warnings will be populated here -->
                    </div>
                </div>
                
                <div class="calculator-history" id="calculationHistory" style="display: none;">
                    <h5>Recent Calculations</h5>
                    <div class="history-list" id="historyList">
                        <!-- History items will be populated here -->
                    </div>
                    <button class="btn small outline export-calculations-btn">
                        📤 Export All
                    </button>
                </div>
            </div>
        `;

        // Setup slider synchronization
        this.setupSliderSync();
        
        // Load calculation history
        this.loadCalculationHistory();
    }

    setupSliderSync() {
        // Amount slider sync
        const amountInput = document.getElementById('loanAmount');
        const amountSlider = document.getElementById('amountSlider');
        
        if (amountInput && amountSlider) {
            amountInput.addEventListener('input', () => {
                amountSlider.value = amountInput.value;
            });
            
            amountSlider.addEventListener('input', () => {
                amountInput.value = amountSlider.value;
                this.calculateLoan();
            });
        }

        // Tenure slider sync
        const tenureInput = document.getElementById('loanTenure');
        const tenureSlider = document.getElementById('tenureSlider');
        
        if (tenureInput && tenureSlider) {
            tenureInput.addEventListener('input', () => {
                tenureSlider.value = tenureInput.value;
            });
            
            tenureSlider.addEventListener('input', () => {
                tenureInput.value = tenureSlider.value;
                this.calculateLoan();
            });
        }

        // Interest slider sync
        const interestInput = document.getElementById('interestRate');
        const interestSlider = document.getElementById('interestSlider');
        
        if (interestInput && interestSlider) {
            interestInput.addEventListener('input', () => {
                interestSlider.value = interestInput.value;
            });
            
            interestSlider.addEventListener('input', () => {
                interestInput.value = interestSlider.value;
                this.calculateLoan();
            });
        }
    }

    calculateLoan() {
        // Get input values
        const amount = parseFloat(document.getElementById('loanAmount').value) || 0;
        const tenure = parseInt(document.getElementById('loanTenure').value) || 7;
        const interestRate = (parseFloat(document.getElementById('interestRate').value) || 10) / 100;
        
        // Validate inputs
        if (amount <= 0 || tenure <= 0) {
            this.showError('Please enter valid loan amount and tenure');
            return;
        }

        if (tenure > this.currentSettings.maxLoanTenure) {
            this.showError(`Maximum loan tenure is ${this.currentSettings.maxLoanTenure} days`);
            document.getElementById('loanTenure').value = this.currentSettings.maxLoanTenure;
            return;
        }

        // Calculate loan details
        const calculations = this.performCalculations(amount, tenure, interestRate);
        
        // Display results
        this.displayResults(calculations);
        
        // Store in history
        this.addToHistory(calculations);
    }

    performCalculations(principal, tenure, interestRate) {
        const interest = principal * interestRate;
        const totalDue = principal + interest;
        const dueDate = this.calculateDueDate(tenure);
        
        // Calculate penalties for different overdue periods
        const penalty1Day = totalDue * this.currentSettings.penaltyRate;
        const penalty7Days = penalty1Day * 7;
        const penalty30Days = penalty1Day * 30;
        const penalty60Days = penalty1Day * 60; // Default threshold
        
        // Calculate repayment schedule
        const repaymentSchedule = this.calculateRepaymentSchedule(principal, interestRate, tenure);
        
        return {
            principal,
            interestRate,
            interest,
            totalDue,
            tenure,
            dueDate,
            penaltyRate: this.currentSettings.penaltyRate,
            penalty1Day,
            penalty7Days,
            penalty30Days,
            penalty60Days,
            repaymentSchedule,
            timestamp: new Date().toISOString(),
            currencySymbol: document.querySelector('.currency-symbol')?.textContent || 'KSh'
        };
    }

    calculateDueDate(tenure) {
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + tenure);
        return dueDate;
    }

    calculateRepaymentSchedule(principal, interestRate, tenure) {
        const schedule = [];
        const dailyInterest = (principal * interestRate) / tenure;
        const dailyPrincipal = principal / tenure;
        
        for (let day = 1; day <= tenure; day++) {
            const date = new Date();
            date.setDate(date.getDate() + day);
            
            const interestForDay = dailyInterest;
            const principalForDay = dailyPrincipal;
            const totalForDay = interestForDay + principalForDay;
            
            const cumulativeInterest = interestForDay * day;
            const cumulativePrincipal = principalForDay * day;
            const cumulativeTotal = cumulativeInterest + cumulativePrincipal;
            const remainingBalance = principal + (principal * interestRate) - cumulativeTotal;
            
            schedule.push({
                day,
                date: date.toLocaleDateString(),
                principal: principalForDay,
                interest: interestForDay,
                total: totalForDay,
                cumulativeInterest,
                cumulativePrincipal,
                cumulativeTotal,
                remainingBalance
            });
        }
        
        return schedule;
    }

    displayResults(calculations) {
        const resultContainer = document.getElementById('calculationResult');
        const breakdownContainer = document.getElementById('calculationBreakdown');
        const scheduleContainer = document.getElementById('repaymentSchedule');
        const warningsContainer = document.getElementById('calculationWarnings');
        const totalDueElement = document.getElementById('totalDueAmount');
        
        if (!resultContainer || !breakdownContainer) return;
        
        // Show result container
        resultContainer.style.display = 'block';
        
        // Update total due amount
        if (totalDueElement) {
            totalDueElement.innerHTML = `
                <span class="currency-symbol">${calculations.currencySymbol}</span> 
                ${calculations.totalDue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            `;
        }
        
        // Create breakdown HTML
        breakdownContainer.innerHTML = `
            <h5>Breakdown</h5>
            <div class="breakdown-grid">
                <div class="breakdown-item">
                    <div class="breakdown-label">Principal Amount</div>
                    <div class="breakdown-value">${calculations.currencySymbol} ${calculations.principal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                </div>
                <div class="breakdown-item">
                    <div class="breakdown-label">Interest (${(calculations.interestRate * 100).toFixed(1)}%)</div>
                    <div class="breakdown-value">${calculations.currencySymbol} ${calculations.interest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                </div>
                <div class="breakdown-item total">
                    <div class="breakdown-label">Total Due</div>
                    <div class="breakdown-value">${calculations.currencySymbol} ${calculations.totalDue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                </div>
                <div class="breakdown-item">
                    <div class="breakdown-label">Due Date</div>
                    <div class="breakdown-value">${new Date(calculations.dueDate).toLocaleDateString()}</div>
                </div>
            </div>
            
            <div class="penalty-breakdown">
                <h6>Penalty Calculation (After ${this.currentSettings.gracePeriod} days grace period)</h6>
                <div class="penalty-grid">
                    <div class="penalty-item">
                        <div class="penalty-label">1 Day Overdue</div>
                        <div class="penalty-value">${calculations.currencySymbol} ${calculations.penalty1Day.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    </div>
                    <div class="penalty-item">
                        <div class="penalty-label">7 Days Overdue</div>
                        <div class="penalty-value">${calculations.currencySymbol} ${calculations.penalty7Days.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    </div>
                    <div class="penalty-item">
                        <div class="penalty-label">30 Days Overdue</div>
                        <div class="penalty-value">${calculations.currencySymbol} ${calculations.penalty30Days.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    </div>
                    <div class="penalty-item warning">
                        <div class="penalty-label">60 Days Overdue (Default)</div>
                        <div class="penalty-value">${calculations.currencySymbol} ${calculations.penalty60Days.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    </div>
                </div>
            </div>
        `;
        
        // Create repayment schedule
        if (scheduleContainer && calculations.repaymentSchedule.length > 0) {
            const firstFew = calculations.repaymentSchedule.slice(0, 5);
            const hasMore = calculations.repaymentSchedule.length > 5;
            
            let scheduleHTML = `
                <h5>Repayment Schedule (First ${firstFew.length} Days)</h5>
                <div class="schedule-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Day</th>
                                <th>Date</th>
                                <th>Principal</th>
                                <th>Interest</th>
                                <th>Total</th>
                                <th>Balance</th>
                            </tr>
                        </thead>
                        <tbody>
            `;
            
            firstFew.forEach(payment => {
                scheduleHTML += `
                    <tr>
                        <td>${payment.day}</td>
                        <td>${payment.date}</td>
                        <td>${calculations.currencySymbol} ${payment.principal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td>${calculations.currencySymbol} ${payment.interest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td>${calculations.currencySymbol} ${payment.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td>${calculations.currencySymbol} ${payment.remainingBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    </tr>
                `;
            });
            
            scheduleHTML += `
                        </tbody>
                    </table>
                </div>
            `;
            
            if (hasMore) {
                scheduleHTML += `
                    <p class="schedule-note">
                        Showing first 5 days of ${calculations.repaymentSchedule.length}-day schedule. 
                        <button class="btn-text view-full-schedule-btn" onclick="loanCalculator.showFullSchedule()">
                            View Full Schedule
                        </button>
                    </p>
                `;
            }
            
            scheduleContainer.innerHTML = scheduleHTML;
        }
        
        // Show warnings
        if (warningsContainer) {
            let warningsHTML = '<h5>⚠️ Important Notes</h5><ul class="warnings-list">';
            
            warningsHTML += `
                <li>Interest rate of ${(calculations.interestRate * 100).toFixed(1)}% applies for ${calculations.tenure} days</li>
                <li>Daily penalty of ${(calculations.penaltyRate * 100).toFixed(1)}% applies after ${this.currentSettings.gracePeriod}-day grace period</li>
                <li>Default occurs after ${this.currentSettings.defaultPeriod} days of non-payment</li>
                <li>Default leads to platform-wide blacklisting</li>
                <li>Early repayment reduces total interest payable</li>
                <li>All calculations are estimates. Final amounts may vary</li>
            `;
            
            warningsHTML += '</ul>';
            warningsContainer.innerHTML = warningsHTML;
        }
        
        // Scroll to results
        resultContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    showFullSchedule() {
        const latestCalculation = this.calculationHistory[this.calculationHistory.length - 1];
        if (!latestCalculation || !latestCalculation.repaymentSchedule) return;
        
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = 'fullScheduleModal';
        
        let scheduleHTML = '';
        latestCalculation.repaymentSchedule.forEach(payment => {
            scheduleHTML += `
                <tr>
                    <td>${payment.day}</td>
                    <td>${payment.date}</td>
                    <td>${latestCalculation.currencySymbol} ${payment.principal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td>${latestCalculation.currencySymbol} ${payment.interest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td>${latestCalculation.currencySymbol} ${payment.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td>${latestCalculation.currencySymbol} ${payment.remainingBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
            `;
        });
        
        modal.innerHTML = `
            <div class="modal-content wide">
                <div class="modal-header">
                    <h3>Complete Repayment Schedule</h3>
                    <button class="modal-close" onclick="document.getElementById('fullScheduleModal').remove()">×</button>
                </div>
                <div class="modal-body">
                    <div class="schedule-summary">
                        <p><strong>Loan Amount:</strong> ${latestCalculation.currencySymbol} ${latestCalculation.principal.toLocaleString()}</p>
                        <p><strong>Interest Rate:</strong> ${(latestCalculation.interestRate * 100).toFixed(1)}%</p>
                        <p><strong>Total Due:</strong> ${latestCalculation.currencySymbol} ${latestCalculation.totalDue.toLocaleString()}</p>
                    </div>
                    
                    <div class="full-schedule-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Day</th>
                                    <th>Date</th>
                                    <th>Principal</th>
                                    <th>Interest</th>
                                    <th>Total</th>
                                    <th>Balance</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${scheduleHTML}
                            </tbody>
                        </table>
                    </div>
                    
                    <div class="modal-actions">
                        <button class="btn primary" onclick="loanCalculator.exportSchedule()">
                            📤 Export Schedule
                        </button>
                        <button class="btn secondary" onclick="document.getElementById('fullScheduleModal').remove()">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        modal.style.display = 'block';
    }

    exportSchedule() {
        const latestCalculation = this.calculationHistory[this.calculationHistory.length - 1];
        if (!latestCalculation) return;
        
        const headers = ['Day', 'Date', 'Principal', 'Interest', 'Total Payment', 'Remaining Balance'];
        const csvData = latestCalculation.repaymentSchedule.map(payment => [
            payment.day,
            payment.date,
            payment.principal,
            payment.interest,
            payment.total,
            payment.remainingBalance
        ]);
        
        const csvContent = [headers, ...csvData]
            .map(row => row.join(','))
            .join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `loan-repayment-schedule-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        
        window.URL.revokeObjectURL(url);
    }

    showError(message) {
        const resultContainer = document.getElementById('calculationResult');
        if (resultContainer) {
            resultContainer.style.display = 'block';
            resultContainer.innerHTML = `
                <div class="calculator-error">
                    <div class="error-icon">❌</div>
                    <h4>Calculation Error</h4>
                    <p>${message}</p>
                    <button class="btn primary" onclick="loanCalculator.resetCalculator()">
                        Try Again
                    </button>
                </div>
            `;
        } else {
            alert(`Error: ${message}`);
        }
    }

    addToHistory(calculation) {
        // Limit history to 10 items
        this.calculationHistory.unshift(calculation);
        if (this.calculationHistory.length > 10) {
            this.calculationHistory = this.calculationHistory.slice(0, 10);
        }
        
        this.saveCalculationHistory();
        this.renderHistory();
    }

    saveCalculation() {
        const latestCalculation = this.calculationHistory[0];
        if (!latestCalculation) {
            this.showNotification('No calculation to save', 'warning');
            return;
        }
        
        const savedCalculations = JSON.parse(localStorage.getItem('mpesewa_saved_calculations') || '[]');
        savedCalculations.unshift({
            ...latestCalculation,
            savedAt: new Date().toISOString(),
            id: `CALC-${Date.now()}`
        });
        
        // Limit saved calculations to 50
        if (savedCalculations.length > 50) {
            savedCalculations.pop();
        }
        
        localStorage.setItem('mpesewa_saved_calculations', JSON.stringify(savedCalculations));
        this.showNotification('Calculation saved successfully', 'success');
    }

    loadCalculationHistory() {
        try {
            const savedHistory = localStorage.getItem('mpesewa_calculation_history');
            if (savedHistory) {
                this.calculationHistory = JSON.parse(savedHistory);
                this.renderHistory();
            }
        } catch (error) {
            console.error('Failed to load calculation history:', error);
        }
    }

    saveCalculationHistory() {
        try {
            localStorage.setItem('mpesewa_calculation_history', JSON.stringify(this.calculationHistory));
        } catch (error) {
            console.error('Failed to save calculation history:', error);
        }
    }

    renderHistory() {
        const historyContainer = document.getElementById('calculationHistory');
        const historyList = document.getElementById('historyList');
        
        if (!historyContainer || !historyList || this.calculationHistory.length === 0) {
            if (historyContainer) historyContainer.style.display = 'none';
            return;
        }
        
        historyContainer.style.display = 'block';
        historyList.innerHTML = '';
        
        this.calculationHistory.forEach((calc, index) => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            
            historyItem.innerHTML = `
                <div class="history-item-header">
                    <span class="history-index">#${index + 1}</span>
                    <span class="history-time">${new Date(calc.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div class="history-item-details">
                    <div class="history-amount">${calc.currencySymbol} ${calc.principal.toLocaleString()}</div>
                    <div class="history-info">
                        <span>${calc.tenure} days</span>
                        <span>${(calc.interestRate * 100).toFixed(1)}% interest</span>
                    </div>
                </div>
                <div class="history-item-actions">
                    <button class="btn-text recall-btn" data-index="${index}">
                        🔄 Recall
                    </button>
                </div>
            `;
            
            historyList.appendChild(historyItem);
        });
        
        // Add recall functionality
        historyList.querySelectorAll('.recall-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                this.recallCalculation(index);
            });
        });
    }

    recallCalculation(index) {
        if (index >= 0 && index < this.calculationHistory.length) {
            const calc = this.calculationHistory[index];
            
            // Populate form with recalled values
            document.getElementById('loanAmount').value = calc.principal;
            document.getElementById('amountSlider').value = calc.principal;
            document.getElementById('loanTenure').value = calc.tenure;
            document.getElementById('tenureSlider').value = calc.tenure;
            document.getElementById('interestRate').value = (calc.interestRate * 100).toFixed(1);
            document.getElementById('interestSlider').value = (calc.interestRate * 100).toFixed(1);
            
            // Recalculate
            this.calculateLoan();
            
            this.showNotification('Calculation recalled', 'success');
        }
    }

    exportCalculations() {
        if (this.calculationHistory.length === 0) {
            this.showNotification('No calculations to export', 'warning');
            return;
        }
        
        const headers = ['Timestamp', 'Principal', 'Interest Rate', 'Interest', 'Total Due', 'Tenure', 'Due Date'];
        const csvData = this.calculationHistory.map(calc => [
            new Date(calc.timestamp).toLocaleString(),
            calc.principal,
            `${(calc.interestRate * 100).toFixed(1)}%`,
            calc.interest,
            calc.totalDue,
            `${calc.tenure} days`,
            new Date(calc.dueDate).toLocaleDateString()
        ]);
        
        const csvContent = [headers, ...csvData]
            .map(row => row.join(','))
            .join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `loan-calculations-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        
        window.URL.revokeObjectURL(url);
        this.showNotification('Calculations exported successfully', 'success');
    }

    resetCalculator() {
        document.getElementById('loanAmount').value = 5000;
        document.getElementById('amountSlider').value = 5000;
        document.getElementById('loanTenure').value = 7;
        document.getElementById('tenureSlider').value = 7;
        document.getElementById('interestRate').value = (this.currentSettings.interestRate * 100).toFixed(1);
        document.getElementById('interestSlider').value = (this.currentSettings.interestRate * 100).toFixed(1);
        
        const resultContainer = document.getElementById('calculationResult');
        if (resultContainer) {
            resultContainer.style.display = 'none';
        }
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

    // Public API methods
    calculateLoanAmount(principal, tenure, interestRate = this.currentSettings.interestRate) {
        const interest = principal * interestRate;
        const totalDue = principal + interest;
        const dueDate = this.calculateDueDate(tenure);
        
        return {
            principal,
            interest,
            totalDue,
            tenure,
            dueDate,
            dailyPenalty: totalDue * this.currentSettings.penaltyRate
        };
    }

    calculatePenalty(totalDue, overdueDays) {
        if (overdueDays <= this.currentSettings.gracePeriod) {
            return 0;
        }
        
        const penaltyDays = overdueDays - this.currentSettings.gracePeriod;
        const dailyPenalty = totalDue * this.currentSettings.penaltyRate;
        
        return dailyPenalty * penaltyDays;
    }

    isInDefault(overdueDays) {
        return overdueDays > this.currentSettings.defaultPeriod;
    }

    getDefaultSettings() {
        return { ...this.defaultSettings };
    }

    updateSettings(newSettings) {
        this.currentSettings = { ...this.currentSettings, ...newSettings };
        this.saveSettings();
        this.updateSettingsDisplay();
        this.showNotification('Calculator settings updated', 'success');
    }
}

// Initialize loan calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.loanCalculator = new LoanCalculator();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LoanCalculator;
}