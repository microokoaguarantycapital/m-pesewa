/**
 * M-PESEWA APPLICATION LIFECYCLE MANAGEMENT
 * State management, navigation guards, subscription enforcement
 * Strict lifecycle management for fintech compliance
 */

import { 
    HIERARCHY, 
    SUPPORTED_COUNTRIES, 
    LOAN_RULES, 
    SUBSCRIPTION_TIERS,
    isSubscriptionExpired,
    calculateLoan,
    canJoinMoreGroups
} from './bootstrap.js';

// Application lifecycle states
const LIFECYCLE_STATES = {
    UNINITIALIZED: 'UNINITIALIZED',
    BOOTING: 'BOOTING',
    INITIALIZING: 'INITIALIZING',
    READY: 'READY',
    ACTIVE: 'ACTIVE',
    SUSPENDED: 'SUSPENDED',
    TERMINATING: 'TERMINATING',
    TERMINATED: 'TERMINATED',
    ERROR: 'ERROR'
};

// User role states
const ROLE_STATES = {
    GUEST: 'GUEST',
    BORROWER: 'BORROWER',
    LENDER: 'LENDER',
    GROUP_ADMIN: 'GROUP_ADMIN',
    PLATFORM_ADMIN: 'PLATFORM_ADMIN',
    SUSPENDED: 'SUSPENDED',
    BLACKLISTED: 'BLACKLISTED'
};

// Subscription states
const SUBSCRIPTION_STATES = {
    UNSUBSCRIBED: 'UNSUBSCRIBED',
    ACTIVE: 'ACTIVE',
    EXPIRED: 'EXPIRED',
    SUSPENDED: 'SUSPENDED',
    CANCELLED: 'CANCELLED',
    GRACE_PERIOD: 'GRACE_PERIOD'
};

// Current application state
let currentState = LIFECYCLE_STATES.UNINITIALIZED;
let currentRole = ROLE_STATES.GUEST;
let currentSubscription = SUBSCRIPTION_STATES.UNSUBSCRIBED;

// State change listeners
const stateChangeListeners = new Set();
const roleChangeListeners = new Set();
const subscriptionChangeListeners = new Set();

// Navigation guards
const navigationGuards = new Set();

// Application lifecycle hooks
const lifecycleHooks = {
    beforeCreate: new Set(),
    created: new Set(),
    beforeMount: new Set(),
    mounted: new Set(),
    beforeUpdate: new Set(),
    updated: new Set(),
    beforeDestroy: new Set(),
    destroyed: new Set(),
    errorCaptured: new Set()
};

// Performance monitoring
const performanceMetrics = {
    startTime: Date.now(),
    pageLoads: 0,
    apiCalls: 0,
    errors: 0,
    userActions: 0
};

/**
 * Start the application lifecycle
 * @param {Object} initResult - Initialization result from app-init
 */
export function startLifecycle(initResult = {}) {
    try {
        console.log('🔋 STARTING APPLICATION LIFECYCLE');
        
        // 1. Set initial state
        setState(LIFECYCLE_STATES.BOOTING);
        
        // 2. Execute beforeCreate hooks
        executeHooks('beforeCreate', initResult);
        
        // 3. Initialize core services
        initializeCoreServices();
        
        // 4. Execute created hooks
        executeHooks('created', initResult);
        
        // 5. Load user session if exists
        loadUserSession();
        
        // 6. Set state to INITIALIZING
        setState(LIFECYCLE_STATES.INITIALIZING);
        
        // 7. Set up navigation guards
        setupNavigationGuards();
        
        // 8. Set up event listeners
        setupEventListeners();
        
        // 9. Start performance monitoring
        startPerformanceMonitoring();
        
        // 10. Set state to READY
        setState(LIFECYCLE_STATES.READY);
        
        // 11. Execute beforeMount hooks
        executeHooks('beforeMount', initResult);
        
        // 12. Mount application
        mountApplication();
        
        // 13. Execute mounted hooks
        executeHooks('mounted', initResult);
        
        // 14. Set state to ACTIVE
        setState(LIFECYCLE_STATES.ACTIVE);
        
        // 15. Start background tasks
        startBackgroundTasks();
        
        console.log('✅ APPLICATION LIFECYCLE STARTED');
        
        // Log initial metrics
        logMetric('lifecycle_started', {
            state: currentState,
            role: currentRole,
            subscription: currentSubscription,
            timestamp: Date.now()
        });
        
    } catch (error) {
        console.error('❌ LIFECYCLE START FAILED:', error);
        setState(LIFECYCLE_STATES.ERROR);
        handleLifecycleError(error);
        throw error;
    }
}

/**
 * Initialize core services
 */
function initializeCoreServices() {
    console.log('🔧 INITIALIZING CORE SERVICES');
    
    // 1. Initialize state management
    initializeStateManagement();
    
    // 2. Initialize subscription service
    initializeSubscriptionService();
    
    // 3. Initialize loan calculator service
    initializeLoanCalculatorService();
    
    // 4. Initialize reputation service
    initializeReputationService();
    
    // 5. Initialize blacklist service
    initializeBlacklistService();
    
    // 6. Initialize debt collector service
    initializeDebtCollectorService();
    
    // 7. Initialize group service
    initializeGroupService();
    
    console.log('✅ CORE SERVICES INITIALIZED');
}

/**
 * Initialize state management
 */
function initializeStateManagement() {
    // Create reactive state object
    const state = {
        user: null,
        country: null,
        group: null,
        ledger: null,
        notifications: [],
        permissions: {},
        settings: {}
    };
    
    // Make state reactive
    window.MPESEWA_STATE = new Proxy(state, {
        set(target, property, value) {
            const oldValue = target[property];
            target[property] = value;
            
            // Notify listeners of state change
            if (oldValue !== value) {
                notifyStateChange(property, value, oldValue);
            }
            
            // Persist certain state changes
            if (['user', 'country', 'group'].includes(property)) {
                persistState(property, value);
            }
            
            return true;
        }
    });
    
    console.log('🏗️ STATE MANAGEMENT INITIALIZED');
}

/**
 * Initialize subscription service
 */
function initializeSubscriptionService() {
    const subscriptionService = {
        // Check subscription status
        checkStatus(user) {
            if (!user || !user.subscription) {
                return SUBSCRIPTION_STATES.UNSUBSCRIBED;
            }
            
            if (isSubscriptionExpired(user.subscription.expiryDate)) {
                return SUBSCRIPTION_STATES.EXPIRED;
            }
            
            return SUBSCRIPTION_STATES.ACTIVE;
        },
        
        // Get subscription tier
        getTier(tierName) {
            return SUBSCRIPTION_TIERS[tierName.toUpperCase()];
        },
        
        // Calculate subscription expiry
        calculateExpiry(startDate, duration) {
            const expiry = new Date(startDate);
            switch (duration) {
                case 'monthly':
                    expiry.setMonth(expiry.getMonth() + 1);
                    break;
                case 'biAnnual':
                    expiry.setMonth(expiry.getMonth() + 6);
                    break;
                case 'annual':
                    expiry.setFullYear(expiry.getFullYear() + 1);
                    break;
                default:
                    expiry.setMonth(expiry.getMonth() + 1);
            }
            
            // Ensure expiry is on 28th of month
            expiry.setDate(LOAN_RULES.SUBSCRIPTION_EXPIRY_DAY);
            
            return expiry;
        },
        
        // Check if user can lend
        canLend(user) {
            if (!user || user.role !== ROLE_STATES.LENDER) {
                return false;
            }
            
            const status = this.checkStatus(user);
            return status === SUBSCRIPTION_STATES.ACTIVE;
        },
        
        // Get lending limit
        getLendingLimit(user) {
            if (!this.canLend(user)) {
                return 0;
            }
            
            const tier = this.getTier(user.subscription.tier);
            return tier ? tier.maxPerWeek : 0;
        }
    };
    
    window.MPESEWA_SUBSCRIPTION = subscriptionService;
    console.log('💰 SUBSCRIPTION SERVICE INITIALIZED');
}

/**
 * Initialize loan calculator service
 */
function initializeLoanCalculatorService() {
    const loanCalculator = {
        // Calculate loan details
        calculate(amount, days = 7, countryCode = null) {
            const calculation = calculateLoan(amount, days);
            
            // Add country-specific adjustments
            if (countryCode) {
                calculation.country = countryCode;
                calculation.currency = SUPPORTED_COUNTRIES.find(c => c.code === countryCode)?.currency || '';
            }
            
            return calculation;
        },
        
        // Calculate penalties
        calculatePenalties(amount, overdueDays) {
            if (overdueDays <= 7) return 0;
            
            const penaltyDays = overdueDays - 7;
            const dailyPenalty = (amount * LOAN_RULES.DAILY_PENALTY_PERCENT) / 100;
            return dailyPenalty * penaltyDays;
        },
        
        // Calculate total repayable with penalties
        calculateTotalWithPenalties(amount, overdueDays) {
            const loan = calculateLoan(amount);
            const penalties = this.calculatePenalties(amount, overdueDays);
            
            return {
                ...loan,
                penalties: penalties,
                totalWithPenalties: loan.totalRepayable + penalties,
                overdueDays: overdueDays,
                isDefaulted: overdueDays >= LOAN_RULES.DEFAULT_AFTER_DAYS
            };
        },
        
        // Calculate daily repayment schedule
        generateRepaymentSchedule(amount, startDate = new Date()) {
            const loan = calculateLoan(amount);
            const schedule = [];
            const start = new Date(startDate);
            
            for (let i = 1; i <= loan.repaymentPeriod; i++) {
                const dueDate = new Date(start);
                dueDate.setDate(dueDate.getDate() + i);
                
                schedule.push({
                    day: i,
                    dueDate: dueDate.toISOString().split('T')[0],
                    amount: parseFloat(loan.dailyRepayment),
                    status: 'pending'
                });
            }
            
            return schedule;
        }
    };
    
    window.MPESEWA_CALCULATOR = loanCalculator;
    console.log('🧮 LOAN CALCULATOR SERVICE INITIALIZED');
}

/**
 * Initialize reputation service
 */
function initializeReputationService() {
    const reputationService = {
        // Calculate borrower rating
        calculateRating(borrower) {
            if (!borrower || !borrower.loanHistory) {
                return 5; // Default rating for new borrowers
            }
            
            const history = borrower.loanHistory;
            const totalLoans = history.length;
            
            if (totalLoans === 0) return 5;
            
            // Weighted rating calculation
            let weightedSum = 0;
            let totalWeight = 0;
            
            history.forEach((loan, index) => {
                const weight = 1 / (index + 1); // Recent loans have more weight
                weightedSum += loan.rating * weight;
                totalWeight += weight;
            });
            
            const averageRating = weightedSum / totalWeight;
            
            // Adjust based on repayment behavior
            const onTimeRepayments = history.filter(loan => 
                loan.status === 'cleared' && loan.daysOverdue <= 0
            ).length;
            
            const repaymentRate = onTimeRepayments / totalLoans;
            
            // Final rating (1-5)
            let finalRating = averageRating * 0.7 + (repaymentRate * 5) * 0.3;
            
            // Cap between 1 and 5
            return Math.min(5, Math.max(1, finalRating.toFixed(1)));
        },
        
        // Check if borrower can join more groups
        checkGroupEligibility(borrower) {
            const currentGroups = borrower.groups?.length || 0;
            const rating = this.calculateRating(borrower);
            
            return canJoinMoreGroups(currentGroups, rating);
        },
        
        // Update borrower rating after loan completion
        updateRating(borrowerId, loanRating) {
            // This would typically call an API
            console.log(`Updating rating for borrower ${borrowerId}: ${loanRating}`);
            
            // Store in localStorage for demo
            const ratings = JSON.parse(localStorage.getItem('mpesewa_ratings') || '{}');
            ratings[borrowerId] = ratings[borrowerId] || [];
            ratings[borrowerId].push({
                rating: loanRating,
                timestamp: Date.now()
            });
            
            localStorage.setItem('mpesewa_ratings', JSON.stringify(ratings));
            
            return this.calculateRating({ loanHistory: ratings[borrowerId] });
        },
        
        // Get rating badge
        getRatingBadge(rating) {
            if (rating >= 4.5) return { class: 'rating-excellent', label: 'Excellent' };
            if (rating >= 4.0) return { class: 'rating-good', label: 'Good' };
            if (rating >= 3.0) return { class: 'rating-fair', label: 'Fair' };
            if (rating >= 2.0) return { class: 'rating-poor', label: 'Poor' };
            return { class: 'rating-bad', label: 'Bad' };
        }
    };
    
    window.MPESEWA_REPUTATION = reputationService;
    console.log('⭐ REPUTATION SERVICE INITIALIZED');
}

/**
 * Initialize blacklist service
 */
function initializeBlacklistService() {
    const blacklistService = {
        // Check if user is blacklisted
        isBlacklisted(userId) {
            const blacklist = JSON.parse(localStorage.getItem('mpesewa_blacklist') || '[]');
            return blacklist.some(entry => entry.userId === userId && entry.active);
        },
        
        // Add user to blacklist
        addToBlacklist(userId, reason, amount, lenderId) {
            const entry = {
                userId,
                reason,
                amount,
                lenderId,
                dateAdded: new Date().toISOString(),
                active: true,
                id: `bl_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
            };
            
            const blacklist = JSON.parse(localStorage.getItem('mpesewa_blacklist') || '[]');
            blacklist.push(entry);
            localStorage.setItem('mpesewa_blacklist', JSON.stringify(blacklist));
            
            this.notifyBlacklistAddition(entry);
            return entry;
        },
        
        // Remove from blacklist
        removeFromBlacklist(userId, adminId) {
            const blacklist = JSON.parse(localStorage.getItem('mpesewa_blacklist') || '[]');
            const index = blacklist.findIndex(entry => entry.userId === userId && entry.active);
            
            if (index !== -1) {
                blacklist[index].active = false;
                blacklist[index].removedBy = adminId;
                blacklist[index].dateRemoved = new Date().toISOString();
                
                localStorage.setItem('mpesewa_blacklist', JSON.stringify(blacklist));
                this.notifyBlacklistRemoval(blacklist[index]);
                
                return true;
            }
            
            return false;
        },
        
        // Get blacklist entries
        getBlacklist(filters = {}) {
            let blacklist = JSON.parse(localStorage.getItem('mpesewa_blacklist') || '[]');
            
            // Apply filters
            if (filters.active !== undefined) {
                blacklist = blacklist.filter(entry => entry.active === filters.active);
            }
            
            if (filters.country) {
                // Filter by country (would require user data)
            }
            
            if (filters.search) {
                const searchTerm = filters.search.toLowerCase();
                blacklist = blacklist.filter(entry => 
                    entry.reason.toLowerCase().includes(searchTerm) ||
                    entry.userId.toLowerCase().includes(searchTerm)
                );
            }
            
            return blacklist;
        },
        
        // Check if user can be blacklisted
        canBlacklist(borrowerId, loan) {
            // Check if loan is in default (2+ months)
            const today = new Date();
            const dueDate = new Date(loan.dueDate);
            const daysOverdue = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));
            
            return daysOverdue >= LOAN_RULES.DEFAULT_AFTER_DAYS;
        },
        
        // Notify about blacklist addition
        notifyBlacklistAddition(entry) {
            console.log(`🚨 User ${entry.userId} added to blacklist: ${entry.reason}`);
            
            // Show notification
            if (window.MPESEWA && window.MPESEWA.showNotification) {
                window.MPESEWA.showNotification(
                    `User blacklisted: ${entry.reason}`,
                    'error'
                );
            }
        },
        
        // Notify about blacklist removal
        notifyBlacklistRemoval(entry) {
            console.log(`✅ User ${entry.userId} removed from blacklist`);
        }
    };
    
    window.MPESEWA_BLACKLIST = blacklistService;
    console.log('🚫 BLACKLIST SERVICE INITIALIZED');
}

/**
 * Initialize debt collector service
 */
function initializeDebtCollectorService() {
    const debtCollectorService = {
        // Get debt collectors (simulated data)
        getCollectors(filters = {}) {
            const collectors = [
                { id: 1, name: 'Alpha Recovery', phone: '+254700111222', email: 'alpha@recovery.co.ke', location: 'Nairobi, Kenya', country: 'KE', rating: 4.5 },
                { id: 2, name: 'Beta Collections', phone: '+256700333444', email: 'beta@collections.ug', location: 'Kampala, Uganda', country: 'UG', rating: 4.2 },
                { id: 3, name: 'Gamma Debt Solutions', phone: '+255700555666', email: 'gamma@debts.tz', location: 'Dar es Salaam, Tanzania', country: 'TZ', rating: 4.0 },
                { id: 4, name: 'Delta Recovery Agency', phone: '+250700777888', email: 'delta@recovery.rw', location: 'Kigali, Rwanda', country: 'RW', rating: 4.7 },
                { id: 5, name: 'Epsilon Collections', phone: '+234800111222', email: 'epsilon@collections.ng', location: 'Lagos, Nigeria', country: 'NG', rating: 4.3 },
                { id: 6, name: 'Zeta Debt Management', phone: '+233240000000', email: 'zeta@debt.gh', location: 'Accra, Ghana', country: 'GH', rating: 4.1 },
                { id: 7, name: 'Eta Recovery Services', phone: '+27721110000', email: 'eta@recovery.za', location: 'Johannesburg, South Africa', country: 'ZA', rating: 4.6 },
                { id: 8, name: 'Theta Collections', phone: '+251911000000', email: 'theta@collections.et', location: 'Addis Ababa, Ethiopia', country: 'ET', rating: 4.4 },
                { id: 9, name: 'Iota Debt Recovery', phone: '+25779000000', email: 'iota@recovery.bi', location: 'Bujumbura, Burundi', country: 'BI', rating: 4.0 },
                { id: 10, name: 'Kappa Collections', phone: '+211955000000', email: 'kappa@collections.ss', location: 'Juba, South Sudan', country: 'SS', rating: 3.8 }
            ];
            
            // Apply filters
            let filtered = [...collectors];
            
            if (filters.country) {
                filtered = filtered.filter(c => c.country === filters.country);
            }
            
            if (filters.search) {
                const searchTerm = filters.search.toLowerCase();
                filtered = filtered.filter(c => 
                    c.name.toLowerCase().includes(searchTerm) ||
                    c.location.toLowerCase().includes(searchTerm)
                );
            }
            
            if (filters.minRating) {
                filtered = filtered.filter(c => c.rating >= filters.minRating);
            }
            
            return filtered;
        },
        
        // Contact debt collector
        contactCollector(collectorId, loanDetails) {
            console.log(`Contacting debt collector ${collectorId} for loan:`, loanDetails);
            
            // In a real app, this would send an email or notification
            return {
                success: true,
                collectorId,
                timestamp: Date.now(),
                message: 'Debt collector has been notified'
            };
        },
        
        // Get collector by ID
        getCollectorById(id) {
            const collectors = this.getCollectors();
            return collectors.find(c => c.id === id);
        }
    };
    
    window.MPESEWA_COLLECTORS = debtCollectorService;
    console.log('📞 DEBT COLLECTOR SERVICE INITIALIZED');
}

/**
 * Initialize group service
 */
function initializeGroupService() {
    const groupService = {
        // Create new group
        createGroup(data) {
            const group = {
                id: `group_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                name: data.name,
                country: data.country,
                type: data.type || 'social',
                adminId: data.adminId,
                members: [],
                lenders: [],
                borrowers: [],
                createdAt: new Date().toISOString(),
                status: 'active',
                settings: {
                    maxMembers: LOAN_RULES.MAX_GROUP_MEMBERS,
                    minMembers: LOAN_RULES.MIN_GROUP_MEMBERS,
                    invitationOnly: true
                }
            };
            
            // Add admin as first member
            group.members.push({
                userId: data.adminId,
                role: 'admin',
                joinedAt: new Date().toISOString()
            });
            
            // Store in localStorage
            const groups = JSON.parse(localStorage.getItem('mpesewa_groups') || '[]');
            groups.push(group);
            localStorage.setItem('mpesewa_groups', JSON.stringify(groups));
            
            console.log(`Group created: ${group.name} (${group.id})`);
            return group;
        },
        
        // Join group
        joinGroup(groupId, userId, role = 'member') {
            const groups = JSON.parse(localStorage.getItem('mpesewa_groups') || '[]');
            const group = groups.find(g => g.id === groupId);
            
            if (!group) {
                throw new Error('Group not found');
            }
            
            // Check if group is full
            if (group.members.length >= group.settings.maxMembers) {
                throw new Error('Group is full');
            }
            
            // Check if user is already a member
            if (group.members.some(m => m.userId === userId)) {
                throw new Error('User is already a member');
            }
            
            // Add user to group
            group.members.push({
                userId,
                role,
                joinedAt: new Date().toISOString()
            });
            
            // Update role-specific arrays
            if (role === 'lender') {
                group.lenders.push(userId);
            } else if (role === 'borrower') {
                group.borrowers.push(userId);
            }
            
            localStorage.setItem('mpesewa_groups', JSON.stringify(groups));
            
            console.log(`User ${userId} joined group ${group.name} as ${role}`);
            return group;
        },
        
        // Get groups for user
        getUserGroups(userId) {
            const groups = JSON.parse(localStorage.getItem('mpesewa_groups') || '[]');
            return groups.filter(group => 
                group.members.some(m => m.userId === userId)
            );
        },
        
        // Get group by ID
        getGroupById(id) {
            const groups = JSON.parse(localStorage.getItem('mpesewa_groups') || '[]');
            return groups.find(g => g.id === id);
        },
        
        // Get groups by country
        getGroupsByCountry(countryCode) {
            const groups = JSON.parse(localStorage.getItem('mpesewa_groups') || '[]');
            return groups.filter(g => g.country === countryCode && g.status === 'active');
        },
        
        // Check if user can join more groups
        canJoinMoreGroups(userId) {
            const userGroups = this.getUserGroups(userId);
            
            // Check blacklist status
            if (window.MPESEWA_BLACKLIST && window.MPESEWA_BLACKLIST.isBlacklisted(userId)) {
                return false;
            }
            
            // Check group limit
            return userGroups.length < LOAN_RULES.MAX_GROUPS_PER_BORROWER;
        }
    };
    
    window.MPESEWA_GROUPS = groupService;
    console.log('👥 GROUP SERVICE INITIALIZED');
}

/**
 * Load user session from storage
 */
function loadUserSession() {
    const session = localStorage.getItem('mpesewa_session');
    
    if (session) {
        try {
            const userData = JSON.parse(session);
            
            // Validate session
            if (userData.expires && new Date(userData.expires) > new Date()) {
                // Restore user session
                window.MPESEWA_STATE.user = userData.user;
                setRole(userData.user.role);
                
                // Check subscription status for lenders
                if (userData.user.role === ROLE_STATES.LENDER) {
                    const subscriptionStatus = window.MPESEWA_SUBSCRIPTION.checkStatus(userData.user);
                    setSubscriptionState(subscriptionStatus);
                }
                
                console.log(`👤 Session restored for: ${userData.user.email || userData.user.username}`);
            } else {
                // Session expired
                localStorage.removeItem('mpesewa_session');
                console.log('Session expired');
            }
        } catch (error) {
            console.warn('Failed to restore session:', error);
            localStorage.removeItem('mpesewa_session');
        }
    }
}

/**
 * Set up navigation guards
 */
function setupNavigationGuards() {
    console.log('🛡️ SETTING UP NAVIGATION GUARDS');
    
    // Country guard - ensure country is selected
    addNavigationGuard((to, from) => {
        // Skip country check for country selection page
        if (to.path.includes('countries') || to.path.includes('country-select')) {
            return true;
        }
        
        // Check if country is selected
        const country = window.MPESEWA_STATE?.country || localStorage.getItem('mpesewa_country');
        
        if (!country && to.path !== '/') {
            console.log('Country not selected, redirecting to country selection');
            sessionStorage.setItem('redirectAfterCountry', to.path);
            window.location.href = 'pages/countries.html';
            return false;
        }
        
        return true;
    });
    
    // Authentication guard
    addNavigationGuard((to, from) => {
        const protectedPaths = ['dashboard', 'borrow', 'lend', 'profile', 'groups'];
        const isProtected = protectedPaths.some(path => to.path.includes(path));
        
        if (isProtected && !window.MPESEWA_STATE?.user) {
            console.log('Authentication required, redirecting to login');
            sessionStorage.setItem('redirectAfterLogin', to.path);
            window.location.href = 'auth/login.html';
            return false;
        }
        
        return true;
    });
    
    // Role-based guard
    addNavigationGuard((to, from) => {
        const user = window.MPESEWA_STATE?.user;
        if (!user) return true;
        
        // Lender-only paths
        if (to.path.includes('lender') && user.role !== ROLE_STATES.LENDER) {
            console.log('Lender access required');
            window.location.href = 'access-denied.html';
            return false;
        }
        
        // Borrower-only paths
        if (to.path.includes('borrower') && user.role !== ROLE_STATES.BORROWER) {
            console.log('Borrower access required');
            window.location.href = 'access-denied.html';
            return false;
        }
        
        return true;
    });
    
    // Subscription guard for lenders
    addNavigationGuard((to, from) => {
        const user = window.MPESEWA_STATE?.user;
        
        if (user && user.role === ROLE_STATES.LENDER && to.path.includes('lend')) {
            const canLend = window.MPESEWA_SUBSCRIPTION.canLend(user);
            
            if (!canLend) {
                console.log('Subscription required for lending');
                window.location.href = 'subscription/expired.html';
                return false;
            }
        }
        
        return true;
    });
    
    console.log('✅ NAVIGATION GUARDS SET UP');
}

/**
 * Set up event listeners
 */
function setupEventListeners() {
    // Online/offline detection
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Visibility change
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Before unload
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Page show/hide
    window.addEventListener('pageshow', handlePageShow);
    window.addEventListener('pagehide', handlePageHide);
    
    console.log('👂 EVENT LISTENERS SET UP');
}

/**
 * Start performance monitoring
 */
function startPerformanceMonitoring() {
    // Monitor page load performance
    if (window.performance && window.performance.timing) {
        const perf = window.performance.timing;
        const pageLoadTime = perf.loadEventEnd - perf.navigationStart;
        
        logMetric('page_load', {
            loadTime: pageLoadTime,
            timestamp: Date.now()
        });
        
        performanceMetrics.pageLoads++;
    }
    
    // Monitor API performance
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        const start = Date.now();
        performanceMetrics.apiCalls++;
        
        return originalFetch.apply(this, args).then(response => {
            const duration = Date.now() - start;
            
            logMetric('api_call', {
                url: args[0],
                duration: duration,
                status: response.status,
                timestamp: Date.now()
            });
            
            return response;
        });
    };
    
    console.log('📊 PERFORMANCE MONITORING STARTED');
}

/**
 * Mount the application
 */
function mountApplication() {
    console.log('🚀 MOUNTING APPLICATION');
    
    // Initialize router if exists
    if (window.MPESEWA_ROUTER) {
        window.MPESEWA_ROUTER.init();
    }
    
    // Update UI based on state
    updateUIForState();
    
    // Show welcome message for new users
    if (!localStorage.getItem('mpesewa_welcome_shown')) {
        setTimeout(() => {
            if (window.MPESEWA && window.MPESEWA.showNotification) {
                window.MPESEWA.showNotification(
                    'Welcome to M-Pesewa! Choose your country to get started.',
                    'info'
                );
            }
            localStorage.setItem('mpesewa_welcome_shown', 'true');
        }, 2000);
    }
}

/**
 * Start background tasks
 */
function startBackgroundTasks() {
    console.log('🔄 STARTING BACKGROUND TASKS');
    
    // Sync data periodically
    setInterval(syncData, 5 * 60 * 1000); // Every 5 minutes
    
    // Check for updates
    setInterval(checkForUpdates, 30 * 60 * 1000); // Every 30 minutes
    
    // Clean up old data
    setInterval(cleanupOldData, 24 * 60 * 60 * 1000); // Daily
    
    // Monitor subscription expiry
    setInterval(checkSubscriptionExpiry, 60 * 60 * 1000); // Hourly
}

/**
 * Set application state
 * @param {string} newState - New state from LIFECYCLE_STATES
 */
function setState(newState) {
    if (currentState === newState) return;
    
    const oldState = currentState;
    currentState = newState;
    
    console.log(`🔄 STATE CHANGE: ${oldState} → ${newState}`);
    
    // Notify listeners
    stateChangeListeners.forEach(listener => {
        try {
            listener(newState, oldState);
        } catch (error) {
            console.error('State change listener error:', error);
        }
    });
    
    // Log state change
    logMetric('state_change', {
        from: oldState,
        to: newState,
        timestamp: Date.now()
    });
}

/**
 * Set user role
 * @param {string} newRole - New role from ROLE_STATES
 */
function setRole(newRole) {
    if (currentRole === newRole) return;
    
    const oldRole = currentRole;
    currentRole = newRole;
    
    console.log(`👤 ROLE CHANGE: ${oldRole} → ${newRole}`);
    
    // Notify listeners
    roleChangeListeners.forEach(listener => {
        try {
            listener(newRole, oldRole);
        } catch (error) {
            console.error('Role change listener error:', error);
        }
    });
    
    // Update UI based on role
    updateUIForRole(newRole);
}

/**
 * Set subscription state
 * @param {string} newState - New subscription state
 */
function setSubscriptionState(newState) {
    if (currentSubscription === newState) return;
    
    const oldState = currentSubscription;
    currentSubscription = newState;
    
    console.log(`💰 SUBSCRIPTION CHANGE: ${oldState} → ${newState}`);
    
    // Notify listeners
    subscriptionChangeListeners.forEach(listener => {
        try {
            listener(newState, oldState);
        } catch (error) {
            console.error('Subscription change listener error:', error);
        }
    });
    
    // Handle subscription state changes
    if (newState === SUBSCRIPTION_STATES.EXPIRED) {
        handleSubscriptionExpired();
    }
}

// ... (Additional functions for handleOnline, handleOffline, handleVisibilityChange, etc.)

// Export public API
export {
    LIFECYCLE_STATES,
    ROLE_STATES,
    SUBSCRIPTION_STATES,
    setState,
    setRole,
    setSubscriptionState,
    addNavigationGuard,
    addLifecycleHook,
    logMetric,
    getPerformanceMetrics
};