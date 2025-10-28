/**
 * DC TEKNİK - UX Enhancements
 * Smooth transitions, scroll animations, toast notifications
 * Mevcut script.js'i bozmadan güvenli şekilde eklendi
 */

(function() {
    'use strict';
    
    // Mevcut kodları bozmamak için namespace kullan
    window.UXEnhancements = window.UXEnhancements || {};
    
    /**
     * Scroll Animations - Intersection Observer ile
     */
    function initScrollAnimations() {
        if (typeof IntersectionObserver === 'undefined') {
            return; // Browser desteklemiyor
        }
        
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Performance için bir kez görüldükten sonra observe etmeyi bırak
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Scroll animasyonu için elementleri bul
        const animatedElements = document.querySelectorAll(
            '.scroll-fade-in, .scroll-slide-left, .scroll-slide-right, .scroll-scale'
        );
        
        animatedElements.forEach(element => {
            observer.observe(element);
        });
        
        console.log('✅ Scroll animations initialized:', animatedElements.length, 'elements');
    }
    
    /**
     * Toast Notification System
     */
    function createToastContainer() {
        if (document.querySelector('.toast-container')) {
            return; // Zaten var
        }
        
        const container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    
    function showToast(message, type = 'info', title = '') {
        createToastContainer();
        const container = document.querySelector('.toast-container');
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };
        
        toast.innerHTML = `
            <div class="toast-icon">${icons[type] || icons.info}</div>
            <div class="toast-content">
                ${title ? `<div class="toast-title">${title}</div>` : ''}
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close" aria-label="Kapat">×</button>
        `;
        
        container.appendChild(toast);
        
        // Close button
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            removeToast(toast);
        });
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            removeToast(toast);
        }, 5000);
        
        return toast;
    }
    
    function removeToast(toast) {
        toast.classList.add('fade-out');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }
    
    /**
     * Smooth Page Transitions
     */
    function initPageTransitions() {
        // Sayfa yüklendiğinde fade-in
        document.body.classList.add('page-transition');
        
        // Link'lere smooth transition ekle
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#') return;
                
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
    
    /**
     * Button Ripple Effects
     */
    function initRippleEffects() {
        document.querySelectorAll('.btn, .btn-primary, .btn-whatsapp, button').forEach(button => {
            // Ripple class'ı ekle
            if (!button.classList.contains('ripple')) {
                button.classList.add('ripple');
            }
        });
    }
    
    /**
     * Form Enhancements
     */
    function initFormEnhancements() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            // Form submit'te toast göster
            form.addEventListener('submit', function(e) {
                // Validation kontrolü (basit)
                let isValid = true;
                const requiredFields = form.querySelectorAll('[required]');
                
                requiredFields.forEach(field => {
                    if (!field.value.trim()) {
                        isValid = false;
                        field.classList.add('shake');
                        setTimeout(() => field.classList.remove('shake'), 500);
                    }
                });
                
                if (!isValid) {
                    e.preventDefault();
                    showToast('Lütfen tüm zorunlu alanları doldurun', 'warning', 'Form Hatası');
                }
            });
            
            // Input focus effects
            const inputs = form.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                input.addEventListener('focus', function() {
                    this.parentElement?.classList.add('focused');
                });
                
                input.addEventListener('blur', function() {
                    this.parentElement?.classList.remove('focused');
                });
            });
        });
    }
    
    /**
     * Loading States
     */
    function showLoading(element) {
        const loading = document.createElement('div');
        loading.className = 'loading-spinner';
        loading.setAttribute('aria-label', 'Yükleniyor...');
        element.appendChild(loading);
        return loading;
    }
    
    function hideLoading(element) {
        const loading = element.querySelector('.loading-spinner');
        if (loading) {
            loading.remove();
        }
    }
    
    /**
     * Card Hover Enhancements
     */
    function initCardEnhancements() {
        const cards = document.querySelectorAll('.service-card, .review-card, .feature-card, .stat-counter');
        
        cards.forEach((card, index) => {
            // Staggered animation için delay ekle
            card.style.transitionDelay = `${index * 0.05}s`;
            
            // Scroll animation class'ı ekle
            card.classList.add('scroll-fade-in');
        });
    }
    
    /**
     * Initialize all UX enhancements
     */
    function init() {
        // DOM hazır olduğunda başlat
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }
        
        console.log('🎨 UX Enhancements initializing...');
        
        // Özellikleri başlat
        initScrollAnimations();
        initPageTransitions();
        initRippleEffects();
        initFormEnhancements();
        initCardEnhancements();
        
        // Global fonksiyonlar (window'a ekle)
        window.showToast = showToast;
        window.showLoading = showLoading;
        window.hideLoading = hideLoading;
        
        console.log('✅ UX Enhancements initialized!');
    }
    
    // Hemen başlat
    init();
    
})();
