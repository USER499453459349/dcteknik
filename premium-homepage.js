/* ========================================
   PREMIUM HOMEPAGE - DC TEKNİK JavaScript
   Modern, Luxurious, Automotive-Focused Interactions
   ======================================== */

class PremiumHomepage {
    constructor() {
        this.isLoading = true;
        this.scrollThreshold = 100;
        this.animationElements = [];
        this.performanceMetrics = {};
        
        this.init();
    }
    
    init() {
        this.setupLoading();
        this.setupScrollEffects();
        this.setupAnimations();
        this.setupNavigation();
        this.setupInteractions();
        this.setupPerformanceMonitoring();
        this.setupAccessibility();
    }
    
    setupLoading() {
        // Hide loading screen after page load
        window.addEventListener('load', () => {
            setTimeout(() => {
                const loading = document.getElementById('premiumLoading');
                if (loading) {
                    loading.classList.add('hidden');
                    this.isLoading = false;
                    this.startAnimations();
                }
            }, 1000);
        });
    }
    
    setupScrollEffects() {
        let ticking = false;
        
        const updateScrollEffects = () => {
            const scrollY = window.scrollY;
            const header = document.getElementById('premiumHeader');
            
            // Header background effect
            if (header) {
                if (scrollY > this.scrollThreshold) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            }
            
            // Parallax effects
            this.updateParallaxEffects(scrollY);
            
            // Animation triggers
            this.checkAnimationTriggers();
            
            ticking = false;
        };
        
        const requestScrollUpdate = () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollEffects);
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', requestScrollUpdate, { passive: true });
    }
    
    updateParallaxEffects(scrollY) {
        const hero = document.querySelector('.premium-hero');
        if (hero) {
            const rate = scrollY * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        }
        
        // Background animation
        const heroBackground = document.querySelector('.premium-hero::before');
        if (heroBackground) {
            const rate = scrollY * 0.1;
            heroBackground.style.transform = `translateY(${rate}px)`;
        }
    }
    
    setupAnimations() {
        // Collect all animation elements
        this.animationElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
        
        // Set initial states
        this.animationElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = this.getInitialTransform(element);
        });
    }
    
    getInitialTransform(element) {
        if (element.classList.contains('slide-in-left')) {
            return 'translateX(-50px)';
        } else if (element.classList.contains('slide-in-right')) {
            return 'translateX(50px)';
        } else {
            return 'translateY(30px)';
        }
    }
    
    startAnimations() {
        if (this.isLoading) return;
        
        // Trigger initial animations
        setTimeout(() => {
            this.checkAnimationTriggers();
        }, 500);
    }
    
    checkAnimationTriggers() {
        const windowHeight = window.innerHeight;
        const scrollY = window.scrollY;
        
        this.animationElements.forEach((element, index) => {
            const elementTop = element.getBoundingClientRect().top + scrollY;
            const elementBottom = elementTop + element.offsetHeight;
            const triggerPoint = scrollY + windowHeight * 0.8;
            
            if (elementTop < triggerPoint && elementBottom > scrollY) {
                // Stagger animations
                setTimeout(() => {
                    element.classList.add('visible');
                }, index * 100);
            }
        });
    }
    
    setupNavigation() {
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const headerHeight = document.querySelector('.premium-header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Update active navigation
                    this.updateActiveNavigation(targetId);
                }
            });
        });
        
        // Update active navigation on scroll
        window.addEventListener('scroll', () => {
            this.updateActiveNavigationOnScroll();
        });
    }
    
    updateActiveNavigation(targetId) {
        document.querySelectorAll('.premium-nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === targetId) {
                link.classList.add('active');
            }
        });
    }
    
    updateActiveNavigationOnScroll() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.scrollY;
        const headerHeight = document.querySelector('.premium-header').offsetHeight;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 100;
            const sectionBottom = sectionTop + section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollY >= sectionTop && scrollY < sectionBottom) {
                this.updateActiveNavigation(`#${sectionId}`);
            }
        });
    }
    
    setupInteractions() {
        // Button hover effects
        document.querySelectorAll('.premium-btn-primary, .premium-btn-secondary').forEach(button => {
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'translateY(-3px)';
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translateY(0)';
            });
        });
        
        // Service card interactions
        document.querySelectorAll('.premium-service-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
            });
        });
        
        // Social link interactions
        document.querySelectorAll('.premium-social-link').forEach(link => {
            link.addEventListener('mouseenter', () => {
                link.style.transform = 'translateY(-2px) scale(1.1)';
            });
            
            link.addEventListener('mouseleave', () => {
                link.style.transform = 'translateY(0) scale(1)';
            });
        });
        
        // Phone number click tracking
        document.querySelectorAll('a[href^="tel:"]').forEach(link => {
            link.addEventListener('click', () => {
                this.trackEvent('phone_click', {
                    phone_number: link.getAttribute('href').replace('tel:', ''),
                    location: this.getElementLocation(link)
                });
            });
        });
        
        // WhatsApp click tracking
        document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
            link.addEventListener('click', () => {
                this.trackEvent('whatsapp_click', {
                    location: this.getElementLocation(link)
                });
            });
        });
    }
    
    setupPerformanceMonitoring() {
        // Performance metrics collection
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.collectPerformanceMetrics();
                this.optimizeBasedOnPerformance();
            }, 2000);
        });
        
        // Core Web Vitals monitoring
        this.monitorCoreWebVitals();
    }
    
    collectPerformanceMetrics() {
        if (window.performance && window.performance.timing) {
            const timing = window.performance.timing;
            
            this.performanceMetrics = {
                pageLoadTime: timing.loadEventEnd - timing.navigationStart,
                domReadyTime: timing.domContentLoadedEventEnd - timing.navigationStart,
                firstPaint: this.getFirstPaint(),
                firstContentfulPaint: this.getFirstContentfulPaint(),
                connectionSpeed: this.getConnectionSpeed(),
                deviceType: this.getDeviceType()
            };
            
            console.log('📊 Premium Homepage Performance:', this.performanceMetrics);
            
            // Send to analytics
            this.trackEvent('performance_metrics', this.performanceMetrics);
        }
    }
    
    getFirstPaint() {
        const paintEntries = performance.getEntriesByType('paint');
        const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
        return firstPaint ? firstPaint.startTime : null;
    }
    
    getFirstContentfulPaint() {
        const paintEntries = performance.getEntriesByType('paint');
        const firstContentfulPaint = paintEntries.find(entry => entry.name === 'first-contentful-paint');
        return firstContentfulPaint ? firstContentfulPaint.startTime : null;
    }
    
    getConnectionSpeed() {
        if ('connection' in navigator) {
            const connection = navigator.connection;
            return {
                effectiveType: connection.effectiveType,
                downlink: connection.downlink,
                rtt: connection.rtt
            };
        }
        return null;
    }
    
    getDeviceType() {
        const width = window.innerWidth;
        if (width < 768) return 'mobile';
        if (width < 1024) return 'tablet';
        return 'desktop';
    }
    
    monitorCoreWebVitals() {
        if ('PerformanceObserver' in window) {
            // Largest Contentful Paint (LCP)
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                this.trackEvent('core_web_vital', {
                    metric: 'LCP',
                    value: lastEntry.startTime
                });
            });
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
            
            // First Input Delay (FID)
            const fidObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    this.trackEvent('core_web_vital', {
                        metric: 'FID',
                        value: entry.processingStart - entry.startTime
                    });
                });
            });
            fidObserver.observe({ entryTypes: ['first-input'] });
            
            // Cumulative Layout Shift (CLS)
            let clsValue = 0;
            const clsObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                });
                this.trackEvent('core_web_vital', {
                    metric: 'CLS',
                    value: clsValue
                });
            });
            clsObserver.observe({ entryTypes: ['layout-shift'] });
        }
    }
    
    optimizeBasedOnPerformance() {
        // Optimize based on performance metrics
        if (this.performanceMetrics.pageLoadTime > 3000) {
            console.log('⚠️ Slow page load detected, optimizing...');
            this.enableAggressiveOptimizations();
        }
        
        if (this.performanceMetrics.connectionSpeed?.effectiveType === 'slow-2g' || 
            this.performanceMetrics.connectionSpeed?.effectiveType === '2g') {
            console.log('⚠️ Slow connection detected, reducing animations...');
            this.reduceAnimations();
        }
    }
    
    enableAggressiveOptimizations() {
        // Reduce animation complexity
        document.body.classList.add('reduced-motion');
        
        // Lazy load non-critical images
        this.lazyLoadImages();
    }
    
    reduceAnimations() {
        // Disable complex animations for slow connections
        document.body.classList.add('reduced-motion');
        
        // Reduce animation duration
        const style = document.createElement('style');
        style.textContent = `
            .fade-in, .slide-in-left, .slide-in-right {
                transition-duration: 0.2s !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    setupAccessibility() {
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });
        
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
        
        // Focus management
        document.querySelectorAll('a, button').forEach(element => {
            element.addEventListener('focus', () => {
                element.style.outline = '2px solid var(--gold)';
                element.style.outlineOffset = '2px';
            });
            
            element.addEventListener('blur', () => {
                element.style.outline = 'none';
            });
        });
        
        // Skip to content link
        this.createSkipLink();
    }
    
    createSkipLink() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-link';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--gold);
            color: var(--primary-dark);
            padding: 8px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 10000;
            transition: top 0.3s;
        `;
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
    }
    
    // Utility methods
    trackEvent(eventName, data = {}) {
        // Analytics tracking
        const eventData = {
            event: eventName,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            ...data
        };
        
        console.log('📊 Event:', eventData);
        
        // Send to analytics service (implement as needed)
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, data);
        }
        
        // Store in localStorage for debugging
        try {
            const events = JSON.parse(localStorage.getItem('dcteknik_events') || '[]');
            events.push(eventData);
            if (events.length > 100) events.splice(0, events.length - 100);
            localStorage.setItem('dcteknik_events', JSON.stringify(events));
        } catch (error) {
            console.warn('Could not store event data:', error);
        }
    }
    
    getElementLocation(element) {
        const rect = element.getBoundingClientRect();
        const section = element.closest('section');
        return {
            section: section ? section.id : 'unknown',
            x: rect.left,
            y: rect.top,
            visible: rect.top >= 0 && rect.bottom <= window.innerHeight
        };
    }
    
    // Public methods
    scrollToSection(sectionId) {
        const element = document.querySelector(sectionId);
        if (element) {
            const headerHeight = document.querySelector('.premium-header').offsetHeight;
            const targetPosition = element.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }
    
    getPerformanceMetrics() {
        return this.performanceMetrics;
    }
    
    isLoaded() {
        return !this.isLoading;
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.premiumHomepage = new PremiumHomepage();
});

// Export for global access
window.PremiumHomepage = PremiumHomepage;
