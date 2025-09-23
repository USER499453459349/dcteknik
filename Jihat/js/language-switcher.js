// Language Switcher functionality for DC TEKNİK website
class LanguageSwitcher {
    constructor() {
        this.currentLanguage = this.getStoredLanguage() || 'tr';
        this.translations = window.translations;
        this.languageDirections = window.languageDirections;
        this.init();
    }

    init() {
        this.createLanguageSwitcher();
        this.loadLanguage(this.currentLanguage);
        this.bindEvents();
    }

    getStoredLanguage() {
        return localStorage.getItem('selectedLanguage') || 
               this.detectBrowserLanguage() || 
               'tr';
    }

    detectBrowserLanguage() {
        const browserLang = navigator.language || navigator.userLanguage;
        const langCode = browserLang.split('-')[0].toLowerCase();
        
        // Map browser language to our supported languages
        const languageMap = {
            'tr': 'tr',
            'en': 'en',
            'ku': 'ku',
            'ckb': 'ku', // Central Kurdish
            'kmr': 'ku', // Northern Kurdish
            'ru': 'ru'   // Russian
        };
        
        return languageMap[langCode] || 'tr';
    }

    createLanguageSwitcher() {
        const navContainer = document.querySelector('.nav-container');
        if (!navContainer) return;

0,        const languageSwitcher = document.createElement('div');
        languageSwitcher.className = 'language-switcher';
        languageSwitcher.innerHTML = `
            <div class="language-dropdown">
                <button class="language-btn" id="languageBtn">
                    <span class="language-flag" id="currentFlag">🇹🇷</span>
                    <span class="language-text" id="currentLang">TR</span>
                    <i class="fas fa-chevron-down"></i>
                </button>
                <div class="language-menu" id="languageMenu">
                    <div class="language-option" data-lang="tr">
                        <span class="language-flag">🇹🇷</span>
                        <span class="language-text">Türkçe</span>
                    </div>
                    <div class="language-option" data-lang="en">
                        <span class="language-flag">🇺🇸</span>
                        <span class="language-text">English</span>
                    </div>
                    <div class="language-option" data-lang="ku">
                        <span class="language-flag">🏴</span>
                        <span class="language-text">Kurdî</span>
                    </div>
                    <div class="language-option" data-lang="ru">
                        <span class="language-flag">🇷🇺</span>
                        <span class="language-text">Русский</span>
                    </div>
                </div>
            </div>
        `;

        // Insert before the nav-toggle
        const navToggle = navContainer.querySelector('.nav-toggle');
        if (navToggle) {
            navContainer.insertBefore(languageSwitcher, navToggle);
        } else {
            navContainer.appendChild(languageSwitcher);
        }
    }

    bindEvents() {
        const languageBtn = document.getElementById('languageBtn');
        const languageMenu = document.getElementById('languageMenu');
        const languageOptions = document.querySelectorAll('.language-option');

        if (languageBtn) {
            languageBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                languageMenu.classList.toggle('active');
            });
        }

        languageOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                const selectedLang = option.dataset.lang;
                this.switchLanguage(selectedLang);
                languageMenu.classList.remove('active');
            });
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.language-switcher')) {
                languageMenu.classList.remove('active');
            }
        });

        // Close dropdown on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                languageMenu.classList.remove('active');
            }
        });
    }

    switchLanguage(langCode) {
        if (langCode === this.currentLanguage) return;
        
        this.currentLanguage = langCode;
        this.storeLanguage(langCode);
        this.loadLanguage(langCode);
        this.updateLanguageSwitcher(langCode);
    }

    storeLanguage(langCode) {
        localStorage.setItem('selectedLanguage', langCode);
    }

    updateLanguageSwitcher(langCode) {
        const currentFlag = document.getElementById('currentFlag');
        const currentLang = document.getElementById('currentLang');
        
        const flagMap = {
            'tr': '🇹🇷',
            'en': '🇺🇸',
            'ku': '🏴',
            'ru': '🇷🇺'
        };
        
        const textMap = {
            'tr': 'TR',
            'en': 'EN',
            'ku': 'KU',
            'ru': 'RU'
        };

        if (currentFlag) currentFlag.textContent = flagMap[langCode];
        if (currentLang) currentLang.textContent = textMap[langCode];
    }

    loadLanguage(langCode) {
        if (!this.translations[langCode]) {
            console.warn(`Language ${langCode} not found, falling back to Turkish`);
            langCode = 'tr';
        }

        const t = this.translations[langCode];
        
        // Update document language and direction
        document.documentElement.lang = langCode;
        document.documentElement.dir = this.languageDirections[langCode] || 'ltr';
        
        // Update page title
        document.title = this.getPageTitle(langCode);
        
        // Update meta description
        this.updateMetaDescription(langCode);
        
        // Update navigation
        this.updateNavigation(t);
        
        // Update hero section
        this.updateHeroSection(t);
        
        // Update quick contact
        this.updateQuickContact(t);
        
        // Update services section
        this.updateServicesSection(t);
        
        // Update products section
        this.updateProductsSection(t);
        
        // Update gallery section
        this.updateGallerySection(t);
        
        // Update blog section
        this.updateBlogSection(t);
        
        // Update about section
        this.updateAboutSection(t);
        
        // Update contact section
        this.updateContactSection(t);
        
        // Update footer
        this.updateFooter(t);
        
        // Update form validation messages
        this.updateFormValidation(t);
        
        // Update WhatsApp messages
        this.updateWhatsAppMessages(langCode);
    }

    getPageTitle(langCode) {
        const titles = {
            'tr': 'Dinamocu Serdar - Sultanbeyli Dinamocu Servisi | Profesyonel Dinamo Tamiri',
            'en': 'Dinamocu Serdar - Sultanbeyli Dynamo Service | Professional Dynamo Repair',
            'ku': 'Dinamocu Serdar - Xizmeta Dînamo ya Sultanbeyli | Tamîrkirina Pîşeyî ya Dînamo',
            'ru': 'Dinamocu Serdar - Сервис Динамо Sultanbeyli | Профессиональный Ремонт Динамо'
        };
        return titles[langCode] || titles['tr'];
    }

    updateMetaDescription(langCode) {
        const descriptions = {
            'tr': 'Dinamocu Serdar - Sultanbeyli\'nin güvenilir dinamocu servisi. Dinamo tamiri, alternatör onarımı, marş motoru servisi. Atatürk Cad. No:312',
            'en': 'Dinamocu Serdar - Sultanbeyli\'s reliable dynamo service. Dynamo repair, alternator repair, starter motor service. Atatürk St. No:312',
            'ku': 'Dinamocu Serdar - Xizmeta dînamo ya pêbawer a Sultanbeyli. Tamîrkirina dînamo, tamîrkirina alternator, xizmeta motorê destpêkê. Atatürk Cad. No:312',
            'ru': 'Dinamocu Serdar - надежный сервис динамо в Sultanbeyli. Ремонт динамо, ремонт генератора, сервис стартера. ул. Ататюрк №312'
        };
        
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.content = descriptions[langCode] || descriptions['tr'];
        }
    }

    updateNavigation(t) {
        const navLinks = {
            'home': t.nav.home,
            'products': t.nav.products,
            'services': t.nav.services,
            'gallery': t.nav.gallery,
            'about': t.nav.about,
            'contact': t.nav.contact
        };

        Object.keys(navLinks).forEach(key => {
            const link = document.querySelector(`a[href="#${key}"]`);
            if (link) {
                link.textContent = navLinks[key];
            }
        });

        const blogLink = document.querySelector('a[href="blog.html"]');
        if (blogLink) {
            blogLink.textContent = t.nav.blog;
        }
    }

    updateHeroSection(t) {
        const heroTitle = document.querySelector('.hero-content h1');
        if (heroTitle) heroTitle.textContent = t.hero.title;

        const heroSubtitle = document.querySelector('.hero-content p');
        if (heroSubtitle) heroSubtitle.textContent = t.hero.subtitle;

        // Update stats
        const stats = document.querySelectorAll('.stat p');
        if (stats.length >= 3) {
            stats[0].textContent = t.hero.stats.experience;
            stats[1].textContent = t.hero.stats.customers;
            stats[2].textContent = t.hero.stats.service;
        }

        // Update buttons
        const buttons = document.querySelectorAll('.hero-buttons .btn');
        if (buttons.length >= 2) {
            buttons[0].textContent = t.hero.buttons.call;
            buttons[1].textContent = t.hero.buttons.services;
        }

        // Update hero card
        const heroCardTitle = document.querySelector('.hero-card h3');
        if (heroCardTitle) heroCardTitle.textContent = t.hero.card.title;
    }

    updateQuickContact(t) {
        const contactItems = document.querySelectorAll('.contact-item h4');
        if (contactItems.length >= 4) {
            contactItems[0].textContent = t.quickContact.phone;
            contactItems[1].textContent = t.quickContact.whatsapp;
            contactItems[2].textContent = t.quickContact.address;
            contactItems[3].textContent = t.quickContact.hours;
        }

        const addressText = document.querySelector('.contact-item:nth-child(3) p');
        if (addressText) addressText.textContent = t.quickContact.addressText;

        const hoursText = document.querySelector('.contact-item:nth-child(4) p');
        if (hoursText) hoursText.textContent = t.quickContact.hoursText;
    }

    updateServicesSection(t) {
        const sectionHeader = document.querySelector('#services .section-header');
        if (sectionHeader) {
            sectionHeader.querySelector('h2').textContent = t.services.title;
            sectionHeader.querySelector('p').textContent = t.services.subtitle;
        }

        // Update service cards
        const serviceCards = document.querySelectorAll('.service-card');
        const services = [t.services.dinamo, t.services.alternator, t.services.starter, t.services.electrical];
        
        serviceCards.forEach((card, index) => {
            if (services[index]) {
                const title = card.querySelector('h3');
                const description = card.querySelector('p');
                const features = card.querySelectorAll('li');
                
                if (title) title.textContent = services[index].title;
                if (description) description.textContent = services[index].description;
                
                features.forEach((feature, featureIndex) => {
                    if (services[index].features[featureIndex]) {
                        feature.textContent = services[index].features[featureIndex];
                    }
                });
            }
        });
    }

    updateProductsSection(t) {
        const sectionHeader = document.querySelector('#products .section-header');
        if (sectionHeader) {
            sectionHeader.querySelector('h2').textContent = t.products.title;
            sectionHeader.querySelector('p').textContent = t.products.subtitle;
        }

        // Update product cards
        const productCards = document.querySelectorAll('.product-card');
        const products = [t.products.dinamoTypes, t.products.alternator, t.products.starterMotor, t.products.spareParts];
        
        productCards.forEach((card, index) => {
            if (products[index]) {
                const title = card.querySelector('h3');
                const description = card.querySelector('p');
                const features = card.querySelectorAll('.product-features span');
                
                if (title) title.textContent = products[index].title;
                if (description) description.textContent = products[index].description;
                
                features.forEach((feature, featureIndex) => {
                    if (products[index].features[featureIndex]) {
                        feature.textContent = products[index].features[featureIndex];
                    }
                });
            }
        });
    }

    updateGallerySection(t) {
        const sectionHeader = document.querySelector('#gallery .section-header');
        if (sectionHeader) {
            sectionHeader.querySelector('h2').textContent = t.gallery.title;
            sectionHeader.querySelector('p').textContent = t.gallery.subtitle;
        }

        // Update gallery items
        const galleryItems = document.querySelectorAll('.gallery-placeholder h4');
        galleryItems.forEach((item, index) => {
            if (t.gallery.items[index]) {
                item.textContent = t.gallery.items[index];
            }
        });
    }

    updateBlogSection(t) {
        const sectionHeader = document.querySelector('.latest-blog .section-header');
        if (sectionHeader) {
            sectionHeader.querySelector('h2').textContent = t.blog.title;
            sectionHeader.querySelector('p').textContent = t.blog.subtitle;
        }

        // Update blog cards
        const blogCards = document.querySelectorAll('.blog-card');
        blogCards.forEach((card, index) => {
            if (t.blog.posts[index]) {
                const title = card.querySelector('h3 a');
                const excerpt = card.querySelector('.blog-card-content p');
                const category = card.querySelector('.blog-category');
                const readMore = card.querySelector('.read-more');
                
                if (title) title.textContent = t.blog.posts[index].title;
                if (excerpt) excerpt.textContent = t.blog.posts[index].excerpt;
                if (category) category.textContent = t.blog.posts[index].category;
                if (readMore) readMore.innerHTML = `${t.blog.readMore} <i class="fas fa-arrow-right"></i>`;
            }
        });

        // Update blog CTA button
        const blogCTA = document.querySelector('.blog-cta .btn');
        if (blogCTA) blogCTA.textContent = t.blog.viewAll;
    }

    updateAboutSection(t) {
        const sectionHeader = document.querySelector('#about .section-header');
        if (sectionHeader) {
            sectionHeader.querySelector('h2').textContent = t.about.title;
            sectionHeader.querySelector('p').textContent = t.about.subtitle;
        }

        // Update about description
        const aboutDescription = document.querySelector('#about .about-text p');
        if (aboutDescription) aboutDescription.textContent = t.about.description;

        // Update features
        const features = document.querySelectorAll('#about .feature');
        features.forEach((feature, index) => {
            if (t.about.features[index]) {
                const title = feature.querySelector('h4');
                const description = feature.querySelector('p');
                
                if (title) title.textContent = t.about.features[index].title;
                if (description) description.textContent = t.about.features[index].description;
            }
        });

        // Update stats
        const statBoxes = document.querySelectorAll('#about .stat-box');
        statBoxes.forEach((statBox, index) => {
            if (t.about.stats[index]) {
                const label = statBox.querySelector('p');
                if (label) label.textContent = t.about.stats[index].label;
            }
        });

        // Update about image
        const imageTitle = document.querySelector('#about .image-placeholder h3');
        const imageDescription = document.querySelector('#about .image-placeholder p');
        if (imageTitle) imageTitle.textContent = t.about.image.title;
        if (imageDescription) imageDescription.textContent = t.about.image.description;
    }

    updateContactSection(t) {
        const sectionHeader = document.querySelector('#contact .section-header');
        if (sectionHeader) {
            sectionHeader.querySelector('h2').textContent = t.contact.title;
            sectionHeader.querySelector('p').textContent = t.contact.subtitle;
        }

        // Update contact info
        const contactInfoTitle = document.querySelector('#contact .contact-info-section h3');
        if (contactInfoTitle) contactInfoTitle.textContent = t.contact.info.title;

        const contactDetails = document.querySelectorAll('#contact .contact-detail h4');
        if (contactDetails.length >= 4) {
            contactDetails[0].textContent = t.contact.info.phone;
            contactDetails[1].textContent = t.contact.info.email;
            contactDetails[2].textContent = t.contact.info.address;
            contactDetails[3].textContent = t.contact.info.hours;
        }

        // Update form
        const formTitle = document.querySelector('#contact .contact-form-section h3');
        if (formTitle) formTitle.textContent = t.contact.form.title;

        const formInputs = document.querySelectorAll('#contact .contact-form input, #contact .contact-form select, #contact .contact-form textarea');
        const formLabels = [t.contact.form.name, t.contact.form.phone, t.contact.form.email, t.contact.form.service, t.contact.form.message];
        
        formInputs.forEach((input, index) => {
            if (formLabels[index]) {
                input.placeholder = formLabels[index];
            }
        });

        // Update service options
        const serviceSelect = document.querySelector('#contact .contact-form select[name="service"]');
        if (serviceSelect) {
            const options = serviceSelect.querySelectorAll('option');
            options.forEach((option, index) => {
                if (index > 0 && t.contact.form.services[index - 1]) {
                    option.textContent = t.contact.form.services[index - 1];
                }
            });
        }

        // Update submit button
        const submitButton = document.querySelector('#contact .contact-form button[type="submit"]');
        if (submitButton) submitButton.textContent = t.contact.form.submit;
    }

    updateFooter(t) {
        const footerDescription = document.querySelector('.footer-section p');
        if (footerDescription) footerDescription.textContent = t.footer.description;

        const footerSections = document.querySelectorAll('.footer-section h4');
        if (footerSections.length >= 3) {
            footerSections[0].textContent = t.footer.services;
            footerSections[1].textContent = t.footer.corporate;
            footerSections[2].textContent = t.footer.contact;
        }

        const copyright = document.querySelector('.footer-bottom p');
        if (copyright) copyright.textContent = t.footer.copyright;
    }

    updateFormValidation(t) {
        // Store validation messages for use in form handling
        window.formValidationMessages = t.validation;
    }

    updateWhatsAppMessages(langCode) {
        const whatsappMessages = {
            'tr': 'Merhaba Dinamocu Serdar! Web sitenizden geliyorum. Bilgi almak istiyorum.',
            'en': 'Hello Dinamocu Serdar! I am coming from your website. I want to get information.',
            'ku': 'Silav Dinamocu Serdar! Ez ji malpera we têm. Ez dixwazim agahî bigirim.',
            'ru': 'Привет Dinamocu Serdar! Я пришел с вашего сайта. Хочу получить информацию.'
        };

        // Update WhatsApp links
        const whatsappLinks = document.querySelectorAll('a[href*="wa.me"]');
        whatsappLinks.forEach(link => {
            const url = new URL(link.href);
            url.searchParams.set('text', whatsappMessages[langCode] || whatsappMessages['tr']);
            link.href = url.toString();
        });
    }
}

// Initialize language switcher when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {  
    new LanguageSwitcher();
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LanguageSwitcher;
}



 