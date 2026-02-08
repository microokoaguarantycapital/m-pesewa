/**
 * M-PESEWA Blacklist Guard
 * Enforces blacklist rules per Section A
 * Blacklisted users cannot borrow or join new groups
 * Removal only by Admin after full repayment
 */

import { getCurrentUser, getUserBlacklistStatus, getUserRole } from '../state/store.js';
import { navigateTo } from './router.js';
import { logAuditEvent } from '../audit/audit-log.js';
import { formatCurrency, formatDate } from '../utils/date.js';
import { BLACKLIST_RULES, DEFAULT_BLACKLIST_REASONS } from '../core/constants.js';

/**
 * Blacklist Guard - Enforces blacklist restrictions
 * @param {Object} context - Route context
 * @param {Function} next - Next middleware function
 * @returns {Promise<void>}
 */
export const blacklistGuard = async (context, next) => {
  try {
    console.log('🚫 Blacklist Guard: Checking blacklist status...');
    
    const user = getCurrentUser();
    if (!user) {
      console.log('Blacklist Guard: No user logged in, proceeding...');
      return await next();
    }
    
    const blacklistStatus = getUserBlacklistStatus();
    
    // If user has no blacklist status, proceed
    if (!blacklistStatus || blacklistStatus.status === 'clear') {
      console.log('✅ Blacklist Guard: User has clear status');
      return await next();
    }
    
    console.log(`Blacklist Guard: User status = ${blacklistStatus.status}, level = ${blacklistStatus.level}`);
    
    // STRICT RULE: Blacklisted users cannot access borrowing features
    if (isBorrowingRoute(context.path) && blacklistStatus.status === 'blacklisted') {
      console.error('❌ Blacklist Guard: Blacklisted user attempting to borrow');
      
      logAuditEvent('BLACKLIST_BORROW_ATTEMPT', {
        userId: user.id,
        blacklistId: blacklistStatus.id,
        level: blacklistStatus.level,
        amountOwed: blacklistStatus.amountOwed,
        daysOverdue: blacklistStatus.daysOverdue,
        route: context.path
      });
      
      showBlacklistBorrowingRestricted(blacklistStatus);
      return;
    }
    
    // STRICT RULE: Blacklisted users cannot join new groups
    if (isGroupJoinRoute(context.path) && blacklistStatus.status === 'blacklisted') {
      console.error('❌ Blacklist Guard: Blacklisted user attempting to join group');
      
      logAuditEvent('BLACKLIST_GROUP_JOIN_ATTEMPT', {
        userId: user.id,
        blacklistId: blacklistStatus.id,
        route: context.path
      });
      
      showBlacklistGroupRestricted(blacklistStatus);
      return;
    }
    
    // STRICT RULE: Warnings restrict certain actions
    if (blacklistStatus.status === 'warning') {
      const restrictionCheck = checkWarningRestrictions(context, blacklistStatus);
      if (!restrictionCheck.allowed) {
        console.warn(`⚠️ Blacklist Guard: Warning restricts action: ${restrictionCheck.reason}`);
        showWarningRestriction(blacklistStatus, restrictionCheck);
        return;
      }
    }
    
    // STRICT RULE: Check if user is attempting to clear blacklist without admin
    if (isBlacklistClearAttempt(context) && !user.isAdmin) {
      console.error('❌ Blacklist Guard: Non-admin attempting to clear blacklist');
      
      logAuditEvent('UNAUTHORIZED_BLACKLIST_CLEAR', {
        userId: user.id,
        attemptedBy: user.id,
        route: context.path,
        method: context.method
      });
      
      showAdminOnlyError();
      return;
    }
    
    // Add blacklist context to route
    context.blacklistStatus = blacklistStatus;
    
    // Show warning badge if applicable
    if (blacklistStatus.status !== 'clear') {
      showBlacklistBadge(blacklistStatus);
    }
    
    console.log(`✅ Blacklist Guard: Proceeding with status ${blacklistStatus.status}`);
    await next();
    
  } catch (error) {
    console.error('Blacklist Guard Error:', error);
    
    logAuditEvent('BLACKLIST_GUARD_FAILURE', {
      error: error.message,
      route: context?.path,
      userId: getCurrentUser()?.id
    });
    
    navigateTo('/error/blacklist');
  }
};

/**
 * Check if route is for borrowing
 * @param {string} path - Route path
 * @returns {boolean}
 */
function isBorrowingRoute(path) {
  const borrowingRoutes = [
    /^\/borrower\/apply/,
    /^\/borrower\/request/,
    /^\/emergency\/[^/]+\/borrow/,
    /^\/loans\/new/,
    /^\/loans\/request/
  ];
  
  return borrowingRoutes.some(pattern => pattern.test(path));
}

/**
 * Check if route is for group joining
 * @param {string} path - Route path
 * @returns {boolean}
 */
function isGroupJoinRoute(path) {
  const groupJoinRoutes = [
    /^\/groups\/join/,
    /^\/groups\/[^/]+\/join/,
    /^\/groups\/invite\/accept/,
    /^\/groups\/new\/member/
  ];
  
  return groupJoinRoutes.some(pattern => pattern.test(path));
}

/**
 * Check warning restrictions
 * @param {Object} context - Route context
 * @param {Object} blacklistStatus - Blacklist status
 * @returns {Object} Restriction check
 */
function checkWarningRestrictions(context, blacklistStatus) {
  const { level, warnings } = blacklistStatus;
  
  // Level 1 warning: Can borrow up to 50% of normal limit
  if (level === 1 && isBorrowingRoute(context.path)) {
    return {
      allowed: false,
      reason: 'Warning level 1: Borrowing limit reduced by 50%',
      action: 'borrow',
      maxAmount: '50% of normal limit'
    };
  }
  
  // Level 2 warning: Cannot borrow above basic tier
  if (level === 2 && isBorrowingRoute(context.path)) {
    if (context.body?.amount > 1500) { // Basic tier max
      return {
        allowed: false,
        reason: 'Warning level 2: Limited to basic tier amounts',
        action: 'borrow',
        maxAmount: 1500
      };
    }
  }
  
  // Level 3 warning: Can only join 1 new group
  if (level === 3 && isGroupJoinRoute(context.path)) {
    const userGroups = getUserGroups();
    if (userGroups.length >= 1) { // Already in one group
      return {
        allowed: false,
        reason: 'Warning level 3: Can only join one group',
        action: 'join_group',
        maxGroups: 1
      };
    }
  }
  
  return { allowed: true };
}

/**
 * Check if user is attempting to clear blacklist
 * @param {Object} context - Route context
 * @returns {boolean}
 */
function isBlacklistClearAttempt(context) {
  return context.path.includes('/blacklist/clear') || 
         context.path.includes('/blacklist/remove') ||
         (context.path.includes('/blacklist') && context.method === 'DELETE');
}

/**
 * Show blacklist borrowing restriction
 * @param {Object} blacklistStatus - Blacklist status
 */
function showBlacklistBorrowingRestricted(blacklistStatus) {
  const {
    status,
    level,
    amountOwed,
    daysOverdue,
    lenderId,
    reason,
    blacklistedDate,
    canAppeal,
    appealDeadline
  } = blacklistStatus;
  
  const errorHtml = `
    <div class="blacklist-borrowing-restricted" style="
      max-width: 700px;
      margin: 60px auto;
      padding: 40px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      text-align: center;
    ">
      <div style="font-size: 64px; margin-bottom: 20px;">🚫</div>
      <h1 style="color: #dc3545; margin-bottom: 15px;">Borrowing Restricted</h1>
      <p style="color: #555; margin-bottom: 25px; line-height: 1.6; font-size: 18px;">
        Your account has been blacklisted due to overdue loans. 
        You cannot request new loans until the blacklist is cleared.
      </p>
      
      <div style="
        background: #fff5f5;
        border: 2px solid #dc3545;
        border-radius: 10px;
        padding: 25px;
        margin: 30px 0;
        text-align: left;
      ">
        <h3 style="color: #dc3545; margin-bottom: 20px; font-size: 20px;">Blacklist Details</h3>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; margin-bottom: 20px;">
          <div>
            <strong style="color: #666;">Amount Owed:</strong>
            <div style="color: #dc3545; font-size: 24px; font-weight: bold; margin-top: 5px;">
              ${formatCurrency(amountOwed, 'KES')}
            </div>
          </div>
          
          <div>
            <strong style="color: #666;">Days Overdue:</strong>
            <div style="color: #dc3545; font-size: 24px; font-weight: bold; margin-top: 5px;">
              ${daysOverdue} days
            </div>
          </div>
        </div>
        
        <div style="margin-top: 15px;">
          <strong style="color: #666;">Reason:</strong>
          <p style="color: #555; margin-top: 5px; padding: 10px; background: #f8f9fa; border-radius: 6px;">
            ${reason || DEFAULT_BLACKLIST_REASONS[level] || 'Loan default'}
          </p>
        </div>
        
        <div style="margin-top: 15px;">
          <strong style="color: #666;">Blacklisted Since:</strong>
          <p style="color: #555; margin-top: 5px;">${formatDate(blacklistedDate)}</p>
        </div>
        
        ${lenderId ? `
          <div style="margin-top: 15px;">
            <strong style="color: #666;">Blacklisted By:</strong>
            <p style="color: #555; margin-top: 5px;">Lender ID: ${lenderId}</p>
          </div>
        ` : ''}
      </div>
      
      <div style="
        background: #e8f5e8;
        border: 2px solid #28a745;
        border-radius: 10px;
        padding: 25px;
        margin: 30px 0;
        text-align: left;
      ">
        <h3 style="color: #28a745; margin-bottom: 15px; font-size: 20px;">How to Clear Blacklist</h3>
        
        <ol style="color: #555; padding-left: 20px; line-height: 1.8; font-size: 16px;">
          <li><strong>Repay in full:</strong> Pay the owed amount plus accumulated interest and penalties</li>
          <li><strong>Contact lender:</strong> Inform the lender who blacklisted you</li>
          <li><strong>Admin approval:</strong> Platform admin must verify and approve the clearance</li>
          <li><strong>Wait for processing:</strong> Clearance takes 24-48 hours after full payment</li>
        </ol>
        
        <div style="margin-top: 20px; padding: 15px; background: white; border-radius: 8px;">
          <h4 style="color: #003366; margin-bottom: 10px;">Total to Repay:</h4>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <div style="font-size: 28px; font-weight: bold; color: #003366;">
                ${formatCurrency(calculateTotalRepayment(blacklistStatus), 'KES')}
              </div>
              <div style="font-size: 14px; color: #666;">
                Includes principal, interest, and penalties
              </div>
            </div>
            <button onclick="window.location.href='/repayment/make?blacklist=${blacklistStatus.id}'" style="
              background: #28a745;
              color: white;
              border: none;
              padding: 12px 24px;
              border-radius: 8px;
              font-weight: 600;
              cursor: pointer;
            ">
              Make Payment
            </button>
          </div>
        </div>
      </div>
      
      ${canAppeal ? `
        <div style="
          background: #fff3cd;
          border: 2px solid #ffc107;
          border-radius: 10px;
          padding: 20px;
          margin: 25px 0;
        ">
          <h4 style="color: #856404; margin-bottom: 10px;">Appeal Available</h4>
          <p style="color: #856404; margin-bottom: 15px;">
            You can appeal this blacklist. Appeal deadline: ${formatDate(appealDeadline)}
          </p>
          <button onclick="window.location.href='/blacklist/appeal/${blacklistStatus.id}'" style="
            background: #ffc107;
            color: #856404;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            font-weight: 600;
            cursor: pointer;
          ">
            File Appeal
          </button>
        </div>
      ` : ''}
      
      <div style="display: flex; gap: 15px; justify-content: center; margin-top: 30px;">
        <button onclick="window.location.href='/blacklist/status'" style="
          background: #003366;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        ">
          View Blacklist Status
        </button>
        <button onclick="window.location.href='/lender/dashboard'" style="
          background: #f37021;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        ">
          Switch to Lending
        </button>
      </div>
      
      <div style="
        margin-top: 40px;
        padding-top: 20px;
        border-top: 1px solid #eee;
        font-size: 14px;
        color: #666;
      ">
        <p><strong>Note:</strong> Blacklist status is visible to all lenders in your groups.</p>
        <p>Clearing the blacklist restores your borrowing privileges and removes the blacklist badge.</p>
      </div>
    </div>
  `;
  
  document.body.innerHTML = errorHtml;
}

/**
 * Show blacklist group restriction
 * @param {Object} blacklistStatus - Blacklist status
 */
function showBlacklistGroupRestricted(blacklistStatus) {
  const errorHtml = `
    <div class="blacklist-group-restricted" style="
      max-width: 600px;
      margin: 60px auto;
      padding: 40px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      text-align: center;
    ">
      <div style="font-size: 64px; margin-bottom: 20px;">👥</div>
      <h2 style="color: #dc3545; margin-bottom: 15px;">Group Access Restricted</h2>
      <p style="color: #555; margin-bottom: 20px; line-height: 1.6;">
        Blacklisted users cannot join new groups. You must clear your blacklist before joining additional groups.
      </p>
      
      <div style="
        background: #fff5f5;
        border-left: 4px solid #dc3545;
        padding: 20px;
        margin: 25px 0;
        text-align: left;
        border-radius: 4px;
      ">
        <h4 style="color: #dc3545; margin-bottom: 10px;">Current Restrictions:</h4>
        <ul style="color: #555; padding-left: 20px;">
          <li>Cannot join new groups</li>
          <li>Existing group memberships remain active</li>
          <li>Cannot create new groups</li>
          <li>Group invitations will be automatically declined</li>
        </ul>
      </div>
      
      <div style="
        background: #e8f5e8;
        border-left: 4px solid #28a745;
        padding: 20px;
        margin: 25px 0;
        text-align: left;
        border-radius: 4px;
      ">
        <h4 style="color: #28a745; margin-bottom: 10px;">To Join New Groups:</h4>
        <ol style="color: #555; padding-left: 20px;">
          <li>Clear your blacklist by repaying all overdue amounts</li>
          <li>Wait for admin approval of blacklist clearance</li>
          <li>Your blacklist badge will be removed</li>
          <li>You can then accept group invitations</li>
        </ol>
      </div>
      
      <div style="display: flex; gap: 15px; justify-content: center; margin-top: 30px;">
        <button onclick="window.location.href='/blacklist/clear'" style="
          background: #28a745;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        ">
          Clear Blacklist
        </button>
        <button onclick="window.location.href='/groups/manage'" style="
          background: #003366;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        ">
          Manage Current Groups
        </button>
      </div>
    </div>
  `;
  
  document.body.innerHTML = errorHtml;
}

/**
 * Show warning restriction
 * @param {Object} blacklistStatus - Blacklist status
 * @param {Object} restriction - Restriction details
 */
function showWarningRestriction(blacklistStatus, restriction) {
  const warningHtml = `
    <div class="warning-restriction-modal" style="
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
      <h3 style="color: #856404; margin-bottom: 15px;">Warning Restriction</h3>
      <p style="color: #555; margin-bottom: 20px;">
        ${restriction.reason}
      </p>
      
      <div style="
        background: #fff3cd;
        padding: 15px;
        border-radius: 8px;
        margin: 20px 0;
        text-align: left;
      ">
        <h4 style="color: #856404; margin-bottom: 10px;">Your Warning Status:</h4>
        <ul style="color: #856404; padding-left: 20px; font-size: 14px;">
          <li>Level: ${blacklistStatus.level}</li>
          <li>Type: ${blacklistStatus.status}</li>
          <li>Issued: ${formatDate(blacklistStatus.issuedDate)}</li>
          ${blacklistStatus.expiryDate ? `<li>Expires: ${formatDate(blacklistStatus.expiryDate)}</li>` : ''}
        </ul>
      </div>
      
      <div style="display: flex; gap: 12px; justify-content: center; margin-top: 25px;">
        <button onclick="this.parentElement.parentElement.remove()" style="
          background: #856404;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          flex: 1;
        ">
          OK
        </button>
        <button onclick="window.location.href='/blacklist/improve'" style="
          background: #003366;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          flex: 1;
        ">
          Improve Rating
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
  
  overlay.innerHTML = warningHtml;
  document.body.appendChild(overlay);
}

/**
 * Show admin only error
 */
function showAdminOnlyError() {
  const errorHtml = `
    <div class="admin-only-error">
      <div class="error-icon">🔒</div>
      <h3>Admin Access Required</h3>
      <p>Only platform administrators can clear blacklist entries.</p>
      <div class="actions">
        <button onclick="window.history.back()" class="btn btn-primary">
          Go Back
        </button>
        <button onclick="window.location.href='/admin/login'" class="btn btn-outline">
          Admin Login
        </button>
      </div>
    </div>
  `;
  
  // Show as modal
  const modal = document.createElement('div');
  modal.className = 'admin-modal';
  modal.innerHTML = errorHtml;
  document.body.appendChild(modal);
}

/**
 * Show blacklist badge on user profile
 * @param {Object} blacklistStatus - Blacklist status
 */
function showBlacklistBadge(blacklistStatus) {
  const badgeColors = {
    'warning': { bg: '#fff3cd', text: '#856404', border: '#ffc107' },
    'blacklisted': { bg: '#dc3545', text: 'white', border: '#dc3545' },
    'pending': { bg: '#17a2b8', text: 'white', border: '#17a2b8' }
  };
  
  const colors = badgeColors[blacklistStatus.status] || badgeColors.warning;
  
  const badge = document.createElement('div');
  badge.className = 'blacklist-badge-guard';
  badge.innerHTML = `
    <span class="badge-icon">${blacklistStatus.status === 'blacklisted' ? '🚫' : '⚠️'}</span>
    <span class="badge-text">${blacklistStatus.status.toUpperCase()}</span>
    ${blacklistStatus.level ? `<span class="badge-level">Level ${blacklistStatus.level}</span>` : ''}
  `;
  
  badge.style.cssText = `
    position: fixed;
    top: 80px;
    right: 20px;
    background: ${colors.bg};
    color: ${colors.text};
    border: 2px solid ${colors.border};
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
    z-index: 9998;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    cursor: pointer;
  `;
  
  badge.onclick = () => {
    window.location.href = '/blacklist/status';
  };
  
  document.body.appendChild(badge);
}

/**
 * Calculate total repayment amount
 * @param {Object} blacklistStatus - Blacklist status
 * @returns {number} Total repayment amount
 */
function calculateTotalRepayment(blacklistStatus) {
  const { amountOwed, interestRate = 0.1, penaltyRate = 0.05, daysOverdue } = blacklistStatus;
  
  // Calculate interest
  const interest = amountOwed * interestRate;
  
  // Calculate penalties (5% daily after 7 days)
  let penalties = 0;
  if (daysOverdue > 7) {
    const penaltyDays = daysOverdue - 7;
    penalties = amountOwed * penaltyRate * penaltyDays;
  }
  
  return amountOwed + interest + penalties;
}

/**
 * Get user groups (mock function)
 * @returns {Array} User groups
 */
function getUserGroups() {
  return JSON.parse(localStorage.getItem('user_groups') || '[]');
}

/**
 * Check if user can be blacklisted
 * @param {string} userId - User ID
 * @param {Object} loanDetails - Loan details
 * @returns {Object} Check result
 */
export async function canBlacklistUser(userId, loanDetails) {
  // Check if user is already blacklisted
  const existingStatus = getUserBlacklistStatus(userId);
  if (existingStatus && existingStatus.status === 'blacklisted') {
    return {
      canBlacklist: false,
      reason: 'User already blacklisted',
      existingStatus
    };
  }
  
  // Check loan default period (2 months)
  const defaultPeriod = 60; // days
  const daysOverdue = loanDetails.daysOverdue || 0;
  
  if (daysOverdue < defaultPeriod) {
    return {
      canBlacklist: false,
      reason: `Loan must be overdue for at least ${defaultPeriod} days`,
      daysOverdue,
      requiredDays: defaultPeriod
    };
  }
  
  // Check if user has made any payments
  if (loanDetails.paymentsMade > 0) {
    return {
      canBlacklist: false,
      reason: 'User has made partial payments',
      paymentsMade: loanDetails.paymentsMade
    };
  }
  
  return {
    canBlacklist: true,
    userId,
    loanId: loanDetails.loanId,
    amountOwed: loanDetails.amountOwed,
    daysOverdue
  };
}

/**
 * Create blacklist entry
 * @param {Object} params - Blacklist parameters
 * @returns {Object} Blacklist entry
 */
export function createBlacklistEntry(params) {
  const {
    userId,
    lenderId,
    loanId,
    amountOwed,
    daysOverdue,
    reason,
    level = 1
  } = params;
  
  const blacklistId = `BL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  const entry = {
    id: blacklistId,
    userId,
    lenderId,
    loanId,
    status: 'blacklisted',
    level,
    amountOwed,
    daysOverdue,
    reason: reason || DEFAULT_BLACKLIST_REASONS[level] || 'Loan default',
    blacklistedDate: new Date().toISOString(),
    canAppeal: true,
    appealDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
    restrictions: {
      canBorrow: false,
      canJoinGroups: false,
      canCreateGroups: false,
      visibleToLenders: true
    },
    clearanceRequirements: {
      fullRepayment: true,
      adminApproval: true,
      lenderApproval: level <= 2
    }
  };
  
  // Save to localStorage (in real app, this would be API call)
  const blacklists = JSON.parse(localStorage.getItem('blacklists') || '[]');
  blacklists.push(entry);
  localStorage.setItem('blacklists', JSON.stringify(blacklists));
  
  // Log audit event
  logAuditEvent('BLACKLIST_CREATED', {
    blacklistId,
    userId,
    lenderId,
    amountOwed,
    daysOverdue,
    level
  });
  
  return entry;
}

/**
 * Clear blacklist entry
 * @param {string} blacklistId - Blacklist ID
 * @param {Object} clearanceDetails - Clearance details
 * @returns {Object} Clearance result
 */
export async function clearBlacklist(blacklistId, clearanceDetails) {
  const { clearedBy, clearedReason, repaymentAmount, isAdmin } = clearanceDetails;
  
  if (!isAdmin) {
    throw new Error('Only administrators can clear blacklists');
  }
  
  // Find blacklist entry
  const blacklists = JSON.parse(localStorage.getItem('blacklists') || '[]');
  const entryIndex = blacklists.findIndex(b => b.id === blacklistId);
  
  if (entryIndex === -1) {
    throw new Error('Blacklist entry not found');
  }
  
  const entry = blacklists[entryIndex];
  
  // Update entry
  entry.status = 'cleared';
  entry.clearedDate = new Date().toISOString();
  entry.clearedBy = clearedBy;
  entry.clearedReason = clearedReason;
  entry.repaymentAmount = repaymentAmount;
  
  blacklists[entryIndex] = entry;
  localStorage.setItem('blacklists', JSON.stringify(blacklists));
  
  // Log audit event
  logAuditEvent('BLACKLIST_CLEARED', {
    blacklistId,
    userId: entry.userId,
    clearedBy,
    repaymentAmount,
    originalAmount: entry.amountOwed
  });
  
  return {
    success: true,
    blacklistId,
    userId: entry.userId,
    clearedDate: entry.clearedDate,
    restrictionsRemoved: true
  };
}

/**
 * Get public blacklist (visible to lenders)
 * @param {string} country - Country code
 * @returns {Array} Public blacklist entries
 */
export function getPublicBlacklist(country) {
  const blacklists = JSON.parse(localStorage.getItem('blacklists') || '[]');
  
  return blacklists
    .filter(entry => 
      entry.status === 'blacklisted' && 
      entry.restrictions?.visibleToLenders !== false
    )
    .map(entry => ({
      userId: entry.userId,
      amountOwed: entry.amountOwed,
      daysOverdue: entry.daysOverdue,
      reason: entry.reason,
      blacklistedDate: entry.blacklistedDate,
      level: entry.level
    }));
}

/**
 * Initialize blacklist guard
 */
export function initializeBlacklistGuard() {
  console.log('🚫 Blacklist Guard: Initializing blacklist rules...');
  
  // Monitor for blacklist-related actions
  setupBlacklistMonitoring();
  
  // Add blacklist helpers to window
  window.MPesewaBlacklist = {
    canBlacklistUser,
    createBlacklistEntry,
    clearBlacklist,
    getPublicBlacklist,
    calculateTotalRepayment
  };
  
  console.log('✅ Blacklist Guard: Initialized successfully');
}

/**
 * Setup blacklist monitoring
 */
function setupBlacklistMonitoring() {
  // Check blacklist status on page load
  document.addEventListener('DOMContentLoaded', () => {
    const user = getCurrentUser();
    if (user) {
      const blacklistStatus = getUserBlacklistStatus();
      if (blacklistStatus && blacklistStatus.status !== 'clear') {
        console.log('Blacklist status detected on page load');
        showBlacklistBadge(blacklistStatus);
      }
    }
  });
  
  // Listen for blacklist updates
  document.addEventListener('blacklist:updated', (e) => {
    console.log('Blacklist updated:', e.detail);
    // Refresh blacklist badge
    const blacklistStatus = getUserBlacklistStatus();
    if (blacklistStatus) {
      updateBlacklistBadge(blacklistStatus);
    }
  });
}

/**
 * Update blacklist badge
 * @param {Object} blacklistStatus - Blacklist status
 */
function updateBlacklistBadge(blacklistStatus) {
  const existingBadge = document.querySelector('.blacklist-badge-guard');
  if (existingBadge) {
    existingBadge.remove();
  }
  
  if (blacklistStatus.status !== 'clear') {
    showBlacklistBadge(blacklistStatus);
  }
}

export default blacklistGuard;