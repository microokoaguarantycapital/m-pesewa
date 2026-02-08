'use strict';

// Utility functions for M-Pesewa
class Utils {
    constructor() {
        // Initialize any required state
    }

    // Format currency based on country
    formatCurrency(amount, currencyCode = 'KSh') {
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currencyCode,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
        
        try {
            return formatter.format(amount);
        } catch (error) {
            // Fallback formatting
            return `${currencyCode} ${amount.toLocaleString()}`;
        }
    }

    // Format date
    formatDate(date, format = 'medium') {
        const dateObj = new Date(date);
        
        if (isNaN(dateObj.getTime())) {
            return 'Invalid Date';
        }
        
        const options = {
            short: {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            },
            medium: {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            },
            long: {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            },
            time: {
                hour: '2-digit',
                minute: '2-digit'
            }
        };
        
        const formatOptions = options[format] || options.medium;
        return dateObj.toLocaleDateString('en-US', formatOptions);
    }

    // Format relative time (e.g., "2 days ago")
    formatRelativeTime(date) {
        const now = new Date();
        const diffMs = now - new Date(date);
        const diffSec = Math.floor(diffMs / 1000);
        const diffMin = Math.floor(diffSec / 60);
        const diffHour = Math.floor(diffMin / 60);
        const diffDay = Math.floor(diffHour / 24);
        
        if (diffDay > 30) {
            return this.formatDate(date, 'short');
        } else if (diffDay > 0) {
            return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
        } else if (diffHour > 0) {
            return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
        } else if (diffMin > 0) {
            return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
        } else {
            return 'Just now';
        }
    }

    // Validate email address
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Validate phone number (basic validation)
    isValidPhone(phone) {
        // Remove all non-digit characters
        const cleaned = phone.replace(/\D/g, '');
        // Check if it has between 9 and 15 digits
        return cleaned.length >= 9 && cleaned.length <= 15;
    }

    // Format phone number
    formatPhone(phone) {
        const cleaned = phone.replace(/\D/g, '');
        
        // Simple formatting for East African numbers
        if (cleaned.startsWith('254')) {
            return `+${cleaned.substring(0, 3)} ${cleaned.substring(3, 6)} ${cleaned.substring(6, 9)} ${cleaned.substring(9)}`;
        }
        
        // Default formatting
        return `+${cleaned}`;
    }

    // Generate a unique ID
    generateId(prefix = '') {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 9);
        return `${prefix}${timestamp}${random}`.toUpperCase();
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
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }
        
        if (obj instanceof Date) {
            return new Date(obj.getTime());
        }
        
        if (obj instanceof Array) {
            return obj.reduce((arr, item, i) => {
                arr[i] = this.deepClone(item);
                return arr;
            }, []);
        }
        
        if (typeof obj === 'object') {
            return Object.keys(obj).reduce((newObj, key) => {
                newObj[key] = this.deepClone(obj[key]);
                return newObj;
            }, {});
        }
    }

    // Merge objects
    mergeObjects(target, source) {
        for (const key in source) {
            if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                if (!target[key] || typeof target[key] !== 'object') {
                    target[key] = {};
                }
                this.mergeObjects(target[key], source[key]);
            } else {
                target[key] = source[key];
            }
        }
        return target;
    }

    // Calculate loan interest
    calculateInterest(principal, days, interestRate = 0.10) {
        const weeks = days / 7;
        return principal * interestRate * weeks;
    }

    // Calculate penalty
    calculatePenalty(principal, overdueDays, penaltyRate = 0.05) {
        if (overdueDays <= 0) return 0;
        return principal * penaltyRate * overdueDays;
    }

    // Calculate total repayment
    calculateTotalRepayment(principal, days, isOverdue = false, overdueDays = 0) {
        const interest = this.calculateInterest(principal, days);
        const penalty = isOverdue ? this.calculatePenalty(principal, overdueDays) : 0;
        return principal + interest + penalty;
    }

    // Parse URL parameters
    getUrlParams() {
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

    // Set URL parameter
    setUrlParam(key, value) {
        const url = new URL(window.location);
        url.searchParams.set(key, value);
        window.history.replaceState({}, '', url);
    }

    // Remove URL parameter
    removeUrlParam(key) {
        const url = new URL(window.location);
        url.searchParams.delete(key);
        window.history.replaceState({}, '', url);
    }

    // Get user's country from IP (mock implementation)
    async getUserCountry() {
        try {
            // In a real app, this would call an IP geolocation service
            // For now, return from localStorage or default
            return localStorage.getItem('userCountry') || 'KE';
        } catch (error) {
            return 'KE';
        }
    }

    // Get user's timezone
    getUserTimezone() {
        return Intl.DateTimeFormat().resolvedOptions().timeZone;
    }

    // Get browser language
    getUserLanguage() {
        return navigator.language || 'en-US';
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

    // Copy text to clipboard
    async copyToClipboard(text) {
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(text);
                return true;
            } else {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                textArea.style.top = '-999999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                document.execCommand('copy');
                textArea.remove();
                return true;
            }
        } catch (error) {
            console.error('Failed to copy:', error);
            return false;
        }
    }

    // Share content
    async shareContent(data) {
        if (navigator.share) {
            try {
                await navigator.share(data);
                return true;
            } catch (error) {
                console.error('Share failed:', error);
                return false;
            }
        } else {
            // Fallback: copy to clipboard
            const text = `${data.title || ''}\n${data.text || ''}\n${data.url || ''}`;
            return this.copyToClipboard(text);
        }
    }

    // Show loading indicator
    showLoading(message = 'Loading...') {
        // Remove existing loader if any
        this.hideLoading();
        
        const loader = document.createElement('div');
        loader.id = 'global-loader';
        loader.className = 'global-loader';
        loader.innerHTML = `
            <div class="loader-content">
                <div class="loader-spinner"></div>
                <div class="loader-text">${message}</div>
            </div>
        `;
        
        document.body.appendChild(loader);
        
        // Add styles if not already added
        if (!document.querySelector('#loader-styles')) {
            const style = document.createElement('style');
            style.id = 'loader-styles';
            style.textContent = `
                .global-loader {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(255, 255, 255, 0.9);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 9999;
                }
                
                .loader-content {
                    text-align: center;
                }
                
                .loader-spinner {
                    width: 50px;
                    height: 50px;
                    border: 5px solid var(--light-border);
                    border-top-color: var(--primary-blue);
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 20px;
                }
                
                .loader-text {
                    font-size: 16px;
                    color: var(--dark-gray);
                    font-weight: 500;
                }
                
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Hide loading indicator
    hideLoading() {
        const loader = document.getElementById('global-loader');
        if (loader) {
            loader.remove();
        }
    }

    // Show toast notification
    showToast(message, type = 'info', duration = 5000) {
        // Remove existing toasts
        const existingToasts = document.querySelectorAll('.toast');
        existingToasts.forEach(toast => {
            if (toast.dataset.id !== 'permanent') {
                toast.remove();
            }
        });
        
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <div class="toast-icon">${this.getToastIcon(type)}</div>
                <div class="toast-message">${message}</div>
                <button class="toast-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        // Add styles if not already added
        if (!document.querySelector('#toast-styles')) {
            const style = document.createElement('style');
            style.id = 'toast-styles';
            style.textContent = `
                .toast {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: white;
                    border-radius: var(--radius-lg);
                    box-shadow: var(--shadow-xl);
                    padding: 16px;
                    min-width: 300px;
                    max-width: 400px;
                    z-index: 10000;
                    animation: slideIn 0.3s ease;
                    border-left: 4px solid;
                }
                
                .toast-info {
                    border-left-color: var(--primary-blue);
                }
                
                .toast-success {
                    border-left-color: var(--growth-green);
                }
                
                .toast-warning {
                    border-left-color: var(--warm-orange);
                }
                
                .toast-danger {
                    border-left-color: var(--alert-red);
                }
                
                .toast-content {
                    display: flex;
                    align-items: flex-start;
                    gap: 12px;
                }
                
                .toast-icon {
                    font-size: 20px;
                    flex-shrink: 0;
                }
                
                .toast-info .toast-icon { color: var(--primary-blue); }
                .toast-success .toast-icon { color: var(--growth-green); }
                .toast-warning .toast-icon { color: var(--warm-orange); }
                .toast-danger .toast-icon { color: var(--alert-red); }
                
                .toast-message {
                    flex: 1;
                    font-size: 14px;
                    line-height: 1.4;
                }
                
                .toast-close {
                    background: none;
                    border: none;
                    font-size: 20px;
                    cursor: pointer;
                    color: var(--medium-gray);
                    padding: 0;
                    line-height: 1;
                }
                
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Auto-remove after duration
        if (duration > 0) {
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, duration);
        }
    }

    getToastIcon(type) {
        const icons = {
            info: 'ℹ️',
            success: '✓',
            warning: '⚠️',
            danger: '✗'
        };
        return icons[type] || icons.info;
    }

    // Validate form
    validateForm(formId) {
        const form = document.getElementById(formId);
        if (!form) return { valid: false, errors: [] };
        
        const inputs = form.querySelectorAll('[data-validate]');
        const errors = [];
        
        inputs.forEach(input => {
            const value = input.value.trim();
            const rules = input.dataset.validate.split('|');
            
            for (const rule of rules) {
                let isValid = true;
                let message = '';
                
                switch (rule) {
                    case 'required':
                        if (!value) {
                            isValid = false;
                            message = 'This field is required';
                        }
                        break;
                        
                    case 'email':
                        if (value && !this.isValidEmail(value)) {
                            isValid = false;
                            message = 'Please enter a valid email address';
                        }
                        break;
                        
                    case 'phone':
                        if (value && !this.isValidPhone(value)) {
                            isValid = false;
                            message = 'Please enter a valid phone number';
                        }
                        break;
                        
                    case 'minlength': {
                        const min = parseInt(input.dataset.minlength) || 0;
                        if (value && value.length < min) {
                            isValid = false;
                            message = `Minimum ${min} characters required`;
                        }
                        break;
                    }
                        
                    case 'maxlength': {
                        const max = parseInt(input.dataset.maxlength) || 0;
                        if (value && value.length > max) {
                            isValid = false;
                            message = `Maximum ${max} characters allowed`;
                        }
                        break;
                    }
                        
                    case 'number': {
                        const num = parseFloat(value);
                        if (value && isNaN(num)) {
                            isValid = false;
                            message = 'Please enter a valid number';
                        }
                        break;
                    }
                        
                    case 'min': {
                        const min = parseFloat(input.dataset.min) || 0;
                        const num = parseFloat(value);
                        if (value && num < min) {
                            isValid = false;
                            message = `Minimum value is ${min}`;
                        }
                        break;
                    }
                        
                    case 'max': {
                        const max = parseFloat(input.dataset.max) || 0;
                        const num = parseFloat(value);
                        if (value && num > max) {
                            isValid = false;
                            message = `Maximum value is ${max}`;
                        }
                        break;
                    }
                }
                
                if (!isValid) {
                    errors.push({
                        field: input.name || input.id,
                        message: message
                    });
                    
                    // Add error class to input
                    input.classList.add('error');
                    
                    // Show error message
                    let errorElement = input.nextElementSibling;
                    if (!errorElement || !errorElement.classList.contains('error-message')) {
                        errorElement = document.createElement('div');
                        errorElement.className = 'error-message';
                        input.parentNode.appendChild(errorElement);
                    }
                    errorElement.textContent = message;
                    errorElement.style.display = 'block';
                    
                    break; // Stop checking other rules for this field
                } else {
                    // Remove error class and message
                    input.classList.remove('error');
                    const errorElement = input.nextElementSibling;
                    if (errorElement && errorElement.classList.contains('error-message')) {
                        errorElement.style.display = 'none';
                    }
                }
            }
        });
        
        return {
            valid: errors.length === 0,
            errors: errors
        };
    }

    // Get query parameter
    getQueryParam(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    // Set query parameter
    setQueryParam(name, value) {
        const url = new URL(window.location);
        url.searchParams.set(name, value);
        window.history.pushState({}, '', url);
    }

    // Remove query parameter
    removeQueryParam(name) {
        const url = new URL(window.location);
        url.searchParams.delete(name);
        window.history.pushState({}, '', url);
    }

    // Scroll to element
    scrollToElement(elementId, offset = 0) {
        const element = document.getElementById(elementId);
        if (element) {
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }

    // Scroll to top
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // Check if element is in viewport
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // Add class to body
    addBodyClass(className) {
        document.body.classList.add(className);
    }

    // Remove class from body
    removeBodyClass(className) {
        document.body.classList.remove(className);
    }

    // Toggle body class
    toggleBodyClass(className) {
        document.body.classList.toggle(className);
    }

    // Get random item from array
    getRandomItem(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    // Shuffle array
    shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    // Generate random number between min and max
    randomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Generate random color
    randomColor() {
        return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    }

    // Convert string to slug
    toSlug(text) {
        return text
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    // Truncate text
    truncateText(text, maxLength, suffix = '...') {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength - suffix.length) + suffix;
    }

    // Capitalize first letter
    capitalize(text) {
        return text.charAt(0).toUpperCase() + text.slice(1);
    }

    // Format bytes to human readable size
    formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    // Wait for specified time
    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Retry async function
    async retry(fn, retries = 3, delay = 1000) {
        try {
            return await fn();
        } catch (error) {
            if (retries === 0) throw error;
            await this.wait(delay);
            return this.retry(fn, retries - 1, delay * 2);
        }
    }

    // Measure execution time
    measureTime(fn) {
        const start = performance.now();
        const result = fn();
        const end = performance.now();
        return {
            result: result,
            time: end - start
        };
    }

    // Create UUID
    createUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}

// Initialize utils
const utils = new Utils();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = utils;
}