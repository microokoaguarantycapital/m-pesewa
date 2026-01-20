// M-PESEWA - Main JavaScript File
// Core PWA functionality and application logic

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
        
        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          console.log('New service worker found:', newWorker);
          
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content is available, show update notification
              showUpdateNotification();
            }
          });
        });
      })
      .catch(error => {
        console.error('Service Worker registration failed:', error);
      });
  });
}

// PWA Install Prompt
let deferredPrompt;
const installButton = document.getElementById('install-button');

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later
  deferredPrompt = e;
  
  // Show install button if it exists
  if (installButton) {
    installButton.style.display = 'flex';
    installButton.addEventListener('click', () => {
      // Show the install prompt
      deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        deferredPrompt = null;
        installButton.style.display = 'none';
      });
    });
  }
});

// Show update notification
function showUpdateNotification() {
  const notification = document.createElement('div');
  notification.className = 'update-notification';
  notification.innerHTML = `
    <div class="update-content">
      <p>New version available! Refresh for updates.</p>
      <button id="refresh-button" class="btn btn-primary btn-sm">Refresh</button>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  document.getElementById('refresh-button').addEventListener('click', () => {
    window.location.reload();
  });
  
  // Auto-hide after 10 seconds
  setTimeout(() => {
    notification.remove();
  }, 10000);
}

// Offline Detection
window.addEventListener('online', () => {
  showToast('You are back online', 'success');
  // Sync any pending operations
  syncPendingOperations();
});

window.addEventListener('offline', () => {
  showToast('You are offline. Some features may be limited.', 'warning');
});

// Toast Notification System
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <div class="toast-content">
      <span class="toast-message">${message}</span>
      <button class="toast-close">&times;</button>
    </div>
  `;
  
  document.body.appendChild(toast);
  
  // Add close functionality
  const closeButton = toast.querySelector('.toast-close');
  closeButton.addEventListener('click', () => {
    toast.remove();
  });
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    toast.remove();
  }, 5000);
  
  // Add CSS for toast if not already present
  if (!document.querySelector('#toast-styles')) {
    const style = document.createElement('style');
    style.id = 'toast-styles';
    style.textContent = `
      .toast {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1000;
        min-width: 300px;
        max-width: 400px;
        background: white;
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-lg);
        border-left: 4px solid var(--gold);
        animation: slideIn 0.3s ease-out;
      }
      .toast-success { border-left-color: var(--green); }
      .toast-warning { border-left-color: var(--yellow); }
      .toast-danger { border-left-color: var(--red); }
      .toast-info { border-left-color: var(--blue); }
      .toast-content {
        padding: var(--spacing-md);
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--spacing-md);
      }
      .toast-message {
        flex: 1;
        font-size: 0.875rem;
      }
      .toast-close {
        background: none;
        border: none;
        font-size: 1.25rem;
        line-height: 1;
        color: var(--gray-600);
        cursor: pointer;
        padding: 0;
        width: 1.5rem;
        height: 1.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: var(--radius-sm);
      }
      .toast-close:hover {
        background-color: var(--gray-100);
      }
    `;
    document.head.appendChild(style);
  }
}

// Sync pending operations when back online
function syncPendingOperations() {
  const pending = JSON.parse(localStorage.getItem('pendingOperations') || '[]');
  if (pending.length > 0) {
    showToast('Syncing pending operations...', 'info');
    // In a real app, this would sync with backend
    setTimeout(() => {
      localStorage.removeItem('pendingOperations');
      showToast('All operations synced successfully', 'success');
    }, 2000);
  }
}

// Modal System
class Modal {
  constructor(modalId) {
    this.modal = document.getElementById(modalId);
    this.init();
  }
  
  init() {
    // Close modal when clicking outside
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.hide();
      }
    });
    
    // Close modal with escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal.classList.contains('show')) {
        this.hide();
      }
    });
    
    // Close button
    const closeBtn = this.modal.querySelector('.modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.hide());
    }
  }
  
  show() {
    this.modal.classList.add('show');
    document.body.style.overflow = 'hidden';
  }
  
  hide() {
    this.modal.classList.remove('show');
    document.body.style.overflow = '';
  }
}

// Initialize all modals on page
document.addEventListener('DOMContentLoaded', () => {
  const modals = document.querySelectorAll('.modal');
  modals.forEach(modal => {
    new Modal(modal.id);
  });
  
  // Mobile navigation toggle
  const navbarToggle = document.querySelector('.navbar-toggle');
  const navbarNav = document.querySelector('.navbar-nav');
  
  if (navbarToggle && navbarNav) {
    navbarToggle.addEventListener('click', () => {
      navbarNav.classList.toggle('show');
    });
    
    // Close mobile nav when clicking outside
    document.addEventListener('click', (e) => {
      if (!navbarToggle.contains(e.target) && !navbarNav.contains(e.target)) {
        navbarNav.classList.remove('show');
      }
    });
  }
  
  // Initialize tooltips
  const tooltips = document.querySelectorAll('[data-tooltip]');
  tooltips.forEach(element => {
    element.addEventListener('mouseenter', () => {
      const tooltipText = element.getAttribute('data-tooltip');
      if (tooltipText) {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip-text';
        tooltip.textContent = tooltipText;
        element.appendChild(tooltip);
      }
    });
    
    element.addEventListener('mouseleave', () => {
      const tooltip = element.querySelector('.tooltip-text');
      if (tooltip) {
        tooltip.remove();
      }
    });
  });
  
  // Initialize tabs
  const tabLinks = document.querySelectorAll('.tab-link');
  tabLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      const tabId = link.getAttribute('data-tab');
      const tabContent = document.getElementById(tabId);
      
      if (tabContent) {
        // Hide all tabs
        document.querySelectorAll('.tab-content').forEach(content => {
          content.classList.remove('active');
        });
        
        // Remove active class from all tab links
        document.querySelectorAll('.tab-link').forEach(tabLink => {
          tabLink.classList.remove('active');
        });
        
        // Show selected tab
        tabContent.classList.add('active');
        link.classList.add('active');
      }
    });
  });
  
  // Initialize dropdowns
  const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
  dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const dropdown = toggle.closest('.dropdown');
      const menu = dropdown.querySelector('.dropdown-menu');
      menu.classList.toggle('show');
    });
  });
  
  // Close dropdowns when clicking outside
  document.addEventListener('click', () => {
    document.querySelectorAll('.dropdown-menu').forEach(menu => {
      menu.classList.remove('show');
    });
  });
  
  // Form validation
  const forms = document.querySelectorAll('form[data-validate]');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      if (!validateForm(form)) {
        e.preventDefault();
      }
    });
  });
});

// Form validation function
function validateForm(form) {
  let isValid = true;
  const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
  
  inputs.forEach(input => {
    const errorElement = input.nextElementSibling?.classList.contains('error-message') 
      ? input.nextElementSibling 
      : null;
    
    if (!input.value.trim()) {
      showInputError(input, 'This field is required', errorElement);
      isValid = false;
    } else if (input.type === 'email' && !isValidEmail(input.value)) {
      showInputError(input, 'Please enter a valid email address', errorElement);
      isValid = false;
    } else if (input.type === 'tel' && !isValidPhone(input.value)) {
      showInputError(input, 'Please enter a valid phone number', errorElement);
      isValid = false;
    } else if (input.hasAttribute('data-min-length')) {
      const minLength = parseInt(input.getAttribute('data-min-length'));
      if (input.value.length < minLength) {
        showInputError(input, `Minimum ${minLength} characters required`, errorElement);
        isValid = false;
      }
    } else if (input.hasAttribute('data-match')) {
      const matchField = document.querySelector(input.getAttribute('data-match'));
      if (matchField && input.value !== matchField.value) {
        showInputError(input, 'Values do not match', errorElement);
        isValid = false;
      }
    } else {
      clearInputError(input, errorElement);
    }
  });
  
  return isValid;
}

function showInputError(input, message, errorElement = null) {
  input.classList.add('error');
  
  if (!errorElement) {
    errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    input.parentNode.insertBefore(errorElement, input.nextSibling);
  }
  
  errorElement.textContent = message;
  errorElement.style.display = 'block';
}

function clearInputError(input, errorElement = null) {
  input.classList.remove('error');
  
  if (errorElement) {
    errorElement.style.display = 'none';
  }
}

function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function isValidPhone(phone) {
  const re = /^[\+]?[1-9][\d]{0,15}$/;
  return re.test(phone.replace(/[\s\-\(\)]/g, ''));
}

// Currency formatting
function formatCurrency(amount, currency = 'KES') {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

// Date formatting
function formatDate(date, format = 'short') {
  const d = new Date(date);
  const options = {
    short: {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    },
    long: {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    },
    time: {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }
  };
  
  return d.toLocaleDateString('en-KE', options[format] || options.short);
}

// Calculate days between dates
function daysBetween(date1, date2) {
  const diff = Math.abs(new Date(date2) - new Date(date1));
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

// Calculate loan interest and penalties
function calculateLoanDetails(principal, interestRate = 10, penaltyRate = 5, overdueDays = 0) {
  const interest = (principal * interestRate) / 100;
  const totalWithoutPenalty = principal + interest;
  const penalty = overdueDays > 0 ? (totalWithoutPenalty * penaltyRate * overdueDays) / 100 : 0;
  const totalDue = totalWithoutPenalty + penalty;
  
  return {
    principal,
    interest,
    penalty,
    totalDue,
    overdueDays
  };
}

// Local storage helper
const Storage = {
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      return false;
    }
  },
  
  get(key) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  },
  
  remove(key) {
    localStorage.removeItem(key);
  },
  
  clear() {
    localStorage.clear();
  }
};

// Session management
const Session = {
  setUser(user) {
    Storage.set('currentUser', user);
  },
  
  getUser() {
    return Storage.get('currentUser');
  },
  
  clear() {
    Storage.remove('currentUser');
  },
  
  isLoggedIn() {
    return !!this.getUser();
  },
  
  getUserRole() {
    const user = this.getUser();
    return user ? user.role : null;
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    Modal,
    validateForm,
    formatCurrency,
    formatDate,
    calculateLoanDetails,
    Storage,
    Session,
    showToast
  };
}
