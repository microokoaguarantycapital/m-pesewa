// layout/InstallBanner.js
// M-Pesewa InstallBanner Component - PWA Installation Promotion

class MPInstallBanner extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.deferredPrompt = null;
        this.isInstalled = false;
        this.isDismissed = localStorage.getItem('mpesewa_install_banner_dismissed') === 'true';
        this.hasInteracted = false;
        this.showCount = parseInt(localStorage.getItem('mpesewa_install_banner_show_count') || '0');
        this.maxShowCount = 3;
        this.installEvent = null;
    }

    connectedCallback() {
        this.checkInstallation();
        this.render();
        this.setupEventListeners();
        this.setupBeforeInstallPrompt();
        
        // Only show if not dismissed and not installed
        if (!this.isInstalled && !this.isDismissed && this.showCount < this.maxShowCount) {
            setTimeout(() => this.show(), 3000);
        }
    }

    checkInstallation() {
        // Check if app is installed
        this.isInstalled = window.matchMedia('(display-mode: standalone)').matches || 
                          window.navigator.standalone || 
                          document.referrer.includes('android-app://');
    }

    setupBeforeInstallPrompt() {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            this.installEvent = e;
            
            // Update UI to show install button
            this.updateInstallButton(true);
            
            // Log install prompt availability
            console.log('Install prompt available');
        });

        // Detect when app is installed
        window.addEventListener('appinstalled', () => {
            this.isInstalled = true;
            this.hide();
            this.showToast('M-Pesewa installed successfully!');
            
            // Log installation
            console.log('App installed');
        });
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                /* INSTALL BANNER STYLES */
                :host {
                    display: block;
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
                }
                
                .install-banner {
                    position: fixed;
                    bottom: 20px;
                    left: 50%;
                    transform: translateX(-50%) translateY(100%);
                    background: linear-gradient(135deg, #003366, #0099ff);
                    color: white;
                    border-radius: 12px;
                    padding: 20px;
                    width: 90%;
                    max-width: 500px;
                    box-shadow: 0 8px 32px rgba(0, 51, 102, 0.3);
                    z-index: 9999;
                    transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                    display: none;
                }
                
                .install-banner.visible {
                    display: block;
                    transform: translateX(-50%) translateY(0);
                }
                
                /* Compact version for mobile */
                .install-banner.compact {
                    bottom: 10px;
                    padding: 15px;
                    max-width: 350px;
                }
                
                /* Header */
                .install-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 15px;
                }
                
                .install-title {
                    font-size: 18px;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                
                .close-btn {
                    background: rgba(255, 255, 255, 0.1);
                    border: none;
                    width: 32px;
                    height: 32px;
                    border-radius: 8px;
                    color: white;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 18px;
                    transition: background 0.2s ease;
                }
                
                .close-btn:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
                
                /* Content */
                .install-content {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    margin-bottom: 20px;
                }
                
                .install-icon {
                    font-size: 40px;
                    flex-shrink: 0;
                }
                
                .install-text {
                    flex: 1;
                }
                
                .install-message {
                    font-size: 14px;
                    line-height: 1.5;
                    margin-bottom: 8px;
                }
                
                .install-benefits {
                    font-size: 12px;
                    opacity: 0.9;
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }
                
                .benefit-item {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }
                
                /* Actions */
                .install-actions {
                    display: flex;
                    gap: 10px;
                }
                
                .install-btn {
                    flex: 1;
                    padding: 12px;
                    border: none;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    transition: all 0.2s ease;
                }
                
                .install-btn.primary {
                    background: #f37021;
                    color: white;
                }
                
                .install-btn.primary:hover {
                    background: #e05a1a;
                    transform: translateY(-2px);
                }
                
                .install-btn.primary:active {
                    transform: translateY(0);
                }
                
                .install-btn.secondary {
                    background: rgba(255, 255, 255, 0.1);
                    color: white;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }
                
                .install-btn.secondary:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
                
                /* Installation instructions */
                .install-instructions {
                    margin-top: 20px;
                    padding-top: 20px;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    display: none;
                }
                
                .instructions-title {
                    font-size: 14px;
                    font-weight: 600;
                    margin-bottom: 12px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                
                .instructions-steps {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }
                
                .instruction-step {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-size: 13px;
                }
                
                .step-number {
                    width: 24px;
                    height: 24px;
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 12px;
                    font-weight: 600;
                }
                
                /* Success state */
                .install-success {
                    text-align: center;
                    padding: 20px;
                    display: none;
                }
                
                .success-icon {
                    font-size: 48px;
                    margin-bottom: 16px;
                    animation: bounce 0.5s ease;
                }
                
                .success-message {
                    font-size: 16px;
                    font-weight: 600;
                    margin-bottom: 8px;
                }
                
                .success-submessage {
                    font-size: 14px;
                    opacity: 0.9;
                }
                
                /* Animations */
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                
                @keyframes slideUp {
                    from { transform: translateX(-50%) translateY(100%); opacity: 0; }
                    to { transform: translateX(-50%) translateY(0); opacity: 1; }
                }
                
                @keyframes slideDown {
                    from { transform: translateX(-50%) translateY(0); opacity: 1; }
                    to { transform: translateX(-50%) translateY(100%); opacity: 0; }
                }
                
                /* Responsive */
                @media (max-width: 768px) {
                    .install-banner {
                        width: 95%;
                        bottom: 10px;
                        padding: 15px;
                    }
                    
                    .install-content {
                        flex-direction: column;
                        text-align: center;
                        gap: 12px;
                    }
                    
                    .install-actions {
                        flex-direction: column;
                    }
                }
                
                @media (max-width: 480px) {
                    .install-banner {
                        max-width: none;
                        border-radius: 8px;
                        margin: 0 10px;
                        left: 0;
                        right: 0;
                        transform: translateY(100%);
                        width: calc(100% - 20px);
                    }
                    
                    .install-banner.visible {
                        transform: translateY(0);
                    }
                    
                    @keyframes slideUp {
                        from { transform: translateY(100%); opacity: 0; }
                        to { transform: translateY(0); opacity: 1; }
                    }
                    
                    @keyframes slideDown {
                        from { transform: translateY(0); opacity: 1; }
                        to { transform: translateY(100%); opacity: 0; }
                    }
                }
                
                /* Dark mode adjustments */
                @media (prefers-color-scheme: dark) {
                    .install-banner {
                        background: linear-gradient(135deg, #002244, #0066cc);
                    }
                }
                
                /* Print styles */
                @media print {
                    .install-banner {
                        display: none !important;
                    }
                }
            </style>
            
            <div class="install-banner" id="installBanner">
                <!-- Header -->
                <div class="install-header">
                    <div class="install-title">
                        <span>📱</span>
                        <span>Install M-Pesewa</span>
                    </div>
                    <button class="close-btn" id="closeBanner" aria-label="Close install banner">×</button>
                </div>
                
                <!-- Content -->
                <div class="install-content">
                    <div class="install-icon">🚀</div>
                    <div class="install-text">
                        <div class="install-message">
                            Install M-Pesewa for faster access, offline capabilities, and push notifications.
                        </div>
                        <div class="install-benefits" id="installBenefits">
                            <!-- Filled dynamically -->
                        </div>
                    </div>
                </div>
                
                <!-- Actions -->
                <div class="install-actions" id="installActions">
                    <button class="install-btn primary" id="installButton">
                        <span>📥</span>
                        <span>Install App</span>
                    </button>
                    <button class="install-btn secondary" id="instructionsButton">
                        <span>❓</span>
                        <span>How to Install</span>
                    </button>
                </div>
                
                <!-- Installation Instructions -->
                <div class="install-instructions" id="installInstructions">
                    <div class="instructions-title">
                        <span>📋</span>
                        <span>Installation Guide</span>
                    </div>
                    <div class="instructions-steps" id="instructionsSteps">
                        <!-- Filled dynamically -->
                    </div>
                </div>
                
                <!-- Success State -->
                <div class="install-success" id="installSuccess">
                    <div class="success-icon">✅</div>
                    <div class="success-message">App Installed Successfully!</div>
                    <div class="success-submessage">You can now access M-Pesewa from your home screen.</div>
                </div>
            </div>
        `;
        
        this.renderBenefits();
        this.renderInstructions();
    }

    renderBenefits() {
        const benefitsContainer = this.shadowRoot.getElementById('installBenefits');
        if (!benefitsContainer) return;
        
        const benefits = [
            { icon: '⚡', text: 'Faster loading' },
            { icon: '📶', text: 'Works offline' },
            { icon: '🔔', text: 'Push notifications' },
            { icon: '🏠', text: 'Home screen access' }
        ];
        
        benefitsContainer.innerHTML = benefits.map(benefit => `
            <div class="benefit-item">
                <span>${benefit.icon}</span>
                <span>${benefit.text}</span>
            </div>
        `).join('');
    }

    renderInstructions() {
        const instructionsContainer = this.shadowRoot.getElementById('instructionsSteps');
        if (!instructionsContainer) return;
        
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        const isAndroid = /Android/.test(navigator.userAgent);
        
        let instructions = [];
        
        if (isIOS) {
            instructions = [
                { step: 1, text: 'Tap the Share button' },
                { step: 2, text: 'Scroll down and tap "Add to Home Screen"' },
                { step: 3, text: 'Tap "Add" in the top right corner' }
            ];
        } else if (isAndroid) {
            instructions = [
                { step: 1, text: 'Tap the menu button (⋮)' },
                { step: 2, text: 'Select "Install app" or "Add to Home Screen"' },
                { step: 3, text: 'Confirm installation in the popup' }
            ];
        } else {
            instructions = [
                { step: 1, text: 'Click the install button above' },
                { step: 2, text: 'Confirm installation in the browser prompt' },
                { step: 3, text: 'Launch from your apps or desktop' }
            ];
        }
        
        instructionsContainer.innerHTML = instructions.map(instruction => `
            <div class="instruction-step">
                <div class="step-number">${instruction.step}</div>
                <div class="step-text">${instruction.text}</div>
            </div>
        `).join('');
    }

    setupEventListeners() {
        // Close button
        const closeBtn = this.shadowRoot.getElementById('closeBanner');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.dismiss());
        }

        // Install button
        const installBtn = this.shadowRoot.getElementById('installButton');
        if (installBtn) {
            installBtn.addEventListener('click', () => this.installApp());
        }

        // Instructions button
        const instructionsBtn = this.shadowRoot.getElementById('instructionsButton');
        if (instructionsBtn) {
            instructionsBtn.addEventListener('click', () => this.toggleInstructions());
        }
    }

    show() {
        // Increment show count
        this.showCount++;
        localStorage.setItem('mpesewa_install_banner_show_count', this.showCount.toString());
        
        // Check if we should show based on conditions
        if (this.isInstalled || this.isDismissed || this.showCount > this.maxShowCount) {
            return;
        }
        
        const banner = this.shadowRoot.getElementById('installBanner');
        if (banner) {
            banner.classList.add('visible');
            
            // Add compact class for mobile
            if (window.innerWidth <= 480) {
                banner.classList.add('compact');
            }
            
            // Track that banner was shown
            this.hasInteracted = false;
            
            // Auto-hide after 30 seconds if no interaction
            setTimeout(() => {
                if (!this.hasInteracted && banner.classList.contains('visible')) {
                    this.dismiss();
                }
            }, 30000);
        }
    }

    hide() {
        const banner = this.shadowRoot.getElementById('installBanner');
        if (banner) {
            banner.classList.remove('visible');
        }
    }

    dismiss() {
        this.isDismissed = true;
        localStorage.setItem('mpesewa_install_banner_dismissed', 'true');
        this.hide();
        
        // Show toast
        this.showToast('Installation reminder dismissed');
    }

    async installApp() {
        if (!this.deferredPrompt && !this.installEvent) {
            // Show manual instructions
            this.showInstructions();
            return;
        }

        try {
            // Track install attempt
            this.hasInteracted = true;
            
            // Show the install prompt
            if (this.deferredPrompt) {
                this.deferredPrompt.prompt();
                
                // Wait for the user to respond to the prompt
                const { outcome } = await this.deferredPrompt.userChoice;
                
                // Log the outcome
                console.log(`User response to the install prompt: ${outcome}`);
                
                // Clear the deferredPrompt variable
                this.deferredPrompt = null;
                
                if (outcome === 'accepted') {
                    this.showSuccess();
                } else {
                    this.showInstructions();
                }
            } else if (this.installEvent) {
                // Fallback for older browsers
                this.installEvent.prompt();
                this.showInstructions();
            }
        } catch (error) {
            console.error('Installation failed:', error);
            this.showInstructions();
        }
    }

    showInstructions() {
        const instructions = this.shadowRoot.getElementById('installInstructions');
        const actions = this.shadowRoot.getElementById('installActions');
        
        if (instructions && actions) {
            instructions.style.display = 'block';
            actions.style.display = 'none';
            
            // Update banner height
            this.adjustBannerHeight();
        }
    }

    hideInstructions() {
        const instructions = this.shadowRoot.getElementById('installInstructions');
        const actions = this.shadowRoot.getElementById('installActions');
        
        if (instructions && actions) {
            instructions.style.display = 'none';
            actions.style.display = 'flex';
            
            // Update banner height
            this.adjustBannerHeight();
        }
    }

    toggleInstructions() {
        const instructions = this.shadowRoot.getElementById('installInstructions');
        if (instructions.style.display === 'block') {
            this.hideInstructions();
        } else {
            this.showInstructions();
        }
    }

    showSuccess() {
        const banner = this.shadowRoot.getElementById('installBanner');
        const content = this.shadowRoot.querySelector('.install-content');
        const actions = this.shadowRoot.getElementById('installActions');
        const instructions = this.shadowRoot.getElementById('installInstructions');
        const success = this.shadowRoot.getElementById('installSuccess');
        
        if (banner && content && actions && instructions && success) {
            content.style.display = 'none';
            actions.style.display = 'none';
            instructions.style.display = 'none';
            success.style.display = 'block';
            
            // Update banner height
            this.adjustBannerHeight();
            
            // Auto-hide after 3 seconds
            setTimeout(() => {
                this.hide();
            }, 3000);
        }
    }

    adjustBannerHeight() {
        const banner = this.shadowRoot.getElementById('installBanner');
        if (banner) {
            // Force reflow to update height
            banner.style.height = 'auto';
            const height = banner.offsetHeight;
            banner.style.height = height + 'px';
        }
    }

    updateInstallButton(show) {
        const installBtn = this.shadowRoot.getElementById('installButton');
        if (installBtn) {
            if (show) {
                installBtn.style.display = 'flex';
                installBtn.disabled = false;
            } else {
                installBtn.style.display = 'none';
            }
        }
    }

    showToast(message) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 80px;
            left: 50%;
            transform: translateX(-50%);
            background: #003366;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 14px;
            z-index: 10000;
            animation: slideUp 0.3s ease;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            max-width: 90%;
            text-align: center;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideDown 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Public methods
    resetDismissal() {
        this.isDismissed = false;
        localStorage.removeItem('mpesewa_install_banner_dismissed');
        this.showCount = 0;
        localStorage.removeItem('mpesewa_install_banner_show_count');
    }

    showForced() {
        this.resetDismissal();
        this.show();
    }

    checkAndShow() {
        // Only show if:
        // 1. Not already installed
        // 2. Not dismissed by user
        // 3. Haven't shown too many times
        // 4. User is engaged (has been on site for a while)
        
        if (this.isInstalled) {
            return false;
        }
        
        if (this.isDismissed) {
            return false;
        }
        
        if (this.showCount >= this.maxShowCount) {
            return false;
        }
        
        // Check user engagement (simplified)
        const timeOnSite = Date.now() - performance.timing.navigationStart;
        if (timeOnSite < 10000) { // Less than 10 seconds
            return false;
        }
        
        this.show();
        return true;
    }

    getInstallStatus() {
        return {
            installed: this.isInstalled,
            dismissed: this.isDismissed,
            showCount: this.showCount,
            maxShowCount: this.maxShowCount,
            canShow: !this.isInstalled && !this.isDismissed && this.showCount < this.maxShowCount
        };
    }

    // Event handler for beforeinstallprompt
    handleBeforeInstallPrompt(e) {
        e.preventDefault();
        this.deferredPrompt = e;
        this.updateInstallButton(true);
        
        // Show banner if conditions are met
        this.checkAndShow();
    }
}

// Register custom element
customElements.define('mp-install-banner', MPInstallBanner);

// Export for module usage
export default MPInstallBanner;