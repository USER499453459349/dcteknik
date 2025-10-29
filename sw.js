/**
 * DC TEKNİK - Service Worker
 * Blog performansı için caching stratejisi
 */

const CACHE_NAME = 'dctenik-blog-v1.0.0';
const STATIC_CACHE = 'dctenik-static-v1.0.0';
const DYNAMIC_CACHE = 'dctenik-dynamic-v1.0.0';

// Cache edilecek statik kaynaklar
const STATIC_ASSETS = [
    '/',
    '/blog.html',
    '/style.css',
    '/blog-optimized-styles.css',
    '/js/performance-optimizer.js',
    '/js/script.js',
    '/logo-new.svg',
    '/manifest.webmanifest',
    'https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// Cache edilecek dinamik kaynaklar
const DYNAMIC_ASSETS = [
    '/blog-posts/',
    'https://images.unsplash.com/'
];

// Service Worker yüklendiğinde
self.addEventListener('install', event => {
    console.log('🔧 Service Worker yükleniyor...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('📦 Statik kaynaklar cache\'leniyor...');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                console.log('✅ Statik kaynaklar cache\'lendi');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('❌ Cache hatası:', error);
            })
    );
});

// Service Worker aktif olduğunda
self.addEventListener('activate', event => {
    console.log('🚀 Service Worker aktif');
    
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('🗑️ Eski cache temizleniyor:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('✅ Cache temizlendi');
                return self.clients.claim();
            })
    );
});

// Fetch olayları
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Sadece GET isteklerini işle
    if (request.method !== 'GET') {
        return;
    }
    
    // Farklı stratejiler uygula
    if (isStaticAsset(request)) {
        event.respondWith(cacheFirst(request));
    } else if (isDynamicAsset(request)) {
        event.respondWith(networkFirst(request));
    } else if (isImage(request)) {
        event.respondWith(imageStrategy(request));
    } else {
        event.respondWith(networkFirst(request));
    }
});

// Statik kaynak kontrolü
function isStaticAsset(request) {
    const url = new URL(request.url);
    return STATIC_ASSETS.some(asset => 
        url.pathname.includes(asset) || 
        url.href === asset
    );
}

// Dinamik kaynak kontrolü
function isDynamicAsset(request) {
    const url = new URL(request.url);
    return DYNAMIC_ASSETS.some(asset => 
        url.pathname.includes(asset) || 
        url.href.includes(asset)
    );
}

// Görsel kontrolü
function isImage(request) {
    return request.destination === 'image';
}

// Cache First stratejisi (statik kaynaklar için)
async function cacheFirst(request) {
    try {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            console.log('📦 Cache\'den yüklendi:', request.url);
            return cachedResponse;
        }
        
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, networkResponse.clone());
            console.log('💾 Cache\'e kaydedildi:', request.url);
        }
        
        return networkResponse;
    } catch (error) {
        console.error('❌ Cache First hatası:', error);
        return new Response('Offline', { status: 503 });
    }
}

// Network First stratejisi (dinamik kaynaklar için)
async function networkFirst(request) {
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
            console.log('🌐 Ağdan yüklendi ve cache\'e kaydedildi:', request.url);
        }
        return networkResponse;
    } catch (error) {
        console.log('📦 Ağ hatası, cache\'den yükleniyor:', request.url);
        const cachedResponse = await caches.match(request);
        return cachedResponse || new Response('Offline', { status: 503 });
    }
}

// Görsel stratejisi (lazy loading için)
async function imageStrategy(request) {
    try {
        // Önce cache'de ara
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Cache'de yoksa ağdan yükle
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        // Hata durumunda placeholder döndür
        return new Response('', { status: 200 });
    }
}

// Background sync
self.addEventListener('sync', event => {
    if (event.tag === 'background-sync') {
        console.log('🔄 Background sync çalışıyor...');
        event.waitUntil(doBackgroundSync());
    }
});

async function doBackgroundSync() {
    // Offline durumda yapılan işlemleri senkronize et
    console.log('📤 Offline işlemler senkronize ediliyor...');
}

// Push notifications
self.addEventListener('push', event => {
    if (event.data) {
        const data = event.data.json();
        const options = {
            body: data.body,
            icon: '/logo-new.svg',
            badge: '/logo-new.svg',
            vibrate: [100, 50, 100],
            data: {
                dateOfArrival: Date.now(),
                primaryKey: 1
            },
            actions: [
                {
                    action: 'explore',
                    title: 'Blog\'u İncele',
                    icon: '/logo-new.svg'
                },
                {
                    action: 'close',
                    title: 'Kapat',
                    icon: '/logo-new.svg'
                }
            ]
        };
        
        event.waitUntil(
            self.registration.showNotification(data.title, options)
        );
    }
});

// Notification click
self.addEventListener('notificationclick', event => {
    event.notification.close();
    
    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/blog.html')
        );
    }
});

// Message handling
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({ version: CACHE_NAME });
    }
});

// Cache temizleme
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'CLEAR_CACHE') {
        event.waitUntil(
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => caches.delete(cacheName))
                );
            }).then(() => {
                console.log('🗑️ Tüm cache temizlendi');
                event.ports[0].postMessage({ success: true });
            })
        );
    }
});

console.log('✅ Service Worker yüklendi ve hazır');