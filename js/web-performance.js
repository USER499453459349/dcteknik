/**
 * DC TEKNİK - Web Performance Optimizer
 * Comprehensive web performance optimizations
 * Core Web Vitals, Resource Prioritization, Critical Rendering Path
 */

(function() {
    'use strict';
    
    const WebPerformance = {
        // Performance metrics
        metrics: {
            lcp: 0,
            fid: 0,
            cls: 0,
            fcp: 0,
            ttfb: 0,
            domContentLoaded: 0,
            loadComplete: 0
        },
        
        // Initialize
        init() {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.init());
                return;
            }
            
            console.log('⚡ Web Performance Optimizer initializing...');
            
            this.optimizeCriticalRenderingPath();
            this.setupWebVitalsTracking();
            this.optimizeResourceLoading();
            this.implementCodeSplitting();
            this.optimizeThirdPartyScripts();
            this.setupPerformanceBudget();
            this.implementConnectionAwareLoading();
            this.optimizeMemoryUsage();
            
            console.log('✅ Web Performance Optimizer initialized!');
        },
        
        /**
         * Optimize Critical Rendering Path
         */
        optimizeCriticalRenderingPath() {
            // Inline critical CSS (already done in HTML, but verify)
            this.ensureCriticalCSSInline();
            
            // Defer non-critical CSS
            this.deferNonCriticalCSS();
            
            // Optimize JavaScript loading
            this.optimizeJSLoading();
            
            // Remove render-blocking resources
            this.removeRenderBlocking();
        },
        
        ensureCriticalCSSInline() {
            // Critical CSS should already be inline in <head>
            // Add any missing critical styles
            const criticalStyles = document.querySelector('style[data-critical]');
            if (!criticalStyles) {
                const style = document.createElement('style');
                style.setAttribute('data-critical', 'true');
                style.textContent = `
                    /* Critical above-the-fold styles */
                    body{margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif}
                    .header{position:fixed;top:0;left:0;right:0;z-index:1000;background:rgba(26,26,26,0.98);backdrop-filter:blur(20px)}
                    .hero{min-height:100vh;display:flex;align-items:center;justify-content:center}
                `;
                document.head.insertBefore(style, document.head.firstChild);
            }
        },
        
        deferNonCriticalCSS() {
            // CSS files already have preload + async pattern
            // Verify and enhance
            document.querySelectorAll('link[rel="preload"][as="style"]').forEach(link => {
                if (!link.onload) {
                    link.onload = function() {
                        this.onload = null;
                        this.rel = 'stylesheet';
                    };
                }
            });
        },
        
        optimizeJSLoading() {
            // Ensure all non-critical JS uses defer
            document.querySelectorAll('script[src]:not([defer]):not([async])').forEach(script => {
                // Skip critical scripts
                if (script.src.includes('critical') || 
                    script.src.includes('gtag') ||
                    script.hasAttribute('data-critical')) {
                    return;
                }
                
                // Add defer to non-critical scripts
                script.defer = true;
            });
        },
        
        removeRenderBlocking() {
            // Remove render-blocking elements below the fold
            const elements = document.querySelectorAll('[data-below-fold="true"]');
            elements.forEach(el => {
                if (el.tagName === 'SCRIPT' && !el.hasAttribute('async') && !el.hasAttribute('defer')) {
                    el.defer = true;
                } else if (el.tagName === 'LINK' && el.rel === 'stylesheet' && !el.hasAttribute('media')) {
                    el.media = 'print';
                    el.onload = function() {
                        this.media = 'all';
                    };
                }
            });
        },
        
        /**
         * Web Vitals Tracking
         */
        setupWebVitalsTracking() {
            if (!('PerformanceObserver' in window)) return;
            
            // Largest Contentful Paint (LCP)
            this.trackLCP();
            
            // First Input Delay (FID)
            this.trackFID();
            
            // Cumulative Layout Shift (CLS)
            this.trackCLS();
            
            // First Contentful Paint (FCP)
            this.trackFCP();
            
            // Time to First Byte (TTFB)
            this.trackTTFB();
            
            // DOM Content Loaded
            this.trackDOMContentLoaded();
            
            // Load Complete
            this.trackLoadComplete();
            
            // Send metrics to analytics
            this.sendMetricsToAnalytics();
        },
        
        trackLCP() {
            try {
                const observer = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    this.metrics.lcp = lastEntry.renderTime || lastEntry.loadTime;
                    
                    // Track in analytics
                    this.sendMetric('LCP', this.metrics.lcp);
                });
                observer.observe({ entryTypes: ['largest-contentful-paint'] });
            } catch (e) {
                console.log('LCP tracking not supported');
            }
        },
        
        trackFID() {
            try {
                const observer = new PerformanceObserver((list) => {
                    list.getEntries().forEach(entry => {
                        this.metrics.fid = entry.processingStart - entry.startTime;
                        this.sendMetric('FID', this.metrics.fid);
                    });
                });
                observer.observe({ entryTypes: ['first-input'] });
            } catch (e) {
                console.log('FID tracking not supported');
            }
        },
        
        trackCLS() {
            try {
                let clsValue = 0;
                const observer = new PerformanceObserver((list) => {
                    list.getEntries().forEach(entry => {
                        if (!entry.hadRecentInput) {
                            clsValue += entry.value;
                            this.metrics.cls = clsValue;
                        }
                    });
                });
                observer.observe({ entryTypes: ['layout-shift'] });
                
                // Send final CLS value on page unload
                window.addEventListener('pagehide', () => {
                    this.sendMetric('CLS', clsValue);
                });
            } catch (e) {
                console.log('CLS tracking not supported');
            }
        },
        
        trackFCP() {
            try {
                const observer = new PerformanceObserver((list) => {
                    list.getEntries().forEach(entry => {
                        if (entry.name === 'first-contentful-paint') {
                            this.metrics.fcp = entry.startTime;
                            this.sendMetric('FCP', this.metrics.fcp);
                            observer.disconnect();
                        }
                    });
                });
                observer.observe({ entryTypes: ['paint'] });
            } catch (e) {
                console.log('FCP tracking not supported');
            }
        },
        
        trackTTFB() {
            if (window.performance && window.performance.timing) {
                const timing = window.performance.timing;
                const ttfb = timing.responseStart - timing.requestStart;
                this.metrics.ttfb = ttfb;
                this.sendMetric('TTFB', ttfb);
            }
        },
        
        trackDOMContentLoaded() {
            if (window.performance && window.performance.timing) {
                const timing = window.performance.timing;
                const dcl = timing.domContentLoadedEventEnd - timing.navigationStart;
                this.metrics.domContentLoaded = dcl;
                this.sendMetric('DOMContentLoaded', dcl);
            }
        },
        
        trackLoadComplete() {
            window.addEventListener('load', () => {
                if (window.performance && window.performance.timing) {
                    const timing = window.performance.timing;
                    const loadTime = timing.loadEventEnd - timing.navigationStart;
                    this.metrics.loadComplete = loadTime;
                    this.sendMetric('LoadComplete', loadTime);
                }
            }, { once: true });
        },
        
        sendMetric(name, value) {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'web_vital', {
                    event_category: 'Web Vitals',
                    event_label: name,
                    value: Math.round(value),
                    non_interaction: true
                });
            }
            
            // Console log for debugging
            console.log(`📊 ${name}: ${Math.round(value)}ms`);
        },
        
        sendMetricsToAnalytics() {
            // Send all metrics after page load
            window.addEventListener('load', () => {
                setTimeout(() => {
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'page_performance', {
                            event_category: 'Performance',
                            lcp: Math.round(this.metrics.lcp),
                            fid: Math.round(this.metrics.fid),
                            cls: Math.round(this.metrics.cls * 1000) / 1000,
                            fcp: Math.round(this.metrics.fcp),
                            ttfb: Math.round(this.metrics.ttfb),
                            domContentLoaded: Math.round(this.metrics.domContentLoaded),
                            loadComplete: Math.round(this.metrics.loadComplete)
                        });
                    }
                }, 2000);
            }, { once: true });
        },
        
        /**
         * Resource Loading Optimization
         */
        optimizeResourceLoading() {
            // Image optimization
            this.optimizeImages();
            
            // Font optimization
            this.optimizeFonts();
            
            // Preconnect to critical domains
            this.addCriticalPreconnects();
            
            // Prefetch likely next pages
            this.prefetchLikelyPages();
            
            // Preload critical resources
            this.preloadCriticalResources();
        },
        
        optimizeImages() {
            // Use Intersection Observer for lazy loading
            if ('IntersectionObserver' in window) {
                const imageObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            
                            // Load image
                            if (img.dataset.src) {
                                img.src = img.dataset.src;
                                img.removeAttribute('data-src');
                            }
                            
                            // Add width/height to prevent CLS
                            if (img.complete && img.naturalWidth && img.naturalHeight) {
                                if (!img.hasAttribute('width')) img.width = img.naturalWidth;
                                if (!img.hasAttribute('height')) img.height = img.naturalHeight;
                            }
                            
                            img.classList.add('img-loaded');
                            imageObserver.unobserve(img);
                        }
                    });
                }, {
                    rootMargin: '50px'
                });
                
                document.querySelectorAll('img[data-src]').forEach(img => {
                    imageObserver.observe(img);
                });
            }
        },
        
        optimizeFonts() {
            // Font display strategy
            const style = document.createElement('style');
            style.textContent = `
                @font-face {
                    font-family: 'Inter';
                    font-display: swap;
                }
            `;
            document.head.appendChild(style);
            
            // Preload critical fonts
            const fontLink = document.createElement('link');
            fontLink.rel = 'preload';
            fontLink.as = 'font';
            fontLink.type = 'font/woff2';
            fontLink.crossOrigin = 'anonymous';
            // Add font URL if exists
            document.head.appendChild(fontLink);
        },
        
        addCriticalPreconnects() {
            const criticalDomains = [
                'https://www.googletagmanager.com',
                'https://www.google-analytics.com',
                'https://maps.googleapis.com'
            ];
            
            criticalDomains.forEach(domain => {
                if (!document.querySelector(`link[rel="preconnect"][href="${domain}"]`)) {
                    const link = document.createElement('link');
                    link.rel = 'preconnect';
                    link.href = domain;
                    link.crossOrigin = 'anonymous';
                    document.head.appendChild(link);
                }
            });
        },
        
        prefetchLikelyPages() {
            // Prefetch pages likely to be visited next
            const likelyPages = [
                '/blog.html',
                '/faq.html',
                '/anadolu-yakasi.html'
            ];
            
            // Use requestIdleCallback to avoid blocking
            if ('requestIdleCallback' in window) {
                requestIdleCallback(() => {
                    likelyPages.forEach(url => {
                        const link = document.createElement('link');
                        link.rel = 'prefetch';
                        link.as = 'document';
                        link.href = url;
                        document.head.appendChild(link);
                    });
                });
            } else {
                // Fallback: Load after page load
                window.addEventListener('load', () => {
                    setTimeout(() => {
                        likelyPages.forEach(url => {
                            const link = document.createElement('link');
                            link.rel = 'prefetch';
                            link.as = 'document';
                            link.href = url;
                            document.head.appendChild(link);
                        });
                    }, 2000);
                }, { once: true });
            }
        },
        
        preloadCriticalResources() {
            // Preload critical CSS
            const criticalCSS = 'style.css';
            if (!document.querySelector(`link[rel="preload"][href="${criticalCSS}"]`)) {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.as = 'style';
                link.href = criticalCSS;
                link.onload = function() {
                    this.rel = 'stylesheet';
                };
                document.head.appendChild(link);
            }
        },
        
        /**
         * Code Splitting
         */
        implementCodeSplitting() {
            // Lazy load non-critical JS modules
            this.lazyLoadModules();
            
            // Split CSS by media queries
            this.splitCSS();
        },
        
        lazyLoadModules() {
            // Lazy load advanced features
            const lazyModules = [
                'js/advanced-mobile-features.js',
                'js/blog-enhancements.js'
            ];
            
            // Load after page is interactive
            if (document.readyState === 'complete') {
                this.loadLazyModules(lazyModules);
            } else {
                window.addEventListener('load', () => {
                    setTimeout(() => this.loadLazyModules(lazyModules), 1000);
                }, { once: true });
            }
        },
        
        loadLazyModules(modules) {
            modules.forEach(src => {
                const script = document.createElement('script');
                script.src = src;
                script.defer = true;
                script.async = true;
                document.body.appendChild(script);
            });
        },
        
        splitCSS() {
            // CSS already split, verify optimization
            document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
                if (!link.media || link.media === 'all') {
                    // Check if non-critical
                    if (link.href.includes('blog') || 
                        link.href.includes('enhancement') ||
                        link.href.includes('mobile-optimization')) {
                        link.media = 'print';
                        link.onload = function() {
                            this.media = 'all';
                        };
                    }
                }
            });
        },
        
        /**
         * Third-Party Scripts Optimization
         */
        optimizeThirdPartyScripts() {
            // Defer Google Analytics
            document.querySelectorAll('script[src*="googletagmanager"], script[src*="google-analytics"]').forEach(script => {
                if (!script.async && !script.defer) {
                    script.async = true;
                }
            });
            
            // Lazy load Font Awesome if not critical
            const fontAwesome = document.querySelector('link[href*="font-awesome"]');
            if (fontAwesome && !fontAwesome.hasAttribute('data-critical')) {
                fontAwesome.media = 'print';
                fontAwesome.onload = function() {
                    this.media = 'all';
                };
            }
        },
        
        /**
         * Performance Budget
         */
        setupPerformanceBudget() {
            const budget = {
                lcp: 2500, // 2.5s
                fid: 100,  // 100ms
                cls: 0.1,  // 0.1
                fcp: 1800, // 1.8s
                ttfb: 800  // 800ms
            };
            
            // Check budget violations
            window.addEventListener('load', () => {
                setTimeout(() => {
                    this.checkBudgetViolations(budget);
                }, 3000);
            }, { once: true });
        },
        
        checkBudgetViolations(budget) {
            const violations = [];
            
            if (this.metrics.lcp > budget.lcp) {
                violations.push(`LCP exceeded budget: ${Math.round(this.metrics.lcp)}ms > ${budget.lcp}ms`);
            }
            
            if (this.metrics.fid > budget.fid) {
                violations.push(`FID exceeded budget: ${Math.round(this.metrics.fid)}ms > ${budget.fid}ms`);
            }
            
            if (this.metrics.cls > budget.cls) {
                violations.push(`CLS exceeded budget: ${(this.metrics.cls * 1000) / 1000} > ${budget.cls}`);
            }
            
            if (violations.length > 0) {
                console.warn('⚠️ Performance Budget Violations:', violations);
                
                // Send to analytics
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'performance_budget_violation', {
                        event_category: 'Performance',
                        violations: violations.join('; ')
                    });
                }
            }
        },
        
        /**
         * Connection-Aware Loading
         */
        implementConnectionAwareLoading() {
            if (!('connection' in navigator)) return;
            
            const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            
            // Slow connection optimizations
            if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
                this.enableDataSavingMode();
            }
            
            // Save Data preference
            if (connection.saveData) {
                this.enableDataSavingMode();
            }
            
            // Network change listener
            connection.addEventListener('change', () => {
                if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g' || connection.saveData) {
                    this.enableDataSavingMode();
                } else {
                    this.disableDataSavingMode();
                }
            });
        },
        
        enableDataSavingMode() {
            document.documentElement.classList.add('data-saving-mode');
            
            // Disable non-critical images
            document.querySelectorAll('img[data-critical="false"]').forEach(img => {
                img.style.display = 'none';
            });
            
            // Reduce animation quality
            const style = document.createElement('style');
            style.id = 'data-saving-mode';
            style.textContent = `
                * {
                    animation-duration: 0.2s !important;
                    transition-duration: 0.1s !important;
                }
                img:not([data-critical="true"]) {
                    filter: blur(2px);
                }
            `;
            document.head.appendChild(style);
        },
        
        disableDataSavingMode() {
            document.documentElement.classList.remove('data-saving-mode');
            const style = document.getElementById('data-saving-mode');
            if (style) style.remove();
        },
        
        /**
         * Memory Usage Optimization
         */
        optimizeMemoryUsage() {
            // Clean up unused observers
            this.cleanupObservers();
            
            // Limit image cache
            this.limitImageCache();
            
            // Clean up event listeners on unload
            window.addEventListener('beforeunload', () => {
                // Remove event listeners
                document.removeEventListener('scroll', this.handleScroll);
            });
        },
        
        cleanupObservers() {
            // Observers are automatically cleaned up, but ensure proper cleanup
            if (this.observers) {
                this.observers.forEach(observer => {
                    if (observer && typeof observer.disconnect === 'function') {
                        observer.disconnect();
                    }
                });
            }
        },
        
        limitImageCache() {
            // Limit number of images loaded simultaneously
            const maxConcurrentImages = 5;
            let loadingCount = 0;
            
            const images = Array.from(document.querySelectorAll('img[data-src]'));
            const loadNext = () => {
                if (loadingCount >= maxConcurrentImages || images.length === 0) return;
                
                const img = images.shift();
                loadingCount++;
                
                img.addEventListener('load', () => {
                    loadingCount--;
                    loadNext();
                }, { once: true });
                
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                loadNext();
            };
            
            // Start loading
            for (let i = 0; i < maxConcurrentImages; i++) {
                loadNext();
            }
        }
    };
    
    // Initialize
    WebPerformance.init();
    
    // Export for debugging
    window.WebPerformance = WebPerformance;
    
})();



