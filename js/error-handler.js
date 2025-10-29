/**
 * DC TEKNİK - Error Handler
 * Hata yönetimi ve kullanıcı deneyimi iyileştirme
 */

class ErrorHandler {
    constructor() {
        this.init();
    }

    init() {
        // Global error handler
        window.addEventListener('error', (event) => {
            this.handleError(event.error, event.filename, event.lineno);
        });

        // Unhandled promise rejection handler
        window.addEventListener('unhandledrejection', (event) => {
            this.handleError(event.reason, 'Promise Rejection');
        });

        // Console error handler
        this.overrideConsoleError();
    }

    handleError(error, filename = 'Unknown', lineno = 0) {
        // Sadece production'da hata logla
        if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
            // Hata detaylarını topla
            const errorInfo = {
                message: error?.message || error,
                filename: filename,
                lineno: lineno,
                stack: error?.stack,
                userAgent: navigator.userAgent,
                url: window.location.href,
                timestamp: new Date().toISOString()
            };

            // Analytics'e gönder
            if (typeof gtag !== 'undefined' && typeof gtag === 'function') {
                try {
                    gtag('event', 'javascript_error', {
                        event_category: 'Error',
                    event_label: errorInfo.message,
                    custom_map: {
                        error_filename: errorInfo.filename,
                        error_line: errorInfo.lineno
                    }
                });
                } catch (analyticsError) {
                    console.warn('Error analytics gönderilemedi:', analyticsError);
                }
            }

            // Kullanıcıya sessizce bildir (opsiyonel)
            this.showUserFriendlyError();
        }
    }

    overrideConsoleError() {
        const originalError = console.error;
        console.error = (...args) => {
            // Sadece development'ta console.error'u göster
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                originalError.apply(console, args);
            }
        };
    }

    showUserFriendlyError() {
        // Kullanıcıya görünür hata mesajı gösterme
        // Sadece kritik hatalar için
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

    // Utility method for manual error reporting
    reportError(error, context = '') {
        this.handleError(error, context);
    }
}

// Error Handler'ı başlat
document.addEventListener('DOMContentLoaded', () => {
    new ErrorHandler();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ErrorHandler;
}
