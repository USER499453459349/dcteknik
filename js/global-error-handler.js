/**
 * DC TEKNİK - Global Error Handler
 * Tüm JavaScript hatalarını yakalar ve yönetir
 */

(function() {
    'use strict';
    
    // Global error handler
    window.addEventListener('error', function(event) {
        handleError({
            message: event.message,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            error: event.error,
            type: 'javascript_error'
        });
    });
    
    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', function(event) {
        handleError({
            message: event.reason?.message || event.reason,
            filename: 'Promise Rejection',
            lineno: 0,
            colno: 0,
            error: event.reason,
            type: 'promise_rejection'
        });
    });
    
    // Resource loading error handler
    window.addEventListener('error', function(event) {
        if (event.target !== window) {
            handleError({
                message: 'Resource loading failed: ' + event.target.src,
                filename: event.target.src,
                lineno: 0,
                colno: 0,
                error: null,
                type: 'resource_error'
            });
        }
    }, true);
    
    // Error handling function
    function handleError(errorInfo) {
        // Sadece production'da hata logla
        if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
            // Hata detaylarını topla
            const errorData = {
                message: errorInfo.message,
                filename: errorInfo.filename,
                lineno: errorInfo.lineno,
                colno: errorInfo.colno,
                stack: errorInfo.error?.stack,
                userAgent: navigator.userAgent,
                url: window.location.href,
                timestamp: new Date().toISOString(),
                type: errorInfo.type
            };
            
            // Analytics'e gönder
            if (typeof gtag !== 'undefined' && typeof gtag === 'function') {
                try {
                    gtag('event', 'javascript_error', {
                        event_category: 'Error',
                        event_label: errorData.message,
                        custom_map: {
                            error_filename: errorData.filename,
                            error_line: errorData.lineno,
                            error_type: errorData.type
                        }
                    });
                } catch (analyticsError) {
                    console.warn('Error analytics gönderilemedi:', analyticsError);
                }
            }
            
            // Kullanıcıya sessizce bildir (kritik hatalar için)
            if (isCriticalError(errorInfo)) {
                showUserFriendlyError();
            }
        }
    }
    
    // Kritik hata kontrolü
    function isCriticalError(errorInfo) {
        const criticalPatterns = [
            'Cannot read property',
            'Cannot read properties',
            'is not a function',
            'is not defined',
            'Unexpected token',
            'SyntaxError',
            'ReferenceError'
        ];
        
        return criticalPatterns.some(pattern => 
            errorInfo.message && errorInfo.message.includes(pattern)
        );
    }
    
    // Kullanıcı dostu hata mesajı
    function showUserFriendlyError() {
        if (document.querySelector('.error-notification')) return;
        
        const notification = document.createElement('div');
        notification.className = 'error-notification';
        notification.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: #ff4444;
                color: white;
                padding: 15px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                z-index: 10000;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                font-size: 14px;
                max-width: 300px;
                animation: slideIn 0.3s ease-out;
            ">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 16px;"></i>
                    <span>Bir hata oluştu. Lütfen sayfayı yenileyin.</span>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" style="
                    position: absolute;
                    top: 5px;
                    right: 5px;
                    background: none;
                    border: none;
                    color: white;
                    cursor: pointer;
                    font-size: 18px;
                    padding: 0;
                    width: 20px;
                    height: 20px;
                ">×</button>
            </div>
            <style>
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            </style>
        `;
        
        document.body.appendChild(notification);
        
        // 5 saniye sonra otomatik kaldır
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }
    
    // Console error override
    const originalError = console.error;
    console.error = function(...args) {
        // Sadece development'ta console.error'u göster
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            originalError.apply(console, args);
        }
    };
    
    // Console warn override
    const originalWarn = console.warn;
    console.warn = function(...args) {
        // Sadece development'ta console.warn'u göster
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            originalWarn.apply(console, args);
        }
    };
    
    // Console log override (production'da gizle)
    const originalLog = console.log;
    console.log = function(...args) {
        // Sadece development'ta console.log'u göster
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            originalLog.apply(console, args);
        }
    };
    
    // Gtag güvenli çağrı fonksiyonu
    window.safeGtag = function(...args) {
        if (typeof gtag !== 'undefined' && typeof gtag === 'function') {
            try {
                gtag.apply(window, args);
            } catch (error) {
                console.warn('Gtag çağrısı başarısız:', error);
            }
        } else {
            console.warn('Gtag henüz yüklenmedi');
        }
    };
    
    // Sayfa yüklendiğinde hata kontrolü
    document.addEventListener('DOMContentLoaded', function() {
        // Eksik elementleri kontrol et
        checkMissingElements();
        
        // JavaScript hatalarını kontrol et
        checkJavaScriptErrors();
    });
    
    // Eksik elementleri kontrol et
    function checkMissingElements() {
        const criticalElements = [
            '.dc-floating',
            '.hero-content',
            '.navbar'
        ];
        
        criticalElements.forEach(selector => {
            const element = document.querySelector(selector);
            if (!element) {
                console.warn('Kritik element bulunamadı:', selector);
            }
        });
    }
    
    // JavaScript hatalarını kontrol et
    function checkJavaScriptErrors() {
        // Gtag yükleme kontrolü
        setTimeout(() => {
            if (typeof gtag === 'undefined') {
                console.warn('Google Analytics yüklenemedi');
            }
        }, 3000);
        
        // Critical JavaScript dosyalarını kontrol et
        const criticalScripts = [
            'js/error-handler.js',
            'js/floating-contact.js',
            'js/performance-optimizer.js'
        ];
        
        criticalScripts.forEach(scriptSrc => {
            const script = document.querySelector(`script[src*="${scriptSrc}"]`);
            if (!script) {
                console.warn('Kritik script bulunamadı:', scriptSrc);
            }
        });
    }
    
    // Export for module systems
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = {
            handleError,
            showUserFriendlyError,
            safeGtag: window.safeGtag
        };
    }
    
})();
