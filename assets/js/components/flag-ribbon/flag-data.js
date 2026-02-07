/**
 * M-Pesewa Country Flag Data
 * Contains complete data for all 12 supported African countries
 * Follows strict hierarchy: Global → Countries → Groups → Lenders → Borrowers
 */

// Country data with complete hierarchy information
const CountryFlagData = {
    // Supported countries (12 Sub-Saharan African countries)
    COUNTRIES: [
        {
            id: 'KE',
            code: 'KE',
            name: 'Kenya',
            fullName: 'Republic of Kenya',
            flag: '🇰🇪',
            currency: 'KSh',
            currencyCode: 'KES',
            symbol: 'KSh',
            contact: '+254 709 219 000',
            email: 'info.ke@mpesewa.com',
            timezone: 'Africa/Nairobi',
            locale: 'en-KE',
            coordinates: { lat: -1.286389, lng: 36.817223 },
            capital: 'Nairobi',
            population: '54+ million',
            lendingLaws: 'Central Bank of Kenya Regulations',
            complianceLevel: 'High',
            isActive: true,
            launchDate: '2020-01-15',
            groups: [], // Will be populated dynamically
            stats: {
                totalGroups: 0,
                totalLenders: 0,
                totalBorrowers: 0,
                totalAmountLent: 0,
                repaymentRate: 0,
                defaultRate: 0,
                activeLoans: 0
            }
        },
        {
            id: 'UG',
            code: 'UG',
            name: 'Uganda',
            fullName: 'Republic of Uganda',
            flag: '🇺🇬',
            currency: 'UGX',
            currencyCode: 'UGX',
            symbol: 'USh',
            contact: '+256 392 175 546',
            email: 'info.ug@mpesewa.com',
            timezone: 'Africa/Kampala',
            locale: 'en-UG',
            coordinates: { lat: 0.313611, lng: 32.581111 },
            capital: 'Kampala',
            population: '45+ million',
            lendingLaws: 'Bank of Uganda Regulations',
            complianceLevel: 'High',
            isActive: true,
            launchDate: '2020-03-20',
            groups: [],
            stats: {
                totalGroups: 0,
                totalLenders: 0,
                totalBorrowers: 0,
                totalAmountLent: 0,
                repaymentRate: 0,
                defaultRate: 0,
                activeLoans: 0
            }
        },
        {
            id: 'TZ',
            code: 'TZ',
            name: 'Tanzania',
            fullName: 'United Republic of Tanzania',
            flag: '🇹🇿',
            currency: 'TZS',
            currencyCode: 'TZS',
            symbol: 'TSh',
            contact: '+255 659 073 010',
            email: 'info.tz@mpesewa.com',
            timezone: 'Africa/Dar_es_Salaam',
            locale: 'sw-TZ',
            coordinates: { lat: -6.165917, lng: 39.202641 },
            capital: 'Dodoma',
            population: '61+ million',
            lendingLaws: 'Bank of Tanzania Regulations',
            complianceLevel: 'High',
            isActive: true,
            launchDate: '2020-05-10',
            groups: [],
            stats: {
                totalGroups: 0,
                totalLenders: 0,
                totalBorrowers: 0,
                totalAmountLent: 0,
                repaymentRate: 0,
                defaultRate: 0,
                activeLoans: 0
            }
        },
        {
            id: 'RW',
            code: 'RW',
            name: 'Rwanda',
            fullName: 'Republic of Rwanda',
            flag: '🇷🇼',
            currency: 'RWF',
            currencyCode: 'RWF',
            symbol: 'FRw',
            contact: '+250 791 590 801',
            email: 'info.rw@mpesewa.com',
            timezone: 'Africa/Kigali',
            locale: 'rw-RW',
            coordinates: { lat: -1.957875, lng: 30.112735 },
            capital: 'Kigali',
            population: '13+ million',
            lendingLaws: 'National Bank of Rwanda Regulations',
            complianceLevel: 'High',
            isActive: true,
            launchDate: '2020-07-15',
            groups: [],
            stats: {
                totalGroups: 0,
                totalLenders: 0,
                totalBorrowers: 0,
                totalAmountLent: 0,
                repaymentRate: 0,
                defaultRate: 0,
                activeLoans: 0
            }
        },
        {
            id: 'CD',
            code: 'CD',
            name: 'DRC',
            fullName: 'Democratic Republic of the Congo',
            flag: '🇨🇩',
            currency: 'CDF',
            currencyCode: 'CDF',
            symbol: 'FC',
            contact: '+243 81 000 0000',
            email: 'info.cd@mpesewa.com',
            timezone: 'Africa/Kinshasa',
            locale: 'fr-CD',
            coordinates: { lat: -4.322447, lng: 15.307045 },
            capital: 'Kinshasa',
            population: '95+ million',
            lendingLaws: 'Central Bank of Congo Regulations',
            complianceLevel: 'Medium',
            isActive: true,
            launchDate: '2020-09-05',
            groups: [],
            stats: {
                totalGroups: 0,
                totalLenders: 0,
                totalBorrowers: 0,
                totalAmountLent: 0,
                repaymentRate: 0,
                defaultRate: 0,
                activeLoans: 0
            }
        },
        {
            id: 'BI',
            code: 'BI',
            name: 'Burundi',
            fullName: 'Republic of Burundi',
            flag: '🇧🇮',
            currency: 'BIF',
            currencyCode: 'BIF',
            symbol: 'FBu',
            contact: '+257 79 000 000',
            email: 'info.bi@mpesewa.com',
            timezone: 'Africa/Bujumbura',
            locale: 'fr-BI',
            coordinates: { lat: -3.3822, lng: 29.3644 },
            capital: 'Gitega',
            population: '12+ million',
            lendingLaws: 'Bank of the Republic of Burundi Regulations',
            complianceLevel: 'Medium',
            isActive: true,
            launchDate: '2020-11-12',
            groups: [],
            stats: {
                totalGroups: 0,
                totalLenders: 0,
                totalBorrowers: 0,
                totalAmountLent: 0,
                repaymentRate: 0,
                defaultRate: 0,
                activeLoans: 0
            }
        },
        {
            id: 'NG',
            code: 'NG',
            name: 'Nigeria',
            fullName: 'Federal Republic of Nigeria',
            flag: '🇳🇬',
            currency: 'NGN',
            currencyCode: 'NGN',
            symbol: '₦',
            contact: '+234 800 000 0000',
            email: 'info.ng@mpesewa.com',
            timezone: 'Africa/Lagos',
            locale: 'en-NG',
            coordinates: { lat: 9.05785, lng: 7.49508 },
            capital: 'Abuja',
            population: '211+ million',
            lendingLaws: 'Central Bank of Nigeria Regulations',
            complianceLevel: 'High',
            isActive: true,
            launchDate: '2021-01-20',
            groups: [],
            stats: {
                totalGroups: 0,
                totalLenders: 0,
                totalBorrowers: 0,
                totalAmountLent: 0,
                repaymentRate: 0,
                defaultRate: 0,
                activeLoans: 0
            }
        },
        {
            id: 'GH',
            code: 'GH',
            name: 'Ghana',
            fullName: 'Republic of Ghana',
            flag: '🇬🇭',
            currency: 'GHS',
            currencyCode: 'GHS',
            symbol: 'GH₵',
            contact: '+233 24 000 0000',
            email: 'info.gh@mpesewa.com',
            timezone: 'Africa/Accra',
            locale: 'en-GH',
            coordinates: { lat: 5.603717, lng: -0.186964 },
            capital: 'Accra',
            population: '31+ million',
            lendingLaws: 'Bank of Ghana Regulations',
            complianceLevel: 'High',
            isActive: true,
            launchDate: '2021-03-15',
            groups: [],
            stats: {
                totalGroups: 0,
                totalLenders: 0,
                totalBorrowers: 0,
                totalAmountLent: 0,
                repaymentRate: 0,
                defaultRate: 0,
                activeLoans: 0
            }
        },
        {
            id: 'SS',
            code: 'SS',
            name: 'South Sudan',
            fullName: 'Republic of South Sudan',
            flag: '🇸🇸',
            currency: 'SSP',
            currencyCode: 'SSP',
            symbol: 'SS£',
            contact: '+211 955 000 000',
            email: 'info.ss@mpesewa.com',
            timezone: 'Africa/Juba',
            locale: 'en-SS',
            coordinates: { lat: 4.85, lng: 31.6 },
            capital: 'Juba',
            population: '11+ million',
            lendingLaws: 'Bank of South Sudan Regulations',
            complianceLevel: 'Medium',
            isActive: true,
            launchDate: '2021-05-10',
            groups: [],
            stats: {
                totalGroups: 0,
                totalLenders: 0,
                totalBorrowers: 0,
                totalAmountLent: 0,
                repaymentRate: 0,
                defaultRate: 0,
                activeLoans: 0
            }
        },
        {
            id: 'SO',
            code: 'SO',
            name: 'Somalia',
            fullName: 'Federal Republic of Somalia',
            flag: '🇸🇴',
            currency: 'SOS',
            currencyCode: 'SOS',
            symbol: 'Sh.So.',
            contact: '+252 63 0000000',
            email: 'info.so@mpesewa.com',
            timezone: 'Africa/Mogadishu',
            locale: 'so-SO',
            coordinates: { lat: 2.0469, lng: 45.3182 },
            capital: 'Mogadishu',
            population: '16+ million',
            lendingLaws: 'Central Bank of Somalia Regulations',
            complianceLevel: 'Medium',
            isActive: true,
            launchDate: '2021-07-25',
            groups: [],
            stats: {
                totalGroups: 0,
                totalLenders: 0,
                totalBorrowers: 0,
                totalAmountLent: 0,
                repaymentRate: 0,
                defaultRate: 0,
                activeLoans: 0
            }
        },
        {
            id: 'ZA',
            code: 'ZA',
            name: 'South Africa',
            fullName: 'Republic of South Africa',
            flag: '🇿🇦',
            currency: 'ZAR',
            currencyCode: 'ZAR',
            symbol: 'R',
            contact: '+27 11 000 0000',
            email: 'info.za@mpesewa.com',
            timezone: 'Africa/Johannesburg',
            locale: 'en-ZA',
            coordinates: { lat: -25.7479, lng: 28.2293 },
            capital: 'Pretoria',
            population: '60+ million',
            lendingLaws: 'South African Reserve Bank Regulations',
            complianceLevel: 'High',
            isActive: true,
            launchDate: '2021-09-15',
            groups: [],
            stats: {
                totalGroups: 0,
                totalLenders: 0,
                totalBorrowers: 0,
                totalAmountLent: 0,
                repaymentRate: 0,
                defaultRate: 0,
                activeLoans: 0
            }
        },
        {
            id: 'ET',
            code: 'ET',
            name: 'Ethiopia',
            fullName: 'Federal Democratic Republic of Ethiopia',
            flag: '🇪🇹',
            currency: 'ETB',
            currencyCode: 'ETB',
            symbol: 'Br',
            contact: '+251 11 000 0000',
            email: 'info.et@mpesewa.com',
            timezone: 'Africa/Addis_Ababa',
            locale: 'am-ET',
            coordinates: { lat: 9.03, lng: 38.74 },
            capital: 'Addis Ababa',
            population: '117+ million',
            lendingLaws: 'National Bank of Ethiopia Regulations',
            complianceLevel: 'Medium',
            isActive: true,
            launchDate: '2021-11-30',
            groups: [],
            stats: {
                totalGroups: 0,
                totalLenders: 0,
                totalBorrowers: 0,
                totalAmountLent: 0,
                repaymentRate: 0,
                defaultRate: 0,
                activeLoans: 0
            }
        }
    ],

    // Hierarchy structure constants
    HIERARCHY: {
        GLOBAL: {
            level: 0,
            name: 'Global',
            description: 'M-Pesewa Platform - All Countries',
            maxCountries: 12,
            rules: [
                'Country isolation enforced',
                'No cross-country lending',
                'Independent per-country operations',
                'Unified platform governance'
            ]
        },
        COUNTRY: {
            level: 1,
            name: 'Country',
            description: 'Independent country container',
            rules: [
                'Minimum 5 members per group',
                'Maximum 1000 members per group',
                'Country-specific currency operations',
                'Local regulation compliance'
            ]
        },
        GROUP: {
            level: 2,
            name: 'Group',
            description: 'Trusted circle community',
            types: ['Family', 'Church', 'Professional', 'Local', 'Social', 'Business'],
            minMembers: 5,
            maxMembers: 1000,
            rules: [
                'Invitation-only membership',
                'Group-admin moderated',
                'Country-locked members',
                'Internal trust building'
            ]
        },
        LENDER: {
            level: 3,
            name: 'Lender',
            description: 'Money provider with subscription',
            requirements: ['Active subscription', 'Within group only', 'Personal ledgers'],
            subscriptionTiers: ['Basic', 'Premium', 'Super', 'Lender of Lenders'],
            rules: [
                'Subscription expires 28th monthly',
                'Lend only within group',
                'Unlimited ledgers per lender',
                '10% weekly interest'
            ]
        },
        BORROWER: {
            level: 3,
            name: 'Borrower',
            description: 'Loan recipient with reputation',
            requirements: ['Group membership', 'Good rating', 'Maximum 4 groups'],
            maxGroups: 4,
            rules: [
                'No subscription fees',
                '7-day repayment period',
                '5% daily penalty after 7 days',
                '2-month default triggers blacklist'
            ]
        },
        LEDGER: {
            level: 4,
            name: 'Ledger',
            description: 'Active loan record',
            fields: ['Borrower details', 'Loan amount', 'Interest', 'Due date', 'Status'],
            statuses: ['Active', 'Cleared', 'Defaulted'],
            rules: [
                'Auto-generated on approval',
                'Manual updates by lender',
                'Admin override possible',
                'Tied to one borrower'
            ]
        }
    },

    // Sample groups for demonstration
    SAMPLE_GROUPS: [
        {
            id: 'GRP001',
            countryCode: 'KE',
            name: 'Nairobi Family Circle',
            type: 'Family',
            description: 'Extended family members supporting each other',
            admin: 'James Mwangi',
            memberCount: 42,
            lenders: 15,
            borrowers: 27,
            totalLent: 450000,
            repaymentRate: 98.5,
            created: '2023-01-15',
            rules: 'Family-first, interest capped at 10%',
            badge: '👨‍👩‍👧‍👦'
        },
        {
            id: 'GRP002',
            countryCode: 'UG',
            name: 'Kampala Business Network',
            type: 'Professional',
            description: 'Small business owners mutual support',
            admin: 'Sarah Nabukenya',
            memberCount: 87,
            lenders: 32,
            borrowers: 55,
            totalLent: 1200000,
            repaymentRate: 96.2,
            created: '2023-02-20',
            rules: 'Business emergency loans only',
            badge: '💼'
        },
        {
            id: 'GRP003',
            countryCode: 'TZ',
            name: 'Dar es Salaam Church Group',
            type: 'Church',
            description: 'Church community emergency fund',
            admin: 'Pastor Joseph',
            memberCount: 156,
            lenders: 45,
            borrowers: 111,
            totalLent: 850000,
            repaymentRate: 99.1,
            created: '2023-03-10',
            rules: 'No interest for church members',
            badge: '⛪'
        },
        {
            id: 'GRP004',
            countryCode: 'RW',
            name: 'Kigali Tech Professionals',
            type: 'Professional',
            description: 'IT professionals mutual lending',
            admin: 'Marie Uwase',
            memberCount: 63,
            lenders: 28,
            borrowers: 35,
            totalLent: 3200000,
            repaymentRate: 97.8,
            created: '2023-04-05',
            rules: 'Tech-related emergencies only',
            badge: '💻'
        },
        {
            id: 'GRP005',
            countryCode: 'NG',
            name: 'Lagos Market Traders',
            type: 'Business',
            description: 'Market traders working capital pool',
            admin: 'Chinedu Okoro',
            memberCount: 214,
            lenders: 89,
            borrowers: 125,
            totalLent: 5600000,
            repaymentRate: 95.7,
            created: '2023-05-12',
            rules: 'Daily repayment option available',
            badge: '🛒'
        }
    ],

    // Sample lenders for demonstration
    SAMPLE_LENDERS: [
        {
            id: 'LEN001',
            countryCode: 'KE',
            groupId: 'GRP001',
            name: 'David Kimani',
            subscription: 'Premium',
            totalLent: 150000,
            ledgers: 8,
            activeBorrowers: 5,
            rating: 4.8,
            since: '2023-02-01',
            categories: ['All'],
            maxLimit: 5000
        },
        {
            id: 'LEN002',
            countryCode: 'UG',
            groupId: 'GRP002',
            name: 'Grace Nakato',
            subscription: 'Super',
            totalLent: 450000,
            ledgers: 15,
            activeBorrowers: 9,
            rating: 4.9,
            since: '2023-03-15',
            categories: ['Business', 'Education', 'Health'],
            maxLimit: 20000
        }
    ],

    // Sample borrowers for demonstration
    SAMPLE_BORROWERS: [
        {
            id: 'BOR001',
            countryCode: 'KE',
            groupId: 'GRP001',
            name: 'Susan Wanjiku',
            totalBorrowed: 25000,
            activeLoans: 1,
            repaidLoans: 3,
            rating: 4.5,
            groups: 2,
            blacklisted: false,
            lastLoan: '2023-10-15'
        },
        {
            id: 'BOR002',
            countryCode: 'UG',
            groupId: 'GRP002',
            name: 'Robert Ssebagala',
            totalBorrowed: 120000,
            activeLoans: 2,
            repaidLoans: 7,
            rating: 4.2,
            groups: 3,
            blacklisted: false,
            lastLoan: '2023-10-20'
        }
    ],

    // Sample ledgers for demonstration
    SAMPLE_LEDGERS: [
        {
            id: 'LED001',
            countryCode: 'KE',
            lenderId: 'LEN001',
            borrowerId: 'BOR001',
            groupId: 'GRP001',
            amount: 5000,
            interest: 500,
            totalDue: 5500,
            dateBorrowed: '2023-10-15',
            dueDate: '2023-10-22',
            status: 'Active',
            category: 'Education',
            guarantors: ['John Doe', 'Jane Smith'],
            repayments: []
        },
        {
            id: 'LED002',
            countryCode: 'UG',
            lenderId: 'LEN002',
            borrowerId: 'BOR002',
            groupId: 'GRP002',
            amount: 15000,
            interest: 1500,
            totalDue: 16500,
            dateBorrowed: '2023-10-10',
            dueDate: '2023-10-17',
            status: 'Active',
            category: 'Business',
            guarantors: ['Peter Jones', 'Mary Brown'],
            repayments: [
                { date: '2023-10-12', amount: 5000 },
                { date: '2023-10-15', amount: 5000 }
            ]
        }
    ],

    // Helper methods
    getCountryByCode(code) {
        return this.COUNTRIES.find(country => country.code === code);
    },

    getCountryByName(name) {
        return this.COUNTRIES.find(country => country.name === name);
    },

    getCountriesByActivity(active = true) {
        return this.COUNTRIES.filter(country => country.isActive === active);
    },

    getCountryGroups(countryCode) {
        return this.SAMPLE_GROUPS.filter(group => group.countryCode === countryCode);
    },

    getHierarchyLevel(level) {
        return this.HIERARCHY[level.toUpperCase()];
    },

    getAllHierarchy() {
        return Object.values(this.HIERARCHY).sort((a, b) => a.level - b.level);
    },

    // Data validation methods
    validateCountryCode(code) {
        return this.COUNTRIES.some(country => country.code === code);
    },

    validateGroupData(groupData) {
        const required = ['countryCode', 'name', 'type', 'admin'];
        return required.every(field => groupData[field]);
    },

    validateLenderData(lenderData) {
        const required = ['countryCode', 'groupId', 'name', 'subscription'];
        return required.every(field => lenderData[field]);
    },

    validateBorrowerData(borrowerData) {
        const required = ['countryCode', 'groupId', 'name'];
        return required.every(field => borrowerData[field]);
    },

    // Statistics methods
    getGlobalStats() {
        const stats = {
            totalCountries: this.COUNTRIES.length,
            activeCountries: this.getCountriesByActivity(true).length,
            totalGroups: this.SAMPLE_GROUPS.length,
            totalLenders: this.SAMPLE_LENDERS.length,
            totalBorrowers: this.SAMPLE_BORROWERS.length,
            totalAmountLent: this.SAMPLE_GROUPS.reduce((sum, group) => sum + group.totalLent, 0),
            averageRepaymentRate: this.SAMPLE_GROUPS.reduce((sum, group) => sum + group.repaymentRate, 0) / this.SAMPLE_GROUPS.length
        };
        
        return stats;
    },

    getCountryStats(countryCode) {
        const country = this.getCountryByCode(countryCode);
        if (!country) return null;
        
        const countryGroups = this.getCountryGroups(countryCode);
        const stats = {
            country: country.name,
            totalGroups: countryGroups.length,
            totalLenders: countryGroups.reduce((sum, group) => sum + group.lenders, 0),
            totalBorrowers: countryGroups.reduce((sum, group) => sum + group.borrowers, 0),
            totalAmountLent: countryGroups.reduce((sum, group) => sum + group.totalLent, 0),
            averageRepaymentRate: countryGroups.reduce((sum, group) => sum + group.repaymentRate, 0) / countryGroups.length || 0
        };
        
        return stats;
    },

    // Data population methods
    populateCountryGroups() {
        this.COUNTRIES.forEach(country => {
            country.groups = this.getCountryGroups(country.code);
            country.stats = this.getCountryStats(country.code) || country.stats;
        });
    },

    // Initialization
    initialize() {
        this.populateCountryGroups();
        console.log('Flag Data initialized with', this.COUNTRIES.length, 'countries');
        return this;
    }
};

// Initialize the data
CountryFlagData.initialize();

// Export for different module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CountryFlagData;
}

// Auto-attach to window if in browser
if (typeof window !== 'undefined') {
    window.mpesewaFlagData = CountryFlagData;
}