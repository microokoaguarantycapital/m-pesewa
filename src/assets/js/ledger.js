'use strict';

class LedgerManager {
    constructor() {
        this.ledgers = [];
        this.currentUser = null;
        this.userRole = null;
        this.loadLedgers();
    }

    async loadLedgers() {
        try {
            const userData = JSON.parse(localStorage.getItem('mpesewa_user') || '{}');
            this.currentUser = userData.id;
            this.userRole = userData.role;

            const response = await fetch('../data/demo-ledgers.json');
            this.ledgers = await response.json();
            
            this.filterLedgersByUser();
            this.renderLedgers();
        } catch (error) {
            console.error('Error loading ledgers:', error);
            this.ledgers = [];
        }
    }

    filterLedgersByUser() {
        if (this.userRole === 'admin') {
            return;
        } else if (this.userRole === 'lender') {
            this.ledgers = this.ledgers.filter(ledger => ledger.lender_id === this.currentUser);
        } else if (this.userRole === 'borrower') {
            this.ledgers = this.ledgers.filter(ledger => ledger.borrower_id === this.currentUser);
        }
    }

    renderLedgers() {
        const container = document.getElementById('ledger-container');
        if (!container) return;

        if (this.ledgers.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📒</div>
                    <h3>No Ledgers Found</h3>
                    <p>${this.userRole === 'lender' ? 'You have not issued any loans yet.' : 
                         this.userRole === 'borrower' ? 'You have no active or past loans.' : 
                         'No ledger data available.'}</p>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div class="section-header">
                <h3 class="section-title">Ledgers (${this.ledgers.length})</h3>
                <div class="section-actions">
                    <div class="btn-group">
                        <button class="btn ${this.currentFilter === 'all' ? 'btn-primary' : 'btn-outline'}" data-filter="all">All</button>
                        <button class="btn ${this.currentFilter === 'active' ? 'btn-primary' : 'btn-outline'}" data-filter="active">Active</button>
                        <button class="btn ${this.currentFilter === 'cleared' ? 'btn-primary' : 'btn-outline'}" data-filter="cleared">Cleared</button>
                        <button class="btn ${this.currentFilter === 'overdue' ? 'btn-primary' : 'btn-outline'}" data-filter="overdue">Overdue</button>
                    </div>
                    ${this.userRole === 'lender' ? `
                        <button class="btn btn-primary" id="create-ledger">
                            <i class="fas fa-plus"></i> New Ledger
                        </button>
                    ` : ''}
                </div>
            </div>
            <div class="table-responsive">
                <table class="ledger-table">
                    <thead>
                        <tr>
                            ${this.userRole === 'admin' ? '<th>Lender</th>' : ''}
                            ${this.userRole !== 'borrower' ? '<th>Borrower</th>' : ''}
                            <th>Category</th>
                            <th>Amount</th>
                            <th>Date</th>
                            <th>Due Date</th>
                            <th>Interest</th>
                            <th>Penalty</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="ledger-tbody">
                        ${this.ledgers.map(ledger => this.renderLedgerRow(ledger)).join('')}
                    </tbody>
                </table>
            </div>
        `;

        document.querySelectorAll('[data-filter]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.filterLedgers(e.target.dataset.filter);
            });
        });

        document.getElementById('create-ledger')?.addEventListener('click', () => {
            this.createNewLedger();
        });

        document.querySelectorAll('.ledger-action').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                const ledgerId = e.target.dataset.ledgerId;
                this.handleLedgerAction(action, ledgerId);
            });
        });
    }

    renderLedgerRow(ledger) {
        const isOverdue = this.isOverdue(ledger.due_date);
        const statusClass = ledger.status === 'cleared' ? 'status-cleared' : 
                           isOverdue ? 'status-overdue' : 'status-active';
        
        const interest = this.calculateInterest(ledger.amount, ledger.interest_rate || 10, ledger.loan_date, ledger.due_date);
        const penalty = isOverdue ? this.calculatePenalty(ledger.amount, ledger.due_date) : 0;

        return `
            <tr data-ledger-id="${ledger.id}" class="${statusClass}">
                ${this.userRole === 'admin' ? `<td>${ledger.lender_name || 'Unknown'}</td>` : ''}
                ${this.userRole !== 'borrower' ? `<td>${ledger.borrower_name || 'Unknown'}</td>` : ''}
                <td>${ledger.category || 'General'}</td>
                <td>${this.formatCurrency(ledger.amount)}</td>
                <td>${this.formatDate(ledger.loan_date)}</td>
                <td>${this.formatDate(ledger.due_date)} ${isOverdue ? '<span class="badge badge-danger">Overdue</span>' : ''}</td>
                <td>${this.formatCurrency(interest)}</td>
                <td>${this.formatCurrency(penalty)}</td>
                <td><span class="status-badge">${ledger.status}</span></td>
                <td>
                    <div class="btn-group">
                        <button class="btn btn-sm btn-outline ledger-action" data-action="view" data-ledger-id="${ledger.id}">View</button>
                        ${this.userRole === 'lender' && ledger.status === 'active' ? `
                            <button class="btn btn-sm btn-outline ledger-action" data-action="repay" data-ledger-id="${ledger.id}">Repay</button>
                            <button class="btn btn-sm btn-outline ledger-action" data-action="edit" data-ledger-id="${ledger.id}">Edit</button>
                        ` : ''}
                        ${this.userRole === 'admin' ? `
                            <button class="btn btn-sm btn-outline ledger-action" data-action="override" data-ledger-id="${ledger.id}">Override</button>
                        ` : ''}
                    </div>
                </td>
            </tr>
        `;
    }

    filterLedgers(filter) {
        this.currentFilter = filter;
        let filtered = this.ledgers;

        switch (filter) {
            case 'active':
                filtered = filtered.filter(ledger => ledger.status === 'active' && !this.isOverdue(ledger.due_date));
                break;
            case 'cleared':
                filtered = filtered.filter(ledger => ledger.status === 'cleared');
                break;
            case 'overdue':
                filtered = filtered.filter(ledger => this.isOverdue(ledger.due_date) && ledger.status === 'active');
                break;
        }

        const tbody = document.getElementById('ledger-tbody');
        if (tbody) {
            tbody.innerHTML = filtered.map(ledger => this.renderLedgerRow(ledger)).join('');
            
            document.querySelectorAll('.ledger-action').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const action = e.target.dataset.action;
                    const ledgerId = e.target.dataset.ledgerId;
                    this.handleLedgerAction(action, ledgerId);
                });
            });
        }
    }

    handleLedgerAction(action, ledgerId) {
        const ledger = this.ledgers.find(l => l.id === ledgerId);
        if (!ledger) return;

        switch (action) {
            case 'view':
                this.viewLedgerDetails(ledger);
                break;
            case 'repay':
                this.recordRepayment(ledger);
                break;
            case 'edit':
                this.editLedger(ledger);
                break;
            case 'override':
                this.overrideLedger(ledger);
                break;
        }
    }

    viewLedgerDetails(ledger) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        
        const interest = this.calculateInterest(ledger.amount, ledger.interest_rate || 10, ledger.loan_date, ledger.due_date);
        const penalty = this.isOverdue(ledger.due_date) ? this.calculatePenalty(ledger.amount, ledger.due_date) : 0;
        const totalDue = ledger.amount + interest + penalty;
        
        modal.innerHTML = `
            <div class="modal-dialog modal-lg">
                <div class="modal-header">
                    <h3 class="modal-title">Ledger Details</h3>
                    <button class="btn-icon close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="ledger-details-grid">
                        <div class="detail-section">
                            <h4>Loan Information</h4>
                            <div class="detail-row">
                                <span class="detail-label">Loan ID:</span>
                                <span class="detail-value">${ledger.id}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Category:</span>
                                <span class="detail-value">${ledger.category}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Amount:</span>
                                <span class="detail-value">${this.formatCurrency(ledger.amount)}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Date Issued:</span>
                                <span class="detail-value">${this.formatDate(ledger.loan_date)}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Due Date:</span>
                                <span class="detail-value">${this.formatDate(ledger.due_date)}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Interest Rate:</span>
                                <span class="detail-value">${ledger.interest_rate || 10}% per week</span>
                            </div>
                        </div>
                        
                        <div class="detail-section">
                            <h4>Parties Involved</h4>
                            <div class="detail-row">
                                <span class="detail-label">Lender:</span>
                                <span class="detail-value">${ledger.lender_name || 'Unknown'}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Borrower:</span>
                                <span class="detail-value">${ledger.borrower_name || 'Unknown'}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Borrower Phone:</span>
                                <span class="detail-value">${ledger.borrower_phone || 'N/A'}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Borrower Location:</span>
                                <span class="detail-value">${ledger.borrower_location || 'N/A'}</span>
                            </div>
                        </div>
                        
                        <div class="detail-section">
                            <h4>Financial Summary</h4>
                            <div class="detail-row">
                                <span class="detail-label">Principal:</span>
                                <span class="detail-value">${this.formatCurrency(ledger.amount)}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Interest:</span>
                                <span class="detail-value">${this.formatCurrency(interest)}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Penalty:</span>
                                <span class="detail-value">${this.formatCurrency(penalty)}</span>
                            </div>
                            <div class="detail-row total">
                                <span class="detail-label">Total Due:</span>
                                <span class="detail-value">${this.formatCurrency(totalDue)}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Status:</span>
                                <span class="detail-value"><span class="status-badge">${ledger.status}</span></span>
                            </div>
                        </div>
                        
                        <div class="detail-section full-width">
                            <h4>Guarantors</h4>
                            <div class="guarantors-list">
                                ${ledger.guarantors && ledger.guarantors.length > 0 ? 
                                    ledger.guarantors.map(g => `
                                        <div class="guarantor-card">
                                            <div class="guarantor-name">${g.name}</div>
                                            <div class="guarantor-phone">${g.phone}</div>
                                            <div class="guarantor-relationship">${g.relationship || 'Guarantor'}</div>
                                        </div>
                                    `).join('') : 
                                    '<p class="text-muted">No guarantors listed</p>'
                                }
                            </div>
                        </div>
                        
                        ${ledger.repayment_history && ledger.repayment_history.length > 0 ? `
                            <div class="detail-section full-width">
                                <h4>Repayment History</h4>
                                <table class="repayment-table">
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Amount</th>
                                            <th>Method</th>
                                            <th>Reference</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${ledger.repayment_history.map(payment => `
                                            <tr>
                                                <td>${this.formatDate(payment.date)}</td>
                                                <td>${this.formatCurrency(payment.amount)}</td>
                                                <td>${payment.method}</td>
                                                <td>${payment.reference}</td>
                                                <td><span class="status-badge status-${payment.status}">${payment.status}</span></td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                            </div>
                        ` : ''}
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-outline close-modal">Close</button>
                    ${this.userRole === 'lender' && ledger.status === 'active' ? `
                        <button class="btn btn-primary" id="record-payment" data-ledger-id="${ledger.id}">
                            Record Payment
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        modal.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => {
                document.body.removeChild(modal);
            });
        });
        
        modal.querySelector('#record-payment')?.addEventListener('click', () => {
            document.body.removeChild(modal);
            this.recordRepayment(ledger);
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    recordRepayment(ledger) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        
        const interest = this.calculateInterest(ledger.amount, ledger.interest_rate || 10, ledger.loan_date, ledger.due_date);
        const penalty = this.isOverdue(ledger.due_date) ? this.calculatePenalty(ledger.amount, ledger.due_date) : 0;
        const totalDue = ledger.amount + interest + penalty;
        const paidSoFar = ledger.repayment_history ? 
            ledger.repayment_history.reduce((sum, p) => sum + p.amount, 0) : 0;
        const remaining = totalDue - paidSoFar;
        
        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-header">
                    <h3 class="modal-title">Record Repayment</h3>
                    <button class="btn-icon close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="repayment-summary">
                        <div class="summary-item">
                            <span class="summary-label">Total Due:</span>
                            <span class="summary-value">${this.formatCurrency(totalDue)}</span>
                        </div>
                        <div class="summary-item">
                            <span class="summary-label">Paid So Far:</span>
                            <span class="summary-value">${this.formatCurrency(paidSoFar)}</span>
                        </div>
                        <div class="summary-item total">
                            <span class="summary-label">Remaining:</span>
                            <span class="summary-value">${this.formatCurrency(remaining)}</span>
                        </div>
                    </div>
                    
                    <form id="repayment-form">
                        <div class="form-group">
                            <label for="repayment-amount" class="form-label">Amount *</label>
                            <div class="input-group">
                                <span class="input-group-prepend">${this.getCurrencySymbol()}</span>
                                <input type="number" 
                                       id="repayment-amount" 
                                       class="form-control" 
                                       min="1" 
                                       max="${remaining}"
                                       value="${remaining}"
                                       step="1"
                                       required>
                            </div>
                            <div class="form-hint">Maximum: ${this.formatCurrency(remaining)}</div>
                        </div>
                        
                        <div class="form-group">
                            <label for="repayment-date" class="form-label">Date *</label>
                            <input type="date" 
                                   id="repayment-date" 
                                   class="form-control" 
                                   value="${new Date().toISOString().split('T')[0]}"
                                   required>
                        </div>
                        
                        <div class="form-group">
                            <label for="repayment-method" class="form-label">Method *</label>
                            <select id="repayment-method" class="form-control" required>
                                <option value="">Select method</option>
                                <option value="mpesa">M-Pesa</option>
                                <option value="bank">Bank Transfer</option>
                                <option value="cash">Cash</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="repayment-reference" class="form-label">Reference *</label>
                            <input type="text" 
                                   id="repayment-reference" 
                                   class="form-control" 
                                   placeholder="Transaction ID or reference"
                                   required>
                        </div>
                        
                        <div class="form-group">
                            <label for="repayment-notes" class="form-label">Notes</label>
                            <textarea id="repayment-notes" 
                                      class="form-control" 
                                      placeholder="Additional notes..."
                                      rows="2"></textarea>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-outline close-modal">Cancel</button>
                    <button class="btn btn-primary" id="submit-repayment" data-ledger-id="${ledger.id}">
                        <i class="fas fa-check"></i> Record Payment
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        modal.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => {
                document.body.removeChild(modal);
            });
        });
        
        modal.querySelector('#submit-repayment').addEventListener('click', () => {
            this.submitRepayment(ledger, modal);
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    submitRepayment(ledger, modal) {
        const amount = parseFloat(modal.querySelector('#repayment-amount').value);
        const date = modal.querySelector('#repayment-date').value;
        const method = modal.querySelector('#repayment-method').value;
        const reference = modal.querySelector('#repayment-reference').value;
        const notes = modal.querySelector('#repayment-notes').value;
        
        if (!amount || amount <= 0) {
            alert('Please enter a valid amount');
            return;
        }
        
        if (!date) {
            alert('Please select a date');
            return;
        }
        
        if (!method) {
            alert('Please select a payment method');
            return;
        }
        
        if (!reference.trim()) {
            alert('Please enter a payment reference');
            return;
        }
        
        const payment = {
            id: 'payment_' + Date.now(),
            ledger_id: ledger.id,
            amount: amount,
            date: date,
            method: method,
            reference: reference,
            notes: notes,
            recorded_by: this.currentUser,
            recorded_at: new Date().toISOString(),
            status: 'verified'
        };
        
        this.addRepaymentToLedger(ledger.id, payment);
        
        const remaining = this.calculateRemainingBalance(ledger, payment);
        if (remaining <= 0) {
            this.updateLedgerStatus(ledger.id, 'cleared');
        }
        
        alert('Repayment recorded successfully!');
        document.body.removeChild(modal);
        
        this.loadLedgers();
    }

    addRepaymentToLedger(ledgerId, payment) {
        const ledger = this.ledgers.find(l => l.id === ledgerId);
        if (!ledger) return;
        
        if (!ledger.repayment_history) {
            ledger.repayment_history = [];
        }
        
        ledger.repayment_history.push(payment);
        this.saveLedgers();
    }

    updateLedgerStatus(ledgerId, status) {
        const ledger = this.ledgers.find(l => l.id === ledgerId);
        if (!ledger) return;
        
        ledger.status = status;
        if (status === 'cleared') {
            ledger.cleared_date = new Date().toISOString();
        }
        
        this.saveLedgers();
    }

    calculateRemainingBalance(ledger, newPayment) {
        const interest = this.calculateInterest(ledger.amount, ledger.interest_rate || 10, ledger.loan_date, ledger.due_date);
        const penalty = this.isOverdue(ledger.due_date) ? this.calculatePenalty(ledger.amount, ledger.due_date) : 0;
        const totalDue = ledger.amount + interest + penalty;
        
        const paidSoFar = ledger.repayment_history ? 
            ledger.repayment_history.reduce((sum, p) => sum + p.amount, 0) : 0;
        
        return totalDue - (paidSoFar + newPayment.amount);
    }

    createNewLedger() {
        window.location.href = 'create-ledger.html';
    }

    editLedger(ledger) {
        window.location.href = `edit-ledger.html?id=${ledger.id}`;
    }

    overrideLedger(ledger) {
        if (this.userRole !== 'admin') return;
        
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        
        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-header">
                    <h3 class="modal-title">Admin Override</h3>
                    <button class="btn-icon close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="alert alert-warning">
                        <div class="alert-icon">
                            <i class="fas fa-exclamation-triangle"></i>
                        </div>
                        <div class="alert-content">
                            <div class="alert-title">Warning</div>
                            <p>You are about to override ledger #${ledger.id}. This action should only be used for corrections or dispute resolution.</p>
                        </div>
                    </div>
                    
                    <form id="override-form">
                        <div class="form-group">
                            <label for="override-field" class="form-label">Field to Override</label>
                            <select id="override-field" class="form-control">
                                <option value="amount">Loan Amount</option>
                                <option value="interest_rate">Interest Rate</option>
                                <option value="due_date">Due Date</option>
                                <option value="status">Status</option>
                                <option value="penalty">Penalty</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="override-value" class="form-label">New Value</label>
                            <input type="text" 
                                   id="override-value" 
                                   class="form-control" 
                                   placeholder="Enter new value">
                        </div>
                        
                        <div class="form-group">
                            <label for="override-reason" class="form-label">Reason for Override *</label>
                            <textarea id="override-reason" 
                                      class="form-control" 
                                      placeholder="Explain why this override is necessary..."
                                      rows="3"
                                      required></textarea>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-outline close-modal">Cancel</button>
                    <button class="btn btn-danger" id="confirm-override" data-ledger-id="${ledger.id}">
                        <i class="fas fa-check"></i> Confirm Override
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        modal.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => {
                document.body.removeChild(modal);
            });
        });
        
        modal.querySelector('#confirm-override').addEventListener('click', () => {
            this.confirmOverride(ledger, modal);
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    confirmOverride(ledger, modal) {
        const field = modal.querySelector('#override-field').value;
        const value = modal.querySelector('#override-value').value;
        const reason = modal.querySelector('#override-reason').value;
        
        if (!reason.trim()) {
            alert('Please provide a reason for the override');
            return;
        }
        
        const confirmed = confirm(
            `Are you sure you want to override ${field} of ledger #${ledger.id}?\n\n` +
            `This action will be logged and cannot be undone.`
        );
        
        if (!confirmed) return;
        
        const overrideLog = {
            id: 'override_' + Date.now(),
            ledger_id: ledger.id,
            field: field,
            old_value: ledger[field],
            new_value: value,
            reason: reason,
            admin_id: this.currentUser,
            timestamp: new Date().toISOString()
        };
        
        this.logOverride(overrideLog);
        
        ledger[field] = value;
        this.saveLedgers();
        
        alert('Ledger overridden successfully!');
        document.body.removeChild(modal);
        
        this.loadLedgers();
    }

    logOverride(overrideLog) {
        try {
            const overrides = JSON.parse(localStorage.getItem('mpesewa_overrides') || '[]');
            overrides.push(overrideLog);
            localStorage.setItem('mpesewa_overrides', JSON.stringify(overrides));
        } catch (error) {
            console.error('Error logging override:', error);
        }
    }

    saveLedgers() {
        try {
            localStorage.setItem('mpesewa_ledgers', JSON.stringify(this.ledgers));
        } catch (error) {
            console.error('Error saving ledgers:', error);
        }
    }

    calculateInterest(principal, rate, startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        const weeks = days / 7;
        return principal * (rate / 100) * weeks;
    }

    calculatePenalty(amount, dueDate) {
        if (!this.isOverdue(dueDate)) return 0;
        
        const due = new Date(dueDate);
        const today = new Date();
        const daysOverdue = Math.ceil((today - due) / (1000 * 60 * 60 * 24));
        const dailyPenaltyRate = 0.05;
        
        return amount * dailyPenaltyRate * daysOverdue;
    }

    isOverdue(dueDate) {
        return new Date(dueDate) < new Date();
    }

    getCurrencySymbol() {
        const userData = JSON.parse(localStorage.getItem('mpesewa_user') || '{}');
        const country = userData.country || 'KE';
        const currencies = {
            'KE': 'KSh',
            'UG': 'UGX',
            'TZ': 'TZS',
            'RW': 'RWF',
            'BI': 'BIF',
            'SO': 'SOS',
            'SS': 'SSP',
            'ET': 'ETB',
            'CD': 'CDF',
            'NG': 'NGN',
            'ZA': 'ZAR',
            'GH': 'GHS'
        };
        return currencies[country] || 'KSh';
    }

    formatCurrency(amount) {
        const symbol = this.getCurrencySymbol();
        return `${symbol} ${amount.toLocaleString()}`;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    }
}

const ledgerManager = new LedgerManager();

document.addEventListener('DOMContentLoaded', () => {
    ledgerManager.loadLedgers();
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ledgerManager };
}