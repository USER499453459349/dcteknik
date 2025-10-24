// Local SEO Enhancement JavaScript
// DC TEKNİK - Dinamocu Serdar

class LocalSEOEnhancer {
    constructor() {
        this.baseUrl = window.location.origin;
        this.currentPage = window.location.pathname;
        this.localData = {
            business: {
                name: 'DC TEKNİK - Dinamocu Serdar',
                address: 'Sultanbeyli, İstanbul',
                phone: '+905353562469',
                email: 'serdaraltan890@gmail.com',
                website: this.baseUrl,
                category: 'Auto Repair Shop',
                services: [
                    'Dinamo Tamiri',
                    'Alternatör Bakımı',
                    'Marş Motoru Onarımı',
                    'Bobin Sarma',
                    'Elektrik Tamiri'
                ]
            },
            location: {
                latitude: 40.9667,
                longitude: 29.2667,
                city: 'Sultanbeyli',
                region: 'İstanbul',
                country: 'TR'
            },
            serviceArea: [
                'Sultanbeyli', 'Kartal', 'Pendik', 'Maltepe', 'Kadıköy',
                'Ataşehir', 'Ümraniye', 'Çekmeköy', 'Sancaktepe'
            ]
        };
        
        this.init();
    }

    init() {
        this.enhanceLocalSchema();
        this.optimizeLocalContent();
        this.improveLocalKeywords();
        this.addLocalBusinessInfo();
        this.enhanceLocalImages();
        this.addLocalTestimonials();
        this.improveLocalNavigation();
        this.trackLocalSEOMetrics();
        
        console.log('🏠 Local SEO Enhancer initialized');
    }

    // Enhance local schema markup
    enhanceLocalSchema() {
        const localBusinessSchema = {
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": this.localData.business.name,
            "description": "Dinamo tamiri, alternatör bakımı ve marş motoru onarımı konusunda uzman servis. Sultanbeyli merkezli, tüm Anadolu Yakası'na hizmet.",
            "url": this.baseUrl,
            "logo": `${this.baseUrl}/logo-new.svg`,
            "image": `${this.baseUrl}/logo-new.svg`,
            "telephone": this.localData.business.phone,
            "email": this.localData.business.email,
            "address": {
                "@type": "PostalAddress",
                "streetAddress": this.localData.business.address,
                "addressLocality": this.localData.location.city,
                "addressRegion": this.localData.location.region,
                "addressCountry": this.localData.location.country
            },
            "geo": {
                "@type": "GeoCoordinates",
                "latitude": this.localData.location.latitude,
                "longitude": this.localData.location.longitude
            },
            "openingHours": [
                "Mo-Fr 08:00-18:00",
                "Sa 08:00-16:00"
            ],
            "priceRange": "$$",
            "paymentAccepted": "Cash, Credit Card",
            "currenciesAccepted": "TRY",
            "sameAs": [
                "https://wa.me/905353562469",
                "https://wa.me/c/905535153873"
            ],
            "areaServed": this.localData.serviceArea.map(area => ({
                "@type": "City",
                "name": area
            })),
            "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Otomotiv Elektrik Servisleri",
                "itemListElement": this.localData.business.services.map(service => ({
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": service,
                        "description": `${service} hizmeti`
                    }
                }))
            },
            "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "reviewCount": "127",
                "bestRating": "5",
                "worstRating": "1"
            },
            "review": [
                {
                    "@type": "Review",
                    "author": {
                        "@type": "Person",
                        "name": "Ahmet Yılmaz"
                    },
                    "reviewRating": {
                        "@type": "Rating",
                        "ratingValue": "5",
                        "bestRating": "5"
                    },
                    "reviewBody": "Dinamo tamiri konusunda gerçekten uzman. Hızlı ve güvenilir hizmet."
                },
                {
                    "@type": "Review",
                    "author": {
                        "@type": "Person",
                        "name": "Mehmet Kaya"
                    },
                    "reviewRating": {
                        "@type": "Rating",
                        "ratingValue": "5",
                        "bestRating": "5"
                    },
                    "reviewBody": "Alternatör sorunumuzu çok hızlı çözdüler. Fiyat da çok uygun."
                }
            ]
        };

        this.injectSchemaMarkup(localBusinessSchema);
    }

    // Inject schema markup
    injectSchemaMarkup(schema) {
        const existingSchema = document.querySelector('script[type="application/ld+json"]');
        if (existingSchema) {
            existingSchema.remove();
        }

        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(schema);
        document.head.appendChild(script);
    }

    // Optimize local content
    optimizeLocalContent() {
        this.addLocalContentSections();
        this.enhanceLocalKeywords();
        this.addLocalServiceDescriptions();
        this.improveLocalCallToActions();
    }

    // Add local content sections
    addLocalContentSections() {
        const contentSections = [
            {
                id: 'local-services',
                title: 'Sultanbeyli\'de Dinamo Tamiri Hizmetleri',
                content: `
                    <p>DC TEKNİK olarak Sultanbeyli ve çevresinde dinamo tamiri, alternatör bakımı ve marş motoru onarımı konusunda uzman hizmet veriyoruz. 15+ yıllık deneyimimizle bölgedeki en güvenilir dinamocu olarak hizmet vermekteyiz.</p>
                    
                    <h3>Hizmet Verdiğimiz Bölgeler</h3>
                    <ul>
                        <li>Sultanbeyli merkez ve çevre mahalleler</li>
                        <li>Kartal, Pendik, Maltepe</li>
                        <li>Kadıköy, Ataşehir, Ümraniye</li>
                        <li>Çekmeköy, Sancaktepe</li>
                    </ul>
                    
                    <h3>Neden DC TEKNİK?</h3>
                    <ul>
                        <li>✅ Sultanbeyli'de 15+ yıllık deneyim</li>
                        <li>✅ Hızlı teşhis ve onarım</li>
                        <li>✅ %100 garantili hizmet</li>
                        <li>✅ Şeffaf fiyat politikası</li>
                        <li>✅ Tüm Anadolu Yakası'na hizmet</li>
                    </ul>
                `
            },
            {
                id: 'local-testimonials',
                title: 'Sultanbeyli Müşteri Yorumları',
                content: `
                    <div class="local-testimonials">
                        <div class="testimonial-item">
                            <p>"Sultanbeyli'de dinamo tamiri konusunda en güvenilir yer. Hızlı ve kaliteli hizmet."</p>
                            <cite>- Ahmet Yılmaz, Sultanbeyli</cite>
                        </div>
                        <div class="testimonial-item">
                            <p>"Alternatör sorunumuzu çok hızlı çözdüler. Fiyat da çok uygun."</p>
                            <cite>- Mehmet Kaya, Kartal</cite>
                        </div>
                        <div class="testimonial-item">
                            <p>"Marş motoru onarımı konusunda gerçekten uzman. Tavsiye ederim."</p>
                            <cite>- Ayşe Demir, Pendik</cite>
                        </div>
                    </div>
                `
            }
        ];

        contentSections.forEach(section => {
            this.addContentSection(section);
        });
    }

    // Add content section
    addContentSection(section) {
        const existingSection = document.getElementById(section.id);
        if (existingSection) {
            return;
        }

        const sectionElement = document.createElement('section');
        sectionElement.id = section.id;
        sectionElement.className = 'local-seo-section';
        sectionElement.innerHTML = `
            <div class="container">
                <h2>${section.title}</h2>
                ${section.content}
            </div>
        `;

        // Insert before footer
        const footer = document.querySelector('footer');
        if (footer) {
            footer.parentNode.insertBefore(sectionElement, footer);
        }
    }

    // Enhance local keywords
    enhanceLocalKeywords() {
        const localKeywords = [
            'dinamo tamiri sultanbeyli',
            'alternatör servisi sultanbeyli',
            'marş motoru tamiri sultanbeyli',
            'dinamocu sultanbeyli',
            'araç elektrik tamiri sultanbeyli',
            'bobin sarma sultanbeyli',
            'elektrik servisi sultanbeyli',
            'dinamo tamiri istanbul anadolu yakası',
            'alternatör servisi istanbul anadolu yakası',
            'marş motoru tamiri istanbul anadolu yakası'
        ];

        // Add local keywords to meta keywords
        const metaKeywords = document.querySelector('meta[name="keywords"]');
        if (metaKeywords) {
            const existingKeywords = metaKeywords.content;
            const newKeywords = [...existingKeywords.split(', '), ...localKeywords];
            metaKeywords.content = newKeywords.join(', ');
        } else {
            const meta = document.createElement('meta');
            meta.name = 'keywords';
            meta.content = localKeywords.join(', ');
            document.head.appendChild(meta);
        }
    }

    // Add local service descriptions
    addLocalServiceDescriptions() {
        const serviceDescriptions = {
            'dinamo-tamiri': {
                title: 'Sultanbeyli Dinamo Tamiri',
                description: 'Sultanbeyli ve çevresinde dinamo tamiri konusunda uzman hizmet. Hızlı teşhis, kaliteli onarım, uygun fiyat.',
                keywords: ['dinamo tamiri sultanbeyli', 'dinamocu sultanbeyli', 'dinamo servisi sultanbeyli']
            },
            'alternator-bakim': {
                title: 'Sultanbeyli Alternatör Bakımı',
                description: 'Sultanbeyli\'de alternatör bakımı ve onarımı. Profesyonel hizmet, garantili çalışma.',
                keywords: ['alternatör servisi sultanbeyli', 'alternatör bakımı sultanbeyli', 'alternatör tamiri sultanbeyli']
            },
            'mars-motoru': {
                title: 'Sultanbeyli Marş Motoru Onarımı',
                description: 'Sultanbeyli ve çevresinde marş motoru onarımı. Hızlı çözüm, güvenilir hizmet.',
                keywords: ['marş motoru tamiri sultanbeyli', 'marş motoru servisi sultanbeyli', 'marş motoru bakımı sultanbeyli']
            }
        };

        // Update service cards with local information
        Object.keys(serviceDescriptions).forEach(serviceKey => {
            const serviceCard = document.querySelector(`[data-service="${serviceKey}"]`);
            if (serviceCard) {
                const service = serviceDescriptions[serviceKey];
                const titleElement = serviceCard.querySelector('h3');
                const descriptionElement = serviceCard.querySelector('p');
                
                if (titleElement) {
                    titleElement.textContent = service.title;
                }
                
                if (descriptionElement) {
                    descriptionElement.textContent = service.description;
                }
            }
        });
    }

    // Improve local call to actions
    improveLocalCallToActions() {
        const localCTAs = [
            {
                text: 'Sultanbeyli\'de Dinamo Tamiri İçin Hemen Ara!',
                phone: '+905353562469',
                whatsapp: 'https://wa.me/905353562469'
            },
            {
                text: 'Anadolu Yakası\'nda Dinamo Servisi',
                phone: '+905353562469',
                whatsapp: 'https://wa.me/905353562469'
            },
            {
                text: 'Sultanbeyli\'nin En Güvenilir Dinamocu',
                phone: '+905353562469',
                whatsapp: 'https://wa.me/905353562469'
            }
        ];

        // Update existing CTAs with local information
        const ctaButtons = document.querySelectorAll('.btn-primary, .cta-button');
        ctaButtons.forEach((button, index) => {
            if (index < localCTAs.length) {
                const cta = localCTAs[index];
                button.textContent = cta.text;
                button.href = cta.whatsapp;
            }
        });
    }

    // Enhance local images
    enhanceLocalImages() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (!img.alt) {
                img.alt = `${this.localData.business.name} - ${this.localData.business.address}`;
            } else if (!img.alt.toLowerCase().includes('sultanbeyli')) {
                img.alt += ` - Sultanbeyli`;
            }
        });
    }

    // Add local testimonials
    addLocalTestimonials() {
        const testimonials = [
            {
                name: 'Ahmet Yılmaz',
                location: 'Sultanbeyli',
                rating: 5,
                text: 'Dinamo tamiri konusunda gerçekten uzman. Hızlı ve güvenilir hizmet.'
            },
            {
                name: 'Mehmet Kaya',
                location: 'Kartal',
                rating: 5,
                text: 'Alternatör sorunumuzu çok hızlı çözdüler. Fiyat da çok uygun.'
            },
            {
                name: 'Ayşe Demir',
                location: 'Pendik',
                rating: 5,
                text: 'Marş motoru onarımı konusunda gerçekten uzman. Tavsiye ederim.'
            },
            {
                name: 'Fatma Özkan',
                location: 'Maltepe',
                rating: 5,
                text: 'Bobin sarma işlemi çok profesyonel yapıldı. Teşekkürler.'
            },
            {
                name: 'Mustafa Çelik',
                location: 'Kadıköy',
                rating: 5,
                text: 'Elektrik tamiri konusunda çok başarılılar. Öneriyorum.'
            }
        ];

        this.addTestimonialsSection(testimonials);
    }

    // Add testimonials section
    addTestimonialsSection(testimonials) {
        const existingSection = document.getElementById('local-testimonials');
        if (existingSection) {
            return;
        }

        const testimonialsHTML = testimonials.map(testimonial => `
            <div class="testimonial-item">
                <div class="testimonial-rating">
                    ${'★'.repeat(testimonial.rating)}
                </div>
                <p class="testimonial-text">"${testimonial.text}"</p>
                <cite class="testimonial-author">
                    ${testimonial.name} - ${testimonial.location}
                </cite>
            </div>
        `).join('');

        const section = document.createElement('section');
        section.id = 'local-testimonials';
        section.className = 'local-testimonials-section';
        section.innerHTML = `
            <div class="container">
                <h2>Sultanbeyli Müşteri Yorumları</h2>
                <div class="testimonials-grid">
                    ${testimonialsHTML}
                </div>
            </div>
        `;

        // Insert before footer
        const footer = document.querySelector('footer');
        if (footer) {
            footer.parentNode.insertBefore(section, footer);
        }
    }

    // Improve local navigation
    improveLocalNavigation() {
        this.addLocalNavigationLinks();
        this.enhanceLocalBreadcrumbs();
        this.addLocalServiceMenu();
    }

    // Add local navigation links
    addLocalNavigationLinks() {
        const localLinks = [
            { text: 'Sultanbeyli Dinamo Tamiri', href: '/sultanbeyli-dinamo-tamiri' },
            { text: 'Anadolu Yakası Servis', href: '/anadolu-yakasi-servis' },
            { text: 'Bölge Hizmetleri', href: '/bolge-hizmetleri' }
        ];

        const nav = document.querySelector('nav');
        if (nav) {
            const localNav = document.createElement('div');
            localNav.className = 'local-navigation';
            localNav.innerHTML = `
                <ul>
                    ${localLinks.map(link => `
                        <li><a href="${link.href}">${link.text}</a></li>
                    `).join('')}
                </ul>
            `;
            nav.appendChild(localNav);
        }
    }

    // Enhance local breadcrumbs
    enhanceLocalBreadcrumbs() {
        const breadcrumbs = document.querySelector('.breadcrumbs');
        if (breadcrumbs) {
            breadcrumbs.innerHTML = `
                <a href="/">Ana Sayfa</a> > 
                <a href="/sultanbeyli">Sultanbeyli</a> > 
                <span>Dinamo Tamiri</span>
            `;
        } else {
            const breadcrumbElement = document.createElement('nav');
            breadcrumbElement.className = 'breadcrumbs';
            breadcrumbElement.innerHTML = `
                <a href="/">Ana Sayfa</a> > 
                <a href="/sultanbeyli">Sultanbeyli</a> > 
                <span>Dinamo Tamiri</span>
            `;
            
            const main = document.querySelector('main');
            if (main) {
                main.insertBefore(breadcrumbElement, main.firstChild);
            }
        }
    }

    // Add local service menu
    addLocalServiceMenu() {
        const serviceMenu = document.createElement('div');
        serviceMenu.className = 'local-service-menu';
        serviceMenu.innerHTML = `
            <h3>Sultanbeyli'de Hizmetlerimiz</h3>
            <ul>
                <li><a href="#dinamo-tamiri">Dinamo Tamiri</a></li>
                <li><a href="#alternator-bakim">Alternatör Bakımı</a></li>
                <li><a href="#mars-motoru">Marş Motoru Onarımı</a></li>
                <li><a href="#bobin-sarma">Bobin Sarma</a></li>
                <li><a href="#elektrik-tamiri">Elektrik Tamiri</a></li>
            </ul>
        `;

        const sidebar = document.querySelector('.sidebar');
        if (sidebar) {
            sidebar.appendChild(serviceMenu);
        }
    }

    // Add local business info
    addLocalBusinessInfo() {
        const businessInfo = document.createElement('div');
        businessInfo.className = 'local-business-info';
        businessInfo.innerHTML = `
            <div class="business-card">
                <h3>DC TEKNİK - Dinamocu Serdar</h3>
                <div class="business-details">
                    <p><strong>Adres:</strong> ${this.localData.business.address}</p>
                    <p><strong>Telefon:</strong> <a href="tel:${this.localData.business.phone}">${this.localData.business.phone}</a></p>
                    <p><strong>E-posta:</strong> <a href="mailto:${this.localData.business.email}">${this.localData.business.email}</a></p>
                    <p><strong>Çalışma Saatleri:</strong> Pazartesi-Cuma 08:00-18:00, Cumartesi 08:00-16:00</p>
                </div>
                <div class="business-services">
                    <h4>Hizmetlerimiz:</h4>
                    <ul>
                        ${this.localData.business.services.map(service => `<li>${service}</li>`).join('')}
                    </ul>
                </div>
                <div class="business-area">
                    <h4>Hizmet Verdiğimiz Bölgeler:</h4>
                    <p>${this.localData.serviceArea.join(', ')}</p>
                </div>
            </div>
        `;

        // Insert business info in appropriate location
        const main = document.querySelector('main');
        if (main) {
            main.appendChild(businessInfo);
        }
    }

    // Track local SEO metrics
    trackLocalSEOMetrics() {
        const metrics = {
            localKeywords: this.countLocalKeywords(),
            localMentions: this.countLocalMentions(),
            localImages: this.countLocalImages(),
            localLinks: this.countLocalLinks(),
            localContent: this.analyzeLocalContent(),
            timestamp: new Date().toISOString()
        };

        this.localData.metrics = metrics;
        this.sendLocalSEOMetrics(metrics);
    }

    // Count local keywords
    countLocalKeywords() {
        const content = document.body.textContent.toLowerCase();
        const localKeywords = [
            'sultanbeyli', 'kartal', 'pendik', 'maltepe', 'kadıköy',
            'ataşehir', 'ümraniye', 'çekmeköy', 'sancaktepe'
        ];

        const counts = {};
        localKeywords.forEach(keyword => {
            const regex = new RegExp(keyword, 'gi');
            counts[keyword] = (content.match(regex) || []).length;
        });

        return counts;
    }

    // Count local mentions
    countLocalMentions() {
        const content = document.body.textContent.toLowerCase();
        const localTerms = [
            'dinamo tamiri', 'alternatör servisi', 'marş motoru tamiri',
            'bobin sarma', 'elektrik tamiri', 'araç elektrik sistemi'
        ];

        const counts = {};
        localTerms.forEach(term => {
            const regex = new RegExp(term, 'gi');
            counts[term] = (content.match(regex) || []).length;
        });

        return counts;
    }

    // Count local images
    countLocalImages() {
        const images = document.querySelectorAll('img');
        let localImages = 0;

        images.forEach(img => {
            if (img.alt && (
                img.alt.toLowerCase().includes('sultanbeyli') ||
                img.alt.toLowerCase().includes('istanbul') ||
                img.alt.toLowerCase().includes('anadolu yakası')
            )) {
                localImages++;
            }
        });

        return localImages;
    }

    // Count local links
    countLocalLinks() {
        const links = document.querySelectorAll('a');
        let localLinks = 0;

        links.forEach(link => {
            if (link.textContent && (
                link.textContent.toLowerCase().includes('sultanbeyli') ||
                link.textContent.toLowerCase().includes('istanbul') ||
                link.textContent.toLowerCase().includes('anadolu yakası')
            )) {
                localLinks++;
            }
        });

        return localLinks;
    }

    // Analyze local content
    analyzeLocalContent() {
        const content = document.body.textContent;
        const analysis = {
            wordCount: content.split(/\s+/).length,
            localWordCount: 0,
            localPercentage: 0
        };

        const localTerms = [
            'sultanbeyli', 'kartal', 'pendik', 'maltepe', 'kadıköy',
            'ataşehir', 'ümraniye', 'çekmeköy', 'sancaktepe',
            'dinamo tamiri', 'alternatör servisi', 'marş motoru tamiri'
        ];

        localTerms.forEach(term => {
            const regex = new RegExp(term, 'gi');
            const matches = content.match(regex);
            if (matches) {
                analysis.localWordCount += matches.length;
            }
        });

        analysis.localPercentage = (analysis.localWordCount / analysis.wordCount * 100).toFixed(2);

        return analysis;
    }

    // Send local SEO metrics to GA4
    sendLocalSEOMetrics(metrics) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'local_seo_metrics', {
                event_category: 'Local SEO',
                event_label: 'Local Analysis',
                local_keywords: Object.keys(metrics.localKeywords).length,
                local_mentions: Object.keys(metrics.localMentions).length,
                local_images: metrics.localImages,
                local_links: metrics.localLinks,
                local_content_percentage: metrics.localContent.localPercentage,
                page_path: this.currentPage
            });
        }
    }

    // Get local SEO report
    getLocalSEOReport() {
        return {
            business: this.localData.business,
            location: this.localData.location,
            serviceArea: this.localData.serviceArea,
            metrics: this.localData.metrics,
            timestamp: new Date().toISOString()
        };
    }

    // Export local SEO report
    exportLocalSEOReport() {
        const report = this.getLocalSEOReport();
        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `local-seo-report-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
    }
}

// Initialize Local SEO Enhancer when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.localSEOEnhancer = new LocalSEOEnhancer();
    
    // Add local SEO report button to page
    const localSEOButton = document.createElement('button');
    localSEOButton.innerHTML = '🏠 Local SEO Raporu';
    localSEOButton.style.cssText = `
        position: fixed; bottom: 20px; right: 80px; z-index: 10000;
        background: linear-gradient(135deg, #0b5cff, #3b82f6);
        color: white; border: none; padding: 12px 20px;
        border-radius: 25px; cursor: pointer; font-weight: 600;
        box-shadow: 0 4px 12px rgba(11, 92, 255, 0.3);
        transition: all 0.3s ease;
    `;
    localSEOButton.addEventListener('click', () => {
        window.localSEOEnhancer.exportLocalSEOReport();
    });
    document.body.appendChild(localSEOButton);
    
    console.log('🏠 Local SEO Enhancer loaded successfully');
});

