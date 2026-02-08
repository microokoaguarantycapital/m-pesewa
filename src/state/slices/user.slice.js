/**
 * M-Pesewa User Slice
 * User profile management and personal data
 * Strict privacy and data management rules
 */

class UserSlice {
    constructor() {
        this.state = {
            profile: null,
            preferences: {},
            security: {},
            devices: [],
            activity: [],
            documents: [],
            contacts: [],
            privacySettings: {},
            loading: false,
            error: null
        };

        this.init();
    }

    init() {
        this.loadUserProfile();
        this.loadUserPreferences();
        this.loadSecuritySettings();
        this.loadUserActivity();
        this.loadRegisteredDevices();
        this.loadDocuments();
        this.loadContacts();
        this.loadPrivacySettings();
    }

    // STRICT RULE: Load user profile from storage
    loadUserProfile() {
        try {
            const savedProfile = localStorage.getItem('mpesewa_user_profile');
            if (savedProfile) {
                const profile = JSON.parse(savedProfile);
                this.setState({ profile });
            }
        } catch (error) {
            console.error('Failed to load user profile:', error);
        }
    }

    // STRICT RULE: Save user profile to storage
    saveUserProfile() {
        if (this.state.profile) {
            localStorage.setItem('mpesewa_user_profile', JSON.stringify(this.state.profile));
        }
    }

    // STRICT RULE: Update user profile with validation
    async updateProfile(updates) {
        this.setState({ loading: true, error: null });
        
        try {
            // Validate updates
            const validation = this.validateProfileUpdates(updates);
            if (!validation.valid) {
                throw new Error(validation.errors.join(', '));
            }

            // Check if username change requires verification
            if (updates.username && updates.username !== this.state.profile?.username) {
                const usernameAvailable = await this.checkUsernameAvailability(updates.username);
                if (!usernameAvailable) {
                    throw new Error('Username already taken');
                }
            }

            // Check if email change requires verification
            if (updates.email && updates.email !== this.state.profile?.email) {
                const emailAvailable = await this.checkEmailAvailability(updates.email);
                if (!emailAvailable) {
                    throw new Error('Email already registered');
                }
                updates.emailVerified = false;
            }

            // Check if phone change requires verification
            if (updates.phoneNumber && updates.phoneNumber !== this.state.profile?.phoneNumber) {
                const phoneAvailable = await this.checkPhoneAvailability(updates.phoneNumber);
                if (!phoneAvailable) {
                    throw new Error('Phone number already registered');
                }
                updates.phoneVerified = false;
            }

            // Apply updates
            const updatedProfile = {
                ...this.state.profile,
                ...updates,
                updatedAt: new Date().toISOString()
            };

            this.setState({
                profile: updatedProfile,
                loading: false
            });

            this.saveUserProfile();
            this.logActivity('profile_update', 'Profile updated successfully');

            return {
                success: true,
                profile: updatedProfile,
                message: 'Profile updated successfully'
            };

        } catch (error) {
            this.setState({
                loading: false,
                error: error.message
            });
            
            return {
                success: false,
                error: error.message
            };
        }
    }

    // STRICT RULE: Validate profile updates
    validateProfileUpdates(updates) {
        const errors = [];

        // Full name validation
        if (updates.fullName) {
            if (updates.fullName.length < 2) {
                errors.push('Full name must be at least 2 characters');
            }
            if (updates.fullName.length > 100) {
                errors.push('Full name must be less than 100 characters');
            }
        }

        // Email validation
        if (updates.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(updates.email)) {
                errors.push('Invalid email format');
            }
        }

        // Phone number validation
        if (updates.phoneNumber) {
            const phoneRegex = /^\+[1-9]\d{1,14}$/;
            if (!phoneRegex.test(updates.phoneNumber)) {
                errors.push('Phone number must be in international format (e.g., +254700000000)');
            }
        }

        // National ID validation
        if (updates.nationalId) {
            if (updates.nationalId.length < 5 || updates.nationalId.length > 20) {
                errors.push('National ID must be between 5 and 20 characters');
            }
        }

        // Location validation
        if (updates.location) {
            if (updates.location.length < 3) {
                errors.push('Location must be at least 3 characters');
            }
        }

        return {
            valid: errors.length === 0,
            errors: errors
        };
    }

    // STRICT RULE: Check username availability
    async checkUsernameAvailability(username) {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Check local storage for existing usernames
        const existingUsers = JSON.parse(localStorage.getItem('mpesewa_users') || '[]');
        const exists = existingUsers.some(user => user.username === username);
        
        return !exists;
    }

    // STRICT RULE: Check email availability
    async checkEmailAvailability(email) {
        await new Promise(resolve => setTimeout(resolve, 500));
        const existingUsers = JSON.parse(localStorage.getItem('mpesewa_users') || '[]');
        const exists = existingUsers.some(user => user.email === email);
        return !exists;
    }

    // STRICT RULE: Check phone availability
    async checkPhoneAvailability(phone) {
        await new Promise(resolve => setTimeout(resolve, 500));
        const existingUsers = JSON.parse(localStorage.getItem('mpesewa_users') || '[]');
        const exists = existingUsers.some(user => user.phoneNumber === phone);
        return !exists;
    }

    // Load user preferences
    loadUserPreferences() {
        try {
            const preferences = localStorage.getItem('mpesewa_user_preferences');
            if (preferences) {
                this.setState({ preferences: JSON.parse(preferences) });
            }
        } catch (error) {
            console.error('Failed to load preferences:', error);
        }
    }

    // Update user preferences
    updatePreferences(newPreferences) {
        const updatedPreferences = {
            ...this.state.preferences,
            ...newPreferences,
            lastUpdated: new Date().toISOString()
        };

        this.setState({ preferences: updatedPreferences });
        localStorage.setItem('mpesewa_user_preferences', JSON.stringify(updatedPreferences));
        
        this.logActivity('preferences_update', 'Preferences updated');

        return {
            success: true,
            preferences: updatedPreferences
        };
    }

    // Load security settings
    loadSecuritySettings() {
        try {
            const security = localStorage.getItem('mpesewa_user_security');
            if (security) {
                this.setState({ security: JSON.parse(security) });
            } else {
                // Default security settings
                this.setState({
                    security: {
                        twoFactorEnabled: false,
                        loginAlerts: true,
                        transactionAlerts: true,
                        sessionTimeout: 30, // minutes
                        biometricLogin: false,
                        lastPasswordChange: null,
                        securityQuestions: []
                    }
                });
            }
        } catch (error) {
            console.error('Failed to load security settings:', error);
        }
    }

    // Update security settings
    updateSecuritySettings(settings) {
        const updatedSecurity = {
            ...this.state.security,
            ...settings,
            lastUpdated: new Date().toISOString()
        };

        this.setState({ security: updatedSecurity });
        localStorage.setItem('mpesewa_user_security', JSON.stringify(updatedSecurity));
        
        this.logActivity('security_update', 'Security settings updated');

        return {
            success: true,
            security: updatedSecurity
        };
    }

    // Enable/disable two-factor authentication
    toggleTwoFactor(enabled) {
        const updatedSecurity = {
            ...this.state.security,
            twoFactorEnabled: enabled,
            twoFactorEnabledAt: enabled ? new Date().toISOString() : null
        };

        this.setState({ security: updatedSecurity });
        localStorage.setItem('mpesewa_user_security', JSON.stringify(updatedSecurity));
        
        const action = enabled ? 'enabled' : 'disabled';
        this.logActivity('2fa_toggle', `Two-factor authentication ${action}`);

        return {
            success: true,
            twoFactorEnabled: enabled,
            message: `Two-factor authentication ${action}`
        };
    }

    // Load user activity log
    loadUserActivity() {
        try {
            const activity = localStorage.getItem('mpesewa_user_activity');
            if (activity) {
                this.setState({ activity: JSON.parse(activity) });
            }
        } catch (error) {
            console.error('Failed to load activity log:', error);
        }
    }

    // Log user activity
    logActivity(type, description, metadata = {}) {
        const activityEntry = {
            id: `act_${Date.now()}`,
            type: type,
            description: description,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            ipAddress: metadata.ipAddress || 'unknown',
            location: metadata.location || 'unknown',
            metadata: metadata
        };

        const updatedActivity = [activityEntry, ...this.state.activity.slice(0, 499)]; // Keep last 500
        this.setState({ activity: updatedActivity });
        
        localStorage.setItem('mpesewa_user_activity', JSON.stringify(updatedActivity));

        return activityEntry;
    }

    // Get recent activity
    getRecentActivity(limit = 50) {
        return this.state.activity.slice(0, limit);
    }

    // Load registered devices
    loadRegisteredDevices() {
        try {
            const devices = localStorage.getItem('mpesewa_user_devices');
            if (devices) {
                this.setState({ devices: JSON.parse(devices) });
            }
        } catch (error) {
            console.error('Failed to load devices:', error);
        }
    }

    // Register new device
    registerDevice(deviceInfo) {
        const device = {
            id: `dev_${Date.now()}`,
            name: deviceInfo.name || 'Unknown Device',
            type: deviceInfo.type || 'desktop',
            userAgent: deviceInfo.userAgent || navigator.userAgent,
            platform: deviceInfo.platform || navigator.platform,
            lastActive: new Date().toISOString(),
            registeredAt: new Date().toISOString(),
            trusted: false,
            active: true
        };

        const updatedDevices = [device, ...this.state.devices];
        this.setState({ devices: updatedDevices });
        
        localStorage.setItem('mpesewa_user_devices', JSON.stringify(updatedDevices));
        
        this.logActivity('device_registered', `New device registered: ${device.name}`);

        return {
            success: true,
            device: device,
            requiresVerification: true
        };
    }

    // Remove device
    removeDevice(deviceId) {
        const updatedDevices = this.state.devices.filter(device => device.id !== deviceId);
        this.setState({ devices: updatedDevices });
        
        localStorage.setItem('mpesewa_user_devices', JSON.stringify(updatedDevices));
        
        this.logActivity('device_removed', 'Device removed from account');

        return {
            success: true,
            message: 'Device removed successfully'
        };
    }

    // Trust/untrust device
    toggleDeviceTrust(deviceId, trusted) {
        const updatedDevices = this.state.devices.map(device => {
            if (device.id === deviceId) {
                return { ...device, trusted: trusted };
            }
            return device;
        });

        this.setState({ devices: updatedDevices });
        localStorage.setItem('mpesewa_user_devices', JSON.stringify(updatedDevices));
        
        const action = trusted ? 'trusted' : 'untrusted';
        this.logActivity('device_trust', `Device ${action}`);

        return {
            success: true,
            device: updatedDevices.find(d => d.id === deviceId)
        };
    }

    // Load documents
    loadDocuments() {
        try {
            const documents = localStorage.getItem('mpesewa_user_documents');
            if (documents) {
                this.setState({ documents: JSON.parse(documents) });
            }
        } catch (error) {
            console.error('Failed to load documents:', error);
        }
    }

    // Upload document
    uploadDocument(documentInfo) {
        const document = {
            id: `doc_${Date.now()}`,
            type: documentInfo.type,
            name: documentInfo.name,
            url: documentInfo.url,
            uploadedAt: new Date().toISOString(),
            verified: false,
            verificationStatus: 'pending',
            size: documentInfo.size || 0,
            mimeType: documentInfo.mimeType || 'application/octet-stream'
        };

        const updatedDocuments = [document, ...this.state.documents];
        this.setState({ documents: updatedDocuments });
        
        localStorage.setItem('mpesewa_user_documents', JSON.stringify(updatedDocuments));
        
        this.logActivity('document_upload', `Document uploaded: ${document.name}`);

        return {
            success: true,
            document: document,
            message: 'Document uploaded successfully'
        };
    }

    // Remove document
    removeDocument(documentId) {
        const updatedDocuments = this.state.documents.filter(doc => doc.id !== documentId);
        this.setState({ documents: updatedDocuments });
        
        localStorage.setItem('mpesewa_user_documents', JSON.stringify(updatedDocuments));
        
        this.logActivity('document_removed', 'Document removed');

        return {
            success: true,
            message: 'Document removed successfully'
        };
    }

    // Load contacts
    loadContacts() {
        try {
            const contacts = localStorage.getItem('mpesewa_user_contacts');
            if (contacts) {
                this.setState({ contacts: JSON.parse(contacts) });
            }
        } catch (error) {
            console.error('Failed to load contacts:', error);
        }
    }

    // Add contact
    addContact(contactInfo) {
        const contact = {
            id: `contact_${Date.now()}`,
            name: contactInfo.name,
            relationship: contactInfo.relationship || 'Unknown',
            phoneNumber: contactInfo.phoneNumber,
            email: contactInfo.email,
            isEmergencyContact: contactInfo.isEmergencyContact || false,
            isReferrer: contactInfo.isReferrer || false,
            addedAt: new Date().toISOString(),
            verified: false
        };

        const updatedContacts = [contact, ...this.state.contacts];
        this.setState({ contacts: updatedContacts });
        
        localStorage.setItem('mpesewa_user_contacts', JSON.stringify(updatedContacts));
        
        this.logActivity('contact_added', `Contact added: ${contact.name}`);

        return {
            success: true,
            contact: contact
        };
    }

    // Remove contact
    removeContact(contactId) {
        const updatedContacts = this.state.contacts.filter(contact => contact.id !== contactId);
        this.setState({ contacts: updatedContacts });
        
        localStorage.setItem('mpesewa_user_contacts', JSON.stringify(updatedContacts));
        
        this.logActivity('contact_removed', 'Contact removed');

        return {
            success: true,
            message: 'Contact removed successfully'
        };
    }

    // Load privacy settings
    loadPrivacySettings() {
        try {
            const privacy = localStorage.getItem('mpesewa_user_privacy');
            if (privacy) {
                this.setState({ privacySettings: JSON.parse(privacy) });
            } else {
                // Default privacy settings
                this.setState({
                    privacySettings: {
                        profileVisibility: 'private',
                        showRating: true,
                        showLoanHistory: false,
                        showContactInfo: false,
                        dataSharing: 'minimal',
                        marketingEmails: false,
                        smsNotifications: true,
                        pushNotifications: true,
                        locationSharing: false
                    }
                });
            }
        } catch (error) {
            console.error('Failed to load privacy settings:', error);
        }
    }

    // Update privacy settings
    updatePrivacySettings(settings) {
        const updatedPrivacy = {
            ...this.state.privacySettings,
            ...settings,
            lastUpdated: new Date().toISOString()
        };

        this.setState({ privacySettings: updatedPrivacy });
        localStorage.setItem('mpesewa_user_privacy', JSON.stringify(updatedPrivacy));
        
        this.logActivity('privacy_update', 'Privacy settings updated');

        return {
            success: true,
            privacy: updatedPrivacy
        };
    }

    // Export user data (GDPR compliance)
    exportUserData() {
        const exportData = {
            exportDate: new Date().toISOString(),
            userProfile: this.state.profile,
            preferences: this.state.preferences,
            securitySettings: this.state.security,
            activityLog: this.state.activity,
            registeredDevices: this.state.devices,
            documents: this.state.documents,
            contacts: this.state.contacts,
            privacySettings: this.state.privacySettings
        };

        const jsonString = JSON.stringify(exportData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        
        this.logActivity('data_export', 'User data exported');

        return {
            success: true,
            data: exportData,
            blob: blob,
            filename: `mpesewa-user-data-${Date.now()}.json`
        };
    }

    // Delete user account (GDPR compliance)
    async deleteAccount() {
        this.setState({ loading: true });
        
        try {
            // Verify user wants to delete
            const confirmed = window.confirm(
                'Are you sure you want to delete your account? ' +
                'This action cannot be undone. All your data will be permanently deleted.'
            );
            
            if (!confirmed) {
                throw new Error('Account deletion cancelled');
            }

            // Delete all user data from localStorage
            const keysToDelete = [
                'mpesewa_user_profile',
                'mpesewa_user_preferences',
                'mpesewa_user_security',
                'mpesewa_user_activity',
                'mpesewa_user_devices',
                'mpesewa_user_documents',
                'mpesewa_user_contacts',
                'mpesewa_user_privacy'
            ];

            keysToDelete.forEach(key => localStorage.removeItem(key));

            // Clear state
            this.setState({
                profile: null,
                preferences: {},
                security: {},
                devices: [],
                activity: [],
                documents: [],
                contacts: [],
                privacySettings: {},
                loading: false
            });

            console.log('🗑️ User account deleted');
            
            return {
                success: true,
                message: 'Account deleted successfully'
            };

        } catch (error) {
            this.setState({
                loading: false,
                error: error.message
            });
            
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Get user statistics
    getUserStats() {
        if (!this.state.profile) return null;

        const stats = {
            accountAge: this.getAccountAge(),
            documentsCount: this.state.documents.length,
            verifiedDocuments: this.state.documents.filter(d => d.verified).length,
            devicesCount: this.state.devices.length,
            trustedDevices: this.state.devices.filter(d => d.trusted).length,
            contactsCount: this.state.contacts.length,
            activityCount: this.state.activity.length,
            profileCompleteness: this.calculateProfileCompleteness(),
            securityScore: this.calculateSecurityScore()
        };

        return stats;
    }

    getAccountAge() {
        if (!this.state.profile?.createdAt) return 0;
        
        const created = new Date(this.state.profile.createdAt);
        const now = new Date();
        const diffTime = Math.abs(now - created);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // days
    }

    calculateProfileCompleteness() {
        if (!this.state.profile) return 0;
        
        const fields = [
            'fullName',
            'email',
            'phoneNumber',
            'nationalId',
            'location',
            'country'
        ];
        
        const completed = fields.filter(field => 
            this.state.profile[field] && this.state.profile[field].toString().trim()
        ).length;
        
        return Math.round((completed / fields.length) * 100);
    }

    calculateSecurityScore() {
        let score = 0;
        const maxScore = 100;
        
        if (this.state.security.twoFactorEnabled) score += 30;
        if (this.state.profile?.emailVerified) score += 20;
        if (this.state.profile?.phoneVerified) score += 20;
        if (this.state.security.loginAlerts) score += 10;
        if (this.state.security.transactionAlerts) score += 10;
        if (this.state.documents.some(d => d.verified)) score += 10;
        
        return Math.min(score, maxScore);
    }

    // Update notification preferences
    updateNotificationPreferences(preferences) {
        const updatedPrefs = {
            ...this.state.preferences,
            notifications: {
                ...this.state.preferences.notifications,
                ...preferences
            }
        };

        this.updatePreferences(updatedPrefs);
        
        return {
            success: true,
            preferences: updatedPrefs.notifications
        };
    }

    // Change password
    async changePassword(currentPassword, newPassword) {
        try {
            // Validate current password (simulated)
            if (!currentPassword) {
                throw new Error('Current password is required');
            }

            // Validate new password
            const passwordValidation = this.validatePassword(newPassword);
            if (!passwordValidation.valid) {
                throw new Error(passwordValidation.errors.join(', '));
            }

            // Check if new password is different
            if (currentPassword === newPassword) {
                throw new Error('New password must be different from current password');
            }

            // Update security settings
            const updatedSecurity = {
                ...this.state.security,
                lastPasswordChange: new Date().toISOString(),
                passwordChangedAt: new Date().toISOString()
            };

            this.setState({ security: updatedSecurity });
            localStorage.setItem('mpesewa_user_security', JSON.stringify(updatedSecurity));
            
            this.logActivity('password_change', 'Password changed successfully');

            return {
                success: true,
                message: 'Password changed successfully'
            };

        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    validatePassword(password) {
        const errors = [];
        
        if (password.length < 8) errors.push('Password must be at least 8 characters');
        if (password.length > 12) errors.push('Password must be at most 12 characters');
        if (!/[A-Z]/.test(password)) errors.push('Password must contain at least one uppercase letter');
        if (!/[a-z]/.test(password)) errors.push('Password must contain at least one lowercase letter');
        if (!/\d/.test(password)) errors.push('Password must contain at least one number');
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push('Password must contain at least one special character');
        
        return {
            valid: errors.length === 0,
            errors: errors
        };
    }

    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.notifySubscribers();
    }

    getState() {
        return { ...this.state };
    }

    // Observer pattern
    subscribers = new Set();
    
    subscribe(callback) {
        this.subscribers.add(callback);
        return () => this.subscribers.delete(callback);
    }
    
    notifySubscribers() {
        this.subscribers.forEach(callback => callback(this.state));
    }

    // Reset slice
    reset() {
        this.setState({
            profile: null,
            preferences: {},
            security: {},
            devices: [],
            activity: [],
            documents: [],
            contacts: [],
            privacySettings: {},
            loading: false,
            error: null
        });
    }
}

// Create singleton instance
const userSlice = new UserSlice();

// Export for use in other modules
export default userSlice;