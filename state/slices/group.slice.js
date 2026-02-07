/**
 * M-PESEWA GROUP SLICE
 * Strictly follows Section A rules for group management and hierarchy
 * Groups are the primary trusted circle within countries
 */

import { createSlice, createAsyncThunk } from 'reduxjs/toolkit';

// Initial state
const initialState = {
    // Current active group
    currentGroup: null,
    
    // User's groups (max 4 for borrowers with good rating - Section A)
    userGroups: [],
    
    // Group details and members
    groupDetails: {},
    groupMembers: [],
    groupLedgers: [],
    groupStatistics: {},
    
    // Group operations state
    isCreating: false,
    isJoining: false,
    isLeaving: false,
    isInviting: false,
    isModerating: false,
    
    // Group invitations
    pendingInvitations: [],
    sentInvitations: [],
    
    // Group search and discovery (within same country only)
    availableGroups: [],
    groupSearchResults: [],
    
    // Group rules and settings
    groupRules: {
        minMembers: 5,
        maxMembers: 1000,
        requireApproval: true,
        allowCrossGroup: false,
        maxBorrowersPerLender: null,
        interestRateCap: 0.10, // 10%
        repaymentPeriod: 7 // days
    },
    
    // Group admin capabilities
    adminCapabilities: {
        canRemoveMembers: false,
        canApproveLoans: false,
        canModifyRules: false,
        canViewAllLedgers: false,
        canInviteWithoutApproval: false,
        canResolveDisputes: false
    },
    
    // Loading states
    isLoading: false,
    isLoaded: false,
    error: null
};

// Async thunks
export const createGroup = createAsyncThunk(
    'group/createGroup',
    async (groupData, { rejectWithValue, getState }) => {
        try {
            const state = getState();
            const countryCode = state.country.currentCountry;
            const userRole = state.role.currentRole;
            const userId = state.role.currentProfile?.id;
            
            // Section A: Validate country
            if (!countryCode) {
                throw new Error('Country must be selected before creating group');
            }
            
            // Section A: Validate group creation permissions
            if (userRole === 'borrower') {
                const metadata = state.role.metadata;
                if (!metadata.canJoinNewGroups || metadata.currentGroupsCount >= metadata.maxGroupsAllowed) {
                    throw new Error('Borrower cannot create new group. Max groups limit reached or blacklisted.');
                }
            }
            
            // Validate group data
            validateGroupData(groupData);
            
            // Check if user already has group with same name in same country
            const existingGroup = await checkExistingGroup(groupData.name, countryCode, userId);
            if (existingGroup) {
                throw new Error(`Group "${groupData.name}" already exists in ${countryCode}`);
            }
            
            // Create group with country isolation
            const newGroup = await createNewGroup({
                ...groupData,
                country: countryCode,
                createdBy: userId,
                createdByRole: userRole,
                createdDate: new Date().toISOString()
            });
            
            // Add creator as first member and admin
            await addGroupMember(newGroup.id, userId, userRole, 'admin');
            
            // Update user's group count
            const userGroups = JSON.parse(localStorage.getItem(`mpesewa_user_${userId}_groups`) || '[]');
            userGroups.push({
                groupId: newGroup.id,
                role: 'admin',
                joinedDate: new Date().toISOString()
            });
            localStorage.setItem(`mpesewa_user_${userId}_groups`, JSON.stringify(userGroups));
            
            return {
                group: newGroup,
                memberCount: 1,
                isAdmin: true
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const joinGroup = createAsyncThunk(
    'group/joinGroup',
    async ({ groupId, invitationCode = null }, { rejectWithValue, getState }) => {
        try {
            const state = getState();
            const userId = state.role.currentProfile?.id;
            const userRole = state.role.currentRole;
            const countryCode = state.country.currentCountry;
            const userMetadata = state.role.metadata;
            
            // Section A: Check if user can join new groups
            if (userRole === 'borrower') {
                if (!userMetadata.canJoinNewGroups) {
                    throw new Error('Cannot join new groups. Blacklisted or max groups limit reached.');
                }
                
                // Check current group count
                const userGroups = JSON.parse(localStorage.getItem(`mpesewa_user_${userId}_groups`) || '[]');
                if (userGroups.length >= 4) {
                    throw new Error('Borrowers cannot join more than 4 groups (Section A Rule)');
                }
            }
            
            // Get group details
            const group = await getGroupById(groupId);
            
            if (!group) {
                throw new Error('Group not found');
            }
            
            // Section A: Country isolation
            if (group.country !== countryCode) {
                throw new Error(`Cannot join group in ${group.country}. You are registered in ${countryCode}`);
            }
            
            // Section A: Check if already a member
            const isMember = await checkGroupMembership(groupId, userId);
            if (isMember) {
                throw new Error('Already a member of this group');
            }
            
            // Section A: Groups are invitation or referral only
            if (!invitationCode && group.requireApproval) {
                throw new Error('This group requires invitation or approval to join');
            }
            
            // Validate invitation if provided
            if (invitationCode) {
                const isValidInvitation = await validateInvitation(invitationCode, groupId, userId);
                if (!isValidInvitation) {
                    throw new Error('Invalid or expired invitation');
                }
            }
            
            // Check group capacity (Section A: max 1000 members)
            const memberCount = await getGroupMemberCount(groupId);
            if (memberCount >= 1000) {
                throw new Error('Group has reached maximum capacity (1000 members)');
            }
            
            // Join group
            const joinResult = await addGroupMember(groupId, userId, userRole, 'member');
            
            // Update user's groups
            const userGroups = JSON.parse(localStorage.getItem(`mpesewa_user_${userId}_groups`) || '[]');
            userGroups.push({
                groupId,
                role: 'member',
                joinedDate: new Date().toISOString()
            });
            localStorage.setItem(`mpesewa_user_${userId}_groups`, JSON.stringify(userGroups));
            
            return {
                group,
                membership: joinResult,
                memberCount: memberCount + 1
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const leaveGroup = createAsyncThunk(
    'group/leaveGroup',
    async (groupId, { rejectWithValue, getState }) => {
        try {
            const state = getState();
            const userId = state.role.currentProfile?.id;
            const userRole = state.role.currentRole;
            
            // Check if user is group admin (Section A: Admin cannot leave without transferring)
            const group = await getGroupById(groupId);
            const membership = await getGroupMembership(groupId, userId);
            
            if (membership?.role === 'admin') {
                // Check if there are other admins
                const admins = await getGroupAdmins(groupId);
                if (admins.length <= 1) {
                    throw new Error('Cannot leave as the only admin. Transfer admin role first.');
                }
            }
            
            // Check for active loans/ledgers
            if (userRole === 'borrower') {
                const activeLoans = await getUserActiveLoansInGroup(userId, groupId);
                if (activeLoans.length > 0) {
                    throw new Error('Cannot leave group with active loans. Clear loans first.');
                }
            }
            
            if (userRole === 'lender') {
                const activeLedgers = await getUserActiveLedgersInGroup(userId, groupId);
                if (activeLedgers.length > 0) {
                    throw new Error('Cannot leave group with active ledgers. Clear ledgers first.');
                }
            }
            
            // Remove from group
            await removeGroupMember(groupId, userId);
            
            // Update user's groups
            const userGroups = JSON.parse(localStorage.getItem(`mpesewa_user_${userId}_groups`) || '[]');
            const updatedGroups = userGroups.filter(g => g.groupId !== groupId);
            localStorage.setItem(`mpesewa_user_${userId}_groups`, JSON.stringify(updatedGroups));
            
            return {
                groupId,
                leftAt: new Date().toISOString(),
                remainingGroups: updatedGroups.length
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const inviteToGroup = createAsyncThunk(
    'group/inviteToGroup',
    async ({ groupId, inviteePhone, inviteeName, relationship }, { rejectWithValue, getState }) => {
        try {
            const state = getState();
            const userId = state.role.currentProfile?.id;
            const inviterRole = state.role.currentRole;
            
            // Section A: Check invitation permissions
            const group = await getGroupById(groupId);
            const membership = await getGroupMembership(groupId, userId);
            
            if (!membership) {
                throw new Error('You are not a member of this group');
            }
            
            // Only admins and moderators can invite (Section A)
            if (!['admin', 'moderator'].includes(membership.role)) {
                throw new Error('Only group admins and moderators can invite new members');
            }
            
            // Check group capacity
            const memberCount = await getGroupMemberCount(groupId);
            if (memberCount >= 1000) {
                throw new Error('Group has reached maximum capacity (1000 members)');
            }
            
            // Generate invitation
            const invitation = await createInvitation({
                groupId,
                inviterId: userId,
                inviterRole,
                inviteePhone,
                inviteeName,
                relationship,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
                createdAt: new Date().toISOString()
            });
            
            return {
                invitation,
                group,
                inviter: state.role.currentProfile?.full_name || 'Unknown'
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const loadGroupDetails = createAsyncThunk(
    'group/loadDetails',
    async (groupId, { rejectWithValue, getState }) => {
        try {
            const state = getState();
            const userId = state.role.currentProfile?.id;
            
            // Load group data
            const group = await getGroupById(groupId);
            
            if (!group) {
                throw new Error('Group not found');
            }
            
            // Load members
            const members = await getGroupMembers(groupId);
            
            // Load statistics
            const statistics = await getGroupStatistics(groupId);
            
            // Check user's membership
            const membership = await getGroupMembership(groupId, userId);
            
            // Load ledgers if user is lender or admin
            let ledgers = [];
            if (membership?.role === 'admin' || state.role.currentRole === 'lender') {
                ledgers = await getGroupLedgers(groupId);
            }
            
            return {
                group,
                members,
                statistics,
                membership,
                ledgers
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const searchGroups = createAsyncThunk(
    'group/searchGroups',
    async (searchCriteria, { rejectWithValue, getState }) => {
        try {
            const state = getState();
            const countryCode = state.country.currentCountry;
            
            // Section A: Only search within current country
            const groups = await searchGroupsInCountry(countryCode, searchCriteria);
            
            return {
                groups,
                searchCriteria,
                countryCode,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Create slice
const groupSlice = createSlice({
    name: 'group',
    initialState,
    reducers: {
        // Set current group
        setCurrentGroup: (state, action) => {
            state.currentGroup = action.payload;
        },
        
        // Update group details
        updateGroupDetails: (state, action) => {
            if (state.currentGroup === action.payload.id) {
                state.groupDetails = {
                    ...state.groupDetails,
                    ...action.payload
                };
            }
        },
        
        // Update group rules
        updateGroupRules: (state, action) => {
            state.groupRules = {
                ...state.groupRules,
                ...action.payload
            };
        },
        
        // Add member to group
        addMember: (state, action) => {
            const { member, groupId } = action.payload;
            
            if (!state.currentGroup || state.currentGroup !== groupId) return;
            
            state.groupMembers.push(member);
            state.groupStatistics.memberCount = (state.groupStatistics.memberCount || 0) + 1;
        },
        
        // Remove member from group
        removeMember: (state, action) => {
            const { memberId, groupId } = action.payload;
            
            if (!state.currentGroup || state.currentGroup !== groupId) return;
            
            state.groupMembers = state.groupMembers.filter(m => m.id !== memberId);
            state.groupStatistics.memberCount = Math.max(0, (state.groupStatistics.memberCount || 1) - 1);
        },
        
        // Update member role
        updateMemberRole: (state, action) => {
            const { memberId, newRole, groupId } = action.payload;
            
            if (!state.currentGroup || state.currentGroup !== groupId) return;
            
            const memberIndex = state.groupMembers.findIndex(m => m.id === memberId);
            if (memberIndex !== -1) {
                state.groupMembers[memberIndex].role = newRole;
            }
        },
        
        // Clear group state
        clearGroupState: (state) => {
            Object.assign(state, initialState);
        },
        
        // Check group capacity
        checkGroupCapacity: (state, action) => {
            const { groupId } = action.payload;
            
            if (!state.currentGroup || state.currentGroup !== groupId) {
                return { available: false, reason: 'Not current group' };
            }
            
            const currentCount = state.groupMembers.length;
            const isFull = currentCount >= 1000;
            
            return {
                available: !isFull,
                currentCount,
                maxCapacity: 1000,
                remainingSlots: 1000 - currentCount
            };
        },
        
        // Validate group operation
        validateGroupOperation: (state, action) => {
            const { operation, userId, groupId } = action.payload;
            const membership = state.groupMembers.find(m => m.id === userId);
            
            // Section A: Group isolation rules
            if (!membership) {
                return {
                    allowed: false,
                    reason: 'Not a group member',
                    requires: 'group_membership'
                };
            }
            
            // Operation-specific permissions
            const permissions = {
                invite_members: ['admin', 'moderator'].includes(membership.role),
                remove_members: membership.role === 'admin',
                modify_rules: membership.role === 'admin',
                view_all_ledgers: ['admin', 'moderator', 'lender'].includes(membership.role),
                approve_loans: ['admin', 'moderator'].includes(membership.role),
                resolve_disputes: membership.role === 'admin'
            };
            
            return {
                allowed: permissions[operation] || false,
                reason: permissions[operation] ? null : `Requires ${operation} permissions`,
                userRole: membership.role,
                operation
            };
        },
        
        // Get group hierarchy info
        getGroupHierarchy: (state) => {
            const country = state.groupDetails?.country || 'Unknown';
            const groupName = state.groupDetails?.name || 'Unknown';
            const memberCount = state.groupMembers.length;
            const lenderCount = state.groupMembers.filter(m => m.roleType === 'lender').length;
            const borrowerCount = state.groupMembers.filter(m => m.roleType === 'borrower').length;
            const adminCount = state.groupMembers.filter(m => m.role === 'admin').length;
            
            return {
                country,
                groupName,
                memberCount,
                lenderCount,
                borrowerCount,
                adminCount,
                hierarchy: `Country: ${country} → Group: ${groupName} → Lenders: ${lenderCount} → Borrowers: ${borrowerCount}`
            };
        }
    },
    extraReducers: (builder) => {
        builder
            // Create group cases
            .addCase(createGroup.pending, (state) => {
                state.isCreating = true;
                state.error = null;
            })
            .addCase(createGroup.fulfilled, (state, action) => {
                const { group, memberCount, isAdmin } = action.payload;
                
                state.isCreating = false;
                state.currentGroup = group.id;
                state.groupDetails = group;
                state.groupStatistics.memberCount = memberCount;
                
                // Add to user groups
                if (!state.userGroups.find(g => g.groupId === group.id)) {
                    state.userGroups.push({
                        groupId: group.id,
                        groupName: group.name,
                        role: isAdmin ? 'admin' : 'member',
                        joinedDate: new Date().toISOString()
                    });
                }
                
                // Update admin capabilities
                if (isAdmin) {
                    state.adminCapabilities = {
                        canRemoveMembers: true,
                        canApproveLoans: true,
                        canModifyRules: true,
                        canViewAllLedgers: true,
                        canInviteWithoutApproval: true,
                        canResolveDisputes: true
                    };
                }
            })
            .addCase(createGroup.rejected, (state, action) => {
                state.isCreating = false;
                state.error = action.payload || action.error.message;
            })
            
            // Join group cases
            .addCase(joinGroup.pending, (state) => {
                state.isJoining = true;
                state.error = null;
            })
            .addCase(joinGroup.fulfilled, (state, action) => {
                const { group, membership, memberCount } = action.payload;
                
                state.isJoining = false;
                
                // Add to user groups if not already there
                if (!state.userGroups.find(g => g.groupId === group.id)) {
                    state.userGroups.push({
                        groupId: group.id,
                        groupName: group.name,
                        role: membership.role,
                        joinedDate: new Date().toISOString()
                    });
                }
                
                // If this is the current group, update details
                if (state.currentGroup === group.id) {
                    state.groupDetails = group;
                    state.groupStatistics.memberCount = memberCount;
                }
            })
            .addCase(joinGroup.rejected, (state, action) => {
                state.isJoining = false;
                state.error = action.payload || action.error.message;
            })
            
            // Leave group cases
            .addCase(leaveGroup.pending, (state) => {
                state.isLeaving = true;
                state.error = null;
            })
            .addCase(leaveGroup.fulfilled, (state, action) => {
                const { groupId, remainingGroups } = action.payload;
                
                state.isLeaving = false;
                
                // Remove from user groups
                state.userGroups = state.userGroups.filter(g => g.groupId !== groupId);
                
                // If leaving current group, clear group data
                if (state.currentGroup === groupId) {
                    state.currentGroup = null;
                    state.groupDetails = {};
                    state.groupMembers = [];
                    state.groupLedgers = [];
                    state.adminCapabilities = initialState.adminCapabilities;
                }
                
                // Update role metadata
                // This would be handled by role slice
            })
            .addCase(leaveGroup.rejected, (state, action) => {
                state.isLeaving = false;
                state.error = action.payload || action.error.message;
            })
            
            // Invite to group cases
            .addCase(inviteToGroup.pending, (state) => {
                state.isInviting = true;
                state.error = null;
            })
            .addCase(inviteToGroup.fulfilled, (state, action) => {
                const { invitation } = action.payload;
                
                state.isInviting = false;
                state.sentInvitations.push(invitation);
            })
            .addCase(inviteToGroup.rejected, (state, action) => {
                state.isInviting = false;
                state.error = action.payload || action.error.message;
            })
            
            // Load group details cases
            .addCase(loadGroupDetails.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loadGroupDetails.fulfilled, (state, action) => {
                const { group, members, statistics, membership, ledgers } = action.payload;
                
                state.isLoading = false;
                state.isLoaded = true;
                state.currentGroup = group.id;
                state.groupDetails = group;
                state.groupMembers = members;
                state.groupStatistics = statistics;
                state.groupLedgers = ledgers;
                
                // Update admin capabilities based on membership
                if (membership?.role === 'admin') {
                    state.adminCapabilities = {
                        canRemoveMembers: true,
                        canApproveLoans: true,
                        canModifyRules: true,
                        canViewAllLedgers: true,
                        canInviteWithoutApproval: true,
                        canResolveDisputes: true
                    };
                } else if (membership?.role === 'moderator') {
                    state.adminCapabilities = {
                        canRemoveMembers: false,
                        canApproveLoans: true,
                        canModifyRules: false,
                        canViewAllLedgers: true,
                        canInviteWithoutApproval: true,
                        canResolveDisputes: false
                    };
                }
            })
            .addCase(loadGroupDetails.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || action.error.message;
            })
            
            // Search groups cases
            .addCase(searchGroups.fulfilled, (state, action) => {
                state.groupSearchResults = action.payload.groups;
            });
    }
});

// Selectors
export const selectCurrentGroup = (state) => state.group.currentGroup;
export const selectGroupDetails = (state) => state.group.groupDetails;
export const selectGroupMembers = (state) => state.group.groupMembers;
export const selectUserGroups = (state) => state.group.userGroups;
export const selectGroupStatistics = (state) => state.group.groupStatistics;
export const selectIsLoading = (state) => state.group.isLoading;
export const selectAdminCapabilities = (state) => state.group.adminCapabilities;
export const selectGroupRules = (state) => state.group.groupRules;
export const selectGroupSearchResults = (state) => state.group.groupSearchResults;

export const selectLendersInGroup = (state) => 
    state.group.groupMembers.filter(m => m.roleType === 'lender');

export const selectBorrowersInGroup = (state) => 
    state.group.groupMembers.filter(m => m.roleType === 'borrower');

export const selectGroupHierarchy = (state) => {
    const group = state.group.groupDetails;
    const members = state.group.groupMembers;
    
    return {
        country: group?.country || 'Unknown',
        groupName: group?.name || 'Unknown',
        totalMembers: members.length,
        lenders: members.filter(m => m.roleType === 'lender').length,
        borrowers: members.filter(m => m.roleType === 'borrower').length,
        hierarchy: `Country: ${group?.country} → Group: ${group?.name} → Members: ${members.length}`
    };
};

export const selectCanJoinMoreGroups = (state) => {
    const userRole = state.role.currentRole;
    const userGroups = state.group.userGroups;
    const metadata = state.role.metadata;
    
    if (userRole === 'borrower') {
        return userGroups.length < 4 && metadata.canJoinNewGroups;
    }
    
    return true; // Lenders have no group limit
};

// Helper functions
const validateGroupData = (groupData) => {
    const requiredFields = ['name', 'type', 'description'];
    const missingFields = requiredFields.filter(field => !groupData[field]);
    
    if (missingFields.length > 0) {
        throw new Error(`Missing required group fields: ${missingFields.join(', ')}`);
    }
    
    if (groupData.name.length < 3 || groupData.name.length > 50) {
        throw new Error('Group name must be between 3 and 50 characters');
    }
    
    const validTypes = ['family', 'church', 'professional', 'local', 'social', 'business'];
    if (!validTypes.includes(groupData.type)) {
        throw new Error(`Group type must be one of: ${validTypes.join(', ')}`);
    }
};

const checkExistingGroup = async (groupName, countryCode, userId) => {
    const groups = JSON.parse(localStorage.getItem(`mpesewa_groups_${countryCode}`) || '[]');
    return groups.find(g => g.name === groupName && g.createdBy === userId);
};

const createNewGroup = async (groupData) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newGroup = {
        id: `GROUP_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...groupData,
        status: 'active',
        memberCount: 1,
        createdDate: new Date().toISOString(),
        updatedDate: new Date().toISOString()
    };
    
    // Store in localStorage
    const groups = JSON.parse(localStorage.getItem(`mpesewa_groups_${groupData.country}`) || '[]');
    groups.push(newGroup);
    localStorage.setItem(`mpesewa_groups_${groupData.country}`, JSON.stringify(groups));
    
    // Also store in global groups index
    const allGroups = JSON.parse(localStorage.getItem('mpesewa_all_groups') || '[]');
    allGroups.push({ id: newGroup.id, country: groupData.country, name: groupData.name });
    localStorage.setItem('mpesewa_all_groups', JSON.stringify(allGroups));
    
    return newGroup;
};

const getGroupById = async (groupId) => {
    // Search all countries for group
    const allGroups = JSON.parse(localStorage.getItem('mpesewa_all_groups') || '[]');
    const groupInfo = allGroups.find(g => g.id === groupId);
    
    if (!groupInfo) return null;
    
    const countryGroups = JSON.parse(localStorage.getItem(`mpesewa_groups_${groupInfo.country}`) || '[]');
    return countryGroups.find(g => g.id === groupId);
};

const addGroupMember = async (groupId, userId, userRole, memberRole) => {
    const group = await getGroupById(groupId);
    if (!group) throw new Error('Group not found');
    
    const memberData = {
        id: userId,
        role: memberRole,
        roleType: userRole,
        joinedDate: new Date().toISOString(),
        status: 'active'
    };
    
    // Store membership
    const memberships = JSON.parse(localStorage.getItem(`mpesewa_group_${groupId}_members`) || '[]');
    memberships.push(memberData);
    localStorage.setItem(`mpesewa_group_${groupId}_members`, JSON.stringify(memberships));
    
    // Update group member count
    const groups = JSON.parse(localStorage.getItem(`mpesewa_groups_${group.country}`) || '[]');
    const groupIndex = groups.findIndex(g => g.id === groupId);
    if (groupIndex !== -1) {
        groups[groupIndex].memberCount = (groups[groupIndex].memberCount || 0) + 1;
        groups[groupIndex].updatedDate = new Date().toISOString();
        localStorage.setItem(`mpesewa_groups_${group.country}`, JSON.stringify(groups));
    }
    
    return memberData;
};

const checkGroupMembership = async (groupId, userId) => {
    const memberships = JSON.parse(localStorage.getItem(`mpesewa_group_${groupId}_members`) || '[]');
    return memberships.find(m => m.id === userId);
};

const getGroupMembership = async (groupId, userId) => {
    return checkGroupMembership(groupId, userId);
};

const getGroupMemberCount = async (groupId) => {
    const memberships = JSON.parse(localStorage.getItem(`mpesewa_group_${groupId}_members`) || '[]');
    return memberships.length;
};

const getGroupMembers = async (groupId) => {
    const memberships = JSON.parse(localStorage.getItem(`mpesewa_group_${groupId}_members`) || '[]');
    return memberships;
};

const getGroupAdmins = async (groupId) => {
    const memberships = JSON.parse(localStorage.getItem(`mpesewa_group_${groupId}_members`) || '[]');
    return memberships.filter(m => m.role === 'admin');
};

const removeGroupMember = async (groupId, userId) => {
    const memberships = JSON.parse(localStorage.getItem(`mpesewa_group_${groupId}_members`) || '[]');
    const updatedMemberships = memberships.filter(m => m.id !== userId);
    localStorage.setItem(`mpesewa_group_${groupId}_members`, JSON.stringify(updatedMemberships));
    
    // Update group member count
    const group = await getGroupById(groupId);
    if (group) {
        const groups = JSON.parse(localStorage.getItem(`mpesewa_groups_${group.country}`) || '[]');
        const groupIndex = groups.findIndex(g => g.id === groupId);
        if (groupIndex !== -1) {
            groups[groupIndex].memberCount = Math.max(0, (groups[groupIndex].memberCount || 1) - 1);
            groups[groupIndex].updatedDate = new Date().toISOString();
            localStorage.setItem(`mpesewa_groups_${group.country}`, JSON.stringify(groups));
        }
    }
};

const validateInvitation = async (invitationCode, groupId, userId) => {
    const invitations = JSON.parse(localStorage.getItem(`mpesewa_group_${groupId}_invitations`) || '[]');
    const invitation = invitations.find(i => i.code === invitationCode);
    
    if (!invitation) return false;
    
    // Check expiration
    if (new Date(invitation.expiresAt) < new Date()) {
        return false;
    }
    
    // Check if already used
    if (invitation.used) {
        return false;
    }
    
    // Mark as used
    invitation.used = true;
    invitation.usedBy = userId;
    invitation.usedAt = new Date().toISOString();
    
    localStorage.setItem(`mpesewa_group_${groupId}_invitations`, JSON.stringify(invitations));
    
    return true;
};

const createInvitation = async (invitationData) => {
    const { groupId } = invitationData;
    
    const invitation = {
        ...invitationData,
        code: `INV_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        used: false
    };
    
    const invitations = JSON.parse(localStorage.getItem(`mpesewa_group_${groupId}_invitations`) || '[]');
    invitations.push(invitation);
    localStorage.setItem(`mpesewa_group_${groupId}_invitations`, JSON.stringify(invitations));
    
    return invitation;
};

const getGroupStatistics = async (groupId) => {
    // Mock statistics
    return {
        totalLoans: Math.floor(Math.random() * 100) + 10,
        totalAmountLent: Math.floor(Math.random() * 1000000) + 100000,
        repaymentRate: 85 + Math.floor(Math.random() * 15),
        activeLoans: Math.floor(Math.random() * 20) + 5,
        defaultRate: Math.floor(Math.random() * 5),
        avgLoanAmount: Math.floor(Math.random() * 5000) + 1000,
        avgRepaymentDays: 5 + Math.random() * 2
    };
};

const getGroupLedgers = async (groupId) => {
    // Mock ledgers
    return Array.from({ length: 5 }, (_, i) => ({
        id: `LEDGER_${groupId}_${i}`,
        borrowerId: `BORR_${i}`,
        borrowerName: `Borrower ${i}`,
        amount: Math.floor(Math.random() * 5000) + 1000,
        interest: 0.10,
        dueDate: new Date(Date.now() + (7 - i) * 24 * 60 * 60 * 1000).toISOString(),
        status: i < 3 ? 'active' : 'cleared'
    }));
};

const searchGroupsInCountry = async (countryCode, criteria) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const groups = JSON.parse(localStorage.getItem(`mpesewa_groups_${countryCode}`) || '[]');
    
    let filtered = groups.filter(g => g.status === 'active');
    
    if (criteria.name) {
        filtered = filtered.filter(g => 
            g.name.toLowerCase().includes(criteria.name.toLowerCase())
        );
    }
    
    if (criteria.type) {
        filtered = filtered.filter(g => g.type === criteria.type);
    }
    
    if (criteria.minMembers) {
        filtered = filtered.filter(g => g.memberCount >= criteria.minMembers);
    }
    
    if (criteria.maxMembers) {
        filtered = filtered.filter(g => g.memberCount <= criteria.maxMembers);
    }
    
    return filtered.slice(0, 20); // Limit results
};

const getUserActiveLoansInGroup = async (userId, groupId) => {
    // Mock implementation
    return [];
};

const getUserActiveLedgersInGroup = async (userId, groupId) => {
    // Mock implementation
    return [];
};

// Export actions and reducer
export const {
    setCurrentGroup,
    updateGroupDetails,
    updateGroupRules,
    addMember,
    removeMember,
    updateMemberRole,
    clearGroupState,
    checkGroupCapacity,
    validateGroupOperation,
    getGroupHierarchy
} = groupSlice.actions;

export default groupSlice.reducer;

/**
 * GROUP HIERARCHY ENFORCEMENT (Section A Strict Rules):
 * 
 * 1. Groups are country-locked (no cross-country groups)
 * 2. Minimum 5 members, maximum 1000 members per group
 * 3. Each group has one Admin/Founder
 * 4. Entry is by invitation or referral only
 * 5. Members join as either Lenders or Borrowers
 * 6. Lenders can only lend within their group
 * 7. Borrowers can join max 4 groups (with good rating)
 * 8. Groups are independent trust circles
 * 9. Group admins can moderate and invite members
 * 10. No cross-group lending allowed
 */