/**
 * M-PESEWA LEDGER STATE MACHINE - PREDICTABLE STATE TRANSITIONS
 * 
 * States move by rules, not by whim. No free movement.
 */

class LedgerStateMachine {
    constructor() {
        // LEDGER STATES (NON-NEGOTIABLE)
        this.STATES = {
            CREATED: {
                code: 'CREATED',
                name: 'Created',
                description: 'Ledger created but not yet active',
                allowedTransitions: ['ACTIVE', 'CANCELLED'],
                canBorrow: false,
                canRepay: false,
                visibleTo: ['LENDER', 'ADMIN']
            },
            
            ACTIVE: {
                code: 'ACTIVE',
                name: 'Active',
                description: 'Loan is active and repayment ongoing',
                allowedTransitions: ['OVERDUE', 'CLEARED', 'CANCELLED'],
                canBorrow: false,
                canRepay: true,
                visibleTo: ['LENDER', 'BORROWER', 'GROUP_ADMIN', 'ADMIN']
            },
            
            OVERDUE: {
                code: 'OVERDUE',
                name: 'Overdue',
                description: 'Loan is past due date (7 days)',
                allowedTransitions: ['ACTIVE', 'DEFAULTED', 'CLEARED'],
                canBorrow: false,
                canRepay: true,
                visibleTo: ['LENDER', 'BORROWER', 'GROUP_ADMIN', 'ADMIN', 'DEBT_COLLECTOR'],
                appliesPenalty: true
            },
            
            DEFAULTED: {
                code: 'DEFAULTED',
                name: 'Defaulted',
                description: 'Loan has defaulted (60+ days)',
                allowedTransitions: ['CLEARED', 'BLACKLISTED'],
                canBorrow: false,
                canRepay: true,
                visibleTo: ['LENDER', 'ADMIN', 'DEBT_COLLECTOR', 'PLATFORM'],
                triggersBlacklist: true
            },
            
            CLEARED: {
                code: 'CLEARED',
                name: 'Cleared',
                description: 'Loan fully repaid',
                allowedTransitions: ['ARCHIVED'],
                canBorrow: true,
                canRepay: false,
                visibleTo: ['LENDER', 'BORROWER', 'GROUP_ADMIN', 'ADMIN'],
                improvesRating: true
            },
            
            BLACKLISTED: {
                code: 'BLACKLISTED',
                name: 'Blacklisted',
                description: 'Borrower blacklisted due to default',
                allowedTransitions: ['CLEARED', 'ARCHIVED'],
                canBorrow: false,
                canRepay: true,
                visibleTo: ['ALL_USERS'],
                restrictsPlatformAccess: true
            },
            
            CANCELLED: {
                code: 'CANCELLED',
                name: 'Cancelled',
                description: 'Loan cancelled before disbursement',
                allowedTransitions: ['ARCHIVED'],
                canBorrow: true,
                canRepay: false,
                visibleTo: ['LENDER', 'ADMIN']
            },
            
            ARCHIVED: {
                code: 'ARCHIVED',
                name: 'Archived',
                description: 'Ledger archived for historical purposes',
                allowedTransitions: [],
                canBorrow: false,
                canRepay: false,
                visibleTo: ['LENDER', 'ADMIN'],
                readOnly: true
            }
        };

        // TRANSITION RULES
        this.TRANSITION_RULES = {
            CREATED_TO_ACTIVE: {
                code: 'T001',
                from: 'CREATED',
                to: 'ACTIVE',
                conditions: [
                    'DISBURSEMENT_CONFIRMED',
                    'LENDER_SUBSCRIPTION_ACTIVE',
                    'BORROWER_NOT_BLACKLISTED',
                    'GROUP_ACTIVE',
                    'COUNTRY_VALID'
                ],
                requiredBy: 'LENDER',
                autoAfter: 'DISBURSEMENT'
            },
            
            ACTIVE_TO_OVERDUE: {
                code: 'T002',
                from: 'ACTIVE',
                to: 'OVERDUE',
                conditions: [
                    'DUE_DATE_PASSED',
                    'OUTSTANDING_BALANCE > 0',
                    'DAYS_SINCE_DISBURSEMENT > 7'
                ],
                requiredBy: 'SYSTEM',
                autoAfter: 'DUE_DATE + 1'
            },
            
            OVERDUE_TO_DEFAULTED: {
                code: 'T003',
                from: 'OVERDUE',
                to: 'DEFAULTED',
                conditions: [
                    'DAYS_SINCE_DISBURSEMENT >= 60',
                    'OUTSTANDING_BALANCE > 0',
                    'NO_RECENT_REPAYMENT'
                ],
                requiredBy: 'SYSTEM',
                autoAfter: 'DAY_60'
            },
            
            ANY_TO_CLEARED: {
                code: 'T004',
                from: ['ACTIVE', 'OVERDUE', 'DEFAULTED'],
                to: 'CLEARED',
                conditions: [
                    'OUTSTANDING_BALANCE == 0',
                    'FULL_REPAYMENT_RECEIVED'
                ],
                requiredBy: 'LENDER',
                manualVerification: 'OPTIONAL'
            },
            
            DEFAULTED_TO_BLACKLISTED: {
                code: 'T005',
                from: 'DEFAULTED',
                to: 'BLACKLISTED',
                conditions: [
                    'DEFAULT_AGE > 30',
                    'NO_REPAYMENT_PLAN',
                    'LENDER_REQUEST'
                ],
                requiredBy: 'LENDER',
                approvalRequired: 'ADMIN'
            },
            
            BLACKLISTED_TO_CLEARED: {
                code: 'T006',
                from: 'BLACKLISTED',
                to: 'CLEARED',
                conditions: [
                    'FULL_REPAYMENT_RECEIVED',
                    'PENALTIES_PAID',
                    'ADMIN_APPROVAL'
                ],
                requiredBy: 'ADMIN',
                manualVerification: 'REQUIRED'
            }
        };

        // STATE VALIDATION CONTEXTS
        this.VALIDATION_CONTEXTS = {
            LENDER: {
                canInitiate: ['CREATED_TO_ACTIVE', 'ANY_TO_CLEARED'],
                canRequest: ['DEFAULTED_TO_BLACKLISTED'],
                cannot: ['ACTIVE_TO_OVERDUE', 'OVERDUE_TO_DEFAULTED']
            },
            
            BORROWER: {
                canInitiate: [],
                canRequest: [],
                cannot: ['ALL'] // Borrowers cannot change ledger states
            },
            
            ADMIN: {
                canInitiate: ['ALL'],
                canRequest: [],
                cannot: []
            },
            
            SYSTEM: {
                canInitiate: ['ACTIVE_TO_OVERDUE', 'OVERDUE_TO_DEFAULTED'],
                canRequest: [],
                cannot: []
            }
        };
    }

    /**
     * VALIDATE STATE TRANSITION
     */
    validateTransition(currentState, targetState, context) {
        const { actor, role, ledgerId, reason, metadata } = context;
        
        // Get state objects
        const fromState = this.STATES[currentState];
        const toState = this.STATES[targetState];
        
        if (!fromState || !toState) {
            return {
                valid: false,
                reason: `Invalid state: ${currentState} or ${targetState}`,
                code: 'SM_001'
            };
        }

        // Check if transition is allowed
        if (!fromState.allowedTransitions.includes(targetState)) {
            return {
                valid: false,
                reason: `Transition from ${currentState} to ${targetState} not allowed`,
                allowedTransitions: fromState.allowedTransitions,
                code: 'SM_002'
            };
        }

        // Check actor permissions
        const roleContext = this.VALIDATION_CONTEXTS[role];
        if (!roleContext) {
            return {
                valid: false,
                reason: `Invalid role: ${role}`,
                code: 'SM_003'
            };
        }

        // Find applicable transition rule
        const transitionRule = this.findTransitionRule(currentState, targetState);
        if (!transitionRule) {
            return {
                valid: false,
                reason: `No transition rule defined for ${currentState} to ${targetState}`,
                code: 'SM_004'
            };
        }

        // Check if actor can initiate this transition
        const canInitiate = roleContext.canInitiate.includes('ALL') || 
                           roleContext.canInitiate.includes(transitionRule.code) ||
                           (roleContext.canInitiate.length === 0 && transitionRule.requiredBy === role);
        
        if (!canInitiate) {
            return {
                valid: false,
                reason: `${role} cannot initiate ${transitionRule.code} transition`,
                requiredBy: transitionRule.requiredBy,
                code: 'SM_005'
            };
        }

        // Check conditions (simplified - in production would check each condition)
        const conditionsMet = this.checkConditions(transitionRule.conditions, {
            ledgerId,
            actor,
            role,
            metadata
        });

        if (!conditionsMet.valid) {
            return {
                valid: false,
                reason: `Transition conditions not met: ${conditionsMet.reason}`,
                conditions: transitionRule.conditions,
                unmetConditions: conditionsMet.unmet,
                code: 'SM_006'
            };
        }

        // Check for required approvals
        if (transitionRule.approvalRequired && role !== transitionRule.approvalRequired) {
            return {
                valid: false,
                reason: `${transitionRule.code} requires ${transitionRule.approvalRequired} approval`,
                approvalRequired: transitionRule.approvalRequired,
                code: 'SM_007',
                canRequest: true // Can request approval
            };
        }

        // All checks passed
        return {
            valid: true,
            reason: `Transition from ${currentState} to ${targetState} approved`,
            transitionRule: transitionRule.code,
            actor: role,
            timestamp: new Date(),
            requiresManualVerification: transitionRule.manualVerification === 'REQUIRED',
            nextSteps: this.getNextSteps(currentState, targetState, role)
        };
    }

    /**
     * EXECUTE STATE TRANSITION
     */
    executeTransition(currentState, targetState, context) {
        const validation = this.validateTransition(currentState, targetState, context);
        
        if (!validation.valid) {
            return {
                success: false,
                validation,
                transition: null
            };
        }

        const transition = {
            id: `TRANS_${context.ledgerId}_${Date.now()}`,
            ledgerId: context.ledgerId,
            fromState: currentState,
            toState: targetState,
            actor: context.actor,
            role: context.role,
            reason: context.reason,
            metadata: context.metadata,
            validatedBy: validation,
            timestamp: new Date(),
            executedAt: new Date(),
            hash: this.generateTransitionHash(context)
        };

        // Execute side effects
        const sideEffects = this.executeSideEffects(currentState, targetState, context);
        
        // Update any related entities (e.g., borrower rating, blacklist status)
        this.updateRelatedEntities(transition, context);

        return {
            success: true,
            validation,
            transition,
            sideEffects,
            message: `State changed from ${currentState} to ${targetState}`
        };
    }

    /**
     * CHECK TRANSITION CONDITIONS
     */
    checkConditions(conditionCodes, context) {
        const unmet = [];
        
        for (const conditionCode of conditionCodes) {
            const conditionMet = this.evaluateCondition(conditionCode, context);
            
            if (!conditionMet.met) {
                unmet.push({
                    condition: conditionCode,
                    reason: conditionMet.reason,
                    details: conditionMet.details
                });
            }
        }

        return {
            valid: unmet.length === 0,
            reason: unmet.length > 0 ? `${unmet.length} conditions unmet` : 'All conditions met',
            unmet,
            totalConditions: conditionCodes.length,
            metConditions: conditionCodes.length - unmet.length
        };
    }

    /**
     * EVALUATE INDIVIDUAL CONDITION
     */
    evaluateCondition(conditionCode, context) {
        const conditionEvaluators = {
            DISBURSEMENT_CONFIRMED: () => {
                // Check if disbursement was confirmed
                return {
                    met: context.metadata?.disbursementConfirmed || false,
                    reason: 'Disbursement must be confirmed',
                    details: context.metadata
                };
            },
            
            LENDER_SUBSCRIPTION_ACTIVE: () => {
                // Check lender subscription status
                return {
                    met: this.checkSubscriptionActive(context.actor),
                    reason: 'Lender subscription must be active',
                    details: { lenderId: context.actor }
                };
            },
            
            BORROWER_NOT_BLACKLISTED: () => {
                // Check borrower blacklist status
                return {
                    met: !this.isBorrowerBlacklisted(context.metadata?.borrowerId),
                    reason: 'Borrower must not be blacklisted',
                    details: { borrowerId: context.metadata?.borrowerId }
                };
            },
            
            GROUP_ACTIVE: () => {
                // Check group status
                return {
                    met: this.isGroupActive(context.metadata?.groupId),
                    reason: 'Group must be active',
                    details: { groupId: context.metadata?.groupId }
                };
            },
            
            COUNTRY_VALID: () => {
                // Check country operations
                return {
                    met: this.isCountryValid(context.metadata?.countryCode),
                    reason: 'Country must be valid for operations',
                    details: { countryCode: context.metadata?.countryCode }
                };
            },
            
            DUE_DATE_PASSED: () => {
                // Check if due date has passed
                const now = new Date();
                const dueDate = new Date(context.metadata?.dueDate);
                return {
                    met: now > dueDate,
                    reason: 'Due date must have passed',
                    details: { dueDate, now }
                };
            },
            
            OUTSTANDING_BALANCE_GT_0: () => {
                // Check if there's outstanding balance
                return {
                    met: context.metadata?.outstandingBalance > 0,
                    reason: 'Must have outstanding balance',
                    details: { balance: context.metadata?.outstandingBalance }
                };
            },
            
            DAYS_SINCE_DISBURSEMENT_GT_7: () => {
                // Check if more than 7 days since disbursement
                const days = context.metadata?.daysSinceDisbursement || 0;
                return {
                    met: days > 7,
                    reason: 'Must be more than 7 days since disbursement',
                    details: { days }
                };
            },
            
            DAYS_SINCE_DISBURSEMENT_GE_60: () => {
                // Check if 60+ days since disbursement
                const days = context.metadata?.daysSinceDisbursement || 0;
                return {
                    met: days >= 60,
                    reason: 'Must be 60+ days since disbursement',
                    details: { days }
                };
            },
            
            NO_RECENT_REPAYMENT: () => {
                // Check no recent repayment
                const lastRepayment = context.metadata?.lastRepaymentDate;
                if (!lastRepayment) return { met: true, reason: 'No repayment history' };
                
                const daysSinceLastRepayment = Math.floor(
                    (new Date() - new Date(lastRepayment)) / (1000 * 60 * 60 * 24)
                );
                return {
                    met: daysSinceLastRepayment > 30,
                    reason: 'No repayment in last 30 days',
                    details: { daysSinceLastRepayment }
                };
            },
            
            FULL_REPAYMENT_RECEIVED: () => {
                // Check if full repayment received
                return {
                    met: context.metadata?.fullRepaymentReceived || false,
                    reason: 'Full repayment must be received',
                    details: context.metadata
                };
            },
            
            DEFAULT_AGE_GT_30: () => {
                // Check if default is older than 30 days
                const defaultAge = context.metadata?.defaultAgeDays || 0;
                return {
                    met: defaultAge > 30,
                    reason: 'Default must be older than 30 days',
                    details: { defaultAge }
                };
            },
            
            NO_REPAYMENT_PLAN: () => {
                // Check if no repayment plan in place
                return {
                    met: !context.metadata?.repaymentPlan,
                    reason: 'No repayment plan in place',
                    details: context.metadata
                };
            },
            
            LENDER_REQUEST: () => {
                // Check if lender requested this
                return {
                    met: context.role === 'LENDER',
                    reason: 'Must be requested by lender',
                    details: { requester: context.actor, role: context.role }
                };
            },
            
            PENALTIES_PAID: () => {
                // Check if penalties are paid
                return {
                    met: context.metadata?.penaltiesPaid || false,
                    reason: 'All penalties must be paid',
                    details: context.metadata
                };
            },
            
            ADMIN_APPROVAL: () => {
                // Check if admin approved
                return {
                    met: context.metadata?.adminApproved || false,
                    reason: 'Admin approval required',
                    details: context.metadata
                };
            }
        };

        const evaluator = conditionEvaluators[conditionCode];
        if (!evaluator) {
            return {
                met: false,
                reason: `Unknown condition: ${conditionCode}`,
                details: { conditionCode }
            };
        }

        return evaluator();
    }

    /**
     * FIND TRANSITION RULE
     */
    findTransitionRule(fromState, toState) {
        for (const [key, rule] of Object.entries(this.TRANSITION_RULES)) {
            const fromStates = Array.isArray(rule.from) ? rule.from : [rule.from];
            
            if (fromStates.includes(fromState) && rule.to === toState) {
                return rule;
            }
        }
        
        // Check for ANY_TO_* rules
        for (const [key, rule] of Object.entries(this.TRANSITION_RULES)) {
            if (rule.from === 'ANY' && rule.to === toState) {
                return rule;
            }
        }
        
        return null;
    }

    /**
     * EXECUTE SIDE EFFECTS
     */
    executeSideEffects(fromState, toState, context) {
        const sideEffects = [];
        
        // Interest and penalty calculations
        if (toState === 'OVERDUE' || toState === 'DEFAULTED') {
            sideEffects.push({
                type: 'PENALTY_APPLICATION',
                description: 'Apply daily penalties',
                execute: () => this.applyPenalties(context.ledgerId)
            });
        }
        
        // Blacklisting
        if (toState === 'BLACKLISTED') {
            sideEffects.push({
                type: 'BLACKLIST_BORROWER',
                description: 'Add borrower to blacklist',
                execute: () => this.blacklistBorrower(context.metadata?.borrowerId, context.ledgerId)
            });
        }
        
        // Rating updates
        if (toState === 'CLEARED') {
            sideEffects.push({
                type: 'UPDATE_RATING',
                description: 'Update borrower rating',
                execute: () => this.updateBorrowerRating(context.metadata?.borrowerId, true)
            });
        }
        
        if (toState === 'DEFAULTED') {
            sideEffects.push({
                type: 'UPDATE_RATING',
                description: 'Update borrower rating negatively',
                execute: () => this.updateBorrowerRating(context.metadata?.borrowerId, false)
            });
        }
        
        // Notification triggers
        sideEffects.push({
            type: 'NOTIFICATIONS',
            description: 'Send state change notifications',
            execute: () => this.sendNotifications(fromState, toState, context)
        });
        
        return sideEffects;
    }

    /**
     * UPDATE RELATED ENTITIES
     */
    updateRelatedEntities(transition, context) {
        const updates = [];
        
        // Update lender statistics
        updates.push({
            entity: 'LENDER',
            id: context.metadata?.lenderId,
            update: {
                lastActivity: new Date(),
                ledgerStateChange: transition.toState
            }
        });
        
        // Update borrower statistics if applicable
        if (context.metadata?.borrowerId) {
            updates.push({
                entity: 'BORROWER',
                id: context.metadata.borrowerId,
                update: {
                    lastLoanState: transition.toState,
                    lastActivity: new Date()
                }
            });
        }
        
        // Update group statistics
        if (context.metadata?.groupId) {
            updates.push({
                entity: 'GROUP',
                id: context.metadata.groupId,
                update: {
                    lastLedgerActivity: new Date(),
                    activeState: transition.toState
                }
            });
        }
        
        return updates;
    }

    /**
     * GET NEXT STEPS
     */
    getNextSteps(fromState, toState, role) {
        const nextSteps = {
            LENDER: [],
            BORROWER: [],
            ADMIN: [],
            SYSTEM: []
        };

        switch (toState) {
            case 'ACTIVE':
                nextSteps.LENDER = [
                    'Monitor repayment schedule',
                    'Update ledger with repayments',
                    'Communicate with borrower'
                ];
                nextSteps.BORROWER = [
                    'Make repayments as scheduled',
                    'Contact lender for any issues',
                    'Keep communication open'
                ];
                break;
                
            case 'OVERDUE':
                nextSteps.LENDER = [
                    'Contact borrower immediately',
                    'Apply daily penalties',
                    'Consider debt collector referral'
                ];
                nextSteps.BORROWER = [
                    'Contact lender to arrange payment',
                    'Make partial payment if possible',
                    'Avoid further penalties'
                ];
                nextSteps.ADMIN = [
                    'Monitor for potential default',
                    'Prepare blacklist process if needed'
                ];
                break;
                
            case 'DEFAULTED':
                nextSteps.LENDER = [
                    'Initiate blacklisting process',
                    'Refer to debt collectors',
                    'Update ledger as uncollectible'
                ];
                nextSteps.ADMIN = [
                    'Review for blacklisting',
                    'Update platform statistics',
                    'Notify group admin'
                ];
                break;
                
            case 'BLACKLISTED':
                nextSteps.LENDER = [
                    'Mark as uncollectible',
                    'Update portfolio',
                    'Learn from experience'
                ];
                nextSteps.ADMIN = [
                    'Update blacklist registry',
                    'Notify other groups',
                    'Monitor for repayment'
                ];
                break;
                
            case 'CLEARED':
                nextSteps.LENDER = [
                    'Update borrower rating',
                    'Archive ledger',
                    'Consider future lending'
                ];
                nextSteps.BORROWER = [
                    'Request rating update',
                    'Build reputation',
                    'Consider becoming a lender'
                ];
                break;
        }

        return nextSteps[role] || [];
    }

    /**
     * GET STATE HISTORY
     */
    getStateHistory(ledgerId) {
        // In production, this would query the database
        return {
            ledgerId,
            currentState: 'ACTIVE', // Example
            history: [
                {
                    from: 'CREATED',
                    to: 'ACTIVE',
                    timestamp: new Date('2024-01-01'),
                    actor: 'LENDER_001',
                    reason: 'Disbursement confirmed'
                }
            ],
            possibleNextStates: this.STATES.ACTIVE.allowedTransitions,
            timeline: this.generateStateTimeline(ledgerId)
        };
    }

    /**
     * GENERATE STATE TIMELINE
     */
    generateStateTimeline(ledgerId) {
        const timeline = [];
        const states = Object.values(this.STATES);
        
        for (const state of states) {
            timeline.push({
                state: state.code,
                name: state.name,
                description: state.description,
                isCurrent: false, // Would be determined from data
                expectedDuration: this.getExpectedDuration(state.code),
                actionsAllowed: state.canRepay ? 'Repayments allowed' : 'No repayments',
                visibility: state.visibleTo.join(', ')
            });
        }
        
        return timeline;
    }

    /**
     * GET EXPECTED DURATION FOR STATE
     */
    getExpectedDuration(stateCode) {
        const durations = {
            CREATED: '1-24 hours',
            ACTIVE: '7 days',
            OVERDUE: 'Up to 53 days (until default)',
            DEFAULTED: 'Until cleared or blacklisted',
            CLEARED: 'Permanent',
            BLACKLISTED: 'Until admin removal',
            CANCELLED: 'Permanent',
            ARCHIVED: 'Permanent'
        };
        
        return durations[stateCode] || 'Variable';
    }

    /**
     * VALIDATE LEDGER FOR CURRENT STATE
     */
    validateLedgerForState(ledger, currentState) {
        const state = this.STATES[currentState];
        const issues = [];
        
        if (!state) {
            return {
                valid: false,
                issues: [`Invalid state: ${currentState}`]
            };
        }
        
        // Check if ledger can be in this state based on dates
        if (currentState === 'ACTIVE') {
            const now = new Date();
            const dueDate = new Date(ledger.dueDate);
            
            if (now > dueDate) {
                issues.push('Active ledger is past due date');
            }
        }
        
        // Check if overdue should be defaulted
        if (currentState === 'OVERDUE') {
            const daysSinceDisbursement = Math.floor(
                (new Date() - new Date(ledger.disbursementDate)) / (1000 * 60 * 60 * 24)
            );
            
            if (daysSinceDisbursement >= 60) {
                issues.push('Overdue ledger should be in DEFAULTED state');
            }
        }
        
        // Check if defaulted should be blacklisted
        if (currentState === 'DEFAULTED') {
            const defaultAge = Math.floor(
                (new Date() - new Date(ledger.defaultDate || ledger.disbursementDate)) / (1000 * 60 * 60 * 24)
            );
            
            if (defaultAge > 30) {
                issues.push('Defaulted ledger should be BLACKLISTED');
            }
        }
        
        return {
            valid: issues.length === 0,
            issues,
            stateValidation: {
                state: currentState,
                name: state.name,
                description: state.description,
                allowsRepayment: state.canRepay,
                allowsBorrowing: state.canBorrow,
                visibleTo: state.visibleTo
            }
        };
    }

    /**
     * GET ALLOWED ACTIONS FOR STATE AND ROLE
     */
    getAllowedActions(stateCode, role, ledgerContext) {
        const state = this.STATES[stateCode];
        if (!state) return [];
        
        const roleActions = {
            LENDER: [
                ...(state.canRepay ? ['RECORD_REPAYMENT', 'UPDATE_LEDGER'] : []),
                'VIEW_LEDGER',
                'CONTACT_BORROWER',
                ...(state.code === 'DEFAULTED' ? ['REQUEST_BLACKLIST'] : []),
                ...(state.code === 'CLEARED' ? ['UPDATE_RATING', 'ARCHIVE'] : [])
            ],
            
            BORROWER: [
                ...(state.canRepay ? ['MAKE_REPAYMENT'] : []),
                'VIEW_LEDGER',
                'CONTACT_LENDER',
                ...(state.code === 'OVERDUE' ? ['REQUEST_EXTENSION'] : []),
                ...(state.code === 'DEFAULTED' ? ['APPEAL_DEFAULT'] : [])
            ],
            
            ADMIN: [
                'VIEW_LEDGER',
                'MODIFY_STATE',
                'OVERRIDE_ENTRIES',
                'VIEW_AUDIT_LOG',
                ...(state.code === 'BLACKLISTED' ? ['REMOVE_BLACKLIST'] : []),
                'EXPORT_DATA'
            ],
            
            GROUP_ADMIN: [
                'VIEW_LEDGER',
                'MEDIATE_DISPUTE',
                'CONTACT_PARTIES',
                'REPORT_TO_PLATFORM'
            ]
        };
        
        const actions = roleActions[role] || [];
        
        // Filter based on ledger context
        return actions.filter(action => {
            if (action === 'REQUEST_BLACKLIST' && ledgerContext?.outstandingBalance === 0) {
                return false;
            }
            if (action === 'MAKE_REPAYMENT' && ledgerContext?.subscriptionExpired) {
                return false;
            }
            return true;
        });
    }

    /**
     * SIMULATE STATE PROGRESSION
     */
    simulateStateProgression(ledgerId, startState, daysToSimulate) {
        const simulation = [];
        let currentState = startState;
        
        for (let day = 0; day <= daysToSimulate; day++) {
            const simulatedDate = new Date();
            simulatedDate.setDate(simulatedDate.getDate() + day);
            
            let nextState = currentState;
            
            // State progression logic
            if (currentState === 'ACTIVE' && day >= 7) {
                nextState = 'OVERDUE';
            } else if (currentState === 'OVERDUE' && day >= 60) {
                nextState = 'DEFAULTED';
            } else if (currentState === 'DEFAULTED' && day >= 90) {
                nextState = 'BLACKLISTED';
            }
            
            simulation.push({
                day,
                date: simulatedDate.toISOString().split('T')[0],
                state: nextState,
                stateName: this.STATES[nextState]?.name,
                actionsAvailable: this.getAllowedActions(nextState, 'LENDER', {
                    outstandingBalance: 1000,
                    daysSinceDisbursement: day
                }),
                conditions: this.getStateConditions(nextState, day)
            });
            
            currentState = nextState;
        }
        
        return simulation;
    }

    /**
     * GET STATE CONDITIONS
     */
    getStateConditions(stateCode, day) {
        const conditions = [];
        
        if (stateCode === 'OVERDUE') {
            conditions.push(`Day ${day}: Overdue by ${day - 7} days`);
            conditions.push(`Daily penalty: 5% on outstanding balance`);
        }
        
        if (stateCode === 'DEFAULTED') {
            conditions.push(`Day ${day}: In default for ${day - 60} days`);
            conditions.push(`Risk of blacklisting: ${day >= 90 ? 'IMMINENT' : 'PENDING'}`);
        }
        
        if (stateCode === 'BLACKLISTED') {
            conditions.push('Borrower cannot borrow from any group');
            conditions.push('Visible to all platform users');
            conditions.push('Requires admin approval to remove');
        }
        
        return conditions;
    }

    /**
     * HELPER METHODS
     */
    checkSubscriptionActive(lenderId) {
        // Simulated - in production, check subscription status
        return true;
    }

    isBorrowerBlacklisted(borrowerId) {
        // Simulated
        return false;
    }

    isGroupActive(groupId) {
        // Simulated
        return true;
    }

    isCountryValid(countryCode) {
        const validCountries = ['KE', 'UG', 'TZ', 'RW', 'BI', 'CD', 'SS', 'ZA', 'NG', 'GH', 'ET', 'SO'];
        return validCountries.includes(countryCode);
    }

    applyPenalties(ledgerId) {
        // Simulated penalty application
        return { applied: true, amount: 50, description: 'Daily penalty applied' };
    }

    blacklistBorrower(borrowerId, ledgerId) {
        // Simulated blacklisting
        return { blacklisted: true, borrowerId, ledgerId, timestamp: new Date() };
    }

    updateBorrowerRating(borrowerId, positive) {
        // Simulated rating update
        return { updated: true, borrowerId, direction: positive ? 'UP' : 'DOWN' };
    }

    sendNotifications(fromState, toState, context) {
        // Simulated notifications
        return {
            sent: true,
            toState,
            recipients: ['LENDER', 'BORROWER'],
            message: `Ledger state changed from ${fromState} to ${toState}`
        };
    }

    generateTransitionHash(context) {
        const data = `${context.ledgerId}-${context.fromState}-${context.toState}-${Date.now()}`;
        let hash = 0;
        for (let i = 0; i < data.length; i++) {
            hash = ((hash << 5) - hash) + data.charCodeAt(i);
            hash |= 0;
        }
        return hash.toString(36);
    }
}

// Export singleton instance
const ledgerStateMachine = new LedgerStateMachine();
export default ledgerStateMachine;