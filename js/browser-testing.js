// Cross-Browser Testing - DC TEKNİK
(function() {
    'use strict';
    
    class BrowserTesting {
        constructor() {
            this.testResults = {
                browser: this.getBrowserInfo(),
                features: {},
                compatibility: {},
                performance: {},
                errors: []
            };
            this.init();
        }
        
        init() {
            this.testBrowserFeatures();
            this.testCompatibility();
            this.testPerformance();
            this.testErrorHandling();
            this.generateReport();
        }
        
        getBrowserInfo() {
            const userAgent = navigator.userAgent;
            const browserInfo = {
                userAgent: userAgent,
                platform: navigator.platform,
                language: navigator.language,
                cookieEnabled: navigator.cookieEnabled,
                onLine: navigator.onLine,
                screenResolution: `${screen.width}x${screen.height}`,
                colorDepth: screen.colorDepth,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
            };
            
            // Detect browser type
            if (userAgent.includes('Chrome')) {
                browserInfo.name = 'Chrome';
                browserInfo.version = this.extractVersion(userAgent, 'Chrome/');
            } else if (userAgent.includes('Firefox')) {
                browserInfo.name = 'Firefox';
                browserInfo.version = this.extractVersion(userAgent, 'Firefox/');
            } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
                browserInfo.name = 'Safari';
                browserInfo.version = this.extractVersion(userAgent, 'Version/');
            } else if (userAgent.includes('Edge')) {
                browserInfo.name = 'Edge';
                browserInfo.version = this.extractVersion(userAgent, 'Edge/');
            } else if (userAgent.includes('Opera')) {
                browserInfo.name = 'Opera';
                browserInfo.version = this.extractVersion(userAgent, 'Opera/');
            } else {
                browserInfo.name = 'Unknown';
                browserInfo.version = 'Unknown';
            }
            
            return browserInfo;
        }
        
        extractVersion(userAgent, prefix) {
            const index = userAgent.indexOf(prefix);
            if (index === -1) return 'Unknown';
            const version = userAgent.substring(index + prefix.length);
            return version.split(' ')[0].split('.')[0];
        }
        
        testBrowserFeatures() {
            const features = {
                // HTML5 Features
                localStorage: this.testFeature('localStorage', () => {
                    const test = 'test';
                    localStorage.setItem(test, test);
                    const result = localStorage.getItem(test) === test;
                    localStorage.removeItem(test);
                    return result;
                }),
                
                sessionStorage: this.testFeature('sessionStorage', () => {
                    const test = 'test';
                    sessionStorage.setItem(test, test);
                    const result = sessionStorage.getItem(test) === test;
                    sessionStorage.removeItem(test);
                    return result;
                }),
                
                geolocation: this.testFeature('geolocation', () => {
                    return 'geolocation' in navigator;
                }),
                
                webgl: this.testFeature('webgl', () => {
                    const canvas = document.createElement('canvas');
                    return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
                }),
                
                canvas: this.testFeature('canvas', () => {
                    const canvas = document.createElement('canvas');
                    return !!(canvas.getContext && canvas.getContext('2d'));
                }),
                
                svg: this.testFeature('svg', () => {
                    return !!document.createElementNS && !!document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect;
                }),
                
                webWorkers: this.testFeature('webWorkers', () => {
                    return typeof Worker !== 'undefined';
                }),
                
                serviceWorkers: this.testFeature('serviceWorkers', () => {
                    return 'serviceWorker' in navigator;
                }),
                
                pushNotifications: this.testFeature('pushNotifications', () => {
                    return 'Notification' in window && 'PushManager' in window;
                }),
                
                // CSS Features
                flexbox: this.testFeature('flexbox', () => {
                    const element = document.createElement('div');
                    element.style.display = 'flex';
                    return element.style.display === 'flex';
                }),
                
                grid: this.testFeature('grid', () => {
                    const element = document.createElement('div');
                    element.style.display = 'grid';
                    return element.style.display === 'grid';
                }),
                
                cssVariables: this.testFeature('cssVariables', () => {
                    return window.CSS && window.CSS.supports && window.CSS.supports('color', 'var(--test)');
                }),
                
                // JavaScript Features
                es6: this.testFeature('es6', () => {
                    try {
                        new Function('(a = 0) => a');
                        return true;
                    } catch (e) {
                        return false;
                    }
                }),
                
                fetch: this.testFeature('fetch', () => {
                    return typeof fetch !== 'undefined';
                }),
                
                promises: this.testFeature('promises', () => {
                    return typeof Promise !== 'undefined';
                }),
                
                asyncAwait: this.testFeature('asyncAwait', () => {
                    try {
                        new Function('async () => {}');
                        return true;
                    } catch (e) {
                        return false;
                    }
                }),
                
                // Modern APIs
                intersectionObserver: this.testFeature('intersectionObserver', () => {
                    return 'IntersectionObserver' in window;
                }),
                
                resizeObserver: this.testFeature('resizeObserver', () => {
                    return 'ResizeObserver' in window;
                }),
                
                mutationObserver: this.testFeature('mutationObserver', () => {
                    return 'MutationObserver' in window;
                }),
                
                performanceObserver: this.testFeature('performanceObserver', () => {
                    return 'PerformanceObserver' in window;
                })
            };
            
            this.testResults.features = features;
        }
        
        testFeature(featureName, testFunction) {
            try {
                const result = testFunction();
                return {
                    supported: result,
                    error: null
                };
            } catch (error) {
                return {
                    supported: false,
                    error: error.message
                };
            }
        }
        
        testCompatibility() {
            const compatibility = {
                // HTML5 Compatibility
                html5: this.testHTML5Compatibility(),
                
                // CSS3 Compatibility
                css3: this.testCSS3Compatibility(),
                
                // JavaScript Compatibility
                javascript: this.testJavaScriptCompatibility(),
                
                // Mobile Compatibility
                mobile: this.testMobileCompatibility(),
                
                // Accessibility Compatibility
                accessibility: this.testAccessibilityCompatibility()
            };
            
            this.testResults.compatibility = compatibility;
        }
        
        testHTML5Compatibility() {
            const html5Features = [
                'localStorage',
                'sessionStorage',
                'geolocation',
                'webgl',
                'canvas',
                'svg',
                'webWorkers'
            ];
            
            let supportedCount = 0;
            html5Features.forEach(feature => {
                if (this.testResults.features[feature]?.supported) {
                    supportedCount++;
                }
            });
            
            return {
                score: Math.round((supportedCount / html5Features.length) * 100),
                supported: supportedCount,
                total: html5Features.length
            };
        }
        
        testCSS3Compatibility() {
            const css3Features = [
                'flexbox',
                'grid',
                'cssVariables'
            ];
            
            let supportedCount = 0;
            css3Features.forEach(feature => {
                if (this.testResults.features[feature]?.supported) {
                    supportedCount++;
                }
            });
            
            return {
                score: Math.round((supportedCount / css3Features.length) * 100),
                supported: supportedCount,
                total: css3Features.length
            };
        }
        
        testJavaScriptCompatibility() {
            const jsFeatures = [
                'es6',
                'fetch',
                'promises',
                'asyncAwait'
            ];
            
            let supportedCount = 0;
            jsFeatures.forEach(feature => {
                if (this.testResults.features[feature]?.supported) {
                    supportedCount++;
                }
            });
            
            return {
                score: Math.round((supportedCount / jsFeatures.length) * 100),
                supported: supportedCount,
                total: jsFeatures.length
            };
        }
        
        testMobileCompatibility() {
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
            
            return {
                isMobile: isMobile,
                isTouch: isTouch,
                screenSize: `${window.innerWidth}x${window.innerHeight}`,
                devicePixelRatio: window.devicePixelRatio || 1
            };
        }
        
        testAccessibilityCompatibility() {
            const accessibilityFeatures = {
                screenReader: this.testScreenReaderSupport(),
                keyboardNavigation: this.testKeyboardNavigation(),
                highContrast: this.testHighContrastSupport(),
                reducedMotion: this.testReducedMotionSupport()
            };
            
            return accessibilityFeatures;
        }
        
        testScreenReaderSupport() {
            return {
                ariaSupported: 'aria' in document.createElement('div'),
                roleSupported: 'role' in document.createElement('div'),
                tabIndexSupported: 'tabIndex' in document.createElement('div')
            };
        }
        
        testKeyboardNavigation() {
            return {
                focusSupported: 'focus' in document.createElement('div'),
                tabIndexSupported: 'tabIndex' in document.createElement('div')
            };
        }
        
        testHighContrastSupport() {
            return window.matchMedia && window.matchMedia('(prefers-contrast: high)').matches;
        }
        
        testReducedMotionSupport() {
            return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        }
        
        testPerformance() {
            const performance = {
                loadTime: this.measureLoadTime(),
                renderTime: this.measureRenderTime(),
                memoryUsage: this.measureMemoryUsage(),
                networkSpeed: this.measureNetworkSpeed()
            };
            
            this.testResults.performance = performance;
        }
        
        measureLoadTime() {
            if (performance.timing) {
                const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
                return {
                    loadTime: loadTime,
                    domContentLoaded: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
                    firstPaint: performance.getEntriesByType('paint')[0]?.startTime || 0
                };
            }
            return null;
        }
        
        measureRenderTime() {
            const renderStart = performance.timing.domLoading;
            const renderEnd = performance.timing.domContentLoadedEventEnd;
            return renderEnd - renderStart;
        }
        
        measureMemoryUsage() {
            if (performance.memory) {
                return {
                    used: performance.memory.usedJSHeapSize,
                    total: performance.memory.totalJSHeapSize,
                    limit: performance.memory.jsHeapSizeLimit
                };
            }
            return null;
        }
        
        measureNetworkSpeed() {
            if (navigator.connection) {
                return {
                    effectiveType: navigator.connection.effectiveType,
                    downlink: navigator.connection.downlink,
                    rtt: navigator.connection.rtt,
                    saveData: navigator.connection.saveData
                };
            }
            return null;
        }
        
        testErrorHandling() {
            // Test error handling
            const errors = [];
            
            // Test JavaScript errors
            window.addEventListener('error', (e) => {
                errors.push({
                    type: 'javascript_error',
                    message: e.message,
                    filename: e.filename,
                    lineno: e.lineno,
                    colno: e.colno
                });
            });
            
            // Test unhandled promise rejections
            window.addEventListener('unhandledrejection', (e) => {
                errors.push({
                    type: 'unhandled_rejection',
                    message: e.reason?.message || e.reason,
                    promise: e.promise
                });
            });
            
            this.testResults.errors = errors;
        }
        
        generateReport() {
            const report = {
                timestamp: new Date().toISOString(),
                browser: this.testResults.browser,
                features: this.testResults.features,
                compatibility: this.testResults.compatibility,
                performance: this.testResults.performance,
                errors: this.testResults.errors,
                summary: this.generateSummary()
            };
            
            console.log('Browser Testing Report:', report);
            
            // Send to analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'browser_test', {
                    event_category: 'testing',
                    event_label: this.testResults.browser.name,
                    custom_map: {
                        browser_version: this.testResults.browser.version,
                        compatibility_score: report.summary.compatibilityScore,
                        performance_score: report.summary.performanceScore
                    }
                });
            }
            
            return report;
        }
        
        generateSummary() {
            const compatibilityScore = Math.round(
                (this.testResults.compatibility.html5.score + 
                 this.testResults.compatibility.css3.score + 
                 this.testResults.compatibility.javascript.score) / 3
            );
            
            const performanceScore = this.calculatePerformanceScore();
            
            return {
                compatibilityScore: compatibilityScore,
                performanceScore: performanceScore,
                overallScore: Math.round((compatibilityScore + performanceScore) / 2),
                browserSupport: this.testResults.browser.name,
                browserVersion: this.testResults.browser.version,
                platform: this.testResults.browser.platform
            };
        }
        
        calculatePerformanceScore() {
            const performance = this.testResults.performance;
            let score = 100;
            
            if (performance.loadTime && performance.loadTime.loadTime > 3000) {
                score -= 20;
            }
            
            if (performance.memoryUsage && performance.memoryUsage.used > 50 * 1024 * 1024) {
                score -= 15;
            }
            
            if (performance.networkSpeed && performance.networkSpeed.effectiveType === 'slow-2g') {
                score -= 25;
            }
            
            return Math.max(0, score);
        }
        
        // Public methods
        getTestResults() {
            return this.testResults;
        }
        
        runSpecificTest(testName) {
            switch (testName) {
                case 'features':
                    this.testBrowserFeatures();
                    break;
                case 'compatibility':
                    this.testCompatibility();
                    break;
                case 'performance':
                    this.testPerformance();
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
            link.download = `browser-test-results-${new Date().toISOString().split('T')[0]}.json`;
            link.click();
            URL.revokeObjectURL(url);
        }
    }
    
    // Initialize browser testing
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.browserTesting = new BrowserTesting();
        });
    } else {
        window.browserTesting = new BrowserTesting();
    }
})();

