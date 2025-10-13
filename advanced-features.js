// ========================================
// DC TEKNİK - Advanced Features
// Version: v1.0.0 - NEXT LEVEL
// ========================================

class AdvancedFeatures {
    constructor() {
        this.init();
    }

    init() {
        this.createAIChatbot();
        this.createPriceCalculator();
        this.createTestimonials();
        this.createFAQ();
        this.createLiveStatus();
        this.createInteractiveElements();
    }

    // AI Chatbot
    createAIChatbot() {
        const chatbotHTML = `
            <div class="ai-chatbot" id="aiChatbot">
                <div class="chatbot-header">
                    <div class="chatbot-title">
                        <div class="chatbot-avatar">
                            <i class="fas fa-robot"></i>
                        </div>
                        <span>DC TEKNİK Asistanı</span>
                    </div>
                    <button class="chatbot-close" onclick="advancedFeatures.closeChatbot()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="chatbot-messages" id="chatbotMessages">
                    <div class="chatbot-message bot">
                        <div class="chatbot-message-avatar">
                            <i class="fas fa-robot"></i>
                        </div>
                        <div class="chatbot-message-content">
                            Merhaba! DC TEKNİK'e hoş geldiniz! 🤖<br>
                            Size nasıl yardımcı olabilirim? Dinamo, alternatör veya marş motoru konularında sorularınızı yanıtlayabilirim.
                        </div>
                    </div>
                </div>
                <div class="chatbot-input">
                    <input type="text" id="chatbotInput" placeholder="Mesajınızı yazın...">
                    <button class="chatbot-send" onclick="advancedFeatures.sendMessage()">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>
            <button class="chatbot-toggle" id="chatbotToggle" onclick="advancedFeatures.toggleChatbot()">
                <i class="fas fa-comments"></i>
            </button>
        `;

        document.body.insertAdjacentHTML('beforeend', chatbotHTML);

        // Enter key support
        document.getElementById('chatbotInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
    }

    toggleChatbot() {
        const chatbot = document.getElementById('aiChatbot');
        const toggle = document.getElementById('chatbotToggle');
        
        chatbot.classList.toggle('active');
        toggle.classList.toggle('active');
        
        if (chatbot.classList.contains('active')) {
            document.getElementById('chatbotInput').focus();
        }
    }

    closeChatbot() {
        const chatbot = document.getElementById('aiChatbot');
        const toggle = document.getElementById('chatbotToggle');
        
        chatbot.classList.remove('active');
        toggle.classList.remove('active');
    }

    sendMessage() {
        const input = document.getElementById('chatbotInput');
        const message = input.value.trim();
        
        if (!message) return;

        // Add user message
        this.addMessage(message, 'user');
        input.value = '';

        // Simulate bot response
        setTimeout(() => {
            const response = this.getBotResponse(message);
            this.addMessage(response, 'bot');
        }, 1000);
    }

    addMessage(text, sender) {
        const messagesContainer = document.getElementById('chatbotMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `chatbot-message ${sender}`;
        
        const avatar = document.createElement('div');
        avatar.className = 'chatbot-message-avatar';
        avatar.innerHTML = sender === 'bot' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';
        
        const content = document.createElement('div');
        content.className = 'chatbot-message-content';
        content.textContent = text;
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);
        messagesContainer.appendChild(messageDiv);
        
        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    getBotResponse(message) {
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

    // Price Calculator
    createPriceCalculator() {
        const calculatorHTML = `
            <div class="price-calculator">
                <h3 class="calculator-title">Fiyat Hesaplayıcı</h3>
                <form class="calculator-form" id="priceCalculatorForm">
                    <div class="calculator-group">
                        <label class="calculator-label">Araç Markası</label>
                        <select class="calculator-select" name="brand" required>
                            <option value="">Marka Seçin</option>
                            <option value="toyota">Toyota</option>
                            <option value="volkswagen">Volkswagen</option>
                            <option value="ford">Ford</option>
                            <option value="renault">Renault</option>
                            <option value="opel">Opel</option>
                            <option value="fiat">Fiat</option>
                            <option value="hyundai">Hyundai</option>
                            <option value="kia">Kia</option>
                            <option value="bmw">BMW</option>
                            <option value="mercedes">Mercedes</option>
                            <option value="audi">Audi</option>
                        </select>
                    </div>
                    <div class="calculator-group">
                        <label class="calculator-label">Hizmet Türü</label>
                        <select class="calculator-select" name="service" required>
                            <option value="">Hizmet Seçin</option>
                            <option value="dinamo">Dinamo Tamiri</option>
                            <option value="alternator">Alternatör Servisi</option>
                            <option value="starter">Marş Motoru</option>
                            <option value="electrical">Elektrik Sistemi</option>
                        </select>
                    </div>
                    <div class="calculator-group">
                        <label class="calculator-label">Araç Yılı</label>
                        <select class="calculator-select" name="year" required>
                            <option value="">Yıl Seçin</option>
                            <option value="2020+">2020 ve üzeri</option>
                            <option value="2015-2019">2015-2019</option>
                            <option value="2010-2014">2010-2014</option>
                            <option value="2005-2009">2005-2009</option>
                            <option value="2000-2004">2000-2004</option>
                        </select>
                    </div>
                    <div class="calculator-group">
                        <label class="calculator-label">Problem Durumu</label>
                        <select class="calculator-select" name="problem" required>
                            <option value="">Durum Seçin</option>
                            <option value="minor">Hafif Arıza</option>
                            <option value="medium">Orta Arıza</option>
                            <option value="major">Ciddi Arıza</option>
                            <option value="replacement">Değişim Gerekli</option>
                        </select>
                    </div>
                    <button type="submit" class="clean-btn clean-btn-primary" style="grid-column: 1 / -1; margin-top: 1rem;">
                        <i class="fas fa-calculator"></i>
                        Fiyat Hesapla
                    </button>
                </form>
                <div class="calculator-result" id="calculatorResult">
                    <div class="calculator-price" id="calculatedPrice">0 TL</div>
                    <p class="calculator-note" id="calculatorNote">Tahmini fiyat. Kesin fiyat için randevu alın.</p>
                </div>
            </div>
        `;

        // Insert after services section
        const servicesSection = document.querySelector('.clean-services-preview');
        if (servicesSection) {
            servicesSection.insertAdjacentHTML('afterend', calculatorHTML);
        }

        // Add form handler
        document.getElementById('priceCalculatorForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.calculatePrice();
        });
    }

    calculatePrice() {
        const form = document.getElementById('priceCalculatorForm');
        const formData = new FormData(form);
        
        const brand = formData.get('brand');
        const service = formData.get('service');
        const year = formData.get('year');
        const problem = formData.get('problem');

        if (!brand || !service || !year || !problem) {
            alert('Lütfen tüm alanları doldurun.');
            return;
        }

        // Base prices
        const basePrices = {
            dinamo: 800,
            alternator: 1200,
            starter: 1000,
            electrical: 600
        };

        // Brand multipliers
        const brandMultipliers = {
            toyota: 1.0,
            volkswagen: 1.1,
            ford: 1.0,
            renault: 0.9,
            opel: 0.9,
            fiat: 0.8,
            hyundai: 0.9,
            kia: 0.9,
            bmw: 1.3,
            mercedes: 1.4,
            audi: 1.3
        };

        // Year multipliers
        const yearMultipliers = {
            '2020+': 1.3,
            '2015-2019': 1.1,
            '2010-2014': 1.0,
            '2005-2009': 0.9,
            '2000-2004': 0.8
        };

        // Problem multipliers
        const problemMultipliers = {
            minor: 0.7,
            medium: 1.0,
            major: 1.5,
            replacement: 2.0
        };

        let price = basePrices[service];
        price *= brandMultipliers[brand];
        price *= yearMultipliers[year];
        price *= problemMultipliers[problem];

        // Round to nearest 50
        price = Math.round(price / 50) * 50;

        // Show result
        const result = document.getElementById('calculatorResult');
        const priceElement = document.getElementById('calculatedPrice');
        const noteElement = document.getElementById('calculatorNote');

        priceElement.textContent = price.toLocaleString('tr-TR') + ' TL';
        noteElement.textContent = `${brand.toUpperCase()} ${service} için tahmini fiyat. Kesin fiyat için randevu alın.`;

        result.classList.add('show');
        result.scrollIntoView({ behavior: 'smooth' });

        // Track calculation
        this.trackEvent('price_calculated', {
            brand: brand,
            service: service,
            year: year,
            problem: problem,
            price: price
        });
    }

    // Testimonials
    createTestimonials() {
        const testimonialsHTML = `
            <section class="testimonials-section">
                <div class="testimonials-container">
                    <h2 class="testimonials-title">Müşteri Yorumları</h2>
                    <p class="testimonials-subtitle">Müşterilerimizin bizim hakkımızda söyledikleri</p>
                    
                    <div class="testimonials-slider">
                        <div class="testimonials-track" id="testimonialsTrack">
                            <div class="testimonial-card">
                                <div class="testimonial-rating">
                                    <i class="fas fa-star testimonial-star"></i>
                                    <i class="fas fa-star testimonial-star"></i>
                                    <i class="fas fa-star testimonial-star"></i>
                                    <i class="fas fa-star testimonial-star"></i>
                                    <i class="fas fa-star testimonial-star"></i>
                                </div>
                                <p class="testimonial-quote">
                                    "Dinamo arızası için geldim, çok profesyonel hizmet aldım. Fiyat uygun, işçilik kaliteli. Kesinlikle tavsiye ederim."
                                </p>
                                <div class="testimonial-author">
                                    <div class="testimonial-avatar">AY</div>
                                    <div class="testimonial-info">
                                        <h4>Ahmet Yılmaz</h4>
                                        <p>Toyota Corolla Sahibi</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="testimonial-card">
                                <div class="testimonial-rating">
                                    <i class="fas fa-star testimonial-star"></i>
                                    <i class="fas fa-star testimonial-star"></i>
                                    <i class="fas fa-star testimonial-star"></i>
                                    <i class="fas fa-star testimonial-star"></i>
                                    <i class="fas fa-star testimonial-star"></i>
                                </div>
                                <p class="testimonial-quote">
                                    "Alternatör tamiri için geldim. Hızlı ve güvenilir hizmet. 7/24 acil servisleri de çok iyi. Teşekkürler DC TEKNİK!"
                                </p>
                                <div class="testimonial-author">
                                    <div class="testimonial-avatar">FD</div>
                                    <div class="testimonial-info">
                                        <h4>Fatma Demir</h4>
                                        <p>Volkswagen Golf Sahibi</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="testimonial-card">
                                <div class="testimonial-rating">
                                    <i class="fas fa-star testimonial-star"></i>
                                    <i class="fas fa-star testimonial-star"></i>
                                    <i class="fas fa-star testimonial-star"></i>
                                    <i class="fas fa-star testimonial-star"></i>
                                    <i class="fas fa-star testimonial-star"></i>
                                </div>
                                <p class="testimonial-quote">
                                    "Marş motoru problemi vardı. Çok kısa sürede çözdüler. Fiyat da çok uygun. Artık hep buraya geliyorum."
                                </p>
                                <div class="testimonial-author">
                                    <div class="testimonial-avatar">MK</div>
                                    <div class="testimonial-info">
                                        <h4>Mehmet Kaya</h4>
                                        <p>Ford Focus Sahibi</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="testimonials-nav">
                        <div class="testimonial-dot active" onclick="advancedFeatures.goToSlide(0)"></div>
                        <div class="testimonial-dot" onclick="advancedFeatures.goToSlide(1)"></div>
                        <div class="testimonial-dot" onclick="advancedFeatures.goToSlide(2)"></div>
                    </div>
                </div>
            </section>
        `;

        // Insert after price calculator
        const calculator = document.querySelector('.price-calculator');
        if (calculator) {
            calculator.insertAdjacentHTML('afterend', testimonialsHTML);
        }

        // Auto-rotate testimonials
        this.currentSlide = 0;
        setInterval(() => {
            this.currentSlide = (this.currentSlide + 1) % 3;
            this.goToSlide(this.currentSlide);
        }, 5000);
    }

    goToSlide(index) {
        const track = document.getElementById('testimonialsTrack');
        const dots = document.querySelectorAll('.testimonial-dot');
        
        track.style.transform = `translateX(-${index * 100}%)`;
        
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        
        this.currentSlide = index;
    }

    // FAQ Section
    createFAQ() {
        const faqHTML = `
            <section class="faq-section">
                <div class="faq-container">
                    <h2 class="faq-title">Sık Sorulan Sorular</h2>
                    <p class="faq-subtitle">Merak ettiğiniz soruların yanıtları</p>
                    
                    <div class="faq-item">
                        <div class="faq-question" onclick="advancedFeatures.toggleFAQ(this)">
                            <span>Dinamo tamiri ne kadar sürer?</span>
                            <div class="faq-icon">+</div>
                        </div>
                        <div class="faq-answer">
                            <p>Dinamo tamiri genellikle 2-4 saat arasında tamamlanır. Arızanın boyutuna göre bu süre değişebilir. Acil durumlar için 7/24 hizmet veriyoruz.</p>
                        </div>
                    </div>
                    
                    <div class="faq-item">
                        <div class="faq-question" onclick="advancedFeatures.toggleFAQ(this)">
                            <span>Garanti süresi ne kadar?</span>
                            <div class="faq-icon">+</div>
                        </div>
                        <div class="faq-answer">
                            <p>Tüm tamir işlemlerimiz için 1 yıl garanti veriyoruz. Yedek parça değişimlerinde ise garanti süresi 2 yıldır.</p>
                        </div>
                    </div>
                    
                    <div class="faq-item">
                        <div class="faq-question" onclick="advancedFeatures.toggleFAQ(this)">
                            <span>Hangi marka araçlara hizmet veriyorsunuz?</span>
                            <div class="faq-icon">+</div>
                        </div>
                        <div class="faq-answer">
                            <p>Tüm marka araçlara hizmet veriyoruz. Toyota, Volkswagen, Ford, Renault, Opel, Fiat, Hyundai, Kia, BMW, Mercedes, Audi ve diğer tüm markalar.</p>
                        </div>
                    </div>
                    
                    <div class="faq-item">
                        <div class="faq-question" onclick="advancedFeatures.toggleFAQ(this)">
                            <span>Randevu almam gerekiyor mu?</span>
                            <div class="faq-icon">+</div>
                        </div>
                        <div class="faq-answer">
                            <p>Randevu almanızı öneriyoruz ancak zorunlu değil. Acil durumlar için 7/24 hizmet veriyoruz. Randevu almak için WhatsApp veya telefon ile iletişime geçebilirsiniz.</p>
                        </div>
                    </div>
                    
                    <div class="faq-item">
                        <div class="faq-question" onclick="advancedFeatures.toggleFAQ(this)">
                            <span>Ödeme yöntemleri nelerdir?</span>
                            <div class="faq-icon">+</div>
                        </div>
                        <div class="faq-answer">
                            <p>Nakit, kredi kartı, banka kartı ve havale ile ödeme kabul ediyoruz. Taksit imkanı da mevcuttur.</p>
                        </div>
                    </div>
                </div>
            </section>
        `;

        // Insert after testimonials
        const testimonials = document.querySelector('.testimonials-section');
        if (testimonials) {
            testimonials.insertAdjacentHTML('afterend', faqHTML);
        }
    }

    toggleFAQ(element) {
        const faqItem = element.parentElement;
        const isActive = faqItem.classList.contains('active');
        
        // Close all FAQ items
        document.querySelectorAll('.faq-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Toggle current item
        if (!isActive) {
            faqItem.classList.add('active');
        }
    }

    // Live Status
    createLiveStatus() {
        const statusHTML = `
            <div class="live-status">
                <div class="live-dot"></div>
                <span>Canlı Destek</span>
            </div>
        `;

        document.body.insertAdjacentHTML('afterbegin', statusHTML);
    }

    // Interactive Elements
    createInteractiveElements() {
        // Add hover effects to service cards
        const serviceCards = document.querySelectorAll('.clean-service-card');
        serviceCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-15px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
        });

        // Add click tracking
        const buttons = document.querySelectorAll('.clean-btn');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                const buttonText = button.textContent.trim();
                this.trackEvent('button_click', {
                    button_text: buttonText,
                    button_type: button.className
                });
            });
        });
    }

    // Analytics tracking
    trackEvent(eventName, parameters = {}) {
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, {
                event_category: 'advanced_features',
                ...parameters
            });
        }
        console.log(`📊 Event tracked: ${eventName}`, parameters);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.advancedFeatures = new AdvancedFeatures();
    
    // Add CSS for advanced features
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'advanced-features.css?v=20250115v1';
    document.head.appendChild(link);
    
    console.log('🚀 Advanced Features initialized successfully!');
});

// Export for potential external use
window.AdvancedFeatures = AdvancedFeatures;
