/**
 * DC TEKNİK - Accessibility Module
 * WCAG 2.1 AA uyumluluğu için kapsamlı erişilebilirlik sistemi
 */

(function() {
    'use strict';

    const AccessibilityModule = {
        skipLinksVisible: false,
        focusVisible: false,
        highContrastMode: false,
        fontSize: 16,
        
        init() {
            // Keyboard navigation
            this.initKeyboardNavigation();
            
            // Skip links
            this.initSkipLinks();
            
            // Focus management
            this.initFocusManagement();
            
            // ARIA live regions
            this.initLiveRegions();
            
            // High contrast mode
            this.initHighContrastMode();
            
            // Font size adjustment
            this.initFontSizeAdjustment();
            
            // Form accessibility
            this.initFormAccessibility();
            
            // Announcements
            this.initAnnouncements();
            
            // Log initialization
            const safeLog = window.safeLog || console.log;
            safeLog('♿ Accessibility module initialized');
        },
        
        /**
         * Keyboard Navigation - Tab, Enter, Escape, Arrow keys
         */
        initKeyboardNavigation() {
            document.addEventListener('keydown', (e) => {
                // Skip links toggle
                if (e.key === 'Tab' && !this.skipLinksVisible) {
                    this.showSkipLinks();
                }
                
                // Escape key handling
                if (e.key === 'Escape') {
                    this.handleEscapeKey(e);
                }
                
                // Arrow key navigation for custom components
                if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                    this.handleArrowKeys(e);
                }
                
                // Focus trap for modals
                if (e.key === 'Tab') {
                    this.handleFocusTrap(e);
                }
            });
        },
        
        /**
         * Skip Links - Ana içeriğe hızlı erişim
         */
        initSkipLinks() {
            // Skip links container
            const skipContainer = document.createElement('div');
            skipContainer.className = 'skip-links';
            skipContainer.setAttribute('role', 'navigation');
            skipContainer.setAttribute('aria-label', 'Ana içeriğe atla');
            
            const skipLinks = [
                { href: '#home', text: 'Ana içeriğe atla' },
                { href: '#services', text: 'Hizmetlere atla' },
                { href: '#about', text: 'Hakkımızda bölümüne atla' },
                { href: '#contact', text: 'İletişim bölümüne atla' },
                { href: '#main-content', text: 'İçeriğe atla' }
            ];
            
            skipLinks.forEach(link => {
                const skipLink = document.createElement('a');
                skipLink.href = link.href;
                skipLink.textContent = link.text;
                skipLink.className = 'skip-link';
                skipLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    const target = document.querySelector(link.href);
                    if (target) {
                        target.setAttribute('tabindex', '-1');
                        target.focus();
                        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        
                        // Remove tabindex after focus
                        setTimeout(() => {
                            target.removeAttribute('tabindex');
                        }, 1000);
                    }
                });
                skipContainer.appendChild(skipLink);
            });
            
            // Insert at the beginning of body
            document.body.insertBefore(skipContainer, document.body.firstChild);
            
            // Hide skip links by default
            this.hideSkipLinks();
        },
        
        showSkipLinks() {
            const skipLinks = document.querySelector('.skip-links');
            if (skipLinks) {
                skipLinks.classList.add('visible');
                this.skipLinksVisible = true;
                
                // Hide when focus moves away
                setTimeout(() => {
                    document.addEventListener('click', this.hideSkipLinks.bind(this), { once: true });
                }, 100);
            }
        },
        
        hideSkipLinks() {
            const skipLinks = document.querySelector('.skip-links');
            if (skipLinks) {
                skipLinks.classList.remove('visible');
                this.skipLinksVisible = false;
            }
        },
        
        /**
         * Focus Management
         */
        initFocusManagement() {
            // Detect focus visible
            document.addEventListener('keydown', () => {
                this.focusVisible = true;
                document.body.classList.add('keyboard-navigation');
            }, true);
            
            document.addEventListener('mousedown', () => {
                this.focusVisible = false;
                document.body.classList.remove('keyboard-navigation');
            }, true);
            
            // Focus indicators for all interactive elements
            const interactiveElements = document.querySelectorAll(
                'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            
            interactiveElements.forEach(el => {
                el.addEventListener('focus', () => {
                    if (this.focusVisible) {
                        el.classList.add('focus-visible');
                    }
                });
                
                el.addEventListener('blur', () => {
                    el.classList.remove('focus-visible');
                });
            });
        },
        
        /**
         * ARIA Live Regions - Screen reader announcements
         */
        initLiveRegions() {
            // Create live regions
            const politeRegion = document.createElement('div');
            politeRegion.id = 'a11y-live-region-polite';
            politeRegion.className = 'sr-only';
            politeRegion.setAttribute('role', 'status');
            politeRegion.setAttribute('aria-live', 'polite');
            politeRegion.setAttribute('aria-atomic', 'true');
            
            const assertiveRegion = document.createElement('div');
            assertiveRegion.id = 'a11y-live-region-assertive';
            assertiveRegion.className = 'sr-only';
            assertiveRegion.setAttribute('role', 'alert');
            assertiveRegion.setAttribute('aria-live', 'assertive');
            assertiveRegion.setAttribute('aria-atomic', 'true');
            
            document.body.appendChild(politeRegion);
            document.body.appendChild(assertiveRegion);
        },
        
        /**
         * Announce to screen readers
         */
        announce(message, priority = 'polite') {
            const regionId = priority === 'assertive' 
                ? 'a11y-live-region-assertive' 
                : 'a11y-live-region-polite';
            const region = document.getElementById(regionId);
            
            if (region) {
                region.textContent = '';
                setTimeout(() => {
                    region.textContent = message;
                }, 100);
            }
        },
        
        /**
         * High Contrast Mode
         */
        initHighContrastMode() {
            // Check for system preference
            if (window.matchMedia && window.matchMedia('(prefers-contrast: high)').matches) {
                this.enableHighContrast();
            }
            
            // Toggle button (can be added to UI later)
            if (typeof window.enableHighContrast === 'undefined') {
                window.enableHighContrast = () => this.enableHighContrast();
                window.disableHighContrast = () => this.disableHighContrast();
            }
        },
        
        enableHighContrast() {
            document.body.classList.add('high-contrast');
            this.highContrastMode = true;
            this.announce('Yüksek kontrast modu etkinleştirildi');
        },
        
        disableHighContrast() {
            document.body.classList.remove('high-contrast');
            this.highContrastMode = false;
            this.announce('Yüksek kontrast modu kapatıldı');
        },
        
        /**
         * Font Size Adjustment
         */
        initFontSizeAdjustment() {
            // Store user preference
            const savedSize = localStorage.getItem('a11y-font-size');
            if (savedSize) {
                this.fontSize = parseInt(savedSize, 10);
                this.applyFontSize();
            }
            
            // Expose global functions
            window.increaseFontSize = () => {
                this.fontSize = Math.min(this.fontSize + 2, 24);
                this.applyFontSize();
                localStorage.setItem('a11y-font-size', this.fontSize);
                this.announce(`Font boyutu: ${this.fontSize} piksel`);
            };
            
            window.decreaseFontSize = () => {
                this.fontSize = Math.max(this.fontSize - 2, 12);
                this.applyFontSize();
                localStorage.setItem('a11y-font-size', this.fontSize);
                this.announce(`Font boyutu: ${this.fontSize} piksel`);
            };
            
            window.resetFontSize = () => {
                this.fontSize = 16;
                this.applyFontSize();
                localStorage.removeItem('a11y-font-size');
                this.announce('Font boyutu sıfırlandı');
            };
        },
        
        applyFontSize() {
            document.documentElement.style.fontSize = `${this.fontSize}px`;
        },
        
        /**
         * Form Accessibility
         */
        initFormAccessibility() {
            const forms = document.querySelectorAll('form');
            
            forms.forEach(form => {
                // Add ARIA attributes
                form.setAttribute('novalidate', 'novalidate'); // We'll handle validation ourselves
                
                const inputs = form.querySelectorAll('input, textarea, select');
                inputs.forEach(input => {
                    // Associate labels
                    if (input.id) {
                        const label = form.querySelector(`label[for="${input.id}"]`);
                        if (label && !input.getAttribute('aria-labelledby')) {
                            input.setAttribute('aria-labelledby', `label-${input.id}`);
                            label.id = `label-${input.id}`;
                        }
                    }
                    
                    // Required fields
                    if (input.hasAttribute('required')) {
                        input.setAttribute('aria-required', 'true');
                        const label = form.querySelector(`label[for="${input.id}"]`);
                        if (label) {
                            const requiredText = label.textContent + ' (zorunlu)';
                            input.setAttribute('aria-label', requiredText);
                        }
                    }
                    
                    // Error messages
                    input.addEventListener('invalid', (e) => {
                        this.handleFormError(input, e);
                    });
                    
                    input.addEventListener('blur', () => {
                        this.validateField(input);
                    });
                });
            });
        },
        
        handleFormError(input, event) {
            event.preventDefault();
            
            // Create or update error message
            let errorId = input.id + '-error';
            let errorElement = document.getElementById(errorId);
            
            if (!errorElement) {
                errorElement = document.createElement('div');
                errorElement.id = errorId;
                errorElement.className = 'error-message';
                errorElement.setAttribute('role', 'alert');
                errorElement.setAttribute('aria-live', 'assertive');
                
                // Insert after input
                input.parentNode.insertBefore(errorElement, input.nextSibling);
            }
            
            // Set error message
            let message = '';
            if (input.validity.valueMissing) {
                message = 'Bu alan zorunludur';
            } else if (input.validity.typeMismatch) {
                message = 'Geçerli bir ' + input.type + ' giriniz';
            } else if (input.validity.patternMismatch) {
                message = 'Geçerli bir format giriniz';
            } else if (input.validity.tooShort) {
                message = 'Minimum ' + input.minLength + ' karakter girmelisiniz';
            } else if (input.validity.tooLong) {
                message = 'Maksimum ' + input.maxLength + ' karakter girebilirsiniz';
            } else {
                message = 'Geçerli bir değer giriniz';
            }
            
            errorElement.textContent = message;
            input.setAttribute('aria-invalid', 'true');
            input.setAttribute('aria-describedby', errorId);
            
            // Announce error
            this.announce(`Hata: ${message}`, 'assertive');
        },
        
        validateField(input) {
            if (input.checkValidity()) {
                // Remove error
                const errorId = input.id + '-error';
                const errorElement = document.getElementById(errorId);
                if (errorElement) {
                    errorElement.remove();
                }
                input.removeAttribute('aria-invalid');
                input.removeAttribute('aria-describedby');
            }
        },
        
        /**
         * Handle Escape Key
         */
        handleEscapeKey(event) {
            // Close modals
            const modals = document.querySelectorAll('.modal.active, .chat-window.active');
            modals.forEach(modal => {
                const closeBtn = modal.querySelector('[aria-label*="Kapat"], .close, .chat-close');
                if (closeBtn) {
                    closeBtn.click();
                }
            });
            
            // Close dropdowns
            const dropdowns = document.querySelectorAll('[aria-expanded="true"]');
            dropdowns.forEach(dropdown => {
                dropdown.setAttribute('aria-expanded', 'false');
                dropdown.click();
            });
        },
        
        /**
         * Handle Arrow Keys
         */
        handleArrowKeys(event) {
            // For custom dropdowns, lists, etc.
            const target = event.target;
            
            if (target.classList.contains('menu-item') || target.closest('.nav-menu')) {
                this.handleMenuNavigation(event, target);
            }
        },
        
        handleMenuNavigation(event, currentItem) {
            const menuItems = Array.from(document.querySelectorAll('.nav-menu a'));
            const currentIndex = menuItems.indexOf(currentItem);
            
            let nextIndex;
            if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
                nextIndex = (currentIndex + 1) % menuItems.length;
            } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
                nextIndex = currentIndex === 0 ? menuItems.length - 1 : currentIndex - 1;
            }
            
            if (nextIndex !== undefined && menuItems[nextIndex]) {
                event.preventDefault();
                menuItems[nextIndex].focus();
            }
        },
        
        /**
         * Focus Trap for Modals
         */
        handleFocusTrap(event) {
            const modal = document.querySelector('.modal.active, .chat-window.active');
            if (!modal) return;
            
            const focusableElements = modal.querySelectorAll(
                'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            if (event.shiftKey) {
                if (document.activeElement === firstElement) {
                    event.preventDefault();
                    lastElement.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    event.preventDefault();
                    firstElement.focus();
                }
            }
        },
        
        /**
         * Announcements
         */
        initAnnouncements() {
            // Page load announcement
            window.addEventListener('load', () => {
                setTimeout(() => {
                    this.announce('DC TEKNİK web sitesi yüklendi. Ana içeriğe atlamak için Tab tuşuna basın.');
                }, 500);
            });
        },
        
        /**
         * Get current accessibility status
         */
        getStatus() {
            return {
                focusVisible: this.focusVisible,
                highContrastMode: this.highContrastMode,
                fontSize: this.fontSize,
                keyboardNavigation: document.body.classList.contains('keyboard-navigation')
            };
        }
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => AccessibilityModule.init());
    } else {
        AccessibilityModule.init();
    }

    // Export globally
    window.AccessibilityModule = AccessibilityModule;
})();

