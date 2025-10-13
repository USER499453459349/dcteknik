// Advanced Theme Switcher for DC TEKNİK
// Dark/Light Mode with smooth transitions and system preference detection

class ThemeSwitcher {
    constructor() {
        this.themes = {
            light: {
                name: 'light',
                icon: '☀️',
                label: 'Açık Tema'
            },
            dark: {
                name: 'dark',
                icon: '🌙',
                label: 'Koyu Tema'
            },
            auto: {
                name: 'auto',
                icon: '🔄',
                label: 'Otomatik'
            }
        };
        
        this.currentTheme = this.getStoredTheme() || this.getSystemTheme();
        this.isTransitioning = false;
        
        this.init();
    }

    init() {
        this.createThemeSwitcher();
        this.applyTheme(this.currentTheme);
        this.setupSystemThemeListener();
        this.addThemeTransitions();
        
        console.log('🎨 Theme Switcher initialized:', this.currentTheme);
    }

    getSystemTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }

    getStoredTheme() {
        return localStorage.getItem('dcteknik-theme');
    }

    setStoredTheme(theme) {
        localStorage.setItem('dcteknik-theme', theme);
    }

    createThemeSwitcher() {
        // Find existing theme switcher or create new one
        let switcher = document.querySelector('.theme-switcher');
        
        if (!switcher) {
            switcher = document.createElement('div');
            switcher.className = 'theme-switcher';
            switcher.innerHTML = this.getThemeSwitcherHTML();
            
            // Add to header or create floating button
            const header = document.querySelector('.header') || document.querySelector('header');
            if (header) {
                header.appendChild(switcher);
            } else {
                // Create floating theme switcher
                switcher.classList.add('floating-theme-switcher');
                document.body.appendChild(switcher);
            }
        }

        // Add event listeners
        this.addThemeSwitcherListeners(switcher);
    }

    getThemeSwitcherHTML() {
        return `
            <div class="theme-switcher-container">
                <button class="theme-toggle-btn" aria-label="Tema Değiştir">
                    <span class="theme-icon">${this.themes[this.currentTheme].icon}</span>
                    <span class="theme-label">${this.themes[this.currentTheme].label}</span>
                </button>
                <div class="theme-dropdown">
                    <button class="theme-option ${this.currentTheme === 'light' ? 'active' : ''}" data-theme="light">
                        <span class="theme-icon">☀️</span>
                        <span class="theme-label">Açık Tema</span>
                    </button>
                    <button class="theme-option ${this.currentTheme === 'dark' ? 'active' : ''}" data-theme="dark">
                        <span class="theme-icon">🌙</span>
                        <span class="theme-label">Koyu Tema</span>
                    </button>
                    <button class="theme-option ${this.currentTheme === 'auto' ? 'active' : ''}" data-theme="auto">
                        <span class="theme-icon">🔄</span>
                        <span class="theme-label">Otomatik</span>
                    </button>
                </div>
            </div>
        `;
    }

    addThemeSwitcherListeners(switcher) {
        const toggleBtn = switcher.querySelector('.theme-toggle-btn');
        const dropdown = switcher.querySelector('.theme-dropdown');
        const options = switcher.querySelectorAll('.theme-option');

        // Toggle dropdown
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('active');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            dropdown.classList.remove('active');
        });

        // Theme option clicks
        options.forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                const theme = option.dataset.theme;
                this.switchTheme(theme);
                dropdown.classList.remove('active');
            });
        });
    }

    switchTheme(theme) {
        if (this.isTransitioning || theme === this.currentTheme) return;

        this.isTransitioning = true;
        this.currentTheme = theme;
        this.setStoredTheme(theme);
        
        // Update UI
        this.updateThemeSwitcherUI();
        
        // Apply theme with transition
        this.applyThemeWithTransition(theme);
        
        // Track theme change
        this.trackThemeChange(theme);
        
        setTimeout(() => {
            this.isTransitioning = false;
        }, 300);
    }

    applyTheme(theme) {
        const actualTheme = theme === 'auto' ? this.getSystemTheme() : theme;
        document.documentElement.setAttribute('data-theme', actualTheme);
        document.body.classList.remove('theme-transitioning');
    }

    applyThemeWithTransition(theme) {
        document.body.classList.add('theme-transitioning');
        
        setTimeout(() => {
            this.applyTheme(theme);
        }, 150);
    }

    updateThemeSwitcherUI() {
        const toggleBtn = document.querySelector('.theme-toggle-btn');
        const options = document.querySelectorAll('.theme-option');
        
        if (toggleBtn) {
            const icon = toggleBtn.querySelector('.theme-icon');
            const label = toggleBtn.querySelector('.theme-label');
            
            icon.textContent = this.themes[this.currentTheme].icon;
            label.textContent = this.themes[this.currentTheme].label;
        }

        // Update active states
        options.forEach(option => {
            option.classList.remove('active');
            if (option.dataset.theme === this.currentTheme) {
                option.classList.add('active');
            }
        });
    }

    setupSystemThemeListener() {
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', (e) => {
                if (this.currentTheme === 'auto') {
                    this.applyTheme('auto');
                }
            });
        }
    }

    addThemeTransitions() {
        const style = document.createElement('style');
        style.textContent = `
            .theme-transitioning * {
                transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease !important;
            }
        `;
        document.head.appendChild(style);
    }

    trackThemeChange(theme) {
        // Analytics tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', 'theme_change', {
                event_category: 'ui_interaction',
                event_label: theme,
                value: 1
            });
        }

        // Console log
        console.log('🎨 Theme changed to:', theme);
    }

    // Public methods
    getCurrentTheme() {
        return this.currentTheme;
    }

    setTheme(theme) {
        this.switchTheme(theme);
    }

    toggleTheme() {
        const nextTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.switchTheme(nextTheme);
    }
}

// Initialize theme switcher when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.themeSwitcher = new ThemeSwitcher();
});

// Export for use
window.ThemeSwitcher = ThemeSwitcher;

