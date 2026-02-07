/**
 * M-Pesewa Flag Ribbon Motion Controller
 * Handles animations, transitions, and motion effects for the flag ribbon
 */

class MotionController {
    constructor(ribbonInstance) {
        this.ribbon = ribbonInstance;
        this.animations = new Map();
        this.transitions = new Map();
        this.isAnimating = false;
        this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        // Initialize motion effects
        this.initMotionEffects();
        this.setupReducedMotionListener();
    }

    /**
     * Initialize motion effects based on user preferences
     */
    initMotionEffects() {
        if (this.prefersReducedMotion) {
            this.disableAllAnimations();
            return;
        }

        // Register default animations
        this.registerAnimations();
        this.registerTransitions();
    }

    /**
     * Setup listener for reduced motion preference changes
     */
    setupReducedMotionListener() {
        const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        motionQuery.addEventListener('change', (e) => {
            this.prefersReducedMotion = e.matches;
            if (e.matches) {
                this.disableAllAnimations();
            } else {
                this.enableAllAnimations();
            }
        });
    }

    /**
     * Register all available animations
     */
    registerAnimations() {
        // Flag bounce animation
        this.animations.set('flagBounce', {
            keyframes: [
                { transform: 'scale(1)', opacity: 1 },
                { transform: 'scale(1.1)', opacity: 0.9 },
                { transform: 'scale(1)', opacity: 1 }
            ],
            options: {
                duration: 300,
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
                iterations: 1
            }
        });

        // Ribbon slide animation
        this.animations.set('ribbonSlide', {
            keyframes: [
                { transform: 'translateY(-100%)', opacity: 0 },
                { transform: 'translateY(0)', opacity: 1 }
            ],
            options: {
                duration: 500,
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
                fill: 'forwards'
            }
        });

        // Country highlight pulse
        this.animations.set('countryPulse', {
            keyframes: [
                { boxShadow: '0 0 0 0 rgba(0, 153, 255, 0.4)' },
                { boxShadow: '0 0 0 10px rgba(0, 153, 255, 0)' }
            ],
            options: {
                duration: 1000,
                easing: 'ease-out',
                iterations: 1
            }
        });

        // Hierarchy expand animation
        this.animations.set('hierarchyExpand', {
            keyframes: [
                { maxHeight: '0', opacity: 0 },
                { maxHeight: '300px', opacity: 1 }
            ],
            options: {
                duration: 400,
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
                fill: 'forwards'
            }
        });

        // Flag wave animation (for selected country)
        this.animations.set('flagWave', {
            keyframes: [
                { transform: 'rotate(0deg)' },
                { transform: 'rotate(-5deg)' },
                { transform: 'rotate(5deg)' },
                { transform: 'rotate(0deg)' }
            ],
            options: {
                duration: 1000,
                easing: 'ease-in-out',
                iterations: 2
            }
        });

        // Attention grabber (for new notifications)
        this.animations.set('attentionGrab', {
            keyframes: [
                { transform: 'scale(1)' },
                { transform: 'scale(1.05)' },
                { transform: 'scale(1)' }
            ],
            options: {
                duration: 500,
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
                iterations: 3
            }
        });

        // Fade in animation
        this.animations.set('fadeIn', {
            keyframes: [
                { opacity: 0 },
                { opacity: 1 }
            ],
            options: {
                duration: 300,
                easing: 'ease-in',
                fill: 'forwards'
            }
        });

        // Shake animation (for errors or warnings)
        this.animations.set('shake', {
            keyframes: [
                { transform: 'translateX(0)' },
                { transform: 'translateX(-5px)' },
                { transform: 'translateX(5px)' },
                { transform: 'translateX(-5px)' },
                { transform: 'translateX(5px)' },
                { transform: 'translateX(0)' }
            ],
            options: {
                duration: 500,
                easing: 'ease-in-out',
                iterations: 1
            }
        });
    }

    /**
     * Register CSS transitions
     */
    registerTransitions() {
        this.transitions.set('flagHover', {
            property: 'all',
            duration: 200,
            timing: 'ease-out',
            delay: 0
        });

        this.transitions.set('ribbonExpand', {
            property: 'max-height',
            duration: 400,
            timing: 'cubic-bezier(0.4, 0, 0.2, 1)',
            delay: 0
        });

        this.transitions.set('colorChange', {
            property: 'background-color, border-color, color',
            duration: 300,
            timing: 'ease-in-out',
            delay: 0
        });
    }

    /**
     * Play a registered animation on an element
     */
    playAnimation(element, animationName, callback = null) {
        if (this.prefersReducedMotion || this.isAnimating) {
            if (callback) callback();
            return;
        }

        const animation = this.animations.get(animationName);
        if (!animation) {
            console.warn(`Animation "${animationName}" not found`);
            return;
        }

        this.isAnimating = true;
        
        const anim = element.animate(animation.keyframes, animation.options);
        
        anim.onfinish = () => {
            this.isAnimating = false;
            if (callback) callback();
        };
        
        anim.oncancel = () => {
            this.isAnimating = false;
        };

        return anim;
    }

    /**
     * Apply CSS transition to element
     */
    applyTransition(element, transitionName, properties = {}) {
        const transition = this.transitions.get(transitionName);
        if (!transition) return;

        element.style.transition = `${transition.property} ${transition.duration}ms ${transition.timing} ${transition.delay}ms`;
        
        // Apply any additional properties
        Object.keys(properties).forEach(prop => {
            element.style[prop] = properties[prop];
        });

        // Clean up transition after it completes
        setTimeout(() => {
            element.style.transition = '';
        }, transition.duration + transition.delay);
    }

    /**
     * Animate flag selection
     */
    animateFlagSelection(flagElement, country) {
        if (this.prefersReducedMotion) {
            flagElement.classList.add('active');
            return;
        }

        // Remove active class from all flags
        document.querySelectorAll('.flag-item').forEach(flag => {
            flag.classList.remove('active');
        });

        // Apply active class with animation
        flagElement.classList.add('active');
        
        // Play bounce animation
        this.playAnimation(flagElement, 'flagBounce');
        
        // Play wave animation on flag emoji
        const flagEmoji = flagElement.querySelector('.flag-emoji');
        if (flagEmoji) {
            this.playAnimation(flagEmoji, 'flagWave');
        }

        // Pulse effect for attention
        this.playAnimation(flagElement, 'countryPulse');
    }

    /**
     * Animate hierarchy level activation
     */
    animateHierarchyLevel(levelElement, levelName) {
        if (this.prefersReducedMotion) {
            levelElement.classList.add('active');
            return;
        }

        // Play bounce animation
        this.playAnimation(levelElement, 'flagBounce');
        
        // Highlight the level
        this.applyTransition(levelElement, 'colorChange', {
            backgroundColor: 'rgba(0, 153, 255, 0.1)',
            borderColor: '#0099ff'
        });

        // Reset after animation
        setTimeout(() => {
            levelElement.style.backgroundColor = '';
            levelElement.style.borderColor = '';
        }, 1000);
    }

    /**
     * Animate ribbon expansion/collapse
     */
    animateRibbonExpand(ribbonElement, isExpanding) {
        if (this.prefersReducedMotion) {
            ribbonElement.classList.toggle('expanded', isExpanding);
            return;
        }

        if (isExpanding) {
            this.applyTransition(ribbonElement, 'ribbonExpand', {
                maxHeight: '500px'
            });
            ribbonElement.classList.add('expanded');
        } else {
            this.applyTransition(ribbonElement, 'ribbonExpand', {
                maxHeight: '48px'
            });
            setTimeout(() => {
                ribbonElement.classList.remove('expanded');
                ribbonElement.style.maxHeight = '';
            }, 400);
        }
    }

    /**
     * Animate country card appearance
     */
    animateCountryCard(cardElement, delay = 0) {
        if (this.prefersReducedMotion) {
            cardElement.style.opacity = '1';
            return;
        }

        // Staggered fade-in
        setTimeout(() => {
            this.playAnimation(cardElement, 'fadeIn');
        }, delay);
    }

    /**
     * Animate attention grab for important updates
     */
    grabAttention(element, message = null) {
        if (this.prefersReducedMotion) {
            if (message) {
                this.showStaticMessage(element, message);
            }
            return;
        }

        // Play attention grab animation
        this.playAnimation(element, 'attentionGrab');
        
        // Optional message display
        if (message) {
            this.showAnimatedMessage(element, message);
        }
    }

    /**
     * Show animated message
     */
    showAnimatedMessage(element, message) {
        const messageElement = document.createElement('div');
        messageElement.className = 'animated-message';
        messageElement.textContent = message;
        messageElement.style.cssText = `
            position: absolute;
            top: -30px;
            left: 50%;
            transform: translateX(-50%);
            background: #f37021;
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            white-space: nowrap;
            z-index: 1000;
        `;
        
        element.style.position = 'relative';
        element.appendChild(messageElement);
        
        // Animate message
        messageElement.animate([
            { opacity: 0, transform: 'translateX(-50%) translateY(10px)' },
            { opacity: 1, transform: 'translateX(-50%) translateY(0)' }
        ], {
            duration: 300,
            easing: 'ease-out'
        });
        
        // Remove after delay
        setTimeout(() => {
            messageElement.animate([
                { opacity: 1, transform: 'translateX(-50%) translateY(0)' },
                { opacity: 0, transform: 'translateX(-50%) translateY(-10px)' }
            ], {
                duration: 300,
                easing: 'ease-in'
            }).onfinish = () => {
                messageElement.remove();
            };
        }, 2000);
    }

    /**
     * Show static message (for reduced motion)
     */
    showStaticMessage(element, message) {
        const messageElement = document.createElement('div');
        messageElement.className = 'static-message';
        messageElement.textContent = message;
        messageElement.style.cssText = `
            position: absolute;
            top: -25px;
            left: 50%;
            transform: translateX(-50%);
            background: #f37021;
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            white-space: nowrap;
            z-index: 1000;
            opacity: 1;
        `;
        
        element.style.position = 'relative';
        element.appendChild(messageElement);
        
        // Remove after delay
        setTimeout(() => {
            messageElement.remove();
        }, 3000);
    }

    /**
     * Animate error state
     */
    animateError(element, message = 'Error occurred') {
        if (this.prefersReducedMotion) {
            element.style.borderColor = '#dc3545';
            return;
        }

        // Shake animation
        this.playAnimation(element, 'shake');
        
        // Color change
        this.applyTransition(element, 'colorChange', {
            borderColor: '#dc3545',
            backgroundColor: 'rgba(220, 53, 69, 0.1)'
        });
        
        // Show error message
        this.showAnimatedMessage(element, message);
        
        // Reset after delay
        setTimeout(() => {
            element.style.borderColor = '';
            element.style.backgroundColor = '';
        }, 2000);
    }

    /**
     * Animate success state
     */
    animateSuccess(element, message = 'Success!') {
        if (this.prefersReducedMotion) {
            element.style.borderColor = '#28a745';
            return;
        }

        // Bounce animation
        this.playAnimation(element, 'flagBounce');
        
        // Color change
        this.applyTransition(element, 'colorChange', {
            borderColor: '#28a745',
            backgroundColor: 'rgba(40, 167, 69, 0.1)'
        });
        
        // Show success message
        this.showAnimatedMessage(element, message);
        
        // Reset after delay
        setTimeout(() => {
            element.style.borderColor = '';
            element.style.backgroundColor = '';
        }, 2000);
    }

    /**
     * Animate loading state
     */
    animateLoading(element) {
        if (this.prefersReducedMotion) {
            element.classList.add('loading');
            return;
        }

        // Create loading animation
        const loadingAnimation = element.animate([
            { opacity: 0.5 },
            { opacity: 1 },
            { opacity: 0.5 }
        ], {
            duration: 1000,
            iterations: Infinity
        });

        // Store reference to cancel later
        element._loadingAnimation = loadingAnimation;
        
        element.classList.add('loading');
    }

    /**
     * Stop loading animation
     */
    stopLoading(element) {
        if (element._loadingAnimation) {
            element._loadingAnimation.cancel();
            delete element._loadingAnimation;
        }
        
        element.classList.remove('loading');
        element.style.opacity = '';
    }

    /**
     * Animate sequential flag highlighting (for guided tours)
     */
    animateFlagSequence(flags, interval = 500, callback = null) {
        if (this.prefersReducedMotion || flags.length === 0) {
            if (callback) callback();
            return;
        }

        let index = 0;
        const sequence = setInterval(() => {
            if (index >= flags.length) {
                clearInterval(sequence);
                if (callback) callback();
                return;
            }

            const flag = flags[index];
            this.playAnimation(flag, 'countryPulse');
            index++;
        }, interval);
    }

    /**
     * Animate hierarchy visualization
     */
    animateHierarchyVisualization(container) {
        if (this.prefersReducedMotion) {
            container.style.opacity = '1';
            return;
        }

        // Get all hierarchy elements
        const levels = container.querySelectorAll('.hierarchy-level');
        const arrows = container.querySelectorAll('.hierarchy-arrow');
        const branches = container.querySelectorAll('.hierarchy-branch');

        // Animate in sequence
        let delay = 0;
        
        // Animate levels
        levels.forEach((level, index) => {
            setTimeout(() => {
                this.playAnimation(level, 'fadeIn');
            }, delay);
            delay += 200;
        });

        // Animate arrows
        arrows.forEach(arrow => {
            setTimeout(() => {
                this.playAnimation(arrow, 'fadeIn');
            }, delay);
            delay += 100;
        });

        // Animate branches
        branches.forEach(branch => {
            setTimeout(() => {
                this.playAnimation(branch, 'fadeIn');
            }, delay);
            delay += 150;
        });
    }

    /**
     * Disable all animations
     */
    disableAllAnimations() {
        // Add reduced-motion class to ribbon
        if (this.ribbon.ribbonElement) {
            this.ribbon.ribbonElement.classList.add('reduced-motion');
        }
        
        // Cancel any running animations
        document.getAnimations().forEach(animation => {
            if (animation.playState === 'running') {
                animation.cancel();
            }
        });
        
        this.isAnimating = false;
    }

    /**
     * Enable all animations
     */
    enableAllAnimations() {
        // Remove reduced-motion class
        if (this.ribbon.ribbonElement) {
            this.ribbon.ribbonElement.classList.remove('reduced-motion');
        }
    }

    /**
     * Check if animations are enabled
     */
    areAnimationsEnabled() {
        return !this.prefersReducedMotion;
    }

    /**
     * Get animation status
     */
    getStatus() {
        return {
            animationsEnabled: !this.prefersReducedMotion,
            isAnimating: this.isAnimating,
            registeredAnimations: this.animations.size,
            registeredTransitions: this.transitions.size
        };
    }

    /**
     * Clean up resources
     */
    destroy() {
        this.disableAllAnimations();
        this.animations.clear();
        this.transitions.clear();
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MotionController;
}