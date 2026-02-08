/**
 * M-PESEWA ROLE SLICE
 * Strictly follows Section A rules for user roles and hierarchy
 * Global → Country → Groups → Lenders → Borrowers (Ledgers)
 */

import { createSlice, createAsyncThunk } from 'reduxjs/toolkit';

// Initial state with strict hierarchy enforcement
const initialState = {
    // Current active role state
    currentRole: null, // 'borrower', 'lender', 'group_admin', 'platform_admin'
    currentProfile: null, // Current user profile based on role
    
    // Multiple profiles for dual-role users (Section A: Users can have both borrower and lender profiles)
    profiles: {
        borrower: null,
        lender: null,
        group_admin: null
    },
    
    // Role switching state
    isSwitching: false,
    switchError: null,
    
    // Role permissions and restrictions
    permissions: {
        canBorrow: false,
        canLend: false,
        canCreateGroup: false,
        canInviteMembers: false,
        canModerateGroup: false,
        canAccessAdmin: false,
        canOverrideBlacklist: false,
        canEditLedgers: false
    },
    
    // Role metadata
    metadata: {
        isDualRole: false,
        isBlacklisted: false,
        isSubscriptionActive: false,
        maxGroupsAllowed: 1, // Default, increases with good rating (Section A)
        currentGroupsCount: 0,
        canJoinNewGroups: true
    },
    
    // Loading states
    isLoading: false,
    isLoaded: false,
    error: null
};

// Async thunks for role operations
export const loginUser = createAsyncThunk(
    'role/loginUser',
    async ({ username, password, roleType }, { rejectWithValue }) => {
        try {
            // Simulate API call
            const response = await mockLoginAPI(username, password, roleType);
            
            // Validate role-specific requirements (Section A)
            if (roleType === 'lender' && !response.subscription_active) {
                throw new Error('Lenders must have active subscription (Section A Rule)');
            }
            
            if (roleType === 'borrower' && response.blacklist_status) {
                throw new Error('Blacklisted borrowers cannot access platform (Section A Rule)');
            }
            
            return {
                ...response,
                roleType,
                loginTimestamp: new Date().toISOString()
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const registerUser = createAsyncThunk(
    'role/registerUser',
    async (registrationData, { rejectWithValue }) => {
        try {
            // Validate strict registration rules (Section A)
            validateRegistrationData(registrationData);
            
            // Check if user already has this role in same country
            const existingUser = await checkExistingUser(
                registrationData.nationalId,
                registrationData.country,
                registrationData.roleType
            );
            
            if (existingUser) {
                throw new Error(`User already registered as ${registrationData.roleType} in ${registrationData.country}`);
            }
            
            // For lenders: Validate subscription selection (Section A)
            if (registrationData.roleType === 'lender') {
                if (!registrationData.subscriptionLevel) {
                    throw new Error('Lenders must select subscription level (Section A Rule)');
                }
                
                if (!registrationData.categories || registrationData.categories.length === 0) {
                    throw new Error('Lenders must select at least one lending category (Section A Rule)');
                }
            }
            
            // For borrowers: Validate group selection (Section A)
            if (registrationData.roleType === 'borrower') {
                if (!registrationData.groupId && !registrationData.createNewGroup) {
                    throw new Error('Borrowers must join or create a group (Section A Rule)');
                }
                
                // Check if borrower already in 4 groups (max limit)
                const borrowerGroups = await getUserGroupCount(registrationData.nationalId);
                if (borrowerGroups >= 4) {
                    throw new Error('Borrowers cannot join more than 4 groups (Section A Rule)');
                }
            }
            
            // Validate referrers/guarantors (Section A: 2 referrers required)
            if (!registrationData.referrer1 || !registrationData.referrer2) {
                throw new Error('Two referrers/guarantors required for trust verification (Section A Rule)');
            }
            
            // Simulate registration
            const response = await mockRegisterAPI(registrationData);
            
            return {
                ...response,
                roleType: registrationData.roleType,
                registrationTimestamp: new Date().toISOString()
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const switchRole = createAsyncThunk(
    'role/switchRole',
    async (targetRole, { getState, rejectWithValue }) => {
        try {
            const state = getState().role;
            const currentRole = state.currentRole;
            
            // Section A: Cannot switch automatically, must log out and register
            if (currentRole && currentRole !== targetRole) {
                throw new Error('Cannot switch roles automatically. Please logout and register for new role (Section A Rule)');
            }
            
            // Check if user already has profile for target role
            const existingProfile = state.profiles[targetRole];
            
            if (!existingProfile) {
                throw new Error(`No ${targetRole} profile found. Please register first.`);
            }
            
            // Validate role-specific conditions
            if (targetRole === 'lender') {
                if (!existingProfile.subscription_active) {
                    throw new Error('Lender subscription expired. Renew to access lender features.');
                }
            }
            
            if (targetRole === 'borrower') {
                if (existingProfile.blacklist_status) {
                    throw new Error('Blacklisted borrowers cannot access platform.');
                }
            }
            
            return {
                roleType: targetRole,
                profile: existingProfile,
                switchTimestamp: new Date().toISOString()
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const logoutUser = createAsyncThunk(
    'role/logoutUser',
    async (_, { getState }) => {
        const state = getState().role;
        
        // Audit log for logout
        await logAuditEvent({
            event: 'USER_LOGOUT',
            userId: state.currentProfile?.id,
            role: state.currentRole,
            timestamp: new Date().toISOString()
        });
        
        return {
            logoutTimestamp: new Date().toISOString()
        };
    }
);

// Create the role slice
const roleSlice = createSlice({
    name: 'role',
    initialState,
    reducers: {
        // Update role permissions based on current state
        updatePermissions: (state) => {
            const role = state.currentRole;
            const profile = state.currentProfile;
            const metadata = state.metadata;
            
            // Reset permissions
            state.permissions = {
                canBorrow: false,
                canLend: false,
                canCreateGroup: false,
                canInviteMembers: false,
                canModerateGroup: false,
                canAccessAdmin: false,
                canOverrideBlacklist: false,
                canEditLedgers: false
            };
            
            // Set permissions based on role (Section A Rules)
            switch (role) {
                case 'borrower':
                    state.permissions.canBorrow = true;
                    state.permissions.canCreateGroup = metadata.canJoinNewGroups && metadata.currentGroupsCount < metadata.maxGroupsAllowed;
                    state.permissions.canInviteMembers = profile?.group_role === 'admin' || profile?.group_role === 'moderator';
                    break;
                    
                case 'lender':
                    state.permissions.canLend = profile?.subscription_active || false;
                    state.permissions.canCreateGroup = true;
                    state.permissions.canInviteMembers = true;
                    state.permissions.canEditLedgers = true;
                    break;
                    
                case 'group_admin':
                    state.permissions.canBorrow = true;
                    state.permissions.canLend = profile?.subscription_active || false;
                    state.permissions.canCreateGroup = true;
                    state.permissions.canInviteMembers = true;
                    state.permissions.canModerateGroup = true;
                    state.permissions.canEditLedgers = true;
                    break;
                    
                case 'platform_admin':
                    state.permissions.canAccessAdmin = true;
                    state.permissions.canOverrideBlacklist = true;
                    state.permissions.canEditLedgers = true;
                    state.permissions.canModerateGroup = true;
                    break;
                    
                default:
                    break;
            }
            
            // Additional condition checks
            if (metadata.isBlacklisted) {
                state.permissions.canBorrow = false;
                state.permissions.canCreateGroup = false;
                state.permissions.canJoinNewGroups = false;
            }
        },
        
        // Update role metadata
        updateMetadata: (state, action) => {
            state.metadata = {
                ...state.metadata,
                ...action.payload
            };
            
            // Recalculate permissions after metadata update
            roleSlice.caseReducers.updatePermissions(state);
        },
        
        // Clear role state
        clearRoleState: (state) => {
            Object.assign(state, initialState);
        },
        
        // Set dual role status
        setDualRoleStatus: (state, action) => {
            state.metadata.isDualRole = action.payload;
            
            if (action.payload && state.currentProfile) {
                // If user is dual role, store reference to other profile
                const otherRole = state.currentRole === 'borrower' ? 'lender' : 'borrower';
                // Note: In Section A, separate profiles are maintained
            }
        },
        
        // Update group count (Section A: Max 4 groups for borrowers with good rating)
        updateGroupCount: (state, action) => {
            const newCount = action.payload;
            
            if (state.currentRole === 'borrower') {
                // Check max group limit
                if (newCount > 4) {
                    throw new Error('Borrowers cannot join more than 4 groups (Section A Rule)');
                }
                
                // Update canJoinNewGroups based on count and rating
                const canJoinMore = newCount < 4 && state.metadata.canJoinNewGroups;
                state.metadata.canJoinNewGroups = canJoinMore;
            }
            
            state.metadata.currentGroupsCount = newCount;
        },
        
        // Handle blacklist status change
        setBlacklistStatus: (state, action) => {
            const { isBlacklisted, reason, adminId } = action.payload;
            
            state.metadata.isBlacklisted = isBlacklisted;
            
            if (isBlacklisted) {
                // Blacklisted users lose certain permissions (Section A)
                state.permissions.canBorrow = false;
                state.permissions.canCreateGroup = false;
                state.permissions.canJoinNewGroups = false;
                
                // Log blacklist event
                logBlacklistEvent({
                    userId: state.currentProfile?.id,
                    adminId,
                    reason,
                    timestamp: new Date().toISOString()
                });
            } else {
                // Only platform admin can remove blacklist (Section A)
                roleSlice.caseReducers.updatePermissions(state);
            }
        }
    },
    extraReducers: (builder) => {
        builder
            // Login cases
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                const { roleType, ...profileData } = action.payload;
                
                state.isLoading = false;
                state.isLoaded = true;
                state.currentRole = roleType;
                state.currentProfile = profileData;
                state.profiles[roleType] = profileData;
                
                // Update metadata based on profile
                state.metadata = {
                    ...state.metadata,
                    isBlacklisted: profileData.blacklist_status || false,
                    isSubscriptionActive: profileData.subscription_active || false,
                    currentGroupsCount: profileData.groups_count || 0,
                    canJoinNewGroups: !profileData.blacklist_status && 
                                     (profileData.groups_count || 0) < 4 &&
                                     (profileData.rating || 0) >= 3 // Good rating check
                };
                
                // Update permissions
                roleSlice.caseReducers.updatePermissions(state);
                
                // Store login state
                localStorage.setItem('mpesewa_current_role', roleType);
                localStorage.setItem('mpesewa_user_id', profileData.id);
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || action.error.message;
                state.currentRole = null;
                state.currentProfile = null;
            })
            
            // Registration cases
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                const { roleType, ...profileData } = action.payload;
                
                state.isLoading = false;
                state.currentRole = roleType;
                state.currentProfile = profileData;
                state.profiles[roleType] = profileData;
                
                // Initialize metadata for new user
                state.metadata = {
                    isDualRole: Object.keys(state.profiles).filter(k => state.profiles[k] !== null).length > 1,
                    isBlacklisted: false,
                    isSubscriptionActive: roleType === 'lender' ? false : true, // Lenders need to activate subscription
                    maxGroupsAllowed: 1, // Start with 1 group, increase with good rating
                    currentGroupsCount: 0,
                    canJoinNewGroups: true
                };
                
                // Update permissions
                roleSlice.caseReducers.updatePermissions(state);
                
                // Store registration state
                localStorage.setItem('mpesewa_current_role', roleType);
                localStorage.setItem('mpesewa_user_id', profileData.id);
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || action.error.message;
            })
            
            // Switch role cases
            .addCase(switchRole.pending, (state) => {
                state.isSwitching = true;
                state.switchError = null;
            })
            .addCase(switchRole.fulfilled, (state, action) => {
                const { roleType, profile } = action.payload;
                
                state.isSwitching = false;
                state.currentRole = roleType;
                state.currentProfile = profile;
                
                // Update metadata
                state.metadata.isDualRole = true;
                state.metadata.isSubscriptionActive = profile.subscription_active || false;
                state.metadata.isBlacklisted = profile.blacklist_status || false;
                
                // Update permissions
                roleSlice.caseReducers.updatePermissions(state);
                
                // Update localStorage
                localStorage.setItem('mpesewa_current_role', roleType);
            })
            .addCase(switchRole.rejected, (state, action) => {
                state.isSwitching = false;
                state.switchError = action.payload || action.error.message;
            })
            
            // Logout cases
            .addCase(logoutUser.fulfilled, (state) => {
                // Clear current state but keep profiles for future logins
                state.currentRole = null;
                state.currentProfile = null;
                state.isSwitching = false;
                state.switchError = null;
                state.permissions = initialState.permissions;
                
                // Clear localStorage
                localStorage.removeItem('mpesewa_current_role');
                localStorage.removeItem('mpesewa_user_id');
                localStorage.removeItem('mpesewa_auth_token');
            });
    }
});

// Selectors
export const selectCurrentRole = (state) => state.role.currentRole;
export const selectCurrentProfile = (state) => state.role.currentProfile;
export const selectIsLoading = (state) => state.role.isLoading;
export const selectPermissions = (state) => state.role.permissions;
export const selectMetadata = (state) => state.role.metadata;
export const selectIsDualRole = (state) => state.role.metadata.isDualRole;
export const selectCanBorrow = (state) => state.role.permissions.canBorrow;
export const selectCanLend = (state) => state.role.permissions.canLend;
export const selectIsBlacklisted = (state) => state.role.metadata.isBlacklisted;
export const selectMaxGroupsAllowed = (state) => state.role.metadata.maxGroupsAllowed;
export const selectCurrentGroupsCount = (state) => state.role.metadata.currentGroupsCount;
export const selectCanJoinNewGroups = (state) => state.role.metadata.canJoinNewGroups;

// Helper functions (simulated for frontend)
const mockLoginAPI = async (username, password, roleType) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock response based on role
    const mockResponses = {
        borrower: {
            id: `BORR_${Date.now()}`,
            username,
            full_name: 'Test Borrower',
            national_id: '12345678',
            phone: '+254700000000',
            country: 'KE',
            groups: ['group_1'],
            rating: 4.5,
            blacklist_status: false,
            total_borrowed: 15000,
            active_loans: 2,
            repayment_rate: 95
        },
        lender: {
            id: `LEND_${Date.now()}`,
            username,
            full_name: 'Test Lender',
            national_id: '87654321',
            phone: '+254711111111',
            country: 'KE',
            groups: ['group_1'],
            subscription_active: true,
            subscription_level: 'premium',
            subscription_expiry: '2024-12-28', // 28th of month (Section A)
            categories: ['fare', 'data', 'food'],
            total_lent: 50000,
            active_ledgers: 5,
            total_interest_earned: 5000
        },
        group_admin: {
            id: `ADMIN_${Date.now()}`,
            username,
            full_name: 'Group Admin',
            national_id: '11223344',
            phone: '+254722222222',
            country: 'KE',
            groups: ['group_1'],
            group_role: 'admin',
            can_moderate: true,
            can_invite: true
        }
    };
    
    return mockResponses[roleType] || mockResponses.borrower;
};

const mockRegisterAPI = async (data) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const baseProfile = {
        id: `${data.roleType.toUpperCase()}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        username: data.username,
        full_name: data.fullName,
        national_id: data.nationalId,
        phone: data.phone,
        country: data.country,
        registration_date: new Date().toISOString(),
        status: 'active'
    };
    
    if (data.roleType === 'borrower') {
        return {
            ...baseProfile,
            rating: 5, // Start with perfect rating
            blacklist_status: false,
            groups: data.groupId ? [data.groupId] : [],
            max_groups_allowed: 1,
            referrers: [data.referrer1, data.referrer2]
        };
    } else if (data.roleType === 'lender') {
        return {
            ...baseProfile,
            subscription_active: false, // Needs payment activation
            subscription_level: data.subscriptionLevel,
            categories: data.categories,
            brand_name: data.brandName || null,
            total_lent: 0,
            active_ledgers: 0,
            referrers: [data.referrer1, data.referrer2]
        };
    }
    
    return baseProfile;
};

const validateRegistrationData = (data) => {
    const requiredFields = [
        'username', 'fullName', 'nationalId', 'phone', 
        'country', 'roleType', 'referrer1', 'referrer2'
    ];
    
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }
    
    // Validate phone format
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(data.phone)) {
        throw new Error('Invalid phone number format');
    }
    
    // Validate username length
    if (data.username.length < 3 || data.username.length > 20) {
        throw new Error('Username must be between 3 and 20 characters');
    }
    
    // Validate password (if provided)
    if (data.password) {
        if (data.password.length < 8 || data.password.length > 12) {
            throw new Error('Password must be 8-12 characters (Section A Rule)');
        }
        
        const hasUpperCase = /[A-Z]/.test(data.password);
        const hasLowerCase = /[a-z]/.test(data.password);
        const hasNumbers = /\d/.test(data.password);
        const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(data.password);
        
        if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
            throw new Error('Password must include uppercase, lowercase, numbers, and symbols (Section A Rule)');
        }
    }
};

const checkExistingUser = async (nationalId, country, roleType) => {
    // Check localStorage for existing user
    const users = JSON.parse(localStorage.getItem('mpesewa_users') || '{}');
    const userKey = `${nationalId}_${country}_${roleType}`;
    
    return users[userKey] || null;
};

const getUserGroupCount = async (nationalId) => {
    // Mock group count retrieval
    const userGroups = JSON.parse(localStorage.getItem('mpesewa_user_groups') || '{}');
    return userGroups[nationalId]?.length || 0;
};

const logAuditEvent = async (eventData) => {
    // Store audit log
    const auditLogs = JSON.parse(localStorage.getItem('mpesewa_audit_logs') || '[]');
    auditLogs.push(eventData);
    localStorage.setItem('mpesewa_audit_logs', JSON.stringify(auditLogs));
};

const logBlacklistEvent = async (eventData) => {
    // Store blacklist log
    const blacklistLogs = JSON.parse(localStorage.getItem('mpesewa_blacklist_logs') || '[]');
    blacklistLogs.push(eventData);
    localStorage.setItem('mpesewa_blacklist_logs', JSON.stringify(blacklistLogs));
};

// Export actions and reducer
export const { 
    updatePermissions, 
    updateMetadata, 
    clearRoleState, 
    setDualRoleStatus,
    updateGroupCount,
    setBlacklistStatus
} = roleSlice.actions;

export default roleSlice.reducer;

/**
 * ROLE HIERARCHY ENFORCEMENT (Section A Strict Rules):
 * 
 * 1. Global → Country → Groups → Lenders → Borrowers (Ledgers)
 * 2. Users can be both borrowers and lenders but as separate profiles
 * 3. Role switching requires logout and new registration
 * 4. Lenders must have active subscription
 * 5. Borrowers cannot join more than 4 groups (requires good rating)
 * 6. Blacklisted users cannot borrow or join new groups
 * 7. Platform admin can override blacklists and ledgers
 * 8. Country isolation enforced at registration
 * 9. Group isolation: Lenders can only lend within their group
 * 10. Referral-only model with 2 guarantors required
 */