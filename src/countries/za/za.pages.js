/**
 * South Africa (ZA) Pages Module
 * M-Pesewa Country-Specific Pages - South Africa
 * Last Updated: 2026-01-24
 * 
 * PAGE HIERARCHY ENFORCEMENT:
 * 1. Country Landing Pages
 * 2. Regulatory Pages
 * 3. User Journey Pages
 * 4. Compliance Pages
 */

const ZA_PAGES = {
    // ============================================
    // 1. COUNTRY LANDING PAGES
    // ============================================
    landing: {
        // 1.1. Main Country Landing Page
        main: {
            id: "za-landing",
            title: "M-Pesewa South Africa | Emergency Micro-Lending",
            meta: {
                description: "Emergency micro-lending platform for South Africa. Connect with trusted groups, borrow for emergencies, or lend responsibly. FSCA regulated.",
                keywords: "emergency loans South Africa, peer-to-peer lending ZAR, FSCA regulated, micro-lending Johannesburg, Cape Town loans",
                ogImage: "/assets/images/countries/za/og-landing.jpg"
            },
            hero: {
                title: "Emergency Lending for South Africans",
                subtitle: "FSCA regulated • National Credit Act compliant • ZAR loans only",
                cta: {
                    primary: {
                        text: "Get Started in South Africa",
                        link: "/za/register",
                        color: "#003366"
                    },
                    secondary: {
                        text: "View South African Rates",
                        link: "/za/rates",
                        color: "#0099ff"
                    }
                },
                features: [
                    "🇿🇦 South Africa only - No cross-border",
                    "📋 FSCA & NCR compliant",
                    "💳 ZAR loans only",
                    "👥 Local groups & communities"
                ]
            },
            sections: [
                {
                    id: "za-regulations",
                    title: "South African Regulations",
                    content: `
                        <div class="regulation-card">
                            <h3><span class="flag">🇿🇦</span> Financial Sector Conduct Authority (FSCA)</h3>
                            <p>M-Pesewa operates under FSCA license <strong>FSP${ZA_PAGES.config?.licenses?.fsca?.licenseNumber || '12345'}</strong>, ensuring compliance with South African financial regulations.</p>
                        </div>
                        <div class="regulation-card">
                            <h3><span class="flag">⚖️</span> National Credit Act Compliance</h3>
                            <p>All loans comply with NCA regulations including interest rate caps, affordability assessments, and consumer protection.</p>
                        </div>
                        <div class="regulation-card">
                            <h3><span class="flag">🔒</span> POPIA Data Protection</h3>
                            <p>Your personal information is protected under the Protection of Personal Information Act (POPIA).</p>
                        </div>
                    `
                },
                {
                    id: "za-provinces",
                    title: "Available Across South Africa",
                    content: `
                        <div class="provinces-grid">
                            <div class="province">
                                <span class="province-name">Gauteng</span>
                                <span class="province-stats">5,000+ active users</span>
                            </div>
                            <div class="province">
                                <span class="province-name">Western Cape</span>
                                <span class="province-stats">3,500+ active users</span>
                            </div>
                            <div class="province">
                                <span class="province-name">KwaZulu-Natal</span>
                                <span class="province-stats">2,800+ active users</span>
                            </div>
                            <div class="province">
                                <span class="province-name">Eastern Cape</span>
                                <span class="province-stats">1,200+ active users</span>
                            </div>
                        </div>
                    `
                }
            ]
        },

        // 1.2. City-Specific Landing Pages
        cities: {
            johannesburg: {
                id: "za-jhb",
                title: "M-Pesewa Johannesburg | Emergency Loans in Gauteng",
                meta: {
                    description: "Emergency micro-lending in Johannesburg. Connect with local groups in Sandton, Rosebank, Soweto, and surrounding areas.",
                    keywords: "Johannesburg loans, Gauteng emergency lending, Sandton micro-loans, Soweto community lending"
                },
                hero: {
                    title: "Emergency Loans in Johannesburg",
                    subtitle: "Local groups • Fast approval • ZAR only"
                },
                areas: ["Sandton", "Rosebank", "Soweto", "Randburg", "Midrand", "Roodepoort"]
            },
            capeTown: {
                id: "za-cpt",
                title: "M-Pesewa Cape Town | Emergency Loans in Western Cape",
                meta: {
                    description: "Emergency micro-lending in Cape Town. Connect with local groups in City Bowl, Southern Suburbs, Northern Suburbs.",
                    keywords: "Cape Town loans, Western Cape emergency lending, City Bowl micro-loans"
                },
                hero: {
                    title: "Emergency Loans in Cape Town",
                    subtitle: "Local groups • Fast approval • ZAR only"
                },
                areas: ["City Bowl", "Southern Suburbs", "Northern Suburbs", "Atlantic Seaboard", "Cape Flats"]
            },
            durban: {
                id: "za-dbn",
                title: "M-Pesewa Durban | Emergency Loans in KwaZulu-Natal",
                meta: {
                    description: "Emergency micro-lending in Durban. Connect with local groups in Umhlanga, Berea, Pinetown, and surrounding areas.",
                    keywords: "Durban loans, KZN emergency lending, Umhlanga micro-loans"
                },
                hero: {
                    title: "Emergency Loans in Durban",
                    subtitle: "Local groups • Fast approval • ZAR only"
                },
                areas: ["Umhlanga", "Berea", "Pinetown", "Westville", "Ballito"]
            }
        }
    },

    // ============================================
    // 2. REGULATORY & COMPLIANCE PAGES
    // ============================================
    regulatory: {
        // 2.1. FSCA Compliance Page
        fsca: {
            id: "za-fsca",
            title: "FSCA Compliance | M-Pesewa South Africa",
            meta: {
                description: "M-Pesewa's FSCA compliance details, license information, and regulatory obligations in South Africa.",
                keywords: "FSCA compliance, financial services provider, South Africa regulation, FAIS Act"
            },
            content: {
                license: {
                    number: "FSP12345",
                    type: "Category I & II Financial Services Provider",
                    issued: "2023-08-20",
                    expires: "2026-08-20"
                },
                obligations: [
                    "Maintain professional indemnity insurance",
                    "Regular reporting to FSCA",
                    "Compliance with FAIS Act",
                    "Appointment of Key Individuals",
                    "Ongoing compliance monitoring"
                ],
                contact: {
                    fsca: "0800 110 443",
                    email: "info@fsca.co.za",
                    website: "https://www.fsca.co.za"
                }
            }
        },

        // 2.2. NCR Compliance Page
        ncr: {
            id: "za-ncr",
            title: "National Credit Act Compliance | M-Pesewa South Africa",
            meta: {
                description: "M-Pesewa's compliance with the National Credit Act, registration details, and consumer protection measures.",
                keywords: "National Credit Act, NCR compliance, credit provider South Africa, consumer protection"
            },
            content: {
                registration: {
                    number: "NCRCP12345",
                    type: "Credit Provider",
                    issued: "2023-09-10"
                },
                requirements: [
                    "Affordability assessments",
                    "No reckless lending",
                    "Interest rate caps",
                    "Cooling-off periods",
                    "Credit bureau reporting"
                ],
                consumerRights: [
                    "Right to apply for credit",
                    "Right to reasons for credit refusal",
                    "Right to information in plain language",
                    "Right to protection from discrimination"
                ]
            }
        },

        // 2.3. POPIA Compliance Page
        popia: {
            id: "za-popia",
            title: "POPIA Compliance | Data Protection South Africa",
            meta: {
                description: "M-Pesewa's compliance with the Protection of Personal Information Act (POPIA) in South Africa.",
                keywords: "POPIA compliance, data protection South Africa, personal information act, privacy"
            },
            content: {
                registration: "POPIA/2023/001234",
                informationOfficer: "Dr. Thandi Ndlovu",
                principles: [
                    "Accountability",
                    "Processing limitation",
                    "Purpose specification",
                    "Further processing limitation",
                    "Information quality",
                    "Openness",
                    "Security safeguards",
                    "Data subject participation"
                ],
                userRights: [
                    "Right to access personal information",
                    "Right to correction",
                    "Right to deletion",
                    "Right to object to processing"
                ]
            }
        }
    },

    // ============================================
    // 3. USER JOURNEY PAGES - SOUTH AFRICA SPECIFIC
    // ============================================
    userJourney: {
        // 3.1. Registration Flow
        registration: {
            id: "za-registration",
            title: "Register in South Africa | M-Pesewa",
            steps: [
                {
                    step: 1,
                    title: "Select South Africa",
                    description: "Confirm you're registering for South Africa operations only",
                    icon: "🇿🇦",
                    requirements: ["South African residency", "18+ years old", "Valid SA ID"]
                },
                {
                    step: 2,
                    title: "Choose Your Province",
                    description: "Select your province for local group matching",
                    icon: "📍",
                    options: [
                        "Gauteng", "Western Cape", "KwaZulu-Natal", "Eastern Cape",
                        "Free State", "Limpopo", "Mpumalanga", "North West", "Northern Cape"
                    ]
                },
                {
                    step: 3,
                    title: "South African ID Verification",
                    description: "Verify your South African Identity Document",
                    icon: "🆔",
                    methods: ["ID Number verification", "Biometric verification", "Document upload"]
                },
                {
                    step: 4,
                    title: "Proof of Address",
                    description: "Provide South African proof of address",
                    icon: "🏠",
                    accepted: ["Utility bill", "Bank statement", "Rental agreement", "Municipal account"]
                },
                {
                    step: 5,
                    title: "Bank Account Verification",
                    description: "Link your South African bank account",
                    icon: "💳",
                    supportedBanks: [
                        "Standard Bank", "First National Bank", "Absa Bank",
                        "Nedbank", "Capitec Bank"
                    ]
                }
            ],
            compliance: {
                fica: true,
                kyc: "Enhanced for South Africa",
                tax: "SARS compliant",
                data: "POPIA compliant"
            }
        },

        // 3.2. Lender Onboarding
        lenderOnboarding: {
            id: "za-lender-onboarding",
            title: "Become a Lender in South Africa",
            requirements: [
                {
                    requirement: "South African Bank Account",
                    description: "Active bank account with a South African registered bank",
                    verification: "Instant verification via bank API"
                },
                {
                    requirement: "FICA Compliance",
                    description: "Full FICA verification including proof of address and income",
                    documents: ["SA ID", "Proof of address", "3 months bank statements"]
                },
                {
                    requirement: "Tax Compliance",
                    description: "Tax clearance certificate may be required for high-volume lending",
                    threshold: "Loans over R50,000 monthly"
                },
                {
                    requirement: "Credit Check",
                    description: "Credit bureau check for Super tier and above",
                    agencies: ["TransUnion", "Experian", "Compuscan"]
                }
            ],
            subscriptionTiers: {
                display: "ZAR prices include 15% VAT",
                note: "Subscription fees are non-refundable as per South African consumer law"
            }
        },

        // 3.3. Borrower Onboarding
        borrowerOnboarding: {
            id: "za-borrower-onboarding",
            title: "Borrow in South Africa",
            features: [
                "No subscription fees for borrowers",
                "Access to local South African groups",
                "ZAR loans only - no currency conversion",
                "7-day repayment terms",
                "Affordability assessments as per NCA"
            ],
            limits: {
                firstLoan: "Up to R1,000",
                afterGoodRepayment: "Up to R5,000",
                maximum: "R20,000 (Super tier groups)"
            },
            affordability: {
                required: "For loans over R5,000",
                documents: ["3 months bank statements", "Proof of income", "Expense declaration"]
            }
        }
    },

    // ============================================
    // 4. LOAN CALCULATOR PAGES - ZAR SPECIFIC
    // ============================================
    calculators: {
        // 4.1. Main Loan Calculator
        main: {
            id: "za-calculator",
            title: "South Africa Loan Calculator | M-Pesewa",
            currency: "ZAR",
            defaults: {
                amount: 1000,
                term: 7,
                interest: 10
            },
            limits: {
                min: 50,
                max: 50000,
                step: 50
            },
            formulas: {
                interest: "principal * (interestRate / 100)",
                total: "principal + interest",
                daily: "total / termDays",
                penalty: "outstanding * (5 / 100)"
            },
            examples: [
                {
                    amount: 500,
                    term: 7,
                    interest: 10,
                    total: 550,
                    daily: 78.57
                },
                {
                    amount: 1000,
                    term: 7,
                    interest: 10,
                    total: 1100,
                    daily: 157.14
                },
                {
                    amount: 5000,
                    term: 7,
                    interest: 10,
                    total: 5500,
                    daily: 785.71
                }
            ]
        },

        // 4.2. Affordability Calculator
        affordability: {
            id: "za-affordability",
            title: "Affordability Calculator | South Africa",
            inputs: [
                {
                    name: "monthlyIncome",
                    label: "Monthly Income (ZAR)",
                    type: "number",
                    min: 0,
                    step: 100
                },
                {
                    name: "monthlyExpenses",
                    label: "Monthly Expenses (ZAR)",
                    type: "number",
                    min: 0,
                    step: 100
                },
                {
                    name: "existingDebt",
                    label: "Existing Monthly Debt (ZAR)",
                    type: "number",
                    min: 0,
                    step: 100
                }
            ],
            rules: {
                maxDebtToIncome: 0.4, // 40%
                maxNewDebtToIncome: 0.5, // 50%
                minDisposableIncome: 0.1 // 10%
            },
            outputs: [
                "Maximum recommended loan amount",
                "Maximum monthly repayment",
                "Debt-to-income ratio",
                "Affordability rating"
            ]
        }
    },

    // ============================================
    // 5. SUPPORT & HELP PAGES - SOUTH AFRICA
    // ============================================
    support: {
        // 5.1. Main Support Page
        main: {
            id: "za-support",
            title: "South Africa Support | M-Pesewa",
            channels: [
                {
                    type: "Phone",
                    value: "+27 11 000 0000",
                    hours: "Mon-Fri 8am-8pm, Sat 9am-5pm",
                    languages: ["English", "Zulu", "Xhosa", "Afrikaans"]
                },
                {
                    type: "WhatsApp",
                    value: "+27 11 000 0001",
                    hours: "24/7 for emergencies",
                    features: ["Chat support", "Document sharing", "Voice notes"]
                },
                {
                    type: "Email",
                    value: "support-za@mpesewa.com",
                    response: "Within 24 hours",
                    attachments: "Up to 10MB"
                },
                {
                    type: "In-App",
                    value: "Help Center",
                    features: ["FAQs", "Live chat", "Video tutorials"]
                }
            ],
            escalation: [
                "Level 1: Support Agent",
                "Level 2: Senior Support (South Africa)",
                "Level 3: Country Manager",
                "Level 4: Regional Director"
            ]
        },

        // 5.2. FAQ Page
        faq: {
            id: "za-faq",
            title: "South Africa FAQ | M-Pesewa",
            categories: [
                {
                    category: "Registration & Verification",
                    questions: [
                        {
                            q: "What documents do I need to register in South Africa?",
                            a: "South African ID, proof of address, and bank account details. For lenders, additional documents may be required based on subscription tier."
                        },
                        {
                            q: "How long does verification take in South Africa?",
                            a: "Usually 24-48 hours. Delays may occur if documents are unclear or additional verification is needed."
                        }
                    ]
                },
                {
                    category: "Loans & Lending",
                    questions: [
                        {
                            q: "What are the interest rate caps in South Africa?",
                            a: "Maximum 10% per week, not exceeding 20.5% annually as per National Credit Act regulations."
                        },
                        {
                            q: "Are there cooling-off periods for loans?",
                            a: "Yes, 5-day cooling-off period applies to loans over R5,000 as per NCA requirements."
                        }
                    ]
                },
                {
                    category: "Payments & Withdrawals",
                    questions: [
                        {
                            q: "Which South African banks are supported?",
                            a: "All major South African banks: Standard Bank, FNB, Absa, Nedbank, Capitec, and others."
                        },
                        {
                            q: "How long do withdrawals take in South Africa?",
                            a: "Instant to 2 hours for most banks. Some banks may take up to 24 hours."
                        }
                    ]
                }
            ]
        },

        // 5.3. Complaint Procedure
        complaints: {
            id: "za-complaints",
            title: "Complaints Procedure South Africa",
            steps: [
                {
                    step: 1,
                    title: "Contact Our Support",
                    description: "Attempt resolution through our South Africa support team",
                    timeframe: "15 working days",
                    channel: "support-za@mpesewa.com"
                },
                {
                    step: 2,
                    title: "Escalate to Complaints Officer",
                    description: "If unresolved, escalate to our dedicated complaints officer",
                    timeframe: "10 working days",
                    channel: "complaints-za@mpesewa.com"
                },
                {
                    step: 3,
                    title: "External Dispute Resolution",
                    description: "Contact Ombudsman for Banking Services",
                    timeframe: "60-90 days",
                    channel: "info@obssa.co.za or 0860 800 900"
                },
                {
                    step: 4,
                    title: "Regulator Complaint",
                    description: "Lodge complaint with National Credit Regulator",
                    timeframe: "90-120 days",
                    channel: "complaints@ncr.org.za or 0860 627 627"
                }
            ],
            rights: [
                "Right to be heard",
                "Right to fair treatment",
                "Right to transparency",
                "Right to escalate"
            ]
        }
    },

    // ============================================
    // 6. EMERGENCY CATEGORY PAGES - SOUTH AFRICA
    // ============================================
    emergencyCategories: {
        // 6.1. Transportation & Fare
        fare: {
            id: "za-fare",
            title: "M-pesewa Fare | Transport Loans South Africa",
            description: "Emergency transport money for taxis, buses, trains, or fuel in South Africa",
            icon: "🚌",
            typicalAmounts: {
                min: 20,
                max: 500,
                average: 150
            },
            useCases: [
                "Taxi fare to work",
                "Bus fare for emergencies",
                "Train ticket for urgent travel",
                "Fuel for medical appointments"
            ],
            providers: [
                "Gautrain",
                "MyCiti Bus",
                "Putco",
                "Local taxi associations",
                "Petrol stations"
            ]
        },

        // 6.2. Electricity Tokens
        electricity: {
            id: "za-electricity",
            title: "M-pesewa Electricity | Eskom Prepaid South Africa",
            description: "Emergency electricity tokens for prepaid meters in South Africa",
            icon: "⚡",
            typicalAmounts: {
                min: 50,
                max: 1500,
                average: 500
            },
            vendors: [
                "Eskom vendors",
                "Municipal offices",
                "SPAR",
                "Pick n Pay",
                "Checkers"
            ],
            purchaseMethods: [
                "Vendor purchase",
                "Online purchase",
                "Banking app",
                "USSD code"
            ]
        },

        // 6.3. School Fees & Supplies
        school: {
            id: "za-school",
            title: "M-pesewa School Fees | Education Loans South Africa",
            description: "Emergency school fees, uniforms, books, and supplies for South African students",
            icon: "🎓",
            typicalAmounts: {
                min: 500,
                max: 5000,
                average: 2000
            },
            coverage: [
                "School fees",
                "Uniforms",
                "Textbooks",
                "Stationery",
                "Examination fees"
            ],
            verification: "School letter or fee statement required for amounts over R2,000"
        }
    },

    // ============================================
    // 7. LEGAL & DOCUMENT PAGES
    // ============================================
    legal: {
        // 7.1. Terms & Conditions
        terms: {
            id: "za-terms",
            title: "Terms & Conditions South Africa | M-Pesewa",
            version: "2.1.0",
            effectiveDate: "2026-01-24",
            jurisdiction: "Republic of South Africa",
            governingLaw: [
                "National Credit Act 34 of 2005",
                "Financial Advisory and Intermediary Services Act 37 of 2002",
                "Protection of Personal Information Act 4 of 2013",
                "Consumer Protection Act 68 of 2008"
            ],
            importantSections: [
                "Platform Role (Section 1)",
                "South African Regulatory Compliance (Section 2)",
                "Loan Terms & NCA Compliance (Section 3)",
                "Data Protection & POPIA (Section 5)"
            ]
        },

        // 7.2. Privacy Policy
        privacy: {
            id: "za-privacy",
            title: "Privacy Policy South Africa | M-Pesewa",
            compliance: "POPIA Compliant",
            informationOfficer: "Dr. Thandi Ndlovu",
            dataSubjectsRights: [
                "Right of access to personal information",
                "Right to correction of information",
                "Right to deletion of information",
                "Right to object to processing"
            ],
            retentionPeriods: [
                "User data: 7 years after account closure",
                "Transaction records: 7 years",
                "Credit information: 10 years",
                "Communication records: 5 years"
            ]
        },

        // 7.3. Fair Practices Code
        fairPractices: {
            id: "za-fair-practices",
            title: "Fair Practices Code South Africa | M-Pesewa",
            principles: [
                "Transparency in all dealings",
                "Responsible lending practices",
                "Fair debt collection",
                "Effective complaint resolution"
            ],
            externalRecourse: [
                "Ombudsman for Banking Services",
                "National Credit Regulator",
                "Financial Sector Conduct Authority",
                "Consumer Protection Commission"
            ]
        }
    },

    // ============================================
    // 8. PARTNER & AFFILIATE PAGES
    // ============================================
    partners: {
        // 8.1. Banking Partners
        banks: {
            id: "za-bank-partners",
            title: "Banking Partners South Africa | M-Pesewa",
            partners: [
                {
                    name: "Standard Bank",
                    logo: "/assets/partners/standard-bank.svg",
                    integration: "Full API integration",
                    features: ["Instant verification", "Secure payments", "24/7 support"]
                },
                {
                    name: "First National Bank",
                    logo: "/assets/partners/fnb.svg",
                    integration: "eWallet integration",
                    features: ["eWallet transfers", "Card payments", "Business banking"]
                },
                {
                    name: "Absa Bank",
                    logo: "/assets/partners/absa.svg",
                    integration: "Absa Online integration",
                    features: ["Online banking", "Card payments", "Corporate accounts"]
                }
            ]
        },

        // 8.2. Payment Processors
        paymentProcessors: {
            id: "za-payment-processors",
            title: "Payment Processors South Africa | M-Pesewa",
            processors: [
                {
                    name: "PayFast",
                    website: "https://www.payfast.co.za",
                    fees: "2.9% + R2.00 per transaction",
                    features: ["Card payments", "Instant EFT", "Subscriptions"]
                },
                {
                    name: "PayGate",
                    website: "https://www.paygate.co.za",
                    fees: "3.0% + R2.50 per transaction",
                    features: ["Multi-currency", "Tokenization", "Fraud prevention"]
                }
            ]
        },

        // 8.3. Credit Bureau Partners
        creditBureaus: {
            id: "za-credit-bureaus",
            title: "Credit Bureau Partners South Africa | M-Pesewa",
            bureaus: [
                {
                    name: "TransUnion",
                    website: "https://www.transunion.co.za",
                    services: ["Credit reports", "Score calculation", "Identity verification"]
                },
                {
                    name: "Experian",
                    website: "https://www.experian.co.za",
                    services: ["Credit checks", "Business reports", "Fraud prevention"]
                },
                {
                    name: "Compuscan",
                    website: "https://www.compuscan.co.za",
                    services: ["Credit information", "Micro-lending data", "Collections data"]
                }
            ]
        }
    },

    // ============================================
    // 9. STATIC CONTENT PAGES
    // ============================================
    static: {
        // 9.1. About South Africa Page
        about: {
            id: "za-about",
            title: "About M-Pesewa South Africa",
            content: {
                mission: "To provide responsible emergency micro-lending solutions for South Africans through trusted community groups.",
                vision: "To become South Africa's most trusted peer-to-peer emergency lending platform.",
                values: [
                    "Regulatory compliance first",
                    "Community trust building",
                    "Financial inclusion",
                    "Transparent operations"
                ],
                team: {
                    countryManager: "Mr. Sipho Nkosi",
                    complianceOfficer: "Ms. Nomvula Mbatha",
                    supportLead: "Mr. David Peterson"
                }
            }
        },

        // 9.2. Contact South Africa Page
        contact: {
            id: "za-contact",
            title: "Contact M-Pesewa South Africa",
            addresses: [
                {
                    type: "Head Office",
                    address: "123 Sandton Drive, Sandton, Johannesburg 2196",
                    phone: "+27 11 000 0000",
                    email: "info-za@mpesewa.com"
                },
                {
                    type: "Cape Town Office",
                    address: "456 Bree Street, Cape Town City Centre 8001",
                    phone: "+27 21 000 0000",
                    email: "capetown@mpesewa.com"
                },
                {
                    type: "Durban Office",
                    address: "789 Musgrave Road, Berea, Durban 4001",
                    phone: "+27 31 000 0000",
                    email: "durban@mpesewa.com"
                }
            ],
            departments: [
                {
                    name: "Support",
                    email: "support-za@mpesewa.com",
                    phone: "+27 11 000 0001"
                },
                {
                    name: "Compliance",
                    email: "compliance-za@mpesewa.com",
                    phone: "+27 11 000 0002"
                },
                {
                    name: "Business Development",
                    email: "partners-za@mpesewa.com",
                    phone: "+27 11 000 0003"
                },
                {
                    name: "Legal",
                    email: "legal-za@mpesewa.com",
                    phone: "+27 11 000 0004"
                }
            ]
        },

        // 9.3. Careers South Africa Page
        careers: {
            id: "za-careers",
            title: "Careers at M-Pesewa South Africa",
            openings: [
                {
                    position: "Compliance Officer",
                    location: "Johannesburg",
                    type: "Full-time",
                    requirements: ["Legal degree", "FSCA experience", "3+ years compliance"]
                },
                {
                    position: "Customer Support Specialist",
                    location: "Cape Town",
                    type: "Full-time",
                    requirements: ["Fluency in 2+ SA languages", "Customer service experience", "Financial services knowledge"]
                },
                {
                    position: "Software Developer",
                    location: "Remote",
                    type: "Contract",
                    requirements: ["JavaScript/Node.js", "Financial systems experience", "API development"]
                }
            ],
            benefits: [
                "Competitive ZAR salary",
                "Medical aid contribution",
                "Provident fund",
                "Flexible working hours",
                "Continuous learning"
            ]
        }
    },

    // ============================================
    // 10. DYNAMIC PAGE GENERATION CONFIG
    // ============================================
    dynamic: {
        // 10.1. Page Generation Rules
        generation: {
            cacheDuration: 3600, // 1 hour in seconds
            minify: true,
            gzip: true,
            cdn: true
        },

        // 10.2. SEO Configuration
        seo: {
            defaultTitle: "M-Pesewa South Africa | Emergency Micro-Lending",
            defaultDescription: "FSCA regulated peer-to-peer emergency lending platform for South Africans",
            defaultKeywords: "emergency loans South Africa, peer-to-peer lending ZAR, FSCA regulated",
            canonicalBase: "https://mpesewa.co.za",
            hreflang: {
                "en-za": "https://mpesewa.co.za",
                "af-za": "https://mpesewa.co.za/af",
                "zu-za": "https://mpesewa.co.za/zu",
                "xh-za": "https://mpesewa.co.za/xh"
            }
        },

        // 10.3. Analytics Configuration
        analytics: {
            googleAnalytics: "UA-12345678-1",
            facebookPixel: "123456789012345",
            hotjar: "1234567",
            trackingEvents: [
                "page_view",
                "registration_start",
                "loan_calculator_use",
                "support_contact"
            ]
        },

        // 10.4. Performance Configuration
        performance: {
            lazyLoad: true,
            imageOptimization: true,
            scriptDefer: true,
            criticalCSS: true,
            serviceWorker: true
        }
    }
};

// ============================================
// PAGE UTILITY FUNCTIONS
// ============================================

/**
 * Generate page HTML based on page ID
 * @param {string} pageId - Page identifier
 * @param {Object} data - Dynamic data for the page
 * @returns {string} Generated HTML
 */
function generatePage(pageId, data = {}) {
    // Find page configuration
    let pageConfig = findPageConfig(pageId, ZA_PAGES);
    
    if (!pageConfig) {
        return generateErrorPage(`Page "${pageId}" not found in South Africa configuration`);
    }

    // Merge dynamic data
    const mergedConfig = mergePageData(pageConfig, data);
    
    // Generate HTML structure
    return `
        <!DOCTYPE html>
        <html lang="en-ZA">
        <head>
            ${generateMetaTags(mergedConfig)}
            ${generateStyles()}
        </head>
        <body class="za-page">
            ${generateHeader(mergedConfig)}
            ${generateContent(mergedConfig)}
            ${generateFooter(mergedConfig)}
            ${generateScripts(mergedConfig)}
        </body>
        </html>
    `;
}

/**
 * Find page configuration recursively
 * @param {string} pageId - Page ID to find
 * @param {Object} config - Configuration object to search
 * @param {string} path - Current path
 * @returns {Object|null} Page configuration or null
 */
function findPageConfig(pageId, config, path = '') {
    for (const key in config) {
        const currentPath = path ? `${path}.${key}` : key;
        const value = config[key];
        
        if (value && typeof value === 'object') {
            if (value.id === pageId) {
                return value;
            }
            
            const found = findPageConfig(pageId, value, currentPath);
            if (found) {
                return found;
            }
        }
    }
    return null;
}

/**
 * Merge dynamic data with page configuration
 * @param {Object} pageConfig - Page configuration
 * @param {Object} data - Dynamic data
 * @returns {Object} Merged configuration
 */
function mergePageData(pageConfig, data) {
    return {
        ...pageConfig,
        meta: {
            ...pageConfig.meta,
            title: data.title || pageConfig.meta?.title || pageConfig.title,
            description: data.description || pageConfig.meta?.description
        },
        data: {
            ...pageConfig.data,
            ...data
        },
        generated: new Date().toISOString(),
        country: "South Africa",
        currency: "ZAR",
        language: "en-ZA"
    };
}

/**
 * Generate meta tags for page
 * @param {Object} config - Page configuration
 * @returns {string} HTML meta tags
 */
function generateMetaTags(config) {
    const title = config.meta?.title || config.title || "M-Pesewa South Africa";
    const description = config.meta?.description || "Emergency micro-lending platform for South Africa";
    const keywords = config.meta?.keywords || "emergency loans South Africa, peer-to-peer lending ZAR";
    
    return `
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <meta name="description" content="${description}">
        <meta name="keywords" content="${keywords}">
        <meta name="country" content="South Africa">
        <meta name="currency" content="ZAR">
        <meta name="language" content="en-ZA">
        
        <!-- Open Graph -->
        <meta property="og:title" content="${title}">
        <meta property="og:description" content="${description}">
        <meta property="og:type" content="website">
        <meta property="og:locale" content="en_ZA">
        <meta property="og:country-name" content="South Africa">
        
        <!-- Twitter -->
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="${title}">
        <meta name="twitter:description" content="${description}">
        
        <!-- Geo -->
        <meta name="geo.region" content="ZA">
        <meta name="geo.placename" content="South Africa">
        <meta name="geo.position" content="-30.5595;22.9375">
        <meta name="ICBM" content="-30.5595, 22.9375">
    `;
}

/**
 * Generate page header
 * @param {Object} config - Page configuration
 * @returns {string} HTML header
 */
function generateHeader(config) {
    return `
        <header class="page-header za-header">
            <div class="header-top">
                <div class="country-badge">
                    <span class="flag">🇿🇦</span>
                    <span class="country-name">South Africa</span>
                    <span class="currency">(ZAR)</span>
                </div>
                <div class="compliance-badges">
                    <span class="badge fsca">FSCA Regulated</span>
                    <span class="badge ncr">NCR Registered</span>
                    <span class="badge popia">POPIA Compliant</span>
                </div>
            </div>
            <nav class="main-nav">
                <a href="/za" class="nav-item ${config.id === 'za-landing' ? 'active' : ''}">Home</a>
                <a href="/za/register" class="nav-item">Register</a>
                <a href="/za/loans" class="nav-item">Loans</a>
                <a href="/za/support" class="nav-item">Support</a>
                <a href="/za/legal" class="nav-item">Legal</a>
            </nav>
        </header>
    `;
}

/**
 * Generate page content
 * @param {Object} config - Page configuration
 * @returns {string} HTML content
 */
function generateContent(config) {
    let content = '';
    
    if (config.hero) {
        content += generateHero(config.hero);
    }
    
    if (config.sections) {
        config.sections.forEach(section => {
            content += generateSection(section);
        });
    }
    
    if (config.content) {
        content += `<div class="page-content">${config.content}</div>`;
    }
    
    return `<main class="page-content">${content}</main>`;
}

/**
 * Generate hero section
 * @param {Object} hero - Hero configuration
 * @returns {string} HTML hero section
 */
function generateHero(hero) {
    return `
        <section class="hero">
            <h1>${hero.title}</h1>
            ${hero.subtitle ? `<p class="subtitle">${hero.subtitle}</p>` : ''}
            ${hero.features ? `
                <div class="hero-features">
                    ${hero.features.map(feature => `<span class="feature">${feature}</span>`).join('')}
                </div>
            ` : ''}
            ${hero.cta ? `
                <div class="hero-cta">
                    ${hero.cta.primary ? `<a href="${hero.cta.primary.link}" class="btn btn-primary">${hero.cta.primary.text}</a>` : ''}
                    ${hero.cta.secondary ? `<a href="${hero.cta.secondary.link}" class="btn btn-secondary">${hero.cta.secondary.text}</a>` : ''}
                </div>
            ` : ''}
        </section>
    `;
}

/**
 * Generate section
 * @param {Object} section - Section configuration
 * @returns {string} HTML section
 */
function generateSection(section) {
    return `
        <section id="${section.id}" class="page-section">
            ${section.title ? `<h2>${section.title}</h2>` : ''}
            ${section.content ? `<div class="section-content">${section.content}</div>` : ''}
        </section>
    `;
}

/**
 * Generate page footer
 * @param {Object} config - Page configuration
 * @returns {string} HTML footer
 */
function generateFooter(config) {
    return `
        <footer class="page-footer za-footer">
            <div class="footer-content">
                <div class="footer-section">
                    <h3>South Africa Operations</h3>
                    <p>FSCA License: FSP12345</p>
                    <p>NCR Registration: NCRCP12345</p>
                    <p>VAT: 4880266188</p>
                </div>
                <div class="footer-section">
                    <h3>Contact South Africa</h3>
                    <p>Phone: +27 11 000 0000</p>
                    <p>Email: support-za@mpesewa.com</p>
                    <p>Address: 123 Sandton Drive, Johannesburg</p>
                </div>
                <div class="footer-section">
                    <h3>Legal South Africa</h3>
                    <a href="/za/terms">Terms & Conditions</a>
                    <a href="/za/privacy">Privacy Policy</a>
                    <a href="/za/fair-practices">Fair Practices Code</a>
                </div>
            </div>
            <div class="footer-bottom">
                <p>© 2026 M-Pesewa Technology (Pty) Ltd - South Africa. All rights reserved.</p>
                <p class="compliance-notice">FSCA Regulated • NCR Registered • POPIA Compliant</p>
            </div>
        </footer>
    `;
}

/**
 * Generate page scripts
 * @param {Object} config - Page configuration
 * @returns {string} HTML scripts
 */
function generateScripts(config) {
    return `
        <script src="/assets/js/za-common.js"></script>
        <script>
            // Page-specific initialization
            document.addEventListener('DOMContentLoaded', function() {
                // Set country context
                window.MPesewa = window.MPesewa || {};
                window.MPesewa.country = {
                    code: 'ZA',
                    name: 'South Africa',
                    currency: 'ZAR'
                };
                
                // Initialize analytics for South Africa
                if (typeof ga === 'function') {
                    ga('set', 'location', 'https://mpesewa.co.za${window.location.pathname}');
                    ga('set', 'country', 'South Africa');
                }
                
                console.log('M-Pesewa South Africa page loaded:', '${config.id}');
            });
        </script>
    `;
}

/**
 * Generate error page
 * @param {string} message - Error message
 * @returns {string} HTML error page
 */
function generateErrorPage(message) {
    return `
        <!DOCTYPE html>
        <html lang="en-ZA">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Page Error | M-Pesewa South Africa</title>
        </head>
        <body>
            <div class="error-container">
                <h1>Page Error</h1>
                <p>${message}</p>
                <a href="/za">Return to South Africa Home</a>
            </div>
        </body>
        </html>
    `;
}

/**
 * Generate CSS styles
 * @returns {string} CSS styles
 */
function generateStyles() {
    return `
        <style>
            .za-page {
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                background: #ffffff;
                color: #003366;
            }
            
            .za-header {
                background: #003366;
                color: #ffffff;
                padding: 1rem;
            }
            
            .country-badge {
                display: inline-flex;
                align-items: center;
                gap: 0.5rem;
                background: rgba(255,255,255,0.1);
                padding: 0.5rem 1rem;
                border-radius: 0.5rem;
            }
            
            .compliance-badges {
                display: flex;
                gap: 0.5rem;
                margin-top: 0.5rem;
            }
            
            .badge {
                padding: 0.25rem 0.5rem;
                border-radius: 0.25rem;
                font-size: 0.75rem;
                font-weight: bold;
            }
            
            .badge.fsca { background: #28a745; color: white; }
            .badge.ncr { background: #f37021; color: white; }
            .badge.popia { background: #0099ff; color: white; }
            
            .hero {
                text-align: center;
                padding: 3rem 1rem;
                background: linear-gradient(135deg, #003366 0%, #0099ff 100%);
                color: white;
            }
            
            .hero-cta {
                margin-top: 2rem;
                display: flex;
                gap: 1rem;
                justify-content: center;
            }
            
            .btn {
                padding: 0.75rem 1.5rem;
                border-radius: 0.5rem;
                text-decoration: none;
                font-weight: bold;
                display: inline-block;
            }
            
            .btn-primary {
                background: #f37021;
                color: white;
            }
            
            .btn-secondary {
                background: transparent;
                border: 2px solid white;
                color: white;
            }
            
            .za-footer {
                background: #1f2a37;
                color: white;
                padding: 2rem 1rem;
                margin-top: 3rem;
            }
            
            .footer-content {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 2rem;
                max-width: 1200px;
                margin: 0 auto;
            }
            
            .footer-bottom {
                text-align: center;
                margin-top: 2rem;
                padding-top: 1rem;
                border-top: 1px solid rgba(255,255,255,0.1);
            }
            
            .compliance-notice {
                font-size: 0.875rem;
                opacity: 0.8;
                margin-top: 0.5rem;
            }
        </style>
    `;
}

/**
 * Get page navigation for South Africa
 * @returns {Array} Navigation items
 */
function getNavigation() {
    return [
        {
            title: "Home",
            path: "/za",
            icon: "🏠",
            children: [
                { title: "Johannesburg", path: "/za/johannesburg" },
                { title: "Cape Town", path: "/za/cape-town" },
                { title: "Durban", path: "/za/durban" }
            ]
        },
        {
            title: "Register",
            path: "/za/register",
            icon: "📝",
            requirements: ["SA ID", "Proof of address", "Bank account"]
        },
        {
            title: "Loans",
            path: "/za/loans",
            icon: "💰",
            children: [
                { title: "Calculator", path: "/za/calculator" },
                { title: "Affordability", path: "/za/affordability" },
                { title: "Emergency Categories", path: "/za/emergency" }
            ]
        },
        {
            title: "Support",
            path: "/za/support",
            icon: "🛟",
            children: [
                { title: "FAQ", path: "/za/faq" },
                { title: "Complaints", path: "/za/complaints" },
                { title: "Contact", path: "/za/contact" }
            ]
        },
        {
            title: "Legal",
            path: "/za/legal",
            icon: "⚖️",
            children: [
                { title: "Terms", path: "/za/terms" },
                { title: "Privacy", path: "/za/privacy" },
                { title: "Fair Practices", path: "/za/fair-practices" },
                { title: "FSCA Compliance", path: "/za/fsca" }
            ]
        }
    ];
}

/**
 * Get breadcrumbs for page
 * @param {string} pageId - Page ID
 * @returns {Array} Breadcrumb trail
 */
function getBreadcrumbs(pageId) {
    const breadcrumbs = [
        { title: "Home", path: "/" },
        { title: "South Africa", path: "/za" }
    ];
    
    const pageMap = {
        'za-landing': { title: "Home", path: "/za" },
        'za-registration': { title: "Register", path: "/za/register" },
        'za-calculator': { title: "Loan Calculator", path: "/za/calculator" },
        'za-support': { title: "Support", path: "/za/support" },
        'za-faq': { title: "FAQ", path: "/za/faq", parent: "/za/support" },
        'za-terms': { title: "Terms & Conditions", path: "/za/terms" },
        'za-privacy': { title: "Privacy Policy", path: "/za/privacy" }
    };
    
    const pageInfo = pageMap[pageId];
    if (pageInfo) {
        if (pageInfo.parent) {
            const parent = Object.values(pageMap).find(p => p.path === pageInfo.parent);
            if (parent) {
                breadcrumbs.push(parent);
            }
        }
        breadcrumbs.push(pageInfo);
    }
    
    return breadcrumbs;
}

// ============================================
// EXPORT MODULE
// ============================================

export default {
    // Pages Configuration
    pages: ZA_PAGES,
    
    // Page Generation Functions
    generatePage,
    findPageConfig,
    mergePageData,
    generateMetaTags,
    generateHeader,
    generateContent,
    generateFooter,
    generateScripts,
    generateErrorPage,
    
    // Navigation Functions
    getNavigation,
    getBreadcrumbs,
    
    // Page Constants
    COUNTRY_CODE: "ZA",
    COUNTRY_NAME: "South Africa",
    CURRENCY: "ZAR",
    LANGUAGE: "en-ZA",
    
    // SEO Configuration
    SEO: ZA_PAGES.dynamic.seo,
    
    // Performance Configuration
    PERFORMANCE: ZA_PAGES.dynamic.performance,
    
    // Page Categories
    CATEGORIES: {
        LANDING: "landing",
        REGULATORY: "regulatory",
        USER_JOURNEY: "userJourney",
        CALCULATORS: "calculators",
        SUPPORT: "support",
        EMERGENCY: "emergencyCategories",
        LEGAL: "legal",
        PARTNERS: "partners",
        STATIC: "static"
    },
    
    // Page Templates
    TEMPLATES: {
        LANDING: "landing",
        CONTENT: "content",
        FORM: "form",
        CALCULATOR: "calculator",
        FAQ: "faq",
        CONTACT: "contact"
    },
    
    // Page Metadata
    METADATA: {
        VERSION: "2.1.0",
        GENERATED: new Date().toISOString(),
        COUNTRY: "South Africa",
        REGULATIONS: ["FSCA", "NCA", "POPIA", "FAIS"],
        COMPLIANCE: "Full regulatory compliance"
    }
};

// Initialize pages module
console.log(`✅ M-Pesewa South Africa pages module loaded`);
console.log(`📄 Available pages: ${Object.keys(ZA_PAGES).join(', ')}`);
console.log(`🌍 Country: South Africa (ZA)`);
console.log(`💰 Currency: ZAR`);
console.log(`⚖️ Regulations: FSCA, NCA, POPIA compliant`);