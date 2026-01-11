'use strict';

class BorrowingManager {
    constructor() {
        this.currentBorrower = null;
        this.availableCategories = [];
        this.myLoans = [];
        this.loanCart = [];
        this.maxGroups = 4;
        this.loadBorrowerData();
    }

    async loadBorrowerData() {
        try {
            const userData = JSON.parse(localStorage.getItem('mpesewa_user') || '{}');
            this.currentBorrower = userData.id;
            
            const categoriesResponse = await fetch('../data/categories.json');
            this.availableCategories = await categoriesResponse.json();
            
            const loansResponse = await fetch('../data/demo-ledgers.json');
            const allLoans = await loansResponse.json();
            
            this.myLoans = allLoans.filter(loan => 
                loan.borrower_id === this.currentBorrower
            );
            
            this.loanCart = JSON.parse(localStorage.getItem(`mpesewa_cart_${this.currentBorrower}`)) || [];
            
            this.updateBorrowerDashboard();
            this.renderCategories();
            this.renderLoanCart();
        } catch (error) {
            console.error('Error loading borrowing data:', error);
            this.availableCategories = [];
            this.myLoans = [];
            this.loanCart = [];
        }
    }

    updateBorrowerDashboard() {
        const dashboardStats = this.calculateDashboardStats();
        this.renderDashboardStats(dashboardStats);
        this.renderActiveLoans();
        this.updateBorrowerStatus();
    }

    calculateDashboardStats() {
        const activeLoans = this.myLoans.filter(loan => loan.status === 'active');
        const overdueLoans = activeLoans.filter(loan => this.isOverdue(loan.due_date));
        const clearedLoans = this.myLoans.filter(loan => loan.status === 'cleared');
        
        const totalBorrowed = this.myLoans.reduce((sum, loan) => sum + loan.amount, 0);
        const totalActive = activeLoans.reduce((sum, loan) => sum + loan.amount, 0);
        const totalOverdue = overdueLoans.reduce((sum, loan) => {
            const overdueDays = Math.max(0, this.calculateOverdueDays(loan.due_date));
            const penalty = this.calculatePenalty(loan.amount, overdueDays);
            return sum + loan.amount + penalty;
        }, 0);
        
        const userData = JSON.parse(localStorage.getItem('mpesewa_user') || '{}');
        const groups = userData.groups || [];
        
        const rating = this.getBorrowerRating();
        const isBlacklisted = this.isBorrowerBlacklisted();

        return {
            active_loans: activeLoans.length,
            total_active_amount: totalActive,
            overdue_loans: overdueLoans.length,
            total_overdue_amount: totalOverdue,
            cleared_loans: clearedLoans.length,
            total_borrowed: totalBorrowed,
            current_groups: groups.length,
            max_groups: this.maxGroups,
            borrower_rating: rating,
            is_blacklisted: isBlacklisted,
            can_borrow_more: groups.length > 0 && !isBlacklisted && activeLoans.length < groups.length
        };
    }

    renderDashboardStats(stats) {
        const statsContainer = document.getElementById('borrower-stats');
        if (!statsContainer) return;

        statsContainer.innerHTML = `
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon ${stats.active_loans > 0 ? 'stat-icon-warning' : 'stat-icon-success'}">
                        <i class="fas fa-file-invoice-dollar"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-value">${stats.active_loans}</div>
                        <div class="stat-label">Active Loans</div>
                        ${stats.active_loans > 0 ? 
                            `<div class="stat-trend">
                                <span class="${stats.total_active_amount > 0 ? 'trend-up' : 'trend-down'}">
                                    ${this.formatCurrency(stats.total_active_amount)}
                                </span>
                            </div>` : ''
                        }
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon ${stats.overdue_loans > 0 ? 'stat-icon-danger' : 'stat-icon-success'}">
                        <i class="fas fa-clock"></i>
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
                
                <div class="stat-card">
                    <div class="stat-icon stat-icon-primary">
                        <i class="fas fa-users"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-value">${stats.current_groups}/${stats.max_groups}</div>
                        <div class="stat-label">Active Groups</div>
                        ${stats.current_groups >= stats.max_groups ? 
                            `<div class="stat-trend">
                                <span class="trend-down">Max reached</span>
                            </div>` :
                            stats.current_groups === 0 ?
                            `<div class="stat-trend">
                                <span class="trend-down">Join a group to borrow</span>
                            </div>` : ''
                        }
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon stat-icon-success">
                        <i class="fas fa-star"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-value">${stats.borrower_rating.toFixed(1)}</div>
                        <div class="stat-label">Borrower Rating</div>
                        <div class="rating-stars-small">
                            ${this.renderStars(stats.borrower_rating)}
                        </div>
                    </div>
                </div>
            </div>
            
            ${stats.is_blacklisted ? 
                `<div class="alert alert-danger">
                    <div class="alert-icon">
                        <i class="fas fa-ban"></i>
                    </div>
                    <div class="alert-content">
                        <div class="alert-title">Account Blacklisted</div>
                        <p>You are currently blacklisted and cannot borrow or join new groups. Contact platform admin for assistance.</p>
                    </div>
                </div>` : ''
            }
            
            ${!stats.can_borrow_more && !stats.is_blacklisted ? 
                `<div class="alert alert-warning">
                    <div class="alert-icon">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <div class="alert-content">
                        <div class="alert-title">Borrowing Limited</div>
                        <p>${stats.current_groups === 0 ? 'You need to join a group to borrow.' : 'You have reached your borrowing limit for your current groups.'}</p>
                    </div>
                </div>` : ''
            }
        `;
    }

    renderCategories() {
        const container = document.getElementById('loan-categories');
        if (!container) return;

        container.innerHTML = '';
        
        this.availableCategories.forEach(category => {
            const isInCart = this.loanCart.some(item => item.category_id === category.id);
            const canAdd = this.canAddToCart(category.id);
            
            const card = document.createElement('div');
            card.className = `category-card floating-card ${isInCart ? 'in-cart' : ''} ${!canAdd ? 'disabled' : ''}`;
            card.innerHTML = `
                <div class="category-icon">
                    <i class="${category.icon || 'fas fa-question-circle'}"></i>
                </div>
                <h4 class="category-name">${category.name}</h4>
                <p class="category-tagline">${category.tagline}</p>
                <div class="category-description">
                    ${category.description || 'Emergency loan category'}
                </div>
                
                <div class="category-actions">
                    ${isInCart ? 
                        `<button class="btn btn-success btn-sm" disabled>
                            <i class="fas fa-check"></i> In Cart
                        </button>` : 
                        `<button class="btn btn-primary btn-sm add-to-cart-btn" 
                                data-category-id="${category.id}"
                                ${!canAdd ? 'disabled' : ''}>
                            <i class="fas fa-cart-plus"></i> Add to Cart
                        </button>`
                    }
                    <button class="btn btn-outline btn-sm view-details-btn" data-category-id="${category.id}">
                        <i class="fas fa-info-circle"></i> Details
                    </button>
                </div>
            `;
            
            container.appendChild(card);
            
            card.querySelector('.add-to-cart-btn')?.addEventListener('click', (e) => {
                this.addToCart(category);
            });
            
            card.querySelector('.view-details-btn')?.addEventListener('click', (e) => {
                this.viewCategoryDetails(category);
            });
        });
    }

    renderLoanCart() {
        const container = document.getElementById('loan-cart');
        const cartCount = document.getElementById('cart-count');
        
        if (cartCount) {
            cartCount.textContent = this.loanCart.length;
            cartCount.style.display = this.loanCart.length > 0 ? 'inline-block' : 'none';
        }
        
        if (!container) return;
        
        if (this.loanCart.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">🛒</div>
                    <h3>Your Cart is Empty</h3>
                    <p>Add loan categories from the list above to request loans.</p>
                    <p>Each category you add will be visible to lenders in your group.</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = `
            <div class="section-header">
                <h3 class="section-title">Loan Cart (${this.loanCart.length} items)</h3>
                <div class="section-actions">
                    <button class="btn btn-outline" id="clear-cart">
                        <i class="fas fa-trash"></i> Clear All
                    </button>
                    <button class="btn btn-primary" id="submit-requests" ${!this.canSubmitRequests() ? 'disabled' : ''}>
                        <i class="fas fa-paper-plane"></i> Submit Requests
                    </button>
                </div>
            </div>
            
            <div class="cart-items" id="cart-items-list"></div>
        `;
        
        const listContainer = document.getElementById('cart-items-list');
        this.loanCart.forEach((item, index) => {
            this.renderCartItem(item, index, listContainer);
        });
        
        document.getElementById('clear-cart')?.addEventListener('click', () => {
            this.clearCart();
        });
        
        document.getElementById('submit-requests')?.addEventListener('click', () => {
            this.submitLoanRequests();
        });
    }

    renderCartItem(item, index, container) {
        const category = this.availableCategories.find(cat => cat.id === item.category_id);
        if (!category) return;
        
        const card = document.createElement('div');
        card.className = 'cart-item card';
        card.innerHTML = `
            <div class="cart-item-header">
                <div class="cart-item-info">
                    <div class="cart-item-icon">
                        <i class="${category.icon || 'fas fa-question-circle'}"></i>
                    </div>
                    <div>
                        <h4 class="cart-item-title">${category.name}</h4>
                        <p class="cart-item-subtitle">${category.tagline}</p>
                    </div>
                </div>
                <button class="btn-icon btn-remove" data-index="${index}" title="Remove from cart">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="cart-item-body">
                <div class="form-group">
                    <label for="amount-${index}" class="form-label">Loan Amount</label>
                    <div class="input-group">
                        <span class="input-group-prepend">${this.getCurrencySymbol()}</span>
                        <input type="number" 
                               id="amount-${index}" 
                               class="form-control loan-amount" 
                               min="5" 
                               max="1000000" 
                               value="${item.amount || 500}"
                               data-index="${index}"
                               placeholder="Enter amount">
                    </div>
                    <div class="form-hint">Minimum: ${this.formatCurrency(5)}</div>
                </div>
                
                <div class="form-group">
                    <label for="purpose-${index}" class="form-label">Purpose (Optional)</label>
                    <textarea id="purpose-${index}" 
                              class="form-control loan-purpose" 
                              data-index="${index}"
                              placeholder="Briefly describe what you need the loan for..."
                              rows="2">${item.purpose || ''}</textarea>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Repayment Period</label>
                    <div class="btn-group">
                        <button type="button" class="btn ${item.days === 7 ? 'btn-primary' : 'btn-outline'} days-btn" data-days="7" data-index="${index}">
                            7 days
                        </button>
                        <button type="button" class="btn ${item.days === 14 ? 'btn-primary' : 'btn-outline'} days-btn" data-days="14" data-index="${index}">
                            14 days
                        </button>
                        <button type="button" class="btn ${item.days === 30 ? 'btn-primary' : 'btn-outline'} days-btn" data-days="30" data-index="${index}">
                            30 days
                        </button>
                    </div>
                    <div class="form-hint">Standard interest: 10% per week</div>
                </div>
                
                <div class="loan-summary">
                    <div class="summary-row">
                        <span class="summary-label">Principal:</span>
                        <span class="summary-value" id="principal-${index}">${this.formatCurrency(item.amount || 500)}</span>
                    </div>
                    <div class="summary-row">
                        <span class="summary-label">Interest (${item.days || 7} days):</span>
                        <span class="summary-value" id="interest-${index}">${this.formatCurrency(this.calculateInterest(item.amount || 500, item.days || 7))}</span>
                    </div>
                    <div class="summary-row total">
                        <span class="summary-label">Total Repayment:</span>
                        <span class="summary-value" id="total-${index}">${this.formatCurrency((item.amount || 500) + this.calculateInterest(item.amount || 500, item.days || 7))}</span>
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Select Group for this Request</label>
                    <select class="form-control group-select" data-index="${index}" id="group-${index}">
                        <option value="">Select a group</option>
                    </select>
                </div>
            </div>
        `;
        
        container.appendChild(card);
        
        const userData = JSON.parse(localStorage.getItem('mpesewa_user') || '{}');
        const groups = userData.groups || [];
        const groupSelect = card.querySelector(`#group-${index}`);
        
        groups.forEach(groupId => {
            const group = this.getGroupById(groupId);
            if (group) {
                const option = document.createElement('option');
                option.value = groupId;
                option.textContent = group.name;
                if (item.group_id === groupId) {
                    option.selected = true;
                }
                groupSelect.appendChild(option);
            }
        });
        
        card.querySelector('.btn-remove').addEventListener('click', (e) => {
            this.removeFromCart(index);
        });
        
        const amountInput = card.querySelector('.loan-amount');
        const purposeInput = card.querySelector('.loan-purpose');
        const daysButtons = card.querySelectorAll('.days-btn');
        const groupSelectElement = card.querySelector('.group-select');
        
        const updateItem = () => {
            const amount = parseFloat(amountInput.value) || 500;
            const purpose = purposeInput.value;
            const days = item.days || 7;
            const groupId = groupSelectElement.value;
            
            this.loanCart[index] = {
                ...this.loanCart[index],
                amount: amount,
                purpose: purpose,
                days: days,
                group_id: groupId
            };
            
            this.updateCartSummary(index, amount, days);
            this.saveCart();
        };
        
        amountInput.addEventListener('input', updateItem);
        purposeInput.addEventListener('input', updateItem);
        groupSelectElement.addEventListener('change', updateItem);
        
        daysButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const days = parseInt(e.target.dataset.days);
                this.loanCart[index].days = days;
                
                daysButtons.forEach(btn => {
                    btn.classList.remove('btn-primary');
                    btn.classList.add('btn-outline');
                });
                e.target.classList.remove('btn-outline');
                e.target.classList.add('btn-primary');
                
                updateItem();
            });
        });
        
        this.updateCartSummary(index, item.amount || 500, item.days || 7);
    }

    updateCartSummary(index, amount, days) {
        const interest = this.calculateInterest(amount, days);
        const total = amount + interest;
        
        const principalEl = document.getElementById(`principal-${index}`);
        const interestEl = document.getElementById(`interest-${index}`);
        const totalEl = document.getElementById(`total-${index}`);
        
        if (principalEl) principalEl.textContent = this.formatCurrency(amount);
        if (interestEl) interestEl.textContent = this.formatCurrency(interest);
        if (totalEl) totalEl.textContent = this.formatCurrency(total);
    }

    renderActiveLoans() {
        const container = document.getElementById('active-loans');
        if (!container) return;

        const activeLoans = this.myLoans.filter(loan => loan.status === 'active');
        
        if (activeLoans.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📄</div>
                    <h3>No Active Loans</h3>
                    <p>You don't have any active loans at the moment.</p>
                    <p>Submit loan requests from the categories above.</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = `
            <div class="section-header">
                <h3 class="section-title">Active Loans (${activeLoans.length})</h3>
            </div>
            <div class="loans-list" id="loans-list-container"></div>
        `;
        
        const listContainer = document.getElementById('loans-list-container');
        activeLoans.forEach(loan => {
            this.renderLoanCard(loan, listContainer);
        });
    }

    renderLoanCard(loan, container) {
        const card = document.createElement('div');
        card.className = 'loan-card card';
        
        const overdueDays = this.calculateOverdueDays(loan.due_date);
        const isOverdue = overdueDays > 0;
        const totalDue = loan.amount + this.calculateInterest(loan.amount, overdueDays > 0 ? 7 + overdueDays : 7);
        const penalty = isOverdue ? this.calculatePenalty(loan.amount, overdueDays) : 0;
        
        card.innerHTML = `
            <div class="loan-header">
                <div class="loan-category">
                    <i class="fas ${this.getCategoryIcon(loan.category)}"></i>
                    <span>${loan.category}</span>
                </div>
                <div class="loan-status ${isOverdue ? 'status-overdue' : 'status-active'}">
                    ${isOverdue ? 'OVERDUE' : 'ACTIVE'}
                </div>
            </div>
            
            <div class="loan-body">
                <div class="loan-details">
                    <div class="detail-row">
                        <span class="detail-label">Amount:</span>
                        <span class="detail-value">${this.formatCurrency(loan.amount)}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Lender:</span>
                        <span class="detail-value">${loan.lender_name || 'Unknown Lender'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Date Lent:</span>
                        <span class="detail-value">${this.formatDate(loan.loan_date)}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Due Date:</span>
                        <span class="detail-value ${isOverdue ? 'text-danger' : ''}">
                            ${this.formatDate(loan.due_date)}
                            ${isOverdue ? `(${overdueDays} days overdue)` : ''}
                        </span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Interest:</span>
                        <span class="detail-value">${this.formatCurrency(this.calculateInterest(loan.amount, 7))}</span>
                    </div>
                    ${isOverdue ? `
                        <div class="detail-row">
                            <span class="detail-label">Penalty:</span>
                            <span class="detail-value text-danger">${this.formatCurrency(penalty)}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Total Due:</span>
                            <span class="detail-value text-danger">${this.formatCurrency(totalDue)}</span>
                        </div>
                    ` : ''}
                </div>
                
                <div class="repayment-progress">
                    <div class="progress-header">
                        <span class="progress-label">Repayment Progress</span>
                        <span class="progress-value">${loan.repayment_history?.length || 0} payment(s)</span>
                    </div>
                    <div class="progress">
                        <div class="progress-bar" style="width: ${this.calculateRepaymentProgress(loan)}%"></div>
                    </div>
                </div>
                
                ${loan.repayment_history && loan.repayment_history.length > 0 ? `
                    <div class="repayment-history">
                        <strong>Recent Payments:</strong>
                        <div class="history-list">
                            ${loan.repayment_history.slice(-3).map(payment => `
                                <div class="history-item">
                                    <span class="history-date">${this.formatDate(payment.date)}</span>
                                    <span class="history-amount">${this.formatCurrency(payment.amount)}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
            
            <div class="loan-footer">
                <div class="loan-actions">
                    <button class="btn btn-primary btn-sm repay-btn" data-loan-id="${loan.id}">
                        <i class="fas fa-money-check-alt"></i> Make Payment
                    </button>
                    <button class="btn btn-outline btn-sm details-btn" data-loan-id="${loan.id}">
                        <i class="fas fa-file-invoice"></i> View Details
                    </button>
                </div>
            </div>
        `;
        
        container.appendChild(card);
        
        card.querySelector('.repay-btn').addEventListener('click', (e) => {
            this.initiateRepayment(loan);
        });
        
        card.querySelector('.details-btn').addEventListener('click', (e) => {
            this.viewLoanDetails(loan.id);
        });
    }

    updateBorrowerStatus() {
        const statusContainer = document.getElementById('borrower-status');
        if (!statusContainer) return;
        
        const userData = JSON.parse(localStorage.getItem('mpesewa_user') || '{}');
        const groups = userData.groups || [];
        const rating = this.getBorrowerRating();
        const isBlacklisted = this.isBorrowerBlacklisted();
        
        statusContainer.innerHTML = `
            <div class="borrower-profile-card card">
                <div class="profile-header">
                    <div class="profile-avatar">
                        ${userData.name?.charAt(0) || 'B'}
                    </div>
                    <div class="profile-info">
                        <h4 class="profile-name">${userData.name || 'Borrower'}</h4>
                        <div class="profile-rating">
                            <div class="rating-stars">
                                ${this.renderStars(rating)}
                            </div>
                            <span class="rating-number">${rating.toFixed(1)}/5.0</span>
                        </div>
                    </div>
                </div>
                
                <div class="profile-details">
                    <div class="detail-item">
                        <span class="detail-label">Country:</span>
                        <span class="detail-value">${userData.country || 'KE'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Active Groups:</span>
                        <span class="detail-value">${groups.length}/4</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Status:</span>
                        <span class="detail-value ${isBlacklisted ? 'text-danger' : 'text-success'}">
                            ${isBlacklisted ? 'Blacklisted' : 'Active'}
                        </span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Member Since:</span>
                        <span class="detail-value">${this.formatDate(userData.created_at || new Date())}</span>
                    </div>
                </div>
                
                <div class="profile-actions">
                    <button class="btn btn-outline btn-sm" id="edit-profile">
                        <i class="fas fa-edit"></i> Edit Profile
                    </button>
                    <button class="btn btn-outline btn-sm" id="view-groups">
                        <i class="fas fa-users"></i> My Groups
                    </button>
                </div>
            </div>
        `;
        
        document.getElementById('edit-profile').addEventListener('click', () => {
            window.location.href = 'profile.html';
        });
        
        document.getElementById('view-groups').addEventListener('click', () => {
            window.location.href = 'groups.html?my=true';
        });
    }

    addToCart(category) {
        if (!this.canAddToCart(category.id)) {
            alert('You cannot add more items to your cart. Check your active loans or blacklist status.');
            return;
        }
        
        const existingIndex = this.loanCart.findIndex(item => item.category_id === category.id);
        
        if (existingIndex >= 0) {
            alert('This category is already in your cart.');
            return;
        }
        
        const userData = JSON.parse(localStorage.getItem('mpesewa_user') || {});
        const groups = userData.groups || [];
        
        if (groups.length === 0) {
            alert('You need to join a group before you can request loans.');
            window.location.href = 'groups.html';
            return;
        }
        
        const cartItem = {
            category_id: category.id,
            category_name: category.name,
            category_icon: category.icon,
            amount: 500,
            purpose: '',
            days: 7,
            group_id: groups[0],
            created_at: new Date().toISOString()
        };
        
        this.loanCart.push(cartItem);
        this.saveCart();
        this.renderCategories();
        this.renderLoanCart();
        
        const cartNotification = document.getElementById('cart-notification');
        if (cartNotification) {
            cartNotification.textContent = 'Added to cart!';
            cartNotification.style.display = 'block';
            setTimeout(() => {
                cartNotification.style.display = 'none';
            }, 2000);
        }
    }

    removeFromCart(index) {
        if (index >= 0 && index < this.loanCart.length) {
            this.loanCart.splice(index, 1);
            this.saveCart();
            this.renderCategories();
            this.renderLoanCart();
        }
    }

    clearCart() {
        if (this.loanCart.length === 0) return;
        
        const confirmed = confirm('Are you sure you want to clear your cart?');
        if (confirmed) {
            this.loanCart = [];
            this.saveCart();
            this.renderCategories();
            this.renderLoanCart();
        }
    }

    canAddToCart(categoryId) {
        if (this.isBorrowerBlacklisted()) {
            return false;
        }
        
        const userData = JSON.parse(localStorage.getItem('mpesewa_user') || {});
        const groups = userData.groups || [];
        
        if (groups.length === 0) {
            return false;
        }
        
        const activeLoans = this.myLoans.filter(loan => loan.status === 'active');
        if (activeLoans.length >= groups.length) {
            return false;
        }
        
        const existingInCart = this.loanCart.some(item => item.category_id === categoryId);
        if (existingInCart) {
            return false;
        }
        
        const existingActiveLoan = this.myLoans.some(loan => 
            loan.status === 'active' && 
            loan.category === categoryId &&
            groups.includes(loan.group_id)
        );
        
        if (existingActiveLoan) {
            return false;
        }
        
        return true;
    }

    canSubmitRequests() {
        if (this.isBorrowerBlacklisted()) {
            return false;
        }
        
        if (this.loanCart.length === 0) {
            return false;
        }
        
        const userData = JSON.parse(localStorage.getItem('mpesewa_user') || {});
        const groups = userData.groups || [];
        
        if (groups.length === 0) {
            return false;
        }
        
        const validItems = this.loanCart.filter(item => {
            return item.amount >= 5 && item.group_id && groups.includes(item.group_id);
        });
        
        return validItems.length === this.loanCart.length;
    }

    async submitLoanRequests() {
        if (!this.canSubmitRequests()) {
            alert('Cannot submit requests. Please check all items are valid.');
            return;
        }
        
        const confirmed = confirm(
            `Submit ${this.loanCart.length} loan request(s) to lenders?\n\n` +
            `Requests will be visible to all lenders in your selected groups.\n` +
            `Lenders will choose which requests to fund.`
        );
        
        if (!confirmed) return;
        
        try {
            const userData = JSON.parse(localStorage.getItem('mpesewa_user') || {});
            
            for (const item of this.loanCart) {
                const loanRequest = {
                    id: 'request_' + Date.now() + Math.random().toString(36).substr(2, 9),
                    borrower_id: this.currentBorrower,
                    borrower_name: userData.name,
                    borrower_phone: userData.phone,
                    category: item.category_name,
                    amount: item.amount,
                    purpose: item.purpose,
                    repayment_days: item.days,
                    group_id: item.group_id,
                    status: 'requested',
                    request_date: new Date().toISOString(),
                    guarantors: userData.guarantors || [],
                    interest_rate: 10
                };
                
                await this.saveLoanRequest(loanRequest);
            }
            
            alert(`${this.loanCart.length} loan request(s) submitted successfully!`);
            
            this.loanCart = [];
            this.saveCart();
            this.renderCategories();
            this.renderLoanCart();
            
            window.location.href = 'borrowing.html?success=true';
            
        } catch (error) {
            console.error('Error submitting loan requests:', error);
            alert('Error submitting requests. Please try again.');
        }
    }

    async saveLoanRequest(loanRequest) {
        try {
            const existingRequests = JSON.parse(localStorage.getItem('mpesewa_loan_requests') || '[]');
            existingRequests.push(loanRequest);
            localStorage.setItem('mpesewa_loan_requests', JSON.stringify(existingRequests));
            
            return true;
        } catch (error) {
            console.error('Error saving loan request:', error);
            throw error;
        }
    }

    saveCart() {
        try {
            localStorage.setItem(`mpesewa_cart_${this.currentBorrower}`, JSON.stringify(this.loanCart));
        } catch (error) {
            console.error('Error saving cart:', error);
        }
    }

    viewCategoryDetails(category) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-header">
                    <h3 class="modal-title">${category.name}</h3>
                    <button class="btn-icon close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="category-detail">
                        <div class="detail-icon">
                            <i class="${category.icon || 'fas fa-question-circle'} fa-3x"></i>
                        </div>
                        <div class="detail-content">
                            <h4>${category.tagline}</h4>
                            <p>${category.description || 'Emergency loan category'}</p>
                            
                            <div class="detail-info">
                                <div class="info-item">
                                    <strong>Interest Rate:</strong> 10% per week
                                </div>
                                <div class="info-item">
                                    <strong>Repayment Period:</strong> 7-30 days
                                </div>
                                <div class="info-item">
                                    <strong>Minimum Amount:</strong> ${this.formatCurrency(5)}
                                </div>
                                <div class="info-item">
                                    <strong>Penalty:</strong> 5% daily after due date
                                </div>
                            </div>
                            
                            <div class="usage-tips">
                                <h5>Usage Tips:</h5>
                                <ul>
                                    <li>Request only what you need</li>
                                    <li>Choose repayment period carefully</li>
                                    <li>Repay on time to maintain good rating</li>
                                    <li>Lenders see your rating and history</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-outline close-modal">Close</button>
                    ${this.canAddToCart(category.id) ? 
                        `<button class="btn btn-primary add-from-modal" data-category-id="${category.id}">
                            <i class="fas fa-cart-plus"></i> Add to Cart
                        </button>` : ''
                    }
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        modal.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => {
                document.body.removeChild(modal);
            });
        });
        
        modal.querySelector('.add-from-modal')?.addEventListener('click', () => {
            this.addToCart(category);
            document.body.removeChild(modal);
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    initiateRepayment(loan) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        
        const overdueDays = this.calculateOverdueDays(loan.due_date);
        const penalty = overdueDays > 0 ? this.calculatePenalty(loan.amount, overdueDays) : 0;
        const interest = this.calculateInterest(loan.amount, 7 + Math.max(0, overdueDays));
        const totalDue = loan.amount + interest + penalty;
        
        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-header">
                    <h3 class="modal-title">Make Payment</h3>
                    <button class="btn-icon close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="payment-summary">
                        <div class="summary-item">
                            <span class="summary-label">Loan Amount:</span>
                            <span class="summary-value">${this.formatCurrency(loan.amount)}</span>
                        </div>
                        <div class="summary-item">
                            <span class="summary-label">Interest:</span>
                            <span class="summary-value">${this.formatCurrency(interest)}</span>
                        </div>
                        ${penalty > 0 ? `
                            <div class="summary-item">
                                <span class="summary-label">Penalty (${overdueDays} days):</span>
                                <span class="summary-value text-danger">${this.formatCurrency(penalty)}</span>
                            </div>
                        ` : ''}
                        <div class="summary-item total">
                            <span class="summary-label">Total Due:</span>
                            <span class="summary-value">${this.formatCurrency(totalDue)}</span>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="payment-amount" class="form-label">Payment Amount</label>
                        <div class="input-group">
                            <span class="input-group-prepend">${this.getCurrencySymbol()}</span>
                            <input type="number" 
                                   id="payment-amount" 
                                   class="form-control" 
                                   min="1" 
                                   max="${totalDue}"
                                   value="${totalDue}"
                                   step="1">
                        </div>
                        <div class="form-hint">You can make partial payments</div>
                    </div>
                    
                    <div class="form-group">
                        <label for="payment-method" class="form-label">Payment Method</label>
                        <select id="payment-method" class="form-control">
                            <option value="mpesa">M-Pesa</option>
                            <option value="bank">Bank Transfer</option>
                            <option value="cash">Cash</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="payment-reference" class="form-label">Payment Reference</label>
                        <input type="text" 
                               id="payment-reference" 
                               class="form-control" 
                               placeholder="Enter transaction ID or reference">
                    </div>
                    
                    <div class="alert alert-info">
                        <div class="alert-icon">
                            <i class="fas fa-info-circle"></i>
                        </div>
                        <div class="alert-content">
                            <div class="alert-title">Important</div>
                            <p>Payments are processed outside the platform. Update your lender after making payment.</p>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-outline close-modal">Cancel</button>
                    <button class="btn btn-primary" id="confirm-payment">
                        <i class="fas fa-check"></i> Confirm Payment
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
        
        modal.querySelector('#confirm-payment').addEventListener('click', () => {
            this.processPayment(loan, modal);
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    processPayment(loan, modal) {
        const amount = parseFloat(modal.querySelector('#payment-amount').value);
        const method = modal.querySelector('#payment-method').value;
        const reference = modal.querySelector('#payment-reference').value;
        
        if (!amount || amount <= 0) {
            alert('Please enter a valid payment amount');
            return;
        }
        
        if (!reference.trim()) {
            alert('Please enter a payment reference');
            return;
        }
        
        const payment = {
            id: 'payment_' + Date.now(),
            loan_id: loan.id,
            amount: amount,
            method: method,
            reference: reference,
            date: new Date().toISOString(),
            status: 'pending'
        };
        
        this.recordPayment(payment);
        
        alert('Payment recorded! Your lender will verify and update your ledger.');
        document.body.removeChild(modal);
        
        this.loadBorrowerData();
    }

    recordPayment(payment) {
        try {
            const payments = JSON.parse(localStorage.getItem('mpesewa_payments') || '[]');
            payments.push(payment);
            localStorage.setItem('mpesewa_payments', JSON.stringify(payments));
        } catch (error) {
            console.error('Error recording payment:', error);
        }
    }

    viewLoanDetails(loanId) {
        window.location.href = `loan-details.html?id=${loanId}`;
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

    calculateOverdueDays(dueDate) {
        const due = new Date(dueDate);
        const today = new Date();
        const diffTime = today - due;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return Math.max(0, diffDays);
    }

    calculateRepaymentProgress(loan) {
        if (!loan.repayment_history || loan.repayment_history.length === 0) {
            return 0;
        }
        
        const totalPaid = loan.repayment_history.reduce((sum, payment) => sum + payment.amount, 0);
        const totalDue = loan.amount + this.calculateInterest(loan.amount, 7);
        return Math.min(100, Math.round((totalPaid / totalDue) * 100));
    }

    isOverdue(dueDate) {
        return new Date(dueDate) < new Date();
    }

    getBorrowerRating() {
        const ratings = JSON.parse(localStorage.getItem('mpesewa_ratings') || '{}');
        return ratings[this.currentBorrower] || 5.0;
    }

    isBorrowerBlacklisted() {
        const blacklist = JSON.parse(localStorage.getItem('mpesewa_blacklist') || '[]');
        return blacklist.includes(this.currentBorrower);
    }

    getGroupById(groupId) {
        const groups = JSON.parse(localStorage.getItem('mpesewa_groups') || '[]');
        return groups.find(g => g.id === groupId);
    }

    getCategoryIcon(categoryName) {
        const category = this.availableCategories.find(cat => cat.name === categoryName);
        return category?.icon || 'fa-file-invoice-dollar';
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

const borrowingManager = new BorrowingManager();

document.addEventListener('DOMContentLoaded', () => {
    borrowingManager.loadBorrowerData();
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { borrowingManager };
}