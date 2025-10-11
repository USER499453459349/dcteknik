// Advanced SEO Optimization for DC TEKNİK
// Automotive Industry Focused SEO Strategy

class AdvancedSEO {
    constructor() {
        this.keywords = {
            primary: [
                'dinamocu sultanbeyli',
                'alternatör tamiri istanbul',
                'marş motoru servisi',
                'otomotiv sanayi sultanbeyli',
                'araç tamiri istanbul'
            ],
            secondary: [
                'dinamo tamiri',
                'alternatör onarımı',
                'marş motoru tamiri',
                'otomotiv servisi',
                'araç elektrik tamiri'
            ],
            local: [
                'sultanbeyli dinamocu',
                'istanbul otomotiv',
                'araç tamiri sultanbeyli',
                'otomotiv sanayi istanbul',
                'dinamocu serdar'
            ],
            longTail: [
                'dinamo tamiri sultanbeyli istanbul',
                'alternatör değişimi fiyat',
                'marş motoru arızası çözümü',
                'otomotiv elektrik tamiri',
                'araç dinamo servisi'
            ]
        };
        
        this.init();
    }

    init() {
        this.optimizeMetaTags();
        this.addStructuredData();
        this.optimizeContent();
        this.addLocalSEO();
        this.trackSEO();
        
        console.log('🚀 Advanced SEO initialized for automotive industry');
    }

    optimizeMetaTags() {
        // Update title with primary keywords
        const title = document.querySelector('title');
        if (title) {
            title.textContent = 'DC TEKNİK - Dinamocu Serdar | Sultanbeyli Otomotiv Sanayi | Alternatör Marş Motoru Tamiri İstanbul';
        }

        // Update meta description
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute('content', 'DC TEKNİK - Sultanbeyli\'nin en güvenilir dinamocu servisi. Alternatör, marş motoru, dinamo tamiri. 15 yıllık deneyim, kaliteli hizmet, uygun fiyat. İstanbul otomotiv sanayi uzmanı.');
        }

        // Add additional meta tags
        this.addMetaTag('keywords', this.keywords.primary.join(', ') + ', ' + this.keywords.secondary.join(', '));
        this.addMetaTag('geo.region', 'TR-34');
        this.addMetaTag('geo.placename', 'Sultanbeyli, İstanbul');
        this.addMetaTag('geo.position', '40.9923;29.2044');
        this.addMetaTag('ICBM', '40.9923, 29.2044');
    }

    addMetaTag(name, content) {
        let meta = document.querySelector(`meta[name="${name}"]`);
        if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute('name', name);
            document.head.appendChild(meta);
        }
        meta.setAttribute('content', content);
    }

    addStructuredData() {
        const structuredData = {
            "@context": "https://schema.org",
            "@type": "AutomotiveRepairShop",
            "name": "DC TEKNİK - Dinamocu Serdar",
            "description": "Sultanbeyli'nin en güvenilir dinamocu servisi. Alternatör, marş motoru, dinamo tamiri.",
            "url": "https://dcteknik.com",
            "telephone": "+905353562469",
            "email": "info@dcteknik.com",
            "address": {
                "@type": "PostalAddress",
                "streetAddress": "Atatürk Cad. No:312",
                "addressLocality": "Sultanbeyli",
                "addressRegion": "İstanbul",
                "postalCode": "34920",
                "addressCountry": "TR"
            },
            "geo": {
                "@type": "GeoCoordinates",
                "latitude": "40.9923",
                "longitude": "29.2044"
            },
            "openingHours": "Mo-Su 00:00-23:59",
            "priceRange": "$$",
            "paymentAccepted": "Cash, Credit Card",
            "currenciesAccepted": "TRY",
            "areaServed": {
                "@type": "City",
                "name": "Sultanbeyli, İstanbul"
            },
            "serviceType": [
                "Dinamo Tamiri",
                "Alternatör Onarımı", 
                "Marş Motoru Servisi",
                "Otomotiv Elektrik Tamiri"
            ],
            "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Otomotiv Servis Hizmetleri",
                "itemListElement": [
                    {
                        "@type": "Offer",
                        "itemOffered": {
                            "@type": "Service",
                            "name": "Dinamo Tamiri",
                            "description": "Profesyonel dinamo tamiri ve onarımı"
                        }
                    },
                    {
                        "@type": "Offer",
                        "itemOffered": {
                            "@type": "Service",
                            "name": "Alternatör Onarımı",
                            "description": "Alternatör arıza tespiti ve tamiri"
                        }
                    },
                    {
                        "@type": "Offer",
                        "itemOffered": {
                            "@type": "Service",
                            "name": "Marş Motoru Servisi",
                            "description": "Marş motoru tamiri ve bakımı"
                        }
                    }
                ]
            },
            "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "reviewCount": "127"
            },
            "sameAs": [
                "https://www.facebook.com/DinamocuSerdar",
                "https://www.instagram.com/dinamocuserdar"
            ]
        };

        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(structuredData);
        document.head.appendChild(script);
    }

    optimizeContent() {
        // Add keywords to headings
        const headings = document.querySelectorAll('h1, h2, h3');
        headings.forEach(heading => {
            const text = heading.textContent.toLowerCase();
            if (text.includes('dinamo') || text.includes('alternatör') || text.includes('marş')) {
                heading.setAttribute('data-seo-optimized', 'true');
            }
        });

        // Add alt texts to images
        const images = document.querySelectorAll('img:not([alt])');
        images.forEach(img => {
            if (img.src.includes('dinamo') || img.src.includes('alternator')) {
                img.alt = 'DC TEKNİK Dinamocu Servisi - Profesyonel Otomotiv Tamiri';
            }
        });
    }

    addLocalSEO() {
        // Add local business information
        const localInfo = document.createElement('div');
        localInfo.className = 'local-seo-info';
        localInfo.style.display = 'none';
        localInfo.innerHTML = `
            <div itemscope itemtype="https://schema.org/LocalBusiness">
                <span itemprop="name">DC TEKNİK - Dinamocu Serdar</span>
                <span itemprop="description">Sultanbeyli otomotiv sanayi dinamocu servisi</span>
                <div itemprop="address" itemscope itemtype="https://schema.org/PostalAddress">
                    <span itemprop="streetAddress">Atatürk Cad. No:312</span>
                    <span itemprop="addressLocality">Sultanbeyli</span>
                    <span itemprop="addressRegion">İstanbul</span>
                    <span itemprop="postalCode">34920</span>
                    <span itemprop="addressCountry">TR</span>
                </div>
                <span itemprop="telephone">+905353562469</span>
                <span itemprop="url">https://dcteknik.com</span>
            </div>
        `;
        document.body.appendChild(localInfo);
    }

    trackSEO() {
        // Track SEO performance
        if (typeof gtag !== 'undefined') {
            gtag('event', 'seo_optimization', {
                event_category: 'automotive_seo',
                event_label: 'advanced_seo_loaded',
                value: 1
            });
        }
    }

    // Public methods
    getKeywords() {
        return this.keywords;
    }

    addKeywordDensity() {
        const content = document.body.textContent.toLowerCase();
        const wordCount = content.split(/\s+/).length;
        
        const keywordDensity = {};
        Object.values(this.keywords).flat().forEach(keyword => {
            const matches = (content.match(new RegExp(keyword, 'g')) || []).length;
            keywordDensity[keyword] = (matches / wordCount * 100).toFixed(2) + '%';
        });
        
        return keywordDensity;
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.advancedSEO = new AdvancedSEO();
});

// Export for use
window.AdvancedSEO = AdvancedSEO;
