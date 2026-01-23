/**
 * M-PESEWA Session Management
 * FinTech-grade session control with zero tolerance for extension
 * Version: 1.0.0
 */

class MPSessionManager {
    constructor() {
        this.sessionTimeout = 30 * 60 * 1000; // 30 minutes
        this.warningTimeout = 5 * 60 * 1000; // 5 minutes before expiry
        this.sessionTimer = null;
        this.warningTimer = null;
        this.idleTimer = null;
        this.idleTimeout = 5 * 60 * 1000; // 5 minutes idle
        this.lastActivity = Date.now();
        
        this.init();
    }
    
    /**
     * Initialize session manager
     */
    init() {
        // Check for existing session
        this.validateExistingSession();
        
        // Start session monitoring
        this.startSessionMonitoring();
        
        // Set up activity listeners
        this.setupActivityListeners();
        
        // Set up beforeunload handler
        this.setupBeforeUnload();
        
        // Set up visibility change handler
        this.setupVisibilityHandler();
    }
    
    /**
     * Validate existing session
     */
    validateExistingSession() {
        const session = localStorage.getItem('mpesewa_session');
        const user = localStorage.getItem('mpesewa_user');
        
        if (!session || !user) {
            return;
        }
        
        try {
            const sessionData = JSON.parse(session);
            const userData = JSON.parse(user);
            
            // Check if session expired
            if (new Date(sessionData.expiresAt) < new Date()) {
                this.clearSession();
                return;
            }
            
            // Calculate remaining time
            const remaining = new Date(sessionData.expiresAt) - new Date();
            
            // Start session timer
            this.startSessionTimer(remaining);
            
            // Start warning timer
            this.startWarningTimer(remaining - this.warningTimeout);
            
        } catch (error) {
            console.error('Session validation error:', error);
            this.clearSession();
        }
    }
    
    /**
     * Start session monitoring
     */
    startSessionMonitoring() {
        // Check session every minute
        setInterval(() => {
            this.checkSession();
        }, 60 * 1000);
    }
    
    /**
     * Check session validity
     */
    checkSession() {
        const session = localStorage.getItem('mpesewa_session');
        if (!session) return;
        
        try {
            const sessionData = JSON.parse(session);
            
            // Check if session expired
            if (new Date(sessionData.expiresAt) < new Date()) {
                this.handleSessionExpired();
            }
            
            // Check idle time
            const idleTime = Date.now() - this.lastActivity;
            if (idleTime > this.idleTimeout) {
                this.handleIdleTimeout();
            }
            
        } catch (error) {
            console.error('Session check error:', error);
            this.clearSession();
        }
    }
    
    /**
     * Start session timer
     */
    startSessionTimer(duration = this.sessionTimeout) {
        // Clear existing timer
        if (this.sessionTimer) {
            clearTimeout(this.sessionTimer);
        }
        
        // Set new timer
        this.sessionTimer = setTimeout(() => {
            this.handleSessionExpired();
        }, duration);
    }
    
    /**
     * Start warning timer
     */
    startWarningTimer(duration = this.sessionTimeout - this.warningTimeout) {
        // Clear existing timer
        if (this.warningTimer) {
            clearTimeout(this.warningTimer);
        }
        
        // Set warning timer
        if (duration > 0) {
            this.warningTimer = setTimeout(() => {
                this.showSessionWarning();
            }, duration);
        }
    }
    
    /**
     * Handle session expired
     */
    handleSessionExpired() {
        // Show expiration message
        this.showSessionExpired();
        
        // Clear session
        this.clearSession();
        
        // Redirect to login after delay
        setTimeout(() => {
            window.location.href = '../pages/login.html?reason=session_expired';
        }, 3000);
    }
    
    /**
     * Handle idle timeout
     */
    handleIdleTimeout() {
        // Show idle warning
        this.showIdleWarning();
        
        // Clear session
        this.clearSession();
        
        // Redirect to login
        setTimeout(() => {
            window.location.href = '../pages/login.html?reason=idle_timeout';
        }, 5000);
    }
    
    /**
     * Show session warning
     */
    showSessionWarning() {
        // Check if user is on a protected page
        if (!this.isOnProtectedPage()) {
            return;
        }
        
        // Create warning modal
        const modal = document.createElement('div');
        modal.id = 'sessionWarningModal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
        `;
        
        modal.innerHTML = `
            <div style="background: white; padding: 30px; border-radius: 12px; max-width: 400px; text-align: center;">
                <div style="font-size: 48px; margin-bottom: 20px;">⏰</div>
                <h3 style="margin-bottom: 10px; color: #92400e;">Session Expiring Soon</h3>
                <p style="margin-bottom: 20px; color: #666;">
                    Your session will expire in 5 minutes due to security policies.
                    Do you want to extend your session?
                </p>
                <div style="display: flex; gap: 10px; justify-content: center;">
                    <button onclick="window.sessionManager.extendSession()" 
                            style="padding: 10px 20px; background: #2B1D4F; color: white; 
                                   border: none; border-radius: 6px; cursor: pointer;">
                        Extend Session
                    </button>
                    <button onclick="window.sessionManager.logout()" 
                            style="padding: 10px 20px; background: #ef4444; color: white; 
                                   border: none; border-radius: 6px; cursor: pointer;">
                        Logout Now
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Auto close after 10 seconds if no response
        setTimeout(() => {
            if (document.getElementById('sessionWarningModal')) {
                modal.remove();
                this.handleSessionExpired();
            }
        }, 10 * 1000);
    }
    
    /**
     * Show session expired message
     */
    showSessionExpired() {
        // Create expired modal
        const modal = document.createElement('div');
        modal.id = 'sessionExpiredModal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
        `;
        
        modal.innerHTML = `
            <div style="background: white; padding: 30px; border-radius: 12px; max-width: 400px; text-align: center;">
                <div style="font-size: 48px; margin-bottom: 20px;">🔒</div>
                <h3 style="margin-bottom: 10px; color: #991b1b;">Session Expired</h3>
                <p style="margin-bottom: 20px; color: #666;">
                    Your session has expired due to security policies.
                    You will be redirected to login.
                </p>
                <div style="display: flex; justify-content: center;">
                    <button onclick="window.location.href='../pages/login.html'" 
                            style="padding: 10px 20px; background: #2B1D4F; color: white; 
                                   border: none; border-radius: 6px; cursor: pointer;">
                        Go to Login
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
    
    /**
     * Show idle warning
     */
    showIdleWarning() {
        // Create idle warning modal
        const modal = document.createElement('div');
        modal.id = 'idleWarningModal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
        `;
        
        modal.innerHTML = `
            <div style="background: white; padding: 30px; border-radius: 12px; max-width: 400px; text-align: center;">
                <div style="font-size: 48px; margin-bottom: 20px;">👋</div>
                <h3 style="margin-bottom: 10px; color: #92400e;">Inactive Session</h3>
                <p style="margin-bottom: 20px; color: #666;">
                    You have been inactive for 5 minutes.
                    For security, your session will be terminated.
                </p>
                <div style="display: flex; justify-content: center;">
                    <button onclick="window.location.reload()" 
                            style="padding: 10px 20px; background: #2B1D4F; color: white; 
                                   border: none; border-radius: 6px; cursor: pointer;">
                        Continue Session
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Auto redirect after 5 seconds
        setTimeout(() => {
            if (document.getElementById('idleWarningModal')) {
                modal.remove();
                window.location.href = '../pages/login.html?reason=idle_timeout';
            }
        }, 5000);
    }
    
    /**
     * Extend session
     */
    extendSession() {
        const session = localStorage.getItem('mpesewa_session');
        const user = localStorage.getItem('mpesewa_user');
        
        if (!session || !user) {
            return;
        }
        
        try {
            const sessionData = JSON.parse(session);
            
            // Extend session by 30 minutes
            sessionData.expiresAt = new Date(Date.now() + this.sessionTimeout).toISOString();
            localStorage.setItem('mpesewa_session', JSON.stringify(sessionData));
            
            // Restart timers
            this.startSessionTimer();
            this.startWarningTimer();
            
            // Update last activity
            this.lastActivity = Date.now();
            
            // Remove warning modal
            const modal = document.getElementById('sessionWarningModal');
            if (modal) {
                modal.remove();
            }
            
            // Show extension confirmation
            this.showExtensionConfirmation();
            
        } catch (error) {
            console.error('Session extension error:', error);
        }
    }
    
    /**
     * Show extension confirmation
     */
    showExtensionConfirmation() {
        const confirmation = document.createElement('div');
        confirmation.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #10b981;
            color: white;
            padding: 10px 20px;
            border-radius: 6px;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        `;
        confirmation.textContent = '✅ Session extended';
        
        document.body.appendChild(confirmation);
        
        setTimeout(() => {
            confirmation.remove();
        }, 3000);
    }
    
    /**
     * Set up activity listeners
     */
    setupActivityListeners() {
        // Listen for user activity
        const activityEvents = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];
        
        activityEvents.forEach(event => {
            document.addEventListener(event, () => {
                this.lastActivity = Date.now();
                
                // Reset idle timer
                if (this.idleTimer) {
                    clearTimeout(this.idleTimer);
                }
                
                this.idleTimer = setTimeout(() => {
                    this.checkSession();
                }, this.idleTimeout);
            });
        });
    }
    
    /**
     * Set up beforeunload handler
     */
    setupBeforeUnload() {
        window.addEventListener('beforeunload', (event) => {
            // Only trigger for protected pages
            if (this.isOnProtectedPage()) {
                // For sensitive actions, confirm before leaving
                if (this.hasUnsavedChanges()) {
                    event.preventDefault();
                    event.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
                    return event.returnValue;
                }
                
                // Clear session on close for extra security
                if (this.shouldClearOnClose()) {
                    this.clearSession();
                }
            }
        });
    }
    
    /**
     * Set up visibility change handler
     */
    setupVisibilityHandler() {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // Tab switched away
                this.handleTabSwitch();
            } else {
                // Tab switched back
                this.handleTabReturn();
            }
        });
    }
    
    /**
     * Handle tab switch away
     */
    handleTabSwitch() {
        // Record time when tab was switched away
        this.tabSwitchTime = Date.now();
    }
    
    /**
     * Handle tab return
     */
    handleTabReturn() {
        // Check how long tab was away
        if (this.tabSwitchTime) {
            const timeAway = Date.now() - this.tabSwitchTime;
            
            // If away for more than 1 minute, require re-authentication
            if (timeAway > 60 * 1000 && this.isOnProtectedPage()) {
                this.showReauthModal();
            }
            
            this.tabSwitchTime = null;
        }
    }
    
    /**
     * Show re-authentication modal
     */
    showReauthModal() {
        const modal = document.createElement('div');
        modal.id = 'reauthModal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
        `;
        
        modal.innerHTML = `
            <div style="background: white; padding: 30px; border-radius: 12px; max-width: 400px; text-align: center;">
                <div style="font-size: 48px; margin-bottom: 20px;">🔐</div>
                <h3 style="margin-bottom: 10px; color: #92400e;">Re-authentication Required</h3>
                <p style="margin-bottom: 20px; color: #666;">
                    You were away for a while. Please re-enter your password to continue.
                </p>
                <div style="margin-bottom: 20px;">
                    <input type="password" id="reauthPassword" 
                           placeholder="Enter your password"
                           style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px;">
                </div>
                <div style="display: flex; gap: 10px; justify-content: center;">
                    <button onclick="window.sessionManager.verifyReauth()" 
                            style="padding: 10px 20px; background: #2B1D4F; color: white; 
                                   border: none; border-radius: 6px; cursor: pointer;">
                        Verify
                    </button>
                    <button onclick="window.sessionManager.logout()" 
                            style="padding: 10px 20px; background: #ef4444; color: white; 
                                   border: none; border-radius: 6px; cursor: pointer;">
                        Logout
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Focus password field
        setTimeout(() => {
            const passwordField = document.getElementById('reauthPassword');
            if (passwordField) {
                passwordField.focus();
            }
        }, 100);
    }
    
    /**
     * Verify re-authentication
     */
    async verifyReauth() {
        const password = document.getElementById('reauthPassword').value;
        
        if (!password) {
            this.showReauthError('Please enter your password');
            return;
        }
        
        // Get current user
        const user = localStorage.getItem('mpesewa_user');
        if (!user) {
            this.logout();
            return;
        }
        
        const userData = JSON.parse(user);
        
        try {
            // Verify password with Firebase
            const auth = firebase.auth();
            const email = userData.email;
            
            // Create temporary credential
            const credential = firebase.auth.EmailAuthProvider.credential(email, password);
            
            // Re-authenticate
            await auth.currentUser.reauthenticateWithCredential(credential);
            
            // Remove modal
            const modal = document.getElementById('reauthModal');
            if (modal) {
                modal.remove();
            }
            
            // Update last activity
            this.lastActivity = Date.now();
            
            // Show success message
            this.showReauthSuccess();
            
        } catch (error) {
            this.showReauthError('Invalid password. Please try again.');
        }
    }
    
    /**
     * Show re-authentication error
     */
    showReauthError(message) {
        const errorDiv = document.getElementById('reauthError') || document.createElement('div');
        errorDiv.id = 'reauthError';
        errorDiv.style.cssText = `
            color: #ef4444;
            font-size: 14px;
            margin-top: 10px;
        `;
        errorDiv.textContent = message;
        
        const modal = document.getElementById('reauthModal');
        const buttonContainer = modal.querySelector('div > div:last-child');
        buttonContainer.parentNode.insertBefore(errorDiv, buttonContainer);
    }
    
    /**
     * Show re-authentication success
     */
    showReauthSuccess() {
        const success = document.createElement('div');
        success.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #10b981;
            color: white;
            padding: 10px 20px;
            border-radius: 6px;
            z-index: 1000;
        `;
        success.textContent = '✅ Re-authenticated successfully';
        
        document.body.appendChild(success);
        
        setTimeout(() => {
            success.remove();
        }, 3000);
    }
    
    /**
     * Clear session
     */
    clearSession() {
        // Clear timers
        if (this.sessionTimer) {
            clearTimeout(this.sessionTimer);
            this.sessionTimer = null;
        }
        
        if (this.warningTimer) {
            clearTimeout(this.warningTimer);
            this.warningTimer = null;
        }
        
        if (this.idleTimer) {
            clearTimeout(this.idleTimer);
            this.idleTimer = null;
        }
        
        // Clear localStorage
        localStorage.removeItem('mpesewa_session');
        localStorage.removeItem('mpesewa_user');
        
        // Clear Firebase auth if exists
        if (firebase.auth) {
            firebase.auth().signOut();
        }
    }
    
    /**
     * Check if on protected page
     */
    isOnProtectedPage() {
        const protectedPages = [
            'borrowing.html',
            'lending.html',
            'groups.html',
            'countries/index.html',
            'blacklist.html',
            'debt-collectors.html',
            'borrower-dashboard.html',
            'lender-dashboard.html',
            'admin-dashboard.html',
            'profile.html',
            'ledger.html',
            'subscriptions.html'
        ];
        
        const currentPage = window.location.pathname.split('/').pop();
        return protectedPages.includes(currentPage);
    }
    
    /**
     * Check for unsaved changes
     */
    hasUnsavedChanges() {
        // Check for forms with unsaved data
        const forms = document.querySelectorAll('form');
        for (const form of forms) {
            if (form.hasAttribute('data-unsaved')) {
                return true;
            }
        }
        
        // Check for rich text editors, file uploads, etc.
        return false;
    }
    
    /**
     * Check if should clear session on close
     */
    shouldClearOnClose() {
        // Don't clear for remember me sessions
        const session = localStorage.getItem('mpesewa_session');
        if (session) {
            try {
                const sessionData = JSON.parse(session);
                return !sessionData.rememberMe;
            } catch (error) {
                return true;
            }
        }
        return true;
    }
    
    /**
     * Logout function
     */
    logout() {
        this.clearSession();
        window.location.href = '../pages/login.html';
    }
}

// Initialize session manager
document.addEventListener('DOMContentLoaded', () => {
    window.sessionManager = new MPSessionManager();
});

// Global logout function
window.logout = function() {
    if (window.sessionManager) {
        window.sessionManager.logout();
    }
};