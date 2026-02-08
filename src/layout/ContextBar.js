// layout/ContextBar.js
// M-Pesewa ContextBar Component - Contextual Information Display

class MPContextBar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.currentCountry = localStorage.getItem('mpesewa_country');
        this.userRole = localStorage.getItem('mpesewa_user_role') || 'guest';
        this.contextData = {
            country: null,
            group: null,
            subscription: null,
            loanStatus: null
        };
        this.isVisible = true;
        this.isCollapsed = localStorage.getItem('mpesewa_contextbar_collapsed') === 'true';
    }

    connectedCallback() {
        this.loadContextData();
        this.render();
        this.setupEventListeners();
        this.startAutoRefresh();
    }

    disconnectedCallback() {
        this.stopAutoRefresh();
    }

    loadContextData() {
        // Load country data
        if (this.currentCountry) {
            this.contextData.country = {
                code: this.currentCountry,
                name: this.getCountryName(this.currentCountry),
                flag: this.getCountryFlag(this.currentCountry),
                currency: this.getCountryCurrency(this.currentCountry),
                status: 'active'
            };
        }

        // Load group data
        const userGroups = JSON.parse(localStorage.getItem('mpesewa_user_groups') || '[]');
        if (userGroups.length > 0) {
            this.contextData.group = userGroups[0]; // Active group
        }

        // Load subscription data for lenders
        if (this.userRole === 'lender') {
            this.contextData.subscription = JSON.parse(localStorage.getItem('mpesewa_subscription') || 'null') || {
                level: 'Basic',
                limit: '1,500',
                currency: this.getCountryCurrency(this.currentCountry),
                expires: this.getNextExpiryDate(),
                status: 'active'
            };
        }

        // Load loan status for borrowers
        if (this.userRole === 'borrower') {
            const loans = JSON.parse(localStorage.getItem('mpesewa_user_loans') || '[]');
            if (loans.length > 0) {
                const activeLoan = loans.find(loan => loan.status === 'active');
                if (activeLoan) {
                    this.contextData.loanStatus = {
                        amount: activeLoan.amount,
                        dueDate: activeLoan.dueDate,
                        daysLeft: this.calculateDaysLeft(activeLoan.dueDate),
                        interest: activeLoan.interest || '10%'
                    };
                }
            }
        }
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                /* CONTEXT BAR STYLES */
                :host {
                    display: block;
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
                }
                
                .context-bar {
                    background: linear-gradient(135deg, #003366, #0099ff);
                    color: white;
                    padding: 12px 20px;
                    position: relative;
                    z-index: 30;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                    transition: all 0.3s ease;
                }
                
                .context-bar.collapsed {
                    padding: 6px 20px;
                }
                
                .container {
                    max-width: 1200px;
                    margin: 0 auto;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 20px;
                }
                
                /* Left Section - Context Info */
                .context-info {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                    flex-wrap: wrap;
                }
                
                .context-item {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 13px;
                    padding: 6px 12px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 6px;
                    backdrop-filter: blur(10px);
                    transition: background 0.2s ease;
                }
                
                .context-item:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
                
                .context-icon {
                    font-size: 14px;
                }
                
                .context-text {
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                }
                
                .context-label {
                    font-size: 11px;
                    opacity: 0.8;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                
                .context-value {
                    font-size: 13px;
                    font-weight: 600;
                }
                
                .context-value.highlight {
                    color: #ffd700;
                }
                
                .context-value.warning {
                    color: #ff6b6b;
                }
                
                .context-value.success {
                    color: #28a745;
                }
                
                /* Right Section - Actions */
                .context-actions {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                
                .context-btn {
                    background: rgba(255, 255, 255, 0.15);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    color: white;
                    padding: 6px 12px;
                    border-radius: 4px;
                    font-size: 12px;
                    font-weight: 500;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    transition: all 0.2s ease;
                }
                
                .context-btn:hover {
                    background: rgba(255, 255, 255, 0.25);
                    transform: translateY(-1px);
                }
                
                .context-btn.primary {
                    background: #f37021;
                    border-color: #f37021;
                }
                
                .context-btn.primary:hover {
                    background: #e05a1a;
                }
                
                .context-btn.success {
                    background: #28a745;
                    border-color: #28a745;
                }
                
                .context-btn.success:hover {
                    background: #218838;
                }
                
                /* Toggle Button */
                .toggle-btn {
                    background: none;
                    border: none;
                    color: white;
                    cursor: pointer;
                    padding: 4px;
                    border-radius: 4px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background 0.2s ease;
                }
                
                .toggle-btn:hover {
                    background: rgba(255, 255, 255, 0.1);
                }
                
                /* Collapsed State */
                .context-bar.collapsed .context-text {
                    display: none;
                }
                
                .context-bar.collapsed .context-item {
                    padding: 6px;
                }
                
                .context-bar.collapsed .context-btn span:not(.btn-icon) {
                    display: none;
                }
                
                /* Status Indicators */
                .status-indicator {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    margin-left: 4px;
                }
                
                .status-active {
                    background: #28a745;
                    animation: pulse 2s infinite;
                }
                
                .status-warning {
                    background: #f37021;
                }
                
                .status-danger {
                    background: #dc3545;
                }
                
                /* Progress Bar */
                .progress-container {
                    flex: 1;
                    max-width: 200px;
                }
                
                .progress-bar {
                    height: 6px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 3px;
                    overflow: hidden;
                    margin-top: 4px;
                }
                
                .progress-fill {
                    height: 100%;
                    background: #28a745;
                    border-radius: 3px;
                    transition: width 0.3s ease;
                }
                
                /* Quick Stats */
                .quick-stats {
                    display: flex;
                    gap: 15px;
                    margin-left: 20px;
                }
                
                .stat-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 2px;
                }
                
                .stat-value {
                    font-size: 14px;
                    font-weight: 600;
                }
                
                .stat-label {
                    font-size: 10px;
                    opacity: 0.8;
                    text-transform: uppercase;
                }
                
                /* Responsive */
                @media (max-width: 1024px) {
                    .quick-stats {
                        display: none;
                    }
                }
                
                @media (max-width: 768px) {
                    .context-bar {
                        padding: 10px 15px;
                    }
                    
                    .container {
                        flex-direction: column;
                        align-items: stretch;
                        gap: 10px;
                    }
                    
                    .context-info {
                        justify-content: center;
                    }
                    
                    .context-actions {
                        justify-content: center;
                    }
                    
                    .context-item:nth-child(n+4) {
                        display: none;
                    }
                }
                
                @media (max-width: 480px) {
                    .context-item:nth-child(n+3) {
                        display: none;
                    }
                    
                    .context-btn span:not(.btn-icon) {
                        display: none;
                    }
                }
                
                /* Animations */
                @keyframes pulse {
                    0% { opacity: 1; }
                    50% { opacity: 0.5; }
                    100% { opacity: 1; }
                }
                
                @keyframes slideDown {
                    from { transform: translateY(-100%); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                
                .context-bar {
                    animation: slideDown 0.3s ease;
                }
                
                /* Dark Mode (already dark by default) */
                @media (prefers-color-scheme: dark) {
                    .context-bar {
                        background: linear-gradient(135deg, #002244, #0066cc);
                    }
                }
                
                /* Print Styles */
                @media print {
                    .context-bar {
                        background: #ffffff !important;
                        color: #000000 !important;
                        border-bottom: 1px solid #000000;
                    }
                    
                    .context-item {
                        background: #f0f0f0 !important;
                        color: #000000 !important;
                    }
                    
                    .context-btn {
                        display: none !important;
                    }
                }
            </style>
            
            <div class="context-bar ${this.isCollapsed ? 'collapsed' : ''}" id="contextBar">
                <div class="container">
                    <!-- Context Information -->
                    <div class="context-info" id="contextInfo">
                        <!-- Filled dynamically -->
                    </div>
                    
                    <!-- Context Actions -->
                    <div class="context-actions">
                        <!-- Quick Stats (visible only when not collapsed) -->
                        ${!this.isCollapsed ? `
                            <div class="quick-stats" id="quickStats">
                                <!-- Filled dynamically -->
                            </div>
                        ` : ''}
                        
                        <!-- Action Buttons -->
                        <div class="action-buttons" id="actionButtons">
                            <!-- Filled dynamically -->
                        </div>
                        
                        <!-- Toggle Button -->
                        <button class="toggle-btn" id="toggleContextBar" aria-label="${this.isCollapsed ? 'Expand' : 'Collapse'} context bar">
                            ${this.isCollapsed ? '↑' : '↓'}
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        this.renderContextInfo();
        this.renderQuickStats();
        this.renderActionButtons();
    }

    renderContextInfo() {
        const contextInfo = this.shadowRoot.getElementById('contextInfo');
        if (!contextInfo) return;

        let contextItems = [];

        // Country context
        if (this.contextData.country) {
            contextItems.push(`
                <div class="context-item" title="${this.contextData.country.name}">
                    <span class="context-icon">${this.contextData.country.flag}</span>
                    ${!this.isCollapsed ? `
                        <div class="context-text">
                            <span class="context-label">Country</span>
                            <span class="context-value">${this.contextData.country.name}</span>
                        </div>
                    ` : ''}
                    <div class="status-indicator status-active"></div>
                </div>
            `);
        }

        // Group context
        if (this.contextData.group) {
            contextItems.push(`
                <div class="context-item" title="${this.contextData.group.name}">
                    <span class="context-icon">👥</span>
                    ${!this.isCollapsed ? `
                        <div class="context-text">
                            <span class="context-label">Active Group</span>
                            <span class="context-value">${this.contextData.group.name}</span>
                        </div>
                    ` : ''}
                </div>
            `);
        }

        // Subscription context (for lenders)
        if (this.contextData.subscription) {
            const daysLeft = this.calculateDaysUntil(this.contextData.subscription.expires);
            const statusClass = daysLeft <= 7 ? 'warning' : daysLeft <= 3 ? 'danger' : '';
            
            contextItems.push(`
                <div class="context-item" title="Subscription: ${this.contextData.subscription.level}">
                    <span class="context-icon">⭐</span>
                    ${!this.isCollapsed ? `
                        <div class="context-text">
                            <span class="context-label">Subscription</span>
                            <span class="context-value ${statusClass}">${this.contextData.subscription.level}</span>
                        </div>
                        <div class="progress-container">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${100 - (daysLeft / 28) * 100}%"></div>
                            </div>
                        </div>
                    ` : ''}
                </div>
            `);
        }

        // Loan status context (for borrowers)
        if (this.contextData.loanStatus) {
            const statusClass = this.contextData.loanStatus.daysLeft <= 3 ? 'warning' : 
                              this.contextData.loanStatus.daysLeft <= 1 ? 'danger' : '';
            
            contextItems.push(`
                <div class="context-item" title="Loan: ${this.contextData.loanStatus.amount} due in ${this.contextData.loanStatus.daysLeft} days">
                    <span class="context-icon">💰</span>
                    ${!this.isCollapsed ? `
                        <div class="context-text">
                            <span class="context-label">Active Loan</span>
                            <span class="context-value ${statusClass}">${this.contextData.loanStatus.amount}</span>
                        </div>
                    ` : ''}
                </div>
            `);
        }

        // User role context
        contextItems.push(`
            <div class="context-item" title="${this.getRoleLabel(this.userRole)}">
                <span class="context-icon">${this.getRoleIcon(this.userRole)}</span>
                ${!this.isCollapsed ? `
                    <div class="context-text">
                        <span class="context-label">Role</span>
                        <span class="context-value">${this.getRoleLabel(this.userRole)}</span>
                    </div>
                ` : ''}
            </div>
        `);

        contextInfo.innerHTML = contextItems.join('');
    }

    renderQuickStats() {
        if (this.isCollapsed) return;
        
        const quickStats = this.shadowRoot.getElementById('quickStats');
        if (!quickStats) return;

        let stats = [];

        // Add stats based on user role
        if (this.userRole === 'lender') {
            const ledgers = JSON.parse(localStorage.getItem('mpesewa_ledgers') || '[]');
            const activeLedgers = ledgers.filter(l => l.status === 'active');
            const totalLent = activeLedgers.reduce((sum, ledger) => sum + (ledger.amount || 0), 0);
            
            stats.push(`
                <div class="stat-item">
                    <div class="stat-value">${activeLedgers.length}</div>
                    <div class="stat-label">Ledgers</div>
                </div>
            `);
            
            stats.push(`
                <div class="stat-item">
                    <div class="stat-value">${this.contextData.subscription?.limit || '0'}</div>
                    <div class="stat-label">Limit</div>
                </div>
            `);
            
            stats.push(`
                <div class="stat-item">
                    <div class="stat-value">${totalLent.toLocaleString()}</div>
                    <div class="stat-label">Lent</div>
                </div>
            `);
        } else if (this.userRole === 'borrower') {
            const loans = JSON.parse(localStorage.getItem('mpesewa_user_loans') || '[]');
            const activeLoans = loans.filter(l => l.status === 'active');
            const totalBorrowed = activeLoans.reduce((sum, loan) => sum + (loan.amount || 0), 0);
            
            stats.push(`
                <div class="stat-item">
                    <div class="stat-value">${activeLoans.length}</div>
                    <div class="stat-label">Loans</div>
                </div>
            `);
            
            stats.push(`
                <div class="stat-item">
                    <div class="stat-value">${this.contextData.loanStatus?.daysLeft || '0'}</div>
                    <div class="stat-label">Days Left</div>
                </div>
            `);
            
            stats.push(`
                <div class="stat-item">
                    <div class="stat-value">${totalBorrowed.toLocaleString()}</div>
                    <div class="stat-label">Borrowed</div>
                </div>
            `);
        } else {
            // Guest stats
            stats.push(`
                <div class="stat-item">
                    <div class="stat-value">12</div>
                    <div class="stat-label">Countries</div>
                </div>
            `);
            
            stats.push(`
                <div class="stat-item">
                    <div class="stat-value">20</div>
                    <div class="stat-label">Categories</div>
                </div>
            `);
            
            stats.push(`
                <div class="stat-item">
                    <div class="stat-value">99%</div>
                    <div class="stat-label">Repayment</div>
                </div>
            `);
        }

        quickStats.innerHTML = stats.join('');
    }

    renderActionButtons() {
        const actionButtons = this.shadowRoot.getElementById('actionButtons');
        if (!actionButtons) return;

        let buttons = [];

        // Common actions
        if (this.userRole === 'lender') {
            buttons.push(`
                <button class="context-btn" id="addLedgerBtn" title="Add New Ledger">
                    <span class="btn-icon">📒</span>
                    ${!this.isCollapsed ? '<span>Add Ledger</span>' : ''}
                </button>
            `);
            
            buttons.push(`
                <button class="context-btn primary" id="lendNowBtn" title="Lend Now">
                    <span class="btn-icon">💰</span>
                    ${!this.isCollapsed ? '<span>Lend Now</span>' : ''}
                </button>
            `);
        } else if (this.userRole === 'borrower') {
            buttons.push(`
                <button class="context-btn primary" id="applyLoanBtn" title="Apply for Loan">
                    <span class="btn-icon">📝</span>
                    ${!this.isCollapsed ? '<span>Apply Now</span>' : ''}
                </button>
            `);
        } else {
            buttons.push(`
                <button class="context-btn" id="learnMoreBtn" title="Learn More">
                    <span class="btn-icon">📚</span>
                    ${!this.isCollapsed ? '<span>Learn More</span>' : ''}
                </button>
            `);
            
            buttons.push(`
                <button class="context-btn primary" id="getStartedBtn" title="Get Started">
                    <span class="btn-icon">🚀</span>
                    ${!this.isCollapsed ? '<span>Get Started</span>' : ''}
                </button>
            `);
        }

        // Emergency action (always visible)
        buttons.push(`
            <button class="context-btn success" id="emergencyHelpBtn" title="Emergency Help">
                <span class="btn-icon">🚨</span>
                ${!this.isCollapsed ? '<span>Emergency Help</span>' : ''}
            </button>
        `);

        actionButtons.innerHTML = buttons.join('');
    }

    setupEventListeners() {
        // Toggle button
        const toggleBtn = this.shadowRoot.getElementById('toggleContextBar');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggleCollapse());
        }

        // Action buttons
        const actionButtons = this.shadowRoot.getElementById('actionButtons');
        if (actionButtons) {
            actionButtons.addEventListener('click', (e) => {
                const button = e.target.closest('.context-btn');
                if (!button) return;

                switch (button.id) {
                    case 'addLedgerBtn':
                        this.handleAddLedger();
                        break;
                    case 'lendNowBtn':
                        this.handleLendNow();
                        break;
                    case 'applyLoanBtn':
                        this.handleApplyLoan();
                        break;
                    case 'learnMoreBtn':
                        window.location.href = 'how-it-works.html';
                        break;
                    case 'getStartedBtn':
                        window.location.href = 'auth/register.html';
                        break;
                    case 'emergencyHelpBtn':
                        this.handleEmergencyHelp();
                        break;
                }
            });
        }

        // Context items (clickable)
        const contextInfo = this.shadowRoot.getElementById('contextInfo');
        if (contextInfo) {
            contextInfo.addEventListener('click', (e) => {
                const contextItem = e.target.closest('.context-item');
                if (!contextItem) return;

                // Find which context item was clicked
                const items = Array.from(contextInfo.querySelectorAll('.context-item'));
                const index = items.indexOf(contextItem);
                
                switch (index) {
                    case 0: // Country
                        this.showCountryInfo();
                        break;
                    case 1: // Group
                        this.showGroupInfo();
                        break;
                    case 2: // Subscription/Loan
                        if (this.userRole === 'lender') {
                            window.location.href = 'subscription/current.html';
                        } else if (this.userRole === 'borrower') {
                            window.location.href = 'borrower/loans.html';
                        }
                        break;
                }
            });
        }
    }

    toggleCollapse() {
        this.isCollapsed = !this.isCollapsed;
        localStorage.setItem('mpesewa_contextbar_collapsed', this.isCollapsed);
        
        const contextBar = this.shadowRoot.getElementById('contextBar');
        const toggleBtn = this.shadowRoot.getElementById('toggleContextBar');
        
        if (contextBar) {
            contextBar.classList.toggle('collapsed', this.isCollapsed);
        }
        
        if (toggleBtn) {
            toggleBtn.setAttribute('aria-label', this.isCollapsed ? 'Expand' : 'Collapse');
            toggleBtn.innerHTML = this.isCollapsed ? '↑' : '↓';
        }
        
        // Re-render to show/hide text
        this.renderContextInfo();
        this.renderQuickStats();
        this.renderActionButtons();
    }

    handleAddLedger() {
        // Show add ledger modal
        const modal = document.createElement('div');
        modal.innerHTML = `
            <style>
                .ledger-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                }
                
                .modal-content {
                    background: white;
                    border-radius: 12px;
                    width: 90%;
                    max-width: 500px;
                    padding: 30px;
                    animation: slideUp 0.3s ease;
                }
                
                .modal-title {
                    font-size: 20px;
                    font-weight: 600;
                    color: #003366;
                    margin-bottom: 20px;
                }
                
                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            </style>
            
            <div class="ledger-modal">
                <div class="modal-content">
                    <div class="modal-title">Add New Ledger</div>
                    <p>This would open a form to add a new ledger record.</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close modal on click outside
        modal.querySelector('.ledger-modal').addEventListener('click', (e) => {
            if (e.target.classList.contains('ledger-modal')) {
                modal.remove();
            }
        });
    }

    handleLendNow() {
        window.location.href = 'lender/requests.html';
    }

    handleApplyLoan() {
        window.location.href = 'borrower/apply.html';
    }

    handleEmergencyHelp() {
        window.location.href = 'emergency/index.html';
    }

    showCountryInfo() {
        if (!this.contextData.country) return;
        
        this.showToast(`${this.contextData.country.name} - ${this.contextData.country.currency} - Country locked after registration`);
    }

    showGroupInfo() {
        if (!this.contextData.group) return;
        
        this.showToast(`Active group: ${this.contextData.group.name} - ${this.contextData.group.members || 0} members`);
    }

    startAutoRefresh() {
        // Refresh context data every 30 seconds
        this.refreshInterval = setInterval(() => {
            this.loadContextData();
            this.renderContextInfo();
            this.renderQuickStats();
        }, 30000);
    }

    stopAutoRefresh() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }
    }

    calculateDaysLeft(dueDate) {
        if (!dueDate) return 7;
        const due = new Date(dueDate);
        const now = new Date();
        const diffTime = due - now;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    calculateDaysUntil(dateStr) {
        if (!dateStr) return 28;
        const date = new Date(dateStr);
        const now = new Date();
        const diffTime = date - now;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    getNextExpiryDate() {
        const now = new Date();
        // Expires on 28th of each month
        const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 28);
        return nextMonth.toISOString().split('T')[0];
    }

    getCountryCurrency(code) {
        const currencyMap = {
            'KE': 'KES',
            'UG': 'UGX',
            'TZ': 'TZS',
            'RW': 'RWF',
            'BI': 'BIF',
            'CD': 'CDF',
            'NG': 'NGN',
            'GH': 'GHS',
            'SS': 'SSP',
            'SO': 'SOS',
            'ZA': 'ZAR',
            'ET': 'ETB'
        };
        return currencyMap[code] || 'USD';
    }

    getCountryName(code) {
        const countries = [
            { code: 'KE', name: 'Kenya' },
            { code: 'UG', name: 'Uganda' },
            { code: 'TZ', name: 'Tanzania' },
            { code: 'RW', name: 'Rwanda' },
            { code: 'BI', name: 'Burundi' },
            { code: 'CD', name: 'DRC' },
            { code: 'NG', name: 'Nigeria' },
            { code: 'GH', name: 'Ghana' },
            { code: 'SS', name: 'South Sudan' },
            { code: 'SO', name: 'Somalia' },
            { code: 'ZA', name: 'South Africa' },
            { code: 'ET', name: 'Ethiopia' }
        ];
        const country = countries.find(c => c.code === code);
        return country ? country.name : 'Select Country';
    }

    getCountryFlag(code) {
        const flags = {
            'KE': '🇰🇪', 'UG': '🇺🇬', 'TZ': '🇹🇿', 'RW': '🇷🇼',
            'BI': '🇧🇮', 'CD': '🇨🇩', 'NG': '🇳🇬', 'GH': '🇬🇭',
            'SS': '🇸🇸', 'SO': '🇸🇴', 'ZA': '🇿🇦', 'ET': '🇪🇹'
        };
        return flags[code] || '🏳️';
    }

    getRoleLabel(role) {
        const labels = {
            lender: 'Lender',
            borrower: 'Borrower',
            group_admin: 'Group Admin',
            guest: 'Guest'
        };
        return labels[role] || role;
    }

    getRoleIcon(role) {
        const icons = {
            lender: '💰',
            borrower: '🤝',
            group_admin: '👑',
            guest: '👤'
        };
        return icons[role] || '👤';
    }

    showToast(message) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #003366;
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            font-size: 14px;
            z-index: 1000;
            animation: slideIn 0.3s ease;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Public methods
    updateContext(data) {
        if (data.country) this.contextData.country = data.country;
        if (data.group) this.contextData.group = data.group;
        if (data.subscription) this.contextData.subscription = data.subscription;
        if (data.loanStatus) this.contextData.loanStatus = data.loanStatus;
        
        this.renderContextInfo();
        this.renderQuickStats();
    }

    setVisibility(visible) {
        this.isVisible = visible;
        const contextBar = this.shadowRoot.getElementById('contextBar');
        if (contextBar) {
            contextBar.style.display = visible ? 'block' : 'none';
        }
    }

    showAlert(message, type = 'info') {
        // Create alert banner
        const alert = document.createElement('div');
        alert.innerHTML = `
            <style>
                .context-alert {
                    background: ${type === 'warning' ? '#f37021' : type === 'danger' ? '#dc3545' : '#0099ff'};
                    color: white;
                    padding: 12px 20px;
                    font-size: 14px;
                    font-weight: 500;
                    border-radius: 6px;
                    margin-top: 10px;
                    animation: slideDown 0.3s ease;
                }
            </style>
            <div class="context-alert">
                ${message}
            </div>
        `;
        
        const container = this.shadowRoot.querySelector('.container');
        if (container) {
            container.appendChild(alert);
            
            // Auto-remove after 5 seconds
            setTimeout(() => {
                if (alert.parentNode) {
                    alert.style.animation = 'slideUp 0.3s ease';
                    setTimeout(() => alert.remove(), 300);
                }
            }, 5000);
        }
    }
}

// Register custom element
customElements.define('mp-context-bar', MPContextBar);

// Export for module usage
export default MPContextBar;