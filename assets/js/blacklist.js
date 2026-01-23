/**
 * M-PESEWA Blacklist System
 * Handles country-isolated blacklist data loading and management
 */

const BlacklistSystem = {
    // Configuration
    config: {
        itemsPerPage: 10,
        currentPage: 1,
        currentCountry: null,
        sortField: 'default_days',
        sortDirection: 'desc',
        filters: {}
    },

    // Data storage
    data: {
        blacklist: [],
        filteredData: [],
        stats: {}
    },

    // Initialize blacklist system
    init: function() {
        console.log('Initializing Blacklist System...');
        
        // Get current country from localStorage or default to Kenya
        this.config.currentCountry = localStorage.getItem('currentCountry') || 'kenya';
        
        // Update UI with current country
        this.updateCountryUI();
        
        // Load blacklist data
        this.loadBlacklistData();
        
        // Initialize event listeners
        this.initEventListeners();
    },

    // Update country information in UI
    updateCountryUI: function() {
        const countryName = this.config.currentCountry.toUpperCase();
        const countryElement = document.getElementById('currentCountryBadge');
        const countryNameElement = document.getElementById('currentCountryName');
        
        if (countryElement) {
            countryElement.innerHTML = `
                <span class="country-badge">🌍</span>
                <span class="country-name">${countryName}</span>
            `;
        }
        
        if (countryNameElement) {
            countryNameElement.textContent = countryName;
        }
        
        // Update country selector
        const selector = document.getElementById('countrySelector');
        if (selector) {
            selector.innerHTML = `
                <div class="selected-country">
                    <span class="country-flag">${this.getCountryFlag(countryName)}</span>
                    <span class="country-text">Currently viewing: ${countryName} blacklist</span>
                </div>
                <div class="country-note">
                    <small>To view other countries, select a country from the main countries page.</small>
                </div>
            `;
        }
    },

    // Get country flag emoji
    getCountryFlag: function(countryCode) {
        const flags = {
            'KENYA': '🇰🇪',
            'UGANDA': '🇺🇬',
            'TANZANIA': '🇹🇿',
            'RWANDA': '🇷🇼',
            'NIGERIA': '🇳🇬',
            'GHANA': '🇬🇭',
            'SOUTH AFRICA': '🇿🇦',
            'EGYPT': '🇪🇬',
            'ETHIOPIA': '🇪🇹',
            'SENEGAL': '🇸🇳',
            'MOROCCO': '🇲🇦'
        };
        
        return flags[countryCode] || '🌍';
    },

    // Load blacklist data from JSON file
    loadBlacklistData: function() {
        const country = this.config.currentCountry.toLowerCase();
        const dataUrl = `data/blacklist/${country}.json`;
        
        console.log(`Loading blacklist data for ${country} from ${dataUrl}`);
        
        // Show loading state
        this.showLoading(true);
        
        // Fetch data
        fetch(dataUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Blacklist data loaded:', data);
                this.data.blacklist = data.blacklisted_users || [];
                this.calculateStats();
                this.applyFilters();
                this.renderTable();
                this.showLoading(false);
            })
            .catch(error => {
                console.error('Error loading blacklist data:', error);
                
                // Fallback to demo data if file doesn't exist
                this.loadDemoData();
                this.showLoading(false);
                
                // Show error message
                MPUtils.Dom.showNotification('error', 
                    `Could not load blacklist data for ${country}. Showing demo data.`);
            });
    },

    // Load demo data for development
    loadDemoData: function() {
        const country = this.config.currentCountry.toUpperCase();
        
        this.data.blacklist = [
            {
                user_id: `MP-${country.substring(0,2)}-001`,
                name: 'John Mwangi',
                phone: '254712345678',
                reason: 'Defaulted on 3 group loans',
                default_amount: 15000,
                default_days: 92,
                applied_at: '2025-10-15',
                status: 'active',
                groups: ['Family Trust Group', 'Nairobi Business Circle'],
                badge_count: 3,
                currency: 'KES'
            },
            {
                user_id: `MP-${country.substring(0,2)}-002`,
                name: 'Sarah Akinyi',
                phone: '254723456789',
                reason: 'No communication for 75 days',
                default_amount: 8500,
                default_days: 75,
                applied_at: '2025-11-05',
                status: 'active',
                groups: ['Women in Business'],
                badge_count: 2,
                currency: 'KES'
            },
            {
                user_id: `MP-${country.substring(0,2)}-003`,
                name: 'David Mugisha',
                phone: '256712345678',
                reason: 'Multiple defaults across groups',
                default_amount: 500000,
                default_days: 105,
                applied_at: '2025-09-20',
                status: 'pending',
                groups: ['Kampala Traders', 'Uganda Business Network'],
                badge_count: 4,
                currency: 'UGX'
            },
            {
                user_id: `MP-${country.substring(0,2)}-004`,
                name: 'Fatima Kareem',
                phone: '254734567890',
                reason: 'Changed location without notice',
                default_amount: 12000,
                default_days: 68,
                applied_at: '2025-11-12',
                status: 'reported',
                groups: ['Mombasa Coast Group'],
                badge_count: 1,
                currency: 'KES'
            },
            {
                user_id: `MP-${country.substring(0,2)}-005`,
                name: 'Peter Tembo',
                phone: '255712345678',
                reason: 'Refused to pay after 82 days',
                default_amount: 300000,
                default_days: 82,
                applied_at: '2025-10-28',
                status: 'active',
                groups: ['Dar Business Group', 'Tanzania Entrepreneurs'],
                badge_count: 2,
                currency: 'TZS'
            }
        ];
    },

    // Calculate statistics
    calculateStats: function() {
        const data = this.data.blacklist;
        
        this.data.stats = {
            totalDefaulters: data.length,
            totalAmount: data.reduce((sum, item) => sum + (item.default_amount || 0), 0),
            avgDays: data.length > 0 
                ? Math.round(data.reduce((sum, item) => sum + (item.default_days || 0), 0) / data.length)
                : 0,
            clearedCount: data.filter(item => item.status === 'cleared').length,
            activeCount: data.filter(item => item.status === 'active').length,
            pendingCount: data.filter(item => item.status === 'pending').length
        };
        
        this.updateStatsUI();
    },

    // Update statistics in UI
    updateStatsUI: function() {
        const stats = this.data.stats;
        const country = this.config.currentCountry.toUpperCase();
        
        // Update stat values
        document.getElementById('totalDefaulters').textContent = stats.totalDefaulters;
        document.getElementById('totalAmount').textContent = 
            MPUtils.Math.formatNumber(stats.totalAmount);
        document.getElementById('avgDays').textContent = stats.avgDays;
        document.getElementById('clearedCount').textContent = stats.clearedCount;
        
        // Update change indicators
        document.getElementById('defaultersChange').textContent = 
            stats.totalDefaulters > 0 ? `+${Math.floor(stats.totalDefaulters * 0.1)} this month` : 'No data';
        document.getElementById('amountChange').textContent = 
            stats.totalAmount > 0 ? `+${MPUtils.Math.formatNumber(stats.totalAmount * 0.15)} this month` : 'No data';
        document.getElementById('clearedInfo').textContent = 
            stats.clearedCount > 0 ? `${stats.clearedCount} cleared after repayment` : 'None cleared yet';
    },

    // Apply filters to data
    applyFilters: function() {
        let filtered = [...this.data.blacklist];
        
        // Apply search filter
        if (this.config.filters.search) {
            const searchTerm = this.config.filters.search.toLowerCase();
            filtered = filtered.filter(item => 
                item.name.toLowerCase().includes(searchTerm) ||
                item.user_id.toLowerCase().includes(searchTerm) ||
                item.phone.includes(searchTerm) ||
                item.groups.some(group => group.toLowerCase().includes(searchTerm))
            );
        }
        
        // Apply status filter
        if (this.config.filters.status) {
            filtered = filtered.filter(item => item.status === this.config.filters.status);
        }
        
        // Apply days filter
        if (this.config.filters.days) {
            const range = this.config.filters.days;
            filtered = filtered.filter(item => {
                const days = item.default_days || 0;
                switch(range) {
                    case '60-90': return days >= 60 && days <= 90;
                    case '90-120': return days > 90 && days <= 120;
                    case '120+': return days > 120;
                    case 'permanent': return days > 180;
                    default: return true;
                }
            });
        }
        
        // Apply sorting
        filtered.sort((a, b) => {
            let aValue, bValue;
            
            switch(this.config.sortField) {
                case 'default_days':
                    aValue = a.default_days || 0;
                    bValue = b.default_days || 0;
                    break;
                case 'default_amount':
                    aValue = a.default_amount || 0;
                    bValue = b.default_amount || 0;
                    break;
                case 'applied_at':
                    aValue = new Date(a.applied_at || 0);
                    bValue = new Date(b.applied_at || 0);
                    break;
                case 'groups_count':
                    aValue = a.groups ? a.groups.length : 0;
                    bValue = b.groups ? b.groups.length : 0;
                    break;
                default:
                    aValue = a.default_days || 0;
                    bValue = b.default_days || 0;
            }
            
            if (this.config.sortDirection === 'desc') {
                return bValue - aValue;
            } else {
                return aValue - bValue;
            }
        });
        
        this.data.filteredData = filtered;
    },

    // Render blacklist table
    renderTable: function() {
        const container = document.getElementById('blacklistContainer');
        const emptyState = document.getElementById('emptyState');
        const paginationInfo = document.getElementById('paginationInfo');
        const pageNumbers = document.getElementById('pageNumbers');
        
        if (!container) return;
        
        // Calculate pagination
        const totalItems = this.data.filteredData.length;
        const totalPages = Math.ceil(totalItems / this.config.itemsPerPage);
        const startIndex = (this.config.currentPage - 1) * this.config.itemsPerPage;
        const endIndex = Math.min(startIndex + this.config.itemsPerPage, totalItems);
        const pageData = this.data.filteredData.slice(startIndex, endIndex);
        
        // Show empty state if no data
        if (totalItems === 0) {
            container.innerHTML = '';
            emptyState.style.display = 'block';
            paginationInfo.innerHTML = 'Showing 0 of 0 defaulters';
            return;
        }
        
        emptyState.style.display = 'none';
        
        // Create table HTML
        let tableHTML = `
            <table class="data-table blacklist-table">
                <thead>
                    <tr>
                        <th>Borrower</th>
                        <th>Reason</th>
                        <th>Default Amount</th>
                        <th>Days Overdue</th>
                        <th>Blacklisted On</th>
                        <th>Groups Affected</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        pageData.forEach((item, index) => {
            const statusClass = this.getStatusClass(item.status);
            const statusText = this.getStatusText(item.status);
            const currency = item.currency || 'KES';
            const formattedAmount = MPUtils.Dom.formatCurrency(item.default_amount, currency);
            
            tableHTML += `
                <tr class="blacklist-row" data-user-id="${item.user_id}">
                    <td>
                        <div class="table-avatar">
                            <div class="avatar-fallback">${this.getInitials(item.name)}</div>
                            <div class="avatar-info">
                                <div class="avatar-name">${item.name}</div>
                                <div class="avatar-detail">
                                    <span class="user-id">${item.user_id}</span>
                                    <span class="user-phone">${item.phone}</span>
                                </div>
                            </div>
                        </div>
                    </td>
                    <td class="reason-cell">${item.reason}</td>
                    <td class="amount-cell">${formattedAmount}</td>
                    <td class="days-cell">
                        <span class="days-badge ${item.default_days > 120 ? 'badge-permanent' : 'badge-overdue'}">
                            ${item.default_days} days
                        </span>
                    </td>
                    <td class="date-cell">${MPUtils.Date.formatDate(item.applied_at, 'short')}</td>
                    <td class="groups-cell">
                        <div class="groups-list">
                            ${(item.groups || []).map(group => `
                                <span class="group-tag">${group}</span>
                            `).join('')}
                            <span class="group-count">${item.badge_count || 0} lenders</span>
                        </div>
                    </td>
                    <td class="status-cell">
                        <span class="status-badge ${statusClass}">${statusText}</span>
                        ${item.badge_count > 1 ? `
                            <div class="badge-count">${item.badge_count} ticks</div>
                        ` : ''}
                    </td>
                    <td class="actions-cell">
                        <div class="table-actions">
                            <button class="action-btn view" onclick="BlacklistSystem.viewDetails('${item.user_id}')" 
                                    title="View Details">👁️</button>
                            <button class="action-btn report" onclick="BlacklistSystem.reportPayment('${item.user_id}')" 
                                    title="Report Payment">💰</button>
                        </div>
                    </td>
                </tr>
            `;
        });
        
        tableHTML += `
                </tbody>
            </table>
        `;
        
        container.innerHTML = tableHTML;
        
        // Update pagination info
        paginationInfo.innerHTML = `
            Showing ${startIndex + 1}-${endIndex} of ${totalItems} defaulters
        `;
        
        // Update page numbers
        this.updatePagination(totalPages);
        
        // Update navigation buttons
        document.getElementById('prevPage').disabled = this.config.currentPage === 1;
        document.getElementById('nextPage').disabled = this.config.currentPage === totalPages;
    },

    // Get initials from name
    getInitials: function(name) {
        return name.split(' ').map(part => part[0]).join('').toUpperCase().substring(0, 2);
    },

    // Get status CSS class
    getStatusClass: function(status) {
        const classes = {
            'active': 'status-blacklisted',
            'pending': 'status-pending',
            'reported': 'status-reported',
            'cleared': 'status-cleared'
        };
        return classes[status] || 'status-blacklisted';
    },

    // Get status display text
    getStatusText: function(status) {
        const texts = {
            'active': 'BLACKLISTED',
            'pending': 'PENDING',
            'reported': 'REPORTED',
            'cleared': 'CLEARED'
        };
        return texts[status] || 'BLACKLISTED';
    },

    // Update pagination controls
    updatePagination: function(totalPages) {
        const container = document.getElementById('pageNumbers');
        if (!container) return;
        
        let html = '';
        const current = this.config.currentPage;
        
        // Always show first page
        html += `<span class="page-number ${current === 1 ? 'active' : ''}" onclick="BlacklistSystem.goToPage(1)">1</span>`;
        
        // Show ellipsis if needed
        if (current > 3) {
            html += '<span class="page-ellipsis">...</span>';
        }
        
        // Show pages around current
        for (let i = Math.max(2, current - 1); i <= Math.min(totalPages - 1, current + 1); i++) {
            html += `<span class="page-number ${current === i ? 'active' : ''}" onclick="BlacklistSystem.goToPage(${i})">${i}</span>`;
        }
        
        // Show ellipsis if needed
        if (current < totalPages - 2) {
            html += '<span class="page-ellipsis">...</span>';
        }
        
        // Always show last page if there is more than one page
        if (totalPages > 1) {
            html += `<span class="page-number ${current === totalPages ? 'active' : ''}" onclick="BlacklistSystem.goToPage(${totalPages})">${totalPages}</span>`;
        }
        
        container.innerHTML = html;
    },

    // Go to specific page
    goToPage: function(page) {
        if (page < 1 || page > Math.ceil(this.data.filteredData.length / this.config.itemsPerPage)) {
            return;
        }
        
        this.config.currentPage = page;
        this.renderTable();
        
        // Scroll to top of table
        const container = document.getElementById('blacklistContainer');
        if (container) {
            container.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    },

    // Change page by delta
    changePage: function(delta) {
        this.goToPage(this.config.currentPage + delta);
    },

    // View borrower details
    viewDetails: function(userId) {
        const borrower = this.data.blacklist.find(item => item.user_id === userId);
        if (!borrower) return;
        
        const modal = document.getElementById('borrowerModal');
        const details = document.getElementById('borrowerDetails');
        const footer = document.getElementById('modalFooter');
        
        if (!modal || !details) return;
        
        // Format groups list
        const groupsList = (borrower.groups || []).map(group => 
            `<li><span class="group-bullet">•</span> ${group}</li>`
        ).join('');
        
        // Format dates
        const appliedDate = MPUtils.Date.formatDate(borrower.applied_at, 'long');
        const overdueDays = borrower.default_days || 0;
        const statusText = this.getStatusText(borrower.status);
        const statusClass = this.getStatusClass(borrower.status);
        const currency = borrower.currency || 'KES';
        const formattedAmount = MPUtils.Dom.formatCurrency(borrower.default_amount, currency);
        
        // Check if user is admin
        const isAdmin = localStorage.getItem('userRole') === 'admin';
        
        details.innerHTML = `
            <div class="borrower-header">
                <div class="borrower-avatar">
                    <div class="avatar-large">${this.getInitials(borrower.name)}</div>
                </div>
                <div class="borrower-info">
                    <h4>${borrower.name}</h4>
                    <div class="borrower-meta">
                        <span class="meta-item">ID: ${borrower.user_id}</span>
                        <span class="meta-item">Phone: ${borrower.phone}</span>
                        <span class="meta-item status-badge ${statusClass}">${statusText}</span>
                    </div>
                </div>
            </div>
            
            <div class="borrower-details-grid">
                <div class="detail-card">
                    <h5>Default Information</h5>
                    <div class="detail-list">
                        <div class="detail-item">
                            <span class="detail-label">Amount:</span>
                            <span class="detail-value">${formattedAmount}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Days Overdue:</span>
                            <span class="detail-value">${overdueDays} days</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Blacklisted On:</span>
                            <span class="detail-value">${appliedDate}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Reason:</span>
                            <span class="detail-value">${borrower.reason}</span>
                        </div>
                    </div>
                </div>
                
                <div class="detail-card">
                    <h5>Group Information</h5>
                    <div class="detail-list">
                        <div class="detail-item">
                            <span class="detail-label">Groups Affected:</span>
                            <span class="detail-value">${borrower.groups ? borrower.groups.length : 0}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Blacklist Badge Count:</span>
                            <span class="detail-value badge-count-display">${borrower.badge_count || 0} ticks</span>
                        </div>
                    </div>
                    <div class="groups-container">
                        <h6>Affected Groups:</h6>
                        <ul class="groups-list">
                            ${groupsList || '<li>No groups specified</li>'}
                        </ul>
                    </div>
                </div>
                
                <div class="detail-card full-width">
                    <h5>Blacklist Rules Applied</h5>
                    <div class="rules-list">
                        <div class="rule-item ${overdueDays >= 60 ? 'rule-active' : ''}">
                            <span class="rule-icon">${overdueDays >= 60 ? '✅' : '⭕'}</span>
                            <span class="rule-text">Default period > 60 days: ${overdueDays >= 60 ? 'YES' : 'NO'}</span>
                        </div>
                        <div class="rule-item ${borrower.badge_count >= 1 ? 'rule-active' : ''}">
                            <span class="rule-icon">${borrower.badge_count >= 1 ? '✅' : '⭕'}</span>
                            <span class="rule-text">Lender confirmed (badge ticks): ${borrower.badge_count || 0}</span>
                        </div>
                        <div class="rule-item ${borrower.status === 'active' ? 'rule-active' : ''}">
                            <span class="rule-icon">${borrower.status === 'active' ? '✅' : '⭕'}</span>
                            <span class="rule-text">Platform-wide blocking: ${borrower.status === 'active' ? 'ACTIVE' : 'INACTIVE'}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            ${isAdmin ? `
                <div class="admin-actions">
                    <h5>Admin Actions</h5>
                    <div class="admin-buttons">
                        <button class="btn btn-sm ${borrower.status === 'cleared' ? 'secondary' : 'success'}" 
                                onclick="BlacklistSystem.adminToggleStatus('${userId}', '${borrower.status === 'cleared' ? 'active' : 'cleared'}')">
                            ${borrower.status === 'cleared' ? 'Re-blacklist' : 'Mark as Cleared'}
                        </button>
                        <button class="btn btn-sm warning" 
                                onclick="BlacklistSystem.adminUpdateBadge('${userId}', ${borrower.badge_count || 0})">
                            Update Badge Count
                        </button>
                        <button class="btn btn-sm danger" 
                                onclick="BlacklistSystem.adminRemove('${userId}')">
                            Remove from Blacklist
                        </button>
                    </div>
                </div>
            ` : ''}
        `;
        
        // Show/hide admin footer
        if (footer) {
            footer.style.display = isAdmin ? 'flex' : 'none';
        }
        
        modal.style.display = 'flex';
    },

    // Report payment for a blacklisted user
    reportPayment: function(userId) {
        const amount = prompt('Enter repayment amount received:');
        if (!amount || isNaN(amount) || amount <= 0) {
            MPUtils.Dom.showNotification('error', 'Invalid amount entered.');
            return;
        }
        
        const notes = prompt('Enter payment details (date, method, reference):');
        
        // Simulate API call
        setTimeout(() => {
            MPUtils.Dom.showNotification('success', 
                `Payment of ${amount} reported for ${userId}. Admin will review and update status if full repayment is confirmed.`);
            
            // Refresh data
            this.loadBlacklistData();
        }, 1000);
    },

    // Admin toggle status
    adminToggleStatus: function(userId, newStatus) {
        if (!confirm(`Are you sure you want to change status to ${newStatus.toUpperCase()}?`)) {
            return;
        }
        
        // In production, this would be an API call
        console.log(`Admin: Changing ${userId} status to ${newStatus}`);
        
        // Update local data for demo
        const index = this.data.blacklist.findIndex(item => item.user_id === userId);
        if (index !== -1) {
            this.data.blacklist[index].status = newStatus;
            this.applyFilters();
            this.renderTable();
            
            MPUtils.Dom.showNotification('success', 
                `Status updated to ${newStatus.toUpperCase()} for ${userId}`);
            
            // Close modal
            this.closeBorrowerModal();
        }
    },

    // Admin update badge count
    adminUpdateBadge: function(userId, currentCount) {
        const newCount = prompt(`Current badge count: ${currentCount}\nEnter new badge count:`, currentCount);
        if (!newCount || isNaN(newCount) || newCount < 0) {
            MPUtils.Dom.showNotification('error', 'Invalid badge count.');
            return;
        }
        
        // Update local data for demo
        const index = this.data.blacklist.findIndex(item => item.user_id === userId);
        if (index !== -1) {
            this.data.blacklist[index].badge_count = parseInt(newCount);
            this.applyFilters();
            this.renderTable();
            
            MPUtils.Dom.showNotification('success', 
                `Badge count updated to ${newCount} for ${userId}`);
        }
    },

    // Admin remove from blacklist
    adminRemove: function(userId) {
        if (!confirm(`Permanently remove ${userId} from blacklist? This action cannot be undone.`)) {
            return;
        }
        
        // In production, this would be an API call
        console.log(`Admin: Removing ${userId} from blacklist`);
        
        // Update local data for demo
        const index = this.data.blacklist.findIndex(item => item.user_id === userId);
        if (index !== -1) {
            this.data.blacklist.splice(index, 1);
            this.applyFilters();
            this.renderTable();
            
            MPUtils.Dom.showNotification('success', 
                `${userId} has been removed from the blacklist.`);
            
            // Close modal
            this.closeBorrowerModal();
        }
    },

    // Close borrower modal
    closeBorrowerModal: function() {
        const modal = document.getElementById('borrowerModal');
        if (modal) {
            modal.style.display = 'none';
        }
    },

    // Export to CSV
    exportToCSV: function() {
        const data = this.data.filteredData;
        if (data.length === 0) {
            MPUtils.Dom.showNotification('warning', 'No data to export.');
            return;
        }
        
        // Create CSV headers
        let csv = 'User ID,Name,Phone,Reason,Default Amount,Currency,Days Overdue,Applied At,Status,Groups,Badge Count\n';
        
        // Add data rows
        data.forEach(item => {
            const groups = (item.groups || []).join('; ');
            const row = [
                `"${item.user_id}"`,
                `"${item.name}"`,
                `"${item.phone}"`,
                `"${item.reason}"`,
                item.default_amount,
                `"${item.currency || 'KES'}"`,
                item.default_days,
                `"${item.applied_at}"`,
                `"${item.status}"`,
                `"${groups}"`,
                item.badge_count || 0
            ].join(',');
            
            csv += row + '\n';
        });
        
        // Create download link
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `blacklist-${this.config.currentCountry}-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        MPUtils.Dom.showNotification('success', 
            `Exported ${data.length} records to CSV file.`);
    },

    // Print blacklist
    printBlacklist: function() {
        const printContent = document.getElementById('blacklistContainer').cloneNode(true);
        const printWindow = window.open('', '_blank');
        
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>M-PESEWA Blacklist - ${this.config.currentCountry.toUpperCase()}</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    h1 { color: #2B1D4F; }
                    .print-date { color: #666; margin-bottom: 20px; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th { background: #f5f5f5; padding: 10px; text-align: left; border-bottom: 2px solid #ddd; }
                    td { padding: 8px; border-bottom: 1px solid #ddd; }
                    .status-badge { padding: 3px 8px; border-radius: 12px; font-size: 12px; }
                    .status-blacklisted { background: #fee; color: #c00; }
                    .status-cleared { background: #efe; color: #080; }
                </style>
            </head>
            <body>
                <h1>M-PESEWA Blacklist Registry</h1>
                <div class="print-date">
                    Country: ${this.config.currentCountry.toUpperCase()} | 
                    Printed: ${new Date().toLocaleDateString()} | 
                    Total: ${this.data.filteredData.length} records
                </div>
                ${printContent.innerHTML}
            </body>
            </html>
        `);
        
        printWindow.document.close();
        printWindow.focus();
        
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 250);
    },

    // Show/hide loading state
    showLoading: function(show) {
        const loading = document.getElementById('loadingState');
        const container = document.getElementById('blacklistContainer');
        
        if (loading) {
            loading.style.display = show ? 'block' : 'none';
        }
        
        if (container && show) {
            container.innerHTML = '';
        }
    },

    // Initialize event listeners
    initEventListeners: function() {
        // Search input
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', MPUtils.Dom.debounce(() => {
                this.config.filters.search = searchInput.value;
                this.config.currentPage = 1;
                this.applyFilters();
                this.renderTable();
            }, 300));
        }
        
        // Status filter
        const statusFilter = document.getElementById('statusFilter');
        if (statusFilter) {
            statusFilter.addEventListener('change', () => {
                this.config.filters.status = statusFilter.value;
                this.config.currentPage = 1;
                this.applyFilters();
                this.renderTable();
            });
        }
        
        // Days filter
        const daysFilter = document.getElementById('daysFilter');
        if (daysFilter) {
            daysFilter.addEventListener('change', () => {
                this.config.filters.days = daysFilter.value;
                this.config.currentPage = 1;
                this.applyFilters();
                this.renderTable();
            });
        }
        
        // Sort filter
        const sortFilter = document.getElementById('sortFilter');
        if (sortFilter) {
            sortFilter.addEventListener('change', () => {
                const [field, direction] = sortFilter.value.split(':');
                this.config.sortField = field;
                this.config.sortDirection = direction;
                this.applyFilters();
                this.renderTable();
            });
        }
    }
};

// Global functions for HTML onclick handlers
function loadBlacklistData() {
    BlacklistSystem.loadBlacklistData();
}

function filterTable() {
    BlacklistSystem.applyFilters();
    BlacklistSystem.renderTable();
}

function sortTable() {
    BlacklistSystem.applyFilters();
    BlacklistSystem.renderTable();
}

function applyFilters() {
    BlacklistSystem.applyFilters();
    BlacklistSystem.renderTable();
}

function resetFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('statusFilter').value = '';
    document.getElementById('daysFilter').value = '';
    document.getElementById('sortFilter').value = 'default_days:desc';
    
    BlacklistSystem.config.filters = {};
    BlacklistSystem.config.sortField = 'default_days';
    BlacklistSystem.config.sortDirection = 'desc';
    BlacklistSystem.config.currentPage = 1;
    
    BlacklistSystem.applyFilters();
    BlacklistSystem.renderTable();
}

function exportToCSV() {
    BlacklistSystem.exportToCSV();
}

function printBlacklist() {
    BlacklistSystem.printBlacklist();
}

function changePage(delta) {
    BlacklistSystem.changePage(delta);
}

function viewBorrowerDetails(userId) {
    BlacklistSystem.viewDetails(userId);
}

function closeBorrowerModal() {
    BlacklistSystem.closeBorrowerModal();
}

// Initialize when page loads
window.addEventListener('load', function() {
    BlacklistSystem.init();
});