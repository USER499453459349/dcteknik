/**
 * WhatsApp Marketing Automation System
 * DC TEKNİK - Dinamocu Serdar
 * Version: 1.0.0
 */

class WhatsAppAutomation {
    constructor() {
        this.config = {
            phoneNumber: '+9055353562469',
            businessName: 'DC TEKNİK',
            automationEnabled: true,
            leadTracking: true,
            followUpEnabled: true
        };
        
        this.leadData = {
            newLeads: [],
            qualifiedLeads: [],
            convertedLeads: [],
            followUpQueue: []
        };
        
        this.templates = {
            welcome: {
                tr: `Merhaba! DC TEKNİK - Dinamocu Serdar'a hoş geldiniz! 🚗⚡

Dinamo, alternatör ve marş motoru konusunda 15+ yıllık deneyimimizle hizmetinizdeyiz.

🎯 Hangi konuda yardımcı olabilirim?
• Dinamo tamiri
• Alternatör servisi  
• Marş motoru onarımı
• Genel elektrik arızaları

📞 Hemen arayın: +90 535 356 24 69
📍 Sultanbeyli, İstanbul

%100 garantili, hızlı teşhis, şeffaf fiyat! 💪`,
                en: `Hello! Welcome to DC TEKNİK - Dinamocu Serdar! 🚗⚡

We serve you with 15+ years of experience in dynamo, alternator and starter motor.

🎯 How can I help you?
• Dynamo repair
• Alternator service
• Starter motor repair
• General electrical faults

📞 Call now: +90 535 356 24 69
📍 Sultanbeyli, Istanbul

100% guaranteed, fast diagnosis, transparent pricing! 💪`
            },
            
            serviceInquiry: {
                tr: `Dinamo servisi hakkında bilgi almak istiyorsunuz! 🔧

✅ Hizmetlerimiz:
• Dinamo tamiri (150₺'den başlayan fiyatlarla)
• Alternatör servisi
• Marş motoru onarımı
• Genel elektrik arızaları

🎁 Özel Teklif: İlk kez gelen müşterilerimize %20 indirim!

📞 Randevu için: +90 535 356 24 69
⏰ Çalışma saatleri: 08:00 - 18:00 (Pazartesi-Cumartesi)

📍 Adres: Atatürk Cad. No:312, Sultanbeyli, İstanbul

Hemen arayın, ücretsiz keşif yapalım! 🚀`,
                en: `Hold on! You want information about dynamo service! 🔧

✅ Our services:
• Dynamo repair (starting from 150₺)
• Alternator service
• Starter motor repair
• General electrical faults

🎁 Special Offer: 20% discount for first-time customers!

📞 For appointment: +90 535 356 24 69
⏰ Working hours: 08:00 - 18:00 (Monday-Saturday)

📍 Address: Atatürk Cad. No:312, Sultanbeyli, Istanbul

Call now, let's do free discovery! 🚀`
            },
            
            appointmentReminder: {
                tr: `Randevu Hatırlatması 📅

Merhaba! Yarın saat 10:00'da DC TEKNİK'te randevunuz bulunmaktadır.

📍 Adres: Atatürk Cad. No:312, Sultanbeyli, İstanbul
⏰ Randevu saati: 10:00
🔧 Hizmet: Dinamo tamiri

Randevunuzu iptal etmek veya değiştirmek için lütfen arayın: +90 535 356 24 69

Teşekkürler! 🙏`,
                en: `Appointment Reminder 📅

Hello! You have an appointment tomorrow at 10:00 at DC TEKNİK.

📍 Address: Atatürk Cad. No:312, Sultanbeyli, Istanbul
⏰ Appointment time: 10:00
🔧 Service: Dynamo repair

Please call to cancel or change your appointment: +90 535 356 24 69

Thank you! 🙏`
            },
            
            followUp: {
                tr: `Takip Mesajı 🔄

Merhaba! Dinamo servisi hakkında konuşmuştuk.

Hala yardıma ihtiyacınız var mı? 

✅ Hizmetlerimiz:
• Dinamo tamiri (150₺'den başlayan fiyatlarla)
• Alternatör servisi
• Marş motoru onarımı

📞 Hemen arayın: +90 535 356 24 69
🎁 İlk kez gelen müşterilerimize %20 indirim!

DC TEKNİK - Dinamocu Serdar 💪`,
                en: `Follow-up Message 🔄

Hello! We talked about dynamo service.

Do you still need help?

✅ Our services:
• Dynamo repair (starting from 150₺)
• Alternator service
• Starter motor repair

📞 Call now: +90 535 356 24 69
🎁 20% discount for first-time customers!

DC TEKNİK - Dinamocu Serdar 💪`
            },
            
            thankYou: {
                tr: `Teşekkürler! 🙏

DC TEKNİK'i tercih ettiğiniz için teşekkür ederiz!

⭐ Google'da değerlendirme yapmak ister misiniz?
🔗 https://g.page/dcteknik/review

📞 Herhangi bir sorunuz olursa: +90 535 356 24 69

DC TEKNİK - Dinamocu Serdar 💪`,
                en: `Thank you! 🙏

Thank you for choosing DC TEKNİK!

⭐ Would you like to leave a review on Google?
🔗 https://g.page/dcteknik/review

📞 If you have any questions: +90 535 356 24 69

DC TEKNİK - Dinamocu Serdar 💪`
            }
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadStoredLeads();
        this.startAutomation();
        this.trackPageViews();
    }
    
    setupEventListeners() {
        // WhatsApp button clicks
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-whatsapp]')) {
                this.handleWhatsAppClick(e.target.closest('[data-whatsapp]'));
            }
        });
        
        // Form submissions
        document.addEventListener('submit', (e) => {
            if (e.target.classList.contains('contact-form') || e.target.classList.contains('lead-form')) {
                this.handleFormSubmission(e.target);
            }
        });
        
        // Phone number clicks
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-phone]')) {
                this.handlePhoneClick(e.target.closest('[data-phone]'));
            }
        });
    }
    
    handleWhatsAppClick(element) {
        const source = element.getAttribute('data-whatsapp') || 'unknown';
        const message = this.generateMessage(source);
        const phoneNumber = this.config.phoneNumber;
        
        // Track the click
        this.trackEvent('whatsapp_click', {
            source: source,
            message: message,
            timestamp: new Date().toISOString()
        });
        
        // Generate WhatsApp URL
        const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
        
        // Open WhatsApp
        window.open(whatsappUrl, '_blank');
        
        // Add to lead tracking
        this.addLead({
            type: 'whatsapp_inquiry',
            source: source,
            message: message,
            timestamp: new Date().toISOString()
        });
    }
    
    handlePhoneClick(element) {
        const source = element.getAttribute('data-phone') || 'unknown';
        const phoneNumber = this.config.phoneNumber;
        
        // Track the click
        this.trackEvent('phone_click', {
            source: source,
            phoneNumber: phoneNumber,
            timestamp: new Date().toISOString()
        });
        
        // Add to lead tracking
        this.addLead({
            type: 'phone_call',
            source: source,
            phoneNumber: phoneNumber,
            timestamp: new Date().toISOString()
        });
    }
    
    handleFormSubmission(form) {
        const formData = new FormData(form);
        const leadData = {
            type: 'form_submission',
            source: 'contact_form',
            timestamp: new Date().toISOString(),
            data: Object.fromEntries(formData)
        };
        
        // Track the submission
        this.trackEvent('form_submission', leadData);
        
        // Add to lead tracking
        this.addLead(leadData);
        
        // Send follow-up message
        setTimeout(() => {
            this.sendFollowUpMessage(leadData);
        }, 5000);
    }
    
    generateMessage(source) {
        const language = this.getUserLanguage();
        let template = 'welcome';
        
        // Choose template based on source
        switch(source) {
            case 'service-dinamo':
            case 'service-alternator':
            case 'service-starter':
                template = 'serviceInquiry';
                break;
            case 'hero-cta':
            case 'nav-cta':
                template = 'welcome';
                break;
            default:
                template = 'welcome';
        }
        
        return this.templates[template][language] || this.templates[template].tr;
    }
    
    getUserLanguage() {
        // Try to detect user language
        const browserLang = navigator.language || navigator.userLanguage;
        if (browserLang.startsWith('en')) return 'en';
        if (browserLang.startsWith('tr')) return 'tr';
        return 'tr'; // Default to Turkish
    }
    
    addLead(leadData) {
        this.leadData.newLeads.push(leadData);
        this.saveLeads();
        
        // Send to analytics
        this.sendToAnalytics('lead_generated', leadData);
        
        // Add to follow-up queue
        if (this.config.followUpEnabled) {
            this.addToFollowUpQueue(leadData);
        }
    }
    
    addToFollowUpQueue(leadData) {
        const followUpTime = new Date();
        followUpTime.setHours(followUpTime.getHours() + 24); // 24 hours later
        
        this.leadData.followUpQueue.push({
            ...leadData,
            followUpTime: followUpTime.toISOString(),
            status: 'pending'
        });
        
        this.saveLeads();
    }
    
    sendFollowUpMessage(leadData) {
        if (!this.config.automationEnabled) return;
        
        const language = this.getUserLanguage();
        const message = this.templates.followUp[language] || this.templates.followUp.tr;
        
        // In a real implementation, this would send via WhatsApp Business API
        console.log('Follow-up message would be sent:', message);
        
        // Track follow-up
        this.trackEvent('follow_up_sent', {
            leadId: leadData.timestamp,
            message: message,
            timestamp: new Date().toISOString()
        });
    }
    
    startAutomation() {
        // Check for pending follow-ups every hour
        setInterval(() => {
            this.processFollowUpQueue();
        }, 60 * 60 * 1000); // 1 hour
        
        // Process follow-ups immediately
        this.processFollowUpQueue();
    }
    
    processFollowUpQueue() {
        const now = new Date();
        const pendingFollowUps = this.leadData.followUpQueue.filter(
            followUp => new Date(followUp.followUpTime) <= now && followUp.status === 'pending'
        );
        
        pendingFollowUps.forEach(followUp => {
            this.sendFollowUpMessage(followUp);
            followUp.status = 'sent';
        });
        
        if (pendingFollowUps.length > 0) {
            this.saveLeads();
        }
    }
    
    trackEvent(eventName, eventData) {
        // Send to Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, {
                event_category: 'WhatsApp_Automation',
                event_label: eventData.source || 'unknown',
                value: eventData.value || 0,
                custom_parameters: eventData
            });
        }
        
        // Send to custom analytics
        this.sendToAnalytics(eventName, eventData);
    }
    
    sendToAnalytics(eventName, eventData) {
        // Send to your analytics endpoint
        fetch('/api/analytics', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                event: eventName,
                data: eventData,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                url: window.location.href
            })
        }).catch(error => {
            console.log('Analytics error:', error);
        });
    }
    
    trackPageViews() {
        // Track page views for lead scoring
        this.trackEvent('page_view', {
            page: window.location.pathname,
            referrer: document.referrer,
            timestamp: new Date().toISOString()
        });
    }
    
    loadStoredLeads() {
        try {
            const stored = localStorage.getItem('dcteknik_leads');
            if (stored) {
                this.leadData = { ...this.leadData, ...JSON.parse(stored) };
            }
        } catch (error) {
            console.log('Error loading stored leads:', error);
        }
    }
    
    saveLeads() {
        try {
            localStorage.setItem('dcteknik_leads', JSON.stringify(this.leadData));
        } catch (error) {
            console.log('Error saving leads:', error);
        }
    }
    
    // Public methods for external use
    getLeadStats() {
        return {
            totalLeads: this.leadData.newLeads.length,
            qualifiedLeads: this.leadData.qualifiedLeads.length,
            convertedLeads: this.leadData.convertedLeads.length,
            pendingFollowUps: this.leadData.followUpQueue.filter(f => f.status === 'pending').length
        };
    }
    
    exportLeads() {
        return {
            leads: this.leadData.newLeads,
            followUps: this.leadData.followUpQueue,
            exportDate: new Date().toISOString()
        };
    }
    
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        this.saveConfig();
    }
    
    saveConfig() {
        try {
            localStorage.setItem('dcteknik_automation_config', JSON.stringify(this.config));
        } catch (error) {
            console.log('Error saving config:', error);
        }
    }
}

// Initialize WhatsApp Automation
const whatsappAutomation = new WhatsAppAutomation();

// Export for global access
window.whatsappAutomation = whatsappAutomation;

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Already initialized in constructor
    });
}
