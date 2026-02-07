/**
 * M-Pesewa Development Tools
 * Advanced debugging, state inspection, and performance monitoring
 * Non-negotiable for production debugging
 */

class MPesewaDevTools {
    constructor() {
        this.isEnabled = process.env.NODE_ENV === 'development';
        this.logs = [];
        this.performanceMetrics = {};
        this.stateSnapshots = [];
        this.maxLogs = 1000;
        this.maxSnapshots = 100;
        
        this.init();
    }

    init() {
        if (!this.isEnabled) return;
        
        // Create dev tools panel
        this.createPanel();
        
        // Hook into console
        this.hookConsole();
        
        // Monitor performance
        this.startPerformanceMonitoring();
        
        console.log('🎛️ M-Pesewa DevTools Initialized');
    }

    createPanel() {
        // Create floating dev tools button
        const button = document.createElement('button');
        button.innerHTML = '🔧';
        button.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: #003366;
            color: white;
            border: none;
            font-size: 24px;
            cursor: pointer;
            z-index: 9999;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        `;
        
        button.addEventListener('click', () => this.togglePanel());
        document.body.appendChild(button);
        
        this.devToolsButton = button;
        
        // Create dev tools panel
        const panel = document.createElement('div');
        panel.style.cssText = `
            position: fixed;
            bottom: 80px;
            right: 20px;
            width: 400px;
            height: 500px;
            background: white;
            border: 1px solid #ccc;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            display: none;
            flex-direction: column;
            z-index: 9998;
            font-family: monospace;
        `;
        
        panel.innerHTML = `
            <div style="padding: 10px; background: #003366; color: white; border-radius: 8px 8px 0 0;">
                <strong>M-Pesewa DevTools</strong>
                <button style="float: right; background: none; border: none; color: white; cursor: pointer;">×</button>
            </div>
            <div style="display: flex; border-bottom: 1px solid #ccc;">
                <button class="tab-btn active" data-tab="logs">Logs</button>
                <button class="tab-btn" data-tab="state">State</button>
                <button class="tab-btn" data-tab="performance">Performance</button>
                <button class="tab-btn" data-tab="storage">Storage</button>
            </div>
            <div class="tab-content" style="flex: 1; overflow: auto; padding: 10px;">
                <div id="logs-tab" class="tab-pane active">
                    <div style="margin-bottom: 10px;">
                        <button onclick="window.__MPESEWA_DEVTOOLS.clearLogs()">Clear</button>
                        <button onclick="window.__MPESEWA_DEVTOOLS.exportLogs()">Export</button>
                    </div>
                    <div id="logs-content" style="font-size: 12px;"></div>
                </div>
                <div id="state-tab" class="tab-pane" style="display: none;">
                    <div style="margin-bottom: 10px;">
                        <button onclick="window.__MPESEWA_DEVTOOLS.takeSnapshot()">Snapshot</button>
                        <button onclick="window.__MPESEWA_DEVTOILS.compareSnapshots()">Compare</button>
                    </div>
                    <div id="state-content"></div>
                </div>
                <div id="performance-tab" class="tab-pane" style="display: none;">
                    <div id="performance-content"></div>
                </div>
                <div id="storage-tab" class="tab-pane" style="display: none;">
                    <div id="storage-content"></div>
                </div>
            </div>
        `;
        
        document.body.appendChild(panel);
        this.devToolsPanel = panel;
        
        // Add event listeners
        panel.querySelector('button').addEventListener('click', () => this.hidePanel());
        panel.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.target.dataset.tab;
                this.switchTab(tab);
            });
        });
        
        // Make dev tools globally available
        window.__MPESEWA_DEVTOOLS = this;
    }

    togglePanel() {
        this.devToolsPanel.style.display = 
            this.devToolsPanel.style.display === 'flex' ? 'none' : 'flex';
    }

    showPanel() {
        this.devToolsPanel.style.display = 'flex';
    }

    hidePanel() {
        this.devToolsPanel.style.display = 'none';
    }

    switchTab(tabName) {
        // Update tab buttons
        this.devToolsPanel.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });
        
        // Show selected tab content
        this.devToolsPanel.querySelectorAll('.tab-pane').forEach(pane => {
            pane.style.display = pane.id === `${tabName}-tab` ? 'block' : 'none';
        });
        
        // Load tab content
        switch(tabName) {
            case 'logs':
                this.renderLogs();
                break;
            case 'state':
                this.renderState();
                break;
            case 'performance':
                this.renderPerformance();
                break;
            case 'storage':
                this.renderStorage();
                break;
        }
    }

    hookConsole() {
        const originalLog = console.log;
        const originalError = console.error;
        const originalWarn = console.warn;
        const originalInfo = console.info;
        
        console.log = (...args) => {
            this.log('log', args);
            originalLog.apply(console, args);
        };
        
        console.error = (...args) => {
            this.log('error', args);
            originalError.apply(console, args);
        };
        
        console.warn = (...args) => {
            this.log('warn', args);
            originalWarn.apply(console, args);
        };
        
        console.info = (...args) => {
            this.log('info', args);
            originalInfo.apply(console, args);
        };
    }

    log(type, args) {
        if (!this.isEnabled) return;
        
        const timestamp = new Date().toISOString();
        const message = args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' ');
        
        this.logs.unshift({
            type,
            timestamp,
            message,
            stack: new Error().stack
        });
        
        // Keep logs within limit
        if (this.logs.length > this.maxLogs) {
            this.logs.pop();
        }
        
        // Update UI if panel is visible
        if (this.devToolsPanel && this.devToolsPanel.style.display === 'flex') {
            this.renderLogs();
        }
    }

    renderLogs() {
        const container = this.devToolsPanel.querySelector('#logs-content');
        if (!container) return;
        
        const logsHTML = this.logs.map(log => `
            <div style="
                padding: 5px;
                border-bottom: 1px solid #eee;
                color: ${this.getLogColor(log.type)};
                font-family: monospace;
                font-size: 11px;
            ">
                <span style="color: #666;">[${log.timestamp.split('T')[1].split('.')[0]}]</span>
                <strong>${log.type.toUpperCase()}:</strong>
                ${log.message.substring(0, 200)}${log.message.length > 200 ? '...' : ''}
            </div>
        `).join('');
        
        container.innerHTML = logsHTML;
    }

    getLogColor(type) {
        switch(type) {
            case 'error': return '#dc3545';
            case 'warn': return '#ffc107';
            case 'info': return '#17a2b8';
            default: return '#333';
        }
    }

    clearLogs() {
        this.logs = [];
        this.renderLogs();
    }

    exportLogs() {
        const data = {
            exportDate: new Date().toISOString(),
            logs: this.logs
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `mpesewa-logs-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    startPerformanceMonitoring() {
        if (!performance) return;
        
        // Monitor page load performance
        window.addEventListener('load', () => {
            const perfData = performance.getEntriesByType('navigation')[0];
            this.performanceMetrics.pageLoad = {
                dns: perfData.domainLookupEnd - perfData.domainLookupStart,
                tcp: perfData.connectEnd - perfData.connectStart,
                request: perfData.responseEnd - perfData.requestStart,
                domComplete: perfData.domComplete,
                loadEvent: perfData.loadEventEnd - perfData.loadEventStart,
                total: perfData.loadEventEnd - perfData.fetchStart
            };
        });
        
        // Monitor memory usage (if available)
        if (performance.memory) {
            setInterval(() => {
                this.performanceMetrics.memory = {
                    used: performance.memory.usedJSHeapSize,
                    total: performance.memory.totalJSHeapSize,
                    limit: performance.memory.jsHeapSizeLimit
                };
            }, 10000);
        }
        
        // Monitor API calls
        const originalFetch = window.fetch;
        window.fetch = async (...args) => {
            const start = performance.now();
            const response = await originalFetch(...args);
            const end = performance.now();
            
            this.performanceMetrics.apiCalls = this.performanceMetrics.apiCalls || [];
            this.performanceMetrics.apiCalls.push({
                url: args[0],
                method: args[1]?.method || 'GET',
                duration: end - start,
                timestamp: new Date().toISOString(),
                status: response.status
            });
            
            return response;
        };
    }

    renderPerformance() {
        const container = this.devToolsPanel.querySelector('#performance-content');
        if (!container) return;
        
        let html = '<h4>Performance Metrics</h4>';
        
        if (this.performanceMetrics.pageLoad) {
            html += `
                <div style="margin-bottom: 15px;">
                    <h5>Page Load</h5>
                    <pre style="font-size: 10px;">${JSON.stringify(this.performanceMetrics.pageLoad, null, 2)}</pre>
                </div>
            `;
        }
        
        if (this.performanceMetrics.memory) {
            const usedMB = (this.performanceMetrics.memory.used / 1024 / 1024).toFixed(2);
            const totalMB = (this.performanceMetrics.memory.total / 1024 / 1024).toFixed(2);
            const limitMB = (this.performanceMetrics.memory.limit / 1024 / 1024).toFixed(2);
            
            html += `
                <div style="margin-bottom: 15px;">
                    <h5>Memory Usage</h5>
                    <p>Used: ${usedMB} MB / ${totalMB} MB (Limit: ${limitMB} MB)</p>
                    <div style="background: #eee; height: 20px; border-radius: 4px;">
                        <div style="
                            width: ${(this.performanceMetrics.memory.used / this.performanceMetrics.memory.total) * 100}%;
                            height: 100%;
                            background: ${(this.performanceMetrics.memory.used / this.performanceMetrics.memory.limit) > 0.8 ? '#dc3545' : '#28a745'};
                            border-radius: 4px;
                        "></div>
                    </div>
                </div>
            `;
        }
        
        if (this.performanceMetrics.apiCalls) {
            const recentCalls = this.performanceMetrics.apiCalls.slice(-10);
            html += `
                <div style="margin-bottom: 15px;">
                    <h5>Recent API Calls (Last 10)</h5>
                    ${recentCalls.map(call => `
                        <div style="
                            padding: 5px;
                            margin: 2px 0;
                            background: #f8f9fa;
                            border-left: 3px solid ${call.status >= 400 ? '#dc3545' : call.status >= 300 ? '#ffc107' : '#28a745'};
                            font-size: 10px;
                        ">
                            <strong>${call.method}</strong> ${call.url}<br/>
                            Status: ${call.status} | Duration: ${call.duration.toFixed(2)}ms
                        </div>
                    `).join('')}
                </div>
            `;
        }
        
        container.innerHTML = html;
    }

    renderState() {
        const container = this.devToolsPanel.querySelector('#state-content');
        if (!container) return;
        
        // Get current state from localStorage
        const state = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('mpesewa_')) {
                try {
                    state[key] = JSON.parse(localStorage.getItem(key));
                } catch {
                    state[key] = localStorage.getItem(key);
                }
            }
        }
        
        container.innerHTML = `
            <h4>Current State</h4>
            <pre style="font-size: 10px; max-height: 300px; overflow: auto;">
                ${JSON.stringify(state, null, 2)}
            </pre>
            <button onclick="window.__MPESEWA_DEVTOOLS.takeSnapshot()">Take Snapshot</button>
            <p>Snapshots: ${this.stateSnapshots.length}</p>
        `;
    }

    takeSnapshot() {
        const snapshot = {
            timestamp: new Date().toISOString(),
            state: {}
        };
        
        // Capture current state
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('mpesewa_')) {
                try {
                    snapshot.state[key] = JSON.parse(localStorage.getItem(key));
                } catch {
                    snapshot.state[key] = localStorage.getItem(key);
                }
            }
        }
        
        this.stateSnapshots.unshift(snapshot);
        
        if (this.stateSnapshots.length > this.maxSnapshots) {
            this.stateSnapshots.pop();
        }
        
        alert(`Snapshot taken at ${snapshot.timestamp}`);
    }

    compareSnapshots() {
        if (this.stateSnapshots.length < 2) {
            alert('Need at least 2 snapshots to compare');
            return;
        }
        
        const snapshot1 = this.stateSnapshots[0];
        const snapshot2 = this.stateSnapshots[1];
        
        const diff = this.findObjectDifference(snapshot1.state, snapshot2.state);
        
        const container = this.devToolsPanel.querySelector('#state-content');
        container.innerHTML = `
            <h4>State Comparison</h4>
            <p>Comparing ${snapshot1.timestamp} with ${snapshot2.timestamp}</p>
            <pre style="font-size: 10px; max-height: 300px; overflow: auto;">
                ${JSON.stringify(diff, null, 2)}
            </pre>
        `;
    }

    findObjectDifference(obj1, obj2) {
        const diff = {};
        
        // Check for keys in obj1 but not in obj2
        Object.keys(obj1).forEach(key => {
            if (!obj2.hasOwnProperty(key)) {
                diff[key] = { removed: obj1[key] };
            } else if (JSON.stringify(obj1[key]) !== JSON.stringify(obj2[key])) {
                diff[key] = { 
                    old: obj1[key],
                    new: obj2[key]
                };
            }
        });
        
        // Check for keys in obj2 but not in obj1
        Object.keys(obj2).forEach(key => {
            if (!obj1.hasOwnProperty(key)) {
                diff[key] = { added: obj2[key] };
            }
        });
        
        return diff;
    }

    renderStorage() {
        const container = this.devToolsPanel.querySelector('#storage-content');
        if (!container) return;
        
        let totalSize = 0;
        const storageItems = [];
        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const value = localStorage.getItem(key);
            const size = new Blob([value]).size;
            totalSize += size;
            
            storageItems.push({
                key,
                size,
                valueLength: value.length
            });
        }
        
        const sortedItems = storageItems.sort((a, b) => b.size - a.size);
        
        let html = `
            <h4>Local Storage</h4>
            <p>Total size: ${(totalSize / 1024).toFixed(2)} KB</p>
            <p>Items: ${localStorage.length}</p>
            <div style="max-height: 300px; overflow: auto;">
                <table style="width: 100%; font-size: 10px;">
                    <thead>
                        <tr>
                            <th style="text-align: left;">Key</th>
                            <th style="text-align: right;">Size</th>
                            <th style="text-align: right;">Length</th>
                            <th style="text-align: center;">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        sortedItems.forEach(item => {
            const isMpesewaKey = item.key.startsWith('mpesewa_');
            html += `
                <tr style="${isMpesewaKey ? 'background: #f0f8ff;' : ''}">
                    <td style="padding: 2px;">${item.key}</td>
                    <td style="text-align: right; padding: 2px;">${(item.size / 1024).toFixed(2)} KB</td>
                    <td style="text-align: right; padding: 2px;">${item.valueLength}</td>
                    <td style="text-align: center; padding: 2px;">
                        <button onclick="window.__MPESEWA_DEVTOOLS.viewItem('${item.key}')" style="font-size: 10px;">View</button>
                        ${!isMpesewaKey ? `<button onclick="localStorage.removeItem('${item.key}'); location.reload();" style="font-size: 10px;">Delete</button>` : ''}
                    </td>
                </tr>
            `;
        });
        
        html += `
                    </tbody>
                </table>
            </div>
            <div style="margin-top: 10px;">
                <button onclick="window.__MPESEWA_DEVTOOLS.clearStorage()" style="background: #dc3545; color: white;">Clear Non-Mpesewa Items</button>
                <button onclick="window.__MPESEWA_DEVTOOLS.exportStorage()">Export Storage</button>
            </div>
        `;
        
        container.innerHTML = html;
    }

    viewItem(key) {
        const value = localStorage.getItem(key);
        try {
            const parsed = JSON.parse(value);
            alert(`${key}:\n\n${JSON.stringify(parsed, null, 2)}`);
        } catch {
            alert(`${key}:\n\n${value}`);
        }
    }

    clearStorage() {
        const keysToRemove = [];
        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (!key.startsWith('mpesewa_')) {
                keysToRemove.push(key);
            }
        }
        
        keysToRemove.forEach(key => localStorage.removeItem(key));
        alert(`Removed ${keysToRemove.length} non-Mpesewa items`);
        this.renderStorage();
    }

    exportStorage() {
        const exportData = {};
        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            try {
                exportData[key] = JSON.parse(localStorage.getItem(key));
            } catch {
                exportData[key] = localStorage.getItem(key);
            }
        }
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `mpesewa-storage-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    // Error boundary for React-like error catching
    captureError(error, errorInfo) {
        this.log('error', [
            'Error captured:',
            error.toString(),
            'Component stack:',
            errorInfo?.componentStack || 'N/A'
        ]);
        
        // Send to error tracking service (if configured)
        if (window.__MPESEWA_ERROR_TRACKING) {
            window.__MPESEWA_ERROR_TRACKING.captureException(error);
        }
    }

    // Performance measurement
    measurePerformance(name, fn) {
        const start = performance.now();
        const result = fn();
        const end = performance.now();
        
        this.performanceMetrics.custom = this.performanceMetrics.custom || [];
        this.performanceMetrics.custom.push({
            name,
            duration: end - start,
            timestamp: new Date().toISOString()
        });
        
        return result;
    }

    // Memory leak detection
    checkForMemoryLeaks() {
        if (!performance.memory) return null;
        
        const used = performance.memory.usedJSHeapSize;
        const leakThreshold = 100 * 1024 * 1024; // 100MB
        
        if (used > leakThreshold) {
            this.log('warn', [`Potential memory leak detected: ${(used / 1024 / 1024).toFixed(2)}MB used`]);
            return {
                warning: 'Potential memory leak',
                usedMB: (used / 1024 / 1024).toFixed(2),
                thresholdMB: (leakThreshold / 1024 / 1024).toFixed(2)
            };
        }
        
        return null;
    }
}

// Export singleton instance
const devTools = new MPesewaDevTools();
export default devTools;