/**
 * M-Pesewa Authentication Service
 * Strict authentication rules and hierarchy enforcement
 */

class AuthService {
    constructor() {
        this.currentUser = null;
        this.country = null;
        this.userRole = null;
        this.sessionTimeout = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
        this.init();
    }

    init() {
        this.loadSession();
        this.setupAutoLogout();
    }

    /**
     * Load user session from localStorage
     */
    loadSession() {
        try {
            const userData = localStorage.getItem('mpesewa_user_data');
            if (userData) {
                this.currentUser = JSON.parse(userData);
                this.country = localStorage.getItem('mpesewa_country');
                this.userRole = localStorage.getItem('mpesewa_user_role');
            }
        } catch (error) {
            console.error('Error loading session:', error);
            this.clearSession();
        }
    }

    /**
     * Register a new user (Borrower or Lender)
     * @param {Object} userData - User registration data
     * @param {string} role - 'borrower' or 'lender'
     * @returns {Promise<Object>} - Registration result
     */
    async register(userData, role = 'borrower') {
        // Validate required fields based on role
        if (!this.validateRegistration(userData, role)) {
            throw new Error('Invalid registration data');
        }

        // Enforce country isolation
        if (!userData.country || !this.isValidCountry(userData.country)) {
            throw new Error('Valid country selection is required');
        }

        // Generate unique user ID
        const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Create user object with strict hierarchy
        const user = {
            id: userId,
            username: userData.username,
            email: userData.email,
            phone: userData.phone,
            fullName: userData.fullName,
            role: role,
            country: userData.country,
            groupId: userData.groupId || null,
            referrers: userData.referrers || [],
            isVerified: false,
            requiresVerification: true,
            subscription: role === 'lender' ? {
                level: userData.subscriptionLevel || 'basic',
                status: 'pending_payment',
                expiresAt: this.calculateSubscriptionExpiry(),
                limits: this.getSubscriptionLimits(userData.subscriptionLevel || 'basic')
            } : null,
            rating: role === 'borrower' ? 5 : null, // Start with 5 stars for borrowers
            blacklistStatus: {
                isBlacklisted: false,
                reason: null,
                blacklistedAt: null,
                amountOwed: 0
            },
            maxGroups: role === 'borrower' ? 4 : 1, // Borrowers can join up to 4 groups
            currentGroups: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // Store user data
        localStorage.setItem('mpesewa_user_data', JSON.stringify(user));
        localStorage.setItem('mpesewa_country', userData.country);
        localStorage.setItem('mpesewa_user_role', role);
        localStorage.setItem('mpesewa_is_authenticated', 'true');
        localStorage.setItem('mpesewa_auth_timestamp', Date.now().toString());

        // Store in users list
        this.storeUserInRegistry(user);

        this.currentUser = user;
        this.country = userData.country;
        this.userRole = role;

        return {
            success: true,
            user: user,
            requiresVerification: user.requiresVerification,
            redirectTo: role === 'lender' ? '/auth/verify.html?type=subscription' : '/auth/verify.html'
        };
    }

    /**
     * Login user
     * @param {string} identifier - Username or email
     * @param {string} password - User password
     * @param {string} country - User country
     * @returns {Promise<Object>} - Login result
     */
    async login(identifier, password, country) {
        // Validate inputs
        if (!identifier || !password || !country) {
            throw new Error('All fields are required');
        }

        if (!this.isValidCountry(country)) {
            throw new Error('Invalid country selection');
        }

        // In production, this would verify credentials against backend
        // For demo, we'll check against localStorage
        const users = this.getUsersRegistry();
        const user = users.find(u => 
            (u.username === identifier || u.email === identifier) && 
            u.country === country
        );

        if (!user) {
            throw new Error('User not found or invalid credentials');
        }

        // Check if user is blacklisted
        if (user.blacklistStatus && user.blacklistStatus.isBlacklisted) {
            throw new Error('Account is blacklisted. Please contact support.');
        }

        // Check subscription status for lenders
        if (user.role === 'lender' && user.subscription) {
            if (user.subscription.status === 'expired') {
                throw new Error('Subscription expired. Please renew to continue.');
            }
            if (user.subscription.status === 'pending_payment') {
                throw new Error('Subscription payment required. Please complete payment.');
            }
        }

        // Update session
        localStorage.setItem('mpesewa_user_data', JSON.stringify(user));
        localStorage.setItem('mpesewa_country', country);
        localStorage.setItem('mpesewa_user_role', user.role);
        localStorage.setItem('mpesewa_is_authenticated', 'true');
        localStorage.setItem('mpesewa_auth_timestamp', Date.now().toString());

        this.currentUser = user;
        this.country = country;
        this.userRole = user.role;

        return {
            success: true,
            user: user,
            requiresVerification: user.requiresVerification && !user.isVerified,
            redirectTo: user.requiresVerification && !user.isVerified ? 
                '/auth/verify.html' : 
                (user.role === 'borrower' ? '/borrower/dashboard.html' : '/lender/dashboard.html')
        };
    }

    /**
     * Verify user (OTP or email verification)
     * @param {string} verificationCode - OTP or verification code
     * @param {string} method - 'email', 'sms', or 'device'
     * @returns {Promise<Object>} - Verification result
     */
    async verify(verificationCode, method = 'email') {
        if (!this.currentUser) {
            throw new Error('No active session found');
        }

        // In production, this would validate against backend
        // For demo, accept any 6-digit code
        const isValid = /^\d{6}$/.test(verificationCode);

        if (!isValid) {
            throw new Error('Invalid verification code');
        }

        // Update user verification status
        this.currentUser.isVerified = true;
        this.currentUser.verifiedAt = new Date().toISOString();
        this.currentUser.verificationMethod = method;

        // Save updated user
        localStorage.setItem('mpesewa_user_data', JSON.stringify(this.currentUser));

        return {
            success: true,
            user: this.currentUser,
            message: 'Account verified successfully'
        };
    }

    /**
     * Logout user
     */
    logout() {
        // Clear sensitive data but keep country preference
        const country = localStorage.getItem('mpesewa_country');
        
        localStorage.removeItem('mpesewa_user_data');
        localStorage.removeItem('mpesewa_user_role');
        localStorage.removeItem('mpesewa_is_authenticated');
        localStorage.removeItem('mpesewa_auth_timestamp');
        
        // Keep country for next login
        if (country) {
            localStorage.setItem('mpesewa_country', country);
        }

        this.currentUser = null;
        this.country = country;
        this.userRole = null;

        // Redirect to login
        window.location.href = '/auth/login.html';
    }

    /**
     * Check if user is authenticated
     * @returns {boolean}
     */
    isAuthenticated() {
        const isAuth = localStorage.getItem('mpesewa_is_authenticated') === 'true';
        const authTimestamp = parseInt(localStorage.getItem('mpesewa_auth_timestamp') || '0');
        const hoursSinceLogin = (Date.now() - authTimestamp) / (1000 * 60 * 60);

        if (isAuth && hoursSinceLogin < 24) {
            return true;
        }

        // Session expired
        if (isAuth && hoursSinceLogin >= 24) {
            this.clearSession();
        }

        return false;
    }

    /**
     * Check if user has required role
     * @param {string} requiredRole - 'borrower', 'lender', or 'admin'
     * @returns {boolean}
     */
    hasRole(requiredRole) {
        if (!this.isAuthenticated()) return false;
        const userRole = localStorage.getItem('mpesewa_user_role');
        return userRole === requiredRole;
    }

    /**
     * Check if user is in specific country
     * @param {string} countryCode - Country code to check
     * @returns {boolean}
     */
    isInCountry(countryCode) {
        const userCountry = localStorage.getItem('mpesewa_country');
        return userCountry === countryCode;
    }

    /**
     * Get current user's country
     * @returns {string|null}
     */
    getCurrentCountry() {
        return localStorage.getItem('mpesewa_country');
    }

    /**
     * Get current user's role
     * @returns {string|null}
     */
    getCurrentRole() {
        return localStorage.getItem('mpesewa_user_role');
    }

    /**
     * Get user's subscription status (for lenders)
     * @returns {Object|null}
     */
    getSubscriptionStatus() {
        if (!this.currentUser || this.currentUser.role !== 'lender') {
            return null;
        }
        return this.currentUser.subscription;
    }

    /**
     * Check if subscription is active (for lenders)
     * @returns {boolean}
     */
    isSubscriptionActive() {
        const subscription = this.getSubscriptionStatus();
        if (!subscription) return false;
        
        return subscription.status === 'active' && 
               new Date(subscription.expiresAt) > new Date();
    }

    /**
     * Validate registration data based on role
     * @param {Object} data - Registration data
     * @param {string} role - User role
     * @returns {boolean}
     */
    validateRegistration(data, role) {
        const requiredFields = ['username', 'email', 'phone', 'fullName', 'country'];
        
        // Check required fields
        for (const field of requiredFields) {
            if (!data[field] || data[field].trim() === '') {
                throw new Error(`${field.replace(/([A-Z])/g, ' $1').toLowerCase()} is required`);
            }
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            throw new Error('Invalid email address');
        }

        // Phone validation (basic)
        if (data.phone.length < 10) {
            throw new Error('Invalid phone number');
        }

        // Username validation
        if (data.username.length < 3) {
            throw new Error('Username must be at least 3 characters');
        }

        // Password validation (if provided)
        if (data.password) {
            if (data.password.length < 8) {
                throw new Error('Password must be at least 8 characters');
            }
            if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(data.password)) {
                throw new Error('Password must contain uppercase, lowercase, and numbers');
            }
        }

        // Referrers validation (2 required)
        if (!data.referrers || data.referrers.length < 2) {
            throw new Error('Two referrers/guarantors are required');
        }

        // Lender-specific validation
        if (role === 'lender') {
            if (!data.subscriptionLevel || !['basic', 'premium', 'super', 'lender_of_lenders'].includes(data.subscriptionLevel)) {
                throw new Error('Valid subscription level is required for lenders');
            }
        }

        return true;
    }

    /**
     * Check if country code is valid
     * @param {string} countryCode - 2-letter country code
     * @returns {boolean}
     */
    isValidCountry(countryCode) {
        const validCountries = ['KE', 'UG', 'TZ', 'RW', 'BI', 'CD', 'SS', 'ZA', 'NG', 'GH', 'ET', 'SO'];
        return validCountries.includes(countryCode.toUpperCase());
    }

    /**
     * Calculate subscription expiry date (28th of current/next month)
     * @returns {string} - ISO date string
     */
    calculateSubscriptionExpiry() {
        const now = new Date();
        let year = now.getFullYear();
        let month = now.getMonth();
        
        // If today is after 28th, expire on 28th of next month
        if (now.getDate() > 28) {
            month += 1;
            if (month > 11) {
                month = 0;
                year += 1;
            }
        }
        
        return new Date(year, month, 28, 23, 59, 59).toISOString();
    }

    /**
     * Get subscription limits based on level
     * @param {string} level - Subscription level
     * @returns {Object} - Limits object
     */
    getSubscriptionLimits(level) {
        const limits = {
            basic: {
                maxPerWeek: 1500,
                maxLedgers: 1500,
                crbCheck: false,
                description: 'Basic Tier - Up to 1,500 per week'
            },
            premium: {
                maxPerWeek: 5000,
                maxLedgers: 10000,
                crbCheck: false,
                description: 'Premium Tier - Up to 5,000 per week'
            },
            super: {
                maxPerWeek: 20000,
                maxLedgers: 20000,
                crbCheck: true,
                description: 'Super Tier - Up to 20,000 per week'
            },
            lender_of_lenders: {
                maxPerWeek: 50000,
                maxLedgers: 50000,
                crbCheck: true,
                description: 'Lender of Lenders - Up to 50,000 per week'
            }
        };
        
        return limits[level] || limits.basic;
    }

    /**
     * Store user in registry
     * @param {Object} user - User object
     */
    storeUserInRegistry(user) {
        let users = JSON.parse(localStorage.getItem('mpesewa_users_registry') || '[]');
        users.push(user);
        localStorage.setItem('mpesewa_users_registry', JSON.stringify(users));
    }

    /**
     * Get users registry
     * @returns {Array} - Array of users
     */
    getUsersRegistry() {
        return JSON.parse(localStorage.getItem('mpesewa_users_registry') || '[]');
    }

    /**
     * Setup auto logout on session timeout
     */
    setupAutoLogout() {
        setInterval(() => {
            if (this.isAuthenticated()) {
                const authTimestamp = parseInt(localStorage.getItem('mpesewa_auth_timestamp') || '0');
                const hoursSinceLogin = (Date.now() - authTimestamp) / (1000 * 60 * 60);
                
                if (hoursSinceLogin >= 24) {
                    this.logout();
                    window.location.href = '/auth/session-expired.html';
                }
            }
        }, 60000); // Check every minute
    }

    /**
     * Clear user session
     */
    clearSession() {
        localStorage.removeItem('mpesewa_is_authenticated');
        localStorage.removeItem('mpesewa_auth_timestamp');
        this.currentUser = null;
        this.userRole = null;
    }

    /**
     * Get country name from code
     * @param {string} code - 2-letter country code
     * @returns {string} - Country name
     */
    getCountryName(code) {
        const countries = {
            'KE': 'Kenya',
            'UG': 'Uganda',
            'TZ': 'Tanzania',
            'RW': 'Rwanda',
            'BI': 'Burundi',
            'CD': 'DR Congo',
            'SS': 'South Sudan',
            'ZA': 'South Africa',
            'NG': 'Nigeria',
            'GH': 'Ghana',
            'ET': 'Ethiopia',
            'SO': 'Somalia'
        };
        return countries[code] || 'Unknown Country';
    }

    /**
     * Get country currency
     * @param {string} code - 2-letter country code
     * @returns {string} - Currency code
     */
    getCountryCurrency(code) {
        const currencies = {
            'KE': 'KSh',
            'UG': 'UGX',
            'TZ': 'TZS',
            'RW': 'RWF',
            'BI': 'BIF',
            'CD': 'CDF',
            'SS': 'SSP',
            'ZA': 'ZAR',
            'NG': 'NGN',
            'GH': 'GHS',
            'ET': 'ETB',
            'SO': 'SOS'
        };
        return currencies[code] || 'USD';
    }

    /**
     * Get country contact info
     * @param {string} code - 2-letter country code
     * @returns {Object} - Contact information
     */
    getCountryContact(code) {
        const contacts = {
            'KE': { phone: '+254 709 219 000', email: 'info@mpesewa.com' },
            'UG': { phone: '+256 392 175 546', email: 'info@mpesewa.com' },
            'TZ': { phone: '+255 659 073 010', email: 'info@mpesewa.com' },
            'RW': { phone: '+250 791 590 801', email: 'info@mpesewa.com' },
            'BI': { phone: '+257 79 000 000', email: 'info@mpesewa.com' },
            'CD': { phone: '+243 81 000 0000', email: 'info@mpesewa.com' },
            'SS': { phone: '+211 955 000000', email: 'info@mpesewa.com' },
            'ZA': { phone: '+27 11 000 0000', email: 'info@mpesewa.com' },
            'NG': { phone: '+234 800 000 0000', email: 'info@mpesewa.com' },
            'GH': { phone: '+233 24 000 0000', email: 'info@mpesewa.com' },
            'ET': { phone: '+251 11 000 0000', email: 'info@mpesewa.com' },
            'SO': { phone: '+252 63 0000000', email: 'info@mpesewa.com' }
        };
        return contacts[code] || { phone: '+255 000 000000', email: 'info@mpesewa.com' };
    }
}

// Export singleton instance
const authService = new AuthService();
window.AuthService = authService;

export default authService;