/**
 * Email Marketing Automation System
 * DC TEKNİK - Dinamocu Serdar
 * Version: 1.0.0
 */

class EmailMarketing {
    constructor() {
        this.config = {
            apiEndpoint: '/api/email',
            automationEnabled: true,
            leadNurturing: true,
            newsletterEnabled: true,
            segmentationEnabled: true
        };
        
        this.emailTemplates = {
            welcome: {
                subject: {
                    tr: 'DC TEKNİK\'e Hoş Geldiniz! 🚗⚡',
                    en: 'Welcome to DC TEKNİK! 🚗⚡'
                },
                content: {
                    tr: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                            <div style="background: linear-gradient(135deg, #0b5cff, #3b82f6); color: white; padding: 30px; text-align: center;">
                                <h1 style="margin: 0; font-size: 28px;">DC TEKNİK</h1>
                                <p style="margin: 10px 0 0 0; font-size: 16px;">Dinamocu Serdar</p>
                            </div>
                            
                            <div style="padding: 30px; background: #f8f9fa;">
                                <h2 style="color: #1f2937; margin-bottom: 20px;">Hoş Geldiniz! 👋</h2>
                                
                                <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
                                    DC TEKNİK ailesine katıldığınız için teşekkür ederiz! 
                                    15+ yıllık deneyimimizle dinamo, alternatör ve marş motoru konusunda 
                                    profesyonel hizmet sunuyoruz.
                                </p>
                                
                                <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
                                    <h3 style="color: #1f2937; margin-bottom: 15px;">🎁 Özel Hoş Geldin Hediyesi</h3>
                                    <p style="color: #4b5563; margin-bottom: 15px;">
                                        İlk kez gelen müşterilerimize özel %20 indirim!
                                    </p>
                                    <a href="https://wa.me/9055353562469?text=Hoş%20geldin%20indirimi%20hakkında%20bilgi%20almak%20istiyorum" 
                                       style="background: #25d366; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                                        WhatsApp ile İletişim
                                    </a>
                                </div>
                                
                                <div style="margin: 30px 0;">
                                    <h3 style="color: #1f2937; margin-bottom: 15px;">Hizmetlerimiz</h3>
                                    <ul style="color: #4b5563; line-height: 1.8;">
                                        <li>🔧 Dinamo tamiri (150₺'den başlayan fiyatlarla)</li>
                                        <li>⚡ Alternatör servisi</li>
                                        <li>🚗 Marş motoru onarımı</li>
                                        <li>🔌 Genel elektrik arızaları</li>
                                    </ul>
                                </div>
                                
                                <div style="background: #e5f3ff; padding: 20px; border-radius: 10px; margin: 20px 0;">
                                    <h3 style="color: #1f2937; margin-bottom: 15px;">💪 Neden DC TEKNİK?</h3>
                                    <ul style="color: #4b5563; line-height: 1.8;">
                                        <li>✅ 15+ yıl deneyim</li>
                                        <li>✅ %100 garanti</li>
                                        <li>✅ Hızlı teşhis</li>
                                        <li>✅ Şeffaf fiyat</li>
                                        <li>✅ Profesyonel ekip</li>
                                    </ul>
                                </div>
                            </div>
                            
                            <div style="background: #1f2937; color: white; padding: 30px; text-align: center;">
                                <h3 style="margin-bottom: 15px;">İletişim Bilgileri</h3>
                                <p style="margin: 5px 0;">📞 Telefon: +90 535 356 24 69</p>
                                <p style="margin: 5px 0;">📍 Adres: Atatürk Cad. No:312, Sultanbeyli, İstanbul</p>
                                <p style="margin: 5px 0;">⏰ Çalışma Saatleri: 08:00 - 18:00 (Pazartesi-Cumartesi)</p>
                                
                                <div style="margin-top: 20px;">
                                    <a href="https://wa.me/9055353562469" style="color: #25d366; text-decoration: none; margin: 0 10px;">WhatsApp</a>
                                    <a href="tel:+9055353562469" style="color: #0b5cff; text-decoration: none; margin: 0 10px;">Telefon</a>
                                </div>
                            </div>
                        </div>
                    `,
                    en: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                            <div style="background: linear-gradient(135deg, #0b5cff, #3b82f6); color: white; padding: 30px; text-align: center;">
                                <h1 style="margin: 0; font-size: 28px;">DC TEKNİK</h1>
                                <p style="margin: 10px 0 0 0; font-size: 16px;">Dinamocu Serdar</p>
                            </div>
                            
                            <div style="padding: 30px; background: #f8f9fa;">
                                <h2 style="color: #1f2937; margin-bottom: 20px;">Welcome! 👋</h2>
                                
                                <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
                                    Thank you for joining the DC TEKNİK family! 
                                    With 15+ years of experience, we provide professional service 
                                    in dynamo, alternator and starter motor.
                                </p>
                                
                                <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
                                    <h3 style="color: #1f2937; margin-bottom: 15px;">🎁 Special Welcome Gift</h3>
                                    <p style="color: #4b5563; margin-bottom: 15px;">
                                        Special 20% discount for first-time customers!
                                    </p>
                                    <a href="https://wa.me/9055353562469?text=I%20want%20information%20about%20welcome%20discount" 
                                       style="background: #25d366; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                                        Contact via WhatsApp
                                    </a>
                                </div>
                                
                                <div style="margin: 30px 0;">
                                    <h3 style="color: #1f2937; margin-bottom: 15px;">Our Services</h3>
                                    <ul style="color: #4b5563; line-height: 1.8;">
                                        <li>🔧 Dynamo repair (starting from 150₺)</li>
                                        <li>⚡ Alternator service</li>
                                        <li>🚗 Starter motor repair</li>
                                        <li>🔌 General electrical faults</li>
                                    </ul>
                                </div>
                                
                                <div style="background: #e5f3ff; padding: 20px; border-radius: 10px; margin: 20px 0;">
                                    <h3 style="color: #1f2937; margin-bottom: 15px;">💪 Why DC TEKNİK?</h3>
                                    <ul style="color: #4b5563; line-height: 1.8;">
                                        <li>✅ 15+ years experience</li>
                                        <li>✅ 100% guarantee</li>
                                        <li>✅ Fast diagnosis</li>
                                        <li>✅ Transparent pricing</li>
                                        <li>✅ Professional team</li>
                                    </ul>
                                </div>
                            </div>
                            
                            <div style="background: #1f2937; color: white; padding: 30px; text-align: center;">
                                <h3 style="margin-bottom: 15px;">Contact Information</h3>
                                <p style="margin: 5px 0;">📞 Phone: +90 535 356 24 69</p>
                                <p style="margin: 5px 0;">📍 Address: Atatürk Cad. No:312, Sultanbeyli, Istanbul</p>
                                <p style="margin: 5px 0;">⏰ Working Hours: 08:00 - 18:00 (Monday-Saturday)</p>
                                
                                <div style="margin-top: 20px;">
                                    <a href="https://wa.me/9055353562469" style="color: #25d366; text-decoration: none; margin: 0 10px;">WhatsApp</a>
                                    <a href="tel:+9055353562469" style="color: #0b5cff; text-decoration: none; margin: 0 10px;">Phone</a>
                                </div>
                            </div>
                        </div>
                    `
                }
            },
            
            serviceReminder: {
                subject: {
                    tr: 'Dinamo Bakım Zamanı! 🔧',
                    en: 'Time for Dynamo Maintenance! 🔧'
                },
                content: {
                    tr: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                            <div style="background: linear-gradient(135deg, #ea580c, #f59e0b); color: white; padding: 30px; text-align: center;">
                                <h1 style="margin: 0; font-size: 28px;">🔧 Bakım Hatırlatması</h1>
                                <p style="margin: 10px 0 0 0; font-size: 16px;">Dinamo bakım zamanı geldi!</p>
                            </div>
                            
                            <div style="padding: 30px; background: #f8f9fa;">
                                <h2 style="color: #1f2937; margin-bottom: 20px;">Dinamo Bakım Zamanı! ⏰</h2>
                                
                                <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
                                    Aracınızın dinamo bakım zamanı geldi. Düzenli bakım, 
                                    büyük arızaları önler ve sistemin verimli çalışmasını sağlar.
                                </p>
                                
                                <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #ea580c;">
                                    <h3 style="color: #1f2937; margin-bottom: 15px;">⚠️ Bakım Yapılmazsa:</h3>
                                    <ul style="color: #4b5563; line-height: 1.8;">
                                        <li>Dinamo arızası riski artar</li>
                                        <li>Yol kenarında kalma riski</li>
                                        <li>Daha yüksek tamir maliyeti</li>
                                        <li>Araç performansında düşüş</li>
                                    </ul>
                                </div>
                                
                                <div style="background: #e5f3ff; padding: 20px; border-radius: 10px; margin: 20px 0;">
                                    <h3 style="color: #1f2937; margin-bottom: 15px;">✅ Düzenli Bakım Faydaları:</h3>
                                    <ul style="color: #4b5563; line-height: 1.8;">
                                        <li>Arıza riskini %80 azaltır</li>
                                        <li>Dinamo ömrünü uzatır</li>
                                        <li>Yakıt tasarrufu sağlar</li>
                                        <li>Güvenli sürüş garantisi</li>
                                    </ul>
                                </div>
                                
                                <div style="text-align: center; margin: 30px 0;">
                                    <a href="https://wa.me/9055353562469?text=Dinamo%20bakımı%20hakkında%20bilgi%20almak%20istiyorum" 
                                       style="background: #25d366; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px;">
                                        🔧 Hemen Bakım Yaptır
                                    </a>
                                </div>
                            </div>
                        </div>
                    `,
                    en: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                            <div style="background: linear-gradient(135deg, #ea580c, #f59e0b); color: white; padding: 30px; text-align: center;">
                                <h1 style="margin: 0; font-size: 28px;">🔧 Maintenance Reminder</h1>
                                <p style="margin: 10px 0 0 0; font-size: 16px;">Time for dynamo maintenance!</p>
                            </div>
                            
                            <div style="padding: 30px; background: #f8f9fa;">
                                <h2 style="color: #1f2937; margin-bottom: 20px;">Time for Dynamo Maintenance! ⏰</h2>
                                
                                <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
                                    It's time for your vehicle's dynamo maintenance. Regular maintenance 
                                    prevents major failures and ensures efficient system operation.
                                </p>
                                
                                <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #ea580c;">
                                    <h3 style="color: #1f2937; margin-bottom: 15px;">⚠️ If Maintenance is Not Done:</h3>
                                    <ul style="color: #4b5563; line-height: 1.8;">
                                        <li>Increased risk of dynamo failure</li>
                                        <li>Risk of being stranded on the road</li>
                                        <li>Higher repair costs</li>
                                        <li>Decreased vehicle performance</li>
                                    </ul>
                                </div>
                                
                                <div style="background: #e5f3ff; padding: 20px; border-radius: 10px; margin: 20px 0;">
                                    <h3 style="color: #1f2937; margin-bottom: 15px;">✅ Benefits of Regular Maintenance:</h3>
                                    <ul style="color: #4b5563; line-height: 1.8;">
                                        <li>Reduces failure risk by 80%</li>
                                        <li>Extends dynamo life</li>
                                        <li>Provides fuel savings</li>
                                        <li>Guarantees safe driving</li>
                                    </ul>
                                </div>
                                
                                <div style="text-align: center; margin: 30px 0;">
                                    <a href="https://wa.me/9055353562469?text=I%20want%20information%20about%20dynamo%20maintenance" 
                                       style="background: #25d366; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px;">
                                        🔧 Get Maintenance Now
                                    </a>
                                </div>
                            </div>
                        </div>
                    `
                }
            },
            
            newsletter: {
                subject: {
                    tr: 'DC TEKNİK Bülteni - Ocak 2025 📰',
                    en: 'DC TEKNİK Newsletter - January 2025 📰'
                },
                content: {
                    tr: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                            <div style="background: linear-gradient(135deg, #0b5cff, #3b82f6); color: white; padding: 30px; text-align: center;">
                                <h1 style="margin: 0; font-size: 28px;">DC TEKNİK</h1>
                                <p style="margin: 10px 0 0 0; font-size: 16px;">Ocak 2025 Bülteni</p>
                            </div>
                            
                            <div style="padding: 30px; background: #f8f9fa;">
                                <h2 style="color: #1f2937; margin-bottom: 20px;">📰 Bu Ay Neler Oldu?</h2>
                                
                                <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
                                    <h3 style="color: #1f2937; margin-bottom: 15px;">🎉 Yeni Hizmetler</h3>
                                    <p style="color: #4b5563; line-height: 1.6;">
                                        Bu ay yeni hizmetlerimizi duyuruyoruz! Artık daha hızlı ve 
                                        kaliteli hizmet alabilirsiniz.
                                    </p>
                                </div>
                                
                                <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
                                    <h3 style="color: #1f2937; margin-bottom: 15px;">💡 Uzman Tavsiyeleri</h3>
                                    <p style="color: #4b5563; line-height: 1.6;">
                                        Kış aylarında araç bakımı nasıl yapılır? Uzman tavsiyelerimizi 
                                        blog sayfamızdan okuyabilirsiniz.
                                    </p>
                                </div>
                                
                                <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
                                    <h3 style="color: #1f2937; margin-bottom: 15px;">🎁 Özel Teklifler</h3>
                                    <p style="color: #4b5563; line-height: 1.6;">
                                        Bu ay özel tekliflerimiz devam ediyor! Dinamo tamiri için 
                                        %20 indirim fırsatını kaçırmayın.
                                    </p>
                                </div>
                                
                                <div style="text-align: center; margin: 30px 0;">
                                    <a href="https://wa.me/9055353562469?text=Bülten%20hakkında%20daha%20fazla%20bilgi%20almak%20istiyorum" 
                                       style="background: #25d366; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px;">
                                        📞 Hemen İletişime Geç
                                    </a>
                                </div>
                            </div>
                        </div>
                    `,
                    en: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                            <div style="background: linear-gradient(135deg, #0b5cff, #3b82f6); color: white; padding: 30px; text-align: center;">
                                <h1 style="margin: 0; font-size: 28px;">DC TEKNİK</h1>
                                <p style="margin: 10px 0 0 0; font-size: 16px;">January 2025 Newsletter</p>
                            </div>
                            
                            <div style="padding: 30px; background: #f8f9fa;">
                                <h2 style="color: #1f2937; margin-bottom: 20px;">📰 What Happened This Month?</h2>
                                
                                <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
                                    <h3 style="color: #1f2937; margin-bottom: 15px;">🎉 New Services</h3>
                                    <p style="color: #4b5563; line-height: 1.6;">
                                        This month we announce our new services! Now you can get 
                                        faster and higher quality service.
                                    </p>
                                </div>
                                
                                <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
                                    <h3 style="color: #1f2937; margin-bottom: 15px;">💡 Expert Tips</h3>
                                    <p style="color: #4b5563; line-height: 1.6;">
                                        How to maintain your vehicle in winter months? You can read 
                                        our expert tips on our blog page.
                                    </p>
                                </div>
                                
                                <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
                                    <h3 style="color: #1f2937; margin-bottom: 15px;">🎁 Special Offers</h3>
                                    <p style="color: #4b5563; line-height: 1.6;">
                                        Our special offers continue this month! Don't miss the 
                                        20% discount opportunity for dynamo repair.
                                    </p>
                                </div>
                                
                                <div style="text-align: center; margin: 30px 0;">
                                    <a href="https://wa.me/9055353562469?text=I%20want%20more%20information%20about%20the%20newsletter" 
                                       style="background: #25d366; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px;">
                                        📞 Contact Now
                                    </a>
                                </div>
                            </div>
                        </div>
                    `
                }
            }
        };
        
        this.subscribers = [];
        this.campaigns = [];
        this.automationRules = [];
        
        this.init();
    }
    
    init() {
        this.loadSubscribers();
        this.setupEmailCapture();
        this.startAutomation();
    }
    
    setupEmailCapture() {
        // Newsletter signup forms
        document.addEventListener('submit', (e) => {
            if (e.target.classList.contains('newsletter-form')) {
                e.preventDefault();
                this.handleNewsletterSignup(e.target);
            }
        });
        
        // Email capture on form submissions
        document.addEventListener('submit', (e) => {
            if (e.target.classList.contains('contact-form')) {
                this.captureEmailFromForm(e.target);
            }
        });
    }
    
    handleNewsletterSignup(form) {
        const formData = new FormData(form);
        const email = formData.get('email');
        const name = formData.get('name') || '';
        
        if (email && this.isValidEmail(email)) {
            this.addSubscriber({
                email: email,
                name: name,
                source: 'newsletter_signup',
                timestamp: new Date().toISOString(),
                status: 'active'
            });
            
            // Send welcome email
            this.sendEmail('welcome', email, { name: name });
            
            // Show success message
            this.showSuccessMessage('E-posta bültenimize başarıyla abone oldunuz!');
            
            form.reset();
        } else {
            this.showErrorMessage('Lütfen geçerli bir e-posta adresi girin.');
        }
    }
    
    captureEmailFromForm(form) {
        const formData = new FormData(form);
        const email = formData.get('email');
        
        if (email && this.isValidEmail(email)) {
            this.addSubscriber({
                email: email,
                source: 'contact_form',
                timestamp: new Date().toISOString(),
                status: 'active'
            });
        }
    }
    
    addSubscriber(subscriberData) {
        // Check if subscriber already exists
        const existingIndex = this.subscribers.findIndex(sub => sub.email === subscriberData.email);
        
        if (existingIndex >= 0) {
            // Update existing subscriber
            this.subscribers[existingIndex] = { ...this.subscribers[existingIndex], ...subscriberData };
        } else {
            // Add new subscriber
            this.subscribers.push(subscriberData);
        }
        
        this.saveSubscribers();
        
        // Track subscription
        this.trackEvent('email_subscription', {
            email: subscriberData.email,
            source: subscriberData.source
        });
    }
    
    sendEmail(templateType, email, data = {}) {
        if (!this.config.automationEnabled) return;
        
        const template = this.emailTemplates[templateType];
        if (!template) return;
        
        const language = this.getUserLanguage();
        const subject = template.subject[language] || template.subject.tr;
        const content = template.content[language] || template.content.tr;
        
        // In a real implementation, this would send via email service
        console.log('Email would be sent:', {
            to: email,
            subject: subject,
            content: content,
            data: data
        });
        
        // Track email send
        this.trackEvent('email_sent', {
            template: templateType,
            email: email,
            subject: subject
        });
    }
    
    startAutomation() {
        // Send welcome emails to new subscribers
        this.processNewSubscribers();
        
        // Send service reminders
        this.processServiceReminders();
        
        // Send newsletters
        this.processNewsletters();
    }
    
    processNewSubscribers() {
        const newSubscribers = this.subscribers.filter(sub => 
            sub.status === 'active' && 
            !sub.welcomeEmailSent &&
            new Date(sub.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
        );
        
        newSubscribers.forEach(subscriber => {
            this.sendEmail('welcome', subscriber.email, { name: subscriber.name });
            subscriber.welcomeEmailSent = true;
        });
        
        if (newSubscribers.length > 0) {
            this.saveSubscribers();
        }
    }
    
    processServiceReminders() {
        // Send service reminders based on subscriber data
        const subscribersNeedingReminder = this.subscribers.filter(sub => 
            sub.status === 'active' && 
            sub.lastServiceDate && 
            this.shouldSendServiceReminder(sub.lastServiceDate)
        );
        
        subscribersNeedingReminder.forEach(subscriber => {
            this.sendEmail('serviceReminder', subscriber.email, { name: subscriber.name });
        });
    }
    
    processNewsletters() {
        // Send newsletters monthly
        const lastNewsletter = localStorage.getItem('last_newsletter_sent');
        const now = new Date();
        const lastSent = lastNewsletter ? new Date(lastNewsletter) : new Date(0);
        
        if (now.getTime() - lastSent.getTime() > 30 * 24 * 60 * 60 * 1000) { // 30 days
            this.sendNewsletter();
            localStorage.setItem('last_newsletter_sent', now.toISOString());
        }
    }
    
    sendNewsletter() {
        const activeSubscribers = this.subscribers.filter(sub => sub.status === 'active');
        
        activeSubscribers.forEach(subscriber => {
            this.sendEmail('newsletter', subscriber.email, { name: subscriber.name });
        });
        
        this.trackEvent('newsletter_sent', {
            subscriberCount: activeSubscribers.length
        });
    }
    
    shouldSendServiceReminder(lastServiceDate) {
        const lastService = new Date(lastServiceDate);
        const now = new Date();
        const daysSinceService = (now.getTime() - lastService.getTime()) / (1000 * 60 * 60 * 24);
        
        return daysSinceService >= 180; // 6 months
    }
    
    getUserLanguage() {
        const browserLang = navigator.language || navigator.userLanguage;
        if (browserLang.startsWith('en')) return 'en';
        if (browserLang.startsWith('tr')) return 'tr';
        return 'tr';
    }
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    trackEvent(eventName, eventData) {
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, {
                event_category: 'Email_Marketing',
                event_label: eventData.email || 'unknown',
                value: eventData.value || 0
            });
        }
    }
    
    showSuccessMessage(message) {
        // Create success notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed; top: 20px; right: 20px; z-index: 10000;
            background: #10b981; color: white; padding: 15px 20px;
            border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            font-weight: 500; max-width: 300px;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
    
    showErrorMessage(message) {
        // Create error notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed; top: 20px; right: 20px; z-index: 10000;
            background: #ef4444; color: white; padding: 15px 20px;
            border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            font-weight: 500; max-width: 300px;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
    
    loadSubscribers() {
        try {
            const stored = localStorage.getItem('dcteknik_subscribers');
            if (stored) {
                this.subscribers = JSON.parse(stored);
            }
        } catch (error) {
            console.log('Error loading subscribers:', error);
        }
    }
    
    saveSubscribers() {
        try {
            localStorage.setItem('dcteknik_subscribers', JSON.stringify(this.subscribers));
        } catch (error) {
            console.log('Error saving subscribers:', error);
        }
    }
    
    // Public methods
    getSubscriberStats() {
        return {
            totalSubscribers: this.subscribers.length,
            activeSubscribers: this.subscribers.filter(sub => sub.status === 'active').length,
            newThisMonth: this.subscribers.filter(sub => 
                new Date(sub.timestamp) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            ).length
        };
    }
    
    exportSubscribers() {
        return {
            subscribers: this.subscribers,
            exportDate: new Date().toISOString()
        };
    }
}

// Initialize Email Marketing
const emailMarketing = new EmailMarketing();

// Export for global access
window.emailMarketing = emailMarketing;

