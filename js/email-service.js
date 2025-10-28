/**
 * DC TEKNİK - Email Service
 * Form submissions için EmailJS entegrasyonu
 */

(function() {
    'use strict';

    // EmailJS Public Key - Kullanıcı kendi key'ini eklemeli
    const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID'; // EmailJS'den alınacak
    const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID'; // EmailJS'den alınacak
    const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY'; // EmailJS'den alınacak
    
    // EmailJS API'yi yükle
    if (!window.EmailJS) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
        script.async = true;
        script.onload = function() {
            if (window.emailjs) {
                window.emailjs.init(EMAILJS_PUBLIC_KEY);
            }
        };
        document.head.appendChild(script);
    }

    /**
     * Send email via EmailJS
     */
    window.sendEmail = function(formData, options = {}) {
        return new Promise(function(resolve, reject) {
            // EmailJS yüklenmiş mi kontrol et
            if (!window.emailjs) {
                reject(new Error('EmailJS not loaded'));
                return;
            }

            // Form data'yı EmailJS formatına çevir
            const templateParams = {
                from_name: formData.name || formData.from_name || 'Ziyaretçi',
                from_email: formData.email || formData.from_email || '',
                phone: formData.phone || formData.tel || '',
                message: formData.message || formData.mesaj || '',
                subject: formData.subject || 'DC TEKNİK - İletişim Formu',
                service_type: formData.service_type || '',
                to_email: options.to_email || 'serdaraltan890@gmail.com',
                reply_to: formData.email || formData.from_email || '',
                website: 'DC TEKNİK - dctenık.com',
                timestamp: new Date().toISOString()
            };

            // Email gönder
            window.emailjs.send(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                templateParams
            )
            .then(function(response) {
                console.log('✅ Email sent successfully:', response.status, response.text);
                resolve(response);
            })
            .catch(function(error) {
                console.error('❌ Email sending failed:', error);
                reject(error);
            });
        });
    };

    /**
     * Fallback: Formspree alternative (eğer EmailJS çalışmazsa)
     */
    window.sendEmailFormspree = function(formData, options = {}) {
        return new Promise(function(resolve, reject) {
            const FormspreeEndpoint = 'https://formspree.io/f/YOUR_FORM_ID'; // Formspree'den alınacak
            
            fetch(FormspreeEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name: formData.name || formData.from_name,
                    email: formData.email || formData.from_email,
                    phone: formData.phone || formData.tel,
                    message: formData.message || formData.mesaj,
                    subject: formData.subject || 'DC TEKNİK - İletişim Formu',
                    _subject: 'DC TEKNİK - Yeni İletişim Formu',
                    _replyto: formData.email || formData.from_email,
                    _format: 'plain'
                })
            })
            .then(function(response) {
                if (response.ok) {
                    console.log('✅ Email sent via Formspree');
                    resolve(response);
                } else {
                    throw new Error('Formspree error: ' + response.status);
                }
            })
            .catch(function(error) {
                console.error('❌ Formspree error:', error);
                reject(error);
            });
        });
    };

    /**
     * Send email with fallback
     */
    window.sendEmailWithFallback = function(formData, options = {}) {
        // Önce EmailJS dene
        return window.sendEmail(formData, options)
            .catch(function(error) {
                console.warn('⚠️ EmailJS failed, trying Formspree fallback...');
                // EmailJS başarısız olursa Formspree dene
                return window.sendEmailFormspree(formData, options);
            });
    };

    /**
     * Send auto-reply email to customer
     */
    window.sendAutoReply = function(customerEmail, customerName) {
        if (!customerEmail) return Promise.resolve();

        const autoReplyParams = {
            to_email: customerEmail,
            to_name: customerName || 'Değerli Müşterimiz',
            from_name: 'DC TEKNİK - Dinamocu Serdar',
            message: 'Mesajınızı aldık. En kısa sürede size geri dönüş yapacağız.',
            subject: 'DC TEKNİK - Mesajınız Alındı',
            phone: '0535 356 24 69',
            website: 'dctenık.com'
        };

        // Auto-reply template ID (EmailJS'de ayrı bir template olmalı)
        if (window.emailjs && EMAILJS_SERVICE_ID !== 'YOUR_SERVICE_ID') {
            return window.emailjs.send(
                EMAILJS_SERVICE_ID,
                'auto_reply_template_id', // Auto-reply için template ID
                autoReplyParams
            ).catch(function(error) {
                console.warn('Auto-reply failed:', error);
                // Non-critical, continue
            });
        }

        return Promise.resolve();
    };

    // Initialize EmailJS when available
    if (typeof window !== 'undefined') {
        window.EmailService = {
            send: window.sendEmail,
            sendWithFallback: window.sendEmailWithFallback,
            sendAutoReply: window.sendAutoReply,
            isConfigured: function() {
                return EMAILJS_SERVICE_ID !== 'YOUR_SERVICE_ID' && 
                       EMAILJS_TEMPLATE_ID !== 'YOUR_TEMPLATE_ID' &&
                       EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY';
            }
        };

        console.log('✅ Email Service loaded');
    }
})();

