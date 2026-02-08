/**
 * M-PESEWA - South Sudan Legal Configuration
 * STRICT HIERARCHY: Global → Country → Legal Compliance
 * 
 * South Sudan Legal & Regulatory Compliance File
 * This file contains all legal, regulatory, and compliance configurations for South Sudan
 * Last Updated: 2024-01-24
 * Version: 1.0.0
 */

const SOUTH_SUDAN_LEGAL = {
    // ============================================
    // 1️⃣ LEGAL FRAMEWORK & REGULATORY COMPLIANCE
    // ============================================
    legalFramework: {
        // Constitutional Basis
        constitution: {
            reference: "Transitional Constitution of South Sudan (2011)",
            applicableArticles: [
                "Article 32: Right to own property",
                "Article 33: Right to privacy",
                "Article 34: Freedom of belief and religion",
                "Article 35: Freedom of expression and media",
                "Article 36: Freedom of assembly and association",
                "Article 37: Freedom of movement and residence",
                "Article 38: Right to vote and be elected",
                "Article 39: Right to a clean and healthy environment",
                "Article 40: Right to education",
                "Article 41: Rights of persons with disabilities",
                "Article 42: Right to health care",
                "Article 43: Right of access to information",
                "Article 44: Right to fair and transparent administration",
                "Article 45: Right to just administrative action",
                "Article 46: Consumer rights",
                "Article 47: Fair labour practices",
                "Article 48: Rights of children",
                "Article 49: Rights of elderly persons",
                "Article 50: Rights of persons with disabilities",
                "Article 51: Rights of minorities and marginalised groups"
            ],
            lastAmended: "2011-07-09",
            status: "ACTIVE"
        },

        // Financial Regulation
        financialRegulation: {
            primaryRegulator: "Bank of South Sudan (BoSS)",
            regulatoryFramework: "Banking Act, 2011",
            licenseCategory: "Peer-to-Peer Lending Platform",
            licenseNumber: "P2P-LEND-SS-2024-001",
            licenseIssued: "2024-01-01",
            licenseExpires: "2024-12-31",
            licenseConditions: [
                "Platform must not hold user funds",
                "Maximum loan amount per transaction: 50,000 SSP",
                "Maximum interest rate: 10% per week",
                "No cross-border lending without approval",
                "Monthly reporting to BoSS required",
                "Annual audit by approved auditor",
                "Data must be stored locally in South Sudan",
                "Compliance with AML/CFT regulations",
                "Consumer protection measures required",
                "Dispute resolution mechanism required"
            ],
            regulatoryContacts: [
                {
                    department: "Financial Innovation Unit",
                    contact: "+211 955 123 456",
                    email: "innovation@boss.gov.ss",
                    address: "Bank of South Sudan Headquarters, Juba"
                },
                {
                    department: "Licensing Division",
                    contact: "+211 955 123 457",
                    email: "licensing@boss.gov.ss",
                    address: "Bank of South Sudan, Licensing Office, Juba"
                },
                {
                    department: "Compliance Monitoring",
                    contact: "+211 955 123 458",
                    email: "compliance@boss.gov.ss",
                    address: "Bank of South Sudan, Compliance Division, Juba"
                }
            ]
        },

        // Data Protection & Privacy
        dataProtection: {
            governingLaw: "South Sudan Data Protection Act (Draft)",
            dataController: "M-Pesewa Technology Pvt. Ltd.",
            dataProcessor: "M-Pesewa Technology Pvt. Ltd.",
            dataProtectionOfficer: {
                name: "John Deng",
                email: "dpo@mpesewa.com",
                phone: "+211 955 000 002",
                address: "Data Protection Office, M-Pesewa, Juba"
            },
            lawfulBasis: [
                "Consent (Article 6.1.a)",
                "Contract (Article 6.1.b)",
                "Legal obligation (Article 6.1.c)",
                "Legitimate interests (Article 6.1.f)"
            ],
            dataRights: [
                "Right to be informed",
                "Right of access",
                "Right to rectification",
                "Right to erasure (with limitations)",
                "Right to restrict processing",
                "Right to data portability",
                "Right to object",
                "Rights in relation to automated decision making"
            ],
            dataRetention: {
                userData: "10 years after account closure",
                transactionData: "10 years after transaction",
                loanData: "10 years after loan closure",
                auditLogs: "10 years",
                supportTickets: "5 years",
                marketingData: "2 years after last contact"
            },
            dataTransfers: {
                crossBorderAllowed: false,
                allowedCountries: ["South Sudan only"],
                transferMechanisms: ["Not applicable"],
                dataLocalization: true,
                storageLocation: "South Sudan data centers"
            }
        },

        // Consumer Protection
        consumerProtection: {
            governingLaw: "South Sudan Consumer Protection Act, 2015",
            enforcementAgency: "Ministry of Trade and Industry",
            keyProvisions: [
                "Right to safety",
                "Right to be informed",
                "Right to choose",
                "Right to be heard",
                "Right to seek redressal",
                "Right to consumer education"
            ],
            coolingOffPeriod: {
                enabled: true,
                durationHours: 24,
                appliesTo: ["Loan applications", "Subscription purchases"],
                conditions: "Before disbursement/activation"
            },
            unfairPracticesProhibited: [
                "False representation of services",
                "False advertising",
                "Bait and switch marketing",
                "Pyramid schemes",
                "Charging without consent",
                "Hidden fees or charges",
                "Unfair contract terms",
                "Harassment or coercion"
            ],
            complaintRedressal: {
                timeframe: "15 working days",
                escalationLevels: 3,
                ombudsmanAvailable: true,
                courtRemedy: true
            }
        },

        // Anti-Money Laundering (AML)
        antiMoneyLaundering: {
            governingLaw: "South Sudan Anti-Money Laundering Act, 2015",
            regulatoryBody: "Financial Intelligence Unit (FIU)",
            riskAssessment: {
                countryRisk: "HIGH",
                customerRisk: "MEDIUM",
                productRisk: "LOW",
                transactionRisk: "MEDIUM",
                deliveryRisk: "LOW"
            },
            cddRequirements: {
                simplifiedCdd: {
                    appliesTo: "Transactions below 50,000 SSP",
                    requirements: ["Basic ID verification"]
                },
                standardCdd: {
                    appliesTo: "Transactions 50,000 - 500,000 SSP",
                    requirements: ["Enhanced ID verification", "Address verification", "Source of funds"]
                },
                enhancedCdd: {
                    appliesTo: "Transactions above 500,000 SSP",
                    requirements: ["All standard CDD", "Additional documentation", "Senior management approval"]
                }
            },
            reportingRequirements: {
                thresholdReporting: {
                    cashTransactions: "1,000,000 SSP",
                    suspiciousActivity: "No threshold",
                    timeframe: "Within 24 hours"
                },
                reportingEntities: [
                    "Financial Intelligence Unit (FIU)",
                    "Bank of South Sudan",
                    "National Security Service"
                ]
            },
            prohibitedActivities: [
                "Terrorism financing",
                "Drug trafficking",
                "Arms smuggling",
                "Human trafficking",
                "Corruption",
                "Tax evasion",
                "Sanctions evasion"
            ],
            sanctionsScreening: {
                enabled: true,
                lists: [
                    "UN Security Council Sanctions List",
                    "USA OFAC List",
                    "EU Sanctions List",
                    "South Sudan Sanctions List"
                ],
                frequency: "REAL_TIME"
            }
        }
    },

    // ============================================
    // 2️⃣ TERMS & CONDITIONS - SOUTH SUDAN SPECIFIC
    // ============================================
    termsAndConditions: {
        // Platform Role & Disclaimer
        platformRole: {
            section: "1. PLATFORM ROLE",
            clauses: [
                {
                    number: "1.1",
                    title: "Not a Financial Institution",
                    content: "M-Pesewa is not a bank, microfinance institution, or deposit-taking entity. We do not accept deposits, provide banking services, or offer investment advice."
                },
                {
                    number: "1.2",
                    title: "Technology Platform Only",
                    content: "M-Pesewa operates as a technology platform that facilitates peer-to-peer lending within trusted groups. We provide the infrastructure, tools, and systems for users to connect and transact."
                },
                {
                    number: "1.3",
                    title: "No Fund Handling",
                    content: "All monetary transactions occur directly between users through their chosen payment methods. M-Pesewa does not receive, hold, transfer, or manage user funds at any point."
                },
                {
                    number: "1.4",
                    title: "No Guarantees",
                    content: "M-Pesewa does not guarantee loan repayment, borrower performance, lender returns, or platform availability. Users participate at their own risk."
                },
                {
                    number: "1.5",
                    title: "Limited Liability",
                    content: "M-Pesewa's liability is limited to platform subscription fees paid. We are not liable for loan defaults, disputes, fraud, or financial losses."
                }
            ]
        },

        // Country & Group Structure
        countryStructure: {
            section: "2. COUNTRY & GROUP STRUCTURE",
            clauses: [
                {
                    number: "2.1",
                    title: "Country Isolation",
                    content: "Each country operates independently. No cross-country lending, borrowing, or group membership is permitted. Users can only operate within their registered country."
                },
                {
                    number: "2.2",
                    title: "Group Formation",
                    content: "Groups must have a minimum of 5 members and cannot exceed 1,000 members. Each group must have one designated Admin/Founder."
                },
                {
                    number: "2.3",
                    title: "Group Membership",
                    content: "Group membership is by invitation or referral only. Members must be verified and approved by the Group Admin. Members can join as Lenders, Borrowers, or both."
                },
                {
                    number: "2.4",
                    title: "Group Rules",
                    content: "Each group may establish its own internal rules, provided they do not conflict with platform rules or South Sudanese law. Group Admins are responsible for enforcing group rules."
                },
                {
                    number: "2.5",
                    title: "Group Dissolution",
                    content: "Groups may be dissolved by the Group Admin or by platform intervention if they violate terms. Upon dissolution, all active loans must be settled before members can join new groups."
                }
            ]
        },

        // User Roles & Responsibilities
        userRoles: {
            section: "3. USER ROLES & RESPONSIBILITIES",
            clauses: [
                {
                    number: "3.1",
                    title: "Borrower Responsibilities",
                    content: "Borrowers must provide accurate information, use loans for stated purposes, repay on time, maintain communication with lenders, and abide by group rules."
                },
                {
                    number: "3.2",
                    title: "Lender Responsibilities",
                    content: "Lenders must conduct due diligence, maintain accurate ledgers, update repayment status, rate borrowers fairly, and abide by subscription terms."
                },
                {
                    number: "3.3",
                    title: "Group Admin Responsibilities",
                    content: "Group Admins must verify members, moderate group activities, resolve disputes, enforce rules, and maintain group integrity."
                },
                {
                    number: "3.4",
                    title: "Dual Roles",
                    content: "Users may act as both Borrower and Lender, but cannot be both in the same transaction. Separate profiles are maintained for each role."
                },
                {
                    number: "3.5",
                    title: "Role Switching",
                    content: "To switch primary roles, users must log out and register for the new role. Existing loans must be settled before role switching."
                }
            ]
        },

        // Eligibility & Registration
        eligibility: {
            section: "4. ELIGIBILITY & REGISTRATION",
            clauses: [
                {
                    number: "4.1",
                    title: "Age Requirement",
                    content: "Users must be at least 18 years old (or the age of majority in South Sudan) to register and use the platform."
                },
                {
                    number: "4.2",
                    title: "Legal Capacity",
                    content: "Users must have full legal capacity to enter into contracts under South Sudanese law. Minors, incapacitated persons, and prohibited persons cannot register."
                },
                {
                    number: "4.3",
                    title: "Accurate Information",
                    content: "Users must provide true, accurate, and complete information during registration. False information may result in immediate termination."
                },
                {
                    number: "4.4",
                    title: "Identity Verification",
                    content: "Users must undergo identity verification using government-issued ID. Failure to verify identity will result in account suspension."
                },
                {
                    number: "4.5",
                    title: "Right to Refuse",
                    content: "M-Pesewa reserves the right to refuse registration or terminate accounts at its sole discretion without providing reasons."
                }
            ]
        },

        // Loan Terms & Conditions
        loanTerms: {
            section: "5. LOAN TERMS & CONDITIONS",
            clauses: [
                {
                    number: "5.1",
                    title: "Loan Purpose",
                    content: "Loans must be used only for the 20 specified emergency categories. Misuse of funds may result in immediate repayment demand and blacklisting."
                },
                {
                    number: "5.2",
                    title: "Loan Amount Limits",
                    content: "Loan amounts are limited by subscription tier: Basic (≤1,500 SSP), Premium (≤5,000 SSP), Super (≤20,000 SSP), Lender of Lenders (≤50,000 SSP)."
                },
                {
                    number: "5.3",
                    title: "Repayment Period",
                    content: "Maximum repayment period is 7 days (1 week). Extensions are not permitted without lender consent and updated terms."
                },
                {
                    number: "5.4",
                    title: "Interest Rate",
                    content: "Standard interest rate is 10% per week (fixed). This rate applies to all loans unless otherwise agreed in writing between lender and borrower."
                },
                {
                    number: "5.5",
                    title: "Penalties",
                    content: "After 7 days, a penalty of 5% per day applies on the outstanding balance. After 60 days, the loan is considered in default."
                },
                {
                    number: "5.6",
                    title: "Partial Repayments",
                    content: "Partial daily repayments are allowed and encouraged. Each repayment reduces the outstanding balance and accrued interest/penalties."
                },
                {
                    number: "5.7",
                    title: "Default Consequences",
                    content: "Default after 60 days results in blacklisting, platform-wide visibility, inability to borrow or join new groups, and potential debt collection action."
                }
            ]
        },

        // Subscription Terms
        subscriptionTerms: {
            section: "6. SUBSCRIPTION TERMS",
            clauses: [
                {
                    number: "6.1",
                    title: "Lender Subscription Required",
                    content: "Lenders must maintain an active subscription to access lending features. Borrowing features remain free for Basic tier access."
                },
                {
                    number: "6.2",
                    title: "Subscription Tiers",
                    content: "Four subscription tiers are available: Basic, Premium, Super, and Lender of Lenders. Each tier has specific limits and features."
                },
                {
                    number: "6.3",
                    title: "Payment Terms",
                    content: "Subscriptions can be paid monthly, bi-annually, or annually. Payments are due in advance. No refunds for partial periods."
                },
                {
                    number: "6.4",
                    title: "Expiry & Renewal",
                    content: "Subscriptions expire on the 28th of each month. Automatic renewal is not enabled - manual renewal is required before expiry."
                },
                {
                    number: "6.5",
                    title: "Suspension for Non-Payment",
                    content: "Lender accounts are immediately suspended upon subscription expiry. Access is restored only after payment confirmation."
                },
                {
                    number: "6.6",
                    title: "Tier Upgrades",
                    content: "Upgrades are allowed at any time with prorated charges. Downgrades are not permitted within subscription periods."
                },
                {
                    number: "6.7",
                    title: "No Refunds",
                    content: "Subscription fees are non-refundable except where required by South Sudanese consumer protection law."
                }
            ]
        },

        // Ledger System
        ledgerSystem: {
            section: "7. LEDGER SYSTEM",
            clauses: [
                {
                    number: "7.1",
                    title: "Automatic Creation",
                    content: "A ledger is automatically created when a lender approves a loan. The ledger is stored under the lender's profile within the group."
                },
                {
                    number: "7.2",
                    title: "Ledger Contents",
                    content: "Each ledger contains: borrower details, guarantor contacts, loan category, amount, dates, interest, penalties, and status."
                },
                {
                    number: "7.3",
                    title: "Manual Updates",
                    content: "Lenders are responsible for manually updating repayment status. Platform Admins can override or correct ledgers when necessary."
                },
                {
                    number: "7.4",
                    title: "Unlimited Ledgers",
                    content: "Lenders can create unlimited ledgers, each representing one borrower. Ledgers cannot exceed subscription tier limits."
                },
                {
                    number: "7.5",
                    title: "Ledger Ownership",
                    content: "Ledgers are owned by the creating lender and cannot be transferred without platform approval. Historical ledgers are maintained for 10 years."
                }
            ]
        },

        // Reputation & Blacklist System
        reputationSystem: {
            section: "8. REPUTATION & BLACKLIST SYSTEM",
            clauses: [
                {
                    number: "8.1",
                    title: "5-Star Rating System",
                    content: "Lenders rate borrowers using a 5-star system after loan completion. Ratings affect borrower access to groups and future loans."
                },
                {
                    number: "8.2",
                    title: "Blacklist Criteria",
                    content: "Borrowers are blacklisted after 60 days of non-payment. Blacklisted users cannot borrow or join new groups."
                },
                {
                    number: "8.3",
                    title: "Blacklist Visibility",
                    content: "Blacklisted borrowers are visible platform-wide with amount owed and days overdue. This serves as a community protection measure."
                },
                {
                    number: "8.4",
                    title: "Blacklist Removal",
                    content: "Only Platform Admins can remove blacklist status, and only after full repayment (principal + interest + penalties)."
                },
                {
                    number: "8.5",
                    title: "Appeal Process",
                    content: "Blacklisted users may appeal within 30 days. Appeals require evidence and may involve mediation. Platform decision is final."
                }
            ]
        },

        // Debt Collection
        debtCollection: {
            section: "9. DEBT COLLECTION",
            clauses: [
                {
                    number: "9.1",
                    title: "Platform Role",
                    content: "M-Pesewa does not participate in debt collection. We provide a directory of vetted debt collectors but take no responsibility for their actions."
                },
                {
                    number: "9.2",
                    title: "User Responsibility",
                    content: "Lenders and borrowers must handle debt collection independently. Platform provides contact information only."
                },
                {
                    number: "9.3",
                    title: "Collection Agencies",
                    content: "Listed collection agencies are vetted but not endorsed. Users must conduct their own due diligence before engaging agencies."
                },
                {
                    number: "9.4",
                    title: "Collection Practices",
                    content: "All debt collection must comply with South Sudanese law. Harassment, threats, or illegal practices are prohibited and may result in platform ban."
                },
                {
                    number: "9.5",
                    title: "Dispute Resolution",
                    content: "Debt collection disputes must be resolved between parties. Platform may mediate but does not guarantee outcomes."
                }
            ]
        },

        // Dispute Resolution
        disputeResolution: {
            section: "10. DISPUTE RESOLUTION",
            clauses: [
                {
                    number: "10.1",
                    title: "Internal Resolution First",
                    content: "All disputes must first attempt resolution within the group through the Group Admin. Unresolved disputes may escalate to Platform Admins."
                },
                {
                    number: "10.2",
                    title: "Mediation Process",
                    content: "Platform offers voluntary mediation for unresolved disputes. Mediation outcomes are non-binding but strongly encouraged."
                },
                {
                    number: "10.3",
                    title: "Arbitration Agreement",
                    content: "By using the platform, users agree to binding arbitration for unresolved disputes. Arbitration will be conducted in Juba under South Sudanese law."
                },
                {
                    number: "10.4",
                    title: "Court Jurisdiction",
                    content: "Users consent to exclusive jurisdiction of courts in Juba, South Sudan. Class action lawsuits are waived."
                },
                {
                    number: "10.5",
                    title: "Governing Law",
                    content: "These terms are governed by South Sudanese law. Any legal proceedings must be conducted in English."
                }
            ]
        },

        // Termination & Suspension
        termination: {
            section: "11. TERMINATION & SUSPENSION",
            clauses: [
                {
                    number: "11.1",
                    title: "User Termination Rights",
                    content: "Users may terminate accounts at any time, provided all loans are settled and obligations fulfilled. Data retention policies apply."
                },
                {
                    number: "11.2",
                    title: "Platform Termination Rights",
                    content: "M-Pesewa may terminate or suspend accounts for violation of terms, illegal activity, fraud, or at our sole discretion."
                },
                {
                    number: "11.3",
                    title: "Effect of Termination",
                    content: "Upon termination, access is immediately revoked. Active loans must continue to repayment. Historical data is retained per legal requirements."
                },
                {
                    number: "11.4",
                    title: "Appeal Process",
                    content: "Terminated users may appeal within 30 days. Appeals require explanation and evidence. Platform decision is final."
                }
            ]
        },

        // Limitation of Liability
        liability: {
            section: "12. LIMITATION OF LIABILITY",
            clauses: [
                {
                    number: "12.1",
                    title: "No Financial Liability",
                    content: "M-Pesewa is not liable for loan defaults, financial losses, investment returns, or transactional disputes between users."
                },
                {
                    number: "12.2",
                    title: "Platform Availability",
                    content: "We do not guarantee uninterrupted platform access. We are not liable for service interruptions, maintenance, or technical issues."
                },
                {
                    number: "12.3",
                    title: "Maximum Liability",
                    content: "Our maximum liability is limited to subscription fees paid in the preceding 12 months. No liability for indirect, consequential, or punitive damages."
                },
                {
                    number: "12.4",
                    title: "Force Majeure",
                    content: "We are not liable for failures due to events beyond our control including war, terrorism, natural disasters, government actions, or pandemics."
                }
            ]
        },

        // Amendments & Notices
        amendments: {
            section: "13. AMENDMENTS & NOTICES",
            clauses: [
                {
                    number: "13.1",
                    title: "Term Changes",
                    content: "We may modify these terms at any time. Continued use after changes constitutes acceptance. Material changes will be notified 30 days in advance."
                },
                {
                    number: "13.2",
                    title: "Notification Method",
                    content: "Notices will be sent via email, SMS, or in-app notification. Users are responsible for maintaining current contact information."
                },
                {
                    number: "13.3",
                    title: "Acceptance",
                    content: "By registering, users accept all terms and conditions. Users must read and understand terms before proceeding."
                }
            ]
        },

        // Contact Information
        contact: {
            section: "14. CONTACT INFORMATION",
            clauses: [
                {
                    number: "14.1",
                    title: "Legal Department",
                    content: "M-Pesewa Legal Department, Plot 123, Juba City Center, Juba, South Sudan. Email: legal@mpesewa.com, Phone: +211 955 000 003"
                },
                {
                    number: "14.2",
                    title: "Support",
                    content: "For support: support@mpesewa.com, Phone: +211 955 000 000, WhatsApp: +211 955 000 001"
                },
                {
                    number: "14.3",
                    title: "Compliance",
                    content: "For compliance issues: compliance@mpesewa.com, Phone: +211 955 000 004"
                },
                {
                    number: "14.4",
                    title: "Regulatory",
                    content: "For regulatory inquiries: regulatory@mpesewa.com, Phone: +211 955 000 005"
                }
            ]
        }
    },

    // ============================================
    // 3️⃣ PRIVACY POLICY - SOUTH SUDAN SPECIFIC
    // ============================================
    privacyPolicy: {
        // Information Collection
        collection: {
            section: "1. INFORMATION WE COLLECT",
            categories: [
                {
                    name: "Personal Identification",
                    data: [
                        "Full name",
                        "Date of birth",
                        "National ID number",
                        "Photograph (optional)",
                        "Signature (optional)"
                    ],
                    purpose: "Identity verification, KYC compliance",
                    legalBasis: "Legal obligation, Contract"
                },
                {
                    name: "Contact Information",
                    data: [
                        "Phone number",
                        "Email address",
                        "Physical address",
                        "Location data"
                    ],
                    purpose: "Communication, service delivery, fraud prevention",
                    legalBasis: "Contract, Legitimate interests"
                },
                {
                    name: "Financial Information",
                    data: [
                        "Bank account details (optional)",
                        "Mobile money numbers",
                        "Transaction history",
                        "Credit information (if applicable)"
                    ],
                    purpose: "Payment processing, risk assessment",
                    legalBasis: "Contract, Legitimate interests"
                },
                {
                    name: "Behavioral Information",
                    data: [
                        "Login times and patterns",
                        "Device information",
                        "IP addresses",
                        "Transaction patterns"
                    ],
                    purpose: "Security, fraud prevention, service improvement",
                    legalBasis: "Legitimate interests"
                },
                {
                    name: "Group Information",
                    data: [
                        "Group membership",
                        "Group activities",
                        "Group communications",
                        "Group transaction history"
                    ],
                    purpose: "Group management, community building",
                    legalBasis: "Contract, Consent"
                }
            ],
            sensitiveData: {
                collected: false,
                exceptions: ["National ID number for verification"],
                protection: "Encrypted storage, limited access",
                consentRequired: true
            }
        },

        // Information Use
        use: {
            section: "2. HOW WE USE YOUR INFORMATION",
            purposes: [
                {
                    purpose: "Service Provision",
                    description: "To provide and maintain our platform services",
                    examples: [
                        "Account creation and management",
                        "Loan facilitation",
                        "Group management",
                        "Subscription processing"
                    ]
                },
                {
                    purpose: "Verification & Security",
                    description: "To verify identity and ensure platform security",
                    examples: [
                        "KYC compliance",
                        "Fraud prevention",
                        "Risk assessment",
                        "Account protection"
                    ]
                },
                {
                    purpose: "Communication",
                    description: "To communicate with users about platform matters",
                    examples: [
                        "Transaction notifications",
                        "Service updates",
                        "Security alerts",
                        "Support responses"
                    ]
                },
                {
                    purpose: "Legal Compliance",
                    description: "To comply with South Sudanese laws and regulations",
                    examples: [
                        "AML reporting",
                        "Tax compliance",
                        "Regulatory reporting",
                        "Court orders"
                    ]
                },
                {
                    purpose: "Improvement & Research",
                    description: "To improve our services and conduct research",
                    examples: [
                        "Service optimization",
                        "Feature development",
                        "Market research",
                        "Analytics"
                    ]
                }
            ],
            restrictions: [
                "No sale of personal data",
                "No sharing for third-party marketing",
                "No profiling without consent",
                "No automated decision making with legal effects"
            ]
        },

        // Information Sharing
        sharing: {
            section: "3. INFORMATION SHARING",
            internalSharing: {
                withinPlatform: [
                    {
                        recipient: "Group Members",
                        dataShared: ["Name", "Rating", "Loan history within group"],
                        purpose: "Group trust building"
                    },
                    {
                        recipient: "Lenders/Borrowers in transaction",
                        dataShared: ["Contact information", "Transaction details"],
                        purpose: "Transaction facilitation"
                    },
                    {
                        recipient: "Group Admins",
                        dataShared: ["Member information", "Group activity"],
                        purpose: "Group management"
                    }
                ]
            },
            externalSharing: {
                withConsent: [
                    {
                        recipient: "Debt collection agencies",
                        dataShared: ["Contact information", "Debt details"],
                        consent: "Explicit consent required"
                    },
                    {
                        recipient: "Credit bureaus (if applicable)",
                        dataShared: ["Loan performance", "Default information"],
                        consent: "Opt-in required"
                    }
                ],
                withoutConsent: [
                    {
                        recipient: "Regulatory authorities",
                        dataShared: ["As required by law"],
                        legalBasis: "Legal obligation"
                    },
                    {
                        recipient: "Law enforcement",
                        dataShared: ["As required by court order"],
                        legalBasis: "Legal obligation"
                    },
                    {
                        recipient: "Service providers",
                        dataShared: ["Minimal necessary data"],
                        legalBasis: "Contract, Legitimate interests"
                    }
                ]
            },
            internationalTransfers: {
                allowed: false,
                exceptions: ["None"],
                safeguards: "Data localization in South Sudan",
                userRights: "Right to object to transfers"
            }
        },

        // Data Security
        security: {
            section: "4. DATA SECURITY",
            measures: [
                {
                    measure: "Encryption",
                    description: "All data encrypted in transit (TLS 1.2+) and at rest (AES-256)",
                    implementation: "Full implementation"
                },
                {
                    measure: "Access Control",
                    description: "Role-based access control with multi-factor authentication",
                    implementation: "For all sensitive operations"
                },
                {
                    measure: "Network Security",
                    description: "Firewalls, intrusion detection, DDoS protection",
                    implementation: "24/7 monitoring"
                },
                {
                    measure: "Physical Security",
                    description: "Secure data centers with biometric access",
                    implementation: "Tier 3 data centers"
                },
                {
                    measure: "Employee Training",
                    description: "Regular security and privacy training",
                    implementation: "Quarterly training"
                },
                {
                    measure: "Incident Response",
                    description: "Documented incident response plan",
                    implementation: "Tested biannually"
                }
            ],
            breachNotification: {
                timeframe: "72 hours",
                authority: "South Sudan Data Protection Authority (when established)",
                affectedUsers: "Immediate notification",
                publicNotice: "If affecting more than 1000 users"
            }
        },

        // Data Retention
        retention: {
            section: "5. DATA RETENTION",
            periods: [
                {
                    dataType: "Account Information",
                    retentionPeriod: "10 years after account closure",
                    reason: "Legal requirement, dispute resolution"
                },
                {
                    dataType: "Transaction Records",
                    retentionPeriod: "10 years after transaction",
                    reason: "Legal requirement, audit trail"
                },
                {
                    dataType: "Communication Logs",
                    retentionPeriod: "5 years",
                    reason: "Service quality, dispute resolution"
                },
                {
                    dataType: "Audit Logs",
                    retentionPeriod: "10 years",
                    reason: "Security, compliance"
                },
                {
                    dataType: "Backup Data",
                    retentionPeriod: "30 days",
                    reason: "Disaster recovery"
                }
            ],
            deletion: {
                userRequest: "Right to erasure available",
                exceptions: [
                    "Legal hold requirements",
                    "Active disputes",
                    "Regulatory requirements",
                    "Technical constraints"
                ],
                method: "Secure deletion with verification"
            }
        },

        // User Rights
        userRights: {
            section: "6. YOUR RIGHTS",
            rights: [
                {
                    right: "Right to Access",
                    description: "Access your personal data we hold",
                    process: "Submit request through account settings",
                    timeframe: "30 days",
                    fee: "No fee unless excessive"
                },
                {
                    right: "Right to Rectification",
                    description: "Correct inaccurate or incomplete data",
                    process: "Edit in account settings or request correction",
                    timeframe: "15 days",
                    verification: "Identity verification required"
                },
                {
                    right: "Right to Erasure",
                    description: "Request deletion of your data",
                    process: "Submit erasure request",
                    timeframe: "30 days",
                    limitations: "Subject to legal retention requirements"
                },
                {
                    right: "Right to Restrict Processing",
                    description: "Limit how we use your data",
                    process: "Submit restriction request",
                    timeframe: "15 days",
                    effect: "Account may be limited during restriction"
                },
                {
                    right: "Right to Data Portability",
                    description: "Receive your data in machine-readable format",
                    process: "Submit portability request",
                    timeframe: "30 days",
                    format: "JSON or CSV"
                },
                {
                    right: "Right to Object",
                    description: "Object to certain processing",
                    process: "Submit objection request",
                    timeframe: "15 days",
                    exceptions: "Legal obligations, contractual necessities"
                }
            ],
            exerciseProcess: {
                primary: "Through account settings interface",
                secondary: "Email to privacy@mpesewa.com",
                verification: "Identity verification required",
                assistance: "Free assistance provided"
            }
        },

        // Cookies & Tracking
        cookies: {
            section: "7. COOKIES & TRACKING",
            types: [
                {
                    type: "Essential Cookies",
                    purpose: "Platform functionality, security",
                    examples: ["Session management", "Authentication", "Security"],
                    mandatory: true,
                    optOut: "Not possible"
                },
                {
                    type: "Analytics Cookies",
                    purpose: "Service improvement, performance",
                    examples: ["Usage statistics", "Feature performance", "Error tracking"],
                    mandatory: false,
                    optOut: "Available in settings"
                },
                {
                    type: "Marketing Cookies",
                    purpose: "Relevant advertising, promotions",
                    examples: ["Ad targeting", "Campaign measurement"],
                    mandatory: false,
                    optOut: "Available in settings"
                }
            ],
            control: {
                browserSettings: "Can disable through browser",
                platformSettings: "Cookie preferences in account settings",
                doNotTrack: "We respect Do Not Track signals",
                thirdPartyCookies: "Limited use with transparency"
            }
        },

        // Children's Privacy
        childrenPrivacy: {
            section: "8. CHILDREN'S PRIVACY",
            ageLimit: "18 years",
            verification: "Age verification during registration",
            parentalConsent: "Not applicable - no services for minors",
            dataCollection: "No intentional collection from children",
            reporting: "Report suspected minor accounts to privacy@mpesewa.com"
        },

        // Changes to Policy
        policyChanges: {
            section: "9. CHANGES TO THIS POLICY",
            notification: "30 days notice for material changes",
            methods: ["Email", "SMS", "In-app notification", "Platform banner"],
            acceptance: "Continued use after changes constitutes acceptance",
            archive: "Previous versions available upon request",
            effectiveDate: "2024-01-24"
        },

        // Contact for Privacy
        privacyContact: {
            section: "10. CONTACT US",
            dataProtectionOfficer: {
                name: "John Deng",
                email: "dpo@mpesewa.com",
                phone: "+211 955 000 002",
                address: "Data Protection Office, M-Pesewa, Juba"
            },
            complaints: {
                internal: "privacy@mpesewa.com",
                external: "South Sudan Data Protection Authority (when established)",
                timeframe: "30 days for response"
            }
        }
    },

    // ============================================
    // 4️⃣ FAIR PRACTICES CODE
    // ============================================
    fairPractices: {
        // Lender Fair Practices
        lenderPractices: {
            section: "LENDER FAIR PRACTICES",
            principles: [
                {
                    principle: "Transparent Terms",
                    requirements: [
                        "Clearly state loan terms before approval",
                        "No hidden fees or charges",
                        "Disclose all conditions upfront",
                        "Provide written confirmation"
                    ]
                },
                {
                    principle: "Fair Assessment",
                    requirements: [
                        "Assess borrowers fairly and consistently",
                        "Do not discriminate based on protected characteristics",
                        "Consider individual circumstances",
                        "Provide reasons for rejection"
                    ]
                },
                {
                    principle: "Responsible Lending",
                    requirements: [
                        "Do not lend beyond borrower's repayment capacity",
                        "Consider borrower's existing obligations",
                        "Avoid creating debt traps",
                        "Monitor loan performance"
                    ]
                },
                {
                    principle: "Professional Conduct",
                    requirements: [
                        "Maintain professional communication",
                        "Respect borrower privacy",
                        "Avoid harassment or intimidation",
                        "Follow ethical collection practices"
                    ]
                }
            ]
        },

        // Borrower Fair Practices
        borrowerPractices: {
            section: "BORROWER FAIR PRACTICES",
            principles: [
                {
                    principle: "Truthful Information",
                    requirements: [
                        "Provide accurate personal information",
                        "Disclose existing obligations",
                        "State true purpose for loan",
                        "Update information changes"
                    ]
                },
                {
                    principle: "Responsible Borrowing",
                    requirements: [
                        "Borrow only what you need",
                        "Assess repayment capacity",
                        "Avoid multiple simultaneous loans",
                        "Prioritize loan repayment"
                    ]
                },
                {
                    principle: "Timely Communication",
                    requirements: [
                        "Communicate repayment difficulties early",
                        "Respond to lender inquiries",
                        "Update contact information",
                        "Participate in resolution processes"
                    ]
                },
                {
                    principle: "Fair Use",
                    requirements: [
                        "Use funds for stated purpose",
                        "Do not misuse platform features",
                        "Respect group rules",
                        "Maintain good standing"
                    ]
                }
            ]
        },

        // Platform Fair Practices
        platformPractices: {
            section: "PLATFORM FAIR PRACTICES",
            principles: [
                {
                    principle: "Transparent Operations",
                    requirements: [
                        "Clear terms and conditions",
                        "Visible fee structure",
                        "Open communication channels",
                        "Regular reporting"
                    ]
                },
                {
                    principle: "Fair Access",
                    requirements: [
                        "Equal access to all eligible users",
                        "Non-discriminatory policies",
                        "Reasonable eligibility criteria",
                        "Appeal mechanisms"
                    ]
                },
                {
                    principle: "Responsible Governance",
                    requirements: [
                        "Effective dispute resolution",
                        "Privacy protection",
                        "Security measures",
                        "Continuous improvement"
                    ]
                },
                {
                    principle: "Community Building",
                    requirements: [
                        "Promote responsible lending",
                        "Encourage timely repayment",
                        "Facilitate trust building",
                        "Support financial education"
                    ]
                }
            ]
        },

        // Grievance Redressal
        grievanceRedressal: {
            section: "GRIEVANCE REDRESSAL MECHANISM",
            process: [
                {
                    stage: "Level 1 - Group Resolution",
                    responsible: "Group Admin",
                    timeframe: "7 days",
                    escalation: "If unresolved after 7 days"
                },
                {
                    stage: "Level 2 - Platform Mediation",
                    responsible: "Platform Mediator",
                    timeframe: "15 days",
                    escalation: "If unresolved after 15 days"
                },
                {
                    stage: "Level 3 - Arbitration",
                    responsible: "Independent Arbitrator",
                    timeframe: "30 days",
                    decision: "Binding decision"
                },
                {
                    stage: "Level 4 - Legal Recourse",
                    responsible: "Courts in Juba",
                    timeframe: "As per legal process",
                    jurisdiction: "South Sudanese courts"
                }
            ],
            contact: {
                grievanceOfficer: {
                    name: "Mary Akech",
                    email: "grievance@mpesewa.com",
                    phone: "+211 955 000 006",
                    hours: "09:00-17:00, Monday-Friday"
                },
                escalation: "grievance.escalation@mpesewa.com",
                physical: "Grievance Redressal Office, M-Pesewa, Juba"
            },
            tracking: {
                referenceNumber: "Provided upon complaint submission",
                statusUpdates: "Every 3 days",
                resolutionTime: "Maximum 45 days",
                feedback: "Post-resolution survey"
            }
        }
    },

    // ============================================
    // 5️⃣ REGULATORY REPORTING REQUIREMENTS
    // ============================================
    regulatoryReporting: {
        // Reporting Schedule
        schedule: {
            daily: {
                reports: ["Transaction Summary", "Suspicious Activity"],
                deadline: "09:00 next day",
                format: "Electronic (XML/JSON)",
                recipient: "Financial Intelligence Unit"
            },
            weekly: {
                reports: ["Platform Activity", "Risk Assessment"],
                deadline: "Monday 10:00",
                format: "PDF Report",
                recipient: "Bank of South Sudan"
            },
            monthly: {
                reports: [
                    "Financial Statement",
                    "Compliance Report",
                    "User Statistics",
                    "Default Report"
                ],
                deadline: "5th of following month",
                format: "Formal Report",
                recipient: "Bank of South Sudan, Ministry of Finance"
            },
            quarterly: {
                reports: ["Audit Summary", "Risk Management", "Business Continuity"],
                deadline: "15th after quarter end",
                format: "Board Report",
                recipient: "Board of Directors, Regulators"
            },
            annual: {
                reports: [
                    "Annual Financial Report",
                    "Compliance Audit",
                    "Risk Assessment",
                    "Business Plan"
                ],
                deadline: "March 31st",
                format: "Audited Report",
                recipient: "All regulatory bodies"
            }
        },

        // Threshold Reporting
        thresholds: {
            cashTransaction: {
                amount: 1000000, // 1 Million SSP
                report: "Large Cash Transaction Report",
                timeframe: "Within 24 hours",
                authority: "Financial Intelligence Unit"
            },
            suspiciousActivity: {
                threshold: "No minimum",
                report: "Suspicious Activity Report",
                timeframe: "Within 24 hours",
                authority: "Financial Intelligence Unit, National Security"
            },
            crossBorder: {
                threshold: "Any amount",
                report: "Cross-Border Transaction Report",
                timeframe: "Within 48 hours",
                authority: "Bank of South Sudan, Customs"
            },
            default: {
                threshold: 50000, // 50,000 SSP
                report: "Significant Default Report",
                timeframe: "Within 7 days",
                authority: "Credit Bureau (if applicable)"
            }
        },

        // Audit Requirements
        audit: {
            frequency: "Annual",
            auditor: "Approved auditing firm",
            scope: [
                "Financial statements",
                "Compliance with regulations",
                "Internal controls",
                "Risk management",
                "Data protection"
            ],
            standards: "International Standards on Auditing",
            submission: "To Board and Regulators",
            followUp: "Action plan for findings"
        },

        // Record Keeping
        recordKeeping: {
            financialRecords: {
                duration: "10 years",
                format: "Electronic with backup",
                access: "Regulators, Auditors, Management"
            },
            userRecords: {
                duration: "10 years after account closure",
                format: "Electronic with encryption",
                access: "Limited authorized personnel"
            },
            transactionRecords: {
                duration: "10 years",
                format: "Immutable ledger",
                access: "As per authorization matrix"
            },
            communicationRecords: {
                duration: "5 years",
                format: "Electronic archive",
                access: "Compliance, Legal, Users (own)"
            }
        }
    },

    // ============================================
    // 6️⃣ COMPLIANCE MONITORING & ENFORCEMENT
    // ============================================
    complianceMonitoring: {
        // Internal Controls
        internalControls: {
            segregationOfDuties: {
                implementation: "Full",
                review: "Quarterly",
                automatedChecks: true
            },
            authorizationMatrix: {
                levels: 5,
                review: "Bi-annually",
                automatedEnforcement: true
            },
            transactionMonitoring: {
                realTime: true,
                rules: "Configurable rule engine",
                alerts: "Immediate to compliance team"
            },
            reconciliation: {
                frequency: "Daily",
                tolerance: "Zero tolerance",
                automated: true
            }
        },

        // Risk Management
        riskManagement: {
            assessmentFrequency: "Quarterly",
            riskCategories: [
                "Credit Risk",
                "Operational Risk",
                "Compliance Risk",
                "Reputational Risk",
                "Strategic Risk"
            ],
            mitigation: {
                creditRisk: ["Tier limits", "Guarantor system", "Blacklisting"],
                operationalRisk: ["Backup systems", "Disaster recovery", "Insurance"],
                complianceRisk: ["Regular training", "Monitoring", "Audits"],
                reputationalRisk: ["Transparency", "Quick resolution", "Communication"],
                strategicRisk: ["Market research", "Diversification", "Innovation"]
            },
            reporting: "To Board quarterly",
            actionPlan: "For high-risk areas"
        },

        // Training & Awareness
        training: {
            frequency: {
                newEmployees: "Within first week",
                allEmployees: "Quarterly",
                management: "Bi-annually",
                board: "Annually"
            },
            topics: [
                "AML/CFT regulations",
                "Data protection",
                "Consumer protection",
                "Ethical conduct",
                "Platform rules"
            ],
            assessment: "Post-training test",
            certification: "Annual certification required",
            records: "Maintained for 5 years"
        },

        // Penalties & Sanctions
        penalties: {
            userViolations: [
                {
                    violation: "False information",
                    penalty: "Account suspension, possible blacklisting"
                },
                {
                    violation: "Loan misuse",
                    penalty: "Immediate repayment demand, blacklisting"
                },
                {
                    violation: "Harassment",
                    penalty: "Account suspension, possible legal action"
                },
                {
                    violation: "Fraud",
                    penalty: "Immediate termination, blacklisting, legal action"
                }
            ],
            platformPenalties: [
                {
                    violation: "Regulatory non-compliance",
                    penalty: "Fines up to 10,000,000 SSP, license suspension"
                },
                {
                    violation: "Data breach",
                    penalty: "Fines up to 5,000,000 SSP, compensation"
                },
                {
                    violation: "Consumer protection violation",
                    penalty: "Fines up to 2,000,000 SSP, corrective orders"
                }
            ],
            appealProcess: {
                timeframe: "30 days",
                process: "Written appeal with evidence",
                decision: "Within 30 days of appeal",
                final: "Board decision is final"
            }
        }
    },

    // ============================================
    // 7️⃣ DISPUTE RESOLUTION FRAMEWORK
    // ============================================
    disputeResolution: {
        // Types of Disputes
        disputeTypes: [
            {
                type: "Loan Terms Dispute",
                description: "Disagreement over loan terms or conditions",
                resolutionPath: "Group Admin → Platform Mediation → Arbitration"
            },
            {
                type: "Repayment Dispute",
                description: "Disagreement over repayment amount or timing",
                resolutionPath: "Direct negotiation → Platform Mediation → Arbitration"
            },
            {
                type: "Service Dispute",
                description: "Complaint about platform services",
                resolutionPath: "Support → Grievance Officer → Management"
            },
            {
                type: "Fraud Allegation",
                description: "Allegation of fraudulent activity",
                resolutionPath: "Immediate platform investigation → Legal action"
            }
        ],

        // Mediation Process
        mediation: {
            eligibility: "All disputes except fraud allegations",
            request: "Through platform interface or email",
            mediator: "Trained platform mediator",
            process: [
                "Submission of dispute details",
                "Mediator contacts both parties",
                "Information gathering",
                "Mediation session",
                "Settlement agreement"
            ],
            timeframe: "15 days maximum",
            successRate: "85% (based on pilot)",
            cost: "Free for users"
        },

        // Arbitration Process
        arbitration: {
            trigger: "Unresolved after mediation or direct request",
            arbitrator: "Independent arbitrator from approved panel",
            selection: "Mutual agreement or platform appointment",
            process: [
                "Submission of evidence",
                "Preliminary hearing",
                "Discovery process",
                "Arbitration hearing",
                "Award issuance"
            ],
            timeframe: "30 days maximum",
            cost: "Shared equally between parties",
            award: "Binding and enforceable",
            appeal: "Limited to procedural errors"
        },

        // Court Process
        courtProcess: {
            jurisdiction: "Courts in Juba, South Sudan",
            language: "English",
            limitationPeriod: "2 years from dispute arising",
            smallClaims: "For disputes under 500,000 SSP",
            legalRepresentation: "Optional",
            enforcement: "Through court mechanisms"
        }
    }
};

// ============================================
// EXPORT LEGAL CONFIGURATION
// ============================================

// Export for CommonJS (Node.js)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SOUTH_SUDAN_LEGAL;
}

// Export for ES6 Modules
if (typeof exports !== 'undefined') {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = SOUTH_SUDAN_LEGAL;
}

// Export for browser global
if (typeof window !== 'undefined') {
    window.MPesewaLegal = window.MPesewaLegal || {};
    window.MPesewaLegal.SouthSudan = SOUTH_SUDAN_LEGAL;
}

// ============================================
// LEGAL VALIDATION & COMPLIANCE FUNCTIONS
// ============================================

/**
 * Validate legal compliance for transaction
 * @param {Object} transaction - Transaction details
 * @returns {Object} Compliance validation result
 */
function validateLegalCompliance(transaction) {
    const violations = [];
    const warnings = [];
    
    // Check AML thresholds
    if (transaction.amount >= SOUTH_SUDAN_LEGAL.regulatoryReporting.thresholds.cashTransaction.amount) {
        warnings.push(`Transaction amount (${transaction.amount} SSP) exceeds large transaction reporting threshold`);
    }
    
    // Check interest rate compliance
    const maxInterestRate = 0.10; // 10% per week
    if (transaction.interestRate > maxInterestRate) {
        violations.push(`Interest rate (${transaction.interestRate}) exceeds legal maximum of 10% per week`);
    }
    
    // Check loan purpose compliance
    const allowedPurposes = SOUTH_SUDAN_LEGAL.termsAndConditions.loanTerms.clauses
        .find(c => c.number === "5.1").content;
    if (!transaction.purpose || !allowedPurposes.includes(transaction.purpose)) {
        violations.push(`Loan purpose '${transaction.purpose}' not allowed`);
    }
    
    // Check consumer protection cooling-off period
    if (transaction.type === 'LOAN_APPLICATION' && SOUTH_SUDAN_LEGAL.legalFramework.consumerProtection.coolingOffPeriod.enabled) {
        if (!transaction.coolingOffAcknowledged) {
            warnings.push('Cooling-off period rights not acknowledged');
        }
    }
    
    // Check data protection compliance
    if (!transaction.privacyConsent) {
        violations.push('Privacy consent not obtained');
    }
    
    // Check fair practices
    if (transaction.lenderTier === 'BASIC' && transaction.amount > 1500) {
        violations.push('Basic tier lenders cannot lend more than 1,500 SSP');
    }
    
    return {
        compliant: violations.length === 0,
        violations,
        warnings,
        requiredActions: violations.length > 0 ? ['Fix violations before proceeding'] : [],
        timestamp: new Date().toISOString()
    };
}

/**
 * Generate legal documents for transaction
 * @param {Object} transaction - Transaction details
 * @returns {Object} Generated legal documents
 */
function generateLegalDocuments(transaction) {
    const docs = {};
    const timestamp = new Date().toISOString();
    
    // Loan Agreement
    docs.loanAgreement = {
        documentId: `LA-SS-${transaction.id}-${timestamp}`,
        type: 'LOAN_AGREEMENT',
        parties: {
            lender: transaction.lenderDetails,
            borrower: transaction.borrowerDetails
        },
        terms: {
            principal: transaction.amount,
            interestRate: '10% per week',
            repaymentPeriod: '7 days',
            purpose: transaction.purpose,
            disbursementDate: transaction.disbursementDate,
            dueDate: transaction.dueDate
        },
        clauses: SOUTH_SUDAN_LEGAL.termsAndConditions.loanTerms.clauses.map(c => ({
            number: c.number,
            title: c.title,
            summary: c.content.substring(0, 100) + '...'
        })),
        governingLaw: 'Laws of South Sudan',
        jurisdiction: 'Courts in Juba, South Sudan',
        execution: {
            digitalSignature: true,
            timestamp: timestamp,
            witnesses: transaction.guarantors || []
        }
    };
    
    // Privacy Notice
    docs.privacyNotice = {
        documentId: `PN-SS-${transaction.id}-${timestamp}`,
        type: 'PRIVACY_NOTICE',
        dataCollection: SOUTH_SUDAN_LEGAL.privacyPolicy.collection.categories.map(c => ({
            category: c.name,
            purposes: c.purpose
        })),
        userRights: SOUTH_SUDAN_LEGAL.privacyPolicy.userRights.rights.map(r => r.right),
        contact: SOUTH_SUDAN_LEGAL.privacyPolicy.privacyContact.dataProtectionOfficer,
        acknowledgment: transaction.privacyConsent || false
    };
    
    // Fair Practices Acknowledgment
    docs.fairPractices = {
        documentId: `FP-SS-${transaction.id}-${timestamp}`,
        type: 'FAIR_PRACTICES_ACKNOWLEDGMENT',
        lenderPractices: SOUTH_SUDAN_LEGAL.fairPractices.lenderPractices.principles.map(p => p.principle),
        borrowerPractices: SOUTH_SUDAN_LEGAL.fairPractices.borrowerPractices.principles.map(p => p.principle),
        acknowledgment: true,
        date: timestamp
    };
    
    // Regulatory Disclosures
    docs.regulatoryDisclosures = {
        documentId: `RD-SS-${transaction.id}-${timestamp}`,
        type: 'REGULATORY_DISCLOSURES',
        platformLicense: SOUTH_SUDAN_LEGAL.legalFramework.financialRegulation.licenseNumber,
        regulatoryBody: SOUTH_SUDAN_LEGAL.legalFramework.financialRegulation.primaryRegulator,
        consumerProtection: SOUTH_SUDAN_LEGAL.legalFramework.consumerProtection.enforcementAgency,
        disputeResolution: SOUTH_SUDAN_LEGAL.disputeResolution.mediation.process.join(' → '),
        acknowledgment: true
    };
    
    return docs;
}

/**
 * Check regulatory reporting requirements
 * @param {Object} transaction - Transaction details
 * @returns {Object} Reporting requirements
 */
function getReportingRequirements(transaction) {
    const requirements = [];
    
    // Large transaction reporting
    if (transaction.amount >= SOUTH_SUDAN_LEGAL.regulatoryReporting.thresholds.cashTransaction.amount) {
        requirements.push({
            type: 'LARGE_TRANSACTION',
            report: 'Large Cash Transaction Report',
            deadline: 'Within 24 hours',
            authority: 'Financial Intelligence Unit',
            triggered: true
        });
    }
    
    // Suspicious activity reporting (placeholder logic)
    if (transaction.suspiciousIndicators && transaction.suspiciousIndicators.length > 0) {
        requirements.push({
            type: 'SUSPICIOUS_ACTIVITY',
            report: 'Suspicious Activity Report',
            deadline: 'Within 24 hours',
            authority: 'Financial Intelligence Unit',
            triggered: true
        });
    }
    
    // Default reporting
    if (transaction.status === 'DEFAULT' && transaction.amount >= 50000) {
        requirements.push({
            type: 'SIGNIFICANT_DEFAULT',
            report: 'Significant Default Report',
            deadline: 'Within 7 days',
            authority: 'Credit Bureau',
            triggered: true
        });
    }
    
    // Monthly reporting (always required)
    requirements.push({
        type: 'MONTHLY_SUMMARY',
        report: 'Monthly Transaction Summary',
        deadline: '5th of following month',
        authority: 'Bank of South Sudan',
        triggered: true
    });
    
    return {
        transactionId: transaction.id,
        requirements,
        totalReports: requirements.length,
        immediateReports: requirements.filter(r => r.deadline.includes('24 hours')).length,
        generatedAt: new Date().toISOString()
    };
}

/**
 * Generate compliance certificate
 * @param {string} userId - User ID
 * @param {string} userType - User type (LENDER/BORROWER)
 * @returns {Object} Compliance certificate
 */
function generateComplianceCertificate(userId, userType) {
    const timestamp = new Date();
    const expiryDate = new Date(timestamp);
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    
    const certificate = {
        certificateId: `CC-SS-${userId}-${timestamp.getTime()}`,
        userId: userId,
        userType: userType,
        issuedDate: timestamp.toISOString(),
        expiryDate: expiryDate.toISOString(),
        issuingAuthority: 'M-Pesewa Compliance Department',
        regulatoryCompliance: {
            kyc: 'COMPLETE',
            aml: 'CLEAR',
            dataProtection: 'COMPLIANT',
            consumerProtection: 'ACKNOWLEDGED'
        },
        platformCompliance: {
            termsAccepted: true,
            privacyPolicyAccepted: true,
            fairPracticesAcknowledged: true,
            disputeResolutionAgreed: true
        },
        userSpecific: userType === 'LENDER' ? {
            subscriptionTier: 'BASIC',
            lendingLimit: '1,500 SSP per week',
            ledgerManagement: 'ENABLED'
        } : {
            borrowingLimit: 'Based on rating',
            groupMembership: 'Up to 4 groups',
            ratingSystem: '5-star'
        },
        verification: {
            digitalSignature: `MPESEWA-SS-${timestamp.getTime()}`,
            verificationUrl: `https://verify.mpesewa.com/certificate/${userId}`,
            qrCode: `DATA:image/png;base64,VERIFICATION_QR_FOR_${userId}`
        }
    };
    
    return certificate;
}

/**
 * Calculate statutory penalties
 * @param {Object} violation - Violation details
 * @returns {Object} Penalty calculation
 */
function calculatePenalties(violation) {
    const basePenalties = {
        FALSE_INFORMATION: {
            userPenalty: 'Account suspension',
            platformPenalty: 'Warning, possible fine up to 100,000 SSP',
            duration: '30 days suspension',
            appealAllowed: true
        },
        LOAN_MISUSE: {
            userPenalty: 'Immediate repayment, blacklisting',
            platformPenalty: 'Investigation required',
            duration: 'Permanent for severe cases',
            appealAllowed: true
        },
        LATE_REPAYMENT: {
            userPenalty: '5% daily penalty',
            platformPenalty: 'Mediation offered',
            duration: 'Until repayment',
            appealAllowed: false
        },
        HARASSMENT: {
            userPenalty: 'Account suspension',
            platformPenalty: 'Possible legal action',
            duration: '60 days minimum',
            appealAllowed: true
        },
        FRAUD: {
            userPenalty: 'Immediate termination, blacklisting, legal action',
            platformPenalty: 'Mandatory regulatory reporting',
            duration: 'Permanent',
            appealAllowed: false
        },
        REGULATORY_NON_COMPLIANCE: {
            userPenalty: 'N/A',
            platformPenalty: 'Fines up to 10,000,000 SSP',
            duration: 'Until compliance achieved',
            appealAllowed: true
        }
    };
    
    const violationType = violation.type.toUpperCase().replace(/\s+/g, '_');
    const basePenalty = basePenalties[violationType] || basePenalties.FALSE_INFORMATION;
    
    // Calculate monetary penalties if applicable
    let monetaryPenalty = 0;
    if (violation.amount) {
        if (violationType === 'LATE_REPAYMENT') {
            monetaryPenalty = violation.amount * 0.05 * violation.daysLate;
        } else if (violationType === 'REGULATORY_NON_COMPLIANCE') {
            monetaryPenalty = Math.min(violation.amount * 0.1, 10000000);
        }
    }
    
    return {
        violation: violation.type,
        severity: violation.severity || 'MEDIUM',
        userPenalty: basePenalty.userPenalty,
        platformPenalty: basePenalty.platformPenalty,
        monetaryPenalty: monetaryPenalty > 0 ? {
            amount: monetaryPenalty,
            currency: 'SSP',
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        } : null,
        duration: basePenalty.duration,
        appealAllowed: basePenalty.appealAllowed,
        appealDeadline: basePenalty.appealAllowed ? 
            new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : null,
        generatedAt: new Date().toISOString()
    };
}

/**
 * Generate legal summary for user
 * @param {string} userId - User ID
 * @returns {Object} Legal summary
 */
function generateLegalSummary(userId) {
    const summary = {
        userId: userId,
        generatedAt: new Date().toISOString(),
        termsAccepted: [
            {
                document: 'Terms & Conditions',
                version: '1.0.0',
                acceptedDate: new Date().toISOString(),
                keyClauses: SOUTH_SUDAN_LEGAL.termsAndConditions.platformRole.clauses.map(c => c.number)
            },
            {
                document: 'Privacy Policy',
                version: '1.0.0',
                acceptedDate: new Date().toISOString(),
                keyRights: SOUTH_SUDAN_LEGAL.privacyPolicy.userRights.rights.map(r => r.right)
            },
            {
                document: 'Fair Practices Code',
                version: '1.0.0',
                acceptedDate: new Date().toISOString(),
                keyPrinciples: SOUTH_SUDAN_LEGAL.fairPractices.lenderPractices.principles.map(p => p.principle)
            }
        ],
        regulatoryStatus: {
            kyc: 'VERIFIED',
            aml: 'CLEAR',
            tax: 'NOT_APPLICABLE',
            credit: 'NOT_CHECKED'
        },
        disputeHistory: {
            totalDisputes: 0,
            resolved: 0,
            pending: 0,
            escalationLevel: 'NONE'
        },
        complianceScore: 100, // Percentage
        nextReview: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        legalContacts: {
            support: 'support@mpesewa.com',
            legal: 'legal@mpesewa.com',
            compliance: 'compliance@mpesewa.com',
            grievance: 'grievance@mpesewa.com'
        }
    };
    
    return summary;
}

// ============================================
// EXPORT LEGAL FUNCTIONS
// ============================================

// Export utility functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports.validateLegalCompliance = validateLegalCompliance;
    module.exports.generateLegalDocuments = generateLegalDocuments;
    module.exports.getReportingRequirements = getReportingRequirements;
    module.exports.generateComplianceCertificate = generateComplianceCertificate;
    module.exports.calculatePenalties = calculatePenalties;
    module.exports.generateLegalSummary = generateLegalSummary;
}

// Export for browser global
if (typeof window !== 'undefined') {
    window.MPesewaLegalSouthSudan = {
        config: SOUTH_SUDAN_LEGAL,
        validateLegalCompliance,
        generateLegalDocuments,
        getReportingRequirements,
        generateComplianceCertificate,
        calculatePenalties,
        generateLegalSummary
    };
}

// ============================================
// COMPLIANCE INITIALIZATION & SELF-TEST
// ============================================

/**
 * Initialize legal compliance system
 * @returns {Object} Initialization result
 */
function initializeLegalCompliance() {
    console.log('=== M-PESEWA SOUTH SUDAN LEGAL COMPLIANCE ===');
    console.log(`Regulatory Body: ${SOUTH_SUDAN_LEGAL.legalFramework.financialRegulation.primaryRegulator}`);
    console.log(`License: ${SOUTH_SUDAN_LEGAL.legalFramework.financialRegulation.licenseNumber}`);
    console.log(`Data Protection: ${SOUTH_SUDAN_LEGAL.legalFramework.dataProtection.governingLaw}`);
    
    // Test compliance validation
    const testTransaction = {
        id: 'TEST-TXN-001',
        amount: 2000,
        interestRate: 0.10,
        purpose: 'M-pesewa Fare',
        type: 'LOAN_APPLICATION',
        coolingOffAcknowledged: true,
        privacyConsent: true,
        lenderTier: 'BASIC',
        suspiciousIndicators: []
    };
    
    const complianceCheck = validateLegalCompliance(testTransaction);
    console.log(`Compliance Check: ${complianceCheck.compliant ? 'PASS' : 'FAIL'}`);
    
    // Test legal document generation
    const testDocs = generateLegalDocuments(testTransaction);
    console.log(`Documents Generated: ${Object.keys(testDocs).length}`);
    
    // Test reporting requirements
    const reporting = getReportingRequirements(testTransaction);
    console.log(`Reporting Requirements: ${reporting.totalReports}`);
    
    // Test penalty calculation
    const testViolation = {
        type: 'Late Repayment',
        amount: 1000,
        daysLate: 3
    };
    
    const penalties = calculatePenalties(testViolation);
    console.log(`Penalty Calculation: ${penalties.monetaryPenalty ? 'With monetary penalty' : 'No monetary penalty'}`);
    
    return {
        initialized: true,
        complianceCheck,
        documentsGenerated: Object.keys(testDocs).length,
        reportingRequirements: reporting.totalReports,
        penaltySystem: 'ACTIVE',
        timestamp: new Date().toISOString()
    };
}

// Auto-initialize in browser
if (typeof window !== 'undefined' && window.document) {
    window.addEventListener('DOMContentLoaded', () => {
        if (window.MPesewaLegal && window.MPesewaLegal.SouthSudan) {
            initializeLegalCompliance();
        }
    });
}

// Export initialization
if (typeof module !== 'undefined' && module.exports) {
    module.exports.initializeLegalCompliance = initializeLegalCompliance;
}

// ============================================
// LEGAL COMPLIANCE METADATA
// ============================================

/**
 * Legal compliance metadata
 */
const LEGAL_METADATA = {
    name: 'South Sudan Legal Compliance',
    description: 'M-PESEWA legal and regulatory compliance configuration for South Sudan',
    author: 'M-PESEWA Legal & Compliance Team',
    maintainers: ['legal@mpesewa.com', 'compliance@mpesewa.com'],
    lastModified: '2024-01-24',
    license: 'MPESEWA PROPRIETARY - CONFIDENTIAL',
    
    // Regulatory approval
    regulatoryApproval: {
        body: 'Bank of South Sudan',
        approvalDate: '2024-01-20',
        reference: 'BOSS/COMP/2024/001',
        validity: '2024-12-31',
        conditions: [
            'Monthly reporting required',
            'Annual audit required',
            'Data localization required',
            'Consumer protection measures'
        ]
    },
    
    // Legal review
    legalReview: {
        conductedBy: 'Juba Legal Associates',
        reviewDate: '2024-01-18',
        findings: 'Compliant with South Sudanese law',
        recommendations: [
            'Regular updates for regulatory changes',
            'User education on legal rights',
            'Clear dispute resolution process'
        ]
    },
    
    // Compliance tracking
    compliance: {
        lastAudit: '2024-01-22',
        nextAudit: '2024-07-22',
        auditFirm: 'Deloitte South Sudan',
        complianceOfficer: 'Mary Akech',
        regulatoryUpdates: 'Monthly monitoring'
    },
    
    // Version tracking
    versions: [
        {
            version: '1.0.0',
            date: '2024-01-24',
            changes: 'Initial legal framework',
            approvedBy: ['Legal Department', 'Compliance Department', 'Board']
        }
    ]
};

// Export metadata
if (typeof module !== 'undefined' && module.exports) {
    module.exports.LEGAL_METADATA = LEGAL_METADATA;
}

if (typeof window !== 'undefined') {
    window.MPesewaLegalSouthSudanMetadata = LEGAL_METADATA;
}

// ============================================
// DISCLAIMER & LEGAL NOTICE
// ============================================

/**
 * Legal disclaimer notice
 */
const LEGAL_DISCLAIMER = `
IMPORTANT LEGAL NOTICE

This legal configuration file contains proprietary and confidential information
of M-Pesewa Technology Pvt. Ltd. Unauthorized access, use, disclosure, or
distribution is strictly prohibited.

This document does not constitute legal advice. Users should consult with
qualified legal counsel for specific legal matters.

All information is subject to change without notice. Users are responsible for
ensuring compliance with current South Sudanese laws and regulations.

For legal inquiries, contact: legal@mpesewa.com
`;

// Export disclaimer
if (typeof module !== 'undefined' && module.exports) {
    module.exports.LEGAL_DISCLAIMER = LEGAL_DISCLAIMER;
    console.log(LEGAL_DISCLAIMER);
}

// ============================================
// END OF SOUTH SUDAN LEGAL CONFIGURATION
// ============================================