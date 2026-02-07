/**
 * M-PESEWA STATE SELECTORS
 * Efficient, memoized selectors for accessing and deriving state values
 * Implements strict hierarchy and business rules
 */

import { createSelector } from './utils/selector-utils.js';

/**
 * AUTHENTICATION SELECTORS
 */
export const selectAuth = state => state.auth;
export const selectIsAuthenticated = state => state.auth.isAuthenticated;
export const selectAuthToken = state => state.auth.token;
export const selectSessionExpiry = state => state.auth.sessionExpiry;
export const selectLoginMethod = state => state.auth.loginMethod;

export const selectIsSessionValid = createSelector(
    [selectSessionExpiry],
    (expiry) => {
        if (!expiry) return false;
        const now = new Date();
        const expiryDate = new Date(expiry);
        return now < expiryDate;
    }
);

export const selectSessionTimeRemaining = createSelector(
    [selectSessionExpiry],
    (expiry) => {
        if (!expiry) return 0;
        const now = new Date();
        const expiryDate = new Date(expiry);
        return Math.max(0, expiryDate - now);
    }
);

/**
 * USER SELECTORS
 */
export const selectUser = state => state.user;
export const selectUserId = state => state.user.id;
export const selectUsername = state => state.user.username;
export const selectUserEmail = state => state.user.email;
export const selectUserPhone = state => state.user.phone;
export const selectUserFullName = state => state.user.fullName;
export const selectUserNationalId = state => state.user.nationalId;
export const selectUserLocation = state => state.user.location;
export const selectIsUserVerified = state => state.user.isVerified;
export const selectVerificationLevel = state => state.user.verificationLevel;

export const selectUserInitials = createSelector(
    [selectUserFullName],
    (fullName) => {
        if (!fullName) return '??';
        const names = fullName.split(' ');
        if (names.length === 1) return names[0].charAt(0).toUpperCase();
        return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
    }
);

export const selectUserDisplayName = createSelector(
    [selectUsername, selectUserFullName],
    (username, fullName) => {
        return fullName || username || 'User';
    }
);

/**
 * ROLE SELECTORS
 */
export const selectRole = state => state.role;
export const selectCurrentRole = state => state.role.currentRole;
export const selectAvailableRoles = state => state.role.availableRoles;
export const selectRoleSwitchesRemaining = state => state.role.roleSwitchesRemaining;
export const selectLastRoleSwitch = state => state.role.lastRoleSwitch;

export const selectIsBorrower = createSelector(
    [selectCurrentRole],
    (role) => role === 'borrower'
);

export const selectIsLender = createSelector(
    [selectCurrentRole],
    (role) => role === 'lender'
);

export const selectIsAdmin = createSelector(
    [selectCurrentRole],
    (role) => role === 'admin'
);

export const selectCanSwitchRole = createSelector(
    [selectRoleSwitchesRemaining, selectLastRoleSwitch],
    (remaining, lastSwitch) => {
        if (remaining <= 0) return false;
        
        if (!lastSwitch) return true;
        
        const lastSwitchDate = new Date(lastSwitch);
        const now = new Date();
        const monthDiff = (now.getFullYear() - lastSwitchDate.getFullYear()) * 12 + 
                         (now.getMonth() - lastSwitchDate.getMonth());
        
        return monthDiff < 1; // Within same month
    }
);

/**
 * COUNTRY SELECTORS (STRICT ISOLATION)
 */
export const selectCountry = state => state.country;
export const selectCurrentCountry = state => state.country.currentCountry;
export const selectAvailableCountries = state => state.country.availableCountries;
export const selectCountryLock = state => state.country.countryLock;
export const selectCountryRules = state => state.country.countryRules;

export const selectCurrentCountryInfo = createSelector(
    [selectCurrentCountry, selectAvailableCountries],
    (currentCode, countries) => {
        return countries.find(c => c.code === currentCode);
    }
);

export const selectCurrentCurrency = createSelector(
    [selectCurrentCountryInfo],
    (countryInfo) => {
        return countryInfo ? countryInfo.currency : null;
    }
);

export const selectCurrentCountryFlag = createSelector(
    [selectCurrentCountryInfo],
    (countryInfo) => {
        return countryInfo ? countryInfo.flag : '🏳️';
    }
);

export const selectCountryIsSet = createSelector(
    [selectCurrentCountry],
    (country) => !!country
);

export const selectCanChangeCountry = createSelector(
    [selectCountryLock, selectCurrentCountry],
    (locked, current) => {
        // Can change if not locked OR no country is set yet
        return !locked || !current;
    }
);

/**
 * GROUP SELECTORS (HIERARCHY ENFORCEMENT)
 */
export const selectGroup = state => state.group;
export const selectCurrentGroup = state => state.group.currentGroup;
export const selectAvailableGroups = state => state.group.availableGroups;
export const selectGroupInvitations = state => state.group.groupInvitations;
export const selectGroupRequests = state => state.group.groupRequests;
export const selectGroups = state => state.group.groups;

export const selectCurrentGroupInfo = createSelector(
    [selectCurrentGroup, selectGroups],
    (groupId, groups) => {
        return groupId ? groups[groupId] : null;
    }
);

export const selectCurrentGroupName = createSelector(
    [selectCurrentGroupInfo],
    (groupInfo) => {
        return groupInfo ? groupInfo.name : 'No Group Selected';
    }
);

export const selectCurrentGroupCountry = createSelector(
    [selectCurrentGroupInfo],
    (groupInfo) => {
        return groupInfo ? groupInfo.country : null;
    }
);

export const selectIsInGroup = createSelector(
    [selectCurrentGroup],
    (groupId) => !!groupId
);

export const selectGroupMembers = createSelector(
    [selectCurrentGroupInfo],
    (groupInfo) => {
        return groupInfo ? groupInfo.members || [] : [];
    }
);

export const selectGroupMemberCount = createSelector(
    [selectGroupMembers],
    (members) => members.length
);

export const selectGroupAdmins = createSelector(
    [selectGroupMembers],
    (members) => {
        return members.filter(m => m.role === 'admin');
    }
);

export const selectGroupLenders = createSelector(
    [selectGroupMembers],
    (members) => {
        return members.filter(m => m.role === 'lender');
    }
);

export const selectGroupBorrowers = createSelector(
    [selectGroupMembers],
    (members) => {
        return members.filter(m => m.role === 'borrower');
    }
);

export const selectCanCreateGroup = createSelector(
    [selectCountryIsSet, selectCurrentCountry, selectAvailableGroups],
    (countrySet, countryCode, groups) => {
        if (!countrySet) return false;
        
        // Check if user already has too many groups in this country
        const countryGroups = groups.filter(g => g.country === countryCode);
        return countryGroups.length < 10; // Arbitrary limit
    }
);

export const selectCanJoinAnotherGroup = createSelector(
    [selectAvailableGroups, selectCurrentCountry],
    (groups, countryCode) => {
        // Borrower can join max 4 groups (with good rating)
        const countryGroups = groups.filter(g => g.country === countryCode);
        return countryGroups.length < 4;
    }
);

/**
 * LENDER SELECTORS
 */
export const selectLender = state => state.lender;
export const selectIsLenderActive = state => state.lender.isLender;
export const selectSubscriptionLevel = state => state.lender.subscriptionLevel;
export const selectSubscriptionExpiry = state => state.lender.subscriptionExpiry;
export const selectSubscriptionStatus = state => state.lender.subscriptionStatus;
export const selectLendingLimits = state => state.lender.lendingLimits;
export const selectCurrentLimit = state => state.lender.currentLimit;
export const selectAmountLent = state => state.lender.amountLent;
export const selectActiveLedgersCount = state => state.lender.activeLedgers;
export const selectClearedLedgersCount = state => state.lender.clearedLedgers;
export const selectOutstandingAmount = state => state.lender.outstandingAmount;
export const selectExpectedInterest = state => state.lender.expectedInterest;
export const selectLendingCategories = state => state.lender.lendingCategories;
export const selectBlockedUntil = state => state.lender.blockedUntil;

export const selectIsSubscriptionActive = createSelector(
    [selectSubscriptionStatus],
    (status) => status === 'active'
);

export const selectIsSubscriptionExpired = createSelector(
    [selectSubscriptionStatus, selectSubscriptionExpiry],
    (status, expiry) => {
        if (status === 'expired') return true;
        
        if (!expiry) return false;
        
        const now = new Date();
        const expiryDate = new Date(expiry);
        return now > expiryDate;
    }
);

export const selectDaysUntilSubscriptionExpiry = createSelector(
    [selectSubscriptionExpiry],
    (expiry) => {
        if (!expiry) return null;
        
        const now = new Date();
        const expiryDate = new Date(expiry);
        const diffTime = expiryDate - now;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
);

export const selectCanLend = createSelector(
    [selectIsLenderActive, selectIsSubscriptionActive, selectCurrentLimit, selectActiveLedgersCount],
    (isLender, isActive, limit, activeLedgers) => {
        return isLender && isActive && limit > 0 && activeLedgers < 100; // Arbitrary max active ledgers
    }
);

export const selectAvailableToLend = createSelector(
    [selectCurrentLimit, selectAmountLent],
    (limit, amountLent) => {
        return Math.max(0, limit - amountLent);
    }
);

export const selectLenderPerformance = createSelector(
    [selectAmountLent, selectClearedLedgersCount, selectActiveLedgersCount],
    (amountLent, cleared, active) => {
        const total = cleared + active;
        if (total === 0) return 0;
        return (cleared / total) * 100;
    }
);

export const selectLenderReputation = createSelector(
    [selectAmountLent, selectClearedLedgersCount, selectActiveLedgersCount],
    (amountLent, cleared, active) => {
        if (amountLent === 0) return 0;
        
        const successRate = cleared / (cleared + active) || 0;
        const volumeScore = Math.min(amountLent / 100000, 1); // Cap at 100,000
        
        return Math.round((successRate * 0.7 + volumeScore * 0.3) * 100);
    }
);

export const selectIsLenderBlocked = createSelector(
    [selectBlockedUntil],
    (blockedUntil) => {
        if (!blockedUntil) return false;
        
        const now = new Date();
        const blockedDate = new Date(blockedUntil);
        return now < blockedDate;
    }
);

/**
 * BORROWER SELECTORS
 */
export const selectBorrower = state => state.borrower;
export const selectIsBorrowerActive = state => state.borrower.isBorrower;
export const selectCurrentLoans = state => state.borrower.currentLoans;
export const selectLoanHistory = state => state.borrower.loanHistory;
export const selectBorrowingLimits = state => state.borrower.borrowingLimits;
export const selectActiveLoanCount = state => state.borrower.activeLoanCount;
export const selectTotalBorrowed = state => state.borrower.totalBorrowed;
export const selectTotalRepaid = state => state.borrower.totalRepaid;
export const selectTotalInterestPaid = state => state.borrower.totalInterestPaid;
export const selectBorrowerRating = state => state.borrower.rating;
export const selectBlacklistStatus = state => state.borrower.blacklistStatus;
export const selectDefaultedLoans = state => state.borrower.defaultedLoans;
export const selectRepaymentHistory = state => state.borrower.repaymentHistory;
export const selectGroupMemberships = state => state.borrower.groupMemberships;

export const selectCanBorrow = createSelector(
    [selectIsBorrowerActive, selectBlacklistStatus, selectActiveLoanCount, selectCurrentCountry],
    (isBorrower, blacklist, activeLoans, country) => {
        return isBorrower && 
               blacklist !== 'active' && 
               activeLoans < 3 && // Max 3 active loans
               !!country;
    }
);

export const selectBorrowerReputation = createSelector(
    [selectBorrowerRating, selectTotalRepaid, selectTotalBorrowed, selectDefaultedLoans],
    (rating, repaid, borrowed, defaulted) => {
        if (borrowed === 0) return 0;
        
        const repaymentRate = repaid / borrowed;
        const defaultRate = defaulted.length / (defaulted.length + 1); // Avoid division by zero
        
        const score = (rating / 5) * 0.5 + 
                     repaymentRate * 0.3 + 
                     (1 - defaultRate) * 0.2;
        
        return Math.round(score * 100);
    }
);

export const selectAvailableBorrowingLimit = createSelector(
    [selectBorrowingLimits, selectCurrentCountry, selectTotalBorrowed],
    (limits, country, borrowed) => {
        if (!country || !limits[country]) return 0;
        
        const countryLimit = limits[country];
        return Math.max(0, countryLimit - borrowed);
    }
);

export const selectIsBlacklisted = createSelector(
    [selectBlacklistStatus],
    (status) => status === 'active'
);

export const selectCanJoinMoreGroups = createSelector(
    [selectGroupMemberships],
    (memberships) => {
        return memberships.length < 4;
    }
);

export const selectBorrowerSuccessRate = createSelector(
    [selectTotalRepaid, selectTotalBorrowed],
    (repaid, borrowed) => {
        if (borrowed === 0) return 100;
        return Math.round((repaid / borrowed) * 100);
    }
);

/**
 * LEDGER SELECTORS (CORE FEATURE)
 */
export const selectLedger = state => state.ledger;
export const selectLedgers = state => state.ledger.ledgers;
export const selectActiveLedgers = state => state.ledger.activeLedgers;
export const selectClearedLedgers = state => state.ledger.clearedLedgers;
export const selectOverdueLedgers = state => state.ledger.overdueLedgers;
export const selectDefaultedLedgers = state => state.ledger.defaultedLedgers;

export const selectAllLedgers = createSelector(
    [selectLedgers],
    (ledgers) => {
        return Object.values(ledgers);
    }
);

export const selectLedgerById = (state, ledgerId) => {
    return state.ledger.ledgers[ledgerId];
};

export const selectLedgersByGroup = createSelector(
    [selectAllLedgers, selectCurrentGroup],
    (ledgers, groupId) => {
        return ledgers.filter(ledger => ledger.groupId === groupId);
    }
);

export const selectLedgersByBorrower = createSelector(
    [selectAllLedgers, selectUserId],
    (ledgers, userId) => {
        return ledgers.filter(ledger => ledger.borrowerId === userId);
    }
);

export const selectLedgersByLender = createSelector(
    [selectAllLedgers, selectUserId],
    (ledgers, userId) => {
        return ledgers.filter(ledger => ledger.lenderId === userId);
    }
);

export const selectActiveLedgersByLender = createSelector(
    [selectLedgersByLender],
    (ledgers) => {
        return ledgers.filter(ledger => ledger.status === 'active');
    }
);

export const selectOverdueLedgersByLender = createSelector(
    [selectLedgersByLender],
    (ledgers) => {
        return ledgers.filter(ledger => ledger.status === 'overdue' || ledger.daysOverdue > 0);
    }
);

export const selectLedgerStats = createSelector(
    [selectAllLedgers],
    (ledgers) => {
        const stats = {
            total: ledgers.length,
            active: 0,
            cleared: 0,
            overdue: 0,
            defaulted: 0,
            totalAmount: 0,
            totalInterest: 0,
            totalPenalty: 0,
            totalRepaid: 0
        };
        
        ledgers.forEach(ledger => {
            stats[ledger.status]++;
            stats.totalAmount += ledger.amountBorrowed;
            stats.totalInterest += ledger.interestAmount;
            stats.totalPenalty += ledger.penaltyAmount;
            stats.totalRepaid += ledger.amountRepaid;
        });
        
        return stats;
    }
);

export const selectLedgerTotalsByLender = createSelector(
    [selectLedgersByLender],
    (ledgers) => {
        return ledgers.reduce((totals, ledger) => {
            totals.totalLent += ledger.amountBorrowed;
            totals.totalInterest += ledger.interestAmount;
            totals.totalPenalty += ledger.penaltyAmount;
            totals.totalDue += ledger.totalDue;
            totals.totalRepaid += ledger.amountRepaid;
            
            if (ledger.status === 'active') {
                totals.activeAmount += ledger.amountBorrowed;
                totals.activeInterest += ledger.interestAmount;
            }
            
            if (ledger.status === 'overdue' || ledger.daysOverdue > 0) {
                totals.overdueAmount += ledger.amountBorrowed;
                totals.overdueInterest += ledger.interestAmount;
            }
            
            return totals;
        }, {
            totalLent: 0,
            totalInterest: 0,
            totalPenalty: 0,
            totalDue: 0,
            totalRepaid: 0,
            activeAmount: 0,
            activeInterest: 0,
            overdueAmount: 0,
            overdueInterest: 0
        });
    }
);

export const selectLedgerPerformance = createSelector(
    [selectLedgersByLender],
    (ledgers) => {
        if (ledgers.length === 0) return 0;
        
        const cleared = ledgers.filter(l => l.status === 'cleared').length;
        return (cleared / ledgers.length) * 100;
    }
);

export const selectAverageLoanSize = createSelector(
    [selectLedgersByLender],
    (ledgers) => {
        if (ledgers.length === 0) return 0;
        
        const total = ledgers.reduce((sum, ledger) => sum + ledger.amountBorrowed, 0);
        return total / ledgers.length;
    }
);

export const selectAverageRepaymentDays = createSelector(
    [selectLedgersByLender],
    (ledgers) => {
        const clearedLedgers = ledgers.filter(l => l.status === 'cleared' && l.clearedAt);
        
        if (clearedLedgers.length === 0) return 0;
        
        let totalDays = 0;
        clearedLedgers.forEach(ledger => {
            const borrowedDate = new Date(ledger.dateBorrowed);
            const clearedDate = new Date(ledger.clearedAt);
            const days = Math.ceil((clearedDate - borrowedDate) / (1000 * 60 * 60 * 24));
            totalDays += days;
        });
        
        return Math.round(totalDays / clearedLedgers.length);
    }
);

/**
 * SUBSCRIPTION SELECTORS
 */
export const selectSubscription = state => state.subscription;
export const selectSubscriptionPlans = state => state.subscription.plans;
export const selectCurrentSubscriptionPlan = state => state.subscription.currentPlan;
export const selectPaymentHistory = state => state.subscription.paymentHistory;
export const selectInvoices = state => state.subscription.invoices;
export const selectNextBillingDate = state => state.subscription.nextBillingDate;
export const selectAutoRenew = state => state.subscription.autoRenew;

export const selectCurrentPlanDetails = createSelector(
    [selectCurrentSubscriptionPlan, selectSubscriptionPlans],
    (currentPlan, plans) => {
        if (!currentPlan) return null;
        
        const planDetails = plans[currentPlan.plan];
        return {
            ...planDetails,
            ...currentPlan
        };
    }
);

export const selectSubscriptionCost = createSelector(
    [selectCurrentPlanDetails],
    (planDetails) => {
        if (!planDetails) return 0;
        return planDetails.fee;
    }
);

export const selectSubscriptionFeatures = createSelector(
    [selectCurrentPlanDetails],
    (planDetails) => {
        if (!planDetails) return [];
        return planDetails.features || [];
    }
);

export const selectPaymentHistoryByYear = createSelector(
    [selectPaymentHistory],
    (history) => {
        const byYear = {};
        
        history.forEach(payment => {
            const date = new Date(payment.date);
            const year = date.getFullYear();
            
            if (!byYear[year]) {
                byYear[year] = {
                    total: 0,
                    count: 0,
                    payments: []
                };
            }
            
            byYear[year].total += payment.amount;
            byYear[year].count++;
            byYear[year].payments.push(payment);
        });
        
        return byYear;
    }
);

export const selectTotalSpentOnSubscriptions = createSelector(
    [selectPaymentHistory],
    (history) => {
        return history.reduce((total, payment) => total + payment.amount, 0);
    }
);

/**
 * BLACKLIST SELECTORS
 */
export const selectBlacklist = state => state.blacklist;
export const selectIsUserBlacklisted = state => state.blacklist.isBlacklisted;
export const selectBlacklistReason = state => state.blacklist.blacklistReason;
export const selectBlacklistDate = state => state.blacklist.blacklistDate;
export const selectAmountOwed = state => state.blacklist.amountOwed;
export const selectDaysBlacklisted = state => state.blacklist.daysBlacklisted;
export const selectCanAppeal = state => state.blacklist.canAppeal;
export const selectAppealStatus = state => state.blacklist.appealStatus;
export const selectAdminOverride = state => state.blacklist.adminOverride;
export const selectPublicBlacklist = state => state.blacklist.publicBlacklist;
export const selectDefaultersRegistry = state => state.blacklist.defaultersRegistry;

export const selectBlacklistEntriesByCountry = createSelector(
    [selectPublicBlacklist, selectCurrentCountry],
    (blacklist, country) => {
        if (!country) return [];
        
        // This would typically filter by country in real implementation
        // For now, return all entries
        return blacklist.filter(entry => !country || entry.country === country);
    }
);

export const selectDefaultersByCountry = createSelector(
    [selectDefaultersRegistry, selectCurrentCountry],
    (defaulters, country) => {
        if (!country) return [];
        return defaulters.filter(defaulter => defaulter.country === country);
    }
);

export const selectTotalBlacklistedAmount = createSelector(
    [selectPublicBlacklist],
    (blacklist) => {
        return blacklist.reduce((total, entry) => total + entry.amountOwed, 0);
    }
);

export const selectCanRemoveFromBlacklist = createSelector(
    [selectAdminOverride, selectIsAdmin],
    (adminOverride, isAdmin) => {
        return adminOverride || isAdmin;
    }
);

/**
 * UI SELECTORS
 */
export const selectUI = state => state.ui;
export const selectTheme = state => state.ui.theme;
export const selectLanguage = state => state.ui.language;
export const selectSidebarOpen = state => state.ui.sidebarOpen;
export const selectNotificationsPanelOpen = state => state.ui.notificationsPanelOpen;
export const selectMobileMenuOpen = state => state.ui.mobileMenuOpen;
export const selectCurrentPage = state => state.ui.currentPage;
export const selectIsLoading = state => state.ui.loading;
export const selectError = state => state.ui.error;
export const selectSuccess = state => state.ui.success;
export const selectLastAction = state => state.ui.lastAction;
export const selectModals = state => state.ui.modals;

export const selectIsDarkTheme = createSelector(
    [selectTheme],
    (theme) => theme === 'dark'
);

export const selectModalState = (state, modalName) => {
    return state.ui.modals[modalName] || false;
};

export const selectHasError = createSelector(
    [selectError],
    (error) => !!error
);

export const selectHasSuccess = createSelector(
    [selectSuccess],
    (success) => !!success
);

/**
 * PWA SELECTORS
 */
export const selectPWA = state => state.pwa;
export const selectIsPWAInstalled = state => state.pwa.isInstalled;
export const selectIsOnline = state => state.pwa.isOnline;
export const selectHasUpdate = state => state.pwa.hasUpdate;
export const selectDeferredPrompt = state => state.pwa.deferredPrompt;
export const selectRegistration = state => state.pwa.registration;
export const selectOfflineQueue = state => state.pwa.offlineQueue;
export const selectSyncStatus = state => state.pwa.syncStatus;

export const selectCanInstallPWA = createSelector(
    [selectDeferredPrompt, selectIsPWAInstalled],
    (prompt, installed) => {
        return !!prompt && !installed;
    }
);

export const selectOfflineQueueLength = createSelector(
    [selectOfflineQueue],
    (queue) => queue.length
);

export const selectIsSyncing = createSelector(
    [selectSyncStatus],
    (status) => status === 'syncing'
);

/**
 * SYNC SELECTORS
 */
export const selectSync = state => state.sync;
export const selectLastSync = state => state.sync.lastSync;
export const selectSyncInProgress = state => state.sync.syncInProgress;
export const selectPendingChanges = state => state.sync.pendingChanges;
export const selectConflictResolution = state => state.sync.conflictResolution;
export const selectOfflineChanges = state => state.sync.offlineChanges;
export const selectRetryCount = state => state.sync.retryCount;

export const selectTimeSinceLastSync = createSelector(
    [selectLastSync],
    (lastSync) => {
        if (!lastSync) return null;
        
        const lastSyncDate = new Date(lastSync);
        const now = new Date();
        const diffMinutes = Math.floor((now - lastSyncDate) / (1000 * 60));
        
        if (diffMinutes < 1) return 'Just now';
        if (diffMinutes < 60) return `${diffMinutes}m ago`;
        
        const diffHours = Math.floor(diffMinutes / 60);
        if (diffHours < 24) return `${diffHours}h ago`;
        
        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays}d ago`;
    }
);

export const selectHasPendingChanges = createSelector(
    [selectPendingChanges],
    (changes) => changes.length > 0
);

export const selectHasOfflineChanges = createSelector(
    [selectOfflineChanges],
    (changes) => changes.length > 0
);

export const selectNeedsSync = createSelector(
    [selectHasPendingChanges, selectHasOfflineChanges, selectIsOnline],
    (hasPending, hasOffline, isOnline) => {
        return isOnline && (hasPending || hasOffline);
    }
);

/**
 * NAVIGATION SELECTORS
 */
export const selectNavigation = state => state.navigation;
export const selectCurrentPath = state => state.navigation.currentPath;
export const selectPreviousPath = state => state.navigation.previousPath;
export const selectNavigationHistory = state => state.navigation.history;
export const selectBreadcrumbs = state => state.navigation.breadcrumbs;
export const selectCanGoBack = state => state.navigation.canGoBack;
export const selectCanGoForward = state => state.navigation.canGoForward;
export const selectGuards = state => state.navigation.guards;

export const selectRequiresAuth = createSelector(
    [selectGuards],
    (guards) => guards.requiresAuth
);

export const selectRequiresRole = createSelector(
    [selectGuards],
    (guards) => guards.requiresRole
);

export const selectRequiresCountry = createSelector(
    [selectGuards],
    (guards) => guards.requiresCountry
);

export const selectRequiresSubscription = createSelector(
    [selectGuards],
    (guards) => guards.requiresSubscription
);

export const selectRequiresGroup = createSelector(
    [selectGuards],
    (guards) => guards.requiresGroup
);

export const selectCanAccessCurrentPage = createSelector(
    [selectIsAuthenticated, selectCurrentRole, selectRequiresAuth, selectRequiresRole],
    (isAuth, currentRole, requiresAuth, requiresRole) => {
        if (requiresAuth && !isAuth) return false;
        if (requiresRole && currentRole !== requiresRole) return false;
        return true;
    }
);

/**
 * NOTIFICATION SELECTORS
 */
export const selectNotification = state => state.notification;
export const selectNotifications = state => state.notification.notifications;
export const selectUnreadCount = state => state.notification.unreadCount;
export const selectLastNotificationId = state => state.notification.lastNotificationId;
export const selectNotificationSettings = state => state.notification.settings;

export const selectUnreadNotifications = createSelector(
    [selectNotifications],
    (notifications) => {
        return notifications.filter(n => !n.read);
    }
);

export const selectNotificationsByType = createSelector(
    [selectNotifications],
    (notifications) => {
        const byType = {};
        
        notifications.forEach(notification => {
            const type = notification.type || 'general';
            if (!byType[type]) {
                byType[type] = [];
            }
            byType[type].push(notification);
        });
        
        return byType;
    }
);

export const selectRecentNotifications = createSelector(
    [selectNotifications],
    (notifications) => {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        return notifications.filter(n => {
            const notificationDate = new Date(n.timestamp);
            return notificationDate > oneWeekAgo;
        }).slice(0, 10); // Last 10 notifications
    }
);

/**
 * AUDIT SELECTORS
 */
export const selectAudit = state => state.audit;
export const selectAuditLogs = state => state.audit.logs;
export const selectLastAuditLogId = state => state.audit.lastLogId;
export const selectAuditEnabled = state => state.audit.enabled;
export const selectAuditRetentionDays = state => state.audit.retentionDays;
export const selectAuditCategories = state => state.audit.categories;

export const selectAuditLogsByCategory = createSelector(
    [selectAuditLogs],
    (logs) => {
        const byCategory = {};
        
        logs.forEach(log => {
            const category = log.category || 'unknown';
            if (!byCategory[category]) {
                byCategory[category] = [];
            }
            byCategory[category].push(log);
        });
        
        return byCategory;
    }
);

export const selectRecentAuditLogs = createSelector(
    [selectAuditLogs],
    (logs) => {
        return logs.slice(0, 50); // Last 50 logs
    }
);

export const selectAuditLogsByUser = createSelector(
    [selectAuditLogs, selectUserId],
    (logs, userId) => {
        return logs.filter(log => log.userId === userId);
    }
);

/**
 * COMPOSITE SELECTORS (Cross-slice logic)
 */
export const selectUserProfile = createSelector(
    [selectUser, selectCurrentRole, selectBorrowerRating, selectIsBlacklisted],
    (user, role, rating, isBlacklisted) => {
        return {
            ...user,
            currentRole: role,
            rating,
            isBlacklisted,
            displayName: user.fullName || user.username
        };
    }
);

export const selectDashboardStats = createSelector(
    [
        selectCurrentRole,
        selectIsLenderActive,
        selectIsBorrowerActive,
        selectAmountLent,
        selectTotalBorrowed,
        selectActiveLedgersCount,
        selectActiveLoanCount,
        selectOutstandingAmount
    ],
    (role, isLender, isBorrower, amountLent, totalBorrowed, activeLedgers, activeLoans, outstanding) => {
        const stats = {
            role,
            isLender,
            isBorrower,
            amountLent,
            totalBorrowed,
            activeLedgers,
            activeLoans,
            outstandingAmount: outstanding
        };
        
        if (isLender) {
            stats.lenderStats = {
                performance: Math.round((activeLedgers > 0 ? 95 : 0)), // Simplified
                availableToLend: 5000 - amountLent, // Simplified
                nextPaymentDue: '28th next month'
            };
        }
        
        if (isBorrower) {
            stats.borrowerStats = {
                rating: 4.5, // Simplified
                availableToBorrow: 10000 - totalBorrowed, // Simplified
                nextRepaymentDue: 'In 3 days'
            };
        }
        
        return stats;
    }
);

export const selectPlatformHierarchy = createSelector(
    [
        selectCurrentCountry,
        selectCurrentGroup,
        selectCurrentRole,
        selectIsLenderActive,
        selectIsBorrowerActive
    ],
    (country, group, role, isLender, isBorrower) => {
        return {
            Global: {
                Countries: {
                    [country || 'None']: {
                        Groups: {
                            [group || 'None']: {
                                Lenders: isLender ? ['You'] : [],
                                Borrowers: isBorrower ? ['You'] : [],
                                Ledgers: [] // Would be populated from actual data
                            }
                        }
                    }
                }
            }
        };
    }
);

export const selectComplianceStatus = createSelector(
    [
        selectCountryIsSet,
        selectIsInGroup,
        selectIsSubscriptionActive,
        selectIsBlacklisted,
        selectCanBorrow,
        selectCanLend
    ],
    (countrySet, inGroup, subscriptionActive, blacklisted, canBorrow, canLend) => {
        return {
            countrySet,
            inGroup,
            subscriptionActive,
            blacklisted,
            canBorrow,
            canLend,
            isCompliant: countrySet && !blacklisted && (canBorrow || canLend)
        };
    }
);

export const selectSystemStatus = createSelector(
    [
        selectIsOnline,
        selectSyncInProgress,
        selectHasPendingChanges,
        selectIsSessionValid,
        selectDaysUntilSubscriptionExpiry
    ],
    (online, syncing, pendingChanges, sessionValid, daysUntilExpiry) => {
        return {
            online,
            syncing,
            pendingChanges,
            sessionValid,
            daysUntilExpiry,
            status: online ? (syncing ? 'syncing' : 'online') : 'offline'
        };
    }
);

/**
 * UTILITY SELECTORS
 */
export const selectAllState = state => state;

export const selectStateSlice = (state, sliceName) => {
    return state[sliceName];
};

export const selectStateByPath = (state, path) => {
    const parts = path.split('.');
    let current = state;
    
    for (const part of parts) {
        if (current === undefined || current === null) {
            return undefined;
        }
        current = current[part];
    }
    
    return current;
};

// Export all selectors for easy import
export default {
    // Auth
    selectAuth,
    selectIsAuthenticated,
    selectAuthToken,
    selectSessionExpiry,
    selectIsSessionValid,
    selectSessionTimeRemaining,
    
    // User
    selectUser,
    selectUserId,
    selectUsername,
    selectUserEmail,
    selectUserPhone,
    selectUserFullName,
    selectUserInitials,
    selectUserDisplayName,
    
    // Role
    selectRole,
    selectCurrentRole,
    selectIsBorrower,
    selectIsLender,
    selectIsAdmin,
    selectCanSwitchRole,
    
    // Country
    selectCountry,
    selectCurrentCountry,
    selectCurrentCountryInfo,
    selectCurrentCurrency,
    selectCurrentCountryFlag,
    selectCountryIsSet,
    selectCanChangeCountry,
    
    // Group
    selectGroup,
    selectCurrentGroup,
    selectCurrentGroupInfo,
    selectCurrentGroupName,
    selectIsInGroup,
    selectGroupMembers,
    selectCanCreateGroup,
    selectCanJoinAnotherGroup,
    
    // Lender
    selectLender,
    selectIsLenderActive,
    selectSubscriptionLevel,
    selectIsSubscriptionActive,
    selectIsSubscriptionExpired,
    selectDaysUntilSubscriptionExpiry,
    selectCanLend,
    selectAvailableToLend,
    selectLenderPerformance,
    selectLenderReputation,
    selectIsLenderBlocked,
    
    // Borrower
    selectBorrower,
    selectIsBorrowerActive,
    selectCanBorrow,
    selectBorrowerReputation,
    selectAvailableBorrowingLimit,
    selectIsBlacklisted,
    selectCanJoinMoreGroups,
    selectBorrowerSuccessRate,
    
    // Ledger
    selectLedger,
    selectLedgers,
    selectAllLedgers,
    selectLedgerById,
    selectLedgersByGroup,
    selectLedgersByBorrower,
    selectLedgersByLender,
    selectActiveLedgersByLender,
    selectOverdueLedgersByLender,
    selectLedgerStats,
    selectLedgerTotalsByLender,
    selectLedgerPerformance,
    selectAverageLoanSize,
    selectAverageRepaymentDays,
    
    // Subscription
    selectSubscription,
    selectCurrentPlanDetails,
    selectSubscriptionCost,
    selectSubscriptionFeatures,
    selectPaymentHistoryByYear,
    selectTotalSpentOnSubscriptions,
    
    // Blacklist
    selectBlacklist,
    selectIsUserBlacklisted,
    selectBlacklistEntriesByCountry,
    selectDefaultersByCountry,
    selectTotalBlacklistedAmount,
    selectCanRemoveFromBlacklist,
    
    // UI
    selectUI,
    selectTheme,
    selectIsDarkTheme,
    selectLanguage,
    selectSidebarOpen,
    selectNotificationsPanelOpen,
    selectMobileMenuOpen,
    selectCurrentPage,
    selectIsLoading,
    selectError,
    selectSuccess,
    selectModalState,
    selectHasError,
    selectHasSuccess,
    
    // PWA
    selectPWA,
    selectIsPWAInstalled,
    selectIsOnline,
    selectHasUpdate,
    selectCanInstallPWA,
    selectOfflineQueueLength,
    selectIsSyncing,
    
    // Sync
    selectSync,
    selectLastSync,
    selectTimeSinceLastSync,
    selectSyncInProgress,
    selectHasPendingChanges,
    selectHasOfflineChanges,
    selectNeedsSync,
    
    // Navigation
    selectNavigation,
    selectCurrentPath,
    selectPreviousPath,
    selectBreadcrumbs,
    selectCanGoBack,
    selectCanGoForward,
    selectRequiresAuth,
    selectRequiresRole,
    selectRequiresCountry,
    selectRequiresSubscription,
    selectRequiresGroup,
    selectCanAccessCurrentPage,
    
    // Notification
    selectNotification,
    selectNotifications,
    selectUnreadCount,
    selectUnreadNotifications,
    selectNotificationsByType,
    selectRecentNotifications,
    
    // Audit
    selectAudit,
    selectAuditLogs,
    selectAuditLogsByCategory,
    selectRecentAuditLogs,
    selectAuditLogsByUser,
    
    // Composite
    selectUserProfile,
    selectDashboardStats,
    selectPlatformHierarchy,
    selectComplianceStatus,
    selectSystemStatus,
    
    // Utility
    selectAllState,
    selectStateSlice,
    selectStateByPath
};