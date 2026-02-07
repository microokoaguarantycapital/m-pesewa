/**
 * M-PESEWA AUDIT SLICE
 * Complete audit trail for all financial transactions and user actions
 * Enforces strict compliance with financial regulations and business rules
 * Tracks: Loans, Repayments, Subscriptions, Blacklists, Ledger updates
 */

import { createSlice } from './store.core.js';

// Audit event types based on M-Pesewa business activities
const AUDIT_EVENT_TYPES = {
  // User Management
  USER_REGISTRATION: 'USER_REGISTRATION',
  USER_LOGIN: 'USER_LOGIN',
  USER_LOGOUT: 'USER_LOGOUT',
  USER_PROFILE_UPDATE: 'USER_PROFILE_UPDATE',
  USER_ROLE_CHANGE: 'USER_ROLE_CHANGE',
  
  // Country & Group Operations
  COUNTRY_SELECTION: 'COUNTRY_SELECTION',
  GROUP_CREATION: 'GROUP_CREATION',
  GROUP_JOIN: 'GROUP_JOIN',
  GROUP_LEAVE: 'GROUP_LEAVE',
  GROUP_INVITATION: 'GROUP_INVITATION',
  
  // Loan Operations
  LOAN_REQUEST: 'LOAN_REQUEST',
  LOAN_APPROVAL: 'LOAN_APPROVAL',
  LOAN_REJECTION: 'LOAN_REJECTION',
  LOAN_DISBURSEMENT: 'LOAN_DISBURSEMENT',
  LOAN_REPAYMENT: 'LOAN_REPAYMENT',
  LOAN_PARTIAL_REPAYMENT: 'LOAN_PARTIAL_REPAYMENT',
  LOAN_OVERDUE: 'LOAN_OVERDUE',
  LOAN_DEFAULT: 'LOAN_DEFAULT',
  LOAN_WRITE_OFF: 'LOAN_WRITE_OFF',
  
  // Ledger Operations
  LEDGER_CREATION: 'LEDGER_CREATION',
  LEDGER_UPDATE: 'LEDGER_UPDATE',
  LEDGER_CLOSURE: 'LEDGER_CLOSURE',
  LEDGER_DELETION: 'LEDGER_DELETION',
  
  // Subscription Operations
  SUBSCRIPTION_PURCHASE: 'SUBSCRIPTION_PURCHASE',
  SUBSCRIPTION_RENEWAL: 'SUBSCRIPTION_RENEWAL',
  SUBSCRIPTION_UPGRADE: 'SUBSCRIPTION_UPGRADE',
  SUBSCRIPTION_DOWNGRADE: 'SUBSCRIPTION_DOWNGRADE',
  SUBSCRIPTION_EXPIRY: 'SUBSCRIPTION_EXPIRY',
  SUBSCRIPTION_BLOCK: 'SUBSCRIPTION_BLOCK',
  
  // Reputation System
  BORROWER_RATING: 'BORROWER_RATING',
  BLACKLIST_ADDITION: 'BLACKLIST_ADDITION',
  BLACKLIST_REMOVAL: 'BLACKLIST_REMOVAL',
  RATING_ADJUSTMENT: 'RATING_ADJUSTMENT',
  
  // Financial Transactions
  INTEREST_CALCULATION: 'INTEREST_CALCULATION',
  PENALTY_APPLICATION: 'PENALTY_APPLICATION',
  FEE_CHARGE: 'FEE_CHARGE',
  REFUND_ISSUANCE: 'REFUND_ISSUANCE',
  
  // System Operations
  SYSTEM_BACKUP: 'SYSTEM_BACKUP',
  SYSTEM_RESTORE: 'SYSTEM_RESTORE',
  DATA_EXPORT: 'DATA_EXPORT',
  DATA_IMPORT: 'DATA_IMPORT',
  SECURITY_BREACH: 'SECURITY_BREACH',
  ADMIN_OVERRIDE: 'ADMIN_OVERRIDE',
  
  // Compliance Events
  COMPLIANCE_CHECK: 'COMPLIANCE_CHECK',
  REGULATORY_REPORT: 'REGULATORY_REPORT',
  AUDIT_TRAIL_EXPORT: 'AUDIT_TRAIL_EXPORT'
};

// Audit severity levels
const AUDIT_SEVERITY = {
  CRITICAL: 'CRITICAL', // Security breaches, financial fraud, system failures
  HIGH: 'HIGH', // Financial transactions, blacklist actions, overrides
  MEDIUM: 'MEDIUM', // Loan approvals, repayments, subscriptions
  LOW: 'LOW', // Profile updates, ratings, group joins
  INFO: 'INFO' // Logins, views, informational events
};

// Initial state
const initialState = {
  // Audit logs
  auditLogs: [],
  
  // Audit configuration
  config: {
    retentionDays: 365, // Keep logs for 1 year (regulatory requirement)
    maxLogSize: 10000, // Maximum logs in memory
    realTimeLogging: true,
    logFinancialTransactions: true,
    logUserActions: true,
    logSystemEvents: true,
    logComplianceEvents: true,
    encryptionRequired: true,
    backupFrequency: 'daily'
  },
  
  // Statistics
  stats: {
    totalEvents: 0,
    eventsByType: {},
    eventsBySeverity: {},
    eventsByUser: {},
    eventsByCountry: {},
    eventsByGroup: {},
    financialVolume: 0,
    last30Days: {
      total: 0,
      financial: 0,
      security: 0,
      compliance: 0
    }
  },
  
  // Filters for audit viewing
  filters: {
    startDate: null,
    endDate: null,
    eventTypes: [],
    severities: [],
    userIds: [],
    countryCodes: [],
    groupIds: []
  },
  
  // Audit reports
  reports: {
    daily: null,
    weekly: null,
    monthly: null,
    quarterly: null,
    yearly: null
  },
  
  // Compliance status
  compliance: {
    lastAudit: null,
    nextAudit: null,
    violations: [],
    warnings: [],
    recommendations: []
  },
  
  // UI state
  isLoading: false,
  isExporting: false,
  searchQuery: '',
  currentPage: 1,
  pageSize: 50,
  totalPages: 1,
  selectedLog: null,
  viewMode: 'list' // 'list', 'details', 'timeline', 'analytics'
};

// Helper function to create audit log entry with M-Pesewa business context
const createAuditLog = (type, data, severity = AUDIT_SEVERITY.INFO) => {
  const timestamp = Date.now();
  const sessionId = localStorage.getItem('mpesewa_session_id') || 'anonymous';
  
  // Get user context
  const userContext = JSON.parse(localStorage.getItem('mpesewa_user_context') || '{}');
  
  // Get navigation context
  const navContext = JSON.parse(localStorage.getItem('mpesewa_navigation_state') || '{}');
  
  const baseLog = {
    id: `audit_${timestamp}_${Math.random().toString(36).substr(2, 9)}`,
    type,
    timestamp,
    severity,
    sessionId,
    userAgent: navigator.userAgent,
    ipAddress: 'captured_server_side', // Would be captured server-side
    location: {
      country: navContext.hierarchy?.currentCountry || null,
      group: navContext.currentPath?.group || null,
      lender: navContext.currentPath?.lenderId || null,
      borrower: navContext.currentPath?.borrowerId || null
    },
    user: {
      id: userContext.userId || 'anonymous',
      role: userContext.role || 'guest',
      username: userContext.username || 'guest'
    },
    data,
    metadata: {
      version: '1.0',
      platform: 'M-Pesewa PWA',
      environment: process.env.NODE_ENV || 'production'
    }
  };
  
  // Add business-specific fields based on event type
  switch (type) {
    case AUDIT_EVENT_TYPES.LOAN_REQUEST:
      return {
        ...baseLog,
        severity: AUDIT_SEVERITY.MEDIUM,
        data: {
          ...data,
          businessRule: '7-day repayment with 10% interest',
          validation: 'Group isolation, borrower rating check'
        }
      };
    
    case AUDIT_EVENT_TYPES.LOAN_APPROVAL:
      return {
        ...baseLog,
        severity: AUDIT_SEVERITY.HIGH,
        data: {
          ...data,
          businessRule: 'Lender subscription required, group isolation',
          ledgerCreated: true,
          terms: '7 days, 10% interest, 5% daily penalty after 7 days'
        }
      };
    
    case AUDIT_EVENT_TYPES.LOAN_DEFAULT:
      return {
        ...baseLog,
        severity: AUDIT_SEVERITY.CRITICAL,
        data: {
          ...data,
          businessRule: 'Default after 2 months, blacklist applied',
          actions: 'Blacklist badge, cannot borrow or join new groups'
        }
      };
    
    case AUDIT_EVENT_TYPES.SUBSCRIPTION_PURCHASE:
      return {
        ...baseLog,
        severity: AUDIT_SEVERITY.MEDIUM,
        data: {
          ...data,
          businessRule: 'Lenders only, expires 28th of each month',
          tiers: 'Basic (≤1,500), Premium (≤5,000), Super (≤20,000)'
        }
      };
    
    case AUDIT_EVENT_TYPES.SUBSCRIPTION_BLOCK:
      return {
        ...baseLog,
        severity: AUDIT_SEVERITY.HIGH,
        data: {
          ...data,
          businessRule: 'Blocked on 28th if not renewed',
          effect: 'Cannot lend, ledger access blocked'
        }
      };
    
    case AUDIT_EVENT_TYPES.BLACKLIST_ADDITION:
      return {
        ...baseLog,
        severity: AUDIT_SEVERITY.CRITICAL,
        data: {
          ...data,
          businessRule: 'Default > 2 months, admin override possible',
          restrictions: 'Cannot borrow, cannot join new groups',
          removal: 'Admin only after full repayment'
        }
      };
    
    case AUDIT_EVENT_TYPES.ADMIN_OVERRIDE:
      return {
        ...baseLog,
        severity: AUDIT_SEVERITY.CRITICAL,
        data: {
          ...data,
          businessRule: 'Admin can override any blacklist or ledger',
          justification: data.justification || 'Administrative override',
          requiresApproval: 'Super admin approval required'
        }
      };
    
    default:
      return baseLog;
  }
};

// Create audit slice
const auditSlice = createSlice({
  name: 'audit',
  initialState,
  reducers: {
    // Log audit event
    logAuditEvent: (state, action) => {
      const { type, data, severity = AUDIT_SEVERITY.INFO } = action.payload;
      
      // Create audit log entry
      const auditLog = createAuditLog(type, data, severity);
      
      // Add to logs
      state.auditLogs.unshift(auditLog);
      
      // Enforce maximum log size
      if (state.auditLogs.length > state.config.maxLogSize) {
        state.auditLogs = state.auditLogs.slice(0, state.config.maxLogSize);
      }
      
      // Update statistics
      state.stats.totalEvents++;
      
      // Update type statistics
      if (!state.stats.eventsByType[type]) {
        state.stats.eventsByType[type] = 0;
      }
      state.stats.eventsByType[type]++;
      
      // Update severity statistics
      if (!state.stats.eventsBySeverity[severity]) {
        state.stats.eventsBySeverity[severity] = 0;
      }
      state.stats.eventsBySeverity[severity]++;
      
      // Update user statistics
      if (auditLog.user.id !== 'anonymous') {
        if (!state.stats.eventsByUser[auditLog.user.id]) {
          state.stats.eventsByUser[auditLog.user.id] = 0;
        }
        state.stats.eventsByUser[auditLog.user.id]++;
      }
      
      // Update country statistics
      if (auditLog.location.country) {
        if (!state.stats.eventsByCountry[auditLog.location.country]) {
          state.stats.eventsByCountry[auditLog.location.country] = 0;
        }
        state.stats.eventsByCountry[auditLog.location.country]++;
      }
      
      // Update group statistics
      if (auditLog.location.group) {
        if (!state.stats.eventsByGroup[auditLog.location.group]) {
          state.stats.eventsByGroup[auditLog.location.group] = 0;
        }
        state.stats.eventsByGroup[auditLog.location.group]++;
      }
      
      // Update financial volume if applicable
      if (data?.amount) {
        state.stats.financialVolume += parseFloat(data.amount) || 0;
      }
      
      // Update last 30 days statistics
      const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
      if (auditLog.timestamp >= thirtyDaysAgo) {
        state.stats.last30Days.total++;
        
        if (type.includes('LOAN') || type.includes('SUBSCRIPTION') || 
            type.includes('INTEREST') || type.includes('PENALTY')) {
          state.stats.last30Days.financial++;
        }
        
        if (type.includes('SECURITY') || severity === AUDIT_SEVERITY.CRITICAL) {
          state.stats.last30Days.security++;
        }
        
        if (type.includes('COMPLIANCE') || type.includes('REGULATORY')) {
          state.stats.last30Days.compliance++;
        }
      }
      
      // Store in localStorage for persistence (limited to last 1000 events)
      try {
        const logsToStore = state.auditLogs.slice(0, 1000);
        localStorage.setItem('mpesewa_audit_logs', JSON.stringify(logsToStore));
        localStorage.setItem('mpesewa_audit_stats', JSON.stringify(state.stats));
      } catch (error) {
        console.error('Error saving audit logs:', error);
      }
      
      // Send to server in real implementation
      if (state.config.realTimeLogging) {
        // This would be an API call in production
        console.log('Audit event logged:', auditLog);
      }
    },
    
    // Load audit logs from storage
    loadAuditLogs: (state) => {
      try {
        const savedLogs = localStorage.getItem('mpesewa_audit_logs');
        const savedStats = localStorage.getItem('mpesewa_audit_stats');
        
        if (savedLogs) {
          const logs = JSON.parse(savedLogs);
          state.auditLogs = logs;
        }
        
        if (savedStats) {
          state.stats = JSON.parse(savedStats);
        }
      } catch (error) {
        console.error('Error loading audit logs:', error);
      }
    },
    
    // Clear audit logs (admin only)
    clearAuditLogs: (state) => {
      // Only allow clearing if user is admin
      const userContext = JSON.parse(localStorage.getItem('mpesewa_user_context') || '{}');
      if (userContext.role === 'admin') {
        state.auditLogs = [];
        state.stats = initialState.stats;
        localStorage.removeItem('mpesewa_audit_logs');
        localStorage.removeItem('mpesewa_audit_stats');
        
        // Log the clearance
        state.auditLogs.unshift(createAuditLog(
          AUDIT_EVENT_TYPES.SYSTEM_BACKUP,
          { action: 'audit_logs_cleared', clearedBy: userContext.username },
          AUDIT_SEVERITY.HIGH
        ));
      }
    },
    
    // Export audit logs
    exportAuditLogs: (state, action) => {
      const { format = 'json', filters = {} } = action.payload;
      
      state.isExporting = true;
      
      // Apply filters
      let filteredLogs = [...state.auditLogs];
      
      if (filters.startDate) {
        filteredLogs = filteredLogs.filter(log => log.timestamp >= filters.startDate);
      }
      
      if (filters.endDate) {
        filteredLogs = filteredLogs.filter(log => log.timestamp <= filters.endDate);
      }
      
      if (filters.eventTypes?.length > 0) {
        filteredLogs = filteredLogs.filter(log => filters.eventTypes.includes(log.type));
      }
      
      if (filters.severities?.length > 0) {
        filteredLogs = filteredLogs.filter(log => filters.severities.includes(log.severity));
      }
      
      if (filters.userIds?.length > 0) {
        filteredLogs = filteredLogs.filter(log => filters.userIds.includes(log.user.id));
      }
      
      // Create export data
      const exportData = {
        metadata: {
          exportedAt: Date.now(),
          format,
          totalLogs: filteredLogs.length,
          filtersApplied: Object.keys(filters).length > 0,
          exporter: JSON.parse(localStorage.getItem('mpesewa_user_context') || '{}').username || 'anonymous'
        },
        logs: filteredLogs,
        summary: {
          byType: filteredLogs.reduce((acc, log) => {
            acc[log.type] = (acc[log.type] || 0) + 1;
            return acc;
          }, {}),
          bySeverity: filteredLogs.reduce((acc, log) => {
            acc[log.severity] = (acc[log.severity] || 0) + 1;
            return acc;
          }, {}),
          financialVolume: filteredLogs.reduce((acc, log) => {
            return acc + (log.data?.amount ? parseFloat(log.data.amount) : 0);
          }, 0)
        }
      };
      
      // Log the export
      state.auditLogs.unshift(createAuditLog(
        AUDIT_EVENT_TYPES.AUDIT_TRAIL_EXPORT,
        { format, logCount: filteredLogs.length, filters },
        AUDIT_SEVERITY.MEDIUM
      ));
      
      state.isExporting = false;
      return exportData;
    },
    
    // Set audit filters
    setAuditFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.currentPage = 1; // Reset to first page when filters change
    },
    
    // Clear audit filters
    clearAuditFilters: (state) => {
      state.filters = initialState.filters;
      state.currentPage = 1;
    },
    
    // Set current page
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    
    // Set page size
    setPageSize: (state, action) => {
      state.pageSize = action.payload;
      state.currentPage = 1;
      state.totalPages = Math.ceil(state.auditLogs.length / action.payload);
    },
    
    // Set search query
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.currentPage = 1;
    },
    
    // Set view mode
    setViewMode: (state, action) => {
      state.viewMode = action.payload;
    },
    
    // Select log for detailed view
    selectLog: (state, action) => {
      state.selectedLog = action.payload;
    },
    
    // Update audit configuration
    updateAuditConfig: (state, action) => {
      state.config = { ...state.config, ...action.payload };
      localStorage.setItem('mpesewa_audit_config', JSON.stringify(state.config));
    },
    
    // Generate audit report
    generateAuditReport: (state, action) => {
      const { period } = action.payload; // 'daily', 'weekly', 'monthly', 'quarterly', 'yearly'
      
      const now = Date.now();
      let startTime;
      
      switch (period) {
        case 'daily':
          startTime = now - (24 * 60 * 60 * 1000);
          break;
        case 'weekly':
          startTime = now - (7 * 24 * 60 * 60 * 1000);
          break;
        case 'monthly':
          startTime = now - (30 * 24 * 60 * 60 * 1000);
          break;
        case 'quarterly':
          startTime = now - (90 * 24 * 60 * 60 * 1000);
          break;
        case 'yearly':
          startTime = now - (365 * 24 * 60 * 60 * 1000);
          break;
        default:
          startTime = now - (24 * 60 * 60 * 1000);
      }
      
      const periodLogs = state.auditLogs.filter(log => log.timestamp >= startTime);
      
      const report = {
        period,
        startTime,
        endTime: now,
        totalEvents: periodLogs.length,
        summary: {
          byType: periodLogs.reduce((acc, log) => {
            acc[log.type] = (acc[log.type] || 0) + 1;
            return acc;
          }, {}),
          bySeverity: periodLogs.reduce((acc, log) => {
            acc[log.severity] = (acc[log.severity] || 0) + 1;
            return acc;
          }, {}),
          financialVolume: periodLogs.reduce((acc, log) => {
            return acc + (log.data?.amount ? parseFloat(log.data.amount) : 0);
          }, 0),
          topUsers: Object.entries(
            periodLogs.reduce((acc, log) => {
              if (log.user.id !== 'anonymous') {
                acc[log.user.id] = (acc[log.user.id] || 0) + 1;
              }
              return acc;
            }, {})
          )
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10),
          topCountries: Object.entries(
            periodLogs.reduce((acc, log) => {
              if (log.location.country) {
                acc[log.location.country] = (acc[log.location.country] || 0) + 1;
              }
              return acc;
            }, {})
          )
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
        },
        anomalies: {
          securityBreaches: periodLogs.filter(log => 
            log.type === AUDIT_EVENT_TYPES.SECURITY_BREACH || 
            log.severity === AUDIT_SEVERITY.CRITICAL
          ).length,
          financialDiscrepancies: periodLogs.filter(log => 
            log.type.includes('LOAN') && log.severity === AUDIT_SEVERITY.HIGH
          ).length,
          adminOverrides: periodLogs.filter(log => 
            log.type === AUDIT_EVENT_TYPES.ADMIN_OVERRIDE
          ).length
        },
        recommendations: []
      };
      
      // Add recommendations based on anomalies
      if (report.anomalies.securityBreaches > 0) {
        report.recommendations.push({
          type: 'SECURITY',
          priority: 'HIGH',
          message: `${report.anomalies.securityBreaches} security breaches detected. Review immediately.`
        });
      }
      
      if (report.anomalies.financialDiscrepancies > 10) {
        report.recommendations.push({
          type: 'FINANCIAL',
          priority: 'MEDIUM',
          message: 'High number of financial discrepancies. Consider enhanced monitoring.'
        });
      }
      
      state.reports[period] = report;
      
      // Log report generation
      state.auditLogs.unshift(createAuditLog(
        AUDIT_EVENT_TYPES.REGULATORY_REPORT,
        { period, eventCount: periodLogs.length },
        AUDIT_SEVERITY.MEDIUM
      ));
      
      return report;
    },
    
    // M-PESEWA SPECIFIC BUSINESS AUDIT LOGS
    
    // Log loan transaction with business rules
    logLoanTransaction: (state, action) => {
      const { type, loanData, lenderId, borrowerId, amount, groupId } = action.payload;
      
      // Validate business rules
      const validation = {
        maxAmount: 20000, // Super tier maximum
        repaymentPeriod: 7, // days
        interestRate: 0.10, // 10%
        penaltyRate: 0.05, // 5% daily after 7 days
        defaultPeriod: 60 // days (2 months)
      };
      
      const auditLog = createAuditLog(
        type,
        {
          ...loanData,
          businessRules: validation,
          hierarchy: {
            country: JSON.parse(localStorage.getItem('mpesewa_navigation_state') || '{}').hierarchy?.currentCountry,
            group: groupId,
            lender: lenderId,
            borrower: borrowerId
          },
          amount,
          timestamp: Date.now()
        },
        type === AUDIT_EVENT_TYPES.LOAN_DEFAULT ? AUDIT_SEVERITY.CRITICAL : 
        type === AUDIT_EVENT_TYPES.LOAN_OVERDUE ? AUDIT_SEVERITY.HIGH : 
        AUDIT_SEVERITY.MEDIUM
      );
      
      state.auditLogs.unshift(auditLog);
      state.stats.totalEvents++;
      state.stats.financialVolume += parseFloat(amount) || 0;
    },
    
    // Log subscription transaction
    logSubscriptionTransaction: (state, action) => {
      const { type, subscriptionData, userId, tier, amount } = action.payload;
      
      const auditLog = createAuditLog(
        type,
        {
          ...subscriptionData,
          userId,
          tier,
          amount,
          expiryRule: '28th of each month',
          blockageRule: 'Access blocked if expired'
        },
        type === AUDIT_EVENT_TYPES.SUBSCRIPTION_BLOCK ? AUDIT_SEVERITY.HIGH : AUDIT_SEVERITY.MEDIUM
      );
      
      state.auditLogs.unshift(auditLog);
      state.stats.totalEvents++;
    },
    
    // Log blacklist operation
    logBlacklistOperation: (state, action) => {
      const { type, operationData, borrowerId, loanId, adminId } = action.payload;
      
      const auditLog = createAuditLog(
        type,
        {
          ...operationData,
          borrowerId,
          loanId,
          adminId,
          businessRules: {
            trigger: 'Default > 2 months',
            restrictions: 'Cannot borrow, cannot join new groups',
            removal: 'Admin only after full repayment'
          }
        },
        AUDIT_SEVERITY.CRITICAL
      );
      
      state.auditLogs.unshift(auditLog);
      state.stats.totalEvents++;
    },
    
    // Log admin override
    logAdminOverride: (state, action) => {
      const { overrideData, adminId, targetType, targetId, justification } = action.payload;
      
      const auditLog = createAuditLog(
        AUDIT_EVENT_TYPES.ADMIN_OVERRIDE,
        {
          ...overrideData,
          adminId,
          targetType,
          targetId,
          justification,
          timestamp: Date.now(),
          requiresApproval: 'Super admin approval logged'
        },
        AUDIT_SEVERITY.CRITICAL
      );
      
      state.auditLogs.unshift(auditLog);
      state.stats.totalEvents++;
    },
    
    // Log compliance check
    logComplianceCheck: (state, action) => {
      const { checkType, countryCode, status, findings } = action.payload;
      
      const auditLog = createAuditLog(
        AUDIT_EVENT_TYPES.COMPLIANCE_CHECK,
        {
          checkType,
          countryCode,
          status,
          findings,
          timestamp: Date.now(),
          regulator: 'Country-specific financial authority'
        },
        status === 'FAIL' ? AUDIT_SEVERITY.HIGH : AUDIT_SEVERITY.MEDIUM
      );
      
      state.auditLogs.unshift(auditLog);
      state.stats.totalEvents++;
      
      // Update compliance status
      if (status === 'FAIL') {
        state.compliance.violations.push({
          checkType,
          countryCode,
          timestamp: Date.now(),
          description: findings
        });
      } else if (status === 'WARN') {
        state.compliance.warnings.push({
          checkType,
          countryCode,
          timestamp: Date.now(),
          description: findings
        });
      }
    },
    
    // Set loading state
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    
    // Clean up old logs (based on retention policy)
    cleanupOldLogs: (state) => {
      const retentionPeriod = state.config.retentionDays * 24 * 60 * 60 * 1000;
      const cutoffTime = Date.now() - retentionPeriod;
      
      state.auditLogs = state.auditLogs.filter(log => log.timestamp >= cutoffTime);
      
      // Log the cleanup
      state.auditLogs.unshift(createAuditLog(
        AUDIT_EVENT_TYPES.SYSTEM_BACKUP,
        { action: 'audit_logs_cleanup', logsRemoved: state.auditLogs.length },
        AUDIT_SEVERITY.LOW
      ));
    }
  },
  
  // Selectors for derived state
  selectors: {
    // Get filtered audit logs
    getFilteredLogs: (state) => {
      let filtered = [...state.auditLogs];
      
      // Apply text search
      if (state.searchQuery) {
        const query = state.searchQuery.toLowerCase();
        filtered = filtered.filter(log => 
          log.type.toLowerCase().includes(query) ||
          log.user.username.toLowerCase().includes(query) ||
          JSON.stringify(log.data).toLowerCase().includes(query)
        );
      }
      
      // Apply filters
      if (state.filters.startDate) {
        filtered = filtered.filter(log => log.timestamp >= state.filters.startDate);
      }
      
      if (state.filters.endDate) {
        filtered = filtered.filter(log => log.timestamp <= state.filters.endDate);
      }
      
      if (state.filters.eventTypes?.length > 0) {
        filtered = filtered.filter(log => state.filters.eventTypes.includes(log.type));
      }
      
      if (state.filters.severities?.length > 0) {
        filtered = filtered.filter(log => state.filters.severities.includes(log.severity));
      }
      
      if (state.filters.userIds?.length > 0) {
        filtered = filtered.filter(log => state.filters.userIds.includes(log.user.id));
      }
      
      if (state.filters.countryCodes?.length > 0) {
        filtered = filtered.filter(log => state.filters.countryCodes.includes(log.location.country));
      }
      
      if (state.filters.groupIds?.length > 0) {
        filtered = filtered.filter(log => state.filters.groupIds.includes(log.location.group));
      }
      
      // Calculate pagination
      state.totalPages = Math.ceil(filtered.length / state.pageSize);
      const startIndex = (state.currentPage - 1) * state.pageSize;
      const endIndex = startIndex + state.pageSize;
      
      return {
        logs: filtered.slice(startIndex, endIndex),
        total: filtered.length,
        page: state.currentPage,
        totalPages: state.totalPages,
        hasPrevious: state.currentPage > 1,
        hasNext: state.currentPage < state.totalPages
      };
    },
    
    // Get audit statistics
    getAuditStats: (state) => state.stats,
    
    // Get compliance status
    getComplianceStatus: (state) => state.compliance,
    
    // Get recent critical events
    getRecentCriticalEvents: (state, limit = 10) => {
      return state.auditLogs
        .filter(log => log.severity === AUDIT_SEVERITY.CRITICAL)
        .slice(0, limit);
    },
    
    // Get financial audit summary
    getFinancialSummary: (state) => {
      const financialLogs = state.auditLogs.filter(log => 
        log.type.includes('LOAN') || 
        log.type.includes('SUBSCRIPTION') ||
        log.type.includes('INTEREST') ||
        log.type.includes('PENALTY')
      );
      
      return {
        totalTransactions: financialLogs.length,
        totalVolume: state.stats.financialVolume,
        byType: financialLogs.reduce((acc, log) => {
          acc[log.type] = (acc[log.type] || 0) + 1;
          return acc;
        }, {}),
        last30Days: state.stats.last30Days.financial
      };
    },
    
    // Get user activity summary
    getUserActivitySummary: (state, userId) => {
      const userLogs = state.auditLogs.filter(log => log.user.id === userId);
      
      return {
        totalActions: userLogs.length,
        firstActivity: userLogs.length > 0 ? Math.min(...userLogs.map(l => l.timestamp)) : null,
        lastActivity: userLogs.length > 0 ? Math.max(...userLogs.map(l => l.timestamp)) : null,
        byType: userLogs.reduce((acc, log) => {
          acc[log.type] = (acc[log.type] || 0) + 1;
          return acc;
        }, {}),
        bySeverity: userLogs.reduce((acc, log) => {
          acc[log.severity] = (acc[log.severity] || 0) + 1;
          return acc;
        }, {})
      };
    },
    
    // Get country activity summary
    getCountryActivitySummary: (state, countryCode) => {
      const countryLogs = state.auditLogs.filter(log => log.location.country === countryCode);
      
      return {
        totalEvents: countryLogs.length,
        financialVolume: countryLogs.reduce((acc, log) => {
          return acc + (log.data?.amount ? parseFloat(log.data.amount) : 0);
        }, 0),
        uniqueUsers: [...new Set(countryLogs.map(log => log.user.id))].length,
        groups: [...new Set(countryLogs.map(log => log.location.group).filter(Boolean))],
        byType: countryLogs.reduce((acc, log) => {
          acc[log.type] = (acc[log.type] || 0) + 1;
          return acc;
        }, {})
      };
    },
    
    // Check audit trail integrity
    checkAuditIntegrity: (state) => {
      const issues = [];
      
      // Check for missing timestamps
      const logsWithoutTimestamp = state.auditLogs.filter(log => !log.timestamp);
      if (logsWithoutTimestamp.length > 0) {
        issues.push(`Missing timestamps in ${logsWithoutTimestamp.length} logs`);
      }
      
      // Check for sequential IDs
      const ids = state.auditLogs.map(log => log.id).sort();
      for (let i = 1; i < ids.length; i++) {
        if (ids[i] <= ids[i-1]) {
          issues.push('Non-sequential audit log IDs detected');
          break;
        }
      }
      
      // Check for tampering (simplified)
      const tamperedLogs = state.auditLogs.filter(log => {
        // In production, this would verify digital signatures
        return log.metadata?.version !== '1.0';
      });
      
      if (tamperedLogs.length > 0) {
        issues.push(`Possible tampering in ${tamperedLogs.length} logs`);
      }
      
      return {
        isValid: issues.length === 0,
        issues,
        totalLogs: state.auditLogs.length,
        oldestLog: state.auditLogs.length > 0 ? 
          new Date(Math.min(...state.auditLogs.map(l => l.timestamp))).toISOString() : null,
        newestLog: state.auditLogs.length > 0 ? 
          new Date(Math.max(...state.auditLogs.map(l => l.timestamp))).toISOString() : null
      };
    }
  }
});

// Export actions and selectors
export const {
  // Actions
  logAuditEvent,
  loadAuditLogs,
  clearAuditLogs,
  exportAuditLogs,
  setAuditFilters,
  clearAuditFilters,
  setCurrentPage,
  setPageSize,
  setSearchQuery,
  setViewMode,
  selectLog,
  updateAuditConfig,
  generateAuditReport,
  logLoanTransaction,
  logSubscriptionTransaction,
  logBlacklistOperation,
  logAdminOverride,
  logComplianceCheck,
  setLoading,
  cleanupOldLogs,
  
  // Selectors
  getFilteredLogs,
  getAuditStats,
  getComplianceStatus,
  getRecentCriticalEvents,
  getFinancialSummary,
  getUserActivitySummary,
  getCountryActivitySummary,
  checkAuditIntegrity
} = auditSlice;

// Export reducer
export default auditSlice.reducer;

// Export audit types and severities for external use
export { AUDIT_EVENT_TYPES, AUDIT_SEVERITY };

// Audit middleware for automatic business rule logging
export const auditMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  
  // Map action types to audit event types
  const auditEventMap = {
    // Navigation actions
    'navigation/selectCountry': AUDIT_EVENT_TYPES.COUNTRY_SELECTION,
    'navigation/selectGroup': AUDIT_EVENT_TYPES.GROUP_JOIN,
    'navigation/registerAsLender': AUDIT_EVENT_TYPES.USER_ROLE_CHANGE,
    'navigation/registerAsBorrower': AUDIT_EVENT_TYPES.USER_ROLE_CHANGE,
    
    // Loan actions (would come from other slices)
    'loans/requestLoan': AUDIT_EVENT_TYPES.LOAN_REQUEST,
    'loans/approveLoan': AUDIT_EVENT_TYPES.LOAN_APPROVAL,
    'loans/disburseLoan': AUDIT_EVENT_TYPES.LOAN_DISBURSEMENT,
    'loans/repayLoan': AUDIT_EVENT_TYPES.LOAN_REPAYMENT,
    
    // Subscription actions
    'subscriptions/purchaseSubscription': AUDIT_EVENT_TYPES.SUBSCRIPTION_PURCHASE,
    'subscriptions/renewSubscription': AUDIT_EVENT_TYPES.SUBSCRIPTION_RENEWAL,
    'subscriptions/blockSubscription': AUDIT_EVENT_TYPES.SUBSCRIPTION_BLOCK,
    
    // Blacklist actions
    'reputation/addToBlacklist': AUDIT_EVENT_TYPES.BLACKLIST_ADDITION,
    'reputation/removeFromBlacklist': AUDIT_EVENT_TYPES.BLACKLIST_REMOVAL,
    
    // Admin actions
    'admin/overrideBlacklist': AUDIT_EVENT_TYPES.ADMIN_OVERRIDE,
    'admin/overrideLedger': AUDIT_EVENT_TYPES.ADMIN_OVERRIDE
  };
  
  // Check if action should be audited
  const auditEventType = auditEventMap[action.type];
  
  if (auditEventType) {
    // Determine severity based on action type
    let severity = AUDIT_SEVERITY.INFO;
    
    if (action.type.includes('BLOCK') || action.type.includes('DEFAULT')) {
      severity = AUDIT_SEVERITY.HIGH;
    } else if (action.type.includes('OVERRIDE') || action.type.includes('SECURITY')) {
      severity = AUDIT_SEVERITY.CRITICAL;
    } else if (action.type.includes('LOAN') || action.type.includes('SUBSCRIPTION')) {
      severity = AUDIT_SEVERITY.MEDIUM;
    }
    
    // Log the audit event
    store.dispatch(logAuditEvent({
      type: auditEventType,
      data: action.payload,
      severity
    }));
  }
  
  return result;
};

// Initialize audit system
export const initializeAuditSystem = () => {
  // Load saved configuration
  const savedConfig = localStorage.getItem('mpesewa_audit_config');
  const config = savedConfig ? JSON.parse(savedConfig) : initialState.config;
  
  // Load compliance status
  const savedCompliance = localStorage.getItem('mpesewa_compliance_status');
  const compliance = savedCompliance ? JSON.parse(savedCompliance) : initialState.compliance;
  
  // Set next audit date if not set
  if (!compliance.nextAudit) {
    const nextAudit = new Date();
    nextAudit.setMonth(nextAudit.getMonth() + 1); // Next month
    compliance.nextAudit = nextAudit.getTime();
  }
  
  return {
    ...initialState,
    config,
    compliance
  };
};

// Persist audit state
export const persistAuditState = (state) => {
  try {
    // Save configuration
    localStorage.setItem('mpesewa_audit_config', JSON.stringify(state.config));
    
    // Save compliance status
    localStorage.setItem('mpesewa_compliance_status', JSON.stringify(state.compliance));
    
    // Note: Audit logs are saved in the reducer to avoid performance issues
  } catch (error) {
    console.error('Error persisting audit state:', error);
  }
};

// Compliance check functions
export const ComplianceChecker = {
  // Check country isolation compliance
  checkCountryIsolation: (auditLogs) => {
    const violations = [];
    
    // Get all cross-country attempts
    const userCountries = {};
    auditLogs.forEach(log => {
      if (log.user.id !== 'anonymous' && log.location.country) {
        if (!userCountries[log.user.id]) {
          userCountries[log.user.id] = new Set();
        }
        userCountries[log.user.id].add(log.location.country);
      }
    });
    
    // Check for users operating in multiple countries
    Object.entries(userCountries).forEach(([userId, countries]) => {
      if (countries.size > 1) {
        violations.push({
          userId,
          countries: Array.from(countries),
          rule: 'NO_CROSS_COUNTRY_OPERATIONS',
          severity: 'HIGH'
        });
      }
    });
    
    return violations;
  },
  
  // Check group isolation for lenders
  checkGroupIsolation: (auditLogs) => {
    const violations = [];
    
    // Get lender group operations
    const lenderGroups = {};
    auditLogs
      .filter(log => log.user.role === 'lender' && log.location.group)
      .forEach(log => {
        if (!lenderGroups[log.user.id]) {
          lenderGroups[log.user.id] = new Set();
        }
        lenderGroups[log.user.id].add(log.location.group);
      });
    
    // Check for lenders operating in multiple groups
    Object.entries(lenderGroups).forEach(([lenderId, groups]) => {
      if (groups.size > 1) {
        violations.push({
          lenderId,
          groups: Array.from(groups),
          rule: 'LENDERS_CAN_ONLY_LEND_WITHIN_THEIR_GROUP',
          severity: 'HIGH'
        });
      }
    });
    
    return violations;
  },
  
  // Check borrower group limit
  checkBorrowerGroupLimit: (auditLogs) => {
    const violations = [];
    
    // Get borrower group memberships
    const borrowerGroups = {};
    auditLogs
      .filter(log => log.user.role === 'borrower' && log.location.group)
      .forEach(log => {
        if (!borrowerGroups[log.user.id]) {
          borrowerGroups[log.user.id] = new Set();
        }
        borrowerGroups[log.user.id].add(log.location.group);
      });
    
    // Check for borrowers in more than 4 groups
    Object.entries(borrowerGroups).forEach(([borrowerId, groups]) => {
      if (groups.size > 4) {
        violations.push({
          borrowerId,
          groupCount: groups.size,
          rule: 'BORROWERS_MAX_4_GROUPS',
          severity: 'MEDIUM'
        });
      }
    });
    
    return violations;
  },
  
  // Check subscription compliance
  checkSubscriptionCompliance: (auditLogs) => {
    const violations = [];
    
    // Get lender subscription status
    const lenderSubscriptions = {};
    auditLogs
      .filter(log => log.user.role === 'lender' && log.type.includes('SUBSCRIPTION'))
      .forEach(log => {
        lenderSubscriptions[log.user.id] = {
          lastSubscription: log.timestamp,
          type: log.type,
          expired: log.type.includes('EXPIRY') || log.type.includes('BLOCK')
        };
      });
    
    // Check for lenders operating without subscription
    auditLogs
      .filter(log => log.user.role === 'lender' && log.type.includes('LOAN'))
      .forEach(log => {
        const subscription = lenderSubscriptions[log.user.id];
        if (!subscription || subscription.expired) {
          violations.push({
            lenderId: log.user.id,
            loanId: log.data?.loanId,
            rule: 'LENDERS_REQUIRE_ACTIVE_SUBSCRIPTION',
            severity: 'HIGH'
          });
        }
      });
    
    return violations;
  },
  
  // Run all compliance checks
  runAllComplianceChecks: (store) => {
    const state = store.getState().audit;
    const violations = [
      ...ComplianceChecker.checkCountryIsolation(state.auditLogs),
      ...ComplianceChecker.checkGroupIsolation(state.auditLogs),
      ...ComplianceChecker.checkBorrowerGroupLimit(state.auditLogs),
      ...ComplianceChecker.checkSubscriptionCompliance(state.auditLogs)
    ];
    
    // Log compliance check
    violations.forEach(violation => {
      store.dispatch(logComplianceCheck({
        checkType: violation.rule,
        countryCode: violation.countries?.[0] || 'UNKNOWN',
        status: 'FAIL',
        findings: JSON.stringify(violation)
      }));
    });
    
    return violations;
  }
};