// SEO Helper for DC TEKNİK
(function() {
    'use strict';
    
    // SEO Analytics
    const seoMetrics = {
        pageLoadTime: 0,
        bounceRate: 0,
        scrollDepth: 0,
        timeOnPage: 0,
        internalClicks: 0,
        externalClicks: 0
    };
    
    // Track scroll depth
    function trackScrollDepth() {
        let maxScroll = 0;
        const scrollThresholds = [25, 50, 75, 90, 100];
        const reachedThresholds = [];
        
        function updateScrollDepth() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = Math.round((scrollTop / documentHeight) * 100);
            
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                
                scrollThresholds.forEach(threshold => {
                    if (scrollPercent >= threshold && !reachedThresholds.includes(threshold)) {
                        reachedThresholds.push(threshold);
                        
                        // Track scroll depth in GA4
                        if (typeof gtag !== 'undefined') {
                            gtag('event', 'scroll_depth', {
                                event_category: 'engagement',
                                event_label: `${threshold}%`,
                                value: threshold
                            });
                        }
                        
                        console.log(`📊 Scroll depth: ${threshold}%`);
                    }
                });
            }
        }
        
        window.addEventListener('scroll', updateScrollDepth, { passive: true });
    }
    
    // Track time on page
    function trackTimeOnPage() {
        const startTime = Date.now();
        
        // Track time intervals
        const intervals = [30, 60, 120, 300]; // 30s, 1m, 2m, 5m
        const trackedIntervals = [];
        
        intervals.forEach(interval => {
            setTimeout(() => {
                if (!trackedIntervals.includes(interval)) {
                    trackedIntervals.push(interval);
                    
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'time_on_page', {
                            event_category: 'engagement',
                            event_label: `${interval}s`,
                            value: interval
                        });
                    }
                    
                    console.log(`📊 Time on page: ${interval}s`);
                }
            }, interval * 1000);
        });
        
        // Track when user leaves page
        window.addEventListener('beforeunload', () => {
            const timeOnPage = Math.round((Date.now() - startTime) / 1000);
            seoMetrics.timeOnPage = timeOnPage;
            
            if (typeof gtag !== 'undefined') {
                gtag('event', 'page_exit', {
                    event_category: 'engagement',
                    event_label: 'time_on_page',
                    value: timeOnPage
                });
            }
        });
    }
    
    // Track internal and external clicks
    function trackLinkClicks() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (!link) return;
            
            const href = link.href;
            const isInternal = href.includes(window.location.hostname) || href.startsWith('/');
            
            if (isInternal) {
                seoMetrics.internalClicks++;
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'internal_link_click', {
                        event_category: 'engagement',
                        event_label: link.textContent.trim(),
                        value: 1
                    });
                }
            } else {
                seoMetrics.externalClicks++;
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'external_link_click', {
                        event_category: 'engagement',
                        event_label: link.hostname,
                        value: 1
                    });
                }
            }
        });
    }
    
    // Track form interactions
    function trackFormInteractions() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                const formName = form.name || form.id || 'unnamed_form';
                
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'form_submit', {
                        event_category: 'conversion',
                        event_label: formName,
                        value: 1
                    });
                }
                
                console.log(`📊 Form submitted: ${formName}`);
            });
        });
    }
    
    // Track search queries
    function trackSearchQueries() {
        const searchInputs = document.querySelectorAll('input[type="search"], input[name*="search"], input[name*="query"]');
        searchInputs.forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const query = input.value.trim();
                    if (query.length > 0) {
                        if (typeof gtag !== 'undefined') {
                            gtag('event', 'search', {
                                event_category: 'engagement',
                                event_label: query,
                                value: 1
                            });
                        }
                        
                        console.log(`📊 Search query: ${query}`);
                    }
                }
            });
        });
    }
    
    // Track video interactions
    function trackVideoInteractions() {
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            video.addEventListener('play', () => {
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'video_play', {
                        event_category: 'engagement',
                        event_label: 'hero_video',
                        value: 1
                    });
                }
            });
            
            video.addEventListener('pause', () => {
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'video_pause', {
                        event_category: 'engagement',
                        event_label: 'hero_video',
                        value: 1
                    });
                }
            });
        });
    }
    
    // Track image interactions
    function trackImageInteractions() {
        const images = document.querySelectorAll('img[data-gallery], .gallery-image');
        images.forEach(img => {
            img.addEventListener('click', () => {
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'image_click', {
                        event_category: 'engagement',
                        event_label: 'gallery_image',
                        value: 1
                    });
                }
            });
        });
    }
    
    // Track phone and WhatsApp clicks
    function trackContactClicks() {
        const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
        const whatsappLinks = document.querySelectorAll('a[href*="wa.me"]');
        
        phoneLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'phone_call', {
                        event_category: 'conversion',
                        event_label: 'contact',
                        value: 1
                    });
                }
            });
        });
        
        whatsappLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'whatsapp_contact', {
                        event_category: 'conversion',
                        event_label: 'contact',
                        value: 1
                    });
                }
            });
        });
    }
    
    // Initialize SEO tracking
    function initSEOTracking() {
        console.log('🔍 SEO tracking initialized');
        
        trackScrollDepth();
        trackTimeOnPage();
        trackLinkClicks();
        trackFormInteractions();
        trackSearchQueries();
        trackVideoInteractions();
        trackImageInteractions();
        trackContactClicks();
        
        // Track page load
        window.addEventListener('load', () => {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'page_view', {
                    event_category: 'seo',
                    event_label: window.location.pathname,
                    value: 1
                });
            }
        });
    }
    
    // Start tracking when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSEOTracking);
    } else {
        initSEOTracking();
    }
    
    // Expose metrics for debugging
    window.seoMetrics = seoMetrics;
})();


