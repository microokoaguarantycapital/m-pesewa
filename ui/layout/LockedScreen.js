/**
 * M-Pesewa Locked Screen Component
 * Handles all screen lock scenarios with strict hierarchy and subscription enforcement
 * Shows detailed lock reasons, countdowns, and unlock actions
 */

class LockedScreen {
    constructor(config = {}) {
        this.config = {
            // Lock reasons mapped to M-Pesewa hierarchy and rules
            lockReasons: {
                // Subscription locks (Lenders only)
                'subscription-expired': {
                    title: 'Subscription Expired',
                    message: 'Your lending subscription has expired. All lending features are locked until renewal.',
                    icon: '⏰',
                    color: '#f37021',
                    hierarchy: 'lenders',
                    rules: {
                        type: 'subscription',
                        expiryDate: '28th of each month',
                        gracePeriod: 0,
                        autoUnlock: false,
                        requiresPayment: true
                    },
                    actions: [
                        {
                            label: 'Renew Subscription',
                            url: 'subscription/renew.html',
                            type: 'primary',
                            method: 'payment'
                        },
                        {
                            label: 'View Subscription History',
                            url: 'subscription/history.html',
                            type: 'secondary'
                        }
                    ]
                },
                'subscription-pending': {
                    title: 'Subscription Pending',
                    message: 'Your subscription payment is being processed. Lending access will be unlocked upon confirmation.',
                    icon: '⏳',
                    color: '#0099ff',
                    hierarchy: 'lenders',
                    rules: {
                        type: 'subscription',
                        autoUnlock: true,
                        checkInterval: 30000 // 30 seconds
                    },
                    actions: [
                        {
                            label: 'Check Status',
                            url: '#',
                            type: 'primary',
                            method: 'checkStatus'
                        },
                        {
                            label: 'Contact Support',
                            url: 'contact.html?issue=payment',
                            type: 'secondary'
                        }
                    ]
                },
                'tier-limit-exceeded': {
                    title: 'Tier Limit Exceeded',
                    message: 'You have reached your weekly lending limit. Upgrade your subscription tier for higher limits.',
                    icon: '📊',
                    color: '#28a745',
                    hierarchy: 'lenders',
                    rules: {
                        type: 'limit',
                        resetSchedule: 'weekly',
                        autoUnlock: true,
                        nextReset: 'next Monday'
                    },
                    actions: [
                        {
                            label: 'Upgrade Tier',
                            url: 'subscription/upgrade.html',
                            type: 'primary',
                            method: 'upgrade'
                        },
                        {
                            label: 'View Limits',
                            url: 'lender/limits.html',
                            type: 'secondary'
                        }
                    ]
                },
                
                // Borrower locks
                'blacklisted': {
                    title: 'Account Blacklisted',
                    message: 'Your account has been blacklisted due to loan default. Borrowing is locked until cleared by admin.',
                    icon: '⚫',
                    color: '#dc3545',
                    hierarchy: 'borrowers',
                    rules: {
                        type: 'blacklist',
                        defaultPeriod: '2 months',
                        removalRequirement: 'admin approval after full repayment',
                        autoUnlock: false
                    },
                    actions: [
                        {
                            label: 'View Blacklist Details',
                            url: 'blacklist/status.html',
                            type: 'primary'
                        },
                        {
                            label: 'Contact Admin',
                            url: 'admin/contact.html?issue=blacklist',
                            type: 'secondary',
                            method: 'contact'
                        }
                    ]
                },
                'max-groups-reached': {
                    title: 'Group Limit Reached',
                    message: 'You have reached the maximum of 4 groups. Leave a group to join another.',
                    icon: '🚫',
                    color: '#f37021',
                    hierarchy: 'borrowers',
                    rules: {
                        type: 'limit',
                        maxGroups: 4,
                        autoUnlock: false,
                        requiresAction: 'leave group'
                    },
                    actions: [
                        {
                            label: 'Manage Groups',
                            url: 'borrower/groups.html',
                            type: 'primary'
                        },
                        {
                            label: 'View Group Rules',
                            url: 'groups/rules.html',
                            type: 'secondary'
                        }
                    ]
                },
                'low-rating': {
                    title: 'Rating Too Low',
                    message: 'Your borrower rating is below the required threshold. Improve your repayment history.',
                    icon: '⭐',
                    color: '#f37021',
                    hierarchy: 'borrowers',
                    rules: {
                        type: 'rating',
                        minRating: 3,
                        autoUnlock: true,
                        improvementRequirement: 'timely repayments'
                    },
                    actions: [
                        {
                            label: 'View Rating Details',
                            url: 'borrower/rating.html',
                            type: 'primary'
                        },
                        {
                            label: 'Improve Rating Tips',
                            url: 'help/improve-rating.html',
                            type: 'secondary'
                        }
                    ]
                },
                
                // Group locks
                'group-inactive': {
                    title: 'Group Inactive',
                    message: 'This group is currently inactive. Minimum 5 members required for activation.',
                    icon: '👥',
                    color: '#0099ff',
                    hierarchy: 'groups',
                    rules: {
                        type: 'membership',
                        minMembers: 5,
                        autoUnlock: true,
                        unlockCondition: 'reach 5 members'
                    },
                    actions: [
                        {
                            label: 'Invite Members',
                            url: 'groups/invite.html',
                            type: 'primary'
                        },
                        {
                            label: 'Find Active Groups',
                            url: 'groups/browse.html',
                            type: 'secondary'
                        }
                    ]
                },
                'group-suspended': {
                    title: 'Group Suspended',
                    message: 'This group has been suspended by platform admin due to policy violations.',
                    icon: '⚠️',
                    color: '#dc3545',
                    hierarchy: 'groups',
                    rules: {
                        type: 'admin_action',
                        autoUnlock: false,
                        requiresAdminApproval: true
                    },
                    actions: [
                        {
                            label: 'View Suspension Details',
                            url: 'groups/suspension.html',
                            type: 'primary'
                        },
                        {
                            label: 'Appeal Suspension',
                            url: 'admin/appeal.html',
                            type: 'secondary',
                            method: 'appeal'
                        }
                    ]
                },
                
                // Country locks
                'country-maintenance': {
                    title: 'Country Under Maintenance',
                    message: 'This country is currently undergoing maintenance. Services will resume shortly.',
                    icon: '🔧',
                    color: '#003366',
                    hierarchy: 'countries',
                    rules: {
                        type: 'maintenance',
                        autoUnlock: true,
                        estimatedCompletion: 'check status page'
                    },
                    actions: [
                        {
                            label: 'Check Status',
                            url: 'status.html',
                            type: 'primary',
                            method: 'checkStatus'
                        },
                        {
                            label: 'Select Another Country',
                            url: 'countries/index.html',
                            type: 'secondary'
                        }
                    ]
                },
                'country-restricted': {
                    title: 'Country Restricted',
                    message: 'This country is currently restricted due to regulatory compliance.',
                    icon: '🚫',
                    color: '#003366',
                    hierarchy: 'countries',
                    rules: {
                        type: 'compliance',
                        autoUnlock: false,
                        requiresRegulatoryApproval: true
                    },
                    actions: [
                        {
                            label: 'View Available Countries',
                            url: 'countries/index.html',
                            type: 'primary'
                        },
                        {
                            label: 'Learn About Regulations',
                            url: 'legal/compliance.html',
                            type: 'secondary'
                        }
                    ]
                },
                
                // Security locks
                'suspicious-activity': {
                    title: 'Suspicious Activity Detected',
                    message: 'Your account has been locked due to suspicious activity.',
                    icon: '🔒',
                    color: '#dc3545',
                    hierarchy: 'global',
                    rules: {
                        type: 'security',
                        autoUnlock: false,
                        requiresVerification: true
                    },
                    actions: [
                        {
                            label: 'Verify Identity',
                            url: 'auth/verify.html',
                            type: 'primary',
                            method: 'verify'
                        },
                        {
                            label: 'Contact Security',
                            url: 'security/contact.html',
                            type: 'secondary'
                        }
                    ]
                },
                'device-locked': {
                    title: 'Device Not Recognized',
                    message: 'This device is not authorized to access your account.',
                    icon: '📱',
                    color: '#6c757d',
                    hierarchy: 'global',
                    rules: {
                        type: 'device',
                        autoUnlock: false,
                        requiresDeviceVerification: true
                    },
                    actions: [
                        {
                            label: 'Verify Device',
                            url: 'auth/device-verify.html',
                            type: 'primary',
                            method: 'deviceVerify'
                        },
                        {
                            label: 'Use Another Device',
                            url: 'auth/login.html',
                            type: 'secondary'
                        }
                    ]
                },
                
                // Payment locks
                'payment-overdue': {
                    title: 'Payment Overdue',
                    message: 'You have overdue payments. Settle them to unlock your account.',
                    icon: '💸',
                    color: '#dc3545',
                    hierarchy: 'global',
                    rules: {
                        type: 'payment',
                        autoUnlock: false,
                        requiresFullPayment: true
                    },
                    actions: [
                        {
                            label: 'Make Payment',
                            url: 'payments/make.html',
                            type: 'primary',
                            method: 'payment'
                        },
                        {
                            label: 'Payment Plan',
                            url: 'payments/plan.html',
                            type: 'secondary'
                        }
                    ]
                }
            },
            
            // Countdown configurations
            countdowns: {
                'subscription-expiry': {
                    label: 'Subscription expires in',
                    format: 'days',
                    warningThreshold: 7, // days
                    criticalThreshold: 1, // day
                    actionUrl: 'subscription/renew.html'
                },
                'group-activation': {
                    label: 'Group activation in',
                    format: 'members',
                    target: 5,
                    current: 0,
                    actionUrl: 'groups/invite.html'
                },
                'rating-improvement': {
                    label: 'Rating reset in',
                    format: 'repayments',
                    target: 3,
                    current: 0,
                    actionUrl: 'borrower/repayments.html'
                },
                'maintenance-completion': {
                    label: 'Maintenance completes in',
                    format: 'time',
                    endTime: null,
                    actionUrl: 'status.html'
                }
            },
            
            // Hierarchy lock rules
            hierarchyLockRules: {
                'global': {
                    locks: ['suspicious-activity', 'device-locked', 'payment-overdue'],
                    unlockRequires: ['admin', 'verification']
                },
                'countries': {
                    locks: ['country-maintenance', 'country-restricted'],
                    unlockRequires: ['regulatory', 'maintenance-complete']
                },
                'groups': {
                    locks: ['group-inactive', 'group-suspended'],
                    unlockRequires: ['members', 'admin-approval']
                },
                'lenders': {
                    locks: ['subscription-expired', 'subscription-pending', 'tier-limit-exceeded'],
                    unlockRequires: ['payment', 'time-reset', 'upgrade']
                },
                'borrowers': {
                    locks: ['blacklisted', 'max-groups-reached', 'low-rating'],
                    unlockRequires: ['admin', 'group-change', 'repayment-improvement']
                }
            },
            
            // Auto-check intervals (ms)
            autoCheckIntervals: {
                subscription: 60000, // 1 minute
                group: 300000, // 5 minutes
                rating: 86400000, // 24 hours
                maintenance: 300000 // 5 minutes
            },
            ...config
        };
        
        // Current lock state
        this.lockState = {
            active: false,
            reason: null,
            startTime: null,
            hierarchyLevel: null,
            countdown: null,
            autoUnlock: false,
            checkedAt: null
        };
        
        // Initialize
        this.init();
    }
    
    init() {
        // Add styles
        this.addStyles();
        
        // Load lock state from storage
        this.loadLockState();
        
        // Set up auto-check if lock is active
        if (this.lockState.active) {
            this.setupAutoCheck();
        }
        
        // Listen for lock/unlock events
        this.setupEventListeners();
    }
    
    addStyles() {
        if (!document.querySelector('#mp-locked-screen-styles')) {
            const style = document.createElement('style');
            style.id = 'mp-locked-screen-styles';
            style.textContent = `
                .locked-screen-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(135deg, #1a1d2e 0%, #003366 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 9999;
                    padding: 2rem;
                    animation: fadeIn 0.5s ease;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                .locked-screen-container {
                    background: rgba(255, 255, 255, 0.95);
                    border-radius: 20px;
                    padding: 3rem;
                    max-width: 700px;
                    width: 100%;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(10px);
                    position: relative;
                    overflow: hidden;
                }
                
                .locked-screen-container::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 6px;
                    background: linear-gradient(90deg, #003366, #0099ff, #28a745, #f37021);
                }
                
                .locked-icon {
                    font-size: 6rem;
                    text-align: center;
                    margin-bottom: 1.5rem;
                    animation: pulse 2s ease-in-out infinite;
                }
                
                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }
                
                .locked-title {
                    font-size: 2.5rem;
                    font-weight: 700;
                    color: #003366;
                    text-align: center;
                    margin-bottom: 1rem;
                    font-family: 'Poppins', sans-serif;
                }
                
                .locked-message {
                    font-size: 1.2rem;
                    color: #555555;
                    text-align: center;
                    line-height: 1.6;
                    margin-bottom: 2.5rem;
                }
                
                .lock-details {
                    background: #f8f9fa;
                    border-radius: 12px;
                    padding: 2rem;
                    margin-bottom: 2.5rem;
                    border-left: 4px solid #dc3545;
                }
                
                .details-title {
                    font-size: 1rem;
                    font-weight: 600;
                    color: #dc3545;
                    margin-bottom: 1rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                
                .details-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 1.5rem;
                }
                
                .detail-item {
                    padding: 1rem;
                    background: white;
                    border-radius: 8px;
                    border: 1px solid #e9ecef;
                }
                
                .detail-label {
                    font-size: 0.9rem;
                    color: #6c757d;
                    margin-bottom: 0.5rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                
                .detail-value {
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: #003366;
                }
                
                .hierarchy-lock-path {
                    background: #003366;
                    color: white;
                    border-radius: 12px;
                    padding: 1.5rem;
                    margin-bottom: 2.5rem;
                }
                
                .hierarchy-title {
                    font-size: 0.9rem;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    opacity: 0.8;
                    margin-bottom: 1rem;
                }
                
                .hierarchy-levels {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-wrap: wrap;
                    gap: 1rem;
                }
                
                .hierarchy-level {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 1rem;
                    min-width: 100px;
                }
                
                .level-icon {
                    font-size: 2rem;
                    opacity: 0.7;
                }
                
                .level-name {
                    font-size: 0.9rem;
                    opacity: 0.8;
                }
                
                .level-locked {
                    opacity: 0.3;
                }
                
                .level-current {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 8px;
                    padding: 1rem;
                }
                
                .level-current .level-icon,
                .level-current .level-name {
                    opacity: 1;
                }
                
                .countdown-display {
                    text-align: center;
                    margin: 2rem 0;
                    padding: 1.5rem;
                    background: linear-gradient(135deg, #28a745, #20c997);
                    color: white;
                    border-radius: 12px;
                    animation: glow 2s ease-in-out infinite alternate;
                }
                
                @keyframes glow {
                    from { box-shadow: 0 0 20px rgba(40, 167, 69, 0.3); }
                    to { box-shadow: 0 0 30px rgba(40, 167, 69, 0.6); }
                }
                
                .countdown-label {
                    font-size: 1rem;
                    margin-bottom: 0.5rem;
                    opacity: 0.9;
                }
                
                .countdown-timer {
                    font-size: 3rem;
                    font-weight: 700;
                    font-family: 'Courier New', monospace;
                    margin-bottom: 0.5rem;
                }
                
                .countdown-subtext {
                    font-size: 0.9rem;
                    opacity: 0.8;
                }
                
                .locked-actions {
                    display: flex;
                    gap: 1rem;
                    justify-content: center;
                    flex-wrap: wrap;
                    margin-bottom: 2rem;
                }
                
                .btn-lock-action {
                    padding: 1rem 2rem;
                    border-radius: 10px;
                    font-weight: 600;
                    text-decoration: none;
                    transition: all 0.3s ease;
                    border: none;
                    cursor: pointer;
                    font-family: 'Inter', sans-serif;
                    min-width: 180px;
                    text-align: center;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                }
                
                .btn-primary-lock {
                    background: #003366;
                    color: white;
                }
                
                .btn-primary-lock:hover {
                    background: #002244;
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(0, 51, 102, 0.3);
                }
                
                .btn-secondary-lock {
                    background: #f8f9fa;
                    color: #003366;
                    border: 2px solid #003366;
                }
                
                .btn-secondary-lock:hover {
                    background: #003366;
                    color: white;
                    transform: translateY(-2px);
                }
                
                .btn-danger-lock {
                    background: #dc3545;
                    color: white;
                }
                
                .btn-danger-lock:hover {
                    background: #c82333;
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(220, 53, 69, 0.3);
                }
                
                .emergency-access {
                    margin-top: 2rem;
                    padding-top: 1.5rem;
                    border-top: 1px solid #e9ecef;
                    text-align: center;
                }
                
                .emergency-title {
                    font-size: 0.9rem;
                    color: #6c757d;
                    margin-bottom: 0.75rem;
                }
                
                .emergency-options {
                    display: flex;
                    justify-content: center;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                }
                
                .emergency-link {
                    padding: 0.5rem 1rem;
                    background: #f8f9fa;
                    border-radius: 20px;
                    font-size: 0.85rem;
                    color: #495057;
                    text-decoration: none;
                    transition: all 0.2s ease;
                }
                
                .emergency-link:hover {
                    background: #e9ecef;
                    transform: translateY(-1px);
                }
                
                .lock-status {
                    margin-top: 1.5rem;
                    text-align: center;
                    font-size: 0.9rem;
                    color: #6c757d;
                }
                
                .status-indicator {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.25rem 0.75rem;
                    background: #f8f9fa;
                    border-radius: 20px;
                    margin-left: 0.5rem;
                }
                
                .status-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    display: inline-block;
                }
                
                .status-dot.locked {
                    background: #dc3545;
                    animation: blink 1s ease-in-out infinite;
                }
                
                @keyframes blink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
                
                .status-dot.unlocking {
                    background: #f37021;
                }
                
                .status-dot.unlocked {
                    background: #28a745;
                }
                
                /* Responsive */
                @media (max-width: 768px) {
                    .locked-screen-overlay {
                        padding: 1rem;
                    }
                    
                    .locked-screen-container {
                        padding: 2rem 1.5rem;
                    }
                    
                    .locked-icon {
                        font-size: 4rem;
                    }
                    
                    .locked-title {
                        font-size: 2rem;
                    }
                    
                    .locked-message {
                        font-size: 1rem;
                    }
                    
                    .details-grid {
                        grid-template-columns: 1fr;
                    }
                    
                    .countdown-timer {
                        font-size: 2.5rem;
                    }
                    
                    .locked-actions {
                        flex-direction: column;
                    }
                    
                    .btn-lock-action {
                        width: 100%;
                    }
                    
                    .hierarchy-levels {
                        flex-direction: column;
                        gap: 0.5rem;
                    }
                }
                
                /* Dark mode */
                @media (prefers-color-scheme: dark) {
                    .locked-screen-container {
                        background: rgba(26, 29, 46, 0.95);
                        border-color: rgba(255, 255, 255, 0.05);
                    }
                    
                    .locked-title {
                        color: #ffffff;
                    }
                    
                    .locked-message {
                        color: #a0aec0;
                    }
                    
                    .lock-details {
                        background: #2d3748;
                        border-left-color: #fc8181;
                    }
                    
                    .details-title {
                        color: #fc8181;
                    }
                    
                    .detail-item {
                        background: #4a5568;
                        border-color: #718096;
                    }
                    
                    .detail-label {
                        color: #cbd5e0;
                    }
                    
                    .detail-value {
                        color: #ffffff;
                    }
                    
                    .btn-secondary-lock {
                        background: #4a5568;
                        color: #e2e8f0;
                        border-color: #718096;
                    }
                    
                    .emergency-link {
                        background: #4a5568;
                        color: #cbd5e0;
                    }
                    
                    .emergency-link:hover {
                        background: #718096;
                    }
                    
                    .status-indicator {
                        background: #4a5568;
                        color: #cbd5e0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    loadLockState() {
        try {
            const savedState = localStorage.getItem('mpesewa_lock_state');
            if (savedState) {
                this.lockState = JSON.parse(savedState);
                
                // Check if lock is still valid
                if (this.lockState.active) {
                    this.checkLockValidity();
                }
            }
        } catch (error) {
            console.error('Failed to load lock state:', error);
        }
    }
    
    saveLockState() {
        try {
            localStorage.setItem('mpesewa_lock_state', JSON.stringify(this.lockState));
        } catch (error) {
            console.error('Failed to save lock state:', error);
        }
    }
    
    checkLockValidity() {
        // Check if lock should still be active
        if (this.lockState.reason && this.config.lockReasons[this.lockState.reason]) {
            const lockConfig = this.config.lockReasons[this.lockState.reason];
            
            // Check auto-unlock conditions
            if (lockConfig.rules.autoUnlock) {
                this.autoCheckUnlock();
            }
        }
    }
    
    setupAutoCheck() {
        if (!this.lockState.reason) return;
        
        const lockConfig = this.config.lockReasons[this.lockState.reason];
        if (!lockConfig || !lockConfig.rules.autoUnlock) return;
        
        // Determine check interval based on lock type
        let interval = this.config.autoCheckIntervals.subscription; // Default
        
        if (this.lockState.hierarchyLevel === 'groups') {
            interval = this.config.autoCheckIntervals.group;
        } else if (this.lockState.hierarchyLevel === 'borrowers' && this.lockState.reason === 'low-rating') {
            interval = this.config.autoCheckIntervals.rating;
        } else if (this.lockState.hierarchyLevel === 'countries' && this.lockState.reason === 'country-maintenance') {
            interval = this.config.autoCheckIntervals.maintenance;
        }
        
        // Set up interval check
        this.autoCheckInterval = setInterval(() => {
            this.autoCheckUnlock();
        }, interval);
    }
    
    autoCheckUnlock() {
        // Simulate auto-unlock check
        // In real implementation, this would make API calls
        console.log('Auto-checking unlock conditions...');
        
        // For demo, randomly unlock after some time
        if (this.lockState.startTime) {
            const lockDuration = Date.now() - this.lockState.startTime;
            const shouldUnlock = lockDuration > 300000; // 5 minutes for demo
            
            if (shouldUnlock && Math.random() > 0.7) {
                this.unlock('auto-check');
            }
        }
    }
    
    setupEventListeners() {
        // Listen for lock/unlock events from other components
        window.addEventListener('mpesewa:lock', (event) => {
            if (event.detail && event.detail.reason) {
                this.lock(event.detail.reason, event.detail.data);
            }
        });
        
        window.addEventListener('mpesewa:unlock', (event) => {
            if (event.detail && event.detail.reason) {
                this.unlock(event.detail.reason, event.detail.data);
            }
        });
        
        // Listen for storage changes
        window.addEventListener('storage', (e) => {
            if (e.key === 'mpesewa_lock_state') {
                this.loadLockState();
            }
        });
    }
    
    /**
     * Lock the screen with specified reason
     * @param {string} reason - Lock reason key
     * @param {Object} data - Additional data for the lock
     */
    lock(reason, data = {}) {
        const lockConfig = this.config.lockReasons[reason];
        if (!lockConfig) {
            console.error('Unknown lock reason:', reason);
            return;
        }
        
        this.lockState = {
            active: true,
            reason: reason,
            startTime: Date.now(),
            hierarchyLevel: lockConfig.hierarchy,
            countdown: this.createCountdown(reason, data),
            autoUnlock: lockConfig.rules.autoUnlock || false,
            checkedAt: Date.now(),
            data: data
        };
        
        this.saveLockState();
        
        // Set up auto-check if needed
        if (lockConfig.rules.autoUnlock) {
            this.setupAutoCheck();
        }
        
        // Dispatch lock event
        window.dispatchEvent(new CustomEvent('mpesewa:screen-locked', {
            detail: this.lockState
        }));
        
        // Render lock screen
        this.render();
    }
    
    createCountdown(reason, data) {
        const countdownConfig = this.config.countdowns;
        
        switch (reason) {
            case 'subscription-expired':
                // Calculate days until next 28th
                const today = new Date();
                const currentMonth = today.getMonth();
                const currentYear = today.getFullYear();
                
                // Find next 28th
                let next28th = new Date(currentYear, currentMonth, 28);
                if (today.getDate() > 28) {
                    next28th.setMonth(next28th.getMonth() + 1);
                }
                
                const daysUntil = Math.ceil((next28th - today) / (1000 * 60 * 60 * 24));
                
                return {
                    type: 'subscription-expiry',
                    label: countdownConfig['subscription-expiry'].label,
                    value: daysUntil,
                    format: 'days',
                    critical: daysUntil <= 1,
                    warning: daysUntil <= 7
                };
                
            case 'group-inactive':
                const membersNeeded = 5 - (data.currentMembers || 0);
                return {
                    type: 'group-activation',
                    label: countdownConfig['group-activation'].label,
                    value: membersNeeded,
                    format: 'members',
                    target: 5,
                    current: data.currentMembers || 0
                };
                
            case 'low-rating':
                const repaymentsNeeded = 3 - (data.currentRepayments || 0);
                return {
                    type: 'rating-improvement',
                    label: countdownConfig['rating-improvement'].label,
                    value: repaymentsNeeded,
                    format: 'repayments',
                    target: 3,
                    current: data.currentRepayments || 0
                };
                
            case 'country-maintenance':
                // Set maintenance end time (demo: 1 hour from now)
                const endTime = Date.now() + 3600000;
                return {
                    type: 'maintenance-completion',
                    label: countdownConfig['maintenance-completion'].label,
                    endTime: endTime,
                    format: 'time'
                };
                
            default:
                return null;
        }
    }
    
    updateCountdown() {
        if (!this.lockState.countdown) return;
        
        const countdown = this.lockState.countdown;
        
        switch (countdown.type) {
            case 'subscription-expiry':
                // Recalculate days
                const today = new Date();
                const currentMonth = today.getMonth();
                const currentYear = today.getFullYear();
                
                let next28th = new Date(currentYear, currentMonth, 28);
                if (today.getDate() > 28) {
                    next28th.setMonth(next28th.getMonth() + 1);
                }
                
                const daysUntil = Math.ceil((next28th - today) / (1000 * 60 * 60 * 24));
                countdown.value = daysUntil;
                countdown.critical = daysUntil <= 1;
                countdown.warning = daysUntil <= 7;
                break;
                
            case 'maintenance-completion':
                if (countdown.endTime) {
                    const timeLeft = countdown.endTime - Date.now();
                    if (timeLeft <= 0) {
                        countdown.value = 0;
                        // Auto-unlock if maintenance completed
                        if (this.lockState.reason === 'country-maintenance') {
                            setTimeout(() => this.unlock('maintenance-complete'), 1000);
                        }
                    } else {
                        countdown.value = Math.ceil(timeLeft / 60000); // minutes
                    }
                }
                break;
        }
        
        this.saveLockState();
        
        // Update UI if rendered
        if (this.currentContainer) {
            this.renderCountdown(this.currentContainer);
        }
    }
    
    renderCountdown(container) {
        const countdown = this.lockState.countdown;
        if (!countdown) return;
        
        const countdownElement = container.querySelector('.countdown-display');
        if (!countdownElement) return;
        
        let displayValue = '';
        let subtext = '';
        
        switch (countdown.format) {
            case 'days':
                displayValue = `${countdown.value} day${countdown.value !== 1 ? 's' : ''}`;
                subtext = countdown.critical ? 'URGENT - Renew now!' : 
                         countdown.warning ? 'Renew soon to avoid disruption' : 
                         'Plan your renewal';
                break;
                
            case 'members':
                displayValue = `${countdown.value} more member${countdown.value !== 1 ? 's' : ''}`;
                subtext = `${countdown.current} of ${countdown.target} members`;
                break;
                
            case 'repayments':
                displayValue = `${countdown.value} repayment${countdown.value !== 1 ? 's' : ''}`;
                subtext = `${countdown.current} of ${countdown.target} completed`;
                break;
                
            case 'time':
                if (countdown.value <= 0) {
                    displayValue = 'Completed';
                    subtext = 'Services resuming...';
                } else {
                    const hours = Math.floor(countdown.value / 60);
                    const minutes = countdown.value % 60;
                    displayValue = `${hours}h ${minutes}m`;
                    subtext = 'Estimated completion';
                }
                break;
        }
        
        countdownElement.innerHTML = `
            <div class="countdown-label">${countdown.label}</div>
            <div class="countdown-timer">${displayValue}</div>
            <div class="countdown-subtext">${subtext}</div>
        `;
        
        // Add warning/critical styling
        if (countdown.critical) {
            countdownElement.style.background = 'linear-gradient(135deg, #dc3545, #e83e8c)';
        } else if (countdown.warning) {
            countdownElement.style.background = 'linear-gradient(135deg, #f37021, #fd7e14)';
        }
    }
    
    getHierarchyLevels() {
        const hierarchy = {
            'global': { icon: '🌍', name: 'Global', locked: false },
            'countries': { icon: '🇺🇳', name: 'Country', locked: false },
            'groups': { icon: '👥', name: 'Group', locked: false },
            'lenders': { icon: '💰', name: 'Lender', locked: false },
            'borrowers': { icon: '🙋', name: 'Borrower', locked: false }
        };
        
        // Mark all levels up to and including current as locked
        const currentLevel = this.lockState.hierarchyLevel;
        const levels = ['global', 'countries', 'groups', 'lenders', 'borrowers'];
        
        let reachedCurrent = false;
        levels.forEach(level => {
            if (level === currentLevel) reachedCurrent = true;
            hierarchy[level].locked = reachedCurrent;
        });
        
        return hierarchy;
    }
    
    getEmergencyLinks() {
        const userRole = localStorage.getItem('mpesewa_role');
        const country = localStorage.getItem('mpesewa_country');
        
        const links = [
            { label: 'Contact Support', url: 'contact.html' },
            { label: 'Help Center', url: 'help.html' },
            { label: 'Status Page', url: 'status.html' }
        ];
        
        if (userRole === 'lender') {
            links.push({ label: 'Lender FAQ', url: 'lender/faq.html' });
        } else if (userRole === 'borrower') {
            links.push({ label: 'Borrower FAQ', url: 'borrower/faq.html' });
        }
        
        if (country) {
            links.push({ 
                label: `${country.toUpperCase()} Support`, 
                url: `countries/${country}.html#support` 
            });
        }
        
        return links;
    }
    
    render(container = document.body) {
        if (!this.lockState.active || !this.lockState.reason) {
            if (container.classList.contains('locked-screen-overlay')) {
                container.remove();
            }
            return;
        }
        
        const lockConfig = this.config.lockReasons[this.lockState.reason];
        if (!lockConfig) return;
        
        const hierarchyLevels = this.getHierarchyLevels();
        const emergencyLinks = this.getEmergencyLinks();
        
        const html = `
            <div class="locked-screen-overlay">
                <div class="locked-screen-container">
                    <div class="locked-icon" style="color: ${lockConfig.color};">
                        ${lockConfig.icon}
                    </div>
                    
                    <h1 class="locked-title">${lockConfig.title}</h1>
                    
                    <p class="locked-message">${lockConfig.message}</p>
                    
                    <div class="lock-details">
                        <div class="details-title">
                            <span>🔒 Lock Details</span>
                        </div>
                        <div class="details-grid">
                            <div class="detail-item">
                                <div class="detail-label">
                                    <span>Lock Reason</span>
                                </div>
                                <div class="detail-value">${lockConfig.title}</div>
                            </div>
                            
                            <div class="detail-item">
                                <div class="detail-label">
                                    <span>Hierarchy Level</span>
                                </div>
                                <div class="detail-value">
                                    ${this.lockState.hierarchyLevel}
                                </div>
                            </div>
                            
                            <div class="detail-item">
                                <div class="detail-label">
                                    <span>Lock Type</span>
                                </div>
                                <div class="detail-value">
                                    ${lockConfig.rules.type}
                                </div>
                            </div>
                            
                            <div class="detail-item">
                                <div class="detail-label">
                                    <span>Auto Unlock</span>
                                </div>
                                <div class="detail-value">
                                    ${lockConfig.rules.autoUnlock ? 'Yes' : 'No'}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="hierarchy-lock-path">
                        <div class="hierarchy-title">Hierarchy Impact</div>
                        <div class="hierarchy-levels">
                            ${Object.entries(hierarchyLevels).map(([key, level]) => `
                                <div class="hierarchy-level ${level.locked ? 'level-locked' : ''} 
                                    ${key === this.lockState.hierarchyLevel ? 'level-current' : ''}">
                                    <div class="level-icon">${level.icon}</div>
                                    <div class="level-name">${level.name}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    ${this.lockState.countdown ? `
                        <div class="countdown-display">
                            <!-- Countdown will be populated by JavaScript -->
                        </div>
                    ` : ''}
                    
                    ${lockConfig.actions && lockConfig.actions.length > 0 ? `
                        <div class="locked-actions">
                            ${lockConfig.actions.map(action => `
                                <a href="${action.url}" 
                                   class="btn-lock-action ${action.type === 'primary' ? 'btn-primary-lock' : 
                                                          action.type === 'danger' ? 'btn-danger-lock' : 
                                                          'btn-secondary-lock'}"
                                   data-action-method="${action.method || 'navigate'}">
                                    ${action.label}
                                </a>
                            `).join('')}
                        </div>
                    ` : ''}
                    
                    <div class="emergency-access">
                        <div class="emergency-title">Need immediate help?</div>
                        <div class="emergency-options">
                            ${emergencyLinks.map(link => `
                                <a href="${link.url}" class="emergency-link">${link.label}</a>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="lock-status">
                        Locked since ${new Date(this.lockState.startTime).toLocaleTimeString()}
                        <span class="status-indicator">
                            <span class="status-dot locked"></span>
                            Locked
                        </span>
                    </div>
                </div>
            </div>
        `;
        
        // Clear container and add lock screen
        if (container === document.body) {
            // Remove any existing lock screen
            const existing = document.querySelector('.locked-screen-overlay');
            if (existing) existing.remove();
            
            // Add new lock screen
            document.body.insertAdjacentHTML('beforeend', html);
            this.currentContainer = document.querySelector('.locked-screen-overlay');
        } else {
            container.innerHTML = html;
            this.currentContainer = container.querySelector('.locked-screen-overlay') || container;
        }
        
        // Set up countdown if exists
        if (this.lockState.countdown) {
            this.renderCountdown(this.currentContainer);
            // Update countdown every minute
            this.countdownInterval = setInterval(() => {
                this.updateCountdown();
            }, 60000);
        }
        
        // Set up action handlers
        this.setupActionHandlers(this.currentContainer);
        
        // Prevent body scrolling
        document.body.style.overflow = 'hidden';
    }
    
    setupActionHandlers(container) {
        container.querySelectorAll('[data-action-method]').forEach(button => {
            button.addEventListener('click', (e) => {
                const method = button.dataset.actionMethod;
                
                switch (method) {
                    case 'payment':
                        e.preventDefault();
                        this.handlePayment(button.href);
                        break;
                    case 'upgrade':
                        e.preventDefault();
                        this.handleUpgrade(button.href);
                        break;
                    case 'checkStatus':
                        e.preventDefault();
                        this.handleCheckStatus();
                        break;
                    case 'verify':
                        e.preventDefault();
                        this.handleVerification(button.href);
                        break;
                    case 'deviceVerify':
                        e.preventDefault();
                        this.handleDeviceVerification(button.href);
                        break;
                    case 'appeal':
                        e.preventDefault();
                        this.handleAppeal(button.href);
                        break;
                    case 'contact':
                        e.preventDefault();
                        this.handleContact(button.href);
                        break;
                }
            });
        });
    }
    
    handlePayment(url) {
        // In real implementation, open payment modal
        console.log('Processing payment for unlock...');
        // Simulate payment success after 3 seconds
        setTimeout(() => {
            this.unlock('payment-received');
            window.location.href = url;
        }, 3000);
    }
    
    handleUpgrade(url) {
        window.location.href = url;
    }
    
    handleCheckStatus() {
        // Simulate status check
        console.log('Checking unlock status...');
        
        // Show loading state
        const button = document.querySelector('[data-action-method="checkStatus"]');
        if (button) {
            const originalText = button.textContent;
            button.textContent = 'Checking...';
            button.disabled = true;
            
            setTimeout(() => {
                button.textContent = originalText;
                button.disabled = false;
                
                // Simulate status update
                alert('Status: Still processing. Please check again in a few minutes.');
            }, 2000);
        }
    }
    
    handleVerification(url) {
        window.location.href = url;
    }
    
    handleDeviceVerification(url) {
        window.location.href = url;
    }
    
    handleAppeal(url) {
        window.location.href = url;
    }
    
    handleContact(url) {
        window.location.href = url;
    }
    
    /**
     * Unlock the screen
     * @param {string} reason - Unlock reason
     * @param {Object} data - Additional data
     */
    unlock(reason, data = {}) {
        // Clear intervals
        if (this.autoCheckInterval) {
            clearInterval(this.autoCheckInterval);
            this.autoCheckInterval = null;
        }
        
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
            this.countdownInterval = null;
        }
        
        // Update lock state
        this.lockState = {
            active: false,
            reason: null,
            startTime: null,
            hierarchyLevel: null,
            countdown: null,
            autoUnlock: false,
            checkedAt: Date.now(),
            unlockedReason: reason,
            unlockedData: data
        };
        
        this.saveLockState();
        
        // Remove lock screen from DOM
        const lockScreen = document.querySelector('.locked-screen-overlay');
        if (lockScreen) {
            lockScreen.remove();
        }
        
        // Restore body scrolling
        document.body.style.overflow = '';
        
        // Dispatch unlock event
        window.dispatchEvent(new CustomEvent('mpesewa:screen-unlocked', {
            detail: { reason, data }
        }));
        
        // Show unlock notification
        this.showUnlockNotification(reason);
    }
    
    showUnlockNotification(reason) {
        const notification = document.createElement('div');
        notification.className = 'unlock-notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
            z-index: 10000;
            animation: slideIn 0.3s ease, fadeOut 0.3s ease 2.7s;
            font-family: 'Inter', sans-serif;
            font-weight: 500;
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span style="font-size: 1.2rem;">✅</span>
                <span>Screen unlocked! ${reason === 'payment-received' ? 'Payment confirmed.' : 'Access restored.'}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Remove after animation
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }
    
    /**
     * Check if screen is locked for a specific feature
     * @param {string} feature - Feature to check
     * @returns {Object} Lock status
     */
    isLockedFor(feature) {
        if (!this.lockState.active) {
            return { locked: false };
        }
        
        // Map features to hierarchy levels
        const featureHierarchy = {
            'lend': 'lenders',
            'borrow': 'borrowers',
            'manage-group': 'groups',
            'view-country': 'countries'
        };
        
        const hierarchyLevel = featureHierarchy[feature];
        if (!hierarchyLevel) {
            return { locked: false };
        }
        
        // Check if current lock affects this hierarchy level
        const hierarchyOrder = ['global', 'countries', 'groups', 'lenders', 'borrowers'];
        const lockIndex = hierarchyOrder.indexOf(this.lockState.hierarchyLevel);
        const featureIndex = hierarchyOrder.indexOf(hierarchyLevel);
        
        const locked = lockIndex >= featureIndex;
        
        return {
            locked,
            reason: locked ? this.lockState.reason : null,
            hierarchyLevel: this.lockState.hierarchyLevel
        };
    }
    
    /**
     * Register web component
     */
    static registerWebComponent() {
        if (!customElements.get('mp-locked-screen')) {
            class MPLockedScreen extends HTMLElement {
                constructor() {
                    super();
                    this.attachShadow({ mode: 'open' });
                    this.lockedScreen = new LockedScreen();
                }
                
                connectedCallback() {
                    const reason = this.getAttribute('reason');
                    const feature = this.getAttribute('feature');
                    
                    if (reason) {
                        const data = JSON.parse(this.getAttribute('data') || '{}');
                        this.lockedScreen.lock(reason, data);
                        this.shadowRoot.innerHTML = this.lockedScreen.render();
                    } else if (feature) {
                        const lockStatus = this.lockedScreen.isLockedFor(feature);
                        if (lockStatus.locked) {
                            this.lockedScreen.lock(lockStatus.reason);
                            this.shadowRoot.innerHTML = this.lockedScreen.render();
                        }
                    }
                }
                
                static get observedAttributes() {
                    return ['reason', 'feature', 'data'];
                }
                
                attributeChangedCallback(name, oldValue, newValue) {
                    if (oldValue !== newValue && this.isConnected) {
                        this.connectedCallback();
                    }
                }
            }
            
            customElements.define('mp-locked-screen', MPLockedScreen);
        }
    }
}

// Export for module system
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LockedScreen;
} else if (typeof window !== 'undefined') {
    window.MPLockedScreen = LockedScreen;
    
    // Auto-initialize
    document.addEventListener('DOMContentLoaded', () => {
        LockedScreen.registerWebComponent();
        
        // Check for initial lock state
        const lockedScreen = new LockedScreen();
        if (lockedScreen.lockState.active) {
            lockedScreen.render();
        }
        
        // Auto-lock check for subscription expiry
        const subscription = JSON.parse(localStorage.getItem('mpesewa_subscription') || 'null');
        if (subscription && subscription.expired) {
            lockedScreen.lock('subscription-expired', {
                expiryDate: subscription.expiryDate,
                level: subscription.level
            });
        }
    });
}

// Global lock functions
if (typeof window !== 'undefined') {
    window.lockScreen = function(reason, data) {
        const lockedScreen = new LockedScreen();
        lockedScreen.lock(reason, data);
    };
    
    window.unlockScreen = function(reason, data) {
        const lockedScreen = new LockedScreen();
        lockedScreen.unlock(reason, data);
    };
    
    window.isScreenLocked = function(feature) {
        const lockedScreen = new LockedScreen();
        return lockedScreen.isLockedFor(feature);
    };
}