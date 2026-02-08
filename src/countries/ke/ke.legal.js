/**
 * M-PESEWA KENYA LEGAL COMPLIANCE 🇰🇪
 * Legal requirements, terms, and compliance for Kenya
 * STRICT ENFORCEMENT: All operations must comply with Kenyan law
 */

const KenyaLegal = {
    // ============================================================================
    // 1️⃣ TERMS OF SERVICE (KENYA-SPECIFIC)
    // ============================================================================
    termsOfService: {
        effectiveDate: '2024-01-01',
        version: '3.0.0',
        
        // Platform role
        platformRole: {
            title: 'Platform Role and Limitation of Liability',
            clauses: [
                'M-Pesewa is a technology platform that connects lenders and borrowers within trusted circles.',
                'M-Pesewa is not a bank, financial institution, or lender.',
                'M-Pesewa does not hold user funds at any point.',
                'All financial transactions occur directly between users through their preferred payment methods.',
                'M-Pesewa provides ledger management, reputation tracking, and group coordination tools.',
                'M-Pesewa does not guarantee loan repayment, performance, or user behavior.'
            ]
        },
        
        // User eligibility
        eligibility: {
            title: 'Eligibility Requirements',
            requirements: [
                'Must be at least 18 years old (legal age in Kenya)',
                'Must have legal capacity to enter into contracts',
                'Must be a resident of Kenya with valid Kenyan identification',
                'Must have an active mobile phone number registered in Kenya',
                'Must not be on any financial services blacklist',
                'Must comply with all Kenyan laws and regulations'
            ]
        },
        
        // Country-specific rules
        countryRules: {
            title: 'Kenya-Specific Rules',
            rules: [
                'All transactions must be in Kenyan Shillings (KES)',
                'Users can only transact within Kenyan groups',
                'Cross-border lending or borrowing is strictly prohibited',
                'All users must provide valid Kenyan identification',
                'Lenders must comply with Central Bank of Kenya regulations',
                'Platform operations must adhere to Data Protection Act, 2019'
            ]
        },
        
        // Subscription terms
        subscriptionTerms: {
            title: 'Subscription Terms for Lenders',
            terms: [
                'Lenders must select and pay for a subscription tier',
                'Subscription fees are non-refundable',
                'Subscriptions expire on the 28th of each month',
                'Expired subscriptions block lending access',
                'Lenders cannot exceed their tier\'s weekly lending limit',
                'Tier upgrades/downgrades take effect immediately upon payment'
            ]
        },
        
        // Loan agreements
        loanAgreements: {
            title: 'Loan Agreement Terms',
            terms: [
                'All loans are private agreements between users',
                'Standard interest rate is 10% per week (7 days)',
                'Maximum loan duration is 7 days',
                'Partial repayments are allowed',
                'Penalty of 5% daily applies after 7 days',
                'Loan defaults after 60 days (2 months)',
                'Defaulted loans result in blacklisting'
            ]
        },
        
        // Dispute resolution
        disputeResolution: {
            title: 'Dispute Resolution Process',
            process: [
                'Users must attempt to resolve disputes directly first',
                'Unresolved disputes can be escalated to group admin',
                'Group admin decisions are binding for group matters',
                'Platform disputes are resolved by M-Pesewa support',
                'Legal disputes are subject to Kenyan courts',
                'Jurisdiction: Courts of Kenya, Nairobi'
            ]
        },
        
        // Termination
        termination: {
            title: 'Account Termination',
            conditions: [
                'Violation of terms results in immediate suspension',
                'Repeated defaults lead to permanent blacklisting',
                'Fraudulent activity results in account termination',
                'Users may voluntarily terminate accounts',
                'Terminated accounts lose access to all platform features',
                'Outstanding obligations remain enforceable'
            ]
        }
    },
    
    // ============================================================================
    // 2️⃣ PRIVACY POLICY (DATA PROTECTION ACT, 2019 COMPLIANT)
    // ============================================================================
    privacyPolicy: {
        effectiveDate: '2024-01-01',
        dpaCompliance: true,
        registrationNumber: 'DPA/xxxx/xxxx',
        
        // Data collection
        dataCollection: {
            title: 'Data We Collect',
            personalData: [
                'Full name and contact information',
                'National ID number and copy',
                'Mobile phone number and verification',
                'Email address',
                'Location data (with consent)',
                'Transaction history',
                'Device information',
                'Behavioral data'
            ],
            
            sensitiveData: {
                collected: [
                    'Financial transaction patterns',
                    'Creditworthiness information',
                    'Blacklist status'
                ],
                notCollected: [
                    'Biometric data (unless voluntarily provided)',
                    'Health information',
                    'Political affiliations',
                    'Religious beliefs'
                ]
            }
        },
        
        // Data usage
        dataUsage: {
            title: 'How We Use Your Data',
            purposes: [
                'Account creation and verification',
                'Transaction processing and record keeping',
                'Creditworthiness assessment',
                'Risk management and fraud prevention',
                'Customer support and dispute resolution',
                'Platform improvement and analytics',
                'Regulatory compliance reporting',
                'Personalized user experience'
            ]
        },
        
        // Data sharing
        dataSharing: {
            title: 'Data Sharing and Third Parties',
            sharedWith: [
                {
                    entity: 'Credit Reference Bureaus',
                    purpose: 'Creditworthiness assessment',
                    consent: 'Explicit consent required',
                    legalBasis: 'Credit Reference Bureau Regulations'
                },
                {
                    entity: 'Regulatory Authorities',
                    purpose: 'Compliance reporting',
                    consent: 'Not required (legal obligation)',
                    legalBasis: 'Central Bank of Kenya Regulations'
                },
                {
                    entity: 'Payment Processors',
                    purpose: 'Transaction processing',
                    consent: 'Implicit through use',
                    legalBasis: 'Contractual necessity'
                },
                {
                    entity: 'Group Members',
                    purpose: 'Transaction visibility',
                    consent: 'Implicit through group membership',
                    legalBasis: 'Legitimate interest'
                }
            ],
            
            notSharedWith: [
                'Unauthorized third parties',
                'Marketing companies (without consent)',
                'International organizations (except as required by law)',
                'Political organizations'
            ]
        },
        
        // Data protection
        dataProtection: {
            title: 'Data Protection Measures',
            measures: [
                'End-to-end encryption for all communications',
                'Secure storage with AES-256 encryption',
                'Regular security audits and penetration testing',
                'Access controls and role-based permissions',
                'Data minimization principles',
                'Regular staff training on data protection',
                'Incident response plan',
                'Data protection impact assessments'
            ],
            
            retentionPeriods: {
                accountData: '7 years after account closure',
                transactionData: '7 years',
                logData: '2 years',
                marketingData: '2 years after last contact'
            }
        },
        
        // User rights
        userRights: {
            title: 'Your Data Protection Rights',
            rights: [
                {
                    right: 'Right to Access',
                    description: 'Request copies of your personal data',
                    process: 'Submit request through account settings'
                },
                {
                    right: 'Right to Rectification',
                    description: 'Request correction of inaccurate data',
                    process: 'Update profile or submit correction request'
                },
                {
                    right: 'Right to Erasure',
                    description: 'Request deletion of personal data',
                    process: 'Submit deletion request (subject to legal retention)'
                },
                {
                    right: 'Right to Restrict Processing',
                    description: 'Request restriction of data processing',
                    process: 'Submit restriction request through support'
                },
                {
                    right: 'Right to Data Portability',
                    description: 'Request transfer of data to another organization',
                    process: 'Submit portability request'
                },
                {
                    right: 'Right to Object',
                    description: 'Object to processing of personal data',
                    process: 'Submit objection through account settings'
                }
            ],
            
            contact: {
                dataProtectionOfficer: 'dpo@mpesewa.co.ke',
                responseTime: '30 days',
                noFee: 'First request is free'
            }
        }
    },
    
    // ============================================================================
    // 3️⃣ FINANCIAL REGULATIONS (CENTRAL BANK OF KENYA)
    // ============================================================================
    financialRegulations: {
        // Digital Credit Provider Regulations
        dcpRegulations: {
            license: {
                type: 'Digital Credit Provider',
                number: 'DCP/xxxx/xxxx',
                issuer: 'Central Bank of Kenya',
                validity: '2024-12-31',
                requirements: [
                    'Minimum capital requirement: KES 10,000,000',
                    'Fit and proper test for directors',
                    'Adequate risk management framework',
                    'Consumer protection measures',
                    'Data protection compliance',
                    'Anti-money laundering program'
                ]
            },
            
            lendingLimits: {
                maximumLoanAmount: 'KES 500,000',
                maximumInterestRate: 'As per CBK guidelines',
                maximumDefaultFee: 'Reasonable and justified',
                coolingOffPeriod: '7 days',
                disclosureRequirements: 'Full transparency'
            },
            
            consumerProtection: {
                fairLending: 'Non-discriminatory practices',
                transparency: 'Clear terms and conditions',
                complaints: 'Established grievance mechanism',
                education: 'Financial literacy materials',
                privacy: 'Data protection compliance'
            }
        },
        
        // Anti-Money Laundering (POCAMLA)
        amlRegulations: {
            reportingEntity: 'Financial Reporting Centre (FRC)',
            registrationNumber: 'FRC/xxxx/xxxx',
            
            requirements: [
                'Customer Due Diligence (CDD)',
                'Enhanced Due Diligence for high-risk customers',
                'Transaction monitoring and reporting',
                'Suspicious Transaction Reporting (STR)',
                'Record keeping for 7 years',
                'Staff training on AML/CFT'
            ],
            
            thresholds: {
                cddRequired: 'All customers',
                eddRequired: 'Transactions above KES 1,000,000',
                strThreshold: 'Any suspicious activity',
                ctrThreshold: 'KES 1,000,000'
            }
        },
        
        // Tax Compliance (KRA)
        taxCompliance: {
            pinRequired: true,
            withholdingTax: {
                rate: 0.05,
                appliesTo: 'Interest income',
                threshold: 'KES 24,000 per month',
                filing: 'Monthly returns'
            },
            
            vat: {
                rate: 0.16,
                registrationThreshold: 'KES 5,000,000 per year',
                filing: 'Monthly returns'
            },
            
            incomeTax: {
                corporateRate: 0.30,
                filing: 'Annual returns',
                dueDate: 'Last day of 6th month after year-end'
            }
        }
    },
    
    // ============================================================================
    // 4️⃣ DISPUTE RESOLUTION FRAMEWORK
    // ============================================================================
    disputeResolution: {
        // Internal process
        internalProcess: {
            level1: {
                name: 'Direct Resolution',
                description: 'Users attempt to resolve directly',
                timeframe: '24 hours',
                escalation: 'If unresolved, escalate to group admin'
            },
            
            level2: {
                name: 'Group Admin Resolution',
                description: 'Group admin mediates dispute',
                timeframe: '48 hours',
                authority: 'Binding decision for group matters',
                escalation: 'If unresolved, escalate to platform'
            },
            
            level3: {
                name: 'Platform Resolution',
                description: 'M-Pesewa support team intervention',
                timeframe: '72 hours',
                authority: 'Platform decisions are final',
                escalation: 'If legal dispute, proceed to court'
            }
        },
        
        // External process
        externalProcess: {
            mediation: {
                provider: 'Mediation and Arbitration Centre',
                cost: 'Shared equally between parties',
                binding: 'If both parties agree',
                timeframe: '30 days'
            },
            
            arbitration: {
                provider: 'Chartered Institute of Arbitrators (Kenya)',
                cost: 'As per arbitrator\'s fees',
                binding: 'Yes',
                timeframe: '90 days'
            },
            
            litigation: {
                court: 'Courts of Kenya',
                jurisdiction: 'Nairobi',
                cost: 'As per court fees',
                timeframe: '6-24 months'
            }
        },
        
        // Escalation matrix
        escalationMatrix: {
            financialDisputes: {
                threshold: 'KES 100,000',
                process: 'Direct to arbitration',
                contact: 'legal@mpesewa.co.ke'
            },
            
            regulatoryDisputes: {
                authority: 'Central Bank of Kenya',
                process: 'Formal complaint to CBK',
                contact: 'complaints@centralbank.go.ke'
            },
            
            dataProtectionDisputes: {
                authority: 'Office of the Data Protection Commissioner',
                process: 'Complaint to ODPC',
                contact: 'complaints@odpc.go.ke'
            }
        }
    },
    
    // ============================================================================
    // 5️⃣ RISK DISCLOSURE STATEMENTS
    // ============================================================================
    riskDisclosures: {
        // Lender risks
        lenderRisks: [
            {
                risk: 'Default Risk',
                description: 'Borrowers may fail to repay loans',
                mitigation: 'Group-based lending, rating system, blacklist'
            },
            {
                risk: 'Platform Risk',
                description: 'Platform may experience technical issues',
                mitigation: 'Regular maintenance, backups, redundancy'
            },
            {
                risk: 'Regulatory Risk',
                description: 'Changes in regulations may affect operations',
                mitigation: 'Regular compliance reviews, legal counsel'
            },
            {
                risk: 'Market Risk',
                description: 'Economic conditions may affect repayment ability',
                mitigation: 'Loan limits, risk assessment, diversification'
            }
        ],
        
        // Borrower risks
        borrowerRisks: [
            {
                risk: 'Over-indebtedness',
                description: 'Taking multiple loans beyond repayment capacity',
                mitigation: 'Loan limits, group oversight, financial education'
            },
            {
                risk: 'Blacklisting',
                description: 'Default leads to platform-wide blacklisting',
                mitigation: 'Transparent terms, repayment reminders, grace period'
            },
            {
                risk: 'Data Privacy',
                description: 'Personal information visible to group members',
                mitigation: 'Controlled visibility, data protection measures'
            },
            {
                risk: 'Group Pressure',
                description: 'Social pressure within groups',
                mitigation: 'Voluntary participation, exit options'
            }
        ],
        
        // Platform risks
        platformRisks: [
            {
                risk: 'Legal Liability',
                description: 'Potential lawsuits from users',
                mitigation: 'Clear terms, insurance, legal compliance'
            },
            {
                risk: 'Cybersecurity',
                description: 'Data breaches or hacking attempts',
                mitigation: 'Advanced security measures, regular audits'
            },
            {
                risk: 'Operational Risk',
                description: 'System failures or downtime',
                mitigation: 'Redundant systems, monitoring, SLAs'
            },
            {
                risk: 'Reputational Risk',
                description: 'Negative publicity affecting trust',
                mitigation: 'Transparency, customer service, quality control'
            }
        ]
    },
    
    // ============================================================================
    // 6️⃣ COMPLIANCE CHECKLIST
    // ============================================================================
    complianceChecklist: {
        // Daily checks
        daily: [
            'AML/CFT transaction monitoring',
            'Fraud detection system review',
            'System security status check',
            'Customer complaint monitoring',
            'Regulatory update monitoring'
        ],
        
        // Weekly checks
        weekly: [
            'Credit risk assessment review',
            'Operational risk assessment',
            'Compliance training updates',
            'Data protection compliance',
            'Service level agreement compliance'
        ],
        
        // Monthly checks
        monthly: [
            'Financial reporting to CBK',
            'Tax compliance reporting',
            'Risk management framework review',
            'Internal audit findings review',
            'Regulatory change implementation'
        ],
        
        // Quarterly checks
        quarterly: [
            'External security audit',
            'Compliance program assessment',
            'Business continuity testing',
            'Staff training effectiveness',
            'Customer satisfaction review'
        ],
        
        // Annual checks
        annual: [
            'License renewal with CBK',
            'Annual financial audit',
            'Strategic risk assessment',
            'Technology infrastructure review',
            'Regulatory compliance certification'
        ]
    },
    
    // ============================================================================
    // 7️⃣ TEMPLATES & FORMS
    // ============================================================================
    templates: {
        // Loan agreement template
        loanAgreement: `
M-PESEWA LOAN AGREEMENT (KENYA)

This Loan Agreement ("Agreement") is made on {{date}} between:

LENDER: {{lenderName}}
Phone: {{lenderPhone}}
National ID: {{lenderId}}

BORROWER: {{borrowerName}}
Phone: {{borrowerPhone}}
National ID: {{borrowerId}}

GROUP: {{groupName}}
Group ID: {{groupId}}

1. LOAN DETAILS
Principal Amount: KES {{amount}}
Interest Rate: 10% per week (7 days)
Total Repayable: KES {{totalDue}}
Due Date: {{dueDate}}
Loan Purpose: {{category}}

2. REPAYMENT TERMS
- Repayment within 7 days
- Partial repayments allowed
- Late penalty: 5% daily after due date
- Default: After 60 days (2 months)

3. GUARANTORS
1. {{guarantor1Name}} - {{guarantor1Phone}}
2. {{guarantor2Name}} - {{guarantor2Phone}}

4. PLATFORM ROLE
M-Pesewa acts as platform provider only, not party to this agreement.

5. GOVERNING LAW
This Agreement is governed by Kenyan law.

SIGNED:
Lender: _______________________
Borrower: ______________________
        `,
        
        // Privacy consent form
        privacyConsent: `
M-PESEWA PRIVACY CONSENT FORM

I, {{userName}} (ID: {{userId}}), hereby consent to:

1. Collection and processing of my personal data for platform operations
2. Sharing of transaction data with my group members
3. Credit reference bureau checks as required
4. Regulatory reporting as mandated by law
5. Data retention for 7 years as required

I understand my data protection rights under the Data Protection Act, 2019.

Signature: _______________________
Date: {{date}}
        `,
        
        // Dispute resolution form
        disputeForm: `
M-PESEWA DISPUTE RESOLUTION FORM

Dispute Reference: {{disputeId}}
Date: {{date}}

Parties:
Complainant: {{complainantName}}
Respondent: {{respondentName}}

Nature of Dispute: {{description}}

Amount in Dispute: KES {{amount}}

Previous Resolution Attempts: {{attempts}}

Desired Outcome: {{outcome}}

Supporting Documents: {{documents}}

Submitted by: _______________________
        `
    },
    
    // ============================================================================
    // 8️⃣ CONTACT INFORMATION
    // ============================================================================
    contacts: {
        // Legal contacts
        legal: {
            general: 'legal@mpesewa.co.ke',
            contracts: 'contracts@mpesewa.co.ke',
            compliance: 'compliance@mpesewa.co.ke',
            dataProtection: 'dpo@mpesewa.co.ke'
        },
        
        // Regulatory contacts
        regulatory: {
            centralBank: 'dcp@centralbank.go.ke',
            dataCommissioner: 'info@odpc.go.ke',
            financialReporting: 'info@frc.go.ke',
            revenueAuthority: 'contact@kra.go.ke'
        },
        
        // Physical addresses
        addresses: {
            headquarters: 'M-Pesewa House, Upper Hill, Nairobi, Kenya',
            legalOffice: 'Law Courts Building, Nairobi',
            dataCenter: 'Sameer Business Park, Nairobi'
        },
        
        // Emergency contacts
        emergency: {
            fraud: '+254 709 219 001',
            legal: '+254 709 219 002',
            technical: '+254 709 219 003',
            support: '+254 709 219 000'
        }
    },
    
    // ============================================================================
    // 9️⃣ METADATA
    // ============================================================================
    metadata: {
        version: '2.1.0',
        effectiveDate: '2024-01-01',
        reviewDate: '2024-07-01',
        jurisdiction: 'Republic of Kenya',
        governingLaw: 'Laws of Kenya',
        
        // Approval signatures
        approvals: {
            legalCounsel: {
                name: 'Jane Muthoni',
                title: 'Head of Legal, Kenya',
                signature: 'JM/24/01',
                date: '2024-01-15'
            },
            complianceOfficer: {
                name: 'David Omondi',
                title: 'Chief Compliance Officer',
                signature: 'DO/24/01',
                date: '2024-01-16'
            },
            countryManager: {
                name: 'Sarah Kiprop',
                title: 'Country Manager, Kenya',
                signature: 'SK/24/01',
                date: '2024-01-17'
            }
        },
        
        // Change log
        changelog: [
            '2024-01-01: Updated for Data Protection Act compliance',
            '2023-07-01: Added AML/CFT requirements',
            '2023-01-01: Initial Kenya legal framework'
        ]
    }
};

// Export the legal framework
export default KenyaLegal;

// Export individual sections
export const termsOfService = KenyaLegal.termsOfService;
export const privacyPolicy = KenyaLegal.privacyPolicy;
export const financialRegulations = KenyaLegal.financialRegulations;
export const disputeResolution = KenyaLegal.disputeResolution;
export const riskDisclosures = KenyaLegal.riskDisclosures;

// Export helper functions
export function generateLoanAgreement(data) {
    return KenyaLegal.templates.loanAgreement
        .replace('{{date}}', new Date().toLocaleDateString('en-KE'))
        .replace('{{lenderName}}', data.lenderName || '')
        .replace('{{lenderPhone}}', data.lenderPhone || '')
        .replace('{{lenderId}}', data.lenderId || '')
        .replace('{{borrowerName}}', data.borrowerName || '')
        .replace('{{borrowerPhone}}', data.borrowerPhone || '')
        .replace('{{borrowerId}}', data.borrowerId || '')
        .replace('{{groupName}}', data.groupName || '')
        .replace('{{groupId}}', data.groupId || '')
        .replace('{{amount}}', data.amount ? data.amount.toLocaleString('en-KE') : '')
        .replace('{{totalDue}}', data.totalDue ? data.totalDue.toLocaleString('en-KE') : '')
        .replace('{{dueDate}}', data.dueDate || '')
        .replace('{{category}}', data.category || '')
        .replace('{{guarantor1Name}}', data.guarantors?.[0]?.name || '')
        .replace('{{guarantor1Phone}}', data.guarantors?.[0]?.phone || '')
        .replace('{{guarantor2Name}}', data.guarantors?.[1]?.name || '')
        .replace('{{guarantor2Phone}}', data.guarantors?.[1]?.phone || '');
}

export function validateLegalCompliance(userData, transactionType) {
    const compliance = {
        valid: true,
        errors: [],
        warnings: [],
        requirements: []
    };
    
    // KYC validation
    if (!userData.nationalId) {
        compliance.errors.push('National ID required for KYC compliance');
        compliance.valid = false;
    }
    
    if (!userData.phone || !userData.phone.startsWith('+254')) {
        compliance.errors.push('Valid Kenyan phone number required');
        compliance.valid = false;
    }
    
    // Age validation
    if (userData.age && userData.age < 18) {
        compliance.errors.push('Must be at least 18 years old');
        compliance.valid = false;
    }
    
    // Transaction-specific compliance
    if (transactionType === 'lending') {
        if (!userData.subscriptionLevel) {
            compliance.errors.push('Subscription level required for lending');
            compliance.valid = false;
        }
        
        if (userData.subscriptionLevel === 'super' || userData.subscriptionLevel === 'lenderOfLenders') {
            compliance.requirements.push('CRB check required for this subscription level');
        }
    }
    
    if (transactionType === 'borrowing' && userData.amount > 1000000) {
        compliance.warnings.push('Amount exceeds typical limits, additional verification may be required');
    }
    
    return compliance;
}

export function getRegulatoryReportingRequirements(period) {
    const requirements = {
        daily: [
            'Suspicious Transaction Reports (STR) if any',
            'System security status report'
        ],
        weekly: [
            'Transaction volume and value summary',
            'Fraud attempt summary'
        ],
        monthly: [
            'Financial returns to CBK',
            'Tax returns to KRA',
            'AML/CFT compliance report'
        ],
        quarterly: [
            'Risk management report',
            'Compliance program assessment',
            'Data protection compliance report'
        ],
        annual: [
            'Annual financial statements',
            'License renewal application',
            'Annual compliance certification'
        ]
    };
    
    return requirements[period] || [];
}

// Export for CommonJS compatibility
if (typeof module !== 'undefined' && module.exports) {
    module.exports = KenyaLegal;
    module.exports.termsOfService = termsOfService;
    module.exports.privacyPolicy = privacyPolicy;
    module.exports.financialRegulations = financialRegulations;
    module.exports.disputeResolution = disputeResolution;
    module.exports.riskDisclosures = riskDisclosures;
    module.exports.generateLoanAgreement = generateLoanAgreement;
    module.exports.validateLegalCompliance = validateLegalCompliance;
    module.exports.getRegulatoryReportingRequirements = getRegulatoryReportingRequirements;
}