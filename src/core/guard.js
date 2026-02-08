/**
 * M-PESEWA STRICT GUARD SYSTEM
 * Enforces all access rules and business logic
 */

class MpesewaGuard {
    constructor() {
        this.strictHierarchy = {
            global: true,
            country: ['KE', 'UG', 'TZ', 'RW', 'BI', 'SS', 'SO', 'DRC', 'NG', 'GH', 'ZA', 'ET'],
            group: { min: 5, max: 1000 },
            lender: { maxLedgers: Infinity },
            borrower: { maxGroups: 4 }
        };
    }
    
    // MAIN ENTRY POINT
    async checkAccess(path, userContext) {
        // Check global hierarchy first
        const hierarchyCheck = this.validateHierarchy(path, userContext);
        if (!hierarchyCheck.allowed) {
            return hierarchyCheck;
        }
        
        // Check specific guards based on path
        if (path.includes('/lender/')) {
            return await this.checkLenderAccess(path, userContext);
        }
        
        if (path.includes('/borrower/')) {
            return await this.checkBorrowerAccess(path, userContext);
        }
        
        if (path.includes('/admin/')) {
            return await this.checkAdminAccess(path, userContext);
        }
        
        if (path.includes('/groups/')) {
            return await this.checkGroupAccess(path, userContext);
        }
        
        return { allowed: true, reason: 'Access granted' };
    }
    
    // HIERARCHY VALIDATION (STRICT)
    validateHierarchy(path, userContext) {
        const { country, groupId, role } = userContext;
        
        // 1. COUNTRY ISOLATION (NON-NEGOTIABLE)
        if (country) {
            const pathCountry = this.extractCountryFromPath(path);
            if (pathCountry && pathCountry !== country) {
                return {
                    allowed: false,
                    reason: 'CROSS-COUNTRY ACCESS VIOLATION',
                    code: 'HIERARCHY_001',
                    redirect: `/country/${country}/dashboard`
                };
            }
        }
        
        // 2. GROUP ISOLATION (Lenders can only lend within their group)
        if (role === 'lender' && path.includes('/lender/portfolio')) {
            if (!groupId) {
                return {
                    allowed: false,
                    reason: 'GROUP CONTEXT REQUIRED FOR LENDING',
                    code: 'HIERARCHY_002',
                    redirect: '/groups'
                };
            }
        }
        
        // 3. BORROWER GROUP LIMIT (Max 4 groups)
        if (role === 'borrower') {
            const userGroups = JSON.parse(localStorage.getItem(`user_${userContext.id}_groups`) || '[]');
            if (userGroups.length >= 4 && path.includes('/groups/join')) {
                return {
                    allowed: false,
                    reason: 'MAXIMUM 4 GROUPS PER BORROWER REACHED',
                    code: 'HIERARCHY_003',
                    redirect: '/borrower/dashboard'
                };
            }
        }
        
        return { allowed: true };
    }
    
    // LENDER ACCESS RULES
    async checkLenderAccess(path, userContext) {
        const { id, subscription } = userContext;
        
        // 1. SUBSCRIPTION CHECK (NON-NEGOTIABLE)
        if (!subscription || subscription.status !== 'active') {
            return {
                allowed: false,
                reason: 'ACTIVE SUBSCRIPTION REQUIRED FOR LENDING',
                code: 'LENDER_001',
                redirect: '/lender/subscription'
            };
        }
        
        // 2. SUBSCRIPTION EXPIRY (28th of each month)
        const today = new Date();
        const expiryDate = new Date(subscription.expiry);
        
        if (today > expiryDate) {
            return {
                allowed: false,
                reason: 'SUBSCRIPTION EXPIRED ON 28TH',
                code: 'LENDER_002',
                redirect: '/lender/subscription',
                data: { expired: true, expiryDate }
            };
        }
        
        // 3. LENDING LIMIT CHECK
        if (path.includes('/lender/approve')) {
            const lendingLimit = this.getLendingLimit(subscription.plan);
            const totalLent = this.calculateTotalLent(id);
            
            if (totalLent >= lendingLimit.weekly) {
                return {
                    allowed: false,
                    reason: 'WEEKLY LENDING LIMIT REACHED',
                    code: 'LENDER_003',
                    redirect: '/lender/dashboard',
                    data: { limit: lendingLimit, current: totalLent }
                };
            }
        }
        
        // 4. LEDGER CREATION PERMISSION
        if (path.includes('/ledger/create')) {
            const activeLedgers = this.countActiveLedgers(id);
            const maxLedgers = subscription.plan === 'basic' ? 10 : Infinity;
            
            if (activeLedgers >= maxLedgers) {
                return {
                    allowed: false,
                    reason: 'MAXIMUM ACTIVE LEDGERS REACHED',
                    code: 'LENDER_004',
                    redirect: '/lender/ledgers'
                };
            }
        }
        
        return { allowed: true };
    }
    
    // BORROWER ACCESS RULES
    async checkBorrowerAccess(path, userContext) {
        const { id, role } = userContext;
        
        // 1. BLACKLIST CHECK
        const isBlacklisted = await this.checkBlacklistStatus(id);
        if (isBlacklisted) {
            return {
                allowed: false,
                reason: 'BORROWER IS BLACKLISTED',
                code: 'BORROWER_001',
                redirect: '/blacklist',
                data: { blacklistReason: isBlacklisted.reason }
            };
        }
        
        // 2. ACTIVE LOAN CHECK (Max 1 per group)
        if (path.includes('/borrower/apply')) {
            const groupId = localStorage.getItem('mpesewa_current_group');
            const hasActiveLoan = await this.hasActiveLoanInGroup(id, groupId);
            
            if (hasActiveLoan) {
                return {
                    allowed: false,
                    reason: 'ACTIVE LOAN ALREADY EXISTS IN THIS GROUP',
                    code: 'BORROWER_002',
                    redirect: '/borrower/dashboard'
                };
            }
        }
        
        // 3. RATING CHECK (Min 3 stars for additional groups)
        if (path.includes('/groups/join')) {
            const currentGroups = JSON.parse(localStorage.getItem(`user_${id}_groups`) || '[]');
            if (currentGroups.length >= 1) {
                const rating = await this.getBorrowerRating(id);
                if (rating < 3) {
                    return {
                        allowed: false,
                        reason: 'MINIMUM 3-STAR RATING REQUIRED FOR ADDITIONAL GROUPS',
                        code: 'BORROWER_003',
                        redirect: '/borrower/dashboard',
                        data: { currentRating: rating, required: 3 }
                    };
                }
            }
        }
        
        // 4. DEFAULT CHECK (Block if defaulted in any group)
        const hasDefaults = await this.checkDefaults(id);
        if (hasDefaults) {
            return {
                allowed: false,
                reason: 'DEFAULTED LOANS EXIST',
                code: 'BORROWER_004',
                redirect: '/borrower/repayments',
                data: { defaults: hasDefaults }
            };
        }
        
        return { allowed: true };
    }
    
    // ADMIN ACCESS RULES
    async checkAdminAccess(path, userContext) {
        const { roles } = userContext;
        
        // 1. ADMIN ROLE CHECK
        if (!roles || !roles.includes('admin')) {
            return {
                allowed: false,
                reason: 'ADMIN PRIVILEGES REQUIRED',
                code: 'ADMIN_001',
                redirect: '/'
            };
        }
        
        // 2. ADMIN OVERRIDE PERMISSIONS
        if (path.includes('/admin/override')) {
            const canOverride = await this.checkAdminOverridePermission(userContext.id);
            if (!canOverride) {
                return {
                    allowed: false,
                    reason: 'INSUFFICIENT OVERRIDE PERMISSIONS',
                    code: 'ADMIN_002',
                    redirect: '/admin/dashboard'
                };
            }
        }
        
        return { allowed: true };
    }
    
    // GROUP ACCESS RULES
    async checkGroupAccess(path, userContext) {
        const { id, country } = userContext;
        
        // 1. GROUP MEMBERSHIP CHECK
        if (path.includes('/groups/') && !path.includes('/groups/create')) {
            const groupId = this.extractGroupIdFromPath(path);
            if (groupId) {
                const isMember = await this.isGroupMember(id, groupId);
                if (!isMember) {
                    return {
                        allowed: false,
                        reason: 'NOT A MEMBER OF THIS GROUP',
                        code: 'GROUP_001',
                        redirect: '/groups'
                    };
                }
            }
        }
        
        // 2. GROUP SIZE CHECK (5-1000 members)
        if (path.includes('/groups/invite')) {
            const groupId = localStorage.getItem('mpesewa_current_group');
            const groupSize = await this.getGroupSize(groupId);
            
            if (groupSize >= 1000) {
                return {
                    allowed: false,
                    reason: 'GROUP SIZE LIMIT (1000) REACHED',
                    code: 'GROUP_002',
                    redirect: `/groups/${groupId}/dashboard`
                };
            }
        }
        
        // 3. GROUP ADMIN CHECK
        if (path.includes('/groups/admin')) {
            const groupId = this.extractGroupIdFromPath(path);
            const isAdmin = await this.isGroupAdmin(id, groupId);
            
            if (!isAdmin) {
                return {
                    allowed: false,
                    reason: 'GROUP ADMIN PRIVILEGES REQUIRED',
                    code: 'GROUP_003',
                    redirect: `/groups/${groupId}/dashboard`
                };
            }
        }
        
        return { allowed: true };
    }
    
    // UTILITY METHODS
    extractCountryFromPath(path) {
        const match = path.match(/\/country\/([A-Z]{2,3})/);
        return match ? match[1] : null;
    }
    
    extractGroupIdFromPath(path) {
        const match = path.match(/\/groups\/([^\/]+)/);
        return match ? match[1] : null;
    }
    
    getLendingLimit(plan) {
        const limits = {
            'basic': { weekly: 1500, ledger: 1500 },
            'premium': { weekly: 5000, ledger: 10000 },
            'super': { weekly: 20000, ledger: 20000 },
            'lender-of-lenders': { weekly: 50000, ledger: 50000 }
        };
        return limits[plan] || limits.basic;
    }
    
    calculateTotalLent(userId) {
        const ledgers = JSON.parse(localStorage.getItem(`lender_${userId}_ledgers`) || '[]');
        const currentWeek = this.getCurrentWeek();
        
        return ledgers
            .filter(ledger => ledger.week === currentWeek && ledger.status === 'active')
            .reduce((sum, ledger) => sum + ledger.amount, 0);
    }
    
    countActiveLedgers(userId) {
        const ledgers = JSON.parse(localStorage.getItem(`lender_${userId}_ledgers`) || '[]');
        return ledgers.filter(ledger => ledger.status === 'active').length;
    }
    
    async checkBlacklistStatus(userId) {
        const blacklist = JSON.parse(localStorage.getItem('mpesewa_blacklist') || '[]');
        return blacklist.find(item => item.userId === userId);
    }
    
    async hasActiveLoanInGroup(userId, groupId) {
        const loans = JSON.parse(localStorage.getItem(`borrower_${userId}_loans`) || '[]');
        return loans.some(loan => 
            loan.groupId === groupId && 
            ['active', 'overdue'].includes(loan.status)
        );
    }
    
    async getBorrowerRating(userId) {
        const ratings = JSON.parse(localStorage.getItem(`borrower_${userId}_ratings`) || '[]');
        if (ratings.length === 0) return 5; // Default rating
        
        const sum = ratings.reduce((total, rating) => total + rating.score, 0);
        return sum / ratings.length;
    }
    
    async checkDefaults(userId) {
        const loans = JSON.parse(localStorage.getItem(`borrower_${userId}_loans`) || '[]');
        return loans.filter(loan => loan.status === 'defaulted');
    }
    
    async isGroupMember(userId, groupId) {
        const groupMembers = JSON.parse(localStorage.getItem(`group_${groupId}_members`) || '[]');
        return groupMembers.includes(userId);
    }
    
    async getGroupSize(groupId) {
        const groupMembers = JSON.parse(localStorage.getItem(`group_${groupId}_members`) || '[]');
        return groupMembers.length;
    }
    
    async isGroupAdmin(userId, groupId) {
        const group = JSON.parse(localStorage.getItem(`group_${groupId}`) || '{}');
        return group.adminId === userId;
    }
    
    async checkAdminOverridePermission(adminId) {
        const admin = JSON.parse(localStorage.getItem(`admin_${adminId}`) || '{}');
        return admin.permissions && admin.permissions.includes('override');
    }
    
    getCurrentWeek() {
        const now = new Date();
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const days = Math.floor((now - startOfYear) / (24 * 60 * 60 * 1000));
        return Math.ceil(days / 7);
    }
    
    // PUBLIC API
    static async canAccess(path, userContext) {
        const guard = new MpesewaGuard();
        return await guard.checkAccess(path, userContext);
    }
    
    static validateHierarchy(userContext) {
        const guard = new MpesewaGuard();
        return guard.validateHierarchy(window.location.pathname, userContext);
    }
}

// Export for use
window.MpesewaGuard = MpesewaGuard;
export default MpesewaGuard;