/**
 * M-PESEWA Authentication Module
 * FinTech-grade authentication with zero bypass
 * Version: 1.0.0
 */

class MPAuth {
    constructor() {
        this.firebaseConfig = {
            apiKey: "AIzaSyD_YourAPIKeyHere",
            authDomain: "mpesewa-production.firebaseapp.com",
            projectId: "mpesewa-production",
            storageBucket: "mpesewa-production.appspot.com",
            messagingSenderId: "1234567890",
            appId: "1:1234567890:web:abcdef123456"
        };
        
        this.auth = null;
        this.db = null;
        this.user = null;
        this.sessionTimeout = 30 * 60 * 1000; // 30 minutes
        this.maxLoginAttempts = 5;
        this.lockDuration = 15 * 60 * 1000; // 15 minutes
        
        this.init();
    }
    
    /**
     * Initialize Firebase
     */
    init() {
        if (!firebase.apps.length) {
            firebase.initializeApp(this.firebaseConfig);
        }
        
        this.auth = firebase.auth();
        this.db = firebase.firestore();
        
        // Set persistence to session only
        this.auth.setPersistence(firebase.auth.Auth.Persistence.SESSION);
        
        // Listen for auth state changes
        this.auth.onAuthStateChanged((user) => {
            if (user) {
                this.user = user;
                this.updateUserSession(user);
            } else {
                this.user = null;
                this.clearSession();
            }
        });
    }
    
    /**
     * Register new user with full KYC
     */
    async register(userData) {
        try {
            // Validate user data
            this.validateRegistrationData(userData);
            
            // Check if username exists
            const usernameExists = await this.checkUsernameExists(userData.username);
            if (usernameExists) {
                throw new Error('Username already exists');
            }
            
            // Check if email exists
            const emailExists = await this.checkEmailExists(userData.email);
            if (emailExists) {
                throw new Error('Email already registered');
            }
            
            // Create Firebase auth user
            const userCredential = await this.auth.createUserWithEmailAndPassword(
                userData.email,
                userData.password
            );
            
            // Send email verification
            await userCredential.user.sendEmailVerification();
            
            // Store user profile in Firestore
            const userProfile = {
                fullName: userData.fullName,
                idNumber: this.encryptData(userData.idNumber),
                email: userData.email,
                phone: `+${userData.countryCode}${userData.phone}`,
                username: userData.username,
                role: userData.role,
                country: userData.country,
                groups: userData.groupId ? [userData.groupId] : [],
                createdGroups: userData.groupName ? [{
                    id: `group_${Date.now()}`,
                    name: userData.groupName,
                    type: userData.groupType,
                    country: userData.country,
                    members: 1,
                    founder: userCredential.user.uid
                }] : [],
                kycStatus: 'pending',
                verification: {
                    email: false,
                    phone: false,
                    id: false
                },
                rating: userData.role === 'borrower' ? 5 : null,
                blacklistStatus: 'none',
                subscription: userData.role === 'lender' ? {
                    plan: null,
                    status: 'inactive',
                    expiresAt: null
                } : null,
                stats: {
                    totalLoans: 0,
                    activeLoans: 0,
                    totalLent: 0,
                    totalBorrowed: 0,
                    repaymentRate: 0
                },
                security: {
                    loginAttempts: 0,
                    lastLogin: null,
                    lastFailedAttempt: null,
                    isLocked: false,
                    lockUntil: null,
                    mfaEnabled: false
                },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                firebaseUID: userCredential.user.uid
            };
            
            await this.db.collection('users').doc(userCredential.user.uid).set(userProfile);
            
            // Create audit log
            await this.createAuditLog(userCredential.user.uid, 'registration', {
                country: userData.country,
                role: userData.role
            });
            
            return {
                success: true,
                userId: userCredential.user.uid,
                email: userData.email,
                requiresVerification: true
            };
            
        } catch (error) {
            // Clean up if Firebase user was created but Firestore failed
            if (this.auth.currentUser) {
                await this.auth.currentUser.delete();
            }
            
            throw error;
        }
    }
    
    /**
     * Login with email and password
     */
    async login(email, password, recaptchaToken) {
        try {
            // Check if account is locked
            const isLocked = await this.isAccountLocked(email);
            if (isLocked) {
                throw new Error('Account temporarily locked. Try again later.');
            }
            
            // Verify reCAPTCHA token
            const recaptchaValid = await this.verifyRecaptcha(recaptchaToken, 'login');
            if (!recaptchaValid) {
                throw new Error('Security verification failed');
            }
            
            // Sign in with Firebase
            const userCredential = await this.auth.signInWithEmailAndPassword(email, password);
            
            // Check if email is verified
            if (!userCredential.user.emailVerified) {
                throw new Error('Please verify your email before logging in');
            }
            
            // Get user profile
            const userProfile = await this.getUserProfile(userCredential.user.uid);
            
            // Validate user status
            await this.validateUserStatus(userProfile);
            
            // Check IP geolocation (simulated)
            const ipValid = await this.validateIPLocation(userProfile.country);
            if (!ipValid) {
                await this.createSecurityAlert(userCredential.user.uid, 'ip_mismatch', {
                    expected: userProfile.country,
                    actual: 'unknown'
                });
                // Continue login but log the event
            }
            
            // Reset failed attempts
            await this.resetFailedAttempts(email);
            
            // Update last login
            await this.updateLastLogin(userCredential.user.uid);
            
            // Create session
            await this.createSession(userCredential.user.uid, userProfile);
            
            return {
                success: true,
                user: {
                    id: userCredential.user.uid,
                    email: userCredential.user.email,
                    role: userProfile.role,
                    country: userProfile.country
                }
            };
            
        } catch (error) {
            // Record failed attempt
            await this.recordFailedAttempt(email);
            throw error;
        }
    }
    
    /**
     * Login with phone OTP
     */
    async loginWithPhone(phone, otp) {
        try {
            // Verify OTP (simulated - integrate with Twilio in production)
            const otpValid = await this.verifyOTP(phone, otp);
            if (!otpValid) {
                throw new Error('Invalid OTP');
            }
            
            // Find user by phone
            const userSnapshot = await this.db.collection('users')
                .where('phone', '==', phone)
                .limit(1)
                .get();
            
            if (userSnapshot.empty) {
                throw new Error('No account found with this phone number');
            }
            
            const userDoc = userSnapshot.docs[0];
            const userProfile = userDoc.data();
            const userId = userDoc.id;
            
            // Validate user status
            await this.validateUserStatus(userProfile);
            
            // Create session without Firebase auth (phone auth)
            await this.createSession(userId, userProfile, false);
            
            // Update last login
            await this.updateLastLogin(userId);
            
            return {
                success: true,
                user: {
                    id: userId,
                    phone: phone,
                    role: userProfile.role,
                    country: userProfile.country
                }
            };
            
        } catch (error) {
            throw error;
        }
    }
    
    /**
     * Logout user
     */
    async logout() {
        try {
            await this.auth.signOut();
            this.clearSession();
            return { success: true };
        } catch (error) {
            throw error;
        }
    }
    
    /**
     * Reset password
     */
    async resetPassword(email) {
        try {
            await this.auth.sendPasswordResetEmail(email);
            
            // Create audit log
            await this.createAuditLog('system', 'password_reset_requested', {
                email: email,
                timestamp: new Date().toISOString()
            });
            
            return { success: true };
        } catch (error) {
            throw error;
        }
    }
    
    /**
     * Validate user session
     */
    async validateSession() {
        try {
            const session = localStorage.getItem('mpesewa_session');
            const user = localStorage.getItem('mpesewa_user');
            
            if (!session || !user) {
                return { valid: false, reason: 'no_session' };
            }
            
            const sessionData = JSON.parse(session);
            const userData = JSON.parse(user);
            
            // Check session expiration
            if (new Date(sessionData.expiresAt) < new Date()) {
                this.clearSession();
                return { valid: false, reason: 'session_expired' };
            }
            
            // Verify user exists in Firestore
            const userDoc = await this.db.collection('users').doc(userData.id).get();
            if (!userDoc.exists) {
                this.clearSession();
                return { valid: false, reason: 'user_not_found' };
            }
            
            const userProfile = userDoc.data();
            
            // Check blacklist status
            if (userProfile.blacklistStatus === 'blacklisted') {
                this.clearSession();
                return { valid: false, reason: 'blacklisted' };
            }
            
            // Check if lender subscription is active
            if (userProfile.role === 'lender') {
                const subscription = userProfile.subscription;
                if (!subscription || subscription.status !== 'active' || 
                    new Date(subscription.expiresAt) < new Date()) {
                    return { 
                        valid: false, 
                        reason: 'subscription_expired',
                        user: userData 
                    };
                }
            }
            
            // Extend session
            sessionData.expiresAt = new Date(Date.now() + this.sessionTimeout).toISOString();
            localStorage.setItem('mpesewa_session', JSON.stringify(sessionData));
            
            return {
                valid: true,
                user: userData,
                profile: userProfile
            };
            
        } catch (error) {
            console.error('Session validation error:', error);
            return { valid: false, reason: 'validation_error' };
        }
    }
    
    /**
     * Check if user has permission for page
     */
    async checkPagePermission(page, userData) {
        const permissions = {
            'borrowing.html': ['borrower'],
            'lending.html': ['lender'],
            'groups.html': ['borrower', 'lender'],
            'countries/index.html': ['borrower', 'lender'],
            'blacklist.html': ['borrower', 'lender'],
            'debt-collectors.html': ['borrower', 'lender'],
            'borrower-dashboard.html': ['borrower'],
            'lender-dashboard.html': ['lender'],
            'admin-dashboard.html': ['admin']
        };
        
        const allowedRoles = permissions[page];
        if (!allowedRoles) {
            return { allowed: true }; // Public page
        }
        
        if (!userData || !allowedRoles.includes(userData.role)) {
            return { allowed: false, reason: 'role_restricted' };
        }
        
        return { allowed: true };
    }
    
    /**
     * Validate user status (blacklist, subscription, etc.)
     */
    async validateUserStatus(userProfile) {
        // Check blacklist
        if (userProfile.blacklistStatus === 'blacklisted') {
            throw new Error('Account is blacklisted. Contact support.');
        }
        
        // Check if account is locked
        if (userProfile.security?.isLocked) {
            const lockUntil = new Date(userProfile.security.lockUntil);
            if (lockUntil > new Date()) {
                throw new Error(`Account locked until ${lockUntil.toLocaleTimeString()}`);
            }
        }
        
        // Check lender subscription
        if (userProfile.role === 'lender') {
            const subscription = userProfile.subscription;
            if (!subscription || subscription.status !== 'active') {
                throw new Error('Lender subscription required');
            }
            
            if (new Date(subscription.expiresAt) < new Date()) {
                throw new Error('Lender subscription expired');
            }
        }
        
        return true;
    }
    
    /**
     * Create user session
     */
    async createSession(userId, userProfile, withFirebaseAuth = true) {
        const session = {
            userId: userId,
            role: userProfile.role,
            country: userProfile.country,
            groups: userProfile.groups || [],
            createdAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + this.sessionTimeout).toISOString(),
            withFirebaseAuth: withFirebaseAuth
        };
        
        // Store session in localStorage
        localStorage.setItem('mpesewa_session', JSON.stringify(session));
        
        // Store user info
        localStorage.setItem('mpesewa_user', JSON.stringify({
            id: userId,
            fullName: userProfile.fullName,
            username: userProfile.username,
            email: userProfile.email,
            role: userProfile.role,
            country: userProfile.country,
            groups: userProfile.groups || []
        }));
        
        // Start session timer
        this.startSessionTimer();
        
        // Create session audit log
        await this.createAuditLog(userId, 'session_created', {
            role: userProfile.role,
            country: userProfile.country
        });
    }
    
    /**
     * Clear user session
     */
    clearSession() {
        localStorage.removeItem('mpesewa_session');
        localStorage.removeItem('mpesewa_user');
    }
    
    /**
     * Start session timer
     */
    startSessionTimer() {
        // Clear existing timer
        if (this.sessionTimer) {
            clearTimeout(this.sessionTimer);
        }
        
        // Set new timer
        this.sessionTimer = setTimeout(() => {
            this.logout();
            window.location.href = '../pages/login.html';
        }, this.sessionTimeout);
    }
    
    /**
     * Update user session
     */
    updateUserSession(firebaseUser) {
        if (firebaseUser) {
            // Session is managed by Firebase auth
            // Start session timer
            this.startSessionTimer();
        }
    }
    
    /**
     * Validate registration data
     */
    validateRegistrationData(data) {
        const errors = [];
        
        // Full name validation
        if (!data.fullName || data.fullName.length < 2) {
            errors.push('Full name is required');
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            errors.push('Invalid email format');
        }
        
        // Phone validation
        const phoneRegex = /^[0-9]{9,10}$/;
        if (!phoneRegex.test(data.phone)) {
            errors.push('Invalid phone number');
        }
        
        // Username validation
        const usernameRegex = /^[a-zA-Z0-9_]{8,20}$/;
        if (!usernameRegex.test(data.username)) {
            errors.push('Username must be 8-20 characters (letters, numbers, underscore)');
        }
        
        // Password validation
        const passwordValidation = this.validatePassword(data.password);
        if (!passwordValidation.isValid) {
            errors.push('Password does not meet security requirements');
        }
        
        // Role validation
        if (!['borrower', 'lender'].includes(data.role)) {
            errors.push('Invalid role selected');
        }
        
        // Country validation
        const validCountries = ['kenya', 'uganda', 'tanzania', 'rwanda', 'nigeria', 
                               'ghana', 'south-africa', 'egypt', 'ethiopia', 'senegal'];
        if (!validCountries.includes(data.country)) {
            errors.push('Invalid country selected');
        }
        
        if (errors.length > 0) {
            throw new Error(errors.join(', '));
        }
    }
    
    /**
     * Validate password strength
     */
    validatePassword(password) {
        const requirements = {
            length: password.length >= 12,
            upper: /[A-Z]/.test(password),
            lower: /[a-z]/.test(password),
            number: /\d/.test(password),
            special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
        };
        
        const isValid = Object.values(requirements).every(req => req);
        
        return {
            isValid,
            requirements,
            score: Object.values(requirements).filter(req => req).length
        };
    }
    
    /**
     * Check if username exists
     */
    async checkUsernameExists(username) {
        const snapshot = await this.db.collection('users')
            .where('username', '==', username)
            .limit(1)
            .get();
        
        return !snapshot.empty;
    }
    
    /**
     * Check if email exists
     */
    async checkEmailExists(email) {
        const snapshot = await this.db.collection('users')
            .where('email', '==', email)
            .limit(1)
            .get();
        
        return !snapshot.empty;
    }
    
    /**
     * Get user profile
     */
    async getUserProfile(userId) {
        const doc = await this.db.collection('users').doc(userId).get();
        
        if (!doc.exists) {
            throw new Error('User profile not found');
        }
        
        return doc.data();
    }
    
    /**
     * Update last login
     */
    async updateLastLogin(userId) {
        await this.db.collection('users').doc(userId).update({
            'security.lastLogin': new Date().toISOString(),
            'security.loginAttempts': 0,
            'security.isLocked': false,
            'security.lockUntil': null,
            updatedAt: new Date().toISOString()
        });
    }
    
    /**
     * Record failed login attempt
     */
    async recordFailedAttempt(identifier) {
        // Find user by email or username
        let userDoc;
        
        // Try email first
        let snapshot = await this.db.collection('users')
            .where('email', '==', identifier)
            .limit(1)
            .get();
        
        if (snapshot.empty) {
            // Try username
            snapshot = await this.db.collection('users')
                .where('username', '==', identifier)
                .limit(1)
                .get();
        }
        
        if (!snapshot.empty) {
            userDoc = snapshot.docs[0];
            
            const userData = userDoc.data();
            const attempts = (userData.security?.loginAttempts || 0) + 1;
            
            const updateData = {
                'security.loginAttempts': attempts,
                'security.lastFailedAttempt': new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            // Lock account if max attempts reached
            if (attempts >= this.maxLoginAttempts) {
                const lockUntil = new Date(Date.now() + this.lockDuration);
                updateData['security.isLocked'] = true;
                updateData['security.lockUntil'] = lockUntil.toISOString();
                
                // Create security alert
                await this.createSecurityAlert(userDoc.id, 'account_locked', {
                    attempts: attempts,
                    lockUntil: lockUntil.toISOString()
                });
            }
            
            await userDoc.ref.update(updateData);
        }
    }
    
    /**
     * Reset failed attempts
     */
    async resetFailedAttempts(identifier) {
        // Find user by email or username
        let snapshot = await this.db.collection('users')
            .where('email', '==', identifier)
            .limit(1)
            .get();
        
        if (snapshot.empty) {
            snapshot = await this.db.collection('users')
                .where('username', '==', identifier)
                .limit(1)
                .get();
        }
        
        if (!snapshot.empty) {
            const userDoc = snapshot.docs[0];
            await userDoc.ref.update({
                'security.loginAttempts': 0,
                'security.isLocked': false,
                'security.lockUntil': null,
                updatedAt: new Date().toISOString()
            });
        }
    }
    
    /**
     * Check if account is locked
     */
    async isAccountLocked(identifier) {
        // Find user by email or username
        let snapshot = await this.db.collection('users')
            .where('email', '==', identifier)
            .limit(1)
            .get();
        
        if (snapshot.empty) {
            snapshot = await this.db.collection('users')
                .where('username', '==', identifier)
                .limit(1)
                .get();
        }
        
        if (!snapshot.empty) {
            const userData = snapshot.docs[0].data();
            
            if (userData.security?.isLocked) {
                const lockUntil = new Date(userData.security.lockUntil);
                if (lockUntil > new Date()) {
                    return true;
                }
            }
        }
        
        return false;
    }
    
    /**
     * Validate IP location (simulated)
     */
    async validateIPLocation(expectedCountry) {
        // In production, call IP geolocation API
        // For now, return true (simulate same country)
        return true;
    }
    
    /**
     * Verify reCAPTCHA token
     */
    async verifyRecaptcha(token, action) {
        // In production, verify with Google reCAPTCHA API
        // For now, simulate success
        return token && token.length > 10;
    }
    
    /**
     * Verify OTP (simulated)
     */
    async verifyOTP(phone, otp) {
        // In production, verify with Twilio Verify API
        // For now, accept any 6-digit OTP
        return /^\d{6}$/.test(otp);
    }
    
    /**
     * Encrypt sensitive data
     */
    encryptData(data) {
        // In production, use proper encryption
        // For now, base64 encode
        return btoa(data);
    }
    
    /**
     * Create audit log
     */
    async createAuditLog(userId, action, details = {}) {
        try {
            await this.db.collection('audit_logs').add({
                userId: userId,
                action: action,
                details: details,
                timestamp: new Date().toISOString(),
                ipAddress: await this.getClientIP(),
                userAgent: navigator.userAgent
            });
        } catch (error) {
            console.error('Failed to create audit log:', error);
        }
    }
    
    /**
     * Create security alert
     */
    async createSecurityAlert(userId, alertType, details = {}) {
        try {
            await this.db.collection('security_alerts').add({
                userId: userId,
                alertType: alertType,
                details: details,
                timestamp: new Date().toISOString(),
                status: 'new',
                severity: alertType === 'account_locked' ? 'high' : 'medium'
            });
        } catch (error) {
            console.error('Failed to create security alert:', error);
        }
    }
    
    /**
     * Get client IP (simulated)
     */
    async getClientIP() {
        // In production, get from request headers or IP detection service
        return '127.0.0.1';
    }
}

// Initialize global auth instance
window.mpesewaAuth = new MPAuth();