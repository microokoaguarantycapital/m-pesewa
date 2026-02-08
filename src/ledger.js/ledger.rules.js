/**
 * M-PESEWA LEDGER RULES - POLICY-DRIVEN FINANCIAL LOGIC
 * 
 * Rules as code. No magic numbers. All calculations defined here.
 */

class LedgerRules {
    constructor() {
        // Core financial rules (NON-NEGOTIABLE)
        this.RULES = {
            INTEREST: {
                rate: 0.10, // 10%
                calculation: 'SIMPLE_INTEREST',
                appliesTo: 'PRINCIPAL',
                frequency: 'ONCE_PER_LOAN',
                maxRate: 0.10,
                description: '10% fixed interest on principal amount'
            },
            
            PENALTY: {
                rate: 0.05, // 5% daily
                calculation: 'DAILY_COMPOUNDING',
                appliesTo: 'OUTSTANDING_BALANCE',
                frequency: 'DAILY_AFTER_DUE',
                gracePeriodDays: 7,
                maxDailyRate: 0.05,
                description: '5% daily penalty on outstanding balance after 7 days grace period'
            },
            
            REPAYMENT: {
                periodDays: 7,
                allowsPartial: true,
                minPartialAmount: 0.01, // Smallest allowable repayment
                defaultPeriod: 7,
                maxExtensions: 0,
                description: '7-day repayment period with daily partial repayments allowed'
            },
            
            DEFAULT: {
                thresholdDays: 60, // 2 months
                action: 'AUTO_BLACKLIST',
                requiresAdminReview: true,
                notification: {
                    borrower: true,
                    lender: true,
                    groupAdmin: true,
                    platformAdmin: true
                },
                description: 'Loan defaults after 60 days (2 months), triggers blacklisting'
            },
            
            BLACKLIST: {
                triggers: ['DEFAULT'],
                removalRequires: ['FULL_REPAYMENT', 'ADMIN_APPROVAL'],
                effects: {
                    cannotBorrow: true,
                    cannotJoinNewGroups: true,
                    visibleToAll: true,
                    badgeDisplay: true
                },
                description: 'Blacklisted users cannot borrow or join new groups until cleared by admin'
            }
        };

        // Subscription tier rules
        this.SUBSCRIPTION_TIERS = {
            BASIC: {
                code: 'BASIC',
                name: 'Basic Lender',
                maxAmount: 1500,
                currency: 'KSh',
                subscriptionFees: {
                    monthly: 50,
                    biAnnual: 250,
                    annual: 500
                },
                features: {
                    crbCheck: false,
                    maxLedgers: 10,
                    maxBorrowers: 10,
                    support: 'BASIC'
                },
                description: 'Up to 1,500 per week, no CRB check'
            },
            
            PREMIUM: {
                code: 'PREMIUM',
                name: 'Premium Lender',
                maxAmount: 5000,
                currency: 'KSh',
                subscriptionFees: {
                    monthly: 250,
                    biAnnual: 1500,
                    annual: 2500
                },
                features: {
                    crbCheck: false,
                    maxLedgers: 50,
                    maxBorrowers: 50,
                    support: 'PRIORITY'
                },
                description: 'Up to 5,000 per week, no CRB check'
            },
            
            SUPER: {
                code: 'SUPER',
                name: 'Super Lender',
                maxAmount: 20000,
                currency: 'KSh',
                subscriptionFees: {
                    monthly: 1000,
                    biAnnual: 5000,
                    annual: 8500
                },
                features: {
                    crbCheck: true,
                    maxLedgers: 100,
                    maxBorrowers: 100,
                    support: 'VIP'
                },
                description: 'Up to 20,000 per week, CRB check required'
            },
            
            LENDER_OF_LENDERS: {
                code: 'LOL',
                name: 'Lender of Lenders',
                maxAmount: 50000,
                currency: 'KSh',
                subscriptionFees: {
                    monthly: 500,
                    biAnnual: 3500,
                    annual: 6500
                },
                features: {
                    crbCheck: true,
                    maxLedgers: 'UNLIMITED',
                    maxBorrowers: 'UNLIMITED',
                    support: 'EXECUTIVE',
                    customTerms: true
                },
                description: 'Up to 50,000, custom interest and repayment terms allowed'
            }
        };

        // Country-specific rules
        this.COUNTRY_RULES = {
            KE: { // Kenya
                currency: 'KSh',
                defaultSubscriptionTier: 'BASIC',
                legal: {
                    maxInterestRate: 0.10,
                    maxPenaltyRate: 0.05,
                    requiresCRB: ['SUPER', 'LENDER_OF_LENDERS'],
                    regulator: 'CBK'
                }
            },
            UG: { // Uganda
                currency: 'UGX',
                defaultSubscriptionTier: 'BASIC',
                legal: {
                    maxInterestRate: 0.10,
                    maxPenaltyRate: 0.05,
                    requiresCRB: ['SUPER', 'LENDER_OF_LENDERS'],
                    regulator: 'BOU'
                }
            },
            TZ: { // Tanzania
                currency: 'TZS',
                defaultSubscriptionTier: 'BASIC',
                legal: {
                    maxInterestRate: 0.10,
                    maxPenaltyRate: 0.05,
                    requiresCRB: ['SUPER', 'LENDER_OF_LENDERS'],
                    regulator: 'BOT'
                }
            },
            RW: { // Rwanda
                currency: 'RWF',
                defaultSubscriptionTier: 'BASIC',
                legal: {
                    maxInterestRate: 0.10,
                    maxPenaltyRate: 0.05,
                    requiresCRB: ['SUPER', 'LENDER_OF_LENDERS'],
                    regulator: 'BNR'
                }
            },
            BI: { // Burundi
                currency: 'BIF',
                defaultSubscriptionTier: 'BASIC',
                legal: {
                    maxInterestRate: 0.10,
                    maxPenaltyRate: 0.05,
                    requiresCRB: ['SUPER', 'LENDER_OF_LENDERS'],
                    regulator: 'BRB'
                }
            },
            CD: { // DRC
                currency: 'CDF',
                defaultSubscriptionTier: 'BASIC',
                legal: {
                    maxInterestRate: 0.10,
                    maxPenaltyRate: 0.05,
                    requiresCRB: ['SUPER', 'LENDER_OF_LENDERS'],
                    regulator: 'BCC'
                }
            },
            SS: { // South Sudan
                currency: 'SSP',
                defaultSubscriptionTier: 'BASIC',
                legal: {
                    maxInterestRate: 0.10,
                    maxPenaltyRate: 0.05,
                    requiresCRB: ['SUPER', 'LENDER_OF_LENDERS'],
                    regulator: 'BOS'
                }
            },
            ZA: { // South Africa
                currency: 'ZAR',
                defaultSubscriptionTier: 'BASIC',
                legal: {
                    maxInterestRate: 0.10,
                    maxPenaltyRate: 0.05,
                    requiresCRB: ['SUPER', 'LENDER_OF_LENDERS'],
                    regulator: 'SARB'
                }
            },
            NG: { // Nigeria
                currency: 'NGN',
                defaultSubscriptionTier: 'BASIC',
                legal: {
                    maxInterestRate: 0.10,
                    maxPenaltyRate: 0.05,
                    requiresCRB: ['SUPER', 'LENDER_OF_LENDERS'],
                    regulator: 'CBN'
                }
            },
            GH: { // Ghana
                currency: 'GHS',
                defaultSubscriptionTier: 'BASIC',
                legal: {
                    maxInterestRate: 0.10,
                    maxPenaltyRate: 0.05,
                    requiresCRB: ['SUPER', 'LENDER_OF_LENDERS'],
                    regulator: 'BOG'
                }
            },
            ET: { // Ethiopia
                currency: 'ETB',
                defaultSubscriptionTier: 'BASIC',
                legal: {
                    maxInterestRate: 0.10,
                    maxPenaltyRate: 0.05,
                    requiresCRB: ['SUPER', 'LENDER_OF_LENDERS'],
                    regulator: 'NBE'
                }
            },
            SO: { // Somalia
                currency: 'SOS',
                defaultSubscriptionTier: 'BASIC',
                legal: {
                    maxInterestRate: 0.10,
                    maxPenaltyRate: 0.05,
                    requiresCRB: ['SUPER', 'LENDER_OF_LENDERS'],
                    regulator: 'CBS'
                }
            }
        };

        // Emergency categories with specific rules
        this.EMERGENCY_CATEGORIES = {
            TRANSPORT_FARE: {
                code: 'TRANSPORT_FARE',
                name: 'M-pesewa Fare',
                maxAmount: 5000,
                typicalAmount: 500,
                description: 'Transport money when stranded',
                validation: {
                    requiresProof: false,
                    maxFrequency: 'DAILY',
                    priority: 'HIGH'
                }
            },
            MOBILE_DATA: {
                code: 'MOBILE_DATA',
                name: 'M-pesewa Data',
                maxAmount: 2000,
                typicalAmount: 300,
                description: 'Mobile data bundles',
                validation: {
                    requiresProof: false,
                    maxFrequency: 'WEEKLY',
                    priority: 'MEDIUM'
                }
            },
            COOKING_GAS: {
                code: 'COOKING_GAS',
                name: 'M-pesewa Cooking Gas',
                maxAmount: 5000,
                typicalAmount: 1500,
                description: 'Cooking gas refill',
                validation: {
                    requiresProof: true,
                    maxFrequency: 'MONTHLY',
                    priority: 'HIGH'
                }
            },
            FOOD: {
                code: 'FOOD',
                name: 'M-pesewa Food',
                maxAmount: 3000,
                typicalAmount: 1000,
                description: 'Emergency food money',
                validation: {
                    requiresProof: false,
                    maxFrequency: 'DAILY',
                    priority: 'CRITICAL'
                }
            },
            // ... other categories as specified
        };
    }

    /**
     * CALCULATE INTEREST
     */
    calculateInterest(principal, interestRate = null) {
        const rate = interestRate || this.RULES.INTEREST.rate;
        return principal * rate;
    }

    /**
     * CALCULATE DAILY PENALTY
     */
    calculateDailyPenalty(outstandingBalance, penaltyRate = null) {
        const rate = penaltyRate || this.RULES.PENALTY.rate;
        return outstandingBalance * rate;
    }

    /**
     * CALCULATE TOTAL OWED AFTER DAYS
     */
    calculateTotalOwed(params) {
        const {
            principal,
            daysSinceDisbursement,
            interestRate = null,
            penaltyRate = null,
            partialRepayments = []
        } = params;

        // Base interest
        const interest = this.calculateInterest(principal, interestRate);
        let total = principal + interest;

        // Apply penalties after 7 days
        if (daysSinceDisbursement > this.RULES.REPAYMENT.periodDays) {
            const overdueDays = daysSinceDisbursement - this.RULES.REPAYMENT.periodDays;
            
            for (let i = 1; i <= overdueDays; i++) {
                const penalty = this.calculateDailyPenalty(total, penaltyRate);
                total += penalty;
            }
        }

        // Subtract partial repayments
        const totalRepayments = partialRepayments.reduce((sum, repayment) => sum + repayment, 0);
        total -= totalRepayments;

        return Math.max(0, total); // Can't be negative
    }

    /**
     * VALIDATE LOAN REQUEST AGAINST RULES
     */
    validateLoanRequest(params) {
        const {
            borrowerId,
            lenderId,
            amount,
            category,
            countryCode,
            lenderSubscriptionTier,
            borrowerRating,
            borrowerBlacklisted,
            borrowerActiveLoans,
            borrowerGroupCount
        } = params;

        const violations = [];
        const warnings = [];

        // 1. Check blacklist
        if (borrowerBlacklisted) {
            violations.push({
                code: 'RULE_BLACKLIST_001',
                severity: 'BLOCK',
                message: 'Borrower is blacklisted',
                rule: this.RULES.BLACKLIST
            });
        }

        // 2. Check borrower rating
        if (borrowerRating < 3.0) {
            warnings.push({
                code: 'RULE_RATING_001',
                severity: 'WARNING',
                message: `Borrower rating low: ${borrowerRating}/5`,
                threshold: 3.0
            });
        }

        // 3. Check borrower group count (max 4)
        if (borrowerGroupCount >= 4) {
            violations.push({
                code: 'RULE_GROUP_LIMIT_001',
                severity: 'BLOCK',
                message: `Borrower already in ${borrowerGroupCount} groups (max 4)`,
                rule: 'Maximum 4 groups per borrower'
            });
        }

        // 4. Check subscription tier limits
        const tier = this.SUBSCRIPTION_TIERS[lenderSubscriptionTier];
        if (tier && amount > tier.maxAmount) {
            violations.push({
                code: 'RULE_SUBSCRIPTION_001',
                severity: 'BLOCK',
                message: `Amount ${amount} exceeds ${tier.name} limit of ${tier.maxAmount}`,
                limit: tier.maxAmount,
                actual: amount
            });
        }

        // 5. Check category limits
        const categoryRules = this.EMERGENCY_CATEGORIES[category];
        if (categoryRules && amount > categoryRules.maxAmount) {
            warnings.push({
                code: 'RULE_CATEGORY_001',
                severity: 'WARNING',
                message: `Amount exceeds typical ${categoryRules.name} amount`,
                typical: categoryRules.typicalAmount,
                max: categoryRules.maxAmount
            });
        }

        // 6. Check country-specific rules
        const countryRule = this.COUNTRY_RULES[countryCode];
        if (countryRule) {
            // Check if lender tier requires CRB for this country
            if (countryRule.legal.requiresCRB.includes(lenderSubscriptionTier)) {
                warnings.push({
                    code: 'RULE_COUNTRY_001',
                    severity: 'INFO',
                    message: `${lenderSubscriptionTier} tier requires CRB check in ${countryCode}`,
                    regulator: countryRule.legal.regulator
                });
            }
        }

        // 7. Check active loans (one active loan per group at a time)
        if (borrowerActiveLoans > 0) {
            violations.push({
                code: 'RULE_ACTIVE_LOANS_001',
                severity: 'BLOCK',
                message: 'Borrower already has an active loan in this group',
                rule: 'One active loan per group at a time'
            });
        }

        return {
            valid: violations.length === 0,
            violations,
            warnings,
            summary: {
                totalChecks: 7,
                passed: 7 - violations.length - warnings.length,
                violations: violations.length,
                warnings: warnings.length,
                canProceed: violations.length === 0
            }
        };
    }

    /**
     * CALCULATE REPAYMENT SCHEDULE
     */
    generateRepaymentSchedule(params) {
        const {
            principal,
            interestRate,
            repaymentPeriodDays,
            startDate,
            allowPartial = true
        } = params;

        const schedule = [];
        const interest = principal * interestRate;
        const totalAmount = principal + interest;
        const dailyAmount = totalAmount / repaymentPeriodDays;

        for (let day = 1; day <= repaymentPeriodDays; day++) {
            const dueDate = new Date(startDate);
            dueDate.setDate(dueDate.getDate() + day);

            const entry = {
                day,
                dueDate: dueDate.toISOString().split('T')[0],
                amountDue: dailyAmount,
                cumulativeDue: dailyAmount * day,
                status: 'PENDING',
                isOverdue: false,
                penaltyApplies: day > repaymentPeriodDays,
                breakdown: {
                    principal: principal / repaymentPeriodDays,
                    interest: interest / repaymentPeriodDays,
                    total: dailyAmount
                }
            };

            // Mark as overdue if past today
            if (dueDate < new Date()) {
                entry.status = 'OVERDUE';
                entry.isOverdue = true;
                
                if (day > repaymentPeriodDays) {
                    entry.penaltyAmount = this.calculateDailyPenalty(
                        totalAmount - (dailyAmount * (day - repaymentPeriodDays)),
                        this.RULES.PENALTY.rate
                    );
                }
            }

            schedule.push(entry);
        }

        return schedule;
    }

    /**
     * CALCULATE DEFAULT STATUS
     */
    checkDefaultStatus(params) {
        const {
            disbursementDate,
            currentStatus,
            lastRepaymentDate,
            outstandingBalance
        } = params;

        const now = new Date();
        const daysSinceDisbursement = Math.floor(
            (now - new Date(disbursementDate)) / (1000 * 60 * 60 * 24)
        );

        if (daysSinceDisbursement >= this.RULES.DEFAULT.thresholdDays) {
            return {
                isDefault: true,
                daysInDefault: daysSinceDisbursement - this.RULES.DEFAULT.thresholdDays,
                action: this.RULES.DEFAULT.action,
                requiresReview: this.RULES.DEFAULT.requiresAdminReview,
                notifications: this.RULES.DEFAULT.notification
            };
        }

        return {
            isDefault: false,
            daysToDefault: this.RULES.DEFAULT.thresholdDays - daysSinceDisbursement,
            action: 'MONITOR',
            requiresReview: false
        };
    }

    /**
     * VALIDATE PARTIAL REPAYMENT
     */
    validatePartialRepayment(params) {
        const {
            amount,
            outstandingBalance,
            minPartialAmount = this.RULES.REPAYMENT.minPartialAmount
        } = params;

        if (amount < minPartialAmount) {
            return {
                valid: false,
                reason: `Amount below minimum partial repayment of ${minPartialAmount}`,
                code: 'REPAYMENT_001'
            };
        }

        if (amount > outstandingBalance) {
            return {
                valid: false,
                reason: `Amount exceeds outstanding balance of ${outstandingBalance}`,
                code: 'REPAYMENT_002',
                suggestedAmount: outstandingBalance
            };
        }

        return {
            valid: true,
            reason: 'Partial repayment valid',
            remainingBalance: outstandingBalance - amount,
            isFullRepayment: Math.abs(amount - outstandingBalance) < 0.01
        };
    }

    /**
     * CALCULATE BORROWER RATING UPDATE
     */
    calculateNewRating(params) {
        const {
            currentRating,
            totalRatings,
            newRating,
            repaymentTimeliness, // -1 (late) to 1 (early)
            loanAmount,
            loanCategory,
            historicalDefault
        } = params;

        // Weight factors
        const weights = {
            newRating: 0.3,
            repaymentTimeliness: 0.4,
            historicalPerformance: 0.2,
            amountFactor: 0.1
        };

        // Base calculation
        let newScore = currentRating;

        // Adjust for new rating
        if (newRating) {
            newScore = (currentRating * totalRatings + newRating) / (totalRatings + 1);
        }

        // Adjust for repayment timeliness
        if (repaymentTimeliness > 0) {
            newScore += 0.1 * repaymentTimeliness;
        } else if (repaymentTimeliness < 0) {
            newScore -= 0.05 * Math.abs(repaymentTimeliness);
        }

        // Penalize historical defaults
        if (historicalDefault) {
            newScore *= 0.8; // 20% penalty for defaults
        }

        // Cap between 1 and 5
        newScore = Math.max(1, Math.min(5, newScore));

        return {
            newRating: parseFloat(newScore.toFixed(2)),
            change: parseFloat((newScore - currentRating).toFixed(2)),
            factors: {
                base: currentRating,
                newRatingImpact: newRating ? weights.newRating : 0,
                timelinessImpact: repaymentTimeliness,
                defaultPenalty: historicalDefault ? 0.2 : 0
            }
        };
    }

    /**
     * CHECK SUBSCRIPTION EXPIRY
     */
    checkSubscriptionExpiry(subscriptionDate, tier) {
        const now = new Date();
        const subDate = new Date(subscriptionDate);
        
        // Subscription expires on 28th of each month
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        const expiryDate = new Date(currentYear, currentMonth, 28);
        
        const daysRemaining = Math.floor((expiryDate - now) / (1000 * 60 * 60 * 24));
        const isExpired = now > expiryDate;
        
        const tierInfo = this.SUBSCRIPTION_TIERS[tier] || {};
        
        return {
            isExpired,
            expiryDate: expiryDate.toISOString().split('T')[0],
            daysRemaining: isExpired ? 0 : Math.max(0, daysRemaining),
            tier: tierInfo.name || tier,
            limits: tierInfo.maxAmount || 0,
            actionRequired: isExpired ? 'RENEW_SUBSCRIPTION' : 'MONITOR'
        };
    }

    /**
     * GENERATE LEDGER SUMMARY
     */
    generateLedgerSummary(params) {
        const {
            principal,
            disbursementDate,
            dueDate,
            repayments = [],
            interestRate = this.RULES.INTEREST.rate,
            penaltyRate = this.RULES.PENALTY.rate
        } = params;

        const now = new Date();
        const disbursement = new Date(disbursementDate);
        const due = new Date(dueDate);
        
        const daysSinceDisbursement = Math.floor((now - disbursement) / (1000 * 60 * 60 * 24));
        const daysSinceDue = Math.floor((now - due) / (1000 * 60 * 60 * 24));
        
        // Calculate amounts
        const interest = principal * interestRate;
        let penalties = 0;
        
        if (daysSinceDue > 0) {
            // Penalties apply on outstanding balance after due date
            const outstandingAfterInterest = principal + interest;
            const totalRepayments = repayments.reduce((sum, r) => sum + r.amount, 0);
            let outstanding = outstandingAfterInterest - totalRepayments;
            
            for (let i = 1; i <= daysSinceDue; i++) {
                const dailyPenalty = outstanding * penaltyRate;
                penalties += dailyPenalty;
                outstanding += dailyPenalty; // Penalty compounds daily
            }
        }
        
        const totalOwed = principal + interest + penalties;
        const totalRepayments = repayments.reduce((sum, r) => sum + r.amount, 0);
        const outstandingBalance = Math.max(0, totalOwed - totalRepayments);
        
        // Determine status
        let status = 'ACTIVE';
        if (outstandingBalance === 0) {
            status = 'CLEARED';
        } else if (daysSinceDue > 0) {
            status = 'OVERDUE';
            if (daysSinceDisbursement >= this.RULES.DEFAULT.thresholdDays) {
                status = 'DEFAULTED';
            }
        }
        
        return {
            summary: {
                principal,
                interest,
                penalties,
                totalOwed,
                totalRepayments,
                outstandingBalance,
                percentageRepaid: totalRepayments / totalOwed * 100
            },
            dates: {
                disbursementDate: disbursement.toISOString().split('T')[0],
                dueDate: due.toISOString().split('T')[0],
                daysSinceDisbursement,
                daysSinceDue: Math.max(0, daysSinceDue),
                daysToDefault: Math.max(0, this.RULES.DEFAULT.thresholdDays - daysSinceDisbursement)
            },
            status: {
                current: status,
                isOverdue: daysSinceDue > 0,
                isDefault: daysSinceDisbursement >= this.RULES.DEFAULT.thresholdDays,
                isCleared: outstandingBalance === 0
            },
            breakdown: {
                daily: this.generateDailyBreakdown({
                    principal,
                    interestRate,
                    penaltyRate,
                    disbursementDate,
                    repayments,
                    days: daysSinceDisbursement
                })
            }
        };
    }

    /**
     * GENERATE DAILY BREAKDOWN
     */
    generateDailyBreakdown(params) {
        const {
            principal,
            interestRate,
            penaltyRate,
            disbursementDate,
            repayments,
            days
        } = params;
        
        const disbursement = new Date(disbursementDate);
        const breakdown = [];
        let runningBalance = principal;
        let totalInterest = 0;
        let totalPenalties = 0;
        
        for (let i = 0; i <= days; i++) {
            const currentDate = new Date(disbursement);
            currentDate.setDate(currentDate.getDate() + i);
            
            // Apply interest on day 0 (disbursement)
            let interestToday = 0;
            let penaltyToday = 0;
            let repaymentToday = 0;
            
            if (i === 0) {
                interestToday = principal * interestRate;
                totalInterest += interestToday;
                runningBalance += interestToday;
            }
            
            // Apply penalties after day 7
            if (i > 7) {
                penaltyToday = runningBalance * penaltyRate;
                totalPenalties += penaltyToday;
                runningBalance += penaltyToday;
            }
            
            // Apply repayments if any for this day
            const dayRepayments = repayments.filter(r => {
                const repayDate = new Date(r.date);
                return repayDate.toDateString() === currentDate.toDateString();
            });
            
            if (dayRepayments.length > 0) {
                repaymentToday = dayRepayments.reduce((sum, r) => sum + r.amount, 0);
                runningBalance = Math.max(0, runningBalance - repaymentToday);
            }
            
            breakdown.push({
                day: i + 1,
                date: currentDate.toISOString().split('T')[0],
                isOverdue: i >= 7,
                isDefault: i >= this.RULES.DEFAULT.thresholdDays,
                interest: interestToday,
                penalty: penaltyToday,
                repayment: repaymentToday,
                runningBalance: parseFloat(runningBalance.toFixed(2)),
                events: dayRepayments.map(r => ({
                    type: 'REPAYMENT',
                    amount: r.amount,
                    description: r.description
                }))
            });
        }
        
        return breakdown;
    }

    /**
     * GET RULE BY CODE
     */
    getRule(ruleCode) {
        const ruleMap = {
            'INTEREST': this.RULES.INTEREST,
            'PENALTY': this.RULES.PENALTY,
            'REPAYMENT': this.RULES.REPAYMENT,
            'DEFAULT': this.RULES.DEFAULT,
            'BLACKLIST': this.RULES.BLACKLIST
        };
        
        return ruleMap[ruleCode] || null;
    }

    /**
     * GET COUNTRY RULES
     */
    getCountryRules(countryCode) {
        return this.COUNTRY_RULES[countryCode] || this.COUNTRY_RULES.KE;
    }

    /**
     * GET TIER RULES
     */
    getTierRules(tierCode) {
        return this.SUBSCRIPTION_TIERS[tierCode] || this.SUBSCRIPTION_TIERS.BASIC;
    }

    /**
     * VALIDATE AGAINST ALL RULES
     */
    validateAgainstAllRules(context) {
        const validations = [];
        
        // Interest rule validation
        if (context.interestRate > this.RULES.INTEREST.maxRate) {
            validations.push({
                rule: 'INTEREST',
                valid: false,
                message: `Interest rate ${context.interestRate} exceeds maximum ${this.RULES.INTEREST.maxRate}`,
                severity: 'BLOCK'
            });
        }
        
        // Penalty rule validation
        if (context.penaltyRate > this.RULES.PENALTY.maxDailyRate) {
            validations.push({
                rule: 'PENALTY',
                valid: false,
                message: `Penalty rate ${context.penaltyRate} exceeds maximum ${this.RULES.PENALTY.maxDailyRate}`,
                severity: 'BLOCK'
            });
        }
        
        // Repayment period validation
        if (context.repaymentPeriodDays > this.RULES.REPAYMENT.maxExtensions) {
            validations.push({
                rule: 'REPAYMENT',
                valid: false,
                message: `Repayment period ${context.repaymentPeriodDays} days exceeds maximum`,
                severity: 'WARNING'
            });
        }
        
        // Country-specific validation
        const countryRules = this.getCountryRules(context.countryCode);
        if (context.interestRate > countryRules.legal.maxInterestRate) {
            validations.push({
                rule: 'COUNTRY_INTEREST',
                valid: false,
                message: `Interest rate violates ${countryRules.legal.regulator} regulations`,
                severity: 'BLOCK'
            });
        }
        
        return {
            allValid: validations.every(v => v.valid !== false),
            validations,
            summary: {
                totalRules: 4,
                passed: validations.filter(v => v.valid !== false).length,
                failed: validations.filter(v => v.valid === false).length,
                warnings: validations.filter(v => v.severity === 'WARNING').length
            }
        };
    }
}

// Export singleton instance
const ledgerRules = new LedgerRules();
export default ledgerRules;