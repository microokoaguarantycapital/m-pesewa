// assets/js/blacklist.js
// Blacklist system

const MPesewaBlacklist = (function() {
    'use strict';

    // Blacklist entry structure
    const blacklistEntryTemplate = {
        id: '',
        userId: '',
        userName: '',
        country: '',
        groupId: '',
        groupName: '',
        loanId: '',
        principal: 0,
        totalDue: 0,
        defaultDate: '',
        daysOverdue: 0,
        status: 'active', // active, cleared, appealed
        addedBy: '', // admin ID
        addedDate: '',
        clearedBy: '', // admin ID
        clearedDate: '',
        clearanceReason: '',
        notes: ''
    };

    // Initialize blacklist
    function initBlacklist() {
        let blacklist = JSON.parse(localStorage.getItem('mpesewa_blacklist')) || [];
        
        // Load demo data if empty
        if (blacklist.length === 0) {
            fetch('../data/demo-blacklist.json')
                .then(response => response.json())
                .then(data => {
                    localStorage.setItem('mpesewa_blacklist', JSON.stringify(data.blacklist));
                    blacklist = data.blacklist;
                })
                .catch(() => {
                    blacklist = createDemoBlacklist();
                });
        }
        
        return blacklist;
    }

    // Create demo blacklist
    function createDemoBlacklist() {
        const demoBlacklist = [
            {
                id: 'BLK001',
                userId: 'USR011',
                userName: 'John Default',
                country: 'KE',
                groupId: 'GRP001',
                groupName: 'Family Trust Circle',
                loanId: 'LED005',
                principal: 10000,
                totalDue: 15000,
                defaultDate: new Date(Date.now() - 70 * 86400000).toISOString(),
                daysOverdue: 70,
                status: 'active',
                addedBy: 'ADM001',
                addedDate: new Date(Date.now() - 65 * 86400000).toISOString(),
                clearedBy: '',
                clearedDate: '',
                clearanceReason: '',
                notes: 'Defaulted after 60 days. Multiple contact attempts failed.'
            },
            {
                id: 'BLK002',
                userId: 'USR012',
                userName: 'Jane Nonpayer',
                country: 'KE',
                groupId: 'GRP002',
                groupName: 'Nairobi Business Network',
                loanId: 'LED006',
                principal: 25000,
                totalDue: 35000,
                defaultDate: new Date(Date.now() - 90 * 86400000).toISOString(),
                daysOverdue: 90,
                status: 'active',
                addedBy: 'ADM001',
                addedDate: new Date(Date.now() - 70 * 86400000).toISOString(),
                clearedBy: '',
                clearedDate: '',
                clearanceReason: '',
                notes: 'Business failed, unable to repay. Negotiations ongoing.'
            },
            {
                id: 'BLK003',
                userId: 'USR013',
                userName: 'Robert Cleared',
                country: 'UG',
                groupId: 'GRP003',
                groupName: 'Kampala Traders',
                loanId: 'LED007',
                principal: 15000,
                totalDue: 20000,
                defaultDate: new Date(Date.now() - 100 * 86400000).toISOString(),
                daysOverdue: 100,
                status: 'cleared',
                addedBy: 'ADM001',
                addedDate: new Date(Date.now() - 80 * 86400000).toISOString(),
                clearedBy: 'ADM001',
                clearedDate: new Date(Date.now() - 10 * 86400000).toISOString(),
                clearanceReason: 'Full repayment received with penalties',
                notes: 'Cleared after legal intervention.'
            }
        ];
        
        localStorage.setItem('mpesewa_blacklist', JSON.stringify(demoBlacklist));
        return demoBlacklist;
    }

    // Check if user is blacklisted
    function isUserBlacklisted(userId) {
        const blacklist = initBlacklist();
        const activeEntry = blacklist.find(entry => 
            entry.userId === userId && 
            entry.status === 'active'
        );
        return activeEntry || null;
    }

    // Get all blacklisted users
    function getBlacklistedUsers() {
        const blacklist = initBlacklist();
        return blacklist.filter(entry => entry.status === 'active');
    }

    // Get blacklist entry by ID
    function getBlacklistEntry(entryId) {
        const blacklist = initBlacklist();
        return blacklist.find(entry => entry.id === entryId);
    }

    // Add user to blacklist
    function addToBlacklist(entryData) {
        const blacklist = initBlacklist();
        
        // Generate entry ID
        const entryId = 'BLK' + String(blacklist.length + 1).padStart(3, '0');
        
        const newEntry = {
            ...blacklistEntryTemplate,
            ...entryData,
            id: entryId,
            addedDate: new Date().toISOString(),
            status: 'active'
        };
        
        // Validate entry
        if (!newEntry.userId || !newEntry.loanId) {
            return { success: false, message: 'Missing required fields' };
        }
        
        // Check if user is already blacklisted
        const existingEntry = isUserBlacklisted(newEntry.userId);
        if (existingEntry) {
            return { 
                success: false, 
                message: 'User is already blacklisted' 
            };
        }
        
        blacklist.push(newEntry);
        localStorage.setItem('mpesewa_blacklist', JSON.stringify(blacklist));
        
        // Update user's blacklisted status
        updateUserBlacklistStatus(newEntry.userId, true);
        
        return { 
            success: true, 
            message: 'User added to blacklist',
            entry: newEntry
        };
    }

    // Remove user from blacklist
    function removeFromBlacklist(entryId, clearedBy, reason) {
        const blacklist = initBlacklist();
        const entryIndex = blacklist.findIndex(entry => entry.id === entryId);
        
        if (entryIndex === -1) {
            return { success: false, message: 'Blacklist entry not found' };
        }
        
        const entry = blacklist[entryIndex];
        
        // Check if entry is already cleared
        if (entry.status === 'cleared') {
            return { success: false, message: 'Entry is already cleared' };
        }
        
        // Update entry
        entry.status = 'cleared';
        entry.clearedBy = clearedBy;
        entry.clearedDate = new Date().toISOString();
        entry.clearanceReason = reason || '';
        entry.notes = entry.notes ? 
            entry.notes + ' | Cleared: ' + reason : 
            'Cleared: ' + reason;
        
        blacklist[entryIndex] = entry;
        localStorage.setItem('mpesewa_blacklist', JSON.stringify(blacklist));
        
        // Update user's blacklisted status
        updateUserBlacklistStatus(entry.userId, false);
        
        return { 
            success: true, 
            message: 'User removed from blacklist',
            entry: entry
        };
    }

    // Update user's blacklisted status
    function updateUserBlacklistStatus(userId, blacklisted) {
        const users = JSON.parse(localStorage.getItem('mpesewa_users')) || [];
        const userIndex = users.findIndex(u => u.id === userId);
        
        if (userIndex !== -1) {
            users[userIndex].blacklisted = blacklisted;
            users[userIndex].blacklistUpdated = new Date().toISOString();
            localStorage.setItem('mpesewa_users', JSON.stringify(users));
        }
    }

    // Check for defaults and auto-blacklist
    function checkForDefaults() {
        const ledgers = JSON.parse(localStorage.getItem('mpesewa_ledgers')) || [];
        const now = new Date();
        
        let defaultsFound = 0;
        
        ledgers.forEach(ledger => {
            if (ledger.status === 'active' || ledger.status === 'overdue') {
                const dueDate = new Date(ledger.dueDate);
                const daysOverdue = Math.floor((now - dueDate) / (1000 * 60 * 60 * 24));
                
                // Auto-blacklist after 60 days overdue
                if (daysOverdue >= 60 && ledger.status !== 'defaulted') {
                    // Mark ledger as defaulted
                    ledger.status = 'defaulted';
                    ledger.defaultDate = new Date().toISOString();
                    
                    // Add to blacklist
                    const entryData = {
                        userId: ledger.borrowerId,
                        userName: getBorrowerName(ledger.borrowerId),
                        country: getBorrowerCountry(ledger.borrowerId),
                        groupId: ledger.groupId,
                        groupName: getGroupName(ledger.groupId),
                        loanId: ledger.id,
                        principal: ledger.principal,
                        totalDue: ledger.totalDue,
                        defaultDate: new Date().toISOString(),
                        daysOverdue: daysOverdue,
                        addedBy: 'SYSTEM',
                        notes: `Auto-blacklisted after ${daysOverdue} days overdue`
                    };
                    
                    addToBlacklist(entryData);
                    defaultsFound++;
                }
            }
        });
        
        // Save updated ledgers
        if (defaultsFound > 0) {
            localStorage.setItem('mpesewa_ledgers', JSON.stringify(ledgers));
        }
        
        return defaultsFound;
    }

    // Get blacklist statistics
    function getBlacklistStats() {
        const blacklist = initBlacklist();
        const active = blacklist.filter(entry => entry.status === 'active').length;
        const cleared = blacklist.filter(entry => entry.status === 'cleared').length;
        const appealed = blacklist.filter(entry => entry.status === 'appealed').length;
        
        const totalDefaulted = blacklist.reduce((sum, entry) => sum + entry.principal, 0);
        const totalRecovered = blacklist
            .filter(entry => entry.status === 'cleared')
            .reduce((sum, entry) => sum + entry.principal, 0);
        
        const recoveryRate = totalDefaulted > 0 ? 
            (totalRecovered / totalDefaulted) * 100 : 0;
        
        // Group by country
        const countries = {};
        blacklist.forEach(entry => {
            if (!countries[entry.country]) {
                countries[entry.country] = 0;
            }
            countries[entry.country]++;
        });
        
        return {
            totalEntries: blacklist.length,
            active: active,
            cleared: cleared,
            appealed: appealed,
            totalDefaulted: totalDefaulted,
            totalRecovered: totalRecovered,
            recoveryRate: recoveryRate,
            byCountry: countries
        };
    }

    // Search blacklist
    function searchBlacklist(query) {
        const blacklist = initBlacklist();
        const searchTerm = query.toLowerCase();
        
        return blacklist.filter(entry => 
            entry.userName.toLowerCase().includes(searchTerm) ||
            entry.userId.toLowerCase().includes(searchTerm) ||
            entry.groupName.toLowerCase().includes(searchTerm) ||
            entry.country.toLowerCase().includes(searchTerm)
        );
    }

    // Filter blacklist
    function filterBlacklist(filters) {
        let entries = initBlacklist();
        
        // Status filter
        if (filters.status && filters.status !== 'all') {
            entries = entries.filter(entry => entry.status === filters.status);
        }
        
        // Country filter
        if (filters.country && filters.country !== 'all') {
            entries = entries.filter(entry => entry.country === filters.country);
        }
        
        // Days overdue filter
        if (filters.minDays) {
            entries = entries.filter(entry => entry.daysOverdue >= filters.minDays);
        }
        
        if (filters.maxDays) {
            entries = entries.filter(entry => entry.daysOverdue <= filters.maxDays);
        }
        
        // Amount filter
        if (filters.minAmount) {
            entries = entries.filter(entry => entry.principal >= filters.minAmount);
        }
        
        if (filters.maxAmount) {
            entries = entries.filter(entry => entry.principal <= filters.maxAmount);
        }
        
        // Date range filter
        if (filters.startDate) {
            const startDate = new Date(filters.startDate);
            entries = entries.filter(entry => new Date(entry.defaultDate) >= startDate);
        }
        
        if (filters.endDate) {
            const endDate = new Date(filters.endDate);
            entries = entries.filter(entry => new Date(entry.defaultDate) <= endDate);
        }
        
        return entries;
    }

    // Render blacklist table
    function renderBlacklistTable(entries, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        container.innerHTML = '';
        
        if (!entries || entries.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">✅</div>
                    <h3 class="empty-title">No Blacklisted Users</h3>
                    <p class="empty-description">No users are currently blacklisted.</p>
                </div>
            `;
            return;
        }
        
        const table = document.createElement('table');
        table.className = 'data-table blacklist-table';
        table.innerHTML = `
            <thead>
                <tr>
                    <th>User</th>
                    <th>Country</th>
                    <th>Group</th>
                    <th>Amount</th>
                    <th>Days Overdue</th>
                    <th>Default Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${entries.map(entry => {
                    const statusColor = getStatusColor(entry.status);
                    const countryFlag = getCountryFlag(entry.country);
                    
                    return `
                        <tr class="blacklist-row ${entry.status}">
                            <td>
                                <div class="table-avatar">
                                    <div class="avatar-fallback">${entry.userName.charAt(0)}</div>
                                    <div class="avatar-info">
                                        <span class="avatar-name">${entry.userName}</span>
                                        <span class="avatar-detail">${entry.userId}</span>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div class="country-cell">
                                    <span class="country-flag">${countryFlag}</span>
                                    <span>${entry.country}</span>
                                </div>
                            </td>
                            <td>
                                <span class="group-name">${entry.groupName}</span>
                            </td>
                            <td class="table-cell-number">
                                <strong>Ksh ${entry.principal.toLocaleString()}</strong>
                                <div class="total-due">Due: Ksh ${entry.totalDue.toLocaleString()}</div>
                            </td>
                            <td class="table-cell-center">
                                <span class="days-overdue ${entry.daysOverdue > 90 ? 'severe' : entry.daysOverdue > 60 ? 'high' : 'medium'}">
                                    ${entry.daysOverdue}
                                </span>
                            </td>
                            <td>
                                ${formatDate(entry.defaultDate)}
                            </td>
                            <td>
                                <span class="table-status" style="background: ${statusColor}20; color: ${statusColor};">
                                    ${entry.status.toUpperCase()}
                                </span>
                            </td>
                            <td class="table-cell-actions">
                                <div class="table-actions">
                                    <button class="action-btn view" title="View Details" data-entry-id="${entry.id}">
                                        👁️
                                    </button>
                                    ${entry.status === 'active' ? `
                                    <button class="action-btn clear" title="Clear Entry" data-entry-id="${entry.id}">
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
                const entryId = this.getAttribute('data-entry-id');
                viewBlacklistDetails(entryId);
            });
        });
        
        container.querySelectorAll('.action-btn.clear').forEach(button => {
            button.addEventListener('click', function() {
                const entryId = this.getAttribute('data-entry-id');
                clearBlacklistEntry(entryId);
            });
        });
    }

    // Render blacklist statistics
    function renderBlacklistStats(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const stats = getBlacklistStats();
        
        container.innerHTML = `
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-header">
                        <div class="stat-icon error">
                            ⚠️
                        </div>
                        <div class="stat-content">
                            <div class="stat-value">${stats.active}</div>
                            <div class="stat-label">Active Blacklist Entries</div>
                        </div>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-header">
                        <div class="stat-icon warning">
                            💰
                        </div>
                        <div class="stat-content">
                            <div class="stat-value">Ksh ${stats.totalDefaulted.toLocaleString()}</div>
                            <div class="stat-label">Total Amount Defaulted</div>
                        </div>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-header">
                        <div class="stat-icon success">
                            ✅
                        </div>
                        <div class="stat-content">
                            <div class="stat-value">${stats.cleared}</div>
                            <div class="stat-label">Cleared Entries</div>
                        </div>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-header">
                        <div class="stat-icon info">
                            📊
                        </div>
                        <div class="stat-content">
                            <div class="stat-value">${stats.recoveryRate.toFixed(1)}%</div>
                            <div class="stat-label">Recovery Rate</div>
                        </div>
                    </div>
                </div>
            </div>
            
            ${Object.keys(stats.byCountry).length > 0 ? `
            <div class="country-breakdown">
                <h4>Blacklist by Country</h4>
                <div class="country-list">
                    ${Object.entries(stats.byCountry).map(([country, count]) => `
                        <div class="country-item">
                            <span class="country-flag">${getCountryFlag(country)}</span>
                            <span class="country-name">${getCountryName(country)}</span>
                            <span class="country-count">${count} users</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            ` : ''}
        `;
    }

    // UI event handlers
    function viewBlacklistDetails(entryId) {
        const entry = getBlacklistEntry(entryId);
        if (!entry) {
            alert('Blacklist entry not found');
            return;
        }
        
        const modal = document.getElementById('blacklistDetailsModal');
        if (modal) {
            renderBlacklistDetails(entry, 'blacklistDetailsContent');
            modal.style.display = 'block';
        } else {
            createBlacklistModal(entry);
        }
    }

    function clearBlacklistEntry(entryId) {
        const currentUser = JSON.parse(localStorage.getItem('mpesewa_currentUser'));
        if (!currentUser || currentUser.role !== 'admin') {
            alert('Only administrators can clear blacklist entries');
            return;
        }
        
        const reason = prompt('Enter reason for clearing this blacklist entry:');
        if (!reason) return;
        
        const result = removeFromBlacklist(entryId, currentUser.id, reason);
        alert(result.message);
        
        if (result.success) {
            // Refresh UI
            const blacklistedUsers = getBlacklistedUsers();
            if (document.getElementById('blacklistTableContainer')) {
                renderBlacklistTable(blacklistedUsers, 'blacklistTableContainer');
            }
            
            if (document.getElementById('blacklistStatsContainer')) {
                renderBlacklistStats('blacklistStatsContainer');
            }
        }
    }

    // Helper functions
    function getBorrowerName(userId) {
        const users = JSON.parse(localStorage.getItem('mpesewa_users')) || [];
        const user = users.find(u => u.id === userId);
        return user ? user.name : 'Unknown User';
    }

    function getBorrowerCountry(userId) {
        const users = JSON.parse(localStorage.getItem('mpesewa_users')) || [];
        const user = users.find(u => u.id === userId);
        return user ? user.country : 'KE';
    }

    function getGroupName(groupId) {
        const groups = JSON.parse(localStorage.getItem('mpesewa_groups')) || [];
        const group = groups.find(g => g.id === groupId);
        return group ? group.name : 'Unknown Group';
    }

    function getStatusColor(status) {
        const colors = {
            'active': '#EF4444',
            'cleared': '#10B981',
            'appealed': '#F59E0B'
        };
        return colors[status] || '#6B7280';
    }

    function getCountryFlag(countryCode) {
        const flags = {
            'KE': '🇰🇪',
            'UG': '🇺🇬',
            'TZ': '🇹🇿',
            'RW': '🇷🇼',
            'NG': '🇳🇬',
            'GH': '🇬🇭',
            'ZA': '🇿🇦',
            'EG': '🇪🇬',
            'ET': '🇪🇹',
            'SN': '🇸🇳'
        };
        return flags[countryCode] || '🇺🇳';
    }

    function getCountryName(countryCode) {
        const countries = {
            'KE': 'Kenya',
            'UG': 'Uganda',
            'TZ': 'Tanzania',
            'RW': 'Rwanda',
            'NG': 'Nigeria',
            'GH': 'Ghana',
            'ZA': 'South Africa',
            'EG': 'Egypt',
            'ET': 'Ethiopia',
            'SN': 'Senegal'
        };
        return countries[countryCode] || 'Unknown';
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }

    function renderBlacklistDetails(entry, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        container.innerHTML = `
            <div class="blacklist-details">
                <div class="details-header">
                    <h3>Blacklist Entry: ${entry.id}</h3>
                    <span class="entry-status ${entry.status}">${entry.status.toUpperCase()}</span>
                </div>
                
                <div class="details-grid">
                    <div class="detail-section">
                        <h4>User Information</h4>
                        <div class="detail-item">
                            <span>Name:</span>
                            <strong>${entry.userName}</strong>
                        </div>
                        <div class="detail-item">
                            <span>User ID:</span>
                            <span>${entry.userId}</span>
                        </div>
                        <div class="detail-item">
                            <span>Country:</span>
                            <span>
                                ${getCountryFlag(entry.country)} 
                                ${getCountryName(entry.country)}
                            </span>
                        </div>
                    </div>
                    
                    <div class="detail-section">
                        <h4>Loan Information</h4>
                        <div class="detail-item">
                            <span>Loan ID:</span>
                            <span>${entry.loanId}</span>
                        </div>
                        <div class="detail-item">
                            <span>Group:</span>
                            <span>${entry.groupName}</span>
                        </div>
                        <div class="detail-item">
                            <span>Principal:</span>
                            <strong>Ksh ${entry.principal.toLocaleString()}</strong>
                        </div>
                        <div class="detail-item">
                            <span>Total Due:</span>
                            <strong>Ksh ${entry.totalDue.toLocaleString()}</strong>
                        </div>
                    </div>
                    
                    <div class="detail-section">
                        <h4>Default Details</h4>
                        <div class="detail-item">
                            <span>Default Date:</span>
                            <span>${formatDate(entry.defaultDate)}</span>
                        </div>
                        <div class="detail-item">
                            <span>Days Overdue:</span>
                            <span class="days-overdue ${entry.daysOverdue > 90 ? 'severe' : entry.daysOverdue > 60 ? 'high' : 'medium'}">
                                ${entry.daysOverdue} days
                            </span>
                        </div>
                        <div class="detail-item">
                            <span>Added By:</span>
                            <span>${entry.addedBy}</span>
                        </div>
                        <div class="detail-item">
                            <span>Added Date:</span>
                            <span>${formatDate(entry.addedDate)}</span>
                        </div>
                    </div>
                    
                    ${entry.status === 'cleared' ? `
                    <div class="detail-section">
                        <h4>Clearance Details</h4>
                        <div class="detail-item">
                            <span>Cleared By:</span>
                            <span>${entry.clearedBy}</span>
                        </div>
                        <div class="detail-item">
                            <span>Cleared Date:</span>
                            <span>${formatDate(entry.clearedDate)}</span>
                        </div>
                        <div class="detail-item">
                            <span>Reason:</span>
                            <span>${entry.clearanceReason}</span>
                        </div>
                    </div>
                    ` : ''}
                </div>
                
                ${entry.notes ? `
                <div class="notes-section">
                    <h4>Notes</h4>
                    <p>${entry.notes}</p>
                </div>
                ` : ''}
                
                <div class="details-actions">
                    ${entry.status === 'active' ? `
                    <button class="btn primary clear-entry-btn" data-entry-id="${entry.id}">
                        Clear Entry
                    </button>
                    ` : ''}
                    <button class="btn secondary close-details-btn">
                        Close
                    </button>
                </div>
            </div>
        `;
        
        // Add event listeners
        container.querySelector('.clear-entry-btn')?.addEventListener('click', function() {
            const entryId = this.getAttribute('data-entry-id');
            clearBlacklistEntry(entryId);
        });
        
        container.querySelector('.close-details-btn')?.addEventListener('click', function() {
            const modal = document.getElementById('blacklistDetailsModal');
            if (modal) modal.style.display = 'none';
        });
    }

    function createBlacklistModal(entry) {
        const modal = document.createElement('div');
        modal.id = 'blacklistDetailsModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Blacklist Details</h3>
                    <button class="modal-close" onclick="this.parentElement.parentElement.style.display='none'">×</button>
                </div>
                <div class="modal-body">
                    <div id="blacklistDetailsContent"></div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        renderBlacklistDetails(entry, 'blacklistDetailsContent');
        modal.style.display = 'block';
    }

    // Public API
    return {
        init: initBlacklist,
        isUserBlacklisted,
        getBlacklistedUsers,
        getBlacklistEntry,
        addToBlacklist,
        removeFromBlacklist,
        checkForDefaults,
        getBlacklistStats,
        searchBlacklist,
        filterBlacklist,
        renderBlacklistTable,
        renderBlacklistStats,
        viewBlacklistDetails,
        clearBlacklistEntry
    };
})();

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    if (typeof MPesewa !== 'undefined') {
        MPesewa.Blacklist = MPesewaBlacklist;
        
        // Check for defaults on page load (only do this occasionally in real app)
        // MPesewaBlacklist.checkForDefaults();
    }
});