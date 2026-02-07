/**
 * M-PESEWA - NIGERIA RULES MODULE
 * Strict business rules, hierarchy enforcement, and compliance regulations
 * Non-negotiable platform rules for Nigerian operations
 * Last Updated: 2026-01-24
 */

const NigeriaRules = {
    // ====================================================================
    // 1️⃣ HIERARCHY RULES (STRICT & NON-NEGOTIABLE)
    // ====================================================================
    hierarchy: {
        // Core hierarchy chain
        chain: "Global → Nigeria → Groups → Lenders → Borrowers (Ledgers)",
        
        // Level 1: Global
        global: {
            description: "Root level - Platform worldwide",
            rules: [
                "Platform brand and technology standards",
                "Global security and compliance framework",
                "Multi-country operational coordination"
            ]
        },
        
        // Level 2: Nigeria (Country Level)
        nigeria: {
            description: "Country container - Nigerian operations only",
            strictRules: [
                "NO cross-country lending or borrowing",
                "NO cross-country group membership",
                "NO cross-country fund transfers",
                "All operations must use Nigerian Naira (NGN)",
                "All users must be Nigerian residents with valid NIN",
                "All transactions must comply with Nigerian laws"
            ],
            isolation: {
                technical: "IP geolocation + phone verification",
                legal: "Separate legal entity in Nigeria",
                financial: "Separate bank accounts in Nigerian banks",
                data: "Data residency in Nigeria"
            }
        },
        
        // Level 3: Groups
        groups: {
            description: "Trusted circles within Nigeria",
            creationRules: [
                "Minimum 5 members to create a group",
                "Maximum 1000 members per group",
                "One Admin/Founder per group",
                "Group must have a clear purpose and name",
                "All members must be in Nigeria",
                "Invitation or referral only"
            ],
            membershipRules: [
                "Users can join maximum 4 groups",
                "Good rating required for multiple groups",
                "Blacklisted users cannot join new groups",
                "Group admin approval required",
                "Country-locked: Nigerian residents only"
            ],
            types: [
                "Family Groups",
                "Professional Associations",
                "Church/Mosque Groups",
                "Community Development Groups",
                "Business Networks",
                "Alumni Associations",
                "Social Clubs",
                "Cooperative Societies"
            ]
        },
        
        // Level 4: Lenders
        lenders: {
            description: "Money providers within groups",
            registrationRules: [
                "Must have active subscription",
                "Must provide BVN and NIN",
                "Must have Nigerian bank account",
                "Must select subscription tier",
                "Must choose lending categories",
                "Must provide referrer/guarantor contacts"
            ],
            lendingRules: [
                "Can only lend within their groups",
                "Cannot exceed subscription limits",
                "Must maintain ledgers for each borrower",
                "Must rate borrowers after repayment",
                "Subscription expires 28th of each month",
                "Blocked if subscription expires"
            ],
            subscriptionEnforcement: {
                expiryDate: "28th of each month",
                gracePeriod: "None",
                consequences: "Complete lending access blocked",
                restoration: "Payment confirmation required"
            }
        },
        
        // Level 5: Borrowers (Ledgers)
        borrowers: {
            description: "Money recipients - tracked via ledgers",
            eligibilityRules: [
                "No subscription fees required",
                "Must have valid NIN",
                "Must provide two guarantors",
                "Must be member of at least one group",
                "Good rating required for multiple groups",
                "Cannot be blacklisted"
            ],
            borrowingRules: [
                "Can borrow from multiple lenders in same group",
                "One active loan per group at a time",
                "Maximum 7-day repayment period",
                "10% weekly interest",
                "5% daily penalty after 7 days",
                "Default after 2 months non-payment"
            ],
            ledgerRules: [
                "Each loan creates a ledger automatically",
                "Ledger tied to specific lender and borrower",
                "Lender manually updates repayment status",
                "Admin can override ledger entries",
                "Ledger includes guarantor contacts",
                "Ledger status: Active or Cleared"
            ]
        }
    },

    // ====================================================================
    // 2️⃣ USER ROLE RULES (STRICT SEPARATION)
    // ====================================================================
    roles: {
        // Individual base entity
        individual: {
            definition: "Base person entity in the system",
            properties: {
                id: "Unique identifier",
                groupId: "Group membership",
                roles: "[Borrower, Lender?]",
                state: "Depends on context"
            },
            rules: [
                "Every person is an Individual",
                "Exists inside a Group",
                "Can have multiple roles",
                "State depends on context"
            ]
        },
        
        // Borrower role rules
        borrower: {
            capabilities: [
                "Request emergency loans",
                "Join up to 4 groups",
                "Build reputation rating",
                "Make partial repayments",
                "Switch to lender role (separate registration)"
            ],
            restrictions: [
                "Cannot lend without separate lender registration",
                "Cannot exceed group borrowing limits",
                "Cannot borrow if blacklisted",
                "Cannot join new groups if blacklisted",
                "Must maintain good rating for multiple groups"
            ],
            freeAccess: [
                "No subscription fees",
                "No platform usage fees",
                "No hidden charges",
                "Only pay interest on loans"
            ]
        },
        
        // Lender role rules
        lender: {
            capabilities: [
                "Provide loans within groups",
                "Create unlimited ledgers",
                "Rate borrowers (1-5 stars)",
                "Apply blacklist badges",
                "Track repayments manually",
                "Earn 10% weekly interest"
            ],
            requirements: [
                "Active subscription required",
                "BVN verification mandatory",
                "NIN verification mandatory",
                "Bank account in Nigerian bank",
                "Clean credit history (for higher tiers)"
            ],
            subscriptionTiers: {
                basic: {
                    weeklyLimit: 1500,
                    features: ["Up to 5 active loans", "Basic reporting", "Email support"],
                    crb: "Not required"
                },
                premium: {
                    weeklyLimit: 5000,
                    features: ["Up to 20 active loans", "Advanced analytics", "Priority support"],
                    crb: "Not required"
                },
                super: {
                    weeklyLimit: 20000,
                    features: ["Unlimited loans", "CRB integration", "Dedicated account manager"],
                    crb: "Required"
                },
                lenderOfLenders: {
                    weeklyLimit: 50000,
                    features: ["Custom interest rates", "Longer repayment periods", "VIP support"],
                    crb: "Required"
                }
            }
        },
        
        // Dual role rules
        dualRole: {
            allowed: true,
            rules: [
                "Separate registrations required",
                "Separate profiles maintained",
                "Cannot be borrower and lender in same transaction",
                "Must switch dashboards manually",
                "Separate reputations for each role"
            ],
            switching: {
                borrowerToLender: "New registration with subscription",
                lenderToBorrower: "Free registration",
                simultaneous: "Allowed but separate transactions"
            }
        },
        
        // Group Admin/Founder rules
        groupAdmin: {
            appointment: "First member to create group",
            responsibilities: [
                "Invite and moderate members",
                "Set group internal rules",
                "Resolve internal disputes",
                "Monitor group activity",
                "Ensure compliance with platform rules"
            ],
            privileges: [
                "Remove members (with cause)",
                "Appoint moderators",
                "Set group visibility",
                "View group analytics",
                "Contact platform admin"
            ],
            limitations: [
                "Cannot override ledgers",
                "Cannot waive interest",
                "Cannot change subscription status",
                "Cannot remove platform admin overrides"
            ]
        },
        
        // Platform Admin rules
        platformAdmin: {
            access: "Special login only",
            powers: [
                "Override any blacklist",
                "Edit or correct any ledger",
                "Moderate borrower ratings",
                "Validate debt collectors",
                "Suspend any user or group",
                "Access all system logs"
            ],
            restrictions: [
                "Cannot create fake transactions",
                "Cannot access user passwords",
                "Cannot modify subscription payment records",
                "All actions logged and audited"
            ]
        }
    },

    // ====================================================================
    // 3️⃣ LENDING & BORROWING RULES (STRICT)
    // ====================================================================
    lendingBorrowing: {
        // Loan terms (NON-NEGOTIABLE)
        loanTerms: {
            duration: {
                standard: "7 days",
                maximum: "30 days (special cases)",
                minimum: "1 day",
                extension: "Possible with lender agreement"
            },
            interest: {
                rate: "10% per week",
                calculation: "Simple interest",
                compounding: "None",
                example: "₦1,000 × 10% = ₦100 interest for 7 days"
            },
            penalties: {
                rate: "5% daily after due date",
                starts: "Day 8",
                maximum: "100% of principal",
                calculation: "Daily on outstanding balance"
            },
            default: {
                period: "2 months (60 days)",
                status: "Loan in default",
                consequences: "Blacklist badge applied",
                recovery: "Debt collectors may be engaged"
            }
        },
        
        // Repayment rules
        repayment: {
            methods: [
                "Direct bank transfer to lender",
                "USSD code transfer",
                "Mobile banking",
                "Agent network payment",
                "Cash (recorded in ledger)"
            ],
            partial: {
                allowed: true,
                minimum: "₦100 per transaction",
                frequency: "Daily allowed",
                interest: "Recalculated on remaining balance"
            },
            early: {
                allowed: true,
                interest: "Calculated only for days used",
                penalty: "None for early repayment",
                process: "Ledger marked as cleared"
            }
        },
        
        // Loan approval process
        approval: {
            steps: [
                "Borrower submits loan request in group",
                "Lenders in group receive notification",
                "Lenders review borrower profile and rating",
                "Lender selects amount and terms",
                "System generates automatic ledger",
                "Lender disburses funds off-platform",
                "Loan becomes active in system"
            ],
            requirements: [
                "Borrower must be group member",
                "Borrower must have good rating",
                "Borrower must not be blacklisted",
                "Lender must have active subscription",
                "Lender must have available limit",
                "Guarantor contacts must be provided"
            ]
        },
        
        // Cross-group borrowing restrictions
        crossGroup: {
            allowed: true,
            limits: "Maximum 4 groups",
            conditions: [
                "Good rating required",
                "Not blacklisted in any group",
                "Total borrowing across groups within tier limit",
                "Separate loans in each group"
            ],
            useCase: "Borrow in Group A to repay lender in Group B"
        }
    },

    // ====================================================================
    // 4️⃣ REPUTATION & BLACKLIST SYSTEM
    // ====================================================================
    reputation: {
        // Rating system (5-star)
        rating: {
            scale: "1 to 5 stars",
            criteria: [
                "Timeliness of repayment",
                "Communication with lender",
                "Honesty about circumstances",
                "Previous borrowing history",
                "Guarantor reliability"
            ],
            calculation: "Average of all lender ratings",
            impact: {
                "5 stars": "Access to all groups, priority lending",
                "4 stars": "Good standing, normal access",
                "3 stars": "Monitor closely, limited groups",
                "2 stars": "Restricted borrowing, more scrutiny",
                "1 star": "High risk, may be blocked"
            },
            update: "After each loan completion"
        },
        
        // Blacklist system
        blacklist: {
            triggers: [
                "2 months (60 days) of non-payment",
                "Fraudulent activity",
                "Multiple defaults",
                "False information provided"
            ],
            consequences: [
                "Cannot borrow from any lender",
                "Cannot join new groups",
                "Blacklist badge visible platform-wide",
                "Referenced in debt collector directory",
                "Reported to credit bureaus (if applicable)"
            ],
            removal: {
                who: "Only Platform Admin",
                conditions: [
                    "Full repayment (principal + interest + penalties)",
                    "Formal appeal process",
                    "Admin review and approval",
                    "Waiting period may apply"
                ],
                process: "Manual removal by Platform Admin only"
            },
            publicRegistry: {
                visible: "Yes, to all platform users",
                information: "Name, amount owed, days overdue, group",
                purpose: "Transparency and risk mitigation"
            }
        },
        
        // Default management
        defaults: {
            registry: "Public list of defaulters",
            criteria: "Beyond 2 months non-payment",
            clearance: "Only after full repayment + admin approval",
            retention: "7 years in records"
        }
    },

    // ====================================================================
    // 5️⃣ SUBSCRIPTION RULES (LENDERS ONLY)
    // ====================================================================
    subscriptions: {
        // Revenue model
        model: {
            statement: "Platform earns ONLY from lender subscriptions",
            borrowerFees: "None",
            loanCommissions: "None",
            hiddenCharges: "None"
        },
        
        // Tier specifications
        tiers: {
            basic: {
                weeklyLimit: "≤ ₦1,500",
                monthly: "₦50 / month",
                quarterly: "₦140 / quarter",
                semiAnnual: "₦250 / 6 months",
                annual: "₦500 / year",
                crb: "Not required",
                ledgerLimit: "Cannot exceed ₦1,500"
            },
            premium: {
                weeklyLimit: "≤ ₦5,000",
                monthly: "₦250 / month",
                quarterly: "₦700 / quarter",
                semiAnnual: "₦1,500 / 6 months",
                annual: "₦2,500 / year",
                crb: "Not required",
                ledgerLimit: "Cannot exceed ₦10,000"
            },
            super: {
                weeklyLimit: "≤ ₦20,000",
                monthly: "₦1,000 / month",
                quarterly: "₦2,800 / quarter",
                semiAnnual: "₦5,000 / 6 months",
                annual: "₦8,500 / year",
                crb: "Required",
                ledgerLimit: "Cannot exceed ₦20,000"
            },
            lenderOfLenders: {
                weeklyLimit: "≤ ₦50,000",
                monthly: "₦500 / month",
                quarterly: "₦1,400 / quarter",
                semiAnnual: "₦3,500 / 6 months",
                annual: "₦6,500 / year",
                crb: "Required",
                terms: "Interest and repayment period decided by lender",
                minimumPeriod: "1 month"
            }
        },
        
        // Enforcement rules
        enforcement: {
            expiry: "28th of every month",
            gracePeriod: "None",
            blocking: "Complete platform access blocked",
            restoration: "Immediate upon payment confirmation",
            proration: "No proration - fixed monthly cycles"
        },
        
        // Payment process
        payment: {
            methods: [
                "Bank transfer",
                "USSD payment",
                "Debit card",
                "Bank deposit",
                "Agent payment"
            ],
            confirmation: "Manual verification required",
            receipt: "Automated digital receipt",
            invoice: "Monthly invoice available"
        }
    },

    // ====================================================================
    // 6️⃣ DEBT COLLECTORS MODULE RULES
    // ====================================================================
    debtCollectors: {
        // Platform role
        platformRole: {
            provides: "Directory of vetted collectors",
            doesNot: "Participate in recovery",
            disclaimer: "Platform is not involved in debt collection"
        },
        
        // Collector requirements
        requirements: [
            "Registered business in Nigeria",
            "Valid debt collection license",
            "Clean regulatory record",
            "Professional indemnity insurance",
            "Physical office address",
            "Verified contact information"
        ],
        
        // Directory information
        directory: {
            size: "200+ vetted collectors",
            information: [
                "Company name",
                "Contact person",
                "Phone numbers",
                "Email address",
                "Physical address",
                "Coverage areas",
                "Specializations",
                "Fee structure"
            ],
            search: "By location, specialization, rating"
        },
        
        // User engagement
        engagement: {
            lender: "May contact collectors directly",
            borrower: "May be contacted by collectors",
            agreement: "Direct between parties",
            platform: "No involvement in agreements"
        }
    },

    // ====================================================================
    // 7️⃣ EMERGENCY CATEGORIES RULES
    // ====================================================================
    emergencyCategories: {
        // Category definition
        definition: "Specific-purpose emergency loans",
        
        // All 20 categories
        categories: [
            {
                id: "fare",
                name: "M-pesewa Fare",
                description: "Transportation money for journeys",
                icon: "🚌",
                maxAmount: 5000,
                typicalTerm: "7 days"
            },
            {
                id: "data",
                name: "M-pesewa Data",
                description: "Mobile data bundles",
                icon: "📶",
                maxAmount: 2000,
                typicalTerm: "7 days"
            },
            {
                id: "gas",
                name: "M-pesewa Cooking Gas",
                description: "Cooking gas refill",
                icon: "🔥",
                maxAmount: 3000,
                typicalTerm: "7 days"
            },
            {
                id: "food",
                name: "M-pesewa Food",
                description: "Emergency food money",
                icon: "🍲",
                maxAmount: 5000,
                typicalTerm: "7 days"
            },
            {
                id: "wifi",
                name: "M-pesewa Wifi",
                description: "Internet subscription",
                icon: "📡",
                maxAmount: 3000,
                typicalTerm: "7 days"
            },
            {
                id: "water",
                name: "M-pesewa Water Bill",
                description: "Water utility bills",
                icon: "🚰",
                maxAmount: 2000,
                typicalTerm: "7 days"
            },
            {
                id: "electricity",
                name: "M-pesewa Electricity",
                description: "Electricity tokens/bills",
                icon: "⚡",
                maxAmount: 5000,
                typicalTerm: "7 days"
            },
            {
                id: "tv",
                name: "M-pesewa TV Subscription",
                description: "TV subscription fees",
                icon: "📺",
                maxAmount: 2000,
                typicalTerm: "7 days"
            },
            {
                id: "fuel",
                name: "M-pesewa Fuel",
                description: "Vehicle fuel money",
                icon: "⛽",
                maxAmount: 10000,
                typicalTerm: "7 days"
            },
            {
                id: "repair",
                name: "M-pesewa Repair",
                description: "Emergency repairs",
                icon: "🔧",
                maxAmount: 15000,
                typicalTerm: "14 days"
            },
            {
                id: "credo",
                name: "M-pesewa Credo",
                description: "Tools and equipment",
                icon: "🛠️",
                maxAmount: 10000,
                typicalTerm: "14 days"
            },
            {
                id: "sales",
                name: "M-Pesa Daily Sales Advance",
                description: "Daily business capital",
                icon: "🧾",
                maxAmount: 20000,
                typicalTerm: "7 days"
            },
            {
                id: "capital",
                name: "Working Capital Advance",
                description: "Business working capital",
                icon: "🏪",
                maxAmount: 50000,
                typicalTerm: "30 days"
            },
            {
                id: "soko",
                name: "M-Pesewa Soko Loan",
                description: "Market trading capital",
                icon: "🛒",
                maxAmount: 30000,
                typicalTerm: "14 days"
            },
            {
                id: "kidandaski",
                name: "M-Pesewa Kidandaski Loan",
                description: "Kiosk/stall capital",
                icon: "🏗️",
                maxAmount: 50000,
                typicalTerm: "30 days"
            },
            {
                id: "hawker",
                name: "M-Pesewa Hawker Loan",
                description: "Street vending capital",
                icon: "🚶‍♂️",
                maxAmount: 20000,
                typicalTerm: "14 days"
            },
            {
                id: "fuliziwa",
                name: "M-fuliziwa Loan",
                description: "M-Pesa Fuliza top-up",
                icon: "🔄",
                maxAmount: 10000,
                typicalTerm: "7 days"
            },
            {
                id: "medicine",
                name: "M-pesewa Medicine",
                description: "Medical emergency funds",
                icon: "💊",
                maxAmount: 20000,
                typicalTerm: "14 days"
            },
            {
                id: "school",
                name: "M-pesewa School Fees",
                description: "Education fees",
                icon: "🎓",
                maxAmount: 50000,
                typicalTerm: "30 days"
            },
            {
                id: "advance",
                name: "M-pesewa Advance",
                description: "General emergency advance",
                icon: "💸",
                maxAmount: 10000,
                typicalTerm: "7 days"
            }
        ],
        
        // Usage rules
        usage: {
            specific: "Must match declared purpose",
            verification: "Lender may request evidence",
            misappropriation: "May lead to blacklisting",
            multiple: "Can borrow for different categories simultaneously"
        }
    },

    // ====================================================================
    // 8️⃣ COMPLIANCE & LEGAL RULES
    // ====================================================================
    compliance: {
        // Nigerian regulations
        nigerianLaws: [
            "Central Bank of Nigeria Act",
            "Banks and Other Financial Institutions Act",
            "Money Laundering (Prohibition) Act",
            "Nigeria Data Protection Regulation",
            "Cybercrimes (Prohibition, Prevention, etc.) Act",
            "Federal Competition and Consumer Protection Act"
        ],
        
        // KYC requirements
        kyc: {
            individuals: [
                "National Identity Number (NIN)",
                "Bank Verification Number (BVN) - for lenders",
                "Valid government-issued ID",
                "Proof of address",
                "Passport photograph",
                "Phone number verification"
            ],
            businesses: [
                "CAC registration certificate",
                "Tax Identification Number",
                "Business bank account",
                "Directors' personal KYC",
                "Proof of business address"
            ]
        },
        
        // Reporting requirements
        reporting: {
            toCBN: "Monthly transaction reports",
            toNFIU: "Suspicious activity reports",
            toFIRS: "Tax remittance reports",
            internal: "Daily compliance monitoring"
        },
        
        // Dispute resolution
        disputes: {
            levels: [
                "Group internal resolution",
                "Platform mediation",
                "Formal arbitration",
                "Nigerian courts"
            ],
            jurisdiction: "Nigerian courts have exclusive jurisdiction"
        }
    },

    // ====================================================================
    // 9️⃣ ENFORCEMENT MECHANISMS
    // ====================================================================
    enforcement: {
        // Automated enforcement
        automated: [
            "Subscription expiry blocking",
            "Cross-country transaction prevention",
            "Rate limiting on transactions",
            "Blacklist badge application",
            "Group capacity enforcement"
        ],
        
        // Manual enforcement
        manual: [
            "Platform admin overrides",
            "Blacklist removal",
            "Dispute resolution",
            "Fraud investigation",
            "Regulatory reporting"
        ],
        
        // Penalties for rule violations
        penalties: {
            minor: "Warning and temporary restrictions",
            major: "Temporary suspension",
            severe: "Permanent ban and blacklisting",
            illegal: "Legal action and regulatory reporting"
        }
    }
};

// ====================================================================
// RULE ENFORCEMENT FUNCTIONS
// ====================================================================

/**
 * Validate hierarchy compliance for Nigerian operations
 * @param {Object} transaction - Transaction details
 * @returns {Object} Validation result
 */
function validateHierarchyCompliance(transaction) {
    const errors = [];
    const warnings = [];
    
    // Country isolation check
    if (transaction.country !== 'NG') {
        errors.push(`Transaction country ${transaction.country} violates Nigeria isolation rule`);
    }
    
    // Group membership check
    if (!transaction.groupId) {
        errors.push("Transaction must occur within a group");
    }
    
    // User role validation
    if (transaction.lenderId && transaction.borrowerId) {
        if (transaction.lenderId === transaction.borrowerId) {
            errors.push("User cannot be both lender and borrower in same transaction");
        }
    }
    
    // Subscription check for lenders
    if (transaction.lenderSubscriptionStatus === 'expired') {
        errors.push("Lender subscription expired - cannot lend");
    }
    
    // Group capacity check
    if (transaction.groupMemberCount > 1000) {
        errors.push("Group exceeds maximum capacity of 1000 members");
    }
    
    // User group count check
    if (transaction.userGroupCount > 4) {
        warnings.push("User is in maximum 4 groups - cannot join more");
    }
    
    return {
        compliant: errors.length === 0,
        errors,
        warnings,
        hierarchyLevel: determineHierarchyLevel(transaction)
    };
}

/**
 * Determine hierarchy level for transaction
 * @param {Object} transaction - Transaction details
 * @returns {string} Hierarchy level
 */
function determineHierarchyLevel(transaction) {
    if (transaction.platformAdminAction) return "Platform Admin";
    if (transaction.countryAdminAction) return "Nigeria Admin";
    if (transaction.groupAdminAction) return "Group Admin";
    if (transaction.lenderAction) return "Lender Level";
    if (transaction.borrowerAction) return "Borrower Level";
    return "Individual Level";
}

/**
 * Validate loan terms against Nigerian rules
 * @param {Object} loanTerms - Proposed loan terms
 * @param {string} lenderTier - Lender subscription tier
 * @returns {Object} Validation result
 */
function validateLoanTerms(loanTerms, lenderTier) {
    const errors = [];
    const allowedTerms = NigeriaRules.lendingBorrowing.loanTerms;
    
    // Amount validation
    const tierLimits = NigeriaRules.roles.lender.subscriptionTiers[lenderTier];
    if (!tierLimits) {
        errors.push(`Invalid subscription tier: ${lenderTier}`);
    } else if (loanTerms.amount > tierLimits.weeklyLimit) {
        errors.push(`Amount ${loanTerms.amount} exceeds ${lenderTier} tier limit of ${tierLimits.weeklyLimit}`);
    }
    
    // Duration validation
    if (loanTerms.duration > 30) {
        errors.push(`Duration ${loanTerms.duration} days exceeds maximum 30 days`);
    }
    
    if (loanTerms.duration < 1) {
        errors.push(`Duration must be at least 1 day`);
    }
    
    // Interest validation
    if (loanTerms.interestRate !== 0.10) {
        errors.push(`Interest rate must be 10% weekly, got ${loanTerms.interestRate * 100}%`);
    }
    
    // Penalty validation
    if (loanTerms.penaltyRate !== 0.05) {
        errors.push(`Penalty rate must be 5% daily after due date, got ${loanTerms.penaltyRate * 100}%`);
    }
    
    // Special rules for Lender of Lenders tier
    if (lenderTier === 'lenderOfLenders') {
        if (loanTerms.duration < 30) {
            warnings.push("Lender of Lenders typically uses longer repayment periods");
        }
    } else {
        // Standard tier duration check
        if (loanTerms.duration > 7) {
            warnings.push("Standard loan duration is 7 days - longer periods may increase risk");
        }
    }
    
    return {
        valid: errors.length === 0,
        errors,
        warnings,
        recommendedTerms: getRecommendedTerms(lenderTier)
    };
}

/**
 * Get recommended loan terms for tier
 * @param {string} tier - Subscription tier
 * @returns {Object} Recommended terms
 */
function getRecommendedTerms(tier) {
    const recommendations = {
        basic: {
            maxAmount: 1500,
            duration: 7,
            interest: 0.10,
            penalty: 0.05
        },
        premium: {
            maxAmount: 5000,
            duration: 7,
            interest: 0.10,
            penalty: 0.05
        },
        super: {
            maxAmount: 20000,
            duration: 7,
            interest: 0.10,
            penalty: 0.05
        },
        lenderOfLenders: {
            maxAmount: 50000,
            duration: 30,
            interest: "Negotiable",
            penalty: "Negotiable"
        }
    };
    
    return recommendations[tier] || recommendations.basic;
}

/**
 * Check if user can join additional groups
 * @param {Object} userProfile - User profile
 * @returns {Object} Eligibility result
 */
function checkGroupEligibility(userProfile) {
    const currentGroups = userProfile.groups?.length || 0;
    const maxGroups = 4;
    
    if (currentGroups >= maxGroups) {
        return {
            eligible: false,
            reason: `Already in maximum ${maxGroups} groups`,
            current: currentGroups,
            maximum: maxGroups
        };
    }
    
    if (userProfile.blacklisted) {
        return {
            eligible: false,
            reason: "Blacklisted users cannot join new groups",
            current: currentGroups,
            maximum: maxGroups
        };
    }
    
    if (userProfile.rating < 3 && currentGroups >= 2) {
        return {
            eligible: false,
            reason: "Low rating restricts multiple group membership",
            current: currentGroups,
            maximum: maxGroups,
            minimumRating: 3
        };
    }
    
    return {
        eligible: true,
        current: currentGroups,
        maximum: maxGroups,
        remaining: maxGroups - currentGroups
    };
}

/**
 * Validate subscription status and enforce rules
 * @param {Object} subscription - Subscription details
 * @param {Date} currentDate - Current date
 * @returns {Object} Enforcement result
 */
function enforceSubscriptionRules(subscription, currentDate = new Date()) {
    if (!subscription || !subscription.tier) {
        return {
            active: false,
            reason: "No active subscription",
            action: "Block all lending activities",
            canBorrow: true, // Borrowers don't need subscription
            canLend: false
        };
    }
    
    // Parse expiry date (28th of month)
    const expiryDate = new Date(subscription.expiryDate);
    
    // Check if expired
    if (currentDate > expiryDate) {
        return {
            active: false,
            expired: true,
            expiryDate: expiryDate.toISOString().split('T')[0],
            reason: "Subscription expired on 28th",
            action: "Block all lending activities",
            canBorrow: true,
            canLend: false,
            restoration: "Payment required"
        };
    }
    
    // Check days remaining
    const daysRemaining = Math.ceil((expiryDate - currentDate) / (1000 * 60 * 60 * 24));
    
    // Check if it's the expiry month (28th approaching)
    const isExpiryMonth = currentDate.getMonth() === expiryDate.getMonth() && 
                         currentDate.getFullYear() === expiryDate.getFullYear();
    
    let warnings = [];
    if (isExpiryMonth && daysRemaining <= 7) {
        warnings.push(`Subscription expires in ${daysRemaining} days on the 28th`);
    }
    
    // Get tier limits
    const tier = NigeriaRules.roles.lender.subscriptionTiers[subscription.tier];
    
    return {
        active: true,
        tier: subscription.tier,
        expiryDate: expiryDate.toISOString().split('T')[0],
        daysRemaining: daysRemaining,
        limits: {
            weekly: tier?.weeklyLimit || 0,
            features: tier?.features || []
        },
        canBorrow: true,
        canLend: true,
        warnings: warnings
    };
}

/**
 * Apply blacklist rules to user
 * @param {Object} user - User details
 * @param {Object} defaultInfo - Default information
 * @returns {Object} Blacklist status
 */
function applyBlacklistRules(user, defaultInfo = {}) {
    const defaultPeriod = 60; // 60 days default
    
    if (!defaultInfo.daysOverdue) {
        return {
            blacklisted: false,
            reason: "No overdue defaults",
            canBorrow: true,
            canJoinGroups: true
        };
    }
    
    if (defaultInfo.daysOverdue >= defaultPeriod) {
        return {
            blacklisted: true,
            reason: `Defaulted for ${defaultInfo.daysOverdue} days (≥ ${defaultPeriod} days)`,
            amountOwed: defaultInfo.amountOwed,
            daysOverdue: defaultInfo.daysOverdue,
            canBorrow: false,
            canJoinGroups: false,
            removal: "Only by Platform Admin after full repayment",
            badge: "Visible platform-wide"
        };
    }
    
    // Warning for approaching default
    if (defaultInfo.daysOverdue >= defaultPeriod - 7) {
        return {
            blacklisted: false,
            warning: true,
            reason: `Approaching default threshold (${defaultInfo.daysOverdue}/${defaultPeriod} days)`,
            daysRemaining: defaultPeriod - defaultInfo.daysOverdue,
            canBorrow: true,
            canJoinGroups: true,
            restrictions: "Monitor closely"
        };
    }
    
    return {
        blacklisted: false,
        reason: "Within acceptable overdue period",
        canBorrow: true,
        canJoinGroups: true
    };
}

/**
 * Validate emergency category usage
 * @param {string} categoryId - Category ID
 * @param {number} amount - Requested amount
 * @param {string} declaredPurpose - Declared purpose
 * @returns {Object} Validation result
 */
function validateEmergencyCategory(categoryId, amount, declaredPurpose = "") {
    const category = NigeriaRules.emergencyCategories.categories.find(c => c.id === categoryId);
    
    if (!category) {
        return {
            valid: false,
            error: `Invalid emergency category: ${categoryId}`,
            categories: NigeriaRules.emergencyCategories.categories.map(c => ({ id: c.id, name: c.name }))
        };
    }
    
    const errors = [];
    const warnings = [];
    
    // Amount check
    if (amount > category.maxAmount) {
        errors.push(`Amount ${amount} exceeds maximum of ${category.maxAmount} for ${category.name}`);
    }
    
    // Purpose consistency check (if provided)
    if (declaredPurpose && !declaredPurpose.toLowerCase().includes(category.name.toLowerCase().split(' ')[0])) {
        warnings.push(`Declared purpose may not match category ${category.name}`);
    }
    
    // Typical term recommendation
    if (category.typicalTerm !== "7 days") {
        warnings.push(`Note: ${category.name} typically uses ${category.typicalTerm} repayment`);
    }
    
    return {
        valid: errors.length === 0,
        category: {
            id: category.id,
            name: category.name,
            description: category.description,
            icon: category.icon,
            maxAmount: category.maxAmount,
            typicalTerm: category.typicalTerm
        },
        errors,
        warnings
    };
}

// ====================================================================
// EXPORT MODULE
// ====================================================================
module.exports = {
    rules: NigeriaRules,
    validateHierarchyCompliance,
    validateLoanTerms,
    checkGroupEligibility,
    enforceSubscriptionRules,
    applyBlacklistRules,
    validateEmergencyCategory,
    determineHierarchyLevel,
    getRecommendedTerms
};

// ====================================================================
// INITIALIZATION
// ====================================================================
console.log(`
╔════════════════════════════════════════════════════════════╗
║             M-PESEWA NIGERIA RULES MODULE                 ║
║             Strict Business Rule Enforcement              ║
╚════════════════════════════════════════════════════════════╝

Hierarchy Enforcement (STRICT):
• Chain: ${NigeriaRules.hierarchy.chain}
• Country Isolation: ${NigeriaRules.hierarchy.nigeria.strictRules.length} strict rules
• Group Rules: ${NigeriaRules.hierarchy.groups.creationRules.length} creation rules
• Lender Rules: ${NigeriaRules.hierarchy.lenders.registrationRules.length} registration rules
• Borrower Rules: ${NigeriaRules.hierarchy.borrowers.eligibilityRules.length} eligibility rules

User Role Management:
• Individual: Base entity with context-dependent state
• Borrower: ${NigeriaRules.roles.borrower.capabilities.length} capabilities, ${NigeriaRules.roles.borrower.restrictions.length} restrictions
• Lender: ${NigeriaRules.roles.lender.capabilities.length} capabilities, ${NigeriaRules.roles.lender.requirements.length} requirements
• Dual Role: ${NigeriaRules.roles.dualRole.allowed ? 'Allowed' : 'Not allowed'} with ${NigeriaRules.roles.dualRole.rules.length} rules
• Group Admin: ${NigeriaRules.roles.groupAdmin.responsibilities.length} responsibilities
• Platform Admin: ${NigeriaRules.roles.platformAdmin.powers.length} powers with ${NigeriaRules.roles.platformAdmin.restrictions.length} restrictions

Lending & Borrowing Rules:
• Loan Duration: ${NigeriaRules.lendingBorrowing.loanTerms.duration.standard} standard
• Interest: ${NigeriaRules.lendingBorrowing.loanTerms.interest.rate} weekly
• Penalty: ${NigeriaRules.lendingBorrowing.loanTerms.penalties.rate} daily after due
• Default: ${NigeriaRules.lendingBorrowing.loanTerms.default.period} days

Reputation System:
• Rating: ${NigeriaRules.reputation.rating.scale} scale
• Blacklist: Trigger at ${NigeriaRules.reputation.blacklist.triggers[0]}
• Removal: ${NigeriaRules.reputation.blacklist.removal.who} only

Subscription Model:
• Tiers: ${Object.keys(NigeriaRules.subscriptions.tiers).length} subscription tiers
• Revenue: ${NigeriaRules.subscriptions.model.statement}
• Enforcement: Expiry on ${NigeriaRules.subscriptions.enforcement.expiry}

Emergency Categories:
• Total: ${NigeriaRules.emergencyCategories.categories.length} specific-purpose categories
• Range: ₦${NigeriaRules.emergencyCategories.categories[0].maxAmount} to ₦${NigeriaRules.emergencyCategories.categories[NigeriaRules.emergencyCategories.categories.length - 1].maxAmount}

Compliance:
• Nigerian Laws: ${NigeriaRules.compliance.nigerianLaws.length} applicable laws
• KYC Requirements: ${NigeriaRules.compliance.kyc.individuals.length} for individuals
• Reporting: ${NigeriaRules.compliance.reporting.toCBN}

Enforcement Mechanisms:
• Automated: ${NigeriaRules.enforcement.automated.length} automated checks
• Manual: ${NigeriaRules.enforcement.manual.length} manual interventions
• Penalties: ${Object.keys(NigeriaRules.enforcement.penalties).length} penalty levels

Available Functions:
• validateHierarchyCompliance() - Hierarchy rule validation
• validateLoanTerms() - Loan term validation
• checkGroupEligibility() - Group membership checks
• enforceSubscriptionRules() - Subscription enforcement
• applyBlacklistRules() - Blacklist application
• validateEmergencyCategory() - Category validation
• determineHierarchyLevel() - Level determination
• getRecommendedTerms() - Tier-specific recommendations

Rules module ready for strict Nigerian operations enforcement.
`);