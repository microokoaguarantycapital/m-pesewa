'use strict';

// Blacklist system for M-Pesewa
class BlacklistSystem {
    constructor() {
        this.blacklist = [];
        this.init();
    }

    async init() {
        await this.loadBlacklist();
        this.renderBlacklist();
        this.setupEventListeners();
    }

    async loadBlacklist() {
        try {
            const response = await fetch('../data/blacklist.json');
            this.blacklist = await response.json();
        } catch (error) {
            console.error('Failed to load blacklist:', error);
            // Fallback to demo data if file doesn't exist
            this.blacklist = await this.generateDemoBlacklist();
        }
    }

    async generateDemoBlacklist() {
        // Generate realistic demo blacklist data
        const countries = ['Kenya', 'Uganda', 'Tanzania', 'Rwanda', 'Burundi', 'Somalia', 'South Sudan', 'Ethiopia', 'DRC', 'Nigeria', 'South Africa', 'Ghana'];
        const firstNames = ['John', 'Mary', 'David', 'Sarah', 'James', 'Linda', 'Michael', 'Grace', 'Robert', 'Patricia'];
        const lastNames = ['Mwangi', 'Kamau', 'Ochieng', 'Auma', 'Odhiambo', 'Atieno', 'Okoth', 'Akinyi', 'Kiplagat', 'Chebet'];
        
        const blacklist = [];
        const today = new Date();
        
        for (let i = 0; i < 25; i++) {
            const country = countries[Math.floor(Math.random() * countries.length)];
            const defaultAmount = Math.floor(Math.random() * 50000) + 1000;
            const defaultDate = new Date();
            defaultDate.setMonth(defaultDate.getMonth() - Math.floor(Math.random() * 6) - 2);
            
            blacklist.push({
                id: `BL${1000 + i}`,
                borrowerId: `B${2000 + i}`,
                name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
                country: country,
                countryCode: country.substring(0, 3).toUpperCase(),
                groupId: `G${300 + Math.floor(Math.random() * 20)}`,
                groupName: `${country} Family Group ${Math.floor(Math.random() * 10) + 1}`,
                amountDefaulted: defaultAmount,
                currency: this.getCurrency(country),
                defaultDate: defaultDate.toISOString().split('T')[0],
                daysOverdue: Math.floor((today - defaultDate) / (1000 * 60 * 60 * 24)),
                blacklistDate: new Date(defaultDate.getTime() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                lenderId: `L${100 + Math.floor(Math.random() * 50)}`,
                lenderName: `Lender ${Math.floor(Math.random() * 100) + 1}`,
                reason: 'Default after 2 months',
                status: 'Active',
                canRemove: Math.random() > 0.7 // 30% can be removed (simulating paid status)
            });
        }
        
        return blacklist;
    }

    getCurrency(country) {
        const currencies = {
            'Kenya': 'KSh',
            'Uganda': 'UGX',
            'Tanzania': 'TZS',
            'Rwanda': 'RWF',
            'Burundi': 'BIF',
            'Somalia': 'SOS',
            'South Sudan': 'SSP',
            'Ethiopia': 'ETB',
            'DRC': 'CDF',
            'Nigeria': 'NGN',
            'South Africa': 'ZAR',
            'Ghana': 'GHS'
        };
        return currencies[country] || 'USD';
    }

    renderBlacklist() {
        const container = document.getElementById('blacklist-container');
        if (!container) return;

        if (this.blacklist.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">⚫</div>
                    <h3 class="empty-state-title">No Blacklisted Users</h3>
                    <p class="empty-state-description">All borrowers are in good standing.</p>
                </div>
            `;
            return;
        }

        let html = `
            <div class="table-container">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Borrower</th>
                            <th>Country</th>
                            <th>Group</th>
                            <th>Amount</th>
                            <th>Days Overdue</th>
                            <th>Blacklisted Since</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        this.blacklist.forEach(item => {
            const overdueClass = item.daysOverdue > 90 ? 'text-danger' : item.daysOverdue > 60 ? 'text-warning' : '';
            
            html += `
                <tr>
                    <td>
                        <div class="flex items-center gap-3">
                            <div class="avatar">${item.name.charAt(0)}</div>
                            <div>
                                <div class="font-semibold">${item.name}</div>
                                <div class="text-sm text-muted">ID: ${item.borrowerId}</div>
                            </div>
                        </div>
                    </td>
                    <td>
                        <div class="flex items-center gap-2">
                            <span class="flag-icon">${this.getFlagEmoji(item.country)}</span>
                            <span>${item.country}</span>
                        </div>
                    </td>
                    <td>${item.groupName}</td>
                    <td class="font-semibold">${item.currency} ${item.amountDefaulted.toLocaleString()}</td>
                    <td class="${overdueClass} font-semibold">${item.daysOverdue} days</td>
                    <td>${new Date(item.blacklistDate).toLocaleDateString()}</td>
                    <td>
                        <span class="badge badge-danger">BLACKLISTED</span>
                    </td>
                    <td>
                        <div class="table-actions">
                            <button class="btn btn-sm btn-outline" onclick="blacklistSystem.viewDetails('${item.id}')">
                                View
                            </button>
                            ${this.isAdmin() && item.canRemove ? `
                                <button class="btn btn-sm btn-success" onclick="blacklistSystem.removeFromBlacklist('${item.id}')">
                                    Remove
                                </button>
                            ` : ''}
                        </div>
                    </td>
                </tr>
            `;
        });

        html += `
                    </tbody>
                </table>
            </div>
        `;

        container.innerHTML = html;
        this.updateStats();
    }

    getFlagEmoji(country) {
        const flagMap = {
            'Kenya': '🇰🇪',
            'Uganda': '🇺🇬',
            'Tanzania': '🇹🇿',
            'Rwanda': '🇷🇼',
            'Burundi': '🇧🇮',
            'Somalia': '🇸🇴',
            'South Sudan': '🇸🇸',
            'Ethiopia': '🇪🇹',
            'DRC': '🇨🇩',
            'Nigeria': '🇳🇬',
            'South Africa': '🇿🇦',
            'Ghana': '🇬🇭'
        };
        return flagMap[country] || '🏳️';
    }

    updateStats() {
        const totalElement = document.getElementById('total-blacklisted');
        const amountElement = document.getElementById('total-amount-defaulted');
        const avgDaysElement = document.getElementById('avg-days-overdue');

        if (totalElement) {
            totalElement.textContent = this.blacklist.length;
        }

        if (amountElement && this.blacklist.length > 0) {
            const totalAmount = this.blacklist.reduce((sum, item) => sum + item.amountDefaulted, 0);
            amountElement.textContent = `KSh ${totalAmount.toLocaleString()}`;
        }

        if (avgDaysElement && this.blacklist.length > 0) {
            const avgDays = Math.floor(this.blacklist.reduce((sum, item) => sum + item.daysOverdue, 0) / this.blacklist.length);
            avgDaysElement.textContent = `${avgDays} days`;
        }
    }

    viewDetails(blacklistId) {
        const item = this.blacklist.find(b => b.id === blacklistId);
        if (!item) return;

        const modalHtml = `
            <div class="modal-overlay" id="blacklist-modal">
                <div class="modal-dialog">
                    <div class="modal-header">
                        <h3 class="modal-title">Blacklist Details</h3>
                        <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <h4 class="font-semibold mb-2">Borrower Information</h4>
                                <div class="space-y-2">
                                    <div class="flex justify-between">
                                        <span class="text-muted">Name:</span>
                                        <span class="font-semibold">${item.name}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-muted">Borrower ID:</span>
                                        <span>${item.borrowerId}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-muted">Country:</span>
                                        <span>${item.country}</span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h4 class="font-semibold mb-2">Loan Details</h4>
                                <div class="space-y-2">
                                    <div class="flex justify-between">
                                        <span class="text-muted">Amount Defaulted:</span>
                                        <span class="font-semibold text-danger">${item.currency} ${item.amountDefaulted.toLocaleString()}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-muted">Days Overdue:</span>
                                        <span class="font-semibold">${item.daysOverdue} days</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-muted">Default Date:</span>
                                        <span>${new Date(item.defaultDate).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="mt-6">
                            <h4 class="font-semibold mb-2">Group Information</h4>
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <div class="flex justify-between">
                                        <span class="text-muted">Group Name:</span>
                                        <span>${item.groupName}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-muted">Group ID:</span>
                                        <span>${item.groupId}</span>
                                    </div>
                                </div>
                                <div>
                                    <div class="flex justify-between">
                                        <span class="text-muted">Lender:</span>
                                        <span>${item.lenderName}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-muted">Lender ID:</span>
                                        <span>${item.lenderId}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="mt-6">
                            <h4 class="font-semibold mb-2">Blacklist Information</h4>
                            <div class="bg-alert-bg p-4 rounded-lg">
                                <div class="flex justify-between">
                                    <span class="text-muted">Blacklisted Since:</span>
                                    <span class="font-semibold">${new Date(item.blacklistDate).toLocaleDateString()}</span>
                                </div>
                                <div class="flex justify-between mt-2">
                                    <span class="text-muted">Reason:</span>
                                    <span class="text-danger">${item.reason}</span>
                                </div>
                                ${item.canRemove ? `
                                    <div class="mt-4 p-3 bg-success-bg rounded">
                                        <p class="text-success text-sm">This borrower has cleared their debt and can be removed from blacklist.</p>
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-outline" onclick="this.closest('.modal-overlay').remove()">Close</button>
                        ${this.isAdmin() && item.canRemove ? `
                            <button class="btn btn-success" onclick="blacklistSystem.removeFromBlacklist('${item.id}', true)">Remove from Blacklist</button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }

    removeFromBlacklist(blacklistId, fromModal = false) {
        if (!this.isAdmin()) {
            alert('Only platform administrators can remove from blacklist.');
            return;
        }

        if (confirm('Are you sure you want to remove this borrower from the blacklist? This action cannot be undone.')) {
            // In a real app, this would be an API call
            this.blacklist = this.blacklist.filter(item => item.id !== blacklistId);
            this.renderBlacklist();
            
            if (fromModal) {
                const modal = document.getElementById('blacklist-modal');
                if (modal) modal.remove();
            }
            
            // Show success notification
            this.showNotification('Borrower removed from blacklist successfully.', 'success');
        }
    }

    searchBlacklist(query) {
        const searchTerm = query.toLowerCase().trim();
        if (!searchTerm) {
            this.renderBlacklist();
            return;
        }

        const filtered = this.blacklist.filter(item =>
            item.name.toLowerCase().includes(searchTerm) ||
            item.borrowerId.toLowerCase().includes(searchTerm) ||
            item.country.toLowerCase().includes(searchTerm) ||
            item.groupName.toLowerCase().includes(searchTerm)
        );

        this.renderFilteredBlacklist(filtered);
    }

    renderFilteredBlacklist(filteredList) {
        const container = document.getElementById('blacklist-container');
        if (!container) return;

        if (filteredList.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">🔍</div>
                    <h3 class="empty-state-title">No Results Found</h3>
                    <p class="empty-state-description">Try searching with different terms.</p>
                </div>
            `;
            return;
        }

        // Similar rendering logic as renderBlacklist but with filteredList
        let html = `
            <div class="table-container">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Borrower</th>
                            <th>Country</th>
                            <th>Group</th>
                            <th>Amount</th>
                            <th>Days Overdue</th>
                            <th>Blacklisted Since</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        filteredList.forEach(item => {
            const overdueClass = item.daysOverdue > 90 ? 'text-danger' : item.daysOverdue > 60 ? 'text-warning' : '';
            
            html += `
                <tr>
                    <td>
                        <div class="flex items-center gap-3">
                            <div class="avatar">${item.name.charAt(0)}</div>
                            <div>
                                <div class="font-semibold">${item.name}</div>
                                <div class="text-sm text-muted">ID: ${item.borrowerId}</div>
                            </div>
                        </div>
                    </td>
                    <td>
                        <div class="flex items-center gap-2">
                            <span class="flag-icon">${this.getFlagEmoji(item.country)}</span>
                            <span>${item.country}</span>
                        </div>
                    </td>
                    <td>${item.groupName}</td>
                    <td class="font-semibold">${item.currency} ${item.amountDefaulted.toLocaleString()}</td>
                    <td class="${overdueClass} font-semibold">${item.daysOverdue} days</td>
                    <td>${new Date(item.blacklistDate).toLocaleDateString()}</td>
                    <td>
                        <span class="badge badge-danger">BLACKLISTED</span>
                    </td>
                    <td>
                        <div class="table-actions">
                            <button class="btn btn-sm btn-outline" onclick="blacklistSystem.viewDetails('${item.id}')">
                                View
                            </button>
                            ${this.isAdmin() && item.canRemove ? `
                                <button class="btn btn-sm btn-success" onclick="blacklistSystem.removeFromBlacklist('${item.id}')">
                                    Remove
                                </button>
                            ` : ''}
                        </div>
                    </td>
                </tr>
            `;
        });

        html += `
                    </tbody>
                </table>
            </div>
        `;

        container.innerHTML = html;
    }

    filterByCountry(country) {
        if (!country) {
            this.renderBlacklist();
            return;
        }

        const filtered = this.blacklist.filter(item => item.country === country);
        this.renderFilteredBlacklist(filtered);
    }

    setupEventListeners() {
        const searchInput = document.getElementById('blacklist-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchBlacklist(e.target.value);
            });
        }

        const countryFilter = document.getElementById('country-filter');
        if (countryFilter) {
            countryFilter.addEventListener('change', (e) => {
                this.filterByCountry(e.target.value);
            });
        }
    }

    isAdmin() {
        // Check if current user is admin
        const userRole = localStorage.getItem('userRole');
        return userRole === 'admin';
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-header">
                <span class="notification-title">${type.charAt(0).toUpperCase() + type.slice(1)}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
            </div>
            <div class="notification-content">${message}</div>
        `;
        
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 5000);
    }

    // Method to check if a borrower is blacklisted
    isBorrowerBlacklisted(borrowerId) {
        return this.blacklist.some(item => item.borrowerId === borrowerId && item.status === 'Active');
    }

    // Method to get blacklist status for display
    getBlacklistStatus(borrowerId) {
        const item = this.blacklist.find(b => b.borrowerId === borrowerId && b.status === 'Active');
        if (!item) return null;
        
        return {
            isBlacklisted: true,
            daysOverdue: item.daysOverdue,
            amountDefaulted: item.amountDefaulted,
            currency: item.currency,
            blacklistDate: item.blacklistDate
        };
    }
}

// Initialize blacklist system
const blacklistSystem = new BlacklistSystem();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = blacklistSystem;
}