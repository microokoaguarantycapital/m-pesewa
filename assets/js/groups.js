/**
 * groups.js - Group Management Module for M-PESEWA
 * Handles group creation, joining, management, and group-scoped operations
 * Enforces strict hierarchy: Global → Country → Groups
 */

// ===== MODULE STATE =====
let groupsModule = {
    currentCountry: null,
    currentGroup: null,
    userGroups: [],
    allGroups: [],
    groupInvitations: [],
    groupMembers: {},
    isLoaded: false
};

// ===== DATA MODELS =====
class Group {
    constructor(data) {
        this.id = data.id || `group_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        this.name = data.name;
        this.country = data.country; // ISO country code
        this.currency = data.currency;
        this.type = data.type; // Family, Church, Professional, etc.
        this.description = data.description || '';
        this.founderId = data.founderId; // User ID of group founder
        this.founderName = data.founderName;
        this.createdAt = data.createdAt || new Date().toISOString();
        this.isActive = data.isActive !== undefined ? data.isActive : true;
        this.memberCount = data.memberCount || 0;
        this.lenderCount = data.lenderCount || 0;
        this.borrowerCount = data.borrowerCount || 0;
        this.totalLent = data.totalLent || 0;
        this.repaymentRate = data.repaymentRate || 0;
        this.rating = data.rating || 0;
        this.invitationCode = data.invitationCode || this.generateInvitationCode();
        this.rules = data.rules || {};
        this.tags = data.tags || [];
    }

    generateInvitationCode() {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            country: this.country,
            currency: this.currency,
            type: this.type,
            description: this.description,
            founderId: this.founderId,
            founderName: this.founderName,
            createdAt: this.createdAt,
            isActive: this.isActive,
            memberCount: this.memberCount,
            lenderCount: this.lenderCount,
            borrowerCount: this.borrowerCount,
            totalLent: this.totalLent,
            repaymentRate: this.repaymentRate,
            rating: this.rating,
            invitationCode: this.invitationCode,
            rules: this.rules,
            tags: this.tags
        };
    }
}

class GroupMember {
    constructor(data) {
        this.userId = data.userId;
        this.groupId = data.groupId;
        this.role = data.role; // 'admin', 'lender', 'borrower'
        this.joinedAt = data.joinedAt || new Date().toISOString();
        this.isActive = data.isActive !== undefined ? data.isActive : true;
        this.rating = data.rating || 0;
        this.contributions = data.contributions || 0;
        this.loansTaken = data.loansTaken || 0;
        this.loansGiven = data.loansGiven || 0;
        this.repaymentScore = data.repaymentScore || 100;
    }
}

class GroupInvitation {
    constructor(data) {
        this.id = data.id || `invite_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        this.groupId = data.groupId;
        this.invitedBy = data.invitedBy; // User ID
        this.invitedTo = data.invitedTo; // Email/Phone/User ID
        this.code = data.code;
        this.status = data.status || 'pending'; // pending, accepted, rejected, expired
        this.expiresAt = data.expiresAt || this.getExpiryDate(7); // 7 days default
        this.createdAt = data.createdAt || new Date().toISOString();
    }

    getExpiryDate(days) {
        const date = new Date();
        date.setDate(date.getDate() + days);
        return date.toISOString();
    }
}

// ===== INITIALIZATION =====
function initGroupsModule() {
    if (groupsModule.isLoaded) return;
    
    // Load user's current country from session
    const userCountry = sessionStorage.getItem('userCountry') || localStorage.getItem('userCountry');
    if (userCountry) {
        groupsModule.currentCountry = userCountry;
    }
    
    // Load user groups from localStorage
    loadUserGroups();
    
    // Load all groups for current country
    if (groupsModule.currentCountry) {
        loadCountryGroups(groupsModule.currentCountry);
    }
    
    // Load group invitations
    loadGroupInvitations();
    
    groupsModule.isLoaded = true;
    console.log('Groups module initialized');
}

// ===== GROUP LOADING =====
function loadUserGroups() {
    try {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        if (userData && userData.groups) {
            groupsModule.userGroups = userData.groups;
        } else {
            // Fallback: get groups from group memberships
            const allGroupMembers = JSON.parse(localStorage.getItem('groupMembers') || '[]');
            const userId = userData?.id || sessionStorage.getItem('userId');
            
            if (userId) {
                groupsModule.userGroups = allGroupMembers
                    .filter(member => member.userId === userId && member.isActive)
                    .map(member => member.groupId);
            }
        }
        
        // Load detailed group data for user's groups
        groupsModule.userGroups.forEach(groupId => {
            const group = getGroupById(groupId);
            if (group) {
                groupsModule.groupMembers[groupId] = getGroupMembers(groupId);
            }
        });
    } catch (error) {
        console.error('Error loading user groups:', error);
        groupsModule.userGroups = [];
    }
}

function loadCountryGroups(countryCode) {
    try {
        const allGroups = JSON.parse(localStorage.getItem('groups') || '[]');
        groupsModule.allGroups = allGroups.filter(group => 
            group.country === countryCode && group.isActive
        );
        
        // Sort groups by activity (member count * repayment rate)
        groupsModule.allGroups.sort((a, b) => {
            const scoreA = (a.memberCount || 0) * (a.repaymentRate || 0);
            const scoreB = (b.memberCount || 0) * (b.repaymentRate || 0);
            return scoreB - scoreA;
        });
        
        return groupsModule.allGroups;
    } catch (error) {
        console.error('Error loading country groups:', error);
        return [];
    }
}

function loadGroupInvitations() {
    try {
        const userId = getCurrentUserId();
        if (!userId) return;
        
        const allInvitations = JSON.parse(localStorage.getItem('groupInvitations') || '[]');
        groupsModule.groupInvitations = allInvitations.filter(invite => 
            invite.invitedTo === userId && invite.status === 'pending'
        );
    } catch (error) {
        console.error('Error loading group invitations:', error);
        groupsModule.groupInvitations = [];
    }
}

// ===== GROUP CREATION =====
function createGroup(groupData) {
    try {
        // Validate user can create group
        const user = getCurrentUser();
        if (!user) {
            throw new Error('User not authenticated');
        }
        
        // Check if user is already in 4 groups (max for borrowers)
        if (user.role === 'borrower' && groupsModule.userGroups.length >= 4) {
            throw new Error('Borrowers can only join up to 4 groups');
        }
        
        // Validate group data
        if (!groupData.name || !groupData.type || !groupData.country) {
            throw new Error('Group name, type, and country are required');
        }
        
        // Enforce country isolation
        if (groupData.country !== groupsModule.currentCountry) {
            throw new Error('Group must be created in your selected country');
        }
        
        // Create new group
        const newGroup = new Group({
            ...groupData,
            founderId: user.id,
            founderName: user.name || user.username,
            currency: getCurrencyForCountry(groupData.country)
        });
        
        // Save to localStorage
        const allGroups = JSON.parse(localStorage.getItem('groups') || '[]');
        allGroups.push(newGroup.toJSON());
        localStorage.setItem('groups', JSON.stringify(allGroups));
        
        // Add creator as admin member
        addGroupMember({
            userId: user.id,
            groupId: newGroup.id,
            role: 'admin'
        });
        
        // Update user's groups
        groupsModule.userGroups.push(newGroup.id);
        updateUserGroups(user.id, groupsModule.userGroups);
        
        // Reload groups
        loadCountryGroups(groupData.country);
        
        // Trigger success event
        document.dispatchEvent(new CustomEvent('groupCreated', { 
            detail: { group: newGroup } 
        }));
        
        return {
            success: true,
            group: newGroup,
            message: 'Group created successfully'
        };
        
    } catch (error) {
        console.error('Error creating group:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

// ===== GROUP JOINING =====
function joinGroup(groupId, invitationCode = null) {
    try {
        const user = getCurrentUser();
        if (!user) {
            throw new Error('User not authenticated');
        }
        
        const group = getGroupById(groupId);
        if (!group) {
            throw new Error('Group not found');
        }
        
        // Check country isolation
        if (group.country !== groupsModule.currentCountry) {
            throw new Error('Cannot join group from different country');
        }
        
        // Check if user is already in group
        const existingMembership = getGroupMembers(groupId).find(
            member => member.userId === user.id && member.isActive
        );
        
        if (existingMembership) {
            throw new Error('You are already a member of this group');
        }
        
        // Check group type restrictions
        if (group.type === 'Professional' && user.role === 'borrower') {
            throw new Error('Professional groups may have additional requirements');
        }
        
        // Validate invitation code if required
        if (group.rules.requiresInvitation && !invitationCode) {
            throw new Error('Invitation code required to join this group');
        }
        
        if (invitationCode && !validateInvitationCode(groupId, invitationCode)) {
            throw new Error('Invalid or expired invitation code');
        }
        
        // Check borrower limits
        if (user.role === 'borrower' && groupsModule.userGroups.length >= 4) {
            throw new Error('Borrowers can only join up to 4 groups');
        }
        
        // Check rating requirements for borrowers
        if (user.role === 'borrower' && user.rating < 3) {
            throw new Error('Borrowers need minimum 3-star rating to join new groups');
        }
        
        // Add user to group
        const memberData = {
            userId: user.id,
            groupId: groupId,
            role: user.role // 'lender' or 'borrower'
        };
        
        const result = addGroupMember(memberData);
        
        if (result.success) {
            // Update user's groups
            groupsModule.userGroups.push(groupId);
            updateUserGroups(user.id, groupsModule.userGroups);
            
            // Update group stats
            updateGroupStats(groupId, user.role === 'lender' ? 'lender' : 'borrower');
            
            // Trigger event
            document.dispatchEvent(new CustomEvent('groupJoined', {
                detail: { groupId, userId: user.id, role: user.role }
            }));
            
            return {
                success: true,
                message: 'Successfully joined group'
            };
        } else {
            throw new Error(result.error);
        }
        
    } catch (error) {
        console.error('Error joining group:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

function joinGroupByInvitation(invitationId) {
    try {
        const invitation = groupsModule.groupInvitations.find(
            inv => inv.id === invitationId && inv.status === 'pending'
        );
        
        if (!invitation) {
            throw new Error('Invalid or expired invitation');
        }
        
        // Mark invitation as accepted
        updateInvitationStatus(invitationId, 'accepted');
        
        // Join the group
        return joinGroup(invitation.groupId, invitation.code);
        
    } catch (error) {
        console.error('Error joining group by invitation:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

// ===== GROUP MANAGEMENT =====
function updateGroup(groupId, updates) {
    try {
        const user = getCurrentUser();
        const group = getGroupById(groupId);
        
        if (!group) {
            throw new Error('Group not found');
        }
        
        // Check if user is group admin
        const membership = getGroupMembers(groupId).find(
            member => member.userId === user.id && member.role === 'admin'
        );
        
        if (!membership) {
            throw new Error('Only group admins can update group details');
        }
        
        // Update group
        const allGroups = JSON.parse(localStorage.getItem('groups') || '[]');
        const groupIndex = allGroups.findIndex(g => g.id === groupId);
        
        if (groupIndex === -1) {
            throw new Error('Group not found in database');
        }
        
        // Apply updates (don't allow changing country or founder)
        const safeUpdates = { ...updates };
        delete safeUpdates.country;
        delete safeUpdates.founderId;
        delete safeUpdates.founderName;
        
        allGroups[groupIndex] = {
            ...allGroups[groupIndex],
            ...safeUpdates,
            updatedAt: new Date().toISOString()
        };
        
        localStorage.setItem('groups', JSON.stringify(allGroups));
        
        // Reload groups
        loadCountryGroups(group.country);
        
        return {
            success: true,
            message: 'Group updated successfully'
        };
        
    } catch (error) {
        console.error('Error updating group:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

function leaveGroup(groupId) {
    try {
        const user = getCurrentUser();
        if (!user) {
            throw new Error('User not authenticated');
        }
        
        const group = getGroupById(groupId);
        if (!group) {
            throw new Error('Group not found');
        }
        
        // Check if user is the founder (founder cannot leave, must transfer ownership first)
        if (group.founderId === user.id) {
            throw new Error('Group founder cannot leave. Transfer ownership first.');
        }
        
        // Check if user has active loans in this group
        const activeLoans = getActiveLoansInGroup(user.id, groupId);
        if (activeLoans.length > 0) {
            throw new Error('Cannot leave group with active loans');
        }
        
        // Deactivate membership
        const allMembers = JSON.parse(localStorage.getItem('groupMembers') || '[]');
        const memberIndex = allMembers.findIndex(
            member => member.userId === user.id && 
                     member.groupId === groupId && 
                     member.isActive
        );
        
        if (memberIndex === -1) {
            throw new Error('You are not a member of this group');
        }
        
        allMembers[memberIndex].isActive = false;
        allMembers[memberIndex].leftAt = new Date().toISOString();
        localStorage.setItem('groupMembers', JSON.stringify(allMembers));
        
        // Update user's groups
        const userGroups = groupsModule.userGroups.filter(id => id !== groupId);
        updateUserGroups(user.id, userGroups);
        groupsModule.userGroups = userGroups;
        
        // Update group stats
        updateGroupStats(groupId, user.role === 'lender' ? 'lender' : 'borrower', -1);
        
        return {
            success: true,
            message: 'Successfully left the group'
        };
        
    } catch (error) {
        console.error('Error leaving group:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

function transferGroupOwnership(groupId, newOwnerId) {
    try {
        const user = getCurrentUser();
        const group = getGroupById(groupId);
        
        if (!group) {
            throw new Error('Group not found');
        }
        
        // Check if user is the current founder
        if (group.founderId !== user.id) {
            throw new Error('Only current group founder can transfer ownership');
        }
        
        // Check if new owner is a member of the group
        const newOwnerMembership = getGroupMembers(groupId).find(
            member => member.userId === newOwnerId && member.isActive
        );
        
        if (!newOwnerMembership) {
            throw new Error('New owner must be an active member of the group');
        }
        
        // Update group founder
        const allGroups = JSON.parse(localStorage.getItem('groups') || '[]');
        const groupIndex = allGroups.findIndex(g => g.id === groupId);
        
        if (groupIndex === -1) {
            throw new Error('Group not found in database');
        }
        
        const newOwner = getUserById(newOwnerId);
        allGroups[groupIndex].founderId = newOwnerId;
        allGroups[groupIndex].founderName = newOwner?.name || newOwner?.username || 'Unknown';
        allGroups[groupIndex].updatedAt = new Date().toISOString();
        
        // Update old founder's role to lender (if they were admin)
        const allMembers = JSON.parse(localStorage.getItem('groupMembers') || '[]');
        const oldFounderIndex = allMembers.findIndex(
            member => member.userId === user.id && member.groupId === groupId
        );
        
        if (oldFounderIndex !== -1) {
            allMembers[oldFounderIndex].role = 'lender';
        }
        
        // Update new owner's role to admin
        const newOwnerIndex = allMembers.findIndex(
            member => member.userId === newOwnerId && member.groupId === groupId
        );
        
        if (newOwnerIndex !== -1) {
            allMembers[newOwnerIndex].role = 'admin';
        }
        
        // Save changes
        localStorage.setItem('groups', JSON.stringify(allGroups));
        localStorage.setItem('groupMembers', JSON.stringify(allMembers));
        
        return {
            success: true,
            message: 'Group ownership transferred successfully'
        };
        
    } catch (error) {
        console.error('Error transferring group ownership:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

// ===== GROUP INVITATIONS =====
function createGroupInvitation(groupId, inviteData) {
    try {
        const user = getCurrentUser();
        const group = getGroupById(groupId);
        
        if (!group) {
            throw new Error('Group not found');
        }
        
        // Check if user can invite (admins and sometimes lenders)
        const membership = getGroupMembers(groupId).find(
            member => member.userId === user.id && member.isActive
        );
        
        if (!membership) {
            throw new Error('You must be a member to invite others');
        }
        
        if (membership.role !== 'admin' && !group.rules.allowMemberInvites) {
            throw new Error('Only group admins can send invitations');
        }
        
        // Check invitation limits
        const existingInvites = groupsModule.groupInvitations.filter(
            inv => inv.groupId === groupId && inv.status === 'pending'
        );
        
        if (existingInvites.length >= 10) {
            throw new Error('Maximum pending invitations reached (10)');
        }
        
        // Create invitation
        const invitation = new GroupInvitation({
            groupId: groupId,
            invitedBy: user.id,
            invitedTo: inviteData.email || inviteData.phone || inviteData.userId,
            code: Math.random().toString(36).substring(2, 8).toUpperCase()
        });
        
        // Save invitation
        const allInvitations = JSON.parse(localStorage.getItem('groupInvitations') || '[]');
        allInvitations.push(invitation);
        localStorage.setItem('groupInvitations', JSON.stringify(allInvitations));
        
        // Reload invitations
        loadGroupInvitations();
        
        // TODO: Send notification/email (in real implementation)
        
        return {
            success: true,
            invitation: invitation,
            message: 'Invitation created successfully'
        };
        
    } catch (error) {
        console.error('Error creating invitation:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

function validateInvitationCode(groupId, code) {
    const allInvitations = JSON.parse(localStorage.getItem('groupInvitations') || '[]');
    
    const invitation = allInvitations.find(inv => 
        inv.groupId === groupId && 
        inv.code === code && 
        inv.status === 'pending' &&
        new Date(inv.expiresAt) > new Date()
    );
    
    return !!invitation;
}

function updateInvitationStatus(invitationId, status) {
    try {
        const allInvitations = JSON.parse(localStorage.getItem('groupInvitations') || '[]');
        const inviteIndex = allInvitations.findIndex(inv => inv.id === invitationId);
        
        if (inviteIndex === -1) {
            throw new Error('Invitation not found');
        }
        
        allInvitations[inviteIndex].status = status;
        allInvitations[inviteIndex].updatedAt = new Date().toISOString();
        
        if (status === 'accepted') {
            allInvitations[inviteIndex].acceptedAt = new Date().toISOString();
        } else if (status === 'rejected') {
            allInvitations[inviteIndex].rejectedAt = new Date().toISOString();
        }
        
        localStorage.setItem('groupInvitations', JSON.stringify(allInvitations));
        
        // Reload invitations
        loadGroupInvitations();
        
        return true;
    } catch (error) {
        console.error('Error updating invitation status:', error);
        return false;
    }
}

// ===== GROUP STATS & ANALYTICS =====
function updateGroupStats(groupId, memberType, change = 1) {
    try {
        const allGroups = JSON.parse(localStorage.getItem('groups') || '[]');
        const groupIndex = allGroups.findIndex(g => g.id === groupId);
        
        if (groupIndex === -1) return;
        
        const group = allGroups[groupIndex];
        
        // Update counts
        if (memberType === 'lender') {
            group.lenderCount = Math.max(0, (group.lenderCount || 0) + change);
        } else if (memberType === 'borrower') {
            group.borrowerCount = Math.max(0, (group.borrowerCount || 0) + change);
        }
        
        // Update total member count
        group.memberCount = (group.lenderCount || 0) + (group.borrowerCount || 0);
        
        // Update repayment rate (this would normally come from loan data)
        const groupLoans = getGroupLoans(groupId);
        if (groupLoans.length > 0) {
            const repaidLoans = groupLoans.filter(loan => loan.status === 'cleared');
            group.repaymentRate = Math.round((repaidLoans.length / groupLoans.length) * 100);
        }
        
        // Update rating (average of member ratings)
        const members = getGroupMembers(groupId);
        if (members.length > 0) {
            const totalRating = members.reduce((sum, member) => sum + (member.rating || 0), 0);
            group.rating = Math.round((totalRating / members.length) * 10) / 10;
        }
        
        allGroups[groupIndex] = group;
        localStorage.setItem('groups', JSON.stringify(allGroups));
        
    } catch (error) {
        console.error('Error updating group stats:', error);
    }
}

function getGroupAnalytics(groupId) {
    try {
        const group = getGroupById(groupId);
        if (!group) return null;
        
        const members = getGroupMembers(groupId);
        const loans = getGroupLoans(groupId);
        
        const analytics = {
            groupId: groupId,
            totalMembers: members.length,
            lenders: members.filter(m => m.role === 'lender').length,
            borrowers: members.filter(m => m.role === 'borrower').length,
            totalLoans: loans.length,
            activeLoans: loans.filter(l => l.status === 'active').length,
            overdueLoans: loans.filter(l => l.status === 'overdue').length,
            clearedLoans: loans.filter(l => l.status === 'cleared').length,
            totalAmountLent: loans.reduce((sum, loan) => sum + (loan.amount || 0), 0),
            totalInterestEarned: loans.reduce((sum, loan) => sum + (loan.interestEarned || 0), 0),
            averageLoanSize: loans.length > 0 ? 
                loans.reduce((sum, loan) => sum + (loan.amount || 0), 0) / loans.length : 0,
            repaymentRate: group.repaymentRate || 0,
            monthlyGrowth: calculateMonthlyGrowth(groupId),
            memberActivity: calculateMemberActivity(groupId)
        };
        
        return analytics;
        
    } catch (error) {
        console.error('Error getting group analytics:', error);
        return null;
    }
}

// ===== HELPER FUNCTIONS =====
function getGroupById(groupId) {
    const allGroups = JSON.parse(localStorage.getItem('groups') || '[]');
    return allGroups.find(group => group.id === groupId);
}

function getGroupMembers(groupId) {
    const allMembers = JSON.parse(localStorage.getItem('groupMembers') || '[]');
    return allMembers.filter(member => 
        member.groupId === groupId && member.isActive
    );
}

function addGroupMember(memberData) {
    try {
        const newMember = new GroupMember(memberData);
        const allMembers = JSON.parse(localStorage.getItem('groupMembers') || '[]');
        
        // Check for existing active membership
        const existingIndex = allMembers.findIndex(
            member => member.userId === newMember.userId && 
                     member.groupId === newMember.groupId
        );
        
        if (existingIndex !== -1) {
            // Reactivate if exists but inactive
            allMembers[existingIndex].isActive = true;
            allMembers[existingIndex].rejoinedAt = new Date().toISOString();
        } else {
            allMembers.push(newMember);
        }
        
        localStorage.setItem('groupMembers', JSON.stringify(allMembers));
        
        return {
            success: true,
            member: newMember
        };
        
    } catch (error) {
        console.error('Error adding group member:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

function getCurrentUser() {
    try {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        if (userData && userData.id) {
            return userData;
        }
        
        // Fallback to session data
        const userId = sessionStorage.getItem('userId');
        const username = sessionStorage.getItem('username');
        const role = sessionStorage.getItem('userRole');
        
        if (userId) {
            return {
                id: userId,
                username: username,
                role: role,
                name: username
            };
        }
        
        return null;
    } catch (error) {
        console.error('Error getting current user:', error);
        return null;
    }
}

function getCurrentUserId() {
    const user = getCurrentUser();
    return user?.id;
}

function getUserById(userId) {
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    return allUsers.find(user => user.id === userId);
}

function updateUserGroups(userId, groupIds) {
    try {
        const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = allUsers.findIndex(user => user.id === userId);
        
        if (userIndex !== -1) {
            allUsers[userIndex].groups = groupIds;
            localStorage.setItem('users', JSON.stringify(allUsers));
        }
        
        // Also update current user data
        const currentUser = getCurrentUser();
        if (currentUser && currentUser.id === userId) {
            currentUser.groups = groupIds;
            localStorage.setItem('userData', JSON.stringify(currentUser));
        }
        
    } catch (error) {
        console.error('Error updating user groups:', error);
    }
}

function getCurrencyForCountry(countryCode) {
    const countryCurrencies = {
        'KE': 'KES',
        'UG': 'UGX',
        'TZ': 'TZS',
        'RW': 'RWF',
        'NG': 'NGN',
        'GH': 'GHS',
        'ZA': 'ZAR',
        'EG': 'EGP',
        'ET': 'ETB',
        'SN': 'XOF'
    };
    
    return countryCurrencies[countryCode] || 'USD';
}

function getActiveLoansInGroup(userId, groupId) {
    try {
        const allLoans = JSON.parse(localStorage.getItem('loans') || '[]');
        return allLoans.filter(loan => 
            (loan.borrowerId === userId || loan.lenderId === userId) &&
            loan.groupId === groupId &&
            (loan.status === 'active' || loan.status === 'overdue')
        );
    } catch (error) {
        console.error('Error getting active loans:', error);
        return [];
    }
}

function getGroupLoans(groupId) {
    try {
        const allLoans = JSON.parse(localStorage.getItem('loans') || '[]');
        return allLoans.filter(loan => loan.groupId === groupId);
    } catch (error) {
        console.error('Error getting group loans:', error);
        return [];
    }
}

function calculateMonthlyGrowth(groupId) {
    // Simplified growth calculation
    const group = getGroupById(groupId);
    const members = getGroupMembers(groupId);
    
    if (!group || members.length < 2) return 0;
    
    const today = new Date();
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    
    // Count members who joined in last month
    const newMembers = members.filter(member => {
        const joinedDate = new Date(member.joinedAt);
        return joinedDate > monthAgo && joinedDate <= today;
    });
    
    const growthPercentage = (newMembers.length / members.length) * 100;
    return Math.round(growthPercentage * 10) / 10;
}

function calculateMemberActivity(groupId) {
    const loans = getGroupLoans(groupId);
    const members = getGroupMembers(groupId);
    
    if (loans.length === 0 || members.length === 0) return 0;
    
    // Calculate average loans per member
    const loansPerMember = loans.length / members.length;
    
    // Activity score from 0-100
    const activityScore = Math.min(loansPerMember * 20, 100);
    return Math.round(activityScore);
}

// ===== UI INTEGRATION FUNCTIONS =====
function renderGroupList(containerId, filter = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    let groupsToDisplay = groupsModule.allGroups;
    
    // Apply filters
    if (filter.type) {
        groupsToDisplay = groupsToDisplay.filter(group => group.type === filter.type);
    }
    
    if (filter.minRating) {
        groupsToDisplay = groupsToDisplay.filter(group => group.rating >= filter.minRating);
    }
    
    if (filter.searchTerm) {
        const term = filter.searchTerm.toLowerCase();
        groupsToDisplay = groupsToDisplay.filter(group => 
            group.name.toLowerCase().includes(term) ||
            group.description.toLowerCase().includes(term)
        );
    }
    
    // Render groups
    container.innerHTML = '';
    
    if (groupsToDisplay.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">👥</div>
                <h3 class="empty-title">No groups found</h3>
                <p class="empty-description">Try adjusting your filters or search terms</p>
            </div>
        `;
        return;
    }
    
    groupsToDisplay.forEach(group => {
        const isMember = groupsModule.userGroups.includes(group.id);
        const groupElement = createGroupCard(group, isMember);
        container.appendChild(groupElement);
    });
}

function createGroupCard(group, isMember = false) {
    const card = document.createElement('div');
    card.className = 'group-card';
    card.dataset.groupId = group.id;
    
    const memberStatus = isMember ? 'Member' : 'Join';
    const joinButton = isMember ? 
        `<button class="btn secondary small" onclick="enterGroup('${group.id}')">Enter Group</button>` :
        `<button class="btn primary small" onclick="showJoinGroupModal('${group.id}')">Request Invite</button>`;
    
    card.innerHTML = `
        <div class="group-header">
            <h3 class="group-name">${escapeHtml(group.name)}</h3>
            <span class="group-type">${escapeHtml(group.type)}</span>
        </div>
        
        <p class="group-description">${escapeHtml(group.description || 'No description provided')}</p>
        
        <div class="group-stats">
            <div class="group-stat">
                <span class="group-stat-value">${group.memberCount || 0}</span>
                <span class="group-stat-label">Members</span>
            </div>
            <div class="group-stat">
                <span class="group-stat-value">${group.currency} ${formatCurrency(group.totalLent || 0)}</span>
                <span class="group-stat-label">Total Lent</span>
            </div>
            <div class="group-stat">
                <span class="group-stat-value">${group.repaymentRate || 0}%</span>
                <span class="group-stat-label">Repayment Rate</span>
            </div>
        </div>
        
        <div class="group-footer">
            <div class="group-country">
                <span class="flag">${getFlagEmoji(group.country)}</span>
                <span>${getCountryName(group.country)}</span>
            </div>
            <div class="group-actions">
                ${joinButton}
                <button class="btn outline small" onclick="viewGroupDetails('${group.id}')">Details</button>
            </div>
        </div>
    `;
    
    return card;
}

function showJoinGroupModal(groupId) {
    const group = getGroupById(groupId);
    if (!group) return;
    
    const modalHTML = `
        <div class="modal" id="joinGroupModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Join ${escapeHtml(group.name)}</h3>
                    <button class="modal-close" onclick="closeModal('joinGroupModal')">×</button>
                </div>
                <div class="modal-body">
                    <p>Request to join ${escapeHtml(group.name)} - ${escapeHtml(group.type)} Group</p>
                    
                    ${group.rules.requiresInvitation ? `
                        <div class="form-group">
                            <label for="invitationCode">Invitation Code *</label>
                            <input type="text" id="invitationCode" 
                                   placeholder="Enter invitation code provided by group admin">
                        </div>
                    ` : ''}
                    
                    <div class="form-group">
                        <label for="joinMessage">Message to Group Admin (Optional)</label>
                        <textarea id="joinMessage" rows="3" 
                                  placeholder="Introduce yourself and why you want to join..."></textarea>
                    </div>
                    
                    <div class="form-actions">
                        <button class="btn secondary" onclick="closeModal('joinGroupModal')">Cancel</button>
                        <button class="btn primary" onclick="submitJoinRequest('${groupId}')">Send Request</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    showModal(modalHTML);
}

function submitJoinRequest(groupId) {
    const invitationCode = document.getElementById('invitationCode')?.value;
    const message = document.getElementById('joinMessage')?.value;
    
    const result = joinGroup(groupId, invitationCode);
    
    if (result.success) {
        showNotification('Successfully joined group!', 'success');
        closeModal('joinGroupModal');
        
        // Refresh group list
        if (document.getElementById('groupsList')) {
            renderGroupList('groupsList');
        }
    } else {
        showNotification(result.error, 'error');
    }
}

function enterGroup(groupId) {
    // Set current group in session
    sessionStorage.setItem('currentGroup', groupId);
    groupsModule.currentGroup = groupId;
    
    // Redirect to group dashboard or reload group view
    window.location.href = `group-dashboard.html?groupId=${groupId}`;
}

function viewGroupDetails(groupId) {
    const group = getGroupById(groupId);
    if (!group) return;
    
    const members = getGroupMembers(groupId);
    const analytics = getGroupAnalytics(groupId);
    
    const modalHTML = `
        <div class="modal" id="groupDetailsModal">
            <div class="modal-content wide">
                <div class="modal-header">
                    <h3>${escapeHtml(group.name)} - Group Details</h3>
                    <button class="modal-close" onclick="closeModal('groupDetailsModal')">×</button>
                </div>
                <div class="modal-body">
                    <div class="grid-2">
                        <div>
                            <h4>Group Information</h4>
                            <p><strong>Type:</strong> ${escapeHtml(group.type)}</p>
                            <p><strong>Country:</strong> ${getCountryName(group.country)} ${getFlagEmoji(group.country)}</p>
                            <p><strong>Currency:</strong> ${group.currency}</p>
                            <p><strong>Founded:</strong> ${formatDate(group.createdAt)}</p>
                            <p><strong>Founder:</strong> ${escapeHtml(group.founderName)}</p>
                            <p><strong>Rating:</strong> ${group.rating || 0}/5 ⭐</p>
                        </div>
                        
                        <div>
                            <h4>Group Statistics</h4>
                            <p><strong>Total Members:</strong> ${members.length}</p>
                            <p><strong>Lenders:</strong> ${members.filter(m => m.role === 'lender').length}</p>
                            <p><strong>Borrowers:</strong> ${members.filter(m => m.role === 'borrower').length}</p>
                            <p><strong>Repayment Rate:</strong> ${group.repaymentRate || 0}%</p>
                            <p><strong>Total Amount Lent:</strong> ${group.currency} ${formatCurrency(group.totalLent || 0)}</p>
                            ${analytics ? `<p><strong>Monthly Growth:</strong> ${analytics.monthlyGrowth}%</p>` : ''}
                        </div>
                    </div>
                    
                    ${group.description ? `
                        <div class="section">
                            <h4>Description</h4>
                            <p>${escapeHtml(group.description)}</p>
                        </div>
                    ` : ''}
                    
                    ${group.rules && Object.keys(group.rules).length > 0 ? `
                        <div class="section">
                            <h4>Group Rules</h4>
                            <ul>
                                ${Object.entries(group.rules).map(([key, value]) => `
                                    <li><strong>${key}:</strong> ${value}</li>
                                `).join('')}
                            </ul>
                        </div>
                    ` : ''}
                    
                    ${group.tags && group.tags.length > 0 ? `
                        <div class="section">
                            <h4>Tags</h4>
                            <div class="tags">
                                ${group.tags.map(tag => `
                                    <span class="badge">${escapeHtml(tag)}</span>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
    
    showModal(modalHTML);
}

// ===== UTILITY FUNCTIONS =====
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function getFlagEmoji(countryCode) {
    const countryFlags = {
        'KE': '🇰🇪',
        'UG': '🇺🇬',
        'TZ': '🇹🇿',
        'RW': '🇷🇼',
        'NG': '🇳🇬',
        'GH': '🇬🇭',
        'ZA': '🇿🇦',
        'EG': '🇪🇬',
        'ET': '🇪🇹',
        'SN': '🇸🇳'
    };
    
    return countryFlags[countryCode] || '🏳️';
}

function getCountryName(countryCode) {
    const countryNames = {
        'KE': 'Kenya',
        'UG': 'Uganda',
        'TZ': 'Tanzania',
        'RW': 'Rwanda',
        'NG': 'Nigeria',
        'GH': 'Ghana',
        'ZA': 'South Africa',
        'EG': 'Egypt',
        'ET': 'Ethiopia',
        'SN': 'Senegal'
    };
    
    return countryNames[countryCode] || 'Unknown Country';
}

function showModal(html) {
    // Remove existing modal
    const existingModal = document.querySelector('.modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add new modal
    document.body.insertAdjacentHTML('beforeend', html);
    
    // Show modal
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.style.display = 'block';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        setTimeout(() => modal.remove(), 300);
    }
}

function showNotification(message, type = 'info') {
    // Implementation would depend on your notification system
    console.log(`Notification [${type}]: ${message}`);
    
    // You could integrate with a notification component here
    if (window.showAppNotification) {
        window.showAppNotification(message, type);
    }
}

// ===== EVENT HANDLERS =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize groups module
    initGroupsModule();
    
    // Auto-render groups list if container exists
    if (document.getElementById('groupsList')) {
        renderGroupList('groupsList');
    }
    
    // Handle group creation form
    const createGroupForm = document.getElementById('createGroupForm');
    if (createGroupForm) {
        createGroupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const groupData = {
                name: formData.get('groupName'),
                type: formData.get('groupType'),
                country: groupsModule.currentCountry || formData.get('country'),
                description: formData.get('description'),
                rules: {
                    requiresInvitation: formData.get('requiresInvitation') === 'true',
                    minRating: parseFloat(formData.get('minRating')) || 0
                },
                tags: formData.get('tags') ? formData.get('tags').split(',') : []
            };
            
            const result = createGroup(groupData);
            
            if (result.success) {
                showNotification('Group created successfully!', 'success');
                this.reset();
                
                // Redirect to group page or refresh list
                if (window.location.pathname.includes('groups.html')) {
                    renderGroupList('groupsList');
                }
            } else {
                showNotification(result.error, 'error');
            }
        });
    }
    
    // Handle group search
    const groupSearch = document.getElementById('groupSearch');
    if (groupSearch) {
        groupSearch.addEventListener('input', function() {
            const filter = {
                searchTerm: this.value
            };
            renderGroupList('groupsList', filter);
        });
    }
    
    // Handle group type filter
    const groupTypeFilter = document.getElementById('groupTypeFilter');
    if (groupTypeFilter) {
        groupTypeFilter.addEventListener('change', function() {
            const filter = {
                type: this.value === 'all' ? null : this.value
            };
            renderGroupList('groupsList', filter);
        });
    }
});

// ===== EXPORT MODULE FUNCTIONS =====
window.groupsModule = {
    init: initGroupsModule,
    createGroup: createGroup,
    joinGroup: joinGroup,
    joinGroupByInvitation: joinGroupByInvitation,
    leaveGroup: leaveGroup,
    updateGroup: updateGroup,
    transferOwnership: transferGroupOwnership,
    createInvitation: createGroupInvitation,
    getGroupById: getGroupById,
    getGroupMembers: getGroupMembers,
    getGroupAnalytics: getGroupAnalytics,
    getCurrentGroups: () => groupsModule.userGroups.map(id => getGroupById(id)),
    getAllGroups: () => groupsModule.allGroups,
    getInvitations: () => groupsModule.groupInvitations,
    renderGroupList: renderGroupList,
    enterGroup: enterGroup,
    viewGroupDetails: viewGroupDetails
};

// Auto-initialize when script loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGroupsModule);
} else {
    initGroupsModule();
}