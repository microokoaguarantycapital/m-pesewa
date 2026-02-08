/**
 * M-PESEWA COUNTRY REGISTRY
 * Central registry for all supported countries
 * Enforces country isolation and hierarchy rules
 */

class CountryRegistry {
    constructor() {
        this.countries = new Map();
        this.countryConfigs = new Map();
        this.activeCountries = new Set();
        this.countryGroups = new Map(); // countryCode -> Set of groupIds
        this.countryUsers = new Map(); // countryCode -> Set of userIds
        this.hierarchyLogs = [];
        this.isolationViolations = [];
        
        this.initializeDefaults();
    }

    /**
     * Initialize with default country configurations
     */
    initializeDefaults() {
        // Default country templates
        this.defaultConfig = {
            active: true,
            currency: { code: 'USD', symbol: '$', name: 'US Dollar', decimals: 2 },
            language: 'en',
            timezone: 'UTC',
            legalAge: 18,
            maxGroupsPerUser: 4,
            minGroupMembers: 5,
            maxGroupMembers: 1000,
            subscriptionExpiryDay: 28, // 28th of each month
            interestRate: 0.10, // 10%
            penaltyRate: 0.05, // 5% daily after 7 days
            defaultLoanPeriod: 7, // days
            blacklistPeriod: 60, // days (2 months)
            requiresCRB: false,
            taxRate: 0,
            transactionFee: 0,
            support: {
                email: 'support@mpesewa.com',
                phone: '',
                whatsapp: '',
                address: ''
            },
            bankingHours: '9:00 AM - 5:00 PM',
            holidays: [],
            compliance: {
                kycRequired: true,
                idVerification: true,
                addressVerification: false,
                incomeVerification: false
            }
        };
    }

    /**
     * Register a country in the registry
     * @param {Object} country - Country object
     * @throws {Error} - If country already exists or validation fails
     */
    register(country) {
        // Validation
        if (!country.code || !country.name) {
            throw new Error('Country must have code and name');
        }

        if (this.countries.has(country.code)) {
            throw new Error(`Country ${country.code} already registered`);
        }

        // Validate country code (ISO 3166-1 alpha-2)
        if (!/^[A-Z]{2}$/.test(country.code)) {
            throw new Error('Country code must be 2-letter ISO code');
        }

        // Set default values
        const countryWithDefaults = {
            ...this.defaultConfig,
            ...country,
            registeredAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            stats: {
                totalUsers: 0,
                totalGroups: 0,
                totalLenders: 0,
                totalBorrowers: 0,
                activeLenders: 0,
                activeBorrowers: 0,
                totalAmountLent: 0,
                totalAmountBorrowed: 0,
                repaymentRate: 0,
                defaultRate: 0,
                avgLoanAmount: 0,
                avgLoanDuration: 0
            }
        };

        // Store country
        this.countries.set(country.code, countryWithDefaults);
        this.countryGroups.set(country.code, new Set());
        this.countryUsers.set(country.code, new Set());
        
        if (countryWithDefaults.active) {
            this.activeCountries.add(country.code);
        }

        // Log registration
        this.logHierarchyEvent('country_registered', {
            countryCode: country.code,
            countryName: country.name,
            timestamp: new Date().toISOString()
        });

        console.log(`✅ Country registered: ${country.name} (${country.code})`);
    }

    /**
     * Get country by code
     * @param {string} code - 2-letter country code
     * @returns {Object|null} - Country object or null
     */
    getByCode(code) {
        return this.countries.get(code.toUpperCase()) || null;
    }

    /**
     * Get country configuration
     * @param {string} code - 2-letter country code
     * @returns {Object} - Country configuration
     */
    getConfig(code) {
        const country = this.getByCode(code);
        if (!country) {
            throw new Error(`Country ${code} not found`);
        }
        return country;
    }

    /**
     * Get all registered countries
     * @returns {Array} - Array of country objects
     */
    getAll() {
        return Array.from(this.countries.values()).sort((a, b) => 
            a.name.localeCompare(b.name)
        );
    }

    /**
     * Get all active countries
     * @returns {Array} - Array of active country objects
     */
    getActive() {
        return this.getAll().filter(country => country.active);
    }

    /**
     * Update country configuration
     * @param {string} code - Country code
     * @param {Object} updates - Updates to apply
     * @returns {Object} - Updated country
     */
    update(code, updates) {
        const country = this.getByCode(code);
        if (!country) {
            throw new Error(`Country ${code} not found`);
        }

        // Prevent modification of protected fields
        const protectedFields = ['code', 'name', 'registeredAt'];
        protectedFields.forEach(field => {
            if (field in updates) {
                throw new Error(`Cannot modify protected field: ${field}`);
            }
        });

        // Apply updates
        Object.assign(country, updates, {
            updatedAt: new Date().toISOString()
        });

        // Update active status
        if ('active' in updates) {
            if (updates.active) {
                this.activeCountries.add(code);
            } else {
                this.activeCountries.delete(code);
            }
        }

        this.logHierarchyEvent('country_updated', {
            countryCode: code,
            updates: Object.keys(updates),
            timestamp: new Date().toISOString()
        });

        return country;
    }

    /**
     * Register a user in a country
     * @param {string} countryCode - Country code
     * @param {string} userId - User ID
     * @throws {Error} - If user already registered in another country
     */
    registerUser(countryCode, userId) {
        // Check if user already registered in another country
        for (const [code, users] of this.countryUsers) {
            if (users.has(userId) && code !== countryCode) {
                this.logIsolationViolation({
                    type: 'cross_country_registration_attempt',
                    userId,
                    currentCountry: code,
                    attemptedCountry: countryCode,
                    timestamp: new Date().toISOString()
                });
                throw new Error(`User ${userId} already registered in ${code}. Country switching not allowed.`);
            }
        }

        // Register user
        const users = this.countryUsers.get(countryCode);
        if (users) {
            users.add(userId);
            
            // Update country stats
            const country = this.getByCode(countryCode);
            if (country) {
                country.stats.totalUsers++;
            }

            this.logHierarchyEvent('user_registered_in_country', {
                countryCode,
                userId,
                timestamp: new Date().toISOString()
            });
        }
    }

    /**
     * Register a group in a country
     * @param {string} countryCode - Country code
     * @param {string} groupId - Group ID
     */
    registerGroup(countryCode, groupId) {
        const groups = this.countryGroups.get(countryCode);
        if (groups) {
            groups.add(groupId);
            
            // Update country stats
            const country = this.getByCode(countryCode);
            if (country) {
                country.stats.totalGroups++;
            }

            this.logHierarchyEvent('group_registered_in_country', {
                countryCode,
                groupId,
                timestamp: new Date().toISOString()
            });
        }
    }

    /**
     * Validate country isolation for a transaction
     * @param {string} fromCountry - Source country
     * @param {string} toCountry - Target country
     * @param {string} transactionType - Type of transaction
     * @returns {Object} - Validation result
     */
    validateIsolation(fromCountry, toCountry, transactionType) {
        if (fromCountry !== toCountry) {
            const violation = {
                type: 'cross_country_violation',
                transactionType,
                fromCountry,
                toCountry,
                timestamp: new Date().toISOString(),
                severity: 'HIGH'
            };
            
            this.logIsolationViolation(violation);
            
            return {
                valid: false,
                violation,
                message: `Cross-country ${transactionType} prohibited. From: ${fromCountry}, To: ${toCountry}`
            };
        }

        return { valid: true };
    }

    /**
     * Get users in a country
     * @param {string} countryCode - Country code
     * @returns {Set} - Set of user IDs
     */
    getUsersInCountry(countryCode) {
        return new Set(this.countryUsers.get(countryCode) || []);
    }

    /**
     * Get groups in a country
     * @param {string} countryCode - Country code
     * @returns {Set} - Set of group IDs
     */
    getGroupsInCountry(countryCode) {
        return new Set(this.countryGroups.get(countryCode) || []);
    }

    /**
     * Get country statistics
     * @param {string} countryCode - Country code
     * @returns {Object} - Country statistics
     */
    getStats(countryCode) {
        const country = this.getByCode(countryCode);
        if (!country) {
            return null;
        }

        const users = this.getUsersInCountry(countryCode);
        const groups = this.getGroupsInCountry(countryCode);

        return {
            ...country.stats,
            activeUsers: users.size,
            activeGroups: groups.size,
            lastUpdated: new Date().toISOString()
        };
    }

    /**
     * Get global statistics
     * @returns {Object} - Global statistics
     */
    getGlobalStats() {
        const stats = {
            totalCountries: this.countries.size,
            activeCountries: this.activeCountries.size,
            totalUsers: 0,
            totalGroups: 0,
            countries: {}
        };

        for (const [code, country] of this.countries) {
            const countryStats = this.getStats(code);
            stats.totalUsers += countryStats?.activeUsers || 0;
            stats.totalGroups += countryStats?.activeGroups || 0;
            stats.countries[code] = countryStats;
        }

        return stats;
    }

    /**
     * Search countries by criteria
     * @param {Object} criteria - Search criteria
     * @returns {Array} - Matching countries
     */
    search(criteria = {}) {
        let results = this.getAll();

        if (criteria.active !== undefined) {
            results = results.filter(c => c.active === criteria.active);
        }

        if (criteria.region) {
            results = results.filter(c => c.region === criteria.region);
        }

        if (criteria.currency) {
            results = results.filter(c => c.currency?.code === criteria.currency);
        }

        if (criteria.language) {
            results = results.filter(c => c.language === criteria.language);
        }

        if (criteria.searchTerm) {
            const term = criteria.searchTerm.toLowerCase();
            results = results.filter(c => 
                c.name.toLowerCase().includes(term) ||
                c.code.toLowerCase().includes(term) ||
                (c.currency?.name?.toLowerCase() || '').includes(term)
            );
        }

        return results;
    }

    /**
     * Export country data for backup
     * @returns {Object} - Export data
     */
    export() {
        return {
            metadata: {
                exportedAt: new Date().toISOString(),
                version: '1.0.0',
                count: this.countries.size
            },
            countries: Array.from(this.countries.values()),
            hierarchyLogs: this.hierarchyLogs.slice(-1000), // Last 1000 logs
            isolationViolations: this.isolationViolations
        };
    }

    /**
     * Import country data
     * @param {Object} data - Import data
     */
    import(data) {
        if (!data || !data.countries || !Array.isArray(data.countries)) {
            throw new Error('Invalid import data');
        }

        // Clear existing data
        this.countries.clear();
        this.countryGroups.clear();
        this.countryUsers.clear();
        this.activeCountries.clear();

        // Import countries
        data.countries.forEach(country => {
            this.register(country);
        });

        // Import logs if available
        if (data.hierarchyLogs) {
            this.hierarchyLogs = data.hierarchyLogs;
        }

        if (data.isolationViolations) {
            this.isolationViolations = data.isolationViolations;
        }

        console.log(`✅ Imported ${data.countries.length} countries`);
    }

    /**
     * Reset registry (for testing only)
     */
    reset() {
        this.countries.clear();
        this.countryGroups.clear();
        this.countryUsers.clear();
        this.activeCountries.clear();
        this.hierarchyLogs = [];
        this.isolationViolations = [];
        console.log('🔄 Registry reset');
    }

    // ============================================================================
    // PRIVATE METHODS
    // ============================================================================

    /**
     * Log hierarchy event
     * @param {string} event - Event type
     * @param {Object} data - Event data
     */
    logHierarchyEvent(event, data) {
        const logEntry = {
            event,
            ...data,
            logId: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        };

        this.hierarchyLogs.push(logEntry);

        // Keep only last 10,000 logs
        if (this.hierarchyLogs.length > 10000) {
            this.hierarchyLogs = this.hierarchyLogs.slice(-10000);
        }
    }

    /**
     * Log isolation violation
     * @param {Object} violation - Violation data
     */
    logIsolationViolation(violation) {
        this.isolationViolations.push(violation);
        
        // Alert system (in production, would trigger alerts)
        console.error('🚨 ISOLATION VIOLATION:', violation);
        
        // Keep only last 1000 violations
        if (this.isolationViolations.length > 1000) {
            this.isolationViolations = this.isolationViolations.slice(-1000);
        }
    }

    /**
     * Get hierarchy logs
     * @param {Object} filter - Filter criteria
     * @returns {Array} - Filtered logs
     */
    getHierarchyLogs(filter = {}) {
        let logs = this.hierarchyLogs;

        if (filter.countryCode) {
            logs = logs.filter(log => log.countryCode === filter.countryCode);
        }

        if (filter.eventType) {
            logs = logs.filter(log => log.event === filter.eventType);
        }

        if (filter.startDate) {
            const start = new Date(filter.startDate);
            logs = logs.filter(log => new Date(log.timestamp) >= start);
        }

        if (filter.endDate) {
            const end = new Date(filter.endDate);
            logs = logs.filter(log => new Date(log.timestamp) <= end);
        }

        if (filter.limit) {
            logs = logs.slice(-filter.limit);
        }

        return logs;
    }

    /**
     * Get isolation violations
     * @param {Object} filter - Filter criteria
     * @returns {Array} - Filtered violations
     */
    getIsolationViolations(filter = {}) {
        let violations = this.isolationViolations;

        if (filter.countryCode) {
            violations = violations.filter(v => 
                v.fromCountry === filter.countryCode || 
                v.toCountry === filter.countryCode
            );
        }

        if (filter.type) {
            violations = violations.filter(v => v.type === filter.type);
        }

        if (filter.severity) {
            violations = violations.filter(v => v.severity === filter.severity);
        }

        if (filter.startDate) {
            const start = new Date(filter.startDate);
            violations = violations.filter(v => new Date(v.timestamp) >= start);
        }

        if (filter.endDate) {
            const end = new Date(filter.endDate);
            violations = violations.filter(v => new Date(v.timestamp) <= end);
        }

        return violations;
    }

    /**
     * Cleanup old logs and violations
     * @param {number} daysOld - Delete logs older than this many days
     */
    cleanupOldData(daysOld = 30) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysOld);

        // Clean hierarchy logs
        this.hierarchyLogs = this.hierarchyLogs.filter(log => 
            new Date(log.timestamp) > cutoffDate
        );

        // Clean isolation violations
        this.isolationViolations = this.isolationViolations.filter(violation =>
            new Date(violation.timestamp) > cutoffDate
        );

        console.log(`🧹 Cleaned up data older than ${daysOld} days`);
    }
}

// Export singleton instance
const countryRegistryInstance = new CountryRegistry();
export default countryRegistryInstance;

// Export class for testing
export { CountryRegistry };

// Export for CommonJS compatibility
if (typeof module !== 'undefined' && module.exports) {
    module.exports = countryRegistryInstance;
    module.exports.CountryRegistry = CountryRegistry;
}