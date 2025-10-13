/* ========================================
   MODERN DESIGN - DC TEKNİK JavaScript
   Professional, Clean, and Beautiful Interactions
   ======================================== */

class ModernDesign {
    constructor() {
        this.isLoading = true;
        this.scrollThreshold = 100;
        this.animationElements = [];
        
        this.init();
    }
    
    init() {
        this.setupScrollEffects();
        this.setupAnimations();
        this.setupNavigation();
        this.setupInteractions();
        this.setupThemeToggle();
        this.setupMobileMenu();
        this.setupPerformanceOptimizations();
    }
    
    setupScrollEffects() {
        let ticking = false;
        
        const updateScrollEffects = () => {
            const scrollY = window.scrollY;
            const header = document.getElementById('header');
            
            // Header background effect
            if (header) {
                if (scrollY > this.scrollThreshold) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            }
            
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
    
    setupAnimations() {
        // Collect all animation elements
        this.animationElements = document.querySelectorAll('.stat-card, .service-card, .contact-item');
        
        // Set initial states
        this.animationElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        });
        
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
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
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
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Update active navigation
                    this.updateActiveNavigation(targetId);
                    
                    // Close mobile menu if open
                    this.closeMobileMenu();
                }
            });
        });
        
        // Update active navigation on scroll
        window.addEventListener('scroll', () => {
            this.updateActiveNavigationOnScroll();
        });
    }
    
    updateActiveNavigation(targetId) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === targetId) {
                link.classList.add('active');
            }
        });
    }
    
    updateActiveNavigationOnScroll() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.scrollY;
        const headerHeight = document.querySelector('.header').offsetHeight;
        
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
        document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'translateY(-2px)';
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translateY(0)';
            });
        });
        
        // Service card interactions
        document.querySelectorAll('.service-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
            });
        });
        
        // Stat card interactions
        document.querySelectorAll('.stat-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-4px)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
            });
        });
        
        // Contact item interactions
        document.querySelectorAll('.contact-item').forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.style.transform = 'translateY(-4px)';
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.transform = 'translateY(0)';
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
    
    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                document.body.classList.toggle('dark-theme');
                const icon = themeToggle.querySelector('i');
                icon.classList.toggle('fa-moon');
                icon.classList.toggle('fa-sun');
                
                // Save theme preference
                const isDark = document.body.classList.contains('dark-theme');
                localStorage.setItem('dcteknik_theme', isDark ? 'dark' : 'light');
                
                this.trackEvent('theme_toggle', {
                    theme: isDark ? 'dark' : 'light'
                });
            });
            
            // Load saved theme
            const savedTheme = localStorage.getItem('dcteknik_theme');
            if (savedTheme === 'dark') {
                document.body.classList.add('dark-theme');
                const icon = themeToggle.querySelector('i');
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            }
        }
    }
    
    setupMobileMenu() {
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (mobileMenuToggle && navMenu) {
            mobileMenuToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                mobileMenuToggle.classList.toggle('active');
                
                // Animate hamburger
                const spans = mobileMenuToggle.querySelectorAll('span');
                spans.forEach((span, index) => {
                    if (navMenu.classList.contains('active')) {
                        if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
                        if (index === 1) span.style.opacity = '0';
                        if (index === 2) span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
                    } else {
                        span.style.transform = 'none';
                        span.style.opacity = '1';
                    }
                });
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!mobileMenuToggle.contains(e.target) && !navMenu.contains(e.target)) {
                    this.closeMobileMenu();
                }
            });
            
            // Close menu on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.closeMobileMenu();
                }
            });
        }
    }
    
    closeMobileMenu() {
        const navMenu = document.querySelector('.nav-menu');
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        
        if (navMenu && mobileMenuToggle) {
            navMenu.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
            
            // Reset hamburger animation
            const spans = mobileMenuToggle.querySelectorAll('span');
            spans.forEach(span => {
                span.style.transform = 'none';
                span.style.opacity = '1';
            });
        }
    }
    
    setupPerformanceOptimizations() {
        // Lazy load images
        this.lazyLoadImages();
        
        // Preload critical resources
        this.preloadCriticalResources();
        
        // Performance monitoring
        this.monitorPerformance();
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
    
    preloadCriticalResources() {
        // Preload critical CSS
        const criticalCSS = document.createElement('link');
        criticalCSS.rel = 'preload';
        criticalCSS.href = 'modern-design.css';
        criticalCSS.as = 'style';
        document.head.appendChild(criticalCSS);
        
        // Preload critical fonts
        const criticalFonts = document.createElement('link');
        criticalFonts.rel = 'preload';
        criticalFonts.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Poppins:wght@300;400;500;600;700;800;900&display=swap';
        criticalFonts.as = 'style';
        document.head.appendChild(criticalFonts);
    }
    
    monitorPerformance() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.collectPerformanceMetrics();
            }, 2000);
        });
    }
    
    collectPerformanceMetrics() {
        if (window.performance && window.performance.timing) {
            const timing = window.performance.timing;
            
            const performanceMetrics = {
                pageLoadTime: timing.loadEventEnd - timing.navigationStart,
                domReadyTime: timing.domContentLoadedEventEnd - timing.navigationStart,
                firstPaint: this.getFirstPaint(),
                firstContentfulPaint: this.getFirstContentfulPaint(),
                connectionSpeed: this.getConnectionSpeed(),
                deviceType: this.getDeviceType()
            };
            
            console.log('📊 Modern Design Performance:', performanceMetrics);
            
            // Send to analytics
            this.trackEvent('performance_metrics', performanceMetrics);
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
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = element.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }
    
    isLoaded() {
        return !this.isLoading;
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.modernDesign = new ModernDesign();
});

// Export for global access
window.ModernDesign = ModernDesign;
