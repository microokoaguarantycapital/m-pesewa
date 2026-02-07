/**
 * M-PESEWA Group Guard
 * Enforces group isolation rules per Section A
 * Groups are invitation-only, country-locked, and have member limits
 */

import { getCurrentUser, getUserGroups, getGroupDetails } from '../state/store.js';
import { navigateTo } from './router.js';
import { logAuditEvent } from '../audit/audit-log.js';
import { validateGroupMembership } from '../groups/group.validation.js';
import { MAX_GROUPS_PER_USER, MIN_GROUP_MEMBERS, MAX_GROUP_MEMBERS } from '../core/constants.js';

/**
 * Group Guard - Enforces group access rules
 * @param {Object} context - Route context
 * @param {Function} next - Next middleware function
 * @returns {Promise<void>}
 */
export const groupGuard = async (context, next) => {
  try {
    console.log('👥 Group Guard: Checking group access rules...');
    
    const user = getCurrentUser();
    if (!user) {
      console.log('Group Guard: No user logged in, proceeding...');
      return await next();
    }
    
    // Extract group ID from route
    const groupId = extractGroupIdFromRoute(context.path);
    const userGroups = getUserGroups();
    
    console.log(`Group Guard: Route Group = ${groupId}, User Groups = ${userGroups.length}`);
    
    // STRICT RULE: Group-specific routes require group ID
    if (isGroupSpecificRoute(context.path) && !groupId) {
      console.error('❌ Group Guard: Group-specific route without group ID');
      navigateTo('/groups/select');
      return;
    }
    
    // STRICT RULE: User must be in group to access group resources
    if (groupId && !userGroups.includes(groupId)) {
      console.error(`❌ Group Guard: User not member of group ${groupId}`);
      
      logAuditEvent('GROUP_ACCESS_VIOLATION', {
        userId: user.id,
        groupId: groupId,
        route: context.path,
        userGroups: userGroups,
        attemptTime: new Date().toISOString()
      });
      
      showGroupAccessDenied(groupId);
      return;
    }
    
    // STRICT RULE: Check group invitation status
    if (groupId) {
      const groupDetails = await getGroupDetails(groupId);
      
      if (!groupDetails) {
        console.error(`❌ Group Guard: Group ${groupId} not found`);
        navigateTo('/groups/not-found');
        return;
      }
      
      // Check if group is active
      if (groupDetails.status !== 'active') {
        console.warn(`❌ Group Guard: Group ${groupId} is ${groupDetails.status}`);
        showGroupInactiveError(groupDetails);
        return;
      }
      
      // Check if user's membership is active
      const membership = groupDetails.members?.find(m => m.userId === user.id);
      if (membership && membership.status !== 'active') {
        console.warn(`❌ Group Guard: User membership is ${membership.status}`);
        showMembershipInactiveError(membership);
        return;
      }
      
      // Add group context to route
      context.group = groupDetails;
      context.groupId = groupId;
      context.userRoleInGroup = membership?.role || 'member';
    }
    
    // STRICT RULE: Enforce maximum groups per user
    if (isGroupCreationRoute(context.path)) {
      if (userGroups.length >= MAX_GROUPS_PER_USER) {
        console.error(`❌ Group Guard: User already in ${userGroups.length} groups (max: ${MAX_GROUPS_PER_USER})`);
        showMaxGroupsError();
        return;
      }
    }
    
    // STRICT RULE: Validate group operations
    if (context.method === 'POST' && context.body) {
      const validation = validateGroupOperation(context, user);
      if (!validation.valid) {
        console.error(`❌ Group Guard: Operation validation failed:`, validation.errors);
        showOperationError(validation.errors);
        return;
      }
    }
    
    console.log(`✅ Group Guard: Access granted for groups`);
    await next();
    
  } catch (error) {
    console.error('Group Guard Error:', error);
    
    logAuditEvent('GROUP_GUARD_FAILURE', {
      error: error.message,
      route: context?.path,
      userId: getCurrentUser()?.id,
      timestamp: new Date().toISOString()
    });
    
    navigateTo('/error/group-access');
  }
};

/**
 * Extract group ID from route
 * @param {string} path - Route path
 * @returns {string|null} Group ID or null
 */
function extractGroupIdFromRoute(path) {
  // Pattern: /groups/{groupId}/... or /group/{groupId}/...
  const patterns = [
    /\/groups\/([a-zA-Z0-9_-]+)/,
    /\/group\/([a-zA-Z0-9_-]+)/,
    /\/lender\/dashboard\?group=([a-zA-Z0-9_-]+)/,
    /\/borrower\/apply\?group=([a-zA-Z0-9_-]+)/
  ];
  
  for (const pattern of patterns) {
    const match = path.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
}

/**
 * Check if route is group-specific
 * @param {string} path - Route path
 * @returns {boolean}
 */
function isGroupSpecificRoute(path) {
  const groupRoutes = [
    /^\/groups\/[^/]+\//,
    /^\/group\/[^/]+\//,
    /^\/lender\/dashboard\?group=/,
    /^\/borrower\/dashboard\?group=/,
    /^\/ledger\/[^/]+\//,
    /^\/members\/[^/]+\//,
    /^\/group-admin\//
  ];
  
  return groupRoutes.some(pattern => pattern.test(path));
}

/**
 * Check if route is for group creation
 * @param {string} path - Route path
 * @returns {boolean}
 */
function isGroupCreationRoute(path) {
  return path.includes('/groups/create') || path.includes('/groups/new');
}

/**
 * Validate group operation
 * @param {Object} context - Route context
 * @param {Object} user - Current user
 * @returns {Object} Validation result
 */
function validateGroupOperation(context, user) {
  const errors = [];
  const { body, path } = context;
  
  // Group creation validation
  if (path.includes('/groups/create')) {
    // Check minimum members
    if (body.initialMembers && body.initialMembers.length < MIN_GROUP_MEMBERS) {
      errors.push(`Minimum ${MIN_GROUP_MEMBERS} members required to start a group`);
    }
    
    // Check maximum members
    if (body.initialMembers && body.initialMembers.length > MAX_GROUP_MEMBERS) {
      errors.push(`Maximum ${MAX_GROUP_MEMBERS} members allowed per group`);
    }
    
    // Check country consistency
    if (body.country && body.initialMembers) {
      for (const member of body.initialMembers) {
        if (member.country && member.country !== body.country) {
          errors.push(`All members must be from the same country: ${body.country}`);
          break;
        }
      }
    }
  }
  
  // Member invitation validation
  if (path.includes('/groups/invite')) {
    const userGroups = getUserGroups();
    
    // Check if user can invite (must be admin or have permission)
    if (!userGroups.includes(body.groupId)) {
      errors.push('You must be a member of the group to invite others');
    }
    
    // Check invitation limits
    if (body.invitees && body.invitees.length > 10) {
      errors.push('Maximum 10 invitations at once');
    }
  }
  
  // Group join validation
  if (path.includes('/groups/join')) {
    // Check if user already in maximum groups
    if (getUserGroups().length >= MAX_GROUPS_PER_USER) {
      errors.push(`You can only join ${MAX_GROUPS_PER_USER} groups maximum`);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Show group access denied error
 * @param {string} groupId - Group ID
 */
function showGroupAccessDenied(groupId) {
  const errorHtml = `
    <div class="group-access-denied" style="
      max-width: 600px;
      margin: 60px auto;
      padding: 40px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      text-align: center;
    ">
      <div style="font-size: 64px; margin-bottom: 20px;">🚫</div>
      <h2 style="color: #003366; margin-bottom: 15px;">Group Access Restricted</h2>
      <p style="color: #555; margin-bottom: 20px; line-height: 1.6;">
        You are not a member of this group. Groups are invitation-only trusted circles where members know each other personally.
      </p>
      
      <div style="
        background: #f8f9fa;
        padding: 20px;
        border-radius: 8px;
        margin: 25px 0;
        text-align: left;
      ">
        <h4 style="color: #003366; margin-bottom: 12px;">How Groups Work:</h4>
        <ul style="color: #555; padding-left: 20px; line-height: 1.8;">
          <li><strong>Invitation-Only:</strong> You must be invited by an existing member</li>
          <li><strong>Country-Locked:</strong> Groups contain members from the same country only</li>
          <li><strong>Trust-Based:</strong> Members vouch for each other's credibility</li>
          <li><strong>Maximum 4 Groups:</strong> You can belong to up to 4 groups at once</li>
          <li><strong>Good Rating Required:</strong> Good repayment history needed for new groups</li>
        </ul>
      </div>
      
      <div style="display: flex; gap: 15px; justify-content: center; margin-top: 30px;">
        <button onclick="window.location.href='/groups'" style="
          background: #003366;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        ">
          Browse Available Groups
        </button>
        <button onclick="window.location.href='/groups/create'" style="
          background: #28a745;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        ">
          Start Your Own Group
        </button>
      </div>
      
      <div style="
        margin-top: 30px;
        padding-top: 20px;
        border-top: 1px solid #eee;
        font-size: 14px;
        color: #666;
      ">
        <p><strong>Note:</strong> Group ID: ${groupId}</p>
        <p>To join this group, ask a member to send you an invitation link.</p>
      </div>
    </div>
  `;
  
  document.body.innerHTML = errorHtml;
}

/**
 * Show group inactive error
 * @param {Object} groupDetails - Group details
 */
function showGroupInactiveError(groupDetails) {
  const statusMessages = {
    'pending': 'This group is pending approval',
    'suspended': 'This group has been suspended',
    'closed': 'This group is closed to new members',
    'full': 'This group has reached maximum capacity'
  };
  
  const message = statusMessages[groupDetails.status] || 'This group is not active';
  
  const errorHtml = `
    <div class="group-inactive-error">
      <div class="status-icon">⏸️</div>
      <h2>Group Not Available</h2>
      <p>${message}</p>
      <div class="group-info">
        <h3>${groupDetails.name}</h3>
        <p>Status: <span class="status-badge ${groupDetails.status}">${groupDetails.status}</span></p>
        <p>Members: ${groupDetails.memberCount || 0}</p>
      </div>
      <div class="actions">
        <button onclick="window.location.href='/groups'" class="btn btn-primary">
          Find Other Groups
        </button>
      </div>
    </div>
  `;
  
  // Show modal
  const modal = document.createElement('div');
  modal.className = 'group-status-modal';
  modal.innerHTML = errorHtml;
  document.body.appendChild(modal);
}

/**
 * Show membership inactive error
 * @param {Object} membership - Membership details
 */
function showMembershipInactiveError(membership) {
  const statusMessages = {
    'pending': 'Your membership is pending approval',
    'suspended': 'Your membership has been suspended',
    'banned': 'You have been removed from this group',
    'invited': 'You need to accept the invitation'
  };
  
  const message = statusMessages[membership.status] || 'Your membership is not active';
  
  const errorHtml = `
    <div class="membership-error">
      <h3>Membership Status</h3>
      <p>${message}</p>
      <div class="status-details">
        <p>Status: <strong>${membership.status}</strong></p>
        ${membership.reason ? `<p>Reason: ${membership.reason}</p>` : ''}
      </div>
      <div class="actions">
        <button onclick="window.location.href='/groups'" class="btn btn-outline">
          View Groups
        </button>
      </div>
    </div>
  `;
  
  alert(message); // Simple alert for now
}

/**
 * Show maximum groups error
 */
function showMaxGroupsError() {
  const errorHtml = `
    <div class="max-groups-error" style="
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
      <div style="font-size: 48px; margin-bottom: 20px;">🎯</div>
      <h2 style="color: #003366; margin-bottom: 15px;">Maximum Groups Reached</h2>
      <p style="color: #555; margin-bottom: 20px; line-height: 1.6;">
        You are already a member of <strong>${MAX_GROUPS_PER_USER} groups</strong>. 
        To maintain trust quality and prevent over-exposure, members can only join up to 4 groups.
      </p>
      
      <div style="
        background: #f8f9fa;
        padding: 15px;
        border-radius: 8px;
        margin: 20px 0;
        text-align: left;
      ">
        <h4 style="color: #003366; margin-bottom: 10px; font-size: 16px;">Why This Limit?</h4>
        <ul style="color: #555; padding-left: 20px; font-size: 14px;">
          <li>Builds deeper trust within fewer groups</li>
          <li>Prevents spreading risk too thin</li>
          <li>Maintains strong community bonds</li>
          <li>Ensures quality over quantity</li>
        </ul>
      </div>
      
      <div style="display: flex; gap: 12px; justify-content: center; margin-top: 25px;">
        <button onclick="this.parentElement.parentElement.remove()" style="
          background: #003366;
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
        <button onclick="window.location.href='/groups/manage'" style="
          background: white;
          color: #003366;
          border: 2px solid #003366;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          flex: 1;
        ">
          Manage Groups
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
 * Show operation error
 * @param {Array<string>} errors - Error messages
 */
function showOperationError(errors) {
  const errorList = errors.map(error => `<li>${error}</li>`).join('');
  
  const errorHtml = `
    <div class="operation-error-modal">
      <div class="error-header">
        <h3>Operation Failed</h3>
      </div>
      <div class="error-body">
        <p>The following issues were found:</p>
        <ul>${errorList}</ul>
      </div>
      <div class="error-footer">
        <button onclick="this.closest('.operation-error-modal').remove()" class="btn btn-primary">
          OK
        </button>
      </div>
    </div>
  `;
  
  // Show as toast notification
  showToast(errors[0], 'error');
}

/**
 * Show toast notification
 * @param {string} message - Message to show
 * @param {string} type - Notification type
 */
function showToast(message, type = 'error') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'error' ? '#dc3545' : '#28a745'};
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 10000;
    animation: slideIn 0.3s ease;
  `;
  
  document.body.appendChild(toast);
  
  // Remove after 5 seconds
  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 5000);
}

/**
 * Check if user can join another group
 * @param {string} userId - User ID
 * @returns {Object} Check result
 */
export async function canJoinGroup(userId) {
  const userGroups = getUserGroups();
  
  if (userGroups.length >= MAX_GROUPS_PER_USER) {
    return {
      canJoin: false,
      reason: `Maximum ${MAX_GROUPS_PER_USER} groups allowed`,
      currentGroups: userGroups.length,
      maxGroups: MAX_GROUPS_PER_USER
    };
  }
  
  // Check user's rating (must be good to join new groups)
  const userRating = await getUserRating(userId);
  if (userRating < 3.5) { // 5-star system
    return {
      canJoin: false,
      reason: 'Good rating required to join new groups',
      currentRating: userRating,
      requiredRating: 3.5
    };
  }
  
  return {
    canJoin: true,
    currentGroups: userGroups.length,
    maxGroups: MAX_GROUPS_PER_USER
  };
}

/**
 * Get user rating
 * @param {string} userId - User ID
 * @returns {Promise<number>} Rating
 */
async function getUserRating(userId) {
  // This would typically come from backend
  return 4.2; // Mock rating
}

/**
 * Check if user can invite to group
 * @param {string} userId - User ID
 * @param {string} groupId - Group ID
 * @returns {Object} Check result
 */
export async function canInviteToGroup(userId, groupId) {
  const groupDetails = await getGroupDetails(groupId);
  if (!groupDetails) {
    return {
      canInvite: false,
      reason: 'Group not found'
    };
  }
  
  // Check if user is group admin
  const membership = groupDetails.members?.find(m => m.userId === userId);
  if (!membership) {
    return {
      canInvite: false,
      reason: 'Not a group member'
    };
  }
  
  if (membership.role !== 'admin' && membership.role !== 'founder') {
    return {
      canInvite: false,
      reason: 'Only group admins can invite members'
    };
  }
  
  // Check group capacity
  if (groupDetails.memberCount >= MAX_GROUP_MEMBERS) {
    return {
      canInvite: false,
      reason: `Group has reached maximum capacity (${MAX_GROUP_MEMBERS})`
    };
  }
  
  return {
    canInvite: true,
    userRole: membership.role,
    currentMembers: groupDetails.memberCount,
    maxMembers: MAX_GROUP_MEMBERS
  };
}

/**
 * Initialize group guard
 */
export function initializeGroupGuard() {
  console.log('👥 Group Guard: Initializing group access rules...');
  
  // Monitor group-related operations
  setupGroupOperationMonitoring();
  
  // Add group context to window
  window.MPesewaGroups = {
    getUserGroups,
    canJoinGroup,
    canInviteToGroup
  };
  
  console.log('✅ Group Guard: Initialized successfully');
}

/**
 * Setup monitoring for group operations
 */
function setupGroupOperationMonitoring() {
  // Listen for group-related events
  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-group-action]')) {
      const action = e.target.closest('[data-group-action]').dataset.groupAction;
      console.log(`Group action detected: ${action}`);
    }
  });
  
  // Intercept form submissions
  document.addEventListener('submit', (e) => {
    if (e.target.closest('form[data-group-form]')) {
      console.log('Group form submission intercepted');
      // Additional validation could be added here
    }
  });
}

export default groupGuard;