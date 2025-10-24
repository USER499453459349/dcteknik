// SEO Optimization JavaScript
// DC TEKNİK - Dinamocu Serdar

class SEOOptimizer {
    constructor() {
        this.gaMeasurementId = document.querySelector('meta[name="ga-measurement-id"]')?.content || 'G-N1Z05DJ9B4';
        this.baseUrl = window.location.origin;
        this.currentPage = window.location.pathname;
        this.seoData = {
            keywords: [],
            metaTags: {},
            schemaData: {},
            performance: {},
            localSEO: {}
        };
        
        this.init();
    }

    init() {
        this.analyzeCurrentPage();
        this.optimizeMetaTags();
        this.enhanceSchemaMarkup();
        this.improveLocalSEO();
        this.optimizeInternalLinking();
        this.trackSEOMetrics();
        
        console.log('🔍 SEO Optimizer initialized');
    }

    // Analyze current page for SEO opportunities
    analyzeCurrentPage() {
        const analysis = {
            title: document.title,
            metaDescription: this.getMetaContent('description'),
            metaKeywords: this.getMetaContent('keywords'),
            h1Tags: this.getHTags('h1'),
            h2Tags: this.getHTags('h2'),
            images: this.analyzeImages(),
            links: this.analyzeLinks(),
            content: this.analyzeContent(),
            performance: this.analyzePerformance()
        };

        this.seoData.analysis = analysis;
        this.generateSEORecommendations(analysis);
    }

    // Get meta tag content
    getMetaContent(name) {
        const meta = document.querySelector(`meta[name="${name}"]`);
        return meta ? meta.content : '';
    }

    // Get heading tags
    getHTags(tag) {
        const headings = document.querySelectorAll(tag);
        return Array.from(headings).map(h => h.textContent.trim());
    }

    // Analyze images for SEO
    analyzeImages() {
        const images = document.querySelectorAll('img');
        const analysis = {
            total: images.length,
            withAlt: 0,
            withoutAlt: 0,
            withTitle: 0,
            optimized: 0,
            issues: []
        };

        images.forEach((img, index) => {
            if (img.alt) {
                analysis.withAlt++;
            } else {
                analysis.withoutAlt++;
                analysis.issues.push(`Image ${index + 1}: Missing alt attribute`);
            }

            if (img.title) {
                analysis.withTitle++;
            }

            if (img.alt && img.title) {
                analysis.optimized++;
            }
        });

        return analysis;
    }

    // Analyze links for SEO
    analyzeLinks() {
        const links = document.querySelectorAll('a');
        const analysis = {
            total: links.length,
            internal: 0,
            external: 0,
            withTitle: 0,
            withoutTitle: 0,
            issues: []
        };

        links.forEach((link, index) => {
            const href = link.href;
            
            if (href.startsWith(this.baseUrl) || href.startsWith('/')) {
                analysis.internal++;
            } else if (href.startsWith('http')) {
                analysis.external++;
            }

            if (link.title) {
                analysis.withTitle++;
            } else {
                analysis.withoutTitle++;
                if (href.startsWith('http') && !href.includes(this.baseUrl)) {
                    analysis.issues.push(`External link ${index + 1}: Missing title attribute`);
                }
            }
        });

        return analysis;
    }

    // Analyze content for SEO
    analyzeContent() {
        const content = document.body.textContent;
        const analysis = {
            wordCount: content.split(/\s+/).length,
            paragraphCount: document.querySelectorAll('p').length,
            headingCount: document.querySelectorAll('h1, h2, h3, h4, h5, h6').length,
            keywordDensity: this.calculateKeywordDensity(content),
            readability: this.analyzeReadability(content)
        };

        return analysis;
    }

    // Calculate keyword density
    calculateKeywordDensity(content) {
        const keywords = [
            'dinamo', 'alternatör', 'marş motoru', 'elektrik', 'tamir', 'servis',
            'sultanbeyli', 'istanbul', 'anadolu yakası', 'bobin', 'sarma'
        ];

        const density = {};
        const words = content.toLowerCase().split(/\s+/);
        const totalWords = words.length;

        keywords.forEach(keyword => {
            const keywordWords = keyword.split(/\s+/);
            let count = 0;

            for (let i = 0; i <= words.length - keywordWords.length; i++) {
                if (keywordWords.every((kw, j) => words[i + j] === kw)) {
                    count++;
                }
            }

            density[keyword] = {
                count: count,
                density: (count / totalWords * 100).toFixed(2) + '%'
            };
        });

        return density;
    }

    // Analyze readability
    analyzeReadability(content) {
        const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const words = content.split(/\s+/).filter(w => w.length > 0);
        const syllables = this.countSyllables(content);

        const avgWordsPerSentence = words.length / sentences.length;
        const avgSyllablesPerWord = syllables / words.length;

        // Simple readability score (0-100)
        const score = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);
        
        return {
            score: Math.max(0, Math.min(100, score)),
            level: score > 80 ? 'Very Easy' : score > 60 ? 'Easy' : score > 40 ? 'Moderate' : 'Difficult',
            avgWordsPerSentence: avgWordsPerSentence.toFixed(1),
            avgSyllablesPerWord: avgSyllablesPerWord.toFixed(2)
        };
    }

    // Count syllables in text
    countSyllables(text) {
        const words = text.toLowerCase().split(/\s+/);
        let totalSyllables = 0;

        words.forEach(word => {
            const syllables = word.match(/[aeiouy]+/g);
            if (syllables) {
                totalSyllables += syllables.length;
            }
        });

        return totalSyllables;
    }

    // Analyze performance
    analyzePerformance() {
        const performance = {
            loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart,
            domContentLoaded: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
            firstPaint: 0,
            firstContentfulPaint: 0,
            largestContentfulPaint: 0,
            cumulativeLayoutShift: 0
        };

        // Get Core Web Vitals if available
        if (window.performance && window.performance.getEntriesByType) {
            const paintEntries = window.performance.getEntriesByType('paint');
            paintEntries.forEach(entry => {
                if (entry.name === 'first-paint') {
                    performance.firstPaint = entry.startTime;
                } else if (entry.name === 'first-contentful-paint') {
                    performance.firstContentfulPaint = entry.startTime;
                }
            });

            const lcpEntries = window.performance.getEntriesByType('largest-contentful-paint');
            if (lcpEntries.length > 0) {
                performance.largestContentfulPaint = lcpEntries[lcpEntries.length - 1].startTime;
            }
        }

        return performance;
    }

    // Generate SEO recommendations
    generateSEORecommendations(analysis) {
        const recommendations = [];

        // Title optimization
        if (analysis.title.length < 30 || analysis.title.length > 60) {
            recommendations.push({
                type: 'title',
                priority: 'high',
                message: 'Title tag length should be between 30-60 characters',
                current: analysis.title.length,
                suggestion: 'Optimize title length'
            });
        }

        // Meta description optimization
        if (analysis.metaDescription.length < 120 || analysis.metaDescription.length > 160) {
            recommendations.push({
                type: 'meta-description',
                priority: 'high',
                message: 'Meta description should be between 120-160 characters',
                current: analysis.metaDescription.length,
                suggestion: 'Optimize meta description length'
            });
        }

        // H1 tag optimization
        if (analysis.h1Tags.length === 0) {
            recommendations.push({
                type: 'h1',
                priority: 'critical',
                message: 'Missing H1 tag',
                suggestion: 'Add a single H1 tag to the page'
            });
        } else if (analysis.h1Tags.length > 1) {
            recommendations.push({
                type: 'h1',
                priority: 'high',
                message: 'Multiple H1 tags found',
                current: analysis.h1Tags.length,
                suggestion: 'Use only one H1 tag per page'
            });
        }

        // Image optimization
        if (analysis.images.withoutAlt > 0) {
            recommendations.push({
                type: 'images',
                priority: 'medium',
                message: `${analysis.images.withoutAlt} images missing alt attributes`,
                suggestion: 'Add alt attributes to all images'
            });
        }

        // Internal linking
        if (analysis.links.internal < 5) {
            recommendations.push({
                type: 'internal-linking',
                priority: 'medium',
                message: 'Low internal linking',
                current: analysis.links.internal,
                suggestion: 'Add more internal links'
            });
        }

        // Content length
        if (analysis.content.wordCount < 300) {
            recommendations.push({
                type: 'content',
                priority: 'medium',
                message: 'Content is too short',
                current: analysis.content.wordCount,
                suggestion: 'Add more content (minimum 300 words)'
            });
        }

        this.seoData.recommendations = recommendations;
    }

    // Optimize meta tags
    optimizeMetaTags() {
        const metaTags = {
            title: this.optimizeTitle(),
            description: this.optimizeMetaDescription(),
            keywords: this.optimizeKeywords(),
            openGraph: this.optimizeOpenGraph(),
            twitter: this.optimizeTwitter()
        };

        this.seoData.metaTags = metaTags;
    }

    // Optimize title tag
    optimizeTitle() {
        const currentTitle = document.title;
        const pageType = this.getPageType();
        
        let optimizedTitle = currentTitle;
        
        if (pageType === 'homepage') {
            optimizedTitle = 'DC TEKNİK - Dinamocu Serdar | Dinamo Tamiri Sultanbeyli';
        } else if (pageType === 'blog') {
            optimizedTitle = currentTitle + ' | DC TEKNİK Blog';
        } else if (pageType === 'service') {
            optimizedTitle = currentTitle + ' | DC TEKNİK Servis';
        }

        // Ensure title length is optimal
        if (optimizedTitle.length > 60) {
            optimizedTitle = optimizedTitle.substring(0, 57) + '...';
        }

        return optimizedTitle;
    }

    // Optimize meta description
    optimizeMetaDescription() {
        const currentDescription = this.getMetaContent('description');
        const pageType = this.getPageType();
        
        let optimizedDescription = currentDescription;
        
        if (!optimizedDescription || optimizedDescription.length < 120) {
            if (pageType === 'homepage') {
                optimizedDescription = 'DC TEKNİK ile dinamo tamiri, alternatör bakımı ve marş motoru onarımı. Sultanbeyli merkezli, tüm Anadolu Yakası\'na hizmet. %100 garantili, hızlı teşhis, şeffaf fiyat.';
            } else if (pageType === 'blog') {
                optimizedDescription = 'DC TEKNİK uzmanlarından dinamo tamiri, alternatör bakımı ve marş motoru onarımı hakkında detaylı rehberler ve ipuçları.';
            }
        }

        // Ensure description length is optimal
        if (optimizedDescription.length > 160) {
            optimizedDescription = optimizedDescription.substring(0, 157) + '...';
        }

        return optimizedDescription;
    }

    // Optimize keywords
    optimizeKeywords() {
        const pageType = this.getPageType();
        let keywords = [];

        if (pageType === 'homepage') {
            keywords = [
                'dinamo tamiri', 'alternatör servisi', 'marş motoru tamiri',
                'sultanbeyli', 'istanbul anadolu yakası', 'dinamocu',
                'araç elektrik tamiri', 'bobin sarma', 'elektrik servisi'
            ];
        } else if (pageType === 'blog') {
            keywords = [
                'dinamo tamiri rehberi', 'alternatör bakımı', 'marş motoru onarımı',
                'otomotiv elektrik', 'araç elektrik sistemi', 'dinamo bobin'
            ];
        }

        return keywords.join(', ');
    }

    // Optimize Open Graph tags
    optimizeOpenGraph() {
        const pageType = this.getPageType();
        
        return {
            title: this.optimizeTitle(),
            description: this.optimizeMetaDescription(),
            image: `${this.baseUrl}/logo-new.svg`,
            url: window.location.href,
            type: pageType === 'homepage' ? 'website' : 'article',
            site_name: 'DC TEKNİK'
        };
    }

    // Optimize Twitter tags
    optimizeTwitter() {
        return {
            card: 'summary_large_image',
            title: this.optimizeTitle(),
            description: this.optimizeMetaDescription(),
            image: `${this.baseUrl}/logo-new.svg`,
            creator: '@dcteknik'
        };
    }

    // Get page type
    getPageType() {
        if (this.currentPage === '/' || this.currentPage === '/index.html') {
            return 'homepage';
        } else if (this.currentPage.includes('blog')) {
            return 'blog';
        } else if (this.currentPage.includes('servis') || this.currentPage.includes('service')) {
            return 'service';
        } else {
            return 'page';
        }
    }

    // Enhance schema markup
    enhanceSchemaMarkup() {
        const pageType = this.getPageType();
        let schema = {};

        if (pageType === 'homepage') {
            schema = this.generateOrganizationSchema();
        } else if (pageType === 'blog') {
            schema = this.generateBlogSchema();
        } else if (pageType === 'service') {
            schema = this.generateServiceSchema();
        }

        this.seoData.schemaData = schema;
        this.injectSchemaMarkup(schema);
    }

    // Generate organization schema
    generateOrganizationSchema() {
        return {
            "@context": "https://schema.org",
            "@type": "AutoRepair",
            "name": "DC TEKNİK - Dinamocu Serdar",
            "description": "Dinamo tamiri, alternatör bakımı ve marş motoru onarımı konusunda uzman servis",
            "url": this.baseUrl,
            "logo": `${this.baseUrl}/logo-new.svg`,
            "image": `${this.baseUrl}/logo-new.svg`,
            "telephone": "+905353562469",
            "email": "serdaraltan890@gmail.com",
            "address": {
                "@type": "PostalAddress",
                "streetAddress": "Sultanbeyli",
                "addressLocality": "İstanbul",
                "addressRegion": "İstanbul",
                "addressCountry": "TR"
            },
            "geo": {
                "@type": "GeoCoordinates",
                "latitude": 40.9667,
                "longitude": 29.2667
            },
            "openingHours": "Mo-Fr 08:00-18:00, Sa 08:00-16:00",
            "priceRange": "$$",
            "paymentAccepted": "Cash, Credit Card",
            "currenciesAccepted": "TRY",
            "sameAs": [
                "https://wa.me/905353562469",
                "https://wa.me/c/905535153873"
            ],
            "serviceArea": {
                "@type": "GeoCircle",
                "geoMidpoint": {
                    "@type": "GeoCoordinates",
                    "latitude": 40.9667,
                    "longitude": 29.2667
                },
                "geoRadius": "50000"
            },
            "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Otomotiv Elektrik Servisleri",
                "itemListElement": [
                    {
                        "@type": "Offer",
                        "itemOffered": {
                            "@type": "Service",
                            "name": "Dinamo Tamiri",
                            "description": "Dinamo tamiri ve bobin sarma hizmeti"
                        }
                    },
                    {
                        "@type": "Offer",
                        "itemOffered": {
                            "@type": "Service",
                            "name": "Alternatör Bakımı",
                            "description": "Alternatör bakımı ve onarımı hizmeti"
                        }
                    },
                    {
                        "@type": "Offer",
                        "itemOffered": {
                            "@type": "Service",
                            "name": "Marş Motoru Onarımı",
                            "description": "Marş motoru onarımı ve bakımı hizmeti"
                        }
                    }
                ]
            }
        };
    }

    // Generate blog schema
    generateBlogSchema() {
        return {
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "DC TEKNİK Blog",
            "description": "Dinamo tamiri, alternatör bakımı ve marş motoru onarımı hakkında uzman rehberler",
            "url": `${this.baseUrl}/blog.html`,
            "publisher": {
                "@type": "Organization",
                "name": "DC TEKNİK",
                "logo": {
                    "@type": "ImageObject",
                    "url": `${this.baseUrl}/logo-new.svg`
                }
            }
        };
    }

    // Generate service schema
    generateServiceSchema() {
        return {
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Dinamo Tamiri",
            "description": "Profesyonel dinamo tamiri ve bobin sarma hizmeti",
            "provider": {
                "@type": "AutoRepair",
                "name": "DC TEKNİK - Dinamocu Serdar"
            },
            "areaServed": {
                "@type": "City",
                "name": "Sultanbeyli, İstanbul"
            },
            "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Dinamo Tamiri Hizmetleri",
                "itemListElement": [
                    {
                        "@type": "Offer",
                        "itemOffered": {
                            "@type": "Service",
                            "name": "Dinamo Tamiri",
                            "description": "Dinamo tamiri ve bobin sarma"
                        }
                    }
                ]
            }
        };
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

    // Improve local SEO
    improveLocalSEO() {
        const localSEO = {
            googleMyBusiness: this.optimizeGoogleMyBusiness(),
            localKeywords: this.optimizeLocalKeywords(),
            localContent: this.optimizeLocalContent(),
            localSchema: this.optimizeLocalSchema()
        };

        this.seoData.localSEO = localSEO;
    }

    // Optimize Google My Business
    optimizeGoogleMyBusiness() {
        return {
            name: 'DC TEKNİK - Dinamocu Serdar',
            category: 'Auto Repair Shop',
            description: 'Dinamo tamiri, alternatör bakımı ve marş motoru onarımı konusunda uzman servis. Sultanbeyli merkezli, tüm Anadolu Yakası\'na hizmet.',
            address: 'Sultanbeyli, İstanbul',
            phone: '+905353562469',
            website: this.baseUrl,
            hours: {
                monday: '08:00-18:00',
                tuesday: '08:00-18:00',
                wednesday: '08:00-18:00',
                thursday: '08:00-18:00',
                friday: '08:00-18:00',
                saturday: '08:00-16:00',
                sunday: 'Closed'
            },
            services: [
                'Dinamo Tamiri',
                'Alternatör Bakımı',
                'Marş Motoru Onarımı',
                'Bobin Sarma',
                'Elektrik Tamiri'
            ],
            attributes: [
                'Wheelchair Accessible',
                'Parking Available',
                'Accepts Credit Cards',
                'Cash Only',
                'Family Owned'
            ]
        };
    }

    // Optimize local keywords
    optimizeLocalKeywords() {
        return [
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
    }

    // Optimize local content
    optimizeLocalContent() {
        return {
            locationMentions: this.countLocationMentions(),
            localServices: this.identifyLocalServices(),
            localTestimonials: this.identifyLocalTestimonials(),
            localImages: this.identifyLocalImages()
        };
    }

    // Count location mentions
    countLocationMentions() {
        const content = document.body.textContent.toLowerCase();
        const locations = ['sultanbeyli', 'istanbul', 'anadolu yakası', 'kartal', 'pendik', 'maltepe'];
        
        const mentions = {};
        locations.forEach(location => {
            const regex = new RegExp(location, 'gi');
            mentions[location] = (content.match(regex) || []).length;
        });

        return mentions;
    }

    // Identify local services
    identifyLocalServices() {
        const services = [
            'dinamo tamiri', 'alternatör bakımı', 'marş motoru onarımı',
            'bobin sarma', 'elektrik tamiri', 'araç elektrik sistemi'
        ];

        const content = document.body.textContent.toLowerCase();
        const foundServices = services.filter(service => 
            content.includes(service)
        );

        return foundServices;
    }

    // Identify local testimonials
    identifyLocalTestimonials() {
        const testimonials = document.querySelectorAll('[class*="testimonial"], [class*="review"], [class*="yorum"]');
        return testimonials.length;
    }

    // Identify local images
    identifyLocalImages() {
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

    // Optimize local schema
    optimizeLocalSchema() {
        return {
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "DC TEKNİK - Dinamocu Serdar",
            "description": "Dinamo tamiri, alternatör bakımı ve marş motoru onarımı konusunda uzman servis",
            "url": this.baseUrl,
            "telephone": "+905353562469",
            "email": "serdaraltan890@gmail.com",
            "address": {
                "@type": "PostalAddress",
                "streetAddress": "Sultanbeyli",
                "addressLocality": "İstanbul",
                "addressRegion": "İstanbul",
                "addressCountry": "TR"
            },
            "geo": {
                "@type": "GeoCoordinates",
                "latitude": 40.9667,
                "longitude": 29.2667
            },
            "openingHours": "Mo-Fr 08:00-18:00, Sa 08:00-16:00",
            "priceRange": "$$",
            "paymentAccepted": "Cash, Credit Card",
            "currenciesAccepted": "TRY",
            "areaServed": [
                {
                    "@type": "City",
                    "name": "Sultanbeyli"
                },
                {
                    "@type": "City",
                    "name": "Kartal"
                },
                {
                    "@type": "City",
                    "name": "Pendik"
                },
                {
                    "@type": "City",
                    "name": "Maltepe"
                }
            ]
        };
    }

    // Optimize internal linking
    optimizeInternalLinking() {
        const internalLinks = this.analyzeInternalLinks();
        const suggestions = this.generateInternalLinkingSuggestions(internalLinks);
        
        this.seoData.internalLinking = {
            current: internalLinks,
            suggestions: suggestions
        };
    }

    // Analyze internal links
    analyzeInternalLinks() {
        const links = document.querySelectorAll('a');
        const internalLinks = [];
        const externalLinks = [];

        links.forEach(link => {
            const href = link.href;
            if (href.startsWith(this.baseUrl) || href.startsWith('/')) {
                internalLinks.push({
                    text: link.textContent.trim(),
                    href: href,
                    title: link.title || '',
                    target: link.target || '_self'
                });
            } else if (href.startsWith('http')) {
                externalLinks.push({
                    text: link.textContent.trim(),
                    href: href,
                    title: link.title || '',
                    target: link.target || '_self'
                });
            }
        });

        return {
            internal: internalLinks,
            external: externalLinks,
            total: links.length
        };
    }

    // Generate internal linking suggestions
    generateInternalLinkingSuggestions(internalLinks) {
        const suggestions = [];
        const importantPages = [
            { url: '/', title: 'Ana Sayfa', priority: 'high' },
            { url: '/blog.html', title: 'Blog', priority: 'high' },
            { url: '/bobin.html', title: 'Bobin Sarma', priority: 'medium' },
            { url: '/faq.html', title: 'Sık Sorulan Sorular', priority: 'medium' }
        ];

        importantPages.forEach(page => {
            const hasLink = internalLinks.internal.some(link => 
                link.href.includes(page.url)
            );

            if (!hasLink) {
                suggestions.push({
                    page: page.title,
                    priority: page.priority,
                    message: `Add internal link to ${page.title}`,
                    suggestion: `Link to ${page.url} from relevant content`
                });
            }
        });

        return suggestions;
    }

    // Track SEO metrics
    trackSEOMetrics() {
        const metrics = {
            pageLoad: performance.timing.loadEventEnd - performance.timing.navigationStart,
            domContentLoaded: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
            firstPaint: 0,
            firstContentfulPaint: 0,
            largestContentfulPaint: 0,
            cumulativeLayoutShift: 0,
            seoScore: this.calculateSEOScore(),
            timestamp: new Date().toISOString()
        };

        // Track Core Web Vitals
        if (window.performance && window.performance.getEntriesByType) {
            const paintEntries = window.performance.getEntriesByType('paint');
            paintEntries.forEach(entry => {
                if (entry.name === 'first-paint') {
                    metrics.firstPaint = entry.startTime;
                } else if (entry.name === 'first-contentful-paint') {
                    metrics.firstContentfulPaint = entry.startTime;
                }
            });

            const lcpEntries = window.performance.getEntriesByType('largest-contentful-paint');
            if (lcpEntries.length > 0) {
                metrics.largestContentfulPaint = lcpEntries[lcpEntries.length - 1].startTime;
            }
        }

        this.seoData.performance = metrics;
        this.sendSEOMetrics(metrics);
    }

    // Calculate SEO score
    calculateSEOScore() {
        let score = 0;
        const maxScore = 100;

        // Title optimization (20 points)
        const title = document.title;
        if (title.length >= 30 && title.length <= 60) {
            score += 20;
        } else if (title.length > 0) {
            score += 10;
        }

        // Meta description (20 points)
        const metaDescription = this.getMetaContent('description');
        if (metaDescription.length >= 120 && metaDescription.length <= 160) {
            score += 20;
        } else if (metaDescription.length > 0) {
            score += 10;
        }

        // H1 tag (15 points)
        const h1Tags = document.querySelectorAll('h1');
        if (h1Tags.length === 1) {
            score += 15;
        } else if (h1Tags.length > 0) {
            score += 5;
        }

        // Images with alt (15 points)
        const images = document.querySelectorAll('img');
        const imagesWithAlt = document.querySelectorAll('img[alt]');
        if (images.length > 0) {
            score += (imagesWithAlt.length / images.length) * 15;
        }

        // Internal links (10 points)
        const links = document.querySelectorAll('a');
        const internalLinks = Array.from(links).filter(link => 
            link.href.startsWith(this.baseUrl) || link.href.startsWith('/')
        );
        if (internalLinks.length >= 5) {
            score += 10;
        } else {
            score += (internalLinks.length / 5) * 10;
        }

        // Content length (10 points)
        const content = document.body.textContent;
        const wordCount = content.split(/\s+/).length;
        if (wordCount >= 300) {
            score += 10;
        } else {
            score += (wordCount / 300) * 10;
        }

        // Schema markup (10 points)
        const schemaScripts = document.querySelectorAll('script[type="application/ld+json"]');
        if (schemaScripts.length > 0) {
            score += 10;
        }

        return Math.round(score);
    }

    // Send SEO metrics to GA4
    sendSEOMetrics(metrics) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'seo_metrics', {
                event_category: 'SEO',
                event_label: 'Page Analysis',
                seo_score: metrics.seoScore,
                page_load_time: metrics.pageLoad,
                dom_content_loaded: metrics.domContentLoaded,
                first_paint: metrics.firstPaint,
                first_contentful_paint: metrics.firstContentfulPaint,
                largest_contentful_paint: metrics.largestContentfulPaint,
                page_path: this.currentPage
            });
        }
    }

    // Get SEO report
    getSEOReport() {
        return {
            analysis: this.seoData.analysis,
            recommendations: this.seoData.recommendations,
            metaTags: this.seoData.metaTags,
            schemaData: this.seoData.schemaData,
            localSEO: this.seoData.localSEO,
            internalLinking: this.seoData.internalLinking,
            performance: this.seoData.performance,
            timestamp: new Date().toISOString()
        };
    }

    // Export SEO report
    exportSEOReport() {
        const report = this.getSEOReport();
        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `seo-report-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
    }
}

// Initialize SEO Optimizer when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.seoOptimizer = new SEOOptimizer();
    
    // Add SEO report button to page
    const seoButton = document.createElement('button');
    seoButton.innerHTML = '🔍 SEO Raporu';
    seoButton.style.cssText = `
        position: fixed; bottom: 20px; right: 20px; z-index: 10000;
        background: linear-gradient(135deg, #059669, #10b981);
        color: white; border: none; padding: 12px 20px;
        border-radius: 25px; cursor: pointer; font-weight: 600;
        box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3);
        transition: all 0.3s ease;
    `;
    seoButton.addEventListener('click', () => {
        window.seoOptimizer.exportSEOReport();
    });
    document.body.appendChild(seoButton);
    
    console.log('🔍 SEO Optimizer loaded successfully');
});

