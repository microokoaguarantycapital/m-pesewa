/**
 * South Sudan Currency Configuration
 * M-Pesewa - Emergency Micro-Lending in Trusted Circles
 * Country: South Sudan (SS)
 * Currency: South Sudanese Pound (SSP)
 * Strict Country Isolation: No cross-border lending/borrowing
 */

class SouthSudanCurrency {
    constructor() {
        this.countryCode = 'SS';
        this.countryName = 'South Sudan';
        this.currencyCode = 'SSP';
        this.currencyName = 'South Sudanese Pound';
        this.currencySymbol = '£';
        this.currencySymbolPosition = 'before';
        this.decimalSeparator = '.';
        this.thousandsSeparator = ',';
        this.decimalPlaces = 2;
        this.flagEmoji = '🇸🇸';
        
        // Exchange rates (as of latest update - would be updated via API in production)
        this.exchangeRates = {
            USD: 0.0078,    // 1 SSP = 0.0078 USD
            KES: 1.23,      // 1 SSP = 1.23 KES
            UGX: 28.5,      // 1 SSP = 28.5 UGX
            TZS: 18.2,      // 1 SSP = 18.2 TZS
            RWF: 9.8,       // 1 SSP = 9.8 RWF
            EUR: 0.0072,    // 1 SSP = 0.0072 EUR
            GBP: 0.0061,    // 1 SSP = 0.0061 GBP
        };
        
        // Historical exchange rate data
        this.historicalRates = {
            '2024-01': { USD: 0.0075, KES: 1.15 },
            '2024-02': { USD: 0.0076, KES: 1.18 },
            '2024-03': { USD: 0.0077, KES: 1.20 },
            '2024-04': { USD: 0.0078, KES: 1.23 },
        };
        
        // Currency formatting rules
        this.formattingRules = {
            display: {
                compact: true,
                showCurrencyCode: true,
                showSymbol: true,
                rounding: 'half-up'
            },
            input: {
                allowNegative: false,
                maxDigits: 12,
                minValue: 0.01,
                maxValue: 1000000
            },
            validation: {
                regex: /^[0-9]{1,9}(\.[0-9]{1,2})?$/,
                message: 'Please enter a valid SSP amount (max 999,999,999.99)'
            }
        };
        
        // Subscription tiers in SSP
        this.subscriptionTiers = {
            basic: {
                weeklyLimit: 1500,
                monthly: 50,
                biAnnual: 250,
                annual: 500,
                description: 'Basic Tier - Up to £1,500 SSP per week'
            },
            premium: {
                weeklyLimit: 5000,
                monthly: 250,
                biAnnual: 1500,
                annual: 2500,
                description: 'Premium Tier - Up to £5,000 SSP per week'
            },
            super: {
                weeklyLimit: 20000,
                monthly: 1000,
                biAnnual: 5000,
                annual: 8500,
                description: 'Super Tier - Up to £20,000 SSP per week'
            },
            lenderOfLenders: {
                weeklyLimit: 50000,
                monthly: 500,
                biAnnual: 3500,
                annual: 6500,
                description: 'Lender of Lenders - Up to £50,000 SSP'
            }
        };
        
        // Loan calculation parameters
        this.loanParameters = {
            interestRate: 0.10,          // 10% per week
            penaltyRate: 0.05,           // 5% daily after 7 days
            repaymentPeriod: 7,          // 7 days
            defaultPeriod: 60,           // 60 days (2 months)
            minLoanAmount: 5,            // Minimum 5 SSP
            maxLoanAmount: 20000,        // Maximum per loan (Super tier)
            partialRepayment: true,      // Allow partial daily repayments
            gracePeriod: 0               // No grace period
        };
        
        // Currency conversion cache
        this.conversionCache = new Map();
        this.cacheDuration = 5 * 60 * 1000; // 5 minutes
        
        // Currency symbols and their display
        this.symbols = {
            SSP: '£',
            USD: '$',
            KES: 'KSh',
            UGX: 'USh',
            TZS: 'TSh',
            RWF: 'RF',
            EUR: '€',
            GBP: '£'
        };
    }
    
    // Format currency for display
    format(amount, options = {}) {
        const {
            showSymbol = true,
            showCode = false,
            compact = false,
            decimalPlaces = this.decimalPlaces
        } = options;
        
        let formattedAmount;
        
        if (compact && amount >= 1000) {
            formattedAmount = this.formatCompact(amount, decimalPlaces);
        } else {
            formattedAmount = amount.toLocaleString('en-SS', {
                minimumFractionDigits: decimalPlaces,
                maximumFractionDigits: decimalPlaces
            });
        }
        
        let result = '';
        
        if (showSymbol && this.currencySymbolPosition === 'before') {
            result += this.currencySymbol;
        }
        
        result += formattedAmount;
        
        if (showSymbol && this.currencySymbolPosition === 'after') {
            result += this.currencySymbol;
        }
        
        if (showCode) {
            result += ` ${this.currencyCode}`;
        }
        
        return result;
    }
    
    // Format large amounts in compact form (1K, 1M, etc.)
    formatCompact(amount, decimalPlaces = 1) {
        const units = ['', 'K', 'M', 'B'];
        let unitIndex = 0;
        let num = amount;
        
        while (num >= 1000 && unitIndex < units.length - 1) {
            num /= 1000;
            unitIndex++;
        }
        
        return num.toFixed(decimalPlaces) + units[unitIndex];
    }
    
    // Parse currency string to number
    parse(currencyString) {
        if (typeof currencyString !== 'string') {
            return Number(currencyString) || 0;
        }
        
        // Remove currency symbols and thousands separators
        let cleaned = currencyString
            .replace(new RegExp(`[${this.currencySymbol}$€£¥]`, 'g'), '')
            .replace(new RegExp(this.thousandsSeparator, 'g'), '')
            .replace(this.decimalSeparator, '.')
            .trim();
        
        // Remove non-numeric characters except decimal point
        cleaned = cleaned.replace(/[^0-9.]/g, '');
        
        const parsed = parseFloat(cleaned);
        return isNaN(parsed) ? 0 : parsed;
    }
    
    // Validate currency amount
    validate(amount, options = {}) {
        const {
            min = this.formattingRules.input.minValue,
            max = this.formattingRules.input.maxValue,
            allowNegative = this.formattingRules.input.allowNegative
        } = options;
        
        const errors = [];
        
        if (typeof amount !== 'number' || isNaN(amount)) {
            errors.push('Amount must be a valid number');
        }
        
        if (!allowNegative && amount < 0) {
            errors.push('Amount cannot be negative');
        }
        
        if (amount < min) {
            errors.push(`Amount must be at least ${this.format(min)}`);
        }
        
        if (amount > max) {
            errors.push(`Amount cannot exceed ${this.format(max)}`);
        }
        
        if (amount.toString().length > this.formattingRules.input.maxDigits) {
            errors.push(`Amount is too large (max ${this.formattingRules.input.maxDigits} digits)`);
        }
        
        const regex = this.formattingRules.validation.regex;
        if (!regex.test(amount.toFixed(this.decimalPlaces))) {
            errors.push(this.formattingRules.validation.message);
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors,
            formatted: this.format(amount)
        };
    }
    
    // Convert between currencies
    async convert(amount, fromCurrency, toCurrency = 'SSP') {
        if (fromCurrency === toCurrency) {
            return amount;
        }
        
        const cacheKey = `${fromCurrency}_${toCurrency}_${amount}`;
        const cached = this.conversionCache.get(cacheKey);
        
        if (cached && Date.now() - cached.timestamp < this.cacheDuration) {
            return cached.value;
        }
        
        try {
            const rate = await this.getExchangeRate(fromCurrency, toCurrency);
            const converted = amount * rate;
            
            this.conversionCache.set(cacheKey, {
                value: converted,
                timestamp: Date.now()
            });
            
            return converted;
        } catch (error) {
            console.error('Currency conversion failed:', error);
            throw new Error(`Failed to convert ${fromCurrency} to ${toCurrency}`);
        }
    }
    
    // Get exchange rate
    async getExchangeRate(fromCurrency, toCurrency = 'SSP') {
        if (fromCurrency === toCurrency) {
            return 1;
        }
        
        // In production, this would fetch from an API
        // For now, use static rates
        
        if (toCurrency === 'SSP') {
            // Convert to SSP
            if (this.exchangeRates[fromCurrency]) {
                return 1 / this.exchangeRates[fromCurrency];
            }
        } else if (fromCurrency === 'SSP') {
            // Convert from SSP
            if (this.exchangeRates[toCurrency]) {
                return this.exchangeRates[toCurrency];
            }
        } else {
            // Convert between two non-SSP currencies via SSP
            const toSSP = await this.getExchangeRate(fromCurrency, 'SSP');
            const fromSSP = await this.getExchangeRate('SSP', toCurrency);
            return toSSP * fromSSP;
        }
        
        throw new Error(`Exchange rate not available for ${fromCurrency} to ${toCurrency}`);
    }
    
    // Calculate loan details
    calculateLoan(principal, days = 7) {
        if (days > this.loanParameters.repaymentPeriod) {
            throw new Error(`Loan period cannot exceed ${this.loanParameters.repaymentPeriod} days`);
        }
        
        const interest = principal * this.loanParameters.interestRate;
        const totalAmount = principal + interest;
        const dailyRepayment = totalAmount / this.loanParameters.repaymentPeriod;
        
        // Calculate penalty if applicable
        let penalty = 0;
        let daysOverdue = 0;
        
        if (days > this.loanParameters.repaymentPeriod) {
            daysOverdue = days - this.loanParameters.repaymentPeriod;
            penalty = totalAmount * this.loanParameters.penaltyRate * daysOverdue;
        }
        
        const totalDue = totalAmount + penalty;
        
        return {
            principal: this.format(principal),
            interest: this.format(interest),
            totalAmount: this.format(totalAmount),
            dailyRepayment: this.format(dailyRepayment),
            penalty: this.format(penalty),
            daysOverdue: daysOverdue,
            totalDue: this.format(totalDue),
            breakdown: {
                principal: principal,
                interest: interest,
                penalty: penalty,
                total: totalDue
            }
        };
    }
    
    // Calculate subscription cost
    calculateSubscription(tier, period = 'monthly') {
        const tierData = this.subscriptionTiers[tier];
        
        if (!tierData) {
            throw new Error(`Invalid subscription tier: ${tier}`);
        }
        
        const amount = tierData[period];
        
        if (!amount) {
            throw new Error(`Invalid period: ${period}. Must be monthly, biAnnual, or annual`);
        }
        
        return {
            tier: tier,
            period: period,
            amount: amount,
            formatted: this.format(amount),
            weeklyLimit: tierData.weeklyLimit,
            formattedLimit: this.format(tierData.weeklyLimit),
            description: tierData.description
        };
    }
    
    // Generate currency input field
    createCurrencyInput(options = {}) {
        const {
            id = 'currency-input',
            name = 'amount',
            value = 0,
            min = this.formattingRules.input.minValue,
            max = this.formattingRules.input.maxValue,
            placeholder = 'Enter amount',
            required = true,
            disabled = false,
            className = 'currency-input-ss'
        } = options;
        
        const input = document.createElement('input');
        input.type = 'text';
        input.id = id;
        input.name = name;
        input.value = this.format(value, { showSymbol: false });
        input.placeholder = placeholder;
        input.required = required;
        input.disabled = disabled;
        input.className = className;
        
        input.setAttribute('data-currency', 'SSP');
        input.setAttribute('data-min', min);
        input.setAttribute('data-max', max);
        input.setAttribute('inputmode', 'decimal');
        input.setAttribute('pattern', this.formattingRules.validation.regex.source);
        
        // Add event listeners for formatting
        input.addEventListener('input', this.handleCurrencyInput.bind(this));
        input.addEventListener('blur', this.handleCurrencyBlur.bind(this));
        input.addEventListener('focus', this.handleCurrencyFocus.bind(this));
        
        return input;
    }
    
    handleCurrencyInput(event) {
        const input = event.target;
        let value = input.value;
        
        // Remove non-numeric characters except decimal point
        value = value.replace(/[^0-9.]/g, '');
        
        // Ensure only one decimal point
        const parts = value.split('.');
        if (parts.length > 2) {
            value = parts[0] + '.' + parts.slice(1).join('');
        }
        
        // Limit decimal places
        if (parts.length === 2 && parts[1].length > this.decimalPlaces) {
            value = parts[0] + '.' + parts[1].substring(0, this.decimalPlaces);
        }
        
        input.value = value;
    }
    
    handleCurrencyBlur(event) {
        const input = event.target;
        const value = this.parse(input.value);
        const validation = this.validate(value);
        
        if (validation.isValid) {
            input.value = this.format(value, { showSymbol: false });
            input.classList.remove('error');
            input.setAttribute('aria-invalid', 'false');
        } else {
            input.classList.add('error');
            input.setAttribute('aria-invalid', 'true');
            input.setAttribute('title', validation.errors.join('\n'));
        }
    }
    
    handleCurrencyFocus(event) {
        const input = event.target;
        input.removeAttribute('title');
    }
    
    // Create currency display element
    createCurrencyDisplay(amount, options = {}) {
        const {
            id = 'currency-display',
            showSymbol = true,
            showCode = false,
            compact = false,
            className = 'currency-display-ss'
        } = options;
        
        const display = document.createElement('span');
        display.id = id;
        display.className = className;
        display.textContent = this.format(amount, { showSymbol, showCode, compact });
        display.setAttribute('data-amount', amount);
        display.setAttribute('data-currency', 'SSP');
        
        return display;
    }
    
    // Initialize currency system
    initialize() {
        // Add CSS for currency elements
        this.addCurrencyStyles();
        
        // Initialize currency inputs
        this.initializeCurrencyInputs();
        
        // Initialize currency displays
        this.initializeCurrencyDisplays();
        
        // Set up periodic exchange rate updates
        this.setupExchangeRateUpdates();
        
        // Dispatch initialization event
        window.dispatchEvent(new CustomEvent('mpesewa:currency:initialized', {
            detail: { country: 'SS', currency: this }
        }));
    }
    
    addCurrencyStyles() {
        const style = document.createElement('style');
        style.textContent = this.generateCurrencyCSS();
        document.head.appendChild(style);
    }
    
    generateCurrencyCSS() {
        return `
            /* South Sudan Currency Styles */
            .currency-input-ss {
                font-family: 'Inter', sans-serif;
                font-size: 1rem;
                padding: 12px 16px;
                border: 2px solid #e2e8f0;
                border-radius: 8px;
                width: 100%;
                transition: all 0.2s ease;
                background: white;
                color: #003366;
            }
            
            .currency-input-ss:focus {
                outline: none;
                border-color: #0099ff;
                box-shadow: 0 0 0 3px rgba(0, 153, 255, 0.1);
            }
            
            .currency-input-ss.error {
                border-color: #dc3545;
                background-color: rgba(220, 53, 69, 0.05);
            }
            
            .currency-input-ss.error:focus {
                box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
            }
            
            .currency-input-ss:disabled {
                background-color: #f8f9fa;
                color: #6c757d;
                cursor: not-allowed;
            }
            
            .currency-display-ss {
                font-family: 'Poppins', sans-serif;
                font-weight: 600;
                color: #003366;
                font-size: 1.125rem;
            }
            
            .currency-display-ss.large {
                font-size: 1.5rem;
                font-weight: 700;
            }
            
            .currency-display-ss.x-large {
                font-size: 2rem;
                font-weight: 700;
                color: #da121a;
            }
            
            .currency-display-ss.compact {
                font-size: 0.875rem;
                color: #6c757d;
            }
            
            .currency-display-ss::before {
                content: "£";
                margin-right: 2px;
                color: #078930;
                font-weight: 700;
            }
            
            .currency-badge-ss {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                padding: 6px 12px;
                background: linear-gradient(135deg, #da121a 0%, #0f47af 50%, #078930 100%);
                color: white;
                border-radius: 20px;
                font-size: 0.875rem;
                font-weight: 600;
            }
            
            .currency-badge-ss::before {
                content: "🇸🇸";
                font-size: 1.1em;
            }
            
            .currency-badge-ss::after {
                content: "SSP";
                margin-left: 4px;
                opacity: 0.9;
            }
            
            .currency-converter-ss {
                display: flex;
                flex-direction: column;
                gap: 12px;
                padding: 20px;
                background: #f8f9fa;
                border-radius: 12px;
                border: 1px solid #e2e8f0;
            }
            
            .currency-converter-ss .input-group {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            
            .currency-converter-ss select {
                padding: 8px 12px;
                border: 2px solid #e2e8f0;
                border-radius: 6px;
                background: white;
                color: #003366;
                font-weight: 500;
                min-width: 100px;
            }
            
            .currency-rate-display-ss {
                font-size: 0.875rem;
                color: #6c757d;
                padding: 8px;
                background: white;
                border-radius: 6px;
                border: 1px solid #e2e8f0;
            }
            
            .loan-calculator-ss {
                background: white;
                border-radius: 12px;
                border: 2px solid #0099ff;
                padding: 24px;
                box-shadow: 0 4px 6px -1px rgba(0, 51, 102, 0.1);
            }
            
            .loan-calculator-ss h3 {
                color: #003366;
                margin-bottom: 20px;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .loan-calculator-ss h3::before {
                content: "£";
                color: #078930;
                font-size: 1.5em;
            }
            
            .loan-breakdown-ss {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 16px;
                margin-top: 20px;
            }
            
            .loan-item-ss {
                display: flex;
                justify-content: space-between;
                padding: 12px;
                background: #f8f9fa;
                border-radius: 8px;
            }
            
            .loan-item-ss.total {
                grid-column: span 2;
                background: #003366;
                color: white;
                font-weight: 600;
            }
            
            .subscription-tier-ss {
                border: 2px solid #e2e8f0;
                border-radius: 12px;
                padding: 20px;
                transition: all 0.3s ease;
                cursor: pointer;
            }
            
            .subscription-tier-ss:hover {
                border-color: #0099ff;
                transform: translateY(-4px);
                box-shadow: 0 10px 15px -3px rgba(0, 153, 255, 0.1);
            }
            
            .subscription-tier-ss.selected {
                border-color: #28a745;
                background: rgba(40, 167, 69, 0.05);
            }
            
            .subscription-price-ss {
                font-size: 1.5rem;
                font-weight: 700;
                color: #003366;
                margin: 10px 0;
            }
            
            .subscription-price-ss::before {
                content: "£";
                color: #078930;
                margin-right: 4px;
            }
            
            @media (max-width: 768px) {
                .loan-breakdown-ss {
                    grid-template-columns: 1fr;
                }
                
                .loan-item-ss.total {
                    grid-column: span 1;
                }
            }
            
            @media (prefers-contrast: high) {
                .currency-input-ss {
                    border: 3px solid black;
                }
                
                .currency-display-ss {
                    font-weight: 900;
                }
            }
            
            @media (prefers-reduced-motion: reduce) {
                .subscription-tier-ss:hover {
                    transform: none;
                }
            }
        `;
    }
    
    initializeCurrencyInputs() {
        // Auto-initialize existing currency inputs
        document.querySelectorAll('input[type="number"][data-currency="SSP"]').forEach(input => {
            const currencyInput = this.createCurrencyInput({
                id: input.id,
                name: input.name,
                value: parseFloat(input.value) || 0,
                min: parseFloat(input.min) || this.formattingRules.input.minValue,
                max: parseFloat(input.max) || this.formattingRules.input.maxValue,
                placeholder: input.placeholder,
                required: input.required,
                disabled: input.disabled
            });
            
            input.parentNode.replaceChild(currencyInput, input);
        });
    }
    
    initializeCurrencyDisplays() {
        // Format existing currency displays
        document.querySelectorAll('[data-currency-display="SSP"]').forEach(display => {
            const amount = parseFloat(display.textContent) || 
                          parseFloat(display.getAttribute('data-amount')) || 0;
            const options = {
                showSymbol: display.dataset.showSymbol !== 'false',
                showCode: display.dataset.showCode === 'true',
                compact: display.dataset.compact === 'true',
                className: display.className
            };
            
            const formattedDisplay = this.createCurrencyDisplay(amount, options);
            display.parentNode.replaceChild(formattedDisplay, display);
        });
    }
    
    setupExchangeRateUpdates() {
        // Update exchange rates periodically
        setInterval(async () => {
            try {
                await this.updateExchangeRates();
            } catch (error) {
                console.warn('Failed to update exchange rates:', error);
            }
        }, 15 * 60 * 1000); // Every 15 minutes
        
        // Initial update
        this.updateExchangeRates();
    }
    
    async updateExchangeRates() {
        // In production, this would fetch from an API
        // For now, simulate with random minor fluctuations
        Object.keys(this.exchangeRates).forEach(currency => {
            const current = this.exchangeRates[currency];
            const fluctuation = (Math.random() - 0.5) * 0.0002; // ±0.02%
            this.exchangeRates[currency] = current + fluctuation;
        });
        
        // Clear conversion cache
        this.conversionCache.clear();
        
        // Dispatch update event
        window.dispatchEvent(new CustomEvent('mpesewa:currency:ratesUpdated', {
            detail: { rates: this.exchangeRates }
        }));
    }
    
    // Get currency configuration
    getConfig() {
        return {
            countryCode: this.countryCode,
            countryName: this.countryName,
            currencyCode: this.currencyCode,
            currencyName: this.currencyName,
            currencySymbol: this.currencySymbol,
            exchangeRates: this.exchangeRates,
            subscriptionTiers: this.subscriptionTiers,
            loanParameters: this.loanParameters,
            formattingRules: this.formattingRules
        };
    }
    
    // Validate currency configuration
    validateConfig() {
        const errors = [];
        
        if (!this.currencyCode) errors.push('Currency code is required');
        if (!this.currencySymbol) errors.push('Currency symbol is required');
        if (this.decimalPlaces < 0 || this.decimalPlaces > 4) {
            errors.push('Decimal places must be between 0 and 4');
        }
        
        // Validate subscription tiers
        Object.entries(this.subscriptionTiers).forEach(([tier, data]) => {
            if (data.weeklyLimit <= 0) {
                errors.push(`${tier} tier: weekly limit must be positive`);
            }
            if (data.monthly <= 0 || data.biAnnual <= 0 || data.annual <= 0) {
                errors.push(`${tier} tier: subscription amounts must be positive`);
            }
        });
        
        // Validate loan parameters
        if (this.loanParameters.interestRate <= 0) {
            errors.push('Interest rate must be positive');
        }
        if (this.loanParameters.penaltyRate <= 0) {
            errors.push('Penalty rate must be positive');
        }
        if (this.loanParameters.repaymentPeriod <= 0) {
            errors.push('Repayment period must be positive');
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }
}

// Export for module system
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SouthSudanCurrency;
} else {
    // Browser global
    window.SouthSudanCurrency = SouthSudanCurrency;
}

// Auto-initialize if script is loaded in browser
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function() {
        // Check if we're in South Sudan context
        const currentCountry = localStorage.getItem('mpesewa_country') || 
                               new URLSearchParams(window.location.search).get('country');
        
        if (currentCountry === 'SS' || window.location.pathname.includes('/ss/')) {
            const ssCurrency = new SouthSudanCurrency();
            ssCurrency.initialize();
            
            // Store for global access
            window.mpesewaCurrency = ssCurrency;
            
            // Add to global M-Pesewa object
            if (!window.mpesewa) window.mpesewa = {};
            window.mpesewa.currency = ssCurrency;
        }
    });
}