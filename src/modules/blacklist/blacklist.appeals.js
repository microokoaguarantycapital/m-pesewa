/**
 * M-PESEWA BLACKLIST APPEALS SYSTEM
 * Handles appeals from blacklisted users
 * Manages review process and reinstatement
 */

class BlacklistAppeals {
    constructor() {
        this.appeals = new Map(); // appealId -> appealData
        this.reviewQueue = [];
        this.appealCounters = {}; // countryCode -> counter
        this.initializeAppealsSystem();
    }

    /**
     * Initialize appeals system
     */
    initializeAppealsSystem() {
        console.log('⚖️ Blacklist Appeals System Initializing...');
        
        // Load existing appeals
        this.loadAppeals();
        
        // Setup review scheduler
        this.setupReviewScheduler();
        
        // Setup event listeners
        this.setupEventListeners();
        
        console.log('✅ Blacklist Appeals System Initialized');
    }

    /**
     * Load existing appeals from storage
     */
    loadAppeals() {
        try {
            const storedAppeals = localStorage.getItem('mpesewa_blacklist_appeals');
            if (storedAppeals) {
                const appealsData = JSON.parse(storedAppeals);
                appealsData.forEach(appeal => {
                    this.appeals.set(appeal.appealId, appeal);
                    
                    // Add to review queue if pending
                    if (appeal.status === 'PENDING_REVIEW') {
                        this.reviewQueue.push(appeal.appealId);
                    }
                    
                    // Update counters
                    this.updateAppealCounter(appeal.countryCode);
                });
                
                console.log(`📊 Loaded ${this.appeals.size} appeals`);
            }
        } catch (error) {
            console.error('Error loading appeals:', error);
        }
    }

    /**
     * Update appeal counter for country
     * @param {string} countryCode - Country code
     */
    updateAppealCounter(countryCode) {
        if (!countryCode) return;
        
        if (!this.appealCounters[countryCode]) {
            this.appealCounters[countryCode] = 0;
        }
        this.appealCounters[countryCode]++;
    }

    /**
     * Submit a new appeal
     * @param {string} userId - User ID
     * @param {string} countryCode - Country code
     * @param {Object} appealData - Appeal data
     * @returns {Object} - Appeal submission result
     */
    submitAppeal(userId, countryCode, appealData) {
        // Check if user can appeal
        const canAppeal = this.canUserAppeal(userId, countryCode);
        if (!canAppeal.allowed) {
            return {
                success: false,
                appealId: null,
                message: canAppeal.reason,
                nextSteps: canAppeal.nextSteps
            };
        }

        // Generate appeal ID
        const appealId = this.generateAppealId(countryCode);
        
        // Create appeal record
        const appealRecord = {
            appealId,
            userId,
            countryCode,
            submittedAt: new Date().toISOString(),
            status: 'PENDING_REVIEW',
            priority: this.calculatePriority(appealData),
            category: appealData.category || 'GENERAL',
            details: {
                reason: appealData.reason,
                explanation: appealData.explanation,
                evidence: appealData.evidence || [],
                repaymentPlan: appealData.repaymentPlan,
                hardshipCase: appealData.hardshipCase || false,
                previousAppeals: this.getUserPreviousAppeals(userId)
            },
            timeline: [
                {
                    action: 'SUBMITTED',
                    timestamp: new Date().toISOString(),
                    note: 'Appeal submitted by user'
                }
            ],
            assignedTo: null,
            reviewDeadline: this.calculateReviewDeadline(),
            outcome: null,
            notes: [],
            metadata: {
                deviceId: this.getDeviceId(),
                ipAddress: appealData.ipAddress || 'UNKNOWN',
                userAgent: navigator.userAgent
            }
        };

        // Store appeal
        this.appeals.set(appealId, appealRecord);
        this.reviewQueue.push(appealId);
        this.updateAppealCounter(countryCode);

        // Persist appeals
        this.persistAppeals();

        // Log appeal submission
        this.logAppealAction(appealId, 'SUBMITTED', userId);

        // Notify admins
        this.notifyAdminsOfNewAppeal(appealRecord);

        // Notify user
        this.notifyUserOfAppealSubmission(userId, appealId);

        console.log(`📨 Appeal submitted: ${appealId} by user ${userId}`);

        return {
            success: true,
            appealId,
            message: 'Appeal submitted successfully',
            nextSteps: 'Your appeal is under review. You will be notified of the outcome.',
            estimatedReviewTime: '3-5 business days',
            referenceNumber: appealId
        };
    }

    /**
     * Check if user can submit appeal
     * @param {string} userId - User ID
     * @param {string} countryCode - Country code
     * @returns {Object} - Can appeal result
     */
    canUserAppeal(userId, countryCode) {
        const result = {
            allowed: true,
            reason: '',
            nextSteps: ''
        };

        // Check if user is blacklisted
        const blacklistModule = window.blacklistModule;
        if (!blacklistModule || !blacklistModule.isUserBlacklisted(userId, countryCode)) {
            result.allowed = false;
            result.reason = 'You are not currently blacklisted';
            result.nextSteps = 'No appeal needed';
            return result;
        }

        // Check for recent appeal
        const recentAppeal = this.getUserRecentAppeal(userId);
        if (recentAppeal) {
            const daysSinceAppeal = this.daysSince(recentAppeal.submittedAt);
            
            if (recentAppeal.status === 'PENDING_REVIEW') {
                result.allowed = false;
                result.reason = 'You already have an appeal under review';
                result.nextSteps = `Wait for decision on appeal ${recentAppeal.appealId}`;
                return result;
            }
            
            if (recentAppeal.status === 'REJECTED' && daysSinceAppeal < 30) {
                result.allowed = false;
                result.reason = 'Your recent appeal was rejected. You must wait 30 days before submitting a new appeal';
                result.nextSteps = `You can submit a new appeal in ${30 - daysSinceAppeal} days`;
                return result;
            }
        }

        // Check appeal limit (max 3 per year)
        const yearlyAppeals = this.getUserAppealsThisYear(userId);
        if (yearlyAppeals.length >= 3) {
            result.allowed = false;
            result.reason = 'You have reached the maximum number of appeals (3 per year)';
            result.nextSteps = 'Contact support for exceptional circumstances';
            return result;
        }

        return result;
    }

    /**
     * Get user's recent appeal
     * @param {string} userId - User ID
     * @returns {Object|null} - Recent appeal
     */
    getUserRecentAppeal(userId) {
        let recentAppeal = null;
        let recentDate = 0;

        for (const appeal of this.appeals.values()) {
            if (appeal.userId === userId) {
                const appealDate = new Date(appeal.submittedAt).getTime();
                if (appealDate > recentDate) {
                    recentDate = appealDate;
                    recentAppeal = appeal;
                }
            }
        }

        return recentAppeal;
    }

    /**
     * Get user's appeals this year
     * @param {string} userId - User ID
     * @returns {Array} - Appeals this year
     */
    getUserAppealsThisYear(userId) {
        const currentYear = new Date().getFullYear();
        const appealsThisYear = [];

        for (const appeal of this.appeals.values()) {
            if (appeal.userId === userId) {
                const appealYear = new Date(appeal.submittedAt).getFullYear();
                if (appealYear === currentYear) {
                    appealsThisYear.push(appeal);
                }
            }
        }

        return appealsThisYear;
    }

    /**
     * Get user's previous appeals
     * @param {string} userId - User ID
     * @returns {Array} - Previous appeals
     */
    getUserPreviousAppeals(userId) {
        const previousAppeals = [];

        for (const appeal of this.appeals.values()) {
            if (appeal.userId === userId && appeal.status !== 'PENDING_REVIEW') {
                previousAppeals.push({
                    appealId: appeal.appealId,
                    submittedAt: appeal.submittedAt,
                    status: appeal.status,
                    outcome: appeal.outcome,
                    reason: appeal.details?.reason
                });
            }
        }

        return previousAppeals;
    }

    /**
     * Calculate days since date
     * @param {string} dateString - Date string
     * @returns {number} - Days since
     */
    daysSince(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        return Math.floor(diffTime / (1000 * 60 * 60 * 24));
    }

    /**
     * Generate appeal ID
     * @param {string} countryCode - Country code
     * @returns {string} - Appeal ID
     */
    generateAppealId(countryCode) {
        const countryPrefix = countryCode.toUpperCase();
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substr(2, 6);
        
        // Get sequence number for country
        if (!this.appealCounters[countryCode]) {
            this.appealCounters[countryCode] = 0;
        }
        this.appealCounters[countryCode]++;
        
        const sequence = this.appealCounters[countryCode].toString().padStart(6, '0');
        
        return `APL-${countryPrefix}-${timestamp}-${random}-${sequence}`;
    }

    /**
     * Calculate appeal priority
     * @param {Object} appealData - Appeal data
     * @returns {number} - Priority (1-5, 5 highest)
     */
    calculatePriority(appealData) {
        let priority = 3; // Default medium priority

        // Increase priority for hardship cases
        if (appealData.hardshipCase) {
            priority += 1;
        }

        // Increase priority if evidence provided
        if (appealData.evidence && appealData.evidence.length > 0) {
            priority += 1;
        }

        // Increase priority if repayment plan provided
        if (appealData.repaymentPlan) {
            priority += 1;
        }

        // Decrease priority for repeat offenders
        if (appealData.previousAppeals && appealData.previousAppeals.length >= 2) {
            priority -= 1;
        }

        // Clamp between 1 and 5
        return Math.max(1, Math.min(5, priority));
    }

    /**
     * Calculate review deadline
     * @returns {string} - Review deadline
     */
    calculateReviewDeadline() {
        const deadline = new Date();
        deadline.setDate(deadline.getDate() + 7); // 7 days from now
        return deadline.toISOString();
    }

    /**
     * Get device ID
     * @returns {string} - Device ID
     */
    getDeviceId() {
        let deviceId = localStorage.getItem('mpesewa_device_id');
        if (!deviceId) {
            deviceId = `dev_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            localStorage.setItem('mpesewa_device_id', deviceId);
        }
        return deviceId;
    }

    /**
     * Persist appeals to storage
     */
    persistAppeals() {
        try {
            const appealsArray = Array.from(this.appeals.values());
            localStorage.setItem('mpesewa_blacklist_appeals', JSON.stringify(appealsArray));
        } catch (error) {
            console.error('Error persisting appeals:', error);
        }
    }

    /**
     * Log appeal action
     * @param {string} appealId - Appeal ID
     * @param {string} action - Action type
     * @param {string} performedBy - Who performed the action
     * @param {Object} details - Additional details
     */
    logAppealAction(appealId, action, performedBy, details = {}) {
        const appeal = this.appeals.get(appealId);
        if (!appeal) return;

        const logEntry = {
            action,
            timestamp: new Date().toISOString(),
            performedBy,
            details
        };

        appeal.timeline.push(logEntry);
        this.appeals.set(appealId, appeal);

        // Also log to audit trail if available
        if (window.blacklistModule && window.blacklistModule.audit) {
            window.blacklistModule.audit.logAction({
                action: `APPEAL_${action}`,
                userId: appeal.userId,
                countryCode: appeal.countryCode,
                performedBy,
                details: {
                    appealId,
                    ...details
                }
            });
        }
    }

    /**
     * Notify admins of new appeal
     * @param {Object} appealRecord - Appeal record
     */
    notifyAdminsOfNewAppeal(appealRecord) {
        const event = new CustomEvent('mpesewa:new-appeal', {
            detail: {
                appealId: appealRecord.appealId,
                userId: appealRecord.userId,
                countryCode: appealRecord.countryCode,
                priority: appealRecord.priority,
                submittedAt: appealRecord.submittedAt,
                category: appealRecord.category,
                requiresAttention: true
            }
        });
        window.dispatchEvent(event);
    }

    /**
     * Notify user of appeal submission
     * @param {string} userId - User ID
     * @param {string} appealId - Appeal ID
     */
    notifyUserOfAppealSubmission(userId, appealId) {
        const event = new CustomEvent('mpesewa:appeal-submitted', {
            detail: {
                userId,
                appealId,
                message: 'Your appeal has been submitted successfully',
                nextSteps: 'You will be notified when your appeal is reviewed',
                timestamp: new Date().toISOString()
            }
        });
        window.dispatchEvent(event);
    }

    /**
     * Setup review scheduler
     */
    setupReviewScheduler() {
        // Process review queue every hour
        setInterval(() => {
            this.processReviewQueue();
        }, 60 * 60 * 1000);
        
        // Initial processing
        setTimeout(() => {
            this.processReviewQueue();
        }, 10000);
    }

    /**
     * Process review queue
     */
    processReviewQueue() {
        if (this.reviewQueue.length === 0) return;

        console.log(`📋 Processing ${this.reviewQueue.length} appeals in review queue`);

        // Sort by priority (highest first) and submission date (oldest first)
        const sortedQueue = [...this.reviewQueue]
            .map(appealId => this.appeals.get(appealId))
            .filter(appeal => appeal && appeal.status === 'PENDING_REVIEW')
            .sort((a, b) => {
                // First by priority (descending)
                if (b.priority !== a.priority) {
                    return b.priority - a.priority;
                }
                // Then by submission date (ascending)
                return new Date(a.submittedAt) - new Date(b.submittedAt);
            });

        // Process top 5 appeals
        const toProcess = sortedQueue.slice(0, 5);
        
        toProcess.forEach(appeal => {
            this.assignForReview(appeal.appealId);
        });
    }

    /**
     * Assign appeal for review
     * @param {string} appealId - Appeal ID
     * @returns {boolean} - Success status
     */
    assignForReview(appealId) {
        const appeal = this.appeals.get(appealId);
        if (!appeal || appeal.status !== 'PENDING_REVIEW') {
            return false;
        }

        // In production, this would assign to an actual admin
        // For demo, we'll auto-assign to "system"
        appeal.assignedTo = 'system_reviewer';
        appeal.status = 'UNDER_REVIEW';
        
        // Update timeline
        this.logAppealAction(appealId, 'ASSIGNED_FOR_REVIEW', 'system', {
            assignedTo: appeal.assignedTo
        });

        // Update in map
        this.appeals.set(appealId, appeal);

        // Remove from review queue
        this.reviewQueue = this.reviewQueue.filter(id => id !== appealId);

        // Persist
        this.persistAppeals();

        // Notify assignee
        this.notifyAssignee(appeal);

        console.log(`📝 Appeal ${appealId} assigned for review`);
        
        return true;
    }

    /**
     * Notify assignee
     * @param {Object} appeal - Appeal record
     */
    notifyAssignee(appeal) {
        const event = new CustomEvent('mpesewa:appeal-assigned', {
            detail: {
                appealId: appeal.appealId,
                assignedTo: appeal.assignedTo,
                userId: appeal.userId,
                countryCode: appeal.countryCode,
                priority: appeal.priority,
                reviewDeadline: appeal.reviewDeadline
            }
        });
        window.dispatchEvent(event);
    }

    /**
     * Review appeal (admin action)
     * @param {string} appealId - Appeal ID
     * @param {string} adminId - Admin ID
     * @param {Object} decision - Decision data
     * @returns {Object} - Review result
     */
    reviewAppeal(appealId, adminId, decision) {
        const appeal = this.appeals.get(appealId);
        if (!appeal) {
            return {
                success: false,
                message: 'Appeal not found'
            };
        }

        if (appeal.status !== 'UNDER_REVIEW') {
            return {
                success: false,
                message: 'Appeal is not under review'
            };
        }

        // Verify admin is assigned or has override
        if (appeal.assignedTo !== adminId && !this.isSuperAdmin(adminId)) {
            return {
                success: false,
                message: 'You are not assigned to this appeal'
            };
        }

        // Update appeal with decision
        appeal.status = decision.approved ? 'APPROVED' : 'REJECTED';
        appeal.outcome = {
            decision: decision.approved ? 'APPROVED' : 'REJECTED',
            decidedBy: adminId,
            decidedAt: new Date().toISOString(),
            reason: decision.reason,
            conditions: decision.conditions || [],
            notes: decision.notes || ''
        };

        // Update timeline
        this.logAppealAction(appealId, 'DECISION_MADE', adminId, {
            decision: appeal.outcome.decision,
            reason: decision.reason
        });

        // Update in map
        this.appeals.set(appealId, appeal);

        // Persist
        this.persistAppeals();

        // Notify user of decision
        this.notifyUserOfDecision(appeal);

        // If approved, trigger blacklist removal
        if (decision.approved && window.blacklistModule) {
            window.blacklistModule.removeFromBlacklist(
                appeal.userId,
                appeal.countryCode,
                adminId,
                `Appeal approved: ${decision.reason}`
            );
        }

        console.log(`⚖️ Appeal ${appealId} ${decision.approved ? 'approved' : 'rejected'} by ${adminId}`);

        return {
            success: true,
            message: `Appeal ${decision.approved ? 'approved' : 'rejected'}`,
            appealId,
            decision: appeal.outcome
        };
    }

    /**
     * Check if user is super admin
     * @param {string} adminId - Admin ID
     * @returns {boolean} - True if super admin
     */
    isSuperAdmin(adminId) {
        // In production, check admin database
        // For demo, check localStorage
        const adminData = localStorage.getItem(`mpesewa_admin_${adminId}`);
        if (!adminData) return false;
        
        try {
            const admin = JSON.parse(adminData);
            return admin.role === 'SUPER_ADMIN';
        } catch (error) {
            return false;
        }
    }

    /**
     * Notify user of decision
     * @param {Object} appeal - Appeal record
     */
    notifyUserOfDecision(appeal) {
        const event = new CustomEvent('mpesewa:appeal-decision', {
            detail: {
                userId: appeal.userId,
                appealId: appeal.appealId,
                decision: appeal.outcome.decision,
                reason: appeal.outcome.reason,
                conditions: appeal.outcome.conditions,
                decidedAt: appeal.outcome.decidedAt,
                nextSteps: appeal.outcome.decision === 'APPROVED' 
                    ? 'Your blacklist restrictions have been removed' 
                    : 'You can submit a new appeal in 30 days'
            }
        });
        window.dispatchEvent(event);
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Listen for appeal status checks
        window.addEventListener('mpesewa:check-appeal-status', (event) => {
            const { userId, appealId } = event.detail;
            const status = this.getAppealStatus(userId, appealId);
            
            const responseEvent = new CustomEvent('mpesewa:appeal-status-response', {
                detail: status
            });
            window.dispatchEvent(responseEvent);
        });

        // Listen for admin appeal assignments
        window.addEventListener('mpesewa:admin-get-appeals', (event) => {
            const { adminId, countryCode, status } = event.detail;
            const appeals = this.getAppealsForAdmin(adminId, countryCode, status);
            
            const responseEvent = new CustomEvent('mpesewa:admin-appeals-response', {
                detail: appeals
            });
            window.dispatchEvent(responseEvent);
        });
    }

    /**
     * Get appeal status
     * @param {string} userId - User ID
     * @param {string} appealId - Appeal ID
     * @returns {Object} - Appeal status
     */
    getAppealStatus(userId, appealId) {
        const appeal = this.appeals.get(appealId);
        
        if (!appeal) {
            return {
                found: false,
                message: 'Appeal not found'
            };
        }

        if (appeal.userId !== userId) {
            return {
                found: true,
                authorized: false,
                message: 'You are not authorized to view this appeal'
            };
        }

        return {
            found: true,
            authorized: true,
            appealId,
            status: appeal.status,
            submittedAt: appeal.submittedAt,
            priority: appeal.priority,
            assignedTo: appeal.assignedTo,
            reviewDeadline: appeal.reviewDeadline,
            timeline: appeal.timeline,
            outcome: appeal.outcome,
            details: {
                reason: appeal.details.reason,
                category: appeal.category
            }
        };
    }

    /**
     * Get appeals for admin
     * @param {string} adminId - Admin ID
     * @param {string} countryCode - Country code (optional)
     * @param {string} status - Status filter (optional)
     * @returns {Object} - Appeals list
     */
    getAppealsForAdmin(adminId, countryCode = null, status = null) {
        let appeals = Array.from(this.appeals.values());
        
        // Filter by country if specified
        if (countryCode) {
            appeals = appeals.filter(appeal => appeal.countryCode === countryCode);
        }
        
        // Filter by status if specified
        if (status) {
            appeals = appeals.filter(appeal => appeal.status === status);
        }
        
        // Sort by priority and submission date
        appeals.sort((a, b) => {
            if (b.priority !== a.priority) {
                return b.priority - a.priority;
            }
            return new Date(a.submittedAt) - new Date(b.submittedAt);
        });
        
        return {
            adminId,
            total: appeals.length,
            appeals,
            generatedAt: new Date().toISOString()
        };
    }

    /**
     * Get appeals statistics
     * @returns {Object} - Statistics
     */
    getStatistics() {
        const stats = {
            total: this.appeals.size,
            byStatus: {},
            byCountry: {},
            byPriority: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
            pendingReview: 0,
            underReview: 0,
            resolved: 0,
            approvalRate: 0
        };

        let approvedCount = 0;
        let resolvedCount = 0;

        for (const appeal of this.appeals.values()) {
            // Count by status
            stats.byStatus[appeal.status] = (stats.byStatus[appeal.status] || 0) + 1;
            
            // Count by country
            stats.byCountry[appeal.countryCode] = (stats.byCountry[appeal.countryCode] || 0) + 1;
            
            // Count by priority
            stats.byPriority[appeal.priority] = (stats.byPriority[appeal.priority] || 0) + 1;
            
            // Special counts
            if (appeal.status === 'PENDING_REVIEW') stats.pendingReview++;
            if (appeal.status === 'UNDER_REVIEW') stats.underReview++;
            if (appeal.status === 'APPROVED' || appeal.status === 'REJECTED') {
                resolvedCount++;
                if (appeal.status === 'APPROVED') approvedCount++;
            }
        }

        stats.resolved = resolvedCount;
        if (resolvedCount > 0) {
            stats.approvalRate = Math.round((approvedCount / resolvedCount) * 100);
        }

        stats.reviewQueue = this.reviewQueue.length;
        stats.generatedAt = new Date().toISOString();

        return stats;
    }

    /**
     * Export appeals data
     * @param {Object} options - Export options
     * @returns {Object} - Export data
     */
    exportAppeals(options = {}) {
        const {
            format = 'json',
            includeSensitive = false,
            filterStatus = null,
            filterCountry = null
        } = options;

        let exportData = Array.from(this.appeals.values());

        // Apply filters
        if (filterStatus) {
            exportData = exportData.filter(appeal => appeal.status === filterStatus);
        }

        if (filterCountry) {
            exportData = exportData.filter(appeal => appeal.countryCode === filterCountry);
        }

        // Remove sensitive data if requested
        if (!includeSensitive) {
            exportData = exportData.map(appeal => {
                const { metadata, assignedTo, ...safeAppeal } = appeal;
                return {
                    ...safeAppeal,
                    metadata: {
                        ...metadata,
                        ipAddress: 'REDACTED',
                        deviceId: 'REDACTED'
                    },
                    assignedTo: 'REDACTED'
                };
            });
        }

        // Add export metadata
        const exportMetadata = {
            exportDate: new Date().toISOString(),
            totalAppeals: exportData.length,
            format,
            includeSensitive,
            filters: {
                status: filterStatus,
                country: filterCountry
            }
        };

        let result;

        switch (format) {
            case 'json':
                result = {
                    metadata: exportMetadata,
                    data: exportData
                };
                break;

            case 'csv':
                if (exportData.length === 0) {
                    result = '';
                } else {
                    const headers = Object.keys(exportData[0]);
                    const csvRows = [
                        headers.join(','),
                        ...exportData.map(row =>
                            headers.map(header =>
                                JSON.stringify(row[header] || '')
                            ).join(',')
                        )
                    ];
                    result = csvRows.join('\n');
                }
                break;

            default:
                throw new Error(`Unsupported export format: ${format}`);
        }

        return result;
    }

    /**
     * Withdraw appeal (user action)
     * @param {string} appealId - Appeal ID
     * @param {string} userId - User ID
     * @param {string} reason - Withdrawal reason
     * @returns {boolean} - Success status
     */
    withdrawAppeal(appealId, userId, reason) {
        const appeal = this.appeals.get(appealId);
        if (!appeal) {
            return false;
        }

        if (appeal.userId !== userId) {
            console.error(`User ${userId} is not authorized to withdraw appeal ${appealId}`);
            return false;
        }

        if (appeal.status !== 'PENDING_REVIEW' && appeal.status !== 'UNDER_REVIEW') {
            console.error(`Appeal ${appealId} cannot be withdrawn in status: ${appeal.status}`);
            return false;
        }

        // Update appeal
        appeal.status = 'WITHDRAWN';
        appeal.outcome = {
            decision: 'WITHDRAWN',
            reason: reason || 'Withdrawn by user',
            withdrawnAt: new Date().toISOString()
        };

        // Update timeline
        this.logAppealAction(appealId, 'WITHDRAWN', userId, { reason });

        // Update in map
        this.appeals.set(appealId, appeal);

        // Remove from review queue if present
        this.reviewQueue = this.reviewQueue.filter(id => id !== appealId);

        // Persist
        this.persistAppeals();

        // Notify admins
        this.notifyAdminsOfWithdrawal(appeal);

        console.log(`↩️ Appeal ${appealId} withdrawn by user ${userId}`);

        return true;
    }

    /**
     * Notify admins of withdrawal
     * @param {Object} appeal - Appeal record
     */
    notifyAdminsOfWithdrawal(appeal) {
        const event = new CustomEvent('mpesewa:appeal-withdrawn', {
            detail: {
                appealId: appeal.appealId,
                userId: appeal.userId,
                countryCode: appeal.countryCode,
                withdrawnAt: appeal.outcome.withdrawnAt,
                reason: appeal.outcome.reason
            }
        });
        window.dispatchEvent(event);
    }
}

// Export appeals system
export default BlacklistAppeals;