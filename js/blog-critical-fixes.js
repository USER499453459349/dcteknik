/**
 * DC TEKNİK - Blog Critical Fixes
 * Schema Markup, Previous/Next Navigation, Empty States
 */

(function() {
    'use strict';
    
    // ========================================
    // SCHEMA MARKUP GENERATOR
    // ========================================
    
    function generateSchemaMarkup() {
        const articles = document.querySelectorAll('article[itemscope]');
        
        articles.forEach(article => {
            const postId = article.id;
            if (!postId) return;
            
            // Extract data
            const headline = article.querySelector('[itemprop="headline"]')?.textContent.trim() || 
                           article.querySelector('h2')?.textContent.trim() || '';
            const datePublished = article.querySelector('[itemprop="datePublished"]')?.getAttribute('datetime') || 
                                article.querySelector('time')?.getAttribute('datetime') || '';
            const authorName = article.querySelector('[itemprop="author"]')?.textContent.trim() || 
                             'Dinamocu Serdar';
            const articleBody = article.querySelector('[itemprop="articleBody"]');
            const description = articleBody?.querySelector('p')?.textContent.trim().substring(0, 160) || 
                              headline + ' - DC TEKNİK uzman yazısı';
            const category = article.querySelector('.blog-category')?.textContent.trim() || '';
            const readTime = article.querySelector('.read-time')?.textContent || '';
            
            // Extract image
            let imageUrl = article.querySelector('img')?.getAttribute('src') || '';
            if (!imageUrl) {
                imageUrl = 'https://dctenık.com/logo-new.svg';
            } else if (imageUrl.startsWith('//') || imageUrl.startsWith('/')) {
                imageUrl = 'https://dctenık.com' + (imageUrl.startsWith('/') ? '' : '/') + imageUrl;
            }
            
            // Build URL
            const url = `https://dctenık.com/blog.html#${postId}`;
            
            // Create JSON-LD script
            const schemaScript = document.createElement('script');
            schemaScript.type = 'application/ld+json';
            schemaScript.textContent = JSON.stringify({
                "@context": "https://schema.org",
                "@type": "BlogPosting",
                "headline": headline,
                "description": description,
                "image": imageUrl,
                "datePublished": datePublished,
                "dateModified": datePublished,
                "author": {
                    "@type": "Organization",
                    "name": authorName,
                    "url": "https://dctenık.com"
                },
                "publisher": {
                    "@type": "Organization",
                    "name": "DC TEKNİK",
                    "logo": {
                        "@type": "ImageObject",
                        "url": "https://dctenık.com/logo-new.svg"
                    },
                    "url": "https://dctenık.com"
                },
                "mainEntityOfPage": {
                    "@type": "WebPage",
                    "@id": url
                },
                "articleSection": category,
                "keywords": [category, "dinamo tamiri", "alternatör bakımı", "marş motoru"],
                "inLanguage": "tr-TR",
                "isAccessibleForFree": true
            });
            
            // Remove existing schema if any
            const existingSchema = article.querySelector('script[type="application/ld+json"]');
            if (existingSchema) {
                existingSchema.remove();
            }
            
            // Insert schema
            article.insertBefore(schemaScript, article.firstChild);
        });
    }
    
    // ========================================
    // PREVIOUS/NEXT NAVIGATION
    // ========================================
    
    function addPreviousNextNavigation() {
        const articles = document.querySelectorAll('article[itemscope]');
        
        articles.forEach((article, index) => {
            const prevArticle = index > 0 ? articles[index - 1] : null;
            const nextArticle = index < articles.length - 1 ? articles[index + 1] : null;
            
            // Check if navigation already exists
            if (article.querySelector('.post-navigation')) return;
            
            // Create navigation
            const navigation = document.createElement('nav');
            navigation.className = 'post-navigation';
            navigation.setAttribute('aria-label', 'Yazı navigasyonu');
            
            let navHTML = '<div class="post-nav-container">';
            
            if (prevArticle) {
                const prevTitle = prevArticle.querySelector('h2')?.textContent.trim() || 'Önceki Yazı';
                const prevId = prevArticle.id || '';
                navHTML += `
                    <a href="blog.html#${prevId}" class="post-nav-link post-nav-prev" rel="prev">
                        <div class="post-nav-icon"><i class="fas fa-chevron-left"></i></div>
                        <div class="post-nav-content">
                            <span class="post-nav-label">Önceki Yazı</span>
                            <span class="post-nav-title">${prevTitle}</span>
                        </div>
                    </a>
                `;
            } else {
                navHTML += '<div class="post-nav-link post-nav-prev disabled"></div>';
            }
            
            if (nextArticle) {
                const nextTitle = nextArticle.querySelector('h2')?.textContent.trim() || 'Sonraki Yazı';
                const nextId = nextArticle.id || '';
                navHTML += `
                    <a href="blog.html#${nextId}" class="post-nav-link post-nav-next" rel="next">
                        <div class="post-nav-content">
                            <span class="post-nav-label">Sonraki Yazı</span>
                            <span class="post-nav-title">${nextTitle}</span>
                        </div>
                        <div class="post-nav-icon"><i class="fas fa-chevron-right"></i></div>
                    </a>
                `;
            } else {
                navHTML += '<div class="post-nav-link post-nav-next disabled"></div>';
            }
            
            navHTML += '</div>';
            navigation.innerHTML = navHTML;
            
            // Insert after article (before related posts if exists)
            const relatedSection = article.nextElementSibling;
            if (relatedSection && relatedSection.classList.contains('related-posts-section')) {
                article.parentElement.insertBefore(navigation, relatedSection);
            } else {
                article.parentElement.insertBefore(navigation, article.nextSibling);
            }
        });
    }
    
    // ========================================
    // EMPTY STATES
    // ========================================
    
    function addEmptyStates() {
        const grid = document.getElementById('blogGrid');
        if (!grid) return;
        
        // Create empty state for search
        const searchEmptyState = document.createElement('div');
        searchEmptyState.className = 'empty-state search-empty-state';
        searchEmptyState.style.display = 'none';
        searchEmptyState.innerHTML = `
            <div class="empty-state-icon">🔍</div>
            <h3>Aradığınız yazı bulunamadı</h3>
            <p>Farklı anahtar kelimeler deneyin veya kategori filtrelerini kullanın.</p>
            <button class="btn btn-primary empty-state-reset">Filtreleri Temizle</button>
        `;
        
        grid.parentElement.insertBefore(searchEmptyState, grid.nextSibling);
        
        // Create empty state for pagination (if needed)
        const paginationEmptyState = document.createElement('div');
        paginationEmptyState.className = 'empty-state pagination-empty-state';
        paginationEmptyState.style.display = 'none';
        paginationEmptyState.innerHTML = `
            <div class="empty-state-icon">📄</div>
            <h3>Bu sayfada yazı yok</h3>
            <p>Lütfen önceki sayfalara dönün.</p>
        `;
        
        grid.parentElement.insertBefore(paginationEmptyState, searchEmptyState.nextSibling);
        
        // Update search functionality
        const searchInput = document.getElementById('blogSearch');
        const posts = Array.from(grid.querySelectorAll('.blog-post'));
        
        function checkEmptyState() {
            const visiblePosts = posts.filter(post => post.style.display !== 'none');
            
            if (visiblePosts.length === 0) {
                searchEmptyState.style.display = 'block';
                grid.style.display = 'none';
            } else {
                searchEmptyState.style.display = 'none';
                grid.style.display = '';
            }
        }
        
        // Enhanced search with empty state
        if (searchInput) {
            const originalHandler = searchInput.oninput;
            searchInput.addEventListener('input', function(e) {
                const searchTerm = e.target.value.toLowerCase().trim();
                
                if (searchTerm === '') {
                    // Reset to show all posts
                    posts.forEach(post => post.style.display = '');
                    checkEmptyState();
                    return;
                }
                
                posts.forEach(post => {
                    const text = post.textContent.toLowerCase();
                    const title = post.querySelector('h2')?.textContent.toLowerCase() || '';
                    const content = post.querySelector('p')?.textContent.toLowerCase() || '';
                    
                    if (title.includes(searchTerm) || content.includes(searchTerm) || text.includes(searchTerm)) {
                        post.style.display = '';
                    } else {
                        post.style.display = 'none';
                    }
                });
                
                checkEmptyState();
            });
        }
        
        // Reset button
        const resetBtn = searchEmptyState.querySelector('.empty-state-reset');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                if (searchInput) searchInput.value = '';
                posts.forEach(post => post.style.display = '');
                
                // Reset category filters
                document.querySelectorAll('.blog-chip').forEach(chip => {
                    chip.classList.remove('active');
                    if (chip.dataset.category === 'all') {
                        chip.classList.add('active');
                    }
                });
                
                checkEmptyState();
                
                // Scroll to top
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
        
        // Check category filter for empty state
        const categoryChips = document.querySelectorAll('.blog-chip');
        categoryChips.forEach(chip => {
            chip.addEventListener('click', function() {
                setTimeout(checkEmptyState, 100);
            });
        });
    }
    
    // ========================================
    // ADD ALT TEXT TO PLACEHOLDERS
    // ========================================
    
    function addAltTextToPlaceholders() {
        const placeholders = document.querySelectorAll('.blog-placeholder');
        
        placeholders.forEach(placeholder => {
            const article = placeholder.closest('article');
            if (!article) return;
            
            const title = article.querySelector('h2')?.textContent || '';
            const category = article.querySelector('.blog-category')?.textContent || '';
            
            // Convert placeholder to image with proper alt text
            const imageContainer = placeholder.parentElement;
            if (imageContainer && !imageContainer.querySelector('img')) {
                // Add aria-label for accessibility
                placeholder.setAttribute('aria-label', `${title} - ${category} blog yazısı görseli`);
                placeholder.setAttribute('role', 'img');
            }
        });
        
        // Also add alt to existing images
        document.querySelectorAll('.blog-post-image img').forEach(img => {
            if (!img.alt || img.alt === '') {
                const article = img.closest('article');
                if (article) {
                    const title = article.querySelector('h2')?.textContent || '';
                    const category = article.querySelector('.blog-category')?.textContent || '';
                    img.alt = `${title} - ${category} görseli`;
                }
            }
        });
    }
    
    // ========================================
    // INITIALIZE
    // ========================================
    
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }
        
        console.log('🔧 Blog Critical Fixes initializing...');
        
        // Run fixes
        generateSchemaMarkup();
        addPreviousNextNavigation();
        addEmptyStates();
        addAltTextToPlaceholders();
        
        console.log('✅ Blog Critical Fixes completed!');
    }
    
    init();
})();




