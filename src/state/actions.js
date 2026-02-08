/**
 * M-PESEWA STATE ACTIONS
 * Action creators and business logic for state mutations
 * Enforces strict hierarchy and business rules
 */

/**
 * ACTION TYPES
 */
export const ActionTypes = {
    // Auth Actions
    LOGIN_REQUEST: 'AUTH/LOGIN_REQUEST',
    LOGIN_SUCCESS: 'AUTH/LOGIN_SUCCESS',
    LOGIN_FAILURE: 'AUTH/LOGIN_FAILURE',
    LOGOUT: 'AUTH/LOGOUT',
    REGISTER_REQUEST: 'AUTH/REGISTER_REQUEST',
    REGISTER_SUCCESS: 'AUTH/REGISTER_SUCCESS',
    REGISTER_FAILURE: 'AUTH/REGISTER_FAILURE',
    VERIFY_EMAIL: 'AUTH/VERIFY_EMAIL',
    FORGOT_PASSWORD: 'AUTH/FORGOT_PASSWORD',
    RESET_PASSWORD: 'AUTH/RESET_PASSWORD',
    UPDATE_SESSION: 'AUTH/UPDATE_SESSION',
    
    // User Actions
    UPDATE_PROFILE: 'USER/UPDATE_PROFILE',
    UPDATE_PREFERENCES: 'USER/UPDATE_PREFERENCES',
    UPLOAD_DOCUMENT: 'USER/UPLOAD_DOCUMENT',
    VERIFY_IDENTITY: 'USER/VERIFY_IDENTITY',
    DELETE_ACCOUNT: 'USER/DELETE_ACCOUNT',
    
    // Role Actions
    SWITCH_ROLE: 'ROLE/SWITCH_ROLE',
    SET_ROLE: 'ROLE/SET_ROLE',
    UPDATE_ROLE_PERMISSIONS: 'ROLE/UPDATE_PERMISSIONS',
    
    // Country Actions
    SET_COUNTRY: 'COUNTRY/SET',
    UPDATE_COUNTRY_RULES: 'COUNTRY/UPDATE_RULES',
    LOCK_COUNTRY: 'COUNTRY/LOCK',
    UNLOCK_COUNTRY: 'COUNTRY/UNLOCK',
    
    // Group Actions
    CREATE_GROUP: 'GROUP/CREATE',
    JOIN_GROUP: 'GROUP/JOIN',
    LEAVE_GROUP: 'GROUP/LEAVE',
    INVITE_TO_GROUP: 'GROUP/INVITE',
    ACCEPT_INVITATION: 'GROUP/ACCEPT_INVITATION',
    DECLINE_INVITATION: 'GROUP/DECLINE_INVITATION',
    UPDATE_GROUP_SETTINGS: 'GROUP/UPDATE_SETTINGS',
    REMOVE_MEMBER: 'GROUP/REMOVE_MEMBER',
    DISBAND_GROUP: 'GROUP/DISBAND',
    
    // Lender Actions
    ACTIVATE_LENDER: 'LENDER/ACTIVATE',
    DEACTIVATE_LENDER: 'LENDER/DEACTIVATE',
    UPDATE_LENDING_CATEGORIES: 'LENDER/UPDATE_CATEGORIES',
    UPDATE_LENDING_LIMITS: 'LENDER/UPDATE_LIMITS',
    BLOCK_LENDER: 'LENDER/BLOCK',
    UNBLOCK_LENDER: 'LENDER/UNBLOCK',
    
    // Borrower Actions
    ACTIVATE_BORROWER: 'BORROWER/ACTIVATE',
    DEACTIVATE_BORROWER: 'BORROWER/DEACTIVATE',
    UPDATE_BORROWING_LIMITS: 'BORROWER/UPDATE_LIMITS',
    APPLY_FOR_LOAN: 'BORROWER/APPLY_FOR_LOAN',
    CANCEL_LOAN_APPLICATION: 'BORROWER/CANCEL_APPLICATION',
    
    // Ledger Actions (Core)
    CREATE_LEDGER: 'LEDGER/CREATE',
    UPDATE_LEDGER: 'LEDGER/UPDATE',
    DELETE_LEDGER: 'LEDGER/DELETE',
    ADD_REPAYMENT: 'LEDGER/ADD_REPAYMENT',
    MARK_AS_OVERDUE: 'LEDGER/MARK_OVERDUE',
    MARK_AS_DEFAULTED: 'LEDGER/MARK_DEFAULTED',
    MARK_AS_CLEARED: 'LEDGER/MARK_CLEARED',
    RATE_BORROWER: 'LEDGER/RATE_BORROWER',
    RATE_LENDER: 'LEDGER/RATE_LENDER',
    FREEZE_LEDGER: 'LEDGER/FREEZE',
    UNFREEZE_LEDGER: 'LEDGER/UNFREEZE',
    
    // Subscription Actions
    SUBSCRIBE: 'SUBSCRIPTION/SUBSCRIBE',
    UPGRADE_SUBSCRIPTION: 'SUBSCRIPTION/UPGRADE',
    DOWNGRADE_SUBSCRIPTION: 'SUBSCRIPTION/DOWNGRADE',
    CANCEL_SUBSCRIPTION: 'SUBSCRIPTION/CANCEL',
    RENEW_SUBSCRIPTION: 'SUBSCRIPTION/RENEW',
    MAKE_PAYMENT: 'SUBSCRIPTION/MAKE_PAYMENT',
    GENERATE_INVOICE: 'SUBSCRIPTION/GENERATE_INVOICE',
    
    // Blacklist Actions
    ADD_TO_BLACKLIST: 'BLACKLIST/ADD',
    REMOVE_FROM_BLACKLIST: 'BLACKLIST/REMOVE',
    APPEAL_BLACKLIST: 'BLACKLIST/APPEAL',
    UPDATE_BLACKLIST_REASON: 'BLACKLIST/UPDATE_REASON',
    OVERRIDE_BLACKLIST: 'BLACKLIST/OVERRIDE',
    
    // UI Actions
    SET_THEME: 'UI/SET_THEME',
    SET_LANGUAGE: 'UI/SET_LANGUAGE',
    TOGGLE_SIDEBAR: 'UI/TOGGLE_SIDEBAR',
    TOGGLE_NOTIFICATIONS_PANEL: 'UI/TOGGLE_NOTIFICATIONS_PANEL',
    TOGGLE_MOBILE_MENU: 'UI/TOGGLE_MOBILE_MENU',
    SET_CURRENT_PAGE: 'UI/SET_CURRENT_PAGE',
    SHOW_LOADING: 'UI/SHOW_LOADING',
    HIDE_LOADING: 'UI/HIDE_LOADING',
    SET_ERROR: 'UI/SET_ERROR',
    CLEAR_ERROR: 'UI/CLEAR_ERROR',
    SET_SUCCESS: 'UI/SET_SUCCESS',
    CLEAR_SUCCESS: 'UI/CLEAR_SUCCESS',
    OPEN_MODAL: 'UI/OPEN_MODAL',
    CLOSE_MODAL: 'UI/CLOSE_MODAL',
    
    // PWA Actions
    SET_PWA_INSTALLED: 'PWA/SET_INSTALLED',
    SET_ONLINE_STATUS: 'PWA/SET_ONLINE_STATUS',
    SET_UPDATE_AVAILABLE: 'PWA/SET_UPDATE_AVAILABLE',
    SET_DEFERRED_PROMPT: 'PWA/SET_DEFERRED_PROMPT',
    SET_REGISTRATION: 'PWA/SET_REGISTRATION',
    ADD_TO_OFFLINE_QUEUE: 'PWA/ADD_TO_OFFLINE_QUEUE',
    CLEAR_OFFLINE_QUEUE: 'PWA/CLEAR_OFFLINE_QUEUE',
    SET_SYNC_STATUS: 'PWA/SET_SYNC_STATUS',
    
    // Sync Actions
    START_SYNC: 'SYNC/START',
    COMPLETE_SYNC: 'SYNC/COMPLETE',
    FAIL_SYNC: 'SYNC/FAIL',
    ADD_PENDING_CHANGE: 'SYNC/ADD_PENDING_CHANGE',
    REMOVE_PENDING_CHANGE: 'SYNC/REMOVE_PENDING_CHANGE',
    ADD_OFFLINE_CHANGE: 'SYNC/ADD_OFFLINE_CHANGE',
    REMOVE_OFFLINE_CHANGE: 'SYNC/REMOVE_OFFLINE_CHANGE',
    SET_CONFLICT_RESOLUTION: 'SYNC/SET_CONFLICT_RESOLUTION',
    INCREMENT_RETRY_COUNT: 'SYNC/INCREMENT_RETRY_COUNT',
    RESET_RETRY_COUNT: 'SYNC/RESET_RETRY_COUNT',
    
    // Navigation Actions
    NAVIGATE: 'NAVIGATION/NAVIGATE',
    GO_BACK: 'NAVIGATION/GO_BACK',
    GO_FORWARD: 'NAVIGATION/GO_FORWARD',
    UPDATE_BREADCRUMBS: 'NAVIGATION/UPDATE_BREADCRUMBS',
    SET_GUARDS: 'NAVIGATION/SET_GUARDS',
    CLEAR_GUARDS: 'NAVIGATION/CLEAR_GUARDS',
    
    // Notification Actions
    ADD_NOTIFICATION: 'NOTIFICATION/ADD',
    MARK_AS_READ: 'NOTIFICATION/MARK_AS_READ',
    MARK_ALL_AS_READ: 'NOTIFICATION/MARK_ALL_AS_READ',
    REMOVE_NOTIFICATION: 'NOTIFICATION/REMOVE',
    CLEAR_ALL_NOTIFICATIONS: 'NOTIFICATION/CLEAR_ALL',
    UPDATE_SETTINGS: 'NOTIFICATION/UPDATE_SETTINGS',
    
    // Audit Actions
    ADD_AUDIT_LOG: 'AUDIT/ADD_LOG',
    CLEAR_AUDIT_LOGS: 'AUDIT/CLEAR_LOGS',
    SET_AUDIT_ENABLED: 'AUDIT/SET_ENABLED',
    EXPORT_AUDIT_LOGS: 'AUDIT/EXPORT_LOGS',
    
    // Meta Actions
    UPDATE_VERSION: 'META/UPDATE_VERSION',
    UPDATE_LAST_UPDATED: 'META/UPDATE_LAST_UPDATED',
    SET_DEVICE_ID: 'META/SET_DEVICE_ID',
    SET_SESSION_ID: 'META/SET_SESSION_ID',
    
    // Batch Actions
    BATCH_UPDATE: 'BATCH/UPDATE',
    UNDO_ACTION: 'BATCH/UNDO',
    REDO_ACTION: 'BATCH/REDO',
    
    // System Actions
    RESET_STATE: 'SYSTEM/RESET_STATE',
    IMPORT_STATE: 'SYSTEM/IMPORT_STATE',
    EXPORT_STATE: 'SYSTEM/EXPORT_STATE',
    CLEAR_STORAGE: 'SYSTEM/CLEAR_STORAGE'
};

/**
 * ACTION CREATORS
 */

// ==================== AUTHENTICATION ACTIONS ====================

export const loginRequest = (credentials) => ({
    type: ActionTypes.LOGIN_REQUEST,
    payload: credentials
});

export const loginSuccess = (userData) => ({
    type: ActionTypes.LOGIN_SUCCESS,
    payload: userData
});

export const loginFailure = (error) => ({
    type: ActionTypes.LOGIN_FAILURE,
    payload: error,
    error: true
});

export const logout = () => ({
    type: ActionTypes.LOGOUT
});

export const registerRequest = (userData) => ({
    type: ActionTypes.REGISTER_REQUEST,
    payload: userData
});

export const registerSuccess = (userData) => ({
    type: ActionTypes.REGISTER_SUCCESS,
    payload: userData
});

export const registerFailure = (error) => ({
    type: ActionTypes.REGISTER_FAILURE,
    payload: error,
    error: true
});

export const verifyEmail = (token) => ({
    type: ActionTypes.VERIFY_EMAIL,
    payload: { token }
});

export const forgotPassword = (email) => ({
    type: ActionTypes.FORGOT_PASSWORD,
    payload: { email }
});

export const resetPassword = (token, newPassword) => ({
    type: ActionTypes.RESET_PASSWORD,
    payload: { token, newPassword }
});

export const updateSession = () => ({
    type: ActionTypes.UPDATE_SESSION
});

// ==================== USER ACTIONS ====================

export const updateProfile = (profileData) => ({
    type: ActionTypes.UPDATE_PROFILE,
    payload: profileData
});

export const updatePreferences = (preferences) => ({
    type: ActionTypes.UPDATE_PREFERENCES,
    payload: preferences
});

export const uploadDocument = (documentType, file) => ({
    type: ActionTypes.UPLOAD_DOCUMENT,
    payload: { documentType, file }
});

export const verifyIdentity = (verificationData) => ({
    type: ActionTypes.VERIFY_IDENTITY,
    payload: verificationData
});

export const deleteAccount = (reason) => ({
    type: ActionTypes.DELETE_ACCOUNT,
    payload: { reason }
});

// ==================== ROLE ACTIONS ====================

export const switchRole = (newRole) => ({
    type: ActionTypes.SWITCH_ROLE,
    payload: { newRole }
});

export const setRole = (role) => ({
    type: ActionTypes.SET_ROLE,
    payload: { role }
});

export const updateRolePermissions = (permissions) => ({
    type: ActionTypes.UPDATE_ROLE_PERMISSIONS,
    payload: permissions
});

// ==================== COUNTRY ACTIONS ====================

export const setCountry = (countryCode) => ({
    type: ActionTypes.SET_COUNTRY,
    payload: { countryCode }
});

export const updateCountryRules = (rules) => ({
    type: ActionTypes.UPDATE_COUNTRY_RULES,
    payload: rules
});

export const lockCountry = () => ({
    type: ActionTypes.LOCK_COUNTRY
});

export const unlockCountry = () => ({
    type: ActionTypes.UNLOCK_COUNTRY
});

// ==================== GROUP ACTIONS ====================

export const createGroup = (groupData) => ({
    type: ActionTypes.CREATE_GROUP,
    payload: groupData
});

export const joinGroup = (groupId) => ({
    type: ActionTypes.JOIN_GROUP,
    payload: { groupId }
});

export const leaveGroup = (groupId) => ({
    type: ActionTypes.LEAVE_GROUP,
    payload: { groupId }
});

export const inviteToGroup = (groupId, inviteeData) => ({
    type: ActionTypes.INVITE_TO_GROUP,
    payload: { groupId, ...inviteeData }
});

export const acceptInvitation = (invitationId) => ({
    type: ActionTypes.ACCEPT_INVITATION,
    payload: { invitationId }
});

export const declineInvitation = (invitationId) => ({
    type: ActionTypes.DECLINE_INVITATION,
    payload: { invitationId }
});

export const updateGroupSettings = (groupId, settings) => ({
    type: ActionTypes.UPDATE_GROUP_SETTINGS,
    payload: { groupId, settings }
});

export const removeMember = (groupId, memberId) => ({
    type: ActionTypes.REMOVE_MEMBER,
    payload: { groupId, memberId }
});

export const disbandGroup = (groupId) => ({
    type: ActionTypes.DISBAND_GROUP,
    payload: { groupId }
});

// ==================== LENDER ACTIONS ====================

export const activateLender = (subscriptionData) => ({
    type: ActionTypes.ACTIVATE_LENDER,
    payload: subscriptionData
});

export const deactivateLender = () => ({
    type: ActionTypes.DEACTIVATE_LENDER
});

export const updateLendingCategories = (categories) => ({
    type: ActionTypes.UPDATE_LENDING_CATEGORIES,
    payload: { categories }
});

export const updateLendingLimits = (limits) => ({
    type: ActionTypes.UPDATE_LENDING_LIMITS,
    payload: { limits }
});

export const blockLender = (reason, until) => ({
    type: ActionTypes.BLOCK_LENDER,
    payload: { reason, until }
});

export const unblockLender = () => ({
    type: ActionTypes.UNBLOCK_LENDER
});

// ==================== BORROWER ACTIONS ====================

export const activateBorrower = () => ({
    type: ActionTypes.ACTIVATE_BORROWER
});

export const deactivateBorrower = () => ({
    type: ActionTypes.DEACTIVATE_BORROWER
});

export const updateBorrowingLimits = (limits) => ({
    type: ActionTypes.UPDATE_BORROWING_LIMITS,
    payload: { limits }
});

export const applyForLoan = (loanApplication) => ({
    type: ActionTypes.APPLY_FOR_LOAN,
    payload: loanApplication
});

export const cancelLoanApplication = (applicationId) => ({
    type: ActionTypes.CANCEL_LOAN_APPLICATION,
    payload: { applicationId }
});

// ==================== LEDGER ACTIONS ====================

export const createLedger = (ledgerData) => ({
    type: ActionTypes.CREATE_LEDGER,
    payload: ledgerData
});

export const updateLedger = (ledgerId, updates) => ({
    type: ActionTypes.UPDATE_LEDGER,
    payload: { ledgerId, updates }
});

export const deleteLedger = (ledgerId) => ({
    type: ActionTypes.DELETE_LEDGER,
    payload: { ledgerId }
});

export const addRepayment = (ledgerId, repaymentData) => ({
    type: ActionTypes.ADD_REPAYMENT,
    payload: { ledgerId, ...repaymentData }
});

export const markAsOverdue = (ledgerId) => ({
    type: ActionTypes.MARK_AS_OVERDUE,
    payload: { ledgerId }
});

export const markAsDefaulted = (ledgerId) => ({
    type: ActionTypes.MARK_AS_DEFAULTED,
    payload: { ledgerId }
});

export const markAsCleared = (ledgerId) => ({
    type: ActionTypes.MARK_AS_CLEARED,
    payload: { ledgerId }
});

export const rateBorrower = (ledgerId, rating, feedback) => ({
    type: ActionTypes.RATE_BORROWER,
    payload: { ledgerId, rating, feedback }
});

export const rateLender = (ledgerId, rating, feedback) => ({
    type: ActionTypes.RATE_LENDER,
    payload: { ledgerId, rating, feedback }
});

export const freezeLedger = (ledgerId, reason) => ({
    type: ActionTypes.FREEZE_LEDGER,
    payload: { ledgerId, reason }
});

export const unfreezeLedger = (ledgerId) => ({
    type: ActionTypes.UNFREEZE_LEDGER,
    payload: { ledgerId }
});

// ==================== SUBSCRIPTION ACTIONS ====================

export const subscribe = (plan, duration, paymentData) => ({
    type: ActionTypes.SUBSCRIBE,
    payload: { plan, duration, ...paymentData }
});

export const upgradeSubscription = (newPlan) => ({
    type: ActionTypes.UPGRADE_SUBSCRIPTION,
    payload: { newPlan }
});

export const downgradeSubscription = (newPlan) => ({
    type: ActionTypes.DOWNGRADE_SUBSCRIPTION,
    payload: { newPlan }
});

export const cancelSubscription = (reason) => ({
    type: ActionTypes.CANCEL_SUBSCRIPTION,
    payload: { reason }
});

export const renewSubscription = () => ({
    type: ActionTypes.RENEW_SUBSCRIPTION
});

export const makePayment = (amount, method, reference) => ({
    type: ActionTypes.MAKE_PAYMENT,
    payload: { amount, method, reference }
});

export const generateInvoice = (period) => ({
    type: ActionTypes.GENERATE_INVOICE,
    payload: { period }
});

// ==================== BLACKLIST ACTIONS ====================

export const addToBlacklist = (borrowerId, reason, amountOwed) => ({
    type: ActionTypes.ADD_TO_BLACKLIST,
    payload: { borrowerId, reason, amountOwed }
});

export const removeFromBlacklist = (borrowerId) => ({
    type: ActionTypes.REMOVE_FROM_BLACKLIST,
    payload: { borrowerId }
});

export const appealBlacklist = (appealData) => ({
    type: ActionTypes.APPEAL_BLACKLIST,
    payload: appealData
});

export const updateBlacklistReason = (borrowerId, newReason) => ({
    type: ActionTypes.UPDATE_BLACKLIST_REASON,
    payload: { borrowerId, newReason }
});

export const overrideBlacklist = (borrowerId, overrideData) => ({
    type: ActionTypes.OVERRIDE_BLACKLIST,
    payload: { borrowerId, ...overrideData }
});

// ==================== UI ACTIONS ====================

export const setTheme = (theme) => ({
    type: ActionTypes.SET_THEME,
    payload: { theme }
});

export const setLanguage = (language) => ({
    type: ActionTypes.SET_LANGUAGE,
    payload: { language }
});

export const toggleSidebar = () => ({
    type: ActionTypes.TOGGLE_SIDEBAR
});

export const toggleNotificationsPanel = () => ({
    type: ActionTypes.TOGGLE_NOTIFICATIONS_PANEL
});

export const toggleMobileMenu = () => ({
    type: ActionTypes.TOGGLE_MOBILE_MENU
});

export const setCurrentPage = (page) => ({
    type: ActionTypes.SET_CURRENT_PAGE,
    payload: { page }
});

export const showLoading = (message) => ({
    type: ActionTypes.SHOW_LOADING,
    payload: { message }
});

export const hideLoading = () => ({
    type: ActionTypes.HIDE_LOADING
});

export const setError = (error) => ({
    type: ActionTypes.SET_ERROR,
    payload: { error }
});

export const clearError = () => ({
    type: ActionTypes.CLEAR_ERROR
});

export const setSuccess = (message) => ({
    type: ActionTypes.SET_SUCCESS,
    payload: { message }
});

export const clearSuccess = () => ({
    type: ActionTypes.CLEAR_SUCCESS
});

export const openModal = (modalName, modalData = {}) => ({
    type: ActionTypes.OPEN_MODAL,
    payload: { modalName, modalData }
});

export const closeModal = (modalName) => ({
    type: ActionTypes.CLOSE_MODAL,
    payload: { modalName }
});

// ==================== PWA ACTIONS ====================

export const setPWAInstalled = (installed) => ({
    type: ActionTypes.SET_PWA_INSTALLED,
    payload: { installed }
});

export const setOnlineStatus = (online) => ({
    type: ActionTypes.SET_ONLINE_STATUS,
    payload: { online }
});

export const setUpdateAvailable = (available) => ({
    type: ActionTypes.SET_UPDATE_AVAILABLE,
    payload: { available }
});

export const setDeferredPrompt = (prompt) => ({
    type: ActionTypes.SET_DEFERRED_PROMPT,
    payload: { prompt }
});

export const setRegistration = (registration) => ({
    type: ActionTypes.SET_REGISTRATION,
    payload: { registration }
});

export const addToOfflineQueue = (action) => ({
    type: ActionTypes.ADD_TO_OFFLINE_QUEUE,
    payload: { action }
});

export const clearOfflineQueue = () => ({
    type: ActionTypes.CLEAR_OFFLINE_QUEUE
});

export const setSyncStatus = (status) => ({
    type: ActionTypes.SET_SYNC_STATUS,
    payload: { status }
});

// ==================== SYNC ACTIONS ====================

export const startSync = () => ({
    type: ActionTypes.START_SYNC
});

export const completeSync = (data) => ({
    type: ActionTypes.COMPLETE_SYNC,
    payload: data
});

export const failSync = (error) => ({
    type: ActionTypes.FAIL_SYNC,
    payload: { error },
    error: true
});

export const addPendingChange = (change) => ({
    type: ActionTypes.ADD_PENDING_CHANGE,
    payload: change
});

export const removePendingChange = (changeId) => ({
    type: ActionTypes.REMOVE_PENDING_CHANGE,
    payload: { changeId }
});

export const addOfflineChange = (change) => ({
    type: ActionTypes.ADD_OFFLINE_CHANGE,
    payload: change
});

export const removeOfflineChange = (changeId) => ({
    type: ActionTypes.REMOVE_OFFLINE_CHANGE,
    payload: { changeId }
});

export const setConflictResolution = (strategy) => ({
    type: ActionTypes.SET_CONFLICT_RESOLUTION,
    payload: { strategy }
});

export const incrementRetryCount = () => ({
    type: ActionTypes.INCREMENT_RETRY_COUNT
});

export const resetRetryCount = () => ({
    type: ActionTypes.RESET_RETRY_COUNT
});

// ==================== NAVIGATION ACTIONS ====================

export const navigate = (path, state = {}) => ({
    type: ActionTypes.NAVIGATE,
    payload: { path, state }
});

export const goBack = () => ({
    type: ActionTypes.GO_BACK
});

export const goForward = () => ({
    type: ActionTypes.GO_FORWARD
});

export const updateBreadcrumbs = (breadcrumbs) => ({
    type: ActionTypes.UPDATE_BREADCRUMBS,
    payload: { breadcrumbs }
});

export const setGuards = (guards) => ({
    type: ActionTypes.SET_GUARDS,
    payload: { guards }
});

export const clearGuards = () => ({
    type: ActionTypes.CLEAR_GUARDS
});

// ==================== NOTIFICATION ACTIONS ====================

export const addNotification = (notification) => ({
    type: ActionTypes.ADD_NOTIFICATION,
    payload: notification
});

export const markAsRead = (notificationId) => ({
    type: ActionTypes.MARK_AS_READ,
    payload: { notificationId }
});

export const markAllAsRead = () => ({
    type: ActionTypes.MARK_ALL_AS_READ
});

export const removeNotification = (notificationId) => ({
    type: ActionTypes.REMOVE_NOTIFICATION,
    payload: { notificationId }
});

export const clearAllNotifications = () => ({
    type: ActionTypes.CLEAR_ALL_NOTIFICATIONS
});

export const updateNotificationSettings = (settings) => ({
    type: ActionTypes.UPDATE_SETTINGS,
    payload: { settings }
});

// ==================== AUDIT ACTIONS ====================

export const addAuditLog = (logData) => ({
    type: ActionTypes.ADD_AUDIT_LOG,
    payload: logData
});

export const clearAuditLogs = () => ({
    type: ActionTypes.CLEAR_AUDIT_LOGS
});

export const setAuditEnabled = (enabled) => ({
    type: ActionTypes.SET_AUDIT_ENABLED,
    payload: { enabled }
});

export const exportAuditLogs = (format = 'json') => ({
    type: ActionTypes.EXPORT_AUDIT_LOGS,
    payload: { format }
});

// ==================== META ACTIONS ====================

export const updateVersion = (version) => ({
    type: ActionTypes.UPDATE_VERSION,
    payload: { version }
});

export const updateLastUpdated = () => ({
    type: ActionTypes.UPDATE_LAST_UPDATED
});

export const setDeviceId = (deviceId) => ({
    type: ActionTypes.SET_DEVICE_ID,
    payload: { deviceId }
});

export const setSessionId = (sessionId) => ({
    type: ActionTypes.SET_SESSION_ID,
    payload: { sessionId }
});

// ==================== BATCH ACTIONS ====================

export const batchUpdate = (actions) => ({
    type: ActionTypes.BATCH_UPDATE,
    payload: { actions }
});

export const undoAction = () => ({
    type: ActionTypes.UNDO_ACTION
});

export const redoAction = () => ({
    type: ActionTypes.REDO_ACTION
});

// ==================== SYSTEM ACTIONS ====================

export const resetState = () => ({
    type: ActionTypes.RESET_STATE
});

export const importState = (stateData) => ({
    type: ActionTypes.IMPORT_STATE,
    payload: { stateData }
});

export const exportState = (format = 'json') => ({
    type: ActionTypes.EXPORT_STATE,
    payload: { format }
});

export const clearStorage = () => ({
    type: ActionTypes.CLEAR_STORAGE
});

/**
 * ACTION HANDLERS (Business Logic)
 */

class ActionHandlers {
    constructor(store) {
        this.store = store;
    }
    
    /**
     * HANDLE LOGIN
     */
    handleLogin(credentials) {
        return async (dispatch) => {
            dispatch(showLoading('Logging in...'));
            
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                const userData = {
                    id: 'user_' + Date.now(),
                    username: credentials.username,
                    email: credentials.username.includes('@') ? credentials.username : `${credentials.username}@mpesewa.com`,
                    phone: '+254700000000',
                    fullName: 'John Doe',
                    nationalId: '12345678',
                    location: 'Nairobi, Kenya',
                    isVerified: true,
                    verificationLevel: 2
                };
                
                const token = 'token_' + Date.now();
                
                dispatch(loginSuccess({ user: userData, token }));
                dispatch(hideLoading());
                dispatch(setSuccess('Login successful!'));
                
                // Set default country if not set
                const currentState = this.store.getState();
                if (!currentState.country.currentCountry) {
                    dispatch(setCountry('KE'));
                }
                
            } catch (error) {
                dispatch(loginFailure(error.message));
                dispatch(hideLoading());
                dispatch(setError('Login failed: ' + error.message));
            }
        };
    }
    
    /**
     * HANDLE REGISTRATION
     */
    handleRegister(userData) {
        return async (dispatch) => {
            dispatch(showLoading('Creating account...'));
            
            try {
                // Validate required fields
                const required = ['fullName', 'nationalId', 'phone', 'country', 'username', 'password'];
                const missing = required.filter(field => !userData[field]);
                
                if (missing.length > 0) {
                    throw new Error(`Missing required fields: ${missing.join(', ')}`);
                }
                
                // Validate password strength
                if (userData.password.length < 8) {
                    throw new Error('Password must be at least 8 characters');
                }
                
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                const newUser = {
                    id: 'user_' + Date.now(),
                    username: userData.username,
                    email: userData.email || `${userData.username}@mpesewa.com`,
                    phone: userData.phone,
                    fullName: userData.fullName,
                    nationalId: userData.nationalId,
                    location: userData.location || 'Unknown',
                    isVerified: false,
                    verificationLevel: 0,
                    createdAt: new Date().toISOString()
                };
                
                const token = 'token_' + Date.now();
                
                dispatch(registerSuccess({ user: newUser, token }));
                
                // Set country
                dispatch(setCountry(userData.country));
                
                // Set role based on registration type
                if (userData.registrationType === 'lender') {
                    dispatch(setRole('lender'));
                    dispatch(activateLender({
                        subscriptionLevel: 'basic',
                        subscriptionExpiry: this.calculateNextBillingDate()
                    }));
                } else {
                    dispatch(setRole('borrower'));
                    dispatch(activateBorrower());
                }
                
                dispatch(hideLoading());
                dispatch(setSuccess('Account created successfully!'));
                
            } catch (error) {
                dispatch(registerFailure(error.message));
                dispatch(hideLoading());
                dispatch(setError('Registration failed: ' + error.message));
            }
        };
    }
    
    /**
     * HANDLE SET COUNTRY (With strict isolation)
     */
    handleSetCountry(countryCode) {
        return (dispatch, getState) => {
            const state = getState();
            
            // Check if country is locked
            if (state.country.countryLock && state.country.currentCountry) {
                throw new Error('Country is locked. Contact admin to change.');
            }
            
            // Validate country code
            const validCountries = state.country.availableCountries.map(c => c.code);
            if (!validCountries.includes(countryCode)) {
                throw new Error(`Country ${countryCode} not supported`);
            }
            
            dispatch(setCountry(countryCode));
            dispatch(lockCountry());
            
            // Clear group data when country changes (strict isolation)
            if (state.group.currentGroup) {
                dispatch(leaveGroup(state.group.currentGroup));
            }
            
            // Load country-specific rules
            dispatch(this.handleLoadCountryRules(countryCode));
            
            dispatch(setSuccess(`Country set to ${countryCode}`));
        };
    }
    
    /**
     * HANDLE LOAD COUNTRY RULES
     */
    handleLoadCountryRules(countryCode) {
        return (dispatch) => {
            // This would typically fetch from API
            const rules = {
                KE: { interestCap: 10, maxLoanTerm: 7, regulations: 'Kenya Regulations' },
                UG: { interestCap: 12, maxLoanTerm: 7, regulations: 'Uganda Regulations' },
                TZ: { interestCap: 10, maxLoanTerm: 7, regulations: 'Tanzania Regulations' },
                RW: { interestCap: 10, maxLoanTerm: 7, regulations: 'Rwanda Regulations' },
                BI: { interestCap: 15, maxLoanTerm: 7, regulations: 'Burundi Regulations' },
                CD: { interestCap: 20, maxLoanTerm: 7, regulations: 'DRC Regulations' },
                NG: { interestCap: 10, maxLoanTerm: 7, regulations: 'Nigeria Regulations' },
                GH: { interestCap: 10, maxLoanTerm: 7, regulations: 'Ghana Regulations' },
                SS: { interestCap: 15, maxLoanTerm: 7, regulations: 'South Sudan Regulations' },
                SO: { interestCap: 15, maxLoanTerm: 7, regulations: 'Somalia Regulations' },
                ZA: { interestCap: 5, maxLoanTerm: 7, regulations: 'South Africa Regulations' },
                ET: { interestCap: 10, maxLoanTerm: 7, regulations: 'Ethiopia Regulations' }
            };
            
            dispatch(updateCountryRules(rules[countryCode] || {}));
        };
    }
    
    /**
     * HANDLE CREATE GROUP
     */
    handleCreateGroup(groupData) {
        return (dispatch, getState) => {
            const state = getState();
            
            // Validate country is set
            if (!state.country.currentCountry) {
                throw new Error('Select country first');
            }
            
            // Check if user can create more groups
            const userGroups = state.group.availableGroups.filter(g => 
                g.country === state.country.currentCountry
            );
            
            if (userGroups.length >= 10) {
                throw new Error('Maximum groups per country reached (10)');
            }
            
            const groupId = 'group_' + Date.now();
            const newGroup = {
                id: groupId,
                name: groupData.name,
                country: state.country.currentCountry,
                type: groupData.type || 'general',
                description: groupData.description || '',
                creatorId: state.user.id,
                createdAt: new Date().toISOString(),
                members: [{
                    id: state.user.id,
                    role: 'admin',
                    joinedAt: new Date().toISOString()
                }],
                settings: {
                    isPublic: false,
                    requiresApproval: true,
                    maxMembers: 1000,
                    minMembers: 5
                }
            };
            
            dispatch(createGroup(newGroup));
            dispatch(setCurrentGroup(groupId));
            
            // Add to borrower's group memberships if applicable
            if (state.borrower.isBorrower) {
                dispatch(updateProfile({
                    groupMemberships: [...state.borrower.groupMemberships, groupId]
                }));
            }
            
            dispatch(setSuccess(`Group "${groupData.name}" created successfully`));
            
            // Add audit log
            dispatch(addAuditLog({
                category: 'group',
                action: 'create',
                details: {
                    groupId,
                    groupName: groupData.name,
                    country: state.country.currentCountry
                }
            }));
            
            return groupId;
        };
    }
    
    /**
     * HANDLE CREATE LEDGER (Core business logic)
     */
    handleCreateLedger(loanData) {
        return (dispatch, getState) => {
            const state = getState();
            
            // Validate lender status
            if (!state.lender.isLender) {
                throw new Error('Only lenders can create ledgers');
            }
            
            // Validate subscription
            if (state.lender.subscriptionStatus !== 'active') {
                throw new Error('Active subscription required');
            }
            
            // Validate group
            if (!state.group.currentGroup) {
                throw new Error('Select a group first');
            }
            
            // Validate amount against limit
            const limit = state.lender.lendingLimits[state.lender.subscriptionLevel] || 0;
            if (loanData.amountBorrowed > limit) {
                throw new Error(`Amount exceeds ${state.lender.subscriptionLevel} limit of ${limit}`);
            }
            
            // Validate amount against available
            const available = limit - state.lender.amountLent;
            if (loanData.amountBorrowed > available) {
                throw new Error(`Insufficient lending limit. Available: ${available}`);
            }
            
            // Validate borrower is in same group
            const groupMembers = state.group.groups[state.group.currentGroup]?.members || [];
            const borrowerInGroup = groupMembers.some(m => m.id === loanData.borrowerId);
            
            if (!borrowerInGroup) {
                throw new Error('Borrower must be in the same group');
            }
            
            // Calculate dates
            const today = new Date();
            const dueDate = new Date(today);
            dueDate.setDate(dueDate.getDate() + 7); // 7-day repayment
            
            // Calculate interest (10%)
            const interestAmount = loanData.amountBorrowed * 0.10;
            
            const ledgerId = 'ledger_' + Date.now();
            const ledger = {
                id: ledgerId,
                lenderId: state.user.id,
                borrowerId: loanData.borrowerId,
                groupId: state.group.currentGroup,
                countryCode: state.country.currentCountry,
                
                borrowerName: loanData.borrowerName,
                borrowerContact: loanData.borrowerContact,
                borrowerLocation: loanData.borrowerLocation,
                
                guarantor1: loanData.guarantor1,
                guarantor2: loanData.guarantor2,
                
                loanCategory: loanData.category,
                amountBorrowed: loanData.amountBorrowed,
                dateBorrowed: today.toISOString(),
                expectedRepaymentDate: dueDate.toISOString(),
                
                interestRate: 10,
                interestAmount,
                penaltyRate: 5,
                penaltyAmount: 0,
                totalDue: loanData.amountBorrowed + interestAmount,
                amountRepaid: 0,
                amountOverdue: 0,
                
                status: 'active',
                daysOverdue: 0,
                
                partialRepayments: [],
                
                createdAt: today.toISOString(),
                updatedAt: today.toISOString()
            };
            
            dispatch(createLedger(ledger));
            
            // Update lender stats
            dispatch(updateLendingLimits({
                amountLent: state.lender.amountLent + loanData.amountBorrowed,
                activeLedgers: state.lender.activeLedgers + 1,
                outstandingAmount: state.lender.outstandingAmount + loanData.amountBorrowed + interestAmount,
                expectedInterest: state.lender.expectedInterest + interestAmount
            }));
            
            // Add notification for borrower
            dispatch(addNotification({
                id: 'notif_' + Date.now(),
                type: 'loan_approved',
                title: 'Loan Approved',
                message: `Your loan of ${loanData.amountBorrowed} has been approved`,
                recipientId: loanData.borrowerId,
                read: false,
                timestamp: new Date().toISOString()
            }));
            
            // Add audit log
            dispatch(addAuditLog({
                category: 'ledger',
                action: 'create',
                details: {
                    ledgerId,
                    amount: loanData.amountBorrowed,
                    borrowerId: loanData.borrowerId,
                    interest: interestAmount
                }
            }));
            
            dispatch(setSuccess(`Ledger created for ${loanData.amountBorrowed}`));
            
            return ledgerId;
        };
    }
    
    /**
     * HANDLE ADD REPAYMENT
     */
    handleAddRepayment(ledgerId, repaymentData) {
        return (dispatch, getState) => {
            const state = getState();
            const ledger = state.ledger.ledgers[ledgerId];
            
            if (!ledger) {
                throw new Error('Ledger not found');
            }
            
            // Validate authorization (lender or borrower)
            const isLender = ledger.lenderId === state.user.id;
            const isBorrower = ledger.borrowerId === state.user.id;
            
            if (!isLender && !isBorrower && state.role.currentRole !== 'admin') {
                throw new Error('Not authorized to update this ledger');
            }
            
            const newRepayment = {
                amount: repaymentData.amount,
                date: new Date().toISOString(),
                method: repaymentData.method || 'cash',
                reference: repaymentData.reference || '',
                recordedBy: state.user.id
            };
            
            const updatedLedger = {
                ...ledger,
                amountRepaid: ledger.amountRepaid + repaymentData.amount,
                partialRepayments: [...ledger.partialRepayments, newRepayment],
                updatedAt: new Date().toISOString()
            };
            
            // Check if fully repaid
            if (updatedLedger.amountRepaid >= updatedLedger.totalDue) {
                updatedLedger.status = 'cleared';
                updatedLedger.clearedAt = new Date().toISOString();
                
                // Update lender stats
                dispatch(updateLendingLimits({
                    activeLedgers: state.lender.activeLedgers - 1,
                    clearedLedgers: state.lender.clearedLedgers + 1,
                    outstandingAmount: state.lender.outstandingAmount - updatedLedger.totalDue
                }));
                
                // Add success notification
                dispatch(setSuccess('Loan fully repaid!'));
            }
            
            dispatch(updateLedger(ledgerId, updatedLedger));
            
            // Add audit log
            dispatch(addAuditLog({
                category: 'ledger',
                action: 'repayment',
                details: {
                    ledgerId,
                    amount: repaymentData.amount,
                    remaining: updatedLedger.totalDue - updatedLedger.amountRepaid
                }
            }));
        };
    }
    
    /**
     * HANDLE SUBSCRIBE TO PLAN
     */
    handleSubscribe(plan, duration, paymentData) {
        return (dispatch, getState) => {
            const state = getState();
            
            // Validate plan
            const validPlans = ['basic', 'premium', 'super', 'lender_of_lenders'];
            if (!validPlans.includes(plan)) {
                throw new Error('Invalid subscription plan');
            }
            
            // Check if already subscribed
            if (state.lender.subscriptionStatus === 'active') {
                throw new Error('Already subscribed. Upgrade instead.');
            }
            
            // Calculate expiry (28th of next month)
            const today = new Date();
            let expiryDate = new Date(today);
            
            const nextMonth = today.getMonth() + 1;
            const year = nextMonth > 11 ? today.getFullYear() + 1 : today.getFullYear();
            const month = nextMonth > 11 ? 0 : nextMonth;
            expiryDate = new Date(year, month, 28);
            
            // Get fee
            const planData = state.subscription.plans[plan];
            let fee = 0;
            
            switch (duration) {
                case 'monthly':
                    fee = planData.monthlyFee;
                    break;
                case 'bi-annual':
                    fee = planData.biAnnualFee;
                    break;
                case 'annual':
                    fee = planData.annualFee;
                    break;
                default:
                    throw new Error('Invalid duration');
            }
            
            dispatch(subscribe(plan, duration, paymentData));
            
            // Activate lender
            dispatch(activateLender({
                subscriptionLevel: plan,
                subscriptionExpiry: expiryDate.toISOString(),
                subscriptionStatus: 'active',
                currentLimit: planData.weeklyLimit
            }));
            
            // Set role to lender
            dispatch(setRole('lender'));
            
            // Add payment to history
            dispatch(makePayment(fee, paymentData.method, paymentData.reference));
            
            // Add notification
            dispatch(addNotification({
                id: 'notif_' + Date.now(),
                type: 'subscription',
                title: 'Subscription Activated',
                message: `Your ${plan} subscription is now active`,
                read: false,
                timestamp: new Date().toISOString()
            }));
            
            // Add audit log
            dispatch(addAuditLog({
                category: 'payment',
                action: 'subscribe',
                details: {
                    plan,
                    duration,
                    fee,
                    expiryDate: expiryDate.toISOString()
                }
            }));
            
            dispatch(setSuccess(`Subscribed to ${plan} plan successfully`));
        };
    }
    
    /**
     * HANDLE BLACKLIST BORROWER
     */
    handleBlacklistBorrower(borrowerId, reason, amountOwed) {
        return (dispatch, getState) => {
            const state = getState();
            
            // Validate authorization (lender or admin)
            if (!state.lender.isLender && state.role.currentRole !== 'admin') {
                throw new Error('Only lenders or admin can blacklist');
            }
            
            const blacklistEntry = {
                borrowerId,
                blacklistedBy: state.user.id,
                reason,
                amountOwed,
                date: new Date().toISOString(),
                status: 'active',
                canAppeal: true,
                country: state.country.currentCountry
            };
            
            dispatch(addToBlacklist(blacklistEntry));
            
            // Add to public blacklist
            dispatch(updateBlacklist({
                publicBlacklist: [...state.blacklist.publicBlacklist, blacklistEntry]
            }));
            
            // Add notification for borrower
            dispatch(addNotification({
                id: 'notif_' + Date.now(),
                type: 'blacklist',
                title: 'Blacklisted',
                message: `You have been blacklisted: ${reason}`,
                recipientId: borrowerId,
                read: false,
                timestamp: new Date().toISOString()
            }));
            
            // Add audit log
            dispatch(addAuditLog({
                category: 'security',
                action: 'blacklist',
                details: {
                    borrowerId,
                    reason,
                    amountOwed,
                    blacklistedBy: state.user.id
                }
            }));
            
            dispatch(setSuccess('Borrower added to blacklist'));
        };
    }
    
    /**
     * HANDLE SYNC (Online/Offline)
     */
    handleSync() {
        return async (dispatch, getState) => {
            const state = getState();
            
            if (!state.pwa.isOnline) {
                dispatch(setError('Cannot sync while offline'));
                return;
            }
            
            if (state.sync.syncInProgress) {
                return; // Already syncing
            }
            
            dispatch(startSync());
            dispatch(showLoading('Syncing data...'));
            
            try {
                // Simulate API sync
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // Process pending changes
                const changes = [...state.sync.pendingChanges, ...state.sync.offlineChanges];
                
                // Here you would send changes to server and receive updates
                const syncResult = {
                    timestamp: new Date().toISOString(),
                    changesProcessed: changes.length,
                    conflictsResolved: 0
                };
                
                dispatch(completeSync(syncResult));
                
                // Clear processed changes
                dispatch(removePendingChange());
                dispatch(removeOfflineChange());
                dispatch(resetRetryCount());
                
                dispatch(hideLoading());
                dispatch(setSuccess('Sync completed successfully'));
                
            } catch (error) {
                dispatch(failSync(error.message));
                dispatch(incrementRetryCount());
                
                dispatch(hideLoading());
                dispatch(setError(`Sync failed: ${error.message}`));
            }
        };
    }
    
    /**
     * HANDLE BATCH OPERATIONS
     */
    handleBatch(actions) {
        return (dispatch) => {
            dispatch(batchUpdate(actions));
            
            // Execute each action
            actions.forEach(action => {
                dispatch(action);
            });
            
            dispatch(setSuccess(`Batch operation completed (${actions.length} actions)`));
        };
    }
    
    /**
     * CALCULATE NEXT BILLING DATE
     */
    calculateNextBillingDate() {
        const today = new Date();
        let nextMonth = today.getMonth() + 1;
        let year = today.getFullYear();
        
        if (nextMonth > 11) {
            nextMonth = 0;
            year++;
        }
        
        return new Date(year, nextMonth, 28);
    }
    
    /**
     * GET ALL ACTIONS
     */
    getAllActions() {
        return {
            // Auth
            login: this.handleLogin.bind(this),
            register: this.handleRegister.bind(this),
            logout,
            
            // Country
            setCountry: this.handleSetCountry.bind(this),
            
            // Group
            createGroup: this.handleCreateGroup.bind(this),
            joinGroup,
            leaveGroup,
            
            // Ledger
            createLedger: this.handleCreateLedger.bind(this),
            addRepayment: this.handleAddRepayment.bind(this),
            updateLedger,
            
            // Subscription
            subscribe: this.handleSubscribe.bind(this),
            
            // Blacklist
            blacklistBorrower: this.handleBlacklistBorrower.bind(this),
            
            // Sync
            sync: this.handleSync.bind(this),
            
            // Batch
            batch: this.handleBatch.bind(this),
            
            // UI
            setTheme,
            setLanguage,
            toggleSidebar,
            setError,
            setSuccess,
            openModal,
            closeModal
        };
    }
}

// Export action creators and handlers
export { ActionHandlers };
export default {
    ...ActionTypes,
    // Re-export all action creators
    loginRequest,
    loginSuccess,
    loginFailure,
    logout,
    registerRequest,
    registerSuccess,
    registerFailure,
    setCountry,
    createGroup,
    createLedger,
    subscribe,
    setTheme,
    setLanguage,
    toggleSidebar,
    setError,
    setSuccess,
    openModal,
    closeModal,
    
    // Export handler class
    ActionHandlers
};