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
    elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        const translation = getTranslation(key, language);
        if (translation) {
            element.textContent = translation;
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
    const keys = key.split('.');
    let translation = translations[language];
    
    for (const k of keys) {
        if (translation && translation[k]) {
            translation = translation[k];
        } else {
            // Fallback to Turkish if translation not found
            translation = translations['tr'];
            for (const fallbackKey of keys) {
                if (translation && translation[fallbackKey]) {
                    translation = translation[fallbackKey];
                } else {
                    return null;
                }
            }
            break;
        }
    }
    
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
});
