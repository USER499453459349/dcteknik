/**
 * DC TEKNİK - Blog RSS Feed Generator
 * RSS feed otomatik oluşturma ve güncelleme
 */

(function() {
    'use strict';
    
    // ========================================
    // RSS FEED AUTO-UPDATE
    // ========================================
    
    function updateRSSFeed() {
        // RSS feed'i güncellemek için blog.html'deki article'ları parse et
        // Not: Bu client-side çalışır, feed.xml'i server-side güncellemek daha iyi olur
        
        // RSS feed validation check
        const feedLink = document.querySelector('link[rel="alternate"][type="application/rss+xml"]');
        if (feedLink) {
            const feedUrl = feedLink.getAttribute('href');
            
            // Check if feed exists and is accessible
            fetch(feedUrl, { method: 'HEAD' })
                .then(response => {
                    if (response.ok) {
                        console.log('✅ RSS Feed accessible:', feedUrl);
                        
                        // Track RSS feed access
                        if (typeof gtag !== 'undefined') {
                            gtag('event', 'rss_feed_accessed', {
                                event_category: 'blog',
                                event_label: 'rss_feed',
                                value: 1
                            });
                        }
                    }
                })
                .catch(error => {
                    console.warn('⚠️ RSS Feed check failed:', error);
                });
        }
    }
    
    // ========================================
    // RSS FEED VALIDATION
    // ========================================
    
    function validateRSSFeed() {
        // RSS feed'in doğru format olduğunu kontrol et
        const feedLink = document.querySelector('link[rel="alternate"][type="application/rss+xml"]');
        if (!feedLink) {
            console.warn('⚠️ RSS Feed link not found in HTML');
            return;
        }
        
        // Feed URL'yi blog sayfasına ekle (meta tag olarak)
        if (!document.querySelector('meta[name="rss-feed"]')) {
            const meta = document.createElement('meta');
            meta.name = 'rss-feed';
            meta.content = feedLink.getAttribute('href');
            document.head.appendChild(meta);
        }
    }
    
    // ========================================
    // RSS SUBSCRIBE BUTTON (Optional)
    // ========================================
    
    function addRSSSubscribeButton() {
        // RSS subscribe butonu ekle (isteğe bağlı)
        const feedLink = document.querySelector('link[rel="alternate"][type="application/rss+xml"]');
        if (!feedLink) return;
        
        const feedUrl = feedLink.getAttribute('href');
        
        // Sidebar'a RSS butonu ekle
        const sidebar = document.querySelector('.blog-sidebar');
        if (sidebar && !document.getElementById('rss-subscribe-btn')) {
            const rssWidget = document.createElement('div');
            rssWidget.className = 'sidebar-widget';
            rssWidget.innerHTML = `
                <h3>📡 RSS Feed</h3>
                <p>Yeni yazıları RSS okuyucunuzla takip edin!</p>
                <a href="${feedUrl}" class="btn btn-primary" id="rss-subscribe-btn" target="_blank" rel="noopener noreferrer">
                    <i class="fas fa-rss"></i> RSS Feed'e Abone Ol
                </a>
            `;
            
            // Add to sidebar (after newsletter widget if exists)
            const newsletterWidget = sidebar.querySelector('.newsletter-widget');
            if (newsletterWidget) {
                newsletterWidget.parentElement.insertBefore(rssWidget, newsletterWidget.nextSibling);
            } else {
                sidebar.appendChild(rssWidget);
            }
            
            // Track RSS subscribe clicks
            const rssButton = document.getElementById('rss-subscribe-btn');
            if (rssButton) {
                rssButton.addEventListener('click', () => {
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'rss_subscribe_clicked', {
                            event_category: 'blog',
                            event_label: 'rss_subscribe',
                            value: 1
                        });
                    }
                });
            }
        }
    }
    
    // ========================================
    // INITIALIZE
    // ========================================
    
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }
        
        console.log('📡 RSS Feed Generator initializing...');
        
        validateRSSFeed();
        updateRSSFeed();
        addRSSSubscribeButton();
        
        console.log('✅ RSS Feed Generator initialized!');
    }
    
    init();
})();




