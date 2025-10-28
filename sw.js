/**
 * DC TEKNİK - Service Worker
 * PWA ve offline functionality için
 */

const CACHE_NAME = 'dcteknik-v1.0.0';
const urlsToCache = [
    '/',
    '/index.html',
    '/style.css',
    '/script.js',
    '/logo-new.svg',
    '/favicon-new.svg',
    '/manifest.webmanifest',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Install event
self.addEventListener('install', function(event) {
    console.log('🔧 DC TEKNİK - Service Worker installing...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('📦 DC TEKNİK - Caching files...');
                return cache.addAll(urlsToCache);
            })
            .then(function() {
                console.log('✅ DC TEKNİK - Service Worker installed');
                return self.skipWaiting();
            })
    );
});

// Activate event
self.addEventListener('activate', function(event) {
    console.log('🚀 DC TEKNİK - Service Worker activating...');
    
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheName !== CACHE_NAME) {
                        console.log('🗑️ DC TEKNİK - Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(function() {
            console.log('✅ DC TEKNİK - Service Worker activated');
            return self.clients.claim();
        })
    );
});

// Fetch event - Network First Strategy for better performance
self.addEventListener('fetch', function(event) {
    // Skip non-GET requests
    if (event.request.method !== 'GET') {
        return;
    }
    
    event.respondWith(
        // Try network first for better freshness
        fetch(event.request)
            .then(function(response) {
                // Check if valid response
                if (response && response.status === 200 && response.type === 'basic') {
                    // Clone response for caching
                    const responseToCache = response.clone();
                    
                    caches.open(CACHE_NAME)
                        .then(function(cache) {
                            cache.put(event.request, responseToCache);
                        });
                }
                
                console.log('🌐 DC TEKNİK - Fetched from network:', event.request.url);
                return response;
            })
            .catch(function(error) {
                // Network failed, try cache
                console.log('⚠️ DC TEKNİK - Network failed, trying cache:', event.request.url);
                return caches.match(event.request)
                    .then(function(cachedResponse) {
                        if (cachedResponse) {
                            console.log('📦 DC TEKNİK - Serving from cache:', event.request.url);
                            return cachedResponse;
                        }
                        
                        // Both network and cache failed
                        console.log('❌ DC TEKNİK - Fetch failed:', error);
                        
                        // Return offline page for navigation requests
                        if (event.request.mode === 'navigate') {
                            return caches.match('/offline.html') || new Response('Network error', { status: 503 });
                        }
                        
                        return new Response('Network error', { status: 503 });
                    });
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