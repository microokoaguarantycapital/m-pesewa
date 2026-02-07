/**
 * M-PESEWA NOTIFICATION SLICE
 * Handles all platform notifications with strict business rule enforcement
 * Includes subscription expiry alerts, loan status updates, and system notifications
 */

import { createSlice } from './store.core.js';

// Notification types based on M-Pesewa business rules
const NOTIFICATION_TYPES = {
  // Subscription-related notifications (LENDERS ONLY)
  SUBSCRIPTION_EXPIRY: 'SUBSCRIPTION_EXPIRY',
  SUBSCRIPTION_RENEWAL: 'SUBSCRIPTION_RENEWAL',
  SUBSCRIPTION_UPGRADE: 'SUBSCRIPTION_UPGRADE',
  SUBSCRIPTION_BLOCKED: 'SUBSCRIPTION_BLOCKED', // When lender access is blocked
  
  // Loan-related notifications
  LOAN_REQUEST: 'LOAN_REQUEST',
  LOAN_APPROVED: 'LOAN_APPROVED',
  LOAN_DISBURSED: 'LOAN_DISBURSED',
  LOAN_REPAYMENT: 'LOAN_REPAYMENT',
  LOAN_OVERDUE: 'LOAN_OVERDUE',
  LOAN_DEFAULT: 'LOAN_DEFAULT', // After 2 months
  
  // Reputation & Blacklist notifications
  BORROWER_RATING: 'BORROWER_RATING',
  BLACKLIST_ADDED: 'BLACKLIST_ADDED',
  BLACKLIST_REMOVED: 'BLACKLIST_REMOVED',
  
  // Group notifications
  GROUP_INVITATION: 'GROUP_INVITATION',
  GROUP_JOINED: 'GROUP_JOINED',
  GROUP_CREATED: 'GROUP_CREATED',
  
  // System notifications
  SYSTEM_ALERT: 'SYSTEM_ALERT',
  SECURITY_ALERT: 'SECURITY_ALERT',
  MAINTENANCE: 'MAINTENANCE'
};

// Notification priority levels
const PRIORITY_LEVELS = {
  CRITICAL: 'CRITICAL', // Requires immediate attention (subscription blocked, default)
  HIGH: 'HIGH', // Important but not immediate (overdue, blacklist)
  MEDIUM: 'MEDIUM', // Standard notifications (loan status)
  LOW: 'LOW', // Informational (group updates, ratings)
  INFO: 'INFO' // General information
};

// Initial state
const initialState = {
  // Active notifications
  notifications: [],
  
  // Notification settings per user role
  settings: {
    // Lender-specific notification settings
    lender: {
      subscriptionAlerts: true,
      loanRequests: true,
      repayments: true,
      overdueAlerts: true,
      blacklistUpdates: true,
      groupUpdates: true,
      systemAlerts: true
    },
    // Borrower-specific notification settings
    borrower: {
      loanStatus: true,
      repaymentReminders: true,
      dueDateAlerts: true,
      blacklistAlerts: true,
      ratingUpdates: true,
      groupUpdates: true,
      systemAlerts: true
    },
    // Default settings for unauthenticated users
    default: {
      systemAlerts: true,
      maintenanceAlerts: true
    }
  },
  
  // Notification queue for offline users
  pendingNotifications: [],
  
  // Statistics
  stats: {
    totalReceived: 0,
    totalRead: 0,
    totalUnread: 0,
    byType: {},
    byPriority: {}
  },
  
  // UI state
  isNotificationCenterOpen: false,
  lastChecked: null,
  isLoading: false,
  error: null
};

// Helper function to create notification with M-Pesewa business rules
const createNotification = (type, data, recipientRole) => {
  const baseNotification = {
    id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type,
    timestamp: Date.now(),
    read: false,
    archived: false,
    data
  };
  
  // Apply business rules based on notification type
  switch (type) {
    case NOTIFICATION_TYPES.SUBSCRIPTION_EXPIRY:
      return {
        ...baseNotification,
        title: 'Subscription Expiry Warning',
        message: `Your lender subscription expires on the 28th. Renew to avoid access block.`,
        priority: PRIORITY_LEVELS.HIGH,
        category: 'subscription',
        icon: '💰',
        actions: [
          { label: 'Renew Now', action: 'RENEW_SUBSCRIPTION', url: '/subscription/renew.html' },
          { label: 'View Details', action: 'VIEW_DETAILS', url: '/subscription/current.html' }
        ],
        expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 days
        requiresAction: true
      };
    
    case NOTIFICATION_TYPES.SUBSCRIPTION_BLOCKED:
      return {
        ...baseNotification,
        title: 'Access Blocked',
        message: 'Your lender access is blocked due to expired subscription. Renew to continue lending.',
        priority: PRIORITY_LEVELS.CRITICAL,
        category: 'subscription',
        icon: '🚫',
        actions: [
          { label: 'Renew Subscription', action: 'RENEW_SUBSCRIPTION', url: '/subscription/renew.html' },
          { label: 'Contact Support', action: 'CONTACT_SUPPORT', url: '/contact.html' }
        ],
        requiresAction: true,
        persistent: true // Cannot be dismissed without action
      };
    
    case NOTIFICATION_TYPES.LOAN_REQUEST:
      return {
        ...baseNotification,
        title: 'New Loan Request',
        message: `${data.borrowerName} is requesting ${data.amount} for ${data.category}`,
        priority: PRIORITY_LEVELS.MEDIUM,
        category: 'loan',
        icon: '📝',
        actions: [
          { label: 'Review Request', action: 'REVIEW_LOAN', url: `/lender/requests.html?loan=${data.loanId}` },
          { label: 'View Borrower', action: 'VIEW_BORROWER', url: `/borrower/profile.html?id=${data.borrowerId}` }
        ],
        expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
      };
    
    case NOTIFICATION_TYPES.LOAN_APPROVED:
      return {
        ...baseNotification,
        title: 'Loan Approved',
        message: `Your loan request for ${data.amount} has been approved by ${data.lenderName}`,
        priority: PRIORITY_LEVELS.MEDIUM,
        category: 'loan',
        icon: '✅',
        actions: [
          { label: 'View Details', action: 'VIEW_LOAN', url: `/borrower/loan.html?id=${data.loanId}` },
          { label: 'Repayment Schedule', action: 'VIEW_SCHEDULE', url: `/borrower/repayments.html` }
        ]
      };
    
    case NOTIFICATION_TYPES.LOAN_OVERDUE:
      return {
        ...baseNotification,
        title: 'Loan Overdue',
        message: `Loan of ${data.amount} is overdue by ${data.daysOverdue} days. 5% daily penalty applies.`,
        priority: PRIORITY_LEVELS.HIGH,
        category: 'loan',
        icon: '⚠️',
        actions: [
          { label: 'Make Payment', action: 'MAKE_PAYMENT', url: `/borrower/repayments.html?loan=${data.loanId}` },
          { label: 'Contact Lender', action: 'CONTACT_LENDER', url: `tel:${data.lenderContact}` }
        ],
        requiresAction: true
      };
    
    case NOTIFICATION_TYPES.LOAN_DEFAULT:
      return {
        ...baseNotification,
        title: 'Loan in Default',
        message: `Loan of ${data.amount} is now in default (over 2 months). Blacklist applied.`,
        priority: PRIORITY_LEVELS.CRITICAL,
        category: 'loan',
        icon: '🔴',
        actions: [
          { label: 'Settle Now', action: 'SETTLE_LOAN', url: `/borrower/repayments.html?loan=${data.loanId}` },
          { label: 'Appeal Blacklist', action: 'APPEAL_BLACKLIST', url: `/blacklist/appeal.html` }
        ],
        requiresAction: true,
        persistent: true
      };
    
    case NOTIFICATION_TYPES.BLACKLIST_ADDED:
      return {
        ...baseNotification,
        title: 'Blacklisted',
        message: 'You have been blacklisted due to loan default. Cannot borrow or join new groups.',
        priority: PRIORITY_LEVELS.CRITICAL,
        category: 'reputation',
        icon: '⚫',
        actions: [
          { label: 'View Details', action: 'VIEW_BLACKLIST', url: `/blacklist/status.html` },
          { label: 'Contact Admin', action: 'CONTACT_ADMIN', url: `/admin/contact.html` }
        ],
        requiresAction: true,
        persistent: true
      };
    
    case NOTIFICATION_TYPES.BORROWER_RATING:
      return {
        ...baseNotification,
        title: 'New Rating Received',
        message: `${data.lenderName} rated you ${data.rating}/5 stars`,
        priority: PRIORITY_LEVELS.LOW,
        category: 'reputation',
        icon: '⭐',
        actions: [
          { label: 'View Rating', action: 'VIEW_RATING', url: `/borrower/ratings.html` },
          { label: 'Thank Lender', action: 'THANK_LENDER', url: `mailto:${data.lenderEmail}` }
        ]
      };
    
    case NOTIFICATION_TYPES.GROUP_INVITATION:
      return {
        ...baseNotification,
        title: 'Group Invitation',
        message: `You've been invited to join ${data.groupName} by ${data.inviterName}`,
        priority: PRIORITY_LEVELS.MEDIUM,
        category: 'group',
        icon: '👥',
        actions: [
          { label: 'Accept', action: 'ACCEPT_INVITATION', url: `/groups/join.html?invite=${data.inviteCode}` },
          { label: 'Decline', action: 'DECLINE_INVITATION' }
        ],
        expiresAt: Date.now() + (3 * 24 * 60 * 60 * 1000) // 3 days
      };
    
    default:
      return {
        ...baseNotification,
        title: 'System Notification',
        message: 'You have a new notification',
        priority: PRIORITY_LEVELS.INFO,
        category: 'system',
        icon: 'ℹ️'
      };
  }
};

// Create notification slice
const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    // Add new notification with business rule validation
    addNotification: (state, action) => {
      const { type, data, recipientRole = 'default' } = action.payload;
      
      // Check if user has this notification type enabled
      const userSettings = state.settings[recipientRole] || state.settings.default;
      const notificationType = type.toLowerCase().replace(/_/g, '');
      const settingKey = Object.keys(userSettings).find(key => 
        key.toLowerCase().includes(notificationType)
      );
      
      if (settingKey && !userSettings[settingKey]) {
        console.log(`Notification type ${type} is disabled for ${recipientRole}`);
        return;
      }
      
      // Create notification with business rules
      const notification = createNotification(type, data, recipientRole);
      
      // Add to notifications
      state.notifications.unshift(notification);
      
      // Update statistics
      state.stats.totalReceived++;
      state.stats.totalUnread++;
      
      if (!state.stats.byType[type]) {
        state.stats.byType[type] = 0;
      }
      state.stats.byType[type]++;
      
      if (!state.stats.byPriority[notification.priority]) {
        state.stats.byPriority[notification.priority] = 0;
      }
      state.stats.byPriority[notification.priority]++;
      
      // Store in localStorage for persistence
      try {
        const notificationsToStore = state.notifications.slice(0, 50); // Store last 50
        localStorage.setItem('mpesewa_notifications', JSON.stringify(notificationsToStore));
      } catch (error) {
        console.error('Error saving notifications:', error);
      }
      
      // Dispatch browser notification if supported and permission granted
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(notification.title, {
          body: notification.message,
          icon: '/assets/images/logo-192x192.png',
          tag: notification.id
        });
      }
    },
    
    // Mark notification as read
    markAsRead: (state, action) => {
      const { notificationId, markAll = false } = action.payload;
      
      if (markAll) {
        state.notifications.forEach(notification => {
          if (!notification.read) {
            notification.read = true;
            state.stats.totalRead++;
            state.stats.totalUnread--;
          }
        });
      } else {
        const notification = state.notifications.find(n => n.id === notificationId);
        if (notification && !notification.read) {
          notification.read = true;
          state.stats.totalRead++;
          state.stats.totalUnread--;
        }
      }
    },
    
    // Archive notification
    archiveNotification: (state, action) => {
      const { notificationId } = action.payload;
      const notification = state.notifications.find(n => n.id === notificationId);
      if (notification) {
        notification.archived = true;
      }
    },
    
    // Remove notification
    removeNotification: (state, action) => {
      const { notificationId } = action.payload;
      const index = state.notifications.findIndex(n => n.id === notificationId);
      if (index !== -1) {
        const notification = state.notifications[index];
        if (!notification.read) {
          state.stats.totalUnread--;
        }
        state.notifications.splice(index, 1);
      }
    },
    
    // Clear all notifications
    clearAllNotifications: (state) => {
      state.notifications = [];
      state.stats.totalUnread = 0;
      localStorage.removeItem('mpesewa_notifications');
    },
    
    // Toggle notification center
    toggleNotificationCenter: (state) => {
      state.isNotificationCenterOpen = !state.isNotificationCenterOpen;
      if (state.isNotificationCenterOpen) {
        state.lastChecked = Date.now();
      }
    },
    
    // Update notification settings
    updateNotificationSettings: (state, action) => {
      const { role, settings } = action.payload;
      if (state.settings[role]) {
        state.settings[role] = { ...state.settings[role], ...settings };
        
        // Save to localStorage
        localStorage.setItem(`mpesewa_notification_settings_${role}`, JSON.stringify(state.settings[role]));
      }
    },
    
    // Load notifications from storage
    loadNotifications: (state) => {
      try {
        const savedNotifications = localStorage.getItem('mpesewa_notifications');
        if (savedNotifications) {
          const notifications = JSON.parse(savedNotifications);
          state.notifications = notifications;
          
          // Recalculate stats
          state.stats.totalReceived = notifications.length;
          state.stats.totalRead = notifications.filter(n => n.read).length;
          state.stats.totalUnread = notifications.length - state.stats.totalRead;
          
          // Recalculate type and priority stats
          state.stats.byType = {};
          state.stats.byPriority = {};
          
          notifications.forEach(notification => {
            if (!state.stats.byType[notification.type]) {
              state.stats.byType[notification.type] = 0;
            }
            state.stats.byType[notification.type]++;
            
            if (!state.stats.byPriority[notification.priority]) {
              state.stats.byPriority[notification.priority] = 0;
            }
            state.stats.byPriority[notification.priority]++;
          });
        }
      } catch (error) {
        console.error('Error loading notifications:', error);
      }
    },
    
    // Process pending notifications (for offline users)
    processPendingNotifications: (state) => {
      if (state.pendingNotifications.length > 0) {
        state.pendingNotifications.forEach(pending => {
          state.notifications.unshift(pending);
          state.stats.totalReceived++;
          state.stats.totalUnread++;
        });
        state.pendingNotifications = [];
      }
    },
    
    // Check for expired notifications and clean up
    cleanupExpiredNotifications: (state) => {
      const now = Date.now();
      state.notifications = state.notifications.filter(notification => {
        // Keep persistent notifications
        if (notification.persistent) return true;
        
        // Remove expired notifications
        if (notification.expiresAt && notification.expiresAt < now) {
          if (!notification.read) {
            state.stats.totalUnread--;
          }
          return false;
        }
        
        return true;
      });
    },
    
    // Set loading state
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    
    // Set error state
    setError: (state, action) => {
      state.error = action.payload;
    },
    
    // Request browser notification permission
    requestNotificationPermission: (state) => {
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            console.log('Notification permission granted');
          }
        });
      }
    },
    
    // M-PESEWA SPECIFIC BUSINESS RULE NOTIFICATIONS
    
    // Send subscription expiry warning (runs on 25th of each month)
    sendSubscriptionExpiryWarning: (state, action) => {
      const { lenderId, lenderName, expiryDate } = action.payload;
      
      const today = new Date();
      const expiry = new Date(expiryDate);
      const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
      
      if (daysUntilExpiry <= 3) {
        state.notifications.unshift(createNotification(
          NOTIFICATION_TYPES.SUBSCRIPTION_EXPIRY,
          { lenderId, lenderName, expiryDate, daysUntilExpiry },
          'lender'
        ));
      }
    },
    
    // Send subscription blocked notification (runs on 29th of each month)
    sendSubscriptionBlockedNotification: (state, action) => {
      const { lenderId, lenderName } = action.payload;
      
      state.notifications.unshift(createNotification(
        NOTIFICATION_TYPES.SUBSCRIPTION_BLOCKED,
        { lenderId, lenderName },
        'lender'
      ));
    },
    
    // Send loan overdue notification (after 7 days)
    sendLoanOverdueNotification: (state, action) => {
      const { loanId, borrowerId, borrowerName, amount, daysOverdue, lenderContact } = action.payload;
      
      state.notifications.unshift(createNotification(
        NOTIFICATION_TYPES.LOAN_OVERDUE,
        { loanId, borrowerId, borrowerName, amount, daysOverdue, lenderContact },
        'borrower'
      ));
    },
    
    // Send loan default notification (after 2 months)
    sendLoanDefaultNotification: (state, action) => {
      const { loanId, borrowerId, borrowerName, amount, defaultDate } = action.payload;
      
      state.notifications.unshift(createNotification(
        NOTIFICATION_TYPES.LOAN_DEFAULT,
        { loanId, borrowerId, borrowerName, amount, defaultDate },
        'borrower'
      ));
      
      // Also notify lender
      state.notifications.unshift(createNotification(
        NOTIFICATION_TYPES.LOAN_DEFAULT,
        { loanId, borrowerId, borrowerName, amount, defaultDate },
        'lender'
      ));
    },
    
    // Send blacklist notification
    sendBlacklistNotification: (state, action) => {
      const { borrowerId, borrowerName, loanId, amount } = action.payload;
      
      state.notifications.unshift(createNotification(
        NOTIFICATION_TYPES.BLACKLIST_ADDED,
        { borrowerId, borrowerName, loanId, amount },
        'borrower'
      ));
    },
    
    // Send group invitation notification
    sendGroupInvitation: (state, action) => {
      const { groupId, groupName, inviterId, inviterName, inviteCode } = action.payload;
      
      state.notifications.unshift(createNotification(
        NOTIFICATION_TYPES.GROUP_INVITATION,
        { groupId, groupName, inviterId, inviterName, inviteCode },
        'default' // Will be filtered by recipient role
      ));
    },
    
    // Send borrower rating notification
    sendBorrowerRating: (state, action) => {
      const { borrowerId, lenderId, lenderName, lenderEmail, rating, loanId } = action.payload;
      
      state.notifications.unshift(createNotification(
        NOTIFICATION_TYPES.BORROWER_RATING,
        { borrowerId, lenderId, lenderName, lenderEmail, rating, loanId },
        'borrower'
      ));
    }
  },
  
  // Selectors for derived state
  selectors: {
    // Get unread notifications count
    getUnreadCount: (state) => state.stats.totalUnread,
    
    // Get notifications by priority
    getNotificationsByPriority: (state, priority) => {
      return state.notifications.filter(n => n.priority === priority);
    },
    
    // Get notifications by type
    getNotificationsByType: (state, type) => {
      return state.notifications.filter(n => n.type === type);
    },
    
    // Get notifications for current user role
    getNotificationsForRole: (state, role) => {
      const roleSettings = state.settings[role] || state.settings.default;
      return state.notifications.filter(notification => {
        // Filter by enabled notification types for this role
        const notificationType = notification.type.toLowerCase().replace(/_/g, '');
        const settingKey = Object.keys(roleSettings).find(key => 
          key.toLowerCase().includes(notificationType)
        );
        return !settingKey || roleSettings[settingKey];
      });
    },
    
    // Get critical notifications (requires action)
    getCriticalNotifications: (state) => {
      return state.notifications.filter(n => 
        n.priority === PRIORITY_LEVELS.CRITICAL || n.requiresAction
      );
    },
    
    // Get notification statistics
    getNotificationStats: (state) => state.stats,
    
    // Check if user has any pending critical notifications
    hasCriticalNotifications: (state) => {
      return state.notifications.some(n => 
        (n.priority === PRIORITY_LEVELS.CRITICAL || n.requiresAction) && !n.read
      );
    },
    
    // Get grouped notifications by category
    getGroupedNotifications: (state) => {
      const grouped = {};
      state.notifications.forEach(notification => {
        if (!grouped[notification.category]) {
          grouped[notification.category] = [];
        }
        grouped[notification.category].push(notification);
      });
      return grouped;
    },
    
    // Get recent notifications (last 7 days)
    getRecentNotifications: (state) => {
      const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
      return state.notifications.filter(n => n.timestamp >= sevenDaysAgo);
    }
  }
});

// Export actions and selectors
export const {
  // Actions
  addNotification,
  markAsRead,
  archiveNotification,
  removeNotification,
  clearAllNotifications,
  toggleNotificationCenter,
  updateNotificationSettings,
  loadNotifications,
  processPendingNotifications,
  cleanupExpiredNotifications,
  setLoading,
  setError,
  requestNotificationPermission,
  sendSubscriptionExpiryWarning,
  sendSubscriptionBlockedNotification,
  sendLoanOverdueNotification,
  sendLoanDefaultNotification,
  sendBlacklistNotification,
  sendGroupInvitation,
  sendBorrowerRating,
  
  // Selectors
  getUnreadCount,
  getNotificationsByPriority,
  getNotificationsByType,
  getNotificationsForRole,
  getCriticalNotifications,
  getNotificationStats,
  hasCriticalNotifications,
  getGroupedNotifications,
  getRecentNotifications
} = notificationSlice;

// Export reducer
export default notificationSlice.reducer;

// Export notification types and priorities for external use
export { NOTIFICATION_TYPES, PRIORITY_LEVELS };

// Business rule notification scheduler
export const NotificationScheduler = {
  // Schedule subscription expiry checks (run on 25th of each month)
  scheduleSubscriptionChecks: () => {
    const today = new Date();
    const dayOfMonth = today.getDate();
    
    if (dayOfMonth === 25) {
      console.log('Running subscription expiry checks...');
      // This would be called from a cron job or scheduled task
      return true;
    }
    return false;
  },
  
  // Schedule subscription block notifications (run on 29th of each month)
  scheduleSubscriptionBlocks: () => {
    const today = new Date();
    const dayOfMonth = today.getDate();
    
    if (dayOfMonth === 29) {
      console.log('Running subscription block notifications...');
      return true;
    }
    return false;
  },
  
  // Schedule loan overdue checks (daily)
  scheduleLoanOverdueChecks: () => {
    console.log('Running daily loan overdue checks...');
    return true;
  },
  
  // Schedule loan default checks (daily, for loans over 2 months)
  scheduleLoanDefaultChecks: () => {
    console.log('Running loan default checks...');
    return true;
  },
  
  // Initialize all scheduled notifications
  initializeSchedules: (store) => {
    // Check subscription expiry (25th of month)
    if (NotificationScheduler.scheduleSubscriptionChecks()) {
      // Get all lenders with subscriptions expiring soon
      // This would query the backend in a real implementation
      const expiringLenders = []; // Placeholder
      expiringLenders.forEach(lender => {
        store.dispatch(sendSubscriptionExpiryWarning(lender));
      });
    }
    
    // Check subscription blocks (29th of month)
    if (NotificationScheduler.scheduleSubscriptionBlocks()) {
      // Get all lenders with expired subscriptions
      const blockedLenders = []; // Placeholder
      blockedLenders.forEach(lender => {
        store.dispatch(sendSubscriptionBlockedNotification(lender));
      });
    }
    
    // Check loan overdue (daily)
    if (NotificationScheduler.scheduleLoanOverdueChecks()) {
      // Get all overdue loans (>7 days)
      const overdueLoans = []; // Placeholder
      overdueLoans.forEach(loan => {
        store.dispatch(sendLoanOverdueNotification(loan));
      });
    }
    
    // Check loan defaults (daily)
    if (NotificationScheduler.scheduleLoanDefaultChecks()) {
      // Get all defaulted loans (>2 months)
      const defaultedLoans = []; // Placeholder
      defaultedLoans.forEach(loan => {
        store.dispatch(sendLoanDefaultNotification(loan));
      });
    }
  }
};

// Notification middleware for business rule enforcement
export const notificationMiddleware = (store) => (next) => (action) => {
  // Intercept actions that should trigger notifications
  const result = next(action);
  
  // Check if action should trigger notification
  if (action.type.includes('loan') || action.type.includes('subscription') || 
      action.type.includes('blacklist') || action.type.includes('rating')) {
    
    // Map action types to notification types
    const notificationMap = {
      // Loan actions
      'LOAN_REQUESTED': NOTIFICATION_TYPES.LOAN_REQUEST,
      'LOAN_APPROVED': NOTIFICATION_TYPES.LOAN_APPROVED,
      'LOAN_DISBURSED': NOTIFICATION_TYPES.LOAN_DISBURSED,
      'LOAN_REPAID': NOTIFICATION_TYPES.LOAN_REPAYMENT,
      
      // Subscription actions
      'SUBSCRIPTION_EXPIRED': NOTIFICATION_TYPES.SUBSCRIPTION_BLOCKED,
      'SUBSCRIPTION_RENEWED': NOTIFICATION_TYPES.SUBSCRIPTION_RENEWAL,
      'SUBSCRIPTION_UPGRADED': NOTIFICATION_TYPES.SUBSCRIPTION_UPGRADE,
      
      // Reputation actions
      'BORROWER_RATED': NOTIFICATION_TYPES.BORROWER_RATING,
      'BLACKLIST_ADDED': NOTIFICATION_TYPES.BLACKLIST_ADDED,
      'BLACKLIST_REMOVED': NOTIFICATION_TYPES.BLACKLIST_REMOVED,
      
      // Group actions
      'GROUP_INVITED': NOTIFICATION_TYPES.GROUP_INVITATION,
      'GROUP_JOINED': NOTIFICATION_TYPES.GROUP_JOINED,
      'GROUP_CREATED': NOTIFICATION_TYPES.GROUP_CREATED
    };
    
    // Find matching notification type
    const actionType = action.type.split('/').pop(); // Get action name
    const notificationType = notificationMap[actionType];
    
    if (notificationType) {
      // Dispatch notification
      store.dispatch(addNotification({
        type: notificationType,
        data: action.payload,
        recipientRole: action.payload?.role || 'default'
      }));
    }
  }
  
  return result;
};

// Initialize notification system
export const initializeNotificationSystem = () => {
  // Load saved notifications
  const savedNotifications = localStorage.getItem('mpesewa_notifications');
  const notifications = savedNotifications ? JSON.parse(savedNotifications) : [];
  
  // Load notification settings
  const settings = {};
  ['lender', 'borrower', 'default'].forEach(role => {
    const savedSettings = localStorage.getItem(`mpesewa_notification_settings_${role}`);
    if (savedSettings) {
      settings[role] = JSON.parse(savedSettings);
    }
  });
  
  // Calculate initial stats
  const stats = {
    totalReceived: notifications.length,
    totalRead: notifications.filter(n => n.read).length,
    totalUnread: notifications.length - notifications.filter(n => n.read).length,
    byType: {},
    byPriority: {}
  };
  
  notifications.forEach(notification => {
    if (!stats.byType[notification.type]) {
      stats.byType[notification.type] = 0;
    }
    stats.byType[notification.type]++;
    
    if (!stats.byPriority[notification.priority]) {
      stats.byPriority[notification.priority] = 0;
    }
    stats.byPriority[notification.priority]++;
  });
  
  return {
    ...initialState,
    notifications,
    settings: { ...initialState.settings, ...settings },
    stats
  };
};

// Persist notification state
export const persistNotificationState = (state) => {
  try {
    // Save notifications (last 50)
    const notificationsToSave = state.notifications.slice(0, 50);
    localStorage.setItem('mpesewa_notifications', JSON.stringify(notificationsToSave));
    
    // Save settings
    Object.keys(state.settings).forEach(role => {
      localStorage.setItem(`mpesewa_notification_settings_${role}`, JSON.stringify(state.settings[role]));
    });
  } catch (error) {
    console.error('Error persisting notification state:', error);
  }
};