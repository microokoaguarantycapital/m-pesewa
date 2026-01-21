// assets/js/lending.js
// Lending functionality

const MPesewaLending = (function() {
    'use strict';

    // Lending data structure
    const loanRequestTemplate = {
        id: '',
        borrowerId: '',
        groupId: '',
        category: '',
        amount: 0,
        tenure: 7, // days
        interestRate: 10,
        penaltyRate: 5,
        requestedDate: '',
        status: 'pending', // pending, funded, rejected, expired
        lenderId: null,
        fundedDate: null,
        notes: ''
    };

    // Loan categories
    const loanCategories = [
        { id: 'fare', name: 'M-pesewa Fare', icon: '🚌', maxAmount: 5000 },
        { id: 'food', name: 'M-pesewa Food', icon: '🍲', maxAmount: 10000 },
        { id: 'gas', name: 'M-pesewa Cooking Gas', icon: '🔥', maxAmount: 8000 },
        { id: 'data', name: 'M-pesewa Data', icon: '📶', maxAmount: 2000 },
        { id: 'fuel', name: 'M-pesewa Fuel', icon: '⛽', maxAmount: 10000 },
        { id: 'medicine', name: 'M-pesewa Medicine', icon: '💊', maxAmount: 15000 },
        { id: 'electricity', name: 'M-pesewa Electricity', icon: '⚡', maxAmount: 5000 },
        { id: 'school', name: 'M-pesewa School Fees', icon: '🎓', maxAmount: 50000 },
        { id: 'advance', name: 'M-pesewa Advance', icon: '💸', maxAmount: 30000 },
        { id: 'repair', name: 'M-pesewa Repair', icon: '🛠️', maxAmount: 20000 }
    ];

    // Initialize loan requests
    function initLoanRequests() {
        let requests = JSON.parse(localStorage.getItem('mpesewa_loan_requests')) || [];
        
        // Load demo data if empty
        if (requests.length === 0) {
            fetch('../data/demo-loan-requests.json')
                .then(response => response.json())
                .then(data => {
                    localStorage.setItem('mpesewa_loan_requests', JSON.stringify(data.requests));
                    requests = data.requests;
                })
                .catch(() => {
                    requests = createDemoRequests();
                });
        }
        
        return requests;
    }

    // Create demo loan requests
    function createDemoRequests() {
        const demoRequests = [
            {
                id: 'REQ001',
                borrowerId: 'USR003',
                groupId: 'GRP001',
                category: 'food',
                amount: 2000,
                tenure: 7,
                interestRate: 10,
                penaltyRate: 5,
                requestedDate: new Date().toISOString(),
                status: 'pending',
                lenderId: null,
                fundedDate: null,
                notes: 'Need food for family this week'
            },
            {
                id: 'REQ002',
                borrowerId: 'USR004',
                groupId: 'GRP001',
                category: 'medicine',
                amount: 5000,
                tenure: 7,
                interestRate: 10,
                penaltyRate: 5,
                requestedDate: new Date(Date.now() - 86400000).toISOString(),
                status: 'pending',
                lenderId: null,
                fundedDate: null,
                notes: 'Medical emergency, need medicine'
            },
            {
                id: 'REQ003',
                borrowerId: 'USR009',
                groupId: 'GRP002',
                category: 'fuel',
                amount: 3000,
                tenure: 7,
                interestRate: 10,
                penaltyRate: 5,
                requestedDate: new Date(Date.now() - 172800000).toISOString(),
                status: 'pending',
                lenderId: null,
                fundedDate: null,
                notes: 'Need fuel for business delivery'
            }
        ];
        
        localStorage.setItem('mpesewa_loan_requests', JSON.stringify(demoRequests));
        return demoRequests;
    }

    // Get loan requests for lender's groups
    function getLenderRequests(lenderId) {
        const requests = initLoanRequests();
        const currentUser = JSON.parse(localStorage.getItem('mpesewa_currentUser'));
        
        if (!currentUser) return [];
        
        // Get lender's groups
        const userGroups = JSON.parse(localStorage.getItem('mpesewa_user_groups')) || [];
        const lenderGroups = userGroups.filter(g => g.lenders.includes(lenderId));
        const lenderGroupIds = lenderGroups.map(g => g.id);
        
        // Filter requests from lender's groups
        return requests.filter(request => 
            lenderGroupIds.includes(request.groupId) &&
            request.status === 'pending' &&
            request.borrowerId !== lenderId // Can't lend to yourself
        );
    }

    // Get loan request by ID
    function getRequestById(requestId) {
        const requests = initLoanRequests();
        return requests.find(req => req.id === requestId);
    }

    // Fund a loan request (create ledger)
    function fundLoanRequest(requestId, lenderId) {
        const requests = initLoanRequests();
        const requestIndex = requests.findIndex(req => req.id === requestId);
        
        if (requestIndex === -1) {
            return { success: false, message: 'Loan request not found' };
        }
        
        const request = requests[requestIndex];
        
        // Check if request is already funded
        if (request.status === 'funded') {
            return { success: false, message: 'This loan has already been funded' };
        }
        
        // Check lender subscription status
        const lender = JSON.parse(localStorage.getItem('mpesewa_currentUser'));
        if (!lender || !lender.subscription || lender.subscription.status !== 'active') {
            return { success: false, message: 'Active subscription required to lend' };
        }
        
        // Check if lender has reached subscription limit
        const lenderLedgers = JSON.parse(localStorage.getItem('mpesewa_ledgers')) || [];
        const activeLedgers = lenderLedgers.filter(ledger => 
            ledger.lenderId === lenderId && 
            ledger.status === 'active'
        );
        
        const subscriptionTier = lender.subscription.tier;
        const tierLimits = {
            'basic': 5,
            'premium': 20,
            'super': 50,
            'lol': 99999
        };
        
        if (activeLedgers.length >= tierLimits[subscriptionTier]) {
            return { 
                success: false, 
                message: `Subscription limit reached. ${subscriptionTier} tier allows maximum ${tierLimits[subscriptionTier]} active loans.` 
            };
        }
        
        // Check if borrower has active loan in same group
        const existingLoans = lenderLedgers.filter(ledger => 
            ledger.borrowerId === request.borrowerId &&
            ledger.groupId === request.groupId &&
            ledger.status === 'active'
        );
        
        if (existingLoans.length > 0) {
            return { 
                success: false, 
                message: 'Borrower already has an active loan in this group' 
            };
        }
        
        // Update request status
        request.status = 'funded';
        request.lenderId = lenderId;
        request.fundedDate = new Date().toISOString();
        requests[requestIndex] = request;
        localStorage.setItem('mpesewa_loan_requests', JSON.stringify(requests));
        
        // Create ledger entry
        createLedgerFromRequest(request, lenderId);
        
        // Update group stats
        if (typeof MPesewa !== 'undefined' && MPesewa.Groups) {
            MPesewa.Groups.updateGroupStats(request.groupId, request.amount, false);
        }
        
        return { 
            success: true, 
            message: 'Loan funded successfully! Ledger created.',
            request: request
        };
    }

    // Create ledger from funded request
    function createLedgerFromRequest(request, lenderId) {
        const ledgers = JSON.parse(localStorage.getItem('mpesewa_ledgers')) || [];
        
        const ledgerId = 'LED' + String(ledgers.length + 1).padStart(3, '0');
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + request.tenure);
        
        const newLedger = {
            id: ledgerId,
            requestId: request.id,
            borrowerId: request.borrowerId,
            lenderId: lenderId,
            groupId: request.groupId,
            category: request.category,
            principal: request.amount,
            interestRate: request.interestRate,
            penaltyRate: request.penaltyRate,
            fundedDate: new Date().toISOString(),
            dueDate: dueDate.toISOString(),
            status: 'active',
            totalDue: request.amount * (1 + request.interestRate/100),
            amountPaid: 0,
            balance: request.amount * (1 + request.interestRate/100),
            payments: [],
            notes: request.notes
        };
        
        ledgers.push(newLedger);
        localStorage.setItem('mpesewa_ledgers', JSON.stringify(ledgers));
        
        return newLedger;
    }

    // Reject loan request
    function rejectLoanRequest(requestId, lenderId, reason) {
        const requests = initLoanRequests();
        const requestIndex = requests.findIndex(req => req.id === requestId);
        
        if (requestIndex === -1) {
            return { success: false, message: 'Loan request not found' };
        }
        
        requests[requestIndex].status = 'rejected';
        requests[requestIndex].rejectionReason = reason;
        requests[requestIndex].rejectedBy = lenderId;
        requests[requestIndex].rejectedDate = new Date().toISOString();
        
        localStorage.setItem('mpesewa_loan_requests', JSON.stringify(requests));
        
        return { 
            success: true, 
            message: 'Loan request rejected',
            request: requests[requestIndex]
        };
    }

    // Filter loan requests
    function filterRequests(requests, filters) {
        return requests.filter(request => {
            // Category filter
            if (filters.category && filters.category !== 'all' && request.category !== filters.category) {
                return false;
            }
            
            // Amount filter
            if (filters.minAmount && request.amount < filters.minAmount) {
                return false;
            }
            if (filters.maxAmount && request.amount > filters.maxAmount) {
                return false;
            }
            
            // Days filter
            if (filters.maxDays) {
                const requestDate = new Date(request.requestedDate);
                const daysOld = Math.floor((new Date() - requestDate) / (1000 * 60 * 60 * 24));
                if (daysOld > filters.maxDays) {
                    return false;
                }
            }
            
            // Borrower rating filter
            if (filters.minRating) {
                const borrower = getBorrowerDetails(request.borrowerId);
                if (borrower.rating < filters.minRating) {
                    return false;
                }
            }
            
            return true;
        });
    }

    // Get borrower details
    function getBorrowerDetails(borrowerId) {
        const users = JSON.parse(localStorage.getItem('mpesewa_users')) || [];
        const borrower = users.find(user => user.id === borrowerId);
        
        if (!borrower) {
            return {
                name: 'Unknown User',
                rating: 3,
                groups: [],
                blacklisted: false
            };
        }
        
        // Calculate rating from ledger history
        const ledgers = JSON.parse(localStorage.getItem('mpesewa_ledgers')) || [];
        const borrowerLedgers = ledgers.filter(ledger => ledger.borrowerId === borrowerId);
        
        let rating = 5; // Default rating
        
        if (borrowerLedgers.length > 0) {
            const repaidLedgers = borrowerLedgers.filter(l => l.status === 'cleared').length;
            const defaultedLedgers = borrowerLedgers.filter(l => l.status === 'defaulted').length;
            const totalLedgers = borrowerLedgers.length;
            
            // Simple rating calculation
            const repaymentRate = repaidLedgers / totalLedgers;
            rating = Math.max(1, Math.min(5, Math.round(repaymentRate * 5)));
        }
        
        return {
            name: borrower.name || 'User ' + borrowerId,
            rating: rating,
            groups: borrower.groups || [],
            blacklisted: borrower.blacklisted || false
        };
    }

    // Get loan category details
    function getCategoryDetails(categoryId) {
        return loanCategories.find(cat => cat.id === categoryId) || loanCategories[0];
    }

    // Calculate loan details
    function calculateLoanDetails(amount, tenure, interestRate) {
        const interest = (amount * interestRate) / 100;
        const totalDue = amount + interest;
        
        return {
            principal: amount,
            interest: interest,
            totalDue: totalDue,
            dailyPayment: totalDue / tenure,
            penaltyPerDay: (totalDue * 5) / 100 // 5% of total due per day
        };
    }

    // Render loan requests to HTML
    function renderLoanRequests(requests, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        container.innerHTML = '';
        
        if (!requests || requests.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">💰</div>
                    <h3 class="empty-title">No Loan Requests</h3>
                    <p class="empty-description">No pending loan requests in your groups at the moment.</p>
                </div>
            `;
            return;
        }
        
        requests.forEach(request => {
            const borrower = getBorrowerDetails(request.borrowerId);
            const category = getCategoryDetails(request.category);
            const group = MPesewa.Groups ? MPesewa.Groups.getGroupById(request.groupId) : null;
            const loanDetails = calculateLoanDetails(request.amount, request.tenure, request.interestRate);
            
            const requestCard = document.createElement('div');
            requestCard.className = 'loan-request-card';
            requestCard.innerHTML = `
                <div class="request-header">
                    <div class="borrower-info">
                        <div class="borrower-avatar">
                            ${borrower.name.charAt(0)}
                        </div>
                        <div class="borrower-details">
                            <h4 class="borrower-name">${borrower.name}</h4>
                            <div class="borrower-rating">
                                ${renderStars(borrower.rating)}
                                <span class="rating-value">${borrower.rating.toFixed(1)}</span>
                            </div>
                        </div>
                    </div>
                    <div class="request-meta">
                        <span class="badge ${borrower.blacklisted ? 'badge-error' : 'badge-success'}">
                            ${borrower.blacklisted ? 'Blacklisted' : 'Good Standing'}
                        </span>
                        <span class="request-date">${formatDate(request.requestedDate)}</span>
                    </div>
                </div>
                
                <div class="request-body">
                    <div class="loan-category">
                        <span class="category-icon">${category.icon}</span>
                        <span class="category-name">${category.name}</span>
                    </div>
                    
                    <div class="loan-details">
                        <div class="detail-row">
                            <span class="detail-label">Amount:</span>
                            <span class="detail-value">Ksh ${request.amount.toLocaleString()}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Duration:</span>
                            <span class="detail-value">${request.tenure} days</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Interest:</span>
                            <span class="detail-value">${request.interestRate}%</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Total Due:</span>
                            <span class="detail-value">Ksh ${loanDetails.totalDue.toLocaleString()}</span>
                        </div>
                    </div>
                    
                    <div class="group-info">
                        <span class="group-name">${group ? group.name : 'Unknown Group'}</span>
                        <span class="group-members">${group ? group.members.length : 0} members</span>
                    </div>
                    
                    ${request.notes ? `
                    <div class="loan-notes">
                        <strong>Notes:</strong> ${request.notes}
                    </div>
                    ` : ''}
                </div>
                
                <div class="request-footer">
                    <div class="risk-indicator">
                        <span class="risk-label">Risk Level:</span>
                        <span class="risk-value ${getRiskLevel(borrower.rating, request.amount)}">
                            ${getRiskLevel(borrower.rating, request.amount).toUpperCase()}
                        </span>
                    </div>
                    <div class="request-actions">
                        <button class="btn outline reject-btn" data-request-id="${request.id}">
                            Reject
                        </button>
                        <button class="btn primary fund-btn" data-request-id="${request.id}">
                            Fund Loan
                        </button>
                    </div>
                </div>
            `;
            
            container.appendChild(requestCard);
        });
        
        // Add event listeners
        container.querySelectorAll('.fund-btn').forEach(button => {
            button.addEventListener('click', function() {
                const requestId = this.getAttribute('data-request-id');
                fundRequest(requestId);
            });
        });
        
        container.querySelectorAll('.reject-btn').forEach(button => {
            button.addEventListener('click', function() {
                const requestId = this.getAttribute('data-request-id');
                rejectRequest(requestId);
            });
        });
    }

    // UI event handlers
    function fundRequest(requestId) {
        const currentUser = JSON.parse(localStorage.getItem('mpesewa_currentUser'));
        if (!currentUser) {
            alert('Please login to fund a loan');
            return;
        }
        
        const result = fundLoanRequest(requestId, currentUser.id);
        alert(result.message);
        
        if (result.success) {
            // Refresh the UI
            const lenderRequests = getLenderRequests(currentUser.id);
            renderLoanRequests(lenderRequests, 'loanRequestsContainer');
        }
    }

    function rejectRequest(requestId) {
        const reason = prompt('Enter reason for rejecting this loan request:');
        if (!reason) return;
        
        const currentUser = JSON.parse(localStorage.getItem('mpesewa_currentUser'));
        if (!currentUser) {
            alert('Please login to reject a loan request');
            return;
        }
        
        const result = rejectLoanRequest(requestId, currentUser.id, reason);
        alert(result.message);
        
        if (result.success) {
            // Refresh the UI
            const lenderRequests = getLenderRequests(currentUser.id);
            renderLoanRequests(lenderRequests, 'loanRequestsContainer');
        }
    }

    // Helper functions
    function renderStars(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars += '<span class="star filled">★</span>';
            } else {
                stars += '<span class="star">☆</span>';
            }
        }
        return stars;
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }

    function getRiskLevel(rating, amount) {
        if (rating >= 4.5) return 'low';
        if (rating >= 3.5) return 'medium';
        if (rating >= 2.5) return 'high';
        return 'very-high';
    }

    // Public API
    return {
        init: initLoanRequests,
        getLenderRequests,
        getRequestById,
        fundLoanRequest,
        rejectLoanRequest,
        filterRequests,
        getBorrowerDetails,
        getCategoryDetails,
        calculateLoanDetails,
        renderLoanRequests,
        getLoanCategories: () => loanCategories
    };
})();

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    if (typeof MPesewa !== 'undefined') {
        MPesewa.Lending = MPesewaLending;
    }
});