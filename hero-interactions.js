// Hero Section Interactions for DC TEKNİK
// Advanced hero section functionality

class HeroInteractions {
    constructor() {
        this.hero = document.querySelector('.hero');
        this.heroContent = document.querySelector('.hero-content');
        this.heroVisual = document.querySelector('.hero-visual');
        this.particles = document.querySelector('.hero-particles');
        this.statsCards = document.querySelectorAll('.stat-card');
        this.featureItems = document.querySelectorAll('.feature-item');
        this.buttons = document.querySelectorAll('.hero-buttons .btn');
        
        this.init();
    }

    init() {
        this.setupParallaxEffect();
        this.setupParticleAnimation();
        this.setupStatsCounter();
        this.setupButtonInteractions();
        this.setupScrollEffects();
        this.setupMouseTracking();
        this.setupTypingEffect();
        this.setupGlowEffects();
        
        console.log('🚀 Hero Interactions initialized');
    }

    setupParallaxEffect() {
        if (!this.hero) return;

        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            if (this.particles) {
                this.particles.style.transform = `translateY(${rate}px)`;
            }
            
            if (this.heroContent) {
                this.heroContent.style.transform = `translateY(${rate * 0.3}px)`;
            }
            
            if (this.heroVisual) {
                this.heroVisual.style.transform = `translateY(${rate * 0.2}px)`;
            }
        });
    }

    setupParticleAnimation() {
        if (!this.particles) return;

        // Create dynamic particles
        const particleCount = 50;
        for (let i = 0; i < particleCount; i++) {
            this.createParticle();
        }

        // Animate particles
        setInterval(() => {
            this.animateParticles();
        }, 100);
    }

    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'dynamic-particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 1}px;
            height: ${Math.random() * 4 + 1}px;
            background: rgba(59, 130, 246, ${Math.random() * 0.5 + 0.2});
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: particleFloat ${Math.random() * 10 + 5}s linear infinite;
        `;
        
        this.particles.appendChild(particle);
    }

    animateParticles() {
        const particles = document.querySelectorAll('.dynamic-particle');
        particles.forEach(particle => {
            const currentTop = parseFloat(particle.style.top);
            const newTop = currentTop > 100 ? -10 : currentTop + 0.5;
            particle.style.top = newTop + '%';
        });
    }

    setupStatsCounter() {
        if (!this.statsCards.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateStatCard(entry.target);
                }
            });
        }, { threshold: 0.5 });

        this.statsCards.forEach(card => {
            observer.observe(card);
        });
    }

    animateStatCard(card) {
        const numberElement = card.querySelector('h3');
        if (!numberElement) return;

        const finalNumber = parseInt(numberElement.textContent);
        const duration = 2000;
        const increment = finalNumber / (duration / 16);
        let currentNumber = 0;

        const counter = setInterval(() => {
            currentNumber += increment;
            if (currentNumber >= finalNumber) {
                currentNumber = finalNumber;
                clearInterval(counter);
            }
            numberElement.textContent = Math.floor(currentNumber) + (finalNumber > 100 ? '+' : '');
        }, 16);

        // Add glow effect
        card.style.boxShadow = '0 0 30px rgba(59, 130, 246, 0.5)';
        setTimeout(() => {
            card.style.boxShadow = '';
        }, duration);
    }

    setupButtonInteractions() {
        this.buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                this.createButtonRipple(button);
            });

            button.addEventListener('click', (e) => {
                this.createClickEffect(e, button);
            });
        });
    }

    createButtonRipple(button) {
        const ripple = document.createElement('div');
        ripple.className = 'button-ripple';
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;

        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (rect.width / 2 - size / 2) + 'px';
        ripple.style.top = (rect.height / 2 - size / 2) + 'px';

        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    createClickEffect(e, button) {
        const clickEffect = document.createElement('div');
        clickEffect.className = 'click-effect';
        clickEffect.style.cssText = `
            position: absolute;
            width: 20px;
            height: 20px;
            background: rgba(255, 255, 255, 0.8);
            border-radius: 50%;
            left: ${e.offsetX - 10}px;
            top: ${e.offsetY - 10}px;
            animation: clickPulse 0.5s ease-out;
            pointer-events: none;
        `;

        button.appendChild(clickEffect);
        setTimeout(() => {
            clickEffect.remove();
        }, 500);
    }

    setupScrollEffects() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateOnScroll(entry.target);
                }
            });
        }, { threshold: 0.1 });

        this.featureItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.2}s`;
            observer.observe(item);
        });
    }

    animateOnScroll(element) {
        element.style.animationPlayState = 'running';
        element.classList.add('animate-in');
    }

    setupMouseTracking() {
        if (!this.hero) return;

        this.hero.addEventListener('mousemove', (e) => {
            const rect = this.hero.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;

            this.updateMouseTracking(x, y);
        });

        this.hero.addEventListener('mouseleave', () => {
            this.resetMouseTracking();
        });
    }

    updateMouseTracking(x, y) {
        const moveX = (x - 0.5) * 20;
        const moveY = (y - 0.5) * 20;

        if (this.heroContent) {
            this.heroContent.style.transform = `translate(${moveX}px, ${moveY}px)`;
        }

        if (this.heroVisual) {
            this.heroVisual.style.transform = `translate(${-moveX}px, ${-moveY}px)`;
        }

        // Update gradient position
        const gradient = document.querySelector('.hero-gradient');
        if (gradient) {
            gradient.style.background = `
                radial-gradient(circle at ${x * 100}% ${y * 100}%, 
                rgba(59, 130, 246, 0.3) 0%, 
                transparent 50%),
                radial-gradient(circle at ${(1-x) * 100}% ${(1-y) * 100}%, 
                rgba(234, 88, 12, 0.3) 0%, 
                transparent 50%)
            `;
        }
    }

    resetMouseTracking() {
        if (this.heroContent) {
            this.heroContent.style.transform = '';
        }

        if (this.heroVisual) {
            this.heroVisual.style.transform = '';
        }
    }

    setupTypingEffect() {
        const title = document.querySelector('.hero h1');
        if (!title) return;

        const text = title.textContent;
        title.textContent = '';
        title.style.borderRight = '2px solid #3b82f6';

        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                title.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            } else {
                setTimeout(() => {
                    title.style.borderRight = 'none';
                }, 1000);
            }
        };

        // Start typing effect after a delay
        setTimeout(typeWriter, 1000);
    }

    setupGlowEffects() {
        const glowElements = document.querySelectorAll('.hero-badge, .stat-card, .hero-floating-card');
        
        glowElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.addGlowEffect(element);
            });

            element.addEventListener('mouseleave', () => {
                this.removeGlowEffect(element);
            });
        });
    }

    addGlowEffect(element) {
        element.style.boxShadow = '0 0 30px rgba(59, 130, 246, 0.6)';
        element.style.transform = 'scale(1.05)';
    }

    removeGlowEffect(element) {
        element.style.boxShadow = '';
        element.style.transform = '';
    }

    // Public methods
    refreshAnimations() {
        this.setupStatsCounter();
        this.setupScrollEffects();
    }

    addCustomParticle(x, y, color = '#3b82f6') {
        if (!this.particles) return;

        const particle = document.createElement('div');
        particle.className = 'custom-particle';
        particle.style.cssText = `
            position: absolute;
            width: 6px;
            height: 6px;
            background: ${color};
            border-radius: 50%;
            left: ${x}px;
            top: ${y}px;
            animation: customParticleFloat 2s ease-out forwards;
            pointer-events: none;
        `;

        this.particles.appendChild(particle);

        setTimeout(() => {
            particle.remove();
        }, 2000);
    }
}

// CSS Animations
const style = document.createElement('style');
style.textContent = `
    @keyframes particleFloat {
        0% {
            transform: translateY(0px) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }

    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }

    @keyframes clickPulse {
        0% {
            transform: scale(0);
            opacity: 1;
        }
        100% {
            transform: scale(3);
            opacity: 0;
        }
    }

    @keyframes customParticleFloat {
        0% {
            transform: translateY(0px) scale(1);
            opacity: 1;
        }
        100% {
            transform: translateY(-50px) scale(0);
            opacity: 0;
        }
    }

    .animate-in {
        animation: slideInUp 0.8s ease-out forwards;
    }

    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.heroInteractions = new HeroInteractions();
});

// Export for use
window.HeroInteractions = HeroInteractions;
