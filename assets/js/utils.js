// assets/js/utils.js - Utilities & helpers

class M_PesewaUtils {
    constructor() {
        // Initialize any utilities needed
    }

    // ===== STRING UTILITIES =====
    capitalize(str) {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    truncate(str, length = 50, suffix = '...') {
        if (!str || str.length <= length) return str;
        return str.substring(0, length) + suffix;
    }

    slugify(str) {
        return str
            .toLowerCase()
            .replace(/[^\w\s-]/g, '') // Remove special characters
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .replace(/--+/g, '-') // Replace multiple hyphens with single hyphen
            .trim();
    }

    // ===== NUMBER UTILITIES =====
    formatNumber(num, decimals = 0) {
        if (isNaN(num)) return '0';
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }).format(num);
    }

    formatCurrency(amount, country = 'Kenya') {
        const currencies = {
            'Kenya': { code: 'KES', symbol: 'KSh' },
            'Uganda': { code: 'UGX', symbol: 'USh' },
            'Tanzania': { code: 'TZS', symbol: 'TSh' },
            'Rwanda': { code: 'RWF', symbol: 'RF' },
            'Nigeria': { code: 'NGN', symbol: '₦' },
            'Ghana': { code: 'GHS', symbol: 'GH₵' },
            'South Africa': { code: 'ZAR', symbol: 'R' },
            'Egypt': { code: 'EGP', symbol: 'E£' },
            'Ethiopia': { code: 'ETB', symbol: 'Br' },
            'Senegal': { code: 'XOF', symbol: 'CFA' }
        };
        
        const currency = currencies[country] || { code: 'USD', symbol: '$' };
        
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency.code,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }

    calculateInterest(principal, interestRate = 10, days = 7) {
        // Simple interest calculation
        return (principal * interestRate * days) / (100 * 365);
    }

    calculatePenalty(principal, penaltyRate = 5, overdueDays = 0) {
        if (overdueDays <= 0) return 0;
        // Daily penalty calculation
        return (principal * penaltyRate * overdueDays) / 100;
    }

    calculateTotalDue(principal, interestRate = 10, days = 7, overdueDays = 0, penaltyRate = 5) {
        const interest = this.calculateInterest(principal, interestRate, days);
        const penalty = this.calculatePenalty(principal, penaltyRate, overdueDays);
        return principal + interest + penalty;
    }

    // ===== DATE UTILITIES =====
    formatDate(date, format = 'medium') {
        if (!date) return '';
        
        const dateObj = date instanceof Date ? date : new Date(date);
        if (isNaN(dateObj.getTime())) return 'Invalid Date';
        
        const formats = {
            'short': { year: 'numeric', month: 'short', day: 'numeric' },
            'medium': { year: 'numeric', month: 'long', day: 'numeric' },
            'long': { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
            'time': { hour: '2-digit', minute: '2-digit' }
        };
        
        return dateObj.toLocaleDateString('en-US', formats[format] || formats.medium);
    }

    formatDateTime(date) {
        if (!date) return '';
        const dateObj = new Date(date);
        return dateObj.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    daysBetween(date1, date2) {
        const d1 = new Date(date1);
        const d2 = new Date(date2);
        const diff = Math.abs(d2 - d1);
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    }

    addDays(date, days) {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }

    isPastDue(dueDate) {
        return new Date(dueDate) < new Date();
    }

    getDaysOverdue(dueDate) {
        if (!this.isPastDue(dueDate)) return 0;
        return this.daysBetween(dueDate, new Date());
    }

    // ===== VALIDATION UTILITIES =====
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    validatePhone(phone) {
        // Basic phone validation - can be enhanced for specific countries
        const re = /^[\+]?[1-9][\d]{0,15}$/;
        return re.test(phone.replace(/\D/g, ''));
    }

    validatePassword(password) {
        // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
        const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        return re.test(password);
    }

    validateAmount(amount, min = 0, max = 1000000) {
        const num = parseFloat(amount);
        return !isNaN(num) && num >= min && num <= max;
    }

    // ===== ARRAY UTILITIES =====
    sortBy(array, key, direction = 'asc') {
        return [...array].sort((a, b) => {
            let aValue = a[key];
            let bValue = b[key];
            
            // Handle nested keys
            if (key.includes('.')) {
                aValue = this.getNestedValue(a, key);
                bValue = this.getNestedValue(b, key);
            }
            
            if (aValue < bValue) return direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return direction === 'asc' ? 1 : -1;
            return 0;
        });
    }

    filterBy(array, filters) {
        return array.filter(item => {
            return Object.entries(filters).every(([key, value]) => {
                if (value === undefined || value === '') return true;
                
                let itemValue = item[key];
                
                // Handle nested keys
                if (key.includes('.')) {
                    itemValue = this.getNestedValue(item, key);
                }
                
                if (typeof value === 'string') {
                    return String(itemValue).toLowerCase().includes(value.toLowerCase());
                }
                
                return itemValue === value;
            });
        });
    }

    groupBy(array, key) {
        return array.reduce((groups, item) => {
            const groupKey = item[key];
            if (!groups[groupKey]) {
                groups[groupKey] = [];
            }
            groups[groupKey].push(item);
            return groups;
        }, {});
    }

    uniqueBy(array, key) {
        const seen = new Set();
        return array.filter(item => {
            const value = item[key];
            if (seen.has(value)) {
                return false;
            }
            seen.add(value);
            return true;
        });
    }

    // ===== OBJECT UTILITIES =====
    getNestedValue(obj, path, defaultValue = undefined) {
        const keys = path.split('.');
        let result = obj;
        
        for (const key of keys) {
            if (result && typeof result === 'object' && key in result) {
                result = result[key];
            } else {
                return defaultValue;
            }
        }
        
        return result;
    }

    setNestedValue(obj, path, value) {
        const keys = path.split('.');
        let current = obj;
        
        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];
            if (!(key in current)) {
                current[key] = {};
            }
            current = current[key];
        }
        
        current[keys[keys.length - 1]] = value;
        return obj;
    }

    deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    mergeObjects(...objects) {
        return objects.reduce((merged, obj) => {
            if (!obj) return merged;
            
            Object.keys(obj).forEach(key => {
                if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
                    merged[key] = this.mergeObjects(merged[key] || {}, obj[key]);
                } else {
                    merged[key] = obj[key];
                }
            });
            
            return merged;
        }, {});
    }

    // ===== DOM UTILITIES =====
    createElement(tag, attributes = {}, children = []) {
        const element = document.createElement(tag);
        
        // Set attributes
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'textContent') {
                element.textContent = value;
            } else if (key === 'innerHTML') {
                element.innerHTML = value;
            } else if (key.startsWith('on') && typeof value === 'function') {
                element.addEventListener(key.substring(2).toLowerCase(), value);
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
    }

    removeAllChildren(element) {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    }

    showElement(element, display = 'block') {
        if (element) {
            element.style.display = display;
        }
    }

    hideElement(element) {
        if (element) {
            element.style.display = 'none';
        }
    }

    toggleElement(element, display = 'block') {
        if (element) {
            element.style.display = element.style.display === 'none' ? display : 'none';
        }
    }

    addClass(element, className) {
        if (element) {
            element.classList.add(className);
        }
    }

    removeClass(element, className) {
        if (element) {
            element.classList.remove(className);
        }
    }

    toggleClass(element, className) {
        if (element) {
            element.classList.toggle(className);
        }
    }

    // ===== STORAGE UTILITIES =====
    setStorage(key, value, ttl = null) {
        const item = {
            value: value,
            expiry: ttl ? Date.now() + ttl : null
        };
        localStorage.setItem(key, JSON.stringify(item));
    }

    getStorage(key, defaultValue = null) {
        const itemStr = localStorage.getItem(key);
        
        if (!itemStr) return defaultValue;
        
        try {
            const item = JSON.parse(itemStr);
            
            // Check if expired
            if (item.expiry && Date.now() > item.expiry) {
                localStorage.removeItem(key);
                return defaultValue;
            }
            
            return item.value;
        } catch (error) {
            console.error('Error parsing storage item:', error);
            return defaultValue;
        }
    }

    removeStorage(key) {
        localStorage.removeItem(key);
    }

    clearStorage(pattern = null) {
        if (pattern) {
            Object.keys(localStorage).forEach(key => {
                if (key.match(pattern)) {
                    localStorage.removeItem(key);
                }
            });
        } else {
            localStorage.clear();
        }
    }

    // ===== API UTILITIES =====
    async fetchWithTimeout(url, options = {}, timeout = 10000) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        
        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            return response;
        } catch (error) {
            clearTimeout(timeoutId);
            throw error;
        }
    }

    async fetchJSON(url, options = {}) {
        const response = await this.fetchWithTimeout(url, options);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        return await response.json();
    }

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

    throttle(func, limit) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func(...args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // ===== FORM UTILITIES =====
    serializeForm(form) {
        const formData = new FormData(form);
        const data = {};
        
        for (const [key, value] of formData.entries()) {
            if (data[key]) {
                if (!Array.isArray(data[key])) {
                    data[key] = [data[key]];
                }
                data[key].push(value);
            } else {
                data[key] = value;
            }
        }
        
        return data;
    }

    validateForm(form, rules) {
        const errors = {};
        const formData = new FormData(form);
        
        for (const [field, rule] of Object.entries(rules)) {
            const value = formData.get(field);
            
            if (rule.required && (!value || value.trim() === '')) {
                errors[field] = rule.requiredMessage || 'This field is required';
                continue;
            }
            
            if (value && rule.pattern && !rule.pattern.test(value)) {
                errors[field] = rule.patternMessage || 'Invalid format';
                continue;
            }
            
            if (value && rule.minLength && value.length < rule.minLength) {
                errors[field] = rule.minLengthMessage || `Minimum ${rule.minLength} characters required`;
                continue;
            }
            
            if (value && rule.maxLength && value.length > rule.maxLength) {
                errors[field] = rule.maxLengthMessage || `Maximum ${rule.maxLength} characters allowed`;
                continue;
            }
            
            if (value && rule.min && parseFloat(value) < rule.min) {
                errors[field] = rule.minMessage || `Minimum value is ${rule.min}`;
                continue;
            }
            
            if (value && rule.max && parseFloat(value) > rule.max) {
                errors[field] = rule.maxMessage || `Maximum value is ${rule.max}`;
                continue;
            }
            
            if (value && rule.custom && !rule.custom(value)) {
                errors[field] = rule.customMessage || 'Invalid value';
            }
        }
        
        return {
            isValid: Object.keys(errors).length === 0,
            errors: errors
        };
    }

    showFormErrors(form, errors) {
        // Clear previous errors
        form.querySelectorAll('.validation-message').forEach(el => el.remove());
        form.querySelectorAll('.form-control.error').forEach(el => {
            el.classList.remove('error');
        });
        
        // Show new errors
        Object.entries(errors).forEach(([field, message]) => {
            const input = form.querySelector(`[name="${field}"]`);
            if (input) {
                input.classList.add('error');
                
                const errorDiv = document.createElement('div');
                errorDiv.className = 'validation-message error';
                errorDiv.innerHTML = `❌ ${message}`;
                
                input.parentNode.appendChild(errorDiv);
            }
        });
    }

    // ===== COUNTRY-SPECIFIC UTILITIES =====
    getCountryCurrency(country) {
        const currencies = {
            'Kenya': 'KES',
            'Uganda': 'UGX',
            'Tanzania': 'TZS',
            'Rwanda': 'RWF',
            'Nigeria': 'NGN',
            'Ghana': 'GHS',
            'South Africa': 'ZAR',
            'Egypt': 'EGP',
            'Ethiopia': 'ETB',
            'Senegal': 'XOF'
        };
        return currencies[country] || 'USD';
    }

    getFlagEmoji(country) {
        const flagEmojis = {
            'Kenya': '🇰🇪',
            'Uganda': '🇺🇬',
            'Tanzania': '🇹🇿',
            'Rwanda': '🇷🇼',
            'Nigeria': '🇳🇬',
            'Ghana': '🇬🇭',
            'South Africa': '🇿🇦',
            'Egypt': '🇪🇬',
            'Ethiopia': '🇪🇹',
            'Senegal': '🇸🇳'
        };
        return flagEmojis[country] || '🏳️';
    }

    getCountryCode(country) {
        const codes = {
            'Kenya': 'KE',
            'Uganda': 'UG',
            'Tanzania': 'TZ',
            'Rwanda': 'RW',
            'Nigeria': 'NG',
            'Ghana': 'GH',
            'South Africa': 'ZA',
            'Egypt': 'EG',
            'Ethiopia': 'ET',
            'Senegal': 'SN'
        };
        return codes[country] || '';
    }

    // ===== LOAN CALCULATION UTILITIES =====
    generateLoanSchedule(principal, interestRate = 10, termDays = 7, startDate = new Date()) {
        const schedule = [];
        const dailyInterest = (principal * interestRate) / (100 * 365);
        let remainingBalance = principal;
        
        for (let day = 1; day <= termDays; day++) {
            const interestForDay = dailyInterest;
            const paymentDate = this.addDays(startDate, day);
            
            schedule.push({
                day: day,
                date: paymentDate,
                interest: interestForDay,
                cumulativeInterest: dailyInterest * day,
                remainingBalance: remainingBalance
            });
        }
        
        return schedule;
    }

    calculateEarlyRepayment(principal, interestRate, daysUsed, totalDays) {
        if (daysUsed >= totalDays) {
            return this.calculateTotalDue(principal, interestRate, totalDays);
        }
        
        const interest = this.calculateInterest(principal, interestRate, daysUsed);
        return principal + interest;
    }

    // ===== RATING UTILITIES =====
    calculateBorrowerRating(repaymentRate, defaultRate, activeLoans, totalLoans) {
        let score = 50; // Base score
        
        // Repayment rate contribution (0-30 points)
        score += (repaymentRate / 100) * 30;
        
        // Default rate penalty (0-20 points deduction)
        score -= (defaultRate / 100) * 20;
        
        // Active loans adjustment
        if (activeLoans > 0 && totalLoans > 0) {
            const completionRate = (totalLoans - activeLoans) / totalLoans;
            score += completionRate * 20;
        }
        
        // Ensure score is between 0 and 100
        score = Math.max(0, Math.min(100, score));
        
        // Convert to star rating (1-5 stars)
        const stars = Math.ceil((score / 100) * 5);
        return {
            score: Math.round(score),
            stars: stars,
            rating: '⭐'.repeat(stars) + '☆'.repeat(5 - stars)
        };
    }

    // ===== SECURITY UTILITIES =====
    sanitizeInput(input) {
        if (typeof input !== 'string') return input;
        
        // Remove potentially dangerous characters
        return input
            .replace(/[<>]/g, '') // Remove < and >
            .replace(/javascript:/gi, '') // Remove javascript: protocol
            .replace(/on\w+="/gi, '') // Remove event handlers
            .trim();
    }

    generateId(prefix = '') {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 9);
        return `${prefix}${timestamp}${random}`.toUpperCase();
    }

    generateLoanId(country, groupId, sequence) {
        const countryCode = this.getCountryCode(country);
        return `MP-${countryCode}-${groupId}-${sequence.toString().padStart(5, '0')}`;
    }

    // ===== ERROR HANDLING =====
    handleError(error, context = '') {
        console.error(`Error in ${context}:`, error);
        
        // Show user-friendly error message
        let userMessage = 'An unexpected error occurred';
        
        if (error instanceof TypeError && error.message.includes('network')) {
            userMessage = 'Network error. Please check your connection.';
        } else if (error instanceof SyntaxError) {
            userMessage = 'Data format error. Please try again.';
        } else if (error.name === 'AbortError') {
            userMessage = 'Request timed out. Please try again.';
        } else if (error.message) {
            userMessage = error.message;
        }
        
        // Dispatch error event for global handling
        const errorEvent = new CustomEvent('app-error', {
            detail: { error, context, userMessage }
        });
        window.dispatchEvent(errorEvent);
        
        return userMessage;
    }

    // ===== PERFORMANCE UTILITIES =====
    measurePerformance(name, func) {
        const start = performance.now();
        const result = func();
        const end = performance.now();
        
        console.log(`${name} took ${(end - start).toFixed(2)}ms`);
        return result;
    }

    lazyLoadImage(image, src) {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        image.src = src;
                        observer.unobserve(image);
                    }
                });
            });
            
            observer.observe(image);
        } else {
            // Fallback for browsers without IntersectionObserver
            image.src = src;
        }
    }
}

// Create global instance
const utils = new M_PesewaUtils();

// Make available globally
window.utils = utils;

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { M_PesewaUtils, utils };
}

// Add some global utility functions for convenience
window.formatCurrency = (amount, country) => utils.formatCurrency(amount, country);
window.formatDate = (date, format) => utils.formatDate(date, format);
window.validateEmail = (email) => utils.validateEmail(email);
window.generateId = (prefix) => utils.generateId(prefix);