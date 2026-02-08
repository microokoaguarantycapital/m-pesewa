/**
 * M-PESEWA GROUP SWITCHER
 * Enforces strict group management, isolation, and switching rules
 * Non-negotiable: Groups are country-locked, invitation-only, with strict member limits
 */

// ============================================================================
// 1️⃣ GROUP CONSTANTS & DEFINITIONS (STRICT HIERARCHY)
// ============================================================================

const GROUP_TYPES = Object.freeze({
    FAMILY: {
        id: 'family',
        name: 'Family Group',
        icon: '👨‍👩‍👧‍👦',
        description: 'Extended family members and close relatives',
        min_members: 5,
        max_members: 1000,
        requires_blood_relation: true,
        requires_verification: true
    },
    CHURCH: {
        id: 'church',
        name: 'Church Group',
        icon: '⛪',
        description: 'Church congregation members and religious community',
        min_members: 10,
        max_members: 1000,
        requires_church_membership: true,
        requires_pastor_approval: true
    },
    PROFESSIONAL: {
        id: 'professional',
        name: 'Professional Group',
        icon: '💼',
        description: 'Colleagues from same profession or industry',
        min_members: 5,
        max_members: 500,
        requires_professional_verification: true,
        requires_employment_proof: true
    },
    LOCAL_COMMUNITY: {
        id: 'local_community',
        name: 'Local Community',
        icon: '🏘️',
        description: 'Neighbors from same village, estate, or local area',
        min_members: 5,
        max_members: 1000,
        requires_location_verification: true,
        requires_local_referral: true
    },
    SOCIAL: {
        id: 'social',
        name: 'Social Group',
        icon: '👥',
        description: 'Friends, social circles, and community organizations',
        min_members: 5,
        max_members: 500,
        requires_invitation: true,
        requires_trust_score: 3.5
    },
    BUSINESS_ASSOCIATION: {
        id: 'business_association',
        name: 'Business Association',
        icon: '🏢',
        description: 'Formal business networks and trade associations',
        min_members: 10,
        max_members: 500,
        requires_business_registration: true,
        requires_membership_fee: false
    }
});

const GROUP_RULES = Object.freeze({
    // Group creation rules
    CREATION: {
        MIN_MEMBERS: 5,
        MAX_MEMBERS: 1000,
        FOUNDER_REQUIREMENTS: {
            must_be_adult: true,
            must_be_resident: true,
            must_have_id: true,
            min_trust_score: 4.0
        },
        VALIDATION: {
            country_locked: true,
            no_duplicate_names: true,
            requires_admin_approval: false
        }
    },
    
    // Group membership rules
    MEMBERSHIP: {
        MAX_BORROWER_GROUPS: 4,
        MIN_BORROWER_RATING_FOR_MULTIPLE_GROUPS: 3.5,
        LENDER_NO_GROUP_LIMIT: false,
        MEMBER_TYPES: {
            FOUNDER: 'founder',
            ADMIN: 'admin',
            LENDER: 'lender',
            BORROWER: 'borrower',
            OBSERVER: 'observer'
        },
        INVITATION: {
            REFERRAL_ONLY: true,
            MIN_REFERRALS: 2,
            REFERRAL_TRUST_SCORE: 3.5,
            INVITATION_EXPIRY_DAYS: 7
        }
    },
    
    // Group operations rules
    OPERATIONS: {
        LOAN_APPROVAL: {
            quorum_required: false,
            min_lenders_for_approval: 1,
            founder_override: true
        },
        DISPUTE_RESOLUTION: {
            founder_final_decision: true,
            escalation_to_platform_admin: true,
            mediation_required: true
        },
        FUNDS_MANAGEMENT: {
            no_platform_holding: true,
            direct_member_transfers: true,
            transaction_records_required: true
        }
    },
    
    // Group isolation rules (NON-NEGOTIABLE)
    ISOLATION: {
        COUNTRY_LOCKED: true,
        NO_CROSS_GROUP_LENDING: true,
        NO_CROSS_COUNTRY_INVITATIONS: true,
        GROUP_ADMIN_JURISDICTION: 'WITHIN_GROUP_ONLY',
        LEDGER_VISIBILITY: 'GROUP_MEMBERS_ONLY'
    }
});

// ============================================================================
// 2️⃣ GROUP SWITCHING BUSINESS RULES (NON-NEGOTIABLE)
// ============================================================================

const GROUP_SWITCHING_RULES = Object.freeze({
    // Rule 1: Group must belong to user's country
    COUNTRY_ISOLATION: {
        code: 'GS001',
        description: 'Users can only join groups in their registered country',
        check: (userId, groupCountry, userCountry) => {
            return groupCountry === userCountry;
        },
        errorMessage: (groupCountry, userCountry) => 
            `Cannot join group in ${groupCountry}. You are registered in ${userCountry}`
    },
    
    // Rule 2: Borrower group limit (max 4 groups)
    BORROWER_GROUP_LIMIT: {
        code: 'GS002',
        description: 'Borrowers can join maximum 4 groups with good rating',
        check: (userRole, currentGroups, targetGroupId, userRating) => {
            if (userRole !== 'borrower') return true;
            
            // Check if already in target group
            const alreadyInGroup = currentGroups.some(g => g.id === targetGroupId);
            if (alreadyInGroup) return true;
            
            // Check group count
            if (currentGroups.length >= 4) return false;
            
            // If joining 3rd or 4th group, require good rating
            if (currentGroups.length >= 2 && userRating < 3.5) return false;
            
            return true;
        },
        errorMessage: (currentGroups, userRating) => {
            if (currentGroups.length >= 4) {
                return 'Maximum of 4 groups reached for borrowers';
            }
            if (currentGroups.length >= 2 && userRating < 3.5) {
                return 'Rating too low (need 3.5+) to join additional groups';
            }
            return '';
        }
    },
    
    // Rule 3: Group capacity limit (max 1000 members)
    GROUP_CAPACITY_LIMIT: {
        code: 'GS003',
        description: 'Groups cannot exceed 1000 members',
        check: (groupCurrentMembers, groupMaxMembers = 1000) => {
            return groupCurrentMembers < groupMaxMembers;
        },
        errorMessage: (groupName, currentMembers) =>
            `Group ${groupName} has reached maximum capacity (${currentMembers}/1000 members)`
    },
    
    // Rule 4: Minimum members requirement (min 5 members)
    MINIMUM_MEMBERS_REQUIREMENT: {
        code: 'GS004',
        description: 'Groups must have at least 5 members',
        check: (groupCurrentMembers) => {
            return groupCurrentMembers >= 5;
        },
        errorMessage: (groupName, currentMembers) =>
            `Group ${groupName} needs at least 5 members (currently ${currentMembers})`
    },
    
    // Rule 5: Invitation-only groups
    INVITATION_REQUIRED: {
        code: 'GS005',
        description: 'Groups are invitation or referral only',
        check: (hasInvitation, hasReferral, groupType) => {
            if (groupType === 'family') {
                return hasInvitation || hasReferral;
            }
            return hasInvitation; // All groups require invitation
        },
        errorMessage: (groupName) =>
            `Group ${groupName} is invitation-only. You need an invitation to join.`
    },
    
    // Rule 6: Referrer verification requirement
    REFERRER_VERIFICATION: {
        code: 'GS006',
        description: 'Requires 2 referrers/guarantors from the same group',
        check: (referrers, groupId) => {
            if (!referrers || referrers.length < 2) return false;
            
            // Check both referrers are from the target group
            return referrers.every(ref => ref.groupId === groupId && ref.isActiveMember);
        },
        errorMessage: () =>
            'Requires 2 active members from the group as referrers/guarantors'
    },
    
    // Rule 7: No duplicate group membership
    NO_DUPLICATE_MEMBERSHIP: {
        code: 'GS007',
        description: 'User cannot be in same group multiple times',
        check: (userId, groupMembers) => {
            return !groupMembers.some(member => member.id === userId);
        },
        errorMessage: (groupName) =>
            `You are already a member of ${groupName}`
    },
    
    // Rule 8: Group founder approval for sensitive groups
    FOUNDER_APPROVAL_REQUIRED: {
        code: 'GS008',
        description: 'Family and church groups require founder approval',
        check: (groupType, founderApproved) => {
            const requiresApproval = ['family', 'church', 'professional'];
            if (requiresApproval.includes(groupType)) {
                return founderApproved === true;
            }
            return true;
        },
        errorMessage: (groupType) =>
            `${groupType} groups require founder approval to join`
    },
    
    // Rule 9: Blacklisted users cannot join new groups
    BLACKLIST_BLOCK: {
        code: 'GS009',
        description: 'Blacklisted users cannot join new groups',
        check: (isBlacklisted, isFounder) => {
            if (isFounder) return true; // Founders can still manage their groups
            return !isBlacklisted;
        },
        errorMessage: () =>
            'Blacklisted users cannot join new groups. Clear your blacklist status first.'
    },
    
    // Rule 10: Active loan restriction
    ACTIVE_LOAN_RESTRICTION: {
        code: 'GS010',
        description: 'Users with active loans cannot leave groups',
        check: (hasActiveLoans, action) => {
            if (action === 'leave_group' && hasActiveLoans) {
                return false;
            }
            return true;
        },
        errorMessage: () =>
            'Cannot leave group while having active loans. Clear all loans first.'
    },
    
    // Rule 11: Group switching cooldown
    SWITCH_COOLDOWN: {
        code: 'GS011',
        description: '24-hour cooldown between group switches',
        check: (lastSwitchTime) => {
            if (!lastSwitchTime) return true;
            
            const twentyFourHours = 24 * 60 * 60 * 1000;
            const timeSinceLastSwitch = Date.now() - new Date(lastSwitchTime).getTime();
            
            return timeSinceLastSwitch >= twentyFourHours;
        },
        errorMessage: () =>
            'Please wait 24 hours before switching groups again'
    },
    
    // Rule 12: Migration with good repayment record
    MIGRATION_WITH_GOOD_RECORD: {
        code: 'GS012',
        description: 'Users can migrate to new groups only with good repayment record',
        check: (repaymentRate, defaultCount, migrationType) => {
            if (migrationType === 'voluntary') {
                return repaymentRate >= 0.95 && defaultCount === 0; // 95%+ repayment rate, no defaults
            }
            return true;
        },
        errorMessage: (repaymentRate) =>
            `Need 95%+ repayment rate to migrate groups. Your rate: ${(repaymentRate * 100).toFixed(1)}%`
    }
});

// ============================================================================
// 3️⃣ GROUP SWITCHER CORE CLASS
// ============================================================================

class MpesewaGroupSwitcher {
    constructor(userData, navigationState, permissionChecker) {
        this.userData = userData;
        this.navigationState = navigationState;
        this.permissionChecker = permissionChecker;
        
        this._currentGroup = null;
        this._availableGroups = [];
        this._groupMemberships = [];
        this._switchHistory = [];
        this._invitations = [];
        this._referrals = [];
        this._validationErrors = [];
        this._groupDataCache = new Map();
        
        this._initialize();
    }
    
    // ============================================================================
    // 3.1 Initialization
    // ============================================================================
    
    async _initialize() {
        if (!this.userData) {
            throw new Error('User data required for group switcher initialization');
        }
        
        // Load user's group memberships
        await this._loadGroupMemberships();
        
        // Set current group from navigation state or first membership
        if (this.navigationState?.currentGroup) {
            this._currentGroup = this.navigationState.currentGroup;
        } else if (this._groupMemberships.length > 0) {
            this._currentGroup = this._groupMemberships[0];
            if (this.navigationState) {
                this.navigationState.currentGroup = this._currentGroup;
            }
        }
        
        // Load available groups (groups user can join)
        await this._loadAvailableGroups();
        
        // Load invitations and referrals
        await this._loadInvitations();
        await this._loadReferrals();
        
        // Load switch history
        this._loadSwitchHistory();
        
        this._log('Group switcher initialized', {
            userId: this.userData.id,
            currentGroup: this._currentGroup?.name,
            memberships: this._groupMemberships.length,
            availableGroups: this._availableGroups.length
        });
    }
    
    async _loadGroupMemberships() {
        try {
            // In production, this would be an API call
            const memberships = this.userData.groups || [];
            
            this._groupMemberships = await Promise.all(
                memberships.map(async (groupRef) => {
                    const groupData = await this._fetchGroupDetails(groupRef.id);
                    return {
                        ...groupData,
                        userRole: groupRef.role,
                        joinedDate: groupRef.joined_date,
                        isFounder: groupRef.is_founder || false,
                        memberSince: groupRef.member_since
                    };
                })
            );
            
            // Sort by most recent activity
            this._groupMemberships.sort((a, b) => {
                return new Date(b.lastActivity) - new Date(a.lastActivity);
            });
            
        } catch (error) {
            console.error('Failed to load group memberships:', error);
            this._groupMemberships = [];
        }
    }
    
    async _loadAvailableGroups() {
        try {
            // Get groups in user's country
            const country = this.userData.country;
            if (!country) {
                this._availableGroups = [];
                return;
            }
            
            // Fetch groups available in user's country
            const availableGroups = await this._fetchAvailableGroups(country);
            
            // Filter out groups user is already a member of
            const userGroupIds = this._groupMemberships.map(g => g.id);
            const filteredGroups = availableGroups.filter(group => 
                !userGroupIds.includes(group.id)
            );
            
            // Check eligibility for each group
            this._availableGroups = await Promise.all(
                filteredGroups.map(async (group) => {
                    const eligibility = await this._checkGroupEligibility(group);
                    return {
                        ...group,
                        eligibility,
                        canJoin: eligibility.allowed,
                        requirements: eligibility.requirements || []
                    };
                })
            );
            
            // Sort by eligibility and then by activity
            this._availableGroups.sort((a, b) => {
                if (a.canJoin !== b.canJoin) return b.canJoin - a.canJoin;
                return new Date(b.lastActivity) - new Date(a.lastActivity);
            });
            
        } catch (error) {
            console.error('Failed to load available groups:', error);
            this._availableGroups = [];
        }
    }
    
    async _loadInvitations() {
        try {
            // Fetch pending invitations for user
            const invitations = await this._fetchInvitations(this.userData.id);
            
            this._invitations = invitations.map(invite => ({
                id: invite.id,
                groupId: invite.group_id,
                groupName: invite.group_name,
                invitedBy: invite.invited_by,
                invitedByName: invite.invited_by_name,
                invitedByRole: invite.invited_by_role,
                invitationDate: invite.invitation_date,
                expiresAt: invite.expires_at,
                status: invite.status,
                message: invite.message || ''
            }));
            
            // Filter out expired invitations
            const now = new Date();
            this._invitations = this._invitations.filter(invite => 
                new Date(invite.expiresAt) > now
            );
            
        } catch (error) {
            console.error('Failed to load invitations:', error);
            this._invitations = [];
        }
    }
    
    async _loadReferrals() {
        try {
            // Fetch referrals for user
            const referrals = await this._fetchReferrals(this.userData.id);
            
            this._referrals = referrals.map(ref => ({
                id: ref.id,
                groupId: ref.group_id,
                groupName: ref.group_name,
                referredBy: ref.referred_by,
                referredByName: ref.referred_by_name,
                referralDate: ref.referral_date,
                status: ref.status,
                trustScore: ref.trust_score || 0
            }));
            
        } catch (error) {
            console.error('Failed to load referrals:', error);
            this._referrals = [];
        }
    }
    
    // ============================================================================
    // 3.2 Group Switching Core Logic
    // ============================================================================
    
    async switchToGroup(groupId, options = {}) {
        const startTime = Date.now();
        
        try {
            this._validationErrors = [];
            
            // Step 1: Get group details
            const group = await this._fetchGroupDetails(groupId);
            if (!group) {
                throw new GroupSwitchError(`Group not found: ${groupId}`);
            }
            
            // Step 2: Check if already in this group
            if (this._isUserInGroup(groupId)) {
                return {
                    success: true,
                    message: `Already in group: ${group.name}`,
                    group: group,
                    is_switch: false
                };
            }
            
            // Step 3: Validate switch is allowed
            const validationResult = await this.validateGroupSwitch(groupId, options);
            
            if (!validationResult.allowed) {
                throw new GroupSwitchError(
                    `Group switch not allowed: ${validationResult.reason}`,
                    validationResult.rule,
                    validationResult.details
                );
            }
            
            // Step 4: Perform pre-switch actions
            await this._performPreSwitchActions(this._currentGroup?.id, groupId);
            
            // Step 5: Update current group
            const previousGroup = this._currentGroup;
            this._currentGroup = group;
            
            // Step 6: Update navigation state
            if (this.navigationState) {
                this.navigationState.switchGroup(groupId, group);
            }
            
            // Step 7: Add to memberships if not already there
            if (!this._isUserInGroup(groupId)) {
                await this._addGroupMembership(group, options.userRole || 'member');
            }
            
            // Step 8: Record switch in history
            const switchRecord = this._recordGroupSwitch(previousGroup?.id, groupId, options);
            
            // Step 9: Update available groups
            await this._updateAvailableGroups();
            
            // Step 10: Perform post-switch actions
            await this._performPostSwitchActions(previousGroup?.id, groupId);
            
            const switchTime = Date.now() - startTime;
            
            this._log('Group switch completed', {
                from: previousGroup?.name,
                to: group.name,
                duration: switchTime,
                userId: this.userData.id
            });
            
            return {
                success: true,
                previous_group: previousGroup,
                new_group: group,
                switch_record: switchRecord,
                memberships: this._groupMemberships,
                duration_ms: switchTime
            };
            
        } catch (error) {
            this._log('Group switch failed', {
                from: this._currentGroup?.name,
                to: groupId,
                error: error.message,
                userId: this.userData.id
            });
            
            return {
                success: false,
                error: error.message,
                validation_errors: this._validationErrors,
                attempted_group: groupId
            };
        }
    }
    
    async joinGroup(groupId, options = {}) {
        // Specialized method for joining new groups (not switching)
        const validationResult = await this.validateGroupJoin(groupId, options);
        
        if (!validationResult.allowed) {
            return {
                success: false,
                error: validationResult.reason,
                validation: validationResult
            };
        }
        
        // Get group details
        const group = await this._fetchGroupDetails(groupId);
        if (!group) {
            return {
                success: false,
                error: `Group not found: ${groupId}`
            };
        }
        
        // Process invitation if provided
        if (options.invitationId) {
            await this._processInvitation(options.invitationId);
        }
        
        // Process referrals if provided
        if (options.referrerIds && options.referrerIds.length >= 2) {
            await this._processReferrals(groupId, options.referrerIds);
        }
        
        // Join the group
        const joinResult = await this._joinGroup(group, options);
        
        if (joinResult.success) {
            // Add to memberships
            await this._addGroupMembership(group, options.userRole || 'member');
            
            // Update current group if this is first group
            if (!this._currentGroup) {
                this._currentGroup = group;
                if (this.navigationState) {
                    this.navigationState.currentGroup = group;
                }
            }
            
            // Update available groups
            await this._updateAvailableGroups();
            
            // Record join
            this._recordGroupJoin(groupId, options);
        }
        
        return joinResult;
    }
    
    async leaveGroup(groupId, options = {}) {
        // Validate leave request
        const validationResult = await this.validateGroupLeave(groupId, options);
        
        if (!validationResult.allowed) {
            return {
                success: false,
                error: validationResult.reason,
                validation: validationResult
            };
        }
        
        // Check if user is founder
        const membership = this._groupMemberships.find(g => g.id === groupId);
        if (membership?.isFounder) {
            // Founders cannot leave without transferring ownership
            if (!options.transferToUserId) {
                return {
                    success: false,
                    error: 'Founders must transfer ownership before leaving group'
                };
            }
            
            // Transfer ownership
            await this._transferGroupOwnership(groupId, options.transferToUserId);
        }
        
        // Remove from group
        const leaveResult = await this._leaveGroup(groupId, options);
        
        if (leaveResult.success) {
            // Remove from memberships
            this._groupMemberships = this._groupMemberships.filter(g => g.id !== groupId);
            
            // Update current group if leaving current group
            if (this._currentGroup?.id === groupId) {
                this._currentGroup = this._groupMemberships[0] || null;
                if (this.navigationState) {
                    this.navigationState.currentGroup = this._currentGroup;
                }
            }
            
            // Record leave
            this._recordGroupLeave(groupId, options);
        }
        
        return leaveResult;
    }
    
    // ============================================================================
    // 3.3 Group Switch Validation
    // ============================================================================
    
    async validateGroupSwitch(groupId, options = {}) {
        const validationResults = {
            allowed: true,
            failed_rules: [],
            passed_rules: [],
            reason: null,
            rule: null
        };
        
        // Get group details
        const group = await this._fetchGroupDetails(groupId);
        if (!group) {
            validationResults.allowed = false;
            validationResults.reason = 'Group not found';
            return validationResults;
        }
        
        // Get user context
        const userContext = {
            userId: this.userData.id,
            userRole: this.userData.roles?.[0],
            userCountry: this.userData.country,
            currentGroups: this._groupMemberships,
            currentGroupCount: this._groupMemberships.length,
            userRating: this.userData.rating || 0,
            isBlacklisted: this.userData.is_blacklisted || false,
            repaymentRate: this.userData.repayment_rate || 0,
            defaultCount: this.userData.default_count || 0,
            hasActiveLoans: options.hasActiveLoans || false,
            lastSwitchTime: this._getLastSwitchTime(),
            hasInvitation: this._hasInvitationForGroup(groupId),
            hasReferral: this._hasReferralForGroup(groupId),
            referrers: options.referrers || [],
            founderApproved: options.founder_approved || false
        };
        
        // Apply all business rules
        Object.keys(GROUP_SWITCHING_RULES).forEach(ruleKey => {
            const rule = GROUP_SWITCHING_RULES[ruleKey];
            
            try {
                let checkResult;
                
                switch (ruleKey) {
                    case 'COUNTRY_ISOLATION':
                        checkResult = rule.check(
                            userContext.userId,
                            group.country,
                            userContext.userCountry
                        );
                        break;
                        
                    case 'BORROWER_GROUP_LIMIT':
                        checkResult = rule.check(
                            userContext.userRole,
                            userContext.currentGroups,
                            groupId,
                            userContext.userRating
                        );
                        break;
                        
                    case 'GROUP_CAPACITY_LIMIT':
                        checkResult = rule.check(
                            group.memberCount,
                            group.maxMembers
                        );
                        break;
                        
                    case 'MINIMUM_MEMBERS_REQUIREMENT':
                        checkResult = rule.check(group.memberCount);
                        break;
                        
                    case 'INVITATION_REQUIRED':
                        checkResult = rule.check(
                            userContext.hasInvitation,
                            userContext.hasReferral,
                            group.type
                        );
                        break;
                        
                    case 'REFERRER_VERIFICATION':
                        checkResult = rule.check(
                            userContext.referrers,
                            groupId
                        );
                        break;
                        
                    case 'NO_DUPLICATE_MEMBERSHIP':
                        checkResult = rule.check(
                            userContext.userId,
                            group.members || []
                        );
                        break;
                        
                    case 'FOUNDER_APPROVAL_REQUIRED':
                        checkResult = rule.check(
                            group.type,
                            userContext.founderApproved
                        );
                        break;
                        
                    case 'BLACKLIST_BLOCK':
                        checkResult = rule.check(
                            userContext.isBlacklisted,
                            options.isFounder || false
                        );
                        break;
                        
                    case 'ACTIVE_LOAN_RESTRICTION':
                        checkResult = rule.check(
                            userContext.hasActiveLoans,
                            'switch_group'
                        );
                        break;
                        
                    case 'SWITCH_COOLDOWN':
                        checkResult = rule.check(userContext.lastSwitchTime);
                        break;
                        
                    case 'MIGRATION_WITH_GOOD_RECORD':
                        checkResult = rule.check(
                            userContext.repaymentRate,
                            userContext.defaultCount,
                            options.migrationType || 'regular'
                        );
                        break;
                        
                    default:
                        checkResult = true;
                }
                
                if (!checkResult) {
                    validationResults.allowed = false;
                    validationResults.failed_rules.push({
                        rule: rule.code,
                        description: rule.description,
                        error_message: this._formatRuleErrorMessage(rule, userContext, group)
                    });
                    
                    if (!validationResults.reason) {
                        validationResults.reason = rule.errorMessage;
                        validationResults.rule = rule.code;
                    }
                } else {
                    validationResults.passed_rules.push({
                        rule: rule.code,
                        description: rule.description
                    });
                }
            } catch (error) {
                console.error(`Error checking rule ${rule.code}:`, error);
                validationResults.allowed = false;
                validationResults.failed_rules.push({
                    rule: rule.code,
                    description: rule.description,
                    error: error.message
                });
            }
        });
        
        // Additional validation based on user role
        if (userContext.userRole === 'borrower') {
            // Check if this would exceed max groups for borrower
            if (userContext.currentGroupCount >= 4 && !this._isUserInGroup(groupId)) {
                validationResults.allowed = false;
                validationResults.failed_rules.push({
                    rule: 'BORROWER_MAX_GROUPS',
                    description: 'Borrowers limited to 4 groups',
                    error_message: 'Maximum of 4 groups reached for borrowers'
                });
            }
        }
        
        // Check permission system
        if (this.permissionChecker) {
            const canSwitch = this.permissionChecker.canPerform('switch', 'group', {
                from_group: this._currentGroup?.id,
                to_group: groupId,
                user_role: userContext.userRole
            });
            
            if (!canSwitch.allowed) {
                validationResults.allowed = false;
                validationResults.failed_rules.push({
                    rule: 'PERMISSION_DENIED',
                    description: 'Permission system denied group switch',
                    error_message: canSwitch.reason || 'Permission denied'
                });
            }
        }
        
        return validationResults;
    }
    
    async validateGroupJoin(groupId, options = {}) {
        // Similar to switch validation but for new joins
        const switchValidation = await this.validateGroupSwitch(groupId, options);
        
        if (!switchValidation.allowed) {
            return switchValidation;
        }
        
        // Additional join-specific validations
        const group = await this._fetchGroupDetails(groupId);
        
        // Check if group is accepting new members
        if (group.status !== 'active' && group.status !== 'open') {
            return {
                allowed: false,
                reason: 'Group is not accepting new members',
                details: { group_status: group.status }
            };
        }
        
        // Check if user meets group-specific requirements
        if (group.requirements) {
            const meetsRequirements = await this._checkGroupRequirements(group.requirements);
            if (!meetsRequirements.allowed) {
                return {
                    allowed: false,
                    reason: 'Does not meet group requirements',
                    details: meetsRequirements.failed
                };
            }
        }
        
        return { allowed: true, group: group };
    }
    
    async validateGroupLeave(groupId, options = {}) {
        const validationResults = {
            allowed: true,
            failed_rules: [],
            reason: null
        };
        
        // Check if user is in the group
        if (!this._isUserInGroup(groupId)) {
            validationResults.allowed = false;
            validationResults.reason = 'Not a member of this group';
            return validationResults;
        }
        
        // Get group details
        const group = await this._fetchGroupDetails(groupId);
        const membership = this._groupMemberships.find(g => g.id === groupId);
        
        // Rule: Active loan restriction
        if (options.hasActiveLoans && GROUP_SWITCHING_RULES.ACTIVE_LOAN_RESTRICTION) {
            const checkResult = GROUP_SWITCHING_RULES.ACTIVE_LOAN_RESTRICTION.check(
                options.hasActiveLoans,
                'leave_group'
            );
            
            if (!checkResult) {
                validationResults.allowed = false;
                validationResults.failed_rules.push({
                    rule: 'ACTIVE_LOAN_RESTRICTION',
                    description: GROUP_SWITCHING_RULES.ACTIVE_LOAN_RESTRICTION.description,
                    error_message: GROUP_SWITCHING_RULES.ACTIVE_LOAN_RESTRICTION.errorMessage()
                });
                validationResults.reason = 'Cannot leave with active loans';
            }
        }
        
        // Rule: Founder transfer requirement
        if (membership?.isFounder && !options.transferToUserId) {
            validationResults.allowed = false;
            validationResults.failed_rules.push({
                rule: 'FOUNDER_TRANSFER_REQUIRED',
                description: 'Group founders must transfer ownership before leaving',
                error_message: 'Must transfer ownership to another member'
            });
            validationResults.reason = 'Founder must transfer ownership';
        }
        
        // Check if leaving would leave group below minimum members
        if (group.memberCount <= 5 && !options.force) {
            validationResults.allowed = false;
            validationResults.failed_rules.push({
                rule: 'MINIMUM_MEMBERS_AFTER_LEAVE',
                description: 'Cannot leave if group would have less than 5 members',
                error_message: 'Group would have less than minimum required members'
            });
            validationResults.reason = 'Group needs minimum 5 members';
        }
        
        return validationResults;
    }
    
    // ============================================================================
    // 3.4 Pre and Post Switch Actions
    // ============================================================================
    
    async _performPreSwitchActions(fromGroupId, toGroupId) {
        this._log('Performing pre-switch actions', { 
            from: fromGroupId, 
            to: toGroupId 
        });
        
        // Clear any cached data from previous group
        await this._clearGroupCache(fromGroupId);
        
        // Notify group members about user leaving (if applicable)
        if (fromGroupId) {
            await this._notifyGroupLeave(fromGroupId);
        }
        
        // Set switch cooldown
        this._setSwitchCooldown();
        
        // Save current group state
        await this._saveGroupState(fromGroupId);
    }
    
    async _performPostSwitchActions(fromGroupId, toGroupId) {
        this._log('Performing post-switch actions', { 
            from: fromGroupId, 
            to: toGroupId 
        });
        
        // Load group dashboard
        await this._loadGroupDashboard(toGroupId);
        
        // Update UI components for new group
        await this._updateUIForGroup(toGroupId);
        
        // Send notifications about group switch
        await this._sendGroupSwitchNotification(fromGroupId, toGroupId);
        
        // Log security event
        await this._logSecurityEvent('GROUP_SWITCH', {
            user_id: this.userData.id,
            from_group: fromGroupId,
            to_group: toGroupId,
            timestamp: new Date().toISOString()
        });
        
        // Persist group change
        await this._persistGroupChange(toGroupId);
        
        // Update group statistics
        await this._updateGroupStatistics(toGroupId);
    }
    
    async _clearGroupCache(groupId) {
        if (!groupId) return;
        
        try {
            // Clear group-specific cached data
            if (window.localStorage) {
                const keysToRemove = [];
                
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key.includes(`group_${groupId}`)) {
                        keysToRemove.push(key);
                    }
                }
                
                keysToRemove.forEach(key => localStorage.removeItem(key));
            }
            
            // Clear from memory cache
            this._groupDataCache.delete(groupId);
            
        } catch (error) {
            console.warn('Failed to clear group cache:', error);
        }
    }
    
    async _loadGroupDashboard(groupId) {
        const group = await this._fetchGroupDetails(groupId);
        if (!group) return;
        
        // Emit event for dashboard controller
        const event = new CustomEvent('mpesewa:group-dashboard-load', {
            detail: {
                group: group,
                userRole: this._getUserRoleInGroup(groupId),
                userId: this.userData.id
            }
        });
        window.dispatchEvent(event);
    }
    
    async _updateUIForGroup(groupId) {
        const group = await this._fetchGroupDetails(groupId);
        if (!group) return;
        
        const userRole = this._getUserRoleInGroup(groupId);
        
        // Update group indicator in UI
        const groupIndicator = document.getElementById('group-indicator');
        if (groupIndicator) {
            groupIndicator.innerHTML = `
                <span class="group-icon">${GROUP_TYPES[group.type]?.icon || '👥'}</span>
                <span class="group-name">${group.name}</span>
                <span class="group-role">(${userRole})</span>
            `;
        }
        
        // Emit UI update event
        const event = new CustomEvent('mpesewa:ui-group-update', {
            detail: {
                group: group,
                userRole: userRole,
                user: this.userData
            }
        });
        window.dispatchEvent(event);
    }
    
    // ============================================================================
    // 3.5 Group Membership Management
    // ============================================================================
    
    async _addGroupMembership(group, userRole = 'member') {
        // Check if already in memberships
        if (this._groupMemberships.some(g => g.id === group.id)) {
            return;
        }
        
        const membership = {
            ...group,
            userRole: userRole,
            joinedDate: new Date().toISOString(),
            isFounder: false, // This would be set based on actual data
            memberSince: new Date().toISOString(),
            permissions: this._getRolePermissions(userRole)
        };
        
        this._groupMemberships.push(membership);
        
        // Sort by most recent
        this._groupMemberships.sort((a, b) => {
            return new Date(b.joinedDate) - new Date(a.joinedDate);
        });
        
        // Save to localStorage
        this._saveMemberships();
    }
    
    async _joinGroup(group, options) {
        try {
            // API call to join group
            const response = await fetch('/api/groups/join', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.userData.token}`
                },
                body: JSON.stringify({
                    group_id: group.id,
                    user_id: this.userData.id,
                    user_role: options.userRole || 'member',
                    referrer_ids: options.referrerIds || [],
                    invitation_id: options.invitationId,
                    metadata: options.metadata || {}
                })
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to join group');
            }
            
            const result = await response.json();
            
            this._log('Group join successful', {
                group: group.name,
                userId: this.userData.id,
                result: result
            });
            
            return {
                success: true,
                group: group,
                membership: result.membership,
                message: `Successfully joined ${group.name}`
            };
            
        } catch (error) {
            console.error('Group join failed:', error);
            return {
                success: false,
                error: error.message,
                group: group
            };
        }
    }
    
    async _leaveGroup(groupId, options) {
        try {
            // API call to leave group
            const response = await fetch(`/api/groups/${groupId}/leave`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.userData.token}`
                },
                body: JSON.stringify({
                    user_id: this.userData.id,
                    transfer_to: options.transferToUserId,
                    reason: options.reason || 'voluntary',
                    metadata: options.metadata || {}
                })
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to leave group');
            }
            
            const result = await response.json();
            
            this._log('Group leave successful', {
                groupId: groupId,
                userId: this.userData.id,
                result: result
            });
            
            return {
                success: true,
                message: 'Successfully left group',
                data: result
            };
            
        } catch (error) {
            console.error('Group leave failed:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    async _transferGroupOwnership(groupId, newOwnerId) {
        try {
            const response = await fetch(`/api/groups/${groupId}/transfer-ownership`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.userData.token}`
                },
                body: JSON.stringify({
                    current_owner_id: this.userData.id,
                    new_owner_id: newOwnerId,
                    timestamp: new Date().toISOString()
                })
            });
            
            if (!response.ok) {
                throw new Error('Failed to transfer ownership');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Ownership transfer failed:', error);
            throw error;
        }
    }
    
    // ============================================================================
    // 3.6 Utility Methods
    // ============================================================================
    
    async _fetchGroupDetails(groupId) {
        // Check cache first
        if (this._groupDataCache.has(groupId)) {
            return this._groupDataCache.get(groupId);
        }
        
        try {
            // In production, this would be an API call
            const response = await fetch(`/api/groups/${groupId}`, {
                headers: {
                    'Authorization': `Bearer ${this.userData.token}`
                }
            });
            
            if (!response.ok) {
                throw new Error(`Failed to fetch group: ${groupId}`);
            }
            
            const groupData = await response.json();
            
            // Cache the data
            this._groupDataCache.set(groupId, groupData);
            
            return groupData;
            
        } catch (error) {
            console.error('Failed to fetch group details:', error);
            
            // Return mock data for development
            return {
                id: groupId,
                name: `Group ${groupId}`,
                country: this.userData.country || 'KE',
                type: 'social',
                memberCount: 50,
                maxMembers: 1000,
                status: 'active',
                createdAt: new Date().toISOString(),
                founder: { id: 'founder_1', name: 'Group Founder' }
            };
        }
    }
    
    async _fetchAvailableGroups(country) {
        try {
            const response = await fetch(`/api/groups/available?country=${country}`, {
                headers: {
                    'Authorization': `Bearer ${this.userData.token}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch available groups');
            }
            
            return await response.json();
            
        } catch (error) {
            console.error('Failed to fetch available groups:', error);
            return [];
        }
    }
    
    async _fetchInvitations(userId) {
        try {
            const response = await fetch(`/api/users/${userId}/invitations`, {
                headers: {
                    'Authorization': `Bearer ${this.userData.token}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch invitations');
            }
            
            return await response.json();
            
        } catch (error) {
            console.error('Failed to fetch invitations:', error);
            return [];
        }
    }
    
    async _fetchReferrals(userId) {
        try {
            const response = await fetch(`/api/users/${userId}/referrals`, {
                headers: {
                    'Authorization': `Bearer ${this.userData.token}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch referrals');
            }
            
            return await response.json();
            
        } catch (error) {
            console.error('Failed to fetch referrals:', error);
            return [];
        }
    }
    
    async _checkGroupEligibility(group) {
        const eligibility = {
            allowed: true,
            requirements: [],
            failed_requirements: [],
            warnings: []
        };
        
        // Check country match
        if (group.country !== this.userData.country) {
            eligibility.allowed = false;
            eligibility.failed_requirements.push('COUNTRY_MISMATCH');
            eligibility.requirements.push(`Must be in ${group.country}`);
        }
        
        // Check group capacity
        if (group.memberCount >= group.maxMembers) {
            eligibility.allowed = false;
            eligibility.failed_requirements.push('GROUP_FULL');
            eligibility.requirements.push('Group is full');
        }
        
        // Check invitation requirement
        if (group.requiresInvitation && !this._hasInvitationForGroup(group.id)) {
            eligibility.allowed = false;
            eligibility.failed_requirements.push('INVITATION_REQUIRED');
            eligibility.requirements.push('Invitation required');
        }
        
        // Check minimum rating for social groups
        if (group.type === 'social' && (this.userData.rating || 0) < 3.5) {
            eligibility.allowed = false;
            eligibility.failed_requirements.push('RATING_TOO_LOW');
            eligibility.requirements.push('Minimum 3.5 rating required');
        }
        
        // Check for family groups (requires verification)
        if (group.type === 'family') {
            eligibility.requirements.push('Family verification required');
        }
        
        // Check for professional groups
        if (group.type === 'professional') {
            eligibility.requirements.push('Professional verification required');
        }
        
        return eligibility;
    }
    
    async _checkGroupRequirements(requirements) {
        const result = {
            allowed: true,
            passed: [],
            failed: []
        };
        
        for (const requirement of requirements) {
            switch (requirement.type) {
                case 'MINIMUM_RATING':
                    if ((this.userData.rating || 0) < requirement.value) {
                        result.allowed = false;
                        result.failed.push(`Minimum rating ${requirement.value} required`);
                    } else {
                        result.passed.push(`Rating: ${this.userData.rating}`);
                    }
                    break;
                    
                case 'MINIMUM_REPAYMENT_RATE':
                    if ((this.userData.repayment_rate || 0) < requirement.value) {
                        result.allowed = false;
                        result.failed.push(`Minimum repayment rate ${requirement.value}% required`);
                    } else {
                        result.passed.push(`Repayment rate: ${this.userData.repayment_rate}%`);
                    }
                    break;
                    
                case 'NO_DEFAULTS':
                    if ((this.userData.default_count || 0) > 0) {
                        result.allowed = false;
                        result.failed.push('No defaults allowed');
                    } else {
                        result.passed.push('No defaults');
                    }
                    break;
                    
                case 'LOCATION_VERIFICATION':
                    if (!this.userData.location_verified) {
                        result.allowed = false;
                        result.failed.push('Location verification required');
                    } else {
                        result.passed.push('Location verified');
                    }
                    break;
                    
                case 'ID_VERIFICATION':
                    if (!this.userData.id_verified) {
                        result.allowed = false;
                        result.failed.push('ID verification required');
                    } else {
                        result.passed.push('ID verified');
                    }
                    break;
            }
        }
        
        return result;
    }
    
    async _processInvitation(invitationId) {
        try {
            const response = await fetch(`/api/invitations/${invitationId}/accept`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.userData.token}`
                },
                body: JSON.stringify({
                    user_id: this.userData.id,
                    timestamp: new Date().toISOString()
                })
            });
            
            if (!response.ok) {
                throw new Error('Failed to process invitation');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Failed to process invitation:', error);
            throw error;
        }
    }
    
    async _processReferrals(groupId, referrerIds) {
        try {
            const response = await fetch(`/api/groups/${groupId}/process-referrals`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.userData.token}`
                },
                body: JSON.stringify({
                    user_id: this.userData.id,
                    referrer_ids: referrerIds,
                    timestamp: new Date().toISOString()
                })
            });
            
            if (!response.ok) {
                throw new Error('Failed to process referrals');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Failed to process referrals:', error);
            throw error;
        }
    }
    
    _isUserInGroup(groupId) {
        return this._groupMemberships.some(group => group.id === groupId);
    }
    
    _getUserRoleInGroup(groupId) {
        const membership = this._groupMemberships.find(g => g.id === groupId);
        return membership?.userRole || 'non-member';
    }
    
    _hasInvitationForGroup(groupId) {
        return this._invitations.some(invite => 
            invite.groupId === groupId && invite.status === 'pending'
        );
    }
    
    _hasReferralForGroup(groupId) {
        return this._referrals.some(ref => 
            ref.groupId === groupId && ref.status === 'active'
        );
    }
    
    _getRolePermissions(userRole) {
        const permissions = {
            member: ['view_group', 'view_members', 'request_loan'],
            lender: ['view_group', 'view_members', 'lend_money', 'create_ledger'],
            borrower: ['view_group', 'view_members', 'request_loan', 'view_loans'],
            admin: ['view_group', 'view_members', 'invite_members', 'remove_members', 'manage_settings'],
            founder: ['view_group', 'view_members', 'invite_members', 'remove_members', 'manage_settings', 'transfer_ownership', 'disband_group']
        };
        
        return permissions[userRole] || permissions.member;
    }
    
    _formatRuleErrorMessage(rule, userContext, group) {
        if (typeof rule.errorMessage === 'function') {
            return rule.errorMessage(
                group.country,
                userContext.userCountry,
                group.name,
                userContext.currentGroupCount,
                userContext.userRating,
                group.memberCount
            );
        }
        return rule.errorMessage;
    }
    
    _setSwitchCooldown() {
        const cooldownKey = 'group_switch_cooldown';
        const cooldownDuration = 24 * 60 * 60 * 1000; // 24 hours
        
        if (window.localStorage) {
            localStorage.setItem(cooldownKey, JSON.stringify({
                timestamp: Date.now(),
                expires: Date.now() + cooldownDuration
            }));
        }
    }
    
    _getLastSwitchTime() {
        try {
            if (window.localStorage) {
                const cooldownData = localStorage.getItem('group_switch_cooldown');
                if (cooldownData) {
                    const { timestamp } = JSON.parse(cooldownData);
                    return timestamp;
                }
            }
        } catch (error) {
            console.warn('Failed to get last switch time:', error);
        }
        return null;
    }
    
    async _updateAvailableGroups() {
        await this._loadAvailableGroups();
        
        // Emit update event
        const event = new CustomEvent('mpesewa:available-groups-updated', {
            detail: {
                availableGroups: this._availableGroups,
                memberships: this._groupMemberships
            }
        });
        window.dispatchEvent(event);
    }
    
    _recordGroupSwitch(fromGroupId, toGroupId, options) {
        const switchRecord = {
            id: `group_switch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            from_group: fromGroupId,
            to_group: toGroupId,
            timestamp: new Date().toISOString(),
            user_id: this.userData.id,
            country: this.userData.country,
            user_role: options.userRole || 'member',
            ip_address: options.ipAddress || 'unknown',
            metadata: options.metadata || {}
        };
        
        this._switchHistory.unshift(switchRecord);
        
        // Keep only last 100 switches
        if (this._switchHistory.length > 100) {
            this._switchHistory.pop();
        }
        
        // Save to localStorage
        this._saveSwitchHistory();
        
        return switchRecord;
    }
    
    _recordGroupJoin(groupId, options) {
        const joinRecord = {
            id: `group_join_${Date.now()}`,
            group_id: groupId,
            timestamp: new Date().toISOString(),
            user_id: this.userData.id,
            method: options.invitationId ? 'invitation' : 'application',
            referrers: options.referrerIds || [],
            metadata: options.metadata || {}
        };
        
        // Add to switch history
        this._switchHistory.unshift(joinRecord);
        
        // Save
        this._saveSwitchHistory();
        
        return joinRecord;
    }
    
    _recordGroupLeave(groupId, options) {
        const leaveRecord = {
            id: `group_leave_${Date.now()}`,
            group_id: groupId,
            timestamp: new Date().toISOString(),
            user_id: this.userData.id,
            reason: options.reason || 'voluntary',
            transfer_to: options.transferToUserId,
            metadata: options.metadata || {}
        };
        
        // Add to switch history
        this._switchHistory.unshift(leaveRecord);
        
        // Save
        this._saveSwitchHistory();
        
        return leaveRecord;
    }
    
    _loadSwitchHistory() {
        try {
            if (window.localStorage) {
                const savedHistory = localStorage.getItem('mpesewa_group_switch_history');
                if (savedHistory) {
                    this._switchHistory = JSON.parse(savedHistory);
                }
            }
        } catch (error) {
            console.warn('Failed to load switch history:', error);
        }
    }
    
    _saveSwitchHistory() {
        try {
            if (window.localStorage) {
                localStorage.setItem(
                    'mpesewa_group_switch_history',
                    JSON.stringify(this._switchHistory)
                );
            }
        } catch (error) {
            console.warn('Failed to save switch history:', error);
        }
    }
    
    _saveMemberships() {
        try {
            if (window.localStorage) {
                localStorage.setItem(
                    'mpesewa_group_memberships',
                    JSON.stringify(this._groupMemberships.map(g => ({
                        id: g.id,
                        userRole: g.userRole,
                        joinedDate: g.joinedDate
                    })))
                );
            }
        } catch (error) {
            console.warn('Failed to save memberships:', error);
        }
    }
    
    async _saveGroupState(groupId) {
        if (!groupId) return;
        
        try {
            if (window.localStorage) {
                const stateKey = `mpesewa_group_state_${groupId}`;
                const state = {
                    last_accessed: new Date().toISOString(),
                    user_id: this.userData.id,
                    user_role: this._getUserRoleInGroup(groupId)
                };
                
                localStorage.setItem(stateKey, JSON.stringify(state));
            }
        } catch (error) {
            console.warn('Failed to save group state:', error);
        }
    }
    
    async _persistGroupChange(groupId) {
        try {
            const response = await fetch('/api/user/update-current-group', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.userData.token}`
                },
                body: JSON.stringify({
                    user_id: this.userData.id,
                    current_group_id: groupId,
                    timestamp: new Date().toISOString()
                })
            });
            
            if (!response.ok) {
                throw new Error('Failed to persist group change');
            }
            
            return await response.json();
        } catch (error) {
            console.warn('Failed to persist group change:', error);
        }
    }
    
    async _notifyGroupLeave(groupId) {
        // Notify group members about user leaving
        try {
            const event = new CustomEvent('mpesewa:group-member-leaving', {
                detail: {
                    group_id: groupId,
                    user_id: this.userData.id,
                    user_name: this.userData.username,
                    timestamp: new Date().toISOString()
                }
            });
            window.dispatchEvent(event);
        } catch (error) {
            console.warn('Failed to notify group leave:', error);
        }
    }
    
    async _sendGroupSwitchNotification(fromGroupId, toGroupId) {
        try {
            const notificationEvent = new CustomEvent('mpesewa:notification', {
                detail: {
                    type: 'group_switch',
                    title: 'Group Changed',
                    message: `You are now in ${this._currentGroup?.name || 'new group'}`,
                    icon: '👥',
                    timestamp: new Date().toISOString()
                }
            });
            window.dispatchEvent(notificationEvent);
        } catch (error) {
            console.warn('Failed to send notification:', error);
        }
    }
    
    async _updateGroupStatistics(groupId) {
        try {
            // Update group statistics after user joins
            const event = new CustomEvent('mpesewa:group-statistics-update', {
                detail: {
                    group_id: groupId,
                    action: 'member_joined',
                    user_id: this.userData.id
                }
            });
            window.dispatchEvent(event);
        } catch (error) {
            console.warn('Failed to update group statistics:', error);
        }
    }
    
    async _logSecurityEvent(eventType, data) {
        try {
            const securityEvent = new CustomEvent('mpesewa:security-event', {
                detail: {
                    event_type: eventType,
                    ...data,
                    severity: 'medium',
                    source: 'group_switcher'
                }
            });
            window.dispatchEvent(securityEvent);
        } catch (error) {
            console.warn('Failed to log security event:', error);
        }
    }
    
    _log(message, data = {}) {
        console.log(`[M-Pesewa Group Switcher] ${message}`, {
            ...data,
            timestamp: new Date().toISOString()
        });
    }
    
    // ============================================================================
    // 3.7 Public API Methods
    // ============================================================================
    
    getCurrentGroup() {
        return this._currentGroup;
    }
    
    getGroupMemberships() {
        return [...this._groupMemberships];
    }
    
    getAvailableGroups() {
        return [...this._availableGroups];
    }
    
    getInvitations() {
        return [...this._invitations];
    }
    
    getReferrals() {
        return [...this._referrals];
    }
    
    getSwitchHistory(limit = 20) {
        return this._switchHistory.slice(0, limit);
    }
    
    getUserRoleInGroup(groupId) {
        return this._getUserRoleInGroup(groupId);
    }
    
    isUserInGroup(groupId) {
        return this._isUserInGroup(groupId);
    }
    
    canUserJoinGroup(groupId) {
        const group = this._availableGroups.find(g => g.id === groupId);
        return group?.canJoin || false;
    }
    
    getGroupEligibility(groupId) {
        const group = this._availableGroups.find(g => g.id === groupId);
        return group?.eligibility || { allowed: false, requirements: [] };
    }
    
    refreshData() {
        return this._initialize();
    }
    
    clearCache() {
        this._groupDataCache.clear();
        if (window.localStorage) {
            // Clear group-related localStorage items
            const keysToRemove = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key.includes('mpesewa_group')) {
                    keysToRemove.push(key);
                }
            }
            keysToRemove.forEach(key => localStorage.removeItem(key));
        }
        return this;
    }
    
    // ============================================================================
    // 3.8 Static Methods
    // ============================================================================
    
    static get GROUP_TYPES() {
        return GROUP_TYPES;
    }
    
    static get GROUP_RULES() {
        return GROUP_RULES;
    }
    
    static get GROUP_SWITCHING_RULES() {
        return GROUP_SWITCHING_RULES;
    }
    
    static createForUser(userData, navigationState = null, permissionChecker = null) {
        return new MpesewaGroupSwitcher(userData, navigationState, permissionChecker);
    }
}

// ============================================================================
// 4️⃣ ERROR CLASSES
// ============================================================================

class GroupSwitchError extends Error {
    constructor(message, rule = null, details = null) {
        super(message);
        this.name = 'GroupSwitchError';
        this.rule = rule;
        this.details = details;
        this.timestamp = new Date().toISOString();
    }
    
    toJSON() {
        return {
            error: this.name,
            message: this.message,
            rule: this.rule,
            details: this.details,
            timestamp: this.timestamp
        };
    }
}

// ============================================================================
// 5️⃣ GROUP SWITCHER UI COMPONENT
// ============================================================================

class MpesewaGroupSwitcherUI {
    constructor(groupSwitcher, containerSelector = '#group-switcher') {
        this.groupSwitcher = groupSwitcher;
        this.containerSelector = containerSelector;
        this.container = null;
        this._isOpen = false;
        this._eventListeners = new Map();
        
        this._initializeUI();
    }
    
    async _initializeUI() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            await new Promise(resolve => {
                document.addEventListener('DOMContentLoaded', resolve);
            });
        }
        
        this.container = document.querySelector(this.containerSelector);
        
        if (!this.container) {
            console.warn(`Group switcher container not found: ${this.containerSelector}`);
            return;
        }
        
        this._render();
        this._attachEventListeners();
        this._setupEventHandlers();
    }
    
    _render() {
        const currentGroup = this.groupSwitcher.getCurrentGroup();
        const memberships = this.groupSwitcher.getGroupMemberships();
        const invitations = this.groupSwitcher.getInvitations();
        
        this.container.innerHTML = `
            <div class="group-switcher-wrapper">
                <button class="group-switcher-toggle" id="group-switcher-toggle" 
                        aria-label="Switch group" aria-haspopup="true" aria-expanded="${this._isOpen}">
                    <span class="current-group-indicator">
                        ${currentGroup ? `
                            <span class="group-icon">${GROUP_TYPES[currentGroup.type]?.icon || '👥'}</span>
                            <span class="group-name">${currentGroup.name}</span>
                            <span class="group-members">(${currentGroup.memberCount || 0} members)</span>
                            <span class="dropdown-arrow">▾</span>
                        ` : `
                            <span class="group-icon">👥</span>
                            <span class="group-name">Select Group</span>
                            <span class="dropdown-arrow">▾</span>
                        `}
                    </span>
                </button>
                
                <div class="group-switcher-dropdown" id="group-switcher-dropdown" 
                     aria-hidden="${!this._isOpen}" style="display: ${this._isOpen ? 'block' : 'none'}">
                    <div class="dropdown-header">
                        <h3>Group Management</h3>
                        <p class="dropdown-subtitle">Switch between your groups or join new ones</p>
                    </div>
                    
                    <div class="tabs" id="group-switcher-tabs">
                        <button class="tab-btn active" data-tab="my-groups">My Groups (${memberships.length})</button>
                        <button class="tab-btn" data-tab="available-groups">Available Groups</button>
                        <button class="tab-btn" data-tab="invitations">Invitations (${invitations.length})</button>
                    </div>
                    
                    <div class="tab-content" id="group-switcher-tab-content">
                        <div class="tab-pane active" id="tab-my-groups">
                            ${this._renderMyGroups(memberships)}
                        </div>
                        <div class="tab-pane" id="tab-available-groups">
                            ${this._renderAvailableGroups()}
                        </div>
                        <div class="tab-pane" id="tab-invitations">
                            ${this._renderInvitations(invitations)}
                        </div>
                    </div>
                    
                    <div class="dropdown-footer">
                        <div class="group-actions">
                            <button class="btn btn-outline btn-small" id="create-group-btn">
                                Create New Group
                            </button>
                            <button class="btn btn-outline btn-small" id="refresh-groups-btn">
                                Refresh
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    _renderMyGroups(memberships) {
        if (!memberships || memberships.length === 0) {
            return `
                <div class="empty-state">
                    <div class="empty-state-icon">👥</div>
                    <h4>No Groups</h4>
                    <p>You are not a member of any groups yet.</p>
                    <button class="btn btn-primary btn-small" id="join-first-group-btn">
                        Join Your First Group
                    </button>
                </div>
            `;
        }
        
        return `
            <div class="groups-list">
                ${memberships.map(group => {
                    const isCurrent = group.id === this.groupSwitcher.getCurrentGroup()?.id;
                    const groupType = GROUP_TYPES[group.type] || GROUP_TYPES.SOCIAL;
                    
                    return `
                        <div class="group-item ${isCurrent ? 'current' : ''}" 
                             data-group-id="${group.id}">
                            <div class="group-item-content">
                                <span class="group-icon">${groupType.icon}</span>
                                <div class="group-info">
                                    <h4 class="group-name">${group.name}</h4>
                                    <div class="group-meta">
                                        <span class="group-type">${groupType.name}</span>
                                        <span class="group-members">${group.memberCount || 0} members</span>
                                        <span class="group-role">${group.userRole || 'member'}</span>
                                    </div>
                                    <div class="group-stats">
                                        <span class="stat">Loans: ${group.activeLoans || 0}</span>
                                        <span class="stat">Repayment: ${group.repaymentRate || '0%'}</span>
                                        <span class="stat">Active: ${group.activeLenders || 0} lenders</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="group-actions">
                                ${isCurrent ? `
                                    <span class="current-badge">Current</span>
                                ` : `
                                    <button class="switch-group-btn btn btn-small" 
                                            data-group-id="${group.id}"
                                            aria-label="Switch to ${group.name}">
                                        Switch
                                    </button>
                                `}
                                <button class="leave-group-btn btn btn-outline btn-small" 
                                        data-group-id="${group.id}"
                                        aria-label="Leave ${group.name}">
                                    Leave
                                </button>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }
    
    _renderAvailableGroups() {
        const availableGroups = this.groupSwitcher.getAvailableGroups();
        
        if (!availableGroups || availableGroups.length === 0) {
            return `
                <div class="empty-state">
                    <div class="empty-state-icon">🔍</div>
                    <h4>No Groups Available</h4>
                    <p>No groups available to join at the moment.</p>
                    <p class="small">Check back later or ask for an invitation.</p>
                </div>
            `;
        }
        
        return `
            <div class="available-groups-list">
                ${availableGroups.map(group => {
                    const groupType = GROUP_TYPES[group.type] || GROUP_TYPES.SOCIAL;
                    const canJoin = group.canJoin;
                    
                    return `
                        <div class="available-group-item ${canJoin ? 'joinable' : 'restricted'}" 
                             data-group-id="${group.id}">
                            <div class="group-item-content">
                                <span class="group-icon">${groupType.icon}</span>
                                <div class="group-info">
                                    <h4 class="group-name">${group.name}</h4>
                                    <div class="group-meta">
                                        <span class="group-type">${groupType.name}</span>
                                        <span class="group-country">${group.country}</span>
                                        <span class="group-members">${group.memberCount || 0}/1000 members</span>
                                    </div>
                                    <p class="group-description">${group.description || groupType.description}</p>
                                    
                                    ${group.requirements && group.requirements.length > 0 ? `
                                        <div class="group-requirements">
                                            <strong>Requirements:</strong>
                                            <ul>
                                                ${group.requirements.map(req => `<li>${req}</li>`).join('')}
                                            </ul>
                                        </div>
                                    ` : ''}
                                    
                                    ${!canJoin && group.eligibility?.failed_requirements ? `
                                        <div class="group-restrictions">
                                            <strong>Cannot join because:</strong>
                                            <ul>
                                                ${group.eligibility.failed_requirements.map(req => 
                                                    `<li>${req.replace('_', ' ')}</li>`
                                                ).join('')}
                                            </ul>
                                        </div>
                                    ` : ''}
                                </div>
                            </div>
                            
                            <div class="group-actions">
                                ${canJoin ? `
                                    <button class="join-group-btn btn btn-primary btn-small" 
                                            data-group-id="${group.id}"
                                            aria-label="Join ${group.name}">
                                        Join Group
                                    </button>
                                ` : `
                                    <span class="restricted-badge">Restricted</span>
                                `}
                                
                                <button class="view-group-btn btn btn-outline btn-small" 
                                        data-group-id="${group.id}"
                                        aria-label="View ${group.name} details">
                                    View
                                </button>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }
    
    _renderInvitations(invitations) {
        if (!invitations || invitations.length === 0) {
            return `
                <div class="empty-state">
                    <div class="empty-state-icon">📨</div>
                    <h4>No Invitations</h4>
                    <p>You don't have any pending group invitations.</p>
                </div>
            `;
        }
        
        return `
            <div class="invitations-list">
                ${invitations.map(invite => {
                    const groupType = GROUP_TYPES[invite.groupType] || GROUP_TYPES.SOCIAL;
                    
                    return `
                        <div class="invitation-item" data-invitation-id="${invite.id}">
                            <div class="invitation-content">
                                <span class="invitation-icon">📨</span>
                                <div class="invitation-info">
                                    <h4 class="group-name">${invite.groupName}</h4>
                                    <div class="invitation-meta">
                                        <span class="invited-by">Invited by: ${invite.invitedByName}</span>
                                        <span class="invitation-date">${new Date(invite.invitationDate).toLocaleDateString()}</span>
                                        <span class="expires">Expires: ${new Date(invite.expiresAt).toLocaleDateString()}</span>
                                    </div>
                                    ${invite.message ? `
                                        <p class="invitation-message">"${invite.message}"</p>
                                    ` : ''}
                                </div>
                            </div>
                            
                            <div class="invitation-actions">
                                <button class="accept-invitation-btn btn btn-primary btn-small" 
                                        data-invitation-id="${invite.id}"
                                        aria-label="Accept invitation to ${invite.groupName}">
                                    Accept
                                </button>
                                <button class="decline-invitation-btn btn btn-outline btn-small" 
                                        data-invitation-id="${invite.id}"
                                        aria-label="Decline invitation to ${invite.groupName}">
                                    Decline
                                </button>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }
    
    _attachEventListeners() {
        // Toggle dropdown
        const toggleBtn = this.container.querySelector('#group-switcher-toggle');
        if (toggleBtn) {
            this._addEventListener(toggleBtn, 'click', (e) => {
                e.stopPropagation();
                this._toggleDropdown();
            });
        }
        
        // Tab switching
        const tabBtns = this.container.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            this._addEventListener(btn, 'click', (e) => {
                e.stopPropagation();
                this._switchTab(e.target.getAttribute('data-tab'));
            });
        });
        
        // Switch group buttons
        const switchBtns = this.container.querySelectorAll('.switch-group-btn');
        switchBtns.forEach(btn => {
            this._addEventListener(btn, 'click', async (e) => {
                e.stopPropagation();
                const groupId = btn.getAttribute('data-group-id');
                await this._switchGroup(groupId);
            });
        });
        
        // Join group buttons
        const joinBtns = this.container.querySelectorAll('.join-group-btn');
        joinBtns.forEach(btn => {
            this._addEventListener(btn, 'click', async (e) => {
                e.stopPropagation();
                const groupId = btn.getAttribute('data-group-id');
                await this._joinGroup(groupId);
            });
        });
        
        // Leave group buttons
        const leaveBtns = this.container.querySelectorAll('.leave-group-btn');
        leaveBtns.forEach(btn => {
            this._addEventListener(btn, 'click', async (e) => {
                e.stopPropagation();
                const groupId = btn.getAttribute('data-group-id');
                await this._leaveGroup(groupId);
            });
        });
        
        // Invitation actions
        const acceptBtns = this.container.querySelectorAll('.accept-invitation-btn');
        acceptBtns.forEach(btn => {
            this._addEventListener(btn, 'click', async (e) => {
                e.stopPropagation();
                const invitationId = btn.getAttribute('data-invitation-id');
                await this._acceptInvitation(invitationId);
            });
        });
        
        const declineBtns = this.container.querySelectorAll('.decline-invitation-btn');
        declineBtns.forEach(btn => {
            this._addEventListener(btn, 'click', async (e) => {
                e.stopPropagation();
                const invitationId = btn.getAttribute('data-invitation-id');
                await this._declineInvitation(invitationId);
            });
        });
        
        // Footer buttons
        const createGroupBtn = this.container.querySelector('#create-group-btn');
        if (createGroupBtn) {
            this._addEventListener(createGroupBtn, 'click', (e) => {
                e.stopPropagation();
                this._createNewGroup();
            });
        }
        
        const refreshBtn = this.container.querySelector('#refresh-groups-btn');
        if (refreshBtn) {
            this._addEventListener(refreshBtn, 'click', async (e) => {
                e.stopPropagation();
                await this._refreshGroups();
            });
        }
        
        const joinFirstGroupBtn = this.container.querySelector('#join-first-group-btn');
        if (joinFirstGroupBtn) {
            this._addEventListener(joinFirstGroupBtn, 'click', (e) => {
                e.stopPropagation();
                this._switchTab('available-groups');
            });
        }
        
        // View group buttons
        const viewBtns = this.container.querySelectorAll('.view-group-btn');
        viewBtns.forEach(btn => {
            this._addEventListener(btn, 'click', (e) => {
                e.stopPropagation();
                const groupId = btn.getAttribute('data-group-id');
                this._viewGroupDetails(groupId);
            });
        });
        
        // Close dropdown when clicking outside
        this._addEventListener(document, 'click', (e) => {
            if (!this.container.contains(e.target) && this._isOpen) {
                this._closeDropdown();
            }
        });
        
        // Handle escape key
        this._addEventListener(document, 'keydown', (e) => {
            if (e.key === 'Escape' && this._isOpen) {
                this._closeDropdown();
            }
        });
    }
    
    _setupEventHandlers() {
        // Listen for group changes
        this._addEventListener(window, 'mpesewa:group-changed', (e) => {
            this._updateUI();
        });
        
        // Listen for invitations updates
        this._addEventListener(window, 'mpesewa:invitations-updated', (e) => {
            this._updateUI();
        });
        
        // Listen for user data updates
        this._addEventListener(window, 'mpesewa:user-updated', (e) => {
            this.groupSwitcher.userData = e.detail.userData;
            this._updateUI();
        });
    }
    
    async _switchGroup(groupId) {
        try {
            // Show loading state
            this._showLoading(groupId, 'switching');
            
            // Perform group switch
            const result = await this.groupSwitcher.switchToGroup(groupId);
            
            if (result.success) {
                // Show success message
                this._showSuccess(`Switched to ${result.new_group.name}`);
                
                // Update UI
                this._updateUI();
                
                // Close dropdown
                this._closeDropdown();
                
                // Navigate to group dashboard
                setTimeout(() => {
                    window.location.href = `/group/${groupId}/dashboard`;
                }, 1000);
            } else {
                // Show error message
                this._showError('Switch failed', result.error);
            }
        } catch (error) {
            console.error('Group switch failed:', error);
            this._showError('Switch failed', error.message);
        }
    }
    
    async _joinGroup(groupId) {
        try {
            // Show loading state
            this._showLoading(groupId, 'joining');
            
            // Check eligibility first
            const eligibility = this.groupSwitcher.getGroupEligibility(groupId);
            
            if (!eligibility.allowed) {
                this._showError('Cannot join', eligibility.requirements.join(', '));
                return;
            }
            
            // Check for invitations
            const invitations = this.groupSwitcher.getInvitations();
            const invitation = invitations.find(inv => 
                inv.groupId === groupId && inv.status === 'pending'
            );
            
            const options = {};
            if (invitation) {
                options.invitationId = invitation.id;
            }
            
            // Join the group
            const result = await this.groupSwitcher.joinGroup(groupId, options);
            
            if (result.success) {
                // Show success message
                this._showSuccess(`Joined ${result.group.name}`);
                
                // Update UI
                await this.groupSwitcher.refreshData();
                this._updateUI();
                
                // Switch to "My Groups" tab
                this._switchTab('my-groups');
            } else {
                // Show error message
                this._showError('Join failed', result.error);
            }
        } catch (error) {
            console.error('Group join failed:', error);
            this._showError('Join failed', error.message);
        }
    }
    
    async _leaveGroup(groupId) {
        if (!confirm('Are you sure you want to leave this group?')) {
            return;
        }
        
        try {
            // Show loading state
            this._showLoading(groupId, 'leaving');
            
            // Check if user is founder
            const membership = this.groupSwitcher.getGroupMemberships()
                .find(g => g.id === groupId);
            
            const options = {};
            if (membership?.isFounder) {
                const newOwnerId = prompt('Enter user ID to transfer ownership to:');
                if (!newOwnerId) {
                    this._showError('Transfer required', 'Founder must transfer ownership');
                    return;
                }
                options.transferToUserId = newOwnerId;
            }
            
            // Leave the group
            const result = await this.groupSwitcher.leaveGroup(groupId, options);
            
            if (result.success) {
                // Show success message
                this._showSuccess('Left group successfully');
                
                // Update UI
                await this.groupSwitcher.refreshData();
                this._updateUI();
            } else {
                // Show error message
                this._showError('Leave failed', result.error);
            }
        } catch (error) {
            console.error('Group leave failed:', error);
            this._showError('Leave failed', error.message);
        }
    }
    
    async _acceptInvitation(invitationId) {
        try {
            const invitation = this.groupSwitcher.getInvitations()
                .find(inv => inv.id === invitationId);
            
            if (!invitation) {
                this._showError('Invitation not found');
                return;
            }
            
            // Join group using invitation
            const result = await this.groupSwitcher.joinGroup(invitation.groupId, {
                invitationId: invitationId,
                userRole: 'member'
            });
            
            if (result.success) {
                this._showSuccess(`Accepted invitation to ${result.group.name}`);
                await this.groupSwitcher.refreshData();
                this._updateUI();
            } else {
                this._showError('Accept failed', result.error);
            }
        } catch (error) {
            console.error('Accept invitation failed:', error);
            this._showError('Accept failed', error.message);
        }
    }
    
    async _declineInvitation(invitationId) {
        try {
            // API call to decline invitation
            const response = await fetch(`/api/invitations/${invitationId}/decline`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.groupSwitcher.userData.token}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to decline invitation');
            }
            
            this._showSuccess('Invitation declined');
            await this.groupSwitcher.refreshData();
            this._updateUI();
            
        } catch (error) {
            console.error('Decline invitation failed:', error);
            this._showError('Decline failed', error.message);
        }
    }
    
    async _refreshGroups() {
        try {
            this._showLoading(null, 'refreshing');
            await this.groupSwitcher.refreshData();
            this._updateUI();
            this._showSuccess('Groups refreshed');
        } catch (error) {
            console.error('Refresh failed:', error);
            this._showError('Refresh failed', error.message);
        }
    }
    
    _createNewGroup() {
        // Navigate to group creation page
        window.location.href = '/groups/create';
    }
    
    _viewGroupDetails(groupId) {
        // Navigate to group details page
        window.location.href = `/groups/${groupId}/details`;
    }
    
    _switchTab(tabName) {
        // Update tab buttons
        const tabBtns = this.container.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-tab') === tabName) {
                btn.classList.add('active');
            }
        });
        
        // Update tab content
        const tabPanes = this.container.querySelectorAll('.tab-pane');
        tabPanes.forEach(pane => {
            pane.classList.remove('active');
            if (pane.id === `tab-${tabName}`) {
                pane.classList.add('active');
            }
        });
    }
    
    _toggleDropdown() {
        this._isOpen = !this._isOpen;
        
        const dropdown = this.container.querySelector('#group-switcher-dropdown');
        const toggle = this.container.querySelector('#group-switcher-toggle');
        
        if (dropdown) {
            dropdown.style.display = this._isOpen ? 'block' : 'none';
            dropdown.setAttribute('aria-hidden', !this._isOpen);
        }
        
        if (toggle) {
            toggle.setAttribute('aria-expanded', this._isOpen);
        }
        
        // Update dropdown position
        if (this._isOpen) {
            this._updateDropdownPosition();
        }
    }
    
    _closeDropdown() {
        this._isOpen = false;
        
        const dropdown = this.container.querySelector('#group-switcher-dropdown');
        const toggle = this.container.querySelector('#group-switcher-toggle');
        
        if (dropdown) {
            dropdown.style.display = 'none';
            dropdown.setAttribute('aria-hidden', true);
        }
        
        if (toggle) {
            toggle.setAttribute('aria-expanded', false);
        }
    }
    
    _updateDropdownPosition() {
        const dropdown = this.container.querySelector('#group-switcher-dropdown');
        if (!dropdown) return;
        
        const toggle = this.container.querySelector('#group-switcher-toggle');
        const toggleRect = toggle.getBoundingClientRect();
        
        // Position dropdown below toggle button
        dropdown.style.position = 'absolute';
        dropdown.style.top = `${toggleRect.bottom + window.scrollY + 5}px`;
        dropdown.style.left = `${toggleRect.left + window.scrollX}px`;
        dropdown.style.minWidth = '400px';
        dropdown.style.maxWidth = '500px';
        dropdown.style.maxHeight = '500px';
        dropdown.style.overflowY = 'auto';
    }
    
    _showLoading(groupId, action) {
        // Show loading indicator
        const loadingEvent = new CustomEvent('mpesewa:loading', {
            detail: {
                action: `group_${action}`,
                groupId: groupId,
                message: `${action} group...`
            }
        });
        window.dispatchEvent(loadingEvent);
    }
    
    _showSuccess(message) {
        const notificationEvent = new CustomEvent('mpesewa:notification', {
            detail: {
                type: 'success',
                title: 'Success',
                message: message,
                duration: 3000
            }
        });
        window.dispatchEvent(notificationEvent);
    }
    
    _showError(title, message) {
        const notificationEvent = new CustomEvent('mpesewa:notification', {
            detail: {
                type: 'error',
                title: title,
                message: message,
                duration: 5000
            }
        });
        window.dispatchEvent(notificationEvent);
    }
    
    _updateUI() {
        this._render();
        this._attachEventListeners();
    }
    
    _addEventListener(element, event, handler) {
        element.addEventListener(event, handler);
        
        const key = `${element.id || element.className}_${event}`;
        if (!this._eventListeners.has(key)) {
            this._eventListeners.set(key, []);
        }
        this._eventListeners.get(key).push(handler);
    }
    
    cleanup() {
        // Remove all event listeners
        this._eventListeners.forEach((handlers, key) => {
            const [elementId, event] = key.split('_');
            const element = document.getElementById(elementId) || 
                           document.querySelector(`.${elementId}`);
            if (element) {
                handlers.forEach(handler => {
                    element.removeEventListener(event, handler);
                });
            }
        });
        this._eventListeners.clear();
    }
}

// ============================================================================
// 6️⃣ EXPORTS
// ============================================================================

export {
    MpesewaGroupSwitcher,
    MpesewaGroupSwitcherUI,
    GroupSwitchError,
    GROUP_TYPES,
    GROUP_RULES,
    GROUP_SWITCHING_RULES
};

// Default export
export default MpesewaGroupSwitcher;