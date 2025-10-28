/**
 * DC TEKNİK - Advanced Mobile Enhancements
 * Mobil cihazlar için gelişmiş optimizasyonlar ve sorunsuz deneyim
 */

(function() {
    'use strict';

    const MobileAdvanced = {
        networkStatus: 'online',
        connectionType: 'unknown',
        isSlowConnection: false,
        isLowEndDevice: false,
        loadingQueue: [],
        isProcessingQueue: false,
        
        init() {
            this.detectDeviceCapabilities();
            this.initNetworkDetection();
            this.initOptimizedLoading();
            this.initMobileAnimations();
            this.initTouchOptimizations();
            this.initScrollPerformance();
            this.initImageOptimization();
            this.initFormEnhancements();
            this.initOfflineSupport();
            this.initMobileAnalytics();
            this.initErrorRecovery();
            this.initBatteryOptimization();
            
            const safeLog = window.safeLog || console.log;
            safeLog('📱 Advanced mobile enhancements initialized');
        },
        
        /**
         * Detect Device Capabilities
         */
        detectDeviceCapabilities() {
            // Check hardware concurrency
            const cores = navigator.hardwareConcurrency || 2;
            this.isLowEndDevice = cores < 4;
            
            // Check device memory (if available)
            if (navigator.deviceMemory) {
                this.isLowEndDevice = this.isLowEndDevice || navigator.deviceMemory < 4;
            }
            
            // Check connection (will be set by network detection)
            this.connectionType = this.getConnectionType();
            
            // Apply optimizations based on device
            if (this.isLowEndDevice) {
                document.body.classList.add('low-end-device');
                this.enableLowEndMode();
            }
        },
        
        /**
         * Network Detection and Optimization
         */
        initNetworkDetection() {
            // Check initial connection
            this.networkStatus = navigator.onLine ? 'online' : 'offline';
            this.connectionType = this.getConnectionType();
            this.isSlowConnection = this.checkSlowConnection();
            
            // Listen for online/offline events
            window.addEventListener('online', () => {
                this.networkStatus = 'online';
                this.connectionType = this.getConnectionType();
                this.isSlowConnection = this.checkSlowConnection();
                this.handleNetworkChange('online');
            });
            
            window.addEventListener('offline', () => {
                this.networkStatus = 'offline';
                this.isSlowConnection = true;
                this.handleNetworkChange('offline');
            });
            
            // Listen for connection changes
            if ('connection' in navigator || 'mozConnection' in navigator || 'webkitConnection' in navigator) {
                const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
                if (conn) {
                    conn.addEventListener('change', () => {
                        this.connectionType = this.getConnectionType();
                        this.isSlowConnection = this.checkSlowConnection();
                        this.handleNetworkChange('change');
                    });
                }
            }
        },
        
        getConnectionType() {
            if ('connection' in navigator) {
                const conn = navigator.connection;
                return conn.effectiveType || conn.type || 'unknown';
            }
            if ('mozConnection' in navigator) {
                return navigator.mozConnection.type || 'unknown';
            }
            if ('webkitConnection' in navigator) {
                return navigator.webkitConnection.type || 'unknown';
            }
            return 'unknown';
        },
        
        checkSlowConnection() {
            if (this.networkStatus === 'offline') return true;
            
            const connType = this.getConnectionType();
            const slowTypes = ['slow-2g', '2g', '3g'];
            
            if (connType !== 'unknown') {
                return slowTypes.includes(connType);
            }
            
            // Fallback: check if connection object exists and has downlink
            if ('connection' in navigator && navigator.connection.downlink) {
                return navigator.connection.downlink < 1.5; // Less than 1.5 Mbps
            }
            
            return false;
        },
        
        handleNetworkChange(status) {
            document.body.classList.toggle('offline-mode', status === 'offline');
            document.body.classList.toggle('slow-connection', this.isSlowConnection);
            
            if (status === 'offline') {
                this.showOfflineBanner();
                // Retry failed requests
                this.retryFailedRequests();
            } else {
                this.hideOfflineBanner();
            }
            
            // Adjust loading strategy based on connection
            this.adjustLoadingStrategy();
        },
        
        /**
         * Optimized Loading Strategy
         */
        initOptimizedLoading() {
            this.adjustLoadingStrategy();
            
            // Progressive enhancement: load critical first
            this.loadCriticalResources();
            
            // Then load non-critical with delay
            setTimeout(() => {
                this.loadNonCriticalResources();
            }, this.isSlowConnection ? 2000 : 500);
        },
        
        adjustLoadingStrategy() {
            if (this.isSlowConnection || this.networkStatus === 'offline') {
                // Disable animations
                document.body.classList.add('reduced-motion');
                // Reduce image quality
                this.setImageQuality('low');
                // Lazy load more aggressively
                this.enableAggressiveLazyLoading();
            } else {
                document.body.classList.remove('reduced-motion');
                this.setImageQuality('high');
            }
        },
        
        loadCriticalResources() {
            // Critical resources already loaded in HTML
            // This function can be used for additional critical resources
        },
        
        loadNonCriticalResources() {
            // Load non-critical scripts, fonts, etc.
            const deferredScripts = document.querySelectorAll('script[defer]');
            // They will load automatically, but we can track them
        },
        
        /**
         * Image Optimization
         */
        initImageOptimization() {
            if (this.isSlowConnection) {
                // Use WebP or low-quality images for slow connections
                this.optimizeImagesForConnection();
            }
            
            // Responsive images
            this.initResponsiveImages();
            
            // Lazy load images with Intersection Observer
            this.initLazyLoadImages();
        },
        
        setImageQuality(quality) {
            const images = document.querySelectorAll('img[data-src]');
            images.forEach(img => {
                if (quality === 'low' && img.dataset.srcLow) {
                    img.dataset.src = img.dataset.srcLow;
                } else if (quality === 'high' && img.dataset.srcHigh) {
                    img.dataset.src = img.dataset.srcHigh;
                }
            });
        },
        
        optimizeImagesForConnection() {
            // Prefer WebP if supported
            const supportsWebP = this.checkWebPSupport();
            if (supportsWebP) {
                document.body.classList.add('webp-supported');
            }
            
            // Use srcset for responsive images
            const images = document.querySelectorAll('img:not([srcset])');
            images.forEach(img => {
                if (img.src && !img.dataset.optimized) {
                    // Mark as optimized to prevent re-processing
                    img.dataset.optimized = 'true';
                }
            });
        },
        
        checkWebPSupport() {
            const canvas = document.createElement('canvas');
            canvas.width = 1;
            canvas.height = 1;
            return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
        },
        
        initResponsiveImages() {
            // Ensure all images have proper srcset
            // This is usually handled at build time, but we can enhance here
        },
        
        initLazyLoadImages() {
            if (!('IntersectionObserver' in window)) return;
            
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        
                        // Add loading placeholder
                        img.classList.add('loading');
                        
                        // Load image
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                        
                        // Handle load/error
                        img.onload = () => {
                            img.classList.remove('loading');
                            img.classList.add('loaded');
                        };
                        
                        img.onerror = () => {
                            img.classList.remove('loading');
                            img.classList.add('error');
                            // Show placeholder
                            if (img.dataset.placeholder) {
                                img.src = img.dataset.placeholder;
                            }
                        };
                        
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: this.isSlowConnection ? '100px' : '50px'
            });
            
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        },
        
        /**
         * Mobile Animations
         */
        initMobileAnimations() {
            // Reduce animations on low-end devices
            if (this.isLowEndDevice || this.isSlowConnection) {
                document.body.classList.add('reduced-animations');
            }
            
            // Use CSS transforms for better performance
            this.optimizeAnimations();
            
            // Page transition animations
            this.initPageTransitions();
        },
        
        optimizeAnimations() {
            // Ensure animations use transform/opacity for GPU acceleration
            const style = document.createElement('style');
            style.textContent = `
                .mobile-animated {
                    will-change: transform, opacity;
                }
            `;
            document.head.appendChild(style);
        },
        
        initPageTransitions() {
            // Smooth transitions between sections
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    const href = this.getAttribute('href');
                    if (href === '#' || !href) return;
                    
                    const target = document.querySelector(href);
                    if (target) {
                        e.preventDefault();
                        
                        // Add fade transition
                        document.body.style.transition = 'opacity 0.2s';
                        document.body.style.opacity = '0.95';
                        
                        setTimeout(() => {
                            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            document.body.style.opacity = '1';
                        }, 100);
                    }
                });
            });
        },
        
        /**
         * Touch Optimizations
         */
        initTouchOptimizations() {
            // Prevent 300ms click delay
            this.removeClickDelay();
            
            // Better touch feedback
            this.enhanceTouchFeedback();
            
            // Swipe gestures (enhanced)
            this.initAdvancedGestures();
        },
        
        removeClickDelay() {
            // Use touchstart for immediate feedback (if appropriate)
            // Modern browsers already handle this, but we can enhance
            
            // Use passive event listeners for better scroll performance
            let touchStartTime = 0;
            
            document.addEventListener('touchstart', (e) => {
                touchStartTime = Date.now();
            }, { passive: true });
            
            document.addEventListener('touchend', (e) => {
                const touchDuration = Date.now() - touchStartTime;
                // If touch was quick (< 200ms), trigger immediate feedback
                if (touchDuration < 200) {
                    const target = e.target.closest('button, a, [role="button"]');
                    if (target) {
                        target.classList.add('touch-active');
                        setTimeout(() => {
                            target.classList.remove('touch-active');
                        }, 150);
                    }
                }
            }, { passive: true });
        },
        
        enhanceTouchFeedback() {
            // Add ripple effect on touch (optional, can be enabled)
            // For now, we use simple opacity change (already in CSS)
        },
        
        initAdvancedGestures() {
            // Already handled in mobile-enhancements.js
            // Can extend here if needed
        },
        
        /**
         * Scroll Performance
         */
        initScrollPerformance() {
            // Passive event listeners for scroll
            let ticking = false;
            
            window.addEventListener('scroll', () => {
                if (!ticking) {
                    window.requestAnimationFrame(() => {
                        // Scroll-based logic here
                        this.updateScrollProgress();
                        ticking = false;
                    });
                    ticking = true;
                }
            }, { passive: true });
            
            // Smooth scroll polyfill for older browsers
            if (!('scrollBehavior' in document.documentElement.style)) {
                this.initSmoothScrollPolyfill();
            }
        },
        
        updateScrollProgress() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrollTop / scrollHeight) * 100;
            
            // Update progress bar if exists
            const progressBar = document.getElementById('progressBar');
            if (progressBar) {
                progressBar.style.width = `${progress}%`;
            }
        },
        
        initSmoothScrollPolyfill() {
            // Smooth scroll polyfill for older browsers
            // Modern browsers support it natively
        },
        
        /**
         * Form Enhancements
         */
        initFormEnhancements() {
            const forms = document.querySelectorAll('form');
            
            forms.forEach(form => {
                const inputs = form.querySelectorAll('input, textarea, select');
                
                inputs.forEach(input => {
                    // Better mobile keyboard handling
                    this.enhanceMobileKeyboard(input);
                    
                    // Real-time validation feedback
                    input.addEventListener('blur', () => {
                        this.validateFieldOnMobile(input);
                    }, { passive: true });
                });
                
                // Form submission with loading state
                form.addEventListener('submit', (e) => {
                    this.handleFormSubmit(e, form);
                });
            });
        },
        
        enhanceMobileKeyboard(input) {
            // Set inputmode for better keyboard
            if (input.type === 'email') {
                input.setAttribute('inputmode', 'email');
            } else if (input.type === 'tel') {
                input.setAttribute('inputmode', 'tel');
            } else if (input.type === 'number') {
                input.setAttribute('inputmode', 'numeric');
            }
            
            // Prevent zoom on iOS (already 16px, but ensure)
            if (input.type !== 'tel' && input.type !== 'number') {
                const computedStyle = window.getComputedStyle(input);
                if (parseFloat(computedStyle.fontSize) < 16) {
                    input.style.fontSize = '16px';
                }
            }
        },
        
        validateFieldOnMobile(input) {
            // Enhanced validation with better mobile UX
            if (!input.checkValidity()) {
                input.classList.add('invalid');
                
                // Show error message
                let errorMsg = input.parentNode.querySelector('.error-message');
                if (!errorMsg) {
                    errorMsg = document.createElement('div');
                    errorMsg.className = 'error-message';
                    input.parentNode.appendChild(errorMsg);
                }
                
                // Get custom error message
                if (input.validity.valueMissing) {
                    errorMsg.textContent = 'Bu alan zorunludur';
                } else if (input.validity.typeMismatch) {
                    errorMsg.textContent = 'Geçerli bir değer giriniz';
                } else {
                    errorMsg.textContent = input.validationMessage || 'Geçersiz değer';
                }
                
                // Scroll to error on mobile
                setTimeout(() => {
                    input.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 100);
            } else {
                input.classList.remove('invalid');
                const errorMsg = input.parentNode.querySelector('.error-message');
                if (errorMsg) {
                    errorMsg.remove();
                }
            }
        },
        
        handleFormSubmit(e, form) {
            const submitBtn = form.querySelector('button[type="submit"]');
            
            if (submitBtn) {
                submitBtn.classList.add('loading');
                submitBtn.disabled = true;
                
                // Show loading state
                this.showFormLoading(form);
                
                // Re-enable after a delay (actual submission handled elsewhere)
                // This is just for visual feedback
            }
        },
        
        showFormLoading(form) {
            const loadingOverlay = document.createElement('div');
            loadingOverlay.className = 'form-loading-overlay';
            loadingOverlay.innerHTML = '<div class="spinner"></div><p>Gönderiliyor...</p>';
            form.appendChild(loadingOverlay);
        },
        
        /**
         * Offline Support
         */
        initOfflineSupport() {
            // Show offline banner
            if (this.networkStatus === 'offline') {
                this.showOfflineBanner();
            }
            
            // Queue requests when offline
            this.initRequestQueue();
        },
        
        showOfflineBanner() {
            let banner = document.getElementById('offline-banner');
            if (!banner) {
                banner = document.createElement('div');
                banner.id = 'offline-banner';
                banner.className = 'offline-banner';
                banner.innerHTML = '<span>⚠️ İnternet bağlantısı yok. Çevrimdışı modda çalışıyorsunuz.</span>';
                document.body.insertBefore(banner, document.body.firstChild);
            }
            banner.classList.add('visible');
        },
        
        hideOfflineBanner() {
            const banner = document.getElementById('offline-banner');
            if (banner) {
                banner.classList.remove('visible');
            }
        },
        
        initRequestQueue() {
            // Queue form submissions and other requests when offline
            // Retry when back online
        },
        
        retryFailedRequests() {
            // Retry queued requests when back online
            // This would typically interact with a service worker
        },
        
        /**
         * Battery Optimization
         */
        initBatteryOptimization() {
            // Reduce animations, lower frame rate when battery is low
            if ('getBattery' in navigator) {
                navigator.getBattery().then(battery => {
                    if (battery.level < 0.2 || (!battery.charging && battery.level < 0.5)) {
                        document.body.classList.add('battery-saver-mode');
                        this.enableBatterySaver();
                    }
                    
                    battery.addEventListener('levelchange', () => {
                        if (battery.level < 0.2 || (!battery.charging && battery.level < 0.5)) {
                            document.body.classList.add('battery-saver-mode');
                            this.enableBatterySaver();
                        } else {
                            document.body.classList.remove('battery-saver-mode');
                            this.disableBatterySaver();
                        }
                    });
                });
            }
        },
        
        enableBatterySaver() {
            // Reduce animations
            document.body.classList.add('reduced-animations');
            // Lower frame rate
            // Disable non-essential features
        },
        
        disableBatterySaver() {
            if (!this.isLowEndDevice && !this.isSlowConnection) {
                document.body.classList.remove('reduced-animations');
            }
        },
        
        /**
         * Error Recovery
         */
        initErrorRecovery() {
            // Retry failed image loads
            document.querySelectorAll('img').forEach(img => {
                img.addEventListener('error', () => {
                    this.retryImageLoad(img);
                });
            });
        },
        
        retryImageLoad(img, retries = 3) {
            if (retries <= 0) {
                img.src = img.dataset.placeholder || 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="#ddd" width="100" height="100"/></svg>';
                return;
            }
            
            setTimeout(() => {
                const originalSrc = img.dataset.originalSrc || img.src;
                img.src = originalSrc + (originalSrc.includes('?') ? '&' : '?') + 'retry=' + retries;
                
                img.onerror = () => {
                    this.retryImageLoad(img, retries - 1);
                };
            }, 1000);
        },
        
        /**
         * Mobile Analytics
         */
        initMobileAnalytics() {
            // Track mobile-specific metrics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'mobile_device_info', {
                    device_type: this.isLowEndDevice ? 'low_end' : 'high_end',
                    connection_type: this.connectionType,
                    is_offline: this.networkStatus === 'offline',
                    screen_width: window.innerWidth,
                    screen_height: window.innerHeight
                });
            }
        },
        
        /**
         * Low End Device Mode
         */
        enableLowEndMode() {
            // Disable heavy animations
            document.body.classList.add('low-performance');
            // Use simpler transitions
            // Reduce visual effects
        },
        
        /**
         * Aggressive Lazy Loading
         */
        enableAggressiveLazyLoading() {
            // Load images only when very close to viewport
            // Use lower quality images
            // Defer non-critical resources
        },
        
        /**
         * Get Mobile Info
         */
        getMobileInfo() {
            return {
                isMobile: window.MobileEnhancements?.isMobile || false,
                isTablet: window.MobileEnhancements?.isTablet || false,
                isTouch: window.MobileEnhancements?.isTouch || false,
                isLowEndDevice: this.isLowEndDevice,
                networkStatus: this.networkStatus,
                connectionType: this.connectionType,
                isSlowConnection: this.isSlowConnection,
                orientation: window.MobileEnhancements?.orientation || 'unknown'
            };
        }
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => MobileAdvanced.init());
    } else {
        MobileAdvanced.init();
    }

    // Export globally
    window.MobileAdvanced = MobileAdvanced;
})();

