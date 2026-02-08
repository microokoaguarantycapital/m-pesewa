/**
 * M-PESEWA ETHIOPIA LEGAL FRAMEWORK
 * Compliance with Ethiopian laws and regulations
 * Last Updated: 2024-01-24
 * Version: 1.0.0
 */

const EthiopiaLegal = {
    // ============================================
    // 1️⃣ GOVERNING LAW & JURISDICTION
    // ============================================
    jurisdiction: {
        country: 'Ethiopia',
        governingLaw: 'Laws of the Federal Democratic Republic of Ethiopia',
        jurisdictionClause: `
            Any dispute arising out of or in connection with these Terms and Conditions, 
            including any question regarding its existence, validity or termination, 
            shall be referred to and finally resolved by arbitration in Addis Ababa, 
            Ethiopia under the Ethiopian Arbitration and Conciliation Rules.
        `,
        venue: 'Addis Ababa, Ethiopia',
        language: 'English (prevailing)',
        noticeRequirements: {
            written: true,
            deliveryMethods: ['Email', 'Registered Post', 'Platform Notification'],
            deemedReceipt: '24 hours after sending'
        }
    },

    // ============================================
    // 2️⃣ TERMS & CONDITIONS (ETHIOPIA SPECIFIC)
    // ============================================
    termsAndConditions: {
        effectiveDate: '2024-01-01',
        version: '1.0',
        acceptance: {
            method: 'Explicit click-through agreement',
            minimumAge: 18,
            capacity: 'Full legal capacity required',
            electronicSignature: true
        },

        platformRole: {
            disclaimer: `
                M-Pesewa Ethiopia is a technology platform provider only. 
                We are not a bank, not a lender, not a borrower, and do not hold user funds.
                All transactions are peer-to-peer between users within their trusted groups.
            `,
            limitations: [
                'No guarantee of repayment',
                'No insurance on loans',
                'No fund holding',
                'No credit scoring service'
            ]
        },

        userResponsibilities: {
            borrowers: [
                'Provide accurate personal information',
                'Use funds only for stated emergency purpose',
                'Repay loans within 7 days',
                'Communicate any repayment difficulties',
                'Maintain good standing in groups'
            ],
            lenders: [
                'Verify borrower information',
                'Lend only within means',
                'Maintain active subscription',
                'Update ledgers accurately',
                'Follow group lending rules'
            ]
        },

        prohibitedActivities: [
            'Money laundering',
            'Fraudulent misrepresentation',
            'Harassment of other users',
            'Circumventing country isolation',
            'Using platform for illegal purposes',
            'Creating fake groups or identities',
            'Manipulating ratings system',
            'Sharing login credentials'
        ],

        termination: {
            byUser: '30 days written notice',
            byPlatform: 'Immediate for violations',
            effects: [
                'Active loans must be settled',
                'Subscription fees non-refundable',
                'Data retention per policy',
                'Blacklist status maintained if applicable'
            ]
        }
    },

    // ============================================
    // 3️⃣ PRIVACY POLICY (GDPR + ETHIOPIA COMPLIANT)
    // ============================================
    privacyPolicy: {
        dataController: 'M-Pesewa Technology Pvt. Ltd.',
        dataProtectionOfficer: 'dpo.et@mpesewa.com',
        lawfulBasis: {
            processing: 'Contractual necessity, legitimate interests, consent',
            specialCategories: 'Explicit consent required'
        },

        dataCollection: {
            personalData: [
                'Full name',
                'National ID number',
                'Date of birth',
                'Phone number',
                'Email address',
                'Location data',
                'Financial information',
                'Device information'
            ],
            sensitiveData: [
                'Biometric data (with consent)',
                'Financial transaction history',
                'Credit information'
            ],
            automatedCollection: [
                'IP address',
                'Browser type',
                'Device type',
                'Usage patterns',
                'Transaction history'
            ]
        },

        dataUsage: {
            purposes: [
                'Account management',
                'Transaction processing',
                'Risk assessment',
                'Compliance reporting',
                'Service improvement',
                'Marketing (with consent)'
            ],
            limitations: [
                'No sale to third parties',
                'No unauthorized sharing',
                'Purpose limitation',
                'Data minimization'
            ]
        },

        dataSharing: {
            thirdParties: [
                {
                    name: 'National Bank of Ethiopia',
                    purpose: 'Regulatory reporting',
                    legalBasis: 'Legal obligation'
                },
                {
                    name: 'Ethio Telecom',
                    purpose: 'User verification',
                    legalBasis: 'Consent'
                },
                {
                    name: 'Payment processors',
                    purpose: 'Transaction processing',
                    legalBasis: 'Contractual necessity'
                }
            ],
            internationalTransfers: {
                allowed: false, // Data must remain in Ethiopia
                exceptions: ['Regulatory requirements with approval']
            }
        },

        dataRights: {
            access: 'Right to access personal data',
            rectification: 'Right to correct inaccurate data',
            erasure: 'Right to be forgotten (with limitations)',
            restriction: 'Right to restrict processing',
            portability: 'Right to data portability',
            objection: 'Right to object to processing',
            automatedDecisions: 'Right to human intervention'
        },

        dataRetention: {
            activeUsers: '7 years from last activity',
            loanRecords: '7 years from loan completion',
            financialRecords: '10 years for tax purposes',
            deletedAccounts: '30 days then anonymization'
        },

        securityMeasures: [
            'Encryption at rest and in transit',
            'Access controls and authentication',
            'Regular security audits',
            'Incident response plan',
            'Employee training',
            'Physical security measures'
        ]
    },

    // ============================================
    // 4️⃣ FINANCIAL REGULATIONS COMPLIANCE
    // ============================================
    financialRegulations: {
        nbeCompliance: {
            license: 'Digital Financial Service Provider License (Pending)',
            capitalRequirements: 'ETB 10,000,000 minimum capital',
            liquidityRequirements: 'Maintain 20% reserve ratio',
            reporting: {
                daily: 'Transaction summary',
                weekly: 'Liquidity report',
                monthly: 'Financial statements',
                quarterly: 'Compliance report',
                annual: 'Audited financials'
            },
            audit: {
                frequency: 'Annual',
                auditor: 'NBE-approved auditing firm',
                scope: 'Financial and compliance audit'
            }
        },

        antiMoneyLaundering: {
            framework: 'Proclamation No. 780/2013',
            requirements: [
                'Customer Due Diligence (CDD)',
                'Enhanced Due Diligence (EDD) for high-risk',
                'Transaction monitoring',
                'Suspicious Activity Reporting (SAR)',
                'Record keeping (7 years)',
                'Employee training'
            ],
            thresholds: {
                cddRequired: 'All users',
                eddRequired: 'Transactions > ETB 50,000',
                sarThreshold: 'Suspicious transactions any amount'
            }
        },

        consumerProtection: {
            law: 'Trade Competition and Consumer Protection Proclamation No. 813/2013',
            rights: [
                'Right to clear information',
                'Right to fair terms',
                'Right to privacy',
                'Right to redress',
                'Right to cancel within cooling-off period'
            ],
            coolingOffPeriod: '24 hours for new subscriptions',
            disputeResolution: 'Platform mediation first, then arbitration'
        },

        taxCompliance: {
            vat: {
                rate: '15%',
                registration: 'Required for platform fees',
                filing: 'Monthly returns'
            },
            withholdingTax: {
                rate: '2% on lender earnings',
                collection: 'Platform responsibility',
                remittance: 'Monthly to ERCA'
            },
            incomeTax: {
                lenders: 'Responsibility of individual lenders',
                platform: 'Corporate income tax 30%'
            }
        }
    },

    // ============================================
    // 5️⃣ LENDING & BORROWING REGULATIONS
    // ============================================
    lendingRegulations: {
        interestRateCap: {
            legalMaximum: '15% per annum',
            platformRate: '10% per week (not annualized)',
            justification: 'Short-term emergency loans, not comparable to annual rates'
        },

        loanTerms: {
            maximumDuration: '7 days (by platform policy)',
            minimumDuration: '1 day',
            rollovers: 'Not permitted',
            refinancing: 'Not permitted',
            multipleLoans: 'One active loan per group at a time'
        },

        defaultManagement: {
            gracePeriod: '3 days after due date',
            penalty: '5% daily after day 7',
            defaultDeclaration: 'After 60 days',
            collection: 'Through vetted debt collectors',
            creditReporting: 'To CRB Ethiopia for defaults > ETB 5,000'
        },

        groupLendingRules: {
            liability: 'Individual, not joint',
            guarantees: 'Personal guarantees from referrers',
            groupRules: 'Supplementary to platform rules',
            disputeResolution: 'Group admin first, then platform admin'
        }
    },

    // ============================================
    // 6️⃣ ELECTRONIC TRANSACTIONS & SIGNATURES
    // ============================================
    electronicTransactions: {
        legalFramework: 'Electronic Signature Proclamation No. 1072/2018',
        acceptance: {
            methods: ['Click-through', 'Digital signature', 'Biometric'],
            validity: 'Legally binding',
            evidence: 'Digital audit trail maintained'
        },

        recordKeeping: {
            requirement: 'All electronic records maintained',
            format: 'Tamper-evident digital format',
            retention: '7 years minimum',
            accessibility: 'Available to users upon request'
        },

        authentication: {
            levels: ['Basic (password)', 'Enhanced (OTP)', 'Strong (biometric)'],
            requirements: 'Appropriate to transaction value'
        }
    },

    // ============================================
    // 7️⃣ DISPUTE RESOLUTION MECHANISM
    // ============================================
    disputeResolution: {
        escalationPath: {
            level1: 'Direct negotiation between parties (3 days)',
            level2: 'Group admin mediation (2 days)',
            level3: 'Platform customer support (2 days)',
            level4: 'Platform arbitration team (3 days)',
            level5: 'Formal arbitration (30 days)'
        },

        arbitration: {
            rules: 'Ethiopian Arbitration and Conciliation Rules',
            arbitrator: 'Single arbitrator appointed by platform',
            venue: 'Addis Ababa',
            language: 'English',
            costs: 'Shared equally, winner may recover',
            binding: true
        },

        smallClaims: {
            threshold: 'ETB 10,000',
            procedure: 'Simplified online procedure',
            timeline: '14 days resolution target',
            cost: 'No fee for claims under threshold'
        }
    },

    // ============================================
    // 8️⃣ RISK DISCLOSURES & WARNINGS
    // ============================================
    riskDisclosures: {
        forLenders: [
            'Risk of total loss of principal',
            'No guarantee of repayment',
            'Platform does not insure loans',
            'Default risk exists',
            'Limited recourse options',
            'Subscription required to lend'
        ],

        forBorrowers: [
            'High cost of borrowing for emergencies only',
            'Penalties for late repayment',
            'Default affects credit rating',
            'Blacklisting consequences',
            'Personal guarantees required',
            'Referrers may be contacted'
        ],

        general: [
            'Platform technology risk',
            'Regulatory changes risk',
            'Cybersecurity risk',
            'Operational risk',
            'Market risk'
        ],

        acknowledgment: `
            By using M-Pesewa Ethiopia, you acknowledge that you have read, understood, 
            and accept these risks. You agree that M-Pesewa is not liable for financial 
            losses arising from peer-to-peer lending activities.
        `
    },

    // ============================================
    // 9️⃣ INTELLECTUAL PROPERTY RIGHTS
    // ============================================
    intellectualProperty: {
        platformIP: {
            ownership: 'M-Pesewa Technology Pvt. Ltd.',
            rights: [
                'Software code',
                'Platform design',
                'Brand trademarks',
                'Business processes',
                'User interface',
                'Documentation'
            ],
            license: 'Limited, non-exclusive, non-transferable',
            restrictions: [
                'No reverse engineering',
                'No copying',
                'No derivative works',
                'No commercial use without license'
            ]
        },

        userContent: {
            license: 'Non-exclusive, royalty-free license to platform',
            purpose: 'Operation of service only',
            userRights: 'Retain ownership of original content'
        }
    },

    // ============================================
    // 🔟 LIMITATION OF LIABILITY
    // ============================================
    liability: {
        exclusions: [
            'Loss of profits',
            'Loss of business',
            'Loss of data',
            'Consequential damages',
            'Indirect damages',
            'Punitive damages'
        ],

        caps: {
            totalLiability: 'ETB 10,000 per user per year',
            subscriptionFee: 'Limited to refund of current subscription',
            serviceInterruption: 'No liability for downtime'
        },

        indemnification: `
            You agree to indemnify, defend, and hold harmless M-Pesewa Ethiopia, 
            its affiliates, officers, directors, employees, and agents from any 
            claims, liabilities, damages, losses, or expenses arising from:
            1. Your use of the platform
            2. Your violation of these terms
            3. Your lending or borrowing activities
            4. Any content you provide
        `
    },

    // ============================================
    // 1️⃣1️⃣ FORCE MAJEURE
    // ============================================
    forceMajeure: {
        definition: `
            Events beyond reasonable control including but not limited to:
            acts of God, war, terrorism, riots, embargoes, acts of civil 
            or military authorities, fire, floods, accidents, strikes, 
            shortages of transportation facilities, fuel, energy, labor 
            or materials, epidemics, pandemics, government orders, or 
            any other event beyond the control of the parties.
        `,
        effects: [
            'Suspension of obligations',
            'No liability for non-performance',
            'Reasonable efforts to resume',
            'Notification required within 7 days'
        ]
    },

    // ============================================
    // 1️⃣2️⃣ AMENDMENT PROCEDURE
    // ============================================
    amendments: {
        noticePeriod: '30 days for material changes',
        notificationMethods: ['Email', 'Platform notification', 'Website posting'],
        userConsent: {
            minor: 'Continued use constitutes acceptance',
            major: 'Explicit consent required for material changes'
        },
        effectiveDate: '30 days after notification',
        historicalVersions: 'Maintained for 7 years'
    },

    // ============================================
    // 1️⃣3️⃣ SEVERABILITY
    // ============================================
    severability: `
        If any provision of these Terms and Conditions is held to be invalid, 
        illegal, or unenforceable by a court of competent jurisdiction, such 
        provision shall be severed and the remaining provisions shall remain 
        in full force and effect to the maximum extent permitted by law.
    `,

    // ============================================
    // 1️⃣4️⃣ WAIVER
    // ============================================
    waiver: `
        No failure or delay by M-Pesewa Ethiopia in exercising any right, 
        power, or privilege under these Terms and Conditions shall operate 
        as a waiver thereof, nor shall any single or partial exercise of 
        any right, power, or privilege preclude any other or further exercise 
        thereof or the exercise of any other right, power, or privilege.
    `,

    // ============================================
    // 1️⃣5️⃣ ENTIRE AGREEMENT
    // ============================================
    entireAgreement: `
        These Terms and Conditions, together with the Privacy Policy and 
        any other legal notices published by M-Pesewa Ethiopia on the platform, 
        shall constitute the entire agreement between you and M-Pesewa Ethiopia 
        concerning the platform and services.
    `,

    // ============================================
    // 1️⃣6️⃣ CONTACT INFORMATION
    // ============================================
    contacts: {
        legalDepartment: {
            email: 'legal.et@mpesewa.com',
            phone: '+251 11 000 0001',
            address: 'Legal Department, M-Pesewa Ethiopia, Bole Road, Addis Ababa',
            hours: 'Mon-Fri 9:00-17:00'
        },
        dataProtectionOfficer: {
            email: 'dpo.et@mpesewa.com',
            phone: '+251 11 000 0002'
        },
        regulatoryCompliance: {
            email: 'compliance.et@mpesewa.com',
            phone: '+251 11 000 0003'
        }
    }
};

// ============================================
// LEGAL VALIDATION FUNCTIONS
// ============================================

EthiopiaLegal.validateUserAge = function(birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        return age - 1 >= 18;
    }
    return age >= 18;
};

EthiopiaLegal.calculateLegalInterest = function(principal, days) {
    // Ethiopian legal maximum is 15% per annum
    const annualRate = 0.15;
    const dailyRate = annualRate / 365;
    return principal * dailyRate * days;
};

EthiopiaLegal.isCompliantLoan = function(loanAmount, interest, durationDays) {
    // Check if loan terms are legally compliant
    const annualizedRate = (interest / loanAmount) * (365 / durationDays);
    return annualizedRate <= 0.15; // 15% annual maximum
};

EthiopiaLegal.generateLegalDisclaimer = function() {
    return `
        IMPORTANT LEGAL DISCLAIMER - ETHIOPIA
        
        M-Pesewa Ethiopia operates under Ethiopian law. Key points:
        
        1. Platform Role: We are a technology platform, not a financial institution.
        2. No Guarantees: We do not guarantee loan repayment or investment returns.
        3. User Responsibility: All lending and borrowing is at your own risk.
        4. Regulatory Compliance: We comply with National Bank of Ethiopia regulations.
        5. Data Protection: We adhere to Ethiopian data protection laws.
        
        By using this platform, you acknowledge and accept these terms.
        Full terms available at: https://mpesewa.com/et/terms
    `;
};

// ============================================
// COMPLIANCE CHECKING
// ============================================

EthiopiaLegal.checkAMLCompliance = function(transaction) {
    const redFlags = [];
    
    // Check for suspicious patterns
    if (transaction.amount > 50000) {
        redFlags.push('Transaction above EDD threshold');
    }
    
    if (transaction.frequency > 10) {
        redFlags.push('High frequency transactions');
    }
    
    if (transaction.unusualPattern) {
        redFlags.push('Unusual transaction pattern');
    }
    
    return {
        compliant: redFlags.length === 0,
        redFlags,
        requiresSAR: redFlags.length > 0
    };
};

EthiopiaLegal.getTaxWithholding = function(lenderEarnings) {
    // 2% withholding tax on lender earnings
    return lenderEarnings * 0.02;
};

// ============================================
// DISPUTE RESOLUTION PROCESS
// ============================================

EthiopiaLegal.initiateDisputeResolution = function(dispute) {
    const steps = [
        {
            step: 1,
            action: 'Direct negotiation',
            timeframe: '3 days',
            responsible: 'Parties involved'
        },
        {
            step: 2,
            action: 'Group admin mediation',
            timeframe: '2 days',
            responsible: 'Group admin'
        },
        {
            step: 3,
            action: 'Platform customer support',
            timeframe: '2 days',
            responsible: 'Platform support'
        },
        {
            step: 4,
            action: 'Platform arbitration',
            timeframe: '3 days',
            responsible: 'Platform arbitration team'
        },
        {
            step: 5,
            action: 'Formal arbitration',
            timeframe: '30 days',
            responsible: 'Appointed arbitrator'
        }
    ];
    
    return {
        disputeId: `DIS-ET-${Date.now()}`,
        steps,
        estimatedCompletion: '40 days max',
        cost: dispute.amount <= 10000 ? 'Free' : 'Shared costs'
    };
};

// ============================================
// EXPORT
// ============================================

// Freeze object to prevent modifications
Object.freeze(EthiopiaLegal);

// Export the legal framework
export default EthiopiaLegal;

// For CommonJS compatibility
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EthiopiaLegal;
}