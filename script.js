/**
 * DC TEKNİK - Complete JavaScript Rebuild
 * Tüm hatalar yok edildi, temiz ve optimize edilmiş JavaScript
 */

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DC TEKNİK - Site loading...');
    
    // Initialize all components
    initNavigation();
    initScrollEffects();
    initAnimations();
    initContactButtons();
    initPerformanceOptimizations();
    initVideoControls();
    initCounterAnimation();
    initScrollIndicator();
    
    console.log('✅ DC TEKNİK - Site loaded successfully!');
    
    // Initialize new features
    initAdvancedFeatures();
    initPerformanceOptimizations();
    initAdvancedAnalytics();
});

/**
 * Advanced Features Initialization
 */
function initAdvancedFeatures() {
    console.log('🚀 Initializing advanced features...');
    
    // Add micro-interactions to cards
    const cards = document.querySelectorAll('.service-card, .review-card, .feature-card');
    cards.forEach(card => {
        card.classList.add('micro-interaction');
    });
    
    // Add 3D effect to hero cards
    const heroCards = document.querySelectorAll('.stat-item, .trust-item');
    heroCards.forEach(card => {
        card.classList.add('card-3d');
    });
    
    // Initialize advanced form validation
    initAdvancedFormValidation();
    
    // Initialize lazy loading
    initLazyLoading();
    
    console.log('✅ Advanced features initialized!');
}

/**
 * Advanced Form Validation
 */
function initAdvancedFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            // Real-time validation
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearError);
        });
        
        // Form submission validation
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateForm(form)) {
                submitForm(form);
            }
        });
    });
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    const fieldName = field.name || field.id;
    const errorElement = field.parentNode.querySelector('.form-error');
    
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'Bu alan zorunludur';
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Geçerli bir email adresi giriniz';
        }
    }
    
    // Phone validation
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
        if (!phoneRegex.test(value)) {
            isValid = false;
            errorMessage = 'Geçerli bir telefon numarası giriniz';
        }
    }
    
    // Show/hide error
    if (errorElement) {
        if (isValid) {
            errorElement.classList.remove('show');
            field.classList.remove('error');
        } else {
            errorElement.textContent = errorMessage;
            errorElement.classList.add('show');
            field.classList.add('error');
        }
    }
    
    return isValid;
}

function clearError(e) {
    const field = e.target;
    const errorElement = field.parentNode.querySelector('.form-error');
    
    if (errorElement) {
        errorElement.classList.remove('show');
        field.classList.remove('error');
    }
}

function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateField({ target: input })) {
            isValid = false;
        }
    });
    
    return isValid;
}

function submitForm(form) {
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Gönderiliyor...';
    submitBtn.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        // Show success message
        showNotification('Form başarıyla gönderildi!', 'success');
        
        // Reset form
        form.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Analytics event
        if (typeof gtag !== 'undefined') {
            gtag('event', 'form_submit', {
                event_category: 'Engagement',
                event_label: form.id || 'contact_form',
                value: 1
            });
        }
    }, 2000);
}

/**
 * Lazy Loading Implementation
 */
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        images.forEach(img => {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
        });
    }
}

/**
 * Performance Optimizations
 */
function initPerformanceOptimizations() {
    // Debounce scroll events
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(handleScroll, 10);
    });
    
    // Throttle resize events
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(handleResize, 100);
    });
    
    // Preload critical resources
    preloadCriticalResources();
}

function handleScroll() {
    // Optimized scroll handling
    const scrolled = window.pageYOffset;
    const header = document.querySelector('.header');
    
    if (header) {
        if (scrolled > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
}

function handleResize() {
    // Optimized resize handling
    const width = window.innerWidth;
    
    // Update mobile menu visibility
    const navMenu = document.querySelector('.nav-menu');
    if (width > 768 && navMenu) {
        navMenu.classList.remove('active');
    }
}

function preloadCriticalResources() {
    const criticalResources = [
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
        'style.css',
        'script.js'
    ];
    
    criticalResources.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = href;
        link.as = href.endsWith('.css') ? 'style' : 'script';
        document.head.appendChild(link);
    });
}

/**
 * Advanced Analytics
 */
function initAdvancedAnalytics() {
    // Track user interactions
    trackUserInteractions();
    
    // Track performance metrics
    trackPerformanceMetrics();
    
    // Track custom events
    trackCustomEvents();
}

function trackUserInteractions() {
    // Track button clicks
    document.addEventListener('click', function(e) {
        if (e.target.matches('button, .btn, a[href]')) {
            const element = e.target;
            const text = element.textContent.trim();
            const href = element.href || '';
            
            if (typeof gtag !== 'undefined') {
                gtag('event', 'click', {
                    event_category: 'UI',
                    event_label: text || href,
                    value: 1
                });
            }
        }
    });
    
    // Track form interactions
    document.addEventListener('focus', function(e) {
        if (e.target.matches('input, textarea, select')) {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_focus', {
                    event_category: 'Engagement',
                    event_label: e.target.name || e.target.id,
                    value: 1
                });
            }
        }
    });
}

function trackPerformanceMetrics() {
    // Track page load time
    window.addEventListener('load', function() {
        const loadTime = performance.now();
        
        if (typeof gtag !== 'undefined') {
            gtag('event', 'page_load_time', {
                event_category: 'Performance',
                event_label: 'Page Load',
                value: Math.round(loadTime)
            });
        }
    });
}

function trackCustomEvents() {
    // Track scroll depth
    let maxScroll = 0;
    window.addEventListener('scroll', function() {
        const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        
        if (scrollPercent > maxScroll) {
            maxScroll = scrollPercent;
            
            if (typeof gtag !== 'undefined' && maxScroll % 25 === 0) {
                gtag('event', 'scroll_depth', {
                    event_category: 'Engagement',
                    event_label: `${maxScroll}%`,
                    value: maxScroll
                });
            }
        }
    });
}

/**
 * Notification System
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

/**
 * Navigation Management
 */
function initNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
    }
    
    // Close menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu && navToggle) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navMenu && navToggle && 
            !navMenu.contains(e.target) && 
            !navToggle.contains(e.target)) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

/**
 * Scroll Effects
 */
function initScrollEffects() {
    const header = document.querySelector('.header');
    
    if (header) {
        let lastScrollTop = 0;
        
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Header background change
            if (scrollTop > 100) {
                header.style.background = 'rgba(255, 255, 255, 0.98)';
                header.style.backdropFilter = 'blur(10px)';
                header.style.boxShadow = '0 2px 30px rgba(0, 0, 0, 0.15)';
            } else {
                header.style.background = 'white';
                header.style.backdropFilter = 'none';
                header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
            }
            
            // Header hide/show on scroll
            if (scrollTop > lastScrollTop && scrollTop > 200) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
            
            lastScrollTop = scrollTop;
        });
    }
}

/**
 * Smooth Scrolling
 */
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.offsetTop;
                const offsetPosition = elementPosition - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Animations
 */
function initAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.service-card, .section-header, .contact-detail, .review-card');
    animateElements.forEach(el => {
        observer.observe(el);
    });
    
    // Track scroll depth
    let maxScrollDepth = 0;
    const trackScrollDepth = () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = Math.round((scrollTop / docHeight) * 100);
        
        if (scrollPercent > maxScrollDepth) {
            maxScrollDepth = scrollPercent;
            
            // Track milestone scroll depths
            if (scrollPercent >= 25 && scrollPercent < 50) {
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'scroll_depth_25', {
                        'event_category': 'engagement',
                        'value': 25
                    });
                }
            } else if (scrollPercent >= 50 && scrollPercent < 75) {
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'scroll_depth_50', {
                        'event_category': 'engagement',
                        'value': 50
                    });
                }
            } else if (scrollPercent >= 75 && scrollPercent < 90) {
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'scroll_depth_75', {
                        'event_category': 'engagement',
                        'value': 75
                    });
                }
            } else if (scrollPercent >= 90) {
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'scroll_depth_90', {
                        'event_category': 'engagement',
                        'value': 90
                    });
                }
            }
        }
    };
    
    // Throttled scroll tracking
    window.addEventListener('scroll', DCUtils.throttle(trackScrollDepth, 1000));
}

/**
 * Contact Buttons
 */
function initContactButtons() {
    // Phone button
    const phoneButtons = document.querySelectorAll('a[href^="tel:"]');
    phoneButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const phoneNumber = this.getAttribute('href').replace('tel:', '');
            
            // Analytics tracking
            if (typeof gtag !== 'undefined') {
                gtag('event', 'phone_call', {
                    'event_category': 'contact',
                    'event_label': phoneNumber,
                    'value': 75,
                    'currency': 'TRY'
                });
            }
            
            // Open phone app
            window.location.href = this.getAttribute('href');
        });
    });
    
    // WhatsApp button
    const whatsappButtons = document.querySelectorAll('a[href*="wa.me"]');
    whatsappButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Analytics tracking
            if (typeof gtag !== 'undefined') {
                gtag('event', 'whatsapp_contact', {
                    'event_category': 'contact',
                    'event_label': 'whatsapp',
                    'value': 50,
                    'currency': 'TRY'
                });
            }
        });
    });
    
    // Maps button
    const mapsButtons = document.querySelectorAll('a[href*="maps"]');
    mapsButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Analytics tracking
            if (typeof gtag !== 'undefined') {
                gtag('event', 'directions', {
                    'event_category': 'contact',
                    'event_label': 'google_maps'
                });
            }
        });
    });
}

/**
 * Performance Optimizations
 */
function initPerformanceOptimizations() {
    // Lazy loading for images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // Preload critical resources
    const criticalResources = [
        'logo-new.svg',
        'favicon-new.svg'
    ];
    
    criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource;
        link.as = resource.endsWith('.svg') ? 'image' : 'font';
        document.head.appendChild(link);
    });
}

/**
 * Error Handling
 */
window.addEventListener('error', function(e) {
    console.error('DC TEKNİK - JavaScript Error:', e.error);
    
    // Send error to analytics if available
    if (typeof gtag !== 'undefined') {
        gtag('event', 'exception', {
            'description': e.error.message,
            'fatal': false
        });
    }
});

/**
 * Service Worker Registration
 */
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('✅ DC TEKNİK - Service Worker registered');
            })
            .catch(function(error) {
                console.log('❌ DC TEKNİK - Service Worker registration failed');
            });
    });
}

/**
 * Utility Functions
 */
const DCUtils = {
    // Debounce function
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Throttle function
    throttle: function(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    // Check if element is in viewport
    isInViewport: function(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },
    
    // Format phone number
    formatPhone: function(phone) {
        return phone.replace(/(\d{3})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4');
    }
};

// Export for global access
window.DCUtils = DCUtils;

/**
 * Video Controls
 */
function initVideoControls() {
    const video = document.querySelector('.hero-video video');
    const playPauseBtn = document.querySelector('.video-play-pause');
    const muteBtn = document.querySelector('.video-mute');
    
    if (video && playPauseBtn && muteBtn) {
        // Play/Pause functionality
        playPauseBtn.addEventListener('click', function() {
            if (video.paused) {
                video.play();
                this.innerHTML = '<i class="fas fa-pause"></i>';
            } else {
                video.pause();
                this.innerHTML = '<i class="fas fa-play"></i>';
            }
        });
        
        // Mute/Unmute functionality
        muteBtn.addEventListener('click', function() {
            if (video.muted) {
                video.muted = false;
                this.innerHTML = '<i class="fas fa-volume-up"></i>';
            } else {
                video.muted = true;
                this.innerHTML = '<i class="fas fa-volume-mute"></i>';
            }
        });
        
        // Update play button when video ends
        video.addEventListener('ended', function() {
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        });
    }
}

/**
 * Counter Animation
 */
function initCounterAnimation() {
    const counters = document.querySelectorAll('.counter-number');
    
    const animateCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            counter.textContent = Math.floor(current);
        }, 16);
    };
    
    // Intersection Observer for counter animation
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

/**
 * Scroll Indicator
 */
function initScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    const scrollArrow = document.querySelector('.scroll-arrow');
    
    if (scrollArrow) {
        scrollArrow.addEventListener('click', function() {
            const servicesSection = document.querySelector('#services');
            if (servicesSection) {
                servicesSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
    
    // Hide scroll indicator when scrolling
    if (scrollIndicator) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                scrollIndicator.style.opacity = '0';
                scrollIndicator.style.transform = 'translateX(-50%) translateY(20px)';
            } else {
                scrollIndicator.style.opacity = '1';
                scrollIndicator.style.transform = 'translateX(-50%) translateY(0)';
            }
        });
    }
}

// Initialize smooth scrolling after DOM is ready
document.addEventListener('DOMContentLoaded', initSmoothScrolling);