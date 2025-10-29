/**
 * DC TEKNİK - Mobile Widget Optimizer
 * Mobil cihazlarda widget görünürlük ve performans optimizasyonu
 */

class MobileWidgetOptimizer {
    constructor() {
        this.isMobile = this.detectMobile();
        this.isTouchDevice = this.detectTouchDevice();
        this.screenSize = this.getScreenSize();
        this.connectionType = this.getConnectionType();
        
        if (this.isMobile) {
            this.init();
        }
    }

    init() {
        this.optimizeFloatingWidgets();
        this.setupMobileGestures();
        this.optimizeTouchTargets();
        this.setupScrollOptimizations();
        this.monitorPerformance();
        
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log('📱 Mobile Widget Optimizer initialized');
        }
    }

    // Mobil cihaz tespiti
    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    // Touch cihaz tespiti
    detectTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }

    // Ekran boyutu tespiti
    getScreenSize() {
        return {
            width: window.innerWidth,
            height: window.innerHeight,
            ratio: window.devicePixelRatio || 1
        };
    }

    // Bağlantı türü tespiti
    getConnectionType() {
        if ('connection' in navigator) {
            return navigator.connection.effectiveType || 'unknown';
        }
        return 'unknown';
    }

    // Floating widget'ları optimize et
    optimizeFloatingWidgets() {
        const floatingWidgets = document.querySelectorAll('.dc-floating, [class*="floating"]');
        
        floatingWidgets.forEach(widget => {
            this.optimizeWidget(widget);
            this.setupWidgetInteractions(widget);
        });

        // Yeni eklenen widget'ları izle
        this.observeNewWidgets();
    }

    // Widget optimizasyonu
    optimizeWidget(widget) {
        // Z-index ayarla
        widget.style.zIndex = '10000';
        
        // Pozisyonu ekran boyutuna göre ayarla
        this.adjustWidgetPosition(widget);
        
        // Touch target boyutunu kontrol et
        this.optimizeTouchTargets(widget);
        
        // Görünürlük ayarları
        widget.style.opacity = '1';
        widget.style.visibility = 'visible';
        widget.style.display = 'flex';
        
        // Performans optimizasyonu
        widget.style.willChange = 'transform, opacity';
        widget.style.transform = 'translateZ(0)';
    }

    // Widget pozisyonunu ayarla
    adjustWidgetPosition(widget) {
        const screenWidth = this.screenSize.width;
        
        if (screenWidth <= 360) {
            widget.style.right = '10px';
            widget.style.bottom = '10px';
            widget.style.gap = '8px';
        } else if (screenWidth <= 480) {
            widget.style.right = '12px';
            widget.style.bottom = '12px';
            widget.style.gap = '10px';
        } else if (screenWidth <= 768) {
            widget.style.right = '16px';
            widget.style.bottom = '16px';
            widget.style.gap = '12px';
        }
    }

    // Touch target'ları optimize et
    optimizeTouchTargets(widget) {
        const interactiveElements = widget.querySelectorAll('button, a, [role="button"], [tabindex]');
        
        interactiveElements.forEach(element => {
            // Minimum 44x44px touch target
            element.style.minWidth = '44px';
            element.style.minHeight = '44px';
            
            // Touch optimizasyonu
            element.style.touchAction = 'manipulation';
            element.style.webkitTapHighlightColor = 'transparent';
            
            // Font boyutu kontrolü
            const computedStyle = window.getComputedStyle(element);
            const fontSize = parseFloat(computedStyle.fontSize);
            if (fontSize < 14) {
                element.style.fontSize = '14px';
            }
        });
    }

    // Widget etkileşimlerini ayarla
    setupWidgetInteractions(widget) {
        // Touch event'leri
        this.setupTouchEvents(widget);
        
        // Scroll davranışı
        this.setupScrollBehavior(widget);
        
        // Hover efektleri (mobilde devre dışı)
        this.disableHoverEffects(widget);
    }

    // Touch event'leri ayarla
    setupTouchEvents(widget) {
        let touchStartY = 0;
        let touchStartX = 0;
        let touchStartTime = 0;
        
        widget.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
            touchStartX = e.touches[0].clientX;
            touchStartTime = Date.now();
            
            // Visual feedback
            widget.style.transform = 'scale(0.95)';
        }, { passive: true });
        
        widget.addEventListener('touchend', (e) => {
            const touchEndY = e.changedTouches[0].clientY;
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndTime = Date.now();
            
            const deltaY = touchStartY - touchEndY;
            const deltaX = touchStartX - touchEndX;
            const deltaTime = touchEndTime - touchStartTime;
            
            // Reset visual feedback
            widget.style.transform = 'scale(1)';
            
            // Swipe gesture kontrolü
            if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 50 && deltaTime < 300) {
                if (deltaY > 0) {
                    // Yukarı swipe - widget'ı gizle
                    this.hideWidget(widget);
                } else {
                    // Aşağı swipe - widget'ı göster
                    this.showWidget(widget);
                }
            }
        }, { passive: true });
        
        // Long press için
        let longPressTimer;
        widget.addEventListener('touchstart', (e) => {
            longPressTimer = setTimeout(() => {
                this.handleLongPress(widget, e);
            }, 500);
        }, { passive: true });
        
        widget.addEventListener('touchend', () => {
            clearTimeout(longPressTimer);
        }, { passive: true });
        
        widget.addEventListener('touchmove', () => {
            clearTimeout(longPressTimer);
        }, { passive: true });
    }

    // Scroll davranışını ayarla
    setupScrollBehavior(widget) {
        let lastScrollTop = 0;
        let ticking = false;
        let isHidden = false;
        
        const updateWidgetOnScroll = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const isScrollingDown = scrollTop > lastScrollTop;
            const scrollDelta = Math.abs(scrollTop - lastScrollTop);
            
            // Sadece önemli scroll değişikliklerinde güncelle
            if (scrollDelta > 10) {
                if (isScrollingDown && scrollTop > 100 && !isHidden) {
                    this.hideWidget(widget);
                    isHidden = true;
                } else if (!isScrollingDown && isHidden) {
                    this.showWidget(widget);
                    isHidden = false;
                }
            }
            
            lastScrollTop = scrollTop;
            ticking = false;
        };
        
        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateWidgetOnScroll);
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', requestTick, { passive: true });
    }

    // Widget'ı gizle
    hideWidget(widget) {
        widget.style.transform = 'translateY(100px)';
        widget.style.opacity = '0.7';
        widget.setAttribute('data-hidden', 'true');
    }

    // Widget'ı göster
    showWidget(widget) {
        widget.style.transform = 'translateY(0)';
        widget.style.opacity = '1';
        widget.removeAttribute('data-hidden');
    }

    // Long press handler
    handleLongPress(widget, event) {
        // Haptic feedback (destekleniyorsa)
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
        
        // Widget'ı geçici olarak büyüt
        widget.style.transform = 'scale(1.1)';
        setTimeout(() => {
            widget.style.transform = 'scale(1)';
        }, 200);
    }

    // Hover efektlerini devre dışı bırak
    disableHoverEffects(widget) {
        const hoverElements = widget.querySelectorAll('*');
        hoverElements.forEach(element => {
            element.addEventListener('touchstart', () => {
                element.classList.add('no-hover');
            });
            
            element.addEventListener('touchend', () => {
                setTimeout(() => {
                    element.classList.remove('no-hover');
                }, 300);
            });
        });
    }

    // Yeni widget'ları izle
    observeNewWidgets() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // Element node
                        if (node.classList.contains('dc-floating') || 
                            node.querySelector('.dc-floating')) {
                            this.optimizeFloatingWidgets();
                        }
                    }
                });
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Mobil jestleri ayarla
    setupMobileGestures() {
        // Swipe gestures
        this.setupSwipeGestures();
        
        // Pinch gestures
        this.setupPinchGestures();
    }

    // Swipe jestleri
    setupSwipeGestures() {
        let startX, startY, endX, endY;
        
        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }, { passive: true });
        
        document.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;
            
            const deltaX = endX - startX;
            const deltaY = endY - startY;
            
            // Horizontal swipe
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                if (deltaX > 0) {
                    this.handleSwipeRight();
                } else {
                    this.handleSwipeLeft();
                }
            }
        }, { passive: true });
    }

    // Pinch jestleri
    setupPinchGestures() {
        let initialDistance = 0;
        
        document.addEventListener('touchstart', (e) => {
            if (e.touches.length === 2) {
                const touch1 = e.touches[0];
                const touch2 = e.touches[1];
                initialDistance = Math.sqrt(
                    Math.pow(touch2.clientX - touch1.clientX, 2) +
                    Math.pow(touch2.clientY - touch1.clientY, 2)
                );
            }
        }, { passive: true });
        
        document.addEventListener('touchmove', (e) => {
            if (e.touches.length === 2) {
                const touch1 = e.touches[0];
                const touch2 = e.touches[1];
                const currentDistance = Math.sqrt(
                    Math.pow(touch2.clientX - touch1.clientX, 2) +
                    Math.pow(touch2.clientY - touch1.clientY, 2)
                );
                
                const scale = currentDistance / initialDistance;
                
                if (scale > 1.2) {
                    this.handlePinchOut();
                } else if (scale < 0.8) {
                    this.handlePinchIn();
                }
            }
        }, { passive: true });
    }

    // Swipe handlers
    handleSwipeRight() {
        // Sağa swipe - widget'ları göster
        const widgets = document.querySelectorAll('.dc-floating');
        widgets.forEach(widget => this.showWidget(widget));
    }

    handleSwipeLeft() {
        // Sola swipe - widget'ları gizle
        const widgets = document.querySelectorAll('.dc-floating');
        widgets.forEach(widget => this.hideWidget(widget));
    }

    // Pinch handlers
    handlePinchOut() {
        // Pinch out - widget'ları büyüt
        const widgets = document.querySelectorAll('.dc-floating');
        widgets.forEach(widget => {
            widget.style.transform = 'scale(1.1)';
            setTimeout(() => {
                widget.style.transform = 'scale(1)';
            }, 300);
        });
    }

    handlePinchIn() {
        // Pinch in - widget'ları küçült
        const widgets = document.querySelectorAll('.dc-floating');
        widgets.forEach(widget => {
            widget.style.transform = 'scale(0.9)';
            setTimeout(() => {
                widget.style.transform = 'scale(1)';
            }, 300);
        });
    }

    // Performans izleme
    monitorPerformance() {
        // Memory kullanımı
        if ('memory' in performance) {
            setInterval(() => {
                const memory = performance.memory;
                const usedMemory = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
                
                if (usedMemory > 0.8) {
                    this.optimizeForHighMemoryUsage();
                }
            }, 30000); // 30 saniyede bir kontrol et
        }
        
        // Network durumu
        if ('connection' in navigator) {
            const connection = navigator.connection;
            
            connection.addEventListener('change', () => {
                if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
                    this.optimizeForSlowConnection();
                }
            });
        }
    }

    // Yavaş bağlantı optimizasyonu
    optimizeForSlowConnection() {
        // Widget animasyonlarını devre dışı bırak
        const widgets = document.querySelectorAll('.dc-floating');
        widgets.forEach(widget => {
            widget.style.transition = 'none';
        });
        
        // Lazy loading'i daha agresif yap
        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => {
            img.loading = 'lazy';
            img.decoding = 'async';
        });
    }

    // Yüksek memory kullanımı optimizasyonu
    optimizeForHighMemoryUsage() {
        // Gereksiz event listener'ları temizle
        const oldWidgets = document.querySelectorAll('[data-mobile-optimized]');
        oldWidgets.forEach(widget => {
            widget.removeAttribute('data-mobile-optimized');
        });
        
        // Gereksiz DOM elementlerini temizle
        const unusedElements = document.querySelectorAll('.unused, .hidden');
        unusedElements.forEach(el => {
            if (el.offsetParent === null) {
                el.remove();
            }
        });
    }
}

// CSS ekle
const mobileWidgetCSS = `
    .dc-floating.no-hover *:hover {
        transform: none !important;
        box-shadow: none !important;
    }
    
    .dc-floating[data-hidden="true"] {
        pointer-events: none;
    }
    
    @media (max-width: 768px) {
        .dc-floating {
            transition: transform 0.3s ease, opacity 0.3s ease;
        }
        
        .dc-floating * {
            -webkit-tap-highlight-color: transparent;
            touch-action: manipulation;
        }
    }
`;

// CSS'i ekle
const style = document.createElement('style');
style.textContent = mobileWidgetCSS;
document.head.appendChild(style);

// Mobile Widget Optimizer'ı başlat
document.addEventListener('DOMContentLoaded', () => {
    new MobileWidgetOptimizer();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MobileWidgetOptimizer;
}
