// ========================================
// DC TEKNİK - Social Media Integration
// Version: v1.0.0 - ULTIMATE ENHANCEMENT
// ========================================

class SocialIntegration {
    constructor() {
        this.notifications = [];
        this.activities = [];
        this.init();
    }

    init() {
        this.createSocialButtons();
        this.createNotificationSystem();
        this.createActivityFeed();
        this.createShareButtons();
        this.startLiveUpdates();
    }

    createSocialButtons() {
        const socialContainer = document.createElement('div');
        socialContainer.className = 'social-integration';

        const socialLinks = [
            {
                platform: 'facebook',
                url: 'https://www.facebook.com/DinamocuSerdar',
                icon: 'fab fa-facebook-f',
                tooltip: 'Facebook Sayfamızı Takip Edin'
            },
            {
                platform: 'instagram',
                url: 'https://www.instagram.com/dcteknik',
                icon: 'fab fa-instagram',
                tooltip: 'Instagram\'da Bizi Takip Edin'
            },
            {
                platform: 'youtube',
                url: 'https://www.youtube.com/@dcteknik',
                icon: 'fab fa-youtube',
                tooltip: 'YouTube Kanalımızı İzleyin'
            },
            {
                platform: 'tiktok',
                url: 'https://www.tiktok.com/@dcteknik',
                icon: 'fab fa-tiktok',
                tooltip: 'TikTok\'ta Bizi Takip Edin'
            },
            {
                platform: 'linkedin',
                url: 'https://www.linkedin.com/company/dcteknik',
                icon: 'fab fa-linkedin-in',
                tooltip: 'LinkedIn\'de Bağlantı Kurun'
            },
            {
                platform: 'twitter',
                url: 'https://twitter.com/dcteknik',
                icon: 'fab fa-twitter',
                tooltip: 'Twitter\'da Bizi Takip Edin'
            }
        ];

        socialLinks.forEach(link => {
            const btn = document.createElement('a');
            btn.className = `social-btn ${link.platform}`;
            btn.href = link.url;
            btn.target = '_blank';
            btn.rel = 'noopener noreferrer';
            btn.innerHTML = `
                <i class="${link.icon}"></i>
                <span class="social-tooltip">${link.tooltip}</span>
            `;
            
            btn.addEventListener('click', () => {
                this.trackSocialClick(link.platform);
            });

            socialContainer.appendChild(btn);
        });

        document.body.appendChild(socialContainer);
    }

    createNotificationSystem() {
        const notificationContainer = document.createElement('div');
        notificationContainer.className = 'live-notifications';
        notificationContainer.id = 'notificationContainer';
        document.body.appendChild(notificationContainer);

        // Show welcome notification
        setTimeout(() => {
            this.showNotification({
                type: 'success',
                title: 'Hoş Geldiniz!',
                message: 'DC TEKNİK\'e hoş geldiniz. Size nasıl yardımcı olabiliriz?'
            });
        }, 2000);
    }

    createActivityFeed() {
        const activityContainer = document.createElement('div');
        activityContainer.className = 'live-activity';
        activityContainer.id = 'activityFeed';
        
        activityContainer.innerHTML = `
            <div class="activity-header">
                <div class="activity-title">
                    <span class="live-indicator"></span>
                    Canlı Aktiviteler
                </div>
                <button class="activity-close" onclick="socialIntegration.toggleActivity()">&times;</button>
            </div>
            <div class="activity-list" id="activityList">
                <!-- Activities will be inserted here -->
            </div>
        `;

        document.body.appendChild(activityContainer);

        // Show activity feed after 5 seconds
        setTimeout(() => {
            this.showActivityFeed();
        }, 5000);
    }

    createShareButtons() {
        const shareContainer = document.createElement('div');
        shareContainer.className = 'social-share';

        const shareButtons = [
            {
                platform: 'whatsapp',
                icon: 'fab fa-whatsapp',
                action: () => this.shareToWhatsApp()
            },
            {
                platform: 'facebook',
                icon: 'fab fa-facebook-f',
                action: () => this.shareToFacebook()
            },
            {
                platform: 'twitter',
                icon: 'fab fa-twitter',
                action: () => this.shareToTwitter()
            },
            {
                platform: 'linkedin',
                icon: 'fab fa-linkedin-in',
                action: () => this.shareToLinkedIn()
            }
        ];

        shareButtons.forEach(btn => {
            const shareBtn = document.createElement('button');
            shareBtn.className = `share-btn ${btn.platform}`;
            shareBtn.innerHTML = `<i class="${btn.icon}"></i>`;
            shareBtn.addEventListener('click', btn.action);
            shareContainer.appendChild(shareBtn);
        });

        document.body.appendChild(shareContainer);
    }

    showNotification(notification) {
        const container = document.getElementById('notificationContainer');
        if (!container) return;

        const notificationEl = document.createElement('div');
        notificationEl.className = `notification ${notification.type}`;
        
        const iconMap = {
            success: 'fas fa-check',
            warning: 'fas fa-exclamation-triangle',
            error: 'fas fa-times',
            info: 'fas fa-info'
        };

        notificationEl.innerHTML = `
            <div class="notification-header">
                <div class="notification-icon">
                    <i class="${iconMap[notification.type] || iconMap.info}"></i>
                </div>
                <div class="notification-title">${notification.title}</div>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
            </div>
            <div class="notification-message">${notification.message}</div>
        `;

        container.appendChild(notificationEl);

        // Show notification
        setTimeout(() => {
            notificationEl.classList.add('show');
        }, 100);

        // Auto remove after 5 seconds
        setTimeout(() => {
            notificationEl.classList.remove('show');
            setTimeout(() => {
                if (notificationEl.parentNode) {
                    notificationEl.remove();
                }
            }, 400);
        }, 5000);

        // Track notification
        this.trackEvent('notification_shown', {
            type: notification.type,
            title: notification.title
        });
    }

    showActivityFeed() {
        const activityFeed = document.getElementById('activityFeed');
        if (activityFeed) {
            activityFeed.classList.add('show');
        }
    }

    toggleActivity() {
        const activityFeed = document.getElementById('activityFeed');
        if (activityFeed) {
            activityFeed.classList.toggle('show');
        }
    }

    addActivity(activity) {
        const activityList = document.getElementById('activityList');
        if (!activityList) return;

        const activityEl = document.createElement('div');
        activityEl.className = 'activity-item slide-in-up';
        
        const initials = activity.user.split(' ').map(name => name[0]).join('').toUpperCase();
        
        activityEl.innerHTML = `
            <div class="activity-avatar">${initials}</div>
            <div class="activity-content">
                <div class="activity-text">${activity.text}</div>
                <div class="activity-time">${this.getTimeAgo(activity.timestamp)}</div>
            </div>
        `;

        activityList.insertBefore(activityEl, activityList.firstChild);

        // Keep only last 10 activities
        const activities = activityList.querySelectorAll('.activity-item');
        if (activities.length > 10) {
            activities[activities.length - 1].remove();
        }

        // Track activity
        this.trackEvent('activity_added', {
            type: activity.type,
            user: activity.user
        });
    }

    startLiveUpdates() {
        // Simulate live activities
        const activities = [
            {
                user: 'Ahmet Yılmaz',
                text: 'Dinamo tamiri için randevu aldı',
                type: 'appointment',
                timestamp: Date.now() - 300000
            },
            {
                user: 'Fatma Demir',
                text: 'Alternatör servisi tamamlandı',
                type: 'service_completed',
                timestamp: Date.now() - 600000
            },
            {
                user: 'Mehmet Kaya',
                text: 'Marş motoru tamiri için aradı',
                type: 'phone_call',
                timestamp: Date.now() - 900000
            },
            {
                user: 'Ayşe Özkan',
                text: 'WhatsApp üzerinden bilgi aldı',
                type: 'whatsapp',
                timestamp: Date.now() - 1200000
            }
        ];

        // Add initial activities
        activities.forEach(activity => {
            this.addActivity(activity);
        });

        // Add new activities periodically
        setInterval(() => {
            const newActivities = [
                {
                    user: 'Can Yıldız',
                    text: 'Dinamo fiyatı hakkında bilgi aldı',
                    type: 'inquiry',
                    timestamp: Date.now()
                },
                {
                    user: 'Zeynep Arslan',
                    text: 'Alternatör tamiri için randevu aldı',
                    type: 'appointment',
                    timestamp: Date.now()
                },
                {
                    user: 'Burak Çelik',
                    text: 'Marş motoru servisi tamamlandı',
                    type: 'service_completed',
                    timestamp: Date.now()
                }
            ];

            const randomActivity = newActivities[Math.floor(Math.random() * newActivities.length)];
            this.addActivity(randomActivity);
        }, 30000); // Every 30 seconds

        // Show periodic notifications
        setInterval(() => {
            const notifications = [
                {
                    type: 'info',
                    title: 'Yeni Müşteri Yorumu',
                    message: 'Harika hizmet! Kesinlikle tavsiye ederim. ⭐⭐⭐⭐⭐'
                },
                {
                    type: 'success',
                    title: 'Servis Tamamlandı',
                    message: 'Dinamo tamiri başarıyla tamamlandı. Müşteri memnun!'
                },
                {
                    type: 'info',
                    title: 'Yeni Randevu',
                    message: 'Yarın saat 14:00\'te alternatör servisi randevusu var.'
                }
            ];

            const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
            this.showNotification(randomNotification);
        }, 60000); // Every minute
    }

    shareToWhatsApp() {
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent('DC TEKNİK - Sultanbeyli\'nin güvenilir dinamocu servisi. Dinamo, alternatör ve marş motoru tamiri.');
        window.open(`https://wa.me/?text=${text} ${url}`, '_blank');
        this.trackEvent('share', { platform: 'whatsapp' });
    }

    shareToFacebook() {
        const url = encodeURIComponent(window.location.href);
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
        this.trackEvent('share', { platform: 'facebook' });
    }

    shareToTwitter() {
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent('DC TEKNİK - Sultanbeyli\'nin güvenilir dinamocu servisi');
        window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
        this.trackEvent('share', { platform: 'twitter' });
    }

    shareToLinkedIn() {
        const url = encodeURIComponent(window.location.href);
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
        this.trackEvent('share', { platform: 'linkedin' });
    }

    trackSocialClick(platform) {
        this.trackEvent('social_click', { platform });
    }

    trackEvent(eventName, parameters = {}) {
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, {
                event_category: 'social_integration',
                ...parameters
            });
        }
        console.log(`📊 Event tracked: ${eventName}`, parameters);
    }

    getTimeAgo(timestamp) {
        const now = Date.now();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Az önce';
        if (minutes < 60) return `${minutes} dakika önce`;
        if (hours < 24) return `${hours} saat önce`;
        return `${days} gün önce`;
    }
}

// Initialize social integration when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.socialIntegration = new SocialIntegration();
    
    // Add CSS for social integration
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'social-integration.css?v=20250115v1';
    document.head.appendChild(link);
    
    console.log('📱 Social Integration initialized successfully!');
});

// Export for potential external use
window.SocialIntegration = SocialIntegration;
