/* ========================================
   PERFORMANCE OPTIMIZER - Performans Optimizasyonu
   ======================================== */

class PerformanceOptimizer {
    constructor() {
        this.criticalResources = [
            'logo-new.svg',
            'favicon-new.svg',
            'clean-homepage.css',
            'advanced-features.css',
            'landing-screen.css',
            'welcome-animations.css'
        ];
        
        this.lazyImages = [];
        this.performanceMetrics = {};
        this.init();
    }
    
    init() {
        this.preloadCriticalResources();
        this.optimizeImages();
        this.setupLazyLoading();
        this.optimizeFonts();
        this.setupServiceWorker();
        this.monitorPerformance();
    }
    
    preloadCriticalResources() {
        // Critical CSS'leri preload et
        this.criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource;
            
            if (resource.endsWith('.css')) {
                link.as = 'style';
                link.onload = () => {
                    link.rel = 'stylesheet';
                };
            } else if (resource.endsWith('.svg') || resource.endsWith('.png') || resource.endsWith('.jpg')) {
                link.as = 'image';
            } else if (resource.endsWith('.js')) {
                link.as = 'script';
            }
            
            document.head.appendChild(link);
        });
    }
    
    optimizeImages() {
        // Tüm resimleri optimize et
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            // Lazy loading ekle
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
            
            // Decoding ekle
            if (!img.hasAttribute('decoding')) {
                img.setAttribute('decoding', 'async');
            }
            
            // WebP formatını kontrol et
            this.checkWebPSupport(img);
        });
    }
    
    checkWebPSupport(img) {
        // WebP desteği kontrolü
        const webpSupported = this.supportsWebP();
        if (webpSupported && img.src) {
            const webpSrc = img.src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
            const webpImg = new Image();
            webpImg.onload = () => {
                img.src = webpSrc;
            };
            webpImg.src = webpSrc;
        }
    }
    
    supportsWebP() {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }
    
    setupLazyLoading() {
        // Intersection Observer ile lazy loading
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            observer.unobserve(img);
                        }
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });
            
            // Lazy load edilecek resimleri gözlemle
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }
    
    optimizeFonts() {
        // Font display optimizasyonu
        const fontLinks = document.querySelectorAll('link[href*="fonts.googleapis.com"]');
        fontLinks.forEach(link => {
            if (!link.href.includes('display=')) {
                link.href += (link.href.includes('?') ? '&' : '?') + 'display=swap';
            }
        });
        
        // Font preload
        const fontPreload = document.createElement('link');
        fontPreload.rel = 'preload';
        fontPreload.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap';
        fontPreload.as = 'style';
        document.head.appendChild(fontPreload);
    }
    
    setupServiceWorker() {
        // Service Worker kaydı
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(registration => {
                        console.log('✅ Service Worker kaydedildi:', registration.scope);
                    })
                    .catch(error => {
                        console.log('❌ Service Worker kaydı başarısız:', error);
                    });
            });
        }
    }
    
    monitorPerformance() {
        // Performance monitoring
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.collectPerformanceMetrics();
                this.optimizeBasedOnMetrics();
            }, 1000);
        });
        
        // Core Web Vitals monitoring
        this.monitorCoreWebVitals();
    }
    
    collectPerformanceMetrics() {
        if (window.performance && window.performance.timing) {
            const timing = window.performance.timing;
            
            this.performanceMetrics = {
                // Sayfa yükleme metrikleri
                pageLoadTime: timing.loadEventEnd - timing.navigationStart,
                domReadyTime: timing.domContentLoadedEventEnd - timing.navigationStart,
                firstPaint: this.getFirstPaint(),
                firstContentfulPaint: this.getFirstContentfulPaint(),
                
                // Network metrikleri
                dnsTime: timing.domainLookupEnd - timing.domainLookupStart,
                connectTime: timing.connectEnd - timing.connectStart,
                requestTime: timing.responseEnd - timing.requestStart,
                
                // Render metrikleri
                renderTime: timing.domComplete - timing.domLoading,
                parseTime: timing.domInteractive - timing.domLoading
            };
            
            console.log('📊 Performance Metrics:', this.performanceMetrics);
        }
    }
    
    getFirstPaint() {
        const paintEntries = performance.getEntriesByType('paint');
        const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
        return firstPaint ? firstPaint.startTime : null;
    }
    
    getFirstContentfulPaint() {
        const paintEntries = performance.getEntriesByType('paint');
        const firstContentfulPaint = paintEntries.find(entry => entry.name === 'first-contentful-paint');
        return firstContentfulPaint ? firstContentfulPaint.startTime : null;
    }
    
    monitorCoreWebVitals() {
        // Largest Contentful Paint (LCP)
        if ('PerformanceObserver' in window) {
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                console.log('🎯 LCP:', lastEntry.startTime);
            });
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
            
            // First Input Delay (FID)
            const fidObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    console.log('⚡ FID:', entry.processingStart - entry.startTime);
                });
            });
            fidObserver.observe({ entryTypes: ['first-input'] });
            
            // Cumulative Layout Shift (CLS)
            let clsValue = 0;
            const clsObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                });
                console.log('📐 CLS:', clsValue);
            });
            clsObserver.observe({ entryTypes: ['layout-shift'] });
        }
    }
    
    optimizeBasedOnMetrics() {
        // Performance metriklerine göre optimizasyon
        if (this.performanceMetrics.pageLoadTime > 3000) {
            console.log('⚠️ Sayfa yükleme süresi yavaş, optimizasyon yapılıyor...');
            this.aggressiveOptimization();
        }
        
        if (this.performanceMetrics.firstContentfulPaint > 1500) {
            console.log('⚠️ First Contentful Paint yavaş, CSS optimizasyonu yapılıyor...');
            this.optimizeCSS();
        }
    }
    
    aggressiveOptimization() {
        // Agresif optimizasyon
        // Gereksiz animasyonları devre dışı bırak
        const slowDevices = this.isSlowDevice();
        if (slowDevices) {
            document.body.classList.add('reduced-motion');
        }
        
        // Lazy loading threshold'unu artır
        this.updateLazyLoadingThreshold();
    }
    
    isSlowDevice() {
        // Yavaş cihaz tespiti
        const connection = navigator.connection;
        if (connection) {
            return connection.effectiveType === 'slow-2g' || 
                   connection.effectiveType === '2g' ||
                   connection.downlink < 1;
        }
        
        // Memory kullanımına göre
        if (navigator.deviceMemory && navigator.deviceMemory < 2) {
            return true;
        }
        
        // CPU core sayısına göre
        if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
            return true;
        }
        
        return false;
    }
    
    updateLazyLoadingThreshold() {
        // Lazy loading threshold'unu güncelle
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.style.contentVisibility = 'auto';
            img.style.containIntrinsicSize = '300px 200px';
        });
    }
    
    optimizeCSS() {
        // Critical CSS inline et
        const criticalCSS = this.extractCriticalCSS();
        if (criticalCSS) {
            const style = document.createElement('style');
            style.textContent = criticalCSS;
            document.head.insertBefore(style, document.head.firstChild);
        }
    }
    
    extractCriticalCSS() {
        // Critical CSS çıkarımı (basit implementasyon)
        return `
            .header { position: fixed; top: 0; left: 0; right: 0; z-index: 1000; }
            .clean-hero { min-height: 100vh; display: flex; align-items: center; }
            .clean-hero-content { text-align: center; }
            .clean-stats { display: flex; justify-content: center; gap: 2rem; }
            .clean-service-card { background: white; border-radius: 8px; padding: 1.5rem; }
        `;
    }
    
    // Public methods
    getPerformanceMetrics() {
        return this.performanceMetrics;
    }
    
    optimizeForDevice() {
        const deviceType = this.getDeviceType();
        const connectionSpeed = this.getConnectionSpeed();
        
        if (deviceType === 'mobile' || connectionSpeed === 'slow') {
            this.aggressiveOptimization();
        }
    }
    
    getDeviceType() {
        const width = window.innerWidth;
        if (width < 768) return 'mobile';
        if (width < 1024) return 'tablet';
        return 'desktop';
    }
    
    getConnectionSpeed() {
        if ('connection' in navigator) {
            const connection = navigator.connection;
            if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
                return 'slow';
            } else if (connection.effectiveType === '3g') {
                return 'medium';
            } else {
                return 'fast';
            }
        }
        return 'unknown';
    }
}

// Utility Functions
const PerformanceUtils = {
    // Debounce function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Throttle function
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    // Check if element is in viewport
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },
    
    // Preload resource
    preloadResource(href, as = 'script') {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = href;
        link.as = as;
        document.head.appendChild(link);
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.performanceOptimizer = new PerformanceOptimizer();
});

// Export for global access
window.PerformanceOptimizer = PerformanceOptimizer;
window.PerformanceUtils = PerformanceUtils;
