/**
 * 🇸🇴 SOMALIA RULES MODULE
 * 
 * STRICT BUSINESS RULES FOR SOMALIA OPERATIONS:
 * - Hierarchy enforcement
 * - Country isolation
 * - Subscription requirements
 * - Loan terms and penalties
 * - Blacklist and reputation system
 */

const SomaliaRules = {
    // ============================================
    // 1️⃣ HIERARCHY RULES (STRICT ENFORCEMENT)
    // ============================================
    hierarchy: {
        // Level 1: Global
        global: {
            rules: [
                'M-Pesewa operates in multiple countries',
                'Global platform standards apply',
                'Cross-country data separation enforced'
            ],
            restrictions: [
                'No cross-country user data sharing',
                'No cross-country transactions',
                'Separate legal entities per country'
            ]
        },

        // Level 2: Somalia Country
        somalia: {
            rules: [
                'Operations confined within Somalia borders',
                'Somali Shillings (SOS) only',
                'Compliance with Central Bank of Somalia',
                'Somali law governs all operations'
            ],
            restrictions: [
                'No foreign currency transactions',
                'No cross-border lending/borrowing',
                'Users must be Somalia residents',
                'Data stored within Somalia'
            ],
            requirements: [
                'Somali National ID verification',
                'Somalia phone number (+252)',
                'Proof of Somalia residence',
                'Acceptance of Somalia terms'
            ]
        },

        // Level 3: Groups
        groups: {
            rules: [
                'Minimum 5 members, maximum 1000 members',
                'Groups are invitation-only',
                'One admin/founder per group',
                'Groups define own internal rules'
            ],
            restrictions: [
                'No cross-group lending (lenders lend within their group only)',
                'Group membership requires referral',
                'Maximum 4 groups per borrower (with good rating)',
                'No automatic role switching'
            ],
            requirements: [
                'Group admin must verify first 5 members',
                'Members must belong to same country (Somalia)',
                'Group must have at least 1 lender'
            ]
        },

        // Level 4: Lenders
        lenders: {
            rules: [
                'Lenders must have active subscription',
                'Subscription expires 28th of each month',
                'Lenders can create unlimited ledgers',
                'Lenders rate borrowers (1-5 stars)'
            ],
            restrictions: [
                'Cannot lend outside their group',
                'Cannot lend above subscription tier limit',
                'Blocked when subscription expires',
                'Cannot lend to blacklisted borrowers'
            ],
            requirements: [
                'Subscription payment before lending',
                'Must select loan categories to support',
                'Must update ledgers manually',
                'Must maintain borrower ratings'
            ]
        },

        // Level 5: Borrowers
        borrowers: {
            rules: [
                'Borrowers pay no subscription fees',
                'Can join up to 4 groups (with good rating)',
                'Can also be lenders (dual role)',
                '7-day repayment period'
            ],
            restrictions: [
                'One active loan per group at a time',
                'Cannot borrow if blacklisted',
                'Cannot join new groups if blacklisted',
                'Limited by lender subscription tiers'
            ],
            requirements: [
                'Must provide 2 guarantors/referrers',
                'Must maintain minimum 3.0 rating',
                'Must repay within 7 days (10% interest)',
                'Must use loan for specified emergency category'
            ]
        },

        // Level 6: Ledgers
        ledgers: {
            rules: [
                'Auto-generated on loan approval',
                'One ledger per borrower per lender',
                'Unlimited ledgers per lender',
                'Manual updates by lender'
            ],
            restrictions: [
                'Cannot be deleted, only cleared',
                'Cannot be transferred between lenders',
                'Cannot be merged'
            ],
            requirements: [
                'Must include borrower details',
                'Must include 2 guarantor contacts',
                'Must track interest (10%) and penalties (5% daily after 7 days)',
                'Must have status (Active/Cleared)'
            ]
        }
    },

    // ============================================
    // 2️⃣ SUBSCRIPTION RULES (LENDERS ONLY)
    // ============================================
    subscriptions: {
        // Tier Definitions
        tiers: {
            basic: {
                weeklyLimit: 1500,
                monthlyCost: 50,
                biAnnualCost: 250,
                annualCost: 500,
                features: [
                    'Lend up to 1,500 SOS per week',
                    'Unlimited ledgers',
                    'Basic borrower ratings',
                    'Group lending only'
                ],
                restrictions: [
                    'No CRB checks',
                    'Cannot lend above 1,500 SOS',
                    'Ledgers cannot exceed 1,500 SOS'
                ],
                requirements: [
                    'No credit check required',
                    'Basic verification only'
                ]
            },

            premium: {
                weeklyLimit: 5000,
                monthlyCost: 250,
                biAnnualCost: 1500,
                annualCost: 2500,
                features: [
                    'Lend up to 5,000 SOS per week',
                    'Advanced portfolio analytics',
                    'Priority borrower matching',
                    'Extended ledger history'
                ],
                restrictions: [
                    'No CRB checks',
                    'Ledgers cannot exceed 10,000 SOS'
                ],
                requirements: [
                    'Enhanced verification',
                    'Income proof optional'
                ]
            },

            super: {
                weeklyLimit: 20000,
                monthlyCost: 1000,
                biAnnualCost: 5000,
                annualCost: 8500,
                features: [
                    'Lend up to 20,000 SOS per week',
                    'CRB check access',
                    'Advanced risk analytics',
                    'Priority support'
                ],
                restrictions: [
                    'CRB check mandatory',
                    'Ledgers cannot exceed 20,000 SOS',
                    'Enhanced KYC required'
                ],
                requirements: [
                    'Full credit check',
                    'Income proof required',
                    'Enhanced due diligence'
                ]
            },

            lenderOfLenders: {
                weeklyLimit: 50000,
                monthlyCost: 500,
                biAnnualCost: 3500,
                annualCost: 6500,
                features: [
                    'Lend up to 50,000 SOS',
                    'Custom interest rates',
                    'Extended repayment periods (min 1 month)',
                    'Wholesale lending tools'
                ],
                restrictions: [
                    'CRB check mandatory',
                    'Minimum 1-month repayment period',
                    'Enhanced due diligence'
                ],
                requirements: [
                    'Full credit check',
                    'Business registration proof',
                    'Enhanced KYC'
                ]
            }
        },

        // Enforcement Rules
        enforcement: {
            expiry: {
                day: 28, // 28th of each month
                gracePeriod: 0, // No grace period
                actions: {
                    beforeExpiry: ['reminder_7_days', 'reminder_3_days', 'reminder_1_day'],
                    onExpiry: ['lending_blocked', 'platform_access_restricted'],
                    afterExpiry: ['account_suspended', 'data_retained_7_years']
                }
            },

            payment: {
                methods: ['EVC Plus', 'Sahal', 'Bank Transfer', 'Cash'],
                verification: 'instant',
                refunds: 'none',
                receipts: 'auto_generated'
            },

            upgrades: {
                immediate: true,
                prorated: false,
                downgrades: 'end_of_billing_cycle'
            }
        }
    },

    // ============================================
    // 3️⃣ LOAN RULES (STRICT TERMS)
    // ============================================
    loans: {
        // General Rules
        general: {
            repaymentPeriod: 7, // Days
            interestRate: 0.10, // 10%
            minLoanAmount: 100, // SOS
            maxLoanAmount: 50000, // SOS (based on tier)
            partialRepayments: true,
            maxActiveLoans: 1,
            coolingPeriod: 0 // Can borrow immediately after repayment
        },

        // Application Rules
        application: {
            requirements: [
                'Must be group member',
                'Must have minimum 3.0 rating',
                'Must specify emergency category',
                'Must have 2 guarantors',
                'Must not be blacklisted'
            ],
            process: [
                'Select group',
                'Choose lender (or post to group)',
                'Specify category and amount',
                'Provide guarantor details',
                'Accept terms'
            ],
            approval: {
                manual: true,
                timeLimit: '24 hours',
                disbursement: 'outside_platform'
            }
        },

        // Repayment Rules
        repayment: {
            schedule: '7 days from disbursement',
            methods: ['EVC Plus', 'Sahal', 'Cash', 'Bank Transfer'],
            partial: {
                allowed: true,
                minimum: 100, // SOS
                frequency: 'daily'
            },
            tracking: {
                lenderResponsibility: true,
                manualUpdates: true,
                receipts: 'optional'
            }
        },

        // Penalty Rules
        penalties: {
            gracePeriod: 7, // Days
            dailyRate: 0.05, // 5%
            calculation: 'on_outstanding_balance',
            maximum: 'none', // No maximum penalty
            application: 'automatic_after_7_days'
        },

        // Default Rules
        defaults: {
            definition: '60_days_overdue',
            consequences: [
                'automatic_blacklisting',
                'platform_wide_badge',
                'cannot_borrow',
                'cannot_join_new_groups',
                'debt_collection_initiated'
            ],
            removal: [
                'full_repayment_required',
                'admin_approval_required',
                '30_day_waiting_period'
            ]
        }
    },

    // ============================================
    // 4️⃣ REPUTATION & BLACKLIST SYSTEM
    // ============================================
    reputation: {
        // Rating System
        ratings: {
            scale: 5,
            criteria: [
                'repayment_punctuality',
                'communication',
                'loan_purpose_honesty',
                'group_participation'
            ],
            calculation: 'average_of_last_10_ratings',
            minimum: {
                forBorrowing: 3.0,
                forNewGroups: 3.5,
                forPremiumAccess: 4.0
            },
            impact: {
                highRating: ['more_groups_access', 'higher_loan_limits', 'faster_approval'],
                lowRating: ['limited_access', 'higher_scrutiny', 'cooldown_periods']
            }
        },

        // Blacklist System
        blacklist: {
            triggers: [
                '60_days_overdue',
                'fraudulent_activity',
                'multiple_defaults',
                'platform_abuse'
            ],
            process: {
                automatic: true,
                notification: 'immediate',
                appeal: 'allowed_within_30_days'
            },
            effects: [
                'cannot_borrow',
                'cannot_join_new_groups',
                'public_badge',
                'debt_collection',
                'credit_reporting'
            ],
            removal: {
                conditions: [
                    'full_repayment',
                    'admin_approval',
                    'waiting_period_30_days'
                ],
                process: 'manual_by_admin_only'
            }
        },

        // Defaulters Registry
        defaultersRegistry: {
            public: true,
            information: [
                'name',
                'amount_owed',
                'days_overdue',
                'group'
            ],
            retention: '7_years',
            removal: 'upon_full_repayment'
        }
    },

    // ============================================
    // 5️⃣ GROUP MANAGEMENT RULES
    // ============================================
    groups: {
        // Creation Rules
        creation: {
            requirements: [
                'must_be_somalia_resident',
                'must_invite_5_members',
                'must_define_group_type',
                'must_set_internal_rules'
            ],
            process: [
                'name_group',
                'select_type',
                'invite_members',
                'set_rules',
                'approve_members'
            ],
            limits: {
                groupsPerUser: 'unlimited',
                membersPerGroup: '5_to_1000',
                adminsPerGroup: 1
            }
        },

        // Membership Rules
        membership: {
            joining: [
                'invitation_only',
                'referral_required',
                'admin_approval'
            ],
            leaving: [
                'voluntary_allowed',
                'admin_removal_allowed',
                'automatic_on_blacklist'
            ],
            switching: [
                'maximum_4_groups_for_borrowers',
                'good_rating_required',
                'referral_required_for_new_group'
            ]
        },

        // Internal Rules
        internal: {
            allowed: [
                'set_meeting_schedules',
                'define_contribution_rules',
                'set_loan_approval_process',
                'define_dispute_resolution'
            ],
            prohibited: [
                'discrimination',
                'harassment',
                'illegal_activities',
                'platform_rules_violation'
            ]
        }
    },

    // ============================================
    // 6️⃣ DISPUTE RESOLUTION RULES
    // ============================================
    disputes: {
        // Types of Disputes
        types: [
            'loan_terms_disagreement',
            'repayment_amount_dispute',
            'borrower_rating_dispute',
            'group_membership_issue',
            'platform_technical_issue'
        ],

        // Resolution Process
        process: {
            step1: {
                name: 'Direct Negotiation',
                parties: ['lender', 'borrower'],
                timeframe: '3_days',
                outcome: 'mutual_agreement'
            },
            step2: {
                name: 'Group Mediation',
                mediator: 'group_admin',
                timeframe: '5_days',
                outcome: 'group_decision'
            },
            step3: {
                name: 'Platform Mediation',
                mediator: 'somalia_support_team',
                timeframe: '7_days',
                outcome: 'platform_recommendation'
            },
            step4: {
                name: 'Formal Resolution',
                options: ['arbitration', 'legal_action'],
                timeframe: '30_days',
                governingLaw: 'somali_law'
            }
        },

        // Arbitration Rules
        arbitration: {
            available: true,
            cost: 'shared_between_parties',
            binding: true,
            venue: 'somali_chamber_of_commerce'
        }
    },

    // ============================================
    // 7️⃣ ADMINISTRATIVE RULES
    // ============================================
    administration: {
        // Platform Admin Powers
        platformAdmin: {
            powers: [
                'override_blacklists',
                'edit_ledgers',
                'moderate_ratings',
                'validate_debt_collectors',
                'freeze_accounts',
                'view_all_data'
            ],
            limitations: [
                'cannot_modify_financial_records_without_audit_trail',
                'cannot_access_user_funds',
                'cannot_override_somali_law'
            ],
            accountability: [
                'audit_logs',
                'dual_control_for_critical_actions',
                'regular_reviews'
            ]
        },

        // Group Admin Powers
        groupAdmin: {
            powers: [
                'invite_members',
                'remove_members',
                'moderate_loans',
                'resolve_disputes',
                'set_group_rules'
            ],
            limitations: [
                'cannot_override_platform_rules',
                'cannot_charge_fees',
                'cannot_force_loan_approvals'
            ]
        },

        // Debt Collectors
        debtCollectors: {
            registration: [
                'must_be_vetted_by_platform',
                'must_have_somalia_license',
                'must_agree_to_code_of_conduct'
            ],
            rules: [
                'no_harassment',
                'no_illegal_practices',
                'transparent_fees',
                'platform_notification_required'
            ]
        }
    },

    // ============================================
    // 8️⃣ COMPLIANCE & LEGAL RULES
    // ============================================
    compliance: {
        // Regulatory Compliance
        regulatory: {
            centralBank: {
                license: 'CBS/FI/2023/MP-0456',
                reporting: 'monthly',
                inspections: 'annual'
            },
            amlCft: {
                requirements: 'Somalia_AML_Act_2016',
                monitoring: 'real_time',
                reporting: 'suspicious_activity_reports'
            },
            dataProtection: {
                law: 'Data_Protection_Guidelines_2020',
                storage: 'somalia_only',
                retention: '7_years'
            }
        },

        // Tax Compliance
        tax: {
            withholding: {
                rate: 0.05, // 5%
                threshold: 100000, // SOS annually
                filing: 'monthly'
            },
            reporting: {
                lenderEarnings: 'annual_statement',
                platformEarnings: 'audited_financials'
            }
        },

        // User Protection
        userProtection: {
            transparency: [
                'clear_terms',
                'no_hidden_fees',
                'full_disclosure'
            ],
            fairness: [
                'no_predatory_lending',
                'fair_collection_practices',
                'accessible_complaints_process'
            ],
            privacy: [
                'data_minimization',
                'purpose_limitation',
                'user_consent_required'
            ]
        }
    },

    // ============================================
    // 9️⃣ RULE ENFORCEMENT FUNCTIONS
    // ============================================
    enforcement: {
        /**
         * Check if user can borrow
         * @param {Object} user - User object
         * @param {Object} context - Context (group, etc.)
         * @returns {Object} Validation result
         */
        canBorrow: (user, context) => {
            const errors = [];
            const warnings = [];
            
            // Check if user is a borrower
            if (user.role !== 'borrower') {
                errors.push('User must be registered as borrower');
            }
            
            // Check if user is blacklisted
            if (user.blacklisted) {
                errors.push('User is blacklisted and cannot borrow');
            }
            
            // Check rating
            if (user.rating < 3.0) {
                errors.push('Minimum rating of 3.0 required to borrow');
            }
            
            // Check active loans in group
            if (context.activeLoansInGroup >= 1) {
                errors.push('Maximum one active loan per group');
            }
            
            // Check group membership
            if (!context.isGroupMember) {
                errors.push('User must be member of the group');
            }
            
            // Check if user has reached group limit
            if (user.groups && user.groups.length >= 4) {
                warnings.push('User is in maximum 4 groups');
            }
            
            return {
                canBorrow: errors.length === 0,
                errors,
                warnings
            };
        },

        /**
         * Check if user can lend
         * @param {Object} user - User object
         * @param {number} amount - Lending amount
         * @returns {Object} Validation result
         */
        canLend: (user, amount) => {
            const errors = [];
            
            // Check if user is a lender
            if (user.role !== 'lender') {
                errors.push('User must be registered as lender');
            }
            
            // Check subscription status
            if (!user.subscription || user.subscription.status !== 'active') {
                errors.push('Active subscription required to lend');
            }
            
            // Check if subscription has expired
            if (user.subscription && new Date(user.subscription.expiry) < new Date()) {
                errors.push('Subscription has expired');
            }
            
            // Check tier limits
            if (user.subscription) {
                const tier = SomaliaRules.subscriptions.tiers[user.subscription.tier];
                if (tier && amount > tier.weeklyLimit) {
                    errors.push(`Amount exceeds weekly limit for ${user.subscription.tier} tier`);
                }
            }
            
            // Check if 28th of month (expiry day)
            const today = new Date();
            if (today.getDate() === 28) {
                warnings.push('Subscription expires today - renew to continue lending');
            }
            
            return {
                canLend: errors.length === 0,
                errors,
                warnings
            };
        },

        /**
         * Check if user can join group
         * @param {Object} user - User object
         * @param {Object} group - Group object
         * @returns {Object} Validation result
         */
        canJoinGroup: (user, group) => {
            const errors = [];
            
            // Check if user is already in group
            if (user.groups && user.groups.includes(group.id)) {
                errors.push('User already in group');
            }
            
            // Check if user is blacklisted
            if (user.blacklisted) {
                errors.push('Blacklisted users cannot join new groups');
            }
            
            // Check group size
            if (group.memberCount >= 1000) {
                errors.push('Group has reached maximum members (1000)');
            }
            
            // Check user's group count (for borrowers)
            if (user.role === 'borrower' && user.groups && user.groups.length >= 4) {
                errors.push('Borrowers can join maximum 4 groups');
            }
            
            // Check rating requirement
            if (user.role === 'borrower' && user.rating < 3.0 && user.groups.length >= 1) {
                errors.push('Minimum 3.0 rating required to join additional groups');
            }
            
            return {
                canJoin: errors.length === 0,
                errors
            };
        },

        /**
         * Calculate penalties for overdue loan
         * @param {Object} loan - Loan object
         * @param {Date} currentDate - Current date
         * @returns {Object} Penalty calculation
         */
        calculatePenalties: (loan, currentDate = new Date()) => {
            const dueDate = new Date(loan.dueDate);
            const overdueDays = Math.max(0, Math.floor((currentDate - dueDate) / (1000 * 60 * 60 * 24)));
            
            let penalty = 0;
            let penaltyDays = 0;
            
            if (overdueDays > 7) {
                penaltyDays = overdueDays - 7;
                penalty = loan.principal * 0.05 * penaltyDays;
            }
            
            const total = loan.principal + loan.interest + penalty;
            
            return {
                overdueDays,
                penaltyDays,
                dailyPenaltyRate: 0.05,
                penaltyAmount: penalty,
                totalOwed: total,
                isDefaulted: overdueDays >= 60
            };
        }
    },

    // ============================================
    // 🔟 RULE VALIDATION & TESTING
    // ============================================
    validation: {
        /**
         * Validate all rules are correctly defined
         * @returns {Object} Validation results
         */
        validateAllRules: () => {
            const errors = [];
            const warnings = [];
            
            // Check hierarchy levels
            const expectedLevels = ['global', 'somalia', 'groups', 'lenders', 'borrowers', 'ledgers'];
            const actualLevels = Object.keys(SomaliaRules.hierarchy);
            
            expectedLevels.forEach(level => {
                if (!actualLevels.includes(level)) {
                    errors.push(`Missing hierarchy level: ${level}`);
                }
            });
            
            // Check subscription tiers
            const expectedTiers = ['basic', 'premium', 'super', 'lenderOfLenders'];
            const actualTiers = Object.keys(SomaliaRules.subscriptions.tiers);
            
            expectedTiers.forEach(tier => {
                if (!actualTiers.includes(tier)) {
                    errors.push(`Missing subscription tier: ${tier}`);
                }
            });
            
            // Check loan rules
            if (SomaliaRules.loans.general.interestRate !== 0.10) {
                errors.push('Interest rate must be 10%');
            }
            
            if (SomaliaRules.loans.penalties.dailyRate !== 0.05) {
                errors.push('Penalty rate must be 5% daily');
            }
            
            if (SomaliaRules.loans.general.repaymentPeriod !== 7) {
                errors.push('Repayment period must be 7 days');
            }
            
            // Check subscription expiry day
            if (SomaliaRules.subscriptions.enforcement.expiry.day !== 28) {
                errors.push('Subscription expiry must be 28th of month');
            }
            
            // Check borrower group limit
            const borrowerHierarchy = SomaliaRules.hierarchy.borrowers;
            if (!borrowerHierarchy.rules.includes('Can join up to 4 groups (with good rating)')) {
                warnings.push('Borrower group limit rule may be missing');
            }
            
            return {
                valid: errors.length === 0,
                errors,
                warnings
            };
        }
    }
};

// ============================================
// RULES ENGINE IMPLEMENTATION
// ============================================
class SomaliaRulesEngine {
    constructor() {
        this.rules = SomaliaRules;
        this.country = 'SO';
        this.currency = 'SOS';
    }

    /**
     * Evaluate borrowing request
     * @param {Object} request - Borrowing request
     * @returns {Object} Evaluation result
     */
    evaluateBorrowingRequest(request) {
        const { user, loanAmount, group, category } = request;
        
        const result = {
            approved: false,
            conditions: [],
            violations: [],
            warnings: []
        };
        
        // 1. Check user eligibility
        const userCheck = this.rules.enforcement.canBorrow(user, {
            activeLoansInGroup: group.activeLoans || 0,
            isGroupMember: group.members.includes(user.id)
        });
        
        if (!userCheck.canBorrow) {
            result.violations.push(...userCheck.errors);
        }
        
        result.warnings.push(...userCheck.warnings);
        
        // 2. Check loan amount
        if (loanAmount < this.rules.loans.general.minLoanAmount) {
            result.violations.push(`Minimum loan amount is ${this.rules.loans.general.minLoanAmount} SOS`);
        }
        
        if (loanAmount > this.rules.loans.general.maxLoanAmount) {
            result.violations.push(`Maximum loan amount is ${this.rules.loans.general.maxLoanAmount} SOS`);
        }
        
        // 3. Check category validity
        const validCategories = ['fare', 'data', 'gas', 'food', 'water', 'electricity', 'medicine', 'school'];
        if (!validCategories.includes(category)) {
            result.violations.push('Invalid emergency category');
        }
        
        // 4. Check if user has guarantors
        if (!user.guarantors || user.guarantors.length < 2) {
            result.conditions.push('Must provide 2 guarantors');
        }
        
        // Determine approval
        result.approved = result.violations.length === 0;
        
        if (result.approved) {
            result.conditions.push('Loan must be repaid in 7 days with 10% interest');
            result.conditions.push('5% daily penalty after 7 days');
            result.conditions.push('Default after 60 days leads to blacklisting');
        }
        
        return result;
    }

    /**
     * Evaluate lending request
     * @param {Object} request - Lending request
     * @returns {Object} Evaluation result
     */
    evaluateLendingRequest(request) {
        const { lender, borrower, amount, group } = request;
        
        const result = {
            approved: false,
            conditions: [],
            violations: [],
            warnings: []
        };
        
        // 1. Check lender eligibility
        const lenderCheck = this.rules.enforcement.canLend(lender, amount);
        
        if (!lenderCheck.canLend) {
            result.violations.push(...lenderCheck.errors);
        }
        
        result.warnings.push(...lenderCheck.warnings);
        
        // 2. Check if lender and borrower are in same group
        if (!group.members.includes(lender.id) || !group.members.includes(borrower.id)) {
            result.violations.push('Lender and borrower must be in same group');
        }
        
        // 3. Check if borrower is blacklisted
        if (borrower.blacklisted) {
            result.violations.push('Cannot lend to blacklisted borrower');
        }
        
        // 4. Check borrower rating
        if (borrower.rating < 3.0) {
            result.warnings.push('Borrower rating is below 3.0');
        }
        
        // Determine approval
        result.approved = result.violations.length === 0;
        
        if (result.approved) {
            result.conditions.push('Must create ledger for this borrower');
            result.conditions.push('Must update repayment status manually');
            result.conditions.push('Can rate borrower after repayment');
        }
        
        return result;
    }

    /**
     * Calculate loan terms
     * @param {number} principal - Loan amount
     * @returns {Object} Loan terms
     */
    calculateLoanTerms(principal) {
        const interest = principal * this.rules.loans.general.interestRate;
        const total = principal + interest;
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + this.rules.loans.general.repaymentPeriod);
        
        return {
            principal,
            interest,
            total,
            dueDate: dueDate.toISOString().split('T')[0],
            dailyRepayment: total / this.rules.loans.general.repaymentPeriod,
            terms: {
                repaymentPeriod: this.rules.loans.general.repaymentPeriod,
                interestRate: this.rules.loans.general.interestRate * 100 + '%',
                penaltyRate: this.rules.loans.penalties.dailyRate * 100 + '% daily after 7 days',
                defaultPeriod: '60 days'
            }
        };
    }
}

// ============================================
// EXPORT MODULE
// ============================================
module.exports = {
    // Main rules configuration
    rules: SomaliaRules,
    
    // Rules engine
    engine: new SomaliaRulesEngine(),
    
    // Validation function
    validate: SomaliaRules.validation.validateAllRules,
    
    // Enforcement functions
    enforce: SomaliaRules.enforcement,
    
    // Utility functions
    utils: {
        /**
         * Get rules for specific hierarchy level
         * @param {string} level - Hierarchy level
         * @returns {Object} Rules for that level
         */
        getHierarchyRules: (level) => {
            return SomaliaRules.hierarchy[level] || null;
        },
        
        /**
         * Get subscription tier details
         * @param {string} tier - Tier name
         * @returns {Object} Tier details
         */
        getSubscriptionTier: (tier) => {
            return SomaliaRules.subscriptions.tiers[tier] || null;
        },
        
        /**
         * Check if date is subscription expiry day
         * @param {Date} date - Date to check
         * @returns {boolean} True if expiry day
         */
        isSubscriptionExpiryDay: (date = new Date()) => {
            return date.getDate() === SomaliaRules.subscriptions.enforcement.expiry.day;
        },
        
        /**
         * Format rules for display
         * @param {string} ruleSet - Rule set name
         * @returns {string} Formatted rules
         */
        formatRulesForDisplay: (ruleSet) => {
            if (!SomaliaRules[ruleSet]) return '';
            
            let output = '';
            Object.entries(SomaliaRules[ruleSet]).forEach(([key, value]) => {
                if (Array.isArray(value)) {
                    output += `${key}:\n`;
                    value.forEach(item => {
                        output += `  • ${item}\n`;
                    });
                } else if (typeof value === 'object') {
                    output += `${key}:\n`;
                    Object.entries(value).forEach(([subKey, subValue]) => {
                        if (Array.isArray(subValue)) {
                            output += `  ${subKey}:\n`;
                            subValue.forEach(item => {
                                output += `    • ${item}\n`;
                            });
                        } else {
                            output += `  ${subKey}: ${subValue}\n`;
                        }
                    });
                } else {
                    output += `${key}: ${value}\n`;
                }
                output += '\n';
            });
            
            return output;
        }
    },
    
    // Constants
    CONSTANTS: {
        HIERARCHY_LEVELS: ['global', 'somalia', 'groups', 'lenders', 'borrowers', 'ledgers'],
        SUBSCRIPTION_TIERS: ['basic', 'premium', 'super', 'lenderOfLenders'],
        INTEREST_RATE: 0.10,
        PENALTY_RATE: 0.05,
        REPAYMENT_PERIOD: 7,
        SUBSCRIPTION_EXPIRY_DAY: 28,
        DEFAULT_PERIOD: 60,
        MIN_BORROWER_RATING: 3.0,
        MAX_BORROWER_GROUPS: 4
    }
};

// ============================================
// INITIALIZATION
// ============================================
(() => {
    console.log('⚖️ Somalia Rules Module Loaded');
    
    // Run validation
    const validation = SomaliaRules.validation.validateAllRules();
    
    if (validation.valid) {
        console.log('✅ Rules validation passed');
    } else {
        console.log('❌ Rules validation failed');
        validation.errors.forEach(error => console.log(`  - ${error}`));
    }
    
    if (validation.warnings.length > 0) {
        validation.warnings.forEach(warning => console.log(`  ⚠️ ${warning}`));
    }
    
    console.log(`   Hierarchy Levels: ${Object.keys(SomaliaRules.hierarchy).length}`);
    console.log(`   Subscription Tiers: ${Object.keys(SomaliaRules.subscriptions.tiers).length}`);
    console.log(`   Interest Rate: ${SomaliaRules.loans.general.interestRate * 100}%`);
    console.log(`   Penalty Rate: ${SomaliaRules.loans.penalties.dailyRate * 100}% daily`);
    console.log(`   Subscription Expiry: ${SomaliaRules.subscriptions.enforcement.expiry.day}th monthly`);
})();