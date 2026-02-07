/**
 * M-PESEWA DEPENDENCY INJECTION CONTAINER
 * Manages dependencies with strict hierarchy enforcement
 * Ensures proper service instantiation and lifecycle management
 */

class MpesewaDIContainer {
    constructor() {
        this.services = new Map();
        this.instances = new Map();
        this.factories = new Map();
        this.dependencies = new Map();
        this.hierarchyScopes = new Map();
        this.countryScopes = new Map();
        this.groupScopes = new Map();
        this.roleScopes = new Map();
        this.initializeCoreServices();
    }

    // Initialize core M-Pesewa services with strict hierarchy
    initializeCoreServices() {
        // Event Bus - Global scope
        this.register('EventBus', () => {
            const { EventBus } = require('./event-bus.js');
            return EventBus;
        }, { scope: 'singleton', hierarchy: 'global' });

        // Registry - Global scope
        this.register('Registry', () => {
            const { Registry } = require('./registry.js');
            return Registry;
        }, { scope: 'singleton', hierarchy: 'global' });

        // Country Services - Country scope
        this.register('CountryService', (container) => {
            const CountryService = require('./services/country-service.js');
            return new CountryService(
                container.get('EventBus'),
                container.get('Registry')
            );
        }, { scope: 'country', dependencies: ['EventBus', 'Registry'] });

        // Group Services - Group scope
        this.register('GroupService', (container) => {
            const GroupService = require('./services/group-service.js');
            return new GroupService(
                container.get('EventBus'),
                container.get('Registry'),
                container.get('CountryService')
            );
        }, { scope: 'group', dependencies: ['EventBus', 'Registry', 'CountryService'] });

        // Lender Services - Lender scope
        this.register('LenderService', (container) => {
            const LenderService = require('./services/lender-service.js');
            return new LenderService(
                container.get('EventBus'),
                container.get('Registry'),
                container.get('GroupService'),
                container.get('SubscriptionService')
            );
        }, { scope: 'lender', dependencies: ['EventBus', 'Registry', 'GroupService', 'SubscriptionService'] });

        // Borrower Services - Borrower scope
        this.register('BorrowerService', (container) => {
            const BorrowerService = require('./services/borrower-service.js');
            return new BorrowerService(
                container.get('EventBus'),
                container.get('Registry'),
                container.get('GroupService'),
                container.get('RatingService')
            );
        }, { scope: 'borrower', dependencies: ['EventBus', 'Registry', 'GroupService', 'RatingService'] });

        // Ledger Services - Ledger scope
        this.register('LedgerService', (container) => {
            const LedgerService = require('./services/ledger-service.js');
            return new LedgerService(
                container.get('EventBus'),
                container.get('Registry'),
                container.get('LenderService'),
                container.get('BorrowerService'),
                container.get('RepaymentService')
            );
        }, { scope: 'ledger', dependencies: ['EventBus', 'Registry', 'LenderService', 'BorrowerService', 'RepaymentService'] });

        // Subscription Services - Subscription scope
        this.register('SubscriptionService', (container) => {
            const SubscriptionService = require('./services/subscription-service.js');
            return new SubscriptionService(
                container.get('EventBus'),
                container.get('Registry'),
                container.get('PaymentService')
            );
        }, { scope: 'subscription', dependencies: ['EventBus', 'Registry', 'PaymentService'] });

        // Rating Services - Rating scope
        this.register('RatingService', (container) => {
            const RatingService = require('./services/rating-service.js');
            return new RatingService(
                container.get('EventBus'),
                container.get('Registry'),
                container.get('LedgerService')
            );
        }, { scope: 'rating', dependencies: ['EventBus', 'Registry', 'LedgerService'] });

        // Repayment Services - Repayment scope
        this.register('RepaymentService', (container) => {
            const RepaymentService = require('./services/repayment-service.js');
            return new RepaymentService(
                container.get('EventBus'),
                container.get('Registry'),
                container.get('LedgerService'),
                container.get('PenaltyService')
            );
        }, { scope: 'repayment', dependencies: ['EventBus', 'Registry', 'LedgerService', 'PenaltyService'] });

        // Penalty Services - Penalty scope
        this.register('PenaltyService', (container) => {
            const PenaltyService = require('./services/penalty-service.js');
            return new PenaltyService(
                container.get('EventBus'),
                container.get('Registry')
            );
        }, { scope: 'penalty', dependencies: ['EventBus', 'Registry'] });

        // Payment Services - Payment scope
        this.register('PaymentService', (container) => {
            const PaymentService = require('./services/payment-service.js');
            return new PaymentService(
                container.get('EventBus'),
                container.get('Registry')
            );
        }, { scope: 'payment', dependencies: ['EventBus', 'Registry'] });

        // Blacklist Services - Blacklist scope
        this.register('BlacklistService', (container) => {
            const BlacklistService = require('./services/blacklist-service.js');
            return new BlacklistService(
                container.get('EventBus'),
                container.get('Registry'),
                container.get('AdminService')
            );
        }, { scope: 'blacklist', dependencies: ['EventBus', 'Registry', 'AdminService'] });

        // Admin Services - Admin scope
        this.register('AdminService', (container) => {
            const AdminService = require('./services/admin-service.js');
            return new AdminService(
                container.get('EventBus'),
                container.get('Registry'),
                container.get('AuditService')
            );
        }, { scope: 'admin', dependencies: ['EventBus', 'Registry', 'AuditService'] });

        // Audit Services - Audit scope
        this.register('AuditService', (container) => {
            const AuditService = require('./services/audit-service.js');
            return new AuditService(
                container.get('EventBus'),
                container.get('Registry')
            );
        }, { scope: 'audit', dependencies: ['EventBus', 'Registry'] });

        // Debt Collector Services - Collector scope
        this.register('DebtCollectorService', (container) => {
            const DebtCollectorService = require('./services/debt-collector-service.js');
            return new DebtCollectorService(
                container.get('EventBus'),
                container.get('Registry')
            );
        }, { scope: 'collector', dependencies: ['EventBus', 'Registry'] });

        // Notification Services - Notification scope
        this.register('NotificationService', (container) => {
            const NotificationService = require('./services/notification-service.js');
            return new NotificationService(
                container.get('EventBus'),
                container.get('Registry')
            );
        }, { scope: 'notification', dependencies: ['EventBus', 'Registry'] });

        // Auth Services - Auth scope
        this.register('AuthService', (container) => {
            const AuthService = require('./services/auth-service.js');
            return new AuthService(
                container.get('EventBus'),
                container.get('Registry'),
                container.get('CountryService')
            );
        }, { scope: 'auth', dependencies: ['EventBus', 'Registry', 'CountryService'] });

        // UI Services - UI scope
        this.register('UIService', (container) => {
            const UIService = require('./services/ui-service.js');
            return new UIService(
                container.get('EventBus'),
                container.get('Registry'),
                container.get('NotificationService')
            );
        }, { scope: 'ui', dependencies: ['EventBus', 'Registry', 'NotificationService'] });

        // Analytics Services - Analytics scope
        this.register('AnalyticsService', (container) => {
            const AnalyticsService = require('./services/analytics-service.js');
            return new AnalyticsService(
                container.get('EventBus'),
                container.get('Registry'),
                container.get('AuditService')
            );
        }, { scope: 'analytics', dependencies: ['EventBus', 'Registry', 'AuditService'] });

        // Sync Services - Sync scope
        this.register('SyncService', (container) => {
            const SyncService = require('./services/sync-service.js');
            return new SyncService(
                container.get('EventBus'),
                container.get('Registry'),
                container.get('AuditService')
            );
        }, { scope: 'sync', dependencies: ['EventBus', 'Registry', 'AuditService'] });

        // PWA Services - PWA scope
        this.register('PWAService', (container) => {
            const PWAService = require('./services/pwa-service.js');
            return new PWAService(
                container.get('EventBus'),
                container.get('Registry')
            );
        }, { scope: 'pwa', dependencies: ['EventBus', 'Registry'] });
    }

    // Register a service with strict hierarchy enforcement
    register(name, factory, options = {}) {
        if (this.services.has(name)) {
            throw new Error(`Service ${name} already registered`);
        }

        const config = {
            scope: options.scope || 'singleton',
            dependencies: options.dependencies || [],
            hierarchy: options.hierarchy || 'global',
            countryLocked: options.countryLocked || false,
            groupLocked: options.groupLocked || false,
            roleLocked: options.roleLocked || false
        };

        // Validate hierarchy
        this.validateHierarchy(name, config.hierarchy);

        this.services.set(name, config);
        this.factories.set(name, factory);
        this.dependencies.set(name, config.dependencies);

        // Initialize scopes
        this.initializeScope(name, config);
    }

    // Validate service hierarchy
    validateHierarchy(name, hierarchy) {
        const validHierarchies = [
            'global',
            'country',
            'group',
            'lender',
            'borrower',
            'ledger',
            'subscription',
            'rating',
            'repayment',
            'penalty',
            'payment',
            'blacklist',
            'admin',
            'audit',
            'collector',
            'notification',
            'auth',
            'ui',
            'analytics',
            'sync',
            'pwa'
        ];

        if (!validHierarchies.includes(hierarchy)) {
            throw new Error(`Invalid hierarchy ${hierarchy} for service ${name}`);
        }

        // Enforce hierarchy chain: Global → Country → Group → Lender/Borrower → Ledger
        const hierarchyChain = {
            'global': [],
            'country': ['global'],
            'group': ['global', 'country'],
            'lender': ['global', 'country', 'group'],
            'borrower': ['global', 'country', 'group'],
            'ledger': ['global', 'country', 'group', 'lender', 'borrower'],
            'subscription': ['global', 'country', 'group', 'lender'],
            'rating': ['global', 'country', 'group', 'lender', 'borrower'],
            'repayment': ['global', 'country', 'group', 'lender', 'borrower', 'ledger'],
            'penalty': ['global', 'country', 'group', 'lender', 'borrower', 'ledger', 'repayment'],
            'payment': ['global', 'country'],
            'blacklist': ['global', 'country', 'group', 'lender', 'borrower', 'admin'],
            'admin': ['global'],
            'audit': ['global'],
            'collector': ['global', 'country'],
            'notification': ['global', 'country', 'group'],
            'auth': ['global', 'country'],
            'ui': ['global', 'country', 'group'],
            'analytics': ['global', 'country', 'group'],
            'sync': ['global', 'country', 'group'],
            'pwa': ['global']
        };

        if (!hierarchyChain[hierarchy]) {
            throw new Error(`No hierarchy chain defined for ${hierarchy}`);
        }
    }

    // Initialize scope for service
    initializeScope(name, config) {
        switch(config.scope) {
            case 'singleton':
                // Singleton - one instance globally
                break;
            case 'country':
                // One instance per country
                this.countryScopes.set(name, new Map());
                break;
            case 'group':
                // One instance per group
                this.groupScopes.set(name, new Map());
                break;
            case 'lender':
            case 'borrower':
            case 'ledger':
            case 'subscription':
            case 'rating':
            case 'repayment':
            case 'penalty':
            case 'payment':
            case 'blacklist':
            case 'admin':
            case 'audit':
            case 'collector':
            case 'notification':
            case 'auth':
            case 'ui':
            case 'analytics':
            case 'sync':
            case 'pwa':
                // One instance per context
                this.roleScopes.set(name, new Map());
                break;
            default:
                throw new Error(`Unknown scope: ${config.scope}`);
        }
    }

    // Get a service instance with hierarchy context
    get(name, context = {}) {
        if (!this.services.has(name)) {
            throw new Error(`Service ${name} not registered`);
        }

        const config = this.services.get(name);
        const scopeKey = this.getScopeKey(name, config.scope, context);

        // Check if instance exists
        if (this.instances.has(scopeKey)) {
            return this.instances.get(scopeKey);
        }

        // Validate context based on hierarchy
        this.validateContext(name, config, context);

        // Create instance
        const instance = this.createInstance(name, config, context);

        // Store instance
        this.instances.set(scopeKey, instance);

        // Initialize if needed
        if (instance.init && typeof instance.init === 'function') {
            instance.init(context);
        }

        return instance;
    }

    // Create service instance with dependency injection
    createInstance(name, config, context) {
        const factory = this.factories.get(name);
        const dependencies = this.dependencies.get(name);

        // Resolve dependencies
        const resolvedDependencies = dependencies.map(dep => {
            // Pass context down the hierarchy chain
            const depConfig = this.services.get(dep);
            const depContext = this.getChildContext(name, config, dep, depConfig, context);
            return this.get(dep, depContext);
        });

        // Create instance
        const instance = factory(this, ...resolvedDependencies);

        // Set context
        instance._context = context;
        instance._name = name;
        instance._hierarchy = config.hierarchy;

        // Add hierarchy validation methods
        instance.validateHierarchy = (action, data) => {
            return this.validateHierarchyAction(name, config.hierarchy, action, data, context);
        };

        instance.enforceCountryIsolation = (targetCountry) => {
            return this.enforceCountryIsolation(context.country, targetCountry);
        };

        instance.enforceGroupIsolation = (targetGroup) => {
            return this.enforceGroupIsolation(context.groups, targetGroup);
        };

        instance.enforceSubscription = () => {
            return this.enforceSubscription(context.userId);
        };

        return instance;
    }

    // Get scope key for instance caching
    getScopeKey(name, scope, context) {
        switch(scope) {
            case 'singleton':
                return `singleton:${name}`;
            case 'country':
                if (!context.country) {
                    throw new Error(`Country scope requires country context for service ${name}`);
                }
                return `country:${context.country}:${name}`;
            case 'group':
                if (!context.groupId) {
                    throw new Error(`Group scope requires groupId context for service ${name}`);
                }
                return `group:${context.groupId}:${name}`;
            case 'lender':
            case 'borrower':
            case 'ledger':
            case 'subscription':
            case 'rating':
            case 'repayment':
            case 'penalty':
            case 'payment':
            case 'blacklist':
            case 'admin':
            case 'audit':
            case 'collector':
            case 'notification':
            case 'auth':
            case 'ui':
            case 'analytics':
            case 'sync':
            case 'pwa':
                if (!context.userId) {
                    throw new Error(`${scope} scope requires userId context for service ${name}`);
                }
                return `${scope}:${context.userId}:${name}`;
            default:
                return name;
        }
    }

    // Validate context based on service hierarchy
    validateContext(name, config, context) {
        const { hierarchy, countryLocked, groupLocked, roleLocked } = config;

        // Check required context based on hierarchy
        const requiredContext = {
            'global': [],
            'country': ['country'],
            'group': ['country', 'groupId'],
            'lender': ['country', 'groupId', 'userId', 'role'],
            'borrower': ['country', 'groupId', 'userId', 'role'],
            'ledger': ['country', 'groupId', 'userId', 'role', 'loanId'],
            'subscription': ['country', 'groupId', 'userId', 'role'],
            'rating': ['country', 'groupId', 'userId', 'role'],
            'repayment': ['country', 'groupId', 'userId', 'role', 'loanId'],
            'penalty': ['country', 'groupId', 'userId', 'role', 'loanId'],
            'payment': ['country', 'userId'],
            'blacklist': ['country', 'groupId', 'userId', 'role'],
            'admin': ['userId', 'adminRole'],
            'audit': ['userId'],
            'collector': ['country'],
            'notification': ['country', 'groupId', 'userId'],
            'auth': ['country', 'userId'],
            'ui': ['country', 'groupId', 'userId', 'role'],
            'analytics': ['country', 'groupId', 'userId'],
            'sync': ['country', 'groupId', 'userId'],
            'pwa': ['userId']
        };

        const required = requiredContext[hierarchy] || [];
        const missing = required.filter(field => !context[field]);

        if (missing.length > 0) {
            throw new Error(`Missing context fields for ${name} (${hierarchy}): ${missing.join(', ')}`);
        }

        // Validate country if present
        if (context.country) {
            this.validateCountry(context.country);
        }

        // Validate group if present
        if (context.groupId) {
            this.validateGroup(context.groupId, context.country);
        }

        // Validate role if present
        if (context.role) {
            this.validateRole(context.role, context.userId, context.groupId);
        }

        // Check locks
        if (countryLocked && context.country) {
            this.checkCountryLock(context.userId, context.country);
        }

        if (groupLocked && context.groupId) {
            this.checkGroupLock(context.userId, context.groupId);
        }

        if (roleLocked && context.role) {
            this.checkRoleLock(context.userId, context.role);
        }
    }

    // Get child context for dependencies
    getChildContext(parentName, parentConfig, childName, childConfig, parentContext) {
        // Copy parent context
        const childContext = { ...parentContext };

        // Adjust context based on hierarchy relationship
        const parentHierarchy = parentConfig.hierarchy;
        const childHierarchy = childConfig.hierarchy;

        // Remove context fields that don't apply to child
        switch(childHierarchy) {
            case 'global':
                // Global services get minimal context
                delete childContext.country;
                delete childContext.groupId;
                delete childContext.userId;
                delete childContext.role;
                break;
            case 'country':
                // Country services only need country context
                delete childContext.groupId;
                delete childContext.userId;
                delete childContext.role;
                break;
            case 'group':
                // Group services need country and groupId
                delete childContext.userId;
                delete childContext.role;
                break;
            // Other hierarchies keep appropriate context
        }

        return childContext;
    }

    // Validate hierarchy action
    validateHierarchyAction(serviceName, hierarchy, action, data, context) {
        const hierarchyRules = {
            'global': {
                allowed: ['*'],
                denied: []
            },
            'country': {
                allowed: ['country:select', 'country:view', 'country:stats'],
                denied: ['group:create', 'lender:register', 'borrower:register']
            },
            'group': {
                allowed: ['group:create', 'group:join', 'group:invite', 'group:view'],
                denied: ['lender:lend', 'borrower:borrow', 'ledger:create']
            },
            'lender': {
                allowed: ['lender:register', 'lender:lend', 'ledger:create', 'ledger:update', 'repayment:record'],
                denied: ['borrower:borrow', 'admin:override']
            },
            'borrower': {
                allowed: ['borrower:register', 'borrower:borrow', 'repayment:make'],
                denied: ['lender:lend', 'ledger:create', 'admin:override']
            },
            'ledger': {
                allowed: ['ledger:view', 'ledger:update', 'repayment:record'],
                denied: ['lender:register', 'borrower:register']
            },
            'subscription': {
                allowed: ['subscription:purchase', 'subscription:renew', 'subscription:upgrade'],
                denied: ['lender:lend'] // Can't lend without subscription
            }
        };

        const rules = hierarchyRules[hierarchy] || { allowed: [], denied: [] };

        if (rules.denied.includes(action)) {
            throw new Error(`Action ${action} not allowed for ${hierarchy} hierarchy`);
        }

        if (rules.allowed[0] !== '*' && !rules.allowed.includes(action)) {
            throw new Error(`Action ${action} not explicitly allowed for ${hierarchy} hierarchy`);
        }

        // Additional validation based on action
        switch(action) {
            case 'country:select':
                return this.validateCountrySelection(data.countryCode, context);
            case 'group:join':
                return this.validateGroupJoin(data.groupId, context);
            case 'lender:register':
                return this.validateLenderRegistration(data, context);
            case 'borrower:register':
                return this.validateBorrowerRegistration(data, context);
            case 'lender:lend':
                return this.validateLending(data, context);
            case 'borrower:borrow':
                return this.validateBorrowing(data, context);
            case 'ledger:create':
                return this.validateLedgerCreation(data, context);
            default:
                return true;
        }
    }

    // Country validation
    validateCountry(countryCode) {
        const registry = this.get('Registry', {});
        return registry.validateCountryExists(countryCode);
    }

    validateCountrySelection(countryCode, context) {
        if (context.country && context.country !== countryCode) {
            throw new Error('Country selection is locked after registration');
        }
        return this.validateCountry(countryCode);
    }

    // Group validation
    validateGroup(groupId, country) {
        const registry = this.get('Registry', { country });
        const group = registry.getGroup(groupId);
        
        if (group.country !== country) {
            throw new Error(`Group ${groupId} is not in country ${country}`);
        }
        
        return true;
    }

    validateGroupJoin(groupId, context) {
        const { userId, country } = context;
        const registry = this.get('Registry', { country });
        
        // Check if already in 4 groups
        const userGroups = registry.getUserGroups(userId);
        if (userGroups.length >= 4) {
            throw new Error('User cannot join more than 4 groups');
        }
        
        // Check group capacity
        const group = registry.getGroup(groupId);
        if (group.members.length >= 1000) {
            throw new Error('Group has reached maximum capacity');
        }
        
        // Check country match
        if (group.country !== country) {
            throw new Error('Cannot join group from different country');
        }
        
        return true;
    }

    // Lender validation
    validateLenderRegistration(data, context) {
        const { userId, country, groupId } = context;
        const registry = this.get('Registry', { country });
        
        // Check if already a lender in this group
        const group = registry.getGroup(groupId);
        if (group.lenders.includes(userId)) {
            throw new Error('User is already registered as lender in this group');
        }
        
        // Validate subscription tier
        if (!data.subscriptionTier) {
            throw new Error('Lender must select subscription tier');
        }
        
        const tier = registry.getSubscriptionTier(data.subscriptionTier);
        if (!tier) {
            throw new Error(`Invalid subscription tier: ${data.subscriptionTier}`);
        }
        
        // Validate lending categories
        if (!data.lendingCategories || data.lendingCategories.length === 0) {
            throw new Error('Lender must specify lending categories');
        }
        
        return true;
    }

    validateLending(data, context) {
        const { userId, country, groupId } = context;
        const registry = this.get('Registry', { country });
        
        // Check subscription
        const lender = registry.getLender(userId);
        if (!lender.subscription || lender.subscription.status !== 'active') {
            throw new Error('Lender subscription not active');
        }
        
        // Check tier limits
        const tier = registry.getSubscriptionTier(lender.subscription.tier);
        if (data.amount > tier.limits.weekly) {
            throw new Error(`Amount exceeds ${tier.name} weekly limit`);
        }
        
        // Check lending categories
        if (!lender.lendingCategories.includes('all') && 
            !lender.lendingCategories.includes(data.category)) {
            throw new Error(`Lender does not lend in category: ${data.category}`);
        }
        
        return true;
    }

    // Borrower validation
    validateBorrowerRegistration(data, context) {
        const { userId, country, groupId } = context;
        const registry = this.get('Registry', { country });
        
        // Check if already a borrower in this group
        const group = registry.getGroup(groupId);
        if (group.borrowers.includes(userId)) {
            throw new Error('User is already registered as borrower in this group');
        }
        
        // Validate referrers
        if (!data.referrers || data.referrers.length < 2) {
            throw new Error('Borrower must provide 2 referrers');
        }
        
        // Check if blacklisted
        if (registry.isBlacklisted(userId)) {
            throw new Error('Blacklisted users cannot register as borrowers');
        }
        
        return true;
    }

    validateBorrowing(data, context) {
        const { userId, country, groupId } = context;
        const registry = this.get('Registry', { country });
        
        // Check blacklist status
        if (registry.isBlacklisted(userId)) {
            throw new Error('Blacklisted users cannot borrow');
        }
        
        // Check rating for 4th group
        const userGroups = registry.getUserGroups(userId);
        if (userGroups.length >= 4) {
            const borrower = registry.getBorrower(userId);
            if (borrower.rating < 4.0) {
                throw new Error('Need rating ≥4.0 to borrow in 4th group');
            }
        }
        
        // Check active loans in this group
        const activeLoans = registry.getBorrowerActiveLoans(userId);
        const hasLoanInGroup = activeLoans.some(loan => loan.groupId === groupId);
        if (hasLoanInGroup) {
            throw new Error('Can have only one active loan per group');
        }
        
        return true;
    }

    // Ledger validation
    validateLedgerCreation(data, context) {
        const { country } = context;
        const registry = this.get('Registry', { country });
        
        // Validate all IDs exist
        registry.getBorrower(data.borrowerId);
        registry.getLender(data.lenderId);
        registry.getGroup(data.groupId);
        
        // Check if borrower and lender are in same group
        const borrowerGroups = registry.getUserGroups(data.borrowerId);
        const lenderGroups = registry.getUserGroups(data.lenderId);
        
        if (!borrowerGroups.includes(data.groupId) || !lenderGroups.includes(data.groupId)) {
            throw new Error('Borrower and lender must be in the same group');
        }
        
        // Validate amount
        if (data.amount < 5) {
            throw new Error('Minimum loan amount is 5');
        }
        
        // Validate duration
        if (data.duration > 7) {
            throw new Error('Maximum repayment period is 7 days');
        }
        
        return true;
    }

    // Role validation
    validateRole(role, userId, groupId) {
        const validRoles = ['lender', 'borrower', 'admin', 'member'];
        if (!validRoles.includes(role)) {
            throw new Error(`Invalid role: ${role}`);
        }
        
        // Check if user has this role in the group
        const registry = this.get('Registry', {});
        const group = registry.getGroup(groupId);
        
        switch(role) {
            case 'lender':
                if (!group.lenders.includes(userId)) {
                    throw new Error(`User ${userId} is not a lender in group ${groupId}`);
                }
                break;
            case 'borrower':
                if (!group.borrowers.includes(userId)) {
                    throw new Error(`User ${userId} is not a borrower in group ${groupId}`);
                }
                break;
            case 'admin':
                if (group.adminId !== userId) {
                    throw new Error(`User ${userId} is not admin of group ${groupId}`);
                }
                break;
        }
        
        return true;
    }

    // Lock validation
    checkCountryLock(userId, country) {
        const locked = localStorage.getItem(`mpesewa_user_${userId}_country_locked`);
        if (locked && locked !== country) {
            throw new Error('Country selection is locked');
        }
        return true;
    }

    checkGroupLock(userId, groupId) {
        const userGroups = JSON.parse(localStorage.getItem(`mpesewa_user_${userId}_groups`) || '[]');
        if (!userGroups.includes(groupId)) {
            throw new Error('User is not a member of this group');
        }
        return true;
    }

    checkRoleLock(userId, role) {
        const userRole = localStorage.getItem(`mpesewa_user_${userId}_role`);
        if (userRole && userRole !== role) {
            throw new Error(`User role is locked as ${userRole}, cannot switch to ${role}`);
        }
        return true;
    }

    // Isolation enforcement
    enforceCountryIsolation(userCountry, targetCountry) {
        if (userCountry !== targetCountry) {
            throw new Error(`Cross-country action prohibited: ${userCountry} → ${targetCountry}`);
        }
        return true;
    }

    enforceGroupIsolation(userGroups, targetGroup) {
        if (!userGroups.includes(targetGroup)) {
            throw new Error(`Cross-group action prohibited`);
        }
        return true;
    }

    enforceSubscription(userId) {
        const registry = this.get('Registry', {});
        const lender = registry.getLender(userId);
        
        if (!lender.subscription || lender.subscription.status !== 'active') {
            throw new Error('Lender subscription not active');
        }
        
        // Check expiry (28th of month)
        const expiryDate = new Date(lender.subscription.expiryDate);
        const today = new Date();
        
        if (today.getDate() > 28 || today > expiryDate) {
            throw new Error('Subscription expired on the 28th');
        }
        
        return true;
    }

    // Service management
    has(name) {
        return this.services.has(name);
    }

    list() {
        return Array.from(this.services.keys());
    }

    clear() {
        this.services.clear();
        this.instances.clear();
        this.factories.clear();
        this.dependencies.clear();
        this.hierarchyScopes.clear();
        this.countryScopes.clear();
        this.groupScopes.clear();
        this.roleScopes.clear();
        
        // Reinitialize
        this.initializeCoreServices();
    }

    // Context management
    setGlobalContext(context) {
        this.globalContext = context;
    }

    getGlobalContext() {
        return this.globalContext || {};
    }

    createContext(baseContext = {}) {
        return {
            ...this.getGlobalContext(),
            ...baseContext,
            timestamp: new Date().toISOString(),
            sessionId: this.generateSessionId()
        };
    }

    generateSessionId() {
        return 'session_' + Math.random().toString(36).substr(2, 9);
    }

    // Dependency resolution
    resolveDependencies(serviceName) {
        const dependencies = this.dependencies.get(serviceName) || [];
        const resolved = {};
        
        dependencies.forEach(dep => {
            resolved[dep] = this.get(dep, {});
        });
        
        return resolved;
    }

    // Service lifecycle
    async initService(name, context = {}) {
        const service = this.get(name, context);
        
        if (service.init && typeof service.init === 'function') {
            await service.init(context);
        }
        
        return service;
    }

    async destroyService(name, context = {}) {
        const scopeKey = this.getScopeKey(name, this.services.get(name).scope, context);
        
        if (this.instances.has(scopeKey)) {
            const instance = this.instances.get(scopeKey);
            
            if (instance.destroy && typeof instance.destroy === 'function') {
                await instance.destroy();
            }
            
            this.instances.delete(scopeKey);
        }
    }

    // Batch operations
    async initAll(context = {}) {
        const services = Array.from(this.services.keys());
        const results = {};
        
        for (const service of services) {
            try {
                results[service] = await this.initService(service, context);
            } catch (error) {
                console.error(`Failed to init ${service}:`, error);
                results[service] = error;
            }
        }
        
        return results;
    }

    async destroyAll(context = {}) {
        const instances = Array.from(this.instances.keys());
        const results = {};
        
        for (const key of instances) {
            const [_, name] = key.split(':');
            try {
                await this.destroyService(name, context);
                results[name] = 'destroyed';
            } catch (error) {
                console.error(`Failed to destroy ${name}:`, error);
                results[name] = error;
            }
        }
        
        return results;
    }

    // Health check
    healthCheck() {
        const status = {
            totalServices: this.services.size,
            totalInstances: this.instances.size,
            services: {},
            hierarchies: {},
            scopes: {}
        };

        // Check each service
        this.services.forEach((config, name) => {
            status.services[name] = {
                scope: config.scope,
                hierarchy: config.hierarchy,
                dependencies: config.dependencies.length,
                instantiated: this.instances.has(this.getScopeKey(name, config.scope, {}))
            };
        });

        // Check hierarchies
        const hierarchies = new Set();
        this.services.forEach(config => {
            hierarchies.add(config.hierarchy);
        });
        
        hierarchies.forEach(hierarchy => {
            status.hierarchies[hierarchy] = Array.from(this.services.entries())
                .filter(([_, config]) => config.hierarchy === hierarchy)
                .map(([name]) => name);
        });

        // Check scopes
        const scopes = new Set();
        this.services.forEach(config => {
            scopes.add(config.scope);
        });
        
        scopes.forEach(scope => {
            status.scopes[scope] = Array.from(this.services.entries())
                .filter(([_, config]) => config.scope === scope)
                .map(([name]) => name);
        });

        return status;
    }

    // Dependency graph
    getDependencyGraph() {
        const graph = {
            nodes: [],
            edges: []
        };

        this.services.forEach((config, name) => {
            graph.nodes.push({
                id: name,
                label: name,
                hierarchy: config.hierarchy,
                scope: config.scope
            });

            config.dependencies.forEach(dep => {
                graph.edges.push({
                    from: dep,
                    to: name,
                    type: 'dependency'
                });
            });
        });

        return graph;
    }
}

// Create singleton container
const mpesewaContainer = new MpesewaDIContainer();

// Export factory function
export function createContainer() {
    return new MpesewaDIContainer();
}

// Export constants
export const DI_CONSTANTS = {
    SCOPES: {
        SINGLETON: 'singleton',
        COUNTRY: 'country',
        GROUP: 'group',
        LENDER: 'lender',
        BORROWER: 'borrower',
        LEDGER: 'ledger',
        SUBSCRIPTION: 'subscription',
        RATING: 'rating',
        REPAYMENT: 'repayment',
        PENALTY: 'penalty',
        PAYMENT: 'payment',
        BLACKLIST: 'blacklist',
        ADMIN: 'admin',
        AUDIT: 'audit',
        COLLECTOR: 'collector',
        NOTIFICATION: 'notification',
        AUTH: 'auth',
        UI: 'ui',
        ANALYTICS: 'analytics',
        SYNC: 'sync',
        PWA: 'pwa'
    },
    HIERARCHIES: {
        GLOBAL: 'global',
        COUNTRY: 'country',
        GROUP: 'group',
        LENDER: 'lender',
        BORROWER: 'borrower',
        LEDGER: 'ledger'
    }
};

// Export utility functions
export function inject(serviceName, context = {}) {
    return mpesewaContainer.get(serviceName, context);
}

export function provide(serviceName, factory, options = {}) {
    return mpesewaContainer.register(serviceName, factory, options);
}

export function withContext(context) {
    return {
        get: (serviceName) => mpesewaContainer.get(serviceName, context),
        init: (serviceName) => mpesewaContainer.initService(serviceName, context),
        destroy: (serviceName) => mpesewaContainer.destroyService(serviceName, context)
    };
}

// Export default container
export default mpesewaContainer;

// Named exports
export {
    mpesewaContainer as Container,
    inject,
    provide,
    withContext
};