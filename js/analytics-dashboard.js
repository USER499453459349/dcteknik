/**
 * DC TEKNİK - Analytics Dashboard
 * Real-time analytics tracking ve visualization
 */

(function() {
    'use strict';

    const AnalyticsDashboard = {
        events: [],
        sessionStart: Date.now(),
        pageViews: 1,
        conversions: 0,
        calls: 0,
        whatsappClicks: 0,
        formsSubmitted: 0,
        
        init() {
            this.initEventTracking();
            this.initSessionTracking();
            this.initConversionTracking();
            this.initTrafficSourceTracking();
            this.initDeviceTracking();
            this.initTimeTracking();
            this.initScrollTracking();
            this.initEngagementTracking();
            
            // Export dashboard
            this.createDashboardLink();
            
            const safeLog = window.safeLog || console.log;
            safeLog('📊 Analytics Dashboard initialized');
        },
        
        /**
         * Initialize Event Tracking
         */
        initEventTracking() {
            // Track custom events
            document.addEventListener('click', (e) => {
                this.trackClick(e.target);
            }, true);
            
            // Track form submissions
            document.querySelectorAll('form').forEach(form => {
                form.addEventListener('submit', () => {
                    this.trackFormSubmission(form);
                });
            });
            
            // Track phone calls
            document.querySelectorAll('a[href^="tel:"]').forEach(link => {
                link.addEventListener('click', () => {
                    this.trackPhoneCall(link);
                });
            });
            
            // Track WhatsApp clicks
            document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
                link.addEventListener('click', () => {
                    this.trackWhatsAppClick(link);
                });
            });
        },
        
        /**
         * Track Click Events
         */
        trackClick(element) {
            // Only track meaningful clicks
            const tagName = element.tagName;
            const className = element.className || '';
            const id = element.id || '';
            
            // Track CTA clicks
            if (className.includes('btn') || className.includes('cta') || 
                tagName === 'BUTTON' || tagName === 'A') {
                
                const eventData = {
                    type: 'click',
                    element: tagName,
                    className: className,
                    id: id,
                    text: element.textContent?.trim().substring(0, 50) || '',
                    timestamp: Date.now(),
                    page: window.location.pathname
                };
                
                this.recordEvent('button_click', eventData);
            }
        },
        
        /**
         * Session Tracking
         */
        initSessionTracking() {
            // Get or create session ID
            let sessionId = sessionStorage.getItem('analytics_session_id');
            if (!sessionId) {
                sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
                sessionStorage.setItem('analytics_session_id', sessionId);
                
                // Track session start
                this.recordEvent('session_start', {
                    sessionId: sessionId,
                    referrer: document.referrer,
                    userAgent: navigator.userAgent,
                    timestamp: Date.now()
                });
            }
            
            // Track page view
            this.trackPageView();
            
            // Track session end
            window.addEventListener('beforeunload', () => {
                this.trackSessionEnd(sessionId);
            });
        },
        
        /**
         * Track Page View
         */
        trackPageView() {
            this.pageViews++;
            
            const pageData = {
                page: window.location.pathname,
                title: document.title,
                referrer: document.referrer,
                timestamp: Date.now(),
                sessionDuration: Date.now() - this.sessionStart
            };
            
            this.recordEvent('page_view', pageData);
            
            // Send to GA4
            if (typeof gtag !== 'undefined') {
                gtag('event', 'page_view', {
                    page_path: window.location.pathname,
                    page_title: document.title
                });
            }
        },
        
        /**
         * Conversion Tracking
         */
        initConversionTracking() {
            // Forms
            document.querySelectorAll('form').forEach(form => {
                form.addEventListener('submit', () => {
                    this.conversions++;
                    this.formsSubmitted++;
                    
                    this.recordEvent('conversion', {
                        type: 'form_submission',
                        formId: form.id || 'unknown',
                        timestamp: Date.now()
                    });
                });
            });
            
            // Phone calls
            document.querySelectorAll('a[href^="tel:"]').forEach(link => {
                link.addEventListener('click', () => {
                    this.conversions++;
                    this.calls++;
                    
                    this.recordEvent('conversion', {
                        type: 'phone_call',
                        phone: link.getAttribute('href'),
                        timestamp: Date.now()
                    });
                });
            });
            
            // WhatsApp
            document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
                link.addEventListener('click', () => {
                    this.conversions++;
                    this.whatsappClicks++;
                    
                    this.recordEvent('conversion', {
                        type: 'whatsapp_click',
                        whatsapp: link.getAttribute('href'),
                        timestamp: Date.now()
                    });
                });
            });
        },
        
        /**
         * Traffic Source Tracking
         */
        initTrafficSourceTracking() {
            const referrer = document.referrer;
            const urlParams = new URLSearchParams(window.location.search);
            const utmSource = urlParams.get('utm_source');
            const utmMedium = urlParams.get('utm_medium');
            const utmCampaign = urlParams.get('utm_campaign');
            
            let source = 'direct';
            let medium = 'none';
            let campaign = 'none';
            
            // Determine source
            if (utmSource) {
                source = utmSource;
                medium = utmMedium || 'campaign';
                campaign = utmCampaign || 'none';
            } else if (referrer) {
                try {
                    const referrerUrl = new URL(referrer);
                    source = referrerUrl.hostname;
                    
                    if (source.includes('google')) {
                        medium = 'organic';
                    } else if (source.includes('facebook') || source.includes('instagram')) {
                        medium = 'social';
                    } else {
                        medium = 'referral';
                    }
                } catch (e) {
                    source = referrer;
                    medium = 'referral';
                }
            }
            
            // Store traffic source
            sessionStorage.setItem('traffic_source', source);
            sessionStorage.setItem('traffic_medium', medium);
            sessionStorage.setItem('traffic_campaign', campaign);
            
            this.recordEvent('traffic_source', {
                source: source,
                medium: medium,
                campaign: campaign,
                referrer: referrer,
                timestamp: Date.now()
            });
        },
        
        /**
         * Device Tracking
         */
        initDeviceTracking() {
            const deviceInfo = {
                isMobile: window.MobileEnhancements?.isMobile || /mobile/i.test(navigator.userAgent),
                isTablet: window.MobileEnhancements?.isTablet || /tablet/i.test(navigator.userAgent),
                screenWidth: window.screen.width,
                screenHeight: window.screen.height,
                viewportWidth: window.innerWidth,
                viewportHeight: window.innerHeight,
                userAgent: navigator.userAgent,
                platform: navigator.platform,
                language: navigator.language,
                timestamp: Date.now()
            };
            
            this.recordEvent('device_info', deviceInfo);
        },
        
        /**
         * Time Tracking
         */
        initTimeTracking() {
            // Track time on page
            let timeOnPage = 0;
            const startTime = Date.now();
            
            setInterval(() => {
                timeOnPage = Math.floor((Date.now() - startTime) / 1000);
            }, 1000);
            
            // Track on page unload
            window.addEventListener('beforeunload', () => {
                this.recordEvent('time_on_page', {
                    seconds: timeOnPage,
                    page: window.location.pathname,
                    timestamp: Date.now()
                });
            });
        },
        
        /**
         * Scroll Tracking
         */
        initScrollTracking() {
            let maxScroll = 0;
            let scrollMilestones = [25, 50, 75, 100];
            let reachedMilestones = new Set();
            
            window.addEventListener('scroll', () => {
                const scrollPercent = Math.round(
                    (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
                );
                
                maxScroll = Math.max(maxScroll, scrollPercent);
                
                // Track milestones
                scrollMilestones.forEach(milestone => {
                    if (scrollPercent >= milestone && !reachedMilestones.has(milestone)) {
                        reachedMilestones.add(milestone);
                        this.recordEvent('scroll_milestone', {
                            milestone: milestone,
                            page: window.location.pathname,
                            timestamp: Date.now()
                        });
                    }
                });
            }, { passive: true });
            
            // Track max scroll on unload
            window.addEventListener('beforeunload', () => {
                this.recordEvent('max_scroll', {
                    maxScroll: maxScroll,
                    page: window.location.pathname,
                    timestamp: Date.now()
                });
            });
        },
        
        /**
         * Engagement Tracking
         */
        initEngagementTracking() {
            let interactionCount = 0;
            let lastInteraction = Date.now();
            
            // Track interactions
            ['click', 'scroll', 'keydown', 'touchstart'].forEach(eventType => {
                document.addEventListener(eventType, () => {
                    interactionCount++;
                    lastInteraction = Date.now();
                }, { passive: true });
            });
            
            // Track engagement level
            setInterval(() => {
                const timeSinceLastInteraction = Date.now() - lastInteraction;
                const engagementLevel = interactionCount > 10 ? 'high' : 
                                      interactionCount > 5 ? 'medium' : 'low';
                
                this.recordEvent('engagement', {
                    interactionCount: interactionCount,
                    engagementLevel: engagementLevel,
                    timeSinceLastInteraction: timeSinceLastInteraction,
                    timestamp: Date.now()
                });
            }, 30000); // Every 30 seconds
        },
        
        /**
         * Record Event
         */
        recordEvent(eventType, data) {
            const event = {
                type: eventType,
                data: data,
                timestamp: Date.now(),
                sessionId: sessionStorage.getItem('analytics_session_id'),
                page: window.location.pathname
            };
            
            this.events.push(event);
            
            // Keep only last 100 events in memory
            if (this.events.length > 100) {
                this.events.shift();
            }
            
            // Store in localStorage for dashboard
            this.saveToStorage(event);
        },
        
        /**
         * Save to Storage
         */
        saveToStorage(event) {
            try {
                const stored = JSON.parse(localStorage.getItem('analytics_events') || '[]');
                stored.push(event);
                
                // Keep last 500 events
                if (stored.length > 500) {
                    stored.splice(0, stored.length - 500);
                }
                
                localStorage.setItem('analytics_events', JSON.stringify(stored));
            } catch (e) {
                // Storage full or error - continue silently
            }
        },
        
        /**
         * Track Form Submission
         */
        trackFormSubmission(form) {
            this.formsSubmitted++;
            this.conversions++;
            
            // This will be called by actual form submission handler
        },
        
        /**
         * Track Phone Call
         */
        trackPhoneCall(link) {
            this.calls++;
            this.conversions++;
            
            const phone = link.getAttribute('href') || '';
            
            this.recordEvent('phone_call', {
                phone: phone,
                location: link.className.includes('sticky') ? 'sticky' : 'button',
                timestamp: Date.now()
            });
        },
        
        /**
         * Track WhatsApp Click
         */
        trackWhatsAppClick(link) {
            this.whatsappClicks++;
            this.conversions++;
            
            const whatsapp = link.getAttribute('href') || '';
            
            this.recordEvent('whatsapp_click', {
                whatsapp: whatsapp,
                location: link.className.includes('sticky') ? 'sticky' : 'button',
                timestamp: Date.now()
            });
        },
        
        /**
         * Track Session End
         */
        trackSessionEnd(sessionId) {
            const sessionDuration = Date.now() - this.sessionStart;
            
            this.recordEvent('session_end', {
                sessionId: sessionId,
                duration: sessionDuration,
                pageViews: this.pageViews,
                conversions: this.conversions,
                calls: this.calls,
                whatsappClicks: this.whatsappClicks,
                formsSubmitted: this.formsSubmitted,
                timestamp: Date.now()
            });
            
            // Send final session data
            if (typeof gtag !== 'undefined') {
                gtag('event', 'session_end', {
                    session_duration: Math.floor(sessionDuration / 1000),
                    page_views: this.pageViews,
                    conversions: this.conversions
                });
            }
        },
        
        /**
         * Create Dashboard Link
         */
        createDashboardLink() {
            // Add dashboard link in development mode or as admin feature
            if (window.location.hostname === 'localhost' || 
                window.location.search.includes('admin=true')) {
                
                const dashboardLink = document.createElement('a');
                dashboardLink.href = '/analytics-dashboard.html';
                dashboardLink.className = 'analytics-dashboard-link';
                dashboardLink.style.cssText = `
                    position: fixed;
                    bottom: 1rem;
                    left: 1rem;
                    background: #667eea;
                    color: white;
                    padding: 0.75rem 1rem;
                    border-radius: 8px;
                    text-decoration: none;
                    font-size: 0.875rem;
                    z-index: 9999;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                `;
                dashboardLink.textContent = '📊 Analytics';
                document.body.appendChild(dashboardLink);
            }
        },
        
        /**
         * Get Analytics Summary
         */
        getSummary() {
            const stored = JSON.parse(localStorage.getItem('analytics_events') || '[]');
            
            const summary = {
                totalEvents: stored.length,
                pageViews: this.pageViews,
                conversions: this.conversions,
                calls: this.calls,
                whatsappClicks: this.whatsappClicks,
                formsSubmitted: this.formsSubmitted,
                conversionRate: this.pageViews > 0 ? 
                    ((this.conversions / this.pageViews) * 100).toFixed(2) + '%' : '0%',
                sessionDuration: Date.now() - this.sessionStart,
                trafficSource: sessionStorage.getItem('traffic_source') || 'direct',
                trafficMedium: sessionStorage.getItem('traffic_medium') || 'none'
            };
            
            return summary;
        },
        
        /**
         * Export Data
         */
        exportData() {
            const data = {
                summary: this.getSummary(),
                events: JSON.parse(localStorage.getItem('analytics_events') || '[]'),
                timestamp: Date.now()
            };
            
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `analytics_${Date.now()}.json`;
            a.click();
            URL.revokeObjectURL(url);
        }
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => AnalyticsDashboard.init());
    } else {
        AnalyticsDashboard.init();
    }

    // Export globally
    window.AnalyticsDashboard = AnalyticsDashboard;
})();

