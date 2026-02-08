/**
 * M-PESEWA Admin Guard
 * Protects admin routes and enforces admin-only operations
 * Admin can override blacklists, ledgers, and moderate ratings
 */

import { getCurrentUser, isUserAdmin, getAdminPermissions } from '../state/store.js';
import { navigateTo } from './router.js';
import { logAuditEvent } from '../audit/audit-log.js';
import { ADMIN_ROLES, ADMIN_PERMISSIONS } from '../core/constants.js';
import { encryptData, decryptData } from '../utils/encryption.js';

/**
 * Admin Guard - Protects admin routes and operations
 * @param {Object} context - Route context
 * @param {Function} next - Next middleware function
 * @returns {Promise<void>}
 */
export const adminGuard = async (context, next) => {
  try {
    console.log('👑 Admin Guard: Checking admin access...');
    
    // Check if route requires admin access
    if (!requiresAdminAccess(context.path)) {
      console.log('Admin Guard: Route does not require admin access');
      return await next();
    }
    
    const user = getCurrentUser();
    if (!user) {
      console.error('❌ Admin Guard: No user logged in');
      navigateTo('/admin/login');
      return;
    }
    
    // STRICT RULE: User must be admin
    if (!isUserAdmin(user.id)) {
      console.error(`❌ Admin Guard: User ${user.id} is not admin`);
      
      logAuditEvent('ADMIN_ACCESS_DENIED', {
        userId: user.id,
        attemptedRoute: context.path,
        ip: context.ip,
        userAgent: context.userAgent,
        timestamp: new Date().toISOString()
      });
      
      showAdminAccessDenied();
      return;
    }
    
    // STRICT RULE: Check admin role permissions
    const adminRole = getAdminRole(user.id);
    const permissions = getAdminPermissions(adminRole);
    
    if (!hasPermissionForRoute(permissions, context.path)) {
      console.error(`❌ Admin Guard: Insufficient permissions for ${context.path}`);
      
      logAuditEvent('ADMIN_PERMISSION_DENIED', {
        userId: user.id,
        adminRole: adminRole,
        requiredPermission: getRequiredPermission(context.path),
        route: context.path,
        userPermissions: permissions
      });
      
      showInsufficientPermissions(adminRole, permissions, context.path);
      return;
    }
    
    // STRICT RULE: Admin operations require audit logging
    if (isAdminOperation(context)) {
      console.log(`Admin Guard: Admin operation detected - ${context.method} ${context.path}`);
      
      // Validate admin operation
      const validation = validateAdminOperation(context, user);
      if (!validation.valid) {
        console.error(`❌ Admin Guard: Operation validation failed:`, validation.errors);
        showOperationValidationError(validation);
        return;
      }
      
      // Pre-log the operation
      await preLogAdminOperation(context, user);
    }
    
    // STRICT RULE: Check for impersonation requests
    if (isImpersonationRequest(context)) {
      const impersonationCheck = validateImpersonationRequest(context, user);
      if (!impersonationCheck.allowed) {
        console.error(`❌ Admin Guard: Impersonation not allowed:`, impersonationCheck.reason);
        showImpersonationDenied(impersonationCheck);
        return;
      }
    }
    
    // STRICT RULE: Add security headers for admin routes
    addAdminSecurityHeaders(context);
    
    // Add admin context to route
    context.admin = {
      userId: user.id,
      role: adminRole,
      permissions: permissions,
      sessionId: generateAdminSessionId()
    };
    
    console.log(`✅ Admin Guard: Access granted for ${adminRole}`);
    
    // Proceed with the route
    await next();
    
    // Post-operation logging
    if (isAdminOperation(context)) {
      await postLogAdminOperation(context, user);
    }
    
  } catch (error) {
    console.error('Admin Guard Error:', error);
    
    // Don't expose internal errors
    const safeError = error.message.includes('permission') ? error.message : 'Internal admin error';
    
    logAuditEvent('ADMIN_GUARD_FAILURE', {
      error: safeError,
      route: context?.path,
      userId: getCurrentUser()?.id,
      stack: error.stack.substring(0, 200) // Limit stack trace
    });
    
    navigateTo('/admin/error');
  }
};

/**
 * Check if route requires admin access
 * @param {string} path - Route path
 * @returns {boolean}
 */
function requiresAdminAccess(path) {
  const adminRoutes = [
    /^\/admin\//,
    /^\/system\//,
    /^\/audit\//,
    /^\/reports\//,
    /^\/blacklist\/override/,
    /^\/ledger\/override/,
    /^\/user\/impersonate/,
    /^\/platform\/settings/
  ];
  
  return adminRoutes.some(pattern => pattern.test(path));
}

/**
 * Get admin role for user
 * @param {string} userId - User ID
 * @returns {string} Admin role
 */
function getAdminRole(userId) {
  const adminData = JSON.parse(localStorage.getItem('admin_users') || '{}');
  return adminData[userId]?.role || 'moderator';
}

/**
 * Check if user has permission for route
 * @param {Array} permissions - User permissions
 * @param {string} path - Route path
 * @returns {boolean}
 */
function hasPermissionForRoute(permissions, path) {
  const requiredPermission = getRequiredPermission(path);
  
  if (!requiredPermission) {
    return true; // No specific permission required
  }
  
  return permissions.includes(requiredPermission) || 
         permissions.includes('all') ||
         permissions.includes('super_admin');
}

/**
 * Get required permission for route
 * @param {string} path - Route path
 * @returns {string|null} Required permission
 */
function getRequiredPermission(path) {
  const permissionMap = {
    '/admin/dashboard': 'view_dashboard',
    '/admin/users': 'manage_users',
    '/admin/groups': 'manage_groups',
    '/admin/ledgers': 'manage_ledgers',
    '/admin/blacklist': 'manage_blacklist',
    '/admin/subscriptions': 'manage_subscriptions',
    '/admin/audit': 'view_audit',
    '/admin/settings': 'manage_settings',
    '/admin/impersonate': 'impersonate_users',
    '/admin/freeze': 'freeze_accounts',
    '/admin/country-control': 'manage_countries',
    '/admin/system-health': 'view_system',
    '/blacklist/override': 'override_blacklist',
    '/ledger/override': 'override_ledger',
    '/user/impersonate': 'impersonate_users'
  };
  
  // Find matching route pattern
  for (const [route, permission] of Object.entries(permissionMap)) {
    if (path.startsWith(route)) {
      return permission;
    }
  }
  
  return null;
}

/**
 * Check if request is an admin operation
 * @param {Object} context - Route context
 * @returns {boolean}
 */
function isAdminOperation(context) {
  const { method, path } = context;
  
  // POST, PUT, DELETE methods on admin routes are operations
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
    return requiresAdminAccess(path);
  }
  
  return false;
}

/**
 * Validate admin operation
 * @param {Object} context - Route context
 * @param {Object} user - Admin user
 * @returns {Object} Validation result
 */
function validateAdminOperation(context, user) {
  const errors = [];
  const { method, path, body } = context;
  
  // Check for required admin notes
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method) && requiresAdminAccess(path)) {
    if (!body || !body.adminNotes || body.adminNotes.trim().length < 10) {
      errors.push('Admin notes required (minimum 10 characters)');
    }
  }
  
  // Check for destructive operations
  if (method === 'DELETE' || path.includes('/override') || path.includes('/freeze')) {
    if (!body || !body.reason || body.reason.trim().length < 20) {
      errors.push('Detailed reason required for destructive operations (minimum 20 characters)');
    }
    
    // Check for confirmation
    if (!body || !body.confirmOperation) {
      errors.push('Operation confirmation required');
    }
  }
  
  // Check for impersonation safety
  if (path.includes('/impersonate')) {
    if (!body || !body.targetUserId) {
      errors.push('Target user ID required');
    }
    
    if (body.targetUserId === user.id) {
      errors.push('Cannot impersonate yourself');
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Check if request is for impersonation
 * @param {Object} context - Route context
 * @returns {boolean}
 */
function isImpersonationRequest(context) {
  return context.path.includes('/impersonate') || 
         (context.body && context.body._impersonate);
}

/**
 * Validate impersonation request
 * @param {Object} context - Route context
 * @param {Object} user - Admin user
 * @returns {Object} Validation result
 */
function validateImpersonationRequest(context, user) {
  const { body } = context;
  const targetUserId = body?.targetUserId || body?.userId;
  
  if (!targetUserId) {
    return {
      allowed: false,
      reason: 'Target user ID required'
    };
  }
  
  // Cannot impersonate other admins
  if (isUserAdmin(targetUserId)) {
    return {
      allowed: false,
      reason: 'Cannot impersonate other administrators'
    };
  }
  
  // Check admin permissions
  const permissions = getAdminPermissions(getAdminRole(user.id));
  if (!permissions.includes('impersonate_users')) {
    return {
      allowed: false,
      reason: 'Insufficient permissions for impersonation'
    };
  }
  
  // Rate limiting: max 5 impersonations per hour
  const impersonationLog = JSON.parse(localStorage.getItem('admin_impersonation_log') || '[]');
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const recentImpersonations = impersonationLog.filter(log => 
    new Date(log.timestamp) > oneHourAgo && log.adminId === user.id
  );
  
  if (recentImpersonations.length >= 5) {
    return {
      allowed: false,
      reason: 'Impersonation rate limit exceeded (5 per hour)'
    };
  }
  
  return {
    allowed: true,
    targetUserId,
    adminId: user.id,
    timestamp: new Date().toISOString()
  };
}

/**
 * Show admin access denied screen
 */
function showAdminAccessDenied() {
  const errorHtml = `
    <div class="admin-access-denied" style="
      max-width: 600px;
      margin: 100px auto;
      padding: 40px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      text-align: center;
    ">
      <div style="font-size: 64px; margin-bottom: 20px;">🔒</div>
      <h1 style="color: #003366; margin-bottom: 15px;">Admin Access Required</h1>
      <p style="color: #555; margin-bottom: 25px; line-height: 1.6; font-size: 18px;">
        This area is restricted to authorized administrators only. 
        Unauthorized access attempts are logged and monitored.
      </p>
      
      <div style="
        background: #fff5f5;
        border: 2px solid #dc3545;
        border-radius: 10px;
        padding: 25px;
        margin: 30px 0;
        text-align: left;
      ">
        <h3 style="color: #dc3545; margin-bottom: 15px; font-size: 20px;">Security Notice</h3>
        <ul style="color: #555; padding-left: 20px; line-height: 1.8;">
          <li>All access attempts are logged with IP address and timestamp</li>
          <li>Repeated unauthorized attempts may result in account suspension</li>
          <li>Admin access requires multi-factor authentication</li>
          <li>Contact platform security if you believe this is an error</li>
        </ul>
      </div>
      
      <div style="display: flex; gap: 15px; justify-content: center; margin-top: 30px;">
        <button onclick="window.location.href='/admin/login'" style="
          background: #003366;
          color: white;
          border: none;
          padding: 14px 28px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          font-size: 16px;
        ">
          Admin Login
        </button>
        <button onclick="window.location.href='/'" style="
          background: white;
          color: #003366;
          border: 2px solid #003366;
          padding: 14px 28px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          font-size: 16px;
        ">
          Return to Home
        </button>
      </div>
      
      <div style="
        margin-top: 40px;
        padding-top: 20px;
        border-top: 1px solid #eee;
        font-size: 12px;
        color: #888;
      ">
        <p>Access attempt logged at ${new Date().toLocaleString()}</p>
        <p>If you are an administrator, use the dedicated admin login portal.</p>
      </div>
    </div>
  `;
  
  document.body.innerHTML = errorHtml;
}

/**
 * Show insufficient permissions screen
 * @param {string} adminRole - Admin role
 * @param {Array} permissions - User permissions
 * @param {string} route - Attempted route
 */
function showInsufficientPermissions(adminRole, permissions, route) {
  const requiredPermission = getRequiredPermission(route);
  
  const errorHtml = `
    <div class="insufficient-permissions" style="
      max-width: 700px;
      margin: 60px auto;
      padding: 40px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      text-align: center;
    ">
      <div style="font-size: 64px; margin-bottom: 20px;">🚫</div>
      <h2 style="color: #003366; margin-bottom: 15px;">Insufficient Permissions</h2>
      <p style="color: #555; margin-bottom: 20px; line-height: 1.6;">
        Your role <strong>${adminRole}</strong> does not have permission to access this resource.
      </p>
      
      <div style="
        background: #f8f9fa;
        padding: 25px;
        border-radius: 10px;
        margin: 25px 0;
        text-align: left;
      ">
        <h4 style="color: #003366; margin-bottom: 15px;">Permission Details:</h4>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
          <div>
            <strong style="color: #666;">Required:</strong>
            <div style="color: #dc3545; font-weight: bold; margin-top: 5px; padding: 8px; background: #fff5f5; border-radius: 6px;">
              ${requiredPermission || 'Unknown'}
            </div>
          </div>
          
          <div>
            <strong style="color: #666;">Your Role:</strong>
            <div style="color: #28a745; font-weight: bold; margin-top: 5px; padding: 8px; background: #e8f5e8; border-radius: 6px;">
              ${adminRole}
            </div>
          </div>
        </div>
        
        <div>
          <strong style="color: #666;">Your Permissions:</strong>
          <div style="
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 10px;
          ">
            ${permissions.map(perm => `
              <span style="
                background: ${perm === requiredPermission ? '#dc3545' : '#6c757d'};
                color: white;
                padding: 4px 12px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 600;
              ">
                ${perm}
              </span>
            `).join('')}
          </div>
        </div>
      </div>
      
      <div style="
        background: #fff3cd;
        border: 2px solid #ffc107;
        border-radius: 10px;
        padding: 20px;
        margin: 25px 0;
        text-align: left;
      ">
        <h4 style="color: #856404; margin-bottom: 10px;">Next Steps:</h4>
        <ul style="color: #856404; padding-left: 20px; line-height: 1.8;">
          <li>Contact a Super Administrator to request additional permissions</li>
          <li>Check if you're using the correct admin account</li>
          <li>Some features require specific role assignments</li>
        </ul>
      </div>
      
      <div style="display: flex; gap: 15px; justify-content: center; margin-top: 30px;">
        <button onclick="window.location.href='/admin/dashboard'" style="
          background: #003366;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        ">
          Admin Dashboard
        </button>
        <button onclick="window.history.back()" style="
          background: white;
          color: #003366;
          border: 2px solid #003366;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        ">
          Go Back
        </button>
      </div>
      
      <div style="
        margin-top: 30px;
        padding-top: 20px;
        border-top: 1px solid #eee;
        font-size: 12px;
        color: #888;
      ">
        <p>Route: ${route}</p>
        <p>Access denied at ${new Date().toLocaleTimeString()}</p>
      </div>
    </div>
  `;
  
  document.body.innerHTML = errorHtml;
}

/**
 * Show operation validation error
 * @param {Object} validation - Validation result
 */
function showOperationValidationError(validation) {
  const errorList = validation.errors.map(error => `<li>${error}</li>`).join('');
  
  const errorHtml = `
    <div class="operation-validation-error" style="
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.2);
      text-align: center;
      max-width: 500px;
      width: 90%;
      z-index: 10000;
    ">
      <div style="font-size: 48px; margin-bottom: 20px;">⚠️</div>
      <h3 style="color: #dc3545; margin-bottom: 15px;">Operation Validation Failed</h3>
      <p style="color: #555; margin-bottom: 20px;">
        The following issues were found with your admin operation:
      </p>
      
      <div style="
        background: #fff5f5;
        padding: 15px;
        border-radius: 8px;
        margin: 20px 0;
        text-align: left;
      ">
        <ul style="color: #dc3545; padding-left: 20px;">
          ${errorList}
        </ul>
      </div>
      
      <div style="display: flex; gap: 12px; justify-content: center; margin-top: 25px;">
        <button onclick="this.parentElement.parentElement.remove(); window.history.back();" style="
          background: #003366;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          flex: 1;
        ">
          Go Back & Fix
        </button>
      </div>
    </div>
  `;
  
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
    z-index: 9999;
  `;
  
  overlay.innerHTML = errorHtml;
  document.body.appendChild(overlay);
}

/**
 * Show impersonation denied
 * @param {Object} check - Impersonation check result
 */
function showImpersonationDenied(check) {
  const errorHtml = `
    <div class="impersonation-denied">
      <div class="error-icon">🔒</div>
      <h3>Impersonation Not Allowed</h3>
      <p>${check.reason}</p>
      <div class="actions">
        <button onclick="window.history.back()" class="btn btn-primary">
          Go Back
        </button>
      </div>
    </div>
  `;
  
  // Show as modal
  const modal = document.createElement('div');
  modal.className = 'impersonation-modal';
  modal.innerHTML = errorHtml;
  document.body.appendChild(modal);
}

/**
 * Generate admin session ID
 * @returns {string} Session ID
 */
function generateAdminSessionId() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  return `admin-${timestamp}-${random}`;
}

/**
 * Add security headers for admin routes
 * @param {Object} context - Route context
 */
function addAdminSecurityHeaders(context) {
  // Add security headers to responses
  const securityHeaders = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
  };
  
  // In a real app, these would be set on the response
  console.log('Admin security headers would be set:', securityHeaders);
}

/**
 * Pre-log admin operation
 * @param {Object} context - Route context
 * @param {Object} user - Admin user
 */
async function preLogAdminOperation(context, user) {
  const logEntry = {
    id: `op-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    adminId: user.id,
    adminRole: getAdminRole(user.id),
    operation: `${context.method} ${context.path}`,
    timestamp: new Date().toISOString(),
    status: 'pending',
    details: {
      body: context.body ? encryptData(JSON.stringify(context.body)) : null,
      ip: context.ip,
      userAgent: context.userAgent
    },
    preCheck: true
  };
  
  // Save to pending operations
  const pendingOps = JSON.parse(localStorage.getItem('admin_pending_operations') || '[]');
  pendingOps.push(logEntry);
  localStorage.setItem('admin_pending_operations', JSON.stringify(pendingOps));
  
  console.log('Admin operation pre-logged:', logEntry.id);
}

/**
 * Post-log admin operation
 * @param {Object} context - Route context
 * @param {Object} user - Admin user
 */
async function postLogAdminOperation(context, user) {
  const pendingOps = JSON.parse(localStorage.getItem('admin_pending_operations') || '[]');
  const lastOp = pendingOps[pendingOps.length - 1];
  
  if (lastOp && lastOp.status === 'pending') {
    lastOp.status = 'completed';
    lastOp.completedAt = new Date().toISOString();
    
    // Move to completed logs
    const completedOps = JSON.parse(localStorage.getItem('admin_operation_logs') || '[]');
    completedOps.push(lastOp);
    localStorage.setItem('admin_operation_logs', JSON.stringify(completedOps));
    
    // Remove from pending
    pendingOps.pop();
    localStorage.setItem('admin_pending_operations', JSON.stringify(pendingOps));
    
    // Log audit event
    logAuditEvent('ADMIN_OPERATION_COMPLETED', {
      operationId: lastOp.id,
      adminId: user.id,
      operation: lastOp.operation,
      duration: new Date(lastOp.completedAt) - new Date(lastOp.timestamp)
    });
    
    console.log('Admin operation completed:', lastOp.id);
  }
}

/**
 * Get admin dashboard statistics
 * @returns {Object} Dashboard stats
 */
export async function getAdminDashboardStats() {
  // This would typically come from backend API
  const stats = {
    totalUsers: localStorage.getItem('total_users') || 0,
    activeLenders: localStorage.getItem('active_lenders') || 0,
    activeBorrowers: localStorage.getItem('active_borrowers') || 0,
    totalGroups: localStorage.getItem('total_groups') || 0,
    activeLoans: localStorage.getItem('active_loans') || 0,
    totalVolume: localStorage.getItem('total_volume') || 0,
    defaultRate: localStorage.getItem('default_rate') || '0%',
    platformRevenue: localStorage.getItem('platform_revenue') || 0
  };
  
  return stats;
}

/**
 * Override blacklist (admin only)
 * @param {string} blacklistId - Blacklist ID
 * @param {Object} overrideDetails - Override details
 * @returns {Object} Override result
 */
export async function overrideBlacklist(blacklistId, overrideDetails) {
  const { adminId, reason, action, notes } = overrideDetails;
  
  // Validate admin
  if (!isUserAdmin(adminId)) {
    throw new Error('Only administrators can override blacklists');
  }
  
  // Find blacklist
  const blacklists = JSON.parse(localStorage.getItem('blacklists') || '[]');
  const blacklistIndex = blacklists.findIndex(b => b.id === blacklistId);
  
  if (blacklistIndex === -1) {
    throw new Error('Blacklist not found');
  }
  
  const blacklist = blacklists[blacklistIndex];
  
  // Perform override
  blacklist.overridden = true;
  blacklist.overrideDetails = {
    adminId,
    action,
    reason,
    notes,
    timestamp: new Date().toISOString()
  };
  
  // Apply action
  if (action === 'remove') {
    blacklist.status = 'cleared';
    blacklist.restrictions.canBorrow = true;
    blacklist.restrictions.canJoinGroups = true;
  } else if (action === 'modify') {
    // Modify blacklist level or restrictions
    if (overrideDetails.newLevel) {
      blacklist.level = overrideDetails.newLevel;
    }
  }
  
  blacklists[blacklistIndex] = blacklist;
  localStorage.setItem('blacklists', JSON.stringify(blacklists));
  
  // Log audit event
  logAuditEvent('BLACKLIST_OVERRIDE', {
    blacklistId,
    adminId,
    action,
    reason,
    userId: blacklist.userId,
    originalStatus: blacklist.status
  });
  
  return {
    success: true,
    blacklistId,
    action,
    userId: blacklist.userId,
    timestamp: new Date().toISOString()
  };
}

/**
 * Override ledger (admin only)
 * @param {string} ledgerId - Ledger ID
 * @param {Object} overrideDetails - Override details
 * @returns {Object} Override result
 */
export async function overrideLedger(ledgerId, overrideDetails) {
  const { adminId, changes, reason, notes } = overrideDetails;
  
  // Validate admin
  if (!isUserAdmin(adminId)) {
    throw new Error('Only administrators can override ledgers');
  }
  
  // Find ledger
  const ledgers = JSON.parse(localStorage.getItem('ledgers') || '[]');
  const ledgerIndex = ledgers.findIndex(l => l.id === ledgerId);
  
  if (ledgerIndex === -1) {
    throw new Error('Ledger not found');
  }
  
  const ledger = ledgers[ledgerIndex];
  const originalLedger = JSON.parse(JSON.stringify(ledger));
  
  // Apply changes
  Object.assign(ledger, changes);
  
  // Add override record
  ledger.overrides = ledger.overrides || [];
  ledger.overrides.push({
    adminId,
    changes,
    reason,
    notes,
    timestamp: new Date().toISOString(),
    original: originalLedger
  });
  
  ledgers[ledgerIndex] = ledger;
  localStorage.setItem('ledgers', JSON.stringify(ledgers));
  
  // Log audit event
  logAuditEvent('LEDGER_OVERRIDE', {
    ledgerId,
    adminId,
    changes: Object.keys(changes),
    reason,
    lenderId: ledger.lenderId,
    borrowerId: ledger.borrowerId
  });
  
  return {
    success: true,
    ledgerId,
    changesApplied: Object.keys(changes),
    timestamp: new Date().toISOString()
  };
}

/**
 * Validate debt collector
 * @param {string} collectorId - Collector ID
 * @param {Object} validationDetails - Validation details
 * @returns {Object} Validation result
 */
export async function validateDebtCollector(collectorId, validationDetails) {
  const { adminId, isValid, reason, notes } = validationDetails;
  
  // Validate admin
  if (!isUserAdmin(adminId)) {
    throw new Error('Only administrators can validate debt collectors');
  }
  
  // Find collector
  const collectors = JSON.parse(localStorage.getItem('debt_collectors') || '[]');
  const collectorIndex = collectors.findIndex(c => c.id === collectorId);
  
  if (collectorIndex === -1) {
    throw new Error('Debt collector not found');
  }
  
  const collector = collectors[collectorIndex];
  
  // Update validation status
  collector.validated = isValid;
  collector.validationDetails = {
    adminId,
    isValid,
    reason,
    notes,
    validatedAt: new Date().toISOString()
  };
  
  collectors[collectorIndex] = collector;
  localStorage.setItem('debt_collectors', JSON.stringify(collectors));
  
  // Log audit event
  logAuditEvent('DEBT_COLLECTOR_VALIDATED', {
    collectorId,
    adminId,
    isValid,
    reason,
    collectorName: collector.name
  });
  
  return {
    success: true,
    collectorId,
    isValid,
    validatedAt: new Date().toISOString()
  };
}

/**
 * Initialize admin guard
 */
export function initializeAdminGuard() {
  console.log('👑 Admin Guard: Initializing admin protection...');
  
  // Setup admin session monitoring
  setupAdminSessionMonitoring();
  
  // Add admin helpers to window (only if admin)
  if (isUserAdmin(getCurrentUser()?.id)) {
    window.MPesewaAdmin = {
      getDashboardStats: getAdminDashboardStats,
      overrideBlacklist,
      overrideLedger,
      validateDebtCollector
    };
  }
  
  console.log('✅ Admin Guard: Initialized successfully');
}

/**
 * Setup admin session monitoring
 */
function setupAdminSessionMonitoring() {
  // Monitor admin session activity
  let lastActivity = Date.now();
  
  // Track user activity
  ['mousedown', 'keydown', 'scroll', 'touchstart'].forEach(event => {
    document.addEventListener(event, () => {
      lastActivity = Date.now();
    });
  });
  
  // Check for inactivity every minute
  setInterval(() => {
    const user = getCurrentUser();
    if (user && isUserAdmin(user.id)) {
      const inactiveTime = Date.now() - lastActivity;
      const timeout = 30 * 60 * 1000; // 30 minutes
      
      if (inactiveTime > timeout) {
        console.log('Admin session timeout due to inactivity');
        logAuditEvent('ADMIN_SESSION_TIMEOUT', {
          adminId: user.id,
          inactiveTime,
          timeout
        });
        
        // Logout admin
        localStorage.removeItem('admin_session');
        navigateTo('/admin/login?timeout=true');
      } else if (inactiveTime > timeout - 5 * 60 * 1000) {
        // Show warning 5 minutes before timeout
        showSessionTimeoutWarning(timeout - inactiveTime);
      }
    }
  }, 60 * 1000); // Check every minute
}

/**
 * Show session timeout warning
 * @param {number} timeLeft - Time left in milliseconds
 */
function showSessionTimeoutWarning(timeLeft) {
  const minutesLeft = Math.ceil(timeLeft / (60 * 1000));
  
  // Only show once per warning period
  const lastWarning = localStorage.getItem('last_session_warning');
  const now = Date.now();
  
  if (!lastWarning || now - parseInt(lastWarning) > 60 * 1000) {
    const warning = document.createElement('div');
    warning.className = 'session-timeout-warning';
    warning.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ffc107;
        color: #856404;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease;
      ">
        <strong>Admin Session Expiring</strong>
        <p style="margin: 5px 0 0 0; font-size: 14px;">
          Your admin session will expire in ${minutesLeft} minutes due to inactivity.
        </p>
        <button onclick="this.parentElement.remove(); localStorage.setItem('last_session_warning', '${now}');" style="
          background: #856404;
          color: white;
          border: none;
          padding: 5px 10px;
          border-radius: 4px;
          font-size: 12px;
          margin-top: 10px;
          cursor: pointer;
        ">
          Dismiss
        </button>
      </div>
    `;
    
    document.body.appendChild(warning);
    localStorage.setItem('last_session_warning', now.toString());
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (warning.parentElement) {
        warning.remove();
      }
    }, 10000);
  }
}

export default adminGuard;