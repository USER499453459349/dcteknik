/**
 * DC TEKNİK - Modern Hero Animations
 * Elektrik mavisi temalı modern animasyonlar ve etkileşimler
 */

class HeroModernAnimations {
    constructor() {
        this.init();
    }

    init() {
        this.createParticles();
        this.setupScrollAnimations();
        this.setupMouseEffects();
        this.setupCounterAnimations();
        this.setupTypewriterEffect();
        this.setupElectricEffects();
        
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log('⚡ Modern Hero Animations initialized');
        }
    }

    // Parçacık sistemi oluştur
    createParticles() {
        const particlesContainer = document.querySelector('.hero-particles');
        if (!particlesContainer) return;

        // Mevcut parçacıkları temizle
        particlesContainer.innerHTML = '';

        // 20 parçacık oluştur
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 15 + 's';
            particle.style.animationDuration = (12 + Math.random() * 8) + 's';
            particlesContainer.appendChild(particle);
        }
    }

    // Scroll animasyonları
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Animasyon yapılacak elementleri gözlemle
        const animatedElements = document.querySelectorAll('.stat-counter, .trust-item, .hero-badge');
        animatedElements.forEach(el => observer.observe(el));
    }

    // Mouse efektleri
    setupMouseEffects() {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        let mouseX = 0;
        let mouseY = 0;
        let isMouseMoving = false;

        hero.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            isMouseMoving = true;
            this.updateMouseEffects(mouseX, mouseY);
        });

        hero.addEventListener('mouseleave', () => {
            isMouseMoving = false;
            this.resetMouseEffects();
        });

        // Parallax efekti için scroll listener
        window.addEventListener('scroll', () => {
            if (isMouseMoving) {
                this.updateParallaxEffect(mouseX, mouseY);
            }
        });
    }

    updateMouseEffects(x, y) {
        const hero = document.querySelector('.hero');
        const shapes = document.querySelectorAll('.shape');
        const floatingIcons = document.querySelectorAll('.floating-icon');

        // Hero arka plan efekti
        const rect = hero.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const deltaX = (x - centerX) / rect.width;
        const deltaY = (y - centerY) / rect.height;

        // Şekilleri mouse'a göre hareket ettir
        shapes.forEach((shape, index) => {
            const speed = (index + 1) * 0.5;
            const moveX = deltaX * speed * 20;
            const moveY = deltaY * speed * 20;
            
            shape.style.transform = `translate(${moveX}px, ${moveY}px) scale(${1 + Math.abs(deltaX) * 0.1})`;
        });

        // Floating iconları mouse'a göre hareket ettir
        floatingIcons.forEach((icon, index) => {
            const speed = (index + 1) * 0.3;
            const moveX = deltaX * speed * 15;
            const moveY = deltaY * speed * 15;
            
            icon.style.transform = `translate(${moveX}px, ${moveY}px) rotate(${deltaX * 10}deg)`;
        });

        // Hero arka plan gradyanını güncelle
        const gradientX = 50 + deltaX * 20;
        const gradientY = 50 + deltaY * 20;
        hero.style.background = `
            radial-gradient(circle at ${gradientX}% ${gradientY}%, rgba(0, 191, 255, 0.15) 0%, transparent 50%),
            radial-gradient(circle at ${100 - gradientX}% ${100 - gradientY}%, rgba(0, 255, 255, 0.1) 0%, transparent 50%),
            linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)
        `;
    }

    updateParallaxEffect(x, y) {
        const scrolled = window.pageYOffset;
        const parallax = scrolled * 0.5;

        const shapes = document.querySelectorAll('.shape');
        shapes.forEach((shape, index) => {
            const speed = (index + 1) * 0.1;
            const currentTransform = shape.style.transform || '';
            const newTransform = currentTransform.replace(/translate\([^)]*\)/, '') + ` translateY(${parallax * speed}px)`;
            shape.style.transform = newTransform;
        });
    }

    resetMouseEffects() {
        const shapes = document.querySelectorAll('.shape');
        const floatingIcons = document.querySelectorAll('.floating-icon');

        shapes.forEach(shape => {
            shape.style.transform = '';
        });

        floatingIcons.forEach(icon => {
            icon.style.transform = '';
        });

        // Hero arka planını sıfırla
        const hero = document.querySelector('.hero');
        hero.style.background = '';
    }

    // Sayaç animasyonları
    setupCounterAnimations() {
        const counters = document.querySelectorAll('.counter-number');
        if (counters.length === 0) return;

        const observerOptions = {
            threshold: 0.5
        };

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }

    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000; // 2 saniye
        const increment = target / (duration / 16); // 60 FPS
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current);
        }, 16);
    }

    // Typewriter efekti
    setupTypewriterEffect() {
        const typewriterElement = document.querySelector('.typewriter-text');
        if (!typewriterElement) return;

        const text = typewriterElement.textContent;
        typewriterElement.textContent = '';
        typewriterElement.style.borderRight = '2px solid var(--electric-blue)';

        let i = 0;
        const typeSpeed = 50; // Her karakter arası ms

        const typeTimer = setInterval(() => {
            if (i < text.length) {
                typewriterElement.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(typeTimer);
                // Typewriter tamamlandıktan sonra cursor'ı gizle
                setTimeout(() => {
                    typewriterElement.style.borderRight = 'none';
                }, 1000);
            }
        }, typeSpeed);
    }

    // Elektrik efektleri
    setupElectricEffects() {
        this.createElectricBursts();
        this.setupButtonElectricEffects();
        this.setupTitleElectricEffect();
    }

    createElectricBursts() {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        // Rastgele elektrik patlamaları
        setInterval(() => {
            this.createElectricBurst();
        }, 3000 + Math.random() * 2000);
    }

    createElectricBurst() {
        const hero = document.querySelector('.hero');
        const burst = document.createElement('div');
        
        burst.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: var(--electric-blue);
            border-radius: 50%;
            pointer-events: none;
            z-index: 5;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            box-shadow: 0 0 20px var(--electric-blue);
            animation: electricBurst 0.5s ease-out forwards;
        `;

        // CSS animasyonu ekle
        if (!document.querySelector('#electric-burst-style')) {
            const style = document.createElement('style');
            style.id = 'electric-burst-style';
            style.textContent = `
                @keyframes electricBurst {
                    0% {
                        transform: scale(0);
                        opacity: 1;
                    }
                    50% {
                        transform: scale(3);
                        opacity: 0.8;
                    }
                    100% {
                        transform: scale(6);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        hero.appendChild(burst);

        // Animasyon bitince elementi kaldır
        setTimeout(() => {
            if (burst.parentNode) {
                burst.parentNode.removeChild(burst);
            }
        }, 500);
    }

    setupButtonElectricEffects() {
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                this.createButtonElectricEffect(button);
            });
        });
    }

    createButtonElectricEffect(button) {
        const rect = button.getBoundingClientRect();
        const spark = document.createElement('div');
        
        spark.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: var(--electric-blue);
            border-radius: 50%;
            pointer-events: none;
            z-index: 10;
            left: ${Math.random() * rect.width}px;
            top: ${Math.random() * rect.height}px;
            box-shadow: 0 0 10px var(--electric-blue);
            animation: buttonSpark 0.3s ease-out forwards;
        `;

        // CSS animasyonu ekle
        if (!document.querySelector('#button-spark-style')) {
            const style = document.createElement('style');
            style.id = 'button-spark-style';
            style.textContent = `
                @keyframes buttonSpark {
                    0% {
                        transform: scale(0);
                        opacity: 1;
                    }
                    100% {
                        transform: scale(2);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        button.style.position = 'relative';
        button.appendChild(spark);

        setTimeout(() => {
            if (spark.parentNode) {
                spark.parentNode.removeChild(spark);
            }
        }, 300);
    }

    setupTitleElectricEffect() {
        const title = document.querySelector('.hero-title');
        if (!title) return;

        // Title'a hover efekti
        title.addEventListener('mouseenter', () => {
            title.style.animation = 'titleElectric 0.5s ease-in-out infinite';
        });

        title.addEventListener('mouseleave', () => {
            title.style.animation = 'titleElectric 4s ease-in-out infinite';
        });
    }

    // Performans optimizasyonu
    optimizePerformance() {
        // Gereksiz animasyonları durdur
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        if (reducedMotion.matches) {
            const animatedElements = document.querySelectorAll('*');
            animatedElements.forEach(el => {
                el.style.animation = 'none';
                el.style.transition = 'none';
            });
        }

        // Intersection Observer ile lazy loading
        const lazyElements = document.querySelectorAll('[data-lazy]');
        const lazyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('loaded');
                    lazyObserver.unobserve(entry.target);
                }
            });
        });

        lazyElements.forEach(el => lazyObserver.observe(el));
    }

    // Cleanup
    destroy() {
        // Event listener'ları temizle
        window.removeEventListener('scroll', this.updateParallaxEffect);
        
        // Animasyonları durdur
        const animatedElements = document.querySelectorAll('*');
        animatedElements.forEach(el => {
            el.style.animation = 'none';
            el.style.transition = 'none';
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new HeroModernAnimations();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HeroModernAnimations;
}
