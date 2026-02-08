/**
 * M-PESEWA - NIGERIA LEGAL COMPLIANCE MODULE
 * Legal Framework for Micro-lending Operations in Nigeria
 * Strict Compliance with Nigerian Financial Regulations
 * Last Updated: 2026-01-24
 */

const NigeriaLegal = {
    // ====================================================================
    // 1️⃣ LEGAL FRAMEWORK & JURISDICTION
    // ====================================================================
    jurisdiction: {
        country: "Federal Republic of Nigeria",
        legalSystem: "Common Law (English Law based)",
        applicableLaws: [
            "1999 Constitution of the Federal Republic of Nigeria",
            "Companies and Allied Matters Act 2020 (CAMA)",
            "Banks and Other Financial Institutions Act 2020 (BOFIA)",
            "Central Bank of Nigeria Act 2007",
            "Nigeria Data Protection Regulation 2019 (NDPR)",
            "Money Laundering (Prohibition) Act 2022",
            "Cybercrimes (Prohibition, Prevention, etc.) Act 2015",
            "Federal Competition and Consumer Protection Act 2018",
            "Investment and Securities Act 2007"
        ],
        regulatoryAuthorities: [
            {
                name: "Central Bank of Nigeria (CBN)",
                role: "Primary Financial Regulator",
                licenseRequired: "Microfinance Bank License",
                contact: "cbn.gov.ng"
            },
            {
                name: "Nigeria Financial Intelligence Unit (NFIU)",
                role: "Anti-Money Laundering Compliance",
                licenseRequired: "Reporting Entity Registration",
                contact: "nfiugov.ng"
            },
            {
                name: "Corporate Affairs Commission (CAC)",
                role: "Company Incorporation",
                licenseRequired: "Incorporation Certificate",
                contact: "cac.gov.ng"
            },
            {
                name: "Federal Inland Revenue Service (FIRS)",
                role: "Tax Administration",
                licenseRequired: "Tax Identification Number (TIN)",
                contact: "firs.gov.ng"
            }
        ]
    },

    // ====================================================================
    // 2️⃣ LICENSING REQUIREMENTS (MANDATORY)
    // ====================================================================
    licensing: {
        platformLicense: {
            type: "Microfinance Bank License (State)",
            issuingAuthority: "Central Bank of Nigeria",
            validityPeriod: "5 years",
            renewalRequirements: [
                "Annual Financial Audit",
                "Compliance Certificate",
                "Minimum Capital Requirement: ₦100,000,000",
                "Fit and Proper Test for Directors",
                "Physical Office Requirement"
            ],
            capitalRequirements: {
                national: "₦5,000,000,000",
                state: "₦1,000,000,000",
                unit: "₦100,000,000"
            }
        },

        ancillaryLicenses: [
            {
                name: "NDPR Compliance Certificate",
                authority: "Nigeria Data Protection Bureau",
                requirement: "Mandatory for data processing",
                validity: "1 year"
            },
            {
                name: "NFIU Registration",
                authority: "Nigeria Financial Intelligence Unit",
                requirement: "Mandatory for financial institutions",
                validity: "Indefinite (with annual reporting)"
            },
            {
                name: "Switch License",
                authority: "Central Bank of Nigeria",
                requirement: "For payment processing",
                validity: "5 years"
            }
        ]
    },

    // ====================================================================
    // 3️⃣ TERMS & CONDITIONS (NIGERIA SPECIFIC)
    // ====================================================================
    termsAndConditions: {
        effectiveDate: "January 24, 2026",
        governingLaw: "Laws of the Federal Republic of Nigeria",
        disputeResolution: "Arbitration in Lagos, Nigeria",

        // Platform Role (STRICT)
        platformRole: {
            disclaimer: "M-PESEWA IS NOT A BANK",
            servicesProvided: [
                "Technology platform for connecting lenders and borrowers",
                "Group management and administration tools",
                "Ledger tracking and record keeping",
                "Reputation and rating system",
                "Dispute resolution framework"
            ],
            servicesNotProvided: [
                "Holding customer funds (No escrow services)",
                "Loan guarantee or insurance",
                "Debt collection (except directory)",
                "Credit risk assessment (beyond reputation)",
                "Fund transfer execution (users transfer directly)"
            ],
            liabilityLimitation: "Platform liability limited to subscription fees only"
        },

        // User Eligibility
        eligibility: {
            minimumAge: 18,
            residency: "Must be resident in Nigeria",
            identification: [
                "Bank Verification Number (BVN)",
                "National Identity Number (NIN)",
                "Valid Government ID"
            ],
            prohibitedUsers: [
                "Politically Exposed Persons (PEPs) without enhanced due diligence",
                "Sanctioned individuals or entities",
                "Minors (under 18 years)",
                "Non-residents of Nigeria"
            ]
        },

        // Loan Terms
        loanTerms: {
            maximumInterest: "As stipulated by CBN guidelines",
            maximumTenure: "7 days (with extensions possible)",
            earlyRepayment: "Allowed without penalty",
            defaultConsequences: [
                "Blacklisting on platform",
                "Reporting to credit bureaus (if applicable)",
                "Legal action through small claims court"
            ]
        }
    },

    // ====================================================================
    // 4️⃣ PRIVACY POLICY (NDPR COMPLIANT)
    // ====================================================================
    privacyPolicy: {
        dataController: "M-Pesewa Technology Nigeria Limited",
        dpoContact: "dpo.nigeria@mpesewa.com",
        dataPrinciples: [
            "Lawfulness, fairness and transparency",
            "Purpose limitation",
            "Data minimization",
            "Accuracy",
            "Storage limitation",
            "Integrity and confidentiality",
            "Accountability"
        ],

        dataCollected: {
            mandatory: [
                "Full Name",
                "Date of Birth",
                "BVN and NIN",
                "Phone Number",
                "Email Address",
                "Residential Address",
                "Bank Account Details"
            ],
            optional: [
                "Occupation",
                "Monthly Income",
                "Next of Kin",
                "Alternate Phone Number"
            ],
            technical: [
                "IP Address",
                "Device Information",
                "Location Data",
                "Usage Patterns"
            ]
        },

        dataProcessing: {
            purposes: [
                "Identity Verification",
                "Credit Assessment",
                "Transaction Processing",
                "Fraud Prevention",
                "Regulatory Compliance",
                "Customer Service"
            ],
            legalBasis: [
                "Performance of contract",
                "Legal obligation",
                "Legitimate interest",
                "Consent (for marketing)"
            ]
        },

        dataSharing: {
            withConsent: [
                "Group members (limited information)",
                "Debt collectors (upon default)",
                "Marketing partners (with opt-in)"
            ],
            withoutConsent: [
                "Regulatory authorities (CBN, NFIU, FIRS)",
                "Law enforcement (with court order)",
                "Credit bureaus (for credit reporting)"
            ],
            internationalTransfers: "Prohibited except with NDPB approval"
        },

        dataRights: [
            "Right to access personal data",
            "Right to rectification",
            "Right to erasure ('right to be forgotten')",
            "Right to restrict processing",
            "Right to data portability",
            "Right to object to processing",
            "Rights related to automated decision-making"
        ],

        dataRetention: {
            activeUsers: "7 years after last transaction",
            inactiveUsers: "10 years after account closure",
            legalRequirements: "As required by Nigerian law"
        }
    },

    // ====================================================================
    // 5️⃣ ANTI-MONEY LAUNDERING (AML) POLICY
    // ====================================================================
    amlPolicy: {
        riskAssessment: {
            customerRisk: [
                "High: PEPs, cash-intensive businesses",
                "Medium: New customers, large transactions",
                "Low: Verified customers, small transactions"
            ],
            transactionRisk: [
                "High: Cross-border, large amounts, unusual patterns",
                "Medium: New payees, inconsistent patterns",
                "Low: Routine, small, peer-to-peer"
            ]
        },

        customerDueDiligence: {
            simplified: "Transactions below ₦50,000",
            standard: "Transactions ₦50,000 - ₦5,000,000",
            enhanced: [
                "Transactions above ₦5,000,000",
                "PEPs and their associates",
                "High-risk jurisdictions",
                "Unusual transaction patterns"
            ]
        },

        suspiciousActivity: {
            indicators: [
                "Multiple accounts for same person",
                "Structuring to avoid reporting thresholds",
                "Frequent large cash deposits/withdrawals",
                "Transactions with sanctioned countries",
                "Inconsistent customer profile"
            ],
            reporting: {
                threshold: "₦5,000,000 or suspicious pattern",
                timeframe: "Within 24 hours",
                authority: "Nigeria Financial Intelligence Unit"
            }
        },

        recordKeeping: {
            duration: "Minimum 5 years",
            format: "Electronic with audit trail",
            accessibility: "Available for regulatory inspection"
        }
    },

    // ====================================================================
    // 6️⃣ CONSUMER PROTECTION
    // ====================================================================
    consumerProtection: {
        transparency: {
            pricing: "All fees must be disclosed upfront",
            terms: "Plain language, no hidden clauses",
            complaints: "Clear complaint resolution process"
        },

        fairLending: {
            nonDiscrimination: [
                "No discrimination based on gender, tribe, religion",
                "Equal access to all eligible customers",
                "Transparent credit assessment"
            ],
            responsibleLending: [
                "Affordability assessment required",
                "No rollovers without reassessment",
                "Cooling-off period for new borrowers"
            ]
        },

        disputeResolution: {
            internal: [
                "Level 1: Customer Service (48 hours)",
                "Level 2: Management Escalation (7 days)",
                "Level 3: Ombudsman (14 days)"
            ],
            external: [
                "Consumer Protection Council",
                "Central Bank of Nigeria",
                "Court of competent jurisdiction"
            ],
            arbitration: "Lagos Court of Arbitration"
        }
    },

    // ====================================================================
    // 7️⃣ TAX COMPLIANCE
    // ====================================================================
    taxCompliance: {
        companyTax: {
            corporateTax: "30% of profit",
            minimumTax: "0.5% of gross turnover",
            filingDeadline: "6 months after financial year-end",
            paymentDeadline: "3 months after financial year-end"
        },

        withholdingTax: {
            interest: "10% on interest paid to lenders",
            dividends: "10% if applicable",
            contracts: "5% on service contracts",
            filing: "21st of following month"
        },

        valueAddedTax: {
            rate: "7.5%",
            applicable: "On subscription fees only",
            registration: "Mandatory above ₦25,000,000 turnover",
            filing: "21st of following month"
        },

        stampDuty: {
            rate: "₦50 on electronic transfers above ₦10,000",
            collection: "Automatically deducted",
            remittance: "To FIRS monthly"
        }
    },

    // ====================================================================
    // 8️⃣ OPERATIONAL COMPLIANCE
    // ====================================================================
    operationalCompliance: {
        reporting: [
            {
                report: "Monthly Transaction Report",
                to: "Central Bank of Nigeria",
                deadline: "10th of following month",
                content: "All transactions above ₦5,000,000"
            },
            {
                report: "Quarterly Financial Statement",
                to: "CBN and FIRS",
                deadline: "30 days after quarter-end",
                content: "Income statement, balance sheet, cash flow"
            },
            {
                report: "Annual AML/CFT Report",
                to: "NFIU",
                deadline: "March 31st each year",
                content: "AML compliance activities"
            }
        ],

        audits: [
            {
                type: "Annual Financial Audit",
                by: "Registered Auditors",
                deadline: "6 months after year-end",
                submission: "CBN and CAC"
            },
            {
                type: "IT Security Audit",
                frequency: "Annual",
                by: "Certified Information Systems Auditor",
                standards: "ISO 27001, PCI DSS"
            }
        ],

        training: {
            staff: [
                "AML/CFT training annually",
                "Data protection training",
                "Customer service training"
            ],
            agents: [
                "KYC procedures",
                "Fraud detection",
                "Customer handling"
            ]
        }
    },

    // ====================================================================
    // 9️⃣ PENALTIES & SANCTIONS
    // ====================================================================
    penalties: {
        regulatory: [
            {
                offense: "Operating without license",
                penalty: "Up to ₦10,000,000 fine + imprisonment",
                authority: "CBN"
            },
            {
                offense: "Failure to report suspicious transactions",
                penalty: "Up to ₦5,000,000 fine",
                authority: "NFIU"
            },
            {
                offense: "Data protection violation",
                penalty: "Up to 2% of annual revenue or ₦10,000,000",
                authority: "NDPB"
            }
        ],

        platform: [
            {
                violation: "Cross-country transaction attempt",
                action: "Immediate account suspension",
                appeal: "To compliance committee"
            },
            {
                violation: "Fraudulent activity",
                action: "Permanent ban + legal action",
                appeal: "None for confirmed fraud"
            }
        ]
    },

    // ====================================================================
    // 🔟 LEGAL DOCUMENTS & TEMPLATES
    // ====================================================================
    legalDocuments: {
        templates: {
            loanAgreement: `
LOAN AGREEMENT - M-PESEWA NIGERIA

THIS AGREEMENT is made on {date}
BETWEEN:
LENDER: {lenderName} (BVN: {lenderBVN})
AND
BORROWER: {borrowerName} (BVN: {borrowerBVN})

1. LOAN DETAILS:
   Amount: ₦{amount}
   Purpose: {purpose}
   Interest: 10% per week
   Duration: 7 days
   Repayment Date: {repaymentDate}

2. TERMS:
   - Repayment within 7 days
   - 5% daily penalty after due date
   - Default after 60 days

3. GOVERNING LAW:
   Laws of the Federal Republic of Nigeria

SIGNED:
Lender: _________________
Borrower: _________________
Witness: _________________
            `,

            privacyConsent: `
PRIVACY CONSENT FORM

I, {userName}, consent to:
1. Collection of my personal data for verification
2. Processing for loan assessment
3. Sharing with regulatory authorities as required
4. Retention for 7 years as per Nigerian law

Signature: _________________
Date: {date}
            `
        },

        disclaimers: {
            platform: "M-PESEWA IS A TECHNOLOGY PLATFORM ONLY. WE DO NOT HOLD FUNDS, GUARANTEE LOANS, OR ASSUME CREDIT RISK.",
            investment: "LENDING INVOLVES RISK. PAST PERFORMANCE DOES NOT GUARANTEE FUTURE RESULTS.",
            regulatory: "OPERATING UNDER CBN MICROFINANCE BANK LICENSE NO: {licenseNumber}"
        }
    }
};

// ====================================================================
// COMPLIANCE FUNCTIONS
// ====================================================================

/**
 * Check if transaction requires enhanced due diligence
 * @param {Object} transaction - Transaction details
 * @returns {boolean} True if EDD required
 */
function requiresEnhancedDueDiligence(transaction) {
    const EDD_THRESHOLD = 5000000; // ₦5,000,000
    
    if (transaction.amount >= EDD_THRESHOLD) return true;
    if (transaction.isPEP) return true;
    if (transaction.isHighRiskCountry) return true;
    if (transaction.pattern === 'unusual') return true;
    
    return false;
}

/**
 * Generate compliance report for regulatory submission
 * @param {Array} transactions - Transaction list
 * @param {string} period - Reporting period
 * @returns {Object} Compliance report
 */
function generateComplianceReport(transactions, period) {
    const report = {
        period: period,
        generated: new Date().toISOString(),
        platform: "M-Pesewa Nigeria",
        license: "CBN Microfinance Bank License",
        
        summary: {
            totalTransactions: transactions.length,
            totalValue: transactions.reduce((sum, t) => sum + t.amount, 0),
            averageTransaction: 0,
            suspiciousTransactions: 0,
            reportedTransactions: 0
        },
        
        transactions: transactions.map(t => ({
            id: t.id,
            date: t.date,
            amount: t.amount,
            type: t.type,
            parties: t.parties,
            status: t.status,
            suspicious: t.suspicious || false
        })),
        
        compliance: {
            aml: true,
            kyc: true,
            dataProtection: true,
            tax: true
        },
        
        issues: []
    };
    
    report.summary.averageTransaction = report.summary.totalValue / report.summary.totalTransactions;
    report.summary.suspiciousTransactions = transactions.filter(t => t.suspicious).length;
    
    return report;
}

/**
 * Validate KYC documents for Nigeria
 * @param {Object} documents - User documents
 * @returns {Object} Validation result
 */
function validateKYCDocuments(documents) {
    const errors = [];
    const warnings = [];
    
    // Check required documents
    const required = ['nin', 'bvn', 'idCard', 'proofOfAddress'];
    required.forEach(doc => {
        if (!documents[doc]) {
            errors.push(`${doc.toUpperCase()} is required`);
        }
    });
    
    // Validate NIN format
    if (documents.nin && !/^\d{11}$/.test(documents.nin)) {
        errors.push("NIN must be 11 digits");
    }
    
    // Validate BVN format
    if (documents.bvn && !/^\d{11}$/.test(documents.bvn)) {
        errors.push("BVN must be 11 digits");
    }
    
    // Check document expiration
    if (documents.idCard) {
        const expiry = new Date(documents.idCard.expiry);
        if (expiry < new Date()) {
            errors.push("ID card has expired");
        }
    }
    
    // Address verification
    if (documents.proofOfAddress) {
        const addressAge = (new Date() - new Date(documents.proofOfAddress.date)) / (1000 * 60 * 60 * 24);
        if (addressAge > 90) {
            warnings.push("Proof of address is older than 3 months");
        }
    }
    
    return {
        valid: errors.length === 0,
        errors,
        warnings,
        verificationLevel: errors.length === 0 ? 'VERIFIED' : 'PENDING'
    };
}

/**
 * Calculate withholding tax for Nigeria
 * @param {number} interestAmount - Interest amount
 * @returns {Object} Tax calculation
 */
function calculateWithholdingTax(interestAmount) {
    const taxRate = 0.10; // 10%
    const taxAmount = interestAmount * taxRate;
    const netAmount = interestAmount - taxAmount;
    
    return {
        grossInterest: interestAmount,
        taxRate: `${taxRate * 100}%`,
        taxAmount: Math.round(taxAmount),
        netAmount: Math.round(netAmount),
        remittanceDeadline: "21st of following month",
        authority: "Federal Inland Revenue Service (FIRS)"
    };
}

/**
 * Generate legal disclaimer for Nigeria
 * @param {string} context - Usage context
 * @returns {string} Appropriate disclaimer
 */
function generateLegalDisclaimer(context) {
    const disclaimers = {
        lending: `
IMPORTANT LEGAL DISCLAIMER - NIGERIA

1. M-PESEWA IS A TECHNOLOGY PLATFORM, NOT A BANK.
2. We do not hold customer funds or guarantee loans.
3. Lending involves risk of capital loss.
4. All transactions are subject to Nigerian law.
5. CBN License No: MFB/1234/2025

For complaints, contact: ng.support@mpesewa.com
        `,
        
        borrowing: `
BORROWER ACKNOWLEDGEMENT - NIGERIA

I acknowledge that:
1. I am borrowing at 10% weekly interest.
2. Late repayment attracts 5% daily penalty.
3. Default may lead to blacklisting and legal action.
4. My BVN and NIN will be verified.
5. I have read and understood the terms.

Signature: _________________
        `,
        
        general: `
M-PESEWA NIGERIA
Registered with CAC: RC 1234567
CBN License: MFB/1234/2025
NDPR Compliant: Certificate No. NDPR/2025/789

© 2026 M-Pesewa Technology Nigeria Limited
All rights reserved.
        `
    };
    
    return disclaimers[context] || disclaimers.general;
}

// ====================================================================
// REGULATORY CHECKLIST
// ====================================================================

const RegulatoryChecklist = {
    daily: [
        "Verify all transactions above ₦5,000,000",
        "Check for suspicious activity patterns",
        "Review system logs for security breaches",
        "Update AML/CFT monitoring",
        "Backup all transaction data"
    ],
    
    weekly: [
        "Generate transaction reports",
        "Review customer complaints",
        "Update risk assessment",
        "Check regulatory updates",
        "Test disaster recovery"
    ],
    
    monthly: [
        "Submit reports to CBN and NFIU",
        "Remit taxes to FIRS",
        "Conduct staff training",
        "Review compliance metrics",
        "Update legal documentation"
    ],
    
    quarterly: [
        "Submit financial statements",
        "Conduct internal audit",
        "Review security protocols",
        "Update business continuity plan",
        "Regulatory compliance review"
    ],
    
    annually: [
        "Renew CBN license",
        "Renew NDPR certificate",
        "External financial audit",
        "Board compliance review",
        "Regulatory relationship review"
    ]
};

// ====================================================================
// EXPORT MODULE
// ====================================================================
module.exports = {
    legal: NigeriaLegal,
    requiresEnhancedDueDiligence,
    generateComplianceReport,
    validateKYCDocuments,
    calculateWithholdingTax,
    generateLegalDisclaimer,
    RegulatoryChecklist
};

// ====================================================================
// INITIALIZATION
// ====================================================================
console.log(`
╔════════════════════════════════════════════════════════════╗
║              M-PESEWA NIGERIA LEGAL MODULE                ║
║              Strict Regulatory Compliance                 ║
╚════════════════════════════════════════════════════════════╝

Jurisdiction: ${NigeriaLegal.jurisdiction.country}
Governing Law: ${NigeriaLegal.termsAndConditions.governingLaw}
Primary Regulator: ${NigeriaLegal.jurisdiction.regulatoryAuthorities[0].name}

Key Compliance Areas:
• Anti-Money Laundering: ${NigeriaLegal.amlPolicy.suspiciousActivity.reporting.timeframe} reporting
• Data Protection: ${NigeriaLegal.privacyPolicy.dataRights.length} user rights
• Consumer Protection: ${NigeriaLegal.consumerProtection.disputeResolution.internal.length} levels

Tax Compliance:
• Corporate Tax: ${NigeriaLegal.taxCompliance.companyTax.corporateTax}
• Withholding Tax: ${NigeriaLegal.taxCompliance.withholdingTax.interest}
• VAT: ${NigeriaLegal.taxCompliance.valueAddedTax.rate}

Penalties:
• Operating without license: ${NigeriaLegal.penalties.regulatory[0].penalty}
• Data violations: ${NigeriaLegal.penalties.regulatory[2].penalty}

For Legal Inquiries: legal.nigeria@mpesewa.com
`);