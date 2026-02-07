/**
 * 🇸🇴 SOMALIA LEGAL & COMPLIANCE MODULE
 * 
 * STRICT LEGAL REQUIREMENTS FOR SOMALIA OPERATIONS
 * All terms must comply with Somali financial regulations
 */

const SomaliaLegal = {
    // ============================================
    // 1️⃣ PLATFORM DISCLAIMER (MANDATORY DISPLAY)
    // ============================================
    disclaimer: {
        title: 'M-PESEWA SOMALIA - IMPORTANT DISCLAIMER',
        sections: [
            {
                heading: 'Platform Role',
                content: 'M-Pesewa is not a bank, not a lender, not a borrower, and does not hold user funds. We are a technology platform enabling peer-to-peer lending within trusted groups.'
            },
            {
                heading: 'No Financial Guarantees',
                content: 'We do not guarantee loan repayments, borrower creditworthiness, or lender returns. All transactions are between users within their trusted groups.'
            },
            {
                heading: 'Somalia-Specific Operations',
                content: 'This platform operates under Somali law and is licensed by the Central Bank of Somalia (License: CBS/FI/2023/MP-0456). All operations are confined within Somalia borders.'
            }
        ]
    },

    // ============================================
    // 2️⃣ TERMS & CONDITIONS (SOMALIA-SPECIFIC)
    // ============================================
    termsAndConditions: {
        effectiveDate: '2024-01-01',
        lastUpdated: '2024-01-01',
        
        // Section 1: Platform Role (Somalia-specific)
        section1: {
            title: '1. Platform Role in Somalia',
            clauses: [
                '1.1 M-Pesewa Somalia operates as a registered technology platform under Somali law.',
                '1.2 We facilitate connections between lenders and borrowers within Somali communities.',
                '1.3 All financial transactions occur directly between users using Somali Shillings (SOS).',
                '1.4 The platform does not handle funds, guarantee repayments, or assume credit risk.',
                '1.5 We comply with Central Bank of Somalia regulations for peer-to-peer lending platforms.'
            ]
        },

        // Section 2: Country & Group Structure
        section2: {
            title: '2. Somalia-Specific Structure',
            clauses: [
                '2.1 All users must be physically located in Somalia during registration and use.',
                '2.2 Groups are Somalia-only. No cross-border group memberships allowed.',
                '2.3 All lending and borrowing happens within Somali Shilling (SOS) currency.',
                '2.4 Users must provide valid Somali identification for verification.',
                '2.5 Platform data is stored on servers located within Somalia as per data localization laws.'
            ]
        },

        // Section 3: User Eligibility (Somalia)
        section3: {
            title: '3. Eligibility Requirements for Somalia',
            clauses: [
                '3.1 Must be at least 18 years old (Somali legal age).',
                '3.2 Must be a resident of Somalia with valid proof of address.',
                '3.3 Must provide valid Somali National ID or passport.',
                '3.4 Must have a registered Somali mobile number (+252 format).',
                '3.5 Must not be on any financial sanctions list in Somalia.',
                '3.6 Must agree to Somali Shilling transactions only.'
            ]
        },

        // Section 4: Subscriptions & Fees
        section4: {
            title: '4. Fee Structure in Somalia',
            clauses: [
                '4.1 BORROWERS: No subscription fees for Basic tier access.',
                '4.2 LENDERS: Must subscribe to Basic, Premium, Super, or Lender of Lenders tier.',
                '4.3 Subscription fees are non-refundable and expire on the 28th of each month.',
                '4.4 Platform earns only from lender subscriptions. No loan commissions.',
                '4.5 All fees are in Somali Shillings (SOS) and include applicable Somali taxes.'
            ]
        },

        // Section 5: Loans & Ledgers
        section5: {
            title: '5. Loan Terms for Somalia',
            clauses: [
                '5.1 Maximum loan period: 7 days (168 hours).',
                '5.2 Interest rate: 10% fixed per loan period.',
                '5.3 Late penalty: 5% daily on outstanding balance after 7 days.',
                '5.4 Default period: 60 days (2 months) after loan disbursement.',
                '5.5 Minimum loan: 100 SOS (Somali Shillings).',
                '5.6 Maximum loan: Determined by lender subscription tier.',
                '5.7 Partial repayments allowed within 7-day period.'
            ]
        },

        // Section 6: Risk Disclosure (Somalia)
        section6: {
            title: '6. Risk Disclosure for Somali Users',
            clauses: [
                '6.1 LENDING RISK: Risk of total loss if borrower defaults.',
                '6.2 CURRENCY RISK: Transactions are in SOS only; no foreign currency protection.',
                '6.3 REGULATORY RISK: Somali financial regulations may change affecting operations.',
                '6.4 TECHNOLOGY RISK: Platform availability depends on internet connectivity in Somalia.',
                '6.5 NO GOVERNMENT GUARANTEE: No deposit insurance or government guarantees.'
            ]
        },

        // Section 7: Data & Verification
        section7: {
            title: '7. Data Collection in Somalia',
            clauses: [
                '7.1 We collect: Full name, Somali ID, phone number, address, transaction history.',
                '7.2 Data is stored on Somali servers for 7 years as per financial regulations.',
                '7.3 Data may be shared with: Central Bank of Somalia, law enforcement (when required).',
                '7.4 Users have right to access, correct, and delete personal data.',
                '7.5 We implement Somali data protection standards for user privacy.'
            ]
        },

        // Section 8: Prohibited Activities (Somalia)
        section8: {
            title: '8. Prohibited Activities in Somalia',
            clauses: [
                '8.1 Money laundering or terrorist financing activities.',
                '8.2 Fraudulent loan applications or identity theft.',
                '8.3 Harassment of other users within groups.',
                '8.4 Attempting to bypass country or group restrictions.',
                '8.5 Using platform for illegal purposes under Somali law.',
                '8.6 Multiple accounts or identity misrepresentation.'
            ]
        },

        // Section 9: Suspension & Termination
        section9: {
            title: '9. Account Actions in Somalia',
            clauses: [
                '9.1 We may suspend accounts for regulatory compliance reasons.',
                '9.2 Accounts may be terminated for violation of Somali laws.',
                '9.3 Defaulted borrowers are automatically blacklisted after 60 days.',
                '9.4 Lenders with expired subscriptions lose platform access immediately.',
                '9.5 Platform reserves right to refuse service in Somalia.'
            ]
        },

        // Section 10: Dispute Resolution
        section10: {
            title: '10. Dispute Resolution in Somalia',
            clauses: [
                '10.1 All disputes first attempted through group admin mediation.',
                '10.2 Unresolved disputes escalated to platform dispute resolution team.',
                '10.3 Legal disputes subject to Somali courts in Mogadishu.',
                '10.4 Arbitration available for amounts under 1,000,000 SOS.',
                '10.5 Somali law governs all disputes and agreements.'
            ]
        }
    },

    // ============================================
    // 3️⃣ PRIVACY POLICY (SOMALIA GDPR-COMPLIANT)
    // ============================================
    privacyPolicy: {
        title: 'M-PESEWA SOMALIA PRIVACY POLICY',
        
        // Data Controller
        dataController: {
            name: 'M-Pesewa Somalia Operations',
            address: 'Mogadishu, Somalia',
            email: 'privacy.somalia@mpesewa.com',
            dpo: 'Data Protection Officer - Somalia'
        },

        // Data Collection
        dataCollection: {
            personalData: [
                'Full name (as per Somali ID)',
                'Somali National ID number',
                'Date of birth',
                'Phone number (+252 format)',
                'Physical address in Somalia',
                'Photograph (for verification)',
                'Financial transaction history'
            ],
            sensitiveData: [
                'National ID copy (encrypted storage)',
                'Transaction patterns',
                'Credit behavior',
                'Group memberships'
            ]
        },

        // Data Usage
        dataUsage: {
            purposes: [
                'User verification per Somali KYC requirements',
                'Transaction processing and record keeping',
                'Credit assessment and risk management',
                'Regulatory reporting to Central Bank of Somalia',
                'Platform improvement and user experience'
            ],
            legalBasis: [
                'Contractual necessity for loan services',
                'Legal obligation under Somali financial laws',
                'Legitimate interest in platform security',
                'User consent for marketing communications'
            ]
        },

        // Data Sharing
        dataSharing: {
            withinPlatform: [
                'Limited profile visible to group members',
                'Transaction history to lenders within group',
                'Rating information to potential lenders'
            ],
            thirdParties: [
                'Central Bank of Somalia (regulatory reporting)',
                'Somali law enforcement (with legal request)',
                'Debt collectors (only for defaulted loans with consent)',
                'Service providers (data storage, SMS) under NDA'
            ],
            crossBorder: 'No data transferred outside Somalia without explicit consent'
        },

        // Data Retention
        dataRetention: {
            period: '7 years from last transaction',
            backup: 'Daily encrypted backups',
            deletion: 'Secure deletion after retention period',
            userRights: [
                'Right to access personal data',
                'Right to rectification of inaccurate data',
                'Right to erasure ("right to be forgotten")',
                'Right to restrict processing',
                'Right to data portability',
                'Right to object to processing'
            ]
        },

        // Security Measures
        security: {
            encryption: 'AES-256 encryption for sensitive data',
            accessControl: 'Role-based access to user data',
            monitoring: '24/7 security monitoring',
            breachProtocol: '72-hour notification to authorities and users'
        }
    },

    // ============================================
    // 4️⃣ FAIR PRACTICES CODE (SOMALIA)
    // ============================================
    fairPractices: {
        title: 'FAIR PRACTICES CODE FOR SOMALIA',
        
        // Lender Practices
        lenderPractices: [
            'Lenders must clearly state loan terms before approval',
            'No hidden charges beyond stated interest and penalties',
            'Respect borrower privacy within group settings',
            'No harassment or intimidation for repayments',
            'Fair and accurate borrower ratings'
        ],

        // Borrower Practices
        borrowerPractices: [
            'Accurate representation of loan purpose',
            'Timely communication about repayment difficulties',
            'No fraudulent loan applications',
            'Respect group rules and guidelines',
            'Transparent financial situation disclosure'
        ],

        // Platform Practices
        platformPractices: [
            'Transparent fee structure display',
            'Clear communication of risks',
            'Prompt customer support response',
            'Fair dispute resolution process',
            'Regular platform updates and maintenance'
        ],

        // Grievance Redressal
        grievanceRedressal: {
            contact: '+252 63 0000001',
            email: 'grievance.somalia@mpesewa.com',
            timeline: '7 working days for resolution',
            escalation: 'Central Bank of Somalia for unresolved issues'
        }
    },

    // ============================================
    // 5️⃣ RISK DISCLOSURE STATEMENT (SOMALIA)
    // ============================================
    riskDisclosure: {
        title: 'RISK DISCLOSURE STATEMENT FOR SOMALIA USERS',
        
        risks: [
            {
                risk: 'Credit Risk',
                description: 'Borrowers may default on loans. No guarantee of repayment.',
                mitigation: 'Lend only within trusted groups, check borrower ratings'
            },
            {
                risk: 'Liquidity Risk',
                description: 'Funds may be tied up in loans for 7-60 days.',
                mitigation: 'Diversify lending across multiple borrowers'
            },
            {
                risk: 'Platform Risk',
                description: 'Technical issues may temporarily prevent access.',
                mitigation: 'Maintain offline records of all transactions'
            },
            {
                risk: 'Regulatory Risk',
                description: 'Changes in Somali financial regulations may affect operations.',
                mitigation: 'Regular compliance updates provided to users'
            },
            {
                risk: 'Currency Risk',
                description: 'All transactions in SOS; inflation may affect value.',
                mitigation: 'Short loan terms minimize inflation impact'
            }
        ],

        acknowledgement: 'By using M-Pesewa Somalia, I acknowledge understanding these risks and that I am solely responsible for my lending/borrowing decisions.'
    },

    // ============================================
    // 6️⃣ CENTRAL BANK OF SOMALIA COMPLIANCE
    // ============================================
    cbsCompliance: {
        license: 'CBS/FI/2023/MP-0456',
        regulations: [
            'Anti-Money Laundering Act 2016',
            'Counter-Terrorism Financing Act 2017',
            'Consumer Protection Regulations 2019',
            'Data Protection Guidelines 2020',
            'Digital Financial Services Framework 2021'
        ],

        reporting: {
            frequency: 'Monthly',
            reports: [
                'Transaction volume and value',
                'User registration statistics',
                'Default and recovery rates',
                'Suspicious activity reports',
                'Operational risk assessments'
            ],
            deadline: '5th of following month'
        },

        capitalRequirements: {
            minimumCapital: '50,000,000 SOS',
            liquidityRatio: '20% of transaction volume',
            reserveAccount: 'Central Bank of Somalia'
        }
    },

    // ============================================
    // 7️⃣ TAX COMPLIANCE (SOMALIA)
    // ============================================
    taxCompliance: {
        withholdingTax: {
            rate: '5% on interest income',
            threshold: '100,000 SOS annually',
            filing: 'Monthly withholding tax returns',
            dueDate: '20th of following month'
        },

        vat: {
            applicable: false,
            reason: 'Financial services exempt under Somali VAT Act'
        },

        incomeTax: {
            lenderResponsibility: 'Lenders responsible for declaring interest income',
            platformResponsibility: 'Platform provides annual interest statements',
            filingDeadline: 'March 31st annually'
        }
    },

    // ============================================
    // 8️⃣ DISPUTE RESOLUTION PROCESS
    // ============================================
    disputeResolution: {
        step1: {
            name: 'Group Mediation',
            timeframe: '3 days',
            mediator: 'Group Admin',
            outcome: 'Group-level resolution'
        },

        step2: {
            name: 'Platform Mediation',
            timeframe: '7 days',
            mediator: 'M-Pesewa Somalia Dispute Team',
            outcome: 'Platform recommendation'
        },

        step3: {
            name: 'Arbitration',
            timeframe: '30 days',
            mediator: 'Somali Chamber of Commerce Arbitration',
            cost: 'Shared between parties',
            binding: true
        },

        step4: {
            name: 'Legal Action',
            timeframe: 'As per court schedule',
            venue: 'Somali Courts in Mogadishu',
            governingLaw: 'Somali Contract Law'
        }
    },

    // ============================================
    // 9️⃣ USER ACKNOWLEDGEMENTS (MANDATORY)
    // ============================================
    acknowledgements: [
        'I am a resident of Somalia and will use this platform only within Somalia.',
        'I understand all transactions are in Somali Shillings (SOS) only.',
        'I acknowledge the risks of peer-to-peer lending as disclosed.',
        'I agree to Somali law governing all platform activities.',
        'I consent to data collection and processing as described.',
        'I understand platform role and limitations as stated.',
        'I accept subscription terms for lenders and free access for borrowers.'
    ],

    // ============================================
    // 🔟 LEGAL ENFORCEMENT FUNCTIONS
    // ============================================
    enforcement: {
        /**
         * Validate user acceptance of Somalia terms
         * @param {Object} user - User object
         * @returns {boolean} - True if accepted
         */
        validateTermsAcceptance: (user) => {
            const requiredAcceptances = [
                'termsAndConditions',
                'privacyPolicy',
                'riskDisclosure',
                'fairPractices'
            ];
            
            return requiredAcceptances.every(term => 
                user.legalAcceptances && user.legalAcceptances[term] === true
            );
        },

        /**
         * Get required legal documents for user type
         * @param {string} userType - 'borrower' or 'lender'
         * @returns {Array} - Required documents
         */
        getRequiredDocuments: (userType) => {
            const baseDocs = [
                'Somali National ID (front and back)',
                'Proof of Somali Address',
                'Recent Photograph'
            ];
            
            if (userType === 'lender') {
                baseDocs.push('Income Proof (optional for Basic tier)');
                baseDocs.push('Bank Statement (for Premium+ tiers)');
            }
            
            return baseDocs;
        },

        /**
         * Check if transaction requires regulatory reporting
         * @param {number} amount - Transaction amount in SOS
         * @returns {boolean} - True if requires reporting
         */
        requiresRegulatoryReporting: (amount) => {
            const reportingThresholds = {
                cbs: 1000000, // 1 million SOS
                aml: 500000,  // 500k SOS
                suspicious: 2000000 // 2 million SOS
            };
            
            return amount >= reportingThresholds.aml;
        },

        /**
         * Calculate tax withholding for interest income
         * @param {number} interestAmount - Interest in SOS
         * @returns {Object} - Tax calculation
         */
        calculateWithholdingTax: (interestAmount) => {
            const taxRate = 0.05; // 5%
            const annualThreshold = 100000;
            
            let taxable = interestAmount;
            let tax = 0;
            
            // Only tax if above annual threshold
            if (interestAmount > annualThreshold) {
                tax = taxable * taxRate;
            }
            
            return {
                taxableAmount: taxable,
                taxRate: taxRate,
                taxAmount: tax,
                netAmount: interestAmount - tax
            };
        }
    },

    // ============================================
    // 1️⃣1️⃣ COMPLIANCE MONITORING
    // ============================================
    complianceMonitoring: {
        kycExpiry: 'Annual re-verification required',
        amlMonitoring: 'Real-time transaction monitoring',
        sanctionScreening: 'Daily screening against Somali sanction lists',
        auditTrail: 'Immutable record of all legal acceptances',
        complianceReports: [
            'Monthly CBS compliance report',
            'Quarterly AML/CFT report',
            'Annual financial audit',
            'Bi-annual security audit'
        ]
    }
};

// ============================================
// LEGAL VALIDATION FUNCTIONS
// ============================================
const validateLegalRequirements = (user, transaction) => {
    const errors = [];
    
    // User must have accepted all terms
    if (!SomaliaLegal.enforcement.validateTermsAcceptance(user)) {
        errors.push('User has not accepted all required legal terms');
    }
    
    // User must be Somalia resident
    if (user.country !== 'SO') {
        errors.push('User must be Somalia resident');
    }
    
    // Transaction must be in SOS
    if (transaction.currency !== 'SOS') {
        errors.push('Transactions must be in Somali Shillings (SOS)');
    }
    
    // User must have valid Somali ID
    if (!user.verification.somaliIdVerified) {
        errors.push('Somali National ID verification required');
    }
    
    // Check regulatory reporting requirements
    if (SomaliaLegal.enforcement.requiresRegulatoryReporting(transaction.amount)) {
        errors.push('Transaction requires regulatory reporting');
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
};

// ============================================
// LEGAL DOCUMENT GENERATION
// ============================================
const generateLegalDocuments = {
    /**
     * Generate loan agreement for Somalia
     * @param {Object} loan - Loan details
     * @returns {string} - HTML agreement
     */
    generateLoanAgreement: (loan) => {
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>M-PESEWA SOMALIA LOAN AGREEMENT</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; }
                .header { text-align: center; margin-bottom: 30px; }
                .section { margin-bottom: 20px; }
                .signature { margin-top: 50px; }
                .footer { margin-top: 50px; font-size: 12px; color: #666; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>M-PESEWA SOMALIA</h1>
                <h2>PEER-TO-PEER LOAN AGREEMENT</h2>
                <p><strong>Agreement Date:</strong> ${new Date().toLocaleDateString('en-SO')}</p>
                <p><strong>Agreement ID:</strong> SO-LA-${Date.now()}</p>
            </div>
            
            <div class="section">
                <h3>1. PARTIES</h3>
                <p><strong>Lender:</strong> ${loan.lenderName}</p>
                <p><strong>Borrower:</strong> ${loan.borrowerName}</p>
                <p><strong>Group:</strong> ${loan.groupName} (Somalia-only)</p>
            </div>
            
            <div class="section">
                <h3>2. LOAN TERMS</h3>
                <p><strong>Principal Amount:</strong> ${loan.amount.toLocaleString()} SOS</p>
                <p><strong>Interest Rate:</strong> 10% (fixed)</p>
                <p><strong>Repayment Period:</strong> 7 days</p>
                <p><strong>Disbursement Date:</strong> ${loan.disbursementDate}</p>
                <p><strong>Due Date:</strong> ${loan.dueDate}</p>
            </div>
            
            <div class="section">
                <h3>3. PENALTIES & DEFAULT</h3>
                <p><strong>Late Payment Penalty:</strong> 5% daily on outstanding balance after 7 days</p>
                <p><strong>Default Period:</strong> 60 days from disbursement</p>
                <p><strong>Blacklist:</strong> Automatic after 60 days of non-payment</p>
            </div>
            
            <div class="section">
                <h3>4. SOMALIA-SPECIFIC TERMS</h3>
                <p>• This agreement is governed by Somali Law</p>
                <p>• All amounts in Somali Shillings (SOS)</p>
                <p>• Disputes subject to Somali courts in Mogadishu</p>
                <p>• Platform role: Technology facilitator only</p>
            </div>
            
            <div class="signature">
                <p>_________________________</p>
                <p><strong>Lender Signature</strong></p>
                <p>Date: ___________________</p>
                
                <p style="margin-top: 30px;">_________________________</p>
                <p><strong>Borrower Signature</strong></p>
                <p>Date: ___________________</p>
            </div>
            
            <div class="footer">
                <p><strong>M-PESEWA SOMALIA</strong></p>
                <p>License: CBS/FI/2023/MP-0456</p>
                <p>Contact: +252 63 0000000 | somalia@mpesewa.com</p>
                <p>This is a computer-generated agreement. No physical signature required.</p>
            </div>
        </body>
        </html>
        `;
    },
    
    /**
     * Generate privacy notice for Somalia
     * @returns {string} - Privacy notice
     */
    generatePrivacyNotice: () => {
        return `
        PRIVACY NOTICE - SOMALIA
        
        Data Controller: M-Pesewa Somalia Operations
        Purpose: Peer-to-peer lending platform operations
        Legal Basis: Contract, Legal Obligation, Legitimate Interest
        
        We collect:
        • Personal identification data
        • Financial transaction data
        • Device and usage data
        
        We share with:
        • Central Bank of Somalia (regulatory)
        • Somali authorities (when required by law)
        • Service providers (under strict contracts)
        
        Data Retention: 7 years
        Your Rights: Access, Correction, Deletion, Portability, Objection
        
        Contact DPO: privacy.somalia@mpesewa.com
        `;
    }
};

// ============================================
// EXPORT MODULE
// ============================================
module.exports = {
    // Main legal configuration
    legal: SomaliaLegal,
    
    // Validation functions
    validateLegal: validateLegalRequirements,
    
    // Document generators
    documents: generateLegalDocuments,
    
    // Compliance utilities
    compliance: {
        /**
         * Check if user needs tax documentation
         * @param {Object} user - User object
         * @param {number} annualInterest - Annual interest income
         * @returns {boolean} - True if needs tax docs
         */
        needsTaxDocumentation: (user, annualInterest) => {
            return user.role === 'lender' && annualInterest > 100000;
        },
        
        /**
         * Get next compliance deadline
         * @returns {Object} - Next deadline
         */
        getNextDeadline: () => {
            const now = new Date();
            const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 5);
            
            return {
                type: 'CBS Monthly Report',
                deadline: nextMonth.toISOString().split('T')[0],
                daysRemaining: Math.ceil((nextMonth - now) / (1000 * 60 * 60 * 24))
            };
        }
    },
    
    // Constants
    CONSTANTS: {
        TAX_RATE: 0.05,
        REPORTING_THRESHOLD: 500000,
        KYC_EXPIRY_DAYS: 365,
        CBS_LICENSE: 'CBS/FI/2023/MP-0456',
        GOVERNING_LAW: 'Somali Law',
        JURISDICTION: 'Courts of Mogadishu, Somalia'
    }
};

// ============================================
// INITIALIZATION
// ============================================
(() => {
    console.log('🇸🇴 Somalia Legal Module Loaded');
    console.log('   License: CBS/FI/2023/MP-0456');
    console.log('   Governing Law: Somali Law');
    console.log('   Tax Rate: 5% withholding');
    console.log('   Reporting Threshold: 500,000 SOS');
})();