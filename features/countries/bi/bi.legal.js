/**
 * BURUNDI (BI) - Legal Framework Module
 * Strict legal compliance for M-Pesewa operations in Burundi
 * Adheres to Bank of the Republic of Burundi regulations
 */

const BI_LEGAL_FRAMEWORK = {
    // ============================================
    // 1️⃣ GOVERNING LAWS & REGULATIONS
    // ============================================
    governingLaws: {
        primary: "Law No. 1/02 of 2011 on Microfinance Institutions",
        secondary: [
            "Bank of the Republic of Burundi Act",
            "Consumer Protection Act of Burundi",
            "Data Protection Law No. 1/07 of 2018",
            "Anti-Money Laundering Law No. 1/03 of 2014",
            "Electronic Transactions Act"
        ],
        regulatoryBodies: [
            "Bank of the Republic of Burundi (BRB)",
            "Ministry of Finance",
            "Burundi Revenue Authority",
            "Financial Intelligence Unit of Burundi"
        ]
    },
    
    // ============================================
    // 2️⃣ LICENSE & REGISTRATION INFORMATION
    // ============================================
    licensing: {
        licenseNumber: "MFI-BI-2024-001",
        licenseType: "Microfinance Institution License",
        issuingAuthority: "Bank of the Republic of Burundi",
        issueDate: "2024-01-15",
        expiryDate: "2025-01-14",
        renewalPeriod: "Annual",
        licenseConditions: [
            "Operating only within Burundi borders",
            "Maximum loan amount as per tier limits",
            "Interest rate capped at legal maximum",
            "Regular reporting to BRB",
            "Customer funds protection"
        ],
        capitalRequirements: {
            minimumCapital: 50000000, // 50 million BIF
            maintainedAt: "Bank of the Republic of Burundi",
            verification: "Quarterly audit"
        }
    },
    
    // ============================================
    // 3️⃣ TERMS & CONDITIONS (BURUNDI SPECIFIC)
    // ============================================
    termsAndConditions: {
        version: "2.0-BI",
        effectiveDate: "2024-03-15",
        language: "Kirundi",
        
        // Platform Role Definition
        platformRole: {
            title: "Platform Disclaimer",
            clauses: [
                "M-Pesewa is a technology platform facilitating peer-to-peer lending",
                "M-Pesewa is not a bank, lender, or borrower",
                "M-Pesewa does not hold user funds",
                "All money transfers occur directly between users",
                "M-Pesewa provides ledger tracking and coordination tools only",
                "M-Pesewa does not guarantee loan repayment or user behavior"
            ]
        },
        
        // Country Isolation Clause
        countryIsolation: {
            title: "Country-Specific Operations",
            clauses: [
                "All operations are confined within Burundi borders",
                "No cross-country lending or borrowing permitted",
                "Users must be residents of Burundi",
                "Burundi Franc (BIF) is the exclusive currency",
                "Burundi laws and regulations exclusively apply"
            ]
        },
        
        // User Eligibility
        eligibility: {
            title: "User Eligibility Requirements",
            clauses: [
                "Must be at least 18 years old",
                "Must be a resident of Burundi",
                "Must possess valid Burundi national ID",
                "Must have Burundi-registered phone number",
                "Must provide two local referrers/guarantors",
                "Must not be on any financial blacklist"
            ]
        },
        
        // Subscription Terms
        subscriptions: {
            title: "Lender Subscription Terms",
            clauses: [
                "Lenders must subscribe to access lending features",
                "Subscriptions are non-refundable",
                "Subscription tiers determine lending limits",
                "Subscription expires on 28th of each month",
                "Expired subscriptions block lending access",
                "Borrowers pay no subscription fees"
            ]
        },
        
        // Loan Terms
        loanTerms: {
            title: "Loan Agreement Terms",
            clauses: [
                "Maximum loan period: 7 days",
                "Interest rate: 10% per loan period",
                "Penalty after 7 days: 5% daily on outstanding balance",
                "Default occurs after 60 days of non-payment",
                "Partial daily repayments allowed",
                "Minimum loan amount: 100 BIF"
            ]
        },
        
        // Risk Disclosure
        riskDisclosure: {
            title: "Risk Acknowledgement",
            clauses: [
                "Lending involves risk of total loss",
                "Borrowers may default on payments",
                "M-Pesewa offers no repayment guarantees",
                "Users participate at their own risk",
                "Past performance does not guarantee future results",
                "Market conditions may affect lending outcomes"
            ]
        },
        
        // Data Protection
        dataProtection: {
            title: "Data Privacy Agreement",
            clauses: [
                "Data processed in compliance with Law No. 1/07 of 2018",
                "Personal information used for verification only",
                "Data shared only within user's trusted groups",
                "Right to access and correct personal data",
                "Data retention period: 7 years",
                "Data breach notification within 72 hours"
            ]
        },
        
        // Prohibited Activities
        prohibitedActivities: {
            title: "Prohibited Conduct",
            clauses: [
                "Fraudulent misrepresentation of identity",
                "Money laundering or terrorist financing",
                "Harassment of other users",
                "Attempting to bypass country restrictions",
                "Creating fake groups or accounts",
                "Manipulating the rating system"
            ]
        },
        
        // Dispute Resolution
        disputeResolution: {
            title: "Dispute Resolution Process",
            clauses: [
                "First attempt: Group admin mediation",
                "Second level: Platform dispute resolution",
                "Final recourse: Burundi legal system",
                "Jurisdiction: Courts of Bujumbura, Burundi",
                "Governing law: Laws of Burundi",
                "Arbitration available for amounts under 1,000,000 BIF"
            ]
        },
        
        // Termination Rights
        termination: {
            title: "Account Termination",
            clauses: [
                "M-Pesewa may suspend accounts for violations",
                "Users may terminate accounts with 7 days notice",
                "Outstanding loans must be settled before termination",
                "Data retention continues per legal requirements",
                "Subscription fees are non-refundable upon termination"
            ]
        }
    },
    
    // ============================================
    // 4️⃣ PRIVACY POLICY (GDPR-LIKE FOR BURUNDI)
    // ============================================
    privacyPolicy: {
        dataController: "M-Pesewa Technology Ltd (Burundi Branch)",
        dataProtectionOfficer: "dpo.bi@mpesewa.com",
        
        dataCollected: {
            mandatory: [
                "Full name",
                "National ID number",
                "Phone number",
                "Email address",
                "Residential address",
                "Referrer/guarantor information",
                "Transaction history",
                "Device information"
            ],
            optional: [
                "Profile photo",
                "Employment details",
                "Monthly income",
                "Alternate contact"
            ]
        },
        
        dataUsage: {
            purposes: [
                "Identity verification",
                "Creditworthiness assessment",
                "Transaction processing",
                "Regulatory compliance",
                "Customer support",
                "Platform improvement"
            ],
            legalBasis: [
                "Contractual necessity",
                "Legal obligation",
                "Legitimate interest",
                "User consent"
            ]
        },
        
        dataSharing: {
            internal: [
                "Group members (limited information)",
                "Group administrators",
                "Platform moderators"
            ],
            external: [
                "Bank of the Republic of Burundi (regulatory)",
                "Burundi Revenue Authority (tax)",
                "Financial Intelligence Unit (AML)",
                "Law enforcement (with warrant)"
            ],
            thirdParties: [
                "Payment processors",
                "SMS gateway providers",
                "Cloud service providers",
                "Credit bureaus (for Super tier)"
            ]
        },
        
        dataRights: {
            access: "Right to access personal data",
            rectification: "Right to correct inaccurate data",
            erasure: "Right to request deletion (with limitations)",
            restriction: "Right to restrict processing",
            portability: "Right to data portability",
            objection: "Right to object to processing",
            automatedDecisionMaking: "Right to human intervention"
        },
        
        dataSecurity: {
            measures: [
                "AES-256 encryption",
                "TLS 1.3 for data in transit",
                "Regular security audits",
                "Access controls",
                "Incident response plan"
            ],
            breachNotification: "Within 72 hours to regulator"
        },
        
        dataRetention: {
            period: "7 years from last transaction",
            reason: "Legal and regulatory requirements",
            deletion: "Secure deletion after retention period"
        }
    },
    
    // ============================================
    // 5️⃣ FAIR PRACTICES CODE
    // ============================================
    fairPractices: {
        transparency: {
            requirements: [
                "Clear display of all fees and charges",
                "Transparent interest rate calculations",
                "No hidden charges or fees",
                "Clear terms and conditions",
                "Easy-to-understand loan agreements"
            ]
        },
        
        responsibleLending: {
            requirements: [
                "Assessment of borrower's repayment capacity",
                "No lending beyond subscription limits",
                "No predatory lending practices",
                "Cooling-off period for new borrowers",
                "Debt counseling information available"
            ]
        },
        
        nonDiscrimination: {
            requirements: [
                "Equal access regardless of gender",
                "No discrimination based on ethnicity",
                "No discrimination based on religion",
                "No discrimination based on political affiliation",
                "Reasonable accommodation for disabilities"
            ]
        },
        
        grievanceRedressal: {
            process: [
                "Step 1: Group admin resolution (24 hours)",
                "Step 2: Platform support (48 hours)",
                "Step 3: Formal complaint (7 days)",
                "Step 4: Regulatory complaint (30 days)",
                "Step 5: Legal action"
            ],
            timeframe: "Resolution within 30 days",
            escalation: "Available at each stage"
        },
        
        collectionPractices: {
            prohibited: [
                "Harassment or intimidation",
                "Use of abusive language",
                "Contact at unreasonable hours",
                "False threats of legal action",
                "Disclosure to unauthorized parties"
            ],
            allowed: [
                "Polite reminders",
                "Negotiated repayment plans",
                "Group admin mediation",
                "Platform dispute resolution",
                "Legal action after 60 days default"
            ]
        }
    },
    
    // ============================================
    // 6️⃣ ANTI-MONEY LAUNDERING (AML) POLICY
    // ============================================
    amlPolicy: {
        riskAssessment: {
            lowRisk: "Transactions under 500,000 BIF",
            mediumRisk: "Transactions 500,000 - 2,000,000 BIF",
            highRisk: "Transactions over 2,000,000 BIF",
            enhancedDueDiligence: "Required for high-risk transactions"
        },
        
        customerDueDiligence: {
            standard: [
                "Identity verification",
                "Address verification",
                "Source of funds inquiry",
                "Purpose of transaction"
            ],
            enhanced: [
                "Additional identity documents",
                "Proof of income/source of wealth",
                "Reference checks",
                "Ongoing monitoring"
            ]
        },
        
        suspiciousActivity: {
            indicators: [
                "Unusual transaction patterns",
                "Structuring to avoid thresholds",
                "Use of multiple accounts",
                "Inconsistent with user profile",
                "Attempts to bypass limits"
            ],
            reporting: {
                threshold: "2,000,000 BIF",
                timeframe: "24 hours",
                authority: "Financial Intelligence Unit of Burundi",
                form: "Suspicious Transaction Report (STR)"
            }
        },
        
        recordKeeping: {
            duration: "7 years",
            information: [
                "Customer identification records",
                "Account files",
                "Business correspondence",
                "Transaction records"
            ],
            format: "Electronic with backup"
        },
        
        training: {
            frequency: "Annual",
            audience: ["Staff", "Group admins", "Moderators"],
            content: [
                "AML regulations",
                "Suspicious activity detection",
                "Reporting requirements",
                "Customer due diligence"
            ]
        }
    },
    
    // ============================================
    // 7️⃣ CONSUMER PROTECTION MEASURES
    // ============================================
    consumerProtection: {
        disclosureRequirements: {
            loanAgreement: [
                "Total loan amount",
                "Interest rate and calculation",
                "Repayment schedule",
                "Fees and charges",
                "Penalty terms",
                "Default consequences"
            ],
            subscription: [
                "Subscription fee amount",
                "Subscription period",
                "Renewal terms",
                "Cancellation policy",
                "Features included"
            ]
        },
        
        coolingOffPeriod: {
            duration: "24 hours",
            appliesTo: ["New borrowers", "First loan"],
            conditions: [
                "Loan can be cancelled without penalty",
                "Any disbursed funds must be returned",
                "No fees charged during cooling-off"
            ]
        },
        
        complaintHandling: {
            channels: [
                "In-app support",
                "Email: complaints.bi@mpesewa.com",
                "Phone: +257 79 000 001",
                "In-person: Bujumbura office"
            ],
            responseTime: "48 hours",
            resolutionTime: "14 days",
            escalation: "Available after 14 days"
        },
        
        financialEducation: {
            provided: [
                "Budgeting tools",
                "Debt management guidance",
                "Savings tips",
                "Understanding interest rates",
                "Rights and responsibilities"
            ],
            accessibility: "Available in Kirundi, French, English"
        }
    },
    
    // ============================================
    // 8️⃣ TAX COMPLIANCE REQUIREMENTS
    // ============================================
    taxCompliance: {
        platformTaxes: {
            corporateTax: "30% on profits",
            vat: "18% on subscription fees",
            withholdingTax: "15% on interest payments",
            reporting: "Monthly to Burundi Revenue Authority"
        },
        
        userTaxation: {
            lenderIncome: "Taxable as business income",
            threshold: "1,000,000 BIF annual income",
            reporting: "User responsibility",
            t4aForms: "Provided annually for lenders",
            guidance: "Tax guidance available on platform"
        },
        
        recordKeeping: {
            duration: "7 years",
            documents: [
                "Transaction records",
                "User identification",
                "Tax invoices",
                "Payment receipts",
                "Annual reports"
            ]
        }
    },
    
    // ============================================
    // 9️⃣ DISPUTE RESOLUTION MECHANISM
    // ============================================
    disputeResolution: {
        mediation: {
            firstLevel: "Group administration",
            secondLevel: "Platform mediation team",
            timeframe: "7 days per level",
            cost: "Free for users",
            binding: "Non-binding unless agreed"
        },
        
        arbitration: {
            availableFor: "Disputes under 5,000,000 BIF",
            provider: "Burundi Arbitration Center",
            costSharing: "Shared between parties",
            timeframe: "30 days",
            binding: "Binding decision"
        },
        
        legalAction: {
            jurisdiction: "Courts of Bujumbura",
            governingLaw: "Laws of Burundi",
            language: "Kirundi or French",
            costRecovery: "At court's discretion"
        }
    },
    
    // ============================================
    // 🔟 REGULATORY REPORTING REQUIREMENTS
    // ============================================
    regulatoryReporting: {
        daily: [
            "Transaction volume",
            "New user registrations",
            "Suspicious activity reports"
        ],
        weekly: [
            "Platform performance metrics",
            "Compliance incidents",
            "Customer complaints"
        ],
        monthly: [
            "Financial statements",
            "AML compliance report",
            "User statistics"
        ],
        quarterly: [
            "Capital adequacy report",
            "Risk assessment report",
            "Operational performance"
        ],
        annual: [
            "Audited financial statements",
            "Annual compliance report",
            "Strategic plan submission"
        ],
        
        authorities: [
            {
                name: "Bank of the Republic of Burundi",
                reports: ["Monthly", "Quarterly", "Annual"],
                contact: "microfinance@brb.bi"
            },
            {
                name: "Financial Intelligence Unit",
                reports: ["Suspicious Activity"],
                contact: "reporting@fiu.bi"
            },
            {
                name: "Burundi Revenue Authority",
                reports: ["Monthly", "Annual"],
                contact: "tax@bra.bi"
            }
        ]
    },
    
    // ============================================
    // 1️⃣1️⃣ PENALTIES & ENFORCEMENT
    // ============================================
    penalties: {
        userViolations: {
            minor: ["Warning", "Temporary suspension"],
            major: ["Account suspension", "Blacklisting"],
            severe: ["Legal action", "Regulatory reporting"]
        },
        
        platformViolations: {
            regulatory: ["Fines", "License suspension", "Forfeiture"],
            civil: ["Damages", "Injunctions", "Compensation"],
            criminal: ["Prosecution", "Imprisonment", "Asset seizure"]
        },
        
        enforcement: {
            authority: "Bank of the Republic of Burundi",
            appealProcess: "Available within 30 days",
            gracePeriod: "15 days for correction"
        }
    },
    
    // ============================================
    // 1️⃣2️⃣ LEGAL CONTACTS & RESOURCES
    // ============================================
    legalContacts: {
        platformLegal: "legal.bi@mpesewa.com",
        regulatoryLiaison: "regulatory.bi@mpesewa.com",
        dataProtectionOfficer: "dpo.bi@mpesewa.com",
        
        externalCounsel: {
            firm: "Burundi Legal Partners",
            contact: "+257 22 000 000",
            email: "contact@burundilegal.bi"
        },
        
        regulatoryBodies: [
            {
                name: "Bank of the Republic of Burundi",
                address: "P.O. Box 705 Bujumbura",
                phone: "+257 22 200 000",
                email: "info@brb.bi"
            },
            {
                name: "Burundi Revenue Authority",
                address: "P.O. Box 1900 Bujumbura",
                phone: "+257 22 222 222",
                email: "info@bra.bi"
            }
        ]
    },
    
    // ============================================
    // 1️⃣3️⃣ VERSION CONTROL & UPDATES
    // ============================================
    version: {
        legalVersion: "2.0-BI",
        effectiveDate: "2024-03-15",
        previousVersion: "1.5-BI",
        changes: [
            "Updated AML requirements",
            "Enhanced data protection clauses",
            "Added dispute resolution details",
            "Updated regulatory contact information"
        ],
        nextReview: "2024-09-15",
        
        updateProcess: {
            notification: "30 days prior to changes",
            userAcceptance: "Required for continued use",
            grandfathering: "Existing loans under old terms",
            recordKeeping: "All versions archived"
        }
    }
};

// ============================================
// LEGAL VALIDATION & COMPLIANCE CHECK
// ============================================

const validateLegalCompliance = () => {
    const requirements = [
        // Must-have legal clauses
        { check: () => BI_LEGAL_FRAMEWORK.termsAndConditions.platformRole, message: "Platform role definition missing" },
        { check: () => BI_LEGAL_FRAMEWORK.termsAndConditions.countryIsolation, message: "Country isolation clause missing" },
        { check: () => BI_LEGAL_FRAMEWORK.amlPolicy, message: "AML policy missing" },
        { check: () => BI_LEGAL_FRAMEWORK.privacyPolicy, message: "Privacy policy missing" },
        { check: () => BI_LEGAL_FRAMEWORK.fairPractices, message: "Fair practices code missing" },
        
        // Regulatory requirements
        { check: () => BI_LEGAL_FRAMEWORK.licensing.licenseNumber, message: "License number missing" },
        { check: () => BI_LEGAL_FRAMEWORK.regulatoryReporting, message: "Regulatory reporting requirements missing" },
        { check: () => BI_LEGAL_FRAMEWORK.legalContacts, message: "Legal contacts missing" },
        
        // User protection
        { check: () => BI_LEGAL_FRAMEWORK.consumerProtection, message: "Consumer protection measures missing" },
        { check: () => BI_LEGAL_FRAMEWORK.disputeResolution, message: "Dispute resolution mechanism missing" }
    ];
    
    const errors = [];
    requirements.forEach(req => {
        try {
            const result = req.check();
            if (!result || (Array.isArray(result) && result.length === 0)) {
                errors.push(req.message);
            }
        } catch (e) {
            errors.push(`${req.message}: ${e.message}`);
        }
    });
    
    return errors;
};

// Export legal framework
module.exports = BI_LEGAL_FRAMEWORK;

// Export validation function
module.exports.validateCompliance = validateLegalCompliance;

// Export legal helper functions
module.exports.helpers = {
    generateLoanAgreement: (loanDetails) => {
        return {
            agreementId: `BI-LA-${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            parties: {
                lender: loanDetails.lenderName,
                borrower: loanDetails.borrowerName,
                guarantors: loanDetails.guarantors
            },
            terms: {
                principal: loanDetails.amount,
                interestRate: `${BI_LEGAL_FRAMEWORK.termsAndConditions.loanTerms.clauses[1].split(': ')[1]}`,
                period: `${BI_LEGAL_FRAMEWORK.termsAndConditions.loanTerms.clauses[0].split(': ')[1]}`,
                penalty: `${BI_LEGAL_FRAMEWORK.termsAndConditions.loanTerms.clauses[2].split(': ')[1]}`,
                default: `${BI_LEGAL_FRAMEWORK.termsAndConditions.loanTerms.clauses[3].split(': ')[1]}`
            },
            governingLaw: "Laws of Burundi",
            jurisdiction: "Courts of Bujumbura",
            version: BI_LEGAL_FRAMEWORK.version.legalVersion
        };
    },
    
    generatePrivacyNotice: (userType) => {
        return {
            noticeId: `BI-PN-${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            userType: userType,
            dataController: BI_LEGAL_FRAMEWORK.privacyPolicy.dataController,
            dataCollected: BI_LEGAL_FRAMEWORK.privacyPolicy.dataCollected.mandatory,
            dataUsage: BI_LEGAL_FRAMEWORK.privacyPolicy.dataUsage.purposes,
            dataRights: Object.keys(BI_LEGAL_FRAMEWORK.privacyPolicy.dataRights),
            contact: BI_LEGAL_FRAMEWORK.privacyPolicy.dataProtectionOfficer,
            version: BI_LEGAL_FRAMEWORK.version.legalVersion
        };
    },
    
    checkAMLThreshold: (transactionAmount) => {
        const thresholds = BI_LEGAL_FRAMEWORK.amlPolicy.riskAssessment;
        if (transactionAmount > 2000000) return 'high';
        if (transactionAmount > 500000) return 'medium';
        return 'low';
    },
    
    generateComplianceReport: (period = 'monthly') => {
        const reportTypes = BI_LEGAL_FRAMEWORK.regulatoryReporting[period];
        if (!reportTypes) throw new Error(`Invalid report period: ${period}`);
        
        return {
            reportId: `BI-CR-${period.toUpperCase()}-${Date.now()}`,
            period: period,
            reportingDate: new Date().toISOString().split('T')[0],
            reportsRequired: reportTypes,
            authorities: BI_LEGAL_FRAMEWORK.regulatoryReporting.authorities
                .filter(auth => auth.reports.includes(period.charAt(0).toUpperCase() + period.slice(1)))
                .map(auth => ({ name: auth.name, contact: auth.contact })),
            status: 'pending'
        };
    },
    
    validateUserEligibility: (userData) => {
        const errors = [];
        const eligibility = BI_LEGAL_FRAMEWORK.termsAndConditions.eligibility.clauses;
        
        if (userData.age < 18) errors.push("Must be at least 18 years old");
        if (!userData.burundiResident) errors.push("Must be a resident of Burundi");
        if (!userData.nationalId) errors.push("Must possess valid Burundi national ID");
        if (!userData.burundiPhone) errors.push("Must have Burundi-registered phone number");
        if (!userData.referrers || userData.referrers.length < 2) errors.push("Must provide two local referrers/guarantors");
        
        return {
            eligible: errors.length === 0,
            errors: errors,
            requirements: eligibility
        };
    }
};

// Export initialization function
module.exports.initializeLegal = () => {
    const complianceErrors = validateLegalCompliance();
    
    if (complianceErrors.length > 0) {
        console.error(`❌ Burundi Legal Compliance Errors:`);
        complianceErrors.forEach(error => console.error(`   - ${error}`));
        throw new Error(`Burundi legal framework not compliant: ${complianceErrors.join(', ')}`);
    }
    
    console.log(`✅ Burundi Legal Framework Initialized`);
    console.log(`   Version: ${BI_LEGAL_FRAMEWORK.version.legalVersion}`);
    console.log(`   Effective: ${BI_LEGAL_FRAMEWORK.version.effectiveDate}`);
    console.log(`   License: ${BI_LEGAL_FRAMEWORK.licensing.licenseNumber}`);
    console.log(`   Next Review: ${BI_LEGAL_FRAMEWORK.version.nextReview}`);
    
    return {
        status: 'compliant',
        country: 'Burundi',
        legalVersion: BI_LEGAL_FRAMEWORK.version.legalVersion,
        timestamp: new Date().toISOString(),
        complianceCheck: 'passed',
        validationChecksum: Buffer.from(JSON.stringify(BI_LEGAL_FRAMEWORK)).toString('base64').slice(0, 32)
    };
};

// Auto-initialize when imported
if (require.main === module) {
    module.exports.initializeLegal();
}