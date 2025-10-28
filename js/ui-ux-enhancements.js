/**
 * DC TEKNİK - UI/UX Enhancements
 * Micro-interactions, animations, smooth transitions
 */

(function() {
    'use strict';

    const UIUXEnhancements = {
        init() {
            this.initMicroInteractions();
            this.initLoadingAnimations();
            this.initSmoothTransitions();
            this.initScrollAnimations();
            this.initHoverEffects();
            this.initToastNotifications();
            this.initProgressIndicators();
            this.initSkeletonLoaders();
            
            const safeLog = window.safeLog || console.log;
            safeLog('🎨 UI/UX Enhancements initialized');
        },
        
        /**
         * Micro-Interactions
         */
        initMicroInteractions() {
            // Button ripple effect
            document.querySelectorAll('button, .btn').forEach(btn => {
                btn.addEventListener('click', function(e) {
                    createRipple(e, this);
                });
            });
            
            // Card hover effect
            document.querySelectorAll('.service-card, .review-card, .feature-card').forEach(card => {
                card.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-5px)';
                    this.style.transition = 'transform 0.3s ease';
                });
                
                card.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0)';
                });
            });
        },
        
        /**
         * Ripple Effect
         */
        createRipple(event, element) {
            const ripple = document.createElement('span');
            const rect = element.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = event.clientX - rect.left - size / 2;
            const y = event.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            element.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        },
        
        /**
         * Loading Animations
         */
        initLoadingAnimations() {
            // Skeleton loaders for images
            document.querySelectorAll('img[data-src]').forEach(img => {
                img.classList.add('skeleton-loader');
            });
            
            // Form loading states
            document.querySelectorAll('form').forEach(form => {
                const submitBtn = form.querySelector('button[type="submit"]');
                if (submitBtn) {
                    form.addEventListener('submit', function() {
                        submitBtn.classList.add('loading');
                        submitBtn.innerHTML = '<span class="spinner"></span> Gönderiliyor...';
                    });
                }
            });
        },
        
        /**
         * Smooth Transitions
         */
        initSmoothTransitions() {
            // Page transitions
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    const href = this.getAttribute('href');
                    if (href === '#' || !href) return;
                    
                    const target = document.querySelector(href);
                    if (target) {
                        e.preventDefault();
                        
                        // Fade transition
                        document.body.style.opacity = '0.95';
                        setTimeout(() => {
                            target.scrollIntoView({ behavior: 'smooth' });
                            document.body.style.opacity = '1';
                        }, 150);
                    }
                });
            });
        },
        
        /**
         * Scroll Animations
         */
        initScrollAnimations() {
            if (!('IntersectionObserver' in window)) return;
            
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                        observer.unobserve(entry.target);
                    }
                });
            }, observerOptions);
            
            // Observe elements
            document.querySelectorAll('.service-card, .review-card, .feature-card, .about-stats').forEach(el => {
                el.classList.add('animate-on-scroll');
                observer.observe(el);
            });
        },
        
        /**
         * Hover Effects
         */
        initHoverEffects() {
            // Enhanced button hover
            document.querySelectorAll('.btn').forEach(btn => {
                btn.addEventListener('mouseenter', function() {
                    this.style.transform = 'scale(1.05)';
                    this.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                });
                
                btn.addEventListener('mouseleave', function() {
                    this.style.transform = 'scale(1)';
                    this.style.boxShadow = '';
                });
            });
        },
        
        /**
         * Toast Notifications
         */
        initToastNotifications() {
            // Enhanced toast system (if not exists)
            if (typeof showNotification === 'undefined') {
                window.showNotification = function(message, type = 'info') {
                    const toast = document.createElement('div');
                    toast.className = `toast-notification toast-${type}`;
                    toast.innerHTML = `
                        <div class="toast-content">
                            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                            <span>${message}</span>
                        </div>
                        <button class="toast-close" aria-label="Kapat">
                            <i class="fas fa-times"></i>
                        </button>
                    `;
                    
                    document.body.appendChild(toast);
                    
                    // Show animation
                    setTimeout(() => {
                        toast.classList.add('visible');
                    }, 100);
                    
                    // Close button
                    toast.querySelector('.toast-close').addEventListener('click', () => {
                        toast.classList.remove('visible');
                        setTimeout(() => toast.remove(), 300);
                    });
                    
                    // Auto-hide after 5 seconds
                    setTimeout(() => {
                        if (toast.parentNode) {
                            toast.classList.remove('visible');
                            setTimeout(() => toast.remove(), 300);
                        }
                    }, 5000);
                };
            }
        },
        
        /**
         * Progress Indicators
         */
        initProgressIndicators() {
            // Scroll progress bar
            const progressBar = document.getElementById('progressBar');
            if (progressBar) {
                window.addEventListener('scroll', () => {
                    const scrollPercent = (window.scrollY / 
                        (document.documentElement.scrollHeight - window.innerHeight)) * 100;
                    progressBar.style.width = scrollPercent + '%';
                }, { passive: true });
            }
            
            // Form progress (for multi-step forms)
            document.querySelectorAll('form').forEach(form => {
                const inputs = form.querySelectorAll('input, textarea, select');
                const progressBar = document.createElement('div');
                progressBar.className = 'form-progress-bar';
                progressBar.innerHTML = '<div class="form-progress-fill"></div>';
                form.insertBefore(progressBar, form.firstChild);
                
                const updateProgress = () => {
                    const filled = Array.from(inputs).filter(input => input.value.trim() !== '').length;
                    const percent = (filled / inputs.length) * 100;
                    progressBar.querySelector('.form-progress-fill').style.width = percent + '%';
                };
                
                inputs.forEach(input => {
                    input.addEventListener('input', updateProgress);
                    input.addEventListener('change', updateProgress);
                });
            });
        },
        
        /**
         * Skeleton Loaders
         */
        initSkeletonLoaders() {
            // Already handled in mobile-advanced-styles.css
            // Can enhance here if needed
        }
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => UIUXEnhancements.init());
    } else {
        UIUXEnhancements.init();
    }

    // Export globally
    window.UIUXEnhancements = UIUXEnhancements;
})();

