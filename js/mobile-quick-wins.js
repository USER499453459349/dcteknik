/**
 * DC TEKNİK - Mobile Quick Wins
 * Hızlı kazanımlar: One-tap actions, Sticky WhatsApp, Native Share
 */

(function() {
    'use strict';

    const MobileQuickWins = {
        phoneNumber: '+905353562469',
        whatsappNumber: '905353562469',
        email: 'serdaraltan890@gmail.com',
        address: 'Atatürk Cad. No:312, Sultanbeyli/İstanbul',
        
        init() {
            this.initOneTapActions();
            this.initStickyWhatsApp();
            this.initNativeShare();
            this.initSmartCTAs();
            
            const safeLog = window.safeLog || console.log;
            safeLog('⚡ Mobile Quick Wins initialized');
        },
        
        /**
         * One-Tap Actions
         * Phone, WhatsApp, Email, SMS, Maps için direkt açılım
         */
        initOneTapActions() {
            // Phone numbers - direkt arama
            document.querySelectorAll('a[href^="tel:"], [data-phone]').forEach(link => {
                link.addEventListener('click', (e) => {
                    const phone = link.getAttribute('href')?.replace('tel:', '') || 
                                 link.getAttribute('data-phone') || 
                                 this.phoneNumber;
                    
                    // Analytics tracking
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'phone_call_click', {
                            event_category: 'Mobile Quick Action',
                            phone_number: phone,
                            location: 'click'
                        });
                    }
                });
            });
            
            // WhatsApp links - direkt WhatsApp açılır
            document.querySelectorAll('a[href*="wa.me"], [data-whatsapp]').forEach(link => {
                link.addEventListener('click', (e) => {
                    let whatsapp = link.getAttribute('href') || 
                                  link.getAttribute('data-whatsapp') || 
                                  `https://wa.me/${this.whatsappNumber}`;
                    
                    // Ensure proper WhatsApp URL format
                    if (!whatsapp.includes('wa.me')) {
                        const number = whatsapp.replace(/[^0-9]/g, '');
                        whatsapp = `https://wa.me/${number}`;
                    }
                    
                    // Analytics tracking
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'whatsapp_click', {
                            event_category: 'Mobile Quick Action',
                            whatsapp_number: whatsapp,
                            location: 'click'
                        });
                    }
                });
            });
            
            // Email links - direkt email uygulaması açılır
            document.querySelectorAll('a[href^="mailto:"], [data-email]').forEach(link => {
                link.addEventListener('click', (e) => {
                    const email = link.getAttribute('href')?.replace('mailto:', '') || 
                                 link.getAttribute('data-email') || 
                                 this.email;
                    
                    // Analytics tracking
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'email_click', {
                            event_category: 'Mobile Quick Action',
                            email: email,
                            location: 'click'
                        });
                    }
                });
            });
            
            // Maps/Address links - direkt maps açılır
            document.querySelectorAll('a[href*="maps"], [data-address], [data-maps]').forEach(link => {
                link.addEventListener('click', (e) => {
                    let mapsUrl = link.getAttribute('href');
                    
                    if (!mapsUrl || !mapsUrl.includes('maps')) {
                        const address = link.getAttribute('data-address') || this.address;
                        mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
                    }
                    
                    // Analytics tracking
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'maps_click', {
                            event_category: 'Mobile Quick Action',
                            address: address,
                            location: 'click'
                        });
                    }
                });
            });
            
            // Auto-detect phone numbers in text and make them clickable
            this.makePhoneNumbersClickable();
            this.makeAddressesClickable();
        },
        
        /**
         * Make phone numbers in text clickable
         */
        makePhoneNumbersClickable() {
            const phoneRegex = /(\+90|0)?[\s]?[5][0-9]{2}[\s]?[0-9]{3}[\s]?[0-9]{2}[\s]?[0-9]{2}/g;
            
            document.querySelectorAll('p, span, div, li').forEach(element => {
                if (element.children.length > 0) return; // Skip if has children
                
                const text = element.textContent || '';
                const matches = text.match(phoneRegex);
                
                if (matches && matches.length > 0) {
                    let html = element.innerHTML;
                    matches.forEach(phone => {
                        const cleanPhone = phone.replace(/\s/g, '').replace('+90', '0');
                        const telLink = `<a href="tel:${cleanPhone}" class="phone-link" aria-label="Telefon: ${phone}">${phone}</a>`;
                        html = html.replace(phone, telLink);
                    });
                    element.innerHTML = html;
                }
            });
        },
        
        /**
         * Make addresses clickable
         */
        makeAddressesClickable() {
            // This can be enhanced to detect addresses in text
            // For now, we focus on existing address elements
        },
        
        /**
         * Sticky WhatsApp Button
         * Her zaman görünür, mobilde hızlı erişim
         */
        initStickyWhatsApp() {
            // Check if sticky button already exists
            if (document.getElementById('sticky-whatsapp')) return;
            
            // Create sticky WhatsApp button
            const stickyBtn = document.createElement('a');
            stickyBtn.id = 'sticky-whatsapp';
            stickyBtn.className = 'sticky-whatsapp-btn';
            stickyBtn.href = `https://wa.me/${this.whatsappNumber}`;
            stickyBtn.target = '_blank';
            stickyBtn.rel = 'noopener noreferrer';
            stickyBtn.setAttribute('aria-label', 'WhatsApp ile iletişime geç');
            
            stickyBtn.innerHTML = `
                <i class="fab fa-whatsapp" aria-hidden="true"></i>
                <span class="sticky-btn-text">WhatsApp</span>
                <span class="sticky-btn-pulse"></span>
            `;
            
            // Add click tracking
            stickyBtn.addEventListener('click', () => {
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'whatsapp_sticky_click', {
                        event_category: 'Mobile Quick Action',
                        whatsapp_number: this.whatsappNumber,
                        location: 'sticky_button'
                    });
                }
                
                // Log to security logger
                if (window.SecurityLogger) {
                    window.SecurityLogger.log('whatsapp_sticky_click', 'low', {
                        number: this.whatsappNumber
                    });
                }
            });
            
            // Append to body
            document.body.appendChild(stickyBtn);
            
            // Show/hide based on scroll position
            let lastScrollTop = 0;
            window.addEventListener('scroll', () => {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const heroHeight = document.querySelector('.hero')?.offsetHeight || 500;
                
                // Hide on scroll up, show on scroll down (after hero)
                if (scrollTop > heroHeight) {
                    if (scrollTop < lastScrollTop) {
                        // Scrolling up - hide
                        stickyBtn.classList.remove('visible');
                    } else {
                        // Scrolling down - show
                        stickyBtn.classList.add('visible');
                    }
                } else {
                    // In hero section - hide
                    stickyBtn.classList.remove('visible');
                }
                
                lastScrollTop = scrollTop;
            }, { passive: true });
            
            // Always show on mobile after initial load
            if (window.MobileEnhancements?.isMobile) {
                setTimeout(() => {
                    stickyBtn.classList.add('visible');
                }, 2000);
            }
        },
        
        /**
         * Native Share API
         * Modern share functionality
         */
        initNativeShare() {
            // Check if Web Share API is supported
            if (!navigator.share) {
                // Fallback: Create share button
                this.createShareButton();
                return;
            }
            
            // Create native share buttons
            this.createNativeShareButtons();
        },
        
        /**
         * Create native share buttons
         */
        createNativeShareButtons() {
            // Find existing share triggers or create new ones
            const shareTriggers = document.querySelectorAll('[data-share], .share-trigger');
            
            shareTriggers.forEach(trigger => {
                trigger.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.handleNativeShare(trigger);
                });
            });
            
            // Add share button to hero section if not exists
            this.addShareButtonToHero();
        },
        
        /**
         * Handle native share
         */
        async handleNativeShare(trigger) {
            const title = trigger.dataset.shareTitle || 
                         document.querySelector('h1')?.textContent || 
                         'DC TEKNİK - Dinamocu Serdar';
            
            const text = trigger.dataset.shareText || 
                        document.querySelector('meta[name="description"]')?.content || 
                        'DC TEKNİK Sultanbeyli\'de profesyonel dinamo tamiri, alternatör onarımı ve marş motoru servisi.';
            
            const url = trigger.dataset.shareUrl || window.location.href;
            
            const shareData = {
                title: title,
                text: text,
                url: url
            };
            
            try {
                await navigator.share(shareData);
                
                // Success tracking
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'share_success', {
                        event_category: 'Social Share',
                        method: 'native',
                        title: title
                    });
                }
            } catch (error) {
                // User cancelled or error
                if (error.name !== 'AbortError') {
                    // Fallback to manual share options
                    this.showShareOptions(shareData);
                }
            }
        },
        
        /**
         * Fallback share options
         */
        showShareOptions(shareData) {
            // Create share modal or use existing
            const shareModal = this.createShareModal(shareData);
            document.body.appendChild(shareModal);
            shareModal.classList.add('active');
            
            // Close on outside click
            shareModal.addEventListener('click', (e) => {
                if (e.target === shareModal) {
                    shareModal.classList.remove('active');
                    setTimeout(() => shareModal.remove(), 300);
                }
            });
        },
        
        /**
         * Create share modal
         */
        createShareModal(shareData) {
            const modal = document.createElement('div');
            modal.className = 'share-modal';
            modal.innerHTML = `
                <div class="share-modal-content">
                    <h3>Paylaş</h3>
                    <div class="share-options">
                        <a href="https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(shareData.text + ' ' + shareData.url)}" 
                           target="_blank" 
                           class="share-option whatsapp" 
                           aria-label="WhatsApp ile paylaş">
                            <i class="fab fa-whatsapp"></i>
                            <span>WhatsApp</span>
                        </a>
                        <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}" 
                           target="_blank" 
                           class="share-option facebook" 
                           aria-label="Facebook ile paylaş">
                            <i class="fab fa-facebook"></i>
                            <span>Facebook</span>
                        </a>
                        <button class="share-option copy-link" 
                                aria-label="Linki kopyala"
                                data-url="${shareData.url}">
                            <i class="fas fa-link"></i>
                            <span>Linki Kopyala</span>
                        </button>
                    </div>
                    <button class="share-modal-close" aria-label="Kapat">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
            
            // Copy link functionality
            const copyBtn = modal.querySelector('.copy-link');
            copyBtn.addEventListener('click', async () => {
                try {
                    await navigator.clipboard.writeText(shareData.url);
                    
                    // Show success message
                    copyBtn.innerHTML = '<i class="fas fa-check"></i><span>Kopyalandı!</span>';
                    setTimeout(() => {
                        copyBtn.innerHTML = '<i class="fas fa-link"></i><span>Linki Kopyala</span>';
                    }, 2000);
                    
                    // Analytics
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'link_copied', {
                            event_category: 'Social Share',
                            method: 'copy'
                        });
                    }
                } catch (error) {
                    console.error('Failed to copy:', error);
                }
            });
            
            // Close button
            modal.querySelector('.share-modal-close').addEventListener('click', () => {
                modal.classList.remove('active');
                setTimeout(() => modal.remove(), 300);
            });
            
            return modal;
        },
        
        /**
         * Add share button to hero
         */
        addShareButtonToHero() {
            const heroButtons = document.querySelector('.hero-buttons');
            if (!heroButtons || document.querySelector('.share-btn-hero')) return;
            
            const shareBtn = document.createElement('button');
            shareBtn.className = 'btn btn-outline btn-large share-btn-hero';
            shareBtn.setAttribute('data-share', 'true');
            shareBtn.setAttribute('aria-label', 'Sayfayı paylaş');
            shareBtn.innerHTML = `
                <i class="fas fa-share-alt" aria-hidden="true"></i>
                <span>Paylaş</span>
            `;
            
            shareBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleNativeShare(shareBtn);
            });
            
            heroButtons.appendChild(shareBtn);
        },
        
        /**
         * Create fallback share button (if no native support)
         */
        createShareButton() {
            // Add share button that opens share modal
            const shareBtn = document.createElement('button');
            shareBtn.className = 'share-btn-fallback';
            shareBtn.setAttribute('aria-label', 'Paylaş');
            shareBtn.innerHTML = '<i class="fas fa-share-alt"></i>';
            
            shareBtn.addEventListener('click', () => {
                const shareData = {
                    title: document.querySelector('h1')?.textContent || 'DC TEKNİK',
                    text: document.querySelector('meta[name="description"]')?.content || '',
                    url: window.location.href
                };
                this.showShareOptions(shareData);
            });
            
            // Add to floating actions or header
            const floatingActions = document.querySelector('.floating-actions .fab-menu');
            if (floatingActions) {
                const shareItem = document.createElement('button');
                shareItem.className = 'fab-item';
                shareItem.setAttribute('aria-label', 'Paylaş');
                shareItem.innerHTML = '<i class="fas fa-share-alt"></i>';
                shareItem.addEventListener('click', () => {
                    const shareData = {
                        title: document.querySelector('h1')?.textContent || 'DC TEKNİK',
                        text: document.querySelector('meta[name="description"]')?.content || '',
                        url: window.location.href
                    };
                    this.showShareOptions(shareData);
                });
                floatingActions.appendChild(shareItem);
            }
        },
        
        /**
         * Smart CTAs
         * Scroll-based CTA visibility
         */
        initSmartCTAs() {
            // Show/hide CTAs based on scroll position
            // This is already handled by sticky WhatsApp, but we can enhance
        }
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => MobileQuickWins.init());
    } else {
        MobileQuickWins.init();
    }

    // Export globally
    window.MobileQuickWins = MobileQuickWins;
})();

