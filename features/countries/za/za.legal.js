/**
 * South Africa (ZA) Legal Module
 * M-Pesewa Legal Framework - South Africa
 * Last Updated: 2026-01-24
 * 
 * LEGAL HIERARCHY ENFORCEMENT:
 * 1. South African National Laws
 * 2. Financial Sector Regulations
 * 3. M-Pesewa Platform Terms
 * 4. Country-Specific Amendments
 */

const ZA_LEGAL = {
    // ============================================
    // 1. LEGAL ENTITY & REGISTRATION
    // ============================================
    entity: {
        registeredName: "M-Pesewa Technology (Pty) Ltd",
        registrationNumber: "2023/123456/07",
        companyType: "Private Company",
        registrationDate: "2023-06-15",
        registrationAuthority: "Companies and Intellectual Property Commission (CIPC)",
        registeredAddress: {
            street: "123 Sandton Drive",
            suburb: "Sandton",
            city: "Johannesburg",
            province: "Gauteng",
            postalCode: "2196",
            country: "South Africa"
        },
        physicalAddress: {
            street: "456 Rivonia Road",
            suburb: "Rivonia",
            city: "Sandton",
            province: "Gauteng",
            postalCode: "2128",
            country: "South Africa"
        },
        directors: [
            {
                name: "Dr. Thandi Ndlovu",
                idNumber: "8301011234081",
                role: "Managing Director",
                qualification: "PhD in Economics, University of Cape Town"
            },
            {
                name: "Mr. James van der Merwe",
                idNumber: "8505055678082",
                role: "Finance Director",
                qualification: "CA(SA), CFA Charterholder"
            },
            {
                name: "Ms. Zinhle Khumalo",
                idNumber: "8808089012083",
                role: "Technology Director",
                qualification: "MSc Computer Science, Wits University"
            }
        ]
    },

    // ============================================
    // 2. FINANCIAL SERVICES LICENSES
    // ============================================
    licenses: {
        fsca: {
            licenseNumber: "FSP12345",
            licenseType: "Financial Services Provider",
            category: "Category I & II",
            issueDate: "2023-08-20",
            expiryDate: "2026-08-20",
            conditions: [
                "May provide intermediary services",
                "Subject to FAIS Act",
                "Regular reporting required",
                "Audited financial statements annual"
            ]
        },
        ncr: {
            registrationNumber: "NCRCP12345",
            registrationType: "Credit Provider",
            issueDate: "2023-09-10",
            conditions: [
                "Compliance with National Credit Act",
                "Affordability assessments required",
                "No reckless lending",
                "Credit bureau reporting"
            ]
        },
        popia: {
            registrationNumber: "POPIA/2023/001234",
            responsibleParty: "Information Officer: Dr. Thandi Ndlovu",
            conditions: [
                "Lawful processing of personal information",
                "Minimal data collection",
                "Consent required",
                "Data subject rights protected"
            ]
        }
    },

    // ============================================
    // 3. TERMS & CONDITIONS - SOUTH AFRICA SPECIFIC
    // ============================================
    terms: {
        // 3.1. Platform Role & Disclaimer (South Africa Specific)
        platformRole: {
            title: "Platform Role - South Africa",
            clauses: [
                {
                    clause: "1.1",
                    text: "M-Pesewa Technology (Pty) Ltd is registered as a Category I & II Financial Services Provider with the Financial Sector Conduct Authority (FSP12345) and as a Credit Provider with the National Credit Regulator (NCRCP12345)."
                },
                {
                    clause: "1.2",
                    text: "The platform operates as a peer-to-peer lending marketplace facilitating connections between verified lenders and borrowers within trusted groups in South Africa."
                },
                {
                    clause: "1.3",
                    text: "M-Pesewa does not accept deposits, provide banking services, or operate as a bank as defined in the Banks Act 94 of 1990."
                },
                {
                    clause: "1.4",
                    text: "All monetary transactions occur directly between users through their chosen payment methods. M-Pesewa does not hold, transfer, or guarantee any user funds."
                }
            ]
        },

        // 3.2. User Eligibility & Requirements
        eligibility: {
            title: "Eligibility Requirements - South Africa",
            clauses: [
                {
                    clause: "2.1",
                    text: "Users must be at least 18 years old and have legal capacity to contract under South African law."
                },
                {
                    clause: "2.2",
                    text: "Users must be South African citizens, permanent residents, or legally resident in South Africa with valid documentation."
                },
                {
                    clause: "2.3",
                    text: "Users must provide valid South African Identity Document number, proof of address, and contact information."
                },
                {
                    clause: "2.4",
                    text: "Lenders must pass affordability assessments and risk profiling as required by the National Credit Act."
                }
            ]
        },

        // 3.3. Loan Terms & Conditions
        loanTerms: {
            title: "Loan Terms - South Africa",
            clauses: [
                {
                    clause: "3.1",
                    text: "All loans facilitated through the platform are subject to the National Credit Act 34 of 2005."
                },
                {
                    clause: "3.2",
                    text: "Maximum interest rate: 10% per week, not exceeding the annual cap of 20.5% as per National Credit Act regulations."
                },
                {
                    clause: "3.3",
                    text: "Loan repayment period: 7 days maximum, with daily partial repayments permitted."
                },
                {
                    clause: "3.4",
                    text: "Late payment penalty: 5% daily on outstanding balance after 7 days, not exceeding the National Credit Act penalty limits."
                },
                {
                    clause: "3.5",
                    text: "Default classification: After 60 days of non-payment, the loan is considered in default and may be reported to credit bureaus."
                }
            ]
        },

        // 3.4. Subscription Terms (Lenders Only)
        subscriptionTerms: {
            title: "Subscription Terms - South Africa",
            clauses: [
                {
                    clause: "4.1",
                    text: "Lender subscriptions are billed in South African Rand (ZAR) and include 15% Value Added Tax (VAT)."
                },
                {
                    clause: "4.2",
                    text: "Subscription fees are non-refundable, except as required by the Consumer Protection Act 68 of 2008."
                },
                {
                    clause: "4.3",
                    text: "Subscription expiry: 28th of each month. Lenders will be blocked from lending activities if subscription expires."
                },
                {
                    clause: "4.4",
                    text: "Subscription upgrades: Pro-rated charges apply. Downgrades take effect at next billing cycle."
                }
            ]
        },

        // 3.5. Data Protection & Privacy
        dataProtection: {
            title: "Data Protection - POPIA Compliance",
            clauses: [
                {
                    clause: "5.1",
                    text: "M-Pesewa complies with the Protection of Personal Information Act 4 of 2013 (POPIA)."
                },
                {
                    clause: "5.2",
                    text: "Personal information is collected, processed, and stored in compliance with POPIA's 8 conditions for lawful processing."
                },
                {
                    clause: "5.3",
                    text: "Users have the right to access, correct, or delete their personal information as per POPIA Section 23."
                },
                {
                    clause: "5.4",
                    text: "Data may be shared with credit bureaus, regulatory authorities, and law enforcement as required by South African law."
                },
                {
                    clause: "5.5",
                    text: "Data retention: Personal data retained for 7 years as required by the Financial Intelligence Centre Act (FICA)."
                }
            ]
        },

        // 3.6. Dispute Resolution
        disputeResolution: {
            title: "Dispute Resolution - South Africa",
            clauses: [
                {
                    clause: "6.1",
                    text: "All disputes between users should first be attempted to be resolved within their group through the group admin."
                },
                {
                    clause: "6.2",
                    text: "If unresolved, disputes may be escalated to M-Pesewa's internal dispute resolution department."
                },
                {
                    clause: "6.3",
                    text: "External dispute resolution: Users may approach the Ombudsman for Banking Services (OBS) or National Credit Regulator (NCR)."
                },
                {
                    clause: "6.4",
                    text: "Legal jurisdiction: All disputes subject to the laws of South Africa and jurisdiction of South African courts."
                }
            ]
        },

        // 3.7. Termination & Suspension
        termination: {
            title: "Termination & Suspension",
            clauses: [
                {
                    clause: "7.1",
                    text: "M-Pesewa may suspend or terminate accounts for violations of terms, fraudulent activity, or legal requirements."
                },
                {
                    clause: "7.2",
                    text: "Users may terminate accounts by providing 30 days written notice and settling all outstanding obligations."
                },
                {
                    clause: "7.3",
                    text: "Upon termination, users remain liable for all existing loans and obligations."
                },
                {
                    clause: "7.4",
                    text: "Data will be retained as required by law even after account termination."
                }
            ]
        }
    },

    // ============================================
    // 4. PRIVACY POLICY - SOUTH AFRICA SPECIFIC
    // ============================================
    privacy: {
        // 4.1. Information Collection
        collection: {
            title: "Information We Collect",
            categories: [
                {
                    category: "Identity Information",
                    items: [
                        "Full name",
                        "South African ID number",
                        "Date of birth",
                        "Gender",
                        "Nationality"
                    ],
                    purpose: "KYC compliance, identity verification"
                },
                {
                    category: "Contact Information",
                    items: [
                        "Physical address",
                        "Email address",
                        "Mobile number",
                        "Alternative contact"
                    ],
                    purpose: "Communication, service delivery"
                },
                {
                    category: "Financial Information",
                    items: [
                        "Bank account details",
                        "Payment history",
                        "Credit reports (with consent)",
                        "Transaction records"
                    ],
                    purpose: "Payment processing, risk assessment"
                },
                {
                    category: "Technical Information",
                    items: [
                        "IP address",
                        "Device information",
                        "Location data",
                        "Browser type",
                        "Usage patterns"
                    ],
                    purpose: "Security, fraud prevention, service improvement"
                }
            ]
        },

        // 4.2. Information Sharing
        sharing: {
            title: "How We Share Information",
            parties: [
                {
                    party: "Credit Bureaus",
                    purpose: "Credit reporting as per National Credit Act",
                    legalBasis: "NCA requirement, user consent"
                },
                {
                    party: "Regulatory Authorities",
                    purpose: "Compliance reporting (FSCA, NCR, SARS)",
                    legalBasis: "Legal obligation"
                },
                {
                    party: "Financial Institutions",
                    purpose: "Payment processing, fraud prevention",
                    legalBasis: "Contract performance"
                },
                {
                    party: "Group Members",
                    purpose: "Trust verification within groups",
                    legalBasis: "Legitimate interest, user consent"
                },
                {
                    party: "Law Enforcement",
                    purpose: "Legal requirements, criminal investigations",
                    legalBasis: "Legal obligation"
                }
            ],
            restrictions: [
                "No sale of personal information",
                "No sharing for marketing without consent",
                "Cross-border transfers only to adequate protection countries",
                "Data minimization principles applied"
            ]
        },

        // 4.3. User Rights (POPIA Specific)
        userRights: {
            title: "Your Rights Under POPIA",
            rights: [
                {
                    right: "Right of Access",
                    description: "Request access to your personal information we hold",
                    process: "Submit written request to Information Officer",
                    timeframe: "Respond within 30 days",
                    cost: "No fee for first request"
                },
                {
                    right: "Right to Correction",
                    description: "Request correction of inaccurate personal information",
                    process: "Submit correction request with supporting documents",
                    timeframe: "Correct within 30 days",
                    notification: "Notify third parties if information was shared"
                },
                {
                    right: "Right to Deletion",
                    description: "Request deletion of personal information (subject to legal retention periods)",
                    process: "Submit deletion request with justification",
                    exceptions: "Cannot delete if required by law or ongoing transactions"
                },
                {
                    right: "Right to Object",
                    description: "Object to processing of personal information",
                    process: "Submit objection in writing",
                    timeframe: "Respond within 30 days",
                    basis: "Can object to direct marketing without justification"
                },
                {
                    right: "Right to Complain",
                    description: "Lodge complaint with Information Regulator",
                    process: "Submit to InformationRegulator@justice.gov.za",
                    timeframe: "Regulator responds within reasonable time"
                }
            ]
        },

        // 4.4. Security Measures
        security: {
            title: "Security Measures",
            technical: [
                "AES-256 encryption for data at rest",
                "TLS 1.3 for data in transit",
                "Multi-factor authentication",
                "Regular security audits",
                "Intrusion detection systems",
                "DDoS protection"
            ],
            organizational: [
                "Information Officer appointed",
                "Employee confidentiality agreements",
                "Regular POPIA training",
                "Access controls and logging",
                "Incident response plan",
                "Regular risk assessments"
            ],
            physical: [
                "Secure data centers",
                "Access control systems",
                "Surveillance monitoring",
                "Fire suppression",
                "Power backup systems"
            ]
        },

        // 4.5. Data Retention
        retention: {
            title: "Data Retention Periods",
            periods: [
                {
                    dataType: "User account information",
                    retentionPeriod: "7 years after account closure",
                    legalBasis: "FICA requirements"
                },
                {
                    dataType: "Transaction records",
                    retentionPeriod: "7 years from transaction date",
                    legalBasis: "Taxation laws"
                },
                {
                    dataType: "Credit information",
                    retentionPeriod: "10 years",
                    legalBasis: "National Credit Act"
                },
                {
                    dataType: "Communication records",
                    retentionPeriod: "5 years",
                    legalBasis: "Electronic Communications Act"
                },
                {
                    dataType: "Audit logs",
                    retentionPeriod: "10 years",
                    legalBasis: "Auditing standards"
                }
            ],
            deletion: {
                process: "Secure deletion using military-grade erasure",
                verification: "Annual verification of deletion processes",
                documentation: "Maintain deletion logs for 3 years"
            }
        }
    },

    // ============================================
    // 5. FAIR PRACTICES CODE - SOUTH AFRICA
    // ============================================
    fairPractices: {
        // 5.1. Transparency Principles
        transparency: {
            principles: [
                "Clear disclosure of all fees and charges",
                "Plain language in all communications",
                "No hidden terms or conditions",
                "Full disclosure of interest calculation",
                "Clear explanation of penalties"
            ],
            requirements: [
                "All fees displayed in South African Rand",
                "Annual Percentage Rate (APR) clearly shown",
                "Example calculations provided",
                "Summary of key terms in bold",
                "Important notices highlighted"
            ]
        },

        // 5.2. Responsible Lending
        responsibleLending: {
            principles: [
                "No reckless lending as defined by NCA",
                "Affordability assessments for all loans",
                "Proportionality between loan amount and need",
                "Consideration of borrower's circumstances",
                "No exploitation of vulnerable consumers"
            ],
            processes: [
                "Income verification for loans above R5,000",
                "Debt-to-income ratio checks",
                "Credit bureau checks for high-value loans",
                "Cooling-off period for certain loans",
                "Right to rescind within 5 days"
            ]
        },

        // 5.3. Debt Collection Practices
        debtCollection: {
            prohibitedPractices: [
                "Harassment or intimidation",
                "False or misleading representations",
                "Unreasonable contact hours",
                "Contact at workplace if prohibited",
                "Disclosure to unauthorized parties"
            ],
            permittedPractices: [
                "Professional and respectful communication",
                "Reasonable contact attempts",
                "Clear statement of debt amount",
                "Options for repayment arrangements",
                "Referral to debt counseling"
            ],
            requirements: [
                "Validate debt before collection",
                "Provide debt verification on request",
                "Honor repayment agreements",
                "Cease collection if debt disputed",
                "Follow legal process for enforcement"
            ]
        },

        // 5.4. Complaint Handling
        complaints: {
            channels: [
                {
                    channel: "In-app support",
                    responseTime: "24 hours",
                    escalation: "To complaints officer"
                },
                {
                    channel: "Email: complaints-za@mpesewa.com",
                    responseTime: "48 hours",
                    escalation: "To senior management"
                },
                {
                    channel: "Phone: +27 11 000 0002",
                    responseTime: "During business hours",
                    escalation: "To country manager"
                },
                {
                    channel: "Postal: P.O. Box 1234, Sandton 2196",
                    responseTime: "5 working days",
                    escalation: "To board level"
                }
            ],
            process: [
                "Acknowledge receipt within 24 hours",
                "Investigate within 5 working days",
                "Provide resolution within 15 working days",
                "Escalate if unresolved",
                "Provide external recourse information"
            ],
            externalRecourse: [
                "Ombudsman for Banking Services",
                "National Credit Regulator",
                "Financial Sector Conduct Authority",
                "Consumer Protection Commission",
                "South African courts"
            ]
        }
    },

    // ============================================
    // 6. ANTI-MONEY LAUNDERING (FICA) COMPLIANCE
    // ============================================
    fica: {
        // 6.1. Customer Due Diligence
        cdd: {
            levels: [
                {
                    level: "Simplified Due Diligence",
                    appliesTo: "Loans under R5,000",
                    requirements: ["Basic identity verification", "Contact information"]
                },
                {
                    level: "Standard Due Diligence",
                    appliesTo: "Loans R5,000 - R50,000",
                    requirements: ["Full identity verification", "Proof of address", "Source of funds"]
                },
                {
                    level: "Enhanced Due Diligence",
                    appliesTo: "Loans over R50,000, PEPs, high-risk",
                    requirements: ["Additional documentation", "Senior management approval", "Ongoing monitoring"]
                }
            ],
            verification: {
                methods: ["Document verification", "Biometric verification", "Database checks", "Face-to-face where possible"],
                documents: ["SA ID document", "Proof of address", "Proof of income", "Bank statements"]
            }
        },

        // 6.2. Transaction Monitoring
        monitoring: {
            thresholds: [
                {
                    type: "Single transaction",
                    amount: "R25,000",
                    action: "Enhanced verification"
                },
                {
                    type: "Monthly cumulative",
                    amount: "R100,000",
                    action: "Pattern analysis"
                },
                {
                    type: "Unusual pattern",
                    amount: "Any suspicious",
                    action: "Immediate reporting"
                }
            ],
            indicators: [
                "Rapid movement of funds",
                "Structuring to avoid thresholds",
                "Unusual geographic patterns",
                "Transactions with high-risk jurisdictions",
                "Inconsistent with customer profile"
            ]
        },

        // 6.3. Reporting Obligations
        reporting: {
            suspiciousTransactions: {
                authority: "Financial Intelligence Centre (FIC)",
                timeframe: "Within 15 days of detection",
                method: "Electronic reporting via FIC portal",
                confidentiality: "Strictly confidential, tipping-off prohibited"
            },
            cashThresholdReports: {
                threshold: "R25,000",
                timeframe: "Within 2 business days",
                information: ["Customer details", "Transaction details", "Source of funds"]
            },
            recordKeeping: {
                duration: "7 years minimum",
                format: "Electronic with backup",
                access: "Available for inspection"
            }
        },

        // 6.4. Training & Awareness
        training: {
            frequency: "Annual training for all staff",
            topics: [
                "FICA obligations",
                "Suspicious activity recognition",
                "Reporting procedures",
                "Customer due diligence",
                "Record keeping"
            ],
            verification: "Training records maintained for 7 years",
            updates: "Regular updates for regulatory changes"
        }
    },

    // ============================================
    // 7. TAX COMPLIANCE - SOUTH AFRICA
    // ============================================
    tax: {
        // 7.1. VAT Compliance
        vat: {
            registrationNumber: "4880266188",
            rate: 15,
            taxableSupplies: [
                "Lender subscription fees",
                "Platform services",
                "Value-added services"
            ],
            exemptions: [
                "Loan principal amounts",
                "Interest charged by lenders",
                "Donations and grants"
            ],
            invoicing: {
                requirement: "Tax invoice for amounts over R50",
                information: ["VAT number", "Tax amount", "Taxable value"],
                timeframe: "Within 21 days of transaction"
            },
            filing: {
                frequency: "Every 2 months",
                deadline: "25th of following month",
                penalties: "10% penalty for late filing"
            }
        },

        // 7.2. Income Tax
        incomeTax: {
            residentRate: "Progressive up to 45%",
            nonResidentRate: "Flat 25%",
            deductions: [
                "Business expenses",
                "Retirement contributions",
                "Medical expenses"
            ],
            reporting: {
                lenders: "Interest income reported to SARS",
                platform: "Annual IT14 submission",
                users: "Annual tax certificates provided"
            },
            certificates: {
                issued: "Annually by May 31",
                format: "SARS compliant format",
                distribution: "Electronic delivery"
            }
        },

        // 7.3. Withholding Taxes
        withholdingTaxes: {
            interestWithholding: {
                rate: "15% for non-residents",
                exemption: "Residents and treaty countries",
                reporting: "Monthly to SARS"
            },
            dividends: {
                rate: "20%",
                exemptions: ["South African companies", "Certain pension funds"],
                dtas: "Double Taxation Agreements applied"
            }
        }
    },

    // ============================================
    // 8. DISCLAIMERS & LIMITATIONS OF LIABILITY
    // ============================================
    disclaimers: {
        financialAdvice: {
            title: "No Financial Advice",
            text: "M-Pesewa does not provide financial advice. All lending and borrowing decisions are made by users at their own risk. Users should seek independent financial advice before entering into loan agreements."
        },
        investmentRisk: {
            title: "Investment Risk Warning",
            text: "Lending through the platform involves risk of loss. Past performance is not indicative of future results. Users should only lend amounts they can afford to lose."
        },
        platformAvailability: {
            title: "Platform Availability",
            text: "M-Pesewa does not guarantee uninterrupted platform availability. Scheduled maintenance and unforeseen outages may occur. Critical notifications will be communicated through registered channels."
        },
        thirdPartyServices: {
            title: "Third-Party Services",
            text: "M-Pesewa is not responsible for the services, actions, or omissions of third-party payment processors, debt collectors, or other service providers. Users engage with third parties at their own risk."
        },
        forceMajeure: {
            title: "Force Majeure",
            text: "M-Pesewa is not liable for delays or failures in performance resulting from circumstances beyond reasonable control, including natural disasters, government actions, or infrastructure failures."
        }
    },

    // ============================================
    // 9. GOVERNING LAW & JURISDICTION
    // ============================================
    jurisdiction: {
        governingLaw: "Laws of the Republic of South Africa",
        specificLaws: [
            "National Credit Act 34 of 2005",
            "Financial Advisory and Intermediary Services Act 37 of 2002",
            "Protection of Personal Information Act 4 of 2013",
            "Consumer Protection Act 68 of 2008",
            "Financial Intelligence Centre Act 38 of 2001"
        ],
        courts: "High Court of South Africa, Gauteng Division, Pretoria",
        arbitration: {
            available: true,
            body: "Arbitration Foundation of Southern Africa (AFSA)",
            location: "Sandton, Johannesburg",
            language: "English",
            costSharing: "As determined by arbitrator"
        },
        classAction: {
            allowed: true,
            requirements: "Certification by court",
            optOut: "Automatic inclusion unless opted out"
        }
    },

    // ============================================
    // 10. AMENDMENTS & UPDATES
    // ============================================
    amendments: {
        notification: {
            method: ["In-app notification", "Email to registered address", "Website announcement"],
            timeframe: "30 days before effective date"
        },
        userConsent: {
            required: true,
            method: "Explicit acceptance of updated terms",
            continuedUse: "Continued use constitutes acceptance"
        },
        archive: {
            previousVersions: "Maintained for 7 years",
            access: "Available on request",
            comparison: "Change summaries provided"
        },
        effectiveDate: "2026-01-24",
        version: "2.1.0"
    }
};

// ============================================
// LEGAL UTILITY FUNCTIONS
// ============================================

/**
 * Generate legal document based on type
 * @param {string} documentType - Type of legal document
 * @param {Object} userData - User data for personalization
 * @returns {Object} Generated legal document
 */
function generateLegalDocument(documentType, userData = {}) {
    const templates = {
        terms: {
            title: `M-Pesewa Terms and Conditions - South Africa`,
            sections: ZA_LEGAL.terms,
            footer: `Effective: ${ZA_LEGAL.amendments.effectiveDate}\nVersion: ${ZA_LEGAL.amendments.version}`
        },
        privacy: {
            title: `M-Pesewa Privacy Policy - South Africa`,
            sections: ZA_LEGAL.privacy,
            footer: `Information Officer: ${ZA_LEGAL.licenses.popia.responsibleParty}`
        },
        fairPractices: {
            title: `Fair Practices Code - South Africa`,
            sections: ZA_LEGAL.fairPractices,
            footer: `Complaints: ${ZA_LEGAL.fairPractices.complaints.channels[1].channel}`
        },
        disclaimer: {
            title: `Important Disclaimers - South Africa`,
            sections: ZA_LEGAL.disclaimers,
            footer: `Governing Law: ${ZA_LEGAL.jurisdiction.governingLaw}`
        }
    };

    const template = templates[documentType];
    if (!template) {
        throw new Error(`Unknown document type: ${documentType}`);
    }

    // Personalize document if user data provided
    let personalizedSections = { ...template.sections };
    if (userData.name && userData.idNumber) {
        personalizedSections.userDetails = {
            name: userData.name,
            idNumber: userData.idNumber,
            date: new Date().toLocaleDateString('en-ZA'),
            reference: `MPW-${Date.now()}`
        };
    }

    return {
        ...template,
        sections: personalizedSections,
        generated: new Date().toISOString(),
        jurisdiction: ZA_LEGAL.jurisdiction.governingLaw
    };
}

/**
 * Validate user consent for legal documents
 * @param {string} documentType - Type of document
 * @param {string} userId - User ID
 * @param {string} consentMethod - Method of consent
 * @returns {Object} Validation result
 */
function validateConsent(documentType, userId, consentMethod) {
    const validMethods = ['clickwrap', 'browsewrap', 'signature', 'verbal'];
    
    if (!validMethods.includes(consentMethod)) {
        return {
            valid: false,
            error: `Invalid consent method. Must be one of: ${validMethods.join(', ')}`
        };
    }

    const requiredDocuments = ['terms', 'privacy'];
    if (requiredDocuments.includes(documentType)) {
        return {
            valid: true,
            record: {
                userId,
                documentType,
                consentMethod,
                timestamp: new Date().toISOString(),
                ipAddress: 'recorded',
                userAgent: 'recorded',
                version: ZA_LEGAL.amendments.version
            },
            retention: '7 years as per POPIA',
            notice: 'Consent recorded in compliance with South African law'
        };
    }

    return {
        valid: true,
        record: {
            userId,
            documentType,
            consentMethod,
            timestamp: new Date().toISOString()
        }
    };
}

/**
 * Check if transaction requires enhanced due diligence
 * @param {number} amount - Transaction amount
 * @param {string} userType - Type of user (individual/business)
 * @param {Array} riskFactors - Array of risk factors
 * @returns {Object} Due diligence requirements
 */
function getDueDiligenceRequirements(amount, userType, riskFactors = []) {
    const thresholds = ZA_LEGAL.fica.cdd.levels;
    
    let requiredLevel = 'Simplified Due Diligence';
    let requirements = [];
    
    if (amount >= 50000 || riskFactors.includes('pep') || riskFactors.includes('highRiskCountry')) {
        requiredLevel = 'Enhanced Due Diligence';
        requirements = thresholds.find(t => t.level === requiredLevel).requirements;
    } else if (amount >= 5000) {
        requiredLevel = 'Standard Due Diligence';
        requirements = thresholds.find(t => t.level === requiredLevel).requirements;
    } else {
        requirements = thresholds.find(t => t.level === requiredLevel).requirements;
    }

    // Add user type specific requirements
    if (userType === 'business') {
        requirements.push('Company registration documents', 'Proof of business address', 'Director identification');
    }

    return {
        level: requiredLevel,
        requirements,
        timeframe: amount >= 50000 ? 'Immediate' : 'Within 7 days',
        approval: amount >= 50000 ? 'Senior Management Required' : 'Standard Approval'
    };
}

/**
 * Generate tax certificate for user
 * @param {string} userId - User ID
 * @param {number} year - Tax year
 * @param {Array} transactions - Array of transactions
 * @returns {Object} Tax certificate
 */
function generateTaxCertificate(userId, year, transactions) {
    const totalInterest = transactions.reduce((sum, t) => sum + (t.interest || 0), 0);
    const totalFees = transactions.reduce((sum, t) => sum + (t.fees || 0), 0);
    
    return {
        certificateNumber: `MPW-TAX-${year}-${userId}`,
        taxYear: year,
        issuedDate: new Date().toLocaleDateString('en-ZA'),
        issuer: ZA_LEGAL.entity.registeredName,
        issuerVAT: ZA_LEGAL.tax.vat.registrationNumber,
        recipient: {
            userId,
            // Note: Actual user details would come from user database
        },
        summary: {
            totalInterestIncome: totalInterest,
            totalFeesPaid: totalFees,
            vatOnFees: totalFees * 0.15,
            netAmount: totalInterest - totalFees
        },
        transactions: transactions.map(t => ({
            date: t.date,
            description: t.description,
            amount: t.amount,
            interest: t.interest,
            fees: t.fees,
            reference: t.reference
        })),
        notes: [
            'This certificate is issued for tax purposes',
            'Keep for 7 years as per SARS requirements',
            'Consult a tax advisor for proper tax treatment',
            `Issuer VAT: ${ZA_LEGAL.tax.vat.registrationNumber}`
        ],
        disclaimer: 'This certificate is based on platform records. User is responsible for verifying accuracy.'
    };
}

/**
 * Check compliance for specific loan
 * @param {Object} loanDetails - Loan details
 * @returns {Object} Compliance check result
 */
function checkLoanCompliance(loanDetails) {
    const {
        amount,
        interestRate,
        termDays,
        borrowerIncome,
        borrowerExistingDebt,
        lenderTier
    } = loanDetails;

    const violations = [];
    const warnings = [];
    const approvals = [];

    // National Credit Act compliance
    if (interestRate > 10) {
        violations.push(`Interest rate (${interestRate}%) exceeds platform maximum of 10%`);
    }

    const apr = (interestRate * 52).toFixed(2); // Annual percentage rate
    if (parseFloat(apr) > ZA_LEGAL.config.regulation.interestRateCap.annual) {
        violations.push(`APR (${apr}%) exceeds NCA cap of ${ZA_LEGAL.config.regulation.interestRateCap.annual}%`);
    }

    if (termDays > 7) {
        violations.push(`Term (${termDays} days) exceeds platform maximum of 7 days`);
    }

    // Affordability assessment (simplified)
    if (borrowerIncome && borrowerExistingDebt) {
        const debtToIncome = (borrowerExistingDebt / borrowerIncome) * 100;
        if (debtToIncome > 40) {
            warnings.push(`High debt-to-income ratio: ${debtToIncome.toFixed(2)}%`);
        }
        
        const newDebtRatio = ((borrowerExistingDebt + amount) / borrowerIncome) * 100;
        if (newDebtRatio > 50) {
            violations.push(`Loan would push debt-to-income ratio to ${newDebtRatio.toFixed(2)}% (max 50%)`);
        }
    }

    // Lender tier compliance
    const tierConfig = ZA_LEGAL.config.platform.subscriptionTiers[lenderTier];
    if (tierConfig && amount > tierConfig.maxWeeklyLimit) {
        violations.push(`Amount (R${amount}) exceeds ${lenderTier} tier limit (R${tierConfig.maxWeeklyLimit})`);
    }

    // Cooling-off period notice
    if (amount >= 5000) {
        approvals.push(`5-day cooling-off period applies as per NCA`);
    }

    return {
        compliant: violations.length === 0,
        violations,
        warnings,
        approvals,
        requiredActions: violations.length > 0 ? ['Adjust loan terms', 'Reject application'] : ['Proceed with caution'],
        ncaReference: 'National Credit Act 34 of 2005',
        timestamp: new Date().toISOString()
    };
}

/**
 * Get dispute resolution options for user
 * @param {string} userType - Type of user (lender/borrower)
 * @param {number} amount - Dispute amount
 * @returns {Object} Dispute resolution options
 */
function getDisputeResolutionOptions(userType, amount) {
    const options = [
        {
            level: 'Internal',
            channel: 'In-app dispute resolution',
            cost: 'Free',
            timeframe: '15 working days',
            maxAmount: 'Unlimited',
            description: 'Platform-mediated resolution'
        },
        {
            level: 'Ombudsman',
            channel: 'Ombudsman for Banking Services',
            cost: 'Free for consumers',
            timeframe: '60-90 days',
            maxAmount: 'R5,000,000',
            description: 'Independent dispute resolution'
        },
        {
            level: 'Regulator',
            channel: 'National Credit Regulator',
            cost: 'Free',
            timeframe: '90-120 days',
            maxAmount: 'Unlimited',
            description: 'Regulatory investigation'
        },
        {
            level: 'Legal',
            channel: 'South African Courts',
            cost: 'Court fees apply',
            timeframe: '6-24 months',
            maxAmount: 'Unlimited',
            description: 'Formal legal proceedings'
        }
    ];

    // Filter based on amount
    const applicableOptions = options.filter(option => {
        if (option.maxAmount === 'Unlimited') return true;
        const maxAmount = parseInt(option.maxAmount.replace(/[^0-9]/g, ''));
        return amount <= maxAmount;
    });

    return {
        userType,
        disputeAmount: amount,
        options: applicableOptions,
        recommended: amount <= 5000000 ? 'Ombudsman for Banking Services' : 'Legal proceedings',
        contact: ZA_LEGAL.fairPractices.complaints.channels,
        legalBasis: 'National Credit Act Section 134'
    };
}

// ============================================
// EXPORT MODULE
// ============================================

export default {
    // Legal Configuration
    legal: ZA_LEGAL,
    
    // Entity Information
    entity: ZA_LEGAL.entity,
    licenses: ZA_LEGAL.licenses,
    
    // Core Legal Documents
    terms: ZA_LEGAL.terms,
    privacy: ZA_LEGAL.privacy,
    fairPractices: ZA_LEGAL.fairPractices,
    
    // Compliance Modules
    fica: ZA_LEGAL.fica,
    tax: ZA_LEGAL.tax,
    
    // Legal Functions
    generateLegalDocument,
    validateConsent,
    getDueDiligenceRequirements,
    generateTaxCertificate,
    checkLoanCompliance,
    getDisputeResolutionOptions,
    
    // Legal Constants
    GOVERNING_LAW: ZA_LEGAL.jurisdiction.governingLaw,
    JURISDICTION: ZA_LEGAL.jurisdiction.courts,
    VAT_NUMBER: ZA_LEGAL.tax.vat.registrationNumber,
    FSP_NUMBER: ZA_LEGAL.licenses.fsca.licenseNumber,
    NCR_NUMBER: ZA_LEGAL.licenses.ncr.registrationNumber,
    
    // Compliance Requirements
    COMPLIANCE_REQUIREMENTS: {
        KYC: ZA_LEGAL.fica.cdd,
        REPORTING: ZA_LEGAL.fica.reporting,
        TAX: ZA_LEGAL.tax,
        DATA_PROTECTION: ZA_LEGAL.privacy
    },
    
    // User Rights
    USER_RIGHTS: ZA_LEGAL.privacy.userRights,
    
    // Important Notices
    IMPORTANT_NOTICES: [
        `M-Pesewa is registered with FSCA (FSP${ZA_LEGAL.licenses.fsca.licenseNumber})`,
        `Credit provider registered with NCR (${ZA_LEGAL.licenses.ncr.registrationNumber})`,
        `VAT Registration Number: ${ZA_LEGAL.tax.vat.registrationNumber}`,
        `Information Officer: ${ZA_LEGAL.licenses.popia.responsibleParty}`,
        `Complaints: ${ZA_LEGAL.fairPractices.complaints.channels[1].channel}`
    ],
    
    // Version Information
    VERSION: ZA_LEGAL.amendments.version,
    EFFECTIVE_DATE: ZA_LEGAL.amendments.effectiveDate,
    LAST_UPDATED: '2026-01-24'
};

// Legal Compliance Validation
console.log(`✅ M-Pesewa ${ZA_LEGAL.entity.registeredName} legal framework loaded`);
console.log(`📋 FSCA License: ${ZA_LEGAL.licenses.fsca.licenseNumber}`);
console.log(`📋 NCR Registration: ${ZA_LEGAL.licenses.ncr.registrationNumber}`);
console.log(`📋 VAT Number: ${ZA_LEGAL.tax.vat.registrationNumber}`);
console.log(`⚖️ Governing Law: ${ZA_LEGAL.jurisdiction.governingLaw}`);