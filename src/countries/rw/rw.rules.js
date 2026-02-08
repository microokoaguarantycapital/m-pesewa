/**
 * M-PESEWA RWANDA RULES ENGINE
 * Strict enforcement of Rwanda-specific business rules and hierarchy
 * Last Updated: 2024-01-24
 * Version: 1.0.0
 */

const RwandaRules = {
    // ============================================
    // 1️⃣ GLOBAL HIERARCHY ENFORCEMENT (STRICT)
    // ============================================
    hierarchy: {
        // STRICT: Global → Country → Groups → Lenders → Borrowers (Ledgers)
        levels: [
            {
                level: "global",
                name: "Global Platform",
                rules: ["Platform-wide settings", "International compliance"]
            },
            {
                level: "country",
                name: "Rwanda",
                rules: [
                    "Rwandan regulations only",
                    "BNR compliance",
                    "Data localization",
                    "RWF currency only"
                ]
            },
            {
                level: "groups",
                name: "Trusted Groups",
                rules: [
                    "Minimum 5 members",
                    "Maximum 1000 members",
                    "Country-locked",
                    "Invitation/referral only"
                ]
            },
            {
                level: "lenders",
                name: "Lenders",
                rules: [
                    "Subscription required",
                    "Lend within group only",
                    "Unlimited ledgers",
                    "Rating system"
                ]
            },
            {
                level: "borrowers",
                name: "Borrowers",
                rules: [
                    "Maximum 4 groups",
                    "Good rating required",
                    "No subscription fees",
                    "Can also be lenders"
                ]
            },
            {
                level: "ledgers",
                name: "Loan Ledgers",
                rules: [
                    "Auto-generated on approval",
                    "One ledger per borrower per lender",
                    "Manual updates by lender",
                    "Admin override possible"
                ]
            }
        ],

        // Validation methods for each hierarchy level
        validate: {
            // Validate country isolation
            isCountryIsolated: function(userCountry, transactionCountry) {
                return userCountry === transactionCountry;
            },

            // Validate group isolation
            isGroupIsolated: function(lenderGroupId, borrowerGroupId) {
                return lenderGroupId === borrowerGroupId;
            },

            // Validate user is in correct hierarchy level
            isUserInCorrectLevel: function(user, requiredLevel) {
                const userLevel = this.getUserLevel(user);
                return userLevel === requiredLevel;
            },

            // Get user's hierarchy level
            getUserLevel: function(user) {
                if (user.role === "admin") return "global";
                if (user.country && !user.groupId) return "country";
                if (user.groupId && user.role === "lender") return "lenders";
                if (user.groupId && user.role === "borrower") return "borrowers";
                return "unknown";
            },

            // Check if hierarchy chain is intact
            isHierarchyIntact: function(transaction) {
                const checks = [
                    this.isCountryIsolated(transaction.lenderCountry, transaction.borrowerCountry),
                    this.isGroupIsolated(transaction.lenderGroupId, transaction.borrowerGroupId),
                    transaction.lenderRole === "lender",
                    transaction.borrowerRole === "borrower"
                ];

                return checks.every(check => check === true);
            }
        },

        // Hierarchy violation handling
        violations: {
            countryIsolation: {
                code: "HIERARCHY_001",
                message: "Cross-country transactions are prohibited",
                severity: "critical",
                action: "block_transaction",
                notification: ["user", "admin", "compliance"]
            },

            groupIsolation: {
                code: "HIERARCHY_002",
                message: "Lenders can only lend within their group",
                severity: "critical",
                action: "block_transaction",
                notification: ["user", "group_admin"]
            },

            maxGroupsViolation: {
                code: "HIERARCHY_003",
                message: "Borrowers can only join up to 4 groups",
                severity: "high",
                action: "block_join_request",
                notification: ["user"]
            }
        }
    },

    // ============================================
    // 2️⃣ LENDING RULES ENFORCEMENT
    // ============================================
    lending: {
        // STRICT: Loan terms and conditions
        terms: {
            duration: {
                maxDays: 7,
                minDays: 1,
                defaultDays: 7,
                validate: function(days) {
                    return days >= this.minDays && days <= this.maxDays;
                }
            },

            interest: {
                rate: 0.10, // 10%
                calculate: function(principal, days = 7) {
                    const weeklyRate = this.rate;
                    return Math.ceil(principal * weeklyRate);
                },
                validate: function(proposedRate) {
                    return proposedRate <= 0.10; // Cannot exceed 10%
                }
            },

            penalties: {
                dailyRate: 0.05, // 5% daily after 7 days
                gracePeriod: 0, // No grace period
                calculate: function(principal, overdueDays) {
                    if (overdueDays <= 7) return 0;
                    const penaltyDays = overdueDays - 7;
                    return Math.ceil(principal * this.dailyRate * penaltyDays);
                }
            },

            default: {
                period: 60, // days (2 months)
                isInDefault: function(overdueDays) {
                    return overdueDays >= this.period;
                },
                consequences: [
                    "Blacklist badge applied",
                    "Cannot borrow from any group",
                    "Cannot join new groups",
                    "Visible to all lenders in country"
                ]
            }
        },

        // Subscription-based lending limits
        subscriptionLimits: {
            basic: {
                weekly: 1500,
                monthly: 6000,
                validate: function(amount) {
                    return amount <= this.weekly;
                }
            },

            premium: {
                weekly: 5000,
                monthly: 20000,
                validate: function(amount) {
                    return amount <= this.weekly;
                }
            },

            super: {
                weekly: 20000,
                monthly: 80000,
                validate: function(amount) {
                    return amount <= this.weekly;
                }
            },

            lenderOfLenders: {
                weekly: 50000,
                monthly: 200000,
                validate: function(amount) {
                    return amount <= this.weekly;
                }
            },

            // Get limit for subscription tier
            getLimit: function(tier, period = "weekly") {
                const tierLimits = this[tier];
                if (!tierLimits) return 0;
                return tierLimits[period] || tierLimits.weekly;
            },

            // Validate amount against tier limit
            validateAmount: function(amount, tier, period = "weekly") {
                const limit = this.getLimit(tier, period);
                return amount <= limit;
            }
        },

        // Loan approval rules
        approval: {
            requiredChecks: [
                "borrower_in_same_group",
                "borrower_rating_acceptable",
                "lender_subscription_active",
                "lender_within_limits",
                "borrower_not_blacklisted",
                "borrower_under_max_groups"
            ],

            autoApproveConditions: [
                "borrower_rating >= 4",
                "previous_loans_repaid_on_time",
                "loan_amount <= 5000",
                "lender_preapproval_enabled"
            ],

            manualReviewConditions: [
                "borrower_rating < 3",
                "previous_default_exists",
                "loan_amount > 10000",
                "new_borrower_first_loan"
            ],

            // Check if loan can be auto-approved
            canAutoApprove: function(loanRequest, borrowerHistory, lenderSettings) {
                const conditions = this.autoApproveConditions;
                let passed = 0;
                let total = conditions.length;

                // Check each condition
                if (borrowerHistory.rating >= 4) passed++;
                if (borrowerHistory.repaymentRate >= 0.95) passed++;
                if (loanRequest.amount <= 5000) passed++;
                if (lenderSettings.autoApprove) passed++;

                return passed >= 3; // Must pass at least 3 out of 4
            }
        }
    },

    // ============================================
    // 3️⃣ BORROWING RULES ENFORCEMENT
    // ============================================
    borrowing: {
        // Borrower eligibility criteria
        eligibility: {
            age: {
                minimum: 18,
                validate: function(birthDate) {
                    const age = this.calculateAge(birthDate);
                    return age >= this.minimum;
                },
                calculateAge: function(birthDate) {
                    const today = new Date();
                    const birth = new Date(birthDate);
                    let age = today.getFullYear() - birth.getFullYear();
                    const monthDiff = today.getMonth() - birth.getMonth();
                    
                    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
                        age--;
                    }
                    
                    return age;
                }
            },

            residency: {
                required: true,
                validate: function(nationalId) {
                    // Rwanda National ID format: 1xxxxxxxxxxxxxx (16 digits)
                    const rwandaIDRegex = /^1\d{15}$/;
                    return rwandaIDRegex.test(nationalId);
                }
            },

            mobileMoney: {
                required: true,
                validate: function(phoneNumber) {
                    // Rwanda phone number validation
                    const rwandaRegex = /^(\+250|250|0)?(7[238])\d{7}$/;
                    return rwandaRegex.test(phoneNumber);
                }
            },

            // Comprehensive eligibility check
            checkEligibility: function(borrowerData) {
                const checks = {
                    age: this.age.validate(borrowerData.birthDate),
                    residency: this.residency.validate(borrowerData.nationalId),
                    mobileMoney: this.mobileMoney.validate(borrowerData.phone),
                    notBlacklisted: !borrowerData.isBlacklisted
                };

                const passed = Object.values(checks).filter(Boolean).length;
                const total = Object.keys(checks).length;

                return {
                    eligible: passed === total,
                    checks: checks,
                    score: (passed / total) * 100
                };
            }
        },

        // Group membership rules
        groupMembership: {
            maxGroups: 4,
            minRatingForNewGroup: 3.5, // stars
            coolOffPeriod: 30, // days between group changes

            // Check if borrower can join new group
            canJoinGroup: function(borrower, targetGroup) {
                const checks = [
                    borrower.groups.length < this.maxGroups,
                    borrower.rating >= this.minRatingForNewGroup,
                    !this.hasRecentGroupChange(borrower),
                    !borrower.isBlacklisted,
                    targetGroup.country === borrower.country
                ];

                return checks.every(check => check === true);
            },

            // Check for recent group changes
            hasRecentGroupChange: function(borrower) {
                if (!borrower.lastGroupChange) return false;
                
                const lastChange = new Date(borrower.lastGroupChange);
                const today = new Date();
                const daysDiff = Math.floor((today - lastChange) / (1000 * 60 * 60 * 24));
                
                return daysDiff < this.coolOffPeriod;
            },

            // Validate group switch
            validateGroupSwitch: function(borrower, fromGroup, toGroup) {
                return {
                    allowed: this.canJoinGroup(borrower, toGroup),
                    reason: this.canJoinGroup(borrower, toGroup) ? 
                        "Eligible for group switch" : 
                        "Not eligible for group switch",
                    conditions: [
                        `Maximum groups: ${borrower.groups.length}/${this.maxGroups}`,
                        `Minimum rating: ${borrower.rating}/${this.minRatingForNewGroup}`,
                        `Cool-off period: ${this.hasRecentGroupChange(borrower) ? 'Active' : 'Inactive'}`,
                        `Blacklisted: ${borrower.isBlacklisted ? 'Yes' : 'No'}`
                    ]
                };
            }
        },

        // Concurrent borrowing limits
        concurrent: {
            maxActiveLoansPerGroup: 1,
            maxTotalActiveLoans: 4,

            // Check if borrower can request new loan
            canRequestNewLoan: function(borrower, requestedGroup) {
                const activeLoansInGroup = borrower.loans.filter(
                    loan => loan.groupId === requestedGroup.id && loan.status === 'active'
                ).length;

                const totalActiveLoans = borrower.loans.filter(
                    loan => loan.status === 'active'
                ).length;

                return {
                    allowed: activeLoansInGroup < this.maxActiveLoansPerGroup && 
                            totalActiveLoans < this.maxTotalActiveLoans,
                    activeInGroup: activeLoansInGroup,
                    activeTotal: totalActiveLoans,
                    limitInGroup: this.maxActiveLoansPerGroup,
                    limitTotal: this.maxTotalActiveLoans
                };
            }
        }
    },

    // ============================================
    // 4️⃣ SUBSCRIPTION RULES ENFORCEMENT
    // ============================================
    subscriptions: {
        // STRICT: Subscription expiry and access control
        expiry: {
            dayOfMonth: 28,
            gracePeriod: 0, // No grace period - immediate block
            autoRenewal: true,

            // Check if subscription is active
            isActive: function(subscription) {
                if (!subscription) return false;
                
                const today = new Date();
                const expiryDate = new Date(subscription.expiryDate);
                
                return today <= expiryDate;
            },

            // Calculate expiry date
            calculateExpiryDate: function(startDate, period) {
                const start = new Date(startDate);
                let expiry = new Date(start);
                
                switch(period) {
                    case 'monthly':
                        expiry.setMonth(expiry.getMonth() + 1);
                        // Set to 28th of the month
                        expiry.setDate(this.dayOfMonth);
                        break;
                    case 'biAnnual':
                        expiry.setMonth(expiry.getMonth() + 6);
                        break;
                    case 'annual':
                        expiry.setFullYear(expiry.getFullYear() + 1);
                        break;
                    default:
                        expiry.setMonth(expiry.getMonth() + 1);
                }
                
                return expiry;
            },

            // Check days until expiry
            daysUntilExpiry: function(subscription) {
                if (!subscription) return 0;
                
                const today = new Date();
                const expiryDate = new Date(subscription.expiryDate);
                const diffTime = expiryDate - today;
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                
                return Math.max(0, diffDays);
            }
        },

        // Subscription tier rules
        tiers: {
            basic: {
                name: "Basic",
                maxLoan: 1500,
                crbCheck: false,
                ledgerLimit: 1500,
                features: ["basic_lending", "group_access"]
            },

            premium: {
                name: "Premium",
                maxLoan: 5000,
                crbCheck: false,
                ledgerLimit: 10000,
                features: ["advanced_analytics", "priority_support", "risk_tools"]
            },

            super: {
                name: "Super",
                maxLoan: 20000,
                crbCheck: true, // CRB check required
                ledgerLimit: 20000,
                features: ["crb_integration", "premium_support", "advanced_risk"]
            },

            lenderOfLenders: {
                name: "Lender of Lenders",
                maxLoan: 50000,
                crbCheck: true,
                ledgerLimit: 50000,
                features: ["custom_terms", "extended_periods", "wholesale_lending"]
            },

            // Validate tier upgrade
            canUpgrade: function(currentTier, targetTier) {
                const tierOrder = ["basic", "premium", "super", "lenderOfLenders"];
                const currentIndex = tierOrder.indexOf(currentTier);
                const targetIndex = tierOrder.indexOf(targetTier);
                
                if (currentIndex === -1 || targetIndex === -1) return false;
                return targetIndex > currentIndex;
            },

            // Get tier requirements
            getRequirements: function(tier) {
                const requirements = {
                    basic: ["national_id", "phone_verification"],
                    premium: ["basic_requirements", "proof_of_income"],
                    super: ["premium_requirements", "crb_clearance", "bank_statement"],
                    lenderOfLenders: ["super_requirements", "business_registration", "tax_clearance"]
                };
                
                return requirements[tier] || [];
            }
        },

        // Payment validation
        payments: {
            validatePayment: function(payment) {
                const checks = [
                    payment.amount > 0,
                    this.isValidPaymentMethod(payment.method),
                    this.isWithinLimits(payment.amount, payment.method),
                    payment.currency === "RWF"
                ];
                
                return checks.every(check => check === true);
            },

            isValidPaymentMethod: function(method) {
                const validMethods = ["mtn", "airtel", "bank_transfer", "cash_deposit"];
                return validMethods.includes(method);
            },

            isWithinLimits: function(amount, method) {
                const limits = {
                    mtn: { min: 100, max: 5000000 },
                    airtel: { min: 100, max: 3000000 },
                    bank_transfer: { min: 500, max: 10000000 },
                    cash_deposit: { min: 500, max: 5000000 }
                };
                
                const limit = limits[method];
                if (!limit) return false;
                
                return amount >= limit.min && amount <= limit.max;
            }
        }
    },

    // ============================================
    // 5️⃣ REPUTATION & BLACKLIST SYSTEM
    // ============================================
    reputation: {
        // 5-star rating system
        rating: {
            scale: 5,
            defaultRating: 3,
            updateFrequency: "after_repayment",

            // Calculate new rating
            calculateNewRating: function(currentRating, newScore, weight = 0.3) {
                // Weighted average: 70% old rating, 30% new score
                return (currentRating * (1 - weight)) + (newScore * weight);
            },

            // Rating thresholds
            thresholds: {
                excellent: 4.5,
                good: 4.0,
                average: 3.0,
                poor: 2.0,
                bad: 1.0
            },

            // Get rating category
            getCategory: function(rating) {
                if (rating >= this.thresholds.excellent) return "excellent";
                if (rating >= this.thresholds.good) return "good";
                if (rating >= this.thresholds.average) return "average";
                if (rating >= this.thresholds.poor) return "poor";
                return "bad";
            },

            // Rating impact on borrowing
            getBorrowingImpact: function(rating) {
                const category = this.getCategory(rating);
                
                const impacts = {
                    excellent: {
                        maxGroups: 4,
                        approvalRate: 0.95,
                        interestDiscount: 0.02 // 2% discount
                    },
                    good: {
                        maxGroups: 4,
                        approvalRate: 0.85,
                        interestDiscount: 0.01 // 1% discount
                    },
                    average: {
                        maxGroups: 3,
                        approvalRate: 0.70,
                        interestDiscount: 0
                    },
                    poor: {
                        maxGroups: 2,
                        approvalRate: 0.40,
                        interestDiscount: 0
                    },
                    bad: {
                        maxGroups: 1,
                        approvalRate: 0.10,
                        interestDiscount: 0
                    }
                };
                
                return impacts[category] || impacts.average;
            }
        },

        // Blacklist system
        blacklist: {
            triggerConditions: [
                "default_beyond_60_days",
                "multiple_overdue_loans",
                "fraudulent_activity",
                "identity_theft"
            ],

            consequences: [
                "cannot_borrow",
                "cannot_join_new_groups",
                "visible_on_public_blacklist",
                "reported_to_crb"
            ],

            // Check if user should be blacklisted
            shouldBlacklist: function(borrower) {
                const overdueLoans = borrower.loans.filter(loan => 
                    loan.status === 'overdue' && loan.daysOverdue >= 60
                );
                
                const multipleOverdue = borrower.loans.filter(loan => 
                    loan.status === 'overdue'
                ).length >= 3;
                
                return overdueLoans.length > 0 || multipleOverdue || borrower.fraudFlag;
            },

            // Removal conditions
            removalConditions: [
                "full_repayment_completed",
                "admin_approval_received",
                "waiting_period_30_days",
                "new_guarantors_provided"
            ],

            // Check if can be removed from blacklist
            canRemoveFromBlacklist: function(blacklistedUser) {
                const conditions = [
                    blacklistedUser.fullRepaymentCompleted,
                    blacklistedUser.adminApproval,
                    blacklistedUser.waitingPeriodCompleted,
                    blacklistedUser.hasNewGuarantors
                ];
                
                return conditions.every(condition => condition === true);
            }
        }
    },

    // ============================================
    // 6️⃣ LEDGER MANAGEMENT RULES
    // ============================================
    ledgers: {
        // Ledger creation rules
        creation: {
            autoCreate: true,
            requiredFields: [
                "borrower_name",
                "borrower_contact",
                "loan_amount",
                "interest_rate",
                "due_date",
                "guarantor_1",
                "guarantor_2"
            ],

            // Validate ledger data
            validate: function(ledgerData) {
                const missingFields = this.requiredFields.filter(
                    field => !ledgerData[field] || ledgerData[field].toString().trim() === ''
                );
                
                return {
                    valid: missingFields.length === 0,
                    missingFields: missingFields
                };
            }
        },

        // Ledger update rules
        updates: {
            whoCanUpdate: ["lender", "admin"],
            updateFrequency: "as_needed",
            auditRequired: true,

            // Validate update
            validateUpdate: function(oldData, newData, updaterRole) {
                const allowedChanges = {
                    lender: ["repayment_status", "notes", "penalty_amount"],
                    admin: ["all_fields"]
                };
                
                const changes = this.getChangedFields(oldData, newData);
                const allowed = allowedChanges[updaterRole] || [];
                
                if (allowed[0] === "all_fields") {
                    return { allowed: true, changes: changes };
                }
                
                const unauthorizedChanges = changes.filter(
                    change => !allowed.includes(change.field)
                );
                
                return {
                    allowed: unauthorizedChanges.length === 0,
                    unauthorizedChanges: unauthorizedChanges
                };
            },

            // Get changed fields
            getChangedFields: function(oldData, newData) {
                const changes = [];
                
                for (const key in newData) {
                    if (oldData[key] !== newData[key]) {
                        changes.push({
                            field: key,
                            oldValue: oldData[key],
                            newValue: newData[key]
                        });
                    }
                }
                
                return changes;
            }
        },

        // Ledger closure rules
        closure: {
            conditions: [
                "full_repayment_received",
                "no_outstanding_amount",
                "lender_confirmation",
                "borrower_rating_updated"
            ],

            // Check if ledger can be closed
            canClose: function(ledger) {
                const conditions = [
                    ledger.balance === 0,
                    ledger.lastPaymentDate !== null,
                    !ledger.disputeActive,
                    ledger.status === "active"
                ];
                
                return conditions.every(condition => condition === true);
            },

            // Auto-closure settings
            autoClose: {
                enabled: true,
                daysAfterCompletion: 7,
                conditions: ["no_dispute", "full_payment", "rating_updated"]
            }
        }
    },

    // ============================================
    // 7️⃣ DISPUTE RESOLUTION RULES
    // ============================================
    disputes: {
        // Dispute initiation rules
        initiation: {
            whoCanInitiate: ["borrower", "lender", "group_admin"],
            timeLimit: 14, // days after transaction
            validReasons: [
                "incorrect_amount",
                "unauthorized_transaction",
                "service_not_provided",
                "fraudulent_activity"
            ],

            // Validate dispute initiation
            validate: function(disputeData, transactionDate) {
                const daysSinceTransaction = Math.floor(
                    (new Date() - new Date(transactionDate)) / (1000 * 60 * 60 * 24)
                );
                
                const checks = [
                    daysSinceTransaction <= this.timeLimit,
                    this.validReasons.includes(disputeData.reason),
                    disputeData.evidence.length > 0,
                    !disputeData.isDuplicate
                ];
                
                return checks.every(check => check === true);
            }
        },

        // Resolution process
        resolution: {
            steps: [
                {
                    step: 1,
                    name: "Direct Negotiation",
                    duration: 3, // days
                    participants: ["borrower", "lender"]
                },
                {
                    step: 2,
                    name: "Group Admin Mediation",
                    duration: 2, // days
                    participants: ["group_admin", "both_parties"]
                },
                {
                    step: 3,
                    name: "Platform Intervention",
                    duration: 2, // days
                    participants: ["support_team", "both_parties"]
                },
                {
                    step: 4,
                    name: "External Arbitration",
                    duration: 7, // days
                    participants: ["rural", "legal_team"]
                }
            ],

            // Get next step
            getNextStep: function(currentStep) {
                const currentIndex = this.steps.findIndex(step => step.step === currentStep);
                return this.steps[currentIndex + 1] || null;
            },

            // Check if can escalate
            canEscalate: function(currentStep, daysInStep) {
                const stepConfig = this.steps.find(step => step.step === currentStep);
                if (!stepConfig) return false;
                
                return daysInStep >= stepConfig.duration;
            }
        },

        // Arbitration rules
        arbitration: {
            whoCanArbitrate: ["platform_admin", "designated_arbitrator"],
            decisionFinal: true,
            appealProcess: "none",

            // Arbitration criteria
            criteria: [
                "evidence_quality",
                "contract_terms",
                "past_behavior",
                "regulatory_compliance"
            ],

            // Calculate resolution
            calculateResolution: function(dispute, evidence) {
                let borrowerScore = 0;
                let lenderScore = 0;
                
                // Score evidence quality
                evidence.forEach(item => {
                    if (item.submittedBy === "borrower") borrowerScore += item.weight || 1;
                    if (item.submittedBy === "lender") lenderScore += item.weight || 1;
                });
                
                // Consider past behavior
                if (dispute.borrower.rating >= 4) borrowerScore += 2;
                if (dispute.lender.rating >= 4) lenderScore += 2;
                
                return {
                    winner: borrowerScore > lenderScore ? "borrower" : "lender",
                    borrowerScore: borrowerScore,
                    lenderScore: lenderScore,
                    margin: Math.abs(borrowerScore - lenderScore)
                };
            }
        }
    },

    // ============================================
    // 8️⃣ COMPLIANCE & REGULATORY RULES
    // ============================================
    compliance: {
        // BNR (National Bank of Rwanda) compliance
        bnr: {
            reporting: {
                frequency: "monthly",
                deadline: "10th_of_following_month",
                requiredData: [
                    "total_transaction_volume",
                    "number_of_active_users",
                    "default_rates",
                    "complaints_received",
                    "fraud_cases"
                ]
            },

            limits: {
                maxIndividualLoan: 50000, // RWF
                maxPlatformVolume: 1000000000, // 1 billion RWF
                reserveRequirements: 0.10 // 10% reserve
            },

            // Check BNR compliance
            checkCompliance: function(platformData) {
                const violations = [];
                
                if (platformData.totalVolume > this.limits.maxPlatformVolume) {
                    violations.push("Platform volume exceeds BNR limit");
                }
                
                if (platformData.reserveRatio < this.limits.reserveRequirements) {
                    violations.push("Reserve requirements not met");
                }
                
                return {
                    compliant: violations.length === 0,
                    violations: violations,
                    lastCheck: new Date().toISOString()
                };
            }
        },

        // AML/CFT (Anti-Money Laundering) rules
        aml: {
            monitoringThresholds: {
                singleTransaction: 1000000, // 1 million RWF
                dailyTotal: 5000000, // 5 million RWF
                monthlyTotal: 20000000 // 20 million RWF
            },

            suspiciousPatterns: [
                "structured_transactions",
                "rapid_fund_movement",
                "unusual_amounts",
                "geographic_anomalies"
            ],

            // Check for suspicious activity
            checkSuspiciousActivity: function(transaction, userHistory) {
                const alerts = [];
                
                // Check single transaction threshold
                if (transaction.amount >= this.monitoringThresholds.singleTransaction) {
                    alerts.push("Large single transaction");
                }
                
                // Check for structuring
                if (this.isStructuring(transaction, userHistory)) {
                    alerts.push("Possible transaction structuring");
                }
                
                // Check geographic anomalies
                if (this.hasGeographicAnomalies(transaction, userHistory)) {
                    alerts.push("Geographic anomaly detected");
                }
                
                return {
                    suspicious: alerts.length > 0,
                    alerts: alerts,
                    riskLevel: this.calculateRiskLevel(alerts.length)
                };
            },

            isStructuring: function(transaction, userHistory) {
                // Check if multiple transactions just below threshold
                const recentTransactions = userHistory.transactions.slice(-10);
                const nearThreshold = recentTransactions.filter(t => 
                    t.amount >= 900000 && t.amount < 1000000
                );
                
                return nearThreshold.length >= 3;
            },

            hasGeographicAnomalies: function(transaction, userHistory) {
                // Check if transaction location differs from user's usual pattern
                const usualLocation = userHistory.mostCommonLocation;
                return usualLocation && transaction.location !== usualLocation;
            },

            calculateRiskLevel: function(alertCount) {
                if (alertCount >= 3) return "high";
                if (alertCount >= 1) return "medium";
                return "low";
            }
        },

        // Data protection (Rwanda Data Protection Law)
        dataProtection: {
            retentionPeriods: {
                userData: 3650, // 10 years
                transactionData: 7300, // 20 years
                logs: 180 // 6 months
            },

            consentRequirements: [
                "explicit_consent_required",
                "purpose_limitation",
                "data_minimization",
                "storage_limitation"
            ],

            // Check data protection compliance
            checkCompliance: function(dataPractices) {
                const issues = [];
                
                if (!dataPractices.userConsent) {
                    issues.push("User consent not obtained");
                }
                
                if (dataPractices.dataRetention > this.retentionPeriods.userData) {
                    issues.push("Data retention exceeds legal limits");
                }
                
                if (!dataPractices.dataLocalized) {
                    issues.push("Data not localized within Rwanda");
                }
                
                return {
                    compliant: issues.length === 0,
                    issues: issues
                };
            }
        }
    },

    // ============================================
    // 9️⃣ RULE ENFORCEMENT ENGINE
    // ============================================
    enforcement: {
        // Rule violation detection
        detectViolations: function(action, context) {
            const violations = [];
            
            // Check hierarchy violations
            if (action.type === 'transaction') {
                const hierarchyCheck = this.hierarchy.validate.isHierarchyIntact(context.transaction);
                if (!hierarchyCheck) {
                    violations.push(this.hierarchy.violations.countryIsolation);
                }
            }
            
            // Check subscription violations
            if (action.type === 'lending' && context.lender) {
                const subscriptionActive = this.subscriptions.expiry.isActive(context.lender.subscription);
                if (!subscriptionActive) {
                    violations.push({
                        code: "SUBSCRIPTION_001",
                        message: "Lender subscription is expired",
                        severity: "critical",
                        action: "block_lending"
                    });
                }
            }
            
            // Check borrowing limits
            if (action.type === 'borrowing' && context.borrower) {
                const borrowingCheck = this.borrowing.concurrent.canRequestNewLoan(context.borrower, context.group);
                if (!borrowingCheck.allowed) {
                    violations.push({
                        code: "BORROWING_001",
                        message: "Borrower has reached concurrent loan limits",
                        severity: "high",
                        action: "block_borrowing"
                    });
                }
            }
            
            return violations;
        },
        
        // Apply enforcement actions
        applyEnforcement: function(violations, user) {
            const actions = [];
            
            violations.forEach(violation => {
                switch(violation.action) {
                    case 'block_transaction':
                        actions.push({
                            type: 'block',
                            target: 'transaction',
                            duration: 'permanent',
                            reason: violation.message
                        });
                        break;
                        
                    case 'block_lending':
                        actions.push({
                            type: 'block',
                            target: 'lending',
                            duration: 'until_subscription_renewed',
                            reason: violation.message
                        });
                        break;
                        
                    case 'block_borrowing':
                        actions.push({
                            type: 'block',
                            target: 'borrowing',
                            duration: 'until_loans_repaid',
                            reason: violation.message
                        });
                        break;
                        
                    case 'notify':
                        actions.push({
                            type: 'notify',
                            recipients: violation.notification || ['user'],
                            message: violation.message
                        });
                        break;
                }
            });
            
            return actions;
        },
        
        // Log enforcement actions
        logEnforcement: function(userId, violations, actions) {
            const logEntry = {
                timestamp: new Date().toISOString(),
                userId: userId,
                violations: violations.map(v => ({
                    code: v.code,
                    message: v.message,
                    severity: v.severity
                })),
                actions: actions,
                resolved: false
            };
            
            // Store in localStorage for demo (in production, this would go to a server)
            if (typeof localStorage !== 'undefined') {
                const enforcementLogs = JSON.parse(localStorage.getItem('mpesewa_enforcement_logs') || '[]');
                enforcementLogs.push(logEntry);
                localStorage.setItem('mpesewa_enforcement_logs', JSON.stringify(enforcementLogs));
            }
            
            return logEntry;
        }
    },

    // ============================================
    // 🔟 RULE VALIDATION & TESTING
    // ============================================
    validation: {
        // Validate all rules
        validateAllRules: function() {
            const results = [];
            
            // Test hierarchy rules
            const hierarchyTest = this.testHierarchyRules();
            results.push({
                category: "hierarchy",
                passed: hierarchyTest.passed,
                tests: hierarchyTest.tests
            });
            
            // Test lending rules
            const lendingTest = this.testLendingRules();
            results.push({
                category: "lending",
                passed: lendingTest.passed,
                tests: lendingTest.tests
            });
            
            // Test subscription rules
            const subscriptionTest = this.testSubscriptionRules();
            results.push({
                category: "subscription",
                passed: subscriptionTest.passed,
                tests: subscriptionTest.tests
            });
            
            const allPassed = results.every(result => result.passed);
            
            return {
                allPassed: allPassed,
                results: results,
                timestamp: new Date().toISOString()
            };
        },
        
        // Test hierarchy rules
        testHierarchyRules: function() {
            const tests = [];
            
            // Test country isolation
            const countryTest = this.hierarchy.validate.isCountryIsolated('RW', 'RW');
            tests.push({
                name: "Country isolation - same country",
                passed: countryTest === true,
                expected: true,
                actual: countryTest
            });
            
            // Test group isolation
            const groupTest = this.hierarchy.validate.isGroupIsolated('group1', 'group1');
            tests.push({
                name: "Group isolation - same group",
                passed: groupTest === true,
                expected: true,
                actual: groupTest
            });
            
            return {
                passed: tests.every(test => test.passed),
                tests: tests
            };
        },
        
        // Test lending rules
        testLendingRules: function() {
            const tests = [];
            
            // Test interest calculation
            const interest = this.lending.terms.interest.calculate(1000, 7);
            tests.push({
                name: "Interest calculation - 10% of 1000",
                passed: interest === 100,
                expected: 100,
                actual: interest
            });
            
            // Test penalty calculation
            const penalty = this.lending.terms.penalties.calculate(1000, 10);
            tests.push({
                name: "Penalty calculation - 3 days overdue",
                passed: penalty === 150,
                expected: 150,
                actual: penalty
            });
            
            return {
                passed: tests.every(test => test.passed),
                tests: tests
            };
        },
        
        // Test subscription rules
        testSubscriptionRules: function() {
            const tests = [];
            
            // Test subscription active check
            const activeSubscription = {
                expiryDate: new Date(Date.now() + 86400000).toISOString() // Tomorrow
            };
            const isActive = this.subscriptions.expiry.isActive(activeSubscription);
            tests.push({
                name: "Subscription active - expiry in future",
                passed: isActive === true,
                expected: true,
                actual: isActive
            });
            
            // Test tier upgrade validation
            const canUpgrade = this.subscriptions.tiers.canUpgrade('basic', 'premium');
            tests.push({
                name: "Tier upgrade - basic to premium",
                passed: canUpgrade === true,
                expected: true,
                actual: canUpgrade
            });
            
            return {
                passed: tests.every(test => test.passed),
                tests: tests
            };
        },
        
        // Generate test report
        generateTestReport: function() {
            const validation = this.validateAllRules();
            
            return {
                platform: "M-Pesewa Rwanda",
                date: new Date().toISOString(),
                version: this.version.getVersion(),
                validation: validation,
                summary: {
                    totalTests: validation.results.reduce((sum, category) => sum + category.tests.length, 0),
                    passedTests: validation.results.reduce((sum, category) => 
                        sum + category.tests.filter(test => test.passed).length, 0),
                    failedTests: validation.results.reduce((sum, category) => 
                        sum + category.tests.filter(test => !test.passed).length, 0)
                }
            };
        }
    },

    // ============================================
    // 1️⃣1️⃣ INITIALIZATION & VERSION
    // ============================================
    init: function() {
        console.log('Rwanda Rules Engine Initialized');
        
        // Run initial validation
        const validationReport = this.validation.generateTestReport();
        console.log('Rules Validation Report:', validationReport);
        
        // Store rules version
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('mpesewa_rules_version', this.version.getVersion());
            localStorage.setItem('mpesewa_rules_country', 'RW');
        }
        
        return this;
    },

    version: {
        major: 1,
        minor: 0,
        patch: 0,
        build: '20240124',
        
        getVersion: function() {
            return `v${this.major}.${this.minor}.${this.patch}`;
        },
        
        isCompatible: function(requiredVersion) {
            const [reqMajor, reqMinor] = requiredVersion.split('.').map(Number);
            return this.major >= reqMajor && this.minor >= reqMinor;
        }
    }
};

// Auto-initialize
RwandaRules.init();

// Export module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RwandaRules;
} else if (typeof window !== 'undefined') {
    window.RwandaRules = RwandaRules;
}

// Add to global M-Pesewa object
if (typeof window !== 'undefined' && window.MPesewa) {
    window.MPesewa.RwandaRules = RwandaRules;
}

// Add helper functions to window
if (typeof window !== 'undefined') {
    window.validateTransactionRW = function(transaction) {
        return RwandaRules.enforcement.detectViolations(
            { type: 'transaction' },
            { transaction: transaction }
        );
    };
    
    window.checkBorrowerEligibilityRW = function(borrowerData) {
        return RwandaRules.borrowing.eligibility.checkEligibility(borrowerData);
    };
    
    window.calculateLoanTermsRW = function(principal, days = 7) {
        const interest = RwandaRules.lending.terms.interest.calculate(principal, days);
        const total = principal + interest;
        const daily = Math.ceil(total / days);
        
        return {
            principal: principal,
            interest: interest,
            total: total,
            daily: daily,
            dueDate: new Date(Date.now() + days * 86400000)
        };
    };
}