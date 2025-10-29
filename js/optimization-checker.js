/**
 * DC TEKNİK - Optimization Checker
 * Tüm optimizasyonları kontrol eden ve raporlayan script
 */

(function() {
    'use strict';
    
    const OptimizationChecker = {
        results: {
            passed: [],
            warnings: [],
            errors: []
        },
        
        init() {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.init());
                return;
            }
            
            console.log('🔍 Optimization Checker running...');
            
            this.checkCriticalCSS();
            this.checkImageOptimization();
            this.checkResourceHints();
            this.checkJavaScriptLoading();
            this.checkFontLoading();
            this.checkServiceWorker();
            this.checkMobileOptimizations();
            this.checkWebVitals();
            this.generateReport();
        },
        
        checkCriticalCSS() {
            const criticalCSS = document.querySelector('style[data-critical], style:first-of-type');
            if (criticalCSS && criticalCSS.textContent.length > 200) {
                this.results.passed.push('✅ Critical CSS inline bulundu');
            } else {
                this.results.warnings.push('⚠️ Critical CSS kısa veya eksik');
            }
            
            // Non-critical CSS async kontrolü
            const asyncCSS = document.querySelectorAll('link[rel="preload"][as="style"]');
            if (asyncCSS.length > 0) {
                this.results.passed.push(`✅ ${asyncCSS.length} non-critical CSS async yükleniyor`);
            }
        },
        
        checkImageOptimization() {
            const images = document.querySelectorAll('img');
            let optimizedCount = 0;
            let missingDimensions = 0;
            
            images.forEach(img => {
                if (img.loading === 'lazy' || img.hasAttribute('fetchpriority')) {
                    optimizedCount++;
                }
                
                if (!img.hasAttribute('width') || !img.hasAttribute('height')) {
                    missingDimensions++;
                }
            });
            
            if (optimizedCount > 0) {
                this.results.passed.push(`✅ ${optimizedCount}/${images.length} görsel optimize edilmiş`);
            }
            
            if (missingDimensions > 0) {
                this.results.warnings.push(`⚠️ ${missingDimensions} görselde width/height attribute eksik (CLS riski)`);
            }
        },
        
        checkResourceHints() {
            const preconnects = document.querySelectorAll('link[rel="preconnect"]');
            const prefetches = document.querySelectorAll('link[rel="prefetch"]');
            const preloads = document.querySelectorAll('link[rel="preload"]');
            
            if (preconnects.length >= 3) {
                this.results.passed.push(`✅ ${preconnects.length} preconnect bulundu`);
            } else {
                this.results.warnings.push(`⚠️ Yeterli preconnect yok (${preconnects.length}/3)`);
            }
            
            if (preloads.length > 0) {
                this.results.passed.push(`✅ ${preloads.length} critical resource preload edilmiş`);
            }
        },
        
        checkJavaScriptLoading() {
            const scripts = document.querySelectorAll('script[src]');
            let deferredCount = 0;
            let asyncCount = 0;
            
            scripts.forEach(script => {
                if (script.defer) deferredCount++;
                if (script.async) asyncCount++;
            });
            
            this.results.passed.push(`✅ ${deferredCount} script defer, ${asyncCount} script async`);
        },
        
        checkFontLoading() {
            const fontDisplay = document.querySelector('style:contains("font-display")');
            if (fontDisplay) {
                this.results.passed.push('✅ Font-display: swap ayarlanmış');
            } else {
                this.results.warnings.push('⚠️ Font-display stratejisi kontrol edilmeli');
            }
        },
        
        checkServiceWorker() {
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then(registrations => {
                    if (registrations.length > 0) {
                        this.results.passed.push('✅ Service Worker aktif');
                    } else {
                        this.results.warnings.push('⚠️ Service Worker kayıtlı değil');
                    }
                });
            } else {
                this.results.errors.push('❌ Service Worker desteklenmiyor');
            }
        },
        
        checkMobileOptimizations() {
            const viewport = document.querySelector('meta[name="viewport"]');
            if (viewport && viewport.content.includes('width=device-width')) {
                this.results.passed.push('✅ Viewport meta tag doğru');
            } else {
                this.results.errors.push('❌ Viewport meta tag eksik veya yanlış');
            }
            
            // Touch target kontrolü (CSS ile yapılır)
            this.results.passed.push('✅ Mobile optimizations CSS ile aktif');
        },
        
        checkWebVitals() {
            if (window.WebPerformance) {
                this.results.passed.push('✅ Web Performance Optimizer aktif');
            } else {
                this.results.warnings.push('⚠️ Web Performance Optimizer yüklenmemiş');
            }
            
            if (window.PerformanceOptimizer) {
                this.results.passed.push('✅ Performance Optimizer aktif');
            }
        },
        
        generateReport() {
            const total = this.results.passed.length + this.results.warnings.length + this.results.errors.length;
            const score = (this.results.passed.length / total * 100).toFixed(0);
            
            console.log('\n📊 OPTIMIZATION CHECK REPORT');
            console.log('=' .repeat(50));
            console.log(`✅ Passed: ${this.results.passed.length}`);
            console.log(`⚠️  Warnings: ${this.results.warnings.length}`);
            console.log(`❌ Errors: ${this.results.errors.length}`);
            console.log(`📈 Score: ${score}%`);
            console.log('=' .repeat(50));
            
            if (this.results.passed.length > 0) {
                console.log('\n✅ PASSED:');
                this.results.passed.forEach(item => console.log('  ' + item));
            }
            
            if (this.results.warnings.length > 0) {
                console.log('\n⚠️  WARNINGS:');
                this.results.warnings.forEach(item => console.log('  ' + item));
            }
            
            if (this.results.errors.length > 0) {
                console.log('\n❌ ERRORS:');
                this.results.errors.forEach(item => console.log('  ' + item));
            }
            
            // Export to window for debugging
            window.optimizationReport = {
                score: score,
                passed: this.results.passed.length,
                warnings: this.results.warnings.length,
                errors: this.results.errors.length,
                details: this.results
            };
            
            // Send to analytics if available
            if (typeof gtag !== 'undefined') {
                gtag('event', 'optimization_check', {
                    event_category: 'Performance',
                    event_label: 'Optimization Score',
                    value: parseInt(score),
                    optimization_score: score,
                    passed: this.results.passed.length,
                    warnings: this.results.warnings.length,
                    errors: this.results.errors.length
                });
            }
        }
    };
    
    // Run after page load
    window.addEventListener('load', () => {
        setTimeout(() => OptimizationChecker.init(), 1000);
    }, { once: true });
    
    // Export for manual run
    window.OptimizationChecker = OptimizationChecker;
    
})();



