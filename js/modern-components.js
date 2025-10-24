/**
 * DC TEKNİK Modern Component Library
 * Modern UI bileşenleri ve etkileşimli elementler
 * 
 * Features:
 * - Modern buttons
 * - Interactive cards
 * - Animated elements
 * - Glassmorphism effects
 * - Hover animations
 * - Loading states
 * - Modal components
 * - Navigation components
 */

class ModernComponents {
    constructor() {
        this.componentConfig = {
            animations: true,
            glassmorphism: true,
            hoverEffects: true,
            loadingStates: true,
            soundEffects: true
        };
        
        this.components = new Map();
        this.animationQueue = [];
        
        this.init();
    }
    
    init() {
        console.log('🎨 Modern Components initialized');
        this.createModernButtons();
        this.createModernCards();
        this.createModernModals();
        this.createModernNavigation();
        this.setupAnimations();
        this.setupInteractions();
    }
    
    createModernButtons() {
        // Update existing buttons
        const buttons = document.querySelectorAll('button, .btn, .button');
        buttons.forEach(button => {
            this.enhanceButton(button);
        });
        
        // Create modern button styles
        const style = document.createElement('style');
        style.textContent = `
            .modern-btn {
                position: relative;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                padding: 12px 24px;
                border: none;
                border-radius: 12px;
                font-family: var(--font-family-primary);
                font-weight: 600;
                font-size: 16px;
                line-height: 1.5;
                text-decoration: none;
                cursor: pointer;
                transition: all 0.3s var(--animation-smooth);
                overflow: hidden;
                background: var(--gradient-primary);
                color: white;
                box-shadow: var(--shadow-modern-md);
                transform: translateY(0);
            }
            
            .modern-btn::before {
                content: trường hợp '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
                transition: left 0.5s var(--animation-smooth);
            }
            
            .modern-btn:hover {
                transform: translateY(-2px);
                box-shadow: var(--shadow-modern-xl);
                background: var(--gradient-secondary);
            }
            
            .modern-btn:hover::before {
                left: 100%;
            }
            
            .modern-btn:active {
                transform: translateY(0);
                box-shadow: var(--shadow-modern-md);
            }
            
            .modern-btn-primary {
                background: var(--gradient-primary);
                color: white;
            }
            
            .modern-btn-secondary {
                background: var(--glass-bg);
                color: var(--primary-color);
                border: 1px solid var(--glass-border);
                backdrop-filter: var(--glass-backdrop);
            }
            
            .modern-btn-accent {
                background: var(--gradient-accent);
                color: white;
            }
            
            .modern-btn-ghost {
                background: transparent;
                color: var(--primary-color);
                border: 2px solid var(--primary-color);
            }
            
            .modern-btn-ghost:hover {
                background: var(--primary-color);
                color: white;
            }
            
            .modern-btn-loading {
                position: relative;
                color: transparent;
            }
            
            .modern-btn-loading::after {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                width: 20px;
                height: 20px;
                margin: -10px 0 0 -10px;
                border: 2px solid transparent;
                border-top: 2px solid currentColor;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            .modern-btn-pulse {
                animation: pulse 2s infinite;
            }
            
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }
        `;
        document.head.appendChild(style);
    }
    
    enhanceButton(button) {
        if (button.classList.contains('modern-btn')) return;
        
        // Add modern button class
        button.classList.add('modern-btn');
        
        // Determine button type
        if (button.classList.contains('btn-primary') || button.type === 'submit') {
            button.classList.add('modern-btn-primary');
        } else if (button.classList.contains('btn-secondary')) {
            button.classList.add('modern-btn-secondary');
        } else if (button.classList.contains('btn-accent')) {
            button.classList.add('modern-btn-accent');
        } else {
            button.classList.add('modern-btn-primary');
        }
        
        // Add click animation
        button.addEventListener('click', (e) => {
            this.animateButtonClick(button);
        });
        
        // Add loading state support
        if (button.type === 'submit') {
            button.addEventListener('click', () => {
                this.setButtonLoading(button, true);
                setTimeout(() => {
                    this.setButtonLoading(button, false);
                }, 2000);
            });
        }
    }
    
    animateButtonClick(button) {
        // Create ripple effect
        const ripple = document.createElement('span');
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255,255,255,0.6)';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 0.6s linear';
        ripple.style.left = '50%';
        ripple.style.top = '50%';
        ripple.style.width = '20px';
        ripple.style.height = '20px';
        ripple.style.marginLeft = '-10px';
        ripple.style.marginTop = '-10px';
        
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
        
        // Add ripple animation
        if (!document.querySelector('#ripple-animation')) {
            const style = document.createElement('style');
            style.id = 'ripple-animation';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    setButtonLoading(button, loading) {
        if (loading) {
            button.classList.add('modern-btn-loading');
            button.disabled = true;
        } else {
            button.classList.remove('modern-btn-loading');
            button.disabled = false;
        }
    }
    
    createModernCards() {
        // Update existing cards
        const cards = document.querySelectorAll('.card, .service-card, .product-card, .feature-card');
        cards.forEach(card => {
            this.enhanceCard(card);
        });
        
        // Create modern card styles
        const style = document.createElement('style');
        style.textContent = `
            .modern-card {
                position: relative;
                background: white;
                border-radius: 16px;
                padding: 24px;
                box-shadow: var(--shadow-modern-md);
                transition: all 0.3s var(--animation-smooth);
                border: 1px solid var(--gray-200);
                overflow: hidden;
            }
            
            .modern-card::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 4px;
                background: var(--gradient-primary);
                transform: scaleX(0);
                transition: transform 0.3s var(--animation-smooth);
            }
            
            .modern-card:hover {
                transform: translateY(-8px);
                box-shadow: var(--shadow-modern-2xl);
            }
            
            .modern-card:hover::before {
                transform: scaleX(1);
            }
            
            .modern-card-glass {
                background: var(--glass-bg);
                backdrop-filter: var(--glass-backdrop);
                border: 1px solid var(--glass-border);
                box-shadow: var(--glass-shadow);
            }
            
            .modern-card-gradient {
                background: var(--gradient-card);
                border: 1px solid rgba(255,255,255,0.2);
            }
            
            .modern-card-interactive {
                cursor: pointer;
            }
            
            .modern-card-interactive:hover {
                transform: translateY(-12px) scale(1.02);
            }
            
            .modern-card-header {
                margin-bottom: 16px;
                padding-bottom: 16px;
                border-bottom: 1px solid var(--gray-200);
            }
            
            .modern-card-title {
                font-family: var(--font-family-secondary);
                font-size: 20px;
                font-weight: 700;
                color: var(--gray-900);
                margin: 0 0 8px 0;
            }
            
            .modern-card-subtitle {
                font-size: 14px;
                color: var(--gray-600);
                margin: 0;
            }
            
            .modern-card-content {
                color: var(--gray-700);
                line-height: 1.6;
            }
            
            .modern-card-footer {
                margin-top: 16px;
                padding-top: 16px;
                border-top: 1px solid var(--gray-200);
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .modern-card-badge {
                display: inline-flex;
                align-items: center;
                padding: 4px 12px;
                background: var(--primary-100);
                color: var(--primary-700);
                border-radius: 20px;
                font-size: 12px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
        `;
        document.head.appendChild(style);
    }
    
    enhanceCard(card) {
        if (card.classList.contains('modern-card')) return;
        
        // Add modern card class
        card.classList.add('modern-card');
        
        // Determine card type
        if (card.classList.contains('service-card')) {
            card.classList.add('modern-card-interactive');
        }
        
        // Add card structure if missing
        if (!card.querySelector('.modern-card-header')) {
            const title = card.querySelector('h3, h4, .card-title');
            const subtitle = card.querySelector('.card-subtitle, .service-subtitle');
            const content = card.querySelector('p, .card-content');
            
            if (title || subtitle) {
                const header = document.createElement('div');
                header.className = 'modern-card-header';
                
                if (title) {
                    title.classList.add('modern-card-title');
                    header.appendChild(title);
                }
                
                if (subtitle) {
                    subtitle.classList.add('modern-card-subtitle');
                    header.appendChild(subtitle);
                }
                
                card.insertBefore(header, card.firstChild);
            }
            
            if (content) {
                content.classList.add('modern-card-content');
            }
        }
        
        // Add hover sound effect
        card.addEventListener('mouseenter', () => {
            this.playHoverSound();
        });
    }
    
    createModernModals() {
        // Create modal styles
        const style = document.createElement('style');
        style.textContent = `
            .modern-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(8px);
                z-index: var(--z-index-modal);
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s var(--animation-smooth);
            }
            
            .modern-modal.active {
                opacity: 1;
                visibility: visible;
            }
            
            .modern-modal-content {
                background: white;
                border-radius: 20px;
                padding: 32px;
                max-width: 500px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: var(--shadow-modern-2xl);
                transform: scale(0.8) translateY(50px);
                transition: all 0.3s var(--animation-smooth);
            }
            
            .modern-modal.active .modern-modal-content {
                transform: scale(1) translateY(0);
            }
            
            .modern-modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 24px;
                padding-bottom: 16px;
                border-bottom: 1px solid var(--gray-200);
            }
            
            .modern-modal-title {
                font-family: var(--font-family-secondary);
                font-size: 24px;
                font-weight: 700;
                color: var(--gray-900);
                margin: 0;
            }
            
            .modern-modal-close {
                background: none;
                border: none;
                font-size: 24px;
                color: var(--gray-500);
                cursor: pointer;
                padding: 4px;
                border-radius: 8px;
                transition: all 0.2s var(--animation-smooth);
            }
            
            .modern-modal-close:hover {
                background: var(--gray-100);
                color: var(--gray-700);
            }
            
            .modern-modal-body {
                margin-bottom: 24px;
                color: var(--gray-700);
                line-height: 1.6;
            }
            
            .modern-modal-footer {
                display: flex;
                gap: 12px;
                justify-content: flex-end;
            }
        `;
        document.head.appendChild(style);
    }
    
    createModal(title, content, options = {}) {
        const modal = document.createElement('div');
        modal.className = 'modern-modal';
        modal.innerHTML = `
            <div class="modern-modal-content">
                <div class="modern-modal-header">
                    <h3 class="modern-modal-title">${title}</h3>
                    <button class="modern-modal-close">&times;</button>
                </div>
                <div class="modern-modal-body">
                    ${content}
                </div>
                ${options.footer ? `<div class="modern-modal-footer">${options.footer}</div>` : ''}
            </div>
        `;
        
        // Add close functionality
        const closeBtn = modal.querySelector('.modern-modal-close');
        closeBtn.addEventListener('click', () => {
            this.closeModal(modal);
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal(modal);
            }
        });
        
        // Add to DOM
        document.body.appendChild(modal);
        
        // Show modal
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
        
        return modal;
    }
    
    closeModal(modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
    
    createModernNavigation() {
        // Update existing navigation
        const nav = document.querySelector('nav, .navigation, .navbar');
        if (nav) {
            this.enhanceNavigation(nav);
        }
        
        // Create navigation styles
        const style = document.createElement('style');
        style.textContent = `
            .modern-nav {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                z-index: var(--z-index-fixed);
                background: var(--glass-bg);
                backdrop-filter: var(--glass-backdrop);
                border-bottom: 1px solid var(--glass-border);
                transition: all 0.3s var(--animation-smooth);
            }
            
            .modern-nav.scrolled {
                background: rgba(255, 255, 255, 0.95);
                box-shadow: var(--shadow-modern-lg);
            }
            
            .modern-nav-container {
                max-width: 1200px;
                margin: 0 auto;
                padding: 0 24px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                height: 70px;
            }
            
            .modern-nav-logo {
                font-family: var(--font-family-secondary);
                font-size: 24px;
                font-weight: 700;
                color: var(--primary-color);
                text-decoration: none;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .modern-nav-links {
                display: flex;
                gap: 32px;
                list-style: none;
                margin: 0;
                padding: 0;
            }
            
            .modern-nav-link {
                color: var(--gray-700);
                text-decoration: none;
                font-weight: 500;
                padding: 8px 16px;
                border-radius: 8px;
                transition: all 0.2s var(--animation-smooth);
                position: relative;
            }
            
            .modern-nav-link:hover {
                color: var(--primary-color);
                background: var(--primary-50);
            }
            
            .modern-nav-link.active {
                color: var(--primary-color);
                background: var(--primary-100);
            }
            
            .modern-nav-link::after {
                content: '';
                position: absolute;
                bottom: -2px;
                left: 50%;
                width: 0;
                height: 2px;
                background: var(--primary-color);
                transition: all 0.3s var(--animation-smooth);
                transform: translateX(-50%);
            }
            
            .modern-nav-link:hover::after,
            .modern-nav-link.active::after {
                width: 100%;
            }
            
            .modern-nav-toggle {
                display: none;
                background: none;
                border: none;
                font-size: 24px;
                color: var(--gray-700);
                cursor: pointer;
                padding: 8px;
                border-radius: 8px;
                transition: all 0.2s var(--animation-smooth);
            }
            
            .modern-nav-toggle:hover {
                background: var(--gray-100);
            }
            
            @media (max-width: 768px) {
                .modern-nav-links {
                    position: fixed;
                    top: 70px;
                    left: 0;
                    right: 0;
                    background: white;
                    flex-direction: column;
                    padding: 24px;
                    box-shadow: var(--shadow-modern-lg);
                    transform: translateY(-100%);
                    transition: transform 0.3s var(--animation-smooth);
                }
                
                .modern-nav-links.active {
                    transform: translateY(0);
                }
                
                .modern-nav-toggle {
                    display: block;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    enhanceNavigation(nav) {
        if (nav.classList.contains('modern-nav')) return;
        
        // Add modern nav class
        nav.classList.add('modern-nav');
        
        // Add container if missing
        if (!nav.querySelector('.modern-nav-container')) {
            const container = document.createElement('div');
            container.className = 'modern-nav-container';
            
            // Move existing content to container
            while (nav.firstChild) {
                container.appendChild(nav.firstChild);
            }
            
            nav.appendChild(container);
        }
        
        // Add scroll effect
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        });
        
        // Enhance links
        const links = nav.querySelectorAll('a');
        links.forEach(link => {
            link.classList.add('modern-nav-link');
        });
    }
    
    setupAnimations() {
        // Intersection Observer for animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, {
            threshold: 0.1
        });
        
        // Observe elements
        const animatedElements = document.querySelectorAll('.modern-card, .modern-btn, .modern-nav-link');
        animatedElements.forEach(element => {
            observer.observe(element);
        });
        
        // Add animation styles
        const style = document.createElement('style');
        style.textContent = `
            .animate-in {
                animation: slideInUp 0.6s var(--animation-smooth) forwards;
            }
            
            @keyframes slideInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .fade-in {
                animation: fadeIn 0.6s var(--animation-smooth) forwards;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            .scale-in {
                animation: scaleIn 0.6s var(--animation-smooth) forwards;
            }
            
            @keyframes scaleIn {
                from {
                    opacity: 0;
                    transform: scale(0.8);
                }
                to {
                    opacity: 1;
                    transform: scale(1);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    setupInteractions() {
        // Add global click effects
        document.addEventListener('click', (e) => {
            if (e.target.matches('.modern-btn, .modern-card-interactive')) {
                this.createClickEffect(e.target, e);
            }
        });
        
        // Add keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                // Close any open modals
                const modals = document.querySelectorAll('.modern-modal.active');
                modals.forEach(modal => {
                    this.closeModal(modal);
                });
            }
        });
    }
    
    createClickEffect(element, event) {
        const rect = element.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        const effect = document.createElement('div');
        effect.style.position = 'absolute';
        effect.style.left = x + 'px';
        effect.style.top = y + 'px';
        effect.style.width = '4px';
        effect.style.height = '4px';
        effect.style.background = 'rgba(255,255,255,0.6)';
        effect.style.borderRadius = '50%';
        effect.style.transform = 'translate(-50%, -50%)';
        effect.style.pointerEvents = 'none';
        effect.style.animation = 'clickEffect 0.6s ease-out forwards';
        
        element.style.position = 'relative';
        element.appendChild(effect);
        
        setTimeout(() => {
            effect.remove();
        }, 600);
        
        // Add click effect animation
        if (!document.querySelector('#click-effect-animation')) {
            const style = document.createElement('style');
            style.id = 'click-effect-animation';
            style.textContent = `
                @keyframes clickEffect {
                    0% {
                        transform: translate(-50%, -50%) scale(0);
                        opacity: 1;
                    }
                    100% {
                        transform: translate(-50%, -50%) scale(20);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    playHoverSound() {
        if (!this.componentConfig.soundEffects) return;
        
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        } catch (error) {
            console.log('Sound not available:', error);
        }
    }
    
    // Public API
    getComponentConfig() {
        return this.componentConfig;
    }
    
    updateComponentConfig(newConfig) {
        this.componentConfig = { ...this.componentConfig, ...newConfig };
        console.log('🎨 Component config updated:', this.componentConfig);
    }
    
    createButton(text, options = {}) {
        const button = document.createElement('button');
        button.textContent = text;
        button.className = `modern-btn ${options.type || 'modern-btn-primary'}`;
        
        if (options.onClick) {
            button.addEventListener('click', options.onClick);
        }
        
        return button;
    }
    
    createCard(title, content, options = {}) {
        const card = document.createElement('div');
        card.className = `modern-card ${options.type || ''}`;
        card.innerHTML = `
            <div class="modern-card-header">
                <h3 class="modern-card-title">${title}</h3>
            </div>
            <div class="modern-card-content">${content}</div>
        `;
        
        return card;
    }
    
    showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `modern-notification modern-notification-${type}`;
        notification.textContent = message;
        
        // Add notification styles
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .modern-notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 16px 24px;
                    border-radius: 12px;
                    color: white;
                    font-weight: 500;
                    z-index: var(--z-index-toast);
                    transform: translateX(100%);
                    transition: transform 0.3s var(--animation-smooth);
                }
                
                .modern-notification.show {
                    transform: translateX(0);
                }
                
                .modern-notification-info {
                    background: var(--primary-color);
                }
                
                .modern-notification-success {
                    background: var(--success-color);
                }
                
                .modern-notification-warning {
                    background: var(--warning-color);
                }
                
                .modern-notification-error {
                    background: var(--danger-color);
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, duration);
    }
}

// Initialize modern components when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    const modernComponents = new ModernComponents();
    
    // Export for external use
    window.modernComponents = modernComponents;
    
    console.log('✅ Modern Components ready!');
});

console.log('✅ Modern Components script loaded!');
