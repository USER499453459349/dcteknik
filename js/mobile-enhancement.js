// Mobile Enhancement JavaScript
// DC TEKNİK - Dinamocu Serdar

class MobileEnhancer {
    constructor() {
        this.isMobile = this.detectMobile();
        this.touchDevice = this.detectTouchDevice();
        this.screenSize = this.getScreenSize();
        this.orientation = this.getOrientation();
        this.connectionType = this.getConnectionType();
        
        this.mobileData = {
            device: {
                isMobile: this.isMobile,
                touchDevice: this.touchDevice,
                screenSize: this.screenSize,
                orientation: this.orientation,
                connectionType: this.connectionType
            },
            performance: {},
            analytics: {},
            features: {}
        };
        
        this.init();
    }

    init() {
        // Mobil cihaz kontrolü
        if (!this.isMobile) {
            return; // Mobil değilse çalıştırma
        }
        
        this.enhanceMobileUX();
        this.optimizeTouchInteractions();
        this.improveMobilePerformance();
        this.addMobileFeatures();
        this.setupMobileAnalytics();
        this.enhanceMobileForms();
        this.addMobileGestures();
        this.setupMobileNotifications();
        this.optimizeMobileWidgets();
        this.setupMobileErrorHandling();
        
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log('📱 Mobile Enhancer initialized');
        }
    }

    // Detect mobile device
    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    // Detect touch device
    detectTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }

    // Get screen size
    getScreenSize() {
        const width = window.screen.width;
        const height = window.screen.height;
        
        if (width < 768) {
            return 'mobile';
        } else if (width < 1024) {
            return 'tablet';
        } else {
            return 'desktop';
        }
    }

    // Get orientation
    getOrientation() {
        return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
    }

    // Get connection type
    getConnectionType() {
        if (navigator.connection) {
            return navigator.connection.effectiveType || 'unknown';
        }
        return 'unknown';
    }

    // Enhance mobile UX
    enhanceMobileUX() {
        this.addMobileMetaTags();
        this.optimizeViewport();
        this.enhanceTouchTargets();
        this.improveMobileNavigation();
        this.addMobileLoadingStates();
        this.optimizeMobileImages();
    }

    // Add mobile meta tags
    addMobileMetaTags() {
        const metaTags = [
            { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no' },
            { name: 'mobile-web-app-capable', content: 'yes' },
            { name: 'apple-mobile-web-app-capable', content: 'yes' },
            { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
            { name: 'apple-mobile-web-app-title', content: 'DC TEKNİK' },
            { name: 'format-detection', content: 'telephone=no' },
            { name: 'theme-color', content: '#0b5cff' }
        ];

        metaTags.forEach(tag => {
            let meta = document.querySelector(`meta[name="${tag.name}"]`);
            if (!meta) {
                meta = document.createElement('meta');
                meta.name = tag.name;
                document.head.appendChild(meta);
            }
            meta.content = tag.content;
        });
    }

    // Optimize viewport
    optimizeViewport() {
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
            viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
        }
    }

    // Enhance touch targets
    enhanceTouchTargets() {
        if (!this.isMobile) return;
        
        const touchTargets = document.querySelectorAll('a:not(.logo-image), button:not(.nav-toggle), .btn, input[type="button"], input[type="submit"]');
        
        touchTargets.forEach(target => {
            const rect = target.getBoundingClientRect();
            const minSize = 44; // Minimum touch target size in pixels
            
            // Skip if already large enough
            if (rect.width >= minSize && rect.height >= minSize) return;
            
            // Add minimum size
            if (!target.style.minWidth) {
                target.style.minWidth = Math.max(minSize, rect.width) + 'px';
            }
            if (!target.style.minHeight) {
                target.style.minHeight = Math.max(minSize, rect.height) + 'px';
            }
            
            // Add padding if needed
            const computedStyle = window.getComputedStyle(target);
            const padding = parseFloat(computedStyle.paddingTop) || 0;
            if (padding < 12) {
                target.style.padding = '12px 20px';
            }
            
            // Add touch-action for better performance
            target.style.touchAction = 'manipulation';
            target.style.webkitTapHighlightColor = 'rgba(255, 107, 53, 0.3)';
        });
    }

    // Improve mobile navigation
    improveMobileNavigation() {
        this.addMobileMenuToggle();
        this.enhanceMobileMenu();
        this.addMobileBackButton();
        this.optimizeMobileLinks();
    }

    // Add mobile menu toggle
    addMobileMenuToggle() {
        const nav = document.querySelector('nav');
        if (nav && this.isMobile) {
            const menuToggle = document.createElement('button');
            menuToggle.className = 'mobile-menu-toggle';
            menuToggle.innerHTML = '☰';
            menuToggle.setAttribute('aria-label', 'Menu');
            menuToggle.style.cssText = `
                display: none;
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                padding: 0.5rem;
                color: #1e293b;
            `;
            
            nav.insertBefore(menuToggle, nav.firstChild);
            
            menuToggle.addEventListener('click', () => {
                nav.classList.toggle('mobile-menu-open');
            });
            
            // Show on mobile
            if (window.innerWidth < 768) {
                menuToggle.style.display = 'block';
            }
        }
    }

    // Enhance mobile menu
    enhanceMobileMenu() {
        const nav = document.querySelector('nav');
        if (nav && this.isMobile) {
            nav.classList.add('mobile-nav');
            
            // Add mobile menu styles
            const style = document.createElement('style');
            style.textContent = `
                @media (max-width: 768px) {
                    .mobile-nav {
                        flex-direction: column;
                        position: relative;
                    }
                    
                    .mobile-nav .mobile-menu-toggle {
                        display: block !important;
                    }
                    
                    .mobile-nav ul {
                        display: none;
                        flex-direction: column;
                        position: absolute;
                        top: 100%;
                        left: 0;
                        right: 0;
                        background: white;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                        z-index: 1000;
                    }
                    
                    .mobile-nav.mobile-menu-open ul {
                        display: flex;
                    }
                    
                    .mobile-nav ul li {
                        width: 100%;
                        border-bottom: 1px solid #e2e8f0;
                    }
                    
                    .mobile-nav ul li a {
                        display: block;
                        padding: 1rem;
                        text-align: center;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Add mobile back button
    addMobileBackButton() {
        if (this.isMobile && window.history.length > 1) {
            const backButton = document.createElement('button');
            backButton.className = 'mobile-back-button';
            backButton.innerHTML = '← Geri';
            backButton.style.cssText = `
                position: fixed;
                top: 20px;
                left: 20px;
                z-index: 1000;
                background: rgba(255, 255, 255, 0.9);
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                padding: 0.5rem 1rem;
                font-size: 0.9rem;
                cursor: pointer;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            `;
            
            backButton.addEventListener('click', () => {
                window.history.back();
            });
            
            document.body.appendChild(backButton);
        }
    }

    // Optimize mobile links
    optimizeMobileLinks() {
        const links = document.querySelectorAll('a');
        links.forEach(link => {
            // Add touch feedback
            link.addEventListener('touchstart', () => {
                link.style.opacity = '0.7';
            });
            
            link.addEventListener('touchend', () => {
                setTimeout(() => {
                    link.style.opacity = '1';
                }, 150);
            });
            
            // Optimize external links
            if (link.href && !link.href.startsWith(window.location.origin)) {
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
            }
        });
    }

    // Add mobile loading states
    addMobileLoadingStates() {
        const loadingStates = document.createElement('div');
        loadingStates.className = 'mobile-loading-states';
        loadingStates.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(255, 255, 255, 0.9);
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;
        
        loadingStates.innerHTML = `
            <div style="text-align: center;">
                <div style="width: 40px; height: 40px; border: 4px solid #e2e8f0; border-top: 4px solid #0b5cff; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 1rem;"></div>
                <p>Yükleniyor...</p>
            </div>
        `;
        
        document.body.appendChild(loadingStates);
        
        // Add spin animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }

    // Optimize mobile images
    optimizeMobileImages() {
        if (!this.isMobile) return;
        
        const images = document.querySelectorAll('img:not([loading])');
        images.forEach(img => {
            // Skip logo and critical images
            if (img.classList.contains('logo-image') || img.hasAttribute('fetchpriority')) {
                return;
            }
            
            // Add loading="lazy" for mobile
            img.loading = 'lazy';
            img.decoding = 'async';
            
            // Optimize image sizes for mobile
            img.style.maxWidth = '100%';
            img.style.height = 'auto';
            
            // Add error handler
            img.addEventListener('error', function() {
                this.style.display = 'none';
            });
        });
        
        // Optimize background images if any
        const elementsWithBg = document.querySelectorAll('[style*="background-image"]');
        elementsWithBg.forEach(el => {
            el.style.backgroundSize = 'cover';
            el.style.backgroundPosition = 'center';
        });
    }

    // Optimize touch interactions
    optimizeTouchInteractions() {
        this.addTouchFeedback();
        this.optimizeTouchEvents();
        this.addTouchGestures();
        this.improveTouchScrolling();
    }

    // Add touch feedback
    addTouchFeedback() {
        const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');
        
        interactiveElements.forEach(element => {
            element.addEventListener('touchstart', (e) => {
                element.style.transform = 'scale(0.95)';
                element.style.transition = 'transform 0.1s ease';
            });
            
            element.addEventListener('touchend', (e) => {
                setTimeout(() => {
                    element.style.transform = 'scale(1)';
                }, 100);
            });
            
            element.addEventListener('touchcancel', (e) => {
                element.style.transform = 'scale(1)';
            });
        });
    }

    // Optimize touch events
    optimizeTouchEvents() {
        // Prevent double-tap zoom
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (e) => {
            const now = new Date().getTime();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
        
        // Optimize touch event listeners
        const touchElements = document.querySelectorAll('[data-touch]');
        touchElements.forEach(element => {
            element.addEventListener('touchstart', this.handleTouchStart, { passive: true });
            element.addEventListener('touchmove', this.handleTouchMove, { passive: true });
            element.addEventListener('touchend', this.handleTouchEnd, { passive: true });
        });
    }

    // Handle touch start
    handleTouchStart(e) {
        this.touchStartTime = Date.now();
        this.touchStartX = e.touches[0].clientX;
        this.touchStartY = e.touches[0].clientY;
    }

    // Handle touch move
    handleTouchMove(e) {
        if (!this.touchStartX || !this.touchStartY) return;
        
        const touchEndX = e.touches[0].clientX;
        const touchEndY = e.touches[0].clientY;
        
        const deltaX = touchEndX - this.touchStartX;
        const deltaY = touchEndY - this.touchStartY;
        
        // Detect swipe direction
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            if (deltaX > 0) {
                this.handleSwipeRight();
            } else {
                this.handleSwipeLeft();
            }
        } else {
            if (deltaY > 0) {
                this.handleSwipeDown();
            } else {
                this.handleSwipeUp();
            }
        }
    }

    // Handle touch end
    handleTouchEnd(e) {
        const touchDuration = Date.now() - this.touchStartTime;
        
        if (touchDuration < 300) {
            this.handleTap();
        }
        
        this.touchStartX = null;
        this.touchStartY = null;
    }

    // Handle swipe gestures
    handleSwipeLeft() {
        console.log('Swipe left detected');
        // Add swipe left functionality
    }

    handleSwipeRight() {
        console.log('Swipe right detected');
        // Add swipe right functionality
    }

    handleSwipeUp() {
        console.log('Swipe up detected');
        // Add swipe up functionality
    }

    handleSwipeDown() {
        console.log('Swipe down detected');
        // Add swipe down functionality
    }

    handleTap() {
        console.log('Tap detected');
        // Add tap functionality
    }

    // Add touch gestures
    addTouchGestures() {
        // Add pinch zoom support for images
        const images = document.querySelectorAll('img[data-zoomable]');
        images.forEach(img => {
            img.addEventListener('touchstart', this.handleImageTouchStart);
            img.addEventListener('touchmove', this.handleImageTouchMove);
            img.addEventListener('touchend', this.handleImageTouchEnd);
        });
    }

    // Handle image touch start
    handleImageTouchStart(e) {
        if (e.touches.length === 2) {
            this.pinchStartDistance = this.getDistance(e.touches[0], e.touches[1]);
            this.pinchStartScale = this.currentScale || 1;
        }
    }

    // Handle image touch move
    handleImageTouchMove(e) {
        if (e.touches.length === 2) {
            e.preventDefault();
            const currentDistance = this.getDistance(e.touches[0], e.touches[1]);
            const scale = (currentDistance / this.pinchStartDistance) * this.pinchStartScale;
            
            if (scale >= 1 && scale <= 3) {
                this.currentScale = scale;
                e.target.style.transform = `scale(${scale})`;
            }
        }
    }

    // Handle image touch end
    handleImageTouchEnd(e) {
        if (e.touches.length === 0) {
            this.pinchStartDistance = null;
            this.pinchStartScale = null;
        }
    }

    // Get distance between two touches
    getDistance(touch1, touch2) {
        const dx = touch1.clientX - touch2.clientX;
        const dy = touch1.clientY - touch2.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }

    // Improve touch scrolling
    improveTouchScrolling() {
        // Add smooth scrolling for mobile
        document.addEventListener('touchstart', {}, { passive: true });
        document.addEventListener('touchmove', {}, { passive: true });
        
        // Add momentum scrolling
        const scrollableElements = document.querySelectorAll('[data-scrollable]');
        scrollableElements.forEach(element => {
            element.style.webkitOverflowScrolling = 'touch';
        });
    }

    // Improve mobile performance
    improveMobilePerformance() {
        if (!this.isMobile) return;
        
        this.optimizeMobileLoading();
        this.improveMobileRendering();
        this.optimizeMobileMemory();
        this.addMobileCaching();
        this.optimizeAnimations();
        this.prefetchCriticalResources();
    }
    
    // Optimize animations for mobile
    optimizeAnimations() {
        // Reduce animation duration on slow connections
        if (this.connectionType && (this.connectionType === 'slow-2g' || this.connectionType === '2g')) {
            const style = document.createElement('style');
            style.textContent = `
                * {
                    animation-duration: 0.3s !important;
                    transition-duration: 0.2s !important;
                }
            `;
            document.head.appendChild(style);
        }
        
        // Respect prefers-reduced-motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            const style = document.createElement('style');
            style.textContent = `
                *,
                *::before,
                *::after {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Prefetch critical resources
    prefetchCriticalResources() {
        // Prefetch next likely pages
        const links = document.querySelectorAll('a[href^="/"]:not([href*="#"])');
        links.forEach(link => {
            if (link.getAttribute('href') && !link.hasAttribute('prefetch')) {
                const prefetchLink = document.createElement('link');
                prefetchLink.rel = 'prefetch';
                prefetchLink.href = link.getAttribute('href');
                prefetchLink.as = 'document';
                document.head.appendChild(prefetchLink);
            }
        });
    }

    // Optimize mobile loading
    optimizeMobileLoading() {
        // Lazy load images on mobile
        if (this.isMobile) {
            const images = document.querySelectorAll('img[data-src]');
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
        }
    }

    // Improve mobile rendering
    improveMobileRendering() {
        // Add will-change for better performance
        const animatedElements = document.querySelectorAll('[data-animate]');
        animatedElements.forEach(element => {
            element.style.willChange = 'transform, opacity';
        });
        
        // Optimize repaints
        const style = document.createElement('style');
        style.textContent = `
            * {
                -webkit-backface-visibility: hidden;
                backface-visibility: hidden;
                -webkit-perspective: 1000;
                perspective: 1000;
            }
        `;
        document.head.appendChild(style);
    }

    // Optimize mobile memory
    optimizeMobileMemory() {
        // Clean up event listeners on page unload
        window.addEventListener('beforeunload', () => {
            // Remove event listeners to prevent memory leaks
            document.removeEventListener('touchstart', this.handleTouchStart);
            document.removeEventListener('touchmove', this.handleTouchMove);
            document.removeEventListener('touchend', this.handleTouchEnd);
        });
    }

    // Add mobile caching
    addMobileCaching() {
        // Add service worker for mobile caching
        if ('serviceWorker' in navigator && this.isMobile) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('Service Worker registered for mobile');
                })
                .catch(error => {
                    console.log('Service Worker registration failed');
                });
        }
    }

    // Add mobile features
    addMobileFeatures() {
        this.addMobileShare();
        this.addMobileGeolocation();
        this.addMobileCamera();
        this.addMobileVibration();
        this.addMobileBattery();
    }

    // Add mobile share
    addMobileShare() {
        if (navigator.share && this.isMobile) {
            const shareButtons = document.querySelectorAll('[data-share]');
            shareButtons.forEach(button => {
                button.addEventListener('click', async (e) => {
                    e.preventDefault();
                    
                    const shareData = {
                        title: document.title,
                        text: document.querySelector('meta[name="description"]')?.content || '',
                        url: window.location.href
                    };
                    
                    try {
                        await navigator.share(shareData);
                    } catch (err) {
                        console.log('Error sharing:', err);
                    }
                });
            });
        }
    }

    // Add mobile geolocation
    addMobileGeolocation() {
        if (navigator.geolocation && this.isMobile) {
            const locationButtons = document.querySelectorAll('[data-location]');
            locationButtons.forEach(button => {
                button.addEventListener('click', () => {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            const lat = position.coords.latitude;
                            const lng = position.coords.longitude;
                            console.log('Location:', lat, lng);
                            // Add location functionality
                        },
                        (error) => {
                            console.log('Geolocation error:', error);
                        }
                    );
                });
            });
        }
    }

    // Add mobile camera
    addMobileCamera() {
        if (navigator.mediaDevices && this.isMobile) {
            const cameraButtons = document.querySelectorAll('[data-camera]');
            cameraButtons.forEach(button => {
                button.addEventListener('click', async () => {
                    try {
                        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                        // Add camera functionality
                    } catch (err) {
                        console.log('Camera error:', err);
                    }
                });
            });
        }
    }

    // Add mobile vibration
    addMobileVibration() {
        if (navigator.vibrate && this.isMobile) {
            const vibrationButtons = document.querySelectorAll('[data-vibrate]');
            vibrationButtons.forEach(button => {
                button.addEventListener('click', () => {
                    navigator.vibrate(100); // Vibrate for 100ms
                });
            });
        }
    }

    // Add mobile battery
    addMobileBattery() {
        if ('getBattery' in navigator && this.isMobile) {
            navigator.getBattery().then(battery => {
                this.mobileData.features.battery = {
                    level: battery.level,
                    charging: battery.charging,
                    dischargingTime: battery.dischargingTime,
                    chargingTime: battery.chargingTime
                };
            });
        }
    }

    // Setup mobile analytics
    setupMobileAnalytics() {
        this.trackMobileUsage();
        this.trackMobilePerformance();
        this.trackMobileFeatures();
        this.trackMobileErrors();
    }

    // Track mobile usage
    trackMobileUsage() {
        this.mobileData.analytics.usage = {
            deviceType: this.screenSize,
            orientation: this.orientation,
            connectionType: this.connectionType,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString()
        };
        
        // Send to analytics
        this.sendMobileAnalytics('mobile_usage', this.mobileData.analytics.usage);
    }

    // Track mobile performance
    trackMobilePerformance() {
        if (window.performance) {
            const perfData = performance.getEntriesByType('navigation')[0];
            this.mobileData.performance = {
                loadTime: perfData.loadEventEnd - perfData.loadEventStart,
                domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                firstPaint: 0,
                firstContentfulPaint: 0
            };
            
            // Get paint metrics
            const paintEntries = performance.getEntriesByType('paint');
            paintEntries.forEach(entry => {
                if (entry.name === 'first-paint') {
                    this.mobileData.performance.firstPaint = entry.startTime;
                } else if (entry.name === 'first-contentful-paint') {
                    this.mobileData.performance.firstContentfulPaint = entry.startTime;
                }
            });
            
            // Send to analytics
            this.sendMobileAnalytics('mobile_performance', this.mobileData.performance);
        }
    }

    // Track mobile features
    trackMobileFeatures() {
        this.mobileData.features = {
            touch: this.touchDevice,
            share: 'share' in navigator,
            geolocation: 'geolocation' in navigator,
            camera: 'mediaDevices' in navigator,
            vibration: 'vibrate' in navigator,
            battery: 'getBattery' in navigator,
            serviceWorker: 'serviceWorker' in navigator
        };
        
        // Send to analytics
        this.sendMobileAnalytics('mobile_features', this.mobileData.features);
    }

    // Track mobile errors
    trackMobileErrors() {
        window.addEventListener('error', (e) => {
            this.sendMobileAnalytics('mobile_error', {
                message: e.message,
                filename: e.filename,
                lineno: e.lineno,
                colno: e.colno,
                stack: e.error?.stack
            });
        });
    }

    // Send mobile analytics
    sendMobileAnalytics(eventName, data) {
        if (typeof gtag !== 'undefined' && typeof gtag === 'function') {
            gtag('event', eventName, {
                event_category: 'Mobile',
                event_label: 'Mobile Enhancement',
                ...data
            });
        }
    }

    // Enhance mobile forms
    enhanceMobileForms() {
        this.optimizeMobileInputs();
        this.addMobileFormValidation();
        this.improveMobileFormUX();
        this.addMobileFormAutoComplete();
    }

    // Optimize mobile inputs
    optimizeMobileInputs() {
        const inputs = document.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            // Add mobile-specific attributes
            if (input.type === 'email') {
                input.setAttribute('autocomplete', 'email');
                input.setAttribute('autocapitalize', 'off');
            } else if (input.type === 'tel') {
                input.setAttribute('autocomplete', 'tel');
                input.setAttribute('inputmode', 'tel');
            } else if (input.type === 'number') {
                input.setAttribute('inputmode', 'numeric');
            }
            
            // Add mobile styling
            input.style.fontSize = '16px'; // Prevent zoom on iOS
            
            // Add focus states
            input.addEventListener('focus', () => {
                input.style.borderColor = '#0b5cff';
                input.style.boxShadow = '0 0 0 3px rgba(11, 92, 255, 0.1)';
            });
            
            input.addEventListener('blur', () => {
                input.style.borderColor = '#e2e8f0';
                input.style.boxShadow = 'none';
            });
        });
    }

    // Add mobile form validation
    addMobileFormValidation() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
                let isValid = true;
                
                inputs.forEach(input => {
                    if (!input.value.trim()) {
                        isValid = false;
                        input.style.borderColor = '#dc2626';
                        input.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
                    }
                });
                
                if (!isValid) {
                    e.preventDefault();
                    this.showMobileNotification('Lütfen tüm gerekli alanları doldurun.', 'error');
                }
            });
        });
    }

    // Improve mobile form UX
    improveMobileFormUX() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            // Add form progress indicator
            const progressBar = document.createElement('div');
            progressBar.className = 'form-progress';
            progressBar.style.cssText = `
                width: 100%;
                height: 4px;
                background: #e2e8f0;
                border-radius: 2px;
                margin-bottom: 1rem;
                overflow: hidden;
            `;
            
            const progressFill = document.createElement('div');
            progressFill.className = 'form-progress-fill';
            progressFill.style.cssText = `
                height: 100%;
                background: #0b5cff;
                border-radius: 2px;
                width: 0%;
                transition: width 0.3s ease;
            `;
            
            progressBar.appendChild(progressFill);
            form.insertBefore(progressBar, form.firstChild);
            
            // Update progress on input
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.addEventListener('input', () => {
                    const filledInputs = Array.from(inputs).filter(i => i.value.trim());
                    const progress = (filledInputs.length / inputs.length) * 100;
                    progressFill.style.width = progress + '%';
                });
            });
        });
    }

    // Add mobile form auto-complete
    addMobileFormAutoComplete() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.setAttribute('autocomplete', 'on');
            
            const inputs = form.querySelectorAll('input');
            inputs.forEach(input => {
                if (input.type === 'text' && input.name) {
                    input.setAttribute('autocomplete', input.name);
                }
            });
        });
    }

    // Setup mobile notifications
    setupMobileNotifications() {
        this.requestNotificationPermission();
        this.addNotificationTriggers();
        this.handleNotificationActions();
    }

    // Request notification permission
    requestNotificationPermission() {
        if ('Notification' in window && this.isMobile) {
            if (Notification.permission === 'default') {
                Notification.requestPermission().then(permission => {
                    if (permission === 'granted') {
                        this.showMobileNotification('Bildirimler etkinleştirildi!', 'success');
                    }
                });
            }
        }
    }

    // Add notification triggers
    addNotificationTriggers() {
        // Add notification for form submission
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                setTimeout(() => {
                    this.showMobileNotification('Formunuz başarıyla gönderildi!', 'success');
                }, 1000);
            });
        });
        
        // Add notification for page load
        window.addEventListener('load', () => {
            if (this.isMobile) {
                this.showMobileNotification('Mobil deneyim optimize edildi!', 'info');
            }
        });
    }

    // Handle notification actions
    handleNotificationActions() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.addEventListener('message', (event) => {
                if (event.data.type === 'NOTIFICATION_CLICK') {
                    // Handle notification click
                    console.log('Notification clicked:', event.data);
                }
            });
        }
    }

    // Show mobile notification
    showMobileNotification(message, type = 'info') {
        // Show browser notification if available
        if ('Notification' in window && Notification.permission === 'granted') {
            const notification = new Notification('DC TEKNİK', {
                body: message,
                icon: '/favicon-new.svg',
                badge: '/favicon-new.svg'
            });
            
            notification.onclick = () => {
                window.focus();
                notification.close();
            };
            
            setTimeout(() => notification.close(), 5000);
        }
        
        // Show in-app notification
        const notification = document.createElement('div');
        notification.className = 'mobile-notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            right: 20px;
            z-index: 10000;
            background: ${type === 'success' ? '#059669' : type === 'error' ? '#dc2626' : '#0b5cff'};
            color: white;
            padding: 1rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            font-weight: 500;
            text-align: center;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    // Get mobile report
    getMobileReport() {
        return {
            device: this.mobileData.device,
            performance: this.mobileData.performance,
            analytics: this.mobileData.analytics,
            features: this.mobileData.features,
            timestamp: new Date().toISOString()
        };
    }

    // Export mobile report
    exportMobileReport() {
        const report = this.getMobileReport();
        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `mobile-report-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
    }
}

// Initialize Mobile Enhancer when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.mobileEnhancer = new MobileEnhancer();
    
    // Add mobile report button to page
    const mobileButton = document.createElement('button');
    mobileButton.innerHTML = '📱 Mobil Raporu';
    mobileButton.style.cssText = `
        position: fixed; bottom: 20px; right: 140px; z-index: 10000;
        background: linear-gradient(135deg, #0b5cff, #3b82f6);
        color: white; border: none; padding: 12px 20px;
        border-radius: 25px; cursor: pointer; font-weight: 600;
        box-shadow: 0 4px 12px rgba(11, 92, 255, 0.3);
        transition: all 0.3s ease;
    `;
    mobileButton.addEventListener('click', () => {
        window.mobileEnhancer.exportMobileReport();
    });
    document.body.appendChild(mobileButton);
    
    console.log('📱 Mobile Enhancer loaded successfully');
});

