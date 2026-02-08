// features/user-profile-flow.js
// Profile updates, security changes, privacy settings

class UserProfileFlow {
    constructor() {
        this.currentUser = null;
        this.userPreferences = {};
        this.securitySettings = {};
        this.profileHistory = [];
        this.MAX_HISTORY_SIZE = 100;
        this.init();
    }

    init() {
        // Load current user
        this.loadCurrentUser();
        
        // Load user preferences
        this.loadUserPreferences();
        
        // Load security settings
        this.loadSecuritySettings();
        
        // Load profile history
        this.loadProfileHistory();
        
        // Set up periodic sync
        this.setupPeriodicSync();
        
        console.log('User Profile Flow initialized');
    }

    // Load current user from localStorage
    loadCurrentUser() {
        try {
            const userData = localStorage.getItem('mpesewa_user');
            if (userData) {
                this.currentUser = JSON.parse(userData);
            }
        } catch (error) {
            console.error('Failed to load user data:', error);
            this.currentUser = null;
        }
    }

    // Load user preferences
    loadUserPreferences() {
        try {
            const prefs = localStorage.getItem('mpesewa_user_preferences');
            if (prefs) {
                this.userPreferences = JSON.parse(prefs);
            } else {
                this.userPreferences = this.getDefaultPreferences();
                this.saveUserPreferences();
            }
        } catch (error) {
            console.error('Failed to load user preferences:', error);
            this.userPreferences = this.getDefaultPreferences();
        }
    }

    // Load security settings
    loadSecuritySettings() {
        try {
            const security = localStorage.getItem('mpesewa_security_settings');
            if (security) {
                this.securitySettings = JSON.parse(security);
            } else {
                this.securitySettings = this.getDefaultSecuritySettings();
                this.saveSecuritySettings();
            }
        } catch (error) {
            console.error('Failed to load security settings:', error);
            this.securitySettings = this.getDefaultSecuritySettings();
        }
    }

    // Load profile history
    loadProfileHistory() {
        try {
            const history = localStorage.getItem('mpesewa_profile_history');
            if (history) {
                this.profileHistory = JSON.parse(history);
            }
        } catch (error) {
            console.error('Failed to load profile history:', error);
            this.profileHistory = [];
        }
    }

    // Get default user preferences
    getDefaultPreferences() {
        return {
            notifications: {
                loanRequests: true,
                loanUpdates: true,
                repayments: true,
                subscriptions: true,
                blacklist: true,
                group: true,
                marketing: false,
                pushEnabled: true,
                emailEnabled: true,
                smsEnabled: false
            },
            display: {
                theme: 'light',
                language: 'en',
                currency: 'KES',
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                dateFormat: 'DD/MM/YYYY',
                compactMode: false
            },
            privacy: {
                profileVisible: true,
                lendingActivity: true,
                borrowingActivity: false,
                groupMembership: true,
                contactInfo: 'group-only'
            },
            security: {
                twoFactorEnabled: false,
                loginAlerts: true,
                deviceAlerts: true,
                sessionTimeout: 30, // minutes
                requirePasswordChange: 90 // days
            }
        };
    }

    // Get default security settings
    getDefaultSecuritySettings() {
        return {
            loginHistory: [],
            trustedDevices: [],
            securityQuestions: [],
            lastPasswordChange: null,
            failedLoginAttempts: 0,
            accountLocked: false,
            lockUntil: null
        };
    }

    // Update user profile
    async updateProfile(updates) {
        if (!this.currentUser) {
            throw new Error('No user logged in');
        }

        // Create history entry before update
        const historyEntry = this.createHistoryEntry('profile_update', {
            before: { ...this.currentUser },
            updates
        });

        // Apply updates
        const updatedUser = {
            ...this.currentUser,
            ...updates,
            updatedAt: new Date().toISOString()
        };

        // Validate updates
        const validation = this.validateProfileUpdate(updatedUser);
        if (!validation.valid) {
            throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
        }

        // Update locally
        this.currentUser = updatedUser;
        localStorage.setItem('mpesewa_user', JSON.stringify(updatedUser));

        // Add to history
        this.addToProfileHistory(historyEntry);

        // Sync with server (in a real app)
        await this.syncProfileUpdate(updatedUser);

        // Emit update event
        this.emitProfileUpdateEvent(updatedUser);

        return {
            success: true,
            user: updatedUser,
            message: 'Profile updated successfully'
        };
    }

    // Update user preferences
    updatePreferences(category, updates) {
        if (!this.currentUser) {
            throw new Error('No user logged in');
        }

        // Create history entry
        const historyEntry = this.createHistoryEntry('preferences_update', {
            category,
            before: { ...this.userPreferences[category] },
            updates
        });

        // Update preferences
        this.userPreferences = {
            ...this.userPreferences,
            [category]: {
                ...this.userPreferences[category],
                ...updates
            }
        };

        // Save preferences
        this.saveUserPreferences();

        // Add to history
        this.addToProfileHistory(historyEntry);

        // Emit preferences update event
        this.emitPreferencesUpdateEvent(category, updates);

        return {
            success: true,
            preferences: this.userPreferences[category]
        };
    }

    // Update security settings
    updateSecuritySettings(updates) {
        if (!this.currentUser) {
            throw new Error('No user logged in');
        }

        // Create history entry
        const historyEntry = this.createHistoryEntry('security_update', {
            before: { ...this.securitySettings },
            updates
        });

        // Update security settings
        this.securitySettings = {
            ...this.securitySettings,
            ...updates,
            updatedAt: new Date().toISOString()
        };

        // Save security settings
        this.saveSecuritySettings();

        // Add to history
        this.addToProfileHistory(historyEntry);

        // If enabling 2FA, set it up
        if (updates.twoFactorEnabled) {
            this.setupTwoFactorAuthentication();
        }

        // Emit security update event
        this.emitSecurityUpdateEvent(updates);

        return {
            success: true,
            security: this.securitySettings
        };
    }

    // Change password
    async changePassword(currentPassword, newPassword, confirmPassword) {
        if (!this.currentUser) {
            throw new Error('No user logged in');
        }

        // Validate passwords match
        if (newPassword !== confirmPassword) {
            throw new Error('New passwords do not match');
        }

        // Validate password strength
        const passwordValidation = this.validatePasswordStrength(newPassword);
        if (!passwordValidation.valid) {
            throw new Error(`Password too weak: ${passwordValidation.errors.join(', ')}`);
        }

        // Verify current password (in a real app, this would be verified with the server)
        const isCurrentValid = await this.verifyCurrentPassword(currentPassword);
        if (!isCurrentValid) {
            // Track failed attempt
            this.trackFailedPasswordAttempt();
            throw new Error('Current password is incorrect');
        }

        // Create history entry
        const historyEntry = this.createHistoryEntry('password_change', {
            changedAt: new Date().toISOString()
        });

        // Update password (in a real app, this would be sent to server)
        const passwordUpdated = await this.updatePasswordOnServer(newPassword);
        
        if (!passwordUpdated) {
            throw new Error('Failed to update password on server');
        }

        // Update security settings
        this.securitySettings.lastPasswordChange = new Date().toISOString();
        this.securitySettings.failedLoginAttempts = 0;
        this.saveSecuritySettings();

        // Add to history
        this.addToProfileHistory(historyEntry);

        // Emit password change event
        this.emitPasswordChangeEvent();

        return {
            success: true,
            message: 'Password changed successfully'
        };
    }

    // Update contact information
    async updateContactInfo(contactUpdates) {
        if (!this.currentUser) {
            throw new Error('No user logged in');
        }

        // Validate contact info
        const validation = this.validateContactInfo(contactUpdates);
        if (!validation.valid) {
            throw new Error(`Invalid contact info: ${validation.errors.join(', ')}`);
        }

        // Create history entry
        const historyEntry = this.createHistoryEntry('contact_update', {
            before: { ...this.currentUser.contactInfo },
            updates: contactUpdates
        });

        // Update contact info
        const updatedUser = {
            ...this.currentUser,
            contactInfo: {
                ...this.currentUser.contactInfo,
                ...contactUpdates
            },
            updatedAt: new Date().toISOString()
        };

        // Update locally
        this.currentUser = updatedUser;
        localStorage.setItem('mpesewa_user', JSON.stringify(updatedUser));

        // Add to history
        this.addToProfileHistory(historyEntry);

        // Sync with server
        await this.syncContactInfoUpdate(updatedUser);

        // Emit contact update event
        this.emitContactUpdateEvent(contactUpdates);

        return {
            success: true,
            contactInfo: updatedUser.contactInfo
        };
    }

    // Update role (Borrower/Lender)
    async updateRole(newRole, additionalInfo = {}) {
        if (!this.currentUser) {
            throw new Error('No user logged in');
        }

        // Validate role change
        const validation = this.validateRoleChange(newRole);
        if (!validation.valid) {
            throw new Error(`Cannot change role: ${validation.errors.join(', ')}`);
        }

        // Create history entry
        const historyEntry = this.createHistoryEntry('role_change', {
            before: this.currentUser.role,
            after: newRole,
            additionalInfo
        });

        // Update role
        const updatedUser = {
            ...this.currentUser,
            role: newRole,
            roleUpdatedAt: new Date().toISOString(),
            ...additionalInfo
        };

        // Update locally
        this.currentUser = updatedUser;
        localStorage.setItem('mpesewa_user', JSON.stringify(updatedUser));

        // Add to history
        this.addToProfileHistory(historyEntry);

        // Sync with server
        await this.syncRoleUpdate(updatedUser);

        // Emit role change event
        this.emitRoleChangeEvent(newRole, additionalInfo);

        // Update UI based on new role
        this.updateUIBasedOnRole(newRole);

        return {
            success: true,
            user: updatedUser,
            message: `Role changed to ${newRole}`
        };
    }

    // Update country (with restrictions)
    async updateCountry(newCountry) {
        if (!this.currentUser) {
            throw new Error('No user logged in');
        }

        // Check if country change is allowed
        if (!this.canChangeCountry()) {
            throw new Error('Country change not allowed. Please contact support.');
        }

        // Validate country
        if (!this.isValidCountry(newCountry)) {
            throw new Error('Invalid country selected');
        }

        // Create history entry
        const historyEntry = this.createHistoryEntry('country_change', {
            before: this.currentUser.country,
            after: newCountry
        });

        // Update country
        const updatedUser = {
            ...this.currentUser,
            country: newCountry,
            countryUpdatedAt: new Date().toISOString()
        };

        // Update locally
        this.currentUser = updatedUser;
        localStorage.setItem('mpesewa_user', JSON.stringify(updatedUser));

        // Update localStorage country setting
        localStorage.setItem('mpesewa_country', newCountry);

        // Add to history
        this.addToProfileHistory(historyEntry);

        // Sync with server
        await this.syncCountryUpdate(updatedUser);

        // Emit country change event
        this.emitCountryChangeEvent(newCountry);

        // Reload country-specific data
        this.loadCountrySpecificData(newCountry);

        return {
            success: true,
            user: updatedUser,
            message: `Country changed to ${newCountry}`
        };
    }

    // Add trusted device
    addTrustedDevice(deviceInfo) {
        if (!this.currentUser) {
            throw new Error('No user logged in');
        }

        const device = {
            id: `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            ...deviceInfo,
            addedAt: new Date().toISOString(),
            lastUsed: new Date().toISOString(),
            trusted: true
        };

        // Add to security settings
        this.securitySettings.trustedDevices.push(device);
        
        // Keep only last 10 devices
        if (this.securitySettings.trustedDevices.length > 10) {
            this.securitySettings.trustedDevices.shift();
        }

        this.saveSecuritySettings();

        return device;
    }

    // Remove trusted device
    removeTrustedDevice(deviceId) {
        const index = this.securitySettings.trustedDevices.findIndex(d => d.id === deviceId);
        if (index !== -1) {
            const removed = this.securitySettings.trustedDevices.splice(index, 1)[0];
            this.saveSecuritySettings();
            return removed;
        }
        return null;
    }

    // Get user statistics
    getUserStatistics() {
        if (!this.currentUser) {
            return null;
        }

        const user = this.currentUser;
        
        return {
            basic: {
                memberSince: this.formatDate(user.createdAt),
                lastActive: this.formatDate(user.lastLogin),
                profileCompletion: this.calculateProfileCompletion(),
                verificationStatus: user.verified ? 'Verified' : 'Not Verified'
            },
            activity: {
                totalLogins: this.securitySettings.loginHistory.length,
                trustedDevices: this.securitySettings.trustedDevices.length,
                failedAttempts: this.securitySettings.failedLoginAttempts
            },
            preferences: {
                notificationChannels: Object.keys(this.userPreferences.notifications)
                    .filter(k => this.userPreferences.notifications[k])
                    .length,
                securityFeatures: Object.keys(this.userPreferences.security)
                    .filter(k => this.userPreferences.security[k])
                    .length
            },
            history: {
                totalChanges: this.profileHistory.length,
                lastChange: this.profileHistory[0] ? 
                    this.formatDate(this.profileHistory[0].timestamp) : 'Never'
            }
        };
    }

    // Export user data
    exportUserData() {
        if (!this.currentUser) {
            throw new Error('No user logged in');
        }

        const exportData = {
            exportDate: new Date().toISOString(),
            user: {
                ...this.currentUser,
                password: undefined, // Never include password
                securityCode: undefined
            },
            preferences: this.userPreferences,
            security: {
                ...this.securitySettings,
                trustedDevices: this.securitySettings.trustedDevices.map(d => ({
                    ...d,
                    ipAddress: undefined // Remove sensitive info
                }))
            },
            history: this.profileHistory,
            statistics: this.getUserStatistics()
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        return {
            url,
            filename: `m-pesewa-data_${this.currentUser.username}_${new Date().toISOString().split('T')[0]}.json`,
            type: 'application/json'
        };
    }

    // Delete account
    async deleteAccount(confirmation) {
        if (!this.currentUser) {
            throw new Error('No user logged in');
        }

        if (confirmation !== 'DELETE MY ACCOUNT') {
            throw new Error('Confirmation text does not match');
        }

        // Create history entry
        const historyEntry = this.createHistoryEntry('account_deletion_request', {
            requestedAt: new Date().toISOString()
        });

        // Add to history
        this.addToProfileHistory(historyEntry);

        // In a real app, this would send a deletion request to the server
        const deletionRequested = await this.requestAccountDeletion();

        if (!deletionRequested) {
            throw new Error('Failed to request account deletion');
        }

        // Clear local data
        this.clearLocalUserData();

        // Emit account deletion event
        this.emitAccountDeletionEvent();

        return {
            success: true,
            message: 'Account deletion requested. You will be logged out.'
        };
    }

    // Helper methods

    // Create history entry
    createHistoryEntry(action, details) {
        return {
            id: `history_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            action,
            userId: this.currentUser?.id,
            timestamp: new Date().toISOString(),
            details,
            ipAddress: this.getClientIP(),
            userAgent: navigator.userAgent
        };
    }

    // Add to profile history
    addToProfileHistory(entry) {
        this.profileHistory.unshift(entry);
        
        // Trim if too large
        if (this.profileHistory.length > this.MAX_HISTORY_SIZE) {
            this.profileHistory = this.profileHistory.slice(0, this.MAX_HISTORY_SIZE);
        }
        
        this.saveProfileHistory();
    }

    // Validate profile update
    validateProfileUpdate(user) {
        const errors = [];
        
        // Required fields
        if (!user.fullName?.trim()) {
            errors.push('Full name is required');
        }
        
        if (!user.username?.trim()) {
            errors.push('Username is required');
        }
        
        if (!user.email?.trim()) {
            errors.push('Email is required');
        } else if (!this.isValidEmail(user.email)) {
            errors.push('Invalid email format');
        }
        
        if (!user.phone?.trim()) {
            errors.push('Phone number is required');
        }
        
        // Country validation
        if (!user.country) {
            errors.push('Country is required');
        }
        
        return {
            valid: errors.length === 0,
            errors
        };
    }

    // Validate password strength
    validatePasswordStrength(password) {
        const errors = [];
        const requirements = {
            minLength: 8,
            maxLength: 20,
            requireUppercase: true,
            requireLowercase: true,
            requireNumbers: true,
            requireSpecial: true
        };
        
        if (password.length < requirements.minLength) {
            errors.push(`Minimum ${requirements.minLength} characters`);
        }
        
        if (password.length > requirements.maxLength) {
            errors.push(`Maximum ${requirements.maxLength} characters`);
        }
        
        if (requirements.requireUppercase && !/[A-Z]/.test(password)) {
            errors.push('At least one uppercase letter');
        }
        
        if (requirements.requireLowercase && !/[a-z]/.test(password)) {
            errors.push('At least one lowercase letter');
        }
        
        if (requirements.requireNumbers && !/\d/.test(password)) {
            errors.push('At least one number');
        }
        
        if (requirements.requireSpecial && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            errors.push('At least one special character');
        }
        
        return {
            valid: errors.length === 0,
            errors
        };
    }

    // Validate contact info
    validateContactInfo(contactInfo) {
        const errors = [];
        
        if (contactInfo.email && !this.isValidEmail(contactInfo.email)) {
            errors.push('Invalid email format');
        }
        
        if (contactInfo.phone && !this.isValidPhone(contactInfo.phone)) {
            errors.push('Invalid phone format');
        }
        
        return {
            valid: errors.length === 0,
            errors
        };
    }

    // Validate role change
    validateRoleChange(newRole) {
        const errors = [];
        const currentRole = this.currentUser?.role;
        
        // Check if role change is allowed
        if (currentRole === newRole) {
            errors.push('Already has this role');
        }
        
        // Additional validation logic here
        
        return {
            valid: errors.length === 0,
            errors
        };
    }

    // Utility methods

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPhone(phone) {
        // Basic phone validation - adjust based on country
        const phoneRegex = /^[\d\s\-\+\(\)]{10,20}$/;
        return phoneRegex.test(phone);
    }

    isValidCountry(country) {
        const validCountries = [
            'Kenya', 'Uganda', 'Tanzania', 'Rwanda', 'Burundi', 'DRC',
            'South Sudan', 'South Africa', 'Nigeria', 'Ghana', 'Ethiopia'
        ];
        return validCountries.includes(country);
    }

    canChangeCountry() {
        // In M-Pesewa, country changes are restricted
        // Typically only allowed before joining groups or with admin approval
        const user = this.currentUser;
        
        if (!user) return false;
        
        // Check if user has any active loans or groups
        const hasActiveLoans = false; // Would check from ledger data
        const hasGroups = user.groups && user.groups.length > 0;
        
        return !hasActiveLoans && !hasGroups;
    }

    formatDate(dateString) {
        if (!dateString) return 'Never';
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    }

    calculateProfileCompletion() {
        if (!this.currentUser) return 0;
        
        const user = this.currentUser;
        const fields = [
            'fullName',
            'username',
            'email',
            'phone',
            'country',
            'nationalId',
            'location'
        ];
        
        const completed = fields.filter(field => 
            user[field] && user[field].toString().trim()
        ).length;
        
        return Math.round((completed / fields.length) * 100);
    }

    getClientIP() {
        // Simplified - in real app, get from server
        return 'client-ip';
    }

    // Save methods

    saveUserPreferences() {
        localStorage.setItem('mpesewa_user_preferences', JSON.stringify(this.userPreferences));
    }

    saveSecuritySettings() {
        localStorage.setItem('mpesewa_security_settings', JSON.stringify(this.securitySettings));
    }

    saveProfileHistory() {
        localStorage.setItem('mpesewa_profile_history', JSON.stringify(this.profileHistory));
    }

    clearLocalUserData() {
        localStorage.removeItem('mpesewa_user');
        localStorage.removeItem('mpesewa_user_preferences');
        localStorage.removeItem('mpesewa_security_settings');
        localStorage.removeItem('mpesewa_profile_history');
        
        this.currentUser = null;
        this.userPreferences = {};
        this.securitySettings = {};
        this.profileHistory = [];
    }

    // Setup methods

    setupPeriodicSync() {
        // Sync every 5 minutes
        setInterval(() => {
            this.syncWithServer();
        }, 5 * 60 * 1000);
    }

    // Event emission methods

    emitProfileUpdateEvent(user) {
        const event = new CustomEvent('profile-updated', { detail: user });
        window.dispatchEvent(event);
    }

    emitPreferencesUpdateEvent(category, updates) {
        const event = new CustomEvent('preferences-updated', { 
            detail: { category, updates } 
        });
        window.dispatchEvent(event);
    }

    emitSecurityUpdateEvent(updates) {
        const event = new CustomEvent('security-updated', { detail: updates });
        window.dispatchEvent(event);
    }

    emitPasswordChangeEvent() {
        const event = new CustomEvent('password-changed');
        window.dispatchEvent(event);
    }

    emitContactUpdateEvent(updates) {
        const event = new CustomEvent('contact-updated', { detail: updates });
        window.dispatchEvent(event);
    }

    emitRoleChangeEvent(newRole, additionalInfo) {
        const event = new CustomEvent('role-changed', { 
            detail: { newRole, additionalInfo } 
        });
        window.dispatchEvent(event);
    }

    emitCountryChangeEvent(newCountry) {
        const event = new CustomEvent('country-changed', { detail: newCountry });
        window.dispatchEvent(event);
    }

    emitAccountDeletionEvent() {
        const event = new CustomEvent('account-deletion-requested');
        window.dispatchEvent(event);
    }

    // Update UI based on role
    updateUIBasedOnRole(role) {
        // Update navigation, dashboard, etc.
        console.log(`UI updated for role: ${role}`);
    }

    // Load country-specific data
    loadCountrySpecificData(country) {
        console.log(`Loading data for country: ${country}`);
        // Load currency, regulations, groups, etc.
    }

    // Server sync methods (stubs for now)

    async syncProfileUpdate(user) {
        // In real app, sync with backend
        console.log('Syncing profile update with server:', user);
        return true;
    }

    async syncContactInfoUpdate(user) {
        console.log('Syncing contact info with server:', user);
        return true;
    }

    async syncRoleUpdate(user) {
        console.log('Syncing role update with server:', user);
        return true;
    }

    async syncCountryUpdate(user) {
        console.log('Syncing country update with server:', user);
        return true;
    }

    async syncWithServer() {
        console.log('Periodic sync with server');
        return true;
    }

    async verifyCurrentPassword(password) {
        // In real app, verify with server
        console.log('Verifying current password');
        return true; // Stub
    }

    async updatePasswordOnServer(newPassword) {
        // In real app, update on server
        console.log('Updating password on server');
        return true; // Stub
    }

    async requestAccountDeletion() {
        // In real app, send deletion request to server
        console.log('Requesting account deletion from server');
        return true; // Stub
    }

    setupTwoFactorAuthentication() {
        console.log('Setting up two-factor authentication');
        // Generate QR code, send setup instructions, etc.
    }

    trackFailedPasswordAttempt() {
        this.securitySettings.failedLoginAttempts++;
        
        // Lock account after 5 failed attempts
        if (this.securitySettings.failedLoginAttempts >= 5) {
            this.securitySettings.accountLocked = true;
            this.securitySettings.lockUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
        }
        
        this.saveSecuritySettings();
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Get user preferences
    getUserPreferences() {
        return this.userPreferences;
    }

    // Get security settings
    getSecuritySettings() {
        return this.securitySettings;
    }

    // Get profile history
    getProfileHistory() {
        return [...this.profileHistory];
    }
}

// Export singleton instance
const userProfileFlow = new UserProfileFlow();
window.UserProfileFlow = userProfileFlow;
export default userProfileFlow;