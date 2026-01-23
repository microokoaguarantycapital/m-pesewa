// assets/js/ledger.js
// Ledger management

const MPesewaLedger = (function() {
    'use strict';

    // Ledger data structure
    const ledgerTemplate = {
        id: '',
        requestId: '',
        borrowerId: '',
        lenderId: '',
        groupId: '',
        category: '',
        principal: 0,
        interestRate: 10,
        penaltyRate: 5,
        fundedDate: '',
        dueDate: '',
        status: 'active', // active, overdue, cleared, defaulted
        totalDue: 0,
        amountPaid: 0,
        balance: 0,
        payments: [],
        notes: '',
        guarantor1: '',
        guarantor2: '',
        lastUpdated: ''
    };

    // Initialize ledgers
    function initLedgers() {
        let ledgers = JSON.parse(localStorage.getItem('mpesewa_ledgers')) || [];
        
        // Load demo data if empty
        if (ledgers.length === 0) {
            fetch('../data/demo-ledgers.json')
                .then(response => response.json())
                .then(data => {
                    localStorage.setItem('mpesewa_ledgers', JSON.stringify(data.ledgers));
                    ledgers = data.ledgers;
                })
                .catch(() => {
                    ledgers = createDemoLedgers();
                });
        }
        
        return ledgers;
    }

    // Create demo ledgers
    function createDemoLedgers() {
        const demoLedgers = [
            {
                id: 'LED001',
                requestId: 'REQ001',
                borrowerId: 'USR003',
                lenderId: 'USR001',
                groupId: 'GRP001',
                category: 'food',
                principal: 2000,
                interestRate: 10,
                penaltyRate: 5,
                fundedDate: new Date(Date.now() - 86400000).toISOString(),
                dueDate: new Date(Date.now() + 518400000).toISOString(),
                status: 'active',
                totalDue: 2200,
                amountPaid: 500,
                balance: 1700,
                payments: [
                    {
                        date: new Date(Date.now() - 43200000).toISOString(),
                        amount: 500,
                        method: 'mpesa',
                        reference: 'MPE123456'
                    }
                ],
                notes: 'Food loan for family',
                guarantor1: 'USR005',
                guarantor2: 'USR002'
            },
            {
                id: 'LED002',
                requestId: 'REQ002',
                borrowerId: 'USR004',
                lenderId: 'USR002',
                groupId: 'GRP001',
                category: 'medicine',
                principal: 5000,
                interestRate: 10,
                penaltyRate: 5,
                fundedDate: new Date(Date.now() - 172800000).toISOString(),
                dueDate: new Date(Date.now() + 432000000).toISOString(),
                status: 'overdue',
                totalDue: 5500,
                amountPaid: 2000,
                balance: 3500,
                payments: [
                    {
                        date: new Date(Date.now() - 86400000).toISOString(),
                        amount: 2000,
                        method: 'bank',
                        reference: 'BANK789012'
                    }
                ],
                notes: 'Medical emergency loan',
                guarantor1: 'USR003',
                guarantor2: 'USR005'
            },
            {
                id: 'LED003',
                requestId: 'REQ003',
                borrowerId: 'USR009',
                lenderId: 'USR006',
                groupId: 'GRP002',
                category: 'fuel',
                principal: 3000,
                interestRate: 10,
                penaltyRate: 5,
                fundedDate: new Date(Date.now() - 259200000).toISOString(),
                dueDate: new Date(Date.now() + 345600000).toISOString(),
                status: 'cleared',
                totalDue: 3300,
                amountPaid: 3300,
                balance: 0,
                payments: [
                    {
                        date: new Date(Date.now() - 172800000).toISOString(),
                        amount: 3300,
                        method: 'mpesa',
                        reference: 'MPE654321'
                    }
                ],
                notes: 'Business fuel loan',
                guarantor1: 'USR008',
                guarantor2: 'USR007'
            }
        ];
        
        localStorage.setItem('mpesewa_ledgers', JSON.stringify(demoLedgers));
        return demoLedgers;
    }

    // Get ledgers by lender
    function getLenderLedgers(lenderId) {
        const ledgers = initLedgers();
        return ledgers.filter(ledger => ledger.lenderId === lenderId);
    }

    // Get ledgers by borrower
    function getBorrowerLedgers(borrowerId) {
        const ledgers = initLedgers();
        return ledgers.filter(ledger => ledger.borrowerId === borrowerId);
    }

    // Get ledger by ID
    function getLedgerById(ledgerId) {
        const ledgers = initLedgers();
        return ledgers.find(ledger => ledger.id === ledgerId);
    }

    // Update ledger status based on dates
    function updateLedgerStatus(ledger) {
        const now = new Date();
        const dueDate = new Date(ledger.dueDate);
        
        // Calculate days overdue
        const daysOverdue = Math.floor((now - dueDate) / (1000 * 60 * 60 * 24));
        
        if (ledger.status === 'cleared' || ledger.status === 'defaulted') {
            return ledger; // No changes for closed ledgers
        }
        
        if (daysOverdue > 60) {
            ledger.status = 'defaulted';
        } else if (daysOverdue > 0) {
            ledger.status = 'overdue';
        } else {
            ledger.status = 'active';
        }
        
        // Calculate penalties if overdue
        if (daysOverdue > 0 && ledger.status !== 'defaulted') {
            const dailyPenalty = (ledger.totalDue * ledger.penaltyRate) / 100;
            const totalPenalty = dailyPenalty * daysOverdue;
            ledger.balance += totalPenalty;
            ledger.totalDue += totalPenalty;
        }
        
        return ledger;
    }

    // Record payment
    function recordPayment(ledgerId, paymentData) {
        const ledgers = initLedgers();
        const ledgerIndex = ledgers.findIndex(l => l.id === ledgerId);
        
        if (ledgerIndex === -1) {
            return { success: false, message: 'Ledger not found' };
        }
        
        const ledger = ledgers[ledgerIndex];
        
        // Validate payment
        if (paymentData.amount <= 0) {
            return { success: false, message: 'Invalid payment amount' };
        }
        
        if (paymentData.amount > ledger.balance) {
            return { 
                success: false, 
                message: `Payment exceeds balance. Maximum payment: Ksh ${ledger.balance.toLocaleString()}` 
            };
        }
        
        // Update ledger
        ledger.amountPaid += paymentData.amount;
        ledger.balance = ledger.totalDue - ledger.amountPaid;
        
        // Add payment record
        ledger.payments.push({
            date: new Date().toISOString(),
            amount: paymentData.amount,
            method: paymentData.method || 'unknown',
            reference: paymentData.reference || 'N/A',
            notes: paymentData.notes || ''
        });
        
        // Update status if fully paid
        if (ledger.balance <= 0) {
            ledger.status = 'cleared';
            ledger.clearedDate = new Date().toISOString();
        }
        
        ledger.lastUpdated = new Date().toISOString();
        ledgers[ledgerIndex] = updateLedgerStatus(ledger);
        localStorage.setItem('mpesewa_ledgers', JSON.stringify(ledgers));
        
        // Update group stats
        if (typeof MPesewa !== 'undefined' && MPesewa.Groups) {
            MPesewa.Groups.updateGroupStats(ledger.groupId, 0, true);
        }
        
        return { 
            success: true, 
            message: `Payment of Ksh ${paymentData.amount.toLocaleString()} recorded successfully!`,
            ledger: ledger
        };
    }

    // Mark ledger as cleared
    function markAsCleared(ledgerId, notes = '') {
        const ledgers = initLedgers();
        const ledgerIndex = ledgers.findIndex(l => l.id === ledgerId);
        
        if (ledgerIndex === -1) {
            return { success: false, message: 'Ledger not found' };
        }
        
        const ledger = ledgers[ledgerIndex];
        ledger.status = 'cleared';
        ledger.balance = 0;
        ledger.amountPaid = ledger.totalDue;
        ledger.clearedDate = new Date().toISOString();
        ledger.lastUpdated = new Date().toISOString();
        
        if (notes) {
            ledger.notes = ledger.notes ? ledger.notes + ' | ' + notes : notes;
        }
        
        ledgers[ledgerIndex] = ledger;
        localStorage.setItem('mpesewa_ledgers', JSON.stringify(ledgers));
        
        // Update group stats
        if (typeof MPesewa !== 'undefined' && MPesewa.Groups) {
            MPesewa.Groups.updateGroupStats(ledger.groupId, 0, true);
        }
        
        return { 
            success: true, 
            message: 'Ledger marked as cleared',
            ledger: ledger
        };
    }

    // Get ledger statistics
    function getLedgerStats(userId, userType = 'lender') {
        const ledgers = userType === 'lender' ? 
            getLenderLedgers(userId) : 
            getBorrowerLedgers(userId);
        
        const active = ledgers.filter(l => l.status === 'active').length;
        const overdue = ledgers.filter(l => l.status === 'overdue').length;
        const cleared = ledgers.filter(l => l.status === 'cleared').length;
        const defaulted = ledgers.filter(l => l.status === 'defaulted').length;
        
        const totalLent = ledgers.reduce((sum, l) => sum + l.principal, 0);
        const totalRepaid = ledgers.reduce((sum, l) => sum + l.amountPaid, 0);
        const totalOutstanding = ledgers
            .filter(l => l.status === 'active' || l.status === 'overdue')
            .reduce((sum, l) => sum + l.balance, 0);
        
        const expectedInterest = ledgers
            .filter(l => l.status === 'active' || l.status === 'overdue')
            .reduce((sum, l) => sum + (l.totalDue - l.principal), 0);
        
        return {
            totalLedgers: ledgers.length,
            active: active,
            overdue: overdue,
            cleared: cleared,
            defaulted: defaulted,
            totalLent: totalLent,
            totalRepaid: totalRepaid,
            totalOutstanding: totalOutstanding,
            expectedInterest: expectedInterest,
            repaymentRate: totalLent > 0 ? (totalRepaid / totalLent) * 100 : 0
        };
    }

    // Filter ledgers
    function filterLedgers(ledgers, filters) {
        return ledgers.filter(ledger => {
            // Status filter
            if (filters.status && filters.status !== 'all' && ledger.status !== filters.status) {
                return false;
            }
            
            // Category filter
            if (filters.category && filters.category !== 'all' && ledger.category !== filters.category) {
                return false;
            }
            
            // Group filter
            if (filters.groupId && filters.groupId !== 'all' && ledger.groupId !== filters.groupId) {
                return false;
            }
            
            // Date range filter
            if (filters.startDate) {
                const ledgerDate = new Date(ledger.fundedDate);
                const startDate = new Date(filters.startDate);
                if (ledgerDate < startDate) {
                    return false;
                }
            }
            
            if (filters.endDate) {
                const ledgerDate = new Date(ledger.fundedDate);
                const endDate = new Date(filters.endDate);
                if (ledgerDate > endDate) {
                    return false;
                }
            }
            
            // Amount range filter
            if (filters.minAmount && ledger.principal < filters.minAmount) {
                return false;
            }
            
            if (filters.maxAmount && ledger.principal > filters.maxAmount) {
                return false;
            }
            
            return true;
        });
    }

    // Get ledger status color
    function getStatusColor(status) {
        const colors = {
            'active': '#10B981',
            'overdue': '#F59E0B',
            'cleared': '#3B82F6',
            'defaulted': '#EF4444',
            'pending': '#6B7280'
        };
        return colors[status] || '#6B7280';
    }

    // Calculate days overdue
    function calculateDaysOverdue(dueDate) {
        const due = new Date(dueDate);
        const now = new Date();
        const daysOverdue = Math.floor((now - due) / (1000 * 60 * 60 * 24));
        return Math.max(0, daysOverdue);
    }

    // Calculate penalty amount
    function calculatePenalty(ledger) {
        const daysOverdue = calculateDaysOverdue(ledger.dueDate);
        if (daysOverdue <= 0) return 0;
        
        const dailyPenalty = (ledger.totalDue * ledger.penaltyRate) / 100;
        return dailyPenalty * daysOverdue;
    }

    // Render ledgers to HTML table
    function renderLedgersTable(ledgers, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        container.innerHTML = '';
        
        if (!ledgers || ledgers.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📊</div>
                    <h3 class="empty-title">No Ledgers Found</h3>
                    <p class="empty-description">No ledger records available.</p>
                </div>
            `;
            return;
        }
        
        const table = document.createElement('table');
        table.className = 'data-table ledger-table';
        table.innerHTML = `
            <thead>
                <tr>
                    <th>Borrower</th>
                    <th>Category</th>
                    <th>Principal</th>
                    <th>Due Date</th>
                    <th>Status</th>
                    <th>Balance</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${ledgers.map(ledger => {
                    const borrower = MPesewa.Borrowing ? 
                        MPesewa.Borrowing.getBorrowerDetails(ledger.borrowerId) : 
                        { name: 'Unknown' };
                    const category = MPesewa.Lending ? 
                        MPesewa.Lending.getCategoryDetails(ledger.category) : 
                        { name: 'Loan' };
                    const statusColor = getStatusColor(ledger.status);
                    const daysOverdue = calculateDaysOverdue(ledger.dueDate);
                    const penalty = calculatePenalty(ledger);
                    
                    return `
                        <tr class="ledger-row ${ledger.status}">
                            <td>
                                <div class="table-avatar">
                                    <div class="avatar-fallback">${borrower.name.charAt(0)}</div>
                                    <div class="avatar-info">
                                        <span class="avatar-name">${borrower.name}</span>
                                        <span class="avatar-detail">Rating: ${borrower.rating.toFixed(1)}/5</span>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="table-badge badge-category">${category.name}</span>
                            </td>
                            <td class="table-cell-number">
                                Ksh ${ledger.principal.toLocaleString()}
                            </td>
                            <td>
                                ${formatDate(ledger.dueDate)}
                                ${daysOverdue > 0 ? `
                                    <div class="overdue-badge">
                                        ${daysOverdue} days overdue
                                    </div>
                                ` : ''}
                            </td>
                            <td>
                                <span class="table-status" style="background: ${statusColor}20; color: ${statusColor};">
                                    ${ledger.status.toUpperCase()}
                                </span>
                            </td>
                            <td class="table-cell-number">
                                <strong>Ksh ${ledger.balance.toLocaleString()}</strong>
                                ${penalty > 0 ? `
                                    <div class="penalty-amount">
                                        +Ksh ${penalty.toLocaleString()} penalty
                                    </div>
                                ` : ''}
                            </td>
                            <td class="table-cell-actions">
                                <div class="table-actions">
                                    <button class="action-btn view" title="View Details" data-ledger-id="${ledger.id}">
                                        👁️
                                    </button>
                                    ${ledger.status === 'active' || ledger.status === 'overdue' ? `
                                    <button class="action-btn payment" title="Record Payment" data-ledger-id="${ledger.id}">
                                        💰
                                    </button>
                                    ` : ''}
                                    ${ledger.status === 'cleared' ? `
                                    <button class="action-btn cleared" title="Already Cleared" disabled>
                                        ✅
                                    </button>
                                    ` : ''}
                                </div>
                            </td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        `;
        
        container.appendChild(table);
        
        // Add event listeners
        container.querySelectorAll('.action-btn.view').forEach(button => {
            button.addEventListener('click', function() {
                const ledgerId = this.getAttribute('data-ledger-id');
                viewLedgerDetails(ledgerId);
            });
        });
        
        container.querySelectorAll('.action-btn.payment').forEach(button => {
            button.addEventListener('click', function() {
                const ledgerId = this.getAttribute('data-ledger-id');
                recordPaymentPrompt(ledgerId);
            });
        });
    }

    // Render ledger details
    function renderLedgerDetails(ledgerId, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const ledger = getLedgerById(ledgerId);
        if (!ledger) {
            container.innerHTML = '<p>Ledger not found</p>';
            return;
        }
        
        const borrower = MPesewa.Borrowing ? 
            MPesewa.Borrowing.getBorrowerDetails(ledger.borrowerId) : 
            { name: 'Unknown' };
        const category = MPesewa.Lending ? 
            MPesewa.Lending.getCategoryDetails(ledger.category) : 
            { name: 'Loan' };
        const group = MPesewa.Groups ? 
            MPesewa.Groups.getGroupById(ledger.groupId) : 
            { name: 'Unknown Group' };
        const daysOverdue = calculateDaysOverdue(ledger.dueDate);
        const penalty = calculatePenalty(ledger);
        
        container.innerHTML = `
            <div class="ledger-details-card">
                <div class="details-header">
                    <h3>Ledger Details: ${ledger.id}</h3>
                    <span class="ledger-status ${ledger.status}">${ledger.status.toUpperCase()}</span>
                </div>
                
                <div class="details-grid">
                    <div class="detail-section">
                        <h4>Borrower Information</h4>
                        <div class="detail-item">
                            <span>Name:</span>
                            <strong>${borrower.name}</strong>
                        </div>
                        <div class="detail-item">
                            <span>Rating:</span>
                            <span class="rating-value">${borrower.rating.toFixed(1)}/5</span>
                        </div>
                        <div class="detail-item">
                            <span>Blacklisted:</span>
                            <span class="${borrower.blacklisted ? 'badge-error' : 'badge-success'}">
                                ${borrower.blacklisted ? 'Yes' : 'No'}
                            </span>
                        </div>
                    </div>
                    
                    <div class="detail-section">
                        <h4>Loan Information</h4>
                        <div class="detail-item">
                            <span>Category:</span>
                            <span class="category-badge">${category.name}</span>
                        </div>
                        <div class="detail-item">
                            <span>Group:</span>
                            <span>${group.name}</span>
                        </div>
                        <div class="detail-item">
                            <span>Principal:</span>
                            <strong>Ksh ${ledger.principal.toLocaleString()}</strong>
                        </div>
                        <div class="detail-item">
                            <span>Interest Rate:</span>
                            <span>${ledger.interestRate}%</span>
                        </div>
                    </div>
                    
                    <div class="detail-section">
                        <h4>Financial Details</h4>
                        <div class="detail-item">
                            <span>Total Due:</span>
                            <strong>Ksh ${ledger.totalDue.toLocaleString()}</strong>
                        </div>
                        <div class="detail-item">
                            <span>Amount Paid:</span>
                            <strong>Ksh ${ledger.amountPaid.toLocaleString()}</strong>
                        </div>
                        <div class="detail-item">
                            <span>Balance:</span>
                            <strong class="${ledger.balance > 0 ? 'text-error' : 'text-success'}">
                                Ksh ${ledger.balance.toLocaleString()}
                            </strong>
                        </div>
                        ${penalty > 0 ? `
                        <div class="detail-item">
                            <span>Penalty:</span>
                            <strong class="text-warning">Ksh ${penalty.toLocaleString()}</strong>
                        </div>
                        ` : ''}
                    </div>
                    
                    <div class="detail-section">
                        <h4>Dates</h4>
                        <div class="detail-item">
                            <span>Funded Date:</span>
                            <span>${formatDate(ledger.fundedDate)}</span>
                        </div>
                        <div class="detail-item">
                            <span>Due Date:</span>
                            <span class="${daysOverdue > 0 ? 'text-warning' : ''}">
                                ${formatDate(ledger.dueDate)}
                                ${daysOverdue > 0 ? `(${daysOverdue} days overdue)` : ''}
                            </span>
                        </div>
                        ${ledger.clearedDate ? `
                        <div class="detail-item">
                            <span>Cleared Date:</span>
                            <span>${formatDate(ledger.clearedDate)}</span>
                        </div>
                        ` : ''}
                    </div>
                </div>
                
                ${ledger.notes ? `
                <div class="notes-section">
                    <h4>Notes</h4>
                    <p>${ledger.notes}</p>
                </div>
                ` : ''}
                
                ${ledger.guarantor1 || ledger.guarantor2 ? `
                <div class="guarantors-section">
                    <h4>Guarantors</h4>
                    <div class="guarantors-list">
                        ${ledger.guarantor1 ? `<div class="guarantor">Guarantor 1: ${ledger.guarantor1}</div>` : ''}
                        ${ledger.guarantor2 ? `<div class="guarantor">Guarantor 2: ${ledger.guarantor2}</div>` : ''}
                    </div>
                </div>
                ` : ''}
                
                ${ledger.payments && ledger.payments.length > 0 ? `
                <div class="payments-section">
                    <h4>Payment History</h4>
                    <div class="payments-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Amount</th>
                                    <th>Method</th>
                                    <th>Reference</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${ledger.payments.map(payment => `
                                    <tr>
                                        <td>${formatDate(payment.date)}</td>
                                        <td>Ksh ${payment.amount.toLocaleString()}</td>
                                        <td>${payment.method}</td>
                                        <td>${payment.reference}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
                ` : ''}
                
                <div class="details-actions">
                    ${ledger.status === 'active' || ledger.status === 'overdue' ? `
                    <button class="btn primary record-payment-btn" data-ledger-id="${ledger.id}">
                        Record Payment
                    </button>
                    ` : ''}
                    ${ledger.status === 'cleared' ? `
                    <button class="btn outline" disabled>
                        Loan Cleared
                    </button>
                    ` : ''}
                    <button class="btn secondary close-details-btn">
                        Close
                    </button>
                </div>
            </div>
        `;
        
        // Add event listeners
        container.querySelector('.record-payment-btn')?.addEventListener('click', function() {
            const ledgerId = this.getAttribute('data-ledger-id');
            recordPaymentPrompt(ledgerId);
        });
        
        container.querySelector('.close-details-btn')?.addEventListener('click', function() {
            container.innerHTML = '';
        });
    }

    // UI event handlers
    function viewLedgerDetails(ledgerId) {
        const modal = document.getElementById('ledgerDetailsModal');
        if (modal) {
            renderLedgerDetails(ledgerId, 'ledgerDetailsContent');
            modal.style.display = 'block';
        } else {
            // Create modal if it doesn't exist
            createLedgerModal(ledgerId);
        }
    }

    function recordPaymentPrompt(ledgerId) {
        const ledger = getLedgerById(ledgerId);
        if (!ledger) {
            alert('Ledger not found');
            return;
        }
        
        const amount = parseFloat(prompt(`Enter payment amount (Maximum: Ksh ${ledger.balance.toLocaleString()}):`));
        if (isNaN(amount) || amount <= 0) {
            alert('Invalid amount');
            return;
        }
        
        if (amount > ledger.balance) {
            alert(`Amount exceeds balance. Maximum: Ksh ${ledger.balance.toLocaleString()}`);
            return;
        }
        
        const method = prompt('Payment method (mpesa, bank, cash, other):') || 'unknown';
        const reference = prompt('Payment reference (optional):') || '';
        const notes = prompt('Payment notes (optional):') || '';
        
        const paymentData = {
            amount: amount,
            method: method,
            reference: reference,
            notes: notes
        };
        
        const result = recordPayment(ledgerId, paymentData);
        alert(result.message);
        
        if (result.success) {
            // Refresh UI
            const currentUser = JSON.parse(localStorage.getItem('mpesewa_currentUser'));
            if (currentUser) {
                const userLedgers = getLenderLedgers(currentUser.id);
                if (document.getElementById('ledgersTableContainer')) {
                    renderLedgersTable(userLedgers, 'ledgersTableContainer');
                }
            }
        }
    }

    // Helper functions
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }

    function createLedgerModal(ledgerId) {
        const modal = document.createElement('div');
        modal.id = 'ledgerDetailsModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Ledger Details</h3>
                    <button class="modal-close" onclick="this.parentElement.parentElement.style.display='none'">×</button>
                </div>
                <div class="modal-body">
                    <div id="ledgerDetailsContent"></div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        renderLedgerDetails(ledgerId, 'ledgerDetailsContent');
        modal.style.display = 'block';
    }

    // Public API
    return {
        init: initLedgers,
        getLenderLedgers,
        getBorrowerLedgers,
        getLedgerById,
        updateLedgerStatus,
        recordPayment,
        markAsCleared,
        getLedgerStats,
        filterLedgers,
        getStatusColor,
        calculateDaysOverdue,
        calculatePenalty,
        renderLedgersTable,
        renderLedgerDetails,
        viewLedgerDetails,
        recordPaymentPrompt
    };
})();

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    if (typeof MPesewa !== 'undefined') {
        MPesewa.Ledger = MPesewaLedger;
    }
});