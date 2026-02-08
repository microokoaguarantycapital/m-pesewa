/**
 * M-PESEWA Group Validation System
 * STRICT VALIDATION: Comprehensive validation for all group operations
 * Non-negotiable validation rules following hierarchy and business rules
 */

class GroupValidation {
    constructor() {
        this.rules = new GroupRules();
        this.countries = this.rules.countries;
        this.currencyMap = this.rules.currencyMap;
    }

    /**
     * Validate group creation request
     * @param {object} request - Group creation request
     * @param {object} user - User attempting creation
     * @returns {object} Validation result
     */
    validateGroupCreation(request, user) {
        const errors = [];
        const warnings = [];
        
        // 1. USER VALIDATION
        if (!user || !user.id) {
            errors.push('User authentication required');
        }
        
        if (user.age < this.rules.rules.group.creation.minAge) {
            errors.push(`Minimum age ${this.rules.rules.group.creation.minAge} required`);
        }
        
        if (!user.nationalIdVerified) {
            errors.push('National ID verification required');
        }
        
        if (!user.phoneVerified) {
            errors.push('Phone verification required');
        }
        
        // 2. GROUP NAME VALIDATION
        if (!request.name || request.name.trim().length === 0) {
            errors.push('Group name is required');
        } else if (request.name.trim().length < 3) {
            errors.push('Group name must be at least 3 characters');
        } else if (request.name.trim().length > 100) {
            errors.push('Group name must be less than 100 characters');
        }
        
        // 3. GROUP TYPE VALIDATION
        const allowedTypes = this.rules.rules.group.types.allowed.map(t => t.toLowerCase());
        if (!request.type || !allowedTypes.includes(request.type.toLowerCase())) {
            errors.push(`Group type must be one of: ${this.rules.rules.group.types.allowed.join(', ')}`);
        }
        
        // 4. COUNTRY VALIDATION
        if (!request.country) {
            errors.push('Country selection is required');
        } else if (!this.countries.includes(request.country)) {
            errors.push(`Country ${request.country} not supported`);
        }
        
        // 5. USER GROUP LIMIT VALIDATION
        if (user.groupCount >= 5) {
            errors.push('Maximum of 5 groups per user reached');
        }
        
        // 6. SUBSCRIPTION VALIDATION FOR LENDER GROUPS
        const isLenderGroup = ['professional', 'lender_group', 'business_association'].includes(request.type?.toLowerCase());
        if (isLenderGroup) {
            if (!user.subscriptionActive) {
                errors.push('Active subscription required for lender groups');
            } else if (this.rules.isSubscriptionExpired(user.subscriptionExpiry)) {
                errors.push('Subscription expired. Renew to create lender groups');
            }
        }
        
        // 7. COUNTRY LOCK VALIDATION
        if (request.country !== user.country) {
            errors.push('Group country must match user country');
        }
        
        // 8. NICKNAME VALIDATION (Optional)
        if (request.nickname && request.nickname.length > 50) {
            warnings.push('Group nickname should be less than 50 characters');
        }
        
        // 9. DESCRIPTION VALIDATION
        if (request.description && request.description.length > 500) {
            warnings.push('Group description should be less than 500 characters');
        }
        
        // 10. INTERNAL RULES VALIDATION
        if (request.internalRules && request.internalRules.length > 2000) {
            warnings.push('Internal rules should be less than 2000 characters');
        }
        
        return {
            valid: errors.length === 0,
            errors: errors,
            warnings: warnings,
            sanitized: this.sanitizeGroupData(request),
            code: errors.length === 0 ? 'VALID' : 'INVALID'
        };
    }

    /**
     * Validate member join request
     * @param {object} request - Join request
     * @param {object} group - Target group
     * @param {object} user - User attempting to join
     * @returns {object} Validation result
     */
    validateMemberJoin(request, group, user) {
        const errors = [];
        
        // 1. GROUP STATE VALIDATION
        if (group.state !== 'ACTIVE') {
            errors.push(`Group is ${group.state.toLowerCase()}. Cannot join.`);
        }
        
        // 2. COUNTRY ISOLATION VALIDATION
        if (user.country !== group.country) {
            errors.push('Cannot join group from different country');
        }
        
        // 3. GROUP CAPACITY VALIDATION
        if (group.memberCount >= this.rules.rules.group.membership.maxMembers) {
            errors.push('Group is at maximum capacity (1000 members)');
        }
        
        // 4. BORROWER GROUP LIMIT VALIDATION
        if (user.roles.includes('BORROWER')) {
            if (user.groupIds.length >= this.rules.rules.hierarchy.borrowers.maxGroups) {
                if (user.rating < this.rules.rules.borrower.borrowing.goodRatingThreshold) {
                    errors.push(`Maximum ${this.rules.rules.hierarchy.borrowers.maxGroups} groups reached. Rating of ${this.rules.rules.borrower.borrowing.goodRatingThreshold}+ required.`);
                }
            }
        }
        
        // 5. REFERRAL VALIDATION
        if (this.rules.rules.group.membership.referralRequired && !request.referrerId) {
            errors.push('Referral from existing member required');
        }
        
        // 6. BLACKLIST VALIDATION
        if (user.blacklisted) {
            errors.push('Blacklisted users cannot join new groups');
        }
        
        // 7. ALREADY MEMBER VALIDATION
        const isAlreadyMember = group.members.some(m => m.userId === user.id);
        if (isAlreadyMember) {
            errors.push('User is already a member of this group');
        }
        
        // 8. ROLE VALIDATION
        if (!request.role || !['LENDER', 'BORROWER'].includes(request.role.toUpperCase())) {
            errors.push('Valid role (LENDER or BORROWER) required');
        }
        
        // 9. LENDER SUBSCRIPTION VALIDATION
        if (request.role.toUpperCase() === 'LENDER') {
            if (!user.subscriptionActive) {
                errors.push('Active subscription required to join as lender');
            }
        }
        
        // 10. REFERRER VALIDATION
        if (request.referrerId) {
            const referrer = group.members.find(m => m.userId === request.referrerId);
            if (!referrer) {
                errors.push('Referrer is not a member of this group');
            } else if (referrer.role === 'BORROWER') {
                errors.push('Referrer must be lender or admin');
            }
        }
        
        return {
            valid: errors.length === 0,
            errors: errors,
            code: errors.length === 0 ? 'VALID' : 'INVALID'
        };
    }

    /**
     * Validate loan request
     * @param {object} request - Loan request
     * @param {object} borrower - Borrower data
     * @param {object} lender - Lender data
     * @param {object} group - Group data
     * @returns {object} Validation result
     */
    validateLoanRequest(request, borrower, lender, group) {
        const errors = [];
        const warnings = [];
        
        // 1. GROUP STATE VALIDATION
        if (group.state !== 'ACTIVE') {
            errors.push(`Group is ${group.state.toLowerCase()}. Cannot process loans.`);
        }
        
        // 2. BORROWER ELIGIBILITY
        if (borrower.blacklisted) {
            errors.push('Borrower is blacklisted');
        }
        
        if (borrower.rating < 3.0) {
            errors.push('Borrower rating too low (minimum 3.0)');
        }
        
        // 3. LENDER ELIGIBILITY
        if (!lender.subscriptionActive) {
            errors.push('Lender subscription inactive');
        }
        
        if (this.rules.isSubscriptionExpired(lender.subscriptionExpiry)) {
            errors.push('Lender subscription expired');
        }
        
        // 4. LOAN AMOUNT VALIDATION
        const tierLimit = this.rules.rules.lending.limits.perLoan[lender.subscriptionTier];
        if (request.amount > tierLimit) {
            errors.push(`Loan amount exceeds ${lender.subscriptionTier} tier limit of ${tierLimit}`);
        }
        
        if (request.amount < 5) { // Minimum equivalent of 5 KSh
            errors.push('Minimum loan amount is 5');
        }
        
        // 5. ACTIVE LOANS VALIDATION
        if (borrower.activeLoansInGroup >= 1) {
            errors.push('Borrower already has active loan in this group');
        }
        
        // 6. CATEGORY VALIDATION
        if (!request.category) {
            errors.push('Loan category is required');
        } else if (!this.rules.rules.categories.includes(request.category)) {
            warnings.push('Category not in standard emergency categories');
        }
        
        // 7. LENDER CATEGORY PREFERENCE
        if (!lender.categories.includes('ALL') && !lender.categories.includes(request.category)) {
            errors.push('Lender does not support this loan category');
        }
        
        // 8. REPAYMENT PERIOD VALIDATION
        if (request.duration > 7) {
            errors.push('Maximum loan duration is 7 days');
        }
        
        if (request.duration < 1) {
            errors.push('Minimum loan duration is 1 day');
        }
        
        // 9. INTEREST VALIDATION
        const expectedInterest = request.amount * 0.10;
        if (Math.abs(request.interest - expectedInterest) > 1) {
            warnings.push('Interest should be 10% of principal');
        }
        
        // 10. GUARANTOR VALIDATION
        if (!request.guarantor1 || !request.guarantor2) {
            errors.push('Two guarantors required');
        } else {
            if (!this.validatePhoneNumber(request.guarantor1.phone, group.country)) {
                errors.push('Invalid phone number for guarantor 1');
            }
            
            if (!this.validatePhoneNumber(request.guarantor2.phone, group.country)) {
                errors.push('Invalid phone number for guarantor 2');
            }
            
            if (request.guarantor1.phone === request.guarantor2.phone) {
                errors.push('Guarantors must have different phone numbers');
            }
            
            if (request.guarantor1.phone === borrower.phone) {
                errors.push('Guarantor 1 cannot be the borrower');
            }
            
            if (request.guarantor2.phone === borrower.phone) {
                errors.push('Guarantor 2 cannot be the borrower');
            }
        }
        
        // 11. PURPOSE VALIDATION
        if (!request.purpose || request.purpose.trim().length === 0) {
            errors.push('Loan purpose is required');
        } else if (request.purpose.length > 500) {
            warnings.push('Loan purpose should be less than 500 characters');
        }
        
        return {
            valid: errors.length === 0,
            errors: errors,
            warnings: warnings,
            sanitized: this.sanitizeLoanData(request),
            code: errors.length === 0 ? 'VALID' : 'INVALID'
        };
    }

    /**
     * Validate ledger update
     * @param {object} update - Ledger update request
     * @param {object} ledger - Current ledger
     * @param {object} user - User making update
     * @returns {object} Validation result
     */
    validateLedgerUpdate(update, ledger, user) {
        const errors = [];
        
        // 1. USER AUTHORIZATION
        const isLender = ledger.lenderId === user.id;
        const isAdmin = user.role === 'ADMIN';
        
        if (!isLender && !isAdmin) {
            errors.push('Only lender or admin can update ledger');
        }
        
        // 2. LEDGER STATE VALIDATION
        if (ledger.status === 'CLEARED') {
            errors.push('Cannot update cleared ledger');
        }
        
        if (ledger.status === 'DEFAULTED' && !isAdmin) {
            errors.push('Only admin can update defaulted ledger');
        }
        
        // 3. REPAYMENT AMOUNT VALIDATION
        if (update.repaymentAmount) {
            if (update.repaymentAmount <= 0) {
                errors.push('Repayment amount must be positive');
            }
            
            if (update.repaymentAmount > ledger.amountOutstanding) {
                errors.push('Repayment amount exceeds outstanding balance');
            }
        }
        
        // 4. PENALTY VALIDATION
        if (update.penaltyAmount) {
            if (update.penaltyAmount < 0) {
                errors.push('Penalty amount cannot be negative');
            }
            
            // Check if loan is overdue for penalty
            const dueDate = new Date(ledger.dueDate);
            const today = new Date();
            if (today <= dueDate && update.penaltyAmount > 0) {
                errors.push('Cannot apply penalty before due date');
            }
        }
        
        // 5. STATUS TRANSITION VALIDATION
        if (update.status) {
            const validTransitions = {
                'ACTIVE': ['OVERDUE', 'CLEARED', 'DEFAULTED'],
                'OVERDUE': ['ACTIVE', 'CLEARED', 'DEFAULTED'],
                'DEFAULTED': ['CLEARED'], // Only admin can clear defaults
                'CLEARED': [] // No transitions from cleared
            };
            
            const allowedTransitions = validTransitions[ledger.status] || [];
            if (!allowedTransitions.includes(update.status)) {
                errors.push(`Cannot transition from ${ledger.status} to ${update.status}`);
            }
            
            // Special validation for CLEARED status
            if (update.status === 'CLEARED' && ledger.amountOutstanding > 0) {
                errors.push('Cannot clear ledger with outstanding balance');
            }
        }
        
        // 6. NOTE VALIDATION
        if (update.notes && update.notes.length > 1000) {
            errors.push('Notes must be less than 1000 characters');
        }
        
        // 7. DATE VALIDATION
        if (update.repaymentDate) {
            const repaymentDate = new Date(update.repaymentDate);
            const disbursementDate = new Date(ledger.disbursementDate);
            const today = new Date();
            
            if (repaymentDate < disbursementDate) {
                errors.push('Repayment date cannot be before disbursement date');
            }
            
            if (repaymentDate > today) {
                errors.push('Repayment date cannot be in the future');
            }
        }
        
        return {
            valid: errors.length === 0,
            errors: errors,
            sanitized: this.sanitizeLedgerUpdate(update),
            code: errors.length === 0 ? 'VALID' : 'INVALID'
        };
    }

    /**
     * Validate group state transition
     * @param {string} currentState - Current group state
     * @param {string} newState - Desired new state
     * @param {object} user - User attempting transition
     * @param {object} group - Group data
     * @returns {object} Validation result
     */
    validateStateTransition(currentState, newState, user, group) {
        const errors = [];
        
        // 1. USER ROLE VALIDATION
        const userRole = this.getUserRoleInGroup(user.id, group);
        
        // State transitions require specific roles
        const transitionRoles = {
            'ACTIVATE': ['ADMIN'],
            'LOCK': ['ADMIN'],
            'UNLOCK': ['ADMIN'],
            'SUSPEND': ['PLATFORM_ADMIN'],
            'REACTIVATE': ['PLATFORM_ADMIN'],
            'ARCHIVE': ['ADMIN']
        };
        
        const transition = this.getTransitionName(currentState, newState);
        const requiredRole = transitionRoles[transition];
        
        if (!requiredRole || !requiredRole.includes(userRole)) {
            errors.push(`Role ${userRole} cannot perform ${transition}`);
        }
        
        // 2. STATE TRANSITION VALIDATION
        const validTransitions = {
            'CREATED': ['ACTIVE'],
            'ACTIVE': ['LOCKED', 'SUSPENDED', 'ARCHIVED'],
            'LOCKED': ['ACTIVE', 'SUSPENDED', 'ARCHIVED'],
            'SUSPENDED': ['ACTIVE', 'ARCHIVED'],
            'ARCHIVED': [] // No transitions from archived
        };
        
        const allowedTransitions = validTransitions[currentState] || [];
        if (!allowedTransitions.includes(newState)) {
            errors.push(`Cannot transition from ${currentState} to ${newState}`);
        }
        
        // 3. ARCHIVED STATE VALIDATION
        if (newState === 'ARCHIVED') {
            if (group.activeLoans > 0) {
                errors.push('Cannot archive group with active loans');
            }
            
            if (group.memberCount > 0) {
                errors.push('Cannot archive group with active members');
            }
        }
        
        // 4. SUSPENDED STATE VALIDATION
        if (newState === 'SUSPENDED' && userRole !== 'PLATFORM_ADMIN') {
            errors.push('Only platform admin can suspend groups');
        }
        
        // 5. REASON VALIDATION
        if (!user.transitionReason || user.transitionReason.trim().length === 0) {
            errors.push('Transition reason is required');
        }
        
        return {
            valid: errors.length === 0,
            errors: errors,
            transition: transition,
            code: errors.length === 0 ? 'VALID' : 'INVALID'
        };
    }

    /**
     * Validate user registration
     * @param {object} userData - User registration data
     * @param {string} country - User country
     * @returns {object} Validation result
     */
    validateUserRegistration(userData, country) {
        const errors = [];
        const warnings = [];
        
        // 1. BASIC INFORMATION
        if (!userData.fullName || userData.fullName.trim().length < 2) {
            errors.push('Full name is required (min 2 characters)');
        }
        
        // 2. NATIONAL ID VALIDATION
        if (!userData.nationalId) {
            errors.push('National ID is required');
        } else {
            const idPattern = this.rules.rules.validation.nationalId[country.toLowerCase()] || 
                             this.rules.rules.validation.nationalId.default;
            if (!idPattern.test(userData.nationalId)) {
                errors.push(`Invalid national ID format for ${country}`);
            }
        }
        
        // 3. PHONE NUMBER VALIDATION
        if (!userData.phone) {
            errors.push('Phone number is required');
        } else if (!this.validatePhoneNumber(userData.phone, country)) {
            errors.push(`Invalid phone number format for ${country}`);
        }
        
        // 4. LOCATION VALIDATION
        if (!userData.location || userData.location.trim().length === 0) {
            errors.push('Location is required');
        }
        
        // 5. USERNAME VALIDATION
        if (!userData.username || userData.username.trim().length < 3) {
            errors.push('Username must be at least 3 characters');
        } else if (userData.username.length > 20) {
            errors.push('Username must be less than 20 characters');
        } else if (!/^[a-zA-Z0-9_]+$/.test(userData.username)) {
            errors.push('Username can only contain letters, numbers, and underscores');
        }
        
        // 6. PASSWORD VALIDATION
        if (!userData.password) {
            errors.push('Password is required');
        } else {
            const passwordValidation = this.rules.validatePassword(userData.password);
            if (!passwordValidation.valid) {
                errors.push(...passwordValidation.errors);
            }
            
            if (passwordValidation.strength === 'WEAK') {
                warnings.push('Password strength is weak');
            }
        }
        
        // 7. CONFIRM PASSWORD
        if (userData.password !== userData.confirmPassword) {
            errors.push('Passwords do not match');
        }
        
        // 8. EMAIL VALIDATION (Optional)
        if (userData.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(userData.email)) {
                errors.push('Invalid email format');
            }
        }
        
        // 9. AGE VALIDATION
        if (!userData.dateOfBirth) {
            errors.push('Date of birth is required');
        } else {
            const birthDate = new Date(userData.dateOfBirth);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            
            if (age < this.rules.rules.group.creation.minAge) {
                errors.push(`Minimum age ${this.rules.rules.group.creation.minAge} required`);
            }
        }
        
        // 10. ROLE VALIDATION
        if (!userData.role || !['BORROWER', 'LENDER'].includes(userData.role.toUpperCase())) {
            errors.push('Valid role (BORROWER or LENDER) required');
        }
        
        // 11. SUBSCRIPTION VALIDATION FOR LENDERS
        if (userData.role.toUpperCase() === 'LENDER' && !userData.subscriptionTier) {
            errors.push('Subscription tier required for lenders');
        }
        
        // 12. CATEGORIES VALIDATION FOR LENDERS
        if (userData.role.toUpperCase() === 'LENDER') {
            if (!userData.categories || userData.categories.length === 0) {
                errors.push('At least one lending category required');
            }
        }
        
        return {
            valid: errors.length === 0,
            errors: errors,
            warnings: warnings,
            sanitized: this.sanitizeUserData(userData),
            code: errors.length === 0 ? 'VALID' : 'INVALID'
        };
    }

    /**
     * Validate phone number
     * @param {string} phone - Phone number
     * @param {string} country - Country name
     * @returns {boolean} True if valid
     */
    validatePhoneNumber(phone, country) {
        return this.rules.validatePhoneNumber(phone, country);
    }

    /**
     * Sanitize group data
     * @param {object} data - Group data
     * @returns {object} Sanitized data
     */
    sanitizeGroupData(data) {
        return {
            name: data.name ? data.name.trim() : '',
            nickname: data.nickname ? data.nickname.trim().substring(0, 50) : '',
            type: data.type ? data.type.toUpperCase() : 'FAMILY',
            country: data.country || '',
            description: data.description ? data.description.trim().substring(0, 500) : '',
            internalRules: data.internalRules ? data.internalRules.trim().substring(0, 2000) : '',
            inviteOnly: data.inviteOnly !== false, // Default true
            referralRequired: data.referralRequired !== false // Default true
        };
    }

    /**
     * Sanitize loan data
     * @param {object} data - Loan data
     * @returns {object} Sanitized data
     */
    sanitizeLoanData(data) {
        return {
            amount: Math.max(5, Math.min(data.amount, 50000)), // Clamp to reasonable range
            category: data.category || '',
            duration: Math.max(1, Math.min(data.duration || 7, 7)),
            interest: data.interest || data.amount * 0.10,
            purpose: data.purpose ? data.purpose.trim().substring(0, 500) : '',
            guarantor1: data.guarantor1 ? {
                name: data.guarantor1.name.trim().substring(0, 100),
                phone: data.guarantor1.phone.trim(),
                relationship: data.guarantor1.relationship?.trim().substring(0, 50) || ''
            } : null,
            guarantor2: data.guarantor2 ? {
                name: data.guarantor2.name.trim().substring(0, 100),
                phone: data.guarantor2.phone.trim(),
                relationship: data.guarantor2.relationship?.trim().substring(0, 50) || ''
            } : null,
            repaymentMethod: data.repaymentMethod || 'DAILY'
        };
    }

    /**
     * Sanitize ledger update
     * @param {object} data - Ledger update data
     * @returns {object} Sanitized data
     */
    sanitizeLedgerUpdate(data) {
        return {
            repaymentAmount: data.repaymentAmount ? Math.max(0, data.repaymentAmount) : null,
            penaltyAmount: data.penaltyAmount ? Math.max(0, data.penaltyAmount) : null,
            status: data.status || null,
            notes: data.notes ? data.notes.trim().substring(0, 1000) : '',
            repaymentDate: data.repaymentDate || new Date().toISOString().split('T')[0],
            updatedBy: data.updatedBy || 'SYSTEM'
        };
    }

    /**
     * Sanitize user data
     * @param {object} data - User data
     * @returns {object} Sanitized data
     */
    sanitizeUserData(data) {
        return {
            fullName: data.fullName ? data.fullName.trim() : '',
            nationalId: data.nationalId ? data.nationalId.trim() : '',
            phone: data.phone ? data.phone.trim() : '',
            location: data.location ? data.location.trim() : '',
            username: data.username ? data.username.trim().toLowerCase() : '',
            password: data.password || '', // Will be hashed
            email: data.email ? data.email.trim().toLowerCase() : '',
            dateOfBirth: data.dateOfBirth || '',
            role: data.role ? data.role.toUpperCase() : 'BORROWER',
            subscriptionTier: data.subscriptionTier ? data.subscriptionTier.toUpperCase() : null,
            categories: data.categories || [],
            brandName: data.brandName ? data.brandName.trim().substring(0, 50) : ''
        };
    }

    /**
     * Get user role in group
     * @param {string} userId - User ID
     * @param {object} group - Group object
     * @returns {string} User role
     */
    getUserRoleInGroup(userId, group) {
        const member = group.members.find(m => m.userId === userId);
        return member ? member.role : 'GUEST';
    }

    /**
     * Get transition name from states
     * @param {string} fromState - Current state
     * @param {string} toState - Target state
     * @returns {string} Transition name
     */
    getTransitionName(fromState, toState) {
        const transitions = {
            'CREATED-ACTIVE': 'ACTIVATE',
            'ACTIVE-LOCKED': 'LOCK',
            'LOCKED-ACTIVE': 'UNLOCK',
            'ACTIVE-SUSPENDED': 'SUSPEND',
            'LOCKED-SUSPENDED': 'SUSPEND',
            'SUSPENDED-ACTIVE': 'REACTIVATE',
            'ACTIVE-ARCHIVED': 'ARCHIVE',
            'LOCKED-ARCHIVED': 'ARCHIVE',
            'SUSPENDED-ARCHIVED': 'ARCHIVE',
            'CREATED-ARCHIVED': 'ARCHIVE'
        };
        
        return transitions[`${fromState}-${toState}`] || 'UNKNOWN';
    }

    /**
     * Validate currency amount
     * @param {number} amount - Amount to validate
     * @param {string} currency - Currency code
     * @returns {object} Validation result
     */
    validateCurrencyAmount(amount, currency) {
        const errors = [];
        
        if (typeof amount !== 'number' || isNaN(amount)) {
            errors.push('Amount must be a valid number');
        }
        
        if (amount < 0) {
            errors.push('Amount cannot be negative');
        }
        
        // Check decimal places based on currency
        const decimalPlaces = (amount.toString().split('.')[1] || '').length;
        
        switch (currency) {
            case 'KSh':
            case 'UGX':
            case 'TZS':
                if (decimalPlaces > 0) {
                    errors.push(`${currency} amounts must be whole numbers`);
                }
                break;
            case 'NGN':
            case 'GHS':
                if (decimalPlaces > 2) {
                    errors.push(`${currency} amounts can have up to 2 decimal places`);
                }
                break;
            default:
                if (decimalPlaces > 2) {
                    warnings.push(`Amount has ${decimalPlaces} decimal places`);
                }
        }
        
        return {
            valid: errors.length === 0,
            errors: errors,
            roundedAmount: this.roundCurrencyAmount(amount, currency)
        };
    }

    /**
     * Round currency amount based on currency rules
     * @param {number} amount - Amount to round
     * @param {string} currency - Currency code
     * @returns {number} Rounded amount
     */
    roundCurrencyAmount(amount, currency) {
        switch (currency) {
            case 'KSh':
            case 'UGX':
            case 'TZS':
            case 'RWF':
            case 'BIF':
            case 'CDF':
                return Math.round(amount);
            case 'NGN':
            case 'GHS':
            case 'ZAR':
            case 'ETB':
                return Math.round(amount * 100) / 100;
            default:
                return Math.round(amount * 100) / 100;
        }
    }

    /**
     * Validate date range
     * @param {string} startDate - Start date
     * @param {string} endDate - End date
     * @returns {object} Validation result
     */
    validateDateRange(startDate, endDate) {
        const errors = [];
        
        const start = new Date(startDate);
        const end = new Date(endDate);
        const today = new Date();
        
        if (isNaN(start.getTime())) {
            errors.push('Invalid start date');
        }
        
        if (isNaN(end.getTime())) {
            errors.push('Invalid end date');
        }
        
        if (start > end) {
            errors.push('Start date cannot be after end date');
        }
        
        if (end > today) {
            errors.push('End date cannot be in the future');
        }
        
        const maxRange = 365 * 24 * 60 * 60 * 1000; // 1 year in milliseconds
        if ((end - start) > maxRange) {
            errors.push('Date range cannot exceed 1 year');
        }
        
        return {
            valid: errors.length === 0,
            errors: errors,
            startDate: start.toISOString().split('T')[0],
            endDate: end.toISOString().split('T')[0],
            days: Math.ceil((end - start) / (1000 * 60 * 60 * 24))
        };
    }

    /**
     * Validate search criteria
     * @param {object} criteria - Search criteria
     * @returns {object} Validation result
     */
    validateSearchCriteria(criteria) {
        const errors = [];
        const sanitized = {};
        
        // Search term validation
        if (criteria.searchTerm) {
            if (criteria.searchTerm.length > 100) {
                errors.push('Search term too long (max 100 characters)');
            } else {
                sanitized.searchTerm = criteria.searchTerm.trim().substring(0, 100);
            }
        }
        
        // Group type validation
        if (criteria.groupType) {
            const allowedTypes = this.rules.rules.group.types.allowed.map(t => t.toLowerCase());
            if (!allowedTypes.includes(criteria.groupType.toLowerCase())) {
                errors.push(`Invalid group type: ${criteria.groupType}`);
            } else {
                sanitized.groupType = criteria.groupType.toUpperCase();
            }
        }
        
        // Country validation
        if (criteria.country) {
            if (!this.countries.includes(criteria.country)) {
                errors.push(`Country not supported: ${criteria.country}`);
            } else {
                sanitized.country = criteria.country;
            }
        }
        
        // Min members validation
        if (criteria.minMembers !== undefined) {
            const minMembers = parseInt(criteria.minMembers);
            if (isNaN(minMembers) || minMembers < 0) {
                errors.push('Minimum members must be a positive number');
            } else {
                sanitized.minMembers = Math.min(minMembers, 1000);
            }
        }
        
        // Max members validation
        if (criteria.maxMembers !== undefined) {
            const maxMembers = parseInt(criteria.maxMembers);
            if (isNaN(maxMembers) || maxMembers < 0) {
                errors.push('Maximum members must be a positive number');
            } else {
                sanitized.maxMembers = Math.min(maxMembers, 1000);
            }
        }
        
        // Min rating validation
        if (criteria.minRating !== undefined) {
            const minRating = parseFloat(criteria.minRating);
            if (isNaN(minRating) || minRating < 0 || minRating > 5) {
                errors.push('Minimum rating must be between 0 and 5');
            } else {
                sanitized.minRating = Math.round(minRating * 10) / 10;
            }
        }
        
        // Sort validation
        if (criteria.sortBy) {
            const validSortFields = ['name', 'memberCount', 'rating', 'createdAt', 'totalAmountLent'];
            if (!validSortFields.includes(criteria.sortBy)) {
                errors.push(`Invalid sort field: ${criteria.sortBy}`);
            } else {
                sanitized.sortBy = criteria.sortBy;
            }
        }
        
        // Sort order validation
        if (criteria.sortOrder) {
            if (!['asc', 'desc'].includes(criteria.sortOrder.toLowerCase())) {
                errors.push('Sort order must be "asc" or "desc"');
            } else {
                sanitized.sortOrder = criteria.sortOrder.toLowerCase();
            }
        }
        
        // Pagination validation
        if (criteria.page !== undefined) {
            const page = parseInt(criteria.page);
            if (isNaN(page) || page < 1) {
                errors.push('Page must be a positive number');
            } else {
                sanitized.page = page;
            }
        }
        
        if (criteria.limit !== undefined) {
            const limit = parseInt(criteria.limit);
            if (isNaN(limit) || limit < 1 || limit > 100) {
                errors.push('Limit must be between 1 and 100');
            } else {
                sanitized.limit = limit;
            }
        }
        
        return {
            valid: errors.length === 0,
            errors: errors,
            sanitized: sanitized,
            code: errors.length === 0 ? 'VALID' : 'INVALID'
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GroupValidation;
}