/**
 * M-PESEWA BLACKLIST STATE SLICE
 * Strict Hierarchy: Global → Country → Groups → Lenders → Borrowers (Ledgers)
 * Country Isolation: No cross-country blacklist visibility
 * 
 * RULES:
 * 1. Blacklist triggered after 2 months of non-payment
 * 2. Blacklisted borrowers cannot borrow or join new groups
 * 3. Removal only by Platform Admin after full repayment
 * 4. Blacklist badge visible platform-wide within same country
 * 5. No cross-country blacklist sharing
 */

const BLACKLIST_CONFIG = {
    // Default state structure
    initialState: {
        // Country-specific blacklists
        countryBlacklists: {
            // Example structure for Kenya
            // 'KE': {
            //     groupBlacklists: {
            //         'group1': {
            //             lenderBlacklists: {
            //                 'lender1': {
            //                     blacklistedBorrowers: {
            //                         'borrower1': { ... }
            //                     }
            //                 }
            //             }
            //         }
            //     }
            // }
        },
        
        // Global blacklist registry (admin only)
        globalRegistry: {},
        
        // Blacklist statistics
        stats: {
            totalBlacklisted: 0,
            byCountry: {},
            byGroupType: {},
            byCategory: {},
            averageDaysOverdue: 0,
            totalAmountOwed: 0
        },
        
        // Blacklist appeals
        appeals: [],
        
        // Settings
        settings: {
            autoBlacklistAfterDays: 60, // 2 months
            requireAdminApproval: true,
            allowLenderRemoval: false,
            showPublicBlacklist: true,
            notifyGroupOnBlacklist: true,
            penaltyRate: 0.05, // 5% daily after 7 days
            interestRate: 0.10 // 10% interest
        },
        
        // UI State
        ui: {
            loading: false,
            error: null,
            success: null,
            currentView: 'active', // 'active', 'cleared', 'appeals', 'stats'
            filters: {
                country: null,
                group: null,
                lender: null,
                daysOverdueMin: 0,
                daysOverdueMax: null,
                amountMin: 0,
                amountMax: null,
                dateFrom: null,
                dateTo: null
            },
            sortBy: 'daysOverdue',
            sortOrder: 'desc'
        }
    },
    
    // Supported countries (strict isolation)
    COUNTRIES: [
        { code: 'KE', name: 'Kenya', currency: 'KSh' },
        { code: 'UG', name: 'Uganda', currency: 'UGX' },
        { code: 'TZ', name: 'Tanzania', currency: 'TZS' },
        { code: 'RW', name: 'Rwanda', currency: 'RWF' },
        { code: 'CD', name: 'DRC', currency: 'CDF' },
        { code: 'BI', name: 'Burundi', currency: 'BIF' },
        { code: 'NG', name: 'Nigeria', currency: 'NGN' },
        { code: 'GH', name: 'Ghana', currency: 'GHS' },
        { code: 'SS', name: 'South Sudan', currency: 'SSP' },
        { code: 'SO', name: 'Somalia', currency: 'SOS' },
        { code: 'ZA', name: 'South Africa', currency: 'ZAR' },
        { code: 'ET', name: 'Ethiopia', currency: 'ETB' }
    ],
    
    // Blacklist reasons
    REASONS: {
        DEFAULT_2_MONTHS: 'default_2_months',
        FRAUD: 'fraud',
        IDENTITY_THEFT: 'identity_theft',
        MULTIPLE_DEFAULTS: 'multiple_defaults',
        FALSIFIED_INFO: 'falsified_information',
        HARASSMENT: 'harassment',
        PLATFORM_ABUSE: 'platform_abuse'
    },
    
    // Blacklist status
    STATUS: {
        ACTIVE: 'active',
        APPEALED: 'appealed',
        UNDER_REVIEW: 'under_review',
        CLEARED: 'cleared',
        PARTIALLY_CLEARED: 'partially_cleared',
        ESCALATED: 'escalated'
    }
};

/**
 * Create a new blacklist slice with all required functionality
 */
const createBlacklistSlice = () => {
    let state = JSON.parse(JSON.stringify(BLACKLIST_CONFIG.initialState));
    
    // Initialize from localStorage
    const initialize = () => {
        try {
            const saved = localStorage.getItem('mpesewa_blacklist_state');
            if (saved) {
                const parsed = JSON.parse(saved);
                state = { ...state, ...parsed };
            }
            
            // Initialize country structures if not present
            BLACKLIST_CONFIG.COUNTRIES.forEach(country => {
                if (!state.countryBlacklists[country.code]) {
                    state.countryBlacklists[country.code] = {
                        groupBlacklists: {},
                        countryStats: {
                            totalBlacklisted: 0,
                            totalAmountOwed: 0,
                            averageDaysOverdue: 0,
                            groupsWithBlacklists: 0,
                            lendersWithBlacklists: 0
                        },
                        lastUpdated: new Date().toISOString()
                    };
                }
            });
            
            saveState();
            return true;
        } catch (error) {
            console.error('Failed to initialize blacklist state:', error);
            return false;
        }
    };
    
    // Save state to localStorage
    const saveState = () => {
        try {
            localStorage.setItem('mpesewa_blacklist_state', JSON.stringify(state));
        } catch (error) {
            console.error('Failed to save blacklist state:', error);
        }
    };
    
    // Update statistics
    const updateStats = () => {
        let totalBlacklisted = 0;
        let totalAmountOwed = 0;
        let totalDaysOverdue = 0;
        let count = 0;
        const byCountry = {};
        const byGroupType = {};
        const byCategory = {};
        
        // Initialize country stats
        BLACKLIST_CONFIG.COUNTRIES.forEach(country => {
            byCountry[country.code] = {
                total: 0,
                amount: 0,
                groups: new Set()
            };
        });
        
        // Calculate stats from active blacklists
        Object.entries(state.countryBlacklists).forEach(([countryCode, countryData]) => {
            Object.entries(countryData.groupBlacklists).forEach(([groupId, groupData]) => {
                Object.entries(groupData.lenderBlacklists).forEach(([lenderId, lenderData]) => {
                    Object.entries(lenderData.blacklistedBorrowers).forEach(([borrowerId, borrowerData]) => {
                        if (borrowerData.status === BLACKLIST_CONFIG.STATUS.ACTIVE) {
                            totalBlacklisted++;
                            totalAmountOwed += borrowerData.amountOwed;
                            totalDaysOverdue += borrowerData.daysOverdue;
                            count++;
                            
                            // Country stats
                            if (byCountry[countryCode]) {
                                byCountry[countryCode].total++;
                                byCountry[countryCode].amount += borrowerData.amountOwed;
                                byCountry[countryCode].groups.add(groupId);
                            }
                            
                            // Group type stats
                            const groupType = borrowerData.groupType || 'unknown';
                            byGroupType[groupType] = (byGroupType[groupType] || 0) + 1;
                            
                            // Category stats
                            const category = borrowerData.loanCategory || 'unknown';
                            byCategory[category] = (byCategory[category] || 0) + 1;
                        }
                    });
                });
            });
        });
        
        // Update state
        state.stats = {
            totalBlacklisted,
            byCountry: Object.fromEntries(
                Object.entries(byCountry).map(([code, data]) => [
                    code,
                    {
                        total: data.total,
                        amount: data.amount,
                        groupsCount: data.groups.size,
                        percentage: totalBlacklisted > 0 ? (data.total / totalBlacklisted * 100).toFixed(2) : 0
                    }
                ])
            ),
            byGroupType,
            byCategory,
            averageDaysOverdue: count > 0 ? Math.round(totalDaysOverdue / count) : 0,
            totalAmountOwed
        };
        
        saveState();
    };
    
    // STRICT HIERARCHY ENFORCEMENT
    const enforceHierarchy = (countryCode, groupId, lenderId, borrowerId) => {
        // 1. Country must exist in supported countries
        const country = BLACKLIST_CONFIG.COUNTRIES.find(c => c.code === countryCode);
        if (!country) {
            throw new Error(`Country ${countryCode} not supported`);
        }
        
        // 2. Initialize country structure if not exists
        if (!state.countryBlacklists[countryCode]) {
            state.countryBlacklists[countryCode] = {
                groupBlacklists: {},
                countryStats: {
                    totalBlacklisted: 0,
                    totalAmountOwed: 0,
                    averageDaysOverdue: 0,
                    groupsWithBlacklists: 0,
                    lendersWithBlacklists: 0
                },
                lastUpdated: new Date().toISOString()
            };
        }
        
        // 3. Initialize group structure if not exists
        if (!state.countryBlacklists[countryCode].groupBlacklists[groupId]) {
            state.countryBlacklists[countryCode].groupBlacklists[groupId] = {
                lenderBlacklists: {},
                groupStats: {
                    totalBlacklisted: 0,
                    totalAmountOwed: 0,
                    lendersWithBlacklists: 0,
                    mostRecentBlacklist: null
                },
                groupInfo: {
                    name: groupId,
                    type: 'unknown',
                    memberCount: 0,
                    country: countryCode
                }
            };
        }
        
        // 4. Initialize lender structure if not exists
        const group = state.countryBlacklists[countryCode].groupBlacklists[groupId];
        if (!group.lenderBlacklists[lenderId]) {
            group.lenderBlacklists[lenderId] = {
                blacklistedBorrowers: {},
                lenderStats: {
                    totalBlacklisted: 0,
                    totalAmountOwed: 0,
                    mostRecentBlacklist: null
                },
                lenderInfo: {
                    name: lenderId,
                    subscriptionLevel: 'unknown',
                    rating: 0
                }
            };
        }
        
        return {
            country: countryCode,
            group: groupId,
            lender: lenderId,
            borrower: borrowerId,
            pathValid: true
        };
    };
    
    // BLACKLIST OPERATIONS
    
    /**
     * Add borrower to blacklist (Only lenders can do this)
     */
    const addToBlacklist = (params) => {
        const {
            countryCode,
            groupId,
            lenderId,
            borrowerId,
            borrowerName,
            loanDetails,
            reason = BLACKLIST_CONFIG.REASONS.DEFAULT_2_MONTHS,
            notes = ''
        } = params;
        
        state.ui.loading = true;
        state.ui.error = null;
        
        try {
            // Enforce hierarchy
            enforceHierarchy(countryCode, groupId, lenderId, borrowerId);
            
            const now = new Date().toISOString();
            const dueDate = new Date(loanDetails.dueDate);
            const daysOverdue = Math.max(0, Math.floor((new Date() - dueDate) / (1000 * 60 * 60 * 24)));
            
            // Validate: Must be at least 60 days overdue for default
            if (reason === BLACKLIST_CONFIG.REASONS.DEFAULT_2_MONTHS && daysOverdue < 60) {
                throw new Error('Borrower must be at least 60 days overdue for default blacklist');
            }
            
            // Create blacklist entry
            const blacklistEntry = {
                id: `bl_${countryCode}_${groupId}_${lenderId}_${borrowerId}_${Date.now()}`,
                borrowerId,
                borrowerName,
                countryCode,
                groupId,
                lenderId,
                loanDetails: {
                    amountBorrowed: loanDetails.amountBorrowed,
                    interestRate: loanDetails.interestRate || 0.10,
                    penaltyRate: loanDetails.penaltyRate || 0.05,
                    dueDate: loanDetails.dueDate,
                    dateBorrowed: loanDetails.dateBorrowed,
                    loanCategory: loanDetails.category,
                    guarantors: loanDetails.guarantors || []
                },
                amountOwed: loanDetails.amountOwed || loanDetails.amountBorrowed * 1.10, // principal + 10% interest
                daysOverdue,
                reason,
                notes,
                dateBlacklisted: now,
                status: BLACKLIST_CONFIG.STATUS.ACTIVE,
                blacklistedBy: lenderId,
                adminReviewRequired: state.settings.requireAdminApproval,
                appealAvailable: true,
                metadata: {
                    lastUpdated: now,
                    updates: [],
                    notificationsSent: 0
                }
            };
            
            // Add to hierarchy
            const lender = state.countryBlacklists[countryCode]
                .groupBlacklists[groupId]
                .lenderBlacklists[lenderId];
            
            lender.blacklistedBorrowers[borrowerId] = blacklistEntry;
            
            // Update statistics
            lender.lenderStats.totalBlacklisted++;
            lender.lenderStats.totalAmountOwed += blacklistEntry.amountOwed;
            lender.lenderStats.mostRecentBlacklist = now;
            
            const group = state.countryBlacklists[countryCode].groupBlacklists[groupId];
            group.groupStats.totalBlacklisted++;
            group.groupStats.totalAmountOwed += blacklistEntry.amountOwed;
            group.groupStats.lendersWithBlacklists = Object.keys(group.lenderBlacklists).length;
            group.groupStats.mostRecentBlacklist = now;
            
            const country = state.countryBlacklists[countryCode];
            country.countryStats.totalBlacklisted++;
            country.countryStats.totalAmountOwed += blacklistEntry.amountOwed;
            country.countryStats.groupsWithBlacklists = Object.keys(country.groupBlacklists).length;
            country.countryStats.lendersWithBlacklists = 
                Object.values(country.groupBlacklists).reduce((sum, g) => 
                    sum + Object.keys(g.lenderBlacklists).length, 0);
            country.lastUpdated = now;
            
            // Update global stats
            updateStats();
            
            // Add to global registry (admin view)
            state.globalRegistry[blacklistEntry.id] = {
                ...blacklistEntry,
                countryName: BLACKLIST_CONFIG.COUNTRIES.find(c => c.code === countryCode)?.name || countryCode,
                groupName: group.groupInfo.name || groupId,
                lenderName: lender.lenderInfo.name || lenderId
            };
            
            // Notify if enabled
            if (state.settings.notifyGroupOnBlacklist) {
                // In a real app, this would trigger notifications
                console.log(`Blacklist notification: ${borrowerName} blacklisted in group ${groupId}`);
            }
            
            state.ui.success = `${borrowerName} has been added to blacklist`;
            saveState();
            
            return {
                success: true,
                entry: blacklistEntry,
                hierarchy: {
                    country: countryCode,
                    group: groupId,
                    lender: lenderId,
                    borrower: borrowerId
                }
            };
            
        } catch (error) {
            state.ui.error = error.message;
            return {
                success: false,
                error: error.message
            };
        } finally {
            state.ui.loading = false;
        }
    };
    
    /**
     * Remove from blacklist (Only admin can do this after full repayment)
     */
    const removeFromBlacklist = (params) => {
        const {
            blacklistId,
            clearedBy, // Must be admin ID
            repaymentDetails,
            notes = ''
        } = params;
        
        state.ui.loading = true;
        state.ui.error = null;
        
        try {
            // Find blacklist entry in global registry
            const entry = state.globalRegistry[blacklistId];
            if (!entry) {
                throw new Error('Blacklist entry not found');
            }
            
            // Validate admin permission (simulated)
            if (!clearedBy.startsWith('admin_')) {
                throw new Error('Only platform admin can remove blacklist entries');
            }
            
            // Verify full repayment
            if (repaymentDetails.amountPaid < entry.amountOwed) {
                throw new Error('Full repayment required before removing from blacklist');
            }
            
            const { countryCode, groupId, lenderId, borrowerId } = entry;
            
            // Remove from hierarchy
            const lender = state.countryBlacklists[countryCode]
                ?.groupBlacklists[groupId]
                ?.lenderBlacklists[lenderId];
            
            if (lender && lender.blacklistedBorrowers[borrowerId]) {
                // Mark as cleared instead of deleting
                lender.blacklistedBorrowers[borrowerId].status = BLACKLIST_CONFIG.STATUS.CLEARED;
                lender.blacklistedBorrowers[borrowerId].clearedDate = new Date().toISOString();
                lender.blacklistedBorrowers[borrowerId].clearedBy = clearedBy;
                lender.blacklistedBorrowers[borrowerId].repaymentDetails = repaymentDetails;
                lender.blacklistedBorrowers[borrowerId].notes = notes;
                lender.blacklistedBorrowers[borrowerId].metadata.lastUpdated = new Date().toISOString();
                lender.blacklistedBorrowers[borrowerId].metadata.updates.push({
                    date: new Date().toISOString(),
                    action: 'cleared',
                    by: clearedBy,
                    details: repaymentDetails
                });
                
                // Update lender stats
                lender.lenderStats.totalBlacklisted = Math.max(0, lender.lenderStats.totalBlacklisted - 1);
                lender.lenderStats.totalAmountOwed -= entry.amountOwed;
                
                // Update global registry
                state.globalRegistry[blacklistId].status = BLACKLIST_CONFIG.STATUS.CLEARED;
                state.globalRegistry[blacklistId].clearedDate = new Date().toISOString();
                state.globalRegistry[blacklistId].clearedBy = clearedBy;
                
                // Update statistics
                updateStats();
                
                state.ui.success = `Blacklist entry cleared for ${entry.borrowerName}`;
                saveState();
                
                return {
                    success: true,
                    entry: lender.blacklistedBorrowers[borrowerId]
                };
            }
            
            throw new Error('Blacklist entry not found in hierarchy');
            
        } catch (error) {
            state.ui.error = error.message;
            return {
                success: false,
                error: error.message
            };
        } finally {
            state.ui.loading = false;
        }
    };
    
    /**
     * Get blacklist by filters (respecting country isolation)
     */
    const getBlacklist = (filters = {}) => {
        const {
            countryCode,
            groupId,
            lenderId,
            status = BLACKLIST_CONFIG.STATUS.ACTIVE,
            minDaysOverdue = 0,
            maxDaysOverdue = null,
            minAmount = 0,
            maxAmount = null
        } = filters;
        
        let results = [];
        
        // Country isolation: If country specified, only search that country
        const countriesToSearch = countryCode ? [countryCode] : Object.keys(state.countryBlacklists);
        
        countriesToSearch.forEach(country => {
            const countryData = state.countryBlacklists[country];
            if (!countryData) return;
            
            Object.entries(countryData.groupBlacklists).forEach(([groupKey, groupData]) => {
                // Filter by group if specified
                if (groupId && groupKey !== groupId) return;
                
                Object.entries(groupData.lenderBlacklists).forEach(([lenderKey, lenderData]) => {
                    // Filter by lender if specified
                    if (lenderId && lenderKey !== lenderId) return;
                    
                    Object.entries(lenderData.blacklistedBorrowers).forEach(([borrowerKey, borrowerData]) => {
                        // Apply filters
                        if (status && borrowerData.status !== status) return;
                        if (borrowerData.daysOverdue < minDaysOverdue) return;
                        if (maxDaysOverdue !== null && borrowerData.daysOverdue > maxDaysOverdue) return;
                        if (borrowerData.amountOwed < minAmount) return;
                        if (maxAmount !== null && borrowerData.amountOwed > maxAmount) return;
                        
                        results.push({
                            ...borrowerData,
                            countryName: BLACKLIST_CONFIG.COUNTRIES.find(c => c.code === country)?.name || country,
                            groupName: groupData.groupInfo.name || groupKey,
                            lenderName: lenderData.lenderInfo.name || lenderKey,
                            currency: BLACKLIST_CONFIG.COUNTRIES.find(c => c.code === country)?.currency || ''
                        });
                    });
                });
            });
        });
        
        // Apply UI sorting
        results.sort((a, b) => {
            const order = state.ui.sortOrder === 'asc' ? 1 : -1;
            switch (state.ui.sortBy) {
                case 'daysOverdue':
                    return (b.daysOverdue - a.daysOverdue) * order;
                case 'amountOwed':
                    return (b.amountOwed - a.amountOwed) * order;
                case 'dateBlacklisted':
                    return (new Date(b.dateBlacklisted) - new Date(a.dateBlacklisted)) * order;
                case 'borrowerName':
                    return a.borrowerName.localeCompare(b.borrowerName) * order;
                default:
                    return 0;
            }
        });
        
        return {
            results,
            total: results.length,
            filtersApplied: filters,
            retrievedAt: new Date().toISOString()
        };
    };
    
    /**
     * Submit blacklist appeal
     */
    const submitAppeal = (params) => {
        const {
            blacklistId,
            borrowerId,
            appealReason,
            supportingEvidence = [],
            contactInfo,
            proposedSolution
        } = params;
        
        const appeal = {
            id: `appeal_${Date.now()}_${borrowerId}`,
            blacklistId,
            borrowerId,
            appealReason,
            supportingEvidence,
            contactInfo,
            proposedSolution,
            submittedAt: new Date().toISOString(),
            status: 'pending',
            reviewedBy: null,
            reviewDate: null,
            decision: null,
            decisionNotes: '',
            adminNotes: ''
        };
        
        state.appeals.push(appeal);
        
        // Update blacklist entry status
        const entry = state.globalRegistry[blacklistId];
        if (entry) {
            entry.status = BLACKLIST_CONFIG.STATUS.APPEALED;
            entry.metadata.updates.push({
                date: new Date().toISOString(),
                action: 'appeal_submitted',
                details: { appealId: appeal.id }
            });
            
            // Update hierarchy
            const lender = state.countryBlacklists[entry.countryCode]
                ?.groupBlacklists[entry.groupId]
                ?.lenderBlacklists[entry.lenderId];
            
            if (lender && lender.blacklistedBorrowers[entry.borrowerId]) {
                lender.blacklistedBorrowers[entry.borrowerId].status = BLACKLIST_CONFIG.STATUS.APPEALED;
            }
        }
        
        saveState();
        
        return {
            success: true,
            appeal,
            message: 'Appeal submitted successfully and under review'
        };
    };
    
    /**
     * Process appeal (Admin only)
     */
    const processAppeal = (params) => {
        const {
            appealId,
            adminId,
            decision, // 'approved', 'rejected', 'escalated'
            decisionNotes,
            adminNotes = ''
        } = params;
        
        const appealIndex = state.appeals.findIndex(a => a.id === appealId);
        if (appealIndex === -1) {
            throw new Error('Appeal not found');
        }
        
        const appeal = state.appeals[appealIndex];
        appeal.status = 'processed';
        appeal.reviewedBy = adminId;
        appeal.reviewDate = new Date().toISOString();
        appeal.decision = decision;
        appeal.decisionNotes = decisionNotes;
        appeal.adminNotes = adminNotes;
        
        // Update blacklist entry based on decision
        const entry = state.globalRegistry[appeal.blacklistId];
        if (entry) {
            switch (decision) {
                case 'approved':
                    entry.status = BLACKLIST_CONFIG.STATUS.UNDER_REVIEW;
                    break;
                case 'rejected':
                    entry.status = BLACKLIST_CONFIG.STATUS.ACTIVE;
                    break;
                case 'escalated':
                    entry.status = BLACKLIST_CONFIG.STATUS.ESCALATED;
                    break;
            }
            
            entry.metadata.updates.push({
                date: new Date().toISOString(),
                action: 'appeal_processed',
                details: { decision, adminId, appealId }
            });
            
            // Update hierarchy
            const lender = state.countryBlacklists[entry.countryCode]
                ?.groupBlacklists[entry.groupId]
                ?.lenderBlacklists[entry.lenderId];
            
            if (lender && lender.blacklistedBorrowers[entry.borrowerId]) {
                lender.blacklistedBorrowers[entry.borrowerId].status = entry.status;
            }
        }
        
        saveState();
        
        return {
            success: true,
            appeal,
            message: `Appeal ${decision} successfully`
        };
    };
    
    /**
     * Get blacklist statistics
     */
    const getStatistics = (countryCode = null) => {
        if (countryCode) {
            const countryData = state.countryBlacklists[countryCode];
            if (!countryData) {
                throw new Error(`No data for country ${countryCode}`);
            }
            
            return {
                country: countryCode,
                ...countryData.countryStats,
                groupsCount: Object.keys(countryData.groupBlacklists).length,
                lastUpdated: countryData.lastUpdated
            };
        }
        
        return {
            global: state.stats,
            countries: Object.fromEntries(
                Object.entries(state.countryBlacklists).map(([code, data]) => [
                    code,
                    {
                        ...data.countryStats,
                        groupsCount: Object.keys(data.groupBlacklists).length,
                        lastUpdated: data.lastUpdated
                    }
                ])
            ),
            lastUpdated: new Date().toISOString()
        };
    };
    
    /**
     * Export blacklist data (Admin only)
     */
    const exportData = (format = 'json', filters = {}) => {
        const data = getBlacklist(filters);
        
        switch (format.toLowerCase()) {
            case 'json':
                return JSON.stringify(data, null, 2);
            case 'csv':
                // Convert to CSV
                const headers = [
                    'Borrower Name', 'Borrower ID', 'Country', 'Group', 'Lender',
                    'Amount Owed', 'Days Overdue', 'Date Blacklisted', 'Status',
                    'Reason', 'Loan Category'
                ];
                
                const rows = data.results.map(entry => [
                    entry.borrowerName,
                    entry.borrowerId,
                    entry.countryName,
                    entry.groupName,
                    entry.lenderName,
                    entry.amountOwed,
                    entry.daysOverdue,
                    new Date(entry.dateBlacklisted).toLocaleDateString(),
                    entry.status,
                    entry.reason,
                    entry.loanDetails?.loanCategory || 'N/A'
                ]);
                
                const csvContent = [
                    headers.join(','),
                    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
                ].join('\n');
                
                return csvContent;
                
            case 'pdf':
                // In a real app, this would generate PDF
                return {
                    format: 'pdf',
                    data: data,
                    message: 'PDF export would be generated here'
                };
                
            default:
                throw new Error(`Unsupported export format: ${format}`);
        }
    };
    
    /**
     * Search blacklist
     */
    const searchBlacklist = (query, countryCode = null) => {
        const results = [];
        const searchTerm = query.toLowerCase().trim();
        
        const countriesToSearch = countryCode ? [countryCode] : Object.keys(state.countryBlacklists);
        
        countriesToSearch.forEach(country => {
            const countryData = state.countryBlacklists[country];
            if (!countryData) return;
            
            Object.entries(countryData.groupBlacklists).forEach(([groupId, groupData]) => {
                Object.entries(groupData.lenderBlacklists).forEach(([lenderId, lenderData]) => {
                    Object.entries(lenderData.blacklistedBorrowers).forEach(([borrowerId, borrowerData]) => {
                        // Search in borrower name, ID, loan category, reason
                        const searchFields = [
                            borrowerData.borrowerName,
                            borrowerData.borrowerId,
                            borrowerData.loanDetails?.loanCategory,
                            borrowerData.reason,
                            borrowerData.notes
                        ].filter(Boolean).map(f => f.toLowerCase());
                        
                        if (searchFields.some(field => field.includes(searchTerm))) {
                            results.push({
                                ...borrowerData,
                                countryName: BLACKLIST_CONFIG.COUNTRIES.find(c => c.code === country)?.name || country,
                                groupName: groupData.groupInfo.name || groupId,
                                lenderName: lenderData.lenderInfo.name || lenderId,
                                currency: BLACKLIST_CONFIG.COUNTRIES.find(c => c.code === country)?.currency || ''
                            });
                        }
                    });
                });
            });
        });
        
        return {
            query,
            results,
            total: results.length,
            searchedAt: new Date().toISOString()
        };
    };
    
    /**
     * Update UI settings
     */
    const updateUISettings = (newSettings) => {
        state.ui = { ...state.ui, ...newSettings };
        saveState();
        return state.ui;
    };
    
    /**
     * Update blacklist settings
     */
    const updateSettings = (newSettings) => {
        state.settings = { ...state.settings, ...newSettings };
        saveState();
        return state.settings;
    };
    
    /**
     * Get state for debugging/admin
     */
    const getState = () => {
        return JSON.parse(JSON.stringify(state));
    };
    
    /**
     * Reset state (for testing)
     */
    const resetState = () => {
        state = JSON.parse(JSON.stringify(BLACKLIST_CONFIG.initialState));
        initialize();
        return true;
    };
    
    /**
     * Migrate state (for version updates)
     */
    const migrateState = () => {
        // Migration logic for future updates
        const version = localStorage.getItem('mpesewa_blacklist_version') || '1.0.0';
        
        // Add migration logic here as needed
        localStorage.setItem('mpesewa_blacklist_version', '1.0.0');
        saveState();
        
        return {
            fromVersion: version,
            toVersion: '1.0.0',
            migrated: true
        };
    };
    
    /**
     * Validate hierarchy integrity
     */
    const validateHierarchy = () => {
        const errors = [];
        const warnings = [];
        
        BLACKLIST_CONFIG.COUNTRIES.forEach(country => {
            const countryData = state.countryBlacklists[country.code];
            if (!countryData) {
                warnings.push(`Country ${country.code} has no data`);
                return;
            }
            
            // Check each group
            Object.entries(countryData.groupBlacklists).forEach(([groupId, groupData]) => {
                if (!groupData.lenderBlacklists || typeof groupData.lenderBlacklists !== 'object') {
                    errors.push(`Group ${groupId} in ${country.code} has invalid lender structure`);
                }
                
                // Check each lender
                Object.entries(groupData.lenderBlacklists).forEach(([lenderId, lenderData]) => {
                    if (!lenderData.blacklistedBorrowers || typeof lenderData.blacklistedBorrowers !== 'object') {
                        errors.push(`Lender ${lenderId} in group ${groupId} has invalid borrower structure`);
                    }
                    
                    // Check each borrower
                    Object.entries(lenderData.blacklistedBorrowers).forEach(([borrowerId, borrowerData]) => {
                        if (!borrowerData.countryCode || borrowerData.countryCode !== country.code) {
                            errors.push(`Borrower ${borrowerId} country mismatch: expected ${country.code}, got ${borrowerData.countryCode}`);
                        }
                        
                        if (!borrowerData.groupId || borrowerData.groupId !== groupId) {
                            errors.push(`Borrower ${borrowerId} group mismatch: expected ${groupId}, got ${borrowerData.groupId}`);
                        }
                        
                        if (!borrowerData.lenderId || borrowerData.lenderId !== lenderId) {
                            errors.push(`Borrower ${borrowerId} lender mismatch: expected ${lenderId}, got ${borrowerData.lenderId}`);
                        }
                    });
                });
            });
        });
        
        return {
            valid: errors.length === 0,
            errors,
            warnings,
            checkedAt: new Date().toISOString(),
            totalEntries: state.stats.totalBlacklisted
        };
    };
    
    /**
     * Get borrower's blacklist status
     */
    const getBorrowerStatus = (borrowerId, countryCode, groupId) => {
        const countryData = state.countryBlacklists[countryCode];
        if (!countryData) return null;
        
        let status = null;
        
        Object.entries(countryData.groupBlacklists).forEach(([groupKey, groupData]) => {
            if (groupId && groupKey !== groupId) return;
            
            Object.entries(groupData.lenderBlacklists).forEach(([lenderKey, lenderData]) => {
                if (lenderData.blacklistedBorrowers[borrowerId]) {
                    status = {
                        ...lenderData.blacklistedBorrowers[borrowerId],
                        groupName: groupData.groupInfo.name || groupKey,
                        lenderName: lenderData.lenderInfo.name || lenderKey
                    };
                }
            });
        });
        
        return status;
    };
    
    /**
     * Check if borrower is blacklisted in any group
     */
    const isBorrowerBlacklisted = (borrowerId, countryCode) => {
        const countryData = state.countryBlacklists[countryCode];
        if (!countryData) return false;
        
        for (const groupData of Object.values(countryData.groupBlacklists)) {
            for (const lenderData of Object.values(groupData.lenderBlacklists)) {
                if (lenderData.blacklistedBorrowers[borrowerId] && 
                    lenderData.blacklistedBorrowers[borrowerId].status === BLACKLIST_CONFIG.STATUS.ACTIVE) {
                    return true;
                }
            }
        }
        
        return false;
    };
    
    /**
     * Get groups with blacklisted borrowers
     */
    const getGroupsWithBlacklists = (countryCode) => {
        const countryData = state.countryBlacklists[countryCode];
        if (!countryData) return [];
        
        return Object.entries(countryData.groupBlacklists)
            .filter(([_, groupData]) => groupData.groupStats.totalBlacklisted > 0)
            .map(([groupId, groupData]) => ({
                groupId,
                name: groupData.groupInfo.name || groupId,
                totalBlacklisted: groupData.groupStats.totalBlacklisted,
                totalAmountOwed: groupData.groupStats.totalAmountOwed,
                lendersCount: groupData.groupStats.lendersWithBlacklists,
                mostRecent: groupData.groupStats.mostRecentBlacklist
            }));
    };
    
    /**
     * Get lenders with blacklisted borrowers
     */
    const getLendersWithBlacklists = (countryCode, groupId = null) => {
        const countryData = state.countryBlacklists[countryCode];
        if (!countryData) return [];
        
        const lenders = [];
        
        Object.entries(countryData.groupBlacklists).forEach(([groupKey, groupData]) => {
            if (groupId && groupKey !== groupId) return;
            
            Object.entries(groupData.lenderBlacklists).forEach(([lenderId, lenderData]) => {
                if (lenderData.lenderStats.totalBlacklisted > 0) {
                    lenders.push({
                        lenderId,
                        name: lenderData.lenderInfo.name || lenderId,
                        groupId: groupKey,
                        groupName: groupData.groupInfo.name || groupKey,
                        totalBlacklisted: lenderData.lenderStats.totalBlacklisted,
                        totalAmountOwed: lenderData.lenderStats.totalAmountOwed,
                        mostRecent: lenderData.lenderStats.mostRecentBlacklist,
                        subscriptionLevel: lenderData.lenderInfo.subscriptionLevel,
                        rating: lenderData.lenderInfo.rating
                    });
                }
            });
        });
        
        return lenders;
    };
    
    // Initialize on load
    initialize();
    
    // Return public API
    return {
        // State getters
        getState,
        getStatistics,
        getBlacklist,
        searchBlacklist,
        getBorrowerStatus,
        isBorrowerBlacklisted,
        getGroupsWithBlacklists,
        getLendersWithBlacklists,
        
        // Operations
        addToBlacklist,
        removeFromBlacklist,
        submitAppeal,
        processAppeal,
        exportData,
        
        // Settings
        updateUISettings,
        updateSettings,
        getConfig: () => BLACKLIST_CONFIG,
        
        // Maintenance
        resetState,
        migrateState,
        validateHierarchy,
        enforceHierarchy,
        
        // Events (for UI reactivity)
        subscribe: (callback) => {
            // Simple pub/sub for state changes
            const interval = setInterval(() => {
                callback(state);
            }, 1000);
            
            return () => clearInterval(interval);
        },
        
        // Current state
        state: () => JSON.parse(JSON.stringify(state))
    };
};

// Create and export singleton instance
const blacklistSlice = createBlacklistSlice();

// Export for use in other modules
export default blacklistSlice;
export { BLACKLIST_CONFIG };