/**
 * M-Pesewa Subscriptions State Management
 * Strictly follows M-Pesewa hierarchy and business rules
 * Non-negotiable subscription expiry: 28th of each month
 */

// Subscription Levels with strict limits
export const SUBSCRIPTION_TIERS = {
  BASIC: {
    id: 'basic',
    name: 'Basic',
    weeklyLimit: 1500,
    currency: 'local', // Currency depends on country
    monthly: 50,
    biAnnual: 250,
    annual: 500,
    crbCheck: false,
    ledgerLimit: 1500,
    description: 'Entry level for new lenders'
  },
  PREMIUM: {
    id: 'premium',
    name: 'Premium',
    weeklyLimit: 5000,
    currency: 'local',
    monthly: 250,
    biAnnual: 1500,
    annual: 2500,
    crbCheck: false,
    ledgerLimit: 10000,
    description: 'For experienced lenders'
  },
  SUPER: {
    id: 'super',
    name: 'Super',
    weeklyLimit: 20000,
    currency: 'local',
    monthly: 1000,
    biAnnual: 5000,
    annual: 8500,
    crbCheck: true,
    ledgerLimit: 20000,
    description: 'For professional lenders with CRB check'
  },
  LENDER_OF_LENDERS: {
    id: 'lender_of_lenders',
    name: 'Lender of Lenders',
    weeklyLimit: 50000,
    currency: 'local',
    monthly: 500,
    biAnnual: 3500,
    annual: 6500,
    crbCheck: true,
    ledgerLimit: 50000,
    description: 'For institutional lenders, custom terms'
  }
};

// Subscription Statuses
export const SUBSCRIPTION_STATUS = {
  ACTIVE: 'active',
  EXPIRED: 'expired',
  PENDING: 'pending',
  CANCELLED: 'cancelled',
  GRACE_PERIOD: 'grace_period'
};

// Calculate expiry date (always 28th of month)
export const calculateExpiryDate = (startDate = new Date()) => {
  const now = new Date(startDate);
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  
  // Get the 28th of current month
  let expiryDate = new Date(currentYear, currentMonth, 28);
  
  // If today is after 28th, set to 28th of next month
  if (now.getDate() > 28) {
    expiryDate = new Date(currentYear, currentMonth + 1, 28);
  }
  
  return expiryDate;
};

// Calculate days until expiry
export const daysUntilExpiry = (expiryDate) => {
  const now = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays >= 0 ? diffDays : 0;
};

// Check if subscription is expired
export const isSubscriptionExpired = (subscription) => {
  if (!subscription || !subscription.expiryDate) return true;
  
  const now = new Date();
  const expiry = new Date(subscription.expiryDate);
  return now > expiry;
};

// Get subscription tier by ID
export const getSubscriptionTier = (tierId) => {
  return SUBSCRIPTION_TIERS[tierId?.toUpperCase()] || SUBSCRIPTION_TIERS.BASIC;
};

// Calculate subscription cost based on duration
export const calculateSubscriptionCost = (tierId, duration) => {
  const tier = getSubscriptionTier(tierId);
  
  switch(duration) {
    case 'monthly':
      return tier.monthly;
    case 'biAnnual':
      return tier.biAnnual;
    case 'annual':
      return tier.annual;
    default:
      return tier.monthly;
  }
};

// Validate if lender can lend amount based on subscription
export const validateLendingLimit = (subscription, requestedAmount, totalLentThisWeek = 0) => {
  if (!subscription || subscription.status !== SUBSCRIPTION_STATUS.ACTIVE) {
    return {
      valid: false,
      reason: 'Subscription not active',
      remaining: 0
    };
  }
  
  const tier = getSubscriptionTier(subscription.tier);
  const weeklyLimit = tier.weeklyLimit;
  const remainingThisWeek = weeklyLimit - totalLentThisWeek;
  
  if (requestedAmount > remainingThisWeek) {
    return {
      valid: false,
      reason: `Exceeds weekly limit. Remaining: ${remainingThisWeek}`,
      remaining: remainingThisWeek
    };
  }
  
  return {
    valid: true,
    reason: 'Within subscription limits',
    remaining: remainingThisWeek - requestedAmount
  };
};

// Check CRB requirement for tier
export const requiresCRBCheck = (tierId) => {
  const tier = getSubscriptionTier(tierId);
  return tier.crbCheck;
};

// Subscription renewal
export const renewSubscription = (currentSubscription, duration) => {
  if (!currentSubscription) return null;
  
  const tier = getSubscriptionTier(currentSubscription.tier);
  const cost = calculateSubscriptionCost(currentSubscription.tier, duration);
  const newExpiry = calculateExpiryDate(new Date());
  
  return {
    ...currentSubscription,
    status: SUBSCRIPTION_STATUS.PENDING,
    renewalCost: cost,
    renewalDuration: duration,
    proposedExpiry: newExpiry,
    lastRenewalAttempt: new Date().toISOString()
  };
};

// Process subscription payment
export const processSubscriptionPayment = (subscription, paymentMethod, paymentDetails) => {
  const tier = getSubscriptionTier(subscription.tier);
  const cost = subscription.renewalCost || tier.monthly;
  
  return {
    ...subscription,
    status: SUBSCRIPTION_STATUS.ACTIVE,
    expiryDate: subscription.proposedExpiry || calculateExpiryDate(),
    paymentHistory: [
      ...(subscription.paymentHistory || []),
      {
        date: new Date().toISOString(),
        amount: cost,
        method: paymentMethod,
        details: paymentDetails,
        transactionId: `MPESEWA-SUB-${Date.now()}`
      }
    ],
    lastPaymentDate: new Date().toISOString()
  };
};

// Get subscription summary for display
export const getSubscriptionSummary = (subscription) => {
  if (!subscription) return null;
  
  const tier = getSubscriptionTier(subscription.tier);
  const isExpired = isSubscriptionExpired(subscription);
  const daysRemaining = daysUntilExpiry(subscription.expiryDate);
  
  return {
    tierName: tier.name,
    weeklyLimit: tier.weeklyLimit,
    status: isExpired ? SUBSCRIPTION_STATUS.EXPIRED : subscription.status,
    expiryDate: subscription.expiryDate,
    daysRemaining,
    isActive: !isExpired && subscription.status === SUBSCRIPTION_STATUS.ACTIVE,
    requiresCRB: tier.crbCheck,
    ledgerLimit: tier.ledgerLimit,
    description: tier.description
  };
};

// Handle subscription expiry
export const handleSubscriptionExpiry = (subscription) => {
  const isExpired = isSubscriptionExpired(subscription);
  
  if (isExpired && subscription.status === SUBSCRIPTION_STATUS.ACTIVE) {
    return {
      ...subscription,
      status: SUBSCRIPTION_STATUS.EXPIRED,
      blocked: true,
      expiryNotified: true,
      expiryDate: subscription.expiryDate
    };
  }
  
  return subscription;
};

// Subscription warnings and notifications
export const getSubscriptionWarnings = (subscription) => {
  const warnings = [];
  const daysRemaining = daysUntilExpiry(subscription?.expiryDate);
  
  if (!subscription) {
    warnings.push({
      level: 'critical',
      message: 'No active subscription. Lending access blocked.',
      action: 'Subscribe now'
    });
    return warnings;
  }
  
  if (subscription.status === SUBSCRIPTION_STATUS.EXPIRED) {
    warnings.push({
      level: 'critical',
      message: 'Subscription expired on 28th. Lending access blocked.',
      action: 'Renew subscription'
    });
  } else if (daysRemaining <= 7) {
    warnings.push({
      level: 'warning',
      message: `Subscription expires in ${daysRemaining} days (28th of month)`,
      action: 'Renew soon'
    });
  }
  
  return warnings;
};

// Initialize new subscription for lender
export const initializeLenderSubscription = (tierId, duration, country) => {
  const tier = getSubscriptionTier(tierId);
  const cost = calculateSubscriptionCost(tierId, duration);
  const expiryDate = calculateExpiryDate();
  
  return {
    id: `sub-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    tier: tierId,
    status: SUBSCRIPTION_STATUS.PENDING,
    startDate: new Date().toISOString(),
    expiryDate: expiryDate.toISOString(),
    duration,
    cost,
    country,
    currency: getCountryCurrency(country),
    paymentRequired: true,
    features: {
      weeklyLimit: tier.weeklyLimit,
      ledgerLimit: tier.ledgerLimit,
      crbRequired: tier.crbCheck,
      maxGroups: 4 // Maximum groups a lender can belong to
    },
    restrictions: {
      canLend: false, // Must pay first
      canCreateLedgers: false,
      canJoinGroups: true,
      canInvite: true
    }
  };
};

// Get country-specific currency
const getCountryCurrency = (country) => {
  const countryCurrencies = {
    'kenya': 'KSh',
    'uganda': 'UGX',
    'tanzania': 'TZS',
    'rwanda': 'RWF',
    'drc': 'CDF',
    'burundi': 'BIF',
    'nigeria': 'NGN',
    'ghana': 'GHS',
    'south-sudan': 'SSP',
    'somalia': 'SOS',
    'south-africa': 'ZAR',
    'ethiopia': 'ETB'
  };
  
  return countryCurrencies[country?.toLowerCase()] || 'KSh';
};

// Export subscription utility functions
export default {
  SUBSCRIPTION_TIERS,
  SUBSCRIPTION_STATUS,
  calculateExpiryDate,
  daysUntilExpiry,
  isSubscriptionExpired,
  getSubscriptionTier,
  calculateSubscriptionCost,
  validateLendingLimit,
  requiresCRBCheck,
  renewSubscription,
  processSubscriptionPayment,
  getSubscriptionSummary,
  handleSubscriptionExpiry,
  getSubscriptionWarnings,
  initializeLenderSubscription
};