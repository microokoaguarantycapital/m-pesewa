/**
 * M-PESEWA Utilities
 * Common helper functions used across the application
 */

// DOM Utilities
const DomUtils = {
  /**
   * Create element with attributes
   */
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
      } else if (key.startsWith('data-')) {
        element.setAttribute(key, value);
      } else if (key === 'style') {
        Object.assign(element.style, value);
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
  
  /**
   * Show loading overlay
   */
  showLoading(message = 'Loading...') {
    const overlay = document.createElement('div');
    overlay.className = 'loading-overlay';
    overlay.innerHTML = `
      <div class="loading-content">
        <div class="loading"></div>
        <p>${message}</p>
      </div>
    `;
    document.body.appendChild(overlay);
    return overlay;
  },
  
  /**
   * Hide loading overlay
   */
  hideLoading(overlay) {
    if (overlay && overlay.parentNode) {
      overlay.parentNode.removeChild(overlay);
    }
  },
  
  /**
   * Show notification
   */
  showNotification(type, message, duration = 5000) {
    const types = {
      success: { icon: '✅', color: '#10B981' },
      error: { icon: '❌', color: '#EF4444' },
      warning: { icon: '⚠️', color: '#F59E0B' },
      info: { icon: 'ℹ️', color: '#3B82F6' }
    };
    
    const config = types[type] || types.info;
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-header">
        <h4 class="notification-title">${config.icon} ${type.charAt(0).toUpperCase() + type.slice(1)}</h4>
        <button class="notification-close">×</button>
      </div>
      <div class="notification-body">${message}</div>
    `;
    
    document.body.appendChild(notification);
    
    // Add slide-in animation
    setTimeout(() => {
      notification.classList.add('notification-slide-in');
    }, 10);
    
    // Close button handler
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
      notification.classList.remove('notification-slide-in');
      notification.classList.add('notification-slide-out');
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    });
    
    // Auto dismiss
    if (duration > 0) {
      setTimeout(() => {
        if (notification.parentNode) {
          closeBtn.click();
        }
      }, duration);
    }
    
    return notification;
  },
  
  /**
   * Format currency
   */
  formatCurrency(amount, currency = 'KES') {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  },
  
  /**
   * Format date
   */
  formatDate(date, format = 'medium') {
    const dateObj = date instanceof Date ? date : new Date(date);
    
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
    
    return dateObj.toLocaleDateString('en-KE', options[format] || options.medium);
  },
  
  /**
   * Debounce function
   */
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
  
  /**
   * Throttle function
   */
  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },
  
  /**
   * Copy to clipboard
   */
  copyToClipboard(text) {
    return new Promise((resolve, reject) => {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text)
          .then(resolve)
          .catch(reject);
      } else {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        
        try {
          const successful = document.execCommand('copy');
          document.body.removeChild(textarea);
          successful ? resolve() : reject(new Error('Copy failed'));
        } catch (err) {
          document.body.removeChild(textarea);
          reject(err);
        }
      }
    });
  }
};

// Storage Utilities
const StorageUtils = {
  /**
   * Get item from localStorage
   */
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Storage get error:', error);
      return defaultValue;
    }
  },
  
  /**
   * Set item in localStorage
   */
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Storage set error:', error);
      return false;
    }
  },
  
  /**
   * Remove item from localStorage
   */
  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Storage remove error:', error);
      return false;
    }
  },
  
  /**
   * Clear all items from localStorage
   */
  clear() {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Storage clear error:', error);
      return false;
    }
  },
  
  /**
   * Get session data
   */
  getSession(key, defaultValue = null) {
    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Session get error:', error);
      return defaultValue;
    }
  },
  
  /**
   * Set session data
   */
  setSession(key, value) {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Session set error:', error);
      return false;
    }
  }
};

// Validation Utilities
const ValidationUtils = {
  /**
   * Validate email
   */
  isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  },
  
  /**
   * Validate phone number (East Africa format)
   */
  isValidPhone(phone) {
    const re = /^(\+?254|0)[17]\d{8}$/;
    return re.test(phone);
  },
  
  /**
   * Validate password strength
   */
  isValidPassword(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    
    return {
      isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers,
      minLength: password.length >= minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar
    };
  },
  
  /**
   * Validate amount
   */
  isValidAmount(amount) {
    return !isNaN(amount) && amount > 0;
  },
  
  /**
   * Validate date
   */
  isValidDate(date) {
    return date instanceof Date && !isNaN(date.getTime());
  }
};

// API Utilities
const ApiUtils = {
  /**
   * Make API request
   */
  async request(url, options = {}) {
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'same-origin'
    };
    
    const mergedOptions = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers
      }
    };
    
    try {
      const response = await fetch(url, mergedOptions);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return await response.text();
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  },
  
  /**
   * Mock API response for frontend development
   */
  mockResponse(data, delay = 500) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data,
          timestamp: new Date().toISOString()
        });
      }, delay);
    });
  },
  
  /**
   * Mock API error for frontend development
   */
  mockError(message = 'Something went wrong', delay = 500) {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error(message));
      }, delay);
    });
  }
};

// Math Utilities
const MathUtils = {
  /**
   * Calculate loan interest
   */
  calculateInterest(principal, rate, days = 7) {
    const interest = (principal * rate * days) / 36500;
    return Math.round(interest * 100) / 100;
  },
  
  /**
   * Calculate penalty
   */
  calculatePenalty(amount, overdueDays, penaltyRate = 5) {
    const penalty = (amount * penaltyRate * overdueDays) / 100;
    return Math.round(penalty * 100) / 100;
  },
  
  /**
   * Calculate total due
   */
  calculateTotalDue(principal, interest, penalty = 0) {
    return principal + interest + penalty;
  },
  
  /**
   * Format number with commas
   */
  formatNumber(number, decimals = 2) {
    return number.toLocaleString('en-KE', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  },
  
  /**
   * Generate random number in range
   */
  randomInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
};

// Date Utilities
const DateUtils = {
  /**
   * Add days to date
   */
  addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  },
  
  /**
   * Get days between dates
   */
  getDaysBetween(startDate, endDate) {
    const timeDiff = endDate.getTime() - startDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  },
  
  /**
   * Check if date is overdue
   */
  isOverdue(dueDate) {
    return new Date(dueDate) < new Date();
  },
  
  /**
   * Get overdue days
   */
  getOverdueDays(dueDate) {
    const today = new Date();
    const due = new Date(dueDate);
    
    if (due >= today) return 0;
    
    const timeDiff = today.getTime() - due.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  },
  
  /**
   * Format relative time
   */
  formatRelativeTime(date) {
    const now = new Date();
    const target = new Date(date);
    const diffInSeconds = Math.floor((now - target) / 1000);
    
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
      second: 1
    };
    
    for (const [unit, seconds] of Object.entries(intervals)) {
      const interval = Math.floor(diffInSeconds / seconds);
      if (interval >= 1) {
        return interval === 1 ? `1 ${unit} ago` : `${interval} ${unit}s ago`;
      }
    }
    
    return 'just now';
  }
};

// Export all utilities
window.MPUtils = {
  Dom: DomUtils,
  Storage: StorageUtils,
  Validation: ValidationUtils,
  Api: ApiUtils,
  Math: MathUtils,
  Date: DateUtils
};

// Initialize utilities when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('M-PESEWA Utilities loaded');
});