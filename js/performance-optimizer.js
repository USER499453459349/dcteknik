/**
 * DC TEKNİK - Performance Optimizer
 * Image optimization, resource hints, ve performance enhancements
 * Mevcut kodları bozmadan güvenli şekilde eklendi
 */

(function() {
    'use strict';
    
    // Namespace
    window.PerformanceOptimizer = window.PerformanceOptimizer || {};
    
    /**
     * Image Optimization
     */
    function optimizeImages() {
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            // Lazy loading için (native veya Intersection Observer)
            if (!img.hasAttribute('loading')) {
                // Above the fold images hariç lazy loading
                if (!isAboveFold(img)) {
                    img.loading = 'lazy';
                } else {
                    img.loading = 'eager';
                }
            }
            
            // Fetch priority (critical images için)
            if (isAboveFold(img) && !img.hasAttribute('fetchpriority')) {
                img.fetchPriority = 'high';
            }
            
            // Decoding (async for performance)
            if (!img.hasAttribute('decoding')) {
                img.decoding = 'async';
            }
            
            // Image error handling
            img.addEventListener('error', function() {
                // Placeholder veya fallback image
                if (!this.hasAttribute('data-fallback')) {
                    this.style.display = 'none';
                } else {
                    this.src = this.getAttribute('data-fallback');
                }
            });
            
            // Image load optimization
            img.addEventListener('load', function() {
                this.classList.add('img-loaded');
                // Remove loading placeholder if exists
                const placeholder = this.parentElement.querySelector('.img-placeholder');
                if (placeholder) {
                    placeholder.remove();
                }
            });
        });
        
        console.log('✅ Images optimized:', images.length);
    }
    
    /**
     * Check if image is above the fold
     */
    function isAboveFold(img) {
        const rect = img.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.bottom > 0;
    }
    
    /**
     * Preload Critical Resources
     */
    function preloadCriticalResources() {
        // Critical CSS (already in head, but verify)
        const criticalCSS = document.querySelector('link[rel="stylesheet"][href="style.css"]');
        if (criticalCSS && !document.querySelector('link[rel="preload"][href="style.css"]')) {
            const preload = document.createElement('link');
            preload.rel = 'preload';
            preload.as = 'style';
            preload.href = 'style.css';
            document.head.insertBefore(preload, criticalCSS);
        }
        
        // Critical JS - UX enhancements (early load)
        const uxJS = 'js/ux-enhancements.js';
        if (!document.querySelector(`link[rel="preload"][href="${uxJS}"]`)) {
            const preload = document.createElement('link');
            preload.rel = 'preload';
            preload.as = 'script';
            preload.href = uxJS;
            document.head.appendChild(preload);
        }
    }
    
    /**
     * Resource Hints - Dynamic
     */
    function addResourceHints() {
        // Google Maps (if used)
        if (!document.querySelector('link[rel="dns-prefetch"][href*="google.com/maps"]')) {
            const dnsPrefetch = document.createElement('link');
            dnsPrefetch.rel = 'dns-prefetch';
            dnsPrefetch.href = 'https://maps.googleapis.com';
            document.head.appendChild(dnsPrefetch);
        }
        
        // WhatsApp API (if used)
        if (!document.querySelector('link[rel="dns-prefetch"][href*="wa.me"]')) {
            const dnsPrefetch = document.createElement('link');
            dnsPrefetch.rel = 'dns-prefetch';
            dnsPrefetch.href = 'https://wa.me';
            document.head.appendChild(dnsPrefetch);
        }
        
        // EmailJS (if used)
        if (!document.querySelector('link[rel="preconnect"][href*="emailjs.com"]')) {
            const preconnect = document.createElement('link');
            preconnect.rel = 'preconnect';
            preconnect.href = 'https://api.emailjs.com';
            document.head.appendChild(preconnect);
        }
    }
    
    /**
     * Font Loading Optimization
     */
    function optimizeFontLoading() {
        // Font Display Strategy
        const style = document.createElement('style');
        style.textContent = `
            @font-face {
                font-family: 'Inter';
                font-display: swap;
            }
            @font-face {
                font-family: 'Font Awesome';
                font-display: swap;
            }
        `;
        document.head.appendChild(style);
    }
    
    /**
     * Intersection Observer for Lazy Loading
     */
    function initAdvancedLazyLoading() {
        if (typeof IntersectionObserver === 'undefined') {
            return;
        }
        
        // Image observer
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // Load image if data-src exists
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    
                    // Load srcset if data-srcset exists
                    if (img.dataset.srcset) {
                        img.srcset = img.dataset.srcset;
                        img.removeAttribute('data-srcset');
                    }
                    
                    // Add loaded class
                    img.classList.add('img-loaded');
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px' // Start loading 50px before image enters viewport
        });
        
        // Observe all images
        document.querySelectorAll('img[data-src], img[data-srcset]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    /**
     * Prefetch Next Page Resources
     */
    function prefetchNextPages() {
        // Prefetch likely next pages
        const likelyPages = [
            'blog.html',
            'faq.html',
            'anadolu-yakasi.html'
        ];
        
        likelyPages.forEach(url => {
            const prefetch = document.createElement('link');
            prefetch.rel = 'prefetch';
            prefetch.as = 'document';
            prefetch.href = url;
            document.head.appendChild(prefetch);
        });
    }
    
    /**
     * Network Information API - Adaptive Loading
     */
    function adaptiveLoading() {
        if ('connection' in navigator) {
            const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            
            // Slow connection - optimize more aggressively
            if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
                // Disable non-critical images
                document.querySelectorAll('img[data-critical="false"]').forEach(img => {
                    img.style.display = 'none';
                });
                
                // Remove non-critical animations
                document.documentElement.style.setProperty('--animation-duration', '0s');
            }
            
            // Save Data - respect user preference
            if (connection.saveData) {
                // Only load critical resources
                document.querySelectorAll('link[rel="prefetch"]').forEach(link => {
                    link.remove();
                });
            }
        }
    }
    
    /**
     * Image Format Detection & Optimization
     */
    function checkImageFormats() {
        // Check for WebP support
        const supportsWebP = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 1;
            canvas.height = 1;
            return canvas.toDataURL('image/webp').indexOf('webp') > -1;
        };
        
        if (supportsWebP()) {
            // Add WebP class for CSS targeting
            document.documentElement.classList.add('webp');
        }
        
        // Check for AVIF support (future)
        const supportsAVIF = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 1;
            canvas.height = 1;
            return canvas.toDataURL('image/avif').indexOf('avif') > -1;
        };
        
        if (supportsAVIF()) {
            document.documentElement.classList.add('avif');
        }
    }
    
    /**
     * Performance Metrics Tracking
     */
    function trackPerformanceMetrics() {
        if ('PerformanceObserver' in window) {
            // Largest Contentful Paint (LCP)
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'web_vitals', {
                        event_category: 'Performance',
                        event_label: 'LCP',
                        value: Math.round(lastEntry.renderTime || lastEntry.loadTime),
                        non_interaction: true
                    });
                }
            });
            
            try {
                lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
            } catch (e) {
                // Browser doesn't support LCP
            }
            
            // First Input Delay (FID)
            const fidObserver = new PerformanceObserver((list) => {
                list.getEntries().forEach(entry => {
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'web_vitals', {
                            event_category: 'Performance',
                            event_label: 'FID',
                            value: Math.round(entry.processingStart - entry.startTime),
                            non_interaction: true
                        });
                    }
                });
            });
            
            try {
                fidObserver.observe({ entryTypes: ['first-input'] });
            } catch (e) {
                // Browser doesn't support FID
            }
        }
    }
    
    /**
     * Initialize all optimizations
     */
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }
        
        console.log('⚡ Performance Optimizer initializing...');
        
        // Optimize images
        optimizeImages();
        
        // Preload critical resources
        preloadCriticalResources();
        
        // Add resource hints
        addResourceHints();
        
        // Optimize font loading
        optimizeFontLoading();
        
        // Advanced lazy loading
        initAdvancedLazyLoading();
        
        // Prefetch next pages
        prefetchNextPages();
        
        // Adaptive loading
        adaptiveLoading();
        
        // Check image formats
        checkImageFormats();
        
        // Track performance metrics
        trackPerformanceMetrics();
        
        console.log('✅ Performance Optimizer initialized!');
    }
    
    // Start immediately
    init();
    
})();
