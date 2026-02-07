/**
 * South Sudan Rules Configuration
 * M-Pesewa - Emergency Micro-Lending in Trusted Circles
 * Country: South Sudan (SS)
 * Strict Country Isolation: No cross-border lending/borrowing
 * Hierarchy: Global → South Sudan → Groups → Lenders → Borrowers (Ledgers)
 */

class SouthSudanRules {
    constructor() {
        this.countryCode = 'SS';
        this.countryName = 'South Sudan';
        this.currency = 'SSP';
        this.flagEmoji = '🇸🇸';
        
        // STRICT HIERARCHY ENFORCEMENT
        this.hierarchy = {
            global: {
                level: 'Global',
                children: ['countries'],
                rules: ['Platform-wide governance', 'Global admin access']
            },
            countries: {
                level: 'Country',
                parent: 'global',
                children: ['groups'],
                rules: [
                    'Strict country isolation',
                    'No cross-border transactions',
                    'Country-specific regulations',
                    'Local currency enforcement'
                ]
            },
            groups: {
                level: 'Group',
                parent: 'countries',
                children: ['lenders', 'borrowers'],
                rules: [
                    'Minimum 5 members, maximum 1,000',
                    'Country-locked membership',
                    'Invitation-only access',
                    'One admin/founder per group',
                    'Group reputation system'
                ]
            },
            lenders: {
                level: 'Lender',
                parent: 'groups',
                children: ['ledgers'],
                rules: [
                    'Subscription required',
                    'Lend only within group',
                    'Unlimited personal ledgers',
                    'Manual repayment updates',
                    '5-star rating system for borrowers'
                ]
            },
            borrowers: {
                level: 'Borrower',
                parent: 'groups',
                children: [],
                rules: [
                    'No subscription fees',
                    'Maximum 4 groups (with good rating)',
                    '7-day repayment period',
                    '10% interest weekly',
                    'Blacklist on 2-month default'
                ]
            },
            ledgers: {
                level: 'Ledger',
                parent: 'lenders',
                children: [],
                rules: [
                    'Auto-generated on loan approval',
                    'One ledger per borrower',
                    'Manual updates by lender',
                    'Admin override capability',
                    'Historical tracking'
                ]
            }
        };
        
        // COUNTRY-SPECIFIC RULES
        this.countryRules = {
            registration: {
                // National ID requirements
                nationalId: {
                    required: true,
                    format: '12 digits',
                    validation: /^[0-9]{12}$/,
                    message: 'South Sudan National ID must be 12 digits'
                },
                
                // Phone number requirements
                phoneNumber: {
                    required: true,
                    format: '+211 or 211 followed by 9 digits',
                    validation: /^(\+211|211)?[0-9]{9}$/,
                    message: 'Valid South Sudan phone number required'
                },
                
                // Address requirements
                address: {
                    required: true,
                    regions: ['Juba', 'Wau', 'Malakal', 'Rumbek', 'Yei', 'Bor', 'Aweil', 'Bentiu', 'Torit'],
                    validation: (address) => address.length >= 10
                },
                
                // Age requirement
                age: {
                    minimum: 18,
                    message: 'Must be at least 18 years old'
                }
            },
            
            lending: {
                // Subscription enforcement
                subscription: {
                    required: true,
                    expiryDate: 28, // 28th of each month
                    tiers: ['basic', 'premium', 'super', 'lenderOfLenders'],
                    blockOnExpiry: true,
                    gracePeriod: 0 // No grace period
                },
                
                // Lending limits per tier (in SSP)
                limits: {
                    basic: {
                        weekly: 1500,
                        description: 'Basic: Up to £1,500 SSP per week'
                    },
                    premium: {
                        weekly: 5000,
                        description: 'Premium: Up to £5,000 SSP per week'
                    },
                    super: {
                        weekly: 20000,
                        crbCheck: true,
                        description: 'Super: Up to £20,000 SSP per week'
                    },
                    lenderOfLenders: {
                        weekly: 50000,
                        crbCheck: true,
                        customTerms: true,
                        description: 'Lender of Lenders: Up to £50,000 SSP'
                    }
                },
                
                // Loan categories
                categories: {
                    required: true,
                    list: [
                        'fare', 'data', 'gas', 'food', 'wifi', 'water', 'electricity',
                        'tv', 'fuel', 'repair', 'credo', 'sales', 'capital', 'soko',
                        'kidandaski', 'hawker', 'fuliziwa', 'medicine', 'school', 'advance'
                    ],
                    selectAllOption: true
                }
            },
            
            borrowing: {
                // Loan terms
                terms: {
                    repaymentPeriod: 7, // days
                    interestRate: 0.10, // 10%
                    penaltyRate: 0.05, // 5% daily after 7 days
                    defaultPeriod: 60, // days (2 months)
                    minAmount: 5, // SSP
                    partialRepayments: true
                },
                
                // Group limits
                groupLimits: {
                    maxGroups: 4,
                    requirement: 'Good rating required',
                    migration: 'Approval required'
                },
                
                // Emergency categories
                emergencies: {
                    count: 20,
                    description: 'Specific-purpose loans only',
                    validation: 'Must select valid emergency category'
                }
            },
            
            groups: {
                // Group creation rules
                creation: {
                    minMembers: 5,
                    maxMembers: 1000,
                    adminRequired: true,
                    countryLock: true,
                    types: ['Family', 'Church', 'Professional', 'Local', 'Social', 'Business']
                },
                
                // Group management
                management: {
                    adminPrivileges: [
                        'Invite members',
                        'Remove members',
                        'Moderate disputes',
                        'View group statistics',
                        'Set internal rules'
                    ],
                    memberRoles: ['Lender', 'Borrower'],
                    roleSwitching: 'Requires new registration'
                },
                
                // Group isolation
                isolation: {
                    noCrossGroupLending: true,
                    noCrossCountryMembers: true,
                    invitationOnly: true,
                    referralRequired: true
                }
            },
            
            reputation: {
                // Rating system
                ratings: {
                    scale: 5,
                    by: 'Lenders',
                    affects: 'Group access, loan limits',
                    update: 'After repayment completion'
                },
                
                // Blacklist system
                blacklist: {
                    trigger: '60 days overdue',
                    effects: [
                        'Cannot borrow',
                        'Cannot join new groups',
                        'Visible platform-wide',
                        'Debt collector referral'
                    ],
                    removal: {
                        by: 'Platform Admin only',
                        condition: 'Full repayment + penalties',
                        process: 'Manual approval required'
                    }
                },
                
                // Defaulters registry
                defaulters: {
                    public: true,
                    retention: 'Until cleared',
                    update: 'Real-time'
                }
            },
            
            compliance: {
                // South Sudan regulations
                regulations: {
                    centralBank: 'Bank of South Sudan',
                    licensing: 'Financial Service Provider License',
                    reporting: 'Monthly transaction reports',
                    kyc: 'Full KYC required',
                    aml: 'Anti-money laundering compliance'
                },
                
                // Data protection
                dataProtection: {
                    law: 'South Sudan Data Protection Act',
                    retention: '7 years',
                    access: 'User right to access',
                    deletion: 'Right to be forgotten'
                },
                
                // Dispute resolution
                disputes: {
                    first: 'Group admin mediation',
                    second: 'Platform admin intervention',
                    final: 'South Sudan courts',
                    timeframe: '30 days resolution target'
                }
            }
        };
        
        // VALIDATION RULES
        this.validationRules = {
            user: {
                fullName: {
                    required: true,
                    minLength: 3,
                    maxLength: 100,
                    pattern: /^[A-Za-z\s.'-]+$/,
                    message: 'Valid full name required (letters, spaces, apostrophes only)'
                },
                email: {
                    required: false,
                    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Valid email address required'
                },
                password: {
                    required: true,
                    minLength: 8,
                    maxLength: 12,
                    requirements: ['uppercase', 'lowercase', 'number', 'symbol'],
                    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/,
                    message: 'Password must be 8-12 characters with uppercase, lowercase, number, and symbol'
                }
            },
            
            loan: {
                amount: {
                    required: true,
                    min: 5,
                    max: 20000,
                    step: 1,
                    message: 'Loan amount must be between £5 and £20,000 SSP'
                },
                category: {
                    required: true,
                    validCategories: this.countryRules.lending.categories.list,
                    message: 'Valid emergency category required'
                },
                purpose: {
                    required: true,
                    minLength: 10,
                    maxLength: 500,
                    message: 'Loan purpose must be 10-500 characters'
                }
            },
            
            group: {
                name: {
                    required: true,
                    minLength: 3,
                    maxLength: 50,
                    pattern: /^[A-Za-z0-9\s-]+$/,
                    message: 'Group name must be 3-50 alphanumeric characters'
                },
                description: {
                    required: false,
                    maxLength: 200,
                    message: 'Description cannot exceed 200 characters'
                },
                type: {
                    required: true,
                    validTypes: this.countryRules.groups.creation.types,
                    message: 'Valid group type required'
                }
            }
        };
        
        // ENFORCEMENT RULES
        this.enforcement = {
            strict: {
                countryIsolation: {
                    check: 'Validate user country against group country',
                    action: 'Block transaction if mismatch',
                    message: 'Cross-country lending/borrowing not allowed'
                },
                subscription: {
                    check: 'Verify active subscription',
                    action: 'Block lending if expired',
                    message: 'Active subscription required for lending'
                },
                groupMembership: {
                    check: 'Verify user is group member',
                    action: 'Block transaction if not member',
                    message: 'Must be group member to transact'
                }
            },
            
            moderate: {
                loanLimits: {
                    check: 'Verify within tier limits',
                    action: 'Block if exceeds limit',
                    message: 'Loan amount exceeds subscription tier limit'
                },
                borrowerRating: {
                    check: 'Check borrower rating',
                    action: 'Warn lender if low rating',
                    message: 'Borrower has low rating'
                },
                repaymentHistory: {
                    check: 'Check previous repayments',
                    action: 'Limit access if poor history',
                    message: 'Poor repayment history detected'
                }
            },
            
            advisory: {
                loanFrequency: {
                    check: 'Monitor loan frequency',
                    action: 'Recommend cooling off',
                    message: 'Consider taking a break between loans'
                },
                diversification: {
                    check: 'Monitor lender portfolio',
                    action: 'Recommend diversification',
                    message: 'Consider diversifying your lending portfolio'
                },
                savings: {
                    check: 'Monitor borrowing patterns',
                    action: 'Recommend savings',
                    message: 'Consider building emergency savings'
                }
            }
        };
        
        // AUDIT LOGGING RULES
        this.auditRules = {
            mandatoryLogs: [
                'User registration',
                'Login/logout',
                'Loan application',
                'Loan approval',
                'Repayment',
                'Subscription payment',
                'Group creation',
                'Group join/leave',
                'Blacklist addition/removal',
                'Admin actions'
            ],
            
            retention: {
                duration: '7 years',
                format: 'Encrypted database',
                access: 'Admin only',
                export: 'Available on request'
            },
            
            fields: {
                timestamp: 'ISO 8601 format',
                userId: 'Anonymous identifier',
                action: 'Verbose description',
                ipAddress: 'Anonymized',
                userAgent: 'Browser/device info',
                country: 'Detected country',
                success: 'Boolean outcome'
            }
        };
        
        // ERROR MESSAGES
        this.errorMessages = {
            validation: {
                INVALID_COUNTRY: 'Operation not allowed in your country',
                SUBSCRIPTION_EXPIRED: 'Subscription expired. Renew to continue lending',
                GROUP_LIMIT_REACHED: 'Maximum group limit reached (4 groups)',
                LOW_RATING: 'Rating too low for this operation',
                BLACKLISTED: 'User is blacklisted',
                INSUFFICIENT_FUNDS: 'Insufficient lending capacity',
                LOAN_LIMIT_EXCEEDED: 'Loan amount exceeds limit',
                CATEGORY_NOT_SELECTED: 'Emergency category not selected',
                REPAYMENT_OVERDUE: 'Existing overdue loan',
                GROUP_FULL: 'Group has reached maximum capacity',
                INVITATION_REQUIRED: 'Group invitation required'
            },
            
            business: {
                CROSS_COUNTRY_BLOCKED: 'Cross-country transactions are blocked',
                SUBSCRIPTION_REQUIRED: 'Subscription required for lending',
                MIN_MEMBERS_REQUIRED: 'Group requires minimum 5 members',
                MAX_GROUPS_REACHED: 'Maximum 4 groups allowed per user',
                DEFAULT_DETECTED: 'Default detected. Account restricted',
                ADMIN_OVERRIDE_REQUIRED: 'Admin override required for this action',
                MANUAL_UPDATE_REQUIRED: 'Manual ledger update required',
                REFERRAL_REQUIRED: 'Two referrals required for registration'
            },
            
            technical: {
                SESSION_EXPIRED: 'Session expired. Please login again',
                NETWORK_ERROR: 'Network error. Please try again',
                SERVER_ERROR: 'Server error. Please contact support',
                VALIDATION_ERROR: 'Validation failed. Please check your input',
                RATE_LIMITED: 'Too many requests. Please try again later',
                MAINTENANCE: 'System maintenance in progress',
                OFFLINE: 'You are offline. Please check your connection'
            }
        };
    }
    
    // VALIDATION METHODS
    
    // Validate user registration
    validateUserRegistration(userData) {
        const errors = [];
        const warnings = [];
        
        // Required fields
        const requiredFields = ['fullName', 'nationalId', 'phoneNumber', 'address', 'password'];
        requiredFields.forEach(field => {
            if (!userData[field]) {
                errors.push(`${field} is required`);
            }
        });
        
        // National ID validation
        if (userData.nationalId) {
            const nationalIdRule = this.validationRules.user.nationalId;
            if (!nationalIdRule.pattern.test(userData.nationalId)) {
                errors.push(nationalIdRule.message);
            }
        }
        
        // Phone number validation
        if (userData.phoneNumber) {
            const phoneRule = this.countryRules.registration.phoneNumber;
            if (!phoneRule.validation.test(userData.phoneNumber)) {
                errors.push(phoneRule.message);
            }
        }
        
        // Password validation
        if (userData.password) {
            const passwordRule = this.validationRules.user.password;
            if (!passwordRule.pattern.test(userData.password)) {
                errors.push(passwordRule.message);
            }
        }
        
        // Age validation
        if (userData.dateOfBirth) {
            const age = this.calculateAge(userData.dateOfBirth);
            if (age < this.countryRules.registration.age.minimum) {
                errors.push(this.countryRules.registration.age.message);
            }
        }
        
        // Referral validation
        if (userData.referrers && userData.referrers.length < 2) {
            warnings.push('Two referrers recommended for better trust rating');
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors,
            warnings: warnings,
            userData: userData
        };
    }
    
    // Validate loan application
    validateLoanApplication(loanData, userContext) {
        const errors = [];
        const warnings = [];
        
        // Required fields
        if (!loanData.amount) errors.push('Loan amount is required');
        if (!loanData.category) errors.push('Emergency category is required');
        if (!loanData.purpose) errors.push('Loan purpose is required');
        
        // Amount validation
        if (loanData.amount) {
            const amountRule = this.validationRules.loan.amount;
            if (loanData.amount < amountRule.min || loanData.amount > amountRule.max) {
                errors.push(amountRule.message);
            }
        }
        
        // Category validation
        if (loanData.category) {
            const categoryRule = this.validationRules.loan.category;
            if (!categoryRule.validCategories.includes(loanData.category)) {
                errors.push(categoryRule.message);
            }
        }
        
        // Purpose validation
        if (loanData.purpose) {
            const purposeRule = this.validationRules.loan.purpose;
            if (loanData.purpose.length < purposeRule.minLength || 
                loanData.purpose.length > purposeRule.maxLength) {
                errors.push(purposeRule.message);
            }
        }
        
        // User context validations
        if (userContext) {
            // Check if user is blacklisted
            if (userContext.isBlacklisted) {
                errors.push(this.errorMessages.validation.BLACKLISTED);
            }
            
            // Check group membership
            if (!userContext.groupId) {
                errors.push('Must be a member of a group to borrow');
            }
            
            // Check existing loans
            if (userContext.activeLoans > 0) {
                warnings.push('You have an active loan. Consider repaying first');
            }
            
            // Check rating
            if (userContext.rating < 3) {
                warnings.push('Low rating may affect loan approval');
            }
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors,
            warnings: warnings,
            loanData: loanData
        };
    }
    
    // Validate group creation
    validateGroupCreation(groupData, creatorContext) {
        const errors = [];
        const warnings = [];
        
        // Required fields
        if (!groupData.name) errors.push('Group name is required');
        if (!groupData.type) errors.push('Group type is required');
        
        // Name validation
        if (groupData.name) {
            const nameRule = this.validationRules.group.name;
            if (groupData.name.length < nameRule.minLength || 
                groupData.name.length > nameRule.maxLength) {
                errors.push(nameRule.message);
            }
            
            if (!nameRule.pattern.test(groupData.name)) {
                errors.push('Group name contains invalid characters');
            }
        }
        
        // Type validation
        if (groupData.type) {
            const typeRule = this.validationRules.group.type;
            if (!typeRule.validTypes.includes(groupData.type)) {
                errors.push(typeRule.message);
            }
        }
        
        // Description validation
        if (groupData.description) {
            const descRule = this.validationRules.group.description;
            if (groupData.description.length > descRule.maxLength) {
                warnings.push(descRule.message);
            }
        }
        
        // Creator context validations
        if (creatorContext) {
            // Check if creator can create more groups
            if (creatorContext.groupsCreated >= 5) {
                warnings.push('You have created many groups. Consider joining existing ones');
            }
            
            // Check creator rating
            if (creatorContext.rating < 4) {
                warnings.push('High rating recommended for group creators');
            }
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors,
            warnings: warnings,
            groupData: groupData
        };
    }
    
    // ENFORCEMENT METHODS
    
    // Enforce country isolation
    enforceCountryIsolation(userCountry, targetCountry) {
        if (userCountry !== targetCountry) {
            return {
                allowed: false,
                reason: this.errorMessages.business.CROSS_COUNTRY_BLOCKED,
                details: {
                    userCountry: userCountry,
                    targetCountry: targetCountry,
                    rule: 'country-isolation'
                }
            };
        }
        
        return { allowed: true };
    }
    
    // Enforce subscription status
    enforceSubscription(subscriptionData) {
        if (!subscriptionData || !subscriptionData.isActive) {
            return {
                allowed: false,
                reason: this.errorMessages.business.SUBSCRIPTION_REQUIRED,
                details: {
                    subscriptionStatus: subscriptionData?.status || 'none',
                    expiryDate: subscriptionData?.expiryDate,
                    rule: 'subscription-required'
                }
            };
        }
        
        // Check if expired
        const today = new Date();
        const expiryDate = new Date(subscriptionData.expiryDate);
        
        if (today > expiryDate) {
            return {
                allowed: false,
                reason: this.errorMessages.validation.SUBSCRIPTION_EXPIRED,
                details: {
                    expiryDate: expiryDate.toISOString(),
                    today: today.toISOString(),
                    rule: 'subscription-expired'
                }
            };
        }
        
        return { allowed: true };
    }
    
    // Enforce loan limits
    enforceLoanLimits(loanAmount, tier, existingLoans = 0) {
        const tierLimits = this.countryRules.lending.limits[tier];
        
        if (!tierLimits) {
            return {
                allowed: false,
                reason: 'Invalid subscription tier',
                details: { tier: tier }
            };
        }
        
        if (loanAmount > tierLimits.weekly) {
            return {
                allowed: false,
                reason: this.errorMessages.validation.LOAN_LIMIT_EXCEEDED,
                details: {
                    loanAmount: loanAmount,
                    tierLimit: tierLimits.weekly,
                    tier: tier,
                    rule: 'loan-limit'
                }
            };
        }
        
        // Check weekly loan count
        if (existingLoans >= 3) {
            return {
                allowed: false,
                reason: 'Maximum weekly loans reached',
                details: {
                    existingLoans: existingLoans,
                    maxLoans: 3,
                    rule: 'weekly-loan-limit'
                }
            };
        }
        
        return { allowed: true };
    }
    
    // Enforce group membership
    enforceGroupMembership(userId, groupId, groupMembers) {
        if (!groupMembers.includes(userId)) {
            return {
                allowed: false,
                reason: this.errorMessages.validation.GROUP_MEMBERSHIP_REQUIRED,
                details: {
                    userId: userId,
                    groupId: groupId,
                    rule: 'group-membership'
                }
            };
        }
        
        return { allowed: true };
    }
    
    // Enforce borrower limits
    enforceBorrowerLimits(borrowerData) {
        // Check group limit
        if (borrowerData.groups && borrowerData.groups.length >= 4) {
            return {
                allowed: false,
                reason: this.errorMessages.validation.GROUP_LIMIT_REACHED,
                details: {
                    currentGroups: borrowerData.groups.length,
                    maxGroups: 4,
                    rule: 'group-limit'
                }
            };
        }
        
        // Check rating requirement for additional groups
        if (borrowerData.groups && borrowerData.groups.length >= 2 && borrowerData.rating < 4) {
            return {
                allowed: false,
                reason: 'Rating too low for additional groups',
                details: {
                    rating: borrowerData.rating,
                    requiredRating: 4,
                    rule: 'rating-requirement'
                }
            };
        }
        
        return { allowed: true };
    }
    
    // UTILITY METHODS
    
    // Calculate age from date of birth
    calculateAge(dateOfBirth) {
        const birthDate = new Date(dateOfBirth);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        
        return age;
    }
    
    // Calculate loan due date
    calculateDueDate(loanDate, repaymentPeriod = 7) {
        const dueDate = new Date(loanDate);
        dueDate.setDate(dueDate.getDate() + repaymentPeriod);
        return dueDate;
    }
    
    // Calculate penalties
    calculatePenalties(principal, interest, daysOverdue) {
        const totalAmount = principal + interest;
        const penaltyRate = this.countryRules.borrowing.terms.penaltyRate;
        const penalty = totalAmount * penaltyRate * daysOverdue;
        return Math.min(penalty, totalAmount * 2); // Cap at 2x total amount
    }
    
    // Determine blacklist status
    determineBlacklistStatus(overdueDays, amountOwed) {
        if (overdueDays >= 60) {
            return {
                isBlacklisted: true,
                reason: '60+ days overdue',
                amountOwed: amountOwed,
                daysOverdue: overdueDays
            };
        }
        
        if (amountOwed > 10000 && overdueDays >= 30) {
            return {
                isBlacklisted: true,
                reason: 'Large amount overdue 30+ days',
                amountOwed: amountOwed,
                daysOverdue: overdueDays
            };
        }
        
        return { isBlacklisted: false };
    }
    
    // Generate rule summary
    generateRuleSummary() {
        return {
            country: this.countryName,
            currency: this.currency,
            hierarchy: this.hierarchy,
            keyRules: {
                strictIsolation: this.countryRules.registration.nationalId.required,
                subscriptionRequired: this.countryRules.lending.subscription.required,
                maxGroups: this.countryRules.borrowing.groupLimits.maxGroups,
                repaymentPeriod: this.countryRules.borrowing.terms.repaymentPeriod,
                interestRate: this.countryRules.borrowing.terms.interestRate * 100 + '%'
            },
            validationRules: Object.keys(this.validationRules),
            enforcementRules: Object.keys(this.enforcement)
        };
    }
    
    // Check rule compliance
    checkCompliance(action, context) {
        const complianceChecks = [];
        
        switch (action) {
            case 'lend':
                complianceChecks.push(
                    this.enforceCountryIsolation(context.userCountry, context.groupCountry),
                    this.enforceSubscription(context.subscription),
                    this.enforceLoanLimits(context.loanAmount, context.tier, context.existingLoans),
                    this.enforceGroupMembership(context.userId, context.groupId, context.groupMembers)
                );
                break;
                
            case 'borrow':
                complianceChecks.push(
                    this.enforceCountryIsolation(context.userCountry, context.groupCountry),
                    this.enforceGroupMembership(context.userId, context.groupId, context.groupMembers),
                    this.enforceBorrowerLimits(context.borrowerData)
                );
                break;
                
            case 'create_group':
                complianceChecks.push(
                    this.enforceCountryIsolation(context.userCountry, 'SS'),
                    this.validateGroupCreation(context.groupData, context.creatorContext)
                );
                break;
                
            case 'join_group':
                complianceChecks.push(
                    this.enforceCountryIsolation(context.userCountry, context.groupCountry),
                    this.enforceBorrowerLimits(context.borrowerData)
                );
                break;
        }
        
        const failedChecks = complianceChecks.filter(check => 
            check.allowed === false || (check.isValid === false && check.errors.length > 0)
        );
        
        return {
            compliant: failedChecks.length === 0,
            failedChecks: failedChecks,
            allChecks: complianceChecks
        };
    }
    
    // Initialize rules system
    initialize() {
        // Add rules to global object
        if (!window.mpesewa) window.mpesewa = {};
        window.mpesewa.rules = this;
        
        // Add CSS for rule displays
        this.addRulesStyles();
        
        // Initialize rule displays
        this.initializeRuleDisplays();
        
        // Set up periodic compliance checks
        this.setupComplianceMonitoring();
        
        // Dispatch initialization event
        window.dispatchEvent(new CustomEvent('mpesewa:rules:initialized', {
            detail: { country: 'SS', rules: this }
        }));
    }
    
    addRulesStyles() {
        const style = document.createElement('style');
        style.textContent = this.generateRulesCSS();
        document.head.appendChild(style);
    }
    
    generateRulesCSS() {
        return `
            /* South Sudan Rules Styles */
            .rules-display-ss {
                font-family: 'Inter', sans-serif;
                background: #f8f9fa;
                border-radius: 12px;
                padding: 24px;
                margin: 20px 0;
                border-left: 4px solid #003366;
            }
            
            .rules-header-ss {
                display: flex;
                align-items: center;
                gap: 12px;
                margin-bottom: 20px;
            }
            
            .rules-flag-ss {
                font-size: 2rem;
            }
            
            .rules-title-ss {
                font-size: 1.5rem;
                font-weight: 700;
                color: #003366;
                margin: 0;
            }
            
            .rules-subtitle-ss {
                color: #6c757d;
                font-size: 0.9rem;
            }
            
            .rules-section-ss {
                margin: 24px 0;
                padding: 16px;
                background: white;
                border-radius: 8px;
                border: 1px solid #e2e8f0;
            }
            
            .rules-section-title-ss {
                font-size: 1.1rem;
                font-weight: 600;
                color: #003366;
                margin-bottom: 12px;
                padding-bottom: 8px;
                border-bottom: 2px solid #0099ff;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .rules-section-title-ss::before {
                content: "⚖️";
                font-size: 1.2em;
            }
            
            .rules-list-ss {
                list-style: none;
                padding: 0;
                margin: 0;
            }
            
            .rules-item-ss {
                padding: 12px 16px;
                margin: 8px 0;
                background: #f8f9fa;
                border-radius: 6px;
                border-left: 3px solid #28a745;
                display: flex;
                align-items: center;
                gap: 12px;
                transition: all 0.2s ease;
            }
            
            .rules-item-ss:hover {
                background: #e9ecef;
                transform: translateX(4px);
            }
            
            .rules-item-ss.violation {
                border-left-color: #dc3545;
                background: rgba(220, 53, 69, 0.05);
            }
            
            .rules-item-ss.warning {
                border-left-color: #ffc107;
                background: rgba(255, 193, 7, 0.05);
            }
            
            .rules-item-icon-ss {
                font-size: 1.2em;
                min-width: 24px;
                text-align: center;
            }
            
            .rules-item-content-ss {
                flex: 1;
            }
            
            .rules-item-title-ss {
                font-weight: 600;
                color: #003366;
                margin-bottom: 4px;
            }
            
            .rules-item-description-ss {
                font-size: 0.875rem;
                color: #6c757d;
            }
            
            .hierarchy-display-ss {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 20px;
                padding: 20px;
                background: white;
                border-radius: 12px;
                border: 2px solid #0099ff;
            }
            
            .hierarchy-level-ss {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 8px;
                padding: 16px;
                border-radius: 8px;
                background: #f8f9fa;
                min-width: 200px;
                position: relative;
            }
            
            .hierarchy-level-ss::after {
                content: "";
                position: absolute;
                bottom: -20px;
                left: 50%;
                transform: translateX(-50%);
                width: 2px;
                height: 20px;
                background: #0099ff;
            }
            
            .hierarchy-level-ss:last-child::after {
                display: none;
            }
            
            .hierarchy-level-title-ss {
                font-weight: 700;
                color: #003366;
                font-size: 1.1rem;
            }
            
            .hierarchy-level-rules-ss {
                font-size: 0.8rem;
                color: #6c757d;
                text-align: center;
            }
            
            .compliance-badge-ss {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                padding: 6px 12px;
                border-radius: 20px;
                font-size: 0.75rem;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            
            .compliance-badge-ss.compliant {
                background: rgba(40, 167, 69, 0.1);
                color: #28a745;
                border: 1px solid rgba(40, 167, 69, 0.3);
            }
            
            .compliance-badge-ss.non-compliant {
                background: rgba(220, 53, 69, 0.1);
                color: #dc3545;
                border: 1px solid rgba(220, 53, 69, 0.3);
            }
            
            .compliance-badge-ss.warning {
                background: rgba(255, 193, 7, 0.1);
                color: #ffc107;
                border: 1px solid rgba(255, 193, 7, 0.3);
            }
            
            .rule-violation-modal-ss {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
                padding: 20px;
            }
            
            .rule-violation-content-ss {
                background: white;
                border-radius: 12px;
                padding: 30px;
                max-width: 500px;
                width: 100%;
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
            }
            
            .rule-violation-header-ss {
                display: flex;
                align-items: center;
                gap: 12px;
                margin-bottom: 20px;
                color: #dc3545;
            }
            
            .rule-violation-title-ss {
                font-size: 1.25rem;
                font-weight: 700;
                margin: 0;
            }
            
            .rule-violation-message-ss {
                margin: 16px 0;
                line-height: 1.6;
                color: #003366;
            }
            
            .rule-violation-details-ss {
                background: #f8f9fa;
                padding: 16px;
                border-radius: 8px;
                margin: 16px 0;
                font-family: monospace;
                font-size: 0.875rem;
                white-space: pre-wrap;
                max-height: 200px;
                overflow-y: auto;
            }
            
            @media (max-width: 768px) {
                .hierarchy-display-ss {
                    flex-direction: row;
                    overflow-x: auto;
                    padding: 16px;
                }
                
                .hierarchy-level-ss {
                    min-width: 180px;
                    flex-shrink: 0;
                }
                
                .hierarchy-level-ss::after {
                    bottom: auto;
                    right: -20px;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 20px;
                    height: 2px;
                }
            }
            
            @media print {
                .rules-display-ss {
                    break-inside: avoid;
                    background: white;
                    border: 2px solid black;
                }
            }
            
            @media (prefers-contrast: high) {
                .rules-item-ss {
                    border: 2px solid;
                }
                
                .hierarchy-level-ss {
                    border: 2px solid black;
                }
            }
            
            @media (prefers-reduced-motion: reduce) {
                .rules-item-ss:hover {
                    transform: none;
                }
            }
        `;
    }
    
    initializeRuleDisplays() {
        // Auto-initialize rule displays on page
        const ruleContainers = document.querySelectorAll('[data-rules-display="SS"]');
        
        ruleContainers.forEach(container => {
            const ruleType = container.dataset.rulesType || 'summary';
            
            switch (ruleType) {
                case 'hierarchy':
                    container.innerHTML = this.generateHierarchyDisplay();
                    break;
                case 'lending':
                    container.innerHTML = this.generateLendingRulesDisplay();
                    break;
                case 'borrowing':
                    container.innerHTML = this.generateBorrowingRulesDisplay();
                    break;
                case 'compliance':
                    container.innerHTML = this.generateComplianceDisplay();
                    break;
                default:
                    container.innerHTML = this.generateRulesSummaryDisplay();
            }
        });
    }
    
    generateHierarchyDisplay() {
        return `
            <div class="hierarchy-display-ss">
                ${Object.entries(this.hierarchy).map(([key, level]) => `
                    <div class="hierarchy-level-ss" data-level="${key}">
                        <div class="hierarchy-level-title-ss">${level.level}</div>
                        <div class="hierarchy-level-rules-ss">
                            ${level.rules.slice(0, 2).join(', ')}
                            ${level.rules.length > 2 ? '...' : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    generateRulesSummaryDisplay() {
        return `
            <div class="rules-display-ss">
                <div class="rules-header-ss">
                    <span class="rules-flag-ss">${this.flagEmoji}</span>
                    <div>
                        <h3 class="rules-title-ss">South Sudan Rules</h3>
                        <p class="rules-subtitle-ss">Emergency Micro-Lending Regulations</p>
                    </div>
                </div>
                
                <div class="rules-section-ss">
                    <h4 class="rules-section-title-ss">Key Rules</h4>
                    <ul class="rules-list-ss">
                        <li class="rules-item-ss">
                            <span class="rules-item-icon-ss">🔒</span>
                            <div class="rules-item-content-ss">
                                <div class="rules-item-title-ss">Country Isolation</div>
                                <div class="rules-item-description-ss">No cross-border lending or borrowing</div>
                            </div>
                        </li>
                        <li class="rules-item-ss">
                            <span class="rules-item-icon-ss">💰</span>
                            <div class="rules-item-content-ss">
                                <div class="rules-item-title-ss">Subscription Required</div>
                                <div class="rules-item-description-ss">Lenders must have active subscription</div>
                            </div>
                        </li>
                        <li class="rules-item-ss">
                            <span class="rules-item-icon-ss">👥</span>
                            <div class="rules-item-content-ss">
                                <div class="rules-item-title-ss">Group Limits</div>
                                <div class="rules-item-description-ss">Max 4 groups per borrower (good rating required)</div>
                            </div>
                        </li>
                        <li class="rules-item-ss">
                            <span class="rules-item-icon-ss">⏰</span>
                            <div class="rules-item-content-ss">
                                <div class="rules-item-title-ss">Repayment Terms</div>
                                <div class="rules-item-description-ss">7 days, 10% interest, 5% daily penalty after</div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        `;
    }
    
    setupComplianceMonitoring() {
        // Monitor user actions for compliance
        document.addEventListener('click', (e) => {
            const actionElement = e.target.closest('[data-action]');
            if (actionElement) {
                const action = actionElement.dataset.action;
                const context = this.extractContextFromElement(actionElement);
                
                if (context) {
                    const compliance = this.checkCompliance(action, context);
                    
                    if (!compliance.compliant) {
                        this.showRuleViolation(compliance.failedChecks);
                        e.preventDefault();
                        e.stopPropagation();
                    }
                }
            }
        });
        
        // Periodic compliance checks
        setInterval(() => {
            this.performBackgroundComplianceChecks();
        }, 30000); // Every 30 seconds
    }
    
    extractContextFromElement(element) {
        // Extract context data from data attributes
        const context = {};
        
        const dataAttrs = element.dataset;
        Object.keys(dataAttrs).forEach(key => {
            if (key.startsWith('context')) {
                const contextKey = key.replace('context', '').toLowerCase();
                context[contextKey] = dataAttrs[key];
            }
        });
        
        return Object.keys(context).length > 0 ? context : null;
    }
    
    showRuleViolation(violations) {
        // Create violation modal
        const modal = document.createElement('div');
        modal.className = 'rule-violation-modal-ss';
        modal.innerHTML = `
            <div class="rule-violation-content-ss">
                <div class="rule-violation-header-ss">
                    <span>🚫</span>
                    <h3 class="rule-violation-title-ss">Rule Violation</h3>
                </div>
                <p class="rule-violation-message-ss">
                    Your action could not be completed due to rule violations.
                </p>
                <div class="rule-violation-details-ss">
                    ${violations.map(v => JSON.stringify(v, null, 2)).join('\n\n')}
                </div>
                <button onclick="this.closest('.rule-violation-modal-ss').remove()" 
                        style="padding: 12px 24px; background: #dc3545; color: white; border: none; border-radius: 6px; cursor: pointer;">
                    Understand
                </button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (modal.parentNode) {
                modal.remove();
            }
        }, 10000);
    }
    
    performBackgroundComplianceChecks() {
        // Perform background compliance checks
        // This would integrate with actual user data in production
        
        console.log('Performing background compliance checks for South Sudan...');
        
        // Check for expired subscriptions
        // Check for overdue loans
        // Check for blacklist status updates
        // etc.
    }
    
    // Get rules configuration
    getConfig() {
        return {
            countryCode: this.countryCode,
            countryName: this.countryName,
            hierarchy: this.hierarchy,
            countryRules: this.countryRules,
            validationRules: this.validationRules,
            enforcement: this.enforcement,
            errorMessages: this.errorMessages
        };
    }
}

// Export for module system
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SouthSudanRules;
} else {
    // Browser global
    window.SouthSudanRules = SouthSudanRules;
}

// Auto-initialize if script is loaded in browser
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function() {
        // Check if we're in South Sudan context
        const currentCountry = localStorage.getItem('mpesewa_country') || 
                               new URLSearchParams(window.location.search).get('country');
        
        if (currentCountry === 'SS' || window.location.pathname.includes('/ss/')) {
            const ssRules = new SouthSudanRules();
            ssRules.initialize();
            
            // Store for global access
            window.mpesewaRules = ssRules;
            
            // Add to global M-Pesewa object
            if (!window.mpesewa) window.mpesewa = {};
            window.mpesewa.rules = ssRules;
            
            // Log rules initialization
            console.log('South Sudan rules initialized:', ssRules.getConfig());
        }
    });
}