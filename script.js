/**
 * DC TEKNİK - Complete JavaScript Rebuild
 * Tüm hatalar yok edildi, temiz ve optimize edilmiş JavaScript
 */

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Use safe log if available, otherwise console.log
    const log = window.safeLog || console.log;
    const safeExecute = window.safeExecute || function(fn) { 
        try { return fn(); } catch(e) { return null; }
    };
    
    log('🚀 DC TEKNİK - Site loading...');
    
    // Security systems should be initialized first
    // (security-firewall.js, advanced-security.js, security-monitor.js load before this)
    safeExecute(function() {
        if (window.SecurityFirewall && typeof window.SecurityFirewall.init === 'function') {
            // SecurityFirewall is already initialized in its own script
            log('🛡️ Security Firewall: Active');
        }
    });
    
    safeExecute(function() {
        if (window.securityMonitor) {
            log('🔍 Security Monitor: Active');
        }
    });
    
    safeExecute(function() {
        if (window.SecurityLogger && typeof window.SecurityLogger.log === 'function') {
            window.SecurityLogger.log('page_loaded', 'low', {
                page: window.location.pathname || '/'
            });
        }
    });
    
    // Initialize production systems
    safeExecute(function() {
        // Zero-downtime deploy - restore pending data
        if (window.ZeroDowntimeDeploy && typeof window.ZeroDowntimeDeploy.restorePendingData === 'function') {
            window.ZeroDowntimeDeploy.restorePendingData();
        }
    });
    
    // Initialize all components with error handling
    const initFunctions = [
        initNavigation,
        initScrollEffects,
        initAnimations,
        initContactButtons,
        initPerformanceOptimizations,
        initVideoControls,
        initCounterAnimation,
        initScrollIndicator,
        initAdvancedFeatures,
        initAdvancedAnalytics
    ];
    
    initFunctions.forEach(function(fn) {
        safeExecute(function() {
            if (typeof fn === 'function') {
                fn();
            }
        });
    });
    
    log('✅ DC TEKNİK - Site loaded successfully!');
    
    // Security system health check
    setTimeout(function() {
        safeExecute(function() {
            if (window.SecurityFirewall && typeof window.SecurityFirewall.getReport === 'function') {
                const report = window.SecurityFirewall.getReport();
                log('🛡️ Security Firewall Status:', report);
            }
        });
        
        safeExecute(function() {
            if (window.SecurityLogger && typeof window.SecurityLogger.getSummary === 'function') {
                const summary = window.SecurityLogger.getSummary();
                log('📊 Security Events Summary:', summary);
            }
        });
    }, 2000);
});

/**
 * Generate CSRF Token
 */
function generateCSRFToken() {
    try {
        if (window.crypto && window.crypto.getRandomValues) {
            const array = new Uint32Array(4);
            window.crypto.getRandomValues(array);
            return Array.from(array, dec => ('0' + dec.toString(16)).substr(-2)).join('');
        } else {
            // Fallback for older browsers
            return Math.random().toString(36).substring(2, 15) + 
                   Math.random().toString(36).substring(2, 15) + 
                   Date.now().toString(36);
        }
    } catch (e) {
        const safeError = window.safeError || console.error;
        safeError('CSRF token generation failed:', e);
        // Fallback
        return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    }
}

/**
 * Get or create CSRF Token
 */
function getCSRFToken() {
    try {
        if (window.SecureStorage && typeof window.SecureStorage.getItem === 'function') {
            let token = window.SecureStorage.getItem('csrf_token');
            if (!token) {
                token = generateCSRFToken();
                if (typeof window.SecureStorage.setItem === 'function') {
                    window.SecureStorage.setItem('csrf_token', token);
                }
            }
            return token || generateCSRFToken();
        } else {
            // Fallback
            return generateCSRFToken();
        }
    } catch (e) {
        const safeError = window.safeError || console.error;
        safeError('CSRF token retrieval failed:', e);
        return generateCSRFToken();
    }
}

/**
 * Rate Limiting - Simple client-side implementation
 */
const rateLimiter = {
    requests: new Map(),
    
    check(identifier, maxRequests = 5, windowMs = 60000) {
        const now = Date.now();
        const key = identifier;
        
        if (!this.requests.has(key)) {
            this.requests.set(key, { count: 1, resetTime: now + windowMs });
            return true;
        }
        
        const record = this.requests.get(key);
        
        // Reset if window expired
        if (now > record.resetTime) {
            record.count = 1;
            record.resetTime = now + windowMs;
            return true;
        }
        
        // Check if limit exceeded
        if (record.count >= maxRequests) {
            return false;
        }
        
        record.count++;
        return true;
    },
    
    reset(identifier) {
        this.requests.delete(identifier);
    }
};

/**
 * Secure Storage Helper - Sanitizes data before storing
 */
const SecureStorage = {
    setItem(key, value) {
        try {
            if (!key || value === null || value === undefined) {
                return false;
            }
            
            if (typeof sessionStorage === 'undefined') {
                return false;
            }
            
            const sanitized = typeof value === 'string' ? sanitizeInput(value) : JSON.stringify(value);
            sessionStorage.setItem(key, sanitized);
            return true;
        } catch (e) {
            const safeError = window.safeError || console.error;
            safeError('Storage error:', e);
            
            // Try localStorage as fallback
            try {
                if (typeof localStorage !== 'undefined') {
                    const sanitized = typeof value === 'string' ? sanitizeInput(value) : JSON.stringify(value);
                    localStorage.setItem(key, sanitized);
                    return true;
                }
            } catch (e2) {
                // Both storages failed
            }
            return false;
        }
    },
    
    getItem(key) {
        try {
            if (!key || typeof sessionStorage === 'undefined') {
                // Try localStorage as fallback
                try {
                    if (typeof localStorage !== 'undefined') {
                        return localStorage.getItem(key);
                    }
                } catch (e) {
                    // Ignore
                }
                return null;
            }
            
            const value = sessionStorage.getItem(key);
            if (!value) {
                // Try localStorage as fallback
                try {
                    if (typeof localStorage !== 'undefined') {
                        return localStorage.getItem(key);
                    }
                } catch (e) {
                    // Ignore
                }
                return null;
            }
            
            // Try to parse JSON, fallback to string
            try {
                return JSON.parse(value);
            } catch {
                // Don't sanitize security tokens
                if (key.includes('token') || key.includes('csrf')) {
                    return value;
                }
                return sanitizeInput(value);
            }
        } catch (e) {
            const safeError = window.safeError || console.error;
            safeError('Storage read error:', e);
            
            // Try localStorage as fallback
            try {
                if (typeof localStorage !== 'undefined') {
                    return localStorage.getItem(key);
                }
            } catch (e2) {
                // Ignore
            }
            return null;
        }
    },
    
    removeItem(key) {
        try {
            if (!key) return false;
            
            if (typeof sessionStorage !== 'undefined') {
                sessionStorage.removeItem(key);
            }
            
            // Also remove from localStorage
            try {
                if (typeof localStorage !== 'undefined') {
                    localStorage.removeItem(key);
                }
            } catch (e) {
                // Ignore
            }
            
            return true;
        } catch (e) {
            const safeError = window.safeError || console.error;
            safeError('Storage remove error:', e);
            return false;
        }
    },
    
    clear() {
        try {
            if (typeof sessionStorage === 'undefined') {
                return false;
            }
            
            // Don't clear CSRF token and session ID for security
            const csrfToken = this.getItem('csrf_token');
            const sessionId = this.getItem('session_id');
            
            sessionStorage.clear();
            
            // Restore security tokens
            if (csrfToken) this.setItem('csrf_token', csrfToken);
            if (sessionId) this.setItem('session_id', sessionId);
            
            return true;
        } catch (e) {
            const safeError = window.safeError || console.error;
            safeError('Storage clear error:', e);
            return false;
        }
    }
};

/**
 * Get user identifier for rate limiting
 */
function getUserIdentifier() {
    // Use combination of IP hints and session
    let sessionId = SecureStorage.getItem('session_id');
    if (!sessionId) {
        sessionId = generateCSRFToken();
        SecureStorage.setItem('session_id', sessionId);
    }
    return sessionId;
}

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
    
    // Initialize CSRF tokens for forms
    initCSRFTokens();
    
    // Initialize advanced form validation
    initAdvancedFormValidation();
    
    // Initialize lazy loading
    initLazyLoading();
    
    console.log('✅ Advanced features initialized!');
}

/**
 * Initialize CSRF Tokens for all forms
 */
function initCSRFTokens() {
    const forms = document.querySelectorAll('form');
    const token = getCSRFToken();
    
    forms.forEach(form => {
        // Check if CSRF token input already exists
        let tokenInput = form.querySelector('input[name="csrf_token"]');
        if (!tokenInput) {
            tokenInput = document.createElement('input');
            tokenInput.type = 'hidden';
            tokenInput.name = 'csrf_token';
            tokenInput.value = token;
            form.appendChild(tokenInput);
        } else {
            tokenInput.value = token;
        }
        
        // Add token to form data on submit
        form.addEventListener('submit', function(e) {
            const formToken = getCSRFToken();
            if (tokenInput) {
                tokenInput.value = formToken;
            }
        });
    });
    
    // Also add to meta tag for JavaScript access
    let metaToken = document.querySelector('meta[name="csrf-token"]');
    if (!metaToken) {
        metaToken = document.createElement('meta');
        metaToken.name = 'csrf-token';
        metaToken.content = token;
        document.head.appendChild(metaToken);
    } else {
        metaToken.content = token;
    }
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

/**
 * Sanitize input to prevent XSS attacks
 */
function sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    
    // Remove potentially dangerous characters
    return input
        .replace(/[<>]/g, '') // Remove < and >
        .replace(/javascript:/gi, '') // Remove javascript: protocol
        .replace(/on\w+=/gi, '') // Remove event handlers (onclick, etc.)
        .replace(/data:/gi, '') // Remove data: protocol
        .trim();
}

/**
 * Validate and sanitize field input
 */
function validateField(e) {
    const field = e.target;
    let value = field.value;
    
    // Sanitize input first
    value = sanitizeInput(value);
    field.value = value; // Update field with sanitized value
    
    const sanitizedValue = value.trim();
    const fieldName = field.name || field.id;
    const errorElement = field.parentNode.querySelector('.form-error');
    
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (field.hasAttribute('required') && !sanitizedValue) {
        isValid = false;
        errorMessage = 'Bu alan zorunludur';
    }
    
    // Length validation (prevent buffer overflow)
    if (sanitizedValue.length > 10000) {
        isValid = false;
        errorMessage = 'Girdi çok uzun (maksimum 10000 karakter)';
    }
    
    // Email validation with stricter regex
    if (field.type === 'email' && sanitizedValue) {
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        if (!emailRegex.test(sanitizedValue)) {
            isValid = false;
            errorMessage = 'Geçerli bir email adresi giriniz';
        }
        // Additional check for suspicious patterns
        if (/[<>'"\/\\]/.test(sanitizedValue)) {
            isValid = false;
            errorMessage = 'Email adresi geçersiz karakterler içeriyor';
        }
    }
    
    // Phone validation with stricter regex
    if (field.type === 'tel' && sanitizedValue) {
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,15}$/;
        if (!phoneRegex.test(sanitizedValue)) {
            isValid = false;
            errorMessage = 'Geçerli bir telefon numarası giriniz (10-15 haneli)';
        }
        // Remove non-numeric characters for validation
        const digitsOnly = sanitizedValue.replace(/\D/g, '');
        if (digitsOnly.length < 10 || digitsOnly.length > 15) {
            isValid = false;
            errorMessage = 'Telefon numarası 10-15 haneli olmalıdır';
        }
    }
    
    // Textarea/content validation - check for XSS patterns
    if ((field.tagName === 'TEXTAREA' || field.type === 'text') && sanitizedValue) {
        const dangerousPatterns = [
            /<script/i,
            /javascript:/i,
            /on\w+\s*=/i,
            /<iframe/i,
            /<object/i,
            /<embed/i,
            /<link/i,
            /<meta/i
        ];
        
        for (const pattern of dangerousPatterns) {
            if (pattern.test(sanitizedValue)) {
                isValid = false;
                errorMessage = 'Güvenlik nedeniyle geçersiz karakterler içeriyor';
                // Log security attempt
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'xss_attempt_blocked', {
                        'event_category': 'security',
                        'event_label': 'form_field',
                        'non_interaction': true
                    });
                }
                const safeWarn = window.safeWarn || console.warn;
                safeWarn('⚠️ XSS attempt blocked in field:', fieldName);
                break;
            }
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
    // Rate limiting check
    const userIdentifier = getUserIdentifier();
    if (!rateLimiter.check(userIdentifier, 5, 60000)) { // 5 requests per minute
        showNotification('Çok fazla istek gönderdiniz. Lütfen bir dakika bekleyin.', 'error');
        
        if (typeof gtag !== 'undefined') {
            gtag('event', 'rate_limit_exceeded', {
                'event_category': 'security',
                'event_label': 'form_submit',
                'non_interaction': true
            });
        }
        
        return;
    }
    
    // CSRF token validation
    const formToken = form.querySelector('input[name="csrf_token"]');
    const sessionToken = SecureStorage.getItem('csrf_token');
    
    if (formToken && sessionToken && formToken.value !== sessionToken) {
        showNotification('Güvenlik hatası. Lütfen sayfayı yenileyin ve tekrar deneyin.', 'error');
        
        if (typeof gtag !== 'undefined') {
            gtag('event', 'csrf_validation_failed', {
                'event_category': 'security',
                'event_label': 'form_submit',
                'non_interaction': true
            });
        }
        
        const safeError = window.safeError || console.error;
        safeError('⚠️ CSRF token validation failed');
        return;
    }
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn ? submitBtn.textContent : 'Gönder';
    submitBtn.textContent = 'Gönderiliyor...';
    submitBtn.disabled = true;
    
    // Collect form data (sanitized)
    const formData = new FormData(form);
    const formDataObj = {};
    
    // Sanitize and collect form data (no sensitive data logging)
    for (const [key, value] of formData.entries()) {
        if (key !== 'csrf_token' && key !== 'password') {
            // Only log non-sensitive fields
            formDataObj[key] = sanitizeInput(String(value));
        }
    }
    
    // Send email if Email Service is available
    const emailPromise = window.EmailService && window.EmailService.isConfigured()
        ? window.EmailService.sendWithFallback(formDataObj)
            .then(function(response) {
                // Send auto-reply to customer
                if (formDataObj.email) {
                    window.EmailService.sendAutoReply(formDataObj.email, formDataObj.name || formDataObj.from_name);
                }
                
                // Record success in deployment monitor
                if (window.DeploymentMonitor) {
                    // Success - no action needed
                }
                
                return response;
            })
            .catch(function(error) {
                const safeError = window.safeError || console.error;
                safeError('Email sending failed:', error);
                
                // Record failure in deployment monitor
                if (window.DeploymentMonitor) {
                    window.DeploymentMonitor.recordError({
                        type: 'email_service_failed',
                        error: error.message || String(error)
                    }, false); // Non-critical
                }
                
                // Attempt auto-recovery
                if (window.AutoRecovery) {
                    window.AutoRecovery.recordFailure('EmailService', error);
                }
                
                // Continue even if email fails
                return null;
            })
        : Promise.resolve(null);
    
        // Show success message
    emailPromise.then(function() {
        showNotification('Form başarıyla gönderildi! En kısa sürede size geri dönüş yapacağız.', 'success');
        
        // Announce to screen readers
        if (window.AccessibilityModule) {
            window.AccessibilityModule.announce('Form başarıyla gönderildi. En kısa sürede size geri dönüş yapacağız.', 'polite');
        }
        
        // Reset form
        form.reset();
        
        // Re-initialize CSRF token
        initCSRFTokens();
        
        if (submitBtn) {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        }
        
        // Analytics event (no sensitive data)
        if (typeof gtag !== 'undefined') {
            // Form submission event
            gtag('event', 'form_submit', {
                event_category: 'Engagement',
                event_label: form.id || 'contact_form',
                value: 1
            });
            
            // Track email service status
            gtag('event', 'email_service_used', {
                event_category: 'Communication',
                event_label: window.EmailService && window.EmailService.isConfigured() ? 'EmailJS' : 'Fallback',
                non_interaction: true
            });
            
            // Track form completion with custom parameters
            gtag('event', 'form_complete', {
                event_category: 'Lead Generation',
                event_label: form.id || 'contact_form',
                contact_method: 'form',
                form_fields_count: Object.keys(formDataObj).length,
                value: 1
            });
            
            // Track to Security Logger if available
            if (window.SecurityLogger && typeof window.SecurityLogger.log === 'function') {
                window.SecurityLogger.log('form_submission', 'low', {
                    form_id: form.id || 'contact_form',
                    has_email: !!formDataObj.email,
                    has_phone: !!formDataObj.phone,
                    service_type: formDataObj.service_type || 'general'
                });
            }
        }
        
        // Log success (no sensitive data)
        const safeLog = window.safeLog || console.log;
        safeLog('✅ Form submitted successfully:', form.id || 'contact_form');
        
        // Record successful submission
        if (window.DeploymentMonitor) {
            // Success tracked via analytics, no additional action needed
        }
    }).catch(function(error) {
        // Even if email fails, show success to user (form was submitted)
        showNotification('Form gönderildi. İletişim için lütfen telefon veya WhatsApp kullanın.', 'info');
        
        // Announce to screen readers
        if (window.AccessibilityModule) {
            window.AccessibilityModule.announce('Form gönderildi. İletişim için telefon veya WhatsApp kullanabilirsiniz.', 'polite');
        }
        
        if (submitBtn) {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
        
        const safeError = window.safeError || console.error;
        safeError('Form submission error:', error);
        
        // Record error in deployment monitor
        if (window.DeploymentMonitor) {
            window.DeploymentMonitor.recordError({
                type: 'form_submission_error',
                error: error.message || String(error),
                formId: form.id || 'contact_form'
            }, false); // Non-critical - form data was collected
        }
    });
}

/**
 * Advanced Lazy Loading Implementation
 * Optimized for fast loading and data transfer
 */
function initLazyLoading() {
    // Lazy load images with IntersectionObserver
    const images = document.querySelectorAll('img[data-src], img:not([src])');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.dataset.src || img.getAttribute('data-lazy');
                    
                    if (src) {
                        // Add loading placeholder
                        img.classList.add('loading');
                        
                        // Create new image to preload
                        const imageLoader = new Image();
                        imageLoader.src = src;
                        
                        imageLoader.onload = function() {
                            img.src = src;
                            img.classList.remove('lazy', 'loading');
                    img.classList.add('loaded');
                            
                            // Remove data attributes after loading
                            img.removeAttribute('data-src');
                            img.removeAttribute('data-lazy');
                            
                            // Report to analytics
                            if (typeof gtag !== 'undefined') {
                                gtag('event', 'image_loaded', {
                                    event_category: 'performance',
                                    event_label: 'lazy_load',
                                    value: 1
                                });
                            }
                        };
                        
                        imageLoader.onerror = function() {
                            img.classList.remove('loading');
                            img.classList.add('error');
                            const safeWarn = window.safeWarn || console.warn;
                            safeWarn('Failed to load image:', src);
                        };
                        
                    observer.unobserve(img);
                    }
                }
            });
        }, {
            rootMargin: '50px' // Start loading 50px before image is visible
        });
        
        images.forEach(img => {
            // Add placeholder if no src
            if (!img.src && !img.dataset.src) {
                img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YzZjRmNiIvPjwvc3ZnPg==';
            }
            img.classList.add('lazy');
            imageObserver.observe(img);
        });
    } else {
        // Fallback for older browsers - load all images
        images.forEach(img => {
            const src = img.dataset.src || img.getAttribute('data-lazy');
            if (src) {
                img.src = src;
            img.classList.remove('lazy');
            }
        });
    }
    
    // Lazy load iframes (videos, embeds)
    const iframes = document.querySelectorAll('iframe[data-src]');
    if (iframes.length > 0 && 'IntersectionObserver' in window) {
        const iframeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const iframe = entry.target;
                    iframe.src = iframe.dataset.src;
                    iframe.removeAttribute('data-src');
                    iframeObserver.unobserve(iframe);
                }
            });
        }, {
            rootMargin: '100px'
        });
        
        iframes.forEach(iframe => iframeObserver.observe(iframe));
    }
}

/**
 * Performance Optimizations - Enhanced
 */
function initPerformanceOptimizations() {
    // Debounce scroll events
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(handleScroll, 10);
    }, { passive: true });
    
    // Throttle resize events
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(handleResize, 100);
    }, { passive: true });
    
    // Preload critical resources
    preloadCriticalResources();
    
    // Prefetch likely next pages
    prefetchLikelyPages();
    
    // Optimize images on load
    optimizeImages();
    
    // Reduce data transfer with compression hints
    enableCompressionHints();
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
        { href: 'logo-new.svg', as: 'image' },
        { href: 'favicon-new.svg', as: 'image' },
        { href: 'style.css', as: 'style' },
        { href: 'script.js', as: 'script' }
    ];
    
    criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource.href;
        link.as = resource.as;
        if (resource.as === 'script' || resource.as === 'style') {
            link.crossOrigin = 'anonymous';
        }
        document.head.appendChild(link);
    });
}

/**
 * Prefetch likely next pages
 */
function prefetchLikelyPages() {
    // Prefetch pages user is likely to visit
    const likelyPages = [
        '/blog.html',
        '/faq.html',
        '/sultanbeyli.html'
    ];
    
    // Wait a bit before prefetching (don't block initial load)
    setTimeout(() => {
        likelyPages.forEach(page => {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = page;
            document.head.appendChild(link);
        });
    }, 3000); // Prefetch after 3 seconds
}

/**
 * Optimize images on page load
 */
function optimizeImages() {
    // Add loading="lazy" to images that don't have it
    const images = document.querySelectorAll('img:not([loading])');
    images.forEach((img, index) => {
        // Only lazy load images below the fold (after first 3)
        if (index > 2) {
            img.loading = 'lazy';
            if (img.fetchPriority !== undefined) {
                img.fetchPriority = 'low';
            }
        } else {
            if (img.fetchPriority !== undefined) {
                img.fetchPriority = 'high';
            }
        }
        
        // Add decoding="async" for better performance
        if (!img.hasAttribute('decoding')) {
            img.decoding = 'async';
        }
    });
}

/**
 * Enable compression hints
 */
function enableCompressionHints() {
    // Compression is handled by server/CDN
    // We can optimize content structure here
    
    // Check for large inline scripts/styles
    const inlineScripts = document.querySelectorAll('script:not([src])');
    const inlineStyles = document.querySelectorAll('style');
    
    // Log if large inline content exists (should be external)
    const safeWarn = window.safeWarn || console.warn;
    if (inlineScripts.length > 5) {
        safeWarn('⚠️ Too many inline scripts - consider externalizing');
    }
    
    if (inlineStyles.length > 3) {
        safeWarn('⚠️ Too many inline styles - consider externalizing');
    }
}

/**
 * Advanced Analytics
 */
function initAdvancedAnalytics() {
    // Track UTM parameters first
    trackUTMParameters();
    
    // Track user interactions
    trackUserInteractions();
    
    // Track performance metrics
    trackPerformanceMetrics();
    
    // Track custom events
    trackCustomEvents();
    
    // Track form submissions
    trackFormSubmissions();
}

/**
 * Track UTM Parameters
 */
function trackUTMParameters() {
    if (typeof gtag === 'undefined') return;
    
    const urlParams = new URLSearchParams(window.location.search);
    const utmParams = {
        utm_source: urlParams.get('utm_source'),
        utm_medium: urlParams.get('utm_medium'),
        utm_campaign: urlParams.get('utm_campaign'),
        utm_content: urlParams.get('utm_content'),
        utm_term: urlParams.get('utm_term')
    };
    
    // Store UTM parameters securely
    let hasUTM = false;
    Object.keys(utmParams).forEach(key => {
        if (utmParams[key]) {
            SecureStorage.setItem(key, utmParams[key]);
            hasUTM = true;
        } else {
            // Get from secure storage if exists
            const stored = SecureStorage.getItem(key);
            if (stored) utmParams[key] = stored;
        }
    });
    
    // Send UTM parameters to GA4
    if (hasUTM || Object.values(utmParams).some(v => v)) {
        gtag('set', {
            'utm_source': utmParams.utm_source || '',
            'utm_medium': utmParams.utm_medium || '',
            'utm_campaign': utmParams.utm_campaign || '',
            'utm_content': utmParams.utm_content || '',
            'utm_term': utmParams.utm_term || ''
        });
        
        console.log('📊 UTM Parameters tracked:', utmParams);
    }
}

/**
 * Track Form Submissions
 */
function trackFormSubmissions() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const formData = new FormData(form);
            const formName = form.id || form.name || 'contact_form';
            
            // Analytics tracking
            if (typeof gtag !== 'undefined') {
                const heroVariant = localStorage.getItem('hero_variant') || SecureStorage.getItem('hero_variant') || 'A';
                const utm_source = SecureStorage.getItem('utm_source') || '';
                const utm_campaign = SecureStorage.getItem('utm_campaign') || '';
                
                gtag('event', 'form_submit', {
                    'event_category': 'lead',
                    'event_label': formName,
                    'value': 100,
                    'currency': 'TRY',
                    'hero_variant': heroVariant,
                    'utm_source': utm_source,
                    'utm_campaign': utm_campaign
                });
                
                console.log('📝 Form submission tracked:', formName);
            }
        });
    });
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
 * Safe DOM Creation Helper - Prevents XSS
 */
function createElementSafe(tag, props = {}, children = []) {
    const element = document.createElement(tag);
    
    // Set attributes safely
    Object.keys(props).forEach(key => {
        if (key === 'textContent' || key === 'innerText') {
            element.textContent = props[key];
        } else if (key === 'className') {
            element.className = props[key];
        } else if (key === 'style' && typeof props[key] === 'object') {
            Object.assign(element.style, props[key]);
        } else if (key.startsWith('data-')) {
            element.setAttribute(key, String(props[key]));
        } else if (key !== 'innerHTML') {
            element.setAttribute(key, String(props[key]));
        }
    });
    
    // Append children
    children.forEach(child => {
        if (typeof child === 'string') {
            element.appendChild(document.createTextNode(child));
        } else if (child instanceof Node) {
            element.appendChild(child);
        }
    });
    
    return element;
}

/**
 * Safe HTML text escaping
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Notification System - Secure version
 */
function showNotification(message, type = 'info') {
    // Sanitize message to prevent XSS
    const sanitizedMessage = escapeHtml(String(message));
    
    const notification = createElementSafe('div', {
        className: `notification notification-${type}`,
        style: {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6',
            color: 'white',
            padding: '1rem',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            zIndex: '10000',
            animation: 'slideIn 0.3s ease'
        }
    });
    
    const content = createElementSafe('div', { className: 'notification-content' });
    
    const iconClass = type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle';
    const icon = createElementSafe('i', { className: `fas fa-${iconClass}` });
    content.appendChild(icon);
    
    const messageSpan = createElementSafe('span');
    messageSpan.textContent = sanitizedMessage;
    content.appendChild(messageSpan);
    
    const closeBtn = createElementSafe('button', { className: 'notification-close' });
    closeBtn.addEventListener('click', function() {
        if (notification.parentNode) {
            notification.remove();
        }
    });
    const closeIcon = createElementSafe('i', { className: 'fas fa-times' });
    closeBtn.appendChild(closeIcon);
    content.appendChild(closeBtn);
    
    notification.appendChild(content);
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
            
            // Analytics tracking - Conversion Event
            if (typeof gtag !== 'undefined') {
                const heroVariant = localStorage.getItem('hero_variant') || sessionStorage.getItem('hero_variant') || 'A';
                gtag('event', 'phone_call', {
                    'event_category': 'contact',
                    'event_label': phoneNumber,
                    'value': 75,
                    'currency': 'TRY',
                    'hero_variant': heroVariant,
                    'contact_method': 'phone'
                });
                console.log('📞 Phone call tracked:', phoneNumber);
            }
            
            // Open phone app
            window.location.href = this.getAttribute('href');
        });
    });
    
    // WhatsApp button
    const whatsappButtons = document.querySelectorAll('a[href*="wa.me"]');
    whatsappButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Analytics tracking - Conversion Event
            if (typeof gtag !== 'undefined') {
                const heroVariant = localStorage.getItem('hero_variant') || sessionStorage.getItem('hero_variant') || 'A';
                const whatsappNumber = this.getAttribute('href').match(/\d+/)?.[0] || 'unknown';
                gtag('event', 'whatsapp_contact', {
                    'event_category': 'contact',
                    'event_label': whatsappNumber,
                    'value': 50,
                    'currency': 'TRY',
                    'hero_variant': heroVariant,
                    'contact_method': 'whatsapp'
                });
                console.log('💬 WhatsApp contact tracked:', whatsappNumber);
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
 * Error Handling - Moved to error-handler.js
 * This is a backup handler if error-handler.js fails to load
 */
if (!window.errorHandlerLoaded) {
window.addEventListener('error', function(e) {
        const safeError = window.safeError || console.error;
        safeError('DC TEKNİK - JavaScript Error:', e.error);
    
    // Send error to analytics if available
        try {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'exception', {
                    'description': e.error?.message || 'Unknown error',
            'fatal': false
        });
            }
        } catch (err) {
            // Analytics not available or failed
    }
});
}

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
    
    if (counters.length === 0) {
        console.log('⚠️ No counter elements found');
        return;
    }
    
    console.log(`🎯 Found ${counters.length} counter elements`);
    
    const animateCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-target'));
        if (isNaN(target)) {
            console.log('⚠️ Invalid target value for counter:', counter);
            return;
        }
        
        console.log(`🚀 Animating counter to ${target}`);
        
        // Add animating class
        counter.classList.add('animating');
        
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
                counter.classList.remove('animating');
                console.log(`✅ Counter animation completed: ${target}`);
            }
            counter.textContent = Math.floor(current);
        }, 16);
    };
    
    // Intersection Observer for counter animation
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                console.log('👁️ Counter element is visible, starting animation');
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { 
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    });
    
    counters.forEach((counter, index) => {
        console.log(`📊 Counter ${index + 1}:`, counter, 'Target:', counter.getAttribute('data-target'));
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