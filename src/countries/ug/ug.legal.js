/**
 * M-Pesewa Uganda - Legal Framework and Compliance
 * Strict Legal Requirements for Uganda Operations
 * Last Updated: 2026-01-24
 */

class UgandaLegalFramework {
    constructor() {
        this.jurisdiction = {
            country: 'Uganda',
            legalSystem: 'Common Law',
            governingLaw: 'Laws of Uganda',
            disputeResolution: 'Courts of Uganda',
            regulatoryBody: 'Bank of Uganda'
        };

        // Primary legal documents
        this.documents = {
            termsOfService: this.getTermsOfService(),
            privacyPolicy: this.getPrivacyPolicy(),
            lendingAgreement: this.getLendingAgreement(),
            borrowingAgreement: this.getBorrowingAgreement(),
            groupCharter: this.getGroupCharter(),
            dataProtection: this.getDataProtectionPolicy()
        };

        // Regulatory requirements
        this.regulations = {
            financial: [
                'Financial Institutions Act, 2004',
                'Microfinance Deposit-taking Institutions Act, 2003',
                'Bank of Uganda Act, 2000',
                'Financial Institutions (Agent Banking) Regulations, 2017'
            ],
            consumer: [
                'Consumer Protection Act, 2019',
                'Fair Competition Act, 2022',
                'Electronic Transactions Act, 2011',
                'Computer Misuse Act, 2011'
            ],
            data: [
                'Data Protection and Privacy Act, 2019',
                'Access to Information Act, 2005'
            ],
            tax: [
                'Income Tax Act',
                'Value Added Tax Act',
                'Stamp Duty Act'
            ]
        };

        // Compliance requirements
        this.compliance = {
            licensing: {
                required: true,
                licenseType: 'Microfinance Institution License',
                issuingAuthority: 'Bank of Uganda',
                licenseNumber: 'MFI/001/2024',
                validity: '2024-01-01 to 2026-12-31'
            },
            reporting: {
                frequency: 'Monthly',
                to: ['Bank of Uganda', 'Financial Intelligence Authority'],
                requirements: [
                    'Transaction reports',
                    'Suspicious activity reports',
                    'Customer due diligence reports',
                    'Financial statements'
                ]
            },
            capitalRequirements: {
                minimumCapital: 5000000000, // 5 Billion UGX
                maintained: 'At all times',
                verification: 'Quarterly audit'
            }
        };

        // User rights and responsibilities
        this.userRights = {
            borrowers: [
                'Right to clear loan terms',
                'Right to privacy of financial information',
                'Right to dispute resolution',
                'Right to credit information access',
                'Right to fair debt collection practices'
            ],
            lenders: [
                'Right to choose borrowers',
                'Right to set interest within limits',
                'Right to receive repayments',
                'Right to access borrower credit history',
                'Right to legal recourse for defaults'
            ],
            groupAdmins: [
                'Right to manage group membership',
                'Right to set group rules',
                'Right to moderate disputes',
                'Right to access group statistics',
                'Right to dissolve group following rules'
            ]
        };

        // Penalties and enforcement
        this.enforcement = {
            violations: {
                crossCountryLending: {
                    penalty: 'Account termination',
                    fine: 'Up to 50,000,000 UGX',
                    legal: 'Criminal prosecution under Financial Institutions Act'
                },
                unlicensedLending: {
                    penalty: 'Immediate platform ban',
                    fine: 'Up to 100,000,000 UGX',
                    legal: 'Criminal charges'
                },
                dataBreach: {
                    penalty: 'Regulatory suspension',
                    fine: 'Up to 2% of annual turnover',
                    legal: 'Civil liability under Data Protection Act'
                },
                fraud: {
                    penalty: 'Permanent blacklisting',
                    fine: '3x fraudulent amount',
                    legal: 'Criminal prosecution'
                }
            },
            disputeResolution: {
                firstLevel: 'Group Admin mediation',
                secondLevel: 'Platform mediation',
                thirdLevel: 'Alternative Dispute Resolution (ADR)',
                finalLevel: 'Courts of Uganda'
            }
        };
    }

    /**
     * Get Terms of Service for Uganda
     */
    getTermsOfService() {
        return {
            title: 'M-Pesewa Uganda Terms of Service',
            effectiveDate: '2024-01-01',
            sections: [
                {
                    title: '1. Agreement to Terms',
                    content: `By accessing or using M-Pesewa Uganda platform, you agree to be bound by these Terms of Service and all applicable laws and regulations of Uganda. If you do not agree with any part of these terms, you must not use the platform.`
                },
                {
                    title: '2. Uganda Jurisdiction',
                    content: `These Terms are governed by and construed in accordance with the laws of Uganda. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts of Uganda.`
                },
                {
                    title: '3. Platform Role',
                    content: `M-Pesewa Uganda is a technology platform facilitating peer-to-peer lending within trusted groups. We are not a bank, do not hold user funds, and do not guarantee loan repayments. All transactions are between users directly.`
                },
                {
                    title: '4. Country Isolation',
                    content: `STRICT RULE: All lending and borrowing activities are restricted within Uganda borders. Cross-country transactions are strictly prohibited and will result in immediate account termination.`
                },
                {
                    title: '5. User Eligibility',
                    content: `To use M-Pesewa Uganda, you must:
                    a) Be at least 18 years old
                    b) Be a resident of Uganda
                    c) Have a valid Uganda National ID
                    d) Have a Uganda-registered phone number
                    e) Not be on any financial crimes watchlist`
                },
                {
                    title: '6. Subscription Requirements',
                    content: `Lenders must maintain an active subscription. Subscription fees are non-refundable. Failure to renew subscription will result in lending privileges being suspended.`
                },
                {
                    title: '7. Loan Terms',
                    content: `All loans facilitated through the platform must:
                    a) Have maximum 7-day repayment period
                    b) Charge maximum 10% interest per week
                    c) Allow daily partial repayments
                    d) Apply 5% daily penalty after 7 days overdue
                    e) Be considered in default after 60 days`
                },
                {
                    title: '8. Risk Acknowledgement',
                    content: `You acknowledge that:
                    a) Lending involves risk of loss
                    b) Platform does not guarantee repayments
                    c) You participate at your own risk
                    d) Past performance does not guarantee future results`
                },
                {
                    title: '9. Prohibited Activities',
                    content: `You must not:
                    a) Attempt cross-country transactions
                    b) Use platform for money laundering
                    c) Provide false information
                    d) Harass other users
                    e) Violate any Ugandan laws`
                },
                {
                    title: '10. Termination',
                    content: `We may suspend or terminate your account at our discretion for violations of these Terms. Upon termination, you must immediately cease using the platform.`
                },
                {
                    title: '11. Amendments',
                    content: `We reserve the right to modify these Terms at any time. Continued use after changes constitutes acceptance.`
                },
                {
                    title: '12. Contact',
                    content: `For legal inquiries: legal.ug@m-pesewa.com
                    Address: Plot 23, Kampala Road, Kampala, Uganda`
                }
            ]
        };
    }

    /**
     * Get Privacy Policy for Uganda
     */
    getPrivacyPolicy() {
        return {
            title: 'M-Pesewa Uganda Privacy Policy',
            compliantWith: 'Data Protection and Privacy Act, 2019',
            dataController: 'M-Pesewa Uganda Limited',
            sections: [
                {
                    title: '1. Data Collection',
                    content: `We collect:
                    a) Identity information (Name, National ID, Photo)
                    b) Contact information (Phone, Email, Address)
                    c) Financial information (Bank details, Transaction history)
                    d) Device information (IP address, Browser type)
                    e) Usage data (Platform interactions)`
                },
                {
                    title: '2. Data Use',
                    content: `We use your data to:
                    a) Verify your identity as required by Bank of Uganda
                    b) Facilitate lending transactions
                    c) Comply with regulatory requirements
                    d) Improve platform services
                    e) Prevent fraud and money laundering`
                },
                {
                    title: '3. Data Sharing',
                    content: `We may share data with:
                    a) Bank of Uganda (regulatory compliance)
                    b) Financial Intelligence Authority (AML/CFT)
                    c) Credit Reference Bureaus (with consent)
                    d) Law enforcement (when legally required)
                    e) Group members (limited profile information)`
                },
                {
                    title: '4. Data Retention',
                    content: `We retain data:
                    a) For 7 years as required by Ugandan law
                    b) Until account deletion request
                    c) As needed for legal proceedings
                    d) For ongoing service provision`
                },
                {
                    title: '5. Your Rights',
                    content: `Under Data Protection Act, you have right to:
                    a) Access your personal data
                    b) Correct inaccurate data
                    c) Delete your data
                    d) Object to data processing
                    e) Data portability
                    f) Lodge complaints with PDPC`
                },
                {
                    title: '6. Data Security',
                    content: `We implement:
                    a) Encryption of sensitive data
                    b) Regular security audits
                    c) Access controls
                    d) Breach notification procedures
                    e) Employee training on data protection`
                },
                {
                    title: '7. Cross-border Transfer',
                    content: `STRICT RULE: User data is stored and processed within Uganda only, in compliance with data localization requirements under Ugandan law.`
                },
                {
                    title: '8. Cookies',
                    content: `We use cookies for:
                    a) Authentication
                    b) Security
                    c) Preferences
                    d) Analytics
                    You can control cookies through browser settings.`
                }
            ]
        };
    }

    /**
     * Get Lending Agreement for Uganda
     */
    getLendingAgreement() {
        return {
            title: 'Uganda Lending Agreement',
            parties: ['Lender (You)', 'Borrower (Counterparty)', 'M-Pesewa Uganda (Platform)'],
            keyTerms: [
                {
                    term: 'Jurisdiction',
                    value: 'Laws of Uganda apply exclusively'
                },
                {
                    term: 'Currency',
                    value: 'All amounts in Uganda Shillings (UGX)'
                },
                {
                    term: 'Interest Rate',
                    value: 'Maximum 10% per week (complying with Uganda law)'
                },
                {
                    term: 'Repayment Period',
                    value: 'Maximum 7 days'
                },
                {
                    term: 'Penalty',
                    value: '5% daily on overdue amount after 7 days'
                },
                {
                    term: 'Default',
                    value: 'After 60 days, loan considered in default'
                }
            ],
            lenderObligations: [
                'Maintain active subscription',
                'Lend only within Uganda-based groups',
                'Comply with lending limits per tier',
                'Maintain accurate ledgers',
                'Rate borrowers after repayment',
                'Report suspicious activity'
            ],
            borrowerObligations: [
                'Repay within agreed timeframe',
                'Make daily partial payments if agreed',
                'Maintain accurate contact information',
                'Notify lender of repayment difficulties',
                'Consent to credit information sharing'
            ],
            platformObligations: [
                'Provide lending infrastructure',
                'Maintain transaction records',
                'Facilitate dispute resolution',
                'Ensure regulatory compliance',
                'Protect user data'
            ],
            riskDisclosures: [
                'LENDING INVOLVES RISK OF CAPITAL LOSS',
                'PLATFORM DOES NOT GUARANTEE REPAYMENT',
                'BORROWER DEFAULT IS POSSIBLE',
                'NO INSURANCE COVERAGE FOR LOANS',
                'PAST PERFORMANCE DOES NOT GUARANTEE FUTURE RESULTS'
            ],
            termination: {
                conditions: [
                    'Subscription expiration',
                    'Regulatory violation',
                    'Fraudulent activity',
                  'User request',
                    'Platform discontinuation'
                ],
                effects: [
                    'Lending privileges suspended',
                    'Active loans continue under terms',
                    'Data retained as required by law',
                    'Outstanding obligations remain'
                ]
            }
        };
    }

    /**
     * Get Borrowing Agreement for Uganda
     */
    getBorrowingAgreement() {
        return {
            title: 'Uganda Borrowing Agreement',
            importantNotice: 'THIS IS A LEGALLY BINDING AGREEMENT UNDER UGANDAN LAW',
            keyClauses: [
                {
                    clause: '1. Loan Purpose',
                    description: 'Loan must be for genuine emergency needs within approved categories'
                },
                {
                    clause: '2. Repayment Commitment',
                    description: 'Borrower commits to repay principal + 10% interest within 7 days'
                },
                {
                    clause: '3. Default Consequences',
                    description: 'Default leads to blacklisting, legal action, and debt collection'
                },
                {
                    clause: '4. Guarantor Liability',
                    description: 'Guarantors are jointly liable for repayment'
                },
                {
                    clause: '5. Credit Reporting',
                    description: 'Payment history reported to Uganda credit bureaus'
                }
            ],
            borrowerAcknowledgements: [
                'I am borrowing from a trusted group member in Uganda',
                'I understand the 10% weekly interest charge',
                'I accept 5% daily penalty for late repayment',
                'I agree to be blacklisted if I default for 60 days',
                'I consent to credit information sharing',
                'I authorize communication via provided contacts'
            ],
            lenderAcknowledgements: [
                'I am lending within my trusted Uganda group',
                'I understand the risk of borrower default',
                'I will maintain accurate ledger records',
                'I will comply with Uganda lending laws',
                'I will use fair debt collection practices'
            ],
            disputeResolution: {
                steps: [
                    '1. Direct negotiation between parties',
                    '2. Group Admin mediation',
                    '3. Platform mediation team',
                    '4. Alternative Dispute Resolution (ADR)',
                    '5. Ugandan courts as final recourse'
                ],
                timeline: 'Resolution within 30 days where possible'
            }
        };
    }

    /**
     * Get Group Charter Template for Uganda
     */
    getGroupCharter() {
        return {
            title: 'Uganda Group Charter Template',
            mandatoryClauses: [
                {
                    clause: 'Group Composition',
                    requirements: [
                        'Minimum 5 members',
                        'Maximum 1000 members',
                        'All members must be Uganda residents',
                        'One Group Admin appointed'
                    ]
                },
                {
                    clause: 'Lending Rules',
                    requirements: [
                        'Lending only within group',
                        'Maximum 7-day repayment',
                        'Maximum 10% interest',
                        'Daily partial payments allowed'
                    ]
                },
                {
                    clause: 'Membership',
                    requirements: [
                        'Invitation-only membership',
                        'New members require two referrals',
                        'Members can join max 4 groups',
                        'Poor rating may lead to removal'
                    ]
                },
                {
                    clause: 'Dispute Resolution',
                    requirements: [
                        'Group Admin as first mediator',
                        'Escalation to platform if unresolved',
                        'Compliance with Uganda law',
                        'Fair hearing for all parties'
                    ]
                }
            ],
            optionalRules: [
                'Minimum loan amount',
                'Maximum loan amount per member',
                'Meeting schedule',
                'Contribution requirements',
                'Social fund provisions'
            ],
            adminPowers: [
                'Approve new members',
                'Remove problematic members',
                'Mediate disputes',
                'Set group-specific rules',
                'Access group statistics'
            ],
            memberRights: [
                'Right to fair treatment',
                'Right to privacy',
                'Right to leave group',
                'Right to dispute resolution',
                'Right to access group rules'
            ]
        };
    }

    /**
     * Get Data Protection Policy for Uganda
     */
    getDataProtectionPolicy() {
        return {
            title: 'Uganda Data Protection Policy',
            compliance: 'Data Protection and Privacy Act, 2019',
            dataProtectionOfficer: {
                name: 'Data Protection Officer',
                email: 'dpo.ug@m-pesewa.com',
                phone: '+256 312 123 456'
            },
            principles: [
                {
                    principle: 'Lawful Processing',
                    description: 'Data processed only with lawful basis and consent'
                },
                {
                    principle: 'Purpose Limitation',
                    description: 'Data collected for specified, explicit purposes'
                },
                {
                    principle: 'Data Minimization',
                    description: 'Only necessary data collected and processed'
                },
                {
                    principle: 'Accuracy',
                    description: 'Data kept accurate and up-to-date'
                },
                {
                    principle: 'Storage Limitation',
                    description: 'Data not kept longer than necessary'
                },
                {
                    principle: 'Integrity & Confidentiality',
                    description: 'Data secured against unauthorized access'
                },
                {
                    principle: 'Accountability',
                    description: 'Controller responsible for compliance'
                }
            ],
            breachProcedure: {
                detection: 'Immediate investigation of suspected breach',
                assessment: 'Determine scope and impact',
                notification: 'Notify PDPC within 72 hours if high risk',
                mitigation: 'Take steps to minimize harm',
                review: 'Implement measures to prevent recurrence'
            },
            dataSubjectRights: {
                access: 'Right to know what data is held',
                correction: 'Right to correct inaccurate data',
                deletion: 'Right to erasure under certain conditions',
                objection: 'Right to object to processing',
                portability: 'Right to data portability',
                restriction: 'Right to restrict processing'
            },
            penalties: {
                administrative: 'Fine up to 2% of annual turnover',
                compensation: 'Damages to affected individuals',
                criminal: 'Imprisonment for serious violations',
                regulatory: 'Suspension of data processing activities'
            }
        };
    }

    /**
     * Validate legal compliance for Uganda
     */
    validateCompliance() {
        const requirements = [
            {
                requirement: 'Terms of Service includes Uganda jurisdiction',
                met: this.documents.termsOfService.sections.some(s => 
                    s.title.includes('Uganda Jurisdiction') || s.content.includes('Laws of Uganda')
                )
            },
            {
                requirement: 'Privacy Policy compliant with Data Protection Act',
                met: this.documents.privacyPolicy.compliantWith.includes('Data Protection and Privacy Act')
            },
            {
                requirement: 'Cross-country restriction clearly stated',
                met: this.documents.termsOfService.sections.some(s => 
                    s.title.includes('Country Isolation') && s.content.includes('strictly prohibited')
                )
            },
            {
                requirement: 'Interest rate limits specified',
                met: this.documents.lendingAgreement.keyTerms.some(t => 
                    t.term.includes('Interest Rate') && t.value.includes('10%')
                )
            },
            {
                requirement: 'Dispute resolution includes Uganda courts',
                met: this.enforcement.disputeResolution.finalLevel.includes('Courts of Uganda')
            }
        ];

        const unmet = requirements.filter(req => !req.met);
        
        return {
            compliant: unmet.length === 0,
            metRequirements: requirements.filter(req => req.met).length,
            totalRequirements: requirements.length,
            unmetRequirements: unmet.map(req => req.requirement),
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Get all legal documents
     */
    getAllDocuments() {
        return {
            jurisdiction: this.jurisdiction,
            documents: this.documents,
            regulations: this.regulations,
            compliance: this.compliance,
            userRights: this.userRights,
            enforcement: this.enforcement,
            validation: this.validateCompliance()
        };
    }

    /**
     * Initialize Uganda legal framework
     */
    initialize() {
        console.log(`⚖️  Initializing M-Pesewa Uganda Legal Framework...`);
        
        const validation = this.validateCompliance();
        
        if (!validation.compliant) {
            console.error('❌ Uganda legal compliance validation failed:');
            validation.unmetRequirements.forEach(req => console.error(`   - ${req}`));
            throw new Error('Uganda legal compliance requirements not met');
        }
        
        console.log('✅ Uganda legal framework validated successfully');
        console.log(`📜 Compliant with: ${this.regulations.financial.length} financial regulations`);
        console.log(`📊 Compliance: ${validation.metRequirements}/${validation.totalRequirements} requirements met`);
        console.log(`🏛️  Jurisdiction: ${this.jurisdiction.country} (${this.jurisdiction.legalSystem})`);
        
        return this.getAllDocuments();
    }
}

// Create and export Uganda legal framework
const ugandaLegal = new UgandaLegalFramework();
export default ugandaLegal;

// For CommonJS compatibility
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ugandaLegal;
}