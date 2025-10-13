// ========================================
// DC TEKNİK - Modern Effects & Interactions
// Version: v2.0.0 - ULTIMATE ENHANCEMENT
// ========================================

class ModernEffects {
    constructor() {
        this.init();
    }

    init() {
        this.createScrollProgress();
        this.createFloatingParticles();
        this.createMagneticButtons();
        this.createFloatingActionButtons();
        this.createLoadingAnimation();
        this.createTextReveal();
        this.createMorphingShapes();
        this.createInteractiveCursor();
        this.create3DCards();
        this.createParallaxEffects();
    }

    // Scroll Progress Bar
    createScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            progressBar.style.width = scrollPercent + '%';
        });
    }

    // Floating Particles
    createFloatingParticles() {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles-container';
        hero.appendChild(particlesContainer);

        // Create particles
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 15 + 's';
            particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
            particlesContainer.appendChild(particle);
        }
    }

    // Magnetic Button Effect
    createMagneticButtons() {
        const magneticButtons = document.querySelectorAll('.magnetic-btn, .btn');
        
        magneticButtons.forEach(button => {
            button.addEventListener('mousemove', (e) => {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                button.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
            });

            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translate(0, 0)';
            });
        });
    }

    // Floating Action Buttons
    createFloatingActionButtons() {
        const fabContainer = document.createElement('div');
        fabContainer.className = 'fab-container';

        // WhatsApp FAB
        const whatsappFab = document.createElement('button');
        whatsappFab.className = 'fab whatsapp';
        whatsappFab.innerHTML = '<i class="fab fa-whatsapp"></i>';
        whatsappFab.title = 'WhatsApp ile İletişim';
        whatsappFab.addEventListener('click', () => {
            window.open('https://wa.me/905353562469?text=Merhaba! Web sitenizden geliyorum.', '_blank');
        });

        // Phone FAB
        const phoneFab = document.createElement('button');
        phoneFab.className = 'fab phone';
        phoneFab.innerHTML = '<i class="fas fa-phone"></i>';
        phoneFab.title = 'Hemen Ara';
        phoneFab.addEventListener('click', () => {
            window.location.href = 'tel:+905353562469';
        });

        // Location FAB
        const locationFab = document.createElement('button');
        locationFab.className = 'fab location';
        locationFab.innerHTML = '<i class="fas fa-map-marker-alt"></i>';
        locationFab.title = 'Konumu Gör';
        locationFab.addEventListener('click', () => {
            window.open('https://www.google.com/maps/dir//Atatürk+Cad.+No:312,+34900+Sultanbeyli/İstanbul', '_blank');
        });

        fabContainer.appendChild(whatsappFab);
        fabContainer.appendChild(phoneFab);
        fabContainer.appendChild(locationFab);
        document.body.appendChild(fabContainer);
    }

    // Loading Animation
    createLoadingAnimation() {
        const loadingOverlay = document.createElement('div');
        loadingOverlay.className = 'loading-overlay';
        
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        
        const text = document.createElement('div');
        text.className = 'loading-text';
        text.textContent = 'DC TEKNİK Yükleniyor...';
        
        loadingOverlay.appendChild(spinner);
        loadingOverlay.appendChild(text);
        document.body.appendChild(loadingOverlay);

        // Hide loading after page load
        window.addEventListener('load', () => {
            setTimeout(() => {
                loadingOverlay.classList.add('hidden');
                setTimeout(() => {
                    loadingOverlay.remove();
                }, 500);
            }, 1000);
        });
    }

    // Text Reveal Animation
    createTextReveal() {
        const textElements = document.querySelectorAll('h1, h2, h3, .hero p');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('text-reveal');
                    setTimeout(() => {
                        entry.target.classList.remove('text-reveal');
                    }, 2000);
                }
            });
        }, { threshold: 0.5 });

        textElements.forEach(el => observer.observe(el));
    }

    // Morphing Shapes
    createMorphingShapes() {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        for (let i = 0; i < 3; i++) {
            const shape = document.createElement('div');
            shape.className = 'morphing-shape';
            hero.appendChild(shape);
        }
    }

    // Interactive Cursor
    createInteractiveCursor() {
        const cursor = document.createElement('div');
        cursor.className = 'cursor-trail';
        document.body.appendChild(cursor);

        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animateCursor() {
            cursorX += (mouseX - cursorX) * 0.1;
            cursorY += (mouseY - cursorY) * 0.1;
            
            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';
            
            requestAnimationFrame(animateCursor);
        }
        animateCursor();
    }

    // 3D Card Effects
    create3DCards() {
        const cards = document.querySelectorAll('.service-card, .product-card, .gallery-item');
        
        cards.forEach(card => {
            card.classList.add('card-3d');
            
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
            });
        });
    }

    // Parallax Effects
    createParallaxEffects() {
        const parallaxElements = document.querySelectorAll('.hero, .section');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach((element, index) => {
                const speed = 0.5 + (index * 0.1);
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        });
    }

    // Utility Methods
    static createRippleEffect(element, event) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    static addRippleToButtons() {
        const buttons = document.querySelectorAll('.btn, .fab');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                ModernEffects.createRippleEffect(button, e);
            });
        });
    }
}

// Enhanced Scroll Animations
class ScrollAnimations {
    constructor() {
        this.init();
    }

    init() {
        this.createFadeInAnimations();
        this.createSlideInAnimations();
        this.createScaleAnimations();
    }

    createFadeInAnimations() {
        const elements = document.querySelectorAll('.service-card, .product-card, .gallery-item, .contact-detail');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        elements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    createSlideInAnimations() {
        const sections = document.querySelectorAll('section');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('slide-in');
                }
            });
        }, { threshold: 0.2 });

        sections.forEach(section => {
            observer.observe(section);
        });
    }

    createScaleAnimations() {
        const images = document.querySelectorAll('img');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.transform = 'scale(1)';
                }
            });
        }, { threshold: 0.5 });

        images.forEach(img => {
            img.style.transform = 'scale(0.8)';
            img.style.transition = 'transform 0.8s ease';
            observer.observe(img);
        });
    }
}

// Performance Optimizations
class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        this.optimizeImages();
        this.lazyLoadContent();
        this.preloadCriticalResources();
    }

    optimizeImages() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.loading = 'lazy';
            img.decoding = 'async';
        });
    }

    lazyLoadContent() {
        const lazyElements = document.querySelectorAll('[data-lazy]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    element.src = element.dataset.lazy;
                    element.classList.remove('lazy');
                    observer.unobserve(element);
                }
            });
        });

        lazyElements.forEach(el => observer.observe(el));
    }

    preloadCriticalResources() {
        const criticalResources = [
            '/style.css',
            '/script.js',
            '/logo-new.svg'
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource;
            link.as = resource.endsWith('.css') ? 'style' : resource.endsWith('.js') ? 'script' : 'image';
            document.head.appendChild(link);
        });
    }
}

// Initialize all effects when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize modern effects
    new ModernEffects();
    
    // Initialize scroll animations
    new ScrollAnimations();
    
    // Initialize performance optimizations
    new PerformanceOptimizer();
    
    // Add ripple effects to buttons
    ModernEffects.addRippleToButtons();
    
    // Add CSS for ripple effect
    const rippleCSS = `
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .slide-in {
            animation: slideInFromBottom 0.8s ease-out;
        }
        
        @keyframes slideInFromBottom {
            from {
                opacity: 0;
                transform: translateY(50px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    
    const style = document.createElement('style');
    style.textContent = rippleCSS;
    document.head.appendChild(style);
    
    console.log('🚀 DC TEKNİK Modern Effects v2.0.0 initialized successfully!');
});

// Export for potential external use
window.ModernEffects = ModernEffects;
window.ScrollAnimations = ScrollAnimations;
window.PerformanceOptimizer = PerformanceOptimizer;
