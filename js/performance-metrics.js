/**
 * Advanced Performance Metrics Collector
 * Gerçek zamanlı performans metrikleri toplama sistemi
 * 
 * Features:
 * - Core Web Vitals tracking (LCP, FID, CLS, INP)
 * - Page load performance
 * - User interactions tracking
 * - Resource timing analysis
 * - Network performance
 * - Memory usage monitoring
 * - Custom metrics
 */

class PerformanceMetricsCollector {
    constructor() {
        this.metrics = {
            webVitals: {},
            pageLoad: {},
            interactions: [],
            resources: [],
            network: {},
            memory: {},
            custom: {}
        };
        
        this.observers = [];
        this.sessionId = this.generateSessionId();
        this.pageId = this.generatePageId();
        this.startTime = Date.now();
        
        this.init();
    }
    
    /**
     * Initialize performance monitoring
     */
    init() {
        console.log('🚀 Performance Metrics Collector initialized');
        
        // Wait for page load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.startMonitoring());
        } else {
            this.startMonitoring();
        }
    }
    
    /**
     * Start monitoring all metrics
     */
    startMonitoring() {
        this.collectWebVitals();
        this.collectPageLoadMetrics();
        this.collectResourceMetrics();
        this.collectNetworkMetrics();
        this.collectMemoryMetrics();
        this.trackUserInteractions();
        this.setupPerformanceObserver();
        this.startRealtimeMonitoring();
        
        // Send initial metrics after page load
        window.addEventListener('load', () => {
            setTimeout(() => this.sendMetrics(), 3000);
        });
        
        // Send metrics before page unload
        window.addEventListener('beforeunload', () => {
            this.sendMetrics(true);
        });
        
        // Send metrics periodically
        setInterval(() => this.sendMetrics(), 30000); // Every 30 seconds
    }
    
    /**
     * Collect Core Web Vitals
     */
    collectWebVitals() {
        // Largest Contentful Paint (LCP)
        this.observeLCP();
        
        // First Input Delay (FID)
        this.observeFID();
        
        // Cumulative Layout Shift (CLS)
        this.observeCLS();
        
        // Interaction to Next Paint (INP)
        this.observeINP();
        
        // First Contentful Paint (FCP)
        this.observeFCP();
        
        // Time to First Byte (TTFB)
        this.observeTTFB();
    }
    
    /**
     * Observe Largest Contentful Paint
     */
    observeLCP() {
        if (!('PerformanceObserver' in window)) return;
        
        try {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                
                this.metrics.webVitals.lcp = {
                    value: lastEntry.renderTime || lastEntry.loadTime,
                    rating: this.rateLCP(lastEntry.renderTime || lastEntry.loadTime),
                    element: lastEntry.element?.tagName,
                    url: lastEntry.url,
                    timestamp: Date.now()
                };
                
                console.log('📊 LCP:', this.metrics.webVitals.lcp);
            });
            
            observer.observe({ entryTypes: ['largest-contentful-paint'] });
            this.observers.push(observer);
        } catch (error) {
            console.error('Error observing LCP:', error);
        }
    }
    
    /**
     * Observe First Input Delay
     */
    observeFID() {
        if (!('PerformanceObserver' in window)) return;
        
        try {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    this.metrics.webVitals.fid = {
                        value: entry.processingStart - entry.startTime,
                        rating: this.rateFID(entry.processingStart - entry.startTime),
                        eventType: entry.name,
                        timestamp: Date.now()
                    };
                    
                    console.log('📊 FID:', this.metrics.webVitals.fid);
                });
            });
            
            observer.observe({ entryTypes: ['first-input'] });
            this.observers.push(observer);
        } catch (error) {
            console.error('Error observing FID:', error);
        }
    }
    
    /**
     * Observe Cumulative Layout Shift
     */
    observeCLS() {
        if (!('PerformanceObserver' in window)) return;
        
        try {
            let clsValue = 0;
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                        
                        this.metrics.webVitals.cls = {
                            value: clsValue,
                            rating: this.rateCLS(clsValue),
                            timestamp: Date.now()
                        };
                    }
                });
                
                console.log('📊 CLS:', this.metrics.webVitals.cls);
            });
            
            observer.observe({ entryTypes: ['layout-shift'] });
            this.observers.push(observer);
        } catch (error) {
            console.error('Error observing CLS:', error);
        }
    }
    
    /**
     * Observe Interaction to Next Paint
     */
    observeINP() {
        if (!('PerformanceObserver' in window)) return;
        
        try {
            const interactions = [];
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    interactions.push(entry.duration);
                    
                    // Calculate INP (98th percentile)
                    const sorted = [...interactions].sort((a, b) => a - b);
                    const index = Math.floor(sorted.length * 0.98);
                    const inpValue = sorted[index] || 0;
                    
                    this.metrics.webVitals.inp = {
                        value: inpValue,
                        rating: this.rateINP(inpValue),
                        interactionCount: interactions.length,
                        timestamp: Date.now()
                    };
                });
            });
            
            observer.observe({ entryTypes: ['event'] });
            this.observers.push(observer);
        } catch (error) {
            console.error('Error observing INP:', error);
        }
    }
    
    /**
     * Observe First Contentful Paint
     */
    observeFCP() {
        if (!('PerformanceObserver' in window)) return;
        
        try {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    if (entry.name === 'first-contentful-paint') {
                        this.metrics.webVitals.fcp = {
                            value: entry.startTime,
                            rating: this.rateFCP(entry.startTime),
                            timestamp: Date.now()
                        };
                        
                        console.log('📊 FCP:', this.metrics.webVitals.fcp);
                    }
                });
            });
            
            observer.observe({ entryTypes: ['paint'] });
            this.observers.push(observer);
        } catch (error) {
            console.error('Error observing FCP:', error);
        }
    }
    
    /**
     * Observe Time to First Byte
     */
    observeTTFB() {
        try {
            const navigationEntry = performance.getEntriesByType('navigation')[0];
            if (navigationEntry) {
                const ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
                
                this.metrics.webVitals.ttfb = {
                    value: ttfb,
                    rating: this.rateTTFB(ttfb),
                    timestamp: Date.now()
                };
                
                console.log('📊 TTFB:', this.metrics.webVitals.ttfb);
            }
        } catch (error) {
            console.error('Error observing TTFB:', error);
        }
    }
    
    /**
     * Collect page load metrics
     */
    collectPageLoadMetrics() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const navigation = performance.getEntriesByType('navigation')[0];
                
                if (navigation) {
                    this.metrics.pageLoad = {
                        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
                        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
                        domInteractive: navigation.domInteractive - navigation.fetchStart,
                        domComplete: navigation.domComplete - navigation.fetchStart,
                        redirectTime: navigation.redirectEnd - navigation.redirectStart,
                        dnsTime: navigation.domainLookupEnd - navigation.domainLookupStart,
                        tcpTime: navigation.connectEnd - navigation.connectStart,
                        requestTime: navigation.responseStart - navigation.requestStart,
                        responseTime: navigation.responseEnd - navigation.responseStart,
                        totalLoadTime: navigation.loadEventEnd - navigation.fetchStart,
                        timestamp: Date.now()
                    };
                    
                    console.log('📊 Page Load Metrics:', this.metrics.pageLoad);
                }
            }, 0);
        });
    }
    
    /**
     * Collect resource metrics
     */
    collectResourceMetrics() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const resources = performance.getEntriesByType('resource');
                
                this.metrics.resources = resources.map(resource => ({
                    name: resource.name,
                    type: resource.initiatorType,
                    duration: resource.duration,
                    size: resource.transferSize,
                    cached: resource.transferSize === 0,
                    protocol: resource.nextHopProtocol,
                    timestamp: Date.now()
                }));
                
                // Calculate resource statistics
                const stats = this.calculateResourceStats(resources);
                this.metrics.resourceStats = stats;
                
                console.log('📊 Resource Metrics:', this.metrics.resources.length, 'resources');
                console.log('📊 Resource Stats:', stats);
            }, 0);
        });
    }
    
    /**
     * Calculate resource statistics
     */
    calculateResourceStats(resources) {
        const stats = {
            total: resources.length,
            totalSize: 0,
            totalDuration: 0,
            cached: 0,
            byType: {}
        };
        
        resources.forEach(resource => {
            stats.totalSize += resource.transferSize || 0;
            stats.totalDuration += resource.duration || 0;
            
            if (resource.transferSize === 0) {
                stats.cached++;
            }
            
            const type = resource.initiatorType;
            if (!stats.byType[type]) {
                stats.byType[type] = { count: 0, size: 0, duration: 0 };
            }
            
            stats.byType[type].count++;
            stats.byType[type].size += resource.transferSize || 0;
            stats.byType[type].duration += resource.duration || 0;
        });
        
        return stats;
    }
    
    /**
     * Collect network metrics
     */
    collectNetworkMetrics() {
        if ('connection' in navigator) {
            const connection = navigator.connection;
            
            this.metrics.network = {
                effectiveType: connection.effectiveType,
                downlink: connection.downlink,
                rtt: connection.rtt,
                saveData: connection.saveData,
                timestamp: Date.now()
            };
            
            // Listen for network changes
            connection.addEventListener('change', () => {
                this.metrics.network = {
                    effectiveType: connection.effectiveType,
                    downlink: connection.downlink,
                    rtt: connection.rtt,
                    saveData: connection.saveData,
                    timestamp: Date.now()
                };
                
                console.log('📊 Network changed:', this.metrics.network);
            });
            
            console.log('📊 Network Metrics:', this.metrics.network);
        }
    }
    
    /**
     * Collect memory metrics
     */
    collectMemoryMetrics() {
        if ('memory' in performance) {
            this.metrics.memory = {
                jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
                totalJSHeapSize: performance.memory.totalJSHeapSize,
                usedJSHeapSize: performance.memory.usedJSHeapSize,
                timestamp: Date.now()
            };
            
            console.log('📊 Memory Metrics:', this.metrics.memory);
        }
    }
    
    /**
     * Track user interactions
     */
    trackUserInteractions() {
        const interactionTypes = ['click', 'input', 'scroll', 'keydown'];
        
        interactionTypes.forEach(type => {
            document.addEventListener(type, (event) => {
                this.recordInteraction({
                    type,
                    target: event.target?.tagName,
                    targetId: event.target?.id,
                    targetClass: event.target?.className,
                    timestamp: Date.now(),
                    timeOnPage: Date.now() - this.startTime
                });
            }, { passive: true });
        });
    }
    
    /**
     * Record user interaction
     */
    recordInteraction(interaction) {
        this.metrics.interactions.push(interaction);
        
        // Keep only last 100 interactions
        if (this.metrics.interactions.length > 100) {
            this.metrics.interactions.shift();
        }
    }
    
    /**
     * Setup Performance Observer
     */
    setupPerformanceObserver() {
        if (!('PerformanceObserver' in window)) return;
        
        try {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    console.log('📊 Performance entry:', entry.entryType, entry.name, entry.duration);
                });
            });
            
            observer.observe({ entryTypes: ['measure', 'mark'] });
            this.observers.push(observer);
        } catch (error) {
            console.error('Error setting up Performance Observer:', error);
        }
    }
    
    /**
     * Start real-time monitoring
     */
    startRealtimeMonitoring() {
        // Monitor every 5 seconds
        setInterval(() => {
            this.collectMemoryMetrics();
            
            // Check for performance issues
            this.checkPerformanceIssues();
        }, 5000);
    }
    
    /**
     * Check for performance issues
     */
    checkPerformanceIssues() {
        const issues = [];
        
        // Check LCP
        if (this.metrics.webVitals.lcp && this.metrics.webVitals.lcp.value > 2500) {
            issues.push({
                type: 'LCP',
                severity: this.metrics.webVitals.lcp.rating,
                message: `LCP is ${this.metrics.webVitals.lcp.value.toFixed(0)}ms (should be < 2500ms)`,
                value: this.metrics.webVitals.lcp.value
            });
        }
        
        // Check FID
        if (this.metrics.webVitals.fid && this.metrics.webVitals.fid.value > 100) {
            issues.push({
                type: 'FID',
                severity: this.metrics.webVitals.fid.rating,
                message: `FID is ${this.metrics.webVitals.fid.value.toFixed(0)}ms (should be < 100ms)`,
                value: this.metrics.webVitals.fid.value
            });
        }
        
        // Check CLS
        if (this.metrics.webVitals.cls && this.metrics.webVitals.cls.value > 0.1) {
            issues.push({
                type: 'CLS',
                severity: this.metrics.webVitals.cls.rating,
                message: `CLS is ${this.metrics.webVitals.cls.value.toFixed(3)} (should be < 0.1)`,
                value: this.metrics.webVitals.cls.value
            });
        }
        
        // Check memory
        if (this.metrics.memory.usedJSHeapSize) {
            const memoryUsagePercent = (this.metrics.memory.usedJSHeapSize / this.metrics.memory.jsHeapSizeLimit) * 100;
            
            if (memoryUsagePercent > 90) {
                issues.push({
                    type: 'MEMORY',
                    severity: 'poor',
                    message: `Memory usage is ${memoryUsagePercent.toFixed(1)}% (should be < 90%)`,
                    value: memoryUsagePercent
                });
            }
        }
        
        if (issues.length > 0) {
            console.warn('⚠️ Performance issues detected:', issues);
            this.metrics.issues = issues;
        }
    }
    
    /**
     * Rate metrics
     */
    rateLCP(value) {
        if (value <= 2500) return 'good';
        if (value <= 4000) return 'needs-improvement';
        return 'poor';
    }
    
    rateFID(value) {
        if (value <= 100) return 'good';
        if (value <= 300) return 'needs-improvement';
        return 'poor';
    }
    
    rateCLS(value) {
        if (value <= 0.1) return 'good';
        if (value <= 0.25) return 'needs-improvement';
        return 'poor';
    }
    
    rateINP(value) {
        if (value <= 200) return 'good';
        if (value <= 500) return 'needs-improvement';
        return 'poor';
    }
    
    rateFCP(value) {
        if (value <= 1800) return 'good';
        if (value <= 3000) return 'needs-improvement';
        return 'poor';
    }
    
    rateTTFB(value) {
        if (value <= 800) return 'good';
        if (value <= 1800) return 'needs-improvement';
        return 'poor';
    }
    
    /**
     * Send metrics to analytics
     */
    sendMetrics(isBeforeUnload = false) {
        const data = {
            sessionId: this.sessionId,
            pageId: this.pageId,
            url: window.location.href,
            timestamp: Date.now(),
            timeOnPage: Date.now() - this.startTime,
            metrics: this.metrics,
            userAgent: navigator.userAgent,
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            }
        };
        
        // Send via sendBeacon if before unload
        if (isBeforeUnload && navigator.sendBeacon) {
            navigator.sendBeacon('/api/analytics/performance', JSON.stringify(data));
        } else {
            // Send via fetch
            fetch('/api/analytics/performance', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }).catch(error => {
                console.error('Error sending metrics:', error);
            });
        }
        
        console.log('📊 Metrics sent:', data);
    }
    
    /**
     * Generate session ID
     */
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    /**
     * Generate page ID
     */
    generatePageId() {
        return 'page_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    /**
     * Get all metrics
     */
    getMetrics() {
        return this.metrics;
    }
    
    /**
     * Custom performance mark
     */
    mark(name) {
        if ('performance' in window && 'mark' in performance) {
            performance.mark(name);
        }
    }
    
    /**
     * Custom performance measure
     */
    measure(name, startMark, endMark) {
        if ('performance' in window && 'measure' in performance) {
            try {
                performance.measure(name, startMark, endMark);
                const measure = performance.getEntriesByName(name)[0];
                
                if (!this.metrics.custom[name]) {
                    this.metrics.custom[name] = [];
                }
                
                this.metrics.custom[name].push({
                    duration: measure.duration,
                    timestamp: Date.now()
                });
                
                console.log('📊 Custom measure:', name, measure.duration);
            } catch (error) {
                console.error('Error measuring:', error);
            }
        }
    }
    
    /**
     * Cleanup
     */
    cleanup() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers = [];
    }
}

// Initialize performance metrics collector
const performanceMetrics = new PerformanceMetricsCollector();

// Export for external use
window.performanceMetrics = performanceMetrics;

console.log('✅ Performance Metrics Collector ready!');

