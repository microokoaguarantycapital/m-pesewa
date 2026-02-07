/**
 * M-PESEWA COUNTRIES INDEX MODULE
 * Core country registry and hierarchy enforcement
 * STRICT ENFORCEMENT: Global → Countries → Groups → Lenders → Borrowers
 */

import CountryRegistry from './registry.js';
import BaseCountry from './base-country.js';

// Country Configuration Importers
import kenyaConfig from './ke/ke.config.js';
import ugandaConfig from './ug/ug.config.js';
import tanzaniaConfig from './tz/tz.config.js';
import rwandaConfig from './rw/rw.config.js';
import drcConfig from './cd/cd.config.js';
import burundiConfig from './bi/bi.config.js';
import nigeriaConfig from './ng/ng.config.js';
import ghanaConfig from './gh/gh.config.js';
import southSudanConfig from './ss/ss.config.js';
import somaliaConfig from './so/so.config.js';
import southAfricaConfig from './za/za.config.js';
import ethiopiaConfig from './et/et.config.js';

// Initialize Country Registry
const countryRegistry = new CountryRegistry();

// ============================================================================
// 1️⃣ STRICT COUNTRY CONFIGURATIONS (NON-NEGOTIABLE)
// ============================================================================

// Kenya 🇰🇪
const kenya = new BaseCountry(kenyaConfig);
countryRegistry.register(kenya);

// Uganda 🇺🇬
const uganda = new BaseCountry(ugandaConfig);
countryRegistry.register(uganda);

// Tanzania 🇹🇿
const tanzania = new BaseCountry(tanzaniaConfig);
countryRegistry.register(tanzania);

// Rwanda 🇷🇼
const rwanda = new BaseCountry(rwandaConfig);
countryRegistry.register(rwanda);

// Democratic Republic of Congo 🇨🇩
const drc = new BaseCountry(drcConfig);
countryRegistry.register(drc);

// Burundi 🇧🇮
const burundi = new BaseCountry(burundiConfig);
countryRegistry.register(burundi);

// Nigeria 🇳🇬
const nigeria = new BaseCountry(nigeriaConfig);
countryRegistry.register(nigeria);

// Ghana 🇬🇭
const ghana = new BaseCountry(ghanaConfig);
countryRegistry.register(ghana);

// South Sudan 🇸🇸
const southSudan = new BaseCountry(southSudanConfig);
countryRegistry.register(southSudan);

// Somalia 🇸🇴
const somalia = new BaseCountry(somaliaConfig);
countryRegistry.register(somalia);

// South Africa 🇿🇦
const southAfrica = new BaseCountry(southAfricaConfig);
countryRegistry.register(southAfrica);

// Ethiopia 🇪🇹
const ethiopia = new BaseCountry(ethiopiaConfig);
countryRegistry.register(ethiopia);

// ============================================================================
// 2️⃣ HIERARCHY ENFORCEMENT FUNCTIONS (MANDATORY)
// ============================================================================

class HierarchyEnforcer {
    constructor() {
        this.countries = countryRegistry;
        this.userCache = new Map();
        this.groupCache = new Map();
    }

    /**
     * Validate strict hierarchy: Global → Country → Group → Lender → Borrower
     * @param {string} userId - User ID
     * @param {string} countryCode - 2-letter country code
     * @param {string} groupId - Group ID
     * @param {string} userRole - 'lender' or 'borrower'
     * @returns {Object} - Validation result with status and message
     */
    validateHierarchy(userId, countryCode, groupId, userRole) {
        const errors = [];
        const warnings = [];

        // 1. Country existence check
        const country = this.countries.getByCode(countryCode);
        if (!country) {
            errors.push(`Country ${countryCode} does not exist in registry`);
            return { valid: false, errors, warnings };
        }

        // 2. Country isolation check (no cross-country operations)
        const userCountry = this.getUserCountry(userId);
        if (userCountry && userCountry !== countryCode) {
            errors.push(`Cross-country operation prohibited. User registered in ${userCountry}, trying to operate in ${countryCode}`);
        }

        // 3. Group existence and country match
        const group = this.getGroup(groupId);
        if (group) {
            if (group.countryCode !== countryCode) {
                errors.push(`Group ${groupId} belongs to country ${group.countryCode}, not ${countryCode}`);
            }
            
            // 4. Group size limits (5-1000 members)
            const groupSize = this.getGroupSize(groupId);
            if (groupSize < 5) {
                warnings.push(`Group has only ${groupSize} members (minimum 5 required for operations)`);
            }
            if (groupSize > 1000) {
                errors.push(`Group has ${groupSize} members (maximum 1000 allowed)`);
            }

            // 5. Role-specific hierarchy validation
            if (userRole === 'lender') {
                const lenderValidation = this.validateLenderHierarchy(userId, groupId);
                if (!lenderValidation.valid) {
                    errors.push(...lenderValidation.errors);
                }
            } else if (userRole === 'borrower') {
                const borrowerValidation = this.validateBorrowerHierarchy(userId, groupId);
                if (!borrowerValidation.valid) {
                    errors.push(...borrowerValidation.errors);
                }
            }
        }

        // 6. User group limit (borrowers max 4 groups)
        if (userRole === 'borrower') {
            const userGroups = this.getUserGroups(userId);
            if (userGroups.length >= 4) {
                const goodRating = this.getUserRating(userId);
                if (!goodRating) {
                    errors.push(`Borrower already in ${userGroups.length} groups. Good rating required to join more than 4 groups.`);
                }
            }
        }

        return {
            valid: errors.length === 0,
            errors,
            warnings,
            country,
            group
        };
    }

    /**
     * Validate lender hierarchy: Lender → Ledgers → Borrowers
     * @param {string} lenderId - Lender ID
     * @param {string} groupId - Group ID
     * @returns {Object} - Validation result
     */
    validateLenderHierarchy(lenderId, groupId) {
        const errors = [];
        const lender = this.getUser(lenderId);

        if (!lender) {
            errors.push(`Lender ${lenderId} not found`);
            return { valid: false, errors };
        }

        // Check lender subscription
        if (!lender.subscription || !lender.subscription.active) {
            errors.push(`Lender subscription expired or inactive. Expires on 28th of each month.`);
        }

        // Check if lender is in the group
        const lenderGroups = this.getUserGroups(lenderId);
        if (!lenderGroups.includes(groupId)) {
            errors.push(`Lender ${lenderId} is not a member of group ${groupId}`);
        }

        // Check lender's lending limit
        const activeLedgers = this.getLenderActiveLedgers(lenderId);
        if (activeLedgers.length >= lender.subscription?.maxLedgers || 0) {
            errors.push(`Lender reached maximum ledgers limit (${lender.subscription?.maxLedgers})`);
        }

        return { valid: errors.length === 0, errors };
    }

    /**
     * Validate borrower hierarchy: Borrower → Groups (max 4)
     * @param {string} borrowerId - Borrower ID
     * @param {string} groupId - Group ID
     * @returns {Object} - Validation result
     */
    validateBorrowerHierarchy(borrowerId, groupId) {
        const errors = [];
        const borrower = this.getUser(borrowerId);

        if (!borrower) {
            errors.push(`Borrower ${borrowerId} not found`);
            return { valid: false, errors };
        }

        // Check blacklist status
        if (borrower.blacklisted) {
            errors.push(`Borrower is blacklisted and cannot borrow or join new groups`);
        }

        // Check if borrower is already in the group
        const borrowerGroups = this.getUserGroups(borrowerId);
        if (borrowerGroups.includes(groupId)) {
            errors.push(`Borrower ${borrowerId} is already a member of group ${groupId}`);
        }

        // Check active loans in group (max 1 active loan per group)
        const activeLoansInGroup = this.getBorrowerActiveLoansInGroup(borrowerId, groupId);
        if (activeLoansInGroup.length > 0) {
            errors.push(`Borrower already has an active loan in group ${groupId}`);
        }

        return { valid: errors.length === 0, errors };
    }

    /**
     * Create a new ledger (Lender → Ledger → Borrower)
     * @param {string} lenderId - Lender ID
     * @param {string} borrowerId - Borrower ID
     * @param {Object} loanDetails - Loan details
     * @returns {Object} - Created ledger or error
     */
    createLedger(lenderId, borrowerId, loanDetails) {
        // Validate hierarchy before creating ledger
        const lender = this.getUser(lenderId);
        const borrower = this.getUser(borrowerId);

        if (!lender || lender.role !== 'lender') {
            return { success: false, error: 'Invalid lender' };
        }

        if (!borrower || borrower.role !== 'borrower') {
            return { success: false, error: 'Invalid borrower' };
        }

        // Ensure same group
        const lenderGroups = this.getUserGroups(lenderId);
        const borrowerGroups = this.getUserGroups(borrowerId);
        const commonGroups = lenderGroups.filter(g => borrowerGroups.includes(g));

        if (commonGroups.length === 0) {
            return { success: false, error: 'Lender and borrower must be in the same group' };
        }

        const groupId = commonGroups[0];

        // Create ledger
        const ledger = {
            id: `ledger_${Date.now()}_${lenderId}_${borrowerId}`,
            lenderId,
            borrowerId,
            groupId,
            ...loanDetails,
            status: 'active',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            transactions: [],
            guarantors: loanDetails.guarantors || [],
            category: loanDetails.category,
            amount: loanDetails.amount,
            interestRate: 0.10, // 10%
            penaltyRate: 0.05, // 5% daily after 7 days
            dueDate: this.calculateDueDate(7), // 7 days from now
            amountOverdue: 0,
            daysOverdue: 0
        };

        // Store ledger
        this.storeLedger(ledger);

        // Update lender's active ledgers
        lender.activeLedgers = lender.activeLedgers || [];
        lender.activeLedgers.push(ledger.id);
        this.updateUser(lender);

        // Update borrower's active loans
        borrower.activeLoans = borrower.activeLoans || [];
        borrower.activeLoans.push(ledger.id);
        this.updateUser(borrower);

        // Log hierarchy transaction
        this.logHierarchyTransaction({
            type: 'ledger_created',
            ledgerId: ledger.id,
            lenderId,
            borrowerId,
            groupId,
            amount: loanDetails.amount,
            timestamp: new Date().toISOString()
        });

        return { success: true, ledger };
    }

    // ============================================================================
    // HELPER METHODS
    // ============================================================================

    getUser(userId) {
        // In production, this would fetch from database
        return this.userCache.get(userId) || null;
    }

    updateUser(user) {
        this.userCache.set(user.id, user);
    }

    getGroup(groupId) {
        return this.groupCache.get(groupId) || null;
    }

    getGroupSize(groupId) {
        const group = this.getGroup(groupId);
        return group ? group.memberCount || 0 : 0;
    }

    getUserCountry(userId) {
        const user = this.getUser(userId);
        return user ? user.countryCode : null;
    }

    getUserGroups(userId) {
        const user = this.getUser(userId);
        return user ? user.groups || [] : [];
    }

    getUserRating(userId) {
        const user = this.getUser(userId);
        return user ? user.rating || 0 : 0;
    }

    getLenderActiveLedgers(lenderId) {
        const lender = this.getUser(lenderId);
        return lender ? lender.activeLedgers || [] : [];
    }

    getBorrowerActiveLoansInGroup(borrowerId, groupId) {
        const borrower = this.getUser(borrowerId);
        if (!borrower || !borrower.activeLoans) return [];

        // In production, this would query ledger database
        return borrower.activeLoans.filter(loanId => {
            const loan = this.getLedger(loanId);
            return loan && loan.groupId === groupId && loan.status === 'active';
        });
    }

    getLedger(ledgerId) {
        // In production, this would fetch from database
        return null;
    }

    storeLedger(ledger) {
        // In production, this would store in database
        console.log('Ledger stored:', ledger.id);
    }

    calculateDueDate(days) {
        const date = new Date();
        date.setDate(date.getDate() + days);
        return date.toISOString();
    }

    logHierarchyTransaction(transaction) {
        console.log('Hierarchy Transaction:', transaction);
    }
}

// ============================================================================
// 3️⃣ COUNTRY MANAGER CLASS
// ============================================================================

class CountryManager {
    constructor() {
        this.hierarchyEnforcer = new HierarchyEnforcer();
        this.activeCountries = new Map();
        this.userSessions = new Map();
    }

    /**
     * Get country by code with full configuration
     * @param {string} countryCode - 2-letter ISO code
     * @returns {Object} - Country configuration
     */
    getCountry(countryCode) {
        const country = countryRegistry.getByCode(countryCode);
        if (!country) {
            throw new Error(`Country ${countryCode} not found in registry`);
        }

        // Load country-specific modules
        const config = this.loadCountryConfig(countryCode);
        const legal = this.loadCountryLegal(countryCode);
        const theme = this.loadCountryTheme(countryCode);
        const currency = this.loadCountryCurrency(countryCode);

        return {
            ...country,
            config,
            legal,
            theme,
            currency,
            isActive: this.activeCountries.has(countryCode),
            userCount: this.getCountryUserCount(countryCode),
            groupCount: this.getCountryGroupCount(countryCode)
        };
    }

    /**
     * Register user in a country (Country isolation enforcement)
     * @param {string} userId - User ID
     * @param {string} countryCode - 2-letter country code
     * @param {Object} userData - User registration data
     * @returns {Object} - Registration result
     */
    registerUserInCountry(userId, countryCode, userData) {
        // Check if user already registered in another country
        const existingCountry = this.getUserCountry(userId);
        if (existingCountry && existingCountry !== countryCode) {
            return {
                success: false,
                error: `User already registered in ${existingCountry}. Cannot register in ${countryCode}. Country switching requires logout.`
            };
        }

        // Validate country exists
        const country = countryRegistry.getByCode(countryCode);
        if (!country) {
            return { success: false, error: `Invalid country code: ${countryCode}` };
        }

        // Apply country-specific rules
        const countryRules = this.loadCountryRules(countryCode);
        const validation = countryRules.validateUserRegistration(userData);
        
        if (!validation.valid) {
            return { success: false, error: validation.errors.join(', ') };
        }

        // Create user with country context
        const user = {
            id: userId,
            ...userData,
            countryCode,
            registeredAt: new Date().toISOString(),
            groups: [],
            rating: 5, // Default rating
            blacklisted: false,
            subscription: userData.role === 'lender' ? {
                level: userData.subscriptionLevel || 'basic',
                active: false, // Requires payment confirmation
                expiresOn: this.calculateSubscriptionExpiry()
            } : null
        };

        // Store user
        this.hierarchyEnforcer.userCache.set(userId, user);

        // Update country stats
        this.updateCountryStats(countryCode, 'userRegistered');

        // Log registration
        this.logCountryEvent(countryCode, 'user_registered', {
            userId,
            role: userData.role,
            timestamp: new Date().toISOString()
        });

        return {
            success: true,
            user,
            country,
            message: `User registered in ${country.name} successfully`
        };
    }

    /**
     * Create group in a country
     * @param {string} countryCode - 2-letter country code
     * @param {Object} groupData - Group data
     * @returns {Object} - Created group
     */
    createGroupInCountry(countryCode, groupData) {
        // Validate country
        const country = countryRegistry.getByCode(countryCode);
        if (!country) {
            return { success: false, error: 'Invalid country' };
        }

        // Validate founder exists in country
        const founder = this.hierarchyEnforcer.getUser(groupData.founderId);
        if (!founder || founder.countryCode !== countryCode) {
            return { success: false, error: 'Founder must be registered in this country' };
        }

        // Create group ID with country prefix
        const groupId = `${countryCode}_group_${Date.now()}`;

        const group = {
            id: groupId,
            countryCode,
            ...groupData,
            members: [groupData.founderId],
            memberCount: 1,
            lenders: [],
            borrowers: [],
            activeLoans: 0,
            totalLent: 0,
            repaymentRate: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // Store group
        this.hierarchyEnforcer.groupCache.set(groupId, group);

        // Update founder's groups
        founder.groups = founder.groups || [];
        founder.groups.push(groupId);
        this.hierarchyEnforcer.updateUser(founder);

        // Update country stats
        this.updateCountryStats(countryCode, 'groupCreated');

        return { success: true, group };
    }

    /**
     * Get all users in a country
     * @param {string} countryCode - 2-letter country code
     * @returns {Array} - Users in country
     */
    getUsersInCountry(countryCode) {
        const users = [];
        for (const [userId, user] of this.hierarchyEnforcer.userCache) {
            if (user.countryCode === countryCode) {
                users.push(user);
            }
        }
        return users;
    }

    /**
     * Get all groups in a country
     * @param {string} countryCode - 2-letter country code
     * @returns {Array} - Groups in country
     */
    getGroupsInCountry(countryCode) {
        const groups = [];
        for (const [groupId, group] of this.hierarchyEnforcer.groupCache) {
            if (group.countryCode === countryCode) {
                groups.push(group);
            }
        }
        return groups;
    }

    /**
     * Get country statistics
     * @param {string} countryCode - 2-letter country code
     * @returns {Object} - Country statistics
     */
    getCountryStats(countryCode) {
        const users = this.getUsersInCountry(countryCode);
        const groups = this.getGroupsInCountry(countryCode);

        const lenders = users.filter(u => u.role === 'lender');
        const borrowers = users.filter(u => u.role === 'borrower');
        const activeLenders = lenders.filter(l => l.subscription?.active);
        
        let totalLent = 0;
        let activeLoans = 0;

        // Calculate total lent and active loans (simplified)
        for (const group of groups) {
            totalLent += group.totalLent || 0;
            activeLoans += group.activeLoans || 0;
        }

        return {
            totalUsers: users.length,
            totalGroups: groups.length,
            activeLenders: activeLenders.length,
            activeBorrowers: borrowers.length,
            totalLent,
            activeLoans,
            currency: this.loadCountryCurrency(countryCode),
            lastUpdated: new Date().toISOString()
        };
    }

    // ============================================================================
    // PRIVATE HELPER METHODS
    // ============================================================================

    loadCountryConfig(countryCode) {
        switch (countryCode) {
            case 'ke': return kenyaConfig;
            case 'ug': return ugandaConfig;
            case 'tz': return tanzaniaConfig;
            case 'rw': return rwandaConfig;
            case 'cd': return drcConfig;
            case 'bi': return burundiConfig;
            case 'ng': return nigeriaConfig;
            case 'gh': return ghanaConfig;
            case 'ss': return southSudanConfig;
            case 'so': return somaliaConfig;
            case 'za': return southAfricaConfig;
            case 'et': return ethiopiaConfig;
            default: return {};
        }
    }

    loadCountryLegal(countryCode) {
        // In production, these would be loaded from respective legal files
        const legalModules = {
            ke: () => import('./ke/ke.legal.js'),
            ug: () => import('./ug/ug.legal.js'),
            tz: () => import('./tz/tz.legal.js'),
            rw: () => import('./rw/rw.legal.js'),
            cd: () => import('./cd/cd.legal.js'),
            bi: () => import('./bi/bi.legal.js'),
            ng: () => import('./ng/ng.legal.js'),
            gh: () => import('./gh/gh.legal.js'),
            ss: () => import('./ss/ss.legal.js'),
            so: () => import('./so/so.legal.js'),
            za: () => import('./za/za.legal.js'),
            et: () => import('./et/et.legal.js')
        };

        return legalModules[countryCode] ? {
            terms: `${countryCode}_terms.html`,
            privacy: `${countryCode}_privacy.html`,
            compliance: `${countryCode}_compliance.md`
        } : {};
    }

    loadCountryTheme(countryCode) {
        // Country-specific themes
        const themes = {
            ke: { primaryColor: '#003366', secondaryColor: '#0099ff', accentColor: '#f37021' },
            ug: { primaryColor: '#003366', secondaryColor: '#0099ff', accentColor: '#28a745' },
            tz: { primaryColor: '#003366', secondaryColor: '#0099ff', accentColor: '#ffcc00' },
            rw: { primaryColor: '#003366', secondaryColor: '#0099ff', accentColor: '#00a79d' },
            cd: { primaryColor: '#003366', secondaryColor: '#0099ff', accentColor: '#0077c8' },
            bi: { primaryColor: '#003366', secondaryColor: '#0099ff', accentColor: '#ce1126' },
            ng: { primaryColor: '#003366', secondaryColor: '#0099ff', accentColor: '#008751' },
            gh: { primaryColor: '#003366', secondaryColor: '#0099ff', accentColor: '#ce1126' },
            ss: { primaryColor: '#003366', secondaryColor: '#0099ff', accentColor: '#0f47af' },
            so: { primaryColor: '#003366', secondaryColor: '#0099ff', accentColor: '#4189dd' },
            za: { primaryColor: '#003366', secondaryColor: '#0099ff', accentColor: '#007749' },
            et: { primaryColor: '#003366', secondaryColor: '#0099ff', accentColor: '#da121a' }
        };

        return themes[countryCode] || themes.ke;
    }

    loadCountryCurrency(countryCode) {
        const currencies = {
            ke: { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling', decimals: 2 },
            ug: { code: 'UGX', symbol: 'UGX', name: 'Ugandan Shilling', decimals: 0 },
            tz: { code: 'TZS', symbol: 'TSh', name: 'Tanzanian Shilling', decimals: 0 },
            rw: { code: 'RWF', symbol: 'RF', name: 'Rwandan Franc', decimals: 0 },
            cd: { code: 'CDF', symbol: 'FC', name: 'Congolese Franc', decimals: 2 },
            bi: { code: 'BIF', symbol: 'FBu', name: 'Burundian Franc', decimals: 0 },
            ng: { code: 'NGN', symbol: '₦', name: 'Nigerian Naira', decimals: 2 },
            gh: { code: 'GHS', symbol: 'GH₵', name: 'Ghanaian Cedi', decimals: 2 },
            ss: { code: 'SSP', symbol: '£', name: 'South Sudanese Pound', decimals: 2 },
            so: { code: 'SOS', symbol: 'Sh.So.', name: 'Somali Shilling', decimals: 2 },
            za: { code: 'ZAR', symbol: 'R', name: 'South African Rand', decimals: 2 },
            et: { code: 'ETB', symbol: 'Br', name: 'Ethiopian Birr', decimals: 2 }
        };

        return currencies[countryCode] || currencies.ke;
    }

    loadCountryRules(countryCode) {
        // In production, load from country rules file
        return {
            validateUserRegistration: (userData) => {
                const errors = [];
                
                // Country-specific validation rules
                if (countryCode === 'ke' && userData.phone && !userData.phone.startsWith('+254')) {
                    errors.push('Kenyan phone number must start with +254');
                }
                
                if (countryCode === 'ng' && userData.phone && !userData.phone.startsWith('+234')) {
                    errors.push('Nigerian phone number must start with +234');
                }
                
                // Common validations
                if (!userData.fullName) errors.push('Full name required');
                if (!userData.nationalId) errors.push('National ID required');
                if (!userData.phone) errors.push('Phone number required');
                
                return {
                    valid: errors.length === 0,
                    errors
                };
            }
        };
    }

    getUserCountry(userId) {
        const user = this.hierarchyEnforcer.getUser(userId);
        return user ? user.countryCode : null;
    }

    getCountryUserCount(countryCode) {
        return this.getUsersInCountry(countryCode).length;
    }

    getCountryGroupCount(countryCode) {
        return this.getGroupsInCountry(countryCode).length;
    }

    calculateSubscriptionExpiry() {
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();
        
        // Expiry on 28th of current month or next month if already past 28th
        let expiryDate = new Date(currentYear, currentMonth, 28);
        if (now.getDate() > 28) {
            expiryDate = new Date(currentYear, currentMonth + 1, 28);
        }
        
        return expiryDate.toISOString();
    }

    updateCountryStats(countryCode, action) {
        // In production, update database
        console.log(`Country ${countryCode}: ${action}`);
    }

    logCountryEvent(countryCode, eventType, data) {
        // In production, log to analytics
        console.log(`Country Event [${countryCode}]: ${eventType}`, data);
    }
}

// ============================================================================
// 4️⃣ EXPORTS
// ============================================================================

export default {
    // Registry
    registry: countryRegistry,
    
    // Managers
    hierarchyEnforcer: new HierarchyEnforcer(),
    countryManager: new CountryManager(),
    
    // Helper functions
    getCountryByCode: (code) => countryRegistry.getByCode(code),
    getAllCountries: () => countryRegistry.getAll(),
    getCountryConfig: (code) => countryRegistry.getConfig(code),
    
    // Validation functions
    validateHierarchy: (userId, countryCode, groupId, userRole) => 
        new HierarchyEnforcer().validateHierarchy(userId, countryCode, groupId, userRole),
    
    // Country-specific functions
    getCountryTheme: (code) => {
        const manager = new CountryManager();
        return manager.loadCountryTheme(code);
    },
    
    getCountryCurrency: (code) => {
        const manager = new CountryManager();
        return manager.loadCountryCurrency(code);
    },
    
    // Statistics
    getGlobalStats: () => {
        const manager = new CountryManager();
        const stats = {};
        const countries = countryRegistry.getAll();
        
        countries.forEach(country => {
            stats[country.code] = manager.getCountryStats(country.code);
        });
        
        return {
            totalCountries: countries.length,
            totalActiveCountries: countries.filter(c => c.active).length,
            countries: stats,
            timestamp: new Date().toISOString()
        };
    }
};

// ============================================================================
// 5️⃣ GLOBAL HIERARCHY EXPOSURE (MANDATORY)
// ============================================================================

export const HIERARCHY = Object.freeze({
    LEVELS: ['GLOBAL', 'COUNTRIES', 'GROUPS', 'LENDERS', 'BORROWERS'],
    RULES: {
        COUNTRY_ISOLATION: 'No cross-country lending or borrowing',
        GROUP_ISOLATION: 'Lenders can only lend within their group',
        BORROWER_LIMITS: 'Maximum 4 groups per borrower, good rating required',
        SUBSCRIPTION_ENFORCEMENT: 'Lenders blocked when subscription expires',
        ADMIN_SUPREMACY: 'Admin can override any blacklist or ledger',
        EXPIRY_DATE: 'Subscription expires on 28th of each month'
    },
    ENFORCEMENT: new HierarchyEnforcer()
});

// Export for CommonJS compatibility
if (typeof module !== 'undefined' && module.exports) {
    module.exports = exports.default;
    module.exports.HIERARCHY = HIERARCHY;
}