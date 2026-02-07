/**
 * M-PESEWA GHANA LEGAL FRAMEWORK
 * Country-specific legal terms, compliance, and regulatory requirements
 * Last Updated: 2024
 * Version: 1.0.0
 * 
 * ✅ COMPLIANCE: Bank of Ghana Regulations, Data Protection Act 2012
 * ✅ JURISDICTION: Ghanaian Courts exclusive jurisdiction
 * ✅ GOVERNING LAW: Laws of Ghana
 * ✅ DISPUTE RESOLUTION: Arbitration in Accra, Ghana
 */

const GHANA_LEGAL = {
    // ============================================
    // 1️⃣ GOVERNING LAW & JURISDICTION
    // ============================================
    jurisdiction: {
        country: 'Ghana',
        governingLaw: 'Laws of the Republic of Ghana',
        exclusiveJurisdiction: 'Courts of Ghana',
        arbitrationLocation: 'Accra, Ghana',
        arbitrationBody: 'Ghana Arbitration Centre',
        language: 'English',
        currency: 'Ghanaian Cedi (GHS)'
    },

    // ============================================
    // 2️⃣ TERMS & CONDITIONS (GHANA SPECIFIC)
    // ============================================
    terms: {
        acceptance: {
            method: 'Electronic acceptance',
            ageRequirement: 18,
            capacity: 'Full legal capacity under Ghanaian law',
            bindingNature: 'Legally binding agreement enforceable in Ghana'
        },

        platformRole: {
            disclaimer: 'M-Pesewa is not a financial institution under Bank of Ghana Act, 2004 (Act 673)',
            serviceDescription: 'Technology platform facilitating peer-to-peer lending in trusted circles',
            nonBankStatus: 'Not licensed as a bank, deposit-taking institution, or money transfer service',
            fundHandling: 'No funds handled, stored, or transmitted by platform',
            liabilityLimitation: 'Limited to technology service provision only'
        },

        userObligations: {
            truthfulness: 'Provide accurate information per Data Protection Act, 2012',
            compliance: 'Comply with all applicable Ghanaian laws and regulations',
            nonFraud: 'No fraudulent activities under Ghana Criminal Code, 1960 (Act 29)',
            taxCompliance: 'Responsible for own tax obligations per Ghana Revenue Authority',
            dataAccuracy: 'Maintain accurate and current profile information'
        }
    },

    // ============================================
    // 3️⃣ DATA PROTECTION & PRIVACY
    // ============================================
    dataProtection: {
        applicableLaw: 'Data Protection Act, 2012 (Act 843)',
        dataController: 'M-Pesewa Ghana Operations',
        registration: 'Registered with Data Protection Commission of Ghana',
        registrationNumber: 'DPC/REG/XXXX/2024',

        dataCollection: {
            purpose: 'Facilitating peer-to-peer lending transactions',
            basis: 'Consent, contractual necessity, legitimate interest',
            categories: [
                'Identity data (Ghana Card, passport)',
                'Contact data (phone, email, address)',
                'Financial data (transaction history)',
                'Technical data (IP address, device info)',
                'Profile data (preferences, ratings)'
            ],
            minimization: 'Only data necessary for service provision'
        },

        dataRights: {
            access: 'Right to access personal data',
            rectification: 'Right to correct inaccurate data',
            erasure: 'Right to delete data (with limitations)',
            restriction: 'Right to restrict processing',
            portability: 'Right to data portability',
            objection: 'Right to object to processing',
            automatedDecisions: 'Right to human intervention'
        },

        dataSharing: {
            withinGroups: 'Shared with group members for transaction purposes',
            legalRequirements: 'Shared with authorities per court orders',
            serviceProviders: 'Shared with necessary service providers',
            crossBorder: 'Limited to within Ghana unless explicit consent',
            retentionPeriod: '7 years minimum as per Ghanaian law'
        },

        securityMeasures: [
            'Encryption of sensitive data',
            'Access controls and authentication',
            'Regular security audits',
            'Employee data protection training',
            'Incident response procedures'
        ]
    },

    // ============================================
    // 4️⃣ FINANCIAL REGULATIONS
    // ============================================
    financialRegulations: {
        bankOfGhana: {
            applicableActs: [
                'Bank of Ghana Act, 2002 (Act 612)',
                'Payment Systems and Services Act, 2019 (Act 987)',
                'Anti-Money Laundering Act, 2020 (Act 1044)',
                'Credit Reporting Act, 2007 (Act 726)'
            ],
            exemptions: [
                'Not requiring deposit-taking license (no funds held)',
                'Not requiring money transfer license (peer-to-peer only)',
                'Not requiring banking license (technology platform only)'
            ],
            compliance: [
                'Monthly transaction reporting',
                'Suspicious activity reporting',
                'Customer due diligence',
                'Record keeping (10 years)'
            ]
        },

        antiMoneyLaundering: {
            policy: 'AML/CFT Policy compliant with Act 1044',
            riskAssessment: 'Country risk: Medium',
            customerDueDiligence: {
                simplified: 'For loans under GH₵1,000',
                standard: 'For loans GH₵1,000 - GH₵10,000',
                enhanced: 'For loans over GH₵10,000'
            },
            reporting: {
                threshold: 'Suspicious transactions regardless of amount',
                timeframe: 'Within 3 working days',
                authority: 'Financial Intelligence Centre Ghana'
            },
            training: 'Annual AML training for all staff'
        },

        creditReporting: {
            applicableAct: 'Credit Reporting Act, 2007 (Act 726)',
            bureaus: [
                'XDS Data Ghana Limited',
                'Dun & Bradstreet Ghana',
                'Creditinfo Ghana'
            ],
            consent: 'Explicit user consent required',
            dataSharing: 'Only default data after 60 days',
            userRights: [
                'Right to access credit report',
                'Right to dispute inaccuracies',
                'Right to explanation of adverse decisions',
                'Right to be forgotten (after settlement)'
            ]
        }
    },

    // ============================================
    // 5️⃣ TAXATION & REVENUE
    // ============================================
    taxation: {
        ghanaRevenueAuthority: {
            registration: 'Registered for tax purposes in Ghana',
            tin: 'CXXXXXXXXX',
            vatRegistration: 'VAT registered for lender subscriptions',
            withholdingTaxAgent: 'Registered as withholding tax agent'
        },

        userTaxation: {
            lenderIncome: 'Subject to income tax per Income Tax Act, 2015 (Act 896)',
            withholdingTax: '5% on interest income over GH₵100 per month',
            vat: 'Not applicable to peer-to-peer loans',
            declaration: 'Users responsible for own tax declarations',
            thresholds: {
                annualIncome: 'GH₵3,264 exempt',
                withholdingTax: 'GH₵100 monthly threshold'
            }
        },

        platformTaxation: {
            corporateTax: '25% on subscription income',
            vat: '15% on subscription fees',
            withholdingTax: 'On payments to non-resident service providers',
            filingRequirements: [
                'Monthly VAT returns',
                'Quarterly corporate tax estimates',
                'Annual corporate tax returns',
                'Annual audited financial statements'
            ]
        },

        recordKeeping: {
            duration: '6 years minimum',
            format: 'Electronic records acceptable',
            auditTrail: 'Maintain complete transaction audit trail',
            accessibility: 'Available for GRA audit upon request'
        }
    },

    // ============================================
    // 6️⃣ DISPUTE RESOLUTION
    // ============================================
    disputeResolution: {
        primaryMethod: 'Mediation and arbitration',
        location: 'Accra, Ghana',
        governingRules: 'Alternative Dispute Resolution Act, 2010 (Act 798)',

        escalationPath: {
            level1: 'Direct negotiation between parties',
            level2: 'Group admin mediation (within 7 days)',
            level3: 'Platform mediation service (within 14 days)',
            level4: 'Arbitration at Ghana Arbitration Centre',
            level5: 'Ghanaian courts as last resort'
        },

        arbitration: {
            rules: 'Ghana Arbitration Centre Rules',
            numberArbitrators: 1,
            language: 'English',
            fees: 'Shared equally between parties',
            timeframe: 'Resolution within 90 days',
            binding: 'Final and binding on both parties'
        },

        smallClaims: {
            threshold: 'GH₵5,000',
            forum: 'District Court small claims division',
            procedure: 'Simplified, lawyer not required',
            timeframe: 'Resolution within 30 days'
        },

        classActions: {
            allowed: 'Yes, per Ghana Civil Procedure Rules',
            certification: 'By High Court of Ghana',
            notice: 'Individual notice to all affected users'
        }
    },

    // ============================================
    // 7️⃣ CONSUMER PROTECTION
    // ============================================
    consumerProtection: {
        applicableLaw: 'Consumer Protection Act, 2003 (Act 667)',
        rights: [
            'Right to clear and accurate information',
            'Right to fair and reasonable terms',
            'Right to privacy and data protection',
            'Right to redress for unfair practices',
            'Right to cancel within cooling-off period'
        ],

        coolingOffPeriod: {
            duration: '3 days for new registrations',
            conditions: 'No transactions conducted',
            refund: 'Full subscription refund if applicable',
            process: 'Written notice to support@mpesewa.com.gh'
        },

        unfairPractices: {
            prohibited: [
                'Misleading advertising',
                'Unconscionable contract terms',
                'Excessive interest rates (beyond 10% weekly)',
                'Hidden fees or charges',
                'Unfair debt collection practices'
            ],
            remedies: [
                'Contract cancellation',
                'Refund of amounts paid',
                'Compensation for damages',
                'Corrective advertising'
            ]
        },

        complaints: {
            internalProcess: 'Resolution within 14 days',
            externalBody: 'National Commission on Civic Education',
            escalation: 'Ghanaian courts after exhaustion of remedies',
            noWaiver: 'Consumer rights cannot be waived by contract'
        }
    },

    // ============================================
    // 8️⃣ INTELLECTUAL PROPERTY
    // ============================================
    intellectualProperty: {
        trademarks: {
            registered: [
                'M-PESEWA (Ghana Trademark No. TM/XXXX/2024)',
                'Trusted Circles Lending (Pending)'
            ],
            protection: 'Trademarks Act, 2004 (Act 664)',
            infringement: 'Legal action in Ghanaian courts',
            licensing: 'No user license granted beyond platform use'
        },

        copyright: {
            protection: 'Copyright Act, 2005 (Act 690)',
            ownership: 'M-Pesewa Ghana retains all platform IP',
            userContent: 'Users retain ownership of their content',
            license: 'Non-exclusive license to display user content',
            takedown: 'DMCA-style takedown process available'
        },

        patents: {
            pending: [
                'Peer-to-peer lending algorithm (Patent Pending)',
                'Trust circle matching system (Patent Pending)'
            ],
            jurisdiction: 'Ghana Patents Registry',
            protection: 'Patents Act, 2003 (Act 657)'
        }
    },

    // ============================================
    // 9️⃣ LIABILITY & INDEMNIFICATION
    // ============================================
    liability: {
        platformLiability: {
            limitation: 'Limited to technology service provision',
            exclusion: [
                'No liability for loan defaults',
                'No liability for user misconduct',
                'No liability for system outages (force majeure)',
                'No liability for third-party actions'
            ],
            cap: 'Limited to subscription fees paid in last 6 months'
        },

        userLiability: {
            loans: 'Full responsibility for loans given or received',
            misconduct: 'Liability for fraudulent or illegal activities',
            indemnification: 'Indemnify platform against user-caused claims',
            jointLiability: 'In groups, admin has additional responsibilities'
        },

        forceMajeure: {
            definition: 'Events beyond reasonable control',
            examples: [
                'Government action or regulation change',
                'Natural disasters in Ghana',
                'National strikes or civil unrest',
                'Major telecommunications failure'
            ],
            effect: 'Suspension of services without liability',
            notice: 'Within 24 hours of occurrence'
        }
    },

    // ============================================
    // 🔟 COMPLIANCE MONITORING
    // ============================================
    complianceMonitoring: {
        internalAudit: {
            frequency: 'Quarterly',
            scope: 'All legal and regulatory requirements',
            reporting: 'To Ghana Country Manager and Global Compliance',
            remediation: '30 days to address findings'
        },

        regulatoryReporting: {
            bankOfGhana: 'Monthly transaction volume report',
            dataCommission: 'Annual data protection compliance report',
            revenueAuthority: 'Monthly VAT and quarterly tax returns',
            financialIntelligence: 'Suspicious activity reports as needed'
        },

        userMonitoring: {
            transactionMonitoring: 'Real-time for suspicious patterns',
            kycUpdates: 'Annual review of user information',
            blacklistUpdates: 'Daily synchronization with credit bureaus',
            complianceTraining: 'Annual for all employees'
        }
    }
};

// ============================================
// LEGAL UTILITIES & FUNCTIONS
// ============================================

/**
 * Generate Ghana-specific terms acceptance
 * @param {Object} user - User object
 * @returns {Object} Terms acceptance record
 */
function generateGhanaTermsAcceptance(user) {
    const acceptanceRecord = {
        userId: user.id,
        country: 'GH',
        timestamp: new Date().toISOString(),
        ipAddress: user.ipAddress || 'Not recorded',
        device: user.device || 'Unknown',
        location: user.location || 'Ghana',
        version: '1.0.0',
        specificClausesAccepted: [
            'Data Protection Act 2012 compliance',
            'Bank of Ghana regulations acknowledgment',
            'Ghanaian jurisdiction acceptance',
            'Dispute resolution in Accra',
            'Tax compliance responsibility'
        ],
        legalCapacity: {
            age: user.age >= 18,
            residency: user.country === 'GH',
            mentalCapacity: true, // Assumed unless otherwise indicated
            noDuress: true // Assumed unless otherwise indicated
        },
        electronicSignature: {
            method: 'Click acceptance',
            verification: 'Unique user session',
            storage: 'Encrypted in compliance database',
            retrieval: 'Available for 7 years minimum'
        }
    };

    return acceptanceRecord;
}

/**
 * Check compliance with Ghana data protection requirements
 * @param {Object} dataProcessing - Data processing details
 * @returns {Object} Compliance check result
 */
function checkDataProtectionCompliance(dataProcessing) {
    const requirements = {
        purposeLimitation: dataProcessing.purpose && dataProcessing.purpose.length > 0,
        dataMinimization: dataProcessing.dataFields && dataProcessing.dataFields.length > 0,
        lawfulBasis: ['consent', 'contract', 'legal_obligation', 'legitimate_interest'].includes(dataProcessing.basis),
        securityMeasures: dataProcessing.security && Array.isArray(dataProcessing.security),
        retentionPeriod: dataProcessing.retention && dataProcessing.retention >= 7, // Years
        userRights: dataProcessing.rightsNotice && typeof dataProcessing.rightsNotice === 'string',
        dpoContact: dataProcessing.dpoContact && typeof dataProcessing.dpoContact === 'string'
    };

    const compliant = Object.values(requirements).every(Boolean);
    const missingRequirements = Object.keys(requirements).filter(key => !requirements[key]);

    return {
        compliant,
        requirements,
        missingRequirements,
        score: (Object.values(requirements).filter(Boolean).length / Object.keys(requirements).length) * 100,
        actionsRequired: missingRequirements.map(req => `Implement ${req.replace(/([A-Z])/g, ' $1').toLowerCase()}`)
    };
}

/**
 * Calculate statutory interest limits for Ghana
 * @param {string} loanType - Type of loan
 * @returns {Object} Interest rate limits
 */
function getGhanaInterestLimits(loanType) {
    const limits = {
        'peer_to_peer': {
            maxWeekly: 0.10, // 10% per week
            maxAnnual: 5.20, // 520% annualized (compound)
            statutory: 'No statutory limit for peer-to-peer',
            regulation: 'Contractual freedom subject to unconscionability test'
        },
        'microfinance': {
            maxMonthly: 0.10, // 10% per month
            maxAnnual: 1.20, // 120% annual
            statutory: 'Bank of Ghana microfinance guidelines',
            regulation: 'Licensed microfinance institutions only'
        },
        'bank': {
            maxAnnual: 0.25, // 25% per annum
            statutory: 'Bank of Ghana prime rate + margin',
            regulation: 'Banks and Specialized Deposit-Taking Institutions Act'
        }
    };

    return limits[loanType] || limits.peer_to_peer;
}

/**
 * Generate Ghana court jurisdiction clause
 * @param {string} userType - 'lender' or 'borrower'
 * @returns {string} Jurisdiction clause
 */
function getGhanaJurisdictionClause(userType) {
    const baseClause = `Any dispute arising out of or in connection with this agreement, including any question regarding its existence, validity or termination, shall be referred to and finally resolved by arbitration under the Ghana Arbitration Centre Rules, which Rules are deemed to be incorporated by reference into this clause.
    
    The number of arbitrators shall be one. The seat, or legal place, of arbitration shall be Accra, Ghana. The language to be used in the arbitral proceedings shall be English. The governing law of this agreement shall be the substantive law of Ghana.`;

    if (userType === 'consumer') {
        return `${baseClause}
        
        Notwithstanding the foregoing, you retain the right to bring proceedings in the courts of Ghana for injunctive relief or other interim measures pending arbitration, and you may bring small claims proceedings in the District Court of Ghana for claims not exceeding GH₵5,000.`;
    }

    return baseClause;
}

/**
 * Check AML compliance requirements for transaction
 * @param {Object} transaction - Transaction details
 * @returns {Object} AML requirements
 */
function checkAMLRequirements(transaction) {
    const amount = transaction.amount || 0;
    const userRisk = transaction.userRisk || 'medium';
    
    let requirements = {
        cddLevel: 'simplified',
        documentation: [],
        monitoring: 'standard',
        reporting: 'none'
    };

    // Customer Due Diligence levels
    if (amount > 10000 || userRisk === 'high') {
        requirements.cddLevel = 'enhanced';
        requirements.documentation = [
            'Source of funds verification',
            'Proof of address (utility bill)',
            'Bank statements (3 months)',
            'Tax identification number',
            'Occupation verification'
        ];
        requirements.monitoring = 'enhanced';
    } else if (amount > 1000) {
        requirements.cddLevel = 'standard';
        requirements.documentation = [
            'Ghana Card or passport',
            'Proof of address',
            'Phone number verification'
        ];
        requirements.monitoring = 'standard';
    }

    // Reporting requirements
    if (amount > 50000 || transaction.suspicious) {
        requirements.reporting = 'suspicious_activity';
    } else if (amount > 10000) {
        requirements.reporting = 'threshold_transaction';
    }

    // Record keeping
    requirements.retentionPeriod = amount > 10000 ? 10 : 7; // Years

    return requirements;
}

/**
 * Generate Ghana tax withholding certificate
 * @param {Object} payment - Payment details
 * @returns {Object} Withholding tax certificate
 */
function generateWithholdingTaxCertificate(payment) {
    const { amount, recipient, payer, period } = payment;
    const withholdingRate = 0.05; // 5%
    const withholdingAmount = amount * withholdingRate;
    const netAmount = amount - withholdingAmount;

    const certificate = {
        certificateNumber: `WHC/GH/${Date.now()}`,
        issueDate: new Date().toISOString().split('T')[0],
        payer: {
            name: payer.name,
            tin: payer.tin,
            address: payer.address
        },
        recipient: {
            name: recipient.name,
            tin: recipient.tin,
            address: recipient.address
        },
        paymentDetails: {
            grossAmount: amount,
            description: 'Interest income from peer-to-peer lending',
            period: period || 'Monthly',
            paymentDate: new Date().toISOString().split('T')[0]
        },
        taxDetails: {
            withholdingTaxRate: withholdingRate,
            withholdingTaxAmount: withholdingAmount,
            netAmount: netAmount,
            taxAuthority: 'Ghana Revenue Authority',
            taxType: 'Withholding Tax on Interest'
        },
        compliance: {
            submittedToGRA: false,
            submissionDeadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            certificateValid: true,
            verificationCode: `GHA${Math.random().toString(36).substr(2, 9).toUpperCase()}`
        }
    };

    return certificate;
}

/**
 * Validate Ghana contract for unconscionability
 * @param {Object} contract - Contract terms
 * @returns {Object} Validation result
 */
function validateContractUnconscionability(contract) {
    const redFlags = [];
    const warnings = [];
    const passes = [];

    // Check interest rates
    if (contract.interestRate > 0.10) {
        redFlags.push(`Interest rate (${contract.interestRate * 100}%) exceeds 10% weekly limit`);
    }

    // Check penalty rates
    if (contract.penaltyRate > 0.05) {
        redFlags.push(`Penalty rate (${contract.penaltyRate * 100}%) exceeds 5% daily limit`);
    }

    // Check default period
    if (contract.defaultPeriod < 60) {
        warnings.push(`Default period (${contract.defaultPeriod} days) is less than 60 days`);
    }

    // Check hidden fees
    if (contract.hiddenFees && contract.hiddenFees.length > 0) {
        redFlags.push(`Contains hidden fees: ${contract.hiddenFees.join(', ')}`);
    }

    // Check unilateral modification
    if (contract.unilateralModification) {
        redFlags.push('Contains unilateral modification clause');
    }

    // Check waiver of rights
    if (contract.waivesRights) {
        redFlags.push('Contains waiver of consumer rights');
    }

    // Positive checks
    if (contract.coolingOffPeriod >= 3) {
        passes.push(`Cooling-off period: ${contract.coolingOffPeriod} days`);
    }

    if (contract.disputeResolution === 'arbitration') {
        passes.push('Dispute resolution: Arbitration in Accra');
    }

    if (contract.governingLaw === 'Ghana') {
        passes.push('Governing law: Ghana');
    }

    const result = {
        valid: redFlags.length === 0,
        redFlags,
        warnings,
        passes,
        riskLevel: redFlags.length > 0 ? 'high' : warnings.length > 0 ? 'medium' : 'low',
        recommendation: redFlags.length > 0 
            ? 'Do not proceed - contract contains unconscionable terms'
            : warnings.length > 0
            ? 'Proceed with caution - review recommended terms'
            : 'Safe to proceed - contract terms are reasonable'
    };

    return result;
}

// ============================================
// EXPORT LEGAL FRAMEWORK
// ============================================

export {
    GHANA_LEGAL,
    generateGhanaTermsAcceptance,
    checkDataProtectionCompliance,
    getGhanaInterestLimits,
    getGhanaJurisdictionClause,
    checkAMLRequirements,
    generateWithholdingTaxCertificate,
    validateContractUnconscionability
};

export default GHANA_LEGAL;