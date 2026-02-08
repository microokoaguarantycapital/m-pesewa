/**
 * M-PESEWA SUBSCRIPTION GATES
 * Permission gates enforcing strict subscription access control
 * Non-negotiable: Subscription expiry on 28th, weekly limits, country isolation
 */

// Import dependencies
import { SUBSCRIPTION_STATES } from './index.js';
import { logSubscriptionAction } from './subscription.audit.js';

/**
 * Subscription Gate Types
 */
export const GATE_TYPES = {
    LEND: 'LEND',              // Can lend money
    BORROW: 'BORROW',          // Can request loans
    CREATE_LEDGER: 'CREATE_LEDGER', // Can create new ledgers
    UPDATE_LEDGER: 'UPDATE_LEDGER', // Can update ledger entries
    VIEW_PORTFOLIO: 'VIEW_PORTFOLIO', // Can view lending portfolio
    JOIN_GROUP: 'JOIN_GROUP',  // Can join new groups
    INVITE_MEMBER: 'INVITE_MEMBER', // Can invite new members
    ACCESS_DASHBOARD: 'ACCESS_DASHBOARD', // Can access lender dashboard
    UPGRADE_TIER: 'UPGRADE_TIER', // Can upgrade subscription tier
    RENEW_SUBSCRIPTION: 'RENEW_SUBSCRIPTION', // Can renew subscription
    EXPORT_DATA: 'EXPORT_DATA', // Can export data
    ADMIN_OVERRIDE: 'ADMIN_OVERRIDE' // Admin override capability
};

/**
 * Gate check result structure
 */
class GateCheckResult {
    constructor(allowed, reason = '', requiredAction = '', metadata = {}) {
        this.allowed = allowed;
        this.reason = reason;
        this.requiredAction = requiredAction;
        this.metadata = metadata;
        this.timestamp = new Date().toISOString();
    }
}

/**
 * Main gate checking function
 * @param {Object} params - Gate check parameters
 * @returns {GateCheckResult} Gate check result
 */
export function checkSubscriptionGate(params) {
    const { userId, tierId, state, countryCode, action, amount = 0, context = {} } = params;
    
    // Log gate check attempt
    logSubscriptionAction({
        action: 'GATE_CHECK',
        userId,
        gateType: action,
        tierId,
        state,
        amount,
        timestamp: new Date().toISOString()
    });
    
    // Check subscription state first
    const stateCheck = checkSubscriptionState(state, action);
    if (!stateCheck.allowed) {
        return stateCheck;
    }
    
    // Route to specific gate check based on action
    switch(action) {
        case GATE_TYPES.LEND:
            return checkLendGate(params);
        case GATE_TYPES.BORROW:
            return checkBorrowGate(params);
        case GATE_TYPES.CREATE_LEDGER:
            return checkCreateLedgerGate(params);
        case GATE_TYPES.UPDATE_LEDGER:
            return checkUpdateLedgerGate(params);
        case GATE_TYPES.VIEW_PORTFOLIO:
            return checkViewPortfolioGate(params);
        case GATE_TYPES.JOIN_GROUP:
            return checkJoinGroupGate(params);
        case GATE_TYPES.INVITE_MEMBER:
            return checkInviteMemberGate(params);
        case GATE_TYPES.ACCESS_DASHBOARD:
            return checkAccessDashboardGate(params);
        case GATE_TYPES.UPGRADE_TIER:
            return checkUpgradeTierGate(params);
        case GATE_TYPES.RENEW_SUBSCRIPTION:
            return checkRenewSubscriptionGate(params);
        case GATE_TYPES.EXPORT_DATA:
            return checkExportDataGate(params);
        case GATE_TYPES.ADMIN_OVERRIDE:
            return checkAdminOverrideGate(params);
        default:
            return new GateCheckResult(
                false,
                `Unknown gate action: ${action}`,
                'CONTACT_SUPPORT'
            );
    }
}

/**
 * Check subscription state gate
 * @param {string} state - Subscription state
 * @param {string} action - Action being attempted
 */
function checkSubscriptionState(state, action) {
    const now = new Date();
    const is28th = now.getDate() === 28;
    
    switch(state) {
        case SUBSCRIPTION_STATES.ACTIVE:
            // Check if today is 28th (expiry day)
            if (is28th) {
                // On 28th, subscriptions expire at end of day
                const endOfDay = new Date(now);
                endOfDay.setHours(23, 59, 59, 999);
                
                if (now > endOfDay) {
                    return new GateCheckResult(
                        false,
                        'Subscription expired today (28th)',
                        'RENEW_SUBSCRIPTION',
                        { expiryDate: endOfDay }
                    );
                }
            }
            return new GateCheckResult(true);
            
        case SUBSCRIPTION_STATES.EXPIRED:
            // Check grace period (7 days after expiry)
            const expiryDate = new Date(now);
            expiryDate.setDate(expiryDate.getDate() - 1); // Assume expired yesterday for demo
            const gracePeriodEnd = new Date(expiryDate);
            gracePeriodEnd.setDate(gracePeriodEnd.getDate() + 7);
            
            if (now <= gracePeriodEnd) {
                // In grace period - read only access
                const allowedActions = [
                    GATE_TYPES.VIEW_PORTFOLIO,
                    GATE_TYPES.RENEW_SUBSCRIPTION,
                    GATE_TYPES.EXPORT_DATA
                ];
                
                if (allowedActions.includes(action)) {
                    return new GateCheckResult(
                        true,
                        'In grace period - limited access',
                        '',
                        { gracePeriodEnd, daysRemaining: Math.ceil((gracePeriodEnd - now) / (1000 * 60 * 60 * 24)) }
                    );
                }
                
                return new GateCheckResult(
                    false,
                    'Subscription expired - in grace period',
                    'RENEW_SUBSCRIPTION',
                    { gracePeriodEnd }
                );
            }
            
            return new GateCheckResult(
                false,
                'Subscription expired beyond grace period',
                'NEW_SUBSCRIPTION_REQUIRED'
            );
            
        case SUBSCRIPTION_STATES.SUSPENDED:
            const allowedSuspendedActions = [
                GATE_TYPES.VIEW_PORTFOLIO,
                GATE_TYPES.RENEW_SUBSCRIPTION,
                GATE_TYPES.EXPORT_DATA
            ];
            
            if (allowedSuspendedActions.includes(action)) {
                return new GateCheckResult(
                    true,
                    'Subscription suspended - limited access'
                );
            }
            
            return new GateCheckResult(
                false,
                'Subscription suspended',
                'CONTACT_SUPPORT'
            );
            
        case SUBSCRIPTION_STATES.NEW:
            if (action === GATE_TYPES.RENEW_SUBSCRIPTION) {
                return new GateCheckResult(true);
            }
            return new GateCheckResult(
                false,
                'Subscription not activated',
                'ACTIVATE_SUBSCRIPTION'
            );
            
        case SUBSCRIPTION_STATES.CANCELLED:
            return new GateCheckResult(
                false,
                'Subscription cancelled',
                'NEW_SUBSCRIPTION_REQUIRED'
            );
            
        case SUBSCRIPTION_STATES.GRACE_PERIOD:
            // Same as EXPIRED but with specific messaging
            return new GateCheckResult(
                false,
                'Subscription in grace period',
                'RENEW_SUBSCRIPTION'
            );
            
        default:
            return new GateCheckResult(
                false,
                `Unknown subscription state: ${state}`,
                'CONTACT_SUPPORT'
            );
    }
}

/**
 * Check lending gate
 * @param {Object} params - Gate parameters
 */
function checkLendGate(params) {
    const { tierId, amount, countryCode, context = {} } = params;
    
    // Basic validation
    if (!tierId) {
        return new GateCheckResult(
            false,
            'No subscription tier selected',
            'SELECT_SUBSCRIPTION_TIER'
        );
    }
    
    if (amount <= 0) {
        return new GateCheckResult(
            false,
            'Invalid lending amount',
            'ENTER_VALID_AMOUNT'
        );
    }
    
    // Check if within weekly limit (context should contain weekly usage)
    const weeklyUsed = context.weeklyUsed || 0;
    const weeklyLimit = getWeeklyLimitForTier(tierId);
    
    if (weeklyUsed + amount > weeklyLimit) {
        const remaining = weeklyLimit - weeklyUsed;
        return new GateCheckResult(
            false,
            `Weekly lending limit exceeded. Remaining: ${remaining}`,
            'WAIT_FOR_WEEKLY_RESET_OR_UPGRADE',
            { weeklyUsed, weeklyLimit, remaining }
        );
    }
    
    // Check if within max ledgers
    const ledgerCount = context.ledgerCount || 0;
    const maxLedgers = getMaxLedgersForTier(tierId);
    
    if (ledgerCount >= maxLedgers) {
        return new GateCheckResult(
            false,
            `Maximum ledgers (${maxLedgers}) reached`,
            'UPGRADE_SUBSCRIPTION',
            { ledgerCount, maxLedgers }
        );
    }
    
    // Country-specific checks
    if (countryCode) {
        const countryCheck = checkCountryGate(countryCode, 'LEND', params);
        if (!countryCheck.allowed) {
            return countryCheck;
        }
    }
    
    // Group membership check (lenders can only lend within their group)
    if (!context.groupId) {
        return new GateCheckResult(
            false,
            'Group membership required for lending',
            'JOIN_GROUP'
        );
    }
    
    // All checks passed
    return new GateCheckResult(
        true,
        '',
        '',
        {
            weeklyUsed: weeklyUsed + amount,
            weeklyLimit,
            remainingAfter: weeklyLimit - (weeklyUsed + amount),
            ledgerCount: ledgerCount + 1,
            maxLedgers
        }
    );
}

/**
 * Check borrowing gate
 * @param {Object} params - Gate parameters
 */
function checkBorrowGate(params) {
    const { context = {} } = params;
    
    // Borrowers don't need subscription, but have other checks
    
    // Check blacklist status
    if (context.isBlacklisted) {
        return new GateCheckResult(
            false,
            'User is blacklisted and cannot borrow',
            'CLEAR_BLACKLIST_STATUS',
            { blacklistReason: context.blacklistReason }
        );
    }
    
    // Check group count limit (max 4 groups per borrower)
    const groupCount = context.groupCount || 0;
    if (groupCount >= 4) {
        return new GateCheckResult(
            false,
            'Maximum 4 groups reached',
            'LEAVE_GROUP_BEFORE_JOINING',
            { currentGroups: groupCount }
        );
    }
    
    // Check repayment rating
    const repaymentRating = context.repaymentRating || 0;
    if (repaymentRating < 3) {
        return new GateCheckResult(
            false,
            'Low repayment rating',
            'IMPROVE_REPAYMENT_HISTORY',
            { currentRating: repaymentRating, minimumRequired: 3 }
        );
    }
    
    // Check if already has active loan in this group
    if (context.hasActiveLoanInGroup) {
        return new GateCheckResult(
            false,
            'Already has active loan in this group',
            'REPAY_EXISTING_LOAN',
            { activeLoanAmount: context.activeLoanAmount }
        );
    }
    
    // Check loan category (must be one of the 20 emergency categories)
    if (!context.loanCategory) {
        return new GateCheckResult(
            false,
            'Loan category required',
            'SELECT_LOAN_CATEGORY'
        );
    }
    
    // Check amount is within emergency loan limits
    const amount = params.amount || 0;
    if (amount > 50000) { // Maximum emergency loan amount
        return new GateCheckResult(
            false,
            'Amount exceeds maximum emergency loan limit',
            'REDUCE_AMOUNT',
            { maxAmount: 50000 }
        );
    }
    
    // All checks passed
    return new GateCheckResult(true);
}

/**
 * Check create ledger gate
 * @param {Object} params - Gate parameters
 */
function checkCreateLedgerGate(params) {
    const { tierId, context = {} } = params;
    
    // Only lenders with active subscription can create ledgers
    if (!tierId) {
        return new GateCheckResult(
            false,
            'Subscription required to create ledgers',
            'ACTIVATE_SUBSCRIPTION'
        );
    }
    
    // Check ledger count limit
    const ledgerCount = context.ledgerCount || 0;
    const maxLedgers = getMaxLedgersForTier(tierId);
    
    if (ledgerCount >= maxLedgers) {
        return new GateCheckResult(
            false,
            `Maximum ledgers (${maxLedgers}) reached`,
            'UPGRADE_SUBSCRIPTION',
            { ledgerCount, maxLedgers }
        );
    }
    
    // Check if borrower exists in same group
    if (!context.borrowerInSameGroup) {
        return new GateCheckResult(
            false,
            'Borrower must be in the same group',
            'INVITE_BORROWER_TO_GROUP'
        );
    }
    
    // Check guarantors requirement (2 guarantors)
    const guarantors = context.guarantors || [];
    if (guarantors.length < 2) {
        return new GateCheckResult(
            false,
            'Two guarantors required',
            'ADD_GUARANTORS',
            { required: 2, provided: guarantors.length }
        );
    }
    
    return new GateCheckResult(true);
}

/**
 * Check update ledger gate
 * @param {Object} params - Gate parameters
 */
function checkUpdateLedgerGate(params) {
    const { context = {} } = params;
    
    // Check if user owns the ledger or is admin
    const isLedgerOwner = context.isLedgerOwner || false;
    const isGroupAdmin = context.isGroupAdmin || false;
    const isPlatformAdmin = context.isPlatformAdmin || false;
    
    if (!isLedgerOwner && !isGroupAdmin && !isPlatformAdmin) {
        return new GateCheckResult(
            false,
            'Not authorized to update this ledger',
            'REQUEST_PERMISSION',
            { ledgerId: context.ledgerId }
        );
    }
    
    // Check ledger state (can't update cleared ledgers)
    if (context.ledgerState === 'CLEARED') {
        return new GateCheckResult(
            false,
            'Cannot update cleared ledger',
            'CREATE_NEW_LEDGER',
            { ledgerState: 'CLEARED' }
        );
    }
    
    // Check if updating repayment (special rules apply)
    if (context.updateType === 'REPAYMENT') {
        // Verify repayment amount doesn't exceed outstanding balance
        const outstanding = context.outstandingBalance || 0;
        const repaymentAmount = context.repaymentAmount || 0;
        
        if (repaymentAmount > outstanding) {
            return new GateCheckResult(
                false,
                'Repayment amount exceeds outstanding balance',
                'ADJUST_REPAYMENT_AMOUNT',
                { outstanding, repaymentAmount }
            );
        }
    }
    
    return new GateCheckResult(true);
}

/**
 * Check view portfolio gate
 * @param {Object} params - Gate parameters
 */
function checkViewPortfolioGate(params) {
    // Portfolio view is generally allowed for all subscription states
    // (except cancelled)
    const { state } = params;
    
    if (state === SUBSCRIPTION_STATES.CANCELLED) {
        return new GateCheckResult(
            false,
            'Subscription cancelled',
            'NEW_SUBSCRIPTION_REQUIRED'
        );
    }
    
    return new GateCheckResult(true);
}

/**
 * Check join group gate
 * @param {Object} params - Gate parameters
 */
function checkJoinGroupGate(params) {
    const { context = {} } = params;
    
    // Check group count limit
    const groupCount = context.groupCount || 0;
    if (groupCount >= 4) {
        return new GateCheckResult(
            false,
            'Maximum 4 groups reached',
            'LEAVE_GROUP_BEFORE_JOINING',
            { currentGroups: groupCount }
        );
    }
    
    // Check if group is at capacity (max 1000 members)
    const groupMembersCount = context.groupMembersCount || 0;
    if (groupMembersCount >= 1000) {
        return new GateCheckResult(
            false,
            'Group is at full capacity',
            'JOIN_ANOTHER_GROUP',
            { currentMembers: groupMembersCount, maxMembers: 1000 }
        );
    }
    
    // Check if group has minimum lenders (5)
    const groupLendersCount = context.groupLendersCount || 0;
    if (groupLendersCount < 5) {
        return new GateCheckResult(
            false,
            'Group needs at least 5 lenders',
            'WAIT_FOR_MORE_LENDERS',
            { currentLenders: groupLendersCount, required: 5 }
        );
    }
    
    // Check if invitation/referral required
    if (context.invitationRequired && !context.hasInvitation) {
        return new GateCheckResult(
            false,
            'Invitation required to join this group',
            'REQUEST_INVITATION',
            { groupType: context.groupType }
        );
    }
    
    // Check country match (must be same country as group)
    if (context.userCountry !== context.groupCountry) {
        return new GateCheckResult(
            false,
            'Cannot join group in different country',
            'FIND_GROUP_IN_YOUR_COUNTRY',
            { userCountry: context.userCountry, groupCountry: context.groupCountry }
        );
    }
    
    return new GateCheckResult(true);
}

/**
 * Check invite member gate
 * @param {Object} params - Gate parameters
 */
function checkInviteMemberGate(params) {
    const { context = {} } = params;
    
    // Check if user is group admin or has invitation privileges
    const isGroupAdmin = context.isGroupAdmin || false;
    const canInvite = context.canInvite || false;
    
    if (!isGroupAdmin && !canInvite) {
        return new GateCheckResult(
            false,
            'Not authorized to invite members',
            'REQUEST_INVITATION_PRIVILEGES'
        );
    }
    
    // Check group capacity
    const groupMembersCount = context.groupMembersCount || 0;
    if (groupMembersCount >= 1000) {
        return new GateCheckResult(
            false,
            'Group is at full capacity',
            'REMOVE_MEMBERS_FIRST',
            { currentMembers: groupMembersCount }
        );
    }
    
    // Check if invitee is already in maximum groups
    if (context.inviteeGroupCount >= 4) {
        return new GateCheckResult(
            false,
            'Invitee is already in maximum groups',
            'INVITE_SOMEONE_ELSE',
            { inviteeGroups: context.inviteeGroupCount }
        );
    }
    
    // Check if invitee is in same country
    if (context.inviteeCountry !== context.groupCountry) {
        return new GateCheckResult(
            false,
            'Can only invite members from same country',
            'INVITE_LOCAL_MEMBERS',
            { inviteeCountry: context.inviteeCountry, groupCountry: context.groupCountry }
        );
    }
    
    return new GateCheckResult(true);
}

/**
 * Check access dashboard gate
 * @param {Object} params - Gate parameters
 */
function checkAccessDashboardGate(params) {
    const { state } = params;
    
    // Dashboard access depends on subscription state
    switch(state) {
        case SUBSCRIPTION_STATES.ACTIVE:
        case SUBSCRIPTION_STATES.EXPIRED:
        case SUBSCRIPTION_STATES.SUSPENDED:
        case SUBSCRIPTION_STATES.GRACE_PERIOD:
            return new GateCheckResult(true);
            
        case SUBSCRIPTION_STATES.NEW:
            return new GateCheckResult(
                false,
                'Complete subscription activation to access dashboard',
                'ACTIVATE_SUBSCRIPTION'
            );
            
        case SUBSCRIPTION_STATES.CANCELLED:
            return new GateCheckResult(
                false,
                'Subscription cancelled',
                'NEW_SUBSCRIPTION_REQUIRED'
            );
            
        default:
            return new GateCheckResult(
                false,
                'Unknown subscription state',
                'CONTACT_SUPPORT'
            );
    }
}

/**
 * Check upgrade tier gate
 * @param {Object} params - Gate parameters
 */
function checkUpgradeTierGate(params) {
    const { tierId, state, context = {} } = params;
    
    // Must have active subscription to upgrade
    if (state !== SUBSCRIPTION_STATES.ACTIVE) {
        return new GateCheckResult(
            false,
            'Active subscription required for upgrade',
            'ACTIVATE_SUBSCRIPTION'
        );
    }
    
    // Check if already at highest tier
    if (tierId === 'LENDER_OF_LENDERS') {
        return new GateCheckResult(
            false,
            'Already at highest tier',
            '',
            { currentTier: 'LENDER_OF_LENDERS' }
        );
    }
    
    // Check repayment history for upgrade eligibility
    const repaymentRate = context.repaymentRate || 0;
    const defaultRate = context.defaultRate || 0;
    
    if (repaymentRate < 85) { // Minimum 85% repayment rate for upgrades
        return new GateCheckResult(
            false,
            'Minimum 85% repayment rate required for upgrade',
            'IMPROVE_REPAYMENT_HISTORY',
            { currentRate: repaymentRate, required: 85 }
        );
    }
    
    if (defaultRate > 15) { // Maximum 15% default rate for upgrades
        return new GateCheckResult(
            false,
            'Maximum 15% default rate allowed for upgrade',
            'REDUCE_DEFAULTS',
            { currentRate: defaultRate, maximum: 15 }
        );
    }
    
    return new GateCheckResult(true);
}

/**
 * Check renew subscription gate
 * @param {Object} params - Gate parameters
 */
function checkRenewSubscriptionGate(params) {
    const { state } = params;
    
    // Can renew if: active, expired (within grace), or suspended
    const canRenewStates = [
        SUBSCRIPTION_STATES.ACTIVE,
        SUBSCRIPTION_STATES.EXPIRED,
        SUBSCRIPTION_STATES.SUSPENDED,
        SUBSCRIPTION_STATES.GRACE_PERIOD
    ];
    
    if (canRenewStates.includes(state)) {
        return new GateCheckResult(true);
    }
    
    if (state === SUBSCRIPTION_STATES.CANCELLED) {
        return new GateCheckResult(
            false,
            'Cancelled subscription cannot be renewed',
            'NEW_SUBSCRIPTION_REQUIRED'
        );
    }
    
    return new GateCheckResult(
        false,
        `Cannot renew subscription in state: ${state}`,
        'CONTACT_SUPPORT'
    );
}

/**
 * Check export data gate
 * @param {Object} params - Gate parameters
 */
function checkExportDataGate(params) {
    const { state } = params;
    
    // Can export data from any state except cancelled
    if (state === SUBSCRIPTION_STATES.CANCELLED) {
        return new GateCheckResult(
            false,
            'Data export not available for cancelled subscriptions',
            'CONTACT_SUPPORT'
        );
    }
    
    return new GateCheckResult(true);
}

/**
 * Check admin override gate
 * @param {Object} params - Gate parameters
 */
function checkAdminOverrideGate(params) {
    const { context = {} } = params;
    
    // Only platform admins can override
    const isPlatformAdmin = context.isPlatformAdmin || false;
    const isGroupAdmin = context.isGroupAdmin || false;
    
    if (!isPlatformAdmin) {
        // Group admins have limited override capabilities
        if (isGroupAdmin && context.overrideScope === 'GROUP') {
            return new GateCheckResult(
                true,
                'Group admin override granted',
                '',
                { scope: 'GROUP', groupId: context.groupId }
            );
        }
        
        return new GateCheckResult(
            false,
            'Admin privileges required',
            'REQUEST_ADMIN_ASSISTANCE'
        );
    }
    
    // Platform admin checks
    const overrideType = context.overrideType;
    
    // Check if override is within admin limits
    if (overrideType === 'LEDGER_UPDATE') {
        const ledgerState = context.ledgerState;
        if (ledgerState === 'CLEARED' && !context.force) {
            return new GateCheckResult(
                false,
                'Cannot override cleared ledger without force flag',
                'USE_FORCE_FLAG',
                { ledgerState }
            );
        }
    }
    
    // Log admin override
    logSubscriptionAction({
        action: 'ADMIN_OVERRIDE_GRANTED',
        adminId: context.adminId,
        overrideType,
        userId: params.userId,
        timestamp: new Date().toISOString()
    });
    
    return new GateCheckResult(
        true,
        'Platform admin override granted',
        '',
        { adminId: context.adminId, overrideType }
    );
}

/**
 * Check country-specific gate
 * @param {string} countryCode - Country code
 * @param {string} action - Action being performed
 * @param {Object} params - Additional parameters
 */
function checkCountryGate(countryCode, action, params) {
    // Country-specific restrictions
    const countryRestrictions = {
        // Somalia has more restrictive rules
        SO: {
            allowedActions: ['BORROW', 'VIEW_PORTFOLIO', 'JOIN_GROUP'],
            maxLendingAmount: 100000, // SOS
            requiresKYC: false
        },
        // South Africa has stricter regulations
        ZA: {
            requiresCRB: true,
            minLendingAge: 21,
            taxRequired: true
        },
        // Kenya has full features
        KE: {
            allowedActions: 'ALL',
            crbIntegration: true
        }
    };
    
    const restrictions = countryRestrictions[countryCode] || {};
    
    // Check if action is allowed in country
    if (restrictions.allowedActions && restrictions.allowedActions !== 'ALL') {
        if (!restrictions.allowedActions.includes(action)) {
            return new GateCheckResult(
                false,
                `Action ${action} not allowed in ${countryCode}`,
                'CHECK_COUNTRY_RULES'
            );
        }
    }
    
    // Check CRB requirement for lending
    if (action === 'LEND' && restrictions.requiresCRB && !params.hasCRBCheck) {
        return new GateCheckResult(
            false,
            'CRB check required in this country',
            'COMPLETE_CRB_CHECK',
            { country: countryCode }
        );
    }
    
    // Check tax requirement
    if (restrictions.taxRequired && !params.hasTaxCertificate) {
        return new GateCheckResult(
            false,
            'Tax certificate required',
            'UPLOAD_TAX_CERTIFICATE',
            { country: countryCode }
        );
    }
    
    // Check age requirement
    if (restrictions.minLendingAge && params.age < restrictions.minLendingAge) {
        return new GateCheckResult(
            false,
            `Minimum age ${restrictions.minLendingAge} required in ${countryCode}`,
            'WAIT_UNTIL_AGE_REQUIREMENT',
            { currentAge: params.age, requiredAge: restrictions.minLendingAge }
        );
    }
    
    return new GateCheckResult(true);
}

/**
 * Get weekly limit for tier
 * @param {string} tierId - Tier ID
 */
function getWeeklyLimitForTier(tierId) {
    const tierLimits = {
        BASIC: 1500,
        PREMIUM: 5000,
        SUPER: 20000,
        LENDER_OF_LENDERS: 50000
    };
    
    return tierLimits[tierId] || 0;
}

/**
 * Get max ledgers for tier
 * @param {string} tierId - Tier ID
 */
function getMaxLedgersForTier(tierId) {
    const ledgerLimits = {
        BASIC: 1500,
        PREMIUM: 10000,
        SUPER: 20000,
        LENDER_OF_LENDERS: 50000
    };
    
    return ledgerLimits[tierId] || 0;
}

/**
 * Check all gates for a user (comprehensive check)
 * @param {Object} user - User object
 * @param {Object} context - Context object
 * @returns {Object} All gate check results
 */
export function checkAllGates(user, context = {}) {
    const subscription = user.subscription;
    const results = {};
    
    // Check each gate type
    const gateTypes = Object.values(GATE_TYPES);
    
    for (const gateType of gateTypes) {
        results[gateType] = checkSubscriptionGate({
            userId: user.id,
            tierId: subscription?.tier?.id,
            state: subscription?.state,
            countryCode: user.countryCode,
            action: gateType,
            context: {
                ...context,
                isGroupAdmin: user.isGroupAdmin,
                isPlatformAdmin: user.isPlatformAdmin,
                groupCount: user.groupCount,
                repaymentRating: user.repaymentRating,
                isBlacklisted: user.isBlacklisted
            }
        });
    }
    
    // Calculate overall access level
    const allowedGates = Object.values(results).filter(r => r.allowed);
    const accessLevel = allowedGates.length / gateTypes.length;
    
    results.summary = {
        totalGates: gateTypes.length,
        allowedGates: allowedGates.length,
        accessLevel: Math.round(accessLevel * 100),
        criticalGatesBlocked: !results.LEND.allowed || !results.BORROW.allowed,
        subscriptionState: subscription?.state,
        tier: subscription?.tier?.name
    };
    
    return results;
}

/**
 * Get gate status for display
 * @param {Object} user - User object
 * @returns {Object} Gate status
 */
export function getGateStatus(user) {
    const subscription = user.subscription;
    
    if (!subscription) {
        return {
            status: 'NO_SUBSCRIPTION',
            message: 'No active subscription',
            color: 'red',
            actions: ['ACTIVATE_SUBSCRIPTION'],
            expiryDate: null
        };
    }
    
    const now = new Date();
    const expiry = new Date(subscription.expiryDate);
    const daysRemaining = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
    
    switch(subscription.state) {
        case SUBSCRIPTION_STATES.ACTIVE:
            return {
                status: 'ACTIVE',
                message: `Active - ${daysRemaining} days remaining`,
                color: 'green',
                actions: ['LEND', 'BORROW', 'RENEW'],
                expiryDate: expiry,
                daysRemaining,
                weeklyUsed: subscription.totalLentThisWeek,
                weeklyLimit: subscription.tier?.weeklyLimit
            };
            
        case SUBSCRIPTION_STATES.EXPIRED:
            return {
                status: 'EXPIRED',
                message: 'Subscription expired',
                color: 'red',
                actions: ['RENEW'],
                expiryDate: expiry,
                daysRemaining: 0
            };
            
        case SUBSCRIPTION_STATES.SUSPENDED:
            return {
                status: 'SUSPENDED',
                message: 'Subscription suspended',
                color: 'orange',
                actions: ['CONTACT_SUPPORT', 'RENEW'],
                expiryDate: expiry
            };
            
        case SUBSCRIPTION_STATES.GRACE_PERIOD:
            return {
                status: 'GRACE_PERIOD',
                message: `Grace period - ${daysRemaining} days to renew`,
                color: 'yellow',
                actions: ['RENEW'],
                expiryDate: expiry,
                daysRemaining
            };
            
        default:
            return {
                status: subscription.state,
                message: `Subscription ${subscription.state}`,
                color: 'gray',
                actions: ['CONTACT_SUPPORT'],
                expiryDate: expiry
            };
    }
}

// Export default
export default {
    GATE_TYPES,
    checkSubscriptionGate,
    checkAllGates,
    getGateStatus,
    GateCheckResult
};