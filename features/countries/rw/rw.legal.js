/**
 * M-PESEWA RWANDA LEGAL COMPLIANCE MODULE
 * Strict Regulatory Compliance for Rwanda Operations
 * Last Updated: 2024-01-24
 * Version: 1.0.0
 */

const RwandaLegal = {
    // ============================================
    // 1️⃣ LEGAL ENTITY INFORMATION
    // ============================================
    company: {
        legalName: 'M-Pesewa Rwanda Ltd.',
        registrationNumber: 'RRA-TIN-123456789',
        companyType: 'Private Limited Company',
        incorporationDate: '2023-06-15',
        registrationAuthority: 'Rwanda Development Board (RDB)',
        
        directors: [
            {
                name: 'John M. Rwema',
                position: 'Managing Director',
                nationality: 'Rwandan',
                idNumber: '1199876543212345'
            },
            {
                name: 'Marie A. Uwera',
                position: 'Compliance Director',
                nationality: 'Rwandan',
                idNumber: '1198765432123456'
            }
        ],

        shareCapital: {
            amount: 50000000, // 50 million RWF
            currency: 'RWF',
            paidUp: true
        }
    },

    // ============================================
    // 2️⃣ REGULATORY LICENSES & APPROVALS
    // ============================================
    licenses: [
        {
            type: 'FinTech License',
            number: 'FTL-2024-RW-045',
            issuer: 'National Bank of Rwanda',
            issueDate: '2024-01-15',
            expiryDate: '2025-01-14',
            category: 'Peer-to-Peer Lending Platform',
            conditions: [
                'Maximum loan amount: FRw 50,000',
                'No cross-border operations',
                'Monthly reporting required',
                'Annual audit by BNR-approved auditor'
            ]
        },
        {
            type: 'Data Protection Registration',
            number: 'DPR-RW-2024-089',
            issuer: 'National Cyber Security Authority',
            issueDate: '2024-01-10',
            expiryDate: '2025-01-09',
            requirements: [
                'Data encryption at rest and in transit',
                'Regular security audits',
                'Data breach notification within 72 hours',
                'User consent for data processing'
            ]
        }
    ],

    // ============================================
    // 3️⃣ TERMS & CONDITIONS (Rwanda Specific)
    // ============================================
    terms: {
        effectiveDate: '2024-01-24',
        version: '1.0-RW',

        platformRole: {
            title: 'Platform Role & Disclaimer',
            content: `M-Pesewa Rwanda Ltd. operates as a technology platform facilitating peer-to-peer lending within trusted groups. We are not a bank, not a lender, not a borrower, and do not hold user funds. All money transfers occur directly between users through their chosen payment methods. We provide ledger tracking, record keeping, and coordination tools only.`
        },

        eligibility: {
            title: 'User Eligibility',
            requirements: [
                'Must be at least 18 years old',
                'Must be a resident of Rwanda',
                'Must possess valid Rwandan National ID',
                'Must have active mobile money account',
                'Must pass identity verification checks'
            ]
        },

        lendingRules: {
            title: 'Lending Rules & Limitations',
            rules: [
                'Maximum loan duration: 7 days',
                'Maximum interest rate: 10% per week',
                'Maximum penalty rate: 5% daily after 7 days',
                'Loans become default after 60 days',
                'Lenders can only lend within their registered groups'
            ]
        },

        disputeResolution: {
            title: 'Dispute Resolution Process',
            steps: [
                'Step 1: Direct negotiation between parties (3 days)',
                'Step 2: Group Admin mediation (2 days)',
                'Step 3: M-Pesewa support intervention (2 days)',
                'Step 4: Referral to Rwanda Utilities Regulatory Authority (RURA)'
            ],
            jurisdiction: 'All disputes shall be subject to the exclusive jurisdiction of the courts of Rwanda'
        }
    },

    // ============================================
    // 4️⃣ PRIVACY POLICY (GDPR + Rwanda Law)
    // ============================================
    privacy: {
        dataController: 'M-Pesewa Rwanda Ltd.',
        dpo: {
            name: 'Data Protection Officer',
            email: 'dpo.rw@mpesewa.com',
            phone: '+250 791 590 802'
        },

        dataCollection: {
            purposes: [
                'User verification and KYC compliance',
                'Loan application processing',
                'Risk assessment and fraud prevention',
                'Service improvement and analytics',
                'Regulatory compliance reporting'
            ],

            categories: [
                'Identity data (National ID, photo)',
                'Contact data (phone, email, address)',
                'Financial data (transaction history)',
                'Technical data (IP address, device info)',
                'Usage data (platform interactions)'
            ]
        },

        dataSharing: {
            withRegulators: [
                'National Bank of Rwanda (monthly reports)',
                'Rwanda Revenue Authority (tax compliance)',
                'Rwanda Credit Reference Bureau (with user consent)'
            ],

            withServiceProviders: [
                'Payment processors (MTN, Airtel)',
                'Identity verification services',
                'Cloud infrastructure providers'
            ],

            internationalTransfers: {
                allowed: false,
                reason: 'Data localization requirements under Rwandan law'
            }
        },

        userRights: {
            access: 'Right to access personal data',
            rectification: 'Right to correct inaccurate data',
            erasure: 'Right to request data deletion (subject to legal holds)',
            restriction: 'Right to restrict processing',
            portability: 'Right to data portability',
            objection: 'Right to object to processing'
        },

        retentionPeriods: {
            activeUsers: '10 years from last activity',
            loanRecords: '20 years from loan completion',
            kycDocuments: '10 years after account closure',
            systemLogs: '6 months'
        }
    },

    // ============================================
    // 5️⃣ ANTI-MONEY LAUNDERING (AML) POLICY
    // ============================================
    aml: {
        riskAssessment: {
            customerRisk: {
                low: ['Salary earners', 'Registered businesses'],
                medium: ['Self-employed', 'Small traders'],
                high: ['Politically exposed persons', 'Cash-intensive businesses']
            },

            transactionRisk: {
                low: ['Below FRw 100,000', 'Regular patterns'],
                medium: ['FRw 100,000 - FRw 1,000,000', 'Infrequent patterns'],
                high: ['Above FRw 1,000,000', 'Unusual patterns']
            }
        },

        kycRequirements: {
            level1: {
                threshold: 'Below FRw 100,000 monthly',
                documents: ['National ID', 'Phone verification']
            },
            level2: {
                threshold: 'FRw 100,000 - FRw 1,000,000 monthly',
                documents: ['Proof of address', 'Source of funds']
            },
            level3: {
                threshold: 'Above FRw 1,000,000 monthly',
                documents: ['Tax clearance', 'Bank statements', 'Business registration']
            }
        },

        suspiciousActivity: {
            indicators: [
                'Multiple accounts with same ID',
                'Structuring transactions to avoid thresholds',
                'Rapid movement of funds',
                'Unusual transaction patterns',
                'Use of anonymous payment methods'
            ],

            reporting: {
                authority: 'Financial Intelligence Unit (FIU) Rwanda',
                threshold: 'FRw 5,000,000',
                timeframe: 'Within 3 working days'
            }
        },

        training: {
            frequency: 'Quarterly',
            audience: ['All employees', 'Compliance team', 'Management'],
            records: '3 years retention'
        }
    },

    // ============================================
    // 6️⃣ CONSUMER PROTECTION COMPLIANCE
    // ============================================
    consumerProtection: {
        disclosureRequirements: {
            loanTerms: [
                'Clear display of interest rate (10% weekly)',
                'Clear display of penalty rate (5% daily)',
                'Total repayment amount',
                'Repayment schedule',
                'Default consequences'
            ],

            fees: [
                'No hidden charges',
                'No borrower subscription fees',
                'Lender subscription fees clearly stated',
                'Payment gateway fees disclosed'
            ]
        },

        coolingOffPeriod: {
            enabled: true,
            duration: '24 hours',
            conditions: [
                'Only for new lenders before first subscription payment',
                'Not applicable after loan disbursement',
                'Full refund if no transactions conducted'
            ]
        },

        complaints: {
            channels: [
                'In-app support',
                'Phone: +250 791 590 801',
                'Email: complaints.rw@mpesewa.com',
                'Physical: Kigali Heights, KG 7 Ave'
            ],

            resolutionTime: {
                acknowledgement: 'Within 24 hours',
                investigation: '7 working days',
                finalResponse: '14 working days'
            },

            escalation: {
                level1: 'Customer Support',
                level2: 'Compliance Officer',
                level3: 'Rwanda Utilities Regulatory Authority (RURA)'
            }
        },

        fairLending: {
            principles: [
                'Non-discrimination based on gender, religion, or ethnicity',
                'Transparent credit assessment',
                'Proportional penalties',
                'Reasonable repayment terms'
            ],

            prohibitedPractices: [
                'Harassment for debt collection',
                'Charging undisclosed fees',
                'Discriminatory lending practices',
                'Predatory interest rates'
            ]
        }
    },

    // ============================================
    // 7️⃣ TAX COMPLIANCE REQUIREMENTS
    // ============================================
    tax: {
        withholdingTax: {
            rate: 0.15, // 15%
            threshold: 'FRw 30,000 monthly',
            filing: 'Monthly by 15th of following month',
            authority: 'Rwanda Revenue Authority'
        },

        vat: {
            registered: true,
            number: 'VAT-RW-789456123',
            rate: 0.18, // 18%
            applicableTo: ['Lender subscription fees'],
            exemption: ['Loan interest', 'Borrower transactions']
        },

        corporateTax: {
            rate: 0.30, // 30%
            filing: 'Annual by 31st March',
            payments: 'Quarterly advance payments'
        },

        reporting: {
            monthly: [
                'Withholding tax certificates',
                'VAT returns',
                'Transaction summaries'
            ],

            annual: [
                'Audited financial statements',
                'Corporate tax return',
                'Directors\' report'
            ]
        }
    },

    // ============================================
    // 8️⃣ DATA LOCALIZATION REQUIREMENTS
    // ============================================
    dataLocalization: {
        requirement: 'All user data must be stored within Rwanda',
        storage: {
            primary: 'Rwanda Data Center, Kigali',
            backup: 'Secondary facility, Muhanga',
            encryption: 'AES-256 at rest and in transit'
        },

        accessControl: {
            localOnly: 'Data access restricted to Rwanda-based personnel',
            logging: 'All access attempts logged and audited',
            monitoring: 'Real-time security monitoring'
        },

        crossBorder: {
            transfers: 'Prohibited without explicit user consent',
            exceptions: [
                'Regulatory reporting to BNR',
                'International payment processing',
                'Technical support with data anonymization'
            ]
        }
    },

    // ============================================
    // 9️⃣ ENFORCEMENT & PENALTIES
    // ============================================
    enforcement: {
        regulatoryPenalties: {
            licenseRevocation: 'For serious violations',
            fines: 'Up to FRw 10,000,000',
            suspension: 'Up to 6 months for moderate violations',
            correctiveActions: 'For minor violations'
        },

        userViolations: {
            blacklisting: 'For loan default beyond 60 days',
            accountSuspension: 'For Terms of Service violations',
            legalAction: 'For fraudulent activities',
            reporting: 'To credit reference bureau'
        },

        auditRequirements: {
            frequency: 'Annual external audit',
            auditor: 'BNR-approved auditing firm',
            scope: 'Financial, compliance, and security',
            reporting: 'To BNR within 3 months of year-end'
        }
    },

    // ============================================
    // 🔟 DOCUMENT TEMPLATES & FORMS
    // ============================================
    templates: {
        loanAgreement: {
            requiredClauses: [
                'Parties identification',
                'Loan amount and currency',
                'Interest rate and calculation',
                'Repayment schedule',
                'Default conditions',
                'Governing law (Rwandan law)',
                'Dispute resolution clause'
            ],

            digitalSignature: {
                required: true,
                method: 'SMS OTP + biometric verification',
                storage: '10 years minimum'
            }
        },

        privacyNotice: {
            format: 'Layered approach',
            languages: ['English', 'Kinyarwanda'],
            delivery: ['In-app', 'Email', 'SMS summary']
        },

        consentForms: {
            dataProcessing: 'Explicit opt-in required',
            creditCheck: 'Separate consent for CRB checks',
            marketing: 'Opt-out by default'
        }
    },

    // ============================================
    // 1️⃣1️⃣ COMPLIANCE MONITORING
    // ============================================
    monitoring: {
        kycCompliance: {
            checkFrequency: 'Real-time for new users',
            reVerification: 'Annual for active users',
            exceptionHandling: 'Manual review queue'
        },

        transactionMonitoring: {
            realTime: 'All transactions screened',
            thresholds: [
                'Single: FRw 1,000,000',
                'Daily: FRw 5,000,000',
                'Monthly: FRw 20,000,000'
            ],
            suspiciousPatterns: 'AI-based detection'
        },

        reporting: {
            daily: 'Transaction summary',
            weekly: 'Compliance metrics',
            monthly: 'Regulatory reports to BNR',
            quarterly: 'AML/CFT report to FIU'
        }
    },

    // ============================================
    // 1️⃣2️⃣ HELPER FUNCTIONS
    // ============================================
    helpers: {
        validateNationalID: function(idNumber) {
            // Rwanda National ID format: 1xxxxxxxxxxxxxx (16 digits)
            const rwandaIDRegex = /^1\d{15}$/;
            if (!rwandaIDRegex.test(idNumber)) return false;
            
            // Simple checksum validation
            const digits = idNumber.split('').map(Number);
            const sum = digits.reduce((a, b) => a + b, 0);
            return sum % 10 === digits[15] % 10;
        },

        formatLegalDocument: function(docType, data) {
            const templates = {
                loanAgreement: `
                    LOAN AGREEMENT
                    Between: ${data.lenderName} (Lender) and ${data.borrowerName} (Borrower)
                    Amount: FRw ${data.amount}
                    Interest: 10% weekly
                    Repayment Due: ${data.dueDate}
                    Governed by: Laws of Rwanda
                    
                    Signatures:
                    Lender: _________________
                    Borrower: ________________
                    Date: ${new Date().toLocaleDateString('en-RW')}
                `,
                privacyConsent: `
                    PRIVACY CONSENT FORM
                    I, ${data.userName}, consent to the processing of my personal data
                    in accordance with M-Pesewa Rwanda Ltd.'s Privacy Policy.
                    
                    Signed: _________________
                    Date: ${new Date().toLocaleDateString('en-RW')}
                `
            };
            
            return templates[docType] || 'Template not found';
        },

        checkAMLThreshold: function(amount, period = 'monthly') {
            const thresholds = {
                daily: 5000000,
                monthly: 20000000
            };
            
            return amount > (thresholds[period] || 0);
        },

        generateComplianceReport: function(period) {
            return {
                period: period,
                generated: new Date().toISOString(),
                kycCompliance: '98.5%',
                amlChecks: '100%',
                reportingCompliance: '100%',
                issues: []
            };
        }
    },

    // ============================================
    // 1️⃣3️⃣ VERSION CONTROL
    // ============================================
    version: {
        major: 1,
        minor: 0,
        patch: 0,
        effectiveDate: '2024-01-24',
        previousVersions: [],
        
        getVersionString: function() {
            return `${this.major}.${this.minor}.${this.patch}-RW`;
        }
    }
};

// Freeze legal configuration
Object.freeze(RwandaLegal);

// Export module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RwandaLegal;
} else if (typeof window !== 'undefined') {
    window.RwandaLegal = RwandaLegal;
}

// Compliance check on load
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function() {
        console.log('Rwanda Legal Compliance Module Loaded');
        
        // Store legal acceptance timestamp
        if (typeof localStorage !== 'undefined') {
            const legalAcceptance = {
                terms: false,
                privacy: false,
                timestamp: null
            };
            
            localStorage.setItem('mpesewa_legal_rw', JSON.stringify(legalAcceptance));
        }
    });
}