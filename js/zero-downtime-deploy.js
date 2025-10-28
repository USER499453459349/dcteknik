/**
 * DC TEKNİK - Zero-Downtime Deployment
 * Sorunsuz deployment için hazırlık ve kontrol sistemi
 */

(function() {
    'use strict';

    const ZeroDowntimeDeploy = {
        currentVersion: null,
        deploymentQueue: [],
        isDeploying: false,
        
        init() {
            // Get current version
            const metaVersion = document.querySelector('meta[name="cache-version"]');
            this.currentVersion = metaVersion ? metaVersion.content : '1.7.1';
            
            // Store in sessionStorage for comparison
            const storedVersion = sessionStorage.getItem('site_version');
            if (storedVersion && storedVersion !== this.currentVersion) {
                this.handleVersionChange(storedVersion, this.currentVersion);
            }
            sessionStorage.setItem('site_version', this.currentVersion);
            
            // Monitor for new deployments
            this.monitorServiceWorkerUpdates();
            this.setupGracefulShutdown();
        },
        
        handleVersionChange(oldVersion, newVersion) {
            console.log(`🔄 Version changed: ${oldVersion} → ${newVersion}`);
            
            // Notify user if needed
            if (this.shouldNotifyUser(oldVersion, newVersion)) {
                this.showUpdateNotification(newVersion);
            }
            
            // Clear old caches
            this.clearOldCaches();
            
            // Report version change
            if (typeof gtag !== 'undefined') {
                gtag('event', 'version_update', {
                    event_category: 'System',
                    old_version: oldVersion,
                    new_version: newVersion
                });
            }
        },
        
        shouldNotifyUser(oldVersion, newVersion) {
            // Parse versions
            const oldParts = oldVersion.split('.').map(Number);
            const newParts = newVersion.split('.').map(Number);
            
            // Notify for major or minor updates
            return oldParts[0] !== newParts[0] || oldParts[1] !== newParts[1];
        },
        
        showUpdateNotification(newVersion) {
            // Create notification element
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #10b981;
                color: white;
                padding: 15px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                z-index: 10000;
                animation: slideIn 0.3s ease;
            `;
            notification.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span>✅</span>
                    <div>
                        <strong>Site Güncellendi!</strong><br>
                        <small>Versiyon: ${newVersion}</small>
                    </div>
                    <button onclick="this.parentElement.parentElement.remove()" 
                            style="background: transparent; border: none; color: white; cursor: pointer; font-size: 20px; margin-left: 10px;">×</button>
                </div>
            `;
            
            document.body.appendChild(notification);
            
            // Auto-hide after 5 seconds
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 5000);
        },
        
        clearOldCaches() {
            if ('caches' in window) {
                caches.keys().then(cacheNames => {
                    cacheNames.forEach(cacheName => {
                        // Delete old cache versions
                        if (!cacheName.includes(this.currentVersion)) {
                            caches.delete(cacheName).then(() => {
                                console.log(`🗑️ Deleted old cache: ${cacheName}`);
                            });
                        }
                    });
                });
            }
        },
        
        monitorServiceWorkerUpdates() {
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.addEventListener('controllerchange', () => {
                    console.log('🔄 Service Worker controller changed - new version active');
                    
                    // Reload page if critical update
                    if (this.isCriticalUpdate()) {
                        setTimeout(() => {
                            window.location.reload();
                        }, 1000);
                    }
                });
            }
        },
        
        isCriticalUpdate() {
            // Determine if update requires page reload
            // For now, always reload for major updates
            return true;
        },
        
        setupGracefulShutdown() {
            // Handle page unload gracefully
            window.addEventListener('beforeunload', () => {
                // Save any pending data
                this.savePendingData();
                
                // Report page unload
                if (window.DeploymentMonitor) {
                    const report = window.DeploymentMonitor.getReport();
                    // Send final report (if possible)
                    this.sendFinalReport(report);
                }
            });
        },
        
        savePendingData() {
            // Save form data if any
            const forms = document.querySelectorAll('form');
            forms.forEach(form => {
                const formData = new FormData(form);
                const formObj = {};
                for (const [key, value] of formData.entries()) {
                    formObj[key] = value;
                }
                
                if (Object.keys(formObj).length > 0) {
                    try {
                        sessionStorage.setItem('pending_form_' + form.id, JSON.stringify(formObj));
                    } catch (e) {
                        // Ignore storage errors
                    }
                }
            });
        },
        
        restorePendingData() {
            // Restore form data if exists
            const forms = document.querySelectorAll('form');
            forms.forEach(form => {
                const pending = sessionStorage.getItem('pending_form_' + form.id);
                if (pending) {
                    try {
                        const formObj = JSON.parse(pending);
                        Object.keys(formObj).forEach(key => {
                            const input = form.querySelector(`[name="${key}"]`);
                            if (input) {
                                input.value = formObj[key];
                            }
                        });
                        
                        // Clear saved data
                        sessionStorage.removeItem('pending_form_' + form.id);
                    } catch (e) {
                        // Ignore parse errors
                    }
                }
            });
        },
        
        sendFinalReport(report) {
            // Try to send via sendBeacon for reliability
            if (navigator.sendBeacon && typeof gtag !== 'undefined') {
                const data = JSON.stringify({
                    type: 'page_unload',
                    report: report
                });
                
                // Note: gtag doesn't support sendBeacon, but we can log it
                console.log('📊 Final report:', report);
            }
        },
        
        prepareForDeploy() {
            // Prepare site for new deployment
            this.isDeploying = true;
            
            // Save current state
            this.savePendingData();
            
            // Disable critical features temporarily
            const forms = document.querySelectorAll('form');
            forms.forEach(form => {
                const submitBtn = form.querySelector('button[type="submit"]');
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.textContent = 'Deployment hazırlanıyor...';
                }
            });
            
            console.log('🔧 Preparing for deployment...');
        },
        
        deploymentComplete() {
            // Re-enable features after deployment
            this.isDeploying = false;
            
            const forms = document.querySelectorAll('form');
            forms.forEach(form => {
                const submitBtn = form.querySelector('button[type="submit"]');
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Gönder';
                }
            });
            
            // Restore pending data
            this.restorePendingData();
            
            console.log('✅ Deployment complete, site ready');
        }
    };

    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => ZeroDowntimeDeploy.init());
    } else {
        ZeroDowntimeDeploy.init();
    }

    // Export globally
    window.ZeroDowntimeDeploy = ZeroDowntimeDeploy;
    
    console.log('✅ Zero-Downtime Deploy initialized');
})();

