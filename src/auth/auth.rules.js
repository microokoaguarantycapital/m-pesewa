/**
 * M-Pesewa Authentication Rules
 * Strict business rules and validation logic
 */

class AuthRules {
    constructor() {
        this.countries = {
            'KE': { name: 'Kenya', currency: 'KSh', flag: '🇰🇪' },
            'UG': { name: 'Uganda', currency: 'UGX', flag: '🇺🇬' },
            'TZ': { name: 'Tanzania', currency: 'TZS', flag: '🇹🇿' },
            'RW': { name: 'Rwanda', currency: 'RWF', flag: '🇷🇼' },
            'BI': { name: 'Burundi', currency: 'BIF', flag: '🇧🇮' },
            'CD': { name: 'DR Congo', currency: 'CDF', flag: '🇨🇩' },
            'SS': { name: 'South Sudan', currency: 'SSP', flag: '🇸🇸' },
            'ZA': { name: 'South Africa', currency: 'ZAR', flag: '🇿🇦' },
            'NG': { name: 'Nigeria', currency: 'NGN', flag: '🇳🇬' },
            'GH': { name: 'Ghana', currency: 'GHS', flag: '🇬🇭' },
            'ET': { name: 'Ethiopia', currency: 'ETB', flag: '🇪🇹' },
            'SO': { name: 'Somalia', currency: 'SOS', flag: '🇸🇴' }
        };
        
        this.subscriptionPlans = {
            'basic': {
                id: 'basic',
                name: 'Basic',
                limits: {
                    maxPerWeek: 1500,
                    maxLedgers: 1500,
                    crbCheck: false
                },
                pricing: {
                    monthly: 50,
                    biAnnual: 250,
                    annual: 500
                },
                description: 'Basic Tier - Up to 1,500 per week'
            },
            'premium': {
                id: 'premium',
                name: 'Premium',
                limits: {
                    maxPerWeek: 5000,
                    maxLedgers: 10000,
                    crbCheck: false
                },
                pricing: {
                    monthly: 250,
                    biAnnual: 1500,
                    annual: 2500
                },
                description: 'Premium Tier - Up to 5,000 per week'
            },
            'super': {
                id: 'super',
                name: 'Super',
                limits: {
                    maxPerWeek: 20000,
                    maxLedgers: 20000,
                    crbCheck: true
                },
                pricing: {
                    monthly: 1000,
                    biAnnual: 5000,
                    annual: 8500
                },
                description: 'Super Tier - Up to 20,000 per week'
            },
            'lender_of_lenders': {
                id: 'lender_of_lenders',
                name: 'Lender of Lenders',
                limits: {
                    maxPerWeek: 50000,
                    maxLedgers: 50000,
                    crbCheck: true
                },
                pricing: {
                    monthly: 500,
                    biAnnual: 3500,
                    annual: 6500
                },
                description: 'Lender of Lenders - Up to 50,000 per week'
            }
        };
        
        this.loanTerms = {
            repaymentPeriod: 7, // days
            interestRate: 0.10, // 10%
            dailyPenalty: 0.05, // 5% daily after 7 days
            defaultThreshold: 60, // days (2 months)
            minLoan: 5 // minimum loan amount
        };
        
        this.userLimits = {
            borrower: {
                maxGroups: 4,
                minRatingForAdditionalGroups: 3, // stars
                canBeLender: true
            },
            lender: {
                maxGroups: 1,
                subscriptionRequired: true,
                canBeBorrower: true
            }
        };
        
        this.validationRules = {
            username: {
                minLength: 3,
                maxLength: 20,
                pattern: /^[a-zA-Z0-9_]+$/,
                message: 'Username must be 3-20 characters, letters and numbers only'
            },
            password: {
                minLength: 8,
                maxLength: 12,
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                message: 'Password must be 8-12 characters with uppercase, lowercase, number, and symbol'
            },
            email: {
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Please enter a valid email address'
            },
            phone: {
                minLength: 10,
                pattern: /^\+?[\d\s\-\(\)]+$/,
                message: 'Please enter a valid phone number'
            },
            name: {
                minLength: 2,
                maxLength: 50,
                pattern: /^[a-zA-Z\s\-']+$/,
                message: 'Name must be 2-50 letters only'
            }
        };
    }
    
    /**
     * Validate user registration data
     * @param {Object} data - Registration data
     * @param {string} role - User role
     * @returns {Object} - Validation result
     */
    validateRegistration(data, role) {
        const errors = [];
        const warnings = [];
        
        // Validate required fields
        const requiredFields = ['username', 'email', 'phone', 'fullName', 'country'];
        for (const field of requiredFields) {
            if (!data[field] || data[field].trim() === '') {
                errors.push(`${this.formatFieldName(field)} is required`);
            }
        }
        
        // Validate username
        if (data.username) {
            if (data.username.length < this.validationRules.username.minLength ||
                data.username.length > this.validationRules.username.maxLength) {
                errors.push(this.validationRules.username.message);
            } else if (!this.validationRules.username.pattern.test(data.username)) {
                errors.push('Username can only contain letters, numbers, and underscores');
            }
        }
        
        // Validate email
        if (data.email && !this.validationRules.email.pattern.test(data.email)) {
            errors.push(this.validationRules.email.message);
        }
        
        // Validate phone
        if (data.phone && data.phone.length < this.validationRules.phone.minLength) {
            errors.push(this.validationRules.phone.message);
        }
        
        // Validate password (if provided during registration)
        if (data.password) {
            if (data.password.length < this.validationRules.password.minLength ||
                data.password.length > this.validationRules.password.maxLength) {
                errors.push('Password must be 8-12 characters');
            } else if (!this.validationRules.password.pattern.test(data.password)) {
                errors.push('Password must contain uppercase, lowercase, numbers, and symbols');
            }
        }
        
        // Validate country
        if (data.country && !this.isValidCountry(data.country)) {
            errors.push('Invalid country selection');
        }
        
        // Validate referrers
        if (!data.referrers || data.referrers.length < 2) {
            errors.push('Two referrers/guarantors are required');
        } else {
            data.referrers.forEach((referrer, index) => {
                if (!referrer.name || referrer.name.trim().length < 2) {
                    errors.push(`Referrer ${index + 1} name is required`);
                }
                if (!referrer.phone || referrer.phone.length < 10) {
                    errors.push(`Referrer ${index + 1} phone is required`);
                }
            });
        }
        
        // Role-specific validation
        if (role === 'lender') {
            if (!data.subscriptionLevel || !this.subscriptionPlans[data.subscriptionLevel]) {
                errors.push('Valid subscription level is required for lenders');
            }
        }
        
        // Check for duplicate username/email (simulated)
        const existingUsers = this.getExistingUsers();
        if (data.username && existingUsers.some(u => u.username === data.username)) {
            errors.push('Username already taken');
        }
        
        if (data.email && existingUsers.some(u => u.email === data.email)) {
            errors.push('Email already registered');
        }
        
        // Check if user can join based on country rules
        if (data.country) {
            const countryRules = this.getCountryRules(data.country);
            if (countryRules.restrictions && countryRules.restrictions.newRegistrations) {
                warnings.push('New registrations in this country may have temporary restrictions');
            }
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors,
            warnings: warnings
        };
    }
    
    /**
     * Validate loan application
     * @param {Object} loanData - Loan application data
     * @param {Object} borrower - Borrower data
     * @param {Object} lender - Lender data (if applicable)
     * @returns {Object} - Validation result
     */
    validateLoanApplication(loanData, borrower, lender = null) {
        const errors = [];
        
        // Basic loan validation
        if (!loanData.amount || loanData.amount <= 0) {
            errors.push('Loan amount must be greater than 0');
        }
        
        if (!loanData.category || !this.isValidCategory(loanData.category)) {
            errors.push('Valid loan category is required');
        }
        
        if (!loanData.purpose || loanData.purpose.trim() === '') {
            errors.push('Loan purpose is required');
        }
        
        // Amount validation
        if (loanData.amount < this.loanTerms.minLoan) {
            errors.push(`Minimum loan amount is ${this.loanTerms.minLoan}`);
        }
        
        // Borrower validation
        if (!borrower) {
            errors.push('Borrower information is required');
            return { isValid: false, errors };
        }
        
        // Check borrower rating
        if (borrower.rating < 1) {
            errors.push('Borrower has insufficient rating');
        }
        
        // Check if borrower is blacklisted
        if (borrower.blacklistStatus && borrower.blacklistStatus.isBlacklisted) {
            errors.push('Borrower is blacklisted and cannot receive loans');
        }
        
        // Check if borrower has reached group limit
        if (borrower.currentGroups && borrower.currentGroups.length >= this.userLimits.borrower.maxGroups) {
            errors.push('Borrower has reached maximum group limit (4)');
        }
        
        // Check if borrower has active loan in same group
        if (loanData.groupId && borrower.activeLoans) {
            const activeInGroup = borrower.activeLoobs.some(loan => 
                loan.groupId === loanData.groupId && loan.status === 'active'
            );
            if (activeInGroup) {
                errors.push('Borrower already has an active loan in this group');
            }
        }
        
        // Lender validation (if lender is specified)
        if (lender) {
            // Check lender subscription
            if (!lender.subscription || lender.subscription.status !== 'active') {
                errors.push('Lender subscription is not active');
            }
            
            // Check lender limits
            if (lender.subscription && lender.subscription.limits) {
                const limits = lender.subscription.limits;
                
                // Check weekly limit
                if (loanData.amount > limits.maxPerWeek) {
                    errors.push(`Loan amount exceeds lender's weekly limit of ${limits.maxPerWeek}`);
                }
                
                // Check ledger count
                if (lender.ledgerCount && lender.ledgerCount >= limits.maxLedgers) {
                    errors.push(`Lender has reached maximum ledger limit of ${limits.maxLedgers}`);
                }
            }
            
            // Check if lender and borrower are in same group
            if (loanData.groupId && lender.groupId !== loanData.groupId) {
                errors.push('Lender can only lend within their own group');
            }
            
            // Check CRB requirement for higher tiers
            if (lender.subscription && lender.subscription.limits.crbCheck) {
                if (!borrower.crbVerified) {
                    warnings.push('CRB check recommended for this loan amount');
                }
            }
        }
        
        // Country validation
        if (borrower.country !== loanData.country) {
            errors.push('Borrower and loan must be in the same country');
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors,
            warnings: warnings || []
        };
    }
    
    /**
     * Validate subscription payment
     * @param {Object} paymentData - Payment data
     * @param {string} subscriptionLevel - Subscription level
     * @returns {Object} - Validation result
     */
    validateSubscriptionPayment(paymentData, subscriptionLevel) {
        const errors = [];
        
        if (!paymentData.paymentMethod) {
            errors.push('Payment method is required');
        }
        
        if (!paymentData.amount || paymentData.amount <= 0) {
            errors.push('Valid payment amount is required');
        }
        
        const plan = this.subscriptionPlans[subscriptionLevel];
        if (!plan) {
            errors.push('Invalid subscription level');
            return { isValid: false, errors };
        }
        
        // Validate payment amount matches plan pricing
        const validAmounts = Object.values(plan.pricing);
        if (!validAmounts.includes(paymentData.amount)) {
            errors.push(`Payment amount must be one of: ${validAmounts.join(', ')}`);
        }
        
        // Validate payment period
        let period = 'monthly';
        if (paymentData.amount === plan.pricing.biAnnual) period = 'biAnnual';
        if (paymentData.amount === plan.pricing.annual) period = 'annual';
        
        return {
            isValid: errors.length === 0,
            errors: errors,
            period: period,
            plan: plan
        };
    }
    
    /**
     * Check if country is valid
     * @param {string} countryCode - 2-letter country code
     * @returns {boolean}
     */
    isValidCountry(countryCode) {
        return this.countries.hasOwnProperty(countryCode.toUpperCase());
    }
    
    /**
     * Check if loan category is valid
     * @param {string} category - Loan category
     * @returns {boolean}
     */
    isValidCategory(category) {
        const validCategories = [
            'transport', 'data', 'gas', 'food', 'water', 'electricity',
            'tv', 'fuel', 'repair', 'business', 'health', 'education',
            'advance', 'rent', 'school_fees', 'medicine', 'wifi', 'creditor',
            'working_capital', 'market', 'stall', 'hawker', 'fuliza'
        ];
        return validCategories.includes(category);
    }
    
    /**
     * Get country rules
     * @param {string} countryCode - 2-letter country code
     * @returns {Object} - Country rules
     */
    getCountryRules(countryCode) {
        const baseRules = {
            isolation: true, // No cross-country transactions
            currency: this.countries[countryCode]?.currency || 'USD',
            maxGroupSize: 1000,
            minGroupSize: 5,
            requiresNationalId: true,
            legalAge: 18,
            restrictions: {
                newRegistrations: false,
                maxLoanAmount: null,
                specialCategories: []
            }
        };
        
        // Country-specific overrides
        const countryOverrides = {
            'KE': {
                legalAge: 18,
                requiresNationalId: true,
                restrictions: {
                    maxLoanAmount: 50000
                }
            },
            'NG': {
                legalAge: 18,
                requiresNationalId: true,
                restrictions: {
                    maxLoanAmount: 200000
                }
            },
            'ZA': {
                legalAge: 18,
                requiresNationalId: true,
                restrictions: {
                    crbRequired: true
                }
            }
        };
        
        return {
            ...baseRules,
            ...(countryOverrides[countryCode] || {})
        };
    }
    
    /**
     * Calculate loan terms
     * @param {number} amount - Loan amount
     * @param {string} subscriptionLevel - Lender's subscription level
     * @returns {Object} - Loan terms
     */
    calculateLoanTerms(amount, subscriptionLevel = 'basic') {
        const interest = amount * this.loanTerms.interestRate;
        const totalRepayable = amount + interest;
        const dailyRepayment = totalRepayable / this.loanTerms.repaymentPeriod;
        
        // Calculate limits based on subscription
        const plan = this.subscriptionPlans[subscriptionLevel];
        const maxLoan = plan ? plan.limits.maxPerWeek : this.subscriptionPlans.basic.limits.maxPerWeek;
        
        return {
            amount: amount,
            interest: interest,
            totalRepayable: totalRepayable,
            dailyRepayment: dailyRepayment,
            repaymentPeriod: this.loanTerms.repaymentPeriod,
            dueDate: this.calculateDueDate(),
            maxLoan: maxLoan,
            isValid: amount <= maxLoan,
            penaltyRate: this.loanTerms.dailyPenalty,
            defaultThreshold: this.loanTerms.defaultThreshold
        };
    }
    
    /**
     * Calculate due date (7 days from now)
     * @returns {Date} - Due date
     */
    calculateDueDate() {
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + this.loanTerms.repaymentPeriod);
        return dueDate;
    }
    
    /**
     * Calculate penalties
     * @param {number} overdueAmount - Overdue amount
     * @param {number} overdueDays - Days overdue
     * @returns {number} - Penalty amount
     */
    calculatePenalties(overdueAmount, overdueDays) {
        if (overdueDays <= this.loanTerms.repaymentPeriod) {
            return 0;
        }
        
        const penaltyDays = overdueDays - this.loanTerms.repaymentPeriod;
        let totalPenalty = 0;
        
        for (let i = 1; i <= penaltyDays; i++) {
            totalPenalty += overdueAmount * this.loanTerms.dailyPenalty;
        }
        
        return totalPenalty;
    }
    
    /**
     * Check if user can join additional groups
     * @param {Object} user - User data
     * @returns {Object} - Validation result
     */
    canJoinMoreGroups(user) {
        if (!user || user.role !== 'borrower') {
            return {
                canJoin: false,
                reason: 'Only borrowers can join multiple groups'
            };
        }
        
        const currentGroups = user.currentGroups || [];
        const maxGroups = this.userLimits.borrower.maxGroups;
        
        if (currentGroups.length >= maxGroups) {
            return {
                canJoin: false,
                reason: `Maximum ${maxGroups} groups reached`
            };
        }
        
        // Check rating for additional groups (beyond first)
        if (currentGroups.length >= 1 && user.rating < this.userLimits.borrower.minRatingForAdditionalGroups) {
            return {
                canJoin: false,
                reason: `Minimum ${this.userLimits.borrower.minRatingForAdditionalGroups} star rating required for additional groups`
            };
        }
        
        // Check if user is blacklisted
        if (user.blacklistStatus && user.blacklistStatus.isBlacklisted) {
            return {
                canJoin: false,
                reason: 'Blacklisted users cannot join new groups'
            };
        }
        
        return {
            canJoin: true,
            reason: ''
        };
    }
    
    /**
     * Check if user can switch roles
     * @param {Object} user - Current user data
     * @param {string} newRole - Desired new role
     * @returns {Object} - Validation result
     */
    canSwitchRole(user, newRole) {
        if (!user) {
            return {
                canSwitch: false,
                reason: 'User not found'
            };
        }
        
        if (user.role === newRole) {
            return {
                canSwitch: false,
                reason: 'User already has this role'
            };
        }
        
        // Check if user can have dual roles
        if (newRole === 'lender' && !this.userLimits.borrower.canBeLender) {
            return {
                canSwitch: false,
                reason: 'Borrowers cannot become lenders'
            };
        }
        
        if (newRole === 'borrower' && !this.userLimits.lender.canBeBorrower) {
            return {
                canSwitch: false,
                reason: 'Lenders cannot become borrowers'
            };
        }
        
        // For borrowers becoming lenders, check subscription requirement
        if (newRole === 'lender') {
            if (!user.subscription || user.subscription.status !== 'active') {
                return {
                    canSwitch: false,
                    reason: 'Active subscription required for lenders'
                };
            }
        }
        
        return {
            canSwitch: true,
            reason: '',
            requiresNewRegistration: true // Users must register separately for each role
        };
    }
    
    /**
     * Get subscription expiry date
     * @param {string} period - 'monthly', 'biAnnual', or 'annual'
     * @returns {Date} - Expiry date
     */
    getSubscriptionExpiry(period = 'monthly') {
        const now = new Date();
        let expiry = new Date();
        
        switch (period) {
            case 'monthly':
                expiry.setMonth(now.getMonth() + 1);
                // Always expire on 28th
                expiry.setDate(28);
                break;
            case 'biAnnual':
                expiry.setMonth(now.getMonth() + 6);
                expiry.setDate(28);
                break;
            case 'annual':
                expiry.setFullYear(now.getFullYear() + 1);
                expiry.setDate(28);
                break;
            default:
                expiry.setMonth(now.getMonth() + 1);
                expiry.setDate(28);
        }
        
        return expiry;
    }
    
    /**
     * Format field name for display
     * @param {string} field - Field name
     * @returns {string} - Formatted field name
     */
    formatFieldName(field) {
        return field
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase());
    }
    
    /**
     * Get existing users (simulated)
     * @returns {Array} - Array of existing users
     */
    getExistingUsers() {
        try {
            return JSON.parse(localStorage.getItem('mpesewa_users_registry') || '[]');
        } catch (error) {
            return [];
        }
    }
    
    /**
     * Get emergency categories
     * @returns {Array} - Array of category objects
     */
    getEmergencyCategories() {
        return [
            { id: 'transport', name: 'M-pesewa Fare', icon: '🚌', description: 'Move on, don\'t stall—borrow for your journey.' },
            { id: 'data', name: 'M-pesewa Data', icon: '📶', description: 'Stay connected, stay informed—borrow when your bundle runs out.' },
            { id: 'gas', name: 'M-pesewa Cooking Gas', icon: '🔥', description: 'Cook with confidence—borrow when your gas is low.' },
            { id: 'food', name: 'M-pesewa Food', icon: '🍲', description: 'Don\'t sleep hungry when paycheck is delayed—borrow and eat today.' },
            { id: 'wifi', name: 'M-pesewa Wifi', icon: '📡', description: 'Stay connected at home.' },
            { id: 'water', name: 'M-pesewa Water Bill', icon: '🚰', description: 'Stay hydrated—borrow for water needs or bills.' },
            { id: 'electricity', name: 'M-pesewa Electricity Tokens', icon: '⚡', description: 'Stay lit, stay powered—borrow tokens when you need it.' },
            { id: 'tv', name: 'M-pesewa TV Subscription', icon: '📺', description: 'Never miss your favorite shows.' },
            { id: 'fuel', name: 'M-pesewa Fuel', icon: '⛽', description: 'Keep moving—borrow for fuel, no matter your ride (Bike/Car/Tuktuk).' },
            { id: 'repair', name: 'M-pesewa Repair', icon: '🔧', description: 'Fix it quick—borrow for minor repairs and keep going.' },
            { id: 'creditor', name: 'M-pesewa Credo', icon: '🛠️', description: 'Fix it fast—borrow for urgent repairs or tools.' },
            { id: 'business', name: 'M-Pesa Daily Sales Advance', icon: '🧾', description: 'Small Loan advance for everyday business.' },
            { id: 'working_capital', name: 'M-Pesa Working Capital Advance', icon: '🏪', description: 'Working capital when your business needs it.' },
            { id: 'market', name: 'M-Pesewa Soko Loan', icon: '🛒', description: 'Market money when you need it.' },
            { id: 'stall', name: 'M-Pesewa Kidandaski Loan', icon: '🏗️', description: 'Kibanda/stall money when you need it.' },
            { id: 'hawker', name: 'M-Pesewa Hawker Loan', icon: '🚶‍♂️', description: 'Be Street smart, cash flow all time.' },
            { id: 'fuliza', name: 'M-fuliziwa Loan', icon: '🔄', description: 'Your fuliza is not enough? Top up here.' },
            { id: 'medicine', name: 'M-pesewa Medicine', icon: '💊', description: 'Health first—borrow for urgent medicines.' },
            { id: 'school_fees', name: 'M-pesewa School Fees', icon: '🎓', description: 'Secure your future without delay.' },
            { id: 'advance', name: 'M-pesewa Advance', icon: '💸', description: 'Quick cash when you need it most.' }
        ];
    }
}

// Export singleton instance
const authRules = new AuthRules();
window.AuthRules = authRules;

export default authRules;