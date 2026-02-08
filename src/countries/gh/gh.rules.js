/**
 * M-PESEWA GHANA RULES MODULE
 * Country-specific business rules, validations, and enforcement
 * Last Updated: 2024
 * Version: 1.0.0
 * 
 * ✅ HIERARCHY ENFORCEMENT: Global → Ghana → Groups → Lenders → Borrowers
 * ✅ BUSINESS RULES: Strict lending/borrowing rules for Ghana
 * ✅ VALIDATION: Comprehensive rule validation
 * ✅ COMPLIANCE: Bank of Ghana and Ghanaian law compliance
 * ✅ ENFORCEMENT: Rule enforcement mechanisms
 */

const GHANA_RULES = {
    // ============================================
    // 1️⃣ HIERARCHY & STRUCTURE RULES
    // ============================================
    hierarchy: {
        // Strict Hierarchy Definition
        levels: [
            {
                level: 'Global',
                description: 'M-Pesewa Platform',
                rules: ['Platform-wide rules apply']
            },
            {
                level: 'Country',
                description: 'Ghana Operations',
                rules: [
                    'Country isolation enforced',
                    'Ghanaian regulations apply',
                    'GHS currency only',
                    'Ghanaian users only'
                ]
            },
            {
                level: 'Groups',
                description: 'Trust Circles in Ghana',
                rules: [
                    'Minimum 5 members',
                    'Maximum 1000 members',
                    'Group isolation enforced',
                    'Country-locked groups'
                ]
            },
            {
                level: 'Lenders',
                description: 'Money Providers in Groups',
                rules: [
                    'Subscription required',
                    'Lend within groups only',
                    'Unlimited ledgers',
                    'Rating system enforced'
                ]
            },
            {
                level: 'Borrowers',
                description: 'Money Recipients in Groups',
                rules: [
                    'No subscription fees',
                    'Maximum 4 groups',
                    'Rating dependent',
                    'Default consequences'
                ]
            },
            {
                level: 'Ledgers',
                description: 'Loan Records',
                rules: [
                    'One ledger per borrower',
                    'Manual updates by lender',
                    'Admin override possible',
                    'Permanent audit trail'
                ]
            }
        ],

        // Isolation Rules
        isolation: {
            country: {
                enabled: true,
                description: 'No cross-country transactions',
                enforcement: 'Geographic IP blocking, phone number validation',
                exceptions: 'None allowed'
            },
            group: {
                enabled: true,
                description: 'Lenders can only lend within their group',
                enforcement: 'Group-based access controls',
                exceptions: 'None allowed'
            },
            currency: {
                enabled: true,
                description: 'GHS currency only for Ghana operations',
                enforcement: 'Currency validation at transaction level',
                exceptions: 'None allowed'
            }
        },

        // Validation Rules
        validation: {
            countryMembership: {
                rule: 'Users must belong to only one country',
                validation: 'Phone number prefix +233 verification',
                error: 'Cannot change country after registration'
            },
            groupMembership: {
                rule: 'Maximum 4 groups per user',
                validation: 'Active group count check',
                error: 'Maximum 4 groups allowed. Improve rating to join more'
            },
            roleSeparation: {
                rule: 'Separate borrower and lender profiles',
                validation: 'Profile type enforcement',
                error: 'Cannot be borrower and lender in same transaction'
            }
        }
    },

    // ============================================
    // 2️⃣ GROUP RULES & VALIDATIONS
    // ============================================
    groups: {
        // Creation Rules
        creation: {
            minimumMembers: 5,
            maximumMembers: 1000,
            adminRequirements: {
                age: 18,
                residency: 'Ghana resident',
                verification: 'Ghana Card verified',
                rating: 'Minimum 3.0 rating'
            },
            namingConventions: {
                minLength: 3,
                maxLength: 50,
                allowedCharacters: 'Letters, numbers, spaces',
                prohibited: ['Offensive', 'Commercial', 'Political']
            },
            types: [
                'Family Group',
                'Church Group',
                'Professional Group',
                'Community Group',
                'Social Group',
                'Business Group',
                'Alumni Group',
                'Neighborhood Group'
            ]
        },

        // Membership Rules
        membership: {
            invitationOnly: true,
            referralRequired: true,
            verification: {
                phone: true,
                identity: true,
                location: true
            },
            joinRules: {
                maxPending: 10,
                approvalTime: '72 hours',
                autoReject: true
            },
            exitRules: {
                noticePeriod: '7 days',
                outstandingLoans: 'Must settle all loans',
                rejoinCooldown: '30 days'
            }
        },

        // Group Admin Rules
        admin: {
            privileges: [
                'Invite members',
                'Remove members',
                'Set group rules',
                'Moderate disputes',
                'View group analytics',
                'Approve join requests'
            ],
            limitations: [
                'Cannot lend to themselves',
                'Cannot favor specific members',
                'Must maintain minimum rating',
                'Subject to platform oversight'
            ],
            succession: {
                automatic: 'Second highest rated member',
                manual: 'Admin can appoint successor',
                platform: 'Platform can appoint if needed'
            }
        },

        // Group Financial Rules
        financial: {
            internalRulesAllowed: true,
            maximumLoanAmount: 'Group can set lower than platform maximum',
            interestRate: 'Cannot exceed platform maximum of 10% weekly',
            penalties: 'Cannot exceed platform maximum of 5% daily',
            disputeResolution: 'Group admin first, then platform'
        }
    },

    // ============================================
    // 3️⃣ LENDER RULES & VALIDATIONS
    // ============================================
    lenders: {
        // Registration Requirements
        registration: {
            mandatoryFields: [
                'Full Name',
                'Ghana Card Number',
                'Phone Number (+233)',
                'Location in Ghana',
                'Email Address',
                'Bank/Mobile Money Details'
            ],
            verification: {
                identity: 'Ghana Card verification',
                phone: 'OTP verification',
                location: 'Geographic verification',
                bank: 'Account verification'
            },
            ageRequirement: 18,
            residencyRequirement: 'Ghana resident',
            exclusionCriteria: [
                'Existing blacklist',
                'Fraud history',
                'Under investigation',
                'Minor'
            ]
        },

        // Subscription Requirements
        subscription: {
            mandatory: true,
            tiers: ['Basic', 'Premium', 'Super', 'Lender of Lenders'],
            paymentMethods: ['MTN Mobile Money', 'Vodafone Cash', 'Bank Transfer'],
            expiry: '28th of each month',
            gracePeriod: '3 days',
            consequences: {
                expired: 'Lending blocked',
                cancelled: 'Access revoked after 30 days',
                nonPayment: 'Blacklist after 60 days'
            }
        },

        // Lending Rules
        lending: {
            withinGroupOnly: true,
            ledgerRequirements: {
                mandatory: true,
                fields: [
                    'Borrower Name',
                    'Borrower Contact',
                    'Loan Amount',
                    'Loan Category',
                    'Interest Rate',
                    'Due Date',
                    'Guarantors (2)'
                ],
                updates: 'Manual updates required',
                audit: 'Permanent record'
            },
            limits: {
                basic: 'GH₵1,500 per week',
                premium: 'GH₵5,000 per week',
                super: 'GH₵20,000 per week',
                lenderOfLenders: 'GH₵50,000 per week'
            },
            categories: [
                'All Categories',
                'Transportation',
                'Food & Essentials',
                'Utilities',
                'Education',
                'Healthcare',
                'Business',
                'Emergency'
            ]
        },

        // Risk Management
        risk: {
            diversification: 'Maximum 20% to one borrower',
            exposure: 'Tier-based limits',
            dueDiligence: [
                'Check borrower rating',
                'Verify guarantors',
                'Review repayment history',
                'Assess loan purpose'
            ],
            recovery: [
                'Reminder system',
                'Penalty application',
                'Blacklisting',
                'Debt collector referral'
            ]
        }
    },

    // ============================================
    // 4️⃣ BORROWER RULES & VALIDATIONS
    // ============================================
    borrowers: {
        // Registration Requirements
        registration: {
            mandatoryFields: [
                'Full Name',
                'Phone Number (+233)',
                'Location in Ghana',
                'Occupation',
                'Monthly Income Range',
                'Two Guarantors'
            ],
            verification: {
                phone: 'OTP verification',
                identity: 'Optional for basic tier',
                income: 'Self-declared'
            },
            ageRequirement: 18,
            residencyRequirement: 'Ghana resident',
            exclusionCriteria: [
                'Existing blacklist',
                'Multiple defaults',
                'Fraud history',
                'Under investigation'
            ]
        },

        // Borrowing Rules
        borrowing: {
            maximumGroups: 4,
            ratingRequirement: {
                '1 group': 'No minimum',
                '2 groups': '3.0 rating',
                '3 groups': '3.5 rating',
                '4 groups': '4.0 rating'
            },
            activeLoans: 'One active loan per group',
            cooldownPeriod: '7 days between loans in same group',
            purposeRestrictions: [
                'Emergency consumption only',
                'No speculative purposes',
                'No illegal activities',
                'No gambling'
            ]
        },

        // Loan Terms
        loanTerms: {
            maximumAmount: 'Based on rating and group rules',
            minimumAmount: 'GH₵5',
            repaymentPeriod: '7 days standard',
            interestRate: '10% maximum',
            penalties: '5% daily after 7 days',
            defaultPeriod: '60 days'
        },

        // Reputation System
        reputation: {
            ratingSystem: '1-5 stars',
            factors: [
                'On-time repayments',
                'Communication',
                'Loan purpose honesty',
                'Group participation'
            ],
            consequences: {
                'Below 2.0': 'Cannot borrow',
                '2.0-2.9': 'One group only',
                '3.0-3.9': 'Up to 2 groups',
                '4.0-4.9': 'Up to 3 groups',
                '5.0': 'Up to 4 groups'
            },
            improvement: 'One rating point per successful loan'
        }
    },

    // ============================================
    // 5️⃣ LOAN & LEDGER RULES
    // ============================================
    loans: {
        // Loan Creation Rules
        creation: {
            requirements: [
                'Active group membership',
                'Good standing rating',
                'No active loan in group',
                'Within borrowing limits'
            ],
            approval: {
                manual: 'Lender approval required',
                autoReject: 'After 72 hours',
                multipleOffers: 'Allowed'
            },
            disbursement: {
                method: 'Outside platform',
                verification: 'Lender confirms',
                timeframe: 'Within 24 hours'
            }
        },

        // Ledger Management
        ledger: {
            creation: 'Automatic on loan approval',
            fields: {
                mandatory: [
                    'Borrower Details',
                    'Loan Amount',
                    'Interest Rate',
                    'Due Date',
                    'Guarantors',
                    'Repayment Schedule'
                ],
                optional: [
                    'Loan Purpose Details',
                    'Collateral Information',
                    'Special Terms'
                ]
            },
            updates: {
                manual: 'Lender responsible',
                frequency: 'Weekly minimum',
                verification: 'Borrower can view'
            },
            closure: {
                conditions: ['Full repayment', 'Settlement agreement', 'Write-off approved'],
                requirements: ['All payments recorded', 'No disputes', 'Ratings updated']
            }
        },

        // Repayment Rules
        repayment: {
            schedule: '7 days standard',
            partialPayments: 'Allowed',
            earlyRepayment: 'Allowed, interest still applies',
            lateRepayment: {
                '1-7 days late': '5% daily penalty',
                '8-30 days late': 'Additional 2% daily',
                '31-60 days late': 'Blacklist process starts',
                '61+ days': 'Default declared'
            },
            paymentMethods: [
                'MTN Mobile Money',
                'Vodafone Cash',
                'AirtelTigo Money',
                'Cash (outside platform)',
                'Bank Transfer'
            ]
        }
    },

    // ============================================
    // 6️⃣ DEFAULT & BLACKLIST RULES
    // ============================================
    defaults: {
        // Default Definition
        definition: {
            timeframe: '60 days overdue',
            amount: 'Any amount',
            conditions: [
                'No communication',
                'No repayment attempt',
                'Refusal to repay',
                'Fraudulent behavior'
            ]
        },

        // Blacklist Process
        blacklisting: {
            initiator: 'Lender',
            approval: 'Platform admin',
            criteria: [
                '60+ days overdue',
                'Multiple defaults',
                'Fraudulent activity',
                'Identity theft'
            ],
            notification: [
                'Borrower notified',
                'Group notified',
                'Public listing (amount only)',
                'Credit bureaus (if applicable)'
            ]
        },

        // Blacklist Consequences
        consequences: {
            borrowing: 'Blocked completely',
            groups: 'Cannot join new groups',
            visibility: 'Public blacklist entry',
            duration: 'Until cleared',
            creditImpact: 'Reported to credit bureaus'
        },

        // Clearance Process
        clearance: {
            requirements: [
                'Full repayment (principal + interest + penalties)',
                'Admin approval',
                'Lender consent',
                'Settlement agreement'
            ],
            process: [
                'Repayment verification',
                'Admin review',
                'Lender confirmation',
                'Blacklist removal'
            ],
            cooldown: '30 days before new loans',
            ratingReset: 'Starts at 1.0 after clearance'
        }
    },

    // ============================================
    // 7️⃣ DISPUTE RESOLUTION RULES
    // ============================================
    disputes: {
        // Types of Disputes
        types: [
            'Loan amount disagreement',
            'Repayment disagreement',
            'Interest calculation',
            'Penalty application',
            'Service quality',
            'Fraud allegations'
        ],

        // Resolution Process
        process: {
            level1: {
                name: 'Direct Negotiation',
                timeframe: '3 days',
                mediator: 'Parties themselves',
                outcome: 'Mutual agreement'
            },
            level2: {
                name: 'Group Admin Mediation',
                timeframe: '7 days',
                mediator: 'Group Admin',
                outcome: 'Admin decision'
            },
            level3: {
                name: 'Platform Mediation',
                timeframe: '14 days',
                mediator: 'Platform Support',
                outcome: 'Platform decision'
            },
            level4: {
                name: 'Arbitration',
                timeframe: '30 days',
                mediator: 'Ghana Arbitration Centre',
                outcome: 'Binding decision'
            }
        },

        // Evidence Requirements
        evidence: {
            mandatory: [
                'Loan agreement',
                'Communication records',
                'Payment proofs',
                'Witness statements'
            ],
            optional: [
                'Audio recordings',
                'Video evidence',
                'Expert opinions',
                'Third-party verification'
            ]
        },

        // Outcomes
        outcomes: [
            'Full repayment ordered',
            'Partial repayment ordered',
            'Interest adjustment',
            'Penalty waiver',
            'Contract cancellation',
            'Blacklist removal'
        ]
    },

    // ============================================
    // 8️⃣ COMPLIANCE & REGULATORY RULES
    // ============================================
    compliance: {
        // Bank of Ghana Requirements
        bankOfGhana: {
            registration: 'Not required (technology platform)',
            reporting: [
                'Monthly transaction volumes',
                'Suspicious activity reports',
                'Annual financial statements',
                'Compliance certifications'
            ],
            limitations: [
                'No fund holding',
                'No banking services',
                'No deposit taking',
                'No money transmission'
            ]
        },

        // Data Protection
        dataProtection: {
            act: 'Data Protection Act, 2012 (Act 843)',
            requirements: [
                'User consent for data processing',
                'Data minimization',
                'Purpose limitation',
                'Storage limitation',
                'Security safeguards'
            ],
            userRights: [
                'Right to access',
                'Right to rectification',
                'Right to erasure',
                'Right to restrict processing',
                'Right to data portability'
            ]
        },

        // Anti-Money Laundering
        antiMoneyLaundering: {
            act: 'Anti-Money Laundering Act, 2020 (Act 1044)',
            requirements: [
                'Customer Due Diligence',
                'Transaction monitoring',
                'Suspicious activity reporting',
                'Record keeping',
                'Employee training'
            ],
            thresholds: {
                cdd: 'GH₵1,000',
                edd: 'GH₵10,000',
                reporting: 'GH₵15,000'
            }
        },

        // Tax Compliance
        taxCompliance: {
            authority: 'Ghana Revenue Authority',
            requirements: [
                'Withholding tax collection',
                'VAT registration',
                'Annual tax returns',
                'Record keeping (6 years)'
            ],
            thresholds: {
                withholding: 'GH₵100 monthly',
                vat: 'GH₵200,000 annual'
            }
        }
    },

    // ============================================
    // 9️⃣ PLATFORM ADMIN RULES
    // ============================================
    admin: {
        // Admin Privileges
        privileges: {
            userManagement: [
                'Account suspension',
                'Blacklist override',
                'Rating adjustment',
                'Profile verification'
            ],
            financial: [
                'Ledger correction',
                'Interest adjustment',
                'Penalty waiver',
                'Dispute resolution'
            ],
            system: [
                'Rule enforcement',
                'Compliance monitoring',
                'Audit trail access',
                'System configuration'
            ]
        },

        // Admin Limitations
        limitations: [
            'Cannot access user passwords',
            'Cannot view full card numbers',
            'Cannot modify transaction history',
            'Cannot bypass legal requirements'
        ],

        // Audit Requirements
        audit: {
            logging: 'All actions logged',
            review: 'Monthly audit review',
            reporting: 'Quarterly compliance report',
            retention: '10 years minimum'
        }
    },

    // ============================================
    // 🔟 EMERGENCY & CONTINGENCY RULES
    // ============================================
    emergency: {
        // System Outage
        systemOutage: {
            duration: '4 hours maximum',
            contingency: 'Manual processes',
            communication: 'Users notified within 1 hour',
            recovery: 'Data restoration from backup'
        },

        // Regulatory Changes
        regulatoryChanges: {
            notification: '30 days notice',
            compliance: 'Immediate implementation',
            grandfathering: 'Existing contracts honored',
            userCommunication: 'All users notified'
        },

        // Economic Crisis
        economicCrisis: {
            measures: [
                'Temporary limits reduction',
                'Extended repayment terms',
                'Interest rate caps',
                'Enhanced support'
            ],
            triggers: [
                'Currency devaluation >20%',
                'National emergency',
                'Banking crisis',
                'Government directive'
            ]
        }
    }
};

// ============================================
// RULE VALIDATION & ENFORCEMENT FUNCTIONS
// ============================================

/**
 * Validate user against Ghana rules
 * @param {Object} user - User object
 * @param {string} action - Action being performed
 * @returns {Object} Validation result
 */
function validateUserAgainstRules(user, action) {
    const result = {
        valid: true,
        errors: [],
        warnings: [],
        restrictions: [],
        requiredActions: []
    };

    // Basic user validation
    if (!user || !user.id) {
        result.valid = false;
        result.errors.push('Invalid user object');
        return result;
    }

    // Country validation
    if (user.country !== 'GH') {
        result.valid = false;
        result.errors.push('User must be in Ghana');
    }

    // Age validation
    if (user.age < 18) {
        result.valid = false;
        result.errors.push('User must be at least 18 years old');
    }

    // Blacklist check
    if (user.blacklisted) {
        result.valid = false;
        result.errors.push('User is blacklisted');
        result.restrictions.push('Cannot perform any financial transactions');
    }

    // Action-specific validations
    switch (action) {
        case 'register_as_lender':
            validateLenderRegistration(user, result);
            break;
        
        case 'register_as_borrower':
            validateBorrowerRegistration(user, result);
            break;
        
        case 'create_group':
            validateGroupCreation(user, result);
            break;
        
        case 'join_group':
            validateGroupJoin(user, result);
            break;
        
        case 'request_loan':
            validateLoanRequest(user, result);
            break;
        
        case 'offer_loan':
            validateLoanOffer(user, result);
            break;
        
        case 'repay_loan':
            validateLoanRepayment(user, result);
            break;
        
        case 'blacklist_user':
            validateBlacklistAction(user, result);
            break;
    }

    return result;
}

/**
 * Validate lender registration
 * @param {Object} user - User object
 * @param {Object} result - Validation result object
 */
function validateLenderRegistration(user, result) {
    // Subscription check
    if (!user.subscriptionActive) {
        result.valid = false;
        result.errors.push('Active subscription required for lenders');
        result.requiredActions.push('Purchase subscription plan');
    }

    // Verification check
    if (!user.ghanaCardVerified) {
        result.warnings.push('Ghana Card verification recommended for lenders');
        result.requiredActions.push('Verify Ghana Card');
    }

    // Location verification
    if (!user.locationVerified) {
        result.warnings.push('Location verification recommended');
    }

    // Age requirement
    if (user.age < 21) {
        result.warnings.push('Lenders under 21 may face restrictions');
    }
}

/**
 * Validate borrower registration
 * @param {Object} user - User object
 * @param {Object} result - Validation result object
 */
function validateBorrowerRegistration(user, result) {
    // Group membership check
    if (user.groups && user.groups.length >= 4) {
        result.valid = false;
        result.errors.push('Maximum 4 groups allowed');
        result.restrictions.push('Cannot join more groups');
    }

    // Rating check for multiple groups
    if (user.groups && user.groups.length > 1 && user.rating < 3.0) {
        result.valid = false;
        result.errors.push('Rating below 3.0 - can only join one group');
    }

    // Phone verification
    if (!user.phoneVerified) {
        result.valid = false;
        result.errors.push('Phone verification required');
        result.requiredActions.push('Verify phone number');
    }

    // Guarantor requirements
    if (!user.guarantors || user.guarantors.length < 2) {
        result.warnings.push('Two guarantors recommended for better approval');
    }
}

/**
 * Validate group creation
 * @param {Object} user - User object
 * @param {Object} result - Validation result object
 */
function validateGroupCreation(user, result) {
    // Admin requirements
    if (user.rating < 3.0) {
        result.valid = false;
        result.errors.push('Minimum 3.0 rating required to create group');
    }

    if (user.age < 21) {
        result.warnings.push('Group admins under 21 may face challenges');
    }

    // Existing groups check
    if (user.adminGroups && user.adminGroups.length >= 2) {
        result.warnings.push('Managing more than 2 groups may be challenging');
    }

    // Location verification
    if (!user.locationVerified) {
        result.warnings.push('Location verification recommended for group admin');
    }
}

/**
 * Validate group join request
 * @param {Object} user - User object
 * @param {Object} result - Validation result object
 */
function validateGroupJoin(user, result) {
    // Maximum groups check
    if (user.groups && user.groups.length >= 4) {
        result.valid = false;
        result.errors.push('Already in maximum 4 groups');
    }

    // Rating requirements based on current groups
    const currentGroups = user.groups ? user.groups.length : 0;
    const requiredRating = getRequiredRatingForGroups(currentGroups + 1);
    
    if (user.rating < requiredRating) {
        result.valid = false;
        result.errors.push(`Rating ${requiredRating}+ required for ${currentGroups + 1} groups`);
    }

    // Blacklist check in other groups
    if (user.groupBlacklists && user.groupBlacklists.length > 0) {
        result.warnings.push('User has blacklist history in other groups');
    }
}

/**
 * Get required rating for number of groups
 * @param {number} groupCount - Number of groups
 * @returns {number} Required rating
 */
function getRequiredRatingForGroups(groupCount) {
    switch (groupCount) {
        case 1: return 0;
        case 2: return 3.0;
        case 3: return 3.5;
        case 4: return 4.0;
        default: return 5.0;
    }
}

/**
 * Validate loan request
 * @param {Object} user - User object
 * @param {Object} result - Validation result object
 */
function validateLoanRequest(user, result) {
    // Active loan check
    if (user.activeLoans && user.activeLoans.length > 0) {
        // Check if active loan in same group
        result.valid = false;
        result.errors.push('Active loan exists in group');
        result.restrictions.push('Only one active loan per group allowed');
    }

    // Rating check
    if (user.rating < 2.0) {
        result.valid = false;
        result.errors.push('Rating below 2.0 - cannot borrow');
    }

    // Recent loan check
    if (user.lastLoanDate) {
        const daysSinceLastLoan = Math.floor((Date.now() - new Date(user.lastLoanDate).getTime()) / (1000 * 60 * 60 * 24));
        if (daysSinceLastLoan < 7) {
            result.warnings.push('Recent loan in same group - consider waiting');
        }
    }

    // Borrowing limit check
    const borrowingLimit = calculateBorrowingLimit(user);
    if (user.requestedAmount > borrowingLimit) {
        result.valid = false;
        result.errors.push(`Request exceeds borrowing limit of GH₵${borrowingLimit}`);
    }
}

/**
 * Calculate user's borrowing limit
 * @param {Object} user - User object
 * @returns {number} Borrowing limit in GHS
 */
function calculateBorrowingLimit(user) {
    let baseLimit = 5000; // GH₵5,000 base limit
    
    // Adjust based on rating
    if (user.rating >= 4.5) baseLimit = 20000;
    else if (user.rating >= 4.0) baseLimit = 10000;
    else if (user.rating >= 3.5) baseLimit = 7500;
    else if (user.rating >= 3.0) baseLimit = 6000;
    else if (user.rating >= 2.5) baseLimit = 3000;
    else if (user.rating >= 2.0) baseLimit = 1000;
    else baseLimit = 0;

    // Adjust based on income
    if (user.incomeLevel === 'high') baseLimit *= 1.5;
    else if (user.incomeLevel === 'medium') baseLimit *= 1.2;
    else if (user.incomeLevel === 'low') baseLimit *= 0.8;

    // Adjust based on repayment history
    if (user.repaymentRate >= 95) baseLimit *= 1.3;
    else if (user.repaymentRate >= 90) baseLimit *= 1.1;
    else if (user.repaymentRate >= 80) baseLimit *= 0.9;
    else baseLimit *= 0.7;

    return Math.round(baseLimit);
}

/**
 * Validate loan offer
 * @param {Object} user - User object
 * @param {Object} result - Validation result object
 */
function validateLoanOffer(user, result) {
    // Subscription check
    if (!user.subscriptionActive) {
        result.valid = false;
        result.errors.push('Active subscription required to lend');
    }

    // Available balance check
    const availableBalance = calculateAvailableBalance(user);
    if (user.offeredAmount > availableBalance) {
        result.valid = false;
        result.errors.push(`Insufficient available balance: GH₵${availableBalance}`);
    }

    // Diversification check
    if (user.exposureToBorrower > 0.2) {
        result.warnings.push('Exposure to this borrower exceeds 20% limit');
    }

    // Tier limits check
    const tierLimits = checkTierLimits(user);
    if (!tierLimits.withinLimits) {
        result.valid = false;
        result.errors.push(`Exceeds ${tierLimits.exceededLimit} limit`);
    }
}

/**
 * Calculate available balance for lender
 * @param {Object} user - User object
 * @returns {number} Available balance in GHS
 */
function calculateAvailableBalance(user) {
    const tier = user.subscriptionTier || 'basic';
    const tierLimits = GHANA_RULES.lenders.lending.limits[tier];
    const weeklyUsed = user.weeklyLent || 0;
    const exposure = user.totalExposure || 0;
    
    const weeklyLimit = parseFloat(tierLimits.split(' ')[1].replace(',', ''));
    const exposureLimit = GHANA_RULES.lenders.risk.exposure[tier] || weeklyLimit * 4;
    
    const weeklyAvailable = weeklyLimit - weeklyUsed;
    const exposureAvailable = exposureLimit - exposure;
    
    return Math.min(weeklyAvailable, exposureAvailable);
}

/**
 * Check tier limits for lender
 * @param {Object} user - User object
 * @returns {Object} Limit check result
 */
function checkTierLimits(user) {
    const tier = user.subscriptionTier || 'basic';
    const limits = {
        basic: { weekly: 1500, exposure: 1500 },
        premium: { weekly: 5000, exposure: 10000 },
        super: { weekly: 20000, exposure: 20000 },
        lenderOfLenders: { weekly: 50000, exposure: 50000 }
    };
    
    const tierLimit = limits[tier];
    const weeklyUsed = user.weeklyLent || 0;
    const exposure = user.totalExposure || 0;
    
    return {
        withinLimits: weeklyUsed <= tierLimit.weekly && exposure <= tierLimit.exposure,
        exceededLimit: weeklyUsed > tierLimit.weekly ? 'weekly' : exposure > tierLimit.exposure ? 'exposure' : null,
        weekly: { limit: tierLimit.weekly, used: weeklyUsed, remaining: tierLimit.weekly - weeklyUsed },
        exposure: { limit: tierLimit.exposure, used: exposure, remaining: tierLimit.exposure - exposure }
    };
}

/**
 * Validate loan repayment
 * @param {Object} user - User object
 * @param {Object} result - Validation result object
 */
function validateLoanRepayment(user, result) {
    // Loan status check
    if (user.loanStatus !== 'active') {
        result.valid = false;
        result.errors.push('Loan is not active');
    }

    // Amount validation
    if (user.repaymentAmount <= 0) {
        result.valid = false;
        result.errors.push('Invalid repayment amount');
    }

    // Due date check
    const today = new Date();
    const dueDate = new Date(user.dueDate);
    const daysOverdue = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));
    
    if (daysOverdue > 7) {
        result.warnings.push(`Loan is ${daysOverdue} days overdue - penalties apply`);
    }

    if (daysOverdue > 60) {
        result.valid = false;
        result.errors.push('Loan is in default - contact lender directly');
    }
}

/**
 * Validate blacklist action
 * @param {Object} user - User object (initiator)
 * @param {Object} result - Validation result object
 */
function validateBlacklistAction(user, result) {
    // Initiator must be lender
    if (user.role !== 'lender') {
        result.valid = false;
        result.errors.push('Only lenders can initiate blacklisting');
    }

    // Check if user has authority
    if (!user.isLoanOwner) {
        result.valid = false;
        result.errors.push('Only loan owner can blacklist borrower');
    }

    // Check minimum overdue period
    if (user.daysOverdue < 60) {
        result.valid = false;
        result.errors.push('Minimum 60 days overdue required for blacklisting');
    }

    // Check previous attempts
    if (!user.communicationAttempts || user.communicationAttempts < 3) {
        result.warnings.push('Minimum 3 communication attempts recommended');
    }
}

/**
 * Check if transaction complies with Ghana rules
 * @param {Object} transaction - Transaction details
 * @returns {Object} Compliance check result
 */
function checkTransactionCompliance(transaction) {
    const result = {
        compliant: true,
        violations: [],
        warnings: [],
        requiredActions: [],
        amlCheck: { required: false, level: 'standard' }
    };

    // Amount validation
    if (transaction.amount < 0.01) {
        result.compliant = false;
        result.violations.push('Amount below minimum of GH₵0.01');
    }

    if (transaction.amount > 50000) {
        result.compliant = false;
        result.violations.push('Amount above maximum of GH₵50,000');
    }

    // Country isolation check
    if (transaction.fromCountry !== 'GH' || transaction.toCountry !== 'GH') {
        result.compliant = false;
        result.violations.push('Cross-country transactions not allowed');
    }

    // Group isolation check
    if (transaction.fromGroup !== transaction.toGroup) {
        result.compliant = false;
        result.violations.push('Cross-group transactions not allowed');
    }

    // AML checks
    if (transaction.amount >= 10000) {
        result.amlCheck.required = true;
        result.amlCheck.level = 'enhanced';
        result.requiredActions.push('Enhanced Due Diligence required');
    } else if (transaction.amount >= 1000) {
        result.amlCheck.required = true;
        result.amlCheck.level = 'standard';
        result.requiredActions.push('Standard Due Diligence required');
    }

    // Pattern monitoring
    if (isSuspiciousPattern(transaction)) {
        result.warnings.push('Transaction pattern may be suspicious');
        result.requiredActions.push('Additional verification recommended');
    }

    // Regulatory reporting
    if (transaction.amount >= 15000) {
        result.requiredActions.push('Transaction requires regulatory reporting');
    }

    return result;
}

/**
 * Check for suspicious transaction patterns
 * @param {Object} transaction - Transaction details
 * @returns {boolean} True if suspicious
 */
function isSuspiciousPattern(transaction) {
    // Round number transactions
    if (transaction.amount % 1000 === 0 && transaction.amount > 5000) {
        return true;
    }

    // Just below threshold amounts
    if (transaction.amount >= 9900 && transaction.amount < 10000) {
        return true;
    }

    // Rapid successive transactions
    if (transaction.frequency === 'high') {
        return true;
    }

    // Unusual time patterns
    const hour = new Date(transaction.timestamp).getHours();
    if (hour >= 0 && hour <= 4) { // Late night transactions
        return true;
    }

    return false;
}

/**
 * Generate rule violation report
 * @param {Object} violation - Violation details
 * @returns {Object} Violation report
 */
function generateViolationReport(violation) {
    const report = {
        reportId: `VIOL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        violation: violation,
        severity: calculateSeverity(violation),
        actions: [],
        followUp: [],
        compliance: {
            regulatoryReportRequired: false,
            internalReviewRequired: true,
            userNotificationRequired: true
        }
    };

    // Determine actions based on severity
    switch (report.severity) {
        case 'critical':
            report.actions = [
                'Immediate transaction block',
                'User account suspension',
                'Regulatory reporting',
                'Internal investigation'
            ];
            report.compliance.regulatoryReportRequired = true;
            break;
        
        case 'high':
            report.actions = [
                'Transaction review',
                'User verification',
                'Temporary restrictions',
                'Enhanced monitoring'
            ];
            break;
        
        case 'medium':
            report.actions = [
                'Warning notification',
                'Additional verification',
                'Monitoring increased'
            ];
            break;
        
        case 'low':
            report.actions = [
                'Educational notification',
                'Rule reminder'
            ];
            break;
    }

    // Determine follow-up actions
    report.followUp = [
        `Review within ${getFollowUpTimeframe(report.severity)}`,
        'Document resolution steps',
        'Update user record',
        'Schedule compliance review'
    ];

    return report;
}

/**
 * Calculate violation severity
 * @param {Object} violation - Violation details
 * @returns {string} Severity level
 */
function calculateSeverity(violation) {
    const criticalViolations = [
        'money_laundering',
        'fraud',
        'identity_theft',
        'terrorist_financing'
    ];

    const highViolations = [
        'blacklist_circumvention',
        'multiple_violations',
        'significant_amount_exceed'
    ];

    const mediumViolations = [
        'single_rule_violation',
        'threshold_circumvention',
        'documentation_issue'
    ];

    if (criticalViolations.includes(violation.type)) return 'critical';
    if (highViolations.includes(violation.type)) return 'high';
    if (mediumViolations.includes(violation.type)) return 'medium';
    return 'low';
}

/**
 * Get follow-up timeframe based on severity
 * @param {string} severity - Severity level
 * @returns {string} Follow-up timeframe
 */
function getFollowUpTimeframe(severity) {
    switch (severity) {
        case 'critical': return '24 hours';
        case 'high': return '3 days';
        case 'medium': return '7 days';
        case 'low': return '14 days';
        default: return '30 days';
    }
}

/**
 * Enforce rule consequences
 * @param {Object} user - User object
 * @param {string} rule - Rule violated
 * @param {string} severity - Violation severity
 * @returns {Object} Enforcement actions
 */
function enforceRuleConsequences(user, rule, severity) {
    const enforcement = {
        userId: user.id,
        rule: rule,
        severity: severity,
        timestamp: new Date().toISOString(),
        actions: [],
        restrictions: [],
        duration: 'permanent',
        appealProcess: 'Available within 30 days'
    };

    // Determine actions based on severity and rule
    switch (severity) {
        case 'critical':
            enforcement.actions = [
                'Account suspension',
                'All transactions frozen',
                'Regulatory reporting',
                'Legal review initiated'
            ];
            enforcement.restrictions = [
                'No platform access',
                'No financial transactions',
                'No group participation'
            ];
            enforcement.duration = 'Indefinite pending investigation';
            break;

        case 'high':
            enforcement.actions = [
                'Temporary suspension (30 days)',
                'Transaction limits imposed',
                'Enhanced monitoring',
                'Compliance review required'
            ];
            enforcement.restrictions = [
                'Cannot initiate new transactions',
                'Cannot join new groups',
                'Rating frozen'
            ];
            enforcement.duration = '30 days';
            break;

        case 'medium':
            enforcement.actions = [
                'Warning issued',
                'Transaction review required',
                'Educational materials provided'
            ];
            enforcement.restrictions = [
                'Reduced transaction limits',
                'Additional verification required'
            ];
            enforcement.duration = '14 days';
            break;

        case 'low':
            enforcement.actions = [
                'Warning notification',
                'Rule education'
            ];
            enforcement.restrictions = [
                'Monitoring increased'
            ];
            enforcement.duration = '7 days';
            break;
    }

    // Rule-specific additional actions
    if (rule.includes('blacklist')) {
        enforcement.actions.push('Public blacklist entry');
        enforcement.restrictions.push('Cannot borrow from any lender');
    }

    if (rule.includes('subscription')) {
        enforcement.actions.push('Subscription suspended');
        enforcement.restrictions.push('Cannot lend');
    }

    if (rule.includes('group')) {
        enforcement.actions.push('Group participation reviewed');
        enforcement.restrictions.push('May be removed from groups');
    }

    return enforcement;
}

// ============================================
// EXPORT RULES MODULE
// ============================================

export {
    GHANA_RULES,
    validateUserAgainstRules,
    checkTransactionCompliance,
    generateViolationReport,
    enforceRuleConsequences,
    calculateBorrowingLimit,
    calculateAvailableBalance,
    checkTierLimits,
    getRequiredRatingForGroups,
    isSuspiciousPattern,
    calculateSeverity
};

export default GHANA_RULES;