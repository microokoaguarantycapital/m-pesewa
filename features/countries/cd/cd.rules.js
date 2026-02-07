/**
 * M-PESEWA DRC BUSINESS RULES
 * STRICT BUSINESS RULES ENFORCEMENT FOR DEMOCRATIC REPUBLIC OF CONGO
 * Last Updated: 2026-01-24
 */

const DRC_RULES = {
    // ============================================
    // 1️⃣ GLOBAL HIERARCHY ENFORCEMENT
    // ============================================
    HIERARCHY: {
        // Level 1: Global
        GLOBAL: {
            RULES: [
                'Brand Standards Must Be Maintained',
                'Core Technology Stack Cannot Be Modified',
                'Security Protocols Are Mandatory',
                'Global Admin Has Ultimate Authority'
            ],
            
            ENFORCEMENT: {
                OVERRIDE_LEVEL: 'GLOBAL_ADMIN_ONLY',
                ESCALATION_PATH: 'COUNTRY_ADMIN → GLOBAL_ADMIN',
                AUDIT_TRAIL: 'MANDATORY_FOR_ALL_OVERRIDES'
            }
        },
        
        // Level 2: Country (DRC)
        COUNTRY: {
            RULES: [
                'STRICT_COUNTRY_ISOLATION: No cross-border operations',
                'CURRENCY_ISOLATION: All transactions in CDF only',
                'LOCAL_COMPLIANCE: Must comply with DRC laws',
                'NO_FOREIGN_GROUPS: Groups cannot include non-DRC residents',
                'LOCAL_LICENSING: Platform must maintain DRC financial license'
            ],
            
            ENFORCEMENT: {
                GEO_FENCING: 'IP-based country detection',
                PHONE_VALIDATION: '+243 prefix required',
                ID_VALIDATION: 'DRC national ID formats only',
                CURRENCY_VALIDATION: 'CDF conversion rates locked'
            },
            
            VIOLATIONS: {
                CROSS_COUNTRY_ATTEMPT: {
                    SEVERITY: 'CRITICAL',
                    ACTION: 'ACCOUNT_SUSPENSION',
                    ESCALATION: 'IMMEDIATE_TO_GLOBAL_ADMIN',
                    PENALTY: 'PERMANENT_BAN'
                },
                
                CURRENCY_VIOLATION: {
                    SEVERITY: 'HIGH',
                    ACTION: 'TRANSACTION_REVERSAL',
                    ESCALATION: 'COUNTRY_ADMIN_REVIEW',
                    PENALTY: 'TEMPORARY_SUSPENSION'
                }
            }
        },
        
        // Level 3: Groups (Cercles de Confiance)
        GROUPS: {
            RULES: [
                'MINIMUM_SIZE: 5 members required for activation',
                'MAXIMUM_SIZE: 1000 members absolute limit',
                'INVITATION_ONLY: No public joining',
                'COUNTRY_LOCKED: DRC residents only',
                'ADMIN_REQUIRED: 1 admin/founder per group',
                'INTERNAL_RULES_ALLOWED: Groups can set own rules',
                'NO_CROSS_GROUP_LENDING: Lenders can only lend within their group'
            ],
            
            ENFORCEMENT: {
                SIZE_MONITORING: 'Real-time member count',
                INVITATION_VALIDATION: 'Referrer verification required',
                ADMIN_OVERRIDE: 'Group admin can remove members',
                ACTIVITY_REQUIREMENT: 'Minimum 1 transaction per 30 days'
            },
            
            VALIDATION: {
                MEMBER_LIMIT_CHECK: function(currentSize, newMembers) {
                    return currentSize + newMembers <= 1000;
                },
                
                ADMIN_VALIDATION: function(user) {
                    return user.age >= 21 && user.reputation >= 4.0 && user.monthsActive >= 3;
                },
                
                GROUP_CREATION: function(founder) {
                    return founder.reputation >= 3.5 && 
                           founder.identityVerified && 
                           founder.monthsActive >= 1;
                }
            }
        },
        
        // Level 4: Lenders (Prêteurs)
        LENDERS: {
            RULES: [
                'SUBSCRIPTION_REQUIRED: Active subscription mandatory',
                'TIER_LIMITS: Cannot lend above subscription tier',
                'GROUP_BOUNDED: Can only lend within approved groups',
                'LEDGER_RESPONSIBILITY: Must maintain accurate ledgers',
                'REPUTATION_MAINTENANCE: Must rate borrowers',
                'NO_AUTO_DISBURSEMENT: Manual disbursement outside platform',
                'SUBSCRIPTION_EXPIRY: Access blocked on 28th if unpaid'
            ],
            
            ENFORCEMENT: {
                SUBSCRIPTION_GATE: 'Block lending if subscription expired',
                TIER_ENFORCEMENT: 'Weekly limit tracking',
                GROUP_VALIDATION: 'Lender-borrower group match check',
                REPUTATION_ENFORCEMENT: 'Mandatory rating after repayment'
            },
            
            SUBSCRIPTION_RULES: {
                EXPIRY_DATE: '28th of each month',
                GRACE_PERIOD: 'NONE - immediate block',
                RENEWAL: 'Manual payment required',
                UPGRADE_DOWNGRADE: 'Immediate tier change, pro-rated charges',
                
                BLOCKED_ACTIONS: [
                    'NEW_LOAN_DISBURSEMENT',
                    'LEDGER_CREATION',
                    'BORROWER_RATING',
                    'GROUP_INVITATION'
                ],
                
                ALLOWED_ACTIONS: [
                    'VIEW_PORTFOLIO',
                    'RECEIVE_REPAYMENTS',
                    'CONTACT_SUPPORT',
                    'RENEW_SUBSCRIPTION'
                ]
            }
        },
        
        // Level 5: Borrowers (Emprunteurs)
        BORROWERS: {
            RULES: [
                'NO_SUBSCRIPTION: Borrowers pay no platform fees',
                'MAX_GROUPS: 4 groups maximum with good rating',
                'ONE_ACTIVE_LOAN: Only 1 active loan per group at a time',
                'REPAYMENT_TERM: 7 days maximum',
                'INTEREST_RATE: 10% fixed per week',
                'PENALTIES: 5% daily after 7 days',
                'BLACKLIST_THRESHOLD: 60 days overdue = automatic blacklist'
            ],
            
            ENFORCEMENT: {
                GROUP_LIMIT_TRACKING: 'Real-time group count',
                LOAN_QUEUE: 'One application per group at a time',
                REPUTATION_TRACKING: '5-star system with decay',
                BLACKLIST_AUTOMATION: 'Auto-trigger at 60 days'
            },
            
            ELIGIBILITY: {
                MIN_REPUTATION: 2.0,
                MAX_ACTIVE_LOANS: 4, // Across all groups
                MAX_OVERDUE_COUNT: 2,
                MIN_DAYS_SINCE_LAST_LOAN: 0,
                GROUP_SPECIFIC: 'Each group maintains separate eligibility'
            }
        },
        
        // Level 6: Ledgers (Registres)
        LEDGERS: {
            RULES: [
                'AUTO_CREATION: Generated on loan approval',
                'ONE_PER_BORROWER: Unique ledger per borrower-lender pair',
                'MANUAL_UPDATES: Lender responsible for updates',
                'ADMIN_OVERRIDE: Country admin can modify',
                'PERMANENT_RECORD: Never deleted, only archived',
                'REAL_TIME_STATUS: Active/Cleared status tracking',
                'INTEREST_CALCULATION: 10% weekly, pro-rated daily'
            ],
            
            ENFORCEMENT: {
                AUTO_GENERATION: 'Triggered by loan approval',
                STATUS_VALIDATION: 'Only lender can update status',
                AUDIT_TRAIL: 'All changes logged',
                ARCHIVAL_RULE: '30 days after clearance'
            },
            
            FIELDS_REQUIRED: [
                'borrowerName',
                'borrowerContact',
                'guarantor1',
                'guarantor2',
                'loanCategory',
                'amount',
                'dateBorrowed',
                'dueDate',
                'interestRate',
                'penaltyRate',
                'repaymentSchedule',
                'status'
            ]
        }
    },

    // ============================================
    // 2️⃣ LOAN RULES & CALCULATIONS
    // ============================================
    LOAN_RULES: {
        // Term Rules
        TERM: {
            MIN_DAYS: 1,
            MAX_DAYS: 7,
            DEFAULT_DAYS: 7,
            EXTENSION_ALLOWED: false,
            EARLY_REPAYMENT_ALLOWED: true,
            PARTIAL_REPAYMENTS_ALLOWED: true
        },
        
        // Amount Rules
        AMOUNT: {
            MIN_CDF: 500,
            MAX_BY_TIER: {
                BASIC: 3000,
                PREMIUM: 12000,
                SUPER: 48000,
                LENDER_OF_LENDERS: 120000
            },
            INCREMENTS: 100,
            DAILY_LIMIT_PER_LENDER: {
                BASIC: 3000,
                PREMIUM: 12000,
                SUPER: 48000,
                LENDER_OF_LENDERS: 120000
            },
            WEEKLY_LIMIT_PER_BORROWER: {
                BASIC: 3000,
                PREMIUM: 12000,
                SUPER: 48000,
                LENDER_OF_LENDERS: 120000
            }
        },
        
        // Interest Rules
        INTEREST: {
            RATE: 10, // Percentage per week
            CALCULATION: 'Daily pro-rata',
            COMPOUNDING: 'None - simple interest only',
            CAP: 'No maximum cap',
            MIN_INTEREST: 50, // Minimum 50 CDF
            TAXABLE: true,
            WITHHOLDING_TAX_RATE: 20 // Percentage for non-residents
        },
        
        // Penalty Rules
        PENALTY: {
            GRACE_PERIOD: 0, // No grace period
            DAILY_RATE: 5, // Percentage daily after day 7
            MAX_PENALTY: 'No maximum - compounds daily',
            CALCULATION: 'On outstanding principal + interest',
            APPLICATION: 'Automatic daily at 00:00 GMT+1',
            FORGIVENESS: 'Never - must be paid in full'
        },
        
        // Default Rules
        DEFAULT: {
            THRESHOLD_DAYS: 60,
            AUTOMATIC_BLACKLIST: true,
            BLACKLIST_DURATION: 'Until full repayment + admin approval',
            COLLECTION_PROCESS: 'Debt collector referral after 90 days',
            LEGAL_ACTION: 'Possible after 180 days',
            CREDIT_BUREAU_REPORTING: 'After 90 days default'
        },
        
        // Calculation Formulas
        FORMULAS: {
            calculateInterest: function(principal, days = 7) {
                const dailyRate = 0.10 / 7; // 10% weekly = daily rate
                const interest = principal * dailyRate * days;
                return Math.max(Math.ceil(interest), 50); // Minimum 50 CDF
            },
            
            calculateTotalRepayment: function(principal, days = 7) {
                const interest = this.calculateInterest(principal, days);
                return principal + interest;
            },
            
            calculateDailyPenalty: function(outstandingAmount, overdueDays) {
                if (overdueDays <= 0) return 0;
                const dailyRate = 0.05; // 5% daily
                let totalPenalty = 0;
                
                for (let i = 1; i <= overdueDays; i++) {
                    totalPenalty += outstandingAmount * dailyRate;
                }
                
                return Math.ceil(totalPenalty);
            },
            
            calculateDailyRepayment: function(totalAmount, days = 7) {
                return Math.ceil(totalAmount / days);
            }
        }
    },

    // ============================================
    // 3️⃣ SUBSCRIPTION RULES
    // ============================================
    SUBSCRIPTION_RULES: {
        // Tier Definitions
        TIERS: {
            BASIC: {
                CODE: 'BASIC',
                NAME: { FR: 'Basique', SW: 'Msingi', LN: 'Basique' },
                WEEKLY_LIMIT_CDF: 3000,
                MONTHLY_FEE_CDF: 1200,
                BI_ANNUAL_FEE_CDF: 6000,
                ANNUAL_FEE_CDF: 10000,
                CRB_CHECK: false,
                MAX_LEDGERS: 1500,
                FEATURES: [
                    'Lending up to 3,000 CDF per week',
                    'Basic ledger management',
                    'Group-based lending only',
                    'No CRB reporting access'
                ]
            },
            
            PREMIUM: {
                CODE: 'PREMIUM',
                NAME: { FR: 'Premium', SW: 'Premium', LN: 'Premium' },
                WEEKLY_LIMIT_CDF: 12000,
                MONTHLY_FEE_CDF: 6000,
                BI_ANNUAL_FEE_CDF: 36000,
                ANNUAL_FEE_CDF: 60000,
                CRB_CHECK: false,
                MAX_LEDGERS: 10000,
                FEATURES: [
                    'Lending up to 12,000 CDF per week',
                    'Advanced analytics',
                    'Risk assessment tools',
                    'Priority support'
                ]
            },
            
            SUPER: {
                CODE: 'SUPER',
                NAME: { FR: 'Super', SW: 'Super', LN: 'Super' },
                WEEKLY_LIMIT_CDF: 48000,
                MONTHLY_FEE_CDF: 24000,
                BI_ANNUAL_FEE_CDF: 120000,
                ANNUAL_FEE_CDF: 204000,
                CRB_CHECK: true,
                MAX_LEDGERS: 20000,
                FEATURES: [
                    'Lending up to 48,000 CDF per week',
                    'CRB integration',
                    'Advanced risk modeling',
                    'VIP support',
                    'Portfolio optimization'
                ]
            },
            
            LENDER_OF_LENDERS: {
                CODE: 'LOL',
                NAME: { FR: 'Prêteur de Prêteurs', SW: 'Mkopeshi wa Wakopeshi', LN: 'Mopei ya Bapeyi' },
                WEEKLY_LIMIT_CDF: 120000,
                MONTHLY_FEE_CDF: 12000,
                BI_ANNUAL_FEE_CDF: 84000,
                ANNUAL_FEE_CDF: 156000,
                CRB_CHECK: true,
                MIN_REPAYMENT_PERIOD: 30,
                FEATURES: [
                    'Lending up to 120,000 CDF per week',
                    'Custom interest rates allowed',
                    'Extended repayment periods (min 30 days)',
                    'Dedicated account manager',
                    'Wholesale lending capabilities'
                ]
            }
        },
        
        // Payment Rules
        PAYMENT: {
            CURRENCY: 'CDF only',
            METHODS: ['Mobile Money', 'Bank Transfer', 'Agent Payment'],
            CONFIRMATION_TIME: 'Up to 24 hours',
            AUTO_RENEWAL: 'Manual only - no auto-renew',
            PRORATION: 'Yes for upgrades, no for downgrades',
            REFUND_POLICY: 'No refunds - service-based'
        },
        
        // Enforcement Rules
        ENFORCEMENT: {
            EXPIRY_DATE: '28th of each month at 23:59 GMT+1',
            GRACE_PERIOD: 'None - immediate suspension',
            SUSPENSION_ACTIONS: [
                'Block new loan disbursements',
                'Disable ledger creation',
                'Restrict group invitations',
                'Limit dashboard access'
            ],
            
            REINSTATEMENT: {
                REQUIREMENTS: ['Full payment of arrears'],
                PROCESSING_TIME: '1-2 hours after payment confirmation',
                FEE: 'No reinstatement fee'
            }
        },
        
        // Validation Rules
        VALIDATION: {
            canUpgrade: function(currentTier, targetTier, userData) {
                const tiers = ['BASIC', 'PREMIUM', 'SUPER', 'LOL'];
                const currentIndex = tiers.indexOf(currentTier);
                const targetIndex = tiers.indexOf(targetTier);
                
                if (targetIndex <= currentIndex) return false;
                
                // Additional checks for LOL tier
                if (targetTier === 'LOL') {
                    return userData.reputation >= 4.5 && 
                           userData.monthsActive >= 6 &&
                           userData.totalLent >= 500000;
                }
                
                return true;
            },
            
            canDowngrade: function(currentTier, targetTier) {
                const tiers = ['BASIC', 'PREMIUM', 'SUPER', 'LOL'];
                const currentIndex = tiers.indexOf(currentTier);
                const targetIndex = tiers.indexOf(targetTier);
                
                if (targetIndex >= currentIndex) return false;
                
                // Check for active loans
                // Cannot downgrade if active loans exceed target tier limit
                return true;
            },
            
            validatePayment: function(amount, tier, frequency) {
                const tierConfig = DRC_RULES.SUBSCRIPTION_RULES.TIERS[tier];
                if (!tierConfig) return { valid: false, error: 'INVALID_TIER' };
                
                let expectedAmount;
                switch (frequency) {
                    case 'MONTHLY':
                        expectedAmount = tierConfig.MONTHLY_FEE_CDF;
                        break;
                    case 'BI_ANNUAL':
                        expectedAmount = tierConfig.BI_ANNUAL_FEE_CDF;
                        break;
                    case 'ANNUAL':
                        expectedAmount = tierConfig.ANNUAL_FEE_CDF;
                        break;
                    default:
                        return { valid: false, error: 'INVALID_FREQUENCY' };
                }
                
                const tolerance = 100; // 100 CDF tolerance
                const minAmount = expectedAmount - tolerance;
                const maxAmount = expectedAmount + tolerance;
                
                if (amount >= minAmount && amount <= maxAmount) {
                    return { valid: true, expected: expectedAmount, paid: amount };
                } else {
                    return { 
                        valid: false, 
                        error: 'AMOUNT_MISMATCH',
                        expected: expectedAmount,
                        paid: amount,
                        tolerance: tolerance
                    };
                }
            }
        }
    },

    // ============================================
    // 4️⃣ REPUTATION & BLACKLIST RULES
    // ============================================
    REPUTATION_RULES: {
        // Rating System
        RATING: {
            SCALE: { MIN: 1, MAX: 5 },
            WEIGHTING: {
                RECENCY: 0.3,
                LENDER_REPUTATION: 0.2,
                LOAN_SIZE: 0.1,
                GROUP_FEEDBACK: 0.4
            },
            
            DECAY: {
                RATE: 0.1,
                MINIMUM: 2.5,
                RESET_PERIOD: 12
            },
            
            CALCULATION: {
                AVERAGE: 'Weighted moving average',
                MIN_RATINGS_FOR_SCORE: 3,
                DISPLAY_PRECISION: 1,
                ROUNDING: 'Nearest 0.5'
            }
        },
        
        // Blacklist Rules
        BLACKLIST: {
            TRIGGERS: [
                '60_DAYS_OVERDUE: Automatic blacklist',
                'MULTIPLE_DEFAULTS: 3+ defaults across groups',
                'FRAUD: Confirmed fraudulent activity',
                'IDENTITY_THEFT: Stolen identity usage',
                'PLATFORM_ABUSE: Systematic rule violations'
            ],
            
            CONSEQUENCES: {
                BORROWING: 'COMPLETELY_BLOCKED',
                NEW_GROUPS: 'CANNOT_JOIN',
                EXISTING_GROUPS: 'MAY_BE_REMOVED_BY_ADMIN',
                VISIBILITY: 'PUBLIC_BLACKLIST_RECORD',
                DURATION: 'UNTIL_FULL_REPAYMENT + ADMIN_APPROVAL'
            },
            
            REMOVAL: {
                REQUIREMENTS: [
                    'Full repayment of principal',
                    'Full payment of accumulated interest',
                    'Full payment of all penalties',
                    'Admin approval mandatory',
                    'Waiting period: 30 days after payment'
                ],
                
                PROCESS: [
                    'Borrower makes full payment',
                    'Lender confirms payment',
                    'Admin reviews and approves',
                    '7-day cooling period',
                    'Blacklist status removed'
                ]
            }
        },
        
        // Group Membership Rules
        GROUP_MEMBERSHIP: {
            MAX_GROUPS_PER_USER: 4,
            MIN_REPUTATION_FOR_NEW_GROUP: 3.0,
            COOLING_PERIOD_BETWEEN_GROUPS: 7,
            INVITATION_REQUIREMENTS: {
                INVITER_REPUTATION: 3.5,
                GROUP_CONSENSUS: 'Majority approval for new members',
                REFERRAL_LIMIT: '5 new members per month per inviter'
            },
            
            SUSPENSION_RULES: {
                LOW_REPUTATION: 'Below 2.0 = group voting for removal',
                INACTIVITY: '90 days = automatic removal',
                RULE_VIOLATIONS: '3 strikes = automatic removal'
            }
        }
    },

    // ============================================
    // 5️⃣ VALIDATION & ENFORCEMENT ENGINE
    // ============================================
    VALIDATION_ENGINE: {
        // User Validation
        USER: {
            validateAge: function(birthDate) {
                const today = new Date();
                const birth = new Date(birthDate);
                let age = today.getFullYear() - birth.getFullYear();
                const monthDiff = today.getMonth() - birth.getMonth();
                
                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
                    age--;
                }
                
                return {
                    valid: age >= 18,
                    age: age,
                    requirement: 18,
                    message: age >= 18 ? 'AGE_VALID' : 'UNDERAGE_USER'
                };
            },
            
            validatePhone: function(phone) {
                const pattern = /^(?:\+243|0)(8[1-9]|9[0-9])[0-9]{7}$/;
                const valid = pattern.test(phone);
                
                return {
                    valid: valid,
                    formatted: valid ? phone.replace(/^0/, '+243') : null,
                    country: 'CD',
                    requirement: 'DRC mobile number (+243 prefix)'
                };
            },
            
            validateNationalID: function(idNumber) {
                // DRC National ID format: 2 digits + 2 letters + 6 digits
                const pattern = /^[0-9]{2}[A-Z]{2}[0-9]{6}$/;
                const valid = pattern.test(idNumber.toUpperCase());
                
                if (valid) {
                    const provinceCode = idNumber.substring(0, 2);
                    const validProvinces = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10',
                                           '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
                                           '21', '22', '23', '24', '25', '26'];
                    
                    return {
                        valid: validProvinces.includes(provinceCode),
                        provinceCode: provinceCode,
                        format: 'Valid DRC National ID',
                        requirement: '2 digits (province) + 2 letters + 6 digits'
                    };
                }
                
                return { valid: false, error: 'INVALID_ID_FORMAT' };
            }
        },
        
        // Loan Validation
        LOAN: {
            validateAmount: function(amount, lenderTier, borrowerReputation) {
                const tierConfig = DRC_RULES.SUBSCRIPTION_RULES.TIERS[lenderTier];
                if (!tierConfig) {
                    return { valid: false, error: 'INVALID_LENDER_TIER' };
                }
                
                const minAmount = DRC_RULES.LOAN_RULES.AMOUNT.MIN_CDF;
                const maxAmount = tierConfig.WEEKLY_LIMIT_CDF;
                
                if (amount < minAmount) {
                    return { 
                        valid: false, 
                        error: 'BELOW_MINIMUM',
                        min: minAmount,
                        amount: amount 
                    };
                }
                
                if (amount > maxAmount) {
                    return { 
                        valid: false, 
                        error: 'ABOVE_TIER_LIMIT',
                        max: maxAmount,
                        amount: amount 
                    };
                }
                
                // Reputation-based limits
                let reputationMultiplier = 1;
                if (borrowerReputation >= 4.5) reputationMultiplier = 1.5;
                else if (borrowerReputation >= 3.5) reputationMultiplier = 1.2;
                else if (borrowerReputation <= 2.0) reputationMultiplier = 0.5;
                
                const adjustedMax = maxAmount * reputationMultiplier;
                if (amount > adjustedMax) {
                    return { 
                        valid: false, 
                        error: 'ABOVE_REPUTATION_LIMIT',
                        max: adjustedMax,
                        reputation: borrowerReputation,
                        multiplier: reputationMultiplier
                    };
                }
                
                return { 
                    valid: true, 
                    amount: amount,
                    tierLimit: maxAmount,
                    reputationLimit: adjustedMax
                };
            },
            
            validateTerm: function(days) {
                const minDays = DRC_RULES.LOAN_RULES.TERM.MIN_DAYS;
                const maxDays = DRC_RULES.LOAN_RULES.TERM.MAX_DAYS;
                
                if (days < minDays || days > maxDays) {
                    return { 
                        valid: false, 
                        error: 'INVALID_TERM',
                        min: minDays,
                        max: maxDays,
                        requested: days
                    };
                }
                
                return { valid: true, days: days, interestRate: '10% weekly' };
            },
            
            validateRepaymentCapacity: function(borrower, loanAmount, existingLoans) {
                const totalExisting = existingLoans.reduce(function(sum, loan) {
                    return sum + loan.amount;
                }, 0);
                const totalExposure = totalExisting + loanAmount;
                
                // Rule: Total exposure cannot exceed 3x average monthly income
                const maxExposure = borrower.monthlyIncome * 3;
                
                if (totalExposure > maxExposure) {
                    return {
                        valid: false,
                        error: 'EXCEEDS_REPAYMENT_CAPACITY',
                        currentExposure: totalExisting,
                        requested: loanAmount,
                        totalExposure: totalExposure,
                        maxAllowed: maxExposure,
                        incomeMultiple: 3
                    };
                }
                
                // Rule: No more than 4 active loans total
                if (existingLoans.length >= 4) {
                    return {
                        valid: false,
                        error: 'MAX_ACTIVE_LOANS_REACHED',
                        currentCount: existingLoans.length,
                        maxAllowed: 4
                    };
                }
                
                return {
                    valid: true,
                    exposureRatio: totalExposure / borrower.monthlyIncome,
                    capacityRemaining: maxExposure - totalExposure
                };
            }
        },
        
        // Group Validation
        GROUP: {
            validateMembership: function(user, group) {
                // Check if user is already in group
                if (group.members.some(function(member) {
                    return member.userId === user.id;
                })) {
                    return { valid: false, error: 'ALREADY_MEMBER' };
                }
                
                // Check user's group count
                if (user.groups.length >= 4) {
                    return { valid: false, error: 'MAX_GROUPS_REACHED' };
                }
                
                // Check group size
                if (group.members.length >= 1000) {
                    return { valid: false, error: 'GROUP_FULL' };
                }
                
                // Check reputation requirement
                if (user.reputation < 2.0 && group.minReputation > user.reputation) {
                    return { 
                        valid: false, 
                        error: 'INSUFFICIENT_REPUTATION',
                        userReputation: user.reputation,
                        required: group.minReputation
                    };
                }
                
                // Check country match
                if (user.country !== 'CD' || group.country !== 'CD') {
                    return { valid: false, error: 'COUNTRY_MISMATCH' };
                }
                
                return { valid: true, groupSize: group.members.length + 1 };
            },
            
            validateInvitation: function(inviter, invitee, group) {
                // Inviter must be group member
                if (!group.members.some(function(member) {
                    return member.userId === inviter.id;
                })) {
                    return { valid: false, error: 'INVITER_NOT_MEMBER' };
                }
                
                // Inviter reputation check
                if (inviter.reputation < 3.5) {
                    return { 
                        valid: false, 
                        error: 'INVITER_REPUTATION_TOO_LOW',
                        inviterReputation: inviter.reputation,
                        required: 3.5
                    };
                }
                
                // Inviter invitation limit
                const monthlyInvitations = group.invitations.filter(function(inv) {
                    return inv.inviterId === inviter.id && 
                           new Date(inv.date) > new Date(Date.now() - 30*24*60*60*1000);
                }).length;
                
                if (monthlyInvitations >= 5) {
                    return { 
                        valid: false, 
                        error: 'INVITATION_LIMIT_REACHED',
                        invitationsThisMonth: monthlyInvitations,
                        limit: 5
                    };
                }
                
                return { valid: true, inviterStatus: 'ELIGIBLE' };
            }
        }
    },

    // ============================================
    // 6️⃣ COMPLIANCE & REGULATORY RULES
    // ============================================
    COMPLIANCE_RULES: {
        // AML/CFT Rules
        AML: {
            KYC_LEVELS: {
                SIMPLIFIED: {
                    MAX_AMOUNT: 100000,
                    DOCUMENTS: ['National ID', 'Phone Verification']
                },
                
                STANDARD: {
                    MAX_AMOUNT: 500000,
                    DOCUMENTS: ['National ID', 'Proof of Address', 'Source of Funds']
                },
                
                ENHANCED: {
                    MIN_AMOUNT: 500001,
                    DOCUMENTS: ['All Standard', 'Tax Certificate', 'Bank Statements (6 months)', 'Employment Proof']
                }
            },
            
            TRANSACTION_MONITORING: {
                DAILY_LIMIT: 500000,
                MONTHLY_LIMIT: 5000000,
                ANNUAL_LIMIT: 20000000,
                
                SUSPICIOUS_PATTERNS: [
                    'Transaction splitting to avoid thresholds',
                    'Rapid movement of funds between accounts',
                    'Unusual transaction patterns for user profile',
                    'Transactions with high-risk jurisdictions'
                ]
            },
            
            REPORTING: {
                STR_THRESHOLD: 1000000,
                TIMEFRAME: '24 hours from detection',
                AUTHORITY: 'Cellule de Traitement des Informations Financières (CTIF)'
            }
        },
        
        // Data Protection Rules
        DATA_PROTECTION: {
            CONSENT_REQUIREMENTS: [
                'Explicit consent for data collection',
                'Clear purpose specification',
                'Limited data retention periods',
                'Right to access and rectification',
                'Right to erasure (with conditions)'
            ],
            
            DATA_RETENTION: {
                ACTIVE_USERS: '5 years from last activity',
                INACTIVE_USERS: '2 years after deactivation',
                TRANSACTION_RECORDS: '7 years',
                AUDIT_LOGS: '10 years',
                COMPLIANCE_RECORDS: '10 years'
            },
            
            SECURITY_REQUIREMENTS: [
                'Encryption at rest and in transit',
                'Regular security audits',
                'Incident response plan',
                'Data breach notification within 72 hours'
            ]
        },
        
        // Consumer Protection Rules
        CONSUMER_PROTECTION: {
            DISCLOSURE_REQUIREMENTS: [
                'Clear interest rate disclosure',
                'Full cost of credit including penalties',
                'Repayment schedule',
                'Consequences of default',
                'Complaint handling process'
            ],
            
            FAIR_LENDING: [
                'No discrimination based on protected characteristics',
                'Equal access to credit',
                'Transparent credit decisions',
                'Right to appeal credit decisions'
            ],
            
            DISPUTE_RESOLUTION: {
                TIMEFRAME: '30 days maximum',
                ESCALATION_PATH: 'Group Admin → M-PESEWA → Regulator',
                COST_CAP: 'No cost to consumer for basic dispute resolution'
            }
        }
    },

    // ============================================
    // 7️⃣ AUDIT & MONITORING RULES
    // ============================================
    AUDIT_RULES: {
        // Automated Monitoring
        AUTOMATED_CHECKS: {
            DAILY: [
                'Subscription expiry checks',
                'Loan due date monitoring',
                'Blacklist threshold checks',
                'Suspicious activity detection'
            ],
            
            WEEKLY: [
                'Group activity reports',
                'Lender portfolio reviews',
                'Borrower reputation updates',
                'System performance audits'
            ],
            
            MONTHLY: [
                'Compliance status reviews',
                'Risk assessment updates',
                'Financial reconciliation',
                'User feedback analysis'
            ]
        },
        
        // Manual Reviews
        MANUAL_REVIEWS: {
            TRIGGERS: [
                'Transactions > 500,000 CDF',
                'New user with high initial limits',
                'Multiple group memberships',
                'Frequent role changes',
                'High default rates within groups'
            ],
            
            PROCESS: [
                'Flag for review',
                'Risk assessment',
                'Documentation review',
                'Decision and action',
                'Audit trail update'
            ],
            
            TIMEFRAME: '48 hours for standard reviews, 24 hours for urgent'
        },
        
        // Audit Trail Requirements
        AUDIT_TRAIL: {
            REQUIRED_FIELDS: [
                'timestamp',
                'user_id',
                'action_type',
                'entity_type',
                'entity_id',
                'old_value',
                'new_value',
                'ip_address',
                'user_agent',
                'session_id'
            ],
            
            RETENTION: '10 years minimum',
            IMMUTABILITY: 'Write-once, read-many (WORM)',
            ACCESS_CONTROL: 'Role-based access, logged'
        }
    }
};

// ============================================
// RULES ENFORCEMENT ENGINE
// ============================================

// Main validation function
export const validateOperation = function(operation) {
    const errors = [];
    const warnings = [];
    const results = [];
    
    switch (operation.type) {
        case 'LOAN_APPLICATION':
            const loanValidation = DRC_RULES.VALIDATION_ENGINE.LOAN.validateAmount(
                operation.amount,
                operation.lenderTier,
                operation.borrowerReputation
            );
            
            if (!loanValidation.valid) {
                errors.push('LOAN_AMOUNT_VALIDATION: ' + loanValidation.error);
            }
            results.push(loanValidation);
            
            const termValidation = DRC_RULES.VALIDATION_ENGINE.LOAN.validateTerm(
                operation.termDays || 7
            );
            
            if (!termValidation.valid) {
                errors.push('LOAN_TERM_VALIDATION: ' + termValidation.error);
            }
            results.push(termValidation);
            
            // Check hierarchy: lender and borrower must be in same group
            if (operation.lenderGroupId !== operation.borrowerGroupId) {
                errors.push('HIERARCHY_VIOLATION: Lender and Borrower must be in same group');
            }
            break;
            
        case 'SUBSCRIPTION_PAYMENT':
            const paymentValidation = DRC_RULES.SUBSCRIPTION_RULES.VALIDATION.validatePayment(
                operation.amount,
                operation.tier,
                operation.frequency
            );
            
            if (!paymentValidation.valid) {
                errors.push('SUBSCRIPTION_VALIDATION: ' + paymentValidation.error);
            }
            results.push(paymentValidation);
            
            // Check if user can upgrade/downgrade
            if (operation.isUpgrade) {
                const upgradeValidation = DRC_RULES.SUBSCRIPTION_RULES.VALIDATION.canUpgrade(
                    operation.currentTier,
                    operation.targetTier,
                    operation.userData
                );
                
                if (!upgradeValidation) {
                    errors.push('UPGRADE_NOT_ALLOWED: User does not meet upgrade criteria');
                }
            }
            break;
            
        case 'GROUP_JOIN':
            const membershipValidation = DRC_RULES.VALIDATION_ENGINE.GROUP.validateMembership(
                operation.user,
                operation.group
            );
            
            if (!membershipValidation.valid) {
                errors.push('GROUP_MEMBERSHIP: ' + membershipValidation.error);
            }
            results.push(membershipValidation);
            
            // Check invitation if applicable
            if (operation.invitation) {
                const invitationValidation = DRC_RULES.VALIDATION_ENGINE.GROUP.validateInvitation(
                    operation.inviter,
                    operation.user,
                    operation.group
                );
                
                if (!invitationValidation.valid) {
                    errors.push('GROUP_INVITATION: ' + invitationValidation.error);
                }
                results.push(invitationValidation);
            }
            break;
            
        case 'LEDGER_UPDATE':
            // Only lender or admin can update ledgers
            if (operation.actorRole !== 'LENDER' && operation.actorRole !== 'ADMIN') {
                errors.push('PERMISSION_DENIED: Only lenders or admins can update ledgers');
            }
            
            // Lender can only update their own ledgers
            if (operation.actorRole === 'LENDER' && operation.lenderId !== operation.actorId) {
                errors.push('OWNERSHIP_VIOLATION: Lender can only update their own ledgers');
            }
            
            // Check if all required fields are present
            const requiredFields = DRC_RULES.HIERARCHY.LEDGERS.FIELDS_REQUIRED;
            const missingFields = requiredFields.filter(function(field) {
                return !operation.data[field];
            });
            
            if (missingFields.length > 0) {
                warnings.push('MISSING_FIELDS: ' + missingFields.join(', '));
            }
            break;
    }
    
    // Country isolation check
    if (operation.country && operation.country !== 'CD') {
        errors.push('COUNTRY_ISOLATION_VIOLATION: Operation outside DRC jurisdiction');
    }
    
    return {
        operationId: operation.id,
        operationType: operation.type,
        timestamp: new Date().toISOString(),
        valid: errors.length === 0,
        errors: errors,
        warnings: warnings,
        results: results,
        country: 'DRC',
        hierarchyLevel: operation.hierarchyLevel || 'UNKNOWN'
    };
};

// Calculate loan details
export const calculateLoanDetails = function(principal, days = 7, overdueDays = 0) {
    const interest = DRC_RULES.LOAN_RULES.FORMULAS.calculateInterest(principal, days);
    const totalRepayment = principal + interest;
    const dailyRepayment = Math.ceil(totalRepayment / days);
    const penalty = DRC_RULES.LOAN_RULES.FORMULAS.calculateDailyPenalty(totalRepayment, overdueDays);
    
    return {
        principal: principal,
        days: days,
        interestRate: '10% weekly',
        interest: interest,
        totalRepayment: totalRepayment,
        dailyRepayment: dailyRepayment,
        overdueDays: overdueDays,
        penalty: penalty,
        totalDue: totalRepayment + penalty,
        breakdown: {
            principal: principal,
            interest: interest,
            penalty: penalty,
            total: totalRepayment + penalty
        }
    };
};

// Check subscription status
export const checkSubscriptionStatus = function(subscription) {
    const now = new Date();
    const expiryDate = new Date(subscription.expiryDate);
    const daysRemaining = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
    
    const isExpired = now > expiryDate;
    const isExpiringSoon = daysRemaining <= 7 && daysRemaining > 0;
    const isActive = !isExpired;
    
    const tierConfig = DRC_RULES.SUBSCRIPTION_RULES.TIERS[subscription.tier];
    
    return {
        status: isExpired ? 'EXPIRED' : isExpiringSoon ? 'EXPIRING_SOON' : 'ACTIVE',
        tier: subscription.tier,
        tierName: tierConfig ? (tierConfig.NAME ? tierConfig.NAME.FR : subscription.tier) : subscription.tier,
        weeklyLimit: tierConfig ? tierConfig.WEEKLY_LIMIT_CDF : 0,
        expiryDate: subscription.expiryDate,
        daysRemaining: daysRemaining,
        isExpired: isExpired,
        isExpiringSoon: isExpiringSoon,
        isActive: isActive,
        blockedActions: isExpired ? DRC_RULES.SUBSCRIPTION_RULES.ENFORCEMENT.SUSPENSION_ACTIONS : [],
        allowedActions: isExpired ? DRC_RULES.SUBSCRIPTION_RULES.ENFORCEMENT.REINSTATEMENT.REQUIREMENTS : ['ALL']
    };
};

// Validate reputation for action
export const validateReputationForAction = function(userReputation, actionType) {
    const requirements = {
        JOIN_NEW_GROUP: 3.0,
        REQUEST_LARGE_LOAN: 3.5,
        BECOME_GROUP_ADMIN: 4.0,
        UPGRADE_TO_SUPER: 4.5,
        INVITE_NEW_MEMBERS: 3.5
    };
    
    const required = requirements[actionType] || 2.5;
    const allowed = userReputation >= required;
    
    return {
        allowed: allowed,
        userReputation: userReputation,
        required: required,
        actionType: actionType,
        margin: userReputation - required
    };
};

// Export the rules configuration
export default DRC_RULES;

// Freeze the configuration to prevent modifications
Object.freeze(DRC_RULES);
Object.freeze(DRC_RULES.HIERARCHY);
Object.freeze(DRC_RULES.LOAN_RULES);
Object.freeze(DRC_RULES.SUBSCRIPTION_RULES);
Object.freeze(DRC_RULES.REPUTATION_RULES);
Object.freeze(DRC_RULES.VALIDATION_ENGINE);
Object.freeze(DRC_RULES.COMPLIANCE_RULES);
Object.freeze(DRC_RULES.AUDIT_RULES);