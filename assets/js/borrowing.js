// assets/js/borrowing.js
// Borrowing functionality

const MPesewaBorrowing = (function() {
    'use strict';

    // Borrowing data structure
    const borrowingRequestTemplate = {
        id: '',
        borrowerId: '',
        groupId: '',
        category: '',
        amount: 0,
        tenure: 7,
        interestRate: 10,
        penaltyRate: 5,
        requestedDate: '',
        status: 'draft', // draft, pending, funded, rejected, cancelled
        notes: '',
        guarantor1: '',
        guarantor2: ''
    };

    // Initialize borrowing requests
    function initBorrowingRequests() {
        let requests = JSON.parse(localStorage.getItem('mpesewa_borrowing_requests')) || [];
        return requests;
    }

    // Get borrower's active loans
    function getBorrowerActiveLoans(borrowerId) {
        const ledgers = JSON.parse(localStorage.getItem('mpesewa_ledgers')) || [];
        return ledgers.filter(ledger => 
            ledger.borrowerId === borrowerId && 
            (ledger.status === 'active' || ledger.status === 'overdue')
        );
    }

    // Get borrower's loan history
    function getBorrowerLoanHistory(borrowerId) {
        const ledgers = JSON.parse(localStorage.getItem('mpesewa_ledgers')) || [];
        return ledgers.filter(ledger => 
            ledger.borrowerId === borrowerId
        ).sort((a, b) => new Date(b.fundedDate) - new Date(a.fundedDate));
    }

    // Check if borrower can request loan in group
    function canBorrowInGroup(borrowerId, groupId) {
        // Check if borrower is blacklisted
        const borrower = JSON.parse(localStorage.getItem('mpesewa_currentUser'));
        if (borrower && borrower.blacklisted) {
            return { 
                canBorrow: false, 
                reason: 'Account is blacklisted due to previous defaults' 
            };
        }
        
        // Check active loans in this group
        const activeLoans = getBorrowerActiveLoans(borrowerId);
        const groupLoans = activeLoans.filter(loan => loan.groupId === groupId);
        
        if (groupLoans.length > 0) {
            return { 
                canBorrow: false, 
                reason: 'You already have an active loan in this group' 
            };
        }
        
        // Check total active loans (max 4 groups, but unlimited loans per group)
        const totalActiveLoans = activeLoans.length;
        if (totalActiveLoans >= 10) { // Reasonable limit
            return { 
                canBorrow: false, 
                reason: 'Maximum number of active loans reached' 
            };
        }
        
        // Check borrower rating (simplified)
        const rating = getBorrowerRating(borrowerId);
        if (rating < 2) {
            return { 
                canBorrow: false, 
                reason: 'Low borrower rating. Improve your repayment history.' 
            };
        }
        
        return { canBorrow: true };
    }

    // Get borrower rating
    function getBorrowerRating(borrowerId) {
        const ledgers = JSON.parse(localStorage.getItem('mpesewa_ledgers')) || [];
        const borrowerLedgers = ledgers.filter(l => l.borrowerId === borrowerId);
        
        if (borrowerLedgers.length === 0) {
            return 5; // New borrowers get default rating
        }
        
        const cleared = borrowerLedgers.filter(l => l.status === 'cleared').length;
        const defaulted = borrowerLedgers.filter(l => l.status === 'defaulted').length;
        const total = borrowerLedgers.length;
        
        const clearanceRate = cleared / total;
        const defaultRate = defaulted / total;
        
        // Calculate rating: 5-star system based on performance
        let rating = 5;
        rating -= defaultRate * 3; // Heavy penalty for defaults
        rating += clearanceRate * 2; // Bonus for cleared loans
        
        return Math.max(1, Math.min(5, rating));
    }

    // Create new loan request
    function createLoanRequest(requestData) {
        const requests = initBorrowingRequests();
        
        // Generate request ID
        const requestId = 'BREQ' + String(requests.length + 1).padStart(3, '0');
        
        const newRequest = {
            ...borrowingRequestTemplate,
            ...requestData,
            id: requestId,
            requestedDate: new Date().toISOString(),
            status: 'pending'
        };
        
        // Validate request
        const validation = validateLoanRequest(newRequest);
        if (!validation.valid) {
            return { success: false, message: validation.message };
        }
        
        // Check if borrower can borrow in this group
        const canBorrow = canBorrowInGroup(requestData.borrowerId, requestData.groupId);
        if (!canBorrow.canBorrow) {
            return { success: false, message: canBorrow.reason };
        }
        
        requests.push(newRequest);
        localStorage.setItem('mpesewa_borrowing_requests', JSON.stringify(requests));
        
        return { 
            success: true, 
            message: 'Loan request submitted successfully! Lenders in your group will review it.',
            request: newRequest
        };
    }

    // Validate loan request
    function validateLoanRequest(request) {
        if (!request.groupId) {
            return { valid: false, message: 'Please select a group' };
        }
        
        if (!request.category) {
            return { valid: false, message: 'Please select a loan category' };
        }
        
        if (!request.amount || request.amount <= 0) {
            return { valid: false, message: 'Please enter a valid loan amount' };
        }
        
        if (request.amount > 50000) {
            return { valid: false, message: 'Maximum loan amount is Ksh 50,000' };
        }
        
        if (request.amount < 100) {
            return { valid: false, message: 'Minimum loan amount is Ksh 100' };
        }
        
        return { valid: true };
    }

    // Cancel loan request
    function cancelLoanRequest(requestId, borrowerId) {
        const requests = initBorrowingRequests();
        const requestIndex = requests.findIndex(req => req.id === requestId && req.borrowerId === borrowerId);
        
        if (requestIndex === -1) {
            return { success: false, message: 'Loan request not found' };
        }
        
        if (requests[requestIndex].status !== 'pending') {
            return { success: false, message: 'Only pending requests can be cancelled' };
        }
        
        requests[requestIndex].status = 'cancelled';
        requests[requestIndex].cancelledDate = new Date().toISOString();
        
        localStorage.setItem('mpesewa_borrowing_requests', JSON.stringify(requests));
        
        return { 
            success: true, 
            message: 'Loan request cancelled successfully',
            request: requests[requestIndex]
        };
    }

    // Get borrower's pending requests
    function getBorrowerPendingRequests(borrowerId) {
        const requests = initBorrowingRequests();
        return requests.filter(req => 
            req.borrowerId === borrowerId && 
            req.status === 'pending'
        );
    }

    // Calculate repayment schedule
    function calculateRepaymentSchedule(principal, interestRate, tenure) {
        const totalInterest = (principal * interestRate) / 100;
        const totalAmount = principal + totalInterest;
        const dailyAmount = totalAmount / tenure;
        
        const schedule = [];
        let currentDate = new Date();
        
        for (let i = 1; i <= tenure; i++) {
            currentDate.setDate(currentDate.getDate() + 1);
            schedule.push({
                day: i,
                date: new Date(currentDate),
                amount: dailyAmount,
                cumulative: dailyAmount * i
            });
        }
        
        return {
            principal: principal,
            interest: totalInterest,
            totalAmount: totalAmount,
            dailyAmount: dailyAmount,
            schedule: schedule,
            penaltyPerDay: totalAmount * 0.05 // 5% daily penalty after due date
        };
    }

    // Get loan status information
    function getLoanStatusInfo(status) {
        const statusInfo = {
            'active': { label: 'Active', class: 'status-active', icon: '🟢' },
            'overdue': { label: 'Overdue', class: 'status-overdue', icon: '🟡' },
            'cleared': { label: 'Cleared', class: 'status-cleared', icon: '✅' },
            'defaulted': { label: 'Defaulted', class: 'status-defaulted', icon: '🔴' },
            'pending': { label: 'Pending', class: 'status-pending', icon: '⏳' },
            'funded': { label: 'Funded', class: 'status-funded', icon: '💰' },
            'rejected': { label: 'Rejected', class: 'status-rejected', icon: '❌' }
        };
        
        return statusInfo[status] || { label: 'Unknown', class: 'status-unknown', icon: '❓' };
    }

    // Render borrower's active loans
    function renderActiveLoans(loans, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        container.innerHTML = '';
        
        if (!loans || loans.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📋</div>
                    <h3 class="empty-title">No Active Loans</h3>
                    <p class="empty-description">You don't have any active loans at the moment.</p>
                    <button class="btn primary" onclick="requestNewLoan()">Request New Loan</button>
                </div>
            `;
            return;
        }
        
        loans.forEach(loan => {
            const statusInfo = getLoanStatusInfo(loan.status);
            const daysRemaining = calculateDaysRemaining(loan.dueDate);
            const category = MPesewa.Lending ? 
                MPesewa.Lending.getCategoryDetails(loan.category) : 
                { name: 'Loan', icon: '💰' };
            
            const loanCard = document.createElement('div');
            loanCard.className = 'loan-card';
            loanCard.innerHTML = `
                <div class="loan-header">
                    <div class="loan-status ${statusInfo.class}">
                        <span class="status-icon">${statusInfo.icon}</span>
                        <span class="status-label">${statusInfo.label}</span>
                    </div>
                    <div class="loan-category">
                        <span class="category-icon">${category.icon}</span>
                        <span class="category-name">${category.name}</span>
                    </div>
                </div>
                
                <div class="loan-details">
                    <div class="detail-grid">
                        <div class="detail-item">
                            <span class="detail-label">Principal:</span>
                            <span class="detail-value">Ksh ${loan.principal.toLocaleString()}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Interest:</span>
                            <span class="detail-value">${loan.interestRate}%</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Total Due:</span>
                            <span class="detail-value">Ksh ${loan.totalDue.toLocaleString()}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Paid:</span>
                            <span class="detail-value">Ksh ${loan.amountPaid.toLocaleString()}</span>
                        </div>
                    </div>
                    
                    <div class="balance-info">
                        <span class="balance-label">Outstanding Balance:</span>
                        <span class="balance-value">Ksh ${loan.balance.toLocaleString()}</span>
                    </div>
                    
                    ${daysRemaining > 0 ? `
                    <div class="time-remaining">
                        <span class="time-label">Days Remaining:</span>
                        <span class="time-value ${daysRemaining <= 3 ? 'warning' : ''}">
                            ${daysRemaining} days
                        </span>
                    </div>
                    ` : `
                    <div class="time-overdue">
                        <span class="overdue-label">Overdue by:</span>
                        <span class="overdue-value">
                            ${Math.abs(daysRemaining)} days
                        </span>
                        <span class="penalty-warning">(5% daily penalty applies)</span>
                    </div>
                    `}
                </div>
                
                <div class="loan-footer">
                    <div class="loan-dates">
                        <div class="date-item">
                            <span>Funded:</span>
                            <span>${formatDate(loan.fundedDate)}</span>
                        </div>
                        <div class="date-item">
                            <span>Due:</span>
                            <span>${formatDate(loan.dueDate)}</span>
                        </div>
                    </div>
                    
                    ${loan.status === 'active' ? `
                    <button class="btn primary make-payment-btn" data-loan-id="${loan.id}">
                        Make Payment
                    </button>
                    ` : ''}
                </div>
            `;
            
            container.appendChild(loanCard);
        });
        
        // Add event listeners for payment buttons
        container.querySelectorAll('.make-payment-btn').forEach(button => {
            button.addEventListener('click', function() {
                const loanId = this.getAttribute('data-loan-id');
                makePayment(loanId);
            });
        });
    }

    // Render borrower's pending requests
    function renderPendingRequests(requests, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        container.innerHTML = '';
        
        if (!requests || requests.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">⏳</div>
                    <h3 class="empty-title">No Pending Requests</h3>
                    <p class="empty-description">You don't have any pending loan requests.</p>
                </div>
            `;
            return;
        }
        
        requests.forEach(request => {
            const category = MPesewa.Lending ? 
                MPesewa.Lending.getCategoryDetails(request.category) : 
                { name: 'Loan', icon: '💰' };
            const group = MPesewa.Groups ? 
                MPesewa.Groups.getGroupById(request.groupId) : 
                { name: 'Unknown Group' };
            
            const requestCard = document.createElement('div');
            requestCard.className = 'request-card';
            requestCard.innerHTML = `
                <div class="request-header">
                    <h4 class="request-title">${category.name} Request</h4>
                    <span class="request-date">${formatDate(request.requestedDate)}</span>
                </div>
                
                <div class="request-body">
                    <div class="amount-display">
                        <span class="amount-label">Requested Amount:</span>
                        <span class="amount-value">Ksh ${request.amount.toLocaleString()}</span>
                    </div>
                    
                    <div class="request-details">
                        <div class="detail-row">
                            <span class="detail-label">Group:</span>
                            <span class="detail-value">${group.name}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Duration:</span>
                            <span class="detail-value">${request.tenure} days</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Interest Rate:</span>
                            <span class="detail-value">${request.interestRate}%</span>
                        </div>
                    </div>
                    
                    ${request.notes ? `
                    <div class="request-notes">
                        <strong>Notes:</strong> ${request.notes}
                    </div>
                    ` : ''}
                </div>
                
                <div class="request-footer">
                    <span class="request-status pending">Pending Review</span>
                    <button class="btn outline cancel-btn" data-request-id="${request.id}">
                        Cancel Request
                    </button>
                </div>
            `;
            
            container.appendChild(requestCard);
        });
        
        // Add event listeners for cancel buttons
        container.querySelectorAll('.cancel-btn').forEach(button => {
            button.addEventListener('click', function() {
                const requestId = this.getAttribute('data-request-id');
                cancelRequest(requestId);
            });
        });
    }

    // UI event handlers
    function requestNewLoan() {
        // This would open a loan request form modal
        // For now, show a simple prompt-based form
        
        const currentUser = JSON.parse(localStorage.getItem('mpesewa_currentUser'));
        if (!currentUser) {
            alert('Please login to request a loan');
            return;
        }
        
        // Get user's groups
        const userGroups = MPesewa.Groups ? 
            MPesewa.Groups.getUserGroups(currentUser.id) : [];
        
        if (userGroups.length === 0) {
            alert('You need to join a group before requesting a loan');
            return;
        }
        
        // Simple form via prompts
        const groupNames = userGroups.map(g => g.name).join(', ');
        const groupChoice = prompt(`Select group (${groupNames}):`);
        const selectedGroup = userGroups.find(g => g.name === groupChoice);
        
        if (!selectedGroup) {
            alert('Invalid group selection');
            return;
        }
        
        const categories = MPesewa.Lending ? 
            MPesewa.Lending.getLoanCategories().map(c => c.name).join(', ') : 
            'General';
        const categoryChoice = prompt(`Select category (${categories}):`);
        
        const amount = parseFloat(prompt('Enter loan amount (Ksh):'));
        if (isNaN(amount) || amount <= 0) {
            alert('Invalid amount');
            return;
        }
        
        const notes = prompt('Purpose of loan (optional):') || '';
        
        const requestData = {
            borrowerId: currentUser.id,
            groupId: selectedGroup.id,
            category: categoryChoice.toLowerCase().replace(' ', '-'),
            amount: amount,
            tenure: 7,
            interestRate: 10,
            penaltyRate: 5,
            notes: notes
        };
        
        const result = createLoanRequest(requestData);
        alert(result.message);
        
        if (result.success) {
            // Refresh UI
            const pendingRequests = getBorrowerPendingRequests(currentUser.id);
            if (document.getElementById('pendingRequestsContainer')) {
                renderPendingRequests(pendingRequests, 'pendingRequestsContainer');
            }
        }
    }

    function cancelRequest(requestId) {
        const currentUser = JSON.parse(localStorage.getItem('mpesewa_currentUser'));
        if (!currentUser) {
            alert('Please login to cancel requests');
            return;
        }
        
        const result = cancelLoanRequest(requestId, currentUser.id);
        alert(result.message);
        
        if (result.success) {
            // Refresh UI
            const pendingRequests = getBorrowerPendingRequests(currentUser.id);
            if (document.getElementById('pendingRequestsContainer')) {
                renderPendingRequests(pendingRequests, 'pendingRequestsContainer');
            }
        }
    }

    function makePayment(loanId) {
        const amount = parseFloat(prompt('Enter payment amount (Ksh):'));
        if (isNaN(amount) || amount <= 0) {
            alert('Invalid payment amount');
            return;
        }
        
        // In a real app, this would integrate with payment gateway
        // For demo, simulate payment
        const result = simulatePayment(loanId, amount);
        alert(result.message);
        
        if (result.success) {
            // Refresh UI
            const currentUser = JSON.parse(localStorage.getItem('mpesewa_currentUser'));
            if (currentUser) {
                const activeLoans = getBorrowerActiveLoans(currentUser.id);
                if (document.getElementById('activeLoansContainer')) {
                    renderActiveLoans(activeLoans, 'activeLoansContainer');
                }
            }
        }
    }

    // Simulate payment (for demo)
    function simulatePayment(loanId, amount) {
        const ledgers = JSON.parse(localStorage.getItem('mpesewa_ledgers')) || [];
        const ledgerIndex = ledgers.findIndex(l => l.id === loanId);
        
        if (ledgerIndex === -1) {
            return { success: false, message: 'Loan not found' };
        }
        
        const ledger = ledgers[ledgerIndex];
        
        // Update payment
        ledger.amountPaid += amount;
        ledger.balance = ledger.totalDue - ledger.amountPaid;
        
        // Add payment record
        ledger.payments.push({
            date: new Date().toISOString(),
            amount: amount,
            method: 'simulated',
            reference: 'DEMO' + Date.now()
        });
        
        // Update status if fully paid
        if (ledger.balance <= 0) {
            ledger.status = 'cleared';
            ledger.clearedDate = new Date().toISOString();
        }
        
        ledgers[ledgerIndex] = ledger;
        localStorage.setItem('mpesewa_ledgers', JSON.stringify(ledgers));
        
        return { 
            success: true, 
            message: `Payment of Ksh ${amount.toLocaleString()} recorded successfully!`,
            ledger: ledger
        };
    }

    // Helper functions
    function calculateDaysRemaining(dueDate) {
        const due = new Date(dueDate);
        const now = new Date();
        const diffTime = due - now;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }

    // Public API
    return {
        init: initBorrowingRequests,
        getBorrowerActiveLoans,
        getBorrowerLoanHistory,
        canBorrowInGroup,
        getBorrowerRating,
        createLoanRequest,
        cancelLoanRequest,
        getBorrowerPendingRequests,
        calculateRepaymentSchedule,
        getLoanStatusInfo,
        renderActiveLoans,
        renderPendingRequests,
        requestNewLoan,
        cancelRequest,
        makePayment
    };
})();

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    if (typeof MPesewa !== 'undefined') {
        MPesewa.Borrowing = MPesewaBorrowing;
    }
});