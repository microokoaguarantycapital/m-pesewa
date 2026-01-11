'use strict';

class GroupManager {
    constructor() {
        this.countries = [];
        this.groups = [];
        this.loadData();
    }

    async loadData() {
        try {
            const countriesResponse = await fetch('../data/countries.json');
            this.countries = await countriesResponse.json();
            
            const groupsResponse = await fetch('../data/demo-groups.json');
            this.groups = await groupsResponse.json();
            
            const usersResponse = await fetch('../data/demo-users.json');
            this.users = await usersResponse.json();
        } catch (error) {
            console.error('Error loading group data:', error);
            this.countries = [];
            this.groups = [];
            this.users = [];
        }
    }

    getCountries() {
        return this.countries;
    }

    getCountryByCode(code) {
        return this.countries.find(c => c.code === code);
    }

    getGroupsByCountry(countryCode) {
        return this.groups.filter(group => group.country === countryCode);
    }

    getGroupById(groupId) {
        return this.groups.find(group => group.id === groupId);
    }

    getGroupMembers(groupId) {
        const group = this.getGroupById(groupId);
        if (!group) return [];
        
        return this.users.filter(user => 
            user.groups && user.groups.includes(groupId)
        );
    }

    getGroupLenders(groupId) {
        const members = this.getGroupMembers(groupId);
        return members.filter(member => member.role === 'lender' && member.subscription_active);
    }

    getGroupBorrowers(groupId) {
        const members = this.getGroupMembers(groupId);
        return members.filter(member => member.role === 'borrower' && !member.blacklisted);
    }

    getGroupStatistics(groupId) {
        const lenders = this.getGroupLenders(groupId);
        const borrowers = this.getGroupBorrowers(groupId);
        
        const totalLoans = this.calculateGroupLoans(groupId);
        const totalAmount = this.calculateGroupTotalAmount(groupId);
        const repaymentRate = this.calculateGroupRepaymentRate(groupId);
        
        return {
            total_members: lenders.length + borrowers.length,
            lenders_count: lenders.length,
            borrowers_count: borrowers.length,
            total_loans: totalLoans,
            total_amount: totalAmount,
            repayment_rate: repaymentRate,
            is_full: (lenders.length + borrowers.length) >= 1000,
            can_join: (lenders.length + borrowers.length) < 1000
        };
    }

    calculateGroupLoans(groupId) {
        return this.groups.reduce((total, group) => {
            if (group.id === groupId && group.loans) {
                return total + group.loans.length;
            }
            return total;
        }, 0);
    }

    calculateGroupTotalAmount(groupId) {
        const group = this.getGroupById(groupId);
        if (!group || !group.loans) return 0;
        
        return group.loans.reduce((total, loan) => total + loan.amount, 0);
    }

    calculateGroupRepaymentRate(groupId) {
        const group = this.getGroupById(groupId);
        if (!group || !group.loans || group.loans.length === 0) return 100;
        
        const repaidLoans = group.loans.filter(loan => loan.status === 'repaid').length;
        return Math.round((repaidLoans / group.loans.length) * 100);
    }

    canJoinGroup(groupId, userId) {
        const user = this.users.find(u => u.id === userId);
        if (!user) return false;
        
        if (user.blacklisted) {
            return { can_join: false, reason: 'User is blacklisted' };
        }
        
        const group = this.getGroupById(groupId);
        if (!group) {
            return { can_join: false, reason: 'Group not found' };
        }
        
        if (group.members.length >= 1000) {
            return { can_join: false, reason: 'Group is full (max 1000 members)' };
        }
        
        if (group.members.length < 5 && user.role !== 'group_admin') {
            return { can_join: false, reason: 'Group needs at least 5 members' };
        }
        
        if (user.role === 'borrower') {
            const userGroups = user.groups || [];
            if (userGroups.length >= 4) {
                return { can_join: false, reason: 'Borrower can only join 4 groups maximum' };
            }
        }
        
        if (group.country !== user.country) {
            return { can_join: false, reason: 'User country does not match group country' };
        }
        
        return { can_join: true, reason: '' };
    }

    joinGroup(groupId, userId, inviteCode = null) {
        const canJoin = this.canJoinGroup(groupId, userId);
        if (!canJoin.can_join) {
            return { success: false, message: canJoin.reason };
        }
        
        const group = this.getGroupById(groupId);
        const user = this.users.find(u => u.id === userId);
        
        if (!group || !user) {
            return { success: false, message: 'Group or user not found' };
        }
        
        if (group.members.includes(userId)) {
            return { success: false, message: 'User already in group' };
        }
        
        if (group.invite_only && !inviteCode) {
            return { success: false, message: 'Group requires invitation' };
        }
        
        if (group.invite_only && inviteCode !== group.invite_code) {
            return { success: false, message: 'Invalid invitation code' };
        }
        
        group.members.push(userId);
        user.groups = user.groups || [];
        user.groups.push(groupId);
        
        this.saveGroupChanges();
        
        return { 
            success: true, 
            message: 'Successfully joined group',
            group: group
        };
    }

    leaveGroup(groupId, userId) {
        const group = this.getGroupById(groupId);
        const user = this.users.find(u => u.id === userId);
        
        if (!group || !user) {
            return { success: false, message: 'Group or user not found' };
        }
        
        if (!group.members.includes(userId)) {
            return { success: false, message: 'User not in group' };
        }
        
        if (group.admin === userId && group.members.length > 1) {
            return { 
                success: false, 
                message: 'Group admin cannot leave without transferring admin rights' 
            };
        }
        
        const memberIndex = group.members.indexOf(userId);
        group.members.splice(memberIndex, 1);
        
        const groupIndex = user.groups.indexOf(groupId);
        if (groupIndex > -1) {
            user.groups.splice(groupIndex, 1);
        }
        
        if (group.admin === userId && group.members.length > 0) {
            group.admin = group.members[0];
        }
        
        this.saveGroupChanges();
        
        return { 
            success: true, 
            message: 'Successfully left group',
            group: group
        };
    }

    createGroup(groupData, creatorId) {
        const creator = this.users.find(u => u.id === creatorId);
        if (!creator) {
            return { success: false, message: 'Creator not found' };
        }
        
        if (creator.blacklisted) {
            return { success: false, message: 'Blacklisted users cannot create groups' };
        }
        
        if (groupData.members && groupData.members.length < 5) {
            return { success: false, message: 'Group must have at least 5 members' };
        }
        
        if (groupData.members && groupData.members.length > 1000) {
            return { success: false, message: 'Group cannot have more than 1000 members' };
        }
        
        const newGroup = {
            id: 'group_' + Date.now(),
            name: groupData.name,
            description: groupData.description || '',
            country: groupData.country || creator.country,
            type: groupData.type || 'community',
            admin: creatorId,
            members: [creatorId],
            lenders: [],
            borrowers: [creatorId],
            invite_only: groupData.invite_only || true,
            invite_code: groupData.invite_code || this.generateInviteCode(),
            created_at: new Date().toISOString(),
            rules: groupData.rules || [],
            loans: [],
            statistics: {
                total_members: 1,
                lenders_count: 0,
                borrowers_count: 1,
                total_loans: 0,
                total_amount: 0,
                repayment_rate: 100
            }
        };
        
        this.groups.push(newGroup);
        
        creator.groups = creator.groups || [];
        creator.groups.push(newGroup.id);
        
        if (groupData.members && groupData.members.length > 1) {
            groupData.members.slice(1).forEach(memberId => {
                const member = this.users.find(u => u.id === memberId);
                if (member && member.country === newGroup.country && !member.blacklisted) {
                    if (member.role === 'lender') {
                        newGroup.lenders.push(memberId);
                    } else if (member.role === 'borrower') {
                        newGroup.borrowers.push(memberId);
                    }
                    newGroup.members.push(memberId);
                    
                    member.groups = member.groups || [];
                    member.groups.push(newGroup.id);
                }
            });
        }
        
        newGroup.statistics.total_members = newGroup.members.length;
        newGroup.statistics.lenders_count = newGroup.lenders.length;
        newGroup.statistics.borrowers_count = newGroup.borrowers.length;
        
        this.saveGroupChanges();
        
        return { 
            success: true, 
            message: 'Group created successfully',
            group: newGroup
        };
    }

    generateInviteCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 8; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    }

    saveGroupChanges() {
        try {
            localStorage.setItem('mpesewa_groups', JSON.stringify(this.groups));
            localStorage.setItem('mpesewa_users', JSON.stringify(this.users));
        } catch (error) {
            console.error('Error saving group changes:', error);
        }
    }

    getGroupLoans(groupId) {
        const group = this.getGroupById(groupId);
        if (!group || !group.loans) return [];
        
        return group.loans.map(loanId => {
            const loan = this.getLoanById(loanId);
            return {
                ...loan,
                lender_name: this.getUserName(loan.lender_id),
                borrower_name: this.getUserName(loan.borrower_id)
            };
        });
    }

    getLoanById(loanId) {
        const allLoans = this.groups.flatMap(group => group.loans || []);
        return allLoans.find(loan => loan.id === loanId);
    }

    getUserName(userId) {
        const user = this.users.find(u => u.id === userId);
        return user ? user.name : 'Unknown User';
    }

    isGroupFull(groupId) {
        const group = this.getGroupById(groupId);
        return group && group.members.length >= 1000;
    }

    getGroupAdmin(groupId) {
        const group = this.getGroupById(groupId);
        if (!group) return null;
        
        return this.users.find(u => u.id === group.admin);
    }

    updateGroupStatistics(groupId) {
        const group = this.getGroupById(groupId);
        if (!group) return;
        
        const stats = this.getGroupStatistics(groupId);
        group.statistics = stats;
        
        this.saveGroupChanges();
    }

    enforceGroupRules(groupId) {
        const group = this.getGroupById(groupId);
        if (!group || !group.rules || group.rules.length === 0) return;
        
        const violations = [];
        
        group.members.forEach(memberId => {
            const member = this.users.find(u => u.id === memberId);
            if (!member) return;
            
            group.rules.forEach(rule => {
                if (rule.type === 'max_loans' && member.role === 'borrower') {
                    const memberLoans = this.getMemberLoansInGroup(memberId, groupId);
                    if (memberLoans.length > rule.value) {
                        violations.push({
                            member_id: memberId,
                            rule: rule,
                            actual: memberLoans.length,
                            allowed: rule.value
                        });
                    }
                }
                
                if (rule.type === 'min_rating' && member.rating < rule.value) {
                    violations.push({
                        member_id: memberId,
                        rule: rule,
                        actual: member.rating,
                        required: rule.value
                    });
                }
            });
        });
        
        return violations;
    }

    getMemberLoansInGroup(memberId, groupId) {
        const group = this.getGroupById(groupId);
        if (!group || !group.loans) return [];
        
        return group.loans.filter(loan => 
            loan.borrower_id === memberId || loan.lender_id === memberId
        );
    }

    renderGroupCard(group, container) {
        const stats = this.getGroupStatistics(group.id);
        const country = this.getCountryByCode(group.country);
        
        const card = document.createElement('div');
        card.className = 'group-card card';
        card.innerHTML = `
            <div class="group-header">
                <div class="group-flag">
                    <span class="flag-icon">${country?.flag || '🏳️'}</span>
                    <span class="country-code">${group.country}</span>
                </div>
                <div class="group-type-badge">${group.type}</div>
            </div>
            
            <div class="group-body">
                <h3 class="group-name">${group.name}</h3>
                <p class="group-description">${group.description}</p>
                
                <div class="group-stats">
                    <div class="stat">
                        <span class="stat-label">Members</span>
                        <span class="stat-value">${stats.total_members}/1000</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Lenders</span>
                        <span class="stat-value">${stats.lenders_count}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Borrowers</span>
                        <span class="stat-value">${stats.borrowers_count}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Repayment Rate</span>
                        <span class="stat-value">${stats.repayment_rate}%</span>
                    </div>
                </div>
                
                <div class="group-rules">
                    <strong>Rules:</strong>
                    <ul>
                        ${group.rules && group.rules.length > 0 
                            ? group.rules.map(rule => `<li>${rule.description}</li>`).join('')
                            : '<li>No special rules</li>'}
                    </ul>
                </div>
            </div>
            
            <div class="group-footer">
                <div class="group-admin">
                    <small>Admin: ${this.getUserName(group.admin)}</small>
                </div>
                <div class="group-actions">
                    <button class="btn btn-outline" data-action="view" data-group-id="${group.id}">
                        View Details
                    </button>
                    ${stats.can_join 
                        ? `<button class="btn btn-primary" data-action="join" data-group-id="${group.id}">
                            Join Group
                           </button>`
                        : `<button class="btn btn-disabled" disabled>
                            Group Full
                           </button>`}
                </div>
            </div>
        `;
        
        container.appendChild(card);
        
        card.querySelectorAll('[data-action]').forEach(button => {
            button.addEventListener('click', (e) => {
                const action = e.target.getAttribute('data-action');
                const groupId = e.target.getAttribute('data-group-id');
                
                if (action === 'view') {
                    this.viewGroupDetails(groupId);
                } else if (action === 'join') {
                    this.handleJoinGroup(groupId);
                }
            });
        });
    }

    viewGroupDetails(groupId) {
        window.location.href = `group-details.html?id=${groupId}`;
    }

    handleJoinGroup(groupId) {
        const userData = JSON.parse(localStorage.getItem('mpesewa_user') || '{}');
        const userId = userData.id;
        
        if (!userId) {
            window.location.href = 'auth.html?action=login&redirect=groups';
            return;
        }
        
        const result = this.joinGroup(groupId, userId);
        
        if (result.success) {
            alert('Successfully joined group!');
            window.location.reload();
        } else {
            alert(`Cannot join group: ${result.message}`);
        }
    }

    renderGroupsByCountry(countryCode, container) {
        const groups = this.getGroupsByCountry(countryCode);
        container.innerHTML = '';
        
        if (groups.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">🏢</div>
                    <h3>No Groups Yet</h3>
                    <p>Be the first to create a group in this country!</p>
                    <button class="btn btn-primary" id="create-first-group">
                        Create First Group
                    </button>
                </div>
            `;
            
            container.querySelector('#create-first-group')?.addEventListener('click', () => {
                window.location.href = 'create-group.html?country=' + countryCode;
            });
            
            return;
        }
        
        groups.forEach(group => {
            this.renderGroupCard(group, container);
        });
    }
}

const groupManager = new GroupManager();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { groupManager };
}