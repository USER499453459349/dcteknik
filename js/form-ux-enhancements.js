// Form UX Enhancements - DC TEKNİK
(function() {
    'use strict';
    
    // Form validation and UX improvements
    class FormUXEnhancements {
        constructor() {
            this.forms = document.querySelectorAll('form');
            this.init();
        }
        
        init() {
            this.enhanceForms();
            this.addFormValidation();
            this.addFormAnimations();
            this.addFormAccessibility();
            this.addFormAnalytics();
        }
        
        enhanceForms() {
            this.forms.forEach(form => {
                this.addFormStyling(form);
                this.addFormInteractions(form);
                this.addFormProgress(form);
            });
        }
        
        addFormStyling(form) {
            // Add enhanced styling classes
            form.classList.add('enhanced-form');
            
            // Style form groups
            const formGroups = form.querySelectorAll('.form-group');
            formGroups.forEach(group => {
                group.classList.add('enhanced-form-group');
                this.addFloatingLabels(group);
            });
            
            // Style buttons
            const buttons = form.querySelectorAll('button, input[type="submit"]');
            buttons.forEach(button => {
                button.classList.add('enhanced-button');
                this.addButtonStates(button);
            });
        }
        
        addFloatingLabels(formGroup) {
            const input = formGroup.querySelector('input, select, textarea');
            const label = formGroup.querySelector('label');
            
            if (!input || !label) return;
            
            // Create floating label effect
            const floatingLabel = document.createElement('span');
            floatingLabel.className = 'floating-label';
            floatingLabel.textContent = label.textContent;
            
            // Hide original label
            label.style.display = 'none';
            
            // Add floating label
            formGroup.appendChild(floatingLabel);
            
            // Handle focus and blur events
            input.addEventListener('focus', () => {
                floatingLabel.classList.add('active');
                formGroup.classList.add('focused');
            });
            
            input.addEventListener('blur', () => {
                if (!input.value) {
                    floatingLabel.classList.remove('active');
                    formGroup.classList.remove('focused');
                }
            });
            
            // Check if input has value on load
            if (input.value) {
                floatingLabel.classList.add('active');
            }
        }
        
        addButtonStates(button) {
            // Add loading state
            button.addEventListener('click', (e) => {
                if (button.type === 'submit') {
                    this.showButtonLoading(button);
                }
            });
            
            // Add ripple effect
            button.addEventListener('click', (e) => {
                this.addRippleEffect(e, button);
            });
        }
        
        showButtonLoading(button) {
            const originalText = button.textContent;
            button.textContent = 'Gönderiliyor...';
            button.disabled = true;
            button.classList.add('loading');
            
            // Add spinner
            const spinner = document.createElement('span');
            spinner.className = 'button-spinner';
            spinner.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            button.appendChild(spinner);
            
            // Reset after form submission (handled by form submission)
            setTimeout(() => {
                button.textContent = originalText;
                button.disabled = false;
                button.classList.remove('loading');
                spinner.remove();
            }, 3000);
        }
        
        addRippleEffect(e, button) {
            const ripple = document.createElement('span');
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            button.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        }
        
        addFormValidation() {
            this.forms.forEach(form => {
                const inputs = form.querySelectorAll('input, select, textarea');
                
                inputs.forEach(input => {
                    this.addInputValidation(input);
                    this.addRealTimeValidation(input);
                });
                
                // Add form submission validation
                form.addEventListener('submit', (e) => {
                    if (!this.validateForm(form)) {
                        e.preventDefault();
                        this.showFormErrors(form);
                    }
                });
            });
        }
        
        addInputValidation(input) {
            // Add validation classes based on input type
            if (input.type === 'email') {
                input.addEventListener('blur', () => {
                    this.validateEmail(input);
                });
            }
            
            if (input.type === 'tel') {
                input.addEventListener('input', () => {
                    this.formatPhoneNumber(input);
                });
            }
            
            if (input.required) {
                input.addEventListener('blur', () => {
                    this.validateRequired(input);
                });
            }
        }
        
        validateEmail(input) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const isValid = emailRegex.test(input.value);
            
            this.setInputState(input, isValid);
            return isValid;
        }
        
        validateRequired(input) {
            const isValid = input.value.trim() !== '';
            this.setInputState(input, isValid);
            return isValid;
        }
        
        formatPhoneNumber(input) {
            let value = input.value.replace(/\D/g, '');
            if (value.length > 0) {
                if (value.length <= 3) {
                    value = value;
                } else if (value.length <= 6) {
                    value = value.slice(0, 3) + ' ' + value.slice(3);
                } else if (value.length <= 8) {
                    value = value.slice(0, 3) + ' ' + value.slice(3, 6) + ' ' + value.slice(6);
                } else if (value.length <= 10) {
                    value = value.slice(0, 3) + ' ' + value.slice(3, 6) + ' ' + value.slice(6, 8) + ' ' + value.slice(8);
                } else {
                    value = value.slice(0, 3) + ' ' + value.slice(3, 6) + ' ' + value.slice(6, 8) + ' ' + value.slice(8, 10);
                }
            }
            input.value = value;
        }
        
        setInputState(input, isValid) {
            const formGroup = input.closest('.form-group');
            if (isValid) {
                input.classList.remove('invalid');
                input.classList.add('valid');
                formGroup.classList.remove('error');
                formGroup.classList.add('success');
            } else {
                input.classList.remove('valid');
                input.classList.add('invalid');
                formGroup.classList.remove('success');
                formGroup.classList.add('error');
            }
        }
        
        addRealTimeValidation(input) {
            let timeout;
            input.addEventListener('input', () => {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    if (input.type === 'email') {
                        this.validateEmail(input);
                    } else if (input.required) {
                        this.validateRequired(input);
                    }
                }, 500);
            });
        }
        
        validateForm(form) {
            const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
            let isValid = true;
            
            inputs.forEach(input => {
                if (input.type === 'email') {
                    if (!this.validateEmail(input)) {
                        isValid = false;
                    }
                } else if (input.required) {
                    if (!this.validateRequired(input)) {
                        isValid = false;
                    }
                }
            });
            
            return isValid;
        }
        
        showFormErrors(form) {
            const errorInputs = form.querySelectorAll('.invalid');
            errorInputs.forEach(input => {
                this.showInputError(input);
            });
            
            // Scroll to first error
            if (errorInputs.length > 0) {
                errorInputs[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
        
        showInputError(input) {
            const formGroup = input.closest('.form-group');
            let errorMessage = formGroup.querySelector('.error-message');
            
            if (!errorMessage) {
                errorMessage = document.createElement('div');
                errorMessage.className = 'error-message';
                formGroup.appendChild(errorMessage);
            }
            
            let message = 'Bu alan gereklidir';
            if (input.type === 'email') {
                message = 'Geçerli bir e-posta adresi girin';
            } else if (input.type === 'tel') {
                message = 'Geçerli bir telefon numarası girin';
            }
            
            errorMessage.textContent = message;
            errorMessage.style.display = 'block';
        }
        
        addFormAnimations() {
            this.forms.forEach(form => {
                // Add form entrance animation
                form.style.opacity = '0';
                form.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    form.style.transition = 'all 0.6s ease';
                    form.style.opacity = '1';
                    form.style.transform = 'translateY(0)';
                }, 100);
                
                // Add field animations
                const formGroups = form.querySelectorAll('.form-group');
                formGroups.forEach((group, index) => {
                    group.style.opacity = '0';
                    group.style.transform = 'translateX(-20px)';
                    
                    setTimeout(() => {
                        group.style.transition = 'all 0.4s ease';
                        group.style.opacity = '1';
                        group.style.transform = 'translateX(0)';
                    }, 200 + (index * 100));
                });
            });
        }
        
        addFormAccessibility() {
            this.forms.forEach(form => {
                // Add ARIA labels
                const inputs = form.querySelectorAll('input, select, textarea');
                inputs.forEach(input => {
                    if (!input.getAttribute('aria-label') && !input.getAttribute('aria-labelledby')) {
                        const label = form.querySelector(`label[for="${input.id}"]`);
                        if (label) {
                            input.setAttribute('aria-labelledby', label.id || 'label-' + input.id);
                            if (!label.id) {
                                label.id = 'label-' + input.id;
                            }
                        }
                    }
                });
                
                // Add form description
                if (!form.getAttribute('aria-describedby')) {
                    const description = document.createElement('div');
                    description.id = 'form-description-' + Math.random().toString(36).substr(2, 9);
                    description.className = 'sr-only';
                    description.textContent = 'Bu formu doldurarak bizimle iletişime geçebilirsiniz';
                    form.appendChild(description);
                    form.setAttribute('aria-describedby', description.id);
                }
            });
        }
        
        addFormAnalytics() {
            this.forms.forEach(form => {
                // Track form interactions
                const inputs = form.querySelectorAll('input, select, textarea');
                
                inputs.forEach(input => {
                    input.addEventListener('focus', () => {
                        this.trackFormEvent('form_field_focus', {
                            form_name: form.name || 'contact_form',
                            field_name: input.name || input.id,
                            field_type: input.type
                        });
                    });
                    
                    input.addEventListener('blur', () => {
                        this.trackFormEvent('form_field_blur', {
                            form_name: form.name || 'contact_form',
                            field_name: input.name || input.id,
                            field_type: input.type,
                            has_value: input.value.length > 0
                        });
                    });
                });
                
                // Track form submission
                form.addEventListener('submit', () => {
                    this.trackFormEvent('form_submit', {
                        form_name: form.name || 'contact_form',
                        form_fields: inputs.length
                    });
                });
            });
        }
        
        trackFormEvent(eventName, parameters) {
            if (typeof gtag !== 'undefined') {
                gtag('event', eventName, {
                    event_category: 'form_interaction',
                    event_label: parameters.form_name,
                    ...parameters
                });
            }
        }
        
        addFormProgress(form) {
            const progressBar = document.createElement('div');
            progressBar.className = 'form-progress';
            progressBar.innerHTML = '<div class="form-progress-bar"></div>';
            
            form.insertBefore(progressBar, form.firstChild);
            
            const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
            const progressBarElement = progressBar.querySelector('.form-progress-bar');
            
            const updateProgress = () => {
                const filledInputs = Array.from(inputs).filter(input => input.value.trim() !== '');
                const progress = (filledInputs.length / inputs.length) * 100;
                progressBarElement.style.width = progress + '%';
            };
            
            inputs.forEach(input => {
                input.addEventListener('input', updateProgress);
                input.addEventListener('change', updateProgress);
            });
        }
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            new FormUXEnhancements();
        });
    } else {
        new FormUXEnhancements();
    }
})();


