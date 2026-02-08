// features/maintenance-flow.js
// Maintenance mode orchestration (e.g., disabling features temporarily)

class MaintenanceFlow {
    constructor() {
        this.maintenanceMode = false;
        this.maintenanceSchedule = [];
        this.featureFlags = {};
        this.emergencyOverrides = {};
        this.notificationSubscribers = [];
        this.init();
    }

    init() {
        // Load maintenance configuration
        this.loadMaintenanceConfig();
        
        // Load feature flags
        this.loadFeatureFlags();
        
        // Load emergency overrides
        this.loadEmergencyOverrides();
        
        // Check current maintenance status
        this.checkMaintenanceStatus();
        
        // Start maintenance schedule monitoring
        this.startScheduleMonitoring();
        
        console.log('Maintenance Flow initialized');
    }

    // Check maintenance status
    checkMaintenanceStatus() {
        const now = new Date();
        
        // Check scheduled maintenance
        const activeSchedules = this.maintenanceSchedule.filter(schedule => {
            const start = new Date(schedule.startTime);
            const end = new Date(schedule.endTime);
            return now >= start && now <= end;
        });

        if (activeSchedules.length > 0) {
            const highestPriority = Math.max(...activeSchedules.map(s => s.priority));
            const activeSchedule = activeSchedules.find(s => s.priority === highestPriority);
            
            if (!this.maintenanceMode || this.maintenanceMode.id !== activeSchedule.id) {
                this.activateMaintenance(activeSchedule);
            }
        } else if (this.maintenanceMode) {
            this.deactivateMaintenance();
        }

        // Check emergency overrides
        this.checkEmergencyOverrides();
    }

    // Activate maintenance mode
    activateMaintenance(schedule) {
        this.maintenanceMode = {
            ...schedule,
            activatedAt: new Date().toISOString(),
            active: true
        };

        // Apply maintenance restrictions
        this.applyMaintenanceRestrictions(schedule);

        // Notify subscribers
        this.notifySubscribers('maintenance-started', schedule);

        // Log activation
        this.logMaintenanceEvent('activated', schedule);

        console.log(`Maintenance mode activated: ${schedule.title}`);
    }

    // Deactivate maintenance mode
    deactivateMaintenance() {
        if (!this.maintenanceMode) return;

        const endedMaintenance = { ...this.maintenanceMode };
        this.maintenanceMode = false;

        // Remove maintenance restrictions
        this.removeMaintenanceRestrictions();

        // Notify subscribers
        this.notifySubscribers('maintenance-ended', endedMaintenance);

        // Log deactivation
        this.logMaintenanceEvent('deactivated', endedMaintenance);

        console.log(`Maintenance mode deactivated: ${endedMaintenance.title}`);
    }

    // Apply maintenance restrictions
    applyMaintenanceRestrictions(schedule) {
        // Disable features based on maintenance type
        switch (schedule.type) {
            case 'full':
                this.disableAllFeatures();
                break;
            case 'partial':
                this.disableFeatures(schedule.disabledFeatures || []);
                break;
            case 'read_only':
                this.enableReadOnlyMode();
                break;
            case 'degraded':
                this.enableDegradedMode();
                break;
        }

        // Apply country-specific restrictions
        if (schedule.countries && schedule.countries.length > 0) {
            this.applyCountryRestrictions(schedule.countries);
        }

        // Apply user role restrictions
        if (schedule.affectedRoles && schedule.affectedRoles.length > 0) {
            this.applyRoleRestrictions(schedule.affectedRoles);
        }

        // Show maintenance banner
        this.showMaintenanceBanner(schedule);
    }

    // Remove maintenance restrictions
    removeMaintenanceRestrictions() {
        // Re-enable all features
        this.enableAllFeatures();
        
        // Remove country restrictions
        this.removeCountryRestrictions();
        
        // Remove role restrictions
        this.removeRoleRestrictions();
        
        // Hide maintenance banner
        this.hideMaintenanceBanner();
        
        // Show completion message
        this.showMaintenanceComplete();
    }

    // Schedule maintenance
    scheduleMaintenance(config) {
        const schedule = {
            id: `maintenance_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            createdAt: new Date().toISOString(),
            createdBy: this.getCurrentUser()?.id || 'system',
            status: 'scheduled',
            ...config,
            startTime: new Date(config.startTime).toISOString(),
            endTime: new Date(config.endTime).toISOString()
        };

        // Validate schedule
        const validation = this.validateMaintenanceSchedule(schedule);
        if (!validation.valid) {
            throw new Error(`Invalid maintenance schedule: ${validation.errors.join(', ')}`);
        }

        // Add to schedule
        this.maintenanceSchedule.push(schedule);
        this.saveMaintenanceSchedule();

        // Notify subscribers
        this.notifySubscribers('maintenance-scheduled', schedule);

        // Log scheduling
        this.logMaintenanceEvent('scheduled', schedule);

        return schedule;
    }

    // Update maintenance schedule
    updateMaintenanceSchedule(scheduleId, updates) {
        const index = this.maintenanceSchedule.findIndex(s => s.id === scheduleId);
        if (index === -1) {
            throw new Error('Maintenance schedule not found');
        }

        const oldSchedule = { ...this.maintenanceSchedule[index] };
        const updatedSchedule = {
            ...oldSchedule,
            ...updates,
            updatedAt: new Date().toISOString(),
            updatedBy: this.getCurrentUser()?.id || 'system'
        };

        // Validate updated schedule
        const validation = this.validateMaintenanceSchedule(updatedSchedule);
        if (!validation.valid) {
            throw new Error(`Invalid maintenance schedule: ${validation.errors.join(', ')}`);
        }

        this.maintenanceSchedule[index] = updatedSchedule;
        this.saveMaintenanceSchedule();

        // Notify subscribers
        this.notifySubscribers('maintenance-updated', {
            old: oldSchedule,
            new: updatedSchedule
        });

        // Log update
        this.logMaintenanceEvent('updated', updatedSchedule);

        // Re-check maintenance status if currently active
        if (this.maintenanceMode && this.maintenanceMode.id === scheduleId) {
            this.checkMaintenanceStatus();
        }

        return updatedSchedule;
    }

    // Cancel maintenance schedule
    cancelMaintenanceSchedule(scheduleId, reason) {
        const index = this.maintenanceSchedule.findIndex(s => s.id === scheduleId);
        if (index === -1) {
            throw new Error('Maintenance schedule not found');
        }

        const schedule = this.maintenanceSchedule[index];
        schedule.status = 'cancelled';
        schedule.cancelledAt = new Date().toISOString();
        schedule.cancelledBy = this.getCurrentUser()?.id || 'system';
        schedule.cancellationReason = reason;

        this.saveMaintenanceSchedule();

        // Notify subscribers
        this.notifySubscribers('maintenance-cancelled', schedule);

        // Log cancellation
        this.logMaintenanceEvent('cancelled', schedule);

        // Deactivate if currently active
        if (this.maintenanceMode && this.maintenanceMode.id === scheduleId) {
            this.deactivateMaintenance();
        }

        return schedule;
    }

    // Start emergency maintenance
    startEmergencyMaintenance(config) {
        const emergencyConfig = {
            id: `emergency_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type: 'emergency',
            title: config.title || 'Emergency Maintenance',
            description: config.description || 'Emergency maintenance is in progress',
            priority: 100, // Highest priority
            startTime: new Date().toISOString(),
            endTime: new Date(Date.now() + (config.duration || 3600000)).toISOString(), // Default 1 hour
            disabledFeatures: config.disabledFeatures || [],
            countries: config.countries || [],
            affectedRoles: config.affectedRoles || [],
            createdBy: this.getCurrentUser()?.id || 'system',
            createdAt: new Date().toISOString(),
            emergency: true,
            reason: config.reason || 'Emergency maintenance required'
        };

        // Add to schedule as emergency
        this.maintenanceSchedule.push(emergencyConfig);
        this.saveMaintenanceSchedule();

        // Activate immediately
        this.activateMaintenance(emergencyConfig);

        // Log emergency start
        this.logMaintenanceEvent('emergency-started', emergencyConfig);

        return emergencyConfig;
    }

    // End emergency maintenance
    endEmergencyMaintenance(reason) {
        if (!this.maintenanceMode || !this.maintenanceMode.emergency) {
            throw new Error('No emergency maintenance active');
        }

        const emergencyId = this.maintenanceMode.id;
        const index = this.maintenanceSchedule.findIndex(s => s.id === emergencyId);
        
        if (index !== -1) {
            this.maintenanceSchedule[index].status = 'completed';
            this.maintenanceSchedule[index].completedAt = new Date().toISOString();
            this.maintenanceSchedule[index].completionReason = reason;
            this.saveMaintenanceSchedule();
        }

        // Deactivate maintenance
        this.deactivateMaintenance();

        // Log emergency end
        this.logMaintenanceEvent('emergency-ended', { id: emergencyId, reason });

        return { success: true, message: 'Emergency maintenance ended' };
    }

    // Check if feature is available
    isFeatureAvailable(featureName, context = {}) {
        // Check maintenance mode
        if (this.maintenanceMode) {
            const schedule = this.maintenanceMode;
            
            // Check if feature is disabled in current maintenance
            if (schedule.disabledFeatures && schedule.disabledFeatures.includes(featureName)) {
                return false;
            }

            // Check country restrictions
            if (schedule.countries && schedule.countries.length > 0) {
                const userCountry = context.country || localStorage.getItem('mpesewa_country');
                if (userCountry && schedule.countries.includes(userCountry)) {
                    return false;
                }
            }

            // Check role restrictions
            if (schedule.affectedRoles && schedule.affectedRoles.length > 0) {
                const userRole = context.role || this.getCurrentUser()?.role;
                if (userRole && schedule.affectedRoles.includes(userRole)) {
                    return false;
                }
            }
        }

        // Check feature flags
        if (this.featureFlags[featureName]) {
            const flag = this.featureFlags[featureName];
            
            // Check if flag is enabled
            if (!flag.enabled) {
                return false;
            }

            // Check rollout percentage
            if (flag.rolloutPercentage < 100) {
                const userId = context.userId || this.getCurrentUser()?.id;
                if (userId) {
                    const hash = this.hashString(userId + featureName);
                    const percentage = parseInt(hash.substring(0, 2), 16) % 100;
                    return percentage < flag.rolloutPercentage;
                }
            }

            // Check country restrictions in feature flag
            if (flag.countries && flag.countries.length > 0) {
                const userCountry = context.country || localStorage.getItem('mpesewa_country');
                if (userCountry && !flag.countries.includes(userCountry)) {
                    return false;
                }
            }

            // Check user role restrictions
            if (flag.roles && flag.roles.length > 0) {
                const userRole = context.role || this.getCurrentUser()?.role;
                if (userRole && !flag.roles.includes(userRole)) {
                    return false;
                }
            }
        }

        // Check emergency overrides
        if (this.emergencyOverrides[featureName] === false) {
            return false;
        }

        return true;
    }

    // Get feature status
    getFeatureStatus(featureName, context = {}) {
        const available = this.isFeatureAvailable(featureName, context);
        const maintenanceActive = !!this.maintenanceMode;
        
        let reason = null;
        let maintenanceInfo = null;

        if (!available) {
            if (this.maintenanceMode) {
                reason = 'maintenance';
                maintenanceInfo = {
                    title: this.maintenanceMode.title,
                    description: this.maintenanceMode.description,
                    estimatedEnd: this.maintenanceMode.endTime
                };
            } else if (this.featureFlags[featureName] && !this.featureFlags[featureName].enabled) {
                reason = 'feature_disabled';
            } else if (this.emergencyOverrides[featureName] === false) {
                reason = 'emergency_override';
            } else {
                reason = 'not_available';
            }
        }

        return {
            available,
            reason,
            maintenanceActive,
            maintenanceInfo,
            featureFlag: this.featureFlags[featureName]
        };
    }

    // Set feature flag
    setFeatureFlag(featureName, config) {
        const oldFlag = this.featureFlags[featureName];
        const newFlag = {
            id: `flag_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: featureName,
            enabled: config.enabled !== undefined ? config.enabled : true,
            rolloutPercentage: config.rolloutPercentage || 100,
            countries: config.countries || [],
            roles: config.roles || [],
            description: config.description || '',
            createdBy: this.getCurrentUser()?.id || 'system',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.featureFlags[featureName] = newFlag;
        this.saveFeatureFlags();

        // Notify subscribers
        this.notifySubscribers('feature-flag-changed', {
            feature: featureName,
            old: oldFlag,
            new: newFlag
        });

        return newFlag;
    }

    // Remove feature flag
    removeFeatureFlag(featureName) {
        const removedFlag = this.featureFlags[featureName];
        if (removedFlag) {
            delete this.featureFlags[featureName];
            this.saveFeatureFlags();

            // Notify subscribers
            this.notifySubscribers('feature-flag-removed', {
                feature: featureName,
                flag: removedFlag
            });
        }

        return removedFlag;
    }

    // Set emergency override
    setEmergencyOverride(featureName, enabled, reason) {
        const oldOverride = this.emergencyOverrides[featureName];
        this.emergencyOverrides[featureName] = enabled;
        
        if (reason) {
            this.emergencyOverrides[`${featureName}_reason`] = reason;
        }

        this.saveEmergencyOverrides();

        // Notify subscribers
        this.notifySubscribers('emergency-override-changed', {
            feature: featureName,
            enabled,
            reason,
            old: oldOverride
        });

        return { feature: featureName, enabled, reason };
    }

    // Remove emergency override
    removeEmergencyOverride(featureName) {
        const oldEnabled = this.emergencyOverrides[featureName];
        const oldReason = this.emergencyOverrides[`${featureName}_reason`];
        
        delete this.emergencyOverrides[featureName];
        delete this.emergencyOverrides[`${featureName}_reason`];
        
        this.saveEmergencyOverrides();

        // Notify subscribers
        this.notifySubscribers('emergency-override-removed', {
            feature: featureName,
            oldEnabled,
            oldReason
        });

        return { feature: featureName, oldEnabled, oldReason };
    }

    // Subscribe to maintenance notifications
    subscribe(callback) {
        const id = `subscriber_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        this.notificationSubscribers.push({ id, callback });
        return id;
    }

    // Unsubscribe from notifications
    unsubscribe(subscriberId) {
        const index = this.notificationSubscribers.findIndex(s => s.id === subscriberId);
        if (index !== -1) {
            this.notificationSubscribers.splice(index, 1);
            return true;
        }
        return false;
    }

    // Notify subscribers
    notifySubscribers(event, data) {
        this.notificationSubscribers.forEach(subscriber => {
            try {
                subscriber.callback(event, data);
            } catch (error) {
                console.error(`Error in subscriber callback ${subscriber.id}:`, error);
            }
        });
    }

    // Show maintenance banner
    showMaintenanceBanner(schedule) {
        // Remove existing banner
        this.hideMaintenanceBanner();

        const banner = document.createElement('div');
        banner.className = 'maintenance-banner maintenance-active';
        banner.id = 'maintenance-banner';
        
        const now = new Date();
        const endTime = new Date(schedule.endTime);
        const timeRemaining = this.formatTimeRemaining(endTime - now);

        banner.innerHTML = `
            <div class="maintenance-banner-content">
                <div class="maintenance-icon">🛠️</div>
                <div class="maintenance-text">
                    <strong>${schedule.title}</strong>
                    <p>${schedule.description}</p>
                    ${timeRemaining ? `<small>Estimated completion: ${timeRemaining}</small>` : ''}
                </div>
                ${schedule.type === 'partial' ? `
                    <div class="maintenance-actions">
                        <button class="btn-maintenance-details">View Details</button>
                    </div>
                ` : ''}
                <button class="maintenance-close" aria-label="Close">&times;</button>
            </div>
        `;

        document.body.appendChild(banner);

        // Add event listeners
        if (schedule.type === 'partial') {
            banner.querySelector('.btn-maintenance-details').addEventListener('click', () => {
                this.showMaintenanceDetails(schedule);
            });
        }

        banner.querySelector('.maintenance-close').addEventListener('click', () => {
            this.hideMaintenanceBanner();
            // Store dismissal for this session
            sessionStorage.setItem('maintenance_banner_dismissed', 'true');
        });
    }

    // Hide maintenance banner
    hideMaintenanceBanner() {
        const banner = document.getElementById('maintenance-banner');
        if (banner) {
            banner.remove();
        }
    }

    // Show maintenance details
    showMaintenanceDetails(schedule) {
        // Create modal with details
        const modal = document.createElement('div');
        modal.className = 'maintenance-modal';
        modal.innerHTML = `
            <div class="maintenance-modal-content">
                <div class="modal-header">
                    <h3>${schedule.title}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <p><strong>Description:</strong> ${schedule.description}</p>
                    <p><strong>Type:</strong> ${schedule.type}</p>
                    <p><strong>Start Time:</strong> ${new Date(schedule.startTime).toLocaleString()}</p>
                    <p><strong>Estimated End:</strong> ${new Date(schedule.endTime).toLocaleString()}</p>
                    
                    ${schedule.disabledFeatures && schedule.disabledFeatures.length > 0 ? `
                        <p><strong>Disabled Features:</strong></p>
                        <ul>
                            ${schedule.disabledFeatures.map(feature => `<li>${feature}</li>`).join('')}
                        </ul>
                    ` : ''}
                    
                    ${schedule.affectedRoles && schedule.affectedRoles.length > 0 ? `
                        <p><strong>Affected Roles:</strong> ${schedule.affectedRoles.join(', ')}</p>
                    ` : ''}
                    
                    ${schedule.countries && schedule.countries.length > 0 ? `
                        <p><strong>Affected Countries:</strong> ${schedule.countries.join(', ')}</p>
                    ` : ''}
                    
                    ${schedule.reason ? `<p><strong>Reason:</strong> ${schedule.reason}</p>` : ''}
                </div>
                <div class="modal-footer">
                    <button class="btn-modal-close">Close</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Add event listeners
        modal.querySelector('.modal-close').addEventListener('click', () => {
            modal.remove();
        });

        modal.querySelector('.btn-modal-close').addEventListener('click', () => {
            modal.remove();
        });

        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    // Show maintenance complete message
    showMaintenanceComplete() {
        const toast = document.createElement('div');
        toast.className = 'maintenance-complete-toast';
        toast.innerHTML = `
            <div class="toast-content">
                <div class="toast-icon">✅</div>
                <div class="toast-text">
                    <strong>Maintenance Complete</strong>
                    <p>All systems are back online and running normally.</p>
                </div>
            </div>
        `;

        document.body.appendChild(toast);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (document.body.contains(toast)) {
                toast.classList.add('fade-out');
                setTimeout(() => {
                    if (document.body.contains(toast)) {
                        toast.remove();
                    }
                }, 300);
            }
        }, 5000);
    }

    // Disable all features
    disableAllFeatures() {
        // In a real app, this would disable all interactive elements
        console.log('All features disabled for maintenance');
        
        // Add global maintenance class
        document.body.classList.add('maintenance-mode-full');
    }

    // Disable specific features
    disableFeatures(featureList) {
        featureList.forEach(feature => {
            console.log(`Feature disabled: ${feature}`);
            // In real app, disable specific UI elements or API calls
        });
        
        // Add partial maintenance class
        document.body.classList.add('maintenance-mode-partial');
    }

    // Enable read-only mode
    enableReadOnlyMode() {
        console.log('Read-only mode enabled');
        
        // Disable all form submissions and interactive elements
        document.body.classList.add('maintenance-mode-readonly');
    }

    // Enable degraded mode
    enableDegradedMode() {
        console.log('Degraded mode enabled');
        
        // Limit functionality but allow basic operations
        document.body.classList.add('maintenance-mode-degraded');
    }

    // Enable all features
    enableAllFeatures() {
        // Remove all maintenance classes
        document.body.classList.remove(
            'maintenance-mode-full',
            'maintenance-mode-partial',
            'maintenance-mode-readonly',
            'maintenance-mode-degraded'
        );
    }

    // Apply country restrictions
    applyCountryRestrictions(countries) {
        const userCountry = localStorage.getItem('mpesewa_country');
        if (userCountry && countries.includes(userCountry)) {
            console.log(`Applying maintenance restrictions for country: ${userCountry}`);
            document.body.classList.add(`maintenance-country-${userCountry.toLowerCase()}`);
        }
    }

    // Remove country restrictions
    removeCountryRestrictions() {
        const classes = Array.from(document.body.classList).filter(cls => 
            cls.startsWith('maintenance-country-')
        );
        classes.forEach(cls => document.body.classList.remove(cls));
    }

    // Apply role restrictions
    applyRoleRestrictions(roles) {
        const userRole = this.getCurrentUser()?.role;
        if (userRole && roles.includes(userRole)) {
            console.log(`Applying maintenance restrictions for role: ${userRole}`);
            document.body.classList.add(`maintenance-role-${userRole.toLowerCase()}`);
        }
    }

    // Remove role restrictions
    removeRoleRestrictions() {
        const classes = Array.from(document.body.classList).filter(cls => 
            cls.startsWith('maintenance-role-')
        );
        classes.forEach(cls => document.body.classList.remove(cls));
    }

    // Check emergency overrides
    checkEmergencyOverrides() {
        // In a real app, this might check with a server for emergency overrides
        console.log('Checking emergency overrides');
    }

    // Start schedule monitoring
    startScheduleMonitoring() {
        // Check every minute
        setInterval(() => {
            this.checkMaintenanceStatus();
        }, 60000);
    }

    // Validate maintenance schedule
    validateMaintenanceSchedule(schedule) {
        const errors = [];
        const now = new Date();
        const startTime = new Date(schedule.startTime);
        const endTime = new Date(schedule.endTime);

        if (startTime >= endTime) {
            errors.push('End time must be after start time');
        }

        if (endTime < now) {
            errors.push('End time cannot be in the past');
        }

        if (!schedule.title || schedule.title.trim().length === 0) {
            errors.push('Title is required');
        }

        if (!schedule.description || schedule.description.trim().length === 0) {
            errors.push('Description is required');
        }

        if (!['full', 'partial', 'read_only', 'degraded', 'emergency'].includes(schedule.type)) {
            errors.push('Invalid maintenance type');
        }

        if (schedule.priority < 1 || schedule.priority > 100) {
            errors.push('Priority must be between 1 and 100');
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }

    // Format time remaining
    formatTimeRemaining(ms) {
        if (ms <= 0) return 'Completed';
        
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        
        if (hours > 0) return `${hours} hour${hours !== 1 ? 's' : ''} remaining`;
        if (minutes > 0) return `${minutes} minute${minutes !== 1 ? 's' : ''} remaining`;
        return `${seconds} second${seconds !== 1 ? 's' : ''} remaining`;
    }

    // Hash string for feature flag distribution
    hashString(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(16);
    }

    // Get current user
    getCurrentUser() {
        try {
            return JSON.parse(localStorage.getItem('mpesewa_user') || '{}');
        } catch (error) {
            return null;
        }
    }

    // Log maintenance event
    logMaintenanceEvent(action, data) {
        const logEntry = {
            id: `maintenance_log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            action,
            timestamp: new Date().toISOString(),
            user: this.getCurrentUser()?.id || 'system',
            data
        };

        // Store log
        const logs = JSON.parse(localStorage.getItem('mpesewa_maintenance_logs') || '[]');
        logs.unshift(logEntry);
        
        // Keep only last 100 logs
        if (logs.length > 100) {
            logs.pop();
        }
        
        localStorage.setItem('mpesewa_maintenance_logs', JSON.stringify(logs));
    }

    // Save methods
    saveMaintenanceSchedule() {
        localStorage.setItem('mpesewa_maintenance_schedule', JSON.stringify(this.maintenanceSchedule));
    }

    saveFeatureFlags() {
        localStorage.setItem('mpesewa_feature_flags', JSON.stringify(this.featureFlags));
    }

    saveEmergencyOverrides() {
        localStorage.setItem('mpesewa_emergency_overrides', JSON.stringify(this.emergencyOverrides));
    }

    // Load methods
    loadMaintenanceConfig() {
        try {
            const schedule = localStorage.getItem('mpesewa_maintenance_schedule');
            if (schedule) {
                this.maintenanceSchedule = JSON.parse(schedule);
            }
        } catch (error) {
            console.error('Failed to load maintenance schedule:', error);
            this.maintenanceSchedule = [];
        }
    }

    loadFeatureFlags() {
        try {
            const flags = localStorage.getItem('mpesewa_feature_flags');
            if (flags) {
                this.featureFlags = JSON.parse(flags);
            }
        } catch (error) {
            console.error('Failed to load feature flags:', error);
            this.featureFlags = {};
        }
    }

    loadEmergencyOverrides() {
        try {
            const overrides = localStorage.getItem('mpesewa_emergency_overrides');
            if (overrides) {
                this.emergencyOverrides = JSON.parse(overrides);
            }
        } catch (error) {
            console.error('Failed to load emergency overrides:', error);
            this.emergencyOverrides = {};
        }
    }

    // Public API
    getMaintenanceStatus() {
        return {
            active: !!this.maintenanceMode,
            current: this.maintenanceMode,
            nextScheduled: this.getNextScheduledMaintenance(),
            featureFlags: Object.keys(this.featureFlags).length,
            emergencyOverrides: Object.keys(this.emergencyOverrides).length
        };
    }

    getNextScheduledMaintenance() {
        const now = new Date();
        const upcoming = this.maintenanceSchedule
            .filter(schedule => 
                schedule.status === 'scheduled' && 
                new Date(schedule.startTime) > now
            )
            .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
        
        return upcoming.length > 0 ? upcoming[0] : null;
    }

    getUpcomingMaintenance(limit = 5) {
        const now = new Date();
        return this.maintenanceSchedule
            .filter(schedule => new Date(schedule.startTime) > now)
            .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
            .slice(0, limit);
    }

    getMaintenanceHistory(limit = 10) {
        const now = new Date();
        return this.maintenanceSchedule
            .filter(schedule => new Date(schedule.endTime) < now)
            .sort((a, b) => new Date(b.endTime) - new Date(a.endTime))
            .slice(0, limit);
    }

    getFeatureFlags() {
        return { ...this.featureFlags };
    }

    getEmergencyOverrides() {
        return { ...this.emergencyOverrides };
    }

    getMaintenanceLogs(limit = 50) {
        try {
            const logs = JSON.parse(localStorage.getItem('mpesewa_maintenance_logs') || '[]');
            return logs.slice(0, limit);
        } catch (error) {
            return [];
        }
    }

    clearMaintenanceData() {
        this.maintenanceSchedule = [];
        this.featureFlags = {};
        this.emergencyOverrides = {};
        
        localStorage.removeItem('mpesewa_maintenance_schedule');
        localStorage.removeItem('mpesewa_feature_flags');
        localStorage.removeItem('mpesewa_emergency_overrides');
        localStorage.removeItem('mpesewa_maintenance_logs');
        
        this.maintenanceMode = false;
        this.removeMaintenanceRestrictions();
        
        return { success: true, message: 'Maintenance data cleared' };
    }

    exportMaintenanceData() {
        const exportData = {
            exportDate: new Date().toISOString(),
            maintenanceMode: this.maintenanceMode,
            maintenanceSchedule: this.maintenanceSchedule,
            featureFlags: this.featureFlags,
            emergencyOverrides: this.emergencyOverrides,
            logs: this.getMaintenanceLogs(100)
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        return {
            url,
            filename: `maintenance-data_${new Date().toISOString().split('T')[0]}.json`,
            type: 'application/json'
        };
    }
}

// Export singleton instance
const maintenanceFlow = new MaintenanceFlow();
window.MaintenanceFlow = maintenanceFlow;
export default maintenanceFlow;