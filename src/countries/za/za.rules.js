/**
 * South Africa (ZA) Rules Module
 * M-Pesewa Country-Specific Rules - South Africa
 * Last Updated: 2026-01-24
 * 
 * RULES HIERARCHY ENFORCEMENT:
 * 1. Global Platform Rules
 * 2. Country-Specific Rules
 * 3. Group-Level Rules
 * 4. User-Level Rules
 */

const ZA_RULES = {
    // ============================================
    // 1. GLOBAL HIERARCHY RULES - SOUTH AFRICA
    // ============================================
    hierarchy: {
        // 1.1. Strict Hierarchy Definition
        levels: {
            global: {
                name: "Global",
                description: "M-Pesewa Platform Worldwide",
                rules: ["Platform-wide standards", "Global brand guidelines"]
            },
            country: {
                name: "South Africa",
                code: "ZA",
                description: "South African Operations",
                rules: ["Local regulations", "Country-specific compliance"]
            },
            groups: {
                name: "Groups",
                description: "Trusted circles within South Africa",
                rules: ["Group isolation", "Local trust networks"]
            },
            lenders: {
                name: "Lenders",
                description: "Money providers within groups",
                rules: ["Subscription required", "Group-bound lending"]
            },
            borrowers: {
                name: "Borrowers",
                description: "Money recipients within groups",
                rules: ["No subscription", "Group-bound borrowing"]
            },
            ledgers: {
                name: "Ledgers",
                description: "Loan records under lenders",
                rules: ["Unlimited per lender", "Manual updates"]
            }
        },

        // 1.2. Hierarchy Enforcement Rules
        enforcement: {
            // 1.2.1. Country Isolation
            countryIsolation: {
                enabled: true,
                strict: true,
                rules: [
                    "No cross-country lending",
                    "No cross-country borrowing",
                    "No cross-country group membership",
                    "No cross-country fund transfers",
                    "Country selection locked after registration"
                ],
                violations: {
                    penalty: "Account suspension",
                    severity: "High",
                    appeal: "Manual review required"
                }
            },

            // 1.2.2. Group Isolation
            groupIsolation: {
                enabled: true,
                rules: [
                    "Lenders can only lend within their group",
                    "Borrowers can only borrow within their group",
                    "Group membership by invitation only",
                    "Maximum 4 groups per user",
                    "Group-specific reputation system"
                ],
                exceptions: ["Platform Admin override"]
            },

            // 1.2.3. Role Isolation
            roleIsolation: {
                enabled: true,
                rules: [
                    "Separate lender and borrower profiles",
                    "Different registration for each role",
                    "Separate dashboards for each role",
                    "Role-specific permissions",
                    "Cannot be lender and borrower in same transaction"
                ]
            }
        },

        // 1.3. Hierarchy Validation Functions
        validation: {
            // Validate country isolation
            validateCountryIsolation: (userCountry, targetCountry) => {
                if (userCountry !== targetCountry) {
                    return {
                        valid: false,
                        error: `Cross-country operations not allowed. User country: ${userCountry}, Target country: ${targetCountry}`,
                        code: "COUNTRY_ISOLATION_VIOLATION",
                        severity: "HIGH"
                    };
                }
                return { valid: true, message: "Country isolation validated" };
            },

            // Validate group isolation
            validateGroupIsolation: (lenderGroupId, borrowerGroupId) => {
                if (lenderGroupId !== borrowerGroupId) {
                    return {
                        valid: false,
                        error: "Cross-group lending not allowed",
                        code: "GROUP_ISOLATION_VIOLATION",
                        severity: "HIGH"
                    };
                }
                return { valid: true, message: "Group isolation validated" };
            },

            // Validate user role for transaction
            validateUserRole: (userRoles, requiredRole) => {
                if (!userRoles.includes(requiredRole)) {
                    return {
                        valid: false,
                        error: `User does not have required role: ${requiredRole}`,
                        code: "ROLE_VIOLATION",
                        severity: "MEDIUM"
                    };
                }
                return { valid: true, message: "User role validated" };
            }
        }
    },

    // ============================================
    // 2. COUNTRY-SPECIFIC RULES - SOUTH AFRICA
    // ============================================
    country: {
        // 2.1. Registration Rules
        registration: {
            // 2.1.1. Eligibility Requirements
            eligibility: {
                age: 18,
                residency: "South African citizen or permanent resident",
                identification: "Valid South African ID document",
                phone: "South African mobile number",
                bankAccount: "South African bank account",
                taxNumber: "Required for lenders over certain thresholds"
            },

            // 2.1.2. KYC Requirements
            kyc: {
                level1: {
                    required: ["Full name", "Phone number", "Email address"],
                    purpose: "Basic account creation"
                },
                level2: {
                    required: ["SA ID number", "Proof of address", "Selfie verification"],
                    purpose: "Full platform access"
                },
                level3: {
                    required: ["Proof of income", "Bank statements", "Tax clearance"],
                    purpose: "High-value lending"
                }
            },

            // 2.1.3. Verification Rules
            verification: {
                methods: ["SMS OTP", "Email OTP", "Biometric", "Document upload"],
                timeframe: "24-48 hours",
                reVerification: "Annual for active users",
                failedAttempts: {
                    max: 3,
                    lockout: "24 hours",
                    escalation: "Manual review"
                }
            }
        },

        // 2.2. Lending Rules
        lending: {
            // 2.2.1. Lender Eligibility
            eligibility: {
                subscription: "Active subscription required",
                kyc: "Level 2 KYC minimum",
                bankAccount: "Verified South African bank account",
                creditCheck: "Required for Super tier and above",
                taxCompliance: "Required for high-volume lenders"
            },

            // 2.2.2. Lending Limits
            limits: {
                perLoan: {
                    basic: 1500,
                    premium: 5000,
                    super: 20000,
                    lenderOfLenders: 50000
                },
                weekly: {
                    basic: 1500,
                    premium: 5000,
                    super: 20000,
                    lenderOfLenders: 50000
                },
                monthly: {
                    basic: 6000,
                    premium: 20000,
                    super: 80000,
                    lenderOfLenders: 200000
                }
            },

            // 2.2.3. Lending Restrictions
            restrictions: {
                categories: "Must specify lending categories",
                groupOnly: "Lend only within joined groups",
                blacklistedBorrowers: "Cannot lend to blacklisted users",
                selfLending: "Cannot lend to self",
                familyLending: "Allowed with disclosure"
            }
        },

        // 2.3. Borrowing Rules
        borrowing: {
            // 2.3.1. Borrower Eligibility
            eligibility: {
                kyc: "Level 2 KYC minimum",
                groupMembership: "Member of at least one group",
                rating: "Minimum 3-star rating for multiple groups",
                blacklist: "Not blacklisted",
                activeLoans: "Maximum 1 active loan per group"
            },

            // 2.3.2. Borrowing Limits
            limits: {
                firstLoan: 1000,
                afterGoodRepayment: 5000,
                maximum: 20000,
                perGroup: "One active loan at a time",
                totalAcrossGroups: "Tier-based maximum"
            },

            // 2.3.3. Borrowing Restrictions
            restrictions: {
                purpose: "Emergency consumption only",
                frequency: "Minimum 7 days between loans in same group",
                multipleGroups: "Can borrow from multiple groups simultaneously",
                selfBorrowing: "Cannot borrow from self",
                familyBorrowing: "Allowed with disclosure"
            }
        },

        // 2.4. Loan Terms Rules
        loanTerms: {
            // 2.4.1. Standard Terms
            standard: {
                duration: "7 days maximum",
                interest: "10% flat",
                repayment: "Daily partial payments allowed",
                gracePeriod: "None",
                earlyRepayment: "No penalty"
            },

            // 2.4.2. Penalty Terms
            penalty: {
                afterDueDate: "5% daily on outstanding balance",
                maximumPenalty: "100% of principal",
                defaultThreshold: "60 days overdue",
                defaultAction: "Blacklisting"
            },

            // 2.4.3. Special Terms
            special: {
                lenderOfLenders: "Custom terms negotiable",
                groupAdmin: "Can set group-specific rules",
                emergency: "Same terms apply"
            }
        }
    },

    // ============================================
    // 3. GROUP-LEVEL RULES
    // ============================================
    groups: {
        // 3.1. Group Creation Rules
        creation: {
            // 3.1.1. Founder Requirements
            founder: {
                role: "Platform user for 30+ days",
                rating: "Minimum 4-star rating",
                verification: "Level 2 KYC completed",
                subscription: "Active subscription if lender"
            },

            // 3.1.2. Group Requirements
            requirements: {
                minMembers: 5,
                maxMembers: 1000,
                minLenders: 1,
                name: "Unique within country",
                type: "Must specify group type",
                description: "Required for public visibility"
            },

            // 3.1.3. Group Types
            types: {
                family: {
                    description: "Family members only",
                    maxSize: 50,
                    invitationOnly: true
                },
                friends: {
                    description: "Friend circles",
                    maxSize: 100,
                    invitationOnly: true
                },
                professional: {
                    description: "Professional networks",
                    maxSize: 500,
                    invitationOnly: false
                },
                church: {
                    description: "Religious community",
                    maxSize: 1000,
                    invitationOnly: false
                },
                community: {
                    description: "Local community",
                    maxSize: 1000,
                    invitationOnly: false
                }
            }
        },

        // 3.2. Group Membership Rules
        membership: {
            // 3.2.1. Joining Rules
            joining: {
                invitation: "Required for private groups",
                referral: "Required for all groups",
                verification: "Group admin approval",
                maximumGroups: 4,
                cooldown: "7 days between group joins"
            },

            // 3.2.2. Member Requirements
            requirements: {
                kyc: "Level 2 minimum",
                country: "Must match group country",
                rating: "Minimum 3-star for premium groups",
                activity: "Must be active within 30 days"
            },

            // 3.2.3. Member Roles
            roles: {
                admin: {
                    count: 1,
                    permissions: [
                        "Approve new members",
                        "Remove members",
                        "Set group rules",
                        "View group statistics",
                        "Moderate disputes"
                    ]
                },
                lender: {
                    permissions: [
                        "Lend within group",
                        "View borrower profiles",
                        "Rate borrowers",
                        "Manage ledgers"
                    ]
                },
                borrower: {
                    permissions: [
                        "Borrow within group",
                        "View lender profiles",
                        "Request loans",
                        "Make repayments"
                    ]
                }
            }
        },

        // 3.3. Group Operations Rules
        operations: {
            // 3.3.1. Lending Operations
            lending: {
                withinGroupOnly: true,
                visibility: "Loan requests visible to group lenders",
                approval: "Lender discretion",
                limits: "Group admin can set additional limits"
            },

            // 3.3.2. Borrowing Operations
            borrowing: {
                withinGroupOnly: true,
                requestFrequency: "One request at a time",
                visibility: "Borrower rating visible to group",
                cooldown: "7 days between loan requests"
            },

            // 3.3.3. Dispute Resolution
            disputes: {
                firstLevel: "Group admin mediation",
                secondLevel: "Platform dispute resolution",
                thirdLevel: "External mediation (OBS)",
                timeframe: "15 working days for resolution"
            }
        }
    },

    // ============================================
    // 4. LENDER-LEVEL RULES
    // ============================================
    lenders: {
        // 4.1. Registration & Onboarding
        registration: {
            // 4.1.1. Required Information
            information: {
                mandatory: [
                    "Full name",
                    "SA ID number",
                    "Phone number",
                    "Email address",
                    "Physical address",
                    "Bank account details"
                ],
                optional: [
                    "Brand name/nickname",
                    "Profile picture",
                    "Business registration",
                    "Tax number"
                ]
            },

            // 4.1.2. Subscription Selection
            subscription: {
                required: true,
                selection: "During registration",
                payment: "Before first lending",
                tiers: ["Basic", "Premium", "Super", "Lender of Lenders"],
                change: "Can upgrade anytime, downgrade at renewal"
            },

            // 4.1.3. Verification Process
            verification: {
                steps: [
                    "Email verification",
                    "Phone verification",
                    "ID verification",
                    "Address verification",
                    "Bank account verification"
                ],
                completion: "Required before lending"
            }
        },

        // 4.2. Lending Operations
        operations: {
            // 4.2.1. Loan Approval
            approval: {
                discretionary: true,
                criteria: [
                    "Borrower rating",
                    "Repayment history",
                    "Loan purpose",
                    "Amount requested",
                    "Affordability"
                ],
                timeframe: "24 hours to respond",
                autoDecline: "After 24 hours"
            },

            // 4.2.2. Fund Disbursement
            disbursement: {
                method: "Manual outside platform",
                timeframe: "Within 24 hours of approval",
                confirmation: "Lender marks as disbursed",
                proof: "Optional upload of proof"
            },

            // 4.2.3. Ledger Management
            ledger: {
                creation: "Automatic on loan approval",
                fields: [
                    "Borrower name",
                    "Borrower contact",
                    "Guarantors (2)",
                    "Loan category",
                    "Amount",
                    "Date borrowed",
                    "Due date",
                    "Interest (10%)",
                    "Penalty (5% daily)",
                    "Status"
                ],
                updates: "Manual by lender",
                unlimited: true
            }
        },

        // 4.3. Risk Management
        risk: {
            // 4.3.1. Risk Assessment
            assessment: {
                borrowerRating: "1-5 stars",
                repaymentHistory: "Track record",
                groupReputation: "Group default rate",
                loanPurpose: "Emergency categories",
                amountRisk: "Percentage of portfolio"
            },

            // 4.3.2. Portfolio Management
            portfolio: {
                diversification: "Recommended across multiple borrowers",
                concentration: "Maximum 20% to single borrower",
                monitoring: "Daily portfolio review",
                reporting: "Monthly performance report"
            },

            // 4.3.3. Default Management
            default: {
                blacklist: "After 60 days overdue",
                debtCollection: "Option to use vetted collectors",
                writeOff: "After 180 days",
                taxDeduction: "Possible for business lenders"
            }
        },

        // 4.4. Subscription Management
        subscription: {
            // 4.4.1. Subscription Rules
            rules: {
                payment: "Advance payment required",
                expiry: "28th of each month",
                renewal: "Auto-renewal default",
                cancellation: "30 days notice",
                refund: "No refunds except legal requirement"
            },

            // 4.4.2. Tier Rules
            tiers: {
                basic: {
                    maxLedgers: 10,
                    maxGroups: 5,
                    features: ["Basic lending", "Standard support"]
                },
                premium: {
                    maxLedgers: 50,
                    maxGroups: 10,
                    features: ["Advanced analytics", "Priority support"]
                },
                super: {
                    maxLedgers: 100,
                    maxGroups: "Unlimited",
                    features: ["Premium tools", "24/7 support", "CRB access"]
                },
                lenderOfLenders: {
                    maxLedgers: 500,
                    maxGroups: "Unlimited",
                    features: ["Institutional tools", "API access", "Custom terms"]
                }
            },

            // 4.4.3. Expiry Rules
            expiry: {
                warning: "7 days before expiry",
                gracePeriod: "None",
                suspension: "Immediate on expiry",
                restoration: "After payment confirmation"
            }
        }
    },

    // ============================================
    // 5. BORROWER-LEVEL RULES
    // ============================================
    borrowers: {
        // 5.1. Registration & Onboarding
        registration: {
            // 5.1.1. Required Information
            information: {
                mandatory: [
                    "Full name",
                    "SA ID number",
                    "Phone number",
                    "Email address",
                    "Physical address"
                ],
                optional: [
                    "Profile picture",
                    "Employment details",
                    "Income information"
                ]
            },

            // 5.1.2. Group Joining
            groupJoining: {
                required: true,
                methods: ["Invitation", "Referral", "Application"],
                maximum: 4,
                cooldown: "7 days between joins"
            },

            // 5.1.3. Verification
            verification: {
                steps: [
                    "Email verification",
                    "Phone verification",
                    "ID verification"
                ],
                completion: "Required before borrowing"
            }
        },

        // 5.2. Borrowing Operations
        operations: {
            // 5.2.1. Loan Request
            request: {
                frequency: "One active request per group",
                information: [
                    "Loan amount",
                    "Loan category",
                    "Purpose description",
                    "Repayment plan"
                ],
                visibility: "Visible to group lenders",
                expiration: "24 hours"
            },

            // 5.2.2. Loan Acceptance
            acceptance: {
                timeframe: "24 hours to accept offer",
                multipleOffers: "Can choose between offers",
                terms: "Must accept loan terms",
                cancellation: "Can cancel before disbursement"
            },

            // 5.2.3. Repayment
            repayment: {
                methods: ["Manual payment outside platform"],
                frequency: "Daily partial payments allowed",
                confirmation: "Lender marks as received",
                proof: "Optional upload of proof"
            }
        },

        // 5.3. Reputation System
        reputation: {
            // 5.3.1. Rating System
            rating: {
                scale: "1-5 stars",
                criteria: [
                    "Timely repayment",
                    "Communication",
                    "Loan purpose honesty",
                    "Overall reliability"
                ],
                calculation: "Weighted average of lender ratings",
                update: "After each loan completion"
            },

            // 5.3.2. Rating Impact
            impact: {
                groupAccess: "Minimum 3 stars for new groups",
                loanAmount: "Higher ratings = higher limits",
                interestRate: "Possible negotiation for 5-star",
                visibility: "Rating visible to group lenders"
            },

            // 5.3.3. Rating Disputes
            disputes: {
                timeframe: "7 days to dispute rating",
                process: "Group admin mediation",
                escalation: "Platform admin review",
                finality: "Platform admin decision final"
            }
        },

        // 5.4. Blacklist System
        blacklist: {
            // 5.4.1. Blacklist Criteria
            criteria: {
                default: "60+ days overdue",
                fraud: "Confirmed fraudulent activity",
                multipleDefaults: "2+ defaults across groups",
                platformViolation: "Serious terms violation"
            },

            // 5.4.2. Blacklist Consequences
            consequences: {
                borrowing: "Cannot borrow",
                groupJoining: "Cannot join new groups",
                visibility: "Blacklist badge visible platform-wide",
                reporting: "May be reported to credit bureaus"
            },

            // 5.4.3. Blacklist Removal
            removal: {
                condition: "Full repayment (principal + interest + penalties)",
                approval: "Platform admin only",
                process: "Manual review and approval",
                cooldown: "30 days before full privileges restored"
            }
        }
    },

    // ============================================
    // 6. LEDGER SYSTEM RULES
    // ============================================
    ledgers: {
        // 6.1. Ledger Creation Rules
        creation: {
            // 6.1.1. Automatic Creation
            automatic: {
                trigger: "Loan approval by lender",
                fields: "Pre-populated from loan request",
                owner: "Lender who approved loan",
                location: "Under lender profile in group"
            },

            // 6.1.2. Required Fields
            fields: {
                mandatory: [
                    "Borrower name",
                    "Borrower contact",
                    "Loan amount",
                    "Interest rate (10%)",
                    "Date borrowed",
                    "Due date",
                    "Status"
                ],
                optional: [
                    "Guarantor contacts",
                    "Loan purpose details",
                    "Repayment schedule",
                    "Notes"
                ]
            },

            // 6.1.3. Validation Rules
            validation: {
                amount: "Must be within lender tier limit",
                interest: "Fixed at 10%",
                duration: "Maximum 7 days",
                borrower: "Must be in same group"
            }
        },

        // 6.2. Ledger Update Rules
        updates: {
            // 6.2.1. Manual Updates
            manual: {
                allowed: true,
                by: "Lender only",
                frequency: "As repayments received",
                verification: "Optional proof upload"
            },

            // 6.2.2. Updateable Fields
            fields: {
                status: ["Active", "Partially Paid", "Cleared", "Defaulted"],
                repayments: "Amount and date",
                penalties: "Calculated automatically",
                notes: "Free text"
            },

            // 6.2.3. Update Validation
            validation: {
                repayments: "Cannot exceed total due",
                dates: "Cannot be future dates",
                status: "Can only progress forward",
                audit: "All changes logged"
            }
        },

        // 6.3. Ledger Status Rules
        status: {
            // 6.3.1. Status Definitions
            definitions: {
                active: "Loan is outstanding",
                partiallyPaid: "Some repayment received",
                cleared: "Fully repaid",
                defaulted: "60+ days overdue"
            },

            // 6.3.2. Status Transitions
            transitions: {
                active_to_partiallyPaid: "When repayment received",
                partiallyPaid_to_cleared: "When full repayment received",
                active_to_defaulted: "After 60 days overdue",
                defaulted_to_cleared: "After full repayment and admin approval"
            },

            // 6.3.3. Status Impact
            impact: {
                active: "Counting towards lender portfolio",
                cleared: "Positive impact on borrower rating",
                defaulted: "Triggers blacklist, negative rating"
            }
        },

        // 6.4. Ledger Access Rules
        access: {
            // 6.4.1. View Access
            view: {
                lender: "Full access to own ledgers",
                borrower: "View own ledger entries",
                groupAdmin: "View all group ledgers",
                platformAdmin: "View all ledgers"
            },

            // 6.4.2. Edit Access
            edit: {
                lender: "Edit own ledgers",
                borrower: "No edit access",
                groupAdmin: "Can assist with updates",
                platformAdmin: "Full edit access"
            },

            // 6.4.3. Export Access
            export: {
                lender: "Export own ledgers",
                borrower: "Export own records",
                groupAdmin: "Export group ledgers",
                platformAdmin: "Export all ledgers"
            }
        }
    },

    // ============================================
    // 7. COMPLIANCE & REGULATORY RULES
    // ============================================
    compliance: {
        // 7.1. FSCA Compliance
        fsca: {
            // 7.1.1. License Requirements
            license: {
                number: "FSP12345",
                type: "Category I & II",
                obligations: [
                    "Professional indemnity insurance",
                    "Regular reporting",
                    "FAIS Act compliance",
                    "Appointment of key individuals"
                ]
            },

            // 7.1.2. Conduct Standards
            conduct: {
                fairTreatment: "Treat customers fairly",
                disclosure: "Full and frank disclosure",
                suitability: "Ensure product suitability",
                conflicts: "Manage conflicts of interest"
            },

            // 7.1.3. Reporting Requirements
            reporting: {
                financial: "Annual audited financials",
                complaints: "Quarterly complaints report",
                compliance: "Annual compliance report",
                risk: "Regular risk assessments"
            }
        },

        // 7.2. NCA Compliance
        nca: {
            // 7.2.1. Credit Provider Rules
            provider: {
                registration: "NCRCP12345",
                affordability: "Must assess affordability",
                recklessLending: "Prohibited",
                preAgreement: "Required for certain loans"
            },

            // 7.2.2. Consumer Protection
            consumer: {
                coolingOff: "5 days for certain loans",
                statements: "Regular account statements",
                reasons: "Provide reasons for credit refusal",
                disputes: "Formal dispute resolution"
            },

            // 7.2.3. Credit Bureau Reporting
            bureau: {
                reporting: "Required for defaults",
                access: "Consumers can access reports",
                correction: "Process for correcting errors",
                frequency: "Monthly reporting"
            }
        },

        // 7.3. POPIA Compliance
        popia: {
            // 7.3.1. Processing Conditions
            processing: {
                lawful: "Process lawfully",
                minimal: "Collect minimal data",
                consent: "Obtain consent",
                purpose: "Specific purpose"
            },

            // 7.3.2. Data Subject Rights
            rights: {
                access: "Right to access",
                correction: "Right to correction",
                deletion: "Right to deletion",
                objection: "Right to object"
            },

            // 7.3.3. Security Measures
            security: {
                integrity: "Ensure data integrity",
                confidentiality: "Maintain confidentiality",
                access: "Control access",
                breach: "Report breaches within 72 hours"
            }
        },

        // 7.4. Tax Compliance
        tax: {
            // 7.4.1. VAT Compliance
            vat: {
                registration: "4880266188",
                rate: "15%",
                invoicing: "Tax invoices required",
                filing: "Bi-monthly returns"
            },

            // 7.4.2. Income Tax
            income: {
                reporting: "Annual income reporting",
                certificates: "Issue tax certificates",
                withholding: "Withhold tax where required",
                SARS: "SARS compliance"
            },

            // 7.4.3. Record Keeping
            records: {
                duration: "7 years minimum",
                format: "Electronic acceptable",
                access: "Available for inspection",
                backup: "Regular backups required"
            }
        }
    },

    // ============================================
    // 8. DISPUTE RESOLUTION RULES
    // ============================================
    disputes: {
        // 8.1. Internal Dispute Resolution
        internal: {
            // 8.1.1. Levels of Resolution
            levels: {
                level1: {
                    resolver: "Group Admin",
                    timeframe: "7 days",
                    scope: "Group-level disputes"
                },
                level2: {
                    resolver: "Platform Support",
                    timeframe: "15 days",
                    scope: "Platform-level disputes"
                },
                level3: {
                    resolver: "Compliance Officer",
                    timeframe: "30 days",
                    scope: "Complex or regulatory disputes"
                }
            },

            // 8.1.2. Dispute Categories
            categories: {
                repayment: "Disputes about repayments",
                rating: "Disputes about ratings",
                service: "Disputes about platform service",
                fraud: "Suspected fraudulent activity"
            },

            // 8.1.3. Resolution Process
            process: {
                submission: "Through platform interface",
                documentation: "Evidence required",
                mediation: "Attempt mediation first",
                decision: "Written decision provided"
            }
        },

        // 8.2. External Dispute Resolution
        external: {
            // 8.2.1. Ombudsman for Banking Services
            obs: {
                jurisdiction: "Financial services disputes",
                threshold: "Up to R5,000,000",
                cost: "Free for consumers",
                timeframe: "60-90 days"
            },

            // 8.2.2. National Credit Regulator
            ncr: {
                jurisdiction: "Credit-related disputes",
                threshold: "No limit",
                cost: "Free",
                timeframe: "90-120 days"
            },

            // 8.2.3. Courts
            courts: {
                jurisdiction: "All disputes",
                cost: "Court fees apply",
                timeframe: "6-24 months",
                location: "South African courts"
            }
        },

        // 8.3. Arbitration Rules
        arbitration: {
            // 8.3.1. Arbitration Agreement
            agreement: {
                included: "In terms and conditions",
                voluntary: "Can opt out",
                binding: "Decision is binding",
                enforceable: "Court enforceable"
            },

            // 8.3.2. Arbitration Process
            process: {
                initiator: "Either party can initiate",
                arbitrator: "AFSA appointed",
                location: "Johannesburg",
                language: "English"
            },

            // 8.3.3. Arbitration Costs
            costs: {
                administration: "Shared equally",
                arbitrator: "As determined by AFSA",
                legal: "Each party bears own costs",
                waiver: "Possible for low-income parties"
            }
        }
    },

    // ============================================
    // 9. PENALTY & ENFORCEMENT RULES
    // ============================================
    penalties: {
        // 9.1. Violation Categories
        violations: {
            // 9.1.1. Minor Violations
            minor: {
                examples: [
                    "Late profile update",
                    "Incomplete information",
                    "Minor communication issues"
                ],
                penalty: "Warning",
                escalation: "After 3 violations"
            },

            // 9.1.2. Medium Violations
            medium: {
                examples: [
                    "Late repayment (7-30 days)",
                    "Incorrect ledger entry",
                    "Poor communication"
                ],
                penalty: "Temporary restrictions",
                escalation: "After 2 violations"
            },

            // 9.1.3. Major Violations
            major: {
                examples: [
                    "Default (60+ days)",
                    "Fraudulent activity",
                    "Platform rule violation",
                    "Regulatory violation"
                ],
                penalty: "Account suspension or termination",
                escalation: "Immediate"
            }
        },

        // 9.2. Penalty System
        system: {
            // 9.2.1. Warning System
            warnings: {
                levels: ["First", "Second", "Final"],
                duration: "90 days validity",
                accumulation: "Reset after clean period",
                notification: "Email and in-app"
            },

            // 9.2.2. Restriction System
            restrictions: {
                types: [
                    "Lending restrictions",
                    "Borrowing restrictions",
                    "Group restrictions",
                    "Communication restrictions"
                ],
                duration: "7-30 days",
                removal: "Automatic after duration",
                appeal: "Possible during restriction"
            },

            // 9.2.3. Suspension System
            suspension: {
                types: ["Temporary", "Permanent"],
                duration: "30-180 days",
                conditions: ["Investigation", "Remediation"],
                reinstatement: "Manual review required"
            }
        },

        // 9.3. Appeal Process
        appeal: {
            // 9.3.1. Appeal Rights
            rights: {
                allPenalties: "Can appeal any penalty",
                timeframe: "7 days to appeal",
                documentation: "Evidence required",
                cost: "No cost for appeal"
            },

            // 9.3.2. Appeal Process
            process: {
                submission: "Through platform interface",
                review: "By compliance officer",
                decision: "Within 14 days",
                finality: "Platform admin decision final"
            },

            // 9.3.3. Appeal Outcomes
            outcomes: {
                upheld: "Penalty stands",
                modified: "Penalty reduced",
                overturned: "Penalty removed",
                newPenalty: "Different penalty imposed"
            }
        }
    },

    // ============================================
    // 10. RULE ENFORCEMENT FUNCTIONS
    // ============================================
    enforcement: {
        // 10.1. Rule Validation Functions
        validate: {
            // Validate loan request against rules
            loanRequest: (request, user, group) => {
                const violations = [];
                const warnings = [];
                
                // Check borrower eligibility
                if (!user.roles.includes('borrower')) {
                    violations.push('User is not registered as borrower');
                }
                
                // Check group membership
                if (!user.groups.includes(group.id)) {
                    violations.push('User is not member of this group');
                }
                
                // Check active loans in group
                if (user.activeLoansInGroup >= 1) {
                    violations.push('Maximum 1 active loan per group');
                }
                
                // Check amount against tier limits
                const tierLimit = ZA_RULES.lenders.subscription.tiers[user.tier]?.maxLedgerAmount;
                if (request.amount > tierLimit) {
                    violations.push(`Amount exceeds tier limit of R${tierLimit}`);
                }
                
                // Check rating for multiple groups
                if (user.groups.length >= 2 && user.rating < 3) {
                    warnings.push('Low rating user requesting loan in multiple groups');
                }
                
                return {
                    valid: violations.length === 0,
                    violations,
                    warnings,
                    requiresReview: warnings.length > 0
                };
            },

            // Validate lender action against rules
            lenderAction: (action, lender, borrower, group) => {
                const violations = [];
                
                // Check subscription status
                if (!lender.subscription.active) {
                    violations.push('Lender subscription not active');
                }
                
                // Check group membership match
                if (lender.groupId !== borrower.groupId) {
                    violations.push('Lender and borrower not in same group');
                }
                
                // Check lending limit
                const weeklyLimit = ZA_RULES.lending.limits.weekly[lender.tier];
                if (lender.weeklyLent + action.amount > weeklyLimit) {
                    violations.push(`Would exceed weekly lending limit of R${weeklyLimit}`);
                }
                
                // Check blacklist status
                if (borrower.blacklisted) {
                    violations.push('Borrower is blacklisted');
                }
                
                return {
                    valid: violations.length === 0,
                    violations,
                    requiresOverride: violations.includes('Borrower is blacklisted')
                };
            },

            // Validate group creation
            groupCreation: (founder, groupDetails) => {
                const violations = [];
                
                // Check founder requirements
                if (founder.accountAge < 30) {
                    violations.push('Founder account must be 30+ days old');
                }
                
                if (founder.rating < 4) {
                    violations.push('Founder must have 4+ star rating');
                }
                
                // Check group name uniqueness
                // This would check against database
                
                // Check group size
                if (groupDetails.maxSize > 1000) {
                    violations.push('Maximum group size is 1000');
                }
                
                return {
                    valid: violations.length === 0,
                    violations,
                    requiresManualApproval: violations.length > 0
                };
            }
        },

        // 10.2. Penalty Application Functions
        applyPenalty: (violation, user, context) => {
            const penalty = {
                id: `PEN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                violation: violation.type,
                user: user.id,
                date: new Date().toISOString(),
                context: context
            };
            
            switch (violation.severity) {
                case 'minor':
                    penalty.action = 'warning';
                    penalty.duration = null;
                    penalty.restrictions = [];
                    break;
                    
                case 'medium':
                    penalty.action = 'temporary_restriction';
                    penalty.duration = '7 days';
                    penalty.restrictions = ['new_lending', 'new_borrowing'];
                    break;
                    
                case 'major':
                    penalty.action = 'suspension';
                    penalty.duration = '30 days';
                    penalty.restrictions = ['all_activities'];
                    break;
                    
                case 'critical':
                    penalty.action = 'termination';
                    penalty.duration = 'permanent';
                    penalty.restrictions = ['all_activities', 'account_access'];
                    break;
            }
            
            return penalty;
        },

        // 10.3. Compliance Checking Functions
        checkCompliance: (entity, complianceArea) => {
            const checks = {
                fsca: {
                    license: entity.licenses?.fsca?.valid,
                    reporting: entity.lastReportDate > new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
                    insurance: entity.professionalIndemnityInsurance?.valid
                },
                nca: {
                    registration: entity.licenses?.ncr?.valid,
                    affordability: entity.hasAffordabilityProcess,
                    coolingOff: entity.hasCoolingOffProcess
                },
                popia: {
                    informationOfficer: entity.informationOfficer?.appointed,
                    privacyPolicy: entity.privacyPolicy?.current,
                    dataProtection: entity.dataProtectionMeasures?.implemented
                }
            };
            
            return checks[complianceArea] || {};
        }
    }
};

// ============================================
// RULE UTILITY FUNCTIONS
// ============================================

/**
 * Get rules for specific context
 * @param {string} context - Rule context (e.g., 'lending', 'borrowing', 'groups')
 * @param {string} level - Rule level (e.g., 'country', 'group', 'user')
 * @returns {Object} Relevant rules
 */
function getRules(context, level = 'all') {
    const contextMap = {
        'hierarchy': ZA_RULES.hierarchy,
        'registration': ZA_RULES.country.registration,
        'lending': ZA_RULES.lending,
        'borrowing': ZA_RULES.borrowing,
        'groups': ZA_RULES.groups,
        'lenders': ZA_RULES.lenders,
        'borrowers': ZA_RULES.borrowers,
        'ledgers': ZA_RULES.ledgers,
        'compliance': ZA_RULES.compliance,
        'disputes': ZA_RULES.disputes,
        'penalties': ZA_RULES.penalties
    };
    
    const rules = contextMap[context] || ZA_RULES;
    
    if (level === 'all') {
        return rules;
    }
    
    // Extract specific level if exists
    return rules[level] || rules;
}

/**
 * Check if user can perform action
 * @param {Object} user - User object
 * @param {string} action - Action to perform
 * @param {Object} context - Action context
 * @returns {Object} Authorization result
 */
function canPerformAction(user, action, context = {}) {
    const checks = {
        // Lending actions
        'create_loan_offer': () => {
            return user.roles.includes('lender') && 
                   user.subscription.active &&
                   user.verification.level >= 2;
        },
        
        'approve_loan': () => {
            return user.roles.includes('lender') &&
                   context.borrowerGroup === user.groupId &&
                   user.weeklyLent + context.amount <= ZA_RULES.lending.limits.weekly[user.tier];
        },
        
        // Borrowing actions
        'request_loan': () => {
            return user.roles.includes('borrower') &&
                   user.verification.level >= 2 &&
                   user.activeLoansInGroup < 1 &&
                   !user.blacklisted;
        },
        
        // Group actions
        'create_group': () => {
            return user.accountAge >= 30 &&
                   user.rating >= 4 &&
                   user.verification.level >= 2 &&
                   user.groupsCreated < 3;
        },
        
        'join_group': () => {
            return user.groups.length < 4 &&
                   user.rating >= (context.groupType === 'premium' ? 3 : 1) &&
                   !user.blacklisted;
        },
        
        // Admin actions
        'override_blacklist': () => {
            return user.roles.includes('platform_admin') ||
                   (user.roles.includes('group_admin') && context.groupId === user.groupId);
        },
        
        'modify_ledger': () => {
            return user.roles.includes('lender') && context.ledgerOwner === user.id ||
                   user.roles.includes('platform_admin');
        }
    };
    
    const checkFunction = checks[action];
    if (!checkFunction) {
        return {
            allowed: false,
            reason: `No rule defined for action: ${action}`,
            code: 'RULE_NOT_DEFINED'
        };
    }
    
    try {
        const result = checkFunction();
        return {
            allowed: result,
            reason: result ? 'Action allowed' : 'Action not permitted by rules',
            code: result ? 'ALLOWED' : 'NOT_PERMITTED',
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        return {
            allowed: false,
            reason: `Error checking permission: ${error.message}`,
            code: 'CHECK_ERROR',
            error: error.message
        };
    }
}

/**
 * Validate transaction against all rules
 * @param {Object} transaction - Transaction details
 * @returns {Object} Validation result
 */
function validateTransaction(transaction) {
    const {
        type,
        amount,
        lender,
        borrower,
        group,
        category
    } = transaction;
    
    const violations = [];
    const warnings = [];
    const approvals = [];
    
    // 1. Hierarchy validation
    const countryValidation = ZA_RULES.hierarchy.validation.validateCountryIsolation(
        lender.country,
        borrower.country
    );
    if (!countryValidation.valid) violations.push(countryValidation.error);
    
    const groupValidation = ZA_RULES.hierarchy.validation.validateGroupIsolation(
        lender.groupId,
        borrower.groupId
    );
    if (!groupValidation.valid) violations.push(groupValidation.error);
    
    // 2. Role validation
    const lenderRoleValidation = ZA_RULES.hierarchy.validation.validateUserRole(
        lender.roles,
        'lender'
    );
    if (!lenderRoleValidation.valid) violations.push(lenderRoleValidation.error);
    
    const borrowerRoleValidation = ZA_RULES.hierarchy.validation.validateUserRole(
        borrower.roles,
        'borrower'
    );
    if (!borrowerRoleValidation.valid) violations.push(borrowerRoleValidation.error);
    
    // 3. Amount validation
    if (amount < 5) violations.push('Minimum loan amount is R5');
    if (amount > ZA_RULES.lending.limits.perLoan[lender.tier]) {
        violations.push(`Amount exceeds lender tier limit of R${ZA_RULES.lending.limits.perLoan[lender.tier]}`);
    }
    
    // 4. Subscription validation
    if (!lender.subscription.active) {
        violations.push('Lender subscription not active');
    }
    
    // 5. Blacklist check
    if (borrower.blacklisted) {
        violations.push('Borrower is blacklisted');
        warnings.push('Blacklist override may be required');
    }
    
    // 6. Active loans check
    if (borrower.activeLoansInGroup >= 1) {
        violations.push('Borrower already has active loan in this group');
    }
    
    // 7. Rating check for multiple groups
    if (borrower.groups.length >= 2 && borrower.rating < 3) {
        warnings.push('Borrower with low rating in multiple groups');
    }
    
    // 8. Weekly limit check
    const weeklyLimit = ZA_RULES.lending.limits.weekly[lender.tier];
    if (lender.weeklyLent + amount > weeklyLimit) {
        violations.push(`Would exceed lender weekly limit of R${weeklyLimit}`);
    }
    
    // 9. Category validation
    if (!lender.lendingCategories.includes(category) && !lender.lendingCategories.includes('all')) {
        violations.push(`Lender does not lend in category: ${category}`);
    }
    
    // 10. Compliance approvals
    if (amount >= 5000) approvals.push('Affordability assessment required per NCA');
    if (lender.tier === 'super' || lender.tier === 'lenderOfLenders') {
        approvals.push('CRB check required for this tier');
    }
    
    return {
        valid: violations.length === 0,
        violations,
        warnings,
        approvals,
        requiresManualReview: violations.length > 0 || warnings.length > 0,
        reviewPriority: violations.length > 0 ? 'HIGH' : warnings.length > 0 ? 'MEDIUM' : 'LOW',
        timestamp: new Date().toISOString(),
        transactionId: transaction.id
    };
}

/**
 * Calculate penalties for late repayment
 * @param {Object} loan - Loan details
 * @param {number} daysOverdue - Days overdue
 * @returns {Object} Penalty calculation
 */
function calculatePenalties(loan, daysOverdue) {
    const { principal, interestRate = 0.10, termDays = 7 } = loan;
    
    // Calculate original total
    const interest = principal * interestRate;
    const originalTotal = principal + interest;
    
    // Calculate penalties
    let penaltyTotal = 0;
    let currentBalance = originalTotal;
    const dailyPenaltyRate = 0.05; // 5% daily
    
    for (let i = 0; i < daysOverdue; i++) {
        const dailyPenalty = currentBalance * dailyPenaltyRate;
        penaltyTotal += dailyPenalty;
        currentBalance += dailyPenalty;
        
        // Cap at 100% of principal
        if (penaltyTotal > principal) {
            penaltyTotal = principal;
            break;
        }
    }
    
    const totalDue = originalTotal + penaltyTotal;
    
    // Determine status
    let status = 'overdue';
    if (daysOverdue >= 60) status = 'defaulted';
    if (daysOverdue >= 180) status = 'written_off';
    
    // Determine actions
    const actions = [];
    if (daysOverdue >= 7) actions.push('Send reminder');
    if (daysOverdue >= 14) actions.push('Contact guarantors');
    if (daysOverdue >= 30) actions.push('Formal demand letter');
    if (daysOverdue >= 60) {
        actions.push('Blacklist borrower');
        actions.push('Report to credit bureau');
    }
    if (daysOverdue >= 90) actions.push('Engage debt collector');
    
    return {
        originalPrincipal: principal,
        originalInterest: interest,
        originalTotal: originalTotal,
        daysOverdue: daysOverdue,
        penaltyRate: '5% daily on outstanding',
        penaltyAmount: penaltyTotal,
        currentTotal: totalDue,
        status: status,
        actions: actions,
        nextAction: actions[0] || 'Monitor',
        blacklistThreshold: 60 - daysOverdue > 0 ? 60 - daysOverdue : 0
    };
}

/**
 * Generate rule summary for user
 * @param {Object} user - User object
 * @returns {Object} Rule summary
 */
function generateRuleSummary(user) {
    const summary = {
        user: {
            id: user.id,
            roles: user.roles,
            tier: user.tier,
            rating: user.rating,
            groups: user.groups?.length || 0
        },
        limits: {},
        restrictions: [],
        permissions: [],
        compliance: {}
    };
    
    // Set limits based on role and tier
    if (user.roles.includes('lender')) {
        summary.limits.lending = {
            perLoan: ZA_RULES.lending.limits.perLoan[user.tier],
            weekly: ZA_RULES.lending.limits.weekly[user.tier],
            monthly: ZA_RULES.lending.limits.monthly[user.tier]
        };
        summary.permissions.push('Lend within groups', 'Create ledgers', 'Rate borrowers');
        
        if (!user.subscription?.active) {
            summary.restrictions.push('Lending suspended - subscription inactive');
        }
    }
    
    if (user.roles.includes('borrower')) {
        summary.limits.borrowing = {
            firstLoan: 1000,
            maximum: 20000,
            perGroup: 'One active loan'
        };
        summary.permissions.push('Borrow within groups', 'Request loans', 'Make repayments');
        
        if (user.blacklisted) {
            summary.restrictions.push('Borrowing suspended - blacklisted');
        }
        
        if (user.rating < 3 && user.groups >= 2) {
            summary.restrictions.push('Cannot join new groups - rating too low');
        }
    }
    
    // Group limits
    summary.limits.groups = {
        maximum: 4,
        current: user.groups?.length || 0,
        remaining: 4 - (user.groups?.length || 0)
    };
    
    // Compliance status
    summary.compliance = {
        kyc: user.verification?.level >= 2 ? 'Complete' : 'Incomplete',
        fica: user.ficaVerified ? 'Complete' : 'Incomplete',
        tax: user.taxCompliant ? 'Compliant' : 'Not verified'
    };
    
    return summary;
}

// ============================================
// EXPORT MODULE
// ============================================

export default {
    // Main Rules Configuration
    rules: ZA_RULES,
    
    // Utility Functions
    getRules,
    canPerformAction,
    validateTransaction,
    calculatePenalties,
    generateRuleSummary,
    
    // Enforcement Functions
    enforcement: ZA_RULES.enforcement,
    
    // Rule Categories
    CATEGORIES: {
        HIERARCHY: 'hierarchy',
        REGISTRATION: 'registration',
        LENDING: 'lending',
        BORROWING: 'borrowing',
        GROUPS: 'groups',
        LENDERS: 'lenders',
        BORROWERS: 'borrowers',
        LEDGERS: 'ledgers',
        COMPLIANCE: 'compliance',
        DISPUTES: 'disputes',
        PENALTIES: 'penalties'
    },
    
    // Important Rule Summaries
    IMPORTANT_RULES: [
        'Country isolation: No cross-country operations',
        'Group isolation: Lend/borrow within your group only',
        'Subscription: Required for lending, expires 28th monthly',
        'Loan terms: 7 days maximum, 10% interest',
        'Penalty: 5% daily after due date',
        'Default: Blacklisted after 60 days overdue',
        'Groups: Maximum 4 groups per user',
        'Rating: Minimum 3 stars for multiple groups',
        'Verification: Level 2 KYC required for full access'
    ],
    
    // Compliance Framework
    COMPLIANCE_FRAMEWORK: {
        FSCA: ZA_RULES.compliance.fsca,
        NCA: ZA_RULES.compliance.nca,
        POPIA: ZA_RULES.compliance.popia,
        TAX: ZA_RULES.compliance.tax
    },
    
    // Limits Reference
    LIMITS: {
        LENDING: ZA_RULES.lending.limits,
        BORROWING: ZA_RULES.borrowing.limits,
        GROUPS: {
            MIN_MEMBERS: 5,
            MAX_MEMBERS: 1000,
            MAX_PER_USER: 4
        }
    },
    
    // Version Information
    VERSION: '2.1.0',
    LAST_UPDATED: '2026-01-24',
    EFFECTIVE_DATE: '2026-01-24'
};

// Initialize rules module
console.log(`✅ M-Pesewa South Africa rules module loaded`);
console.log(`⚖️ Hierarchy Rules: Country → Groups → Lenders → Borrowers → Ledgers`);
console.log(`⚖️ Country Isolation: Strictly enforced`);
console.log(`⚖️ Group Isolation: Strictly enforced`);
console.log(`⚖️ Subscription Model: Required for lending`);
console.log(`⚖️ Loan Terms: 7 days, 10% interest, 5% daily penalty`);
console.log(`⚖️ Compliance: FSCA, NCA, POPIA, SARS compliant`);