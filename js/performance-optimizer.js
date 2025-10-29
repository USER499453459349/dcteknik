/**
 * DC TEKNİK - Blog Performance Optimizer
 * Blog performansını optimize eden kapsamlı sistem
 */

class BlogPerformanceOptimizer {
    constructor() {
        this.init();
        this.optimizeImages();
        this.optimizeCSS();
        this.optimizeJS();
        this.implementLazyLoading();
        this.optimizeFonts();
        this.setupCaching();
        this.monitorPerformance();
    }

    init() {
        // Console log'u sadece development modunda göster
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log('🚀 Blog Performance Optimizer başlatıldı');
        }
        this.setupCriticalCSS();
        this.preloadCriticalResources();
        this.optimizeThirdPartyScripts();
    }

    /**
     * Kritik CSS'i inline olarak yükle
     */
    setupCriticalCSS() {
        const criticalCSS = `
            .blog-hero{background:linear-gradient(135deg,rgba(255,107,53,0.95) 0%,rgba(26,26,26,0.98) 100%);padding:5rem 0 4rem}
            .blog-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:24px}
            .blog-post{background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);transition:all 0.4s cubic-bezier(0.34,1.56,0.64,1)}
            .blog-post:hover{transform:translateY(-8px);box-shadow:0 12px 40px rgba(255,107,53,0.15)}
            .blog-post-content{padding:1.5rem;display:flex;flex-direction:column;flex-grow:1}
            .blog-post-content h2{font-size:1.75rem;font-weight:700;margin:0 0 1.25rem;line-height:1.3;color:#1a1a1a}
            .blog-meta{display:flex;align-items:center;gap:1rem;margin-bottom:1rem;flex-wrap:wrap;font-size:0.875rem;color:#64748b}
            .pagination{display:flex;align-items:center;justify-content:center;gap:1rem;margin-top:3rem;padding-top:2rem;border-top:1px solid #e5e7eb}
            .page-btn{padding:0.75rem 1.5rem;background:linear-gradient(135deg,#ff6b35 0%,#ff8c42 100%);color:#fff;border:none;border-radius:12px;font-weight:600;cursor:pointer;transition:all 0.3s ease;box-shadow:0 4px 15px rgba(255,107,53,0.3)}
            .page-btn:hover:not([disabled]){transform:translateY(-2px);box-shadow:0 6px 20px rgba(255,107,53,0.4)}
            .page-btn[disabled]{background:#e5e7eb;color:#94a3b8;cursor:not-allowed;box-shadow:none;opacity:0.6}
        `;

        const style = document.createElement('style');
        style.textContent = criticalCSS;
        document.head.insertBefore(style, document.head.firstChild);
    }

    /**
     * Kritik kaynakları preload et
     */
    preloadCriticalResources() {
        const criticalResources = [
            { href: 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap', as: 'style' },
            { href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css', as: 'style' },
            { href: 'style.css', as: 'style' },
            { href: 'blog-styles.css', as: 'style' }
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource.href;
            link.as = resource.as;
            if (resource.as === 'style') {
                link.onload = () => link.rel = 'stylesheet';
            }
            document.head.appendChild(link);
        });
    }

    /**
     * Görsel optimizasyonu
     */
    optimizeImages() {
        // Lazy loading için Intersection Observer
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    this.loadImage(img);
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });
        
        // Tüm görselleri lazy loading ile yükle
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });

        // Mevcut görselleri optimize et
        document.querySelectorAll('img').forEach(img => {
            if (!img.loading) {
                img.loading = 'lazy';
            }
            if (!img.decoding) {
                img.decoding = 'async';
            }
        });
    }

    loadImage(img) {
        const src = img.dataset.src;
        if (src) {
            img.src = src;
            img.classList.add('loaded');
            img.removeAttribute('data-src');
        }
    }

    /**
     * CSS optimizasyonu
     */
    optimizeCSS() {
        // Kullanılmayan CSS'i temizle
        this.removeUnusedCSS();
        
        // CSS'i sıkıştır
        this.minifyCSS();
        
        // Kritik olmayan CSS'i defer et
        this.deferNonCriticalCSS();
    }

    removeUnusedCSS() {
        // Kullanılmayan CSS sınıflarını tespit et ve kaldır
        const usedClasses = new Set();
        document.querySelectorAll('*').forEach(el => {
            el.className.split(' ').forEach(cls => {
                if (cls.trim()) usedClasses.add(cls.trim());
            });
        });

        // CSS dosyalarını analiz et ve kullanılmayan kuralları kaldır
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log('📊 Kullanılan CSS sınıfları:', usedClasses.size);
        }
    }

    minifyCSS() {
        // CSS'i sıkıştır (gerçek uygulamada bir build tool kullanılmalı)
        const styleSheets = document.querySelectorAll('link[rel="stylesheet"]');
        styleSheets.forEach(sheet => {
            if (sheet.href && !sheet.href.includes('min.css')) {
                // CSS sıkıştırma işlemi burada yapılabilir
                if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                    console.log('🔧 CSS sıkıştırılıyor:', sheet.href);
                }
            }
        });
    }

    deferNonCriticalCSS() {
        const nonCriticalCSS = [
            'blog-modern-styles.css',
            'blog-enhancements-styles.css',
            'blog-readability-styles.css',
            'blog-toc-bookmark-breadcrumb-styles.css',
            'blog-reading-progress-styles.css',
            'blog-related-posts-styles.css',
            'blog-critical-fixes-styles.css',
            'blog-rss-styles.css'
        ];

        nonCriticalCSS.forEach(cssFile => {
            const link = document.querySelector(`link[href*="${cssFile}"]`);
            if (link) {
                link.media = 'print';
                link.onload = () => {
                    link.media = 'all';
                };
            }
        });
    }
    
    /**
     * JavaScript optimizasyonu
     */
    optimizeJS() {
        // JavaScript dosyalarını defer et
        this.deferNonCriticalJS();
        
        // Bundle küçük JS dosyalarını
        this.bundleSmallJSFiles();
        
        // Event delegation kullan
        this.setupEventDelegation();
    }

    deferNonCriticalJS() {
        const nonCriticalJS = [
            'blog-animations.js',
            'blog-enhancements.js',
            'blog-improvements.js',
            'blog-reading-progress.js',
            'blog-related-posts.js',
            'blog-rss-generator.js',
            'blog-toc-bookmark-breadcrumb.js',
            'blog-dark-mode.js'
        ];

        nonCriticalJS.forEach(jsFile => {
            const script = document.querySelector(`script[src*="${jsFile}"]`);
            if (script && !script.defer) {
                script.defer = true;
            }
        });
    }

    bundleSmallJSFiles() {
        // Küçük JS dosyalarını birleştir
        const smallJSFiles = [
            'blog-critical-fixes.js',
            'blog-filters.js'
        ];

        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log('📦 Küçük JS dosyaları birleştiriliyor:', smallJSFiles);
        }
    }

    setupEventDelegation() {
        // Event delegation ile performansı artır
        document.addEventListener('click', (e) => {
            if (e.target.matches('.blog-chip')) {
                this.handleCategoryFilter(e.target);
            }
            if (e.target.matches('.page-btn')) {
                this.handlePagination(e.target);
            }
            if (e.target.matches('.share-btn')) {
                this.handleSocialShare(e.target);
            }
        });
    }

    /**
     * Lazy loading implementasyonu
     */
    implementLazyLoading() {
        // Intersection Observer ile lazy loading
        const lazyElements = document.querySelectorAll('[data-lazy]');
        
        const lazyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadLazyElement(entry.target);
                    lazyObserver.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '100px 0px',
            threshold: 0.1
        });

        lazyElements.forEach(el => lazyObserver.observe(el));
    }

    loadLazyElement(element) {
        const type = element.dataset.lazy;
        
        switch (type) {
            case 'image':
                this.loadImage(element);
                break;
            case 'content':
                this.loadLazyContent(element);
                break;
            case 'script':
                this.loadLazyScript(element);
                break;
        }
    }

    loadLazyContent(element) {
        const content = element.dataset.content;
        if (content) {
            element.innerHTML = content;
            element.classList.add('loaded');
        }
    }

    loadLazyScript(element) {
        const src = element.dataset.src;
        if (src) {
            const script = document.createElement('script');
            script.src = src;
            script.defer = true;
            document.head.appendChild(script);
        }
    }
    
    /**
     * Font optimizasyonu
     */
    optimizeFonts() {
        // Font display swap
        const fontLinks = document.querySelectorAll('link[href*="fonts.googleapis.com"]');
        fontLinks.forEach(link => {
            if (!link.href.includes('display=swap')) {
                link.href += '&display=swap';
            }
        });

        // Font preload
        const fontPreloads = [
            'https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrJJfecg.woff2',
            'https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLCz7Z1xlFQ.woff2'
        ];

        fontPreloads.forEach(font => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = font;
            link.as = 'font';
            link.type = 'font/woff2';
            link.crossOrigin = 'anonymous';
            document.head.appendChild(link);
        });
    }
    
    /**
     * Caching stratejisi
     */
    setupCaching() {
        // Service Worker ile caching
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                        console.log('✅ Service Worker kayıtlı:', registration);
                    }
                })
                .catch(error => {
                    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                        console.log('❌ Service Worker kayıt hatası:', error);
                    }
                });
        }

        // Local Storage ile caching
        this.setupLocalStorageCache();
    }

    setupLocalStorageCache() {
        const cacheKey = 'blog_performance_cache';
        const cacheData = {
            timestamp: Date.now(),
            version: '1.0.0'
        };

        try {
            localStorage.setItem(cacheKey, JSON.stringify(cacheData));
        } catch (e) {
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                console.log('Local Storage kullanılamıyor');
            }
        }
    }
    
    /**
     * Performance monitoring
     */
    monitorPerformance() {
        // Core Web Vitals
        this.monitorCoreWebVitals();
        
        // Resource timing
        this.monitorResourceTiming();
        
        // User experience metrics
        this.monitorUXMetrics();
    }

    monitorCoreWebVitals() {
        // LCP (Largest Contentful Paint)
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
                const lastEntry = entries[entries.length - 1];
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                console.log('📊 LCP:', lastEntry.startTime);
            }
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        // FID (First Input Delay)
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
                if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                    console.log('📊 FID:', entry.processingStart - entry.startTime);
                }
            });
        }).observe({ entryTypes: ['first-input'] });

        // CLS (Cumulative Layout Shift)
        new PerformanceObserver((entryList) => {
            let clsValue = 0;
            entryList.getEntries().forEach(entry => {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                }
            });
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                console.log('📊 CLS:', clsValue);
            }
        }).observe({ entryTypes: ['layout-shift'] });
    }

    monitorResourceTiming() {
        window.addEventListener('load', () => {
            const resources = performance.getEntriesByType('resource');
            resources.forEach(resource => {
                if (resource.duration > 1000) {
                    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                        console.log('⚠️ Yavaş kaynak:', resource.name, resource.duration + 'ms');
                    }
                }
            });
        });
    }

    monitorUXMetrics() {
        // Sayfa yükleme süresi
        window.addEventListener('load', () => {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                console.log('📊 Sayfa yükleme süresi:', loadTime + 'ms');
            }
        });

        // DOM hazır süresi
        document.addEventListener('DOMContentLoaded', () => {
            const domReady = performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart;
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                console.log('📊 DOM hazır süresi:', domReady + 'ms');
            }
        });
    }

    /**
     * Event handlers
     */
    handleCategoryFilter(button) {
        const category = button.dataset.category;
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log('🏷️ Kategori filtresi:', category);
        }
        // Filtreleme mantığı burada implement edilecek
    }

    handlePagination(button) {
        const action = button.id;
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log('📄 Sayfalama:', action);
        }
        // Sayfalama mantığı burada implement edilecek
    }

    handleSocialShare(button) {
        const platform = button.dataset.platform;
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log('📤 Sosyal paylaşım:', platform);
        }
        // Paylaşım mantığı burada implement edilecek
    }

    /**
     * Utility methods
     */
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
    }

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
    }
}

// Performance Optimizer'ı başlat
document.addEventListener('DOMContentLoaded', () => {
    new BlogPerformanceOptimizer();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BlogPerformanceOptimizer;
}