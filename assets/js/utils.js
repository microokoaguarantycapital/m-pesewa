/* M-PESEWA UTILS.JS */
/* Utility functions, helpers, and common operations used across the application */

// ===== FORMATTING UTILITIES =====
class FormatUtils {
    // Format currency based on country
    static formatCurrency(amount, currencyCode, locale = 'en-US') {
        if (!amount && amount !== 0) return 'N/A';
        
        const currencies = {
            'KES': { symbol: 'KSh', code: 'KES' },
            'UGX': { symbol: 'UGX', code: 'UGX' },
            'TZS': { symbol: 'TSh', code: 'TZS' },
            'RWF': { symbol: 'RF', code: 'RWF' },
            'BIF': { symbol: 'FBu', code: 'BIF' },
            'SOS': { symbol: 'S', code: 'SOS' },
            'SSP': { symbol: '£', code: 'SSP' },
            'ETB': { symbol: 'Br', code: 'ETB' },
            'CDF': { symbol: 'FC', code: 'CDF' },
            'NGN': { symbol: '₦', code: 'NGN' },
            'GHS': { symbol: 'GH₵', code: 'GHS' },
            'ZAR': { symbol: 'R', code: 'ZAR' },
            'EGP': { symbol: 'E£', code: 'EGP' },
            'MAD': { symbol: 'MAD', code: 'MAD' },
            'USD': { symbol: '$', code: 'USD' }
        };
        
        const currency = currencies[currencyCode] || { symbol: currencyCode, code: currencyCode };
        const formattedAmount = parseFloat(amount).toLocaleString(locale, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        });
        
        return `${currency.symbol} ${formattedAmount}`;
    }
    
    // Format date with options
    static formatDate(date, format = 'medium', locale = 'en-US') {
        if (!date) return 'N/A';
        
        const dateObj = new Date(date);
        if (isNaN(dateObj.getTime())) return 'Invalid Date';
        
        const formats = {
            'short': { day: 'numeric', month: 'short', year: 'numeric' },
            'medium': { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' },
            'long': { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' },
            'date': { day: 'numeric', month: 'short', year: 'numeric' },
            'time': { hour: '2-digit', minute: '2-digit' },
            'relative': this.getRelativeTime(dateObj)
        };
        
        if (format === 'relative') {
            return formats.relative;
        }
        
        return dateObj.toLocaleDateString(locale, formats[format] || formats.medium);
    }
    
    // Get relative time (e.g., "2 hours ago", "in 3 days")
    static getRelativeTime(date) {
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        
        const intervals = [
            { label: 'year', seconds: 31536000 },
            { label: 'month', seconds: 2592000 },
            { label: 'week', seconds: 604800 },
            { label: 'day', seconds: 86400 },
            { label: 'hour', seconds: 3600 },
            { label: 'minute', seconds: 60 },
            { label: 'second', seconds: 1 }
        ];
        
        for (const interval of intervals) {
            const count = Math.floor(diffInSeconds / interval.seconds);
            if (count >= 1) {
                return count === 1 ? 
                    `${count} ${interval.label} ago` : 
                    `${count} ${interval.label}s ago`;
            }
        }
        
        return 'just now';
    }
    
    // Format phone number
    static formatPhoneNumber(phone, countryCode = 'KE') {
        if (!phone) return '';
        
        // Remove all non-digit characters
        const cleaned = phone.replace(/\D/g, '');
        
        // Country-specific formatting
        const formats = {
            'KE': (num) => {
                if (num.startsWith('254')) return `+254 ${num.substring(3, 6)} ${num.substring(6)}`;
                if (num.startsWith('0')) return `+254 ${num.substring(1, 4)} ${num.substring(4)}`;
                return num;
            },
            'UG': (num) => {
                if (num.startsWith('256')) return `+256 ${num.substring(3, 6)} ${num.substring(6)}`;
                if (num.startsWith('0')) return `+256 ${num.substring(1, 4)} ${num.substring(4)}`;
                return num;
            },
            'TZ': (num) => {
                if (num.startsWith('255')) return `+255 ${num.substring(3, 6)} ${num.substring(6)}`;
                if (num.startsWith('0')) return `+255 ${num.substring(1, 4)} ${num.substring(4)}`;
                return num;
            }
        };
        
        const formatter = formats[countryCode] || ((num) => num);
        return formatter(cleaned);
    }
    
    // Format file size
    static formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    // Truncate text with ellipsis
    static truncateText(text, maxLength = 100) {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        
        return text.substring(0, maxLength) + '...';
    }
    
    // Generate initials from name
    static getInitials(name) {
        if (!name) return '?';
        
        return name
            .split(' ')
            .map(word => word.charAt(0).toUpperCase())
            .slice(0, 2)
            .join('');
    }
}

// ===== VALIDATION UTILITIES =====
class ValidationUtils {
    // Email validation
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Phone number validation (basic)
    static isValidPhone(phone) {
        const phoneRegex = /^[\d\s\+\-\(\)]{10,}$/;
        return phoneRegex.test(phone);
    }
    
    // Password validation
    static isValidPassword(password) {
        // At least 8 characters, contains uppercase, lowercase, number
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        return passwordRegex.test(password);
    }
    
    // URL validation
    static isValidURL(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }
    
    // National ID validation (Kenya specific)
    static isValidNationalID(id, country = 'KE') {
        if (country === 'KE') {
            // Kenyan ID format: 8 digits
            return /^\d{8}$/.test(id);
        }
        // Default: at least 6 characters
        return id && id.length >= 6;
    }
    
    // Loan amount validation
    static isValidLoanAmount(amount, tier = 'basic') {
        const tierLimits = {
            'basic': 1500,
            'premium': 5000,
            'super': 20000,
            'lender-of-lenders': 50000
        };
        
        const limit = tierLimits[tier] || 1500;
        const numAmount = parseFloat(amount);
        
        return !isNaN(numAmount) && numAmount >= 5 && numAmount <= limit;
    }
    
    // Date validation
    static isValidDate(date) {
        const d = new Date(date);
        return d instanceof Date && !isNaN(d.getTime());
    }
    
    // Required field validation
    static isRequired(value) {
        return value !== null && value !== undefined && value.toString().trim() !== '';
    }
    
    // Minimum length validation
    static minLength(value, min) {
        return value && value.length >= min;
    }
    
    // Maximum length validation
    static maxLength(value, max) {
        return value && value.length <= max;
    }
    
    // Number range validation
    static isInRange(value, min, max) {
        const num = parseFloat(value);
        return !isNaN(num) && num >= min && num <= max;
    }
    
    // Validate form fields
    static validateForm(formData, rules) {
        const errors = {};
        
        for (const [field, fieldRules] of Object.entries(rules)) {
            const value = formData[field];
            
            for (const rule of fieldRules) {
                if (rule === 'required' && !this.isRequired(value)) {
                    errors[field] = 'This field is required';
                    break;
                }
                
                if (rule.startsWith('min:')) {
                    const min = parseInt(rule.split(':')[1]);
                    if (!this.minLength(value, min)) {
                        errors[field] = `Minimum ${min} characters required`;
                        break;
                    }
                }
                
                if (rule.startsWith('max:')) {
                    const max = parseInt(rule.split(':')[1]);
                    if (!this.maxLength(value, max)) {
                        errors[field] = `Maximum ${max} characters allowed`;
                        break;
                    }
                }
                
                if (rule === 'email' && !this.isValidEmail(value)) {
                    errors[field] = 'Invalid email address';
                    break;
                }
                
                if (rule === 'phone' && !this.isValidPhone(value)) {
                    errors[field] = 'Invalid phone number';
                    break;
                }
                
                if (rule === 'password' && !this.isValidPassword(value)) {
                    errors[field] = 'Password must be at least 8 characters with uppercase, lowercase, and number';
                    break;
                }
            }
        }
        
        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }
}

// ===== CALCULATION UTILITIES =====
class CalculationUtils {
    // Calculate loan interest (10% per week)
    static calculateInterest(principal, days = 7) {
        const weeklyRate = 10; // 10% per week
        const interest = (principal * weeklyRate * days) / (100 * 7);
        return Math.round(interest * 100) / 100;
    }
    
    // Calculate daily penalty (5% daily after 7 days)
    static calculatePenalty(amount, overdueDays) {
        const dailyPenaltyRate = 5; // 5% daily
        const penalty = (amount * dailyPenaltyRate * overdueDays) / 100;
        return Math.round(penalty * 100) / 100;
    }
    
    // Calculate total repayment
    static calculateTotalRepayment(principal, days = 7, overdueDays = 0) {
        const interest = this.calculateInterest(principal, days);
        const penalty = overdueDays > 0 ? this.calculatePenalty(principal + interest, overdueDays) : 0;
        return principal + interest + penalty;
    }
    
    // Calculate daily repayment amount
    static calculateDailyRepayment(total, days = 7) {
        return Math.round((total / days) * 100) / 100;
    }
    
    // Calculate subscription expiry date (28th of month)
    static calculateSubscriptionExpiry(startDate = new Date()) {
        const date = new Date(startDate);
        const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);
        const lastDay = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 0);
        
        // If last day is less than 28, use last day
        const expiryDay = Math.min(28, lastDay.getDate());
        
        return new Date(date.getFullYear(), date.getMonth(), expiryDay);
    }
    
    // Calculate days between dates
    static daysBetween(date1, date2) {
        const diff = Math.abs(new Date(date2) - new Date(date1));
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    }
    
    // Calculate age from birth date
    static calculateAge(birthDate) {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        
        return age;
    }
    
    // Calculate progress percentage
    static calculateProgress(current, total) {
        if (total === 0) return 0;
        return Math.round((current / total) * 100);
    }
    
    // Calculate average rating
    static calculateAverageRating(ratings) {
        if (!ratings || ratings.length === 0) return 0;
        const sum = ratings.reduce((acc, rating) => acc + rating, 0);
        return Math.round((sum / ratings.length) * 10) / 10;
    }
}

// ===== STRING MANIPULATION UTILITIES =====
class StringUtils {
    // Capitalize first letter
    static capitalize(text) {
        if (!text) return '';
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    }
    
    // Title case (capitalize each word)
    static titleCase(text) {
        if (!text) return '';
        return text.split(' ')
            .map(word => this.capitalize(word))
            .join(' ');
    }
    
    // Generate random string
    static generateRandomString(length = 8) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
    
    // Generate unique ID
    static generateId(prefix = 'id') {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substr(2, 9);
        return `${prefix}_${timestamp}_${random}`;
    }
    
    // Slugify string (for URLs)
    static slugify(text) {
        return text
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }
    
    // Mask sensitive information
    static maskSensitive(text, visibleChars = 4) {
        if (!text) return '';
        if (text.length <= visibleChars * 2) return '•'.repeat(text.length);
        
        const firstVisible = text.substring(0, visibleChars);
        const lastVisible = text.substring(text.length - visibleChars);
        const masked = '•'.repeat(text.length - (visibleChars * 2));
        
        return firstVisible + masked + lastVisible;
    }
    
    // Convert camelCase to kebab-case
    static camelToKebab(str) {
        return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    }
    
    // Convert kebab-case to camelCase
    static kebabToCamel(str) {
        return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
    }
    
    // Pluralize word
    static pluralize(word, count) {
        if (count === 1) return word;
        
        const rules = [
            [/y$/, 'ies'],
            [/s$/, 'ses'],
            [/(ch|sh|x)$/, '$1es'],
            [/$/, 's']
        ];
        
        for (const [regex, replacement] of rules) {
            if (regex.test(word)) {
                return word.replace(regex, replacement);
            }
        }
        
        return word + 's';
    }
}

// ===== ARRAY AND OBJECT UTILITIES =====
class CollectionUtils {
    // Remove duplicates from array
    static removeDuplicates(array, key = null) {
        if (!key) {
            return [...new Set(array)];
        }
        
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
    
    // Sort array by property
    static sortBy(array, key, direction = 'asc') {
        return [...array].sort((a, b) => {
            let aVal = a[key];
            let bVal = b[key];
            
            // Handle nested keys
            if (key.includes('.')) {
                aVal = key.split('.').reduce((obj, k) => obj?.[k], a);
                bVal = key.split('.').reduce((obj, k) => obj?.[k], b);
            }
            
            if (aVal < bVal) return direction === 'asc' ? -1 : 1;
            if (aVal > bVal) return direction === 'asc' ? 1 : -1;
            return 0;
        });
    }
    
    // Group array by property
    static groupBy(array, key) {
        return array.reduce((groups, item) => {
            const groupKey = item[key];
            if (!groups[groupKey]) {
                groups[groupKey] = [];
            }
            groups[groupKey].push(item);
            return groups;
        }, {});
    }
    
    // Filter array by multiple criteria
    static filterBy(array, criteria) {
        return array.filter(item => {
            for (const [key, value] of Object.entries(criteria)) {
                if (item[key] !== value) {
                    return false;
                }
            }
            return true;
        });
    }
    
    // Find object by property value
    static findBy(array, key, value) {
        return array.find(item => item[key] === value);
    }
    
    // Map array with async function
    static async asyncMap(array, asyncFn) {
        const results = [];
        for (const item of array) {
            results.push(await asyncFn(item));
        }
        return results;
    }
    
    // Chunk array into smaller arrays
    static chunk(array, size) {
        const chunks = [];
        for (let i = 0; i < array.length; i += size) {
            chunks.push(array.slice(i, i + size));
        }
        return chunks;
    }
    
    // Flatten nested array
    static flatten(array) {
        return array.reduce((flat, item) => 
            flat.concat(Array.isArray(item) ? this.flatten(item) : item), []);
    }
    
    // Deep clone object
    static deepClone(obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Date) return new Date(obj);
        if (obj instanceof Array) return obj.map(item => this.deepClone(item));
        
        const cloned = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                cloned[key] = this.deepClone(obj[key]);
            }
        }
        return cloned;
    }
    
    // Merge objects deeply
    static deepMerge(target, source) {
        const output = Object.assign({}, target);
        
        if (this.isObject(target) && this.isObject(source)) {
            Object.keys(source).forEach(key => {
                if (this.isObject(source[key])) {
                    if (!(key in target)) {
                        Object.assign(output, { [key]: source[key] });
                    } else {
                        output[key] = this.deepMerge(target[key], source[key]);
                    }
                } else {
                    Object.assign(output, { [key]: source[key] });
                }
            });
        }
        
        return output;
    }
    
    // Check if value is an object
    static isObject(item) {
        return item && typeof item === 'object' && !Array.isArray(item);
    }
}

// ===== DOM UTILITIES =====
class DOMUtils {
    // Create element with attributes
    static createElement(tag, attributes = {}, children = []) {
        const element = document.createElement(tag);
        
        for (const [key, value] of Object.entries(attributes)) {
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
        }
        
        if (Array.isArray(children)) {
            children.forEach(child => {
                if (typeof child === 'string') {
                    element.appendChild(document.createTextNode(child));
                } else if (child instanceof Node) {
                    element.appendChild(child);
                }
            });
        }
        
        return element;
    }
    
    // Remove all child elements
    static removeChildren(element) {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    }
    
    // Toggle class on element
    static toggleClass(element, className) {
        element.classList.toggle(className);
    }
    
    // Add multiple classes
    static addClasses(element, classNames) {
        classNames.forEach(className => {
            element.classList.add(className);
        });
    }
    
    // Remove multiple classes
    static removeClasses(element, classNames) {
        classNames.forEach(className => {
            element.classList.remove(className);
        });
    }
    
    // Check if element is in viewport
    static isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    
    // Scroll to element smoothly
    static scrollToElement(element, offset = 0) {
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
    
    // Debounce function
    static debounce(func, wait) {
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
    static throttle(func, limit) {
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
    
    // Get element data attribute
    static getData(element, key) {
        return element.dataset[key];
    }
    
    // Set element data attribute
    static setData(element, key, value) {
        element.dataset[key] = value;
    }
    
    // Show element
    static show(element) {
        element.style.display = '';
    }
    
    // Hide element
    static hide(element) {
        element.style.display = 'none';
    }
}

// ===== STORAGE UTILITIES =====
class StorageUtils {
    // Set item with expiration
    static setWithExpiry(key, value, ttl) {
        const item = {
            value: value,
            expiry: Date.now() + ttl
        };
        localStorage.setItem(key, JSON.stringify(item));
    }
    
    // Get item with expiration check
    static getWithExpiry(key) {
        const itemStr = localStorage.getItem(key);
        
        if (!itemStr) return null;
        
        const item = JSON.parse(itemStr);
        
        if (Date.now() > item.expiry) {
            localStorage.removeItem(key);
            return null;
        }
        
        return item.value;
    }
    
    // Clear expired items
    static clearExpired() {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            try {
                const item = JSON.parse(localStorage.getItem(key));
                if (item && item.expiry && Date.now() > item.expiry) {
                    localStorage.removeItem(key);
                }
            } catch {
                // Not a JSON item, skip
            }
        });
    }
    
    // Save array to storage
    static saveArray(key, array) {
        localStorage.setItem(key, JSON.stringify(array));
    }
    
    // Load array from storage
    static loadArray(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    }
    
    // Add item to array in storage
    static addToArray(key, item) {
        const array = this.loadArray(key);
        array.push(item);
        this.saveArray(key, array);
        return array;
    }
    
    // Remove item from array in storage
    static removeFromArray(key, predicate) {
        const array = this.loadArray(key);
        const newArray = array.filter(item => !predicate(item));
        this.saveArray(key, newArray);
        return newArray;
    }
    
    // Clear all app storage
    static clearAppStorage() {
        const keys = Object.keys(localStorage).filter(key => 
            key.startsWith('mpesewa_')
        );
        
        keys.forEach(key => localStorage.removeItem(key));
        
        // Clear session storage too
        const sessionKeys = Object.keys(sessionStorage).filter(key =>
            key.startsWith('mpesewa_')
        );
        
        sessionKeys.forEach(key => sessionStorage.removeItem(key));
    }
}

// ===== BROWSER UTILITIES =====
class BrowserUtils {
    // Check if browser is online
    static isOnline() {
        return navigator.onLine;
    }
    
    // Get browser name and version
    static getBrowserInfo() {
        const ua = navigator.userAgent;
        let browser = 'Unknown';
        let version = 'Unknown';
        
        // Detect Chrome
        if (ua.includes('Chrome') && !ua.includes('Edg')) {
            browser = 'Chrome';
            version = ua.match(/Chrome\/(\d+\.\d+)/)?.[1] || version;
        }
        // Detect Firefox
        else if (ua.includes('Firefox')) {
            browser = 'Firefox';
            version = ua.match(/Firefox\/(\d+\.\d+)/)?.[1] || version;
        }
        // Detect Safari
        else if (ua.includes('Safari') && !ua.includes('Chrome')) {
            browser = 'Safari';
            version = ua.match(/Version\/(\d+\.\d+)/)?.[1] || version;
        }
        // Detect Edge
        else if (ua.includes('Edg')) {
            browser = 'Edge';
            version = ua.match(/Edg\/(\d+\.\d+)/)?.[1] || version;
        }
        
        return { browser, version };
    }
    
    // Get device type
    static getDeviceType() {
        const ua = navigator.userAgent;
        
        if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
            return 'tablet';
        }
        
        if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
            return 'mobile';
        }
        
        return 'desktop';
    }
    
    // Get operating system
    static getOS() {
        const ua = navigator.userAgent;
        
        if (/Windows/i.test(ua)) return 'Windows';
        if (/Mac/i.test(ua)) return 'MacOS';
        if (/Linux/i.test(ua)) return 'Linux';
        if (/Android/i.test(ua)) return 'Android';
        if (/iOS|iPhone|iPad|iPod/i.test(ua)) return 'iOS';
        
        return 'Unknown';
    }
    
    // Copy text to clipboard
    static async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.opacity = '0';
            document.body.appendChild(textArea);
            textArea.select();
            
            try {
                const successful = document.execCommand('copy');
                document.body.removeChild(textArea);
                return successful;
            } catch (err) {
                document.body.removeChild(textArea);
                return false;
            }
        }
    }
    
    // Download file
    static downloadFile(filename, content, type = 'text/plain') {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
    }
    
    // Get query parameters
    static getQueryParams() {
        const params = {};
        const queryString = window.location.search.substring(1);
        const pairs = queryString.split('&');
        
        for (const pair of pairs) {
            const [key, value] = pair.split('=');
            if (key) {
                params[decodeURIComponent(key)] = decodeURIComponent(value || '');
            }
        }
        
        return params;
    }
    
    // Set query parameter
    static setQueryParam(key, value) {
        const url = new URL(window.location);
        url.searchParams.set(key, value);
        window.history.pushState({}, '', url);
    }
    
    // Remove query parameter
    static removeQueryParam(key) {
        const url = new URL(window.location);
        url.searchParams.delete(key);
        window.history.pushState({}, '', url);
    }
}

// ===== ERROR HANDLING UTILITIES =====
class ErrorUtils {
    // Log error with context
    static logError(error, context = {}) {
        console.error('M-Pesewa Error:', {
            error: error.message || error,
            stack: error.stack,
            context,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent
        });
    }
    
    // Create user-friendly error message
    static getUserFriendlyError(error) {
        const errorMessages = {
            'NetworkError': 'Please check your internet connection and try again.',
            'Failed to fetch': 'Unable to connect to the server. Please try again.',
            'User not found': 'The username or email was not found.',
            'Invalid password': 'The password is incorrect.',
            'User not registered in selected country': 'Please select the correct country for your account.',
            'Already a member of this group': 'You are already a member of this group.',
            'Borrowers can join maximum 4 groups': 'Borrowers can only join up to 4 groups.',
            'You must be in a group to request a loan': 'Please join a group before requesting a loan.',
            'You already have an active loan request in this group': 'Please wait for your current loan request to be processed.',
            'Only lenders can lend': 'Please switch to lender role to lend money.',
            'Active subscription required for lending': 'Please subscribe to a lending plan.',
            'Subscription expired. Please renew to continue lending': 'Your subscription has expired. Please renew to continue lending.',
            'Amount exceeds your subscription limit': 'The amount exceeds your subscription limit. Please upgrade your plan.',
            'Loan request not found': 'The loan request is no longer available.',
            'Loan already fully funded': 'This loan has already been fully funded by other lenders.'
        };
        
        return errorMessages[error] || 
               (error.message || error) || 
               'An unexpected error occurred. Please try again.';
    }
    
    // Show error notification
    static showError(error, context = {}) {
        const message = this.getUserFriendlyError(error);
        
        // Create error notification
        const notification = DOMUtils.createElement('div', {
            className: 'notification notification-error',
            innerHTML: `
                <div class="notification-content">
                    <span class="notification-icon">❌</span>
                    <span class="notification-message">${message}</span>
                </div>
                <button class="notification-close">&times;</button>
            `
        });
        
        document.body.appendChild(notification);
        
        // Add close handler
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.remove();
        });
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 10000);
        
        // Log error for debugging
        this.logError(error, context);
    }
    
    // Handle promise errors gracefully
    static handlePromise(promise, errorMessage = 'Operation failed') {
        return promise
            .then(result => ({ success: true, data: result }))
            .catch(error => {
                this.showError(errorMessage, { error });
                return { success: false, error };
            });
    }
}

// ===== EXPORT ALL UTILITIES =====
// Make all utilities available globally
window.MpesewaUtils = {
    FormatUtils,
    ValidationUtils,
    CalculationUtils,
    StringUtils,
    CollectionUtils,
    DOMUtils,
    StorageUtils,
    BrowserUtils,
    ErrorUtils
};

// Short aliases for commonly used utilities
window.format = FormatUtils;
window.validate = ValidationUtils;
window.calc = CalculationUtils;
window.str = StringUtils;
window.collection = CollectionUtils;
window.dom = DOMUtils;
window.storage = StorageUtils;
window.browser = BrowserUtils;
window.error = ErrorUtils;

// Initialize storage cleanup on load
document.addEventListener('DOMContentLoaded', () => {
    StorageUtils.clearExpired();
});

console.log('M-Pesewa Utilities loaded successfully');