/**
 * DC TEKNİK - Force Cache Clear
 * Tüm cache'leri agresif şekilde temizler
 */

(function() {
    'use strict';
    
    console.log('🧹 Force Cache Clear başlatılıyor...');
    
    // Service Worker'ı unregister et
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(function(registrations) {
            for(let registration of registrations) {
                registration.unregister().then(function(success) {
                    if (success) {
                        console.log('✅ Service Worker unregistered');
                    }
                });
            }
        });
    }
    
    // Cache Storage'ı temizle
    if ('caches' in window) {
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    console.log('🗑️ Deleting cache:', cacheName);
                    return caches.delete(cacheName);
                })
            );
        }).then(function() {
            console.log('✅ All caches cleared');
        });
    }
    
    // LocalStorage ve SessionStorage temizle (opsiyonel - yorum satırında)
    // localStorage.clear();
    // sessionStorage.clear();
    
    // Meta tag ile cache version kontrolü
    const metaVersion = document.querySelector('meta[name="cache-version"]');
    const currentVersion = metaVersion ? metaVersion.content : 'unknown';
    const storedVersion = localStorage.getItem('site-version');
    
    if (storedVersion !== currentVersion) {
        console.log('🔄 New version detected:', currentVersion);
        console.log('🔄 Old version:', storedVersion);
        
        // Tüm cache'leri temizle
        if ('caches' in window) {
            caches.keys().then(function(cacheNames) {
                cacheNames.forEach(function(cacheName) {
                    caches.delete(cacheName);
                });
            });
        }
        
        // Service Worker'ı yeniden register et
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then(function(registrations) {
                registrations.forEach(function(registration) {
                    registration.unregister();
                });
            });
        }
        
        // Yeni version'ı kaydet
        localStorage.setItem('site-version', currentVersion);
        
        // 2 saniye sonra sayfayı yenile
        setTimeout(function() {
            console.log('🔄 Reloading page with new version...');
            window.location.reload(true);
        }, 2000);
    } else {
        console.log('✅ Cache version up to date:', currentVersion);
    }
    
    // Global fonksiyon - manuel cache temizleme için
    window.forceClearCache = function() {
        console.log('🧹 Manual cache clear triggered...');
        
        // Service Worker
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then(function(registrations) {
                registrations.forEach(function(registration) {
                    registration.unregister();
                });
            });
        }
        
        // Cache Storage
        if ('caches' in window) {
            caches.keys().then(function(cacheNames) {
                cacheNames.forEach(function(cacheName) {
                    caches.delete(cacheName);
                });
            });
        }
        
        // Version'ı sıfırla
        localStorage.removeItem('site-version');
        
        // Sayfayı yenile
        setTimeout(function() {
            window.location.reload(true);
        }, 1000);
    };
    
    console.log('✅ Force Cache Clear hazır!');
    console.log('💡 Manuel temizleme için: window.forceClearCache()');
})();

