// assets/js/utils.js - Utility functions for M-Pesewa PWA

// ====== DATA UTILITIES ======
const DataUtils = {
    // Deep clone an object
    deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    },
    
    // Merge objects deeply
    deepMerge(target, ...sources) {
        if (!sources.length) return target;
        const source = sources.shift();
        
        if (this.isObject(target) && this.isObject(source)) {
            for (const key in source) {
                if (this.isObject(source[key])) {
                    if (!target[key]) Object.assign(target, { [key]: {} });
                    this.deepMerge(target[key], source[key]);
                } else {
                    Object.assign(target, { [key]: source[key] });
                }
            }
        }
        
        return this.deepMerge(target, ...sources);
    },
    
    // Check if value is an object
    isObject(item) {
        return item && typeof item === 'object' && !Array.isArray(item);
    },
    
    // Filter object by keys
    filterObject(obj, keys) {
        return Object.keys(obj)
            .filter(key => keys.includes(key))
            .reduce((filtered, key) => {
                filtered[key] = obj[key];
                return filtered;
            }, {});
    },
    
    // Sort array of objects by key
    sortByKey(array, key, order = 'asc') {
        return array.sort((a, b) => {
            let valA = a[key];
            let valB = b[key];
            
            // Handle different data types
            if (typeof valA === 'string') valA = valA.toLowerCase();
            if (typeof valB === 'string') valB = valB.toLowerCase();
            
            if (order === 'asc') {
                return valA > valB ? 1 : valA < valB ? -1 : 0;
            } else {
                return valA < valB ? 1 : valA > valB ? -1 : 0;
            }
        });
    },
    
    // Group array of objects by key
    groupBy(array, key) {
        return array.reduce((grouped, item) => {
            const groupKey = item[key];
            if (!grouped[groupKey]) {
                grouped[groupKey] = [];
            }
            grouped[groupKey].push(item);
            return grouped;
        }, {});
    },
    
    // Remove duplicates from array
    removeDuplicates(array, key) {
        const seen = new Set();
        return array.filter(item => {
            const value = key ? item[key] : item;
            if (seen.has(value)) {
                return false;
            }
            seen.add(value);
            return true;
        });
    },
    
    // Paginate array
    paginate(array, page = 1, perPage = 10) {
        const start = (page - 1) * perPage;
        const end = start + perPage;
        return {
            data: array.slice(start, end),
            page,
            perPage,
            total: array.length,
            totalPages: Math.ceil(array.length / perPage)
        };
    },
    
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
    },
    
    // Throttle function
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};

// ====== FORMATTING UTILITIES ======
const FormatUtils = {
    // Format currency
    formatCurrency(amount, currency = 'KES', locale = 'en-KE') {
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency
        }).format(amount);
    },
    
    // Format number with commas
    formatNumber(number, locale = 'en-KE') {
        return new Intl.NumberFormat(locale).format(number);
    },
    
    // Format date
    formatDate(date, format = 'medium') {
        const dateObj = new Date(date);
        
        const formats = {
            short: {
                dateStyle: 'short',
                timeStyle: 'short'
            },
            medium: {
                dateStyle: 'medium',
                timeStyle: 'short'
            },
            long: {
                dateStyle: 'long',
                timeStyle: 'short'
            },
            dateOnly: {
                dateStyle: 'medium',
                timeStyle: undefined
            }
        };
        
        return new Intl.DateTimeFormat('en-KE', formats[format] || formats.medium).format(dateObj);
    },
    
    // Format relative time (e.g., "2 days ago")
    formatRelativeTime(date) {
        const now = new Date();
        const past = new Date(date);
        const diffMs = now - past;
        const diffSec = Math.floor(diffMs / 1000);
        const diffMin = Math.floor(diffSec / 60);
        const diffHour = Math.floor(diffMin / 60);
        const diffDay = Math.floor(diffHour / 24);
        
        if (diffSec < 60) return 'just now';
        if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
        if (diffHour < 24) return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
        if (diffDay < 7) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
        
        return this.formatDate(date, 'medium');
    },
    
    // Format phone number
    formatPhone(phone, countryCode = 'KE') {
        if (!phone) return '';
        
        // Remove all non-numeric characters
        const cleaned = phone.toString().replace(/\D/g, '');
        
        const formats = {
            'KE': (num) => {
                if (num.startsWith('254')) {
                    return `+254 ${num.slice(3, 6)} ${num.slice(6, 9)} ${num.slice(9)}`;
                } else if (num.startsWith('07')) {
                    return `+254 ${num.slice(1, 4)} ${num.slice(4, 7)} ${num.slice(7)}`;
                }
                return num;
            },
            'UG': (num) => {
                if (num.startsWith('256')) {
                    return `+256 ${num.slice(3, 6)} ${num.slice(6, 9)} ${num.slice(9)}`;
                }
                return num;
            },
            'TZ': (num) => {
                if (num.startsWith('255')) {
                    return `+255 ${num.slice(3, 6)} ${num.slice(6, 9)} ${num.slice(9)}`;
                }
                return num;
            }
        };
        
        const formatter = formats[countryCode] || formats['KE'];
        return formatter(cleaned);
    },
    
    // Truncate text
    truncate(text, maxLength = 100, suffix = '...') {
        if (text.length <= maxLength) return text;
        return text.substr(0, maxLength - suffix.length) + suffix;
    },
    
    // Format file size
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },
    
    // Mask sensitive information
    maskInfo(text, visibleChars = 4, maskChar = '*') {
        if (!text) return '';
        if (text.length <= visibleChars * 2) return maskChar.repeat(text.length);
        
        const start = text.slice(0, visibleChars);
        const end = text.slice(-visibleChars);
        const middle = maskChar.repeat(text.length - (visibleChars * 2));
        
        return start + middle + end;
    },
    
    // Format percentage
    formatPercent(value, decimals = 2) {
        return `${parseFloat(value).toFixed(decimals)}%`;
    },
    
    // Format duration
    formatDuration(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        const parts = [];
        if (hours > 0) parts.push(`${hours}h`);
        if (minutes > 0) parts.push(`${minutes}m`);
        if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);
        
        return parts.join(' ');
    }
};

// ====== VALIDATION UTILITIES ======
const ValidationUtils = {
    // Validate email
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },
    
    // Validate phone number (Kenya format)
    validatePhoneKE(phone) {
        const re = /^(?:254|\+254|0)?(7[0-9]{8})$/;
        return re.test(phone);
    },
    
    // Validate phone number (general)
    validatePhone(phone, countryCode = 'KE') {
        const patterns = {
            'KE': /^(?:254|\+254|0)?(7[0-9]{8})$/,
            'UG': /^(?:256|\+256|0)?(7[0-9]{8})$/,
            'TZ': /^(?:255|\+255|0)?(6[0-9]{8}|7[0-9]{8})$/,
            'RW': /^(?:250|\+250|0)?(7[0-9]{8})$/,
            'NG': /^(?:234|\+234|0)?(8[0-9]{9}|7[0-9]{9})$/,
            'GH': /^(?:233|\+233|0)?(5[0-9]{8})$/,
            'ZA': /^(?:27|\+27|0)?(6[0-9]{8}|7[0-9]{8})$/
        };
        
        const pattern = patterns[countryCode] || /^[0-9+\-\s()]{10,15}$/;
        return pattern.test(phone);
    },
    
    // Validate ID number (Kenya format)
    validateIdKE(id) {
        const re = /^[0-9]{1,9}$/;
        return re.test(id);
    },
    
    // Validate password
    validatePassword(password) {
        // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
        const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        return re.test(password);
    },
    
    // Validate URL
    validateURL(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    },
    
    // Validate date
    validateDate(date) {
        const d = new Date(date);
        return d instanceof Date && !isNaN(d);
    },
    
    // Validate number range
    validateNumberRange(value, min, max) {
        const num = parseFloat(value);
        return !isNaN(num) && num >= min && num <= max;
    },
    
    // Validate required fields
    validateRequired(fields, data) {
        const errors = [];
        
        fields.forEach(field => {
            const value = data[field];
            if (value === undefined || value === null || value === '') {
                errors.push(field);
            }
        });
        
        return {
            isValid: errors.length === 0,
            errors
        };
    },
    
    // Validate loan amount against tier limits
    validateLoanAmount(amount, tier) {
        const tierLimits = {
            'basic': 1500,
            'premium': 5000,
            'super': 20000,
            'lender-of-lenders': 50000
        };
        
        const limit = tierLimits[tier] || 1500;
        return parseFloat(amount) <= limit && parseFloat(amount) >= 5;
    },
    
    // Validate loan duration
    validateLoanDuration(days) {
        return days >= 1 && days <= 7;
    }
};

// ====== STORAGE UTILITIES ======
const StorageUtils = {
    // Prefix for all localStorage keys
    prefix: 'mPesewa_',
    
    // Get item from localStorage
    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(this.prefix + key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return defaultValue;
        }
    },
    
    // Set item in localStorage
    set(key, value) {
        try {
            localStorage.setItem(this.prefix + key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Error writing to localStorage:', error);
            return false;
        }
    },
    
    // Remove item from localStorage
    remove(key) {
        try {
            localStorage.removeItem(this.prefix + key);
            return true;
        } catch (error) {
            console.error('Error removing from localStorage:', error);
            return false;
        }
    },
    
    // Clear all app data from localStorage
    clearAll() {
        try {
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith(this.prefix)) {
                    localStorage.removeItem(key);
                }
            });
            return true;
        } catch (error) {
            console.error('Error clearing localStorage:', error);
            return false;
        }
    },
    
    // Check if key exists
    has(key) {
        return localStorage.getItem(this.prefix + key) !== null;
    },
    
    // Get all keys
    keys() {
        return Object.keys(localStorage)
            .filter(key => key.startsWith(this.prefix))
            .map(key => key.replace(this.prefix, ''));
    },
    
    // Get storage usage
    getUsage() {
        let total = 0;
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith(this.prefix)) {
                total += localStorage.getItem(key).length;
            }
        });
        return {
            bytes: total,
            kilobytes: total / 1024,
            megabytes: total / (1024 * 1024)
        };
    }
};

// ====== DOM UTILITIES ======
const DomUtils = {
    // Create element with attributes
    create(tag, attributes = {}, children = []) {
        const element = document.createElement(tag);
        
        // Set attributes
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'textContent') {
                element.textContent = value;
            } else if (key === 'innerHTML') {
                element.innerHTML = value;
            } else if (key.startsWith('on')) {
                element.addEventListener(key.slice(2).toLowerCase(), value);
            } else {
                element.setAttribute(key, value);
            }
        });
        
        // Append children
        children.forEach(child => {
            if (typeof child === 'string') {
                element.appendChild(document.createTextNode(child));
            } else if (child instanceof Node) {
                element.appendChild(child);
            }
        });
        
        return element;
    },
    
    // Show element
    show(element) {
        if (element) element.style.display = '';
    },
    
    // Hide element
    hide(element) {
        if (element) element.style.display = 'none';
    },
    
    // Toggle element visibility
    toggle(element, force) {
        if (element) {
            if (force !== undefined) {
                element.style.display = force ? '' : 'none';
            } else {
                element.style.display = element.style.display === 'none' ? '' : 'none';
            }
        }
    },
    
    // Add class
    addClass(element, className) {
        if (element) element.classList.add(className);
    },
    
    // Remove class
    removeClass(element, className) {
        if (element) element.classList.remove(className);
    },
    
    // Toggle class
    toggleClass(element, className, force) {
        if (element) element.classList.toggle(className, force);
    },
    
    // Get element by selector with optional parent
    $(selector, parent = document) {
        return parent.querySelector(selector);
    },
    
    // Get all elements by selector with optional parent
    $$(selector, parent = document) {
        return Array.from(parent.querySelectorAll(selector));
    },
    
    // Get parent with class
    closest(element, className) {
        while (element && element !== document) {
            if (element.classList && element.classList.contains(className)) {
                return element;
            }
            element = element.parentNode;
        }
        return null;
    },
    
    // Dispatch custom event
    dispatch(eventName, detail = {}, element = document) {
        const event = new CustomEvent(eventName, { detail });
        element.dispatchEvent(event);
    },
    
    // Wait for element to exist
    waitForElement(selector, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const element = document.querySelector(selector);
            if (element) {
                resolve(element);
                return;
            }
            
            const observer = new MutationObserver(() => {
                const element = document.querySelector(selector);
                if (element) {
                    observer.disconnect();
                    resolve(element);
                }
            });
            
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
            
            setTimeout(() => {
                observer.disconnect();
                reject(new Error(`Element ${selector} not found within ${timeout}ms`));
            }, timeout);
        });
    },
    
    // Scroll to element
    scrollTo(element, offset = 0, behavior = 'smooth') {
        if (element) {
            const top = element.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({
                top,
                behavior
            });
        }
    },
    
    // Debounced resize listener
    onResize(callback, delay = 250) {
        let timeout;
        const handler = () => {
            clearTimeout(timeout);
            timeout = setTimeout(callback, delay);
        };
        window.addEventListener('resize', handler);
        return () => window.removeEventListener('resize', handler);
    }
};

// ====== CALCULATION UTILITIES ======
const CalculationUtils = {
    // Calculate loan interest
    calculateInterest(principal, rate = 0.10, days = 7) {
        return principal * rate; // 10% fixed for 7 days
    },
    
    // Calculate total loan amount
    calculateTotalLoan(principal, rate = 0.10) {
        return principal + this.calculateInterest(principal, rate);
    },
    
    // Calculate daily repayment
    calculateDailyRepayment(principal, rate = 0.10, days = 7) {
        return this.calculateTotalLoan(principal, rate) / days;
    },
    
    // Calculate penalty
    calculatePenalty(outstanding, rate = 0.05, daysOverdue = 1) {
        return outstanding * rate * daysOverdue; // 5% daily penalty
    },
    
    // Calculate days between dates
    calculateDaysBetween(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end - start);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    },
    
    // Calculate due date from loan date
    calculateDueDate(loanDate, days = 7) {
        const date = new Date(loanDate);
        date.setDate(date.getDate() + days);
        return date;
    },
    
    // Check if loan is overdue
    isOverdue(dueDate) {
        const due = new Date(dueDate);
        const now = new Date();
        return now > due;
    },
    
    // Calculate overdue days
    calculateOverdueDays(dueDate) {
        if (!this.isOverdue(dueDate)) return 0;
        
        const due = new Date(dueDate);
        const now = new Date();
        const diffTime = now - due;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    },
    
    // Calculate subscription expiry date (28th of next month)
    calculateSubscriptionExpiry(startDate) {
        const start = new Date(startDate);
        let year = start.getFullYear();
        let month = start.getMonth() + 1; // Next month
        
        if (month === 12) {
            month = 1;
            year++;
        } else {
            month++;
        }
        
        // Always expire on 28th
        return new Date(year, month - 1, 28);
    },
    
    // Calculate days until expiry
    calculateDaysUntilExpiry(expiryDate) {
        const expiry = new Date(expiryDate);
        const now = new Date();
        const diffTime = expiry - now;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    },
    
    // Calculate repayment progress
    calculateRepaymentProgress(amountPaid, totalAmount) {
        if (totalAmount <= 0) return 0;
        return Math.min((amountPaid / totalAmount) * 100, 100);
    },
    
    // Calculate risk score (0-100)
    calculateRiskScore(repaymentHistory, overdueLoans, rating) {
        let score = 100;
        
        // Deduct for overdue loans
        score -= overdueLoans * 20;
        
        // Adjust based on rating (5-star = 100%, 1-star = 20%)
        const ratingMultiplier = rating / 5;
        score *= ratingMultiplier;
        
        // Ensure score is between 0 and 100
        return Math.max(0, Math.min(100, Math.round(score)));
    }
};

// ====== NETWORK UTILITIES ======
const NetworkUtils = {
    // Check if online
    isOnline() {
        return navigator.onLine;
    },
    
    // Check connection type
    getConnectionType() {
        return navigator.connection ? navigator.connection.effectiveType : 'unknown';
    },
    
    // Fetch with timeout
    async fetchWithTimeout(url, options = {}, timeout = 10000) {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);
        
        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal
            });
            clearTimeout(id);
            return response;
        } catch (error) {
            clearTimeout(id);
            throw error;
        }
    },
    
    // Retry fetch with exponential backoff
    async fetchWithRetry(url, options = {}, maxRetries = 3, baseDelay = 1000) {
        let lastError;
        
        for (let i = 0; i < maxRetries; i++) {
            try {
                return await this.fetchWithTimeout(url, options);
            } catch (error) {
                lastError = error;
                
                if (i < maxRetries - 1) {
                    const delay = baseDelay * Math.pow(2, i);
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
        }
        
        throw lastError;
    },
    
    // Load JSON file
    async loadJSON(url) {
        try {
            const response = await this.fetchWithRetry(url);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error loading JSON:', error);
            throw error;
        }
    },
    
    // Check if URL exists
    async urlExists(url) {
        try {
            const response = await fetch(url, { method: 'HEAD' });
            return response.ok;
        } catch {
            return false;
        }
    },
    
    // Get file extension from URL
    getFileExtension(url) {
        return url.split('.').pop().split('?')[0];
    }
};

// ====== COUNTRY UTILITIES ======
const CountryUtils = {
    // Country data
    countries: {
        'KE': { name: 'Kenya', currency: 'KES', symbol: 'KSh', phoneCode: '+254', flag: '🇰🇪' },
        'UG': { name: 'Uganda', currency: 'UGX', symbol: 'UGX', phoneCode: '+256', flag: '🇺🇬' },
        'TZ': { name: 'Tanzania', currency: 'TZS', symbol: 'TSh', phoneCode: '+255', flag: '🇹🇿' },
        'RW': { name: 'Rwanda', currency: 'RWF', symbol: 'FRw', phoneCode: '+250', flag: '🇷🇼' },
        'BI': { name: 'Burundi', currency: 'BIF', symbol: 'FBu', phoneCode: '+257', flag: '🇧🇮' },
        'SO': { name: 'Somalia', currency: 'SOS', symbol: 'SOS', phoneCode: '+252', flag: '🇸🇴' },
        'SS': { name: 'South Sudan', currency: 'SSP', symbol: 'SSP', phoneCode: '+211', flag: '🇸🇸' },
        'ET': { name: 'Ethiopia', currency: 'ETB', symbol: 'Br', phoneCode: '+251', flag: '🇪🇹' },
        'CD': { name: 'DR Congo', currency: 'CDF', symbol: 'FC', phoneCode: '+243', flag: '🇨🇩' },
        'NG': { name: 'Nigeria', currency: 'NGN', symbol: '₦', phoneCode: '+234', flag: '🇳🇬' },
        'ZA': { name: 'South Africa', currency: 'ZAR', symbol: 'R', phoneCode: '+27', flag: '🇿🇦' },
        'GH': { name: 'Ghana', currency: 'GHS', symbol: 'GH₵', phoneCode: '+233', flag: '🇬🇭' }
    },
    
    // Get country info
    getCountry(code) {
        return this.countries[code] || { name: code, currency: 'USD', symbol: '$', phoneCode: '', flag: '🇺🇳' };
    },
    
    // Get all countries
    getAllCountries() {
        return Object.entries(this.countries).map(([code, info]) => ({
            code,
            ...info
        }));
    },
    
    // Get country by phone number
    getCountryByPhone(phone) {
        if (!phone) return null;
        
        const phoneCodes = {
            '254': 'KE',
            '256': 'UG',
            '255': 'TZ',
            '250': 'RW',
            '257': 'BI',
            '252': 'SO',
            '211': 'SS',
            '251': 'ET',
            '243': 'CD',
            '234': 'NG',
            '27': 'ZA',
            '233': 'GH'
        };
        
        const cleaned = phone.toString().replace(/\D/g, '');
        
        for (const [code, country] of Object.entries(phoneCodes)) {
            if (cleaned.startsWith(code)) {
                return country;
            }
        }
        
        return 'KE'; // Default to Kenya
    },
    
    // Get currency symbol for country
    getCurrencySymbol(countryCode) {
        return this.getCountry(countryCode).symbol;
    },
    
    // Get phone code for country
    getPhoneCode(countryCode) {
        return this.getCountry(countryCode).phoneCode;
    },
    
    // Get flag emoji for country
    getFlag(countryCode) {
        return this.getCountry(countryCode).flag;
    }
};

// ====== ERROR UTILITIES ======
const ErrorUtils = {
    // Handle errors gracefully
    handleError(error, context = '') {
        console.error(`Error in ${context}:`, error);
        
        const errorInfo = {
            message: error.message || 'An unknown error occurred',
            context,
            timestamp: new Date().toISOString(),
            stack: error.stack
        };
        
        // Log to localStorage for debugging
        const errors = StorageUtils.get('errors', []);
        errors.push(errorInfo);
        StorageUtils.set('errors', errors.slice(-50)); // Keep last 50 errors
        
        return errorInfo;
    },
    
    // Show user-friendly error message
    showError(error, userMessage = null) {
        const message = userMessage || 
                       error.message || 
                       'An error occurred. Please try again.';
        
        // Show toast notification
        if (window.showToast) {
            window.showToast(message, 'error');
        } else {
            alert(message);
        }
    },
    
    // Clear error logs
    clearErrorLogs() {
        StorageUtils.remove('errors');
    },
    
    // Get error logs
    getErrorLogs() {
        return StorageUtils.get('errors', []);
    }
};

// ====== EXPORT ALL UTILITIES ======
const Utils = {
    Data: DataUtils,
    Format: FormatUtils,
    Validation: ValidationUtils,
    Storage: StorageUtils,
    Dom: DomUtils,
    Calculation: CalculationUtils,
    Network: NetworkUtils,
    Country: CountryUtils,
    Error: ErrorUtils
};

// Make available globally
window.Utils = Utils;

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Utils;
}