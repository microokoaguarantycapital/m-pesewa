// features/notification-flow.js
// Notification orchestration: push, in-app, banners

class NotificationFlow {
    constructor() {
        this.notificationQueue = [];
        this.inAppNotifications = [];
        this.pushPermission = Notification.permission;
        this.MAX_BANNER_DURATION = 5000; // 5 seconds
        this.init();
    }

    init() {
        // Check and request notification permission
        this.checkPushPermission();
        
        // Set up service worker for push notifications if available
        this.setupPushNotifications();
        
        // Load stored notifications
        this.loadStoredNotifications();
        
        // Start banner display loop
        this.startBannerLoop();
    }

    // Check and request push notification permission
    checkPushPermission() {
        if ('Notification' in window && this.pushPermission === 'default') {
            Notification.requestPermission().then(permission => {
                this.pushPermission = permission;
                console.log('Notification permission:', permission);
            });
        }
    }

    // Set up service worker for push notifications
    async setupPushNotifications() {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            try {
                const registration = await navigator.serviceWorker.ready;
                
                // Check current subscription
                const subscription = await registration.pushManager.getSubscription();
                
                if (!subscription) {
                    // Request subscription
                    const vapidPublicKey = 'BLn07qjRk5tR30_4HwJt9jK6J8V7QaXbYcDvEfGhIjKlMnOpQrStUvWxYzA0B1C2D3E4F5G6H7I8J9K0L1M2N';
                    const convertedKey = this.urlBase64ToUint8Array(vapidPublicKey);
                    
                    const newSubscription = await registration.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey: convertedKey
                    });
                    
                    console.log('Push subscription successful:', newSubscription);
                }
            } catch (error) {
                console.error('Push notification setup failed:', error);
            }
        }
    }

    // Create a new notification
    createNotification(options) {
        const notification = {
            id: `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type: options.type || 'info',
            category: options.category || 'system',
            title: options.title,
            message: options.message,
            timestamp: new Date().toISOString(),
            read: false,
            persistent: options.persistent || false,
            data: options.data || {},
            actions: options.actions || [],
            priority: options.priority || 'normal', // 'low', 'normal', 'high', 'urgent'
            targetUrl: options.targetUrl,
            userId: this.getCurrentUserId(),
            country: localStorage.getItem('mpesewa_country'),
            groupId: localStorage.getItem('mpesewa_group')
        };

        // Store notification
        this.storeNotification(notification);

        // Process based on type and priority
        this.routeNotification(notification);

        return notification;
    }

    // Route notification to appropriate channels
    routeNotification(notification) {
        const userPrefs = this.getNotificationPreferences();
        
        // Check if notification should be shown based on user preferences
        if (!this.shouldShowNotification(notification, userPrefs)) {
            return;
        }

        // Route to appropriate channels
        switch (notification.priority) {
            case 'urgent':
                // Show immediately via all channels
                this.showBanner(notification);
                this.showInApp(notification);
                this.sendPush(notification);
                break;
            case 'high':
                // Show banner and in-app
                this.showBanner(notification);
                this.showInApp(notification);
                break;
            case 'normal':
                // Add to banner queue and show in-app
                this.queueBanner(notification);
                this.showInApp(notification);
                break;
            case 'low':
                // Only show in notification center
                this.showInApp(notification);
                break;
            default:
                this.showInApp(notification);
        }

        // Emit notification event for other parts of the app
        this.emitNotificationEvent(notification);
    }

    // Queue banner for display
    queueBanner(notification) {
        this.notificationQueue.push(notification);
    }

    // Start banner display loop
    startBannerLoop() {
        setInterval(() => {
            if (this.notificationQueue.length > 0 && !this.isBannerActive) {
                const nextNotification = this.notificationQueue.shift();
                this.showBanner(nextNotification);
            }
        }, 1000);
    }

    // Display banner notification
    showBanner(notification) {
        this.isBannerActive = true;
        
        // Create banner element
        const banner = document.createElement('div');
        banner.className = `notification-banner notification-${notification.type} notification-priority-${notification.priority}`;
        banner.id = `banner_${notification.id}`;
        
        // Banner content
        banner.innerHTML = `
            <div class="banner-content">
                <div class="banner-icon">
                    ${this.getNotificationIcon(notification.type)}
                </div>
                <div class="banner-text">
                    <strong>${notification.title}</strong>
                    <p>${notification.message}</p>
                </div>
                ${notification.actions.length > 0 ? `
                    <div class="banner-actions">
                        ${notification.actions.map(action => 
                            `<button class="btn-banner-action" data-action="${action.action}">${action.title}</button>`
                        ).join('')}
                    </div>
                ` : ''}
                <button class="banner-close" aria-label="Close">&times;</button>
            </div>
        `;
        
        // Add to document
        document.body.appendChild(banner);
        
        // Add event listeners
        banner.querySelector('.banner-close').addEventListener('click', () => {
            this.closeBanner(banner);
        });
        
        banner.querySelectorAll('.btn-banner-action').forEach(button => {
            button.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                this.handleBannerAction(notification, action);
                this.closeBanner(banner);
            });
        });
        
        // Auto-close for non-persistent banners
        if (!notification.persistent) {
            setTimeout(() => {
                this.closeBanner(banner);
            }, this.MAX_BANNER_DURATION);
        }
        
        // Mark as read
        this.markAsRead(notification.id);
    }

    // Close banner
    closeBanner(bannerElement) {
        bannerElement.classList.add('closing');
        setTimeout(() => {
            if (bannerElement.parentNode) {
                bannerElement.parentNode.removeChild(bannerElement);
            }
            this.isBannerActive = false;
        }, 300);
    }

    // Show in-app notification (add to notification center)
    showInApp(notification) {
        this.inAppNotifications.unshift(notification);
        this.updateNotificationCenter();
        
        // Update badge count
        this.updateNotificationBadge();
    }

    // Send push notification
    sendPush(notification) {
        if (this.pushPermission === 'granted') {
            const pushOptions = {
                body: notification.message,
                icon: '/assets/images/logo/m-pesewa-192.png',
                badge: '/assets/images/logo/m-pesewa-badge.png',
                tag: notification.category,
                data: notification.data,
                actions: notification.actions.map(action => ({
                    action: action.action,
                    title: action.title,
                    icon: action.icon
                }))
            };
            
            // Show push notification
            new Notification(notification.title, pushOptions);
        }
    }

    // Update notification center UI
    updateNotificationCenter() {
        const center = document.getElementById('notification-center');
        if (center) {
            const unreadCount = this.inAppNotifications.filter(n => !n.read).length;
            const badge = center.querySelector('.notification-badge');
            if (badge) {
                badge.textContent = unreadCount > 99 ? '99+' : unreadCount;
                badge.style.display = unreadCount > 0 ? 'inline-block' : 'none';
            }
        }
    }

    // Update notification badge
    updateNotificationBadge() {
        const unreadCount = this.inAppNotifications.filter(n => !n.read).length;
        const appIcon = document.querySelector('link[rel="icon"]');
        
        if (unreadCount > 0) {
            // Update favicon with badge (simplified version)
            document.title = `(${unreadCount}) M-Pesewa`;
        } else {
            document.title = 'M-Pesewa';
        }
    }

    // Mark notification as read
    markAsRead(notificationId) {
        const notification = this.inAppNotifications.find(n => n.id === notificationId);
        if (notification) {
            notification.read = true;
            notification.readAt = new Date().toISOString();
            this.updateStoredNotification(notification);
            this.updateNotificationCenter();
            this.updateNotificationBadge();
        }
    }

    // Mark all as read
    markAllAsRead() {
        this.inAppNotifications.forEach(notification => {
            if (!notification.read) {
                notification.read = true;
                notification.readAt = new Date().toISOString();
                this.updateStoredNotification(notification);
            }
        });
        
        this.updateNotificationCenter();
        this.updateNotificationBadge();
    }

    // Store notification in localStorage
    storeNotification(notification) {
        const stored = JSON.parse(localStorage.getItem('mpesewa_notifications') || '[]');
        stored.push(notification);
        
        // Keep only last 100 notifications
        if (stored.length > 100) {
            stored.splice(0, stored.length - 100);
        }
        
        localStorage.setItem('mpesewa_notifications', JSON.stringify(stored));
    }

    // Update stored notification
    updateStoredNotification(updatedNotification) {
        let stored = JSON.parse(localStorage.getItem('mpesewa_notifications') || '[]');
        const index = stored.findIndex(n => n.id === updatedNotification.id);
        
        if (index !== -1) {
            stored[index] = updatedNotification;
            localStorage.setItem('mpesewa_notifications', JSON.stringify(stored));
        }
    }

    // Load stored notifications
    loadStoredNotifications() {
        const stored = JSON.parse(localStorage.getItem('mpesewa_notifications') || '[]');
        this.inAppNotifications = stored;
        this.updateNotificationBadge();
    }

    // Get notification preferences for current user
    getNotificationPreferences() {
        const user = JSON.parse(localStorage.getItem('mpesewa_user') || '{}');
        const prefs = JSON.parse(localStorage.getItem('mpesewa_notification_prefs') || '{}');
        
        return {
            ...this.getDefaultPreferences(),
            ...prefs[user.id] || {}
        };
    }

    // Get default notification preferences
    getDefaultPreferences() {
        return {
            loanRequests: true,
            loanUpdates: true,
            repayments: true,
            subscriptions: true,
            blacklist: true,
            group: true,
            marketing: false,
            pushEnabled: true,
            bannerEnabled: true,
            soundEnabled: true
        };
    }

    // Check if notification should be shown based on preferences
    shouldShowNotification(notification, preferences) {
        // Check category-specific preferences
        switch (notification.category) {
            case 'loan_request':
                return preferences.loanRequests;
            case 'loan_update':
                return preferences.loanUpdates;
            case 'repayment':
                return preferences.repayments;
            case 'subscription':
                return preferences.subscriptions;
            case 'blacklist':
                return preferences.blacklist;
            case 'group':
                return preferences.group;
            case 'marketing':
                return preferences.marketing;
            default:
                return true;
        }
    }

    // Get notification icon based on type
    getNotificationIcon(type) {
        const icons = {
            info: 'ℹ️',
            success: '✅',
            warning: '⚠️',
            error: '❌',
            loan: '💰',
            repayment: '💳',
            subscription: '🔄',
            blacklist: '🚫',
            group: '👥'
        };
        
        return icons[type] || '🔔';
    }

    // Handle banner action
    handleBannerAction(notification, action) {
        console.log(`Handling action ${action} for notification ${notification.id}`);
        
        // Emit action event
        const event = new CustomEvent('notification-action', {
            detail: {
                notification,
                action
            }
        });
        window.dispatchEvent(event);
        
        // Handle specific actions
        switch (action) {
            case 'view_loan':
                window.location.href = `/lender/ledger-view.html?id=${notification.data.loanId}`;
                break;
            case 'view_borrower':
                window.location.href = `/borrower/profile.html?id=${notification.data.borrowerId}`;
                break;
            case 'renew_subscription':
                window.location.href = `/subscription/renew.html`;
                break;
            case 'view_blacklist':
                window.location.href = `/blacklist/status.html`;
                break;
        }
    }

    // Emit notification event
    emitNotificationEvent(notification) {
        const event = new CustomEvent('notification-received', {
            detail: notification
        });
        window.dispatchEvent(event);
    }

    // Get current user ID
    getCurrentUserId() {
        const user = JSON.parse(localStorage.getItem('mpesewa_user') || '{}');
        return user.id;
    }

    // Utility function for VAPID key conversion
    urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/-/g, '+')
            .replace(/_/g, '/');
        
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        
        return outputArray;
    }

    // Send notification types for M-Pesewa
    sendLoanRequestNotification(lenderId, borrowerName, amount, currency) {
        return this.createNotification({
            type: 'loan',
            category: 'loan_request',
            title: 'New Loan Request',
            message: `${borrowerName} has requested a loan of ${currency} ${amount}`,
            priority: 'high',
            data: {
                lenderId,
                borrowerName,
                amount,
                currency
            },
            actions: [
                {
                    action: 'view_loan',
                    title: 'Review'
                },
                {
                    action: 'view_borrower',
                    title: 'Profile'
                }
            ]
        });
    }

    sendRepaymentNotification(lenderId, borrowerName, amount, currency) {
        return this.createNotification({
            type: 'repayment',
            category: 'repayment',
            title: 'Repayment Received',
            message: `${borrowerName} has repaid ${currency} ${amount}`,
            priority: 'success',
            data: {
                lenderId,
                borrowerName,
                amount,
                currency
            }
        });
    }

    sendSubscriptionExpiryNotification(daysRemaining) {
        return this.createNotification({
            type: 'subscription',
            category: 'subscription',
            title: 'Subscription Expiring Soon',
            message: `Your subscription expires in ${daysRemaining} days. Renew to continue lending.`,
            priority: daysRemaining <= 3 ? 'urgent' : 'high',
            persistent: daysRemaining <= 1,
            actions: [
                {
                    action: 'renew_subscription',
                    title: 'Renew Now'
                }
            ]
        });
    }

    sendBlacklistNotification(borrowerName, amount, currency) {
        return this.createNotification({
            type: 'blacklist',
            category: 'blacklist',
            title: 'Borrower Blacklisted',
            message: `${borrowerName} has been blacklisted for ${currency} ${amount}`,
            priority: 'high',
            actions: [
                {
                    action: 'view_blacklist',
                    title: 'View Blacklist'
                }
            ]
        });
    }

    sendGroupNotification(groupName, message, actionUrl = null) {
        const notification = {
            type: 'group',
            category: 'group',
            title: `Group: ${groupName}`,
            message: message,
            priority: 'normal'
        };

        if (actionUrl) {
            notification.actions = [{
                action: 'view_group',
                title: 'View Group'
            }];
            notification.targetUrl = actionUrl;
        }

        return this.createNotification(notification);
    }
}

// Export singleton instance
const notificationFlow = new NotificationFlow();
window.NotificationFlow = notificationFlow;
export default notificationFlow;