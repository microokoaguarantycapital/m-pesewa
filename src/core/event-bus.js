/**
 * M-PESEWA EVENT BUS SYSTEM
 * Decouples modules and enables strict hierarchy communication
 */

class MpesewaEventBus {
    constructor() {
        this.events = new Map();
        this.history = [];
        this.maxHistorySize = 1000;
        
        // Strict event hierarchy
        this.hierarchyLevels = ['global', 'country', 'group', 'lender', 'borrower', 'ledger', 'admin'];
        
        // Register core events
        this.registerCoreEvents();
    }
    
    registerCoreEvents() {
        // GLOBAL EVENTS
        this.defineEvent('global:init', { level: 'global', description: 'Application initialized' });
        this.defineEvent('global:error', { level: 'global', description: 'Global error occurred' });
        this.defineEvent('global:network:online', { level: 'global', description: 'Network came online' });
        this.defineEvent('global:network:offline', { level: 'global', description: 'Network went offline' });
        
        // AUTH EVENTS
        this.defineEvent('auth:login', { level: 'global', description: 'User logged in' });
        this.defineEvent('auth:logout', { level: 'global', description: 'User logged out' });
        this.defineEvent('auth:register', { level: 'global', description: 'User registered' });
        this.defineEvent('auth:session:expired', { level: 'global', description: 'User session expired' });
        
        // COUNTRY EVENTS
        this.defineEvent('country:selected', { level: 'country', description: 'Country selected', strict: true });
        this.defineEvent('country:changed', { level: 'country', description: 'Country changed', strict: true });
        this.defineEvent('country:violation', { level: 'country', description: 'Country isolation violation attempted' });
        
        // GROUP EVENTS
        this.defineEvent('group:created', { level: 'group', description: 'Group created', strict: true });
        this.defineEvent('group:joined', { level: 'group', description: 'User joined group', strict: true });
        this.defineEvent('group:left', { level: 'group', description: 'User left group', strict: true });
        this.defineEvent('group:invite:sent', { level: 'group', description: 'Group invitation sent' });
        this.defineEvent('group:invite:accepted', { level: 'group', description: 'Group invitation accepted' });
        this.defineEvent('group:size:limit', { level: 'group', description: 'Group size limit reached' });
        
        // LENDER EVENTS
        this.defineEvent('lender:subscription:active', { level: 'lender', description: 'Lender subscription activated', strict: true });
        this.defineEvent('lender:subscription:expired', { level: 'lender', description: 'Lender subscription expired', strict: true });
        this.defineEvent('lender:subscription:renewed', { level: 'lender', description: 'Lender subscription renewed', strict: true });
        this.defineEvent('lender:ledger:created', { level: 'lender', description: 'Ledger created', strict: true });
        this.defineEvent('lender:ledger:updated', { level: 'lender', description: 'Ledger updated', strict: true });
        this.defineEvent('lender:loan:approved', { level: 'lender', description: 'Loan approved', strict: true });
        this.defineEvent('lender:loan:rejected', { level: 'lender', description: 'Loan rejected', strict: true });
        this.defineEvent('lender:limit:reached', { level: 'lender', description: 'Lending limit reached' });
        
        // BORROWER EVENTS
        this.defineEvent('borrower:loan:requested', { level: 'borrower', description: 'Loan requested', strict: true });
        this.defineEvent('borrower:loan:disbursed', { level: 'borrower', description: 'Loan disbursed', strict: true });
        this.defineEvent('borrower:repayment:made', { level: 'borrower', description: 'Repayment made', strict: true });
        this.defineEvent('borrower:repayment:partial', { level: 'borrower', description: 'Partial repayment made', strict: true });
        this.defineEvent('borrower:rating:updated', { level: 'borrower', description: 'Borrower rating updated' });
        this.defineEvent('borrower:blacklisted', { level: 'borrower', description: 'Borrower blacklisted', strict: true });
        this.defineEvent('borrower:reinstated', { level: 'borrower', description: 'Borrower reinstated from blacklist', strict: true });
        
        // LEDGER EVENTS
        this.defineEvent('ledger:created', { level: 'ledger', description: 'Ledger created', strict: true });
        this.defineEvent('ledger:updated', { level: 'ledger', description: 'Ledger updated', strict: true });
        this.defineEvent('ledger:interest:applied', { level: 'ledger', description: 'Interest applied to ledger' });
        this.defineEvent('ledger:penalty:applied', { level: 'ledger', description: 'Penalty applied to ledger' });
        this.defineEvent('ledger:cleared', { level: 'ledger', description: 'Ledger cleared', strict: true });
        this.defineEvent('ledger:defaulted', { level: 'ledger', description: 'Ledger defaulted', strict: true });
        
        // EMERGENCY HUB EVENTS
        this.defineEvent('emergency:category:viewed', { level: 'global', description: 'Emergency category viewed' });
        this.defineEvent('emergency:loan:requested', { level: 'borrower', description: 'Emergency loan requested' });
        
        // ADMIN EVENTS
        this.defineEvent('admin:override:blacklist', { level: 'admin', description: 'Admin overrode blacklist', strict: true });
        this.defineEvent('admin:override:ledger', { level: 'admin', description: 'Admin overrode ledger', strict: true });
        this.defineEvent('admin:audit:viewed', { level: 'admin', description: 'Audit log viewed' });
        this.defineEvent('admin:system:health', { level: 'admin', description: 'System health checked' });
        
        // SYNC EVENTS
        this.defineEvent('sync:started', { level: 'global', description: 'Data sync started' });
        this.defineEvent('sync:completed', { level: 'global', description: 'Data sync completed' });
        this.defineEvent('sync:failed', { level: 'global', description: 'Data sync failed' });
        this.defineEvent('sync:conflict', { level: 'global', description: 'Data sync conflict detected' });
    }
    
    defineEvent(eventName, metadata = {}) {
        if (!this.events.has(eventName)) {
            this.events.set(eventName, {
                subscribers: new Set(),
                metadata: {
                    createdAt: new Date().toISOString(),
                    level: metadata.level || 'global',
                    strict: metadata.strict || false,
                    description: metadata.description || 'No description',
                    ...metadata
                }
            });
        }
    }
    
    subscribe(eventName, callback, options = {}) {
        if (!this.events.has(eventName)) {
            this.defineEvent(eventName);
        }
        
        const event = this.events.get(eventName);
        const subscriber = {
            callback,
            id: this.generateSubscriberId(),
            options: {
                once: options.once || false,
                priority: options.priority || 0,
                context: options.context || null
            }
        };
        
        event.subscribers.add(subscriber);
        
        return () => this.unsubscribe(eventName, subscriber.id);
    }
    
    unsubscribe(eventName, subscriberId) {
        if (!this.events.has(eventName)) return false;
        
        const event = this.events.get(eventName);
        for (const subscriber of event.subscribers) {
            if (subscriber.id === subscriberId) {
                event.subscribers.delete(subscriber);
                return true;
            }
        }
        return false;
    }
    
    emit(eventName, data = {}, options = {}) {
        // Validate event exists
        if (!this.events.has(eventName)) {
            console.warn(`Event "${eventName}" not defined, defining automatically`);
            this.defineEvent(eventName);
        }
        
        const event = this.events.get(eventName);
        const eventData = {
            name: eventName,
            data,
            metadata: event.metadata,
            timestamp: new Date().toISOString(),
            id: this.generateEventId(),
            source: options.source || 'unknown',
            user: this.getCurrentUserContext(),
            country: localStorage.getItem('mpesewa_country'),
            group: localStorage.getItem('mpesewa_current_group'),
            hierarchy: this.getCurrentHierarchy()
        };
        
        // STRICT HIERARCHY ENFORCEMENT
        if (event.metadata.strict) {
            const hierarchyCheck = this.validateHierarchy(event.metadata.level);
            if (!hierarchyCheck.valid) {
                console.error(`Hierarchy violation for event ${eventName}:`, hierarchyCheck);
                
                // Emit violation event
                this.emit('hierarchy:violation', {
                    event: eventName,
                    requiredLevel: event.metadata.level,
                    currentLevel: hierarchyCheck.currentLevel,
                    violation: hierarchyCheck.reason
                }, { source: 'event-bus' });
                
                // Still emit the event but mark it as violated
                eventData.hierarchyViolation = hierarchyCheck;
            }
        }
        
        // Log to history
        this.addToHistory(eventData);
        
        // Execute subscribers in priority order
        const subscribers = Array.from(event.subscribers)
            .sort((a, b) => b.options.priority - a.options.priority);
        
        let stopPropagation = false;
        
        for (const subscriber of subscribers) {
            if (stopPropagation) break;
            
            try {
                const result = subscriber.callback(eventData);
                
                // Handle async callbacks
                if (result && typeof result.then === 'function') {
                    result.catch(error => {
                        console.error(`Async event handler error for ${eventName}:`, error);
                        window.mpesewaErrorBoundary?.handleError(error, {
                            type: 'event_handler_error',
                            event: eventName,
                            subscriber: subscriber.id
                        });
                    });
                }
                
                // Check if propagation should stop
                if (result === false) {
                    stopPropagation = true;
                }
                
                // Remove if once-only subscriber
                if (subscriber.options.once) {
                    event.subscribers.delete(subscriber);
                }
            } catch (error) {
                console.error(`Event handler error for ${eventName}:`, error);
                window.mpesewaErrorBoundary?.handleError(error, {
                    type: 'event_handler_error',
                    event: eventName,
                    subscriber: subscriber.id
                });
            }
        }
        
        // Dispatch as DOM event for compatibility
        this.dispatchDOMEvent(eventName, eventData);
        
        return eventData;
    }
    
    validateHierarchy(requiredLevel) {
        const currentLevel = this.getCurrentHierarchyLevel();
        const hierarchyIndex = this.hierarchyLevels.indexOf(requiredLevel);
        const currentIndex = this.hierarchyLevels.indexOf(currentLevel);
        
        if (hierarchyIndex === -1) {
            return { valid: false, reason: 'Invalid required level' };
        }
        
        if (currentIndex === -1) {
            return { valid: false, reason: 'Current hierarchy level unknown' };
        }
        
        // STRICT: Events can only be emitted at or above their required level
        if (currentIndex < hierarchyIndex) {
            return {
                valid: false,
                reason: `Cannot emit ${requiredLevel} event from ${currentLevel} context`,
                currentLevel,
                requiredLevel
            };
        }
        
        return { valid: true, currentLevel };
    }
    
    getCurrentHierarchyLevel() {
        const user = JSON.parse(localStorage.getItem('mpesewa_user') || '{}');
        const roles = user.roles || [];
        
        if (roles.includes('admin')) return 'admin';
        if (roles.includes('lender')) return 'lender';
        if (roles.includes('borrower')) return 'borrower';
        
        const group = localStorage.getItem('mpesewa_current_group');
        if (group) return 'group';
        
        const country = localStorage.getItem('mpesewa_country');
        if (country) return 'country';
        
        return 'global';
    }
    
    getCurrentHierarchy() {
        return {
            level: this.getCurrentHierarchyLevel(),
            country: localStorage.getItem('mpesewa_country'),
            group: localStorage.getItem('mpesewa_current_group'),
            user: this.getCurrentUserContext()
        };
    }
    
    getCurrentUserContext() {
        try {
            const user = JSON.parse(localStorage.getItem('mpesewa_user') || '{}');
            return {
                id: user.id || 'anonymous',
                roles: user.roles || [],
                email: user.email || 'unknown'
            };
        } catch (e) {
            return { id: 'anonymous', roles: [], email: 'unknown' };
        }
    }
    
    generateSubscriberId() {
        return 'sub_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    generateEventId() {
        return 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    addToHistory(eventData) {
        this.history.unshift(eventData);
        
        // Maintain history size
        if (this.history.length > this.maxHistorySize) {
            this.history.pop();
        }
        
        // Persist important events
        if (this.isImportantEvent(eventData)) {
            this.persistEvent(eventData);
        }
    }
    
    isImportantEvent(eventData) {
        const importantEvents = [
            'lender:ledger:created',
            'lender:loan:approved',
            'borrower:blacklisted',
            'borrower:reinstated',
            'admin:override:blacklist',
            'admin:override:ledger',
            'auth:login',
            'auth:logout'
        ];
        
        return importantEvents.includes(eventData.name) || 
               eventData.metadata.strict === true;
    }
    
    persistEvent(eventData) {
        try {
            const persisted = JSON.parse(localStorage.getItem('mpesewa_event_history') || '[]');
            persisted.unshift({
                ...eventData,
                persistedAt: new Date().toISOString()
            });
            
            // Keep only last 100 important events
            if (persisted.length > 100) {
                persisted.pop();
            }
            
            localStorage.setItem('mpesewa_event_history', JSON.stringify(persisted));
        } catch (e) {
            // Ignore storage errors
        }
    }
    
    dispatchDOMEvent(eventName, eventData) {
        const customEvent = new CustomEvent(`mpesewa:${eventName}`, {
            detail: eventData,
            bubbles: true,
            cancelable: true
        });
        
        document.dispatchEvent(customEvent);
    }
    
    // Query methods
    getEventsByType(type) {
        return this.history.filter(event => event.name === type);
    }
    
    getEventsByLevel(level) {
        return this.history.filter(event => event.metadata.level === level);
    }
    
    getEventsByTimeRange(startDate, endDate = new Date()) {
        return this.history.filter(event => {
            const eventDate = new Date(event.timestamp);
            return eventDate >= startDate && eventDate <= endDate;
        });
    }
    
    getEventStatistics() {
        const stats = {
            totalEvents: this.history.length,
            byType: {},
            byLevel: {},
            byHour: {},
            violations: 0
        };
        
        this.history.forEach(event => {
            // Count by type
            stats.byType[event.name] = (stats.byType[event.name] || 0) + 1;
            
            // Count by level
            stats.byLevel[event.metadata.level] = (stats.byLevel[event.metadata.level] || 0) + 1;
            
            // Count by hour
            const hour = new Date(event.timestamp).getHours();
            stats.byHour[hour] = (stats.byHour[hour] || 0) + 1;
            
            // Count violations
            if (event.hierarchyViolation) {
                stats.violations++;
            }
        });
        
        return stats;
    }
    
    // Chainable API for common patterns
    on(eventName, callback) {
        return this.subscribe(eventName, callback);
    }
    
    once(eventName, callback) {
        return this.subscribe(eventName, callback, { once: true });
    }
    
    off(eventName, unsubscribe) {
        if (typeof unsubscribe === 'function') {
            unsubscribe();
        }
    }
    
    // Request-Response pattern
    request(eventName, data, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const responseEvent = `${eventName}:response`;
            const timeoutId = setTimeout(() => {
                this.unsubscribe(responseEvent, handlerId);
                reject(new Error(`Event request timeout: ${eventName}`));
            }, timeout);
            
            const handlerId = this.subscribe(responseEvent, (response) => {
                clearTimeout(timeoutId);
                resolve(response.data);
            }, { once: true });
            
            this.emit(eventName, data);
        });
    }
    
    // Command pattern with acknowledgement
    command(eventName, data) {
        const commandId = this.generateEventId();
        const ackEvent = `${eventName}:ack:${commandId}`;
        
        return {
            id: commandId,
            execute: () => {
                return new Promise((resolve, reject) => {
                    const timeoutId = setTimeout(() => {
                        this.unsubscribe(ackEvent, handlerId);
                        reject(new Error(`Command acknowledgement timeout: ${eventName}`));
                    }, 3000);
                    
                    const handlerId = this.subscribe(ackEvent, (ack) => {
                        clearTimeout(timeoutId);
                        if (ack.data.success) {
                            resolve(ack.data);
                        } else {
                            reject(new Error(ack.data.error || 'Command failed'));
                        }
                    }, { once: true });
                    
                    this.emit(eventName, {
                        ...data,
                        commandId,
                        timestamp: new Date().toISOString()
                    });
                });
            }
        };
    }
}

// Create global instance
window.mpesewaEventBus = new MpesewaEventBus();

// Export for module systems
export default MpesewaEventBus;