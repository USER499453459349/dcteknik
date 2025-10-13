/* ========================================
   LANDING SCREEN - Modern Giriş Ekranı JavaScript
   ======================================== */

class LandingScreen {
    constructor() {
        this.landingScreen = null;
        this.loadingProgress = null;
        this.percentageElement = null;
        this.statusElement = null;
        this.skipButton = null;
        this.progress = 0;
        this.isSkipped = false;
        this.minLoadingTime = 3000; // Minimum 3 saniye göster
        this.startTime = Date.now();
        
        this.init();
    }
    
    init() {
        this.createLandingScreen();
        this.createParticles();
        this.startLoading();
        this.bindEvents();
    }
    
    createLandingScreen() {
        // Landing screen HTML oluştur
        const landingHTML = `
            <div class="landing-screen" id="landingScreen">
                <div class="landing-background"></div>
                <div class="landing-particles" id="landingParticles"></div>
                
                <div class="landing-logo-container">
                    <div class="landing-logo">
                        <img src="logo-new.svg" alt="DC TEKNİK Logo">
                    </div>
                    <h1 class="landing-company-name">DC TEKNİK</h1>
                    <p class="landing-company-subtitle">Dinamocu Serdar</p>
                </div>
                
                <div class="landing-welcome">
                    <p class="landing-welcome-text">Premium Otomotiv Elektrik Servisi</p>
                    <p class="landing-welcome-subtext">15 yıllık deneyimimizle dinamo, alternatör ve marş motoru tamirinde İstanbul'un en güvenilir servisi</p>
                </div>
                
                <div class="landing-loading">
                    <div class="landing-loading-bar">
                        <div class="landing-loading-progress" id="loadingProgress"></div>
                    </div>
                </div>
                
                <div class="landing-percentage" id="loadingPercentage">0%</div>
                
                <div class="landing-status" id="loadingStatus">Sistem hazırlanıyor...</div>
                
                <button class="landing-skip" id="skipButton">Geç</button>
            </div>
        `;
        
        // Body'ye ekle
        document.body.insertAdjacentHTML('afterbegin', landingHTML);
        
        // Elementleri seç
        this.landingScreen = document.getElementById('landingScreen');
        this.loadingProgress = document.getElementById('loadingProgress');
        this.percentageElement = document.getElementById('loadingPercentage');
        this.statusElement = document.getElementById('loadingStatus');
        this.skipButton = document.getElementById('skipButton');
    }
    
    createParticles() {
        const particlesContainer = document.getElementById('landingParticles');
        const particleCount = 15;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 6 + 's';
            particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
            particlesContainer.appendChild(particle);
        }
    }
    
    startLoading() {
        const statusMessages = [
            'Sistem hazırlanıyor...',
            'Dinamo veritabanı yükleniyor...',
            'Alternatör bilgileri alınıyor...',
            'Marş motoru verileri hazırlanıyor...',
            'Müşteri hizmetleri aktifleştiriliyor...',
            'AI chatbot başlatılıyor...',
            'Fiyat hesaplayıcı hazırlanıyor...',
            'Galeri yükleniyor...',
            'İletişim bilgileri güncelleniyor...',
            'Son kontroller yapılıyor...',
            'Hazır!'
        ];
        
        let currentStatus = 0;
        const statusInterval = setInterval(() => {
            if (currentStatus < statusMessages.length - 1) {
                currentStatus++;
                this.updateStatus(statusMessages[currentStatus]);
            }
        }, 300);
        
        // Progress animasyonu
        const progressInterval = setInterval(() => {
            if (this.progress < 100 && !this.isSkipped) {
                this.progress += Math.random() * 15 + 5; // 5-20 arası rastgele artış
                if (this.progress > 100) this.progress = 100;
                
                this.updateProgress();
                
                // Son mesajı göster
                if (this.progress >= 100) {
                    this.updateStatus('Hazır!');
                    clearInterval(progressInterval);
                    clearInterval(statusInterval);
                    
                    // Minimum süre kontrolü
                    const elapsedTime = Date.now() - this.startTime;
                    const remainingTime = this.minLoadingTime - elapsedTime;
                    
                    if (remainingTime > 0) {
                        setTimeout(() => {
                            this.hideLandingScreen();
                        }, remainingTime);
                    } else {
                        this.hideLandingScreen();
                    }
                }
            }
        }, 100);
    }
    
    updateProgress() {
        if (this.loadingProgress && this.percentageElement) {
            this.loadingProgress.style.width = this.progress + '%';
            this.percentageElement.textContent = Math.round(this.progress) + '%';
        }
    }
    
    updateStatus(message) {
        if (this.statusElement) {
            this.statusElement.style.opacity = '0';
            setTimeout(() => {
                this.statusElement.textContent = message;
                this.statusElement.style.opacity = '1';
            }, 150);
        }
    }
    
    hideLandingScreen() {
        if (this.landingScreen) {
            this.landingScreen.classList.add('hidden');
            
            // Animasyon tamamlandıktan sonra elementi kaldır
            setTimeout(() => {
                this.landingScreen.remove();
                this.onLandingComplete();
            }, 800);
        }
    }
    
    onLandingComplete() {
        // Ana sayfa animasyonlarını başlat
        this.startMainPageAnimations();
        
        // Performance monitoring
        this.logPerformance();
        
        // User experience tracking
        this.trackUserExperience();
    }
    
    startMainPageAnimations() {
        // Ana sayfa elementlerini animate et
        const animatedElements = document.querySelectorAll('.clean-stat-card, .clean-service-card, .clean-contact-item');
        
        animatedElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
    
    logPerformance() {
        // Performance bilgilerini logla
        if (window.performance && window.performance.timing) {
            const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
            console.log(`🚀 DC TEKNİK - Sayfa yükleme süresi: ${loadTime}ms`);
        }
    }
    
    trackUserExperience() {
        // Kullanıcı deneyimi verilerini topla
        const userData = {
            landingTime: Date.now() - this.startTime,
            skipped: this.isSkipped,
            userAgent: navigator.userAgent,
            screenSize: `${screen.width}x${screen.height}`,
            timestamp: new Date().toISOString()
        };
        
        // Local storage'a kaydet (analytics için)
        try {
            const existingData = JSON.parse(localStorage.getItem('dcteknik_analytics') || '[]');
            existingData.push(userData);
            
            // Son 100 kaydı tut
            if (existingData.length > 100) {
                existingData.splice(0, existingData.length - 100);
            }
            
            localStorage.setItem('dcteknik_analytics', JSON.stringify(existingData));
        } catch (error) {
            console.warn('Analytics verisi kaydedilemedi:', error);
        }
    }
    
    bindEvents() {
        // Skip butonu
        if (this.skipButton) {
            this.skipButton.addEventListener('click', () => {
                this.isSkipped = true;
                this.hideLandingScreen();
            });
        }
        
        // Klavye kısayolları
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.isSkipped = true;
                this.hideLandingScreen();
            }
        });
        
        // Touch events (mobil)
        if (this.landingScreen) {
            this.landingScreen.addEventListener('touchstart', (e) => {
                // Çift dokunma ile geç
                if (e.touches.length === 2) {
                    this.isSkipped = true;
                    this.hideLandingScreen();
                }
            });
        }
    }
    
    // Public methods
    show() {
        if (this.landingScreen) {
            this.landingScreen.classList.remove('hidden');
        }
    }
    
    hide() {
        this.hideLandingScreen();
    }
    
    getProgress() {
        return this.progress;
    }
    
    isVisible() {
        return this.landingScreen && !this.landingScreen.classList.contains('hidden');
    }
}

// Utility Functions
const LandingUtils = {
    // Preload critical resources
    preloadResources() {
        const criticalImages = [
            'logo-new.svg',
            'favicon-new.svg'
        ];
        
        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
    },
    
    // Check if user prefers reduced motion
    prefersReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    },
    
    // Get device type
    getDeviceType() {
        const width = window.innerWidth;
        if (width < 768) return 'mobile';
        if (width < 1024) return 'tablet';
        return 'desktop';
    },
    
    // Check connection speed
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
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Preload resources
    LandingUtils.preloadResources();
    
    // Check if user prefers reduced motion
    if (LandingUtils.prefersReducedMotion()) {
        // Skip landing screen for users who prefer reduced motion
        return;
    }
    
    // Initialize landing screen
    window.landingScreen = new LandingScreen();
});

// Export for global access
window.LandingScreen = LandingScreen;
window.LandingUtils = LandingUtils;
