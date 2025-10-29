/**
 * DC TEKNİK - Blog Enhancements
 * Blog özelliklerini güçlendiren JavaScript
 */

(function() {
    'use strict';
    
    // Reading Progress Bar
    function initReadingProgress() {
        const progressBar = document.createElement('div');
        progressBar.id = 'reading-progress';
        progressBar.innerHTML = '<div class="progress-fill"></div>';
        document.body.appendChild(progressBar);
        
        window.addEventListener('scroll', () => {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
            
            const fill = progressBar.querySelector('.progress-fill');
            if (fill) {
                fill.style.width = Math.min(scrollPercent, 100) + '%';
            }
        });
    }
    
    // Estimated Reading Time
    function calculateReadingTime() {
        const articles = document.querySelectorAll('article[itemscope]');
        
        articles.forEach(article => {
            const text = article.textContent || '';
            const words = text.trim().split(/\s+/).length;
            const readingTime = Math.ceil(words / 200); // 200 kelime/dakika
            
            const meta = article.querySelector('.blog-meta');
            if (meta) {
                const readTimeElement = meta.querySelector('.read-time');
                if (readTimeElement) {
                    readTimeElement.textContent = `${readingTime} dk okuma`;
                } else {
                    const timeSpan = document.createElement('span');
                    timeSpan.className = 'read-time';
                    timeSpan.innerHTML = `<i class="fas fa-clock"></i> ${readingTime} dk okuma`;
                    meta.appendChild(timeSpan);
                }
            }
        });
    }
    
    // Social Share Buttons
    function initSocialShare() {
        const shareButtons = document.querySelectorAll('.share-btn');
        
        shareButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const platform = this.dataset.platform;
                const url = encodeURIComponent(window.location.href);
                const title = encodeURIComponent(document.title);
                const text = encodeURIComponent(document.querySelector('meta[name="description"]')?.content || '');
                
                let shareUrl = '';
                
                switch(platform) {
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
                        shareUrl = `https://www.linkedin.com/shareArticle?url=${url}&title=${title}`;
                        break;
                    case 'copy':
                        navigator.clipboard.writeText(window.location.href).then(() => {
                            showToast('Link kopyalandı!', 'success');
                        });
                        return;
                }
                
                if (shareUrl) {
                    window.open(shareUrl, '_blank', 'width=600,height=400');
                }
            });
        });
    }
    
    // Back to Top Button
    function initBackToTop() {
        const btn = document.createElement('button');
        btn.id = 'back-to-top';
        btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        btn.setAttribute('aria-label', 'Yukarı git');
        document.body.appendChild(btn);
        
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                btn.classList.add('visible');
            } else {
                btn.classList.remove('visible');
            }
        });
        
        btn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Print Button
    function initPrintButton() {
        const printBtns = document.querySelectorAll('.print-btn');
        printBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                window.print();
            });
        });
    }
    
    // Related Posts (basit algoritma)
    function showRelatedPosts() {
        const currentCategory = document.querySelector('.blog-post.featured .blog-category')?.textContent.toLowerCase() || '';
        const allPosts = Array.from(document.querySelectorAll('.blog-post'));
        
        if (allPosts.length <= 1) return;
        
        const relatedPosts = allPosts
            .filter(post => {
                const postCategory = post.querySelector('.blog-category')?.textContent.toLowerCase() || '';
                return postCategory.includes(currentCategory) && !post.classList.contains('featured');
            })
            .slice(0, 3);
        
        if (relatedPosts.length > 0) {
            const relatedSection = document.createElement('section');
            relatedSection.className = 'related-posts';
            relatedSection.innerHTML = `
                <div class="container">
                    <h2>📚 İlgili Yazılar</h2>
                    <div class="related-posts-grid">
                        ${relatedPosts.map(post => {
                            const title = post.querySelector('h2 a')?.textContent || '';
                            const link = post.querySelector('h2 a')?.href || '#';
                            const excerpt = post.querySelector('.blog-post-content p')?.textContent || '';
                            const category = post.querySelector('.blog-category')?.textContent || '';
                            
                            return `
                                <article class="related-post-card">
                                    <div class="related-post-category">${category}</div>
                                    <h3><a href="${link}">${title}</a></h3>
                                    <p>${excerpt.substring(0, 120)}...</p>
                                    <a href="${link}" class="read-more">Devamını Oku <i class="fas fa-arrow-right"></i></a>
                                </article>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;
            
            // İlk article'dan sonra ekle
            const firstArticle = document.querySelector('article[itemscope]');
            if (firstArticle && firstArticle.parentElement) {
                firstArticle.parentElement.insertBefore(relatedSection, firstArticle.nextSibling);
            }
        }
    }
    
    // Newsletter Signup
    function initNewsletter() {
        const newsletterForm = document.getElementById('newsletter-form');
        if (!newsletterForm) return;
        
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]')?.value;
            
            if (email) {
                // Burada email servisi entegrasyonu yapılabilir
                showToast('Teşekkürler! Newsletter\'a abone oldunuz.', 'success');
                this.reset();
            }
        });
    }
    
    // View Counter (LocalStorage ile)
    function incrementViewCount(postId) {
        if (!postId) return;
        
        const key = `post_views_${postId}`;
        const views = parseInt(localStorage.getItem(key) || '0') + 1;
        localStorage.setItem(key, views.toString());
        
        const viewElement = document.querySelector(`[data-post-id="${postId}"] .view-count`);
        if (viewElement) {
            viewElement.textContent = `${views} görüntüleme`;
        }
    }
    
    // Tags System
    function initTags() {
        const tagButtons = document.querySelectorAll('.tag-btn');
        tagButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const tag = this.textContent.trim();
                const posts = document.querySelectorAll('.blog-post');
                
                posts.forEach(post => {
                    const postTags = post.dataset.tags?.split(',') || [];
                    if (postTags.includes(tag) || tag === 'Tümü') {
                        post.style.display = '';
                    } else {
                        post.style.display = 'none';
                    }
                });
                
                // Update active tag
                tagButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }
    
    // Lazy Load Images
    function initImageLazyLoad() {
        const images = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
        } else {
            images.forEach(img => {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            });
        }
    }
    
    // Toast Notification (UX enhancements'dan)
    function showToast(message, type = 'info') {
        if (typeof window.showToast === 'function') {
            window.showToast(message, type);
        } else {
            console.log(`[${type.toUpperCase()}] ${message}`);
        }
    }
    
    // Initialize all enhancements
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }
        
        console.log('📚 Blog Enhancements initializing...');
        
        // Initialize features
        initReadingProgress();
        calculateReadingTime();
        initSocialShare();
        initBackToTop();
        initPrintButton();
        showRelatedPosts();
        initNewsletter();
        initTags();
        initImageLazyLoad();
        
        console.log('✅ Blog Enhancements initialized!');
    }
    
    init();
})();




