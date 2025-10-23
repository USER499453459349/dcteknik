// UX Enhancements - DC TEKNİK
(function() {
    'use strict';
    
    class UXEnhancements {
        constructor() {
            this.scrollPosition = 0;
            this.isScrolling = false;
            this.init();
        }
        
        init() {
            this.addSmoothScrolling();
            this.addLoadingStates();
            this.addErrorHandling();
            this.addSuccessFeedback();
            this.addKeyboardNavigation();
            this.addTouchOptimizations();
            this.addAccessibilityFeatures();
            this.addPerformanceOptimizations();
        }
        
        addSmoothScrolling() {
            // Smooth scroll for anchor links
            const anchorLinks = document.querySelectorAll('a[href^="#"]');
            anchorLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetId = link.getAttribute('href').substring(1);
                    const targetElement = document.getElementById(targetId);
                    
                    if (targetElement) {
                        targetElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                });
            });
            
            // Add scroll-to-top functionality
            this.addScrollToTop();
        }
        
        addScrollToTop() {
            const scrollToTopBtn = document.createElement('button');
            scrollToTopBtn.className = 'scroll-to-top';
            scrollToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
            scrollToTopBtn.setAttribute('aria-label', 'Sayfanın başına dön');
            scrollToTopBtn.style.display = 'none';
            
            document.body.appendChild(scrollToTopBtn);
            
            // Show/hide button based on scroll position
            window.addEventListener('scroll', () => {
                if (window.scrollY > 300) {
                    scrollToTopBtn.style.display = 'block';
                    scrollToTopBtn.style.animation = 'fadeIn 0.3s ease';
                } else {
                    scrollToTopBtn.style.display = 'none';
                }
            });
            
            // Scroll to top on click
            scrollToTopBtn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
        
        addLoadingStates() {
            // Add loading states for dynamic content
            this.addPageLoading();
            this.addImageLoading();
            this.addFormLoading();
        }
        
        addPageLoading() {
            // Show loading spinner on page load
            const loadingOverlay = document.createElement('div');
            loadingOverlay.className = 'page-loading-overlay';
            loadingOverlay.innerHTML = `
                <div class="loading-spinner">
                    <div class="spinner"></div>
                    <p>Yükleniyor...</p>
                </div>
            `;
            
            document.body.appendChild(loadingOverlay);
            
            // Hide loading overlay when page is fully loaded
            window.addEventListener('load', () => {
                setTimeout(() => {
                    loadingOverlay.style.opacity = '0';
                    setTimeout(() => {
                        loadingOverlay.remove();
                    }, 300);
                }, 500);
            });
        }
        
        addImageLoading() {
            // Add loading states for images
            const images = document.querySelectorAll('img');
            images.forEach(img => {
                if (!img.complete) {
                    img.style.opacity = '0';
                    img.addEventListener('load', () => {
                        img.style.transition = 'opacity 0.3s ease';
                        img.style.opacity = '1';
                    });
                }
            });
        }
        
        addFormLoading() {
            // Add loading states for forms
            const forms = document.querySelectorAll('form');
            forms.forEach(form => {
                form.addEventListener('submit', () => {
                    const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
                    if (submitBtn) {
                        submitBtn.disabled = true;
                        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gönderiliyor...';
                    }
                });
            });
        }
        
        addErrorHandling() {
            // Global error handling
            window.addEventListener('error', (e) => {
                console.error('Global error:', e.error);
                this.showErrorNotification('Bir hata oluştu. Lütfen sayfayı yenileyin.');
            });
            
            // Network error handling
            window.addEventListener('online', () => {
                this.showSuccessNotification('İnternet bağlantısı yeniden kuruldu.');
            });
            
            window.addEventListener('offline', () => {
                this.showErrorNotification('İnternet bağlantısı kesildi.');
            });
        }
        
        addSuccessFeedback() {
            // Success feedback for user actions
            this.addSuccessNotifications();
            this.addConfirmationDialogs();
        }
        
        addSuccessNotifications() {
            // Add success notification system
            this.notificationContainer = document.createElement('div');
            this.notificationContainer.className = 'notification-container';
            document.body.appendChild(this.notificationContainer);
        }
        
        showSuccessNotification(message) {
            this.showNotification(message, 'success');
        }
        
        showErrorNotification(message) {
            this.showNotification(message, 'error');
        }
        
        showNotification(message, type) {
            const notification = document.createElement('div');
            notification.className = `notification notification-${type}`;
            notification.innerHTML = `
                <div class="notification-content">
                    <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
                    <span>${message}</span>
                </div>
                <button class="notification-close" aria-label="Kapat">
                    <i class="fas fa-times"></i>
                </button>
            `;
            
            this.notificationContainer.appendChild(notification);
            
            // Auto remove after 5 seconds
            setTimeout(() => {
                notification.remove();
            }, 5000);
            
            // Close on click
            notification.querySelector('.notification-close').addEventListener('click', () => {
                notification.remove();
            });
        }
        
        addConfirmationDialogs() {
            // Add confirmation for important actions
            const importantButtons = document.querySelectorAll('.btn-danger, .delete-btn, .cancel-btn');
            importantButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    if (!confirm('Bu işlemi gerçekleştirmek istediğinizden emin misiniz?')) {
                        e.preventDefault();
                    }
                });
            });
        }
        
        addKeyboardNavigation() {
            // Enhanced keyboard navigation
            document.addEventListener('keydown', (e) => {
                // Escape key to close modals
                if (e.key === 'Escape') {
                    this.closeModals();
                }
                
                // Tab navigation enhancement
                if (e.key === 'Tab') {
                    this.enhanceTabNavigation();
                }
            });
        }
        
        closeModals() {
            const modals = document.querySelectorAll('.modal, .popup, .overlay');
            modals.forEach(modal => {
                modal.style.display = 'none';
            });
        }
        
        enhanceTabNavigation() {
            // Add visual focus indicators
            const focusableElements = document.querySelectorAll('a, button, input, select, textarea, [tabindex]');
            focusableElements.forEach(element => {
                element.addEventListener('focus', () => {
                    element.classList.add('keyboard-focus');
                });
                
                element.addEventListener('blur', () => {
                    element.classList.remove('keyboard-focus');
                });
            });
        }
        
        addTouchOptimizations() {
            // Touch gesture support
            this.addSwipeGestures();
            this.addTouchFeedback();
        }
        
        addSwipeGestures() {
            // Add swipe gestures for mobile
            let startX, startY, endX, endY;
            
            document.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
            });
            
            document.addEventListener('touchend', (e) => {
                endX = e.changedTouches[0].clientX;
                endY = e.changedTouches[0].clientY;
                
                const diffX = startX - endX;
                const diffY = startY - endY;
                
                // Horizontal swipe
                if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                    if (diffX > 0) {
                        // Swipe left
                        this.handleSwipeLeft();
                    } else {
                        // Swipe right
                        this.handleSwipeRight();
                    }
                }
            });
        }
        
        handleSwipeLeft() {
            // Handle swipe left gesture
            console.log('Swipe left detected');
        }
        
        handleSwipeRight() {
            // Handle swipe right gesture
            console.log('Swipe right detected');
        }
        
        addTouchFeedback() {
            // Add haptic feedback for touch interactions
            const touchElements = document.querySelectorAll('button, .btn, a');
            touchElements.forEach(element => {
                element.addEventListener('touchstart', () => {
                    element.style.transform = 'scale(0.95)';
                });
                
                element.addEventListener('touchend', () => {
                    element.style.transform = 'scale(1)';
                });
            });
        }
        
        addAccessibilityFeatures() {
            // Enhanced accessibility
            this.addSkipLinks();
            this.addARIALabels();
            this.addFocusManagement();
        }
        
        addSkipLinks() {
            // Add skip navigation links
            const skipLink = document.createElement('a');
            skipLink.href = '#main-content';
            skipLink.textContent = 'Ana içeriğe geç';
            skipLink.className = 'skip-link';
            skipLink.setAttribute('aria-label', 'Ana içeriğe geç');
            
            document.body.insertBefore(skipLink, document.body.firstChild);
        }
        
        addARIALabels() {
            // Add ARIA labels to interactive elements
            const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');
            interactiveElements.forEach(element => {
                if (!element.getAttribute('aria-label') && !element.textContent.trim()) {
                    element.setAttribute('aria-label', 'Etkileşimli öğe');
                }
            });
        }
        
        addFocusManagement() {
            // Manage focus for better accessibility
            const modals = document.querySelectorAll('.modal, .popup');
            modals.forEach(modal => {
                modal.addEventListener('shown', () => {
                    const firstFocusable = modal.querySelector('button, input, select, textarea, a');
                    if (firstFocusable) {
                        firstFocusable.focus();
                    }
                });
            });
        }
        
        addPerformanceOptimizations() {
            // Performance optimizations
            this.addLazyLoading();
            this.addDebouncedEvents();
            this.addThrottledScroll();
        }
        
        addLazyLoading() {
            // Lazy load images and content
            const lazyImages = document.querySelectorAll('img[data-src]');
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            lazyImages.forEach(img => imageObserver.observe(img));
        }
        
        addDebouncedEvents() {
            // Debounce resize events
            let resizeTimeout;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(() => {
                    this.handleResize();
                }, 250);
            });
        }
        
        handleResize() {
            // Handle window resize
            this.viewportHeight = window.innerHeight;
            this.viewportWidth = window.innerWidth;
        }
        
        addThrottledScroll() {
            // Throttle scroll events
            let scrollTimeout;
            window.addEventListener('scroll', () => {
                if (!scrollTimeout) {
                    scrollTimeout = setTimeout(() => {
                        this.handleScroll();
                        scrollTimeout = null;
                    }, 16); // ~60fps
                }
            });
        }
        
        handleScroll() {
            this.scrollPosition = window.scrollY;
            this.isScrolling = true;
            
            // Update scroll-dependent elements
            this.updateScrollElements();
        }
        
        updateScrollElements() {
            // Update elements based on scroll position
            const parallaxElements = document.querySelectorAll('.parallax');
            parallaxElements.forEach(element => {
                const speed = element.dataset.speed || 0.5;
                const yPos = -(this.scrollPosition * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        }
        
        // Public methods
        showNotification(message, type = 'info') {
            this.showNotification(message, type);
        }
        
        getScrollPosition() {
            return this.scrollPosition;
        }
        
        isScrolling() {
            return this.isScrolling;
        }
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.uxEnhancements = new UXEnhancements();
        });
    } else {
        window.uxEnhancements = new UXEnhancements();
    }
})();
