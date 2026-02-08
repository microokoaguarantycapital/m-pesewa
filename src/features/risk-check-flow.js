// features/risk-check-flow.js
// Risk assessment: device checks, subscription validity, fraud flags

class RiskCheckFlow {
    constructor() {
        this.riskScores = {};
        this.fraudFlags = [];
        this.deviceFingerprint = null;
        this.subscriptionChecks = {};
        this.MAX_RISK_SCORE = 100;
        this.RISK_THRESHOLD = 70;
        this.init();
    }

    init() {
        // Generate device fingerprint
        this.generateDeviceFingerprint();
        
        // Load previous risk assessments
        this.loadRiskScores();
        
        // Load fraud flags
        this.loadFraudFlags();
        
        // Start periodic risk checks
        this.startPeriodicChecks();
        
        console.log('Risk Check Flow initialized');
    }

    // Perform comprehensive risk assessment
    async assessRisk(context) {
        const assessment = {
            id: `risk_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date().toISOString(),
            context: context.type,
            userId: context.userId,
            scores: {},
            flags: [],
            overallScore: 0,
            riskLevel: 'low',
            recommendations: []
        };

        // Run individual risk checks
        const checks = await Promise.all([
            this.checkDeviceRisk(context),
            this.checkSubscriptionRisk(context),
            this.checkBehaviorRisk(context),
            this.checkTransactionRisk(context),
            this.checkGeolocationRisk(context),
            this.checkNetworkRisk(context),
            this.checkAccountRisk(context)
        ]);

        // Combine results
        checks.forEach(check => {
            assessment.scores[check.category] = check.score;
            assessment.flags.push(...check.flags);
            assessment.recommendations.push(...check.recommendations);
        });

        // Calculate overall score (weighted average)
        assessment.overallScore = this.calculateOverallScore(assessment.scores);
        assessment.riskLevel = this.determineRiskLevel(assessment.overallScore);

        // Store assessment
        this.storeRiskAssessment(assessment);

        // Take action based on risk level
        await this.handleRiskLevel(assessment);

        return assessment;
    }

    // Check device risk
    async checkDeviceRisk(context) {
        const check = {
            category: 'device',
            score: 0,
            flags: [],
            recommendations: []
        };

        // Device fingerprint consistency
        const currentFingerprint = this.generateDeviceFingerprint();
        const storedFingerprint = localStorage.getItem('mpesewa_device_fingerprint');
        
        if (storedFingerprint && storedFingerprint !== currentFingerprint) {
            check.score += 30;
            check.flags.push({
                code: 'DEVICE_MISMATCH',
                severity: 'medium',
                message: 'Device fingerprint has changed'
            });
            check.recommendations.push('Verify device authenticity');
        }

        // Browser features
        if (!this.hasStandardBrowserFeatures()) {
            check.score += 20;
            check.flags.push({
                code: 'UNUSUAL_BROWSER',
                severity: 'low',
                message: 'Unusual browser configuration detected'
            });
        }

        // Screen resolution anomalies
        if (this.hasSuspiciousScreenResolution()) {
            check.score += 15;
            check.flags.push({
                code: 'SUSPICIOUS_RESOLUTION',
                severity: 'low',
                message: 'Unusual screen resolution detected'
            });
        }

        // Timezone consistency
        if (!this.isTimezoneConsistent()) {
            check.score += 10;
            check.flags.push({
                code: 'TIMEZONE_CHANGE',
                severity: 'low',
                message: 'Timezone has changed from previous sessions'
            });
        }

        // Device storage access
        if (!this.canAccessLocalStorage()) {
            check.score += 25;
            check.flags.push({
                code: 'STORAGE_BLOCKED',
                severity: 'high',
                message: 'Local storage access is blocked'
            });
            check.recommendations.push('Enable local storage for app functionality');
        }

        // Limit device risk score
        check.score = Math.min(check.score, 100);

        return check;
    }

    // Check subscription risk
    async checkSubscriptionRisk(context) {
        const check = {
            category: 'subscription',
            score: 0,
            flags: [],
            recommendations: []
        };

        const userId = context.userId;
        const subscription = await this.getUserSubscription(userId);

        if (!subscription) {
            check.score += 40;
            check.flags.push({
                code: 'NO_SUBSCRIPTION',
                severity: 'high',
                message: 'User has no active subscription'
            });
            check.recommendations.push('Purchase a subscription to continue lending');
            return check;
        }

        // Check expiration
        const expiryDate = new Date(subscription.expiresAt);
        const now = new Date();
        const daysUntilExpiry = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));

        if (daysUntilExpiry < 0) {
            check.score += 50;
            check.flags.push({
                code: 'SUBSCRIPTION_EXPIRED',
                severity: 'high',
                message: 'Subscription has expired'
            });
            check.recommendations.push('Renew subscription immediately');
        } else if (daysUntilExpiry <= 3) {
            check.score += 20;
            check.flags.push({
                code: 'SUBSCRIPTION_EXPIRING',
                severity: 'medium',
                message: `Subscription expires in ${daysUntilExpiry} days`
            });
            check.recommendations.push('Renew subscription soon');
        }

        // Check payment history
        const hasPaymentIssues = await this.hasPaymentIssues(userId);
        if (hasPaymentIssues) {
            check.score += 25;
            check.flags.push({
                code: 'PAYMENT_ISSUES',
                severity: 'medium',
                message: 'Previous payment issues detected'
            });
        }

        // Check subscription tier limits
        const tierLimits = this.getTierLimits(subscription.plan);
        const currentUsage = await this.getSubscriptionUsage(userId);
        
        if (currentUsage >= tierLimits.maxLoans * 0.9) {
            check.score += 15;
            check.flags.push({
                code: 'TIER_LIMIT_APPROACHING',
                severity: 'low',
                message: 'Approaching subscription tier limit'
            });
            check.recommendations.push('Consider upgrading subscription tier');
        }

        // Limit subscription risk score
        check.score = Math.min(check.score, 100);

        return check;
    }

    // Check behavior risk
    async checkBehaviorRisk(context) {
        const check = {
            category: 'behavior',
            score: 0,
            flags: [],
            recommendations: []
        };

        const userId = context.userId;
        
        // Login pattern analysis
        const loginPattern = await this.analyzeLoginPattern(userId);
        if (loginPattern.anomalies.length > 0) {
            check.score += loginPattern.anomalies.length * 10;
            check.flags.push(...loginPattern.anomalies);
            check.recommendations.push('Review login activity');
        }

        // Session duration analysis
        const sessionPattern = await this.analyzeSessionPattern(userId);
        if (sessionPattern.anomalies.length > 0) {
            check.score += sessionPattern.anomalies.length * 5;
            check.flags.push(...sessionPattern.anomalies);
        }

        // Action frequency analysis
        const actionPattern = await this.analyzeActionPattern(userId);
        if (actionPattern.anomalies.length > 0) {
            check.score += actionPattern.anomalies.length * 8;
            check.flags.push(...actionPattern.anomalies);
            check.recommendations.push('Monitor account activity');
        }

        // Time-of-day analysis
        if (this.isUnusualTimeForUser(userId)) {
            check.score += 15;
            check.flags.push({
                code: 'UNUSUAL_ACTIVITY_TIME',
                severity: 'medium',
                message: 'Activity at unusual time for this user'
            });
        }

        // Limit behavior risk score
        check.score = Math.min(check.score, 100);

        return check;
    }

    // Check transaction risk
    async checkTransactionRisk(context) {
        const check = {
            category: 'transaction',
            score: 0,
            flags: [],
            recommendations: []
        };

        // Amount analysis
        if (context.amount) {
            const amountRisk = this.assessAmountRisk(context.amount, context.userId);
            check.score += amountRisk.score;
            check.flags.push(...amountRisk.flags);
            
            if (amountRisk.recommendations.length > 0) {
                check.recommendations.push(...amountRisk.recommendations);
            }
        }

        // Frequency analysis
        const frequencyRisk = await this.assessFrequencyRisk(context.userId);
        check.score += frequencyRisk.score;
        check.flags.push(...frequencyRisk.flags);

        // Recipient analysis
        if (context.recipientId) {
            const recipientRisk = await this.assessRecipientRisk(context.recipientId);
            check.score += recipientRisk.score;
            check.flags.push(...recipientRisk.flags);
            
            if (recipientRisk.recommendations.length > 0) {
                check.recommendations.push(...recipientRisk.recommendations);
            }
        }

        // Pattern analysis
        const patternRisk = await this.assessPatternRisk(context.userId);
        check.score += patternRisk.score;
        check.flags.push(...patternRisk.flags);

        // Limit transaction risk score
        check.score = Math.min(check.score, 100);

        return check;
    }

    // Check geolocation risk
    async checkGeolocationRisk(context) {
        const check = {
            category: 'geolocation',
            score: 0,
            flags: [],
            recommendations: []
        };

        try {
            // Get current location
            const position = await this.getCurrentPosition();
            
            if (!position) {
                check.score += 10;
                check.flags.push({
                    code: 'LOCATION_UNAVAILABLE',
                    severity: 'low',
                    message: 'Location information unavailable'
                });
                return check;
            }

            // Check against user's registered location
            const userLocation = await this.getUserLocation(context.userId);
            if (userLocation) {
                const distance = this.calculateDistance(
                    position.coords.latitude,
                    position.coords.longitude,
                    userLocation.latitude,
                    userLocation.longitude
                );

                if (distance > 100) { // More than 100km from registered location
                    check.score += 30;
                    check.flags.push({
                        code: 'LOCATION_MISMATCH',
                        severity: 'medium',
                        message: `Activity ${Math.round(distance)}km from registered location`
                    });
                    check.recommendations.push('Verify location change');
                }
            }

            // Check for VPN/Proxy
            if (await this.isUsingVPN()) {
                check.score += 25;
                check.flags.push({
                    code: 'VPN_DETECTED',
                    severity: 'high',
                    message: 'VPN or proxy detected'
                });
                check.recommendations.push('Disable VPN for secure transactions');
            }

            // Check country consistency
            const userCountry = await this.getUserCountry(context.userId);
            const currentCountry = await this.getCountryFromCoordinates(
                position.coords.latitude,
                position.coords.longitude
            );

            if (userCountry && currentCountry && userCountry !== currentCountry) {
                check.score += 40;
                check.flags.push({
                    code: 'COUNTRY_MISMATCH',
                    severity: 'high',
                    message: `Activity from ${currentCountry}, expected ${userCountry}`
                });
                check.recommendations.push('Verify international access');
            }

        } catch (error) {
            console.error('Geolocation check failed:', error);
            check.score += 5;
            check.flags.push({
                code: 'GEOLOCATION_ERROR',
                severity: 'low',
                message: 'Geolocation check could not be completed'
            });
        }

        // Limit geolocation risk score
        check.score = Math.min(check.score, 100);

        return check;
    }

    // Check network risk
    async checkNetworkRisk(context) {
        const check = {
            category: 'network',
            score: 0,
            flags: [],
            recommendations: []
        };

        // Network type detection
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        
        if (connection) {
            // Check for cellular data (higher risk)
            if (connection.type === 'cellular') {
                check.score += 15;
                check.flags.push({
                    code: 'CELLULAR_NETWORK',
                    severity: 'low',
                    message: 'Using cellular network'
                });
            }

            // Check for slow connection
            if (connection.downlink < 1) { // Less than 1 Mbps
                check.score += 10;
                check.flags.push({
                    code: 'SLOW_CONNECTION',
                    severity: 'low',
                    message: 'Slow network connection detected'
                });
            }

            // Check for data saving mode
            if (connection.saveData) {
                check.score += 5;
                check.flags.push({
                    code: 'DATA_SAVER_ENABLED',
                    severity: 'low',
                    message: 'Data saving mode enabled'
                });
            }
        }

        // IP address analysis
        const ipInfo = await this.getIPInfo();
        if (ipInfo) {
            // Check for known malicious IP ranges
            if (this.isSuspiciousIP(ipInfo.ip)) {
                check.score += 35;
                check.flags.push({
                    code: 'SUSPICIOUS_IP',
                    severity: 'high',
                    message: 'Suspicious IP address detected'
                });
                check.recommendations.push('Connect from a trusted network');
            }

            // Check for hosting/VPS IPs
            if (this.isHostingIP(ipInfo.ip)) {
                check.score += 25;
                check.flags.push({
                    code: 'HOSTING_IP',
                    severity: 'medium',
                    message: 'Activity from hosting/VPS IP address'
                });
            }
        }

        // Limit network risk score
        check.score = Math.min(check.score, 100);

        return check;
    }

    // Check account risk
    async checkAccountRisk(context) {
        const check = {
            category: 'account',
            score: 0,
            flags: [],
            recommendations: []
        };

        const userId = context.userId;

        // Account age
        const accountAge = await this.getAccountAge(userId);
        if (accountAge < 7) { // Less than 7 days old
            check.score += 30;
            check.flags.push({
                code: 'NEW_ACCOUNT',
                severity: 'medium',
                message: 'Account is less than 7 days old'
            });
            check.recommendations.push('Limit transaction amounts for new accounts');
        }

        // Verification status
        const isVerified = await this.isAccountVerified(userId);
        if (!isVerified) {
            check.score += 40;
            check.flags.push({
                code: 'UNVERIFIED_ACCOUNT',
                severity: 'high',
                message: 'Account is not verified'
            });
            check.recommendations.push('Complete account verification');
        }

        // Previous fraud flags
        const previousFlags = await this.getUserFraudFlags(userId);
        if (previousFlags.length > 0) {
            check.score += previousFlags.length * 10;
            check.flags.push(...previousFlags.map(flag => ({
                code: 'PREVIOUS_FLAG',
                severity: flag.severity,
                message: `Previous fraud flag: ${flag.reason}`
            })));
            check.recommendations.push('Review account history');
        }

        // Linked accounts
        const linkedAccounts = await this.getLinkedAccounts(userId);
        if (linkedAccounts.some(acc => acc.hasFraudHistory)) {
            check.score += 35;
            check.flags.push({
                code: 'FRAUD_LINKED_ACCOUNT',
                severity: 'high',
                message: 'Linked account has fraud history'
            });
        }

        // Limit account risk score
        check.score = Math.min(check.score, 100);

        return check;
    }

    // Calculate overall risk score
    calculateOverallScore(scores) {
        const weights = {
            device: 0.15,
            subscription: 0.20,
            behavior: 0.15,
            transaction: 0.25,
            geolocation: 0.10,
            network: 0.05,
            account: 0.10
        };

        let weightedSum = 0;
        let totalWeight = 0;

        for (const [category, score] of Object.entries(scores)) {
            if (weights[category]) {
                weightedSum += score * weights[category];
                totalWeight += weights[category];
            }
        }

        return totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;
    }

    // Determine risk level
    determineRiskLevel(score) {
        if (score >= 80) return 'critical';
        if (score >= 70) return 'high';
        if (score >= 50) return 'medium';
        if (score >= 30) return 'low';
        return 'very-low';
    }

    // Handle risk level
    async handleRiskLevel(assessment) {
        const actions = {
            'very-low': this.handleVeryLowRisk,
            'low': this.handleLowRisk,
            'medium': this.handleMediumRisk,
            'high': this.handleHighRisk,
            'critical': this.handleCriticalRisk
        };

        const handler = actions[assessment.riskLevel];
        if (handler) {
            await handler.call(this, assessment);
        }

        // Emit risk assessment event
        this.emitRiskAssessmentEvent(assessment);
    }

    // Risk level handlers
    async handleVeryLowRisk(assessment) {
        console.log('Very low risk - normal processing');
        // No special action needed
    }

    async handleLowRisk(assessment) {
        console.log('Low risk - enhanced monitoring');
        // Flag for review, but allow processing
        this.addToWatchlist(assessment.userId, 'low_risk');
    }

    async handleMediumRisk(assessment) {
        console.log('Medium risk - additional verification required');
        // Require additional verification
        await this.requireAdditionalVerification(assessment.userId);
        this.addToWatchlist(assessment.userId, 'medium_risk');
    }

    async handleHighRisk(assessment) {
        console.log('High risk - restricted access');
        // Restrict certain actions
        await this.restrictAccountAccess(assessment.userId, assessment.flags);
        this.addToWatchlist(assessment.userId, 'high_risk');
        
        // Notify security team
        await this.notifySecurityTeam(assessment);
    }

    async handleCriticalRisk(assessment) {
        console.log('Critical risk - immediate action required');
        // Freeze account immediately
        await this.freezeAccount(assessment.userId);
        this.addToWatchlist(assessment.userId, 'critical_risk');
        
        // Notify security team and user
        await this.notifySecurityTeam(assessment);
        await this.notifyUserOfSuspiciousActivity(assessment.userId);
    }

    // Utility methods

    generateDeviceFingerprint() {
        const components = [
            navigator.userAgent,
            navigator.platform,
            navigator.language,
            screen.width + 'x' + screen.height,
            screen.colorDepth,
            new Date().getTimezoneOffset(),
            !!navigator.cookieEnabled,
            !!window.localStorage,
            !!window.sessionStorage
        ];

        const fingerprint = components.join('|');
        const hash = this.hashString(fingerprint);
        
        // Store fingerprint
        localStorage.setItem('mpesewa_device_fingerprint', hash);
        this.deviceFingerprint = hash;
        
        return hash;
    }

    hashString(str) {
        // Simple hash function for demo purposes
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString(36);
    }

    hasStandardBrowserFeatures() {
        const requiredFeatures = [
            'localStorage',
            'sessionStorage',
            'indexedDB',
            'WebSocket',
            'fetch'
        ];

        return requiredFeatures.every(feature => feature in window);
    }

    hasSuspiciousScreenResolution() {
        // Check for common emulator/resolution
        const suspiciousResolutions = [
            '320x568',  // iPhone 5
            '375x667',  // iPhone 6/7/8
            '360x640',  // Common mobile
            '1024x768', // iPad
            '800x600'   // Old desktop
        ];

        const currentResolution = `${screen.width}x${screen.height}`;
        return suspiciousResolutions.includes(currentResolution);
    }

    isTimezoneConsistent() {
        const storedTimezone = localStorage.getItem('mpesewa_timezone');
        const currentTimezone = new Date().getTimezoneOffset();
        
        if (!storedTimezone) {
            localStorage.setItem('mpesewa_timezone', currentTimezone);
            return true;
        }
        
        return parseInt(storedTimezone) === currentTimezone;
    }

    canAccessLocalStorage() {
        try {
            localStorage.setItem('test', 'test');
            localStorage.removeItem('test');
            return true;
        } catch (e) {
            return false;
        }
    }

    // Store methods

    storeRiskAssessment(assessment) {
        // Store in memory
        if (!this.riskScores[assessment.userId]) {
            this.riskScores[assessment.userId] = [];
        }
        
        this.riskScores[assessment.userId].unshift(assessment);
        
        // Keep only last 20 assessments per user
        if (this.riskScores[assessment.userId].length > 20) {
            this.riskScores[assessment.userId].pop();
        }
        
        // Save to localStorage
        this.saveRiskScores();
    }

    saveRiskScores() {
        localStorage.setItem('mpesewa_risk_scores', JSON.stringify(this.riskScores));
    }

    loadRiskScores() {
        try {
            const stored = localStorage.getItem('mpesewa_risk_scores');
            if (stored) {
                this.riskScores = JSON.parse(stored);
            }
        } catch (error) {
            console.error('Failed to load risk scores:', error);
            this.riskScores = {};
        }
    }

    saveFraudFlags() {
        localStorage.setItem('mpesewa_fraud_flags', JSON.stringify(this.fraudFlags));
    }

    loadFraudFlags() {
        try {
            const stored = localStorage.getItem('mpesewa_fraud_flags');
            if (stored) {
                this.fraudFlags = JSON.parse(stored);
            }
        } catch (error) {
            console.error('Failed to load fraud flags:', error);
            this.fraudFlags = [];
        }
    }

    // Periodic checks

    startPeriodicChecks() {
        // Run background checks every 5 minutes
        setInterval(() => {
            this.runBackgroundChecks();
        }, 5 * 60 * 1000);
    }

    async runBackgroundChecks() {
        console.log('Running background risk checks');
        
        // Check all active users
        const activeUsers = this.getActiveUsers();
        
        for (const userId of activeUsers) {
            try {
                await this.assessRisk({
                    type: 'periodic_check',
                    userId: userId
                });
            } catch (error) {
                console.error(`Background check failed for user ${userId}:`, error);
            }
        }
    }

    // Event emission

    emitRiskAssessmentEvent(assessment) {
        const event = new CustomEvent('risk-assessment', { detail: assessment });
        window.dispatchEvent(event);
    }

    // Stub methods for demo purposes

    async getUserSubscription(userId) {
        // In real app, fetch from server
        const subscriptions = JSON.parse(localStorage.getItem('mpesewa_subscriptions') || '{}');
        return subscriptions[userId] || null;
    }

    async hasPaymentIssues(userId) {
        // In real app, check payment history
        return false;
    }

    getTierLimits(plan) {
        const limits = {
            basic: { maxLoans: 10, maxAmount: 1500 },
            premium: { maxLoans: 50, maxAmount: 5000 },
            super: { maxLoans: 100, maxAmount: 20000 }
        };
        return limits[plan] || limits.basic;
    }

    async getSubscriptionUsage(userId) {
        // In real app, calculate from ledger
        return 0;
    }

    async analyzeLoginPattern(userId) {
        // In real app, analyze login history
        return { anomalies: [] };
    }

    async analyzeSessionPattern(userId) {
        // In real app, analyze session history
        return { anomalies: [] };
    }

    async analyzeActionPattern(userId) {
        // In real app, analyze user actions
        return { anomalies: [] };
    }

    isUnusualTimeForUser(userId) {
        // In real app, analyze user's typical activity times
        return false;
    }

    assessAmountRisk(amount, userId) {
        // In real app, check against user's history and limits
        return { score: 0, flags: [], recommendations: [] };
    }

    async assessFrequencyRisk(userId) {
        // In real app, analyze transaction frequency
        return { score: 0, flags: [], recommendations: [] };
    }

    async assessRecipientRisk(recipientId) {
        // In real app, check recipient's risk profile
        return { score: 0, flags: [], recommendations: [] };
    }

    async assessPatternRisk(userId) {
        // In real app, analyze transaction patterns
        return { score: 0, flags: [], recommendations: [] };
    }

    async getCurrentPosition() {
        // In real app, use Geolocation API with user permission
        return null;
    }

    async getUserLocation(userId) {
        // In real app, fetch from user profile
        return null;
    }

    calculateDistance(lat1, lon1, lat2, lon2) {
        // Haversine formula for distance calculation
        const R = 6371; // Earth's radius in km
        const dLat = this.toRad(lat2 - lat1);
        const dLon = this.toRad(lon2 - lon1);
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }

    toRad(degrees) {
        return degrees * (Math.PI / 180);
    }

    async isUsingVPN() {
        // In real app, check IP against VPN databases
        return false;
    }

    async getUserCountry(userId) {
        // In real app, fetch from user profile
        const user = JSON.parse(localStorage.getItem('mpesewa_user') || '{}');
        return user.country || null;
    }

    async getCountryFromCoordinates(lat, lon) {
        // In real app, use reverse geocoding API
        return null;
    }

    async getIPInfo() {
        // In real app, fetch from IP geolocation service
        return null;
    }

    isSuspiciousIP(ip) {
        // In real app, check against blacklists
        return false;
    }

    isHostingIP(ip) {
        // In real app, check against hosting IP ranges
        return false;
    }

    async getAccountAge(userId) {
        // In real app, calculate from account creation date
        return 365; // days
    }

    async isAccountVerified(userId) {
        // In real app, check verification status
        return true;
    }

    async getUserFraudFlags(userId) {
        // In real app, fetch from database
        return [];
    }

    async getLinkedAccounts(userId) {
        // In real app, fetch linked accounts
        return [];
    }

    getActiveUsers() {
        // In real app, get from session management
        const user = JSON.parse(localStorage.getItem('mpesewa_user') || '{}');
        return user.id ? [user.id] : [];
    }

    addToWatchlist(userId, reason) {
        console.log(`Added ${userId} to watchlist: ${reason}`);
        // In real app, add to database
    }

    async requireAdditionalVerification(userId) {
        console.log(`Requiring additional verification for ${userId}`);
        // In real app, trigger verification flow
    }

    async restrictAccountAccess(userId, flags) {
        console.log(`Restricting access for ${userId} due to flags:`, flags);
        // In real app, update user permissions
    }

    async notifySecurityTeam(assessment) {
        console.log('Notifying security team:', assessment);
        // In real app, send notification
    }

    async freezeAccount(userId) {
        console.log(`Freezing account ${userId}`);
        // In real app, update account status
    }

    async notifyUserOfSuspiciousActivity(userId) {
        console.log(`Notifying user ${userId} of suspicious activity`);
        // In real app, send notification
    }

    // Public API

    async checkTransaction(transaction) {
        return await this.assessRisk({
            type: 'transaction',
            userId: transaction.userId,
            amount: transaction.amount,
            recipientId: transaction.recipientId,
            currency: transaction.currency
        });
    }

    async checkLoginAttempt(loginData) {
        return await this.assessRisk({
            type: 'login',
            userId: loginData.userId,
            ipAddress: loginData.ipAddress,
            userAgent: loginData.userAgent
        });
    }

    async checkUserActivity(userId, activityType) {
        return await this.assessRisk({
            type: 'activity',
            userId: userId,
            activityType: activityType
        });
    }

    getRiskHistory(userId) {
        return this.riskScores[userId] || [];
    }

    getCurrentRiskScore(userId) {
        const history = this.getRiskHistory(userId);
        return history.length > 0 ? history[0] : null;
    }

    addFraudFlag(userId, flag) {
        const fraudFlag = {
            id: `fraud_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            userId,
            timestamp: new Date().toISOString(),
            ...flag
        };

        this.fraudFlags.unshift(fraudFlag);
        
        // Keep only last 100 flags
        if (this.fraudFlags.length > 100) {
            this.fraudFlags.pop();
        }

        this.saveFraudFlags();
        return fraudFlag;
    }

    getFraudFlags(userId = null) {
        if (userId) {
            return this.fraudFlags.filter(flag => flag.userId === userId);
        }
        return [...this.fraudFlags];
    }

    clearFraudFlag(flagId) {
        const index = this.fraudFlags.findIndex(flag => flag.id === flagId);
        if (index !== -1) {
            const removed = this.fraudFlags.splice(index, 1)[0];
            this.saveFraudFlags();
            return removed;
        }
        return null;
    }

    getDeviceFingerprint() {
        return this.deviceFingerprint;
    }

    getRiskStatistics() {
        const totalAssessments = Object.values(this.riskScores)
            .reduce((sum, assessments) => sum + assessments.length, 0);
        
        const riskLevels = {
            'critical': 0,
            'high': 0,
            'medium': 0,
            'low': 0,
            'very-low': 0
        };

        Object.values(this.riskScores).forEach(assessments => {
            assessments.forEach(assessment => {
                riskLevels[assessment.riskLevel]++;
            });
        });

        return {
            totalAssessments,
            riskLevels,
            totalUsers: Object.keys(this.riskScores).length,
            fraudFlags: this.fraudFlags.length,
            deviceFingerprint: this.deviceFingerprint
        };
    }
}

// Export singleton instance
const riskCheckFlow = new RiskCheckFlow();
window.RiskCheckFlow = riskCheckFlow;
export default riskCheckFlow;