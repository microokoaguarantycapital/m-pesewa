// layout/NotificationBar.js
// M-Pesewa NotificationBar Component - Real-time Notifications & Alerts

class MPNotificationBar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.notifications = [];
        this.isExpanded = false;
        this.maxNotifications = 5;
        this.currentUserRole = localStorage.getItem('mpesewa_user_role') || 'guest';
        this.websocket = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
    }

    connectedCallback() {
        this.loadNotifications();
        this.render();
        this.setupEventListeners();
        this.setupWebSocket();
        this.startPolling();
    }

    disconnectedCallback() {
        this.stopPolling();
        this.closeWebSocket();
    }

    loadNotifications() {
        // Load notifications from localStorage
        const savedNotifications = JSON.parse(localStorage.getItem('mpesewa_notifications') || '[]');
        
        // If no saved notifications, create default ones based on user role
        if (savedNotifications.length === 0) {
            this.notifications = this.getDefaultNotifications();
            this.saveNotifications();
        } else {
            this.notifications = savedNotifications;
        }

        // Mark expired notifications as read
        const now = new Date();
        this.notifications.forEach(notification => {
            if (notification.expiresAt && new Date(notification.expiresAt) < now) {
                notification.read = true;
            }
        });
    }

    getDefaultNotifications() {
        const baseNotifications = [
            {
                id: 'welcome',
                title: 'Welcome to M-Pesewa!',
                message: 'Start your journey with trusted emergency lending.',
                type: 'info',
                icon: '👋',
                timestamp: new Date().toISOString(),
                read: false,
                priority: 1,
                actions: [
                    { label: 'Get Started', action: 'redirect', data: 'auth/register.html' },
                    { label: 'Learn More', action: 'redirect', data: 'how-it-works.html' }
                ]
            },
            {
                id: 'country-select',
                title: 'Select Your Country',
                message: 'Choose your country to see relevant groups and lenders.',
                type: 'warning',
                icon: '🌍',
                timestamp: new Date().toISOString(),
                read: false,
                priority: 2,
                actions: [
                    { label: 'Select Country', action: 'redirect', data: 'countries/index.html' }
                ]
            }
        ];

        // Role-specific notifications
        if (this.currentUserRole === 'lender') {
            baseNotifications.push({
                id: 'lender-guide',
                title: 'Lender Guide Available',
                message: 'Learn how to lend safely and effectively.',
                type: 'info',
                icon: '💰',
                timestamp: new Date().toISOString(),
                read: false,
                priority: 3,
                actions: [
                    { label: 'View Guide', action: 'redirect', data: 'lender/rules.html' }
                ]
            });
        } else if (this.currentUserRole === 'borrower') {
            baseNotifications.push({
                id: 'borrower-guide',
                title: 'Borrower Guide Available',
                message: 'Learn how to borrow responsibly.',
                type: 'info',
                icon: '🤝',
                timestamp: new Date().toISOString(),
                read: false,
                priority: 3,
                actions: [
                    { label: 'View Guide', action: 'redirect', data: 'borrower/apply.html' }
                ]
            });
        }

        return baseNotifications;
    }

    saveNotifications() {
        localStorage.setItem('mpesewa_notifications', JSON.stringify(this.notifications));
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                /* NOTIFICATION BAR STYLES */
                :host {
                    display: block;
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
                    position: relative;
                    z-index: 35;
                }
                
                .notification-container {
                    position: fixed;
                    top: 0;
                    right: 0;
                    bottom: 0;
                    width: 400px;
                    background: white;
                    box-shadow: -4px 0 20px rgba(0, 0, 0, 0.15);
                    transform: translateX(100%);
                    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    display: flex;
                    flex-direction: column;
                    z-index: 1000;
                }
                
                .notification-container.expanded {
                    transform: translateX(0);
                }
                
                /* Toggle Button */
                .notification-toggle {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    width: 50px;
                    height: 50px;
                    border-radius: 25px;
                    background: #003366;
                    color: white;
                    border: none;
                    box-shadow: 0 4px 12px rgba(0, 51, 102, 0.3);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 20px;
                    z-index: 999;
                    transition: all 0.3s ease;
                }
                
                .notification-toggle:hover {
                    transform: scale(1.1);
                    box-shadow: 0 6px 16px rgba(0, 51, 102, 0.4);
                }
                
                .notification-toggle:active {
                    transform: scale(0.95);
                }
                
                .notification-badge {
                    position: absolute;
                    top: -5px;
                    right: -5px;
                    background: #f37021;
                    color: white;
                    font-size: 12px;
                    font-weight: 600;
                    min-width: 20px;
                    height: 20px;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0 6px;
                }
                
                /* Header */
                .notification-header {
                    padding: 20px;
                    border-bottom: 1px solid #e5e7eb;
                    background: #003366;
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }
                
                .notification-title {
                    font-size: 18px;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                
                .notification-count {
                    background: rgba(255, 255, 255, 0.2);
                    padding: 2px 10px;
                    border-radius: 12px;
                    font-size: 12px;
                    font-weight: 500;
                }
                
                .close-btn {
                    background: rgba(255, 255, 255, 0.1);
                    border: none;
                    width: 36px;
                    height: 36px;
                    border-radius: 8px;
                    color: white;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 18px;
                    transition: background 0.2s ease;
                }
                
                .close-btn:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
                
                /* Controls */
                .notification-controls {
                    padding: 15px 20px;
                    border-bottom: 1px solid #e5e7eb;
                    display: flex;
                    gap: 10px;
                    background: #f8f9fa;
                }
                
                .control-btn {
                    padding: 8px 16px;
                    border: 1px solid #d1d5db;
                    background: white;
                    border-radius: 6px;
                    font-size: 13px;
                    font-weight: 500;
                    color: #4b5563;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    transition: all 0.2s ease;
                }
                
                .control-btn:hover {
                    background: #f3f4f6;
                    border-color: #9ca3af;
                }
                
                .control-btn.primary {
                    background: #003366;
                    color: white;
                    border-color: #003366;
                }
                
                .control-btn.primary:hover {
                    background: #002244;
                }
                
                /* Notifications List */
                .notifications-list {
                    flex: 1;
                    overflow-y: auto;
                    padding: 0;
                    scrollbar-width: thin;
                    scrollbar-color: #cbd5e1 #f1f5f9;
                }
                
                .notifications-list::-webkit-scrollbar {
                    width: 6px;
                }
                
                .notifications-list::-webkit-scrollbar-track {
                    background: #f1f5f9;
                }
                
                .notifications-list::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 3px;
                }
                
                /* Empty State */
                .empty-state {
                    padding: 40px 20px;
                    text-align: center;
                    color: #6b7280;
                }
                
                .empty-icon {
                    font-size: 48px;
                    margin-bottom: 16px;
                    opacity: 0.5;
                }
                
                .empty-message {
                    font-size: 14px;
                    margin-bottom: 8px;
                }
                
                .empty-submessage {
                    font-size: 12px;
                    color: #9ca3af;
                }
                
                /* Notification Item */
                .notification-item {
                    padding: 16px 20px;
                    border-bottom: 1px solid #e5e7eb;
                    cursor: pointer;
                    transition: background 0.2s ease;
                    position: relative;
                }
                
                .notification-item:hover {
                    background: #f8f9fa;
                }
                
                .notification-item.unread {
                    background: #eff6ff;
                    border-left: 4px solid #0099ff;
                }
                
                .notification-item.unread:hover {
                    background: #e0f2fe;
                }
                
                .notification-item-header {
                    display: flex;
                    align-items: flex-start;
                    gap: 12px;
                    margin-bottom: 8px;
                }
                
                .notification-icon {
                    width: 32px;
                    height: 32px;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 16px;
                    flex-shrink: 0;
                }
                
                .notification-icon.info { background: #e0f2fe; color: #0369a1; }
                .notification-icon.warning { background: #fef3c7; color: #f59e0b; }
                .notification-icon.success { background: #d1fae5; color: #10b981; }
                .notification-icon.danger { background: #fee2e2; color: #dc2626; }
                .notification-icon.emergency { background: #fef3c7; color: #f37021; animation: pulse 2s infinite; }
                
                .notification-content {
                    flex: 1;
                    min-width: 0;
                }
                
                .notification-item-title {
                    font-size: 14px;
                    font-weight: 600;
                    color: #374151;
                    margin-bottom: 4px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }
                
                .notification-time {
                    font-size: 11px;
                    color: #9ca3af;
                    font-weight: 400;
                }
                
                .notification-message {
                    font-size: 13px;
                    color: #4b5563;
                    line-height: 1.5;
                    margin-bottom: 12px;
                }
                
                /* Notification Actions */
                .notification-actions {
                    display: flex;
                    gap: 8px;
                    margin-top: 8px;
                }
                
                .action-btn {
                    padding: 6px 12px;
                    border: 1px solid #d1d5db;
                    background: white;
                    border-radius: 4px;
                    font-size: 12px;
                    font-weight: 500;
                    color: #4b5563;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                
                .action-btn:hover {
                    background: #f3f4f6;
                    border-color: #9ca3af;
                }
                
                .action-btn.primary {
                    background: #003366;
                    color: white;
                    border-color: #003366;
                }
                
                .action-btn.primary:hover {
                    background: #002244;
                }
                
                .action-btn.danger {
                    background: #dc3545;
                    color: white;
                    border-color: #dc3545;
                }
                
                .action-btn.danger:hover {
                    background: #c82333;
                }
                
                /* Unread Indicator */
                .unread-indicator {
                    position: absolute;
                    top: 16px;
                    right: 20px;
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: #0099ff;
                }
                
                /* Footer */
                .notification-footer {
                    padding: 15px 20px;
                    border-top: 1px solid #e5e7eb;
                    background: #f8f9fa;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .notification-summary {
                    font-size: 12px;
                    color: #6b7280;
                }
                
                .view-all-btn {
                    background: none;
                    border: none;
                    color: #003366;
                    font-size: 12px;
                    font-weight: 500;
                    cursor: pointer;
                    padding: 6px 12px;
                    border-radius: 4px;
                    transition: background 0.2s ease;
                }
                
                .view-all-btn:hover {
                    background: rgba(0, 51, 102, 0.1);
                }
                
                /* Overlay */
                .notification-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    z-index: 999;
                    display: none;
                }
                
                .notification-overlay.visible {
                    display: block;
                    animation: fadeIn 0.3s ease;
                }
                
                /* Animations */
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                
                @keyframes pulse {
                    0% { opacity: 1; }
                    50% { opacity: 0.5; }
                    100% { opacity: 1; }
                }
                
                .notification-item {
                    animation: slideIn 0.3s ease backwards;
                }
                
                /* Responsive */
                @media (max-width: 768px) {
                    .notification-container {
                        width: 100%;
                    }
                    
                    .notification-toggle {
                        top: 15px;
                        right: 15px;
                        width: 45px;
                        height: 45px;
                        font-size: 18px;
                    }
                    
                    .notification-badge {
                        font-size: 10px;
                        min-width: 18px;
                        height: 18px;
                    }
                }
                
                /* Dark Mode */
                @media (prefers-color-scheme: dark) {
                    .notification-container {
                        background: #1f2937;
                    }
                    
                    .notification-header {
                        background: #003366;
                        border-bottom-color: #374151;
                    }
                    
                    .notification-controls {
                        background: #111827;
                        border-bottom-color: #374151;
                    }
                    
                    .control-btn {
                        background: #374151;
                        border-color: #4b5563;
                        color: #d1d5db;
                    }
                    
                    .control-btn:hover {
                        background: #4b5563;
                    }
                    
                    .control-btn.primary {
                        background: #003366;
                        border-color: #003366;
                    }
                    
                    .notification-item {
                        border-bottom-color: #374151;
                    }
                    
                    .notification-item:hover {
                        background: #374151;
                    }
                    
                    .notification-item.unread {
                        background: #1e3a8a;
                        border-left-color: #3b82f6;
                    }
                    
                    .notification-item.unread:hover {
                        background: #1e40af;
                    }
                    
                    .notification-item-title {
                        color: #e5e7eb;
                    }
                    
                    .notification-message {
                        color: #d1d5db;
                    }
                    
                    .action-btn {
                        background: #374151;
                        border-color: #4b5563;
                        color: #d1d5db;
                    }
                    
                    .action-btn:hover {
                        background: #4b5563;
                    }
                    
                    .notification-footer {
                        background: #111827;
                        border-top-color: #374151;
                    }
                    
                    .notification-summary {
                        color: #9ca3af;
                    }
                    
                    .empty-state {
                        color: #9ca3af;
                    }
                    
                    .empty-submessage {
                        color: #6b7280;
                    }
                }
            </style>
            
            <!-- Toggle Button -->
            <button class="notification-toggle" id="notificationToggle" aria-label="Toggle notifications">
                🔔
                <span class="notification-badge" id="notificationBadge">0</span>
            </button>
            
            <!-- Overlay -->
            <div class="notification-overlay" id="notificationOverlay"></div>
            
            <!-- Notification Panel -->
            <div class="notification-container" id="notificationContainer">
                <!-- Header -->
                <div class="notification-header">
                    <div class="notification-title">
                        <span>Notifications</span>
                        <span class="notification-count" id="notificationCount">0</span>
                    </div>
                    <button class="close-btn" id="closeNotifications" aria-label="Close notifications">×</button>
                </div>
                
                <!-- Controls -->
                <div class="notification-controls">
                    <button class="control-btn" id="markAllReadBtn">
                        <span>✓</span>
                        <span>Mark All Read</span>
                    </button>
                    <button class="control-btn" id="clearAllBtn">
                        <span>🗑️</span>
                        <span>Clear All</span>
                    </button>
                    <button class="control-btn primary" id="refreshBtn">
                        <span>🔄</span>
                        <span>Refresh</span>
                    </button>
                </div>
                
                <!-- Notifications List -->
                <div class="notifications-list" id="notificationsList">
                    <!-- Filled dynamically -->
                </div>
                
                <!-- Footer -->
                <div class="notification-footer">
                    <div class="notification-summary" id="notificationSummary">
                        <!-- Filled dynamically -->
                    </div>
                    <button class="view-all-btn" id="viewAllBtn">View All Notifications</button>
                </div>
            </div>
        `;
        
        this.renderNotifications();
        this.updateBadge();
        this.updateSummary();
    }

    renderNotifications() {
        const notificationsList = this.shadowRoot.getElementById('notificationsList');
        if (!notificationsList) return;

        const unreadNotifications = this.notifications.filter(n => !n.read);
        const readNotifications = this.notifications.filter(n => n.read);

        if (this.notifications.length === 0) {
            notificationsList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📭</div>
                    <div class="empty-message">No notifications yet</div>
                    <div class="empty-submessage">You're all caught up!</div>
                </div>
            `;
            return;
        }

        let notificationsHTML = '';

        // Show unread notifications first
        if (unreadNotifications.length > 0) {
            unreadNotifications.slice(0, this.maxNotifications).forEach(notification => {
                notificationsHTML += this.renderNotificationItem(notification);
            });
        }

        // Then show read notifications
        if (readNotifications.length > 0 && unreadNotifications.length < this.maxNotifications) {
            const remainingSlots = this.maxNotifications - unreadNotifications.length;
            readNotifications.slice(0, remainingSlots).forEach(notification => {
                notificationsHTML += this.renderNotificationItem(notification);
            });
        }

        notificationsList.innerHTML = notificationsHTML;
    }

    renderNotificationItem(notification) {
        const timeAgo = this.getTimeAgo(notification.timestamp);
        const isUnread = !notification.read;
        
        return `
            <div class="notification-item ${isUnread ? 'unread' : ''}" data-id="${notification.id}">
                ${isUnread ? '<div class="unread-indicator"></div>' : ''}
                <div class="notification-item-header">
                    <div class="notification-icon ${notification.type}">
                        ${notification.icon}
                    </div>
                    <div class="notification-content">
                        <div class="notification-item-title">
                            <span>${notification.title}</span>
                            <span class="notification-time">${timeAgo}</span>
                        </div>
                        <div class="notification-message">
                            ${notification.message}
                        </div>
                    </div>
                </div>
                ${notification.actions && notification.actions.length > 0 ? `
                    <div class="notification-actions">
                        ${notification.actions.map(action => `
                            <button class="action-btn ${action.label === 'Dismiss' ? 'danger' : 'primary'}" 
                                    data-action="${action.action}" 
                                    data-data="${action.data}">
                                ${action.label}
                            </button>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    }

    setupEventListeners() {
        // Toggle button
        const toggleBtn = this.shadowRoot.getElementById('notificationToggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggleNotifications());
        }

        // Close button
        const closeBtn = this.shadowRoot.getElementById('closeNotifications');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.hideNotifications());
        }

        // Overlay
        const overlay = this.shadowRoot.getElementById('notificationOverlay');
        if (overlay) {
            overlay.addEventListener('click', () => this.hideNotifications());
        }

        // Control buttons
        const markAllReadBtn = this.shadowRoot.getElementById('markAllReadBtn');
        if (markAllReadBtn) {
            markAllReadBtn.addEventListener('click', () => this.markAllAsRead());
        }

        const clearAllBtn = this.shadowRoot.getElementById('clearAllBtn');
        if (clearAllBtn) {
            clearAllBtn.addEventListener('click', () => this.clearAllNotifications());
        }

        const refreshBtn = this.shadowRoot.getElementById('refreshBtn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.refreshNotifications());
        }

        const viewAllBtn = this.shadowRoot.getElementById('viewAllBtn');
        if (viewAllBtn) {
            viewAllBtn.addEventListener('click', () => this.viewAllNotifications());
        }

        // Notification items
        const notificationsList = this.shadowRoot.getElementById('notificationsList');
        if (notificationsList) {
            notificationsList.addEventListener('click', (e) => {
                const notificationItem = e.target.closest('.notification-item');
                if (notificationItem) {
                    const notificationId = notificationItem.dataset.id;
                    this.handleNotificationClick(notificationId);
                }

                const actionBtn = e.target.closest('.action-btn');
                if (actionBtn) {
                    const action = actionBtn.dataset.action;
                    const data = actionBtn.dataset.data;
                    this.handleNotificationAction(action, data);
                }
            });
        }

        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isExpanded) {
                this.hideNotifications();
            }
        });
    }

    setupWebSocket() {
        // In production, this would connect to a real WebSocket server
        // For now, we'll simulate WebSocket behavior with polling
        console.log('WebSocket setup for notifications');
        
        // Simulate incoming notifications
        this.simulateIncomingNotifications();
    }

    simulateIncomingNotifications() {
        // Simulate receiving notifications periodically
        setInterval(() => {
            if (Math.random() > 0.7 && this.notifications.length < 10) {
                this.addNotification({
                    id: 'simulated-' + Date.now(),
                    title: this.getRandomTitle(),
                    message: this.getRandomMessage(),
                    type: this.getRandomType(),
                    icon: this.getRandomIcon(),
                    timestamp: new Date().toISOString(),
                    read: false,
                    priority: 3,
                    actions: [
                        { label: 'View', action: 'redirect', data: 'dashboard.html' },
                        { label: 'Dismiss', action: 'dismiss' }
                    ]
                });
            }
        }, 30000); // Every 30 seconds
    }

    startPolling() {
        // Poll for new notifications every 60 seconds
        this.pollingInterval = setInterval(() => {
            this.checkForNewNotifications();
        }, 60000);
    }

    stopPolling() {
        if (this.pollingInterval) {
            clearInterval(this.pollingInterval);
        }
    }

    closeWebSocket() {
        if (this.websocket) {
            this.websocket.close();
        }
    }

    checkForNewNotifications() {
        // In production, this would check with the server
        // For now, we'll simulate by occasionally adding a notification
        if (Math.random() > 0.8) {
            this.showToast('New notifications available');
        }
    }

    toggleNotifications() {
        this.isExpanded = !this.isExpanded;
        const container = this.shadowRoot.getElementById('notificationContainer');
        const overlay = this.shadowRoot.getElementById('notificationOverlay');
        
        if (container) container.classList.toggle('expanded', this.isExpanded);
        if (overlay) overlay.classList.toggle('visible', this.isExpanded);
        
        if (this.isExpanded) {
            this.renderNotifications();
        }
    }

    showNotifications() {
        this.isExpanded = true;
        const container = this.shadowRoot.getElementById('notificationContainer');
        const overlay = this.shadowRoot.getElementById('notificationOverlay');
        
        if (container) container.classList.add('expanded');
        if (overlay) overlay.classList.add('visible');
        
        this.renderNotifications();
    }

    hideNotifications() {
        this.isExpanded = false;
        const container = this.shadowRoot.getElementById('notificationContainer');
        const overlay = this.shadowRoot.getElementById('notificationOverlay');
        
        if (container) container.classList.remove('expanded');
        if (overlay) overlay.classList.remove('visible');
    }

    handleNotificationClick(notificationId) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (!notification) return;

        // Mark as read
        notification.read = true;
        this.saveNotifications();
        this.updateBadge();
        this.renderNotifications();
        this.updateSummary();

        // Handle click action
        if (notification.link) {
            window.location.href = notification.link;
        }
    }

    handleNotificationAction(action, data) {
        switch (action) {
            case 'redirect':
                if (data) {
                    window.location.href = data;
                }
                break;
            case 'dismiss':
                this.dismissNotification(data);
                break;
            case 'confirm':
                this.confirmNotification(data);
                break;
            case 'reject':
                this.rejectNotification(data);
                break;
        }
    }

    addNotification(notification) {
        // Check if notification already exists
        const existingIndex = this.notifications.findIndex(n => n.id === notification.id);
        
        if (existingIndex > -1) {
            // Update existing notification
            this.notifications[existingIndex] = { ...this.notifications[existingIndex], ...notification };
        } else {
            // Add new notification at the beginning
            this.notifications.unshift(notification);
            
            // Limit number of notifications
            if (this.notifications.length > 20) {
                this.notifications = this.notifications.slice(0, 20);
            }
        }
        
        this.saveNotifications();
        this.updateBadge();
        
        // Show notification toast if not expanded
        if (!this.isExpanded) {
            this.showNotificationToast(notification);
        }
        
        // Re-render if expanded
        if (this.isExpanded) {
            this.renderNotifications();
            this.updateSummary();
        }
    }

    showNotificationToast(notification) {
        const toast = document.createElement('div');
        toast.innerHTML = `
            <style>
                .notification-toast {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    background: white;
                    border-left: 4px solid ${this.getNotificationColor(notification.type)};
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    padding: 12px 16px;
                    min-width: 300px;
                    max-width: 400px;
                    z-index: 1001;
                    animation: slideIn 0.3s ease;
                    cursor: pointer;
                }
                
                .toast-header {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 8px;
                }
                
                .toast-icon {
                    font-size: 16px;
                }
                
                .toast-title {
                    font-weight: 600;
                    color: #374151;
                    font-size: 14px;
                }
                
                .toast-message {
                    font-size: 13px;
                    color: #4b5563;
                    line-height: 1.4;
                }
                
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            </style>
            <div class="notification-toast">
                <div class="toast-header">
                    <span class="toast-icon">${notification.icon}</span>
                    <span class="toast-title">${notification.title}</span>
                </div>
                <div class="toast-message">${notification.message}</div>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        // Click to view notification
        toast.addEventListener('click', () => {
            this.showNotifications();
            toast.remove();
        });
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => toast.remove(), 300);
            }
        }, 5000);
    }

    markAllAsRead() {
        this.notifications.forEach(notification => {
            notification.read = true;
        });
        
        this.saveNotifications();
        this.updateBadge();
        this.renderNotifications();
        this.updateSummary();
        
        this.showToast('All notifications marked as read');
    }

    clearAllNotifications() {
        if (confirm('Are you sure you want to clear all notifications?')) {
            this.notifications = [];
            this.saveNotifications();
            this.updateBadge();
            this.renderNotifications();
            this.updateSummary();
            
            this.showToast('All notifications cleared');
        }
    }

    refreshNotifications() {
        // In production, this would fetch from server
        this.showToast('Refreshing notifications...');
        
        // Simulate refresh delay
        setTimeout(() => {
            this.renderNotifications();
            this.updateBadge();
            this.updateSummary();
            this.showToast('Notifications refreshed');
        }, 1000);
    }

    viewAllNotifications() {
        // Navigate to notifications page
        window.location.href = 'notifications.html';
    }

    dismissNotification(notificationId) {
        this.notifications = this.notifications.filter(n => n.id !== notificationId);
        this.saveNotifications();
        this.updateBadge();
        this.renderNotifications();
        this.updateSummary();
    }

    confirmNotification(notificationId) {
        // Handle confirmation logic
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.read = true;
            this.saveNotifications();
            this.updateBadge();
            this.renderNotifications();
            this.updateSummary();
            
            this.showToast('Notification confirmed');
        }
    }

    rejectNotification(notificationId) {
        // Handle rejection logic
        this.dismissNotification(notificationId);
        this.showToast('Notification rejected');
    }

    updateBadge() {
        const badge = this.shadowRoot.getElementById('notificationBadge');
        const countElement = this.shadowRoot.getElementById('notificationCount');
        
        const unreadCount = this.notifications.filter(n => !n.read).length;
        
        if (badge) {
            badge.textContent = unreadCount > 9 ? '9+' : unreadCount;
            badge.style.display = unreadCount > 0 ? 'flex' : 'none';
        }
        
        if (countElement) {
            countElement.textContent = unreadCount > 9 ? '9+' : unreadCount;
        }
    }

    updateSummary() {
        const summary = this.shadowRoot.getElementById('notificationSummary');
        if (!summary) return;
        
        const total = this.notifications.length;
        const unread = this.notifications.filter(n => !n.read).length;
        
        summary.textContent = `${unread} unread of ${total} total`;
    }

    getTimeAgo(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffSec = Math.floor(diffMs / 1000);
        const diffMin = Math.floor(diffSec / 60);
        const diffHour = Math.floor(diffMin / 60);
        const diffDay = Math.floor(diffHour / 24);
        
        if (diffDay > 7) {
            return date.toLocaleDateString();
        } else if (diffDay > 0) {
            return `${diffDay}d ago`;
        } else if (diffHour > 0) {
            return `${diffHour}h ago`;
        } else if (diffMin > 0) {
            return `${diffMin}m ago`;
        } else {
            return 'Just now';
        }
    }

    getNotificationColor(type) {
        const colors = {
            info: '#0369a1',
            warning: '#f59e0b',
            success: '#10b981',
            danger: '#dc2626',
            emergency: '#f37021'
        };
        return colors[type] || '#0369a1';
    }

    getRandomTitle() {
        const titles = [
            'New Loan Request',
            'Subscription Update',
            'Payment Received',
            'Group Invitation',
            'Repayment Due',
            'System Maintenance',
            'New Feature Available',
            'Security Alert'
        ];
        return titles[Math.floor(Math.random() * titles.length)];
    }

    getRandomMessage() {
        const messages = [
            'A new loan request requires your attention.',
            'Your subscription has been updated successfully.',
            'A payment has been received in your account.',
            'You have been invited to join a new group.',
            'Your loan repayment is due in 2 days.',
            'System maintenance is scheduled for tonight.',
            'Check out the new feature we just released!',
            'We detected suspicious activity on your account.'
        ];
        return messages[Math.floor(Math.random() * messages.length)];
    }

    getRandomType() {
        const types = ['info', 'warning', 'success', 'danger'];
        return types[Math.floor(Math.random() * types.length)];
    }

    getRandomIcon() {
        const icons = ['💰', '📢', '✅', '⚠️', '🎉', '🔒', '👥', '📅'];
        return icons[Math.floor(Math.random() * icons.length)];
    }

    showToast(message) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #003366;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 14px;
            z-index: 1001;
            animation: slideUp 0.3s ease;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            max-width: 90%;
            text-align: center;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideDown 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Public methods
    showSystemNotification(title, message, type = 'info', actions = []) {
        const notification = {
            id: 'system-' + Date.now(),
            title,
            message,
            type,
            icon: this.getIconForType(type),
            timestamp: new Date().toISOString(),
            read: false,
            priority: 1,
            actions: actions.length > 0 ? actions : [
                { label: 'View', action: 'redirect', data: 'dashboard.html' },
                { label: 'Dismiss', action: 'dismiss' }
            ]
        };
        
        this.addNotification(notification);
    }

    getIconForType(type) {
        const icons = {
            info: '📢',
            warning: '⚠️',
            success: '✅',
            danger: '🚨',
            emergency: '🚨'
        };
        return icons[type] || '📢';
    }

    showLoanRequestNotification(borrowerName, amount, groupName) {
        this.showSystemNotification(
            'New Loan Request',
            `${borrowerName} is requesting ${amount} in ${groupName}`,
            'info',
            [
                { label: 'Review', action: 'redirect', data: 'lender/requests.html' },
                { label: 'Dismiss', action: 'dismiss' }
            ]
        );
    }

    showRepaymentDueNotification(amount, daysLeft) {
        const type = daysLeft <= 1 ? 'danger' : daysLeft <= 3 ? 'warning' : 'info';
        this.showSystemNotification(
            'Repayment Due',
            `Your loan repayment of ${amount} is due in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}`,
            type,
            [
                { label: 'Pay Now', action: 'redirect', data: 'borrower/repayments.html' },
                { label: 'Dismiss', action: 'dismiss' }
            ]
        );
    }

    showSubscriptionWarningNotification(daysLeft) {
        const type = daysLeft <= 3 ? 'danger' : daysLeft <= 7 ? 'warning' : 'info';
        this.showSystemNotification(
            'Subscription Expiring',
            `Your subscription expires in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}. Renew to continue lending.`,
            type,
            [
                { label: 'Renew Now', action: 'redirect', data: 'subscription/upgrade.html' },
                { label: 'Dismiss', action: 'dismiss' }
            ]
        );
    }

    clearAll() {
        this.notifications = [];
        this.saveNotifications();
        this.updateBadge();
        this.renderNotifications();
        this.updateSummary();
    }
}

// Register custom element
customElements.define('mp-notification-bar', MPNotificationBar);

// Export for module usage
export default MPNotificationBar;