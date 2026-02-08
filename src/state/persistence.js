/**
 * M-PESEWA STATE PERSISTENCE MANAGER
 * Handles storage, retrieval, and migration of application state
 * Ensures data survives page reloads and maintains consistency
 */

class StatePersistence {
    constructor(store) {
        this.store = store;
        this.storageKey = 'mpesewa_state';
        this.backupKey = 'mpesewa_state_backup';
        this.criticalKey = 'mpesewa_state_critical';
        this.versionKey = 'mpesewa_state_version';
        this.currentVersion = '1.0.0';
        
        // Compression support
        this.useCompression = typeof CompressionStream !== 'undefined';
        
        // Encryption support (basic)
        this.useEncryption = false;
        this.encryptionKey = null;
        
        // Initialize
        this.init();
    }
    
    /**
     * INITIALIZE PERSISTENCE SYSTEM
     */
    init() {
        // Check storage availability
        this.checkStorageAvailability();
        
        // Load encryption key if available
        this.loadEncryptionKey();
        
        // Setup storage event listeners
        this.setupStorageListeners();
        
        // Setup beforeunload handler
        this.setupBeforeUnload();
        
        console.log('State Persistence initialized');
    }
    
    /**
     * CHECK STORAGE AVAILABILITY
     */
    checkStorageAvailability() {
        try {
            localStorage.setItem('mpesewa_test', 'test');
            localStorage.removeItem('mpesewa_test');
            this.storageAvailable = true;
        } catch (e) {
            console.warn('LocalStorage not available:', e);
            this.storageAvailable = false;
            
            // Fallback to sessionStorage
            try {
                sessionStorage.setItem('mpesewa_test', 'test');
                sessionStorage.removeItem('mpesewa_test');
                this.storageAvailable = true;
                this.storageKey = 'session_' + this.storageKey;
            } catch (e2) {
                console.error('No storage available:', e2);
                this.storageAvailable = false;
            }
        }
        
        // Check quota
        this.checkStorageQuota();
    }
    
    /**
     * CHECK STORAGE QUOTA
     */
    checkStorageQuota() {
        if (!this.storageAvailable) return;
        
        try {
            const storage = localStorage;
            let total = 0;
            
            for (let i = 0; i < storage.length; i++) {
                const key = storage.key(i);
                const value = storage.getItem(key);
                total += key.length + value.length;
            }
            
            const quotaLimit = 5 * 1024 * 1024; // 5MB typical limit
            const usagePercent = (total / quotaLimit) * 100;
            
            if (usagePercent > 80) {
                console.warn(`Storage usage high: ${usagePercent.toFixed(1)}%`);
                this.cleanupOldData();
            }
            
            this.storageUsage = total;
            this.storageQuota = quotaLimit;
            
        } catch (error) {
            console.warn('Could not check storage quota:', error);
        }
    }
    
    /**
     * LOAD ENCRYPTION KEY
     */
    loadEncryptionKey() {
        try {
            const storedKey = localStorage.getItem('mpesewa_enc_key');
            if (storedKey) {
                this.encryptionKey = storedKey;
                this.useEncryption = true;
            } else {
                // Generate new key
                this.encryptionKey = this.generateEncryptionKey();
                localStorage.setItem('mpesewa_enc_key', this.encryptionKey);
                this.useEncryption = true;
            }
        } catch (error) {
            console.warn('Encryption not available:', error);
            this.useEncryption = false;
        }
    }
    
    /**
     * GENERATE ENCRYPTION KEY
     */
    generateEncryptionKey() {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }
    
    /**
     * SETUP STORAGE EVENT LISTENERS
     */
    setupStorageListeners() {
        // Listen for storage events from other tabs
        window.addEventListener('storage', (event) => {
            if (event.key === this.storageKey) {
                console.log('Storage changed in another tab, reloading state');
                this.loadState();
            }
        });
        
        // Listen for custom persistence events
        window.addEventListener('mpesewa:save-state', () => {
            this.saveState(this.store.getState());
        });
        
        window.addEventListener('mpesewa:load-state', () => {
            this.loadState();
        });
        
        window.addEventListener('mpesewa:clear-state', () => {
            this.clearState();
        });
    }
    
    /**
     * SETUP BEFOREUNLOAD HANDLER
     */
    setupBeforeUnload() {
        window.addEventListener('beforeunload', () => {
            // Save critical data immediately
            this.saveCriticalData(this.store.getState());
            
            // Try to save full state
            try {
                this.saveState(this.store.getState(), true); // Force save
            } catch (error) {
                console.warn('Could not save state on unload:', error);
            }
        });
    }
    
    /**
     * SAVE STATE TO STORAGE
     */
    async saveState(state, force = false) {
        if (!this.storageAvailable && !force) {
            return false;
        }
        
        try {
            // Prepare state for storage
            const stateToSave = this.prepareStateForStorage(state);
            
            // Add version and timestamp
            stateToSave._persist = {
                version: this.currentVersion,
                timestamp: new Date().toISOString(),
                checksum: this.generateChecksum(stateToSave)
            };
            
            // Stringify state
            const stateString = JSON.stringify(stateToSave);
            
            // Compress if supported and state is large
            let finalData = stateString;
            if (this.useCompression && stateString.length > 1024) {
                finalData = await this.compressData(stateString);
            }
            
            // Encrypt if enabled
            if (this.useEncryption) {
                finalData = await this.encryptData(finalData);
            }
            
            // Save to storage
            const storage = this.getStorage();
            storage.setItem(this.storageKey, finalData);
            
            // Create backup
            this.createBackup(finalData);
            
            // Update version
            storage.setItem(this.versionKey, this.currentVersion);
            
            // Dispatch event
            window.dispatchEvent(new CustomEvent('mpesewa:state-saved', {
                detail: { timestamp: new Date().toISOString() }
            }));
            
            console.log('State saved successfully');
            return true;
            
        } catch (error) {
            console.error('Failed to save state:', error);
            
            // Try to save critical data only
            this.saveCriticalData(state);
            return false;
        }
    }
    
    /**
     * PREPARE STATE FOR STORAGE
     */
    prepareStateForStorage(state) {
        const replacer = (key, value) => {
            // Skip functions
            if (typeof value === 'function') {
                return undefined;
            }
            
            // Convert Dates to ISO strings
            if (value instanceof Date) {
                return value.toISOString();
            }
            
            // Skip internal properties
            if (key.startsWith('_')) {
                return undefined;
            }
            
            // Skip listeners
            if (key === 'listeners') {
                return undefined;
            }
            
            // Handle circular references
            if (value === state) {
                return undefined;
            }
            
            // Truncate large arrays if needed
            if (Array.isArray(value) && value.length > 1000) {
                return value.slice(0, 1000);
            }
            
            return value;
        };
        
        return JSON.parse(JSON.stringify(state, replacer));
    }
    
    /**
     * GENERATE CHECKSUM
     */
    generateChecksum(data) {
        const str = JSON.stringify(data);
        let hash = 0;
        
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        
        return hash.toString(16);
    }
    
    /**
     * COMPRESS DATA
     */
    async compressData(data) {
        try {
            const encoder = new TextEncoder();
            const dataStream = encoder.encode(data);
            
            const compressionStream = new CompressionStream('gzip');
            const writer = compressionStream.writable.getWriter();
            writer.write(dataStream);
            writer.close();
            
            const compressedStream = compressionStream.readable;
            const reader = compressedStream.getReader();
            const chunks = [];
            
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                chunks.push(value);
            }
            
            // Convert to base64 for storage
            const compressed = new Uint8Array(chunks.reduce((acc, chunk) => acc + chunk.length, 0));
            let offset = 0;
            chunks.forEach(chunk => {
                compressed.set(chunk, offset);
                offset += chunk.length;
            });
            
            return btoa(String.fromCharCode(...compressed));
            
        } catch (error) {
            console.warn('Compression failed:', error);
            return data;
        }
    }
    
    /**
     * DECOMPRESS DATA
     */
    async decompressData(compressedData) {
        try {
            // Convert from base64
            const binaryString = atob(compressedData);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            
            const decompressionStream = new DecompressionStream('gzip');
            const writer = decompressionStream.writable.getWriter();
            writer.write(bytes);
            writer.close();
            
            const decompressedStream = decompressionStream.readable;
            const reader = decompressedStream.getReader();
            const chunks = [];
            
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                chunks.push(value);
            }
            
            const decoder = new TextDecoder();
            const decompressed = new Uint8Array(chunks.reduce((acc, chunk) => acc + chunk.length, 0));
            let offset = 0;
            chunks.forEach(chunk => {
                decompressed.set(chunk, offset);
                offset += chunk.length;
            });
            
            return decoder.decode(decompressed);
            
        } catch (error) {
            console.warn('Decompression failed:', error);
            return compressedData;
        }
    }
    
    /**
     * ENCRYPT DATA
     */
    async encryptData(data) {
        if (!this.useEncryption || !this.encryptionKey) {
            return data;
        }
        
        try {
            const encoder = new TextEncoder();
            const dataBuffer = encoder.encode(data);
            
            // Generate IV
            const iv = crypto.getRandomValues(new Uint8Array(12));
            
            // Import key
            const keyBuffer = new Uint8Array(this.encryptionKey.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
            const key = await crypto.subtle.importKey(
                'raw',
                keyBuffer,
                { name: 'AES-GCM' },
                false,
                ['encrypt']
            );
            
            // Encrypt
            const encrypted = await crypto.subtle.encrypt(
                {
                    name: 'AES-GCM',
                    iv: iv
                },
                key,
                dataBuffer
            );
            
            // Combine IV and encrypted data
            const result = new Uint8Array(iv.length + encrypted.byteLength);
            result.set(iv);
            result.set(new Uint8Array(encrypted), iv.length);
            
            // Convert to base64
            return btoa(String.fromCharCode(...result));
            
        } catch (error) {
            console.warn('Encryption failed:', error);
            return data;
        }
    }
    
    /**
     * DECRYPT DATA
     */
    async decryptData(encryptedData) {
        if (!this.useEncryption || !this.encryptionKey) {
            return encryptedData;
        }
        
        try {
            // Convert from base64
            const binaryString = atob(encryptedData);
            const encryptedBuffer = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
                encryptedBuffer[i] = binaryString.charCodeAt(i);
            }
            
            // Extract IV (first 12 bytes)
            const iv = encryptedBuffer.slice(0, 12);
            const data = encryptedBuffer.slice(12);
            
            // Import key
            const keyBuffer = new Uint8Array(this.encryptionKey.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
            const key = await crypto.subtle.importKey(
                'raw',
                keyBuffer,
                { name: 'AES-GCM' },
                false,
                ['decrypt']
            );
            
            // Decrypt
            const decrypted = await crypto.subtle.decrypt(
                {
                    name: 'AES-GCM',
                    iv: iv
                },
                key,
                data
            );
            
            // Convert to string
            const decoder = new TextDecoder();
            return decoder.decode(decrypted);
            
        } catch (error) {
            console.warn('Decryption failed:', error);
            return encryptedData;
        }
    }
    
    /**
     * GET STORAGE INSTANCE
     */
    getStorage() {
        return this.storageKey.startsWith('session_') ? sessionStorage : localStorage;
    }
    
    /**
     * CREATE BACKUP
     */
    createBackup(data) {
        try {
            const storage = this.getStorage();
            const backups = JSON.parse(storage.getItem(this.backupKey) || '[]');
            
            // Keep only last 5 backups
            if (backups.length >= 5) {
                backups.shift();
            }
            
            backups.push({
                data,
                timestamp: new Date().toISOString(),
                version: this.currentVersion
            });
            
            storage.setItem(this.backupKey, JSON.stringify(backups));
            
        } catch (error) {
            console.warn('Could not create backup:', error);
        }
    }
    
    /**
     * LOAD STATE FROM STORAGE
     */
    async loadState() {
        if (!this.storageAvailable) {
            console.log('No storage available, using initial state');
            return null;
        }
        
        try {
            const storage = this.getStorage();
            let stateData = storage.getItem(this.storageKey);
            
            if (!stateData) {
                console.log('No saved state found');
                return null;
            }
            
            // Try to decrypt if needed
            if (this.useEncryption) {
                stateData = await this.decryptData(stateData);
            }
            
            // Try to decompress if needed
            if (stateData.startsWith('H4sI') || stateData.includes('==')) {
                try {
                    stateData = await this.decompressData(stateData);
                } catch (e) {
                    // Not compressed or compression failed
                }
            }
            
            // Parse state
            let parsedState;
            try {
                parsedState = JSON.parse(stateData);
            } catch (parseError) {
                console.error('Failed to parse state:', parseError);
                
                // Try to load from backup
                return this.loadFromBackup();
            }
            
            // Verify checksum
            if (parsedState._persist && parsedState._persist.checksum) {
                const expectedChecksum = parsedState._persist.checksum;
                delete parsedState._persist.checksum;
                
                const actualChecksum = this.generateChecksum(parsedState);
                if (expectedChecksum !== actualChecksum) {
                    console.warn('State checksum mismatch, loading from backup');
                    return this.loadFromBackup();
                }
            }
            
            // Apply migrations if needed
            const migratedState = this.applyMigrations(parsedState);
            
            // Remove persistence metadata
            delete migratedState._persist;
            
            // Rehydrate dates and special objects
            this.rehydrateState(migratedState);
            
            console.log('State loaded successfully');
            return migratedState;
            
        } catch (error) {
            console.error('Failed to load state:', error);
            
            // Try to load critical data
            return this.loadCriticalData();
        }
    }
    
    /**
     * LOAD FROM BACKUP
     */
    async loadFromBackup() {
        try {
            const storage = this.getStorage();
            const backups = JSON.parse(storage.getItem(this.backupKey) || '[]');
            
            if (backups.length === 0) {
                console.log('No backups available');
                return null;
            }
            
            // Get most recent backup
            const latestBackup = backups[backups.length - 1];
            let backupData = latestBackup.data;
            
            // Try to decrypt if needed
            if (this.useEncryption) {
                backupData = await this.decryptData(backupData);
            }
            
            // Try to decompress if needed
            if (backupData.startsWith('H4sI') || backupData.includes('==')) {
                try {
                    backupData = await this.decompressData(backupData);
                } catch (e) {
                    // Not compressed or compression failed
                }
            }
            
            const parsedBackup = JSON.parse(backupData);
            delete parsedBackup._persist;
            
            // Rehydrate
            this.rehydrateState(parsedBackup);
            
            console.log('State loaded from backup');
            return parsedBackup;
            
        } catch (error) {
            console.error('Failed to load from backup:', error);
            return null;
        }
    }
    
    /**
     * APPLY MIGRATIONS
     */
    applyMigrations(state) {
        const version = state._persist?.version || '0.0.0';
        
        if (version === this.currentVersion) {
            return state;
        }
        
        console.log(`Migrating state from ${version} to ${this.currentVersion}`);
        
        // Migration steps based on version
        const migrations = {
            '0.1.0': (s) => this.migrateTo_0_1_0(s),
            '0.2.0': (s) => this.migrateTo_0_2_0(s),
            '1.0.0': (s) => this.migrateTo_1_0_0(s)
        };
        
        let currentVersion = version;
        let migratedState = { ...state };
        
        // Apply migrations in order
        const versionOrder = ['0.1.0', '0.2.0', '1.0.0'];
        const startIndex = versionOrder.indexOf(currentVersion);
        
        if (startIndex >= 0) {
            for (let i = startIndex; i < versionOrder.length; i++) {
                const targetVersion = versionOrder[i];
                if (migrations[targetVersion]) {
                    migratedState = migrations[targetVersion](migratedState);
                    currentVersion = targetVersion;
                }
            }
        }
        
        // Update version
        migratedState._persist = migratedState._persist || {};
        migratedState._persist.version = this.currentVersion;
        migratedState._persist.migratedFrom = version;
        migratedState._persist.migrationTimestamp = new Date().toISOString();
        
        return migratedState;
    }
    
    /**
     * MIGRATION TO 0.1.0
     */
    migrateTo_0_1_0(state) {
        // Initial migration - ensure basic structure
        if (!state.auth) state.auth = {};
        if (!state.user) state.user = {};
        if (!state.country) state.country = {};
        
        return state;
    }
    
    /**
     * MIGRATION TO 0.2.0
     */
    migrateTo_0_2_0(state) {
        // Add subscription structure
        if (!state.subscription) {
            state.subscription = {
                plans: {},
                currentPlan: null,
                paymentHistory: []
            };
        }
        
        // Add ledger structure
        if (!state.ledger) {
            state.ledger = {
                ledgers: {},
                activeLedgers: []
            };
        }
        
        return state;
    }
    
    /**
     * MIGRATION TO 1.0.0
     */
    migrateTo_1_0_0(state) {
        // Ensure all required slices exist
        const requiredSlices = [
            'auth', 'user', 'role', 'country', 'group', 'lender', 'borrower',
            'ledger', 'subscription', 'blacklist', 'ui', 'pwa', 'sync',
            'navigation', 'notification', 'audit', 'meta'
        ];
        
        requiredSlices.forEach(slice => {
            if (!state[slice]) {
                state[slice] = {};
            }
        });
        
        // Ensure meta has version
        if (!state.meta) state.meta = {};
        state.meta.version = '1.0.0';
        
        return state;
    }
    
    /**
     * REHYDRATE STATE
     */
    rehydrateState(state) {
        // Convert ISO date strings back to Date objects
        const traverseAndConvertDates = (obj) => {
            if (!obj || typeof obj !== 'object') return;
            
            for (const key in obj) {
                const value = obj[key];
                
                if (typeof value === 'string') {
                    // Check if it's an ISO date string
                    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
                        const date = new Date(value);
                        if (!isNaN(date.getTime())) {
                            obj[key] = date;
                        }
                    }
                } else if (typeof value === 'object' && value !== null) {
                    traverseAndConvertDates(value);
                }
            }
        };
        
        traverseAndConvertDates(state);
        
        return state;
    }
    
    /**
     * SAVE CRITICAL DATA
     */
    saveCriticalData(state) {
        if (!this.storageAvailable) return;
        
        try {
            const criticalData = {
                auth: {
                    isAuthenticated: state.auth.isAuthenticated,
                    user: state.auth.user,
                    token: state.auth.token,
                    sessionExpiry: state.auth.sessionExpiry
                },
                user: {
                    id: state.user.id,
                    username: state.user.username,
                    email: state.user.email
                },
                country: {
                    currentCountry: state.country.currentCountry
                },
                meta: {
                    lastUpdated: new Date().toISOString(),
                    deviceId: state.meta.deviceId
                }
            };
            
            const storage = this.getStorage();
            storage.setItem(this.criticalKey, JSON.stringify(criticalData));
            
        } catch (error) {
            console.warn('Could not save critical data:', error);
        }
    }
    
    /**
     * LOAD CRITICAL DATA
     */
    loadCriticalData() {
        if (!this.storageAvailable) return null;
        
        try {
            const storage = this.getStorage();
            const criticalData = storage.getItem(this.criticalKey);
            
            if (!criticalData) return null;
            
            const parsed = JSON.parse(criticalData);
            this.rehydrateState(parsed);
            
            return parsed;
            
        } catch (error) {
            console.warn('Could not load critical data:', error);
            return null;
        }
    }
    
    /**
     * CLEANUP OLD DATA
     */
    cleanupOldData() {
        try {
            const storage = this.getStorage();
            
            // Get all M-Pesewa keys
            const keys = [];
            for (let i = 0; i < storage.length; i++) {
                const key = storage.key(i);
                if (key.includes('mpesewa')) {
                    keys.push(key);
                }
            }
            
            // Sort by last access (approximate)
            keys.sort((a, b) => {
                // Simple heuristic: newer keys might have timestamps
                return a.localeCompare(b);
            });
            
            // Remove oldest keys until we're under 80% quota
            let removed = 0;
            for (const key of keys) {
                if (key === this.criticalKey || key === this.versionKey) {
                    continue; // Don't remove critical keys
                }
                
                storage.removeItem(key);
                removed++;
                
                // Check quota again
                this.checkStorageQuota();
                if (this.storageUsage / this.storageQuota < 0.7) {
                    break;
                }
            }
            
            if (removed > 0) {
                console.log(`Cleaned up ${removed} old items`);
            }
            
        } catch (error) {
            console.warn('Cleanup failed:', error);
        }
    }
    
    /**
     * CLEAR STATE
     */
    clearState() {
        if (!this.storageAvailable) return;
        
        try {
            const storage = this.getStorage();
            
            // Remove all M-Pesewa keys except encryption key
            for (let i = 0; i < storage.length; i++) {
                const key = storage.key(i);
                if (key.includes('mpesewa') && key !== 'mpesewa_enc_key') {
                    storage.removeItem(key);
                }
            }
            
            console.log('State cleared from storage');
            
        } catch (error) {
            console.error('Failed to clear state:', error);
        }
    }
    
    /**
     * EXPORT STATE TO FILE
     */
    async exportToFile() {
        try {
            const state = this.store.getState();
            const stateString = JSON.stringify(this.prepareStateForStorage(state), null, 2);
            
            const blob = new Blob([stateString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `mpesewa_state_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            URL.revokeObjectURL(url);
            
            console.log('State exported to file');
            return true;
            
        } catch (error) {
            console.error('Export failed:', error);
            return false;
        }
    }
    
    /**
     * IMPORT STATE FROM FILE
     */
    async importFromFile(file) {
        return new Promise((resolve, reject) => {
            if (!file) {
                reject(new Error('No file provided'));
                return;
            }
            
            const reader = new FileReader();
            
            reader.onload = async (event) => {
                try {
                    const content = event.target.result;
                    const importedState = JSON.parse(content);
                    
                    // Validate basic structure
                    if (!importedState.auth || !importedState.user) {
                        throw new Error('Invalid state file format');
                    }
                    
                    // Apply migrations
                    const migratedState = this.applyMigrations(importedState);
                    
                    // Save to storage
                    await this.saveState(migratedState, true);
                    
                    // Update store
                    this.store.setState(migratedState);
                    
                    console.log('State imported from file');
                    resolve(true);
                    
                } catch (error) {
                    console.error('Import failed:', error);
                    reject(error);
                }
            };
            
            reader.onerror = () => {
                reject(new Error('Failed to read file'));
            };
            
            reader.readAsText(file);
        });
    }
    
    /**
     * GET STORAGE INFO
     */
    getStorageInfo() {
        return {
            available: this.storageAvailable,
            usage: this.storageUsage,
            quota: this.storageQuota,
            usagePercent: this.storageUsage && this.storageQuota 
                ? (this.storageUsage / this.storageQuota * 100).toFixed(1)
                : null,
            compression: this.useCompression,
            encryption: this.useEncryption,
            key: this.storageKey
        };
    }
}

// Create and export singleton
let persistenceInstance = null;

export function createPersistence(store) {
    if (!persistenceInstance) {
        persistenceInstance = new StatePersistence(store);
    }
    return persistenceInstance;
}

export default persistenceInstance;