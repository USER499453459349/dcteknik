/**
 * DC TEKNİK - Mobile Enhancements
 * Mobil cihazlar için JavaScript iyileştirmeleri
 */

(function() {
    'use strict';

    const MobileEnhancements = {
        isMobile: false,
        isTablet: false,
        isTouch: false,
        orientation: 'portrait',
        menuOpen: false,
        
        init() {
            this.detectDevice();
            this.initTouchGestures();
            this.initMobileMenu();
            this.initSwipeGestures();
            this.initOrientationChange();
            this.initViewportHeight();
            this.initFormEnhancements();
            this.initScrollOptimization();
            this.initPerformanceOptimizations();
            
            // Log initialization
            const safeLog = window.safeLog || console.log;
            safeLog('📱 Mobile enhancements initialized');
        },
        
        /**
         * Detect Device Type
         */
        detectDevice() {
            const userAgent = navigator.userAgent || navigator.vendor || window.opera;
            const width = window.innerWidth;
            
            // Mobile detection
            this.isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase()) || width <= 768;
            
            // Tablet detection
            this.isTablet = /ipad|android(?!.*mobile)/i.test(userAgent) || (width > 768 && width <= 1024);
            
            // Touch detection
            this.isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
            
            // Orientation
            this.orientation = window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
            
            // Add classes to body
            if (this.isMobile) {
                document.body.classList.add('is-mobile');
            }
            if (this.isTablet) {
                document.body.classList.add('is-tablet');
            }
            if (this.isTouch) {
                document.body.classList.add('is-touch');
            }
            document.body.classList.add(`orientation-${this.orientation}`);
        },
        
        /**
         * Initialize Touch Gestures
         */
        initTouchGestures() {
            if (!this.isTouch) return;
            
            // Prevent double-tap zoom
            let lastTouchEnd = 0;
            document.addEventListener('touchend', (e) => {
                const now = Date.now();
                if (now - lastTouchEnd <= 300) {
                    e.preventDefault();
                }
                lastTouchEnd = now;
            }, false);
            
            // Touch feedback for buttons
            const buttons = document.querySelectorAll('button, .btn, a.btn');
            buttons.forEach(btn => {
                btn.addEventListener('touchstart', () => {
                    btn.classList.add('touch-active');
                }, { passive: true });
                
                btn.addEventListener('touchend', () => {
                    setTimeout(() => {
                        btn.classList.remove('touch-active');
                    }, 150);
                }, { passive: true });
            });
        },
        
        /**
         * Initialize Mobile Menu
         */
        initMobileMenu() {
            const menuToggle = document.querySelector('.nav-toggle');
            const navMenu = document.querySelector('.nav-menu');
            const body = document.body;
            
            if (!menuToggle || !navMenu) return;
            
            // Create overlay
            const overlay = document.createElement('div');
            overlay.className = 'menu-overlay';
            document.body.appendChild(overlay);
            
            // Toggle menu
            menuToggle.addEventListener('click', () => {
                this.toggleMenu();
            });
            
            // Close on overlay click
            overlay.addEventListener('click', () => {
                this.closeMenu();
            });
            
            // Close on menu item click
            const menuItems = navMenu.querySelectorAll('a');
            menuItems.forEach(item => {
                item.addEventListener('click', () => {
                    if (this.menuOpen) {
                        this.closeMenu();
                    }
                });
            });
            
            // Close on Escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.menuOpen) {
                    this.closeMenu();
                }
            });
            
            // Update ARIA attributes
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.setAttribute('aria-controls', 'nav-menu');
        },
        
        toggleMenu() {
            const menuToggle = document.querySelector('.nav-toggle');
            const navMenu = document.querySelector('.nav-menu');
            const overlay = document.querySelector('.menu-overlay');
            const body = document.body;
            
            this.menuOpen = !this.menuOpen;
            
            if (navMenu) {
                navMenu.classList.toggle('active');
            }
            if (menuToggle) {
                menuToggle.classList.toggle('active');
                menuToggle.setAttribute('aria-expanded', this.menuOpen.toString());
            }
            if (overlay) {
                overlay.classList.toggle('active');
            }
            
            // Prevent body scroll when menu is open
            if (this.menuOpen) {
                body.classList.add('menu-open');
            } else {
                body.classList.remove('menu-open');
            }
            
            // Announce to screen readers
            if (window.AccessibilityModule) {
                window.AccessibilityModule.announce(
                    this.menuOpen ? 'Menü açıldı' : 'Menü kapatıldı',
                    'polite'
                );
            }
        },
        
        closeMenu() {
            if (this.menuOpen) {
                this.toggleMenu();
            }
        },
        
        /**
         * Initialize Swipe Gestures
         */
        initSwipeGestures() {
            if (!this.isTouch) return;
            
            let touchStartX = 0;
            let touchStartY = 0;
            let touchEndX = 0;
            let touchEndY = 0;
            
            document.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
                touchStartY = e.changedTouches[0].screenY;
            }, { passive: true });
            
            document.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                touchEndY = e.changedTouches[0].screenY;
                this.handleSwipe(touchStartX, touchStartY, touchEndX, touchEndY);
            }, { passive: true });
        },
        
        handleSwipe(startX, startY, endX, endY) {
            const deltaX = endX - startX;
            const deltaY = endY - startY;
            const minSwipeDistance = 50;
            
            // Horizontal swipe (left/right)
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
                if (deltaX > 0) {
                    // Swipe right - close menu if open
                    if (this.menuOpen) {
                        this.closeMenu();
                    }
                } else {
                    // Swipe left - open menu if closed and on home
                    // (Optional - uncomment if you want left swipe to open menu)
                    // if (!this.menuOpen && window.location.hash === '#home') {
                    //     this.toggleMenu();
                    // }
                }
            }
            
            // Vertical swipe (up/down)
            // Can be used for other gestures if needed
        },
        
        /**
         * Handle Orientation Change
         */
        initOrientationChange() {
            window.addEventListener('orientationchange', () => {
                setTimeout(() => {
                    this.orientation = window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
                    document.body.classList.remove('orientation-portrait', 'orientation-landscape');
                    document.body.classList.add(`orientation-${this.orientation}`);
                    
                    // Fix viewport height on orientation change
                    this.initViewportHeight();
                    
                    // Close menu on orientation change
                    if (this.menuOpen) {
                        this.closeMenu();
                    }
                }, 100);
            });
        },
        
        /**
         * Fix Viewport Height for Mobile Browsers
         */
        initViewportHeight() {
            // Fix for mobile browsers with address bar
            const setViewportHeight = () => {
                const vh = window.innerHeight * 0.01;
                document.documentElement.style.setProperty('--vh', `${vh}px`);
            };
            
            setViewportHeight();
            window.addEventListener('resize', setViewportHeight);
            window.addEventListener('orientationchange', () => {
                setTimeout(setViewportHeight, 100);
            });
        },
        
        /**
         * Mobile Form Enhancements
         */
        initFormEnhancements() {
            if (!this.isMobile) return;
            
            const forms = document.querySelectorAll('form');
            
            forms.forEach(form => {
                const inputs = form.querySelectorAll('input, textarea, select');
                
                inputs.forEach(input => {
                    // Show keyboard type hints for better UX
                    if (input.type === 'email') {
                        input.setAttribute('inputmode', 'email');
                        input.setAttribute('autocomplete', 'email');
                    } else if (input.type === 'tel') {
                        input.setAttribute('inputmode', 'tel');
                        input.setAttribute('autocomplete', 'tel');
                    } else if (input.type === 'text' && input.name && input.name.toLowerCase().includes('name')) {
                        input.setAttribute('autocomplete', 'name');
                    }
                    
                    // Prevent zoom on focus (iOS)
                    if (input.type !== 'tel' && input.type !== 'number') {
                        input.style.fontSize = '16px';
                    }
                    
                    // Better form validation feedback
                    input.addEventListener('invalid', (e) => {
                        // Add shake animation
                        input.classList.add('shake');
                        setTimeout(() => {
                            input.classList.remove('shake');
                        }, 500);
                        
                        // Scroll to first invalid field
                        if (!input.closest('.invalid-scrolled')) {
                            input.closest('form').classList.add('has-invalid');
                            input.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            input.closest('.invalid-scrolled') || input.classList.add('invalid-scrolled');
                        }
                    });
                });
            });
        },
        
        /**
         * Scroll Optimization for Mobile
         */
        initScrollOptimization() {
            if (!this.isMobile) return;
            
            // Smooth scroll with offset for fixed header
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    const href = this.getAttribute('href');
                    if (href === '#' || !href) return;
                    
                    const target = document.querySelector(href);
                    if (target) {
                        e.preventDefault();
                        
                        const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                        const targetPosition = target.offsetTop - headerHeight - 20;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                });
            });
            
            // Optimize scroll performance
            let ticking = false;
            window.addEventListener('scroll', () => {
                if (!ticking) {
                    window.requestAnimationFrame(() => {
                        // Any scroll-based logic here
                        ticking = false;
                    });
                    ticking = true;
                }
            }, { passive: true });
        },
        
        /**
         * Performance Optimizations for Mobile
         */
        initPerformanceOptimizations() {
            if (!this.isMobile) return;
            
            // Lazy load images more aggressively on mobile
            if ('IntersectionObserver' in window) {
                const imageObserver = new IntersectionObserver((entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            if (img.dataset.src) {
                                img.src = img.dataset.src;
                                img.removeAttribute('data-src');
                                observer.unobserve(img);
                            }
                        }
                    });
                }, {
                    rootMargin: '50px'
                });
                
                document.querySelectorAll('img[data-src]').forEach(img => {
                    imageObserver.observe(img);
                });
            }
            
            // Reduce animations on low-end devices
            if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
                document.body.classList.add('low-performance');
            }
            
            // Pause animations when tab is not visible
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    document.body.classList.add('paused-animations');
                } else {
                    document.body.classList.remove('paused-animations');
                }
            });
        },
        
        /**
         * Get device info
         */
        getDeviceInfo() {
            return {
                isMobile: this.isMobile,
                isTablet: this.isTablet,
                isTouch: this.isTouch,
                orientation: this.orientation,
                width: window.innerWidth,
                height: window.innerHeight
            };
        }
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => MobileEnhancements.init());
    } else {
        MobileEnhancements.init();
    }

    // Export globally
    window.MobileEnhancements = MobileEnhancements;
})();

