/**
 * DC TEKNİK - Critical Resource Loader
 * Critical resources için optimized loading
 */

(function() {
    'use strict';
    
    // RequestIdleCallback polyfill
    const requestIdleCallback = window.requestIdleCallback || function(cb) {
        const start = Date.now();
        return setTimeout(function() {
            cb({
                didTimeout: false,
                timeRemaining: function() {
                    return Math.max(0, 50 - (Date.now() - start));
                }
            });
        }, 1);
    };
    
    // Load non-critical CSS in idle time - Skip if already loaded
    function loadNonCriticalCSS() {
        requestIdleCallback(function() {
            const nonCriticalCSS = [
                'ux-enhancements.css',
                'performance-styles.css'
            ];
            
            nonCriticalCSS.forEach(href => {
                // Check if already loaded
                if (document.querySelector(`link[href="${href}"]`)) {
                    return;
                }
                
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = href;
                link.media = 'print'; // Load as print first (non-blocking)
                link.onload = function() {
                    this.media = 'all'; // Switch to all media after load
                };
                document.head.appendChild(link);
            });
        });
    }
    
    // Prefetch resources on hover
    function prefetchOnHover() {
        document.querySelectorAll('a[href]').forEach(link => {
            let prefetched = false;
            
            link.addEventListener('mouseenter', function() {
                if (!prefetched && this.href) {
                    // Skip non-http(s) schemes (tel:, mailto:, javascript:, etc.)
                    const href = this.href;
                    if (href.startsWith('#') || 
                        href.startsWith('javascript:') || 
                        href.startsWith('tel:') || 
                        href.startsWith('mailto:') ||
                        href.startsWith('sms:') ||
                        !href.startsWith('http')) {
                        return;
                    }
                    
                    try {
                        const prefetch = document.createElement('link');
                        prefetch.rel = 'prefetch';
                        prefetch.href = href;
                        prefetch.as = 'document';
                        document.head.appendChild(prefetch);
                        prefetched = true;
                    } catch (err) {
                        // Silently fail for invalid URLs
                    }
                }
            }, { once: true, passive: true });
        });
    }
    
    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            loadNonCriticalCSS();
            prefetchOnHover();
        });
    } else {
        loadNonCriticalCSS();
        prefetchOnHover();
    }
    
    console.log('✅ Critical Loader initialized');
})();

