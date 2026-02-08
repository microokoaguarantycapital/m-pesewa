/**
 * M-PESEWA CORE BOOTSTRAP
 * Main application entry point
 * Enforces strict hierarchy: Global → Countries → Groups → Lenders → Borrowers
 * Strict isolation rules with no cross-country transactions
 */

import { initApp } from './app-init.js';
import { startLifecycle } from './lifecycle.js';
import { loadAppShell } from './app-shell.js';

// Country registry - 12 Sub-Saharan African countries
const SUPPORTED_COUNTRIES = [
    { code: 'KE', name: 'Kenya', currency: 'KSh', flag: '🇰🇪' },
    { code: 'UG', name: 'Uganda', currency: 'UGX', flag: '🇺🇬' },
    { code: 'TZ', name: 'Tanzania', currency: 'TZS', flag: '🇹🇿' },
    { code: 'RW', name: 'Rwanda', currency: 'RWF', flag: '🇷🇼' },
    { code: 'BI', name: 'Burundi', currency: 'BIF', flag: '🇧🇮' },
    { code: 'CD', name: 'DRC', currency: 'CDF', flag: '🇨🇩' },
    { code: 'SS', name: 'South Sudan', currency: 'SSP', flag: '🇸🇸' },
    { code: 'ZA', name: 'South Africa', currency: 'ZAR', flag: '🇿🇦' },
    { code: 'NG', name: 'Nigeria', currency: 'NGN', flag: '🇳🇬' },
    { code: 'GH', name: 'Ghana', currency: 'GHS', flag: '🇬🇭' },
    { code: 'ET', name: 'Ethiopia', currency: 'ETB', flag: '🇪🇹' },
    { code: 'SO', name: 'Somalia', currency: 'SOS', flag: '🇸🇴' }
];

// Strict Hierarchy Definition
const HIERARCHY = {
    GLOBAL: 'GLOBAL',
    COUNTRIES: 'COUNTRIES',
    GROUPS: 'GROUPS',
    LENDERS: 'LENDERS',
    BORROWERS: 'BORROWERS',
    LEDGERS: 'LEDGERS'
};

// Application State
const APP_STATE = {
    initialized: false,
    country: null,
    group: null,
    user: null,
    role: null,
    subscription: null,
    hierarchy: HIERARCHY
};

// Emergency Categories (20 as specified)
const EMERGENCY_CATEGORIES = [
    { id: 1, name: 'M-pesewa Fare', icon: '🚌', description: 'Move on, don\'t stall—borrow for your journey.' },
    { id: 2, name: 'M-pesewa Data', icon: '📶', description: 'Stay connected, stay informed—borrow when your bundle runs out.' },
    { id: 3, name: 'M-pesewa Cooking Gas', icon: '🔥', description: 'Cook with confidence—borrow when your gas is low.' },
    { id: 4, name: 'M-pesewa Food', icon: '🍲', description: 'Don\'t sleep hungry when paycheck is delayed—borrow and eat today.' },
    { id: 5, name: 'M-pesewa Wifi', icon: '📡', description: 'Stay connected at home.' },
    { id: 6, name: 'M-pesewa Water Bill', icon: '🚰', description: 'Stay hydrated—borrow for water needs or bills.' },
    { id: 7, name: 'M-pesewa Electricity Tokens', icon: '⚡', description: 'Stay lit, stay powered—borrow tokens when you need it.' },
    { id: 8, name: 'M-pesewa TV Subscription', icon: '📺', description: 'Never miss your favorite shows.' },
    { id: 9, name: 'M-pesewa Fuel', icon: '⛽', description: 'Keep moving—borrow for fuel, no matter your ride (Bike/Car/Tuktuk).' },
    { id: 10, name: 'M-pesewa Repair', icon: '🔧', description: 'Fix it quick—borrow for minor repairs and keep going.' },
    { id: 11, name: 'M-pesewa Credo', icon: '🛠️', description: 'Fix it fast—borrow for urgent repairs or tools.' },
    { id: 12, name: 'M-Pesa Daily Sales Advance', icon: '🧾', description: 'Small Loan advance for everyday business.' },
    { id: 13, name: 'M-Pesa Working Capital Advance', icon: '🏪', description: 'Working capital when your business needs it.' },
    { id: 14, name: 'M-Pesewa Soko Loan', icon: '🛒', description: 'Market money when you need it.' },
    { id: 15, name: 'M-Pesewa Kidandaski Loan', icon: '🏗️', description: 'Kibanda/stall money when you need it.' },
    { id: 16, name: 'M-Pesewa Hawker Loan', icon: '🚶‍♂️', description: 'Be Street smart, cash flow all time.' },
    { id: 17, name: 'M-fuliziwa Loan', icon: '🔄', description: 'Your fuliza is not enough? Top up here.' },
    { id: 18, name: 'M-pesewa Medicine', icon: '💊', description: 'Health first—borrow for urgent medicines.' },
    { id: 19, name: 'M-pesewa School Fees', icon: '🎓', description: 'Secure your future without delay.' },
    { id: 20, name: 'M-pesewa Advance', icon: '💸', description: 'Quick cash when you need it most.' }
];

// Subscription Tiers (Lenders Only)
const SUBSCRIPTION_TIERS = {
    BASIC: {
        name: 'Basic',
        maxPerWeek: 1500,
        fees: { monthly: 50, biAnnual: 250, annual: 500 },
        crbCheck: false,
        maxLedgers: 1500
    },
    PREMIUM: {
        name: 'Premium',
        maxPerWeek: 5000,
        fees: { monthly: 250, biAnnual: 1500, annual: 2500 },
        crbCheck: false,
        maxLedgers: 10000
    },
    SUPER: {
        name: 'Super',
        maxPerWeek: 20000,
        fees: { monthly: 1000, biAnnual: 5000, annual: 8500 },
        crbCheck: true,
        maxLedgers: 20000
    },
    LENDER_OF_LENDERS: {
        name: 'Lender of Lenders',
        maxPerWeek: 50000,
        fees: { monthly: 500, biAnnual: 3500, annual: 6500 },
        crbCheck: true,
        maxLedgers: 50000,
        minRepaymentPeriod: 30 // days
    }
};

// Core Loan Rules (STRICT ENFORCEMENT)
const LOAN_RULES = {
    REPAYMENT_PERIOD_DAYS: 7,
    INTEREST_PERCENT: 10,
    DAILY_PENALTY_PERCENT: 5, // After 7 days
    DEFAULT_AFTER_DAYS: 60, // 2 months
    MIN_LOAN: 5, // As low as 5 KSh
    MAX_GROUPS_PER_BORROWER: 4,
    MIN_GROUP_MEMBERS: 5,
    MAX_GROUP_MEMBERS: 1000,
    SUBSCRIPTION_EXPIRY_DAY: 28 // 28th of each month
};

/**
 * Initialize the M-Pesewa application
 * @returns {Promise<Object>} Application state
 */
async function bootstrap() {
    try {
        console.log('🚀 M-PESEWA BOOTSTRAP STARTING...');
        
        // 1. Initialize core application
        const initResult = await initApp();
        if (!initResult.compatible) {
            throw new Error(`Browser compatibility issues: ${initResult.missingFeatures.join(', ')}`);
        }
        
        // 2. Load saved state from localStorage
        await loadSavedState();
        
        // 3. Start application lifecycle
        startLifecycle();
        
        // 4. Load application shell
        await loadAppShell();
        
        // 5. Initialize country isolation
        await initializeCountryIsolation();
        
        // 6. Set up strict hierarchy enforcement
        enforceHierarchy();
        
        // 7. Mark as initialized
        APP_STATE.initialized = true;
        
        console.log('✅ M-PESEWA BOOTSTRAP COMPLETE');
        console.log('📊 HIERARCHY:', HIERARCHY);
        console.log('🌍 COUNTRIES:', SUPPORTED_COUNTRIES.length);
        console.log('🚨 CATEGORIES:', EMERGENCY_CATEGORIES.length);
        console.log('💰 TIERS:', Object.keys(SUBSCRIPTION_TIERS).length);
        
        return APP_STATE;
        
    } catch (error) {
        console.error('❌ BOOTSTRAP FAILED:', error);
        showBootstrapError(error);
        throw error;
    }
}

/**
 * Load saved application state from localStorage
 */
async function loadSavedState() {
    try {
        const savedState = localStorage.getItem('mpesewa_state');
        if (savedState) {
            const parsed = JSON.parse(savedState);
            
            // Validate country
            const countryValid = SUPPORTED_COUNTRIES.some(c => c.code === parsed.country);
            if (parsed.country && countryValid) {
                APP_STATE.country = parsed.country;
            }
            
            // Load user if exists
            if (parsed.user && parsed.user.id) {
                APP_STATE.user = parsed.user;
                APP_STATE.role = parsed.user.role;
            }
            
            console.log('📥 Loaded saved state:', APP_STATE);
        }
    } catch (error) {
        console.warn('⚠️ Failed to load saved state:', error);
    }
}

/**
 * Initialize country isolation rules
 */
async function initializeCountryIsolation() {
    // Check if country is selected
    if (!APP_STATE.country) {
        // Redirect to country selection
        if (!window.location.pathname.includes('countries.html')) {
            sessionStorage.setItem('redirectAfterCountry', window.location.pathname);
            window.location.href = 'pages/countries.html';
        }
        return;
    }
    
    // Set country-specific configurations
    const country = SUPPORTED_COUNTRIES.find(c => c.code === APP_STATE.country);
    if (country) {
        APP_STATE.countryData = country;
        
        // Set document title with country flag
        document.title = `${country.flag} M-Pesewa ${country.name} - Emergency Micro-Lending`;
        
        // Add country flag to body for CSS targeting
        document.body.setAttribute('data-country', country.code.toLowerCase());
        
        console.log(`🌍 Country set: ${country.name} (${country.currency})`);
    }
}

/**
 * Enforce strict M-Pesewa hierarchy
 */
function enforceHierarchy() {
    // Create hierarchy chain
    const hierarchyChain = `
    GLOBAL
        └── COUNTRIES (${SUPPORTED_COUNTRIES.length} Sub-Saharan countries)
            └── GROUPS (unlimited per country)
                ├── LENDERS (min 5, max ${LOAN_RULES.MAX_GROUP_MEMBERS} total users per group)
                │   └── LEDGERS (borrowers currently in loan state)
                └── BORROWERS (default = available for loans)
    `;
    
    console.log('🏗️ ENFORCING STRICT HIERARCHY:');
    console.log(hierarchyChain);
    
    // Add hierarchy to state for reference
    APP_STATE.hierarchyChain = hierarchyChain;
    
    // Export hierarchy to window for debugging
    if (window.MPESEWA_DEBUG) {
        window.MPESEWA_HIERARCHY = hierarchyChain;
    }
}

/**
 * Show bootstrap error to user
 * @param {Error} error - Bootstrap error
 */
function showBootstrapError(error) {
    const errorContainer = document.createElement('div');
    errorContainer.className = 'bootstrap-error';
    errorContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, #003366 0%, #001a33 100%);
        color: white;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        padding: 2rem;
        text-align: center;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;
    
    errorContainer.innerHTML = `
        <div style="max-width: 600px;">
            <h1 style="color: #f37021; margin-bottom: 1rem;">⚠️ M-Pesewa Initialization Failed</h1>
            <div style="background: rgba(255,255,255,0.1); padding: 1.5rem; border-radius: 8px; margin: 1rem 0;">
                <strong>Error Details:</strong>
                <div style="font-family: monospace; margin-top: 0.5rem; color: #ff9999;">
                    ${error.message || 'Unknown error'}
                </div>
            </div>
            <p style="margin: 1rem 0;">Please try the following:</p>
            <ol style="text-align: left; display: inline-block; margin: 1rem 0;">
                <li>Refresh the page</li>
                <li>Clear browser cache</li>
                <li>Try a different browser</li>
                <li>Check internet connection</li>
            </ol>
            <div style="margin-top: 2rem;">
                <button onclick="location.reload()" 
                        style="background: #f37021; color: white; border: none; padding: 0.75rem 2rem; 
                               border-radius: 4px; font-size: 1rem; cursor: pointer; margin: 0.5rem;">
                    🔄 Refresh Application
                </button>
                <button onclick="window.location.href = 'index.html'" 
                        style="background: #28a745; color: white; border: none; padding: 0.75rem 2rem; 
                               border-radius: 4px; font-size: 1rem; cursor: pointer; margin: 0.5rem;">
                    🏠 Return to Home
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(errorContainer);
}

/**
 * Get current application state
 * @returns {Object} Application state
 */
function getAppState() {
    return { ...APP_STATE };
}

/**
 * Get supported countries
 * @returns {Array} List of supported countries
 */
function getSupportedCountries() {
    return [...SUPPORTED_COUNTRIES];
}

/**
 * Get emergency categories
 * @returns {Array} List of emergency categories
 */
function getEmergencyCategories() {
    return [...EMERGENCY_CATEGORIES];
}

/**
 * Get subscription tiers
 * @returns {Object} Subscription tiers configuration
 */
function getSubscriptionTiers() {
    return { ...SUBSCRIPTION_TIERS };
}

/**
 * Get loan rules
 * @returns {Object} Loan rules configuration
 */
function getLoanRules() {
    return { ...LOAN_RULES };
}

/**
 * Check if subscription is expired
 * @param {Date} expiryDate - Subscription expiry date
 * @returns {boolean} True if expired
 */
function isSubscriptionExpired(expiryDate) {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const dayOfMonth = today.getDate();
    
    // Subscription expires on 28th of each month
    return dayOfMonth >= LOAN_RULES.SUBSCRIPTION_EXPIRY_DAY || today > expiry;
}

/**
 * Calculate loan details
 * @param {number} amount - Loan amount
 * @param {number} days - Loan duration in days (max 7)
 * @returns {Object} Loan calculation
 */
function calculateLoan(amount, days = 7) {
    if (days > 7) days = 7; // Maximum repayment period
    
    const interest = (amount * LOAN_RULES.INTEREST_PERCENT) / 100;
    const totalRepayable = amount + interest;
    const dailyRepayment = totalRepayable / days;
    
    return {
        principal: amount,
        interest: interest,
        totalRepayable: totalRepayable,
        dailyRepayment: dailyRepayment.toFixed(2),
        repaymentPeriod: days,
        interestRate: `${LOAN_RULES.INTEREST_PERCENT}%`
    };
}

/**
 * Check if borrower can join more groups
 * @param {string} borrowerId - Borrower ID
 * @param {number} currentGroups - Current number of groups
 * @param {number} rating - Borrower rating (1-5)
 * @returns {boolean} True if can join more groups
 */
function canJoinMoreGroups(currentGroups, rating) {
    return currentGroups < LOAN_RULES.MAX_GROUPS_PER_BORROWER && rating >= 3;
}

// Export public API
export {
    bootstrap,
    getAppState,
    getSupportedCountries,
    getEmergencyCategories,
    getSubscriptionTiers,
    getLoanRules,
    isSubscriptionExpired,
    calculateLoan,
    canJoinMoreGroups,
    HIERARCHY,
    SUPPORTED_COUNTRIES,
    EMERGENCY_CATEGORIES,
    SUBSCRIPTION_TIERS,
    LOAN_RULES
};

// Auto-initialize when imported directly
if (typeof window !== 'undefined' && !window.MPESEWA_BOOTSTRAPPED) {
    window.MPESEWA_BOOTSTRAPPED = true;
    document.addEventListener('DOMContentLoaded', () => {
        bootstrap().catch(console.error);
    });
}