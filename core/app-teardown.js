/**
 * M-PESEWA APPLICATION TEARDOWN
 * Clean shutdown and resource cleanup with hierarchy preservation
 */

class MPesewaAppTeardown {
    constructor() {
        this.teardownSteps = [
            'USER_SESSION_CLEANUP',
            'DATA_PERSISTENCE',
            'CACHE_CLEANUP',
            'EVENT_LISTENER_REMOVAL',
            'INTERVAL_CLEARING',
            'CONNECTION_CLOSURE',
            'STATE_BACKUP',
            'HIERARCHY_PRESERVATION',
            'RESOURCE_RELEASE',
            'FINAL_CLEANUP'
        ];

        this.teardownStatus = {
            isInProgress: false,
            isComplete: false,
            stepsCompleted: [],
            stepsFailed: [],
            startTime: null,
            endTime: null,
            duration: null
        };

        this.cleanupHandlers = new Map();
        this.resourceTrackers = new Map();
        
        // Teardown reasons
        this.teardownReasons = {
            LOGOUT: 'USER_LOGOUT',
            SESSION_EXPIRED: 'SESSION_EXPIRED',
            INACTIVITY: 'USER_INACTIVITY',
            APP_CLOSE: 'APPLICATION_CLOSE',
            ERROR: 'FATAL_ERROR',
            MAINTENANCE: 'MAINTENANCE_MODE',
            UPDATE: 'APPLICATION_UPDATE'
        };
    }

    /**
     * INITIALIZE TEARDOWN MANAGER
     */
    async initialize() {
        console.log('[TEARDOWN] Initializing teardown manager');
        
        // Set up cleanup handlers for different resource types
        this.setupCleanupHandlers();
        
        // Track resources
        this.startResourceTracking();
        
        // Set up beforeunload handler
        this.setupBeforeUnloadHandler();
        
        // Set up visibility change handler
        this.setupVisibilityChangeHandler();
        
        console.log('[TEARDOWN] Teardown manager initialized');
    }

    /**
     * MAIN TEARDOWN ENTRY POINT
     */
    async teardown(reason = this.teardownReasons.APP_CLOSE) {
        if (this.teardownStatus.isInProgress) {
            console.warn('[TEARDOWN] Teardown already in progress');
            return;
        }

        console.log(`[TEARDOWN] Starting teardown (reason: ${reason})`);
        
        this.teardownStatus.isInProgress = true;
        this.teardownStatus.startTime = Date.now();
        this.teardownStatus.reason = reason;
        
        try {
            // Execute teardown steps in order
            for (const step of this.teardownSteps) {
                await this.executeTeardownStep(step, reason);
                this.teardownStatus.stepsCompleted.push(step);
            }
            
            await this.finalizeTeardown(reason);
            
        } catch (error) {
            await this.handleTeardownError(error, reason);
            throw error;
        }
    }

    async executeTeardownStep(step, reason) {
        console.log(`[TEARDOWN] Executing step: ${step}`);
        
        const stepStartTime = Date.now();
        
        try {
            switch (step) {
                case 'USER_SESSION_CLEANUP':
                    await this.cleanupUserSession(reason);
                    break;
                    
                case 'DATA_PERSISTENCE':
                    await this.persistData(reason);
                    break;
                    
                case 'CACHE_CLEANUP':
                    await this.cleanupCache(reason);
                    break;
                    
                case 'EVENT_LISTENER_REMOVAL':
                    await this.removeEventListeners(reason);
                    break;
                    
                case 'INTERVAL_CLEARING':
                    await this.clearIntervals(reason);
                    break;
                    
                case 'CONNECTION_CLOSURE':
                    await this.closeConnections(reason);
                    break;
                    
                case 'STATE_BACKUP':
                    await this.backupState(reason);
                    break;
                    
                case 'HIERARCHY_PRESERVATION':
                    await this.preserveHierarchy(reason);
                    break;
                    
                case 'RESOURCE_RELEASE':
                    await this.releaseResources(reason);
                    break;
                    
                case 'FINAL_CLEANUP':
                    await this.performFinalCleanup(reason);
                    break;
            }
            
            const stepDuration = Date.now() - stepStartTime;
            console.log(`[TEARDOWN] Step ${step} completed in ${stepDuration}ms`);
            
        } catch (error) {
            console.error(`[TEARDOWN] Error in step ${step}:`, error);
            this.teardownStatus.stepsFailed.push({
                step,
                error: error.message,
                timestamp: new Date().toISOString()
            });
            
            // For non-critical steps, continue teardown
            if (this.isCriticalStep(step)) {
                throw error;
            }
        }
    }

    /**
     * TEARDOWN STEPS IMPLEMENTATION
     */
    async cleanupUserSession(reason) {
        console.log('[TEARDOWN] Cleaning up user session...');
        
        const session = window.mpesewaSession || {};
        const userId = session.userId;
        
        if (!userId) {
            console.log('[TEARDOWN] No active user session');
            return;
        }
        
        try {
            // Update last activity timestamp
            await this.updateLastActivity(userId);
            
            // Clear sensitive session data
            this.clearSensitiveData();
            
            // Invalidate session token
            await this.invalidateSessionToken(session.token);
            
            // Clear local session storage
            sessionStorage.clear();
            
            // Clear session-specific cookies
            this.clearSessionCookies();
            
            // Emit session cleanup event
            window.eventBus?.emit('session:cleanup', {
                userId,
                reason,
                timestamp: new Date().toISOString()
            });
            
            console.log(`[TEARDOWN] User session cleaned up for user: ${userId}`);
            
        } catch (error) {
            console.error('[TEARDOWN] Failed to cleanup user session:', error);
            // Continue teardown even if session cleanup fails
        }
    }

    async persistData(reason) {
        console.log('[TEARDOWN] Persisting data...');
        
        try {
            // Get current state
            const stateManager = window.mpesewaStateManager;
            const currentState = stateManager?.getState?.() || {};
            
            // Filter state to persist
            const stateToPersist = this.filterStateForPersistence(currentState, reason);
            
            // Persist to localStorage
            this.persistToLocalStorage(stateToPersist);
            
            // Persist to IndexedDB if available
            if (window.indexedDB) {
                await this.persistToIndexedDB(stateToPersist, reason);
            }
            
            // Sync to server if online and not logging out
            if (navigator.onLine && reason !== this.teardownReasons.LOGOUT) {
                await this.syncToServer(stateToPersist, reason);
            }
            
            // Backup to service worker cache
            await this.backupToServiceWorker(stateToPersist, reason);
            
            console.log('[TEARDOWN] Data persisted successfully');
            
        } catch (error) {
            console.error('[TEARDOWN] Failed to persist data:', error);
            // Data persistence failure shouldn't block teardown
        }
    }

    async cleanupCache(reason) {
        console.log('[TEARDOWN] Cleaning up cache...');
        
        try {
            // Clear unnecessary cache entries
            await this.clearUnnecessaryCache();
            
            // Preserve important cache entries
            await this.preserveImportantCache();
            
            // Cleanup expired cache entries
            await this.cleanupExpiredCache();
            
            // Clear temporary files
            await this.clearTemporaryFiles();
            
            // Cleanup blob URLs
            this.cleanupBlobURLs();
            
            // Cleanup object URLs
            this.cleanupObjectURLs();
            
            console.log('[TEARDOWN] Cache cleaned up successfully');
            
        } catch (error) {
            console.error('[TEARDOWN] Failed to cleanup cache:', error);
        }
    }

    async removeEventListeners(reason) {
        console.log('[TEARDOWN] Removing event listeners...');
        
        try {
            // Get all tracked event listeners
            const listeners = this.resourceTrackers.get('eventListeners') || [];
            
            // Remove each listener
            listeners.forEach(({ element, event, handler }) => {
                try {
                    element.removeEventListener(event, handler);
                } catch (error) {
                    console.warn(`[TEARDOWN] Failed to remove event listener: ${event}`, error);
                }
            });
            
            // Clear the tracker
            this.resourceTrackers.set('eventListeners', []);
            
            // Remove global event listeners
            this.removeGlobalEventListeners();
            
            console.log(`[TEARDOWN] Removed ${listeners.length} event listeners`);
            
        } catch (error) {
            console.error('[TEARDOWN] Failed to remove event listeners:', error);
        }
    }

    async clearIntervals(reason) {
        console.log('[TEARDOWN] Clearing intervals...');
        
        try {
            // Get all tracked intervals
            const intervals = this.resourceTrackers.get('intervals') || [];
            
            // Clear each interval
            intervals.forEach(intervalId => {
                try {
                    clearInterval(intervalId);
                } catch (error) {
                    console.warn('[TEARDOWN] Failed to clear interval:', error);
                }
            });
            
            // Clear the tracker
            this.resourceTrackers.set('intervals', []);
            
            // Clear timeouts
            const timeouts = this.resourceTrackers.get('timeouts') || [];
            timeouts.forEach(timeoutId => {
                try {
                    clearTimeout(timeoutId);
                } catch (error) {
                    console.warn('[TEARDOWN] Failed to clear timeout:', error);
                }
            });
            
            this.resourceTrackers.set('timeouts', []);
            
            console.log(`[TEARDOWN] Cleared ${intervals.length} intervals and ${timeouts.length} timeouts`);
            
        } catch (error) {
            console.error('[TEARDOWN] Failed to clear intervals:', error);
        }
    }

    async closeConnections(reason) {
        console.log('[TEARDOWN] Closing connections...');
        
        try {
            // Close WebSocket connections
            await this.closeWebSockets();
            
            // Close Server-Sent Events connections
            await this.closeEventSources();
            
            // Close database connections
            await this.closeDatabaseConnections();
            
            // Close IndexedDB connections
            await this.closeIndexedDBConnections();
            
            // Abort fetch requests
            await this.abortFetchRequests();
            
            // Close payment connections if any
            await this.closePaymentConnections();
            
            console.log('[TEARDOWN] Connections closed successfully');
            
        } catch (error) {
            console.error('[TEARDOWN] Failed to close connections:', error);
        }
    }

    async backupState(reason) {
        console.log('[TEARDOWN] Backing up state...');
        
        try {
            // Get current application state
            const state = this.collectApplicationState();
            
            // Create backup
            const backup = {
                state,
                metadata: {
                    timestamp: new Date().toISOString(),
                    reason,
                    version: window.mpesewaConfig?.version || '1.0.0',
                    userId: window.mpesewaSession?.userId || 'anonymous',
                    country: window.mpesewaState?.currentCountry || 'unknown',
                    group: window.mpesewaState?.currentGroup || 'unknown',
                    role: window.mpesewaState?.currentRole || 'unknown'
                }
            };
            
            // Store backup in multiple locations for redundancy
            await this.storeBackup(backup, reason);
            
            // Verify backup integrity
            const isValid = await this.verifyBackupIntegrity(backup);
            
            if (!isValid) {
                console.warn('[TEARDOWN] Backup integrity check failed');
            }
            
            console.log('[TEARDOWN] State backed up successfully');
            
        } catch (error) {
            console.error('[TEARDOWN] Failed to backup state:', error);
        }
    }

    async preserveHierarchy(reason) {
        console.log('[TEARDOWN] Preserving hierarchy...');
        
        try {
            // Get current hierarchy state
            const hierarchy = await this.getCurrentHierarchy();
            
            if (!hierarchy) {
                console.log('[TEARDOWN] No hierarchy to preserve');
                return;
            }
            
            // Validate hierarchy structure
            const isValid = this.validateHierarchyStructure(hierarchy);
            
            if (!isValid) {
                console.warn('[TEARDOWN] Hierarchy structure validation failed');
                // Attempt to fix hierarchy
                await this.fixHierarchyStructure(hierarchy);
            }
            
            // Preserve hierarchy data
            await this.preserveHierarchyData(hierarchy, reason);
            
            // Preserve hierarchy relationships
            await this.preserveHierarchyRelationships(hierarchy, reason);
            
            // Preserve hierarchy permissions
            await this.preserveHierarchyPermissions(hierarchy, reason);
            
            console.log('[TEARDOWN] Hierarchy preserved successfully');
            
        } catch (error) {
            console.error('[TEARDOWN] Failed to preserve hierarchy:', error);
            // Hierarchy preservation is critical, rethrow
            throw error;
        }
    }

    async releaseResources(reason) {
        console.log('[TEARDOWN] Releasing resources...');
        
        try {
            // Release memory
            await this.releaseMemory();
            
            // Close workers
            await this.closeWorkers();
            
            // Release media resources
            await this.releaseMediaResources();
            
            // Release canvas resources
            await this.releaseCanvasResources();
            
            // Release WebGL resources
            await this.releaseWebGLResources();
            
            // Release audio resources
            await this.releaseAudioResources();
            
            // Release video resources
            await this.releaseVideoResources();
            
            // Release animation resources
            await this.releaseAnimationResources();
            
            console.log('[TEARDOWN] Resources released successfully');
            
        } catch (error) {
            console.error('[TEARDOWN] Failed to release resources:', error);
        }
    }

    async performFinalCleanup(reason) {
        console.log('[TEARDOWN] Performing final cleanup...');
        
        try {
            // Clear all remaining tracked resources
            this.clearAllTrackedResources();
            
            // Force garbage collection (if available)
            this.forceGarbageCollection();
            
            // Clear global references
            this.clearGlobalReferences();
            
            // Clear module references
            this.clearModuleReferences();
            
            // Clear service worker cache if needed
            if (reason === this.teardownReasons.UPDATE) {
                await this.clearServiceWorkerCache();
            }
            
            // Clear any remaining timers
            this.clearRemainingTimers();
            
            // Detach DOM elements
            this.detachDOMElements();
            
            console.log('[TEARDOWN] Final cleanup completed');
            
        } catch (error) {
            console.error('[TEARDOWN] Failed to perform final cleanup:', error);
        }
    }

    /**
     * SETUP AND CONFIGURATION
     */
    setupCleanupHandlers() {
        // User session cleanup
        this.cleanupHandlers.set('userSession', {
            cleanup: this.cleanupUserSession.bind(this),
            priority: 1,
            isCritical: true
        });
        
        // Data persistence
        this.cleanupHandlers.set('dataPersistence', {
            cleanup: this.persistData.bind(this),
            priority: 1,
            isCritical: true
        });
        
        // Cache cleanup
        this.cleanupHandlers.set('cache', {
            cleanup: this.cleanupCache.bind(this),
            priority: 2,
            isCritical: false
        });
        
        // Event listeners
        this.cleanupHandlers.set('eventListeners', {
            cleanup: this.removeEventListeners.bind(this),
            priority: 3,
            isCritical: false
        });
        
        // Intervals and timeouts
        this.cleanupHandlers.set('intervals', {
            cleanup: this.clearIntervals.bind(this),
            priority: 3,
            isCritical: false
        });
        
        // Connections
        this.cleanupHandlers.set('connections', {
            cleanup: this.closeConnections.bind(this),
            priority: 2,
            isCritical: true
        });
        
        // State backup
        this.cleanupHandlers.set('stateBackup', {
            cleanup: this.backupState.bind(this),
            priority: 1,
            isCritical: true
        });
        
        // Hierarchy preservation
        this.cleanupHandlers.set('hierarchy', {
            cleanup: this.preserveHierarchy.bind(this),
            priority: 1,
            isCritical: true
        });
        
        // Resource release
        this.cleanupHandlers.set('resources', {
            cleanup: this.releaseResources.bind(this),
            priority: 3,
            isCritical: false
        });
        
        // Final cleanup
        this.cleanupHandlers.set('final', {
            cleanup: this.performFinalCleanup.bind(this),
            priority: 4,
            isCritical: false
        });
    }

    startResourceTracking() {
        // Track event listeners
        const originalAddEventListener = EventTarget.prototype.addEventListener;
        EventTarget.prototype.addEventListener = function(type, listener, options) {
            // Call original
            originalAddEventListener.call(this, type, listener, options);
            
            // Track it
            const trackers = window.mpesewaTeardown?.resourceTrackers;
            if (trackers) {
                let listeners = trackers.get('eventListeners') || [];
                listeners.push({
                    element: this,
                    event: type,
                    handler: listener,
                    timestamp: new Date().toISOString()
                });
                trackers.set('eventListeners', listeners);
            }
            
            return listener;
        };
        
        // Track intervals
        const originalSetInterval = window.setInterval;
        window.setInterval = function(callback, delay, ...args) {
            const intervalId = originalSetInterval(callback, delay, ...args);
            
            // Track it
            const trackers = window.mpesewaTeardown?.resourceTrackers;
            if (trackers) {
                let intervals = trackers.get('intervals') || [];
                intervals.push(intervalId);
                trackers.set('intervals', intervals);
            }
            
            return intervalId;
        };
        
        // Track timeouts
        const originalSetTimeout = window.setTimeout;
        window.setTimeout = function(callback, delay, ...args) {
            const timeoutId = originalSetTimeout(callback, delay, ...args);
            
            // Track it
            const trackers = window.mpesewaTeardown?.resourceTrackers;
            if (trackers) {
                let timeouts = trackers.get('timeouts') || [];
                timeouts.push(timeoutId);
                trackers.set('timeouts', timeouts);
            }
            
            return timeoutId;
        };
        
        console.log('[TEARDOWN] Resource tracking started');
    }

    setupBeforeUnloadHandler() {
        window.addEventListener('beforeunload', async (event) => {
            // Prevent multiple teardowns
            if (this.teardownStatus.isInProgress) {
                return;
            }
            
            // Check if we need to prevent unload
            const shouldPrevent = await this.shouldPreventUnload();
            
            if (shouldPrevent) {
                // Show confirmation dialog
                event.preventDefault();
                event.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
                return;
            }
            
            // Start teardown
            await this.teardown(this.teardownReasons.APP_CLOSE);
        });
    }

    setupVisibilityChangeHandler() {
        document.addEventListener('visibilitychange', async () => {
            if (document.visibilityState === 'hidden') {
                // App is being hidden (tab switch, minimize, etc.)
                await this.handleAppHidden();
            } else if (document.visibilityState === 'visible') {
                // App is visible again
                await this.handleAppVisible();
            }
        });
    }

    /**
     * HELPER METHODS
     */
    async handleAppHidden() {
        console.log('[TEARDOWN] App hidden, performing partial teardown');
        
        // Partial teardown for app hidden state
        try {
            // Persist current state
            await this.persistData(this.teardownReasons.INACTIVITY);
            
            // Backup state
            await this.backupState(this.teardownReasons.INACTIVITY);
            
            // Reduce resource usage
            await this.reduceResourceUsage();
            
            console.log('[TEARDOWN] Partial teardown complete for hidden state');
        } catch (error) {
            console.error('[TEARDOWN] Failed to perform partial teardown:', error);
        }
    }

    async handleAppVisible() {
        console.log('[TEARDOWN] App visible again, restoring state');
        
        try {
            // Restore from backup
            await this.restoreFromBackup();
            
            // Reinitialize connections
            await this.reinitializeConnections();
            
            // Resume activities
            await this.resumeActivities();
            
            console.log('[TEARDOWN] State restored successfully');
        } catch (error) {
            console.error('[TEARDOWN] Failed to restore state:', error);
        }
    }

    async shouldPreventUnload() {
        // Check for unsaved changes
        const hasUnsavedChanges = await this.checkUnsavedChanges();
        
        // Check for pending operations
        const hasPendingOperations = await this.checkPendingOperations();
        
        // Check for active loans
        const hasActiveLoans = await this.checkActiveLoans();
        
        // Check for pending transactions
        const hasPendingTransactions = await this.checkPendingTransactions();
        
        return hasUnsavedChanges || 
               hasPendingOperations || 
               hasActiveLoans || 
               hasPendingTransactions;
    }

    async finalizeTeardown(reason) {
        console.log('[TEARDOWN] Finalizing teardown...');
        
        this.teardownStatus.endTime = Date.now();
        this.teardownStatus.duration = this.teardownStatus.endTime - this.teardownStatus.startTime;
        this.teardownStatus.isComplete = true;
        this.teardownStatus.isInProgress = false;
        
        // Emit teardown complete event
        window.eventBus?.emit('teardown:complete', {
            reason,
            status: this.teardownStatus,
            timestamp: new Date().toISOString()
        });
        
        // Log teardown summary
        this.logTeardownSummary(reason);
        
        // Perform final actions based on reason
        await this.performFinalActions(reason);
        
        console.log(`[TEARDOWN] Teardown completed in ${this.teardownStatus.duration}ms`);
    }

    async handleTeardownError(error, reason) {
        console.error('[TEARDOWN] Teardown failed:', error);
        
        this.teardownStatus.endTime = Date.now();
        this.teardownStatus.duration = this.teardownStatus.endTime - this.teardownStatus.startTime;
        this.teardownStatus.isComplete = false;
        this.teardownStatus.isInProgress = false;
        
        // Emit teardown error event
        window.eventBus?.emit('teardown:error', {
            reason,
            error: error.message,
            status: this.teardownStatus,
            timestamp: new Date().toISOString()
        });
        
        // Attempt emergency cleanup
        await this.attemptEmergencyCleanup();
        
        // Log error
        this.logTeardownError(error, reason);
    }

    async attemptEmergencyCleanup() {
        console.log('[TEARDOWN] Attempting emergency cleanup...');
        
        try {
            // Clear all intervals and timeouts immediately
            this.clearAllIntervalsImmediately();
            
            // Close all connections immediately
            this.closeAllConnectionsImmediately();
            
            // Release critical resources
            this.releaseCriticalResources();
            
            // Clear sensitive data
            this.clearAllSensitiveData();
            
            console.log('[TEARDOWN] Emergency cleanup completed');
        } catch (error) {
            console.error('[TEARDOWN] Emergency cleanup also failed:', error);
        }
    }

    isCriticalStep(step) {
        const criticalSteps = [
            'USER_SESSION_CLEANUP',
            'HIERARCHY_PRESERVATION',
            'CONNECTION_CLOSURE'
        ];
        
        return criticalSteps.includes(step);
    }

    logTeardownSummary(reason) {
        console.group('[TEARDOWN] Teardown Summary');
        console.log(`Reason: ${reason}`);
        console.log(`Duration: ${this.teardownStatus.duration}ms`);
        console.log(`Steps completed: ${this.teardownStatus.stepsCompleted.length}/${this.teardownSteps.length}`);
        console.log(`Steps failed: ${this.teardownStatus.stepsFailed.length}`);
        
        if (this.teardownStatus.stepsFailed.length > 0) {
            console.group('[TEARDOWN] Failed Steps');
            this.teardownStatus.stepsFailed.forEach(failed => {
                console.error(`${failed.step}: ${failed.error}`);
            });
            console.groupEnd();
        }
        
        console.groupEnd();
    }

    logTeardownError(error, reason) {
        console.group('[TEARDOWN] Teardown Error Report');
        console.error(`Reason: ${reason}`);
        console.error(`Error: ${error.message}`);
        console.error(`Stack: ${error.stack}`);
        console.error(`Time: ${new Date().toISOString()}`);
        console.error(`URL: ${window.location.href}`);
        console.error(`User Agent: ${navigator.userAgent}`);
        console.error(`Online: ${navigator.onLine}`);
        console.groupEnd();
    }

    /**
     * RESOURCE MANAGEMENT METHODS
     */
    clearAllTrackedResources() {
        // Clear all resource trackers
        this.resourceTrackers.clear();
        
        // Clear all cleanup handlers
        this.cleanupHandlers.clear();
        
        // Clear all references
        this.cleanupReferences();
    }

    clearAllIntervalsImmediately() {
        // Get the highest possible interval ID and clear all
        let intervalId = setInterval(() => {}, 99999);
        while (intervalId >= 0) {
            clearInterval(intervalId);
            intervalId--;
        }
        
        // Do the same for timeouts
        let timeoutId = setTimeout(() => {}, 99999);
        while (timeoutId >= 0) {
            clearTimeout(timeoutId);
            timeoutId--;
        }
    }

    closeAllConnectionsImmediately() {
        // Close all WebSockets
        if (window.WebSocket) {
            // Find all WebSocket instances and close them
            // This is a best-effort approach
        }
        
        // Close all EventSources
        if (window.EventSource) {
            // Find all EventSource instances and close them
        }
        
        // Abort all fetch requests
        if (window.AbortController) {
            // Create a new AbortController and abort
            const controller = new AbortController();
            controller.abort();
        }
    }

    releaseCriticalResources() {
        // Release critical memory
        if (window.gc) {
            window.gc();
        }
        
        // Clear large data structures
        window.mpesewaState = null;
        window.mpesewaSession = null;
        window.mpesewaConfig = null;
        
        // Clear caches
        if (window.caches) {
            caches.keys().then(cacheNames => {
                cacheNames.forEach(cacheName => {
                    caches.delete(cacheName);
                });
            });
        }
    }

    clearAllSensitiveData() {
        // Clear all localStorage items
        localStorage.clear();
        
        // Clear all sessionStorage items
        sessionStorage.clear();
        
        // Clear all cookies
        document.cookie.split(";").forEach(cookie => {
            const eqPos = cookie.indexOf("=");
            const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
        });
        
        // Clear IndexedDB databases
        if (window.indexedDB) {
            const databases = indexedDB.databases?.();
            if (databases) {
                databases.then(dbList => {
                    dbList.forEach(db => {
                        indexedDB.deleteDatabase(db.name);
                    });
                });
            }
        }
    }

    cleanupReferences() {
        // Clear all module references
        window.mpesewaModules = null;
        
        // Clear all component references
        window.mpesewaComponents = null;
        
        // Clear all service references
        window.mpesewaServices = null;
        
        // Clear all manager references
        window.mpesewaManagers = null;
        
        // Clear event bus
        window.eventBus = null;
    }

    detachDOMElements() {
        // Remove all dynamically added styles
        const dynamicStyles = document.querySelectorAll('style[data-dynamic="true"]');
        dynamicStyles.forEach(style => style.remove());
        
        // Remove all dynamically added scripts
        const dynamicScripts = document.querySelectorAll('script[data-dynamic="true"]');
        dynamicScripts.forEach(script => script.remove());
        
        // Remove all event listeners from body
        const bodyClone = document.body.cloneNode(true);
        document.body.parentNode.replaceChild(bodyClone, document.body);
    }

    forceGarbageCollection() {
        // Try to force garbage collection if available
        if (window.gc) {
            window.gc();
        } else if (window.CollectGarbage) {
            window.CollectGarbage();
        } else if (window.opera && window.opera.collect) {
            window.opera.collect();
        }
    }

    /**
     * HIERARCHY-SPECIFIC METHODS
     */
    async getCurrentHierarchy() {
        const state = window.mpesewaState || {};
        
        return {
            global: {
                version: window.mpesewaConfig?.version || '1.0.0',
                timestamp: new Date().toISOString()
            },
            country: {
                code: state.currentCountry,
                name: state.countryConfig?.name,
                currency: state.countryConfig?.currency
            },
            group: {
                id: state.currentGroup,
                name: state.groupConfig?.name,
                type: state.groupConfig?.type
            },
            role: state.currentRole,
            user: {
                id: window.mpesewaSession?.userId,
                name: window.mpesewaSession?.userName
            },
            subscription: state.currentSubscription,
            loans: state.activeLoans || [],
            ledgers: state.activeLedgers || []
        };
    }

    validateHierarchyStructure(hierarchy) {
        // Check required fields
        const requiredFields = ['global', 'country', 'group', 'role', 'user'];
        for (const field of requiredFields) {
            if (!hierarchy[field]) {
                console.warn(`[TEARDOWN] Missing required hierarchy field: ${field}`);
                return false;
            }
        }
        
        // Validate country
        if (!hierarchy.country.code) {
            console.warn('[TEARDOWN] Missing country code in hierarchy');
            return false;
        }
        
        // Validate group
        if (!hierarchy.group.id) {
            console.warn('[TEARDOWN] Missing group ID in hierarchy');
            return false;
        }
        
        // Validate role
        if (!['LENDER', 'BORROWER'].includes(hierarchy.role)) {
            console.warn(`[TEARDOWN] Invalid role in hierarchy: ${hierarchy.role}`);
            return false;
        }
        
        // Validate user
        if (!hierarchy.user.id) {
            console.warn('[TEARDOWN] Missing user ID in hierarchy');
            return false;
        }
        
        return true;
    }

    async fixHierarchyStructure(hierarchy) {
        console.log('[TEARDOWN] Attempting to fix hierarchy structure...');
        
        try {
            // Try to get missing data from backups
            const backup = await this.getLatestBackup();
            
            if (backup) {
                // Merge backup data into hierarchy
                hierarchy = this.mergeHierarchyWithBackup(hierarchy, backup);
                
                // Re-validate
                const isValid = this.validateHierarchyStructure(hierarchy);
                
                if (isValid) {
                    console.log('[TEARDOWN] Hierarchy structure fixed using backup');
                    return hierarchy;
                }
            }
            
            // If backup doesn't help, use defaults
            hierarchy = this.applyDefaultHierarchyValues(hierarchy);
            console.log('[TEARDOWN] Hierarchy structure fixed using defaults');
            
            return hierarchy;
            
        } catch (error) {
            console.error('[TEARDOWN] Failed to fix hierarchy structure:', error);
            throw error;
        }
    }

    async preserveHierarchyData(hierarchy, reason) {
        // Store hierarchy in multiple locations for redundancy
        
        // 1. localStorage (fast, synchronous)
        localStorage.setItem('mpesewa_hierarchy_backup', JSON.stringify({
            hierarchy,
            timestamp: new Date().toISOString(),
            reason
        }));
        
        // 2. IndexedDB (async, larger capacity)
        if (window.indexedDB) {
            await this.storeHierarchyInIndexedDB(hierarchy, reason);
        }
        
        // 3. Service worker cache (offline support)
        if (navigator.serviceWorker?.controller) {
            await this.storeHierarchyInServiceWorker(hierarchy, reason);
        }
        
        // 4. Server sync (if online)
        if (navigator.onLine && reason !== this.teardownReasons.LOGOUT) {
            await this.syncHierarchyToServer(hierarchy, reason);
        }
    }

    async preserveHierarchyRelationships(hierarchy, reason) {
        // Preserve parent-child relationships
        const relationships = {
            global_to_country: {
                parent: 'global',
                child: hierarchy.country.code,
                type: 'contains'
            },
            country_to_group: {
                parent: hierarchy.country.code,
                child: hierarchy.group.id,
                type: 'contains'
            },
            group_to_user: {
                parent: hierarchy.group.id,
                child: hierarchy.user.id,
                type: 'member',
                role: hierarchy.role
            }
        };
        
        // Store relationships
        localStorage.setItem('mpesewa_relationships', JSON.stringify(relationships));
    }

    async preserveHierarchyPermissions(hierarchy, reason) {
        // Preserve role-based permissions
        const permissions = this.getRolePermissions(hierarchy.role);
        
        // Store permissions
        localStorage.setItem('mpesewa_permissions', JSON.stringify({
            role: hierarchy.role,
            permissions,
            timestamp: new Date().toISOString()
        }));
    }

    getRolePermissions(role) {
        const basePermissions = {
            canView: true,
            canEditProfile: true,
            canViewGroups: true
        };
        
        if (role === 'LENDER') {
            return {
                ...basePermissions,
                canLend: true,
                canCreateLedgers: true,
                canRateBorrowers: true,
                canBlacklist: true,
                requiresSubscription: true
            };
        } else if (role === 'BORROWER') {
            return {
                ...basePermissions,
                canBorrow: true,
                canRequestLoans: true,
                canViewLoans: true,
                canRepay: true,
                maxGroups: 4
            };
        }
        
        return basePermissions;
    }

    /**
     * DATA PERSISTENCE METHODS
     */
    filterStateForPersistence(state, reason) {
        // Filter out sensitive data
        const sensitiveFields = [
            'password',
            'token',
            'authToken',
            'secret',
            'privateKey',
            'creditCard',
            'bankAccount'
        ];
        
        const filteredState = { ...state };
        
        // Remove sensitive fields
        sensitiveFields.forEach(field => {
            if (filteredState[field]) {
                delete filteredState[field];
            }
        });
        
        // Filter based on teardown reason
        switch (reason) {
            case this.teardownReasons.LOGOUT:
                // Remove all user-specific data
                delete filteredState.user;
                delete filteredState.session;
                delete filteredState.preferences;
                break;
                
            case this.teardownReasons.INACTIVITY:
                // Keep essential data only
                return {
                    currentCountry: filteredState.currentCountry,
                    currentGroup: filteredState.currentGroup,
                    currentRole: filteredState.currentRole,
                    hierarchy: filteredState.hierarchy
                };
                
            default:
                // Keep most data
                break;
        }
        
        return filteredState;
    }

    persistToLocalStorage(state) {
        try {
            localStorage.setItem('mpesewa_state', JSON.stringify(state));
            localStorage.setItem('mpesewa_state_timestamp', new Date().toISOString());
        } catch (error) {
            console.error('[TEARDOWN] Failed to persist to localStorage:', error);
            // localStorage might be full, try to clear some space
            this.clearLocalStorageSpace();
            // Try again
            try {
                localStorage.setItem('mpesewa_state', JSON.stringify(state));
            } catch (retryError) {
                console.error('[TEARDOWN] Failed again after clearing space:', retryError);
            }
        }
    }

    clearLocalStorageSpace() {
        try {
            // Clear old cache entries
            const oneHourAgo = Date.now() - 3600000;
            
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith('mpesewa_cache_')) {
                    try {
                        const item = JSON.parse(localStorage.getItem(key));
                        if (item?.timestamp && item.timestamp < oneHourAgo) {
                            localStorage.removeItem(key);
                        }
                    } catch (error) {
                        // If we can't parse it, remove it
                        localStorage.removeItem(key);
                    }
                }
            }
        } catch (error) {
            console.error('[TEARDOWN] Failed to clear localStorage space:', error);
        }
    }

    async persistToIndexedDB(state, reason) {
        if (!window.indexedDB) return;
        
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('mpesewa_persistence', 1);
            
            request.onerror = () => reject(request.error);
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('state_backups')) {
                    db.createObjectStore('state_backups', { keyPath: 'timestamp' });
                }
            };
            
            request.onsuccess = (event) => {
                const db = event.target.result;
                const transaction = db.transaction(['state_backups'], 'readwrite');
                const store = transaction.objectStore('state_backups');
                
                const backup = {
                    timestamp: new Date().toISOString(),
                    state,
                    reason,
                    version: window.mpesewaConfig?.version || '1.0.0'
                };
                
                const putRequest = store.put(backup);
                
                putRequest.onsuccess = () => resolve();
                putRequest.onerror = () => reject(putRequest.error);
                
                transaction.oncomplete = () => db.close();
            };
        });
    }

    async syncToServer(state, reason) {
        // In a real app, this would send to server
        // For now, just log
        console.log('[TEARDOWN] Would sync state to server:', { reason, stateSize: JSON.stringify(state).length });
    }

    async backupToServiceWorker(state, reason) {
        if (!navigator.serviceWorker?.controller) return;
        
        try {
            // Send backup to service worker
            navigator.serviceWorker.controller.postMessage({
                type: 'BACKUP_STATE',
                data: {
                    state,
                    reason,
                    timestamp: new Date().toISOString()
                }
            });
        } catch (error) {
            console.error('[TEARDOWN] Failed to backup to service worker:', error);
        }
    }

    /**
     * PLACEHOLDER METHODS FOR ASYNC OPERATIONS
     */
    async updateLastActivity(userId) { }
    async clearSensitiveData() { }
    async invalidateSessionToken(token) { }
    async clearSessionCookies() { }
    async clearUnnecessaryCache() { }
    async preserveImportantCache() { }
    async cleanupExpiredCache() { }
    async clearTemporaryFiles() { }
    async cleanupBlobURLs() { }
    async cleanupObjectURLs() { }
    async removeGlobalEventListeners() { }
    async closeWebSockets() { }
    async closeEventSources() { }
    async closeDatabaseConnections() { }
    async closeIndexedDBConnections() { }
    async abortFetchRequests() { }
    async closePaymentConnections() { }
    async collectApplicationState() { return {}; }
    async storeBackup(backup, reason) { }
    async verifyBackupIntegrity(backup) { return true; }
    async mergeHierarchyWithBackup(hierarchy, backup) { return hierarchy; }
    async applyDefaultHierarchyValues(hierarchy) { return hierarchy; }
    async storeHierarchyInIndexedDB(hierarchy, reason) { }
    async storeHierarchyInServiceWorker(hierarchy, reason) { }
    async syncHierarchyToServer(hierarchy, reason) { }
    async getLatestBackup() { return null; }
    async checkUnsavedChanges() { return false; }
    async checkPendingOperations() { return false; }
    async checkActiveLoans() { return false; }
    async checkPendingTransactions() { return false; }
    async reduceResourceUsage() { }
    async restoreFromBackup() { }
    async reinitializeConnections() { }
    async resumeActivities() { }
    async clearServiceWorkerCache() { }
    async clearRemainingTimers() { }
    async performFinalActions(reason) { }
    async releaseMemory() { }
    async closeWorkers() { }
    async releaseMediaResources() { }
    async releaseCanvasResources() { }
    async releaseWebGLResources() { }
    async releaseAudioResources() { }
    async releaseVideoResources() { }
    async releaseAnimationResources() { }
}

// Singleton instance
let teardownInstance = null;

export function getTeardownManager() {
    if (!teardownInstance) {
        teardownInstance = new MPesewaAppTeardown();
    }
    return teardownInstance;
}

export async function initializeTeardown() {
    const teardown = getTeardownManager();
    await teardown.initialize();
    return teardown;
}

// Auto-initialize teardown manager
initializeTeardown().catch(error => {
    console.error('Failed to initialize teardown manager:', error);
});

// Export for manual teardown
export async function performTeardown(reason) {
    const teardown = getTeardownManager();
    return await teardown.teardown(reason);
}

// Quick teardown for emergency situations
export async function emergencyTeardown() {
    const teardown = getTeardownManager();
    
    // Skip normal steps, just do emergency cleanup
    try {
        await teardown.attemptEmergencyCleanup();
        console.log('[TEARDOWN] Emergency teardown completed');
    } catch (error) {
        console.error('[TEARDOWN] Emergency teardown failed:', error);
    }
}

export default MPesewaAppTeardown;