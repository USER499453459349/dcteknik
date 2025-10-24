// Advanced Mobile Features JavaScript
// DC TEKNİK - Dinamocu Serdar

class AdvancedMobileFeatures {
    constructor() {
        this.isMobile = this.detectMobile();
        this.isPWA = this.detectPWA();
        this.deviceCapabilities = this.detectDeviceCapabilities();
        this.networkInfo = this.getNetworkInfo();
        
        this.mobileFeatures = {
            advanced: {
                offlineMode: false,
                backgroundSync: false,
                pushNotifications: false,
                geofencing: false,
                biometricAuth: false,
                voiceCommands: false,
                augmentedReality: false,
                machineLearning: false
            },
            performance: {
                lazyLoading: true,
                imageOptimization: true,
                codeSplitting: true,
                serviceWorker: true,
                cacheStrategy: 'aggressive'
            },
            ux: {
                hapticFeedback: true,
                gestureNavigation: true,
                adaptiveUI: true,
                darkMode: true,
                accessibility: true
            }
        };
        
        this.init();
    }

    init() {
        this.setupAdvancedPWA();
        this.implementOfflineMode();
        this.addBackgroundSync();
        this.setupPushNotifications();
        this.addGeofencing();
        this.implementBiometricAuth();
        this.addVoiceCommands();
        this.setupAugmentedReality();
        this.implementMachineLearning();
        this.enhanceMobilePerformance();
        this.addAdvancedUX();
        
        console.log('📱 Advanced Mobile Features initialized');
    }

    // Detect mobile device
    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    // Detect PWA
    detectPWA() {
        return window.matchMedia('(display-mode: standalone)').matches || 
               window.navigator.standalone === true;
    }

    // Detect device capabilities
    detectDeviceCapabilities() {
        return {
            touch: 'ontouchstart' in window,
            accelerometer: 'DeviceMotionEvent' in window,
            gyroscope: 'DeviceOrientationEvent' in window,
            camera: 'mediaDevices' in navigator,
            microphone: 'mediaDevices' in navigator,
            geolocation: 'geolocation' in navigator,
            vibration: 'vibrate' in navigator,
            share: 'share' in navigator,
            notifications: 'Notification' in window,
            serviceWorker: 'serviceWorker' in navigator,
            webGL: !!document.createElement('canvas').getContext('webgl'),
            webRTC: 'RTCPeerConnection' in window,
            webAssembly: 'WebAssembly' in window
        };
    }

    // Get network information
    getNetworkInfo() {
        if (navigator.connection) {
            return {
                effectiveType: navigator.connection.effectiveType,
                downlink: navigator.connection.downlink,
                rtt: navigator.connection.rtt,
                saveData: navigator.connection.saveData
            };
        }
        return null;
    }

    // Setup Advanced PWA
    setupAdvancedPWA() {
        this.addPWAInstallPrompt();
        this.enhancePWAFeatures();
        this.addPWAShortcuts();
        this.implementPWASync();
    }

    // Add PWA install prompt
    addPWAInstallPrompt() {
        let deferredPrompt;
        
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            
            // Show install button
            this.showInstallButton(deferredPrompt);
        });

        window.addEventListener('appinstalled', () => {
            console.log('PWA installed successfully');
            this.trackEvent('pwa_installed');
            this.showNotification('PWA başarıyla yüklendi!', 'success');
        });
    }

    // Show install button
    showInstallButton(deferredPrompt) {
        const installButton = document.createElement('button');
        installButton.className = 'pwa-install-button';
        installButton.innerHTML = '📱 Uygulamayı Yükle';
        installButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            z-index: 10000;
            background: linear-gradient(135deg, #059669, #10b981);
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 25px;
            cursor: pointer;
            font-weight: 600;
            box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3);
            transition: all 0.3s ease;
        `;
        
        installButton.addEventListener('click', async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                console.log(`PWA install outcome: ${outcome}`);
                deferredPrompt = null;
                installButton.remove();
            }
        });
        
        document.body.appendChild(installButton);
    }

    // Enhance PWA features
    enhancePWAFeatures() {
        // Add PWA shortcuts
        if (navigator.serviceWorker) {
            navigator.serviceWorker.register('/sw.js').then(registration => {
                console.log('Advanced PWA Service Worker registered');
            });
        }

        // Add PWA theme color
        const themeColor = document.querySelector('meta[name="theme-color"]');
        if (themeColor) {
            themeColor.content = '#0b5cff';
        }

        // Add PWA status bar style
        const statusBarStyle = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
        if (statusBarStyle) {
            statusBarStyle.content = 'default';
        }
    }

    // Add PWA shortcuts
    addPWAShortcuts() {
        const manifest = {
            "shortcuts": [
                {
                    "name": "Randevu Al",
                    "short_name": "Randevu",
                    "description": "Hızlı randevu alma",
                    "url": "/appointment",
                    "icons": [
                        {
                            "src": "/favicon-192x192.png",
                            "sizes": "192x192"
                        }
                    ]
                },
                {
                    "name": "Fiyat Hesapla",
                    "short_name": "Fiyat",
                    "description": "Hızlı fiyat hesaplama",
                    "url": "/price-calculator",
                    "icons": [
                        {
                            "src": "/favicon-192x192.png",
                            "sizes": "192x192"
                        }
                    ]
                }
            ]
        };

        // Update manifest
        const manifestLink = document.querySelector('link[rel="manifest"]');
        if (manifestLink) {
            fetch(manifestLink.href)
                .then(response => response.json())
                .then(data => {
                    const updatedManifest = { ...data, ...manifest };
                    const blob = new Blob([JSON.stringify(updatedManifest)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    manifestLink.href = url;
                });
        }
    }

    // Implement PWA sync
    implementPWASync() {
        if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
            navigator.serviceWorker.ready.then(registration => {
                // Register background sync
                registration.sync.register('background-sync').then(() => {
                    console.log('Background sync registered');
                });
            });
        }
    }

    // Implement offline mode
    implementOfflineMode() {
        this.addOfflineIndicator();
        this.setupOfflineStorage();
        this.addOfflineForms();
        this.implementOfflineQueue();
    }

    // Add offline indicator
    addOfflineIndicator() {
        const offlineIndicator = document.createElement('div');
        offlineIndicator.id = 'offline-indicator';
        offlineIndicator.innerHTML = '📡 Çevrimdışı Mod';
        offlineIndicator.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: #dc2626;
            color: white;
            padding: 0.5rem;
            text-align: center;
            z-index: 10000;
            display: none;
            font-weight: 600;
        `;
        
        document.body.appendChild(offlineIndicator);
        
        // Listen for online/offline events
        window.addEventListener('online', () => {
            offlineIndicator.style.display = 'none';
            this.showNotification('İnternet bağlantısı geri geldi!', 'success');
        });
        
        window.addEventListener('offline', () => {
            offlineIndicator.style.display = 'block';
            this.showNotification('Çevrimdışı mod aktif', 'warning');
        });
    }

    // Setup offline storage
    setupOfflineStorage() {
        if ('indexedDB' in window) {
            const dbName = 'DC_TEKNIK_OFFLINE';
            const dbVersion = 1;
            
            const request = indexedDB.open(dbName, dbVersion);
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Create object stores
                if (!db.objectStoreNames.contains('forms')) {
                    db.createObjectStore('forms', { keyPath: 'id', autoIncrement: true });
                }
                
                if (!db.objectStoreNames.contains('analytics')) {
                    db.createObjectStore('analytics', { keyPath: 'id', autoIncrement: true });
                }
            };
            
            request.onsuccess = (event) => {
                this.db = event.target.result;
                console.log('Offline storage initialized');
            };
        }
    }

    // Add offline forms
    addOfflineForms() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                if (!navigator.onLine) {
                    e.preventDefault();
                    this.saveFormOffline(form);
                }
            });
        });
    }

    // Save form offline
    saveFormOffline(form) {
        const formData = new FormData(form);
        const formObject = {};
        
        for (let [key, value] of formData.entries()) {
            formObject[key] = value;
        }
        
        if (this.db) {
            const transaction = this.db.transaction(['forms'], 'readwrite');
            const store = transaction.objectStore('forms');
            
            store.add({
                data: formObject,
                timestamp: new Date().toISOString(),
                url: window.location.href
            });
            
            this.showNotification('Form çevrimdışı kaydedildi', 'info');
        }
    }

    // Implement offline queue
    implementOfflineQueue() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.addEventListener('message', (event) => {
                if (event.data.type === 'OFFLINE_QUEUE') {
                    this.processOfflineQueue(event.data.queue);
                }
            });
        }
    }

    // Process offline queue
    processOfflineQueue(queue) {
        queue.forEach(item => {
            if (item.type === 'form') {
                this.submitForm(item.data);
            } else if (item.type === 'analytics') {
                this.sendAnalytics(item.data);
            }
        });
    }

    // Add background sync
    addBackgroundSync() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.ready.then(registration => {
                // Listen for sync events
                registration.addEventListener('sync', (event) => {
                    if (event.tag === 'background-sync') {
                        this.performBackgroundSync();
                    }
                });
            });
        }
    }

    // Perform background sync
    performBackgroundSync() {
        // Sync offline forms
        this.syncOfflineForms();
        
        // Sync analytics data
        this.syncAnalyticsData();
        
        // Sync user preferences
        this.syncUserPreferences();
    }

    // Sync offline forms
    syncOfflineForms() {
        if (this.db) {
            const transaction = this.db.transaction(['forms'], 'readonly');
            const store = transaction.objectStore('forms');
            const request = store.getAll();
            
            request.onsuccess = (event) => {
                const forms = event.target.result;
                forms.forEach(form => {
                    this.submitForm(form.data);
                });
            };
        }
    }

    // Sync analytics data
    syncAnalyticsData() {
        if (this.db) {
            const transaction = this.db.transaction(['analytics'], 'readonly');
            const store = transaction.objectStore('analytics');
            const request = store.getAll();
            
            request.onsuccess = (event) => {
                const analytics = event.target.result;
                analytics.forEach(data => {
                    this.sendAnalytics(data);
                });
            };
        }
    }

    // Sync user preferences
    syncUserPreferences() {
        const preferences = {
            theme: localStorage.getItem('theme'),
            language: localStorage.getItem('language'),
            notifications: localStorage.getItem('notifications'),
            location: localStorage.getItem('location')
        };
        
        this.sendUserPreferences(preferences);
    }

    // Setup push notifications
    setupPushNotifications() {
        if ('Notification' in window && 'serviceWorker' in navigator) {
            this.requestNotificationPermission();
            this.setupNotificationHandlers();
            this.addNotificationTriggers();
        }
    }

    // Request notification permission
    requestNotificationPermission() {
        if (Notification.permission === 'default') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    this.subscribeToNotifications();
                }
            });
        } else if (Notification.permission === 'granted') {
            this.subscribeToNotifications();
        }
    }

    // Subscribe to notifications
    subscribeToNotifications() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.ready.then(registration => {
                return registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: this.urlBase64ToUint8Array('YOUR_VAPID_PUBLIC_KEY')
                });
            }).then(subscription => {
                console.log('Push subscription:', subscription);
                this.sendSubscriptionToServer(subscription);
            });
        }
    }

    // Setup notification handlers
    setupNotificationHandlers() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.addEventListener('message', (event) => {
                if (event.data.type === 'NOTIFICATION_CLICK') {
                    this.handleNotificationClick(event.data);
                }
            });
        }
    }

    // Handle notification click
    handleNotificationClick(data) {
        if (data.action === 'open_appointment') {
            window.location.href = '/appointment';
        } else if (data.action === 'open_contact') {
            window.location.href = '/contact';
        } else if (data.action === 'open_services') {
            window.location.href = '/services';
        }
    }

    // Add notification triggers
    addNotificationTriggers() {
        // Appointment reminder
        this.scheduleAppointmentReminder();
        
        // Service reminder
        this.scheduleServiceReminder();
        
        // Promotion notifications
        this.schedulePromotionNotifications();
    }

    // Schedule appointment reminder
    scheduleAppointmentReminder() {
        const appointmentTime = localStorage.getItem('appointment_time');
        if (appointmentTime) {
            const time = new Date(appointmentTime);
            const now = new Date();
            
            if (time > now) {
                setTimeout(() => {
                    this.showNotification('Randevunuz yaklaşıyor!', 'info');
                }, time.getTime() - now.getTime());
            }
        }
    }

    // Schedule service reminder
    scheduleServiceReminder() {
        const lastService = localStorage.getItem('last_service');
        if (lastService) {
            const serviceDate = new Date(lastService);
            const nextService = new Date(serviceDate.getTime() + (30 * 24 * 60 * 60 * 1000)); // 30 days
            const now = new Date();
            
            if (nextService > now) {
                setTimeout(() => {
                    this.showNotification('Servis zamanı geldi!', 'info');
                }, nextService.getTime() - now.getTime());
            }
        }
    }

    // Schedule promotion notifications
    schedulePromotionNotifications() {
        // Schedule weekly promotions
        setInterval(() => {
            this.showNotification('Bu hafta özel indirimler!', 'info');
        }, 7 * 24 * 60 * 60 * 1000);
    }

    // Add geofencing
    addGeofencing() {
        if ('geolocation' in navigator) {
            this.setupGeofencing();
            this.addLocationTriggers();
        }
    }

    // Setup geofencing
    setupGeofencing() {
        const businessLocation = {
            latitude: 40.9667,
            longitude: 29.2667,
            radius: 1000 // 1km radius
        };
        
        this.geofence = businessLocation;
        this.checkGeofence();
    }

    // Check geofence
    checkGeofence() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userLocation = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    };
                    
                    const distance = this.calculateDistance(userLocation, this.geofence);
                    
                    if (distance <= this.geofence.radius) {
                        this.showGeofenceNotification();
                    }
                },
                (error) => {
                    console.log('Geolocation error:', error);
                }
            );
        }
    }

    // Calculate distance between two points
    calculateDistance(point1, point2) {
        const R = 6371e3; // Earth's radius in meters
        const φ1 = point1.latitude * Math.PI/180;
        const φ2 = point2.latitude * Math.PI/180;
        const Δφ = (point2.latitude - point1.latitude) * Math.PI/180;
        const Δλ = (point2.longitude - point1.longitude) * Math.PI/180;

        const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ/2) * Math.sin(Δλ/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

        return R * c;
    }

    // Show geofence notification
    showGeofenceNotification() {
        this.showNotification('DC TEKNİK\'e yakınsınız! Hızlı servis için bize uğrayın.', 'info');
    }

    // Add location triggers
    addLocationTriggers() {
        // Watch position for geofencing
        if (navigator.geolocation) {
            navigator.geolocation.watchPosition(
                (position) => {
                    const userLocation = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    };
                    
                    const distance = this.calculateDistance(userLocation, this.geofence);
                    
                    if (distance <= this.geofence.radius) {
                        this.showGeofenceNotification();
                    }
                },
                (error) => {
                    console.log('Geolocation watch error:', error);
                },
                { enableHighAccuracy: true, timeout: 5000, maximumAge: 10000 }
            );
        }
    }

    // Implement biometric authentication
    implementBiometricAuth() {
        if ('credentials' in navigator && 'create' in navigator.credentials) {
            this.setupBiometricAuth();
        }
    }

    // Setup biometric authentication
    setupBiometricAuth() {
        // Check if WebAuthn is supported
        if ('PublicKeyCredential' in window) {
            this.addBiometricLogin();
        }
    }

    // Add biometric login
    addBiometricLogin() {
        const biometricButton = document.createElement('button');
        biometricButton.className = 'biometric-login-button';
        biometricButton.innerHTML = '🔐 Biyometrik Giriş';
        biometricButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 10000;
            background: linear-gradient(135deg, #dc2626, #ef4444);
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 25px;
            cursor: pointer;
            font-weight: 600;
            box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
            transition: all 0.3s ease;
        `;
        
        biometricButton.addEventListener('click', () => {
            this.authenticateBiometric();
        });
        
        document.body.appendChild(biometricButton);
    }

    // Authenticate biometric
    authenticateBiometric() {
        if ('credentials' in navigator) {
            navigator.credentials.get({
                publicKey: {
                    challenge: new Uint8Array(32),
                    allowCredentials: [],
                    userVerification: 'required'
                }
            }).then(credential => {
                console.log('Biometric authentication successful');
                this.showNotification('Biyometrik giriş başarılı!', 'success');
            }).catch(error => {
                console.log('Biometric authentication failed:', error);
                this.showNotification('Biyometrik giriş başarısız!', 'error');
            });
        }
    }

    // Add voice commands
    addVoiceCommands() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            this.setupVoiceCommands();
        }
    }

    // Setup voice commands
    setupVoiceCommands() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'tr-TR';
        
        this.recognition.onresult = (event) => {
            const command = event.results[0][0].transcript.toLowerCase();
            this.processVoiceCommand(command);
        };
        
        this.recognition.onerror = (event) => {
            console.log('Speech recognition error:', event.error);
        };
        
        this.addVoiceCommandButton();
    }

    // Add voice command button
    addVoiceCommandButton() {
        const voiceButton = document.createElement('button');
        voiceButton.className = 'voice-command-button';
        voiceButton.innerHTML = '🎤 Sesli Komut';
        voiceButton.style.cssText = `
            position: fixed;
            bottom: 80px;
            right: 20px;
            z-index: 10000;
            background: linear-gradient(135deg, #7c3aed, #a855f7);
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 25px;
            cursor: pointer;
            font-weight: 600;
            box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
            transition: all 0.3s ease;
        `;
        
        voiceButton.addEventListener('click', () => {
            this.startVoiceCommand();
        });
        
        document.body.appendChild(voiceButton);
    }

    // Start voice command
    startVoiceCommand() {
        if (this.recognition) {
            this.recognition.start();
            this.showNotification('Sesli komut dinleniyor...', 'info');
        }
    }

    // Process voice command
    processVoiceCommand(command) {
        if (command.includes('randevu') || command.includes('appointment')) {
            window.location.href = '/appointment';
        } else if (command.includes('fiyat') || command.includes('price')) {
            window.location.href = '/price-calculator';
        } else if (command.includes('iletişim') || command.includes('contact')) {
            window.location.href = '/contact';
        } else if (command.includes('hizmetler') || command.includes('services')) {
            window.location.href = '/services';
        } else if (command.includes('ana sayfa') || command.includes('home')) {
            window.location.href = '/';
        } else {
            this.showNotification('Komut anlaşılamadı: ' + command, 'warning');
        }
    }

    // Setup augmented reality
    setupAugmentedReality() {
        if ('xr' in navigator) {
            this.addARFeatures();
        }
    }

    // Add AR features
    addARFeatures() {
        const arButton = document.createElement('button');
        arButton.className = 'ar-button';
        arButton.innerHTML = '🥽 AR Görünüm';
        arButton.style.cssText = `
            position: fixed;
            bottom: 140px;
            right: 20px;
            z-index: 10000;
            background: linear-gradient(135deg, #059669, #10b981);
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 25px;
            cursor: pointer;
            font-weight: 600;
            box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3);
            transition: all 0.3s ease;
        `;
        
        arButton.addEventListener('click', () => {
            this.startAR();
        });
        
        document.body.appendChild(arButton);
    }

    // Start AR
    startAR() {
        if ('xr' in navigator) {
            navigator.xr.requestSession('immersive-ar').then(session => {
                console.log('AR session started');
                this.showNotification('AR görünüm başlatıldı!', 'success');
            }).catch(error => {
                console.log('AR session failed:', error);
                this.showNotification('AR görünüm başlatılamadı!', 'error');
            });
        }
    }

    // Implement machine learning
    implementMachineLearning() {
        if ('ml' in navigator) {
            this.setupMLFeatures();
        }
    }

    // Setup ML features
    setupMLFeatures() {
        this.addMLPredictions();
        this.addMLRecommendations();
    }

    // Add ML predictions
    addMLPredictions() {
        // Predict user behavior
        this.predictUserBehavior();
        
        // Predict service needs
        this.predictServiceNeeds();
    }

    // Predict user behavior
    predictUserBehavior() {
        const userData = {
            visitCount: parseInt(localStorage.getItem('visit_count') || '0'),
            lastVisit: localStorage.getItem('last_visit'),
            preferredServices: JSON.parse(localStorage.getItem('preferred_services') || '[]'),
            deviceType: this.isMobile ? 'mobile' : 'desktop'
        };
        
        // Simple ML prediction
        if (userData.visitCount > 3) {
            this.showMLRecommendation('Sık ziyaretçi indirimi!', 'info');
        }
    }

    // Predict service needs
    predictServiceNeeds() {
        const lastService = localStorage.getItem('last_service');
        if (lastService) {
            const serviceDate = new Date(lastService);
            const daysSinceService = (new Date() - serviceDate) / (1000 * 60 * 60 * 24);
            
            if (daysSinceService > 30) {
                this.showMLRecommendation('Servis zamanı geldi!', 'warning');
            }
        }
    }

    // Add ML recommendations
    addMLRecommendations() {
        // Personalized recommendations
        this.addPersonalizedRecommendations();
    }

    // Add personalized recommendations
    addPersonalizedRecommendations() {
        const recommendations = [
            'Size özel indirimler!',
            'Yeni hizmetlerimizi keşfedin!',
            'Müşteri memnuniyeti %100!',
            'Hızlı servis garantisi!'
        ];
        
        const randomRecommendation = recommendations[Math.floor(Math.random() * recommendations.length)];
        this.showMLRecommendation(randomRecommendation, 'info');
    }

    // Show ML recommendation
    showMLRecommendation(message, type) {
        const recommendation = document.createElement('div');
        recommendation.className = 'ml-recommendation';
        recommendation.innerHTML = `🤖 ${message}`;
        recommendation.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            z-index: 10000;
            background: ${type === 'success' ? '#059669' : type === 'warning' ? '#f59e0b' : '#0b5cff'};
            color: white;
            padding: 1rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            font-weight: 500;
            max-width: 300px;
        `;
        
        document.body.appendChild(recommendation);
        
        setTimeout(() => {
            recommendation.remove();
        }, 5000);
    }

    // Enhance mobile performance
    enhanceMobilePerformance() {
        this.implementLazyLoading();
        this.optimizeImages();
        this.implementCodeSplitting();
        this.setupServiceWorker();
        this.implementCacheStrategy();
    }

    // Implement lazy loading
    implementLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }

    // Optimize images
    optimizeImages() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            // Add loading="lazy" for mobile
            if (this.isMobile && !img.loading) {
                img.loading = 'lazy';
            }
            
            // Optimize image sizes for mobile
            if (this.isMobile && img.width > 400) {
                img.style.maxWidth = '100%';
                img.style.height = 'auto';
            }
        });
    }

    // Implement code splitting
    implementCodeSplitting() {
        // Dynamic imports for mobile
        if (this.isMobile) {
            this.loadMobileSpecificCode();
        }
    }

    // Load mobile specific code
    loadMobileSpecificCode() {
        // Load mobile-specific modules
        import('./mobile-specific.js').then(module => {
            module.init();
        }).catch(error => {
            console.log('Mobile specific module not found');
        });
    }

    // Setup service worker
    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').then(registration => {
                console.log('Advanced Service Worker registered');
            });
        }
    }

    // Implement cache strategy
    implementCacheStrategy() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.addEventListener('message', (event) => {
                if (event.data.type === 'CACHE_STRATEGY') {
                    this.updateCacheStrategy(event.data.strategy);
                }
            });
        }
    }

    // Update cache strategy
    updateCacheStrategy(strategy) {
        this.mobileFeatures.performance.cacheStrategy = strategy;
        console.log('Cache strategy updated:', strategy);
    }

    // Add advanced UX
    addAdvancedUX() {
        this.addHapticFeedback();
        this.implementGestureNavigation();
        this.addAdaptiveUI();
        this.implementDarkMode();
        this.enhanceAccessibility();
    }

    // Add haptic feedback
    addHapticFeedback() {
        if ('vibrate' in navigator) {
            this.addHapticTriggers();
        }
    }

    // Add haptic triggers
    addHapticTriggers() {
        const hapticElements = document.querySelectorAll('button, a, [data-haptic]');
        hapticElements.forEach(element => {
            element.addEventListener('touchstart', () => {
                navigator.vibrate(50); // Short vibration
            });
        });
    }

    // Implement gesture navigation
    implementGestureNavigation() {
        this.addSwipeGestures();
        this.addPinchGestures();
        this.addLongPressGestures();
    }

    // Add swipe gestures
    addSwipeGestures() {
        let startX, startY, endX, endY;
        
        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });
        
        document.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;
            
            const deltaX = endX - startX;
            const deltaY = endY - startY;
            
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                if (deltaX > 50) {
                    this.handleSwipeRight();
                } else if (deltaX < -50) {
                    this.handleSwipeLeft();
                }
            } else {
                if (deltaY > 50) {
                    this.handleSwipeDown();
                } else if (deltaY < -50) {
                    this.handleSwipeUp();
                }
            }
        });
    }

    // Handle swipe gestures
    handleSwipeRight() {
        console.log('Swipe right detected');
        // Navigate back
        window.history.back();
    }

    handleSwipeLeft() {
        console.log('Swipe left detected');
        // Navigate forward
        window.history.forward();
    }

    handleSwipeUp() {
        console.log('Swipe up detected');
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    handleSwipeDown() {
        console.log('Swipe down detected');
        // Scroll to bottom
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }

    // Add pinch gestures
    addPinchGestures() {
        let initialDistance = 0;
        
        document.addEventListener('touchstart', (e) => {
            if (e.touches.length === 2) {
                initialDistance = this.getDistance(e.touches[0], e.touches[1]);
            }
        });
        
        document.addEventListener('touchmove', (e) => {
            if (e.touches.length === 2) {
                const currentDistance = this.getDistance(e.touches[0], e.touches[1]);
                const scale = currentDistance / initialDistance;
                
                if (scale > 1.5) {
                    this.handlePinchZoom();
                } else if (scale < 0.5) {
                    this.handlePinchZoomOut();
                }
            }
        });
    }

    // Handle pinch gestures
    handlePinchZoom() {
        console.log('Pinch zoom detected');
        // Implement zoom functionality
    }

    handlePinchZoomOut() {
        console.log('Pinch zoom out detected');
        // Implement zoom out functionality
    }

    // Add long press gestures
    addLongPressGestures() {
        let pressTimer;
        
        document.addEventListener('touchstart', (e) => {
            pressTimer = setTimeout(() => {
                this.handleLongPress(e);
            }, 500);
        });
        
        document.addEventListener('touchend', () => {
            clearTimeout(pressTimer);
        });
        
        document.addEventListener('touchmove', () => {
            clearTimeout(pressTimer);
        });
    }

    // Handle long press
    handleLongPress(e) {
        console.log('Long press detected');
        // Show context menu or additional options
        this.showContextMenu(e);
    }

    // Show context menu
    showContextMenu(e) {
        const contextMenu = document.createElement('div');
        contextMenu.className = 'context-menu';
        contextMenu.innerHTML = `
            <div class="context-menu-item" data-action="share">Paylaş</div>
            <div class="context-menu-item" data-action="bookmark">Yer İmi</div>
            <div class="context-menu-item" data-action="copy">Kopyala</div>
        `;
        contextMenu.style.cssText = `
            position: fixed;
            top: ${e.touches[0].clientY}px;
            left: ${e.touches[0].clientX}px;
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            padding: 0.5rem;
        `;
        
        document.body.appendChild(contextMenu);
        
        // Remove context menu after 3 seconds
        setTimeout(() => {
            contextMenu.remove();
        }, 3000);
    }

    // Add adaptive UI
    addAdaptiveUI() {
        this.adaptToDevice();
        this.adaptToNetwork();
        this.adaptToUser();
    }

    // Adapt to device
    adaptToDevice() {
        if (this.isMobile) {
            document.body.classList.add('mobile-device');
        }
        
        if (this.deviceCapabilities.touch) {
            document.body.classList.add('touch-device');
        }
    }

    // Adapt to network
    adaptToNetwork() {
        if (this.networkInfo) {
            if (this.networkInfo.effectiveType === 'slow-2g' || this.networkInfo.effectiveType === '2g') {
                document.body.classList.add('slow-network');
                this.enableDataSavingMode();
            }
        }
    }

    // Enable data saving mode
    enableDataSavingMode() {
        // Reduce image quality
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.style.filter = 'blur(1px)';
        });
        
        // Disable animations
        document.body.classList.add('no-animations');
    }

    // Adapt to user
    adaptToUser() {
        const userPreferences = {
            theme: localStorage.getItem('theme') || 'light',
            language: localStorage.getItem('language') || 'tr',
            fontSize: localStorage.getItem('fontSize') || 'medium'
        };
        
        this.applyUserPreferences(userPreferences);
    }

    // Apply user preferences
    applyUserPreferences(preferences) {
        document.body.classList.add(`theme-${preferences.theme}`);
        document.body.classList.add(`font-${preferences.fontSize}`);
    }

    // Implement dark mode
    implementDarkMode() {
        this.addDarkModeToggle();
        this.detectSystemTheme();
    }

    // Add dark mode toggle
    addDarkModeToggle() {
        const darkModeToggle = document.createElement('button');
        darkModeToggle.className = 'dark-mode-toggle';
        darkModeToggle.innerHTML = '🌙';
        darkModeToggle.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            background: rgba(255, 255, 255, 0.9);
            border: 1px solid #e2e8f0;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            cursor: pointer;
            font-size: 1.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        `;
        
        darkModeToggle.addEventListener('click', () => {
            this.toggleDarkMode();
        });
        
        document.body.appendChild(darkModeToggle);
    }

    // Toggle dark mode
    toggleDarkMode() {
        const isDark = document.body.classList.contains('dark-mode');
        
        if (isDark) {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
        } else {
            document.body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
        }
    }

    // Detect system theme
    detectSystemTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
        }
    }

    // Enhance accessibility
    enhanceAccessibility() {
        this.addKeyboardNavigation();
        this.addScreenReaderSupport();
        this.addHighContrastMode();
        this.addFocusManagement();
    }

    // Add keyboard navigation
    addKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                this.handleTabNavigation(e);
            } else if (e.key === 'Enter') {
                this.handleEnterKey(e);
            } else if (e.key === 'Escape') {
                this.handleEscapeKey(e);
            }
        });
    }

    // Handle tab navigation
    handleTabNavigation(e) {
        const focusableElements = document.querySelectorAll('a, button, input, select, textarea, [tabindex]');
        const currentIndex = Array.from(focusableElements).indexOf(document.activeElement);
        
        if (e.shiftKey) {
            // Shift + Tab (backward)
            if (currentIndex > 0) {
                focusableElements[currentIndex - 1].focus();
            }
        } else {
            // Tab (forward)
            if (currentIndex < focusableElements.length - 1) {
                focusableElements[currentIndex + 1].focus();
            }
        }
    }

    // Handle enter key
    handleEnterKey(e) {
        if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A') {
            e.target.click();
        }
    }

    // Handle escape key
    handleEscapeKey(e) {
        // Close modals, menus, etc.
        const modals = document.querySelectorAll('.modal, .menu, .context-menu');
        modals.forEach(modal => modal.remove());
    }

    // Add screen reader support
    addScreenReaderSupport() {
        // Add ARIA labels
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (!button.getAttribute('aria-label')) {
                button.setAttribute('aria-label', button.textContent);
            }
        });
        
        // Add ARIA roles
        const navigation = document.querySelector('nav');
        if (navigation) {
            navigation.setAttribute('role', 'navigation');
        }
        
        const main = document.querySelector('main');
        if (main) {
            main.setAttribute('role', 'main');
        }
    }

    // Add high contrast mode
    addHighContrastMode() {
        if (window.matchMedia && window.matchMedia('(prefers-contrast: high)').matches) {
            document.body.classList.add('high-contrast');
        }
    }

    // Add focus management
    addFocusManagement() {
        // Add focus indicators
        const style = document.createElement('style');
        style.textContent = `
            .focus-visible {
                outline: 2px solid #0b5cff;
                outline-offset: 2px;
            }
        `;
        document.head.appendChild(style);
        
        // Add focus management for modals
        this.setupFocusManagement();
    }

    // Setup focus management
    setupFocusManagement() {
        // Trap focus in modals
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    this.trapFocus(modal, e);
                }
            });
        });
    }

    // Trap focus in modal
    trapFocus(modal, e) {
        const focusableElements = modal.querySelectorAll('a, button, input, select, textarea, [tabindex]');
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                lastElement.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastElement) {
                firstElement.focus();
                e.preventDefault();
            }
        }
    }

    // Utility functions
    urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/-/g, '+')
            .replace(/_/g, '/');
        
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    getDistance(touch1, touch2) {
        const dx = touch1.clientX - touch2.clientX;
        const dy = touch1.clientY - touch2.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = 'advanced-notification';
        notification.innerHTML = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            right: 20px;
            z-index: 10000;
            background: ${type === 'success' ? '#059669' : type === 'error' ? '#dc2626' : type === 'warning' ? '#f59e0b' : '#0b5cff'};
            color: white;
            padding: 1rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            font-weight: 500;
            text-align: center;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    trackEvent(eventName, data = {}) {
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, {
                event_category: 'Advanced Mobile',
                event_label: 'Mobile Enhancement',
                ...data
            });
        }
    }

    submitForm(formData) {
        // Submit form data to server
        fetch('/api/forms', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        }).then(response => {
            if (response.ok) {
                console.log('Form submitted successfully');
            }
        }).catch(error => {
            console.log('Form submission error:', error);
        });
    }

    sendAnalytics(data) {
        // Send analytics data to server
        if (typeof gtag !== 'undefined') {
            gtag('event', 'analytics', {
                event_category: 'Mobile Analytics',
                ...data
            });
        }
    }

    sendSubscriptionToServer(subscription) {
        // Send push subscription to server
        fetch('/api/push-subscription', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(subscription)
        }).then(response => {
            if (response.ok) {
                console.log('Push subscription sent to server');
            }
        }).catch(error => {
            console.log('Push subscription error:', error);
        });
    }

    sendUserPreferences(preferences) {
        // Send user preferences to server
        fetch('/api/user-preferences', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(preferences)
        }).then(response => {
            if (response.ok) {
                console.log('User preferences sent to server');
            }
        }).catch(error => {
            console.log('User preferences error:', error);
        });
    }

    // Get advanced mobile report
    getAdvancedMobileReport() {
        return {
            features: this.mobileFeatures,
            capabilities: this.deviceCapabilities,
            networkInfo: this.networkInfo,
            timestamp: new Date().toISOString()
        };
    }

    // Export advanced mobile report
    exportAdvancedMobileReport() {
        const report = this.getAdvancedMobileReport();
        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `advanced-mobile-report-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
    }
}

// Initialize Advanced Mobile Features when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.advancedMobileFeatures = new AdvancedMobileFeatures();
    
    // Add advanced mobile report button to page
    const advancedMobileButton = document.createElement('button');
    advancedMobileButton.innerHTML = '🚀 Gelişmiş Mobil';
    advancedMobileButton.style.cssText = `
        position: fixed; bottom: 20px; right: 200px; z-index: 10000;
        background: linear-gradient(135deg, #7c3aed, #a855f7);
        color: white; border: none; padding: 12px 20px;
        border-radius: 25px; cursor: pointer; font-weight: 600;
        box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
        transition: all 0.3s ease;
    `;
    advancedMobileButton.addEventListener('click', () => {
        window.advancedMobileFeatures.exportAdvancedMobileReport();
    });
    document.body.appendChild(advancedMobileButton);
    
    console.log('🚀 Advanced Mobile Features loaded successfully');
});

