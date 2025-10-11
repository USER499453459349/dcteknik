// Automotive Content Strategy for DC TEKNİK
// Industry-focused content optimization

class AutomotiveContentStrategy {
    constructor() {
        this.contentTypes = {
            services: [
                {
                    title: 'Dinamo Tamiri ve Onarımı',
                    keywords: ['dinamo tamiri', 'dinamo onarımı', 'dinamo arızası'],
                    content: 'Profesyonel dinamo tamiri hizmeti. Tüm marka araçlar için dinamo arıza tespiti ve onarımı.',
                    faq: [
                        'Dinamo arızası nasıl anlaşılır?',
                        'Dinamo tamiri ne kadar sürer?',
                        'Dinamo değişimi fiyatı nedir?'
                    ]
                },
                {
                    title: 'Alternatör Servisi',
                    keywords: ['alternatör tamiri', 'alternatör onarımı', 'alternatör arızası'],
                    content: 'Alternatör arıza tespiti ve tamiri. Uzman ekibimizle kaliteli alternatör servisi.',
                    faq: [
                        'Alternatör arızası belirtileri nelerdir?',
                        'Alternatör tamiri fiyatı nedir?',
                        'Alternatör ne kadar dayanır?'
                    ]
                },
                {
                    title: 'Marş Motoru Tamiri',
                    keywords: ['marş motoru tamiri', 'marş motoru onarımı', 'marş motoru arızası'],
                    content: 'Marş motoru arıza tespiti ve tamiri. Hızlı ve güvenilir marş motoru servisi.',
                    faq: [
                        'Marş motoru çalışmıyor ne yapmalı?',
                        'Marş motoru tamiri fiyatı nedir?',
                        'Marş motoru bakımı nasıl yapılır?'
                    ]
                }
            ],
            locations: [
                {
                    area: 'Sultanbeyli',
                    keywords: ['sultanbeyli dinamocu', 'sultanbeyli otomotiv', 'sultanbeyli araç tamiri'],
                    content: 'Sultanbeyli bölgesinde dinamocu servisi. Atatürk Caddesi merkez lokasyonumuz.',
                    services: ['Dinamo Tamiri', 'Alternatör Servisi', 'Marş Motoru Tamiri']
                },
                {
                    area: 'İstanbul',
                    keywords: ['istanbul dinamocu', 'istanbul otomotiv', 'istanbul araç tamiri'],
                    content: 'İstanbul genelinde dinamocu servisi. Tüm ilçelerden müşterilerimize hizmet.',
                    services: ['Mobil Servis', 'Acil Müdahale', '7/24 Hizmet']
                }
            ],
            brands: [
                'Volkswagen', 'BMW', 'Mercedes', 'Audi', 'Ford', 'Opel', 'Renault', 'Peugeot',
                'Fiat', 'Toyota', 'Honda', 'Hyundai', 'Kia', 'Nissan', 'Mazda', 'Skoda'
            ]
        };
        
        this.init();
    }

    init() {
        this.createServicePages();
        this.addLocationContent();
        this.createBrandContent();
        this.addFAQSection();
        this.optimizeExistingContent();
        
        console.log('🚗 Automotive Content Strategy initialized');
    }

    createServicePages() {
        // Create dynamic service content
        const servicesSection = document.querySelector('#services');
        if (servicesSection) {
            this.contentTypes.services.forEach(service => {
                const serviceCard = this.createServiceCard(service);
                servicesSection.appendChild(serviceCard);
            });
        }
    }

    createServiceCard(service) {
        const card = document.createElement('div');
        card.className = 'service-card automotive-service';
        card.innerHTML = `
            <div class="service-icon">
                <i class="fas fa-cog"></i>
            </div>
            <h3>${service.title}</h3>
            <p>${service.content}</p>
            <div class="service-keywords">
                ${service.keywords.map(keyword => `<span class="keyword-tag">${keyword}</span>`).join('')}
            </div>
            <div class="service-faq">
                <h4>Sık Sorulan Sorular:</h4>
                <ul>
                    ${service.faq.map(question => `<li>${question}</li>`).join('')}
                </ul>
            </div>
            <a href="#contact" class="btn btn-primary">Hizmet Al</a>
        `;
        return card;
    }

    addLocationContent() {
        // Add location-specific content
        const locationSection = document.createElement('section');
        locationSection.className = 'location-content';
        locationSection.id = 'locations';
        locationSection.innerHTML = `
            <div class="container">
                <div class="section-header">
                    <h2>Hizmet Verdiğimiz Bölgeler</h2>
                    <p>İstanbul genelinde profesyonel dinamocu servisi</p>
                </div>
                <div class="location-grid">
                    ${this.contentTypes.locations.map(location => `
                        <div class="location-card">
                            <h3>${location.area}</h3>
                            <p>${location.content}</p>
                            <div class="location-keywords">
                                ${location.keywords.map(keyword => `<span class="keyword-tag">${keyword}</span>`).join('')}
                            </div>
                            <div class="location-services">
                                <h4>Hizmetlerimiz:</h4>
                                <ul>
                                    ${location.services.map(service => `<li>${service}</li>`).join('')}
                                </ul>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        // Insert before footer
        const footer = document.querySelector('footer');
        if (footer) {
            footer.parentNode.insertBefore(locationSection, footer);
        }
    }

    createBrandContent() {
        // Add brand-specific content
        const brandSection = document.createElement('section');
        brandSection.className = 'brand-content';
        brandSection.id = 'brands';
        brandSection.innerHTML = `
            <div class="container">
                <div class="section-header">
                    <h2>Hizmet Verdiğimiz Markalar</h2>
                    <p>Tüm marka araçlar için profesyonel dinamocu servisi</p>
                </div>
                <div class="brand-grid">
                    ${this.contentTypes.brands.map(brand => `
                        <div class="brand-card">
                            <h4>${brand}</h4>
                            <p>${brand} marka araçlar için özel dinamocu servisi</p>
                            <span class="brand-keyword">${brand.toLowerCase()} dinamo tamiri</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        // Insert before footer
        const footer = document.querySelector('footer');
        if (footer) {
            footer.parentNode.insertBefore(brandSection, footer);
        }
    }

    addFAQSection() {
        // Create comprehensive FAQ section
        const faqSection = document.createElement('section');
        faqSection.className = 'faq-section';
        faqSection.id = 'faq';
        faqSection.innerHTML = `
            <div class="container">
                <div class="section-header">
                    <h2>Sık Sorulan Sorular</h2>
                    <p>Dinamocu servisi hakkında merak edilenler</p>
                </div>
                <div class="faq-grid">
                    <div class="faq-category">
                        <h3>Dinamo Tamiri</h3>
                        <div class="faq-items">
                            <div class="faq-item">
                                <h4>Dinamo arızası nasıl anlaşılır?</h4>
                                <p>Dinamo arızası genellikle akü şarj uyarısı, farların sönmesi ve motor çalışmaması ile kendini gösterir.</p>
                            </div>
                            <div class="faq-item">
                                <h4>Dinamo tamiri ne kadar sürer?</h4>
                                <p>Dinamo tamiri genellikle 2-4 saat arasında tamamlanır. Arızanın boyutuna göre süre değişebilir.</p>
                            </div>
                        </div>
                    </div>
                    <div class="faq-category">
                        <h3>Alternatör Servisi</h3>
                        <div class="faq-items">
                            <div class="faq-item">
                                <h4>Alternatör arızası belirtileri nelerdir?</h4>
                                <p>Alternatör arızası akü uyarısı, farların titremesi ve elektrikli aksamlarda sorunlarla kendini gösterir.</p>
                            </div>
                            <div class="faq-item">
                                <h4>Alternatör tamiri fiyatı nedir?</h4>
                                <p>Alternatör tamiri fiyatı arızanın boyutuna ve araç markasına göre değişir. Detaylı fiyat için iletişime geçin.</p>
                            </div>
                        </div>
                    </div>
                    <div class="faq-category">
                        <h3>Marş Motoru Tamiri</h3>
                        <div class="faq-items">
                            <div class="faq-item">
                                <h4>Marş motoru çalışmıyor ne yapmalı?</h4>
                                <p>Marş motoru çalışmıyorsa önce akü kontrolü yapın. Sorun devam ederse profesyonel servise başvurun.</p>
                            </div>
                            <div class="faq-item">
                                <h4>Marş motoru bakımı nasıl yapılır?</h4>
                                <p>Marş motoru bakımı düzenli temizlik, kontak temizliği ve elektrik bağlantılarının kontrolünü içerir.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Insert before footer
        const footer = document.querySelector('footer');
        if (footer) {
            footer.parentNode.insertBefore(faqSection, footer);
        }
    }

    optimizeExistingContent() {
        // Optimize existing content with automotive keywords
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        headings.forEach(heading => {
            const text = heading.textContent;
            if (text.includes('Dinamocu') || text.includes('Alternatör') || text.includes('Marş')) {
                heading.setAttribute('data-automotive-optimized', 'true');
            }
        });

        // Add automotive keywords to existing paragraphs
        const paragraphs = document.querySelectorAll('p');
        paragraphs.forEach(p => {
            if (p.textContent.includes('servis') || p.textContent.includes('tamir')) {
                p.setAttribute('data-automotive-content', 'true');
            }
        });
    }

    // Public methods
    getContentTypes() {
        return this.contentTypes;
    }

    addNewService(service) {
        this.contentTypes.services.push(service);
        this.createServicePages();
    }

    addNewLocation(location) {
        this.contentTypes.locations.push(location);
        this.addLocationContent();
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.automotiveContent = new AutomotiveContentStrategy();
});

// Export for use
window.AutomotiveContentStrategy = AutomotiveContentStrategy;
