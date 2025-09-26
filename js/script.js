// Language switching functionality
let currentLanguage = 'tr'; // Default language

// Initialize language system
document.addEventListener('DOMContentLoaded', function() {
    // Load saved language or default to Turkish
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'tr';
    changeLanguage(savedLanguage);
    
    // Set up language selector event listener
    const languageSelect = document.getElementById('languageSelect');
    if (languageSelect) {
        languageSelect.value = savedLanguage;
        languageSelect.addEventListener('change', function() {
            changeLanguage(this.value);
        });
    }
});

// Change language function
function changeLanguage(language) {
    console.log('Changing language to:', language);
    currentLanguage = language;
    
    // Save language preference
    localStorage.setItem('selectedLanguage', language);
    
    // Update language selector
    const languageSelect = document.getElementById('languageSelect');
    if (languageSelect) {
        languageSelect.value = language;
    }
    
    // Update document direction for RTL languages
    const direction = languageDirections[language] || 'ltr';
    document.body.setAttribute('dir', direction);
    document.documentElement.setAttribute('lang', language);
    
    // Update all translatable elements
    const elements = document.querySelectorAll('[data-translate]');
    console.log('Found', elements.length, 'translatable elements');
    
           elements.forEach(element => {
               const key = element.getAttribute('data-translate');
               const translation = getTranslation(key, language);
               console.log('Key:', key, 'Translation:', translation);
               
               if (translation) {
                   element.textContent = translation;
               } else {
                   console.warn('No translation found for key:', key, 'in language:', language);
               }
           });
           
           // Handle placeholder translations
           const placeholderElements = document.querySelectorAll('[data-translate-placeholder]');
           placeholderElements.forEach(element => {
               const key = element.getAttribute('data-translate-placeholder');
               const translation = getTranslation(key, language);
               
               if (translation) {
                   element.placeholder = translation;
               }
           });
           
           // Handle select option translations
           const selectOptions = document.querySelectorAll('option[data-translate]');
           selectOptions.forEach(option => {
               const key = option.getAttribute('data-translate');
               const translation = getTranslation(key, language);
               
               if (translation) {
                   option.textContent = translation;
               }
           });
    
    // Update page title
    const titleTranslation = getTranslation('hero.title', language);
    if (titleTranslation) {
        document.title = titleTranslation + ' - DC TEKNİK';
    }
}

// Get translation for a specific key and language
function getTranslation(key, language) {
    console.log('Getting translation for key:', key, 'language:', language);
    
    // Check if translations object exists
    if (!translations) {
        console.error('Translations object not found');
        return null;
    }
    
    // Check if language exists
    if (!translations[language]) {
        console.warn('Language not found:', language, 'Available languages:', Object.keys(translations));
        return null;
    }
    
    const keys = key.split('.');
    let translation = translations[language];
    
    for (const k of keys) {
        if (translation && typeof translation === 'object' && translation[k]) {
            translation = translation[k];
        } else {
            console.warn('Translation key not found:', k, 'in', language);
            // Fallback to Turkish if translation not found
            if (translations['tr']) {
                translation = translations['tr'];
                for (const fallbackKey of keys) {
                    if (translation && typeof translation === 'object' && translation[fallbackKey]) {
                        translation = translation[fallbackKey];
                    } else {
                        console.warn('Fallback translation not found for key:', fallbackKey);
                        return null;
                    }
                }
            }
            break;
        }
    }
    
    console.log('Final translation:', translation);
    return translation;
}

// Mobile menu toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
    }
});

// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const animateElements = document.querySelectorAll('.hero-content, .hero-card, .contact-item, .service-card');
    animateElements.forEach(el => observer.observe(el));
    
    // Contact form functionality
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
});

// Contact form submission handler
function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    
    // Get form values
    const name = formData.get('name');
    const phone = formData.get('phone');
    const email = formData.get('email');
    const service = formData.get('service');
    const message = formData.get('message');
    
    // Validate form
    if (!name || !phone || !service) {
        showNotification('Lütfen zorunlu alanları doldurun!', 'error');
        return;
    }
    
    // Create WhatsApp message
    const whatsappMessage = createWhatsAppMessage(name, phone, email, service, message);
    
    // Open WhatsApp
    const whatsappUrl = `https://wa.me/905353562469?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappUrl, '_blank');
    
    // Show success message
    showNotification('WhatsApp ile iletişime geçiliyor...', 'success');
    
    // Reset form
    form.reset();
}

// Create WhatsApp message
function createWhatsAppMessage(name, phone, email, service, message) {
    const serviceNames = {
        'dinamo': 'Dinamo Tamiri',
        'alternator': 'Alternatör Servisi',
        'mars': 'Marş Motoru',
        'elektrik': 'Genel Elektrik',
        'diger': 'Diğer'
    };
    
    let messageText = `Merhaba! Web sitenizden iletişim formu dolduruldu.\n\n`;
    messageText += `👤 Ad Soyad: ${name}\n`;
    messageText += `📞 Telefon: ${phone}\n`;
    if (email) messageText += `📧 E-posta: ${email}\n`;
    messageText += `🔧 Hizmet: ${serviceNames[service] || service}\n`;
    if (message) messageText += `💬 Mesaj: ${message}\n\n`;
    messageText += `Lütfen en kısa sürede dönüş yapın. Teşekkürler!`;
    
    return messageText;
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        font-weight: 500;
        max-width: 300px;
        animation: slideInRight 0.3s ease-out;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 5000);
}
