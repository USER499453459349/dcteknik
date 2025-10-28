/**
 * DC TEKNİK - Blog TOC, Bookmark & Breadcrumb
 * Table of Contents, Bookmark System ve Breadcrumb Navigation
 */

(function() {
    'use strict';
    
    // ========================================
    // TABLE OF CONTENTS
    // ========================================
    
    function generateTableOfContents() {
        const articles = document.querySelectorAll('article[itemscope]');
        
        articles.forEach(article => {
            const headings = article.querySelectorAll('h2, h3, h4');
            if (headings.length < 2) return; // En az 2 başlık olmalı
            
            const toc = document.createElement('div');
            toc.className = 'table-of-contents';
            toc.innerHTML = `
                <div class="toc-header">
                    <h3>📑 İçindekiler</h3>
                    <button class="toc-toggle" aria-label="İçindekileri aç/kapat">
                        <i class="fas fa-chevron-down"></i>
                    </button>
                </div>
                <ul class="toc-list"></ul>
            `;
            
            const tocList = toc.querySelector('.toc-list');
            let tocHTML = '';
            
            headings.forEach((heading, index) => {
                // ID ekle
                if (!heading.id) {
                    heading.id = `heading-${index}-${Date.now()}`;
                }
                
                const level = heading.tagName.toLowerCase();
                const text = heading.textContent.trim();
                const id = heading.id;
                
                tocHTML += `
                    <li class="toc-item toc-${level}">
                        <a href="#${id}" class="toc-link" data-target="${id}">
                            ${text}
                        </a>
                    </li>
                `;
            });
            
            tocList.innerHTML = tocHTML;
            
            // Article content'ten önce ekle
            const articleBody = article.querySelector('[itemprop="articleBody"]');
            const firstHeading = articleBody?.querySelector('h2, h3');
            
            if (articleBody && firstHeading) {
                // Insert after first heading if exists, otherwise at the start
                articleBody.insertBefore(toc, firstHeading.nextSibling);
            } else if (articleBody) {
                articleBody.insertBefore(toc, articleBody.firstChild);
            }
            
            // Toggle functionality
            const toggle = toc.querySelector('.toc-toggle');
            toggle.addEventListener('click', () => {
                toc.classList.toggle('collapsed');
                const icon = toggle.querySelector('i');
                icon.classList.toggle('fa-chevron-down');
                icon.classList.toggle('fa-chevron-up');
            });
            
            // Smooth scroll
            tocList.querySelectorAll('.toc-link').forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const targetId = this.dataset.target;
                    const target = document.getElementById(targetId);
                    
                    if (target) {
                        const offset = 100; // Header height
                        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                        
                        // Active state
                        tocList.querySelectorAll('.toc-link').forEach(l => l.classList.remove('active'));
                        this.classList.add('active');
                    }
                });
            });
            
            // Intersection Observer for active section
            const observerOptions = {
                rootMargin: '-100px 0px -66%',
                threshold: 0
            };
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const id = entry.target.id;
                        tocList.querySelectorAll('.toc-link').forEach(link => {
                            link.classList.remove('active');
                            if (link.dataset.target === id) {
                                link.classList.add('active');
                            }
                        });
                    }
                });
            }, observerOptions);
            
            headings.forEach(heading => observer.observe(heading));
        });
    }
    
    // ========================================
    // BOOKMARK SYSTEM
    // ========================================
    
    function initBookmarkSystem() {
        // Get bookmarked posts
        function getBookmarkedPosts() {
            const bookmarks = localStorage.getItem('blog-bookmarks');
            return bookmarks ? JSON.parse(bookmarks) : [];
        }
        
        // Save bookmarked posts
        function saveBookmarkedPosts(posts) {
            localStorage.setItem('blog-bookmarks', JSON.stringify(posts));
        }
        
        // Check if post is bookmarked
        function isBookmarked(postId) {
            const bookmarks = getBookmarkedPosts();
            return bookmarks.includes(postId);
        }
        
        // Toggle bookmark
        function toggleBookmark(postId, postTitle) {
            const bookmarks = getBookmarkedPosts();
            const index = bookmarks.findIndex(b => b.id === postId);
            
            if (index > -1) {
                // Remove bookmark
                bookmarks.splice(index, 1);
                if (typeof window.showToast === 'function') {
                    window.showToast('Yazı kaydedilenlerden çıkarıldı', 'info');
                }
            } else {
                // Add bookmark
                bookmarks.push({
                    id: postId,
                    title: postTitle,
                    date: new Date().toISOString(),
                    url: window.location.href
                });
                if (typeof window.showToast === 'function') {
                    window.showToast('Yazı kaydedildi!', 'success');
                }
            }
            
            saveBookmarkedPosts(bookmarks);
            updateBookmarkButtons();
            renderBookmarksWidget();
        }
        
        // Create bookmark button
        function createBookmarkButton(postElement) {
            const postId = postElement.id || `post-${Date.now()}-${Math.random()}`;
            const postTitle = postElement.querySelector('h2')?.textContent || 'Başlıksız';
            
            if (!postElement.id) {
                postElement.id = postId;
            }
            
            const button = document.createElement('button');
            button.className = 'bookmark-btn';
            button.setAttribute('aria-label', 'Yazıyı kaydet');
            button.dataset.postId = postId;
            button.dataset.postTitle = postTitle;
            button.innerHTML = `
                <i class="fas fa-bookmark"></i>
                <span class="bookmark-text">Kaydet</span>
            `;
            
            // Initial state
            if (isBookmarked(postId)) {
                button.classList.add('bookmarked');
                button.innerHTML = `
                    <i class="fas fa-bookmark"></i>
                    <span class="bookmark-text">Kaydedildi</span>
                `;
            }
            
            button.addEventListener('click', (e) => {
                e.preventDefault();
                toggleBookmark(postId, postTitle);
            });
            
            return button;
        }
        
        // Update all bookmark buttons
        function updateBookmarkButtons() {
            document.querySelectorAll('.bookmark-btn').forEach(button => {
                const postId = button.dataset.postId;
                if (isBookmarked(postId)) {
                    button.classList.add('bookmarked');
                    button.innerHTML = `
                        <i class="fas fa-bookmark"></i>
                        <span class="bookmark-text">Kaydedildi</span>
                    `;
                } else {
                    button.classList.remove('bookmarked');
                    button.innerHTML = `
                        <i class="far fa-bookmark"></i>
                        <span class="bookmark-text">Kaydet</span>
                    `;
                }
            });
        }
        
        // Add bookmark buttons to posts
        function addBookmarkButtons() {
            const posts = document.querySelectorAll('.blog-post, article[itemscope]');
            
            posts.forEach(post => {
                const footer = post.querySelector('.blog-post-footer') || post.querySelector('[itemprop="articleBody"]');
                if (footer && !footer.querySelector('.bookmark-btn')) {
                    const button = createBookmarkButton(post);
                    
                    // Add to footer or create footer
                    if (post.querySelector('.blog-post-footer')) {
                        post.querySelector('.blog-post-footer').appendChild(button);
                    } else {
                        const newFooter = document.createElement('div');
                        newFooter.className = 'blog-post-footer';
                        newFooter.appendChild(button);
                        footer.appendChild(newFooter);
                    }
                }
            });
        }
        
        // Render bookmarks widget
        function renderBookmarksWidget() {
            const bookmarks = getBookmarkedPosts();
            let widget = document.getElementById('bookmarks-widget');
            
            if (!widget && bookmarks.length > 0) {
                // Create widget
                widget = document.createElement('div');
                widget.id = 'bookmarks-widget';
                widget.className = 'sidebar-widget';
                
                // Add to sidebar
                const sidebar = document.querySelector('.blog-sidebar');
                if (sidebar) {
                    sidebar.insertBefore(widget, sidebar.firstChild);
                }
            }
            
            if (widget) {
                if (bookmarks.length === 0) {
                    widget.remove();
                    return;
                }
                
                widget.innerHTML = `
                    <h3>🔖 Kaydedilen Yazılar</h3>
                    <div class="bookmarks-list">
                        ${bookmarks.slice(0, 5).map(bookmark => `
                            <div class="bookmark-item">
                                <a href="${bookmark.url || '#'}" class="bookmark-link">
                                    ${bookmark.title}
                                </a>
                                <button class="bookmark-remove" data-post-id="${bookmark.id}" aria-label="Kaldır">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                        `).join('')}
                    </div>
                    ${bookmarks.length > 5 ? `<button class="bookmarks-view-all" onclick="showAllBookmarks()">Tümünü Gör (${bookmarks.length})</button>` : ''}
                `;
                
                // Remove buttons
                widget.querySelectorAll('.bookmark-remove').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        e.preventDefault();
                        const postId = btn.dataset.postId;
                        toggleBookmark(postId, '');
                    });
                });
            }
        }
        
        // Show all bookmarks modal
        window.showAllBookmarks = function() {
            const bookmarks = getBookmarkedPosts();
            // Implementation could be a modal or separate page
            console.log('All bookmarks:', bookmarks);
        };
        
        // Initialize
        addBookmarkButtons();
        updateBookmarkButtons();
        renderBookmarksWidget();
        
        // Re-render on storage change (for multiple tabs)
        window.addEventListener('storage', () => {
            updateBookmarkButtons();
            renderBookmarksWidget();
        });
    }
    
    // ========================================
    // BREADCRUMB NAVIGATION
    // ========================================
    
    function generateBreadcrumb() {
        const articles = document.querySelectorAll('article[itemscope]');
        
        articles.forEach(article => {
            const category = article.querySelector('.blog-category')?.textContent || 'Blog';
            const title = article.querySelector('h2')?.textContent || 'Başlıksız';
            const postId = article.id || window.location.hash.slice(1);
            
            const breadcrumb = document.createElement('nav');
            breadcrumb.className = 'breadcrumb';
            breadcrumb.setAttribute('aria-label', 'Breadcrumb');
            breadcrumb.innerHTML = `
                <ol itemscope itemtype="https://schema.org/BreadcrumbList">
                    <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
                        <a itemprop="item" href="index.html">
                            <span itemprop="name">Ana Sayfa</span>
                        </a>
                        <meta itemprop="position" content="1" />
                    </li>
                    <li class="breadcrumb-separator">›</li>
                    <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
                        <a itemprop="item" href="blog.html">
                            <span itemprop="name">Blog</span>
                        </a>
                        <meta itemprop="position" content="2" />
                    </li>
                    <li class="breadcrumb-separator">›</li>
                    <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
                        <a itemprop="item" href="blog.html#${postId}">
                            <span itemprop="name">${category}</span>
                        </a>
                        <meta itemprop="position" content="3" />
                    </li>
                    <li class="breadcrumb-separator">›</li>
                    <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem" class="current">
                        <span itemprop="name">${title}</span>
                        <meta itemprop="position" content="4" />
                    </li>
                </ol>
            `;
            
            // Insert before article
            if (article.parentElement) {
                article.parentElement.insertBefore(breadcrumb, article);
            }
        });
        
        // Also add to page header for blog list
        if (!document.querySelector('article[itemscope]')) {
            const breadcrumb = document.createElement('nav');
            breadcrumb.className = 'breadcrumb breadcrumb-page';
            breadcrumb.setAttribute('aria-label', 'Breadcrumb');
            breadcrumb.innerHTML = `
                <ol itemscope itemtype="https://schema.org/BreadcrumbList">
                    <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
                        <a itemprop="item" href="index.html">
                            <span itemprop="name">Ana Sayfa</span>
                        </a>
                        <meta itemprop="position" content="1" />
                    </li>
                    <li class="breadcrumb-separator">›</li>
                    <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem" class="current">
                        <span itemprop="name">Blog</span>
                        <meta itemprop="position" content="2" />
                    </li>
                </ol>
            `;
            
            const blogContent = document.querySelector('.blog-content');
            if (blogContent) {
                blogContent.insertBefore(breadcrumb, blogContent.firstChild);
            }
        }
    }
    
    // ========================================
    // INITIALIZE ALL
    // ========================================
    
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }
        
        console.log('📑 TOC, Bookmark & Breadcrumb initializing...');
        
        // Initialize features
        generateTableOfContents();
        initBookmarkSystem();
        generateBreadcrumb();
        
        console.log('✅ TOC, Bookmark & Breadcrumb initialized!');
    }
    
    init();
})();

