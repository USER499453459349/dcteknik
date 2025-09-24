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

// Initialize all functions when page loads
document.addEventListener('DOMContentLoaded', () => {
    initTooltips();
    
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