/**
 * DC TEKNİK - Deployment Monitor
 * Canlı site deployment durumu ve hata takibi
 */

(function() {
    'use strict';

    const DeploymentMonitor = {
        deploymentId: null,
        deploymentTime: null,
        version: null,
        errors: [],
        warnings: [],
        
        init() {
            // Get deployment info from meta tag or generate
            const metaVersion = document.querySelector('meta[name="cache-version"]');
            this.version = metaVersion ? metaVersion.content : 'unknown';
            
            // Generate deployment ID
            this.deploymentId = this.generateDeploymentId();
            this.deploymentTime = Date.now();
            
            // Start monitoring
            this.startMonitoring();
            
            // Report deployment
            this.reportDeployment();
        },
        
        generateDeploymentId() {
            return `deploy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        },
        
        startMonitoring() {
            // Monitor for deployment issues
            this.monitorScriptErrors();
            this.monitorResourceLoad();
            this.monitorPerformance();
            this.monitorHealth();
        },
        
        monitorScriptErrors() {
            window.addEventListener('error', (event) => {
                this.recordError({
                    type: 'script_error',
                    message: event.message,
                    source: event.filename,
                    line: event.lineno,
                    col: event.colno
                });
            }, true);
            
            window.addEventListener('unhandledrejection', (event) => {
                this.recordError({
                    type: 'promise_rejection',
                    reason: event.reason?.toString() || 'Unknown'
                });
            });
        },
        
        monitorResourceLoad() {
            // Monitor critical resources
            const criticalResources = [
                'script.js',
                'style.css',
                'js/error-handler.js',
                'js/email-service.js'
            ];
            
            criticalResources.forEach(resource => {
                const link = document.querySelector(`script[src*="${resource}"], link[href*="${resource}"]`);
                if (link) {
                    link.addEventListener('error', () => {
                        this.recordError({
                            type: 'resource_load_failed',
                            resource: resource
                        }, true); // Critical
                    });
                }
            });
        },
        
        monitorPerformance() {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    if (window.performance && window.performance.timing) {
                        const timing = window.performance.timing;
                        const loadTime = timing.loadEventEnd - timing.navigationStart;
                        
                        if (loadTime > 5000) {
                            this.recordWarning({
                                type: 'slow_load',
                                loadTime: loadTime
                            });
                        }
                    }
                }, 1000);
            });
        },
        
        monitorHealth() {
            // Check health every 30 seconds
            setInterval(() => {
                if (window.HealthMonitor) {
                    const health = window.HealthMonitor.getStatus();
                    
                    if (health.status === 'critical') {
                        this.recordError({
                            type: 'health_check_failed',
                            status: health.status,
                            checks: health.checks
                        }, true);
                    }
                }
            }, 30000);
        },
        
        recordError(error, critical = false) {
            error.timestamp = Date.now();
            error.deploymentId = this.deploymentId;
            error.version = this.version;
            error.critical = critical;
            
            this.errors.push(error);
            
            // Keep only last 50 errors
            if (this.errors.length > 50) {
                this.errors.shift();
            }
            
            // Report critical errors immediately
            if (critical) {
                this.reportError(error);
            }
            
            // Log to console in production
            const safeError = window.safeError || console.error;
            safeError('Deployment Error:', error);
        },
        
        recordWarning(warning) {
            warning.timestamp = Date.now();
            warning.deploymentId = this.deploymentId;
            warning.version = this.version;
            
            this.warnings.push(warning);
            
            // Keep only last 50 warnings
            if (this.warnings.length > 50) {
                this.warnings.shift();
            }
        },
        
        reportDeployment() {
            const deploymentInfo = {
                deploymentId: this.deploymentId,
                version: this.version,
                timestamp: this.deploymentTime,
                url: window.location.href,
                userAgent: navigator.userAgent
            };
            
            // Report to analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'deployment', {
                    event_category: 'System',
                    deployment_id: this.deploymentId,
                    version: this.version,
                    non_interaction: true
                });
            }
            
            // Report to security logger
            if (window.SecurityLogger) {
                window.SecurityLogger.log('deployment_detected', 'low', deploymentInfo);
            }
            
            console.log('🚀 Deployment detected:', deploymentInfo);
        },
        
        reportError(error) {
            // Send to analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'deployment_error', {
                    event_category: 'System',
                    event_label: error.type,
                    critical: error.critical,
                    deployment_id: this.deploymentId,
                    version: this.version
                });
            }
            
            // Send to security logger
            if (window.SecurityLogger) {
                window.SecurityLogger.log('deployment_error', error.critical ? 'high' : 'medium', error);
            }
        },
        
        getReport() {
            return {
                deploymentId: this.deploymentId,
                version: this.version,
                deploymentTime: this.deploymentTime,
                uptime: Date.now() - this.deploymentTime,
                errorCount: this.errors.length,
                warningCount: this.warnings.length,
                errors: this.errors.slice(-10), // Last 10 errors
                warnings: this.warnings.slice(-10), // Last 10 warnings
                health: window.HealthMonitor ? window.HealthMonitor.getStatus() : null
            };
        },
        
        checkDeploymentHealth() {
            const report = this.getReport();
            
            // Determine health status
            const criticalErrors = report.errors.filter(e => e.critical);
            const status = criticalErrors.length > 0 ? 'critical' :
                          report.errorCount > 10 ? 'warning' :
                          'healthy';
            
            return {
                status,
                report
            };
        }
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => DeploymentMonitor.init());
    } else {
        DeploymentMonitor.init();
    }

    // Export globally
    window.DeploymentMonitor = DeploymentMonitor;
    
    // Log initialization
    console.log('✅ Deployment Monitor initialized');
})();

