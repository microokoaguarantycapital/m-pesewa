/**
 * M-PESEWA AUTHENTICATION GUARD
 * Strict authentication and session management
 */

class AuthenticationGuard {
    constructor() {
        this.authConfig = {
            tokenKey: 'mpesewa_auth_token',
            userKey: 'mpesewa_user_data',
            sessionKey: 'mpesewa_session',
            refreshKey: 'mpesewa_refresh_token',
            tokenExpiry: 24 * 60 * 60 * 1000, // 24 hours
            refreshExpiry: 7 * 24 * 60 * 60 * 1000, // 7 days
            sessionTimeout: 30 * 60 * 1000 // 30 minutes of inactivity
        };
        
        this.initialized = false;
        this.sessionTimer = null;
        this.lastActivity = Date.now();
        
        // Initialize activity tracking
        this.initActivityTracking();
    }

    /**
     * Initialize authentication guard
     */
    initialize() {
        if (this.initialized) {
            console.warn('[AuthGuard] Already initialized');
            return this;
        }
        
        // Validate existing session
        this.validateExistingSession();
        
        // Set up session timeout
        this.setupSessionTimeout();
        
        // Set up token refresh if needed
        this.setupTokenRefresh();
        
        this.initialized = true;
        console.log('[AuthGuard] Initialized successfully');
        return this;
    }

    /**
     * Validate route access based on authentication
     */
    validateRoute(route, context = {}) {
        const startTime = Date.now();
        
        // Check if route requires authentication
        const authRequired = this.isAuthenticationRequired(route);
        
        if (!authRequired) {
            return {
                allowed: true,
                duration: Date.now() - startTime,
                context: { ...context, authRequired: false }
            };
        }
        
        // Check authentication status
        const authStatus = this.checkAuthentication();
        
        if (!authStatus.authenticated) {
            // Store attempted route for redirect after login
            if (route !== '/' && route !== '/auth/login.html' && route !== '/auth/register.html') {
                localStorage.setItem('mpesewa_redirect_after_login', route);
            }
            
            return {
                allowed: false,
                redirect: '/auth/login.html',
                error: 'AUTHENTICATION_REQUIRED',
                message: 'Please sign in to access this page',
                duration: Date.now() - startTime,
                metadata: {
                    attemptedRoute: route,
                    authStatus
                }
            };
        }
        
        // Check session timeout
        if (this.isSessionExpired()) {
            this.clearSession();
            
            return {
                allowed: false,
                redirect: '/auth/login.html?session=expired',
                error: 'SESSION_EXPIRED',
                message: 'Your session has expired. Please sign in again.',
                duration: Date.now() - startTime
            };
        }
        
        // Update last activity
        this.updateActivity();
        
        // Get user data
        const userData = this.getUserData();
        
        return {
            allowed: true,
            duration: Date.now() - startTime,
            context: {
                ...context,
                authRequired: true,
                authenticated: true,
                userId: userData.userId,
                userRole: userData.role,
                username: userData.username,
                country: userData.country,
                groups: userData.groups || []
            },
            metadata: {
                userRole: userData.role,
                authMethod: userData.authMethod,
                loginTime: userData.loginTime
            }
        };
    }

    /**
     * Check if authentication is required for route
     */
    isAuthenticationRequired(route) {
        // Public routes that don't require authentication
        const publicRoutes = [
            '/',
            '/index.html',
            '/home.html',
            '/auth/login.html',
            '/auth/register.html',
            '/auth/forgot.html',
            '/auth/reset.html',
            '/about.html',
            '/contact.html',
            '/terms.html',
            '/privacy.html',
            '/countries/',
            '/emergency/categories',
            '/how-it-works.html',
            '/faq.html',
            '/collectors.html'
        ];
        
        // Check if route matches any public route pattern
        for (const publicRoute of publicRoutes) {
            if (route === publicRoute || route.startsWith(publicRoute)) {
                // Special case: /countries/ without specific country is public
                if (publicRoute === '/countries/' && route !== '/countries/' && !route.endsWith('.html')) {
                    // Country pages might require auth depending on content
                    const countryRoute = route.substring('/countries/'.length);
                    if (!countryRoute.includes('/dashboard') && !countryRoute.includes('/groups')) {
                        return false;
                    }
                } else {
                    return false;
                }
            }
        }
        
        // Admin routes always require authentication
        if (route.startsWith('/admin/')) {
            return true;
        }
        
        // Protected routes that require authentication
        const protectedRoutes = [
            '/dashboard',
            '/lender/',
            '/borrower/',
            '/groups/',
            '/ledger/',
            '/subscription/',
            '/profile',
            '/settings',
            '/notifications'
        ];
        
        return protectedRoutes.some(protectedRoute => route.startsWith(protectedRoute));
    }

    /**
     * Check current authentication status
     */
    checkAuthentication() {
        const token = localStorage.getItem(this.authConfig.tokenKey);
        const userData = JSON.parse(localStorage.getItem(this.authConfig.userKey) || '{}');
        const session = JSON.parse(localStorage.getItem(this.authConfig.sessionKey) || '{}');
        
        // Check if token exists and is valid
        if (!token || token === 'null' || token === 'undefined') {
            return {
                authenticated: false,
                reason: 'NO_TOKEN',
                userData: null
            };
        }
        
        // Check token expiry
        if (session.expiry && Date.now() > new Date(session.expiry).getTime()) {
            return {
                authenticated: false,
                reason: 'TOKEN_EXPIRED',
                userData: null
            };
        }
        
        // Check user data completeness
        if (!userData.userId || !userData.role) {
            return {
                authenticated: false,
                reason: 'INCOMPLETE_USER_DATA',
                userData: null
            };
        }
        
        // Check if user is locked or suspended
        if (userData.status === 'locked' || userData.status === 'suspended') {
            return {
                authenticated: false,
                reason: 'ACCOUNT_LOCKED',
                userData
            };
        }
        
        return {
            authenticated: true,
            token: token.substring(0, 10) + '...', // Partial for logging
            userData,
            session
        };
    }

    /**
     * Create new authentication session
     */
    createSession(userData, authMethod = 'password') {
        if (!userData || !userData.userId) {
            throw new Error('Invalid user data for session creation');
        }
        
        // Generate authentication token (in production, this would come from server)
        const token = this.generateToken(userData.userId);
        const refreshToken = this.generateRefreshToken(userData.userId);
        
        // Calculate expiry times
        const tokenExpiry = new Date(Date.now() + this.authConfig.tokenExpiry);
        const refreshExpiry = new Date(Date.now() + this.authConfig.refreshExpiry);
        
        // Store tokens
        localStorage.setItem(this.authConfig.tokenKey, token);
        localStorage.setItem(this.authConfig.refreshKey, refreshToken);
        
        // Store user data
        const enhancedUserData = {
            ...userData,
            loginTime: new Date().toISOString(),
            authMethod: authMethod,
            device: this.getDeviceInfo()
        };
        
        localStorage.setItem(this.authConfig.userKey, JSON.stringify(enhancedUserData));
        
        // Store session info
        const session = {
            created: new Date().toISOString(),
            expiry: tokenExpiry.toISOString(),
            refreshExpiry: refreshExpiry.toISOString(),
            device: this.getDeviceInfo(),
            ip: 'local' // In production, this would be set by server
        };
        
        localStorage.setItem(this.authConfig.sessionKey, JSON.stringify(session));
        
        // Update activity
        this.updateActivity();
        
        // Log session creation
        this.logAuthEvent('SESSION_CREATED', {
            userId: userData.userId,
            authMethod,
            device: session.device
        });
        
        console.log('[AuthGuard] Session created for user:', userData.userId);
        
        return {
            token,
            refreshToken,
            expiry: tokenExpiry,
            userData: enhancedUserData
        };
    }

    /**
     * Clear authentication session (logout)
     */
    clearSession() {
        const userData = JSON.parse(localStorage.getItem(this.authConfig.userKey) || '{}');
        
        // Log logout event
        this.logAuthEvent('SESSION_ENDED', {
            userId: userData.userId,
            duration: this.getSessionDuration()
        });
        
        // Clear all auth-related storage
        localStorage.removeItem(this.authConfig.tokenKey);
        localStorage.removeItem(this.authConfig.userKey);
        localStorage.removeItem(this.authConfig.sessionKey);
        localStorage.removeItem(this.authConfig.refreshKey);
        localStorage.removeItem('mpesewa_redirect_after_login');
        
        // Clear session timer
        if (this.sessionTimer) {
            clearTimeout(this.sessionTimer);
            this.sessionTimer = null;
        }
        
        console.log('[AuthGuard] Session cleared');
        
        return true;
    }

    /**
     * Validate existing session on initialization
     */
    validateExistingSession() {
        const authStatus = this.checkAuthentication();
        
        if (!authStatus.authenticated) {
            console.log('[AuthGuard] No valid session found');
            return false;
        }
        
        // Check if session needs refresh
        if (this.needsTokenRefresh()) {
            console.log('[AuthGuard] Token needs refresh');
            this.refreshToken();
        }
        
        console.log('[AuthGuard] Valid session found for user:', authStatus.userData.userId);
        return true;
    }

    /**
     * Check if token needs refresh
     */
    needsTokenRefresh() {
        const session = JSON.parse(localStorage.getItem(this.authConfig.sessionKey) || '{}');
        
        if (!session.expiry) {
            return true;
        }
        
        const expiryTime = new Date(session.expiry).getTime();
        const refreshThreshold = Date.now() + (30 * 60 * 1000); // 30 minutes before expiry
        
        return expiryTime < refreshThreshold;
    }

    /**
     * Refresh authentication token
     */
    refreshToken() {
        const refreshToken = localStorage.getItem(this.authConfig.refreshKey);
        const userData = JSON.parse(localStorage.getItem(this.authConfig.userKey) || '{}');
        
        if (!refreshToken || !userData.userId) {
            console.warn('[AuthGuard] Cannot refresh token: missing refresh token or user data');
            return false;
        }
        
        // In production, this would call an API to refresh the token
        // For frontend-only implementation, we'll extend the existing token
        
        const newToken = this.generateToken(userData.userId);
        const newExpiry = new Date(Date.now() + this.authConfig.tokenExpiry);
        
        localStorage.setItem(this.authConfig.tokenKey, newToken);
        
        const session = JSON.parse(localStorage.getItem(this.authConfig.sessionKey) || '{}');
        session.expiry = newExpiry.toISOString();
        localStorage.setItem(this.authConfig.sessionKey, JSON.stringify(session));
        
        this.logAuthEvent('TOKEN_REFRESHED', {
            userId: userData.userId,
            newExpiry: newExpiry.toISOString()
        });
        
        console.log('[AuthGuard] Token refreshed for user:', userData.userId);
        return true;
    }

    /**
     * Get current user data
     */
    getUserData() {
        return JSON.parse(localStorage.getItem(this.authConfig.userKey) || '{}');
    }

    /**
     * Update user data (partial update)
     */
    updateUserData(updates) {
        const currentData = this.getUserData();
        const updatedData = { ...currentData, ...updates };
        
        localStorage.setItem(this.authConfig.userKey, JSON.stringify(updatedData));
        
        console.log('[AuthGuard] User data updated for:', updatedData.userId);
        return updatedData;
    }

    /**
     * Check if session has expired due to inactivity
     */
    isSessionExpired() {
        const session = JSON.parse(localStorage.getItem(this.authConfig.sessionKey) || '{}');
        
        if (!session.created) {
            return true;
        }
        
        const lastActivity = this.lastActivity;
        const timeSinceActivity = Date.now() - lastActivity;
        
        return timeSinceActivity > this.authConfig.sessionTimeout;
    }

    /**
     * Update last activity timestamp
     */
    updateActivity() {
        this.lastActivity = Date.now();
        
        // Reset session timeout
        if (this.sessionTimer) {
            clearTimeout(this.sessionTimer);
        }
        
        // Set new timeout
        this.sessionTimer = setTimeout(() => {
            console.log('[AuthGuard] Session timeout reached');
            this.clearSession();
            window.location.href = '/auth/login.html?session=timeout';
        }, this.authConfig.sessionTimeout);
    }

    /**
     * Set up session timeout tracking
     */
    setupSessionTimeout() {
        // Track user activity
        const activityEvents = ['click', 'mousemove', 'keypress', 'scroll', 'touchstart'];
        
        activityEvents.forEach(event => {
            document.addEventListener(event, () => {
                this.updateActivity();
            }, { passive: true });
        });
        
        // Initial update
        this.updateActivity();
    }

    /**
     * Set up automatic token refresh
     */
    setupTokenRefresh() {
        // Check token every 5 minutes
        setInterval(() => {
            if (this.needsTokenRefresh()) {
                this.refreshToken();
            }
        }, 5 * 60 * 1000);
    }

    /**
     * Initialize activity tracking
     */
    initActivityTracking() {
        // Store initial activity time
        this.lastActivity = Date.now();
        
        // Listen for visibility changes
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.updateActivity();
            }
        });
    }

    /**
     * Generate a mock token (in production, this would be from server)
     */
    generateToken(userId) {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2);
        return `mpesewa_${userId}_${timestamp}_${random}`;
    }

    /**
     * Generate a mock refresh token
     */
    generateRefreshToken(userId) {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 15);
        return `refresh_${userId}_${timestamp}_${random}`;
    }

    /**
     * Get device information
     */
    getDeviceInfo() {
        return {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            screenWidth: window.screen.width,
            screenHeight: window.screen.height,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            pwa: window.matchMedia('(display-mode: standalone)').matches
        };
    }

    /**
     * Get session duration
     */
    getSessionDuration() {
        const session = JSON.parse(localStorage.getItem(this.authConfig.sessionKey) || '{}');
        
        if (!session.created) {
            return 0;
        }
        
        const created = new Date(session.created).getTime();
        return Date.now() - created;
    }

    /**
     * Log authentication events
     */
    logAuthEvent(eventType, metadata = {}) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            event: eventType,
            userId: metadata.userId || 'unknown',
            ip: metadata.ip || 'local',
            device: metadata.device || this.getDeviceInfo(),
            metadata
        };
        
        // Store in localStorage (in production, would send to server)
        const authLogs = JSON.parse(localStorage.getItem('mpesewa_auth_logs') || '[]');
        authLogs.push(logEntry);
        
        // Keep only last 100 logs
        if (authLogs.length > 100) {
            authLogs.splice(0, authLogs.length - 100);
        }
        
        localStorage.setItem('mpesewa_auth_logs', JSON.stringify(authLogs));
        
        // Console log for debugging
        console.log(`[AuthEvent] ${eventType}:`, metadata);
    }

    /**
     * Validate password strength
     */
    validatePassword(password) {
        const requirements = {
            minLength: 8,
            maxLength: 12,
            hasUpperCase: /[A-Z]/.test(password),
            hasLowerCase: /[a-z]/.test(password),
            hasNumbers: /\d/.test(password),
            hasSymbols: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
        };
        
        const errors = [];
        
        if (password.length < requirements.minLength) {
            errors.push(`Password must be at least ${requirements.minLength} characters`);
        }
        
        if (password.length > requirements.maxLength) {
            errors.push(`Password must not exceed ${requirements.maxLength} characters`);
        }
        
        if (!requirements.hasUpperCase) {
            errors.push('Password must contain at least one uppercase letter');
        }
        
        if (!requirements.hasLowerCase) {
            errors.push('Password must contain at least one lowercase letter');
        }
        
        if (!requirements.hasNumbers) {
            errors.push('Password must contain at least one number');
        }
        
        if (!requirements.hasSymbols) {
            errors.push('Password must contain at least one symbol');
        }
        
        return {
            valid: errors.length === 0,
            errors,
            strength: this.calculatePasswordStrength(password)
        };
    }

    /**
     * Calculate password strength score
     */
    calculatePasswordStrength(password) {
        let score = 0;
        
        // Length check
        if (password.length >= 8) score += 1;
        if (password.length >= 10) score += 1;
        if (password.length >= 12) score += 1;
        
        // Character variety
        if (/[A-Z]/.test(password)) score += 1;
        if (/[a-z]/.test(password)) score += 1;
        if (/\d/.test(password)) score += 1;
        if (/[^A-Za-z0-9]/.test(password)) score += 1;
        
        // No common patterns
        const commonPatterns = ['password', '123456', 'qwerty', 'admin', 'letmein'];
        if (!commonPatterns.some(pattern => password.toLowerCase().includes(pattern))) {
            score += 1;
        }
        
        return {
            score: Math.min(score, 10),
            level: score >= 8 ? 'strong' : score >= 5 ? 'medium' : 'weak'
        };
    }

    /**
     * Validate username
     */
    validateUsername(username) {
        const errors = [];
        
        if (username.length < 3) {
            errors.push('Username must be at least 3 characters');
        }
        
        if (username.length > 20) {
            errors.push('Username must not exceed 20 characters');
        }
        
        if (!/^[a-zA-Z0-9_.-]+$/.test(username)) {
            errors.push('Username can only contain letters, numbers, dots, hyphens, and underscores');
        }
        
        // Check if username is already taken (in production, would check database)
        const takenUsernames = JSON.parse(localStorage.getItem('mpesewa_usernames') || '[]');
        if (takenUsernames.includes(username.toLowerCase())) {
            errors.push('Username is already taken');
        }
        
        return {
            valid: errors.length === 0,
            errors
        };
    }

    /**
     * Register new user
     */
    registerUser(userData) {
        const { username, password, role, country, email, phone } = userData;
        
        // Validate inputs
        const usernameValidation = this.validateUsername(username);
        if (!usernameValidation.valid) {
            throw new Error(`Username validation failed: ${usernameValidation.errors.join(', ')}`);
        }
        
        const passwordValidation = this.validatePassword(password);
        if (!passwordValidation.valid) {
            throw new Error(`Password validation failed: ${passwordValidation.errors.join(', ')}`);
        }
        
        // Validate role
        const validRoles = ['lender', 'borrower', 'group-admin'];
        if (!validRoles.includes(role)) {
            throw new Error(`Invalid role: ${role}`);
        }
        
        // Validate country
        const validCountries = [
            'kenya', 'uganda', 'tanzania', 'rwanda', 'drc', 'burundi',
            'nigeria', 'ghana', 'south-sudan', 'somalia', 'south-africa', 'ethiopia'
        ];
        
        if (!validCountries.includes(country)) {
            throw new Error(`Invalid country: ${country}`);
        }
        
        // Create user object
        const userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        
        const newUser = {
            userId,
            username: username.toLowerCase(),
            email: email || null,
            phone: phone || null,
            role,
            country,
            status: 'active',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            profile: {
                fullName: userData.fullName || '',
                nationalId: userData.nationalId || '',
                location: userData.location || '',
                rating: role === 'borrower' ? 5 : null, // Initial rating for borrowers
                subscription: role === 'lender' ? null : undefined
            }
        };
        
        // Store user data (in production, would send to API)
        const users = JSON.parse(localStorage.getItem('mpesewa_users') || '[]');
        users.push(newUser);
        localStorage.setItem('mpesewa_users', JSON.stringify(users));
        
        // Store username for uniqueness check
        const takenUsernames = JSON.parse(localStorage.getItem('mpesewa_usernames') || '[]');
        takenUsernames.push(username.toLowerCase());
        localStorage.setItem('mpesewa_usernames', JSON.stringify(takenUsernames));
        
        // Log registration
        this.logAuthEvent('USER_REGISTERED', {
            userId,
            username,
            role,
            country
        });
        
        console.log('[AuthGuard] User registered:', userId);
        
        return newUser;
    }

    /**
     * Authenticate user
     */
    authenticate(username, password, authMethod = 'password') {
        // In production, this would call an API
        // For demo purposes, we'll check against localStorage
        
        const users = JSON.parse(localStorage.getItem('mpesewa_users') || '[]');
        const user = users.find(u => u.username === username.toLowerCase());
        
        if (!user) {
            throw new Error('User not found');
        }
        
        if (user.status !== 'active') {
            throw new Error(`Account is ${user.status}`);
        }
        
        // In production, password would be hashed and verified server-side
        // For demo, we'll accept any non-empty password
        if (!password || password.length === 0) {
            throw new Error('Invalid password');
        }
        
        // Create session
        const session = this.createSession(user, authMethod);
        
        // Log login
        this.logAuthEvent('USER_LOGIN', {
            userId: user.userId,
            username,
            authMethod,
            success: true
        });
        
        return {
            success: true,
            user: session.userData,
            token: session.token
        };
    }

    /**
     * Google authentication (mock)
     */
    authenticateWithGoogle(googleToken) {
        // In production, would verify Google token with Google API
        // For demo, create a mock user
        
        const mockUser = {
            userId: `google_${Date.now()}`,
            username: `google_user_${Math.random().toString(36).substring(2, 7)}`,
            email: 'google.user@example.com',
            role: 'borrower', // Default role for Google login
            country: 'kenya', // Default country
            status: 'active',
            createdAt: new Date().toISOString(),
            authMethod: 'google'
        };
        
        const session = this.createSession(mockUser, 'google');
        
        this.logAuthEvent('GOOGLE_LOGIN', {
            userId: mockUser.userId,
            success: true
        });
        
        return {
            success: true,
            user: session.userData,
            token: session.token
        };
    }

    /**
     * Change password
     */
    changePassword(oldPassword, newPassword) {
        const userData = this.getUserData();
        
        if (!userData.userId) {
            throw new Error('Not authenticated');
        }
        
        // Validate new password
        const validation = this.validatePassword(newPassword);
        if (!validation.valid) {
            throw new Error(`New password invalid: ${validation.errors.join(', ')}`);
        }
        
        // In production, would verify old password with server
        // For demo, just accept if old password is provided
        
        if (!oldPassword) {
            throw new Error('Old password required');
        }
        
        // Update user password (in production, would call API)
        const users = JSON.parse(localStorage.getItem('mpesewa_users') || '[]');
        const userIndex = users.findIndex(u => u.userId === userData.userId);
        
        if (userIndex !== -1) {
            users[userIndex].updatedAt = new Date().toISOString();
            localStorage.setItem('mpesewa_users', JSON.stringify(users));
        }
        
        this.logAuthEvent('PASSWORD_CHANGED', {
            userId: userData.userId
        });
        
        console.log('[AuthGuard] Password changed for user:', userData.userId);
        
        return true;
    }

    /**
     * Reset password (forgot password flow)
     */
    resetPassword(email, newPassword, resetToken) {
        // In production, would verify reset token with server
        // For demo, just validate and update
        
        if (!email || !newPassword || !resetToken) {
            throw new Error('Email, new password, and reset token required');
        }
        
        const validation = this.validatePassword(newPassword);
        if (!validation.valid) {
            throw new Error(`New password invalid: ${validation.errors.join(', ')}`);
        }
        
        // Find user by email (in production, would call API)
        const users = JSON.parse(localStorage.getItem('mpesewa_users') || '[]');
        const userIndex = users.findIndex(u => u.email === email);
        
        if (userIndex === -1) {
            throw new Error('User not found');
        }
        
        // Update password
        users[userIndex].updatedAt = new Date().toISOString();
        localStorage.setItem('mpesewa_users', JSON.stringify(users));
        
        this.logAuthEvent('PASSWORD_RESET', {
            userId: users[userIndex].userId,
            email
        });
        
        console.log('[AuthGuard] Password reset for user:', users[userIndex].userId);
        
        return true;
    }

    /**
     * Request password reset
     */
    requestPasswordReset(email) {
        // In production, would send email with reset link
        // For demo, generate a reset token and store it
        
        const resetToken = `reset_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
        const expiry = new Date(Date.now() + (24 * 60 * 60 * 1000)); // 24 hours
        
        // Store reset token (in production, would store in database)
        const resetTokens = JSON.parse(localStorage.getItem('mpesewa_reset_tokens') || '[]');
        resetTokens.push({
            email,
            token: resetToken,
            expiry: expiry.toISOString(),
            used: false
        });
        
        localStorage.setItem('mpesewa_reset_tokens', JSON.stringify(resetTokens));
        
        this.logAuthEvent('PASSWORD_RESET_REQUESTED', {
            email,
            resetToken: resetToken.substring(0, 10) + '...'
        });
        
        console.log('[AuthGuard] Password reset requested for:', email);
        
        // In production, would return success without revealing if email exists
        return {
            success: true,
            message: 'If an account exists with this email, a reset link has been sent'
        };
    }

    /**
     * Verify reset token
     */
    verifyResetToken(email, token) {
        const resetTokens = JSON.parse(localStorage.getItem('mpesewa_reset_tokens') || '[]');
        
        const validToken = resetTokens.find(t => 
            t.email === email && 
            t.token === token && 
            !t.used &&
            new Date(t.expiry) > new Date()
        );
        
        return {
            valid: !!validToken,
            token: validToken
        };
    }

    /**
     * Get authentication statistics
     */
    getAuthStats() {
        const users = JSON.parse(localStorage.getItem('mpesewa_users') || '[]');
        const authLogs = JSON.parse(localStorage.getItem('mpesewa_auth_logs') || '[]');
        
        return {
            totalUsers: users.length,
            activeSessions: this.checkAuthentication().authenticated ? 1 : 0,
            recentLogins: authLogs.filter(log => 
                log.event === 'USER_LOGIN' && 
                new Date(log.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000)
            ).length,
            failedAttempts: authLogs.filter(log => 
                log.event === 'LOGIN_FAILED'
            ).length,
            userRoles: users.reduce((acc, user) => {
                acc[user.role] = (acc[user.role] || 0) + 1;
                return acc;
            }, {}),
            countries: users.reduce((acc, user) => {
                acc[user.country] = (acc[user.country] || 0) + 1;
                return acc;
            }, {})
        };
    }

    /**
     * Export authentication configuration
     */
    exportConfig() {
        return {
            version: '1.0.0',
            initialized: this.initialized,
            config: this.authConfig,
            sessionActive: this.checkAuthentication().authenticated,
            userCount: JSON.parse(localStorage.getItem('mpesewa_users') || '[]').length,
            lastActivity: new Date(this.lastActivity).toISOString(),
            sessionDuration: this.getSessionDuration()
        };
    }
}

// Create singleton instance
const authGuard = new AuthenticationGuard();

// Auto-initialize
authGuard.initialize();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = authGuard;
} else {
    window.AuthGuard = authGuard;
}