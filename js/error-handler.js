/**
 * DC TEKNİK - Global Error Handler
 * Tüm hataları yakalar, loglar ve kullanıcıya güvenli mesajlar gösterir
 */

(function() {
    'use strict';

    // Production mode - console.log'ları devre dışı bırak
    const isProduction = window.location.hostname !== 'localhost' && 
                        window.location.hostname !== '127.0.0.1';
    
    // Error tracking
    let errorCount = 0;
    const MAX_ERRORS = 50;
    const errorLog = [];

    /**
     * Safe console.log - Production'da devre dışı
     */
    window.safeLog = function(...args) {
        if (!isProduction) {
            console.log(...args);
        }
    };

    /**
     * Safe console.warn - Production'da minimal
     */
    window.safeWarn = function(...args) {
        if (!isProduction) {
            console.warn(...args);
        } else {
            // Production'da sadece kritik uyarıları logla
            const message = args[0];
            if (message && (
                message.includes('Security') || 
                message.includes('XSS') || 
                message.includes('CSRF')
            )) {
                console.warn(...args);
            }
        }
    };

    /**
     * Safe console.error - Her zaman logla ama rate limit
     */
    window.safeError = function(...args) {
        errorCount++;
        if (errorCount <= MAX_ERRORS) {
            console.error(...args);
            
            // Log to storage for analysis
            try {
                errorLog.push({
                    timestamp: Date.now(),
                    message: args[0],
                    stack: args[1]?.stack || '',
                    url: window.location.href
                });
                
                // Keep only last 20 errors
                if (errorLog.length > 20) {
                    errorLog.shift();
                }
                
                // Store in sessionStorage
                try {
                    sessionStorage.setItem('error_log', JSON.stringify(errorLog.slice(-10)));
                } catch (e) {
                    // Storage full or unavailable
                }
            } catch (e) {
                // Ignore logging errors
            }
        } else if (errorCount === MAX_ERRORS + 1) {
            console.error('Too many errors logged. Error logging disabled.');
        }
    };

    /**
     * Global Error Handler
     */
    window.addEventListener('error', function(event) {
        event.preventDefault();
        
        const errorInfo = {
            message: event.message,
            source: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            stack: event.error?.stack,
            timestamp: Date.now(),
            userAgent: navigator.userAgent,
            url: window.location.href
        };

        safeError('JavaScript Error:', errorInfo);

        // Send to analytics if available
        if (typeof gtag !== 'undefined') {
            try {
                gtag('event', 'exception', {
                    description: event.message,
                    fatal: false
                });
            } catch (e) {
                // Analytics not available
            }
        }

        // Send to security logger if available
        if (window.SecurityLogger) {
            try {
                window.SecurityLogger.log('javascript_error', 'medium', {
                    message: event.message,
                    source: event.filename,
                    line: event.lineno
                });
            } catch (e) {
                // Security logger not available
            }
        }

        // Prevent default error handling
        return true;
    });

    /**
     * Unhandled Promise Rejection Handler
     */
    window.addEventListener('unhandledrejection', function(event) {
        event.preventDefault();

        const errorInfo = {
            reason: event.reason,
            timestamp: Date.now(),
            url: window.location.href
        };

        safeError('Unhandled Promise Rejection:', errorInfo);

        // Send to analytics
        if (typeof gtag !== 'undefined') {
            try {
                gtag('event', 'exception', {
                    description: 'Unhandled Promise Rejection',
                    fatal: false
                });
            } catch (e) {
                // Ignore
            }
        }

        return true;
    });

    /**
     * Safe function wrapper - prevents errors from breaking execution
     */
    window.safeExecute = function(fn, fallback, context) {
        try {
            if (typeof fn === 'function') {
                return fn.call(context || window);
            }
            return fn;
        } catch (error) {
            safeError('Error in safeExecute:', error);
            if (typeof fallback === 'function') {
                try {
                    return fallback.call(context || window, error);
                } catch (e) {
                    safeError('Error in fallback:', e);
                }
            }
            return fallback;
        }
    };

    /**
     * Safe DOM query - returns null if element not found
     */
    window.safeQuerySelector = function(selector) {
        try {
            if (!selector) return null;
            return document.querySelector(selector);
        } catch (error) {
            safeError('Query selector error:', error, selector);
            return null;
        }
    };

    /**
     * Safe DOM query all - returns empty array on error
     */
    window.safeQuerySelectorAll = function(selector) {
        try {
            if (!selector) return [];
            return Array.from(document.querySelectorAll(selector));
        } catch (error) {
            safeError('Query selector all error:', error, selector);
            return [];
        }
    };

    /**
     * Safe storage access
     */
    window.safeStorage = {
        getItem: function(key) {
            try {
                return localStorage.getItem(key) || sessionStorage.getItem(key);
            } catch (e) {
                return null;
            }
        },
        setItem: function(key, value) {
            try {
                localStorage.setItem(key, value);
                return true;
            } catch (e) {
                try {
                    sessionStorage.setItem(key, value);
                    return true;
                } catch (e2) {
                    return false;
                }
            }
        },
        removeItem: function(key) {
            try {
                localStorage.removeItem(key);
                sessionStorage.removeItem(key);
                return true;
            } catch (e) {
                return false;
            }
        }
    };

    /**
     * Get error log for debugging
     */
    window.getErrorLog = function() {
        return errorLog.slice();
    };

    /**
     * Clear error log
     */
    window.clearErrorLog = function() {
        errorLog.length = 0;
        errorCount = 0;
        try {
            sessionStorage.removeItem('error_log');
        } catch (e) {
            // Ignore
        }
    };

    // Mark as loaded
    window.errorHandlerLoaded = true;
    
    // Initialize
    safeLog('✅ Error Handler initialized');
})();

