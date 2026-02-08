/**
 * M-PESEWA Country Guard
 * Strictly enforces country isolation rules per Section A
 * Global → Country → Groups → Lenders → Borrowers hierarchy
 */

import { getCurrentUser, getUserCountry, isValidCountry } from '../state/store.js';
import { navigateTo } from './router.js';
import { logAuditEvent } from '../audit/audit-log.js';
import { COUNTRIES } from '../core/constants.js';

/**
 * Country Guard - Enforces country isolation rules
 * @param {Object} context - Route context
 * @param {Function} next - Next middleware function
 * @returns {Promise<void>}
 */
export const countryGuard = async (context, next) => {
  try {
    console.log('🔐 Country Guard: Checking country isolation rules...');
    
    // Get current user from state
    const user = getCurrentUser();
    
    // If no user is logged in, skip country checks for public routes
    if (!user) {
      console.log('Country Guard: No user logged in, proceeding...');
      return await next();
    }
    
    // Extract country from route or user context
    const routeCountry = extractCountryFromRoute(context.path);
    const userCountry = getUserCountry();
    
    console.log(`Country Guard: Route Country = ${routeCountry}, User Country = ${userCountry}`);
    
    // STRICT RULE: Country must be set for authenticated users
    if (!userCountry) {
      console.warn('❌ Country Guard: User has no country set!');
      logAuditEvent('COUNTRY_VIOLATION', {
        userId: user.id,
        route: context.path,
        reason: 'User country not set'
      });
      
      // Redirect to country selection page
      navigateTo('/countries/select');
      return;
    }
    
    // STRICT RULE: Validate country code
    if (!isValidCountry(userCountry)) {
      console.error(`❌ Country Guard: Invalid country code "${userCountry}"`);
      logAuditEvent('COUNTRY_INVALID', {
        userId: user.id,
        country: userCountry,
        route: context.path
      });
      
      navigateTo('/countries/invalid');
      return;
    }
    
    // STRICT RULE: Country-locked routes must match user's country
    if (isCountrySpecificRoute(context.path) && routeCountry && routeCountry !== userCountry) {
      console.error(`❌ Country Guard: Cross-country access attempt! User: ${userCountry}, Route: ${routeCountry}`);
      
      logAuditEvent('CROSS_COUNTRY_VIOLATION', {
        userId: user.id,
        userCountry: userCountry,
        routeCountry: routeCountry,
        route: context.path,
        ip: context.ip,
        userAgent: context.userAgent
      });
      
      // Block access and show violation message
      showCountryViolationError(userCountry, routeCountry);
      return;
    }
    
    // STRICT RULE: No cross-country operations
    const operation = detectCrossCountryOperation(context);
    if (operation) {
      console.error(`❌ Country Guard: Cross-country operation detected: ${operation.type}`);
      
      logAuditEvent('CROSS_COUNTRY_OPERATION', {
        userId: user.id,
        operation: operation.type,
        details: operation.details,
        sourceCountry: userCountry,
        targetCountry: operation.targetCountry
      });
      
      // Block the operation
      throw new Error(`Cross-country operations are strictly prohibited. Your country: ${userCountry}`);
    }
    
    // STRICT RULE: Country cannot be changed after registration
    if (isCountryChangeAttempt(context)) {
      console.warn('❌ Country Guard: Country change attempt detected');
      
      logAuditEvent('COUNTRY_CHANGE_ATTEMPT', {
        userId: user.id,
        currentCountry: userCountry,
        attemptedCountry: extractCountryFromRequest(context),
        route: context.path
      });
      
      // Show error - country is locked
      showCountryLockedError();
      return;
    }
    
    // All country rules passed
    console.log(`✅ Country Guard: Access granted for ${userCountry}`);
    
    // Add country context to route
    context.country = userCountry;
    context.countryData = COUNTRIES[userCountry] || {};
    
    // Proceed to next guard/route
    await next();
    
  } catch (error) {
    console.error('Country Guard Error:', error);
    
    // Log critical violation
    logAuditEvent('COUNTRY_GUARD_FAILURE', {
      error: error.message,
      stack: error.stack,
      route: context?.path,
      userId: getCurrentUser()?.id
    });
    
    // Show appropriate error based on violation type
    if (error.message.includes('Cross-country')) {
      showCrossCountryError();
    } else {
      // Redirect to country error page
      navigateTo('/error/country-violation');
    }
  }
};

/**
 * Extract country code from route path
 * @param {string} path - Route path
 * @returns {string|null} Country code or null
 */
function extractCountryFromRoute(path) {
  const countryPattern = /\/(KE|UG|TZ|RW|BI|SS|SO|CD|NG|GH|ZA|ET|kenya|uganda|tanzania|rwanda|burundi|south-sudan|somalia|drc|nigeria|ghana|south-africa|ethiopia)/i;
  const match = path.match(countryPattern);
  
  if (match) {
    const countryCode = match[1].toUpperCase();
    // Convert full names to codes
    const nameToCode = {
      'KENYA': 'KE', 'UGANDA': 'UG', 'TANZANIA': 'TZ', 'RWANDA': 'RW',
      'BURUNDI': 'BI', 'SOUTH-SUDAN': 'SS', 'SOMALIA': 'SO', 'DRC': 'CD',
      'NIGERIA': 'NG', 'GHANA': 'GH', 'SOUTH-AFRICA': 'ZA', 'ETHIOPIA': 'ET'
    };
    
    return nameToCode[countryCode] || countryCode;
  }
  
  return null;
}

/**
 * Check if route is country-specific
 * @param {string} path - Route path
 * @returns {boolean}
 */
function isCountrySpecificRoute(path) {
  const countryRoutes = [
    /\/countries\/[^/]+/,
    /\/groups\/[^/]+\/[^/]+/,
    /\/lender\/(dashboard|portfolio|history)/,
    /\/borrower\/(dashboard|apply|history)/,
    /\/ledger\//,
    /\/subscription\/(current|upgrade)/,
    /\/emergency\//
  ];
  
  return countryRoutes.some(pattern => pattern.test(path));
}

/**
 * Detect cross-country operations in requests
 * @param {Object} context - Route context
 * @returns {Object|null} Operation details or null
 */
function detectCrossCountryOperation(context) {
  const { method, body, query, path } = context;
  
  // Check for cross-group lending/borrowing attempts
  if (method === 'POST' && body) {
    // Loan requests
    if (path.includes('/borrower/apply') || path.includes('/lender/approve')) {
      if (body.groupId && body.targetCountry) {
        const userCountry = getUserCountry();
        if (body.targetCountry && body.targetCountry !== userCountry) {
          return {
            type: 'CROSS_COUNTRY_LOAN',
            details: `Loan operation from ${userCountry} to ${body.targetCountry}`,
            targetCountry: body.targetCountry
          };
        }
      }
    }
    
    // Group invitations
    if (path.includes('/groups/invite') && body.invitees) {
      const userCountry = getUserCountry();
      for (const invitee of body.invitees) {
        if (invitee.country && invitee.country !== userCountry) {
          return {
            type: 'CROSS_COUNTRY_INVITATION',
            details: `Inviting user from ${invitee.country} to group in ${userCountry}`,
            targetCountry: invitee.country
          };
        }
      }
    }
  }
  
  // Check query parameters for cross-country attempts
  if (query && query.country) {
    const userCountry = getUserCountry();
    if (query.country !== userCountry) {
      return {
        type: 'CROSS_COUNTRY_QUERY',
        details: `Query parameter country mismatch`,
        targetCountry: query.country
      };
    }
  }
  
  return null;
}

/**
 * Check if user is attempting to change country
 * @param {Object} context - Route context
 * @returns {boolean}
 */
function isCountryChangeAttempt(context) {
  const { path, method, body } = context;
  const user = getCurrentUser();
  
  // Only check for authenticated users with existing country
  if (!user || !user.country) return false;
  
  // Country selection/change routes
  if (path.includes('/countries/select') || path.includes('/countries/change')) {
    if (method === 'POST' && body && body.country) {
      return body.country !== user.country;
    }
    return true;
  }
  
  return false;
}

/**
 * Extract country from request
 * @param {Object} context - Route context
 * @returns {string|null}
 */
function extractCountryFromRequest(context) {
  return context.body?.country || context.query?.country || null;
}

/**
 * Show cross-country violation error
 */
function showCrossCountryError() {
  const errorHtml = `
    <div class="country-violation-error">
      <div class="error-icon">🚫</div>
      <h2>Cross-Country Access Violation</h2>
      <p>Your account is registered in <strong>${getUserCountry()}</strong>.</p>
      <p>Accessing resources from other countries is strictly prohibited by M-Pesewa's country isolation rules.</p>
      <div class="violation-details">
        <h3>Strict Rules Enforced:</h3>
        <ul>
          <li>✅ No cross-country lending or borrowing</li>
          <li>✅ Groups are country-locked</li>
          <li>✅ Country selection is permanent after registration</li>
          <li>✅ Each country operates under local regulations</li>
        </ul>
      </div>
      <div class="error-actions">
        <button onclick="window.location.href='/countries/${getUserCountry()}'" class="btn btn-primary">
          Return to ${COUNTRIES[getUserCountry()]?.name || getUserCountry()} Dashboard
        </button>
        <button onclick="window.history.back()" class="btn btn-outline">
          Go Back
        </button>
      </div>
    </div>
  `;
  
  document.body.innerHTML = errorHtml;
}

/**
 * Show country violation error with details
 * @param {string} userCountry - User's registered country
 * @param {string} routeCountry - Route's country
 */
function showCountryViolationError(userCountry, routeCountry) {
  const userCountryName = COUNTRIES[userCountry]?.name || userCountry;
  const routeCountryName = COUNTRIES[routeCountry]?.name || routeCountry;
  
  const errorHtml = `
    <div class="country-mismatch-error" style="
      max-width: 600px;
      margin: 40px auto;
      padding: 30px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      text-align: center;
    ">
      <div style="font-size: 64px; margin-bottom: 20px;">🇰🇪</div>
      <h2 style="color: #003366; margin-bottom: 15px;">Country Access Violation</h2>
      <p style="color: #555; margin-bottom: 20px;">
        Your account is registered in <strong style="color: #003366;">${userCountryName}</strong>, 
        but you're trying to access resources in <strong style="color: #dc3545;">${routeCountryName}</strong>.
      </p>
      
      <div style="
        background: #f8f9fa;
        border-left: 4px solid #003366;
        padding: 15px;
        margin: 20px 0;
        text-align: left;
        border-radius: 4px;
      ">
        <h4 style="color: #003366; margin-bottom: 10px;">Strict Country Isolation Rules:</h4>
        <ul style="color: #555; padding-left: 20px;">
          <li>Each country operates independently</li>
          <li>No cross-country lending or borrowing</li>
          <li>Groups cannot contain members from different countries</li>
          <li>Country selection is locked after registration</li>
        </ul>
      </div>
      
      <div style="display: flex; gap: 15px; justify-content: center; margin-top: 30px;">
        <button onclick="window.location.href='/countries/${userCountry}'" style="
          background: #003366;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        ">
          Go to ${userCountryName} Dashboard
        </button>
        <button onclick="window.location.href='/'" style="
          background: white;
          color: #003366;
          border: 2px solid #003366;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        ">
          Return Home
        </button>
      </div>
      
      <div style="
        margin-top: 30px;
        padding-top: 20px;
        border-top: 1px solid #eee;
        font-size: 12px;
        color: #888;
      ">
        <p>Need to operate in multiple countries? You must create separate accounts for each country.</p>
      </div>
    </div>
  `;
  
  document.body.innerHTML = errorHtml;
}

/**
 * Show country locked error
 */
function showCountryLockedError() {
  const userCountry = getUserCountry();
  const countryName = COUNTRIES[userCountry]?.name || userCountry;
  
  const errorHtml = `
    <div class="country-locked-error">
      <div class="locked-icon">🔒</div>
      <h2>Country Selection Locked</h2>
      <p>Your account is permanently registered in <strong>${countryName}</strong>.</p>
      <p>For regulatory compliance and trust maintenance, country selection cannot be changed after registration.</p>
      <div class="compliance-notice">
        <h3>Compliance Reasons:</h3>
        <ul>
          <li>Each country has different financial regulations</li>
          <li>Trust networks are built within country boundaries</li>
          <li>Currency operations are country-specific</li>
          <li>Legal jurisdiction is country-based</li>
        </ul>
      </div>
      <div class="actions">
        <button onclick="window.history.back()" class="btn btn-primary">Go Back</button>
      </div>
    </div>
  `;
  
  // Create and show modal
  const modal = document.createElement('div');
  modal.className = 'country-locked-modal';
  modal.innerHTML = errorHtml;
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
    z-index: 10000;
  `;
  
  document.body.appendChild(modal);
}

/**
 * Initialize country guard on page load
 */
export function initializeCountryGuard() {
  console.log('🌍 Country Guard: Initializing country isolation rules...');
  
  // Listen for route changes
  window.addEventListener('popstate', handleCountryRouteChange);
  
  // Monitor AJAX requests for cross-country attempts
  interceptAjaxRequests();
  
  // Add country badge to UI
  addCountryBadgeToUI();
  
  console.log('✅ Country Guard: Initialized successfully');
}

/**
 * Handle route changes for country validation
 */
function handleCountryRouteChange() {
  const currentPath = window.location.pathname;
  const country = extractCountryFromRoute(currentPath);
  const userCountry = getUserCountry();
  
  if (country && userCountry && country !== userCountry) {
    console.warn('Country mismatch detected on route change');
    showCountryViolationError(userCountry, country);
    return false;
  }
  
  return true;
}

/**
 * Intercept AJAX requests to check for cross-country operations
 */
function interceptAjaxRequests() {
  const originalFetch = window.fetch;
  
  window.fetch = async function(...args) {
    const [resource, config = {}] = args;
    const userCountry = getUserCountry();
    
    // Check for cross-country operations in request body
    if (config.body) {
      try {
        const body = typeof config.body === 'string' ? JSON.parse(config.body) : config.body;
        
        if (body.country && body.country !== userCountry) {
          console.error('❌ AJAX Cross-country attempt blocked');
          throw new Error(`Cross-country operation prohibited. Your country: ${userCountry}`);
        }
        
        // Check for group operations with mixed countries
        if (body.groupId && body.members) {
          for (const member of body.members) {
            if (member.country && member.country !== userCountry) {
              throw new Error(`Cannot add member from ${member.country} to group in ${userCountry}`);
            }
          }
        }
      } catch (error) {
        // Not JSON, skip check
      }
    }
    
    return originalFetch.apply(this, args);
  };
}

/**
 * Add country badge to UI
 */
function addCountryBadgeToUI() {
  const userCountry = getUserCountry();
  if (!userCountry) return;
  
  const countryData = COUNTRIES[userCountry];
  if (!countryData) return;
  
  // Create country badge
  const badge = document.createElement('div');
  badge.className = 'country-badge-guard';
  badge.innerHTML = `
    <span class="country-flag">${countryData.flag}</span>
    <span class="country-name">${countryData.name}</span>
    <span class="country-lock">🔒</span>
  `;
  
  badge.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: ${countryData.color || '#003366'};
    color: white;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
    z-index: 9999;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    cursor: default;
  `;
  
  document.body.appendChild(badge);
}

/**
 * Get country-specific configuration
 * @param {string} countryCode - Country code
 * @returns {Object} Country configuration
 */
export function getCountryConfig(countryCode) {
  const configs = {
    KE: { currency: 'KSh', timezone: 'Africa/Nairobi', locale: 'sw-KE', taxRate: 0.16 },
    UG: { currency: 'UGX', timezone: 'Africa/Kampala', locale: 'sw-UG', taxRate: 0.18 },
    TZ: { currency: 'TZS', timezone: 'Africa/Dar_es_Salaam', locale: 'sw-TZ', taxRate: 0.18 },
    RW: { currency: 'RWF', timezone: 'Africa/Kigali', locale: 'rw-RW', taxRate: 0.18 },
    BI: { currency: 'BIF', timezone: 'Africa/Bujumbura', locale: 'rn-BI', taxRate: 0.18 },
    SS: { currency: 'SSP', timezone: 'Africa/Juba', locale: 'en-SS', taxRate: 0.15 },
    SO: { currency: 'SOS', timezone: 'Africa/Mogadishu', locale: 'so-SO', taxRate: 0.10 },
    CD: { currency: 'CDF', timezone: 'Africa/Kinshasa', locale: 'fr-CD', taxRate: 0.16 },
    NG: { currency: 'NGN', timezone: 'Africa/Lagos', locale: 'en-NG', taxRate: 0.075 },
    GH: { currency: 'GHS', timezone: 'Africa/Accra', locale: 'en-GH', taxRate: 0.15 },
    ZA: { currency: 'ZAR', timezone: 'Africa/Johannesburg', locale: 'en-ZA', taxRate: 0.15 },
    ET: { currency: 'ETB', timezone: 'Africa/Addis_Ababa', locale: 'am-ET', taxRate: 0.15 }
  };
  
  return configs[countryCode] || configs.KE;
}

/**
 * Validate country-specific operations
 * @param {Object} operation - Operation details
 * @returns {Object} Validation result
 */
export function validateCountryOperation(operation) {
  const userCountry = getUserCountry();
  const errors = [];
  
  // Check if operation involves multiple countries
  if (operation.countries && operation.countries.length > 1) {
    errors.push('Multi-country operations are prohibited');
  }
  
  // Check if target country matches user country
  if (operation.targetCountry && operation.targetCountry !== userCountry) {
    errors.push(`Operation targets ${operation.targetCountry} but user is in ${userCountry}`);
  }
  
  // Check currency compatibility
  if (operation.currency) {
    const countryConfig = getCountryConfig(userCountry);
    if (operation.currency !== countryConfig.currency) {
      errors.push(`Currency mismatch: ${operation.currency} vs ${countryConfig.currency}`);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
    userCountry
  };
}

// Export guard as default
export default countryGuard;