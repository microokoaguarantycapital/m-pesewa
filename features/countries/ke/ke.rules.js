/**
 * M-PESEWA - KENYA COUNTRY RULES MODULE
 * Version: 1.0.0
 * Last Updated: 2026-01-24
 * 
 * STRICT RULES ENFORCEMENT FOR KENYA
 * This file contains ALL Kenya-specific business rules and validations.
 * DO NOT MODIFY RULES CROSS-COUNTRY.
 * 
 * Hierarchy Enforcement: Global → Kenya → Groups → Lenders → Borrowers → Ledgers
 */

const KenyaRulesConfig = {
    // ============================================
    // 1. COUNTRY IDENTIFICATION & ISOLATION RULES
    // ============================================
    country: {
        code: 'KE',
        name: 'Kenya',
        flag: '🇰🇪',
        timezone: 'Africa/Nairobi',
        currency: 'KES',
        
        // STRICT ISOLATION RULES
        isolation: {
            crossCountryLending: false,
            crossCountryBorrowing: false,
            crossCountryGroups: false,
            crossCountryTransfers: false,
            allowForeignCurrency: false,
            
            // Enforcement mechanisms
            enforcement: {
                ipBlocking: true,
                phoneValidation: true,
                idValidation: true,
                locationVerification: true
            },
            
            // Validation rules
            validateUserCountry: function(user) {
                const errors = [];
                
                // Phone must be Kenyan
                if (!user.phone.startsWith('+254')) {
                    errors.push('Phone number must be Kenyan (+254)');
                }
                
                // National ID must be Kenyan format
                if (user.nationalId && !/^[0-9]{8}$/.test(user.nationalId)) {
                    errors.push('National ID must be 8 digits for Kenya');
                }
                
                // Location must be in Kenya
                if (user.location && !this.isKenyanLocation(user.location)) {
                    errors.push('Location must be within Kenya');
                }
                
                return {
                    valid: errors.length === 0,
                    errors,
                    country: 'KE',
                    verified: errors.length === 0
                };
            },
            
            isKenyanLocation: function(location) {
                const kenyanCounties = [
                    'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika',
                    'Meru', 'Kakamega', 'Kisii', 'Nyeri', 'Machakos', 'Garissa',
                    'Isiolo', 'Marsabit', 'Mandera', 'Wajir', 'Tana River',
                    'Lamu', 'Kilifi', 'Kwale', 'Taita Taveta', 'Embu', 'Kirinyaga',
                    'Muranga', 'Nyandarua', 'Kiambu', 'Turkana', 'West Pokot',
                    'Samburu', 'Trans Nzoia', 'Uasin Gishu', 'Elgeyo Marakwet',
                    'Nandi', 'Baringo', 'Laikipia', 'Nakuru', 'Narok', 'Kajiado',
                    'Kericho', 'Bomet', 'Kakamega', 'Vihiga', 'Bungoma', 'Busia',
                    'Siaya', 'Kisumu', 'Homa Bay', 'Migori', 'Kisii', 'Nyamira'
                ];
                
                return kenyanCounties.some(county => 
                    location.toLowerCase().includes(county.toLowerCase())
                );
            }
        }
    },
    
    // ============================================
    // 2. STRICT HIERARCHY ENFORCEMENT RULES
    // ============================================
    hierarchy: {
        // Global → Country → Groups → Lenders → Borrowers (Ledgers)
        levels: {
            global: {
                name: 'Global',
                rules: ['platform_wide', 'cross_country_administration']
            },
            country: {
                name: 'Kenya',
                rules: ['country_isolation', 'local_regulations', 'currency_lock']
            },
            groups: {
                name: 'Groups',
                rules: ['min_5_members', 'max_1000_members', 'country_locked', 'invitation_only']
            },
            lenders: {
                name: 'Lenders',
                rules: ['subscription_required', 'group_bound', 'ledger_management']
            },
            borrowers: {
                name: 'Borrowers',
                rules: ['no_subscription', 'max_4_groups', 'rating_based_access']
            },
            ledgers: {
                name: 'Ledgers',
                rules: ['auto_generated', 'unlimited_per_lender', 'manual_updates']
            }
        },
        
        // Hierarchy validation
        validateHierarchy: function(entity) {
            const violations = [];
            
            // Ensure entity has proper hierarchy chain
            if (!entity.country || entity.country !== 'KE') {
                violations.push('Entity must be in Kenya');
            }
            
            if (entity.type === 'group' && (!entity.members || entity.members.length < 5)) {
                violations.push('Group must have at least 5 members');
            }
            
            if (entity.type === 'group' && entity.members && entity.members.length > 1000) {
                violations.push('Group cannot exceed 1000 members');
            }
            
            if (entity.type === 'borrower' && entity.groups && entity.groups.length > 4) {
                violations.push('Borrower cannot join more than 4 groups');
            }
            
            if (entity.type === 'lender' && !entity.subscriptionActive) {
                violations.push('Lender must have active subscription');
            }
            
            return {
                valid: violations.length === 0,
                violations,
                hierarchy: this.getHierarchyChain(entity)
            };
        },
        
        getHierarchyChain: function(entity) {
            return {
                global: 'M-Pesewa Platform',
                country: 'Kenya 🇰🇪',
                group: entity.groupName || 'No group assigned',
                role: entity.type || 'Unknown',
                subscription: entity.subscriptionActive || false,
                rating: entity.rating || 0
            };
        }
    },
    
    // ============================================
    // 3. GROUP RULES & VALIDATION
    // ============================================
    groups: {
        // Group creation rules
        creation: {
            minMembers: 5,
            maxMembers: 1000,
            requireAdmin: true,
            invitationOnly: true,
            countryLocked: true,
            
            // Group types allowed in Kenya
            allowedTypes: [
                'Family',
                'Church',
                'Professional',
                'Chama',
                'Sacco',
                'Neighborhood',
                'Workplace',
                'School Alumni',
                'Social Club',
                'Business Association'
            ],
            
            // Validation rules
            validateGroupCreation: function(groupData) {
                const errors = [];
                
                // Check group type
                if (!this.allowedTypes.includes(groupData.type)) {
                    errors.push(`Group type must be one of: ${this.allowedTypes.join(', ')}`);
                }
                
                // Check member count
                if (groupData.members && groupData.members.length < this.minMembers) {
                    errors.push(`Group must have at least ${this.minMembers} members`);
                }
                
                // Check country
                if (groupData.country !== 'KE') {
                    errors.push('Group must be created in Kenya');
                }
                
                // Check group name
                if (!groupData.name || groupData.name.length < 3) {
                    errors.push('Group name must be at least 3 characters');
                }
                
                return {
                    valid: errors.length === 0,
                    errors,
                    groupId: this.generateGroupId(groupData)
                };
            },
            
            generateGroupId: function(groupData) {
                const timestamp = Date.now().toString(36);
                const random = Math.random().toString(36).substr(2, 5);
                return `KE_GRP_${groupData.type.substr(0, 3).toUpperCase()}_${timestamp}_${random}`;
            }
        },
        
        // Group membership rules
        membership: {
            maxGroupsPerUser: 4,
            goodRatingThreshold: 3, // Minimum 3-star rating for multiple groups
            invitationRequired: true,
            referralRequired: true,
            
            // Referral validation
            validateReferral: function(user, referrer1, referrer2) {
                const errors = [];
                
                // Referrers must be in same country
                if (referrer1.country !== 'KE' || referrer2.country !== 'KE') {
                    errors.push('Referrers must be in Kenya');
                }
                
                // Referrers must have good standing
                if (referrer1.rating < 3 || referrer2.rating < 3) {
                    errors.push('Referrers must have at least 3-star rating');
                }
                
                // Referrers must be in groups
                if (!referrer1.groups || referrer1.groups.length === 0) {
                    errors.push('Referrer 1 must belong to at least one group');
                }
                if (!referrer2.groups || referrer2.groups.length === 0) {
                    errors.push('Referrer 2 must belong to at least one group');
                }
                
                return {
                    valid: errors.length === 0,
                    errors,
                    referrers: [referrer1.id, referrer2.id]
                };
            },
            
            // Group switching rules
            allowGroupSwitch: function(user, targetGroup) {
                const conditions = [];
                
                // User must have good rating
                if (user.rating >= this.goodRatingThreshold) {
                    conditions.push('Good rating ✓');
                } else {
                    return {
                        allowed: false,
                        reason: 'User rating too low for group switching',
                        requiredRating: this.goodRatingThreshold,
                        currentRating: user.rating
                    };
                }
                
                // User must not be blacklisted
                if (user.blacklisted) {
                    return {
                        allowed: false,
                        reason: 'Blacklisted users cannot switch groups'
                    };
                }
                
                // User must not have active loans in current group
                if (user.activeLoans && user.activeLoans.length > 0) {
                    return {
                        allowed: false,
                        reason: 'User has active loans in current group'
                    };
                }
                
                // Target group must have space
                if (targetGroup.members && targetGroup.members.length >= 1000) {
                    return {
                        allowed: false,
                        reason: 'Target group is full'
                    };
                }
                
                return {
                    allowed: true,
                    conditions,
                    validationRequired: true
                };
            }
        },
        
        // Group administration rules
        administration: {
            adminRights: {
                inviteMembers: true,
                removeMembers: true,
                moderateContent: true,
                viewStatistics: true,
                setInternalRules: true,
                reportToPlatform: true
            },
            
            // Internal group rules
            internalRules: {
                maxLoanAmount: null, // Can be set by group admin
                interestRate: 0.10, // Default 10%, can be adjusted
                repaymentPeriod: 7, // Default 7 days
                meetingFrequency: 'weekly', // Can be weekly, monthly, etc.
                contributionRules: 'flexible' // Can be fixed or flexible
            },
            
            // Group statistics
            statistics: {
                totalMembers: 0,
                activeLenders: 0,
                activeBorrowers: 0,
                totalAmountLent: 0,
                repaymentRate: 0,
                defaultRate: 0,
                averageLoanSize: 0
            }
        }
    },
    
    // ============================================
    // 4. LENDER RULES & VALIDATION
    // ============================================
    lenders: {
        // Registration requirements
        registration: {
            requiredFields: [
                'fullName',
                'nationalId',
                'phone',
                'location',
                'subscriptionLevel',
                'username',
                'password',
                'categories'
            ],
            
            // Subscription levels
            subscriptionLevels: {
                basic: {
                    maxWeekly: 1500,
                    monthlyFee: 50,
                    features: ['Unlimited ledgers', 'Basic reporting'],
                    crbRequired: false
                },
                premium: {
                    maxWeekly: 5000,
                    monthlyFee: 250,
                    features: ['Advanced analytics', 'Priority support'],
                    crbRequired: false
                },
                super: {
                    maxWeekly: 20000,
                    monthlyFee: 1000,
                    features: ['CRB integration', 'Dedicated support'],
                    crbRequired: true
                },
                lenderOfLenders: {
                    maxWeekly: 50000,
                    monthlyFee: 500,
                    features: ['Custom terms', 'Enterprise support'],
                    crbRequired: true
                }
            },
            
            // Validation rules
            validateRegistration: function(lenderData) {
                const errors = [];
                const warnings = [];
                
                // Check required fields
                this.requiredFields.forEach(field => {
                    if (!lenderData[field]) {
                        errors.push(`${field} is required`);
                    }
                });
                
                // Validate phone number
                if (lenderData.phone && !lenderData.phone.startsWith('+254')) {
                    errors.push('Phone number must be Kenyan (+254)');
                }
                
                // Validate national ID
                if (lenderData.nationalId && !/^[0-9]{8}$/.test(lenderData.nationalId)) {
                    errors.push('National ID must be 8 digits');
                }
                
                // Validate subscription level
                if (lenderData.subscriptionLevel && !this.subscriptionLevels[lenderData.subscriptionLevel]) {
                    errors.push(`Invalid subscription level. Valid levels: ${Object.keys(this.subscriptionLevels).join(', ')}`);
                }
                
                // Check password strength
                if (lenderData.password) {
                    const passwordStrength = this.validatePassword(lenderData.password);
                    if (!passwordStrength.strong) {
                        errors.push(`Password too weak: ${passwordStrength.reasons.join(', ')}`);
                    }
                }
                
                // Check if CRB required for subscription level
                if (lenderData.subscriptionLevel === 'super' || lenderData.subscriptionLevel === 'lenderOfLenders') {
                    warnings.push('CRB check required for selected subscription level');
                }
                
                return {
                    valid: errors.length === 0,
                    errors,
                    warnings,
                    nextSteps: errors.length === 0 ? ['proceed_to_payment', 'verify_phone', 'verify_id'] : []
                };
            },
            
            validatePassword: function(password) {
                const reasons = [];
                
                if (password.length < 8) reasons.push('At least 8 characters');
                if (password.length > 12) reasons.push('Maximum 12 characters');
                if (!/[A-Z]/.test(password)) reasons.push('At least one uppercase letter');
                if (!/[a-z]/.test(password)) reasons.push('At least one lowercase letter');
                if (!/[0-9]/.test(password)) reasons.push('At least one number');
                if (!/[!@#$%^&*]/.test(password)) reasons.push('At least one special character');
                
                return {
                    strong: reasons.length === 0,
                    reasons,
                    score: Math.max(0, 6 - reasons.length) // 0-6 score
                };
            }
        },
        
        // Lending rules
        lending: {
            // Category restrictions
            categories: [
                'transport', 'data', 'cooking_gas', 'food', 'wifi', 'water',
                'electricity', 'tv', 'fuel', 'repair', 'credo', 'sales',
                'capital', 'soko', 'kidandaski', 'hawker', 'fuliziwa',
                'medicine', 'school_fees', 'advance'
            ],
            
            // Lending limits by subscription
            limits: {
                basic: {
                    perLoan: 1500,
                    perWeek: 1500,
                    perBorrower: 1500,
                    totalActive: 10000
                },
                premium: {
                    perLoan: 5000,
                    perWeek: 5000,
                    perBorrower: 5000,
                    totalActive: 50000
                },
                super: {
                    perLoan: 20000,
                    perWeek: 20000,
                    perBorrower: 20000,
                    totalActive: 200000
                },
                lenderOfLenders: {
                    perLoan: 50000,
                    perWeek: 50000,
                    perBorrower: 50000,
                    totalActive: 500000
                }
            },
            
            // Validate loan request
            validateLoanRequest: function(lender, loanRequest) {
                const errors = [];
                const subscription = lender.subscriptionLevel || 'basic';
                const limits = this.limits[subscription];
                
                // Check amount against limits
                if (loanRequest.amount > limits.perLoan) {
                    errors.push(`Amount exceeds ${subscription} tier limit of ${limits.perLoan}`);
                }
                
                // Check weekly limit
                const weeklyLent = this.calculateWeeklyLent(lender);
                if (weeklyLent + loanRequest.amount > limits.perWeek) {
                    errors.push(`Weekly lending limit of ${limits.perWeek} exceeded`);
                }
                
                // Check borrower limit
                const borrowerLoans = this.getBorrowerLoans(lender, loanRequest.borrowerId);
                if (borrowerLoans + loanRequest.amount > limits.perBorrower) {
                    errors.push(`Borrower limit of ${limits.perBorrower} exceeded`);
                }
                
                // Check category
                if (!this.categories.includes(loanRequest.category)) {
                    errors.push(`Invalid category. Valid categories: ${this.categories.join(', ')}`);
                }
                
                // Check if lender has selected this category
                if (!lender.categories || !lender.categories.includes(loanRequest.category)) {
                    errors.push('Lender does not lend in this category');
                }
                
                // Check if borrower is in same group
                if (!this.isSameGroup(lender, loanRequest.borrowerId)) {
                    errors.push('Lender and borrower must be in same group');
                }
                
                // Check if borrower is blacklisted
                if (loanRequest.borrowerBlacklisted) {
                    errors.push('Borrower is blacklisted');
                }
                
                return {
                    valid: errors.length === 0,
                    errors,
                    limits,
                    subscription
                };
            },
            
            calculateWeeklyLent: function(lender) {
                // In real implementation, this would query database
                return lender.weeklyLent || 0;
            },
            
            getBorrowerLoans: function(lender, borrowerId) {
                // In real implementation, this would query database
                return lender.borrowerLoans?.[borrowerId] || 0;
            },
            
            isSameGroup: function(lender, borrowerId) {
                // In real implementation, this would check group membership
                return true; // Simplified for example
            }
        },
        
        // Ledger management rules
        ledgers: {
            autoGenerate: true,
            unlimitedPerLender: true,
            manualUpdates: true,
            adminOverride: true,
            
            // Ledger fields
            requiredFields: [
                'borrowerName',
                'borrowerContact',
                'borrowerLocation',
                'guarantor1',
                'guarantor2',
                'loanCategory',
                'amountBorrowed',
                'dateBorrowed',
                'dueDate',
                'interest',
                'status'
            ],
            
            // Ledger statuses
            statuses: {
                active: 'Active',
                cleared: 'Cleared',
                defaulted: 'Defaulted',
                disputed: 'Disputed',
                frozen: 'Frozen'
            },
            
            // Create ledger from approved loan
            createLedger: function(loanApproval) {
                const ledger = {
                    id: `LEDGER_KE_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    lenderId: loanApproval.lenderId,
                    borrowerId: loanApproval.borrowerId,
                    groupId: loanApproval.groupId,
                    country: 'KE',
                    
                    // Borrower details
                    borrowerName: loanApproval.borrowerName,
                    borrowerContact: loanApproval.borrowerPhone,
                    borrowerLocation: loanApproval.borrowerLocation,
                    
                    // Guarantors
                    guarantor1: loanApproval.guarantor1,
                    guarantor2: loanApproval.guarantor2,
                    
                    // Loan details
                    loanCategory: loanApproval.category,
                    amountBorrowed: loanApproval.amount,
                    dateBorrowed: new Date().toISOString(),
                    dueDate: this.calculateDueDate(7), // 7 days
                    
                    // Financial details
                    interest: loanApproval.amount * 0.10, // 10%
                    totalDue: loanApproval.amount * 1.10,
                    amountPaid: 0,
                    amountOverdue: 0,
                    penaltyAccrued: 0,
                    
                    // Status
                    status: 'active',
                    lastUpdated: new Date().toISOString(),
                    createdBy: 'system'
                };
                
                return ledger;
            },
            
            calculateDueDate: function(days) {
                const date = new Date();
                date.setDate(date.getDate() + days);
                return date.toISOString();
            },
            
            // Update ledger with repayment
            updateLedger: function(ledger, repayment) {
                const updated = { ...ledger };
                
                updated.amountPaid += repayment.amount;
                updated.lastUpdated = new Date().toISOString();
                
                // Check if overdue
                const dueDate = new Date(ledger.dueDate);
                const today = new Date();
                
                if (today > dueDate) {
                    const daysLate = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));
                    if (daysLate > 0) {
                        updated.amountOverdue = ledger.totalDue - updated.amountPaid;
                        updated.penaltyAccrued = this.calculatePenalty(updated.amountOverdue, daysLate);
                    }
                }
                
                // Update status
                if (updated.amountPaid >= ledger.totalDue) {
                    updated.status = 'cleared';
                } else if (today > dueDate && daysLate > 60) {
                    updated.status = 'defaulted';
                }
                
                return updated;
            },
            
            calculatePenalty: function(amountOverdue, daysLate) {
                const dailyRate = 0.05; // 5% daily
                let penalty = 0;
                
                for (let i = 0; i < daysLate; i++) {
                    penalty += amountOverdue * dailyRate;
                    amountOverdue += amountOverdue * dailyRate;
                }
                
                return penalty;
            }
        }
    },
    
    // ============================================
    // 5. BORROWER RULES & VALIDATION
    // ============================================
    borrowers: {
        // Registration requirements
        registration: {
            requiredFields: [
                'fullName',
                'nationalId',
                'phone',
                'location',
                'username',
                'password'
            ],
            
            // No subscription required for borrowers
            subscriptionRequired: false,
            
            // Validation rules
            validateRegistration: function(borrowerData) {
                const errors = [];
                
                // Check required fields
                this.requiredFields.forEach(field => {
                    if (!borrowerData[field]) {
                        errors.push(`${field} is required`);
                    }
                });
                
                // Validate phone number
                if (borrowerData.phone && !borrowerData.phone.startsWith('+254')) {
                    errors.push('Phone number must be Kenyan (+254)');
                }
                
                // Validate national ID
                if (borrowerData.nationalId && !/^[0-9]{8}$/.test(borrowerData.nationalId)) {
                    errors.push('National ID must be 8 digits');
                }
                
                // Check if user already exists
                if (borrowerData.duplicateCheck && this.userExists(borrowerData)) {
                    errors.push('User already registered');
                }
                
                return {
                    valid: errors.length === 0,
                    errors,
                    nextSteps: errors.length === 0 ? ['verify_phone', 'verify_id', 'join_groups'] : []
                };
            },
            
            userExists: function(userData) {
                // In real implementation, this would check database
                return false;
            }
        },
        
        // Loan application rules
        loanApplication: {
            // Maximum groups a borrower can belong to
            maxGroups: 4,
            
            // Good rating threshold for multiple groups
            goodRatingThreshold: 3,
            
            // Loan application validation
            validateApplication: function(borrower, application) {
                const errors = [];
                const warnings = [];
                
                // Check if borrower is in group
                if (!borrower.groups || borrower.groups.length === 0) {
                    errors.push('Borrower must belong to at least one group');
                }
                
                // Check if borrower has good rating for multiple groups
                if (borrower.groups && borrower.groups.length >= this.maxGroups) {
                    if (borrower.rating < this.goodRatingThreshold) {
                        errors.push(`Need ${this.goodRatingThreshold}+ rating to borrow from ${this.maxGroups} groups`);
                    }
                }
                
                // Check if borrower has active loan in same group
                if (this.hasActiveLoanInGroup(borrower, application.groupId)) {
                    errors.push('Only one active loan per group allowed');
                }
                
                // Check if borrower is blacklisted
                if (borrower.blacklisted) {
                    errors.push('Blacklisted borrowers cannot apply for loans');
                }
                
                // Check loan amount against borrower's history
                const previousLoans = this.getPreviousLoans(borrower);
                const averageLoan = previousLoans.length > 0 ? 
                    previousLoans.reduce((sum, loan) => sum + loan.amount, 0) / previousLoans.length : 0;
                
                if (application.amount > averageLoan * 2 && previousLoans.length > 0) {
                    warnings.push('Loan amount significantly higher than previous average');
                }
                
                return {
                    valid: errors.length === 0,
                    errors,
                    warnings,
                    borrowerStatus: {
                        groups: borrower.groups?.length || 0,
                        rating: borrower.rating || 0,
                        blacklisted: borrower.blacklisted || false
                    }
                };
            },
            
            hasActiveLoanInGroup: function(borrower, groupId) {
                // In real implementation, this would query database
                return false;
            },
            
            getPreviousLoans: function(borrower) {
                // In real implementation, this would query database
                return borrower.previousLoans || [];
            }
        },
        
        // Repayment rules
        repayment: {
            period: 7, // days
            interest: 0.10, // 10%
            allowPartial: true,
            allowEarly: true,
            
            // Penalty rules
            penalty: {
                dailyRate: 0.05, // 5% daily after day 7
                gracePeriod: 7, // days
                maxPenalty: 1.00 // 100% maximum
            },
            
            // Default rules
            default: {
                threshold: 60, // days
                actions: ['blacklist', 'crb_report', 'debt_collection'],
                recoveryFee: 0.15 // 15% recovery fee
            },
            
            // Calculate repayment schedule
            calculateSchedule: function(loan) {
                const total = loan.amount * (1 + this.interest);
                const daily = total / this.period;
                
                const schedule = {
                    total: total,
                    daily: daily,
                    breakdown: []
                };
                
                for (let i = 1; i <= this.period; i++) {
                    schedule.breakdown.push({
                        day: i,
                        cumulative: daily * i,
                        remaining: total - (daily * i),
                        dueDate: this.calculateDueDate(loan.date, i)
                    });
                }
                
                return schedule;
            },
            
            calculateDueDate: function(startDate, days) {
                const date = new Date(startDate);
                date.setDate(date.getDate() + days);
                return date;
            },
            
            // Calculate penalties
            calculatePenalties: function(loan, currentDate) {
                const dueDate = new Date(loan.dueDate);
                const today = new Date(currentDate);
                
                if (today <= dueDate) {
                    return {
                        penalty: 0,
                        daysLate: 0,
                        newTotal: loan.totalDue
                    };
                }
                
                const daysLate = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));
                let penalty = 0;
                let currentAmount = loan.amountOverdue || loan.totalDue;
                
                for (let i = 0; i < daysLate; i++) {
                    const dailyPenalty = currentAmount * this.penalty.dailyRate;
                    penalty += dailyPenalty;
                    currentAmount += dailyPenalty;
                    
                    // Cap at 100% penalty
                    if (penalty >= loan.totalDue) {
                        penalty = loan.totalDue;
                        break;
                    }
                }
                
                return {
                    penalty: Math.min(penalty, loan.totalDue * this.penalty.maxPenalty),
                    daysLate: daysLate,
                    newTotal: loan.totalDue + penalty,
                    status: daysLate > this.default.threshold ? 'defaulted' : 'overdue'
                };
            }
        },
        
        // Rating system
        rating: {
            scale: 5,
            factors: [
                'timely_repayment',
                'loan_amount_responsibility',
                'communication',
                'group_participation',
                'referral_quality'
            ],
            
            // Calculate rating
            calculateRating: function(borrower) {
                let score = 0;
                let weight = 0;
                
                // Timely repayment (40% weight)
                if (borrower.repaymentHistory) {
                    const onTimeRate = borrower.repaymentHistory.onTime / borrower.repaymentHistory.total;
                    score += onTimeRate * 40;
                    weight += 40;
                }
                
                // Loan amount responsibility (30% weight)
                if (borrower.loanHistory) {
                    const avgLoan = borrower.loanHistory.total / borrower.loanHistory.count;
                    const responsible = avgLoan <= 5000 ? 1 : avgLoan <= 20000 ? 0.7 : 0.3;
                    score += responsible * 30;
                    weight += 30;
                }
                
                // Communication (15% weight)
                if (borrower.communicationScore) {
                    score += borrower.communicationScore * 15;
                    weight += 15;
                }
                
                // Group participation (10% weight)
                if (borrower.groupParticipation) {
                    score += borrower.groupParticipation * 10;
                    weight += 10;
                }
                
                // Referral quality (5% weight)
                if (borrower.referralQuality) {
                    score += borrower.referralQuality * 5;
                    weight += 5;
                }
                
                const finalScore = weight > 0 ? score / weight : 0;
                const stars = Math.round((finalScore / 100) * this.scale);
                
                return {
                    score: finalScore,
                    stars: Math.min(stars, this.scale),
                    breakdown: {
                        timelyRepayment: borrower.repaymentHistory?.onTimeRate || 0,
                        loanResponsibility: borrower.loanHistory?.responsibility || 0,
                        communication: borrower.communicationScore || 0,
                        groupParticipation: borrower.groupParticipation || 0,
                        referralQuality: borrower.referralQuality || 0
                    }
                };
            },
            
            // Update rating after loan completion
            updateRating: function(borrower, loanOutcome) {
                const currentRating = borrower.rating || 0;
                let newRating = currentRating;
                
                if (loanOutcome.repaidOnTime) {
                    newRating = Math.min(5, currentRating + 0.2);
                } else if (loanOutcome.repaidLate) {
                    newRating = Math.max(1, currentRating - 0.1);
                } else if (loanOutcome.defaulted) {
                    newRating = 1;
                }
                
                return {
                    previous: currentRating,
                    new: newRating,
                    change: newRating - currentRating,
                    reason: loanOutcome.reason || 'Loan completion'
                };
            }
        }
    },
    
    // ============================================
    // 6. SUBSCRIPTION RULES & ENFORCEMENT
    // ============================================
    subscriptions: {
        // Subscription expiry
        expiry: {
            dayOfMonth: 28,
            gracePeriod: 3, // days
            autoRenew: false,
            
            // Calculate expiry date
            calculateExpiry: function(startDate, duration) {
                const date = new Date(startDate);
                
                switch (duration) {
                    case 'monthly':
                        date.setMonth(date.getMonth() + 1);
                        break;
                    case 'biAnnual':
                        date.setMonth(date.getMonth() + 6);
                        break;
                    case 'annual':
                        date.setFullYear(date.getFullYear() + 1);
                        break;
                }
                
                // Set to 28th of the month
                date.setDate(this.dayOfMonth);
                
                return date;
            },
            
            // Check if subscription is active
            isActive: function(subscription) {
                const today = new Date();
                const expiry = new Date(subscription.expiryDate);
                const graceEnd = new Date(expiry);
                graceEnd.setDate(graceEnd.getDate() + this.gracePeriod);
                
                if (today <= expiry) {
                    return { active: true, status: 'active' };
                } else if (today <= graceEnd) {
                    return { active: true, status: 'grace_period' };
                } else {
                    return { active: false, status: 'expired' };
                }
            },
            
            // Calculate days remaining
            daysRemaining: function(subscription) {
                const today = new Date();
                const expiry = new Date(subscription.expiryDate);
                const diff = expiry - today;
                const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
                
                return {
                    days: Math.max(0, days),
                    status: days > 0 ? 'active' : days >= -this.gracePeriod ? 'grace_period' : 'expired',
                    expiryDate: expiry.toLocaleDateString('en-KE')
                };
            }
        },
        
        // Subscription blocking rules
        blocking: {
            // Actions blocked when subscription expires
            blockedActions: [
                'create_new_loan',
                'approve_loan_requests',
                'access_lender_dashboard',
                'view_portfolio',
                'update_ledgers',
                'withdraw_earnings'
            ],
            
            // Check if action is allowed
            isActionAllowed: function(subscriptionStatus, action) {
                if (!subscriptionStatus.active) {
                    return this.blockedActions.includes(action) ? false : true;
                }
                return true;
            },
            
            // Get blocked actions for user
            getBlockedActions: function(subscriptionStatus) {
                if (subscriptionStatus.active) {
                    return [];
                }
                return this.blockedActions;
            }
        },
        
        // Subscription payment rules
        payment: {
            // Payment methods
            methods: ['mpesa', 'bank_transfer', 'card'],
            
            // Payment validation
            validatePayment: function(payment) {
                const errors = [];
                
                // Check amount
                if (!payment.amount || payment.amount <= 0) {
                    errors.push('Invalid payment amount');
                }
                
                // Check method
                if (!this.methods.includes(payment.method)) {
                    errors.push(`Invalid payment method. Valid methods: ${this.methods.join(', ')}`);
                }
                
                // Check reference
                if (!payment.reference) {
                    errors.push('Payment reference required');
                }
                
                // M-Pesa specific validation
                if (payment.method === 'mpesa') {
                    if (!payment.mpesaCode || !payment.mpesaCode.startsWith('RM')) {
                        errors.push('Invalid M-Pesa transaction code');
                    }
                }
                
                return {
                    valid: errors.length === 0,
                    errors,
                    nextSteps: errors.length === 0 ? ['verify_payment', 'update_subscription', 'notify_user'] : []
                };
            },
            
            // Process payment
            processPayment: function(payment) {
                const validation = this.validatePayment(payment);
                
                if (!validation.valid) {
                    return {
                        success: false,
                        errors: validation.errors
                    };
                }
                
                // Simulate payment processing
                const transaction = {
                    id: `TX_KE_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
                    amount: payment.amount,
                    method: payment.method,
                    reference: payment.reference,
                    timestamp: new Date().toISOString(),
                    status: 'pending'
                };
                
                // In real implementation, this would integrate with payment gateway
                setTimeout(() => {
                    transaction.status = 'completed';
                    console.log('Payment processed:', transaction);
                }, 1000);
                
                return {
                    success: true,
                    transaction,
                    message: 'Payment processed successfully'
                };
            }
        }
    },
    
    // ============================================
    // 7. BLACKLIST & DEFAULT MANAGEMENT RULES
    // ============================================
    blacklist: {
        // Default criteria
        defaultCriteria: {
            daysOverdue: 60,
            amountThreshold: 1000,
            numberOfDefaults: 3,
            
            // Check if user should be blacklisted
            shouldBlacklist: function(borrower) {
                const criteria = [];
                
                if (borrower.daysOverdue >= this.daysOverdue) {
                    criteria.push(`Overdue by ${borrower.daysOverdue} days`);
                }
                
                if (borrower.amountOverdue >= this.amountThreshold) {
                    criteria.push(`Overdue amount: ${borrower.amountOverdue}`);
                }
                
                if (borrower.numberOfDefaults >= this.numberOfDefaults) {
                    criteria.push(`${borrower.numberOfDefaults} previous defaults`);
                }
                
                return {
                    shouldBlacklist: criteria.length > 0,
                    criteria,
                    severity: criteria.length // Number of criteria met
                };
            }
        },
        
        // Blacklist effects
        effects: {
            // Actions restricted for blacklisted users
            restrictions: [
                'apply_for_loans',
                'join_new_groups',
                'receive_loan_offers',
                'act_as_guarantor',
                'refer_new_users'
            ],
            
            // Check if action is restricted
            isRestricted: function(user, action) {
                if (!user.blacklisted) return false;
                return this.restrictions.includes(action);
            },
            
            // Get all restrictions for user
            getRestrictions: function(user) {
                if (!user.blacklisted) return [];
                return this.restrictions;
            }
        },
        
        // Blacklist removal criteria
        removal: {
            conditions: [
                'full_repayment',
                'admin_approval',
                'waiting_period',
                'guarantor_assurance'
            ],
            
            // Check if user can be removed from blacklist
            canBeRemoved: function(user) {
                const conditions = [];
                
                if (user.amountOverdue === 0) {
                    conditions.push('full_repayment');
                }
                
                if (user.daysSinceDefault >= 30) {
                    conditions.push('waiting_period');
                }
                
                if (user.guarantorAssurance) {
                    conditions.push('guarantor_assurance');
                }
                
                return {
                    eligible: conditions.length >= 2, // Need at least 2 conditions
                    conditions,
                    missing: this.conditions.filter(c => !conditions.includes(c))
                };
            },
            
            // Process removal
            processRemoval: function(user, admin) {
                const eligibility = this.canBeRemoved(user);
                
                if (!eligibility.eligible) {
                    return {
                        success: false,
                        reason: 'Not eligible for removal',
                        missing: eligibility.missing
                    };
                }
                
                // Admin approval required
                if (!admin || !admin.isAdmin) {
                    return {
                        success: false,
                        reason: 'Admin approval required'
                    };
                }
                
                // Remove from blacklist
                user.blacklisted = false;
                user.blacklistRemoved = new Date().toISOString();
                user.removedBy = admin.id;
                user.removalReason = 'admin_approval';
                
                return {
                    success: true,
                    user,
                    message: 'User removed from blacklist'
                };
            }
        },
        
        // Defaulters registry
        registry: {
            // Add to registry
            addToRegistry: function(user, loan) {
                const entry = {
                    id: `BLACKLIST_KE_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
                    userId: user.id,
                    userName: user.fullName,
                    userPhone: user.phone,
                    nationalId: user.nationalId,
                    
                    // Loan details
                    loanId: loan.id,
                    amountBorrowed: loan.amount,
                    amountOverdue: loan.amountOverdue,
                    daysOverdue: loan.daysOverdue,
                    
                    // Group details
                    groupId: loan.groupId,
                    groupName: loan.groupName,
                    
                    // Lender details
                    lenderId: loan.lenderId,
                    lenderName: loan.lenderName,
                    
                    // Status
                    dateBlacklisted: new Date().toISOString(),
                    status: 'active',
                    attempts: 0
                };
                
                return entry;
            },
            
            // Update registry entry
            updateEntry: function(entry, updates) {
                return {
                    ...entry,
                    ...updates,
                    lastUpdated: new Date().toISOString(),
                    attempts: (entry.attempts || 0) + 1
                };
            },
            
            // Search registry
            searchRegistry: function(registry, criteria) {
                return registry.filter(entry => {
                    let matches = true;
                    
                    if (criteria.name && !entry.userName.toLowerCase().includes(criteria.name.toLowerCase())) {
                        matches = false;
                    }
                    
                    if (criteria.phone && !entry.userPhone.includes(criteria.phone)) {
                        matches = false;
                    }
                    
                    if (criteria.nationalId && !entry.nationalId.includes(criteria.nationalId)) {
                        matches = false;
                    }
                    
                    if (criteria.groupId && entry.groupId !== criteria.groupId) {
                        matches = false;
                    }
                    
                    if (criteria.minAmount && entry.amountOverdue < criteria.minAmount) {
                        matches = false;
                    }
                    
                    return matches;
                });
            }
        }
    },
    
    // ============================================
    // 8. ADMINISTRATION & OVERRIDE RULES
    // ============================================
    administration: {
        // Platform admin rights
        platformAdmin: {
            // Override powers
            overrides: [
                'override_blacklist',
                'edit_ledgers',
                'moderate_ratings',
                'validate_debt_collectors',
                'freeze_accounts',
                'view_all_data',
                'export_data'
            ],
            
            // Check if admin can perform action
            canPerform: function(admin, action) {
                if (!admin || !admin.isAdmin) return false;
                
                // Kenya-specific admin check
                if (admin.country !== 'KE' && action !== 'global_view') {
                    return false;
                }
                
                return this.overrides.includes(action);
            },
            
            // Perform override
            performOverride: function(admin, action, target, reason) {
                if (!this.canPerform(admin, action)) {
                    throw new Error(`Admin not authorized for action: ${action}`);
                }
                
                const override = {
                    id: `OVERRIDE_KE_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
                    adminId: admin.id,
                    adminName: admin.fullName,
                    action,
                    target,
                    reason,
                    timestamp: new Date().toISOString(),
                    country: 'KE'
                };
                
                // Log override
                this.logOverride(override);
                
                return {
                    success: true,
                    override,
                    message: `Override performed: ${action} on ${target}`
                };
            },
            
            // Log override for audit
            logOverride: function(override) {
                console.log('🔧 ADMIN OVERRIDE:', override);
                // In real implementation, this would write to audit log
            }
        },
        
        // Group admin rights
        groupAdmin: {
            // Group admin powers
            powers: [
                'invite_members',
                'remove_members',
                'moderate_content',
                'view_group_stats',
                'set_group_rules',
                'report_to_platform'
            ],
            
            // Check group admin authority
            isGroupAdmin: function(user, groupId) {
                return user.groups?.some(g => g.id === groupId && g.role === 'admin') || false;
            },
            
            // Validate group admin action
            validateAction: function(user, groupId, action) {
                if (!this.isGroupAdmin(user, groupId)) {
                    return {
                        allowed: false,
                        reason: 'User is not admin of this group'
                    };
                }
                
                if (!this.powers.includes(action)) {
                    return {
                        allowed: false,
                        reason: 'Action not permitted for group admin'
                    };
                }
                
                return {
                    allowed: true,
                    admin: user,
                    groupId,
                    action
                };
            }
        },
        
        // Audit logging
        audit: {
            // Actions to audit
            auditedActions: [
                'loan_approval',
                'loan_disbursement',
                'repayment',
                'blacklist',
                'rating_update',
                'admin_override',
                'subscription_change'
            ],
            
            // Create audit log entry
            createLog: function(action, user, details) {
                const log = {
                    id: `AUDIT_KE_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
                    action,
                    userId: user.id,
                    userRole: user.role,
                    country: 'KE',
                    timestamp: new Date().toISOString(),
                    ip: details.ip || 'unknown',
                    userAgent: details.userAgent || 'unknown',
                    details: {
                        ...details,
                        sessionId: details.sessionId || 'unknown'
                    }
                };
                
                return log;
            },
            
            // Search audit logs
            searchLogs: function(logs, criteria) {
                return logs.filter(log => {
                    let matches = true;
                    
                    if (criteria.action && log.action !== criteria.action) {
                        matches = false;
                    }
                    
                    if (criteria.userId && log.userId !== criteria.userId) {
                        matches = false;
                    }
                    
                    if (criteria.startDate && new Date(log.timestamp) < new Date(criteria.startDate)) {
                        matches = false;
                    }
                    
                    if (criteria.endDate && new Date(log.timestamp) > new Date(criteria.endDate)) {
                        matches = false;
                    }
                    
                    return matches;
                });
            }
        }
    },
    
    // ============================================
    // 9. COMPLIANCE & REGULATORY RULES
    // ============================================
    compliance: {
        // Central Bank of Kenya compliance
        cbkCompliance: {
            // Digital Credit Providers Regulations 2022
            regulations: {
                dcp001: 'Registration with CBK required',
                dcp002: 'Interest rate caps apply',
                dcp003: 'Transparency in pricing',
                dcp004: 'Fair treatment of customers',
                dcp005: 'Data protection compliance',
                dcp006: 'Complaints handling mechanism'
            },
            
            // Interest rate caps
            interestCaps: {
                maximum: 0.20, // 20% maximum
                recommended: 0.10, // 10% recommended
                penaltyCap: 1.00 // 100% maximum penalty
            },
            
            // Validate compliance
            validateCompliance: function(transaction) {
                const violations = [];
                
                // Check interest rate
                if (transaction.interestRate > this.interestCaps.maximum) {
                    violations.push(`Interest rate exceeds CBK cap of ${this.interestCaps.maximum * 100}%`);
                }
                
                // Check penalty rate
                if (transaction.penaltyRate > this.interestCaps.penaltyCap) {
                    violations.push(`Penalty rate exceeds CBK cap of ${this.interestCaps.penaltyCap * 100}%`);
                }
                
                // Check transparency
                if (!transaction.disclosure || !transaction.disclosure.includes('total_cost')) {
                    violations.push('Full cost disclosure required');
                }
                
                return {
                    compliant: violations.length === 0,
                    violations,
                    regulation: 'CBK Digital Credit Providers Regulations 2022'
                };
            }
        },
        
        // Data protection compliance
        dataProtection: {
            // Kenya Data Protection Act 2019
            requirements: [
                'lawful_basis_for_processing',
                'purpose_limitation',
                'data_minimization',
                'accuracy',
                'storage_limitation',
                'integrity_and_confidentiality',
                'accountability'
            ],
            
            // Data retention periods
            retention: {
                userData: '7 years',
                transactionData: '10 years',
                auditLogs: 'permanent',
                supportTickets: '2 years'
            },
            
            // Data subject rights
            rights: [
                'right_to_access',
                'right_to_rectification',
                'right_to_erasure',
                'right_to_restrict_processing',
                'right_to_data_portability',
                'right_to_object'
            ],
            
            // Validate data processing
            validateProcessing: function(purpose, data) {
                const requirements = [];
                
                // Check lawful basis
                if (!purpose || !['consent', 'contract', 'legal_obligation'].includes(purpose)) {
                    requirements.push('Lawful basis required for processing');
                }
                
                // Check data minimization
                if (data && Object.keys(data).length > 10) {
                    requirements.push('Only collect necessary data');
                }
                
                return {
                    valid: requirements.length === 0,
                    requirements,
                    lawfulBasis: purpose || 'consent'
                };
            }
        },
        
        // Consumer protection
        consumerProtection: {
            // Fair practices
            fairPractices: [
                'no_hidden_charges',
                'clear_terms',
                'reasonable_penalties',
                'accessible_complaints',
                'no_harassment',
                'privacy_respect'
            ],
            
            // Complaints handling
            complaints: {
                responseTime: '24 hours',
                resolutionTime: '7 days',
                escalationPath: ['platform', 'ombudsman', 'cbk'],
                recordKeeping: '2 years'
            },
            
            // Validate consumer protection
            validatePractice: function(practice, details) {
                const issues = [];
                
                if (!this.fairPractices.includes(practice)) {
                    issues.push('Practice not recognized as fair');
                }
                
                if (practice === 'no_hidden_charges' && details.hiddenCharges) {
                    issues.push('Hidden charges detected');
                }
                
                if (practice === 'clear_terms' && !details.termsClear) {
                    issues.push('Terms not clearly communicated');
                }
                
                return {
                    compliant: issues.length === 0,
                    issues,
                    practice
                };
            }
        }
    },
    
    // ============================================
    // 10. RULES MODULE UTILITIES & VALIDATION
    // ============================================
    utilities: {
        // Validate entire user against all rules
        validateUser: function(user) {
            const violations = [];
            const warnings = [];
            
            // Country isolation validation
            const countryValidation = this.country.isolation.validateUserCountry(user);
            if (!countryValidation.valid) {
                violations.push(...countryValidation.errors);
            }
            
            // Hierarchy validation
            const hierarchyValidation = this.hierarchy.validateHierarchy(user);
            if (!hierarchyValidation.valid) {
                violations.push(...hierarchyValidation.violations);
            }
            
            // Role-specific validation
            if (user.role === 'lender') {
                const lenderValidation = this.lenders.registration.validateRegistration(user);
                if (!lenderValidation.valid) {
                    violations.push(...lenderValidation.errors);
                }
                warnings.push(...lenderValidation.warnings);
            } else if (user.role === 'borrower') {
                const borrowerValidation = this.borrowers.registration.validateRegistration(user);
                if (!borrowerValidation.valid) {
                    violations.push(...borrowerValidation.errors);
                }
            }
            
            // Compliance validation
            if (user.transactions) {
                user.transactions.forEach(tx => {
                    const compliance = this.compliance.cbkCompliance.validateCompliance(tx);
                    if (!compliance.compliant) {
                        violations.push(...compliance.violations);
                    }
                });
            }
            
            return {
                valid: violations.length === 0,
                violations,
                warnings,
                userType: user.role,
                country: 'KE',
                timestamp: new Date().toISOString()
            };
        },
        
        // Generate rule violation report
        generateViolationReport: function(violations) {
            return {
                summary: {
                    totalViolations: violations.length,
                    critical: violations.filter(v => v.includes('must')).length,
                    warnings: violations.filter(v => v.includes('should')).length
                },
                violations: violations.map((v, i) => ({
                    id: i + 1,
                    violation: v,
                    severity: v.includes('must') ? 'critical' : 'warning',
                    rule: this.mapViolationToRule(v)
                })),
                recommendations: violations.map(v => this.getRecommendation(v))
            };
        },
        
        // Map violation to specific rule
        mapViolationToRule: function(violation) {
            const ruleMap = {
                'Phone number must be Kenyan': 'country.isolation.phone_validation',
                'National ID must be 8 digits': 'country.isolation.id_validation',
                'Group must have at least 5 members': 'groups.creation.min_members',
                'Lender must have active subscription': 'lenders.subscription.required',
                'Borrower cannot join more than 4 groups': 'borrowers.membership.max_groups'
            };
            
            return ruleMap[violation] || 'general.compliance';
        },
        
        // Get recommendation for violation
        getRecommendation: function(violation) {
            const recommendations = {
                'Phone number must be Kenyan': 'Use a Kenyan phone number starting with +254',
                'National ID must be 8 digits': 'Provide a valid 8-digit Kenyan National ID',
                'Group must have at least 5 members': 'Invite more members to reach minimum of 5',
                'Lender must have active subscription': 'Subscribe to a lending plan',
                'Borrower cannot join more than 4 groups': 'Leave some groups before joining new ones'
            };
            
            return recommendations[violation] || 'Review and correct the violation';
        },
        
        // Check if action is allowed
        isActionAllowed: function(user, action) {
            // Check blacklist restrictions
            if (user.blacklisted && this.blacklist.effects.isRestricted(user, action)) {
                return {
                    allowed: false,
                    reason: 'Action restricted for blacklisted users',
                    code: 'BLACKLIST_RESTRICTION'
                };
            }
            
            // Check subscription status for lenders
            if (user.role === 'lender') {
                const subStatus = this.subscriptions.expiry.isActive(user.subscription);
                if (!subStatus.active && this.subscriptions.blocking.isActionAllowed(subStatus, action)) {
                    return {
                        allowed: false,
                        reason: 'Subscription expired',
                        code: 'SUBSCRIPTION_EXPIRED'
                    };
                }
            }
            
            // Check group membership for group-specific actions
            if (action.includes('group_') && (!user.groups || user.groups.length === 0)) {
                return {
                    allowed: false,
                    reason: 'User not in any group',
                    code: 'NO_GROUP_MEMBERSHIP'
                };
            }
            
            return {
                allowed: true,
                reason: 'Action permitted',
                code: 'ALLOWED'
            };
        },
        
        // Calculate user score based on rule compliance
        calculateComplianceScore: function(user) {
            let score = 100;
            const deductions = [];
            
            // Country compliance
            const countryValidation = this.country.isolation.validateUserCountry(user);
            if (!countryValidation.valid) {
                score -= 20;
                deductions.push('Country validation failed: -20');
            }
            
            // Hierarchy compliance
            const hierarchyValidation = this.hierarchy.validateHierarchy(user);
            if (!hierarchyValidation.valid) {
                score -= 15;
                deductions.push('Hierarchy violation: -15');
            }
            
            // Role-specific compliance
            if (user.role === 'lender' && !user.subscriptionActive) {
                score -= 25;
                deductions.push('No active subscription: -25');
            }
            
            if (user.role === 'borrower' && user.groups && user.groups.length > 4) {
                score -= 20;
                deductions.push('Too many groups: -20');
            }
            
            // Blacklist deduction
            if (user.blacklisted) {
                score -= 50;
                deductions.push('Blacklisted: -50');
            }
            
            // Rating bonus
            if (user.rating && user.rating >= 4) {
                score += 10;
                deductions.push('Good rating: +10');
            }
            
            return {
                score: Math.max(0, Math.min(100, score)),
                deductions,
                grade: score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : score >= 60 ? 'D' : 'F',
                lastUpdated: new Date().toISOString()
            };
        }
    }
};

// ============================================
// RULES MODULE EXPORT
// ============================================

/**
 * Kenya Rules Module Class
 * Enforces all Kenya-specific business rules and validations
 */
export class KenyaRulesModule {
    constructor() {
        this.config = KenyaRulesConfig;
        this.initialized = false;
        this.ruleViolations = [];
        this.auditLogs = [];
    }
    
    /**
     * Initialize rules module
     */
    initialize() {
        try {
            this.validateAllRules();
            this.initialized = true;
            console.log('⚖️ Kenya Rules Module initialized successfully');
        } catch (error) {
            console.error('❌ Kenya Rules Module initialization failed:', error);
            throw error;
        }
    }
    
    /**
     * Validate all rule configurations
     */
    validateAllRules() {
        const errors = [];
        
        // Validate country rules
        if (this.config.country.code !== 'KE') {
            errors.push('Country code must be KE');
        }
        
        // Validate hierarchy rules
        if (!this.config.hierarchy.levels) {
            errors.push('Hierarchy levels not defined');
        }
        
        // Validate financial rules
        if (this.config.lenders.lending.limits.basic.perLoan !== 1500) {
            errors.push('Basic tier limit must be 1500');
        }
        
        // Validate subscription rules
        if (this.config.subscriptions.expiry.dayOfMonth !== 28) {
            errors.push('Subscription must expire on 28th');
        }
        
        if (errors.length > 0) {
            throw new Error(`Rule validation failed:\n${errors.join('\n')}`);
        }
        
        return true;
    }
    
    /**
     * Validate user against all Kenya rules
     */
    validateUser(user) {
        if (!this.initialized) {
            throw new Error('Rules module not initialized');
        }
        
        return this.config.utilities.validateUser.call(this.config, user);
    }
    
    /**
     * Check if action is allowed for user
     */
    isActionAllowed(user, action) {
        if (!this.initialized) {
            throw new Error('Rules module not initialized');
        }
        
        return this.config.utilities.isActionAllowed.call(this.config, user, action);
    }
    
    /**
     * Validate loan application
     */
    validateLoanApplication(borrower, application) {
        if (!this.initialized) {
            throw new Error('Rules module not initialized');
        }
        
        return this.config.borrowers.loanApplication.validateApplication.call(
            this.config.borrowers.loanApplication,
            borrower,
            application
        );
    }
    
    /**
     * Validate lender loan request
     */
    validateLenderRequest(lender, loanRequest) {
        if (!this.initialized) {
            throw new Error('Rules module not initialized');
        }
        
        return this.config.lenders.lending.validateLoanRequest.call(
            this.config.lenders.lending,
            lender,
            loanRequest
        );
    }
    
    /**
     * Create ledger from approved loan
     */
    createLedger(loanApproval) {
        if (!this.initialized) {
            throw new Error('Rules module not initialized');
        }
        
        return this.config.lenders.ledgers.createLedger.call(
            this.config.lenders.ledgers,
            loanApproval
        );
    }
    
    /**
     * Calculate repayment schedule
     */
    calculateRepaymentSchedule(loan) {
        if (!this.initialized) {
            throw new Error('Rules module not initialized');
        }
        
        return this.config.borrowers.repayment.calculateSchedule.call(
            this.config.borrowers.repayment,
            loan
        );
    }
    
    /**
     * Calculate penalties for late payment
     */
    calculatePenalties(loan, currentDate) {
        if (!this.initialized) {
            throw new Error('Rules module not initialized');
        }
        
        return this.config.borrowers.repayment.calculatePenalties.call(
            this.config.borrowers.repayment,
            loan,
            currentDate
        );
    }
    
    /**
     * Check subscription status
     */
    checkSubscription(subscription) {
        if (!this.initialized) {
            throw new Error('Rules module not initialized');
        }
        
        return this.config.subscriptions.expiry.isActive.call(
            this.config.subscriptions.expiry,
            subscription
        );
    }
    
    /**
     * Check if user should be blacklisted
     */
    shouldBlacklist(borrower) {
        if (!this.initialized) {
            throw new Error('Rules module not initialized');
        }
        
        return this.config.blacklist.defaultCriteria.shouldBlacklist.call(
            this.config.blacklist.defaultCriteria,
            borrower
        );
    }
    
    /**
     * Add to blacklist registry
     */
    addToBlacklistRegistry(user, loan) {
        if (!this.initialized) {
            throw new Error('Rules module not initialized');
        }
        
        return this.config.blacklist.registry.addToRegistry.call(
            this.config.blacklist.registry,
            user,
            loan
        );
    }
    
    /**
     * Perform admin override
     */
    performAdminOverride(admin, action, target, reason) {
        if (!this.initialized) {
            throw new Error('Rules module not initialized');
        }
        
        return this.config.administration.platformAdmin.performOverride.call(
            this.config.administration.platformAdmin,
            admin,
            action,
            target,
            reason
        );
    }
    
    /**
     * Calculate user compliance score
     */
    calculateComplianceScore(user) {
        if (!this.initialized) {
            throw new Error('Rules module not initialized');
        }
        
        return this.config.utilities.calculateComplianceScore.call(
            this.config.utilities,
            user
        );
    }
    
    /**
     * Generate audit log
     */
    generateAuditLog(action, user, details) {
        if (!this.initialized) {
            throw new Error('Rules module not initialized');
        }
        
        const log = this.config.administration.audit.createLog.call(
            this.config.administration.audit,
            action,
            user,
            details
        );
        
        this.auditLogs.push(log);
        return log;
    }
    
    /**
     * Get all audit logs
     */
    getAuditLogs(criteria = {}) {
        if (!this.initialized) {
            throw new Error('Rules module not initialized');
        }
        
        return this.config.administration.audit.searchLogs.call(
            this.config.administration.audit,
            this.auditLogs,
            criteria
        );
    }
    
    /**
     * Validate group creation
     */
    validateGroupCreation(groupData) {
        if (!this.initialized) {
            throw new Error('Rules module not initialized');
        }
        
        return this.config.groups.creation.validateGroupCreation.call(
            this.config.groups.creation,
            groupData
        );
    }
    
    /**
     * Validate referral
     */
    validateReferral(user, referrer1, referrer2) {
        if (!this.initialized) {
            throw new Error('Rules module not initialized');
        }
        
        return this.config.groups.membership.validateReferral.call(
            this.config.groups.membership,
            user,
            referrer1,
            referrer2
        );
    }
    
    /**
     * Check if group switch is allowed
     */
    allowGroupSwitch(user, targetGroup) {
        if (!this.initialized) {
            throw new Error('Rules module not initialized');
        }
        
        return this.config.groups.membership.allowGroupSwitch.call(
            this.config.groups.membership,
            user,
            targetGroup
        );
    }
    
    /**
     * Validate payment
     */
    validatePayment(payment) {
        if (!this.initialized) {
            throw new Error('Rules module not initialized');
        }
        
        return this.config.subscriptions.payment.validatePayment.call(
            this.config.subscriptions.payment,
            payment
        );
    }
    
    /**
     * Process payment
     */
    processPayment(payment) {
        if (!this.initialized) {
            throw new Error('Rules module not initialized');
        }
        
        return this.config.subscriptions.payment.processPayment.call(
            this.config.subscriptions.payment,
            payment
        );
    }
    
    /**
     * Check data protection compliance
     */
    validateDataProcessing(purpose, data) {
        if (!this.initialized) {
            throw new Error('Rules module not initialized');
        }
        
        return this.config.compliance.dataProtection.validateProcessing.call(
            this.config.compliance.dataProtection,
            purpose,
            data
        );
    }
    
    /**
     * Get all rules summary
     */
    getRulesSummary() {
        return {
            country: this.config.country,
            hierarchy: Object.keys(this.config.hierarchy.levels),
            groups: {
                minMembers: this.config.groups.creation.minMembers,
                maxMembers: this.config.groups.creation.maxMembers,
                types: this.config.groups.creation.allowedTypes
            },
            lenders: {
                subscriptionLevels: Object.keys(this.config.lenders.registration.subscriptionLevels),
                categories: this.config.lenders.lending.categories
            },
            borrowers: {
                maxGroups: this.config.borrowers.loanApplication.maxGroups,
                repaymentPeriod: this.config.borrowers.repayment.period
            },
            subscriptions: {
                expiryDay: this.config.subscriptions.expiry.dayOfMonth,
                blockedActions: this.config.subscriptions.blocking.blockedActions
            },
            blacklist: {
                defaultDays: this.config.blacklist.defaultCriteria.daysOverdue,
                removalConditions: this.config.blacklist.removal.conditions
            },
            compliance: {
                interestCap: this.config.compliance.cbkCompliance.interestCaps.maximum,
                dataRetention: this.config.compliance.dataProtection.retention
            }
        };
    }
}

// Singleton instance
let kenyaRulesInstance = null;

/**
 * Get Kenya Rules Module instance
 * @returns {KenyaRulesModule}
 */
export function getKenyaRulesModule() {
    if (!kenyaRulesInstance) {
        kenyaRulesInstance = new KenyaRulesModule();
        kenyaRulesInstance.initialize();
    }
    return kenyaRulesInstance;
}

// Default export
export default KenyaRulesConfig;

// Utility exports
export const KenyaRulesUtils = {
    validateUser: KenyaRulesConfig.utilities.validateUser.bind(KenyaRulesConfig),
    isActionAllowed: KenyaRulesConfig.utilities.isActionAllowed.bind(KenyaRulesConfig),
    calculateComplianceScore: KenyaRulesConfig.utilities.calculateComplianceScore.bind(KenyaRulesConfig)
};

// Auto-initialize in browser context
if (typeof window !== 'undefined') {
    window.MPESEWA_KENYA_RULES = {
        initialized: false,
        instance: null,
        
        init: function() {
            try {
                this.instance = getKenyaRulesModule();
                this.initialized = true;
                console.log('⚖️ Kenya Rules system ready');
            } catch (error) {
                console.error('Failed to initialize Kenya rules:', error);
            }
        },
        
        validate: function(user) {
            if (!this.initialized) this.init();
            return this.instance?.validateUser(user);
        },
        
        can: function(user, action) {
            if (!this.initialized) this.init();
            return this.instance?.isActionAllowed(user, action);
        }
    };
    
    // Initialize on load
    window.addEventListener('DOMContentLoaded', () => {
        window.MPESEWA_KENYA_RULES.init();
    });
}

// Emergency fallback rules
export const KenyaEmergencyRules = {
    country: 'KE',
    enforceStrictIsolation: true,
    allowCriticalOperations: true,
    maintenanceMode: false,
    
    // Minimum viable rules during emergency
    minimalRules: {
        allowLogin: true,
        allowView: true,
        allowBasicTransactions: true,
        blockNewRegistrations: false,
        blockLargeTransactions: true
    },
    
    // Emergency contact
    emergencyContact: {
        platformAdmin: 'admin_ke@mpesewa.com',
        technicalSupport: 'tech_ke@mpesewa.com',
        phone: '+254 709 219 000'
    }
};