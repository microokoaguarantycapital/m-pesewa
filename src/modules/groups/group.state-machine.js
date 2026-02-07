/**
 * M-PESEWA Group State Machine
 * STRICT STATE MANAGEMENT: CREATED → ACTIVE → LOCKED → SUSPENDED → ARCHIVED
 * Non-negotiable state transitions with rules enforcement
 */

class GroupStateMachine {
    constructor() {
        this.states = this.defineStates();
        this.transitions = this.defineTransitions();
        this.actions = this.defineActions();
    }

    /**
     * Define all possible group states
     * @returns {object} State definitions
     */
    defineStates() {
        return {
            CREATED: {
                name: 'CREATED',
                description: 'Group has been created but not yet active',
                initial: true,
                allowedActions: ['INVITE_MEMBERS', 'CONFIGURE_SETTINGS'],
                restrictions: {
                    lending: false,
                    borrowing: false,
                    joining: false,
                    repayment: false
                },
                ui: {
                    color: '#6c757d', // Gray
                    icon: '🆕',
                    badge: 'New'
                }
            },
            
            ACTIVE: {
                name: 'ACTIVE',
                description: 'Group is fully operational',
                allowedActions: ['ALL'],
                restrictions: {
                    lending: true,
                    borrowing: true,
                    joining: true,
                    repayment: true
                },
                requirements: {
                    minMembers: 5,
                    adminActive: true
                },
                ui: {
                    color: '#28a745', // Green
                    icon: '✅',
                    badge: 'Active'
                }
            },
            
            LOCKED: {
                name: 'LOCKED',
                description: 'Group allows repayments but no new loans',
                allowedActions: ['REPAYMENTS', 'VIEW', 'DISPUTES'],
                restrictions: {
                    lending: false,
                    borrowing: false,
                    joining: false,
                    repayment: true  // CRITICAL RULE: Allow repayments
                },
                triggers: ['HIGH_DEFAULT_RATE', 'ADMIN_LOCK', 'DISPUTE'],
                ui: {
                    color: '#ffc107', // Yellow
                    icon: '🔒',
                    badge: 'Locked'
                }
            },
            
            SUSPENDED: {
                name: 'SUSPENDED',
                description: 'Group is temporarily suspended, all operations blocked',
                allowedActions: ['VIEW_ONLY'],
                restrictions: {
                    lending: false,
                    borrowing: false,
                    joining: false,
                    repayment: false  // CRITICAL RULE: Block everything
                },
                triggers: ['FRAUD', 'LEGAL_ISSUE', 'PLATFORM_VIOLATION'],
                ui: {
                    color: '#dc3545', // Red
                    icon: '⛔',
                    badge: 'Suspended'
                }
            },
            
            ARCHIVED: {
                name: 'ARCHIVED',
                description: 'Group is archived and read-only forever',
                allowedActions: ['VIEW_ONLY'],
                restrictions: {
                    lending: false,
                    borrowing: false,
                    joining: false,
                    repayment: false,
                    readOnly: true  // CRITICAL RULE: Read-only forever
                },
                triggers: ['INACTIVE_90_DAYS', 'ADMIN_ARCHIVE', 'ALL_LOANS_CLEARED'],
                final: true,
                ui: {
                    color: '#6c757d', // Gray
                    icon: '📁',
                    badge: 'Archived'
                }
            }
        };
    }

    /**
     * Define allowed state transitions
     * @returns {object} Transition definitions
     */
    defineTransitions() {
        return {
            // From CREATED
            ACTIVATE: {
                from: ['CREATED'],
                to: 'ACTIVE',
                conditions: [
                    'MIN_5_MEMBERS',
                    'ADMIN_SUBSCRIPTION_VALID',
                    'GROUP_CONFIGURED'
                ],
                requiredRole: 'ADMIN',
                description: 'Activate group for operations'
            },
            
            // From ACTIVE
            LOCK: {
                from: ['ACTIVE'],
                to: 'LOCKED',
                conditions: [
                    'DEFAULT_RATE_ABOVE_10%',
                    'ACTIVE_DISPUTE',
                    'ADMIN_REQUEST'
                ],
                requiredRole: 'ADMIN',
                description: 'Lock group (allow repayments only)'
            },
            
            SUSPEND: {
                from: ['ACTIVE', 'LOCKED'],
                to: 'SUSPENDED',
                conditions: [
                    'FRAUD_DETECTED',
                    'LEGAL_REQUIREMENT',
                    'PLATFORM_VIOLATION'
                ],
                requiredRole: 'PLATFORM_ADMIN',
                description: 'Suspend all group activities'
            },
            
            // From LOCKED
            UNLOCK: {
                from: ['LOCKED'],
                to: 'ACTIVE',
                conditions: [
                    'DEFAULT_RATE_BELOW_5%',
                    'DISPUTE_RESOLVED',
                    'ADMIN_APPROVAL'
                ],
                requiredRole: 'ADMIN',
                description: 'Unlock group to full operations'
            },
            
            // To ARCHIVED (from any state except ARCHIVED)
            ARCHIVE: {
                from: ['CREATED', 'ACTIVE', 'LOCKED', 'SUSPENDED'],
                to: 'ARCHIVED',
                conditions: [
                    'INACTIVE_90_DAYS',
                    'NO_ACTIVE_LOANS',
                    'ADMIN_APPROVAL'
                ],
                requiredRole: 'ADMIN',
                description: 'Archive group (read-only forever)',
                irreversible: true
            },
            
            // From SUSPENDED
            REACTIVATE: {
                from: ['SUSPENDED'],
                to: 'ACTIVE',
                conditions: [
                    'ISSUE_RESOLVED',
                    'LEGAL_CLEARANCE',
                    'PLATFORM_ADMIN_APPROVAL'
                ],
                requiredRole: 'PLATFORM_ADMIN',
                description: 'Reactivate suspended group'
            }
        };
    }

    /**
     * Define actions and their state dependencies
     * @returns {object} Action definitions
     */
    defineActions() {
        return {
            // Group Management Actions
            INVITE_MEMBERS: {
                allowedStates: ['CREATED', 'ACTIVE'],
                requiredRole: ['ADMIN', 'LENDER'],
                description: 'Invite new members to group'
            },
            
            REMOVE_MEMBERS: {
                allowedStates: ['ACTIVE', 'LOCKED'],
                requiredRole: 'ADMIN',
                description: 'Remove members from group'
            },
            
            UPDATE_SETTINGS: {
                allowedStates: ['CREATED', 'ACTIVE', 'LOCKED'],
                requiredRole: 'ADMIN',
                description: 'Update group settings'
            },
            
            // Financial Actions
            CREATE_LOAN: {
                allowedStates: ['ACTIVE'],
                requiredRole: ['LENDER', 'BORROWER'],
                description: 'Create new loan request'
            },
            
            APPROVE_LOAN: {
                allowedStates: ['ACTIVE'],
                requiredRole: 'LENDER',
                description: 'Approve loan request'
            },
            
            PROCESS_REPAYMENT: {
                allowedStates: ['ACTIVE', 'LOCKED'],  // CRITICAL: Allowed in LOCKED state
                requiredRole: ['LENDER', 'BORROWER'],
                description: 'Process loan repayment'
            },
            
            APPLY_PENALTY: {
                allowedStates: ['ACTIVE', 'LOCKED'],
                requiredRole: 'LENDER',
                description: 'Apply penalty to overdue loan'
            },
            
            // Ledger Actions
            UPDATE_LEDGER: {
                allowedStates: ['ACTIVE', 'LOCKED'],
                requiredRole: ['LENDER', 'ADMIN'],
                description: 'Update ledger entry'
            },
            
            VIEW_LEDGERS: {
                allowedStates: ['CREATED', 'ACTIVE', 'LOCKED', 'SUSPENDED', 'ARCHIVED'],
                requiredRole: ['ADMIN', 'LENDER', 'BORROWER'],
                description: 'View ledger entries'
            },
            
            // Reputation Actions
            RATE_USER: {
                allowedStates: ['ACTIVE'],
                requiredRole: ['LENDER', 'BORROWER'],
                description: 'Rate another user'
            },
            
            BLACKLIST_USER: {
                allowedStates: ['ACTIVE', 'LOCKED'],
                requiredRole: ['LENDER', 'ADMIN'],
                description: 'Blacklist user for default'
            },
            
            // View Actions (Always allowed for members)
            VIEW_DASHBOARD: {
                allowedStates: ['CREATED', 'ACTIVE', 'LOCKED', 'SUSPENDED', 'ARCHIVED'],
                requiredRole: ['ADMIN', 'LENDER', 'BORROWER'],
                description: 'View group dashboard'
            },
            
            VIEW_MEMBERS: {
                allowedStates: ['CREATED', 'ACTIVE', 'LOCKED', 'SUSPENDED', 'ARCHIVED'],
                requiredRole: ['ADMIN', 'LENDER', 'BORROWER'],
                description: 'View group members'
            },
            
            VIEW_ACTIVITY: {
                allowedStates: ['CREATED', 'ACTIVE', 'LOCKED', 'SUSPENDED', 'ARCHIVED'],
                requiredRole: ['ADMIN', 'LENDER', 'BORROWER'],
                description: 'View group activity log'
            }
        };
    }

    /**
     * Transition group to new state
     * @param {object} group - Group object
     * @param {string} transitionName - Transition to perform
     * @param {object} user - User performing transition
     * @param {object} metadata - Additional metadata
     * @returns {object} Transition result
     */
    async transition(group, transitionName, user, metadata = {}) {
        const transition = this.transitions[transitionName];
        
        if (!transition) {
            return {
                success: false,
                error: `Transition "${transitionName}" not defined`,
                code: 'TRANSITION_UNDEFINED'
            };
        }

        // Validate current state
        if (!transition.from.includes(group.state)) {
            return {
                success: false,
                error: `Cannot ${transitionName} from ${group.state} state`,
                code: 'INVALID_STATE_TRANSITION'
            };
        }

        // Validate user role
        const userRole = this.getUserRoleInGroup(user.id, group);
        if (!this.hasRequiredRole(userRole, transition.requiredRole)) {
            return {
                success: false,
                error: `Role ${userRole} cannot perform ${transitionName}`,
                code: 'INSUFFICIENT_PERMISSIONS'
            };
        }

        // Check transition conditions
        const conditionsMet = await this.checkTransitionConditions(
            transition, group, user, metadata
        );
        
        if (!conditionsMet.valid) {
            return {
                success: false,
                error: `Transition conditions not met: ${conditionsMet.reason}`,
                code: 'CONDITIONS_NOT_MET',
                failedConditions: conditionsMet.failedConditions
            };
        }

        // Perform state transition
        const oldState = group.state;
        const newState = transition.to;
        
        // Update group state
        group.state = newState;
        group.updatedAt = new Date().toISOString();
        
        // Add to state history
        if (!group.stateHistory) group.stateHistory = [];
        group.stateHistory.push({
            from: oldState,
            to: newState,
            transition: transitionName,
            userId: user.id,
            username: user.username,
            timestamp: new Date().toISOString(),
            metadata: metadata,
            reason: metadata.reason || 'State transition'
        });

        // Apply state-specific actions
        await this.applyStateActions(group, oldState, newState, user);

        // Log transition
        this.logTransition(group.id, oldState, newState, user, transitionName, metadata);

        return {
            success: true,
            oldState: oldState,
            newState: newState,
            group: group,
            transition: transitionName,
            message: `Group transitioned from ${oldState} to ${newState}`
        };
    }

    /**
     * Check if transition conditions are met
     * @param {object} transition - Transition definition
     * @param {object} group - Group object
     * @param {object} user - User object
     * @param {object} metadata - Transition metadata
     * @returns {object} Condition check result
     */
    async checkTransitionConditions(transition, group, user, metadata) {
        const failedConditions = [];
        
        for (const condition of transition.conditions) {
            const conditionMet = await this.evaluateCondition(
                condition, group, user, metadata
            );
            
            if (!conditionMet.met) {
                failedConditions.push({
                    condition: condition,
                    reason: conditionMet.reason
                });
            }
        }

        return {
            valid: failedConditions.length === 0,
            failedConditions: failedConditions,
            reason: failedConditions.length > 0 
                ? failedConditions.map(fc => fc.condition).join(', ')
                : 'All conditions met'
        };
    }

    /**
     * Evaluate a single condition
     * @param {string} condition - Condition to evaluate
     * @param {object} group - Group object
     * @param {object} user - User object
     * @param {object} metadata - Additional data
     * @returns {object} Evaluation result
     */
    async evaluateCondition(condition, group, user, metadata) {
        switch (condition) {
            case 'MIN_5_MEMBERS':
                return {
                    met: group.memberCount >= 5,
                    reason: group.memberCount >= 5 
                        ? `Has ${group.memberCount} members` 
                        : `Only ${group.memberCount} members (need 5)`
                };
                
            case 'ADMIN_SUBSCRIPTION_VALID':
                if (user.role !== 'ADMIN') {
                    return { met: false, reason: 'User is not group admin' };
                }
                
                const subscriptionValid = await this.checkAdminSubscription(user);
                return {
                    met: subscriptionValid.valid,
                    reason: subscriptionValid.reason
                };
                
            case 'GROUP_CONFIGURED':
                const configured = group.name && group.type && group.country;
                return {
                    met: configured,
                    reason: configured ? 'Group configured' : 'Group not fully configured'
                };
                
            case 'DEFAULT_RATE_ABOVE_10%':
                const defaultRate = (group.defaultedLoans || 0) / (group.totalLoans || 1) * 100;
                return {
                    met: defaultRate > 10,
                    reason: `Default rate: ${defaultRate.toFixed(1)}%`
                };
                
            case 'ACTIVE_DISPUTE':
                const hasActiveDispute = group.activeDisputes && group.activeDisputes > 0;
                return {
                    met: hasActiveDispute,
                    reason: hasActiveDispute ? 'Active disputes exist' : 'No active disputes'
                };
                
            case 'ADMIN_REQUEST':
                return {
                    met: metadata.requestedByAdmin === true,
                    reason: metadata.requestedByAdmin ? 'Admin requested' : 'Not admin requested'
                };
                
            case 'FRAUD_DETECTED':
                return {
                    met: metadata.fraudDetected === true,
                    reason: metadata.fraudDetected ? 'Fraud detected' : 'No fraud detected'
                };
                
            case 'NO_ACTIVE_LOANS':
                const noActiveLoans = (group.activeLoans || 0) === 0;
                return {
                    met: noActiveLoans,
                    reason: noActiveLoans ? 'No active loans' : 'Active loans exist'
                };
                
            case 'INACTIVE_90_DAYS':
                const lastActivity = new Date(group.lastActivity || group.createdAt);
                const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
                return {
                    met: lastActivity < ninetyDaysAgo,
                    reason: lastActivity < ninetyDaysAgo 
                        ? `Inactive since ${lastActivity.toISOString().split('T')[0]}`
                        : 'Active within 90 days'
                };
                
            default:
                // Custom condition from metadata
                if (metadata.conditions && metadata.conditions[condition]) {
                    return {
                        met: metadata.conditions[condition] === true,
                        reason: `Custom condition: ${condition}`
                    };
                }
                
                return { met: false, reason: `Unknown condition: ${condition}` };
        }
    }

    /**
     * Check admin subscription validity
     * @param {object} user - User object
     * @returns {object} Subscription check result
     */
    async checkAdminSubscription(user) {
        if (!user.subscription) {
            return { valid: false, reason: 'No subscription' };
        }
        
        if (user.subscription.status !== 'ACTIVE') {
            return { valid: false, reason: 'Subscription not active' };
        }
        
        // Check 28th expiry rule
        const today = new Date();
        const expiry = new Date(user.subscription.expiryDate);
        
        if (today > expiry) {
            return { valid: false, reason: 'Subscription expired' };
        }
        
        return { valid: true, reason: 'Subscription valid' };
    }

    /**
     * Apply state-specific actions after transition
     * @param {object} group - Group object
     * @param {string} oldState - Previous state
     * @param {string} newState - New state
     * @param {object} user - User who performed transition
     */
    async applyStateActions(group, oldState, newState, user) {
        const stateDef = this.states[newState];
        
        // Apply restrictions based on new state
        group.restrictions = stateDef.restrictions;
        
        // Notify members of state change
        await this.notifyMembers(group, oldState, newState, user);
        
        // Update group statistics
        await this.updateGroupStatistics(group);
        
        // Log state change in audit trail
        this.auditStateChange(group.id, oldState, newState, user);
        
        // Apply state-specific business rules
        switch (newState) {
            case 'LOCKED':
                await this.handleLockedState(group);
                break;
                
            case 'SUSPENDED':
                await this.handleSuspendedState(group);
                break;
                
            case 'ARCHIVED':
                await this.handleArchivedState(group);
                break;
        }
    }

    /**
     * Handle LOCKED state specific rules
     * @param {object} group - Group object
     */
    async handleLockedState(group) {
        // CRITICAL RULE: Allow repayments but no new loans
        console.log(`Group ${group.id} locked: Allowing repayments only`);
        
        // Freeze new loan creation
        group.loanCreationAllowed = false;
        
        // Allow existing loan processing
        group.repaymentProcessingAllowed = true;
        
        // Notify lenders about locked state
        const lenders = group.members.filter(m => m.role === 'LENDER');
        lenders.forEach(lender => {
            // Send notification
            this.sendNotification(lender.userId, {
                type: 'GROUP_LOCKED',
                message: `Group "${group.name}" is locked. No new loans allowed, but repayments can continue.`,
                groupId: group.id
            });
        });
    }

    /**
     * Handle SUSPENDED state specific rules
     * @param {object} group - Group object
     */
    async handleSuspendedState(group) {
        // CRITICAL RULE: Block everything
        console.log(`Group ${group.id} suspended: All operations blocked`);
        
        // Block all operations
        group.loanCreationAllowed = false;
        group.repaymentProcessingAllowed = false;
        group.memberManagementAllowed = false;
        
        // Notify all members
        group.members.forEach(member => {
            this.sendNotification(member.userId, {
                type: 'GROUP_SUSPENDED',
                message: `Group "${group.name}" is suspended. All operations are temporarily blocked.`,
                groupId: group.id,
                contactSupport: true
            });
        });
    }

    /**
     * Handle ARCHIVED state specific rules
     * @param {object} group - Group object
     */
    async handleArchivedState(group) {
        // CRITICAL RULE: Read-only forever
        console.log(`Group ${group.id} archived: Read-only mode forever`);
        
        // Set read-only flags
        group.readOnly = true;
        group.archivedAt = new Date().toISOString();
        group.archivedBy = 'SYSTEM'; // Would be actual user
        
        // Remove from active groups list
        group.active = false;
        
        // Create archive snapshot
        await this.createArchiveSnapshot(group);
    }

    /**
     * Check if action is allowed in current state
     * @param {string} action - Action to check
     * @param {string} state - Current state
     * @param {string} userRole - User role
     * @returns {object} Permission check result
     */
    canPerformAction(action, state, userRole) {
        const actionDef = this.actions[action];
        
        if (!actionDef) {
            return {
                allowed: false,
                reason: `Action "${action}" not defined`,
                code: 'ACTION_UNDEFINED'
            };
        }

        // Check state permission
        if (!actionDef.allowedStates.includes(state)) {
            return {
                allowed: false,
                reason: `Action not allowed in ${state} state`,
                code: 'STATE_RESTRICTION'
            };
        }

        // Check role permission
        const requiredRoles = Array.isArray(actionDef.requiredRole) 
            ? actionDef.requiredRole 
            : [actionDef.requiredRole];
            
        if (!requiredRoles.includes(userRole)) {
            return {
                allowed: false,
                reason: `Role ${userRole} cannot perform ${action}`,
                code: 'ROLE_RESTRICTION'
            };
        }

        return {
            allowed: true,
            reason: 'Action allowed',
            code: 'ALLOWED'
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
     * Check if user has required role
     * @param {string} userRole - User's role
     * @param {string|Array} requiredRole - Required role(s)
     * @returns {boolean} True if user has required role
     */
    hasRequiredRole(userRole, requiredRole) {
        if (Array.isArray(requiredRole)) {
            return requiredRole.includes(userRole);
        }
        return userRole === requiredRole;
    }

    /**
     * Notify group members of state change
     * @param {object} group - Group object
     * @param {string} oldState - Previous state
     * @param {string} newState - New state
     * @param {object} user - User who performed transition
     */
    async notifyMembers(group, oldState, newState, user) {
        const notification = {
            groupId: group.id,
            groupName: group.name,
            oldState: oldState,
            newState: newState,
            changedBy: user.username,
            timestamp: new Date().toISOString(),
            message: `Group state changed from ${oldState} to ${newState}`
        };
        
        // Store notification for each member
        group.members.forEach(member => {
            this.storeNotification(member.userId, notification);
        });
    }

    /**
     * Update group statistics
     * @param {object} group - Group object
     */
    async updateGroupStatistics(group) {
        // Update last activity timestamp
        group.lastActivity = new Date().toISOString();
        
        // Update state-specific statistics
        if (group.stats) {
            group.stats.stateChanges = (group.stats.stateChanges || 0) + 1;
            group.stats.currentState = group.state;
            group.stats.lastStateChange = new Date().toISOString();
        }
    }

    /**
     * Log state transition
     * @param {string} groupId - Group ID
     * @param {string} oldState - Previous state
     * @param {string} newState - New state
     * @param {object} user - User who performed transition
     * @param {string} transition - Transition name
     * @param {object} metadata - Additional metadata
     */
    logTransition(groupId, oldState, newState, user, transition, metadata) {
        const logEntry = {
            type: 'STATE_TRANSITION',
            groupId: groupId,
            oldState: oldState,
            newState: newState,
            transition: transition,
            userId: user.id,
            username: user.username,
            timestamp: new Date().toISOString(),
            metadata: metadata,
            ip: metadata.ip || 'unknown'
        };
        
        // Store in audit log
        this.storeAuditLog(logEntry);
    }

    /**
     * Audit state change
     * @param {string} groupId - Group ID
     * @param {string} oldState - Previous state
     * @param {string} newState - New state
     * @param {object} user - User who performed transition
     */
    auditStateChange(groupId, oldState, newState, user) {
        const auditEntry = {
            action: 'GROUP_STATE_CHANGE',
            entityType: 'GROUP',
            entityId: groupId,
            oldValue: oldState,
            newValue: newState,
            userId: user.id,
            username: user.username,
            timestamp: new Date().toISOString()
        };
        
        // Store in audit trail
        this.storeAuditTrail(auditEntry);
    }

    /**
     * Create archive snapshot
     * @param {object} group - Group to archive
     */
    async createArchiveSnapshot(group) {
        const snapshot = {
            groupId: group.id,
            groupName: group.name,
            archivedAt: new Date().toISOString(),
            snapshot: JSON.parse(JSON.stringify(group)), // Deep clone
            statistics: {
                totalMembers: group.memberCount,
                totalLoans: group.totalLoans || 0,
                totalAmountLent: group.totalAmountLent || 0,
                repaymentRate: group.successfulRepaymentRate || 0
            }
        };
        
        // Store in archives
        this.storeArchive(snapshot);
    }

    /**
     * Get state information
     * @param {string} state - State name
     * @returns {object} State definition
     */
    getStateInfo(state) {
        return this.states[state] || null;
    }

    /**
     * Get all possible transitions from current state
     * @param {string} currentState - Current state
     * @returns {Array} Possible transitions
     */
    getPossibleTransitions(currentState) {
        const transitions = [];
        
        Object.keys(this.transitions).forEach(transitionName => {
            const transition = this.transitions[transitionName];
            if (transition.from.includes(currentState)) {
                transitions.push({
                    name: transitionName,
                    to: transition.to,
                    description: transition.description,
                    requiredRole: transition.requiredRole
                });
            }
        });
        
        return transitions;
    }

    /**
     * Get state restrictions
     * @param {string} state - State name
     * @returns {object} State restrictions
     */
    getStateRestrictions(state) {
        const stateDef = this.states[state];
        return stateDef ? stateDef.restrictions : {};
    }

    /**
     * Store notification (placeholder)
     * @param {string} userId - User ID
     * @param {object} notification - Notification object
     */
    storeNotification(userId, notification) {
        // Implementation would store in database
        console.log(`Notification for ${userId}:`, notification);
    }

    /**
     * Send notification (placeholder)
     * @param {string} userId - User ID
     * @param {object} notification - Notification object
     */
    sendNotification(userId, notification) {
        // Implementation would send email/push
        console.log(`Sending to ${userId}:`, notification);
    }

    /**
     * Store audit log (placeholder)
     * @param {object} logEntry - Log entry
     */
    storeAuditLog(logEntry) {
        // Implementation would store in database
        console.log('Audit log:', logEntry);
    }

    /**
     * Store audit trail (placeholder)
     * @param {object} auditEntry - Audit entry
     */
    storeAuditTrail(auditEntry) {
        // Implementation would store in database
        console.log('Audit trail:', auditEntry);
    }

    /**
     * Store archive (placeholder)
     * @param {object} snapshot - Archive snapshot
     */
    storeArchive(snapshot) {
        // Implementation would store in database
        console.log('Archive snapshot:', snapshot);
    }

    /**
     * Export state machine configuration
     * @returns {object} State machine config
     */
    exportConfig() {
        return {
            states: this.states,
            transitions: this.transitions,
            actions: this.actions
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GroupStateMachine;
}