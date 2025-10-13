/* ========================================
   WELCOME ANIMATIONS - Hoş Geldin Animasyonları JavaScript
   ======================================== */

class WelcomeAnimations {
    constructor() {
        this.welcomeOverlay = null;
        this.isVisible = false;
        this.animationDuration = 4000; // 4 saniye
        this.startTime = null;
        
        this.init();
    }
    
    init() {
        this.createWelcomeOverlay();
        this.createFloatingElements();
        this.bindEvents();
        this.startWelcomeSequence();
    }
    
    createWelcomeOverlay() {
        const welcomeHTML = `
            <div class="welcome-overlay" id="welcomeOverlay">
                <div class="welcome-floating" id="welcomeFloating"></div>
                
                <div class="welcome-content">
                    <div class="welcome-logo">
                        <img src="logo-new.svg" alt="DC TEKNİK Logo">
                    </div>
                    
                    <h1 class="welcome-title">DC TEKNİK</h1>
                    <p class="welcome-subtitle">Dinamocu Serdar</p>
                    <p class="welcome-description">
                        15 yıllık deneyimimizle dinamo, alternatör ve marş motoru tamirinde 
                        İstanbul'un en güvenilir servisi. Tüm marka araçlar için profesyonel 
                        çözümler ve %100 garanti ile hizmetinizdeyiz.
                    </p>
                    
                    <div class="welcome-interactive">
                        <a href="#services" class="welcome-btn welcome-btn-primary">
                            <i class="fas fa-cog"></i>
                            Hizmetlerimiz
                        </a>
                        <a href="#contact" class="welcome-btn">
                            <i class="fas fa-phone"></i>
                            İletişim
                        </a>
                        <a href="https://wa.me/905353562469" class="welcome-btn" target="_blank">
                            <i class="fab fa-whatsapp"></i>
                            WhatsApp
                        </a>
                    </div>
                    
                    <div class="welcome-progress">
                        <div class="welcome-progress-bar"></div>
                    </div>
                    
                    <p style="color: rgba(255,255,255,0.7); font-size: 0.9rem;">
                        Otomatik olarak ana sayfaya yönlendiriliyorsunuz...
                    </p>
                </div>
                
                <button class="welcome-skip" id="welcomeSkip">Geç</button>
            </div>
        `;
        
        document.body.insertAdjacentHTML('afterbegin', welcomeHTML);
        
        this.welcomeOverlay = document.getElementById('welcomeOverlay');
        this.startTime = Date.now();
    }
    
    createFloatingElements() {
        const floatingContainer = document.getElementById('welcomeFloating');
        const elementCount = 12;
        
        for (let i = 0; i < elementCount; i++) {
            const element = document.createElement('div');
            element.className = 'floating-element';
            element.style.left = Math.random() * 100 + '%';
            element.style.animationDelay = Math.random() * 8 + 's';
            element.style.animationDuration = (Math.random() * 4 + 6) + 's';
            
            // Rastgele renk
            const colors = [
                'rgba(59, 130, 246, 0.3)',
                'rgba(139, 92, 246, 0.3)',
                'rgba(6, 182, 212, 0.3)',
                'rgba(34, 197, 94, 0.3)',
                'rgba(245, 158, 11, 0.3)'
            ];
            element.style.background = colors[Math.floor(Math.random() * colors.length)];
            
            floatingContainer.appendChild(element);
        }
    }
    
    startWelcomeSequence() {
        // Welcome overlay'i göster
        setTimeout(() => {
            this.showWelcome();
        }, 500);
        
        // Otomatik kapanma
        setTimeout(() => {
            this.hideWelcome();
        }, this.animationDuration);
    }
    
    showWelcome() {
        if (this.welcomeOverlay) {
            this.welcomeOverlay.classList.add('active');
            this.isVisible = true;
            
            // Analytics tracking
            this.trackWelcomeView();
        }
    }
    
    hideWelcome() {
        if (this.welcomeOverlay && this.isVisible) {
            this.welcomeOverlay.classList.add('hidden');
            this.isVisible = false;
            
            // Elementi kaldır
            setTimeout(() => {
                if (this.welcomeOverlay) {
                    this.welcomeOverlay.remove();
                }
                this.onWelcomeComplete();
            }, 800);
        }
    }
    
    onWelcomeComplete() {
        // Ana sayfa animasyonlarını başlat
        this.startMainPageAnimations();
        
        // Performance tracking
        this.trackPerformance();
        
        // User experience data
        this.collectUserData();
    }
    
    startMainPageAnimations() {
        // Ana sayfa elementlerini animate et
        const elementsToAnimate = [
            '.clean-hero-content',
            '.clean-stats',
            '.clean-services-preview',
            '.clean-contact'
        ];
        
        elementsToAnimate.forEach((selector, index) => {
            const element = document.querySelector(selector);
            if (element) {
                element.style.opacity = '0';
                element.style.transform = 'translateY(30px)';
                element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                
                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, index * 200);
            }
        });
        
        // Stat kartlarını animate et
        const statCards = document.querySelectorAll('.clean-stat-card');
        statCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px) scale(0.9)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0) scale(1)';
            }, 1000 + (index * 100));
        });
        
        // Service kartlarını animate et
        const serviceCards = document.querySelectorAll('.clean-service-card');
        serviceCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 1500 + (index * 150));
        });
    }
    
    trackWelcomeView() {
        // Welcome görüntüleme verilerini topla
        const welcomeData = {
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            screenSize: `${screen.width}x${screen.height}`,
            viewportSize: `${window.innerWidth}x${window.innerHeight}`,
            deviceType: this.getDeviceType(),
            connectionSpeed: this.getConnectionSpeed()
        };
        
        // Local storage'a kaydet
        try {
            const existingData = JSON.parse(localStorage.getItem('dcteknik_welcome_analytics') || '[]');
            existingData.push(welcomeData);
            
            // Son 50 kaydı tut
            if (existingData.length > 50) {
                existingData.splice(0, existingData.length - 50);
            }
            
            localStorage.setItem('dcteknik_welcome_analytics', JSON.stringify(existingData));
        } catch (error) {
            console.warn('Welcome analytics verisi kaydedilemedi:', error);
        }
    }
    
    trackPerformance() {
        // Performance metrikleri
        if (window.performance && window.performance.timing) {
            const timing = window.performance.timing;
            const loadTime = timing.loadEventEnd - timing.navigationStart;
            const domReady = timing.domContentLoadedEventEnd - timing.navigationStart;
            
            console.log(`🚀 DC TEKNİK Performance:`);
            console.log(`   - Sayfa yükleme: ${loadTime}ms`);
            console.log(`   - DOM hazır: ${domReady}ms`);
            console.log(`   - Welcome süresi: ${Date.now() - this.startTime}ms`);
        }
    }
    
    collectUserData() {
        // Kullanıcı deneyimi verileri
        const userData = {
            welcomeDuration: Date.now() - this.startTime,
            skipped: false,
            deviceInfo: {
                type: this.getDeviceType(),
                screenSize: `${screen.width}x${screen.height}`,
                viewportSize: `${window.innerWidth}x${window.innerHeight}`,
                userAgent: navigator.userAgent,
                language: navigator.language,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
            },
            performance: {
                connectionSpeed: this.getConnectionSpeed(),
                memoryUsage: this.getMemoryUsage()
            },
            timestamp: new Date().toISOString()
        };
        
        // Analytics için veri gönder
        this.sendAnalytics(userData);
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
            return {
                effectiveType: connection.effectiveType,
                downlink: connection.downlink,
                rtt: connection.rtt
            };
        }
        return null;
    }
    
    getMemoryUsage() {
        if ('memory' in performance) {
            return {
                usedJSHeapSize: performance.memory.usedJSHeapSize,
                totalJSHeapSize: performance.memory.totalJSHeapSize,
                jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
            };
        }
        return null;
    }
    
    sendAnalytics(data) {
        // Analytics verilerini gönder (örnek implementasyon)
        try {
            // Burada gerçek analytics servisine veri gönderebilirsiniz
            console.log('📊 Analytics Data:', data);
            
            // Örnek: Google Analytics 4
            if (typeof gtag !== 'undefined') {
                gtag('event', 'welcome_completed', {
                    'custom_parameter_1': data.deviceInfo.type,
                    'custom_parameter_2': data.welcomeDuration,
                    'custom_parameter_3': data.performance.connectionSpeed?.effectiveType || 'unknown'
                });
            }
        } catch (error) {
            console.warn('Analytics verisi gönderilemedi:', error);
        }
    }
    
    bindEvents() {
        // Skip butonu
        const skipButton = document.getElementById('welcomeSkip');
        if (skipButton) {
            skipButton.addEventListener('click', () => {
                this.hideWelcome();
            });
        }
        
        // Klavye kısayolları
        document.addEventListener('keydown', (e) => {
            if (this.isVisible && (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                this.hideWelcome();
            }
        });
        
        // Touch events (mobil)
        if (this.welcomeOverlay) {
            this.welcomeOverlay.addEventListener('touchstart', (e) => {
                // Çift dokunma ile geç
                if (e.touches.length === 2) {
                    this.hideWelcome();
                }
            });
        }
        
        // Welcome butonları için smooth scroll
        document.addEventListener('click', (e) => {
            if (e.target.closest('.welcome-btn[href^="#"]')) {
                e.preventDefault();
                const targetId = e.target.closest('.welcome-btn').getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // Welcome'ı kapat ve hedefe git
                    this.hideWelcome();
                    
                    setTimeout(() => {
                        targetElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }, 1000);
                }
            }
        });
    }
    
    // Public methods
    show() {
        this.showWelcome();
    }
    
    hide() {
        this.hideWelcome();
    }
    
    isWelcomeVisible() {
        return this.isVisible;
    }
    
    getWelcomeDuration() {
        return this.startTime ? Date.now() - this.startTime : 0;
    }
}

// Utility Functions
const WelcomeUtils = {
    // Check if user has seen welcome before
    hasSeenWelcome() {
        try {
            const lastSeen = localStorage.getItem('dcteknik_welcome_last_seen');
            if (!lastSeen) return false;
            
            const lastSeenDate = new Date(lastSeen);
            const now = new Date();
            const daysDiff = (now - lastSeenDate) / (1000 * 60 * 60 * 24);
            
            // 7 günden fazla geçmişse tekrar göster
            return daysDiff < 7;
        } catch (error) {
            return false;
        }
    },
    
    // Mark welcome as seen
    markWelcomeAsSeen() {
        try {
            localStorage.setItem('dcteknik_welcome_last_seen', new Date().toISOString());
        } catch (error) {
            console.warn('Welcome durumu kaydedilemedi:', error);
        }
    },
    
    // Check if user prefers reduced motion
    prefersReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    },
    
    // Get user's preferred language
    getUserLanguage() {
        return navigator.language || navigator.userLanguage || 'tr-TR';
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Check if we should show welcome
    if (!WelcomeUtils.hasSeenWelcome() && !WelcomeUtils.prefersReducedMotion()) {
        // Welcome'ı göster
        window.welcomeAnimations = new WelcomeAnimations();
        
        // Welcome tamamlandığında işaretle
        setTimeout(() => {
            WelcomeUtils.markWelcomeAsSeen();
        }, 5000);
    } else {
        // Welcome'ı atla, direkt ana sayfa animasyonlarını başlat
        setTimeout(() => {
            const welcomeAnimations = new WelcomeAnimations();
            welcomeAnimations.startMainPageAnimations();
        }, 500);
    }
});

// Export for global access
window.WelcomeAnimations = WelcomeAnimations;
window.WelcomeUtils = WelcomeUtils;
