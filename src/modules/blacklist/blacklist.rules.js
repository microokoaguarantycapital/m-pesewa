/**
 * M-PESEWA BLACKLIST RULES ENGINE
 * Defines strict rules for blacklisting users
 * Enforces country-specific blacklist isolation
 */

class BlacklistRules {
    constructor() {
        this.rules = {
            // Default threshold: 60 days overdue with any arrears
            DEFAULT_THRESHOLD_DAYS: 60,
            
            // Minimum amount for blacklisting (prevents small amount blacklisting)
            MINIMUM_DEFAULT_AMOUNT: 0.01, // Any amount > 0
            
            // Blacklist propagation rules
            PROPAGATION: {
                WITHIN_COUNTRY: 'GLOBAL', // Blacklisted in one group = blacklisted in all groups in same country
                ACROSS_COUNTRIES: 'ISOLATED', // Blacklist does not propagate across countries
                ACROSS_ROLES: 'FULL', // Blacklisted as borrower = cannot lend either
            },
            
            // Automatic blacklist triggers
            TRIGGERS: [
                {
                    name: 'DEFAULT_60_DAYS',
                    condition: 'days_overdue > 60 && amount_owed > 0',
                    action: 'AUTO_BLACKLIST',
                    severity: 'HIGH'
                },
                {
                    name: 'MULTIPLE_DEFAULTS',
                    condition: 'default_count >= 3',
                    action: 'AUTO_BLACKLIST',
                    severity: 'HIGH'
                },
                {
                    name: 'FRAUD_INDICATION',
                    condition: 'fraud_flag == true',
                    action: 'MANUAL_REVIEW',
                    severity: 'CRITICAL'
                }
            ],
            
            // Blacklist restrictions
            RESTRICTIONS: {
                BORROWING: {
                    allowed: false,
                    message: 'User is blacklisted and cannot borrow'
                },
                LENDING: {
                    allowed: false,
                    message: 'User is blacklisted and cannot lend'
                },
                GROUP_JOINING: {
                    allowed: false,
                    message: 'User is blacklisted and cannot join new groups'
                },
                GROUP_CREATION: {
                    allowed: false,
                    message: 'User is blacklisted and cannot create groups'
                },
                PROFILE_VISIBILITY: {
                    level: 'REDUCED',
                    message: 'Blacklist badge visible to all group members'
                }
            },
            
            // Removal conditions (ALL must be met)
            REMOVAL_CONDITIONS: {
                FULL_REPAYMENT: {
                    required: true,
                    components: ['principal', 'interest_10_percent', 'penalties'],
                    verification: 'MANUAL_ADMIN_VERIFICATION'
                },
                ADMIN_APPROVAL: {
                    required: true,
                    min_admin_level: 2,
                    dual_approval: false // Future enhancement
                },
                WAITING_PERIOD: {
                    required: false,
                    days: 0 // Immediate after conditions met
                },
                APPEAL_PROCESS: {
                    required: true,
                    steps: ['submit_appeal', 'admin_review', 'approval']
                }
            },
            
            // Evidence requirements for blacklisting
            EVIDENCE_REQUIREMENTS: {
                MINIMUM_EVIDENCE: [
                    'loan_agreement_details',
                    'repayment_history',
                    'default_amount',
                    'days_overdue',
                    'communication_log'
                ],
                AUDIT_TRAIL: {
                    required: true,
                    fields: ['timestamp', 'action', 'performed_by', 'reason']
                }
            },
            
            // Country-specific rule variations
            COUNTRY_VARIATIONS: {
                KE: { // Kenya
                    currency: 'KSh',
                    legal_framework: 'Kenyan Law',
                    additional_requirements: []
                },
                UG: { // Uganda
                    currency: 'UGX',
                    legal_framework: 'Ugandan Law',
                    additional_requirements: []
                },
                TZ: { // Tanzania
                    currency: 'TZS',
                    legal_framework: 'Tanzanian Law',
                    additional_requirements: []
                },
                RW: { // Rwanda
                    currency: 'RWF',
                    legal_framework: 'Rwandan Law',
                    additional_requirements: []
                },
                BI: { // Burundi
                    currency: 'BIF',
                    legal_framework: 'Burundian Law',
                    additional_requirements: []
                },
                CD: { // DRC
                    currency: 'CDF',
                    legal_framework: 'Congolese Law',
                    additional_requirements: []
                },
                SS: { // South Sudan
                    currency: 'SSP',
                    legal_framework: 'South Sudanese Law',
                    additional_requirements: []
                },
                ZA: { // South Africa
                    currency: 'ZAR',
                    legal_framework: 'South African Law',
                    additional_requirements: []
                },
                NG: { // Nigeria
                    currency: 'NGN',
                    legal_framework: 'Nigerian Law',
                    additional_requirements: []
                },
                GH: { // Ghana
                    currency: 'GHS',
                    legal_framework: 'Ghanaian Law',
                    additional_requirements: []
                },
                ET: { // Ethiopia
                    currency: 'ETB',
                    legal_framework: 'Ethiopian Law',
                    additional_requirements: []
                }
            },
            
            // Rating impact
            RATING_IMPACT: {
                BLACKLISTED: {
                    borrower_rating: 1, // Minimum rating
                    lender_rating: 1,
                    recovery_period_months: 12
                },
                AFTER_REMOVAL: {
                    max_rating_cap: 3, // Cannot exceed 3 stars for 6 months
                    duration_months: 6
                }
            }
        };
    }

    /**
     * Evaluate if user should be blacklisted based on loan data
     * @param {Object} loanData - Loan information
     * @param {string} countryCode - Country code
     * @returns {Object} - Evaluation result
     */
    evaluateBlacklistCondition(loanData, countryCode) {
        const evaluation = {
            shouldBlacklist: false,
            trigger: null,
            reason: '',
            severity: 'LOW',
            requiredEvidence: []
        };

        const daysOverdue = this.calculateDaysOverdue(loanData.dueDate);
        const amountOwed = loanData.amountOwed || 0;

        // Check each trigger condition
        for (const trigger of this.rules.TRIGGERS) {
            let conditionMet = false;

            switch (trigger.name) {
                case 'DEFAULT_60_DAYS':
                    conditionMet = daysOverdue > this.rules.DEFAULT_THRESHOLD_DAYS && 
                                   amountOwed >= this.rules.MINIMUM_DEFAULT_AMOUNT;
                    if (conditionMet) {
                        evaluation.shouldBlacklist = true;
                        evaluation.trigger = trigger;
                        evaluation.reason = `Loan default: ${daysOverdue} days overdue, Amount owed: ${amountOwed}`;
                        evaluation.severity = trigger.severity;
                        evaluation.requiredEvidence = this.getRequiredEvidence(trigger);
                    }
                    break;

                case 'MULTIPLE_DEFAULTS':
                    const defaultCount = loanData.defaultHistory?.length || 0;
                    conditionMet = defaultCount >= 3;
                    if (conditionMet) {
                        evaluation.shouldBlacklist = true;
                        evaluation.trigger = trigger;
                        evaluation.reason = `Multiple defaults: ${defaultCount} previous defaults`;
                        evaluation.severity = trigger.severity;
                        evaluation.requiredEvidence = this.getRequiredEvidence(trigger);
                    }
                    break;

                case 'FRAUD_INDICATION':
                    conditionMet = loanData.fraudFlag === true;
                    if (conditionMet) {
                        evaluation.shouldBlacklist = false; // Manual review required
                        evaluation.trigger = trigger;
                        evaluation.reason = 'Potential fraud detected - requires manual review';
                        evaluation.severity = trigger.severity;
                        evaluation.requiredEvidence = this.getRequiredEvidence(trigger);
                    }
                    break;
            }

            if (conditionMet) break; // Stop at first matched trigger
        }

        // Add country-specific requirements
        const countryRules = this.rules.COUNTRY_VARIATIONS[countryCode];
        if (countryRules) {
            evaluation.countrySpecific = countryRules;
        }

        return evaluation;
    }

    /**
     * Calculate days overdue
     * @param {string} dueDate - Due date string
     * @returns {number} - Days overdue
     */
    calculateDaysOverdue(dueDate) {
        const due = new Date(dueDate);
        const now = new Date();
        const diffTime = now - due;
        return Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
    }

    /**
     * Get required evidence for a trigger
     * @param {Object} trigger - Trigger object
     * @returns {Array} - Required evidence list
     */
    getRequiredEvidence(trigger) {
        const baseEvidence = this.rules.EVIDENCE_REQUIREMENTS.MINIMUM_EVIDENCE;
        
        switch (trigger.name) {
            case 'DEFAULT_60_DAYS':
                return [...baseEvidence, 'overdue_calculation', 'payment_reminders'];
            case 'MULTIPLE_DEFAULTS':
                return [...baseEvidence, 'default_history', 'previous_warnings'];
            case 'FRAUD_INDICATION':
                return [...baseEvidence, 'fraud_evidence', 'investigation_report', 'user_response'];
            default:
                return baseEvidence;
        }
    }

    /**
     * Check if user meets blacklist removal conditions
     * @param {Object} repaymentData - Repayment information
     * @param {Object} blacklistRecord - Blacklist record
     * @returns {Object} - Removal eligibility
     */
    checkRemovalEligibility(repaymentData, blacklistRecord) {
        const eligibility = {
            eligible: false,
            unmetConditions: [],
            requiredAmount: 0,
            paidAmount: 0,
            outstandingAmount: 0
        };

        const removalConditions = this.rules.REMOVAL_CONDITIONS;

        // Check FULL_REPAYMENT condition
        if (removalConditions.FULL_REPAYMENT.required) {
            const requiredComponents = removalConditions.FULL_REPAYMENT.components;
            let totalRequired = 0;
            let totalPaid = 0;

            // Calculate required amount
            requiredComponents.forEach(component => {
                switch (component) {
                    case 'principal':
                        totalRequired += blacklistRecord.defaultAmount || 0;
                        break;
                    case 'interest_10_percent':
                        totalRequired += (blacklistRecord.defaultAmount || 0) * 0.10;
                        break;
                    case 'penalties':
                        // Calculate penalties based on days overdue
                        const daysOverdue = this.calculateDaysOverdue(blacklistRecord.loanDueDate || new Date());
                        const dailyPenaltyRate = 0.05; // 5% daily after day 7
                        const penaltyDays = Math.max(0, daysOverdue - 7);
                        totalRequired += (blacklistRecord.defaultAmount || 0) * dailyPenaltyRate * penaltyDays;
                        break;
                }
            });

            eligibility.requiredAmount = totalRequired;
            eligibility.paidAmount = repaymentData.totalPaid || 0;
            eligibility.outstandingAmount = Math.max(0, totalRequired - (repaymentData.totalPaid || 0));

            if (eligibility.outstandingAmount > 0) {
                eligibility.unmetConditions.push({
                    condition: 'FULL_REPAYMENT',
                    message: `Outstanding amount: ${eligibility.outstandingAmount}`,
                    required: totalRequired,
                    paid: repaymentData.totalPaid || 0
                });
            }
        }

        // Check ADMIN_APPROVAL condition (simulated)
        if (removalConditions.ADMIN_APPROVAL.required) {
            // This would check admin permissions in real implementation
            eligibility.adminApprovalRequired = true;
            eligibility.minAdminLevel = removalConditions.ADMIN_APPROVAL.min_admin_level;
        }

        // Check WAITING_PERIOD condition
        if (removalConditions.WAITING_PERIOD.required && removalConditions.WAITING_PERIOD.days > 0) {
            const blacklistDate = new Date(blacklistRecord.appliedAt);
            const now = new Date();
            const daysBlacklisted = Math.floor((now - blacklistDate) / (1000 * 60 * 60 * 24));
            
            if (daysBlacklisted < removalConditions.WAITING_PERIOD.days) {
                eligibility.unmetConditions.push({
                    condition: 'WAITING_PERIOD',
                    message: `Minimum waiting period: ${removalConditions.WAITING_PERIOD.days} days`,
                    daysServed: daysBlacklisted,
                    daysRemaining: removalConditions.WAITING_PERIOD.days - daysBlacklisted
                });
            }
        }

        // Check APPEAL_PROCESS condition
        if (removalConditions.APPEAL_PROCESS.required) {
            const appealStatus = blacklistRecord.appealStatus || 'NOT_SUBMITTED';
            if (appealStatus !== 'APPROVED') {
                eligibility.unmetConditions.push({
                    condition: 'APPEAL_PROCESS',
                    message: `Appeal status: ${appealStatus}. Required: APPROVED`,
                    requiredSteps: removalConditions.APPEAL_PROCESS.steps
                });
            }
        }

        // Determine overall eligibility
        eligibility.eligible = eligibility.unmetConditions.length === 0 && 
                              (eligibility.outstandingAmount <= 0);

        return eligibility;
    }

    /**
     * Get restrictions for blacklisted user
     * @param {string} userRole - User role (borrower/lender)
     * @returns {Object} - Restrictions object
     */
    getUserRestrictions(userRole) {
        const restrictions = {
            general: this.rules.RESTRICTIONS,
            roleSpecific: {}
        };

        switch (userRole) {
            case 'BORROWER':
                restrictions.roleSpecific = {
                    canBorrow: false,
                    maxGroups: 0,
                    canRequestLoan: false,
                    visibility: 'REDUCED_WITH_BADGE'
                };
                break;
            case 'LENDER':
                restrictions.roleSpecific = {
                    canLend: false,
                    subscriptionActive: false,
                    ledgerCreation: false,
                    canRateBorrowers: false
                };
                break;
            case 'BOTH':
                restrictions.roleSpecific = {
                    canBorrow: false,
                    canLend: false,
                    maxGroups: 0,
                    allRolesBlocked: true
                };
                break;
        }

        return restrictions;
    }

    /**
     * Get blacklist badge configuration
     * @param {Object} blacklistRecord - Blacklist record
     * @returns {Object} - Badge configuration
     */
    getBadgeConfiguration(blacklistRecord) {
        const daysOverdue = this.calculateDaysOverdue(blacklistRecord.loanDueDate || blacklistRecord.appliedAt);
        
        let badgeLevel = 'WARNING';
        if (daysOverdue > 90) badgeLevel = 'CRITICAL';
        else if (daysOverdue > 60) badgeLevel = 'SEVERE';

        return {
            text: `BLACKLISTED: ${blacklistRecord.defaultAmount} overdue ${daysOverdue} days`,
            color: badgeLevel === 'CRITICAL' ? '#dc2626' : 
                   badgeLevel === 'SEVERE' ? '#ea580c' : '#d97706',
            icon: '🚫',
            tooltip: `Blacklisted since ${new Date(blacklistRecord.appliedAt).toLocaleDateString()}`,
            visibleTo: ['GROUP_MEMBERS', 'LENDERS', 'ADMINS'],
            priority: 1 // Highest priority badge
        };
    }

    /**
     * Validate blacklist action
     * @param {Object} actionData - Action data
     * @param {string} performerRole - Performer role
     * @returns {Object} - Validation result
     */
    validateBlacklistAction(actionData, performerRole) {
        const validation = {
            valid: false,
            errors: [],
            warnings: []
        };

        // Check required fields
        const requiredFields = ['userId', 'countryCode', 'reason'];
        for (const field of requiredFields) {
            if (!actionData[field]) {
                validation.errors.push(`Missing required field: ${field}`);
            }
        }

        // Check performer permissions
        if (performerRole !== 'ADMIN' && actionData.actionType === 'MANUAL_BLACKLIST') {
            validation.errors.push('Only admins can manually blacklist users');
        }

        // Check evidence
        if (!actionData.evidence || Object.keys(actionData.evidence).length === 0) {
            validation.errors.push('Evidence is required for blacklisting');
        }

        // Check if user already blacklisted (warning)
        if (actionData.existingBlacklist) {
            validation.warnings.push('User may already be blacklisted');
        }

        validation.valid = validation.errors.length === 0;
        return validation;
    }

    /**
     * Get country-specific rules
     * @param {string} countryCode - Country code
     * @returns {Object} - Country rules
     */
    getCountryRules(countryCode) {
        return this.rules.COUNTRY_VARIATIONS[countryCode] || {};
    }

    /**
     * Get all rules as JSON (for debugging/auditing)
     * @returns {Object} - All rules
     */
    getAllRules() {
        return JSON.parse(JSON.stringify(this.rules));
    }
}

// Export the rules engine
export default BlacklistRules;