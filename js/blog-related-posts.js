/**
 * DC TEKNİK - Blog Related Posts
 * İlgili yazılar önerisi - Tag ve kategori bazlı
 */

(function() {
    'use strict';
    
    // ========================================
    // RELATED POSTS GENERATOR
    // ========================================
    
    function generateRelatedPosts() {
        const articles = document.querySelectorAll('article[itemscope]');
        
        articles.forEach(article => {
            const postId = article.id;
            const postCategory = article.querySelector('.blog-category')?.textContent.trim() || '';
            const postTags = extractTags(article);
            const postTitle = article.querySelector('h2')?.textContent || '';
            
            // Find related posts
            const relatedPosts = findRelatedPosts(postId, postCategory, postTags, article);
            
            if (relatedPosts.length === 0) return;
            
            // Create related posts section
            const relatedSection = document.createElement('section');
            relatedSection.className = 'related-posts-section';
            relatedSection.innerHTML = `
                <div class="related-posts-header">
                    <h3>📚 Bu Yazıları da Okuyun</h3>
                    <p class="related-posts-subtitle">İlginizi çekebilecek benzer içerikler</p>
                </div>
                <div class="related-posts-grid">
                    ${relatedPosts.map(post => `
                        <article class="related-post-card" data-post-id="${post.id}">
                            <div class="related-post-image">
                                ${post.image || '<div class="related-post-placeholder"><i class="fas fa-newspaper"></i></div>'}
                                ${post.category ? `<span class="related-post-category">${post.category}</span>` : ''}
                            </div>
                            <div class="related-post-content">
                                <h4>
                                    <a href="#${post.id}">${post.title}</a>
                                </h4>
                                <p class="related-post-excerpt">${post.excerpt || ''}</p>
                                <div class="related-post-meta">
                                    ${post.readTime ? `<span class="related-post-read-time"><i class="fas fa-clock"></i> ${post.readTime}</span>` : ''}
                                    ${post.date ? `<time class="related-post-date">${post.date}</time>` : ''}
                                </div>
                                <a href="#${post.id}" class="related-post-link">Devamını Oku <i class="fas fa-arrow-right"></i></a>
                            </div>
                        </article>
                    `).join('')}
                </div>
            `;
            
            // Insert after article
            article.parentElement.insertBefore(relatedSection, article.nextSibling);
            
            // Add scroll trigger animation
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '50px'
            });
            
            observer.observe(relatedSection);
        });
    }
    
    // ========================================
    // HELPER FUNCTIONS
    // ========================================
    
    function extractTags(article) {
        const tags = [];
        
        // Extract from category
        const category = article.querySelector('.blog-category')?.textContent.trim();
        if (category) tags.push(category.toLowerCase());
        
        // Extract from tags widget if exists
        const tagButtons = article.querySelectorAll('.tag-btn');
        tagButtons.forEach(btn => {
            const tag = btn.textContent.trim().toLowerCase();
            if (tag && tag !== 'tümü') tags.push(tag);
        });
        
        // Extract from article content (keywords)
        const title = article.querySelector('h2')?.textContent || '';
        const keywords = extractKeywords(title);
        tags.push(...keywords);
        
        return [...new Set(tags)]; // Remove duplicates
    }
    
    function extractKeywords(text) {
        const commonWords = ['ve', 'için', 'ile', 'bir', 'bu', 'olan', 'olarak', 'daha', 'çok', 'en'];
        const words = text.toLowerCase()
            .replace(/[^\w\sğüşıöçĞÜŞİÖÇ]/g, ' ')
            .split(/\s+/)
            .filter(word => word.length > 3 && !commonWords.includes(word));
        
        return words.slice(0, 5); // Top 5 keywords
    }
    
    function findRelatedPosts(currentPostId, category, tags, currentArticle) {
        const allArticles = Array.from(document.querySelectorAll('article[itemscope]'))
            .filter(article => article.id !== currentPostId)
            .map(article => ({
                element: article,
                id: article.id,
                title: article.querySelector('h2')?.textContent || '',
                category: article.querySelector('.blog-category')?.textContent.trim() || '',
                excerpt: extractExcerpt(article),
                readTime: article.querySelector('.read-time')?.textContent || '',
                date: article.querySelector('time')?.getAttribute('datetime') || '',
                image: article.querySelector('.blog-post-image')?.innerHTML || null,
                tags: extractTags(article)
            }));
        
        // Score posts based on relevance
        const scoredPosts = allArticles.map(post => {
            let score = 0;
            
            // Category match (highest weight)
            if (post.category.toLowerCase() === category.toLowerCase()) {
                score += 10;
            }
            
            // Tag matches
            const commonTags = post.tags.filter(tag => tags.includes(tag));
            score += commonTags.length * 5;
            
            // Title keyword matches
            const titleKeywords = extractKeywords(post.title);
            const commonKeywords = titleKeywords.filter(kw => 
                tags.some(tag => tag.includes(kw) || kw.includes(tag))
            );
            score += commonKeywords.length * 2;
            
            // Recency bonus (more recent = slightly higher score)
            if (post.date) {
                const postDate = new Date(post.date);
                const daysAgo = (Date.now() - postDate.getTime()) / (1000 * 60 * 60 * 24);
                if (daysAgo < 30) score += 1;
                if (daysAgo < 7) score += 2;
            }
            
            return { ...post, score };
        });
        
        // Sort by score and return top 3-4
        const topPosts = scoredPosts
            .filter(post => post.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 4);
        
        return topPosts;
    }
    
    function extractExcerpt(article) {
        const articleBody = article.querySelector('[itemprop="articleBody"]');
        if (!articleBody) return '';
        
        const text = articleBody.textContent || articleBody.innerText;
        const words = text.trim().split(/\s+/);
        
        // Return first 20 words
        const excerpt = words.slice(0, 20).join(' ');
        return excerpt.length < text.length ? excerpt + '...' : excerpt;
    }
    
    // ========================================
    // SMOOTH SCROLL TO RELATED POST
    // ========================================
    
    function initRelatedPostNavigation() {
        document.addEventListener('click', (e) => {
            const relatedPostLink = e.target.closest('.related-post-link, .related-post-card a');
            if (!relatedPostLink) return;
            
            e.preventDefault();
            const postId = relatedPostLink.closest('.related-post-card')?.dataset.postId || 
                          relatedPostLink.getAttribute('href')?.slice(1);
            
            if (postId) {
                const targetPost = document.getElementById(postId) || 
                                 document.querySelector(`[href="#${postId}"]`)?.closest('article');
                
                if (targetPost) {
                    const offset = 100;
                    const targetPosition = targetPost.getBoundingClientRect().top + window.pageYOffset - offset;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Highlight the post briefly
                    targetPost.classList.add('highlight-post');
                    setTimeout(() => {
                        targetPost.classList.remove('highlight-post');
                    }, 2000);
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
        
        console.log('📚 Related Posts initializing...');
        generateRelatedPosts();
        initRelatedPostNavigation();
        console.log('✅ Related Posts initialized!');
    }
    
    init();
})();

