/**
 * Tanzania (TZ) Rules Configuration for M-Pesewa
 * Country-specific business rules, validations, and enforcement
 */

const tzRules = {
    // ============================================
    // 1. HIERARCHY RULES (STRICT ENFORCEMENT)
    // ============================================
    hierarchy: {
        // Global → Country → Groups → Lenders → Borrowers (Ledgers)
        levels: [
            {
                level: 'global',
                name: 'Global Platform',
                rules: [
                    'Platform-wide settings and configurations',
                    'Cross-country user management (admin only)',
                    'Global reporting and analytics'
                ]
            },
            {
                level: 'country',
                name: 'Tanzania Country',
                rules: [
                    'Country-specific regulations and compliance',
                    'Currency: Tanzanian Shillings (TZS) only',
                    'Local language support (Swahili/English)',
                    'Bank of Tanzania compliance'
                ]
            },
            {
                level: 'groups',
                name: 'Trusted Groups',
                rules: [
                    'Minimum 5 members, maximum 1000 members',
                    'Invitation or referral only',
                    'Country-locked (Tanzanian members only)',
                    'Group types: Family, Church, Professional, etc.',
                    'One Admin/Founder per group'
                ]
            },
            {
                level: 'lenders',
                name: 'Lenders',
                rules: [
                    'Must have active subscription',
                    'Can only lend within their group',
                    'Unlimited personal ledgers',
                    'Subscription expires 28th of each month',
                    'Tier-based lending limits'
                ]
            },
            {
                level: 'borrowers',
                name: 'Borrowers',
                rules: [
                    'No subscription fees',
                    'Maximum 4 groups (with good rating)',
                    'One active loan per group',
                    '7-day repayment period',
                    '10% interest rate'
                ]
            },
            {
                level: 'ledgers',
                name: 'Loan Ledgers',
                rules: [
                    'Auto-generated on loan approval',
                    'One ledger per borrower per lender',
                    'Manual repayment updates',
                    '5-star rating system',
                    'Blacklist tracking'
                ]
            }
        ],
        
        // Enforcement rules
        enforcement: {
            countryIsolation: {
                enabled: true,
                rules: [
                    'NO_CROSS_COUNTRY_LENDING',
                    'NO_CROSS_COUNTRY_BORROWING',
                    'NO_FOREIGN_CURRENCY_ACCEPTED',
                    'TANZANIAN_RESIDENCY_REQUIRED'
                ],
                penalty: 'Permanent account suspension'
            },
            
            groupIsolation: {
                enabled: true,
                rules: [
                    'LENDERS_CAN_ONLY_LEND_WITHIN_GROUP',
                    'BORROWERS_CAN_ONLY_BORROW_FROM_GROUP_MEMBERS',
                    'NO_INTERGROUP_TRANSACTIONS',
                    'GROUP_ADMIN_MUST_APPROVE_NEW_MEMBERS'
                ],
                penalty: 'Group suspension and fine'
            },
            
            subscriptionEnforcement: {
                enabled: true,
                rules: [
                    'LENDERS_MUST_HAVE_ACTIVE_SUBSCRIPTION',
                    'SUBSCRIPTION_EXPIRES_28TH_EACH_MONTH',
                    'EXPIRED_SUBSCRIPTION_BLOCKS_LENDING',
                    'NO_BACKDATING_SUBSCRIPTIONS'
                ],
                penalty: 'Lending access blocked until payment'
            }
        }
    },

    // ============================================
    // 2. USER REGISTRATION RULES
    // ============================================
    registration: {
        // General requirements
        general: {
            minimumAge: 18,
            residencyRequirement: 'Tanzanian resident',
            nationalIdRequired: true,
            phoneVerificationRequired: true,
            emailVerificationRequired: false,
            
            prohibitedUsers: [
                'Non-Tanzanian residents',
                'Minors (under 18)',
                'Previously blacklisted users',
                'Users with fraudulent history'
            ]
        },
        
        // Borrower-specific rules
        borrower: {
            subscriptionRequired: false,
            guarantorsRequired: 2,
            guarantorRules: [
                'Must be from same group',
                'Must have active M-Pesewa account',
                'Must have good repayment history',
                'Cannot be immediate family for business loans'
            ],
            
            groupLimits: {
                maximumGroups: 4,
                minimumRatingForAdditionalGroups: 4.0, // 4-star rating
                coolDownPeriod: '30 days between group joins'
            },
            
            identityVerification: [
                'National ID (NIDA) verification',
                'Mobile number verification',
                'Profile photo upload',
                'Residential address verification'
            ]
        },
        
        // Lender-specific rules
        lender: {
            subscriptionRequired: true,
            subscriptionTiers: ['basic', 'premium', 'super'],
            
            tierRequirements: {
                basic: {
                    maxWeekly: 1500,
                    documents: ['National ID', 'Phone Verification'],
                    crbCheck: false
                },
                premium: {
                    maxWeekly: 5000,
                    documents: ['National ID', 'Phone Verification', 'Proof of Income'],
                    crbCheck: false
                },
                super: {
                    maxWeekly: 20000,
                    documents: ['National ID', 'Phone Verification', 'Proof of Income', 'Bank Statement'],
                    crbCheck: true
                }
            },
            
            businessRules: [
                'Can lend to multiple borrowers simultaneously',
                'Must maintain accurate ledgers',
                'Must report defaults within 7 days',
                'Can rate borrowers after repayment'
            ]
        }
    },

    // ============================================
    // 3. LOAN TRANSACTION RULES
    // ============================================
    loans: {
        // Loan application rules
        application: {
            eligibility: [
                'Must be active group member for at least 7 days',
                'No active loans in same group',
                'Minimum 3-star rating for repeat borrowers',
                'Not blacklisted in any group'
            ],
            
            requiredInformation: [
                'Loan amount (TZS)',
                'Emergency category',
                'Repayment plan (7 days)',
                'Purpose description',
                'Preferred lender (optional)'
            ],
            
            validation: [
                'Amount must be within tier limits',
                'Category must be valid emergency type',
                'Purpose must be legitimate emergency',
                'Borrower must have repayment capacity'
            ]
        },
        
        // Loan approval rules
        approval: {
            lenderRules: [
                'Can only approve loans within subscription limit',
                'Must have sufficient "available to lend" balance',
                'Cannot approve own loan application',
                'Must verify borrower identity and need'
            ],
            
            groupRules: [
                'Group admin can override approvals',
                'Multiple lenders can fund single loan',
                'Loan must be fully funded before disbursement',
                'Group consensus required for large loans (>TZS 10,000)'
            ],
            
            timeframes: {
                applicationReview: '24 hours maximum',
                fundingPeriod: '48 hours maximum',
                disbursement: 'Immediate after approval'
            }
        },
        
        // Loan terms rules
        terms: {
            duration: {
                standard: '7 days',
                extensions: 'Not allowed',
                earlyRepayment: 'Allowed with full interest'
            },
            
            interest: {
                rate: '10% per loan period',
                calculation: 'Simple interest on principal',
                accrual: 'Daily for accounting purposes',
                capitalization: 'At repayment'
            },
            
            repayment: {
                options: ['Daily', 'Weekly', 'Lump Sum'],
                partialPayments: 'Allowed and encouraged',
                minimumPartial: 'TZS 1000',
                gracePeriod: 'None'
            }
        },
        
        // Penalty rules
        penalties: {
            latePayment: {
                starts: 'Day 8',
                rate: '5% daily on outstanding balance',
                calculation: 'Compound daily',
                maximum: 'No cap (until default)'
            },
            
            default: {
                definition: '60 days (2 months) overdue',
                consequences: [
                    'Automatic blacklisting',
                    'Visible blacklist badge',
                    'Cannot borrow from any group',
                    'Cannot join new groups',
                    'Debt collection initiated'
                ]
            }
        }
    },

    // ============================================
    // 4. SUBSCRIPTION RULES
    // ============================================
    subscriptions: {
        // Tier definitions
        tiers: {
            basic: {
                code: 'TZ-BASIC',
                name: 'Basic Lender',
                limits: {
                    maxWeekly: 1500,
                    maxBorrowers: 10,
                    maxConcurrentLoans: 5
                },
                pricing: {
                    monthly: 50,
                    biAnnual: 250,
                    annual: 500
                },
                features: [
                    'Basic lending access',
                    'Manual ledger management',
                    'Group lending only',
                    'No CRB check'
                ]
            },
            
            premium: {
                code: 'TZ-PREMIUM',
                name: 'Premium Lender',
                limits: {
                    maxWeekly: 5000,
                    maxBorrowers: 50,
                    maxConcurrentLoans: 25
                },
                pricing: {
                    monthly: 250,
                    biAnnual: 1500,
                    annual: 2500
                },
                features: [
                    'Higher lending limits',
                    'Advanced analytics',
                    'Bulk loan processing',
                    'Priority support'
                ]
            },
            
            super: {
                code: 'TZ-SUPER',
                name: 'Super Lender',
                limits: {
                    maxWeekly: 20000,
                    maxBorrowers: 100,
                    maxConcurrentLoans: 50
                },
                pricing: {
                    monthly: 1000,
                    biAnnual: 5000,
                    annual: 8500
                },
                features: [
                    'Highest lending limits',
                    'CRB integration',
                    'Dedicated account manager',
                    'Advanced risk tools'
                ]
            }
        },
        
        // Subscription management rules
        management: {
            payment: {
                methods: ['M-Pesa', 'Tigo Pesa', 'Airtel Money', 'Halopesa'],
                frequency: ['monthly', 'biAnnual', 'annual'],
                autoRenew: 'Optional, default enabled',
                receipt: 'Automatically generated'
            },
            
            renewal: {
                expiryDate: '28th of each month',
                gracePeriod: '3 days',
                renewalWindow: '7 days before expiry',
                lateRenewal: 'Additional TZS 500 fee'
            },
            
            changes: {
                upgrade: 'Immediate, pro-rated',
                downgrade: 'Next billing cycle',
                cancellation: 'No refunds, service continues until expiry',
                pause: 'Not allowed'
            }
        },
        
        // Enforcement rules
        enforcement: {
            expiredSubscription: [
                'Lending access immediately blocked',
                'Can still manage existing loans',
                'Cannot approve new loans',
                'Dashboard shows expired status'
            ],
            
            nonPayment: [
                'Reminders at 7, 3, and 1 days before expiry',
                'Final notice on expiry day',
                'Account restriction after 3-day grace period',
                'Eventual account suspension'
            ]
        }
    },

    // ============================================
    // 5. REPUTATION & RATING RULES
    // ============================================
    reputation: {
        // Rating system
        ratings: {
            scale: '1-5 stars',
            criteria: [
                'Timeliness of repayment',
                'Communication during loan period',
                'Accuracy of loan purpose',
                'Overall reliability'
            ],
            
            calculation: {
                method: 'Weighted average',
                weights: {
                    timeliness: 0.4,
                    communication: 0.2,
                    accuracy: 0.2,
                    reliability: 0.2
                },
                minimumRatings: '3 for visible score'
            },
            
            impact: {
                borrowing: {
                    '1-2 stars': 'Cannot borrow',
                    '3 stars': 'Limited borrowing',
                    '4 stars': 'Normal borrowing',
                    '5 stars': 'Premium borrowing access'
                },
                lending: {
                    '1-2 stars': 'Cannot lend',
                    '3 stars': 'Basic lending only',
                    '4 stars': 'Normal lending',
                    '5 stars': 'Featured lender status'
                }
            }
        },
        
        // Blacklist system
        blacklist: {
            triggers: [
                'Loan default (60+ days overdue)',
                'Fraudulent activity',
                'Identity theft',
                'Multiple late payments across groups'
            ],
            
            process: {
                automatic: 'On 60th day of overdue',
                manual: 'Lender can blacklist earlier',
                appeal: 'Through platform admin',
                removal: 'Full repayment + admin approval'
            },
            
            consequences: {
                borrowing: 'Blocked from all groups',
                lending: 'Can still lend (if subscription active)',
                groups: 'Cannot join new groups',
                visibility: 'Blacklist badge visible platform-wide'
            },
            
            registry: {
                public: 'Yes (name and amount only)',
                details: 'Available to lenders in same group',
                duration: 'Until cleared',
                clearing: 'Full repayment + 30 days waiting period'
            }
        },
        
        // Trust scoring
        trustScore: {
            components: [
                'Repayment history (40%)',
                'Group participation (20%)',
                'Rating consistency (20%)',
                'Account age (10%)',
                'Verification level (10%)'
            ],
            
            tiers: {
                low: '0-49: Restricted access',
                medium: '50-79: Standard access',
                high: '80-94: Premium access',
                excellent: '95-100: VIP access'
            },
            
            updates: {
                frequency: 'Daily',
                triggers: [
                    'Loan repayment',
                    'New rating received',
                    'Group activity',
                    'Account verification'
                ]
            }
        }
    },

    // ============================================
    // 6. GROUP MANAGEMENT RULES
    // ============================================
    groups: {
        // Group creation
        creation: {
            requirements: [
                'Must be Tanzanian resident',
                'Minimum age: 25 for group admin',
                'Clean repayment history',
                'Minimum 5 founding members'
            ],
            
            limits: {
                members: {
                    minimum: 5,
                    maximum: 1000,
                    warningThreshold: 800
                },
                groupsPerUser: {
                    borrower: 4,
                    lender: 10,
                    admin: 5
                }
            },
            
            approval: {
                required: 'Platform admin approval',
                timeframe: '24-48 hours',
                criteria: [
                    'Valid group purpose',
                    'Diverse membership',
                    'Clear group rules',
                    'Active admin'
                ]
            }
        },
        
        // Group membership
        membership: {
            joining: {
                methods: ['Invitation', 'Referral', 'Application'],
                requirements: [
                    'Member of same country',
                    'Verified identity',
                    'Minimum rating (for existing users)',
                    'Group admin approval'
                ]
            },
            
            leaving: {
                voluntary: 'Allowed with 7-day notice',
                forced: 'By group admin or platform',
                consequences: [
                    'Must settle all loans first',
                    'Cannot rejoin for 30 days',
                    'Ratings remain in group history'
                ]
            },
            
            migration: {
                allowed: 'Yes, with conditions',
                conditions: [
                    'Good repayment history (4+ stars)',
                    'No active loans',
                    'Invitation from new group',
                    'Approval from current group admin'
                ],
                limit: 'Once per 90 days'
            }
        },
        
        // Group administration
        administration: {
            adminRights: [
                'Approve/reject new members',
                'Remove members',
                'Moderate disputes',
                'Set group-specific rules',
                'View group analytics'
            ],
            
            adminResponsibilities: [
                'Ensure group compliance',
                'Maintain group harmony',
                'Report issues to platform',
                'Verify new members',
                'Enforce group rules'
            ],
            
            succession: {
                transfer: 'Allowed to existing member',
                resignation: '30-day notice required',
                automatic: 'To most active member if admin inactive for 60 days'
            }
        },
        
        // Group financial rules
        financial: {
            internalRules: {
                allowed: 'Yes, group-specific rules',
                limitations: [
                    'Cannot exceed platform maximums',
                    'Must comply with Tanzanian law',
                    'Must be clearly documented',
                    'Must be approved by majority'
                ]
            },
            
            collectiveLending: {
                allowed: 'Yes, through pool',
                requirements: [
                    'Separate ledger for pool',
                    'Transparent accounting',
                    'Member approval for large loans',
                    'Regular financial reporting'
                ]
            }
        }
    },

    // ============================================
    // 7. DISPUTE RESOLUTION RULES
    // ============================================
    disputes: {
        // Types of disputes
        types: {
            repayment: 'Disagreement over repayment amount or timing',
            loanPurpose: 'Misuse of loan funds',
            identity: 'Identity verification issues',
            harassment: 'Inappropriate communication',
            fraud: 'Suspected fraudulent activity'
        },
        
        // Resolution process
        process: {
            level1: {
                name: 'Direct Resolution',
                timeframe: '24 hours',
                process: 'Parties communicate directly',
                escalation: 'If unresolved, move to Level 2'
            },
            
            level2: {
                name: 'Group Mediation',
                timeframe: '72 hours',
                process: 'Group admin mediates',
                escalation: 'If unresolved, move to Level 3'
            },
            
            level3: {
                name: 'Platform Mediation',
                timeframe: '7 days',
                process: 'Platform mediator assigned',
                decision: 'Binding resolution'
            },
            
            level4: {
                name: 'Legal Action',
                timeframe: 'As per legal process',
                process: 'Tanzania courts',
                cost: 'Parties bear own costs'
            }
        },
        
        // Evidence requirements
        evidence: {
            required: [
                'Transaction records',
                'Communication logs',
                'Identity documents',
                'Witness statements (if available)'
            ],
            
            format: [
                'Digital copies only',
                'Clear and legible',
                'Relevant to dispute',
                'Timestamped'
            ]
        },
        
        // Outcomes
        outcomes: {
            borrowerFavored: [
                'Interest reduction',
                'Extended repayment',
                'Penalty waiver',
                'Lender warning'
            ],
            
            lenderFavored: [
                'Immediate repayment',
                'Additional penalty',
                'Borrower blacklisting',
                'Legal action initiation'
            ],
            
            mutual: [
                'Revised repayment plan',
                'Partial forgiveness',
                'Mediated settlement',
                'Confidential agreement'
            ]
        }
    },

    // ============================================
    // 8. SECURITY & FRAUD PREVENTION RULES
    // ============================================
    security: {
        // Authentication rules
        authentication: {
            password: {
                minimumLength: 8,
                maximumLength: 12,
                requirements: ['uppercase', 'lowercase', 'numbers', 'symbols'],
                expiration: '90 days',
                history: 'Cannot reuse last 3 passwords'
            },
            
            twoFactor: {
                required: 'For lenders and large transactions',
                methods: ['SMS', 'Email', 'Authenticator App'],
                frequency: 'Every login for sensitive accounts'
            },
            
            session: {
                timeout: '30 minutes inactivity',
                maximumSessions: 3,
                deviceTracking: 'Enabled',
                locationChecking: 'Enabled'
            }
        },
        
        // Fraud prevention
        fraudPrevention: {
            detection: {
                rules: [
                    'Multiple accounts from same device',
                    'Rapid loan applications',
                    'Unusual repayment patterns',
                    'Suspicious IP addresses'
                ],
                thresholds: {
                    dailyApplications: 3,
                    simultaneousLoans: 2,
                    failedLogins: 5
                }
            },
            
            prevention: [
                'Identity verification for all users',
                'Transaction limits based on account age',
                'Withdrawal holds for new accounts',
                'Manual review for large transactions'
            ],
            
            response: {
                automatic: 'Account freeze on suspicious activity',
                investigation: '24-48 hours',
                resolution: [
                    'Account restoration if clean',
                    'Permanent ban if fraudulent',
                    'Legal reporting if required'
                ]
            }
        },
        
        // Data protection
        dataProtection: {
            encryption: {
                transmission: 'TLS 1.3',
                storage: 'AES-256',
                keyManagement: 'Hardware security modules'
            },
            
            access: {
                user: 'Only own data',
                group: 'Limited member information',
                admin: 'Full access with logging',
                thirdParty: 'Only with explicit consent'
            },
            
            retention: {
                activeAccounts: 'Indefinite',
                closedAccounts: '7 years',
                transactionRecords: '7 years',
                auditLogs: '10 years'
            }
        }
    },

    // ============================================
    // 9. COMPLIANCE & REGULATORY RULES
    // ============================================
    compliance: {
        // Bank of Tanzania compliance
        botCompliance: {
            licensing: {
                required: 'Digital Lending Platform License',
                number: 'BOT/DLP/2024/001',
                renewal: 'Annual',
                display: 'Required on all marketing materials'
            },
            
            reporting: {
                frequency: 'Monthly',
                reports: [
                    'User registration report',
                    'Transaction volume report',
                    'Default rate report',
                    'Suspicious activity report'
                ],
                deadline: '5th of following month'
            },
            
            consumerProtection: [
                'Clear disclosure of all terms',
                'No hidden fees or charges',
                'Fair debt collection practices',
                'Accessible complaint mechanism'
            ]
        },
        
        // Anti-Money Laundering (AML)
        aml: {
            kyc: {
                levels: [
                    'Level 1: Basic (all users)',
                    'Level 2: Enhanced (large transactions)',
                    'Level 3: Ongoing (high-risk users)'
                ],
                documents: ['National ID', 'Proof of Address', 'Photo Verification']
            },
            
            monitoring: {
                thresholds: {
                    singleTransaction: 'TZS 1,000,000',
                    dailyTotal: 'TZS 3,000,000',
                    monthlyTotal: 'TZS 10,000,000'
                },
                reporting: 'To Financial Intelligence Unit (FIU)'
            },
            
            training: {
                employees: 'Annual AML training',
                agents: 'Bi-annual training',
                updates: 'Regular regulatory updates'
            }
        },
        
        // Tax compliance
        tax: {
            vat: {
                registration: 'VAT registered',
                rate: '18%',
                filing: 'Monthly returns',
                payment: '20th of following month'
            },
            
            withholding: {
                rate: '10% on interest payments',
                filing: 'Monthly returns',
                certificates: 'Issued to recipients'
            },
            
            corporate: {
                rate: '30%',
                filing: 'Annual return',
                payment: '31st March following tax year'
            }
        }
    },

    // ============================================
    // 10. RULE ENFORCEMENT & PENALTIES
    // ============================================
    enforcement: {
        // Violation categories
        violations: {
            minor: [
                'Late payment (7-30 days)',
                'Incomplete profile information',
                'Minor group rule violations',
                'First-time authentication failure'
            ],
            
            major: [
                'Payment default (31-60 days)',
                'Multiple late payments',
                'Serious group rule violations',
                'Suspicious activity'
            ],
            
            critical: [
                'Fraudulent activity',
                'Identity theft',
                'Money laundering',
                'Platform abuse'
            ]
        },
        
        // Penalties
        penalties: {
            minor: [
                'Warning notification',
                'Temporary restrictions',
                'Required training',
                'Small fine (TZS 5,000)'
            ],
            
            major: [
                'Account suspension (7-30 days)',
                'Lending/borrowing restrictions',
                'Significant fine (TZS 50,000)',
                'Group removal'
            ],
            
            critical: [
                'Permanent account ban',
                'Legal action',
                'Blacklisting',
                'Regulatory reporting'
            ]
        },
        
        // Appeal process
        appeal: {
            eligibility: [
                'All major and critical penalties',
                'Within 30 days of penalty',
                'With supporting evidence',
                'No previous successful appeal in last 90 days'
            ],
            
            process: {
                submission: 'Through platform appeal form',
                review: 'By compliance committee',
                timeframe: '14 days',
                decision: 'Final and binding'
            },
            
            outcomes: [
                'Penalty upheld',
                'Penalty reduced',
                'Penalty overturned',
                'Alternative resolution'
            ]
        }
    },

    // ============================================
    // 11. RULE VALIDATION FUNCTIONS
    // ============================================
    validators: {
        // Validate user against registration rules
        validateUserRegistration: (userData, userType) => {
            const errors = [];
            const rules = tzRules.registration;
            
            // Age validation
            if (userData.age < rules.general.minimumAge) {
                errors.push(`Minimum age is ${rules.general.minimumAge}`);
            }
            
            // Residency validation
            if (userData.country !== 'Tanzania') {
                errors.push('Only Tanzanian residents can register');
            }
            
            // User type specific validations
            if (userType === 'borrower') {
                if (!userData.guarantors || userData.guarantors.length < rules.borrower.guarantorsRequired) {
                    errors.push(`Borrowers require ${rules.borrower.guarantorsRequired} guarantors`);
                }
            }
            
            if (userType === 'lender') {
                if (!userData.subscriptionTier || !rules.lender.subscriptionTiers.includes(userData.subscriptionTier)) {
                    errors.push(`Lenders must select a valid subscription tier: ${rules.lender.subscriptionTiers.join(', ')}`);
                }
            }
            
            return {
                valid: errors.length === 0,
                errors: errors,
                warnings: []
            };
        },
        
        // Validate loan application
        validateLoanApplication: (application, borrowerProfile, lenderTier) => {
            const errors = [];
            const warnings = [];
            const rules = tzRules.loans;
            
            // Amount validation
            const tierLimits = {
                basic: 1500,
                premium: 5000,
                super: 20000
            };
            
            const maxAmount = tierLimits[lenderTier] || tierLimits.basic;
            if (application.amount > maxAmount) {
                errors.push(`Amount exceeds maximum of TZS ${maxAmount.toLocaleString()} for ${lenderTier} tier`);
            }
            
            if (application.amount < 1000) {
                errors.push('Minimum loan amount is TZS 1,000');
            }
            
            // Borrower eligibility
            if (borrowerProfile.activeLoans >= 1) {
                errors.push('Borrower already has an active loan in this group');
            }
            
            if (borrowerProfile.rating < 3 && borrowerProfile.totalLoans > 0) {
                errors.push('Borrower rating too low for new loan');
            }
            
            // Category validation
            const validCategories = ['fare', 'data', 'gas', 'food', 'electricity', 'medicine'];
            if (!validCategories.includes(application.category)) {
                errors.push(`Invalid emergency category. Must be one of: ${validCategories.join(', ')}`);
            }
            
            // Purpose validation
            if (!application.purpose || application.purpose.length < 10) {
                warnings.push('Loan purpose description is brief. Consider adding more details.');
            }
            
            return {
                valid: errors.length === 0,
                errors: errors,
                warnings: warnings,
                requiresManualReview: application.amount > 10000 || warnings.length > 2
            };
        },
        
        // Validate group creation
        validateGroupCreation: (groupData, adminProfile) => {
            const errors = [];
            const rules = tzRules.groups;
            
            // Admin validation
            if (adminProfile.age < rules.creation.requirements.find(r => r.includes('25')).match(/\d+/)[0]) {
                errors.push('Group admin must be at least 25 years old');
            }
            
            if (adminProfile.reputationScore < 80) {
                errors.push('Group admin must have good reputation score (80+)');
            }
            
            // Member validation
            if (!groupData.foundingMembers || groupData.foundingMembers.length < rules.creation.limits.members.minimum) {
                errors.push(`Group requires minimum ${rules.creation.limits.members.minimum} founding members`);
            }
            
            // Group type validation
            const validTypes = ['Family', 'Church', 'Professional', 'Business', 'Social', 'Neighborhood', 'Association'];
            if (!validTypes.includes(groupData.type)) {
                errors.push(`Invalid group type. Must be one of: ${validTypes.join(', ')}`);
            }
            
            return {
                valid: errors.length === 0,
                errors: errors,
                requiresApproval: groupData.type === 'Business' || groupData.foundingMembers.length > 20
            };
        },
        
        // Check subscription status
        checkSubscriptionStatus: (subscription) => {
            const today = new Date();
            const expiryDate = new Date(subscription.expiryDate);
            const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
            
            const status = {
                active: daysUntilExpiry > 0,
                expiringSoon: daysUntilExpiry <= 7 && daysUntilExpiry > 0,
                expired: daysUntilExpiry <= 0,
                gracePeriod: daysUntilExpiry >= -3 && daysUntilExpiry < 0,
                fullyExpired: daysUntilExpiry < -3,
                
                details: {
                    daysUntilExpiry: daysUntilExpiry,
                    expiryDate: subscription.expiryDate,
                    tier: subscription.tier,
                    canLend: daysUntilExpiry > -3, // Can lend until 3 days after expiry
                    requiresRenewal: daysUntilExpiry <= 7
                }
            };
            
            return status;
        },
        
        // Calculate reputation impact
        calculateReputationImpact: (event, currentScore) => {
            const impacts = {
                'onTimeRepayment': { change: +5, max: 100 },
                'lateRepayment1-7': { change: -2, min: 0 },
                'lateRepayment8-30': { change: -10, min: 0 },
                'default': { change: -30, min: 0 },
                'positiveRating': { change: +1, max: 100 },
                'negativeRating': { change: -3, min: 0 },
                'groupActivity': { change: +0.5, max: 100 },
                'verificationComplete': { change: +2, max: 100 }
            };
            
            const impact = impacts[event];
            if (!impact) return currentScore;
            
            let newScore = currentScore + impact.change;
            
            if (impact.max !== undefined && newScore > impact.max) {
                newScore = impact.max;
            }
            
            if (impact.min !== undefined && newScore < impact.min) {
                newScore = impact.min;
            }
            
            return Math.round(newScore * 10) / 10; // Round to 1 decimal
        }
    }
};

// Export Rules Configuration
module.exports = tzRules;

// Initialize rules system
console.log('Tanzania Rules Configuration loaded successfully');
console.log(`Hierarchy Levels: ${tzRules.hierarchy.levels.length} levels defined`);
console.log(`Registration Rules: ${Object.keys(tzRules.registration).length} categories`);
console.log(`Loan Rules: ${Object.keys(tzRules.loans).length} rule sets`);
console.log(`Subscription Tiers: ${Object.keys(tzRules.subscriptions.tiers).length} tiers`);
console.log(`Validation Functions: ${Object.keys(tzRules.validators).length} validators available`);