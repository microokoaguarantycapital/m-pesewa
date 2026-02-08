/**
 * M-Pesewa Onboarding Flow Orchestrator
 * Handles new user onboarding: registration, verification, preferences
 * Enforces strict country and group hierarchy rules
 */

class OnboardingFlow {
    constructor() {
        this.currentStep = 'INITIAL';
        this.steps = {
            INITIAL: 'INITIAL',
            ROLE_SELECTION: 'ROLE_SELECTION',
            COUNTRY_SELECTION: 'COUNTRY_SELECTION',
            PERSONAL_DETAILS: 'PERSONAL_DETAILS',
            GROUP_SELECTION: 'GROUP_SELECTION',
            SUBSCRIPTION_SELECTION: 'SUBSCRIPTION_SELECTION',
            VERIFICATION: 'VERIFICATION',
            PREFERENCES: 'PREFERENCES',
            COMPLETED: 'COMPLETED'
        };
        
        this.userData = {
            role: null, // 'BORROWER', 'LENDER', or 'DUAL'
            country: null,
            group: null,
            personalDetails: {},
            subscription: null,
            verification: {},
            preferences: {}
        };
        
        this.supportedCountries = [
            'Kenya', 'Uganda', 'Tanzania', 'Rwanda', 'Burundi', 'DRC', 
            'South Sudan', 'South Africa', 'Nigeria', 'Ghana', 'Ethiopia'
        ];
        
        this.countryCurrencies = {
            'Kenya': 'KSh',
            'Uganda': 'UGX',
            'Tanzania': 'TZS',
            'Rwanda': 'RWF',
            'Burundi': 'BIF',
            'DRC': 'CDF',
            'South Sudan': 'SSP',
            'South Africa': 'ZAR',
            'Nigeria': 'NGN',
            'Ghana': 'GHS',
            'Ethiopia': 'ETB'
        };
    }

    // MAIN ONBOARDING ORCHESTRATION
    async startOnboarding(initialData = {}) {
        try {
            this.currentStep = this.steps.INITIAL;
            
            // Check if user already has session
            if (await this.checkExistingSession()) {
                return {
                    success: false,
                    redirect: '/dashboard',
                    message: 'User already has active session'
                };
            }
            
            return {
                success: true,
                step: this.currentStep,
                nextStep: this.steps.ROLE_SELECTION,
                message: 'Onboarding started successfully'
            };
            
        } catch (error) {
            return {
                success: false,
                error: error.message,
                step: this.currentStep
            };
        }
    }

    async selectRole(roleData) {
        try {
            if (this.currentStep !== this.steps.INITIAL && 
                this.currentStep !== this.steps.ROLE_SELECTION) {
                throw new Error('Invalid step for role selection');
            }
            
            // Validate role selection
            if (!['BORROWER', 'LENDER', 'DUAL'].includes(roleData.role)) {
                throw new Error('Invalid role selected');
            }
            
            this.userData.role = roleData.role;
            this.currentStep = this.steps.COUNTRY_SELECTION;
            
            return {
                success: true,
                step: this.currentStep,
                userData: this.getPublicUserData(),
                nextStep: this.steps.COUNTRY_SELECTION,
                message: `Role selected: ${roleData.role}`
            };
            
        } catch (error) {
            return {
                success: false,
                error: error.message,
                step: this.currentStep
            };
        }
    }

    async selectCountry(countryData) {
        try {
            if (this.currentStep !== this.steps.COUNTRY_SELECTION) {
                throw new Error('Invalid step for country selection');
            }
            
            // Validate country
            if (!this.supportedCountries.includes(countryData.country)) {
                throw new Error('Selected country is not supported');
            }
            
            this.userData.country = countryData.country;
            this.userData.currency = this.countryCurrencies[countryData.country];
            this.currentStep = this.steps.PERSONAL_DETAILS;
            
            // Load country-specific settings
            await this.loadCountrySettings(countryData.country);
            
            return {
                success: true,
                step: this.currentStep,
                country: this.userData.country,
                currency: this.userData.currency,
                nextStep: this.steps.PERSONAL_DETAILS,
                message: `Country selected: ${countryData.country}`
            };
            
        } catch (error) {
            return {
                success: false,
                error: error.message,
                step: this.currentStep
            };
        }
    }

    async submitPersonalDetails(personalData) {
        try {
            if (this.currentStep !== this.steps.PERSONAL_DETAILS) {
                throw new Error('Invalid step for personal details');
            }
            
            // Validate required fields based on role
            const validation = await this.validatePersonalDetails(personalData);
            if (!validation.valid) {
                throw new Error(validation.message);
            }
            
            this.userData.personalDetails = {
                ...personalData,
                registrationDate: new Date().toISOString(),
                country: this.userData.country
            };
            
            this.currentStep = this.steps.GROUP_SELECTION;
            
            // Get available groups for this country
            const availableGroups = await this.getAvailableGroups();
            
            return {
                success: true,
                step: this.currentStep,
                nextStep: this.steps.GROUP_SELECTION,
                availableGroups: availableGroups,
                message: 'Personal details submitted successfully'
            };
            
        } catch (error) {
            return {
                success: false,
                error: error.message,
                step: this.currentStep
            };
        }
    }

    async selectGroup(groupData) {
        try {
            if (this.currentStep !== this.steps.GROUP_SELECTION) {
                throw new Error('Invalid step for group selection');
            }
            
            // Validate group selection
            const groupValidation = await this.validateGroupSelection(groupData);
            if (!groupValidation.valid) {
                throw new Error(groupValidation.message);
            }
            
            this.userData.group = groupData.groupId;
            this.userData.groupType = groupData.groupType;
            this.userData.groupName = groupData.groupName;
            
            // For lenders, move to subscription selection
            if (this.userData.role === 'LENDER' || this.userData.role === 'DUAL') {
                this.currentStep = this.steps.SUBSCRIPTION_SELECTION;
                const subscriptionOptions = this.getSubscriptionOptions();
                
                return {
                    success: true,
                    step: this.currentStep,
                    nextStep: this.steps.SUBSCRIPTION_SELECTION,
                    subscriptionOptions: subscriptionOptions,
                    message: 'Group selected. Please choose subscription plan.'
                };
            } else {
                // For borrowers only, move to verification
                this.currentStep = this.steps.VERIFICATION;
                
                return {
                    success: true,
                    step: this.currentStep,
                    nextStep: this.steps.VERIFICATION,
                    message: 'Group selected. Proceed to verification.'
                };
            }
            
        } catch (error) {
            return {
                success: false,
                error: error.message,
                step: this.currentStep
            };
        }
    }

    async selectSubscription(subscriptionData) {
        try {
            if (this.currentStep !== this.steps.SUBSCRIPTION_SELECTION) {
                throw new Error('Invalid step for subscription selection');
            }
            
            // Validate subscription selection
            const validation = this.validateSubscription(subscriptionData);
            if (!validation.valid) {
                throw new Error(validation.message);
            }
            
            this.userData.subscription = {
                ...subscriptionData,
                startDate: new Date().toISOString(),
                expiryDate: this.calculateExpiryDate(subscriptionData.duration),
                status: 'PENDING_PAYMENT'
            };
            
            this.currentStep = this.steps.VERIFICATION;
            
            return {
                success: true,
                step: this.currentStep,
                subscription: this.userData.subscription,
                nextStep: this.steps.VERIFICATION,
                paymentRequired: true,
                message: 'Subscription selected. Proceed to verification and payment.'
            };
            
        } catch (error) {
            return {
                success: false,
                error: error.message,
                step: this.currentStep
            };
        }
    }

    async completeVerification(verificationData) {
        try {
            if (this.currentStep !== this.steps.VERIFICATION) {
                throw new Error('Invalid step for verification');
            }
            
            // Process verification
            const verificationResult = await this.processVerification(verificationData);
            
            if (!verificationResult.success) {
                throw new Error(verificationResult.message);
            }
            
            this.userData.verification = {
                ...verificationData,
                verified: true,
                verificationDate: new Date().toISOString(),
                method: verificationData.method || 'EMAIL'
            };
            
            this.currentStep = this.steps.PREFERENCES;
            
            return {
                success: true,
                step: this.currentStep,
                nextStep: this.steps.PREFERENCES,
                message: 'Verification completed successfully'
            };
            
        } catch (error) {
            return {
                success: false,
                error: error.message,
                step: this.currentStep
            };
        }
    }

    async setPreferences(preferencesData) {
        try {
            if (this.currentStep !== this.steps.PREFERENCES) {
                throw new Error('Invalid step for preferences');
            }
            
            this.userData.preferences = {
                ...preferencesData,
                notificationSettings: preferencesData.notificationSettings || {
                    email: true,
                    sms: true,
                    push: true
                },
                language: preferencesData.language || 'en',
                currencyDisplay: this.userData.currency,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
            };
            
            this.currentStep = this.steps.COMPLETED;
            
            // Complete onboarding
            const completionResult = await this.completeOnboarding();
            
            return {
                success: true,
                step: this.currentStep,
                userProfile: this.getUserProfile(),
                dashboardUrl: this.getDashboardUrl(),
                message: 'Onboarding completed successfully'
            };
            
        } catch (error) {
            return {
                success: false,
                error: error.message,
                step: this.currentStep
            };
        }
    }

    // HELPER METHODS
    async checkExistingSession() {
        const userSession = localStorage.getItem('mpesewa_user_session');
        return !!userSession;
    }

    async validatePersonalDetails(personalData) {
        const requiredFields = ['fullName', 'phoneNumber', 'nationalId', 'email'];
        
        // Check required fields
        for (const field of requiredFields) {
            if (!personalData[field]) {
                return {
                    valid: false,
                    message: `${field} is required`
                };
            }
        }
        
        // Validate phone number format
        if (!this.validatePhoneNumber(personalData.phoneNumber, this.userData.country)) {
            return {
                valid: false,
                message: 'Invalid phone number format for selected country'
            };
        }
        
        // Validate email
        if (!this.validateEmail(personalData.email)) {
            return {
                valid: false,
                message: 'Invalid email format'
            };
        }
        
        // Check if user already exists
        if (await this.checkUserExists(personalData.phoneNumber, personalData.email)) {
            return {
                valid: false,
                message: 'User with this phone number or email already exists'
            };
        }
        
        // For lenders, additional validation
        if (this.userData.role === 'LENDER' || this.userData.role === 'DUAL') {
            if (!personalData.brandName) {
                return {
                    valid: false,
                    message: 'Brand name or nickname is required for lenders'
                };
            }
        }
        
        // Referrer/Guarantor validation (Trust-First Model)
        if (!personalData.referrer1 || !personalData.referrer2) {
            return {
                valid: false,
                message: 'Two referrers/guarantors are required for trust verification'
            };
        }
        
        return {
            valid: true,
            message: 'Personal details validated successfully'
        };
    }

    validatePhoneNumber(phoneNumber, country) {
        // Simplified validation - in production, use proper country-specific regex
        const countryPrefixes = {
            'Kenya': /^\+254\d{9}$/,
            'Uganda': /^\+256\d{9}$/,
            'Tanzania': /^\+255\d{9}$/,
            'Rwanda': /^\+250\d{9}$/,
            'Nigeria': /^\+234\d{10}$/,
            'Ghana': /^\+233\d{9}$/,
            'South Africa': /^\+27\d{9}$/,
            'Ethiopia': /^\+251\d{9}$/
        };
        
        const regex = countryPrefixes[country];
        return regex ? regex.test(phoneNumber) : true;
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    async checkUserExists(phoneNumber, email) {
        // Check localStorage for existing users
        const existingUsers = JSON.parse(localStorage.getItem('mpesewa_users') || '[]');
        
        return existingUsers.some(user => 
            user.phoneNumber === phoneNumber || 
            user.email === email
        );
    }

    async loadCountrySettings(country) {
        // Load country-specific rules and settings
        const countrySettings = JSON.parse(localStorage.getItem(`mpesewa_country_${country}`) || '{}');
        
        if (!countrySettings.loaded) {
            // Default country settings
            const defaultSettings = {
                country: country,
                currency: this.countryCurrencies[country],
                minLoanAmount: 50,
                maxLoanAmount: 50000,
                interestRate: 0.10,
                repaymentPeriod: 7,
                supportedPaymentMethods: ['M-PESA', 'BANK_TRANSFER', 'CASH'],
                contactInfo: this.getCountryContactInfo(country),
                legalRules: this.getCountryLegalRules(country),
                loaded: true
            };
            
            localStorage.setItem(`mpesewa_country_${country}`, JSON.stringify(defaultSettings));
        }
    }

    getCountryContactInfo(country) {
        const contactInfo = {
            'Kenya': '+254 709 219 000 | info@M-pesewa',
            'Uganda': '+256 392 175 546 | info@M-pesewa',
            'Tanzania': '+255 659 073 010 | info@M-pesewa',
            'Rwanda': '+250 791 590 801 | info@M-pesewa',
            'Burundi': '+257 79 000 000 | info@M-pesewa',
            'DRC': '+243 81 000 0000 | info@M-pesewa',
            'South Sudan': '+27 11 200 0000 | info@M-pesewa',
            'South Africa': '+27 11 000 0000 | info@M-pesewa',
            'Nigeria': '+234 800 000 0000 | info@M-pesewa',
            'Ghana': '+233 24 000 0000 | info@M-pesewa',
            'Ethiopia': '+251 11 000 0000 | info@M-pesewa'
        };
        
        return contactInfo[country] || 'Support: info@mpesewa.com';
    }

    getCountryLegalRules(country) {
        // Return country-specific legal rules
        return {
            disclaimer: `All lending and borrowing activities in ${country} are subject to local financial regulations.`,
            minimumAge: 18,
            kycRequired: true,
            dataProtection: 'GDPR compliant where applicable'
        };
    }

    async getAvailableGroups() {
        const country = this.userData.country;
        const groups = JSON.parse(localStorage.getItem(`mpesewa_groups_${country}`) || '[]');
        
        // Filter groups by availability and capacity
        return groups.filter(group => 
            group.country === country && 
            group.status === 'ACTIVE' &&
            group.memberCount < 1000 // Max group size
        ).map(group => ({
            id: group.id,
            name: group.name,
            type: group.type,
            memberCount: group.memberCount,
            lenderCount: group.lenderCount,
            borrowerCount: group.borrowerCount,
            successRate: group.successRate || '95%',
            description: group.description,
            requiresInvitation: group.requiresInvitation || false
        }));
    }

    async validateGroupSelection(groupData) {
        const groups = await this.getAvailableGroups();
        const selectedGroup = groups.find(g => g.id === groupData.groupId);
        
        if (!selectedGroup) {
            return {
                valid: false,
                message: 'Selected group does not exist or is not available'
            };
        }
        
        // Check if group requires invitation
        if (selectedGroup.requiresInvitation && !groupData.invitationCode) {
            return {
                valid: false,
                message: 'This group requires an invitation code'
            };
        }
        
        // Validate invitation code if provided
        if (groupData.invitationCode) {
            const invitationValid = await this.validateInvitationCode(
                groupData.groupId, 
                groupData.invitationCode
            );
            
            if (!invitationValid) {
                return {
                    valid: false,
                    message: 'Invalid invitation code'
                };
            }
        }
        
        // Check group capacity
        if (selectedGroup.memberCount >= 1000) {
            return {
                valid: false,
                message: 'Group has reached maximum capacity (1000 members)'
            };
        }
        
        // For borrowers: Check if they're already in 4 groups
        if (this.userData.role === 'BORROWER') {
            const userGroups = await this.getUserGroups(this.userData.personalDetails.phoneNumber);
            if (userGroups.length >= 4) {
                return {
                    valid: false,
                    message: 'Borrowers can join maximum 4 groups'
                };
            }
        }
        
        return {
            valid: true,
            message: 'Group selection validated successfully'
        };
    }

    async validateInvitationCode(groupId, invitationCode) {
        // In production, validate against backend
        const invitations = JSON.parse(localStorage.getItem('mpesewa_invitations') || '[]');
        
        return invitations.some(invitation => 
            invitation.groupId === groupId && 
            invitation.code === invitationCode &&
            invitation.expiry > new Date().toISOString() &&
            !invitation.used
        );
    }

    async getUserGroups(phoneNumber) {
        // Get groups user is already member of
        const userMemberships = JSON.parse(localStorage.getItem('mpesewa_user_groups') || '[]');
        return userMemberships.filter(membership => membership.phoneNumber === phoneNumber);
    }

    getSubscriptionOptions() {
        const currency = this.userData.currency;
        
        return {
            tiers: [
                {
                    id: 'BASIC',
                    name: 'Basic',
                    weeklyLimit: 1500,
                    features: [
                        'Max: 1,500 per week',
                        'No CRB check required',
                        'Basic ledger management',
                        'Email support'
                    ],
                    pricing: {
                        monthly: 50,
                        biAnnual: 250,
                        annual: 500
                    },
                    recommendedFor: 'New lenders starting small'
                },
                {
                    id: 'PREMIUM',
                    name: 'Premium',
                    weeklyLimit: 5000,
                    features: [
                        'Max: 5,000 per week',
                        'No CRB check required',
                        'Advanced ledger management',
                        'Priority support',
                        'Group analytics'
                    ],
                    pricing: {
                        monthly: 250,
                        biAnnual: 1500,
                        annual: 2500
                    },
                    recommendedFor: 'Active lenders growing portfolio'
                },
                {
                    id: 'SUPER',
                    name: 'Super',
                    weeklyLimit: 20000,
                    features: [
                        'Max: 20,000 per week',
                        'CRB check required',
                        'Premium ledger management',
                        '24/7 support',
                        'Advanced analytics',
                        'Debt collector access'
                    ],
                    pricing: {
                        monthly: 1000,
                        biAnnual: 5000,
                        annual: 8500
                    },
                    recommendedFor: 'Professional lenders'
                },
                {
                    id: 'LENDER_OF_LENDERS',
                    name: 'Lender of Lenders',
                    weeklyLimit: 50000,
                    features: [
                        'Max: 50,000 per week',
                        'CRB check required',
                        'Custom interest rates',
                        'Minimum 1 month repayment',
                        'Dedicated account manager',
                        'Full platform access'
                    ],
                    pricing: {
                        monthly: 500,
                        biAnnual: 3500,
                        annual: 6500
                    },
                    recommendedFor: 'Institutional lenders'
                }
            ],
            currency: currency,
            expiryNote: 'All subscriptions expire on the 28th of each month',
            autoRenewal: false
        };
    }

    validateSubscription(subscriptionData) {
        const validTiers = ['BASIC', 'PREMIUM', 'SUPER', 'LENDER_OF_LENDERS'];
        const validDurations = ['MONTHLY', 'BI_ANNUAL', 'ANNUAL'];
        
        if (!validTiers.includes(subscriptionData.tier)) {
            return {
                valid: false,
                message: 'Invalid subscription tier'
            };
        }
        
        if (!validDurations.includes(subscriptionData.duration)) {
            return {
                valid: false,
                message: 'Invalid subscription duration'
            };
        }
        
        return {
            valid: true,
            message: 'Subscription validated successfully'
        };
    }

    calculateExpiryDate(duration) {
        const today = new Date();
        let expiryDate = new Date();
        
        switch (duration) {
            case 'MONTHLY':
                // Expires on 28th of next month
                expiryDate.setMonth(today.getMonth() + 1);
                expiryDate.setDate(28);
                break;
            case 'BI_ANNUAL':
                expiryDate.setMonth(today.getMonth() + 6);
                expiryDate.setDate(28);
                break;
            case 'ANNUAL':
                expiryDate.setFullYear(today.getFullYear() + 1);
                expiryDate.setDate(28);
                break;
            default:
                expiryDate.setMonth(today.getMonth() + 1);
                expiryDate.setDate(28);
        }
        
        return expiryDate.toISOString();
    }

    async processVerification(verificationData) {
        // Simulate verification process
        // In production, this would integrate with email/SMS verification services
        
        if (verificationData.method === 'EMAIL') {
            // Send verification email
            await this.sendVerificationEmail(verificationData.email);
            
            return {
                success: true,
                message: 'Verification email sent. Please check your inbox.'
            };
        } else if (verificationData.method === 'SMS') {
            // Send verification SMS
            await this.sendVerificationSMS(verificationData.phoneNumber);
            
            return {
                success: true,
                message: 'Verification SMS sent. Please check your phone.'
            };
        } else if (verificationData.verificationCode) {
            // Verify code
            const isValid = await this.verifyCode(verificationData.verificationCode);
            
            if (isValid) {
                return {
                    success: true,
                    message: 'Verification successful'
                };
            } else {
                return {
                    success: false,
                    message: 'Invalid verification code'
                };
            }
        }
        
        return {
            success: false,
            message: 'Invalid verification method'
        };
    }

    async sendVerificationEmail(email) {
        // Simulate email sending
        console.log(`Sending verification email to: ${email}`);
        // In production: Integrate with email service
        
        // Store verification token
        const token = Math.random().toString(36).substr(2, 10).toUpperCase();
        const verificationTokens = JSON.parse(localStorage.getItem('mpesewa_verification_tokens') || '[]');
        
        verificationTokens.push({
            email: email,
            token: token,
            expiry: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
            createdAt: new Date().toISOString()
        });
        
        localStorage.setItem('mpesewa_verification_tokens', JSON.stringify(verificationTokens));
        
        return true;
    }

    async sendVerificationSMS(phoneNumber) {
        // Simulate SMS sending
        console.log(`Sending verification SMS to: ${phoneNumber}`);
        // In production: Integrate with SMS service
        
        // Store verification token
        const token = Math.floor(100000 + Math.random() * 900000).toString();
        const verificationTokens = JSON.parse(localStorage.getItem('mpesewa_verification_tokens') || '[]');
        
        verificationTokens.push({
            phoneNumber: phoneNumber,
            token: token,
            expiry: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(), // 1 hour
            createdAt: new Date().toISOString()
        });
        
        localStorage.setItem('mpesewa_verification_tokens', JSON.stringify(verificationTokens));
        
        return true;
    }

    async verifyCode(code) {
        const verificationTokens = JSON.parse(localStorage.getItem('mpesewa_verification_tokens') || '[]');
        const now = new Date();
        
        const validToken = verificationTokens.find(token => 
            token.token === code && 
            new Date(token.expiry) > now
        );
        
        return !!validToken;
    }

    async completeOnboarding() {
        try {
            // Create user profile
            const userProfile = this.createUserProfile();
            
            // Store user data
            await this.storeUserData(userProfile);
            
            // Create session
            await this.createUserSession(userProfile);
            
            // Initialize user state based on role
            await this.initializeUserState(userProfile);
            
            // Record onboarding completion
            await this.recordOnboardingCompletion(userProfile);
            
            // Send welcome notification
            await this.sendWelcomeNotification(userProfile);
            
            return {
                success: true,
                userId: userProfile.userId,
                role: userProfile.role,
                dashboardUrl: this.getDashboardUrl(),
                nextSteps: this.getNextSteps(userProfile.role)
            };
            
        } catch (error) {
            throw new Error(`Onboarding completion failed: ${error.message}`);
        }
    }

    createUserProfile() {
        const userId = 'USER-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6).toUpperCase();
        
        return {
            userId: userId,
            ...this.userData.personalDetails,
            role: this.userData.role,
            country: this.userData.country,
            currency: this.userData.currency,
            groupId: this.userData.group,
            groupName: this.userData.groupName,
            subscription: this.userData.subscription,
            verification: this.userData.verification,
            preferences: this.userData.preferences,
            createdAt: new Date().toISOString(),
            status: 'ACTIVE',
            rating: 5, // Initial rating
            blacklisted: false
        };
    }

    async storeUserData(userProfile) {
        // Store in users list
        const users = JSON.parse(localStorage.getItem('mpesewa_users') || '[]');
        users.push(userProfile);
        localStorage.setItem('mpesewa_users', JSON.stringify(users));
        
        // Store role-specific data
        if (userProfile.role === 'LENDER' || userProfile.role === 'DUAL') {
            const lenders = JSON.parse(localStorage.getItem('mpesewa_lenders') || '[]');
            lenders.push({
                userId: userProfile.userId,
                ...userProfile,
                subscriptionStatus: 'PENDING_PAYMENT',
                totalLent: 0,
                activeLedgers: 0,
                weeklyLimit: this.getWeeklyLimit(userProfile.subscription?.tier)
            });
            localStorage.setItem('mpesewa_lenders', JSON.stringify(lenders));
        }
        
        if (userProfile.role === 'BORROWER' || userProfile.role === 'DUAL') {
            const borrowers = JSON.parse(localStorage.getItem('mpesewa_borrowers') || '[]');
            borrowers.push({
                userId: userProfile.userId,
                ...userProfile,
                totalBorrowed: 0,
                activeLoans: 0,
                repaymentRate: '100%',
                groups: [userProfile.groupId]
            });
            localStorage.setItem('mpesewa_borrowers', JSON.stringify(borrowers));
        }
        
        // Update group membership
        await this.updateGroupMembership(userProfile);
    }

    async updateGroupMembership(userProfile) {
        const country = userProfile.country;
        const groups = JSON.parse(localStorage.getItem(`mpesewa_groups_${country}`) || '[]');
        const groupIndex = groups.findIndex(g => g.id === userProfile.groupId);
        
        if (groupIndex !== -1) {
            // Update member count
            groups[groupIndex].memberCount = (groups[groupIndex].memberCount || 0) + 1;
            
            // Update role-specific counts
            if (userProfile.role === 'LENDER' || userProfile.role === 'DUAL') {
                groups[groupIndex].lenderCount = (groups[groupIndex].lenderCount || 0) + 1;
            }
            
            if (userProfile.role === 'BORROWER' || userProfile.role === 'DUAL') {
                groups[groupIndex].borrowerCount = (groups[groupIndex].borrowerCount || 0) + 1;
            }
            
            localStorage.setItem(`mpesewa_groups_${country}`, JSON.stringify(groups));
        }
        
        // Record user-group relationship
        const userGroups = JSON.parse(localStorage.getItem('mpesewa_user_groups') || '[]');
        userGroups.push({
            userId: userProfile.userId,
            groupId: userProfile.groupId,
            role: userProfile.role,
            joinedDate: new Date().toISOString(),
            status: 'ACTIVE'
        });
        
        localStorage.setItem('mpesewa_user_groups', JSON.stringify(userGroups));
    }

    getWeeklyLimit(tier) {
        const limits = {
            'BASIC': 1500,
            'PREMIUM': 5000,
            'SUPER': 20000,
            'LENDER_OF_LENDERS': 50000
        };
        
        return limits[tier] || 0;
    }

    async createUserSession(userProfile) {
        const sessionId = 'SESS-' + Date.now();
        const sessionData = {
            sessionId: sessionId,
            userId: userProfile.userId,
            role: userProfile.role,
            country: userProfile.country,
            groupId: userProfile.groupId,
            createdAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
        };
        
        localStorage.setItem('mpesewa_user_session', JSON.stringify(sessionData));
        localStorage.setItem('mpesewa_current_user', JSON.stringify(userProfile));
        
        // Set country context
        localStorage.setItem('mpesewa_country', userProfile.country);
        localStorage.setItem('mpesewa_group', userProfile.groupId);
    }

    async initializeUserState(userProfile) {
        // Initialize user-specific state in global state management
        const userState = {
            userId: userProfile.userId,
            role: userProfile.role,
            country: userProfile.country,
            groupId: userProfile.groupId,
            subscription: userProfile.subscription,
            preferences: userProfile.preferences,
            lastActive: new Date().toISOString()
        };
        
        localStorage.setItem('mpesewa_user_state', JSON.stringify(userState));
    }

    async recordOnboardingCompletion(userProfile) {
        const completions = JSON.parse(localStorage.getItem('mpesewa_onboarding_completions') || '[]');
        
        completions.push({
            userId: userProfile.userId,
            role: userProfile.role,
            country: userProfile.country,
            completedAt: new Date().toISOString(),
            stepsCompleted: Object.keys(this.steps).length - 1 // Excluding INITIAL
        });
        
        localStorage.setItem('mpesewa_onboarding_completions', JSON.stringify(completions));
    }

    async sendWelcomeNotification(userProfile) {
        // Send welcome notification based on preferences
        const notification = {
            userId: userProfile.userId,
            type: 'WELCOME',
            title: 'Welcome to M-Pesewa!',
            message: `Welcome ${userProfile.fullName}! Your ${userProfile.role.toLowerCase()} account has been created successfully.`,
            priority: 'HIGH',
            createdAt: new Date().toISOString()
        };
        
        const notifications = JSON.parse(localStorage.getItem('mpesewa_notifications') || '[]');
        notifications.push(notification);
        localStorage.setItem('mpesewa_notifications', JSON.stringify(notifications));
        
        // Also send email if enabled
        if (userProfile.preferences?.notificationSettings?.email) {
            console.log(`Sending welcome email to: ${userProfile.email}`);
        }
    }

    getDashboardUrl() {
        const role = this.userData.role;
        
        switch (role) {
            case 'BORROWER':
                return '/borrower/dashboard.html';
            case 'LENDER':
                return '/lender/dashboard.html';
            case 'DUAL':
                return '/dashboard.html'; // Dual-role dashboard
            default:
                return '/dashboard.html';
        }
    }

    getNextSteps(role) {
        const commonSteps = [
            'Complete your profile',
            'Verify your identity',
            'Set up payment preferences'
        ];
        
        const roleSpecificSteps = {
            'BORROWER': [
                'Join additional groups (up to 4)',
                'Build your reputation rating',
                'Request your first emergency loan'
            ],
            'LENDER': [
                'Activate your subscription',
                'Set your lending preferences',
                'Start browsing loan requests'
            ],
            'DUAL': [
                'Activate lending subscription',
                'Join additional groups',
                'Start using both features'
            ]
        };
        
        return {
            common: commonSteps,
            roleSpecific: roleSpecificSteps[role] || []
        };
    }

    getPublicUserData() {
        return {
            role: this.userData.role,
            country: this.userData.country,
            currency: this.userData.currency,
            currentStep: this.currentStep,
            progress: this.getProgressPercentage()
        };
    }

    getUserProfile() {
        return {
            userId: this.userData.personalDetails.userId,
            fullName: this.userData.personalDetails.fullName,
            role: this.userData.role,
            country: this.userData.country,
            group: this.userData.groupName,
            subscription: this.userData.subscription?.tier || 'N/A',
            verification: this.userData.verification.verified ? 'VERIFIED' : 'PENDING',
            joinedDate: new Date().toISOString().split('T')[0]
        };
    }

    getProgressPercentage() {
        const totalSteps = Object.keys(this.steps).length - 1; // Excluding INITIAL
        const completedSteps = Object.keys(this.steps).indexOf(this.currentStep);
        return Math.round((completedSteps / totalSteps) * 100);
    }

    // Public API methods
    getCurrentStep() {
        return {
            step: this.currentStep,
            progress: this.getProgressPercentage(),
            userData: this.getPublicUserData()
        };
    }

    resetOnboarding() {
        this.currentStep = 'INITIAL';
        this.userData = {
            role: null,
            country: null,
            group: null,
            personalDetails: {},
            subscription: null,
            verification: {},
            preferences: {}
        };
        
        return {
            success: true,
            message: 'Onboarding reset successfully'
        };
    }

    skipToStep(step) {
        if (Object.values(this.steps).includes(step)) {
            this.currentStep = step;
            return {
                success: true,
                step: this.currentStep,
                message: `Skipped to step: ${step}`
            };
        }
        
        return {
            success: false,
            error: 'Invalid step specified'
        };
    }
}

// Export singleton instance
const onboardingFlow = new OnboardingFlow();
export default onboardingFlow;