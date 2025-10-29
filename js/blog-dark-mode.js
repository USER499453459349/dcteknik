/**
 * DC TEKNİK - Blog Dark Mode
 * Gece modu toggle ve okunabilirlik iyileştirmeleri
 */

(function() {
    'use strict';
    
    // Dark mode state
    let isDarkMode = false;
    
    // Check localStorage for saved preference
    function loadDarkModePreference() {
        const saved = localStorage.getItem('blog-dark-mode');
        if (saved === 'true') {
            isDarkMode = true;
            document.documentElement.classList.add('dark-mode');
        } else if (saved === 'false') {
            isDarkMode = false;
            document.documentElement.classList.remove('dark-mode');
        } else {
            // System preference
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                isDarkMode = true;
                document.documentElement.classList.add('dark-mode');
            }
        }
        updateDarkModeButton();
    }
    
    // Toggle dark mode
    function toggleDarkMode() {
        isDarkMode = !isDarkMode;
        document.documentElement.classList.toggle('dark-mode', isDarkMode);
        localStorage.setItem('blog-dark-mode', isDarkMode.toString());
        updateDarkModeButton();
        
        // Track in analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'dark_mode_toggle', {
                event_category: 'Blog',
                event_label: isDarkMode ? 'Dark' : 'Light',
                value: 1
            });
        }
    }
    
    // Create dark mode toggle button
    function createDarkModeButton() {
        const button = document.createElement('button');
        button.id = 'dark-mode-toggle';
        button.className = 'dark-mode-toggle';
        button.setAttribute('aria-label', 'Gece modunu aç/kapat');
        button.innerHTML = '<i class="fas fa-moon"></i>';
        
        // Add to hero section
        const hero = document.querySelector('.blog-hero .container');
        if (hero) {
            const tools = hero.querySelector('.blog-tools');
            if (tools) {
                tools.insertBefore(button, tools.firstChild);
            } else {
                hero.appendChild(button);
            }
        } else {
            // Fallback to header
            const header = document.querySelector('header');
            if (header) {
                header.appendChild(button);
            }
        }
        
        button.addEventListener('click', toggleDarkMode);
    }
    
    // Update button icon
    function updateDarkModeButton() {
        const button = document.getElementById('dark-mode-toggle');
        if (button) {
            button.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
            button.title = isDarkMode ? 'Gündüz moduna geç' : 'Gece moduna geç';
        }
    }
    
    // Initialize
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }
        
        loadDarkModePreference();
        createDarkModeButton();
        
        // Watch for system preference changes
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                if (!localStorage.getItem('blog-dark-mode')) {
                    isDarkMode = e.matches;
                    document.documentElement.classList.toggle('dark-mode', isDarkMode);
                    updateDarkModeButton();
                }
            });
        }
        
        console.log('✅ Dark Mode initialized!');
    }
    
    init();
})();




