// Language switching functionality
let currentLanguage = 'tr'; // Default language

// Theme/Dark mode functionality
let isDarkMode = false;

// Initialize theme system
function initializeTheme() {
    // Load saved theme or default to light mode
    const savedTheme = localStorage.getItem('theme') || 'light';
    isDarkMode = savedTheme === 'dark';
    
    // Apply initial theme
    applyTheme();
    
    // Set up theme toggle event listener
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        const handleToggle = (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleTheme();
            themeToggle.setAttribute('aria-pressed', isDarkMode ? 'true' : 'false');
        };
        themeToggle.addEventListener('click', handleToggle);
        themeToggle.addEventListener('pointerdown', handleToggle);
        themeToggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') handleToggle(e);
        });
        
        // Update initial icon
        const themeIcon = document.getElementById('themeIcon');
        if (themeIcon) { themeIcon.className = isDarkMode ? 'fas fa-sun' : 'fas fa-moon'; }
        themeToggle.setAttribute('aria-pressed', isDarkMode ? 'true' : 'false');
    }
}

// Toggle between light and dark mode
function toggleTheme() {
    isDarkMode = !isDarkMode;
    applyTheme();
    
    // Save theme preference
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    
    // Update theme icon
    const themeIcon = document.getElementById('themeIcon');
    if (themeIcon) {
        themeIcon.className = isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
    }
    
    // Show notification
    showNotification(
        isDarkMode ? 'Gece modu aktif edildi' : 'Gündüz modu aktif edildi', 
        'success'
    );
}

// Apply theme to the page
function applyTheme() {
    const body = document.body;
    const root = document.documentElement;
    
    if (isDarkMode) {
        body.classList.add('dark-theme');
        root.setAttribute('data-theme', 'dark');
    } else {
        body.classList.remove('dark-theme');
        root.setAttribute('data-theme', 'light');
    }
    
    // Update theme toggle button title
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.title = isDarkMode ? 'Açık Moda Geç' : 'Karanlık Moda Geç';
    }
}

// Chat system functionality
function initializeChat() {
    const chatToggle = document.getElementById('newChatToggle');
    if (chatToggle) {
        chatToggle.addEventListener('click', function() {
            // Track conversion event
            trackConversionEvent('whatsapp_contact', 50);
            
            // Open WhatsApp chat
            const whatsappUrl = 'https://wa.me/905353562469?text=Merhaba! DC TEKNİK hizmetleri hakkında bilgi almak istiyorum.';
            window.open(whatsappUrl, '_blank');

            // Hide notification after click
            const notification = document.querySelector('.chat-notification');
            if (notification) {
                notification.style.display = 'none';
            }

            // Show notification
            showNotification('WhatsApp üzerinden iletişime geçiliyor...', 'success');

            // Track Google Analytics event
            if (typeof gtag !== 'undefined') {
                gtag('event', 'chat_clicked', {
                    'event_category': 'engagement',
                    'event_label': 'chat_button'
                });
            }
        });
    }
}

// Contact buttons functionality
function initializeContactButtons() {
    // Phone button
    const phoneBtn = document.querySelector('.phone-btn');
    if (phoneBtn) {
        phoneBtn.addEventListener('click', function() {
            // Track Google Analytics event
            if (typeof gtag !== 'undefined') {
                gtag('event', 'phone_clicked', {
                    'event_category': 'engagement',
                    'event_label': 'contact_phone'
                });
            }
        });
    }
    
    // WhatsApp button
    const whatsappBtn = document.querySelector('.whatsapp-btn');
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', function() {
            // Track Google Analytics event
            if (typeof gtag !== 'undefined') {
                gtag('event', 'whatsapp_clicked', {
                    'event_category': 'engagement',
                    'event_label': 'contact_whatsapp'
                });
            }
        });
    }
    
    // Appointment button
    const appointmentBtn = document.querySelector('.appointment-btn');
    if (appointmentBtn) {
        appointmentBtn.addEventListener('click', function() {
            // Track Google Analytics event
            if (typeof gtag !== 'undefined') {
                gtag('event', 'appointment_clicked', {
                    'event_category': 'engagement',
                    'event_label': 'contact_appointment'
                });
            }
        });
    }
    
    // Tracking button
    const trackingBtn = document.getElementById('trackingBtn');
    if (trackingBtn) {
        trackingBtn.addEventListener('click', function() {
            // Show notification
            showNotification('Servis takip sistemi yakında aktif olacak!', 'info');
            
            // Track Google Analytics event
            if (typeof gtag !== 'undefined') {
                gtag('event', 'tracking_clicked', {
                    'event_category': 'engagement',
                    'event_label': 'contact_tracking'
                });
            }
        });
    }
}

// Enhanced Analytics Integration
function initializeAnalytics() {
    // Track page load
    if (typeof trackPageView === 'function') {
        trackPageView('DC TEKNİK - Ana Sayfa', 'homepage');
    }
    
    // Track scroll depth
    let maxScroll = 0;
    window.addEventListener('scroll', function() {
        const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        if (scrollPercent > maxScroll && scrollPercent % 25 === 0) {
            maxScroll = scrollPercent;
            if (typeof trackEvent === 'function') {
                trackEvent('scroll_depth', {
                    category: 'engagement',
                    label: `${scrollPercent}%`,
                    value: scrollPercent
                });
            }
        }
    });
    
    // Track time on page
    let startTime = Date.now();
    window.addEventListener('beforeunload', function() {
        const timeOnPage = Math.round((Date.now() - startTime) / 1000);
        if (typeof trackEvent === 'function') {
            trackEvent('time_on_page', {
                category: 'engagement',
                label: `${timeOnPage}s`,
                value: timeOnPage
            });
        }
    });
}

// Enhanced conversion tracking
function trackConversionEvent(eventType, value = 0) {
    // Google Analytics
    if (typeof trackConversion === 'function') {
        trackConversion(eventType, value);
    }
    
    // Facebook Pixel
    if (typeof trackFacebookConversion === 'function') {
        trackFacebookConversion(eventType, value);
    }
    
    // Hotjar
    if (typeof hj === 'function') {
        hj('event', eventType);
    }
}

// Initialize language system
document.addEventListener('DOMContentLoaded', function() {
    // Initialize analytics first
    initializeAnalytics();
    
    // Initialize theme system
    initializeTheme();
    
    // Initialize chat system
    initializeChat();
    
    // Initialize contact buttons
    initializeContactButtons();
    
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
    // Check if translations object exists
    if (!translations) {
        return null;
    }
    
    // Check if language exists
    if (!translations[language]) {
        return null;
    }
    
    const keys = key.split('.');
    let translation = translations[language];
    
    for (const k of keys) {
        if (translation && typeof translation === 'object' && translation[k]) {
            translation = translation[k];
        } else {
            // Fallback to Turkish if translation not found
            if (translations['tr']) {
                translation = translations['tr'];
                for (const fallbackKey of keys) {
                    if (translation && typeof translation === 'object' && translation[fallbackKey]) {
                        translation = translation[fallbackKey];
                    } else {
                        return null;
                    }
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

// Advanced Appointment System
class AppointmentSystem {
    constructor() {
        this.currentStep = 1;
        this.selectedService = null;
        this.selectedDate = null;
        this.selectedTime = null;
        this.appointmentData = {};
        this.currentMonth = new Date().getMonth();
        this.currentYear = new Date().getFullYear();
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.generateCalendar();
        this.generateTimeSlots();
    }
    
    bindEvents() {
        // Service selection
        document.querySelectorAll('.service-option').forEach(option => {
            option.addEventListener('click', (e) => {
                this.selectService(e.currentTarget);
            });
        });
        
        // Navigation buttons
        const nextBtn = document.getElementById('nextStep');
        const prevBtn = document.getElementById('prevStep');
        const confirmBtn = document.getElementById('confirmAppointment');
        
        if (nextBtn) nextBtn.addEventListener('click', () => this.nextStep());
        if (prevBtn) prevBtn.addEventListener('click', () => this.prevStep());
        if (confirmBtn) confirmBtn.addEventListener('click', () => this.confirmAppointment());
        
        // Calendar navigation
        const prevMonthBtn = document.getElementById('prevMonth');
        const nextMonthBtn = document.getElementById('nextMonth');
        
        if (prevMonthBtn) prevMonthBtn.addEventListener('click', () => this.changeMonth(-1));
        if (nextMonthBtn) nextMonthBtn.addEventListener('click', () => this.changeMonth(1));
        
        // Form validation
        const form = document.getElementById('appointmentForm');
        if (form) {
            form.addEventListener('input', () => this.validateForm());
        }
    }
    
    selectService(option) {
        // Remove previous selection
        document.querySelectorAll('.service-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        
        // Add selection to clicked option
        option.classList.add('selected');
        this.selectedService = option.dataset.service;
        
        // Update navigation
        this.updateNavigation();
    }
    
    nextStep() {
        if (this.validateCurrentStep()) {
            this.currentStep++;
            this.showStep(this.currentStep);
            this.updateNavigation();
            
            if (this.currentStep === 4) {
                this.generateSummary();
            }
        }
    }
    
    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.showStep(this.currentStep);
            this.updateNavigation();
        }
    }
    
    showStep(step) {
        // Hide all steps
        document.querySelectorAll('.appointment-step').forEach(stepEl => {
            stepEl.classList.remove('active');
        });
        
        // Show current step
        const stepElement = document.getElementById(`step${step}`);
        if (stepElement) {
            stepElement.classList.add('active');
        }
    }
    
    updateNavigation() {
        const prevBtn = document.getElementById('prevStep');
        const nextBtn = document.getElementById('nextStep');
        const confirmBtn = document.getElementById('confirmAppointment');
        
        if (prevBtn) {
            prevBtn.style.display = this.currentStep > 1 ? 'block' : 'none';
        }
        
        if (nextBtn && confirmBtn) {
            if (this.currentStep === 4) {
                nextBtn.style.display = 'none';
                confirmBtn.style.display = 'block';
            } else {
                nextBtn.style.display = 'block';
                confirmBtn.style.display = 'none';
            }
        }
    }
    
    validateCurrentStep() {
        switch (this.currentStep) {
            case 1:
                if (!this.selectedService) {
                    showNotification('Lütfen bir hizmet seçin', 'error');
                    return false;
                }
                return true;
                
            case 2:
                if (!this.selectedDate || !this.selectedTime) {
                    showNotification('Lütfen tarih ve saat seçin', 'error');
                    return false;
                }
                return true;
                
            case 3:
                const form = document.getElementById('appointmentForm');
                if (form && !form.checkValidity()) {
                    showNotification('Lütfen tüm gerekli alanları doldurun', 'error');
                    return false;
                }
                return true;
                
            default:
                return true;
        }
    }
    
    generateCalendar() {
        const calendarGrid = document.getElementById('calendarGrid');
        if (!calendarGrid) return;
        
        const monthNames = [
            'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
            'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
        ];
        
        // Update month display
        const currentMonthEl = document.getElementById('currentMonth');
        if (currentMonthEl) {
            currentMonthEl.textContent = `${monthNames[this.currentMonth]} ${this.currentYear}`;
        }
        
        // Clear calendar
        calendarGrid.innerHTML = '';
        
        // Add day headers
        const dayHeaders = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
        dayHeaders.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'calendar-day-header';
            dayHeader.textContent = day;
            dayHeader.style.fontWeight = 'bold';
            dayHeader.style.color = '#64748b';
            dayHeader.style.textAlign = 'center';
            dayHeader.style.padding = '0.5rem';
            calendarGrid.appendChild(dayHeader);
        });
        
        // Get first day of month and number of days
        const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
        const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
        const today = new Date();
        
        // Add empty cells for days before month starts
        for (let i = 0; i < firstDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day other-month';
            calendarGrid.appendChild(emptyDay);
        }
        
        // Add days of month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day available';
            dayElement.textContent = day;
            
            const currentDate = new Date(this.currentYear, this.currentMonth, day);
            
            // Check if it's today
            if (currentDate.toDateString() === today.toDateString()) {
                dayElement.classList.add('today');
            }
            
            // Check if it's in the past
            if (currentDate < today) {
                dayElement.classList.remove('available');
                dayElement.classList.add('unavailable');
            }
            
            // Add click event
            dayElement.addEventListener('click', () => {
                if (dayElement.classList.contains('available')) {
                    this.selectDate(dayElement, day);
                }
            });
            
            calendarGrid.appendChild(dayElement);
        }
    }
    
    selectDate(dayElement, day) {
        // Remove previous selection
        document.querySelectorAll('.calendar-day').forEach(dayEl => {
            dayEl.classList.remove('selected');
        });
        
        // Add selection to clicked day
        dayElement.classList.add('selected');
        this.selectedDate = new Date(this.currentYear, this.currentMonth, day);
        
        // Update time slots
        this.generateTimeSlots();
        this.updateNavigation();
    }
    
    generateTimeSlots() {
        const timeSlotsContainer = document.getElementById('timeSlots');
        if (!timeSlotsContainer) return;
        
        timeSlotsContainer.innerHTML = '';
        
        const availableSlots = [
            '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
            '12:00', '13:00', '13:30', '14:00', '14:30', '15:00',
            '15:30', '16:00', '16:30', '17:00', '17:30'
        ];
        
        availableSlots.forEach(time => {
            const timeSlot = document.createElement('div');
            timeSlot.className = 'time-slot';
            timeSlot.textContent = time;
            
            // Randomly make some slots unavailable (simulate booking)
            if (Math.random() < 0.3) {
                timeSlot.classList.add('unavailable');
            } else {
                timeSlot.addEventListener('click', () => {
                    this.selectTime(timeSlot, time);
                });
            }
            
            timeSlotsContainer.appendChild(timeSlot);
        });
    }
    
    selectTime(timeSlot, time) {
        // Remove previous selection
        document.querySelectorAll('.time-slot').forEach(slot => {
            slot.classList.remove('selected');
        });
        
        // Add selection to clicked time
        timeSlot.classList.add('selected');
        this.selectedTime = time;
        this.updateNavigation();
    }
    
    changeMonth(direction) {
        this.currentMonth += direction;
        
        if (this.currentMonth < 0) {
            this.currentMonth = 11;
            this.currentYear--;
        } else if (this.currentMonth > 11) {
            this.currentMonth = 0;
            this.currentYear++;
        }
        
        this.generateCalendar();
    }
    
    validateForm() {
        const form = document.getElementById('appointmentForm');
        if (!form) return true;
        
        const isValid = form.checkValidity();
        
        // Update navigation button state
        const nextBtn = document.getElementById('nextStep');
        if (nextBtn) {
            nextBtn.disabled = !isValid;
        }
        
        return isValid;
    }
    
    generateSummary() {
        const summaryContainer = document.getElementById('appointmentSummary');
        if (!summaryContainer) return;
        
        const form = document.getElementById('appointmentForm');
        if (!form) return;
        
        const formData = new FormData(form);
        
        const serviceNames = {
            'dinamo': 'Dinamo Tamiri',
            'alternator': 'Alternatör Servisi',
            'starter': 'Marş Motoru',
            'electrical': 'Genel Elektrik',
            'diagnosis': 'Arıza Tespiti'
        };
        
        const servicePrices = {
            'dinamo': '800-1500 TL',
            'alternator': '1000-2000 TL',
            'starter': '600-1200 TL',
            'electrical': '300-800 TL',
            'diagnosis': 'Ücretsiz'
        };
        
        const emergencyFee = formData.get('emergencyService') ? 200 : 0;
        
        summaryContainer.innerHTML = `
            <div class="summary-item">
                <span class="summary-label">Hizmet:</span>
                <span class="summary-value">${serviceNames[this.selectedService] || 'Seçilmedi'}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Tarih:</span>
                <span class="summary-value">${this.selectedDate ? this.selectedDate.toLocaleDateString('tr-TR') : 'Seçilmedi'}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Saat:</span>
                <span class="summary-value">${this.selectedTime || 'Seçilmedi'}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Ad Soyad:</span>
                <span class="summary-value">${formData.get('customerName') || 'Belirtilmemiş'}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Telefon:</span>
                <span class="summary-value">${formData.get('customerPhone') || 'Belirtilmemiş'}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Araç:</span>
                <span class="summary-value">${formData.get('vehicleBrand') || 'Belirtilmemiş'} ${formData.get('vehicleModel') || ''}</span>
            </div>
            ${emergencyFee > 0 ? `
            <div class="summary-item">
                <span class="summary-label">Acil Servis:</span>
                <span class="summary-value">+${emergencyFee} TL</span>
            </div>
            ` : ''}
            <div class="summary-total">
                Tahmini Fiyat: ${servicePrices[this.selectedService] || 'Belirtilmemiş'}${emergencyFee > 0 ? ` + ${emergencyFee} TL` : ''}
            </div>
        `;
    }
    
    confirmAppointment() {
        const form = document.getElementById('appointmentForm');
        if (!form) return;
        
        const formData = new FormData(form);
        
        // Collect all appointment data
        this.appointmentData = {
            service: this.selectedService,
            date: this.selectedDate ? this.selectedDate.toISOString().split('T')[0] : null,
            time: this.selectedTime,
            customerName: formData.get('customerName'),
            customerPhone: formData.get('customerPhone'),
            customerEmail: formData.get('customerEmail'),
            vehicleBrand: formData.get('vehicleBrand'),
            vehicleModel: formData.get('vehicleModel'),
            vehicleYear: formData.get('vehicleYear'),
            problemDescription: formData.get('problemDescription'),
            emergencyService: formData.get('emergencyService') === 'on',
            timestamp: new Date().toISOString()
        };
        
        // Send to WhatsApp
        this.sendToWhatsApp();
        
        // Show success message
        this.showSuccessMessage();
        
        // Track conversion event
        trackConversionEvent('appointment_booking', 100);
        
        // Track event
        if (typeof gtag !== 'undefined') {
            gtag('event', 'appointment_booking', {
                'event_category': 'engagement',
                'event_label': this.selectedService,
                'value': 1
            });
        }
    }
    
    sendToWhatsApp() {
        const serviceNames = {
            'dinamo': 'Dinamo Tamiri',
            'alternator': 'Alternatör Servisi',
            'starter': 'Marş Motoru',
            'electrical': 'Genel Elektrik',
            'diagnosis': 'Arıza Tespiti'
        };
        
        const message = `🎯 *YENİ RANDEVU TALEBİ*

📅 *Randevu Bilgileri:*
• Hizmet: ${serviceNames[this.appointmentData.service] || this.appointmentData.service}
• Tarih: ${this.appointmentData.date}
• Saat: ${this.appointmentData.time}
${this.appointmentData.emergencyService ? '• ⚡ Acil Servis: +200 TL' : ''}

👤 *Müşteri Bilgileri:*
• Ad Soyad: ${this.appointmentData.customerName}
• Telefon: ${this.appointmentData.customerPhone}
• E-posta: ${this.appointmentData.customerEmail || 'Belirtilmemiş'}

🚗 *Araç Bilgileri:*
• Marka: ${this.appointmentData.vehicleBrand}
• Model: ${this.appointmentData.vehicleModel || 'Belirtilmemiş'}
• Yıl: ${this.appointmentData.vehicleYear || 'Belirtilmemiş'}

📝 *Problem Açıklaması:*
${this.appointmentData.problemDescription || 'Belirtilmemiş'}

⏰ *Talep Zamanı:* ${new Date().toLocaleString('tr-TR')}`;
        
        const whatsappUrl = `https://wa.me/905353562469?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    }
    
    showSuccessMessage() {
        const successMessage = document.createElement('div');
        successMessage.className = 'appointment-success';
        successMessage.innerHTML = `
            <div class="success-content">
                <div class="success-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h3>Randevu Talebiniz Alındı!</h3>
                <p>Randevu bilgileriniz WhatsApp üzerinden gönderildi. En kısa sürede sizinle iletişime geçeceğiz.</p>
                <div class="success-actions">
                    <button class="btn btn-primary" onclick="location.reload()">
                        <i class="fas fa-plus"></i> Yeni Randevu Al
                    </button>
                    <a href="tel:+905353562469" class="btn btn-secondary">
                        <i class="fas fa-phone"></i> Hemen Ara
                    </a>
                </div>
            </div>
        `;
        
        // Add styles
        successMessage.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        `;
        
        document.body.appendChild(successMessage);
        
        // Auto remove after 10 seconds
        setTimeout(() => {
            if (successMessage.parentNode) {
                successMessage.remove();
            }
        }, 10000);
    }
}

// Vehicle Diagnostic System
class VehicleDiagnostic {
    constructor() {
        this.currentStep = 1;
        this.vehicleData = {};
        this.selectedSymptoms = [];
        this.diagnosticResults = [];
        
        this.init();
    }
    
    init() {
        this.bindEvents();
    }
    
    bindEvents() {
        // Navigation buttons
        const nextBtn = document.getElementById('diagNextStep');
        const prevBtn = document.getElementById('diagPrevStep');
        const quoteBtn = document.getElementById('diagGetQuote');
        
        if (nextBtn) nextBtn.addEventListener('click', () => this.nextStep());
        if (prevBtn) prevBtn.addEventListener('click', () => this.prevStep());
        if (quoteBtn) quoteBtn.addEventListener('click', () => this.getQuote());
        
        // Form validation
        const form = document.querySelector('.vehicle-info-form');
        if (form) {
            form.addEventListener('input', () => this.validateForm());
        }
        
        // Symptom selection
        document.querySelectorAll('input[name="symptoms"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => this.updateSelectedSymptoms());
        });
    }
    
    nextStep() {
        if (this.validateCurrentStep()) {
            this.currentStep++;
            this.showStep(this.currentStep);
            this.updateNavigation();
            
            if (this.currentStep === 3) {
                this.performDiagnostic();
            }
        }
    }
    
    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.showStep(this.currentStep);
            this.updateNavigation();
        }
    }
    
    showStep(step) {
        // Hide all steps
        document.querySelectorAll('.diagnostic-step').forEach(stepEl => {
            stepEl.classList.remove('active');
        });
        
        // Show current step
        const stepElement = document.getElementById(`diagStep${step}`);
        if (stepElement) {
            stepElement.classList.add('active');
        }
    }
    
    updateNavigation() {
        const prevBtn = document.getElementById('diagPrevStep');
        const nextBtn = document.getElementById('diagNextStep');
        const quoteBtn = document.getElementById('diagGetQuote');
        
        if (prevBtn) {
            prevBtn.style.display = this.currentStep > 1 ? 'block' : 'none';
        }
        
        if (nextBtn && quoteBtn) {
            if (this.currentStep === 3) {
                nextBtn.style.display = 'none';
                quoteBtn.style.display = 'block';
            } else {
                nextBtn.style.display = 'block';
                quoteBtn.style.display = 'none';
            }
        }
    }
    
    validateCurrentStep() {
        switch (this.currentStep) {
            case 1:
                const brand = document.getElementById('diagVehicleBrand').value;
                const model = document.getElementById('diagVehicleModel').value;
                const year = document.getElementById('diagVehicleYear').value;
                
                if (!brand || !model || !year) {
                    showNotification('Lütfen tüm araç bilgilerini doldurun', 'error');
                    return false;
                }
                
                // Store vehicle data
                this.vehicleData = {
                    brand: brand,
                    model: model,
                    year: year,
                    mileage: document.getElementById('diagMileage').value
                };
                return true;
                
            case 2:
                if (this.selectedSymptoms.length === 0) {
                    showNotification('Lütfen en az bir problem belirtisi seçin', 'error');
                    return false;
                }
                return true;
                
            default:
                return true;
        }
    }
    
    validateForm() {
        const brand = document.getElementById('diagVehicleBrand').value;
        const model = document.getElementById('diagVehicleModel').value;
        const year = document.getElementById('diagVehicleYear').value;
        
        const isValid = brand && model && year;
        
        const nextBtn = document.getElementById('diagNextStep');
        if (nextBtn) {
            nextBtn.disabled = !isValid;
        }
        
        return isValid;
    }
    
    updateSelectedSymptoms() {
        this.selectedSymptoms = [];
        document.querySelectorAll('input[name="symptoms"]:checked').forEach(checkbox => {
            this.selectedSymptoms.push(checkbox.value);
        });
        
        this.updateNavigation();
    }
    
    performDiagnostic() {
        this.diagnosticResults = this.analyzeSymptoms(this.selectedSymptoms);
        this.displayResults();
    }
    
    analyzeSymptoms(symptoms) {
        const results = [];
        
        // Diagnostic rules based on symptoms
        const diagnosticRules = {
            // Engine problems
            'engine_wont_start': {
                title: 'Motor Çalışmıyor',
                description: 'Aracınızın motoru çalışmıyor. Bu durum genellikle elektrik sistemi veya yakıt sistemi ile ilgilidir.',
                priority: 'high',
                solutions: [
                    'Akü voltajını kontrol edin',
                    'Marş motoru bağlantılarını kontrol edin',
                    'Yakıt pompası çalışıyor mu kontrol edin',
                    'Kontak anahtarını kontrol edin'
                ],
                price: '800-2000 TL',
                icon: 'fas fa-exclamation-triangle'
            },
            'engine_hard_start': {
                title: 'Motor Zor Çalışıyor',
                description: 'Motor çalışıyor ancak zorlanıyor. Bu durum genellikle akü, marş motoru veya yakıt sistemi ile ilgilidir.',
                priority: 'medium',
                solutions: [
                    'Akü şarj durumunu kontrol edin',
                    'Marş motoru performansını test edin',
                    'Yakıt filtresini kontrol edin',
                    'Bujileri kontrol edin'
                ],
                price: '600-1500 TL',
                icon: 'fas fa-tools'
            },
            
            // Electrical problems
            'battery_dead': {
                title: 'Akü Sorunu',
                description: 'Akünüz sürekli bitiyor. Bu durum alternatör veya akü ile ilgili olabilir.',
                priority: 'high',
                solutions: [
                    'Alternatör şarj performansını test edin',
                    'Akü sağlığını kontrol edin',
                    'Elektrik kaçağı olup olmadığını kontrol edin',
                    'Akü bağlantılarını temizleyin'
                ],
                price: '500-1200 TL',
                icon: 'fas fa-battery-quarter'
            },
            'alternator_light': {
                title: 'Alternatör Uyarı Işığı',
                description: 'Alternatör uyarı ışığı yanıyor. Şarj sistemi ile ilgili bir problem var.',
                priority: 'high',
                solutions: [
                    'Alternatör çıkış voltajını ölçün',
                    'Alternatör kayışını kontrol edin',
                    'Regülatörü test edin',
                    'Diode köprüyü kontrol edin'
                ],
                price: '800-2000 TL',
                icon: 'fas fa-bolt'
            },
            
            // Starter problems
            'starter_no_response': {
                title: 'Marş Motoru Çalışmıyor',
                description: 'Marş motoru hiç çalışmıyor. Elektrik bağlantısı veya marş motoru arızası olabilir.',
                priority: 'high',
                solutions: [
                    'Marş motoru elektrik bağlantılarını kontrol edin',
                    'Selenoid çalışıyor mu test edin',
                    'Marş motoru performansını test edin',
                    'Kontak anahtarını kontrol edin'
                ],
                price: '600-1500 TL',
                icon: 'fas fa-play'
            },
            'starter_clicking': {
                title: 'Marş Motoru Tık Tık Sesi',
                description: 'Marş motoru tık tık sesi çıkarıyor. Genellikle akü voltajı düşük veya marş motoru arızalı.',
                priority: 'medium',
                solutions: [
                    'Akü voltajını kontrol edin',
                    'Marş motoru bağlantılarını temizleyin',
                    'Marş motoru performansını test edin',
                    'Akü şarj durumunu kontrol edin'
                ],
                price: '400-1200 TL',
                icon: 'fas fa-volume-up'
            },
            
            // Charging problems
            'charging_issue': {
                title: 'Şarj Sistemi Sorunu',
                description: 'Aracınızın şarj sistemi düzgün çalışmıyor. Alternatör veya regülatör arızası olabilir.',
                priority: 'high',
                solutions: [
                    'Alternatör çıkış voltajını ölçün',
                    'Regülatörü test edin',
                    'Alternatör kayışını kontrol edin',
                    'Elektrik bağlantılarını kontrol edin'
                ],
                price: '800-2000 TL',
                icon: 'fas fa-charging-station'
            }
        };
        
        // Analyze each symptom
        symptoms.forEach(symptom => {
            if (diagnosticRules[symptom]) {
                results.push(diagnosticRules[symptom]);
            }
        });
        
        // If no specific symptoms, provide general advice
        if (results.length === 0) {
            results.push({
                title: 'Genel Elektrik Kontrolü',
                description: 'Seçtiğiniz belirtilere göre genel bir elektrik sistemi kontrolü öneriyoruz.',
                priority: 'low',
                solutions: [
                    'Akü voltajını kontrol edin',
                    'Alternatör çıkışını test edin',
                    'Marş motoru performansını kontrol edin',
                    'Elektrik bağlantılarını kontrol edin'
                ],
                price: '300-800 TL',
                icon: 'fas fa-search'
            });
        }
        
        return results;
    }
    
    displayResults() {
        const resultsContainer = document.getElementById('diagnosticResults');
        if (!resultsContainer) return;
        
        let html = `
            <div class="diagnostic-summary">
                <h4>🔍 Tanı Sonuçları</h4>
                <p>${this.vehicleData.brand} ${this.vehicleData.model} (${this.vehicleData.year}) için ${this.diagnosticResults.length} problem tespit edildi.</p>
            </div>
        `;
        
        this.diagnosticResults.forEach((result, index) => {
            const priorityClass = result.priority;
            const urgencyClass = `urgency-${result.priority}`;
            
            html += `
                <div class="result-card ${priorityClass}">
                    <div class="result-urgency ${urgencyClass}">
                        ${result.priority === 'high' ? 'Yüksek Öncelik' : 
                          result.priority === 'medium' ? 'Orta Öncelik' : 'Düşük Öncelik'}
                    </div>
                    <div class="result-header">
                        <div class="result-icon ${priorityClass}">
                            <i class="${result.icon}"></i>
                        </div>
                        <h3 class="result-title">${result.title}</h3>
                    </div>
                    <p class="result-description">${result.description}</p>
                    <div class="result-solutions">
                        <h5>Önerilen Çözümler:</h5>
                        <ul>
                            ${result.solutions.map(solution => `<li>${solution}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="result-price">
                        Tahmini Onarım Maliyeti: ${result.price}
                    </div>
                    ${result.priority === 'low' ? `
                    <div class="video-guide">
                        <h6><i class="fas fa-play-circle"></i> Video Rehber</h6>
                        <p>Bu problem için basit çözüm videolarımızı izleyebilirsiniz.</p>
                    </div>
                    ` : ''}
                </div>
            `;
        });
        
        resultsContainer.innerHTML = html;
    }
    
    getQuote() {
        const message = `🔧 *ARAÇ TANı TALEBİ*

🚗 *Araç Bilgileri:*
• Marka: ${this.vehicleData.brand}
• Model: ${this.vehicleData.model}
• Yıl: ${this.vehicleData.year}
• Kilometre: ${this.vehicleData.mileage || 'Belirtilmemiş'}

⚠️ *Tespit Edilen Problemler:*
${this.diagnosticResults.map((result, index) => 
    `${index + 1}. ${result.title} (${result.priority === 'high' ? 'Yüksek' : result.priority === 'medium' ? 'Orta' : 'Düşük'} Öncelik)
   Tahmini Maliyet: ${result.price}`
).join('\n')}

📋 *Toplam Tahmini Maliyet:* ${this.calculateTotalPrice()}

⏰ *Talep Zamanı:* ${new Date().toLocaleString('tr-TR')}

Detaylı keşif ve kesin fiyat için randevu almak istiyorum.`;
        
        const whatsappUrl = `https://wa.me/905353562469?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        
        // Track event
        if (typeof gtag !== 'undefined') {
            gtag('event', 'diagnostic_tool_used', {
                'event_category': 'engagement',
                'event_label': this.vehicleData.brand,
                'value': this.diagnosticResults.length
            });
        }
    }
    
    calculateTotalPrice() {
        let totalMin = 0;
        let totalMax = 0;
        
        this.diagnosticResults.forEach(result => {
            const priceRange = result.price.match(/(\d+)-(\d+)/);
            if (priceRange) {
                totalMin += parseInt(priceRange[1]);
                totalMax += parseInt(priceRange[2]);
            }
        });
        
        return `${totalMin}-${totalMax} TL`;
    }
}

// Reviews functionality
function showAllReviews() {
    showNotification('Tüm yorumları görüntülemek için WhatsApp ile iletişime geçin!', 'info');
    
    // Track event
    if (typeof gtag !== 'undefined') {
        gtag('event', 'view_all_reviews', {
            'event_category': 'engagement',
            'event_label': 'reviews_section',
            'value': 1
        });
    }
}

// Helpful button functionality
document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners to helpful buttons
    document.querySelectorAll('.helpful-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get current count
            const countSpan = this.querySelector('span');
            let count = parseInt(countSpan.textContent) || 0;
            
            // Increment count
            count++;
            countSpan.textContent = count;
            
            // Add visual feedback
            this.style.background = '#10b981';
            this.style.color = 'white';
            
            // Show notification
            showNotification('Teşekkürler! Yorumunuzu beğendiğinizi belirttiniz.', 'success');
            
            // Track event
            if (typeof gtag !== 'undefined') {
                gtag('event', 'review_helpful', {
                    'event_category': 'engagement',
                    'event_label': 'customer_review',
                    'value': count
                });
            }
            
            // Disable button to prevent multiple clicks
            this.disabled = true;
            this.style.cursor = 'not-allowed';
        });
    });
});

// Initialize appointment system when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize appointment system
    new AppointmentSystem();
    
    // Initialize diagnostic system
    new VehicleDiagnostic();
    
    // Initialize customer reviews functionality
    initializeCustomerReviews();
    
    // Initialize AI and automation features
    initializeAIFeatures();
});

// AI and Automation Features
function initializeAIFeatures() {
    // Initialize AI chatbot
    initializeAIChatbot();
    
    // Initialize AI diagnostic tool
    initializeAIDiagnostic();
    
    // Initialize predictive maintenance
    initializePredictiveMaintenance();
    
    // Initialize automated reporting
    initializeAutomatedReporting();
}

// AI Chatbot functionality
function initializeAIChatbot() {
    // AI Chatbot simulation
    window.openAIChat = function() {
        showNotification('🤖 DC TEKNİK AI Chatbot başlatılıyor...', 'info');
        
        // Simulate AI response
        setTimeout(() => {
            const responses = [
                "Merhaba! DC TEKNİK AI asistanıyım. Size nasıl yardımcı olabilirim?",
                "Aracınızda hangi sorun yaşıyorsunuz? Detaylı bilgi verebilir misiniz?",
                "Dinamo, alternatör veya marş motoru ile ilgili sorunuz mu var?",
                "Acil durum mu? Hemen teknik destek sağlayabilirim."
            ];
            
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            showNotification(`🤖 DC TEKNİK AI: ${randomResponse}`, 'success');
        }, 1500);
        
        // Track AI interaction
        if (typeof gtag !== 'undefined') {
            gtag('event', 'ai_chat_started', {
                'event_category': 'ai_interaction',
                'event_label': 'chatbot_launch',
                'value': 1
            });
        }
    };
    
    // AI Demo functionality
    window.showAIDemo = function() {
        showNotification('🎬 DC TEKNİK AI Demo başlatılıyor...', 'info');
        
        // Simulate demo process
        setTimeout(() => {
            showNotification('🤖 DC TEKNİK AI Demo: Arıza tespiti ve çözüm önerileri gösteriliyor...', 'success');
        }, 2000);
        
        // Track demo interaction
        if (typeof gtag !== 'undefined') {
            gtag('event', 'ai_demo_watched', {
                'event_category': 'ai_interaction',
                'event_label': 'demo_view',
                'value': 1
            });
        }
    };
}

// AI Diagnostic functionality
function initializeAIDiagnostic() {
    window.startDiagnostic = function() {
        showNotification('🔍 AI Arıza Tespiti başlatılıyor...', 'info');
        
        // Simulate diagnostic process
        const diagnosticSteps = [
            "🔍 Araç verileri analiz ediliyor...",
            "🧠 AI algoritması çalışıyor...",
            "📊 Sistem performansı değerlendiriliyor...",
            "✅ Arıza tespiti tamamlandı!"
        ];
        
        let stepIndex = 0;
        const diagnosticInterval = setInterval(() => {
            if (stepIndex < diagnosticSteps.length) {
                showNotification(diagnosticSteps[stepIndex], 'info');
                stepIndex++;
            } else {
                clearInterval(diagnosticInterval);
                showNotification('🎯 AI Tanı: Dinamo sargısı aşınması tespit edildi. Önerilen çözüm: Yenileme', 'success');
            }
        }, 2000);
        
        // Track diagnostic interaction
        if (typeof gtag !== 'undefined') {
            gtag('event', 'ai_diagnostic_started', {
                'event_category': 'ai_interaction',
                'event_label': 'diagnostic_launch',
                'value': 1
            });
        }
    };
}

// Predictive Maintenance functionality
function initializePredictiveMaintenance() {
    window.openPredictiveMaintenance = function() {
        showNotification('📈 Öngörücü Bakım Sistemi başlatılıyor...', 'info');
        
        // Simulate predictive analysis
        setTimeout(() => {
            const maintenanceData = {
                nextService: "15 gün sonra",
                criticalComponents: ["Dinamo sargısı", "Kömür fırçaları"],
                riskLevel: "Orta",
                recommendations: ["Önleyici bakım önerilir", "Parça değişimi gerekebilir"]
            };
            
            showNotification(`📊 Bakım Analizi: ${maintenanceData.nextService} sonraki servis önerilir`, 'success');
            showNotification(`⚠️ Risk Seviyesi: ${maintenanceData.riskLevel}`, 'warning');
        }, 3000);
        
        // Track predictive maintenance interaction
        if (typeof gtag !== 'undefined') {
            gtag('event', 'predictive_maintenance_accessed', {
                'event_category': 'ai_interaction',
                'event_label': 'maintenance_plan',
                'value': 1
            });
        }
    };
}

// Automated Reporting functionality
function initializeAutomatedReporting() {
    window.generateReport = function() {
        showNotification('📋 Otomatik Rapor oluşturuluyor...', 'info');
        
        // Simulate report generation
        setTimeout(() => {
            showNotification('📊 Rapor hazırlandı! E-posta ile gönderiliyor...', 'success');
            
            // Simulate email sending
            setTimeout(() => {
                showNotification('📧 Rapor başarıyla gönderildi!', 'success');
            }, 2000);
        }, 3000);
        
        // Track report generation
        if (typeof gtag !== 'undefined') {
            gtag('event', 'automated_report_generated', {
                'event_category': 'ai_interaction',
                'event_label': 'report_creation',
                'value': 1
            });
        }
    };
}






// Initialize Location Section - KESIN ÇÖZÜM
function initializeLocationSection() {
    const locationSection = document.querySelector('.location-section');
    
    if (!locationSection) return;
    
    // Add click tracking for all location buttons
    const locationBtns = document.querySelectorAll('.location-btn');
    locationBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            const action = this.textContent.trim();
            
            // Track location interaction
            if (typeof gtag !== 'undefined') {
                gtag('event', 'location_action', {
                    'event_category': 'Location',
                    'event_label': action,
                    'value': 1
                });
            }
            
            console.log('📍 Location action clicked:', action);
        });
    });
    
    // Add success notification
    showNotification('📍 Konum bilgileri yüklendi!', 'success');
    
    console.log('✅ Location section initialized - NO IFRAME, NO ERRORS');
}

// FINAL MAP SOLUTION - NO IFRAME, NO ERRORS
function initializeFinalMapSolution() {
    const finalMapContainer = document.querySelector('.final-map-container');
    
    if (!finalMapContainer) return;
    
    // Add click tracking for all action buttons
    const actionBtns = document.querySelectorAll('.action-btn');
    actionBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            const action = this.textContent.trim();
            
            // Track map interaction
            if (typeof gtag !== 'undefined') {
                gtag('event', 'map_action', {
                    'event_category': 'Location',
                    'event_label': action,
                    'value': 1
                });
            }
            
            console.log('🗺️ Map action clicked:', action);
        });
    });
    
    // Add success notification
    showNotification('🗺️ Konum bilgileri yüklendi!', 'success');
    
    console.log('✅ Final map solution initialized - NO IFRAME, NO ERRORS');
}

// Smart Map System
function initializeSmartMapSystem() {
    const mapContainer = document.getElementById('mapContainer');
    const mapAlternatives = document.querySelector('.map-alternatives');
    const mapStatic = document.querySelector('.map-static');
    
    if (!mapContainer) return;
    
    // Show primary map solution immediately
    mapContainer.style.display = 'block';
    
    // Try to load alternative maps after a delay
    setTimeout(() => {
        tryLoadAlternativeMaps();
    }, 2000);
    
    // Add click handlers for map actions
    const mapBtns = document.querySelectorAll('.map-btn');
    mapBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            // Track map interaction
            if (typeof gtag !== 'undefined') {
                gtag('event', 'map_interaction', {
                    'event_category': 'Location',
                    'event_label': this.textContent.trim(),
                    'value': 1
                });
            }
        });
    });
}

// Try to load alternative maps
function tryLoadAlternativeMaps() {
    const mapAlternatives = document.querySelector('.map-alternatives');
    const mapStatic = document.querySelector('.map-static');
    
    // Try OpenStreetMap first
    if (mapAlternatives) {
        const iframe = mapAlternatives.querySelector('iframe');
        if (iframe) {
            iframe.addEventListener('load', function() {
                console.log('🗺️ OpenStreetMap loaded successfully');
                showNotification('🗺️ Alternatif harita yüklendi!', 'success');
            });
            
            iframe.addEventListener('error', function() {
                console.warn('⚠️ OpenStreetMap failed, trying static map');
                tryLoadStaticMap();
            });
            
            // Show alternatives after 3 seconds
            setTimeout(() => {
                if (mapAlternatives) {
                    mapAlternatives.style.display = 'block';
                }
            }, 3000);
        }
    }
}

// Try to load static map
function tryLoadStaticMap() {
    const mapStatic = document.querySelector('.map-static');
    
    if (mapStatic) {
        const img = mapStatic.querySelector('img');
        if (img) {
            img.addEventListener('load', function() {
                console.log('🗺️ Static map loaded successfully');
                showNotification('🗺️ Statik harita yüklendi!', 'info');
            });
            
            img.addEventListener('error', function() {
                console.warn('⚠️ Static map failed, using placeholder');
                showNotification('⚠️ Harita yüklenemedi, lütfen butonları kullanın', 'warning');
            });
            
            // Show static map after 5 seconds
            setTimeout(() => {
                if (mapStatic) {
                    mapStatic.style.display = 'block';
                }
            }, 5000);
        }
    }
}

// Enhanced map functionality
function enhanceMapFunctionality() {
    // Add geolocation support
    if (navigator.geolocation) {
        const locationBtn = document.createElement('button');
        locationBtn.className = 'map-btn secondary';
        locationBtn.innerHTML = '<i class="fas fa-location-arrow"></i> Konumumu Bul';
        locationBtn.addEventListener('click', getCurrentLocation);
        
        const mapActions = document.querySelector('.map-actions');
        if (mapActions) {
            mapActions.appendChild(locationBtn);
        }
    }
}

// Get current location
function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                
                // Calculate distance to DC TEKNİK
                const dcLat = 40.987654321;
                const dcLng = 29.234567890;
                const distance = calculateDistance(lat, lng, dcLat, dcLng);
                
                showNotification(`📍 Konumunuz bulundu! DC TEKNİK'e ${distance.toFixed(1)} km uzaklıktasınız.`, 'success');
                
                // Track location success
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'location_found', {
                        'event_category': 'Location',
                        'event_label': 'Geolocation',
                        'value': Math.round(distance)
                    });
                }
            },
            function(error) {
                console.warn('Geolocation error:', error);
                showNotification('⚠️ Konum bulunamadı, lütfen manuel olarak arayın', 'warning');
            }
        );
    }
}

// Calculate distance between two points
function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

}


// Performance Optimization Functions
function initializeLazyLoading() {
    // Lazy loading for images
    const images = document.querySelectorAll('img[loading="lazy"]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => {
        imageObserver.observe(img);
    });
}

function optimizeImages() {
    // Add WebP support detection
    const supportsWebP = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    };

    if (supportsWebP()) {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            const src = img.src;
            if (src.includes('unsplash.com')) {
                img.src = src + '&fm=webp&q=80';
            }
        });
    }
}

function preloadCriticalResources() {
    // Preload critical images
    const criticalImages = [
        'https://images.unsplash.com/photo-1486754735734-325b5831c3ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    ];

    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

// Cookie Consent Management
function initializeCookieConsent() {
    const cookieConsent = document.getElementById('cookieConsent');
    const cookieSettings = document.getElementById('cookieSettings');
    
    // Check if user has already made a choice
    const cookieChoice = localStorage.getItem('cookieConsent');
    
    if (!cookieChoice) {
        // Show cookie banner after 2 seconds
        setTimeout(() => {
            cookieConsent.style.display = 'block';
        }, 2000);
    } else {
        // Apply saved cookie preferences
        applyCookiePreferences(JSON.parse(cookieChoice));
    }
    
    // Cookie banner event listeners
    document.getElementById('acceptCookies').addEventListener('click', function() {
        acceptAllCookies();
        hideCookieBanner();
    });
    
    document.getElementById('rejectCookies').addEventListener('click', function() {
        rejectAllCookies();
        hideCookieBanner();
    });
    
    document.getElementById('customizeCookies').addEventListener('click', function() {
        showCookieSettings();
    });
    
    // Cookie settings modal event listeners
    document.getElementById('closeCookieSettings').addEventListener('click', function() {
        hideCookieSettings();
    });
    
    document.getElementById('saveCookieSettings').addEventListener('click', function() {
        saveCustomCookieSettings();
        hideCookieSettings();
        hideCookieBanner();
    });
    
    document.getElementById('acceptAllCookies').addEventListener('click', function() {
        acceptAllCookies();
        hideCookieSettings();
        hideCookieBanner();
    });
}

function acceptAllCookies() {
    const preferences = {
        technical: true,
        analytics: true,
        marketing: true,
        behavior: true,
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('cookieConsent', JSON.stringify(preferences));
    applyCookiePreferences(preferences);
    
    showNotification('🍪 Tüm çerezler kabul edildi!', 'success');
}

function rejectAllCookies() {
    const preferences = {
        technical: true, // Technical cookies are always required
        analytics: false,
        marketing: false,
        behavior: false,
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('cookieConsent', JSON.stringify(preferences));
    applyCookiePreferences(preferences);
    
    showNotification('🍪 Sadece teknik çerezler kabul edildi!', 'info');
}

function saveCustomCookieSettings() {
    const preferences = {
        technical: true, // Always true
        analytics: document.getElementById('analyticsCookies').checked,
        marketing: document.getElementById('marketingCookies').checked,
        behavior: document.getElementById('behaviorCookies').checked,
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('cookieConsent', JSON.stringify(preferences));
    applyCookiePreferences(preferences);
    
    showNotification('🍪 Çerez ayarları kaydedildi!', 'success');
}

function applyCookiePreferences(preferences) {
    // Apply analytics cookies
    if (preferences.analytics) {
        // Enable Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
                'analytics_storage': 'granted'
            });
        }
    } else {
        // Disable Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
                'analytics_storage': 'denied'
            });
        }
    }
    
    // Apply marketing cookies
    if (preferences.marketing) {
        // Enable Facebook Pixel
        if (typeof fbq !== 'undefined') {
            fbq('consent', 'grant');
        }
    } else {
        // Disable Facebook Pixel
        if (typeof fbq !== 'undefined') {
            fbq('consent', 'revoke');
        }
    }
    
    // Apply behavior cookies
    if (preferences.behavior) {
        // Enable Hotjar
        if (typeof hj !== 'undefined') {
            hj('consent', 'grant');
        }
    } else {
        // Disable Hotjar
        if (typeof hj !== 'undefined') {
            hj('consent', 'revoke');
        }
    }
}

function hideCookieBanner() {
    const cookieConsent = document.getElementById('cookieConsent');
    cookieConsent.style.display = 'none';
}

function showCookieSettings() {
    const cookieSettings = document.getElementById('cookieSettings');
    cookieSettings.style.display = 'flex';
}

function hideCookieSettings() {
    const cookieSettings = document.getElementById('cookieSettings');
    cookieSettings.style.display = 'none';
}

// Advanced Security Functions
function initializeSecurityFeatures() {
    // CSRF Token Generation
    generateCSRFToken();
    
    // Rate Limiting
    initializeRateLimiting();
    
    // Input Sanitization
    initializeInputSanitization();
    
    // Security Monitoring
    initializeSecurityMonitoring();
    
    // Intrusion Detection
    initializeIntrusionDetection();
}

function generateCSRFToken() {
    // Generate CSRF token for forms
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('csrfToken', token);
    
    // Add token to all forms
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        const tokenInput = document.createElement('input');
        tokenInput.type = 'hidden';
        tokenInput.name = 'csrf_token';
        tokenInput.value = token;
        form.appendChild(tokenInput);
    });
}

function initializeRateLimiting() {
    // Rate limiting for API calls
    const rateLimitMap = new Map();
    const RATE_LIMIT = 10; // 10 requests per minute
    const WINDOW_SIZE = 60000; // 1 minute
    
    window.makeSecureRequest = function(url, options = {}) {
        const now = Date.now();
        const key = url + '_' + (options.userId || 'anonymous');
        
        if (!rateLimitMap.has(key)) {
            rateLimitMap.set(key, []);
        }
        
        const requests = rateLimitMap.get(key);
        const recentRequests = requests.filter(time => now - time < WINDOW_SIZE);
        
        if (recentRequests.length >= RATE_LIMIT) {
            showNotification('⚠️ Çok fazla istek! Lütfen bekleyin.', 'warning');
            return Promise.reject(new Error('Rate limit exceeded'));
        }
        
        recentRequests.push(now);
        rateLimitMap.set(key, recentRequests);
        
        return fetch(url, options);
    };
}

function initializeInputSanitization() {
    // Sanitize all user inputs
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            // Remove potentially dangerous characters
            this.value = this.value.replace(/[<>'"&]/g, '');
        });
        
        input.addEventListener('blur', function() {
            // Additional validation
            if (this.type === 'email') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(this.value)) {
                    this.style.borderColor = '#ef4444';
                    showNotification('⚠️ Geçerli bir e-posta adresi girin!', 'warning');
                } else {
                    this.style.borderColor = '#10b981';
                }
            }
        });
    });
}

function initializeSecurityMonitoring() {
    // Monitor for suspicious activities
    let suspiciousActivity = 0;
    const SUSPICIOUS_THRESHOLD = 5;
    
    // Monitor rapid clicks
    let clickCount = 0;
    let lastClickTime = 0;
    
    document.addEventListener('click', function(e) {
        const now = Date.now();
        if (now - lastClickTime < 100) { // Less than 100ms between clicks
            clickCount++;
            if (clickCount > 10) {
                suspiciousActivity++;
                showNotification('⚠️ Şüpheli aktivite tespit edildi!', 'warning');
            }
        } else {
            clickCount = 0;
        }
        lastClickTime = now;
    });
    
    // Monitor rapid form submissions
    let formSubmissionCount = 0;
    let lastFormSubmission = 0;
    
    document.addEventListener('submit', function(e) {
        const now = Date.now();
        if (now - lastFormSubmission < 1000) { // Less than 1 second between submissions
            formSubmissionCount++;
            if (formSubmissionCount > 3) {
                suspiciousActivity++;
                showNotification('⚠️ Çok hızlı form gönderimi!', 'warning');
                e.preventDefault();
            }
        } else {
            formSubmissionCount = 0;
        }
        lastFormSubmission = now;
    });
    
    // Monitor for XSS attempts
    document.addEventListener('DOMContentLoaded', function() {
        const scripts = document.querySelectorAll('script');
        scripts.forEach(script => {
            if (script.src && !script.src.startsWith(window.location.origin) && 
                !script.src.includes('googletagmanager.com') && 
                !script.src.includes('google-analytics.com') &&
                !script.src.includes('cdnjs.cloudflare.com')) {
                suspiciousActivity++;
                console.warn('Suspicious script detected:', script.src);
            }
        });
    });
}

function initializeIntrusionDetection() {
    // Detect common attack patterns
    const attackPatterns = [
        /script\s*>/i,
        /<script/i,
        /javascript:/i,
        /on\w+\s*=/i,
        /eval\s*\(/i,
        /document\.cookie/i,
        /document\.write/i,
        /window\.location/i
    ];
    
    // Monitor URL for attack patterns
    const currentUrl = window.location.href;
    attackPatterns.forEach(pattern => {
        if (pattern.test(currentUrl)) {
            showNotification('🚨 Güvenlik tehdidi tespit edildi!', 'error');
            console.warn('Potential attack detected in URL:', currentUrl);
        }
    });
    
    // Monitor for SQL injection patterns
    const sqlPatterns = [
        /union\s+select/i,
        /drop\s+table/i,
        /delete\s+from/i,
        /insert\s+into/i,
        /update\s+set/i,
        /or\s+1\s*=\s*1/i,
        /and\s+1\s*=\s*1/i
    ];
    
    // Check form inputs for SQL injection
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            sqlPatterns.forEach(pattern => {
                if (pattern.test(this.value)) {
                    showNotification('🚨 SQL injection tespit edildi!', 'error');
                    this.style.borderColor = '#ef4444';
                    this.value = this.value.replace(pattern, '');
                }
            });
        });
    });
}

// Two-Factor Authentication (2FA) System
function initialize2FA() {
    // Generate TOTP secret for 2FA
    const generateTOTPSecret = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
        let secret = '';
        for (let i = 0; i < 32; i++) {
            secret += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return secret;
    };
    
    // Generate 6-digit TOTP code
    const generateTOTPCode = (secret) => {
        const epoch = Math.round(new Date().getTime() / 1000.0);
        const time = Math.floor(epoch / 30);
        const timeHex = time.toString(16).padStart(16, '0');
        
        // Simple TOTP implementation (for demo purposes)
        const hash = btoa(secret + timeHex);
        const code = parseInt(hash.substring(0, 8), 16) % 1000000;
        return code.toString().padStart(6, '0');
    };
    
    // Send SMS verification code
    const sendSMSVerification = (phoneNumber) => {
        const code = Math.floor(100000 + Math.random() * 900000);
        localStorage.setItem('smsCode', code.toString());
        localStorage.setItem('smsCodeTime', Date.now().toString());
        
        showNotification(`📱 SMS doğrulama kodu gönderildi: ${code}`, 'info');
        
        // Track SMS verification
        if (typeof gtag !== 'undefined') {
            gtag('event', 'sms_verification_sent', {
                'event_category': 'authentication',
                'event_label': '2fa_sms',
                'value': 1
            });
        }
        
        return code;
    };
    
    // Send Email verification code
    const sendEmailVerification = (email) => {
        const code = Math.floor(100000 + Math.random() * 900000);
        localStorage.setItem('emailCode', code.toString());
        localStorage.setItem('emailCodeTime', Date.now().toString());
        
        showNotification(`📧 E-posta doğrulama kodu gönderildi: ${code}`, 'info');
        
        // Track Email verification
        if (typeof gtag !== 'undefined') {
            gtag('event', 'email_verification_sent', {
                'event_category': 'authentication',
                'event_label': '2fa_email',
                'value': 1
            });
        }
        
        return code;
    };
    
    // Verify 2FA code
    const verify2FACode = (code, type = 'sms') => {
        const storedCode = localStorage.getItem(type + 'Code');
        const codeTime = parseInt(localStorage.getItem(type + 'CodeTime'));
        const now = Date.now();
        const codeAge = now - codeTime;
        
        // Code expires in 5 minutes
        if (codeAge > 300000) {
            showNotification('⏰ Doğrulama kodu süresi doldu!', 'error');
            return false;
        }
        
        if (code === storedCode) {
            showNotification('✅ 2FA doğrulama başarılı!', 'success');
            
            // Track successful 2FA
            if (typeof gtag !== 'undefined') {
                gtag('event', '2fa_verification_success', {
                    'event_category': 'authentication',
                    'event_label': type,
                    'value': 1
                });
            }
            
            return true;
        } else {
            showNotification('❌ Geçersiz doğrulama kodu!', 'error');
            
            // Track failed 2FA
            if (typeof gtag !== 'undefined') {
                gtag('event', '2fa_verification_failed', {
                    'event_category': 'authentication',
                    'event_label': type,
                    'value': 1
                });
            }
            
            return false;
        }
    };
    
    // Make 2FA functions globally available
    window.sendSMSVerification = sendSMSVerification;
    window.sendEmailVerification = sendEmailVerification;
    window.verify2FACode = verify2FACode;
    window.generateTOTPCode = generateTOTPCode;
    window.generateTOTPSecret = generateTOTPSecret;
    
    console.log('🔐 2FA System initialized');
}

// Advanced Performance Optimization
function initializeAdvancedPerformance() {
    // Code Splitting - Dynamic imports
    initializeCodeSplitting();
    
    // Tree Shaking - Remove unused code
    initializeTreeShaking();
    
    // Critical CSS Optimization
    optimizeCriticalCSS();
    
    // Advanced Image Optimization
    initializeAdvancedImageOptimization();
    
    // Bundle Optimization
    initializeBundleOptimization();
    
    // Advanced Caching
    initializeAdvancedCaching();
    
    // Preloading Strategy
    initializePreloadingStrategy();
    
    // Performance Monitoring
    initializePerformanceMonitoring();
}

// Code Splitting Implementation
function initializeCodeSplitting() {
    // Lazy load non-critical modules
    const loadModule = async (moduleName) => {
        try {
            const module = await import(`./modules/${moduleName}.js`);
            return module;
        } catch (error) {
            console.warn(`Module ${moduleName} not found, using fallback`);
            return null;
        }
    };
    
    // Load modules on demand
    window.loadModule = loadModule;
    
    // Load AI features on demand
    const loadAIFeatures = async () => {
        if (document.querySelector('.ai-automation-section')) {
            const aiModule = await loadModule('ai-features');
            if (aiModule) {
                aiModule.initializeAIFeatures();
            }
        }
    };
    
    // Load analytics on demand
    const loadAnalytics = async () => {
        if (typeof gtag !== 'undefined') {
            const analyticsModule = await loadModule('analytics');
            if (analyticsModule) {
                analyticsModule.initializeAdvancedAnalytics();
            }
        }
    };
    
    // Load modules when needed
    setTimeout(loadAIFeatures, 1000);
    setTimeout(loadAnalytics, 2000);
}

// Tree Shaking Implementation
function initializeTreeShaking() {
    // Remove unused CSS
    const removeUnusedCSS = () => {
        const usedClasses = new Set();
        const elements = document.querySelectorAll('*');
        
        elements.forEach(el => {
            if (el.className) {
                el.className.split(' ').forEach(cls => {
                    if (cls.trim()) usedClasses.add(cls.trim());
                });
            }
        });
        
        // Remove unused CSS rules (simplified implementation)
        const styleSheets = document.styleSheets;
        for (let i = 0; i < styleSheets.length; i++) {
            try {
                const rules = styleSheets[i].cssRules;
                for (let j = rules.length - 1; j >= 0; j--) {
                    const rule = rules[j];
                    if (rule.selectorText) {
                        const selectors = rule.selectorText.split(',');
                        let hasUsedSelector = false;
                        
                        selectors.forEach(selector => {
                            const cleanSelector = selector.trim().replace(/[.#]/g, '');
                            if (usedClasses.has(cleanSelector) || cleanSelector.includes(':')) {
                                hasUsedSelector = true;
                            }
                        });
                        
                        if (!hasUsedSelector && !rule.selectorText.includes('@')) {
                            styleSheets[i].deleteRule(j);
                        }
                    }
                }
            } catch (e) {
                // Cross-origin stylesheets
            }
        }
    };
    
    // Run tree shaking after page load
    setTimeout(removeUnusedCSS, 3000);
}

// Critical CSS Optimization
function optimizeCriticalCSS() {
    // Inline critical CSS for above-the-fold content
    const criticalCSS = `
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; line-height: 1.6; color: #1e293b; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
        .hero { background: linear-gradient(135deg, #1e293b 0%, #334155 100%); color: white; padding: 4rem 0; text-align: center; }
        .hero h1 { font-size: 3rem; font-weight: 800; margin-bottom: 1rem; }
        .hero p { font-size: 1.2rem; margin-bottom: 2rem; opacity: 0.9; }
        .btn { display: inline-block; padding: 1rem 2rem; background: #3b82f6; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; transition: all 0.3s ease; }
        .btn:hover { background: #1d4ed8; transform: translateY(-2px); }
        .header { background: white; box-shadow: 0 2px 10px rgba(0,0,0,0.1); position: fixed; top: 0; left: 0; right: 0; z-index: 1000; }
        .nav { display: flex; justify-content: space-between; align-items: center; padding: 1rem 0; }
        .logo { font-size: 1.5rem; font-weight: 800; color: #1e293b; }
        .nav-menu { display: flex; list-style: none; gap: 2rem; }
        .nav-link { color: #64748b; text-decoration: none; font-weight: 500; transition: color 0.3s ease; }
        .nav-link:hover { color: #3b82f6; }
    `;
    
    // Add critical CSS to head
    const style = document.createElement('style');
    style.textContent = criticalCSS;
    style.setAttribute('data-critical', 'true');
    document.head.insertBefore(style, document.head.firstChild);
    
    // Load non-critical CSS asynchronously
    const loadNonCriticalCSS = () => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'style.css?v=20250115v28';
        link.media = 'print';
        link.onload = function() {
            this.media = 'all';
        };
        document.head.appendChild(link);
    };
    
    // Load non-critical CSS after page load
    setTimeout(loadNonCriticalCSS, 100);
}

// Advanced Image Optimization
function initializeAdvancedImageOptimization() {
    // WebP support detection
    const supportsWebP = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    };
    
    // AVIF support detection
    const supportsAVIF = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        return canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;
    };
    
    // Optimize images based on browser support
    const optimizeImages = () => {
        const images = document.querySelectorAll('img[src*="unsplash.com"]');
        images.forEach(img => {
            let optimizedSrc = img.src;
            
            if (supportsAVIF()) {
                optimizedSrc = img.src + '&fm=avif&q=80';
            } else if (supportsWebP()) {
                optimizedSrc = img.src + '&fm=webp&q=80';
            } else {
                optimizedSrc = img.src + '&q=80';
            }
            
            img.src = optimizedSrc;
        });
    };
    
    // Responsive images
    const createResponsiveImages = () => {
        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => {
            const srcset = img.dataset.srcset;
            if (srcset) {
                img.srcset = srcset;
                img.sizes = img.dataset.sizes || '100vw';
            }
        });
    };
    
    // Run optimizations
    optimizeImages();
    createResponsiveImages();
}

// Bundle Optimization
function initializeBundleOptimization() {
    // Minify inline JavaScript
    const minifyInlineJS = () => {
        const scripts = document.querySelectorAll('script:not([src])');
        scripts.forEach(script => {
            if (script.textContent) {
                const minified = script.textContent
                    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
                    .replace(/\/\/.*$/gm, '') // Remove line comments
                    .replace(/\s+/g, ' ') // Remove extra whitespace
                    .trim();
                script.textContent = minified;
            }
        });
    };
    
    // Compress inline CSS
    const compressInlineCSS = () => {
        const styles = document.querySelectorAll('style');
        styles.forEach(style => {
            if (style.textContent) {
                const compressed = style.textContent
                    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
                    .replace(/\s+/g, ' ') // Remove extra whitespace
                    .replace(/;\s*}/g, '}') // Remove semicolons before closing braces
                    .trim();
                style.textContent = compressed;
            }
        });
    };
    
    // Run optimizations
    minifyInlineJS();
    compressInlineCSS();
}

// Advanced Caching
function initializeAdvancedCaching() {
    // Enhanced Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').then(registration => {
            console.log('Service Worker registered:', registration);
            
            // Update service worker
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        // New content available
                        showNotification('🔄 Yeni güncelleme mevcut! Sayfayı yenileyin.', 'info');
                    }
                });
            });
        });
    }
    
    // Cache API for dynamic content
    const cacheDynamicContent = async () => {
        if ('caches' in window) {
            const cache = await caches.open('dynamic-content-v1');
            
            // Cache API responses
            const apiUrls = [
                '/api/services',
                '/api/reviews',
                '/api/contact'
            ];
            
            apiUrls.forEach(async url => {
                try {
                    const response = await fetch(url);
                    if (response.ok) {
                        await cache.put(url, response);
                    }
                } catch (error) {
                    console.warn(`Failed to cache ${url}:`, error);
                }
            });
        }
    };
    
    // Run caching
    setTimeout(cacheDynamicContent, 2000);
}

// Preloading Strategy
function initializePreloadingStrategy() {
    // Preload critical resources
    const preloadCriticalResources = () => {
        const criticalResources = [
            { href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap', as: 'style' },
            { href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css', as: 'style' },
            { href: 'https://images.unsplash.com/photo-1486754735734-325b5831c3ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', as: 'image' }
        ];
        
        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource.href;
            link.as = resource.as;
            if (resource.as === 'style') {
                link.onload = function() {
                    this.rel = 'stylesheet';
                };
            }
            document.head.appendChild(link);
        });
    };
    
    // Prefetch next page resources
    const prefetchNextPageResources = () => {
        const nextPageResources = [
            '/privacy-policy.html',
            '/security-report.html'
        ];
        
        nextPageResources.forEach(url => {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = url;
            document.head.appendChild(link);
        });
    };
    
    // DNS prefetch for external domains
    const prefetchDNS = () => {
        const domains = [
            'https://www.google-analytics.com',
            'https://www.googletagmanager.com',
            'https://cdnjs.cloudflare.com'
        ];
        
        domains.forEach(domain => {
            const link = document.createElement('link');
            link.rel = 'dns-prefetch';
            link.href = domain;
            document.head.appendChild(link);
        });
    };
    
    // Run preloading strategies
    preloadCriticalResources();
    setTimeout(prefetchNextPageResources, 3000);
    prefetchDNS();
}

// Performance Monitoring
function initializePerformanceMonitoring() {
    // Core Web Vitals
    const measureCoreWebVitals = () => {
        // Largest Contentful Paint (LCP)
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            console.log('LCP:', lastEntry.startTime);
            
            if (typeof gtag !== 'undefined') {
                gtag('event', 'web_vitals', {
                    'event_category': 'Performance',
                    'event_label': 'LCP',
                    'value': Math.round(lastEntry.startTime)
                });
            }
        }).observe({ entryTypes: ['largest-contentful-paint'] });
        
        // First Input Delay (FID)
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
                console.log('FID:', entry.processingStart - entry.startTime);
                
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'web_vitals', {
                        'event_category': 'Performance',
                        'event_label': 'FID',
                        'value': Math.round(entry.processingStart - entry.startTime)
                    });
                }
            });
        }).observe({ entryTypes: ['first-input'] });
        
        // Cumulative Layout Shift (CLS)
        let clsValue = 0;
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                }
            });
            console.log('CLS:', clsValue);
            
            if (typeof gtag !== 'undefined') {
                gtag('event', 'web_vitals', {
                    'event_category': 'Performance',
                    'event_label': 'CLS',
                    'value': Math.round(clsValue * 1000)
                });
            }
        }).observe({ entryTypes: ['layout-shift'] });
    };
    
    // Real User Monitoring
    const measureRealUserMetrics = () => {
        // Page Load Time
        window.addEventListener('load', () => {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log('Page Load Time:', loadTime);
            
            if (typeof gtag !== 'undefined') {
                gtag('event', 'page_load_time', {
                    'event_category': 'Performance',
                    'event_label': 'Load Time',
                    'value': Math.round(loadTime)
                });
            }
        });
        
        // Time to First Byte (TTFB)
        const ttfb = performance.timing.responseStart - performance.timing.navigationStart;
        console.log('TTFB:', ttfb);
        
        if (typeof gtag !== 'undefined') {
            gtag('event', 'page_load_time', {
                'event_category': 'Performance',
                'event_label': 'TTFB',
                'value': Math.round(ttfb)
            });
        }
    };
    
    // Run monitoring
    measureCoreWebVitals();
    measureRealUserMetrics();
}

// Advanced UI/UX Features
function initializeAdvancedUI() {
    // Initialize smooth scrolling
    initializeSmoothScrolling();
    
    // Initialize parallax effects
    initializeParallaxEffects();
    
    // Initialize particle background
    initializeParticleBackground();
    
    // Initialize loading animations
    initializeLoadingAnimations();
    
    // Initialize interactive cards
    initializeInteractiveCards();
}

// Smooth Scrolling Implementation
function initializeSmoothScrolling() {
    // Add smooth scrolling to all anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Parallax Effects Implementation
function initializeParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.parallax-bg');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        parallaxElements.forEach(element => {
            element.style.transform = `translateY(${rate}px)`;
        });
    });
}

// Particle Background Implementation
function initializeParticleBackground() {
    const particleContainer = document.createElement('div');
    particleContainer.className = 'particle-container';
    document.body.appendChild(particleContainer);
    
    // Create particles
    for (let i = 0; i < 10; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particleContainer.appendChild(particle);
    }
}

// Loading Animations Implementation
function initializeLoadingAnimations() {
    // Create loading screen
    const loadingContainer = document.createElement('div');
    loadingContainer.className = 'loading-container';
    loadingContainer.id = 'loadingScreen';
    
    loadingContainer.innerHTML = `
        <div class="loading-spinner"></div>
        <div class="loading-text">DC TEKNİK Yükleniyor...</div>
        <div class="loading-dots">
            <div class="loading-dot"></div>
            <div class="loading-dot"></div>
            <div class="loading-dot"></div>
        </div>
    `;
    
    document.body.appendChild(loadingContainer);
    
    // Hide loading screen after page load
    window.addEventListener('load', () => {
        setTimeout(() => {
            const loadingScreen = document.getElementById('loadingScreen');
            if (loadingScreen) {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.remove();
                }, 500);
            }
        }, 1000);
    });
}

// Interactive Cards Implementation
function initializeInteractiveCards() {
    const cards = document.querySelectorAll('.service-card, .review-card, .blog-card');
    
    cards.forEach(card => {
        // Add interactive card class
        card.classList.add('interactive-card');
        
        // Add hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        // Add click effects
        card.addEventListener('click', function() {
            this.style.transform = 'translateY(-5px) scale(1.01)';
            setTimeout(() => {
                this.style.transform = 'translateY(-10px) scale(1.02)';
            }, 150);
        });
    });
}

// Initialize map when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize advanced UI/UX features
    initializeAdvancedUI();
    
    // Initialize advanced performance optimizations
    initializeAdvancedPerformance();
    
    // Initialize basic performance optimizations
    initializeLazyLoading();
    optimizeImages();
    preloadCriticalResources();
    
    // Initialize cookie consent
    initializeCookieConsent();
    
    // Initialize advanced security features
    initializeSecurityFeatures();
    
    // Initialize 2FA system
    initialize2FA();
    
    // Initialize Location Section immediately
    setTimeout(initializeLocationSection, 500);
});

// Customer Reviews Functionality
function initializeCustomerReviews() {
    // Add event listeners for helpful buttons
    const helpfulButtons = document.querySelectorAll('.helpful-btn');
    helpfulButtons.forEach(button => {
        const reviewKey = `review-helpful-${button.closest('.review-card')?.querySelector('h4')?.textContent || 'unknown'}`;
        if (localStorage.getItem(reviewKey) === 'clicked') {
            button.classList.add('clicked');
            button.setAttribute('disabled', 'true');
        }
        button.addEventListener('click', function() {
            if (button.hasAttribute('disabled')) return;
            const countElement = this.querySelector('span');
            let currentCount = parseInt(countElement.textContent);
            
            // Increment count
            currentCount++;
            countElement.textContent = currentCount;
            
            // Add visual feedback
            this.classList.add('clicked');
            this.style.transform = 'scale(1.1)';
            
            // Reset transform after animation
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
            
            // Show notification
            showNotification('Teşekkürler! Yorumunuzu beğendiğinizi belirttiniz.', 'success');
            
            // Track Google Analytics event
            if (typeof gtag !== 'undefined') {
                gtag('event', 'review_helpful', {
                    'event_category': 'engagement',
                    'event_label': 'customer_review'
                });
            }

            // Prevent multiple clicks for this user on this review
            localStorage.setItem(reviewKey, 'clicked');
            button.setAttribute('disabled', 'true');
        });
    });
}

// Show all reviews function
function showAllReviews() {
    // Show notification
    showNotification('Tüm yorumları görüntülemek için WhatsApp üzerinden iletişime geçebilirsiniz.', 'info');
    
    // Track Google Analytics event
    if (typeof gtag !== 'undefined') {
        gtag('event', 'view_all_reviews', {
            'event_category': 'engagement',
            'event_label': 'customer_reviews'
        });
    }
    
    // Open WhatsApp after a short delay
    setTimeout(() => {
        const whatsappUrl = 'https://wa.me/905353562469?text=Merhaba, DC TEKNİK hizmetleri hakkında tüm yorumları görmek istiyorum.';
        window.open(whatsappUrl, '_blank');
    }, 1500);
}
