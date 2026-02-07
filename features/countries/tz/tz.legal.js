/**
 * Tanzania Legal Framework for M-Pesewa
 * Legal compliance documents, terms, and regulatory requirements
 */

const tzLegal = {
    // ============================================
    // 1. LEGAL ENTITY INFORMATION
    // ============================================
    entity: {
        legalName: 'M-Pesewa Tanzania Limited',
        registrationNumber: 'TZ2024001MP',
        taxIdentificationNumber: 'TIN-001-234-567',
        vatNumber: 'VAT-001-234-567',
        registrationDate: '2024-01-15',
        
        registeredAddress: {
            street: 'Ohio Street',
            building: 'Mlimani City Tower, 3rd Floor',
            city: 'Dar es Salaam',
            region: 'Dar es Salaam',
            postalCode: 'P.O. Box 12345',
            country: 'Tanzania'
        },
        
        operatingAddress: {
            street: 'Samora Avenue',
            building: 'NIC Investment House, 5th Floor',
            city: 'Dar es Salaam',
            region: 'Dar es Salaam'
        },
        
        regulatoryLicenses: [
            {
                name: 'Digital Lending Platform License',
                issuer: 'Bank of Tanzania',
                number: 'BOT/DLP/2024/001',
                issueDate: '2024-02-01',
                expiryDate: '2025-01-31',
                status: 'Active'
            },
            {
                name: 'Data Protection Registration',
                issuer: 'Personal Data Protection Commission',
                number: 'PDPC/2024/001',
                issueDate: '2024-01-20',
                expiryDate: '2025-01-19',
                status: 'Active'
            }
        ]
    },

    // ============================================
    // 2. TERMS AND CONDITIONS (TANZANIA SPECIFIC)
    // ============================================
    termsAndConditions: {
        version: '3.0',
        effectiveDate: '2024-03-01',
        lastUpdated: '2024-03-01',
        
        sections: {
            '1.0': {
                title: 'Platform Role and Disclaimer',
                content: `M-Pesewa Tanzania Limited ("Platform") is a technology platform that facilitates peer-to-peer lending within trusted groups. The Platform is not a bank, financial institution, or money lender. We do not:
                1. Accept deposits from the public
                2. Grant loans directly to borrowers
                3. Hold user funds at any time
                4. Guarantee loan repayments
                5. Provide investment advice
                
                All lending transactions occur directly between users who know each other within their trusted groups.`
            },
            
            '2.0': {
                title: 'Country-Specific Rules (Tanzania)',
                content: `By using M-Pesewa in Tanzania, you agree to:
                1. Comply with all Tanzanian laws and regulations
                2. Use only Tanzanian Shillings (TZS) for all transactions
                3. Maintain Tanzanian residency throughout your membership
                4. Provide accurate National Identification Number (NIDA)
                5. Use only registered mobile money wallets in Tanzania
                
                Cross-border transactions are strictly prohibited.`
            },
            
            '3.0': {
                title: 'User Eligibility Requirements',
                content: `To use M-Pesewa in Tanzania, you must:
                1. Be at least 18 years old
                2. Be a resident of Tanzania
                3. Have a valid National ID (NIDA)
                4. Have an active Tanzanian mobile number
                5. Be invited by an existing trusted group member
                6. Provide two local guarantors from the same group
                7. Agree to community-based verification
                
                The Platform reserves the right to reject any application.`
            },
            
            '4.0': {
                title: 'Loan Terms and Conditions',
                content: `All loans facilitated through M-Pesewa must follow these terms:
                1. Maximum loan duration: 7 days
                2. Interest rate: 10% per loan period
                3. Penalty for late payment: 5% daily after due date
                4. Default period: 60 days (2 months)
                5. Minimum loan amount: TZS 1,000
                6. Maximum loan amount: Based on subscription tier
                7. Repayment: Daily partial payments allowed
                8. Disbursement: Via mobile money within Tanzania only
                
                These terms are non-negotiable.`
            },
            
            '5.0': {
                title: 'Subscription Requirements for Lenders',
                content: `Lenders in Tanzania must:
                1. Subscribe to a lending tier (Basic, Premium, Super)
                2. Pay subscription fees in Tanzanian Shillings
                3. Renew subscription by the 28th of each month
                4. Adhere to tier-specific lending limits
                5. For Super tier: Consent to CRB check
                6. Maintain accurate ledgers for all borrowers
                7. Report defaults within 7 days of due date
                
                Subscription fees are non-refundable.`
            },
            
            '6.0': {
                title: 'Privacy and Data Protection',
                content: `We comply with Tanzania's Personal Data Protection Act, 2022:
                1. We collect only necessary personal data
                2. Data is shared only within your trusted group
                3. You have right to access your data
                4. You have right to request data deletion
                5. We implement appropriate security measures
                6. Data retention: 7 years as required by law
                7. Breach notification within 72 hours
                
                Contact our Data Protection Officer at dpo.tz@mpesewa.com`
            },
            
            '7.0': {
                title: 'Dispute Resolution',
                content: `All disputes shall be resolved as follows:
                1. First attempt: Mediation within the group
                2. Second attempt: Platform mediation
                3. Final resolution: Tanzania Arbitration Centre
                4. Governing law: Laws of Tanzania
                5. Jurisdiction: Courts of Tanzania
                6. Language: English or Swahili
                
                Users waive right to class action lawsuits.`
            },
            
            '8.0': {
                title: 'Limitation of Liability',
                content: `M-Pesewa Tanzania Limited's liability is limited to:
                1. Maximum of subscription fee paid
                2. No liability for loan defaults
                3. No liability for technical issues
                4. No liability for user misconduct
                5. No liability for mobile network failures
                6. No liability for regulatory changes
                7. No liability for force majeure events
                
                Use the platform at your own risk.`
            }
        },
        
        acceptance: {
            method: 'Digital signature with National ID verification',
            required: 'Before first transaction',
            renewal: 'Annual re-acceptance required',
            withdrawal: '30 days notice for account closure'
        }
    },

    // ============================================
    // 3. PRIVACY POLICY (TANZANIA SPECIFIC)
    // ============================================
    privacyPolicy: {
        version: '2.1',
        effectiveDate: '2024-03-01',
        
        dataCollection: {
            mandatory: [
                'Full Name',
                'National ID Number (NIDA)',
                'Date of Birth',
                'Mobile Number',
                'Email Address',
                'Location/Region',
                'Profile Photo',
                'Two Guarantor Contacts'
            ],
            
            optional: [
                'Alternate Phone Number',
                'Occupation',
                'Monthly Income Range',
                'Bank Account Details',
                'Social Media Profiles'
            ],
            
            automatic: [
                'Device Information',
                'IP Address',
                'Location Data',
                'Transaction History',
                'Login Times',
                'Group Activities'
            ]
        },
        
        dataUsage: {
            purposes: [
                'Identity Verification',
                'Creditworthiness Assessment',
                'Group Membership Management',
                'Transaction Processing',
                'Regulatory Compliance',
                'Platform Improvement',
                'Customer Support',
                'Fraud Prevention'
            ],
            
            restrictions: [
                'No sale of personal data',
                'No sharing with third parties for marketing',
                'No unauthorized data processing',
                'No data retention beyond legal requirements'
            ]
        },
        
        dataSharing: {
            withinPlatform: [
                'Group Members (limited profile)',
                'Group Administrators (full profile)',
                'Platform Administrators (all data)',
                'Debt Collectors (default cases only)'
            ],
            
            externalParties: [
                'Bank of Tanzania (regulatory reporting)',
                'Credit Reference Bureau (Super tier only)',
                'Law Enforcement (with court order)',
                'Mobile Money Providers (transaction processing)'
            ],
            
            internationalTransfer: 'Not allowed (data remains in Tanzania)'
        },
        
        userRights: {
            access: 'Right to access personal data',
            correction: 'Right to correct inaccurate data',
            deletion: 'Right to request data deletion',
            restriction: 'Right to restrict processing',
            portability: 'Right to data portability',
            objection: 'Right to object to processing',
            complaint: 'Right to lodge complaint with PDPC'
        },
        
        securityMeasures: [
            'End-to-end encryption',
            'Regular security audits',
            'Access controls and logging',
            'Employee training on data protection',
            'Incident response plan',
            'Data backup and recovery'
        ]
    },

    // ============================================
    // 4. REGULATORY COMPLIANCE
    // ============================================
    regulatoryCompliance: {
        // Bank of Tanzania Requirements
        botRequirements: {
            reporting: {
                frequency: 'Monthly',
                reports: [
                    'User Registration Report',
                    'Transaction Volume Report',
                    'Default Rate Report',
               
                    'Suspicious Activity Report'
                ],
                deadline: '5th of following month'
            },
            
            capitalRequirements: {
                minimumCapital: 'TZS 100,000,000',
                maintained: 'At all times',
                verification: 'Annual audit required'
            },
            
            consumerProtection: {
                disclosure: 'Full terms must be displayed',
                coolingOffPeriod: '24 hours for new registrations',
                complaints: 'Must resolve within 14 days',
                transparency: 'All fees must be clearly stated'
            }
        },
        
        // Anti-Money Laundering (AML)
        amlCompliance: {
            customerDueDiligence: {
                level1: 'Basic KYC for all users',
                level2: 'Enhanced due diligence for large transactions',
                level3: 'Ongoing monitoring for high-risk users'
            },
            
            transactionMonitoring: {
                threshold: 'TZS 1,000,000',
                reporting: 'Suspicious transactions to FIU',
                recordKeeping: '7 years minimum'
            },
            
            training: {
                employees: 'Annual AML training',
                agents: 'Bi-annual training',
                updates: 'Regular regulatory updates'
            }
        },
        
        // Tax Compliance
        taxCompliance: {
            vat: {
                registration: 'VAT registered',
                rate: '18%',
                filing: 'Monthly returns',
                payment: '20th of following month'
            },
            
            withholdingTax: {
                rate: '10% on interest payments',
                filing: 'Monthly returns',
                certificate: 'Issued to recipients'
            },
            
            corporateTax: {
                rate: '30%',
                filing: 'Annual return',
                payment: '31st March following tax year'
            }
        }
    },

    // ============================================
    // 5. DISPUTE RESOLUTION FRAMEWORK
    // ============================================
    disputeResolution: {
        levels: {
            level1: {
                name: 'Group Mediation',
                timeframe: '7 days',
                process: 'Group Admin facilitates resolution',
                outcome: 'Mutual agreement or escalation'
            },
            
            level2: {
                name: 'Platform Mediation',
                timeframe: '14 days',
                process: 'Platform mediator assigned',
                outcome: 'Binding recommendation'
            },
            
            level3: {
                name: 'Arbitration',
                timeframe: '30 days',
                process: 'Tanzania Arbitration Centre',
                outcome: 'Legally binding decision'
            },
            
            level4: {
                name: 'Court Proceedings',
                timeframe: 'As per court schedule',
                process: 'Tanzania Commercial Court',
                outcome: 'Legal judgment'
            }
        },
        
        costs: {
            groupMediation: 'Free',
            platformMediation: 'TZS 50,000 administration fee',
            arbitration: 'Shared costs, capped at TZS 500,000',
            court: 'As per court rules'
        },
        
        bindingClause: `By using M-Pesewa, you agree to attempt mediation and arbitration before pursuing court action. Court jurisdiction is exclusively in Tanzania.`
    },

    // ============================================
    // 6. FAIR LENDING PRACTICES
    // ============================================
    fairLending: {
        nonDiscrimination: {
            prohibitedBasis: [
                'Race or Ethnicity',
                'Gender or Sexual Orientation',
                'Religion',
                'Disability',
                'Marital Status',
                'Age (except minimum requirement)',
                'Political Affiliation'
            ],
            
            equalOpportunity: 'All eligible users have equal access',
            transparency: 'All criteria clearly published',
            appeal: 'Right to appeal rejection'
        },
        
        responsibleLending: {
            affordability: 'Loans must be affordable',
            purpose: 'Only for genuine emergencies',
            coolingOff: '24-hour reconsideration period',
            counseling: 'Referral to financial counseling for defaults'
        },
        
        debtCollection: {
            methods: [
                'Phone calls during business hours',
                'SMS notifications',
                'In-app notifications',
                'Group mediation',
                'Professional debt collectors (registered)'
            ],
            
            prohibited: [
                'Harassment or threats',
                'Contact outside 8am-8pm',
                'Contacting employer without consent',
                'Public shaming',
                'Physical intimidation'
            ],
            
            gracePeriod: '7 days before blacklisting'
        }
    },

    // ============================================
    // 7. RISK DISCLOSURE STATEMENTS
    // ============================================
    riskDisclosures: {
        lenderRisks: [
            'Risk of total loss of principal',
            'Borrower default risk',
            'No platform guarantee',
            'Limited legal recourse',
            'Market and economic risks',
            'Regulatory change risks',
            'Technology and security risks'
        ],
        
        borrowerRisks: [
            'High cost of borrowing (10% weekly)',
            'Penalty charges for late payment',
            'Blacklisting for defaults',
            'Damage to credit reputation',
            'Legal action for recovery',
            'Group exclusion for poor performance'
        ],
        
        platformRisks: [
            'Technical failures',
            'Service interruptions',
            'Security breaches',
            'Regulatory actions',
            'Insolvency risk',
            'Force majeure events'
        ],
        
        acknowledgment: `All users must acknowledge understanding of these risks before transacting. Past performance is not indicative of future results.`
    },

    // ============================================
    // 8. DOCUMENTATION AND RECORD KEEPING
    // ============================================
    documentation: {
        userRecords: {
            retention: '7 years from account closure',
            format: 'Digital with backup',
            access: 'Available upon request',
            destruction: 'Secure deletion after retention period'
        },
        
        transactionRecords: {
            details: [
                'Parties involved',
                'Amount and currency',
                'Date and time',
                'Purpose category',
                'Repayment terms',
                'Status updates'
            ],
            retention: '7 years',
            audit: 'Available for regulatory inspection'
        },
        
        complianceRecords: {
            kycDocuments: 'Indefinite (until account closure + 7 years)',
            amlReports: '7 years',
            taxRecords: '10 years',
            auditTrails: '7 years'
        }
    },

    // ============================================
    // 9. CONTACT AND COMPLAINTS PROCEDURE
    // ============================================
    contactProcedure: {
        channels: {
            phone: '+255 659 073 010 (9am-5pm, Mon-Fri)',
            email: 'complaints.tz@mpesewa.com',
            whatsapp: '+255 659 073 010',
            inApp: 'Support Center',
            postal: 'P.O. Box 12345, Dar es Salaam'
        },
        
        escalation: {
            step1: 'Customer Support (48 hour response)',
            step2: 'Compliance Officer (24 hour response)',
            step3: 'Managing Director (Immediate for serious issues)',
            step4: 'Bank of Tanzania (If not resolved in 30 days)'
        },
        
        resolution: {
            timeframe: '14 days for standard complaints',
            complex: '30 days maximum',
            updates: 'Weekly progress reports',
            outcome: 'Written resolution provided'
        }
    },

    // ============================================
    // 10. UPDATES AND NOTIFICATIONS
    // ============================================
    updates: {
        policyChanges: {
            noticePeriod: '30 days',
            notification: [
                'In-app notification',
                'Email to registered address',
                'SMS to primary number',
                'Website announcement'
            ],
            acceptance: 'Continued use constitutes acceptance'
        },
        
        regulatoryUpdates: {
            monitoring: 'Daily regulatory tracking',
            implementation: 'Within 30 days of change',
            communication: 'Clear user notification',
            gracePeriod: 'Reasonable transition period'
        },
        
        emergencyUpdates: {
            securityBreaches: 'Notify within 72 hours',
            serviceDisruptions: 'Notify within 24 hours',
            legalActions: 'Notify immediately',
            forceMajeure: 'Notify as soon as practical'
        }
    }
};

// Export Legal Framework
module.exports = tzLegal;

// Legal helper functions
const tzLegalHelpers = {
    // Generate acceptance timestamp
    generateAcceptanceTimestamp: () => {
        return {
            timestamp: new Date().toISOString(),
            timezone: 'Africa/Dar_es_Salaam',
            ipAddress: 'Captured at acceptance',
            deviceId: 'Captured at acceptance',
            version: tzLegal.termsAndConditions.version
        };
    },
    
    // Check if user meets age requirement
    checkAgeRequirement: (dateOfBirth) => {
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        
        return age >= 18;
    },
    
    // Validate legal documents
    validateLegalDocument: (documentType, documentNumber) => {
        const validators = {
            'NIDA': /^NIDA-\d{9}-[A-Z0-9]$/,
            'TIN': /^TIN-\d{3}-\d{3}-\d{3}$/,
            'VAT': /^VAT-\d{3}-\d{3}-\d{3}$/,
            'DLP': /^BOT\/DLP\/\d{4}\/\d{3}$/
        };
        
        const validator = validators[documentType];
        return validator ? validator.test(documentNumber) : false;
    },
    
    // Calculate cooling off period
    calculateCoolingOffPeriod: (acceptanceDate) => {
        const acceptance = new Date(acceptanceDate);
        const coolingOffEnd = new Date(acceptance);
        coolingOffEnd.setHours(coolingOffEnd.getHours() + 24);
        
        return {
            start: acceptance,
            end: coolingOffEnd,
            remaining: Math.max(0, coolingOffEnd - new Date()),
            active: new Date() < coolingOffEnd
        };
    },
    
    // Generate compliance report
    generateComplianceReport: (userData) => {
        return {
            reportId: `COMP-${Date.now()}-TZ`,
            generated: new Date().toISOString(),
            user: {
                id: userData.id,
                name: userData.name,
                nationalId: userData.nationalId
            },
            checks: {
                ageRequirement: tzLegalHelpers.checkAgeRequirement(userData.dateOfBirth),
                residency: userData.country === 'Tanzania',
                documentValidation: tzLegalHelpers.validateLegalDocument('NIDA', userData.nationalId),
                acceptanceRecorded: !!userData.termsAccepted,
                coolingOffActive: userData.termsAccepted ? 
                    tzLegalHelpers.calculateCoolingOffPeriod(userData.termsAccepted).active : false
            },
            status: 'Pending Review'
        };
    }
};

// Attach helpers to legal framework
tzLegal.helpers = tzLegalHelpers;

// Make legal framework immutable
Object.freeze(tzLegal);

console.log('Tanzania Legal Framework loaded successfully');
console.log(`Legal Entity: ${tzLegal.entity.legalName}`);
console.log(`Registration: ${tzLegal.entity.registrationNumber}`);
console.log(`Terms Version: ${tzLegal.termsAndConditions.version}`);
console.log(`Privacy Policy: ${tzLegal.privacyPolicy.version}`);