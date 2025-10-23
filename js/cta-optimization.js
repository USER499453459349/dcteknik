// CTA Optimization - DC TEKNİK
(function() {
    'use strict';
    
    class CTAOptimization {
        constructor() {
            this.ctaElements = [];
            this.scrollPosition = 0;
            this.viewportHeight = window.innerHeight;
            this.init();
        }
        
        init() {
            this.findCTAElements();
            this.optimizeCTAPlacement();
            this.addCTAAnalytics();
            this.addCTAAccessibility();
            this.addCTAAnimations();
        }
        
        findCTAElements() {
            // Find all CTA elements
            const ctaSelectors = [
                '.btn-whatsapp',
                '.btn-primary',
                '.cta-button',
                '.contact-button',
                '.sticky-cta',
                '.floating-cta',
                '[href*="wa.me"]',
                '[href^="tel:"]',
                '.appointment-btn',
                '.service-btn'
            ];
            
            ctaSelectors.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(element => {
                    this.ctaElements.push({
                        element: element,
                        type: this.getCTAType(element),
                        position: this.getElementPosition(element),
                        visibility: this.isElementVisible(element),
                        priority: this.getCTAPriority(element)
                    });
                });
            });
        }
        
        getCTAType(element) {
            if (element.classList.contains('btn-whatsapp') || element.href?.includes('wa.me')) {
                return 'whatsapp';
            } else if (element.href?.startsWith('tel:')) {
                return 'phone';
            } else if (element.classList.contains('appointment-btn')) {
                return 'appointment';
            } else if (element.classList.contains('service-btn')) {
                return 'service';
            } else {
                return 'general';
            }
        }
        
        getElementPosition(element) {
            const rect = element.getBoundingClientRect();
            return {
                top: rect.top + window.scrollY,
                bottom: rect.bottom + window.scrollY,
                left: rect.left,
                right: rect.right,
                width: rect.width,
                height: rect.height
            };
        }
        
        isElementVisible(element) {
            const rect = element.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= window.innerHeight &&
                rect.right <= window.innerWidth
            );
        }
        
        getCTAPriority(element) {
            // Higher priority for more important CTAs
            if (element.classList.contains('sticky-cta')) return 5;
            if (element.classList.contains('btn-whatsapp')) return 4;
            if (element.href?.startsWith('tel:')) return 4;
            if (element.classList.contains('appointment-btn')) return 3;
            if (element.classList.contains('service-btn')) return 2;
            return 1;
        }
        
        optimizeCTAPlacement() {
            this.optimizeStickyCTA();
            this.optimizeFloatingCTA();
            this.optimizeInlineCTAs();
            this.addCTAHoverEffects();
        }
        
        optimizeStickyCTA() {
            const stickyCTA = document.querySelector('.sticky-cta');
            if (!stickyCTA) return;
            
            // Add scroll-based visibility
            let isVisible = false;
            
            window.addEventListener('scroll', () => {
                const scrollPosition = window.scrollY;
                const documentHeight = document.documentElement.scrollHeight;
                const windowHeight = window.innerHeight;
                
                // Show sticky CTA after 50% scroll
                if (scrollPosition > (documentHeight - windowHeight) * 0.5) {
                    if (!isVisible) {
                        stickyCTA.style.display = 'block';
                        stickyCTA.style.animation = 'slideInUp 0.5s ease';
                        isVisible = true;
                    }
                } else {
                    if (isVisible) {
                        stickyCTA.style.animation = 'slideOutDown 0.5s ease';
                        setTimeout(() => {
                            stickyCTA.style.display = 'none';
                        }, 500);
                        isVisible = false;
                    }
                }
            });
        }
        
        optimizeFloatingCTA() {
            const floatingCTA = document.querySelector('.floating-cta');
            if (!floatingCTA) return;
            
            // Add smart positioning
            let lastScrollY = window.scrollY;
            let isScrollingDown = false;
            
            window.addEventListener('scroll', () => {
                const currentScrollY = window.scrollY;
                isScrollingDown = currentScrollY > lastScrollY;
                lastScrollY = currentScrollY;
                
                // Hide when scrolling down, show when scrolling up
                if (isScrollingDown && currentScrollY > 200) {
                    floatingCTA.style.transform = 'translateY(100px)';
                    floatingCTA.style.opacity = '0';
                } else {
                    floatingCTA.style.transform = 'translateY(0)';
                    floatingCTA.style.opacity = '1';
                }
            });
        }
        
        optimizeInlineCTAs() {
            const inlineCTAs = document.querySelectorAll('.btn-primary, .cta-button, .contact-button');
            
            inlineCTAs.forEach(cta => {
                // Add click tracking
                cta.addEventListener('click', (e) => {
                    this.trackCTAClick(cta);
                });
                
                // Add hover effects
                cta.addEventListener('mouseenter', () => {
                    cta.style.transform = 'translateY(-2px) scale(1.05)';
                });
                
                cta.addEventListener('mouseleave', () => {
                    cta.style.transform = 'translateY(0) scale(1)';
                });
            });
        }
        
        addCTAHoverEffects() {
            this.ctaElements.forEach(ctaData => {
                const element = ctaData.element;
                
                // Add hover effects based on CTA type
                element.addEventListener('mouseenter', () => {
                    this.addHoverEffect(element, ctaData.type);
                });
                
                element.addEventListener('mouseleave', () => {
                    this.removeHoverEffect(element);
                });
            });
        }
        
        addHoverEffect(element, type) {
            element.style.transition = 'all 0.3s ease';
            
            switch (type) {
                case 'whatsapp':
                    element.style.backgroundColor = '#25D366';
                    element.style.boxShadow = '0 8px 24px rgba(37, 211, 102, 0.3)';
                    break;
                case 'phone':
                    element.style.backgroundColor = '#059669';
                    element.style.boxShadow = '0 8px 24px rgba(5, 150, 105, 0.3)';
                    break;
                case 'appointment':
                    element.style.backgroundColor = '#0b5cff';
                    element.style.boxShadow = '0 8px 24px rgba(11, 92, 255, 0.3)';
                    break;
                default:
                    element.style.transform = 'translateY(-2px)';
                    element.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)';
            }
        }
        
        removeHoverEffect(element) {
            element.style.backgroundColor = '';
            element.style.boxShadow = '';
            element.style.transform = '';
        }
        
        addCTAAnalytics() {
            this.ctaElements.forEach(ctaData => {
                const element = ctaData.element;
                
                element.addEventListener('click', () => {
                    this.trackCTAClick(element);
                });
                
                // Track CTA visibility
                this.trackCTAVisibility(element);
            });
        }
        
        trackCTAClick(element) {
            const ctaType = this.getCTAType(element);
            const ctaText = element.textContent.trim();
            const ctaPosition = this.getElementPosition(element);
            
            if (typeof gtag !== 'undefined') {
                gtag('event', 'cta_click', {
                    event_category: 'cta_interaction',
                    event_label: ctaType,
                    cta_text: ctaText,
                    cta_position: ctaPosition.top,
                    cta_priority: this.getCTAPriority(element)
                });
            }
        }
        
        trackCTAVisibility(element) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const ctaType = this.getCTAType(element);
                        const ctaText = element.textContent.trim();
                        
                        if (typeof gtag !== 'undefined') {
                            gtag('event', 'cta_view', {
                                event_category: 'cta_visibility',
                                event_label: ctaType,
                                cta_text: ctaText
                            });
                        }
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(element);
        }
        
        addCTAAccessibility() {
            this.ctaElements.forEach(ctaData => {
                const element = ctaData.element;
                
                // Add ARIA labels
                if (!element.getAttribute('aria-label')) {
                    const text = element.textContent.trim();
                    if (text) {
                        element.setAttribute('aria-label', text);
                    }
                }
                
                // Add role if not present
                if (!element.getAttribute('role')) {
                    element.setAttribute('role', 'button');
                }
                
                // Add keyboard support
                element.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        element.click();
                    }
                });
            });
        }
        
        addCTAAnimations() {
            // Add entrance animations for CTAs
            this.ctaElements.forEach((ctaData, index) => {
                const element = ctaData.element;
                
                // Stagger animations
                element.style.opacity = '0';
                element.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    element.style.transition = 'all 0.6s ease';
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, index * 100);
            });
        }
        
        // Public method to add new CTA
        addCTA(element, options = {}) {
            const ctaData = {
                element: element,
                type: options.type || this.getCTAType(element),
                position: this.getElementPosition(element),
                visibility: this.isElementVisible(element),
                priority: options.priority || this.getCTAPriority(element)
            };
            
            this.ctaElements.push(ctaData);
            this.optimizeCTAPlacement();
            this.addCTAAnalytics();
            this.addCTAAccessibility();
        }
        
        // Public method to get CTA performance
        getCTAPerformance() {
            return {
                totalCTAs: this.ctaElements.length,
                visibleCTAs: this.ctaElements.filter(cta => cta.visibility).length,
                highPriorityCTAs: this.ctaElements.filter(cta => cta.priority >= 4).length,
                ctaTypes: this.ctaElements.reduce((acc, cta) => {
                    acc[cta.type] = (acc[cta.type] || 0) + 1;
                    return acc;
                }, {})
            };
        }
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.ctaOptimization = new CTAOptimization();
        });
    } else {
        window.ctaOptimization = new CTAOptimization();
    }
})();
