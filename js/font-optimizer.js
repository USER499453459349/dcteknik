/**
 * DC TEKNİK - Font Loading Optimizer
 * Font-display: swap ve font preloading için
 */

(function() {
    'use strict';
    
    // Add font-display: swap to all @font-face rules
    function optimizeFontLoading() {
        // Create style element for font-display optimization
        const style = document.createElement('style');
        style.textContent = `
            @font-face {
                font-family: 'Inter';
                font-display: swap;
            }
            
            @font-face {
                font-family: 'Poppins';
                font-display: swap;
            }
            
            /* Font Awesome fallback */
            .fa, .fas, .far, .fal, .fab {
                font-display: swap;
            }
        `;
        
        // Insert at the beginning of head for priority
        const firstChild = document.head.firstChild;
        if (firstChild) {
            document.head.insertBefore(style, firstChild);
        } else {
            document.head.appendChild(style);
        }
        
        console.log('✅ Font loading optimized');
    }
    
    // Preload font files if available
    function preloadFonts() {
        // Preconnect to Google Fonts (if used)
        const preconnect = document.createElement('link');
        preconnect.rel = 'preconnect';
        preconnect.href = 'https://fonts.googleapis.com';
        preconnect.crossOrigin = 'anonymous';
        document.head.appendChild(preconnect);
        
        const preconnect2 = document.createElement('link');
        preconnect2.rel = 'preconnect';
        preconnect2.href = 'https://fonts.gstatic.com';
        preconnect2.crossOrigin = 'anonymous';
        document.head.appendChild(preconnect2);
        
        console.log('✅ Font preconnect added');
    }
    
    // Optimize Google Fonts loading (if used)
    function optimizeGoogleFonts() {
        const googleFontsLinks = document.querySelectorAll('link[href*="fonts.googleapis.com"]');
        
        googleFontsLinks.forEach(link => {
            // Add &display=swap to Google Fonts URL
            if (link.href.includes('fonts.googleapis.com') && !link.href.includes('display=swap')) {
                link.href += (link.href.includes('?') ? '&' : '?') + 'display=swap';
            }
        });
    }
    
    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            optimizeFontLoading();
            preloadFonts();
            optimizeGoogleFonts();
        });
    } else {
        optimizeFontLoading();
        preloadFonts();
        optimizeGoogleFonts();
    }
    
    console.log('✅ Font Optimizer loaded');
})();




