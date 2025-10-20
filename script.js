// Mobile Navigation Toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.offsetTop;
            const offsetPosition = elementPosition - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Header background change on scroll
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 30px rgba(0, 0, 0, 0.15)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

// Add fade-in class to elements and observe them
const fadeElements = document.querySelectorAll('.service-card, .product-card, .gallery-item, .contact-detail, .feature, .stat-box');
fadeElements.forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
});

// Contact form handling
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Form validation
        const formData = new FormData(this);
        const name = formData.get('name');
        const phone = formData.get('phone');
        const email = formData.get('email');
        const service = formData.get('service');
        const message = formData.get('message');

        // Get validation messages from language switcher
        const validationMessages = window.formValidationMessages || {
            nameRequired: 'Lütfen adınızı, soyadınızı ve telefon numaranızı giriniz.',
            serviceRequired: 'Lütfen bir hizmet seçiniz.',
            phoneInvalid: 'Lütfen geçerli bir telefon numarası giriniz.',
            emailInvalid: 'Lütfen geçerli bir e-posta adresi giriniz.'
        };

        // Basic validation
        if (!name || !phone) {
            alert(validationMessages.nameRequired);
            return;
        }

        if (!service) {
            alert(validationMessages.serviceRequired);
            return;
        }

        // Phone validation (Turkish format)
        const phoneRegex = /^(\+90|0)?[5][0-9]{9}$/;
        if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
            alert(validationMessages.phoneInvalid);
            return;
        }

        // Email validation (if provided)
        if (email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert(validationMessages.emailInvalid);
                return;
            }
        }

        // Prepare email content
        const emailSubject = `DC TEKNİK İletişim Formu - ${service}`;
        const emailBody = `
DC TEKNİK İletişim Formu

Ad Soyad: ${name}
Telefon: ${phone}
E-posta: ${email || 'Belirtilmemiş'}
Hizmet: ${service}

Mesaj:
${message || 'Mesaj belirtilmemiş'}

---
Bu mesaj DC TEKNİK web sitesi iletişim formundan gönderilmiştir.
Tarih: ${new Date().toLocaleString('tr-TR')}
        `.trim();

        // Create mailto link
        const mailtoLink = `mailto:serdaraltan890@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
        
        // Open email client
        window.location.href = mailtoLink;
        
        // Success message
        setTimeout(() => {
            const successMessage = validationMessages.emailOpened || 'E-posta istemciniz açıldı. Mesajınızı göndermek için e-posta istemcinizden "Gönder" butonuna tıklayın.';
            alert(successMessage);
            
            // Reset form
            this.reset();
        }, 500);
        
        // Log for debugging
        console.log('Form Data:', {
            name: name,
            phone: phone,
            email: email,
            service: service,
            message: message
        });
    });
}

// Lazy loading for images (when real images are added)
const lazyImages = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('loading');
            imageObserver.unobserve(img);
        }
    });
});

lazyImages.forEach(img => imageObserver.observe(img));

// Counter animation for statistics
const countElements = document.querySelectorAll('.stat h3, .stat-box h3');
const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = entry.target;
            const finalNumber = parseInt(target.textContent.replace(/\D/g, ''));
            const suffix = target.textContent.replace(/[0-9]/g, '');
            
            animateCount(target, 0, finalNumber, 2000, suffix);
            countObserver.unobserve(target);
        }
    });
}, { threshold: 0.5 });

countElements.forEach(el => countObserver.observe(el));

function animateCount(element, start, end, duration, suffix = '') {
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(start + (end - start) * easeOutQuart);
        
        element.textContent = current + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// Service card hover effects
const serviceCards = document.querySelectorAll('.service-card');
serviceCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-15px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// Product card hover effects
const productCards = document.querySelectorAll('.product-card');
productCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        const icon = card.querySelector('.product-image');
        icon.style.transform = 'scale(1.1) rotate(5deg)';
    });
    
    card.addEventListener('mouseleave', () => {
        const icon = card.querySelector('.product-image');
        icon.style.transform = 'scale(1) rotate(0deg)';
    });
});

// Gallery item hover effects
const galleryItems = document.querySelectorAll('.gallery-item');
galleryItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
        item.style.transform = 'scale(1.05)';
        item.style.filter = 'brightness(1.1)';
    });
    
    item.addEventListener('mouseleave', () => {
        item.style.transform = 'scale(1)';
        item.style.filter = 'brightness(1)';
    });
});

// Auto-hide mobile menu on resize
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    }
});

// Add loading class to page elements initially
document.addEventListener('DOMContentLoaded', () => {
    // Remove loading states after page is fully loaded
    setTimeout(() => {
        document.querySelectorAll('.loading').forEach(el => {
            el.classList.remove('loading');
        });
    }, 500);
});

// Keyboard accessibility
document.addEventListener('keydown', (e) => {
    // Close mobile menu with Escape key
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    }
});

// Click outside to close mobile menu
document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    }
});

// WhatsApp contact integration
function openWhatsApp() {
    const phoneNumber = '905353562469'; // Dinamocu Serdar WhatsApp number
    const message = 'Merhaba Dinamocu Serdar! Web sitenizden geliyorum. Bilgi almak istiyorum.';
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

// Add WhatsApp click handlers
document.querySelectorAll('.contact-item').forEach(item => {
    const whatsappIcon = item.querySelector('.fa-whatsapp');
    if (whatsappIcon) {
        item.style.cursor = 'pointer';
        item.addEventListener('click', openWhatsApp);
    }
});

// Phone call integration
function makePhoneCall() {
    const phoneNumber = '05353562469'; // Dinamocu Serdar phone number
    window.location.href = `tel:${phoneNumber}`;
}

// Add phone click handlers
document.querySelectorAll('.contact-item').forEach(item => {
    const phoneIcon = item.querySelector('.fa-phone');
    if (phoneIcon) {
        item.style.cursor = 'pointer';
        item.addEventListener('click', makePhoneCall);
    }
});

// Print functionality (for future use)
function printPage() {
    window.print();
}

// Initialize tooltips (if needed in future)
function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    tooltipElements.forEach(el => {
        el.addEventListener('mouseenter', showTooltip);
        el.addEventListener('mouseleave', hideTooltip);
    });
}

function showTooltip(e) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = e.target.dataset.tooltip;
    document.body.appendChild(tooltip);
    
    const rect = e.target.getBoundingClientRect();
    tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
}

function hideTooltip() {
    const tooltip = document.querySelector('.tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

// Marketing Enhancement Functions

// Urgency Timer
function initUrgencyTimer() {
    const timerElement = document.getElementById('urgencyTimer');
    if (!timerElement) return;
    
    // Set end time (24 hours from now)
    const endTime = new Date().getTime() + (24 * 60 * 60 * 1000);
    
    function updateTimer() {
        const now = new Date().getTime();
        const distance = endTime - now;
        
        if (distance < 0) {
            timerElement.textContent = "00:00:00";
            return;
        }
        
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        timerElement.textContent = 
            String(hours).padStart(2, '0') + ":" +
            String(minutes).padStart(2, '0') + ":" +
            String(seconds).padStart(2, '0');
    }
    
    updateTimer();
    setInterval(updateTimer, 1000);
}

// Service Selector Functionality (Removed)
function initServiceSelector() {
    // Service selector has been removed
    return;
}

// Update CTA buttons based on selected service (Simplified)
function updateCTAButtons(serviceType) {
    // Service selector has been removed, keeping function for compatibility
    return;
}

// Enhanced CTA Button Tracking
function initCTATracking() {
    const ctaButtons = document.querySelectorAll('.cta-primary, .cta-secondary, .cta-whatsapp');
    
    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            const buttonType = this.classList.contains('cta-primary') ? 'primary' : 
                             this.classList.contains('cta-secondary') ? 'secondary' : 'whatsapp';
            
            // Track CTA click
            if (typeof gtag !== 'undefined') {
                gtag('event', 'cta_click', {
                    'event_category': 'conversion',
                    'event_label': buttonType,
                    'value': 1
                });
            }
            
            // Track Facebook conversion
            if (typeof fbq !== 'undefined') {
                fbq('track', 'Lead', {
                    content_name: buttonType + '_cta',
                    content_category: 'automotive_service'
                });
            }
        });
    });
}

// Testimonial Carousel (if needed)
function initTestimonialCarousel() {
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    let currentIndex = 0;
    
    if (testimonialCards.length <= 3) return; // No need for carousel if 3 or fewer cards
    
    // Add carousel functionality here if needed
    // For now, just add hover effects
    testimonialCards.forEach((card, index) => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Social Proof Counter Animation
function initSocialProofCounters() {
    const counters = document.querySelectorAll('.proof-item .number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const finalNumber = counter.textContent.replace(/\D/g, '');
                const suffix = counter.textContent.replace(/[0-9]/g, '');
                
                animateCounter(counter, 0, parseInt(finalNumber), 2000, suffix);
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, start, end, duration, suffix = '') {
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(start + (end - start) * easeOutQuart);
        
        element.textContent = current + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// Trust Badge Hover Effects
function initTrustBadgeEffects() {
    const trustBadges = document.querySelectorAll('.trust-badge');
    
    trustBadges.forEach(badge => {
        badge.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.05)';
            this.style.boxShadow = '0 15px 35px rgba(0,0,0,0.2)';
        });
        
        badge.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
        });
    });
}

// Lead Magnet Form Handling
function initLeadMagnetForm() {
    const leadForm = document.getElementById('leadMagnetForm');
    if (!leadForm) return;
    
    leadForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const leadData = {
            name: formData.get('name'),
            phone: formData.get('phone'),
            vehicle: formData.get('vehicle'),
            urgency: formData.get('urgency')
        };
        
        // Basic validation
        if (!leadData.name || !leadData.phone || !leadData.vehicle || !leadData.urgency) {
            alert('Lütfen tüm alanları doldurun.');
            return;
        }
        
        // Phone validation
        const phoneRegex = /^(\+90|0)?[5][0-9]{9}$/;
        if (!phoneRegex.test(leadData.phone.replace(/\s/g, ''))) {
            alert('Lütfen geçerli bir telefon numarası giriniz.');
            return;
        }
        
        // Create WhatsApp message for lead magnet
        const whatsappMessage = `🎁 *DC TEKNİK - ÜCRETSİZ Elektrik Kontrolü Talebi*

👤 *Ad Soyad:* ${leadData.name}
📞 *Telefon:* ${leadData.phone}
🚗 *Araç Markası:* ${leadData.vehicle}
⚡ *Aciliyet:* ${leadData.urgency}

🎯 *Talep Edilen Hizmet:*
• Dinamo ve alternatör durumu kontrolü
• Marş motoru performans testi
• Akü ve şarj sistemi analizi
• Detaylı rapor ve öneriler

---
Bu talep dcteknik.com web sitesinden gönderilmiştir.
Tarih: ${new Date().toLocaleString('tr-TR')}`;

        const whatsappUrl = `https://wa.me/905353562469?text=${encodeURIComponent(whatsappMessage)}`;
        
        // Open WhatsApp
        window.open(whatsappUrl, '_blank');
        
        // Show success message
        alert('ÜCRETSİZ kontrol talebiniz WhatsApp üzerinden gönderildi! En kısa sürede size dönüş yapacağız.');
        
        // Reset form
        this.reset();
        
        // Track lead magnet conversion
        if (typeof gtag !== 'undefined') {
            gtag('event', 'lead_magnet_submit', {
                'event_category': 'conversion',
                'event_label': 'free_checkup',
                'value': 200 // Value of the free service
            });
        }
        
        // Track Facebook conversion
        if (typeof fbq !== 'undefined') {
            fbq('track', 'Lead', {
                content_name: 'free_electrical_checkup',
                content_category: 'automotive_service',
                value: 200,
                currency: 'TRY'
            });
        }
    });
}

// Enhanced Form Tracking
function initEnhancedFormTracking() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function() {
            const formType = this.id || 'unknown_form';
            
            // Track form submission
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_submit', {
                    'event_category': 'conversion',
                    'event_label': formType,
                    'value': 1
                });
            }
            
            // Track Facebook conversion
            if (typeof fbq !== 'undefined') {
                fbq('track', 'Lead', {
                    content_name: formType,
                    content_category: 'automotive_service'
                });
            }
        });
    });
}

// Initialize all functions when page loads
document.addEventListener('DOMContentLoaded', () => {
    initTooltips();
    
    // Initialize marketing enhancements
    initUrgencyTimer();
    initServiceSelector();
    initCTATracking();
    initTestimonialCarousel();
    initSocialProofCounters();
    initTrustBadgeEffects();
    initLeadMagnetForm();
    initEnhancedFormTracking();
    
    // Add entrance animations
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});

// Performance optimization: Throttle scroll events
function throttle(func, wait) {
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

// Apply throttling to scroll events
const throttledScrollHandler = throttle(() => {
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 30px rgba(0, 0, 0, 0.15)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }
}, 16);

window.addEventListener('scroll', throttledScrollHandler);

// Performance optimizations
// Preload critical resources
function preloadCriticalResources() {
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
}

// Service Worker registration for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
        try {
            // Proaktif eski sw temizliği
            const regs = await navigator.serviceWorker.getRegistrations();
            for (const r of regs) {
                if (r && r.active && !r.active.scriptURL.includes('sw.js')) continue;
            }
            await navigator.serviceWorker.register('/sw.js', { scope: '/' });
            // Yeni versiyonu hemen etkinleştir
            const reg = await navigator.serviceWorker.ready;
            if (reg && reg.waiting) {
                reg.waiting.postMessage({ type: 'SKIP_WAITING' });
            }
        } catch (err) {
            console.warn('Service Worker registration failed:', err);
        }
    });
}

// Initialize performance optimizations
document.addEventListener('DOMContentLoaded', () => {
    preloadCriticalResources();
    
    // Add performance monitoring
    if ('performance' in window) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
            }, 0);
        });
    }
});

// Global image optimizations: apply lazy-loading and async decoding to non-critical images
document.addEventListener('DOMContentLoaded', () => {
    const images = Array.from(document.querySelectorAll('img'));
    images.forEach((img) => {
        // Skip likely above-the-fold/critical images (e.g., logo)
        if (img.classList.contains('logo-image')) {
            img.decoding = 'async';
            img.fetchPriority = 'high';
            return;
        }

        if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
        }
        img.decoding = 'async';
        // Hint lower priority for below-the-fold images
        try {
            const rect = img.getBoundingClientRect();
            const viewportH = window.innerHeight || document.documentElement.clientHeight;
            if (rect.top > viewportH * 1.25) {
                img.fetchPriority = 'low';
            }
        } catch (e) {
            // no-op
        }
    });
});

// Listen SW messages to auto-refresh after updates
if (navigator.serviceWorker) {
    navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'RELOAD_PAGE') {
            window.location.reload();
        }
    });
}
// FAQ accordion behavior
document.addEventListener('DOMContentLoaded', () => {
    const faqButtons = document.querySelectorAll('.faq-question');
    faqButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const expanded = btn.getAttribute('aria-expanded') === 'true';
            btn.setAttribute('aria-expanded', String(!expanded));
            const answer = btn.nextElementSibling;
            if (answer) {
                const isHidden = answer.hasAttribute('hidden');
                if (isHidden) {
                    answer.removeAttribute('hidden');
                } else {
                    answer.setAttribute('hidden', '');
                }
            }
        });
    });
});

// Appointment Form Handling
const appointmentForm = document.getElementById('appointmentForm');
if (appointmentForm) {
    appointmentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const appointmentData = {
            customerName: formData.get('customerName'),
            customerPhone: formData.get('customerPhone'),
            vehicleBrand: formData.get('vehicleBrand'),
            vehicleModel: formData.get('vehicleModel'),
            serviceType: formData.get('serviceType'),
            appointmentDate: formData.get('appointmentDate'),
            appointmentTime: formData.get('appointmentTime'),
            urgency: formData.get('urgency'),
            problemDescription: formData.get('problemDescription')
        };

        // Create WhatsApp message
        const whatsappMessage = `🏁 *DC TEKNİK - Randevu Talebi*

👤 *Müşteri:* ${appointmentData.customerName}
📞 *Telefon:* ${appointmentData.customerPhone}
🚗 *Araç:* ${appointmentData.vehicleBrand} ${appointmentData.vehicleModel}
🔧 *Hizmet:* ${appointmentData.serviceType}
📅 *Tarih:* ${appointmentData.appointmentDate}
⏰ *Saat:* ${appointmentData.appointmentTime}
⚡ *Aciliyet:* ${appointmentData.urgency}

📝 *Problem Açıklaması:*
${appointmentData.problemDescription}

---
Bu randevu talebi dcteknik.com web sitesinden gönderilmiştir.`;

        const whatsappUrl = `https://wa.me/905353562469?text=${encodeURIComponent(whatsappMessage)}`;
        
        // Open WhatsApp
        window.open(whatsappUrl, '_blank');
        
        // Show success message
        alert('Randevu talebiniz WhatsApp üzerinden gönderildi! En kısa sürede size dönüş yapacağız.');
        
        // Reset form
        this.reset();
    });
}

// Price Calculator
const priceCalculatorForm = document.getElementById('priceCalculatorForm');
if (priceCalculatorForm) {
    priceCalculatorForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const calcData = {
            vehicleBrand: formData.get('calcVehicleBrand'),
            vehicleModel: formData.get('calcVehicleModel'),
            serviceType: formData.get('calcServiceType'),
            problemType: formData.get('calcProblemType'),
            year: formData.get('calcYear')
        };

        // Calculate price based on service type and problem
        let basePrice = 0;
        let serviceName = '';
        
        switch(calcData.serviceType) {
            case 'dinamo':
                basePrice = 800;
                serviceName = 'Dinamo Tamiri';
                break;
            case 'alternator':
                basePrice = 1200;
                serviceName = 'Alternatör Servisi';
                break;
            case 'starter':
                basePrice = 1000;
                serviceName = 'Marş Motoru';
                break;
            case 'electrical':
                basePrice = 600;
                serviceName = 'Genel Elektrik';
                break;
            case 'diagnosis':
                basePrice = 300;
                serviceName = 'Arıza Tespiti';
                break;
        }

        // Adjust price based on problem type
        switch(calcData.problemType) {
            case 'minor':
                basePrice *= 0.7;
                break;
            case 'medium':
                basePrice *= 1.0;
                break;
            case 'major':
                basePrice *= 1.5;
                break;
            case 'replacement':
                basePrice *= 2.0;
                break;
        }

        // Adjust price based on vehicle year
        if (calcData.year === '2020+') {
            basePrice *= 1.3;
        } else if (calcData.year === '2015-2019') {
            basePrice *= 1.1;
        } else if (calcData.year === '2010-2014') {
            basePrice *= 1.0;
        } else if (calcData.year === '2005-2009') {
            basePrice *= 0.9;
        } else {
            basePrice *= 0.8;
        }

        // Round to nearest 50
        const finalPrice = Math.round(basePrice / 50) * 50;

        // Show result
        const priceResult = document.getElementById('priceResult');
        const priceAmount = document.getElementById('priceAmount');
        const priceDetails = document.getElementById('priceDetails');

        priceAmount.textContent = finalPrice.toLocaleString('tr-TR');
        priceDetails.textContent = `${calcData.vehicleBrand} ${calcData.vehicleModel} için ${serviceName} tahmini fiyatı. Kesin fiyat için randevu alın.`;
        
        priceResult.style.display = 'block';
        priceResult.scrollIntoView({ behavior: 'smooth' });
    });
}

// Set minimum date for appointment to today
const appointmentDateInput = document.getElementById('appointmentDate');
if (appointmentDateInput) {
    const today = new Date().toISOString().split('T')[0];
    appointmentDateInput.min = today;
}

// Enhanced Live Chat Widget Functionality
document.addEventListener('DOMContentLoaded', function() {
    const chatToggle = document.getElementById('chatToggle');
    const chatWindow = document.getElementById('chatWindow');
    const chatClose = document.getElementById('chatClose');
    const chatMinimize = document.getElementById('chatMinimize');
    const chatInput = document.getElementById('chatInput');
    const chatSend = document.getElementById('chatSend');
    const chatMessages = document.getElementById('chatMessages');
    const chatBadge = document.getElementById('chatBadge');
    const quickBtns = document.querySelectorAll('.quick-btn');

    let isMinimized = false;
    let messageCount = 0;
    let typingTimer = null;

    // Chat toggle functionality
    if (chatToggle && chatWindow) {
        chatToggle.addEventListener('click', () => {
            if (isMinimized) {
                chatWindow.classList.add('active');
                isMinimized = false;
            } else {
                chatWindow.classList.toggle('active');
            }
            
            if (chatWindow.classList.contains('active')) {
                chatInput.focus();
                hideBadge();
            }
        });

        chatClose.addEventListener('click', () => {
            chatWindow.classList.remove('active');
        });

        chatMinimize.addEventListener('click', () => {
            chatWindow.classList.remove('active');
            isMinimized = true;
        });
    }

    // Quick action buttons
    quickBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const message = btn.getAttribute('data-message');
            if (message) {
                sendMessage(message);
                btn.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    btn.style.transform = '';
                }, 150);
            }
        });
    });

    // Send message functionality
    function sendMessage(message) {
        if (!message.trim()) return;

        // Add user message
        addMessage(message, 'user');
        
        // Clear input
        chatInput.value = '';
        
        // Show typing indicator
        showTypingIndicator();
        
        // Simulate bot response
        setTimeout(() => {
            hideTypingIndicator();
            const botResponse = getBotResponse(message);
            addMessage(botResponse, 'bot');
        }, 1500 + Math.random() * 1000);
    }

    // Add message to chat
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = sender === 'bot' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';
        
        const content = document.createElement('div');
        content.className = 'message-content';
        content.innerHTML = `
            <p>${text}</p>
            <span class="message-time">${new Date().toLocaleTimeString('tr-TR', {hour: '2-digit', minute: '2-digit'})}</span>
        `;
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);
        chatMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        scrollToBottom();
        
        // Update message count
        messageCount++;
        if (!chatWindow.classList.contains('active')) {
            showBadge();
        }
    }

    // Show typing indicator
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message typing-indicator';
        typingDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        chatMessages.appendChild(typingDiv);
        scrollToBottom();
    }

    // Hide typing indicator
    function hideTypingIndicator() {
        const typingIndicator = document.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    // Scroll to bottom
    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Show badge
    function showBadge() {
        if (chatBadge) {
            chatBadge.textContent = messageCount;
            chatBadge.style.display = 'flex';
        }
    }

    // Hide badge
    function hideBadge() {
        if (chatBadge) {
            chatBadge.style.display = 'none';
            messageCount = 0;
        }
    }

    // Get bot response based on user message
    function getBotResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('fiyat') || lowerMessage.includes('dinamo')) {
            return 'Dinamo tamiri fiyatlarımız araç markasına göre değişmektedir. Genel fiyat aralığı 800-2500 TL arasındadır. Detaylı fiyat için araç bilgilerinizi paylaşabilir misiniz? 🚗';
        } else if (lowerMessage.includes('randevu')) {
            return 'Randevu almak için aşağıdaki formu doldurabilir veya WhatsApp üzerinden bize ulaşabilirsiniz. Hangi gün uygun olursunuz? 📅';
        } else if (lowerMessage.includes('acil')) {
            return 'Acil durumlar için 7/24 hizmet veriyoruz! Hemen 0535 356 24 69 numaralı telefonu arayabilir veya WhatsApp üzerinden yazabilirsiniz. 🚨';
        } else if (lowerMessage.includes('marş') || lowerMessage.includes('motor')) {
            return 'Marş motoru tamiri de yapıyoruz. Fiyat aralığı 600-1800 TL arasındadır. Araç markanızı belirtirseniz daha detaylı bilgi verebilirim. ⚙️';
        } else if (lowerMessage.includes('alternatör')) {
            return 'Alternatör tamiri ve yenileme hizmeti veriyoruz. Fiyat aralığı 1000-3000 TL arasındadır. Hangi marka araç için bilgi almak istiyorsunuz? ⚡';
        } else if (lowerMessage.includes('teşekkür') || lowerMessage.includes('sağol')) {
            return 'Rica ederim! Başka bir konuda yardımcı olabileceğim bir şey var mı? 😊';
        } else if (lowerMessage.includes('merhaba') || lowerMessage.includes('selam')) {
            return 'Merhaba! DC TEKNİK\'e hoş geldiniz! Dinamo, alternatör ve marş motoru konularında size nasıl yardımcı olabilirim? 🤝';
        } else if (lowerMessage.includes('adres') || lowerMessage.includes('konum')) {
            return 'Atatürk Cad. No:312, Sultanbeyli / İstanbul adresinde hizmet veriyoruz. Detaylı yol tarifi için WhatsApp üzerinden iletişime geçebilirsiniz. 📍';
        } else if (lowerMessage.includes('çalışma') || lowerMessage.includes('saat')) {
            return 'Pazartesi-Cumartesi 09:00-18:00 saatleri arasında hizmet veriyoruz. Acil durumlar için 7/24 ulaşabilirsiniz. ⏰';
        } else {
            return 'Anladım. Size nasıl yardımcı olabilirim? Dinamo, marş motoru, alternatör tamiri veya randevu konularında bilgi verebilirim. 💬';
        }
    }

    // Send button click
    if (chatSend) {
        chatSend.addEventListener('click', () => {
            const message = chatInput.value.trim();
            if (message) {
                sendMessage(message);
            }
        });
    }

    // Enter key to send message
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const message = chatInput.value.trim();
                if (message) {
                    sendMessage(message);
                }
            }
        });

        // Typing indicator
        chatInput.addEventListener('input', () => {
            clearTimeout(typingTimer);
            if (chatInput.value.trim()) {
                // Show typing indicator after 1 second of no typing
                typingTimer = setTimeout(() => {
                    // Could add typing indicator here
                }, 1000);
            }
        });
    }

    // Auto-open chat after 8 seconds
    setTimeout(() => {
        if (chatToggle && !chatWindow.classList.contains('active')) {
            chatToggle.style.animation = 'chatPulse 1s ease-in-out 3';
            showBadge();
        }
    }, 8000);

    // Add typing dots animation CSS
    const style = document.createElement('style');
    style.textContent = `
        .typing-dots {
            display: flex;
            gap: 4px;
            padding: 8px 0;
        }
        .typing-dots span {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #9ca3af;
            animation: typingDots 1.4s infinite ease-in-out;
        }
        .typing-dots span:nth-child(1) { animation-delay: -0.32s; }
        .typing-dots span:nth-child(2) { animation-delay: -0.16s; }
        @keyframes typingDots {
            0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
            40% { transform: scale(1); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
});

// Service Tracking System
document.addEventListener('DOMContentLoaded', function() {
    const trackingBtn = document.getElementById('trackingBtn');
    const serviceTracking = document.getElementById('serviceTracking');
    const trackingClose = document.getElementById('trackingClose');
    const trackService = document.getElementById('trackService');
    const trackingResult = document.getElementById('trackingResult');

    // Open tracking modal
    if (trackingBtn) {
        trackingBtn.addEventListener('click', () => {
            serviceTracking.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    // Close tracking modal
    if (trackingClose) {
        trackingClose.addEventListener('click', () => {
            serviceTracking.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // Close on overlay click
    if (serviceTracking) {
        serviceTracking.addEventListener('click', (e) => {
            if (e.target === serviceTracking || e.target.classList.contains('tracking-overlay')) {
                serviceTracking.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // Track service
    if (trackService) {
        trackService.addEventListener('click', () => {
            const trackingNumber = document.getElementById('trackingNumber').value;
            const customerPhone = document.getElementById('customerPhone').value;

            if (!trackingNumber || !customerPhone) {
                alert('Lütfen tüm alanları doldurun.');
                return;
            }

            // Simulate API call
            trackService.textContent = 'Sorgulanıyor...';
            trackService.disabled = true;

            setTimeout(() => {
                trackingResult.style.display = 'block';
                trackService.textContent = 'Servis Durumunu Sorgula';
                trackService.disabled = false;
                
                // Scroll to result
                trackingResult.scrollIntoView({ behavior: 'smooth' });
            }, 2000);
        });
    }
});

// Enhanced Vehicle Brand/Model Selector
document.addEventListener('DOMContentLoaded', function() {
    const vehicleBrand = document.getElementById('vehicleBrand');
    const vehicleModel = document.getElementById('vehicleModel');
    
    // Vehicle models database
    const vehicleModels = {
        toyota: [
            { value: 'corolla', text: 'Corolla', priceMultiplier: 1.0 },
            { value: 'camry', text: 'Camry', priceMultiplier: 1.1 },
            { value: 'rav4', text: 'RAV4', priceMultiplier: 1.2 },
            { value: 'highlander', text: 'Highlander', priceMultiplier: 1.3 },
            { value: 'prius', text: 'Prius', priceMultiplier: 1.1 },
            { value: 'yaris', text: 'Yaris', priceMultiplier: 0.9 },
            { value: 'avensis', text: 'Avensis', priceMultiplier: 1.0 },
            { value: 'hilux', text: 'Hilux', priceMultiplier: 1.2 }
        ],
        volkswagen: [
            { value: 'golf', text: 'Golf', priceMultiplier: 1.0 },
            { value: 'passat', text: 'Passat', priceMultiplier: 1.1 },
            { value: 'polo', text: 'Polo', priceMultiplier: 0.9 },
            { value: 'jetta', text: 'Jetta', priceMultiplier: 1.0 },
            { value: 'tiguan', text: 'Tiguan', priceMultiplier: 1.2 },
            { value: 'touareg', text: 'Touareg', priceMultiplier: 1.4 },
            { value: 'caddy', text: 'Caddy', priceMultiplier: 1.1 },
            { value: 'transporter', text: 'Transporter', priceMultiplier: 1.3 }
        ],
        ford: [
            { value: 'focus', text: 'Focus', priceMultiplier: 1.0 },
            { value: 'fiesta', text: 'Fiesta', priceMultiplier: 0.9 },
            { value: 'mondeo', text: 'Mondeo', priceMultiplier: 1.1 },
            { value: 'kuga', text: 'Kuga', priceMultiplier: 1.2 },
            { value: 'explorer', text: 'Explorer', priceMultiplier: 1.3 },
            { value: 'transit', text: 'Transit', priceMultiplier: 1.2 },
            { value: 'ranger', text: 'Ranger', priceMultiplier: 1.2 },
            { value: 'mustang', text: 'Mustang', priceMultiplier: 1.4 }
        ],
        renault: [
            { value: 'clio', text: 'Clio', priceMultiplier: 0.9 },
            { value: 'megane', text: 'Megane', priceMultiplier: 1.0 },
            { value: 'scenic', text: 'Scenic', priceMultiplier: 1.1 },
            { value: 'kadjar', text: 'Kadjar', priceMultiplier: 1.1 },
            { value: 'koleos', text: 'Koleos', priceMultiplier: 1.2 },
            { value: 'talisman', text: 'Talisman', priceMultiplier: 1.1 },
            { value: 'master', text: 'Master', priceMultiplier: 1.2 },
            { value: 'kangoo', text: 'Kangoo', priceMultiplier: 1.0 }
        ],
        opel: [
            { value: 'corsa', text: 'Corsa', priceMultiplier: 0.9 },
            { value: 'astra', text: 'Astra', priceMultiplier: 1.0 },
            { value: 'insignia', text: 'Insignia', priceMultiplier: 1.1 },
            { value: 'mokka', text: 'Mokka', priceMultiplier: 1.1 },
            { value: 'crossland', text: 'Crossland', priceMultiplier: 1.0 },
            { value: 'grandland', text: 'Grandland', priceMultiplier: 1.1 },
            { value: 'combo', text: 'Combo', priceMultiplier: 1.0 },
            { value: 'vivaro', text: 'Vivaro', priceMultiplier: 1.1 }
        ],
        fiat: [
            { value: 'punto', text: 'Punto', priceMultiplier: 0.8 },
            { value: 'linea', text: 'Linea', priceMultiplier: 0.9 },
            { value: 'doblo', text: 'Doblo', priceMultiplier: 1.0 },
            { value: 'ducato', text: 'Ducato', priceMultiplier: 1.2 },
            { value: '500', text: '500', priceMultiplier: 0.9 },
            { value: 'tipo', text: 'Tipo', priceMultiplier: 0.9 },
            { value: 'panda', text: 'Panda', priceMultiplier: 0.8 },
            { value: 'bravo', text: 'Bravo', priceMultiplier: 1.0 }
        ],
        hyundai: [
            { value: 'i20', text: 'i20', priceMultiplier: 0.9 },
            { value: 'i30', text: 'i30', priceMultiplier: 1.0 },
            { value: 'elantra', text: 'Elantra', priceMultiplier: 1.0 },
            { value: 'tucson', text: 'Tucson', priceMultiplier: 1.1 },
            { value: 'santa_fe', text: 'Santa Fe', priceMultiplier: 1.2 },
            { value: 'accent', text: 'Accent', priceMultiplier: 0.9 },
            { value: 'sonata', text: 'Sonata', priceMultiplier: 1.1 },
            { value: 'getz', text: 'Getz', priceMultiplier: 0.8 }
        ],
        kia: [
            { value: 'rio', text: 'Rio', priceMultiplier: 0.9 },
            { value: 'cee_d', text: 'Cee\'d', priceMultiplier: 1.0 },
            { value: 'optima', text: 'Optima', priceMultiplier: 1.1 },
            { value: 'sportage', text: 'Sportage', priceMultiplier: 1.1 },
            { value: 'sorento', text: 'Sorento', priceMultiplier: 1.2 },
            { value: 'picanto', text: 'Picanto', priceMultiplier: 0.8 },
            { value: 'cerato', text: 'Cerato', priceMultiplier: 1.0 },
            { value: 'carnival', text: 'Carnival', priceMultiplier: 1.2 }
        ],
        bmw: [
            { value: '3_series', text: '3 Series', priceMultiplier: 1.3 },
            { value: '5_series', text: '5 Series', priceMultiplier: 1.4 },
            { value: '7_series', text: '7 Series', priceMultiplier: 1.5 },
            { value: 'x1', text: 'X1', priceMultiplier: 1.3 },
            { value: 'x3', text: 'X3', priceMultiplier: 1.4 },
            { value: 'x5', text: 'X5', priceMultiplier: 1.5 },
            { value: 'z4', text: 'Z4', priceMultiplier: 1.4 },
            { value: 'i3', text: 'i3', priceMultiplier: 1.3 }
        ],
        mercedes: [
            { value: 'c_class', text: 'C-Class', priceMultiplier: 1.4 },
            { value: 'e_class', text: 'E-Class', priceMultiplier: 1.5 },
            { value: 's_class', text: 'S-Class', priceMultiplier: 1.6 },
            { value: 'glc', text: 'GLC', priceMultiplier: 1.5 },
            { value: 'gle', text: 'GLE', priceMultiplier: 1.6 },
            { value: 'gla', text: 'GLA', priceMultiplier: 1.4 },
            { value: 'a_class', text: 'A-Class', priceMultiplier: 1.3 },
            { value: 'sprinter', text: 'Sprinter', priceMultiplier: 1.4 }
        ],
        audi: [
            { value: 'a3', text: 'A3', priceMultiplier: 1.3 },
            { value: 'a4', text: 'A4', priceMultiplier: 1.4 },
            { value: 'a6', text: 'A6', priceMultiplier: 1.5 },
            { value: 'a8', text: 'A8', priceMultiplier: 1.6 },
            { value: 'q3', text: 'Q3', priceMultiplier: 1.4 },
            { value: 'q5', text: 'Q5', priceMultiplier: 1.5 },
            { value: 'q7', text: 'Q7', priceMultiplier: 1.6 },
            { value: 'tt', text: 'TT', priceMultiplier: 1.4 }
        ]
    };

    // Brand change handler
    if (vehicleBrand && vehicleModel) {
        vehicleBrand.addEventListener('change', function() {
            const selectedBrand = this.value;
            vehicleModel.innerHTML = '<option value="">Model Seçin</option>';
            
            if (selectedBrand && vehicleModels[selectedBrand]) {
                vehicleModels[selectedBrand].forEach(model => {
                    const option = document.createElement('option');
                    option.value = model.value;
                    option.textContent = model.text;
                    option.setAttribute('data-price-multiplier', model.priceMultiplier);
                    vehicleModel.appendChild(option);
                });
            }
        });
    }
});

// Dark Mode Functionality
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const body = document.body;
    
    // Check for saved theme preference or default to 'light'
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    // Apply the current theme
    body.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);
    
    // Theme toggle event listener
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = body.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            // Update theme
            body.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Update icon
            updateThemeIcon(newTheme);
            
            // Add smooth transition effect
            body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
            
            // Analytics tracking (if available)
            if (typeof gtag !== 'undefined') {
                gtag('event', 'theme_change', {
                    'event_category': 'ui',
                    'event_label': newTheme
                });
            }
        });
    }
    
    // Function to update theme icon
    function updateThemeIcon(theme) {
        if (themeIcon) {
            if (theme === 'dark') {
                themeIcon.className = 'fas fa-sun';
                themeToggle.title = 'Açık Moda Geç';
            } else {
                themeIcon.className = 'fas fa-moon';
                themeToggle.title = 'Karanlık Moda Geç';
            }
        }
    }
    
    // Auto-detect system theme preference
    if (currentTheme === 'light' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // User hasn't set a preference but system is dark
        // Keep light mode as default, but could auto-switch here if desired
    }
    
    // Listen for system theme changes
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
            // Only auto-switch if user hasn't manually set a preference
            if (!localStorage.getItem('theme')) {
                const newTheme = e.matches ? 'dark' : 'light';
                body.setAttribute('data-theme', newTheme);
                updateThemeIcon(newTheme);
            }
        });
    }
});

// Interactive Google Maps
let map;
let marker;
let infoWindow;

function initMap() {
    // DC TEKNİK coordinates (Sultanbeyli, İstanbul)
    const dcteknikLocation = { lat: 40.987654321, lng: 29.234567890 };
    
    // Create map
    const mapContainer = document.getElementById('interactiveMap');
    if (!mapContainer || typeof google === 'undefined' || !google.maps) {
        // Fallback: Embed static map link and message
        const fallback = document.getElementById('mapFallback');
        if (fallback) {
            fallback.style.display = 'block';
        }
        return;
    }

    map = new google.maps.Map(mapContainer, {
        zoom: 16,
        center: dcteknikLocation,
        mapTypeId: 'roadmap',
        styles: [
            {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }]
            }
        ]
    });
    
    // Create marker
    marker = new google.maps.Marker({
        position: dcteknikLocation,
        map: map,
        title: 'DC TEKNİK - Dinamocu Serdar',
        icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="20" cy="20" r="18" fill="#1e3a8a" stroke="#ffffff" stroke-width="2"/>
                    <text x="20" y="26" text-anchor="middle" fill="white" font-family="Arial" font-size="12" font-weight="bold">DC</text>
                </svg>
            `),
            scaledSize: new google.maps.Size(40, 40),
            anchor: new google.maps.Point(20, 20)
        }
    });
    
    // Create info window
    infoWindow = new google.maps.InfoWindow({
        content: `
            <div style="padding: 10px; max-width: 250px;">
                <h3 style="margin: 0 0 10px 0; color: #1e3a8a; font-size: 16px;">DC TEKNİK</h3>
                <p style="margin: 0 0 8px 0; color: #333; font-size: 14px;">
                    <i class="fas fa-map-marker-alt" style="color: #ea580c; margin-right: 5px;"></i>
                    Atatürk Cad. No:312<br>
                    Sultanbeyli / İstanbul
                </p>
                <p style="margin: 0 0 8px 0; color: #333; font-size: 14px;">
                    <i class="fas fa-phone" style="color: #ea580c; margin-right: 5px;"></i>
                    +90 535 356 24 69
                </p>
                <p style="margin: 0 0 10px 0; color: #333; font-size: 14px;">
                    <i class="fas fa-clock" style="color: #ea580c; margin-right: 5px;"></i>
                    Pazartesi - Cumartesi: 09:00 - 18:00
                </p>
                <div style="margin-top: 10px;">
                    <a href="https://www.google.com/maps/dir//Atatürk+Cad.+No:312,+34900+Sultanbeyli/İstanbul/@40.987654321,29.234567890,15z" 
                       target="_blank" 
                       style="background: #1e3a8a; color: white; padding: 8px 12px; text-decoration: none; border-radius: 5px; font-size: 12px; display: inline-block; margin-right: 5px;">
                        <i class="fas fa-route"></i> Yol Tarifi
                    </a>
                    <a href="tel:+905353562469" 
                       style="background: #ea580c; color: white; padding: 8px 12px; text-decoration: none; border-radius: 5px; font-size: 12px; display: inline-block;">
                        <i class="fas fa-phone"></i> Ara
                    </a>
                </div>
            </div>
        `
    });
    
    // Add click event to marker
    marker.addListener('click', function() {
        infoWindow.open(map, marker);
    });
    
    // Add click event to map
    map.addListener('click', function() {
        infoWindow.close();
    });
    
    // Hide loading indicator
    const mapLoading = document.getElementById('mapLoading');
    if (mapLoading) {
        mapLoading.style.display = 'none';
    }
    
    // Add search box
    const searchBox = new google.maps.places.SearchBox(document.getElementById('mapSearch'));
    
    // Bias the SearchBox results towards current map's viewport
    map.addListener('bounds_changed', function() {
        searchBox.setBounds(map.getBounds());
    });
    
    // Listen for the event fired when the user selects a prediction
    searchBox.addListener('places_changed', function() {
        const places = searchBox.getPlaces();
        
        if (places.length === 0) return;
        
        // Clear out the old markers
        const markers = [];
        
        // For each place, get the icon, name and location
        const bounds = new google.maps.LatLngBounds();
        places.forEach(function(place) {
            if (!place.geometry || !place.geometry.location) {
                console.log("Returned place contains no geometry");
                return;
            }
            
            // Create a marker for each place
            const placeMarker = new google.maps.Marker({
                map: map,
                title: place.name,
                position: place.geometry.location
            });
            
            markers.push(placeMarker);
            
            if (place.geometry.viewport) {
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        
        map.fitBounds(bounds);
    });
}

// Map search functionality
function searchLocation() {
    const searchInput = document.getElementById('mapSearch');
    if (searchInput && searchInput.value.trim()) {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address: searchInput.value }, function(results, status) {
            if (status === 'OK' && results[0]) {
                map.setCenter(results[0].geometry.location);
                map.setZoom(15);
                
                // Create temporary marker for search result
                const searchMarker = new google.maps.Marker({
                    position: results[0].geometry.location,
                    map: map,
                    title: searchInput.value
                });
                
                // Remove marker after 5 seconds
                setTimeout(function() {
                    searchMarker.setMap(null);
                }, 5000);
            }
        });
    }
}

// Google Analytics Event Tracking
function trackEvent(eventName, eventCategory, eventLabel, eventValue) {
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, {
            event_category: eventCategory,
            event_label: eventLabel,
            value: eventValue
        });
    }
}

// Track form submissions
function trackFormSubmission(formType, serviceType) {
    trackEvent('form_submit', 'engagement', formType, 1);
    if (serviceType) {
        trackEvent('service_selected', 'engagement', serviceType, 1);
    }
}

// Track button clicks
function trackButtonClick(buttonName, location) {
    trackEvent('button_click', 'engagement', buttonName, 1);
    if (location) {
        trackEvent('button_location', 'engagement', location, 1);
    }
}

// Track page views
function trackPageView(pageName) {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'page_view', {
            page_title: pageName,
            page_location: window.location.href
        });
    }
}

// Track scroll depth
function trackScrollDepth() {
    let maxScroll = 0;
    let scrollMilestones = [25, 50, 75, 90, 100];
    let trackedMilestones = [];
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = Math.round((scrollTop / docHeight) * 100);
        
        if (scrollPercent > maxScroll) {
            maxScroll = scrollPercent;
            
            scrollMilestones.forEach(function(milestone) {
                if (scrollPercent >= milestone && !trackedMilestones.includes(milestone)) {
                    trackedMilestones.push(milestone);
                    trackEvent('scroll_depth', 'engagement', milestone + '%', milestone);
                }
            });
        }
    });
}

// Track time on page
function trackTimeOnPage() {
    const startTime = Date.now();
    
    window.addEventListener('beforeunload', function() {
        const timeOnPage = Math.round((Date.now() - startTime) / 1000);
        trackEvent('time_on_page', 'engagement', 'seconds', timeOnPage);
    });
}

// FAQ Section Functionality
document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            if (isActive) {
                item.classList.remove('active');
            } else {
                item.classList.add('active');
            }
        });
    });
});

// Newsletter Form Handling
document.addEventListener('DOMContentLoaded', function() {
    const newsletterForm = document.getElementById('newsletterForm');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const newsletterData = {
                name: formData.get('name'),
                email: formData.get('email'),
                interest: formData.get('interest')
            };
            
            // Basic validation
            if (!newsletterData.name || !newsletterData.email) {
                alert('Lütfen tüm alanları doldurun.');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(newsletterData.email)) {
                alert('Lütfen geçerli bir e-posta adresi giriniz.');
                return;
            }
            
            // Create WhatsApp message for newsletter subscription
            const whatsappMessage = `📧 *DC TEKNİK - Newsletter Aboneliği*

👤 *Ad Soyad:* ${newsletterData.name}
📧 *E-posta:* ${newsletterData.email}
🎯 *İlgi Alanı:* ${newsletterData.interest || 'Belirtilmemiş'}

---
Bu abonelik talebi dcteknik.com web sitesinden gönderilmiştir.
Tarih: ${new Date().toLocaleString('tr-TR')}`;

            const whatsappUrl = `https://wa.me/905353562469?text=${encodeURIComponent(whatsappMessage)}`;
            
            // Open WhatsApp
            window.open(whatsappUrl, '_blank');
            
            // Show success message
            alert('Newsletter aboneliğiniz WhatsApp üzerinden gönderildi! En kısa sürede e-posta listemize ekleneceksiniz.');
            
            // Reset form
            this.reset();
            
            // Track newsletter subscription
            if (typeof gtag !== 'undefined') {
                gtag('event', 'newsletter_subscribe', {
                    'event_category': 'engagement',
                    'event_label': newsletterData.interest || 'all',
                    'value': 1
                });
            }
        });
    }
});

// Social Media Sharing Functions
function shareOnFacebook() {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent('DC TEKNİK - Sultanbeyli Dinamocu Servisi');
    const description = encodeURIComponent('Dinamo, alternatör ve marş motoru tamirinde uzman ekibimizle kaliteli hizmet sunuyoruz.');
    
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${title} - ${description}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
    
    // Track sharing
    if (typeof gtag !== 'undefined') {
        gtag('event', 'share', {
            'event_category': 'social',
            'event_label': 'facebook',
            'value': 1
        });
    }
}

function shareOnTwitter() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('DC TEKNİK - Sultanbeyli\'nin güvenilir dinamocu servisi. Dinamo, alternatör ve marş motoru tamiri.');
    const hashtags = encodeURIComponent('dinamocu,dinamo,alternator,marşmotoru,sultanbeyli,istanbul');
    
    const twitterUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}&hashtags=${hashtags}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
    
    // Track sharing
    if (typeof gtag !== 'undefined') {
        gtag('event', 'share', {
            'event_category': 'social',
            'event_label': 'twitter',
            'value': 1
        });
    }
}

function shareOnWhatsApp() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('DC TEKNİK - Sultanbeyli\'nin güvenilir dinamocu servisi. Dinamo, alternatör ve marş motoru tamiri. ' + window.location.href);
    
    const whatsappUrl = `https://wa.me/?text=${text}`;
    window.open(whatsappUrl, '_blank');
    
    // Track sharing
    if (typeof gtag !== 'undefined') {
        gtag('event', 'share', {
            'event_category': 'social',
            'event_label': 'whatsapp',
            'value': 1
        });
    }
}

function shareOnLinkedIn() {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent('DC TEKNİK - Sultanbeyli Dinamocu Servisi');
    const summary = encodeURIComponent('Dinamo, alternatör ve marş motoru tamirinde uzman ekibimizle kaliteli hizmet sunuyoruz.');
    
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}&summary=${summary}`;
    window.open(linkedinUrl, '_blank', 'width=600,height=400');
    
    // Track sharing
    if (typeof gtag !== 'undefined') {
        gtag('event', 'share', {
            'event_category': 'social',
            'event_label': 'linkedin',
            'value': 1
        });
    }
}

function copyPageLink() {
    const url = window.location.href;
    
    if (navigator.clipboard && window.isSecureContext) {
        // Use modern clipboard API
        navigator.clipboard.writeText(url).then(() => {
            showCopyNotification('Link kopyalandı!');
        }).catch(() => {
            fallbackCopyTextToClipboard(url);
        });
    } else {
        // Fallback for older browsers
        fallbackCopyTextToClipboard(url);
    }
    
    // Track sharing
    if (typeof gtag !== 'undefined') {
        gtag('event', 'share', {
            'event_category': 'social',
            'event_label': 'copy_link',
            'value': 1
        });
    }
}

function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showCopyNotification('Link kopyalandı!');
    } catch (err) {
        showCopyNotification('Link kopyalanamadı. Lütfen manuel olarak kopyalayın.');
    }
    
    document.body.removeChild(textArea);
}

function showCopyNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'copy-notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
        z-index: 10000;
        font-size: 14px;
        font-weight: 500;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Initialize analytics tracking
document.addEventListener('DOMContentLoaded', function() {
    // Track initial page view
    trackPageView('DC TEKNİK - Ana Sayfa');
    
    // Track scroll depth
    trackScrollDepth();
    
    // Track time on page
    trackTimeOnPage();
    
    // Track contact form submissions
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            const serviceType = this.querySelector('select[name="service"]').value;
            trackFormSubmission('contact_form', serviceType);
        });
    }
    
    // Track appointment form submissions
    const appointmentForm = document.getElementById('appointmentForm');
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', function(e) {
            const serviceType = this.querySelector('select[name="serviceType"]').value;
            trackFormSubmission('appointment_form', serviceType);
        });
    }
    
    // Track WhatsApp button clicks
    const whatsappButtons = document.querySelectorAll('.btn-whatsapp, [href*="wa.me"]');
    whatsappButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            trackButtonClick('whatsapp_contact', 'header');
        });
    });
    
    // Track phone number clicks
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    phoneLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            trackButtonClick('phone_call', 'contact');
        });
    });
    
    // Track map interactions
    const mapActions = document.querySelectorAll('.map-action-btn');
    mapActions.forEach(function(action) {
        action.addEventListener('click', function() {
            const actionType = this.textContent.includes('Yol Tarifi') ? 'directions' : 'open_maps';
            trackButtonClick('map_action', actionType);
        });
    });
    
    // Track gallery image clicks
    const galleryImages = document.querySelectorAll('.gallery-image');
    galleryImages.forEach(function(image) {
        image.addEventListener('click', function() {
            trackEvent('gallery_image_click', 'engagement', 'gallery', 1);
        });
    });
    
    // Track service card clicks
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(function(card) {
        card.addEventListener('click', function() {
            const serviceName = this.querySelector('h3').textContent;
            trackEvent('service_card_click', 'engagement', serviceName, 1);
        });
    });
}); 