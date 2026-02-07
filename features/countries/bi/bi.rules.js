/**
 * BURUNDI (BI) - Business Rules & Validation Module
 * Strict enforcement of M-Pesewa hierarchy and business logic
 * Non-negotiable rules that cannot be bypassed
 */

const BI_RULES = {
    // ============================================
    // 1️⃣ HIERARCHY ENFORCEMENT RULES (STRICT)
    // ============================================
    hierarchy: {
        // Global → Country isolation
        countryIsolation: {
            rule: "NO_CROSS_COUNTRY_OPERATIONS",
            description: "All operations must be contained within Burundi",
            enforcement: {
                check: (userCountry, targetCountry) => {
                    return userCountry === 'BI' && targetCountry === 'BI';
                },
                error: "Cross-country operations are strictly prohibited",
                penalty: "account_suspension",
                severity: "critical"
            },
            validations: [
                {
                    check: "user_registration_country",
                    message: "User must register with Burundi credentials",
                    condition: "user.country === 'BI'"
                },
                {
                    check: "group_country_match",
                    message: "Group country must match user country",
                    condition: "group.country === user.country"
                },
                {
                    check: "loan_country_match",
                    message: "Loan country must match user country",
                    condition: "loan.country === user.country"
                }
            ]
        },

        // Country → Groups
        groupRules: {
            minMembers: {
                rule: "GROUP_MIN_MEMBERS_5",
                value: 5,
                description: "Minimum 5 members required to form a group",
                enforcement: {
                    check: (group) => group.members.length >= 5,
                    error: "Group must have at least 5 members",
                    penalty: "group_inactive",
                    gracePeriod: "7 days"
                }
            },
            maxMembers: {
                rule: "GROUP_MAX_MEMBERS_1000",
                value: 1000,
                description: "Maximum 1000 members per group",
                enforcement: {
                    check: (group) => group.members.length <= 1000,
                    error: "Group cannot exceed 1000 members",
                    penalty: "new_members_blocked",
                    immediate: true
                }
            },
            invitationOnly: {
                rule: "GROUP_INVITATION_ONLY",
                value: true,
                description: "Group membership by invitation or referral only",
                enforcement: {
                    check: (user, group) => group.invitations.includes(user.id) || group.referrals.includes(user.id),
                    error: "Group invitation or referral required",
                    penalty: "access_denied"
                }
            },
            countryLocked: {
                rule: "GROUP_COUNTRY_LOCKED",
                value: true,
                description: "Groups cannot include members from other countries",
                enforcement: {
                    check: (memberCountry, groupCountry) => memberCountry === groupCountry,
                    error: "Only Burundi residents can join Burundi groups",
                    penalty: "removal_from_group"
                }
            }
        },

        // Groups → Lenders
        lenderRules: {
            subscriptionRequired: {
                rule: "LENDER_SUBSCRIPTION_REQUIRED",
                value: true,
                description: "Lenders must have active subscription",
                enforcement: {
                    check: (lender) => lender.subscription.active && lender.subscription.expiry > new Date(),
                    error: "Active subscription required for lending",
                    penalty: "lending_disabled",
                    gracePeriod: "none"
                }
            },
            lendingWithinGroup: {
                rule: "LEND_WITHIN_GROUP_ONLY",
                value: true,
                description: "Lenders can only lend within their own groups",
                enforcement: {
                    check: (lender, borrower) => {
                        const commonGroups = lender.groups.filter(g => borrower.groups.includes(g));
                        return commonGroups.length > 0;
                    },
                    error: "Lending only allowed within common groups",
                    penalty: "transaction_reversal"
                }
            },
            tierLimits: {
                rule: "LENDER_TIER_LIMITS",
                description: "Lending limits based on subscription tier",
                tiers: {
                    basic: { weekly: 1500, perLoan: 1500 },
                    premium: { weekly: 5000, perLoan: 10000 },
                    super: { weekly: 20000, perLoan: 20000 },
                    lenderOfLenders: { weekly: 50000, perLoan: 50000 }
                },
                enforcement: {
                    check: (lender, amount) => {
                        const tier = lender.subscription.tier;
                        const limit = BI_RULES.hierarchy.lenderRules.tierLimits.tiers[tier];
                        return amount <= limit.perLoan;
                    },
                    error: "Loan amount exceeds subscription tier limit",
                    penalty: "transaction_rejection"
                }
            },
            categoryRestrictions: {
                rule: "LENDER_CATEGORY_RESTRICTIONS",
                description: "Lenders can choose which categories to support",
                enforcement: {
                    check: (lender, category) => {
                        return lender.categories.includes('all') || lender.categories.includes(category);
                    },
                    error: "Lender does not support this loan category",
                    penalty: "transaction_rejection"
                }
            }
        },

        // Lenders → Ledgers
        ledgerRules: {
            autoGeneration: {
                rule: "LEDGER_AUTO_GENERATE",
                value: true,
                description: "Ledger automatically generated on loan approval",
                enforcement: {
                    trigger: "loan_approval",
                    fields: [
                        "borrower_name",
                        "borrower_contact",
                        "borrower_location",
                        "guarantor1",
                        "guarantor2",
                        "loan_category",
                        "amount",
                        "date_borrowed",
                        "due_date",
                        "interest",
                        "status"
                    ]
                }
            },
            manualUpdate: {
                rule: "LEDGER_MANUAL_UPDATE",
                value: true,
                description: "Ledger updates are manual by lender",
                permissions: {
                    lender: ["update_repayments", "update_status", "add_notes"],
                    borrower: ["view_only"],
                    admin: ["override_updates", "correct_errors"]
                }
            },
            unlimitedLedgers: {
                rule: "UNLIMITED_LEDGERS_PER_LENDER",
                value: true,
                description: "Unlimited ledgers per lender",
                enforcement: {
                    check: (lender) => true, // No limit
                    error: null,
                    penalty: null
                }
            }
        },

        // Groups → Borrowers
        borrowerRules: {
            maxGroups: {
                rule: "BORROWER_MAX_4_GROUPS",
                value: 4,
                description: "Borrowers can join maximum 4 groups",
                enforcement: {
                    check: (borrower) => borrower.groups.length <= 4,
                    error: "Maximum 4 groups allowed per borrower",
                    penalty: "new_group_blocked"
                }
            },
            goodRatingRequired: {
                rule: "GOOD_RATING_FOR_MULTI_GROUP",
                value: 4.0,
                description: "Minimum 4-star rating for multiple groups",
                enforcement: {
                    check: (borrower) => {
                        if (borrower.groups.length > 1) {
                            return borrower.rating >= 4.0;
                        }
                        return true;
                    },
                    error: "4-star rating required for multiple groups",
                    penalty: "group_removal"
                }
            },
            dualRoleAllowed: {
                rule: "DUAL_ROLE_BORROWER_LENDER",
                value: true,
                description: "Users can be both borrowers and lenders",
                enforcement: {
                    requirements: [
                        "separate_registration",
                        "separate_login",
                        "role_switch_logout_required"
                    ]
                }
            },
            noSubscription: {
                rule: "BORROWER_NO_SUBSCRIPTION_FEE",
                value: true,
                description: "Borrowers pay no subscription fees",
                enforcement: {
                    check: (user) => {
                        if (user.role === 'borrower') {
                            return !user.subscription || user.subscription.fee === 0;
                        }
                        return true;
                    },
                    error: "Borrowers cannot be charged subscription fees",
                    penalty: "fee_refund"
                }
            }
        }
    },

    // ============================================
    // 2️⃣ LOAN & REPAYMENT RULES (STRICT)
    // ============================================
    loanRules: {
        duration: {
            rule: "LOAN_DURATION_7_DAYS",
            value: 7,
            description: "Maximum loan period is 7 days",
            enforcement: {
                check: (loan) => {
                    const dueDate = new Date(loan.date_borrowed);
                    dueDate.setDate(dueDate.getDate() + 7);
                    return loan.due_date <= dueDate;
                },
                error: "Loan period cannot exceed 7 days",
                penalty: "auto_rejection"
            }
        },

        interest: {
            rule: "INTEREST_10_PERCENT",
            value: 10,
            description: "10% interest per loan period",
            calculation: {
                formula: "principal * 0.10",
                rounding: "ceil",
                minimum: 1
            },
            enforcement: {
                check: (loan) => {
                    const expected = Math.ceil(loan.principal * 0.10);
                    return loan.interest === expected;
                },
                error: "Interest must be exactly 10%",
                penalty: "recalculation_required"
            }
        },

        partialRepayment: {
            rule: "ALLOW_PARTIAL_DAILY_REPAYMENT",
            value: true,
            description: "Allow partial daily repayments",
            conditions: [
                "minimum_partial_payment: 100 BIF",
                "daily_limit: once per day",
                "applied_to_principal_first"
            ]
        },

        penalty: {
            rule: "PENALTY_5_PERCENT_DAILY_AFTER_7_DAYS",
            value: 5,
            description: "5% daily penalty on outstanding balance after 7 days",
            calculation: {
                formula: "outstanding_balance * 0.05 * overdue_days",
                start: "day_8",
                compounding: "daily"
            },
            enforcement: {
                automatic: true,
                notification: "daily_reminder",
                maxPenalty: "principal_amount"
            }
        },

        default: {
            rule: "DEFAULT_AFTER_2_MONTHS",
            value: 60,
            description: "Loan in default after 2 months (60 days)",
            consequences: [
                "blacklist_automatic",
                "group_removal_automatic",
                "legal_action_allowed",
                "debt_collection_enabled"
            ]
        },

        oneActiveLoan: {
            rule: "ONE_ACTIVE_LOAN_PER_GROUP",
            value: true,
            description: "Only one active loan per borrower per group",
            enforcement: {
                check: (borrower, group) => {
                    const activeLoans = borrower.loans.filter(l => 
                        l.group === group && l.status === 'active'
                    );
                    return activeLoans.length === 0;
                },
                error: "Only one active loan allowed per group",
                penalty: "loan_rejection"
            }
        }
    },

    // ============================================
    // 3️⃣ SUBSCRIPTION RULES (MANDATORY)
    // ============================================
    subscriptionRules: {
        expiry: {
            rule: "SUBSCRIPTION_EXPIRES_28TH_MONTHLY",
            value: 28,
            description: "Subscription expires on 28th of each month",
            enforcement: {
                check: (subscription) => {
                    const expiry = new Date(subscription.expiry);
                    return expiry.getDate() === 28;
                },
                error: "Subscription expiry must be 28th of month",
                penalty: "system_correction"
            }
        },

        blockOnExpiry: {
            rule: "BLOCK_LENDING_ON_EXPIRY",
            value: true,
            description: "Lending access blocked when subscription expires",
            enforcement: {
                automatic: true,
                immediate: true,
                restoration: "payment_confirmation"
            }
        },

        tiers: {
            basic: {
                rule: "BASIC_TIER_LIMITS",
                limits: {
                    weekly: 1500,
                    perLoan: 1500,
                    crb: false,
                    fee: { monthly: 50, biAnnual: 250, annual: 500 }
                }
            },
            premium: {
                rule: "PREMIUM_TIER_LIMITS",
                limits: {
                    weekly: 5000,
                    perLoan: 10000,
                    crb: false,
                    fee: { monthly: 250, biAnnual: 1500, annual: 2500 }
                }
            },
            super: {
                rule: "SUPER_TIER_LIMITS",
                limits: {
                    weekly: 20000,
                    perLoan: 20000,
                    crb: true,
                    fee: { monthly: 1000, biAnnual: 5000, annual: 8500 }
                }
            },
            lenderOfLenders: {
                rule: "LENDER_OF_LENDERS_LIMITS",
                limits: {
                    weekly: 50000,
                    perLoan: 50000,
                    crb: true,
                    fee: { monthly: 500, biAnnual: 3500, annual: 6500 }
                },
                specialRules: [
                    "custom_repayment_terms_allowed",
                    "minimum_repayment_period_1_month",
                    "interest_negotiable"
                ]
            }
        },

        paymentRequired: {
            rule: "SUBSCRIPTION_PAYMENT_REQUIRED_BEFORE_LENDING",
            value: true,
            description: "Subscription payment required before lending access",
            enforcement: {
                check: (lender) => lender.subscription.payment_confirmed,
                error: "Subscription payment not confirmed",
                penalty: "lending_blocked"
            }
        }
    },

    // ============================================
    // 4️⃣ REPUTATION & BLACKLIST RULES
    // ============================================
    reputationRules: {
        ratingSystem: {
            rule: "5_STAR_RATING_SYSTEM",
            scale: 5,
            description: "5-star borrower rating system",
            factors: [
                { factor: "timely_repayment", weight: 40 },
                { factor: "communication", weight: 25 },
                { factor: "honesty", weight: 20 },
                { factor: "cooperation", weight: 15 }
            ],
            calculation: "weighted_average",
            updateFrequency: "after_each_loan"
        },

        blacklist: {
            rule: "BLACKLIST_AFTER_2_MONTHS_DEFAULT",
            trigger: "60_days_overdue",
            description: "Blacklist after 2 months of default",
            consequences: [
                "cannot_borrow",
                "cannot_join_new_groups",
                "badge_visible_platform_wide",
                "debt_collection_eligible"
            ],
            removal: {
                rule: "ADMIN_ONLY_BLACKLIST_REMOVAL",
                by: "platform_admin_only",
                condition: "full_repayment_principal_interest_penalties",
                process: "manual_review_required"
            }
        },

        groupAccess: {
            rule: "GOOD_RATING_FOR_MORE_GROUPS",
            thresholds: [
                { rating: 4.0, maxGroups: 4 },
                { rating: 3.0, maxGroups: 3 },
                { rating: 2.0, maxGroups: 2 },
                { rating: 1.0, maxGroups: 1 }
            ],
            enforcement: "automatic_based_on_rating"
        }
    },

    // ============================================
    // 5️⃣ GROUP ADMINISTRATION RULES
    // ============================================
    groupAdminRules: {
        founderRights: {
            rule: "ONE_ADMIN_PER_GROUP",
            value: 1,
            description: "One Admin/Founder per group",
            rights: [
                "invite_members",
                "remove_members",
                "moderate_content",
                "view_budgets",
                "see_statistics"
            ],
            transfer: "manual_transfer_allowed"
        },

        memberInvitation: {
            rule: "INVITATION_OR_REFERRAL_ONLY",
            methods: ["invitation", "referral"],
            requirements: [
                "existing_member_sponsorship",
                "referrer_liability",
                "admin_approval"
            ]
        },

        internalRules: {
            rule: "GROUP_INTERNAL_RULES_ALLOWED",
            value: true,
            description: "Groups may define internal rules",
            limitations: [
                "cannot_violate_platform_rules",
                "must_be_transparent",
                "subject_to_admin_review"
            ]
        }
    },

    // ============================================
    // 6️⃣ USER REGISTRATION RULES
    // ============================================
    registrationRules: {
        mandatoryFields: {
            lender: [
                "full_name",
                "national_id",
                "phone",
                "location",
                "subscription_tier",
                "username",
                "password",
                "referrer1",
                "referrer2",
                "group_selection"
            ],
            borrower: [
                "full_name",
                "national_id",
                "phone",
                "location",
                "referrer1",
                "referrer2",
                "group_selection"
            ]
        },

        passwordPolicy: {
            rule: "PASSWORD_COMPLEXITY_REQUIRED",
            requirements: [
                "length_8_12",
                "uppercase_lowercase",
                "numbers_required",
                "special_characters"
            ],
            enforcement: "registration_validation"
        },

        dualRole: {
            rule: "DUAL_ROLE_SEPARATE_REGISTRATION",
            value: true,
            description: "Separate registration required for each role",
            process: [
                "logout_required",
                "new_registration",
                "separate_credentials",
                "linked_profiles"
            ]
        },

        verification: {
            rule: "VERIFICATION_REQUIRED_BEFORE_ACTIVATION",
            steps: [
                "phone_verification",
                "email_verification",
                "referrer_verification",
                "id_verification"
            ],
            completion: "all_steps_required"
        }
    },

    // ============================================
    // 7️⃣ TRANSACTION & LEDGER RULES
    // ============================================
    transactionRules: {
        disbursement: {
            rule: "MANUAL_DISBURSEMENT_OUTSIDE_PLATFORM",
            value: true,
            description: "Disbursement occurs manually outside platform",
            methods: ["mobile_money", "bank_transfer", "cash"],
            platformRole: "tracking_only",
            verification: "lender_confirmation_required"
        },

        ledgerCreation: {
            rule: "LEDGER_AUTO_CREATE_ON_APPROVAL",
            trigger: "loan_approval",
            fields: [
                "borrower_name",
                "borrower_contact",
                "borrower_location",
                "guarantor1_contact",
                "guarantor2_contact",
                "loan_category",
                "amount",
                "date_borrowed",
                "due_date",
                "interest",
                "penalty",
                "status"
            ],
            storage: "lender_profile_group_context"
        },

        ledgerUpdate: {
            rule: "MANUAL_LEDGER_UPDATES",
            by: "lender",
            frequency: "as_needed",
            adminOverride: {
                allowed: true,
                by: "platform_admin",
                audit: "required"
            }
        }
    },

    // ============================================
    // 8️⃣ DEBT COLLECTION RULES
    // ============================================
    debtCollectionRules: {
        platformRole: {
            rule: "PLATFORM_DOES_NOT_MANAGE_RECOVERY",
            value: true,
            description: "Platform does not manage debt recovery",
            responsibility: "users_contact_collectors_independently"
        },

        collectors: {
            rule: "VETTED_DEBT_COLLECTORS_ONLY",
            count: 200,
            verification: "platform_vetted",
            information: [
                "name",
                "contact_details",
                "location",
                "country",
                "specialization"
            ]
        },

        userAction: {
            rule: "USERS_CONTACT_COLLECTORS_INDEPENDENTLY",
            process: [
                "search_collector_directory",
                "direct_contact",
                "independent_agreement",
                "platform_not_involved"
            ]
        }
    },

    // ============================================
    // 9️⃣ PLATFORM ADMIN RULES
    // ============================================
    adminRules: {
        overridePowers: {
            rule: "ADMIN_CAN_OVERRIDE_BLACKLIST_LEDGERS",
            permissions: [
                "override_blacklist",
                "edit_ledgers",
                "correct_errors",
                "moderate_ratings",
                "validate_collectors"
            ],
            conditions: [
                "admin_login_required",
                "audit_log_mandatory",
                "dual_approval_large_changes"
            ]
        },

        adminDashboard: {
            rule: "SEPARATE_ADMIN_DASHBOARD",
            access: "admin_login_only",
            features: [
                "user_management",
                "group_oversight",
                "ledger_review",
                "blacklist_management",
                "system_health"
            ]
        }
    },

    // ============================================
    // 🔟 COMPLIANCE & REPORTING RULES
    // ============================================
    complianceRules: {
        reporting: {
            rule: "REGULAR_REPORTING_REQUIRED",
            frequency: {
                daily: "transaction_volume",
                weekly: "platform_metrics",
                monthly: "financial_statements",
                annual: "compliance_report"
            },
            authorities: ["Bank of the Republic of Burundi", "Burundi Revenue Authority"]
        },

        audit: {
            rule: "COMPREHENSIVE_AUDIT_TRAIL",
            requirements: [
                "all_transactions_logged",
                "user_actions_tracked",
                "admin_actions_double_logged",
                "7_year_retention"
            ]
        },

        dataProtection: {
            rule: "DATA_PROTECTION_COMPLIANCE",
            law: "Law No. 1/07 of 2018",
            requirements: [
                "user_consent_required",
                "data_minimization",
                "purpose_limitation",
                "security_measures"
            ]
        }
    },

    // ============================================
    // 1️⃣1️⃣ RULE VALIDATION FUNCTIONS
    // ============================================
    validators: {
        // Hierarchy validators
        validateCountryIsolation: (user, operation) => {
            if (user.country !== 'BI') {
                return {
                    valid: false,
                    error: "User country must be Burundi",
                    rule: "NO_CROSS_COUNTRY_OPERATIONS"
                };
            }
            if (operation.country && operation.country !== 'BI') {
                return {
                    valid: false,
                    error: "Operation country must be Burundi",
                    rule: "NO_CROSS_COUNTRY_OPERATIONS"
                };
            }
            return { valid: true };
        },

        validateGroupMembership: (user, group) => {
            if (user.country !== group.country) {
                return {
                    valid: false,
                    error: "User country must match group country",
                    rule: "GROUP_COUNTRY_LOCKED"
                };
            }
            if (group.members.length >= 1000) {
                return {
                    valid: false,
                    error: "Group has reached maximum members",
                    rule: "GROUP_MAX_MEMBERS_1000"
                };
            }
            return { valid: true };
        },

        validateLenderSubscription: (lender, amount) => {
            if (!lender.subscription || !lender.subscription.active) {
                return {
                    valid: false,
                    error: "Active subscription required",
                    rule: "LENDER_SUBSCRIPTION_REQUIRED"
                };
            }

            const tier = lender.subscription.tier;
            const tierLimit = BI_RULES.hierarchy.lenderRules.tierLimits.tiers[tier];
            
            if (!tierLimit) {
                return {
                    valid: false,
                    error: "Invalid subscription tier",
                    rule: "LENDER_TIER_LIMITS"
                };
            }

            if (amount > tierLimit.perLoan) {
                return {
                    valid: false,
                    error: `Amount exceeds ${tier} tier limit of ${tierLimit.perLoan} BIF`,
                    rule: "LENDER_TIER_LIMITS"
                };
            }

            return { valid: true };
        },

        validateBorrowerEligibility: (borrower, group) => {
            if (borrower.groups.length >= 4) {
                return {
                    valid: false,
                    error: "Maximum 4 groups allowed",
                    rule: "BORROWER_MAX_4_GROUPS"
                };
            }

            if (borrower.groups.length > 0 && borrower.rating < 4.0) {
                return {
                    valid: false,
                    error: "4-star rating required for multiple groups",
                    rule: "GOOD_RATING_FOR_MULTI_GROUP"
                };
            }

            return { valid: true };
        },

        // Loan validators
        validateLoanTerms: (loan) => {
            const errors = [];

            // Check duration
            const maxDueDate = new Date(loan.date_borrowed);
            maxDueDate.setDate(maxDueDate.getDate() + 7);
            if (loan.due_date > maxDueDate) {
                errors.push({
                    rule: "LOAN_DURATION_7_DAYS",
                    error: "Loan period cannot exceed 7 days"
                });
            }

            // Check interest
            const expectedInterest = Math.ceil(loan.principal * 0.10);
            if (loan.interest !== expectedInterest) {
                errors.push({
                    rule: "INTEREST_10_PERCENT",
                    error: `Interest must be ${expectedInterest} BIF (10% of ${loan.principal})`
                });
            }

            return errors.length === 0 ? 
                { valid: true } : 
                { valid: false, errors };
        },

        validateRepayment: (repayment, loan) => {
            const errors = [];

            // Check minimum partial payment
            if (repayment.amount < 100 && repayment.type === 'partial') {
                errors.push({
                    rule: "MINIMUM_PARTIAL_PAYMENT",
                    error: "Minimum partial payment is 100 BIF"
                });
            }

            // Check if loan is active
            if (loan.status !== 'active') {
                errors.push({
                    rule: "REPAYMENT_ON_ACTIVE_LOAN_ONLY",
                    error: "Can only repay active loans"
                });
            }

            return errors.length === 0 ?
                { valid: true } :
                { valid: false, errors };
        },

        // Subscription validators
        validateSubscriptionPayment: (subscription) => {
            if (!subscription.payment_confirmed) {
                return {
                    valid: false,
                    error: "Subscription payment not confirmed",
                    rule: "SUBSCRIPTION_PAYMENT_REQUIRED_BEFORE_LENDING"
                };
            }

            // Check expiry date is 28th
            const expiry = new Date(subscription.expiry);
            if (expiry.getDate() !== 28) {
                return {
                    valid: false,
                    warning: "Subscription expiry should be 28th of month",
                    valid: true // Warning but not invalid
                };
            }

            return { valid: true };
        },

        // Blacklist validators
        validateBlacklistAction: (user, action, admin) => {
            const errors = [];

            if (action === 'add' && user.days_overdue < 60) {
                errors.push({
                    rule: "BLACKLIST_AFTER_2_MONTHS_DEFAULT",
                    error: "Can only blacklist after 60 days overdue"
                });
            }

            if (action === 'remove' && !admin.isPlatformAdmin) {
                errors.push({
                    rule: "ADMIN_ONLY_BLACKLIST_REMOVAL",
                    error: "Only platform admin can remove blacklist"
                });
            }

            return errors.length === 0 ?
                { valid: true } :
                { valid: false, errors };
        },

        // Bulk validation for transaction
        validateTransaction: (transaction) => {
            const validations = [];

            // Check all applicable rules
            validations.push(
                BI_RULES.validators.validateCountryIsolation(
                    transaction.lender, 
                    { country: transaction.country }
                )
            );

            validations.push(
                BI_RULES.validators.validateLenderSubscription(
                    transaction.lender,
                    transaction.amount
                )
            );

            validations.push(
                BI_RULES.validators.validateLoanTerms({
                    principal: transaction.amount,
                    interest: transaction.interest,
                    date_borrowed: transaction.date,
                    due_date: transaction.due_date
                })
            );

            // Check if lender supports category
            if (!transaction.lender.categories.includes('all') && 
                !transaction.lender.categories.includes(transaction.category)) {
                validations.push({
                    valid: false,
                    error: "Lender does not support this category",
                    rule: "LENDER_CATEGORY_RESTRICTIONS"
                });
            }

            // Check borrower eligibility
            validations.push(
                BI_RULES.validators.validateBorrowerEligibility(
                    transaction.borrower,
                    transaction.group
                )
            );

            // Check one active loan per group
            const activeLoansInGroup = transaction.borrower.loans.filter(l =>
                l.group === transaction.group && l.status === 'active'
            );
            if (activeLoansInGroup.length > 0) {
                validations.push({
                    valid: false,
                    error: "Only one active loan allowed per group",
                    rule: "ONE_ACTIVE_LOAN_PER_GROUP"
                });
            }

            // Aggregate results
            const failed = validations.filter(v => !v.valid);
            if (failed.length === 0) {
                return {
                    valid: true,
                    warnings: validations.filter(v => v.warning).map(v => v.warning)
                };
            } else {
                return {
                    valid: false,
                    errors: failed.map(f => ({
                        rule: f.rule,
                        error: f.error
                    }))
                };
            }
        }
    },

    // ============================================
    // 1️⃣2️⃣ RULE ENFORCEMENT ACTIONS
    // ============================================
    enforcementActions: {
        // Hierarchy enforcement
        enforceCountryIsolation: (violation) => {
            return {
                action: "account_suspension",
                duration: "30_days",
                message: "Cross-country operation attempt detected",
                notification: "immediate_to_user_and_admin",
                audit: "mandatory"
            };
        },

        enforceGroupRules: (violation) => {
            switch (violation.rule) {
                case "GROUP_MIN_MEMBERS_5":
                    return {
                        action: "group_inactive",
                        message: "Group marked inactive until minimum members reached",
                        gracePeriod: "7_days"
                    };
                case "GROUP_MAX_MEMBERS_1000":
                    return {
                        action: "new_members_blocked",
                        message: "Cannot add new members, group at capacity",
                        immediate: true
                    };
                default:
                    return {
                        action: "warning",
                        message: "Group rule violation"
                    };
            }
        },

        enforceLenderRules: (violation) => {
            switch (violation.rule) {
                case "LENDER_SUBSCRIPTION_REQUIRED":
                    return {
                        action: "lending_disabled",
                        message: "Lending disabled until subscription active",
                        immediate: true
                    };
                case "LENDER_TIER_LIMITS":
                    return {
                        action: "transaction_rejection",
                        message: "Transaction rejected - exceeds tier limit",
                        immediate: true
                    };
                default:
                    return {
                        action: "transaction_review",
                        message: "Lender rule violation requires review"
                    };
            }
        },

        enforceLoanRules: (violation) => {
            switch (violation.rule) {
                case "LOAN_DURATION_7_DAYS":
                    return {
                        action: "auto_rejection",
                        message: "Loan rejected - exceeds maximum duration",
                        immediate: true
                    };
                case "INTEREST_10_PERCENT":
                    return {
                        action: "recalculation_required",
                        message: "Interest must be recalculated",
                        blockUntil: "corrected"
                    };
                default:
                    return {
                        action: "validation_failed",
                        message: "Loan rule violation"
                    };
            }
        },

        enforceSubscriptionRules: (violation) => {
            switch (violation.rule) {
                case "SUBSCRIPTION_PAYMENT_REQUIRED_BEFORE_LENDING":
                    return {
                        action: "lending_blocked",
                        message: "Lending blocked until payment confirmed",
                        immediate: true
                    };
                case "BLOCK_LENDING_ON_EXPIRY":
                    return {
                        action: "automatic_block",
                        message: "Lending automatically blocked on subscription expiry",
                        immediate: true,
                        notification: "advance_warning_7_days"
                    };
                default:
                    return {
                        action: "system_correction",
                        message: "Subscription rule violation corrected"
                    };
            }
        },

        enforceBlacklistRules: (violation) => {
            switch (violation.rule) {
                case "BLACKLIST_AFTER_2_MONTHS_DEFAULT":
                    return {
                        action: "automatic_blacklist",
                        message: "Automatically blacklisted after 60 days overdue",
                        immediate: true,
                        consequences: [
                            "borrowing_disabled",
                            "new_groups_blocked",
                            "badge_applied"
                        ]
                    };
                default:
                    return {
                        action: "manual_review",
                        message: "Blacklist rule violation requires review"
                    };
            }
        },

        // Generic enforcement handler
        handleViolation: (violation) => {
            const { rule, severity = 'medium' } = violation;
            
            // Route to appropriate enforcer based on rule category
            if (rule.includes('COUNTRY')) {
                return BI_RULES.enforcementActions.enforceCountryIsolation(violation);
            } else if (rule.includes('GROUP')) {
                return BI_RULES.enforcementActions.enforceGroupRules(violation);
            } else if (rule.includes('LENDER')) {
                return BI_RULES.enforcementActions.enforceLenderRules(violation);
            } else if (rule.includes('LOAN') || rule.includes('INTEREST')) {
                return BI_RULES.enforcementActions.enforceLoanRules(violation);
            } else if (rule.includes('SUBSCRIPTION')) {
                return BI_RULES.enforcementActions.enforceSubscriptionRules(violation);
            } else if (rule.includes('BLACKLIST')) {
                return BI_RULES.enforcementActions.enforceBlacklistRules(violation);
            } else {
                return {
                    action: "review_required",
                    message: "Unknown rule violation - requires manual review",
                    severity: "high"
                };
            }
        }
    },

    // ============================================
    // 1️⃣3️⃣ RULE MONITORING & AUDITING
    // ============================================
    monitoring: {
        ruleChecks: {
            frequency: "real_time",
            points: [
                "user_registration",
                "group_creation",
                "loan_application",
                "loan_approval",
                "repayment_processing",
                "subscription_payment",
                "blacklist_action"
            ]
        },

        auditLogging: {
            enabled: true,
            fields: [
                "timestamp",
                "user_id",
                "rule_id",
                "violation_details",
                "enforcement_action",
                "admin_override",
                "resolution_status"
            ],
            retention: "7_years"
        },

        reporting: {
            daily: "rule_violations_summary",
            weekly: "enforcement_actions_report",
            monthly: "compliance_audit_report"
        },

        alerts: {
            critical: ["country_isolation_violation", "subscription_bypass_attempt"],
            high: ["group_rule_violation", "loan_term_violation"],
            medium: ["lender_limit_violation", "reputation_system_manipulation"],
            low: ["minor_validation_errors", "warning_level_violations"]
        }
    },

    // ============================================
    // 1️⃣4️⃣ RULE VERSIONING & UPDATES
    // ============================================
    versioning: {
        currentVersion: "2.0-BI",
        effectiveDate: "2024-03-15",
        previousVersion: "1.5-BI",
        
        changes: [
            "Added strict country isolation enforcement",
            "Enhanced subscription expiry rules",
            "Updated blacklist automation",
            "Improved validation functions"
        ],
        
        updateProcess: {
            notification: "30_days_advance",
            userAcceptance: "required",
            grandfathering: "existing_contracts_honored",
            rollbackPlan: "available_30_days"
        },
        
        compatibility: {
            minPlatformVersion: "2.0.0",
            dependencies: ["bi.config.js v2.4.0", "bi.legal.js v2.0-BI"]
        }
    }
};

// ============================================
// RULE ENGINE IMPLEMENTATION
// ============================================

class BiRuleEngine {
    constructor() {
        this.rules = BI_RULES;
        this.violations = [];
        this.auditLog = [];
    }

    // Validate a specific rule
    validateRule(ruleId, context) {
        const rule = this.findRule(ruleId);
        if (!rule) {
            return {
                valid: false,
                error: `Rule ${ruleId} not found`,
                ruleId
            };
        }

        // Apply validation based on rule type
        let validationResult;
        switch (ruleId) {
            case 'NO_CROSS_COUNTRY_OPERATIONS':
                validationResult = this.rules.validators.validateCountryIsolation(
                    context.user, 
                    context.operation
                );
                break;
            case 'LENDER_SUBSCRIPTION_REQUIRED':
                validationResult = this.rules.validators.validateLenderSubscription(
                    context.lender,
                    context.amount
                );
                break;
            case 'LOAN_DURATION_7_DAYS':
                validationResult = this.rules.validators.validateLoanTerms(context.loan);
                break;
            default:
                validationResult = { valid: true, warning: "No specific validator for this rule" };
        }

        // Log validation
        this.auditLog.push({
            timestamp: new Date().toISOString(),
            ruleId,
            context,
            result: validationResult,
            validatedBy: 'rule_engine'
        });

        return validationResult;
    }

    // Validate transaction with all applicable rules
    validateTransaction(transaction) {
        const validation = this.rules.validators.validateTransaction(transaction);
        
        this.auditLog.push({
            timestamp: new Date().toISOString(),
            type: 'transaction_validation',
            transactionId: transaction.id,
            result: validation,
            rulesApplied: Object.keys(this.rules.validators)
        });

        return validation;
    }

    // Handle rule violation
    handleViolation(violation) {
        const enforcement = this.rules.enforcementActions.handleViolation(violation);
        
        this.violations.push({
            ...violation,
            timestamp: new Date().toISOString(),
            enforcement,
            status: 'pending'
        });

        this.auditLog.push({
            timestamp: new Date().toISOString(),
            type: 'violation_handled',
            violation,
            enforcement
        });

        return enforcement;
    }

    // Get all rules by category
    getRulesByCategory(category) {
        const categories = {
            hierarchy: this.rules.hierarchy,
            loan: this.rules.loanRules,
            subscription: this.rules.subscriptionRules,
            reputation: this.rules.reputationRules,
            registration: this.rules.registrationRules
        };

        return categories[category] || {};
    }

    // Check if user can perform action
    can(user, action, context) {
        const checks = [];

        switch (action) {
            case 'create_group':
                checks.push(this.validateRule('GROUP_MIN_MEMBERS_5', context));
                checks.push(this.validateRule('GROUP_COUNTRY_LOCKED', context));
                break;
            case 'apply_loan':
                checks.push(this.validateRule('ONE_ACTIVE_LOAN_PER_GROUP', context));
                checks.push(this.validateRule('BORROWER_MAX_4_GROUPS', context));
                if (user.rating < 4.0 && user.groups.length > 0) {
                    checks.push({
                        valid: false,
                        error: "4-star rating required for multiple groups",
                        rule: "GOOD_RATING_FOR_MULTI_GROUP"
                    });
                }
                break;
            case 'lend_money':
                checks.push(this.validateRule('LENDER_SUBSCRIPTION_REQUIRED', context));
                checks.push(this.validateRule('LENDER_TIER_LIMITS', context));
                checks.push(this.validateRule('LEND_WITHIN_GROUP_ONLY', context));
                break;
            case 'join_group':
                checks.push(this.validateRule('BORROWER_MAX_4_GROUPS', context));
                checks.push(this.validateRule('GROUP_INVITATION_ONLY', context));
                break;
        }

        const failed = checks.filter(check => !check.valid);
        if (failed.length === 0) {
            return { allowed: true, warnings: checks.filter(c => c.warning) };
        } else {
            return {
                allowed: false,
                errors: failed.map(f => ({ rule: f.rule, error: f.error }))
            };
        }
    }

    // Find rule by ID
    findRule(ruleId) {
        // Search through all rule sections
        const sections = [
            this.rules.hierarchy,
            this.rules.loanRules,
            this.rules.subscriptionRules,
            this.rules.reputationRules,
            this.rules.groupAdminRules,
            this.rules.registrationRules,
            this.rules.transactionRules,
            this.rules.debtCollectionRules,
            this.rules.adminRules,
            this.rules.complianceRules
        ];

        for (const section of sections) {
            for (const key in section) {
                if (section[key] && section[key].rule === ruleId) {
                    return section[key];
                }
                if (Array.isArray(section[key])) {
                    const found = section[key].find(item => item.rule === ruleId);
                    if (found) return found;
                }
            }
        }

        return null;
    }

    // Get audit trail
    getAuditTrail(filter = {}) {
        let logs = [...this.auditLog];

        if (filter.startDate) {
            logs = logs.filter(log => new Date(log.timestamp) >= new Date(filter.startDate));
        }
        if (filter.endDate) {
            logs = logs.filter(log => new Date(log.timestamp) <= new Date(filter.endDate));
        }
        if (filter.type) {
            logs = logs.filter(log => log.type === filter.type);
        }
        if (filter.ruleId) {
            logs = logs.filter(log => log.ruleId === filter.ruleId);
        }

        return logs;
    }

    // Get violation statistics
    getViolationStats() {
        const stats = {
            total: this.violations.length,
            bySeverity: {},
            byRule: {},
            byUser: {},
            timeline: {}
        };

        this.violations.forEach(violation => {
            // By severity
            const severity = violation.severity || 'medium';
            stats.bySeverity[severity] = (stats.bySeverity[severity] || 0) + 1;

            // By rule
            stats.byRule[violation.rule] = (stats.byRule[violation.rule] || 0) + 1;

            // By user
            if (violation.userId) {
                stats.byUser[violation.userId] = (stats.byUser[violation.userId] || 0) + 1;
            }

            // Timeline (by day)
            const date = new Date(violation.timestamp).toISOString().split('T')[0];
            stats.timeline[date] = (stats.timeline[date] || 0) + 1;
        });

        return stats;
    }

    // Export rules for compliance reporting
    exportComplianceReport() {
        return {
            reportId: `BI-RULES-COMPLIANCE-${Date.now()}`,
            generated: new Date().toISOString(),
            version: this.rules.versioning.currentVersion,
            summary: {
                totalRules: this.countRules(),
                activeValidators: Object.keys(this.rules.validators).length,
                recentViolations: this.violations.filter(v => 
                    new Date(v.timestamp) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                ).length,
                validationSuccessRate: this.calculateSuccessRate()
            },
            rules: this.getAllRules(),
            violations: this.violations.slice(-100), // Last 100 violations
            auditSample: this.auditLog.slice(-50) // Last 50 audit entries
        };
    }

    // Helper methods
    countRules() {
        let count = 0;
        const sections = Object.values(this.rules).filter(v => typeof v === 'object');
        
        sections.forEach(section => {
            if (section.rule) count++;
            Object.values(section).forEach(value => {
                if (value && value.rule) count++;
                if (Array.isArray(value)) {
                    value.forEach(item => {
                        if (item && item.rule) count++;
                    });
                }
            });
        });

        return count;
    }

    calculateSuccessRate() {
        const validations = this.auditLog.filter(log => log.type === 'transaction_validation');
        if (validations.length === 0) return 100;

        const successful = validations.filter(log => log.result.valid).length;
        return Math.round((successful / validations.length) * 100);
    }

    getAllRules() {
        const allRules = [];
        
        const collectRules = (obj, path = '') => {
            if (!obj || typeof obj !== 'object') return;
            
            if (obj.rule) {
                allRules.push({
                    id: obj.rule,
                    path,
                    description: obj.description,
                    value: obj.value,
                    enforcement: obj.enforcement
                });
            }
            
            for (const key in obj) {
                if (key !== 'rule' && obj[key] && typeof obj[key] === 'object') {
                    collectRules(obj[key], path ? `${path}.${key}` : key);
                }
            }
        };

        collectRules(this.rules);
        return allRules;
    }
}

// ============================================
// RULE VALIDATION & EXPORT
// ============================================

const validateRules = () => {
    const errors = [];
    const requiredRules = [
        'NO_CROSS_COUNTRY_OPERATIONS',
        'GROUP_MIN_MEMBERS_5',
        'GROUP_MAX_MEMBERS_1000',
        'LENDER_SUBSCRIPTION_REQUIRED',
        'LOAN_DURATION_7_DAYS',
        'INTEREST_10_PERCENT',
        'SUBSCRIPTION_EXPIRES_28TH_MONTHLY',
        'BLACKLIST_AFTER_2_MONTHS_DEFAULT'
    ];

    // Check required rules exist
    const engine = new BiRuleEngine();
    requiredRules.forEach(ruleId => {
        const rule = engine.findRule(ruleId);
        if (!rule) {
            errors.push(`Required rule ${ruleId} not found`);
        }
    });

    // Check validators exist
    const requiredValidators = [
        'validateCountryIsolation',
        'validateLenderSubscription',
        'validateLoanTerms',
        'validateTransaction'
    ];

    requiredValidators.forEach(validator => {
        if (!BI_RULES.validators[validator]) {
            errors.push(`Required validator ${validator} not found`);
        }
    });

    return errors;
};

// Export the rules and engine
module.exports = BI_RULES;
module.exports.RuleEngine = BiRuleEngine;
module.exports.validateRules = validateRules;

// Export helper functions
module.exports.helpers = {
    getRule: (ruleId) => {
        const engine = new BiRuleEngine();
        return engine.findRule(ruleId);
    },
    
    checkCompliance: (action, context) => {
        const engine = new BiRuleEngine();
        return engine.can(context.user, action, context);
    },
    
    validateLoan: (loanData) => {
        const engine = new BiRuleEngine();
        return engine.validateRule('LOAN_DURATION_7_DAYS', { loan: loanData });
    },
    
    generateComplianceCertificate: () => {
        const engine = new BiRuleEngine();
        const validationErrors = validateRules();
        
        return {
            certificateId: `BI-RULES-CERT-${Date.now()}`,
            issued: new Date().toISOString(),
            country: 'Burundi',
            version: BI_RULES.versioning.currentVersion,
            status: validationErrors.length === 0 ? 'compliant' : 'non-compliant',
            validationErrors,
            ruleCount: engine.countRules(),
            validators: Object.keys(BI_RULES.validators).length
        };
    }
};

// Export initialization function
module.exports.initializeRules = () => {
    const validationErrors = validateRules();
    
    if (validationErrors.length > 0) {
        console.error(`❌ Burundi Rules Validation Errors:`);
        validationErrors.forEach(error => console.error(`   - ${error}`));
        throw new Error(`Burundi rules configuration invalid: ${validationErrors.join(', ')}`);
    }
    
    const engine = new BiRuleEngine();
    const ruleCount = engine.countRules();
    
    console.log(`✅ Burundi Rules Engine Initialized`);
    console.log(`   Version: ${BI_RULES.versioning.currentVersion}`);
    console.log(`   Total Rules: ${ruleCount}`);
    console.log(`   Validators: ${Object.keys(BI_RULES.validators).length}`);
    console.log(`   Enforcement Actions: ${Object.keys(BI_RULES.enforcementActions).length}`);
    
    return {
        status: 'initialized',
        country: 'Burundi',
        ruleEngine: 'active',
        ruleCount,
        timestamp: new Date().toISOString(),
        checksum: Buffer.from(JSON.stringify(BI_RULES)).toString('base64').slice(0, 32)
    };
};

// Auto-initialize when imported
if (require.main === module) {
    module.exports.initializeRules();
}