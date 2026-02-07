/**
 * M-PESEWA Subscription Guard
 * Enforces subscription requirements for lenders per Section A
 * Subscription expires on 28th of each month, blocks access when expired
 */

import { getCurrentUser, getUserSubscription, getUserRole } from '../state/store.js';
import { navigateTo } from './router.js';
import { logAuditEvent } from '../audit/audit-log.js';
import { SUBSCRIPTION_TIERS, SUBSCRIPTION_RULES } from '../core/constants.js';
import { formatCurrency, calculateDaysUntil } from '../utils/date.js';

/**
 * Subscription Guard - Enforces lender subscription requirements
 * @param {Object} context - Route context
 * @param {Function} next - Next middleware function
 * @returns {Promise<void>}
 */
export const subscriptionGuard = async (context, next) => {
  try {
    console.log('💰 Subscription Guard: Checking subscription status...');
    
    const user = getCurrentUser();
    if (!user) {
      console.log('Subscription Guard: No user logged in, proceeding...');
      return await next();
    }
    
    const userRole = getUserRole();
    
    // STRICT RULE: Only lenders require subscriptions
    if (userRole !== 'lender' && userRole !== 'lender_borrower') {
      console.log(`Subscription Guard: User role is ${userRole}, no subscription required`);
      return await next();
    }
    
    const subscription = getUserSubscription();
    
    // STRICT RULE: Lenders must have active subscription
    if (!subscription || !subscription.active) {
      console.error('❌ Subscription Guard: Lender has no active subscription');
      
      logAuditEvent('SUBSCRIPTION_REQUIRED', {
        userId: user.id,
        route: context.path,
        userRole: userRole,
        hasSubscription: !!subscription,
        subscriptionActive: subscription?.active
      });
      
      showSubscriptionRequired();
      return;
    }
    
    // STRICT RULE: Check subscription expiry (28th of each month)
    const { isExpired, daysUntilExpiry, expiryDate } = checkSubscriptionExpiry(subscription);
    
    if (isExpired) {
      console.error('❌ Subscription Guard: Subscription expired');
      
      logAuditEvent('SUBSCRIPTION_EXPIRED', {
        userId: user.id,
        subscriptionId: subscription.id,
        tier: subscription.tier,
        expiryDate: subscription.expiryDate,
        route: context.path
      });
      
      showSubscriptionExpired(subscription, expiryDate);
      return;
    }
    
    // STRICT RULE: Check if nearing expiry (7 days warning)
    if (daysUntilExpiry <= 7) {
      console.warn(`⚠️ Subscription Guard: Subscription expires in ${daysUntilExpiry} days`);
      showSubscriptionExpiryWarning(subscription, daysUntilExpiry);
    }
    
    // STRICT RULE: Enforce tier limits
    const tierLimitCheck = checkTierLimits(subscription.tier, context);
    if (!tierLimitCheck.allowed) {
      console.error(`❌ Subscription Guard: Tier limit exceeded: ${tierLimitCheck.reason}`);
      
      logAuditEvent('TIER_LIMIT_EXCEEDED', {
        userId: user.id,
        tier: subscription.tier,
        limit: tierLimitCheck.limit,
        attempted: tierLimitCheck.attempted,
        route: context.path,
        operation: context.method
      });
      
      showTierLimitError(subscription.tier, tierLimitCheck);
      return;
    }
    
    // STRICT RULE: Check for subscription payment status
    if (subscription.paymentStatus !== 'paid') {
      console.warn(`⚠️ Subscription Guard: Payment status is ${subscription.paymentStatus}`);
      
      if (subscription.paymentStatus === 'pending') {
        showPaymentPending(subscription);
        return;
      } else if (subscription.paymentStatus === 'failed') {
        showPaymentFailed(subscription);
        return;
      }
    }
    
    // Add subscription context to route
    context.subscription = subscription;
    context.tierLimits = SUBSCRIPTION_RULES[subscription.tier] || {};
    
    console.log(`✅ Subscription Guard: ${subscription.tier} subscription active, expires in ${daysUntilExpiry} days`);
    await next();
    
  } catch (error) {
    console.error('Subscription Guard Error:', error);
    
    logAuditEvent('SUBSCRIPTION_GUARD_FAILURE', {
      error: error.message,
      route: context?.path,
      userId: getCurrentUser()?.id
    });
    
    navigateTo('/subscription/expired');
  }
};

/**
 * Check subscription expiry (expires on 28th of each month)
 * @param {Object} subscription - Subscription object
 * @returns {Object} Expiry check result
 */
function checkSubscriptionExpiry(subscription) {
  if (!subscription.expiryDate) {
    return { isExpired: true, daysUntilExpiry: 0, expiryDate: null };
  }
  
  const expiryDate = new Date(subscription.expiryDate);
  const now = new Date();
  const isExpired = now > expiryDate;
  const daysUntilExpiry = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
  
  // SPECIAL RULE: Force expiry on 28th of each month
  const today = now.getDate();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  // Check if today is after 28th and subscription hasn't been renewed
  if (today > 28) {
    const lastRenewal = subscription.lastRenewal ? new Date(subscription.lastRenewal) : null;
    if (!lastRenewal || lastRenewal.getMonth() !== currentMonth) {
      return { 
        isExpired: true, 
        daysUntilExpiry: 0, 
        expiryDate: new Date(currentYear, currentMonth, 28),
        forcedExpiry: true 
      };
    }
  }
  
  return { isExpired, daysUntilExpiry, expiryDate };
}

/**
 * Check tier limits for the current operation
 * @param {string} tier - Subscription tier
 * @param {Object} context - Route context
 * @returns {Object} Limit check result
 */
function checkTierLimits(tier, context) {
  const tierRules = SUBSCRIPTION_RULES[tier];
  if (!tierRules) {
    return { allowed: false, reason: 'Invalid subscription tier' };
  }
  
  const { path, method, body } = context;
  
  // Loan approval limits
  if (path.includes('/lender/approve') && method === 'POST' && body) {
    const loanAmount = parseFloat(body.amount) || 0;
    const weeklyLimit = tierRules.maxPerWeek || 0;
    
    // Check weekly limit
    const weeklyUsage = getWeeklyLoanUsage(context.userId);
    if (weeklyUsage + loanAmount > weeklyLimit) {
      return {
        allowed: false,
        reason: 'Weekly lending limit exceeded',
        limit: weeklyLimit,
        attempted: weeklyUsage + loanAmount,
        period: 'week'
      };
    }
    
    // Check per-loan limit
    if (loanAmount > tierRules.maxPerLoan) {
      return {
        allowed: false,
        reason: 'Per-loan limit exceeded',
        limit: tierRules.maxPerLoan,
        attempted: loanAmount,
        period: 'single'
      };
    }
  }
  
  // Ledger creation limits
  if (path.includes('/ledger/create') && method === 'POST') {
    const totalLedgers = getTotalLedgers(context.userId);
    if (totalLedgers >= tierRules.maxLedgers) {
      return {
        allowed: false,
        reason: 'Maximum ledgers reached',
        limit: tierRules.maxLedgers,
        attempted: totalLedgers + 1,
        period: 'total'
      };
    }
  }
  
  // CRB check requirement for Super tier
  if (tier === 'super' && path.includes('/lender/approve')) {
    if (!body.crbVerified) {
      return {
        allowed: false,
        reason: 'CRB check required for Super tier',
        requirement: 'crb_verification'
      };
    }
  }
  
  return { allowed: true };
}

/**
 * Get weekly loan usage for lender
 * @param {string} userId - User ID
 * @returns {number} Total amount lent this week
 */
function getWeeklyLoanUsage(userId) {
  // This would typically query the backend
  const weeklyLoans = JSON.parse(localStorage.getItem(`weekly_loans_${userId}`) || '[]');
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  return weeklyLoans
    .filter(loan => new Date(loan.date) > oneWeekAgo)
    .reduce((total, loan) => total + loan.amount, 0);
}

/**
 * Get total ledgers for lender
 * @param {string} userId - User ID
 * @returns {number} Total ledgers
 */
function getTotalLedgers(userId) {
  const ledgers = JSON.parse(localStorage.getItem(`ledgers_${userId}`) || '[]');
  return ledgers.length;
}

/**
 * Show subscription required screen
 */
function showSubscriptionRequired() {
  const errorHtml = `
    <div class="subscription-required" style="
      max-width: 700px;
      margin: 60px auto;
      padding: 40px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      text-align: center;
    ">
      <div style="font-size: 64px; margin-bottom: 20px;">💰</div>
      <h1 style="color: #003366; margin-bottom: 15px;">Subscription Required</h1>
      <p style="color: #555; margin-bottom: 25px; line-height: 1.6; font-size: 18px;">
        To start lending on M-Pesewa, you need an active subscription. 
        Choose a plan that matches your lending goals.
      </p>
      
      <div style="
        background: linear-gradient(135deg, #003366, #0099ff);
        color: white;
        padding: 25px;
        border-radius: 10px;
        margin: 30px 0;
        text-align: left;
      ">
        <h3 style="margin-bottom: 15px; font-size: 20px;">Why Subscriptions?</h3>
        <ul style="padding-left: 20px; line-height: 1.8;">
          <li>Platform's only revenue source (no loan commissions)</li>
          <li>Access to lending tools and ledger management</li>
          <li>Tiered limits based on your capacity</li>
          <li>Monthly, bi-annual, or annual payment options</li>
        </ul>
      </div>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin: 30px 0;">
        ${Object.entries(SUBSCRIPTION_TIERS).map(([tier, data]) => `
          <div style="
            background: ${tier === 'basic' ? '#f8f9fa' : tier === 'premium' ? '#e8f5e8' : '#fff3cd'};
            border: 2px solid ${tier === 'basic' ? '#6c757d' : tier === 'premium' ? '#28a745' : '#ffc107'};
            border-radius: 10px;
            padding: 20px;
            text-align: center;
          ">
            <h4 style="color: #003366; margin-bottom: 10px;">${data.name}</h4>
            <div style="font-size: 24px; font-weight: bold; color: #003366; margin-bottom: 15px;">
              ${formatCurrency(data.monthly, 'KES')}/month
            </div>
            <ul style="text-align: left; padding-left: 20px; margin-bottom: 20px; font-size: 14px;">
              <li>Up to ${formatCurrency(data.maxPerWeek, 'KES')}/week</li>
              <li>${data.maxLedgers} ledgers maximum</li>
              <li>${data.crb ? 'CRB check required' : 'No CRB check'}</li>
            </ul>
            <button onclick="window.location.href='/subscription/subscribe?tier=${tier}'" style="
              background: ${tier === 'basic' ? '#6c757d' : tier === 'premium' ? '#28a745' : '#ffc107'};
              color: white;
              border: none;
              padding: 10px 20px;
              border-radius: 6px;
              font-weight: 600;
              cursor: pointer;
              width: 100%;
            ">
              Choose ${data.name}
            </button>
          </div>
        `).join('')}
      </div>
      
      <div style="display: flex; gap: 15px; justify-content: center; margin-top: 30px;">
        <button onclick="window.location.href='/lender/how-it-works'" style="
          background: white;
          color: #003366;
          border: 2px solid #003366;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        ">
          Learn More About Lending
        </button>
        <button onclick="window.location.href='/auth/register?role=borrower'" style="
          background: #f37021;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        ">
          Switch to Borrower (Free)
        </button>
      </div>
      
      <div style="
        margin-top: 40px;
        padding-top: 20px;
        border-top: 1px solid #eee;
        font-size: 14px;
        color: #666;
      ">
        <p><strong>Note for Borrowers:</strong> Borrowers pay no subscription fees. Only lenders need subscriptions.</p>
      </div>
    </div>
  `;
  
  document.body.innerHTML = errorHtml;
}

/**
 * Show subscription expired screen
 * @param {Object} subscription - Subscription details
 * @param {Date} expiryDate - Expiry date
 */
function showSubscriptionExpired(subscription, expiryDate) {
  const tierName = SUBSCRIPTION_TIERS[subscription.tier]?.name || subscription.tier;
  const formattedDate = expiryDate ? expiryDate.toLocaleDateString() : 'Unknown';
  
  const errorHtml = `
    <div class="subscription-expired" style="
      max-width: 600px;
      margin: 60px auto;
      padding: 40px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      text-align: center;
    ">
      <div style="font-size: 64px; margin-bottom: 20px;">⏰</div>
      <h2 style="color: #dc3545; margin-bottom: 15px;">Subscription Expired</h2>
      <p style="color: #555; margin-bottom: 20px; font-size: 18px;">
        Your <strong>${tierName}</strong> subscription expired on <strong>${formattedDate}</strong>.
      </p>
      
      <div style="
        background: #fff5f5;
        border-left: 4px solid #dc3545;
        padding: 20px;
        margin: 25px 0;
        text-align: left;
        border-radius: 4px;
      ">
        <h4 style="color: #dc3545; margin-bottom: 10px;">What This Means:</h4>
        <ul style="color: #555; padding-left: 20px;">
          <li>Lending access is temporarily blocked</li>
          <li>Existing loans continue normally</li>
          <li>You can still view your portfolio and history</li>
          <li>Borrower functionality remains available</li>
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
        <h4 style="color: #28a745; margin-bottom: 10px;">How to Renew:</h4>
        <ol style="color: #555; padding-left: 20px;">
          <li>Choose your subscription tier</li>
          <li>Make payment through M-Pesa Till, Paybill, or Bank</li>
          <li>Access restored immediately after payment confirmation</li>
          <li>New expiry: 28th of next month</li>
        </ol>
      </div>
      
      <div style="display: flex; gap: 15px; justify-content: center; margin-top: 30px;">
        <button onclick="window.location.href='/subscription/renew'" style="
          background: #28a745;
          color: white;
          border: none;
          padding: 14px 28px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          font-size: 16px;
        ">
          Renew Subscription
        </button>
        <button onclick="window.location.href='/subscription/plans'" style="
          background: #003366;
          color: white;
          border: none;
          padding: 14px 28px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          font-size: 16px;
        ">
          View All Plans
        </button>
      </div>
      
      <div style="
        margin-top: 30px;
        padding-top: 20px;
        border-top: 1px solid #eee;
        font-size: 14px;
        color: #666;
      ">
        <p><strong>Automatic Expiry:</strong> All subscriptions expire on the 28th of each month.</p>
        <p>Set a reminder to renew before the 28th to avoid service interruption.</p>
      </div>
    </div>
  `;
  
  document.body.innerHTML = errorHtml;
}

/**
 * Show subscription expiry warning
 * @param {Object} subscription - Subscription details
 * @param {number} daysUntilExpiry - Days until expiry
 */
function showSubscriptionExpiryWarning(subscription, daysUntilExpiry) {
  const warningHtml = `
    <div class="subscription-warning-banner" style="
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: linear-gradient(90deg, #ffc107, #ff9800);
      color: #856404;
      padding: 15px 20px;
      text-align: center;
      z-index: 9998;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      animation: slideDown 0.3s ease;
    ">
      <div style="display: flex; justify-content: space-between; align-items: center; max-width: 1200px; margin: 0 auto;">
        <div style="font-weight: 600; font-size: 16px;">
          ⚠️ Your ${SUBSCRIPTION_TIERS[subscription.tier]?.name || subscription.tier} subscription 
          expires in ${daysUntilExpiry} ${daysUntilExpiry === 1 ? 'day' : 'days'}
        </div>
        <div style="display: flex; gap: 10px;">
          <button onclick="this.parentElement.parentElement.remove()" style="
            background: transparent;
            border: 1px solid #856404;
            color: #856404;
            padding: 6px 12px;
            border-radius: 4px;
            font-weight: 600;
            cursor: pointer;
          ">
            Dismiss
          </button>
          <button onclick="window.location.href='/subscription/renew'" style="
            background: #856404;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 4px;
            font-weight: 600;
            cursor: pointer;
          ">
            Renew Now
          </button>
        </div>
      </div>
    </div>
  `;
  
  // Only show once per day
  const lastShown = localStorage.getItem('last_subscription_warning');
  const today = new Date().toDateString();
  
  if (lastShown !== today) {
    document.body.insertAdjacentHTML('afterbegin', warningHtml);
    localStorage.setItem('last_subscription_warning', today);
  }
}

/**
 * Show tier limit error
 * @param {string} tier - Subscription tier
 * @param {Object} limitCheck - Limit check result
 */
function showTierLimitError(tier, limitCheck) {
  const tierInfo = SUBSCRIPTION_TIERS[tier];
  const upgradeTier = getNextTier(tier);
  
  const errorHtml = `
    <div class="tier-limit-error" style="
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
      <div style="font-size: 48px; margin-bottom: 20px;">📊</div>
      <h3 style="color: #003366; margin-bottom: 15px;">Subscription Limit Reached</h3>
      <p style="color: #555; margin-bottom: 20px;">
        ${limitCheck.reason}. Your <strong>${tierInfo.name}</strong> plan has a limit of 
        ${formatCurrency(limitCheck.limit, 'KES')} per ${limitCheck.period}.
      </p>
      
      <div style="
        background: #f8f9fa;
        padding: 20px;
        border-radius: 8px;
        margin: 20px 0;
      ">
        <h4 style="color: #003366; margin-bottom: 15px;">Current Tier Limits:</h4>
        <ul style="text-align: left; padding-left: 20px; color: #555;">
          <li>Weekly limit: ${formatCurrency(tierInfo.maxPerWeek, 'KES')}</li>
          <li>Per loan limit: ${formatCurrency(tierInfo.maxPerLoan, 'KES')}</li>
          <li>Maximum ledgers: ${tierInfo.maxLedgers}</li>
          <li>${tierInfo.crb ? 'CRB check required' : 'No CRB required'}</li>
        </ul>
      </div>
      
      ${upgradeTier ? `
        <div style="
          background: #e8f5e8;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
          text-align: left;
        ">
          <h4 style="color: #28a745; margin-bottom: 10px;">Upgrade to ${upgradeTier.name}:</h4>
          <ul style="color: #555; padding-left: 20px;">
            <li>Weekly limit: ${formatCurrency(upgradeTier.maxPerWeek, 'KES')}</li>
            <li>Per loan limit: ${formatCurrency(upgradeTier.maxPerLoan, 'KES')}</li>
            <li>Maximum ledgers: ${upgradeTier.maxLedgers}</li>
            <li>Only ${formatCurrency(upgradeTier.monthly, 'KES')}/month</li>
          </ul>
        </div>
      ` : ''}
      
      <div style="display: flex; gap: 12px; justify-content: center; margin-top: 25px;">
        <button onclick="this.parentElement.parentElement.remove()" style="
          background: #6c757d;
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
        ${upgradeTier ? `
          <button onclick="window.location.href='/subscription/upgrade?tier=${upgradeTier.id}'" style="
            background: #003366;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            flex: 1;
          ">
            Upgrade Plan
          </button>
        ` : ''}
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
 * Show payment pending screen
 * @param {Object} subscription - Subscription details
 */
function showPaymentPending(subscription) {
  const errorHtml = `
    <div class="payment-pending">
      <h3>Payment Processing</h3>
      <p>Your subscription payment is being processed. This usually takes 2-5 minutes.</p>
      <div class="payment-info">
        <p>Reference: ${subscription.paymentReference}</p>
        <p>Amount: ${formatCurrency(subscription.amount, subscription.currency)}</p>
      </div>
      <div class="actions">
        <button onclick="checkPaymentStatus()" class="btn btn-primary">
          Check Status
        </button>
        <button onclick="window.location.href='/subscription/payment'" class="btn btn-outline">
          View Payment Details
        </button>
      </div>
    </div>
  `;
  
  // Show as modal
  const modal = document.createElement('div');
  modal.className = 'payment-modal';
  modal.innerHTML = errorHtml;
  document.body.appendChild(modal);
}

/**
 * Show payment failed screen
 * @param {Object} subscription - Subscription details
 */
function showPaymentFailed(subscription) {
  const errorHtml = `
    <div class="payment-failed" style="
      max-width: 500px;
      margin: 40px auto;
      padding: 30px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      text-align: center;
    ">
      <div style="font-size: 48px; margin-bottom: 20px;">❌</div>
      <h3 style="color: #dc3545; margin-bottom: 15px;">Payment Failed</h3>
      <p style="color: #555; margin-bottom: 20px;">
        We couldn't process your subscription payment. Please try again or use a different payment method.
      </p>
      
      <div style="
        background: #fff5f5;
        padding: 15px;
        border-radius: 8px;
        margin: 20px 0;
        text-align: left;
      ">
        <p><strong>Reference:</strong> ${subscription.paymentReference}</p>
        <p><strong>Amount:</strong> ${formatCurrency(subscription.amount, subscription.currency)}</p>
        <p><strong>Status:</strong> <span style="color: #dc3545;">Failed</span></p>
        ${subscription.paymentError ? `<p><strong>Error:</strong> ${subscription.paymentError}</p>` : ''}
      </div>
      
      <div style="display: flex; gap: 12px; justify-content: center; margin-top: 25px;">
        <button onclick="window.location.href='/subscription/payment?retry=true'" style="
          background: #28a745;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        ">
          Retry Payment
        </button>
        <button onclick="window.location.href='/subscription/plans'" style="
          background: #003366;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        ">
          Choose Different Plan
        </button>
      </div>
    </div>
  `;
  
  document.body.innerHTML = errorHtml;
}

/**
 * Get next tier for upgrade
 * @param {string} currentTier - Current tier
 * @returns {Object|null} Next tier or null
 */
function getNextTier(currentTier) {
  const tiers = ['basic', 'premium', 'super', 'lender_of_lenders'];
  const currentIndex = tiers.indexOf(currentTier);
  
  if (currentIndex < tiers.length - 1) {
    return SUBSCRIPTION_TIERS[tiers[currentIndex + 1]];
  }
  
  return null;
}

/**
 * Check if user can perform lending operation
 * @param {string} userId - User ID
 * @param {Object} operation - Operation details
 * @returns {Object} Check result
 */
export async function canPerformLending(userId, operation) {
  const subscription = getUserSubscription();
  
  if (!subscription || !subscription.active) {
    return {
      allowed: false,
      reason: 'No active subscription',
      required: 'active_subscription'
    };
  }
  
  // Check expiry
  const { isExpired } = checkSubscriptionExpiry(subscription);
  if (isExpired) {
    return {
      allowed: false,
      reason: 'Subscription expired',
      required: 'renew_subscription'
    };
  }
  
  // Check tier limits
  const tierRules = SUBSCRIPTION_RULES[subscription.tier];
  if (operation.amount > tierRules.maxPerLoan) {
    return {
      allowed: false,
      reason: `Amount exceeds per-loan limit of ${formatCurrency(tierRules.maxPerLoan, 'KES')}`,
      limit: tierRules.maxPerLoan,
      attempted: operation.amount
    };
  }
  
  // Check weekly usage
  const weeklyUsage = getWeeklyLoanUsage(userId);
  if (weeklyUsage + operation.amount > tierRules.maxPerWeek) {
    return {
      allowed: false,
      reason: `Would exceed weekly limit of ${formatCurrency(tierRules.maxPerWeek, 'KES')}`,
      limit: tierRules.maxPerWeek,
      currentUsage: weeklyUsage,
      attempted: weeklyUsage + operation.amount
    };
  }
  
  return {
    allowed: true,
    tier: subscription.tier,
    limits: tierRules
  };
}

/**
 * Calculate subscription expiry date
 * @param {string} startDate - Start date
 * @param {string} period - Subscription period (monthly, bi_annual, annual)
 * @returns {Date} Expiry date
 */
export function calculateExpiryDate(startDate, period) {
  const start = new Date(startDate);
  const expiry = new Date(start);
  
  switch (period) {
    case 'monthly':
      // Set to 28th of next month
      expiry.setMonth(expiry.getMonth() + 1);
      expiry.setDate(28);
      break;
    case 'bi_annual':
      expiry.setMonth(expiry.getMonth() + 6);
      expiry.setDate(28);
      break;
    case 'annual':
      expiry.setFullYear(expiry.getFullYear() + 1);
      expiry.setDate(28);
      break;
    default:
      expiry.setMonth(expiry.getMonth() + 1);
      expiry.setDate(28);
  }
  
  return expiry;
}

/**
 * Initialize subscription guard
 */
export function initializeSubscriptionGuard() {
  console.log('💰 Subscription Guard: Initializing subscription rules...');
  
  // Monitor subscription status
  setupSubscriptionMonitoring();
  
  // Add subscription helpers to window
  window.MPesewaSubscription = {
    checkExpiry: checkSubscriptionExpiry,
    canPerformLending,
    calculateExpiryDate
  };
  
  console.log('✅ Subscription Guard: Initialized successfully');
}

/**
 * Setup subscription monitoring
 */
function setupSubscriptionMonitoring() {
  // Check subscription status periodically
  setInterval(() => {
    const user = getCurrentUser();
    if (user) {
      const subscription = getUserSubscription();
      if (subscription) {
        const { isExpired, daysUntilExpiry } = checkSubscriptionExpiry(subscription);
        if (isExpired) {
          console.log('Subscription expired, updating UI...');
          updateUIForExpiredSubscription();
        } else if (daysUntilExpiry <= 3) {
          console.log('Subscription expiring soon, showing warning...');
          showSubscriptionExpiryWarning(subscription, daysUntilExpiry);
        }
      }
    }
  }, 5 * 60 * 1000); // Check every 5 minutes
  
  // Listen for subscription events
  document.addEventListener('subscription:updated', (e) => {
    console.log('Subscription updated:', e.detail);
    // Refresh subscription status
  });
}

/**
 * Update UI for expired subscription
 */
function updateUIForExpiredSubscription() {
  // Disable lending buttons
  document.querySelectorAll('[data-lending-action]').forEach(button => {
    button.disabled = true;
    button.title = 'Subscription expired - renew to continue lending';
    button.style.opacity = '0.6';
    button.style.cursor = 'not-allowed';
  });
  
  // Show expired badge
  const expiredBadge = document.createElement('div');
  expiredBadge.className = 'subscription-expired-badge';
  expiredBadge.textContent = 'Subscription Expired';
  expiredBadge.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 20px;
    background: #dc3545;
    color: white;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 600;
    z-index: 9999;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  `;
  
  document.body.appendChild(expiredBadge);
}

export default subscriptionGuard;