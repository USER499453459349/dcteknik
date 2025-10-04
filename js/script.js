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
        themeToggle.addEventListener('click', toggleTheme);
        
        // Update initial icon
        const themeIcon = document.getElementById('themeIcon');
        if (themeIcon) {
            themeIcon.className = isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
        }
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
        showNotification('🤖 AI Chatbot başlatılıyor...', 'info');
        
        // Simulate AI response
        setTimeout(() => {
            const responses = [
                "Merhaba! DC TEKNİK AI asistanıyım. Size nasıl yardımcı olabilirim?",
                "Aracınızda hangi sorun yaşıyorsunuz? Detaylı bilgi verebilir misiniz?",
                "Dinamo, alternatör veya marş motoru ile ilgili sorunuz mu var?",
                "Acil durum mu? Hemen teknik destek sağlayabilirim."
            ];
            
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            showNotification(`🤖 AI: ${randomResponse}`, 'success');
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
        showNotification('🎬 AI Demo başlatılıyor...', 'info');
        
        // Simulate demo process
        setTimeout(() => {
            showNotification('🤖 AI Demo: Arıza tespiti ve çözüm önerileri gösteriliyor...', 'success');
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
