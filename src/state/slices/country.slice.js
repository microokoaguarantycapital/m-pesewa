/**
 * M-PESEWA COUNTRY SLICE
 * Strictly follows Section A rules for country isolation and operations
 * 12 Sub-Saharan African countries with strict isolation
 */

import { createSlice, createAsyncThunk } from 'reduxjs/toolkit';

// 12 Sub-Saharan African countries (Section A)
const SUPPORTED_COUNTRIES = [
    { code: 'KE', name: 'Kenya', currency: 'KSh', flag: '🇰🇪', phoneCode: '+254' },
    { code: 'UG', name: 'Uganda', currency: 'UGX', flag: '🇺🇬', phoneCode: '+256' },
    { code: 'TZ', name: 'Tanzania', currency: 'TZS', flag: '🇹🇿', phoneCode: '+255' },
    { code: 'RW', name: 'Rwanda', currency: 'RWF', flag: '🇷🇼', phoneCode: '+250' },
    { code: 'CD', name: 'DRC', currency: 'CDF', flag: '🇨🇩', phoneCode: '+243' },
    { code: 'BI', name: 'Burundi', currency: 'BIF', flag: '🇧🇮', phoneCode: '+257' },
    { code: 'NG', name: 'Nigeria', currency: 'NGN', flag: '🇳🇬', phoneCode: '+234' },
    { code: 'GH', name: 'Ghana', currency: 'GHS', flag: '🇬🇭', phoneCode: '+233' },
    { code: 'SS', name: 'South Sudan', currency: 'SSP', flag: '🇸🇸', phoneCode: '+211' },
    { code: 'SO', name: 'Somalia', currency: 'SOS', flag: '🇸🇴', phoneCode: '+252' },
    { code: 'ZA', name: 'South Africa', currency: 'ZAR', flag: '🇿🇦', phoneCode: '+27' },
    { code: 'ET', name: 'Ethiopia', currency: 'ETB', flag: '🇪🇹', phoneCode: '+251' }
];

// Country-specific rules (Section A)
const COUNTRY_RULES = {
    KE: {
        minLoanAmount: 50,
        maxLoanAmountBasic: 1500,
        maxLoanAmountPremium: 5000,
        maxLoanAmountSuper: 20000,
        maxLoanAmountLenderOfLenders: 50000,
        interestRate: 0.10, // 10%
        penaltyRate: 0.05, // 5% daily after 7 days
        repaymentPeriod: 7, // days
        defaultPeriod: 60, // days (2 months)
        contact: '+254 709 219 000',
        email: 'info@mpesewa.ke',
        timezone: 'Africa/Nairobi'
    },
    UG: {
        minLoanAmount: 2000,
        maxLoanAmountBasic: 60000,
        maxLoanAmountPremium: 200000,
        maxLoanAmountSuper: 800000,
        maxLoanAmountLenderOfLenders: 2000000,
        interestRate: 0.10,
        penaltyRate: 0.05,
        repaymentPeriod: 7,
        defaultPeriod: 60,
        contact: '+256 392 175 546',
        email: 'info@mpesewa.ug',
        timezone: 'Africa/Kampala'
    },
    TZ: {
        minLoanAmount: 1000,
        maxLoanAmountBasic: 30000,
        maxLoanAmountPremium: 100000,
        maxLoanAmountSuper: 400000,
        maxLoanAmountLenderOfLenders: 1000000,
        interestRate: 0.10,
        penaltyRate: 0.05,
        repaymentPeriod: 7,
        defaultPeriod: 60,
        contact: '+255 659 073 010',
        email: 'info@mpesewa.tz',
        timezone: 'Africa/Dar_es_Salaam'
    },
    RW: {
        minLoanAmount: 500,
        maxLoanAmountBasic: 15000,
        maxLoanAmountPremium: 50000,
        maxLoanAmountSuper: 200000,
        maxLoanAmountLenderOfLenders: 500000,
        interestRate: 0.10,
        penaltyRate: 0.05,
        repaymentPeriod: 7,
        defaultPeriod: 60,
        contact: '+250 791 590 801',
        email: 'info@mpesewa.rw',
        timezone: 'Africa/Kigali'
    },
    CD: {
        minLoanAmount: 1, // USD
        maxLoanAmountBasic: 10,
        maxLoanAmountPremium: 30,
        maxLoanAmountSuper: 100,
        maxLoanAmountLenderOfLenders: 250,
        interestRate: 0.10,
        penaltyRate: 0.05,
        repaymentPeriod: 7,
        defaultPeriod: 60,
        contact: '+243 81 000 0000',
        email: 'info@mpesewa.cd',
        timezone: 'Africa/Kinshasa'
    },
    BI: {
        minLoanAmount: 500,
        maxLoanAmountBasic: 15000,
        maxLoanAmountPremium: 50000,
        maxLoanAmountSuper: 200000,
        maxLoanAmountLenderOfLenders: 500000,
        interestRate: 0.10,
        penaltyRate: 0.05,
        repaymentPeriod: 7,
        defaultPeriod: 60,
        contact: '+257 79 000 000',
        email: 'info@mpesewa.bi',
        timezone: 'Africa/Bujumbura'
    },
    NG: {
        minLoanAmount: 100,
        maxLoanAmountBasic: 3000,
        maxLoanAmountPremium: 10000,
        maxLoanAmountSuper: 40000,
        maxLoanAmountLenderOfLenders: 100000,
        interestRate: 0.10,
        penaltyRate: 0.05,
        repaymentPeriod: 7,
        defaultPeriod: 60,
        contact: '+234 800 000 0000',
        email: 'info@mpesewa.ng',
        timezone: 'Africa/Lagos'
    },
    GH: {
        minLoanAmount: 1,
        maxLoanAmountBasic: 30,
        maxLoanAmountPremium: 100,
        maxLoanAmountSuper: 400,
        maxLoanAmountLenderOfLenders: 1000,
        interestRate: 0.10,
        penaltyRate: 0.05,
        repaymentPeriod: 7,
        defaultPeriod: 60,
        contact: '+233 24 000 0000',
        email: 'info@mpesewa.gh',
        timezone: 'Africa/Accra'
    },
    SS: {
        minLoanAmount: 50,
        maxLoanAmountBasic: 1500,
        maxLoanAmountPremium: 5000,
        maxLoanAmountSuper: 20000,
        maxLoanAmountLenderOfLenders: 50000,
        interestRate: 0.10,
        penaltyRate: 0.05,
        repaymentPeriod: 7,
        defaultPeriod: 60,
        contact: '+211 955 000 000',
        email: 'info@mpesewa.ss',
        timezone: 'Africa/Juba'
    },
    SO: {
        minLoanAmount: 5000,
        maxLoanAmountBasic: 150000,
        maxLoanAmountPremium: 500000,
        maxLoanAmountSuper: 2000000,
        maxLoanAmountLenderOfLenders: 5000000,
        interestRate: 0.10,
        penaltyRate: 0.05,
        repaymentPeriod: 7,
        defaultPeriod: 60,
        contact: '+252 63 0000000',
        email: 'info@mpesewa.so',
        timezone: 'Africa/Mogadishu'
    },
    ZA: {
        minLoanAmount: 10,
        maxLoanAmountBasic: 300,
        maxLoanAmountPremium: 1000,
        maxLoanAmountSuper: 4000,
        maxLoanAmountLenderOfLenders: 10000,
        interestRate: 0.10,
        penaltyRate: 0.05,
        repaymentPeriod: 7,
        defaultPeriod: 60,
        contact: '+27 11 000 0000',
        email: 'info@mpesewa.za',
        timezone: 'Africa/Johannesburg'
    },
    ET: {
        minLoanAmount: 10,
        maxLoanAmountBasic: 300,
        maxLoanAmountPremium: 1000,
        maxLoanAmountSuper: 4000,
        maxLoanAmountLenderOfLenders: 10000,
        interestRate: 0.10,
        penaltyRate: 0.05,
        repaymentPeriod: 7,
        defaultPeriod: 60,
        contact: '+251 11 000 0000',
        email: 'info@mpesewa.et',
        timezone: 'Africa/Addis_Ababa'
    }
};

// Initial state
const initialState = {
    // Current selected country
    currentCountry: null,
    
    // Country-specific data
    countryData: null,
    
    // All supported countries
    supportedCountries: SUPPORTED_COUNTRIES,
    
    // Country rules
    rules: COUNTRY_RULES,
    
    // Country statistics
    statistics: {
        totalGroups: 0,
        totalLenders: 0,
        totalBorrowers: 0,
        totalAmountLent: 0,
        repaymentRate: 0,
        activeLoans: 0
    },
    
    // Country isolation enforcement
    isolation: {
        enabled: true,
        violationAttempts: 0,
        lastViolation: null
    },
    
    // Loading states
    isLoading: false,
    isLoaded: false,
    error: null
};

// Async thunks
export const selectCountry = createAsyncThunk(
    'country/selectCountry',
    async (countryCode, { rejectWithValue, getState }) => {
        try {
            // Validate country code
            if (!SUPPORTED_COUNTRIES.find(c => c.code === countryCode)) {
                throw new Error(`Country ${countryCode} not supported. Supported: ${SUPPORTED_COUNTRIES.map(c => c.code).join(', ')}`);
            }
            
            // Check if user is already registered in another country (Section A: No cross-country operations)
            const state = getState();
            const userCountry = localStorage.getItem('mpesewa_user_country');
            
            if (userCountry && userCountry !== countryCode) {
                // Section A Rule: Country selection is locked after registration
                throw new Error(`You are already registered in ${userCountry}. Country cannot be changed. Please logout and register in new country.`);
            }
            
            // Load country-specific data
            const countryData = await loadCountryData(countryCode);
            
            return {
                countryCode,
                ...countryData,
                selectionTimestamp: new Date().toISOString()
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const loadCountryStatistics = createAsyncThunk(
    'country/loadStatistics',
    async (countryCode, { rejectWithValue }) => {
        try {
            const stats = await fetchCountryStatistics(countryCode);
            return {
                countryCode,
                statistics: stats
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const validateCrossCountryOperation = createAsyncThunk(
    'country/validateCrossCountry',
    async ({ operation, sourceCountry, targetCountry }, { rejectWithValue }) => {
        try {
            // Section A Strict Rule: No cross-country operations
            if (sourceCountry !== targetCountry) {
                // Log violation attempt
                await logCountryViolation({
                    operation,
                    sourceCountry,
                    targetCountry,
                    timestamp: new Date().toISOString(),
                    blocked: true
                });
                
                throw new Error(`Cross-country ${operation} not allowed. Source: ${sourceCountry}, Target: ${targetCountry}`);
            }
            
            return {
                isValid: true,
                operation,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const getCountryRules = createAsyncThunk(
    'country/getRules',
    async (countryCode, { rejectWithValue }) => {
        try {
            const rules = COUNTRY_RULES[countryCode];
            
            if (!rules) {
                throw new Error(`No rules found for country: ${countryCode}`);
            }
            
            return {
                countryCode,
                rules,
                fetchedAt: new Date().toISOString()
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Create slice
const countrySlice = createSlice({
    name: 'country',
    initialState,
    reducers: {
        // Set country data manually
        setCountry: (state, action) => {
            const countryCode = action.payload;
            const country = SUPPORTED_COUNTRIES.find(c => c.code === countryCode);
            
            if (country) {
                state.currentCountry = countryCode;
                state.countryData = country;
                state.rules = COUNTRY_RULES[countryCode] || {};
                
                // Store in localStorage
                localStorage.setItem('mpesewa_current_country', countryCode);
            }
        },
        
        // Clear country selection
        clearCountry: (state) => {
            state.currentCountry = null;
            state.countryData = null;
            state.statistics = initialState.statistics;
            localStorage.removeItem('mpesewa_current_country');
        },
        
        // Update country statistics
        updateStatistics: (state, action) => {
            state.statistics = {
                ...state.statistics,
                ...action.payload
            };
        },
        
        // Record country violation attempt
        recordViolation: (state, action) => {
            const { operation, targetCountry } = action.payload;
            
            state.isolation.violationAttempts += 1;
            state.isolation.lastViolation = {
                operation,
                targetCountry,
                timestamp: new Date().toISOString()
            };
            
            // Log to localStorage
            const violations = JSON.parse(localStorage.getItem('mpesewa_country_violations') || '[]');
            violations.push({
                ...action.payload,
                currentCountry: state.currentCountry,
                timestamp: new Date().toISOString()
            });
            localStorage.setItem('mpesewa_country_violations', JSON.stringify(violations));
        },
        
        // Reset violations
        resetViolations: (state) => {
            state.isolation.violationAttempts = 0;
            state.isolation.lastViolation = null;
        },
        
        // Calculate loan terms based on country and tier
        calculateLoanTerms: (state, action) => {
            const { amount, tier, duration } = action.payload;
            const countryCode = state.currentCountry;
            const rules = COUNTRY_RULES[countryCode];
            
            if (!rules) {
                throw new Error(`No rules found for country: ${countryCode}`);
            }
            
            // Validate amount against tier limits
            const tierLimits = {
                basic: rules.maxLoanAmountBasic,
                premium: rules.maxLoanAmountPremium,
                super: rules.maxLoanAmountSuper,
                lender_of_lenders: rules.maxLoanAmountLenderOfLenders
            };
            
            if (amount > tierLimits[tier]) {
                throw new Error(`Amount exceeds ${tier} tier limit of ${tierLimits[tier]} ${state.countryData?.currency}`);
            }
            
            if (amount < rules.minLoanAmount) {
                throw new Error(`Amount below minimum of ${rules.minLoanAmount} ${state.countryData?.currency}`);
            }
            
            // Calculate interest (10% for 7 days)
            const interest = amount * rules.interestRate;
            const totalRepayment = amount + interest;
            const dailyRepayment = totalRepayment / rules.repaymentPeriod;
            
            return {
                amount,
                interest,
                totalRepayment,
                dailyRepayment,
                repaymentPeriod: rules.repaymentPeriod,
                interestRate: rules.interestRate,
                penaltyRate: rules.penaltyRate,
                dueDate: new Date(Date.now() + rules.repaymentPeriod * 24 * 60 * 60 * 1000).toISOString()
            };
        },
        
        // Get country flag and info
        getCountryInfo: (state) => {
            const countryCode = state.currentCountry;
            const country = SUPPORTED_COUNTRIES.find(c => c.code === countryCode);
            
            return {
                ...country,
                rules: COUNTRY_RULES[countryCode],
                contact: COUNTRY_RULES[countryCode]?.contact || 'Not available'
            };
        },
        
        // Check if operation is allowed between countries
        isOperationAllowed: (state, action) => {
            const { operationType, targetCountry } = action.payload;
            
            // Section A: Strict country isolation
            if (state.currentCountry !== targetCountry) {
                return {
                    allowed: false,
                    reason: `Cross-country ${operationType} not allowed. Strict country isolation enforced.`,
                    violationType: 'country_isolation'
                };
            }
            
            return {
                allowed: true,
                reason: null
            };
        }
    },
    extraReducers: (builder) => {
        builder
            // Select country cases
            .addCase(selectCountry.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(selectCountry.fulfilled, (state, action) => {
                const { countryCode, ...countryData } = action.payload;
                const country = SUPPORTED_COUNTRIES.find(c => c.code === countryCode);
                
                state.isLoading = false;
                state.isLoaded = true;
                state.currentCountry = countryCode;
                state.countryData = {
                    ...country,
                    ...countryData
                };
                state.rules = COUNTRY_RULES[countryCode] || {};
                
                // Store in localStorage
                localStorage.setItem('mpesewa_current_country', countryCode);
                localStorage.setItem('mpesewa_country_data', JSON.stringify(countryData));
            })
            .addCase(selectCountry.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || action.error.message;
            })
            
            // Load statistics cases
            .addCase(loadCountryStatistics.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(loadCountryStatistics.fulfilled, (state, action) => {
                const { countryCode, statistics } = action.payload;
                
                if (state.currentCountry === countryCode) {
                    state.statistics = statistics;
                }
                
                state.isLoading = false;
            })
            .addCase(loadCountryStatistics.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || action.error.message;
            })
            
            // Validate cross-country cases
            .addCase(validateCrossCountryOperation.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(validateCrossCountryOperation.fulfilled, (state, action) => {
                state.isLoading = false;
                // Operation is valid, no violation
            })
            .addCase(validateCrossCountryOperation.rejected, (state, action) => {
                state.isLoading = false;
                state.isolation.violationAttempts += 1;
                state.isolation.lastViolation = {
                    timestamp: new Date().toISOString(),
                    reason: action.payload
                };
            })
            
            // Get country rules cases
            .addCase(getCountryRules.fulfilled, (state, action) => {
                const { countryCode, rules } = action.payload;
                
                if (state.currentCountry === countryCode) {
                    state.rules = rules;
                }
            });
    }
});

// Selectors
export const selectCurrentCountry = (state) => state.country.currentCountry;
export const selectCountryData = (state) => state.country.countryData;
export const selectSupportedCountries = (state) => state.country.supportedCountries;
export const selectCountryRules = (state) => state.country.rules;
export const selectCountryStatistics = (state) => state.country.statistics;
export const selectIsLoading = (state) => state.country.isLoading;
export const selectCountryIsolation = (state) => state.country.isolation;
export const selectCountryFlag = (state) => 
    state.country.supportedCountries.find(c => c.code === state.currentCountry)?.flag || '🏳️';

export const selectCurrency = (state) => 
    state.country.supportedCountries.find(c => c.code === state.currentCountry)?.currency || '';

export const selectContactInfo = (state) => {
    const countryCode = state.currentCountry;
    const rules = COUNTRY_RULES[countryCode];
    const country = state.country.supportedCountries.find(c => c.code === countryCode);
    
    return {
        phone: rules?.contact || '',
        email: rules?.email || 'info@mpesewa.com',
        country: country?.name || ''
    };
};

// Helper functions
const loadCountryData = async (countryCode) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Load from localStorage or generate mock data
    const storedData = localStorage.getItem(`mpesewa_country_${countryCode}`);
    
    if (storedData) {
        return JSON.parse(storedData);
    }
    
    // Generate mock country data
    const mockData = {
        total_groups: Math.floor(Math.random() * 100) + 50,
        total_lenders: Math.floor(Math.random() * 1000) + 200,
        total_borrowers: Math.floor(Math.random() * 5000) + 1000,
        total_amount_lent: Math.floor(Math.random() * 10000000) + 1000000,
        repayment_rate: 85 + Math.floor(Math.random() * 15), // 85-99%
        active_loans: Math.floor(Math.random() * 500) + 100,
        popular_categories: ['fare', 'data', 'food', 'fuel'],
        top_groups: [
            { id: 'group_1', name: 'Family Trust', members: 45, amount_lent: 500000 },
            { id: 'group_2', name: 'Business Network', members: 32, amount_lent: 320000 },
            { id: 'group_3', name: 'Community Savings', members: 28, amount_lent: 280000 }
        ]
    };
    
    // Store for future use
    localStorage.setItem(`mpesewa_country_${countryCode}`, JSON.stringify(mockData));
    
    return mockData;
};

const fetchCountryStatistics = async (countryCode) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return {
        totalGroups: Math.floor(Math.random() * 200) + 100,
        totalLenders: Math.floor(Math.random() * 1500) + 500,
        totalBorrowers: Math.floor(Math.random() * 8000) + 2000,
        totalAmountLent: Math.floor(Math.random() * 15000000) + 2000000,
        repaymentRate: 90 + Math.floor(Math.random() * 10),
        activeLoans: Math.floor(Math.random() * 800) + 200,
        monthlyGrowth: 5 + Math.random() * 10
    };
};

const logCountryViolation = async (violationData) => {
    const violations = JSON.parse(localStorage.getItem('mpesewa_country_violations') || '[]');
    violations.push({
        ...violationData,
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('mpesewa_country_violations', JSON.stringify(violations));
};

// Export actions and reducer
export const {
    setCountry,
    clearCountry,
    updateStatistics,
    recordViolation,
    resetViolations,
    calculateLoanTerms,
    getCountryInfo,
    isOperationAllowed
} = countrySlice.actions;

export default countrySlice.reducer;

/**
 * COUNTRY HIERARCHY ENFORCEMENT (Section A Strict Rules):
 * 
 * 1. 12 Sub-Saharan African countries supported
 * 2. Strict country isolation - no cross-country operations
 * 3. Country selection locked after registration
 * 4. Each country has dedicated dashboard and rules
 * 5. Country-specific currency operations
 * 6. Country flag badges displayed on all groups
 * 7. No cross-country lending or borrowing
 * 8. Each country can host unlimited groups
 * 9. Country-specific contact information
 * 10. Violation attempts are logged and blocked
 */