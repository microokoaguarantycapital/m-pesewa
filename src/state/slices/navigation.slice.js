/**
 * M-PESEWA NAVIGATION SLICE
 * Strict hierarchy enforcement: Global → Countries → Groups → Lenders → Borrowers
 * Non-negotiable structure following Section A requirements
 */

import { createSlice } from './store.core.js';

// Initial state with strict hierarchy enforcement
const initialState = {
  // Global Navigation State
  isMobileMenuOpen: false,
  activeTab: 'home',
  activeRole: null, // 'lender' or 'borrower' or null
  
  // Strict Hierarchy State - MANDATORY STRUCTURE
  hierarchy: {
    level: 'global', // global → country → group → lender/borrower
    currentCountry: null, // ISO code of selected country
    currentGroup: null, // ID of selected group
    currentLender: null, // ID if user is lender
    currentBorrower: null, // ID if user is borrower
    availableCountries: [
      // 12 Sub-Saharan African countries - NON-NEGOTIABLE
      { code: 'KE', name: 'Kenya', currency: 'KSh', flag: '🇰🇪', enabled: true },
      { code: 'UG', name: 'Uganda', currency: 'UGX', flag: '🇺🇬', enabled: true },
      { code: 'TZ', name: 'Tanzania', currency: 'TZS', flag: '🇹🇿', enabled: true },
      { code: 'RW', name: 'Rwanda', currency: 'RWF', flag: '🇷🇼', enabled: true },
      { code: 'CD', name: 'DRC', currency: 'CDF', flag: '🇨🇩', enabled: true },
      { code: 'BI', name: 'Burundi', currency: 'BIF', flag: '🇧🇮', enabled: true },
      { code: 'NG', name: 'Nigeria', currency: 'NGN', flag: '🇳🇬', enabled: true },
      { code: 'GH', name: 'Ghana', currency: 'GHS', flag: '🇬🇭', enabled: true },
      { code: 'SS', name: 'South Sudan', currency: 'SSP', flag: '🇸🇸', enabled: true },
      { code: 'SO', name: 'Somalia', currency: 'SOS', flag: '🇸🇴', enabled: true },
      { code: 'ZA', name: 'South Africa', currency: 'ZAR', flag: '🇿🇦', enabled: true },
      { code: 'ET', name: 'Ethiopia', currency: 'ETB', flag: '🇪🇹', enabled: true }
    ],
    groups: [], // Groups in current country
    lenders: [], // Lenders in current group
    borrowers: [], // Borrowers in current group
    ledgers: [] // Ledgers for current lender
  },
  
  // Navigation Structure - Following Section C requirements
  menuStructure: {
    global: [
      { id: 'home', label: 'Home', path: '/', icon: '🏠', requiresAuth: false },
      { id: 'lenders', label: 'Lenders', type: 'dropdown', requiresAuth: false, children: [
        { id: 'lender-dashboard', label: 'Dashboard', path: '/lender/dashboard.html', requiresAuth: true, requiresRole: 'lender' },
        { id: 'lender-portfolio', label: 'Portfolio', path: '/lender/portfolio.html', requiresAuth: true, requiresRole: 'lender' },
        { id: 'lender-history', label: 'History', path: '/lender/history.html', requiresAuth: true, requiresRole: 'lender' },
        { id: 'lender-rules', label: 'Rules', path: '/lender/rules.html', requiresAuth: false },
        { id: 'lender-risk', label: 'Risk', path: '/lender/risk.html', requiresAuth: false }
      ]},
      { id: 'borrowers', label: 'Borrowers', type: 'dropdown', requiresAuth: false, children: [
        { id: 'borrower-dashboard', label: 'Dashboard', path: '/borrower/dashboard.html', requiresAuth: true, requiresRole: 'borrower' },
        { id: 'borrower-apply', label: 'Apply for Loan', path: '/borrower/apply.html', requiresAuth: true, requiresRole: 'borrower' },
        { id: 'borrower-history', label: 'Borrow History', path: '/borrower/history.html', requiresAuth: true, requiresRole: 'borrower' },
        { id: 'borrower-repayments', label: 'Repayments', path: '/borrower/repayments.html', requiresAuth: true, requiresRole: 'borrower' },
        { id: 'borrower-disputes', label: 'Disputes', path: '/borrower/disputes.html', requiresAuth: true, requiresRole: 'borrower' }
      ]},
      { id: 'emergency-hub', label: 'Emergency Hub', type: 'dropdown', requiresAuth: false, children: [
        { id: 'emergency-fare', label: '🚌 M-pesewa Fare', path: '/emergency/fare.html', category: 'Everyday Essentials' },
        { id: 'emergency-data', label: '📶 M-pesewa Data', path: '/emergency/data.html', category: 'Everyday Essentials' },
        { id: 'emergency-gas', label: '🔥 M-pesewa Cooking Gas', path: '/emergency/gas.html', category: 'Everyday Essentials' },
        { id: 'emergency-food', label: '🍲 M-pesewa Food', path: '/emergency/food.html', category: 'Everyday Essentials' },
        { id: 'emergency-wifi', label: '📡 M-pesewa Wifi', path: '/emergency/wifi.html', category: 'Everyday Essentials' },
        { id: 'emergency-water', label: '🚰 M-pesewa Water Bill', path: '/emergency/water.html', category: 'Everyday Essentials' },
        { id: 'emergency-electricity', label: '⚡ M-pesewa Electricity', path: '/emergency/electricity.html', category: 'Everyday Essentials' },
        { id: 'emergency-tv', label: '📺 M-pesewa TV Subscription', path: '/emergency/tv.html', category: 'Everyday Essentials' },
        { id: 'emergency-fuel', label: '⛽ M-pesewa Fuel', path: '/emergency/fuel.html', category: 'Logistics & Repairs' },
        { id: 'emergency-repair', label: '🔧 M-pesewa Repair', path: '/emergency/repair.html', category: 'Logistics & Repairs' },
        { id: 'emergency-credo', label: '🛠️ M-pesewa Credo', path: '/emergency/credo.html', category: 'Logistics & Repairs' },
        { id: 'emergency-sales', label: '🧾 M-Pesa Daily Sales', path: '/emergency/sales.html', category: 'Business & Growth' },
        { id: 'emergency-capital', label: '🏪 Working Capital', path: '/emergency/capital.html', category: 'Business & Growth' },
        { id: 'emergency-soko', label: '🛒 M-Pesewa Soko Loan', path: '/emergency/soko.html', category: 'Business & Growth' },
        { id: 'emergency-kidandaski', label: '🏗️ M-Pesewa Kidandaski', path: '/emergency/kidandaski.html', category: 'Business & Growth' },
        { id: 'emergency-hawker', label: '🚶‍♂️ M-Pesewa Hawker Loan', path: '/emergency/hawker.html', category: 'Business & Growth' },
        { id: 'emergency-fuliziwa', label: '🔄 M-fuliziwa Loan', path: '/emergency/fuliziwa.html', category: 'Business & Growth' },
        { id: 'emergency-medicine', label: '💊 M-pesewa Medicine', path: '/emergency/medicine.html', category: 'Health & Education' },
        { id: 'emergency-school', label: '🎓 M-pesewa School Fees', path: '/emergency/school.html', category: 'Health & Education' },
        { id: 'emergency-advance', label: '💸 M-pesewa Advance', path: '/emergency/advance.html', category: 'Health & Education' }
      ]},
      { id: 'subscription-plans', label: 'Subscription Plans', type: 'dropdown', requiresAuth: false, children: [
        { id: 'subscription-current', label: 'Current Plan', path: '/subscription/current.html', requiresAuth: true, requiresRole: 'lender' },
        { id: 'subscription-upgrade', label: 'Upgrade', path: '/subscription/upgrade.html', requiresAuth: false },
        { id: 'subscription-history', label: 'History', path: '/subscription/history.html', requiresAuth: true, requiresRole: 'lender' },
        { id: 'subscription-invoices', label: 'Invoices', path: '/subscription/invoices.html', requiresAuth: true, requiresRole: 'lender' }
      ]},
      { id: 'country', label: 'Country', type: 'dropdown', requiresAuth: false, children: [
        { id: 'country-ke', label: '🇰🇪 Kenya', path: '/countries/kenya.html', countryCode: 'KE' },
        { id: 'country-ug', label: '🇺🇬 Uganda', path: '/countries/uganda.html', countryCode: 'UG' },
        { id: 'country-tz', label: '🇹🇿 Tanzania', path: '/countries/tanzania.html', countryCode: 'TZ' },
        { id: 'country-rw', label: '🇷🇼 Rwanda', path: '/countries/rwanda.html', countryCode: 'RW' },
        { id: 'country-cd', label: '🇨🇩 DRC', path: '/countries/drc.html', countryCode: 'CD' },
        { id: 'country-bi', label: '🇧🇮 Burundi', path: '/countries/burundi.html', countryCode: 'BI' },
        { id: 'country-ng', label: '🇳🇬 Nigeria', path: '/countries/nigeria.html', countryCode: 'NG' },
        { id: 'country-gh', label: '🇬🇭 Ghana', path: '/countries/ghana.html', countryCode: 'GH' },
        { id: 'country-ss', label: '🇸🇸 South Sudan', path: '/countries/south-sudan.html', countryCode: 'SS' },
        { id: 'country-so', label: '🇸🇴 Somalia', path: '/countries/somalia.html', countryCode: 'SO' },
        { id: 'country-za', label: '🇿🇦 South Africa', path: '/countries/south-africa.html', countryCode: 'ZA' },
        { id: 'country-et', label: '🇪🇹 Ethiopia', path: '/countries/ethiopia.html', countryCode: 'ET' }
      ]}
    ]
  },
  
  // User's current path in hierarchy
  currentPath: {
    country: null,
    group: null,
    lenderId: null,
    borrowerId: null,
    ledgerId: null
  },
  
  // Breadcrumb trail for UI display
  breadcrumbs: [
    { label: 'Global', path: '/' }
  ],
  
  // Access control based on hierarchy
  accessControl: {
    canCrossCountry: false, // STRICT: No cross-country lending/borrowing
    canCrossGroup: false, // STRICT: Lenders can only lend within their group
    maxBorrowerGroups: 4, // STRICT: Maximum 4 groups for borrowers with good rating
    subscriptionRequired: false, // Lenders only
    subscriptionExpiryDate: 28 // 28th of each month
  },
  
  // UI State
  isLoading: false,
  lastNavigation: null,
  navigationHistory: [],
  permissions: {
    canViewLenderMenu: false,
    canViewBorrowerMenu: false,
    canViewEmergencyHub: true,
    canViewSubscriptionPlans: false,
    canSwitchCountry: true // Only before registration
  }
};

// Helper function to validate hierarchy transitions
const validateHierarchyTransition = (currentState, newState) => {
  const errors = [];
  
  // STRICT: No cross-country operations
  if (currentState.hierarchy.currentCountry && 
      newState.hierarchy.currentCountry && 
      currentState.hierarchy.currentCountry !== newState.hierarchy.currentCountry) {
    errors.push('CROSS_COUNTRY_VIOLATION: Cannot change country after registration');
  }
  
  // STRICT: Lenders can only lend within their group
  if (currentState.currentPath.group && 
      newState.currentPath.group && 
      currentState.currentPath.group !== newState.currentPath.group &&
      currentState.activeRole === 'lender') {
    errors.push('CROSS_GROUP_VIOLATION: Lenders cannot operate outside their group');
  }
  
  // STRICT: Borrower group limit
  if (currentState.activeRole === 'borrower' && 
      newState.hierarchy.groups && 
      newState.hierarchy.groups.length > 4) {
    errors.push('GROUP_LIMIT_VIOLATION: Borrowers cannot join more than 4 groups');
  }
  
  // STRICT: Subscription requirement for lenders
  if (currentState.activeRole === 'lender' && 
      !currentState.accessControl.subscriptionRequired) {
    errors.push('SUBSCRIPTION_VIOLATION: Lenders must have active subscription');
  }
  
  return errors;
};

// Helper to update breadcrumbs based on current path
const updateBreadcrumbs = (state) => {
  const crumbs = [{ label: 'Global', path: '/' }];
  
  if (state.currentPath.country) {
    const country = state.hierarchy.availableCountries.find(c => c.code === state.currentPath.country);
    crumbs.push({ 
      label: country ? country.name : 'Country', 
      path: `/countries/${state.currentPath.country.toLowerCase()}.html` 
    });
  }
  
  if (state.currentPath.group) {
    const group = state.hierarchy.groups.find(g => g.id === state.currentPath.group);
    crumbs.push({ 
      label: group ? group.name : 'Group', 
      path: `/groups/${state.currentPath.group}.html` 
    });
  }
  
  if (state.currentPath.lenderId) {
    crumbs.push({ 
      label: 'Lender Dashboard', 
      path: `/lender/dashboard.html` 
    });
  }
  
  if (state.currentPath.borrowerId) {
    crumbs.push({ 
      label: 'Borrower Dashboard', 
      path: `/borrower/dashboard.html` 
    });
  }
  
  if (state.currentPath.ledgerId) {
    crumbs.push({ 
      label: 'Ledger', 
      path: `/ledger/${state.currentPath.ledgerId}.html` 
    });
  }
  
  return crumbs;
};

// Create navigation slice
const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    // Mobile Menu Controls
    toggleMobileMenu: (state) => {
      state.isMobileMenuOpen = !state.isMobileMenuOpen;
    },
    openMobileMenu: (state) => {
      state.isMobileMenuOpen = true;
    },
    closeMobileMenu: (state) => {
      state.isMobileMenuOpen = false;
    },
    
    // Tab Navigation
    setActiveTab: (state, action) => {
      const { tab } = action.payload;
      state.activeTab = tab;
      state.lastNavigation = { type: 'tab', tab, timestamp: Date.now() };
      state.navigationHistory.push(state.lastNavigation);
    },
    
    // Role Management
    setActiveRole: (state, action) => {
      const { role } = action.payload;
      state.activeRole = role;
      
      // Update permissions based on role
      state.permissions = {
        canViewLenderMenu: role === 'lender',
        canViewBorrowerMenu: role === 'borrower',
        canViewEmergencyHub: true,
        canViewSubscriptionPlans: role === 'lender',
        canSwitchCountry: false // Lock country after role selection
      };
      
      // Clear lender/borrower paths when switching roles
      if (role === 'lender') {
        state.currentPath.borrowerId = null;
      } else if (role === 'borrower') {
        state.currentPath.lenderId = null;
      }
    },
    
    // STRICT HIERARCHY MANAGEMENT - CORE BUSINESS RULES
    
    // Country Selection (MANDATORY: First level of hierarchy)
    selectCountry: (state, action) => {
      const { countryCode } = action.payload;
      
      // Validate country exists
      const country = state.hierarchy.availableCountries.find(c => c.code === countryCode);
      if (!country) {
        throw new Error(`Invalid country code: ${countryCode}`);
      }
      
      // STRICT: Cannot change country if already selected (unless admin override)
      if (state.hierarchy.currentCountry && state.hierarchy.currentCountry !== countryCode) {
        throw new Error('COUNTRY_LOCK_VIOLATION: Country cannot be changed after registration');
      }
      
      // Update state
      state.hierarchy.currentCountry = countryCode;
      state.hierarchy.level = 'country';
      state.currentPath.country = countryCode;
      state.currentPath.group = null;
      state.currentPath.lenderId = null;
      state.currentPath.borrowerId = null;
      state.currentPath.ledgerId = null;
      
      // Clear groups when country changes
      state.hierarchy.groups = [];
      
      // Update breadcrumbs
      state.breadcrumbs = updateBreadcrumbs(state);
      
      // Log navigation
      state.lastNavigation = { 
        type: 'country_select', 
        countryCode, 
        timestamp: Date.now() 
      };
      state.navigationHistory.push(state.lastNavigation);
    },
    
    // Group Selection (MANDATORY: Second level of hierarchy)
    selectGroup: (state, action) => {
      const { groupId, groupName } = action.payload;
      
      // STRICT: Must have country selected first
      if (!state.hierarchy.currentCountry) {
        throw new Error('HIERARCHY_VIOLATION: Must select country before group');
      }
      
      // Validate group exists in current country
      const existingGroup = state.hierarchy.groups.find(g => g.id === groupId);
      if (!existingGroup) {
        // Add group if it doesn't exist (simulating group creation/joining)
        state.hierarchy.groups.push({
          id: groupId,
          name: groupName || `Group ${groupId}`,
          country: state.hierarchy.currentCountry,
          memberCount: 0,
          lenders: [],
          borrowers: [],
          createdAt: Date.now()
        });
      }
      
      // Update state
      state.hierarchy.level = 'group';
      state.currentPath.group = groupId;
      state.currentPath.lenderId = null;
      state.currentPath.borrowerId = null;
      state.currentPath.ledgerId = null;
      
      // Update breadcrumbs
      state.breadcrumbs = updateBreadcrumbs(state);
      
      // Log navigation
      state.lastNavigation = { 
        type: 'group_select', 
        groupId, 
        timestamp: Date.now() 
      };
      state.navigationHistory.push(state.lastNavigation);
    },
    
    // Lender Registration/Selection (MANDATORY: Third level of hierarchy)
    registerAsLender: (state, action) => {
      const { lenderId, lenderName, groupId } = action.payload;
      
      // STRICT: Must have group selected
      if (!state.currentPath.group) {
        throw new Error('HIERARCHY_VIOLATION: Must select group before registering as lender');
      }
      
      // STRICT: Group must match current path
      if (groupId && groupId !== state.currentPath.group) {
        throw new Error('GROUP_MISMATCH: Lender must register in current group');
      }
      
      // Update state
      state.activeRole = 'lender';
      state.hierarchy.level = 'lender';
      state.currentPath.lenderId = lenderId;
      state.currentPath.borrowerId = null; // Cannot be both simultaneously in same context
      
      // Add lender to group
      const group = state.hierarchy.groups.find(g => g.id === state.currentPath.group);
      if (group) {
        if (!group.lenders.includes(lenderId)) {
          group.lenders.push(lenderId);
          group.memberCount++;
        }
      }
      
      // Update permissions
      state.permissions = {
        canViewLenderMenu: true,
        canViewBorrowerMenu: false,
        canViewEmergencyHub: true,
        canViewSubscriptionPlans: true,
        canSwitchCountry: false
      };
      
      // Update breadcrumbs
      state.breadcrumbs = updateBreadcrumbs(state);
      
      // Log navigation
      state.lastNavigation = { 
        type: 'lender_registration', 
        lenderId, 
        timestamp: Date.now() 
      };
      state.navigationHistory.push(state.lastNavigation);
    },
    
    // Borrower Registration/Selection (MANDATORY: Alternative third level of hierarchy)
    registerAsBorrower: (state, action) => {
      const { borrowerId, borrowerName, groupId } = action.payload;
      
      // STRICT: Must have group selected
      if (!state.currentPath.group) {
        throw new Error('HIERARCHY_VIOLATION: Must select group before registering as borrower');
      }
      
      // STRICT: Group must match current path
      if (groupId && groupId !== state.currentPath.group) {
        throw new Error('GROUP_MISMATCH: Borrower must register in current group');
      }
      
      // STRICT: Check group limit for borrowers
      const group = state.hierarchy.groups.find(g => g.id === state.currentPath.group);
      if (group && group.borrowers.length >= 1000) {
        throw new Error('GROUP_CAPACITY: Group has reached maximum capacity (1000 members)');
      }
      
      // Update state
      state.activeRole = 'borrower';
      state.hierarchy.level = 'borrower';
      state.currentPath.borrowerId = borrowerId;
      state.currentPath.lenderId = null; // Cannot be both simultaneously in same context
      
      // Add borrower to group
      if (group) {
        if (!group.borrowers.includes(borrowerId)) {
          group.borrowers.push(borrowerId);
          group.memberCount++;
        }
      }
      
      // Update permissions
      state.permissions = {
        canViewLenderMenu: false,
        canViewBorrowerMenu: true,
        canViewEmergencyHub: true,
        canViewSubscriptionPlans: false,
        canSwitchCountry: false
      };
      
      // Update breadcrumbs
      state.breadcrumbs = updateBreadcrumbs(state);
      
      // Log navigation
      state.lastNavigation = { 
        type: 'borrower_registration', 
        borrowerId, 
        timestamp: Date.now() 
      };
      state.navigationHistory.push(state.lastNavigation);
    },
    
    // Ledger Creation/Selection (MANDATORY: Fourth level under lender)
    selectLedger: (state, action) => {
      const { ledgerId, borrowerId } = action.payload;
      
      // STRICT: Must be a lender to access ledgers
      if (state.activeRole !== 'lender') {
        throw new Error('ROLE_VIOLATION: Only lenders can access ledgers');
      }
      
      // STRICT: Must have lender selected
      if (!state.currentPath.lenderId) {
        throw new Error('HIERARCHY_VIOLATION: Must be registered as lender to access ledgers');
      }
      
      // Update state
      state.hierarchy.level = 'ledger';
      state.currentPath.ledgerId = ledgerId;
      
      // Add ledger to hierarchy
      if (!state.hierarchy.ledgers.includes(ledgerId)) {
        state.hierarchy.ledgers.push(ledgerId);
      }
      
      // Update breadcrumbs
      state.breadcrumbs = updateBreadcrumbs(state);
      
      // Log navigation
      state.lastNavigation = { 
        type: 'ledger_select', 
        ledgerId, 
        timestamp: Date.now() 
      };
      state.navigationHistory.push(state.lastNavigation);
    },
    
    // Navigation Back
    navigateBack: (state) => {
      if (state.navigationHistory.length > 1) {
        // Remove current navigation
        state.navigationHistory.pop();
        const previousNav = state.navigationHistory[state.navigationHistory.length - 1];
        
        // Restore previous state based on navigation type
        if (previousNav.type === 'country_select') {
          state.hierarchy.level = 'country';
          state.currentPath.group = null;
          state.currentPath.lenderId = null;
          state.currentPath.borrowerId = null;
          state.currentPath.ledgerId = null;
        } else if (previousNav.type === 'group_select') {
          state.hierarchy.level = 'group';
          state.currentPath.lenderId = null;
          state.currentPath.borrowerId = null;
          state.currentPath.ledgerId = null;
        } else if (previousNav.type === 'lender_registration') {
          state.hierarchy.level = 'lender';
          state.currentPath.ledgerId = null;
        } else if (previousNav.type === 'borrower_registration') {
          state.hierarchy.level = 'borrower';
        } else if (previousNav.type === 'ledger_select') {
          state.hierarchy.level = 'lender';
          state.currentPath.ledgerId = null;
        }
        
        // Update breadcrumbs
        state.breadcrumbs = updateBreadcrumbs(state);
        state.lastNavigation = previousNav;
      }
    },
    
    // Reset Navigation
    resetNavigation: (state) => {
      state.isMobileMenuOpen = false;
      state.activeTab = 'home';
      state.activeRole = null;
      state.hierarchy = {
        ...initialState.hierarchy,
        availableCountries: initialState.hierarchy.availableCountries
      };
      state.currentPath = { ...initialState.currentPath };
      state.breadcrumbs = updateBreadcrumbs(state);
      state.accessControl = { ...initialState.accessControl };
      state.permissions = { ...initialState.permissions };
      state.lastNavigation = null;
      state.navigationHistory = [];
    },
    
    // Update Hierarchy Data (for syncing with backend)
    updateHierarchyData: (state, action) => {
      const { groups, lenders, borrowers, ledgers } = action.payload;
      
      // Only update if we have a country selected
      if (state.hierarchy.currentCountry) {
        if (groups) {
          state.hierarchy.groups = groups.filter(g => g.country === state.hierarchy.currentCountry);
        }
        
        if (lenders && state.currentPath.group) {
          const group = state.hierarchy.groups.find(g => g.id === state.currentPath.group);
          if (group) {
            group.lenders = lenders.filter(l => l.groupId === state.currentPath.group).map(l => l.id);
          }
        }
        
        if (borrowers && state.currentPath.group) {
          const group = state.hierarchy.groups.find(g => g.id === state.currentPath.group);
          if (group) {
            group.borrowers = borrowers.filter(b => b.groupId === state.currentPath.group).map(b => b.id);
          }
        }
        
        if (ledgers && state.currentPath.lenderId) {
          state.hierarchy.ledgers = ledgers.filter(l => l.lenderId === state.currentPath.lenderId).map(l => l.id);
        }
      }
    },
    
    // Set Subscription Status (for lenders only)
    setSubscriptionStatus: (state, action) => {
      const { isActive, expiryDate, tier } = action.payload;
      
      // STRICT: Only applicable to lenders
      if (state.activeRole !== 'lender') {
        throw new Error('ROLE_VIOLATION: Subscription only applicable to lenders');
      }
      
      state.accessControl.subscriptionRequired = !isActive;
      
      if (expiryDate) {
        const today = new Date().getDate();
        const expiryDay = new Date(expiryDate).getDate();
        state.accessControl.subscriptionExpiryDate = expiryDay;
        
        // Check if subscription is expired (28th of month rule)
        if (today > 28 && expiryDay === 28) {
          state.accessControl.subscriptionRequired = true;
        }
      }
    },
    
    // Validate Current Navigation State
    validateNavigation: (state) => {
      const errors = [];
      
      // Check hierarchy integrity
      if (state.currentPath.lenderId && !state.currentPath.group) {
        errors.push('HIERARCHY_ERROR: Lender must belong to a group');
      }
      
      if (state.currentPath.borrowerId && !state.currentPath.group) {
        errors.push('HIERARCHY_ERROR: Borrower must belong to a group');
      }
      
      if (state.currentPath.ledgerId && !state.currentPath.lenderId) {
        errors.push('HIERARCHY_ERROR: Ledger must belong to a lender');
      }
      
      if (state.currentPath.group && !state.currentPath.country) {
        errors.push('HIERARCHY_ERROR: Group must belong to a country');
      }
      
      // Check subscription for lenders
      if (state.activeRole === 'lender' && state.accessControl.subscriptionRequired) {
        errors.push('SUBSCRIPTION_ERROR: Lender subscription required');
      }
      
      // Check borrower group limit
      if (state.activeRole === 'borrower') {
        const borrowerGroups = state.hierarchy.groups.filter(g => 
          g.borrowers.includes(state.currentPath.borrowerId)
        );
        if (borrowerGroups.length > 4) {
          errors.push('GROUP_LIMIT_ERROR: Borrower cannot join more than 4 groups');
        }
      }
      
      return errors;
    },
    
    // Set Loading State
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    
    // Update Permissions Based on Auth State
    updatePermissions: (state, action) => {
      const { isAuthenticated, userRole } = action.payload;
      
      state.permissions = {
        canViewLenderMenu: isAuthenticated && userRole === 'lender',
        canViewBorrowerMenu: isAuthenticated && userRole === 'borrower',
        canViewEmergencyHub: true,
        canViewSubscriptionPlans: isAuthenticated && userRole === 'lender',
        canSwitchCountry: !isAuthenticated // Can only switch country before registration
      };
    }
  },
  
  // Selectors for derived state
  selectors: {
    // Get current hierarchy level
    getCurrentLevel: (state) => state.hierarchy.level,
    
    // Get available menu items based on permissions
    getAvailableMenuItems: (state) => {
      return state.menuStructure.global.filter(item => {
        // Always show non-auth required items
        if (!item.requiresAuth) return true;
        
        // Check role-specific items
        if (item.requiresRole) {
          return state.activeRole === item.requiresRole;
        }
        
        // Check auth required items
        return state.activeRole !== null;
      });
    },
    
    // Get current country details
    getCurrentCountry: (state) => {
      return state.hierarchy.availableCountries.find(
        c => c.code === state.hierarchy.currentCountry
      );
    },
    
    // Get current group details
    getCurrentGroup: (state) => {
      return state.hierarchy.groups.find(
        g => g.id === state.currentPath.group
      );
    },
    
    // Check if user can perform cross-group operations
    canOperateInGroup: (state, groupId) => {
      // STRICT: Lenders can only operate in their current group
      if (state.activeRole === 'lender') {
        return state.currentPath.group === groupId;
      }
      
      // STRICT: Borrowers can be in multiple groups (max 4)
      if (state.activeRole === 'borrower') {
        const borrowerGroups = state.hierarchy.groups.filter(g => 
          g.borrowers.includes(state.currentPath.borrowerId)
        );
        return borrowerGroups.some(g => g.id === groupId) && borrowerGroups.length <= 4;
      }
      
      return false;
    },
    
    // Check if subscription is valid (for lenders)
    isSubscriptionValid: (state) => {
      if (state.activeRole !== 'lender') return true; // Borrowers don't need subscription
      
      if (state.accessControl.subscriptionRequired) return false;
      
      // Check 28th of month rule
      const today = new Date().getDate();
      const expiryDay = state.accessControl.subscriptionExpiryDate;
      
      return !(today > 28 && expiryDay === 28);
    },
    
    // Get navigation trail for UI display
    getNavigationTrail: (state) => {
      return state.breadcrumbs.map((crumb, index) => ({
        ...crumb,
        isLast: index === state.breadcrumbs.length - 1
      }));
    },
    
    // Check if current navigation is valid according to business rules
    isValidNavigation: (state) => {
      const errors = [];
      
      // Check hierarchy
      if (state.currentPath.lenderId && !state.currentPath.group) errors.push('Lender without group');
      if (state.currentPath.borrowerId && !state.currentPath.group) errors.push('Borrower without group');
      if (state.currentPath.ledgerId && !state.currentPath.lenderId) errors.push('Ledger without lender');
      if (state.currentPath.group && !state.currentPath.country) errors.push('Group without country');
      
      // Check subscription for lenders
      if (state.activeRole === 'lender' && state.accessControl.subscriptionRequired) {
        errors.push('Lender subscription required');
      }
      
      return {
        isValid: errors.length === 0,
        errors
      };
    },
    
    // Get emergency categories grouped by type
    getEmergencyCategories: (state) => {
      const emergencyItem = state.menuStructure.global.find(item => item.id === 'emergency-hub');
      if (!emergencyItem || !emergencyItem.children) return [];
      
      const categories = {};
      emergencyItem.children.forEach(item => {
        if (item.category) {
          if (!categories[item.category]) {
            categories[item.category] = [];
          }
          categories[item.category].push(item);
        }
      });
      
      return categories;
    }
  }
});

// Export actions and selectors
export const {
  // Actions
  toggleMobileMenu,
  openMobileMenu,
  closeMobileMenu,
  setActiveTab,
  setActiveRole,
  selectCountry,
  selectGroup,
  registerAsLender,
  registerAsBorrower,
  selectLedger,
  navigateBack,
  resetNavigation,
  updateHierarchyData,
  setSubscriptionStatus,
  validateNavigation,
  setLoading,
  updatePermissions,
  
  // Selectors
  getCurrentLevel,
  getAvailableMenuItems,
  getCurrentCountry,
  getCurrentGroup,
  canOperateInGroup,
  isSubscriptionValid,
  getNavigationTrail,
  isValidNavigation,
  getEmergencyCategories
} = navigationSlice;

// Export reducer
export default navigationSlice.reducer;

// Helper functions for strict hierarchy enforcement
export const HierarchyEnforcer = {
  // Validate country selection
  validateCountrySelection: (countryCode, currentState) => {
    if (!countryCode) return { valid: false, error: 'Country code required' };
    
    const validCountries = currentState.hierarchy.availableCountries.map(c => c.code);
    if (!validCountries.includes(countryCode)) {
      return { valid: false, error: `Invalid country code: ${countryCode}` };
    }
    
    // Check if country is already set and different
    if (currentState.hierarchy.currentCountry && 
        currentState.hierarchy.currentCountry !== countryCode &&
        currentState.activeRole) {
      return { valid: false, error: 'Country cannot be changed after registration' };
    }
    
    return { valid: true };
  },
  
  // Validate group selection/creation
  validateGroupOperation: (groupId, groupName, currentState) => {
    if (!groupId) return { valid: false, error: 'Group ID required' };
    
    // Must have country selected first
    if (!currentState.hierarchy.currentCountry) {
      return { valid: false, error: 'Must select country before group operation' };
    }
    
    // Check group capacity
    const existingGroup = currentState.hierarchy.groups.find(g => g.id === groupId);
    if (existingGroup && existingGroup.memberCount >= 1000) {
      return { valid: false, error: 'Group has reached maximum capacity (1000 members)' };
    }
    
    return { valid: true };
  },
  
  // Validate lender registration
  validateLenderRegistration: (lenderData, currentState) => {
    const { lenderId, groupId } = lenderData;
    
    if (!lenderId) return { valid: false, error: 'Lender ID required' };
    if (!groupId) return { valid: false, error: 'Group ID required' };
    
    // Must have group selected
    if (!currentState.currentPath.group || currentState.currentPath.group !== groupId) {
      return { valid: false, error: 'Must be in the target group to register as lender' };
    }
    
    // Check if already registered as borrower in same context
    if (currentState.currentPath.borrowerId) {
      return { valid: false, error: 'Cannot register as lender while active as borrower' };
    }
    
    return { valid: true };
  },
  
  // Validate borrower registration
  validateBorrowerRegistration: (borrowerData, currentState) => {
    const { borrowerId, groupId } = borrowerData;
    
    if (!borrowerId) return { valid: false, error: 'Borrower ID required' };
    if (!groupId) return { valid: false, error: 'Group ID required' };
    
    // Must have group selected
    if (!currentState.currentPath.group || currentState.currentPath.group !== groupId) {
      return { valid: false, error: 'Must be in the target group to register as borrower' };
    }
    
    // Check if already registered as lender in same context
    if (currentState.currentPath.lenderId) {
      return { valid: false, error: 'Cannot register as borrower while active as lender' };
    }
    
    // Check group limit for borrowers
    const group = currentState.hierarchy.groups.find(g => g.id === groupId);
    if (group && group.borrowers.length >= 1000) {
      return { valid: false, error: 'Group has reached maximum borrower capacity' };
    }
    
    // Check borrower's total group limit
    const borrowerGroups = currentState.hierarchy.groups.filter(g => 
      g.borrowers.includes(borrowerId)
    );
    if (borrowerGroups.length >= 4) {
      return { valid: false, error: 'Borrower cannot join more than 4 groups' };
    }
    
    return { valid: true };
  },
  
  // Get hierarchy path as string for debugging
  getHierarchyPath: (state) => {
    const parts = [];
    
    if (state.hierarchy.currentCountry) {
      const country = state.hierarchy.availableCountries.find(c => c.code === state.hierarchy.currentCountry);
      parts.push(country ? country.name : state.hierarchy.currentCountry);
    }
    
    if (state.currentPath.group) {
      const group = state.hierarchy.groups.find(g => g.id === state.currentPath.group);
      parts.push(group ? group.name : state.currentPath.group);
    }
    
    if (state.currentPath.lenderId) {
      parts.push(`Lender: ${state.currentPath.lenderId}`);
    } else if (state.currentPath.borrowerId) {
      parts.push(`Borrower: ${state.currentPath.borrowerId}`);
    }
    
    if (state.currentPath.ledgerId) {
      parts.push(`Ledger: ${state.currentPath.ledgerId}`);
    }
    
    return parts.join(' → ') || 'Global';
  }
};

// Export middleware for hierarchy validation
export const hierarchyValidationMiddleware = (store) => (next) => (action) => {
  const currentState = store.getState().navigation;
  
  // Validate actions that change hierarchy
  if (action.type.includes('selectCountry')) {
    const validation = HierarchyEnforcer.validateCountrySelection(
      action.payload.countryCode,
      currentState
    );
    if (!validation.valid) {
      console.error('Country selection validation failed:', validation.error);
      return;
    }
  }
  
  if (action.type.includes('selectGroup') || action.type.includes('register')) {
    // Additional validation can be added here
    console.log('Hierarchy action:', action.type, action.payload);
  }
  
  return next(action);
};

// Export initialization function
export const initializeNavigation = () => {
  // Load saved state from localStorage
  const savedState = localStorage.getItem('mpesewa_navigation_state');
  if (savedState) {
    try {
      const parsed = JSON.parse(savedState);
      // Validate saved state
      const errors = validateHierarchyTransition(initialState, parsed);
      if (errors.length === 0) {
        return { ...initialState, ...parsed };
      } else {
        console.warn('Invalid saved navigation state:', errors);
      }
    } catch (error) {
      console.error('Error loading navigation state:', error);
    }
  }
  
  return initialState;
};

// Export persistence function
export const persistNavigationState = (state) => {
  try {
    // Only persist non-sensitive data
    const persistableState = {
      activeTab: state.activeTab,
      activeRole: state.activeRole,
      hierarchy: {
        currentCountry: state.hierarchy.currentCountry,
        currentGroup: state.currentPath.group,
        availableCountries: state.hierarchy.availableCountries
      },
      currentPath: state.currentPath,
      breadcrumbs: state.breadcrumbs,
      permissions: state.permissions
    };
    
    localStorage.setItem('mpesewa_navigation_state', JSON.stringify(persistableState));
  } catch (error) {
    console.error('Error persisting navigation state:', error);
  }
};