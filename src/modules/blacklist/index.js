/**
 * M-PESEWA BLACKLIST MODULE - MAIN ENTRY POINT
 * Strict Hierarchy: Global → Country → Groups → Lenders → Borrowers (Ledgers)
 * Blacklist triggers after 60 days of loan arrears
 * Each country maintains its own blacklist registry
 */

import BlacklistRules from './blacklist.rules.js';
import BlacklistEnforcement from './blacklist.enforcement.js';
import BlacklistAudit from './blacklist.audit.js';
import BlacklistAppeals from './blacklist.appeals.js';
import { getCurrentCountry, getUserRole, isAdminUser } from '../core/app-init.js';

class BlacklistModule {
    constructor() {
        this.rules = new BlacklistRules();
        this.enforcement = new BlacklistEnforcement();
        this.audit = new BlacklistAudit();
        this.appeals = new BlacklistAppeals();
        this.countryBlacklists = new Map(); // countryCode -> Set(userId)
        this.blacklistRegistry = new Map(); // userId -> BlacklistRecord
    }

    /**
     * Initialize blacklist module
     */
    async initialize() {
        console.log('🔒 Blacklist Module Initializing...');
        
        // Load country-specific blacklists
        await this.loadCountryBlacklists();
        
        // Start enforcement checks
        this.startPeriodicChecks();
        
        // Initialize audit trail
        this.audit.initialize();
        
        console.log('✅ Blacklist Module Initialized');
    }

    /**
     * Load blacklists for all supported countries
     */
    async loadCountryBlacklists() {
        const supportedCountries = [
            'KE', 'UG', 'TZ', 'RW', 'BI', 'CD', 'SS', 'ZA', 'NG', 'GH', 'ET'
        ];

        for (const countryCode of supportedCountries) {
            const blacklistKey = `mpesewa_blacklist_${countryCode}`;
            const storedBlacklist = localStorage.getItem(blacklistKey);
            
            if (storedBlacklist) {
                const blacklistData = JSON.parse(storedBlacklist);
                this.countryBlacklists.set(countryCode, new Set(blacklistData.userIds));
                
                // Load individual records
                blacklistData.records.forEach(record => {
                    this.blacklistRegistry.set(record.userId, record);
                });
            } else {
                // Initialize empty blacklist for country
                this.countryBlacklists.set(countryCode, new Set());
                this.saveCountryBlacklist(countryCode);
            }
        }
    }

    /**
     * Check if a user should be blacklisted
     * @param {string} userId - User ID
     * @param {string} countryCode - Country code
     * @param {Object} loanData - Loan information
     * @returns {boolean} - True if should be blacklisted
     */
    checkForBlacklist(userId, countryCode, loanData) {
        const daysOverdue = this.calculateDaysOverdue(loanData.dueDate);
        
        // Rule: Blacklist after 60 days with any arrears
        if (daysOverdue > 60 && loanData.amountOwed > 0) {
            const reason = `Loan default: ${daysOverdue} days overdue, Amount: ${loanData.currency} ${loanData.amountOwed}`;
            this.addToBlacklist(userId, countryCode, reason, loanData);
            return true;
        }
        
        return false;
    }

    /**
     * Add user to blacklist
     * @param {string} userId - User ID
     * @param {string} countryCode - Country code
     * @param {string} reason - Blacklist reason
     * @param {Object} loanData - Loan information
     */
    addToBlacklist(userId, countryCode, reason, loanData) {
        // Check if already blacklisted
        if (this.isUserBlacklisted(userId, countryCode)) {
            console.log(`User ${userId} already blacklisted in ${countryCode}`);
            return;
        }

        const blacklistRecord = {
            userId,
            countryCode,
            reason,
            defaultAmount: loanData.amountOwed,
            defaultDays: this.calculateDaysOverdue(loanData.dueDate),
            appliedAt: new Date().toISOString(),
            removedAt: null,
            loanId: loanData.loanId,
            lenderId: loanData.lenderId,
            groupId: loanData.groupId,
            evidence: {
                loanDetails: loanData,
                lastRepaymentDate: loanData.lastRepaymentDate,
                totalRepayments: loanData.totalRepayments
            }
        };

        // Add to country blacklist
        const countryBlacklist = this.countryBlacklists.get(countryCode);
        if (countryBlacklist) {
            countryBlacklist.add(userId);
        }

        // Add to registry
        this.blacklistRegistry.set(userId, blacklistRecord);

        // Save to localStorage
        this.saveCountryBlacklist(countryCode);

        // Log audit trail
        this.audit.logAction({
            action: 'BLACKLIST_ADDED',
            userId,
            countryCode,
            reason,
            timestamp: new Date().toISOString(),
            performedBy: 'system', // or actual admin ID if manual
            details: blacklistRecord
        });

        // Apply enforcement
        this.enforcement.applyBlacklistRestrictions(userId, countryCode);
        
        console.log(`🚫 User ${userId} added to blacklist in ${countryCode}: ${reason}`);
    }

    /**
     * Remove user from blacklist (Admin only)
     * @param {string} userId - User ID
     * @param {string} countryCode - Country code
     * @param {string} adminId - Admin user ID
     * @param {string} reason - Removal reason
     * @returns {boolean} - Success status
     */
    removeFromBlacklist(userId, countryCode, adminId, reason) {
        // Verify admin permissions
        if (!isAdminUser(adminId)) {
            console.error(`❌ User ${adminId} is not authorized to remove blacklist`);
            return false;
        }

        const countryBlacklist = this.countryBlacklists.get(countryCode);
        if (!countryBlacklist || !countryBlacklist.has(userId)) {
            console.error(`User ${userId} not found in ${countryCode} blacklist`);
            return false;
        }

        // Get blacklist record
        const record = this.blacklistRegistry.get(userId);
        if (!record) {
            console.error(`Blacklist record not found for user ${userId}`);
            return false;
        }

        // Update record
        record.removedAt = new Date().toISOString();
        record.removedBy = adminId;
        record.removalReason = reason;

        // Remove from country blacklist
        countryBlacklist.delete(userId);

        // Update registry
        this.blacklistRegistry.set(userId, record);

        // Save changes
        this.saveCountryBlacklist(countryCode);

        // Log audit trail
        this.audit.logAction({
            action: 'BLACKLIST_REMOVED',
            userId,
            countryCode,
            reason,
            timestamp: new Date().toISOString(),
            performedBy: adminId,
            details: record
        });

        // Remove enforcement restrictions
        this.enforcement.removeBlacklistRestrictions(userId, countryCode);

        console.log(`✅ User ${userId} removed from blacklist in ${countryCode} by admin ${adminId}`);
        return true;
    }

    /**
     * Check if user is blacklisted
     * @param {string} userId - User ID
     * @param {string} countryCode - Country code
     * @returns {boolean} - True if blacklisted
     */
    isUserBlacklisted(userId, countryCode) {
        const countryBlacklist = this.countryBlacklists.get(countryCode);
        return countryBlacklist ? countryBlacklist.has(userId) : false;
    }

    /**
     * Get blacklist record for user
     * @param {string} userId - User ID
     * @returns {Object|null} - Blacklist record or null
     */
    getUserBlacklistRecord(userId) {
        return this.blacklistRegistry.get(userId) || null;
    }

    /**
     * Get all blacklisted users for a country
     * @param {string} countryCode - Country code
     * @returns {Array} - Array of blacklist records
     */
    getCountryBlacklist(countryCode) {
        const countryBlacklist = this.countryBlacklists.get(countryCode);
        if (!countryBlacklist) return [];

        const records = [];
        for (const userId of countryBlacklist) {
            const record = this.blacklistRegistry.get(userId);
            if (record) {
                records.push(record);
            }
        }
        
        return records.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));
    }

    /**
     * Submit appeal for blacklist removal
     * @param {string} userId - User ID
     * @param {string} countryCode - Country code
     * @param {Object} appealData - Appeal information
     * @returns {string} - Appeal ID
     */
    submitAppeal(userId, countryCode, appealData) {
        return this.appeals.submitAppeal(userId, countryCode, appealData);
    }

    /**
     * Calculate days overdue
     * @param {string} dueDate - Due date string
     * @returns {number} - Days overdue
     */
    calculateDaysOverdue(dueDate) {
        const due = new Date(dueDate);
        const now = new Date();
        const diffTime = now - due;
        return Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
    }

    /**
     * Save country blacklist to localStorage
     * @param {string} countryCode - Country code
     */
    saveCountryBlacklist(countryCode) {
        const countryBlacklist = this.countryBlacklists.get(countryCode);
        if (!countryBlacklist) return;

        const records = [];
        for (const userId of countryBlacklist) {
            const record = this.blacklistRegistry.get(userId);
            if (record) {
                records.push(record);
            }
        }

        const blacklistData = {
            countryCode,
            userIds: Array.from(countryBlacklist),
            records,
            updatedAt: new Date().toISOString()
        };

        localStorage.setItem(`mpesewa_blacklist_${countryCode}`, JSON.stringify(blacklistData));
    }

    /**
     * Start periodic blacklist checks
     */
    startPeriodicChecks() {
        // Check for blacklist candidates every 24 hours
        setInterval(() => {
            this.runBlacklistChecks();
        }, 24 * 60 * 60 * 1000); // 24 hours
        
        // Initial check
        setTimeout(() => {
            this.runBlacklistChecks();
        }, 5000);
    }

    /**
     * Run blacklist checks on all active loans
     */
    async runBlacklistChecks() {
        console.log('🔄 Running blacklist checks...');
        
        // This would typically query all active loans from storage
        // For now, we'll check localStorage for loan data
        const activeLoans = this.getActiveLoansFromStorage();
        
        for (const loan of activeLoans) {
            if (loan.status === 'ACTIVE' || loan.status === 'OVERDUE') {
                const daysOverdue = this.calculateDaysOverdue(loan.dueDate);
                if (daysOverdue > 60 && loan.amountOwed > 0) {
                    this.checkForBlacklist(
                        loan.borrowerId,
                        loan.countryCode,
                        loan
                    );
                }
            }
        }
    }

    /**
     * Get active loans from storage
     * @returns {Array} - Active loans
     */
    getActiveLoansFromStorage() {
        try {
            const loansData = localStorage.getItem('mpesewa_active_loans');
            return loansData ? JSON.parse(loansData) : [];
        } catch (error) {
            console.error('Error loading active loans:', error);
            return [];
        }
    }

    /**
     * Get global blacklist statistics
     * @returns {Object} - Statistics
     */
    getStatistics() {
        let totalBlacklisted = 0;
        let totalAmountDefaulted = 0;
        const countryStats = {};

        for (const [countryCode, blacklistSet] of this.countryBlacklists) {
            const count = blacklistSet.size;
            totalBlacklisted += count;
            
            let countryAmount = 0;
            for (const userId of blacklistSet) {
                const record = this.blacklistRegistry.get(userId);
                if (record) {
                    countryAmount += record.defaultAmount;
                }
            }
            
            totalAmountDefaulted += countryAmount;
            countryStats[countryCode] = {
                count,
                amount: countryAmount
            };
        }

        return {
            totalBlacklisted,
            totalAmountDefaulted,
            countryStats,
            lastUpdated: new Date().toISOString()
        };
    }
}

// Export singleton instance
const blacklistModule = new BlacklistModule();
export default blacklistModule;