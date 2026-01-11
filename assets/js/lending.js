'use strict';

class LendingManager {
    constructor() {
        this.currentLender = null;
        this.availableLoans = [];
        this.myLedgers = [];
        this.subscriptionTier = null;
        this.lendingLimits = {
            basic: 1500,
            premium: 5000,
            super: 20000,
            lender_of_lenders: 50000
        };
        this.loadLenderData();
    }

    async loadLenderData() {
        try {
            const userData = JSON.parse(localStorage.getItem('mpesewa_user') || '{}');
            this.currentLender = userData.id;
            this.subscriptionTier = userData.subscription?.tier || 'basic';
            
            const loansResponse = await fetch('../data/demo-ledgers.json');
            const allLoans = await loansResponse.json();
            
            this.availableLoans = allLoans.filter(loan => 
                loan.status === 'requested' && 
                loan.group_id === userData.current_group
            );
            
            this.myLedgers = allLoans.filter(loan => 
                loan.lender_id === this.currentLender
            );
            
            this.updateLenderDashboard();
        } catch (error) {
            console.error('Error loading lending data:', error);
            this.availableLoans = [];
            this.myLedgers = [];
        }
    }

    updateLenderDashboard() {
        const dashboardStats = this.calculateDashboardStats();
        this.renderDashboardStats(dashboardStats);
        this.renderAvailableLoans();
        this.renderMyLedgers();
        this.updateSubscriptionStatus();
    }

    calculateDashboardStats() {
        const totalLent = this.myLedgers.reduce((sum, loan) => sum + loan.amount, 0);
        const activeLoans = this.myLedgers.filter(loan => loan.status === 'active');
        const totalActive = activeLoans.reduce((sum, loan) => sum + loan.amount, 0);
        const totalExpectedInterest = activeLoans.reduce((sum, loan) => {
            const interest = this.calculateInterest(loan.amount, loan.days_passed || 0);
            return sum + interest;
        }, 0);
        
        const overdueLoans = activeLoans.filter(loan => {
            const dueDate = new Date(loan.due_date);
            const today = new Date();
            return dueDate < today;
        });
        
        const totalOverdue = overdueLoans.reduce((sum, loan) => {
            const overdueDays = Math.floor((new Date() - new Date(loan.due_date)) / (1000 * 60 * 60 * 24));
            const penalty = this.calculatePenalty(loan.amount, overdueDays);
            return sum + loan.amount + penalty;
        }, 0);

        return {
            total_lent: totalLent,
            active_loans: activeLoans.length,
            total_active_amount: totalActive,
            cleared_loans: this.myLedgers.filter(loan => loan.status === 'cleared').length,
            total_expected_interest: totalExpectedInterest,
            overdue_loans: overdueLoans.length,
            total_overdue_amount: totalOverdue,
            available_limit: this.lendingLimits[this.subscriptionTier] || 1500,
            used_limit: totalActive
        };
    }

    renderDashboardStats(stats) {
        const statsContainer = document.getElementById('lender-stats');
        if (!statsContainer) return;

        statsContainer.innerHTML = `
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon stat-icon-primary">
                        <i class="fas fa-hand-holding-usd"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-value">${this.formatCurrency(stats.total_lent)}</div>
                        <div class="stat-label">Total Lent</div>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon stat-icon-success">
                        <i class="fas fa-clipboard-list"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-value">${stats.active_loans}</div>
                        <div class="stat-label">Active Loans</div>
                        <div class="stat-trend">
                            <span class="trend-up">${this.formatCurrency(stats.total_active_amount)}</span>
                        </div>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon stat-icon-warning">
                        <i class="fas fa-chart-line"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-value">${this.formatCurrency(stats.total_expected_interest)}</div>
                        <div class="stat-label">Expected Interest</div>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon ${stats.overdue_loans > 0 ? 'stat-icon-danger' : 'stat-icon-success'}">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-value">${stats.overdue_loans}</div>
                        <div class="stat-label">Overdue Loans</div>
                        ${stats.overdue_loans > 0 ? 
                            `<div class="stat-trend">
                                <span class="trend-down">${this.formatCurrency(stats.total_overdue_amount)}</span>
                            </div>` : ''
                        }
                    </div>
                </div>
            </div>
        `;
    }

    renderAvailableLoans() {
        const container = document.getElementById('available-loans');
        if (!container) return;

        if (this.availableLoans.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📭</div>
                    <h3>No Loan Requests Available</h3>
                    <p>There are no loan requests in your group at the moment.</p>
                    <p>Check back later or ask borrowers to submit requests.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div class="section-header">
                <h3 class="section-title">Available Loan Requests</h3>
                <div class="section-actions">
                    <button class="btn btn-outline" id="refresh-loans">
                        <i class="fas fa-sync-alt"></i> Refresh
                    </button>
                </div>
            </div>
            <div class="loan-requests-grid" id="loan-requests-list"></div>
        `;

        const listContainer = document.getElementById('loan-requests-list');
        this.availableLoans.forEach(loan => {
            this.renderLoanRequestCard(loan, listContainer);
        });

        document.getElementById('refresh-loans')?.addEventListener('click', () => {
            this.loadLenderData();
        });
    }

    renderLoanRequestCard(loan, container) {
        const card = document.createElement('div');
        card.className = 'loan-request-card';
        card.dataset.loanId = loan.id;
        
        const borrowerRating = this.getBorrowerRating(loan.borrower_id);
        const borrowerExposure = this.getBorrowerExposure(loan.borrower_id);
        const isBlacklisted = this.isBorrowerBlacklisted(loan.borrower_id);
        const canLend = this.canLendAmount(loan.amount);
        
        card.innerHTML = `
            <div class="loan-request-header">
                <div class="borrower-info">
                    <div class="borrower-avatar">
                        ${loan.borrower_name?.charAt(0) || 'B'}
                    </div>
                    <div class="borrower-details">
                        <h4 class="borrower-name">${loan.borrower_name || 'Unknown Borrower'}</h4>
                        <div class="borrower-rating">
                            <div class="rating-stars">
                                ${this.renderStars(borrowerRating)}
                            </div>
                            <span class="rating-number">${borrowerRating.toFixed(1)}</span>
                        </div>
                    </div>
                </div>
                ${isBlacklisted ? 
                    `<div class="blacklist-badge">
                        <i class="fas fa-ban"></i> Blacklisted
                    </div>` : ''
                }
            </div>
            
            <div class="loan-request-body">
                <div class="loan-details">
                    <div class="detail-row">
                        <span class="detail-label">Category:</span>
                        <span class="detail-value">${loan.category || 'General'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Amount:</span>
                        <span class="detail-value loan-amount">${this.formatCurrency(loan.amount)}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Purpose:</span>
                        <span class="detail-value">${loan.purpose || 'Emergency loan'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Repayment Period:</span>
                        <span class="detail-value">${loan.repayment_days || 7} days</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Expected Interest:</span>
                        <span class="detail-value">${this.formatCurrency(this.calculateInterest(loan.amount, 7))}</span>
                    </div>
                </div>
                
                ${borrowerExposure.activeLoans > 0 ? 
                    `<div class="exposure-warning">
                        <i class="fas fa-exclamation-circle"></i>
                        Borrower has ${borrowerExposure.activeLoans} active loan(s) in other groups
                    </div>` : ''
                }
                
                <div class="guarantors-section">
                    <strong>Guarantors:</strong>
                    <div class="guarantors-list">
                        ${loan.guarantors?.map(guarantor => `
                            <div class="guarantor-item">
                                <span class="guarantor-name">${guarantor.name}</span>
                                <span class="guarantor-phone">${guarantor.phone}</span>
                            </div>
                        `).join('') || 'No guarantors listed'}
                    </div>
                </div>
            </div>
            
            <div class="loan-request-footer">
                <div class="request-meta">
                    <span class="request-date">Requested: ${this.formatDate(loan.request_date)}</span>
                </div>
                <div class="request-actions">
                    ${!canLend ? 
                        `<button class="btn btn-disabled" disabled title="Exceeds your lending limit">
                            <i class="fas fa-lock"></i> Limit Exceeded
                        </button>` : 
                        `<button class="btn btn-primary lend-btn" data-loan-id="${loan.id}">
                            <i class="fas fa-hand-holding-usd"></i> Lend Now
                        </button>`
                    }
                    <button class="btn btn-outline view-details-btn" data-loan-id="${loan.id}">
                        <i class="fas fa-eye"></i> Details
                    </button>
                </div>
            </div>
        `;
        
        container.appendChild(card);
        
        card.querySelector('.lend-btn')?.addEventListener('click', (e) => {
            this.handleLendRequest(loan.id);
        });
        
        card.querySelector('.view-details-btn')?.addEventListener('click', (e) => {
            this.viewLoanDetails(loan.id);
        });
    }

    renderMyLedgers() {
        const container = document.getElementById('my-ledgers');
        if (!container) return;

        const activeLedgers = this.myLedgers.filter(loan => loan.status === 'active');
        const clearedLedgers = this.myLedgers.filter(loan => loan.status === 'cleared');

        container.innerHTML = `
            <div class="section-header">
                <h3 class="section-title">My Ledgers</h3>
                <div class="tabs">
                    <button class="tab active" data-tab="active">Active (${activeLedgers.length})</button>
                    <button class="tab" data-tab="cleared">Cleared (${clearedLedgers.length})</button>
                </div>
            </div>
            
            <div class="tab-content active" id="active-ledgers">
                ${activeLedgers.length > 0 ? 
                    this.renderLedgersTable(activeLedgers) : 
                    `<div class="empty-state">
                        <div class="empty-state-icon">📋</div>
                        <h3>No Active Loans</h3>
                        <p>You don't have any active loans at the moment.</p>
                    </div>`
                }
            </div>
            
            <div class="tab-content" id="cleared-ledgers">
                ${clearedLedgers.length > 0 ? 
                    this.renderLedgersTable(clearedLedgers) : 
                    `<div class="empty-state">
                        <div class="empty-state-icon">✅</div>
                        <h3>No Cleared Loans</h3>
                        <p>All your cleared loans will appear here.</p>
                    </div>`
                }
            </div>
        `;

        container.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.target.dataset.tab;
                container.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                container.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                e.target.classList.add('active');
                document.getElementById(`${tabName}-ledgers`).classList.add('active');
            });
        });
    }

    renderLedgersTable(ledgers) {
        return `
            <div class="table-container">
                <table class="ledger-table">
                    <thead>
                        <tr>
                            <th>Borrower</th>
                            <th>Amount</th>
                            <th>Category</th>
                            <th>Date Lent</th>
                            <th>Due Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${ledgers.map(loan => `
                            <tr>
                                <td>
                                    <div class="borrower-cell">
                                        <div class="borrower-avatar-sm">${loan.borrower_name?.charAt(0) || 'B'}</div>
                                        <div>
                                            <div class="borrower-name">${loan.borrower_name}</div>
                                            <div class="borrower-phone">${loan.borrower_phone || ''}</div>
                                        </div>
                                    </div>
                                </td>
                                <td class="amount-cell">${this.formatCurrency(loan.amount)}</td>
                                <td><span class="category-badge">${loan.category}</span></td>
                                <td>${this.formatDate(loan.loan_date)}</td>
                                <td>
                                    <div class="due-date-cell ${this.isOverdue(loan.due_date) ? 'overdue' : ''}">
                                        ${this.formatDate(loan.due_date)}
                                        ${this.isOverdue(loan.due_date) ? 
                                            `<span class="overdue-badge">Overdue</span>` : ''
                                        }
                                    </div>
                                </td>
                                <td>
                                    <span class="status-badge status-${loan.status}">
                                        ${loan.status}
                                    </span>
                                </td>
                                <td>
                                    <div class="table-actions">
                                        <button class="btn-icon btn-view" data-loan-id="${loan.id}" title="View Details">
                                            <i class="fas fa-eye"></i>
                                        </button>
                                        ${loan.status === 'active' ? 
                                            `<button class="btn-icon btn-repay" data-loan-id="${loan.id}" title="Record Repayment">
                                                <i class="fas fa-money-check-alt"></i>
                                            </button>` : ''
                                        }
                                        <button class="btn-icon btn-rate" data-loan-id="${loan.id}" title="Rate Borrower">
                                            <i class="fas fa-star"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    updateSubscriptionStatus() {
        const container = document.getElementById('subscription-status');
        if (!container) return;

        const userData = JSON.parse(localStorage.getItem('mpesewa_user') || '{}');
        const subscription = userData.subscription || {};
        const expiryDate = new Date(subscription.expiry || new Date());
        const today = new Date();
        const daysRemaining = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
        const isExpired = daysRemaining < 0;

        container.innerHTML = `
            <div class="subscription-card ${isExpired ? 'expired' : 'active'}">
                <div class="subscription-header">
                    <h4 class="subscription-title">${this.formatTierName(subscription.tier)} Tier</h4>
                    <span class="subscription-badge ${isExpired ? 'badge-danger' : 'badge-success'}">
                        ${isExpired ? 'EXPIRED' : 'ACTIVE'}
                    </span>
                </div>
                
                <div class="subscription-body">
                    <div class="subscription-detail">
                        <span class="detail-label">Weekly Limit:</span>
                        <span class="detail-value">${this.formatCurrency(this.lendingLimits[subscription.tier] || 0)}</span>
                    </div>
                    <div class="subscription-detail">
                        <span class="detail-label">Expiry Date:</span>
                        <span class="detail-value ${isExpired ? 'text-danger' : ''}">
                            ${this.formatDate(expiryDate)}
                        </span>
                    </div>
                    <div class="subscription-detail">
                        <span class="detail-label">Days Remaining:</span>
                        <span class="detail-value ${isExpired ? 'text-danger' : daysRemaining < 7 ? 'text-warning' : 'text-success'}">
                            ${isExpired ? 'Expired' : `${daysRemaining} days`}
                        </span>
                    </div>
                </div>
                
                <div class="subscription-footer">
                    ${isExpired ? 
                        `<button class="btn btn-danger btn-block" id="renew-subscription">
                            <i class="fas fa-sync-alt"></i> Renew Subscription
                        </button>` :
                        `<button class="btn btn-outline btn-block" id="upgrade-subscription">
                            <i class="fas fa-arrow-up"></i> Upgrade Tier
                        </button>`
                    }
                </div>
            </div>
        `;

        document.getElementById('renew-subscription')?.addEventListener('click', () => {
            this.renewSubscription();
        });

        document.getElementById('upgrade-subscription')?.addEventListener('click', () => {
            this.upgradeSubscription();
        });
    }

    handleLendRequest(loanId) {
        const loan = this.availableLoans.find(l => l.id === loanId);
        if (!loan) {
            alert('Loan request not found');
            return;
        }

        if (!this.canLendAmount(loan.amount)) {
            alert(`You cannot lend ${this.formatCurrency(loan.amount)}. Your tier limit is ${this.formatCurrency(this.lendingLimits[this.subscriptionTier])}.`);
            return;
        }

        if (this.isBorrowerBlacklisted(loan.borrower_id)) {
            alert('Cannot lend to a blacklisted borrower');
            return;
        }

        const confirmation = confirm(
            `Confirm lending ${this.formatCurrency(loan.amount)} to ${loan.borrower_name}?\n\n` +
            `Category: ${loan.category}\n` +
            `Repayment: ${loan.repayment_days} days\n` +
            `Interest: ${this.formatCurrency(this.calculateInterest(loan.amount, loan.repayment_days))}\n\n` +
            `Click OK to proceed.`
        );

        if (confirmation) {
            this.processLoanApproval(loan);
        }
    }

    async processLoanApproval(loan) {
        try {
            const ledgerEntry = {
                id: 'ledger_' + Date.now(),
                lender_id: this.currentLender,
                borrower_id: loan.borrower_id,
                borrower_name: loan.borrower_name,
                borrower_phone: loan.borrower_phone,
                amount: loan.amount,
                category: loan.category,
                purpose: loan.purpose,
                loan_date: new Date().toISOString(),
                due_date: new Date(Date.now() + (loan.repayment_days || 7) * 24 * 60 * 60 * 1000).toISOString(),
                interest_rate: 10,
                status: 'active',
                guarantors: loan.guarantors || [],
                repayment_history: [],
                created_at: new Date().toISOString()
            };

            this.myLedgers.push(ledgerEntry);
            
            const allLoans = await this.getAllLoans();
            const updatedLoans = allLoans.map(l => 
                l.id === loan.id ? { ...l, status: 'approved', lender_id: this.currentLender } : l
            );
            
            await this.saveLoans(updatedLoans);
            await this.saveLedgers(this.myLedgers);
            
            alert('Loan approved successfully! Ledger created.');
            this.loadLenderData();
            
        } catch (error) {
            console.error('Error processing loan approval:', error);
            alert('Error processing loan approval. Please try again.');
        }
    }

    async getAllLoans() {
        try {
            const response = await fetch('../data/demo-ledgers.json');
            return await response.json();
        } catch (error) {
            console.error('Error loading loans:', error);
            return [];
        }
    }

    async saveLoans(loans) {
        try {
            localStorage.setItem('mpesewa_loans', JSON.stringify(loans));
        } catch (error) {
            console.error('Error saving loans:', error);
        }
    }

    async saveLedgers(ledgers) {
        try {
            localStorage.setItem('mpesewa_ledgers', JSON.stringify(ledgers));
        } catch (error) {
            console.error('Error saving ledgers:', error);
        }
    }

    viewLoanDetails(loanId) {
        window.location.href = `ledger-details.html?id=${loanId}`;
    }

    renewSubscription() {
        window.location.href = 'subscriptions.html?action=renew';
    }

    upgradeSubscription() {
        window.location.href = 'subscriptions.html?action=upgrade';
    }

    getBorrowerRating(borrowerId) {
        const ratings = JSON.parse(localStorage.getItem('mpesewa_ratings') || '{}');
        return ratings[borrowerId] || 5.0;
    }

    getBorrowerExposure(borrowerId) {
        const allLoans = JSON.parse(localStorage.getItem('mpesewa_loans') || '[]');
        const activeLoans = allLoans.filter(loan => 
            loan.borrower_id === borrowerId && 
            loan.status === 'active' &&
            loan.lender_id !== this.currentLender
        );
        
        return {
            activeLoans: activeLoans.length,
            totalAmount: activeLoans.reduce((sum, loan) => sum + loan.amount, 0),
            groups: [...new Set(activeLoans.map(loan => loan.group_id))]
        };
    }

    isBorrowerBlacklisted(borrowerId) {
        const blacklist = JSON.parse(localStorage.getItem('mpesewa_blacklist') || '[]');
        return blacklist.includes(borrowerId);
    }

    canLendAmount(amount) {
        const usedLimit = this.myLedgers
            .filter(loan => loan.status === 'active')
            .reduce((sum, loan) => sum + loan.amount, 0);
        
        const available = (this.lendingLimits[this.subscriptionTier] || 0) - usedLimit;
        return amount <= available;
    }

    calculateInterest(principal, days) {
        const weeklyInterest = 0.10;
        const weeks = days / 7;
        return principal * weeklyInterest * weeks;
    }

    calculatePenalty(amount, overdueDays) {
        const dailyPenaltyRate = 0.05;
        return amount * dailyPenaltyRate * overdueDays;
    }

    isOverdue(dueDate) {
        return new Date(dueDate) < new Date();
    }

    formatCurrency(amount) {
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
        
        const currency = currencies[country] || 'KSh';
        return `${currency} ${amount.toLocaleString()}`;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    }

    formatTierName(tier) {
        const names = {
            'basic': 'Basic',
            'premium': 'Premium',
            'super': 'Super',
            'lender_of_lenders': 'Lender of Lenders'
        };
        return names[tier] || 'Basic';
    }

    renderStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        let stars = '';
        
        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars += '<i class="fas fa-star"></i>';
            } else if (i === fullStars && hasHalfStar) {
                stars += '<i class="fas fa-star-half-alt"></i>';
            } else {
                stars += '<i class="far fa-star"></i>';
            }
        }
        
        return stars;
    }
}

const lendingManager = new LendingManager();

document.addEventListener('DOMContentLoaded', () => {
    lendingManager.loadLenderData();
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { lendingManager };
}