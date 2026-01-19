// assets/js/app.js
// App Bootstrap & Routing

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initApp();
    setupMobileMenu();
    setupScrollAnimations();
    setupIntersectionObserver();
    setupCountryRibbon();
    setupPWAInstall();
});

// Initialize app functionality
function initApp() {
    console.log('M-pesewa PWA initialized');
    
    // Check authentication status
    checkAuthStatus();
    
    // Set current year in footer
    const yearElement = document.querySelector('.current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
    
    // Setup form validations
    setupFormValidations();
    
    // Setup role switching
    setupRoleSwitching();
    
    // Setup loan calculator
    setupLoanCalculator();
}

// Mobile Menu Toggle
function setupMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navActions = document.querySelector('.nav-actions');
    
    if (mobileToggle) {
        mobileToggle.addEventListener('click', function() {
            const isOpen = this.classList.contains('active');
            
            this.classList.toggle('active');
            
            if (navLinks) {
                navLinks.style.display = isOpen ? 'none' : 'flex';
                navLinks.classList.toggle('mobile-open', !isOpen);
            }
            
            if (navActions) {
                navActions.style.display = isOpen ? 'none' : 'flex';
                navActions.classList.toggle('mobile-open', !isOpen);
            }
            
            // Transform hamburger to X
            const spans = this.querySelectorAll('span');
            if (!isOpen) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
        
        // Close mobile menu on link click
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                if (navLinks) navLinks.style.display = 'none';
                if (navActions) navActions.style.display = 'none';
                
                const spans = mobileToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
    }
}

// Scroll Animations
function setupScrollAnimations() {
    let scrollPosition = 0;
    const scrollProgress = document.createElement('div');
    scrollProgress.className = 'scroll-progress';
    document.body.appendChild(scrollProgress);
    
    window.addEventListener('scroll', function() {
        // Update scroll progress bar
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        scrollProgress.style.width = scrolled + '%';
        
        // Header shadow on scroll
        const header = document.querySelector('.main-header');
        if (window.scrollY > 100) {
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
        
        // Parallax effect for hero section
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            heroSection.style.transform = `translate3d(0px, ${rate}px, 0px)`;
        }
        
        scrollPosition = window.scrollY;
    });
}

// Intersection Observer for lazy loading and animations
function setupIntersectionObserver() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                
                // If it's a category card, add additional animation
                if (entry.target.classList.contains('category-card')) {
                    setTimeout(() => {
                        entry.target.classList.add('float');
                    }, 1000);
                }
            }
        });
    }, observerOptions);
    
    // Observe all elements with data-animate attribute
    document.querySelectorAll('[data-animate]').forEach(el => {
        observer.observe(el);
    });
    
    // Observe category cards
    document.querySelectorAll('.category-card').forEach((card, index) => {
        observer.observe(card);
    });
    
    // Observe success stories
    document.querySelectorAll('.story-card').forEach((card, index) => {
        observer.observe(card);
    });
}

// Country Ribbon Animation
function setupCountryRibbon() {
    const ribbonTrack = document.querySelector('.ribbon-track');
    const ribbonSlide = document.querySelector('.ribbon-slide');
    
    if (ribbonSlide) {
        // Calculate total width for seamless loop
        const ribbonWidth = ribbonSlide.scrollWidth;
        ribbonSlide.style.width = `${ribbonWidth}px`;
        
        // Pause animation on hover
        ribbonTrack.addEventListener('mouseenter', () => {
            ribbonSlide.style.animationPlayState = 'paused';
        });
        
        ribbonTrack.addEventListener('mouseleave', () => {
            ribbonSlide.style.animationPlayState = 'running';
        });
        
        // Reset animation to avoid jump
        ribbonSlide.addEventListener('animationiteration', () => {
            // Smooth reset for seamless loop
            ribbonSlide.style.transition = 'none';
            ribbonSlide.style.transform = 'translateX(0)';
            
            setTimeout(() => {
                ribbonSlide.style.transition = 'transform 0s linear';
            }, 50);
        });
    }
}

// Authentication Status Check
function checkAuthStatus() {
    const token = localStorage.getItem('mpesewa_token');
    const userRole = localStorage.getItem('mpesewa_role');
    
    if (token && userRole) {
        // User is logged in
        const loginBtn = document.querySelector('.btn-text');
        const registerBtn = document.querySelector('.btn-primary');
        
        if (loginBtn && registerBtn) {
            loginBtn.textContent = 'Dashboard';
            loginBtn.href = userRole === 'lender' ? 
                'pages/dashboard/lender-dashboard.html' : 
                'pages/dashboard/borrower-dashboard.html';
            
            registerBtn.textContent = 'Logout';
            registerBtn.href = '#';
            registerBtn.addEventListener('click', logoutUser);
        }
    }
}

function logoutUser(event) {
    event.preventDefault();
    localStorage.removeItem('mpesewa_token');
    localStorage.removeItem('mpesewa_role');
    localStorage.removeItem('mpesewa_user');
    window.location.href = 'index.html';
}

// Form Validations
function setupFormValidations() {
    const forms = document.querySelectorAll('form[data-validate]');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(event) {
            if (!validateForm(this)) {
                event.preventDefault();
                event.stopPropagation();
            }
        });
        
        // Add real-time validation
        const inputs = form.querySelectorAll('input[required], select[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
    });
}

function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], select[required]');
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name || field.id;
    let isValid = true;
    let errorMessage = '';
    
    // Required validation
    if (field.required && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }
    
    // Phone validation
    if (field.name === 'phone' && value) {
        const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
        if (!phoneRegex.test(value) || value.length < 8) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
    }
    
    // Password validation
    if (field.type === 'password' && value) {
        if (value.length < 8 || value.length > 12) {
            isValid = false;
            errorMessage = 'Password must be 8-12 characters';
        } else if (!/[A-Z]/.test(value) || !/[a-z]/.test(value) || 
                   !/[0-9]/.test(value) || !/[^A-Za-z0-9]/.test(value)) {
            isValid = false;
            errorMessage = 'Password must include uppercase, lowercase, number, and symbol';
        }
    }
    
    // Display error or success
    if (!isValid) {
        showFieldError(field, errorMessage);
    } else {
        clearFieldError(field);
        showFieldSuccess(field);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.color = '#dc3545';
    errorDiv.style.fontSize = '0.85rem';
    errorDiv.style.marginTop = '0.25rem';
    
    field.style.borderColor = '#dc3545';
    field.parentNode.appendChild(errorDiv);
}

function showFieldSuccess(field) {
    field.style.borderColor = '#28a745';
}

function clearFieldError(field) {
    field.style.borderColor = '';
    
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

// Role Switching
function setupRoleSwitching() {
    const roleSwitchers = document.querySelectorAll('[data-role-switch]');
    
    roleSwitchers.forEach(switcher => {
        switcher.addEventListener('click', function() {
            const targetRole = this.dataset.roleSwitch;
            switchRole(targetRole);
        });
    });
}

function switchRole(role) {
    // Update UI based on role
    const roleSections = document.querySelectorAll('[data-role]');
    
    roleSections.forEach(section => {
        if (section.dataset.role === role) {
            section.style.display = 'block';
        } else {
            section.style.display = 'none';
        }
    });
    
    // Update active state
    document.querySelectorAll('[data-role-switch]').forEach(btn => {
        if (btn.dataset.roleSwitch === role) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Store selected role
    localStorage.setItem('mpesewa_selected_role', role);
}

// Loan Calculator
function setupLoanCalculator() {
    const calculator = document.querySelector('#loanCalculator');
    
    if (calculator) {
        const amountInput = calculator.querySelector('#loanAmount');
        const periodSelect = calculator.querySelector('#loanPeriod');
        const resultElement = calculator.querySelector('#loanResult');
        
        if (amountInput && periodSelect && resultElement) {
            function calculateLoan() {
                const amount = parseFloat(amountInput.value) || 0;
                const period = parseInt(periodSelect.value) || 7;
                
                // M-pesewa rules: 10% interest for 7 days
                const interestRate = 0.10; // 10%
                const interest = amount * interestRate;
                const total = amount + interest;
                const dailyRepayment = total / period;
                
                // Display results
                resultElement.innerHTML = `
                    <div class="calculation-result">
                        <div class="result-row">
                            <span>Loan Amount:</span>
                            <strong>${formatCurrency(amount)}</strong>
                        </div>
                        <div class="result-row">
                            <span>Interest (10%):</span>
                            <strong>${formatCurrency(interest)}</strong>
                        </div>
                        <div class="result-row">
                            <span>Total Repayment:</span>
                            <strong class="total">${formatCurrency(total)}</strong>
                        </div>
                        <div class="result-row">
                            <span>Daily Repayment (${period} days):</span>
                            <strong>${formatCurrency(dailyRepayment)}</strong>
                        </div>
                    </div>
                `;
            }
            
            amountInput.addEventListener('input', calculateLoan);
            periodSelect.addEventListener('change', calculateLoan);
            
            // Initial calculation
            calculateLoan();
        }
    }
}

function formatCurrency(amount) {
    // Get user's country from localStorage or default to Kenya
    const country = localStorage.getItem('mpesewa_country') || 'KE';
    const currencies = {
        'KE': 'KSh',
        'UG': 'UGX',
        'TZ': 'TZS',
        'RW': 'RWF',
        'NG': 'NGN',
        'GH': 'GHS',
        'ZA': 'ZAR'
    };
    
    const currency = currencies[country] || 'KSh';
    return `${currency} ${amount.toFixed(2)}`;
}

// PWA Install Prompt
function setupPWAInstall() {
    let deferredPrompt;
    const installPrompt = document.getElementById('pwaPrompt');
    const installBtn = document.getElementById('pwaInstall');
    const cancelBtn = document.getElementById('pwaCancel');
    
    // Only show install prompt if not already installed
    if (window.matchMedia('(display-mode: standalone)').matches || 
        window.navigator.standalone) {
        return; // Already installed
    }
    
    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent Chrome 67 and earlier from automatically showing the prompt
        e.preventDefault();
        // Stash the event so it can be triggered later
        deferredPrompt = e;
        
        // Show install prompt after 5 seconds
        setTimeout(() => {
            if (installPrompt && !localStorage.getItem('pwaInstallDismissed')) {
                installPrompt.classList.add('show');
            }
        }, 5000);
    });
    
    if (installBtn) {
        installBtn.addEventListener('click', async () => {
            if (!deferredPrompt) return;
            
            // Show the install prompt
            deferredPrompt.prompt();
            
            // Wait for the user to respond to the prompt
            const { outcome } = await deferredPrompt.userChoice;
            
            if (outcome === 'accepted') {
                console.log('User accepted the install prompt');
                installPrompt.classList.remove('show');
            } else {
                console.log('User dismissed the install prompt');
            }
            
            // Clear the saved prompt since it can't be used again
            deferredPrompt = null;
        });
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            installPrompt.classList.remove('show');
            localStorage.setItem('pwaInstallDismissed', 'true');
        });
    }
}

// Offline Detection
function setupOfflineDetection() {
    // Update UI based on online/offline status
    function updateOnlineStatus() {
        const statusElement = document.getElementById('onlineStatus');
        if (statusElement) {
            if (navigator.onLine) {
                statusElement.textContent = 'Online';
                statusElement.className = 'online';
            } else {
                statusElement.textContent = 'Offline - Working locally';
                statusElement.className = 'offline';
                
                // Show offline notification
                showNotification('You are offline. Some features may be limited.', 'info');
            }
        }
    }
    
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    // Initial check
    updateOnlineStatus();
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">${message}</div>
        <button class="notification-close">&times;</button>
    `;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#dc3545' : type === 'success' ? '#28a745' : '#17a2b8'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        min-width: 300px;
        max-width: 400px;
        transform: translateX(150%);
        transition: transform 0.3s ease;
    `;
    
    // Add close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        line-height: 1;
    `;
    
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(150%)';
        setTimeout(() => notification.remove(), 300);
    });
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(150%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Export functions for use in other modules
window.mpesewaApp = {
    initApp,
    setupMobileMenu,
    setupScrollAnimations,
    setupCountryRibbon,
    checkAuthStatus,
    logoutUser,
    validateForm,
    validateField,
    switchRole,
    calculateLoan: setupLoanCalculator,
    showNotification,
    formatCurrency
};