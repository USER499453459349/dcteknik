/**
 * DC TEKNİK - Blog Improvements
 * URL Hash Handling, Category Filter URL Sync, Analytics Tracking, Query Parameters
 */

(function() {
    'use strict';
    
    // ========================================
    // URL HASH HANDLING (Auto-scroll to article)
    // ========================================
    
    function initHashHandling() {
        function scrollToHash() {
            const hash = window.location.hash;
            if (!hash) return;
            
            const targetId = hash.slice(1); // Remove #
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // Wait for page to fully load
                setTimeout(() => {
                    const offset = 100; // Header height
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Highlight briefly
                    targetElement.classList.add('highlight-post');
                    setTimeout(() => {
                        targetElement.classList.remove('highlight-post');
                    }, 2000);
                }, 300);
            }
        }
        
        // Handle initial hash
        if (window.location.hash) {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', scrollToHash);
            } else {
                scrollToHash();
            }
        }
        
        // Handle hash changes (back/forward navigation)
        window.addEventListener('hashchange', scrollToHash);
    }
    
    // ========================================
    // CATEGORY FILTER URL SYNC
    // ========================================
    
    function initCategoryFilterURLSync() {
        const categoryChips = document.querySelectorAll('.blog-chip');
        const urlParams = new URLSearchParams(window.location.search);
        const categoryFromURL = urlParams.get('category');
        
        // Set active category from URL on load
        if (categoryFromURL) {
            categoryChips.forEach(chip => {
                if (chip.dataset.category === categoryFromURL) {
                    chip.classList.add('active');
                    // Trigger filter
                    chip.click();
                } else {
                    chip.classList.remove('active');
                }
            });
        }
        
        // Update URL when category changes
        categoryChips.forEach(chip => {
            const originalClick = chip.onclick || (() => {});
            
            chip.addEventListener('click', function() {
                const category = this.dataset.category;
                
                // Update URL without reload
                const url = new URL(window.location);
                if (category === 'all') {
                    url.searchParams.delete('category');
                } else {
                    url.searchParams.set('category', category);
                }
                
                window.history.pushState({ category }, '', url);
                
                // Track analytics
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'blog_filter_category', {
                        event_category: 'blog',
                        event_label: category,
                        value: 1
                    });
                }
            });
        });
        
        // Handle browser back/forward
        window.addEventListener('popstate', (e) => {
            const urlParams = new URLSearchParams(window.location.search);
            const category = urlParams.get('category');
            
            categoryChips.forEach(chip => {
                if (category && chip.dataset.category === category) {
                    chip.classList.add('active');
                    chip.click();
                } else if (!category && chip.dataset.category === 'all') {
                    chip.classList.add('active');
                    chip.click();
                } else {
                    chip.classList.remove('active');
                }
            });
        });
    }
    
    // ========================================
    // ANALYTICS TRACKING
    // ========================================
    
    function initAnalyticsTracking() {
        // Track search
        const searchInput = document.getElementById('blogSearch');
        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', function(e) {
                clearTimeout(searchTimeout);
                const searchTerm = e.target.value.trim();
                
                if (searchTerm.length >= 3) {
                    searchTimeout = setTimeout(() => {
                        if (typeof gtag !== 'undefined') {
                            gtag('event', 'blog_search', {
                                event_category: 'blog',
                                event_label: searchTerm,
                                value: searchTerm.length
                            });
                        }
                    }, 500); // Debounce 500ms
                }
            });
        }
        
        // Track pagination
        const prevBtn = document.getElementById('prevPage');
        const nextBtn = document.getElementById('nextPage');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'blog_pagination', {
                        event_category: 'blog',
                        event_label: 'previous',
                        value: 1
                    });
                }
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'blog_pagination', {
                        event_category: 'blog',
                        event_label: 'next',
                        value: 1
                    });
                }
            });
        }
        
        // Track bookmark (from bookmark.js)
        document.addEventListener('click', (e) => {
            if (e.target.closest('.bookmark-btn')) {
                const button = e.target.closest('.bookmark-btn');
                const isBookmarked = button.classList.contains('bookmarked');
                
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'blog_bookmark', {
                        event_category: 'blog',
                        event_label: button.dataset.postId || 'unknown',
                        value: isBookmarked ? 0 : 1 // 1 = added, 0 = removed
                    });
                }
            }
        });
        
        // Track Previous/Next navigation
        document.addEventListener('click', (e) => {
            const navLink = e.target.closest('.post-nav-link');
            if (navLink) {
                const rel = navLink.getAttribute('rel');
                
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'blog_navigation', {
                        event_category: 'blog',
                        event_label: rel || 'unknown',
                        value: 1
                    });
                }
            }
        });
        
        // Track empty state reset
        document.addEventListener('click', (e) => {
            if (e.target.closest('.empty-state-reset')) {
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'blog_empty_state_reset', {
                        event_category: 'blog',
                        event_label: 'filter_reset',
                        value: 1
                    });
                }
            }
        });
    }
    
    // ========================================
    // NEWSLETTER FORM IMPROVEMENTS
    // ========================================
    
    function improveNewsletterForm() {
        const newsletterForm = document.getElementById('newsletter-form');
        if (!newsletterForm) return;
        
        const emailInput = newsletterForm.querySelector('input[type="email"]');
        const submitButton = newsletterForm.querySelector('button[type="submit"]');
        
        // Email validation
        function validateEmail(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        }
        
        // Show validation feedback
        if (emailInput) {
            emailInput.addEventListener('blur', function() {
                const email = this.value.trim();
                
                if (email && !validateEmail(email)) {
                    this.setCustomValidity('Lütfen geçerli bir e-posta adresi girin');
                    this.style.borderColor = '#ef4444';
                } else {
                    this.setCustomValidity('');
                    this.style.borderColor = '';
                }
            });
            
            emailInput.addEventListener('input', function() {
                if (this.style.borderColor === 'rgb(239, 68, 68)') {
                    const email = this.value.trim();
                    if (validateEmail(email)) {
                        this.setCustomValidity('');
                        this.style.borderColor = '';
                    }
                }
            });
        }
        
        // Enhanced form submission
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = emailInput?.value.trim() || '';
            
            if (!email || !validateEmail(email)) {
                if (typeof window.showToast === 'function') {
                    window.showToast('Lütfen geçerli bir e-posta adresi girin', 'error');
                } else {
                    alert('Lütfen geçerli bir e-posta adresi girin');
                }
                return;
            }
            
            // Disable button during submission
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = 'Gönderiliyor...';
            }
            
            // Save to localStorage
            const subscriptions = JSON.parse(localStorage.getItem('blog_newsletter_subscriptions') || '[]');
            if (!subscriptions.includes(email)) {
                subscriptions.push({
                    email: email,
                    date: new Date().toISOString(),
                    source: 'blog'
                });
                localStorage.setItem('blog_newsletter_subscriptions', JSON.stringify(subscriptions));
            }
            
            // Track analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'newsletter_signup', {
                    event_category: 'blog',
                    event_label: 'newsletter',
                    value: 1
                });
            }
            
            // Show success message
            setTimeout(() => {
                if (typeof window.showToast === 'function') {
                    window.showToast('✅ Teşekkürler! Newsletter\'a başarıyla abone oldunuz.', 'success');
                } else {
                    alert('Teşekkürler! Newsletter\'a başarıyla abone oldunuz.');
                }
                
                // Reset form
                newsletterForm.reset();
                
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = 'Abone Ol';
                }
            }, 500);
        });
    }
    
    // ========================================
    // QUERY PARAMETER HANDLING
    // ========================================
    
    function initQueryParameterHandling() {
        const urlParams = new URLSearchParams(window.location.search);
        
        // Handle category parameter (already handled in initCategoryFilterURLSync)
        // Handle search parameter
        const searchTerm = urlParams.get('search');
        if (searchTerm) {
            const searchInput = document.getElementById('blogSearch');
            if (searchInput) {
                searchInput.value = searchTerm;
                // Trigger search
                searchInput.dispatchEvent(new Event('input', { bubbles: true }));
            }
        }
        
        // Update search URL when user searches
        const searchInput = document.getElementById('blogSearch');
        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', function(e) {
                clearTimeout(searchTimeout);
                const searchTerm = e.target.value.trim();
                
                searchTimeout = setTimeout(() => {
                    const url = new URL(window.location);
                    if (searchTerm) {
                        url.searchParams.set('search', searchTerm);
                    } else {
                        url.searchParams.delete('search');
                    }
                    window.history.replaceState({}, '', url);
                }, 500);
            });
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
        
        console.log('🔧 Blog Improvements initializing...');
        
        initHashHandling();
        initCategoryFilterURLSync();
        initAnalyticsTracking();
        improveNewsletterForm();
        initQueryParameterHandling();
        
        console.log('✅ Blog Improvements initialized!');
    }
    
    init();
})();

