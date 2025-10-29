/**
 * DC TEKNİK - Blog Reading Progress
 * Yazı içi okuma ilerlemesi, kalan süre gösterimi ve scroll tracking
 */

(function() {
    'use strict';
    
    // ========================================
    // READING PROGRESS BAR
    // ========================================
    
    function createReadingProgressBar() {
        const articles = document.querySelectorAll('article[itemscope]');
        
        articles.forEach(article => {
            const articleBody = article.querySelector('[itemprop="articleBody"]');
            if (!articleBody) return;
            
            // Calculate reading time
            const text = articleBody.textContent || articleBody.innerText;
            const wordCount = text.trim().split(/\s+/).length;
            const readingTime = Math.ceil(wordCount / 200); // 200 words per minute
            const readingTimeSeconds = readingTime * 60;
            
            // Create progress bar container
            const progressContainer = document.createElement('div');
            progressContainer.className = 'reading-progress-container';
            progressContainer.innerHTML = `
                <div class="reading-progress-header">
                    <div class="reading-progress-info">
                        <span class="reading-progress-text">Okuma İlerlemesi</span>
                        <span class="reading-time-remaining" id="timeRemaining-${article.id}">
                            ${readingTime} dakika
                        </span>
                    </div>
                    <div class="reading-progress-stats">
                        <span class="reading-percentage" id="percentage-${article.id}">0%</span>
                    </div>
                </div>
                <div class="reading-progress-bar">
                    <div class="reading-progress-fill" id="progressFill-${article.id}"></div>
                </div>
            `;
            
            // Insert after breadcrumb or at the start of article
            const breadcrumb = article.previousElementSibling;
            if (breadcrumb && breadcrumb.classList.contains('breadcrumb')) {
                article.parentElement.insertBefore(progressContainer, article);
            } else {
                article.insertBefore(progressContainer, article.firstChild);
            }
            
            // Track scroll progress
            const progressFill = progressContainer.querySelector(`#progressFill-${article.id}`);
            const percentageEl = progressContainer.querySelector(`#percentage-${article.id}`);
            const timeRemainingEl = progressContainer.querySelector(`#timeRemaining-${article.id}`);
            
            let startTime = Date.now();
            let timeSpent = 0;
            let maxScroll = 0;
            let readingStarted = false;
            
            // Calculate progress based on scroll
            function updateProgress() {
                const rect = articleBody.getBoundingClientRect();
                const windowHeight = window.innerHeight;
                const articleTop = rect.top;
                const articleHeight = rect.height;
                
                let progress = 0;
                
                if (articleTop <= 0 && articleTop + articleHeight > 0) {
                    // Article is visible
                    readingStarted = true;
                    const visibleHeight = Math.min(windowHeight, articleTop + articleHeight);
                    const scrolled = Math.abs(articleTop);
                    progress = Math.min(100, (scrolled / articleHeight) * 100);
                    
                    // Track max scroll
                    maxScroll = Math.max(maxScroll, progress);
                    progress = maxScroll;
                } else if (articleTop > 0) {
                    // Article not yet started
                    progress = 0;
                } else {
                    // Article completed
                    progress = 100;
                }
                
                // Update progress bar
                progressFill.style.width = progress + '%';
                percentageEl.textContent = Math.round(progress) + '%';
                
                // Calculate remaining time
                if (readingStarted && progress > 0 && progress < 100) {
                    timeSpent = (Date.now() - startTime) / 1000; // seconds
                    const avgReadingSpeed = timeSpent / (progress / 100);
                    const remainingSeconds = Math.max(0, readingTimeSeconds - timeSpent);
                    const remainingMinutes = Math.ceil(remainingSeconds / 60);
                    
                    if (remainingMinutes <= 1) {
                        timeRemainingEl.textContent = 'Neredeyse bitti!';
                        timeRemainingEl.style.color = '#ff6b35';
                    } else if (remainingMinutes <= 3) {
                        timeRemainingEl.textContent = `${remainingMinutes} dakika kaldı`;
                        timeRemainingEl.style.color = '#ff6b35';
                    } else {
                        timeRemainingEl.textContent = `~${remainingMinutes} dakika kaldı`;
                        timeRemainingEl.style.color = 'inherit';
                    }
                } else if (progress >= 100) {
                    timeRemainingEl.textContent = '✅ Tamamlandı!';
                    timeRemainingEl.style.color = '#25d366';
                    
                    // Track completion event
                    trackReadingCompletion(article.id, readingTime, timeSpent);
                } else {
                    timeRemainingEl.textContent = `${readingTime} dakika okuma`;
                }
                
                // Update start time when reading starts
                if (readingStarted && !startTime) {
                    startTime = Date.now();
                }
            }
            
            // Throttled scroll event
            let ticking = false;
            function onScroll() {
                if (!ticking) {
                    window.requestAnimationFrame(() => {
                        updateProgress();
                        ticking = false;
                    });
                    ticking = true;
                }
            }
            
            window.addEventListener('scroll', onScroll, { passive: true });
            updateProgress(); // Initial update
            
            // Track completion
            function trackReadingCompletion(postId, estimatedTime, actualTime) {
                // Send to analytics
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'reading_completed', {
                        event_category: 'blog',
                        event_label: postId,
                        value: Math.round(actualTime),
                        estimated_time: estimatedTime * 60,
                        completion_rate: actualTime / (estimatedTime * 60)
                    });
                }
                
                // Save to localStorage for stats
                const completionData = {
                    postId: postId,
                    date: new Date().toISOString(),
                    estimatedTime: estimatedTime * 60,
                    actualTime: Math.round(actualTime),
                    completionRate: Math.min(100, Math.round((actualTime / (estimatedTime * 60)) * 100))
                };
                
                const completions = JSON.parse(localStorage.getItem('blog-completions') || '[]');
                completions.push(completionData);
                // Keep only last 50 completions
                if (completions.length > 50) {
                    completions.shift();
                }
                localStorage.setItem('blog-completions', JSON.stringify(completions));
            }
        });
    }
    
    // ========================================
    // READING STATS (Optional - for future use)
    // ========================================
    
    function getReadingStats() {
        const completions = JSON.parse(localStorage.getItem('blog-completions') || '[]');
        const totalArticles = completions.length;
        const totalTime = completions.reduce((sum, c) => sum + c.actualTime, 0);
        const avgCompletionRate = completions.length > 0 
            ? completions.reduce((sum, c) => sum + c.completionRate, 0) / completions.length 
            : 0;
        
        return {
            totalArticles,
            totalTime: Math.round(totalTime / 60), // minutes
            avgCompletionRate: Math.round(avgCompletionRate)
        };
    }
    
    // Expose stats function
    window.getBlogReadingStats = getReadingStats;
    
    // ========================================
    // INITIALIZE
    // ========================================
    
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }
        
        console.log('📊 Reading Progress initializing...');
        createReadingProgressBar();
        console.log('✅ Reading Progress initialized!');
    }
    
    init();
})();




