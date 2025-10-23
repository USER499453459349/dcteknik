// Performance Monitoring for DC TEKNİK
(function() {
    'use strict';
    
    // Performance metrics collection
    const performanceMetrics = {
        pageLoad: 0,
        firstContentfulPaint: 0,
        largestContentfulPaint: 0,
        cumulativeLayoutShift: 0,
        firstInputDelay: 0
    };
    
    // Collect Core Web Vitals
    function collectWebVitals() {
        // Largest Contentful Paint
        if ('PerformanceObserver' in window) {
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                performanceMetrics.largestContentfulPaint = lastEntry.startTime;
                console.log('📊 LCP:', lastEntry.startTime + 'ms');
            });
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
            
            // First Input Delay
            const fidObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach((entry) => {
                    performanceMetrics.firstInputDelay = entry.processingStart - entry.startTime;
                    console.log('📊 FID:', performanceMetrics.firstInputDelay + 'ms');
                });
            });
            fidObserver.observe({ entryTypes: ['first-input'] });
            
            // Cumulative Layout Shift
            const clsObserver = new PerformanceObserver((list) => {
                let clsValue = 0;
                const entries = list.getEntries();
                entries.forEach((entry) => {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                });
                performanceMetrics.cumulativeLayoutShift = clsValue;
                console.log('📊 CLS:', clsValue);
            });
            clsObserver.observe({ entryTypes: ['layout-shift'] });
        }
        
        // First Contentful Paint
        if ('PerformanceObserver' in window) {
            const fcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach((entry) => {
                    if (entry.name === 'first-contentful-paint') {
                        performanceMetrics.firstContentfulPaint = entry.startTime;
                        console.log('📊 FCP:', entry.startTime + 'ms');
                    }
                });
            });
            fcpObserver.observe({ entryTypes: ['paint'] });
        }
    }
    
    // Collect page load time
    function collectPageLoadTime() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                performanceMetrics.pageLoad = perfData.loadEventEnd - perfData.loadEventStart;
                console.log('📊 Page Load Time:', performanceMetrics.pageLoad + 'ms');
                
                // Send metrics to GA4 if available
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'performance_metrics', {
                        event_category: 'performance',
                        event_label: 'page_load',
                        value: Math.round(performanceMetrics.pageLoad),
                        custom_map: {
                            lcp: Math.round(performanceMetrics.largestContentfulPaint),
                            fid: Math.round(performanceMetrics.firstInputDelay),
                            cls: Math.round(performanceMetrics.cumulativeLayoutShift * 1000)
                        }
                    });
                }
            }, 0);
        });
    }
    
    // Resource timing analysis
    function analyzeResourceTiming() {
        if ('PerformanceObserver' in window) {
            const resourceObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach((entry) => {
                    if (entry.duration > 1000) { // Resources taking more than 1 second
                        console.warn('🐌 Slow resource:', entry.name, entry.duration + 'ms');
                    }
                });
            });
            resourceObserver.observe({ entryTypes: ['resource'] });
        }
    }
    
    // Memory usage monitoring
    function monitorMemoryUsage() {
        if ('memory' in performance) {
            setInterval(() => {
                const memory = performance.memory;
                const usedMB = Math.round(memory.usedJSHeapSize / 1048576);
                const totalMB = Math.round(memory.totalJSHeapSize / 1048576);
                
                if (usedMB > 50) { // More than 50MB
                    console.warn('🧠 High memory usage:', usedMB + 'MB / ' + totalMB + 'MB');
                }
            }, 30000); // Check every 30 seconds
        }
    }
    
    // Initialize performance monitoring
    function initPerformanceMonitoring() {
        console.log('🚀 Performance monitoring initialized');
        collectWebVitals();
        collectPageLoadTime();
        analyzeResourceTiming();
        monitorMemoryUsage();
    }
    
    // Start monitoring when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPerformanceMonitoring);
    } else {
        initPerformanceMonitoring();
    }
    
    // Expose metrics for debugging
    window.performanceMetrics = performanceMetrics;
})();

