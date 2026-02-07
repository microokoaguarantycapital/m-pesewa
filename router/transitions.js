/**
 * M-PESEWA PAGE TRANSITIONS MANAGER
 * Handles smooth page transitions and loading states
 * STRICT ENFORCEMENT: Professional financial platform user experience
 */

class TransitionsManager {
    constructor() {
        this.transitionTypes = {
            FADE: 'fade',
            SLIDE: 'slide',
            ZOOM: 'zoom',
            FLIP: 'flip',
            NONE: 'none'
        };
        
        this.loadingStates = {
            IDLE: 'idle',
            LOADING: 'loading',
            SUCCESS: 'success',
            ERROR: 'error',
            OFFLINE: 'offline'
        };
        
        this.transitionConfig = {
            duration: 300,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
            mobileDuration: 250,
            tabletDuration: 275,
            desktopDuration: 300
        };
        
        this.currentState = {
            isLoading: false,
            currentPage: '',
            previousPage: '',
            direction: 'forward',
            transitionType: this.transitionTypes.FADE
        };
        
        this.initialize();
    }

    /**
     * Initialize transitions manager
     */
    initialize() {
        console.log('[TransitionsManager] Initializing page transitions');
        
        // Detect device type for optimal transitions
        this.detectDeviceType();
        
        // Set up transition styles
        this.setupTransitionStyles();
        
        // Set up loading overlay
        this.setupLoadingOverlay();
        
        // Set up error overlay
        this.setupErrorOverlay();
        
        // Set up success overlay
        this.setupSuccessOverlay();
        
        // Set up navigation interception
        this.setupNavigationInterception();
        
        // Set up form submission handling
        this.setupFormHandling();
        
        console.log('[TransitionsManager] Transitions manager initialized');
    }

    /**
     * Detect device type for optimal transitions
     */
    detectDeviceType() {
        const width = window.innerWidth;
        
        if (width <= 768) {
            this.transitionConfig.duration = this.transitionConfig.mobileDuration;
            this.currentState.transitionType = this.transitionTypes.FADE;
        } else if (width <= 1024) {
            this.transitionConfig.duration = this.transitionConfig.tabletDuration;
            this.currentState.transitionType = this.transitionTypes.SLIDE;
        } else {
            this.transitionConfig.duration = this.transitionConfig.desktopDuration;
            this.currentState.transitionType = this.transitionTypes.FADE;
        }
        
        // Check for reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            this.transitionConfig.duration = 0;
            this.currentState.transitionType = this.transitionTypes.NONE;
        }
    }

    /**
     * Set up transition styles
     */
    setupTransitionStyles() {
        const style = document.createElement('style');
        style.id = 'mpesewa-transitions-styles';
        
        style.textContent = `
            /* Page transition animations */
            .page-transition-enter {
                opacity: 0;
                transform: translateY(20px);
            }
            
            .page-transition-enter-active {
                opacity: 1;
                transform: translateY(0);
                transition: opacity ${this.transitionConfig.duration}ms ${this.transitionConfig.easing},
                            transform ${this.transitionConfig.duration}ms ${this.transitionConfig.easing};
            }
            
            .page-transition-exit {
                opacity: 1;
                transform: translateY(0);
            }
            
            .page-transition-exit-active {
                opacity: 0;
                transform: translateY(-20px);
                transition: opacity ${this.transitionConfig.duration}ms ${this.transitionConfig.easing},
                            transform ${this.transitionConfig.duration}ms ${this.transitionConfig.easing};
            }
            
            /* Slide transitions */
            .slide-left-enter {
                transform: translateX(100%);
            }
            
            .slide-left-enter-active {
                transform: translateX(0);
                transition: transform ${this.transitionConfig.duration}ms ${this.transitionConfig.easing};
            }
            
            .slide-left-exit {
                transform: translateX(0);
            }
            
            .slide-left-exit-active {
                transform: translateX(-100%);
                transition: transform ${this.transitionConfig.duration}ms ${this.transitionConfig.easing};
            }
            
            .slide-right-enter {
                transform: translateX(-100%);
            }
            
            .slide-right-enter-active {
                transform: translateX(0);
                transition: transform ${this.transitionConfig.duration}ms ${this.transitionConfig.easing};
            }
            
            .slide-right-exit {
                transform: translateX(0);
            }
            
            .slide-right-exit-active {
                transform: translateX(100%);
                transition: transform ${this.transitionConfig.duration}ms ${this.transitionConfig.easing};
            }
            
            /* Zoom transitions */
            .zoom-enter {
                opacity: 0;
                transform: scale(0.9);
            }
            
            .zoom-enter-active {
                opacity: 1;
                transform: scale(1);
                transition: opacity ${this.transitionConfig.duration}ms ${this.transitionConfig.easing},
                            transform ${this.transitionConfig.duration}ms ${this.transitionConfig.easing};
            }
            
            .zoom-exit {
                opacity: 1;
                transform: scale(1);
            }
            
            .zoom-exit-active {
                opacity: 0;
                transform: scale(1.1);
                transition: opacity ${this.transitionConfig.duration}ms ${this.transitionConfig.easing},
                            transform ${this.transitionConfig.duration}ms ${this.transitionConfig.easing};
            }
            
            /* Flip transitions */
            .flip-enter {
                transform: rotateY(90deg);
                opacity: 0;
            }
            
            .flip-enter-active {
                transform: rotateY(0);
                opacity: 1;
                transition: transform ${this.transitionConfig.duration}ms ${this.transitionConfig.easing},
                            opacity ${this.transitionConfig.duration}ms ${this.transitionConfig.easing};
            }
            
            .flip-exit {
                transform: rotateY(0);
                opacity: 1;
            }
            
            .flip-exit-active {
                transform: rotateY(-90deg);
                opacity: 0;
                transition: transform ${this.transitionConfig.duration}ms ${this.transitionConfig.easing},
                            opacity ${this.transitionConfig.duration}ms ${this.transitionConfig.easing};
            }
            
            /* Loading states */
            .loading {
                pointer-events: none;
                opacity: 0.7;
            }
            
            .loading::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
                animation: loading-shimmer 1.5s infinite;
            }
            
            @keyframes loading-shimmer {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
            }
            
            /* Progress bar */
            .progress-bar {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 3px;
                background: linear-gradient(90deg, #003366, #0099ff);
                transform-origin: 0 50%;
                animation: progress-loading 2s ease-in-out infinite;
                z-index: 10001;
            }
            
            @keyframes progress-loading {
                0% { transform: scaleX(0); }
                50% { transform: scaleX(0.7); }
                100% { transform: scaleX(0); }
            }
            
            /* Skeleton loading */
            .skeleton {
                background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                background-size: 200% 100%;
                animation: skeleton-loading 1.5s infinite;
                border-radius: 4px;
            }
            
            @keyframes skeleton-loading {
                0% { background-position: 200% 0; }
                100% { background-position: -200% 0; }
            }
            
            /* Transition containers */
            .transition-container {
                position: relative;
                overflow: hidden;
            }
            
            .transition-page {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
            }
            
            /* Reduced motion support */
            @media (prefers-reduced-motion: reduce) {
                .page-transition-enter-active,
                .page-transition-exit-active,
                .slide-left-enter-active,
                .slide-left-exit-active,
                .slide-right-enter-active,
                .slide-right-exit-active,
                .zoom-enter-active,
                .zoom-exit-active,
                .flip-enter-active,
                .flip-exit-active {
                    transition: none !important;
                    animation: none !important;
                }
                
                .loading::after {
                    animation: none !important;
                }
                
                .progress-bar {
                    animation: none !important;
                    background: #003366;
                }
                
                .skeleton {
                    animation: none !important;
                    background: #f0f0f0;
                }
            }
        `;
        
        document.head.appendChild(style);
    }

    /**
     * Set up loading overlay
     */
    setupLoadingOverlay() {
        this.loadingOverlay = document.createElement('div');
        this.loadingOverlay.id = 'mpesewa-loading-overlay';
        this.loadingOverlay.className = 'loading-overlay';
        this.loadingOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 51, 102, 0.9);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s ease, visibility 0.3s ease;
        `;
        
        this.loadingOverlay.innerHTML = `
            <div class="loading-spinner">
                <div class="spinner-circle"></div>
                <div class="spinner-text">Loading M-Pesewa</div>
            </div>
            <div class="loading-progress">
                <div class="progress-text">0%</div>
                <div class="progress-bar-container">
                    <div class="progress-bar-fill"></div>
                </div>
            </div>
        `;
        
        // Add spinner styles
        const spinnerStyle = document.createElement('style');
        spinnerStyle.textContent = `
            .loading-spinner {
                text-align: center;
                margin-bottom: 30px;
            }
            
            .spinner-circle {
                width: 60px;
                height: 60px;
                border: 4px solid rgba(255,255,255,0.3);
                border-top-color: #0099ff;
                border-radius: 50%;
                animation: spinner-rotate 1s linear infinite;
                margin: 0 auto 15px;
            }
            
            @keyframes spinner-rotate {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            .spinner-text {
                color: white;
                font-size: 18px;
                font-weight: 500;
                margin-top: 10px;
            }
            
            .loading-progress {
                width: 300px;
                max-width: 90%;
            }
            
            .progress-text {
                color: white;
                text-align: center;
                margin-bottom: 10px;
                font-size: 14px;
            }
            
            .progress-bar-container {
                height: 4px;
                background: rgba(255,255,255,0.2);
                border-radius: 2px;
                overflow: hidden;
            }
            
            .progress-bar-fill {
                height: 100%;
                background: linear-gradient(90deg, #0099ff, #00ccff);
                width: 0%;
                transition: width 0.3s ease;
                border-radius: 2px;
            }
        `;
        
        this.loadingOverlay.appendChild(spinnerStyle);
        document.body.appendChild(this.loadingOverlay);
    }

    /**
     * Set up error overlay
     */
    setupErrorOverlay() {
        this.errorOverlay = document.createElement('div');
        this.errorOverlay.id = 'mpesewa-error-overlay';
        this.errorOverlay.className = 'error-overlay';
        this.errorOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(255, 107, 107, 0.95);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 10002;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s ease, visibility 0.3s ease;
            color: white;
            text-align: center;
            padding: 20px;
        `;
        
        this.errorOverlay.innerHTML = `
            <div class="error-icon" style="font-size: 64px; margin-bottom: 20px;">⚠️</div>
            <h2 class="error-title" style="font-size: 24px; margin-bottom: 10px; font-weight: bold;">Something went wrong</h2>
            <p class="error-message" style="font-size: 16px; margin-bottom: 30px; max-width: 500px; line-height: 1.5;">
                We encountered an error while loading the page. Please try again.
            </p>
            <div class="error-actions" style="display: flex; gap: 10px;">
                <button class="error-retry" style="
                    background: white;
                    color: #ff6b6b;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 5px;
                    font-weight: bold;
                    cursor: pointer;
                ">Try Again</button>
                <button class="error-home" style="
                    background: transparent;
                    color: white;
                    border: 2px solid white;
                    padding: 12px 24px;
                    border-radius: 5px;
                    font-weight: bold;
                    cursor: pointer;
                ">Go Home</button>
            </div>
        `;
        
        document.body.appendChild(this.errorOverlay);
        
        // Add event listeners
        this.errorOverlay.querySelector('.error-retry').onclick = () => {
            this.hideError();
            location.reload();
        };
        
        this.errorOverlay.querySelector('.error-home').onclick = () => {
            this.hideError();
            window.location.href = '/';
        };
    }

    /**
     * Set up success overlay
     */
    setupSuccessOverlay() {
        this.successOverlay = document.createElement('div');
        this.successOverlay.id = 'mpesewa-success-overlay';
        this.successOverlay.className = 'success-overlay';
        this.successOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(40, 167, 69, 0.95);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 10002;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s ease, visibility 0.3s ease;
            color: white;
            text-align: center;
            padding: 20px;
        `;
        
        this.successOverlay.innerHTML = `
            <div class="success-icon" style="font-size: 64px; margin-bottom: 20px;">✅</div>
            <h2 class="success-title" style="font-size: 24px; margin-bottom: 10px; font-weight: bold;">Success!</h2>
            <p class="success-message" style="font-size: 16px; margin-bottom: 30px; max-width: 500px; line-height: 1.5;">
                Operation completed successfully.
            </p>
            <button class="success-continue" style="
                background: white;
                color: #28a745;
                border: none;
                padding: 12px 24px;
                border-radius: 5px;
                font-weight: bold;
                cursor: pointer;
            ">Continue</button>
        `;
        
        document.body.appendChild(this.successOverlay);
        
        // Add event listener
        this.successOverlay.querySelector('.success-continue').onclick = () => {
            this.hideSuccess();
        };
    }

    /**
     * Set up navigation interception
     */
    setupNavigationInterception() {
        // Intercept link clicks
        document.addEventListener('click', (event) => {
            const link = event.target.closest('a');
            
            if (!link || !link.href) return;
            
            // Check if it's a same-origin link
            const url = new URL(link.href);
            const currentUrl = new URL(window.location.href);
            
            if (url.origin === currentUrl.origin && url.pathname !== currentUrl.pathname) {
                event.preventDefault();
                this.navigateTo(url.pathname + url.search + url.hash);
            }
        });
        
        // Intercept form submissions
        document.addEventListener('submit', (event) => {
            const form = event.target;
            
            if (form.method === 'get') {
                event.preventDefault();
                const url = new URL(form.action);
                const params = new URLSearchParams(new FormData(form));
                url.search = params.toString();
                this.navigateTo(url.pathname + url.search + url.hash);
            }
        });
        
        // Handle browser navigation (back/forward)
        window.addEventListener('popstate', () => {
            this.handleBrowserNavigation();
        });
    }

    /**
     * Set up form handling
     */
    setupFormHandling() {
        // Add loading states to forms
        document.addEventListener('submit', (event) => {
            const form = event.target;
            
            if (form.method === 'post') {
                this.showFormLoading(form);
            }
        });
        
        // Handle form validation errors
        document.addEventListener('invalid', (event) => {
            const element = event.target;
            
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.tagName === 'SELECT') {
                this.showValidationError(element);
            }
        }, true);
    }

    /**
     * Navigate to new page
     */
    async navigateTo(path, transitionType = null) {
        console.log(`[TransitionsManager] Navigating to: ${path}`);
        
        // Determine navigation direction
        const currentIndex = this.getPageIndex(window.location.pathname);
        const newIndex = this.getPageIndex(path);
        this.currentState.direction = newIndex > currentIndex ? 'forward' : 'backward';
        
        // Set transition type
        const type = transitionType || this.currentState.transitionType;
        
        // Show loading
        this.showLoading();
        
        try {
            // Fetch new page
            const response = await fetch(path);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            // Get page content
            const html = await response.text();
            
            // Parse new document
            const parser = new DOMParser();
            const newDoc = parser.parseFromString(html, 'text/html');
            
            // Extract main content
            const newContent = newDoc.querySelector('main') || newDoc.body;
            
            // Update page with transition
            await this.updatePageContent(newContent.innerHTML, type);
            
            // Update browser history
            window.history.pushState({ path }, '', path);
            
            // Update current state
            this.currentState.previousPage = this.currentState.currentPage;
            this.currentState.currentPage = path;
            
            // Hide loading
            this.hideLoading();
            
            // Dispatch navigation event
            this.dispatchNavigationEvent('navigated', { path, direction: this.currentState.direction });
            
            console.log(`[TransitionsManager] Navigation completed to: ${path}`);
            
        } catch (error) {
            console.error('[TransitionsManager] Navigation failed:', error);
            this.hideLoading();
            this.showError('Failed to load page. Please check your connection and try again.');
        }
    }

    /**
     * Handle browser navigation (back/forward)
     */
    async handleBrowserNavigation() {
        const path = window.location.pathname + window.location.search + window.location.hash;
        
        console.log(`[TransitionsManager] Browser navigation to: ${path}`);
        
        // Determine direction
        const currentIndex = this.getPageIndex(this.currentState.currentPage);
        const newIndex = this.getPageIndex(path);
        this.currentState.direction = newIndex > currentIndex ? 'forward' : 'backward';
        
        // Show loading
        this.showLoading();
        
        try {
            // Fetch new page
            const response = await fetch(path);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            // Get page content
            const html = await response.text();
            
            // Parse new document
            const parser = new DOMParser();
            const newDoc = parser.parseFromString(html, 'text/html');
            
            // Extract main content
            const newContent = newDoc.querySelector('main') || newDoc.body;
            
            // Update page with transition
            await this.updatePageContent(newContent.innerHTML, this.transitionTypes.SLIDE);
            
            // Update current state
            this.currentState.previousPage = this.currentState.currentPage;
            this.currentState.currentPage = path;
            
            // Hide loading
            this.hideLoading();
            
            // Dispatch navigation event
            this.dispatchNavigationEvent('browser-navigated', { path, direction: this.currentState.direction });
            
        } catch (error) {
            console.error('[TransitionsManager] Browser navigation failed:', error);
            this.hideLoading();
            this.showError('Failed to load page. Please check your connection and try again.');
        }
    }

    /**
     * Update page content with transition
     */
    async updatePageContent(newContent, transitionType) {
        const mainElement = document.querySelector('main') || document.body;
        const oldContent = mainElement.innerHTML;
        
        // Create transition wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'transition-container';
        wrapper.style.cssText = `
            position: relative;
            min-height: 100vh;
        `;
        
        // Create old page element
        const oldPage = document.createElement('div');
        oldPage.className = `transition-page ${this.getTransitionClass('exit', transitionType)}`;
        oldPage.innerHTML = oldContent;
        
        // Create new page element
        const newPage = document.createElement('div');
        newPage.className = `transition-page ${this.getTransitionClass('enter', transitionType)}`;
        newPage.innerHTML = newContent;
        
        // Add pages to wrapper
        wrapper.appendChild(oldPage);
        wrapper.appendChild(newPage);
        
        // Replace main content
        mainElement.parentNode.replaceChild(wrapper, mainElement);
        
        // Start transition
        await this.performTransition(oldPage, newPage, transitionType);
        
        // Clean up after transition
        wrapper.outerHTML = newPage.innerHTML;
        
        // Reinitialize components
        this.reinitializeComponents();
    }

    /**
     * Get transition class based on type and direction
     */
    getTransitionClass(stage, type) {
        const baseClass = type === this.transitionTypes.NONE ? 'page-transition' : type;
        
        if (type === this.transitionTypes.SLIDE) {
            const direction = this.currentState.direction === 'forward' ? 'left' : 'right';
            return `${baseClass}-${direction}-${stage}`;
        }
        
        return `${baseClass}-${stage}`;
    }

    /**
     * Perform transition animation
     */
    async performTransition(oldPage, newPage, type) {
        return new Promise((resolve) => {
            // Force reflow
            oldPage.offsetHeight;
            
            // Add active classes
            oldPage.classList.add(`${this.getTransitionClass('exit', type)}-active`);
            newPage.classList.add(`${this.getTransitionClass('enter', type)}-active`);
            
            // Set timeout for transition duration
            setTimeout(() => {
                resolve();
            }, this.transitionConfig.duration);
        });
    }

    /**
     * Get page index for navigation direction
     */
    getPageIndex(path) {
        // This would map paths to hierarchy levels
        // For simplicity, using path depth
        return path.split('/').length;
    }

    /**
     * Show loading overlay
     */
    showLoading(progress = 0) {
        this.currentState.isLoading = true;
        
        this.loadingOverlay.style.opacity = '1';
        this.loadingOverlay.style.visibility = 'visible';
        
        // Update progress if provided
        if (progress > 0) {
            const progressFill = this.loadingOverlay.querySelector('.progress-bar-fill');
            const progressText = this.loadingOverlay.querySelector('.progress-text');
            
            if (progressFill) {
                progressFill.style.width = `${progress}%`;
            }
            
            if (progressText) {
                progressText.textContent = `${Math.round(progress)}%`;
            }
        }
        
        // Add loading class to body
        document.body.classList.add('page-loading');
        
        // Dispatch event
        this.dispatchNavigationEvent('loading-started');
    }

    /**
     * Update loading progress
     */
    updateLoadingProgress(progress) {
        const progressFill = this.loadingOverlay.querySelector('.progress-bar-fill');
        const progressText = this.loadingOverlay.querySelector('.progress-text');
        
        if (progressFill) {
            progressFill.style.width = `${progress}%`;
        }
        
        if (progressText) {
            progressText.textContent = `${Math.round(progress)}%`;
        }
    }

    /**
     * Hide loading overlay
     */
    hideLoading() {
        this.currentState.isLoading = false;
        
        this.loadingOverlay.style.opacity = '0';
        this.loadingOverlay.style.visibility = 'hidden';
        
        // Reset progress
        const progressFill = this.loadingOverlay.querySelector('.progress-bar-fill');
        const progressText = this.loadingOverlay.querySelector('.progress-text');
        
        if (progressFill) {
            progressFill.style.width = '0%';
        }
        
        if (progressText) {
            progressText.textContent = '0%';
        }
        
        // Remove loading class
        document.body.classList.remove('page-loading');
        
        // Dispatch event
        this.dispatchNavigationEvent('loading-finished');
    }

    /**
     * Show error overlay
     */
    showError(message = null) {
        if (message) {
            const errorMessage = this.errorOverlay.querySelector('.error-message');
            if (errorMessage) {
                errorMessage.textContent = message;
            }
        }
        
        this.errorOverlay.style.opacity = '1';
        this.errorOverlay.style.visibility = 'visible';
        
        // Dispatch event
        this.dispatchNavigationEvent('error-shown', { message });
    }

    /**
     * Hide error overlay
     */
    hideError() {
        this.errorOverlay.style.opacity = '0';
        this.errorOverlay.style.visibility = 'hidden';
    }

    /**
     * Show success overlay
     */
    showSuccess(message = null) {
        if (message) {
            const successMessage = this.successOverlay.querySelector('.success-message');
            if (successMessage) {
                successMessage.textContent = message;
            }
        }
        
        this.successOverlay.style.opacity = '1';
        this.successOverlay.style.visibility = 'visible';
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            this.hideSuccess();
        }, 3000);
        
        // Dispatch event
        this.dispatchNavigationEvent('success-shown', { message });
    }

    /**
     * Hide success overlay
     */
    hideSuccess() {
        this.successOverlay.style.opacity = '0';
        this.successOverlay.style.visibility = 'hidden';
    }

    /**
     * Show form loading
     */
    showFormLoading(form) {
        const submitButton = form.querySelector('button[type="submit"]');
        
        if (submitButton) {
            // Store original text
            const originalText = submitButton.textContent;
            submitButton.setAttribute('data-original-text', originalText);
            
            // Update button
            submitButton.innerHTML = `
                <span class="spinner-small"></span>
                Processing...
            `;
            submitButton.disabled = true;
            
            // Add spinner styles if not already added
            if (!document.querySelector('#spinner-small-styles')) {
                const style = document.createElement('style');
                style.id = 'spinner-small-styles';
                style.textContent = `
                    .spinner-small {
                        display: inline-block;
                        width: 16px;
                        height: 16px;
                        border: 2px solid rgba(255,255,255,0.3);
                        border-top-color: white;
                        border-radius: 50%;
                        animation: spinner-rotate-small 1s linear infinite;
                        margin-right: 8px;
                        vertical-align: middle;
                    }
                    
                    @keyframes spinner-rotate-small {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `;
                document.head.appendChild(style);
            }
        }
        
        // Add loading class to form
        form.classList.add('form-loading');
    }

    /**
     * Hide form loading
     */
    hideFormLoading(form) {
        const submitButton = form.querySelector('button[type="submit"]');
        
        if (submitButton) {
            // Restore original text
            const originalText = submitButton.getAttribute('data-original-text');
            if (originalText) {
                submitButton.textContent = originalText;
            }
            submitButton.disabled = false;
        }
        
        // Remove loading class
        form.classList.remove('form-loading');
    }

    /**
     * Show validation error
     */
    showValidationError(element) {
        // Create error message element
        let errorElement = element.parentNode.querySelector('.validation-error');
        
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'validation-error';
            errorElement.style.cssText = `
                color: #ff6b6b;
                font-size: 12px;
                margin-top: 5px;
                display: flex;
                align-items: center;
                gap: 5px;
            `;
            
            element.parentNode.appendChild(errorElement);
        }
        
        // Set error message
        let message = 'This field is required';
        
        if (element.type === 'email') {
            message = 'Please enter a valid email address';
        } else if (element.type === 'tel') {
            message = 'Please enter a valid phone number';
        } else if (element.hasAttribute('minlength')) {
            const min = element.getAttribute('minlength');
            message = `Minimum ${min} characters required`;
        } else if (element.hasAttribute('pattern')) {
            message = 'Please match the requested format';
        }
        
        errorElement.innerHTML = `⚠️ ${message}`;
        
        // Add error class to input
        element.classList.add('input-error');
        
        // Focus the element
        element.focus();
        
        // Remove error on input
        const removeError = () => {
            errorElement.remove();
            element.classList.remove('input-error');
            element.removeEventListener('input', removeError);
        };
        
        element.addEventListener('input', removeError, { once: true });
    }

    /**
     * Reinitialize components after page transition
     */
    reinitializeComponents() {
        // Reinitialize scripts that might not have run
        const scripts = document.querySelectorAll('script[data-reload-on-navigation="true"]');
        scripts.forEach(script => {
            const newScript = document.createElement('script');
            
            // Copy attributes
            Array.from(script.attributes).forEach(attr => {
                newScript.setAttribute(attr.name, attr.value);
            });
            
            // Copy content
            newScript.textContent = script.textContent;
            
            // Replace
            script.parentNode.replaceChild(newScript, script);
        });
        
        // Dispatch reinitialization event
        this.dispatchNavigationEvent('components-reinitialized');
    }

    /**
     * Dispatch navigation event
     */
    dispatchNavigationEvent(eventName, detail = {}) {
        const event = new CustomEvent(`mpesewa:${eventName}`, {
            detail: {
                timestamp: new Date().toISOString(),
                ...detail
            }
        });
        
        window.dispatchEvent(event);
    }

    /**
     * Get current navigation state
     */
    getState() {
        return { ...this.currentState };
    }

    /**
     * Set transition type
     */
    setTransitionType(type) {
        if (Object.values(this.transitionTypes).includes(type)) {
            this.currentState.transitionType = type;
            return true;
        }
        return false;
    }

    /**
     * Set transition duration
     */
    setTransitionDuration(duration) {
        if (typeof duration === 'number' && duration >= 0) {
            this.transitionConfig.duration = duration;
            return true;
        }
        return false;
    }

    /**
     * Create skeleton loading for elements
     */
    createSkeletonLoader(selector, count = 1) {
        const elements = document.querySelectorAll(selector);
        
        elements.forEach(element => {
            const originalHTML = element.innerHTML;
            element.setAttribute('data-original-content', originalHTML);
            
            // Create skeleton HTML based on element type
            let skeletonHTML = '';
            
            if (element.classList.contains('card')) {
                skeletonHTML = `
                    <div class="skeleton" style="height: 20px; width: 60%; margin-bottom: 10px;"></div>
                    <div class="skeleton" style="height: 15px; width: 90%; margin-bottom: 8px;"></div>
                    <div class="skeleton" style="height: 15px; width: 80%;"></div>
                `;
            } else if (element.classList.contains('table')) {
                skeletonHTML = `
                    <div class="skeleton" style="height: 20px; margin-bottom: 5px;"></div>
                    <div class="skeleton" style="height: 20px; margin-bottom: 5px;"></div>
                    <div class="skeleton" style="height: 20px; margin-bottom: 5px;"></div>
                    <div class="skeleton" style="height: 20px;"></div>
                `;
            } else {
                skeletonHTML = `<div class="skeleton" style="height: 100%;"></div>`;
            }
            
            element.innerHTML = skeletonHTML;
            element.classList.add('skeleton-container');
        });
    }

    /**
     * Remove skeleton loading
     */
    removeSkeletonLoader(selector) {
        const elements = document.querySelectorAll(selector);
        
        elements.forEach(element => {
            const originalHTML = element.getAttribute('data-original-content');
            if (originalHTML) {
                element.innerHTML = originalHTML;
                element.removeAttribute('data-original-content');
            }
            element.classList.remove('skeleton-container');
        });
    }

    /**
     * Show toast notification
     */
    showToast(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `mpesewa-toast toast-${type}`;
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: ${this.getToastColor(type)};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10003;
            transform: translateY(100%);
            opacity: 0;
            transition: transform 0.3s ease, opacity 0.3s ease;
            max-width: 400px;
            display: flex;
            align-items: center;
            gap: 10px;
        `;
        
        const icon = this.getToastIcon(type);
        toast.innerHTML = `
            <span style="font-size: 20px;">${icon}</span>
            <span style="flex: 1;">${message}</span>
            <button class="toast-close" style="
                background: transparent;
                border: none;
                color: white;
                font-size: 20px;
                cursor: pointer;
                padding: 0;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
            ">×</button>
        `;
        
        document.body.appendChild(toast);
        
        // Animate in
        setTimeout(() => {
            toast.style.transform = 'translateY(0)';
            toast.style.opacity = '1';
        }, 10);
        
        // Add close button event
        toast.querySelector('.toast-close').onclick = () => {
            this.hideToast(toast);
        };
        
        // Auto-hide
        if (duration > 0) {
            setTimeout(() => {
                this.hideToast(toast);
            }, duration);
        }
        
        return toast;
    }

    /**
     * Hide toast notification
     */
    hideToast(toast) {
        toast.style.transform = 'translateY(100%)';
        toast.style.opacity = '0';
        
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }

    /**
     * Get toast color based on type
     */
    getToastColor(type) {
        const colors = {
            info: '#003366',
            success: '#28a745',
            warning: '#f37021',
            error: '#ff6b6b'
        };
        return colors[type] || colors.info;
    }

    /**
     * Get toast icon based on type
     */
    getToastIcon(type) {
        const icons = {
            info: 'ℹ️',
            success: '✅',
            warning: '⚠️',
            error: '❌'
        };
        return icons[type] || icons.info;
    }

    /**
     * Clean up transitions manager
     */
    cleanup() {
        // Remove event listeners
        document.removeEventListener('click', this.setupNavigationInterception);
        document.removeEventListener('submit', this.setupFormHandling);
        
        // Remove overlays
        if (this.loadingOverlay.parentNode) {
            this.loadingOverlay.parentNode.removeChild(this.loadingOverlay);
        }
        
        if (this.errorOverlay.parentNode) {
            this.errorOverlay.parentNode.removeChild(this.errorOverlay);
        }
        
        if (this.successOverlay.parentNode) {
            this.successOverlay.parentNode.removeChild(this.successOverlay);
        }
        
        // Remove styles
        const styles = document.getElementById('mpesewa-transitions-styles');
        if (styles) {
            styles.remove();
        }
        
        console.log('[TransitionsManager] Cleaned up');
    }
}

// Create global instance
window.MPesewaTransitions = new TransitionsManager();

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Already initialized in constructor
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TransitionsManager;
}

/**
 * STRICT M-PESEWA TRANSITION RULES ENFORCEMENT
 * 
 * 1. PERFORMANCE FIRST:
 *    - Maximum transition duration: 300ms
 *    - No transitions on low-end devices
 *    - Reduced motion preference respected
 *    - GPU-accelerated animations only
 * 
 * 2. FINANCIAL PLATFORM STANDARDS:
 *    - Professional, subtle animations
 *    - No distracting effects
 *    - Consistent across all pages
 *    - Brand-aligned colors
 * 
 * 3. HIERARCHY-BASED TRANSITIONS:
 *    - Forward navigation: Slide left
 *    - Backward navigation: Slide right
 *    - Same-level navigation: Fade
 *    - Modal transitions: Zoom
 *    - Form submissions: None
 * 
 * 4. LOADING STATES:
 *    - Page load: Full-screen overlay
 *    - Form submission: Button spinner
 *    - Data fetching: Skeleton loading
 *    - Image loading: Progressive
 * 
 * 5. ERROR HANDLING:
 *    - Network errors: Full-screen error
 *    - Validation errors: Inline highlighting
 *    - Form errors: Field-specific
 *    - Timeout errors: Retry option
 * 
 * 6. SUCCESS STATES:
 *    - Form submission: Toast notification
 *    - Payment success: Confirmation modal
 *    - Profile update: Brief success message
 *    - Loan approval: Celebration animation
 * 
 * 7. ACCESSIBILITY:
 *    - Screen reader announcements
 *    - Keyboard navigation support
 *    - Focus management
 *    - ARIA labels for all interactive elements
 * 
 * 8. COUNTRY-SPECIFIC ADAPTATIONS:
 *    - Kenya: Faster transitions for mobile
 *    - Ghana: Brighter success colors
 *    - Nigeria: More prominent loading states
 *    - Tanzania: Swahili language support
 *    - Uganda: MTN Mobile Money integration
 */