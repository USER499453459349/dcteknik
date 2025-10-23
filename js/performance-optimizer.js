// Performance Optimizer - DC TEKNİK
(function() {
    'use strict';
    
    class PerformanceOptimizer {
        constructor() {
            this.metrics = {
                loadTime: 0,
                renderTime: 0,
                resourceCount: 0,
                resourceSize: 0,
                memoryUsage: 0
            };
            this.init();
        }
        
        init() {
            this.optimizeImages();
            this.optimizeFonts();
            this.optimizeScripts();
            this.optimizeStylesheets();
            this.setupResourceHints();
            this.monitorPerformance();
            this.setupPreloading();
            this.optimizeThirdPartyResources();
        }
        
        optimizeImages() {
            // Lazy load images
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
            }, {
                rootMargin: '50px'
            });
            
            images.forEach(img => imageObserver.observe(img));
            
            // Optimize existing images
            const existingImages = document.querySelectorAll('img:not([data-src])');
            existingImages.forEach(img => {
                this.optimizeImage(img);
            });
        }
        
        optimizeImage(img) {
            // Add loading attribute
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
            
            // Add decoding attribute
            if (!img.hasAttribute('decoding')) {
                img.setAttribute('decoding', 'async');
            }
            
            // Add fetchpriority for above-the-fold images
            if (this.isAboveTheFold(img)) {
                img.setAttribute('fetchpriority', 'high');
            }
        }
        
        isAboveTheFold(element) {
            const rect = element.getBoundingClientRect();
            return rect.top < window.innerHeight && rect.bottom > 0;
        }
        
        optimizeFonts() {
            // Preload critical fonts
            const criticalFonts = [
                'https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap'
            ];
            
            criticalFonts.forEach(fontUrl => {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.as = 'style';
                link.href = fontUrl;
                link.onload = function() {
                    this.rel = 'stylesheet';
                };
                document.head.appendChild(link);
            });
            
            // Optimize font loading
            if ('fonts' in document) {
                document.fonts.ready.then(() => {
                    document.documentElement.classList.add('fonts-loaded');
                });
            }
        }
        
        optimizeScripts() {
            // Defer non-critical scripts
            const scripts = document.querySelectorAll('script:not([defer]):not([async])');
            scripts.forEach(script => {
                if (!this.isCriticalScript(script)) {
                    script.defer = true;
                }
            });
            
            // Optimize script loading
            const scriptObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const script = entry.target;
                        if (script.dataset.src) {
                            script.src = script.dataset.src;
                            script.removeAttribute('data-src');
                            scriptObserver.unobserve(script);
                        }
                    }
                });
            });
            
            const lazyScripts = document.querySelectorAll('script[data-src]');
            lazyScripts.forEach(script => scriptObserver.observe(script));
        }
        
        isCriticalScript(script) {
            const criticalScripts = [
                'script.js',
                'performance-monitor.js',
                'security-monitor.js'
            ];
            
            return criticalScripts.some(critical => script.src.includes(critical));
        }
        
        optimizeStylesheets() {
            // Optimize CSS loading
            const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
            stylesheets.forEach(link => {
                if (!this.isCriticalStylesheet(link)) {
                    link.media = 'print';
                    link.onload = function() {
                        this.media = 'all';
                    };
                }
            });
            
            // Inline critical CSS
            this.inlineCriticalCSS();
        }
        
        isCriticalStylesheet(link) {
            const criticalStylesheets = [
                'style.css',
                'mobile-ux-enhancements.css',
                'ux-enhancements.css'
            ];
            
            return criticalStylesheets.some(critical => link.href.includes(critical));
        }
        
        inlineCriticalCSS() {
            // Inline critical CSS for above-the-fold content
            const criticalCSS = `
                .header { display: block; }
                .hero-section { display: block; }
                .nav-menu { display: flex; }
                .btn { display: inline-block; }
            `;
            
            const style = document.createElement('style');
            style.textContent = criticalCSS;
            document.head.appendChild(style);
        }
        
        setupResourceHints() {
            // Add DNS prefetch for external domains
            const externalDomains = [
                'fonts.googleapis.com',
                'fonts.gstatic.com',
                'cdnjs.cloudflare.com',
                'cdn.jsdelivr.net',
                'unpkg.com'
            ];
            
            externalDomains.forEach(domain => {
                const link = document.createElement('link');
                link.rel = 'dns-prefetch';
                link.href = `https://${domain}`;
                document.head.appendChild(link);
            });
            
            // Add preconnect for critical resources
            const criticalDomains = [
                'fonts.googleapis.com',
                'fonts.gstatic.com'
            ];
            
            criticalDomains.forEach(domain => {
                const link = document.createElement('link');
                link.rel = 'preconnect';
                link.href = `https://${domain}`;
                link.crossOrigin = 'anonymous';
                document.head.appendChild(link);
            });
        }
        
        setupPreloading() {
            // Preload critical resources
            const criticalResources = [
                { href: 'logo-new.svg', as: 'image' },
                { href: 'style.css', as: 'style' },
                { href: 'script.js', as: 'script' }
            ];
            
            criticalResources.forEach(resource => {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.href = resource.href;
                link.as = resource.as;
                if (resource.as === 'script') {
                    link.crossOrigin = 'anonymous';
                }
                document.head.appendChild(link);
            });
        }
        
        optimizeThirdPartyResources() {
            // Optimize Google Analytics
            if (typeof gtag !== 'undefined') {
                // Use gtag with optimized configuration
                gtag('config', 'G-N1Z05DJ9B4', {
                    send_page_view: false,
                    transport_type: 'beacon'
                });
            }
            
            // Optimize third-party scripts
            const thirdPartyScripts = document.querySelectorAll('script[src*="google"], script[src*="facebook"], script[src*="twitter"]');
            thirdPartyScripts.forEach(script => {
                script.async = true;
                script.defer = true;
            });
        }
        
        monitorPerformance() {
            // Monitor Core Web Vitals
            this.monitorLCP();
            this.monitorFID();
            this.monitorCLS();
            this.monitorFCP();
            this.monitorTTI();
            
            // Monitor resource performance
            this.monitorResourceTiming();
            this.monitorMemoryUsage();
            this.monitorNetworkPerformance();
        }
        
        monitorLCP() {
            new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                const lastEntry = entries[entries.length - 1];
                
                this.metrics.lcp = lastEntry.startTime;
                
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'web_vitals', {
                        event_category: 'Performance',
                        event_label: 'LCP',
                        value: Math.round(lastEntry.startTime)
                    });
                }
            }).observe({ entryTypes: ['largest-contentful-paint'] });
        }
        
        monitorFID() {
            new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                entries.forEach(entry => {
                    this.metrics.fid = entry.processingStart - entry.startTime;
                    
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'web_vitals', {
                            event_category: 'Performance',
                            event_label: 'FID',
                            value: Math.round(this.metrics.fid)
                        });
                    }
                });
            }).observe({ entryTypes: ['first-input'] });
        }
        
        monitorCLS() {
            let clsValue = 0;
            new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                entries.forEach(entry => {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                });
                
                this.metrics.cls = clsValue;
                
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'web_vitals', {
                        event_category: 'Performance',
                        event_label: 'CLS',
                        value: Math.round(clsValue * 1000)
                    });
                }
            }).observe({ entryTypes: ['layout-shift'] });
        }
        
        monitorFCP() {
            new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                entries.forEach(entry => {
                    this.metrics.fcp = entry.startTime;
                    
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'web_vitals', {
                            event_category: 'Performance',
                            event_label: 'FCP',
                            value: Math.round(entry.startTime)
                        });
                    }
                });
            }).observe({ entryTypes: ['paint'] });
        }
        
        monitorTTI() {
            // Monitor Time to Interactive
            const tti = this.calculateTTI();
            this.metrics.tti = tti;
            
            if (typeof gtag !== 'undefined') {
                gtag('event', 'web_vitals', {
                    event_category: 'Performance',
                    event_label: 'TTI',
                    value: Math.round(tti)
                });
            }
        }
        
        calculateTTI() {
            const navigationStart = performance.timing.navigationStart;
            const domContentLoaded = performance.timing.domContentLoadedEventEnd;
            return domContentLoaded - navigationStart;
        }
        
        monitorResourceTiming() {
            const resources = performance.getEntriesByType('resource');
            this.metrics.resourceCount = resources.length;
            this.metrics.resourceSize = resources.reduce((total, resource) => {
                return total + (resource.transferSize || 0);
            }, 0);
            
            // Log slow resources
            resources.forEach(resource => {
                if (resource.duration > 1000) {
                    console.warn('Slow resource:', resource.name, resource.duration + 'ms');
                }
            });
        }
        
        monitorMemoryUsage() {
            if ('memory' in performance) {
                this.metrics.memoryUsage = performance.memory.usedJSHeapSize;
                
                // Log memory usage
                if (this.metrics.memoryUsage > 50 * 1024 * 1024) { // 50MB
                    console.warn('High memory usage:', this.metrics.memoryUsage / 1024 / 1024 + 'MB');
                }
            }
        }
        
        monitorNetworkPerformance() {
            if ('connection' in navigator) {
                const connection = navigator.connection;
                this.metrics.networkType = connection.effectiveType;
                this.metrics.downlink = connection.downlink;
                this.metrics.rtt = connection.rtt;
                
                // Optimize based on connection
                if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
                    this.enableLowBandwidthMode();
                }
            }
        }
        
        enableLowBandwidthMode() {
            // Disable non-critical features for slow connections
            const nonCriticalElements = document.querySelectorAll('.non-critical');
            nonCriticalElements.forEach(element => {
                element.style.display = 'none';
            });
            
            // Reduce image quality
            const images = document.querySelectorAll('img');
            images.forEach(img => {
                if (img.src.includes('unsplash.com')) {
                    img.src = img.src.replace('w=800', 'w=400');
                }
            });
        }
        
        // Public methods
        getMetrics() {
            return this.metrics;
        }
        
        getPerformanceScore() {
            const scores = {
                lcp: this.metrics.lcp < 2500 ? 100 : this.metrics.lcp < 4000 ? 75 : 50,
                fid: this.metrics.fid < 100 ? 100 : this.metrics.fid < 300 ? 75 : 50,
                cls: this.metrics.cls < 0.1 ? 100 : this.metrics.cls < 0.25 ? 75 : 50
            };
            
            return Math.round((scores.lcp + scores.fid + scores.cls) / 3);
        }
        
        optimizeForMobile() {
            // Mobile-specific optimizations
            if (window.innerWidth < 768) {
                // Reduce animations
                document.documentElement.style.setProperty('--animation-duration', '0.2s');
                
                // Optimize images for mobile
                const images = document.querySelectorAll('img');
                images.forEach(img => {
                    if (img.src.includes('unsplash.com')) {
                        img.src = img.src.replace('w=800', 'w=400');
                    }
                });
            }
        }
        
        optimizeForSlowConnection() {
            // Optimizations for slow connections
            this.enableLowBandwidthMode();
            
            // Defer non-critical scripts
            const scripts = document.querySelectorAll('script[data-defer]');
            scripts.forEach(script => {
                script.defer = true;
            });
        }
    }
    
    // Initialize performance optimizer
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.performanceOptimizer = new PerformanceOptimizer();
        });
    } else {
        window.performanceOptimizer = new PerformanceOptimizer();
    }
})();
