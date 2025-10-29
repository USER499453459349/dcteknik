/**
 * DC TEKNİK - Blog UX Enhancements
 * Kullanıcı deneyimini geliştiren kapsamlı sistem
 */

class BlogUXEnhancements {
    constructor() {
        this.init();
        this.setupReadingProgress();
        this.setupDarkMode();
        this.setupFontSizeControls();
        this.setupTableOfContents();
        this.setupBackToTop();
        this.setupSmoothScrolling();
        this.setupSocialSharing();
        this.setupBookmarkSystem();
        this.setupPrintFunctionality();
        this.setupMobileGestures();
        this.setupAccessibility();
    }

    init() {
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log('🎨 Blog UX Enhancements başlatıldı');
        }
        this.createUIElements();
        this.setupEventListeners();
    }

    /**
     * UI Elementlerini oluştur
     */
    createUIElements() {
        this.createReadingProgressBar();
        this.createDarkModeToggle();
        this.createFontSizeControls();
        this.createBackToTopButton();
        this.createTableOfContents();
        this.createSocialSharingPanel();
        this.createBookmarkButton();
        this.createPrintButton();
    }

    /**
     * Okuma İlerlemesi Göstergesi
     */
    setupReadingProgress() {
        const progressBar = document.createElement('div');
        progressBar.id = 'reading-progress';
        progressBar.innerHTML = '<div class="progress-fill"></div>';
        document.body.appendChild(progressBar);

        const progressFill = progressBar.querySelector('.progress-fill');
        
        window.addEventListener('scroll', this.throttle(() => {
            const article = document.querySelector('article') || document.querySelector('.blog-post-detail');
            if (!article) return;

            const articleTop = article.offsetTop;
            const articleHeight = article.offsetHeight;
            const windowHeight = window.innerHeight;
            const scrollTop = window.pageYOffset;
            
            const progress = Math.min(
                Math.max((scrollTop - articleTop + windowHeight) / articleHeight, 0),
                1
            );
            
            progressFill.style.width = `${progress * 100}%`;
        }, 16));
    }

    createReadingProgressBar() {
        const style = document.createElement('style');
        style.textContent = `
            #reading-progress {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 4px;
                background: rgba(0, 0, 0, 0.1);
                z-index: 10000;
                pointer-events: none;
            }
            #reading-progress .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #ff6b35, #ff8c42);
                width: 0%;
                transition: width 0.1s ease;
                box-shadow: 0 0 10px rgba(255, 107, 53, 0.5);
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Dark Mode Toggle
     */
    setupDarkMode() {
        const darkModeToggle = document.createElement('button');
        darkModeToggle.id = 'dark-mode-toggle';
        darkModeToggle.innerHTML = '🌙';
        darkModeToggle.title = 'Dark Mode';
        darkModeToggle.className = 'ux-control-btn';
        
        // Local storage'dan dark mode durumunu al
        const isDarkMode = localStorage.getItem('darkMode') === 'true';
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
            darkModeToggle.innerHTML = '☀️';
        }

        darkModeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            darkModeToggle.innerHTML = isDark ? '☀️' : '🌙';
            localStorage.setItem('darkMode', isDark);
        });

        document.body.appendChild(darkModeToggle);
    }

    /**
     * Font Boyutu Kontrolleri
     */
    setupFontSizeControls() {
        const fontSizeControls = document.createElement('div');
        fontSizeControls.id = 'font-size-controls';
        fontSizeControls.className = 'ux-controls';
        fontSizeControls.innerHTML = `
            <button id="font-decrease" class="ux-control-btn" title="Yazı Boyutunu Küçült">A-</button>
            <span id="font-size-display">100%</span>
            <button id="font-increase" class="ux-control-btn" title="Yazı Boyutunu Büyüt">A+</button>
            <button id="font-reset" class="ux-control-btn" title="Varsayılan Boyut">A</button>
        `;

        document.body.appendChild(fontSizeControls);

        let currentFontSize = parseInt(localStorage.getItem('fontSize')) || 100;

        document.getElementById('font-decrease').addEventListener('click', () => {
            currentFontSize = Math.max(currentFontSize - 10, 70);
            this.updateFontSize(currentFontSize);
        });

        document.getElementById('font-increase').addEventListener('click', () => {
            currentFontSize = Math.min(currentFontSize + 10, 150);
            this.updateFontSize(currentFontSize);
        });

        document.getElementById('font-reset').addEventListener('click', () => {
            currentFontSize = 100;
            this.updateFontSize(currentFontSize);
        });

        this.updateFontSize(currentFontSize);
    }

    updateFontSize(size) {
        document.documentElement.style.fontSize = `${size}%`;
        document.getElementById('font-size-display').textContent = `${size}%`;
        localStorage.setItem('fontSize', size);
    }

    /**
     * Table of Contents
     */
    setupTableOfContents() {
        const article = document.querySelector('article') || document.querySelector('.blog-post-detail');
        if (!article) return;

        const headings = article.querySelectorAll('h2, h3, h4');
        if (headings.length < 2) return;

        const toc = document.createElement('div');
        toc.id = 'table-of-contents';
        toc.className = 'toc-widget';
        toc.innerHTML = `
            <div class="toc-header">
                <h3>📋 İçindekiler</h3>
                <button class="toc-toggle">−</button>
            </div>
            <div class="toc-content">
                <ul class="toc-list"></ul>
            </div>
        `;

        const tocList = toc.querySelector('.toc-list');
        
        headings.forEach((heading, index) => {
            const id = `heading-${index}`;
            heading.id = id;
            
            const li = document.createElement('li');
            li.className = `toc-item toc-${heading.tagName.toLowerCase()}`;
            li.innerHTML = `<a href="#${id}">${heading.textContent}</a>`;
            tocList.appendChild(li);
        });

        // TOC'u sidebar'a ekle veya floating widget olarak göster
        const sidebar = document.querySelector('.blog-sidebar');
        if (sidebar) {
            sidebar.insertBefore(toc, sidebar.firstChild);
        } else {
            toc.style.position = 'fixed';
            toc.style.top = '100px';
            toc.style.right = '20px';
            toc.style.width = '300px';
            toc.style.zIndex = '1000';
            document.body.appendChild(toc);
        }

        // TOC toggle
        const toggle = toc.querySelector('.toc-toggle');
        const content = toc.querySelector('.toc-content');
        toggle.addEventListener('click', () => {
            content.style.display = content.style.display === 'none' ? 'block' : 'none';
            toggle.textContent = content.style.display === 'none' ? '+' : '−';
        });
    }

    /**
     * Back to Top Button
     */
    setupBackToTop() {
        const backToTop = document.createElement('button');
        backToTop.id = 'back-to-top';
        backToTop.innerHTML = '↑';
        backToTop.title = 'Yukarı Çık';
        backToTop.className = 'ux-control-btn back-to-top';
        
        document.body.appendChild(backToTop);

        window.addEventListener('scroll', this.throttle(() => {
            if (window.pageYOffset > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }, 100));

        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    /**
     * Smooth Scrolling
     */
    setupSmoothScrolling() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('a[href^="#"]')) {
                e.preventDefault();
                const targetId = e.target.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    }

    /**
     * Sosyal Paylaşım İyileştirmeleri
     */
    setupSocialSharing() {
        const shareButtons = document.querySelectorAll('.share-btn');
        
        shareButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const platform = button.dataset.platform || button.className.match(/share-btn\s+(\w+)/)?.[1];
                this.shareContent(platform);
            });
        });
    }

    shareContent(platform) {
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent(document.title);
        const text = encodeURIComponent(document.querySelector('meta[name="description"]')?.content || '');

        let shareUrl = '';

        switch (platform) {
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                break;
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
                break;
            case 'whatsapp':
                shareUrl = `https://wa.me/?text=${title}%20${url}`;
                break;
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
                break;
            case 'copy':
                navigator.clipboard.writeText(window.location.href).then(() => {
                    this.showNotification('Link kopyalandı!');
                });
                return;
        }

        if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400');
        }
    }

    /**
     * Bookmark Sistemi
     */
    setupBookmarkSystem() {
        const bookmarkButton = document.createElement('button');
        bookmarkButton.id = 'bookmark-btn';
        bookmarkButton.innerHTML = '🔖';
        bookmarkButton.title = 'Yer İmi Ekle/Çıkar';
        bookmarkButton.className = 'ux-control-btn bookmark-btn';
        
        // Bookmark durumunu kontrol et
        const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
        const currentUrl = window.location.href;
        const isBookmarked = bookmarks.includes(currentUrl);
        
        if (isBookmarked) {
            bookmarkButton.classList.add('bookmarked');
            bookmarkButton.innerHTML = '🔖';
        }

        bookmarkButton.addEventListener('click', () => {
            const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
            const currentUrl = window.location.href;
            
            if (bookmarks.includes(currentUrl)) {
                const index = bookmarks.indexOf(currentUrl);
                bookmarks.splice(index, 1);
                bookmarkButton.classList.remove('bookmarked');
                this.showNotification('Yer imi kaldırıldı');
            } else {
                bookmarks.push(currentUrl);
                bookmarkButton.classList.add('bookmarked');
                this.showNotification('Yer imi eklendi');
            }
            
            localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
        });

        document.body.appendChild(bookmarkButton);
    }

    /**
     * Print Functionality
     */
    setupPrintFunctionality() {
        const printButton = document.createElement('button');
        printButton.id = 'print-btn';
        printButton.innerHTML = '🖨️';
        printButton.title = 'Yazdır';
        printButton.className = 'ux-control-btn print-btn';
        
        printButton.addEventListener('click', () => {
            window.print();
        });

        document.body.appendChild(printButton);
    }

    /**
     * Mobil Gesture Desteği
     */
    setupMobileGestures() {
        let startY = 0;
        let startX = 0;

        document.addEventListener('touchstart', (e) => {
            startY = e.touches[0].clientY;
            startX = e.touches[0].clientX;
        });

        document.addEventListener('touchend', (e) => {
            const endY = e.changedTouches[0].clientY;
            const endX = e.changedTouches[0].clientX;
            const diffY = startY - endY;
            const diffX = startX - endX;

            // Swipe up - back to top
            if (Math.abs(diffY) > Math.abs(diffX) && diffY > 50) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
            
            // Swipe down - scroll down
            if (Math.abs(diffY) > Math.abs(diffX) && diffY < -50) {
                window.scrollBy({ top: 300, behavior: 'smooth' });
            }
        });
    }

    /**
     * Accessibility İyileştirmeleri
     */
    setupAccessibility() {
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            // ESC - Close modals/panels
            if (e.key === 'Escape') {
                this.closeAllPanels();
            }
            
            // Space/Enter - Toggle controls
            if (e.key === ' ' || e.key === 'Enter') {
                if (e.target.matches('.ux-control-btn')) {
                    e.preventDefault();
                    e.target.click();
                }
            }
        });

        // Focus management
        const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                const focusable = document.querySelectorAll(focusableElements);
                const firstFocusable = focusable[0];
                const lastFocusable = focusable[focusable.length - 1];

                if (e.shiftKey) {
                    if (document.activeElement === firstFocusable) {
                        lastFocusable.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastFocusable) {
                        firstFocusable.focus();
                        e.preventDefault();
                    }
                }
            }
        });
    }

    /**
     * Event Listeners
     */
    setupEventListeners() {
        // Resize event
        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 250));

        // Visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAnimations();
            } else {
                this.resumeAnimations();
            }
        });
    }

    /**
     * Utility Functions
     */
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'ux-notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    closeAllPanels() {
        const panels = document.querySelectorAll('.toc-content, .social-panel');
        panels.forEach(panel => {
            panel.style.display = 'none';
        });
    }

    handleResize() {
        // Responsive adjustments
        const toc = document.getElementById('table-of-contents');
        if (toc && window.innerWidth < 768) {
            toc.style.position = 'static';
            toc.style.width = '100%';
        }
    }

    pauseAnimations() {
        document.body.style.animationPlayState = 'paused';
    }

    resumeAnimations() {
        document.body.style.animationPlayState = 'running';
    }
}

// UX Enhancements'ı başlat
document.addEventListener('DOMContentLoaded', () => {
    new BlogUXEnhancements();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BlogUXEnhancements;
}

