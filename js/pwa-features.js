// PWA Features - DC TEKNİK
(function() {
    'use strict';
    
    class PWAFeatures {
        constructor() {
            this.deferredPrompt = null;
            this.isInstalled = false;
            this.isOnline = navigator.onLine;
            this.installPromptShown = false;
            this.init();
        }
        
        init() {
            this.setupServiceWorker();
            this.setupInstallPrompt();
            this.setupOfflineDetection();
            this.setupPushNotifications();
            this.setupBackgroundSync();
            this.setupAppLikeFeatures();
            this.setupShareAPI();
            this.setupFileHandling();
            this.setupProtocolHandling();
        }
        
        setupServiceWorker() {
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('/sw.js')
                    .then(registration => {
                        console.log('Service Worker registered successfully:', registration);
                        
                        // Check for updates
                        registration.addEventListener('updatefound', () => {
                            const newWorker = registration.installing;
                            newWorker.addEventListener('statechange', () => {
                                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                    this.showUpdateNotification();
                                }
                            });
                        });
                        
                        // Updated service worker available
                        if (registration.waiting) {
                            this.showUpdateNotification();
                        }
                    })
                    .catch(error => {
                        console.error('Service Worker registration failed:', error);
                    });
                
                // Handle service worker messages
                navigator.serviceWorker.addEventListener('message', event => {
                    if (event.data.type === 'RELOAD_PAGE') {
                        window.location.reload();
                    }
                });
            }
        }
        
        setupInstallPrompt() {
            // Listen for the beforeinstallprompt event
            window.addEventListener('beforeinstallprompt', (e) => {
                console.log('Install prompt triggered');
                e.preventDefault();
                this.deferredPrompt = e;
                this.showInstallPrompt();
            });
            
            // Listen for app installed event
            window.addEventListener('appinstalled', (e) => {
                console.log('PWA was installed');
                this.isInstalled = true;
                this.hideInstallPrompt();
                
                // Track installation
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'pwa_installed', {
                        event_category: 'PWA',
                        event_label: 'App Installed'
                    });
                }
            });
            
            // Check if app is already installed
            this.checkInstallationStatus();
        }
        
        showInstallPrompt() {
            if (this.installPromptShown || this.isInstalled) {
                return;
            }
            
            const installBanner = this.createInstallBanner();
            document.body.appendChild(installBanner);
            this.installPromptShown = true;
        }
        
        createInstallBanner() {
            const banner = document.createElement('div');
            banner.id = 'pwa-install-banner';
            banner.innerHTML = `
                <div class="install-banner">
                    <div class="install-content">
                        <div class="install-icon">
                            <i class="fas fa-mobile-alt"></i>
                        </div>
                        <div class="install-text">
                            <h3>DC TEKNİK'i Uygulama Olarak Yükle</h3>
                            <p>Hızlı erişim ve offline çalışma için uygulamayı yükleyin</p>
                        </div>
                        <div class="install-actions">
                            <button class="install-btn" id="install-btn">Yükle</button>
                            <button class="dismiss-btn" id="dismiss-btn">×</button>
                        </div>
                    </div>
                </div>
            `;
            
            // Add styles
            const style = document.createElement('style');
            style.textContent = `
                .install-banner {
                    position: fixed;
                    bottom: 20px;
                    left: 20px;
                    right: 20px;
                    background: linear-gradient(135deg, #0b5cff, #3b82f6);
                    color: white;
                    border-radius: 12px;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                    z-index: 10000;
                    animation: slideUp 0.3s ease-out;
                }
                
                .install-content {
                    display: flex;
                    align-items: center;
                    padding: 16px;
                    gap: 16px;
                }
                
                .install-icon {
                    font-size: 24px;
                    opacity: 0.9;
                }
                
                .install-text h3 {
                    margin: 0 0 4px 0;
                    font-size: 16px;
                    font-weight: 600;
                }
                
                .install-text p {
                    margin: 0;
                    font-size: 14px;
                    opacity: 0.9;
                }
                
                .install-actions {
                    display: flex;
                    gap: 8px;
                    margin-left: auto;
                }
                
                .install-btn {
                    background: rgba(255, 255, 255, 0.2);
                    color: white;
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    padding: 8px 16px;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                
                .install-btn:hover {
                    background: rgba(255, 255, 255, 0.3);
                }
                
                .dismiss-btn {
                    background: transparent;
                    color: white;
                    border: none;
                    font-size: 20px;
                    cursor: pointer;
                    padding: 8px;
                    border-radius: 50%;
                    transition: all 0.3s ease;
                }
                
                .dismiss-btn:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
                
                @keyframes slideUp {
                    from {
                        transform: translateY(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
                
                @media (max-width: 768px) {
                    .install-banner {
                        left: 10px;
                        right: 10px;
                        bottom: 10px;
                    }
                    
                    .install-content {
                        flex-direction: column;
                        text-align: center;
                        gap: 12px;
                    }
                    
                    .install-actions {
                        margin-left: 0;
                    }
                }
            `;
            document.head.appendChild(style);
            
            // Add event listeners
            document.getElementById('install-btn').addEventListener('click', () => {
                this.installApp();
            });
            
            document.getElementById('dismiss-btn').addEventListener('click', () => {
                this.hideInstallPrompt();
            });
            
            return banner;
        }
        
        async installApp() {
            if (!this.deferredPrompt) {
                return;
            }
            
            this.deferredPrompt.prompt();
            const { outcome } = await this.deferredPrompt.userChoice;
            
            console.log(`User response to the install prompt: ${outcome}`);
            
            if (outcome === 'accepted') {
                console.log('User accepted the install prompt');
            } else {
                console.log('User dismissed the install prompt');
            }
            
            this.deferredPrompt = null;
            this.hideInstallPrompt();
        }
        
        hideInstallPrompt() {
            const banner = document.getElementById('pwa-install-banner');
            if (banner) {
                banner.style.animation = 'slideDown 0.3s ease-out';
                setTimeout(() => {
                    banner.remove();
                }, 300);
            }
        }
        
        checkInstallationStatus() {
            // Check if app is running in standalone mode
            if (window.matchMedia('(display-mode: standalone)').matches || 
                window.navigator.standalone === true) {
                this.isInstalled = true;
                console.log('App is running in standalone mode');
            }
        }
        
        setupOfflineDetection() {
            // Online/offline detection
            window.addEventListener('online', () => {
                console.log('App is online');
                this.isOnline = true;
                this.showOnlineNotification();
                this.syncOfflineData();
            });
            
            window.addEventListener('offline', () => {
                console.log('App is offline');
                this.isOnline = false;
                this.showOfflineNotification();
            });
            
            // Initial check
            this.updateOnlineStatus();
        }
        
        updateOnlineStatus() {
            const statusIndicator = document.getElementById('online-status');
            if (statusIndicator) {
                statusIndicator.className = this.isOnline ? 'online' : 'offline';
                statusIndicator.textContent = this.isOnline ? 'Çevrimiçi' : 'Çevrimdışı';
            }
        }
        
        showOnlineNotification() {
            this.showNotification('Bağlantı yeniden kuruldu', 'success');
        }
        
        showOfflineNotification() {
            this.showNotification('Çevrimdışı modda çalışıyorsunuz', 'warning');
        }
        
        showUpdateNotification() {
            const notification = document.createElement('div');
            notification.className = 'update-notification';
            notification.innerHTML = `
                <div class="update-content">
                    <i class="fas fa-sync-alt"></i>
                    <span>Yeni güncelleme mevcut!</span>
                    <button class="update-btn" onclick="window.location.reload()">Güncelle</button>
                </div>
            `;
            
            // Add styles
            const style = document.createElement('style');
            style.textContent = `
                .update-notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: #059669;
                    color: white;
                    padding: 12px 16px;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                    z-index: 10000;
                    animation: slideDown 0.3s ease-out;
                }
                
                .update-content {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                
                .update-btn {
                    background: rgba(255, 255, 255, 0.2);
                    color: white;
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 12px;
                    cursor: pointer;
                }
                
                @keyframes slideDown {
                    from {
                        transform: translateY(-100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(style);
            document.body.appendChild(notification);
            
            // Auto-hide after 10 seconds
            setTimeout(() => {
                notification.remove();
            }, 10000);
        }
        
        setupPushNotifications() {
            if ('Notification' in window) {
                // Request notification permission
                if (Notification.permission === 'default') {
                    this.requestNotificationPermission();
                }
            }
        }
        
        async requestNotificationPermission() {
            try {
                const permission = await Notification.requestPermission();
                if (permission === 'granted') {
                    console.log('Notification permission granted');
                    this.showNotification('Bildirimler etkinleştirildi', 'success');
                } else {
                    console.log('Notification permission denied');
                }
            } catch (error) {
                console.error('Error requesting notification permission:', error);
            }
        }
        
        showNotification(message, type = 'info') {
            const notification = document.createElement('div');
            notification.className = `notification notification-${type}`;
            notification.innerHTML = `
                <div class="notification-content">
                    <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                    <span>${message}</span>
                </div>
            `;
            
            // Add styles if not already added
            if (!document.getElementById('notification-styles')) {
                const style = document.createElement('style');
                style.id = 'notification-styles';
                style.textContent = `
                    .notification {
                        position: fixed;
                        top: 20px;
                        right: 20px;
                        padding: 12px 16px;
                        border-radius: 8px;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                        z-index: 10000;
                        animation: slideIn 0.3s ease-out;
                    }
                    
                    .notification-success {
                        background: #059669;
                        color: white;
                    }
                    
                    .notification-warning {
                        background: #d97706;
                        color: white;
                    }
                    
                    .notification-error {
                        background: #dc2626;
                        color: white;
                    }
                    
                    .notification-info {
                        background: #0b5cff;
                        color: white;
                    }
                    
                    .notification-content {
                        display: flex;
                        align-items: center;
                        gap: 8px;
                    }
                    
                    @keyframes slideIn {
                        from {
                            transform: translateX(100%);
                            opacity: 0;
                        }
                        to {
                            transform: translateX(0);
                            opacity: 1;
                        }
                    }
                `;
                document.head.appendChild(style);
            }
            
            document.body.appendChild(notification);
            
            // Auto-hide after 5 seconds
            setTimeout(() => {
                notification.style.animation = 'slideOut 0.3s ease-out';
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }, 5000);
        }
        
        getNotificationIcon(type) {
            const icons = {
                success: 'check-circle',
                warning: 'exclamation-triangle',
                error: 'times-circle',
                info: 'info-circle'
            };
            return icons[type] || 'info-circle';
        }
        
        setupBackgroundSync() {
            if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
                // Register background sync for forms
                this.registerBackgroundSync('contact-form');
                this.registerBackgroundSync('appointment-booking');
                this.registerBackgroundSync('analytics-data');
            }
        }
        
        async registerBackgroundSync(tag) {
            try {
                const registration = await navigator.serviceWorker.ready;
                await registration.sync.register(tag);
                console.log(`Background sync registered for: ${tag}`);
            } catch (error) {
                console.error(`Background sync registration failed for ${tag}:`, error);
            }
        }
        
        async syncOfflineData() {
            if ('serviceWorker' in navigator) {
                try {
                    const registration = await navigator.serviceWorker.ready;
                    // Trigger background sync
                    await registration.sync.register('background-sync');
                    console.log('Offline data sync triggered');
                } catch (error) {
                    console.error('Failed to trigger offline data sync:', error);
                }
            }
        }
        
        setupAppLikeFeatures() {
            // Add app-like features
            this.setupSplashScreen();
            this.setupAppBar();
            this.setupNavigationDrawer();
            this.setupPullToRefresh();
        }
        
        setupSplashScreen() {
            // Create splash screen
            const splash = document.createElement('div');
            splash.id = 'splash-screen';
            splash.innerHTML = `
                <div class="splash-content">
                    <div class="splash-logo">
                        <img src="/logo-new.svg" alt="DC TEKNİK">
                    </div>
                    <div class="splash-text">
                        <h1>DC TEKNİK</h1>
                        <p>Dinamocu Serdar</p>
                    </div>
                    <div class="splash-loader">
                        <div class="loader"></div>
                    </div>
                </div>
            `;
            
            // Add styles
            const style = document.createElement('style');
            style.textContent = `
                #splash-screen {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(135deg, #0b5cff, #3b82f6);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10000;
                    animation: fadeOut 0.5s ease-out 2s forwards;
                }
                
                .splash-content {
                    text-align: center;
                }
                
                .splash-logo img {
                    width: 80px;
                    height: 80px;
                    margin-bottom: 20px;
                }
                
                .splash-text h1 {
                    font-size: 2rem;
                    margin: 0 0 8px 0;
                    font-weight: 700;
                }
                
                .splash-text p {
                    font-size: 1.1rem;
                    margin: 0 0 30px 0;
                    opacity: 0.9;
                }
                
                .loader {
                    width: 40px;
                    height: 40px;
                    border: 3px solid rgba(255, 255, 255, 0.3);
                    border-top: 3px solid white;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 0 auto;
                }
                
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                @keyframes fadeOut {
                    to {
                        opacity: 0;
                        visibility: hidden;
                    }
                }
            `;
            document.head.appendChild(style);
            document.body.appendChild(splash);
            
            // Hide splash screen after load
            window.addEventListener('load', () => {
                setTimeout(() => {
                    splash.remove();
                }, 2500);
            });
        }
        
        setupAppBar() {
            // Add app-like header
            const header = document.querySelector('.header');
            if (header) {
                header.classList.add('app-header');
            }
        }
        
        setupNavigationDrawer() {
            // Add navigation drawer for mobile
            if (window.innerWidth <= 768) {
                this.createNavigationDrawer();
            }
        }
        
        createNavigationDrawer() {
            const drawer = document.createElement('div');
            drawer.id = 'nav-drawer';
            drawer.innerHTML = `
                <div class="drawer-overlay"></div>
                <div class="drawer-content">
                    <div class="drawer-header">
                        <h3>DC TEKNİK</h3>
                        <button class="drawer-close">×</button>
                    </div>
                    <nav class="drawer-nav">
                        <a href="/">Ana Sayfa</a>
                        <a href="/blog.html">Blog</a>
                        <a href="/bobin.html">Bobin Sarma</a>
                        <a href="/?action=contact">İletişim</a>
                        <a href="/?action=whatsapp">WhatsApp</a>
                    </nav>
                </div>
            `;
            
            // Add styles
            const style = document.createElement('style');
            style.textContent = `
                #nav-drawer {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 9999;
                    display: none;
                }
                
                .drawer-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                }
                
                .drawer-content {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 280px;
                    height: 100%;
                    background: white;
                    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
                    transform: translateX(-100%);
                    transition: transform 0.3s ease;
                }
                
                #nav-drawer.open .drawer-content {
                    transform: translateX(0);
                }
                
                .drawer-header {
                    padding: 20px;
                    border-bottom: 1px solid #e2e8f0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .drawer-close {
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                }
                
                .drawer-nav {
                    padding: 20px;
                }
                
                .drawer-nav a {
                    display: block;
                    padding: 12px 0;
                    color: #1e293b;
                    text-decoration: none;
                    border-bottom: 1px solid #f1f5f9;
                }
                
                .drawer-nav a:hover {
                    color: #0b5cff;
                }
            `;
            document.head.appendChild(style);
            document.body.appendChild(drawer);
        }
        
        setupPullToRefresh() {
            // Add pull-to-refresh functionality
            let startY = 0;
            let currentY = 0;
            let isRefreshing = false;
            
            document.addEventListener('touchstart', (e) => {
                if (window.scrollY === 0) {
                    startY = e.touches[0].clientY;
                }
            });
            
            document.addEventListener('touchmove', (e) => {
                if (window.scrollY === 0 && startY > 0) {
                    currentY = e.touches[0].clientY;
                    const pullDistance = currentY - startY;
                    
                    if (pullDistance > 50 && !isRefreshing) {
                        this.triggerPullToRefresh();
                    }
                }
            });
            
            document.addEventListener('touchend', () => {
                startY = 0;
                currentY = 0;
            });
        }
        
        triggerPullToRefresh() {
            if (isRefreshing) return;
            
            isRefreshing = true;
            this.showNotification('Sayfa yenileniyor...', 'info');
            
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
        
        setupShareAPI() {
            if ('share' in navigator) {
                // Add share functionality to buttons
                this.addShareButtons();
            }
        }
        
        addShareButtons() {
            const shareButtons = document.querySelectorAll('[data-share]');
            shareButtons.forEach(button => {
                button.addEventListener('click', () => {
                    this.shareContent(button.dataset.share);
                });
            });
        }
        
        async shareContent(content) {
            try {
                await navigator.share({
                    title: 'DC TEKNİK',
                    text: content,
                    url: window.location.href
                });
            } catch (error) {
                console.log('Share cancelled or failed:', error);
            }
        }
        
        setupFileHandling() {
            // Handle file drops
            document.addEventListener('dragover', (e) => {
                e.preventDefault();
            });
            
            document.addEventListener('drop', (e) => {
                e.preventDefault();
                const files = e.dataTransfer.files;
                this.handleFiles(files);
            });
        }
        
        handleFiles(files) {
            Array.from(files).forEach(file => {
                if (file.type.startsWith('image/')) {
                    this.handleImageFile(file);
                }
            });
        }
        
        handleImageFile(file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                // Create image preview
                const preview = document.createElement('img');
                preview.src = e.target.result;
                preview.style.maxWidth = '200px';
                preview.style.maxHeight = '200px';
                
                // Show preview
                this.showNotification('Görsel yüklendi', 'success');
            };
            reader.readAsDataURL(file);
        }
        
        setupProtocolHandling() {
            // Handle custom protocol
            if (window.location.protocol === 'web+dcteknik:') {
                const action = window.location.search.split('action=')[1];
                this.handleCustomAction(action);
            }
        }
        
        handleCustomAction(action) {
            switch (action) {
                case 'whatsapp':
                    this.openWhatsApp();
                    break;
                case 'call':
                    this.makeCall();
                    break;
                case 'appointment':
                    this.openAppointmentModal();
                    break;
                default:
                    console.log('Unknown action:', action);
            }
        }
        
        openWhatsApp() {
            window.open('https://wa.me/905551234567', '_blank');
        }
        
        makeCall() {
            window.location.href = 'tel:+905551234567';
        }
        
        openAppointmentModal() {
            const modal = document.getElementById('appointment-modal');
            if (modal) {
                modal.style.display = 'block';
            }
        }
        
        // Public methods
        getInstallationStatus() {
            return this.isInstalled;
        }
        
        getOnlineStatus() {
            return this.isOnline;
        }
        
        async clearCache() {
            if ('serviceWorker' in navigator) {
                try {
                    const registration = await navigator.serviceWorker.ready;
                    await registration.unregister();
                    
                    // Clear all caches
                    const cacheNames = await caches.keys();
                    await Promise.all(
                        cacheNames.map(cacheName => caches.delete(cacheName))
                    );
                    
                    console.log('Cache cleared successfully');
                    this.showNotification('Cache temizlendi', 'success');
                } catch (error) {
                    console.error('Failed to clear cache:', error);
                }
            }
        }
    }
    
    // Initialize PWA features
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.pwaFeatures = new PWAFeatures();
        });
    } else {
        window.pwaFeatures = new PWAFeatures();
    }
})();

