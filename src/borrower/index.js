/**
 * M-Pesewa Borrower Module - Main Entry Point
 * STRICT Hierarchy: Global → Country → Groups → Borrowers
 * Version: 1.0.0
 */

import './borrower.state-machine.js';
import './borrower.rules.js';
import './borrower.permissions.js';
import './borrower.audit.js';

// Borrower Module Constants
const BORROWER_MODULE = {
    VERSION: '1.0.0',
    MAX_GROUPS: 4,
    LOAN_DURATION_DAYS: 7,
    INTEREST_RATE: 0.10, // 10%
    PENALTY_RATE: 0.05, // 5% daily after 7 days
    DEFAULT_AFTER_DAYS: 60, // 2 months
};

// Borrower Status Enum
const BORROWER_STATUS = {
    NEW: 'new',
    VERIFIED: 'verified',
    ELIGIBLE: 'eligible',
    BORROWING: 'borrowing',
    OVERDUE: 'overdue',
    DEFAULTED: 'defaulted',
    BLACKLISTED: 'blacklisted',
    REINSTATED: 'reinstated'
};

// Country-specific borrower rules
const COUNTRY_BORROWER_RULES = {
    KE: { currency: 'KSh', minLoan: 50, maxLoan: 20000 },
    UG: { currency: 'UGX', minLoan: 2000, maxLoan: 800000 },
    TZ: { currency: 'TZS', minLoan: 1200, maxLoan: 500000 },
    RW: { currency: 'RWF', minLoan: 500, maxLoan: 200000 },
    BI: { currency: 'BIF', minLoan: 1000, maxLoan: 400000 },
    CD: { currency: 'CDF', minLoan: 1200, maxLoan: 500000 },
    SS: { currency: 'SSP', minLoan: 500, maxLoan: 150000 },
    ZA: { currency: 'ZAR', minLoan: 10, maxLoan: 2000 },
    NG: { currency: 'NGN', minLoan: 200, maxLoan: 80000 },
    GH: { currency: 'GHS', minLoan: 5, maxLoan: 2000 },
    ET: { currency: 'ETB', minLoan: 50, maxLoan: 60000 },
    SO: { currency: 'SOS', minLoan: 10000, maxLoan: 3500000 }
};

// Emergency Categories (20 categories as specified)
const EMERGENCY_CATEGORIES = [
    { id: 'fare', name: 'M-pesewa Fare', icon: '🚌', description: 'Move on, don\'t stall—borrow for your journey.' },
    { id: 'data', name: 'M-pesewa Data', icon: '📶', description: 'Stay connected, stay informed—borrow when your bundle runs out.' },
    { id: 'gas', name: 'M-pesewa Cooking Gas', icon: '🔥', description: 'Cook with confidence—borrow when your gas is low.' },
    { id: 'food', name: 'M-pesewa Food', icon: '🍲', description: 'Don\'t sleep hungry when paycheck is delayed—borrow and eat today.' },
    { id: 'wifi', name: 'M-pesewa Wifi', icon: '📡', description: 'Stay connected at home.' },
    { id: 'water', name: 'M-pesewa Water Bill', icon: '🚰', description: 'Stay hydrated—borrow for water needs or bills.' },
    { id: 'electricity', name: 'M-pesewa Electricity Tokens', icon: '⚡', description: 'Stay lit, stay powered—borrow tokens when you need it.' },
    { id: 'tv', name: 'M-pesewa TV Subscription', icon: '📺', description: 'Never miss your favorite shows.' },
    { id: 'fuel', name: 'M-pesewa Fuel', icon: '⛽', description: 'Keep moving—borrow for fuel, no matter your ride (Bike/Car/Tuktuk).' },
    { id: 'repair', name: 'M-pesewa Repair', icon: '🔧', description: 'Fix it quick—borrow for minor repairs and keep going.' },
    { id: 'credo', name: 'M-pesewa Credo', icon: '🛠️', description: 'Fix it fast—borrow for urgent repairs or tools.' },
    { id: 'sales', name: 'M-Pesa Daily Sales Advance', icon: '🧾', description: 'Small Loan advance for everyday business.' },
    { id: 'capital', name: 'M-Pesa Working Capital Advance', icon: '🏪', description: 'Working capital when your business needs it.' },
    { id: 'soko', name: 'M-Pesewa Soko Loan', icon: '🛒', description: 'Market money when you need it.' },
    { id: 'kibanda', name: 'M-Pesewa Kidandaski Loan', icon: '🏗️', description: 'Kibanda/stall money when you need it.' },
    { id: 'hawker', name: 'M-Pesewa Hawker Loan', icon: '🚶‍♂️', description: 'Be Street smart, cash flow all time.' },
    { id: 'fuliza', name: 'M-fuliziwa Loan', icon: '🔄', description: 'Your fuliza is not enough? Top up here.' },
    { id: 'medicine', name: 'M-pesewa Medicine', icon: '💊', description: 'Health first—borrow for urgent medicines.' },
    { id: 'school', name: 'M-pesewa School Fees', icon: '🎓', description: 'Secure your future without delay.' },
    { id: 'advance', name: 'M-pesewa Advance', icon: '💸', description: 'Quick cash when you need it most.' }
];

// Borrower Class Definition
class Borrower {
    constructor(data = {}) {
        this.id = data.id || this.generateId();
        this.userId = data.userId || null;
        this.groupId = data.groupId || null;
        this.country = data.country || null;
        this.fullName = data.fullName || '';
        this.nickname = data.nickname || '';
        this.nationalId = data.nationalId || '';
        this.phone = data.phone || '';
        this.location = data.location || '';
        this.rating = data.rating || 5.0; // 5-star rating system
        this.status = data.status || BORROWER_STATUS.NEW;
        this.referrer1 = data.referrer1 || { name: '', phone: '' };
        this.referrer2 = data.referrer2 || { name: '', phone: '' };
        this.groups = data.groups || []; // Max 4 groups
        this.activeLoans = data.activeLoans || [];
        this.loanHistory = data.loanHistory || [];
        this.blacklistStatus = data.blacklistStatus || { isBlacklisted: false, reason: '', date: null, amount: 0 };
        this.createdAt = data.createdAt || new Date().toISOString();
        this.updatedAt = data.updatedAt || new Date().toISOString();
        this.isVerified = data.isVerified || false;
        this.verificationDate = data.verificationDate || null;
        this.lastBorrowDate = data.lastBorrowDate || null;
        this.totalBorrowed = data.totalBorrowed || 0;
        this.totalRepaid = data.totalRepaid || 0;
        this.outstandingBalance = data.outstandingBalance || 0;
    }

    generateId() {
        return 'borrower_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Check if borrower can join new group (max 4 groups)
    canJoinNewGroup() {
        return this.groups.length < BORROWER_MODULE.MAX_GROUPS && 
               !this.blacklistStatus.isBlacklisted &&
               this.rating >= 3.0;
    }

    // Check if borrower is eligible to borrow
    isEligibleToBorrow() {
        return this.status === BORROWER_STATUS.ELIGIBLE &&
               !this.blacklistStatus.isBlacklisted &&
               this.activeLoans.length === 0 &&
               this.rating >= 3.0;
    }

    // Calculate remaining borrowing limit based on subscription tier
    calculateBorrowingLimit(subscriptionTier) {
        const countryRules = COUNTRY_BORROWER_RULES[this.country] || COUNTRY_BORROWER_RULES.KE;
        const tierLimits = {
            'basic': Math.min(countryRules.maxLoan, 1500),
            'premium': Math.min(countryRules.maxLoan, 5000),
            'super': Math.min(countryRules.maxLoan, 20000),
            'lender-of-lenders': Math.min(countryRules.maxLoan, 50000)
        };
        
        const limit = tierLimits[subscriptionTier] || tierLimits.basic;
        const available = limit - this.outstandingBalance;
        
        return {
            limit,
            available: Math.max(0, available),
            currency: countryRules.currency
        };
    }

    // Request a new loan
    requestLoan(loanData) {
        if (!this.isEligibleToBorrow()) {
            throw new Error('Borrower is not eligible to request a loan');
        }

        const newLoan = {
            id: 'loan_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            borrowerId: this.id,
            lenderId: loanData.lenderId,
            groupId: loanData.groupId,
            category: loanData.category,
            amount: loanData.amount,
            principal: loanData.amount,
            interest: loanData.amount * BORROWER_MODULE.INTEREST_RATE,
            totalAmount: loanData.amount * (1 + BORROWER_MODULE.INTEREST_RATE),
            disbursementDate: new Date().toISOString(),
            dueDate: this.calculateDueDate(7), // 7 days
            status: 'pending',
            repaymentHistory: [],
            penaltyAmount: 0,
            daysOverdue: 0,
            createdAt: new Date().toISOString()
        };

        this.activeLoans.push(newLoan);
        this.status = BORROWER_STATUS.BORROWING;
        this.updatedAt = new Date().toISOString();

        return newLoan;
    }

    // Calculate due date
    calculateDueDate(days = 7) {
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + days);
        return dueDate.toISOString();
    }

    // Add repayment
    addRepayment(loanId, amount) {
        const loan = this.activeLoans.find(l => l.id === loanId);
        if (!loan) {
            throw new Error('Loan not found');
        }

        const repayment = {
            date: new Date().toISOString(),
            amount,
            type: 'partial'
        };

        loan.repaymentHistory.push(repayment);
        
        // Update loan totals
        const totalRepaid = loan.repaymentHistory.reduce((sum, r) => sum + r.amount, 0);
        
        if (totalRepaid >= loan.totalAmount) {
            loan.status = 'cleared';
            const loanIndex = this.activeLoans.findIndex(l => l.id === loanId);
            this.activeLoans.splice(loanIndex, 1);
            this.loanHistory.push(loan);
            this.status = BORROWER_STATUS.ELIGIBLE;
            
            // Update borrower totals
            this.totalRepaid += totalRepaid;
            this.outstandingBalance = Math.max(0, this.outstandingBalance - loan.totalAmount);
        } else {
            loan.amount -= amount;
            this.outstandingBalance = Math.max(0, this.outstandingBalance - amount);
        }

        this.updatedAt = new Date().toISOString();
        return repayment;
    }

    // Calculate penalties for overdue loans
    calculatePenalties() {
        const now = new Date();
        this.activeLoans.forEach(loan => {
            const dueDate = new Date(loan.dueDate);
            if (now > dueDate) {
                const daysOverdue = Math.floor((now - dueDate) / (1000 * 60 * 60 * 24));
                loan.daysOverdue = daysOverdue;
                
                if (daysOverdue > 7) {
                    const penaltyDays = daysOverdue - 7;
                    loan.penaltyAmount = loan.principal * BORROWER_MODULE.PENALTY_RATE * penaltyDays;
                }
                
                if (daysOverdue >= BORROWER_MODULE.DEFAULT_AFTER_DAYS) {
                    loan.status = 'defaulted';
                    this.status = BORROWER_STATUS.DEFAULTED;
                } else if (daysOverdue > 0) {
                    loan.status = 'overdue';
                    this.status = BORROWER_STATUS.OVERDUE;
                }
            }
        });
        
        this.updatedAt = new Date().toISOString();
    }

    // Join a new group
    joinGroup(groupId) {
        if (!this.canJoinNewGroup()) {
            throw new Error('Cannot join new group. Check limits, rating, or blacklist status.');
        }

        if (this.groups.includes(groupId)) {
            throw new Error('Already a member of this group');
        }

        this.groups.push(groupId);
        this.updatedAt = new Date().toISOString();
        
        return {
            success: true,
            message: `Successfully joined group ${groupId}`,
            currentGroups: this.groups
        };
    }

    // Leave a group
    leaveGroup(groupId) {
        const index = this.groups.indexOf(groupId);
        if (index === -1) {
            throw new Error('Not a member of this group');
        }

        // Check if borrower has active loans in this group
        const hasActiveLoans = this.activeLoans.some(loan => loan.groupId === groupId);
        if (hasActiveLoans) {
            throw new Error('Cannot leave group with active loans');
        }

        this.groups.splice(index, 1);
        this.updatedAt = new Date().toISOString();
        
        return {
            success: true,
            message: `Left group ${groupId}`,
            currentGroups: this.groups
        };
    }

    // Update rating (called by lender after repayment)
    updateRating(newRating, lenderId) {
        if (newRating < 1 || newRating > 5) {
            throw new Error('Rating must be between 1 and 5');
        }

        // Weighted average calculation
        const totalRatings = this.loanHistory.length + 1;
        this.rating = ((this.rating * (totalRatings - 1)) + newRating) / totalRatings;
        this.updatedAt = new Date().toISOString();

        return {
            success: true,
            newRating: this.rating,
            updatedBy: lenderId
        };
    }

    // Check if borrower is blacklisted
    isBlacklisted() {
        return this.blacklistStatus.isBlacklisted;
    }

    // Get borrower summary
    getSummary() {
        return {
            id: this.id,
            fullName: this.fullName,
            nickname: this.nickname,
            country: this.country,
            rating: this.rating.toFixed(1),
            status: this.status,
            groups: this.groups.length,
            activeLoans: this.activeLoans.length,
            totalBorrowed: this.totalBorrowed,
            totalRepaid: this.totalRepaid,
            outstandingBalance: this.outstandingBalance,
            isBlacklisted: this.blacklistStatus.isBlacklisted,
            canBorrow: this.isEligibleToBorrow(),
            canJoinGroups: this.canJoinNewGroup()
        };
    }

    // Export to JSON
    toJSON() {
        return {
            id: this.id,
            userId: this.userId,
            groupId: this.groupId,
            country: this.country,
            fullName: this.fullName,
            nickname: this.nickname,
            nationalId: this.nationalId,
            phone: this.phone,
            location: this.location,
            rating: this.rating,
            status: this.status,
            referrer1: this.referrer1,
            referrer2: this.referrer2,
            groups: this.groups,
            activeLoans: this.activeLoans,
            loanHistory: this.loanHistory,
            blacklistStatus: this.blacklistStatus,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            isVerified: this.isVerified,
            verificationDate: this.verificationDate,
            lastBorrowDate: this.lastBorrowDate,
            totalBorrowed: this.totalBorrowed,
            totalRepaid: this.totalRepaid,
            outstandingBalance: this.outstandingBalance
        };
    }
}

// Borrower Manager Class
class BorrowerManager {
    constructor() {
        this.borrowers = new Map();
        this.countryBorrowers = new Map(); // Map country -> array of borrower IDs
        this.groupBorrowers = new Map(); // Map groupId -> array of borrower IDs
    }

    // Create new borrower
    createBorrower(data) {
        const borrower = new Borrower(data);
        
        // Validate country
        if (!COUNTRY_BORROWER_RULES[borrower.country]) {
            throw new Error(`Unsupported country: ${borrower.country}`);
        }

        // Validate referrers
        if (!borrower.referrer1.name || !borrower.referrer1.phone) {
            throw new Error('First referrer details are required');
        }

        if (!borrower.referrer2.name || !borrower.referrer2.phone) {
            throw new Error('Second referrer details are required');
        }

        this.borrowers.set(borrower.id, borrower);
        
        // Update country index
        if (!this.countryBorrowers.has(borrower.country)) {
            this.countryBorrowers.set(borrower.country, []);
        }
        this.countryBorrowers.get(borrower.country).push(borrower.id);

        // Update group index if groupId is provided
        if (borrower.groupId) {
            if (!this.groupBorrowers.has(borrower.groupId)) {
                this.groupBorrowers.set(borrower.groupId, []);
            }
            this.groupBorrowers.get(borrower.groupId).push(borrower.id);
        }

        return borrower;
    }

    // Get borrower by ID
    getBorrower(id) {
        return this.borrowers.get(id);
    }

    // Get borrowers by country
    getBorrowersByCountry(country) {
        const borrowerIds = this.countryBorrowers.get(country) || [];
        return borrowerIds.map(id => this.getBorrower(id)).filter(b => b);
    }

    // Get borrowers by group
    getBorrowersByGroup(groupId) {
        const borrowerIds = this.groupBorrowers.get(groupId) || [];
        return borrowerIds.map(id => this.getBorrower(id)).filter(b => b);
    }

    // Update borrower
    updateBorrower(id, updates) {
        const borrower = this.getBorrower(id);
        if (!borrower) {
            throw new Error('Borrower not found');
        }

        Object.assign(borrower, updates);
        borrower.updatedAt = new Date().toISOString();
        
        return borrower;
    }

    // Delete borrower (soft delete - mark as archived)
    deleteBorrower(id) {
        const borrower = this.getBorrower(id);
        if (!borrower) {
            throw new Error('Borrower not found');
        }

        if (borrower.activeLoans.length > 0) {
            throw new Error('Cannot delete borrower with active loans');
        }

        borrower.status = 'archived';
        borrower.updatedAt = new Date().toISOString();
        
        return borrower;
    }

    // Search borrowers
    searchBorrowers(criteria) {
        const results = [];
        
        for (const borrower of this.borrowers.values()) {
            let match = true;
            
            if (criteria.country && borrower.country !== criteria.country) match = false;
            if (criteria.groupId && !borrower.groups.includes(criteria.groupId)) match = false;
            if (criteria.status && borrower.status !== criteria.status) match = false;
            if (criteria.minRating && borrower.rating < criteria.minRating) match = false;
            if (criteria.isBlacklisted && !borrower.blacklistStatus.isBlacklisted) match = false;
            
            if (match) {
                results.push(borrower);
            }
        }
        
        return results;
    }

    // Get statistics
    getStatistics(country = null) {
        const borrowers = country ? 
            this.getBorrowersByCountry(country) : 
            Array.from(this.borrowers.values());
        
        const stats = {
            total: borrowers.length,
            active: borrowers.filter(b => b.status === BORROWER_STATUS.ELIGIBLE || b.status === BORROWER_STATUS.BORROWING).length,
            overdue: borrowers.filter(b => b.status === BORROWER_STATUS.OVERDUE).length,
            defaulted: borrowers.filter(b => b.status === BORROWER_STATUS.DEFAULTED).length,
            blacklisted: borrowers.filter(b => b.blacklistStatus.isBlacklisted).length,
            totalBorrowed: borrowers.reduce((sum, b) => sum + b.totalBorrowed, 0),
            totalOutstanding: borrowers.reduce((sum, b) => sum + b.outstandingBalance, 0),
            avgRating: borrowers.length > 0 ? 
                borrowers.reduce((sum, b) => sum + b.rating, 0) / borrowers.length : 0
        };
        
        return stats;
    }

    // Export all borrowers
    exportToJSON() {
        const data = [];
        for (const borrower of this.borrowers.values()) {
            data.push(borrower.toJSON());
        }
        return data;
    }

    // Import borrowers from JSON
    importFromJSON(data) {
        for (const borrowerData of data) {
            this.createBorrower(borrowerData);
        }
    }
}

// Initialize global borrower manager
const borrowerManager = new BorrowerManager();

// Export all components
export {
    Borrower,
    BorrowerManager,
    borrowerManager,
    BORROWER_MODULE,
    BORROWER_STATUS,
    COUNTRY_BORROWER_RULES,
    EMERGENCY_CATEGORIES
};

// Default export
export default borrowerManager;