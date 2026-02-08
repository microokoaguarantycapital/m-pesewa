/**
 * M-Pesewa Subscription Flow Orchestrator
 * Subscription activation, renewal, expiry handling
 * Enforces subscription-based access rules for lenders
 */

class SubscriptionFlow {
    constructor() {
        this.currentState = 'IDLE';
        this.states = {
            IDLE: 'IDLE',
            SELECTING: 'SELECTING',
            PAYMENT_PENDING: 'PAYMENT_PENDING',
            PROCESSING: 'PROCESSING',
            ACTIVATING: 'ACTIVATING',
            ACTIVE: 'ACTIVE',
            EXPIRING_SOON: 'EXPIRING_SOON',
            EXPIRED: 'EXPIRED',
            SUSPENDED: 'SUSPENDED',
            UPGRADING: 'UPGRADING',
            DOWNGRADING: 'DOWNGRADING',
            RENEWING: 'RENEWING',
            CANCELLED: 'CANCELLED'
        };
        
        this.subscriptionData = null;
        this.userData = null;
        this.paymentData = null;
        
        // Subscription tiers with limits
        this.tiers = {
            BASIC: {
                id: 'BASIC',
                name: 'Basic',
                weeklyLimit: 1500,
                monthlyPrice: 50,
                biAnnualPrice: 250,
                annualPrice: 500,
                features: [
                    'Maximum: 1,500 per week',
                    'No CRB check required',
                    'Basic ledger management',
                    'Email support',
                    '1 group access'
                ],
                color: '#4CAF50'
            },
            PREMIUM: {
                id: 'PREMIUM',
                name: 'Premium',
                weeklyLimit: 5000,
                monthlyPrice: 250,
                biAnnualPrice: 1500,
                annualPrice: 2500,
                features: [
                    'Maximum: 5,000 per week',
                    'No CRB check required',
                    'Advanced ledger management',
                    'Priority support',
                    'Group analytics',
                    'Up to 3 groups'
                ],
                color: '#2196F3'
            },
            SUPER: {
                id: 'SUPER',
                name: 'Super',
                weeklyLimit: 20000,
                monthlyPrice: 1000,
                biAnnualPrice: 5000,
                annualPrice: 8500,
                features: [
                    'Maximum: 20,000 per week',
                    'CRB check required',
                    'Premium ledger management',
                    '24/7 support',
                    'Advanced analytics',
                    'Debt collector access',
                    'Unlimited groups'
                ],
                color: '#9C27B0'
            },
            LENDER_OF_LENDERS: {
                id: 'LENDER_OF_LENDERS',
                name: 'Lender of Lenders',
                weeklyLimit: 50000,
                monthlyPrice: 500,
                biAnnualPrice: 3500,
                annualPrice: 6500,
                features: [
                    'Maximum: 50,000 per week',
                    'CRB check required',
                    'Custom interest rates',
                    'Minimum 1 month repayment',
                    'Dedicated account manager',
                    'Full platform access',
                    'Priority listing'
                ],
                color: '#FF9800'
            }
        };
    }

    // MAIN SUBSCRIPTION FLOW METHODS

    async startSubscriptionSelection(userId) {
        try {
            this.currentState = this.states.SELECTING;
            
            // Load user data
            this.userData = await this.getUserData(userId);
            
            if (!this.userData) {
                throw new Error('User not found');
            }
            
            // Check if user is already subscribed
            const currentSubscription = await this.getCurrentSubscription(userId);
            
            if (currentSubscription && currentSubscription.status === 'ACTIVE') {
                return {
                    success: false,
                    state: this.currentState,
                    message: 'User already has active subscription',
                    currentSubscription: currentSubscription,
                    action: 'UPGRADE_OR_RENEW'
                };
            }
            
            // Get available subscription options
            const options = this.getSubscriptionOptions(this.userData.country);
            
            return {
                success: true,
                state: this.currentState,
                userData: this.userData,
                subscriptionOptions: options,
                currentSubscription: currentSubscription,
                message: 'Subscription selection started'
            };
            
        } catch (error) {
            this.currentState = this.states.IDLE;
            return {
                success: false,
                error: error.message,
                state: this.currentState
            };
        }
    }

    async selectSubscription(selectionData) {
        try {
            if (this.currentState !== this.states.SELECTING) {
                throw new Error('Invalid state for subscription selection');
            }
            
            // Validate selection
            const validation = this.validateSubscriptionSelection(selectionData);
            if (!validation.valid) {
                throw new Error(validation.message);
            }
            
            // Create subscription object
            this.subscriptionData = this.createSubscriptionObject(selectionData);
            
            // For SUPER and LENDER_OF_LENDERS tiers, check CRB requirement
            if (['SUPER', 'LENDER_OF_LENDERS'].includes(selectionData.tier)) {
                const crbCheck = await this.performCRBCheck(this.userData);
                if (!crbCheck.passed) {
                    return {
                        success: false,
                        state: this.currentState,
                        requiresCRB: true,
                        crbCheck: crbCheck,
                        message: 'CRB check required for selected tier'
                    };
                }
            }
            
            this.currentState = this.states.PAYMENT_PENDING;
            
            // Generate payment details
            const paymentDetails = this.generatePaymentDetails(this.subscriptionData);
            
            return {
                success: true,
                state: this.currentState,
                subscription: this.subscriptionData,
                paymentDetails: paymentDetails,
                nextStep: 'PROCESS_PAYMENT',
                message: 'Subscription selected. Proceed to payment.'
            };
            
        } catch (error) {
            this.currentState = this.states.IDLE;
            return {
                success: false,
                error: error.message,
                state: this.currentState
            };
        }
    }

    async processPayment(paymentData) {
        try {
            if (this.currentState !== this.states.PAYMENT_PENDING) {
                throw new Error('Invalid state for payment processing');
            }
            
            this.paymentData = paymentData;
            this.currentState = this.states.PROCESSING;
            
            // Validate payment data
            const paymentValidation = this.validatePaymentData(paymentData);
            if (!paymentValidation.valid) {
                throw new Error(paymentValidation.message);
            }
            
            // Process payment (simulated - in production, integrate with payment gateway)
            const paymentResult = await this.processPaymentTransaction(paymentData);
            
            if (!paymentResult.success) {
                throw new Error(`Payment failed: ${paymentResult.message}`);
            }
            
            // Record payment
            await this.recordPaymentTransaction(paymentResult);
            
            this.currentState = this.states.ACTIVATING;
            
            return {
                success: true,
                state: this.currentState,
                paymentReference: paymentResult.reference,
                amount: paymentResult.amount,
                currency: this.userData.currency,
                message: 'Payment processed successfully. Activating subscription...'
            };
            
        } catch (error) {
            this.currentState = this.states.PAYMENT_PENDING;
            return {
                success: false,
                error: error.message,
                state: this.currentState
            };
        }
    }

    async activateSubscription() {
        try {
            if (this.currentState !== this.states.ACTIVATING) {
                throw new Error('Invalid state for activation');
            }
            
            // Activate subscription
            const activationResult = await this.activateUserSubscription();
            
            if (!activationResult.success) {
                throw new Error(`Activation failed: ${activationResult.message}`);
            }
            
            // Update user status
            await this.updateUserSubscriptionStatus();
            
            // Grant platform access
            await this.grantPlatformAccess();
            
            // Schedule expiry check
            await this.scheduleExpiryCheck();
            
            this.currentState = this.states.ACTIVE;
            
            // Send activation notification
            await this.sendActivationNotification();
            
            return {
                success: true,
                state: this.currentState,
                subscription: this.subscriptionData,
                activationDate: new Date().toISOString(),
                expiryDate: this.subscriptionData.expiryDate,
                accessGranted: true,
                message: 'Subscription activated successfully. You can now start lending.'
            };
            
        } catch (error) {
            this.currentState = this.states.ACTIVATING;
            return {
                success: false,
                error: error.message,
                state: this.currentState
            };
        }
    }

    async checkSubscriptionStatus(userId) {
        try {
            this.currentState = this.states.IDLE;
            
            const subscription = await this.getCurrentSubscription(userId);
            
            if (!subscription) {
                return {
                    hasSubscription: false,
                    state: 'NO_SUBSCRIPTION',
                    message: 'No active subscription found'
                };
            }
            
            const status = subscription.status;
            const now = new Date();
            const expiryDate = new Date(subscription.expiryDate);
            const daysUntilExpiry = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
            
            let state = status;
            let message = '';
            
            if (status === 'ACTIVE') {
                if (daysUntilExpiry <= 7) {
                    state = this.states.EXPIRING_SOON;
                    message = `Subscription expires in ${daysUntilExpiry} days. Please renew.`;
                } else {
                    message = `Subscription active. Expires on ${expiryDate.toDateString()}`;
                }
            } else if (status === 'EXPIRED') {
                state = this.states.EXPIRED;
                message = 'Subscription expired. Please renew to continue lending.';
            } else if (status === 'SUSPENDED') {
                state = this.states.SUSPENDED;
                message = 'Subscription suspended. Contact support.';
            }
            
            return {
                hasSubscription: true,
                state: state,
                subscription: subscription,
                daysUntilExpiry: daysUntilExpiry > 0 ? daysUntilExpiry : 0,
                canLend: this.canUserLend(subscription),
                lendingLimit: this.getCurrentLendingLimit(subscription),
                message: message
            };
            
        } catch (error) {
            return {
                error: error.message,
                state: 'ERROR'
            };
        }
    }

    async upgradeSubscription(upgradeData) {
        try {
            this.currentState = this.states.UPGRADING;
            
            // Get current subscription
            const current = await this.getCurrentSubscription(this.userData.userId);
            
            if (!current || current.status !== 'ACTIVE') {
                throw new Error('No active subscription to upgrade');
            }
            
            // Validate upgrade path
            const upgradeValidation = this.validateUpgradePath(current.tier, upgradeData.newTier);
            if (!upgradeValidation.valid) {
                throw new Error(upgradeValidation.message);
            }
            
            // Calculate prorated amount
            const proratedAmount = this.calculateProratedAmount(current, upgradeData);
            
            // Create upgrade subscription object
            const upgradeSubscription = this.createUpgradeSubscription(current, upgradeData, proratedAmount);
            
            this.subscriptionData = upgradeSubscription;
            this.currentState = this.states.PAYMENT_PENDING;
            
            return {
                success: true,
                state: this.currentState,
                upgradeDetails: {
                    fromTier: current.tier,
                    toTier: upgradeData.newTier,
                    proratedAmount: proratedAmount,
                    newLimit: this.tiers[upgradeData.newTier].weeklyLimit,
                    effectiveDate: new Date().toISOString()
                },
                paymentRequired: proratedAmount > 0,
                paymentAmount: proratedAmount,
                message: 'Upgrade ready. Proceed to payment if required.'
            };
            
        } catch (error) {
            this.currentState = this.states.IDLE;
            return {
                success: false,
                error: error.message,
                state: this.currentState
            };
        }
    }

    async renewSubscription(renewalData) {
        try {
            this.currentState = this.states.RENEWING;
            
            const current = await this.getCurrentSubscription(this.userData.userId);
            
            if (!current) {
                throw new Error('No subscription found to renew');
            }
            
            // Create renewal subscription
            const renewalSubscription = this.createRenewalSubscription(current, renewalData);
            
            this.subscriptionData = renewalSubscription;
            this.currentState = this.states.PAYMENT_PENDING;
            
            return {
                success: true,
                state: this.currentState,
                renewalDetails: {
                    tier: renewalSubscription.tier,
                    duration: renewalSubscription.duration,
                    amount: renewalSubscription.amount,
                    newExpiry: renewalSubscription.expiryDate
                },
                paymentRequired: true,
                message: 'Renewal ready. Proceed to payment.'
            };
            
        } catch (error) {
            this.currentState = this.states.IDLE;
            return {
                success: false,
                error: error.message,
                state: this.currentState
            };
        }
    }

    async handleExpiry() {
        try {
            // This method is called by scheduled job or on user login
            const subscriptions = await this.getExpiringSubscriptions();
            
            const results = [];
            
            for (const subscription of subscriptions) {
                const now = new Date();
                const expiryDate = new Date(subscription.expiryDate);
                
                if (now > expiryDate) {
                    // Subscription has expired
                    await this.expireSubscription(subscription.userId);
                    
                    // Block lending access
                    await this.blockLendingAccess(subscription.userId);
                    
                    // Send expiry notification
                    await this.sendExpiryNotification(subscription);
                    
                    results.push({
                        userId: subscription.userId,
                        action: 'EXPIRED',
                        message: 'Subscription expired, lending blocked'
                    });
                    
                } else if ((expiryDate - now) / (1000 * 60 * 60 * 24) <= 7) {
                    // Subscription expiring soon (7 days or less)
                    await this.sendExpiryWarning(subscription);
                    
                    results.push({
                        userId: subscription.userId,
                        action: 'WARNING_SENT',
                        daysUntilExpiry: Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24))
                    });
                }
            }
            
            return {
                success: true,
                processed: results.length,
                results: results
            };
            
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // HELPER METHODS

    async getUserData(userId) {
        const users = JSON.parse(localStorage.getItem('mpesewa_users') || '[]');
        const user = users.find(u => u.userId === userId);
        
        if (!user) {
            // Try lenders data
            const lenders = JSON.parse(localStorage.getItem('mpesewa_lenders') || '[]');
            const lender = lenders.find(l => l.userId === userId);
            
            if (lender) {
                return lender;
            }
        }
        
        return user;
    }

    async getCurrentSubscription(userId) {
        const subscriptions = JSON.parse(localStorage.getItem('mpesewa_subscriptions') || '[]');
        return subscriptions.find(sub => 
            sub.userId === userId && 
            ['ACTIVE', 'EXPIRING_SOON', 'SUSPENDED'].includes(sub.status)
        );
    }

    getSubscriptionOptions(country) {
        const currency = this.getCountryCurrency(country);
        
        return {
            tiers: Object.values(this.tiers).map(tier => ({
                ...tier,
                currency: currency,
                formattedPrices: {
                    monthly: `${currency} ${tier.monthlyPrice}`,
                    biAnnual: `${currency} ${tier.biAnnualPrice}`,
                    annual: `${currency} ${tier.annualPrice}`
                }
            })),
            expiryPolicy: 'All subscriptions expire on the 28th of each month',
            autoRenewal: false,
            paymentMethods: this.getPaymentMethods(country),
            terms: 'Subscription required for lending. Borrowers pay no fees.'
        };
    }

    getCountryCurrency(country) {
        const currencies = {
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
        
        return currencies[country] || 'USD';
    }

    getPaymentMethods(country) {
        const baseMethods = ['M-PESA', 'AIRTEL_MONEY', 'BANK_TRANSFER', 'CREDIT_CARD'];
        
        const countrySpecific = {
            'Kenya': ['M-PESA', 'AIRTEL_MONEY', 'BANK_TRANSFER'],
            'Uganda': ['MTN_MONEY', 'AIRTEL_MONEY', 'BANK_TRANSFER'],
            'Tanzania': ['M-PESA', 'TIGO_PESA', 'AIRTEL_MONEY'],
            'Nigeria': ['BANK_TRANSFER', 'USSD', 'FLUTTERWAVE'],
            'Ghana': ['MTN_MOMO', 'VODAFONE_CASH', 'BANK_TRANSFER'],
            'South Africa': ['BANK_TRANSFER', 'CREDIT_CARD', 'SNAPSCAN']
        };
        
        return countrySpecific[country] || baseMethods;
    }

    validateSubscriptionSelection(selectionData) {
        const validTiers = Object.keys(this.tiers);
        const validDurations = ['MONTHLY', 'BI_ANNUAL', 'ANNUAL'];
        
        if (!validTiers.includes(selectionData.tier)) {
            return {
                valid: false,
                message: 'Invalid subscription tier'
            };
        }
        
        if (!validDurations.includes(selectionData.duration)) {
            return {
                valid: false,
                message: 'Invalid subscription duration'
            };
        }
        
        if (!selectionData.paymentMethod) {
            return {
                valid: false,
                message: 'Payment method is required'
            };
        }
        
        return {
            valid: true,
            message: 'Subscription selection validated'
        };
    }

    createSubscriptionObject(selectionData) {
        const tier = this.tiers[selectionData.tier];
        const price = this.getTierPrice(tier, selectionData.duration);
        const expiryDate = this.calculateSubscriptionExpiry(selectionData.duration);
        
        const subscriptionId = 'SUB-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6).toUpperCase();
        
        return {
            id: subscriptionId,
            userId: this.userData.userId,
            tier: selectionData.tier,
            tierName: tier.name,
            duration: selectionData.duration,
            amount: price,
            currency: this.userData.currency || 'KSh',
            paymentMethod: selectionData.paymentMethod,
            startDate: new Date().toISOString(),
            expiryDate: expiryDate,
            status: 'PENDING_PAYMENT',
            weeklyLimit: tier.weeklyLimit,
            features: tier.features,
            createdAt: new Date().toISOString()
        };
    }

    getTierPrice(tier, duration) {
        switch (duration) {
            case 'MONTHLY':
                return tier.monthlyPrice;
            case 'BI_ANNUAL':
                return tier.biAnnualPrice;
            case 'ANNUAL':
                return tier.annualPrice;
            default:
                return tier.monthlyPrice;
        }
    }

    calculateSubscriptionExpiry(duration) {
        const today = new Date();
        let expiryDate = new Date();
        
        // All subscriptions expire on 28th of the month
        switch (duration) {
            case 'MONTHLY':
                // Next month's 28th
                expiryDate.setMonth(today.getMonth() + 1);
                expiryDate.setDate(28);
                break;
            case 'BI_ANNUAL':
                // 6 months from now, 28th
                expiryDate.setMonth(today.getMonth() + 6);
                expiryDate.setDate(28);
                break;
            case 'ANNUAL':
                // 1 year from now, 28th
                expiryDate.setFullYear(today.getFullYear() + 1);
                expiryDate.setDate(28);
                break;
            default:
                // Default to next month's 28th
                expiryDate.setMonth(today.getMonth() + 1);
                expiryDate.setDate(28);
        }
        
        // If today is after 28th, adjust to next month
        if (today.getDate() > 28) {
            expiryDate.setMonth(expiryDate.getMonth() + 1);
        }
        
        return expiryDate.toISOString();
    }

    async performCRBCheck(userData) {
        // Simulated CRB check
        // In production, integrate with credit bureau API
        
        const crbData = {
            userId: userData.userId,
            nationalId: userData.nationalId,
            checkDate: new Date().toISOString(),
            status: 'PENDING'
        };
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock response - in production, this would be real CRB data
        const mockResponse = {
            passed: Math.random() > 0.3, // 70% pass rate for simulation
            score: Math.floor(Math.random() * 900) + 300, // 300-1200 score
            report: {
                activeLoans: Math.floor(Math.random() * 5),
                defaults: Math.floor(Math.random() * 2),
                inquiries: Math.floor(Math.random() * 10)
            },
            timestamp: new Date().toISOString()
        };
        
        crbData.status = mockResponse.passed ? 'PASSED' : 'FAILED';
        crbData.score = mockResponse.score;
        crbData.report = mockResponse.report;
        
        // Store CRB check result
        await this.storeCRBCheckResult(crbData);
        
        return {
            passed: mockResponse.passed,
            score: mockResponse.score,
            details: mockResponse.report,
            message: mockResponse.passed ? 
                'CRB check passed' : 
                'CRB check failed. Cannot subscribe to this tier.'
        };
    }

    async storeCRBCheckResult(crbData) {
        const crbChecks = JSON.parse(localStorage.getItem('mpesewa_crb_checks') || '[]');
        crbChecks.push(crbData);
        localStorage.setItem('mpesewa_crb_checks', JSON.stringify(crbChecks));
    }

    generatePaymentDetails(subscription) {
        const paymentMethods = this.getPaymentMethods(this.userData.country);
        const selectedMethod = subscription.paymentMethod;
        
        let instructions = {};
        
        switch (selectedMethod) {
            case 'M-PESA':
                instructions = {
                    method: 'M-PESA',
                    steps: [
                        'Go to M-PESA menu',
                        'Select Lipa Na M-PESA',
                        'Select Paybill',
                        `Enter Business No: 123456`,
                        `Enter Account No: ${subscription.id}`,
                        `Enter Amount: ${subscription.amount}`,
                        'Enter your M-PESA PIN',
                        'Confirm payment'
                    ],
                    paybill: '123456',
                    account: subscription.id
                };
                break;
                
            case 'BANK_TRANSFER':
                instructions = {
                    method: 'BANK_TRANSFER',
                    steps: [
                        'Make transfer to:',
                        `Bank: M-Pesewa Bank`,
                        `Account: 1234567890`,
                        `Reference: ${subscription.id}`,
                        `Amount: ${subscription.amount}`,
                        'Send confirmation to payments@mpesewa.com'
                    ],
                    bankDetails: {
                        name: 'M-Pesewa Bank',
                        account: '1234567890',
                        branch: 'Nairobi Main',
                        swift: 'MPESEWAKE'
                    }
                };
                break;
                
            default:
                instructions = {
                    method: selectedMethod,
                    steps: [
                        `Pay ${subscription.amount} using ${selectedMethod}`,
                        `Use reference: ${subscription.id}`,
                        'Keep payment confirmation'
                    ]
                };
        }
        
        return {
            subscriptionId: subscription.id,
            amount: subscription.amount,
            currency: subscription.currency,
            method: selectedMethod,
            instructions: instructions,
            expiry: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
            contactSupport: 'payments@mpesewa.com'
        };
    }

    validatePaymentData(paymentData) {
        const requiredFields = ['method', 'amount', 'reference', 'confirmation'];
        
        for (const field of requiredFields) {
            if (!paymentData[field]) {
                return {
                    valid: false,
                    message: `${field} is required`
                };
            }
        }
        
        // Validate amount matches subscription
        if (paymentData.amount !== this.subscriptionData.amount) {
            return {
                valid: false,
                message: 'Payment amount does not match subscription amount'
            };
        }
        
        return {
            valid: true,
            message: 'Payment data validated'
        };
    }

    async processPaymentTransaction(paymentData) {
        // Simulated payment processing
        // In production, integrate with payment gateway
        
        console.log(`Processing payment via ${paymentData.method} for ${paymentData.amount}`);
        
        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Mock successful payment 90% of the time
        const success = Math.random() > 0.1;
        
        if (success) {
            const reference = 'PAY-' + Date.now() + '-' + Math.random().toString(36).substr(2, 8).toUpperCase();
            
            return {
                success: true,
                reference: reference,
                amount: paymentData.amount,
                method: paymentData.method,
                processedAt: new Date().toISOString(),
                message: 'Payment processed successfully'
            };
        } else {
            return {
                success: false,
                message: 'Payment failed. Please try again or use a different method.'
            };
        }
    }

    async recordPaymentTransaction(paymentResult) {
        const payments = JSON.parse(localStorage.getItem('mpesewa_payments') || '[]');
        
        payments.push({
            subscriptionId: this.subscriptionData.id,
            userId: this.userData.userId,
            ...paymentResult,
            recordedAt: new Date().toISOString()
        });
        
        localStorage.setItem('mpesewa_payments', JSON.stringify(payments));
    }

    async activateUserSubscription() {
        // Update subscription status to ACTIVE
        this.subscriptionData.status = 'ACTIVE';
        this.subscriptionData.activatedAt = new Date().toISOString();
        
        // Store subscription
        const subscriptions = JSON.parse(localStorage.getItem('mpesewa_subscriptions') || '[]');
        
        // Remove any existing subscription for this user
        const filteredSubscriptions = subscriptions.filter(sub => sub.userId !== this.userData.userId);
        filteredSubscriptions.push(this.subscriptionData);
        
        localStorage.setItem('mpesewa_subscriptions', JSON.stringify(filteredSubscriptions));
        
        return {
            success: true,
            subscriptionId: this.subscriptionData.id,
            activatedAt: this.subscriptionData.activatedAt
        };
    }

    async updateUserSubscriptionStatus() {
        // Update user/lender record with subscription info
        const lenders = JSON.parse(localStorage.getItem('mpesewa_lenders') || '[]');
        const lenderIndex = lenders.findIndex(l => l.userId === this.userData.userId);
        
        if (lenderIndex !== -1) {
            lenders[lenderIndex].subscription = {
                tier: this.subscriptionData.tier,
                status: 'ACTIVE',
                expiry: this.subscriptionData.expiryDate,
                weeklyLimit: this.subscriptionData.weeklyLimit
            };
            
            lenders[lenderIndex].lendingEnabled = true;
            lenders[lenderIndex].lastUpdated = new Date().toISOString();
            
            localStorage.setItem('mpesewa_lenders', JSON.stringify(lenders));
        }
        
        // Also update user session
        const session = JSON.parse(localStorage.getItem('mpesewa_user_session') || '{}');
        if (session.userId === this.userData.userId) {
            session.subscriptionActive = true;
            session.subscriptionTier = this.subscriptionData.tier;
            localStorage.setItem('mpesewa_user_session', JSON.stringify(session));
        }
    }

    async grantPlatformAccess() {
        // Update user permissions based on subscription tier
        const permissions = this.getTierPermissions(this.subscriptionData.tier);
        
        const userPermissions = JSON.parse(localStorage.getItem('mpesewa_user_permissions') || '{}');
        userPermissions[this.userData.userId] = permissions;
        
        localStorage.setItem('mpesewa_user_permissions', JSON.stringify(userPermissions));
        
        // Update feature flags
        await this.updateFeatureFlags(this.userData.userId, permissions);
    }

    getTierPermissions(tier) {
        const basePermissions = {
            canLend: true,
            canCreateLedgers: true,
            canRateBorrowers: true,
            canViewAnalytics: false,
            canAccessDebtCollectors: false,
            canSetCustomTerms: false,
            maxGroups: 1
        };
        
        switch (tier) {
            case 'PREMIUM':
                return {
                    ...basePermissions,
                    canViewAnalytics: true,
                    maxGroups: 3
                };
                
            case 'SUPER':
                return {
                    ...basePermissions,
                    canViewAnalytics: true,
                    canAccessDebtCollectors: true,
                    maxGroups: 999 // Unlimited
                };
                
            case 'LENDER_OF_LENDERS':
                return {
                    ...basePermissions,
                    canViewAnalytics: true,
                    canAccessDebtCollectors: true,
                    canSetCustomTerms: true,
                    maxGroups: 999 // Unlimited
                };
                
            default: // BASIC
                return basePermissions;
        }
    }

    async updateFeatureFlags(userId, permissions) {
        const featureFlags = JSON.parse(localStorage.getItem('mpesewa_feature_flags') || '{}');
        featureFlags[userId] = permissions;
        localStorage.setItem('mpesewa_feature_flags', JSON.stringify(featureFlags));
    }

    async scheduleExpiryCheck() {
        // Schedule daily check for expiring subscriptions
        // In production, this would be a server-side cron job
        
        console.log('Scheduled expiry check for subscription:', this.subscriptionData.id);
        
        // Store check schedule
        const expiryChecks = JSON.parse(localStorage.getItem('mpesewa_expiry_checks') || '[]');
        expiryChecks.push({
            subscriptionId: this.subscriptionData.id,
            userId: this.userData.userId,
            expiryDate: this.subscriptionData.expiryDate,
            checkScheduled: true,
            lastChecked: new Date().toISOString()
        });
        
        localStorage.setItem('mpesewa_expiry_checks', JSON.stringify(expiryChecks));
    }

    async sendActivationNotification() {
        const notification = {
            userId: this.userData.userId,
            type: 'SUBSCRIPTION_ACTIVATED',
            title: 'Subscription Activated!',
            message: `Your ${this.subscriptionData.tierName} subscription is now active. You can start lending up to ${this.subscriptionData.weeklyLimit} per week.`,
            priority: 'HIGH',
            createdAt: new Date().toISOString(),
            data: {
                tier: this.subscriptionData.tier,
                limit: this.subscriptionData.weeklyLimit,
                expiry: this.subscriptionData.expiryDate
            }
        };
        
        const notifications = JSON.parse(localStorage.getItem('mpesewa_notifications') || '[]');
        notifications.push(notification);
        localStorage.setItem('mpesewa_notifications', JSON.stringify(notifications));
        
        // Also send email/SMS based on user preferences
        console.log(`Sent activation notification to user ${this.userData.userId}`);
    }

    canUserLend(subscription) {
        if (!subscription || subscription.status !== 'ACTIVE') {
            return false;
        }
        
        const now = new Date();
        const expiryDate = new Date(subscription.expiryDate);
        
        if (now > expiryDate) {
            return false;
        }
        
        return true;
    }

    getCurrentLendingLimit(subscription) {
        if (!this.canUserLend(subscription)) {
            return 0;
        }
        
        return subscription.weeklyLimit || 0;
    }

    validateUpgradePath(currentTier, newTier) {
        const tierOrder = ['BASIC', 'PREMIUM', 'SUPER', 'LENDER_OF_LENDERS'];
        const currentIndex = tierOrder.indexOf(currentTier);
        const newIndex = tierOrder.indexOf(newTier);
        
        if (currentIndex === -1 || newIndex === -1) {
            return {
                valid: false,
                message: 'Invalid tier specified'
            };
        }
        
        if (newIndex <= currentIndex) {
            return {
                valid: false,
                message: 'Can only upgrade to a higher tier'
            };
        }
        
        return {
            valid: true,
            message: 'Valid upgrade path'
        };
    }

    calculateProratedAmount(currentSubscription, upgradeData) {
        // Calculate prorated amount for upgrade
        // Formula: (New price - Used portion of current price)
        
        const currentTier = this.tiers[currentSubscription.tier];
        const newTier = this.tiers[upgradeData.newTier];
        
        const currentPrice = this.getTierPrice(currentTier, currentSubscription.duration);
        const newPrice = this.getTierPrice(newTier, upgradeData.duration || currentSubscription.duration);
        
        // Calculate used portion (days used / total days)
        const startDate = new Date(currentSubscription.startDate);
        const now = new Date();
        const expiryDate = new Date(currentSubscription.expiryDate);
        
        const totalDays = (expiryDate - startDate) / (1000 * 60 * 60 * 24);
        const usedDays = (now - startDate) / (1000 * 60 * 60 * 24);
        
        const usedPortion = usedDays / totalDays;
        const usedAmount = currentPrice * usedPortion;
        
        // Prorated amount = New price - Used amount
        const prorated = newPrice - usedAmount;
        
        return Math.max(0, Math.round(prorated));
    }

    createUpgradeSubscription(current, upgradeData, proratedAmount) {
        const newTier = this.tiers[upgradeData.newTier];
        const expiryDate = this.calculateSubscriptionExpiry(upgradeData.duration || current.duration);
        
        return {
            id: 'SUB-UPG-' + Date.now(),
            userId: current.userId,
            tier: upgradeData.newTier,
            tierName: newTier.name,
            duration: upgradeData.duration || current.duration,
            amount: proratedAmount,
            currency: current.currency,
            paymentMethod: upgradeData.paymentMethod || current.paymentMethod,
            startDate: new Date().toISOString(),
            expiryDate: expiryDate,
            status: 'PENDING_PAYMENT',
            weeklyLimit: newTier.weeklyLimit,
            features: newTier.features,
            previousSubscriptionId: current.id,
            upgrade: true,
            createdAt: new Date().toISOString()
        };
    }

    createRenewalSubscription(current, renewalData) {
        const tier = this.tiers[current.tier];
        const price = this.getTierPrice(tier, renewalData.duration || current.duration);
        const expiryDate = this.calculateSubscriptionExpiry(renewalData.duration || current.duration);
        
        return {
            id: 'SUB-REN-' + Date.now(),
            userId: current.userId,
            tier: current.tier,
            tierName: tier.name,
            duration: renewalData.duration || current.duration,
            amount: price,
            currency: current.currency,
            paymentMethod: renewalData.paymentMethod || current.paymentMethod,
            startDate: new Date().toISOString(),
            expiryDate: expiryDate,
            status: 'PENDING_PAYMENT',
            weeklyLimit: tier.weeklyLimit,
            features: tier.features,
            previousSubscriptionId: current.id,
            renewal: true,
            createdAt: new Date().toISOString()
        };
    }

    async getExpiringSubscriptions() {
        const subscriptions = JSON.parse(localStorage.getItem('mpesewa_subscriptions') || '[]');
        const now = new Date();
        
        return subscriptions.filter(sub => {
            if (sub.status !== 'ACTIVE') return false;
            
            const expiryDate = new Date(sub.expiryDate);
            const daysUntilExpiry = (expiryDate - now) / (1000 * 60 * 60 * 24);
            
            return daysUntilExpiry <= 7; // Expiring in 7 days or less
        });
    }

    async expireSubscription(userId) {
        const subscriptions = JSON.parse(localStorage.getItem('mpesewa_subscriptions') || '[]');
        const subscriptionIndex = subscriptions.findIndex(sub => 
            sub.userId === userId && sub.status === 'ACTIVE'
        );
        
        if (subscriptionIndex !== -1) {
            subscriptions[subscriptionIndex].status = 'EXPIRED';
            subscriptions[subscriptionIndex].expiredAt = new Date().toISOString();
            localStorage.setItem('mpesewa_subscriptions', JSON.stringify(subscriptions));
        }
        
        // Update lender record
        const lenders = JSON.parse(localStorage.getItem('mpesewa_lenders') || '[]');
        const lenderIndex = lenders.findIndex(l => l.userId === userId);
        
        if (lenderIndex !== -1) {
            lenders[lenderIndex].subscription.status = 'EXPIRED';
            lenders[lenderIndex].lendingEnabled = false;
            lenders[lenderIndex].lastUpdated = new Date().toISOString();
            localStorage.setItem('mpesewa_lenders', JSON.stringify(lenders));
        }
    }

    async blockLendingAccess(userId) {
        // Update permissions to block lending
        const permissions = JSON.parse(localStorage.getItem('mpesewa_user_permissions') || '{}');
        if (permissions[userId]) {
            permissions[userId].canLend = false;
            localStorage.setItem('mpesewa_user_permissions', JSON.stringify(permissions));
        }
        
        // Update session
        const session = JSON.parse(localStorage.getItem('mpesewa_user_session') || '{}');
        if (session.userId === userId) {
            session.subscriptionActive = false;
            localStorage.setItem('mpesewa_user_session', JSON.stringify(session));
        }
    }

    async sendExpiryNotification(subscription) {
        const notification = {
            userId: subscription.userId,
            type: 'SUBSCRIPTION_EXPIRED',
            title: 'Subscription Expired',
            message: 'Your subscription has expired. Please renew to continue lending.',
            priority: 'HIGH',
            createdAt: new Date().toISOString(),
            actionRequired: true,
            actionUrl: '/subscription/renew.html'
        };
        
        const notifications = JSON.parse(localStorage.getItem('mpesewa_notifications') || '[]');
        notifications.push(notification);
        localStorage.setItem('mpesewa_notifications', JSON.stringify(notifications));
    }

    async sendExpiryWarning(subscription) {
        const expiryDate = new Date(subscription.expiryDate);
        const now = new Date();
        const daysUntilExpiry = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
        
        const notification = {
            userId: subscription.userId,
            type: 'SUBSCRIPTION_EXPIRING',
            title: 'Subscription Expiring Soon',
            message: `Your subscription expires in ${daysUntilExpiry} days. Please renew to avoid interruption.`,
            priority: 'MEDIUM',
            createdAt: new Date().toISOString(),
            data: {
                expiryDate: expiryDate.toISOString(),
                daysUntilExpiry: daysUntilExpiry
            }
        };
        
        const notifications = JSON.parse(localStorage.getItem('mpesewa_notifications') || '[]');
        notifications.push(notification);
        localStorage.setItem('mpesewa_notifications', JSON.stringify(notifications));
    }

    // Public API methods
    getCurrentState() {
        return {
            state: this.currentState,
            subscription: this.subscriptionData,
            userData: this.userData ? {
                userId: this.userData.userId,
                role: this.userData.role,
                country: this.userData.country
            } : null
        };
    }

    reset() {
        this.currentState = this.states.IDLE;
        this.subscriptionData = null;
        this.userData = null;
        this.paymentData = null;
    }

    async getSubscriptionHistory(userId) {
        const subscriptions = JSON.parse(localStorage.getItem('mpesewa_subscriptions') || '[]');
        const userSubscriptions = subscriptions.filter(sub => sub.userId === userId);
        
        return userSubscriptions.sort((a, b) => 
            new Date(b.createdAt) - new Date(a.createdAt)
        );
    }

    async getPaymentHistory(userId) {
        const payments = JSON.parse(localStorage.getItem('mpesewa_payments') || '[]');
        return payments.filter(payment => payment.userId === userId);
    }

    async cancelSubscription(userId, reason) {
        const subscription = await this.getCurrentSubscription(userId);
        
        if (!subscription) {
            return {
                success: false,
                message: 'No active subscription found'
            };
        }
        
        // Update subscription status
        const subscriptions = JSON.parse(localStorage.getItem('mpesewa_subscriptions') || '[]');
        const subIndex = subscriptions.findIndex(sub => sub.id === subscription.id);
        
        if (subIndex !== -1) {
            subscriptions[subIndex].status = 'CANCELLED';
            subscriptions[subIndex].cancelledAt = new Date().toISOString();
            subscriptions[subIndex].cancellationReason = reason;
            localStorage.setItem('mpesewa_subscriptions', JSON.stringify(subscriptions));
        }
        
        // Block lending access
        await this.blockLendingAccess(userId);
        
        // Send cancellation notification
        await this.sendCancellationNotification(userId, reason);
        
        return {
            success: true,
            message: 'Subscription cancelled successfully',
            refundEligible: this.checkRefundEligibility(subscription)
        };
    }

    checkRefundEligibility(subscription) {
        // Refund eligible if cancelled within 3 days of activation
        const activatedDate = new Date(subscription.activatedAt || subscription.startDate);
        const now = new Date();
        const daysSinceActivation = (now - activatedDate) / (1000 * 60 * 60 * 24);
        
        return daysSinceActivation <= 3;
    }

    async sendCancellationNotification(userId, reason) {
        const notification = {
            userId: userId,
            type: 'SUBSCRIPTION_CANCELLED',
            title: 'Subscription Cancelled',
            message: `Your subscription has been cancelled. Reason: ${reason}`,
            priority: 'MEDIUM',
            createdAt: new Date().toISOString()
        };
        
        const notifications = JSON.parse(localStorage.getItem('mpesewa_notifications') || '[]');
        notifications.push(notification);
        localStorage.setItem('mpesewa_notifications', JSON.stringify(notifications));
    }
}

// Export singleton instance
const subscriptionFlow = new SubscriptionFlow();
export default subscriptionFlow;