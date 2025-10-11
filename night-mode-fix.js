// Night Mode Fix for DC TEKNİK
// Complete theme switching solution

class NightModeFix {
    constructor() {
        this.themes = {
            light: {
                name: 'light',
                icon: 'fas fa-sun',
                label: 'Gündüz Modu',
                colors: {
                    primary: '#ffffff',
                    secondary: '#f8fafc',
                    text: '#1e293b',
                    accent: '#3b82f6'
                }
            },
            dark: {
                name: 'dark',
                icon: 'fas fa-moon',
                label: 'Gece Modu',
                colors: {
                    primary: '#0f172a',
                    secondary: '#1e293b',
                    text: '#f8fafc',
                    accent: '#00BFFF'
                }
            },
            auto: {
                name: 'auto',
                icon: 'fas fa-adjust',
                label: 'Otomatik',
                colors: null
            }
        };
        
        this.currentTheme = 'auto';
        this.manualOverride = false;
        this.themeButton = null;
        this.autoCheckInterval = null;
        
        this.init();
    }

    init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.initializeThemeSwitcher();
            });
        } else {
            this.initializeThemeSwitcher();
        }
    }
    
    initializeThemeSwitcher() {
        this.createThemeButton();
        this.loadSavedTheme();
        this.applyTheme();
        this.startAutoCheck();
        this.setupEventListeners();
        this.addThemeStyles();
        
        // Force button visibility
        setTimeout(() => {
            if (this.themeButton) {
                this.themeButton.style.display = 'flex';
                this.themeButton.style.visibility = 'visible';
                this.themeButton.style.opacity = '1';
                this.themeButton.style.pointerEvents = 'auto';
            }
        }, 100);
        
        console.log('🌙 Night Mode Fix initialized');
    }

    createThemeButton() {
        // Remove existing theme buttons
        const existingButtons = document.querySelectorAll('.theme-switcher-btn, .night-mode-btn');
        existingButtons.forEach(btn => btn.remove());

        // Create new theme button
        this.themeButton = document.createElement('button');
        this.themeButton.className = 'night-mode-btn';
        this.themeButton.id = 'night-mode-toggle';
        this.themeButton.innerHTML = `
            <i class="${this.getCurrentThemeIcon()}"></i>
            <span class="theme-label">${this.getCurrentThemeLabel()}</span>
        `;
        
        // Position the button
        this.themeButton.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            background: rgba(0, 191, 255, 0.2);
            border: 2px solid #00BFFF;
            border-radius: 50px;
            padding: 12px 20px;
            color: #00BFFF;
            cursor: pointer;
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
            font-weight: 600;
            box-shadow: 0 4px 20px rgba(0, 191, 255, 0.5);
            text-transform: uppercase;
            letter-spacing: 1px;
            user-select: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
        `;

        document.body.appendChild(this.themeButton);
    }

    getCurrentThemeIcon() {
        if (this.currentTheme === 'auto') {
            return this.themes.auto.icon;
        }
        return this.getActiveTheme() === 'dark' ? this.themes.dark.icon : this.themes.light.icon;
    }

    getCurrentThemeLabel() {
        if (this.currentTheme === 'auto') {
            return this.themes.auto.label;
        }
        return this.themes[this.currentTheme].label;
    }

    getActiveTheme() {
        if (this.currentTheme === 'auto') {
            return this.getTimeBasedTheme();
        }
        return this.currentTheme;
    }

    getTimeBasedTheme() {
        const now = new Date();
        const hour = now.getHours();
        
        // Night time: 18:00 - 06:00
        if (hour >= 18 || hour < 6) {
            return 'dark';
        }
        return 'light';
    }

    loadSavedTheme() {
        const savedTheme = localStorage.getItem('dcteknik-theme');
        const savedManualOverride = localStorage.getItem('dcteknik-theme-manual');
        
        if (savedTheme && this.themes[savedTheme]) {
            this.currentTheme = savedTheme;
        }
        
        if (savedManualOverride === 'true') {
            this.manualOverride = true;
        }
    }

    saveTheme() {
        localStorage.setItem('dcteknik-theme', this.currentTheme);
        localStorage.setItem('dcteknik-theme-manual', this.manualOverride.toString());
    }

    applyTheme() {
        const activeTheme = this.getActiveTheme();
        const html = document.documentElement;
        
        // Remove existing theme classes
        html.classList.remove('light-theme', 'dark-theme', 'auto-theme');
        
        // Apply new theme
        html.classList.add(`${activeTheme}-theme`);
        html.setAttribute('data-theme', activeTheme);
        
        // Update button appearance
        this.updateThemeButton();
        
        // Apply theme-specific styles
        this.applyThemeStyles(activeTheme);
        
        console.log(`🌙 Theme applied: ${activeTheme} (${this.currentTheme} mode)`);
    }

    applyThemeStyles(theme) {
        const root = document.documentElement;
        
        if (theme === 'dark') {
            // Dark theme colors
            root.style.setProperty('--bg-primary', '#0f172a');
            root.style.setProperty('--bg-secondary', '#1e293b');
            root.style.setProperty('--text-primary', '#f8fafc');
            root.style.setProperty('--text-secondary', '#cbd5e1');
            root.style.setProperty('--border-color', '#475569');
            root.style.setProperty('--accent-primary', '#00BFFF');
            root.style.setProperty('--accent-secondary', '#ea580c');
            
            // Update hero background
            const hero = document.querySelector('.hero');
            if (hero) {
                hero.style.background = 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)';
            }
            
            // Update button colors
            this.themeButton.style.background = 'rgba(0, 191, 255, 0.1)';
            this.themeButton.style.borderColor = '#00BFFF';
            this.themeButton.style.color = '#00BFFF';
            
        } else {
            // Light theme colors
            root.style.setProperty('--bg-primary', '#ffffff');
            root.style.setProperty('--bg-secondary', '#f8fafc');
            root.style.setProperty('--text-primary', '#1e293b');
            root.style.setProperty('--text-secondary', '#64748b');
            root.style.setProperty('--border-color', '#e2e8f0');
            root.style.setProperty('--accent-primary', '#3b82f6');
            root.style.setProperty('--accent-secondary', '#ea580c');
            
            // Update hero background
            const hero = document.querySelector('.hero');
            if (hero) {
                hero.style.background = 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)';
            }
            
            // Update button colors
            this.themeButton.style.background = 'rgba(59, 130, 246, 0.1)';
            this.themeButton.style.borderColor = '#3b82f6';
            this.themeButton.style.color = '#3b82f6';
        }
    }

    updateThemeButton() {
        if (!this.themeButton) return;
        
        const icon = this.themeButton.querySelector('i');
        const label = this.themeButton.querySelector('.theme-label');
        
        if (icon) {
            icon.className = this.getCurrentThemeIcon();
        }
        
        if (label) {
            label.textContent = this.getCurrentThemeLabel();
        }
        
        // Make button more visible
        this.themeButton.style.display = 'flex';
        this.themeButton.style.visibility = 'visible';
        this.themeButton.style.opacity = '1';
        this.themeButton.style.pointerEvents = 'auto';
        
        // Add pulse animation for active state
        this.themeButton.style.animation = 'themeButtonPulse 2s ease-in-out infinite';
    }

    startAutoCheck() {
        // Check every minute for time-based theme changes
        this.autoCheckInterval = setInterval(() => {
            if (this.currentTheme === 'auto' && !this.manualOverride) {
                const newActiveTheme = this.getTimeBasedTheme();
                const currentActiveTheme = this.getActiveTheme();
                
                if (newActiveTheme !== currentActiveTheme) {
                    this.applyTheme();
                }
            }
        }, 60000); // Check every minute
    }

    setupEventListeners() {
        if (!this.themeButton) return;
        
        // Multiple event listeners for better compatibility
        this.themeButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('🌙 Theme button clicked!');
            this.cycleTheme();
        });
        
        this.themeButton.addEventListener('touchstart', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('🌙 Theme button touched!');
            this.cycleTheme();
        });
        
        // Add hover effects
        this.themeButton.addEventListener('mouseenter', () => {
            this.themeButton.style.transform = 'scale(1.05)';
            this.themeButton.style.boxShadow = '0 6px 25px rgba(0, 191, 255, 0.7)';
            this.themeButton.style.background = 'rgba(0, 191, 255, 0.3)';
        });
        
        this.themeButton.addEventListener('mouseleave', () => {
            this.themeButton.style.transform = 'scale(1)';
            this.themeButton.style.boxShadow = '0 4px 20px rgba(0, 191, 255, 0.5)';
            this.themeButton.style.background = 'rgba(0, 191, 255, 0.2)';
        });
        
        // Add active state
        this.themeButton.addEventListener('mousedown', () => {
            this.themeButton.style.transform = 'scale(0.95)';
            this.themeButton.style.background = 'rgba(0, 191, 255, 0.4)';
        });
        
        this.themeButton.addEventListener('mouseup', () => {
            this.themeButton.style.transform = 'scale(1.05)';
            this.themeButton.style.background = 'rgba(0, 191, 255, 0.3)';
        });
    }

    cycleTheme() {
        const themeOrder = ['auto', 'light', 'dark'];
        const currentIndex = themeOrder.indexOf(this.currentTheme);
        const nextIndex = (currentIndex + 1) % themeOrder.length;
        
        this.currentTheme = themeOrder[nextIndex];
        this.manualOverride = true;
        
        this.applyTheme();
        this.saveTheme();
        
        // Show notification
        this.showThemeNotification();
    }

    showThemeNotification() {
        const notification = document.createElement('div');
        notification.className = 'theme-notification';
        notification.innerHTML = `
            <i class="${this.getCurrentThemeIcon()}"></i>
            <span>${this.getCurrentThemeLabel()} aktif</span>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            z-index: 10000;
            background: rgba(0, 0, 0, 0.9);
            color: #00BFFF;
            padding: 12px 20px;
            border-radius: 25px;
            backdrop-filter: blur(10px);
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
            font-weight: 600;
            animation: slideInRight 0.3s ease-out;
            border: 1px solid #00BFFF;
            box-shadow: 0 4px 20px rgba(0, 191, 255, 0.3);
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 2000);
    }

    addThemeStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
            
            @keyframes themeButtonPulse {
                0%, 100% {
                    box-shadow: 0 4px 20px rgba(0, 191, 255, 0.5);
                }
                50% {
                    box-shadow: 0 4px 20px rgba(0, 191, 255, 0.8);
                }
            }
            
            .night-mode-btn {
                position: fixed !important;
                top: 20px !important;
                right: 20px !important;
                z-index: 9999 !important;
                display: flex !important;
                visibility: visible !important;
                opacity: 1 !important;
                pointer-events: auto !important;
            }
            
            .night-mode-btn:hover {
                transform: scale(1.05) !important;
                box-shadow: 0 6px 25px rgba(0, 191, 255, 0.7) !important;
            }
            
            .night-mode-btn:active {
                transform: scale(0.95) !important;
            }
            
            /* Dark theme styles */
            [data-theme="dark"] {
                --bg-primary: #0f172a !important;
                --bg-secondary: #1e293b !important;
                --text-primary: #f8fafc !important;
                --text-secondary: #cbd5e1 !important;
                --border-color: #475569 !important;
                --accent-primary: #00BFFF !important;
            }
            
            [data-theme="dark"] .hero {
                background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%) !important;
            }
            
            [data-theme="dark"] .hero h1 {
                background: linear-gradient(135deg, #ffffff 0%, #00BFFF 50%, #ea580c 100%) !important;
                -webkit-background-clip: text !important;
                -webkit-text-fill-color: transparent !important;
                background-clip: text !important;
            }
            
            [data-theme="dark"] .hero-subtitle,
            [data-theme="dark"] .hero-description {
                color: rgba(255, 255, 255, 0.9) !important;
            }
            
            /* Light theme styles */
            [data-theme="light"] {
                --bg-primary: #ffffff !important;
                --bg-secondary: #f8fafc !important;
                --text-primary: #1e293b !important;
                --text-secondary: #64748b !important;
                --border-color: #e2e8f0 !important;
                --accent-primary: #3b82f6 !important;
            }
            
            [data-theme="light"] .hero {
                background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%) !important;
            }
            
            [data-theme="light"] .hero h1 {
                background: linear-gradient(135deg, #1e293b 0%, #3b82f6 50%, #ea580c 100%) !important;
                -webkit-background-clip: text !important;
                -webkit-text-fill-color: transparent !important;
                background-clip: text !important;
            }
            
            [data-theme="light"] .hero-subtitle,
            [data-theme="light"] .hero-description {
                color: rgba(30, 41, 59, 0.9) !important;
            }
        `;
        document.head.appendChild(style);
    }

    // Public methods
    setTheme(theme) {
        if (this.themes[theme]) {
            this.currentTheme = theme;
            this.manualOverride = true;
            this.applyTheme();
            this.saveTheme();
        }
    }

    getCurrentTheme() {
        return this.currentTheme;
    }

    getActiveTheme() {
        return this.getActiveTheme();
    }

    destroy() {
        if (this.autoCheckInterval) {
            clearInterval(this.autoCheckInterval);
        }
        
        if (this.themeButton) {
            this.themeButton.remove();
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Remove existing theme switcher
    if (window.advancedThemeSwitcher) {
        window.advancedThemeSwitcher.destroy();
    }
    
    // Initialize new night mode fix
    window.nightModeFix = new NightModeFix();
});

// Export for use
window.NightModeFix = NightModeFix;
