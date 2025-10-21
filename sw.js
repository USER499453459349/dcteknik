// Advanced Service Worker for DC TEKNİK
const CACHE_NAME = 'dcteknik-v1.12.5-hard-refresh';
const STATIC_CACHE = 'dcteknik-static-v1.12.5';
const DYNAMIC_CACHE = 'dcteknik-dynamic-v1.12.5';
const IMAGE_CACHE = 'dcteknik-images-v1.12.5';

const urlsToCache = [
    '/',
    '/index.html',
    '/blog.html',
    '/cinar.html',
    '/vw-48v-sarj-dinamosu.html',
    '/style.css',
    '/cinar.css',
    '/blog-styles.css',
    '/script.js',
    // Keep core JS minimal in precache; other JS via runtime cache
    '/js/translations.js',
    '/js/language-switcher.js',
    '/manifest.webmanifest',
    '/logo-new.svg',
    '/favicon-new.svg',
    '/sitemap.xml',
    '/robots.txt',
    '/feed.xml',
    '/offline.html'
];

const CACHE_STRATEGIES = {
    CACHE_FIRST: 'cache-first',
    NETWORK_FIRST: 'network-first',
    STALE_WHILE_REVALIDATE: 'stale-while-revalidate',
    NETWORK_ONLY: 'network-only',
    CACHE_ONLY: 'cache-only'
};

// Advanced Cache Strategies
function getCacheStrategy(request) {
    const url = new URL(request.url);
    
    // Static assets - Cache First
    if (url.pathname.match(/\.(css|js|woff2?|ttf|eot)$/)) {
        return CACHE_STRATEGIES.CACHE_FIRST;
    }
    
    // Images - Cache First with fallback
    if (url.pathname.match(/\.(jpg|jpeg|png|gif|webp|avif|svg)$/)) {
        return CACHE_STRATEGIES.CACHE_FIRST;
    }
    
    // HTML pages - Network First
    if (url.pathname.endsWith('.html') || url.pathname === '/') {
        return CACHE_STRATEGIES.NETWORK_FIRST;
    }
    
    // API calls - Network First
    if (url.pathname.startsWith('/api/')) {
        return CACHE_STRATEGIES.NETWORK_FIRST;
    }
    
    // Default - Stale While Revalidate
    return CACHE_STRATEGIES.STALE_WHILE_REVALIDATE;
}

// Cache First Strategy
async function cacheFirst(request, cacheName) {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
        return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
}

// Network First Strategy
async function networkFirst(request, cacheName) {
    const cache = await caches.open(cacheName);
    
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        const cachedResponse = await cache.match(request);
        if (cachedResponse) return cachedResponse;
        if (request.mode === 'navigate') {
            const offline = await caches.match('/offline.html');
            if (offline) return offline;
        }
        return new Response('Offline', { status: 503 });
    }
}

// Stale While Revalidate Strategy
async function staleWhileRevalidate(request, cacheName) {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    const fetchPromise = fetch(request).then(networkResponse => {
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    });
    
    return cachedResponse || fetchPromise;
}

// Install event
self.addEventListener('install', function(event) {
    event.waitUntil(
        (async () => {
            // Offline first cache refresh
            const cache = await caches.open(STATIC_CACHE);
            await cache.addAll(urlsToCache.map(u => u + (u.includes('?') ? '&' : '?') + 'v=' + Date.now()));
            await caches.open(DYNAMIC_CACHE);
            await caches.open(IMAGE_CACHE);
            console.log('Advanced Service Worker installed');
            return self.skipWaiting();
        })()
    );
});

// Fetch event
self.addEventListener('fetch', function(event) {
    const request = event.request;
    const strategy = getCacheStrategy(request);
    
    let responsePromise;
    
    switch (strategy) {
        case CACHE_STRATEGIES.CACHE_FIRST:
            if (request.url.match(/\.(jpg|jpeg|png|gif|webp|avif|svg)$/)) {
                responsePromise = cacheFirst(request, IMAGE_CACHE);
            } else {
                responsePromise = cacheFirst(request, STATIC_CACHE);
            }
            break;
            
        case CACHE_STRATEGIES.NETWORK_FIRST:
            responsePromise = networkFirst(request, DYNAMIC_CACHE);
            break;
            
        case CACHE_STRATEGIES.STALE_WHILE_REVALIDATE:
            responsePromise = staleWhileRevalidate(request, DYNAMIC_CACHE);
            break;
            
        default:
            responsePromise = fetch(request);
    }
    
    event.respondWith(responsePromise);
});

// Activate event
self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (![STATIC_CACHE, DYNAMIC_CACHE, IMAGE_CACHE].includes(cacheName)) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(async () => {
            console.log('Advanced Service Worker activated');
            const clientsArr = await self.clients.matchAll({ includeUncontrolled: true });
            clientsArr.forEach(client => client.postMessage({ type: 'RELOAD_PAGE' }));
            return self.clients.claim();
        })
    );
});

// Background Sync
self.addEventListener('sync', function(event) {
    if (event.tag === 'background-sync') {
        event.waitUntil(doBackgroundSync());
    }
});

// Push Notifications
self.addEventListener('push', function(event) {
    if (event.data) {
        const data = event.data.json();
        const options = {
            body: data.body,
            icon: '/favicon-new.svg',
            badge: '/favicon-new.svg',
            vibrate: [100, 50, 100],
            data: data.data,
            actions: [
                {
                    action: 'explore',
                    title: 'Keşfet',
                    icon: '/favicon-new.svg'
                },
                {
                    action: 'close',
                    title: 'Kapat',
                    icon: '/favicon-new.svg'
                }
            ]
        };
        
        event.waitUntil(
            self.registration.showNotification(data.title, options)
        );
    }
});

// Notification Click
self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    
    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Background Sync Implementation
async function doBackgroundSync() {
    // Sync offline data when connection is restored
    console.log('Background sync triggered');
}
