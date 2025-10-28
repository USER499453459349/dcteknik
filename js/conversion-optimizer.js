/**
 * DC TEKNİK - Conversion Optimization
 * A/B testing, smart CTAs, exit-intent, trust badges
 */

(function() {
    'use strict';

    const ConversionOptimizer = {
        abTests: {},
        ctaVariants: {},
        exitIntentShown: false,
        scrollThreshold: 50,
        
        init() {
            this.initABTesting();
            this.initSmartCTAs();
            this.initExitIntent();
            this.initTrustBadges();
            this.initSocialProof();
            this.initUrgencyElements();
            this.initScrollBasedTriggers();
            
            const safeLog = window.safeLog || console.log;
            safeLog('🎯 Conversion Optimizer initialized');
        },
        
        /**
         * A/B Testing Framework
         */
        initABTesting() {
            // Define A/B tests
            this.abTests = {
                ctaButtonColor: {
                    variantA: 'btn-primary', // Default (orange)
                    variantB: 'btn-success', // Green
                    variantC: 'btn-warning', // Yellow
                    activeVariant: null,
                    conversions: { A: 0, B: 0, C: 0 },
                    impressions: { A: 0, B: 0, C: 0 }
                },
                ctaButtonText: {
                    variantA: 'Hemen Ara',
                    variantB: 'Ücretsiz Bilgi Al',
                    variantC: 'Şimdi Arayın',
                    activeVariant: null,
                    conversions: { A: 0, B: 0, C: 0 },
                    impressions: { A: 0, B: 0, C: 0 }
                }
            };
            
            // Initialize tests
            Object.keys(this.abTests).forEach(testName => {
                this.initABTest(testName);
            });
        },
        
        /**
         * Initialize A/B Test
         */
        initABTest(testName) {
            const test = this.abTests[testName];
            
            // Get stored variant or assign new one
            let variant = localStorage.getItem(`ab_test_${testName}`);
            if (!variant || !test.variantA || !test.variantB) {
                // Assign variant (A, B, or C)
                const variants = ['A', 'B'];
                if (test.variantC) variants.push('C');
                variant = variants[Math.floor(Math.random() * variants.length)];
                localStorage.setItem(`ab_test_${testName}`, variant);
            }
            
            test.activeVariant = variant;
            
            // Apply variant
            this.applyABTestVariant(testName, variant);
            
            // Track impression
            test.impressions[variant] = (test.impressions[variant] || 0) + 1;
            this.saveABTestData(testName);
            
            // Track in analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'ab_test_impression', {
                    test_name: testName,
                    variant: variant
                });
            }
        },
        
        /**
         * Apply A/B Test Variant
         */
        applyABTestVariant(testName, variant) {
            const test = this.abTests[testName];
            const variantValue = test[`variant${variant}`];
            
            if (testName === 'ctaButtonColor') {
                // Change button colors
                document.querySelectorAll('.hero-buttons .btn-primary').forEach(btn => {
                    btn.classList.remove('btn-primary');
                    btn.classList.add(variantValue);
                });
            } else if (testName === 'ctaButtonText') {
                // Change button text
                document.querySelectorAll('.hero-buttons .btn span').forEach(span => {
                    if (span.textContent.includes('Hemen Ara')) {
                        span.textContent = variantValue;
                    }
                });
            }
        },
        
        /**
         * Track A/B Test Conversion
         */
        trackABTestConversion(testName, element) {
            const test = this.abTests[testName];
            if (!test || !test.activeVariant) return;
            
            const variant = test.activeVariant;
            test.conversions[variant] = (test.conversions[variant] || 0) + 1;
            
            this.saveABTestData(testName);
            
            // Track in analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'ab_test_conversion', {
                    test_name: testName,
                    variant: variant,
                    conversion_type: 'click'
                });
            }
        },
        
        /**
         * Save A/B Test Data
         */
        saveABTestData(testName) {
            try {
                localStorage.setItem(`ab_test_data_${testName}`, 
                    JSON.stringify(this.abTests[testName]));
            } catch (e) {
                // Storage error
            }
        },
        
        /**
         * Smart CTAs
         * Scroll-based, time-based CTA visibility
         */
        initSmartCTAs() {
            // Scroll-based CTAs
            window.addEventListener('scroll', () => {
                const scrollPercent = (window.scrollY / 
                    (document.documentElement.scrollHeight - window.innerHeight)) * 100;
                
                // Show sticky CTA after 50% scroll
                if (scrollPercent > this.scrollThreshold) {
                    this.showSmartCTA();
                } else {
                    this.hideSmartCTA();
                }
            }, { passive: true });
            
            // Time-based CTA (show after 30 seconds)
            setTimeout(() => {
                if (document.querySelector('.smart-cta')) {
                    this.showSmartCTA();
                }
            }, 30000);
        },
        
        /**
         * Show Smart CTA
         */
        showSmartCTA() {
            let smartCTA = document.querySelector('.smart-cta');
            
            if (!smartCTA) {
                smartCTA = this.createSmartCTA();
                document.body.appendChild(smartCTA);
            }
            
            smartCTA.classList.add('visible');
        },
        
        /**
         * Hide Smart CTA
         */
        hideSmartCTA() {
            const smartCTA = document.querySelector('.smart-cta');
            if (smartCTA) {
                smartCTA.classList.remove('visible');
            }
        },
        
        /**
         * Create Smart CTA
         */
        createSmartCTA() {
            const cta = document.createElement('div');
            cta.className = 'smart-cta';
            cta.innerHTML = `
                <div class="smart-cta-content">
                    <h4>Hızlı İletişim</h4>
                    <p>Size yardımcı olmak için buradayız</p>
                    <div class="smart-cta-buttons">
                        <a href="tel:+905353562469" class="btn btn-primary btn-sm">
                            <i class="fas fa-phone"></i> Ara
                        </a>
                        <a href="https://wa.me/905353562469" class="btn btn-whatsapp btn-sm" target="_blank">
                            <i class="fab fa-whatsapp"></i> WhatsApp
                        </a>
                    </div>
                    <button class="smart-cta-close" aria-label="Kapat">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
            
            // Close button
            cta.querySelector('.smart-cta-close').addEventListener('click', () => {
                this.hideSmartCTA();
                // Don't show again this session
                sessionStorage.setItem('smart_cta_dismissed', 'true');
            });
            
            return cta;
        },
        
        /**
         * Exit-Intent Popup
         */
        initExitIntent() {
            // Only show once per session
            if (sessionStorage.getItem('exit_intent_shown') === 'true') return;
            
            // Track mouse movement
            document.addEventListener('mouseleave', (e) => {
                if (e.clientY <= 0) {
                    this.showExitIntent();
                }
            });
        },
        
        /**
         * Show Exit Intent Popup
         */
        showExitIntent() {
            if (this.exitIntentShown) return;
            this.exitIntentShown = true;
            sessionStorage.setItem('exit_intent_shown', 'true');
            
            const popup = document.createElement('div');
            popup.className = 'exit-intent-popup';
            popup.innerHTML = `
                <div class="exit-intent-content">
                    <button class="exit-intent-close" aria-label="Kapat">
                        <i class="fas fa-times"></i>
                    </button>
                    <h3>Bekleyin! Özel Teklif</h3>
                    <p>İlk kez gelen müşterilere <strong>%20 indirim</strong></p>
                    <p class="exit-intent-small">Hemen iletişime geçin, indirim kazanın!</p>
                    <div class="exit-intent-buttons">
                        <a href="tel:+905353562469" class="btn btn-primary">
                            <i class="fas fa-phone"></i> Hemen Ara
                        </a>
                        <a href="https://wa.me/905353562469" class="btn btn-whatsapp" target="_blank">
                            <i class="fab fa-whatsapp"></i> WhatsApp
                        </a>
                    </div>
                    <p class="exit-intent-urgency">⏰ Teklif sınırlı süre!</p>
                </div>
            `;
            
            document.body.appendChild(popup);
            
            // Show animation
            setTimeout(() => {
                popup.classList.add('visible');
            }, 100);
            
            // Close button
            popup.querySelector('.exit-intent-close').addEventListener('click', () => {
                popup.classList.remove('visible');
                setTimeout(() => popup.remove(), 300);
            });
            
            // Close on outside click
            popup.addEventListener('click', (e) => {
                if (e.target === popup) {
                    popup.classList.remove('visible');
                    setTimeout(() => popup.remove(), 300);
                }
            });
            
            // Track in analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'exit_intent_shown', {
                    event_category: 'Conversion',
                    event_label: 'exit_intent'
                });
            }
        },
        
        /**
         * Trust Badges
         */
        initTrustBadges() {
            // Add trust badges to hero section
            const hero = document.querySelector('.hero');
            if (!hero || document.querySelector('.trust-badges-container')) return;
            
            const badgesContainer = document.createElement('div');
            badgesContainer.className = 'trust-badges-container';
            badgesContainer.innerHTML = `
                <div class="trust-badge">
                    <i class="fas fa-shield-alt"></i>
                    <span>%100 Garanti</span>
                </div>
                <div class="trust-badge">
                    <i class="fas fa-certificate"></i>
                    <span>15+ Yıl Deneyim</span>
                </div>
                <div class="trust-badge">
                    <i class="fas fa-users"></i>
                    <span>5000+ Mutlu Müşteri</span>
                </div>
                <div class="trust-badge">
                    <i class="fas fa-star"></i>
                    <span>4.9/5 Puan</span>
                </div>
            `;
            
            const heroButtons = hero.querySelector('.hero-buttons');
            if (heroButtons) {
                heroButtons.parentNode.insertBefore(badgesContainer, heroButtons.nextSibling);
            }
        },
        
        /**
         * Social Proof
         */
        initSocialProof() {
            // Show recent activity notifications
            this.showRecentActivity();
            
            // Live visitor count (simulated)
            this.showLiveVisitors();
        },
        
        /**
         * Show Recent Activity
         */
        showRecentActivity() {
            // Simulate recent activity
            const activities = [
                'Ahmet Y. az önce arama yaptı',
                'Mehmet D. dinamo tamiri için form doldurdu',
                'Ayşe K. WhatsApp ile iletişime geçti'
            ];
            
            // Show activity notification randomly
            if (Math.random() > 0.7) {
                setTimeout(() => {
                    this.showActivityNotification(
                        activities[Math.floor(Math.random() * activities.length)]
                    );
                }, 5000 + Math.random() * 10000);
            }
        },
        
        /**
         * Show Activity Notification
         */
        showActivityNotification(message) {
            const notification = document.createElement('div');
            notification.className = 'activity-notification';
            notification.innerHTML = `
                <i class="fas fa-user-circle"></i>
                <span>${message}</span>
            `;
            
            document.body.appendChild(notification);
            
            // Show animation
            setTimeout(() => {
                notification.classList.add('visible');
            }, 100);
            
            // Hide after 5 seconds
            setTimeout(() => {
                notification.classList.remove('visible');
                setTimeout(() => notification.remove(), 300);
            }, 5000);
        },
        
        /**
         * Show Live Visitors
         */
        showLiveVisitors() {
            // Simulated live visitor count
            const visitorCount = 3 + Math.floor(Math.random() * 5);
            
            const visitorWidget = document.createElement('div');
            visitorWidget.className = 'live-visitors';
            visitorWidget.innerHTML = `
                <i class="fas fa-users"></i>
                <span>${visitorCount} kişi şu anda bu sayfada</span>
            `;
            
            // Add to hero or header
            const hero = document.querySelector('.hero');
            if (hero) {
                hero.appendChild(visitorWidget);
            }
        },
        
        /**
         * Urgency Elements
         */
        initUrgencyElements() {
            // Countdown timer (optional)
            // Limited time offer
            // Stock availability
            
            // Add urgency to CTAs
            const ctas = document.querySelectorAll('.btn-primary, .btn-whatsapp');
            ctas.forEach(cta => {
                if (!cta.querySelector('.urgency-badge')) {
                    const badge = document.createElement('span');
                    badge.className = 'urgency-badge';
                    badge.textContent = 'Hemen';
                    cta.appendChild(badge);
                }
            });
        },
        
        /**
         * Scroll-Based Triggers
         */
        initScrollBasedTriggers() {
            // Show CTA at specific scroll points
            let scrollTriggers = [30, 60, 90];
            let triggered = new Set();
            
            window.addEventListener('scroll', () => {
                const scrollPercent = Math.round(
                    (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
                );
                
                scrollTriggers.forEach(trigger => {
                    if (scrollPercent >= trigger && !triggered.has(trigger)) {
                        triggered.add(trigger);
                        this.onScrollTrigger(trigger);
                    }
                });
            }, { passive: true });
        },
        
        /**
         * On Scroll Trigger
         */
        onScrollTrigger(scrollPercent) {
            // Show smart CTA or notification
            if (scrollPercent === 90) {
                this.showSmartCTA();
            }
            
            // Track in analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'scroll_trigger', {
                    scroll_percent: scrollPercent,
                    event_category: 'Engagement'
                });
            }
        },
        
        /**
         * Get Conversion Rate
         */
        getConversionRate() {
            // Calculate from A/B test data
            const results = {};
            
            Object.keys(this.abTests).forEach(testName => {
                const test = this.abTests[testName];
                Object.keys(test.conversions).forEach(variant => {
                    const impressions = test.impressions[variant] || 1;
                    const conversions = test.conversions[variant] || 0;
                    const rate = ((conversions / impressions) * 100).toFixed(2);
                    
                    if (!results[testName]) results[testName] = {};
                    results[testName][variant] = {
                        rate: rate + '%',
                        conversions: conversions,
                        impressions: impressions
                    };
                });
            });
            
            return results;
        }
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => ConversionOptimizer.init());
    } else {
        ConversionOptimizer.init();
    }

    // Export globally
    window.ConversionOptimizer = ConversionOptimizer;
})();

