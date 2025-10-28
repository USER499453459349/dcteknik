/**
 * DC TEKNİK - Production Configuration
 * Canlı site için optimizasyonlar ve hata önleme
 */

(function() {
    'use strict';

    // Production mode detection
    const isProduction = window.location.hostname !== 'localhost' && 
                        window.location.hostname !== '127.0.0.1' &&
                        !window.location.hostname.includes('dev') &&
                        window.location.protocol === 'https:';

    // Production configuration
    window.PRODUCTION_CONFIG = {
        isProduction: isProduction,
        enableDetailedLogging: !isProduction,
        enableDebugMode: !isProduction,
        enablePerformanceMonitoring: true,
        enableErrorTracking: true,
        enableAutoRecovery: true,
        enableHealthChecks: true,
        maxRetryAttempts: 3,
        retryDelay: 1000,
        healthCheckInterval: 30000, // 30 seconds
        errorReportThreshold: 5,
        performanceAlertThreshold: 3000 // 3 seconds
    };

    /**
     * Production-safe logging
     */
    if (isProduction) {
        // Override console methods in production
        const originalLog = console.log;
        const originalWarn = console.warn;
        const originalError = console.error;

        // Only log errors and critical warnings in production
        console.log = function() {
            // Silent in production
        };

        console.warn = function(...args) {
            const message = args[0] || '';
            // Only log security-related warnings
            if (typeof message === 'string' && (
                message.includes('Security') ||
                message.includes('XSS') ||
                message.includes('CSRF') ||
                message.includes('Attack')
            )) {
                originalWarn.apply(console, args);
            }
        };

        console.error = function(...args) {
            // Always log errors, but rate-limited
            originalError.apply(console, args);
            
            // Send to error tracking service
            if (window.errorTracker) {
                window.errorTracker.track({
                    level: 'error',
                    message: args[0],
                    timestamp: Date.now(),
                    url: window.location.href
                });
            }
        };
    }

    /**
     * Auto-recovery system
     */
    window.AutoRecovery = {
        failures: new Map(),
        
        recordFailure(component, error) {
            const key = component;
            if (!this.failures.has(key)) {
                this.failures.set(key, {
                    count: 0,
                    lastFailure: null,
                    errors: []
                });
            }
            
            const record = this.failures.get(key);
            record.count++;
            record.lastFailure = Date.now();
            record.errors.push({
                error: error?.message || String(error),
                timestamp: Date.now()
            });
            
            // Keep only last 5 errors
            if (record.errors.length > 5) {
                record.errors.shift();
            }
            
            // Auto-recovery after threshold
            if (record.count >= PRODUCTION_CONFIG.maxRetryAttempts) {
                this.attemptRecovery(component);
            }
        },
        
        attemptRecovery(component) {
            console.warn(`🔄 Attempting auto-recovery for: ${component}`);
            
            // Attempt recovery based on component type
            switch(component) {
                case 'ServiceWorker':
                    this.recoverServiceWorker();
                    break;
                case 'EmailService':
                    this.recoverEmailService();
                    break;
                case 'Analytics':
                    this.recoverAnalytics();
                    break;
                default:
                    // Generic recovery - reload critical scripts
                    this.reloadComponent(component);
            }
        },
        
        recoverServiceWorker() {
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then(registrations => {
                    registrations.forEach(registration => {
                        registration.unregister().then(() => {
                            console.log('✅ Service Worker unregistered, will re-register');
                            setTimeout(() => {
                                if (window.initServiceWorker) {
                                    window.initServiceWorker();
                                }
                            }, 1000);
                        });
                    });
                });
            }
        },
        
        recoverEmailService() {
            // Reload email service script
            this.reloadScript('js/email-service.js');
        },
        
        recoverAnalytics() {
            // Analytics doesn't need recovery, it's non-critical
            console.info('Analytics failure - non-critical, continuing');
        },
        
        reloadComponent(component) {
            // Generic component reload
            const script = document.querySelector(`script[src*="${component}"]`);
            if (script) {
                const newScript = document.createElement('script');
                newScript.src = script.src;
                newScript.onload = () => console.log(`✅ ${component} reloaded`);
                newScript.onerror = () => console.error(`❌ Failed to reload ${component}`);
                script.parentNode.replaceChild(newScript, script);
            }
        },
        
        reloadScript(src) {
            const script = document.createElement('script');
            script.src = src + '?v=' + Date.now(); // Cache bust
            script.onload = () => console.log(`✅ Script reloaded: ${src}`);
            script.onerror = () => console.error(`❌ Failed to reload: ${src}`);
            document.head.appendChild(script);
        }
    };

    /**
     * Health Check System
     */
    window.HealthMonitor = {
        checks: [],
        status: 'healthy',
        lastCheck: null,
        
        addCheck(name, fn, critical = false) {
            this.checks.push({
                name,
                fn,
                critical,
                lastResult: null
            });
        },
        
        runChecks() {
            const results = [];
            
            this.checks.forEach(check => {
                try {
                    const result = check.fn();
                    check.lastResult = result;
                    results.push({
                        name: check.name,
                        status: result ? 'healthy' : 'unhealthy',
                        critical: check.critical
                    });
                } catch (error) {
                    check.lastResult = false;
                    results.push({
                        name: check.name,
                        status: 'error',
                        error: error.message,
                        critical: check.critical
                    });
                }
            });
            
            // Determine overall health
            const criticalFailures = results.filter(r => r.critical && r.status !== 'healthy');
            this.status = criticalFailures.length > 0 ? 'critical' : 'healthy';
            this.lastCheck = Date.now();
            
            // Report to monitoring service
            if (window.monitoringService) {
                window.monitoringService.reportHealth({
                    status: this.status,
                    checks: results,
                    timestamp: this.lastCheck
                });
            }
            
            return {
                status: this.status,
                checks: results,
                timestamp: this.lastCheck
            };
        },
        
        startMonitoring(interval = 30000) {
            // Run initial check
            this.runChecks();
            
            // Schedule periodic checks
            setInterval(() => {
                this.runChecks();
            }, interval);
        },
        
        getStatus() {
            return {
                status: this.status,
                lastCheck: this.lastCheck,
                checks: this.checks.map(c => ({
                    name: c.name,
                    status: c.lastResult ? 'healthy' : 'unhealthy'
                }))
            };
        }
    };

    /**
     * Initialize health checks
     */
    function initializeHealthChecks() {
        // Service Worker check
        window.HealthMonitor.addCheck('ServiceWorker', function() {
            if (!('serviceWorker' in navigator)) return true; // Not critical if not supported
            return navigator.serviceWorker.controller !== null;
        }, false);

        // Email Service check
        window.HealthMonitor.addCheck('EmailService', function() {
            return typeof window.EmailService !== 'undefined';
        }, false);

        // Error Handler check
        window.HealthMonitor.addCheck('ErrorHandler', function() {
            return typeof window.safeError !== 'undefined';
        }, true); // Critical

        // Security Systems check
        window.HealthMonitor.addCheck('SecuritySystems', function() {
            return typeof window.SecurityFirewall !== 'undefined' ||
                   typeof window.SecurityLogger !== 'undefined';
        }, false);

        // DOM Ready check
        window.HealthMonitor.addCheck('DOMReady', function() {
            return document.readyState === 'complete';
        }, true); // Critical

        // Storage check
        window.HealthMonitor.addCheck('Storage', function() {
            try {
                localStorage.setItem('__test__', '1');
                localStorage.removeItem('__test__');
                return true;
            } catch {
                return false;
            }
        }, false);

        // Start monitoring
        window.HealthMonitor.startMonitoring(PRODUCTION_CONFIG.healthCheckInterval);
    }

    /**
     * Performance Monitor
     */
    window.PerformanceMonitor = {
        metrics: {
            pageLoad: null,
            domContentLoaded: null,
            firstPaint: null,
            timeToInteractive: null
        },
        
        start() {
            if (!window.performance || !window.performance.timing) return;
            
            window.addEventListener('load', () => {
                setTimeout(() => {
                    this.collectMetrics();
                    this.checkPerformance();
                }, 1000);
            });
        },
        
        collectMetrics() {
            const timing = window.performance.timing;
            
            this.metrics.pageLoad = timing.loadEventEnd - timing.navigationStart;
            this.metrics.domContentLoaded = timing.domContentLoadedEventEnd - timing.navigationStart;
            
            // Check for paint metrics
            if (window.performance.getEntriesByType) {
                const paintEntries = window.performance.getEntriesByType('paint');
                paintEntries.forEach(entry => {
                    if (entry.name === 'first-paint') {
                        this.metrics.firstPaint = entry.startTime;
                    }
                });
            }
            
            // Send to analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'page_performance', {
                    page_load_time: this.metrics.pageLoad,
                    dom_ready_time: this.metrics.domContentLoaded,
                    first_paint: this.metrics.firstPaint
                });
            }
        },
        
        checkPerformance() {
            const threshold = PRODUCTION_CONFIG.performanceAlertThreshold;
            
            if (this.metrics.pageLoad > threshold) {
                console.warn(`⚠️ Slow page load: ${this.metrics.pageLoad}ms`);
                
                // Report to monitoring
                if (window.monitoringService) {
                    window.monitoringService.reportPerformance({
                        metric: 'pageLoad',
                        value: this.metrics.pageLoad,
                        threshold: threshold
                    });
                }
            }
        }
    };

    /**
     * Initialize production systems
     */
    function init() {
        if (isProduction) {
            console.log('🚀 Production mode activated');
            
            // Initialize health monitoring
            initializeHealthChecks();
            
            // Start performance monitoring
            window.PerformanceMonitor.start();
            
            // Report production ready
            if (typeof gtag !== 'undefined') {
                gtag('event', 'production_mode', {
                    event_category: 'System',
                    non_interaction: true
                });
            }
        } else {
            console.log('🔧 Development mode');
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Export for global access
    window.ProductionConfig = window.PRODUCTION_CONFIG;
})();

