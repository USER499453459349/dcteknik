/**
 * DC TEKNİK Modern Design System
 * Modern grafik tasarım sistemi ve görsel geliştirmeler
 * 
 * Features:
 * - Modern color palette
 * - Typography system
 * - Component library
 * - Animation system
 * - Icon system
 * - Layout system
 * - Responsive design
 * - Dark mode support
 */

class ModernDesign {
    constructor() {
        this.designConfig = {
            theme: 'light', // 'light' or 'dark'
            colorScheme: 'modern',
            typography: 'inter',
            animations: true,
            shadows: true,
            gradients: true,
            glassmorphism: true
        };
        
        this.colorPalette = {
            primary: {
                50: '#f0f9ff',
                100: '#e0f2fe',
                200: '#bae6fd',
                300: '#7dd3fc',
                400: '#38bdf8',
                500: '#0ea5e9',
                600: '#0284c7',
                700: '#0369a1',
                800: '#075985',
                900: '#0c4a6e'
            },
            secondary: {
                50: '#faf5ff',
                100: '#f3e8ff',
                200: '#e9d5ff',
                300: '#d8b4fe',
                400: '#c084fc',
                500: '#a855f7',
                600: '#9333ea',
                700: '#7c3aed',
                800: '#6b21a8',
                900: '#581c87'
            },
            accent: {
                50: '#fff7ed',
                100: '#ffedd5',
                200: '#fed7aa',
                300: '#fdba74',
                400: '#fb923c',
                500: '#f97316',
                600: '#ea580c',
                700: '#c2410c',
                800: '#9a3412',
                900: '#7c2d12'
            },
            neutral: {
                50: '#fafafa',
                100: '#f5f5f5',
                200: '#e5e5e5',
                300: '#d4d4d4',
                400: '#a3a3a3',
                500: '#737373',
                600: '#525252',
                700: '#404040',
                800: '#262626',
                900: '#171717'
            }
        };
        
        this.typography = {
            fontFamily: {
                primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                secondary: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                mono: "'JetBrains Mono', 'Fira Code', monospace"
            },
            fontSize: {
                xs: '0.75rem',
                sm: '0.875rem',
                base: '1rem',
                lg: '1.125rem',
                xl: '1.25rem',
                '2xl': '1.5rem',
                '3xl': '1.875rem',
                '4xl': '2.25rem',
                '5xl': '3rem',
                '6xl': '3.75rem'
            },
            fontWeight: {
                light: '300',
                normal: '400',
                medium: '500',
                semibold: '600',
                bold: '700',
                extrabold: '800'
            },
            lineHeight: {
                tight: '1.25',
                snug: '1.375',
                normal: '1.5',
                relaxed: '1.625',
                loose: '2'
            }
        };
        
        this.spacing = {
            xs: '0.25rem',
            sm: '0.5rem',
            md: '1rem',
            lg: '1.5rem',
            xl: '2rem',
            '2xl': '3rem',
            '3xl': '4rem',
            '4xl': '6rem'
        };
        
        this.shadows = {
            sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
            md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)'
        };
        
        this.borderRadius = {
            none: '0',
            sm: '0.125rem',
            base: '0.25rem',
            md: '0.375rem',
            lg: '0.5rem',
            xl: '0.75rem',
            '2xl': '1rem',
            '3xl': '1.5rem',
            full: '9999px'
        };
        
        this.animations = {
            duration: {
                fast: '150ms',
                normal: '300ms',
                slow: '500ms'
            },
            easing: {
                linear: 'linear',
                ease: 'ease',
                easeIn: 'ease-in',
                easeOut: 'ease-out',
                easeInOut: 'ease-in-out',
                bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                elastic: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }
        };
        
        this.init();
    }
    
    init() {
        console.log('🎨 Modern Design System initialized');
        this.loadGoogleFonts();
        this.applyDesignSystem();
        this.setupThemeToggle();
        this.setupResponsiveDesign();
        this.setupAnimations();
    }
    
    loadGoogleFonts() {
        // Load Inter font
        const interLink = document.createElement('link');
        interLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap';
        interLink.rel = 'stylesheet';
        document.head.appendChild(interLink);
        
        // Load Poppins font
        const poppinsLink = document.createElement('link');
        poppinsLink.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap';
        poppinsLink.rel = 'stylesheet';
        document.head.appendChild(poppinsLink);
        
        // Load JetBrains Mono font
        const monoLink = document.createElement('link');
        monoLink.href = 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&display=swap';
        monoLink.rel = 'stylesheet';
        document.head.appendChild(monoLink);
    }
    
    applyDesignSystem() {
        const style = document.createElement('style');
        style.textContent = this.generateDesignCSS();
        document.head.appendChild(style);
        
        // Apply CSS custom properties
        this.applyCSSVariables();
        
        // Update existing elements
        this.updateExistingElements();
    }
    
    generateDesignCSS() {
        return `
            /* Modern Design System CSS */
            :root {
                /* Color Variables */
                --color-primary-50: ${this.colorPalette.primary[50]};
                --color-primary-100: ${this.colorPalette.primary[100]};
                --color-primary-200: ${this.colorPalette.primary[200]};
                --color-primary-300: ${this.colorPalette.primary[300]};
                --color-primary-400: ${this.colorPalette.primary[400]};
                --color-primary-500: ${this.colorPalette.primary[500]};
                --color-primary-600: ${this.colorPalette.primary[600]};
                --color-primary-700: ${this.colorPalette.primary[700]};
                --color-primary-800: ${this.colorPalette.primary[800]};
                --color-primary-900: ${this.colorPalette.primary[900]};
                
                --color-secondary-50: ${this.colorPalette.secondary[50]};
                --color-secondary-100: ${this.colorPalette.secondary[100]};
                --color-secondary-200: ${this.colorPalette.secondary[200]};
                --color-secondary-300: ${this.colorPalette.secondary[300]};
                --color-secondary-400: ${this.colorPalette.secondary[400]};
                --color-secondary-500: ${this.colorPalette.secondary[500]};
                --color-secondary-600: ${this.colorPalette.secondary[600]};
                --color-secondary-700: ${this.colorPalette.secondary[700]};
                --color-secondary-800: ${this.colorPalette.secondary[800]};
                --color-secondary-900: ${this.colorPalette.secondary[900]};
                
                --color-accent-50: ${this.colorPalette.accent[50]};
                --color-accent-100: ${this.colorPalette.accent[100]};
                --color-accent-200: ${this.colorPalette.accent[200]};
                --color-accent-300: ${this.colorPalette.accent[300]};
                --color-accent-400: ${this.colorPalette.accent[400]};
                --color-accent-500: ${this.colorPalette.accent[500]};
                --color-accent-600: ${this.colorPalette.accent[600]};
                --color-accent-700: ${this.colorPalette.accent[700]};
                --color-accent-800: ${this.colorPalette.accent[800]};
                --color-accent-900: ${this.colorPalette.accent[900]};
                
                --color-neutral-50: ${this.colorPalette.neutral[50]};
                --color-neutral-100: ${this.colorPalette.neutral[100]};
                --color-neutral-200: ${this.colorPalette.neutral[200]};
                --color-neutral-300: ${this.colorPalette.neutral[300]};
                --color-neutral-400: ${this.colorPalette.neutral[400]};
                --color-neutral-500: ${this.colorPalette.neutral[500]};
                --color-neutral-600: ${this.colorPalette.neutral[600]};
                --color-neutral-700: ${this.colorPalette.neutral[700]};
                --color-neutral-800: ${this.colorPalette.neutral[800]};
                --color-neutral-900: ${this.colorPalette.neutral[900]};
                
                /* Typography Variables */
                --font-primary: ${this.typography.fontFamily.primary};
                --font-secondary: ${this.typography.fontFamily.secondary};
                --font-mono: ${this.typography.fontFamily.mono};
                
                /* Spacing Variables */
                --spacing-xs: ${this.spacing.xs};
                --spacing-sm: ${this.spacing.sm};
                --spacing-md: ${this.spacing.md};
                --spacing-lg: ${this.spacing.lg};
                --spacing-xl: ${this.spacing.xl};
                --spacing-2xl: ${this.spacing['2xl']};
                --spacing-3xl: ${this.spacing['3xl']};
                --spacing-4xl: ${this.spacing['4xl']};
                
                /* Shadow Variables */
                --shadow-sm: ${this.shadows.sm};
                --shadow-base: ${this.shadows.base};
                --shadow-md: ${this.shadows.md};
                --shadow-lg: ${this.shadows.lg};
                --shadow-xl: ${this.shadows.xl};
                --shadow-2xl: ${this.shadows['2xl']};
                --shadow-inner: ${this.shadows.inner};
                
                /* Border Radius Variables */
                --radius-none: ${this.borderRadius.none};
                --radius-sm: ${this.borderRadius.sm};
                --radius-base: ${this.borderRadius.base};
                --radius-md: ${this.borderRadius.md};
                --radius-lg: ${this.borderRadius.lg};
                --radius-xl: ${this.borderRadius.xl};
                --radius-2xl: ${this.borderRadius['2xl']};
                --radius-3xl: ${this.borderRadius['3xl']};
                --radius-full: ${this.borderRadius.full};
                
                /* Animation Variables */
                --duration-fast: ${this.animations.duration.fast};
                --duration-normal: ${this.animations.duration.normal};
                --duration-slow: ${this.animations.duration.slow};
                --easing-linear: ${this.animations.easing.linear};
                --easing-ease: ${this.animations.easing.ease};
                --easing-ease-in: ${this.animations.easing.easeIn};
                --easing-ease-out: ${this.animations.easing.easeOut};
                --easing-ease-in-out: ${this.animations.easing.easeInOut};
                --easing-bounce: ${this.animations.easing.bounce};
                --easing-elastic: ${this.animations.easing.elastic};
            }
            
            /* Dark Mode Variables */
            [data-theme="dark"] {
                --color-primary-50: ${this.colorPalette.primary[900]};
                --color-primary-100: ${this.colorPalette.primary[800]};
                --color-primary-200: ${this.colorPalette.primary[700]};
                --color-primary-300: ${this.colorPalette.primary[600]};
                --color-primary-400: ${this.colorPalette.primary[500]};
                --color-primary-500: ${this.colorPalette.primary[400]};
                --color-primary-600: ${this.colorPalette.primary[300]};
                --color-primary-700: ${this.colorPalette.primary[200]};
                --color-primary-800: ${this.colorPalette.primary[100]};
                --color-primary-900: ${this.colorPalette.primary[50]};
            }
            
            /* Modern Component Styles */
            .modern-card {
                background: white;
                border-radius: var(--radius-xl);
                box-shadow: var(--shadow-lg);
                padding: var(--spacing-xl);
                transition: all var(--duration-normal) var(--easing-ease);
                border: 1px solid var(--color-neutral-200);
            }
            
            .modern-card:hover {
                transform: translateY(-4px);
                box-shadow: var(--shadow-2xl);
            }
            
            .modern-button {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: var(--spacing-sm);
                padding: var(--spacing-sm) var(--spacing-lg);
                border-radius: var(--radius-lg);
                font-family: var(--font-primary);
                font-weight: 600;
                font-size: var(--font-size-base);
                line-height: var(--line-height-normal);
                transition: all var(--duration-normal) var(--easing-ease);
                cursor: pointer;
                border: none;
                text-decoration: none;
                position: relative;
                overflow: hidden;
            }
            
            .modern-button::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
                transition: left var(--duration-slow) var(--easing-ease);
            }
            
            .modern-button:hover::before {
                left: 100%;
            }
            
            .modern-button-primary {
                background: linear-gradient(135deg, var(--color-primary-500), var(--color-primary-600));
                color: white;
                box-shadow: var(--shadow-md);
            }
            
            .modern-button-primary:hover {
                background: linear-gradient(135deg, var(--color-primary-600), var(--color-primary-700));
                transform: translateY(-2px);
                box-shadow: var(--shadow-xl);
            }
            
            .modern-button-secondary {
                background: var(--color-neutral-100);
                color: var(--color-neutral-700);
                border: 1px solid var(--color-neutral-300);
            }
            
            .modern-button-secondary:hover {
                background: var(--color-neutral-200);
                border-color: var(--color-neutral-400);
            }
            
            .modern-input {
                width: 100%;
                padding: var(--spacing-sm) var(--spacing-md);
                border: 2px solid var(--color-neutral-300);
                border-radius: var(--radius-lg);
                font-family: var(--font-primary);
                font-size: var(--font-size-base);
                transition: all var(--duration-normal) var(--easing-ease);
                background: white;
            }
            
            .modern-input:focus {
                outline: none;
                border-color: var(--color-primary-500);
                box-shadow: 0 0 0 3px var(--color-primary-100);
            }
            
            .modern-input::placeholder {
                color: var(--color-neutral-400);
            }
            
            .modern-heading {
                font-family: var(--font-secondary);
                font-weight: 700;
                line-height: var(--line-height-tight);
                color: var(--color-neutral-900);
                margin: 0;
            }
            
            .modern-heading-1 {
                font-size: var(--font-size-6xl);
                background: linear-gradient(135deg, var(--color-primary-600), var(--color-secondary-600));
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }
            
            .modern-heading-2 {
                font-size: var(--font-size-5xl);
                color: var(--color-neutral-800);
            }
            
            .modern-heading-3 {
                font-size: var(--font-size-4xl);
                color: var(--color-neutral-700);
            }
            
            .modern-text {
                font-family: var(--font-primary);
                font-size: var(--font-size-base);
                line-height: var(--line-height-relaxed);
                color: var(--color-neutral-600);
            }
            
            .modern-text-large {
                font-size: var(--font-size-lg);
                line-height: var(--line-height-loose);
            }
            
            .modern-text-small {
                font-size: var(--font-size-sm);
                line-height: var(--line-height-normal);
            }
            
            .modern-badge {
                display: inline-flex;
                align-items: center;
                padding: var(--spacing-xs) var(--spacing-sm);
                border-radius: var(--radius-full);
                font-size: var(--font-size-sm);
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            
            .modern-badge-primary {
                background: var(--color-primary-100);
                color: var(--color-primary-700);
            }
            
            .modern-badge-secondary {
                background: var(--color-secondary-100);
                color: var(--color-secondary-700);
            }
            
            .modern-badge-accent {
                background: var(--color-accent-100);
                color: var(--color-accent-700);
            }
            
            .modern-gradient {
                background: linear-gradient(135deg, var(--color-primary-500), var(--color-secondary-500));
            }
            
            .modern-glass {
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.2);
            }
            
            .modern-animate-fade-in {
                animation: fadeIn var(--duration-slow) var(--easing-ease);
            }
            
            .modern-animate-slide-up {
                animation: slideUp var(--duration-slow) var(--easing-ease);
            }
            
            .modern-animate-scale {
                animation: scale var(--duration-normal) var(--easing-bounce);
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            @keyframes scale {
                from { transform: scale(0.8); }
                to { transform: scale(1); }
            }
            
            /* Responsive Design */
            @media (max-width: 768px) {
                .modern-heading-1 {
                    font-size: var(--font-size-4xl);
                }
                
                .modern-heading-2 {
                    font-size: var(--font-size-3xl);
                }
                
                .modern-heading-3 {
                    font-size: var(--font-size-2xl);
                }
                
                .modern-card {
                    padding: var(--spacing-lg);
                }
            }
            
            @media (max-width: 480px) {
                .modern-heading-1 {
                    font-size: var(--font-size-3xl);
                }
                
                .modern-heading-2 {
                    font-size: var(--font-size-2xl);
                }
                
                .modern-heading-3 {
                    font-size: var(--font-size-xl);
                }
            }
        `;
    }
    
    applyCSSVariables() {
        const root = document.documentElement;
        
        // Apply color variables
        Object.keys(this.colorPalette).forEach(colorName => {
            Object.keys(this.colorPalette[colorName]).forEach(shade => {
                const value = this.colorPalette[colorName][shade];
                root.style.setProperty(`--color-${colorName}-${shade}`, value);
            });
        });
        
        // Apply typography variables
        Object.keys(this.typography.fontFamily).forEach(fontName => {
            root.style.setProperty(`--font-${fontName}`, this.typography.fontFamily[fontName]);
        });
        
        Object.keys(this.typography.fontSize).forEach(sizeName => {
            root.style.setProperty(`--font-size-${sizeName}`, this.typography.fontSize[sizeName]);
        });
        
        Object.keys(this.typography.fontWeight).forEach(weightName => {
            root.style.setProperty(`--font-weight-${weightName}`, this.typography.fontWeight[weightName]);
        });
        
        Object.keys(this.typography.lineHeight).forEach(heightName => {
            root.style.setProperty(`--line-height-${heightName}`, this.typography.lineHeight[heightName]);
        });
        
        // Apply spacing variables
        Object.keys(this.spacing).forEach(spaceName => {
            root.style.setProperty(`--spacing-${spaceName}`, this.spacing[spaceName]);
        });
        
        // Apply shadow variables
        Object.keys(this.shadows).forEach(shadowName => {
            root.style.setProperty(`--shadow-${shadowName}`, this.shadows[shadowName]);
        });
        
        // Apply border radius variables
        Object.keys(this.borderRadius).forEach(radiusName => {
            root.style.setProperty(`--radius-${radiusName}`, this.borderRadius[radiusName]);
        });
        
        // Apply animation variables
        Object.keys(this.animations.duration).forEach(durationName => {
            root.style.setProperty(`--duration-${durationName}`, this.animations.duration[durationName]);
        });
        
        Object.keys(this.animations.easing).forEach(easingName => {
            root.style.setProperty(`--easing-${easingName}`, this.animations.easing[easingName]);
        });
    }
    
    updateExistingElements() {
        // Update existing buttons
        const buttons = document.querySelectorAll('button, .btn, .button');
        buttons.forEach(button => {
            if (!button.classList.contains('modern-button')) {
                button.classList.add('modern-button', 'modern-button-primary');
            }
        });
        
        // Update existing cards
        const cards = document.querySelectorAll('.card, .service-card, .product-card');
        cards.forEach(card => {
            if (!card.classList.contains('modern-card')) {
                card.classList.add('modern-card');
            }
        });
        
        // Update existing headings
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        headings.forEach((heading, index) => {
            if (!heading.classList.contains('modern-heading')) {
                heading.classList.add('modern-heading', `modern-heading-${Math.min(index + 1, 3)}`);
            }
        });
        
        // Update existing inputs
        const inputs = document.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            if (!input.classList.contains('modern-input')) {
                input.classList.add('modern-input');
            }
        });
        
        // Update existing text elements
        const texts = document.querySelectorAll('p, span, div');
        texts.forEach(text => {
            if (!text.classList.contains('modern-text') && !text.querySelector('h1, h2, h3, h4, h5, h6')) {
                text.classList.add('modern-text');
            }
        });
    }
    
    setupThemeToggle() {
        // Create theme toggle button
        const themeToggle = document.createElement('button');
        themeToggle.id = 'theme-toggle';
        themeToggle.className = 'modern-button modern-button-secondary';
        themeToggle.innerHTML = `
            <span class="theme-icon">🌙</span>
            <span class="theme-text">Dark Mode</span>
        `;
        
        // Add to page
        document.body.appendChild(themeToggle);
        
        // Theme toggle functionality
        themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });
        
        // Load saved theme
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.setTheme(savedTheme);
    }
    
    toggleTheme() {
        const currentTheme = this.designConfig.theme;
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }
    
    setTheme(theme) {
        this.designConfig.theme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Update theme toggle button
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            const icon = themeToggle.querySelector('.theme-icon');
            const text = themeToggle.querySelector('.theme-text');
            
            if (theme === 'dark') {
                icon.textContent = '☀️';
                text.textContent = 'Light Mode';
            } else {
                icon.textContent = '🌙';
                text.textContent = 'Dark Mode';
            }
        }
        
        console.log(`🎨 Theme changed to: ${theme}`);
    }
    
    setupResponsiveDesign() {
        // Handle window resize
        window.addEventListener('resize', () => {
            this.updateResponsiveDesign();
        });
        
        // Initial responsive setup
        this.updateResponsiveDesign();
    }
    
    updateResponsiveDesign() {
        const width = window.innerWidth;
        
        // Update CSS variables based on screen size
        const root = document.documentElement;
        
        if (width < 480) {
            root.style.setProperty('--font-size-6xl', '2.5rem');
            root.style.setProperty('--font-size-5xl', '2rem');
            root.style.setProperty('--font-size-4xl', '1.75rem');
        } else if (width < 768) {
            root.style.setProperty('--font-size-6xl', '3rem');
            root.style.setProperty('--font-size-5xl', '2.5rem');
            root.style.setProperty('--font-size-4xl', '2rem');
        } else {
            root.style.setProperty('--font-size-6xl', '3.75rem');
            root.style.setProperty('--font-size-5xl', '3rem');
            root.style.setProperty('--font-size-4xl', '2.25rem');
        }
    }
    
    setupAnimations() {
        if (!this.designConfig.animations) return;
        
        // Intersection Observer for animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('modern-animate-fade-in');
                }
            });
        }, {
            threshold: 0.1
        });
        
        // Observe elements for animations
        const animatedElements = document.querySelectorAll('.modern-card, .modern-button, .modern-heading');
        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }
    
    // Public API
    getDesignConfig() {
        return this.designConfig;
    }
    
    updateDesignConfig(newConfig) {
        this.designConfig = { ...this.designConfig, ...newConfig };
        this.applyDesignSystem();
        console.log('🎨 Design config updated:', this.designConfig);
    }
    
    getColorPalette() {
        return this.colorPalette;
    }
    
    updateColorPalette(newPalette) {
        this.colorPalette = { ...this.colorPalette, ...newPalette };
        this.applyCSSVariables();
        console.log('🎨 Color palette updated:', this.colorPalette);
    }
    
    getTypography() {
        return this.typography;
    }
    
    updateTypography(newTypography) {
        this.typography = { ...this.typography, ...newTypography };
        this.applyCSSVariables();
        console.log('🎨 Typography updated:', this.typography);
    }
    
    createComponent(type, options = {}) {
        const component = document.createElement('div');
        component.className = `modern-${type}`;
        
        // Apply component-specific styles
        switch (type) {
            case 'card':
                component.innerHTML = options.content || '';
                break;
            case 'button':
                component.innerHTML = options.text || 'Button';
                component.type = options.type || 'button';
                break;
            case 'input':
                component.type = options.type || 'text';
                component.placeholder = options.placeholder || '';
                break;
        }
        
        return component;
    }
    
    applyModernStyles(selector, styles = {}) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            Object.keys(styles).forEach(property => {
                element.style[property] = styles[property];
            });
        });
    }
}

// Initialize modern design when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    const modernDesign = new ModernDesign();
    
    // Export for external use
    window.modernDesign = modernDesign;
    
    console.log('✅ Modern Design System ready!');
});

console.log('✅ Modern Design System script loaded!');
