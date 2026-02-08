/**
 * M-Pesewa Group Flow Orchestrator
 * Group operations: creation, member management, permissions
 * Enforces group hierarchy and country isolation rules
 */

class GroupFlow {
    constructor() {
        this.currentState = 'IDLE';
        this.states = {
            IDLE: 'IDLE',
            CREATING: 'CREATING',
            ACTIVE: 'ACTIVE',
            ADDING_MEMBER: 'ADDING_MEMBER',
            REMOVING_MEMBER: 'REMOVING_MEMBER',
            UPDATING: 'UPDATING',
            SUSPENDING: 'SUSPENDING',
            ARCHIVING: 'ARCHIVING',
            DISBANDING: 'DISBANDING'
        };
        
        this.groupData = null;
        this.members = [];
        this.invitations = [];
        this.country = null;
    }

    // MAIN GROUP FLOW METHODS

    async createGroup(groupData) {
        try {
            this.currentState = this.states.CREATING;
            
            // Validate group data
            const validation = this.validateGroupData(groupData);
            if (!validation.valid) {
                throw new Error(validation.message);
            }
            
            // Check if creator can create group
            const canCreate = await this.canCreateGroup(groupData.creatorId);
            if (!canCreate.allowed) {
                throw new Error(canCreate.message);
            }
            
            // Create group
            this.groupData = this.createGroupRecord(groupData);
            this.country = groupData.country;
            
            // Add creator as admin
            await this.addCreatorAsAdmin(groupData.creatorId);
            
            this.currentState = this.states.ACTIVE;
            
            // Initialize group settings
            await this.initializeGroupSettings();
            
            return {
                success: true,
                state: this.currentState,
                group: this.groupData,
                creatorRole: 'ADMIN',
                message: 'Group created successfully'
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

    async loadGroup(groupId) {
        try {
            this.currentState = this.states.IDLE;
            
            // Load group data
            this.groupData = await this.getGroupData(groupId);
            
            if (!this.groupData) {
                throw new Error('Group not found');
            }
            
            this.country = this.groupData.country;
            
            // Load members
            this.members = await this.getGroupMembers(groupId);
            
            // Load invitations
            this.invitations = await this.getGroupInvitations(groupId);
            
            this.currentState = this.groupData.status === 'ACTIVE' ? 
                this.states.ACTIVE : this.groupData.status;
            
            return {
                success: true,
                state: this.currentState,
                group: this.groupData,
                members: this.members.length,
                invitations: this.invitations.length,
                message: 'Group loaded successfully'
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

    async inviteMember(invitationData) {
        try {
            if (this.currentState !== this.states.ACTIVE) {
                throw new Error('Group is not active');
            }
            
            // Validate invitation
            const validation = this.validateInvitation(invitationData);
            if (!validation.valid) {
                throw new Error(validation.message);
            }
            
            // Check if group can accept more members
            const capacityCheck = await this.checkGroupCapacity();
            if (!capacityCheck.canAdd) {
                throw new Error(capacityCheck.message);
            }
            
            // Check if user is already a member
            const isAlreadyMember = await this.isUserMember(invitationData.inviteeId);
            if (isAlreadyMember) {
                throw new Error('User is already a group member');
            }
            
            this.currentState = this.states.ADDING_MEMBER;
            
            // Create invitation
            const invitation = await this.createInvitation(invitationData);
            this.invitations.push(invitation);
            
            // Notify invitee
            await this.notifyInvitee(invitation);
            
            this.currentState = this.states.ACTIVE;
            
            return {
                success: true,
                state: this.currentState,
                invitation: invitation,
                group: this.groupData,
                message: 'Invitation sent successfully'
            };
            
        } catch (error) {
            this.currentState = this.states.ACTIVE;
            return {
                success: false,
                error: error.message,
                state: this.currentState
            };
        }
    }

    async acceptInvitation(invitationId, acceptanceData) {
        try {
            // Get invitation
            const invitation = await this.getInvitation(invitationId);
            if (!invitation) {
                throw new Error('Invitation not found');
            }
            
            // Check if invitation is still valid
            if (invitation.status !== 'PENDING') {
                throw new Error('Invitation is no longer valid');
            }
            
            // Check if invitation has expired
            if (new Date(invitation.expiry) < new Date()) {
                throw new Error('Invitation has expired');
            }
            
            // Check if user can join group
            const canJoin = await this.canUserJoinGroup(
                invitation.inviteeId, 
                invitation.groupId
            );
            
            if (!canJoin.allowed) {
                throw new Error(canJoin.message);
            }
            
            // Add user to group
            const membership = await this.addUserToGroup(invitation, acceptanceData);
            this.members.push(membership);
            
            // Update invitation status
            await this.updateInvitationStatus(invitationId, 'ACCEPTED');
            
            // Remove from invitations list
            this.invitations = this.invitations.filter(i => i.id !== invitationId);
            
            // Update group statistics
            await this.updateGroupStatistics('ADD_MEMBER');
            
            // Notify group admin
            await this.notifyAdminOfNewMember(membership);
            
            return {
                success: true,
                state: this.currentState,
                membership: membership,
                group: this.groupData,
                message: 'Successfully joined the group'
            };
            
        } catch (error) {
            return {
                success: false,
                error: error.message,
                state: this.currentState
            };
        }
    }

    async removeMember(removalData) {
        try {
            if (this.currentState !== this.states.ACTIVE) {
                throw new Error('Group is not active');
            }
            
            // Check if requester has permission
            const canRemove = await this.canRemoveMember(
                removalData.requesterId, 
                removalData.memberId
            );
            
            if (!canRemove.allowed) {
                throw new Error(canRemove.message);
            }
            
            this.currentState = this.states.REMOVING_MEMBER;
            
            // Check if member has active loans
            const activeLoans = await this.getMemberActiveLoans(removalData.memberId);
            if (activeLoans.length > 0) {
                throw new Error('Cannot remove member with active loans');
            }
            
            // Remove member
            await this.removeUserFromGroup(removalData);
            
            // Update members list
            this.members = this.members.filter(m => m.userId !== removalData.memberId);
            
            // Update group statistics
            await this.updateGroupStatistics('REMOVE_MEMBER');
            
            this.currentState = this.states.ACTIVE;
            
            return {
                success: true,
                state: this.currentState,
                removedMemberId: removalData.memberId,
                group: this.groupData,
                message: 'Member removed successfully'
            };
            
        } catch (error) {
            this.currentState = this.states.ACTIVE;
            return {
                success: false,
                error: error.message,
                state: this.currentState
            };
        }
    }

    async updateGroupSettings(settingsData) {
        try {
            if (this.currentState !== this.states.ACTIVE) {
                throw new Error('Group is not active');
            }
            
            // Check if requester has permission
            const canUpdate = await this.canUpdateSettings(settingsData.requesterId);
            if (!canUpdate.allowed) {
                throw new Error(canUpdate.message);
            }
            
            this.currentState = this.states.UPDATING;
            
            // Update group settings
            const updatedGroup = await this.updateGroupRecord(settingsData);
            this.groupData = updatedGroup;
            
            // Log settings change
            await this.logSettingsChange(settingsData);
            
            this.currentState = this.states.ACTIVE;
            
            return {
                success: true,
                state: this.currentState,
                group: this.groupData,
                changes: settingsData.changes,
                message: 'Group settings updated successfully'
            };
            
        } catch (error) {
            this.currentState = this.states.ACTIVE;
            return {
                success: false,
                error: error.message,
                state: this.currentState
            };
        }
    }

    async suspendGroup(suspensionData) {
        try {
            if (this.currentState !== this.states.ACTIVE) {
                throw new Error('Group is not active');
            }
            
            // Check if requester has permission
            const canSuspend = await this.canSuspendGroup(suspensionData.requesterId);
            if (!canSuspend.allowed) {
                throw new Error(canSuspend.message);
            }
            
            this.currentState = this.states.SUSPENDING;
            
            // Update group status
            await this.updateGroupStatus('SUSPENDED', suspensionData);
            
            // Notify members
            await this.notifyGroupSuspension(suspensionData);
            
            this.currentState = this.states.SUSPENDING;
            
            return {
                success: true,
                state: this.currentState,
                group: this.groupData,
                suspension: suspensionData,
                message: 'Group suspended successfully'
            };
            
        } catch (error) {
            this.currentState = this.states.ACTIVE;
            return {
                success: false,
                error: error.message,
                state: this.currentState
            };
        }
    }

    async reactivateGroup(reactivationData) {
        try {
            if (this.currentState !== 'SUSPENDED') {
                throw new Error('Group is not suspended');
            }
            
            // Check if requester has permission
            const canReactivate = await this.canReactivateGroup(reactivationData.requesterId);
            if (!canReactivate.allowed) {
                throw new Error(canReactivate.message);
            }
            
            // Update group status
            await this.updateGroupStatus('ACTIVE', reactivationData);
            
            // Notify members
            await this.notifyGroupReactivation(reactivationData);
            
            this.currentState = this.states.ACTIVE;
            
            return {
                success: true,
                state: this.currentState,
                group: this.groupData,
                reactivation: reactivationData,
                message: 'Group reactivated successfully'
            };
            
        } catch (error) {
            return {
                success: false,
                error: error.message,
                state: this.currentState
            };
        }
    }

    async archiveGroup(archiveData) {
        try {
            if (!['ACTIVE', 'SUSPENDED'].includes(this.currentState)) {
                throw new Error('Group cannot be archived in current state');
            }
            
            // Check if requester has permission
            const canArchive = await this.canArchiveGroup(archiveData.requesterId);
            if (!canArchive.allowed) {
                throw new Error(canArchive.message);
            }
            
            // Check if group has active loans
            const activeLoans = await this.getGroupActiveLoans();
            if (activeLoans.length > 0) {
                throw new Error('Cannot archive group with active loans');
            }
            
            this.currentState = this.states.ARCHIVING;
            
            // Update group status
            await this.updateGroupStatus('ARCHIVED', archiveData);
            
            // Notify members
            await this.notifyGroupArchival(archiveData);
            
            this.currentState = this.states.ARCHIVING;
            
            return {
                success: true,
                state: this.currentState,
                group: this.groupData,
                archive: archiveData,
                message: 'Group archived successfully'
            };
            
        } catch (error) {
            this.currentState = this.states.ACTIVE;
            return {
                success: false,
                error: error.message,
                state: this.currentState
            };
        }
    }

    async disbandGroup(disbandData) {
        try {
            if (this.currentState !== this.states.ACTIVE) {
                throw new Error('Group is not active');
            }
            
            // Check if requester has permission
            const canDisband = await this.canDisbandGroup(disbandData.requesterId);
            if (!canDisband.allowed) {
                throw new Error(canDisband.message);
            }
            
            // Check if group has active loans
            const activeLoans = await this.getGroupActiveLoans();
            if (activeLoans.length > 0) {
                throw new Error('Cannot disband group with active loans');
            }
            
            this.currentState = this.states.DISBANDING;
            
            // Update group status
            await this.updateGroupStatus('DISBANDED', disbandData);
            
            // Remove all members
            await this.removeAllMembers(disbandData);
            
            // Notify members
            await this.notifyGroupDisbandment(disbandData);
            
            this.currentState = this.states.DISBANDING;
            
            return {
                success: true,
                state: this.currentState,
                group: this.groupData,
                disbandment: disbandData,
                message: 'Group disbanded successfully'
            };
            
        } catch (error) {
            this.currentState = this.states.ACTIVE;
            return {
                success: false,
                error: error.message,
                state: this.currentState
            };
        }
    }

    async getGroupStatistics() {
        try {
            const stats = {
                members: this.members.length,
                lenders: this.members.filter(m => m.role === 'LENDER').length,
                borrowers: this.members.filter(m => m.role === 'BORROWER').length,
                activeLoans: await this.getGroupActiveLoansCount(),
                totalLent: await this.getGroupTotalLent(),
                repaymentRate: await this.getGroupRepaymentRate(),
                invitations: this.invitations.length
            };
            
            return {
                success: true,
                statistics: stats,
                group: this.groupData,
                message: 'Group statistics retrieved'
            };
            
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async generateGroupReport(reportType) {
        try {
            let report;
            
            switch (reportType) {
                case 'MEMBER_ACTIVITY':
                    report = await this.generateMemberActivityReport();
                    break;
                    
                case 'LOAN_PERFORMANCE':
                    report = await this.generateLoanPerformanceReport();
                    break;
                    
                case 'FINANCIAL_SUMMARY':
                    report = await this.generateFinancialSummary();
                    break;
                    
                case 'RISK_ASSESSMENT':
                    report = await this.generateRiskAssessment();
                    break;
                    
                default:
                    throw new Error('Invalid report type');
            }
            
            return {
                success: true,
                reportType: reportType,
                report: report,
                generatedAt: new Date().toISOString(),
                message: 'Group report generated successfully'
            };
            
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // HELPER METHODS

    validateGroupData(groupData) {
        const requiredFields = ['name', 'type', 'country', 'creatorId'];
        
        for (const field of requiredFields) {
            if (!groupData[field]) {
                return {
                    valid: false,
                    message: `${field} is required`
                };
            }
        }
        
        // Validate group type
        const validTypes = [
            'FAMILY', 'CHURCH', 'PROFESSIONAL', 'LOCAL', 
            'SOCIAL', 'BUSINESS', 'COMMUNITY'
        ];
        
        if (!validTypes.includes(groupData.type)) {
            return {
                valid: false,
                message: 'Invalid group type'
            };
        }
        
        // Validate country
        const validCountries = [
            'Kenya', 'Uganda', 'Tanzania', 'Rwanda', 'Burundi', 
            'DRC', 'South Sudan', 'South Africa', 'Nigeria', 
            'Ghana', 'Ethiopia'
        ];
        
        if (!validCountries.includes(groupData.country)) {
            return {
                valid: false,
                message: 'Invalid country'
            };
        }
        
        return {
            valid: true,
            message: 'Group data validated'
        };
    }

    async canCreateGroup(userId) {
        // Check if user is blacklisted
        const blacklistCheck = await this.checkUserBlacklist(userId);
        if (blacklistCheck.blacklisted) {
            return {
                allowed: false,
                reason: 'USER_BLACKLISTED',
                message: 'Blacklisted users cannot create groups'
            };
        }
        
        // Check user rating (minimum 4 stars)
        const userRating = await this.getUserRating(userId);
        if (userRating < 4) {
            return {
                allowed: false,
                reason: 'LOW_RATING',
                message: 'Minimum 4-star rating required to create groups'
            };
        }
        
        // Check if user is already admin of too many groups
        const adminGroups = await this.getUserAdminGroups(userId);
        if (adminGroups.length >= 5) {
            return {
                allowed: false,
                reason: 'MAX_ADMIN_GROUPS',
                message: 'Maximum of 5 groups as admin reached'
            };
        }
        
        return {
            allowed: true,
            message: 'User can create group'
        };
    }

    async checkUserBlacklist(userId) {
        const blacklist = JSON.parse(localStorage.getItem('mpesewa_blacklist') || '[]');
        const blacklistEntry = blacklist.find(entry => 
            entry.userId === userId && 
            entry.status === 'ACTIVE'
        );
        
        return {
            blacklisted: !!blacklistEntry,
            entry: blacklistEntry
        };
    }

    async getUserRating(userId) {
        const ratings = JSON.parse(localStorage.getItem('mpesewa_ratings') || '[]');
        const userRatings = ratings.filter(r => r.rateeId === userId);
        
        if (userRatings.length === 0) return 5.0;
        
        const total = userRatings.reduce((sum, r) => sum + r.rating, 0);
        return total / userRatings.length;
    }

    async getUserAdminGroups(userId) {
        const userGroups = JSON.parse(localStorage.getItem('mpesewa_user_groups') || '[]');
        return userGroups.filter(ug => 
            ug.userId === userId && 
            ug.role === 'ADMIN' && 
            ug.status === 'ACTIVE'
        );
    }

    createGroupRecord(groupData) {
        const groupId = 'GROUP-' + Date.now();
        
        const group = {
            id: groupId,
            name: groupData.name,
            type: groupData.type,
            country: groupData.country,
            creatorId: groupData.creatorId,
            status: 'ACTIVE',
            settings: {
                requiresInvitation: groupData.requiresInvitation || false,
                maxMembers: 1000,
                minMembers: 5,
                autoApprove: groupData.autoApprove || false,
                visibility: groupData.visibility || 'PRIVATE'
            },
            statistics: {
                memberCount: 1, // Creator is first member
                lenderCount: 0,
                borrowerCount: 0,
                totalLent: 0,
                repaymentRate: '100%'
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        // Store group
        const groups = JSON.parse(localStorage.getItem(`mpesewa_groups_${group.country}`) || '[]');
        groups.push(group);
        localStorage.setItem(`mpesewa_groups_${group.country}`, JSON.stringify(groups));
        
        return group;
    }

    async addCreatorAsAdmin(creatorId) {
        const membershipId = 'MEM-' + Date.now();
        const membership = {
            id: membershipId,
            groupId: this.groupData.id,
            userId: creatorId,
            role: 'ADMIN',
            status: 'ACTIVE',
            joinedDate: new Date().toISOString(),
            invitedBy: 'SYSTEM',
            permissions: this.getAdminPermissions()
        };
        
        // Store membership
        await this.storeMembership(membership);
        
        // Add to local members
        this.members.push(membership);
        
        // Update group statistics
        this.groupData.statistics.memberCount = 1;
    }

    getAdminPermissions() {
        return {
            canInvite: true,
            canRemove: true,
            canUpdateSettings: true,
            canSuspend: true,
            canViewReports: true,
            canApproveLoans: true,
            canResolveDisputes: true
        };
    }

    async storeMembership(membership) {
        const userGroups = JSON.parse(localStorage.getItem('mpesewa_user_groups') || '[]');
        userGroups.push(membership);
        localStorage.setItem('mpesewa_user_groups', JSON.stringify(removeDuplicates));
    }
}