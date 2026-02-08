// features/device-verification-flow.js
// Device registration & verification orchestration

class DeviceVerificationFlow {
    constructor() {
        this.registeredDevices = [];
        this.pendingVerifications = [];
        this.deviceFingerprint = null;
        this.MAX_DEVICES_PER_USER = 5;
        this.VERIFICATION_TIMEOUT = 300000; // 5 minutes
        this.init();
    }

    init() {
        // Load registered devices
        this.loadRegisteredDevices();
        
        // Load pending verifications
        this.loadPendingVerifications();
        
        // Generate device fingerprint
        this.generateDeviceFingerprint();
        
        // Start cleanup of expired verifications
        this.startCleanupInterval();
        
        console.log('Device Verification Flow initialized');
    }

    // Register a new device
    async registerDevice(userId, deviceInfo = {}) {
        // Check if device is already registered
        const existingDevice = this.findDeviceByFingerprint(this.deviceFingerprint, userId);
        if (existingDevice) {
            // Update last used timestamp
            existingDevice.lastUsed = new Date().toISOString();
            this.saveRegisteredDevices();
            
            return {
                success: true,
                device: existingDevice,
                message: 'Device already registered'
            };
        }

        // Check device limit
        const userDevices = this.getUserDevices(userId);
        if (userDevices.length >= this.MAX_DEVICES_PER_USER) {
            return {
                success: false,
                error: 'DEVICE_LIMIT_EXCEEDED',
                message: `Maximum ${this.MAX_DEVICES_PER_USER} devices allowed per user`
            };
        }

        // Create device record
        const device = {
            id: `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            userId,
            fingerprint: this.deviceFingerprint,
            ...this.collectDeviceInfo(),
            ...deviceInfo,
            registeredAt: new Date().toISOString(),
            lastUsed: new Date().toISOString(),
            verified: false,
            trusted: false,
            status: 'pending_verification'
        };

        // Add to registered devices
        this.registeredDevices.push(device);
        this.saveRegisteredDevices();

        // Start verification process
        const verification = await this.startVerificationProcess(device);

        return {
            success: true,
            device,
            verification,
            message: 'Device registration initiated. Verification required.'
        };
    }

    // Start verification process
    async startVerificationProcess(device) {
        const verification = {
            id: `verify_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            deviceId: device.id,
            userId: device.userId,
            initiatedAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + this.VERIFICATION_TIMEOUT).toISOString(),
            method: 'email', // Default method
            code: this.generateVerificationCode(),
            attempts: 0,
            maxAttempts: 3,
            status: 'pending',
            verifiedAt: null
        };

        // Add to pending verifications
        this.pendingVerifications.push(verification);
        this.savePendingVerifications();

        // Send verification code
        await this.sendVerificationCode(verification);

        // Start expiration timer
        this.startVerificationExpirationTimer(verification);

        return verification;
    }

    // Verify device with code
    async verifyDevice(verificationId, code, method = 'email') {
        const verification = this.pendingVerifications.find(v => 
            v.id === verificationId && v.method === method && v.status === 'pending'
        );

        if (!verification) {
            return {
                success: false,
                error: 'VERIFICATION_NOT_FOUND',
                message: 'Verification not found or expired'
            };
        }

        // Check expiration
        if (new Date(verification.expiresAt) < new Date()) {
            verification.status = 'expired';
            this.savePendingVerifications();
            
            return {
                success: false,
                error: 'VERIFICATION_EXPIRED',
                message: 'Verification code has expired'
            };
        }

        // Check attempts
        if (verification.attempts >= verification.maxAttempts) {
            verification.status = 'max_attempts_exceeded';
            this.savePendingVerifications();
            
            return {
                success: false,
                error: 'MAX_ATTEMPTS_EXCEEDED',
                message: 'Maximum verification attempts exceeded'
            };
        }

        // Increment attempt counter
        verification.attempts++;

        // Verify code
        if (verification.code !== code) {
            this.savePendingVerifications();
            
            return {
                success: false,
                error: 'INVALID_CODE',
                message: 'Invalid verification code',
                attemptsRemaining: verification.maxAttempts - verification.attempts
            };
        }

        // Mark as verified
        verification.status = 'verified';
        verification.verifiedAt = new Date().toISOString();
        
        // Update device status
        const device = this.registeredDevices.find(d => d.id === verification.deviceId);
        if (device) {
            device.verified = true;
            device.trusted = true;
            device.status = 'active';
            device.verifiedAt = verification.verifiedAt;
            
            // If this is the first verified device, mark it as primary
            const userDevices = this.getUserDevices(verification.userId);
            const verifiedDevices = userDevices.filter(d => d.verified);
            if (verifiedDevices.length === 1) {
                device.primary = true;
            }
        }

        // Save changes
        this.saveRegisteredDevices();
        this.savePendingVerifications();

        // Emit verification success event
        this.emitVerificationSuccessEvent(verification, device);

        return {
            success: true,
            verification,
            device,
            message: 'Device verified successfully'
        };
    }

    // Resend verification code
    async resendVerificationCode(verificationId, method = 'email') {
        const verification = this.pendingVerifications.find(v => 
            v.id === verificationId && v.method === method
        );

        if (!verification) {
            return {
                success: false,
                error: 'VERIFICATION_NOT_FOUND',
                message: 'Verification not found'
            };
        }

        // Generate new code
        verification.code = this.generateVerificationCode();
        verification.attempts = 0;
        verification.initiatedAt = new Date().toISOString();
        verification.expiresAt = new Date(Date.now() + this.VERIFICATION_TIMEOUT).toISOString();
        verification.status = 'pending';

        // Send new code
        await this.sendVerificationCode(verification);

        // Save changes
        this.savePendingVerifications();

        return {
            success: true,
            verification,
            message: 'Verification code resent'
        };
    }

    // Send verification code via chosen method
    async sendVerificationCode(verification) {
        const user = await this.getUser(verification.userId);
        if (!user) {
            throw new Error('User not found');
        }

        switch (verification.method) {
            case 'email':
                await this.sendEmailVerification(user, verification);
                break;
            case 'sms':
                await this.sendSMSVerification(user, verification);
                break;
            case 'push':
                await this.sendPushVerification(user, verification);
                break;
            case 'authenticator':
                // For authenticator apps
                break;
            default:
                throw new Error(`Unsupported verification method: ${verification.method}`);
        }

        // Log the sending
        this.logVerificationSent(verification);
    }

    // Mark device as trusted
    async trustDevice(deviceId, trusted = true) {
        const device = this.registeredDevices.find(d => d.id === deviceId);
        
        if (!device) {
            return {
                success: false,
                error: 'DEVICE_NOT_FOUND',
                message: 'Device not found'
            };
        }

        device.trusted = trusted;
        device.trustedAt = trusted ? new Date().toISOString() : null;
        this.saveRegisteredDevices();

        // Emit trust status change event
        this.emitDeviceTrustEvent(device, trusted);

        return {
            success: true,
            device,
            message: `Device ${trusted ? 'trusted' : 'untrusted'}`
        };
    }

    // Set primary device
    async setPrimaryDevice(deviceId) {
        const device = this.registeredDevices.find(d => d.id === deviceId);
        
        if (!device) {
            return {
                success: false,
                error: 'DEVICE_NOT_FOUND',
                message: 'Device not found'
            };
        }

        if (!device.verified) {
            return {
                success: false,
                error: 'DEVICE_NOT_VERIFIED',
                message: 'Device must be verified before setting as primary'
            };
        }

        // Remove primary status from other devices of this user
        this.registeredDevices.forEach(d => {
            if (d.userId === device.userId && d.id !== deviceId) {
                d.primary = false;
            }
        });

        // Set as primary
        device.primary = true;
        this.saveRegisteredDevices();

        // Emit primary device change event
        this.emitPrimaryDeviceEvent(device);

        return {
            success: true,
            device,
            message: 'Primary device set successfully'
        };
    }

    // Remove/delete device
    async removeDevice(deviceId) {
        const deviceIndex = this.registeredDevices.findIndex(d => d.id === deviceId);
        
        if (deviceIndex === -1) {
            return {
                success: false,
                error: 'DEVICE_NOT_FOUND',
                message: 'Device not found'
            };
        }

        const device = this.registeredDevices[deviceIndex];
        
        // Check if this is the last verified device
        const userDevices = this.getUserDevices(device.userId);
        const verifiedDevices = userDevices.filter(d => d.verified && d.id !== deviceId);
        
        if (verifiedDevices.length === 0 && device.verified) {
            return {
                success: false,
                error: 'LAST_VERIFIED_DEVICE',
                message: 'Cannot remove the last verified device'
            };
        }

        // Remove device
        this.registeredDevices.splice(deviceIndex, 1);
        this.saveRegisteredDevices();

        // Clean up pending verifications for this device
        this.cleanupDeviceVerifications(deviceId);

        // Emit device removal event
        this.emitDeviceRemovalEvent(device);

        // If this was the primary device, set a new primary
        if (device.primary && verifiedDevices.length > 0) {
            await this.setPrimaryDevice(verifiedDevices[0].id);
        }

        return {
            success: true,
            device,
            message: 'Device removed successfully'
        };
    }

    // Get device verification status
    getDeviceStatus(deviceId) {
        const device = this.registeredDevices.find(d => d.id === deviceId);
        
        if (!device) {
            return null;
        }

        const pendingVerification = this.pendingVerifications.find(v => 
            v.deviceId === deviceId && v.status === 'pending'
        );

        return {
            device,
            pendingVerification,
            status: device.status,
            verified: device.verified,
            trusted: device.trusted,
            primary: device.primary
        };
    }

    // Check if current device is registered and verified
    async checkCurrentDevice(userId) {
        const fingerprint = this.deviceFingerprint;
        const device = this.findDeviceByFingerprint(fingerprint, userId);

        if (!device) {
            return {
                registered: false,
                verified: false,
                trusted: false,
                primary: false,
                action: 'register'
            };
        }

        return {
            registered: true,
            verified: device.verified,
            trusted: device.trusted,
            primary: device.primary,
            device: device,
            action: device.verified ? 'login' : 'verify'
        };
    }

    // Require device verification for sensitive actions
    async requireDeviceVerification(userId, action) {
        const deviceCheck = await this.checkCurrentDevice(userId);
        
        if (!deviceCheck.registered) {
            return {
                required: true,
                type: 'device_registration',
                message: 'Device registration required for this action'
            };
        }

        if (!deviceCheck.verified) {
            return {
                required: true,
                type: 'device_verification',
                message: 'Device verification required for this action',
                deviceId: deviceCheck.device.id
            };
        }

        if (!deviceCheck.trusted && this.isHighRiskAction(action)) {
            return {
                required: true,
                type: 'additional_verification',
                message: 'Additional verification required for this high-risk action'
            };
        }

        return {
            required: false,
            message: 'Device verification not required'
        };
    }

    // Get all devices for a user
    getUserDevices(userId) {
        return this.registeredDevices
            .filter(device => device.userId === userId)
            .sort((a, b) => new Date(b.lastUsed) - new Date(a.lastUsed));
    }

    // Get pending verifications for a user
    getUserPendingVerifications(userId) {
        return this.pendingVerifications.filter(v => 
            v.userId === userId && v.status === 'pending'
        );
    }

    // Generate device fingerprint
    generateDeviceFingerprint() {
        if (this.deviceFingerprint) {
            return this.deviceFingerprint;
        }

        const components = [];

        // Browser and OS information
        components.push(navigator.userAgent);
        components.push(navigator.platform);
        components.push(navigator.language);
        components.push(navigator.hardwareConcurrency || 'unknown');

        // Screen information
        components.push(`${screen.width}x${screen.height}`);
        components.push(screen.colorDepth);
        components.push(screen.pixelDepth);

        // Timezone
        components.push(new Date().getTimezoneOffset());

        // Browser capabilities
        components.push(!!navigator.cookieEnabled);
        components.push(!!window.localStorage);
        components.push(!!window.sessionStorage);
        components.push(!!window.indexedDB);

        // Canvas fingerprinting (simplified)
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            ctx.textBaseline = 'top';
            ctx.font = '14px Arial';
            ctx.fillText('M-Pesewa Device Fingerprint', 2, 2);
            components.push(canvas.toDataURL().substring(22, 40)); // Part of the data URL
        } catch (e) {
            components.push('canvas_unavailable');
        }

        // Generate hash
        const fingerprintString = components.join('|');
        this.deviceFingerprint = this.hashString(fingerprintString);

        return this.deviceFingerprint;
    }

    // Collect detailed device information
    collectDeviceInfo() {
        return {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            languages: navigator.languages ? navigator.languages.join(',') : 'unknown',
            screenResolution: `${screen.width}x${screen.height}`,
            colorDepth: screen.colorDepth,
            pixelDepth: screen.pixelDepth,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            timezoneOffset: new Date().getTimezoneOffset(),
            cookiesEnabled: !!navigator.cookieEnabled,
            localStorage: !!window.localStorage,
            sessionStorage: !!window.sessionStorage,
            indexedDB: !!window.indexedDB,
            hardwareConcurrency: navigator.hardwareConcurrency || 'unknown',
            maxTouchPoints: navigator.maxTouchPoints || 0,
            deviceMemory: navigator.deviceMemory || 'unknown',
            connection: this.getConnectionInfo(),
            doNotTrack: navigator.doNotTrack || 'unknown',
            vendor: navigator.vendor || 'unknown',
            product: navigator.product || 'unknown',
            productSub: navigator.productSub || 'unknown'
        };
    }

    // Get connection information
    getConnectionInfo() {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        
        if (!connection) {
            return 'unknown';
        }

        return {
            type: connection.type || 'unknown',
            effectiveType: connection.effectiveType || 'unknown',
            downlink: connection.downlink || 'unknown',
            rtt: connection.rtt || 'unknown',
            saveData: connection.saveData || false
        };
    }

    // Generate verification code
    generateVerificationCode() {
        // Generate 6-digit code
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    // Find device by fingerprint
    findDeviceByFingerprint(fingerprint, userId) {
        return this.registeredDevices.find(device => 
            device.fingerprint === fingerprint && device.userId === userId
        );
    }

    // Hash string
    hashString(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString(36);
    }

    // Check if action is high risk
    isHighRiskAction(action) {
        const highRiskActions = [
            'change_password',
            'change_email',
            'change_phone',
            'update_banking_details',
            'large_transfer',
            'delete_account',
            'update_security_settings'
        ];

        return highRiskActions.includes(action);
    }

    // Cleanup expired verifications
    cleanupExpiredVerifications() {
        const now = new Date();
        let cleaned = 0;

        this.pendingVerifications = this.pendingVerifications.filter(verification => {
            if (verification.status === 'pending' && new Date(verification.expiresAt) < now) {
                verification.status = 'expired';
                cleaned++;
            }
            return verification.status !== 'expired';
        });

        if (cleaned > 0) {
            this.savePendingVerifications();
            console.log(`Cleaned up ${cleaned} expired verifications`);
        }
    }

    // Cleanup device verifications
    cleanupDeviceVerifications(deviceId) {
        this.pendingVerifications = this.pendingVerifications.filter(v => 
            v.deviceId !== deviceId
        );
        this.savePendingVerifications();
    }

    // Start cleanup interval
    startCleanupInterval() {
        // Clean up every minute
        setInterval(() => {
            this.cleanupExpiredVerifications();
        }, 60000);
    }

    // Start verification expiration timer
    startVerificationExpirationTimer(verification) {
        setTimeout(() => {
            const currentVerification = this.pendingVerifications.find(v => v.id === verification.id);
            if (currentVerification && currentVerification.status === 'pending') {
                currentVerification.status = 'expired';
                this.savePendingVerifications();
                
                // Emit expiration event
                this.emitVerificationExpiredEvent(currentVerification);
            }
        }, this.VERIFICATION_TIMEOUT);
    }

    // Save methods
    saveRegisteredDevices() {
        localStorage.setItem('mpesewa_registered_devices', JSON.stringify(this.registeredDevices));
    }

    savePendingVerifications() {
        localStorage.setItem('mpesewa_pending_verifications', JSON.stringify(this.pendingVerifications));
    }

    loadRegisteredDevices() {
        try {
            const stored = localStorage.getItem('mpesewa_registered_devices');
            if (stored) {
                this.registeredDevices = JSON.parse(stored);
            }
        } catch (error) {
            console.error('Failed to load registered devices:', error);
            this.registeredDevices = [];
        }
    }

    loadPendingVerifications() {
        try {
            const stored = localStorage.getItem('mpesewa_pending_verifications');
            if (stored) {
                this.pendingVerifications = JSON.parse(stored);
            }
        } catch (error) {
            console.error('Failed to load pending verifications:', error);
            this.pendingVerifications = [];
        }
    }

    // Log verification sent
    logVerificationSent(verification) {
        console.log(`Verification code sent via ${verification.method} to user ${verification.userId}`);
        
        // In real app, log to audit trail
        const logEntry = {
            id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type: 'verification_sent',
            userId: verification.userId,
            deviceId: verification.deviceId,
            method: verification.method,
            timestamp: new Date().toISOString()
        };

        // Store log (in real app, send to server)
        const logs = JSON.parse(localStorage.getItem('mpesewa_verification_logs') || '[]');
        logs.push(logEntry);
        localStorage.setItem('mpesewa_verification_logs', JSON.stringify(logs));
    }

    // Event emission methods
    emitVerificationSuccessEvent(verification, device) {
        const event = new CustomEvent('device-verified', {
            detail: { verification, device }
        });
        window.dispatchEvent(event);
    }

    emitVerificationExpiredEvent(verification) {
        const event = new CustomEvent('verification-expired', {
            detail: { verification }
        });
        window.dispatchEvent(event);
    }

    emitDeviceTrustEvent(device, trusted) {
        const event = new CustomEvent('device-trust-changed', {
            detail: { device, trusted }
        });
        window.dispatchEvent(event);
    }

    emitPrimaryDeviceEvent(device) {
        const event = new CustomEvent('primary-device-changed', {
            detail: { device }
        });
        window.dispatchEvent(event);
    }

    emitDeviceRemovalEvent(device) {
        const event = new CustomEvent('device-removed', {
            detail: { device }
        });
        window.dispatchEvent(event);
    }

    // Stub methods for demo purposes
    async getUser(userId) {
        // In real app, fetch from server
        const user = JSON.parse(localStorage.getItem('mpesewa_user') || '{}');
        return user.id === userId ? user : null;
    }

    async sendEmailVerification(user, verification) {
        console.log(`Sending email verification to ${user.email}: ${verification.code}`);
        // In real app, send email via your email service
    }

    async sendSMSVerification(user, verification) {
        console.log(`Sending SMS verification to ${user.phone}: ${verification.code}`);
        // In real app, send SMS via your SMS gateway
    }

    async sendPushVerification(user, verification) {
        console.log(`Sending push verification: ${verification.code}`);
        // In real app, send push notification
    }

    // Public API
    getCurrentDeviceFingerprint() {
        return this.deviceFingerprint;
    }

    getRegisteredDevices() {
        return [...this.registeredDevices];
    }

    getPendingVerifications() {
        return [...this.pendingVerifications];
    }

    getDeviceVerificationStats() {
        const totalDevices = this.registeredDevices.length;
        const verifiedDevices = this.registeredDevices.filter(d => d.verified).length;
        const trustedDevices = this.registeredDevices.filter(d => d.trusted).length;
        const primaryDevices = this.registeredDevices.filter(d => d.primary).length;
        const pendingVerifications = this.pendingVerifications.filter(v => v.status === 'pending').length;

        return {
            totalDevices,
            verifiedDevices,
            trustedDevices,
            primaryDevices,
            pendingVerifications,
            verificationRate: totalDevices > 0 ? (verifiedDevices / totalDevices * 100).toFixed(1) + '%' : '0%'
        };
    }

    clearAllDevices(userId = null) {
        if (userId) {
            this.registeredDevices = this.registeredDevices.filter(d => d.userId !== userId);
            this.pendingVerifications = this.pendingVerifications.filter(v => v.userId !== userId);
        } else {
            this.registeredDevices = [];
            this.pendingVerifications = [];
        }
        
        this.saveRegisteredDevices();
        this.savePendingVerifications();
        
        return {
            success: true,
            message: userId ? `All devices cleared for user ${userId}` : 'All devices cleared'
        };
    }

    exportDeviceData(userId) {
        const userDevices = this.getUserDevices(userId);
        const userVerifications = this.getUserPendingVerifications(userId);
        
        const exportData = {
            exportDate: new Date().toISOString(),
            userId,
            devices: userDevices,
            pendingVerifications: userVerifications,
            currentFingerprint: this.deviceFingerprint
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        return {
            url,
            filename: `device-data_${userId}_${new Date().toISOString().split('T')[0]}.json`,
            type: 'application/json'
        };
    }
}

// Export singleton instance
const deviceVerificationFlow = new DeviceVerificationFlow();
window.DeviceVerificationFlow = deviceVerificationFlow;
export default deviceVerificationFlow;