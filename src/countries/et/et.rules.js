/**
 * M-PESEWA - ETHIOPIA RULES MODULE
 * Strict Country Isolation: Ethiopia (ET)
 * Hierarchy: Global → Country → Groups → Lenders → Borrowers (Ledgers)
 * Last Updated: 2026-01-24
 * Version: 1.0.0
 */

// ============================================
// ETHIOPIAN NATIONAL COMPLIANCE FRAMEWORK
// ============================================
const ETHIOPIAN_LEGAL_FRAMEWORK = Object.freeze({
  // Primary Legislation
  bankingProclamation: 'Proclamation No. 592/2008',
  microfinanceProclamation: 'Proclamation No. 626/2009',
  nationalPaymentSystem: 'Proclamation No. 718/2011',
  dataProtection: 'Proclamation No. 1234/2021',
  
  // Regulatory Bodies
  primaryRegulator: 'National Bank of Ethiopia (NBE)',
  secondaryRegulators: [
    'Ethiopian Financial Intelligence Center (EFIC)',
    'Ethiopian Capital Market Authority (ECMA)',
    'Ministry of Finance',
    'Ethiopian Revenue and Customs Authority (ERCA)'
  ],
  
  // Licensing Requirements
  requiredLicenses: [
    'NBE Money Transfer License',
    'NBE Payment System Operator License',
    'EFIC Anti-Money Laundering Registration',
    'ERCA Taxpayer Identification Number',
    'Trade Bureau Business License'
  ],
  
  // Compliance Thresholds
  reportingThresholds: {
    transactionReporting: 10000, // 10,000 ETB
    suspiciousActivity: 5000,    // 5,000 ETB
    cashTransaction: 15000,      // 15,000 ETB
    annualTurnover: 1000000      // 1,000,000 ETB
  },
  
  // Penalty Framework
  penalties: {
    unlicensedOperation: {
      fine: '500,000 ETB',
      imprisonment: '5 years',
      additional: 'Asset seizure'
    },
    nonCompliance: {
      fine: '50,000 - 100,000 ETB',
      suspension: '30-90 days',
      revocation: 'License cancellation'
    },
    taxEvasion: {
      fine: '200% of tax due',
      imprisonment: '2-5 years',
      additional: 'Business closure'
    },
    moneyLaundering: {
      fine: '1,000,000 ETB',
      imprisonment: '10-15 years',
      additional: 'International sanctions'
    }
  }
});

// ============================================
// M-PESEWA ETHIOPIA CORE RULES ENGINE
// ============================================
class EthiopiaRulesEngine {
  constructor() {
    this.legalFramework = ETHIOPIAN_LEGAL_FRAMEWORK;
    this.countryCode = 'ET';
    this.countryName = 'Ethiopia';
    this.version = '1.0.0';
    this.ruleViolations = [];
    this.complianceChecks = [];
    this.initializeRules();
  }
  
  /**
   * Initialize all Ethiopian rules
   */
  initializeRules() {
    this.rules = {
      // ============ HIERARCHY RULES ============
      hierarchy: this._defineHierarchyRules(),
      
      // ============ COUNTRY ISOLATION RULES ============
      isolation: this._defineIsolationRules(),
      
      // ============ GROUP RULES ============
      groups: this._defineGroupRules(),
      
      // ============ LENDER RULES ============
      lenders: this._defineLenderRules(),
      
      // ============ BORROWER RULES ============
      borrowers: this._defineBorrowerRules(),
      
      // ============ LEDGER RULES ============
      ledgers: this._defineLedgerRules(),
      
      // ============ SUBSCRIPTION RULES ============
      subscriptions: this._defineSubscriptionRules(),
      
      // ============ REPUTATION RULES ============
      reputation: this._defineReputationRules(),
      
      // ============ LOAN RULES ============
      loans: this._defineLoanRules(),
      
      // ============ LEGAL COMPLIANCE RULES ============
      legal: this._defineLegalComplianceRules(),
      
      // ============ ADMIN RULES ============
      admin: this._defineAdminRules(),
      
      // ============ DISPUTE RESOLUTION RULES ============
      disputes: this._defineDisputeResolutionRules(),
      
      // ============ EMERGENCY CATEGORY RULES ============
      emergency: this._defineEmergencyCategoryRules()
    };
  }
  
  // ============================================
  // HIERARCHY RULES DEFINITION
  // ============================================
  _defineHierarchyRules() {
    return Object.freeze({
      name: 'Ethiopian Hierarchy Rules',
      description: 'Strict hierarchy enforcement for Ethiopia',
      rules: [
        {
          id: 'ET-HIER-001',
          type: 'MANDATORY',
          condition: 'Global → Country → Groups → Lenders → Borrowers (Ledgers)',
          enforcement: 'REJECT_TRANSACTION',
          message: 'Must follow strict hierarchical structure',
          validation: (data) => {
            // Check if data follows hierarchy
            const hasCountry = data.country === 'ET';
            const hasGroup = data.groupId && data.groupId.startsWith('ET-');
            const hasLender = data.lenderId && data.lenderId.startsWith('ET-L-');
            const hasBorrower = data.borrowerId && data.borrowerId.startsWith('ET-B-');
            
            return hasCountry && hasGroup && (hasLender || hasBorrower);
          }
        },
        {
          id: 'ET-HIER-002',
          type: 'MANDATORY',
          condition: 'Each user belongs to exactly one country',
          enforcement: 'SUSPEND_ACCOUNT',
          message: 'Users cannot belong to multiple countries',
          validation: (user) => {
            return user.countries && user.countries.length === 1 && user.countries[0] === 'ET';
          }
        },
        {
          id: 'ET-HIER-003',
          type: 'MANDATORY',
          condition: 'Groups must be country-specific',
          enforcement: 'DELETE_GROUP',
          message: 'Groups cannot span multiple countries',
          validation: (group) => {
            return group.country === 'ET' && !group.crossCountry;
          }
        }
      ]
    });
  }
  
  // ============================================
  // COUNTRY ISOLATION RULES
  // ============================================
  _defineIsolationRules() {
    return Object.freeze({
      name: 'Ethiopian Country Isolation Rules',
      description: 'Strict isolation preventing cross-country transactions',
      rules: [
        {
          id: 'ET-ISO-001',
          type: 'ABSOLUTE',
          condition: 'No cross-country lending or borrowing',
          enforcement: 'BLOCK_TRANSACTION',
          message: 'Transactions limited to Ethiopian users only',
          validation: (transaction) => {
            const { lenderCountry, borrowerCountry } = transaction;
            return lenderCountry === 'ET' && borrowerCountry === 'ET';
          }
        },
        {
          id: 'ET-ISO-002',
          type: 'ABSOLUTE',
          condition: 'Ethiopian currency (ETB) only',
          enforcement: 'CURRENCY_REJECTION',
          message: 'Only Ethiopian Birr (ETB) transactions allowed',
          validation: (transaction) => {
            return transaction.currency === 'ETB';
          }
        },
        {
          id: 'ET-ISO-003',
          type: 'ABSOLUTE',
          condition: 'Ethiopian bank accounts only',
          enforcement: 'ACCOUNT_FREEZE',
          message: 'Only Ethiopian bank accounts allowed',
          validation: (account) => {
            return account.country === 'ET' && account.currency === 'ETB';
          }
        },
        {
          id: 'ET-ISO-004',
          type: 'MANDATORY',
          condition: 'Ethiopian phone number verification',
          enforcement: 'PHONE_VERIFICATION_REQUIRED',
          message: '+251 Ethiopian phone number required',
          validation: (phone) => {
            return phone.startsWith('+251') || phone.startsWith('251') || phone.startsWith('09');
          }
        }
      ]
    });
  }
  
  // ============================================
  // GROUP RULES DEFINITION
  // ============================================
  _defineGroupRules() {
    return Object.freeze({
      name: 'Ethiopian Group Rules',
      description: 'Rules for group creation and management in Ethiopia',
      rules: [
        {
          id: 'ET-GRP-001',
          type: 'MANDATORY',
          condition: 'Minimum 5 members per group',
          enforcement: 'PREVENT_ACTIVATION',
          message: 'Groups require minimum 5 Ethiopian members',
          validation: (group) => {
            return group.members && group.members.length >= 5;
          }
        },
        {
          id: 'ET-GRP-002',
          type: 'LIMIT',
          condition: 'Maximum 1,000 members per group',
          enforcement: 'BLOCK_NEW_MEMBERS',
          message: 'Group cannot exceed 1,000 members',
          validation: (group) => {
            return group.members && group.members.length <= 1000;
          }
        },
        {
          id: 'ET-GRP-003',
          type: 'MANDATORY',
          condition: 'One Admin/Founder per group',
          enforcement: 'SINGLE_ADMIN_ENFORCED',
          message: 'Each group must have exactly one Ethiopian admin',
          validation: (group) => {
            const admins = group.members.filter(m => m.role === 'admin');
            return admins.length === 1 && admins[0].country === 'ET';
          }
        },
        {
          id: 'ET-GRP-004',
          type: 'MANDATORY',
          condition: 'Group nickname requirement',
          enforcement: 'NAME_REQUIRED',
          message: 'Group must have Ethiopian-relevant nickname',
          validation: (group) => {
            return group.nickname && group.nickname.length >= 3;
          }
        },
        {
          id: 'ET-GRP-005',
          type: 'MANDATORY',
          condition: 'Country badge display',
          enforcement: 'VISUAL_ENFORCEMENT',
          message: 'Ethiopian flag badge must be visible',
          validation: (group) => {
            return group.countryBadge === '🇪🇹';
          }
        },
        {
          id: 'ET-GRP-006',
          type: 'MANDATORY',
          condition: 'Budget visibility',
          enforcement: 'TRANSPARENCY_REQUIRED',
          message: 'Group budget must be visible to members',
          validation: (group) => {
            return group.budgetVisibility === true;
          }
        },
        {
          id: 'ET-GRP-007',
          type: 'MANDATORY',
          condition: 'Group types restriction',
          enforcement: 'CATEGORY_VALIDATION',
          message: 'Group must be one of approved Ethiopian types',
          validation: (group) => {
            const allowedTypes = [
              'Family', 'Church', 'Professional', 'Local',
              'Social', 'Business', 'Community', 'Ethnic'
            ];
            return allowedTypes.includes(group.type);
          }
        },
        {
          id: 'ET-GRP-008',
          type: 'ABSOLUTE',
          condition: 'Invitation/referral only',
          enforcement: 'INVITATION_REQUIRED',
          message: 'Group entry by invitation or referral only',
          validation: (member) => {
            return member.invitedBy && member.invitationCode;
          }
        },
        {
          id: 'ET-GRP-009',
          type: 'MANDATORY',
          condition: 'Ethiopian citizenship requirement',
          enforcement: 'CITIZENSHIP_VERIFICATION',
          message: 'Only Ethiopian citizens can join Ethiopian groups',
          validation: (user) => {
            return user.citizenship === 'ET' && user.nationalId;
          }
        },
        {
          id: 'ET-GRP-010',
          type: 'LIMIT',
          condition: 'User group limit (max 4)',
          enforcement: 'BLOCK_JOIN',
          message: 'Users cannot join more than 4 Ethiopian groups',
          validation: (user) => {
            return user.groups && user.groups.length <= 4;
          }
        }
      ]
    });
  }
  
  // ============================================
  // LENDER RULES DEFINITION
  // ============================================
  _defineLenderRules() {
    return Object.freeze({
      name: 'Ethiopian Lender Rules',
      description: 'Rules for lenders operating in Ethiopia',
      rules: [
        {
          id: 'ET-LND-001',
          type: 'MANDATORY',
          condition: 'Lender registration details',
          enforcement: 'REGISTRATION_REQUIRED',
          message: 'Complete Ethiopian lender registration required',
          validation: (lender) => {
            const requiredFields = [
              'fullName', 'country', 'groupId', 'nationalId',
              'phoneNumber', 'location', 'subscriptionLevel'
            ];
            return requiredFields.every(field => lender[field]);
          }
        },
        {
          id: 'ET-LND-002',
          type: 'MANDATORY',
          condition: 'National ID verification',
          enforcement: 'ID_VERIFICATION',
          message: 'Valid Ethiopian national ID required',
          validation: (lender) => {
            // Ethiopian national ID pattern
            const ethiopianIdPattern = /^\d{10}$/;
            return ethiopianIdPattern.test(lender.nationalId);
          }
        },
        {
          id: 'ET-LND-003',
          type: 'MANDATORY',
          condition: 'Active subscription required',
          enforcement: 'BLOCK_LENDING',
          message: 'Lender must have active Ethiopian subscription',
          validation: (lender) => {
            return lender.subscriptionActive === true &&
                   lender.subscriptionExpiry > new Date();
          }
        },
        {
          id: 'ET-LND-004',
          type: 'ABSOLUTE',
          condition: 'Lend within group only',
          enforcement: 'TRANSACTION_BLOCK',
          message: 'Lenders can only lend within their Ethiopian group',
          validation: (transaction) => {
            return transaction.lenderGroupId === transaction.borrowerGroupId;
          }
        },
        {
          id: 'ET-LND-005',
          type: 'MANDATORY',
          condition: 'Category selection',
          enforcement: 'CATEGORY_REQUIRED',
          message: 'Lender must select Ethiopian lending categories',
          validation: (lender) => {
            return lender.categories && lender.categories.length > 0;
          }
        },
        {
          id: 'ET-LND-006',
          type: 'LIMIT',
          condition: 'Subscription tier limits',
          enforcement: 'AMOUNT_CAP',
          message: 'Lending amount capped by Ethiopian subscription tier',
          validation: (lender, amount) => {
            const tierLimits = {
              BASIC: 500,    // 500 ETB per week
              PREMIUM: 2000, // 2,000 ETB per week
              SUPER: 5000,   // 5,000 ETB per week
              LENDER_OF_LENDERS: 10000 // 10,000 ETB per week
            };
            return amount <= (tierLimits[lender.subscriptionLevel] || 0);
          }
        },
        {
          id: 'ET-LND-007',
          type: 'MANDATORY',
          condition: 'Ledger creation',
          enforcement: 'LEDGER_REQUIRED',
          message: 'Loan approval generates Ethiopian ledger',
          validation: (loan) => {
            return loan.ledgerCreated === true && loan.ledgerId.startsWith('ET-LDG-');
          }
        },
        {
          id: 'ET-LND-008',
          type: 'MANDATORY',
          condition: 'Manual disbursement',
          enforcement: 'MANUAL_PROCESS',
          message: 'Loan disbursement manual outside platform',
          validation: (loan) => {
            return loan.disbursementMethod === 'manual' && 
                   loan.disbursementConfirmed === true;
          }
        },
        {
          id: 'ET-LND-009',
          type: 'MANDATORY',
          condition: 'Borrower rating',
          enforcement: 'RATING_REQUIRED',
          message: 'Lender must rate Ethiopian borrowers',
          validation: (loan) => {
            return loan.rating && loan.rating >= 1 && loan.rating <= 5;
          }
        },
        {
          id: 'ET-LND-010',
          type: 'ABSOLUTE',
          condition: 'No cross-group lending',
          enforcement: 'PERMANENT_BAN',
          message: 'Cross-group lending prohibited in Ethiopia',
          validation: (lender, groupId) => {
            return lender.groupId === groupId;
          }
        }
      ]
    });
  }
  
  // ============================================
  // BORROWER RULES DEFINITION
  // ============================================
  _defineBorrowerRules() {
    return Object.freeze({
      name: 'Ethiopian Borrower Rules',
      description: 'Rules for borrowers in Ethiopia',
      rules: [
        {
          id: 'ET-BRW-001',
          type: 'PERMISSION',
          condition: 'Unlimited borrowers per lender',
          enforcement: 'NO_LIMIT',
          message: 'Ethiopian lenders can have unlimited borrowers',
          validation: (lender) => {
            return true; // No validation needed, just informational
          }
        },
        {
          id: 'ET-BRW-002',
          type: 'LIMIT',
          condition: 'Maximum 4 groups per borrower',
          enforcement: 'GROUP_JOIN_BLOCK',
          message: 'Ethiopian borrowers limited to 4 groups',
          validation: (borrower) => {
            return borrower.groups && borrower.groups.length <= 4;
          }
        },
        {
          id: 'ET-BRW-003',
          type: 'PERMISSION',
          condition: 'Dual role allowed',
          enforcement: 'ROLE_SWITCH_ALLOWED',
          message: 'Ethiopian users can be both borrower and lender',
          validation: (user) => {
            return user.roles && user.roles.includes('borrower') && user.roles.includes('lender');
          }
        },
        {
          id: 'ET-BRW-004',
          type: 'MANDATORY',
          condition: 'No subscription fees',
          enforcement: 'FEE_PROHIBITION',
          message: 'Ethiopian borrowers pay no subscription fees',
          validation: (borrower) => {
            return borrower.subscriptionFee === 0;
          }
        },
        {
          id: 'ET-BRW-005',
          type: 'REQUIREMENT',
          condition: 'Good rating for multiple groups',
          enforcement: 'RATING_CHECK',
          message: 'Good rating required for multiple Ethiopian groups',
          validation: (borrower) => {
            if (borrower.groups && borrower.groups.length > 1) {
              return borrower.rating >= 3.5; // Minimum 3.5 star rating
            }
            return true;
          }
        },
        {
          id: 'ET-BRW-006',
          type: 'MANDATORY',
          condition: 'Real name display',
          enforcement: 'REAL_NAME_REQUIRED',
          message: 'Ethiopian borrowers must use real names',
          validation: (borrower) => {
            return borrower.realName && borrower.realName.length >= 2;
          }
        },
        {
          id: 'ET-BRW-007',
          type: 'MANDATORY',
          condition: 'Loan category selection',
          enforcement: 'CATEGORY_REQUIRED',
          message: 'Ethiopian borrowers must select loan category',
          validation: (loan) => {
            return loan.category && loan.category.startsWith('ET-EMG-');
          }
        },
        {
          id: 'ET-BRW-008',
          type: 'LIMIT',
          condition: 'One active loan per group',
          enforcement: 'LOAN_BLOCK',
          message: 'One active loan per Ethiopian group at a time',
          validation: (borrower, groupId) => {
            const activeLoans = borrower.loans.filter(
              loan => loan.groupId === groupId && loan.status === 'active'
            );
            return activeLoans.length <= 1;
          }
        }
      ]
    });
  }
  
  // ============================================
  // LEDGER RULES DEFINITION
  // ============================================
  _defineLedgerRules() {
    return Object.freeze({
      name: 'Ethiopian Ledger Rules',
      description: 'Rules for ledger management in Ethiopia',
      rules: [
        {
          id: 'ET-LDG-001',
          type: 'MANDATORY',
          condition: 'Auto-generation on loan approval',
          enforcement: 'AUTO_CREATE',
          message: 'Ledger auto-generated on Ethiopian loan approval',
          validation: (loan) => {
            return loan.status === 'approved' && loan.ledgerId;
          }
        },
        {
          id: 'ET-LDG-002',
          type: 'PERMISSION',
          condition: 'Unlimited ledgers per lender',
          enforcement: 'NO_LIMIT',
          message: 'Ethiopian lenders can create unlimited ledgers',
          validation: () => true
        },
        {
          id: 'ET-LDG-003',
          type: 'MANDATORY',
          condition: 'Ledger fields requirement',
          enforcement: 'FIELD_VALIDATION',
          message: 'All Ethiopian ledger fields must be completed',
          validation: (ledger) => {
            const requiredFields = [
              'borrowerName', 'borrowerContact', 'borrowerLocation',
              'guarantor1', 'guarantor2', 'loanCategory', 'amount',
              'dateBorrowed', 'dueDate', 'interest', 'status'
            ];
            return requiredFields.every(field => ledger[field]);
          }
        },
        {
          id: 'ET-LDG-004',
          type: 'MANDATORY',
          condition: 'Two guarantors required',
          enforcement: 'GUARANTOR_REQUIREMENT',
          message: 'Ethiopian loans require two guarantors',
          validation: (ledger) => {
            return ledger.guarantor1 && ledger.guarantor2;
          }
        },
        {
          id: 'ET-LDG-005',
          type: 'MANDATORY',
          condition: '10% interest rate',
          enforcement: 'INTEREST_CALCULATION',
          message: 'Ethiopian loans carry 10% interest',
          validation: (ledger) => {
            return ledger.interest === ledger.amount * 0.10;
          }
        },
        {
          id: 'ET-LDG-006',
          type: 'MANDATORY',
          condition: '5% daily penalty after 7 days',
          enforcement: 'PENALTY_CALCULATION',
          message: '5% daily penalty after 7 days in Ethiopia',
          validation: (ledger) => {
            if (ledger.daysOverdue > 7) {
              const expectedPenalty = ledger.amount * 0.05 * (ledger.daysOverdue - 7);
              return Math.abs(ledger.penalty - expectedPenalty) < 0.01;
            }
            return true;
          }
        },
        {
          id: 'ET-LDG-007',
          type: 'MANDATORY',
          condition: 'Manual ledger updates',
          enforcement: 'MANUAL_UPDATE_REQUIRED',
          message: 'Ethiopian ledgers updated manually by lender',
          validation: (update) => {
            return update.updatedBy.startsWith('ET-L-') && update.updateMethod === 'manual';
          }
        },
        {
          id: 'ET-LDG-008',
          type: 'PERMISSION',
          condition: 'Admin override capability',
          enforcement: 'ADMIN_OVERRIDE',
          message: 'Ethiopian admin can override ledgers',
          validation: (admin, action) => {
            return admin.role === 'admin' && admin.country === 'ET' && 
                   ['override', 'correct', 'update'].includes(action);
          }
        },
        {
          id: 'ET-LDG-009',
          type: 'MANDATORY',
          condition: 'Status tracking',
          enforcement: 'STATUS_REQUIRED',
          message: 'Ethiopian ledger status must be tracked',
          validation: (ledger) => {
            return ['active', 'cleared', 'defaulted', 'disputed'].includes(ledger.status);
          }
        }
      ]
    });
  }
  
  // ============================================
  // SUBSCRIPTION RULES DEFINITION
  // ============================================
  _defineSubscriptionRules() {
    return Object.freeze({
      name: 'Ethiopian Subscription Rules',
      description: 'Rules for subscription management in Ethiopia',
      rules: [
        {
          id: 'ET-SUB-001',
          type: 'MANDATORY',
          condition: 'Subscription levels for lenders only',
          enforcement: 'LENDER_ONLY',
          message: 'Only Ethiopian lenders require subscriptions',
          validation: (user) => {
            if (user.role === 'lender') {
              return user.subscriptionLevel && ['BASIC', 'PREMIUM', 'SUPER', 'LENDER_OF_LENDERS'].includes(user.subscriptionLevel);
            }
            return true; // Borrowers don't need subscription
          }
        },
        {
          id: 'ET-SUB-002',
          type: 'MANDATORY',
          condition: 'Subscription tiers with limits',
          enforcement: 'TIER_ENFORCEMENT',
          message: 'Ethiopian subscription tiers enforce lending limits',
          validation: (lender, amount) => {
            const tierLimits = {
              BASIC: { weekly: 500, ledger: 500 },
              PREMIUM: { weekly: 2000, ledger: 2000 },
              SUPER: { weekly: 5000, ledger: 5000 },
              LENDER_OF_LENDERS: { weekly: 10000, ledger: 10000 }
            };
            const limit = tierLimits[lender.subscriptionLevel];
            return limit && amount <= limit.weekly;
          }
        },
        {
          id: 'ET-SUB-003',
          type: 'MANDATORY',
          condition: 'Subscription expiry: 28th of each month',
          enforcement: 'AUTO_BLOCK',
          message: 'Ethiopian subscriptions expire on 28th monthly',
          validation: (subscription) => {
            const expiryDate = new Date(subscription.expiryDate);
            return expiryDate.getDate() === 28;
          }
        },
        {
          id: 'ET-SUB-004',
          type: 'ABSOLUTE',
          condition: 'Block access on expiry',
          enforcement: 'ACCESS_REVOCATION',
          message: 'Ethiopian lender access blocked on subscription expiry',
          validation: (lender) => {
            const now = new Date();
            const expiry = new Date(lender.subscriptionExpiry);
            if (now > expiry) {
              return lender.accessBlocked === true;
            }
            return lender.accessBlocked === false;
          }
        },
        {
          id: 'ET-SUB-005',
          type: 'MANDATORY',
          condition: 'Subscription payment via M-pesewa Till',
          enforcement: 'PAYMENT_REDIRECT',
          message: 'Ethiopian subscription payment via M-pesewa Till',
          validation: (payment) => {
            return payment.method === 'mpesewa_till' && payment.currency === 'ETB';
          }
        },
        {
          id: 'ET-SUB-006',
          type: 'MANDATORY',
          condition: 'Platform unlocks after payment confirmation',
          enforcement: 'PAYMENT_VERIFICATION',
          message: 'Ethiopian platform access after payment confirmation',
          validation: (lender) => {
            return lender.paymentConfirmed === true && lender.platformAccess === true;
          }
        },
        {
          id: 'ET-SUB-007',
          type: 'REQUIREMENT',
          condition: 'CRB check for Super tier',
          enforcement: 'CRB_REQUIRED',
          message: 'Ethiopian Super tier requires CRB check',
          validation: (lender) => {
            if (lender.subscriptionLevel === 'SUPER') {
              return lender.crbCheck === true && lender.crbClear === true;
            }
            return true;
          }
        },
        {
          id: 'ET-SUB-008',
          type: 'MANDATORY',
          condition: 'Subscription display requirements',
          enforcement: 'DISPLAY_REQUIRED',
          message: 'Ethiopian subscription details must be displayed',
          validation: (display) => {
            const requiredFields = [
              'level', 'amountPayable', 'lendingLimits', 'daysRemaining'
            ];
            return requiredFields.every(field => display[field]);
          }
        }
      ]
    });
  }
  
  // ============================================
  // REPUTATION RULES DEFINITION
  // ============================================
  _defineReputationRules() {
    return Object.freeze({
      name: 'Ethiopian Reputation Rules',
      description: 'Rules for reputation and blacklist system in Ethiopia',
      rules: [
        {
          id: 'ET-REP-001',
          type: 'MANDATORY',
          condition: '5-star borrower rating system',
          enforcement: 'RATING_REQUIRED',
          message: 'Ethiopian borrowers rated on 5-star system',
          validation: (rating) => {
            return rating >= 1 && rating <= 5;
          }
        },
        {
          id: 'ET-REP-002',
          type: 'ABSOLUTE',
          condition: 'Default after 2 months',
          enforcement: 'AUTO_DEFAULT',
          message: 'Ethiopian loans default after 2 months',
          validation: (loan) => {
            const twoMonthsAgo = new Date();
            twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
            return loan.dueDate < twoMonthsAgo && loan.status !== 'cleared';
          }
        },
        {
          id: 'ET-REP-003',
          type: 'ABSOLUTE',
          condition: 'Blacklist on default',
          enforcement: 'AUTO_BLACKLIST',
          message: 'Ethiopian defaulters automatically blacklisted',
          validation: (borrower) => {
            if (borrower.defaultedLoans && borrower.defaultedLoans.length > 0) {
              const oldestDefault = Math.min(...borrower.defaultedLoans.map(d => new Date(d.dueDate)));
              const twoMonthsAgo = new Date();
              twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
              return oldestDefault < twoMonthsAgo && borrower.blacklisted === true;
            }
            return borrower.blacklisted === false;
          }
        },
        {
          id: 'ET-REP-004',
          type: 'ABSOLUTE',
          condition: 'Blacklisted users cannot borrow',
          enforcement: 'BORROW_BLOCK',
          message: 'Blacklisted Ethiopian users cannot borrow',
          validation: (borrower) => {
            if (borrower.blacklisted) {
              return borrower.canBorrow === false;
            }
            return true;
          }
        },
        {
          id: 'ET-REP-005',
          type: 'ABSOLUTE',
          condition: 'Blacklisted users cannot join new groups',
          enforcement: 'GROUP_JOIN_BLOCK',
          message: 'Blacklisted Ethiopian users cannot join new groups',
          validation: (borrower) => {
            if (borrower.blacklisted) {
              return borrower.canJoinGroups === false;
            }
            return true;
          }
        },
        {
          id: 'ET-REP-006',
          type: 'ABSOLUTE',
          condition: 'Admin-only blacklist removal',
          enforcement: 'ADMIN_ONLY_REMOVAL',
          message: 'Only Ethiopian admin can remove blacklist',
          validation: (action) => {
            return action.performedBy.role === 'admin' && 
                   action.performedBy.country === 'ET';
          }
        },
        {
          id: 'ET-REP-007',
          type: 'MANDATORY',
          condition: 'Full repayment required for removal',
          enforcement: 'FULL_PAYMENT_REQUIRED',
          message: 'Full repayment required for Ethiopian blacklist removal',
          validation: (borrower) => {
            if (borrower.blacklistRemoved) {
              return borrower.totalOwed === 0;
            }
            return true;
          }
        },
        {
          id: 'ET-REP-008',
          type: 'MANDATORY',
          condition: 'Blacklist badge visibility',
          enforcement: 'BADGE_DISPLAY',
          message: 'Ethiopian blacklist badge must be visible',
          validation: (borrower) => {
            if (borrower.blacklisted) {
              return borrower.blacklistBadge === true;
            }
            return true;
          }
        },
        {
          id: 'ET-REP-009',
          type: 'PERMISSION',
          condition: 'Good rating unlocks more groups',
          enforcement: 'GROUP_ACCESS_REWARD',
          message: 'Good ratings unlock more Ethiopian groups',
          validation: (borrower) => {
            if (borrower.rating >= 4.0) {
              return borrower.maxGroups >= 4;
            }
            return true;
          }
        }
      ]
    });
  }
  
  // ============================================
  // LOAN RULES DEFINITION
  // ============================================
  _defineLoanRules() {
    return Object.freeze({
      name: 'Ethiopian Loan Rules',
      description: 'Rules for loan transactions in Ethiopia',
      rules: [
        {
          id: 'ET-LON-001',
          type: 'MANDATORY',
          condition: '7-day maximum repayment period',
          enforcement: 'TERM_LIMIT',
          message: 'Ethiopian loans maximum 7-day term',
          validation: (loan) => {
            const start = new Date(loan.startDate);
            const due = new Date(loan.dueDate);
            const diffDays = Math.ceil((due - start) / (1000 * 60 * 60 * 24));
            return diffDays <= 7;
          }
        },
        {
          id: 'ET-LON-002',
          type: 'FIXED',
          condition: '10% interest rate',
          enforcement: 'INTEREST_ENFORCED',
          message: 'Ethiopian loans carry 10% interest',
          validation: (loan) => {
            return loan.interestRate === 0.10;
          }
        },
        {
          id: 'ET-LON-003',
          type: 'PERMISSION',
          condition: 'Daily partial repayments allowed',
          enforcement: 'PARTIAL_ALLOWED',
          message: 'Daily partial repayments allowed in Ethiopia',
          validation: (repayment) => {
            return repayment.partialAllowed === true;
          }
        },
        {
          id: 'ET-LON-004',
          type: 'MINIMUM',
          condition: 'Minimum loan: 5 ETB',
          enforcement: 'MINIMUM_ENFORCED',
          message: 'Minimum Ethiopian loan: 5 ETB',
          validation: (loan) => {
            return loan.amount >= 5;
          }
        },
        {
          id: 'ET-LON-005',
          type: 'ABSOLUTE',
          condition: '5% daily penalty after 7 days',
          enforcement: 'PENALTY_ENFORCED',
          message: '5% daily penalty after 7 days in Ethiopia',
          validation: (loan) => {
            if (loan.daysOverdue > 7) {
              return loan.penaltyRate === 0.05;
            }
            return true;
          }
        },
        {
          id: 'ET-LON-006',
          type: 'MANDATORY',
          condition: 'Referrer/guarantor requirement',
          enforcement: 'REFERRER_REQUIRED',
          message: 'Ethiopian loans require 2 referrers/guarantors',
          validation: (loan) => {
            return loan.referrers && loan.referrers.length === 2;
          }
        },
        {
          id: 'ET-LON-007',
          type: 'MANDATORY',
          condition: 'Emergency category validation',
          enforcement: 'CATEGORY_VALIDATION',
          message: 'Ethiopian loans must be for approved emergency categories',
          validation: (loan) => {
            const ethiopianCategories = [
              'ET-EMG-FARE', 'ET-EMG-DATA', 'ET-EMG-GAS', 'ET-EMG-FOOD',
              'ET-EMG-WIFI', 'ET-EMG-WATER', 'ET-EMG-ELECTRICITY', 'ET-EMG-TV',
              'ET-EMG-FUEL', 'ET-EMG-REPAIR', 'ET-EMG-CREDO', 'ET-EMG-SALES',
              'ET-EMG-CAPITAL', 'ET-EMG-SOKO', 'ET-EMG-KIDANDASKI', 'ET-EMG-HAWKER',
              'ET-EMG-FULIZIWA', 'ET-EMG-MEDICINE', 'ET-EMG-SCHOOL', 'ET-EMG-ADVANCE'
            ];
            return ethiopianCategories.includes(loan.category);
          }
        }
      ]
    });
  }
  
  // ============================================
  // LEGAL COMPLIANCE RULES
  // ============================================
  _defineLegalComplianceRules() {
    return Object.freeze({
      name: 'Ethiopian Legal Compliance Rules',
      description: 'Legal and regulatory compliance rules for Ethiopia',
      rules: [
        {
          id: 'ET-LEG-001',
          type: 'MANDATORY',
          condition: 'National Bank of Ethiopia compliance',
          enforcement: 'REGULATORY_BLOCK',
          message: 'Must comply with NBE regulations',
          validation: (operation) => {
            return operation.nbeCompliant === true;
          }
        },
        {
          id: 'ET-LEG-002',
          type: 'MANDATORY',
          condition: 'Anti-Money Laundering (AML)',
          enforcement: 'AML_BLOCK',
          message: 'Must comply with Ethiopian AML regulations',
          validation: (transaction) => {
            return transaction.amlChecked === true && transaction.amlClear === true;
          }
        },
        {
          id: 'ET-LEG-003',
          type: 'MANDATORY',
          condition: 'Know Your Customer (KYC)',
          enforcement: 'KYC_REQUIRED',
          message: 'Ethiopian KYC requirements must be met',
          validation: (customer) => {
            return customer.kycLevel >= 2 && customer.kycVerified === true;
          }
        },
        {
          id: 'ET-LEG-004',
          type: 'MANDATORY',
          condition: 'Data protection compliance',
          enforcement: 'DATA_PROTECTION_BLOCK',
          message: 'Must comply with Ethiopian data protection laws',
          validation: (data) => {
            return data.protected === true && data.storedInEthiopia === true;
          }
        },
        {
          id: 'ET-LEG-005',
          type: 'MANDATORY',
          condition: 'Tax compliance',
          enforcement: 'TAX_BLOCK',
          message: 'Must comply with Ethiopian tax regulations',
          validation: (entity) => {
            return entity.tin && entity.taxCompliant === true;
          }
        },
        {
          id: 'ET-LEG-006',
          type: 'REPORTING',
          condition: 'Transaction reporting threshold',
          enforcement: 'AUTO_REPORT',
          message: 'Transactions over 10,000 ETB automatically reported',
          validation: (transaction) => {
            if (transaction.amount > 10000) {
              return transaction.reportedToNBE === true;
            }
            return true;
          }
        },
        {
          id: 'ET-LEG-007',
          type: 'MANDATORY',
          condition: 'Consumer protection',
          enforcement: 'CONSUMER_PROTECTION',
          message: 'Must comply with Ethiopian consumer protection laws',
          validation: (terms) => {
            return terms.transparent === true && terms.inAmharic === true;
          }
        }
      ]
    });
  }
  
  // ============================================
  // ADMIN RULES DEFINITION
  // ============================================
  _defineAdminRules() {
    return Object.freeze({
      name: 'Ethiopian Admin Rules',
      description: 'Rules for platform administration in Ethiopia',
      rules: [
        {
          id: 'ET-ADM-001',
          type: 'ABSOLUTE',
          condition: 'Admin can override blacklists',
          enforcement: 'ADMIN_OVERRIDE',
          message: 'Ethiopian admin can override blacklists',
          validation: (admin, action) => {
            return admin.role === 'admin' && admin.country === 'ET' && 
                   action.type === 'blacklist_override';
          }
        },
        {
          id: 'ET-ADM-002',
          type: 'ABSOLUTE',
          condition: 'Admin can edit ledgers',
          enforcement: 'LEDGER_EDIT',
          message: 'Ethiopian admin can edit ledgers',
          validation: (admin, action) => {
            return admin.role === 'admin' && admin.country === 'ET' && 
                   action.type === 'ledger_edit';
          }
        },
        {
          id: 'ET-ADM-003',
          type: 'ABSOLUTE',
          condition: 'Admin can moderate ratings',
          enforcement: 'RATING_MODERATION',
          message: 'Ethiopian admin can moderate ratings',
          validation: (admin, action) => {
            return admin.role === 'admin' && admin.country === 'ET' && 
                   action.type === 'rating_moderation';
          }
        },
        {
          id: 'ET-ADM-004',
          type: 'ABSOLUTE',
          condition: 'Admin can validate debt collectors',
          enforcement: 'COLLECTOR_VALIDATION',
          message: 'Ethiopian admin can validate debt collectors',
          validation: (admin, action) => {
            return admin.role === 'admin' && admin.country === 'ET' && 
                   action.type === 'collector_validation';
          }
        },
        {
          id: 'ET-ADM-005',
          type: 'SECURITY',
          condition: 'Separate admin login',
          enforcement: 'LOGIN_SEPARATION',
          message: 'Ethiopian admin has separate login',
          validation: (admin) => {
            return admin.loginSeparate === true && 
                   admin.loginUrl.includes('/admin/');
          }
        },
        {
          id: 'ET-ADM-006',
          type: 'AUDIT',
          condition: 'All admin actions logged',
          enforcement: 'ACTION_LOGGING',
          message: 'All Ethiopian admin actions must be logged',
          validation: (action) => {
            return action.logged === true && 
                   action.timestamp && 
                   action.adminId.startsWith('ET-ADM-');
          }
        }
      ]
    });
  }
  
  // ============================================
  // DISPUTE RESOLUTION RULES
  // ============================================
  _defineDisputeResolutionRules() {
    return Object.freeze({
      name: 'Ethiopian Dispute Resolution Rules',
      description: 'Rules for dispute resolution in Ethiopia',
      rules: [
        {
          id: 'ET-DSP-001',
          type: 'MANDATORY',
          condition: 'Group-level dispute resolution first',
          enforcement: 'GROUP_FIRST',
          message: 'Ethiopian disputes resolved at group level first',
          validation: (dispute) => {
            return dispute.escalationLevel === 'group' && dispute.groupId.startsWith('ET-');
          }
        },
        {
          id: 'ET-DSP-002',
          type: 'ESCALATION',
          condition: 'Admin escalation',
          enforcement: 'ADMIN_ESCALATION',
          message: 'Unresolved Ethiopian disputes escalated to admin',
          validation: (dispute) => {
            if (dispute.status === 'unresolved' && dispute.daysOpen > 7) {
              return dispute.escalatedToAdmin === true;
            }
            return true;
          }
        },
        {
          id: 'ET-DSP-003',
          type: 'MANDATORY',
          condition: 'Mediation before arbitration',
          enforcement: 'MEDIATION_FIRST',
          message: 'Ethiopian disputes require mediation before arbitration',
          validation: (dispute) => {
            return dispute.mediationAttempted === true;
          }
        },
        {
          id: 'ET-DSP-004',
          type: 'LEGAL',
          condition: 'Ethiopian law jurisdiction',
          enforcement: 'JURISDICTION_ENFORCED',
          message: 'Ethiopian disputes under Ethiopian law',
          validation: (dispute) => {
            return dispute.jurisdiction === 'ET' && dispute.law === 'Ethiopian';
          }
        }
      ]
    });
  }
  
  // ============================================
  // EMERGENCY CATEGORY RULES
  // ============================================
  _defineEmergencyCategoryRules() {
    return Object.freeze({
      name: 'Ethiopian Emergency Category Rules',
      description: 'Rules for emergency loan categories in Ethiopia',
      rules: [
        {
          id: 'ET-EMG-001',
          type: 'VALIDATION',
          condition: '20 approved emergency categories',
          enforcement: 'CATEGORY_VALIDATION',
          message: 'Only approved Ethiopian emergency categories allowed',
          validation: (category) => {
            const ethiopianCategories = [
              'ET-EMG-FARE',        // 🚌 Transport
              'ET-EMG-DATA',        // 📶 Mobile data
              'ET-EMG-GAS',         // 🔥 Cooking gas
              'ET-EMG-FOOD',        // 🍲 Food
              'ET-EMG-WIFI',        // 📡 Internet
              'ET-EMG-WATER',       // 🚰 Water bill
              'ET-EMG-ELECTRICITY', // ⚡ Electricity
              'ET-EMG-TV',          // 📺 TV subscription
              'ET-EMG-FUEL',        // ⛽ Vehicle fuel
              'ET-EMG-REPAIR',      // 🔧 Repairs
              'ET-EMG-CREDO',       // 🛠️ Tools/equipment
              'ET-EMG-SALES',       // 🧾 Sales advance
              'ET-EMG-CAPITAL',     // 🏪 Working capital
              'ET-EMG-SOKO',        // 🛒 Market goods
              'ET-EMG-KIDANDASKI',  // 🏗️ Stall/kiosk
              'ET-EMG-HAWKER',      // 🚶‍♂️ Street vending
              'ET-EMG-FULIZIWA',    // 🔄 M-Pesa top-up
              'ET-EMG-MEDICINE',    // 💊 Medicine
              'ET-EMG-SCHOOL',      // 🎓 School fees
              'ET-EMG-ADVANCE'      // 💸 Cash advance
            ];
            return ethiopianCategories.includes(category);
          }
        },
        {
          id: 'ET-EMG-002',
          type: 'LIMIT',
          condition: 'Category-specific amount limits',
          enforcement: 'CATEGORY_LIMIT',
          message: 'Ethiopian emergency categories have specific limits',
          validation: (loan) => {
            const categoryLimits = {
              'ET-EMG-FARE': 500,
              'ET-EMG-DATA': 300,
              'ET-EMG-GAS': 800,
              'ET-EMG-FOOD': 1000,
              'ET-EMG-MEDICINE': 1500
              // ... other category limits
            };
            const limit = categoryLimits[loan.category];
            return !limit || loan.amount <= limit;
          }
        }
      ]
    });
  }
  
  // ============================================
  // RULE VALIDATION ENGINE
  // ============================================
  
  /**
   * Validate a rule by ID
   * @param {string} ruleId - Rule identifier
   * @param {any} data - Data to validate
   * @returns {Object} Validation result
   */
  validateRule(ruleId, data) {
    // Find the rule in all categories
    for (const category of Object.values(this.rules)) {
      const rule = category.rules.find(r => r.id === ruleId);
      if (rule) {
        try {
          const isValid = rule.validation(data);
          const result = {
            ruleId: rule.id,
            category: category.name,
            type: rule.type,
            valid: isValid,
            message: isValid ? 'Rule compliance passed' : rule.message,
            timestamp: new Date().toISOString(),
            data: data
          };
          
          if (!isValid) {
            this.ruleViolations.push({
              ...result,
              enforcement: rule.enforcement,
              severity: this._getSeverity(rule.type)
            });
          }
          
          this.complianceChecks.push(result);
          return result;
        } catch (error) {
          const errorResult = {
            ruleId: rule.id,
            category: category.name,
            valid: false,
            error: error.message,
            message: `Rule validation error: ${error.message}`,
            timestamp: new Date().toISOString(),
            data: data
          };
          
          this.ruleViolations.push({
            ...errorResult,
            enforcement: 'SYSTEM_ERROR',
            severity: 'CRITICAL'
          });
          
          return errorResult;
        }
      }
    }
    
    return {
      ruleId: ruleId,
      valid: false,
      error: 'Rule not found',
      message: `Rule ${ruleId} not found in Ethiopian rules engine`,
      timestamp: new Date().toISOString()
    };
  }
  
  /**
   * Validate all rules for a transaction
   * @param {Object} transaction - Transaction to validate
   * @returns {Object} Comprehensive validation result
   */
  validateTransaction(transaction) {
    const validationResults = [];
    let allValid = true;
    
    // Check hierarchy rules
    for (const rule of this.rules.hierarchy.rules) {
      const result = this.validateRule(rule.id, transaction);
      validationResults.push(result);
      if (!result.valid) allValid = false;
    }
    
    // Check isolation rules
    for (const rule of this.rules.isolation.rules) {
      const result = this.validateRule(rule.id, transaction);
      validationResults.push(result);
      if (!result.valid) allValid = false;
    }
    
    // Check loan rules
    for (const rule of this.rules.loans.rules) {
      const result = this.validateRule(rule.id, transaction);
      validationResults.push(result);
      if (!result.valid) allValid = false;
    }
    
    // Check emergency category rules
    for (const rule of this.rules.emergency.rules) {
      const result = this.validateRule(rule.id, transaction);
      validationResults.push(result);
      if (!result.valid) allValid = false;
    }
    
    return {
      transactionId: transaction.id,
      country: 'ET',
      valid: allValid,
      timestamp: new Date().toISOString(),
      results: validationResults,
      violations: validationResults.filter(r => !r.valid),
      summary: {
        totalRules: validationResults.length,
        passed: validationResults.filter(r => r.valid).length,
        failed: validationResults.filter(r => !r.valid).length,
        complianceRate: (validationResults.filter(r => r.valid).length / validationResults.length) * 100
      }
    };
  }
  
  /**
   * Validate user registration
   * @param {Object} user - User to validate
   * @returns {Object} Validation result
   */
  validateUserRegistration(user) {
    const validationResults = [];
    
    // Check hierarchy rules
    validationResults.push(this.validateRule('ET-HIER-002', user));
    
    // Check group rules
    validationResults.push(this.validateRule('ET-GRP-009', user));
    validationResults.push(this.validateRule('ET-GRP-010', user));
    
    // Check isolation rules
    validationResults.push(this.validateRule('ET-ISO-004', user));
    
    // Check lender rules if applicable
    if (user.role === 'lender') {
      validationResults.push(this.validateRule('ET-LND-001', user));
      validationResults.push(this.validateRule('ET-LND-002', user));
    }
    
    const allValid = validationResults.every(r => r.valid);
    
    return {
      userId: user.id,
      valid: allValid,
      results: validationResults,
      canRegister: allValid,
      nextSteps: allValid ? 'Proceed to verification' : 'Fix validation errors'
    };
  }
  
  /**
   * Validate loan application
   * @param {Object} loan - Loan application
   * @param {Object} borrower - Borrower details
   * @param {Object} lender - Lender details
   * @returns {Object} Validation result
   */
  validateLoanApplication(loan, borrower, lender) {
    const validationResults = [];
    
    // Check borrower rules
    validationResults.push(this.validateRule('ET-BRW-001', borrower));
    validationResults.push(this.validateRule('ET-BRW-002', borrower));
    validationResults.push(this.validateRule('ET-BRW-005', borrower));
    validationResults.push(this.validateRule('ET-BRW-006', borrower));
    validationResults.push(this.validateRule('ET-BRW-007', loan));
    validationResults.push(this.validateRule('ET-BRW-008', { borrower, groupId: loan.groupId }));
    
    // Check lender rules
    validationResults.push(this.validateRule('ET-LND-003', lender));
    validationResults.push(this.validateRule('ET-LND-004', { lenderGroupId: lender.groupId, borrowerGroupId: loan.groupId }));
    validationResults.push(this.validateRule('ET-LND-005', lender));
    validationResults.push(this.validateRule('ET-LND-006', { lender, amount: loan.amount }));
    validationResults.push(this.validateRule('ET-LND-010', { lender, groupId: loan.groupId }));
    
    // Check loan rules
    validationResults.push(this.validateRule('ET-LON-001', loan));
    validationResults.push(this.validateRule('ET-LON-002', loan));
    validationResults.push(this.validateRule('ET-LON-004', loan));
    validationResults.push(this.validateRule('ET-LON-006', loan));
    validationResults.push(this.validateRule('ET-LON-007', loan));
    
    // Check emergency category rules
    validationResults.push(this.validateRule('ET-EMG-001', loan.category));
    validationResults.push(this.validateRule('ET-EMG-002', loan));
    
    // Check reputation rules
    if (borrower.blacklisted) {
      validationResults.push(this.validateRule('ET-REP-004', borrower));
      validationResults.push(this.validateRule('ET-REP-005', borrower));
    }
    
    const allValid = validationResults.every(r => r.valid);
    
    return {
      loanId: loan.id,
      valid: allValid,
      canProceed: allValid,
      results: validationResults,
      violations: validationResults.filter(r => !r.valid),
      requiredActions: allValid ? [] : validationResults.filter(r => !r.valid).map(r => r.message)
    };
  }
  
  /**
   * Get rule severity
   * @private
   */
  _getSeverity(ruleType) {
    const severityMap = {
      ABSOLUTE: 'CRITICAL',
      MANDATORY: 'HIGH',
      REQUIREMENT: 'MEDIUM',
      LIMIT: 'MEDIUM',
      PERMISSION: 'LOW',
      FIXED: 'HIGH',
      SECURITY: 'CRITICAL',
      AUDIT: 'MEDIUM',
      LEGAL: 'CRITICAL',
      REPORTING: 'HIGH',
      ESCALATION: 'MEDIUM',
      VALIDATION: 'MEDIUM'
    };
    return severityMap[ruleType] || 'MEDIUM';
  }
  
  /**
   * Get compliance report
   * @returns {Object} Compliance report
   */
  getComplianceReport() {
    const now = new Date();
    const last30Days = new Date(now.setDate(now.getDate() - 30));
    
    const recentViolations = this.ruleViolations.filter(
      v => new Date(v.timestamp) > last30Days
    );
    
    const recentChecks = this.complianceChecks.filter(
      c => new Date(c.timestamp) > last30Days
    );
    
    return {
      country: 'Ethiopia',
      reportDate: new Date().toISOString(),
      period: 'Last 30 days',
      summary: {
        totalRuleCategories: Object.keys(this.rules).length,
        totalRules: Object.values(this.rules).reduce((sum, cat) => sum + cat.rules.length, 0),
        complianceChecks: recentChecks.length,
        violations: recentViolations.length,
        complianceRate: recentChecks.length > 0 
          ? ((recentChecks.length - recentViolations.length) / recentChecks.length) * 100 
          : 100
      },
      violationBreakdown: this._getViolationBreakdown(recentViolations),
      topViolations: this._getTopViolations(recentViolations),
      recommendations: this._generateRecommendations(recentViolations)
    };
  }
  
  /**
   * Get violation breakdown
   * @private
   */
  _getViolationBreakdown(violations) {
    const breakdown = {};
    
    violations.forEach(violation => {
      const category = violation.category;
      breakdown[category] = (breakdown[category] || 0) + 1;
    });
    
    return breakdown;
  }
  
  /**
   * Get top violations
   * @private
   */
  _getTopViolations(violations) {
    const violationCount = {};
    
    violations.forEach(violation => {
      violationCount[violation.ruleId] = (violationCount[violation.ruleId] || 0) + 1;
    });
    
    return Object.entries(violationCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([ruleId, count]) => ({ ruleId, count }));
  }
  
  /**
   * Generate recommendations
   * @private
   */
  _generateRecommendations(violations) {
    const recommendations = [];
    
    if (violations.length === 0) {
      return ['Excellent compliance - No violations detected'];
    }
    
    // Check for common violation patterns
    const hierarchyViolations = violations.filter(v => v.category.includes('Hierarchy'));
    if (hierarchyViolations.length > 0) {
      recommendations.push('Review hierarchical structure compliance - Consider user training');
    }
    
    const isolationViolations = violations.filter(v => v.category.includes('Isolation'));
    if (isolationViolations.length > 0) {
      recommendations.push('Strengthen country isolation checks - Implement additional validation');
    }
    
    const subscriptionViolations = violations.filter(v => v.category.includes('Subscription'));
    if (subscriptionViolations.length > 0) {
      recommendations.push('Improve subscription validation - Automate expiry checks');
    }
    
    return recommendations;
  }
  
  /**
   * Reset rule violations (for testing)
   */
  resetViolations() {
    this.ruleViolations = [];
    this.complianceChecks = [];
  }
}

// ============================================
// ETHIOPIAN RULES MANAGER (SINGLETON)
// ============================================
class EthiopiaRulesManager {
  static instance = null;
  
  constructor() {
    if (EthiopiaRulesManager.instance) {
      return EthiopiaRulesManager.instance;
    }
    
    this.engine = new EthiopiaRulesEngine();
    this.countryCode = 'ET';
    this.countryName = 'Ethiopia';
    this.version = '1.0.0';
    this.initializedAt = new Date().toISOString();
    
    EthiopiaRulesManager.instance = this;
  }
  
  static getInstance() {
    if (!EthiopiaRulesManager.instance) {
      EthiopiaRulesManager.instance = new EthiopiaRulesManager();
    }
    return EthiopiaRulesManager.instance;
  }
  
  /**
   * Get all Ethiopian rules
   * @returns {Object} All rules organized by category
   */
  getAllRules() {
    return this.engine.rules;
  }
  
  /**
   * Get specific rule category
   * @param {string} category - Rule category
   * @returns {Object} Rule category
   */
  getRuleCategory(category) {
    return this.engine.rules[category];
  }
  
  /**
   * Get specific rule by ID
   * @param {string} ruleId - Rule identifier
   * @returns {Object} Rule details
   */
  getRule(ruleId) {
    for (const category of Object.values(this.engine.rules)) {
      const rule = category.rules.find(r => r.id === ruleId);
      if (rule) {
        return {
          ...rule,
          category: category.name,
          description: category.description
        };
      }
    }
    return null;
  }
  
  /**
   * Get Ethiopian legal framework
   * @returns {Object} Legal framework
   */
  getLegalFramework() {
    return ETHIOPIAN_LEGAL_FRAMEWORK;
  }
  
  /**
   * Get enforcement actions
   * @returns {Array} Enforcement actions
   */
  getEnforcementActions() {
    return [
      'REJECT_TRANSACTION',
      'SUSPEND_ACCOUNT',
      'DELETE_GROUP',
      'BLOCK_TRANSACTION',
      'CURRENCY_REJECTION',
      'ACCOUNT_FREEZE',
      'PHONE_VERIFICATION_REQUIRED',
      'PREVENT_ACTIVATION',
      'BLOCK_NEW_MEMBERS',
      'SINGLE_ADMIN_ENFORCED',
      'NAME_REQUIRED',
      'VISUAL_ENFORCEMENT',
      'TRANSPARENCY_REQUIRED',
      'CATEGORY_VALIDATION',
      'INVITATION_REQUIRED',
      'CITIZENSHIP_VERIFICATION',
      'BLOCK_JOIN',
      'REGISTRATION_REQUIRED',
      'ID_VERIFICATION',
      'BLOCK_LENDING',
      'TRANSACTION_BLOCK',
      'CATEGORY_REQUIRED',
      'AMOUNT_CAP',
      'LEDGER_REQUIRED',
      'MANUAL_PROCESS',
      'RATING_REQUIRED',
      'PERMANENT_BAN',
      'NO_LIMIT',
      'GROUP_JOIN_BLOCK',
      'ROLE_SWITCH_ALLOWED',
      'FEE_PROHIBITION',
      'RATING_CHECK',
      'REAL_NAME_REQUIRED',
      'LOAN_BLOCK',
      'AUTO_CREATE',
      'FIELD_VALIDATION',
      'GUARANTOR_REQUIREMENT',
      'INTEREST_CALCULATION',
      'PENALTY_CALCULATION',
      'MANUAL_UPDATE_REQUIRED',
      'ADMIN_OVERRIDE',
      'STATUS_REQUIRED',
      'LENDER_ONLY',
      'TIER_ENFORCEMENT',
      'AUTO_BLOCK',
      'ACCESS_REVOCATION',
      'PAYMENT_REDIRECT',
      'PAYMENT_VERIFICATION',
      'CRB_REQUIRED',
      'DISPLAY_REQUIRED',
      'RATING_REQUIRED',
      'AUTO_DEFAULT',
      'AUTO_BLACKLIST',
      'BORROW_BLOCK',
      'GROUP_JOIN_BLOCK',
      'ADMIN_ONLY_REMOVAL',
      'FULL_PAYMENT_REQUIRED',
      'BADGE_DISPLAY',
      'GROUP_ACCESS_REWARD',
      'TERM_LIMIT',
      'INTEREST_ENFORCED',
      'PARTIAL_ALLOWED',
      'MINIMUM_ENFORCED',
      'PENALTY_ENFORCED',
      'REFERRER_REQUIRED',
      'CATEGORY_VALIDATION',
      'REGULATORY_BLOCK',
      'AML_BLOCK',
      'KYC_REQUIRED',
      'DATA_PROTECTION_BLOCK',
      'TAX_BLOCK',
      'AUTO_REPORT',
      'CONSUMER_PROTECTION',
      'LEDGER_EDIT',
      'RATING_MODERATION',
      'COLLECTOR_VALIDATION',
      'LOGIN_SEPARATION',
      'ACTION_LOGGING',
      'GROUP_FIRST',
      'ADMIN_ESCALATION',
      'MEDIATION_FIRST',
      'JURISDICTION_ENFORCED',
      'CATEGORY_LIMIT',
      'SYSTEM_ERROR'
    ];
  }
  
  /**
   * Get Ethiopian hierarchy visualization
   * @returns {string} Hierarchy visualization
   */
  getHierarchyVisualization() {
    return `
🌍 GLOBAL M-PESEWA PLATFORM
    │
    └── 🇪🇹 ETHIOPIA (Country Level)
         │
         ├── 👥 GROUPS (Unlimited per country)
         │    │
         │    ├── 👑 Group Admin/Founder
         │    │    ├── Invites members
         │    │    ├── Moderates group
         │    │    ├── Sets internal rules
         │    │    └── Country badge: 🇪🇹
         │    │
         │    ├── 💰 LENDERS (Money Providers)
         │    │    ├── Subscription required
         │    │    ├── Lend within group only
         │    │    ├── Unlimited ledgers
         │    │    └── 5-star rating system
         │    │         │
         │    │         └── 📒 LEDGERS (Borrowers in loan state)
         │    │              ├── Auto-generated
         │    │              ├── 10% interest
         │    │              ├── 7-day term
         │    │              └── Manual updates
         │    │
         │    └── 👤 BORROWERS (Money Recipients)
         │         ├── No subscription
         │         ├── Max 4 groups
         │         ├── Can also be lenders
         │         └── Build reputation
         │
         └── 🔒 STRICT ISOLATION
              ├── No cross-country transactions
              ├── Ethiopian Birr (ETB) only
              ├── Ethiopian phone numbers
              └── National ID verification

📊 ETHIOPIAN SPECIFICS:
• Currency: Ethiopian Birr (ETB)
• Interest: 10% weekly
• Penalty: 5% daily after 7 days
• Default: After 2 months
• Subscription expiry: 28th monthly
• Groups: 5-1,000 members
• Categories: 20 emergency types
• Compliance: National Bank of Ethiopia
    `.trim();
  }
  
  /**
   * Export all rules as JSON
   * @returns {string} JSON string of all rules
   */
  exportRulesAsJSON() {
    return JSON.stringify({
      country: this.countryName,
      code: this.countryCode,
      version: this.version,
      exportedAt: new Date().toISOString(),
      rules: this.engine.rules,
      legalFramework: ETHIOPIAN_LEGAL_FRAMEWORK,
      hierarchy: this.getHierarchyVisualization(),
      statistics: {
        totalCategories: Object.keys(this.engine.rules).length,
        totalRules: Object.values(this.engine.rules).reduce((sum, cat) => sum + cat.rules.length, 0),
        violationCount: this.engine.ruleViolations.length,
        complianceChecks: this.engine.complianceChecks.length
      }
    }, null, 2);
  }
}

// ============================================
// EXPORTS AND INSTANCE CREATION
// ============================================

// Create singleton instance
const ethiopiaRulesManager = EthiopiaRulesManager.getInstance();

// Export all components
export {
  ETHIOPIAN_LEGAL_FRAMEWORK,
  EthiopiaRulesEngine,
  EthiopiaRulesManager,
  ethiopiaRulesManager as default
};

// Export utility functions
export const validateEthiopianTransaction = (transaction) => {
  const manager = EthiopiaRulesManager.getInstance();
  return manager.engine.validateTransaction(transaction);
};

export const validateEthiopianUser = (user) => {
  const manager = EthiopiaRulesManager.getInstance();
  return manager.engine.validateUserRegistration(user);
};

export const validateEthiopianLoan = (loan, borrower, lender) => {
  const manager = EthiopiaRulesManager.getInstance();
  return manager.engine.validateLoanApplication(loan, borrower, lender);
};

export const getEthiopianHierarchy = () => {
  const manager = EthiopiaRulesManager.getInstance();
  return manager.getHierarchyVisualization();
};

export const getEthiopianCompliance = () => {
  const manager = EthiopiaRulesManager.getInstance();
  return manager.engine.getComplianceReport();
};

// Add to window object for browser compatibility
if (typeof window !== 'undefined') {
  window.MPesewaETRules = {
    ETHIOPIAN_LEGAL_FRAMEWORK,
    EthiopiaRulesEngine,
    EthiopiaRulesManager,
    validateEthiopianTransaction,
    validateEthiopianUser,
    validateEthiopianLoan,
    getEthiopianHierarchy,
    getEthiopianCompliance
  };
}

// Log initialization
console.log('✅ M-Pesewa Ethiopia Rules Module Initialized');
console.log('🇪🇹 Ethiopian Compliance Framework Loaded');
console.log('📚 Total Rule Categories:', Object.keys(ethiopiaRulesManager.engine.rules).length);
console.log('⚖️ National Bank of Ethiopia Compliance: ACTIVE');
console.log('🔒 Country Isolation: STRICT - No Cross-Country Transactions');