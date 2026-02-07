/**
 * M-Pesewa Authentication Slice
 * Strict authentication and session management
 * Non-negotiable security rules
 */

class AuthSlice {
    constructor() {
        this.state = {
            user: null,
            token: null,
            session: null,
            isAuthenticated: false,
            loginAttempts: 0,
            lastLogin: null,
            deviceInfo: null,
            permissions: [],
            twoFactorEnabled: false,
            loginHistory: [],
            authStatus: 'idle', // idle, loading, success, error
            error: null
        };

        this.init();
    }

    init() {
        // Load saved session from localStorage
        this.loadFromStorage();
        
        // Initialize device info
        this.initializeDeviceInfo();
        
        // Start session monitoring
        this.startSessionMonitor();
    }

    initializeDeviceInfo() {
        this.state.deviceInfo = {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            screenResolution: `${window.screen.width}x${window.screen.height}`,
            deviceMemory: navigator.deviceMemory || 'unknown',
            hardwareConcurrency: navigator.hardwareConcurrency || 'unknown',
            timestamp: new Date().toISOString()
        };
    }

    loadFromStorage() {
        try {
            const savedAuth = localStorage.getItem('mpesewa_auth');
            if (savedAuth) {
                const parsed = JSON.parse(savedAuth);
                
                // Check if token is still valid
                if (parsed.token && parsed.expiry && new Date(parsed.expiry) > new Date()) {
                    this.state = {
                        ...this.state,
                        ...parsed,
                        isAuthenticated: true
                    };
                    
                    console.log('📱 Auth loaded from storage');
                } else {
                    // Token expired, clear storage
                    this.clearStorage();
                }
            }
        } catch (error) {
            console.error('Failed to load auth from storage:', error);
            this.clearStorage();
        }
    }

    saveToStorage() {
        try {
            const authData = {
                user: this.state.user,
                token: this.state.token,
                session: this.state.session,
                expiry: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
                lastLogin: this.state.lastLogin,
                deviceInfo: this.state.deviceInfo
            };
            
            localStorage.setItem('mpesewa_auth', JSON.stringify(authData));
        } catch (error) {
            console.error('Failed to save auth to storage:', error);
        }
    }

    clearStorage() {
        localStorage.removeItem('mpesewa_auth');
        this.state = {
            ...this.state,
            user: null,
            token: null,
            session: null,
            isAuthenticated: false,
            permissions: []
        };
    }

    startSessionMonitor() {
        // Check session every minute
        setInterval(() => {
            if (this.state.isAuthenticated && this.state.session) {
                const now = new Date();
                const sessionExpiry = new Date(this.state.session.expiresAt);
                
                if (now > sessionExpiry) {
                    console.log('Session expired, logging out');
                    this.logout();
                }
            }
        }, 60000); // 1 minute
    }

    // STRICT RULE: Login with username/password or Google
    async login(credentials) {
        this.setState({ authStatus: 'loading', error: null });
        
        try {
            // Validate credentials
            if (!credentials.username || !credentials.password) {
                throw new Error('Username and password are required');
            }

            // Check login attempts
            if (this.state.loginAttempts >= 5) {
                throw new Error('Too many login attempts. Please try again later.');
            }

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Mock user data based on role
            let userData;
            if (credentials.role === 'lender') {
                userData = this.createMockLender(credentials.username);
            } else if (credentials.role === 'borrower') {
                userData = this.createMockBorrower(credentials.username);
            } else if (credentials.role === 'admin') {
                userData = this.createMockAdmin(credentials.username);
            } else {
                throw new Error('Invalid role');
            }

            // Create session
            const session = {
                id: `sess_${Date.now()}`,
                userId: userData.id,
                role: userData.role,
                country: userData.country,
                groupId: userData.groupId,
                createdAt: new Date().toISOString(),
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
                device: this.state.deviceInfo
            };

            // Generate token
            const token = this.generateToken(userData);

            // Update state
            this.setState({
                user: userData,
                token: token,
                session: session,
                isAuthenticated: true,
                lastLogin: new Date().toISOString(),
                loginAttempts: 0,
                permissions: this.getPermissions(userData.role),
                authStatus: 'success'
            });

            // Save to storage
            this.saveToStorage();

            // Add to login history
            this.addLoginHistory({
                userId: userData.id,
                timestamp: new Date().toISOString(),
                device: this.state.deviceInfo,
                success: true
            });

            console.log('✅ Login successful');
            return { success: true, user: userData, session: session };

        } catch (error) {
            // Increment login attempts
            this.setState({
                loginAttempts: this.state.loginAttempts + 1,
                authStatus: 'error',
                error: error.message
            });

            // Add failed attempt to history
            this.addLoginHistory({
                timestamp: new Date().toISOString(),
                device: this.state.deviceInfo,
                success: false,
                error: error.message
            });

            console.error('❌ Login failed:', error.message);
            return { success: false, error: error.message };
        }
    }

    // STRICT RULE: Google login
    async loginWithGoogle() {
        this.setState({ authStatus: 'loading', error: null });
        
        try {
            // Simulate Google OAuth
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Mock Google user
            const googleUser = {
                id: `google_${Date.now()}`,
                email: 'user@gmail.com',
                name: 'Google User',
                picture: 'https://via.placeholder.com/150',
                verified: true
            };

            // Check if user exists in system
            let userData = await this.findUserByEmail(googleUser.email);
            
            if (!userData) {
                // New user - need to register
                throw new Error('User not found. Please register first.');
            }

            // Create session
            const session = {
                id: `sess_google_${Date.now()}`,
                userId: userData.id,
                role: userData.role,
                country: userData.country,
                groupId: userData.groupId,
                createdAt: new Date().toISOString(),
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                device: this.state.deviceInfo,
                provider: 'google'
            };

            // Generate token
            const token = this.generateToken(userData);

            // Update state
            this.setState({
                user: userData,
                token: token,
                session: session,
                isAuthenticated: true,
                lastLogin: new Date().toISOString(),
                permissions: this.getPermissions(userData.role),
                authStatus: 'success'
            });

            this.saveToStorage();

            this.addLoginHistory({
                userId: userData.id,
                timestamp: new Date().toISOString(),
                device: this.state.deviceInfo,
                provider: 'google',
                success: true
            });

            console.log('✅ Google login successful');
            return { success: true, user: userData };

        } catch (error) {
            this.setState({
                authStatus: 'error',
                error: error.message
            });
            return { success: false, error: error.message };
        }
    }

    // STRICT RULE: Register new user with all required fields
    async register(userData) {
        this.setState({ authStatus: 'loading', error: null });
        
        try {
            // Validate required fields
            const requiredFields = [
                'fullName', 'username', 'password', 'country', 
                'phoneNumber', 'nationalId', 'role'
            ];
            
            const missingFields = requiredFields.filter(field => !userData[field]);
            if (missingFields.length > 0) {
                throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
            }

            // Validate password strength
            if (!this.validatePassword(userData.password)) {
                throw new Error('Password must be 8-12 characters with mixed case, numbers, and symbols');
            }

            // Check if username exists
            if (await this.usernameExists(userData.username)) {
                throw new Error('Username already exists');
            }

            // Create user based on role
            let newUser;
            if (userData.role === 'lender') {
                newUser = this.createLenderUser(userData);
            } else if (userData.role === 'borrower') {
                newUser = this.createBorrowerUser(userData);
            } else {
                throw new Error('Invalid role');
            }

            // Generate verification code
            const verificationCode = this.generateVerificationCode();
            
            // Save verification code (simulate sending to email/phone)
            this.saveVerificationCode(newUser.id, verificationCode);

            // Create session but not authenticated yet
            const session = {
                id: `sess_reg_${Date.now()}`,
                userId: newUser.id,
                role: newUser.role,
                country: newUser.country,
                status: 'pending_verification',
                verificationCode: verificationCode,
                createdAt: new Date().toISOString(),
                expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 minutes
            };

            this.setState({
                user: newUser,
                session: session,
                authStatus: 'success'
            });

            console.log('✅ Registration successful, verification required');
            return { 
                success: true, 
                user: newUser, 
                requiresVerification: true,
                verificationCode: verificationCode // For demo purposes only
            };

        } catch (error) {
            this.setState({
                authStatus: 'error',
                error: error.message
            });
            return { success: false, error: error.message };
        }
    }

    // STRICT RULE: Verify account with code sent to email/phone
    async verifyAccount(code) {
        try {
            if (!this.state.session || !this.state.session.verificationCode) {
                throw new Error('No verification pending');
            }

            if (this.state.session.verificationCode !== code) {
                throw new Error('Invalid verification code');
            }

            // Mark user as verified
            const verifiedUser = {
                ...this.state.user,
                verified: true,
                verifiedAt: new Date().toISOString()
            };

            // Create proper session
            const session = {
                id: `sess_${Date.now()}`,
                userId: verifiedUser.id,
                role: verifiedUser.role,
                country: verifiedUser.country,
                groupId: verifiedUser.groupId,
                createdAt: new Date().toISOString(),
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
            };

            const token = this.generateToken(verifiedUser);

            this.setState({
                user: verifiedUser,
                token: token,
                session: session,
                isAuthenticated: true,
                permissions: this.getPermissions(verifiedUser.role)
            });

            this.saveToStorage();

            console.log('✅ Account verified successfully');
            return { success: true, user: verifiedUser };

        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // STRICT RULE: Logout clears all session data
    logout() {
        // Add to login history
        if (this.state.user) {
            this.addLoginHistory({
                userId: this.state.user.id,
                timestamp: new Date().toISOString(),
                action: 'logout',
                success: true
            });
        }

        // Clear state
        this.setState({
            user: null,
            token: null,
            session: null,
            isAuthenticated: false,
            permissions: [],
            authStatus: 'idle'
        });

        // Clear storage
        this.clearStorage();

        console.log('👋 Logged out successfully');
        return { success: true };
    }

    // STRICT RULE: Password reset flow
    async requestPasswordReset(email) {
        try {
            // Check if user exists
            const user = await this.findUserByEmail(email);
            if (!user) {
                throw new Error('User not found');
            }

            // Generate reset token
            const resetToken = this.generateResetToken();
            
            // Save reset token with expiry
            this.saveResetToken(user.id, resetToken);
            
            // Simulate sending email
            console.log(`📧 Password reset email sent to ${email}`);
            console.log(`Reset token: ${resetToken}`); // For demo only
            
            return { 
                success: true, 
                message: 'Reset instructions sent to email',
                resetToken: resetToken // For demo only
            };

        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async resetPassword(token, newPassword) {
        try {
            // Validate token
            if (!this.validateResetToken(token)) {
                throw new Error('Invalid or expired reset token');
            }

            // Validate password strength
            if (!this.validatePassword(newPassword)) {
                throw new Error('Password must be 8-12 characters with mixed case, numbers, and symbols');
            }

            // Update user password (in real app, this would be an API call)
            console.log('✅ Password reset successful');
            
            return { success: true, message: 'Password reset successful' };

        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Helper methods
    createMockLender(username) {
        return {
            id: `lender_${Date.now()}`,
            username: username,
            fullName: 'John Lender',
            role: 'lender',
            country: 'Kenya',
            groupId: 'group_ke_001',
            subscription: 'Basic',
            verified: true,
            email: `${username}@example.com`,
            phoneNumber: '+254700000000',
            nationalId: '12345678',
            createdAt: new Date().toISOString(),
            profileComplete: true
        };
    }

    createMockBorrower(username) {
        return {
            id: `borrower_${Date.now()}`,
            username: username,
            fullName: 'Jane Borrower',
            role: 'borrower',
            country: 'Kenya',
            groupId: 'group_ke_001',
            rating: 4.5,
            verified: true,
            email: `${username}@example.com`,
            phoneNumber: '+254711111111',
            nationalId: '87654321',
            createdAt: new Date().toISOString(),
            profileComplete: true
        };
    }

    createMockAdmin(username) {
        return {
            id: `admin_${Date.now()}`,
            username: username,
            fullName: 'Admin User',
            role: 'admin',
            country: 'Global',
            verified: true,
            email: `${username}@mpesewa.com`,
            createdAt: new Date().toISOString(),
            profileComplete: true
        };
    }

    createLenderUser(data) {
        return {
            id: `lender_${Date.now()}`,
            username: data.username,
            fullName: data.fullName,
            role: 'lender',
            country: data.country,
            groupId: data.groupId || null,
            subscription: data.subscription || 'Basic',
            verified: false,
            email: data.email,
            phoneNumber: data.phoneNumber,
            nationalId: data.nationalId,
            location: data.location,
            categories: data.categories || [],
            createdAt: new Date().toISOString(),
            profileComplete: false,
            referrers: data.referrers || []
        };
    }

    createBorrowerUser(data) {
        return {
            id: `borrower_${Date.now()}`,
            username: data.username,
            fullName: data.fullName,
            role: 'borrower',
            country: data.country,
            groupId: data.groupId || null,
            rating: 0,
            verified: false,
            email: data.email,
            phoneNumber: data.phoneNumber,
            nationalId: data.nationalId,
            location: data.location,
            createdAt: new Date().toISOString(),
            profileComplete: false,
            referrers: data.referrers || [],
            blacklisted: false
        };
    }

    generateToken(user) {
        return `mpesewa_token_${user.id}_${Date.now()}_${Math.random().toString(36).substr(2)}`;
    }

    generateVerificationCode() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    generateResetToken() {
        return `reset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    validatePassword(password) {
        const minLength = 8;
        const maxLength = 12;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        
        return password.length >= minLength && 
               password.length <= maxLength &&
               hasUpperCase && 
               hasLowerCase && 
               hasNumbers && 
               hasSpecialChar;
    }

    getPermissions(role) {
        const permissions = {
            lender: [
                'view_dashboard',
                'create_ledger',
                'update_ledger',
                'view_borrowers',
                'rate_borrower',
                'lend_money',
                'view_portfolio',
                'manage_subscription'
            ],
            borrower: [
                'view_dashboard',
                'request_loan',
                'view_loans',
                'make_repayment',
                'view_rating',
                'join_group'
            ],
            admin: [
                'view_all',
                'edit_any',
                'override_blacklist',
                'manage_users',
                'manage_groups',
                'system_config'
            ]
        };
        
        return permissions[role] || [];
    }

    hasPermission(permission) {
        return this.state.permissions.includes(permission);
    }

    async findUserByEmail(email) {
        // Mock database lookup
        return null;
    }

    async usernameExists(username) {
        // Mock database check
        return false;
    }

    saveVerificationCode(userId, code) {
        localStorage.setItem(`mpesewa_verify_${userId}`, JSON.stringify({
            code: code,
            expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString()
        }));
    }

    saveResetToken(userId, token) {
        localStorage.setItem(`mpesewa_reset_${userId}`, JSON.stringify({
            token: token,
            expiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString() // 1 hour
        }));
    }

    validateResetToken(token) {
        // Check all reset tokens in localStorage
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('mpesewa_reset_')) {
                try {
                    const data = JSON.parse(localStorage.getItem(key));
                    if (data.token === token && new Date(data.expiresAt) > new Date()) {
                        return true;
                    }
                } catch (e) {
                    continue;
                }
            }
        }
        return false;
    }

    addLoginHistory(entry) {
        const history = JSON.parse(localStorage.getItem('mpesewa_login_history') || '[]');
        history.unshift({
            ...entry,
            id: `login_${Date.now()}`
        });
        
        // Keep only last 100 entries
        if (history.length > 100) {
            history.pop();
        }
        
        localStorage.setItem('mpesewa_login_history', JSON.stringify(history));
    }

    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.notifySubscribers();
    }

    getState() {
        return { ...this.state };
    }

    // Observer pattern for state changes
    subscribers = new Set();
    
    subscribe(callback) {
        this.subscribers.add(callback);
        return () => this.subscribers.delete(callback);
    }
    
    notifySubscribers() {
        this.subscribers.forEach(callback => callback(this.state));
    }

    // Session management
    extendSession() {
        if (this.state.session) {
            const newExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
            this.state.session.expiresAt = newExpiry.toISOString();
            this.saveToStorage();
            console.log('🔄 Session extended');
        }
    }

    getRemainingSessionTime() {
        if (!this.state.session || !this.state.session.expiresAt) {
            return 0;
        }
        
        const expiry = new Date(this.state.session.expiresAt);
        const now = new Date();
        return expiry.getTime() - now.getTime();
    }

    // Security checks
    validateSession() {
        if (!this.state.isAuthenticated || !this.state.session) {
            return { valid: false, reason: 'No active session' };
        }

        const now = new Date();
        const expiry = new Date(this.state.session.expiresAt);
        
        if (now > expiry) {
            return { valid: false, reason: 'Session expired' };
        }

        // Check device fingerprint (basic)
        const currentDevice = this.state.deviceInfo;
        const sessionDevice = this.state.session.device;
        
        if (sessionDevice && currentDevice.userAgent !== sessionDevice.userAgent) {
            return { 
                valid: false, 
                reason: 'Device mismatch',
                requiresReauth: true 
            };
        }

        return { valid: true, expiresIn: expiry.getTime() - now.getTime() };
    }

    // Admin functions
    getLoginHistory(limit = 50) {
        try {
            const history = JSON.parse(localStorage.getItem('mpesewa_login_history') || '[]');
            return history.slice(0, limit);
        } catch (error) {
            return [];
        }
    }

    getActiveSessions() {
        // In a real app, this would query a sessions database
        return [this.state.session].filter(Boolean);
    }

    terminateSession(sessionId) {
        if (this.state.session && this.state.session.id === sessionId) {
            this.logout();
            return { success: true, message: 'Session terminated' };
        }
        return { success: false, message: 'Session not found' };
    }
}

// Create singleton instance
const authSlice = new AuthSlice();

// Export for use in other modules
export default authSlice;