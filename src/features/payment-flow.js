/**
 * M-Pesewa Payment Flow Orchestrator
 * Payment orchestration: checkout → ledger update → notification
 * Handles subscription payments and repayment tracking
 */

class PaymentFlow {
    constructor() {
        this.currentState = 'IDLE';
        this.states = {
            IDLE: 'IDLE',
            INITIATING: 'INITIATING',
            PROCESSING: 'PROCESSING',
            PENDING_CONFIRMATION: 'PENDING_CONFIRMATION',
            COMPLETED: 'COMPLETED',
            FAILED: 'FAILED',
            REFUNDED: 'REFUNDED',
            CANCELLED: 'CANCELLED',
            DISPUTED: 'DISPUTED'
        };
        
        this.paymentData = null;
        this.transaction = null;
        this.paymentMethod = null;
        this.amount = 0;
        this.currency = 'KSh';
    }

    // MAIN PAYMENT FLOW METHODS

    async initiatePayment(paymentData) {
        try {
            this.currentState = this.states.INITIATING;
            this.paymentData = paymentData;
            
            // Validate payment data
            const validation = this.validatePaymentData(paymentData);
            if (!validation.valid) {
                throw new Error(validation.message);
            }
            
            // Set payment details
            this.amount = paymentData.amount;
            this.currency = paymentData.currency || 'KSh';
            this.paymentMethod = paymentData.method;
            
            // Create transaction record
            this.transaction = this.createTransaction(paymentData);
            
            // Get payment instructions based on method
            const instructions = this.getPaymentInstructions(paymentData);
            
            this.currentState = this.states.PROCESSING;
            
            return {
                success: true,
                state: this.currentState,
                transaction: this.transaction,
                instructions: instructions,
                nextStep: 'MAKE_PAYMENT',
                message: 'Payment initiated successfully'
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

    async processPayment(confirmationData) {
        try {
            if (this.currentState !== this.states.PROCESSING) {
                throw new Error('Payment not in processing state');
            }
            
            // Validate confirmation data
            const validation = this.validateConfirmationData(confirmationData);
            if (!validation.valid) {
                throw new Error(validation.message);
            }
            
            // Process payment based on method
            const paymentResult = await this.processPaymentByMethod(confirmationData);
            
            if (!paymentResult.success) {
                throw new Error(`Payment failed: ${paymentResult.message}`);
            }
            
            // Update transaction
            await this.updateTransactionStatus('PENDING_CONFIRMATION', paymentResult);
            
            this.currentState = this.states.PENDING_CONFIRMATION;
            
            return {
                success: true,
                state: this.currentState,
                transaction: this.transaction,
                reference: paymentResult.reference,
                confirmationRequired: true,
                estimatedConfirmationTime: this.getConfirmationTime(),
                message: 'Payment processed. Awaiting confirmation.'
            };
            
        } catch (error) {
            this.currentState = this.states.PROCESSING;
            return {
                success: false,
                error: error.message,
                state: this.currentState
            };
        }
    }

    async confirmPayment(confirmationData) {
        try {
            if (this.currentState !== this.states.PENDING_CONFIRMATION) {
                throw new Error('Payment not pending confirmation');
            }
            
            // Verify payment confirmation
            const verification = await this.verifyPaymentConfirmation(confirmationData);
            
            if (!verification.verified) {
                throw new Error(`Payment verification failed: ${verification.message}`);
            }
            
            // Update transaction as completed
            await this.updateTransactionStatus('COMPLETED', verification);
            
            // Execute post-payment actions
            await this.executePostPaymentActions();
            
            // Send confirmation notifications
            await this.sendConfirmationNotifications();
            
            this.currentState = this.states.COMPLETED;
            
            return {
                success: true,
                state: this.currentState,
                transaction: this.transaction,
                receipt: this.generateReceipt(),
                nextActions: this.getNextActions(),
                message: 'Payment confirmed successfully'
            };
            
        } catch (error) {
            this.currentState = this.states.PENDING_CONFIRMATION;
            return {
                success: false,
                error: error.message,
                state: this.currentState
            };
        }
    }

    async recordRepayment(repaymentData) {
        try {
            this.currentState = this.states.INITIATING;
            
            // Validate repayment data
            const validation = this.validateRepaymentData(repaymentData);
            if (!validation.valid) {
                throw new Error(validation.message);
            }
            
            // Get loan details
            const loan = await this.getLoanDetails(repaymentData.loanId);
            if (!loan) {
                throw new Error('Loan not found');
            }
            
            // Create repayment transaction
            this.transaction = this.createRepaymentTransaction(repaymentData, loan);
            
            // Update loan balance
            await this.updateLoanBalance(repaymentData);
            
            // Record repayment in ledger
            await this.recordLedgerEntry(repaymentData, loan);
            
            // Send repayment notifications
            await this.sendRepaymentNotifications(repaymentData, loan);
            
            this.currentState = this.states.COMPLETED;
            
            return {
                success: true,
                state: this.currentState,
                repayment: this.transaction,
                loan: loan,
                remainingBalance: await this.getRemainingBalance(repaymentData.loanId),
                message: 'Repayment recorded successfully'
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

    async processSubscriptionPayment(subscriptionData) {
        try {
            this.currentState = this.states.INITIATING;
            
            // Get subscription details
            const subscription = await this.getSubscriptionDetails(subscriptionData.subscriptionId);
            if (!subscription) {
                throw new Error('Subscription not found');
            }
            
            // Create payment data
            const paymentData = {
                type: 'SUBSCRIPTION',
                subscriptionId: subscription.id,
                amount: subscription.amount,
                currency: subscription.currency,
                method: subscriptionData.paymentMethod || subscription.paymentMethod,
                userId: subscription.userId,
                description: `Subscription payment: ${subscription.tierName}`
            };
            
            // Initiate payment
            const initiation = await this.initiatePayment(paymentData);
            
            if (!initiation.success) {
                throw new Error(initiation.error);
            }
            
            // Process payment
            const processing = await this.processPayment({
                method: paymentData.method,
                amount: paymentData.amount
            });
            
            if (!processing.success) {
                throw new Error(processing.error);
            }
            
            // Confirm payment
            const confirmation = await this.confirmPayment({
                reference: processing.reference
            });
            
            if (!confirmation.success) {
                throw new Error(confirmation.error);
            }
            
            // Activate subscription
            await this.activateSubscription(subscription.id);
            
            return {
                success: true,
                state: this.currentState,
                subscription: subscription,
                payment: confirmation.transaction,
                activated: true,
                message: 'Subscription payment completed and activated'
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

    async handlePaymentFailure(failureData) {
        try {
            if (!['PROCESSING', 'PENDING_CONFIRMATION'].includes(this.currentState)) {
                throw new Error('Payment not in a fail-able state');
            }
            
            // Update transaction as failed
            await this.updateTransactionStatus('FAILED', failureData);
            
            // Notify user
            await this.notifyPaymentFailure(failureData);
            
            // Provide retry options
            const retryOptions = this.getRetryOptions();
            
            this.currentState = this.states.FAILED;
            
            return {
                success: false,
                state: this.currentState,
                transaction: this.transaction,
                failureReason: failureData.reason,
                retryOptions: retryOptions,
                message: 'Payment failed. Please try again.'
            };
            
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async refundPayment(refundData) {
        try {
            // Get transaction
            const transaction = await this.getTransaction(refundData.transactionId);
            if (!transaction) {
                throw new Error('Transaction not found');
            }
            
            // Check if refund is possible
            const canRefund = await this.canRefundTransaction(transaction);
            if (!canRefund.allowed) {
                throw new Error(canRefund.message);
            }
            
            // Create refund transaction
            const refundTransaction = this.createRefundTransaction(transaction, refundData);
            
            // Process refund
            const refundResult = await this.processRefund(transaction, refundData);
            
            // Update original transaction
            await this.updateTransactionStatus('REFUNDED', {
                refundId: refundTransaction.id,
                refundAmount: refundData.amount,
                refundReason: refundData.reason
            });
            
            // Notify user
            await this.notifyRefund(refundTransaction);
            
            this.currentState = this.states.REFUNDED;
            
            return {
                success: true,
                state: this.currentState,
                originalTransaction: transaction,
                refundTransaction: refundTransaction,
                refundAmount: refundData.amount,
                message: 'Refund processed successfully'
            };
            
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async disputePayment(disputeData) {
        try {
            // Get transaction
            const transaction = await this.getTransaction(disputeData.transactionId);
            if (!transaction) {
                throw new Error('Transaction not found');
            }
            
            // Create dispute
            const dispute = this.createDispute(transaction, disputeData);
            
            // Update transaction status
            await this.updateTransactionStatus('DISPUTED', {
                disputeId: dispute.id,
                disputeReason: disputeData.reason
            });
            
            // Notify admin
            await this.notifyAdminOfDispute(dispute);
            
            this.currentState = this.states.DISPUTED;
            
            return {
                success: true,
                state: this.currentState,
                dispute: dispute,
                transaction: transaction,
                estimatedResolution: '7-14 business days',
                message: 'Dispute filed successfully'
            };
            
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async getPaymentHistory(userId, filters = {}) {
        try {
            const transactions = await this.getUserTransactions(userId);
            
            // Apply filters
            let filtered = transactions;
            
            if (filters.type) {
                filtered = filtered.filter(t => t.type === filters.type);
            }
            
            if (filters.status) {
                filtered = filtered.filter(t => t.status === filters.status);
            }
            
            if (filters.startDate) {
                const start = new Date(filters.startDate);
                filtered = filtered.filter(t => new Date(t.createdAt) >= start);
            }
            
            if (filters.endDate) {
                const end = new Date(filters.endDate);
                filtered = filtered.filter(t => new Date(t.createdAt) <= end);
            }
            
            // Sort by date (newest first)
            filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            
            // Calculate totals
            const totals = this.calculatePaymentTotals(filtered);
            
            return {
                success: true,
                total: filtered.length,
                transactions: filtered,
                totals: totals,
                filtersApplied: filters
            };
            
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // HELPER METHODS

    validatePaymentData(paymentData) {
        const requiredFields = ['type', 'amount', 'method', 'userId'];
        
        for (const field of requiredFields) {
            if (!paymentData[field]) {
                return {
                    valid: false,
                    message: `${field} is required`
                };
            }
        }
        
        // Validate amount
        if (paymentData.amount <= 0) {
            return {
                valid: false,
                message: 'Amount must be greater than 0'
            };
        }
        
        // Validate payment type
        const validTypes = ['SUBSCRIPTION', 'REPAYMENT', 'TOPUP', 'FEE'];
        if (!validTypes.includes(paymentData.type)) {
            return {
                valid: false,
                message: 'Invalid payment type'
            };
        }
        
        // Validate payment method
        const validMethods = ['M-PESA', 'BANK_TRANSFER', 'AIRTEL_MONEY', 'CREDIT_CARD', 'CASH'];
        if (!validMethods.includes(paymentData.method)) {
            return {
                valid: false,
                message: 'Invalid payment method'
            };
        }
        
        return {
            valid: true,
            message: 'Payment data validated'
        };
    }

    createTransaction(paymentData) {
        const transactionId = 'PAY-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6).toUpperCase();
        
        const transaction = {
            id: transactionId,
            userId: paymentData.userId,
            type: paymentData.type,
            amount: paymentData.amount,
            currency: paymentData.currency || 'KSh',
            method: paymentData.method,
            status: 'INITIATED',
            description: paymentData.description || `${paymentData.type} Payment`,
            reference: paymentData.reference,
            metadata: paymentData.metadata || {},
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        // Store transaction
        const transactions = JSON.parse(localStorage.getItem('mpesewa_transactions') || '[]');
        transactions.push(transaction);
        localStorage.setItem('mpesewa_transactions', JSON.stringify(transactions));
        
        return transaction;
    }

    getPaymentInstructions(paymentData) {
        const method = paymentData.method;
        const amount = paymentData.amount;
        const transactionId = this.transaction.id;
        
        let instructions;
        
        switch (method) {
            case 'M-PESA':
                instructions = {
                    method: 'M-PESA',
                    steps: [
                        'Go to M-PESA menu',
                        'Select Lipa Na M-PESA',
                        'Select Paybill',
                        'Enter Business No: 123456',
                        `Enter Account No: ${transactionId}`,
                        `Enter Amount: ${amount}`,
                        'Enter your M-PESA PIN',
                        'Confirm payment'
                    ],
                    paybill: '123456',
                    account: transactionId,
                    amount: amount,
                    expiry: '24 hours'
                };
                break;
                
            case 'AIRTEL_MONEY':
                instructions = {
                    method: 'AIRTEL_MONEY',
                    steps: [
                        'Go to Airtel Money menu',
                        'Select Make Payment',
                        'Select Pay Merchant',
                        `Enter Merchant Code: MPESEWA`,
                        `Enter Reference: ${transactionId}`,
                        `Enter Amount: ${amount}`,
                        'Enter your PIN',
                        'Confirm payment'
                    ],
                    merchantCode: 'MPESEWA',
                    reference: transactionId,
                    amount: amount,
                    expiry: '24 hours'
                };
                break;
                
            case 'BANK_TRANSFER':
                instructions = {
                    method: 'BANK_TRANSFER',
                    steps: [
                        'Make transfer to:',
                        'Bank: M-Pesewa Bank',
                        'Account: 1234567890',
                        `Reference: ${transactionId}`,
                        `Amount: ${amount}`,
                        'Send confirmation to payments@mpesewa.com'
                    ],
                    bankDetails: {
                        name: 'M-Pesewa Bank',
                        account: '1234567890',
                        branch: 'Nairobi Main',
                        swift: 'MPESEWAKE'
                    },
                    reference: transactionId,
                    amount: amount
                };
                break;
                
            case 'CREDIT_CARD':
                instructions = {
                    method: 'CREDIT_CARD',
                    steps: [
                        'Click "Pay with Card" button',
                        'Enter card details',
                        'Enter billing information',
                        `Enter Amount: ${amount}`,
                        'Review and confirm'
                    ],
                    amount: amount,
                    secure: true,
                    processor: 'Stripe'
                };
                break;
                
            default:
                instructions = {
                    method: method,
                    steps: [
                        `Pay ${amount} using ${method}`,
                        `Use reference: ${transactionId}`,
                        'Keep payment confirmation'
                    ],
                    reference: transactionId,
                    amount: amount
                };
        }
        
        return {
            ...instructions,
            transactionId: transactionId,
            contactSupport: 'payments@mpesewa.com'
        };
    }

    validateConfirmationData(confirmationData) {
        if (!confirmationData.reference) {
            return {
                valid: false,
                message: 'Payment reference is required'
            };
        }
        
        return {
            valid: true,
            message: 'Confirmation data validated'
        };
    }

    async processPaymentByMethod(confirmationData) {
        // Simulated payment processing
        // In production, integrate with payment gateway
        
        console.log(`Processing ${this.paymentMethod} payment for ${this.amount} ${this.currency}`);
        
        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Mock success 90% of the time
        const success = Math.random() > 0.1;
        
        if (success) {
            const reference = 'PAY-' + Date.now() + '-' + Math.random().toString(36).substr(2, 8).toUpperCase();
            
            return {
                success: true,
                reference: reference,
                amount: this.amount,
                currency: this.currency,
                method: this.paymentMethod,
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

    async updateTransactionStatus(status, updateData = {}) {
        const transactions = JSON.parse(localStorage.getItem('mpesewa_transactions') || '[]');
        const transactionIndex = transactions.findIndex(t => t.id === this.transaction.id);
        
        if (transactionIndex !== -1) {
            transactions[transactionIndex].status = status;
            transactions[transactionIndex].updatedAt = new Date().toISOString();
            
            // Add update data
            Object.keys(updateData).forEach(key => {
                if (key !== 'transactionId') {
                    transactions[transactionIndex][key] = updateData[key];
                }
            });
            
            // Add status history
            transactions[transactionIndex].statusHistory = transactions[transactionIndex].statusHistory || [];
            transactions[transactionIndex].statusHistory.push({
                status: status,
                timestamp: new Date().toISOString(),
                ...updateData
            });
            
            localStorage.setItem('mpesewa_transactions', JSON.stringify(transactions));
            
            // Update local transaction
            this.transaction = transactions[transactionIndex];
        }
    }

    getConfirmationTime() {
        const times = {
            'M-PESA': 'Instant to 2 minutes',
            'AIRTEL_MONEY': 'Instant to 2 minutes',
            'BANK_TRANSFER': '1-24 hours',
            'CREDIT_CARD': 'Instant',
            'CASH': 'Manual verification required'
        };
        
        return times[this.paymentMethod] || '1-24 hours';
    }

    async verifyPaymentConfirmation(confirmationData) {
        // Simulated verification
        // In production, verify with payment gateway
        
        console.log(`Verifying payment confirmation: ${confirmationData.reference}`);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock verification
        const verified = Math.random() > 0.05; // 95% success rate
        
        if (verified) {
            return {
                verified: true,
                reference: confirmationData.reference,
                confirmedAt: new Date().toISOString(),
                message: 'Payment confirmed successfully'
            };
        } else {
            return {
                verified: false,
                message: 'Payment confirmation failed'
            };
        }
    }

    async executePostPaymentActions() {
        // Execute actions based on payment type
        switch (this.paymentData.type) {
            case 'SUBSCRIPTION':
                await this.activateSubscription(this.paymentData.subscriptionId);
                break;
                
            case 'REPAYMENT':
                await this.updateLoanAfterRepayment(this.paymentData.loanId, this.amount);
                break;
                
            case 'TOPUP':
                await this.topUpWallet(this.paymentData.userId, this.amount);
                break;
                
            case 'FEE':
                await this.processFeePayment(this.paymentData);
                break;
        }
    }

    async activateSubscription(subscriptionId) {
        const subscriptions = JSON.parse(localStorage.getItem('mpesewa_subscriptions') || '[]');
        const subscriptionIndex = subscriptions.findIndex(sub => sub.id === subscriptionId);
        
        if (subscriptionIndex !== -1) {
            subscriptions[subscriptionIndex].status = 'ACTIVE';
            subscriptions[subscriptionIndex].activatedAt = new Date().toISOString();
            subscriptions[subscriptionIndex].lastPaymentDate = new Date().toISOString();
            localStorage.setItem('mpesewa_subscriptions', JSON.stringify(subscriptions));
            
            // Update lender status
            await this.updateLenderSubscriptionStatus(subscriptions[subscriptionIndex].userId);
        }
    }

    async updateLenderSubscriptionStatus(userId) {
        const lenders = JSON.parse(localStorage.getItem('mpesewa_lenders') || '[]');
        const lenderIndex = lenders.findIndex(l => l.userId === userId);
        
        if (lenderIndex !== -1) {
            lenders[lenderIndex].subscriptionActive = true;
            lenders[lenderIndex].lastUpdated = new Date().toISOString();
            localStorage.setItem('mpesewa_lenders', JSON.stringify(lenders));
        }
    }

    async updateLoanAfterRepayment(loanId, amount) {
        const loans = JSON.parse(localStorage.getItem('mpesewa_loans') || '[]');
        const loanIndex = loans.findIndex(l => l.id === loanId);
        
        if (loanIndex !== -1) {
            loans[loanIndex].outstandingBalance -= amount;
            loans[loanIndex].lastRepaymentDate = new Date().toISOString();
            loans[loanIndex].lastUpdated = new Date().toISOString();
            
            // Add repayment record
            loans[loanIndex].repayments = loans[loanIndex].repayments || [];
            loans[loanIndex].repayments.push({
                amount: amount,
                date: new Date().toISOString(),
                method: this.paymentMethod,
                reference: this.transaction.id
            });
            
            localStorage.setItem('mpesewa_loans', JSON.stringify(loans));
        }
    }

    async topUpWallet(userId, amount) {
        // Update user wallet
        const users = JSON.parse(localStorage.getItem('mpesewa_users') || '[]');
        const userIndex = users.findIndex(u => u.userId === userId);
        
        if (userIndex !== -1) {
            users[userIndex].walletBalance = (users[userIndex].walletBalance || 0) + amount;
            users[userIndex].lastTopUp = new Date().toISOString();
            localStorage.setItem('mpesewa_users', JSON.stringify(users));
        }
    }

    async processFeePayment(paymentData) {
        // Record fee payment
        const fees = JSON.parse(localStorage.getItem('mpesewa_fees') || '[]');
        fees.push({
            ...paymentData,
            paidAt: new Date().toISOString(),
            transactionId: this.transaction.id
        });
        localStorage.setItem('mpesewa_fees', JSON.stringify(fees));
    }

    async sendConfirmationNotifications() {
        // Notification to user
        const userNotification = {
            userId: this.paymentData.userId,
            type: 'PAYMENT_CONFIRMED',
            title: 'Payment Confirmed',
            message: `Your payment of ${this.amount} ${this.currency} has been confirmed.`,
            priority: 'MEDIUM',
            createdAt: new Date().toISOString(),
            data: {
                transactionId: this.transaction.id,
                amount: this.amount,
                type: this.paymentData.type
            }
        };
        
        const notifications = JSON.parse(localStorage.getItem('mpesewa_notifications') || '[]');
        notifications.push(userNotification);
        localStorage.setItem('mpesewa_notifications', JSON.stringify(notifications));
        
        // Admin notification for large payments
        if (this.amount > 10000) {
            const admins = JSON.parse(localStorage.getItem('mpesewa_admins') || '[]');
            admins.forEach(admin => {
                if (admin.active) {
                    const adminNotification = {
                        userId: admin.userId,
                        type: 'LARGE_PAYMENT_RECEIVED',
                        title: 'Large Payment Received',
                        message: `Large payment of ${this.amount} ${this.currency} received.`,
                        priority: 'LOW',
                        createdAt: new Date().toISOString(),
                        data: {
                            transactionId: this.transaction.id,
                            userId: this.paymentData.userId,
                            amount: this.amount
                        }
                    };
                    
                    notifications.push(adminNotification);
                }
            });
            
            localStorage.setItem('mpesewa_notifications', JSON.stringify(notifications));
        }
    }

    generateReceipt() {
        const receiptId = 'RCPT-' + Date.now();
        
        return {
            receiptId: receiptId,
            transactionId: this.transaction.id,
            userId: this.paymentData.userId,
            amount: this.amount,
            currency: this.currency,
            method: this.paymentMethod,
            type: this.paymentData.type,
            date: new Date().toISOString(),
            status: 'PAID',
            items: [
                {
                    description: this.paymentData.description || `${this.paymentData.type} Payment`,
                    amount: this.amount,
                    currency: this.currency
                }
            ],
            total: this.amount,
            tax: 0, // Assuming no tax
            issuer: 'M-Pesewa',
            contact: 'receipts@mpesewa.com'
        };
    }

    getNextActions() {
        const actions = [];
        
        switch (this.paymentData.type) {
            case 'SUBSCRIPTION':
                actions.push('Subscription activated');
                actions.push('Lending access granted');
                actions.push('View subscription details');
                break;
                
            case 'REPAYMENT':
                actions.push('Loan balance updated');
                actions.push('Check remaining balance');
                actions.push('View repayment history');
                break;
                
            case 'TOPUP':
                actions.push('Wallet balance updated');
                actions.push('View wallet balance');
                actions.push('Make a payment');
                break;
                
            default:
                actions.push('View transaction details');
                actions.push('Download receipt');
        }
        
        return actions;
    }

    validateRepaymentData(repaymentData) {
        const requiredFields = ['loanId', 'amount', 'method', 'reference'];
        
        for (const field of requiredFields) {
            if (!repaymentData[field]) {
                return {
                    valid: false,
                    message: `${field} is required`
                };
            }
        }
        
        if (repaymentData.amount <= 0) {
            return {
                valid: false,
                message: 'Amount must be greater than 0'
            };
        }
        
        return {
            valid: true,
            message: 'Repayment data validated'
        };
    }

    async getLoanDetails(loanId) {
        const loans = JSON.parse(localStorage.getItem('mpesewa_loans') || '[]');
        return loans.find(loan => loan.id === loanId);
    }

    createRepaymentTransaction(repaymentData, loan) {
        const transactionId = 'REPAY-TX-' + Date.now();
        
        const transaction = {
            id: transactionId,
            type: 'REPAYMENT',
            loanId: repaymentData.loanId,
            borrowerId: loan.borrowerId,
            lenderId: loan.lenderId,
            amount: repaymentData.amount,
            currency: loan.currency || 'KSh',
            method: repaymentData.method,
            reference: repaymentData.reference,
            status: 'COMPLETED',
            description: `Repayment for loan ${loan.id}`,
            metadata: {
                loanAmount: loan.amount,
                outstandingBefore: loan.outstandingBalance,
                category: loan.category
            },
            createdAt: new Date().toISOString(),
            confirmedAt: new Date().toISOString()
        };
        
        // Store transaction
        const transactions = JSON.parse(localStorage.getItem('mpesewa_transactions') || '[]');
        transactions.push(transaction);
        localStorage.setItem('mpesewa_transactions', JSON.stringify(transactions));
        
        return transaction;
    }

    async updateLoanBalance(repaymentData) {
        const loans = JSON.parse(localStorage.getItem('mpesewa_loans') || '[]');
        const loanIndex = loans.findIndex(l => l.id === repaymentData.loanId);
        
        if (loanIndex !== -1) {
            loans[loanIndex].outstandingBalance -= repaymentData.amount;
            loans[loanIndex].lastRepaymentDate = new Date().toISOString();
            loans[loanIndex].lastUpdated = new Date().toISOString();
            
            // Record repayment
            loans[loanIndex].repayments = loans[loanIndex].repayments || [];
            loans[loanIndex].repayments.push({
                amount: repaymentData.amount,
                date: new Date().toISOString(),
                method: repaymentData.method,
                reference: repaymentData.reference,
                transactionId: this.transaction?.id
            });
            
            // Check if loan is fully repaid
            if (loans[loanIndex].outstandingBalance <= 0) {
                loans[loanIndex].status = 'CLEARED';
                loans[loanIndex].clearedAt = new Date().toISOString();
            }
            
            localStorage.setItem('mpesewa_loans', JSON.stringify(loans));
        }
    }

    async recordLedgerEntry(repaymentData, loan) {
        const ledgerId = 'LEDGER-REPAY-' + Date.now();
        
        const ledgerEntry = {
            id: ledgerId,
            loanId: repaymentData.loanId,
            type: 'REPAYMENT',
            amount: repaymentData.amount,
            method: repaymentData.method,
            reference: repaymentData.reference,
            recordedBy: repaymentData.recordedBy || 'SYSTEM',
            recordedAt: new Date().toISOString(),
            metadata: {
                outstandingAfter: loan.outstandingBalance - repaymentData.amount,
                transactionId: this.transaction?.id
            }
        };
        
        // Store ledger entry
        const ledgerEntries = JSON.parse(localStorage.getItem('mpesewa_ledger_entries') || '[]');
        ledgerEntries.push(ledgerEntry);
        localStorage.setItem('mpesewa_ledger_entries', JSON.stringify(ledgerEntries));
    }

    async sendRepaymentNotifications(repaymentData, loan) {
        // Notify lender
        const lenderNotification = {
            userId: loan.lenderId,
            type: 'REPAYMENT_RECEIVED',
            title: 'Repayment Received',
            message: `Repayment of ${repaymentData.amount} received for loan ${loan.id}`,
            priority: 'MEDIUM',
            createdAt: new Date().toISOString(),
            data: {
                loanId: loan.id,
                amount: repaymentData.amount,
                method: repaymentData.method,
                outstandingBalance: loan.outstandingBalance - repaymentData.amount
            }
        };
        
        // Notify borrower
        const borrowerNotification = {
            userId: loan.borrowerId,
            type: 'REPAYMENT_CONFIRMED',
            title: 'Repayment Confirmed',
            message: `Your repayment of ${repaymentData.amount} has been recorded.`,
            priority: 'MEDIUM',
            createdAt: new Date().toISOString(),
            data: {
                loanId: loan.id,
                amount: repaymentData.amount,
                outstandingBalance: loan.outstandingBalance - repaymentData.amount
            }
        };
        
        const notifications = JSON.parse(localStorage.getItem('mpesewa_notifications') || '[]');
        notifications.push(lenderNotification, borrowerNotification);
        localStorage.setItem('mpesewa_notifications', JSON.stringify(notifications));
    }

    async getRemainingBalance(loanId) {
        const loans = JSON.parse(localStorage.getItem('mpesewa_loans') || '[]');
        const loan = loans.find(l => l.id === loanId);
        
        return loan ? loan.outstandingBalance : 0;
    }

    async getSubscriptionDetails(subscriptionId) {
        const subscriptions = JSON.parse(localStorage.getItem('mpesewa_subscriptions') || '[]');
        return subscriptions.find(sub => sub.id === subscriptionId);
    }

    async notifyPaymentFailure(failureData) {
        const notification = {
            userId: this.paymentData.userId,
            type: 'PAYMENT_FAILED',
            title: 'Payment Failed',
            message: `Your payment of ${this.amount} ${this.currency} failed. Reason: ${failureData.reason}`,
            priority: 'HIGH',
            createdAt: new Date().toISOString(),
            data: {
                transactionId: this.transaction.id,
                amount: this.amount,
                method: this.paymentMethod,
                reason: failureData.reason
            },
            actionRequired: true,
            actionUrl: `/payments/retry.html?id=${this.transaction.id}`
        };
        
        const notifications = JSON.parse(localStorage.getItem('mpesewa_notifications') || '[]');
        notifications.push(notification);
        localStorage.setItem('mpesewa_notifications', JSON.stringify(notifications));
    }

    getRetryOptions() {
        return {
            retrySameMethod: true,
            alternativeMethods: this.getAlternativeMethods(),
            contactSupport: true,
            supportEmail: 'payments@mpesewa.com',
            supportPhone: '+254 709 219 000'
        };
    }

    getAlternativeMethods() {
        const allMethods = ['M-PESA', 'AIRTEL_MONEY', 'BANK_TRANSFER', 'CREDIT_CARD', 'CASH'];
        return allMethods.filter(method => method !== this.paymentMethod);
    }

    async getTransaction(transactionId) {
        const transactions = JSON.parse(localStorage.getItem('mpesewa_transactions') || '[]');
        return transactions.find(t => t.id === transactionId);
    }

    async canRefundTransaction(transaction) {
        // Check if transaction is completed
        if (transaction.status !== 'COMPLETED') {
            return {
                allowed: false,
                message: 'Only completed transactions can be refunded'
            };
        }
        
        // Check if within refund period (7 days)
        const transactionDate = new Date(transaction.createdAt);
        const now = new Date();
        const daysSince = (now - transactionDate) / (1000 * 60 * 60 * 24);
        
        if (daysSince > 7) {
            return {
                allowed: false,
                message: 'Refund period (7 days) has expired'
            };
        }
        
        // Check payment method supports refunds
        const refundableMethods = ['M-PESA', 'AIRTEL_MONEY', 'CREDIT_CARD', 'BANK_TRANSFER'];
        if (!refundableMethods.includes(transaction.method)) {
            return {
                allowed: false,
                message: 'Payment method does not support refunds'
            };
        }
        
        return {
            allowed: true,
            message: 'Refund allowed'
        };
    }

    createRefundTransaction(originalTransaction, refundData) {
        const refundId = 'REFUND-' + Date.now();
        
        const refund = {
            id: refundId,
            originalTransactionId: originalTransaction.id,
            userId: originalTransaction.userId,
            amount: refundData.amount || originalTransaction.amount,
            currency: originalTransaction.currency,
            method: originalTransaction.method,
            reason: refundData.reason,
            status: 'PROCESSING',
            createdAt: new Date().toISOString(),
            requestedBy: refundData.requestedBy || 'USER'
        };
        
        // Store refund
        const refunds = JSON.parse(localStorage.getItem('mpesewa_refunds') || '[]');
        refunds.push(refund);
        localStorage.setItem('mpesewa_refunds', JSON.stringify(refunds));
        
        return refund;
    }

    async processRefund(transaction, refundData) {
        // Simulated refund processing
        console.log(`Processing refund for transaction ${transaction.id}`);
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Mock refund success
        const success = Math.random() > 0.1; // 90% success
        
        if (success) {
            return {
                success: true,
                refundId: 'REFUND-' + Date.now(),
                amount: refundData.amount,
                processedAt: new Date().toISOString(),
                message: 'Refund processed successfully'
            };
        } else {
            return {
                success: false,
                message: 'Refund failed. Please contact support.'
            };
        }
    }

    async notifyRefund(refundTransaction) {
        const notification = {
            userId: refundTransaction.userId,
            type: 'REFUND_PROCESSED',
            title: 'Refund Processed',
            message: `Refund of ${refundTransaction.amount} ${refundTransaction.currency} has been processed.`,
            priority: 'MEDIUM',
            createdAt: new Date().toISOString(),
            data: {
                refundId: refundTransaction.id,
                amount: refundTransaction.amount,
                originalTransactionId: refundTransaction.originalTransactionId
            }
        };
        
        const notifications = JSON.parse(localStorage.getItem('mpesewa_notifications') || '[]');
        notifications.push(notification);
        localStorage.setItem('mpesewa_notifications', JSON.stringify(notifications));
    }

    createDispute(transaction, disputeData) {
        const disputeId = 'DISPUTE-' + Date.now();
        
        const dispute = {
            id: disputeId,
            transactionId: transaction.id,
            userId: transaction.userId,
            reason: disputeData.reason,
            description: disputeData.description,
            evidence: disputeData.evidence || [],
            status: 'OPEN',
            priority: disputeData.priority || 'MEDIUM',
            createdAt: new Date().toISOString(),
            assignedTo: null,
            resolution: null
        };
        
        // Store dispute
        const disputes = JSON.parse(localStorage.getItem('mpesewa_disputes') || '[]');
        disputes.push(dispute);
        localStorage.setItem('mpesewa_disputes', JSON.stringify(disputes));
        
        return dispute;
    }

    async notifyAdminOfDispute(dispute) {
        const admins = JSON.parse(localStorage.getItem('mpesewa_admins') || '[]');
        const notifications = JSON.parse(localStorage.getItem('mpesewa_notifications') || '[]');
        
        admins.forEach(admin => {
            if (admin.active) {
                const notification = {
                    userId: admin.userId,
                    type: 'NEW_DISPUTE',
                    title: 'New Payment Dispute',
                    message: `New dispute filed for transaction ${dispute.transactionId}`,
                    priority: 'HIGH',
                    createdAt: new Date().toISOString(),
                    data: {
                        disputeId: dispute.id,
                        transactionId: dispute.transactionId,
                        userId: dispute.userId,
                        reason: dispute.reason
                    },
                    actionUrl: `/admin/disputes/view.html?id=${dispute.id}`
                };
                
                notifications.push(notification);
            }
        });
        
        localStorage.setItem('mpesewa_notifications', JSON.stringify(notifications));
    }

    async getUserTransactions(userId) {
        const transactions = JSON.parse(localStorage.getItem('mpesewa_transactions') || '[]');
        return transactions.filter(t => t.userId === userId);
    }

    calculatePaymentTotals(transactions) {
        const totals = {
            completed: 0,
            failed: 0,
            pending: 0,
            refunded: 0,
            totalAmount: 0
        };
        
        transactions.forEach(transaction => {
            if (transaction.status === 'COMPLETED') {
                totals.completed++;
                totals.totalAmount += transaction.amount;
            } else if (transaction.status === 'FAILED') {
                totals.failed++;
            } else if (transaction.status === 'PENDING_CONFIRMATION') {
                totals.pending++;
            } else if (transaction.status === 'REFUNDED') {
                totals.refunded++;
            }
        });
        
        return totals;
    }

    // Public API methods
    getCurrentState() {
        return {
            state: this.currentState,
            transaction: this.transaction,
            paymentData: this.paymentData ? {
                type: this.paymentData.type,
                amount: this.paymentData.amount,
                method: this.paymentData.method
            } : null
        };
    }

    reset() {
        this.currentState = 'IDLE';
        this.paymentData = null;
        this.transaction = null;
        this.paymentMethod = null;
        this.amount = 0;
        this.currency = 'KSh';
    }

    async getPaymentMethods(country) {
        const countryMethods = {
            'Kenya': ['M-PESA', 'AIRTEL_MONEY', 'BANK_TRANSFER', 'CREDIT_CARD'],
            'Uganda': ['MTN_MONEY', 'AIRTEL_MONEY', 'BANK_TRANSFER'],
            'Tanzania': ['M-PESA', 'TIGO_PESA', 'AIRTEL_MONEY'],
            'Nigeria': ['BANK_TRANSFER', 'USSD', 'FLUTTERWAVE'],
            'Ghana': ['MTN_MOMO', 'VODAFONE_CASH', 'BANK_TRANSFER'],
            'South Africa': ['BANK_TRANSFER', 'CREDIT_CARD', 'SNAPSCAN'],
            'Rwanda': ['M-PESA', 'BANK_TRANSFER'],
            'Burundi': ['ECONET', 'BANK_TRANSFER'],
            'DRC': ['ORANGE_MONEY', 'BANK_TRANSFER'],
            'South Sudan': ['MPESA', 'BANK_TRANSFER'],
            'Ethiopia': ['TELEBIRR', 'BANK_TRANSFER']
        };
        
        return countryMethods[country] || ['M-PESA', 'BANK_TRANSFER', 'CREDIT_CARD'];
    }

    async calculatePaymentFee(amount, method, country) {
        // Fee structure
        const fees = {
            'M-PESA': {
                fee: Math.min(amount * 0.015, 70), // 1.5% max 70
                min: 0,
                max: 70000
            },
            'AIRTEL_MONEY': {
                fee: Math.min(amount * 0.015, 70),
                min: 0,
                max: 70000
            },
            'BANK_TRANSFER': {
                fee: Math.min(amount * 0.01, 100), // 1% max 100
                min: 10,
                max: 100000
            },
            'CREDIT_CARD': {
                fee: amount * 0.035, // 3.5%
                min: 5,
                max: 2000
            }
        };
        
        const methodFee = fees[method] || { fee: amount * 0.02, min: 0, max: 100 };
        const fee = Math.max(methodFee.min, Math.min(methodFee.fee, methodFee.max));
        
        return {
            amount: amount,
            fee: Math.round(fee),
            total: amount + Math.round(fee),
            currency: this.getCountryCurrency(country),
            breakdown: {
                principal: amount,
                fee: Math.round(fee),
                total: amount + Math.round(fee)
            }
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

    async getPaymentLimits(method, country) {
        const limits = {
            'M-PESA': {
                min: 10,
                max: 150000,
                daily: 300000
            },
            'AIRTEL_MONEY': {
                min: 10,
                max: 150000,
                daily: 300000
            },
            'BANK_TRANSFER': {
                min: 100,
                max: 1000000,
                daily: 5000000
            },
            'CREDIT_CARD': {
                min: 100,
                max: 500000,
                daily: 1000000
            }
        };
        
        return limits[method] || { min: 10, max: 100000, daily: 500000 };
    }

    async generatePaymentReport(userId, period) {
        const transactions = await this.getUserTransactions(userId);
        
        const now = new Date();
        let startDate;
        
        switch (period) {
            case 'DAILY':
                startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
                break;
            case 'WEEKLY':
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case 'MONTHLY':
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                break;
            case 'QUARTERLY':
                startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
                break;
            default:
                startDate = new Date(0);
        }
        
        const periodTransactions = transactions.filter(t => 
            new Date(t.createdAt) >= startDate
        );
        
        const byType = {};
        const byMethod = {};
        const byStatus = {};
        
        periodTransactions.forEach(transaction => {
            // Type breakdown
            byType[transaction.type] = (byType[transaction.type] || 0) + transaction.amount;
            
            // Method breakdown
            byMethod[transaction.method] = (byMethod[transaction.method] || 0) + transaction.amount;
            
            // Status breakdown
            byStatus[transaction.status] = (byStatus[transaction.status] || 0) + 1;
        });
        
        const totalAmount = periodTransactions.reduce((sum, t) => sum + t.amount, 0);
        const successful = periodTransactions.filter(t => t.status === 'COMPLETED').length;
        const failed = periodTransactions.filter(t => t.status === 'FAILED').length;
        
        return {
            period: period,
            startDate: startDate.toISOString(),
            endDate: now.toISOString(),
            summary: {
                totalTransactions: periodTransactions.length,
                totalAmount: totalAmount,
                successful: successful,
                failed: failed,
                successRate: periodTransactions.length > 0 ? 
                    (successful / periodTransactions.length) * 100 : 100
            },
            breakdown: {
                byType: byType,
                byMethod: byMethod,
                byStatus: byStatus
            },
            recentTransactions: periodTransactions
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 10)
                .map(t => ({
                    id: t.id,
                    type: t.type,
                    amount: t.amount,
                    method: t.method,
                    status: t.status,
                    date: t.createdAt
                }))
        };
    }
}

// Export singleton instance
const paymentFlow = new PaymentFlow();
export default paymentFlow;