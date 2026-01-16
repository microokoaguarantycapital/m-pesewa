// Utility Functions for M-Pesewa

class MPesewaUtils {
    constructor() {
        this.countries = null;
        this.categories = null;
        this.currencies = null;
        this.init();
    }

    async init() {
        await this.loadConfigs();
        this.setupCurrencyFormatting();
        this.setupDateFormatters();
    }

    async loadConfigs() {
        try {
            // Load countries data
            const countriesRes = await fetch('data/countries.json');
            this.countries = await countriesRes.json();
            
            // Load categories data
            const categoriesRes = await fetch('data/categories.json');
            this.categories = await categoriesRes.json();
            
            // Set up currencies
            this.currencies = {
                'kenya': { code: 'KES', symbol: 'KSh', rate: 1 },
                'uganda': { code: 'UGX', symbol: 'UGX', rate: 0.0027 },
                'tanzania': { code: 'TZS', symbol: 'TSh', rate: 0.00043 },
                'rwanda': { code: 'RWF', symbol: 'RF', rate: 0.00081 },
                'burundi': { code: 'BIF', symbol: 'FBu', rate: 0.00051 },
                'somalia': { code: 'SOS', symbol: 'S', rate: 0.0017 },
                'south-sudan': { code: 'SSP', symbol: '£', rate: 0.0078 },
                'ethiopia': { code: 'ETB', symbol: 'Br', rate: 0.018 },
                'drc': { code: 'CDF', symbol: 'FC', rate: 0.00042 },
                'nigeria': { code: 'NGN', symbol: '₦', rate: 0.0012 },
                'south-africa': { code: 'ZAR', symbol: 'R', rate: 0.054 },
                'ghana': { code: 'GHS', symbol: 'GH₵', rate: 0.082 }
            };
        } catch (error) {
            console.error('Error loading configs:', error);
        }
    }

    setupCurrencyFormatting() {
        // Format currency based on country
        Number.prototype.formatCurrency = function(country = 'kenya') {
            const currency = this.currencies[country];
            if (!currency) return `${this.toFixed(2)}`;
            
            return `${currency.symbol} ${this.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
        };
        
        // Parse currency string
        String.prototype.parseCurrency = function() {
            return parseFloat(this.replace(/[^0-9.-]+/g, ''));
        };
    }

    setupDateFormatters() {
        // Format date to relative time
        Date.prototype.toRelativeTime = function() {
            const now = new Date();
            const diffMs = now - this;
            const diffSec = Math.floor(diffMs / 1000);
            const diffMin = Math.floor(diffSec / 60);
            const diffHour = Math.floor(diffMin / 60);
            const diffDay = Math.floor(diffHour / 24);
            
            if (diffDay > 7) {
                return this.toLocaleDateString();
            } else if (diffDay > 0) {
                return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
            } else if (diffHour > 0) {
                return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
            } else if (diffMin > 0) {
                return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
            } else {
                return 'Just now';
            }
        };
        
        // Format date for display
        Date.prototype.formatDate = function(format = 'medium') {
            const options = {
                'short': { dateStyle: 'short', timeStyle: 'short' },
                'medium': { dateStyle: 'medium', timeStyle: 'short' },
                'long': { dateStyle: 'long', timeStyle: 'short' }
            };
            
            return this.toLocaleString(undefined, options[format] || options.medium);
        };
    }

    // Format number with commas
    formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    // Calculate loan interest
    calculateInterest(amount, days = 7, interestRate = 10) {
        const interest = (amount * interestRate) / 100;
        const total = amount + interest;
        const dailyRepayment = total / days;
        
        return {
            principal: amount,
            interest: interest,
            total: total,
            daily: dailyRepayment,
            rate: interestRate
        };
    }

    // Calculate penalty
    calculatePenalty(amount, overdueDays, penaltyRate = 5) {
        const dailyPenalty = (amount * penaltyRate) / 100;
        return dailyPenalty * overdueDays;
    }

    // Validate loan amount based on tier
    validateLoanAmount(amount, tier) {
        const limits = {
            'basic': 1500,
            'premium': 5000,
            'super': 20000,
            'lender-of-lenders': 50000
        };
        
        const limit = limits[tier] || 1500;
        return amount <= limit;
    }

    // Generate unique ID
    generateId(prefix = '') {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substr(2, 9);
        return `${prefix}${timestamp}_${random}`;
    }

    // Debounce function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Throttle function
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Deep clone object
    deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    // Safe parse JSON
    safeParse(json, defaultValue = {}) {
        try {
            return JSON.parse(json);
        } catch {
            return defaultValue;
        }
    }

    // Get country info
    getCountryInfo(countryCode) {
        if (!this.countries) return null;
        
        const country = this.countries.find(c => c.code === countryCode);
        if (!country && this.countries[countryCode]) {
            return this.countries[countryCode];
        }
        return country;
    }

    // Get category info
    getCategoryInfo(categoryId) {
        if (!this.categories) return null;
        
        const category = this.categories.find(c => c.id === categoryId);
        if (!category && this.categories[categoryId]) {
            return this.categories[categoryId];
        }
        return category;
    }

    // Format phone number
    formatPhoneNumber(phone, countryCode = 'ke') {
        const formats = {
            'ke': /^(\d{3})(\d{3})(\d{3})$/,
            'ug': /^(\d{3})(\d{3})(\d{3})$/,
            'tz': /^(\d{3})(\d{3})(\d{3})$/
        };
        
        const format = formats[countryCode] || formats.ke;
        return phone.replace(format, '$1 $2 $3');
    }

    // Validate email
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Validate phone number
    validatePhone(phone, country = 'ke') {
        const patterns = {
            'ke': /^(\+254|0)[17]\d{8}$/,
            'ug': /^(\+256|0)\d{9}$/,
            'tz': /^(\+255|0)\d{9}$/,
            'rw': /^(\+250|0)\d{9}$/
        };
        
        const pattern = patterns[country] || /^\d{10,15}$/;
        return pattern.test(phone.replace(/\s+/g, ''));
    }

    // Calculate age from date of birth
    calculateAge(dob) {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        
        return age;
    }

    // Create data URL from file
    createDataURL(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    // Download file
    downloadFile(filename, content, type = 'text/plain') {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Copy to clipboard
    copyToClipboard(text) {
        return navigator.clipboard.writeText(text);
    }

    // Get query parameters
    getQueryParams() {
        const params = new URLSearchParams(window.location.search);
        const result = {};
        for (const [key, value] of params) {
            result[key] = value;
        }
        return result;
    }

    // Set query parameters
    setQueryParams(params) {
        const url = new URL(window.location);
        Object.keys(params).forEach(key => {
            url.searchParams.set(key, params[key]);
        });
        window.history.pushState({}, '', url);
    }

    // Remove query parameters
    removeQueryParams(keys) {
        const url = new URL(window.location);
        keys.forEach(key => url.searchParams.delete(key));
        window.history.pushState({}, '', url);
    }

    // Check if device is mobile
    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    // Check if device is iOS
    isIOS() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    }

    // Check if device is Android
    isAndroid() {
        return /Android/.test(navigator.userAgent);
    }

    // Check if PWA is installed
    isPWAInstalled() {
        return window.matchMedia('(display-mode: standalone)').matches || 
               window.navigator.standalone === true;
    }

    // Get device orientation
    getOrientation() {
        return window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
    }

    // Storage helpers
    storage = {
        set: (key, value) => {
            localStorage.setItem(key, JSON.stringify(value));
        },
        
        get: (key, defaultValue = null) => {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : defaultValue;
        },
        
        remove: (key) => {
            localStorage.removeItem(key);
        },
        
        clear: () => {
            localStorage.clear();
        }
    };

    // Session storage helpers
    session = {
        set: (key, value) => {
            sessionStorage.setItem(key, JSON.stringify(value));
        },
        
        get: (key, defaultValue = null) => {
            const value = sessionStorage.getItem(key);
            return value ? JSON.parse(value) : defaultValue;
        },
        
        remove: (key) => {
            sessionStorage.removeItem(key);
        },
        
        clear: () => {
            sessionStorage.clear();
        }
    };

    // Animation helpers
    animate(element, animation, duration = 300) {
        return new Promise((resolve) => {
            element.classList.add(animation);
            setTimeout(() => {
                element.classList.remove(animation);
                resolve();
            }, duration);
        });
    }

    // Scroll to element
    scrollTo(element, offset = 0) {
        const y = element.getBoundingClientRect().top + window.pageYOffset + offset;
        window.scrollTo({ top: y, behavior: 'smooth' });
    }

    // Show element with animation
    showElement(element, animation = 'fade-in') {
        element.style.display = 'block';
        return this.animate(element, animation);
    }

    // Hide element with animation
    hideElement(element, animation = 'fade-out') {
        return this.animate(element, animation).then(() => {
            element.style.display = 'none';
        });
    }
}

// Initialize utils
document.addEventListener('DOMContentLoaded', () => {
    window.utils = new MPesewaUtils();
});