// Performance Testing - DC TEKNİK
(function() {
    'use strict';
    
    class PerformanceTesting {
        constructor() {
            this.testResults = {
                coreWebVitals: {},
                resourceTiming: {},
                userTiming: {},
                navigationTiming: {},
                memoryUsage: {},
                networkPerformance: {},
                errors: []
            };
            this.init();
        }
        
        init() {
            this.testCoreWebVitals();
            this.testResourceTiming();
            this.testUserTiming();
            this.testNavigationTiming();
            this.testMemoryUsage();
            this.testNetworkPerformance();
            this.testPerformanceErrors();
            this.generateReport();
        }
        
        testCoreWebVitals() {
            const coreWebVitals = {
                lcp: null,
                fid: null,
                cls: null,
                fcp: null,
                tti: null,
                score: 0
            };
            
            // Test Largest Contentful Paint (LCP)
            this.measureLCP().then(lcp => {
                coreWebVitals.lcp = lcp;
                this.updateScore();
            });
            
            // Test First Input Delay (FID)
            this.measureFID().then(fid => {
                coreWebVitals.fid = fid;
                this.updateScore();
            });
            
            // Test Cumulative Layout Shift (CLS)
            this.measureCLS().then(cls => {
                coreWebVitals.cls = cls;
                this.updateScore();
            });
            
            // Test First Contentful Paint (FCP)
            this.measureFCP().then(fcp => {
                coreWebVitals.fcp = fcp;
                this.updateScore();
            });
            
            // Test Time to Interactive (TTI)
            this.measureTTI().then(tti => {
                coreWebVitals.tti = tti;
                this.updateScore();
            });
            
            this.testResults.coreWebVitals = coreWebVitals;
        }
        
        measureLCP() {
            return new Promise((resolve) => {
                if ('PerformanceObserver' in window) {
                    const observer = new PerformanceObserver((entryList) => {
                        const entries = entryList.getEntries();
                        const lastEntry = entries[entries.length - 1];
                        resolve({
                            value: lastEntry.startTime,
                            element: lastEntry.element,
                            url: lastEntry.url,
                            loadTime: lastEntry.loadTime,
                            renderTime: lastEntry.renderTime
                        });
                    });
                    
                    observer.observe({ entryTypes: ['largest-contentful-paint'] });
                    
                    // Timeout after 10 seconds
                    setTimeout(() => {
                        observer.disconnect();
                        resolve(null);
                    }, 10000);
                } else {
                    resolve(null);
                }
            });
        }
        
        measureFID() {
            return new Promise((resolve) => {
                if ('PerformanceObserver' in window) {
                    const observer = new PerformanceObserver((entryList) => {
                        const entries = entryList.getEntries();
                        entries.forEach(entry => {
                            resolve({
                                value: entry.processingStart - entry.startTime,
                                startTime: entry.startTime,
                                processingStart: entry.processingStart,
                                processingEnd: entry.processingEnd,
                                target: entry.target
                            });
                        });
                    });
                    
                    observer.observe({ entryTypes: ['first-input'] });
                    
                    // Timeout after 10 seconds
                    setTimeout(() => {
                        observer.disconnect();
                        resolve(null);
                    }, 10000);
                } else {
                    resolve(null);
                }
            });
        }
        
        measureCLS() {
            return new Promise((resolve) => {
                if ('PerformanceObserver' in window) {
                    let clsValue = 0;
                    const observer = new PerformanceObserver((entryList) => {
                        const entries = entryList.getEntries();
                        entries.forEach(entry => {
                            if (!entry.hadRecentInput) {
                                clsValue += entry.value;
                            }
                        });
                    });
                    
                    observer.observe({ entryTypes: ['layout-shift'] });
                    
                    // Calculate CLS after page load
                    window.addEventListener('load', () => {
                        setTimeout(() => {
                            observer.disconnect();
                            resolve({
                                value: clsValue,
                                score: this.calculateCLSScore(clsValue)
                            });
                        }, 1000);
                    });
                } else {
                    resolve(null);
                }
            });
        }
        
        measureFCP() {
            return new Promise((resolve) => {
                if ('PerformanceObserver' in window) {
                    const observer = new PerformanceObserver((entryList) => {
                        const entries = entryList.getEntries();
                        entries.forEach(entry => {
                            if (entry.name === 'first-contentful-paint') {
                                resolve({
                                    value: entry.startTime,
                                    timestamp: entry.startTime
                                });
                            }
                        });
                    });
                    
                    observer.observe({ entryTypes: ['paint'] });
                    
                    // Timeout after 10 seconds
                    setTimeout(() => {
                        observer.disconnect();
                        resolve(null);
                    }, 10000);
                } else {
                    resolve(null);
                }
            });
        }
        
        measureTTI() {
            return new Promise((resolve) => {
                // Simplified TTI calculation
                const navigationStart = performance.timing.navigationStart;
                const domContentLoaded = performance.timing.domContentLoadedEventEnd;
                const loadEventEnd = performance.timing.loadEventEnd;
                
                const tti = loadEventEnd - navigationStart;
                
                resolve({
                    value: tti,
                    domContentLoaded: domContentLoaded - navigationStart,
                    loadEvent: loadEventEnd - navigationStart
                });
            });
        }
        
        calculateCLSScore(clsValue) {
            if (clsValue <= 0.1) return 100;
            if (clsValue <= 0.25) return 75;
            return 50;
        }
        
        testResourceTiming() {
            const resourceTiming = {
                resources: [],
                totalSize: 0,
                totalTime: 0,
                slowResources: [],
                score: 0
            };
            
            const resources = performance.getEntriesByType('resource');
            resourceTiming.resources = resources.map(resource => ({
                name: resource.name,
                duration: resource.duration,
                size: resource.transferSize || 0,
                startTime: resource.startTime,
                responseEnd: resource.responseEnd,
                type: this.getResourceType(resource.name)
            }));
            
            // Calculate totals
            resourceTiming.totalSize = resources.reduce((total, resource) => {
                return total + (resource.transferSize || 0);
            }, 0);
            
            resourceTiming.totalTime = resources.reduce((total, resource) => {
                return total + resource.duration;
            }, 0);
            
            // Find slow resources
            resourceTiming.slowResources = resources.filter(resource => resource.duration > 1000);
            
            // Calculate score
            const slowResourceCount = resourceTiming.slowResources.length;
            const totalResourceCount = resources.length;
            resourceTiming.score = totalResourceCount > 0 ? Math.round(((totalResourceCount - slowResourceCount) / totalResourceCount) * 100) : 100;
            
            this.testResults.resourceTiming = resourceTiming;
        }
        
        getResourceType(url) {
            if (url.includes('.css')) return 'stylesheet';
            if (url.includes('.js')) return 'script';
            if (url.includes('.png') || url.includes('.jpg') || url.includes('.jpeg') || url.includes('.gif') || url.includes('.svg')) return 'image';
            if (url.includes('.woff') || url.includes('.ttf') || url.includes('.otf')) return 'font';
            if (url.includes('.mp4') || url.includes('.webm') || url.includes('.ogg')) return 'media';
            return 'other';
        }
        
        testUserTiming() {
            const userTiming = {
                marks: [],
                measures: [],
                score: 0
            };
            
            // Get user timing marks
            const marks = performance.getEntriesByType('mark');
            userTiming.marks = marks.map(mark => ({
                name: mark.name,
                startTime: mark.startTime,
                duration: mark.duration
            }));
            
            // Get user timing measures
            const measures = performance.getEntriesByType('measure');
            userTiming.measures = measures.map(measure => ({
                name: measure.name,
                startTime: measure.startTime,
                duration: measure.duration
            }));
            
            // Calculate score based on timing marks and measures
            userTiming.score = marks.length + measures.length > 0 ? 100 : 0;
            
            this.testResults.userTiming = userTiming;
        }
        
        testNavigationTiming() {
            const navigationTiming = {
                loadTime: 0,
                domContentLoaded: 0,
                firstPaint: 0,
                firstContentfulPaint: 0,
                score: 0
            };
            
            if (performance.timing) {
                const timing = performance.timing;
                
                navigationTiming.loadTime = timing.loadEventEnd - timing.navigationStart;
                navigationTiming.domContentLoaded = timing.domContentLoadedEventEnd - timing.navigationStart;
                
                // Get paint timing
                const paintEntries = performance.getEntriesByType('paint');
                paintEntries.forEach(entry => {
                    if (entry.name === 'first-paint') {
                        navigationTiming.firstPaint = entry.startTime;
                    }
                    if (entry.name === 'first-contentful-paint') {
                        navigationTiming.firstContentfulPaint = entry.startTime;
                    }
                });
                
                // Calculate score
                navigationTiming.score = this.calculateNavigationScore(navigationTiming);
            }
            
            this.testResults.navigationTiming = navigationTiming;
        }
        
        calculateNavigationScore(timing) {
            let score = 100;
            
            if (timing.loadTime > 3000) score -= 20;
            if (timing.domContentLoaded > 2000) score -= 15;
            if (timing.firstPaint > 1500) score -= 15;
            if (timing.firstContentfulPaint > 1800) score -= 15;
            
            return Math.max(0, score);
        }
        
        testMemoryUsage() {
            const memoryUsage = {
                used: 0,
                total: 0,
                limit: 0,
                score: 0
            };
            
            if (performance.memory) {
                memoryUsage.used = performance.memory.usedJSHeapSize;
                memoryUsage.total = performance.memory.totalJSHeapSize;
                memoryUsage.limit = performance.memory.jsHeapSizeLimit;
                
                // Calculate score based on memory usage
                const usagePercentage = (memoryUsage.used / memoryUsage.limit) * 100;
                if (usagePercentage < 50) {
                    memoryUsage.score = 100;
                } else if (usagePercentage < 75) {
                    memoryUsage.score = 75;
                } else if (usagePercentage < 90) {
                    memoryUsage.score = 50;
                } else {
                    memoryUsage.score = 25;
                }
            }
            
            this.testResults.memoryUsage = memoryUsage;
        }
        
        testNetworkPerformance() {
            const networkPerformance = {
                connection: null,
                score: 0
            };
            
            if (navigator.connection) {
                const connection = navigator.connection;
                networkPerformance.connection = {
                    effectiveType: connection.effectiveType,
                    downlink: connection.downlink,
                    rtt: connection.rtt,
                    saveData: connection.saveData
                };
                
                // Calculate score based on connection type
                switch (connection.effectiveType) {
                    case '4g':
                        networkPerformance.score = 100;
                        break;
                    case '3g':
                        networkPerformance.score = 75;
                        break;
                    case '2g':
                        networkPerformance.score = 50;
                        break;
                    case 'slow-2g':
                        networkPerformance.score = 25;
                        break;
                    default:
                        networkPerformance.score = 50;
                }
            }
            
            this.testResults.networkPerformance = networkPerformance;
        }
        
        testPerformanceErrors() {
            const errors = [];
            
            // Test for performance errors
            window.addEventListener('error', (e) => {
                if (e.error && e.error.name === 'PerformanceError') {
                    errors.push({
                        type: 'performance_error',
                        message: e.message,
                        filename: e.filename,
                        lineno: e.lineno,
                        colno: e.colno
                    });
                }
            });
            
            // Test for slow resources
            const resources = performance.getEntriesByType('resource');
            resources.forEach(resource => {
                if (resource.duration > 3000) {
                    errors.push({
                        type: 'slow_resource',
                        message: 'Resource took too long to load',
                        resource: resource.name,
                        duration: resource.duration
                    });
                }
            });
            
            this.testResults.errors = errors;
        }
        
        updateScore() {
            const coreWebVitals = this.testResults.coreWebVitals;
            let score = 0;
            let count = 0;
            
            if (coreWebVitals.lcp) {
                score += this.calculateLCPScore(coreWebVitals.lcp.value);
                count++;
            }
            if (coreWebVitals.fid) {
                score += this.calculateFIDScore(coreWebVitals.fid.value);
                count++;
            }
            if (coreWebVitals.cls) {
                score += this.calculateCLSScore(coreWebVitals.cls.value);
                count++;
            }
            if (coreWebVitals.fcp) {
                score += this.calculateFCPScore(coreWebVitals.fcp.value);
                count++;
            }
            if (coreWebVitals.tti) {
                score += this.calculateTTIScore(coreWebVitals.tti.value);
                count++;
            }
            
            coreWebVitals.score = count > 0 ? Math.round(score / count) : 0;
        }
        
        calculateLCPScore(lcp) {
            if (lcp <= 2500) return 100;
            if (lcp <= 4000) return 75;
            return 50;
        }
        
        calculateFIDScore(fid) {
            if (fid <= 100) return 100;
            if (fid <= 300) return 75;
            return 50;
        }
        
        calculateFCPScore(fcp) {
            if (fcp <= 1800) return 100;
            if (fcp <= 3000) return 75;
            return 50;
        }
        
        calculateTTIScore(tti) {
            if (tti <= 3800) return 100;
            if (tti <= 7300) return 75;
            return 50;
        }
        
        generateReport() {
            const report = {
                timestamp: new Date().toISOString(),
                coreWebVitals: this.testResults.coreWebVitals,
                resourceTiming: this.testResults.resourceTiming,
                userTiming: this.testResults.userTiming,
                navigationTiming: this.testResults.navigationTiming,
                memoryUsage: this.testResults.memoryUsage,
                networkPerformance: this.testResults.networkPerformance,
                errors: this.testResults.errors,
                summary: this.generateSummary()
            };
            
            console.log('Performance Testing Report:', report);
            
            // Send to analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'performance_test', {
                    event_category: 'testing',
                    event_label: 'performance',
                    custom_map: {
                        core_web_vitals_score: report.coreWebVitals.score,
                        resource_timing_score: report.resourceTiming.score,
                        navigation_timing_score: report.navigationTiming.score,
                        memory_usage_score: report.memoryUsage.score
                    }
                });
            }
            
            return report;
        }
        
        generateSummary() {
            const summary = {
                overallScore: 0,
                coreWebVitalsScore: this.testResults.coreWebVitals.score,
                resourceTimingScore: this.testResults.resourceTiming.score,
                navigationTimingScore: this.testResults.navigationTiming.score,
                memoryUsageScore: this.testResults.memoryUsage.score,
                networkPerformanceScore: this.testResults.networkPerformance.score,
                recommendations: []
            };
            
            // Calculate overall score
            const scores = [
                summary.coreWebVitalsScore,
                summary.resourceTimingScore,
                summary.navigationTimingScore,
                summary.memoryUsageScore,
                summary.networkPerformanceScore
            ].filter(score => score > 0);
            
            summary.overallScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
            
            // Generate recommendations
            if (summary.coreWebVitalsScore < 80) {
                summary.recommendations.push('Improve Core Web Vitals');
            }
            if (summary.resourceTimingScore < 80) {
                summary.recommendations.push('Optimize resource loading');
            }
            if (summary.navigationTimingScore < 80) {
                summary.recommendations.push('Improve page load performance');
            }
            if (summary.memoryUsageScore < 80) {
                summary.recommendations.push('Optimize memory usage');
            }
            if (summary.networkPerformanceScore < 80) {
                summary.recommendations.push('Optimize for slower connections');
            }
            
            return summary;
        }
        
        // Public methods
        getTestResults() {
            return this.testResults;
        }
        
        runSpecificTest(testName) {
            switch (testName) {
                case 'coreWebVitals':
                    this.testCoreWebVitals();
                    break;
                case 'resourceTiming':
                    this.testResourceTiming();
                    break;
                case 'userTiming':
                    this.testUserTiming();
                    break;
                case 'navigationTiming':
                    this.testNavigationTiming();
                    break;
                case 'memoryUsage':
                    this.testMemoryUsage();
                    break;
                case 'networkPerformance':
                    this.testNetworkPerformance();
                    break;
                default:
                    console.warn('Unknown test:', testName);
            }
        }
        
        exportResults() {
            const results = this.getTestResults();
            const dataStr = JSON.stringify(results, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `performance-test-results-${new Date().toISOString().split('T')[0]}.json`;
            link.click();
            URL.revokeObjectURL(url);
        }
    }
    
    // Initialize performance testing
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.performanceTesting = new PerformanceTesting();
        });
    } else {
        window.performanceTesting = new PerformanceTesting();
    }
})();


