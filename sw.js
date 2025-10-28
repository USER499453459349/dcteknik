/**
 * DC TEKNİK - Service Worker
 * PWA ve offline functionality için
 * Optimized for fast updates and data transfer
 */

// Cache versioning - automatically update for new deployments
// Cache version - auto-updated by build script (or use timestamp for auto-update)
const CACHE_VERSION = 'v1.7.1';
const CACHE_NAME = `dcteknik-${CACHE_VERSION}`;
const STATIC_CACHE = `dcteknik-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `dcteknik-dynamic-${CACHE_VERSION}`;

// Critical resources - cached immediately (Cache First)
const CRITICAL_URLS = [
    '/',
    '/index.html',
    '/style.css',
    '/script.js',
    '/logo-new.svg',
    '/favicon-new.svg',
    '/manifest.webmanifest'
];

// External resources - cached with network fallback
const EXTERNAL_URLS = [
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://www.googletagmanager.com/gtag/js?id=G-N1Z05DJ9B4'
];

// Security scripts - must be fresh
const SECURITY_SCRIPTS = [
    '/js/security-firewall.js',
    '/js/security-logger.js',
    '/js/advanced-security.js',
    '/js/security-monitor.js'
];

// Install event - Fast cache strategy
self.addEventListener('install', function(event) {
    console.log('🔧 DC TEKNİK - Service Worker installing...', CACHE_VERSION);
    
    event.waitUntil(
        Promise.all([
            // Cache critical resources first
            caches.open(STATIC_CACHE).then(function(cache) {
                console.log('📦 Caching critical resources...');
                return cache.addAll(CRITICAL_URLS).catch(err => {
                    console.warn('Failed to cache some critical resources:', err);
                });
            }),
            // Cache external resources
            caches.open(DYNAMIC_CACHE).then(function(cache) {
                console.log('📦 Caching external resources...');
                return Promise.allSettled(
                    EXTERNAL_URLS.map(url => 
                        fetch(url).then(response => {
                            if (response.ok) {
                                return cache.put(url, response);
                            }
                        }).catch(err => {
                            console.warn('Failed to cache external resource:', url, err);
                        })
                    )
                );
            })
        ]).then(function() {
            console.log('✅ DC TEKNİK - Service Worker installed');
            return self.skipWaiting(); // Activate immediately
        })
    );
});

// Activate event - Clean old caches for fast updates
self.addEventListener('activate', function(event) {
    console.log('🚀 DC TEKNİK - Service Worker activating...', CACHE_VERSION);
    
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    // Delete all old caches (not current version)
                    if (cacheName !== STATIC_CACHE && 
                        cacheName !== DYNAMIC_CACHE && 
                        cacheName.startsWith('dcteknik-')) {
                        console.log('🗑️ Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(function() {
            console.log('✅ DC TEKNİK - Service Worker activated');
            // Notify all clients about update
            return self.clients.claim().then(() => {
                // Broadcast update message
                return self.clients.matchAll().then(clients => {
                    clients.forEach(client => {
                        client.postMessage({
                            type: 'SW_UPDATE',
                            version: CACHE_VERSION
                        });
                    });
                });
            });
        })
    );
});

// Fetch event - Optimized cache strategy
self.addEventListener('fetch', function(event) {
    const url = new URL(event.request.url);
    const requestUrl = event.request.url;
    
    // Skip non-GET requests and chrome-extension
    if (event.request.method !== 'GET' || url.protocol === 'chrome-extension:') {
        return;
    }
    
    // Strategy 1: Security scripts - Network First (always fresh)
    if (SECURITY_SCRIPTS.some(script => requestUrl.includes(script))) {
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    if (response.ok) {
                        const responseToCache = response.clone();
                        caches.open(DYNAMIC_CACHE).then(cache => {
                            cache.put(event.request, responseToCache);
                        });
                    }
                    return response;
                })
                .catch(() => {
                    return caches.match(event.request);
                })
        );
        return;
    }
    
    // Strategy 2: HTML pages - Network First with short cache
    if (event.request.headers.get('accept').includes('text/html')) {
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    const responseToCache = response.clone();
                    caches.open(DYNAMIC_CACHE).then(cache => {
                        cache.put(event.request, responseToCache);
                    });
                    return response;
                })
                .catch(() => {
                    return caches.match(event.request) || 
                           caches.match('/index.html');
                })
        );
        return;
    }
    
    // Strategy 3: Static assets (CSS, JS, images) - Cache First
    if (requestUrl.match(/\.(css|js|svg|png|jpg|jpeg|gif|webp|woff|woff2|ttf|eot)$/i)) {
        event.respondWith(
            caches.match(event.request)
                .then(function(response) {
                    if (response) {
                        // Return cached version immediately
                        return response;
                    }
                    
                    // Fetch from network and cache
                    return fetch(event.request)
                        .then(function(response) {
                            // Check if valid response
                            if (!response || response.status !== 200) {
                                return response;
                            }
                            
                            const responseToCache = response.clone();
                            const cacheToUse = CRITICAL_URLS.some(critical => requestUrl.includes(critical))
                                ? STATIC_CACHE : DYNAMIC_CACHE;
                            
                            caches.open(cacheToUse).then(function(cache) {
                                cache.put(event.request, responseToCache);
                            });
                            
                            return response;
                        })
                        .catch(function(error) {
                            console.warn('Fetch failed:', requestUrl, error);
                        });
                })
        );
        return;
    }
    
    // Strategy 4: API/data requests - Network First with cache fallback
    if (requestUrl.includes('/api/') || requestUrl.includes('/data/')) {
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    if (response.ok) {
                        const responseToCache = response.clone();
                        caches.open(DYNAMIC_CACHE).then(cache => {
                            cache.put(event.request, responseToCache);
                        });
                    }
                    return response;
                })
                .catch(() => {
                    return caches.match(event.request);
                })
        );
        return;
    }
    
    // Default: Network First
    event.respondWith(
        fetch(event.request)
            .then(response => {
                if (response.ok) {
                    const responseToCache = response.clone();
                    caches.open(DYNAMIC_CACHE).then(cache => {
                        cache.put(event.request, responseToCache);
                    });
                }
                return response;
            })
            .catch(() => {
                return caches.match(event.request);
            })
    );
});

// Background sync
self.addEventListener('sync', function(event) {
    if (event.tag === 'background-sync') {
        console.log('🔄 DC TEKNİK - Background sync triggered');
        event.waitUntil(doBackgroundSync());
    }
});

function doBackgroundSync() {
    // Background sync logic here
    return Promise.resolve();
}

// Push notifications
self.addEventListener('push', function(event) {
    console.log('📱 DC TEKNİK - Push notification received');
    
    const options = {
        body: event.data ? event.data.text() : 'DC TEKNİK - Yeni bildirim',
        icon: '/favicon-192x192.png',
        badge: '/favicon-192x192.png',
        vibrate: [200, 100, 200],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'Detayları Gör',
                icon: '/favicon-192x192.png'
            },
            {
                action: 'close',
                title: 'Kapat',
                icon: '/favicon-192x192.png'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('DC TEKNİK', options)
    );
});

// Notification click
self.addEventListener('notificationclick', function(event) {
    console.log('🔔 DC TEKNİK - Notification clicked');
    
    event.notification.close();
    
    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/')
        );
    } else if (event.action === 'close') {
        // Just close the notification
    } else {
        // Default action - open the app
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Message handling
self.addEventListener('message', function(event) {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

console.log('✅ DC TEKNİK - Service Worker loaded successfully');