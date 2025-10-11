// Advanced Theme Switcher for DC TEKNİK
// Time-based automatic theme switching + Manual control

class AdvancedThemeSwitcher {
    constructor() {
        this.themes = {
            light: {
                name: 'light',
                icon: 'fas fa-sun',
                label: 'Açık Tema',
                timeRange: { start: 6, end: 18 } // 06:00 - 18:00
            },
            dark: {
                name: 'dark',
                icon: 'fas fa-moon',
                label: 'Koyu Tema',
                timeRange: { start: 18, end: 6 } // 18:00 - 06:00
            },
            auto: {
                name: 'auto',
                icon: 'fas fa-adjust',
                label: 'Otomatik',
                timeRange: null
            }
        };
        
        this.currentTheme = 'auto';
        this.manualOverride = false;
        this.themeButton = null;
        this.autoCheckInterval = null;
        
        this.init();
    }

    init() {
        this.createThemeButton();
        this.loadSavedTheme();
        this.applyTheme();
        this.startAutoCheck();
        this.setupEventListeners();
        
        console.log('🌙 Advanced Theme Switcher initialized');
    }

    createThemeButton() {
        // Remove existing theme button if any
        const existingButton = document.querySelector('.theme-switcher-btn');
        if (existingButton) {
            existingButton.remove();
        }

        // Create new theme button
        this.themeButton = document.createElement('button');
        this.themeButton.className = 'theme-switcher-btn advanced-theme-switcher';
        this.themeButton.innerHTML = `
            <i class="${this.getCurrentThemeIcon()}"></i>
            <span class="theme-label">${this.getCurrentThemeLabel()}</span>
            <div class="theme-indicator"></div>
        `;
        
        // Position the button
        this.themeButton.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 50px;
            padding: 12px 20px;
            color: white;
            cursor: pointer;
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
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
        
        // Check if it's night time (18:00 - 06:00)
        if (hour >= 18 || hour < 6) {
            return 'dark';
        }
        return 'light';
    }
    
    // Force theme application
    forceTheme(theme) {
        const html = document.documentElement;
        html.classList.remove('light-theme', 'dark-theme');
        html.classList.add(`${theme}-theme`);
        html.setAttribute('data-theme', theme);
        this.applyThemeStyles(theme);
        console.log(`🌙 Force theme applied: ${theme}`);
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
        html.classList.remove('light-theme', 'dark-theme');
        
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
            root.style.setProperty('--bg-primary', '#0f172a');
            root.style.setProperty('--bg-secondary', '#1e293b');
            root.style.setProperty('--text-primary', '#f8fafc');
            root.style.setProperty('--text-secondary', '#cbd5e1');
            root.style.setProperty('--border-color', '#475569');
            root.style.setProperty('--accent-primary', '#3b82f6');
            root.style.setProperty('--accent-secondary', '#ea580c');
        } else {
            root.style.setProperty('--bg-primary', '#ffffff');
            root.style.setProperty('--bg-secondary', '#f8fafc');
            root.style.setProperty('--text-primary', '#1e293b');
            root.style.setProperty('--text-secondary', '#64748b');
            root.style.setProperty('--border-color', '#e2e8f0');
            root.style.setProperty('--accent-primary', '#3b82f6');
            root.style.setProperty('--accent-secondary', '#ea580c');
        }
    }

    updateThemeButton() {
        if (!this.themeButton) return;
        
        const icon = this.themeButton.querySelector('i');
        const label = this.themeButton.querySelector('.theme-label');
        const indicator = this.themeButton.querySelector('.theme-indicator');
        
        if (icon) {
            icon.className = this.getCurrentThemeIcon();
        }
        
        if (label) {
            label.textContent = this.getCurrentThemeLabel();
        }
        
        if (indicator) {
            const activeTheme = this.getActiveTheme();
            indicator.style.background = activeTheme === 'dark' ? '#1e293b' : '#f8fafc';
            indicator.style.borderColor = activeTheme === 'dark' ? '#475569' : '#e2e8f0';
        }
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
        
        this.themeButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.cycleTheme();
        });
        
        // Add hover effects
        this.themeButton.addEventListener('mouseenter', () => {
            this.themeButton.style.transform = 'scale(1.05)';
            this.themeButton.style.background = 'rgba(255, 255, 255, 0.2)';
        });
        
        this.themeButton.addEventListener('mouseleave', () => {
            this.themeButton.style.transform = 'scale(1)';
            this.themeButton.style.background = 'rgba(255, 255, 255, 0.1)';
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
            z-index: 1001;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 12px 20px;
            border-radius: 25px;
            backdrop-filter: blur(10px);
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
            font-weight: 500;
            animation: slideInRight 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 2000);
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

// CSS for theme notifications
const themeStyles = document.createElement('style');
themeStyles.textContent = `
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
    
    .theme-switcher-btn:hover {
        transform: scale(1.05) !important;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2) !important;
    }
    
    .theme-indicator {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        border: 2px solid;
        transition: all 0.3s ease;
    }
    
    /* Dark theme styles */
    [data-theme="dark"] {
        --bg-primary: #0f172a;
        --bg-secondary: #1e293b;
        --text-primary: #f8fafc;
        --text-secondary: #cbd5e1;
        --border-color: #475569;
    }
    
    /* Light theme styles */
    [data-theme="light"] {
        --bg-primary: #ffffff;
        --bg-secondary: #f8fafc;
        --text-primary: #1e293b;
        --text-secondary: #64748b;
        --border-color: #e2e8f0;
    }
    
    /* Auto theme detection */
    @media (prefers-color-scheme: dark) {
        [data-theme="auto"] {
            --bg-primary: #0f172a;
            --bg-secondary: #1e293b;
            --text-primary: #f8fafc;
            --text-secondary: #cbd5e1;
            --border-color: #475569;
        }
    }
    
    @media (prefers-color-scheme: light) {
        [data-theme="auto"] {
            --bg-primary: #ffffff;
            --bg-secondary: #f8fafc;
            --text-primary: #1e293b;
            --text-secondary: #64748b;
            --border-color: #e2e8f0;
        }
    }
`;
document.head.appendChild(themeStyles);

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.advancedThemeSwitcher = new AdvancedThemeSwitcher();
});

// Export for use
window.AdvancedThemeSwitcher = AdvancedThemeSwitcher;
